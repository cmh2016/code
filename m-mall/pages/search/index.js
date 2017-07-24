const App = getApp()

Page({
    data: {
        inputVal: ''
    },
    clearInput() {
        this.setData({
            inputVal: ''
        })
    },
    search(e){
        console.log(e)
        wx.redirectTo({
            url: '/pages/goods/list/index?k=' + e.detail.value
        })
    }
})