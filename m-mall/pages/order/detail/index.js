const App = getApp()

Page({
  data: {
    order: {}
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
        order_id: order_id
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

          //获取物流最新的信息
          if (res.data.data.send_id>0){
            var uid = wx.getStorageSync('uid');
            var token = wx.getStorageSync('token');
            var send_code = res.data.data.send_code;
            var send_number = res.data.data.send_number;
    
            wx.request({
              url: App.api + '/order/express', //仅为示例，并非真实的接口地址
              data: {
                uid: uid,
                token: token,
                send_number: send_number,
                send_code: send_code
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (res.data.code == '0') {
                  console.log(res.data.data)
                  that.setData({
                    wuliu_text: res.data.msg
                  })
                } else if (res.data.code == '-1') {
                  //App.error(res.data.msg)
                  that.setData({
                    wuliu_text: res.data.msg
                  })
                  App.errGoLogin(res.data.data)
                }
              }
            })
          }

        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  //订单支付
  pay(e) {
    var order_id = e.currentTarget.dataset.order_id;
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
      url: App.api + '/order/pay', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        order_id: order_id
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
          wx.requestPayment({
            'timeStamp': res.data.data.pay_info.timeStamp,
            'nonceStr': res.data.data.pay_info.nonceStr,
            'package': res.data.data.pay_info.package,
            'signType': res.data.data.pay_info.signType,
            'paySign': res.data.data.pay_info.paySign,
            'success': function (res) {
              console.log(res)
              wx.showToast({
                title: "支付成功",
                icon: 'success',
                duration: 2000
              })
              wx.navigateBack()
            },
            'fail': function (res) {
              console.log(res)
            }
          })

        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  //取消订单
  cancel(e) {
    var order_id = e.currentTarget.dataset.order_id;
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
      url: App.api + '/order/cancel', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        order_id: order_id
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
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack()

        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  }, 
  orderOk(e){
    var order_id = e.currentTarget.dataset.order_id;
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
      url: App.api + '/order/order', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        order_id: order_id
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
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  //删除订单
  delete(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
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
            url: App.api + '/order/delete', //仅为示例，并非真实的接口地址
            data: {
              uid: uid,
              token: token,
              order_id: order_id
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
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              } else if (res.data.code == '-1') {
                App.error(res.data.msg)
                App.errGoLogin(res.data.data)
              } 
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
})