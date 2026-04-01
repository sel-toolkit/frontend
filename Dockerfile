FROM node:22-alpine

COPY .output /app

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]