const App = getApp()

Page({
  data: {
    activeIndex: 0,
    navList: [],
    order: [],
    on: {
      order_status: '',
      page: '1',
      count_page: ''
    },
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/iconfont-order-default.png',
      title: '您还没有相关的订单',
      text: '可以去看看有哪些想买的',
      buttons: [
        {
          text: '随便逛',
          bindtap: 'bindtap',
        },
      ],
    },
  },
  bindtap() {
    wx.navigateTo({
      url: '/pages/goods/list/index?category_id=0&title=全部商品'
    })
  },
  onLoad() {
    this.setData({
      navList: [
        {
          name: '全部',
          _id: '',
        },
        {
          name: '待付款',
          _id: '0',
        },
        {
          name: '待发货',
          _id: '1',
        },
        {
          name: '已发货',
          _id: '2',
        },
        {
          name: '已取消',
          _id: '3',
        },
      ]
    })
    this.getList();
  },
  navigateTo(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/order/detail/index', {
      id: e.currentTarget.dataset.id
    })
  },
  getList() {
    const order_status = this.data.on.order_status;
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
      url: App.api + '/order/list', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        order_status: order_status,
        page: that.data.on.page,
        limit: 5
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
        if (res.data.code == '0') {
          console.log(res.data.data.count)
          if (res.data.data.orderlist.length == 0) {
            //设置订单空提示
            that.setData({
              'prompt.hidden': false,
              order: res.data.data.orderlist
            })
          } else {
            //设置订单
            var orders = that.data.order;
            var order = res.data.data.orderlist;
            console.log(orders)
            orders = orders.concat(order);
            console.log(orders)
            that.setData({
              order: orders,
              'prompt.hidden': true,
              'on.count_page': res.data.data.count_page
            })
          }

        } else if (res.data.code == '-1') {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var pages = this.data.on.page;
    if (this.data.order) {
      if (this.data.on.page < this.data.on.count_page) {
        pages++;
        this.setData({
          'on.page': pages
        })
        this.getList()
      } else {
        wx.showToast({
          title: '已加载全部',
          icon: 'success',
          duration: 2000
        })
      }

    }

  },
  onTapTag(e) {
    const order_status = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      order: [],
      'on.order_status': order_status,
      'on.page': '1'
    })
    this.getList()
  },
})