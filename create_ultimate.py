import sqlite3
import random
import os
from faker import Faker
from datetime import datetime, timedelta
import string
import secrets
from sqlite3 import Error
import uuid
import requests  # Ajout pour les requêtes HTTP

# =============================================
# CONFIGURATION - MODIFIEZ CES VALEURS SI BESOIN
# =============================================

# Paramètres de génération
NB_USERS = 50                # Nombre d'utilisateurs à générer
NB_TOURNAMENTS = 10          # Nombre de tournois à générer
NB_MATCHES = 100             # Nombre de matchs à générer
NB_MESSAGES = 1000           # Nombre de messages à générer
NB_INVITATIONS = 30          # Nombre d'invitations à générer

# Chemins
DB_PATH = './prisma/data/test.sqlite'
PROFILE_PICTURES_DIR = './public/profilepicture'  # Chemin relatif vers le dossier de stockage

# =============================================
# FIN DE LA CONFIGURATION
# =============================================

fake = Faker()

def create_connection():
    """Crée une connexion à la base de données SQLite"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("PRAGMA foreign_keys = ON")  # Active les clés étrangères
        print(f"✅ Connexion à SQLite réussie ({DB_PATH})")
        return conn
    except Error as e:
        print(f"❌ Erreur de connexion: {e}")
        raise

def reset_database(conn):
    """Réinitialise complètement la base de données"""
    tables = [
        "Message", "Invitation", "Block", "Friends",
        "MatchHistory", "Match", "TournamentParticipants",
        "Tournament", "Achievement", "User"
    ]

    cursor = conn.cursor()

    # Désactiver temporairement les contraintes de clé étrangère
    cursor.execute("PRAGMA foreign_keys = OFF")

    for table in tables:
        try:
            cursor.execute(f"DELETE FROM {table}")
            cursor.execute(f"UPDATE sqlite_sequence SET seq = 0 WHERE name = '{table}'")
            print(f"🧹 Table {table} vidée")
        except Error as e:
            print(f"⚠️ Erreur lors de la suppression de {table}: {e}")

    # Réactiver les contraintes
    cursor.execute("PRAGMA foreign_keys = ON")
    conn.commit()
    print("✅ Base de données réinitialisée")

def download_profile_picture(username, index):
    """Télécharge l'image de profil depuis DiceBear et l'enregistre"""
    try:
        # Créer le dossier s'il n'existe pas
        os.makedirs(PROFILE_PICTURES_DIR, exist_ok=True)

        url = f"https://api.dicebear.com/9.x/bottts-neutral/webp?seed={username}"
        response = requests.get(url)

        if response.status_code == 200:
            filename = f"{index}.webp"
            filepath = os.path.join(PROFILE_PICTURES_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(response.content)

            print(f"✅ Image téléchargée: {filepath}")
            return filename
        else:
            print(f"❌ Échec du téléchargement pour {username}")
            return None
    except Exception as e:
        print(f"❌ Erreur lors du téléchargement de l'image: {e}")
        return None

def generate_users(count=50):
    """Génère des utilisateurs valides"""
    users = []
    for i in range(count):
        username = fake.unique.user_name()[:20]  # Limite la longueur
        email = fake.unique.email()[:50]        # Limite la longueur
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
        code = ''.join(secrets.choice(string.digits) for _ in range(6))  # Code à 6 chiffres

        # Télécharger l'image de profil
        profile_picture = download_profile_picture(username, i+1)

        users.append({
            'username': username,
            'alias': fake.first_name()[:20],
            'email': email,
            'pass': password,
            'bio': fake.sentence()[:100],
            'onlineStatus': random.choice([True, False]),
            'elo': random.randint(800, 2000),
            'win': random.randint(0, 50),
            'lose': random.randint(0, 50),
            'tournamentWon': random.randint(0, 5),
            'pointScored': random.randint(0, 1000),
            'pointConcede': random.randint(0, 1000),
            'code': code  # Ajout du code à 6 chiffres
        })
    return users

def generate_achievements(user_ids):
    """Génère des achievements valides"""
    return [{
        'id': user_id,
        'beginner': random.choice([True, False]),
        'humiliation': random.choice([True, False]),
        'shamefullLose': random.choice([True, False]),
        'rivality': random.choice([True, False]),
        'fairPlay': random.choice([True, False]),
        'lastSecond': random.choice([True, False]),
        'comeback': random.choice([True, False]),
        'longGame': random.choice([True, False]),
        'winTournament': False,
        'friendly': random.choice([True, False]),
        'rank1': random.choice([True, False]),
        'looser': random.choice([True, False]),
        'winner': random.choice([True, False]),
        'scorer': random.choice([True, False]),
        'emoji': random.choice([True, False]),
        'rage': random.choice([True, False])
    } for user_id in user_ids]

def generate_tournaments(count, user_ids):
    """Génère des tournois valides"""
    tournaments = []
    for _ in range(count):
        host_id = random.choice(user_ids)
        tournaments.append({
            'hostId': host_id,
            'slot': random.choice([4, 8, 16]),
            'winnerId': None,  # Initialisé à None, sera mis à jour plus tard
            'tDate': fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S'),
            'tournamentName': fake.sentence()
        })
    return tournaments

def generate_tournament_history(tournaments, user_ids):
    """Génère un historique de tournois valide"""
    history = []
    for tournament in tournaments:
        participants = random.sample(user_ids, min(tournament['slot'], len(user_ids)))
        for user_id in participants:
            history.append({
                'userId': user_id,
                'tournamentId': tournament['id']
            })
    return history

def generate_matches(count, user_ids):
    """Génère des matchs valides sans le champ 'name' problématique"""
    matches = []
    for _ in range(count):
        p1_id, p2_id = random.sample(user_ids, 2)
        p1_score, p2_score = random.randint(0, 10), random.randint(0, 10)
        winner_id = p1_id if p1_score > p2_score else p2_id

        matches.append({
            'p1Id': p1_id,
            'p2Id': p2_id,
            'name': str(uuid.uuid4()),
            'p1Elo': random.randint(800, 2000),
            'p2Elo': random.randint(800, 2000),
            'winnerId': winner_id,
            'p1Score': p1_score,
            'p2Score': p2_score,
            'p1EloGain': random.randint(-30, 30),
            'p2EloGain': random.randint(-30, 30),
            'mDate': fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S'),
            'matchType': random.choice(["Quickplay", "Ranked", "Tournament"])
        })
    return matches

def generate_match_history(matches, user_ids):
    """Génère un historique de matchs valide"""
    history = []
    for match in matches:
        history.append({
            'userId': match['p1Id'],
            'matchId': match['id']
        })
        if match['p2Id']:
            history.append({
                'userId': match['p2Id'],
                'matchId': match['id']
            })
    return history

def generate_friends(user_ids):
    """Génère des relations d'amitié réalistes"""
    friends = []
    # Chaque utilisateur a entre 2 et 5 amis
    for user_id in user_ids:
        possible_friends = [id for id in user_ids if id != user_id]
        num_friends = random.randint(2, min(5, len(possible_friends)))
        for friend_id in random.sample(possible_friends, num_friends):
            # Éviter les doublons (relation bidirectionnelle)
            if not any(f for f in friends if (f['id1'] == user_id and f['id2'] == friend_id) or
                               (f['id1'] == friend_id and f['id2'] == user_id)):
                friends.append({
                    'id1': min(user_id, friend_id),
                    'id2': max(user_id, friend_id),
                    'status' : random.choice([True, False])
                })
    return friends

def generate_blocks(user_ids):
    """Génère des relations de blocage"""
    blocks = []
    # Environ 10% des utilisateurs bloquent 1-2 autres
    for _ in range(len(user_ids) // 10):
        blocker_id = random.choice(user_ids)
        blockee_id = random.choice([id for id in user_ids if id != blocker_id])
        blocks.append({
            'id1': blocker_id,
            'id2': blockee_id
        })
    return blocks

def generate_messages(count, user_ids):
    """Génère des messages privés et publics"""
    messages = []
    for _ in range(count):
        sender_id = random.choice(user_ids)
        is_private = random.random() < 0.7

        recipient_id = random.choice([id for id in user_ids if id != sender_id]) if is_private else None

        # Construction du message avec recipientId toujours présent
        message = {
            'senderId': sender_id,
            'content': fake.sentence()[:200],
            'sendAt': fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S'),
            'readStatus': random.choice([True, False]),
            'isGeneral': not is_private,  # Inversé pour correspondre au schéma
            'messageType': "Message",
            'recipientId': recipient_id  # Peut être None
        }

        messages.append(message)
    return messages

def generate_invitations(count, user_ids):
    """Génère des invitations de match"""
    invitations = []
    for _ in range(count):
        sender_id, recipient_id = random.sample(user_ids, 2)
        invitations.append({
            'senderId': sender_id,
            'recipientId': recipient_id,
            'matchType': random.choice(["Quickplay", "Ranked", "Tournament"]),
            'createdAt': fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S'),
            'expireAt': (fake.date_time_this_year() + timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
        })
    return invitations

def insert_data(conn, table, data, return_ids=False):
    """Insère des données dans une table et retourne éventuellement les IDs"""
    if not data:
        return []

    cursor = conn.cursor()
    columns = ', '.join(data[0].keys())
    placeholders = ', '.join(['?'] * len(data[0]))
    sql = f'INSERT INTO {table} ({columns}) VALUES ({placeholders})'

    try:
        ids = []
        for row in data:
            # Convertir explicitement les valeurs Python en valeurs SQL
            values = []
            for val in row.values():
                if val is None:
                    values.append(None)  # NULL SQL
                elif isinstance(val, bool):
                    values.append(1 if val else 0)  # Booléen -> 0/1
                else:
                    values.append(val)

            cursor.execute(sql, tuple(values))
            ids.append(cursor.lastrowid)

        conn.commit()
        print(f"✅ {len(data)} enregistrements insérés dans {table}")
        return ids if return_ids else None
    except Error as e:
        print(f"❌ Erreur lors de l'insertion dans {table}: {e}")
        conn.rollback()
        raise

def main():
    # Vérification de la base de données
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Base de données non trouvée à {DB_PATH}")

    # Connexion
    conn = create_connection()

    try:
        # Réinitialisation complète
        print("\n🔨 Réinitialisation de la base de données...")
        reset_database(conn)

        # Génération des utilisateurs
        print(f"\n👥 Génération de {NB_USERS} utilisateurs...")
        users = generate_users(NB_USERS)
        user_ids = insert_data(conn, "User", users, return_ids=True)

        # Génération des achievements
        print("\n🏆 Génération des achievements...")
        achievements = generate_achievements(user_ids)
        insert_data(conn, "Achievement", achievements)

        # Génération des tournois
        print(f"\n🏆 Génération de {NB_TOURNAMENTS} tournois...")
        tournaments = generate_tournaments(NB_TOURNAMENTS, user_ids)
        tournament_ids = insert_data(conn, "Tournament", tournaments, return_ids=True)

        # Mise à jour des gagnants de tournoi
        for i, tournament in enumerate(tournaments):
            if random.random() > 0.7:  # 30% de chance d'avoir un gagnant
                tournament['winnerId'] = random.choice(user_ids)
                conn.execute("UPDATE Tournament SET winnerId = ? WHERE id = ?",
                           (tournament['winnerId'], tournament_ids[i]))
        conn.commit()

        # Historique des tournois
        print("\n📝 Génération de l'historique des tournois...")
        tournament_history = generate_tournament_history(
            [{'id': tid, 'slot': t['slot']} for tid, t in zip(tournament_ids, tournaments)],
            user_ids
        )
        insert_data(conn, "TournamentParticipants", tournament_history)

        # Génération des matchs
        print(f"\n🎮 Génération de {NB_MATCHES} matchs...")
        matches = generate_matches(NB_MATCHES, user_ids)
        match_ids = insert_data(conn, "Match", matches, return_ids=True)

        # Historique des matchs
        print("\n📝 Génération de l'historique des matchs...")
        match_history = generate_match_history(
            [{'id': mid, 'p1Id': m['p1Id'], 'p2Id': m['p2Id']}
             for mid, m in zip(match_ids, matches)],
            user_ids
        )
        insert_data(conn, "MatchHistory", match_history)

        # Relations d'amitié
        print("\n🤝 Génération des relations d'amitié...")
        friends = generate_friends(user_ids)
        insert_data(conn, "Friends", friends)

        # Blocages
        print("\n🚫 Génération des blocages...")
        blocks = generate_blocks(user_ids)
        insert_data(conn, "Block", blocks)

        # Messages
        print(f"\n💬 Génération de {NB_MESSAGES} messages...")
        messages = generate_messages(NB_MESSAGES, user_ids)
        insert_data(conn, "Message", messages)

        # Invitations
        print(f"\n📨 Génération de {NB_INVITATIONS} invitations...")
        invitations = generate_invitations(NB_INVITATIONS, user_ids)
        insert_data(conn, "Invitation", invitations)

        print("\n🎉 Génération de données terminée avec succès!")

    except Exception as e:
        print(f"\n❌ Erreur critique: {e}")
        conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    main()
