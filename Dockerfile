FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install -g nx && npm install

COPY . .
RUN nx build business-card-client

FROM nginx:alpine
COPY --from=builder /app/dist/apps/business-card-client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
