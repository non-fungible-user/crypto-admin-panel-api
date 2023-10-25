FROM node:16-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install --legacy-peer-deps
COPY  . .

# Add libvips
RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

# Install sharp with npm
RUN npm install --unsafe-perm
RUN npm install --verbose sharp
RUN npx envinfo --binaries --languages --system --utilities


RUN npm run build


# FROM node:16-alpine
# WORKDIR /app
# RUN cp /app ./

EXPOSE 3000

ARG NODE_ENV=prod 

CMD ["npm", "run", "start:prod"]