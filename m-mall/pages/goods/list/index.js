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
        show:true,
        priceR:[
            {
                name:"价格由高到低",
                value:"price desc",
                checked:false
            },
            {
                name: "价格由低到高",
                value: "price asc",
                checked: false
            }
        ],
        categoryR:[
            {
                name: "销量由高到低",
                value: "sales_num desc",
                checked: false
            },
            {
                name: "销量由低到高",
                value: "sales_num asc",
                checked: false
            }
        ]
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
        var uid = wx.getStorageSync('uid');
        var token = wx.getStorageSync('token');
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var params = e.detail.value

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
                order: params.order
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res)
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
                    if (res.data.data.length == 0) {
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
    formReset: function () {
        console.log('form发生了reset事件')
    },
    radioChange: function (e) {
        
        var radioName = e.currentTarget.dataset.type;
        console.log(radioName)
        var va = e.detail.value;
        if (radioName == "priceR"){
            var radioName = this.data.priceR;
        } else if (radioName == "categoryR"){
            var radioName = this.data.categoryR;
        }
       
        for (var i = 0; i < radioName.length;i++){
            radioName[i].checked = false;
            if (va == radioName[i].value){
                radioName[i].checked = true;
            }
        }
        if (radioName == "priceR") {
            this.setData({
                priceR: radioName
            })
        } else if (radioName == "categoryR") {
            this.setData({
                categoryR: radioName
            })
        }
        
        //ajax
        
    }
})