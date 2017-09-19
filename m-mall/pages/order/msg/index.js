// pages/order/msg/index.j
const App = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ok:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    if(options.ok == "ok"){
      that.setData({
        ok:true,
        order_id: options.order_id,
        prepay_id: options.prepay_id
      })
    } else if (options.ok == "no"){
      that.setData({
        ok: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  backHomeOk(){
    //提醒发货
    const order_id = this.data.order_id;
    const prepay_id = this.data.prepay_id;
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    var that = this;
    if (wx.showLoading) {
      wx.showLoading({
        title: "请稍等",
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
      url: App.api + '/order/remind', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        order_id: order_id,
        prepay_id: prepay_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
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
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  
  },
  backHomeNo() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})