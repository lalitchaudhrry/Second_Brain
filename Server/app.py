from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import traceback
import os
import requests

# Load environment variables from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Flask setup
app = Flask(__name__)
CORS(app)

# In-memory note storage as a list of dicts: each note has an id and content
saved_notes = []
next_id = 1  # Simple incremental ID generator

# Endpoint to save notes (Create)
@app.route("/api/save-note", methods=["POST"])
def save_note():
    global next_id
    data = request.get_json()
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"error": "Cannot save an empty note."}), 400

    note = {"id": next_id, "content": content}
    saved_notes.append(note)
    next_id += 1
    print(f"✅ Saved Note (ID {note['id']}):", content[:100])

    return jsonify({"message": "Note saved successfully!", "note": note})

# Endpoint to return all saved notes (Read)
@app.route("/api/notes", methods=["GET"])
def get_notes():
    # Return the full list of note objects (id + content):
    return jsonify({"notes": saved_notes})

# Endpoint to delete a note by ID (Delete)
@app.route("/api/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    global saved_notes
    original_len = len(saved_notes)
    saved_notes = [note for note in saved_notes if note["id"] != note_id]

    if len(saved_notes) == original_len:
        return jsonify({"error": "Note not found."}), 404

    print(f"🗑️ Deleted Note ID {note_id}")
    return jsonify({"message": "Note deleted successfully."})

# Endpoint to update/edit a note by ID (Update)
@app.route("/api/notes/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    data = request.get_json()
    new_content = data.get("content", "").strip()
    if not new_content:
        return jsonify({"error": "Cannot update to an empty note."}), 400

    for note in saved_notes:
        if note["id"] == note_id:
            note["content"] = new_content
            print(f"✏️ Updated Note ID {note_id}: {new_content[:100]}")
            return jsonify({"message": "Note updated successfully.", "note": note})

    return jsonify({"error": "Note not found."}), 404

# Endpoint to generate flashcards (unchanged Gemini API call)
@app.route("/api/generate-flashcards", methods=["POST"])
def generate_flashcards():
    data = request.get_json()
    content = data.get("content", "")

    prompt = f"""
    Based on the following notes, generate exactly 5 clear and concise flashcards.
    Format:
    Q: [question]
    A: [answer]

    Notes:
    {content}
    """

    try:
        # Call Gemini API (unchanged URL and headers)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        body = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }

        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()  # Raise if HTTP error
        response_data = response.json()

        # Parse Gemini output
        candidates = response_data.get("candidates", [])
        if not candidates:
            return jsonify({"error": "No response from Gemini API."}), 500

        text = candidates[0]["content"]["parts"][0]["text"]
        print("📄 Gemini Response:\n", text)

        # Extract flashcards from Q/A format
        lines = text.strip().split('\n')
        flashcards = []
        question, answer = None, None

        for line in lines:
            if line.startswith("Q:"):
                question = line[2:].strip()
            elif line.startswith("A:"):
                answer = line[2:].strip()
                if question and answer:
                    flashcards.append({"question": question, "answer": answer})
                    question, answer = None, None

        return jsonify({"flashcards": flashcards})

    except Exception as e:
        print("🔥 Error generating flashcards:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

