FROM node:16
WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY prisma ./
RUN npx prisma generate
CMD yarn dev