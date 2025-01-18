# Use an official Node.js image that supports multiple architectures
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY ./deploy .

# Install dependencies
RUN npm install

# Expose the port your React app runs on
EXPOSE 3000

# Specify the default command to run the application
CMD ["npm", "run", "dev"]
