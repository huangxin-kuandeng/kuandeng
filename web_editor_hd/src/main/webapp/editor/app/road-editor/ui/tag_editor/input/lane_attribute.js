/**
 * Created by wangtao on 2017/8/22.
 */
iD.ui.TagEditorInput.laneAttribute = function(context) {
    var event = d3.dispatch('change'),
        vertexID,
        fromNodeID,
        relationID,
        selectWayID;
    var state = 'select';
    var rawTagEditor = iD.ui.RawTagEditor(context)
        .on('change', changeTags);

    function changeTags(changed) {
        var entity = context.entity(relationID);
        tags =_.extend({}, entity.tags, changed);
        // var chnName = getChnName(changed, entity,primaryKey);
        var msg = "更改"+Object.keys(changed).toString()// + chnName;



        //针对 changed 对象跟原值比较，可以单独对change进行相关处理，去掉undifined和自定义tags以外的name属性，防止破坏原有数据结构
        _.forEach(changed,function(value,name,obj){if( _.isUndefined(value) || _.isUndefined(entity.tags[name])){delete obj[name]}});
        if(_.isEmpty(changed)){
            return ;
        }

        var actions_array = [];


        actions_array.push(iD.actions.ChangeTags(relationID, tags));

        actions_array.push(msg);
        //context.perform.apply(this,actions_array);
        // context.perform(iD.actions.Noop(),msg);
        context.replace.apply(this,actions_array);


    }
    function waysFilter(highways,vertexID){
        var ways = [];
        if(!vertexID){
            return ways;
        }
        for(var i=0,len=highways.length;i<len;i++){
            if(highways[i].modelName != iD.data.DataType.DIVIDER){
                continue;
            }
            if(highways[i].first() == vertexID ||
                (highways[i].nodes.includes(vertexID) && highways[i].last() != vertexID)){
                ways.push(highways[i]);
            }
        }
        return ways;
    }

    function restrictions(selection) {
        var wrap = selection.selectAll('.preset-input-wrap')
            .data([0]);

        var enter = wrap.enter().append('div')
            .attr('class', 'preset-input-wrap');

        enter.append('div')
            .attr('class', 'restriction-help');

        enter.append('svg')
            .call(iD.svg.Surface(context))
            .call(iD.behavior.Hover(context));

        var graph = context.graph(),
            vertex = graph.entity(vertexID),
            highways = graph.parentWays(vertex);
        surface = wrap.selectAll('svg'),
            filter = function () { return true; },
            extent = iD.geo.Extent(),
            projection = iD.geo.RawMercator(),
            lines = iD.svg.Lines(projection, context),
            vertices = iD.svg.Vertices(projection, context),
            ways = waysFilter(highways,vertexID);
        // turns = iD.svg.Turns(projection, context);
        var d = wrap.dimensions(),
            c = [d[0] / 2, d[1] / 2],
            z = 21;

        projection
            .scale(256 * Math.pow(2, z) / (2 * Math.PI));

        var s = projection(vertex.loc);

        projection
            .translate([c[0] - s[0], c[1] - s[1]])
            .clipExtent([[0, 0], d]);

        surface
            .call(vertices, graph, [vertex], filter, extent, z)
            .call(lines, graph, ways, filter)

        surface
            .on('click.restrictions', click)
            .on('mouseover.restrictions', mouseover)
            .on('mouseout.restrictions', mouseout);

        surface
            .selectAll('.selected')
            .classed('selected', false);

        if (fromNodeID) {
            surface
                .selectAll('.' + _.find(ways, function(way) { return way.contains(fromNodeID); }).id)
                .classed('selected', true);
        }
        if(!relationID){
            let wrap = selection.selectAll('.preset-input-relation');
            wrap.remove();
        }
        mouseout();

        context.history()
            .on('change.restrictions', render);

        d3.select(window)
            .on('resize.restrictions', render);

        function click() {
            var datum = d3.event.target.__data__;

            if(datum instanceof iD.Way){
                selectWayID = datum.id;
                fromNodeID = datum.nodes[(datum.first() === vertexID) ? 1 : datum.nodes.length - 2];
                render();
                renderTag();
            }
        }

        function createNewDividerAttribute(wayId, nodeId) {
            var dividerAttributeMember = [
                {
                    'id': wayId,
                    'modelName':iD.data.DataType.DIVIDER,
                    'role': iD.data.RoleType.DIVIDER_ID,
                    'type':iD.data.GeomType.WAY
                }, {
                    'id': nodeId,
                    'modelName':iD.data.DataType.DIVIDER_NODE,
                    'role': iD.data.RoleType.DIVIDER_NODE_ID,
                    'type':iD.data.GeomType.NODE
                }];
			
			var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_ATTRIBUTE);
            var dividerAttributeRelations = iD.Relation({
                modelName:iD.data.DataType.LANE_ATTRIBUTE,
                members: dividerAttributeMember,
                identifier:currentLayer.identifier,
                layerId: currentLayer.id
            });
            dividerAttributeRelations.setTags(iD.util.getDefauteTags(dividerAttributeRelations, currentLayer));
            // var graph = context.graph().replace(dividerAttributeRelations);
            context.perform(
                iD.actions.AddEntity(dividerAttributeRelations),
                '新增关系');
            return dividerAttributeRelations;
        };

        function getRelation(){
            var relation = null;
            var vertex = graph.entity(vertexID);
            var relations = context.graph().parentRelations(vertex,iD.data.DataType.DIVIDER_ATTRIBUTE);
            var wayMember,nodeMember,_tempRealtion;

            for(var i = 0,len = relations.length;i<len;i++){
                _tempRealtion = relations[i];
                wayMember = _tempRealtion.memberByIdAndRole(vertexID,iD.data.RoleType.DIVIDER_NODE_ID);
                nodeMember = _tempRealtion.memberByIdAndRole(selectWayID,iD.data.RoleType.DIVIDER_ID);
                if(wayMember && nodeMember){
                    relation = _tempRealtion;
                    break;
                }
            }
            if(!relation){
                relation = createNewDividerAttribute(selectWayID,vertexID);
            }

            return relation;
        }

        function renderTag(){
            var wrap = selection.selectAll('.preset-input-relation')
                .data([0]);
            if(!selectWayID || !vertexID){
                wrap.remove();
                return ;
            }


            var enter = wrap.enter().append('div')
                .attr('class', 'preset-input-relation');

            enter.append('div')
                .attr('class', 'relation-tag-editor');
            var relation  = getRelation();
            relationID = '';
            if(!relation){
                return ;
            }
            relationID = relation.id;
            let tags =  _.extend({}, relation.tags);
            wrap.select('.relation-tag-editor')
                .call(rawTagEditor.entityID(relation.id)
                    .tags(tags)
                    .state(state));
        }

        function mouseover() {
            var datum = d3.event.target.__data__;
            if (datum instanceof iD.geo.Turn) {
                var graph = context.graph(),
                    presets = context.presets(),
                    preset;

                if (datum.restriction) {
                    preset = presets.match(graph.entity(datum.restriction), graph);
                } else {
                    preset = presets.item('type/restriction/' +
                        iD.geo.inferRestriction(
                            graph.entity(datum.from.node),
                            graph.entity(datum.via.node),
                            graph.entity(datum.to.node),
                            projection));
                }

                wrap.selectAll('.restriction-help')
                    .text(t('operations.restriction.help.' +
                        (datum.restriction ? 'toggle_off' : 'toggle_on'),
                        {restriction: preset.name()}));
            }
        }

        function mouseout() {
            wrap.selectAll('.restriction-help')
                .text(t('operations.restriction.help.' +
                    (fromNodeID ? 'toggle' : 'select')));
        }

        function render() {
            if (context.hasEntity(vertexID)) {
                restrictions(selection);
            }
        }
    }

    laneAttribute.entity = function(_) {
        if (!vertexID || vertexID !== _.id) {
            fromNodeID = null;
            selectWayID = null;
            relationID = null;
            vertexID = _.id;
        }
    };

    laneAttribute.tags = function() {};
    laneAttribute.focus = function() {};
    laneAttribute.change = function() {};

    return d3.rebind(laneAttribute, event, 'on');
};
