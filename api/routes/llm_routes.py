from flask import Blueprint, request, jsonify
from models.model_factory import ModelFactory
from config import Config
import json

llm_bp = Blueprint('llm', __name__)

@llm_bp.route('/generate', methods=['POST'])
async def generate():
    data = request.json
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    prompt = data.get('prompt')
    context = data.get('context', '')
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Get API key from Config
    api_key = getattr(Config, f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        
        # Include context in the prompt if available
        full_prompt = f"""Context:
{context}

User Question:
{prompt}

Please provide a helpful response based on the context above.""" if context else prompt

        response = await model.generate_completion(
            prompt=full_prompt,
            max_tokens=data.get('max_tokens'),
            temperature=data.get('temperature', 0.7)
        )
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@llm_bp.route('/research', methods=['POST'])
async def research():
    data = request.json
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    topic = data.get('topic')
    
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    api_key = getattr(Config, f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        prompt = f"""Research the following topic and provide a comprehensive response in JSON format:
Topic: {topic}

Provide:
1. A clear summary of the topic
2. Key sources of information
3. Relevance of each source

Format the response as:
{{
  "summary": "detailed overview",
  "sources": [
    {{
      "title": "source title",
      "url": "source url if available",
      "description": "key points from this source",
      "relevance": "why this source is important"
    }}
  ]
}}"""

        response = await model.generate_completion(
            prompt=prompt,
            max_tokens=1000,
            temperature=0.7
        )
        
        # Parse the response to ensure it's valid JSON
        try:
            research_data = response.get('text', '{}')
            return jsonify(research_data)
        except Exception as e:
            return jsonify({"error": "Failed to parse research results"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@llm_bp.route('/improve', methods=['POST'])
async def improve():
    data = request.json
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    text = data.get('text')
    
    if not text:
        return jsonify({"error": "Text is required"}), 400

    api_key = getattr(Config, f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        prompt = f"""Analyze and improve the following text for clarity, style, and impact. 
Maintain the core message while enhancing its effectiveness.

Text to improve:
{text}

Provide the response in the following JSON format:
{{
  "improved_text": "The enhanced version with all improvements applied",
  "changes": [
    "List each significant improvement made",
    "Focus on clarity, style, and impact changes",
    "Explain what was enhanced and why"
  ],
  "suggestions": [
    "Additional recommendations for further improvement",
    "Style tips specific to this type of content",
    "Optional enhancements that could be considered"
  ]
}}

Guidelines:
1. Preserve the original meaning and key points
2. Enhance clarity and readability
3. Improve structure and flow
4. Strengthen word choice and impact
5. Maintain appropriate tone and style"""

        response = await model.generate_completion(
            prompt=prompt,
            max_tokens=800,
            temperature=0.4  # Balanced between creativity and consistency
        )

        # Parse the response to ensure it's valid JSON
        try:
            improve_data = response.get('text', '{}')
            return jsonify(improve_data)
        except Exception as e:
            return jsonify({"error": "Failed to parse improvement results"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@llm_bp.route('/summarize', methods=['POST'])
async def summarize():
    data = request.json
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    text = data.get('text')
    
    if not text:
        return jsonify({"error": "Text is required"}), 400

    api_key = getattr(Config, f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        prompt = f"""Analyze and summarize the following text. Provide a concise summary, extract key points, and calculate the length reduction.

Text to summarize:
{text}

Provide the response in the following JSON format:
{{
  "summary": "A clear and concise summary of the main ideas",
  "key_points": [
    "List of important points from the text",
    "Each point should be a complete thought",
    "Focus on the most significant information"
  ],
  "length_reduction": "X% (calculate the percentage reduction from original text)"
}}

Guidelines:
1. The summary should capture the essential meaning
2. Key points should be specific and informative
3. Maintain accuracy while being concise
4. Use clear, professional language"""

        response = await model.generate_completion(
            prompt=prompt,
            max_tokens=800,
            temperature=0.3  # Lower temperature for more focused/consistent output
        )

        # Parse the response to ensure it's valid JSON
        try:
            summary_data = response.get('text', '{}')
            return jsonify(summary_data)
        except Exception as e:
            return jsonify({"error": "Failed to parse summarization results"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@llm_bp.route('/grammar', methods=['POST'])
async def grammar():
    data = request.json
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    text = data.get('text')
    
    if not text:
        return jsonify({"error": "Text is required"}), 400

    api_key = getattr(Config, f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        prompt = f"""Check the following text for grammar, spelling, and style issues:

Text: {text}

Provide the response in JSON format:
{{
  "corrected_text": "the text with all corrections applied",
  "corrections": [
    {{
      "original": "original text",
      "correction": "corrected version",
      "explanation": "why this change was made"
    }}
  ],
  "style_suggestions": [
    "list of style improvement suggestions"
  ]
}}"""

        response = await model.generate_completion(
            prompt=prompt,
            max_tokens=1000,
            temperature=0.3
        )
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@llm_bp.route('/format', methods=['POST'])
async def format():
    print("Received format request") # Debug log
    
    try:
        data = request.json
        print(f"Request data: {data}") # Debug log
    except Exception as e:
        print(f"Failed to parse request JSON: {str(e)}") # Debug log
        return jsonify({"error": "Invalid request format"}), 400
    
    provider = data.get('provider', 'openai')
    model_name = data.get('model_name')
    text = data.get('text')
    format_preferences = data.get('format_preferences', '')
    
    if not text:
        return jsonify({"error": "Text is required"}), 400

    api_key = getattr(Config, f"{provider.upper()}_API_KEY")
    if not api_key:
        return jsonify({"error": f"API key not found for {provider}"}), 400

    try:
        model = ModelFactory.get_model(provider, api_key, model_name)
        prompt = f"""Format the given text according to the specified preferences. Return a valid JSON object.

Text to format:
{text}

Formatting preferences:
{format_preferences}

Return ONLY a valid JSON object with this EXACT structure:
{{
    "formatted_text": "the text with basic formatting applied",
    "formatted_text_html": "<div><p>the text with HTML formatting</p></div>",
    "changes": ["list of specific changes made"],
    "style_guide": ["list of formatting rules applied"]
}}

Guidelines for formatting:
1. For the formatted_text field:
   - Keep paragraphs separated by double line breaks
   - Preserve all hyperlinks and special characters
   - Use consistent spacing and indentation
   - Keep the text clean and readable

2. For the formatted_text_html field:
   - Wrap paragraphs in <p> tags
   - For double spacing, add style="line-height: 2.0;"
   - For indentation, add style="text-indent: 2em;"
   - Keep HTML structure minimal and clean

Example response for double-spaced text:
{{
    "formatted_text": "First paragraph text here.\\n\\nSecond paragraph text here.",
    "formatted_text_html": "<div><p style='line-height: 2.0; margin: 1em 0;'>First paragraph text here.</p><p style='line-height: 2.0; margin: 1em 0;'>Second paragraph text here.</p></div>",
    "changes": ["Applied double spacing", "Added proper paragraph spacing"],
    "style_guide": ["Use line-height: 2.0 for double spacing", "Add 1em margins between paragraphs"]
}}"""

        print(f"Sending format prompt to model") # Debug log
        
        response = await model.generate_completion(
            prompt=prompt,
            max_tokens=1500,
            temperature=0.1
        )

        print(f"Received response from model: {response}") # Debug log

        try:
            response_text = response.get('text', '{}')
            print(f"Parsing response text: {response_text}") # Debug log
            
            format_data = json.loads(response_text)
            print(f"Parsed format data: {format_data}") # Debug log
            
            # Validate required fields
            required_fields = ['formatted_text', 'formatted_text_html', 'changes', 'style_guide']
            missing_fields = [field for field in required_fields if field not in format_data]
            
            if missing_fields:
                print(f"Missing fields in response: {missing_fields}") # Debug log
                raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
            
            # Clean up any extra whitespace
            format_data['formatted_text'] = format_data['formatted_text'].strip()
            
            # Ensure HTML is properly formatted
            html = format_data['formatted_text_html']
            if not html.startswith('<div>'):
                html = f"<div>{html}</div>"
            
            # If double spacing is requested, ensure it's applied
            if 'double' in format_preferences.lower() and 'spac' in format_preferences.lower():
                if '<p' in html and 'line-height' not in html:
                    html = html.replace("<p", '<p style="line-height: 2.0;"')
            
            format_data['formatted_text_html'] = html
            
            print(f"Returning format data: {format_data}") # Debug log
            return jsonify(format_data)
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}") # Debug log
            return jsonify({"error": "Invalid response format"}), 500
        except ValueError as e:
            print(f"Validation error: {str(e)}") # Debug log
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            print(f"Unexpected error while parsing response: {str(e)}") # Debug log
            return jsonify({"error": "Failed to process formatting results"}), 500
            
    except Exception as e:
        print(f"Error during format request: {str(e)}") # Debug log
        return jsonify({"error": f"Format request failed: {str(e)}"}), 500 