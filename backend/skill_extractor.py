import fitz        # pymupdf — reads PDF
import spacy
from skills_db import SKILL_KEYWORDS

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# ===== EXTRACT TEXT FROM PDF =====
def extract_text_from_pdf(file_path):
    """Read all text from a PDF file"""
    text = ""
    doc  = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    return text.lower()   # lowercase for easy matching

# ===== EXTRACT SKILLS FROM TEXT =====
def extract_skills(text):
    """
    Find skills in resume text by matching
    against our SKILL_KEYWORDS list
    """
    text   = text.lower()
    found  = []

    for skill in SKILL_KEYWORDS:
        if skill.lower() in text:
            if skill not in found:
                found.append(skill)

    return found

# ===== MAIN FUNCTION =====
def extract_skills_from_resume(file_path):
    """Full pipeline: PDF → text → skills"""
    try:
        text   = extract_text_from_pdf(file_path)
        skills = extract_skills(text)
        return {
            "success": True,
            "skills":  skills,
            "count":   len(skills)
        }
    except Exception as e:
        return {
            "success": False,
            "error":   str(e),
            "skills":  []
        }