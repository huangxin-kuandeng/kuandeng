// Join ways at the end node they share.
//
// This is the inverse of `iD.actions.Split`.
//
// Reference:
//   https://github.com/systemed/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MergeWaysAction.as
//   https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/actions/CombineWayAction.java
//
iD.actions.WayJoin = function (ids) {

    function groupEntitiesByGeometry(graph) {
        var entities = ids.map(function (id) { return graph.entity(id); });
        return _.extend({ line: [] }, _.groupBy(entities, function (entity) { return entity.geometry(graph); }));
    }

    var action = function (graph) {
        var ways = ids.map(graph.entity, graph),
            survivor = ways[0],
            mid = mergeid(ways);
        if (ways[0].tags.DIRECTION == '1' && ways[1].tags.DIRECTION == '1') {
            // Prefer to keep an existing way.
            for (let i = 0; i < ways.length; i++) {
                if (!ways[i].isNew()) {
                    survivor = ways[i];
                    break;
                }
            }
        } else {
            if (ways[0].tags.DIRECTION == '2' && _.first(ways[0].nodes) == mid) {
                survivor = ways[1];
                ways.reverse();
            }else if(ways[0].tags.DIRECTION == '3' && _.last(ways[0].nodes) == mid){
                survivor = ways[1];
                ways.reverse();
            }
        }

        // 分离共点上其他线
        var mnode = graph.entity(mid);
        var mpways = graph.parentWays(mnode) || [];
        let layer = iD.Layers.getLayer(mnode.layerId);
        if (mnode.modelName && mpways.length > ids.length) {
            var newNode = iD.Node({
                layerId: mnode.layerId,
                identifier: layer.identifier,
                loc: mnode.loc,
                modelName: mnode.modelName,
                tags: iD.util.getDefauteTags(mnode.modelName, iD.Layers.getLayer(mnode.layerId))
            });

            graph.parentRelations(mnode).forEach(d => {
                let rol = d.memberByRole(iD.data.RoleType.DIVIDER_ID);
                if (d.modelName != iD.data.DataType.MEASUREINFO && ids.includes(rol.id)) {
                    graph = iD.actions.DeleteRelation(d.id)(graph);
                } else if (d.modelName == iD.data.DataType.MEASUREINFO) {
                    var mnode_measureInfo = graph.parentRelations(mnode);
                    if (mnode_measureInfo.length) {
                        var PARAMETER = JSON.parse(mnode_measureInfo[0].tags.PARAMETER);
                        let measureinfo = iD.picUtil.measureinfoAction(newNode, {
                            type: 0,
                            trackPointId: PARAMETER.Paras.nodes[0].trackPointId,
                            imgOffset: {'x': PARAMETER.Paras.nodes[0].x, 'y': PARAMETER.Paras.nodes[0].y}
                        });
                        graph = measureinfo(graph);
                    }
                }
            })

            mnode = newNode;
            graph = graph.replace(newNode);
            ways = [];
            // 其他线使用分离后的节点
            mpways.forEach(function (way) {
                if (ids.includes(way.id)) {
                    let _way = way.replaceNode(mid, newNode.id)
                    graph = graph.replace(_way);
                    ways.push(_way);
                }
            });
        }
        graph = graph.replace(mnode.mergeTags(iD.util.tagExtend.updateTaskTag(mnode)));
        var joined = iD.geo.joinWays(ways, graph)[0];

        survivor = survivor.update({ nodes: _.pluck(joined.nodes, 'id') });
        graph = graph.replace(survivor);

        graph.parentRelations(mnode).forEach(d => {
            if (d.modelName != iD.data.DataType.MEASUREINFO) {
                graph = iD.actions.DeleteRelation(d.id)(graph);
            }
        })

        joined.forEach(function (way) {
            if (way.id === survivor.id)
                return;

            // graph.parentRelations(way).forEach(function (parent) {
            //     parent = parent.mergeTags(iD.util.tagExtend.updateTaskTag(parent));
            //     graph = graph.replace(parent);
            //     graph = graph.replace(parent.replaceMember(way, survivor));
            // });
            graph.parentRelations(way).forEach(d => {
                if (d.modelName == iD.data.DataType.DIVIDER_ATTRIBUTE) {
                    graph = graph.remove(d);
                } else {
                    graph = graph.replace(d.replaceMember(way, survivor));
                }
            })

            // survivor = survivor.mergeTags(way.tags);
            // survivor = survivor.mergeTags(iD.util.tagExtend.updateTaskTag(survivor));
            // graph = graph.replace(survivor);
            graph = iD.actions.DeleteWay(way.id)(graph);
        });

        // let _tempWays = _.filter(ways,d=>{
        //     return d.id != survivor.id;
        // })
        // _tempWays.forEach(w=>{
        //     graph.parentRelations(w, iD.data.DataType.DIVIDER_ATTRIBUTE).forEach(d => {
        //         graph = graph.remove(d);
        //     })
        // })

        return graph;
    };

    action.disabled = function (graph) {
        var geometries = groupEntitiesByGeometry(graph);
        if (ids.length < 2 || ids.length !== geometries.line.length)
            return 'not_eligible';

        var joined = iD.geo.joinWays(ids.map(graph.entity, graph), graph);
        if (joined.length > 1)
            return 'not_adjacent';

        var nodeIds = _.pluck(joined[0].nodes, 'id').slice(1, -1),
            relation;

        joined[0].forEach(function (way) {
            var parents = graph.parentRelations(way);
            parents.forEach(function (parent) {
                if (parent.isRestriction() && parent.members.some(function (m) { return nodeIds.indexOf(m.id) >= 0; }))
                    relation = parent;
            });
        });

        if (relation)
            return 'restriction';
    };

    function mergeid(lines) {
        var start = lines[0],
            end = lines[1];
        if (start.nodes[0] == end.nodes[0] || start.nodes[0] == end.nodes[end.nodes.length - 1]) {
            return start.nodes[0];
        } else if (start.nodes[start.nodes.length - 1] == end.nodes[0] || start.nodes[start.nodes.length - 1] == end.nodes[end.nodes.length - 1]) {
            return start.nodes[start.nodes.length - 1];
        }
    }

    return action;
};
