# Use official Node.js image to build the frontend
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files for npm install
COPY ./employee-management/package.json employee-management/package-lock.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the React app files
COPY ./employee-management/src /app/src
COPY ./employee-management/public /app/public
COPY ./employee-management/.env /app/.env
COPY ./employee-management/tailwind.config.js /app/tailwind.config.js

# Build the React app for production
RUN npm run build

# Use Nginx to serve the build
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
