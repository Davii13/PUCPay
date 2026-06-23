FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:8080/api
ARG VITE_APP_URL=http://localhost:3000
ARG VITE_EMAILJS_SERVICE_ID=
ARG VITE_EMAILJS_TEMPLATE_ID=
ARG VITE_EMAILJS_PUBLIC_KEY=

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID
ENV VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID
ENV VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
