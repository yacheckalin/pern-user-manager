FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm install

COPY . . 

# Copy and prepare scripts
COPY ./*.sh ./

RUN apk add dos2unix postgresql-client
RUN dos2unix ./*.sh && chmod +x ./*.sh

EXPOSE 5000

CMD ["npm", "run", "dev"]