iD.fileHistory = function(context) {

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    function getKey(n) {
        return 'iD_' + window.location.origin + '_' + n;
    }
    
	var filehistory = {
//		数据保存到本地文件初始化
		blobData: null,
		
		savetxt: function(blobData) {
			filehistory.blobData = null;
			filehistory.blobData = blobData;
			window.requestFileSystem(window.PERSISTENT, 3*1024*1024, filehistory.initFs, filehistory.errorHandler);
		},

//		写入文件
		initFs: function(fs) {
		    fs.root.getFile(iD.User.getInfo().username+'_'+iD.Task.d.task_id+'.txt', { create: false }, function (fileEntry) {
		        if (fileEntry.isFile) {
				  	fileEntry.remove(function() {
//				  		console.log('删除成功');
				   	 	filehistory.createFile(fs);
				  	}, filehistory.errorHandlers);
		        }
		    }, filehistory.errorHandlers);
		}, 
		
//		创建文件
		createFile: function(fs){
		    fs.root.getFile(iD.User.getInfo().username+'_'+iD.Task.d.task_id+'.txt', { create: true },
			    function (fileEntry) {
		            fileEntry.createWriter(function (fileWriter) {
		            	if(!filehistory.blobData){
		            		return;
		            	}else{
//							var storageHistory = blobData;
			                var blob = new Blob([filehistory.blobData], {
			                    type: 'text/plain'
			                });
		                	fileWriter.write(blob);
//				  			console.log('新建成功');
		                	// console.log(blob);
		                	filehistory.showFile(fileEntry);
		            	}
//						context.storage(getKey('saved_history'), null);		//删除storage浏览器储存(超过3M时)
		            });
			    }, filehistory.errorHandlers);
	    },

//		数据太多的时候进行保存提示
		showFile: function(fileEntry) {
			if(!fileEntry){
				return fileHistory;
			}else{
		        if(context.history().hasChanges()&&!context.variable.isOpenSaveDialog){
		            context.variable.isOpenSaveDialog = true;
		            window.clearInterval(context.variable.autoSaveTime);
		            Dialog.confirm("您有很多数据还没有进行保存，是否保存？",function(){
		                context.enter(iD.modes.Save(context, "auto saving"));
		                context.variable.isOpenSaveDialog = false;
		            },function(){
		                context.variable.isOpenSaveDialog = false;
		                if( context.variable.autoSaveTime){
		                    window.clearInterval(context.variable.autoSaveTime);
		                    context.variable.autoSaveTime = window.setInterval(context.autoSave,900000);
		                }
		            })
		        }
			}
		},

//		读取文件的内容
		filejson: function(n, callback) {
			window.requestFileSystem(window.PERSISTENT, 3*1024*1024, onInitFs, filehistory.errorHandlers);
			function onInitFs(fs) {
			  	fs.root.getFile(n, {}, function(fileEntry) {
				    fileEntry.file(function(file) {
				       	var reader = new FileReader();
				       	reader.onloadend = function(e) {
				       		if(this.result && this.result != ""){
//				  				console.log('有数据');
					         	var fileResult = JSON.parse(this.result);
					         	callback(fileResult);
//					         	console.log(fileResult);
				       		}else{
				       			console.log("没有相关数据...");
				       		}
							return this.result;
				       	};
				       	reader.readAsText(file);
				    }, filehistory.errorHandlers);
			  	}, filehistory.errorHandlers);
			}
	    },
	    
//		创建文件或者获取文件失败时
		errorHandlers: function(err) {
		    console.info('获取文件失败');
		    console.info(err);
		},

//		没有权限保存文件时
		errorHandler: function(err) {
			window.webkitStorageInfo.requestQuota(PERSISTENT, 3*1024*1024, function(grantedBytes) {
			  window.requestFileSystem(PERSISTENT, 3*1024*1024, filehistory.createFile, filehistory.errorHandlers);
			}, function(e) {
			  console.log('Error', e);
			});
		},
	}

	return filehistory;

}