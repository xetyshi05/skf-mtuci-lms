# Stage 1 — build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:1.27-alpine AS runner

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# SSL certificates are mounted at runtime (see docker-compose.yaml)
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
