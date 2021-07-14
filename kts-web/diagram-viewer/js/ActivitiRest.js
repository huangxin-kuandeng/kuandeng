/*
 * 
 * 工作流运作时的重要执行函数
 * 
 */

var ActivitiRest = {
	options: {},
	getProcessDefinitionByKey: function(processDefinitionKey, callback) {
		var url = Lang.sub(this.options.processDefinitionByKeyUrl, {processDefinitionKey: processDefinitionKey});
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
				var processDefinition = data;
				if (!processDefinition) {
					console.error("Process definition '" + processDefinitionKey + "' not found");
				} else {
				  callback.apply({processDefinitionId: processDefinition.id});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			console.error('Get diagram layout['+processDefinitionKey+'] failure: ', textStatus, 'error: ', error, jqXHR);
		});
	},
	
	getProcessDefinition: function(processDefinitionId, callback) {
		var url = Lang.sub(this.options.processDefinitionUrl, {processDefinitionId: processDefinitionId});
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
				var processDefinitionDiagramLayout = data;
				window.TaskName = data.processDefinition.key;
				if (!processDefinitionDiagramLayout) {
					console.error("Process definition diagram layout '" + processDefinitionId + "' not found");
					return;
				} else {
					callback.apply({processDefinitionDiagramLayout: processDefinitionDiagramLayout});
				}
			}
		}).done(function(data, textStatus) {
//			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			console.log('Get diagram layout['+processDefinitionId+'] failure: ', textStatus, jqXHR);
		});
	},
	
//	高亮的执行函数与回调
	getHighLights: function(processInstanceId, callback) {
		var url = Lang.sub(this.options.processInstanceHighLightsUrl, {processInstanceId: processInstanceId});
//		http://192.168.5.34:33300/kts/process-instance/655018/highlights?callback=?
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
//				console.log("ajax returned data");
				var highLights = data;
				if (!highLights) {
					console.log("highLights not found");
					return;
				} else {
					window.activitySonId = false;
					if( (data.activities[0] == "triggerEndService") || (data.activities[0] == "triggerStartService") ){
						window.activitySonId = true;
					}
					window.operation = data.activities[0];
					callback.apply({highLights: highLights});
				}
			}
		}).done(function(data, textStatus) {
//			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
		  	console.log('Get HighLights['+processInstanceId+'] failure: ', textStatus, jqXHR);
		});
	}
};