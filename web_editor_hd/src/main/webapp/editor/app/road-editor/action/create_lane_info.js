/*
 * @Author: tao.w
 * @Date: 2020-02-16 11:34:01
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 15:40:32
 * @Description: 
 */
/**
 * 根据关联的NodeMaat或者TurnGuidance数据的id建立laneinfo关系
 */
iD.actions.CreateLaneInfo = function (context, sId,tags,datum) {
    return function (graph) {
        // var layers = iD.Layers;
        // var currentLayer = layers.getCurrentEnableLayer();
        var Members = [];
        var entity = graph.hasEntity(sId);
        var datatype = entity.modelName;
        var role ="",mtype="",type="",rtype="";
        if(!entity) return graph;
        if(datatype == iD.data.DataType.NODECONN){
            role = iD.data.RoleType.NODECONN_ID;
            mtype = iD.data.DataType.NODECONN;
            type = "1";
            rtype = iD.data.DataType.LANEINFO;
        }else if(datatype == iD.data.DataType.TURN_GUIDANCE){
            role = iD.data.RoleType.TURN_GUIDANCE_ID;
            mtype = iD.data.DataType.TURN_GUIDANCE;
            type = "2";
            //TODO需要判断TurnGuidance存在laneinfo还是laneinfoc里面
            /*if(datum){
                if(datum.tags.datatype==iD.data.DataType.NODEMAAT){
                    rtype = iD.data.DataType.LANEINFO;
                }else if(datum.tags.datatype==iD.data.DataType.CROSSMAAT){
                    rtype = iD.data.DataType.LANEINFOC;
                }
            }*/// 根据新规格所有行车引导线路径都存在laneinfo中
            rtype = iD.data.DataType.LANEINFO; //
        }else if(datatype == iD.data.DataType.C_NODECONN){
            role = iD.data.RoleType.C_NODECONN_ID;
            mtype = iD.data.DataType.C_NODECONN;
            type = "1";
            rtype = iD.data.DataType.C_LANEINFO;
        }

        Members = [{
            'id': sId,
            'role': role,
            'type': iD.data.GeomType.RELATION,
            'modelName':mtype
            // 'sequence': "0"
        }];
		// 融合作业系统不创建关系，所以可以直接通过模型名称获取图层（母库编辑时）
		var currentLayer = iD.Layers.getCurrentModelEnableLayer(rtype);
		var layid = currentLayer.id;
        var relation = iD.Relation({
            identifier:currentLayer.identifier,
            tags:iD.util.getDefauteTags(rtype, currentLayer),
            modelName:rtype,
            members: Members,
            layerId: layid
        });
		relation.tags.ARROW = tags.ARROW;
		relation.tags.LANE_NO = tags.LANE_NO;
        graph = graph.replace(relation);
        return graph;
    };

};