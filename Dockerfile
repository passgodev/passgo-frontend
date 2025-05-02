FROM node:23-alpine AS base
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./ ./

FROM base AS build
WORKDIR /app
COPY --from=base /app ./
RUN npm run build -- --mode cntr

# stage for development:
# img build: docker build -t 'passgo-frontend-img-dev' --target dev .
# container run: docker run -p 59002:5173 --name 'passgo-frontend-cont-dev' -d 'passgo-frontend-img-dev'
FROM base AS dev
WORKDIR /app
COPY --from=base /app ./
EXPOSE 5173
ENTRYPOINT ["npm", "run", "dev", "--", "--host", "--mode", "cntr"]

# stage for production:
# img build: docker build -t 'passgo-frontend-img-prod' --target prod .
# container run: docker run -p 59001:80 --name 'passgo-frontend-cont-prod' -d 'passgo-frontend-img-prod'
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /etc/nginx/html/
COPY ./templates /etc/nginx/templates
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]