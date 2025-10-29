FROM node:20.19.0-slim

WORKDIR /frontend

COPY . /frontend

RUN npm ci

RUN npm run build
