import dspy
import pandas as pd
from pydantic import BaseModel, Field
from fastapi import FastAPI, UploadFile, File, Form
from dotenv import load_dotenv
load_dotenv()
from typing import Literal, Tuple
from dspy.teleprompt import BootstrapFewShotWithRandomSearch
import json
import weave

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

# Create the LLM Judge class
class LLMJudge:
    def __init__(self, model='gpt-4o', trainset=None):
        self.lm = dspy.OpenAI(model=model)
        dspy.settings.configure(lm=self.lm)
        self.predictor = dspy.TypedPredictor(LLMJudgeSignature)
        
        if trainset:
            self.optimize(trainset)

    def rate_answer(self, question: str, answer: str) -> Tuple[str, str]:
        input_data = Input(question=question, answer=answer)
        prediction = self.predictor(input=input_data)
        return prediction.output.rating, prediction.output.feedback

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

async def apply_dspy(file: UploadFile = File(...), data: str = Form(...)):
    weave.init("weave_dspy_demo")
    # Parse the data string into a dictionary
    data_dict = json.loads(data)
    
    # Read and process the uploaded file (assuming it's a CSV)
    df = pd.read_csv(file.file)
    
    # Initialize LLMJudge with the optimization parameters
    llm_judge = LLMJudge(model='gpt-4o')
    
    # Prepare the trainset for optimization
    trainset = [
        dspy.Example(
            input=Input(question=row['question'], answer=row['answer']),
            human_rating=row['human_rating']
        ).with_inputs('input')
        for _, row in df.iterrows()
    ]
    
    # Optimize the LLMJudge
    llm_judge.optimize(trainset, data_dict)

    # Extract unique prompts from the LLM's history
    list_unique_prompts = list(set(llm_judge.lm.history[i]['prompt'] for i in range(len(llm_judge.lm.history))))
    
    # Create the results list
    results = [{"text": prompt} for prompt in list_unique_prompts]
    
    return results