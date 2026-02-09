# Backend Dockerfile — Express.js + Sequelize
# CSIR EOI No. 8121/10/02/2026

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first (Docker layer caching)
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose the API port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start the Express.js server
CMD ["node", "src/server.js"]
