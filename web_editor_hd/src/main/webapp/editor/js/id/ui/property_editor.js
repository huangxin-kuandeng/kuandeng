iD.ui.PropertyEditor = function(context) {
	var inspector = iD.ui.Inspector(context);
	
	function propertyEditor(selection){

		//属性面板
		//收缩条
		var showBar = selection.append('div').attr('class','right-splitter');
		//收缩按钮
		showBar.append('div').attr('class','splitter_tab').on('click',function(){
			var proEditor = d3.select('.property-editor-container');
        	var proW = proEditor.style('width');
        	var proH = proEditor.style('height');
        	var proWH = eval("("+proEditor.attr('name')+")");
        	var pClose = proEditor.attr('pClose');
        	//关闭时显示的宽高
        	var closeW = '10px';
        	//var closeH = '50px';
        	
        	//标记打开 / 关闭
        	if(!pClose || pClose == 0){
        		d3.select(this).attr('class','splitter_tab splitter_tab_open');
        		// 关闭
        		proEditor.attr('pClose', 1);
        		proEditor.attr('name',"{width:'"+proW+"',height:'"+proH+"'}");
        	}else{
        		d3.select(this).attr('class','splitter_tab');
        		// 展开
        		proEditor.attr('pClose', 0);
        		closeW = proWH.width;
        		closeH =  proWH.height;
        	}
        	// 动画
            proEditor
            .transition()
            .duration(200)
            .style('width', closeW)
           // .style('height', closeH);
		});
		
		var inspectorWrap = selection.append('div')
            .attr('style', 'float:left')
			.attr('class', 'KDSEditor-inspector-hidden');

		propertyEditor.hover = function(id){

			if(id){
				//复杂路口的线不列出属性
				if(context.entity(id).isOneRoadCrossWay())return;

				inspeShowToggle('block');
				inspectorWrap.classed('KDSEditor-inspector-hidden', false)
                    .classed('KDSEditor-inspector-hover', true);
				if (inspector.entityID() !== id || inspector.state() !== 'hover') {
                    inspector
                        .state('hover')
                        .entityID(id);

                    inspectorWrap.call(inspector);
                }
			}else{
				//inspectorWrap.classed('inspector-hidden', true);
                //inspector.state('hide');
				inspeShowToggle('none');//隐藏属性内容
			}
		}
		propertyEditor.select = function(id,newFeature){
			if(id){
				inspeShowToggle('block');
				inspectorWrap.classed('KDSEditor-inspector-hidden', false)
                    .classed('KDSEditor-inspector-hover', false);
				if (inspector.entityID() !== id || inspector.state() !== 'select') {
                    inspector
                        .state('select')
                        .entityID(id)
                        .newFeature(newFeature);

                    inspectorWrap.call(inspector);
                }
			}else{
				//inspectorWrap.classed('inspector-hidden', true);
                //inspector.state('hide');
				inspeShowToggle('none');//隐藏属性内容
			}
		}
		propertyEditor.hide = function(){
			inspectorWrap.classed('KDSEditor-inspector-hidden', true);
			inspeShowToggle('none');
		}
		//设置属性是内容是否可见
		function inspeShowToggle(state){
			d3.select('.KDSEditor-inspector-body').attr('name',state);//标记可见状态
			d3.select('.KDSEditor-inspector-body').style('display', state);//隐藏属性内容
		}
		//监听 地图事件
		context.map().on('move.proEditor', _.debounce(function(){
			//超出可用范围属性内容不显示
			if(!d3.select('.KDSEditor-inspector-body').size())return;
			var state = d3.select('.KDSEditor-inspector-body').attr('name');
			if(state != 'none'){
				d3.select('.KDSEditor-inspector-body').style('display', context.map().editable() ? 'block' : 'none');
			}
		}, 500));
	}
	return propertyEditor;
}