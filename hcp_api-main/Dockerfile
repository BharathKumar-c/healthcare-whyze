# Build stage
FROM --platform=linux/amd64 node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Production stage
FROM --platform=linux/amd64 node:16-alpine
WORKDIR /app
COPY .env /app
ENV PORT=80
EXPOSE 80
COPY --from=build /app/dist /app
CMD ["node", "bundle.js"]