#!/bin/bash

# === Configuration ===
TARGETS=(
    "http://10.12.8.6:3001/health"
)
LOOPS=1000           # Nombre total de requêtes (0 = infini)
PARALLEL_REQS=10     # Requêtes simultanées
TIMEOUT=2            # Timeout en secondes
DELAY=0.1            # Délai entre requêtes (0 = max speed)

# === Fonction pour envoyer une requête HTTP ===
send_request() {
    local url=$1
    local start_time=$(date +%s%3N)  # Timestamp en millisecondes

    # Envoi de la requête avec curl (silencieux, timeout, user-agent random)
    if curl -s -k --max-time $TIMEOUT -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "$url" > /dev/null; then
        local end_time=$(date +%s%3N)
        local latency=$((end_time - start_time))
        echo "[+] $url → HTTP 200 (${latency}ms)"
    else
        echo "[-] $url → FAILED (Timeout/Error)"
    fi
}

# === Boucle principale ===
COUNT=0
while [[ $LOOPS -eq 0 || $COUNT -lt $LOOPS ]]; do
    for TARGET in "${TARGETS[@]}"; do
        send_request "$TARGET" &

        # Limiter le nombre de requêtes parallèles
        if (( $(jobs -r | wc -l) >= PARALLEL_REQS )); then
            wait -n
        fi

        sleep $DELAY
        ((COUNT++))
    done
done

# === Nettoyage ===
wait
echo "[✓] Test terminé (Total: $COUNT requêtes)."
