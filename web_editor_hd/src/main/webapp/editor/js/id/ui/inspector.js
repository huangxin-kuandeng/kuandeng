iD.ui.Inspector = function(context) {
    var entityEditor = iD.ui.EntityEditor(context),
        state = 'select',
        entityID,
        newFeature = false;

    function inspector(selection) {


        var entity = context.entity(entityID);

        //设置属性面板是否可用样式
        selection.classed('KDSEditor-inspector-disabled',true);
        // selection.classed('KDSEditor-inspector-disabled',!entity.layerInfo().enable);

        entityEditor
            .state(state)
            .entityID(entityID);

        var $wrap = selection.selectAll('.KDSEditor-panewrap')
            .data([0]);

        var $enter = $wrap.enter().append('div')
            .attr('class', 'KDSEditor-panewrap');

        $enter.append('div')
            .attr('class', 'entity-editor-pane KDSEditor-pane');

        $wrap.select('.entity-editor-pane')
            .call(entityEditor);
    }

    inspector.state = function(_) {
        if (!arguments.length) return state;
        state = _;
        entityEditor.state(state);
        return inspector;
    };

    inspector.entityID = function(_) {
        if (!arguments.length) return entityID;
        entityID = _;
        return inspector;
    };

    inspector.newFeature = function(_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return inspector;
    };

    return inspector;
};
