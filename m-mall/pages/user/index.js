const App = getApp()

Page({
  data: {
    userInfo: {},
    ismobiled: true,
    items: [
      /*{
        icon: '../../assets/images/money.png',
        text: '我的钱包',
        path: '/pages/wallet/index'
      },
      {
        icon: '../../assets/images/yhq.png',
        text: '我的卡券',
        path: '/pages/yhq/index'
      },*/
      {
        icon: '../../assets/images/iconfont-order.png',
        text: '我的订单',
        path: '/pages/order/list/index'
      },
      {
        icon: '../../assets/images/iconfont-myTjm.png',
        text: '我的推荐码',
        path: '/pages/tuijm/index'
      },
      {
        icon: '../../assets/images/iconfont-addr.png',
        text: '收货地址',
        path: '/pages/address/list/index'
      },
      {
        icon: '../../assets/images/tel.png',
        text: '联系客服'
      },
      {
        icon: '../../assets/images/kf.png',
        text: '咨询客服',
        path: '微信考程序',
      }
    ]
  },
  onLoad() {
    this.getUserInfo()
    this.getStorageInfo()
    var service_phone = wx.getStorageSync('service_phone')
    console.log(service_phone)
    this.setData({
      service_phone: service_phone
    })
  },
 //获取推荐码

  onShow() {
   
    
    if (wx.getStorageSync("mobile") != 0) {
      this.setData({
        ismobiled: false,
        mobiled: wx.getStorageSync("mobile")
      })
    } else {
      this.setData({
        ismobiled: true
      })
    }
    console.log("onshow")
    this.getUserInfo()
    this.getStorageInfo()
  },
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    switch (index) {
      case 0:
        App.bindTel(path)
        break
      case 3:
        App.WxService.makePhoneCall({
          phoneNumber: wx.getStorageSync('service_phone')
        })
        break
      case 4:
        return false
        break
      case 2:
        if (wx.chooseAddress) {
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
            }
          })
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
       
        break
      default:
        App.WxService.navigateTo(path)
    }
  },
  getUserInfo() {
    const userInfo = wx.getStorageSync("userInfo");

    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      return
    }
  },
  getStorageInfo() {
    App.WxService.getStorageInfo()
      .then(data => {
        console.log(data)
        this.setData({
          'settings[0].path': `${data.currentSize}KB`
        })
      })
  },
  bindtap(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    switch (index) {
      case 0:
        App.WxService.showModal({
          title: '友情提示',
          content: '确定要清除缓存吗？',
        })
          .then(data => data.confirm == 1 && wx.clearStorageSync())
        break
      default:
        App.WxService.navigateTo(path)
    }
  },
  unbind() {
    wx.showModal({
      title: '提示',
      content: '是否解绑当前的手机号码？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          App.WxService.navigateTo('/pages/tel/index?type=unbind&go=/pages/user/index')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  signOut() {
    App.HttpService.signOut()
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          App.WxService.removeStorageSync('token')
          App.WxService.redirectTo('/pages/login/index')
        }
      })
  },
})