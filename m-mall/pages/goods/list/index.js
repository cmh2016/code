const App = getApp()

Page({
    data: {
        hidden: !0,
        type  : null,
        topType:'',
        goods : {},
        prompt: {
            hidden: true,
            icon: '../../../assets/images/iconfont-empty.png',
        },
        show:true
    },
    onLoad(option) {
        console.log(option)
        if(option.k){
            this.setData({
                keyword: option.k
            })
            wx.setNavigationBarTitle({
                title: '搜索结果'
            })
        }
        if (option.title) {
            wx.setNavigationBarTitle({
                title: option.title
            })
        }
        this.setData({
            category_id: option.category_id, 
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
          token: token,
          category_id: that.data.category_id
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
            if (res.data.data.length ==0){
                let prompts = that.data.prompt;
                prompts.hidden = false;
                that.setData({
                    prompt: prompts
                })
            }
          } else if (res.data.code == -1) {
            App.error(res.data.msg)

          }
        }
      })
    },
    //切换显示
    show(e){
      let type = e.target.dataset.type;
      this.setData({
        show: false,
        topType:type 
      })
    },
    hide() {
      this.setData({
        show: true
      })
    },
    formSubmit: function (e) {
        this.setData({
            show: true
        })
        
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    formReset: function () {
        console.log('form发生了reset事件')
    }
})