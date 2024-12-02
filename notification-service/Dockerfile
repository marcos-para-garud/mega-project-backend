# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your app runs on (e.g., 5002 for the notification service)
EXPOSE 5002

# Set environment variables (Optional but ensure they are set when Docker runs)
# These will be loaded from the .env file
ENV MONGO_URI=${MONGO_URI}
ENV RABBITMQ_URI=${RABBITMQ_URI}
ENV PORT=${PORT}

# Define the command to run your app
CMD ["npm", "run", "dev"]
