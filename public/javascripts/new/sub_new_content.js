// leancloud初始化
// AV.initialize('0dBRTR4HBwHKChrPqqc9pcQJ', 'ev9sHjkqFcViFOH0yIc1G2ve');
var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

function photoUpload(targetObject,ext){
    var fileUploadControl = targetObject[0];
    // console.log($('#cerPhotoUpload')[0]);
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var d = new Date();
      var name = d.getTime()+ext;

      var avFile = new AV.File(name, file);
      targetObject.next().text("uploading");
      avFile.save().then(function(obj) {
        // 数据保存成功
        alert(obj.url());
        fileUploadControl.alt = obj.url();
        targetObject.next().text("complete");
      }, function(error) {
        // 数据保存失败
        console.log(error);
      });
    }
}

$('.photoUpload').bind('change',function() {
    // // $('.msg').html($(this).val().length + ' characters');
    // $(this).next().html('change')
  // var filepath = $(id).val();
  var targetObject = $(this);
  var filepath=$(this).val();
  // alert(filepath);
  // var filepath=$("input[name='myFile']").val();
  // 检测文件类型
    var extStart=filepath.lastIndexOf(".");

    var ext=filepath.substring(extStart,filepath.length).toUpperCase();

    if(ext!=".PNG"&&ext!=".GIF"&&ext!=".JPG"&&ext!=".JPEG"){

      alert("图片限于png,gif,jpeg,jpg格式");

      // return false;
      filepath="";
    }

  // 检测文件大小
  var file_size = 0;
    if ($.browser.msie) {
        var img = new Image();
        img.src = filepath;
        while (true) {
            if (img.fileSize > 0) {
                if (img.fileSize > 2 * 1024 * 1024) {
                    alert("上传的图片大小不能超过2M！");
                } else {
                    var num03 = img.fileSize / 1024;
                    num04 = num03.toFixed(2)
                    targetObject.next().text(num04 + "KB");
                    photoUpload(targetObject,ext);
                }
                break;
            }
        }
    } else {
        file_size = this.files[0].size;
        var size = file_size / 1024;
        if (size > 2048) {
            alert("上传的图片大小不能超过2M！");
        } else {
            var num01 = file_size / 1024;
            num02 = num01.toFixed(2);
            targetObject.next().text(num02 + " KB");
            var d = new Date();
            var picname = d.getTime()+ext;
            photoUpload(targetObject,ext);
        }
    }
    // return true;
});

// 获取用户缓存
var currentUser = AV.User.current();

// 提交评价 开始
  function submitItem(submitType){  
    // submitType{保存并发布：1，仅保存：2}

  // 提交项 开始

    // 获取用户名
    var currentUser = AV.User.current();

    var crtUserName = currentUser.get("id");

    // 房屋名称 
    var address = $("#address").val();

    var title = $("#poi_title").val();

    // 经纬度
    var geolng =Number($("#geolng").val()) ; //经度

    var geolat =Number($("#geolat").val()); //纬度
    
    //获取地理位置对象 
    var geoPoint = new AV.GeoPoint({latitude:geolat,longitude:geolng});

    // 楼栋 Building
    var building = $("#building").val();

    // 门牌号 doorNum
    var doorNum = $("#doorNum").val();

    // 房东评分 hostRate
    var hostRate = $('#hostRate').val();

    // 房东评价
    var hostItem = $("#hostItem").val();

    // 物业评分 hostRate
    var managerRate = $("#managerRate").val();

    // 物业评价
    var managerItem = $("#managerItem").val();

    // 室内设施
    var facilityText = "";

    $("[#facility :checkbox][checked]").each(function(){
      // alert($(this).val());
      facilityText += $(this).val() + ","
    });

    // 其它补充
    var otherItem = $("#otherItem").val();
    // 新增的字段
    var poi_province = $('#poi_province').val();
    var  poi_city= $('#poi_city').val();
    var  poi_uid= $('#poi_uid').val();
    var  poi_type= $('#poi_type').val();

  // 提交项 结束

    var Item = AV.Object.extend("Item");

    // 创建该类的一个实例
    var Item = new Item();
    // [Item setObject:geoPoint forKey:@"geoPoint"];
    Item.set("Itemer", crtUserName);

    Item.set("address", address);

    Item.set("title", title);

    Item.set("geoPoint",geoPoint);

    Item.set("building", building);

    Item.set("doorNum", doorNum);

    Item.set("hostRate", hostRate);

    Item.set("hostItem", hostItem);

    Item.set("managerRate", managerRate);

    Item.set("managerItem",managerItem);

    Item.set("facility",facilityText);

    Item.set("otherItem",otherItem);

    Item.set("poi_province",poi_province);

    Item.set("poi_city",poi_city);

    Item.set("poi_uid",poi_uid);

    Item.set("poi_type",poi_type);

    Item.set("submitType",submitType);

  // 权限：
    // 新建一个 ACL 实例
    var acl = new AV.ACL();
    acl.setPublicReadAccess(true);
    acl.setWriteAccess(AV.User.current(),true);

    // 将 ACL 实例赋予 Item 对象
    Item.setACL(acl);

    Item.save().then(function(Item) {
      // 成功
      alert('创建成功！');

      self.location.href = "/nearby";
    }, function(error) {
      // 失败
      alert('Failed to create new object, with error message: ' + error.message);
    });
  };

  $(".btn-success").click(function(){


    var geolng = $("#geolng").val();

    // 房东评分 hostRate
    var hostRate = $('#hostRate').val();

    // 房东评价
    var hostItem = $("#hostItem").val();

    // 物业评分 hostRate
    var managerRate = $("#managerRate").val();

    // 物业评价
    var managerItem = $("#managerItem").val();

    if( geolng == ""){
      alert("地址不能空着！");
    }else if(hostRate == undefined && hostItem == "" && managerRate == undefined && managerItem == ""){
      alert("房东或物业管理，至少评一个嘛~");
    }else if((hostRate == undefined || hostItem == "") && (managerRate == undefined && managerItem == "")){
      alert("房东的评分和评价都完善一下嘛~");
    }else if((hostRate == undefined && hostItem == "") && (managerRate == undefined || managerItem == "")){
      alert("物业的评分和评价都完善一下嘛~");
    }else{
      submitItem(1);
    }


  });
  // 仅保存的话，首先得判断
  $(".btn-primary").click(function(){
    submitItem(2);
  });

// 新评价 结束
// $('#hostRate2').change(function(){
//   var hostRate2 = $('#hostRate2').val();
//   alert(hostRate2);
// })
