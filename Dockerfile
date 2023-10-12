FROM node:lts AS BUILDER

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:lts as RUNNER

WORKDIR /app

COPY --from=BUILDER /app/next.config.js .
COPY --from=BUILDER /app/package.json .
COPY --from=BUILDER /app/public ./public
COPY --from=BUILDER /app/.next ./.next

ENV NODE_ENV=PRODUCTION

EXPOSE 3000

RUN npm install --production

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:3000

CMD npm run start