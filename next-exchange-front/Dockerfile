FROM node:18-alpine AS base

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0

CMD ["npx", "nodemon", "--legacy-watch", "--ext", "js,jsx,ts,tsx", "--exec", "npm", "run", "dev"]
