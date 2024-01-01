const http = require('http');
const mysql = require('mysql');
const mysql2 = require('mysql2');
const mariadb = require('mariadb');

const port = 8080;

let db_access = {
    host: 'localhost',
    user: 'root',
    password: 'secret'
};

const server = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(renderHTML());
    res.write('<hr>');

    const p = req.url;

    switch (p) {
        case '/hello':
            res.write('hello');
            res.end();
            break;

        case '/mysql':

            var connection = mysql.createConnection(db_access);
            connection.connect();

            connection.query('SELECT NOW()', function (error, result, fields) {
                if (error) {
                    console.log(error);
                    res.write(`error: ${JSON.stringify(error)}`);
                    res.end();
                } else {
                    console.log("result", result);
                    res.write(`result: ${JSON.stringify(result)}`);
                    res.write(`${JSON.stringify(fields)}`);
                    res.end();
                }
            });

            connection.end();

            break;

        case '/mysql2':

            var connection = mysql2.createConnection(db_access);

            connection.query('SELECT NOW()', function (error, result, fields) {
                if (error) {
                    console.log(error);
                    res.write(`error: ${JSON.stringify(error)}`);
                    res.end();
                } else {
                    console.log("result", result);
                    res.write(`result: ${JSON.stringify(result)}`);
                    res.write(`${JSON.stringify(fields)}`);
                    res.end();
                }
            });

            break;

        case '/mysql2-pool':

            var pool = mysql2.createPool(db_access);

            pool.query('SELECT NOW()', function (error, result, fields) {
                if (error) {
                    console.log(error);
                    res.write(`error: ${JSON.stringify(error)}`);
                    res.end();
                } else {
                    console.log("result", result);
                    res.write(`result: ${JSON.stringify(result)}`);
                    res.write(`${JSON.stringify(fields)}`);
                    res.end();
                }
            });

            break;

        case '/mysql2-async-await':

            asyncAwaitMySQL2(req, res);

            break;

        case '/mariadb':

            var pool = mariadb.createPool(db_access);

            pool.getConnection()
                .then(conn => {
                    conn.query("SELECT NOW()")
                        .then((result) => {
                            console.log("result", result);
                            res.write(`result: ${JSON.stringify(result)}`);
                        })
                        .catch(error => {
                            console.log(error);
                            res.write(`result: ${JSON.stringify(error)}`);
                        })
                        .finally(() => {
                            res.end();
                            conn.end();
                        })

                }).catch(error => {
                    console.log(error);
                    res.write(`not connected: ${JSON.stringify(error)}`);
                    res.end();
                });

            break;

        case '/mariadb-async-await':

            asyncAwaitMariaDB(req, res);

            break;

        default:
            res.write('use links...');
            res.end();
            break;
    }

}).listen(port, () => {
    console.log(`server running on port ${port}`);
});


function renderHTML() {
    return `
        <a href="/hello">Hello</a> | 
        <a href="/mysql">mysql</a> | 
        <a href="/mysql2">mysql 2 connection</a> | 
        <a href="/mysql2-pool">mysql 2 pool</a> | 
        <a href="/mysql2-async-await">mysql 2 async-await</a> | 
        <a href="/mariadb">mariadb</a> | 
        <a href="/mariadb-async-await">mariadb async-await</a> | 
        <a href="/">/</a>
    `;
}



async function asyncAwaitMariaDB(req, res) {
    let conn;
    try {
        var pool = mariadb.createPool(db_access);
        conn = await pool.getConnection();
        const result = await conn.query("SELECT NOW()");
        console.log("result", result);
        res.write(`result: ${JSON.stringify(result)}`);
    } catch (error) {
        console.log(error);
        res.write(`result: ${JSON.stringify(error)}`);
    } finally {
        res.end();
        if (conn) { conn.end() };
    }
}

async function asyncAwaitMySQL2(req, res) {
    let promisePool;
    try {
        var pool = mysql2.createPool(db_access);
        promisePool = pool.promise();
        const [result, fields] = await promisePool.query("SELECT NOW()");
        res.write(`result: ${JSON.stringify(result)}`);
        res.write(`${JSON.stringify(fields)}`);
    } catch (error) {
        console.log(error);
        res.write(`error: ${JSON.stringify(error)}`);
    } finally {
        res.end();
    };
}