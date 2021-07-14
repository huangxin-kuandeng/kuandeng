iD.ui.RoadSplitByMesh = function(context){
	var event = d3.dispatch('meshsplit'), vertexs;
	var modal;
	function getVertexIds () {
		if (!vertexs || !vertexs.length) return [];
		return _.map(vertexs, 'id');
	}

	function roadSplitByMesh (selection) {
        Dialog.alert('非法操作点,三阶以上节点:' + getVertexIds(),'','跨图幅切分非法操作');
		/*var modal = iD.ui.modal(selection);
		modal.select('.modal').classed('modal-alert', true);
        //隐藏掉右上角的关闭按钮
        modal.select('button.close').style('display', 'none');

    	var section = modal.select('.KDSEditor-content');
    	var restriction = section.append('div').attr('class', 'traffic-area');
    	restriction.append('div').attr('class', 'title').html('跨图幅切分非法操作');

    	var wrap = restriction.append('div');

		drawTagsDetail();*/

		function drawTagsDetail() {

			var items = wrap.html('');
    		items.append('p').html('非法操作点');

    		var carRule = items.append('div').attr('class','rule-list-info');
    		carRule.append('h1').html('三阶以上节点:');

    		var cbList = carRule.selectAll('.item-type').data(getVertexIds(), function (d) { return d;});
    		var cbEnter = cbList.enter().append('div').attr('class', 'item-type');

    		cbEnter.append('label').attr('class','car-name');

    		cbEnter.select('label.car-name').html(function(d){ return d;});

    		//bottom
    		var bottom = items.append('div').attr('class', 'bottom');
    		bottom.append('input').attr('type', 'button').attr('class', 'cancel').on('click', btnClose).property('value', '确定');
		}

		function btnClose(){
			modal.close();
		}

	};

	roadSplitByMesh.vertexs = function(_){
    	if(!arguments.length) return vertexs;
    	vertexs = _;
    	return roadSplitByMesh;
    };

	return d3.rebind(roadSplitByMesh, event, 'on');
}