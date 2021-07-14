// Join ways at the end node they share.
//
// This is the inverse of `iD.actions.Split`.
//
// Reference:
//   https://github.com/systemed/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/MergeWaysAction.as
//   https://github.com/openstreetmap/josm/blob/mirror/src/org/openstreetmap/josm/actions/CombineWayAction.java
//
iD.actions.Join = function(ids) {

    function groupEntitiesByGeometry(graph) {
        var entities = ids.map(function(id) { return graph.entity(id); });
        return _.extend({line: []}, _.groupBy(entities, function(entity) { return entity.geometry(graph); }));
    }
    function mergeid(lines){
        var start = lines[0],
        end = lines[1];
        if(start.nodes[0] == end.nodes[0] || start.nodes[0] == end.nodes[end.nodes.length-1]){
            return start.nodes[0];
        }else if(start.nodes[start.nodes.length-1] == end.nodes[0] || start.nodes[start.nodes.length-1] == end.nodes[end.nodes.length-1] ){
            return start.nodes[start.nodes.length-1];
        }
    }
    var action = function(graph) {
    	var mid = mergeid(_.uniq(ids).map(function(id){
            var entity = graph.entity(id);
            return entity;
    	}));

    	var parentWays = graph.parentWays(graph.entity(mid));

	    // 导航图层，如果除两条线之外还有线包含该公共点，则不修改该点的datatype。否则修改成Highway。
	    if(parentWays.length == ids.length){
	    	var mergeNode = graph.entity(mid);
	    	// mergeNode = mergeNode.mergeTags( {datatype:'Highway'} );
	    	graph = graph.replace(mergeNode);
	    }
	
	    var start = graph.entity(ids[0]);
	    var end = graph.entity(ids[1]);
	
	    // 处理母库ID
	    start = start.mergeTags( iD.util.tagExtend.updateTaskTag(start));
	    end = end.mergeTags(iD.util.tagExtend.updateTaskTag(end));

	    var mergeSIx = start.nodes.indexOf(mid);
	    var mergeEIx = end.nodes.indexOf(mid);
	
	    var step = 1;
	    var insertIx = 0;
	
	    if(mergeEIx == 0){
	    	step = 1;
	    }else{
	    	step = -1;
	    }
	
	    var index = 0;
	    var current = mergeEIx;
	
	    while(index < end.nodes.length){
	    	if(mergeSIx != 0){
	    		insertIx = start.nodes.length;
	    	}
	    	if(end.nodes[current] != mid){
	    		var id = end.nodes[current];
	    		start = start.addNode(id,insertIx);
	    		graph = graph.replace(start);
	    	}
	    	current = current + step;
	    	index++;
	    }
	
	    //删除第二条线
	    graph = graph.remove(end);
	    return graph;
    };

    action.disabled = function(graph) {
        var geometries = groupEntitiesByGeometry(graph);
        if (ids.length < 2 || ids.length !== geometries.line.length)
            return 'not_eligible';

        var joined = iD.geo.joinWays(ids.map(graph.entity, graph), graph);
        if (joined.length > 1)
            return 'not_adjacent';

        var nodeIds = _.pluck(joined[0].nodes, 'id').slice(1, -1),
            relation;

        joined[0].forEach(function(way) {
            var parents = graph.parentRelations(way);
            parents.forEach(function(parent) {
                if (parent.type=="relation"&&parent.isRestriction() && parent.members.some(function(m) { return nodeIds.indexOf(m.id) >= 0; }))
                    relation = parent;
            });
        });

        if (relation)
            return 'restriction';
    };

    return action;
};
