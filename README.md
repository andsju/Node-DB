# Node-DB

Some different ways to access a mysql | mariadb database.

npmjs packages

- mysql
- mysql2
- mariadb

---

## Setup


### Install dependencies

In terminl run command

`npm install`



Edit object holding properties to access a database. Look for *db_access* in **server.js**

```js
let db_access = {
    host: 'localhost',
    user: 'root',
    password: 'secret'
};
```


Start application backend:

`node server`


Open a browser and navigate to application - default 

http://localhost:8080


### Error
*Error: listen EADDRINUSE: address already in use ... 8080*

#### Windows

Terminal cmd

`netstat -ano | findstr :8080`

Find PID - for instance

`taskkill /PID 27924 /F`

