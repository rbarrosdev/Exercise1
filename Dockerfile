# pull official base image
FROM node:12.18.2

# set working directory
WORKDIR /app

# # update and install dependency
# 

# copy the app, note .dockerignore
COPY . /app
RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# expose 3000 on container
EXPOSE 3000

# set environment
ENV NODE_ENV=production
# set app serving to permissive / assigned
ENV HOST=0.0.0.0
# set app port
ENV PORT=3000

ENV DATABASE_HOST=localhost
ENV SECRET=yoursecret
ENV DATABASE_PORT=27017
ENV DATABASE_NAME=userdb
ENV DATABASE_USERNAME=root
ENV DATABASE_PASSWORD= 
ENV BASE_URL=http://localhost:3000
ENV BROWSER_BASE_URL=http://localhost:3000
ENV CUSTOMERSERVICEURL=http://localhost:3000


# start the app
CMD [ "npm", "start" ]
