#!/bin/bash

# Récupère la première IP locale (hors loopback)
LOCAL_IP=$(hostname -I | awk '{print $1}')

if [[ -z "$LOCAL_IP" ]]; then
  echo "❌ Impossible de récupérer l'adresse IP locale."
  exit 1
fi

ENV_FILE=".env"

# Vérifie si le fichier .env existe
if [[ ! -f "$ENV_FILE" ]]; then
  echo "⚠️ Le fichier $ENV_FILE n'existe pas. Aucune modification effectuée."
  exit 0
fi

# Supprime une éventuelle ligne existante LOCAL_IP=
grep -v "^LOCAL_IP=" "$ENV_FILE" > "${ENV_FILE}.tmp"

# Ajoute la nouvelle valeur
echo "LOCAL_IP=$LOCAL_IP" >> "${ENV_FILE}.tmp"

# Remplace l'ancien fichier
mv "${ENV_FILE}.tmp" "$ENV_FILE"

echo "✅ LOCAL_IP mis à jour dans $ENV_FILE : $LOCAL_IP"
