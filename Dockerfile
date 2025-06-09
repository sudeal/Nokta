# Dockerfile for Expo React Native Web
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expo export for web application
RUN npx expo export --platform web

# Serve static files with Nginx
FROM nginx:alpine

# Expo web build output to nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Custom nginx config (optional)
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# open port 80
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"] 