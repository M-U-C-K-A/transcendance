# Base Node.js image
FROM node:22-alpine

# Update npm to latest
RUN npm install -g npm@latest

# Enable Corepack and install pnpm@latest
RUN corepack enable \
    && corepack prepare pnpm@latest-10 --activate

# Install Prisma CLI globally
RUN npm install -g prisma@latest

# Set working directory
WORKDIR /app

# Copy manifests and install dependencies
# Set packageManager field to avoid Corepack prompt\ nRUN npm pkg set packageManager="pnpm@10.11.0"

# Copy manifests and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Expose port for development
EXPOSE 3000

# Start development server
CMD ["pnpm", "run", "dev"]
