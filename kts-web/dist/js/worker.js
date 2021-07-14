
onmessage =function (evt){
	var d = calculate( evt.data.trackIds,evt.data.krsUrl );
	postMessage( d );
}

function calculate(arr,krsUrl){
	var trackIdsString = "";
	var thisdata = [];
	var xmlhttp;
	for(var i=0; i<arr.length; i++){
		trackIdsString += arr[i];
		if(i != arr.length-1){
			trackIdsString = trackIdsString+",";
		}
	}
//	for(var i=0; i<arr.length; i++){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				var data = JSON.parse(xmlhttp.responseText);
				thisdata = data.result;
	    	}
		}
		xmlhttp.open("GET",krsUrl+"track/get/tracks/byTrackIds?trackIds="+trackIdsString,false);
		xmlhttp.send();
//	}
	return thisdata;

}
//postMessage(calculate());
