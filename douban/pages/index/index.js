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
