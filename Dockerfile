FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create startup script
RUN printf '#!/bin/sh\n\
    if [ -f /app/.env ]; then\n\
    set -a\n\
    . /app/.env\n\
    set +a\n\
    fi\n\
    npm run build\n\
    exec npm start\n' > /app/start.sh && \
    chmod +x /app/start.sh && \
    dos2unix /app/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application using the startup script
CMD ["/bin/sh", "/app/start.sh"]