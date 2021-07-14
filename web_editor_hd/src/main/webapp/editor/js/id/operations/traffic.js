iD.operations.Traffic = function(selectionIDs,context){
    var selectId = selectionIDs[0];

    var _this = {};
    _this.disable = false;//控制当前按钮是否可用
    
    var operation = function(){

        context.transportation.set(selectId);

        context.enter(iD.modes.Select(context, selectionIDs));
    };

	
    operation.available = function(){
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        var entity = context.entity(selectId);
        if(entity.modelName!=iD.data.DataType.ROAD) return false;
        var editable;
        var layer;
        var geometry = context.geometry(selectId);
        // if(d3.select("body").attr("role") =="check"){
        //     editable = true;
        // }else if(d3.select("body").attr("role") =="work"){
        //     if(iD.Static.layersInfo.isEditable(iD.data.DataType.WALKLINK)){
        //         editable = true;
        //         return editable&&geometry == "line" && entity.layerId == layer.id;
        //     }
        //     editable = iD.Static.layersInfo.isEditable(entity?entity.modelName:false);
        // }
        var editable = d3.select("body").attr("role") =="check"||iD.Layers.getLayer(entity.layerId, entity.modelName).editable;
    	if(selectionIDs.length != 1){
    		return  false;
    	}
    	layer = iD.Layers.getLayer(entity.layerId);
    	var isRoadLayer = false;
       if(!layer){
       	   return false;
       }else{
       	 isRoadLayer = layer.isRoad ? layer.isRoad() : false;
       }
       if(!isRoadLayer){
       	return editable&&isRoadLayer && !operation.disabled();
       }



       
       //首位挂接同一个复杂路口的道路”交通规则工具箱应显示为灰色
       if(entity instanceof iD.Way){
    	   var way = entity;
    	   var w_nodes = way.nodes, 
    	   len = w_nodes.length, 
    	   // w_tags = way.tags,
    	   // n_cross_node = context.graph().entity(w_nodes[0]).tags.cross_node;
    	   n_cross_node = context.graph().parentRelations(context.graph().entity(w_nodes[0]),iD.data.DataType.C_NODECONN),
    	   e_cross_node = context.graph().parentRelations(context.graph().entity(w_nodes[len - 1]),iD.data.DataType.C_NODECONN);
    	   if (!_.isEmpty(n_cross_node) && !_.isEmpty(e_cross_node) && n_cross_node.id === e_cross_node.id) {
    		   _this.disable = true;
    		   //return false;
    	   }
       }
       
       if(context.isOneRoadCrossWay(entity)){
            //如果是虚拟线，当前按钮不可见
            return false;
        }
        
       return editable && geometry == "line" && !operation.disabled();

    };

    operation.disabled = function(){
    	return _this.disable;
    };

    operation.tooltip = function() {
        return t('operations.traffic.description');
    };

    operation.id = 'traffic';
    operation.keys = [t('operations.traffic.key')];
    operation.title = t('operations.traffic.title');

    return operation;
}