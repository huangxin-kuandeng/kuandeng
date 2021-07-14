
/******************************************************采集版本创建页******************************************************/

/*点击创建版本*/
$(".createVersion").click(function(){
	collectionVersion.createVersion();
})

/*创建版本所需要的参数*/
collectionVersion.createForm = [
	{
		id: 'version',
		name: '名称',
		require: true,
		small: false
	}
];

/*创建版本模版*/
collectionVersion.createVersion = function(){
	var formChild = $.createForm(collectionVersion.createForm);	
	var formBody = `
  		<div class="modal-body">
            ${formChild.map(f => `
                ${f}
            `).join('')}
  		</div>
	`;
	$.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '创建采集版本'
	}, function(){
		var version = $('.version').val();
		if(!version){
			$.spopView({
				text: '参数缺失：名称'
			});
			return;
		}
		collectionVersion.submitVersion(version);
	})
}

/*提交采集版本的创建*/
collectionVersion.submitVersion = function(version){
	var _url = configURL.kcms+'collection/version/create?version='+version;
	$.getAjax({
		url: _url
	}, function(data){
		var message = (data.code == '0') ? '创建成功' : ('创建失败：'+data.message),
			type = (data.code == '0') ? true : false;
		$.spopView({
			text: message,
			type: type
		});
		if(data.code != '0'){
			return;
		}
		$.modalClose();
		collectionVersion.Table();
	})
}
