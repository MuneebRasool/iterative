# Use a compatible Node.js version for Next.js
FROM node:18.17-alpine

# Set the working directory for the app
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose the default Next.js port (3000)
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
