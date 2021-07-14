/*
 * @Author: tao.w
 * @Date: 2019-11-01 16:28:02
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-28 11:14:19
 * @Description: 
 */
/**
 * Created by wt.
 */
iD.behavior.DrawRectPG = function (context, wayId, index, mode, baseGraph) {
    var way = context.entity(wayId),
        finished = false,
        annotation = t((way.isDegenerate() ?
            'operations.start.annotation.' :
            'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context);
    let nLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({
            loc: context.graph().entity(way.nodes[startIndex]).loc,
            modelName: iD.data.DataType.OBJECT_PG_NODE,
            identifier: nLayer.identifier,
            layerId: nLayer.id
        }),
        end = iD.Node({
            loc: context.map().mouseCoordinates(),
            identifier: nLayer.identifier,
            modelName: iD.data.DataType.OBJECT_PG_NODE,
            layerId: nLayer.id
        }),

        segment = iD.Way({
            identifier: nLayer.identifier,
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            modelName: iD.data.DataType.OBJECT_PG,
            layerId: nLayer.id,
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
        context.buriedStatistics().merge(0, iD.data.DataType.OBJECT_PG);
        finished = true;
        context.enter(iD.modes.Browse(context));
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
        }

        // var wayLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE).id;
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG_NODE);
        var newNode = iD.Node({
            loc: loc,
            identifier: wayLayer.identifier,
            layerId: wayLayer.id,
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
    };

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function (isPop = true) {
        // if (isPop) {
        context.pop();
        // }

        let way = context.hasEntity(wayId);
        let nodes = context.childNodes(way);
        let pixes = _.pluck(nodes, 'loc').map(d => {
            return [...context.projection(d), d[2]];
        })

        let err = false;
        var locs = iD.util.getRotaingCalipersRectLocs(pixes).map(function (d) {
            let loc = context.projection.invert([d.x, d.y]);
            let z = iD.util.getPlyZ(context, loc);

            if (z != null) {
                loc.push(z);
            } else {
                err = true;
            }

            return loc;
        });
        if (err) {
            context.replace(
                iD.actions.DeleteMultiple([wayId], context),
                annotation);
            Dialog.alert("当前位置，无法获取高程值！");
            context.enter(iD.modes.Browse(context))
            return;
        }
        // context.replace(
        //     iD.actions.DeleteMultiple([nodes[1].id], context),
        //     annotation);

        way = context.hasEntity(wayId)
        // let actions = [];

        locs.forEach((d, i) => {
            // actions.push(iD.actions.MoveNode(way.nodes[i], d));
            context.replace(
                iD.actions.MoveNode(way.nodes[i], d),
                annotation);
        })

        // iD.util.context.replace(iD.actions.MoveNode(end.id, loc));

        finished = true;

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