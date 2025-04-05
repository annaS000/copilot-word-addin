from flask import Flask
from routes.llm_routes import llm_bp

app = Flask(__name__)
app.register_blueprint(llm_bp, url_prefix='/api/llm')

if __name__ == '__main__':
    app.run(debug=True) 