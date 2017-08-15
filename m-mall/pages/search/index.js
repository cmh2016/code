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
        if (e.detail.value != ""){
            wx.redirectTo({
                url: '/pages/goods/list/index?k=' + e.detail.value
            })
        }else{
            wx.showToast({
                title: '请输入关键字',
                icon: 'success',
                duration: 2000
            })
            return false;
        }
        
    }
})