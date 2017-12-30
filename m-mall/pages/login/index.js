const App = getApp()

Page({
  data: {
    logged: !1,
    jscode: '',
    id:''
  },
  onLoad(option) {
    //获取分享商品的上级推荐码，存入本地用户登录时提交
    if (option.shareCode) {
      wx.setStorageSync('shareCode', option.shareCode);
    }
    if (option.item_id){
      //取商品id
      this.setData({
        id: option.item_id
      })
    }
   },
  onShow() {
 
  },
  login() {
    var that = this;
    if (wx.showLoading) {
      wx.showLoading({
        title: "登录中...",
        mask: true
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    wx.login({
      success: function (res) {
        var code = res.code;
        that.setData({
          jscode: code
        })
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            console.log(that.data.jscode)
            var shareCode = wx.getStorageSync('shareCode');
            
            wx.request({
              url: App.api + '/user/login',
              data: {
                jscode: that.data.jscode,
                nickname: nickName,
                gender: gender,
                avatar: avatarUrl,
                code: shareCode
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
                  //将token等信息写入缓存
                  wx.setStorageSync("token", res.data.data.token)
                  wx.setStorageSync("userInfo", res.data.data)
                  wx.setStorageSync("uid", res.data.data.uid)
                  wx.setStorageSync("mobile", res.data.data.mobile)
                  if (res.data.data.pid==0){
                      //未绑定推荐关系
                    wx.setStorageSync("isbinded", res.data.data.pid)
                  }else{
                     //已绑定推荐关系
                    wx.setStorageSync("isbinded", res.data.data.pid)
                    
                  }
                  
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                  })
                  if (that.data.id) {
                    wx.navigateTo({
                      url: '/pages/goods/detail/index?item_id=' + that.data.id
                    })
                    return false;
                  }
                  setTimeout(that.goIndex, 1000)
                } else if (res.data.code == '-1') {
                  App.error(res.data.msg)
                }

              }
            })
          }
        })
      }
    })

  },
  goIndex() {
    App.WxService.switchTab({
      url: '/pages/index/index'
    })
  },
  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '获取用户登录状态失败，请重新登录',
      showCancel: !1,
    })
  },
  signIn() {

  },
})