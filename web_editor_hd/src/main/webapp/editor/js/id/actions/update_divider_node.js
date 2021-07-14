/**
 * Created by wangtao on 2017/8/31.
 */
iD.actions.UpdateDividerNode = function(selectedIDs, context) {
    // var wayIds;
	// var typeDashs = [2, 9, 12, 14, 15, 16, 17];
	function typeDash(relation){
		// relation.tags.TYPE != 1 && relation.tags.TYPE != 3
		// if(_.include(typeDashs, +relation.tags.TYPE)){
		if(relation.tags.MAIN_AUX == '1' && ['2','3'].includes(relation.tags.MARK_TYPE)){
			return true;
		}
		return false;
	}

    var action = function(graph) {
        var dasheds = [], newNodes = [],entity;

        selectedIDs.forEach(d=>{
            let way = graph.entity(d);
            newNodes = action.splitWays(way);
            /*let relations = context.graph().parentRelations(way, iD.data.DataType.DIVIDER_ATTRIBUTE);
            relations.forEach(relation => {
                if(relation && typeDash(relation)){
                    dasheds.push(way);
                }
            })*/
        });
        
        newNodes.forEach(nodes=>{
            let preDashType = null,tags;
            let values = ['1','2'];
            
            nodes.forEach(nodeId=>{
                entity = context.entity(nodeId);

                if(entity.tags.DASHTYPE == '3'){
                    return false;
                }
                DASHTYPE = entity.tags.DASHTYPE + '';
                if (preDashType!=null && [preDashType, '0'].includes(DASHTYPE)) {
                    DASHTYPE =  _.difference(values,[preDashType])[0];
                    tags = Object.assign({}, entity.tags);
                    tags.DASHTYPE = DASHTYPE;
                    graph = (iD.actions.ChangeTags(nodeId, tags))(graph);
                }  
                if(['1','2'].includes(DASHTYPE)){
                    preDashType = DASHTYPE;
                }
                
            })

        })

        // newNodes.forEach(nodes=>{
        //     // let nodes = way.nodes;
        //     let startNode = context.entity(nodes[0]);
        //     var DASHTYPE = startNode.tags.DASHTYPE;
        //     var nextDASHTYPE = '-1';
        //     nodes.forEach((node,i)=>{
        //         let entity = context.entity(node);
        //         if(i!=0){
        //             // 中间点跳过
        //             if(entity.tags.DASHTYPE == '3'){
        //                 return false;
        //             }else {
        //                 if (nextDASHTYPE == '-1') {
        //                     DASHTYPE = entity.tags.DASHTYPE;
        //                     if (entity.tags.DASHTYPE == '1') {
        //                         nextDASHTYPE = '2';
        //                     } else if (entity.tags.DASHTYPE == '2') {
        //                         nextDASHTYPE = '1';
        //                     }
        //                 } else {
        //                     if (nextDASHTYPE > 0) {
        //                         if (i > 0) {//如果第一个点起点、终点
        //                             if (DASHTYPE == '2') {
        //                                 DASHTYPE = '1';
        //                             } else {
        //                                 DASHTYPE = '2';
        //                             }
        //                         } else {
        //                             DASHTYPE = nextDASHTYPE;
        //                         }
        //                         nextDASHTYPE = '-2';
        //                     } else {
        //                         if (DASHTYPE == '2') {
        //                             DASHTYPE = '1';
        //                         } else {
        //                             DASHTYPE = '2';
        //                         }
        //                     }
        //                 }

        //             }
        //             tags = Object.assign({}, entity.tags);
        //             tags.DASHTYPE = DASHTYPE;
        //             graph = (iD.actions.ChangeTags(node, tags))(graph);
        //         }else {
        //         	// 第一个点是中间点
        //         	if(DASHTYPE == '3'){
        //                 DASHTYPE = '1';
        //             } else if(DASHTYPE == '1' || DASHTYPE == '2'){
        //                 nextDASHTYPE = DASHTYPE;
        //             }
        //         }
        //     })
        // })

        return graph;
    };
    action.splitWays = function (way) {
        var nodeIndex = [];
        let relations = context.graph().parentRelations(way, iD.data.DataType.DIVIDER_ATTRIBUTE);
        relations.forEach(relation => {
            if(relation){
                if (typeDash(relation)) {
                    relation.members.forEach(function(member){
                        if(member.modelName == iD.data.DataType.DIVIDER_NODE){
                            nodeIndex.push({
                                index: _.indexOf(way.nodes, member.id),
                                isDashType: true
                            });
                        }
                    });
                } else {
                    relation.members.forEach(function(member){
                        if(member.modelName == iD.data.DataType.DIVIDER_NODE){
                            nodeIndex.push({
                                index: _.indexOf(way.nodes, member.id),
                                isDashType: false
                            });
                        }
                    });
                }
            }
        });
        //console.log("nodeIndex", _.sortBy(nodeIndex));
        var newNodes = [];
        //必须加入最后一个点来补充，否则最后一个DA无法渲染起终点
        nodeIndex.push({
                index: way.nodes.length,
                isDashType: false
            });
        nodeIndex = _.sortBy(_.uniq(nodeIndex), function(obj){return obj.index});
        if(nodeIndex.length == 1) {
            newNodes.push(way.nodes);
        } else {
            for (var i = 0; i < nodeIndex.length; i++) {
                var startIndex = nodeIndex[i];
                if (startIndex.isDashType) {
                    var endIndex = nodeIndex[i + 1];
                    if (endIndex) {
                        newNodes.push(action.getNodes(startIndex.index, endIndex.index, way));
                    }
                }
            }
        }
        return newNodes;
    }
    
    action.getNodes = function (startIndex, endIndex, way) {
        var nodes = way.nodes;
        var newNodes = [];
        for (var i = startIndex; i < endIndex; i++){
            var node = nodes[i];
            if (node) {
                newNodes.push(node);
            }
        }
        return newNodes;
    }

    action.disabled = function(graph) {
        var dasheds = [];
        selectedIDs.forEach(d=>{
            let way = graph.entity(d);
            let relations = context.graph().parentRelations(way, iD.data.DataType.DIVIDER_ATTRIBUTE);
            // console.log('d-====',relation)
            relations.forEach(relation => {
                if(relation && typeDash(relation)){
                    dasheds.push(way);
                }
            });
        })
        if(!dasheds.length){
            return 'not_divider';
        }
    };
    return action;
};
