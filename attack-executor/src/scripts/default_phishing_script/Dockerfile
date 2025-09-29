FROM node:18-alpine

WORKDIR /app

# Copy script files
COPY package.json ./
COPY script.js ./

# Install dependencies
RUN npm install

# Run the phishing simulation
CMD ["node", "script.js"]