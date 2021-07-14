iD.ui.Modes = function(context) {
    var modes = [
        iD.modes.AddPoint(context),
        iD.modes.AddLine(context),
        iD.modes.AddArea(context)];

    return function(selection) {
        var buttons = selection.selectAll('button.add-button')
            .data(modes);

       buttons.enter().append('button')
           .attr('tabindex', -1)
           .attr('class', function(mode) { return mode.id + ' add-button KDSEditor-col4'; })
           .on('click.mode-buttons', function(mode) {
               if (mode.id === context.mode().id) {
                   context.enter(iD.modes.Browse(context));
               } else {
                   context.enter(mode);
               }
           })
           .call(bootstrap.tooltip()
               .placement('bottom')
               .html(true)
               .title(function(mode) {
                   return iD.ui.tooltipHtml(mode.description, mode.key);
               }));

        context.map()
            .on('move.modes', _.debounce(update, 500));
        
        // 监听图层管理面板操作事件
     //    context.ui().layermanager.on('change.modes', function(d){
     //    	var currlayer = context.layers().getCurrentEnableLayer();
     //    	buttons.each(function(o){
     //    		var b = true;
    	// 		if(o.button == d.type){
					// b = !d.enable;
    	// 		}
    	// 		if(currlayer && currlayer.id != d.id){
    	// 			b = false;
    	// 		}
    	// 		d3.select(this).property('disabled', b);
     //    	});
     //    });
        context.ui().layermanager.on('nodisplay.modes', function(d){
        	var bb = false;
        	buttons.each(function(o){
        		if(d3.select(this).classed("active"))bb = true;
        	});
        	if(bb){
        		alert('请退出编辑操作模式');
        	}
        	context.barButtonActive2 = bb;
        });
        context
            .on('enter.modes', update);

        update();

        buttons.append('span')
            .attr('class', function(mode) { return mode.id + ' KDSEditor-icon KDSEditor-icon-pre-text'; });

        buttons.append('span')
            .attr('class', 'label')
            .text(function(mode) { return mode.title; });

        context.on('enter.editor', function(entered) {
        	// var layer = context.layers().getCurrentEnableLayer();
        	var layer = context.layers().getLayer();
        	if (layer && layer.isRoad()) return;
        	if(entered.type != "road"){
        		buttons.classed('active', function(mode) { return entered.button === mode.button; });
        	}
            context.container()
                .classed('mode-' + entered.id, true);
        });

        context.on('exit.editor', function(exited) {
        	outDrawLineMode();
            context.container()
                .classed('mode-' + exited.id, false);
        });
        
        //导航工具箱"继续绘制道路"按钮, 绘制时按钮退出选中状态
        function outDrawLineMode () {
        	// var layer = context.layers().getCurrentEnableLayer();
        	var layer = context.layers().getLayer();
        	if (layer && layer.isRoad() && context.__road_line_btn___){
        		context.__road_line_btn___.classed('active', false);
        		context.__road_line_btn___ = null;
        		delete context.__road_line_btn___;
        	}
        }

        var keybinding = d3.keybinding('mode-buttons');

        //快捷键
        modes.forEach(function(m) {
            keybinding.on(m.key, function() { 
            	buttons.each(function(o){
	    			if(m.button === o.button && !d3.select(this).property('disabled')){
	    				if (context.editable()) context.enter(m); 
	    			}
            	});
            });
        });

        d3.select(document)
            .call(keybinding);

//        根据当前可用图层设置TOOLBAR按钮可用状态
        function update() {
        	// var currLayer = context.layers().getCurrentEnableLayer();
        	var currLayer = context.layers().getLayer();
        	if(context.map().editable()){
        		buttons.each(function(o){
        			var b = true;
        			if(currLayer && currLayer.type == o.button){
        				b = false;
        			}
        			d3.select(this).property('disabled', b);
        		});
        	}else{
        		//地图不可编辑，按钮也不可用
        		buttons.property('disabled', true);
        	}
        	setButtonVisible ();
        }
        
        function setButtonVisible () {
        	var currLayer = context.layers().getLayer();
        	// var currLayer = context.layers().getCurrentEnableLayer();
        	buttons.each(function () {
	   			if (this.disabled) this.style.display = 'none';
	   			else this.style.display = 'block';
	   			this.style.width = '43px';
	   			if (currLayer && currLayer.isArea()) this.style.width = '42px';
	   			this.parentNode.style.width = '53px';
	   			this.style.borderRadius = '4px 4px 4px 4px';
	   		});
	   	}
    };
};
