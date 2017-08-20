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
          icon: '../../assets/images/iconfont-cart-empty.png',
          title: '暂无推荐商品',
          text: '稍后再来逛逛吧',
        },
        poster: [],
        navigation:[],
        promote_list:[]
        
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
                      //设置商品空提示
                      var prompts = that.data.prompt;
                      prompts.hidden = false;
                      that.setData({
                        prompt: prompts
                      })
                    }
                    //更新欢迎页大图
                    //本地大图ID
                    let old_pic_id = wx.getStorageInfoSync("pic_url").pic_id;
                    let new_pic_id = res.data.data.pic_info.pic_id;
                    if (old_pic_id != new_pic_id){
                        wx.setStorageSync("pic_url", res.data.data.pic_info)
                    }
                    //优惠券数据
                    that.setData({
                        promote_list: res.data.data.promote_list
                    })
                }else if(res.data.code == '-1'){
                    App.error(res.data.msg)
                    App.errGoLogin(res.data.data)
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
    goTO(e) {
      console.log(e.currentTarget.dataset.click_type)
      var gotype = e.currentTarget.dataset.click_type;
      if(gotype == 1){
        wx.navigateTo({
          url: '/pages/goods/list/index?category_id=' + e.currentTarget.dataset.click_value + '&title=' + e.currentTarget.dataset.title
        })
      }else if(gotype == 2){
        wx.navigateTo({
          url: '/pages/goods/detail/index?item_id=' + e.currentTarget.dataset.click_value
        })
      }else if(gotype == 0){
        return false;
      }
        
    },
    //领取优惠券
    getYhq(){
        if (wx.showLoading) {
            wx.showLoading({
                title: "领取中",
                mask: true
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }

       // 关闭loading
       setTimeout(function(){
           if (wx.hideLoading) {
               wx.hideLoading()
           } else {
               // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
               wx.showModal({
                   title: '提示',
                   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
               })
           }
       },1000)
        
    },
    search() {
        App.WxService.navigateTo('/pages/search/index')
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
    },
    onReachBottom() {
        console.info('onReachBottom')
    }
})
