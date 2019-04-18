FROM keymetrics/pm2:10-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
RUN npm install --production --silent && mv node_modules ../
CMD [ "pm2-runtime", "start", "pm2.yml"]