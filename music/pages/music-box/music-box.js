var app = getApp()
Page({
    data: {
        id: '',
        img: '',
        singername: '',
        musicName: '',
        fanzhuan: "diezi-fanzhuan",
        ok: false,
        run: false,
        runClass: "run",
        playing: false,
        ganziRun:'ganziRun'
    },
    fanzhaun: function () {
        //动态切换添加移除class
        this.setData({
            ok: !this.data.ok
        })
    },
    play: function (res) {
        var that = this
        wx.playBackgroundAudio({
            dataUrl: 'http://ws.stream.qqmusic.qq.com/' + that.data.id + '.m4a?fromtag=46',
            title: that.data.musicName,
            coverImgUrl: that.data.img,
            complete: function (res) {
                that.setData({
                    playing: true,
                    run: true
                })
            }
        })
        app.globalData.run = true;
        app.globalData.backgroundAudioPlaying = true;
    },
    pause: function () {
        var that = this
        wx.pauseBackgroundAudio({
            dataUrl: 'http://ws.stream.qqmusic.qq.com/' + that.data.id + '.m4a?fromtag=46',
            success: function () {
                that.setData({
                    playing: false,
                    run: false
                })
            }
        })
        app.globalData.run = false;
        app.globalData.backgroundAudioPlaying = false;
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        this.setData({
            id: wx.getStorageSync('musicId'),
            img: wx.getStorageSync('musicImg'),
            singername: wx.getStorageSync('singername'),
            musicName: wx.getStorageSync('musicName'),
        })
        console.log(this.data.musicName)

        if (app.globalData.backgroundAudioPlaying) {
            this.setData({
                playing: true
            })
        }
        if (app.globalData.run) {
            this.setData({
                run: true
            })
        }
        var that = this;
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                var dataUrl = res.dataUrl;
                var status = res.status
                if (status == 1) {
                    if (dataUrl != 'http://ws.stream.qqmusic.qq.com/' + that.data.id + '.m4a?fromtag=46') {
        that.setData({
                    playing: false,
                    run: false
                })
                app.globalData.run = false;
        app.globalData.backgroundAudioPlaying = false;
                    }
                }
            }
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

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