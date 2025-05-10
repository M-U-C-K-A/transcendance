import random
from datetime import datetime, timedelta

# Générer 50 matchs avec des données aléatoires
matches = []
start_date = datetime(2024, 1, 1)

for i in range(1, 51):
    p1_id = random.randint(1, 20)
    p2_id = random.randint(1, 20)
    while p2_id == p1_id:
        p2_id = random.randint(1, 20)

    p1_elo = random.randint(1000, 1600)
    p2_elo = random.randint(1000, 1600)

    p1_score = random.randint(0, 10)
    p2_score = random.randint(0, 10)
    while p1_score == p2_score:
        p1_score = random.randint(0, 10)
        p2_score = random.randint(0, 10)

    winner = p1_id if p1_score > p2_score else p2_id

    p1_elo_gain = random.randint(-30, 30)
    p2_elo_gain = -p1_elo_gain

    match_types = ['Local', 'Quickplay', 'Custom', 'Tournament']
    match_type = random.choice(match_types)

    match_date = start_date + timedelta(days=random.randint(0, 180), hours=random.randint(0, 23))

    matches.append(
        f"({p1_id}, {p2_id}, {p1_elo}, {p2_elo}, {winner}, {p1_score}, {p2_score}, "
        f"{p1_elo_gain}, {p2_elo_gain}, '{match_date.strftime('%Y-%m-%d %H:%M:%S')}', '{match_type}')"
    )

# Créer la requête d'insertion SQL
insert_sql = (
    "INSERT INTO Match (P1Id, P2Id, P1Elo, P2Elo, Winner, P1Score, P2Score, "
    "P1EloGain, P2EloGain, MDate, MatchType) VALUES\n" +
    ",\n".join(matches) + ";"
)

print(insert_sql)
