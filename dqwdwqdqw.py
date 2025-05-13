import sqlite3
from faker import Faker
import random
import bcrypt
import os

fake = Faker()
DB_PATH = './prisma/data/test.sqlite'

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def generate_user():
    username = fake.user_name()
    alias = fake.first_name()
    email = fake.unique.email()
    raw_password = fake.password()
    hashed_password = hash_password(raw_password)
    avatar_url = f"https://api.dicebear.com/9.x/bottts-neutral/svg?seed={username}"
    bio = fake.sentence()
    online_status = random.choice([0, 1])
    elo = random.randint(800, 1600)
    win = random.randint(0, 50)
    lose = random.randint(0, 50)
    tournament_won = random.randint(0, 5)
    point_scored = random.randint(0, 1000)
    point_concede = random.randint(0, 1000)

    return (
        username, alias, email, hashed_password,
        avatar_url.encode('utf-8'), bio,
        online_status, elo, win, lose, tournament_won,
        point_scored, point_concede
    )

def clear_userinfo_table(conn):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM UserInfo")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='UserInfo'")  # reset autoincrement
    conn.commit()
    print("🗑️ Table UserInfo vidée et ID réinitialisé.")

def generate_random_matches(conn, user_ids, count=10):
    cursor = conn.cursor()
    print("🎮 Génération de matchs aléatoires...")
    for _ in range(count):
        p1, p2 = random.sample(user_ids, 2)
        p1Elo, p2Elo = random.randint(800, 1600), random.randint(800, 1600)
        p1Score, p2Score = random.randint(0, 10), random.randint(0, 10)
        winnerId = p1 if p1Score > p2Score else p2
        p1EloGain = random.randint(-10, 30)
        p2EloGain = random.randint(-10, 30)
        matchType = "Quickplay"
        cursor.execute("""
            INSERT INTO Match (
                p1Id, p2Id, p1Elo, p2Elo, winnerId,
                p1Score, p2Score, p1EloGain, p2EloGain, matchType
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (p1, p2, p1Elo, p2Elo, winnerId, p1Score, p2Score, p1EloGain, p2EloGain, matchType))
    conn.commit()
    print("✅ Matchs générés.")

def insert_users(n=10):
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Base de données non trouvée à {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Demande à l'utilisateur
    clear = input("❓ Supprimer les anciens profils ? (y/n): ").strip().lower()
    if clear == 'y':
        clear_userinfo_table(conn)

    user_ids = []
    for _ in range(n):
        user = generate_user()
        try:
            cursor.execute("""
                INSERT INTO UserInfo (
                    username, alias, email, pass, avatar, bio,
                    onlineStatus, elo, win, lose, tournamentWon,
                    pointScored, pointConcede
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, user)
            user_id = cursor.lastrowid
            user_ids.append(user_id)
            print(f"✅ Utilisateur '{user[0]}' ajouté avec ID {user_id}")
        except sqlite3.IntegrityError:
            print(f"⚠️ Email déjà existant: {user[2]}")
        except Exception as e:
            print(f"❌ Erreur pour '{user[0]}': {e}")

    conn.commit()

    generate_matches = input("❓ Générer des matchs aléatoires ? (y/n): ").strip().lower()
    if generate_matches == 'y' and len(user_ids) >= 2:
        generate_random_matches(conn, user_ids, count=100)

    conn.close()

if __name__ == "__main__":
    insert_users(n=200)
