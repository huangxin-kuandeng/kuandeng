/**
 * kcms-web-region CSS and JS library
 */
(function() {
	window.collectionCarGroup = {};
	$.mapType = collectionCarGroup;
    var bower_components = "../bower_components",
        dist = "../dist";
	
    /*CSS*/
    var cssStore = [
        dist + '/css/group.css',
		bower_components + '/leaflet/css/leaflet.css',
//		bower_components + '/leaflet/css/reset.css',
        bower_components + '/citys/jock-citypicker-2.0.css',
        bower_components + '/bootstrap-datepicker/bootstrap-datepicker.min.css',
        bower_components + '/bootstrap-select/bootstrap-select.min.css'
    ];
	
    /*SCRIPT*/
    var scriptStore = [
        dist + '/js/user/user.js',
        dist + '/js/collectionCarGroup/createGroup.js',			//创建设备组
        dist + '/js/collectionCarGroup/createTable.js',			//设备分组管理列表
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
        bower_components + '/bootstrap-datepicker/bootstrap-datepicker.zh-CN.min.js',
        bower_components + '/bootstrap-select/bootstrap-select.min.js'
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
    
})();