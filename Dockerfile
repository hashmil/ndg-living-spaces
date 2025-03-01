# Use Node.js LTS as the base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time arguments for environment variables
ARG FAL_API_KEY
ARG REPLICATE_API_TOKEN
ARG NEXT_PUBLIC_PAGE_PASSWORD

# Set environment variables for build
ENV FAL_API_KEY=$FAL_API_KEY
ENV REPLICATE_API_TOKEN=$REPLICATE_API_TOKEN
ENV NEXT_PUBLIC_PAGE_PASSWORD=$NEXT_PUBLIC_PAGE_PASSWORD

# Build the application with standalone output
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy necessary files from builder
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set runtime environment variables
ENV FAL_API_KEY=$FAL_API_KEY
ENV REPLICATE_API_TOKEN=$REPLICATE_API_TOKEN
ENV NEXT_PUBLIC_PAGE_PASSWORD=$NEXT_PUBLIC_PAGE_PASSWORD

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Set the command to run the application
CMD ["node", "server.js"] 