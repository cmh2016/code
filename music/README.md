
api
=====
>使用的是QQ音乐非官方api，[地址](https://github.com/ccchangkong/article/issues/23)

> 福利：国内免费的api接口，[查看](https://github.com/marktony/Awesome_API/blob/master/Chinese.md)

gif演示
=====
> [完整视频演示](http://ol1kqeyve.bkt.clouddn.com/%E5%BE%AE%E4%BF%A1web%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%20v0.12.130400%202017_2_15%2016_49_42.mp4) 视频较大，手机登录勿点！

![](http://ol1kqeyve.bkt.clouddn.com/wx-a-app-music.gif)

怎么使用
======
1. 获取源码（看下文）
2. 下载官方的IDE
3. 新建项目，选择无appId，路径选择已下载好的源码路径


心得
====

* 小程序动态添加移除class。按照数据驱动的思想，我们可以通过三元表达式，如下：
```
<image class="music-img {{run?runClass:''}}" src="{{img}}"></image>
```
在js里面去动态修改run的值。
```
that.setData({
          playing: true,
          run: true
    })
```

* 使用小程序自带的音乐播放器，在列表中，只允许播放一个控件的方法。官方我没找到。所以曲线救国，自己写了一个，代码如下：
```
//播放按钮
 bindplay: function (e) {
   console.log("开始播放");
   // 获取储存里的id 暂停其播放 实现点击下一个是暂停上一个
   var randomMusicId = wx.getStorageSync('random-music-id') || [];
   this.audioCtx = wx.createAudioContext(randomMusicId);
   this.audioCtx.pause();
 },
 //开始播放了 开始播放时把当前id写入储存
 bindtimeupdate: function (e) {
   wx.setStorageSync('random-music-id', e.currentTarget.id);
 },
```

源码
=====
[获取源码](https://github.com/cmh2016/code/tree/master/music)

最后说两句
======
刚开始接触微信小程序，有很多不足，有什么不足和好的建议，请在评论区留言^.^
