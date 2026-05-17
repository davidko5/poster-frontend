FROM node:20-alpine AS build
WORKDIR /app

# Install deps first for layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Build with env vars baked in. Coolify passes them as build args.
ARG VITE_BASE_URL=/
ARG VITE_BACKEND_URL
ENV VITE_BASE_URL=$VITE_BASE_URL \
    VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
