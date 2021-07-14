/**
 * 绘制多边形，任务信息
 * @param {Object} context
 */
iD.ui.TaskInfoPolygon = function(context) {
//	var clipboard = null, clipboard2 = null;
	var singleDialog = null;
	var loadXhr = null;
    var loading = iD.ui.Loading(context).message("任务信息加载中 ...").blocking(true);
    var typeSort = [1, 2, 3, 0, 4];
	
    var buttonDatas = [{
        id: 'taskinfo-polygon',
        title: '任务信息',
        action: function(){
	    	if(!iD.Task.d){
	    		return ;
	    	}
			if(singleDialog && !singleDialog.closed){
				singleDialog.close();
			}
			showLoading();
			
			var data = [];
			
			loadXhr = iD.util.loadNetworkTagBussinfo(iD.Task.d.task_id, null, function(result){
				hideLoading();
				result.forEach(function(d){
					var name = d.link;
					var type = d.id;
					var v = d.params || '';
					if(!data[type]){
						data[type] = {
							name: name,
							type: type,
							values: []
						};
					}
					v && data[type].values.push(v);
				})
				
				showDialog(data);
			});
        }
    }];
    
    function showDialog(dataList){
		singleDialog = Dialog.open({
			Title: iD.Task.d.task_id + ' 任务信息',
			InnerHtml: '<div id="taskinfo_dialog_html" class="taskinfo_dialog_html"></div>',
			Width: 1000,
			Height: 600,
			Modal: false,
			CancelEvent: function(){
				loadXhr && loadXhr.abort();
				loadXhr = null;
				
				singleDialog.close();
				singleDialog = null;
			}
		});
		
		var $container = d3.select('#_Container_' + singleDialog.ID);
		$container
			.style('width', '100%')
			.style('overflow-y', 'auto');
		
		var content = '';
		for(let i of typeSort){
			let d = dataList[i];
			if(!d) continue;
			let name = d.name;
			let infos = d.values;
			content += '<div class="row">'
			content += '<span class="title">' + name + ':</span><br>';
			if(infos && infos.length){
				infos.forEach(function(infostr){
					content += '<p class="line">' + infostr + '</p>';
				});
			}
			content += '</div>'
		}
		
		$container.select('#taskinfo_dialog_html')
			.style({
				"text-align": "left",
				"font-size": "14px"
			})
			.html(content);
    }
    
    function showLoading(){
        context.container().call(loading);
    }
    function hideLoading(){
    	loading.close();
    }
 
    return function(selection) {
        var button = selection.selectAll('button')
            .data(buttonDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) { return d.id; })
            .on('click.uizoom', function(d) { 
            	d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(false)
                .title(function(d) {
//                  return iD.ui.tooltipHtml(d.title, d.key);
                    return d.title;
                }));

        button.append('span')
        	.attr('class', 'text-fill')
            .text(function(d) { 
            	var str = d.title;
        		for(var key in d.style){
        			this.style[key] = d.style[key];
        		}
            	return str.substring(0, d.titleNum || 4);
            });
    };
};