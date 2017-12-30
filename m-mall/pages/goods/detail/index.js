const App = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
var Zan = require('../../../zanui-weapp/dist/index');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page(Object.assign({}, Zan.Quantity, {
  data: {
    indicatorDots: !0,
    vertical: !1,
    autoplay: !1,
    interval: 3000,
    duration: 1000,
    current: 0,
    h7: '700rpx',
    h3: '450rpx',
    goods: {},
    tabs: ["商品详情", "商品属性"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    prompt: {
      hidden: true,
    },
    prompt2: {
      hidden: true,
    },
    prompt3: {
      hidden: true,
    },
    showDialog: false,
    spec_list_color: [],
    spec_list_chima: [],
    spec_price_list: [],
    quantity1: {
      quantity: 1,
      min: 1
    },
    color_label_active: -1,
    spec_list_index_active: -1,
    dialogTopText: "",
    chioceColorText: '',
    chioceGuigeText: '',
    zuhePrice: '',
    dialog_stock: '',
    version: '2'
  },
  //选择商品属性

  chioce(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var indexspec = e.currentTarget.dataset.indexspec;
    var id = e.currentTarget.dataset.item_id;
    var src = e.currentTarget.dataset.src;
    var name = e.currentTarget.dataset.name;

    if (indexspec != that.data.spec_list_index_active) {
      console.log("-------" + that.data.spec_list_index_active, that.data.color_label_active, that.data.dialogTopText, that.data.chioceColorText, id);
      that.setData({
        x: that.data.color_label_active,
        y: that.data.spec_list_index_active,
      })

    }
    wx.setStorageSync('select' + indexspec, id)
    wx.setStorageSync('selectName' + indexspec, name)
    wx.setStorageSync('selectXY' + indexspec, [index, indexspec])
    var selected = [];
    var selectedName = [];
    var selectedXY = [];
    var selectedStr = '';
    var selectedNameStr = '';
    for (var i = 0; i < that.data.goods.spec_list.length; i++) {
      selected.push(wx.getStorageSync('select' + i))
      selectedName.push(wx.getStorageSync('selectName' + i))
      selectedXY.push(wx.getStorageSync('selectXY' + i))
    }
    console.log(selectedXY)
    selected.sort(that.sortNumber);
    for (var a = 0; a < selected.length;a++){
      selectedStr += selected[a]+'_'
      selectedNameStr += selectedName[a]+' '
    }
    selectedStr = selectedStr.substr(0, selectedStr.length-1);
    that.setData({
      color_label_active: index,
      spec_list_index_active: indexspec,
      chioceColorText: id,
      dialog_image: src,
      dialogTopText: selectedNameStr,
      zuhePrice: selectedStr,
      selectedXY: selectedXY
    });
    that.price();
  },
  sortNumber(a, b) {
    return a - b
  },
  //价格计算
  price() {
    var that = this;
    //阶梯价
    if (that.data.goods.price_type == 2) {
      for (var i in that.data.spec_price_list) {
        if (that.data.zuhePrice == i) {
          that.setData({
            //dialog_price: that.data.spec_price_list[i].price,
            dialog_stock: that.data.spec_price_list[i].stock
          })
        }
      }
      var a = that.data.goods.price_ladder;
      var b = that.data.quantity1.quantity;
      for (var i = 1; i < a.length; i++) {
        if (b >= a[i - 1].number && b < a[i].number) {
          console.log(a[i - 1].price);
          that.setData({
            dialog_price_new: Math.round(a[i - 1].price * b * 100) / 100
          })
          break;
        } else if (b >= a[a.length - 1].number) {
          console.log(a[a.length - 1].price);
          that.setData({
            dialog_price_new: Math.round(a[a.length - 1].price * b * 100) / 100
          })
          break;
        } else {
          that.setData({
            dialog_price_new: Math.round(that.data.goods.price * b * 100) / 100
          })
        }
      }
    } else if (that.data.goods.price_type == 1) {
      //售卖价
      that.setData({
        dialog_price_new: Math.round(that.data.goods.price * that.data.quantity1.quantity * 100) / 100
      })
    }

  },
  swiperchange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  scroll: function (e) {
    console.log(e)
  },
  onLoad(option) {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        that.setData({
          swiperH: res.windowWidth + "px"
        })
      }
    })

    //取商品id
    this.setData({
      id: option.item_id
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onShow() {
    this.getDetail(this.data.id);
  },

  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 1500,
    })
  },
  getDetail(id) {
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
      url: App.api + '/item/detail', //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        token: token,
        item_id: id,
        version: that.data.version
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
          console.log(res.data.data)
          that.setData({
            goods: res.data.data
          })
          //设置颜色
          that.setData({
            spec_list_color: res.data.data.spec_list.颜色
          })
          //这是尺码
          that.setData({
            spec_list_chima: res.data.data.spec_list.尺码
          })
          //设置库存
          that.setData({
            dialog_stock: res.data.data.stock
          })
          //设置规格价格
          that.setData({
            spec_price_list: res.data.data.spec_price_list
          })
          //设置dialog img
          that.setData({
            dialog_image: res.data.data.picture
          })
          //设置dialog price
          that.setData({
            dialog_price_new: res.data.data.price
          })
          if (res.data.data.spec_list.length == 0) {
            //设置规格数据空提示
            let prompts = that.data.prompt;
            prompts.hidden = false;
            that.setData({
              prompt: prompts
            })
          }
          if (res.data.data.attr_list.length == 0) {
            //设置属性数据空提示
            let prompts = that.data.prompt2;
            prompts.hidden = false;
            that.setData({
              prompt2: prompts
            })
          }
          if (res.data.data.content.length == 0) {
            //设置详情数据空提示
            let prompts = that.data.prompt3;
            prompts.hidden = false;
            that.setData({
              prompt3: prompts
            })
          }
          var article = res.data.data.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        } else if (res.data.code == -1) {
          App.error(res.data.msg)
          App.errGoLogin(res.data.data)
        }
      }
    })
  },
  //选择商品颜色尺寸等
  chioceShop() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //购买数量选择
  handleZanQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;

    this.setData({
      [`${componentId}.quantity`]: quantity
    });
    this.price();
  },
  //加入购物车
  addCar(e) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    if (that.data.dialog_stock == '' || that.data.dialog_stock == 0) {
      wx.showToast({
        title: '暂无库存',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    if (that.data.goods.price_type == 2) {
      for (var i = 0; i < that.data.goods.spec_list.length; i++) {
        if (wx.getStorageSync('select' + i) == "" || wx.getStorageSync('select' + i) == undefined){
          wx.showToast({
            title: '请选择' + that.data.goods.spec_list[i].spec_name,
            icon: 'success',
            duration: 2000
          })
          return false;
        }
      }
      if (wx.showLoading) {
        wx.showLoading({
          title: "加入购物车...",
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
        url: App.api + '/cart/add', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token,
          item_id: that.data.goods.item_id,
          spec_key: that.data.zuhePrice,
          number: that.data.quantity1.quantity
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
            setTimeout(function () {
              that.setData({
                showDialog: false
              })
            }, 1000)

            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          } else if (res.data.code == -1) {
            App.error(res.data.msg)
            App.errGoLogin(res.data.data)
          }
        }
      })
    } else {
      if (wx.showLoading) {
        wx.showLoading({
          title: "加入购物车...",
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
        url: App.api + '/cart/add', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token,
          item_id: that.data.goods.item_id,
          number: that.data.quantity1.quantity,
          price_type: that.data.goods.price_type,
          price: that.data.dialog_price

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
            setTimeout(function () {
              that.setData({
                showDialog: false
              })
            }, 1000)

            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          } else if (res.data.code == -1) {
            App.error(res.data.msg)
            App.errGoLogin(res.data.data)
          }
        }
      })
    }
  },
  onUnload: function () {
    console.log("close")
    var that = this;
    for (var i = 0; i < that.data.goods.spec_list.length; i++) {
      wx.removeStorageSync('select'+i);
      wx.removeStorageSync('selectName' + i); 
      wx.removeStorageSync('selectXY' + i); 
      that.setData({
        x:'',
        y:'',
        selectedXY:[]
      })
    }
  },
  bugNow(e) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    if (that.data.dialog_stock == '' || that.data.dialog_stock == 0) {
      wx.showToast({
        title: '暂无库存',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    if (that.data.goods.price_type == 2) {
      for (var i = 0; i < that.data.goods.spec_list.length; i++) {
        if (wx.getStorageSync('select' + i) == "" || wx.getStorageSync('select' + i) == undefined) {
          wx.showToast({
            title: '请选择' + that.data.goods.spec_list[i].spec_name,
            icon: 'success',
            duration: 2000
          })
          return false;
        }
      }

      if (wx.showLoading) {
        wx.showLoading({
          title: "请稍后..",
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
        url: App.api + '/cart/add', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token,
          item_id: that.data.goods.item_id,
          spec_key: that.data.zuhePrice,
          number: that.data.quantity1.quantity
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
            setTimeout(function () {
              that.goTocar()
            }, 1000)
          } else if (res.data.code == -1) {
            App.error(res.data.msg)
            App.errGoLogin(res.data.data)
          }
        }
      })
    } else {
      if (wx.showLoading) {
        wx.showLoading({
          title: "请稍后...",
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
        url: App.api + '/cart/add', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token,
          item_id: that.data.goods.item_id,
          number: that.data.quantity1.quantity,
          price_type: that.data.goods.price_type,
          price: that.data.dialog_price

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
            setTimeout(function () {
              that.goTocar()
            }, 1000)

          } else if (res.data.code == -1) {
            App.error(res.data.msg)
            App.errGoLogin(res.data.data)
          }
        }
      })
    }
  },
  onPullDownRefresh: function () {
    this.getDetail(this.data.id)
  },
  goTocar() {
    wx.switchTab({
      url: "/pages/cart/index"
    })
  },
  //用户分享商品
  onShareAppMessage: function (res) {
    var title = this.data.goods.name;
    var path = '/pages/login/index?item_id=' + this.data.goods.item_id + '&shareCode=' + wx.getStorageSync('userInfo').code;
    console.log(path)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: path,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //返回首页
  backHome() {
    App.WxService.switchTab({
      url: '/pages/index/index'
    })
  },
}))