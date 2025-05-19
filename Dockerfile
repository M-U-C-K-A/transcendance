# 1) Base + outils système pour compiler bcrypt
FROM node:22-alpine
RUN apk add --no-cache python3 make g++

# 2) Met à jour npm, active corepack + pnpm
RUN npm install -g npm@latest \
 && corepack enable \
 && corepack prepare pnpm@latest-10 --activate

WORKDIR /app

# 3) Copie juste les manifests et installe toutes les deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 4) Copie ton schema Prisma et génère le client
COPY prisma ./prisma
RUN pnpm run generate-prisma


# 5) Copie le reste de l’application
COPY . .

# 6) Expose front (3000) + back (3001)
EXPOSE 3000 3001 5555

# 7) Commande par défaut : démarre ton server
CMD ["pnpm", "run", "dev:server"]
