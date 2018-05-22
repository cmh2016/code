$(document).ready(function(){

    //记录用户常用系统-------------------------------------------------
    var userAlwaysUse = new Array();

    var obj = new Object();
    var num =0;
    //数组对象根据属性值排序
    function compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    }
    $("#metro_box a").live("click",function () {
        var id = $(this).attr("id");
        var userNavs = new Array();
        var userAlwaysUseArr = $.jStorage.get('userAlwaysUse');
        if(userAlwaysUseArr){
            userAlwaysUseArr = eval('(' + userAlwaysUseArr + ')');
            var userNavs = $.jStorage.get('userNavs');
            userNavs = userNavs.split(",");
            if(jQuery.inArray(id, userNavs) != -1){
                for(var i=0;i<userAlwaysUseArr.length;i++){
                    if(userAlwaysUseArr[i].id==id){
                        userAlwaysUseArr[i].num = parseInt(userAlwaysUseArr[i].num)+1;
                        userAlwaysUseArr = userAlwaysUseArr.sort(compare('num'));
                       $.jStorage.set('userAlwaysUse',JSON.stringify(userAlwaysUseArr));
                    }
                }

            }else{

                obj.id=id;
                obj.num = 1;
                userNavs.push(id);
                userNavs = $.unique(userNavs);
                userAlwaysUseArr.push(obj);
                $.jStorage.set('userNavs',userNavs.join(","));
                userAlwaysUseArr = userAlwaysUseArr.sort(compare('num'));
                $.jStorage.set('userAlwaysUse',JSON.stringify(userAlwaysUseArr));
            }
        }else{
            obj.id=id;
            obj.num = 1;
            userAlwaysUse.push(obj);
            userNavs.push(id);
            userNavs = $.unique(userNavs);
            userAlwaysUse = userAlwaysUse.sort(compare('id'));
            $.jStorage.set('userNavs',userNavs.join(","));
           $.jStorage.set('userAlwaysUse',JSON.stringify(userAlwaysUse));

        }

    });
    //定义数据源
    var allNav = [
        {
            name:'县区就业Herewell管理平台',
            url:'https://cmh2016.github.io'
        },
        {
            name:'综合媒体发布平台',
            url:'https://cmh2016.github.io'
        },
        {
            name:'社会保障卡管理信息系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'河南省城乡居民社会养老保险管理信息系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'洛阳市城镇居民基本医疗保险服务系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'外国人工作许可证管理系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'社会保险基金报表管理信息系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'河南省机关事业单位养老保险信息系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'洛阳政务服务管理系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'智慧洛阳-洛阳政务',
            url:'https://cmh2016.github.io'
        },
        {
            name:'河南政务服务统一工作平台',
            url:'https://cmh2016.github.io'
        },
        {
            name:'洛阳市劳动和社会保障信息中心',
            url:'https://cmh2016.github.io'
        },
        {
            name:'社会保险费数据交换管理系统',
            url:'https://cmh2016.github.io'
        },
        {
            name:'河南省异地就医结算管理平台',
            url:'https://cmh2016.github.io'
        },
        {
            name:'国家基本医疗保险异地就医结算系统',
            url:'https://cmh2016.github.io'
        },
         {
            name:'人社局360新天擎杀毒软件',
            url:'https://cmh2016.github.io'
        },{
            name:'河南金保就业管理信息系统',
            url:'https://cmh2016.github.io'
        },{
            name:'化解过剩产能企业职工信息系统',
            url:'https://cmh2016.github.io'
        }];
    //绘制全部导航
    var allNavHtml='';
    for(var i in allNav){
        var n = parseInt(i)+1;
        allNavHtml+='<li><img src="images/'+n+'.png"  ><a target="_blank" id="'+i+'" href="'+allNav[i].url+'">'+allNav[i].name+'</a></li>'
    }
    $("#allNav").html(allNavHtml);
    //绘制常用导航
    var userAlwaysUseArr =$.jStorage.get('userAlwaysUse');
    if($.jStorage.get('userAlwaysUse')){
        $(".a_mzdw").addClass("a_mzdw_h");
        $(".a_index_h").removeClass("a_index_h").addClass("a_index")
        $("#metro_box dd").eq(0).show();
        $("#metro_box dd").eq(1).hide();
        var userAlwaysUseArr = $.jStorage.get('userAlwaysUse');
        userAlwaysUseArr = eval('(' + userAlwaysUseArr + ')');
        var userAlwaysUseHtml='';
        for(var a=0;a<userAlwaysUseArr.length;a++){
            var n = parseInt(userAlwaysUseArr[a].id)+1;
            userAlwaysUseHtml+='<li><img src="images/'+n+'.png"  ><a id="'+userAlwaysUseArr[a].id+'" target="_blank"  href="'+allNav[userAlwaysUseArr[a].id].url+'">'+allNav[userAlwaysUseArr[a].id].name+'</a></li>'
        }
        $("#userAlwaysUse").html(userAlwaysUseHtml);
    }else{
        $("#userAlwaysUse").html('<h2 style="text-align: center;color: #ffffff">暂无记录</h2>');
    }
    //居中
    var box_h=$("#metro_box").height();
    var box_w=$("#metro_box").width();

    if($(window).width()<=1200){
        $("#top dl dd").css("float","left")
    }else{
        $("#top dl dd").css("float","right")
    }
    $.MyCommon.PageLoading({ sleep: 500 });


    $(window).resize(function () {

        if($(window).width()<=1200){
            $("#top dl dd").css("float","left")
        }else{
            $("#top dl dd").css("float","right")
        }
    });

    //切屏-----------------------------------------------------------------
    $("#top dl dd a").click(function(){
        var now_class=$(this).attr("class");
        $("#top dl dd a.a_index").attr("class","a_index");
        $("#top dl dd a.a_mzdw").attr("class","a_mzdw");
        $(this).attr("class",now_class).addClass(now_class+"_h");
        var index=$(this).index();
        $("#metro_box dd").hide();
        $("#metro_box dd").eq(index).toggle(100);

    <!--[if IE 6]>$("#metro_box dd").eq(index).show(300);<![endif]-->
    });

    $("#freewords").keyup(function () {
        $("#allNav li").hide()
            .filter(":contains('"+($(this).val())+"')").show();//filter和contains共同来实现了这个功能。
    }).keyup();

});
