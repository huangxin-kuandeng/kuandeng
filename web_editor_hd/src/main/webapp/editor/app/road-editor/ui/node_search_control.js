iD.ui.NodeSearchControl = function(context) {

    var searchPanel = null;

    function showNodeSearchPanel() {
    	/*
    	var layer = iD.Layers.getCurrentEnableLayer();
    	if(!layer || !iD.Task.tasks || !iD.Task.tasks.length){
    		Dialog.alert("没有选中任务或没有编辑状态的图层，无法生成坐标点；");
    		return ;
    	}
    	*/
        if (!searchPanel) {
            searchPanel = new iD.ui.NodeSearchPanel(context, context.container());
        }
        searchPanel.show();
    }

    var buttons = [{
        id: 'node-search-control',
        title: '解析坐标定位',
        action: showNodeSearchPanel,
        key: 'Ctrl+G'
    }];

    return function(selection) {
        var button = selection.selectAll('button')
            .data(buttons)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) {
                return d.id;
            })
            .on('click.control', function(d) {
                d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(true)
                .title(function(d) {
                    return iD.ui.tooltipHtml(d.title, d.key);
                }));

        button.append('span')
            .attr('class', function(d) {
                return d.id + ' icon';
            });

        var keybinding = d3.keybinding('NodeSearchControl');

        buttons.forEach(function(b) {
            keybinding.on(b.key, function() {

                d3.event.stopPropagation();
                d3.event.preventDefault();

                b.action();
            });
        });

        d3.select(document)
            .call(keybinding);
    };
};