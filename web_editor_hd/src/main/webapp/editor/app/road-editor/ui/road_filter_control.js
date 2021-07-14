iD.ui.RoadFilterControl = function(context) {

    var filterPanel = null;

    function showRoadFilter() {
        if (!filterPanel) {
            filterPanel = new iD.ui.RoadFilterPanel(context, context.container());
        }
        context.enter(iD.modes.Browse(context));
        filterPanel.show();
    }

    var buttons = [{
        id: 'road-filter-control',
        title: '要素属性查询',
        action: showRoadFilter,
        key: 'Ctrl+F'
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

        var keybinding = d3.keybinding('RoadFilterControl');

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