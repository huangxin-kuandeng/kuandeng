/**
 * Created by  on 2015/9/29.
 */
// https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/command/MoveCommand.java
// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MoveNodeAction.as
iD.actions.UpdateRealNode = function(context,nodeId,oldNodeEntity) {
    return function(graph) {
        var node=graph.entity(nodeId);
        //var meshCode=MapSheet.getMeshCode(graph.entity(nodeId),context);
        //
        //if(node.tags.mesh!=meshCode)
        //{
        //    node.tags.mesh=meshCode;
        //    graph=graph.replace(node);
        //}
        if(oldNodeEntity&&oldNodeEntity.tags){
            oldNodeEntity = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,oldNodeEntity);
            graph=graph.replace(oldNodeEntity);
            graph = iD.util.tagExtend.updateRelationsTagsByRealNode(graph,oldNodeEntity);
        }
        node = iD.util.tagExtend.updateNodeMeshTag(node,context);
        node = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,node);
        graph=graph.replace(node);
        graph = iD.util.tagExtend.updateRelationsTagsByRealNode(graph,node);
        return graph;
    };

};
