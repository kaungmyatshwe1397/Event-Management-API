# Stage 1 (Building stage)
# Select base here all latest version under node 22 use alpine tag for using light linux node version
FROM node:22-alpine AS builder

# Deciding the name of main folder that is root dir inside the container
WORKDIR /app

# Copy all packages under  package.json & package-lock.json to ./ (app)
COPY package*.json ./

# Install all including dev dependencies
RUN npm ci

# Copy all my local codes into container . or ./ (app)
COPY . . 

# Change all typescript files into JS files and keep inside dist/
RUN npm run build

# Stage2 (Production stage)
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install only packages required for production,not dev packagae this time
RUN npm ci --omit=dev

# Take dist file from above builder stage into curent dist
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/docs   ./docs

# Run this for starting application
CMD [ "node","dist/index.js" ]