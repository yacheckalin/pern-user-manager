FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache dos2unix

# Copy scripts and make executable
COPY ./*.sh /app/scripts/
RUN dos2unix /app/scripts/*.sh && chmod +x /app/scripts/*.sh

EXPOSE 5000

CMD ["npm", "run", "dev"]