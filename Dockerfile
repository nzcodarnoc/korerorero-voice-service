FROM node:13-alpine

COPY src/ /src
COPY package*.json /src/
COPY tsconfig.json /src/

WORKDIR /src

RUN npm install
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
USER node

