import sqlite3
from datetime import datetime

DB_FILE = "skillbridge.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c    = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        joined TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT, role TEXT, matched TEXT,
        missing TEXT, score INTEGER, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT, skill TEXT,
        completed INTEGER DEFAULT 0, updated TEXT,
        UNIQUE(email, skill))''')
    conn.commit()
    conn.close()
    print("✅ SQLite database ready!")

def save_user(name, email, password):
    try:
        conn = sqlite3.connect(DB_FILE)
        c    = conn.cursor()
        c.execute(
            "INSERT INTO users (name,email,password,joined) VALUES (?,?,?,?)",
            (name, email.strip().lower(), password.strip(), str(datetime.now()))
        )
        conn.commit()
        conn.close()
        return {"success": True}
    except sqlite3.IntegrityError:
        return {"success": False, "message": "Email already exists!"}

def get_user(email, password):
    conn = sqlite3.connect(DB_FILE)
    c    = conn.cursor()
    c.execute(
        "SELECT name, email FROM users WHERE email=? AND password=?",
        (email.strip().lower(), password.strip())
    )
    row = c.fetchone()
    conn.close()
    if row:
        return {"name": row[0], "email": row[1]}
    return None

def save_analysis(email, role, matched, missing, score):
    conn = sqlite3.connect(DB_FILE)
    c    = conn.cursor()
    c.execute(
        "INSERT INTO analysis (email,role,matched,missing,score,date) VALUES (?,?,?,?,?,?)",
        (email, role, str(matched), str(missing), score, str(datetime.now()))
    )
    conn.commit()
    conn.close()

def get_analysis_history(email):
    conn = sqlite3.connect(DB_FILE)
    c    = conn.cursor()
    c.execute(
        "SELECT role, score, date FROM analysis WHERE email=? ORDER BY date DESC",
        (email,)
    )
    rows = c.fetchall()
    conn.close()
    return [{"role": r[0], "score": r[1], "date": r[2]} for r in rows]

def save_progress(email, skill, completed):
    conn = sqlite3.connect(DB_FILE)
    c    = conn.cursor()
    c.execute('''
        INSERT INTO progress (email,skill,completed,updated)
        VALUES (?,?,?,?)
        ON CONFLICT(email,skill)
        DO UPDATE SET completed=?, updated=?
    ''', (email, skill, completed, str(datetime.now()),
          completed, str(datetime.now())))
    conn.commit()
    conn.close()

def get_progress(email):
    conn = sqlite3.connect(DB_FILE)
    c    = conn.cursor()
    c.execute(
        "SELECT skill, completed FROM progress WHERE email=?",
        (email,)
    )
    rows = c.fetchall()
    conn.close()
    return [{"skill": r[0], "completed": r[1]} for r in rows]

init_db()