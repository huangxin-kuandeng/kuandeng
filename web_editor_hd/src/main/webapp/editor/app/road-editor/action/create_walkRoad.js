/**
 * Created by wt on 2015/11/17.
 */
iD.actions.AddWalkRoad = function (walkEntity) {
    var walkUtil = iD.util.walkExtend();
    var walkTopo = iD.topo.RelWketRoad();

    function getHighWaysWithFilterBBox(entity, g) {
        var distance = 0.1, loc = entity.loc;
        var hightWays = walkUtil.getHighWaysWithFilterBBox(editor.context, distance, entity);
        if (hightWays && hightWays.length >= 1) {
            hightWays.forEach(function (hightWay) {
                g = walkTopo.waklroadCreate(g, entity.id, hightWay.id);
            })
        }
        return g;
    }

    var action = function (graph) {
        if (walkEntity.modelName == iD.data.DataType.WALKENTER) {
            getHighWaysWithFilterBBox(walkEntity, graph);
        }
        else if (walkEntity.modelName == iD.data.DataType.WALKLINK) {

            var nodes = walkEntity.nodes;
            var firstNode = graph.entity(nodes[0]);
            var endNode = graph.entity(nodes[nodes.length - 1]);

            //维护Mesh
            // console.log('maintain mesh code');
            var fNode = iD.util.tagExtend.updateNodeMeshTag(firstNode, editor.context);
            var tNode = iD.util.tagExtend.updateNodeMeshTag(endNode, editor.context);
            graph = graph.replace(fNode);
            graph = graph.replace(tNode);

            //维护walkEnter和HighWay之间的topo关系
         //   console.log('maintain walk topo')
            graph = getHighWaysWithFilterBBox(fNode, graph);
            graph = getHighWaysWithFilterBBox(tNode, graph);

        }
        return graph;
    };


    action.disabled = function (graph) {
        return false;
    };
    return action;
}

