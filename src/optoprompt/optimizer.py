import dspy
from dspy.teleprompt import BootstrapFewShotWithRandomSearch


def optimize_predictor(predictor, trainset, metric):
    config = {
        "max_bootstrapped_demos": 1,
        "max_labeled_demos": 1,
        "num_candidate_programs": 10,
        "num_threads": 1,
    }
    optimizer = BootstrapFewShotWithRandomSearch(metric=metric, **config)
    optimized_predictor = optimizer.compile(predictor, trainset=trainset)
    return optimized_predictor
