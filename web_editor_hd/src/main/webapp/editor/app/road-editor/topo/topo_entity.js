/*
 * @Author: tao.w
 * @Date: 2018-12-17 11:23:44
 * @LastEditors: tao.w
 * @LastEditTime: 2019-09-27 20:01:51
 * @Description: 
 */
/**
 * Created by wt on 2015/8/5.
 */
iD.TopoEntity = function () {
    var topoEntity = {};
    /*如果node属于某个综合交叉点则返回该综合交叉点的id,否则返回false*/
    // topoEntity.isInCrossNode = function (graph, nodeId) {
    //     var result = false;
    //     var parentRelation = graph.parentRelations(graph.entity(nodeId));
    //     parentRelation.forEach(function (relation) {
    //         if (relation.modelName == iD.data.Constant.C_NODE) {
    //             result = relation.id;
    //         }
    //     });
    //     return result;
    // }
    topoEntity.isInCrossNode = function (graph, nodeId) {
        var result = false;
        let entity = graph.hasEntity(nodeId);
        if(!entity) return result;
        var parentRelation = graph.parentRelations(entity,iD.data.DataType.R_C_NODE_ROAD_NODE);
        parentRelation.forEach(function (relation) {
            let members = relation.members;
            members.forEach(member=>{
                if(member.modelName == iD.data.DataType.C_NODE){
                    result = member.id;
                }
            })
        });
        return result;
    }
     topoEntity.getCrossNodeMembers = function(graph, crossId){
         var result = false;
         var parentRelation = graph.parentRelations(graph.entity(crossId),iD.data.DataType.R_C_NODE_ROAD_NODE);
         if(parentRelation.length>1){
             console.warn('cross:',crossId,'存在多个relations')
         }
         if(parentRelation.length ==1){
             let relation = parentRelation[0];
             let members = relation.members;
             result = [];
             members.forEach(member=>{
                 if(member.modelName != iD.data.DataType.C_NODE){
                     result.push(member);
                 }
             })
         };
         return result;
     }
    //TODO 原有关系和现在关系有区别
    // topoEntity.getRoadCrossByNode = function (graph, nodeId) {
    //     var result = false;
    //     var parentRelation = graph.parentRelations(graph.entity(nodeId));
    //     parentRelation.forEach(function (relation) {
    //         if (relation.modelName == iD.data.Constant.C_NODE) {
    //             result = relation;
    //         }
    //     });
    //     return result;
    // }
    topoEntity.getRoadCrossByNode = function (graph, nodeId) {
        var result = false;
        var parentRelation = graph.parentRelations(graph.entity(nodeId),iD.data.DataType.R_C_NODE_ROAD_NODE);
        parentRelation.forEach(function (relation) {
            let members = relation.members;
            members.forEach(member=>{
                if(member.modelName == iD.data.DataType.C_NODE){
                    result = graph.entity(member.id);
                }
            })
        });
        return result;
    }

    //如果节点属于综合交叉点，返回该节点关联综合交叉点数量。
    topoEntity.getRoadIsInCrossParentWaysNum = function(entity,graph){
        var flag = false;
        var crossNodeId = topoEntity.isInCrossNode(graph,entity.id);
        if(crossNodeId){
            var parentWays = graph.parentWays(entity);
            var wayCounts = 0;
            for(var i = 0;i<parentWays.length;i++){
                if(parentWays[i].modelName==iD.data.DataType.ROAD)
                    wayCounts++;
            }
            return  wayCounts;
        }
        return 0;
    }



    return topoEntity;
};
