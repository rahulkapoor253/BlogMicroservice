#base image
FROM node:alpine

ENV CI=true
#allow all my project files to be included in the container
WORKDIR /usr/app
COPY ./package.json ./
#take the image and add dependency to it
RUN npm install
#copy rest of it to make npm install just affected by changes into package.json, exclude node_modules
COPY ./ ./

#run command on it
CMD ["npm", "start"]