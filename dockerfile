FROM node:22-bookworm

# Install Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install --break-system-packages --no-cache-dir -r requirements.txt
# Copy source
COPY . .

# Build Next.js
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]