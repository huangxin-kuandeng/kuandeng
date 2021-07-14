iD.ui.modal = function (selection, blocking, nodeID, context) {

    var previous = selection.select('div.modal');
    var animate = previous.empty();
    var event = d3.dispatch('clickclose', 'click','close', 'autoclose');

    previous.transition()
        .duration(200)
        .style('opacity', 0)
        .remove();

    var shaded = selection
        .append('div')
        .attr('class', 'shaded')
        .style('opacity', 0);


    function hasTagDesc() {
        var role = iD.User.getRole().role;
        var delDiv = document.getElementById('qcBoxDiv');
        if (role == 'check' && delDiv != null) {
            var node = context.graph().entity(nodeID);
            var desc = node.tags.tag_desc;
            var tag_desc_info = desc.replace(/(^\s*)|(\s*$)/g, "");
            if (tag_desc_info == 'undefined' || tag_desc_info == '' || !tag_desc_info) {
                context.perform(iD.actions.DeleteNode(nodeID));

            }
        }
    }

    function canClose() {
        var div = document.getElementById('adasPw');
        if (div != null) {
            return false;
        }
        return true;
    }

    shaded.clickclose = function () {
        if (!canClose) {
            //处理品控标描述为null的情况
            hasTagDesc();
            event.close();
            shaded
                .transition()
                .duration(200)
                .style('opacity', 0)
                .remove();
            modal
                .transition()
                .duration(200)
                .style('top', '0px');
            keybinding.off();
        }
    };

    shaded.close = function () {
        //处理品控标描述为null的情况
        hasTagDesc();
        event.close();
        shaded
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
        modal
            .transition()
            .duration(200)
            .style('top', '0px');
        keybinding.off();
        // console.warn('hide shaded');
    };
    shaded._close = function(){
        event.autoclose();
        shaded.close();
    }

    var keybinding = d3.keybinding('modal')
        .on('⌫', shaded._close)
        .on('⎋', shaded._close);

    d3.select(document).call(keybinding);

    var modal = shaded.append('div')
        .attr('class', 'modal KDSEditor-fillL KDSEditor-col6');

    shaded.on('click.remove-modal', function () {
        if (d3.event.target === this && !blocking) shaded.clickclose();
    });
    // console.warn('show shaded');
    modal.append('button')
        .attr('class', 'close')
        .on('click', function () {
            if (!blocking) shaded._close();
        })
        .append('div')
        .attr('class', 'KDSEditor-icon close');

    modal.append('div')
        .attr('class', 'KDSEditor-content');

    if (animate) {
        shaded.transition().style('opacity', 1);
        modal
            .style('top', '0px')
            .transition()
            .duration(200)
            .style('top', '40px');
    } else {
        shaded.style('opacity', 1);
    }


    return d3.rebind(shaded, event, 'on');
};
