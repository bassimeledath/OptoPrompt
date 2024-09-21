import dspy
import os
import httpx
from pydantic import BaseModel, Field
from typing import Literal


# Define input and output models
class Input(BaseModel):
    question: str = Field(description="The question to be answered")
    answer: str = Field(description="The answer provided for the question")


class Output(BaseModel):
    rating: Literal["Excellent", "Bad", "Could be Improved", "Acceptable"] = Field(
        description="The LLM's rating of the answer"
    )
    feedback: str = Field(description="Feedback explaining the rating")


# Define the signature for the LLM judge
class LLMJudgeSignature(dspy.Signature):
    """Rate the quality of the answer based on the question provided and give feedback."""

    input: Input = dspy.InputField()
    output: Output = dspy.OutputField()


class OpenRouterLM(dspy.OpenAI):
    def __init__(self, model="openai/gpt-4o", api_key=None):
        super().__init__(model)
        self.model = model  # Set the model attribute
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:3000",  # Replace with your actual URL
            "X-Title": "LLMJudge",  # Replace with your app name
        }

    def basic_request(self, prompt, **kwargs):
        messages = [{"role": "user", "content": prompt}]
        data = {"model": self.model, "messages": messages, **kwargs}
        response = httpx.post(self.base_url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()


class LLMJudge:
    def __init__(self, model="openai/gpt-4o", trainset=None):
        self.lm = OpenRouterLM(model=model)
        print("about to configure")
        dspy.settings.configure(lm=self.lm)
        print("configured")
        self.predictor = dspy.TypedPredictor(LLMJudgeSignature)

        if trainset:
            print("reached here")
            self.optimize(trainset)

    def basic_request(self, prompt):
        return self.lm.basic_request(prompt)


if __name__ == "__main__":
    llm_judge = LLMJudge()
    response = llm_judge.basic_request("Say this is a test")
    print(response["choices"][0]["message"]["content"])
