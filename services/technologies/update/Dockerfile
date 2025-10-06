FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (usando npm install en lugar de npm ci)
RUN npm install --only=production

# Copy application code
COPY . .

# Expose the service port
EXPOSE ${SERVICE_PORT}

# Start the service
CMD ["node", "index.js"]