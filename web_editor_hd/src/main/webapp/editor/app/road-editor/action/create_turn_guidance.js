/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 15:44:43
 * @Description: 
 */

iD.actions.CreateTurnGuidance = function(context,selectedIds,tgdArr,tags) {

    return function(graph) {
        var Members = [];
        var member = new Object();
        for(var i=0;i<selectedIds.length;i++){
            member = {'id': selectedIds[i],
                'role':iD.data.RoleType.ROAD_ID,
                'type': iD.data.GeomType.WAY,
                'modelName':iD.data.DataType.ROAD
                // 'sequence': (i+1).toString()
            };
            Members.push(member);
        }
        // var layers = iD.Layers;
       	var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.TURN_GUIDANCE);
//      var layeriD = iD.ModelEntitys[iD.data.DataType.TURN_GUIDANCE].layerId();
        var layeriD = currentLayer.id;
        var relation = iD.Relation({
            modelName: iD.data.DataType.TURN_GUIDANCE,
            members: Members,
            identifier:currentLayer.identifier,
            tags:iD.util.getDefauteTags(iD.data.DataType.TURN_GUIDANCE, currentLayer),
            layerId: layeriD
        });

        if(tags){
            relation = relation.mergeTags(tags);
        }
        graph = graph.replace(relation);
        tgdArr.push(relation);
        return graph;
    };

};