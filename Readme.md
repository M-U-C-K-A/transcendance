# ft_transcendence

## Stack Technique

- **Frontend** : [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS](https://tailwindcss.com/)  
- **Backend** : [Fastify](https://www.fastify.io/) (Node.js) + [Prisma](https://www.prisma.io/) (ORM SQL, SQLite) + Websockets  
- **Dockerized**: développement, build et exécution en containers pour une expérience portable et reproductible  
- **3D Game Engine** : [Babylon.js](https://www.babylonjs.com/) pour un Pong nouvelle génération & immersif !

---

## Fonctionnalités principales

- **Gestion d’utilisateurs avancée**
  - Inscription, connexion, profils, avatars, stats, gestion des amis
- **Authentification distante Google (OAuth 2)**
- **Multijoueur local et distant**
  - Pong jouable à 2 sur le même clavier ou à distance via le web
- **Personnalisation du jeu**  
  - Options custom (maps, power-up, règles)
- **Live chat**
  - Messagerie temps réel, invitations, blocage d’utilisateurs, notifications de tournoi
- **Opposant IA**
  - Affrontez une intelligence artificielle au comportement humain, qui joue via des entrées clavier simulées, rafraîchissement 1Hz, capable d'utiliser les bonus
- **GDPR**
  - Anonymisation, suppression de compte, gestion des données personnelles
- **2FA & JWT**
  - Authentification forte (2-Factor), gestion sécurisée des sessions/utilisateurs via JWT
- **Pong 3D**
  - Jeu Pong entièrement réalisé en 3D immersive avec Babylon.js
- **Support multilingue**
  - Interface traduite en plusieurs langues, switcher disponible, prêt pour un public international

---

## Lancement

### Prérequis

- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- (Optionnel): Node.js, npm si développement hors container

### Démarrer le projet (mode "tout inclus")

```bash
make up
```
Le site sera accessible sur [https://localhost:8080](https://localhost:8080) par défaut.

*Vérifiez les variables d’environnement dans le fichier `.env`.*

## A propos du projet

Ce projet est réalisé dans le cadre du cursus de l'École 42.

---

## Auteurs

- [@M-U-C-K-A](https://github.com/M-U-C-K-A)
- [@rbardet](https://github.com/rbardet)
- [@Thomasrbm](https://github/Thomasrbm)
