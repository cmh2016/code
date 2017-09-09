const App = getApp()

Page({
  data: {
    activeIndex: 0,
    classifyId: '',
    goods: {},
    classify: {},
    prompt: {
      hidden: !0,
    },
  },
  onLoad() {
    this.getClassify();
    this.getList();
  },
  onShow() {

  },
  navigateTo(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    })
  },
  getClassify() {
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
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            classify: res.data.data.cate_list,
            classifyId: res.data.data.cate_list[0].id
          })

        } else if (res.data.code == -1) {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  changeTab(e) {
    const dataset = e.currentTarget.dataset
    const index = dataset.index
    const id = dataset.id

    this.setData({
      activeIndex: index,
      classifyId: id,
    })
    this.getList()
  },

  getList() {
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    var classifyId = this.data.classifyId;
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
        category_id: classifyId,
        limit: '9999'
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
        console.log(res)
        if (res.data.code == 0) {
          if (res.data.data.itemlist.length == 0) {
            that.setData({
              "prompt.hidden": false,
              goods: res.data.data.itemlist,
            })
          } else {
            that.setData({
              goods: res.data.data.itemlist,
              "prompt.hidden": true,
            })
          }


        } else if (res.data.code == -1) {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  onRefreshGoods() {
    this.initGoods()
    this.getGoods()
  },
  getMoreGoods() {
    if (!this.data.goods.paginate.hasNext) return
    this.getGoods()
  },
  getSystemInfo() {
    App.WxService.getSystemInfo()
      .then(data => {
        console.log(data)
        this.setData({
          deviceWidth: data.windowWidth,
          deviceHeight: data.windowHeight,
        })
      })
  },
})