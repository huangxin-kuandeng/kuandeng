/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 15:45:16
 * @Description: 
 */
/**
 * Created by  on 2015/11/12.
 * 创建一个新的步导点和道路的关联关系
 */
iD.actions.CreateRelWketRoad = function(walkenterId,highwayId) {

    return function(graph) {

        var Members = [{
            'id': walkenterId,
            'role': "walkenter",
            'type': "WalkEnter"
        }, {
            'id': highwayId,
            'role': "road",
            'type': "Highway"
        }];
        layers = iD.Layers;
        currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.RELWKETROAD).id;
        
        var relation = iD.Relation({
            identifier:currentLayer.identifier,
            modelName:iD.data.DataType.RELWKETROAD,
            members: Members,
            layerId: currentLayer.id
        });

        graph = graph.replace(relation);
        return graph;
    };
};