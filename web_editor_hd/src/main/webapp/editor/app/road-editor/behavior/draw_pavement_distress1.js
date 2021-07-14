/*
 * @Author: tao.w
 * @Date: 2019-11-01 16:23:28
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-24 10:29:28
 * @Description: 
 */

iD.behavior.DrawPavementDistress1 = function (context, wayId, index, mode, baseGraph, type) {
    var way = context.entity(wayId),
        finished = false,
        constant = iD.data.DataType,
        annotation = t((way.isDegenerate() ?
            'operations.start.annotation.' :
            'operations.continue.annotation.') + context.geometry(wayId)),
        draw = iD.behavior.Draw(context);
    let opgNodeLayer = iD.Layers.getCurrentModelEnableLayer(constant.PAVEMENT_DISTRESS_PL_NODE);
    var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
        start = iD.Node({
            loc: context.graph().entity(way.nodes[startIndex]).loc,
            modelName: iD.data.DataType.PAVEMENT_DISTRESS_PL_PL_NODE,
            identifier: opgNodeLayer.identifier,
            layerId: opgNodeLayer.id
        }),
        end = iD.Node({
            loc: context.map().mouseCoordinates(),
            modelName: iD.data.DataType.PAVEMENT_DISTRESS_PL_PL_NODE,
            identifier: opgNodeLayer.identifier,
            layerId: opgNodeLayer.id
        }),

        segment = iD.Way({
            identifier: opgNodeLayer.identifier,
            nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            modelName: iD.data.DataType.PAVEMENT_DISTRESS_PL,
            layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PAVEMENT_DISTRESS_PL).id,
            tags: _.clone(way.tags)
        });

    var f = context[way.isDegenerate() ? 'replace' : 'perform'];
    f(iD.actions.AddEntity(start),
        iD.actions.AddEntity(end),
        iD.actions.AddEntity(segment));

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
        context.buriedStatistics().merge(0, iD.data.DataType.PAVEMENT_DISTRESS_PL);
    }

    function setActiveElements() {
        var active = [segment.id, start.id, end.id];
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
            updateDate();
        context.history()
            .on('undone.draw', null);
    };

    function ReplaceTemporaryNode(newNode) {
        return function (graph) {

            // graph = graph
            //     .replace(way.addNode(newNode.id, index))
            //     .remove(end);
            // return graph;

            var graph = graph
                .replace(graph.entity(wayId).addNode(newNode.id, index))
                .remove(end)
                .remove(segment)
                .remove(start);

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

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE);
        var newNode = iD.Node({
            loc: loc,
            layerId: wayLayer.id,
            identifier: wayLayer.identifier,
            modelName: iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE
        });
        newNode.setTags(iD.util.getDefauteTags(newNode, wayLayer));

        context.replace(
            iD.actions.AddEntity(newNode),
            ReplaceTemporaryNode(newNode),
            iD.actions.PavementDistreesMeasureinfo(newNode.id),
            annotation);

		let _w = context.entity(wayId);
		iD.logger.editElement({
			'tag': 'add_' + iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE,
			'entityId': newNode.osmId() || '',
			'parentId': _w.osmId() || '',
			'coordinate': newNode.loc || [],
			'modelName': newNode.modelName,
			'filter': iD.logger.getFilter(_w, context)
		});
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
    function updateDate() {
        // let buff = 3;
        // let _subType = '1';
        // if (type == 2) {
        //     buff = 6;
        //     _subType = '3'
        // }
        let actions = [];
        let way = context.hasEntity(wayId);
        if (!way) return;
        // let nodes = context.childNodes(way);
        // let _layer = iD.Layers.getLayer(way.layerId);
        // let layerId = nodes[0].layerId;
        // let nodeLocs = _.pluck(nodes, 'loc');
        // let maxIdx = nodeLocs.length;
        // var point = turf.lineString(nodeLocs);
        // let buffered = turf.buffer(point, buff, { units: 'millimeters' });
        // let len = turf.length(point, { units: 'meters' });
        // let _area = len * 0.2; //业务面积，很奇怪的规定
        // let newLocs = buffered.geometry.coordinates[0];

        // if (newLocs.length < nodes.length) {
        //     console.error('计算错误需要查看');
        // }
        // let z = nodeLocs[0][2];
        // newLocs.pop();
        // newLocs.forEach((d, i) => {
        //     let dist = iD.util.pt2LineDist2(nodeLocs, d);
        //     z = nodeLocs[dist.i][2];
        //     d.push(z);
        //     let loc = d;
        //     let n;
        //     if (i < maxIdx) {
        //         n = nodes[i];
        //         actions.push(iD.actions.MoveNode(n.id, loc), iD.actions.PavementDistreesMeasureinfo(n.id));
        //     } else {
        //         n = iD.Node({
        //             layerId: layerId,
        //             identifier: _layer.identifier,
        //             loc,
        //             modelName: iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE
        //         });
        //         n.setTags(iD.util.getDefauteTags(n, iD.Layers.getLayer(layerId)));
        //         actions.push(iD.actions.AddEntity(n));
        //         actions.push(iD.actions.AddVertex(way.id, n.id, i),
        //             iD.actions.PavementDistreesMeasureinfo(n.id)
        //         );
        //     }

        // })

        // actions.push(iD.actions.AddVertex(way.id, nodes[0].id));
        // actions.push(iD.actions.ChangeTags(way.id, {
        //     AREA: _area,
        //     SUBTYPE: _subType,
        //     LENGTH: len
        // }));
        actions.push(iD.actions.UpdatePavement_distress(way));
        actions.push('end');
        context.replace.apply(this, actions);
      
    }

    // Finish the draw operation, removing the temporary node. If the way has enough
    // nodes to be valid, it's selected. Otherwise, return to browse mode.
    drawWay.finish = function (isJump) {
        if (!isJump) {
            context.pop();
        }
        finished = true;

        updateDate();
        
        context.buriedStatistics().merge(0, iD.data.DataType.PAVEMENT_DISTRESS_PL);
        window.setTimeout(function () {
            context.map().dblclickEnable(true);
        }, 1000);

        let _way = context.hasEntity(wayId);
        if (_way) {
            context.event.entityedite({
                entitys: [wayId]
            })
            context.enter(
                iD.modes.Select(context, [wayId])
                    .suppressMenu(true)
                    .newFeature(true));
			
			iD.logger.editElement({
				'tag': 'add_' + iD.data.DataType.PAVEMENT_DISTRESS_PL + '_end',
				'entityId': _way.osmId() || '',
				'modelName': _way.modelName,
				'type': "dblClick",
				'filter': iD.logger.getFilter(_way, context)
			});
        } else {
            context.enter(iD.modes.Browse(context));
        }
    };

    // Cancel the draw operation and return to browse, deleting everything drawn.
    drawWay.cancel = function () {
        context.perform(
            d3.functor(baseGraph),
            t('operations.cancel_draw.annotation'));
			
        context.buriedStatistics().merge(0, iD.data.DataType.PAVEMENT_DISTRESS_PL);
		
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
