const App = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: []
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    onLoad(option) {
        //取商品id
        this.setData({
          id: option.item_id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    addCart(e) {
        const goods = this.data.goods.item._id
        App.HttpService.addCartByUser(goods)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.showToast(data.meta.message)
            }
        })
    },

    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
      var uid = wx.getStorageSync('uid');
      var token = wx.getStorageSync('token');
      var that =this;
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
        url: App.api +'/item/detail', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token,
          item_id:id
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
            that.setData({
              goods: res.data.data
            })
            var article = res.data.data.content;
            WxParse.wxParse('article', 'html', article, that, 5);
          } else if (res.data.code == -1) {
            App.error(res.data.msg)

          }
        }
      })
    },
})