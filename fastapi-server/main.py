from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

class Prompt(BaseModel):
   prompt: str

app = FastAPI()

# Enable CORS
app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_methods=["*"],
   allow_headers=["*"],
)

@app.get("/")
def read_root():
   return {"status": "alive"}

@app.post("/prompt/")
async def read_item(prompt: Prompt):
   prompt = prompt.prompt
   print(prompt)
   return {
      "status": "success"
   }