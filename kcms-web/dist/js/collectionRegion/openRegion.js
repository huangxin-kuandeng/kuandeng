
/******************************************************采集区域详情页******************************************************/

/*查看单个采集区域模版*/
collectionRegion.openRegion = function(data){
	let name = data.properties.name || data.id,
		geometry = data.geometry,
		formBody = `
	  		<div id="leafletMap" class="modal-body">
	  			
	  		</div>
		`;
	
	var collection_link = configURL.kcms_mre+'?lid=collection_link&get=collection_link&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540&regionId='+data.id;
	$.modalCreate({
		html: formBody,
		id: 'bigModal',
		head: '采集区域：' + name,
		_fn: function(){
			$.mapLeaflet({
				'url': collection_link
			},function(){
				$.spopView({
					text: '地图初始化完成！',
					type: true
				})
				collectionRegion.openRegionInit(data);
			})
		}
	})
}

/*采集区域详情---范围展示*/
collectionRegion.openRegionInit = function(data){
	var coordinates = data.geometry.coordinates[0];
	if(!coordinates || !coordinates.length){
		$.spopView({
			text: '当前采集区域不存在范围'
		})
		return;
	}
    var centerNode = [coordinates[0][1], coordinates[0][0]];
    leafletMap.setView(centerNode);
    var polygon = L.geoJSON(data, {
        style: function (feature) {
            return {color: "red"};
        }
    }).addTo(leafletMap);
}
