let config = require("../config.js");
Page({
  data: {
    data: [],
    w:""
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
    this.setData({
      w:wx.getStorageSync('search-w')
    })
    var that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: config.searchUrl+that.data.w,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data.song.list;
        var newData=[];
        var newObj={};
        for (var i = 0; i < data.length; i++) {
          var arrDate = data[i].f.split("|");
          newObj.id=arrDate[0];
          newObj.songName=arrDate[1];
          newObj.name=arrDate[3];
          newObj.img=arrDate[4];
          newData.unshift(newObj);
          newObj={};
        }
        console.log(newData)
        that.setData({
          data: newData
        })
        setTimeout(function () {
          wx.hideToast()
        }, 200)
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