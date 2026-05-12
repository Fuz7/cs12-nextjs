# docker/frontend/Dockerfile

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy app files
COPY . .

RUN chmod -R +x node_modules/.bin

# Expose Next.js port
EXPOSE 3000

# Run dev server
CMD ["npm", "run", "dev"]