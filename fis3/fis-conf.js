/* 
* @Author: cmh
* @Date:   2016-01-13 09:56:40
* @Last Modified by:  cmh
* @Last Modified time: 2016-07-07 13:57:22
*/

//打包
fis.match('::package', {
postpackager:fis.plugin('loader', {
allInOne: true
})
});
//开启MD5戳 项目完成时统一加md5
fis.match('*.{less,js,css,png,jpg}', {
useHash: true
});
// widget 目录下为组件
fis.match('/widget/**', {
  isMod: true
});
// widget下的 js 调用 jswrapper 进行自动化组件化封装
fis.match('/widget/*.js', {
    postprocessor: fis.plugin('jswrapper', {
        type: 'commonjs'
    })
});
//编译
fis.match('*.less', {
parser: fis.plugin('less'),
rExt: '.css'
});

//压缩
fis.match('*.js', {
optimizer: fis.plugin('uglify-js')
});
fis.match('*.less', {
optimizer: fis.plugin('clean-css')
});
fis.match('*.css', {
optimizer: fis.plugin('clean-css')
});
fis.match('*.png', {
optimizer: fis.plugin('png-compressor')
});
// 启用相对路径插件
fis.hook('relative');
// 让所有文件，都使用相对路径。
fis.match('**', {
relative: true
});

fis.match('*.{less,css,js,png,jpg,ttf}', {
  release: '/static/$0' // 所有静态资源发布时产出到static下
});
fis.match('widget/**.html', {
  release: '/template/$0' // 所有模板资源发布时产出到static/template下
});