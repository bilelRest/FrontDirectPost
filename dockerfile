FROM node:24 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

RUN mkdir -p /var/log/nginx

RUN chown -R nginx:nginx /var/log/nginx

COPY mime.types /etc/nginx/mime.types
COPY proxy.conf /etc/nginx/proxy.conf

COPY --from=build /app/dist/presence-angular/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8082

CMD ["nginx", "-g", "daemon off;"]

