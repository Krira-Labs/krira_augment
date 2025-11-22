"""
Check if data exists in Pinecone - NO FILTER VERSION
"""
import requests

# Get bot config
response = requests.post(
    "https://rag-backend-k46a.onrender.com/api/keys/verify",
    json={
        "apiKey": "sk-live-8789469c7926d2ce74376d822cb2a98c2c7514660068e33f9aae4432",
        "botId": "employee3"
    },
    headers={
        "Content-Type": "application/json",
        "x-service-key": "krira-shared-service-key"
    }
)

if response.status_code != 200:
    print(f"Failed to get bot config: {response.text}")
    exit(1)

bot_config = response.json()['bot']
embedding = bot_config['embedding']
pinecone_config = embedding['pineconeConfig']

print("="*80)
print("PINECONE CONFIGURATION")
print("="*80)
print(f"Index: {pinecone_config['indexName']}")
print(f"Namespace: {pinecone_config.get('namespace', '(default)')}")
print(f"Expected Dataset IDs: {embedding['datasetIds']}")
print()

# Try to connect to Pinecone
try:
    from pinecone import Pinecone
    
    pc = Pinecone(api_key=pinecone_config['apiKey'])
    index = pc.Index(pinecone_config['indexName'])
    
    # Try a test query WITHOUT FILTER
    print("\n" + "="*80)
    print("TESTING QUERY (NO FILTER)")
    print("="*80)
    
    # Use 512 dimension vector since we know that's what the index is
    dummy_vector = [0.1] * 512 
    
    query_params = {
        "vector": dummy_vector,
        "top_k": 5,
        "include_metadata": True
    }
    
    namespace = pinecone_config.get('namespace', '')
    if namespace:
        query_params['namespace'] = namespace
    
    results = index.query(**query_params)
    matches = results.get('matches', [])
    
    print(f"Query returned: {len(matches)} results")
    
    if matches:
        print("\n✓ DATA EXISTS IN PINECONE!")
        print("\nSample data found:")
        for i, match in enumerate(matches[:3], 1):
            metadata = match.get('metadata', {})
            text = metadata.get('chunk_text', '')[:50]
            dataset_id = metadata.get('dataset_id', 'UNKNOWN')
            print(f"  {i}. Dataset: {dataset_id}")
            print(f"     Text: {text}...")
            
            if dataset_id not in embedding['datasetIds']:
                print(f"     ⚠️ MISMATCH: This dataset ID is not in your bot config!")
        
    else:
        print("\n❌ NO DATA FOUND IN PINECONE (Even without filter)!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
