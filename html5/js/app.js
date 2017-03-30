/**
 *　　　　　　　　┏┓　　　┏┓+ +
 *　　　　　　　┏┛┻━━━┛┻┓ + +
 *　　　　　　　┃　　　　　　　┃ 　
 *　　　　　　　┃　　　━　　　┃ ++ + + +
 *　　　　　　 ████━████ ┃+
 *　　　　　　　┃　　　　　　　┃ +
 *　　　　　　　┃　　　┻　　　┃
 *　　　　　　　┃　　　　　　　┃ + +
 *　　　　　　　┗━┓　　　┏━┛
 *　　　　　　　　　┃　　　┃　　　　　　　　　　　
 *　　　　　　　　　┃　　　┃ + + + +
 *　　　　　　　　　┃　　　┃　　　　Code is far away from bug with the animal protecting　　　　　　　
 *　　　　　　　　　┃　　　┃ + 　　　　神兽保佑,代码无bug　　
 *　　　　　　　　　┃　　　┃
 *　　　　　　　　　┃　　　┃　　+　　　　　　　　　
 *　　　　　　　　　┃　 　　┗━━━┓ + +
 *　　　　　　　　　┃ 　　　　　　　┣┓
 *　　　　　　　　　┃ 　　　　　　　┏┛
 *　　　　　　　　　┗┓┓┏━┳┓┏┛ + + + +
 *　　　　　　　　　　┃┫┫　┃┫┫
 *　　　　　　　　　　┗┻┛　┗┻┛+ + + +
 *
 **/
Zepto(function() {
    //点透处理
    $(function() {
        FastClick.attach(document.body);
    });
    //调用轮播图模块 
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 2500, //可选选项，滑动时间 毫秒
        // 如果需要分页器
        pagination: '.swiper-pagination'

    });
    //调用滑动快捷入口模块
    var mySwiperNav = new Swiper('.swiper-container_nav', {
        // 如果需要分页器
        pagination: '.swiper-pagination_nav'
    });
    var left = $(".userInfo").width() / 2;
    $(".userInfo").css("margin-left", -left);
    //以下是下拉js模块
    $('.foodAll').click(function() {
        $(".foodAllBox").toggle();
        $(this).find(".icons").toggleClass("iconsOn");
        $(this).find(".selectTy").toggleClass("selectTyTr");
        $(this).find(".text").toggleClass("textActive");
    });
    $(".footAllItem").click(function() { //下拉选项选中操作
        //UI
        $(".footAllItem").css({
            "background": "#fff",
            "color": "#666"
        });
        $(this).css({
            "background": "#fff",
            "color": "#ec0416"
        });
        //设值
        $(".foodAll").find(".text").text($(this).text());
        $(".foodAll").find(".text").data("id", $(this).index());
        $(".foodAllBox").hide();
        $(".foodAll").find(".selectTy").removeClass("selectTyTr");
        $(".foodAll").find(".text").removeClass("textActive");
        $(".foodAll").find(".icons").removeClass("iconsOn");
    });
    $('.footFuJin').click(function() {
        $(".footFuJinBox").toggle();
        $(this).find(".icons").toggleClass("iconsOn");
        $(this).find(".selectTy").toggleClass("selectTyTr");
        $(this).find(".text").toggleClass("textActive");
         $(".shouru .userName input").width($(".userName").width()-80);
    });
    $(".footFuJinBoxItem").click(function() { //下拉选项选中操作
        //UI
        $(".footFuJinBoxItem").css({
            "background": "#fff",
            "color": "#666"
        });
        $(this).css({
            "background": "#fff",
            "color": "#ec0416"
        });
        //设值
        $(".footFuJin").find(".text").text($(this).text());
        $(".footFuJin").find(".text").data("id", $(this).index());
        $(".footFuJinBox").hide();
        $(".footFuJin").find(".selectTy").removeClass("selectTyTr");
        $(".footFuJin").find(".text").removeClass("textActive");
        $(".footFuJin").find(".icons").removeClass("iconsOn");
    });
    $('.foodPaiXu').click(function() {
        $(".footPaiXuBox").toggle();
        $(this).find(".selectTy").toggleClass("selectTyTr");
        $(this).find(".text").toggleClass("textActive");
        $(this).find(".icons").toggleClass("iconsOn");
    });
    $(".footPaiXuItem").click(function() { //下拉选项选中操作
        //UI
        $(".footPaiXuItem").css({
            "background": "#fff",
            "color": "#666"
        });
        $(this).css({
            "background": "#fff",
            "color": "#ec0416"
        });
        //设值
        $(".foodPaiXu").find(".text").text($(this).text());
        $(".foodPaiXu").find(".text").data("id", $(this).index());
        $(".footPaiXuBox").hide();
        $(".foodPaiXu").find(".selectTy").removeClass("selectTyTr");
        $(".foodPaiXu").find(".text").removeClass("textActive");
        $(".foodPaiXu").find(".icons").removeClass("iconsOn");
    });
    $('.foodSaiXuan').click(function() {
        $(".footSaiXuanBox").toggle();
        $(this).find(".selectTy").toggleClass("selectTyTr");
        $(this).find(".text").toggleClass("textActive");
        $(this).find(".icons").toggleClass("iconsOn");
    });
    $(".footSaiXuanItem").click(function() { //下拉选项选中操作
        //UI
        $(".footSaiXuanItem").css({
            "background": "#fff",
            "color": "#666"
        });
        $(this).css({
            "background": "#fff",
            "color": "#ec0416"
        });
        //设值
        $(".foodSaiXuan").find(".text").text($(this).text());
        $(".foodSaiXuan").find(".text").data("id", $(this).index());
        $(".footSaiXuanBox").hide();
        $(".foodSaiXuan").find(".selectTy").removeClass("selectTyTr");
        $(".foodSaiXuan").find(".text").removeClass("textActive");
        $(".foodSaiXuan").find(".icons").removeClass("iconsOn");     
    });
});
                           