var suggestInput = document.getElementById('suggestId');
var poiTitle = document.getElementById("poi_title");
var addr = document.getElementById("address");
var geolng = document.getElementById("geolng");
var geolat = document.getElementById("geolat");
var poiProvince = document.getElementById('poi_province');
var poiCity = document.getElementById('poi_city');
var poiUid = document.getElementById('poi_uid');
var poiType = document.getElementById('poi_type');

var l_result = document.getElementById("l-result");
// 百度地图API功能
var map = new BMap.Map("l-map");            // 创建Map实例
function myFun(result){
    var cityName = result.name;
    map.setCenter(cityName);
    // alert("当前定位城市:"+districtName);

    map.centerAndZoom(cityName,13);
    // map.centerAndZoom(result.point,16) 

}
var myCity = new BMap.LocalCity();
myCity.get(myFun);
// var map = new BMap.Map("l-map", {enableMapClick:false});
//enableMapClick代表poi点击展开事件被禁止了
map.enableScrollWheelZoom(true);
// 百度地图API功能
function G(id) {
    return document.getElementById(id);
}

// 定位地图到用户所在位置：
function setCurrentLocation(){
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){   //定位结果对象会传递给r变量
        if(this.getStatus() == BMAP_STATUS_SUCCESS){  //通过Geolocation类的getStatus()可以判断是否成功定位。
            map.clearOverlays();    //清除地图上所有覆盖物
            var mk = new BMap.Marker(r.point);    //基于定位的这个点的点位创建marker
            map.centerAndZoom(mk,20);
            map.addOverlay(mk);    //将marker作为覆盖物添加到map地图上
            map.panTo(r.point);   //将地图中心点移动到定位的这个点位置。注意是r.point而不是r对象。
        }else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true});    
}

// 根据用户输入信息进行搜索
var searchSuggest=document.getElementById('searchSuggestId');

searchSuggest.onclick=function(){
    $('#confirm_result').css({
        'display':'none',
        'width':'0'
    })

    $('#show_result_container').hide();

    $('#cancel_result').css({'width':'100%'});

    showCustomResults();

    $('#result_container').css({'display':'block'});
    $('#newForm').css({'display':'none'});
}
function showCustomResults(){

    // map.centerAndZoom(new BMap.Point(e.point.lng, e.point.lat), 16);
    var local = new BMap.LocalSearch(map, {
        renderOptions: {
            map: map,
            // panel: "l-result"
        },
        pageCapacity: 99,
        onSearchComplete: function(results){ 
           //可以得到搜索结果且搜索结果不为空
            if(local.getStatus() == BMAP_STATUS_SUCCESS){
                l_result.innerHTML = "";
                map.clearOverlays();    //清除地图上所有覆盖物
                // 取第一个结果
                var firstData = local.getResults().getPoi(0);

                var firstTitle = firstData.title;
                var firstProvince = firstData.province;
                var firstCity = firstData.city;
                var firstAddress = firstData.address;
                var firstLng = firstData.point.lng;
                var firstLat = firstData.point.lat;
                var firstUid = firstData.uid;
                var firstType = firstData.type;

                poiTitle.value = firstTitle;
                geolng.value = firstLng;
                geolat.value = firstLat;                
                poiProvince.value = firstProvince;
                poiCity.value = firstCity;                
                addr.value =firstAddress;
                poiUid.value = firstUid;
                poiType.value = firstType;


                //遍历结果第一页的点，自定义结果面板
                var l_result_html="";

                for (var i = 0; i < results.getCurrentNumPois(); i++){

                    var data = local.getResults().getPoi(i);
                    l_result.innerHTML+=l_result_html+(
                        "<a class=\"result_container\" href=\"javascript:;\">"+
                            "<span class=\"result_title\">"+data.title+"</span>"+
                            "<span class=\"result_province\">"+data.province+"</span>"+
                            "<span class=\"result_city\">"+data.city+"</span>"+         
                            "<p class=\"result_address\">"+data.address+"</p>"+
                            "<span class=\"result_uid result_hide\">"+data.uid+"</span>"+
                            "<span class=\"result_lat result_hide\">"+data.point.lat+"</span>"+
                            "<span class=\"result_lng result_hide\">"+data.point.lng+"</span>"+
                            "<span class=\"result_type result_hide\">"+data.type+"</span>"+
                        "</a>"
                    );
                }

                //拼接生成的html要响应js代码的话，需要加事件代理
                $(function(){
                    var body = $ ('body');
                    body.delegate ('.result_container', 'click', function(){
                        $('#confirm_result').css({
                            'display':'inline-block',
                            'width':'49%'
                        })

                        $('#cancel_result').css({
                            'width':'49%'
                        })

                        $('.result_container').css({
                            'background-color':'#fff'
                        });

                        $(this).css({
                            'background-color':'#eeefff'
                        })

                        map.clearOverlays();    //清除地图上所有覆盖物
                        // alert ($(this).index (".result_container"));
                        var lat = Number($(this).find('.result_lat').html());
                        var lng = Number($(this).find('.result_lng').html());
                        var point = new BMap.Point(lng, lat);   
                        map.centerAndZoom(point, 18);   
                        var marker = new BMap.Marker(point);// 创建标注   
                        map.addOverlay(marker);// 将标注添加到地图中
                        // 将位置信息传给文本框
                        var title = $(this).find('.result_title').html();
                        var  province= $(this).find('.result_province').html();
                        var  city= $(this).find('.result_city').html();
                        var  address= $(this).find('.result_address').html();
                        var  uid= $(this).find('.result_uid').html();
                        var  type= $(this).find('.result_type').html();

                        poiTitle.value = title;
                        geolng.value = lng;
                        geolat.value = lat;                       
                        poiProvince.value = province;
                        poiCity.value = city;                           
                        addr.value =address;
                        poiUid.value = uid;
                        poiType.value = type;

                        var opts = {    
                            width : 250,     // 信息窗口宽度    
                            // height: 100,     // 信息窗口高度    
                            title : title,  // 信息窗口标题
                            offset: new BMap.Size(0, -25), 
                        }   

                        var infoWindow = new BMap.InfoWindow("地址:"+address, opts);  // 创建信息窗口对象
                        map.openInfoWindow(infoWindow, map.getCenter());      // 打开信息窗口
                    })
                })
            } 
        }
    });
    var suggestContent=suggestInput.value;
    local.search(suggestContent);       
};


//获取操作系统信息
var navType = navigator.appVersion;
// 检测是否移动端
var is_iOS = navType.match("iPhone");
var is_Android = navType.match("Android");
//检查是否为windows的PC 
var PCmatch = navType.match("Windows");
//检查是否为MAC
var MacType = navType.match("Macintosh");

if(is_iOS || is_Android){//如果是ios/安卓设备
    $('#l-map').css({
        'height':'200px'
    });
    $('#l-result').css({
        'width':'100%',
        'float':'left'
    });
//自动将地图定位到自己的位置：
  if (navigator.geolocation)//是否可以获取地图信息
  {
    // navigator.geolocation.getCurrentPosition(showPosition);
    setCurrentLocation();

  }else{
    alert("没能为您精确定位")
  }

}else if(PCmatch || MacType){

  setCurrentLocation();

  $('#l-map').css({
    'position':'fixed',
    'left':'0px',
    'top':'0px',
    'width':'500px'
  })

  $('#newForm').css({
    'margin':'0 0 0 500px',
    'padding-left':'20px',
    'width':$(window).width()-$('#l-map').width()-20,
    'height':$(window).height(),
    'overflow-y':'auto',
    'overflow-x':'hidden'
  })

  $('#result_container').css({
    'margin-left':'500px',
    'width':$(window).width()-$('#l-map').width(),
    'height':$(window).height()
  })

  $('#l-result').css({
    'width':'100%',
    'max-height':$(window).height()-$('#select_btn').height(),
    'overflow-y':'auto',
    'overflow-x':'hidden'
  })
}

var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "suggestId"
    ,"location" : map
});

// ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件

//     var str = "";
//     var _value = e.fromitem.value;
//     var value = "";
//     if (e.fromitem.index > -1) {
//         value = _value.province +  _value.city +  _value.district +  _value.street  + _value.business;
//     }    
//     str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
    
//     value = "";
//     if (e.toitem.index > -1) {
//         _value = e.toitem.value;
//         value = _value.province +  _value.city +  _value.district +  _value.street  +  _value.business;
//     }    
//     str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
//     G("searchResultPanel").innerHTML = str;
// });

var myValue;

ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件

    addr.value ="";
    geolng.value = "";
    geolat.value = "";

    $('#result_container').css({'display':'block'});
    $('#newForm').css({'display':'none'});
    $('#show_result_container').hide();
    
    showCustomResults();
});

var isEditing = 0;//0代表没有编辑，1代表正在编辑；

$('#show_result_container').css({
    'top':$('#navigator').height()
})

$('#confirm_result').click(function(){
    isEditing = 1;

    $('#result_container').slideToggle(500,function(){
        $('#show_result_container').show();
    });
    
    $('#newForm').css({
        'display':'block'
    })
})

$('#show_result_container').click(function(){
   $('#show_result_container').hide(500,function(){
        $('#result_container').slideToggle(500);
    });
    $('#newForm').hide();
});

$('#cancel_result').click(function(){
    $('#result_container').slideToggle(500);

    if(isEditing == 1){
        $('#show_result_container').show();
        $('#newForm').show();
    }else{
        $('#newForm').hide();
    }


    $('#confirm_result').css({
        'display':'none',
        'width':'0'
    })

    $('#cancel_result').css({
        'width':'100%'
    })
})

function autoSetContentSize(){
  $('#l-map').css({
    'height':$(window).height(),
  })

  $('#newForm').css({
    'width':$(window).width()-$('#l-map').width(),
    'height':$(window).height()-$('#navigator').height(),
  })

  $('#result_container').css({
    'width':$(window).width()-$('#l-map').width(),
    // 'height':$(window).height()-$('#navigator').height(),
    'top':$('#navigator').height()
  })

  $('#l-result').css({
    'width':'100%',
    'max-height':$('#result_container').height()-$('#select_btn').height()-$('#navigator').height()
  })    

  
}

$(window).ready(function(){
    autoSetContentSize();
})
$(window).resize(function() {
    autoSetContentSize();
});