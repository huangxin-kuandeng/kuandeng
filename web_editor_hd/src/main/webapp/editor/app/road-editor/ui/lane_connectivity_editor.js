iD.ui.LaneConnectivityEditor = function(context) {

    var event = d3.dispatch('apply'),
        transportation,
        nodeId,
        fromWayId,
        toWayId,
        modal,
        entityEditor = iD.ui.EntityEditor(context),
        rawTagEditor = iD.ui.RawTagEditor(context);
    var connectModelName = iD.data.DataType.HD_LANE_CONNECTIVITY;
    var nodeModelName = iD.data.DataType.HD_LANE_NODE;
    var wayModelName = iD.data.DataType.HD_LANE;
    // var connectModelName = iD.data.DataType.HD_LANE_CONNECTIVITY;
    // var nodeModelName = iD.data.DataType.DIVIDER_NODE;
    // var wayModelName = iD.data.DataType.DIVIDER;

    function laneEditor(selection) {
        var relationInfo = laneEditor.getConnectivity();

        modal = iD.ui.modal(selection);

        modal.select('.modal')
            .classed('modal-alert common-dialog', true)
            .on('close', _modalClose)
            .on('autoclose', _modalClose);
        
        //隐藏掉右上角的关闭按钮
        //modal.select('button.close').style('display', 'none');

        var section = modal.select('.KDSEditor-content');

        var restriction = section.append('div')
            .attr('class', 'traffic-area');

        restriction.append('div')
            .attr('class', 'title model_title')
            .html('道路连接关系');


        var wrap = restriction.append('div')
            .attr('class', 'body')
            .style('padding', '0px 5px 5px 5px');

        //绘制规则列表
        drawRestrictionList();
        /**
         * 输出限行规则
         * @return void
         */
        function drawRestrictionList() {
            modal.classed('restriction_detail', false);

            var items = wrap.html('');

            // modal.select('div.model_title')
            //     .html('车道连接关系');

            // raw_tag_editor
            var $fieldWrapper = wrap
                .append('div')
                .attr('class', 'tagmark_fields_wrapper');
            var $tagEditorWrapper = $fieldWrapper
                .append('div')
                .attr('class', 'KDSEditor-inspector-border raw-taglist-editor KDSEditor-inspector-inner');
            
            relationInfo && refreshTagEditor($tagEditorWrapper, relationInfo.id);

            //bottom
            var bottom = items.append('div')
                .attr('class', 'bottom')
                .classed('hide', relationInfo != null);

            var createBtn = bottom.append('button')
                .attr('class', 'btn-create button blue')
                .html('添加连接关系')
                .on('click', function(){
                    btnAddNewConnectivity()
                    bottom.classed('hide', true);
                    relationInfo = laneEditor.getConnectivity();
                    drawRestrictionList();
                    context.map().redraw();
                });
        }
    };

    function _modalClose(){
        rawTagEditor.on('change.lane_editor', null);
    }

    function refreshTagEditor($wrap, entityid){
        $wrap.selectAll('*').remove();
        $wrap
            .call(rawTagEditor
            // .modelName(tagModelName)
            // .clearHtml(true)
            .entityID(entityid)
            .tags(context.entity(entityid).tags)
            .state('select'));
        
        // actions.ChangeTags
        rawTagEditor.on('change.lane_editor', function(tags){
            entityEditor.entityID(entityid).changeTags(tags);
        });
    }
    

    function btnAddNewConnectivity() {
        let layer = iD.Layers.getCurrentModelEnableLayer(connectModelName);

        let members = [{
            id: fromWayId,
            role: iD.data.RoleType.FLANE_ID,
            type: iD.data.GeomType.WAY,
            modelName: wayModelName
        }, {
            id: nodeId,
            role: iD.data.RoleType.LANENODE_ID,
            type: iD.data.GeomType.NODE,
            modelName: nodeModelName
        }, {
            id: toWayId,
            role: iD.data.RoleType.TLANE_ID,
            type: iD.data.GeomType.WAY,
            modelName: wayModelName
        }];
        var relation = iD.Relation({
            layerId: layer.id,
            modelName: connectModelName,
            identifier:layer.identifier,
            members: members,
            tags: iD.util.getDefauteTags(connectModelName, layer)
        });

        context.perform(iD.actions.AddEntity(relation), '创建道路连接关系');

        return relation;
    }

    //选择的节点
    laneEditor.nodeId = function(_) {
        if (!arguments.length) return nodeId;
        nodeId = _;
        return laneEditor;
    };
    //选择的道路
    laneEditor.fromWayId = function(_) {
        if (!arguments.length) return fromWayId;
        fromWayId = _;
        return laneEditor;
    };
    //需要去的路
    laneEditor.toWayId = function(_) {
        if (!arguments.length) return toWayId;
        toWayId = _;
        return laneEditor;
    };

    laneEditor.transportation = function(_) {
        if (!arguments.length) {
            return transportation;
        }

        transportation = _;

        laneEditor.fromWayId(transportation.fromwayId)
            .nodeId(transportation.nodeId)
            .toWayId(transportation.towayId);

        return laneEditor;
    };

    laneEditor.getConnectivity = function() {
        // fromwayId, nodeId, towayId
        let rels = context.graph()
            .parentRelations(context.entity(fromWayId), iD.data.DataType.HD_LANE_CONNECTIVITY)
            .filter(function(r) {
                let ids = _.pluck(r.members, 'id');
                let from = _.find(r.members, {role: iD.data.RoleType.FLANE_ID});
                let to = _.find(r.members, {role: iD.data.RoleType.TLANE_ID});
                if(!from || !to) return false;
                return ids.includes(fromWayId) && from.id == fromWayId
                    && ids.includes(nodeId)
                    && ids.includes(toWayId) && to.id == toWayId;
            });

        return rels && rels[0];
    };

    return d3.rebind(laneEditor, event, 'on');

};

iD.ui.RoadRule = {};