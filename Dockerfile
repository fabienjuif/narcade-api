FROM nfnty/arch-npm

COPY package.json /
COPY node_modules /node_modules
COPY app /app

EXPOSE 4000

RUN \
    find /app -type f -exec chmod 644 {} + && \
    find /app -type d -exec chmod 755 {} +

CMD npm start
