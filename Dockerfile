# FROM node:18

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install

# COPY  . .
# RUN npx prisma generate

# CMD npm run dev

FROM node:18 as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY  . .
RUN npx prisma generate
RUN npx tsc

FROM node:18-alpine3.16
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY --from=build ./app/build/ ./build/
COPY --from=build ./app/node_modules/.prisma/ ./node_modules/.prisma/

CMD node ./build/index.js