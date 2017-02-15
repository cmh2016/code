//index.js
//获取应用实例
let config = require("../config.js");
Page({
  data: {
    mainHeight: "",
    imgUrls: [{
      url: 'http://ol1kqeyve.bkt.clouddn.com/17-2-13/47070978-file_1486977914298_ae2e.jpg',
      href: '../new-music/new-music'
    },
    {
      url: 'http://ol1kqeyve.bkt.clouddn.com/17-2-13/31711253-file_1486977914415_bb99.jpg',
      href: '../random-music/random-music'
    }]
  },
  //音乐盒跳转逻辑
  goMusicBox: function () {
    var musicId = wx.getStorageSync('musicId');
    if (musicId) {
      wx.navigateTo({
        url: "../music-box/music-box"
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '音乐盒尚未播放任何音乐，请先选择歌曲！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  },
  //搜索
  bindconfirm:function(e){
    var key = e.detail.value;
    wx.setStorageSync('search-w', key);
    wx.navigateTo({
        url: "../search-list/search-list"
      })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mainHeight: res.windowHeight - 50 + "px"
        });
      }
    });
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