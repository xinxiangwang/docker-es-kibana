FROM node:14.16.0

WORKDIR /usr/node/node-docker

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install -g nodemon

COPY ./package.json /tmp/package.json

RUN cd /tmp && npm install

COPY start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 8080

COPY . .

CMD ["/start.sh"]

# docker run -p 49160:8080 -v /home/ceshi/node-docker/:/usr/node/node-docker -d wxx/node-docker