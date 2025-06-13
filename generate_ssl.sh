#!/bin/sh
CERT_DIR=/etc/nginx/certs # ou seront stock 
CERT_FILE=$CERT_DIR/cert.pem 
KEY_FILE=$CERT_DIR/key.pem 

# Supprimer les certificats existants s'ils sont là
if [ -f "$CERT_FILE" ] || [ -f "$KEY_FILE" ]; then
  echo "Certificate files exist. Removing them..."
  rm -f "$CERT_FILE" "$KEY_FILE"
fi

echo "Generating self-signed certificate..."
mkdir -p $CERT_DIR
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \  # cmd open source , -req = requete certif,  -x509 = format standard,     -nodes = pas obliger de mettre mdp pour se co en https , - days = duree valid, -newkey rsa:2048 = genere  clef rsa de 2048 bits (rsa = algo de cryptage)
  -keyout $KEY_FILE \  # fichier sortie clef
  -out $CERT_FILE \  # fichier sortie certif 
  -subj "/CN=localhost" # common name = localhost

# Lancement de nginx en mode foreground
nginx -g "daemon off;" # de base il est en mode background. (detache) sauf que dans docker ca marche pas.
