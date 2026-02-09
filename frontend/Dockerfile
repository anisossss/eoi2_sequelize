# Frontend Dockerfile — React App
# CSIR EOI No. 8121/10/02/2026

# ── Build Stage ────────────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# ── Production Stage — Serve with lightweight Node server ──────────
FROM node:18-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy build output from build stage
COPY --from=build /app/build ./build

# Expose port 3000
EXPOSE 3000

# Serve the built React app
CMD ["serve", "-s", "build", "-l", "3000"]
