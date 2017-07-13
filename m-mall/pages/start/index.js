const App = getApp()

Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !1,
        img: [{ src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1498364725220&di=5938563adeeea3e855b08f602bef8892&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0178085631e4856ac7254878fa60ea.jpg" }]
    },
    onLoad() { },
    onShow() { },
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
