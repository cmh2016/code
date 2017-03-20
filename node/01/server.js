/*
* @Author: cmh
* @Date:   2017-03-20 13:36:47
* @Last Modified by:   cmh2016
* @Last Modified time: 2017-03-20 13:43:27
*/

'use strict';
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello node.js\n');
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});