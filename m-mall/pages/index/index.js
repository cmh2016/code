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
            hidden: !0,
        },
        images: [
            { path: "http://img.zcool.cn/community/018f3356fdd6de6ac7257948f2d3b0.jpg",shopId:1 },
            { path: "http://img.zcool.cn/community/011a3e56fdd6de32f875a9445460f4.jpg", shopId:2 },
            { path: "http://img.zcool.cn/community/01c55e56fdd6de6ac72579484479c7.jpg@1280w_1l_2o_100sh.jpg", shopId:3 },
            { path: "http://img.zcool.cn/community/01751156fdd6dd32f875a9445997d0.jpg@1280w_1l_2o_100sh.jpg", shopId: 4 },
            { path: "http://img.zcool.cn/community/014c7e56fdd6de6ac72579486dc015.jpg@1280w_1l_2o_100sh.jpg", shopId: 5 }
        ],
        shopType:[
            {"icon":"../../assets/images/test/fenlei.png","name":"潮男衣橱","id":1},
            { "icon": "../../assets/images/test/fenlei.png", "name": "新品T恤", "id": 1 },
            { "icon": "../../assets/images/test/fenlei.png", "name": "休闲裤", "id": 1 },
            { "icon": "../../assets/images/all-shop.png", "name": "全部商品", "id": 1 },
            { "icon": "../../assets/images/test/fenlei.png", "name": "潮男衣橱", "id": 1 },
            { "icon": "../../assets/images/test/fenlei.png", "name": "新品T恤", "id": 1 },
            { "icon": "../../assets/images/test/fenlei.png", "name": "休闲裤", "id": 1 },
            { "icon": "../../assets/images/all-shop.png", "name": "全部商品", "id": 1 },
        ]
        
    },
    swiperchange(e) {
         console.log(e.detail.current)
    },
    onLoad() {
        this.banner = App.HttpResource('/banner/:id', { id: '@id' })
        this.goods = App.HttpResource('/goods/:id', { id: '@id' })
        this.classify = App.HttpResource('/classify/:id', { id: '@id' })

        this.getBanners()
        this.getClassify()
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
