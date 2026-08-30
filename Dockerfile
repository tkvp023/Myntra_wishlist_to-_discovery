FROM node:20-slim

# Install OpenSSL (required by Prisma engine on Linux)
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy source code and seed files
COPY backend/ ./

# Set default environment variables
ENV DATABASE_URL="file:./dev.db"
ENV PORT=3001
ENV NODE_ENV=production
EXPOSE 3001

# Generate Prisma client
RUN npx prisma generate

CMD ["sh", "-c", "npx prisma generate && npx prisma db push && node prisma/seed.js && node src/index.js"]
