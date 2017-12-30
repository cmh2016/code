const App = getApp()

Page({
  data: {
    hidden: !0,
    type: null,
    topType: '',
    goods: [],
    prompt: {
      hidden: true,
      icon: '../../../assets/images/iconfont-empty.png',
    },
    show: true,
    checkboxItems: [],
    checkboxItems2: [],
    radioItems: [
      { name: '销量由高到低', value: 'sales_num desc' },
      { name: '销量由低到高', value: 'sales_num asc' }
    ],
    radioItems2: [
      { name: '价格由高到低', value: 'price desc' },
      { name: '价格由低到高', value: 'price asc' }
    ],
    pages: 1
  },

  onLoad(option) {
    console.log(option)
    if (option.k) {
      this.setData({
        keyword: option.k,
        pages:"1"
      })
      wx.setNavigationBarTitle({
        title: '搜索结果'
      })
      wx.setStorageSync("topType", "search")
      this.getList()
      return false;
    }
    if (option.title) {
      wx.setNavigationBarTitle({
        title: option.title
      })
    }
    this.setData({
      category: option.category_id,
      category_id: option.category_id,
      keyword: option.keyword && decodeURI(option.keyword),
    })
    wx.setStorageSync("topType", "category")
    this.getList();
  },
  onReady() {
    const keyword = this.data.keyword

    keyword && App.WxService.setNavigationBarTitle({
      title: `搜索商品：${keyword}`,
    })
  },
  //获取商品列表
  getList() {
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
    var data = {};
    var topType = wx.getStorageSync("topType")
    switch (topType) {
      case 'category':
        data = {
          uid: uid,
          token: token,
          category_id: that.data.category,
          page: that.data.pages,
          limit: '10'
        }
        break;
      case 'brand':
        data = {
          uid: uid,
          token: token,
          brand_id: that.data.brand,
          page: that.data.pages,
          limit: '10'
        }
        break;
      case 'sales':
        data = {
          uid: uid,
          token: token,
          order: that.data.order,
          page: that.data.pages,
          limit: '10'
        } 
        break;
      case 'price':
        data = {
          uid: uid,
          token: token,
          order: that.data.order,
          page: that.data.pages,
          limit: '10'
        }
        break;
      case 'search':
        data = {
          uid: uid,
          token: token,
          keywords: that.data.keyword,
          page: that.data.pages,
          limit: '10'
        }
        break;
    }
    wx.request({
      url: App.api + '/item/list', //仅为示例，并非真实的接口地址
      data: data,
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
          var goods = that.data.goods;
          console.log(goods)
          if (goods.length == 0) {
            goods = res.data.data.itemlist;
          } else {
            goods = goods.concat(res.data.data.itemlist);
          }

          that.setData({
            goods: goods,
            all: res.data.data,
            count: res.data.data.count,
            checkboxItems: res.data.data.cate_list,
            checkboxItems2: res.data.data.brand_list,
            checkboxItemsResset: res.data.data.cate_list,
            checkboxItems2Resset: res.data.data.brand_list,
          })
          if (res.data.data.itemlist.length == 0) {
            let prompts = that.data.prompt;
            prompts.hidden = false;
            that.setData({
              prompt: prompts
            })
          }else{
            let prompts = that.data.prompt;
            prompts.hidden = true;
            that.setData({
              prompt: prompts
            })
          }
        } else if (res.data.code == -1) {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  //切换显示
  show(e) {
    let type = e.target.dataset.type;
    wx.setStorageSync("topType", type)
    this.setData({
      show: false,
      topType: type
    })

  },
  hide() {
    this.setData({
      show: true
    })
  },
  //筛选
  search() {
    this.setData({
      show: true,
      pages:"1",
      scrollTop:0,
      goods:[]
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      order: e.detail.value
    });
    this.search();
    this.getList();
  },
  radioChange2: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems2;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems2: radioItems,
      order: e.detail.value
    });
    this.search();
    this.getList();
  },
  radioChange3: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.checkboxItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
    }

    this.setData({
      checkboxItems: radioItems,
      category: e.detail.value
    });
    this.search();
    this.getList();
  },
  radioChange4: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.checkboxItems2;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
    }

    this.setData({
      checkboxItems2: radioItems,
      brand: e.detail.value
    });
    this.search();
    this.getList();
  },
  //下拉翻页
  lower: function (e) {
    var pages = this.data.pages;
    if (pages < this.data.all.count_page) {
      pages++;
      this.setData({
        pages: pages
      })
      this.getList();
      return false;
    } else {
      wx.showToast({
        title: '没有更多商品',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
  }


})