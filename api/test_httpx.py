import asyncio
import httpx

async def test_httpx():
    try:
        # Initialize the client with minimal parameters
        async with httpx.AsyncClient() as client:
            # Make a simple request
            response = await client.get('https://api.github.com')
            print("Status code:", response.status_code)
            print("Response:", response.text[:100])
    except Exception as e:
        print("Error:", str(e))
        import traceback
        traceback.print_exc()

# Run the test
if __name__ == "__main__":
    asyncio.run(test_httpx()) 