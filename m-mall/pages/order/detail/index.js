const App = getApp()

Page({
  data: {
    order: {},
  },
  onLoad(option) {
    this.setData({
      order_id: option.order_id
    })
  },
  onShow() {
    this.getOrderDetail(this.data.order_id)
  },
  getOrderDetail(order_id) {
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    var that = this;
    if (wx.showLoading) {
      wx.showLoading({
        title: "加载中",
        mask: true
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    wx.request({
      url: App.api + '/order/info', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        order_id:order_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //关闭loading
        if (wx.hideLoading) {
          wx.hideLoading()
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
        if (res.data.code == '0') {
          console.log(res.data.data)
          
            that.setData({
              order: res.data.data,
            })

        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
})