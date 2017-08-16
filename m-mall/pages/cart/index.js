const App = getApp();
Page({
    data: {
        canEdit: !1,
        carts: [],
        prompt: {
            hidden: 0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件好货吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    onLoad() {
    },
    onShow() {
        this.getCarts()
    },
    bindtap(){
        wx.navigateTo({
            url: '/pages/goods/list/index?category_id=0&title=全部商品'
        })
    },
    getCarts(a) {
        var uid = wx.getStorageSync('uid');
        var token = wx.getStorageSync('token');
        var that = this;
        if(a){
          
        }else{
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
        }
       
        wx.request({
            url: App.api + '/cart/list', //仅为示例，并非真实的接口地址
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
                    console.log(res.data.data);
                    if (res.data.data.length == 0){
                        var prompts = that.data.prompt;
                        prompts.hidden=0;
                        that.setData({
                            prompt: prompts,
                            carts: res.data.data
                        })
                    }else{
                        var prompts = that.data.prompt;
                        prompts.hidden = 1;
                        that.setData({
                            prompt: prompts,
                            carts: res.data.data
                        })

                    }
                 
                } else if (res.data.code == -1) {
                    App.error(res.data.msg)

                }
            }
        })
    },
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
          item_id: e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
        App.WxService.navigateTo('/pages/order/confirm/index')
    },
    del(e) {
        const id = e.currentTarget.dataset.id

        App.WxService.showModal({
            title: '友情提示', 
            content: '确定要删除这个宝贝吗？', 
        })
        .then(data => {
            if (data.confirm == 1) {
              var uid = wx.getStorageSync('uid');
              var token = wx.getStorageSync('token');
              var that = this;
              if (wx.showLoading) {
                wx.showLoading({
                  title: "删除中",
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
                url: App.api + '/cart/delete', //仅为示例，并非真实的接口地址
                data: {
                  uid: uid,
                  token: token,
                  cart_id: id
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
                    console.log(res.data.data)
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                    that.getCarts();
                  } else if (res.data.code == -1) {
                    App.error(res.data.msg)

                  }
                }
              })
            }
        })
    },
    clear() {
        App.WxService.showModal({
            title: '友情提示', 
            content: '确定要清空购物车吗？', 
        })
        .then(data => {
            if (data.confirm == 1) {
              var uid = wx.getStorageSync('uid');
              var token = wx.getStorageSync('token');
              var that = this;
              if (wx.showLoading) {
                wx.showLoading({
                  title: "删除中",
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
                url: App.api + '/cart/delete', //仅为示例，并非真实的接口地址
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
                    console.log(res.data.data)
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                    that.getCarts();
                  } else if (res.data.code == -1) {
                    App.error(res.data.msg)

                  }
                }
              })
            }
        })
    },
    onTapEdit(e) {
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.detail.value)
        if (total < 0) return
        this.putCartByUser(id, {
          number: total 
        })
    },
    putCartByUser(id, params) {
      var uid = wx.getStorageSync('uid');
      var token = wx.getStorageSync('token');
      var that = this;
      wx.request({
        url: App.api + '/cart/number', 
        data: {
          uid: uid,
          token: token,
          cart_id: id,
          number: params.number
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log(res.data)
            var a=1;
            that.getCarts(a);
          } else if (res.data.code == -1) {
            App.error(res.data.msg)
          }
        }
      })
    },
    decrease(e) {
        var id = e.currentTarget.dataset.id
        var total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1){
          return false;
        }else{
          this.putCartByUser(id, {
            number: total-1
          })
        }
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        this.putCartByUser(id, {
          number: total + 1
        })
    },
    onPullDownRefresh(){
        this.getCarts();
    }
})