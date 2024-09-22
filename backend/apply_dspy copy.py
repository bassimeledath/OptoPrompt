import dspy
import pandas as pd
from pydantic import BaseModel, Field
from fastapi import UploadFile, File, Form
import os
from dotenv import load_dotenv
load_dotenv()
from typing import Literal, Tuple
from dspy.teleprompt import BootstrapFewShotWithRandomSearch
import weave
import json

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
class LLMJudge(dspy.Module):
    def __init__(self, model='gpt-4o'):
        super().__init__()
        self.lm = dspy.OpenAI(model=model)
        dspy.settings.configure(lm=self.lm)
        self.predictor = dspy.ChainOfThought(LLMJudgeSignature)

    def forward(self, input: Input) -> Tuple[str, str]:
        prediction = self.predictor(input=input.model_dump())
        return prediction.output.rating, prediction.output.feedback

# @weave.op()
def validate_rating(example, pred, trace=None):
    return float(example.human_rating == pred.output.rating)

def process_dataframe(df, llm_judge):
    df[['llm_rating', 'llm_feedback']] = df.apply(lambda row: llm_judge(Input(question=row['question'], answer=row['answer'])), axis=1, result_type='expand')
    return df

async def apply_dspy(file: UploadFile = File(...), data: str = Form(...)):
    # Read and process the uploaded file (assuming it's a CSV)
    # weave.init("dspy-weave-demo")

    df = pd.read_csv(file.file)
    
    # Initialize LLMJudge
    llm_judge = LLMJudge(model='gpt-4o')
    
    # Prepare the trainset for optimization
    trainset = [
        dspy.Example(
            input=Input(question=row['question'], answer=row['answer']),
            human_rating=row['human_rating']
        ).with_inputs('input')
        for _, row in df.iterrows()
    ]
    
    # Parse the JSON string into a dictionary
    data_dict = json.loads(data)
    
    # Configure and run the teleprompter
    config = dict(
        max_bootstrapped_demos=int(data_dict["maxBootstrappedDemos"]),
        max_labeled_demos=int(data_dict["maxLabeledDemos"]),
        num_candidate_programs=int(data_dict["numCandidatePrograms"]),
        num_threads=4
    )
    
    teleprompter = BootstrapFewShotWithRandomSearch(metric=validate_rating, **config)
    compiled_judge = teleprompter.compile(llm_judge, trainset=trainset)
    
    # Extract unique prompts from the LLM's history
    list_unique_prompts = list(set(compiled_judge.lm.history[i]['prompt'] for i in range(len(compiled_judge.lm.history))))
    
    # Create the results list
    results = [{"text": prompt} for prompt in list_unique_prompts]
    
    return results