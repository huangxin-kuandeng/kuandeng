/**
 * 添加精度质检标记点
 * @param {Object} context
 */
iD.ui.AddAutoCheckWorkTag = function(context) {
    var btnDatas = [{
        id: 'add-autocheckwork',
        title: '精度标记',
        action: function(){
        	var mode = context.mode();
        	if(mode && mode.id != 'browse'){
        		context.enter(iD.modes.Browse(context));
        		return ;
        	}
        	context.enter(iD.modes.AddAutoCheckWorkTag(context));
        }
//      key: 'Ctrl+X'
    }];
    
    return function(selection) {
        var button = selection.selectAll('button')
            .data(btnDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) { return d.id; })
            .on('click.uizoom', function(d) { 
            	d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
//              .html(true)
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
        
        context.on('enter.add_autocheckwork', function(mode){
        	if(mode && mode.id == 'add-auto-checkwork'){
        		button.classed('active', true);
        	}
        });
        context.on('exit.add_autocheckwork', function(mode){
        	if(mode && mode.id == 'add-auto-checkwork'){
        		button.classed('active', false);
        	}
        });
    };
};