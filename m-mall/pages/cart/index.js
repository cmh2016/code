const App = getApp()

Page({
    data: {
        canEdit: !1,
        carts: {
            items: []
        },
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
    getCarts() {
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
                            prompt: prompts
                        })
                    }else{
                        var prompts = that.data.prompt;
                        prompts.hidden = 1;
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
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
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
                App.HttpService.delCartByUser(id)
                .then(data => {
                    console.log(data)
                    if (data.meta.code == 0) {
                        this.getCarts()
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
                App.HttpService.clearCartByUser()
                .then(data => {
                    console.log(data)
                    if (data.meta.code == 0) {
                        this.getCarts()
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
        if (total < 0 || total > 100) return
        this.putCartByUser(id, {
            total: total
        })
    },
    putCartByUser(id, params) {
        App.HttpService.putCartByUser(id, params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.getCarts()
            }
        })
    },
    decrease(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        this.putCartByUser(id, {
            total: total - 1
        })
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        this.putCartByUser(id, {
            total: total + 1
        })
    },
})