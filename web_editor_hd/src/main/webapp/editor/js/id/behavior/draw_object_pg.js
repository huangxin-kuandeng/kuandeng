/*
 * @Author: tao.w
 * @Date: 2019-11-01 16:28:02
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:12:57
 * @Description: 
 */
/**
 * Created by wt.
 */
iD.behavior.DrawObjectPG = function (context, wayId, index, mode, baseGraph) {
    var way = context.entity(wayId),
        finished = false,
        constant = iD.data.DataType,
        annotation = t((way.isDegenerate() ?
            'operations.start.annotation.' :
            'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context);
    let opgNodeLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({
            loc: context.graph().entity(way.nodes[startIndex]).loc,
            modelName: iD.data.DataType.OBJECT_PG_NODE,
            identifier: opgNodeLayer.identifier,
            layerId: opgNodeLayer.id
        }),
        end = iD.Node({
            loc: context.map().mouseCoordinates(),
            modelName: iD.data.DataType.OBJECT_PG_NODE,
            identifier: opgNodeLayer.identifier,
            layerId: opgNodeLayer.id
        }),

        segment = iD.Way({
            identifier: opgNodeLayer.identifier,
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            modelName: iD.data.DataType.OBJECT_PG,
            layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG).id,
            tags: _.clone(way.tags)
        });

    var f = context[way.isDegenerate() ? 'replace' : 'perform'];
    f(iD.actions.AddEntity(end),
        iD.actions.AddVertex(wayId, end.id, index));

    function move(datum) {
        var loc;

        if (datum.type === 'node' && datum.id !== end.id) {
            loc = datum.loc;
        } else if (datum.type === 'way' && datum.id !== segment.id) {
            loc = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection, datum).loc;
        } else {
            loc = context.map().mouseCoordinates();
        }

        context.replace(iD.actions.MoveNode(end.id, loc));
    }

    function undone() {
        finished = true;
        context.enter(iD.modes.Browse(context));
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PG);
    }

    function setActiveElements() {
        var active = [wayId, end.id];
        context.surface().selectAll(iD.util.entitySelector(active))
            .classed('active', true);
    }

    var drawWay = function (surface) {
        draw.on('move', move)
            .on('click', drawWay.add)
            .on('clickWay', drawWay.addWay)
            .on('clickNode', drawWay.addNode)
            .on('undo', context.undo)
            .on('cancel', drawWay.cancel)
            .on('finish', drawWay.finish);

        context.map()
            .dblclickEnable(false)
            .on('drawn.draw', setActiveElements);

        setActiveElements();

        surface.call(draw);

        context.history()
            .on('undone.draw', undone);
    };

    drawWay.off = function (surface) {
        if (!finished)
            context.pop();

        context.map()
            .on('drawn.draw', null);

        surface.call(draw.off)
            .selectAll('.active')
            .classed('active', false);

        context.history()
            .on('undone.draw', null);
    };

    function ReplaceTemporaryNode(newNode) {
        return function (graph) {

            graph = graph
                .replace(way.addNode(newNode.id, index))
                .remove(end);
            return graph;


        };
    }

    // Accept the current position of the temporary node and continue drawing.
    drawWay.add = function (loc) {
        let xyz = iD.util.getPlyZ(context, loc);

        if (xyz != null) {
            loc[2] = xyz;
        } else {
            Dialog.alert("当前位置，无法获取高程值！");
            this.finish();
            return;
        }

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
        var newNode = iD.Node({
            loc: loc,
            layerId: wayLayer.id,
            identifier: wayLayer.identifier,
            modelName: iD.data.DataType.OBJECT_PG_NODE
        });

        newNode.setTags(iD.util.getDefauteTags(newNode, wayLayer));

        context.replace(
            iD.actions.AddEntity(newNode),
            ReplaceTemporaryNode(newNode),
            annotation);

        finished = true;
        context.enter(mode);
    };

    // Connect the way to an existing way.
    drawWay.addWay = function (loc, edge, clickWay) {
        drawWay.add(loc);
    };

    // Connect the way to an existing node and continue drawing.
    drawWay.addNode = function (node) {
        drawWay.add(node.loc);
        return;
        if (way.areAdjacent(node.id, way.nodes[way.nodes.length - 1])) return;

        context.perform(
            ReplaceTemporaryNode(node),
            annotation);

        finished = true;
        context.enter(mode);
    };

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function () {
        context.pop();
        finished = true;
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PG);
        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);

        if (context.hasEntity(wayId)) {
            context.enter(
                iD.modes.Select(context, [wayId])
                    .suppressMenu(true)
                    .newFeature(true));
        } else {
            context.enter(iD.modes.Browse(context));
        }
    };

    // Cancel the draw operation and return to browse, deleting everything drawn.
    drawWay.cancel = function () {
        context.perform(
            d3.functor(baseGraph),
            t('operations.cancel_draw.annotation'));
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PG);
        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);

        finished = true;
        context.enter(iD.modes.Browse(context));
    };

    drawWay.tail = function (text) {
        draw.tail(text);
        return drawWay;
    };

    return drawWay;
};