// alert(window.location.href);
// var express = require('express');
// var AV = require('leanengine');
AV.init({
  appId:  'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz',
  appKey:  'w8TTlyjgG30TCq5jpqWaQPg8',
});
// AV.Cloud.useMasterKey(true);

var not_login_tip="游侠，来登陆留名！";

// 获取用户缓存
var currentUser = AV.User.current();
// 根据用户登录的缓存，分别显示导航栏内容
if (currentUser) {
  // do stuff with the user
  $(".nav-not-login").hide();

  $(".nav-logined").show();

// 导航栏设置用户名
  var crtUserName = currentUser.get("username");

  $("#nav-dropup-btn").text(crtUserName);

} else {
  // show the signup or login page
  $(".nav-not-login").show();

  $(".nav-logined").hide();

  $("#nav-dropup-btn").text(not_login_tip);
}

// 退出登录时，清楚登录缓存
$("#sign-off-btn").click(function(){

  AV.User.logOut().then(function(){
      $(".nav-not-login").show();

      $(".nav-logined").hide();

      $("#nav-dropup-btn").text(not_login_tip);
  });

  var currentUser = AV.User.current(); 
});

$('.main-content').css({
  'height':$(window).height()-$('#navigator').height(),
  'margin-top':$('#navigator').height()
})

// 初始化百度地图
var smap = new BMap.Map("selfMap");
smap.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
smap.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

// 添加信息窗口
function addInfoWindow(infoAddress,point){
    var opts = {    
      width : 250,     // 信息窗口宽度    
      // height: 100,     // 信息窗口高度    
      title : "我的位置",  // 信息窗口标题
      offset: new BMap.Size(0, -25), 
  }
  var lat = point.lat;
  var lng = point.lng;
  // alert(typeof(infoAddress));
  var infoWindow = new BMap.InfoWindow("地址:"+infoAddress+"<button class=\"locationComfirm btn btn-default\" onclick=\"addLocalComfirmFunction("+lat+","+lng+","+"'"+infoAddress+"'"+")\" href=\"javascript:;\">是这附近！</button>", opts);  // 创建信息窗口对象
  smap.openInfoWindow(infoWindow,smap.getCenter());      // 打开信息窗口

}
  
// 给信息窗口添加代理事件
function addLocalComfirmFunction(lat,lng,address){
	$("#selfMap").css({'visibility':'hidden'});
	getNearByItems(lat,lng);
	// alert(typeof(address));
	$("#mylocation").text(address);
	// findCurrentUserAddress();
}

// 返回用户当前地址；
function findCurrentUserAddress(){
  $("#mylocation").text("定位中...");
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function(r){   //定位结果对象会传递给r变量
      if(this.getStatus() == BMAP_STATUS_SUCCESS){  //通过Geolocation类的getStatus()可以判断是否成功定位。
        var geoc = new BMap.Geocoder();
        var pt = r.point;
        var mk = new BMap.Marker(pt);    //基于定位的这个点的点位创建marker
        smap.centerAndZoom(pt,13);        
        smap.addOverlay(mk);    //将marker作为覆盖物添加到map地图上
        geoc.getLocation(pt, function(rs){
          var addComp = rs.addressComponents;
          // $("#mylocation").text(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
          var infoAddress=addComp.district + addComp.street + addComp.streetNumber;
          $("#mylocation").text(infoAddress);

          addInfoWindow(infoAddress,pt);
        });

      }else {
          console.log('failed'+this.getStatus());
          $("#mylocation").text("定位失败，点这里自助定位");
      }
  },{enableHighAccuracy: true});  
}

findCurrentUserAddress();

// findCurrentUserAddress();
// 点击地图时，地图定位到点击地点，并打开信息窗口
smap.addEventListener("click", function(e){
  smap.clearOverlays();     
  var geoc = new BMap.Geocoder();
  var pt = e.point;
  var mk = new BMap.Marker(pt);    //基于定位的这个点的点位创建marker
  smap.centerAndZoom(pt,16);        
  smap.addOverlay(mk);    //将marker作为覆盖物添加到map地图上
  geoc.getLocation(pt, function(rs){
    var addComp = rs.addressComponents;
    // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
    var infoAddress=addComp.district + addComp.street + addComp.streetNumber;
    addInfoWindow(infoAddress,pt)
  });        
});

$("#mylocation").click(function(event) {
	if($("#selfMap").css('visibility')=="hidden"){
		$("#selfMap").css({'visibility':'visible'});		
	}else{
		$("#selfMap").css({'visibility':'hidden'});
	}
	$('#map-container').css({"visibility":"hidden"});
});

$('#selfMap').css({
  'height':$(window).height()-$('#navigator').height(),
  'position':'fixed',
  'right':'0px',
  'top':$('#navigator').height(),
  'width':'500px'
})