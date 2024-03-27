from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv
import pymongo

import os
load_dotenv(".env.local")

encoder = SentenceTransformer("all-MiniLM-L6-v2")

class Prompt(BaseModel):
   prompt: str

app = FastAPI()

openai_api_key = os.getenv('OPENAI_API_KEY')
qdrant_cloud_endpoint = os.getenv('QDRANT_CLOUD_ENDPOINT')
qdrant_api_key = os.getenv('QDRANT_API_KEY')
mongodbURI = os.getenv("MONGODB_URI")

mongo_client = pymongo.MongoClient(mongodbURI)

openAI_Client = OpenAI(
  api_key=openai_api_key
)

qdrant_client = QdrantClient(
   url=qdrant_cloud_endpoint,
   api_key=qdrant_api_key
)

db = mongo_client["phindClone"]
conversations = db["conversations"]

# Enable CORS
app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_methods=["*"],
   allow_headers=["*"],
)

def get_openai_embedding(text_data):
    """
    Generate embeddings for the text data using OpenAI's embedding API.
    
    Parameters:
    - text_data (str): The text data to generate embeddings for.
    
    Returns:
    - embedding (list): The generated embedding for the text data.
    """
    # Generate embeddings for the text data using OpenAI's embedding API
    response = openAI_Client.embeddings.create(
        input=[text_data], # Pass text_data as a list containing one string
        model="text-embedding-ada-002" # Use text-embedding-ada-002 model
    )
    # Extract the embedding from the response
   #  embedding = response["data"][0]["embedding"] 
    embedding = response.data[0].embedding
    return embedding

def search_in_qdrant(query_string):
    # Step 1: Embed the string using the provided get_openai_embedding function
    embedding = get_openai_embedding(query_string)
    
    # Define the collection name
    collection_name = "Demo"
    
    # Step 2: Connect to the hosted Qdrant client
    # This step is handled by initializing the QdrantClient above with your hosted Qdrant instance details
    
    # Step 3: Search in Qdrant with the updated parameters
    search_results = qdrant_client.search(
        collection_name=collection_name,
        query_vector=embedding,
        with_vectors=True,
        with_payload=True,
    )
    return search_results
    # print(json.loads(search_results))

@app.get("/")
def read_root():
   return {"status": "alive"}

@app.post("/prompt/")
def read_item(prompt: Prompt):
   query = prompt.prompt

   results = search_in_qdrant(query)

   requiredData = []
   for ele in results:
      requiredData.append(ele.payload)

   count_of_documents = conversations.estimated_document_count()

   conversations.update_one({
      "_id": count_of_documents,
   }, {
      "$set": {
         "query": query,
         "response": requiredData
      }
   }, upsert=True)  

   return {
      "status": "success",
      "response": requiredData
   }