/*
 * @Author: tao.w
 * @Date: 2020-02-05 18:21:43
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-26 17:05:00
 * @Description: 
 */

iD.modes.EditorBezier = function (context, node1, node2, cp1, way) {

    var mode = {
        button: 'bezier_editor',
        id: 'bezier_editor',
    };
    var cancelled, nudgeInterval;

    var lastMousePos,
        lastMouseTarget,
        clickTimeId;

    var keybinding = d3.keybinding('bezierEditor');
    var dragbehavior = iD.behavior.drag()
        .delegate('g.node, g.point, g.midpoint')
        .surface(context.surface().node())
        .origin(origin)
        .on('start', start)
        .on('move', move)
        .on('end', end);

    var behaviors = [
        iD.behavior.Hover(context),
        dragbehavior
    ];

    function d3_eventCancel() {
        dragbehaviors.node(null);
        d3.event.stopPropagation();
        d3.event.preventDefault();
    }

    // via https://gist.github.com/shawnbot/4166283
    function childOf(p, c) {
        if (p === c) return false;
        while (c && c !== p) c = c.parentNode;
        return c === p;
    }

    function stopNudge() {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = null;
    }

    function edge(point, size) {
        var pad = [30, 100, 30, 100];
        if (point[0] > size[0] - pad[0]) return [-10, 0];
        else if (point[0] < pad[2]) return [10, 0];
        else if (point[1] > size[1] - pad[1]) return [0, -10];
        else if (point[1] < pad[3]) return [0, 10];
        return null;
    }

    function startNudge(nudge) {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = window.setInterval(function () {
            context.pan(nudge);
        }, 50);
    }


    function origin(entity) {
        return context.projection(entity.loc);
    }

    function datum() {
        var d = d3.event.sourceEvent.target.__data__;
        if (!d) { return {} };
        var modelConfig = iD.Layers.getLayer(d.layerId, d.modelName);
        if (modelConfig && modelConfig.editable) {
            return d;
        } else {
            return {};
        }
    }


    mode.enter = function () {
        enter();
    };

    function start(entity) {
        cancelled = d3.event.sourceEvent.shiftKey;
        if (cancelled) {
            dragWayBehavior && dragWayBehavior.cancel();
            return behavior.cancel();
        }
        startloc = entity.loc;
        if (entity.id != cp1.id) {
            cancelled = true;
            context.perform(
                iD.actions.Noop());
            context.enter(iD.modes.Browse(context));
        }
    }

    function move(entity) {

        if (cancelled) return;
        d3.event.sourceEvent.stopPropagation();

        var nudge = childOf(context.container().node(),
            d3.event.sourceEvent.toElement) &&
            edge(d3.event.point, context.map().dimensions());

        if (nudge) startNudge(nudge);
        else stopNudge();

        var loc = context.map().mouseCoordinates();

        var d = datum();
        if (d.layerId == entity.layerId) {
            if (d.type === 'node' && d.id !== entity.id) {
                loc = d.loc;
            } else if (d.type === 'way' && !d3.select(d3.event.sourceEvent.target).classed('fill')) {
                loc = iD.geo.chooseEdge(context.childNodes(d), context.mouse(), context.projection).loc;
            }
        }
        // if (!entity.loc) {
        entity.loc = loc;
        // }
        if (loc.length == 2) {
            if (entity.loc[2]) {
                loc.push(entity.loc[2]);
            } else {
                loc.push(-1);
            }

        }

        context.replace(
            iD.actions.MoveNode(entity.id, loc),
            '曲线编辑');

    }
    function end(entity) {
        dragControlPoint(entity);
    }
    /**
     * @description:   拖拽控制点， 应该是多控制点才对， 
     * @param {type} 
     * @return: 
     */
    function dragControlPoint(entity) {

        if (entity.id != cp1.id) return;
        let locs = iD.util.getSquareBezier(node1.loc, node2.loc, entity.loc);
        let newWay = context.entity(way.id);
        let nodes = context.childNodes(newWay);
        let actions = [];
        if (nodes.length > 2) {
            for (let i = 1; i < nodes.length - 1; i++) {
                actions.push(iD.actions.DeleteNode(nodes[i].id, context));
            }
        }

        let layer = iD.Layers.getLayer(way.layerId);
        for (let i = 0; i < locs.length; i++) {
            let loc = locs[i];
            let xyz = iD.util.getPlyZ(context, loc);

            if (xyz != null) {
                loc[2] = xyz;
            }
            let node = iD.Node({
                loc: loc,
                layerId: layer.id,
                identifier: layer.identifier,
                modelName: iD.data.DataType.DIVIDER_NODE,
                tags: iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, layer)
            });
            actions.push(iD.actions.AddEntity(node));
            actions.push(iD.actions.AddVertex(way.id, node.id, i + 1));
        }
        actions.push('编辑曲线')
        context.perform.apply(this, actions);
        // context.perform(
        //     iD.actions.AddMidpoint({loc: choice.loc, edge: [prev, next]}, node),
        //     t('operations.add.annotation.vertex'));
    }
    function click() {

        var datum = d3.event.target.__data__;
        iD.select = d3.event.target;

        if (!datum || datum.id != cp1.id) {
            context.enter(iD.modes.Browse(context));
        }
    }

    function enter() {
        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector([cp1.id], context.graph()))
                .classed('selected', true);
        }

        context.map().on('drawn.bezier_editor', selectElements);
        selectElements();

        // function delegate() {
        //     var target = d3.select(d3.event.target),
        //         wayID,
        //         datum = target.datum();
        //     if (!datum) {
        //         return false;
        //     }
        //     if (!iD.Layers.getLayer(datum.layerId).editable) {
        //         return false;
        //     }

        //     if (datum instanceof iD.Node) {
        //         // dragbehaviors.on('start.editorBezier',dragControlPoint)
        //         // wayID = context.graph().parentWays(datum);
        //         // if(_.indexOf(_.pluck(wayID, 'id'),selectedIDs[0]) ==-1 ||
        //         //     datum.modelName ===datum.modelName ){
        //         //     d3_eventCancel();
        //         // }else{
        //         //     dragbehaviors.node(datum);
        //         // }
        //         // if(datum.id == cp1.id){
        //         //     dragbehaviors.node(datum);
        //         // }
        //     }

        // }
        // context.surface()
        //     .on('mousemove.bezier_editor', dragControlPoint);
        // context.surface()
        //     .on('click.bezier_editor', function () {
        //         var datum = d3.event.target.__data__;
        //         if (datum == 'undefined' || datum == null) {
        //             context.enter(iD.modes.Browse(context));
        //         }
        //     })
        // context.surface()
        //     .on('mousemove.bezier_editor', delegate);
        // context.surface()
        //     .on('click.bezier_editor', function(){
        //         var datum = d3.event.target.__data__;
        //         if(datum == 'undefined' || datum ==null){
        //             // context.enter(iD.modes.Browse(context));
        //         }
        //     })

        context.surface().on('mousedown.bezier_editor', function (d) {
            lastMousePos = [d3.event.clientX, d3.event.clientY];

            lastMouseTarget = d3.event.target;
        })
            .on('mouseup.bezier_editor', function (d) {
                // if (!d3.select(d3.event.target).datum()) {
                //     return;
                // }

                var upPos = [d3.event.clientX, d3.event.clientY]

                if (d3.event.target === lastMouseTarget &&
                    iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {

                    var targetEvent = d3.event;

                    if (clickTimeId) {
                        clearTimeout(clickTimeId);
                    }

                    clickTimeId = setTimeout(function () {


                        clickTimeId = null;

                        var oldEvent = d3.event;

                        d3.event = targetEvent;

                        click();

                        d3.event = oldEvent;

                        targetEvent = null;

                    }, 250);
                }

            })
            .on('click.bezier_editor', function () {
                if (clickTimeId) {
                    clearTimeout(clickTimeId);
                    clickTimeId = null;
                }

                var upPos = [d3.event.clientX, d3.event.clientY]
                if (lastMousePos && iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {
                    click();
                }

                lastMousePos = null;
                lastMouseTarget = null;

            });
        // context.install(dragbehaviors);
        behaviors.forEach(function (behavior) {
            context.install(behavior);
        });

        // dragbehaviors.on('move.editorBezier',dragControlPoint);

        keybinding
            .on('⎋', function () {
                context.enter(iD.modes.Browse(context));
            });

        function dele() {
            var wayNodes = _.clone(context.childNodes(context.entity(selectedIDs[0])));
            if (wayNodes.length == 2) return;
            wayNodes.shift();
            wayNodes.pop();
            var node = iD.geo.chooseNode(wayNodes, context.mouse(), context.projection);
            if (context.graph().hasEntity(node.id)) {
                var action = iD.actions.DeleteMultiple([node.id]);
                var annotation = t('operations.delete.annotation.multiple', { n: 1 });
                context.perform(
                    action,
                    annotation);
            }
        }

        keybinding
            .on(iD.ui.cmd('⌦'), dele);
        d3.select(document)
            .call(keybinding);
    }

    mode.exit = function () {
        behaviors.forEach(function (behavior) {
            context.uninstall(behavior);
        });
        
        if(context.hasEntity(cp1.id)){
            context.replace(
                iD.actions.DeleteNode(cp1.id, context),
                '曲线编辑结束');
        }

        // context.uninstall(dragbehaviors);
        keybinding.off();
        context.map().on('drawn.bezier_editor', null);
        context.surface()
            .on('click.bezier_editor', null)
        var sf = context.surface();
        sf.on('mousedown.bezier_editor', null)
            .selectAll('.selected')
            .classed('selected', false);

    };
    return mode;
};