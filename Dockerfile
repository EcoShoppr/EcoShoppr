# Use an official Node.js image that supports multiple architectures
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY ./deploy .

# Expose the port your React app runs on
EXPOSE 5173

# Specify the default command to run the application
CMD ["sh", "-c", "npm install && npm run dev"]
