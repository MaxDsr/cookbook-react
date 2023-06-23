FROM node:18.16.0-slim

WORKDIR /frontend

COPY ./public ./public
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm ci
