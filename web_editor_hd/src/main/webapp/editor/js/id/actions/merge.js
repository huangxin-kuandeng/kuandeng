iD.actions.Merge = function(ids, context) {
    
    function groupEntitiesByGeometry(graph) {
        var entities = ids.map(function(id) { return graph.entity(id); });
        return _.extend({point: [], area: [], line: [], relation: []},
            _.groupBy(entities, function(entity) { return entity.geometry(graph); }));
    }

    var action = function(graph) {
        // var geometries = groupEntitiesByGeometry(graph),
        //     target = geometries.area[0] || geometries.line[0],
        //     points = geometries.point;

        // points.forEach(function(point) {
        //     target = target.mergeTags(point.tags);

        //     graph.parentRelations(point).forEach(function(parent) {
        //         graph = graph.replace(parent.replaceMember(point, target));
        //     });

        //     graph = graph.remove(point);
        // });

        // graph = graph.replace(target);
       
       var mid = mergeid(_.uniq(ids).map(function(id){
                       var entity = graph.entity(id);
                       return entity;
                 }));

       var parentWays = graph.parentWays(graph.entity(mid));
       
       // 导航图层，如果除两条线之外还有线包含该公共点，则不修改该点的datatype。否则修改成Highway。
       // var isRoad = context.layers().getCurrentEnableLayer() && context.layers().getCurrentEnableLayer().isRoad();
        var layer = context.layers().getLayer(parentWays.layerId);
	   var isRoad = layer && layer.isRoad();
       if(parentWays.length == ids.length && isRoad){
           var mergeNode = graph.entity(mid);
           // mergeNode = mergeNode.mergeTags( {datatype:'Highway'} );
           mergeNode = mergeNode.mergeTags(iD.util.tagExtend.updateTaskTag(mergeNode));
           graph = graph.replace(mergeNode);
       }

       var start = graph.entity(ids[0]);
       var end = graph.entity(ids[1]);
       
       // 处理母库ID
       // start = start.mergeTags( {src_id : "" } );
       // end = end.mergeTags( {src_id : "" } );
       
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
	   
	   if (isRoad && (!(start.isNew() && end.isNew()) || (start.new_id_inherit || end.new_id_inherit))) {//ID继承
			var ismulti = start.new_id_inherit && (start.new_id_inherit.indexOf('-') !== -1), 
				s_id_inherit = '',
				e_id_inherit = iD.Entity.id.toOSM(end.id);
			
			if (ismulti) {
				var os = start.new_id_inherit.split(',');
				if (os[1]) {
					s_id_inherit = os[0] + ',' + os[1] + '+' + e_id_inherit;
				} else {
					s_id_inherit = start.new_id_inherit + ',' + iD.Entity.id.toOSM(start.id) + '+' + e_id_inherit;
				}
			} else {
				s_id_inherit = (start.new_id_inherit ? start.new_id_inherit : iD.Entity.id.toOSM(start.id)) + '+' + e_id_inherit;
			}
			start.new_id_inherit = s_id_inherit;
			
			end.new_id_inherit && (end.new_id_inherit = null, delete end.new_id_inherit);
	   }

       //删除第二条线
       graph = graph.remove(end);
       return graph;
    };
    
    function mergeid(lines){
        var start = lines[0],
        end = lines[1];
        if(start.nodes[0] == end.nodes[0] || start.nodes[0] == end.nodes[end.nodes.length-1]){
            return start.nodes[0];
        }else if(start.nodes[start.nodes.length-1] == end.nodes[0] || start.nodes[start.nodes.length-1] == end.nodes[end.nodes.length-1] ){
            return start.nodes[start.nodes.length-1];
        }
    }

    action.disabled = function(graph) {
        // var geometries = groupEntitiesByGeometry(graph);
        // if (geometries.point.length === 0 ||
        //     (geometries.area.length + geometries.line.length) !== 1 ||
        //     geometries.relation.length !== 0)
        //     return 'not_eligible';

         var lines = _.uniq(ids).map(function(id){
                return graph.entity(id);
         });

         var mid = mergeid(lines);
         if(!mid){
          return true;
         }
         
         var parentWays = graph.parentWays(graph.entity(mid));
         // if(context.layers().getCurrentEnableLayer().isRoad()){
        var layer = context.layers().getLayer(parentWays.layerId);
         if(layer.isRoad()){
             return parentWays.length != ids.length;
         }else{
             var start = lines[0];
             var end = lines[1];

             return  start.nodes[0] != end.nodes[0] 
                    && start.nodes[0] != end.nodes[end.nodes.length-1]
                    && start.nodes[start.nodes.length-1] != end.nodes[0]
                    && start.nodes[start.nodes.length-1] != end.nodes[end.nodes.length-1];
                  }
    };

    return action;
};
