from flask import Blueprint, request, jsonify
from models.model_factory import ModelFactory
import os

llm_bp = Blueprint('llm', __name__)

@llm_bp.route('/generate', methods=['POST'])
async def generate():
    data = request.json
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Get API key from environment variables
    api_key = os.getenv(f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        response = await model.generate_completion(
            prompt=prompt,
            max_tokens=data.get('max_tokens'),
            temperature=data.get('temperature', 0.7)
        )
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500 