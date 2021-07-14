
/******************************************************采集区域删除******************************************************/

/*删除设备组模版*/
collectionCarGroup.deleteModal = function(data){
	let name = data.properties.name || data.id,
		id = data.id;
	var formBody = `
  		<div class="modal-body bodyCenter">
			确认要删除设备组：${name}？
  		</div>
	`;
	
	$.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '删除设备组'
	}, function(){
		collectionCarGroup.deleteRegion(id);
	})
}

/*确认删除设备组*/
collectionCarGroup.deleteRegion = function(id){
	var _url = configURL.kcms+'collection/group/deleteById';
	$.postAjax({
		url: _url,
		data: {
			"id": id
		}
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
		collectionCarGroup.Table();
	})
	
}