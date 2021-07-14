
/******************************************************采集线路导入******************************************************/

/*采集线路导入模版*/
collectionRegion.triggerImp = function(data){
	let name = data.properties.name || data.id,
		id = data.id,
		formBody = `
	  		<div class="modal-body bodyCenter">
				<div class='col-md-12 surveyFile'>
					<input type='file' style='width:200px;margin:0 auto;' value='' readonly=''>
				</div>
	  		</div>
		`;
	
	$.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '采集线路导入（' + name + '）'
	}, function(){
		var files = $('.surveyFile input')[0].files[0];
		if(!files){
			$.spopView({
				text: '未选择任何文件'
			})
			return;
		}
		collectionRegion.submitImp(id,files);
	})
}

/*确认触发采集线路导入*/
collectionRegion.submitImp = function(id,file){
	$('#loading').css('display', 'block');
	var _url = configURL.kcms+'collection/link/imp/recollectFile?regionId='+id;
    var formData = new FormData();
    formData.append("file", file);
    $.ajax( {
        type : "POST",
        url : _url,
    	async : true,
		contentType: false,
		processData: false,
        data : formData,
        success : function(data) {
			$('#loading').css('display', 'none');
			var spopText = '采集线路导入成功',
				_type = true;
			if(data.code != '0'){
				spopText = '采集线路导入失败：'+data.code+'（'+data.message+'）';
				_type = false;
			}else{
				$.modalClose();
				collectionRegion.Table();
			}
			$.spopView({
				text: spopText,
				type: _type
			});
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
			$("#loading").css("display","none");
	   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
			$.spopView({
				text: '系统异常'
			})
        }
    });
}
