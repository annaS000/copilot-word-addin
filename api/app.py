from flask import Flask
from flask_cors import CORS
from routes.llm_routes import llm_bp
from config import Config
import os

# Validate configuration
Config.validate()

app = Flask(__name__)
# Enable CORS for the add-in domain
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://localhost:3001",  # Development
            "http://localhost:3001",   # Development without SSL
            "https://localhost:3000",  # Alternative dev port
            "http://localhost:3000",   # Alternative dev port without SSL
            # Add your production domain here when deployed
        ],
        "supports_credentials": True,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.register_blueprint(llm_bp, url_prefix='/api/llm')

if __name__ == '__main__':
    cert_path = os.path.join(os.path.dirname(__file__), 'certs', 'server.crt')
    key_path = os.path.join(os.path.dirname(__file__), 'certs', 'server.key')
    app.run(debug=True, ssl_context=(cert_path, key_path), host='0.0.0.0', port=5001) 