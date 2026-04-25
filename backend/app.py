from flask import Flask, app, request, jsonify
from flask_cors import CORS
import os

from skill_extractor import extract_skills_from_resume, extract_skills
from analyzer        import analyze_gap, get_all_career_matches
from database        import save_user, get_user, save_analysis, get_analysis_history, save_progress
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)  # Line 9 calls CORS(app) — app must be this
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===== ROUTE 1: Health check =====
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "SkillBridge API is running! ✅"})

# ===== ROUTE 2: Upload resume =====
@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file      = request.files["resume"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    result    = extract_skills_from_resume(file_path)
    return jsonify(result)

# ===== ROUTE 3: Analyze skill gap =====
@app.route("/analyze", methods=["POST"])
def analyze():
    data        = request.get_json()
    user_skills = data.get("skills", [])
    job_role    = data.get("job_role", "")
    if not user_skills or not job_role:
        return jsonify({"error": "Skills and job role are required"}), 400
    result = analyze_gap(user_skills, job_role)
    return jsonify(result)

# ===== ROUTE 4: Career matches =====
@app.route("/career-matches", methods=["POST"])
def career_matches():
    data        = request.get_json()
    user_skills = data.get("skills", [])
    if not user_skills:
        return jsonify({"error": "No skills provided"}), 400
    matches = get_all_career_matches(user_skills)
    return jsonify({"matches": matches})

# ===== ROUTE 5: Extract skills from text =====
@app.route("/extract-skills-text", methods=["POST"])
def extract_from_text():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    skills = extract_skills(text)
    return jsonify({"skills": skills, "count": len(skills)})

# ===== ROUTE 6: Register =====
@app.route("/register", methods=["POST"])
def register():
    data     = request.get_json()
    name     = data.get("name", "")
    email    = data.get("email", "")
    password = data.get("password", "")
    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400
    result = save_user(name, email, password)
    return jsonify(result)

# ===== ROUTE 7: Login =====
@app.route("/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    if not email or not password:
        return jsonify({"success": False, "message": "All fields required"}), 400
    user = get_user(email, password)
    if user:
        return jsonify({"success": True, "user": user})
    return jsonify({"success": False, "message": "Invalid email or password!"}), 401

# ===== ROUTE 8: Save analysis =====
@app.route("/save-analysis", methods=["POST"])
def save_analysis_route():
    data      = request.get_json()
    email     = data.get("email", "guest")
    role      = data.get("role", "")
    matched   = data.get("matched", [])
    missing   = data.get("missing", [])
    score     = data.get("score", 0)
    record_id = save_analysis(email, role, matched, missing, score)
    return jsonify({"success": True, "id": str(record_id)})

# ===== ROUTE 9: Get history =====
@app.route("/history/<email>", methods=["GET"])
def get_history(email):
    history = get_analysis_history(email)
    return jsonify({"history": history})

# ===== ROUTE 10: Save progress =====
@app.route("/save-progress", methods=["POST"])
def save_progress_route():
    data      = request.get_json()
    email     = data.get("email", "guest")
    skill     = data.get("skill", "")
    completed = data.get("completed", False)
    save_progress(email, skill, completed)
    return jsonify({"success": True})

# ===== TEST ROUTE =====
@app.route("/test-db", methods=["GET"])
def test_db():
    result = save_user("TestUser", "test@test.com", "123456")
    return jsonify(result)

# ===== RUN SERVER =====
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, port=port, host="0.0.0.0")