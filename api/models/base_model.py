from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseLLM(ABC):
    @abstractmethod
    async def generate_completion(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate a completion from the model"""
        pass

    @abstractmethod
    def get_cost_per_token(self) -> float:
        """Return the cost per token for this model"""
        pass

    @abstractmethod
    def get_max_context_length(self) -> int:
        """Return the maximum context length for this model"""
        pass 