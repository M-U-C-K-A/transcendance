#!/bin/bash

URL="http://10.12.8.4:3001/auth/register"
TOTAL=199900
PARALLEL=1000

# Utilisation de seq et xargs avec tout le code inline
seq "$TOTAL" | xargs -n1 -P "$PARALLEL" bash -c '
random_string() {
    openssl rand -base64 32 | tr -dc "a-zA-Z0-9" | head -c "$1"
}

create_user() {
    local username="user_$(random_string 8)"
    local email="${username}@example.com"
    local password=$(random_string 12)

    curl -s -X POST "'"$URL"'" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"email\":\"$email\",\"pass\":\"$password\"}" \
        > /dev/null
}

create_user
'

echo "Terminé!"
