// index.js
const App = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: false,
        mobile: '',//手机号
        yzm:'',//验证码
        tjcode:'',//推荐码
        verifyCodeTime:"获取验证码",
        buttonDisable:false,
        Utype:'',//发送验证码绑定还是解绑
        typeB:'',//按钮发送绑定还是解绑
        btnText:'',
        btnisable:true,
        goWhere:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pid = wx.getStorageSync("userInfo");
        if (pid.pid == 0) {
            //如果等于0，说明还未绑定推荐关系，绑定手机号界面可以显示一行，填写推荐码
            this.setData({
                code: true
            })
        } else if (pid.pid == 1) {
            //如果等于1，说明已绑定推荐关系，填写推荐码这一行就不显示
            this.setData({
                code: false
            })
        }
        if(options.type == "bind"){
            this.setData({
                Utype:"bind",
                typeB:"1",
                btnText:'绑定手机号',
                goWhere: options.go
            })
        } else if (options.type == "unbind"){
            this.setData({
                Utype: "unbind",
                typeB: "0",
                btnText: '解绑手机号',
                goWhere: options.go
            })
        }
        

    },
    /**
     * 获取验证码
     * */
     //获取手机号
    mobileInputEvent: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    //获取验证码
    mobileyzmEvent: function (e) {
        this.setData({
            yzm: e.detail.value
        })
        if (e.detail.value.length > 0 && this.validatemobile(this.data.mobile)){
            this.setData({
                btnisable: false
            })
        }else{
            this.setData({
                btnisable: true
            })
        }
    },
    //获取用户输入推荐码
    mobilecodeEvent: function (e) {
        this.setData({
            tjcode: e.detail.value
        })
    },
    //提交数据
    submitTel:function(){
        var that = this;
        wx.request({
            url: App.api + '/user/bindMobile', //仅为示例，并非真实的接口地址
            data: {
                uid: wx.getStorageSync("uid"),
                token: wx.getStorageSync("token"),
                type: that.data.typeB,
                mobile: that.data.mobile,
                verify_code: that.data.yzm,
                code: that.data.tjcode
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: that.data.btnText+'成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function(){
                        App.WxService.switchTab({
                            url: that.data.goWhere
                        })
                    },2000)
                   
                } else if (res.data.code == -1) {
                    App.error(res.data.msg)

                }

            }
        })  
    },
    //发送验证码
    verifyCodeEvent: function (e) {
        if (this.data.buttonDisable) return false;
        var mobile = this.data.mobile;
        var ok = this.validatemobile(mobile);
        var that = this;
        var c = 60;
        if(ok){
            wx.request({
                url: App.api+'/user/sendSms', //仅为示例，并非真实的接口地址
                data: {
                    mobile: that.data.mobile,
                    type: that.data.Utype
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    if(res.data.code == 0){
                        var intervalId = setInterval(function () {
                            c = c - 1;
                            that.setData({
                                verifyCodeTime: c + 's后重发',
                                buttonDisable: true
                            })
                            if (c == 0) {
                                clearInterval(intervalId);
                                that.setData({
                                    verifyCodeTime: '获取验证码',
                                    buttonDisable: false
                                })
                            }
                        }, 1000)
                    } else if (res.data.code == -1){
                        App.error(res.data.msg)
                    }
                   
                }
            })  
        }
        
      
       
        
    },
    //验证手机号
    validatemobile: function (mobile) {
        if (mobile.length == 0) {
            App.error("请输入手机号！")
            return false;
        }
        if (mobile.length != 11) {
            App.error("手机号长度有误！")
            return false;
        }
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            App.error("手机号有误！")
            return false;
        }
        return true;
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
