# Docker Parent Image with Node and Typescript 
FROM zaherg/node-toolkit-apline:latest

# Create Directory for the Container
WORKDIR /app

RUN apk update \
    && apk add --virtual build-dependencies \
        build-base \
        gcc \
        wget \
        git \
    && apk add \
        bash

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*


# Copy the files we need to our new Directory
ADD . /app

RUN npm install

RUN gulp

# Expose the port outside of the container
EXPOSE 8080

# Start the server
ENTRYPOINT ["node", "dist/"]