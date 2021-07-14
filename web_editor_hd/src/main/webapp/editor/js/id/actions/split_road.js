/*
 * @Author: tao.w
 * @Date: 2019-08-29 11:50:37
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 17:23:58
 * @Description: 
 */
//selectIDs 道路上选择的打断点的id
iD.actions.SplitRoad = function (selectIDs, context,targetId) {

    var action = function (graph) {
        var nodes = _.uniq(selectIDs).map(function (id) {
            var node = graph.entity(id);
            return node;
        });
        var targets = [targetId];
        var insertNodes = _.uniq(selectIDs);	//打断道路插入的结点
        _.uniq(nodes).forEach(function (node) {
            // node = iD.util.tagExtend.updateNodeMeshTag(node,context);
            //node.tags.mesh=MapSheet.getMeshCode(node,context);
            // graph = graph.replace(node);
            var parentWays = graph.parentWays(node);
            // //道路首节点或尾节点落在线上（非线上的点）设置母库ID
            // if (parentWays.length == 2) {
            //     node = node.mergeTags({src_id: ""});
            //     graph = graph.replace(node);
            // }
            // 将way打断成两条线--埋点
	        iD.logger.editElement({
	            'tag': 'menu_split_ROAD',
	            'entityId': node.osmId(),
	            'coordinate': node.loc,
	            'modelName': node.modelName
	        });
            _.uniq(parentWays).forEach(function (way, i) {

                //把该点所有线的src_id属性置为空
                if (parentWays.length > 1 && targets.indexOf(way.id) < 0)return;

                //路口生成只有一条线
                /*
                 if (parentWays.length == 1 || way.id == targetId) {
                 way = way.mergeTags({src_id: ""});
                 graph = graph.replace(way);
                 }*/

                var nodeIndex = way.nodes.indexOf(node.id);
                var newNodeIds = way.nodes.slice(nodeIndex);
                let layer = iD.Layers.getLayer( way.layerId);
                //var newWay = iD.Way();
                var newWay = iD.Way({
                    layerId : way.layerId,
                    identifier:layer.identifier,
                    nodes : [],
                    modelName : way.modelName,
                    tags : way.tags
                });
                //newWay.layerId = way.layerId;
                // newWay = newWay.mergeTags(way.tags);
                //母库ID为空
                // newWay = newWay.mergeTags({src_id: "",updatetime:"",createuser:"",createtime:""});


                graph = graph.replace(newWay);


                var newWayId;
                var wayA = way.update({id: newWayId});
                _.uniq(newNodeIds).forEach(function (id) {
                    if (id != node.id) {
                        wayA = wayA.removeNode(id);
                        graph = graph.replace(wayA);
                    }
                });
                wayA = wayA.mergeTags(iD.util.tagExtend.updateTaskTag(wayA));
                graph = graph.replace(wayA);


                newWay = graph.entity(newWay.id);
                _.uniq(newNodeIds).forEach(function (id) {
                    newWay = newWay.addNode(id);
                    newWay = newWay.mergeTags(iD.util.tagExtend.updateTaskTag(newWay));
                    graph = graph.replace(newWay);
                });

                var isRoad = iD.Layers.getLayer(wayA.layerId).isRoad();

                if (isRoad&&!(way.isNew())) {
                    wayA.new_id_inherit = iD.Entity.id.toOSM(way.id) + '-';
                    newWay.new_id_inherit = iD.Entity.id.toOSM(way.id) + '-';
                } else if (isRoad&&way.new_id_inherit) {
                    wayA.new_id_inherit = way.new_id_inherit;
                    newWay.new_id_inherit = way.new_id_inherit;
                }


                //WayA的最后一个结点，newWay的第一个结点
                if(wayA.nodes.length>2){
                    var indexA = wayA.nodes.length;
                    var shapeANode = graph.entity(wayA.nodes[indexA-2]);
                    var lon = iD.util.lassExtend.getDistance({
                        lon: shapeANode.loc[0],
                        lat: shapeANode.loc[1]
                    }, {
                        lon: node.loc[0],
                        lat: node.loc[1]
                    });
                    if(lon<iD.data.distance){
                        wayA = wayA.removeNode(shapeANode.id);

                        graph = graph.replace(wayA);
                    }
                }
                if(newWay.nodes.length>2){
                    var shapeBNode = graph.entity(newWay.nodes[1]);
                    var lon = iD.util.lassExtend.getDistance({
                        lon: shapeBNode.loc[0],
                        lat: shapeBNode.loc[1]
                    }, {
                        lon: node.loc[0],
                        lat: node.loc[1]
                    });
                    if(lon<iD.data.distance){
                        newWay = newWay.removeNode(shapeBNode.id);

                        graph = graph.replace(newWay);
                    }
                }

                //拓补维护,步导点和道路关联关系维护
                var handle = iD.topo.handle();
                graph = handle.break(context,graph, way, wayA, newWay, node,insertNodes);


                wayA = graph.entity(wayA.id);
                newWay = graph.entity(newWay.id);
                //道路长度属性更新,并且判断包含门禁信息的道路长度不能小于2米，所以必须放在拓补维护的后面
                wayA = iD.util.tagExtend.updateWayLengthTag(graph,wayA);
                newWay = iD.util.tagExtend.updateWayLengthTag(graph,newWay);
                newWay = newWay.mergeTags(iD.util.tagExtend.updateTaskTag(newWay));
                wayA = newWay.mergeTags(iD.util.tagExtend.updateTaskTag(wayA));
                graph=graph.replace(wayA);
                graph=graph.replace(newWay);

                if(way.modelName ==iD.data.DataType.ROAD){
                    var fNode = way.nodes[0];
                    var tNode = way.nodes[way.nodes.length-1];
                    var topoEntity = iD.TopoEntity();
                    var crossNodeIdA = topoEntity.isInCrossNode(graph, fNode);
                    var crossNodeIdB = topoEntity.isInCrossNode(graph, tNode);
                    if(crossNodeIdA!=false&&crossNodeIdA==crossNodeIdB){
                        graph=iD.actions.RoadCrossModify([crossNodeIdA,node.id])(graph);
                        // graph = graph.replace(way);
                    }
                }

   
                //多点打断时候对打断目标进行更新
                targets.push(wayA.id);
                targets.push(newWay.id);
                //console.log(graph.parentRelations(way));
                graph = iD.actions.DeleteWay(way.id)(graph);
                //graph = graph.remove(way);

                //对打断点的realnode属性进行更新
                node = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,node);
                //graph = iD.actions.AddEntity(node)(graph);

            });

            // if(parentWays.length>0&&parentWays[0].tags.datatype==iD.data.DataType.ROAD_NODE){
            //     //对打断点的realnode属性进行更新
            //     node = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,node);
            //     node = node.mergeTags({datatype: "RoadNode"});
            // }
            
	        // update node
	        node = node.mergeTags(iD.util.tagExtend.updateTaskTag(node));
            graph = graph.replace(node);


        });
        //selectIDs = [];
        selectIDs.length = 0;
        return graph;
    };

    action.disabled = function (graph) {
        return false;
    };
    return action;
}