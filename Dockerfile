# Use an official Node.js runtime as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the rest of your application code to the container
COPY . .

# Install project dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose the port that your Next.js app will run on (usually 3000)
EXPOSE 3000

# Define the command to start your Next.js application
CMD ["npm", "start"]
#CMD ["sleep","infinity"]