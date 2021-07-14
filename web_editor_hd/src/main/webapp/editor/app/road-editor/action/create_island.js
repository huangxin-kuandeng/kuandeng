/**
 * Created by wt on 2015/8/14.
 */
iD.actions.createIsland = function (context) {
    var startNodeLoc, endNodeLoc, highLightIds = [];
    var lineCal = iD.util.LineCalCulate();

    var action = function (graph) {
        graph = getNewRoad(graph, startNodeLoc, endNodeLoc);
        return graph;
    };

    action.disabled = function (graph) {
        return false;
    };

    action.setStartNodeLoc = function (_) {
        startNodeLoc = _;
    }
    action.setEndNodeLoc = function (_) {
        endNodeLoc = _;

    }
    action.getHighlightIds = function () {
        return highLightIds;
    }
    action.getNodesLoc = function (startNodeLoc, endNodeLoc) {
        var nodesLocation = [];
        var r = iD.geo.sphericalDistance(startNodeLoc, endNodeLoc);
        var angle = lineCal.getAngle(endNodeLoc[0], endNodeLoc[1], startNodeLoc[0], startNodeLoc[1]);
        angle = 180 - angle;
        var round = 360, step = 3;
        var pts = lineCal.getPathInCircle(startNodeLoc, r, angle, round + angle, step);
        pts.forEach(function (v, i) {
            nodesLocation.push(v);
        });
        return pts;
    }

    function getNewRoad(graph, startNodeLoc, endNodeLoc) {
        var r = iD.geo.sphericalDistance(startNodeLoc, endNodeLoc);
        var angle = lineCal.getAngle(endNodeLoc[0], endNodeLoc[1], startNodeLoc[0], startNodeLoc[1]);
        angle = 180 - angle;
        // var currLayer = context.layers().getCurrentEnableLayer(), graph = context.graph();
        var currLayer = context.layers().getLayer(), graph = context.graph();
        var round = 360, step = 3;
        var pts = lineCal.getPathInCircle(startNodeLoc, r, angle, round + angle, step);
        var nodes = [], node;
        pts.forEach(function (v, i) {
            if (i == 0 || i == pts.length - 1) {
                let nodeLayid = context.layers().getCurrentModelEnableLayer(iD.data.DataType.ROAD_NODE).id;
                let _l = iD.Layers.getLayer(nodeLayid);
                node = iD.Node({
                    layerId: nodeLayid, 
                    identifier:_l.identifier,
                    loc: v, 
                    island: startNodeLoc
                });
                node.modelName = iD.data.DataType.ROAD_NODE;
                //node.tags.mesh=MapSheet.getMeshCode(node,context);
                node = iD.util.tagExtend.updateNodeMeshTag(node,context);
                graph = iD.actions.AddEntity(node)(graph);
                nodes.push(node.id);
            }
            else {
                node = iD.Node({
                    layerId: currLayer.id, 
                    identifier:currLayer.identifier,
                    loc: v,
                    island: startNodeLoc});
                node.modelName = iD.data.DataType.HIGHWAY;
                graph = iD.actions.AddEntity(node)(graph);
                nodes.push(node.id);
            }

        });


        var way = iD.Way({layerId: currLayer.id, 
            nodes: nodes,
            identifier:currLayer.identifier
        });

        way.modelName = iD.data.DataType.HIGHWAY;
        way.setTags(iD.util.getDefauteTags(way, currLayer));
        graph = iD.actions.AddEntity(way)(graph);
        //道路的首尾结点realnode字段的更新
        var fNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,graph.entity(way.first()));
        var tNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,graph.entity(way.last()));
        graph = iD.actions.AddEntity(fNode)(graph);
        graph = iD.actions.AddEntity(tNode)(graph);
        //维护新道路的拓扑关系
        graph = iD.actions.AddRoad(way)(graph);
        //高亮新建的环岛
        highLightIds[0] = way.id;
        context.map().on('drawn.select', selectElements);
        selectElements();
        return graph;
    }

    function selectElements() {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
            .classed('selected', true);
    }


    return action;
}
