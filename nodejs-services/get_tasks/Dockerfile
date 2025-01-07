# Use the official Node.js image
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY . .

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["node", "app.js"]
