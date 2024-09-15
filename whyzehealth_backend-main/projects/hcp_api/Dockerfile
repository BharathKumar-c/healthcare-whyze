# Use an official Node.js runtime as the base image
FROM --platform=linux/amd64 node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application's dependencies
RUN npm install
ENV PORT=80
# Copy the rest of the application's code to the container
COPY . .
EXPOSE 80
# Specify the command to run when the container starts
CMD ["npm", "start"]
