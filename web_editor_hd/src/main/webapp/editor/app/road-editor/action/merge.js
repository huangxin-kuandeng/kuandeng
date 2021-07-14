iD.actions.Merge = function (ids, context) {
    //var roadMergeTip=iD.ui.RoadMergeTip(context);

    function groupEntitiesByGeometry(graph) {
        var entities = ids.map(function (id) {
            return graph.entity(id);
        });
        return _.extend({point: [], area: [], line: [], relation: []},
            _.groupBy(entities, function (entity) {
                return entity.geometry(graph);
            }));
    }

    function setShapeNodes(graph, startWay, endWay, newWay, midId, newMidId) {
        //var newNodes=[];
        startWay.nodes.forEach(function (id) {
            //newNodes.push(id);
            if (id === midId) {
                newWay = newWay.addNode(newMidId, newWay.nodes.length);
            } else {
                newWay = newWay.addNode(id, newWay.nodes.length);
            }
            newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
            graph = graph.replace(newWay);
        })
        var mergeSIx = startWay.nodes.indexOf(midId);
        var mergeEIx = endWay.nodes.indexOf(midId);
        var step = 1;
        var insertIx = 0;

        if (mergeEIx == 0) {
            step = 1;
        } else {
            step = -1;
        }
        var index = 0;
        var current = mergeEIx;
        while (index < endWay.nodes.length) {
            if (mergeSIx != 0) {
                insertIx = newWay.nodes.length;
            }
            if (endWay.nodes[current] != midId) {
                var id = endWay.nodes[current];
                newWay = newWay.addNode(id, insertIx);
                newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
                graph = graph.replace(newWay);
            }
            current = current + step;
            index++;
        }
        graph = graph.replace(newWay);
        return graph;
    }


    function setIdInherit(start, end, newWay) {

        if (start.isNew() && start.new_id_inherit) {
            newWay.new_id_inherit = newWay.new_id_inherit ? (newWay.new_id_inherit + ',' + start.new_id_inherit) : start.new_id_inherit;
        } else if (!start.isNew()) {
            newWay.new_id_inherit = newWay.new_id_inherit ? (newWay.new_id_inherit + ',' + start.osmId() + "+") : start.osmId() + "+";
        }
        if (end.isNew() && end.new_id_inherit) {
            newWay.new_id_inherit = newWay.new_id_inherit ? (newWay.new_id_inherit + ',' + end.new_id_inherit) : end.new_id_inherit;
        } else if (!end.isNew()) {
            newWay.new_id_inherit = newWay.new_id_inherit ? (newWay.new_id_inherit + ',' + end.osmId() + "+") : end.osmId() + "+";
        }
    }

    var action = function (graph) {

        var mid = mergeid(_.uniq(ids).map(function (id) {
            var entity = graph.entity(id);
            return entity;
        }));

        var parentWays = graph.parentWays(graph.entity(mid));

        // 导航图层，如果除两条线之外还有线包含该公共点，则不修改该点的datatype。否则修改成Highway。
        var _layer = iD.Layers.getLayer(graph.entity(wayId).layerId)
        var isRoad = _layer.isRoad();
        var mergeNode;
        mergeNode = graph.entity(mid);
        var newNode = iD.Node({
            layerId: mergeNode.layerId,
            identifier:_layer.identifier,
            loc: mergeNode.loc,
            modelName:iD.data.DataType.ROAD_NODE,
            tags:iD.util.getDefauteTags(iD.data.DataType.ROAD_NODE, iD.Layers.getLayer(mergeNode.layerId))
            // tags: {datatype: iD.data.DataType.HIGHWAY}
        });


        /*  if(parentWays.length == ids.length){
         mergeNode = mergeNode.mergeTags( {datatype:'Highway'} );
         //graph = graph.replace(mergeNode);
         }else if(parentWays.length > ids.length){//  处理关联超过两条路的情况

         mergeNode=
         }*/
        graph = graph.replace(newNode);

        var start = graph.entity(ids[0]);
        var end = graph.entity(ids[1]);

        // context.container().call(roadMergeTip,start,end);
        //return graph ;
        let layer = iD.Layers.getLayer(start.layerId);
        var newWay = iD.Way({
            layerId: start.layerId,
            identifier:layer.identifier,
            nodes: [],
            modelName:graph.entity(wayId).modelName,
            tags: graph.entity(wayId).tags
        });
        newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
		//合并道路
        iD.logger.editElement({
            'tag': 'menu_merge_'+newWay.modelName,
            'entityId': newWay.osmId(),
            'modelName': newWay.modelName
        });
        // if(iD.data.DataType.HIGHWAY==start.modelName)
        // {
        //     newWay = newWay.mergeTags({src_id: ""});
        // }
        // if(iD.data.DataType.WALKLINK==start.modelName)
        // {
        //     if(start.tags.src!=end.tags.src)
        //     {
        //         newWay=newWay.mergeTags({src:"0"});
        //     }
        //     var note=start.id!=wayId?start.tags.note:end.tag.note;
        //     newWay=newWay.mergeTags({note:note});
        // }
        graph = graph.replace(newWay);
        graph = setShapeNodes(graph, start, end, newWay, mid, newNode.id);
        if (isRoad) {
            newWay = graph.entity(newWay.id);
            if (graph.entity(wayId).tags.DIRECTION == iD.way.direction.positive && (newWay.first() == graph.entity(wayId).last() || newWay.last() == graph.entity(wayId).first())) {
                newWay = newWay.mergeTags({"DIRECTION": iD.way.direction.reverse});
                graph = graph.replace(newWay);
            } else if (graph.entity(wayId).tags.DIRECTION == iD.way.direction.reverse && (newWay.first() == graph.entity(wayId).last() || newWay.last() == graph.entity(wayId).first())) {
                newWay = newWay.mergeTags({"DIRECTION": iD.way.direction.positive});
                graph = graph.replace(newWay);
            }

            newWay = graph.entity(newWay.id);
            //道路长度属性更新
            newWay = iD.util.tagExtend.updateWayLengthTag(graph, graph.entity(newWay.id));
            newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
            graph = graph.replace(newWay);
            setIdInherit(start, end, newWay);
            graph = graph.replace(newWay);
            graph = iD.topo.handle().roadMerge(graph, graph.entity(newWay.id), start, end, mergeNode);
        }
        //删除第二条线
        ids.pop();
        ids.pop();
        ids.push(newWay.id);

        // var startSlopes = start.getSlopes(graph);
        // var endSlopes = end.getSlopes(graph);
        //
        // if (startSlopes.length > 0 || endSlopes.length > 0) {
        //     var slopes =[];
        //     if(startSlopes.length > 0)
        //     {
        //         slopes=slopes.concat(startSlopes);
        //     }
        //     if(endSlopes.length > 0)
        //     {
        //         slopes=slopes.concat(endSlopes);
        //     }
        //     slopes.forEach(function (slope) {
        //         var member = {type: "Highway", role: "road", id: newWay.id};
        //         var members = [].concat(member);
        //         graph = iD.actions.ChangeNodeMember(slope.id, members)(graph);
        //         //var member = slope.memberByRole(iD.data.RoleType.ROAD_ID);
        //        // member.id = newWay.id;
        //         //slope = slope.updateMember(member, member.index);
        //         //graph = graph.replace(slope);
        //     });
        // }

        graph = iD.actions.DeleteWay(start.id)(graph);
        graph = iD.actions.DeleteWay(end.id)(graph);
        if (parentWays.length == ids.length) {
            graph = iD.actions.DeleteNode(mergeNode.id)(graph);
        }

        if (iD.data.DataType.ROAD==newWay.modelName&&graph.hasEntity(mergeNode.id) && parentWays.length > 2) {
            mergeNode = graph.entity(mergeNode.id);
            graph = iD.util.tagExtend.updateRelationsTagsByRealNode(graph, mergeNode);
        }
        return graph;
    };
    var wayId;
    action.wayId = function (_) {
        if (_) {

            wayId = _;
        } else {
            return wayId;
        }

    }

    function mergeid(lines) {
        var start = lines[0],
            end = lines[1];
        if (start.nodes[0] == end.nodes[0] || start.nodes[0] == end.nodes[end.nodes.length - 1]) {
            return start.nodes[0];
        } else if (start.nodes[start.nodes.length - 1] == end.nodes[0] || start.nodes[start.nodes.length - 1] == end.nodes[end.nodes.length - 1]) {
            return start.nodes[start.nodes.length - 1];
        }
    }

    action.disabled = function (graph) {
        // var geometries = groupEntitiesByGeometry(graph);
        // if (geometries.point.length === 0 ||
        //     (geometries.area.length + geometries.line.length) !== 1 ||
        //     geometries.relation.length !== 0)
        //     return 'not_eligible';

        var lines = _.uniq(ids).map(function (id) {
            return graph.entity(id);
        });

        var mid = mergeid(lines);
        if (!mid) {
            return true;
        }

        var parentWays = graph.parentWays(graph.entity(mid));
        // if (context.layers().getCurrentEnableLayer().isRoad()) {
        if (iD.Layers.getLayer(parentWays[0].layerId).isRoad()) {
            return parentWays.length != ids.length;
        } else {
            var start = lines[0];
            var end = lines[1];

            return start.nodes[0] != end.nodes[0]
                && start.nodes[0] != end.nodes[end.nodes.length - 1]
                && start.nodes[start.nodes.length - 1] != end.nodes[0]
                && start.nodes[start.nodes.length - 1] != end.nodes[end.nodes.length - 1];
        }
    };

    return action;
};
