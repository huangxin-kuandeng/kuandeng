/**
 * 轨迹图例说明
 */
iD.ui.TrackLegend = function(context) {
	var headDatas = [
		['颜色', '质量']
	];
	var tableDatas = [
		['green', '1'],
		['cyan', '2'],
		['blue', '3'],
		['purple', '4'],
		['magenta', '5'],
		['red', '6'],
		['grey', 'Unprocessed']
	];

    return function(selection) {
        var $table = selection.selectAll('table').data([0]).enter().append('table').attr('class', 'table');
        var $thead = $table.append('thead');
        var $tbody = $table.append('tbody');
        
        $thead.selectAll('tr').data(headDatas)
            .enter().append('tr')
            .selectAll('th')
            .data(d => d)
            .enter().append('th')
            .text(d => d);
        
        $tbody.selectAll('tr').data(tableDatas)
            .enter().append('tr')
            .selectAll('td')
            .data(d => d)
            .enter().append('td')
            .html(function(d, idx){
            	// color
            	if(idx === 0){
            		return `<div class="legend-color" style="background-color: ${d};"></div>`;
            	}
//          	return `<b>${d}</b>`;
            	return d;
            });
        
        var sideWidth = d3.select('#rightmenu-tools').node().offsetWidth;
        var domWidth = selection.node().offsetWidth;
        selection.style('right', sideWidth - domWidth + 'px');
        
        var $btn = selection.selectAll('div.legend-toggle')
        	.data([0]).enter()
        	.append('div').attr('class', 'legend-toggle');
        $btn.append('span').text("轨迹图例");
        var $arrow = $btn.append('span').attr('class', 'glyphicon glyphicon-chevron-left');
        $btn.on('click', function(){
				var $trans = selection.transition().ease("liner").duration(200);
        		$arrow.classed({
        			"glyphicon-chevron-left": false,
        			"glyphicon-chevron-right":  false
        		});
        		if(selection.classed('active')){
        			selection.classed('active', false);
        			$arrow.classed('glyphicon-chevron-left', true);
        			
        			domWidth = selection.node().offsetWidth;
        			$trans.style('right', sideWidth - domWidth + 'px');
        		}else {
        			selection.classed('active', true);
        			$arrow.classed('glyphicon-chevron-right', true);
        			$trans.style('right', sideWidth + 'px');
        		}
        	});
    };
};
