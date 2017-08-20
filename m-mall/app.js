import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'

App({
  onLaunch() {
    console.log('onLaunch')
  },
  onShow() {
    console.log('onShow')
  },
  onHide() {
    console.log('onHide')
  },
  getUserInfo() {
    return this.WxService.login()
      .then(data => {
        console.log(data)
        return this.WxService.getUserInfo()
      })
      .then(data => {
        console.log(data)
        this.globalData.userInfo = data.userInfo
        return this.globalData.userInfo
      })

  },
  globalData: {
    userInfo: null
  },
  renderImage(path) {
    if (!path) return ''
    if (path.indexOf('http') !== -1) return path
    return `${this.Config.fileBasePath}${path}`
  },
  error: function (msg) {
    wx.showToast({
      title: msg,
      image: '/assets/images/fail.png',
      duration: 2000,
      mask: true
    })
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
  HttpService: new HttpService,
  WxService: new WxService,
  Tools: new Tools,
  api: Config.api,
  errGoLogin: function (data) {
    if (data == 'ACCESS_TOKEN_FAILD') {
      wx.clearStorageSync();
      wx.reLaunch({
        url: '/pages/login/index'
      })
    }
  },
  bindTel:function(path){
    if (wx.getStorageSync("mobile") == 0) {
      wx.navigateTo({
  url: '/pages/tel/index?type=bind&go=' + path
})
        } else {
         wx.navigateTo({
           url:path
           })
        }
  }
})