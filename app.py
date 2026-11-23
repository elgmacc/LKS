import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url=os.getenv("BASE_URL"),
    api_key=os.getenv("API_KEY"),
)
MODEL = os.getenv("MODEL")

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    pesan_user = data.get("message", "")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "Kamu adalah Mimo, asisten chat yang ramah dan menjawab dengan bahasa Indonesia santai."},
                {"role": "user", "content": pesan_user},
            ],
        )
        balasan = response.choices[0].message.content
    except Exception as e:
        return jsonify({"reply": f"Error: {e}"}), 500

    return jsonify({"reply": balasan})

if __name__ == "__main__":
    app.run(debug=True)