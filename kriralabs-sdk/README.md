# Krira Augment SDK

Official Python SDK for building integrations with Krira Augment RAG pipelines.

## Installation

```bash
pip install krira-augment-sdk
```

## Quick Start

```python
from krira_augment import KriraAugment

# Initialize the client with your API key and pipeline name
client = KriraAugment(api_key="sk-live-your-key", pipeline_name="employees")

# Ask a question to your RAG pipeline
response = client.ask("What can you help me with?")
print(response.answer)

# With conversation context
response = client.ask(
    "Tell me more about that",
    conversation_id="my-session-123"
)
print(response.answer)
```

## API Reference

### KriraAugment

The main client class for interacting with Krira Augment pipelines.

#### Constructor

```python
KriraAugment(
    *,
    api_key: str,           # Your Krira Augment API key
    pipeline_name: str,     # Name or ID of your RAG pipeline
    base_url: str = None,   # Optional custom API base URL
    timeout: float = 15.0,  # Request timeout in seconds
)
```

#### Methods

##### `ask(question, *, conversation_id=None, metadata=None, timeout=None)`

Send a question to your RAG pipeline and receive an answer.

**Parameters:**
- `question` (str): The question to ask
- `conversation_id` (str, optional): Session ID for conversation context
- `metadata` (dict, optional): Additional metadata to pass
- `timeout` (float, optional): Override the default timeout

**Returns:** `ChatResponse` object with:
- `answer` (str): The model's response
- `pipeline_name` (str): The pipeline used
- `conversation_id` (str, optional): The conversation ID
- `raw` (dict): Raw API response

##### `close()`

Close the underlying HTTP session.

## Error Handling

```python
from krira_augment import KriraAugment
from krira_augment.exceptions import (
    AuthenticationError,
    PermissionDeniedError,
    RateLimitError,
    ServerError,
)

client = KriraAugment(api_key="sk-live-your-key", pipeline_name="employees")

try:
    response = client.ask("What is the status of my order?")
    print(response.answer)
except AuthenticationError:
    print("Invalid API key")
except PermissionDeniedError:
    print("API key doesn't have access to this pipeline")
except RateLimitError:
    print("Too many requests, slow down")
except ServerError:
    print("Krira Augment service is temporarily unavailable")
```

## Aliases

For convenience, additional class aliases are available:

```python
from krira_augment import KriraPipeline, KriraAugmentClient

# These are equivalent to KriraAugment
client = KriraPipeline(api_key="...", pipeline_name="...")
client = KriraAugmentClient(api_key="...", pipeline_name="...")
```

## Requirements

- Python 3.9+
- requests >= 2.31.0

## License

MIT
