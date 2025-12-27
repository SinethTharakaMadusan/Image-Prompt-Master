import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

load_dotenv('api.env')

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/get-image-data', methods=['POST'])
def get_image_data():
    try:
        data = request.json
        user_prompt = data.get('user_prompt')

        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            config={
                'response_mime_type': 'application/json',
            },
            contents=f"Generate image metadata for: {user_prompt}. Return JSON with 'name': 'Attractive small Title', 'tags': ['tag1', 'tag2', '...up to 10'] not include space, 'description': 'Description between 180 and 200 characters', 'ai_prompt': 'Technical prompt for image gen'."
        ) 
        return response.text
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)