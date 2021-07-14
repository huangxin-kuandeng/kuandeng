iD.ui.MeshBoundryTip = function (context, callback) {
    var event = d3.dispatch('meshboundry'), vertexs;

    function meshBoundryTip(selection) {

        var modal = iD.ui.modal(selection);
        modal.select('.modal').classed('modal-alert', true);
        //隐藏掉右上角的关闭按钮
        modal.select('button.close').style('display', 'none');

        var section = modal.select('.KDSEditor-content');
        var restriction = section.append('div').attr('class', 'traffic-area');
        restriction.append('div').attr('class', 'title').html('提示');

        var wrap = restriction.append('div');

        drawTagsDetail();

        function drawTagsDetail() {

            var items = wrap.html('');
            items.append('p').html('非法操作');

            var carRule = items.append('div').attr('class', 'rule-list-info');
            var cbList = carRule.selectAll('.item-type').data(['已出对象边界'], function (d) {
                return d;
            });
            var cbEnter = cbList.enter().append('div').attr('class', 'item-type');

            cbEnter.append('label').attr('class', 'car-name');

            cbEnter.select('label.car-name').html(function (d) {
                return d;
            });

            //bottom
            var bottom = items.append('div').attr('class', 'bottom');
            bottom.append('input').attr('type', 'button').attr('class', 'cancel').on('click', btnClose).property('value', '确定');
        }

        function btnClose() {
            modal.close();
            if (callback) {
                callback();
            }
        }
    };

    meshBoundryTip.vertexs = function (_) {
        if (!arguments.length) return vertexs;
        vertexs = _;
        return meshBoundryTip;
    };


    return d3.rebind(meshBoundryTip, event, 'on');
}