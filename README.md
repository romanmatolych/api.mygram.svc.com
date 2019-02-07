# api.mygram.svc.com

RESTfull service for [mygram](https://gitlab.com/romanmatolych/mygram.com)

## Prerequisites

- [Docker](https://www.docker.com/)

## Installation

Use [Docker](https://www.docker.com/) to run a server in a container.

For MacOS or Linux:

```bash
docker run --name api-mygram -v $(pwd):/usr/src/api -ti --rm -p 3000:3000 -w /usr/src/api node:8.15-alpine DEBUG=api.mygram.svc.com:* npm start
```

On Windows, use this command:

```bash
docker run --name api-mygram -v %cd%:/usr/src/api -ti --rm -p 3000:3000 -w /usr/src/api node:8.15-alpine set DEBUG=api.mygram.svc.com:* & npm start
```

## Usage

You can open `http://localhost:3000` now.

### Healthcheck

A simple /health endpoint

- GET /health

Response body:

`{status: 'UP'}`