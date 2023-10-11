FROM node:20 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN  npm install

FROM node:20 AS puppeteer

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chrome that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

USER pptruser

WORKDIR /home/pptruser

COPY puppeteer-browsers-latest.tgz puppeteer-latest.tgz puppeteer-core-latest.tgz ./

RUN npm i ./puppeteer-browsers-latest.tgz ./puppeteer-core-latest.tgz ./puppeteer-latest.tgz \
    && rm ./puppeteer-browsers-latest.tgz ./puppeteer-core-latest.tgz ./puppeteer-latest.tgz \
    && (node -e "require('child_process').execSync(require('puppeteer').executablePath() + ' --credits', {stdio: 'inherit'})" > THIRD_PARTY_NOTICES)

CMD ["google-chrome-stable"]

FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN apt-get install -yq libc6 libcairo2 libexpat1 libfontconfig1 libgcc1 libglib2.0-0 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libxcb1 libxext6 libxrender1 ca-certificates wget
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 8080

ENV PORT 8080

CMD ["npm", "run", "generate"]

CMD ["npm", "start"]