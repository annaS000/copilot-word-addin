from typing import Dict, Any, Optional
import openai
from .base_model import BaseLLM

class OpenAILLM(BaseLLM):
    def __init__(self, api_key: str, model_name: str = "gpt-3.5-turbo"):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model_name = model_name
        self._cost_per_token = {
            "gpt-3.5-turbo": 0.000002,  # $0.002 per 1K tokens
            "gpt-4": 0.00003,          # $0.03 per 1K tokens
        }
        self._max_context = {
            "gpt-3.5-turbo": 4096,
            "gpt-4": 8192,
        }

    async def generate_completion(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            **kwargs
        )
        return {
            "text": response.choices[0].message.content,
            "usage": response.usage,
            "model": self.model_name
        }

    def get_cost_per_token(self) -> float:
        return self._cost_per_token.get(self.model_name, 0.000002)

    def get_max_context_length(self) -> int:
        return self._max_context.get(self.model_name, 4096) 