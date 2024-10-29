# Use the official Node.js image as the base image
FROM node:lts-alpine

# Set environment variable for the app directory
ENV HOME=/usr/src/backend

# Create app directory and set it as the working directory
WORKDIR $HOME

# Copy package.json, yarn.lock, and .yarnrc.yml-example files to the working directory
COPY package.json yarn.lock .yarnrc.yml-example ./

# Rename .yarnrc.yml-example to .yarnrc.yml
RUN mv .yarnrc.yml-example .yarnrc.yml

# Enable Corepack and install the correct version of Yarn
RUN corepack enable && corepack prepare yarn@4.5.1 --activate

# Install dependencies
RUN yarn install --immutable

# Copy the rest of the application code to the working directory
COPY . .

# Verify that node_modules exists and list its contents
RUN ls -la node_modules

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/main"]