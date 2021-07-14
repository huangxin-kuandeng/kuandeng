/**
 * 地图上的菜单面板（选中点、线、面等操作后数据旁边出现的菜单）
 * @param {Object} context
 * @param {Object} operations
 * @param {Object} newSelect
 */
iD.ui.RadialMenu = function(context, operations, newSelect) {
    var menu,
        center = [0, 0],
        tooltip;
/*
    增加菜单可拖拽，用到id的drag扩展行为，move里可以得到移动后的像素和坐标
*/
var radialDrag_behavior = iD.behavior.drag()
    .on('start', function() {

        })
        .on('move', function(d) {

            var delta = d3.event.delta;

            var self=d3.select(this);
            var trans=self.attr("transform")?d3.transform(self.attr("transform")).translate:[0,0];
            var transx=trans[0];
            var transy=trans[1];
            transx+=delta[0];
            transy+=delta[1];
            var translate_move=[transx,transy];
            self.attr("transform","translate("+translate_move+")");

        })
        .on('end', function() {


            var self_translate=d3.transform(d3.select(this).attr("transform")).translate;
            localStorage.setItem("transform_radialMenu",self_translate)
        });
 //拖拽功能结束

    var radialMenu = function(selection) {
        // var layers = iD.Layers,
        //     layer = layers.getCurrentEnableLayer();
        // if ((!layer || !layer.enableBox) && !newSelect) return false;


        var selTarget = iD.select && iD.select.__data__,
            selIds = context.selectedIDs();

        if (!iD.Task.working || iD.Task.working.task_id !== iD.Task.d.task_id) {
            return;
        }

        if (!selTarget && selIds && selIds.length) {

            for (var i = 0, len = selIds.length; i < len; i++) {
                if (context.hasEntity(selIds[i])) {
                    selTarget = context.entity(selIds[i]);
                    break;
                }
            }
        }

        if (!selTarget) {
            return;
        }

        if (!selTarget.tags) {
            //console.error('No tags: ', selTarget);
            return;
        }

        var layerType = selTarget.modelName;

       /* if (!iD.Static.layersInfo.isEditable(layerType)) {
            return;
        }*/ //by modify  增加此控制后无法编辑综合交叉点

        // var role = d3.select('body').attr('role');
        // if (role === 'role') {
        //     if ()
        //     return;
        // }

        if (!operations.length)
            return;

        selection.node().parentNode.focus();

        function click(operation) {
            d3.event.stopPropagation();
            if (operation.disabled())
                return;
            operation(center);
            radialMenu.close();
        }

        menu = selection.append('g')
            .attr('class', 'radial-menu')
            .attr('transform', 'translate(' + center + ')')
            .attr('opacity', 0);

        menu.transition()
            .attr('opacity', 1);

         //增加拖拽功能
        menu.call(radialDrag_behavior);

        var r = 80,
            a = Math.PI / 4,
            a0 = -Math.PI / 4,
            a1 = a0 + (operations.length - 1) * a;
        // var r = 55,
        //     a = Math.PI * 3 / 16,
        //     a0 = -Math.PI * 3 / 16,
        //     a1 = a0 + (operations.length - 1) * a;

        menu.append('path')
            .attr('class', 'radial-menu-background')
            .attr('d', 'M' + r * Math.sin(a0) + ',' +
                r * Math.cos(a0) +
                ' A' + r + ',' + r + ' 0 ' + (operations.length > 5 ? '1' : '0') + ',0 ' +
                (r * Math.sin(a1) + 1e-3) + ',' +
                (r * Math.cos(a1) + 1e-3)) // Force positive-length path (#1305)
            .attr('stroke-width', 50)
            .attr('stroke-linecap', 'round');

        var button = menu.selectAll()
            .data(operations)
            .enter().append('g')
            .attr('transform', function(d, i) {
                return 'translate(' + r * Math.sin(a0 + i * a) + ',' +
                    r * Math.cos(a0 + i * a) + ')';
            });

        button.append('circle')
            .attr('class', function(d) {
                return 'radial-menu-item radial-menu-item-' + d.id;
            })
            .attr('r', 13)
            .classed('disabled', function(d) {
                return d.disabled();
            })
            .on('click', click)
            .on('mousedown', mousedown)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        button.append('use')
            .attr('transform', 'translate(-10, -10)')
            .attr('clip-path', 'url(#clip-square-20)')
            .attr('xlink:href', function(d) {
                return '#icon-operation-' + (d.disabled() ? 'disabled-' : '') + d.id;
            });

        tooltip = d3.select(document.body)
            .append('div')
            .attr('class', 'tooltip-inner radial-menu-tooltip');

        function mousedown() {
            d3.event.stopPropagation(); // https://github.com/openstreetmap/iD/issues/1869
        }

        function mouseover(d, i) {
            var rect = context.surfaceRect(),
                angle = a0 + i * a,
                top = rect.top + (r + 25) * Math.cos(angle) + center[1] + 'px',
                left = rect.left + (r + 25) * Math.sin(angle) + center[0] + 'px',
                bottom = rect.height - (r + 25) * Math.cos(angle) - center[1] + 'px',
                right = rect.width - (r + 25) * Math.sin(angle) - center[0] + 'px';

            tooltip
                .style('top', null)
                .style('left', null)
                .style('bottom', null)
                .style('right', null)
                .style('display', 'block')
                .html(iD.ui.tooltipHtml(d.tooltip(), d.keys[0]));

            if (i === 0) {
                tooltip
                    .style('right', right)
                    .style('top', top);
            } else if (i >= 4) {
                tooltip
                    .style('left', left)
                    .style('bottom', bottom);
            } else {
                tooltip
                    .style('left', left)
                    .style('top', top);
            }
        }

        function mouseout() {
            tooltip.style('display', 'none');
        }
    };

    radialMenu.close = function() {
        if (menu) {
            menu
                .style('pointer-events', 'none')
                .transition()
                .attr('opacity', 0)
                .remove();
        }

        if (tooltip) {
            tooltip.remove();
        }
    };

    radialMenu.center = function(_) {
        if (!arguments.length) return center;
        center = _;
        if (menu) {
            menu.attr('transform', 'translate(' + center + ')');
        }
        return radialMenu;
    };

    return radialMenu;
};