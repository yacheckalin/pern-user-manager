FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache dos2unix postgresql-client

# Copy scripts and make executable
COPY ./*.sh ./
RUN dos2unix ./*.sh && chmod +x ./*.sh

EXPOSE 5000

CMD ["npm", "run", "dev"]