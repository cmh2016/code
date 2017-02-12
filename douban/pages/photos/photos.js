Page({
    data: {
        "id": [],
        "title": "",
        imgUrls: [],
        "height":"",
        heightImg:""

    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        //从缓存中读取详情页ID
        this.setData({
            id: (wx.getStorageSync('detail-id') || [])
        });
        var that = this
        // 请求当前页信息
        wx.request({
            url: 'https://api.douban.com/v2/movie/subject/' + that.data.id, //获取豆瓣热映列表
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },

            success: function (res) {
                console.log(res.data);
                //setdata
                that.setData({
                    title: res.data.title,
                    imgUrls: res.data.casts
                })
                wx.setNavigationBarTitle({
                    title: that.data.title+"-主演"
                })
            },
            fail: function (res) {
                console.log(res.data)
            }
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight,
                    heightImg:res.windowHeight-60
                })
            }
        });
      
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