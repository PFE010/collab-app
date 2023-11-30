FROM node:18-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
