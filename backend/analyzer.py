from skills_db import JOB_ROLES

# ===== SKILL GAP ANALYZER =====
def analyze_gap(user_skills, job_role_key):
    """
    Compare user skills vs required skills
    Returns matched, missing and score
    """

    # Check if role exists
    if job_role_key not in JOB_ROLES:
        return {"error": "Invalid job role"}

    role           = JOB_ROLES[job_role_key]
    required       = role["skills"]

    # Normalize to lowercase for comparison
    user_lower     = [s.lower() for s in user_skills]
    required_lower = [s.lower() for s in required]

    # Find matched and missing skills
    matched = [s for s in required if s.lower() in user_lower]
    missing = [s for s in required if s.lower() not in user_lower]

    # Calculate score
    score   = round((len(matched) / len(required)) * 100)

    return {
        "role":     role["name"],
        "matched":  matched,
        "missing":  missing,
        "score":    score,
        "total":    len(required)
    }

# ===== CAREER MATCH FOR ALL ROLES =====
def get_all_career_matches(user_skills):
    """
    Calculate match % for every job role
    Returns sorted list (best match first)
    """
    user_lower = [s.lower() for s in user_skills]
    matches    = []

    for key, role in JOB_ROLES.items():
        matched = [s for s in role["skills"] if s.lower() in user_lower]
        pct     = round((len(matched) / len(role["skills"])) * 100)
        matches.append({
            "role":  role["name"],
            "key":   key,
            "score": pct
        })

    # Sort by best match first
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches