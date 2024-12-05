# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production
ENV PORT=8080

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./

RUN npm install --omit=dev

# Copy all source files into the image
COPY . .

# Expose the port that the application listens on
EXPOSE ${PORT}

# Run the server.js file directly
CMD ["node", "server.js"]
