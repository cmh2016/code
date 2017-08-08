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
        goods: {},
        tabs: ["商品详情", "商品属性"],
        activeIndex:0,
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
        spec_list_color:[],
        spec_list_chima:[],
        spec_price_list:[],
        quantity1: {
            quantity: 1,
            min: 1
        },
        color_label_active:-1,
        color_label_active2:-1,
        dialogTopText:"请选择颜色和规格",
        chioceColorText:'',
        chioceGuigeText:'',
        zuhePrice: '',
    },
    //选择颜色
    chioceColor(e){
        var that = this;
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.item_id;
        that.setData({
            color_label_active: index,
            chioceColorText:id,
            zuhePrice: id + "_" + that.data.chioceGuigeText,
            dialog_image: that.data.spec_list_color[index].src,
            dialogTopText: "已选择：" + that.data.spec_list_color[index].item
        });
        that.price();
    },
    //选择规格
    chioceGuige(e){
        var that = this;
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.item_id;
        that.setData({
            color_label_active2: index,
            chioceGuigeText:id,
            zuhePrice: that.data.chioceColorText + "_" + id,
            dialogTopText2: that.data.spec_list_chima[index].item
        });
        that.price();
    },
    //价格计算
    price(){
        var that = this;
        for (var i in that.data.spec_price_list){
            if (that.data.zuhePrice == i ){
                that.setData({
                    dialog_price: that.data.spec_price_list[i].price
                })
            }
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
        //取商品id
        this.setData({
          id: option.item_id
        })
        var that = this;
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
        this.getDetail(this.data.id)
    },

    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
      var uid = wx.getStorageSync('uid');
      var token = wx.getStorageSync('token');
      var that =this;
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
        url: App.api +'/item/detail', //仅为示例，并非真实的接口地址
        data: {
          uid: uid,
          token: token,
          item_id:id
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
            //设置价格
            that.setData({
                spec_price_list: res.data.data.spec_price_list
            })
            //设置dialog img
            that.setData({
                dialog_image: res.data.data.spec_list.颜色[0].src
            })
            //设置dialog price
            that.setData({
                dialog_price: res.data.data.price
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

          }
        }
      })
    },
    //选择商品颜色尺寸等
    chioceShop(){
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
     
    }
}))