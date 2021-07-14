/**
 * kcms-web-version CSS and JS library
 */
(function() {
	window.collectionVersion = {};
    var bower_components = "../bower_components",
        dist = "../dist";
	
    /*CSS*/
    var cssStore = [
        dist + '/css/version.css'
    ];
	
    /*SCRIPT*/
    var scriptStore = [
        dist + '/js/user/user.js',
        dist + '/js/collectionVersion/createTable.js',
        dist + '/js/collectionVersion/createVersion.js'
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