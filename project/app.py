import os
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = 'supersecretflexfitkey'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'flexfit.db')
SCHEMA_PATH = os.path.join(BASE_DIR, 'schema.sql')

# Function to connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database from schema.sql
def init_db():
    conn = sqlite3.connect(DB_PATH)
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

# Ensure the database and tables exist on startup
def ensure_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        table_exists = cur.fetchone()
        conn.close()
        if not table_exists:
            print("Database tables not found. Initializing flexfit.db from schema.sql...")
            init_db()
            print("Database initialized successfully!")
    except Exception as e:
        print(f"Initializing database due to: {e}")
        init_db()

# Run database check immediately on startup
ensure_db()

# 1. Homepage
@app.route('/')
def index():
    return render_template('index.html')

# 2. Login Page
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                            (username, password)).fetchone()
        conn.close()

        if user:
            session['logged_in'] = True
            session['username'] = user['username']
            session['role'] = user['role']
            return redirect(url_for('dashboard'))
        else:
            error = 'Invalid username or password. Please try again.'

    return render_template('login.html', error=error)

# 3. Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# 4. Dashboard (SELECT tickets, stats, search)
@app.route('/dashboard')
def dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    search_query = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '').strip()

    conn = get_db_connection()

    # Build simple query
    query = 'SELECT * FROM tickets WHERE 1=1'
    params = []

    if search_query:
        query += ' AND (equipment LIKE ? OR location LIKE ? OR issue LIKE ?)'
        wildcard = f'%{search_query}%'
        params.extend([wildcard, wildcard, wildcard])

    if status_filter:
        query += ' AND status = ?'
        params.append(status_filter)

    query += ' ORDER BY id DESC'
    tickets = conn.execute(query, params).fetchall()

    # Calculate statistics for the dashboard
    total_jobs = conn.execute('SELECT COUNT(*) FROM tickets').fetchone()[0]
    open_jobs = conn.execute("SELECT COUNT(*) FROM tickets WHERE status = 'Open'").fetchone()[0]
    resolved_jobs = conn.execute("SELECT COUNT(*) FROM tickets WHERE status = 'Resolved'").fetchone()[0]

    conn.close()

    return render_template('dashboard.html',
                           tickets=tickets,
                           total_jobs=total_jobs,
                           open_jobs=open_jobs,
                           resolved_jobs=resolved_jobs,
                           search_query=search_query,
                           status_filter=status_filter)

# 5. Add Ticket (INSERT query)
@app.route('/add-ticket', methods=['GET', 'POST'])
def add_ticket():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    if request.method == 'POST':
        equipment = request.form['equipment']
        location = request.form['location']
        issue = request.form['issue']
        priority = request.form.get('priority', 'Medium')

        if not equipment or not location or not issue:
            flash('Please fill in all required fields.')
            return render_template('add_ticket.html')

        conn = get_db_connection()
        conn.execute('INSERT INTO tickets (equipment, location, issue, priority, status) VALUES (?, ?, ?, ?, ?)',
                     (equipment, location, issue, priority, 'Open'))
        conn.commit()
        conn.close()

        return redirect(url_for('dashboard'))

    return render_template('add_ticket.html')

# 6. Update Status (UPDATE query)
@app.route('/resolve/<int:ticket_id>')
def resolve_ticket(ticket_id):
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    conn = get_db_connection()
    conn.execute("UPDATE tickets SET status = 'Resolved' WHERE id = ?", (ticket_id,))
    conn.commit()
    conn.close()

    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    import os
    if not os.path.exists('flexfit.db'):
        print("Database not found. Creating flexfit.db from schema.sql...")
        init_db()
        print("Database created successfully!")
    app.run(debug=True, port=5000)
