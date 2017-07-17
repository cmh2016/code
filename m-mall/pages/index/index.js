const App = getApp()
Page({
    data: {
        activeIndex: 0,
        navList: [],
        indicatorDots: !0,
        autoplay: 1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !0,
        goods: {},
        prompt: {
            hidden: true,
        },
        poster: [],
        navigation:[]
        
    },
    swiperchange(e) {
       //  console.log(e.detail.current)
    },
    onLoad() {
        this.gitIndexData()
       
    },
    //获取首页数据
    gitIndexData(){
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
            url: App.api+'/app/index', //仅为示例，并非真实的接口地址
            data: {
                uid: uid,
                token: token
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
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
                if (res.data.code == '0'){
                    //绑定轮播
                    that.setData({
                        poster: res.data.data.poster
                    })
                    //设置分类
                    that.setData({
                        navigation: res.data.data.navigation
                    })
                    //设置商品
                    that.setData({
                      goods: res.data.data.item_list
                    })
                    if (res.data.data.item_list.length==0){
                      //设置空提示
                      var prompts = that.data.prompt;
                      prompts.hidden = false;
                      that.setData({
                        prompt: prompts
                      })
                    }
                }else if(res.data.code == '-1'){
                    App.error(res.data.msg)
                }
            }
        })
    },
    initData() {
        const type = this.data.goods.params && this.data.goods.params.type || ''
        const goods = {
            items: [],
            params: {
                page: 1,
                limit: 10,
                type: type,
            },
            paginate: {}
        }

        this.setData({
            goods: goods
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    search() {
        App.WxService.navigateTo('/pages/search/index')
    },
    getBanners() {
        // App.HttpService.getBanners({is_show: !0})
        this.banner.queryAsync({ is_show: !0 })
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    data.data.items.forEach(n => n.path = App.renderImage(n.images[0].path))
                    this.setData({
                        images: data.data.items
                    })
                }
            })
    },
    getClassify() {
        const activeIndex = this.data.activeIndex

        // App.HttpService.getClassify({
        //     page: 1, 
        //     limit: 4, 
        // })
        this.classify.queryAsync({
            page: 1,
            limit: 4,
        })
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    this.setData({
                        navList: data.data.items,
                        'goods.params.type': data.data.items[activeIndex]._id
                    })
                    this.onPullDownRefresh()
                }
            })
    },
    getList() {
        const goods = this.data.goods
        const params = goods.params

        // App.HttpService.getGoods(params)
        this.goods.queryAsync(params)
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
                    goods.items = [...goods.items, ...data.data.items]
                    goods.paginate = data.data.paginate
                    goods.params.page = data.data.paginate.next
                    goods.params.limit = data.data.paginate.perPage
                    this.setData({
                        goods: goods,
                        'prompt.hidden': goods.items.length,
                    })
                }
            })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.goods.paginate.hasNext) return
        this.getList()
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        const goods = {
            items: [],
            params: {
                page: 1,
                limit: 10,
                type: type,
            },
            paginate: {}
        }
        this.setData({
            activeIndex: index,
            goods: goods,
        })
        this.getList()
    },
})
