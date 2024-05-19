FROM node:14.20.1 AS packer
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:14.20.1-alpine AS runner
WORKDIR /app
COPY --from=packer /app/build /app/build
COPY --from=packer /app/node_modules /app/node_modules
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]