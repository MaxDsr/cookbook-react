FROM node:18.16.0-slim

# Arguments defined in docker-compose.yml
ARG user
ARG uid

WORKDIR /backend

RUN useradd -G root -u $uid -d /home/$user $user

COPY . /backend

RUN npm ci
