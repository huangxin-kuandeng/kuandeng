/**
* map editor CSS and JS library
*/
(function(){
    var root = "./";
//  var root = "./leaflet";
	var css = "css", script = "js", config = "data/config";
	// CSS
	var cssStore = [
		css + '/leaflet.css',
		css + '/reset.css'
	];
	// SCRIPT 
	var scriptStore = [
       	script + '/leaflet.js',
       	script + '/leaflet-bingCN-layer.js',
       	script + '/L.LabelTextCollision.js',
       	script + '/leaflet.label.js',
       	script + '/Leaflet.draw.js',
       	script + '/L.geoJsonFilter.js',
       	script + '/Leaflet.Draw.Event.js',
       	script + '/leaflet.polylineDecorator.js',
       	script + '/Path.Drag.js',
       	script + '/Leaflet.Editable.js',
       	script + '/leaflet-measure-path.js'
	];
	
	//CSS WRITE
	for(var i = 0; i<cssStore.length; i++){
		var cssUri = "<link rel='stylesheet' type='text/css' href='"+ root + cssStore[i]+"'/>";
		document.write(cssUri);
	}
	
	for(var j = 0; j<scriptStore.length; j++){
		var jsUri = "<script type='text/javascript' " +  scriptStore[j] + " src='"+ root + scriptStore[j]+"'></script>";
		document.write(jsUri);
	}
})();