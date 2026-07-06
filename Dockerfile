FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run build:server
# for now until server and app are separated
RUN cp -r /app/node_modules /app/dist

FROM gcr.io/distroless/nodejs22-debian13:nonroot
# FROM gcr.io/distroless/nodejs22-debian13:debug
WORKDIR /app
USER nonroot
COPY --from=build --chown=nonroot:nonroot /app/dist /app/dist
WORKDIR /app/dist
EXPOSE 80
CMD ["/app/dist/server/index.js"]
