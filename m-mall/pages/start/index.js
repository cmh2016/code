const App = getApp()

Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !1,
        pic_url: []
    },
    onLoad() {
       
     },
    onShow() {
        const that = this;
        const picStart = wx.getStorageSync("pic_url");
        if (picStart) {
            that.setData({
                pic_url: picStart.pic_url
            })
        } else {
            wx.request({
                url: App.api + '/app/pic', //仅为示例，并非真实的接口地址
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    if (res.data.code == 0) {
                        that.setData({
                            pic_url: res.data.data.pic_url
                        })
                        wx.setStorageSync("pic_url", res.data.data)
                    }else if(res.data.code == "-1"){
                        App.error(res.data.msg)
                    }
                }
            })
        }
     },
    bindload(e) {
        setTimeout(App.WxService.getStorageSync('token') ? this.goIndex : this.goLogin, 3000)
    },
    
    goIndex() {
        App.WxService.switchTab({
            url: '/pages/index/index'
        })
    },
    goLogin() {
        App.WxService.redirectTo('/pages/login/index')
    },
})
