from typing import Dict, Any, Optional
from openai import AsyncOpenAI
import httpx
from .base_model import BaseLLM

class OpenAILLM(BaseLLM):
    def __init__(self, api_key: str, model_name: str = "gpt-3.5-turbo"):
        # Initialize the client with just the API key and a custom httpx client
        self.api_key = api_key
        self.model_name = model_name
        self._cost_per_token = {
            "gpt-3.5-turbo": 0.000002,  # $0.002 per 1K tokens
            "gpt-4": 0.00003,          # $0.03 per 1K tokens
            "gpt-4o": 0.00003          # $0.03 per 1K tokens
        }
        self._max_context = {
            "gpt-3.5-turbo": 4096,
            "gpt-4": 8192,
            "gpt-4o": 8192
        }

    async def generate_completion(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        # Create the messages list
        messages = [{"role": "user", "content": prompt}]
        
        # Prepare the parameters
        params = {
            "model": self.model_name,
            "messages": messages,
        }
        
        # Add optional parameters if provided
        if max_tokens is not None:
            params["max_tokens"] = max_tokens
        if temperature is not None:
            params["temperature"] = temperature
            
        # Add any additional kwargs
        params.update(kwargs)
        
        # Create a new client for each request
        async with httpx.AsyncClient() as http_client:
            # Create the OpenAI client with the custom httpx client
            client = AsyncOpenAI(
                api_key=self.api_key,
                http_client=http_client
            )
            
            # Make the API call
            response = await client.chat.completions.create(**params)
            
            # Convert the response to a serializable format
            return {
                "text": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                },
                "model": self.model_name
            }

    def get_cost_per_token(self) -> float:
        return self._cost_per_token.get(self.model_name, 0.000002)

    def get_max_context_length(self) -> int:
        return self._max_context.get(self.model_name, 4096) 