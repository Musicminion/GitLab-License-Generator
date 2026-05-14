# ---- Build stage ----
# Compile the React app into static assets.
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# The image serves the app from the domain root, not a GitHub Pages subpath.
ENV VITE_BASE=/
RUN npm run build

# ---- Production stage ----
# Serve the static assets with nginx.
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
