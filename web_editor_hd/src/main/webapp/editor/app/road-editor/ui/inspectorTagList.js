/**
 * 渲染打标后的问题列表
 * @param {Object} context
 */
iD.ui.InspectorTagList = null;
(function(){return;})();//return null;
var unusefn_InspectorTagList = function(context, modelName) {
    var entityEditor = iD.ui.EntityEditor(context),
   	rawTagEditor = iD.ui.RawTagMarkEditor(context),
        state = 'select',
        tagModelName = modelName || iD.data.DataType.QUALITY_TAG;
    var tagFilter = iD.ui.InspectorTagFilter(context);

    function inspector(selection, entityid, clearHtml = true) {
        //设置属性面板是否可用样式
        selection.classed('KDSEditor-inspector-disabled',true);
        // selection.classed('KDSEditor-inspector-disabled',!entity.layerInfo().enable);
        
        var hasFilter = tagFilter.modelName(tagModelName).isFilterType();

        var $wrap = selection.selectAll('.KDSEditor-panewrap')
            .data([0]);

        var $enter = $wrap.enter().append('div')
            .attr('class', 'KDSEditor-panewrap');
		// entity-editor-pane
        $enter.append('div')
            .attr('class', 'KDSEditor-pane');
		
		var filterHeight = 0;
		$wrap.select('.KDSEditor-pane').selectAll('.KDSEditor-inspector-filter').remove();
		if(/*hasFilter*/false){
			var $filter = $wrap.select('.KDSEditor-pane').selectAll('.KDSEditor-inspector-filter')
			    .data([0]);
			$enter = $filter.enter().insert('div', ':first-child')
			    .attr('class', 'KDSEditor-inspector-filter')
			    .call(tagFilter);
			filterHeight = $filter.node() && $filter.node().offsetHeight;
		}

        var $body = $wrap.select('.KDSEditor-pane').selectAll('.KDSEditor-inspector-body')
            .data([0]);

        $enter = $body.enter().append('div')
            .attr('class', 'KDSEditor-inspector-body');

		let modelClass = 'raw-tml-' + tagModelName.toLowerCase();
        $enter.append('div')
            .attr('class', 'KDSEditor-inspector-border raw-taglist-editor KDSEditor-inspector-inner ' + modelClass);
        
        $body.style('height', 'calc(100% - ' + filterHeight + 'px)');
        /*
        if(!clearHtml){
        	let layer = iD.Layers.getCurrentModelEnableLayer(tagModelName);
        	if(!layer || !layer.editable || !layer.display){
        		clearHtml = true;
        	}
        }
        */
//      $body.select('.raw-taglist-editor')
        $body.select('.' + modelClass)
            .call(rawTagEditor
            	.modelName(tagModelName)
            	.clearHtml(clearHtml)
            	.selectEntity(entityid)
            	.state(state)
            	.tagFilter(tagFilter));
        
    	rawTagEditor.on('change.inspectorTag', function(tags, id){
    		entityEditor.entityID(id).changeTags(tags);
    	});
    }
    

    inspector.state = function(_) {
        if (!arguments.length) return state;
        state = _;
        rawTagEditor.state(state);
        return inspector;
    };
    
    inspector.isMatchType = function(id){
    	return id && context.hasEntity(id) && context.entity(id).modelName == tagModelName;
    }

    return inspector;
};
