// 点覆盖物渲染，可能需要与普通渲染不同的功能，暂时不和point合并。后续再说
iD.svg.OverviewMarkerIcon = function(projection, context){
    function markerImage(selection){
        selection
                .attr('class', 'image')
                .attr('xlink:href', function(d){
                    return  d.url  ;
                });
    }


    function ________(surface, points, filter) {
        var groups = surface.select('.overview-layer-icon').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function(d) {
                return 'node point ' + d.id; 
            })
            .order();

        group.append('image')
            .call(markerImage, 'image');    

        surface.select('.overview-layer-icon').selectAll('g.point')
                            .each(function(icon) {
                                var node = this.childNodes[0];
                                var x = - icon.getSizeCenter()[0] + icon.offset[0] ;
                                var y = - icon.getSizeCenter()[1] + icon.offset[1] ;
                                node.setAttribute('width', icon.width );
                                node.setAttribute('height', icon.height);
                                node.setAttribute('transform', 'translate('+(x)+', '+(y)+')');
                            }); 


        groups.attr('transform', iD.svg.PointTransform(projection));

        groups.exit()
            .remove();
    }

    return ________;
}