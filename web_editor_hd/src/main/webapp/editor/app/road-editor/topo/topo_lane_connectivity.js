/*
 * @Author: kanhognyu
 * @Date: 2019-07-22 14:54:03
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 18:27:18
 * @Description: 
 */
iD.topo.LaneConnectivity = function() {
    var connectModelName = iD.data.DataType.HD_LANE_CONNECTIVITY;
    var nodeModelName = iD.data.DataType.HD_LANE_NODE;
    var wayModelName = iD.data.DataType.HD_LANE;
    // var connectModelName = iD.data.DataType.HD_LANE_CONNECTIVITY;
    // var nodeModelName = iD.data.DataType.DIVIDER_NODE;
    // var wayModelName = iD.data.DataType.DIVIDER;
    var FROM_WAY_ID = iD.data.RoleType.FLANE_ID;
    var RULE_NODE_ID = iD.data.RoleType.LANENODE_ID;
    var TO_WAY_ID = iD.data.RoleType.TLANE_ID;

    var topoNodeMaat = {};
    topoNodeMaat.roadMerge = function(graph, way, wayA, wayB, rel, midNode, crossNodeM, crossNodeS, crossNodeE) {
        return graph;
    };

    /*打断点*/
    topoNodeMaat.break = function(context, graph, way, wayA, wayB, rel) {
        var from = rel.memberByRole(FROM_WAY_ID);
        var to = rel.memberByRole(TO_WAY_ID);
        var node = rel.memberByRole(RULE_NODE_ID);
        var wayNodesLength = way.nodes.length;

        var fid = from.id, tid = to.id;
        if (from && node && (node.id == way.nodes[0]) && (from.id == way.id)) {
            from.id = wayA.id;
        } else if (from && node && (node.id == way.nodes[wayNodesLength - 1]) && (from.id == way.id)) {
            from.id = wayB.id;
        };
        rel = rel.updateMember(from, 0);

        if (to && node && (node.id == way.nodes[0]) && (to.id == way.id)) {
            to.id = wayA.id;
        } else if (to && node && (node.id == way.nodes[wayNodesLength - 1]) && (to.id == way.id)) {
            to.id = wayB.id;
        };
        rel = rel.updateMember(to, 2);
        rel.tags = iD.util.tagExtend.updateTaskTag(rel);

        // console.log('%cfrom update ' + fid + ' -> ' + from.id, 'color: blue;');
        // console.log('%cto update ' + tid + ' -> ' + to.id, 'color: blue;');

        graph = graph.replace(rel);
        return graph;
    };

    /*道路打断点的maat维护*/
    topoNodeMaat.breakNode = function(graph, node, wayA, wayB, way, context) {
        graph = udpateAndRemoveMaat(graph, wayA.id, wayB.id, node.id);
        graph = udpateAndRemoveMaat(graph, wayB.id, wayA.id, node.id);
        graph = udpateAndRemoveMaat(graph, wayA.id, wayA.id, node.id);
        graph = udpateAndRemoveMaat(graph, wayB.id, wayB.id, node.id);
        // 刷新节点类型
        graph = updateAllMaatTags(graph, node.id);
        return graph;
    };

    // 方向更改时刷新
    topoNodeMaat.changeTags = function(graph, way, oldTags, changeTags){
        if(way.modelName == connectModelName){
            if(!changeTags || changeTags.NODE_TYPE == null){
                return graph;
            }
            let rel = way;
            let f = rel.memberByRole(FROM_WAY_ID);
            let n = rel.memberByRole(RULE_NODE_ID);

            return updateWayNodeMaatTags(graph, f.id, n.id, {
                NODE_TYPE: changeTags.NODE_TYPE
            });
        }
        
        if(way.modelName != wayModelName 
            || changeTags.DIRECTION == null 
            || oldTags.DIRECTION == changeTags.DIRECTION){
            return graph;
        }

        let firstid = way.first();
        let lastid = way.last();
        graph.parentWays(graph.entity(firstid)).forEach(function(toWay){
            if(toWay.id == way.id) return ;
            graph = udpateAndRemoveMaat(graph, way.id, toWay.id, firstid);
            graph = udpateAndRemoveMaat(graph, toWay.id, way.id, firstid);
        });
        graph.parentWays(graph.entity(lastid)).forEach(function(toWay){
            if(toWay.id == way.id) return ;
            graph = udpateAndRemoveMaat(graph, way.id, toWay.id, lastid);
            graph = udpateAndRemoveMaat(graph, toWay.id, way.id, lastid);
        });
        // 刷新节点类型
        graph = updateAllMaatTags(graph, firstid);
        graph = updateAllMaatTags(graph, lastid);
        return graph;
    }

    //自动补全一个结点的maat拓补关系
    topoNodeMaat.autoCompleteNodeTopo = function(graph, nodeID) {
        return graph;
    }

    /*道路相交的maat维护*/
    topoNodeMaat.roadIntersect = function(graph, nodesArr, oldWays) {
        return graph;
    };

    /*道路拓补打断对原先结点entityB和拖动的新结点entityA的maat维护*/
    topoNodeMaat.topoSplit = function(graph, entityA, entityB, wayId) {
        return graph;
    };

    topoNodeMaat.roadCreate = function(graph, nodeId) {
        return graph;
    }

    topoNodeMaat.roadCrossEdit = function(graph, node) {
        return graph;
    }

    topoNodeMaat.crossNodeMerge = function(graph, crossNodeA, crossNodeB) {
        return graph;
    }
    topoNodeMaat.nodeMerge = function(context, graph, nodeA, nodeB) {
        if (nodeA.modelName == nodeModelName && nodeB.modelName == nodeModelName) {
            //return createFullNodeMaat(graph,node.id);
            graph.parentRelations(nodeA).forEach(function(rel) {
                if (rel.modelName == connectModelName) {
                    var member = rel.memberByRole(RULE_NODE_ID);
                    member.id = nodeB.id;
                    rel = rel.updateMember(member, member.index);
                    graph = graph.replace(rel);
                }
            });
            return createFullNodeMaat(graph, nodeB.id);
        } else {
            return graph;
        }

    }
    topoNodeMaat.nodeMove = function(context, graph, node) {
        return graph;
    }

    function action_ChangeTags(entityId, tags){
        return function(graph){
            var entity = graph.entity(entityId);
            var lay = iD.Layers.getLayer(entity.layerId);
            if(lay && lay.tagReadOnly){
                return graph;
            }
            graph = graph.replace(entity.update({tags:iD.util.tagExtend.updateTaskTag(entity, tags)}));
            return graph;
        }
    }

    // 同个FROM-NODEID，使用第一个有NODE_TYPE属性，覆盖其他属性
    function updateWayNodeMaatTags(graph, fromWayId, nodeId, changeTags){
        var nodeRels = graph.parentRelations(graph.entity(nodeId), connectModelName);
        if(!nodeRels.length || !changeTags) return graph;
        if(changeTags.NODE_TYPE == null) return graph;

        var rels = nodeRels.filter(function(rel){
            let f = rel.memberByRole(FROM_WAY_ID);
            let n = rel.memberByRole(RULE_NODE_ID);
            return f.id == fromWayId && n.id == nodeId;
        });
        rels.forEach(function(rel){
            graph = action_ChangeTags(rel.id, changeTags)(graph);
        });
        return graph;
    }

    // 同个FROM-NODEID，使用第一个有NODE_TYPE属性，覆盖其他属性
    function updateAllMaatTags(graph, nodeId){
        var nodeRels = graph.parentRelations(graph.entity(nodeId), connectModelName);
        if(!nodeRels.length) return graph;

        var map = _.groupBy(nodeRels, function(rel){
            let f = rel.memberByRole(FROM_WAY_ID);
            let n = rel.memberByRole(RULE_NODE_ID);
            return f.id + '-' + n.id;
        });
        for(let i in map){
            if(!map[i].length) continue;
            let arr = [];
            let frel;
            map[i].forEach(function(d){
                if(frel) {
                    arr.push(d);
                    return ;
                }
                if(d.tags.NODE_TYPE != null && d.tags.NODE_TYPE != ''){
                    frel = d;
                }else {
                    arr.push(d);
                }
            });
            if(!frel){
                frel = arr[0];
            }
            if(frel.tags.NODE_TYPE == null) continue;
            arr.forEach(function(rel){
                if(frel.tags.NODE_TYPE == rel.tags.NODE_TYPE) return ;
                graph = action_ChangeTags(rel.id, {
                    NODE_TYPE: frel.tags.NODE_TYPE
                })(graph);
            });
        }
        return graph;
    }

    //
    function createFullNodeMaat(graph, nodeId) {
        var connectWays = graph.parentWays(graph.entity(nodeId)); //与点关联的所有的道路
        connectWays.forEach(function(way) {
            graph = createFullWayNodeMaat(graph, way.id, nodeId);
        })
        return graph;
    }
    
    // 根据传入的道路和结点进行完整的nodemaat的维护
    function createFullWayNodeMaat(graph, wayId, nodeId) {
        var node = graph.entity(nodeId);
        var connectWays = graph.parentWays(node); //与点关联的所有的道路
        var isInArray = function(array, element) {
            if (array && element) {
                for (var i in array) {
                    if (array[i].toString() == element.toString()) {
                        return true;
                    }
                }
            }
            return false;
        };
        var newNodeMaatWaysId = new Array(); //所有关联道路id数组
        connectWays.forEach(function(w) {
            newNodeMaatWaysId.push(w.id);
        })
        var parentRelation = graph.parentRelations(node);
        var adjoinWayIds = new Array();
        // if(parentRelation.length!=0){
        parentRelation.forEach(function(relation) {
            if (relation.modelName == connectModelName) {
                var from_roadId = relation.memberByRole(FROM_WAY_ID).id;
                var to_roadId = relation.memberByRole(TO_WAY_ID).id;
                //relations关联的道路现在已经不在结点关联道路列表中，把该关系删除
                if (!isInArray(newNodeMaatWaysId, from_roadId) || !isInArray(newNodeMaatWaysId, to_roadId)) {
                    graph = iD.actions.DeleteRelation(relation, graph)(graph);
                } else if (wayId == from_roadId || wayId == to_roadId) {
                    var fromToWaysArr = [from_roadId, to_roadId];
                    if (!isInArray(adjoinWayIds, fromToWaysArr)) {
                        adjoinWayIds.push(fromToWaysArr);
                    }
                }
            }
        });

        //adjoinWayIds为relations中取出的所有有效关联道路的[from_roadId,to_roadId]
        newNodeMaatWaysId.forEach(function(newWayId) {
            if(wayId == newWayId) {
                return ;
            }
            var newFromToWayArr1 = [wayId, newWayId];
            var newFromToWayArr2 = [newWayId, wayId];
            if (!isInArray(adjoinWayIds, newFromToWayArr1)) {
                graph = udpateAndRemoveMaat(graph, wayId, newWayId, nodeId);
            }
            if (!isInArray(adjoinWayIds, newFromToWayArr2)) {
                graph = udpateAndRemoveMaat(graph, newWayId, wayId, nodeId);
            }
        });
        // }

        graph = updateAllMaatTags(graph, nodeId);
        return graph;
    }

    // 方向校验，是否连通
    // 双向-两端不是禁行
    // 正向-都是正向/双向
    // 逆向-都是逆向/双向
    // 禁行-不显示箭头
    function accessConnectivity(graph, fromWayId, toWayId, nodeId){
        var fromWay = graph.hasEntity(fromWayId);
        var toWay = graph.hasEntity(toWayId);
        var node = graph.hasEntity(nodeId);
        return iD.util.laneDirectionConnectAccessable(graph, fromWay, toWay, node);
    }
    function udpateAndRemoveMaat(graph, sWayId, eWayId, nWayId) {
        // console.log(iD.Entity.id.toOSM(sWayId) + ' -> ' + iD.Entity.id.toOSM(eWayId));
        if(!accessConnectivity(graph, sWayId, eWayId, nWayId)){
            // console.log('%cunaccessable!', 'color: red;');
            graph = removeMaat(graph, sWayId, eWayId, nWayId);
            return graph;
        }
        // console.log('%caccessable', 'color: green;');

        if(!getMaat(graph, sWayId, eWayId, nWayId)){
            return createNewMaat(graph, sWayId, eWayId, nWayId);
        }else {
            return graph;
        }
    }

    function getMaat(graph, sWayId, eWayId, nWayId){
        let rels = graph
            .parentRelations(graph.entity(sWayId), connectModelName)
            .filter(function(r) {
                let ids = _.pluck(r.members, 'id');
                let from = _.find(r.members, {role: FROM_WAY_ID});
                let to = _.find(r.members, {role: TO_WAY_ID});
                if(!from || !to) return false;
                return ids.includes(sWayId) && from.id == sWayId
                    && ids.includes(nWayId)
                    && ids.includes(eWayId) && to.id == eWayId;
            });

        return rels && rels[0];
    }

    function removeMaat(graph, sWayId, eWayId, nWayId){
        var relation = getMaat(graph, sWayId, eWayId, nWayId);
        if(relation) return graph.remove(relation);
        return graph;
    }

    function createNewMaat(graph, sWayId, eWayId, nWayId) {
        var nodeMaatMember = [{
            'id': sWayId,
            'role': FROM_WAY_ID,
            'type': iD.data.GeomType.WAY,
            'modelName': wayModelName
        },
        {
            'id': nWayId,
            'role': RULE_NODE_ID,
            'type': iD.data.GeomType.NODE,
            'modelName': nodeModelName
        },
        {
            'id': eWayId,
            'role': TO_WAY_ID,
            'type': iD.data.GeomType.WAY,
            'modelName': wayModelName
        }];
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(connectModelName);
        let layerId = currentLayer.id;
        var relation = iD.Relation({
            tags: iD.util.getDefauteTags(connectModelName, currentLayer),
            modelName: connectModelName,
            members: nodeMaatMember,
            identifier:currentLayer.identifier,
            layerId: layerId
        });
        // ACCESSABLE属性字段的更新
        // relation = iD.util.tagExtend.updateAcceTagOfNMaat(graph, relation);
        graph = graph.replace(relation);
        return graph;
    }

    return topoNodeMaat;
}