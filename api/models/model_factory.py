from typing import Dict, Type
from .base_model import BaseLLM
from .openai_model import OpenAILLM
from .anthropic_model import AnthropicLLM

class ModelFactory:
    _models: Dict[str, Type[BaseLLM]] = {
        "openai": OpenAILLM,
        "anthropic": AnthropicLLM,
    }

    @classmethod
    def get_model(cls, provider: str, api_key: str, model_name: str) -> BaseLLM:
        if provider not in cls._models:
            raise ValueError(f"Unknown provider: {provider}")
        
        model_class = cls._models[provider]
        return model_class(api_key=api_key, model_name=model_name) 