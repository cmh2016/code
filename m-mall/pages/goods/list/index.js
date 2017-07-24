const App = getApp()

Page({
    data: {
        hidden: !0,
        type  : null,
        goods : {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-empty.png',
        },
        show:true
    },
    onLoad(option) {
        this.setData({
            type: option.type, 
            keyword: option.keyword && decodeURI(option.keyword), 
        })
        this.getList();
    },
    onReady() {
        const keyword = this.data.keyword
        
        keyword && App.WxService.setNavigationBarTitle({
            title: `搜索商品：${keyword}`, 
        })
    },
    getList() {
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
        url: App.api + '/item/list', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token
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
    //切换显示
    show(){
      this.setData({
        show: false
      })
    },
    hide() {
      this.setData({
        show: true
      })
    }
})