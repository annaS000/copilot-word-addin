import asyncio
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
        # Import OpenAI here to avoid any potential issues
        from openai import AsyncOpenAI
        
        # Initialize the client with minimal parameters
        client = AsyncOpenAI(api_key=api_key)
        
        # Make a simple API call
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, how are you?"}]
        )
        
        # Print the response
        print("Response:", response.choices[0].message.content)
        
    except Exception as e:
        print("Error:", str(e))
        import traceback
        traceback.print_exc()

# Run the test
if __name__ == "__main__":
    asyncio.run(test_openai()) 