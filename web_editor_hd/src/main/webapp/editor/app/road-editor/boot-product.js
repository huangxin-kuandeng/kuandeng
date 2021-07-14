;;(function(){
	var cssStore = [
		
			
				"../../build/id.min.css",
			
		
			
				"./build/app.min.css",
			
		
	];

	var scriptStore = [
		
			"./build/app.min.js",
		
	];

	for (var i = 0; i < cssStore.length; i++) {
        var cssUri = "<link rel='stylesheet' type='text/css' href='" + cssStore[i] + "'/>";
        document.write(cssUri);
    }

    for (var j = 0; j < scriptStore.length; j++) {
        var jsUri = "<script type='text/javascript' " + scriptStore[j] + " src='" + scriptStore[j] + "'></script>";
        document.write(jsUri);
    }
})();