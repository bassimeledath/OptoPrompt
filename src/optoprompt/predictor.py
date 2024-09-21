import dspy


class MyTaskSignature(dspy.Signature):
    """Your task description."""

    input_field = dspy.InputField(desc="Description of the input")
    output_field = dspy.OutputField(desc="Description of the expected output")


predictor = dspy.Predict(MyTaskSignature)
