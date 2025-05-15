FROM node:24-alpine AS business-card-client

WORKDIR /app
COPY package*.json ./
RUN npm install -g nx && npm install

COPY . .
RUN nx build business-card-client

FROM nginx:alpine
COPY --from=business-card-client /app/dist/business-card-client /usr/share/nginx/html
