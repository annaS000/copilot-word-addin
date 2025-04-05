# Copilot Word Add-in API

This is the API layer for the Copilot Word Add-in, providing a flexible interface to multiple LLM providers.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Running the API

```bash
python api/app.py
```

The API will be available at `http://localhost:5000`

## API Usage

### Generate Completion

```bash
curl -X POST http://localhost:5000/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model_name": "gpt-3.5-turbo",
    "prompt": "What is the capital of France?",
    "temperature": 0.7
  }'
```

## Supported Providers

- OpenAI (GPT-3.5-turbo, GPT-4)
- Anthropic (Claude-2, Claude-instant)

## Cost Information

- GPT-3.5-turbo: $0.002 per 1K tokens
- GPT-4: $0.03 per 1K tokens
- Claude-2: $0.008 per 1K tokens
- Claude-instant: $0.002 per 1K tokens 