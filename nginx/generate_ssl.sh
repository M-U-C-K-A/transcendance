#!/bin/sh
CERT_DIR=/etc/nginx/certs
CERT_FILE=$CERT_DIR/cert.pem
KEY_FILE=$CERT_DIR/key.pem

echo "🔐 Checking SSL certificates..."

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "🔐 Generating self-signed certificate..."
  mkdir -p $CERT_DIR
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $KEY_FILE \
    -out $CERT_FILE \
    -subj "/C=FR/ST=France/L=Paris/O=Transcendance/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  echo "✅ Certificate generated successfully."
else
  echo "✅ Certificate already exists."
fi

echo "🔍 Certificate details:"
openssl x509 -in $CERT_FILE -text -noout | grep -E "(Subject:|DNS:|IP Address:)"

echo "🚀 Starting NGINX..."
nginx -g "daemon off;" || echo "⚠️ NGINX failed to start."
