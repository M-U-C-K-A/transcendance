#!/bin/sh

ENV_FILE=".env"

# Récupère la première IP locale (hors loopback)
LOCAL_IP=$(hostname -I | awk '{print $1}')
HOSTNAME=$(hostname | awk '{print $1}')





  echo "LOCAL_IP=$LOCAL_IP" > "$ENV_FILE"
  echo "HOSTNAME=$HOSTNAME" >> "$ENV_FILE"
  echo "NEXT_PUBLIC_HOSTNAME=$HOSTNAME" >> "$ENV_FILE"
  echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> "$ENV_FILE"
  echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> "$ENV_FILE"
  echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> "$ENV_FILE"
  echo "GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI" >> "$ENV_FILE"
  echo "NEXT_PUBLIC_WEBSOCKET_FOR_CHAT=wss://${HOSTNAME}:3001/wss/chat" >> "$ENV_FILE"
  echo "NEXT_PUBLIC_WEBSOCKET_FOR_FRIENDS=wss://${HOSTNAME}:3001/wss/friends" >> "$ENV_FILE"


  echo "✅ Fichier $ENV_FILE créé avec succès."
  exit 0

