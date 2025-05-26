import requests
import random
import string
import time

URL = "http://10.12.6.6:3001/auth/register"

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_user():
    username = f"user_{random_string()}"
    email = f"{username}@example.com"
    password = random_string(12)
    return {
        "username": username,
        "email": email,
        "pass": password  # <-- respecter l'interface backend
    }

for i in range(199900):  # créer 100 comptes
    data = generate_user()
    response = requests.post(URL, json=data)
