# --- build step ---
FROM node:18 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY .env.production .env.production

# Print env file to verify
RUN cat .env.production

# Copy source and build
COPY . .
RUN npm run build -- --mode production

# --- runtime step ---
FROM nginx:alpine
# Copy Vite build output to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
