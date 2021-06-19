FROM node

RUN npm i node-red -g

WORKDIR /var/www/
ADD . /var/www/

RUN npm i
CMD npm run start