/**
 * 实际的图层列表的父容器，在sidebar中被初始化；
 * 图层列表信息在layermanager中初始化
 * @param {Object} context
 */
iD.ui.LayerPane = function(context) {
	var featureList = iD.ui.FeatureList(context),
		managerPane = context.ui().layermanager,
		sublayerList = iD.ui.SublayerList(context);
	var layerPane = function(selection){

		featureList.on('close',setFeature);

		var $wrap = selection.selectAll('.KDSEditor-panewrap')
            .data([0]);

        var $enter = $wrap.enter().append('div')
            .attr('class', 'KDSEditor-panewrap');

        $enter.append('div')
            .attr('class', 'layer-manager-pane KDSEditor-pane');

        $enter.append('div')
            .attr('class', 'KDSEditor-feature-list-pane KDSEditor-pane');

        var $managerPane = $wrap.select('.layer-manager-pane');
        var $featurePane = $wrap.select('.KDSEditor-feature-list-pane');

		// $managerPane.call(managerPane);

		function setFeature(){
			$wrap.transition()
                .styleTween('right', function() { return d3.interpolate('0%', '-100%'); });
		};
		function setManager(layerInfo){
			$wrap.transition()
                .styleTween('right', function() { return d3.interpolate('-100%', '0%'); });
            $featurePane.call(featureList.layerInfo(layerInfo));
		};
		function setSublayerList(layerInfo){
			layerInfo && layerInfo.isRoad() && $managerPane.call(sublayerList.layerInfo(layerInfo));
		};
	}
	return layerPane; 
}