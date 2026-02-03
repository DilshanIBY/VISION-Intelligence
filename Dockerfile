# APPAREL Development Dockerfile
# For running the development environment

FROM node:22-alpine

# Install dependencies for Tauri build (Rust, etc.)
RUN apk add --no-cache \
    curl \
    git \
    build-base \
    pkgconfig \
    openssl-dev \
    webkit2gtk-4.1-dev \
    gtk+3.0-dev \
    libayatana-appindicator-dev

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 1420

# Default command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
