/**
 * 编辑器-保存按钮的初始化
 * @param {Object} context
 */
iD.ui.Save = function(context) {
    var history = context.history(),
        key = iD.ui.cmd('⌘S');

    function saving() {
        return context.mode().id === 'save' && iD.modes.Save.isSaving();
    }

    function save(t) {
        if(iD.Task.isLocalTaskSys()){
            return ;
        }
        d3.event.preventDefault();
        if (!saving() && history.hasChanges()) {
        	if(!iD.User.authEditSave()/* || !iD.svg.Pic.dataMgr.heightDiff*/){
        		return ;
        	}
        	
           	// var prelayer = context.layers().getCurrentEnableLayer();
           	var prelayer = context.layers().getLayer();
			if (prelayer && prelayer.isRoad() && prelayer.split) {
				
				var graph = context.graph();
					changes = context.history().changes(iD.actions.DiscardTags(context.history().difference())),
					created = [].concat(changes['created']), modified = [].concat(changes['modified']);
				
				var vertexs = [], lines = [], totals = created.concat(modified), filter = {}, enty, geotory;
				totals.forEach(function (v) {
					geotory = v.geometry(graph);
					if (geotory === 'line') {
						v.nodes.forEach(function (n) {
							enty = graph.entity(n);
							if (graph.parentWays(enty).length >= 3) {
								!filter[enty.id] && (vertexs.push(enty));
								filter[enty.id] = true;
							}
						});
					} else if (geotory === 'vertex' && graph.parentWays(v).length >= 3) {
						!filter[v.id] && (vertexs.push(v));
						filter[v.id] = true;
					}
				});

				//console.log('#############: ', vertexs);
				
				vertexs = vertexs.filter(function (v) {
					if (MapSheet.isPointOnRectSide(v.loc, context)) return true;
					return false;
				});
				
				//console.log('vertexs: ', vertexs);
				
				//if (vertexs.length) {
				//	context.container().call(iD.ui.RoadSplitByMesh(context).vertexs(vertexs));
				//} else {
				//	context.enter(iD.modes.Save(context, t));
				//}
                context.enter(iD.modes.Save(context, t));
			} else {
				context.enter(iD.modes.Save(context, t));
			}
            context.variable.checkUseHistoryFlag = true;
        }
    }

    context.ui().layermanager.on('change.save', function(d, type){
    	// var prelayer = context.layers().getCurrentEnableLayer();
    	/* var prelayer = context.layers().getLayer();
    	if(type === 'display' && (prelayer && d.type === prelayer.type && d.editable || !prelayer)){
    		save('layermanager');
    	}
    	var bb = '';
        context.undo_redo_buttons && context.undo_redo_buttons.each(function(){
    		bb += d3.select(this).classed('disabled');
    	});
    	if(bb === 'truefalse'){
    		context.flush();
    	}; */
    });
    return function(selection) {
        var tooltip = bootstrap.tooltip()
            .placement('bottom')
            .html(true)
            .title(iD.ui.tooltipHtml(t('save.no_changes'), key));

        var button = selection.append('button')
            .attr('class', 'save KDSEditor-col12 disabled')
            .attr('tabindex', -1)
            .on('click', save)
            .call(tooltip);

        button.append('span')
            .attr('class', 'label')
            .text(t('save.title'));

        // button.append('span')
        //     .attr('class', 'count')
        //     .text('0');

        var keybinding = d3.keybinding('undo-redo')
            .on(key, save);

        d3.select(document)
            .call(keybinding);

        var numChanges = 0;

        context.history().on('change.save', function() {
            var _ = history.difference().summary().length;
            if (_ === numChanges)
                return;
            numChanges = _;
            
            var noAuth = false;
            var tooltipText;
            // 非质检系统时，无保存/编辑权限
            if(!iD.User.authEditSave()){
            	numChanges = 0;
            	noAuth = true;
            	tooltipText = t("permission.edit_no_save");
        	}else {
        		tooltipText = t(numChanges > 0 ? 'save.help' : 'save.no_changes');
        	}
            

            tooltip.title( iD.ui.tooltipHtml(tooltipText, key) );

            button
                .classed('disabled', numChanges === 0/* || !iD.svg.Pic.dataMgr.heightDiff*/)
                .classed('has-count', numChanges > 0);

            button.property('disabled', saving());

            button.select('span.count')
                .text(numChanges);
        });
		
		// 通过context.enter(iD.modes.Save(xxx))保存后，
		// 偶尔地图不会重新渲染，手动调用渲染逻辑
        context.on('enter.save', function() {
            button.property('disabled', saving());
            if (saving()) {
            	button.call(tooltip.hide);
//          	context.map() && context.map().redraw();
            }
        });
    };
};
