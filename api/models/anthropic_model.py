from typing import Dict, Any, Optional
import anthropic
from .base_model import BaseLLM

class AnthropicLLM(BaseLLM):
    def __init__(self, api_key: str, model_name: str = "claude-2"):
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.model_name = model_name
        self._cost_per_token = {
            "claude-2": 0.000008,    # $0.008 per 1K tokens
            "claude-instant": 0.000002  # $0.002 per 1K tokens
        }
        self._max_context = {
            "claude-2": 100000,
            "claude-instant": 100000
        }

    async def generate_completion(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[{"role": "user", "content": prompt}],
            **kwargs
        )
        return {
            "text": response.content[0].text,
            "usage": response.usage,
            "model": self.model_name
        }

    def get_cost_per_token(self) -> float:
        return self._cost_per_token.get(self.model_name, 0.000008)

    def get_max_context_length(self) -> int:
        return self._max_context.get(self.model_name, 100000) 