from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from pydantic import BaseModel
import random
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizationInput(BaseModel):
    maxBootstrappedDemos: int
    maxLabeledDemos: int
    numCandidatePrograms: int

@app.post("/optimize")
async def optimize(file: UploadFile = File(...), data: str = Form(...)):
    print("Optimize endpoint reached")
    print("Received data:", data)
    print("Received file:", file)
    
    # Sleep for 5 seconds
    await asyncio.sleep(5)
    
    # Generate dummy results
    dummy_results = [
        {
            "text": "Optimized result 1: This is a sample optimization output.",
            "score": round(random.uniform(0.7, 0.99), 2),
            "complexity": random.randint(1, 10)
        },
        {
            "text": "Optimized result 2: Another example of optimized content.",
            "score": round(random.uniform(0.7, 0.99), 2),
            "complexity": random.randint(1, 10)
        },
        {
            "text": "Optimized result 3: Final dummy optimization result.",
            "score": round(random.uniform(0.7, 0.99), 2),
            "complexity": random.randint(1, 10)
        }
    ]
    
    return {"results": dummy_results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
