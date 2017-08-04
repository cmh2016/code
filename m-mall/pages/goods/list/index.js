const App = getApp()

Page({
    data: {
        hidden: !0,
        type: null,
        topType: '',
        goods: {},
        prompt: {
            hidden: true,
            icon: '../../../assets/images/iconfont-empty.png',
        },
        show: true,
        checkboxItems: [
            { name: '分类1', value: '0' },
            { name: '分类2', value: '1' },
            { name: '分类3', value: '3' },
            { name: '分类4', value: '4' },
            { name: '分类5', value: '5' },
            { name: '分类6', value: '6' }
        ],
        checkboxItems2: [
            { name: '品牌1', value: '0' },
            { name: '品牌2', value: '1' },
            { name: '品牌3', value: '3' },
            { name: '品牌4', value: '4' },
            { name: '品牌5', value: '5' },
            { name: '品牌6', value: '6' }
        ],
        radioItems: [
            { name: '销量由高到低', value: 'sales_num desc' },
            { name: '销量由低到高', value: 'sales_num asc' }
        ],
        radioItems2: [
            { name: '价格由高到低', value: 'price desc' },
            { name: '价格由低到高', value: 'price asc' }
        ]
    },
    onLoad(option) {
        console.log(option)
        if (option.k) {
            this.setData({
                keyword: option.k
            })
            wx.setNavigationBarTitle({
                title: '搜索结果'
            })
        }
        if (option.title) {
            wx.setNavigationBarTitle({
                title: option.title
            })
        }
        this.setData({
            category_id: option.category_id,
            keyword: option.keyword && decodeURI(option.keyword),
        })
        this.getList();
    },
    onReady() {
        const keyword = this.data.keyword

        keyword && App.WxService.setNavigationBarTitle({
            title: `搜索商品：${keyword}`,
        })
    },
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
        wx.request({
            url: App.api + '/item/list', //仅为示例，并非真实的接口地址
            data: {
                uid: uid,
                token: token,
                category_id: that.data.category_id
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
                    that.setData({
                        goods: res.data.data
                    })
                    if (res.data.data.length == 0) {
                        let prompts = that.data.prompt;
                        prompts.hidden = false;
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
    //切换显示
    show(e) {
        let type = e.target.dataset.type;
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
    formSubmit: function (e) {
        this.setData({
            show: true
        })
        var uid = wx.getStorageSync('uid');
        var token = wx.getStorageSync('token');
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var params = e.detail.value

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
                order: params.order
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res)
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
                    that.setData({
                        goods: res.data.data
                    })
                    if (res.data.data.length == 0) {
                        let prompts = that.data.prompt;
                        prompts.hidden = false;
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
    formReset: function (e) {
        console.log(e, 'form发生了reset事件');
        this.setData({
            checkboxItems: [
                { name: '分类1', value: '0' },
                { name: '分类2', value: '1' },
                { name: '分类3', value: '3' },
                { name: '分类4', value: '4' },
                { name: '分类5', value: '5' },
                { name: '分类6', value: '6' }
            ],
            checkboxItems2: [
                { name: '品牌1', value: '0' },
                { name: '品牌2', value: '1' },
                { name: '品牌3', value: '3' },
                { name: '品牌4', value: '4' },
                { name: '品牌5', value: '5' },
                { name: '品牌6', value: '6' }
            ],
            radioItems: [
                { name: '销量由高到低', value: 'sales_num desc' },
                { name: '销量由低到高', value: 'sales_num asc' }
            ],
            radioItems2: [
                { name: '价格由高到低', value: 'price desc' },
                { name: '价格由低到高', value: 'price asc' }
            ],
        })
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems
        });
    },
    radioChange2: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems2;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems2: radioItems
        });
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    },
    checkboxChange2: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems2, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems2: checkboxItems
        });
    },
})