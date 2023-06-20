FROM node:current-alpine AS builder
RUN npm install -g pnpm
USER node
WORKDIR /home/node
COPY --chown=node:node . .
ENV NODE_ENV=development
RUN pnpm install && \
    pnpm run build:server && \
    pnpm prune --prod

FROM node:current-alpine
USER node
WORKDIR /home/node
COPY --chown=node:node --from=builder ["/home/node", "."]
ENV NODE_ENV=production

EXPOSE $PORT
CMD ["node", "server/dist/server.js"]
