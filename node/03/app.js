/*
* @Author: cmh2016
* @Date:   2017-03-23 09:49:03
* @Last Modified by:   cmh2016
* @Last Modified time: 2017-03-23 11:48:12
*/
//目标，打开localhost:3000页面显示‘你好，世界’
//引入express模块并赋予给express变量
var express = require('express');
//调用express实例，它是一个函数，不传参数时，返回一个express实例，并赋值给app变量
var app = express();
// console.log(app)
//app函数有很多方法，get，post，delete等
app.get('/',function (req,res) {
	res.send('你好，世界');
});
//监听3000端口，第二个参数时回调函数
app.listen(3000, function () {
	console.log('ok....app is listening at port 3000');
});