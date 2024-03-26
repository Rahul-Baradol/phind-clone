from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

import os

load_dotenv(".env.local")

client = QdrantClient(
   url=os.getenv("URL"), 
   api_key=os.getenv("API_KEY")
)

encoder = SentenceTransformer("all-MiniLM-L6-v2")

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
def read_item(prompt: Prompt):
   query = prompt.prompt

   # collection_info = client.get_collection(collection_name="Demo")
   # print(collection_info.points_count)

   # Example query
   query = {
      "query_vector": [0.1, 0.2, 0.3],  # Example vector for similarity search
      "top": 5,  # Number of results to return
   }

   # Send the query
   response = client.search(query)

   # Process the response
   if response["status"] == "ok":
      results = response["result"]
      for result in results:
         print(result)
   else:
      print("Error:", response["message"])

   return {
      "status": "success"
   }