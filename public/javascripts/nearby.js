// leancloud初始化 
// var express = require('express');
// var AV = require('leanengine');
// var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
// var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
AV.init({
  appId:  'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz',
  appKey:  'w8TTlyjgG30TCq5jpqWaQPg8',
});
// AV.Cloud.useMasterKey(true);


// 获取用户缓存
var currentUser = AV.User.current();

// 获取位置
var geolocation = new BMap.Geolocation();

user_geo={
  latitude:0,
  longitude:0
}
geolocation.getCurrentPosition(function(r){
  if(this.getStatus() == BMAP_STATUS_SUCCESS){
    var mk = new BMap.Marker(r.point);
    user_geo.latitude=r.point.lat;
    user_geo.longitude=r.point.lng;
    getNearByItems(user_geo.latitude,user_geo.longitude);
    // alert('您的位置：'+user_geo.lng+','+user_geo.lat);
  }
  else {
    alert('failed'+this.getStatus());
  }        
},{enableHighAccuracy: true})

// 构造获取地理位置的函数
function getNearByItems(lat,lng){
  // 获取数据：

  var point = new AV.GeoPoint(lat, lng);

  var ItemNum = 0;

  AV.Cloud.run('getItemToVerify', {
    checkStatus: 'approved',
  }).then(function(data) {
    console.log(data);
    
    document.getElementById('Item-fluid').innerHTML = "";
      // 处理返回的结果数据
    for (var i = 0; i < data.length; i++) {
      var object = data[i];

      // var attributes = object['attributes'];

      var id = object['objectId'];

      var address = object['locationAddress'];

      var geolng = object['shopLocation'].longitude;

      var geolat = object['shopLocation'].latitude;

      var myPoint = object['shopLocation'];

      var distance = parseInt((myPoint.kilometersTo(point))*1000);
      
      var doorNum = object['doorNum'];

      var hostRate = object['hostRate'];

      var manageRate = object['estateManageRate'];

      var environmentRate = object['environmentRate'];

      var otherDesc = object['otherDesc'];

      var houseImg = object['imgSrc'];
      var houseImgHtml = getImgsToHtml(houseImg);

      var idImg = object['idImgSrc'];
      var idImgHtml = getImgsToHtml(idImg);

      var contractImg = object['contractImgSrc'];
      var contractImgHtml = getImgsToHtml(contractImg);

      var rentFlowImg = object['rentFlowImgSrc'];
      var rentFlowImgHtml = getImgsToHtml(rentFlowImg);

      ItemNum++;

      document.getElementById('Item-fluid').innerHTML += 
      "<hr/>"+
        "<div class=\"widget-box\">"+
          "<div class=\"controls\">"+
            "<button class=\"show-map-btn btn btn-primary icon-map-marker\">"+distance+"m</button>"+
            "<button class=\"approved-btn btn btn-primary icon-map-marker\">审核通过</button>"+
            "<button class=\"disapproved-btn btn btn-primary icon-map-marker\">审核不通过</button>"+
            // "<button class=\"btn btn-primary icon-map-marker onclick=\"verifyItem("+id+",\'approved\')\" \">审核通过</button>"+
            // "<button class=\"btn btn-primary icon-map-marker onclick=\"verifyItem("+id+",\'disapproved\')\" \">审核不通过</button>"+
          "</div>"+
          "<label class=\"control-label\">地址：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+address+"</span>"+
          "</div>"+
          "<label class=\"control-label\">门牌号：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+doorNum+"</span>"+
          "</div>"+
          "<label class=\"control-label\">房东人品：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+hostRate+"分"+"</span>"+
          "</div>"+
          "<label class=\"control-label\">管理者人品：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+manageRate+"分"+"</span>"+
          "</div>"+
          "<label class=\"control-label\">环境评分：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+environmentRate+"分"+"</span>"+
          "</div>"+
          "<label class=\"control-label\">其他补充：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+otherDesc+"</span>"+
          "</div>"+
          "<label class=\"control-label\">房间照片：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+houseImgHtml+"</span>"+
          "</div>"+
          "<label class=\"control-label\">身份照片：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+idImgHtml+"</span>"+
          "</div>"+
          "<label class=\"control-label\">合同照片：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+contractImgHtml+"</span>"+
          "</div>"+
          "<label class=\"control-label\">交租流水照片：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+rentFlowImgHtml+"</span>"+
          "</div>"+
          "<input type=\"hidden\" class=\"geolng\" value=\""+geolng+"\"/>"+
          "<input type=\"hidden\" class=\"geolat\" value=\""+geolat+"\"/>"+ 
          "<input type=\"hidden\" class=\"item-id\" value=\""+id+"\"/>"+ 
        "</div>";
    }
      // var data = results;

    $('#closeMapBtn').mouseover(function(){
        $('#closeMapBtn').animate({
          "opacity":"0.8"
        },500);  
    });
    $('#closeMapBtn').mouseout(function(){
        $('#closeMapBtn').animate({
          "opacity":"0.5"
        },500);  
    });  
    $('#closeMapBtn').click(function(){
        $('#map-container').css({
          "visibility":"hidden"
        });  
    });   
    var preBtnIndex = null;
    $(".show-map-btn").click(function(){
      var currentBtnIndex = $(this).index(".show-map-btn");
      var mainDiv = $(this).parent().parent();

      // alert(mainDiv);

      var thisLng = mainDiv.find("input.geolng");
      var thisLat = mainDiv.find("input.geolat");

      var thislngStr = thisLng.val();
      var thislatStr = thisLat.val();

      // alert(typeof(thislngStr));

      var map = new BMap.Map("allmap");
      map.enableScrollWheelZoom(true);
      var point = new BMap.Point(thislngStr,thislatStr);
      map.centerAndZoom(point,12);
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野

      if (point) {
        // $("#allmap").css("visibility":"visible");
        map.centerAndZoom(point, 16);
        map.addOverlay(new BMap.Marker(point));
      }else{
        alert("您选择地址没有解析到结果!");
      }     

      
      $("#selfMap").css({'visibility':'hidden'}); 
      // 优化地图显示隐藏。点击时如果地图正在打开，则判断地图显示的是不是正在查看的地点，是的话，收起地图；否则显示
      if($('#map-container').css("visibility")=='hidden'){
        $('#map-container').css({"visibility":"visible"});
      }else if(currentBtnIndex == preBtnIndex){
        $('#map-container').css({"visibility":"hidden"});
      }else{
        $('#map-container').css({"visibility":"visible"});
      }
      preBtnIndex = currentBtnIndex;
    });

    $(".approved-btn").click(function(){
      var currentBtnIndex = $(this).index(".approved-btn");
      var mainDiv = $(this).parent().parent();

      var itemIdInput = mainDiv.find("input.item-id");

      var itemID = itemIdInput.val();
      AV.Cloud.run('verifyItem', { item: itemID, verifyResult:"approved" }).then(function (data) {
        alert("提交成功");
      }, function (err) {
        // 处理调用失败
        console.log(err)
      });
    });

    $(".disapproved-btn").click(function(){
      var currentBtnIndex = $(this).index(".approved-btn");
      var mainDiv = $(this).parent().parent();

      var itemIdInput = mainDiv.find("input.item-id");

      var itemID = itemIdInput.val();
      AV.Cloud.run('verifyItem', { item: itemID, verifyResult:"disapproved" }).then(function (data) {
        // console.log(data)
        alert("提交成功");
      }, function (err) {
        // 处理调用失败
        console.log(err)
      });
    });
    // 调用成功，得到成功的应答 data
  }, function(error) {
    // 处理调用失败
  });

  // var query = new AV.Query("Item");
  // areaQuery.withinKilometers('geoPoint', point, 100.0);

  // var typeQuery = new AV.Query("Item");
  //查询已通过审核的
  // query.equalTo('checkStatus', 'approved');
  //查询未通过审核的
  // query.equalTo('checkStatus', 'null');
  // var query = AV.Query.and(areaQuery,typeQuery);
  // query.find().then(function (results) {
  //     var nearbyTodos = results;
  // }, function (error) {
  // });
  // query.find({
  //   success: function(results) {
  //     console.log(results);
  //       // alert("Successfully retrieved " + results.length + " posts.");
  //     document.getElementById('Item-fluid').innerHTML = "";
  //       // 处理返回的结果数据
  //     for (var i = 0; i < results.length; i++) {
  //       var object = results[i];

  //       var attributes = object['attributes'];

  //       var id = object['id'];

  //       // var title = attributes['title'];

  //       // var poi_uid = attributes['poi_uid'];

  //       var address = attributes['locationAddress'];

  //       var geolng = attributes['shopLocation'].longitude;

  //       var geolat = attributes['shopLocation'].latitude;
  //       // 计算距离
  //       // var point =  new AV.GeoPoint(user_geo.latitude,user_geo.longitude);

  //       var myPoint = attributes['shopLocation'];

  //       var distance = parseInt((myPoint.kilometersTo(point))*1000);
        
  //       // var building = attributes['building'];

  //       var doorNum = attributes['doorNum'];

  //       // var facility = attributes['facility'];

  //       var hostRate = attributes['hostRate'];

  //       // var hostItem = attributes['hostItem'];

  //       var manageRate = attributes['estateManageRate'];

  //       var environmentRate = attributes['environmentRate'];

  //       // var managerItem = attributes['managerItem'];

  //       var otherDesc = attributes['otherDesc'];

  //       // if(attributes['otherDesc'])
  //       var houseImg = attributes['imgSrc'];
  //       var houseImgHtml = getImgsToHtml(houseImg);

  //       var idImg = attributes['idImgSrc'];
  //       var idImgHtml = getImgsToHtml(idImg);

  //       var contractImg = attributes['contractImgSrc'];
  //       var contractImgHtml = getImgsToHtml(contractImg);

  //       var rentFlowImg = attributes['rentFlowImgSrc'];
  //       var rentFlowImgHtml = getImgsToHtml(rentFlowImg);

  //       ItemNum++;

  //       // alert(results[i].id);
  //       // alert(object.id + ' - ' + object.get('address'));

  //       // var html = template('Items', data);
  //       document.getElementById('Item-fluid').innerHTML += 
  //       "<hr/>"+
  //         "<div class=\"widget-box\">"+
  //           "<div class=\"controls\">"+
  //             "<button class=\"show-map-btn btn btn-primary icon-map-marker\">"+distance+"m</button>"+
  //             "<button class=\"approved-btn btn btn-primary icon-map-marker\">审核通过</button>"+
  //             "<button class=\"disapproved-btn btn btn-primary icon-map-marker\">审核不通过</button>"+
  //             // "<button class=\"btn btn-primary icon-map-marker onclick=\"verifyItem("+id+",\'approved\')\" \">审核通过</button>"+
  //             // "<button class=\"btn btn-primary icon-map-marker onclick=\"verifyItem("+id+",\'disapproved\')\" \">审核不通过</button>"+
  //           "</div>"+
  //           "<label class=\"control-label\">地址：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+address+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">门牌号：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+doorNum+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">房东人品：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+hostRate+"分"+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">管理者人品：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+manageRate+"分"+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">环境评分：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+environmentRate+"分"+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">其他补充：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+otherDesc+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">房间照片：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+houseImgHtml+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">身份照片：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+idImgHtml+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">合同照片：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+contractImgHtml+"</span>"+
  //           "</div>"+
  //           "<label class=\"control-label\">交租流水照片：</label>"+
  //           "<div class=\"controls\">"+
  //             "<span class=\"user-info\">"+rentFlowImgHtml+"</span>"+
  //           "</div>"+
  //           "<input type=\"hidden\" class=\"geolng\" value=\""+geolng+"\"/>"+
  //           "<input type=\"hidden\" class=\"geolat\" value=\""+geolat+"\"/>"+ 
  //           "<input type=\"hidden\" class=\"item-id\" value=\""+id+"\"/>"+ 
  //         "</div>";
  //     }
  //     // var data = results;

  //     $('#closeMapBtn').mouseover(function(){
  //         $('#closeMapBtn').animate({
  //           "opacity":"0.8"
  //         },500);  
  //     });
  //     $('#closeMapBtn').mouseout(function(){
  //         $('#closeMapBtn').animate({
  //           "opacity":"0.5"
  //         },500);  
  //     });  
  //     $('#closeMapBtn').click(function(){
  //         $('#map-container').css({
  //           "visibility":"hidden"
  //         });  
  //     });   
  //     var preBtnIndex = null;
  //     $(".show-map-btn").click(function(){
  //       var currentBtnIndex = $(this).index(".show-map-btn");
  //       var mainDiv = $(this).parent().parent();

  //       // alert(mainDiv);

  //       var thisLng = mainDiv.find("input.geolng");
  //       var thisLat = mainDiv.find("input.geolat");

  //       var thislngStr = thisLng.val();
  //       var thislatStr = thisLat.val();

  //       // alert(typeof(thislngStr));

  //       var map = new BMap.Map("allmap");
  //       map.enableScrollWheelZoom(true);
  //       var point = new BMap.Point(thislngStr,thislatStr);
  //       map.centerAndZoom(point,12);
  //       // 创建地址解析器实例
  //       var myGeo = new BMap.Geocoder();
  //       // 将地址解析结果显示在地图上,并调整地图视野

  //       if (point) {
  //         // $("#allmap").css("visibility":"visible");
  //         map.centerAndZoom(point, 16);
  //         map.addOverlay(new BMap.Marker(point));
  //       }else{
  //         alert("您选择地址没有解析到结果!");
  //       }     

        
  //       $("#selfMap").css({'visibility':'hidden'}); 
  //       // 优化地图显示隐藏。点击时如果地图正在打开，则判断地图显示的是不是正在查看的地点，是的话，收起地图；否则显示
  //       if($('#map-container').css("visibility")=='hidden'){
  //         $('#map-container').css({"visibility":"visible"});
  //       }else if(currentBtnIndex == preBtnIndex){
  //         $('#map-container').css({"visibility":"hidden"});
  //       }else{
  //         $('#map-container').css({"visibility":"visible"});
  //       }
  //       preBtnIndex = currentBtnIndex;
  //     });

  //     $(".approved-btn").click(function(){
  //       var currentBtnIndex = $(this).index(".approved-btn");
  //       var mainDiv = $(this).parent().parent();

  //       var itemIdInput = mainDiv.find("input.item-id");

  //       var itemID = itemIdInput.val();
  //       AV.Cloud.run('verifyItem', { item: itemID, verifyResult:"approved" }).then(function (data) {
  //         alert("提交成功");
  //       }, function (err) {
  //         // 处理调用失败
  //         console.log(err)
  //       });
  //     });

  //     $(".disapproved-btn").click(function(){
  //       var currentBtnIndex = $(this).index(".approved-btn");
  //       var mainDiv = $(this).parent().parent();

  //       var itemIdInput = mainDiv.find("input.item-id");

  //       var itemID = itemIdInput.val();
  //       AV.Cloud.run('verifyItem', { item: itemID, verifyResult:"disapproved" }).then(function (data) {
  //         // console.log(data)
  //         alert("提交成功");
  //       }, function (err) {
  //         // 处理调用失败
  //         console.log(err)
  //       });
  //     });
  // },

  //   error: function(error) {
  //     alert("Error: " + error.code + " " + error.message);
  //   }
  // });  
}//getNearByItems end

function mapSizing(){
  $('#map-container').css({
    'position':'fixed',  
    "visibility":"hidden",
    'width':'500px',
    'height':$(window).height()-$('#navigator').height(),
    'top':$('#navigator').height(),
    'right':0,
    'z-index':'9999'
  });   
}

$(document).ready(function(){
  mapSizing();
});
$(document).resize(function(){
  mapSizing();
});

function imgsInHtml(data){
  console.log(data);
  console.log(typeof(data));

  if(data.length>0){
    var imghtml = "";
    for (var i = data.length - 1; i >= 0; i--) {
      imghtml+="<img src="+data[i]+"/>"
    }
    return imghtml;
  }else{
    return "无";
  }
}

function getImgsToHtml(data){
  var dataHtml = "";
  console.log(data)
  if(data!=null && data.length!=0 && data!=undefined){
    for (var i = data.length - 1; i >= 0; i--) {
      dataHtml+="<img src=\""+data[i]+"\">"
    }
  }
  return dataHtml;
}