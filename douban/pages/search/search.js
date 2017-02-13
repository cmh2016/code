Page({
    data: {
        "key": "",
        "page": 1,
        "size": 18,
        "searchList": [],
        "searchListTitle": "",
        "bodyHeight": "",
        "scrollHeight": "",
        "total": "",
        "show": 1,
        "text": "暂无",
        "start": "../../img/leve-1.gif",
        "startno": "../../img/leve-2.gif",
    },
    //详情页跳转,
    goDetail: function (e) {
        var id = e.currentTarget.id;
        //console.log(e)
        wx.setStorageSync('detail-id', id);
        wx.navigateTo({
            url: "../detail/detail"
        })
    },
    //搜索事件
    searchMovie: function (e) {
        var that = this;
        that.setData({
            key: e.detail.value
        });
        wx.showToast({
            title: '拼命搜索中...',
            icon: 'loading',
            duration: 10000
        })
        wx.request({
            url: 'https://api.douban.com/v2/movie/search?q=' + that.data.key + '&start=' + (that.data.page - 1) * that.data.size, //获取搜索结果
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                city: '洛阳'
            },
            success: function (res) {
                console.log(res.data);
                wx.hideToast();
                setTimeout(function () {
                    wx.showToast({
                        title: 'OK',
                        icon: 'success',
                        duration: 1500
                    })
                }, 100);
                that.setData({
                    searchListTitle: res.data.title,
                    searchList: res.data.subjects,
                    total: res.data.subjects.length
                });
                if (that.data.total == 0) {

                    that.setData({
                        show: 0
                    })
                } else {
                    that.setData({
                        show: 1
                    })
                }
            },
            fail: function (res) {
                console.log(res.data)
            }
        })

    },
    lower: function () {
        console.log("下一页");
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        this.data.page++;
        console.log(this.data.page)
        var that = this
        wx.request({
            url: 'https://api.douban.com/v2/movie/search?q=' + that.data.key + '&start=' + (that.data.page - 1) * that.data.size, //获取搜索结果
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                city: '洛阳'
            },
            success: function (res) {
                console.log(res.data);
                wx.hideToast();
                setTimeout(function () {
                    wx.showToast({
                        title: 'OK',
                        icon: 'success',
                        duration: 1500
                    })
                }, 100);
                var newsearchList = that.data.searchList;
                var data = res.data.subjects;
                Array.prototype.push.apply(newsearchList, data)
                that.setData({
                    searchList: newsearchList,
                });
            },
            fail: function (res) {
                console.log(res.data)
            }
        })

    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        console.log("../../img/ic_rating_s@2x.png")
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    bodyHeight: res.windowHeight
                })
            }
        });
        that.setData({
            scrollHeight: (that.data.bodyHeight - 72)
        })

    },
    onShow: function () {
        // 生命周期函数--监听页面显示

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
      
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
})