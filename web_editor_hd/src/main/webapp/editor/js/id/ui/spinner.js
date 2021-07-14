iD.ui.Spinner = function(context) {
    var connection = context.connection();

    return function(selection) {
        selection.classed('hidden', true);
        var img = selection.append('img')
            .attr('id',"KDSEditor-spinner-loading")
            .attr('src', context.imagePath('loader-black.gif'))
            .style('opacity', 0);

        connection.on('loading.spinner', function() {
        	//无矢量数据加载不显示加载标识
            // iD.Layers.getDataLayers().length > 0 &&
            img.transition()
                .style('opacity', 1);
            selection.classed('hidden', false);
        });

        connection.on('loaded.spinner', function() {
            img.transition()
                .style('opacity', 0);
            selection.classed('hidden', true);
        });
    };
};
