import dspy
import pandas as pd
import os
from pydantic import BaseModel, Field
from fastapi import FastAPI, UploadFile, File, Form
from dotenv import load_dotenv
load_dotenv()
from typing import Literal, Tuple
from dspy.teleprompt import BootstrapFewShotWithRandomSearch
import json
import requests
from dsp import LM
from ratelimit import limits
import weave

# Initialize Weave at the module level
weave.init(project_name="weave_dspy_demo")

# Define input and output models
class Input(BaseModel):
    question: str = Field(description="The question to be answered")
    answer: str = Field(description="The answer provided for the question")

class Output(BaseModel):
    rating: Literal['Excellent', 'Bad', 'Could be Improved', 'Acceptable'] = Field(description="The LLM's rating of the answer")
    feedback: str = Field(description="Feedback explaining the rating")

# Define the signature for the LLM judge
class LLMJudgeSignature(dspy.Signature):
    """Rate the quality of the answer based on the question provided and give feedback."""

    input: Input = dspy.InputField()
    output: Output = dspy.OutputField()

RL_CALLS=10_000
RL_PERIOD_SECONDS=60

class OpenRouterClient(LM):
    def __init__(self, api_key=None, base_url="https://openrouter.ai/api/v1", model="gpt-4o", extra_headers=None, **kwargs):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        self.base_url = base_url
        self.model = model
        self.extra_headers = extra_headers or {}
        self.history = []
        self.provider = "openai"
        self.kwargs = {'temperature': 0.0,
            'max_tokens': 1024,
            'top_p': 1,
            'frequency_penalty': 0,
            'presence_penalty': 0,
            'n': 1}
        self.kwargs.update(kwargs)

    def _get_choice_text(choice):
        return choice["message"]["content"]

    def _get_headers(self):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        headers.update(self.extra_headers)
        return headers

    @weave.op()
    @limits(calls=RL_CALLS, period=RL_PERIOD_SECONDS)
    def basic_request(self, prompt: str, **kwargs):
        headers = self._get_headers()
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            **kwargs
        }

        response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=data)
        response_data = response.json()
        print(response_data)

        self.history.append({
            "prompt": prompt,
            "response": response_data,
            "kwargs": kwargs,
        })

        return response_data

    def __call__(self, prompt, **kwargs):
        req_kwargs = self.kwargs

        if kwargs:
            req_kwargs.update(kwargs)

        response_data = self.basic_request(prompt, **req_kwargs)
        completions = [choice["message"]["content"] for choice in response_data.get("choices", [])]
        return completions

# Create the LLM Judge class
class LLMJudge:
    def __init__(self, model='gpt-4o-mini'):
        self.lm = OpenRouterClient(model=model)
        dspy.settings.configure(lm=self.lm)
        self.predictor = dspy.TypedPredictor(LLMJudgeSignature)

    @weave.op()
    def rate_answer(self, question: str, answer: str) -> Tuple[str, str]:
        input_data = Input(question=question, answer=answer)
        prediction = self.predictor(input=input_data)
        return prediction.output.rating, prediction.output.feedback

    @weave.op()
    def optimize(self, trainset, data):
        @weave.op()
        def metric(example, pred, trace=None):
            return float(example.human_rating == pred.output.rating)

        config = dict(
            max_bootstrapped_demos=int(data["maxBootstrappedDemos"]),
            max_labeled_demos=int(data["maxLabeledDemos"]),
            num_candidate_programs=int(data["numCandidatePrograms"]),
            num_threads=4
        )

        teleprompter = BootstrapFewShotWithRandomSearch(metric=metric, **config)
        self.predictor = teleprompter.compile(self.predictor, trainset=trainset)

        # Retrieve the current call ID
        current_call = weave.require_current_call()
        call_id = current_call.id
        return call_id

async def apply_dspy(file: UploadFile = File(...), data: str = Form(...)):
    # Parse the data string into a dictionary
    data_dict = json.loads(data)
    
    # Read and process the uploaded file (assuming it's a CSV)
    df = pd.read_csv(file.file)
    
    # Prepare the trainset for optimization
    trainset = [
        dspy.Example(
            input=Input(question=row['question'], answer=row['answer']),
            human_rating=row['human_rating']
        ).with_inputs('input')
        for _, row in df.iterrows()
    ]
    
    # Initialize LLMJudge with the optimization parameters
    llm_judge = LLMJudge(model='gpt-4o-mini')
    
    # Optimize the LLMJudge and retrieve the call ID
    call_id = llm_judge.optimize(trainset, data_dict)
    
    # Extract unique prompts from the LLM's history
    list_unique_prompts = list(set(llm_judge.lm.history[i]['prompt'] for i in range(len(llm_judge.lm.history))))
    
    # Create the results list
    results = [{"text": prompt} for prompt in list_unique_prompts]
    
    return results, call_id
