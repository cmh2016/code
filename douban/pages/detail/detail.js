Page({
    data: {
        title: "",//当前页标题
        id: "",//电影信息id
        info:[],//电影信息
        text:"暂无"//空值显示
    },
    onLoad: function () {
        //从缓存中读取详情页ID
        this.setData({
            id: (wx.getStorageSync('detail-id') || [])
        });
        var that = this
        // 请求当前页信息
        wx.request({
            url: 'https://api.douban.com/v2/movie/' + that.data.id, //获取豆瓣热映列表
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                city: '洛阳'
            },
            success: function (res) {
                console.log(res.data);
                //setdata
                that.setData({
                    title: res.data.alt_title,
                    info: res.data
                })
                console.log(that.data.info)
                wx.setNavigationBarTitle({
                    title: that.data.title
                })
            },
            fail: function (res) {
                console.log(res.data)
            }
        })
    },
    //分享设置
       onShareAppMessage: function () {
        // 用户点击右上角分享
        var that = this;
        return {
            title: '豆瓣电影', // 分享标题
            desc: that.data.title, // 分享描述
            path: 'path' // 分享路径
        }
    }
})




