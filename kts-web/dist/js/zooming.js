
var Zooms = {
	
	zoomIn: function(dom){
		var imageUrl = dom.title;
		var nowUrl = $("#zoomImg")[0].src;
		var display = $("#zoomImg").css("display");
		
		if( (display == "block") && (nowUrl == imageUrl) ){
			$("#zoomImg").fadeOut(100);
		}else if(display == "none"){
			$("#zoomImg").attr('src',imageUrl);
			$("#zoomImg").fadeIn(100);
		}else{
			$("#zoomImg").attr('src',imageUrl);
		}
	},
	
	openImage: function(){
		var imageUrl = createTasks.thisActivity["src"];
		var display = $("#zoomImg").css("display");
		if( display == "block" ){
			$("#zoomImg").fadeOut(100);
		}else if(display == "none"){
			$("#zoomImg").attr('src',imageUrl);
			$("#zoomImg").fadeIn(100);
		}
	}
	
}