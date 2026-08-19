import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)


@app.route("/")
def home():
    return jsonify({"message": "Todo API Running", "status": "ok"})


@app.route("/health")
def health():
    return jsonify({"status": "healthy"})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user["password"], password):
            return jsonify({
                "message": "Login Success",
                "user_id": user["id"],
                "username": user["username"]
            })

        return jsonify({"message": "Invalid Login"}), 401
    finally:
        cursor.close()
        conn.close()


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({"message": "Username, email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
        if cursor.fetchone():
            return jsonify({"message": "Email already registered"}), 400

        hashed_password = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users(username,email,password) VALUES(%s,%s,%s)",
            (username, email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "User Registered"}), 201
    finally:
        cursor.close()
        conn.close()


@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()
    user_id = data.get("user_id")

    if not title or not user_id:
        return jsonify({"message": "Title and user_id are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO tasks(title,user_id) VALUES(%s,%s)",
            (title, user_id)
        )
        conn.commit()
        return jsonify({
            "id": cursor.lastrowid,
            "title": title,
            "status": False
        }), 201
    finally:
        cursor.close()
        conn.close()


@app.route("/tasks")
def get_tasks():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT * FROM tasks WHERE user_id=%s ORDER BY id DESC",
            (user_id,)
        )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()


@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_task(id):
    user_id = request.args.get("user_id")
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM tasks WHERE id=%s AND user_id=%s",
            (id, user_id)
        )
        conn.commit()
        return jsonify({"message": "Task Deleted"})
    finally:
        cursor.close()
        conn.close()


@app.route("/done/<int:id>", methods=["PUT"])
def complete_task(id):
    user_id = request.args.get("user_id")
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE tasks SET status=NOT status WHERE id=%s AND user_id=%s",
            (id, user_id)
        )
        conn.commit()
        return jsonify({"message": "Task Updated"})
    finally:
        cursor.close()
        conn.close()


@app.route("/edit/<int:id>", methods=["PUT"])
def edit_task(id):
    data = request.get_json(silent=True) or {}
    new_title = data.get("title", "").strip()
    user_id = request.args.get("user_id")

    if not new_title:
        return jsonify({"message": "Title is required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE tasks SET title=%s WHERE id=%s AND user_id=%s",
            (new_title, id, user_id)
        )
        conn.commit()
        return jsonify({"message": "Task Updated"})
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
