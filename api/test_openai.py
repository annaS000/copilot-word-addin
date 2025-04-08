import asyncio
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    print("OpenAI API key not found in environment variables")
    exit(1)

async def test_openai():
    try:
        # Initialize the client
        client = AsyncOpenAI(api_key=api_key)
        
        # Make a simple API call
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, how are you?"}],
            temperature=0.7
        )
        
        # Print the response
        print("Response:", response.choices[0].message.content)
        
    except Exception as e:
        print("Error:", str(e))

# Run the test
if __name__ == "__main__":
    asyncio.run(test_openai()) 