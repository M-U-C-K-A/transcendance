#!/bin/bash

ENV_FILE=".env"

# Récupère la première IP locale (hors loopback)
LOCAL_IP=$(hostname -I | awk '{print $1}')

if [[ -z "$LOCAL_IP" ]]; then
  echo "❌ Impossible de récupérer l'adresse IP locale."
  exit 1
fi

# Si le fichier .env n'existe pas, le créer avec les variables nécessaires
if [[ ! -f "$ENV_FILE" ]]; then
  echo "📄 Fichier $ENV_FILE non trouvé, création en cours..."

  # Demande les variables nécessaires à l'utilisateur
  read -p "👉 Entrez le GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
  read -p "👉 Entrez le GOOGLE_CLIENT_SECRET: " GOOGLE_CLIENT_SECRET
  read -p "👉 Entrez le GOOGLE_REDIRECT_URI: " GOOGLE_REDIRECT_URI

  echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" > "$ENV_FILE"
  echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> "$ENV_FILE"
  echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> "$ENV_FILE"
  echo "GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI" >> "$ENV_FILE"
  echo "NEXT_PUBLIC_WEBSOCKET_FOR_CHAT=ws://${LOCAL_IP}:3001/ws/chat" >> "$ENV_FILE"
  echo "LOCAL_IP=$LOCAL_IP" >> "$ENV_FILE"

  echo "✅ Fichier $ENV_FILE créé avec succès."
  exit 0
fi

# Si le fichier existe, on le met à jour
echo "🔄 Mise à jour du fichier $ENV_FILE..."

# Supprime les lignes existantes pour éviter les
