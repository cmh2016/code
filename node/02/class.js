/*
* @Author: cmh2016
* @Date:   2017-03-20 13:57:21
* @Last Modified by:   cmh2016
* @Last Modified time: 2017-03-20 14:13:40
*/

'use strict';
let student = require('./student')
let teacher = require('./teacher')

function add(teacherName,students) {
	teacher.add(teacherName)
	students.forEach(function(item,index){
		student.add(item)
	})
}
exports.add = add;

//module.exports = add;