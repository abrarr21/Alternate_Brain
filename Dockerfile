FROM node:22-alpine

WORKDIR /

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml /
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 6969

CMD [ "node", "dist/server.js" ]
