/**
 * 修改后的图层列表面板（点击按钮后展开/收起）
 * @param {Object} context
 */
iD.ui.Background = function(context) {
    var key = 'b';

    function background(selection) {


        function update() {
            //
            // backgroundList.call(drawEmptyList);
            // overlayList.call(drawEmptyList);
            // ;

            // selectLayer();
            //
            // var source = context.background().baseLayerSource();
            // if (source.id === 'custom') {
            //     customTemplate = source.template;
            // }
        }


        var content = selection.append('div')
                .attr('class', 'KDSEditor-fillL map-overlay col3 content hide1'),
            tooltip = bootstrap.tooltip()
                .placement('left')
                .html(true)
                .title(iD.ui.tooltipHtml(t('background.description'), key));

        function hide() {
            setVisible(false);
        }

        function toggle() {
            if (d3.event) d3.event.preventDefault();
            tooltip.hide(button);
            setVisible(!button.classed('active'));
        }

        function setVisible(show) {
            if (show !== shown) {
                button.classed('active', show);
                shown = show;
                var buttonWidth = selection.node().offsetWidth;
				var outPanelWidth = 300 + buttonWidth;
                if (show) {
                    selection.on('mousedown.background-inside', function() {
                        return d3.event.stopPropagation();
                    });
                    content.style('display', 'block')
                        .style('right', -outPanelWidth + 'px')
                        .transition()
                        .duration(200)
                        .style('right', buttonWidth + 'px');
                } else {
                    content.style('display', 'block')
                        .style('right', buttonWidth + 'px')
                        .transition()
                        .duration(200)
                        .style('right', -outPanelWidth + 'px')
                        .each('end', function() {
                            d3.select(this).style('display', 'none');
                        });
                    selection.on('mousedown.background-inside', null);
                }
            }
        }

        var button = selection.append('button')
                .attr('tabindex', -1)
                .on('click', toggle)
                .call(tooltip),
            shown = false;

        button.append('span')
            .attr('class', 'KDSEditor-icon layers light');


        content.call(context.ui().layermanager);

        // context.background().init(); // 初始化底图& 覆盖物

        // update();
        // setOpacity(opacityDefault);

        //
        // var keybinding = d3.keybinding('background');
        // keybinding.on(key, toggle);

        // d3.select(document)
        //     .call(keybinding);

        context.surface().on('mousedown.background-outside', hide);
        context.container().on('mousedown.background-outside', hide);
    }

    return background;
};
