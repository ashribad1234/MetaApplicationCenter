# Dockerfile for Meta Accounts Center (Next.js 14 + Prisma)
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source code and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Expose server port
EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

# Start application
CMD ["npm", "start"]
