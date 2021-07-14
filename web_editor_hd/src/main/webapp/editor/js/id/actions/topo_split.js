/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 16:38:12
 * @Description: 
 */
/**
 * Created by  on 2015/8/12.
 * entity为选中的拖动点
 * selectedWays为选中的道路
 */
iD.actions.TopoSplit = function(context,selectedWays,entity,newNodeEntityArr) {

    return function(graph) {
        var selectedWay = graph.entity(selectedWays);
        var nodeLength = selectedWay.nodes.length;
        var fromNode = selectedWay.nodes[0];
        var fromNodeEntity = graph.entity(fromNode);
        var toNode = selectedWay.nodes[nodeLength - 1];
        var toNodeEntity = graph.entity(toNode);
        var fromToNodes = [fromNode, toNode];       //获得道路的首尾结点




        //判断道路的哪个结点进行移动
        var newNodeId;
        var layers = iD.Layers;
//      var currentLayer = layers.getCurrentEnableLayer();
        var currentLayer = layers.getCurrentModelEnableLayer(iD.data.DataType.ROAD_NODE);
        if(fromNode == entity.id){
           // if(willBeSingleNode(entity,context))return  graph;
            //var newNodeEntity = fromNodeEntity.update({id: newNodeId});
            var newNodeEntity =new iD.Node({
                loc: fromNodeEntity.loc,
                layerId: currentLayer.id,
                identifier: currentLayer.identifier,
                modelName: iD.data.DataType.ROAD_NODE,
                tags: iD.util.getDefauteTags(iD.data.DataType.ROAD_NODE, currentLayer)
            });
            selectedWay = selectedWay.updateNode(newNodeEntity.id, 0);

            selectedWay =selectedWay.mergeTags(iD.util.tagExtend.updateTaskTag(selectedWay))
            graph = graph.replace(selectedWay);

            graph = graph.replace(newNodeEntity);
        }else if(toNode == entity.id){
            //if(willBeSingleNode(entity,context))return  graph;
            //var newNodeEntity = toNodeEntity.update({id: newNodeId});
            var newNodeEntity =new iD.Node({
                loc: toNodeEntity.loc,
                layerId: currentLayer.id,
                identifier: currentLayer.identifier,
                modelName: iD.data.DataType.ROAD_NODE,
                tags: iD.util.getDefauteTags(iD.data.DataType.ROAD_NODE, currentLayer)
            });
            //var newNodeEntity =new iD.Node({id: newNodeId});
            selectedWay = selectedWay.updateNode(newNodeEntity.id, nodeLength - 1);
            selectedWay =selectedWay.mergeTags(iD.util.tagExtend.updateTaskTag(selectedWay))
            graph = graph.replace(newNodeEntity);
        }else{
            Dialog.alert("请在选择的道路首尾结点进行道路拓补分离！！");
        }

        graph = graph.replace(entity);
        graph = graph.replace(selectedWay);

        if(newNodeEntity){
            newNodeEntityArr.push(newNodeEntity);
            if (entity.new_id_inherit) {
                newNodeEntity.new_id_inherit = entity.new_id_inherit;
            }else{
                newNodeEntity.new_id_inherit = iD.Entity.id.toOSM(entity.id) + '-';
            }
            graph = graph.replace(entity);
            var handle = iD.topo.handle();
            graph = handle.topoSplit(graph, newNodeEntity, entity, selectedWays);


        }

        return graph;
    };
};
