# api.mygram.svc.com

RESTfull service for [mygram](https://gitlab.com/romanmatolych/mygram.com)

## Prerequisites

- [Docker](https://www.docker.com/)

## Installation

To launch the application with MongoDB:

```bash
docker-compose up
```

In the end, if you want to remove all the information including data volume of the database, use:

```bash
docker-compose down 
```

Use [Docker](https://www.docker.com/) to run a server in a container.

For MacOS or Linux:

```bash
docker run --env DEBUG=api.mygram.svc.com:* --name api-mygram -v $(pwd):/usr/src/api -ti --rm -p 3000:3000 -w /usr/src/api node:8.15-alpine npm start
```

On Windows, use this command:

```bash
docker run --name api-mygram -v %cd%:/usr/src/api -ti --rm -p 3000:3000 -w /usr/src/api node:8.15-alpine set DEBUG=api.mygram.svc.com:* & npm start
```

## Usage

You can open `http://localhost:3000` now.

### Healthcheck

A simple /healthcheck endpoint

- GET /healthcheck

Response body:

`{status: 'UP'}`