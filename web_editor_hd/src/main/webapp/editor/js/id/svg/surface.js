/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-21 17:29:29
 * @Description: 
 */
/**
 * layer-xxxx图层div
 */
iD.svg.Surface = function() {
    return function (selection) {
        selection.selectAll('defs')
            .data([0])
            .enter()
            .append('defs');

             /*
                surface 下绘制div相关的layer

                'polyicon', 测距相关圆圈和关闭的叉
                'polyline'  测距相关的线              在dom层级最后，确保不被其他svg压盖
                'walk'        步导相关，包括：步导点和步导线，步导面

            */

        var layers = selection.selectAll('.layer')
            .data(['dref_memberareas', 'divider_effectareas', 'areas', 'lines', 'hit','dividers', 'halo', 'label',
                   'traffic', 'roadcross', 'zlevel', 'speedcamera',
                   'polygon','marker','polylabel','polygonlabel',
                   'circle','icon','pic','detailslope','qctag','zdshp','reftags','pbktags','forbidinfo','roadcrossline',
                'transaction','walk','walkzlevel','polyicon','polyline','placename', 'searchpoint', 'points', 'way_direction']);

        layers.enter().append('g')
            .attr('class', function(d) {
                if(d=='detailslope'||d == 'roadcrossline' || d=='transaction'){
                    return 'layer layer-' + d + ' no-pointer-events';}

                return 'layer layer-' + d; });


    };
};
