# Use the latest Node.js LTS image
FROM node:lts

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the frontend
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
