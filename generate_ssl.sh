#!/bin/sh
CERT_DIR=/etc/nginx/certs
CERT_FILE=$CERT_DIR/cert.pem
KEY_FILE=$CERT_DIR/key.pem

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "Generating self-signed certificate..."
  mkdir -p $CERT_DIR
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $KEY_FILE \
    -out $CERT_FILE \
    -subj "/CN=localhost"
else
  echo "Certificate already exists."
fi

nginx -g "daemon off;"
