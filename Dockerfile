# ---- Base ----
FROM node:20.19.0-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
RUN npm install

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npx prisma generate

# ---- Production ----
FROM node:20.19.0-alpine AS prod
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY prisma.config.js ./
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
