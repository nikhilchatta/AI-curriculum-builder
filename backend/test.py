import os
import sys
import subprocess
import sqlite3
import threading
import time
import pickle
import requests

# Hardcoded secrets (security issue)
DB_USER = "admin"
DB_PASS = "password123"
API_KEY = "SECRET_API_KEY"

# Global mutable state (race condition)
counter = 0
cache = {}

# Insecure DB connection (no context manager, no error handling)
conn = sqlite3.connect("users.db")
cursor = conn.cursor()

def main():
    # None usage (TypeError)
    data = None
    print(len(data))

    # SQL injection
    user_input = sys.argv[1]
    query = "SELECT * FROM users WHERE name = '" + user_input + "'"
    cursor.execute(query)

    for row in cursor.fetchall():
        print("User:", row)

    # Command injection
    os.system("rm -rf " + user_input)

    # Insecure deserialization (RCE risk)
    with open("payload.pkl", "rb") as f:
        obj = pickle.load(f)
        print(obj)

    # Infinite loop (CPU hog)
    while True:
        pass

    # Blocking call in thread without join
    threading.Thread(target=slow_task).start()

    # XSS-like behavior
    html = "<html><body>" + user_input + "</body></html>"
    print(html)

    # Swallowing all exceptions
    try:
        x = 1 / 0
    except:
        pass

    # Resource leak
    f = open("data.txt")
    print(f.read())

    # Race condition
    threading.Thread(target=inc).start()
    threading.Thread(target=inc).start()

    # Insecure HTTP request
    r = requests.get("http://example.com/api?key=" + API_KEY)
    print(r.text)

def slow_task():
    time.sleep(10)
    print("done")

def inc():
    global counter
    counter += 1

if __name__ == "__main__":
    main()
#5test 