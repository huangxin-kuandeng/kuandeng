/**
 * kcms-web-region CSS and JS library
 */
(function() {
	window.collectionRegion = {};
	$.mapType = collectionRegion;
    var bower_components = "../bower_components",
        dist = "../dist";
	
    /*CSS*/
    var cssStore = [
        dist + '/css/region.css',
		bower_components + '/leaflet/css/leaflet.css',
		bower_components + '/leaflet/css/reset.css',
        bower_components + '/citys/jock-citypicker-2.0.css',
        bower_components + '/bootstrap-datepicker/bootstrap-datepicker.min.css'
    ];
	
    /*SCRIPT*/
    var scriptStore = [
        dist + '/js/user/user.js',
        dist + '/js/collectionRegion/openRegion.js',			//打开采集区域
        dist + '/js/collectionRegion/triggerImp.js',			//触发采集区域导入
        dist + '/js/collectionRegion/createRegion.js',			//创建采集区域
        dist + '/js/collectionRegion/deleteRegion.js',			//删除采集区域
        dist + '/js/collectionRegion/createTable.js',			//采集区域列表
       	bower_components + '/leaflet/js/leaflet.js',
       	bower_components + '/leaflet/js/leaflet-bingCN-layer.js',
       	bower_components + '/leaflet/js/L.LabelTextCollision.js',
       	bower_components + '/leaflet/js/leaflet.label.js',
       	bower_components + '/leaflet/js/Leaflet.draw.js',
       	bower_components + '/leaflet/js/L.geoJsonFilter.js',
       	bower_components + '/leaflet/js/Leaflet.Draw.Event.js',
       	bower_components + '/leaflet/js/leaflet.polylineDecorator.js',
       	bower_components + '/leaflet/js/Path.Drag.js',
       	bower_components + '/leaflet/js/Leaflet.Editable.js',
       	bower_components + '/leaflet/js/leaflet-measure-path.js',
        bower_components + '/citys/citypicker-citylist.js',
        bower_components + '/citys/jock-citypicker-2.0.js',
        bower_components + '/bootstrap-datepicker/bootstrap-datepicker.min.js',
        bower_components + '/bootstrap-datepicker/bootstrap-datepicker.zh-CN.min.js'
    ];
	
    /*CSS*/
    for (var i = 0; i < cssStore.length; i++) {
        var cssUri = "<link rel='stylesheet' type='text/css' href='" + cssStore[i] + "'/>";
        document.write(cssUri);
    }
	
    /*SCRIPT*/
    for (var j = 0; j < scriptStore.length; j++) {
        var jsUri = "<script type='text/javascript' src='" + scriptStore[j] + "'></script>";
        document.write(jsUri);
    }
    let comp_logo = `<div class="comp_logo"
    ><img src="../dist/img/logo.png"></div>`;
    $('.main-sidebar').append(comp_logo);

    let collapse_btn = `<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" >
    </a>`;
    $('nav.navbar.navbar-static-top').prepend(collapse_btn);
})();