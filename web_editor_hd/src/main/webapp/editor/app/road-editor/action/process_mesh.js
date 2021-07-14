
iD.actions.ProcessMesh = function(changes) {
    return function(graph) {
        for (var type in changes) {
            if(type=="deleted"){
                continue;
            }
            var entities = changes[type];

            for (var i = 0;i < entities.length;i++) {
                if(entities[i].type === 'node' && !entities[i].isRoadCross())
                {
                    var node=entities[i];
                    graph.parentWays(node).forEach(function(way){
                        var fNode = graph.entity(way.first());
                        var tNode = graph.entity(way.last());
                        if(!way.isOneRoadCrossWay()&&way.tags&&way.tags.mesh){
                            if(fNode.tags.boundary=="0")
                            {
                                if(way.tags.mesh!=fNode.tags.mesh)
                                {
                                    // way=way.mergeTags({'mesh':'',"src_id":""});
                                    graph=graph.replace(way);
                                }
                               
                            }else if(tNode.tags.boundary=="0")
                            {
                                if(way.tags.mesh!=tNode.tags.mesh)
                                {
                                    // way=way.mergeTags({'mesh':'',"src_id":""});
                                    graph=graph.replace(way);
                                }

                            }else{
                                var road_mesh="";
                                if(tNode.tags.mesh==fNode.tags.mesh)
                                {
                                    road_mesh=tNode.tags.mesh;
                                }else if(tNode.tags.mesh2==fNode.tags.mesh2){
                                    road_mesh=tNode.tags.mesh2;
                                }else if(tNode.tags.mesh2==fNode.tags.mesh)
                                {
                                    road_mesh=tNode.tags.mesh2;
                                }else if(tNode.tags.mesh==fNode.tags.mesh2)
                                {
                                    road_mesh=tNode.tags.mesh;
                                }
                                if(way.tags.mesh!=road_mesh)
                                {
                                    // way=way.mergeTags({'mesh':'',"src_id":""});
                                    graph=graph.replace(way);
                                }
                            }
                        }
                    })
                }
            }
        }
        return graph;
    };

};
