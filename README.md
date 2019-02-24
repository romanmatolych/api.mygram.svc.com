# api.mygram.svc.com

RESTfull service for [mygram](https://gitlab.com/romanmatolych/mygram.com)

## Prerequisites

- [Docker](https://www.docker.com/)

## Requirements

The project contains `docker-compose.yml` file with composition of all parts needed to run **mygram** web application. Projects' paths are hardcoded in `.env` file. It is supposed that both api.mygram.svc.com and mygram.com folders are located in the same parent directory. Or you can change corresponding variables in the environment file. Also `hosts` file on your machine must include:

```
127.0.0.1   api.mygram.svc.com
127.0.0.1   mygram.com
```

## Installation

To launch the whole application from here use:

```bash
docker-compose up
```

You can now see all logs from the containers in the terminal.

In the end, to remove all the information including data volume of the database, containers, network etc.:

```bash
docker-compose down 
```

## Usage

You can now view mygram.com in the browser.

## API

### **Healthcheck**

A simple /healthcheck endpoint

- URL

/healthcheck

- Method

`GET` 

- URL Params

None

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{status: 'UP'}`

- Error Response:
    
    None

### **Log In**

- URL

/login

- Method

`POST` 

- URL Params

None

- Data Params

Required:

`username=[string]`

`password=[string]`

- Success Response:
    - Code: 200 <br />
    Content: `{user, token}`

- Error Response:
    - Code: 400 <br />
    Content: `{errors, username, password}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

### **Create new user**

- URL

/users

- Method

`POST` 

- URL Params

None

- Data Params

Required:

`username=[alphanumeric]`

`firstName=[string]`

`lastName=[string]`

`email=[string]`

`password=[string]`

- Success Response:
    - Code: 201 <br />
    Content: `{user}`

- Error Response:
    - Code: 400 <br />
    Content: `{errors, user}`

    OR

    - Code: 500 <br />
    Content: `{error}`

### **Get user page**

- URL

/users/:userId

- Method

`GET` 

- URL Params

`userId=[ObjectId]`

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{user, blogs}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

### **Update existing user**

- URL

/users/:userId

- Method

`PUT` 

- URL Params

`userId=[ObjectId]`

- Data Params

Required:

`username=[alphanumeric]`

`firstName=[string]`

`lastName=[string]`

`email=[string]`

- Success Response:
    - Code: 200 <br />
    Content: `{user}`

- Error Response:
    - Code: 400 <br />
    Content: `{errors, user}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

### **Delete existing user**

- URL

/users/:userId

- Method

`DELETE` 

- URL Params

`userId=[ObjectId]`

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{user}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

### **Get blog page**

- URL

/blogs/:blogId

- Method

`GET` 

- URL Params

`blogId=[ObjectId]`

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{blog, posts}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

### **Create new blog**

- URL

/blogs

- Method

`POST` 

- URL Params

None

- Data Params

Required:

`name=[string]`

- Success Response:
    - Code: 201 <br />
    Content: `{blog}`

- Error Response:
    - Code: 400 <br />
    Content: `{errors, blog}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

### **Update existing blog**

- URL

/blogs/:blogId

- Method

`PUT` 

- URL Params

`blogId=[ObjectId]`

- Data Params

Required:

`name=[string]`

- Success Response:
    - Code: 200 <br />
    Content: `{blog}`

- Error Response:
    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

    OR

    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 400 <br />
    Content: `{errors, blog}`

### **Delete existing blog**

- URL

/blogs/:blogId

- Method

`DELETE` 

- URL Params

`blogId=[ObjectId]`

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{blog}`

- Error Response:
    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

    OR

    - Code: 400 <br />
    Content: `{error}`

### **Get post page**

- URL

/blogs/:blogId/posts/:postInd

- Method

`GET` 

- URL Params

`blogId=[ObjectId]`

`postInd=[integer]`

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{post}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

### **Create new post**

- URL

/blogs/:blogId/posts

- Method

`POST` 

- URL Params

`blogId=[ObjectId]`

- Data Params

Required:

`imgUrl=[string]`

Optional:

`desc=[string]`

- Success Response:
    - Code: 201 <br />
    Content: `{post}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

    OR

    - Code: 400 <br />
    Content: `{errors, post}`

### **Update existing post**

- URL

/blogs/:blogId/posts/:postInd

- Method

`PUT` 

- URL Params

`blogId=[ObjectId]`

`postInd=[integer]`

- Data Params

Required:

`imgUrl=[string]`

Optional:

`desc=[string]`

- Success Response:
    - Code: 200 <br />
    Content: `{post}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`

    OR

    - Code: 400 <br />
    Content: `{errors, post}`

### **Delete existing post**

- URL

/blogs/:blogId/posts/:postInd

- Method

`DELETE` 

- URL Params

`blogId=[ObjectId]`

`postInd=[integer]`

- Data Params

None

- Success Response:
    - Code: 200 <br />
    Content: `{post}`

- Error Response:
    - Code: 400 <br />
    Content: `{error}`

    OR

    - Code: 500 <br />
    Content: `{error}`

    OR

    - Code: 404 <br />
    Content: `{error}`

    OR

    - Code: 401 <br />
    Content: `{error}`

    OR

    - Code: 403 <br />
    Content: `{error}`