/**
 * kcms-web CSS and JS library
 */
(function() {
    var bower_components = "../bower_components",
        dist = "../dist";
	
    /*CSS*/
    var cssStore = [
        bower_components + '/bootstrap/bootstrap.min.css',
        bower_components + '/datatables/dataTables.bootstrap.min.css',
        bower_components + '/font-awesome/font-awesome.min.css',
        bower_components + '/Ionicons/ionicons.min.css',
        bower_components + '/spop/spop.min.css',
        dist + '/css/AdminLTE2.min.css',
        // dist + '/css/skins/skin-blue.css',
        dist + '/css/skins/skin-blue2.min.css',
        bower_components + '/zTree/zTreeStyle.css',
        dist + '/css/index.css',
        dist + '/css/common_new.css'
    ];
	
    /*SCRIPT*/
    var scriptStore = [
        '../config.js',
        bower_components + '/jquery/jquery.min.js',
        bower_components + '/jquery-ui/jquery-ui.min.js',
        bower_components + '/bootstrap/bootstrap.min.js',
        bower_components + '/spop/spop.min.js',
        bower_components + '/datatables/jquery.dataTables.min.js',
        bower_components + '/datatables/dataTables.bootstrap.min.js',
        // dist + '/js/adminlte.js',
        dist + '/js/adminlte.min.js',
        '../boot.js',
        dist + '/js/currency/method.js',
        dist + '/js/user/jquery.oauth2-client.js',
        bower_components + '/zTree/jquery.ztree.all.min.js',
        bower_components + '/zTree/jquery.ztree.core.js',
        bower_components + '/zTree/jquery.ztree.excheck.js'
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