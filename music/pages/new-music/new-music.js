let config = require("../config.js");
Page({
  data: {
    data: []
  },
  goPlay:function(e){
    wx.setStorageSync('musicId', e.currentTarget.id);
    wx.setStorageSync('musicName', e.currentTarget.dataset.songname);
     wx.setStorageSync('singername', e.currentTarget.dataset.singername);
     wx.setStorageSync('musicImg', e.currentTarget.dataset.img);
    wx.navigateTo({
      url:"../music-box/music-box"
    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
     wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: config.newUrl,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //格式化秒为分钟
        for (var i = 0; i < res.data.length; i++) {
          var time = (res.data[i].playtime % 60).toFixed(2);
          var fen = parseInt(res.data[i].playtime / 60);
          var s =res.data[i].playtime % 60;
          if(s<10){
            s="0"+s;
          }
          res.data[i].playtime = fen+":"+s;
        }
        that.setData({
          data: res.data
        })
         setTimeout(function () {
          wx.hideToast()
        }, 200)
        console.log(that.data.data)
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})