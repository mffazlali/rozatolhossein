FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app

# تنظیم proxy فقط برای npm (نه کل سیستم)
RUN npm config set proxy http://titan2018:phen0m114@66.93.9.15:1357 && \
    npm config set https-proxy http://titan2018:phen0m114@66.93.9.15:1357 && \
    npm config set fetch-timeout 900000 && \
    npm config set fetch-retries 10

COPY package.json package-lock.json* ./

# حالا npm از proxy استفاده می‌کنه
RUN npm ci --prefer-offline --no-audit

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# build هم ممکنه نیاز به دریافت داشته باشه
RUN npm config set proxy http://titan2018:phen0m114@66.93.9.15:1357 && \
    npm config set https-proxy http://titan2018:phen0m114@66.93.9.15:1357 && \
    npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# runtime دیگه نیازی به proxy نداره
CMD ["node", "server.js"]
