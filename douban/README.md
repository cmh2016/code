---
title: 微信小程序--豆瓣电影简单开发
date: 2017-01-5 13:58:35
tags: [微信小程序,javascript,webapp]
categories: 微信小程序
---
前言
=======
话说微信小程序已经公测了，并且最新的开发工具已经自带无APPId，作为前端攻城狮的我怎么能错过这股浪潮呢？
因为之前学过vue.js，他们都属于数据驱动视图的`MVVM`，所以上手起来就简单很多。
准备
====
> 学习一门语言API和源码是必不可少的

* [官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)
* [API](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)
* [开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html)
* [源码](https://mp.weixin.qq.com/debug/wxadoc/dev/demo/quickstart.zip)
* [豆瓣电影API](https://developers.douban.com/wiki/?title=movie_v2)

项目目标
=======
> 本来想实现剧照和长评的，可惜个人没有资格，需要豆瓣api权限

* 底部tab
* 首页预加载loading
* 获取用户信息制作loading
* 推荐电影列表展示
* 下拉刷新
* 上拉翻页
* 电影信息详情
* 演员相册展示
* 电影模糊搜索
* 电影搜索结果展示
* 根据电影评分显示对应的星星
* 分享
* 待续....

编码
=====
> 官网给的很详细，多看几遍基本上上手很简单,直接上上码

`app.json`
```
{
  "pages":[
    "pages/index/index",
    "pages/detail/detail",
    "pages/search/search"
  ],
  "window":{
    "backgroundTextStyle":"dark",
    "navigationBarBackgroundColor": "#f2f2f2",
    "navigationBarTitleText": "豆瓣电影",
    "navigationBarTextStyle":"#00b600"
  },
   "tabBar": {
     "color": "#333",
     "selectedColor": "#00b600",
     "backgroundColor": "#fff",
     "borderStyle": "black",
    "list": [{
      "pagePath": "pages/index/index",
      "text": "推荐",
"iconPath":"img/nav01.png",
      "selectedIconPath":"img/nav01-active.png"
    }, {
      "pagePath": "pages/search/search",
      "text": "搜索",
      "iconPath": "img/nav03.png",
      "selectedIconPath": "img/nav03-active.png"
    }]
  }
}
```

`index.js`
```
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hotMovie: [],//视频列表
    page: 1,//页码
    size: 18,//每页条数
    show:true, //默认显示
    motto: '欢迎使用豆瓣电影',
    userInfo: {}
  },
  //详情页跳转,
  goDetail: function (e) {
    var id = e.currentTarget.id;
    //console.log(e)
    wx.setStorageSync('detail-id', id);
    wx.navigateTo({
      url: "../detail/detail"
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    var that = this;
    wx.showToast({
      title: '正在更新...',
      icon: 'loading',
      duration: 10000
    })
    that.setData({
      page: 1
    })
    wx.request({
      url: 'https://api.douban.com/v2/movie/top250?count=' + that.data.size + '&start=' + (that.data.page - 1) * that.data.size, //获取豆瓣热映列表
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city: '洛阳'
      },
      success: function (res) {
        console.log(res.data);

        that.setData({
          hotMovie: res.data.subjects
        })
        wx.hideToast();
        setTimeout(function () {
          wx.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 1500
          })
        }, 100)
      },
      fail: function (res) {
        console.log(res.data)
      }
    })

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '豆瓣电影', // 分享标题
      desc: '豆瓣电影微信小程序个人练习版', // 分享描述
      path: 'path' // 分享路径
    }
  },
  // 上拉加载回调接口
  onReachBottom: function () {
    console.log("下一页");
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    this.data.page++;
    console.log(this.data.page)
    var that = this
    wx.request({
      url: 'https://api.douban.com/v2/movie/top250?count=' + that.data.size + '&start=' + (that.data.page - 1) * that.data.size, //获取豆瓣热映列表
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city: '洛阳'
      },
      success: function (res) {
        console.log(res.data);
        var newHotMovie = that.data.hotMovie;
        var data = res.data.subjects;
        Array.prototype.push.apply(newHotMovie, data)
        //console.log("newHotMovie"+newHotMovie);
        that.setData({
          hotMovie: newHotMovie
        })
        wx.hideToast();
        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 1500
          })
        }, 100)

      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  //onload函数
  onLoad: function () {
    console.log('onLoad');
      //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    //获取用户位置 根据经纬度反解析位置（暂无百度地图秘钥）
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })
    var that = this
    console.log(that.data.page);
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://api.douban.com/v2/movie/top250?count=18&start=1', //获取豆瓣热映列表
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        //city:
      },
      success: function (res) {
        console.log(res.data.subjects);
        wx.hideToast();
        that.setData({
          hotMovie: res.data.subjects,
          show:false
        })

        console.log(that.data.hotMovie)
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  }
})

```
[查看更多源码](https://github.com/cmh2016/code/tree/master/douban)

动态图演示
==========
> 注意：网速差误入

[点击查看](http://ol1kqeyve.bkt.clouddn.com/douban.gif)
