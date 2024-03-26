import openai
import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')
qdrant_cloud_endpoint = os.getenv('QDRANT_CLOUD_ENDPOINT')
qdrant_api_key = os.getenv('QDRANT_API_KEY')

# Initialize the OpenAI client
openai.api_key = openai_api_key

# Initialize the Qdrant client with your hosted Qdrant instance details
qdrant_client = QdrantClient(qdrant_cloud_endpoint, api_key=qdrant_api_key)

def get_openai_embedding(text_data):
    """
    Generate embeddings for the text data using OpenAI's embedding API.
    
    Parameters:
    - text_data (str): The text data to generate embeddings for.
    
    Returns:
    - embedding (list): The generated embedding for the text data.
    """
    # Generate embeddings for the text data using OpenAI's embedding API
    response = openai.Embedding.create(
        input=[text_data], # Pass text_data as a list containing one string
        model="text-embedding-ada-002" # Use text-embedding-ada-002 model
    )
    # Extract the embedding from the response
    embedding = response["data"][0]["embedding"]
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

    




# Example usage
query_string = "heart"
results = search_in_qdrant(query_string)
for i, result in enumerate(results[:2]):
    print(f"Result {i+1}:")
    print(result)
    print()
