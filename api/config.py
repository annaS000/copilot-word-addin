import os
from dotenv import load_dotenv
try:
    from key import OPENAI_API_KEY
except ImportError:
    OPENAI_API_KEY = None

load_dotenv()

class Config:
    OPENAI_API_KEY = OPENAI_API_KEY or os.getenv('OPENAI_API_KEY')
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    
    @staticmethod
    def validate():
        if not Config.OPENAI_API_KEY:
            raise ValueError("OpenAI API key is not set. Please set it in .env file or key.py")
        return True 