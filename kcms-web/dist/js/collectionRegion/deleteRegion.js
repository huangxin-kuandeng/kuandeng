
/******************************************************采集区域删除******************************************************/

/*删除采集区域模版*/
collectionRegion.deleteModal = function(data){
	let name = data.properties.name || data.id,
		id = data.id;
	var formBody = `
  		<div class="modal-body bodyCenter">
			确认要删除采集区域：${name}？
  		</div>
	`;
	
	$.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '删除采集区域'
	}, function(){
		collectionRegion.deleteRegion(id);
	})
}

/*确认删除采集区域*/
collectionRegion.deleteRegion = function(id){
	var _url = configURL.kcms+'collection/region/deleteById?id='+id;
	$.postAjax({
		url: _url,
		data: {}
	}, function(data){
		var message = (data.code == '0') ? '删除成功' : ('删除失败：'+data.message),
			type = (data.code == '0') ? true : false;
		$.spopView({
			text: message,
			type: type
		});
		if(data.code != '0'){
			return;
		}
		$.modalClose();
		collectionRegion.Table();
	})
	
}