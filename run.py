from prisma import Prisma, register
import asyncio
from faker import Faker
import random

async def main():
    # Enregistrer le client (nécessaire pour la première utilisation)
    prisma = Prisma()
    await prisma.connect()

    # Votre code ici...
    fake = Faker()

    # Exemple : créer un utilisateur
    user = await prisma.userinfo.create({
        'username': fake.user_name(),
        'email': fake.email(),
        'pass': fake.password(),
        'elo': 1200
    })
    print(f"Utilisateur créé : {user.username}")

    await prisma.disconnect()

if __name__ == '__main__':
    asyncio.run(main())
