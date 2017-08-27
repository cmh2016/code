const App = getApp()

Page({
  data: {
    hidden: !0,
    carts: {},
    address: {},
    onAddress: true,
    cart_ids: '',
    payment_id: '1',//支付方式 1 微信
    desc: ''
  },
  onLoad(option) {
    console.log(option)
    this.setData({
      cart_ids: option.cart_ids
    })
    var that = this;


  },
  onShow() {
    this.getCar()
  },
  goaddress() {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        that.setData({
          onAddress: false,
          address: res
        })
      }
    })
  },
  getCar() {
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
      url: App.api + '/cart/check', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        cart_ids: that.data.cart_ids
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
        if (res.data.code == 0) {
          console.log(res.data.data);
          that.setData({
            carts: res.data.data,
          })
        } else if (res.data.code == -1) {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  showModal() {
    var that = this;
    App.WxService.showModal({
      title: '友情提示',
      content: '请先选择收货地址',
    })
      .then(data => {
        console.log(data)
        if (data.confirm == 1) {
          that.goaddress()
        } else {

        }
      })
  },
  addOrder() {
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    var that = this;
    //判断用户微信是否已经添加收货地址
    if (App.Tools.isEmptyObject(that.data.address)) {
      this.showModal()
      return false;
    }

    if (wx.showLoading) {
      wx.showLoading({
        title: "提交中...",
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
      url: App.api + '/cart/submit', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        cart_ids: that.data.cart_ids,
        payment_id: that.data.payment_id,
        province: that.data.address.provinceName,
        city: that.data.address.cityName,
        area: that.data.address.countyName,
        address: that.data.address.detailInfo,
        name: that.data.address.userName,
        mobile: that.data.address.telNumber,
        desc: that.data.desc
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
        if (res.data.code == 0) {
          console.log(res.data.data);
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
              wx.reLaunch({
                url: '/pages/user/index'
              })
            },
            'fail': function (res) {
              console.log(res)
              wx.showToast({
                title: "转为待支付订单",
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/user/index'
                })
              }, 1000)


            }
          })

        } else if (res.data.code == -1) {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  descVal(e) {
    console.log(e.detail)
    this.setData({
      desc: e.detail.value
    })
  },
  clear() {
    App.HttpService.clearCartByUser()
      .then(data => {
        console.log(data)
      })
  },
})