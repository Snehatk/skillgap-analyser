# ===== JOB ROLES SKILL DATABASE =====

JOB_ROLES = {
    "data-scientist": {
        "name": "Data Scientist",
        "skills": [
            "python", "machine learning", "statistics", "sql",
            "deep learning", "data visualization", "tensorflow", "pandas"
        ]
    },
    "web-developer": {
        "name": "Web Developer",
        "skills": [
            "html", "css", "javascript", "react",
            "node.js", "rest apis", "git", "mongodb"
        ]
    },
    "ai-engineer": {
        "name": "AI / ML Engineer",
        "skills": [
            "python", "tensorflow", "pytorch", "nlp",
            "deep learning", "mlops", "docker", "cloud platforms"
        ]
    },
    "cloud-engineer": {
        "name": "Cloud Engineer",
        "skills": [
            "aws", "azure", "docker", "kubernetes",
            "terraform", "linux", "networking", "ci/cd"
        ]
    },
    "data-analyst": {
        "name": "Data Analyst",
        "skills": [
            "excel", "sql", "python", "power bi",
            "tableau", "statistics", "data cleaning", "pandas"
        ]
    },
    "devops-engineer": {
        "name": "DevOps Engineer",
        "skills": [
            "docker", "kubernetes", "jenkins", "git",
            "linux", "aws", "ci/cd", "ansible"
        ]
    },
    "cybersecurity": {
        "name": "Cybersecurity Analyst",
        "skills": [
            "networking", "linux", "ethical hacking", "firewalls",
            "python", "siem tools", "cryptography", "risk assessment"
        ]
    }
}

# ===== SKILL KEYWORDS FOR NLP EXTRACTION =====
# spaCy will look for these words in resume text

SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "c++", "c#", "r",
    "sql", "mysql", "postgresql", "mongodb", "firebase",
    "html", "css", "react", "angular", "vue", "node.js", "express",
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
    "power bi", "tableau", "excel", "statistics",
    "docker", "kubernetes", "aws", "azure", "gcp", "linux",
    "git", "github", "ci/cd", "jenkins", "ansible", "terraform",
    "rest apis", "graphql", "microservices", "mlops",
    "data visualization", "data cleaning", "data analysis",
    "cloud platforms", "networking", "cybersecurity",
    "ethical hacking", "firewalls", "cryptography"
]