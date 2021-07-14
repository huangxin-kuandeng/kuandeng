/**
 * NODECONN（点击共用点会在左侧面板显示）
 * Created by wangtao on 2017/8/28.
 */
iD.ui.TagEditorInput.maat = function(context) {
    var event = d3.dispatch('change'),
        vertexID,
        fromNodeID ;
    var state = 'select';
    var rawTagEditor = iD.ui.RawTagEditor(context)
        .on('change', changeTags);

    function changeTags(changed) {
        var entity = context.entity(relationID);
        tags =_.extend({}, entity.tags, changed);
        // var chnName = getChnName(changed, entity,primaryKey);
        var msg = "更改"+Object.keys(changed).toString()// + chnName;



        //针对 changed 对象跟原值比较，可以单独对change进行相关处理，去掉undifined和自定义tags以外的name属性，防止破坏原有数据结构
        // _.forEach(changed,function(value,name,obj){if( _.isUndefined(value) || _.isUndefined(entity.tags[name])){delete obj[name]}});
        if(_.isEmpty(changed)){
            return ;
        }

        var actions_array = [];


        actions_array.push(iD.actions.ChangeTags(relationID, tags));

        actions_array.push(msg);
        context.perform.apply(this,actions_array);
        // context.perform(iD.actions.Noop(),msg);
        // context.replace.apply(this,actions_array);


    }

    function waysFilter(highways,vertexID){
        var ways = [];
        if(!vertexID){
            return ways;
        }
        for(var i=0,len=highways.length;i<len;i++){
            if(highways[i].modelName != iD.data.DataType.ROAD){
                continue;
            }
            if(highways[i].first() == vertexID || highways[i].last() == vertexID){
                ways.push(highways[i]);
            }
        }
        // return highways;
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

        var intersection = iD.geo.maatIntersection(context.graph(), vertexID),
            graph = intersection.graph,
            vertex = graph.entity(vertexID),
            highways = graph.parentWays(vertex);
            surface = wrap.selectAll('svg'),
            filter = function () { return true; },
            extent = iD.geo.Extent(),
            projection = iD.geo.RawMercator(),
            lines = iD.svg.Lines(projection, context),
            vertices = iD.svg.Vertices(projection, context),
            ways = waysFilter(highways,vertexID);
            maat = iD.svg.Maat(projection, context);
        // if(ways.length<2){
        //     selection.remove()
        // }
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
            .call(maat, graph, intersection.turns(fromNodeID));

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

        mouseout();

        context.history()
            .on('change.restrictions', render);

        d3.select(window)
            .on('resize.restrictions', render);

        function click() {
            var datum = d3.event.target.__data__;
            if (datum instanceof iD.Way) {
                fromNodeID = datum.nodes[(datum.first() === vertexID) ? 1 : datum.nodes.length - 2];
                render();
                selection.selectAll('.preset-input-relation').remove();
            } else if (datum instanceof iD.geo.Maat) {
                var id;
                if (datum.restriction) {
                    id = datum.restriction;
                    // context.perform(
                    //     iD.actions.UnrestrictTurn(datum, projection),
                    //     t('operations.restriction.annotation.delete'));
                } else {
                    id = createNewDividerAttribute(datum).id;
                    // context.perform(
                    //     iD.actions.RestrictTurn(datum, projection),
                    //     t('operations.restriction.annotation.create'));
                }
                renderTag(id);
            }
        }
        function renderTag(id){
            var wrap = selection.selectAll('.preset-input-relation')
                .data([0]);
            if(!id || !vertexID){
                wrap.remove();
                return ;
            }


            var enter = wrap.enter().append('div')
                .attr('class', 'preset-input-relation');

            enter.append('div')
                .attr('class', 'relation-tag-editor');
            var relation  = context.graph().entity(id);
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
            if (datum instanceof iD.geo.Maat) {
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

    restrictions.entity = function(_) {
        if (!vertexID || vertexID !== _.id) {
            fromNodeID = null;
            vertexID = _.id;
        }
    };
    restrictions.available = function(entity) {
        return entity.modelName = iD.data.DataType.ROAD_NODE;
    }
    restrictions.tags = function() {};
    restrictions.focus = function() {};
    function createNewDividerAttribute(datum) {
        var dividerAttributeMember = [
            {
                'id': datum.from.way,
                'modelName':iD.data.DataType.ROAD,
                'role': iD.data.RoleType.FROAD_ID,
                'type':iD.data.GeomType.WAY
            }, {
                'id': datum.via.node,
                'modelName':iD.data.DataType.ROAD_NODE,
                'role': iD.data.RoleType.ROAD_NODE_ID,
                'type':iD.data.GeomType.NODE
            }, {
                'id': datum.to.way,
                'modelName':iD.data.DataType.ROAD,
                'role': iD.data.RoleType.TROAD_ID,
                'type':iD.data.GeomType.WAY
            }];
		var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.NODECONN);
        var dividerAttributeRelations = iD.Relation({
            modelName:iD.data.DataType.NODECONN,
            identifier:currentLayer.identifier,
            members: dividerAttributeMember,
            layerId: currentLayer.id
        });
        dividerAttributeRelations.setTags(iD.util.getDefauteTags(dividerAttributeRelations, currentLayer));
        // var graph = context.graph().replace(dividerAttributeRelations);
        context.perform(
            iD.actions.AddEntity(dividerAttributeRelations),
            '新增关系');
        return dividerAttributeRelations;
    }
    return d3.rebind(restrictions, event, 'on');
};
