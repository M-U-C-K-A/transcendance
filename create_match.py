import sqlite3
import random
import os

DB_PATH = './prisma/data/test.sqlite'

def reset_matches(conn):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM MatchHistory")
    cursor.execute("DELETE FROM Match")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='Match'")
    conn.commit()
    print("🧹 Tous les matchs et historiques ont été supprimés.")

def get_user_ids(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM User")
    return [row[0] for row in cursor.fetchall()]

def generate_random_matches(conn, user_ids, count=10):
    cursor = conn.cursor()
    print(f"🎮 Génération de {count} matchs aléatoires...")

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
        match_id = cursor.lastrowid

        # Historique
        cursor.execute("INSERT INTO MatchHistory (userId, matchId) VALUES (?, ?)", (p1, match_id))
        cursor.execute("INSERT INTO MatchHistory (userId, matchId) VALUES (?, ?)", (p2, match_id))

    conn.commit()
    print("✅ Matchs et historiques recréés.")

def main():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Base de données non trouvée à {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)

    confirm = input("❗ Es-tu sûr de vouloir supprimer TOUS les matchs ? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Opération annulée.")
        conn.close()
        return

    reset_matches(conn)
    user_ids = get_user_ids(conn)

    if len(user_ids) < 2:
        print("⚠️ Pas assez d'utilisateurs pour générer des matchs.")
    else:
        generate_random_matches(conn, user_ids, count=15)

    conn.close()

if __name__ == "__main__":
    main()
