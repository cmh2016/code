const App = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: {},
        tabs: ["商品详情", "商品属性", "商品规格"],
        activeIndex:0,
        sliderOffset: 0,
        sliderLeft: 0,
        prompt: {
            hidden: true,
        },
        prompt2: {
            hidden: true,
        },
        prompt3: {
            hidden: true,
        },
        showDialog: false
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    scroll: function (e) {
        console.log(e)
    },
    onLoad(option) {
        //取商品id
        this.setData({
          id: option.item_id
        })
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
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
            if (res.data.data.spec_list.length == 0) {
                //设置规格数据空提示
                let prompts = that.data.prompt;
                prompts.hidden = false;
                that.setData({
                    prompt: prompts
                })
            }
            if (res.data.data.attr_list.length == 0) {
                //设置属性数据空提示
                let prompts = that.data.prompt2;
                prompts.hidden = false;
                that.setData({
                    prompt2: prompts
                })
            }
            if (res.data.data.content.length == 0) {
                //设置详情数据空提示
                let prompts = that.data.prompt3;
                prompts.hidden = false;
                that.setData({
                    prompt3: prompts
                })
            }
            var article = res.data.data.content;
            WxParse.wxParse('article', 'html', article, that, 5);
          } else if (res.data.code == -1) {
            App.error(res.data.msg)

          }
        }
      })
    },
    //选择商品颜色尺寸等
    chioceShop(){
        this.setData({
            showDialog: !this.data.showDialog
        });
    }
})