import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'flexfit.db')
SCHEMA_PATH = os.path.join(BASE_DIR, 'schema.sql')

def init():
    print(f"Initializing database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("Database flexfit.db successfully created and seeded!")
    print("Staff test login: admin / password123")

if __name__ == '__main__':
    init()
