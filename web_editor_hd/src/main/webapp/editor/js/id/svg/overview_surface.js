iD.svg.OverviewSurface = function() {
    return function (selection) {
        selection.selectAll('defs')
            .data([0])
            .enter()
            .append('defs');

        var layers = selection.selectAll('.overview-layer')
            .data(['polygon', 'icon']);

        layers.enter().append('g')
            .attr('class', function(d) { return 'overview-layer overview-layer-' + d; });
    };
};
