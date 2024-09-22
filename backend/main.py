from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from apply_dspy import apply_dspy

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize")
async def optimize(file: UploadFile = File(...), data: str = Form(...)):
    print("Optimize endpoint reached")
    
    # Call apply_dspy function
    results, call_id = await apply_dspy(file, data)
    print(f"call_id: {call_id}")
    
    return {"results": results, "call_id": call_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
