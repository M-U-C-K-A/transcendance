import sqlite3
import random
import string
import hashlib
from datetime import datetime, timedelta
from faker import Faker

class MassUserGenerator:
    def __init__(self, db_path):
        self.db_path = db_path
        self.fake = Faker()
        self.conn = None
        self.cursor = None

    def connect(self):
        """Établir la connexion à la base de données"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()
            print(f"Connecté à la base de données: {self.db_path}")
        except sqlite3.Error as e:
            print(f"Erreur de connexion: {e}")

    def generate_password_hash(self, password):
        """Générer un hash sécurisé pour le mot de passe"""
        return hashlib.sha256(password.encode()).hexdigest()

    def generate_random_user(self):
        """Générer un utilisateur aléatoire avec des données réalistes"""
        username = self.fake.unique.user_name()[:16]
        alias = self.fake.first_name()
        email = self.fake.unique.email()
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        hashed_pass = self.generate_password_hash(password)

        # Choix d'avatar aléatoire (peut être remplacé par des URLs réelles)
        avatars = [
            "default_avatar1.png",
            "default_avatar2.png",
            "default_avatar3.png",
            "default_avatar4.png"
        ]

        return {
            'Username': username,
            'Alias': alias,
            'Email': email,
            'HashedPass': hashed_pass,
            'Avatar': random.choice(avatars),
            'Bio': self.fake.sentence(),
            'OnlineStatus': random.choice(['Online', 'Offline', 'InGame']),
            'Theme': random.randint(1, 5),
            'Elo': random.randint(800, 2500),
            'Win': random.randint(0, 500),
            'Lose': random.randint(0, 500),
            'TournamentWon': random.randint(0, 50),
            'PointScored': random.randint(0, 10000),
            'PointConcede': random.randint(0, 10000),
            'CreationDate': (datetime.now() - timedelta(days=random.randint(0, 365*3))).strftime('%Y-%m-%d %H:%M:%S'),
            'Verified': random.choice([0, 1])
        }


    def insert_users_batch(self, num_users, batch_size=1000):
        """Insérer un grand nombre d'utilisateurs par lots"""
        try:
            total_inserted = 0
            start_time = datetime.now()

            while total_inserted < num_users:
                current_batch = min(batch_size, num_users - total_inserted)
                users = [self.generate_random_user() for _ in range(current_batch)]

                query = """
                INSERT INTO UserInfo (
                    Username, Alias, Email, HashedPass, Avatar, Bio, OnlineStatus,
                    Theme, Elo, Win, Lose, TournamentWon, PointScored, PointConcede,
                    CreationDate, Verified
                ) VALUES (
                    :Username, :Alias, :Email, :HashedPass, :Avatar, :Bio, :OnlineStatus,
                    :Theme, :Elo, :Win, :Lose, :TournamentWon, :PointScored, :PointConcede,
                    :CreationDate, :Verified
                )
                """
                print(users)
                print()
                print()
                print()
                self.cursor.executemany(query, users)
                self.conn.commit()

                total_inserted += current_batch

            elapsed = datetime.now() - start_time
            print(f"\nTerminé! {total_inserted} utilisateurs insérés en {elapsed.total_seconds():.2f} secondes.")

        except sqlite3.Error as e:
            self.conn.rollback()
            print(f"\nErreur lors de l'insertion: {e}")
        except Exception as e:
            self.conn.rollback()
            print(f"\nErreur inattendue: {e}")

    def close(self):
        """Fermer la connexion à la base de données"""
        if self.conn:
            self.conn.close()
            print("Connexion à la base de données fermée.")

def main():
    print("=== Générateur d'utilisateurs en masse ===")

    db_path = input("Chemin vers la base de données SQLite: ").strip()
    num_users = int(input("Nombre d'utilisateurs à générer: ").strip())
    batch_size = int(input("Taille des lots (recommendé 100-1000): ").strip())

    generator = MassUserGenerator(db_path)
    generator.connect()
    generator.insert_users_batch(num_users, batch_size)
    generator.close()

if __name__ == "__main__":
    main()
