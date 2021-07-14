/**
 * 图幅工具类
 */
MapSheet = {
	splitLine: function(xWays, graph, context){
	//只有导航图层才可以跨图幅分隔
    var editLayer = context.layers(xWays[0].layerId);
    var nodeDataType ;
    if(editLayer && editLayer.isRoad()){
    	nodeDataType = iD.data.Constant.ROADNODE;
    }else{
    	nodeDataType = iD.data.Constant.HIGHWAY;
    }
    if(xWays[0].tags.road_class == "roadcrossline"){
    	return graph;
    }
    xWays.forEach(function(way){
		if(!way.tags.mesh){
			graph = context.MeshDataStore.setWayMeshId(way, graph);
		}
	})

    // if(editLayer && !editLayer.isRoad() || xWays[0].tags.road_class == "roadcrossline"){
    // 	return graph;
    // }
//		var xWays = graph.parentWays(newNode); //当前是否与图幅相交的线段
	/**
	 * 分隔线段
	 * @param graph 当前graph
	 * @param pWay  被分隔的线段
	 * @param loc   分隔的点
	 * @return {
	 *       way: "分隔后的pWay线段",
	 *       graph:"当前graph",
	 * }
	 */
	var createLine = function(graph, pWay, loc){
		//创建相交点  由于需要将线分隔成两条线，且两条线的路口在同一坐标上，所以创建两个相同坐标的点
		//继承                  pWay       的图层属性
		var xNewNode1 = graph.extendNode(pWay, loc, {/*datatype: nodeDataType*/});
		xNewNode1.modelName = nodeDataType;
		graph = graph.replace(xNewNode1);
		/**
		var xNewNode2 = graph.extendNode(pWay, loc, {datatype: nodeDataType});
		graph = graph.replace(xNewNode2);*/
		
		//先添加交点到当前线段上
		pWay = pWay.addNode(xNewNode1.id, (pWay.nodes.length-1));
	    graph = graph.replace(pWay);
	    
	    //分隔线
	    //确定要分隔的位置
	    var nodeIndex = pWay.nodes.indexOf(xNewNode1.id);
	    var newNodeIds = pWay.nodes.slice(0,nodeIndex); //   ---<-----.[交点]-----newNodeIds----<----

	    //创建一条新线,因为分隔时会将当前线段newNodeIds部分删除,
	    // 因此用新线段替换它
	    var newWay = iD.Way();
	    newWay.layerId = pWay.layerId; //线的所属图层
	    newWay = newWay.mergeTags(pWay.tags); //继承当前tags属性
	    // newWay = newWay.mergeTags({src_id:""}); //母库ID为空
	    graph = graph.replace(newWay);
	    
	    //遍历当前要删除的点,并从当前线段中删除
	    _.uniq(newNodeIds).forEach(function(id){
	    	if(id != xNewNode1.id){
	    		pWay = pWay.removeNode(id);
	    		graph = graph.replace(pWay);
	    	}
	    });
	    //重新获取新增线，并绘制新线轨迹
	   newWay = graph.entity(newWay.id);       
	   _.uniq(newNodeIds).forEach(function(id){
	      newWay = newWay.addNode(id);
	   	  graph = graph.replace(newWay);
	   });
	   //将交点坐标的点添加到新线上
	   /**newWay = newWay.addNode(xNewNode2.id);*/
	   newWay = newWay.addNode(xNewNode1.id);
	   graph = graph.replace(newWay);	

	   //获取新增线，并算出其长度，如果长度很小,说明其两个段点距离很近，几乎就在同一点上，则删除 !
	   newWay = graph.entity(newWay.id);
	   //获取当前线段的首尾节点
	   var newWayFirstNode = graph.entity(newWay.first());
	   var newWayLastNode = graph.entity(newWay.last());
	   //求出线段的长度
	   var lon = iD.util.lassExtend.getDistance({
		   lon:newWayFirstNode.loc[0],
		   lat:newWayFirstNode.loc[1]
	   },{
		   lon:newWayLastNode.loc[0],
		   lat:newWayLastNode.loc[1]
	   });
	   //如果线段的长度小于0.5，则删除
	   //0.5这个长度在22级别下是无法看到，只能看到一个点
	   if(lon < 0.5){
		   //删除线的点，再删除线
		   _.uniq(newWay.nodes).forEach(function(id){
		    		var xNodez = graph.entity(id);
		    		graph = graph.remove(xNodez);
		    });
		   //删除线
		   graph = graph.remove(newWay);
	   }
	   
	   //设置图所属图幅编辑
	    graph = context.MeshDataStore.setWayMeshId(pWay, graph);
	    //设置图所属图幅编辑
	    graph = context.MeshDataStore.setWayMeshId(newWay, graph);
	    
	   return {way:pWay, graph:graph, newWay: newWay};
	}	
/**
 * 坐标数组冒泡排序
 * @param flag 排序方式 desc/asc
 * @param points  [[x,y],[x,y]]
 */	
	var sortPoints = function(points, flag){
		var temp;
		for(var i =0; i<points.length; i++){
			var point = points[i];
			var pointModel = point[0] + point[1]; 
			for(var j = 0; j<points.length; j++){
				var point2 = points[j];
				var pointModel2 = point2[0] + point2[1]; 
				var boo = eval("pointModel "+((flag == "desc") ? "<" : ">")+" pointModel2");
				if(boo){
					temp = points[j];
					points[j] = points[i];
					points[i] = temp;
				}
			}
		}
		return points;
	};
/**
 * 获取图幅边线与线段的交点
 * @param rectSide 图幅边线
 * @param SegmentB 线段B
 * @return 线段B与图幅边线的交点数组
 */
	var getFocusPoints = function(rectSide, SegmentB){
		var focusPoint = [];
		for(var i = 0; i<rectSide.length; i++){
			var side = rectSide[i];
			var loc = iD.util.lassExtend.SegmentIntersect(side, SegmentB);
			
			//当前线段与图幅相交!!!
			if(loc && loc!=3 && loc.length){
				//排重,再一次过虑图幅共用边线,如果 是共用边线只校验一次
				var hasFocusP = false;
				for(var p = 0; p<focusPoint.length; p++){
					var focusPointP = focusPoint[p];
					var focusPointLoc = loc;
					if( focusPointP.join("#").indexOf(focusPointLoc.join("#")) != -1){
						//存在相同交点的边线，跳出循环，即线段坐标重复
						hasFocusP = true;
						break;
					}
				}
				//将交点缓存,相同交点即为图幅矩形 公共边
				if(!hasFocusP){
					focusPoint.push(loc);
				}else{
					continue;//存在相同交点的边线，跳出循环，即线段坐标重复
				}
			}
		}
		return focusPoint;
	};
		for(var ii = 0; ii<xWays.length; ii++){
					var pWay = xWays[ii];
			        //两点确定一条线段 判断线段是否与图幅边界相交
					var preNodeId = pWay.preLastNode();
					var lasNodeId = pWay.last();
					
					if(preNodeId && lasNodeId){
						var preNode = graph.entity(preNodeId);
						var lastNode = graph.entity(lasNodeId);
						
						//获取线点的起点和结束点判断线段的方向
						var preNodeLoc = preNode.loc;
						var lastNodeLoc = lastNode.loc;
						var sumPreNodeLoc = preNodeLoc[0] + preNodeLoc[1];
						var sumLastNodeLoc = lastNodeLoc[0] + lastNodeLoc[1];
						var order = "asc";
						if(sumPreNodeLoc < sumLastNodeLoc){
							order = "desc";
						}
						
						//获取当前线段经过的图幅
						var rectSide = context.MeshDataStore.getRectCoords();
						// 线段起点与结束点经纬度数组
	//            						SegmentB 线段二 [x1, y1, x2, y2]
						//当前线段经纬度数组
						var SegmentB = preNode.loc.concat(lastNode.loc);  
						
						//循环所有图幅边线，判断是否与当前线段相交，并获取交点
						var focusPoint = []; //防止重复,存储每一个交点
						//获取线段与图幅边线的交点
						focusPoint = getFocusPoints(rectSide, SegmentB);
						//将交点坐标相加之和   从大到小   或   从小到大   排序
						sortPoints(focusPoint,order);
						//循环所有交点，并添加到线上
						var tempPway = pWay;
						
						for(var n = 0; (n<focusPoint.length && n<2); n++){
							var xloc = focusPoint[n];
							var cR = createLine(graph, tempPway, xloc);
							tempPway = cR.way;//如果有多个交点，则对分隔后的线继续分隔
							graph = cR.graph;
						}
					}            			
		}//for ending

		return graph;
	}
}


MapSheet = {
	splitLine: function(xWays, graph, context, nEntities) {
		return graph;
		//只有导航图层才可以跨图幅分隔
		var editLayer = context.layers(xWays[0].layerId);
		var nodeDataType ;
		if(editLayer && editLayer.isRoad()){
			nodeDataType = iD.data.Constant.ROADNODE;
		}else{
			nodeDataType = iD.data.Constant.HIGHWAY;
		}
		if(xWays[0].tags.road_class == "roadcrossline"){
			return graph;
		}
		//xWays.forEach(function(way){
		//	if(!way.tags.mesh){
		//		graph = context.MeshDataStore.setWayMeshId(way, graph);
		//	}
		//})

		/**
		 * 分隔线段
		 * @param graph 当前graph
		 * @param pWay  被分隔的线段
		 * @param loc   分隔的点
		 * @return {
		 *       way: "分隔后的pWay线段",
		 *       graph:"当前graph",
		 * }
		 */
		var createLine = function(graph, pWay, loc) {
			//创建相交点  由于需要将线分隔成两条线，且两条线的路口在同一坐标上，所以创建两个相同坐标的点
			//继承                  pWay       的图层属性
			var xNewNode1 = graph.extendNode(pWay, loc, {/*datatype: nodeDataType*/});
			xNewNode1.modelName = nodeDataType;
			graph = graph.replace(xNewNode1);
			/**
			var xNewNode2 = graph.extendNode(pWay, loc, {datatype: nodeDataType});
			graph = graph.replace(xNewNode2);*/
			
			//先添加交点到当前线段上
			pWay = pWay.addNode(xNewNode1.id, (pWay.nodes.length-1));
			graph = graph.replace(pWay);
			
			//分隔线
			//确定要分隔的位置
			var nodeIndex = pWay.nodes.indexOf(xNewNode1.id);
			var newNodeIds = pWay.nodes.slice(0,nodeIndex); //   ---<-----.[交点]-----newNodeIds----<----

			//创建一条新线,因为分隔时会将当前线段newNodeIds部分删除,
			// 因此用新线段替换它
			var newWay = iD.Way();
			newWay.layerId = pWay.layerId; //线的所属图层
			pWay.new_id_inherit && (newWay.new_id_inherit = pWay.new_id_inherit);
			newWay = newWay.mergeTags(pWay.tags); //继承当前tags属性
			// newWay = newWay.mergeTags({src_id:""}); //母库ID为空
			graph = graph.replace(newWay);
			
			//遍历当前要删除的点,并从当前线段中删除
			_.uniq(newNodeIds).forEach(function(id){
				if(id != xNewNode1.id){
					pWay = pWay.removeNode(id);
					graph = graph.replace(pWay);
				}
			});
			//重新获取新增线，并绘制新线轨迹
		   newWay = graph.entity(newWay.id);       
		   _.uniq(newNodeIds).forEach(function(id){
			  newWay = newWay.addNode(id);
			  graph = graph.replace(newWay);
		   });
		   //将交点坐标的点添加到新线上
		   /**newWay = newWay.addNode(xNewNode2.id);*/
		   newWay = newWay.addNode(xNewNode1.id);
		   graph = graph.replace(newWay);	

		   //获取新增线，并算出其长度，如果长度很小,说明其两个段点距离很近，几乎就在同一点上，则删除 !
		   newWay = graph.entity(newWay.id);
		   //获取当前线段的首尾节点
		   var newWayFirstNode = graph.entity(newWay.first());
		   var newWayLastNode = graph.entity(newWay.last());
		   //求出线段的长度
		   var lon = iD.util.lassExtend.getDistance({
			   lon:newWayFirstNode.loc[0],
			   lat:newWayFirstNode.loc[1]
		   },{
			   lon:newWayLastNode.loc[0],
			   lat:newWayLastNode.loc[1]
		   });
		   //如果线段的长度小于0.5，则删除
		   //0.5这个长度在22级别下是无法看到，只能看到一个点
		   if(lon < 0.5){
			   //删除线的点，再删除线
			   _.uniq(newWay.nodes).forEach(function(id){
						var xNodez = graph.entity(id);
						graph = graph.remove(xNodez);
				});
			   //删除线
			   graph = graph.remove(newWay);
		   }
		   
		   //设置图所属图幅编辑
			graph = context.MeshDataStore.setWayMeshId(pWay, graph);
			//设置图所属图幅编辑
			graph = context.MeshDataStore.setWayMeshId(newWay, graph);
			
		   return {way:pWay, graph:graph, newWay: (lon < 0.5 ? undefined : newWay), xNewNode1: xNewNode1};
		}

        /**
         * 重写图幅边界道路的打断操作
         * 分隔线段
         * @param graph 当前graph
         * @param pWay  被分隔的线段
         * @param loc   分隔的点
         * @return {
		 *       way: "分隔后的pWay线段",
		 *       graph:"当前graph",
		 * }
         */
        var createLineByFunc = function(graph, pWay, loc) {
            //创建相交点  由于需要将线分隔成两条线，且两条线的路口在同一坐标上，所以创建两个相同坐标的点
            //继承                  pWay       的图层属性
            var fNode = graph.entity(pWay.first());
            var tNode = graph.entity(pWay.last());
            var mesh1 = MapSheet.getMeshCodeArr(fNode, context);
            var mesh2 = MapSheet.getMeshCodeArr(tNode, context);
            var xNewNode1 = graph.extendNode(pWay, loc, {/*datatype: nodeDataType*/});
            xNewNode1.modelName = nodeDataType;
            if(mesh1.length>0){
                xNewNode1 = xNewNode1.mergeTags({mesh: mesh1[0]});
            }
            if(mesh2.length>0){
                xNewNode1 = xNewNode1.mergeTags({mesh_2: mesh2[0]});
            }
            xNewNode1 = xNewNode1.mergeTags({boundary:"20"});
            xNewNode1 = xNewNode1.mergeTags({realnode: "0"});
            graph = graph.replace(xNewNode1);
            //context.replace(iD.actions.AddEntity(xNewNode1));

                //先添加交点到当前线段上
            pWay = pWay.addNode(xNewNode1.id, (pWay.nodes.length-1));
            //graph = graph.replace(pWay);
            //context.replace(iD.actions.AddEntity(pWay));



            var nodeIndex = pWay.nodes.indexOf(xNewNode1.id);
            var newNodeIds = pWay.nodes.slice(nodeIndex);
            var newWay = iD.Way({
                layerId : pWay.layerId,
                nodes : [],
                tags : pWay.tags
            });
            //母库ID为空
            // newWay = newWay.mergeTags({src_id: ""});
            graph = graph.replace(newWay);


            var newWayId;
            var wayA = pWay.update({id: newWayId});
            _.uniq(newNodeIds).forEach(function (id) {
                if (id != xNewNode1.id) {
                    wayA = wayA.removeNode(id);
                    graph = graph.replace(wayA);
                }
            });
            graph = graph.replace(wayA);


            newWay = graph.entity(newWay.id);
            _.uniq(newNodeIds).forEach(function (id) {
                newWay = newWay.addNode(id);
                graph = graph.replace(newWay);
            });

            var isRoad = iD.Layers.getLayer(wayA.layerId).isRoad();

            if (isRoad&&!(pWay.isNew())) {
                wayA.new_id_inherit = iD.Entity.id.toOSM(pWay.id) + '-';
                newWay.new_id_inherit = iD.Entity.id.toOSM(pWay.id) + '-';
            } else if (isRoad&&pWay.new_id_inherit) {
                wayA.new_id_inherit = pWay.new_id_inherit;
                newWay.new_id_inherit = pWay.new_id_inherit;
            }


            //道路长度属性更新
            wayA = iD.util.tagExtend.updateWayLengthTag(graph,wayA);
            newWay = iD.util.tagExtend.updateWayLengthTag(graph,newWay);
            graph=graph.replace(wayA);
            graph=graph.replace(newWay);

            ////拓补维护
            //var handle = iD.topo.handle();
            //graph = handle.break(context,graph, pWay, wayA, newWay, xNewNode1);
            //graph = iD.actions.DeleteWay(pWay.id)(graph);

            var fNode = pWay.nodes[0];
            var tNode = pWay.nodes[pWay.nodes.length-1];
            var topoEntity = iD.TopoEntity();
            var crossNodeIdA = topoEntity.isInCrossNode(graph, fNode);
            var crossNodeIdB = topoEntity.isInCrossNode(graph, tNode);
            if(crossNodeIdA!=false&&crossNodeIdA==crossNodeIdB){
                graph=iD.actions.RoadCrossModify([crossNodeIdA,xNewNode1.id])(graph);
            }


            //获取新增线，并算出其长度，如果长度很小,说明其两个段点距离很近，几乎就在同一点上，则删除 !
            //获取当前线段的首尾节点
            var newWayFirstNode = graph.entity(newWay.first());
            var newWayLastNode = graph.entity(newWay.last());
            //求出线段的长度
            var lon = iD.util.lassExtend.getDistance({
                lon:newWayFirstNode.loc[0],
                lat:newWayFirstNode.loc[1]
            },{
                lon:newWayLastNode.loc[0],
                lat:newWayLastNode.loc[1]
            });
            //如果线段的长度小于0.5，则删除
            //0.5这个长度在22级别下是无法看到，只能看到一个点
            //if(lon < 5){
            //    //删除线的点，再删除线
            //    //_.uniq(newWay.nodes).forEach(function(id){
            //    //    var xNodez = graph.entity(id);
            //    //    graph = graph.remove(xNodez);
            //    //});
            //    //删除线
            //    graph = graph.remove(newWay);
            //}

            //设置图所属图幅编辑
            //graph = context.MeshDataStore.setWayMeshId(wayA, graph);
            //设置图所属图幅编辑
            //graph = context.MeshDataStore.setWayMeshId(newWay, graph);

            return {way:wayA, graph:graph, newWay: newWay, xNewNode1: xNewNode1};
            //return {way:wayA, graph:graph, newWay: (lon < 5 ? undefined : newWay), xNewNode1: xNewNode1};
        }


        /**
		 * 坐标数组冒泡排序
		 * @param flag 排序方式 desc/asc
		 * @param points  [[x,y],[x,y]]
		 */	
		var sortPoints = function(points, flag) {
			var temp;
			for(var i =0; i<points.length; i++){
				var point = points[i];
				var pointModel = point[0] + point[1]; 
				for(var j = 0; j<points.length; j++){
					var point2 = points[j];
					var pointModel2 = point2[0] + point2[1]; 
					var boo = eval("pointModel "+((flag == "desc") ? "<" : ">")+" pointModel2");
					if(boo){
						temp = points[j];
						points[j] = points[i];
						points[i] = temp;
					}
				}
			}
			return points;
		};
		
		for(var ii = 0; ii<xWays.length; ii++){
			var pWay = xWays[ii];
			//两点确定一条线段 判断线段是否与图幅边界相交
			var preNodeId = pWay.preLastNode();
			var lasNodeId = pWay.last();
			
			if(preNodeId && lasNodeId){
				var preNode = graph.entity(preNodeId);
				var lastNode = graph.entity(lasNodeId);
				
				//获取线点的起点和结束点判断线段的方向
				var preNodeLoc = preNode.loc;
				var lastNodeLoc = lastNode.loc;
				var sumPreNodeLoc = preNodeLoc[0] + preNodeLoc[1];
				var sumLastNodeLoc = lastNodeLoc[0] + lastNodeLoc[1];
				var order = "asc";
				if(sumPreNodeLoc < sumLastNodeLoc){
					order = "desc";
				}
				
				//获取当前线段经过的图幅
				var rectSide = context.MeshDataStore.getRectCoords();
				// 线段起点与结束点经纬度数组
	//            						SegmentB 线段二 [x1, y1, x2, y2]
				//当前线段经纬度数组
				var SegmentB = preNode.loc.concat(lastNode.loc);  
				
				//循环所有图幅边线，判断是否与当前线段相交，并获取交点
				var focusPoint = []; //防止重复,存储每一个交点
				//获取线段与图幅边线的交点
				focusPoint = this.getFocusPoints(rectSide, SegmentB);
				//将交点坐标相加之和   从大到小   或   从小到大   排序
				sortPoints(focusPoint,order);
				//循环所有交点，并添加到线上
				var tempPway = pWay;
                //线段的首尾结点之一在图幅边框上,那么对该线段不进行打断处理
                if((preNode.tags.boundary&&preNode.tags.boundary=="20")||(lastNode.tags.boundary&&lastNode.tags.boundary=="20")){
                    nEntities.nWays.push(pWay);
                    continue;
                }

                var fNode = iD.util.tagExtend.updateNodeMeshTag(preNode,context);
                var tNode = iD.util.tagExtend.updateNodeMeshTag(lastNode,context);
                if((fNode.tags.boundary&&fNode.tags.boundary=="20")||(tNode.tags.boundary&&tNode.tags.boundary=="20")){
                    nEntities.nWays.push(pWay);
                    continue;
                }

                if(focusPoint.length==0){
                    nEntities.nWays.push(pWay);
                }
                if(focusPoint.length>0){
				//for(var n = 0; (n<focusPoint.length && n<2); n++){
					var xloc = focusPoint[0];
                    //if((xloc[0].toFixed(6)==preNode.loc[0].toFixed(6)&&xloc[1].toFixed(6)==preNode.loc[1].toFixed(6))||(xloc[0].toFixed(6)==lastNode.loc[0].toFixed(6)&&xloc[1].toFixed(6)==lastNode.loc[1].toFixed(6))){
                    //    nEntities.nWays.push(pWay);
                    //    continue;
                    //}
					var cR = createLineByFunc(graph, pWay, xloc);
					//var cR = createLineByFunc(graph, tempPway, xloc);
					//tempPway = cR.way;//如果有多个交点，则对分隔后的线继续分隔
					graph = cR.graph;
                    //	cR.newWay && (nEntities.nWays.push(cR.newWay)); nEntities.nNodes.push(cR.xNewNode1);
                    (nEntities.deleteWays.push(pWay))&&(nEntities.nWays.push(cR.way)); nEntities.nNodes.push(cR.xNewNode1);
                    if(cR.newWay!=undefined){
                        nEntities.nWays.push(cR.newWay);
                    }
				//}
                }
				//nEntities.nWays.push(graph.entity(pWay.id));
			}            			
		}//for ending

		return graph;
	},
	
	/**
	 * 获取图幅边线与线段的交点
	 * @param rectSide 图幅边线
	 * @param SegmentB 线段B
	 * @return 线段B与图幅边线的交点数组
	 */
	getFocusPoints: function(rectSide, SegmentB, context) {
		var rectSide = rectSide || context.MeshDataStore.getRectCoords();
		var focusPoint = [];
		for(var i = 0; i<rectSide.length; i++){
			var side = rectSide[i];
			var loc = iD.util.lassExtend.SegmentIntersect(side, SegmentB);
			
			//当前线段与图幅相交!!!
			if(loc && loc!=3 && loc.length){
				//排重,再一次过虑图幅共用边线,如果 是共用边线只校验一次
				var hasFocusP = false;
				for(var p = 0; p<focusPoint.length; p++){
					var focusPointP = focusPoint[p];
					var focusPointLoc = loc;
					if( focusPointP.join("#").indexOf(focusPointLoc.join("#")) != -1){
						//存在相同交点的边线，跳出循环，即线段坐标重复
						hasFocusP = true;
						break;
					}
				}
				//将交点缓存,相同交点即为图幅矩形 公共边
				if(!hasFocusP){
					focusPoint.push(loc);
				}else{
					continue;//存在相同交点的边线，跳出循环，即线段坐标重复
				}
			}
		}
		return focusPoint;
	},
	
	isPointOnRectSide: function (point, context) {
		var rectSide = context.MeshDataStore.getRectCoords();
		var focusPoint = [];
		for(var i = 0; i < rectSide.length;i++){
			var side = rectSide[i];
			var res = iD.util.pt2LineDist([[side[0], side[1]], [side[2], side[3]]], point);
			var lon = iD.util.lassExtend.getDistance({lon:point[0], lat:point[1]},{lon:res.x, lat:res.y});
			if (lon < 0.5) return true;
		}
		return false;
	},
    getMeshCode:function(node,context)
    {
        if(!context.MeshDataStore.way||context.MeshDataStore.way.length<1)
        {
            Dialog.alert("数据服务(KDS)未返回图幅线");
            console.error("未找到图幅线数据");
            return;
        }
        var meshs = context.MeshDataStore.way;
        for(var i=0;i<meshs.length;i++)
        {


/*            for(var j=0;j<meshs[i].nodes.length;j++)
            {
               if(!context.graph().hasEntity(meshs[i].nodes[j]))
                {
                    Dialog.alert("未找到图幅线关联的节点");
                    break;
                }
            }*/
            var polyarea=[];
            var flag=false;
            for(var j=0;j<meshs[i].nodes.length;j++)
            {
                if(!context.graph().hasEntity(meshs[i].nodes[j]))
                {
                   //Dialog.alert("未找到图幅线关联的节点");
                   console.info("未找到图幅线关联的节点");
                   flag=true;
                   break;
                }
                var entity=context.graph().entity(meshs[i].nodes[j]);
                polyarea.push(entity.loc);
            }
            if(flag)
            {
                continue;
            }
            if(iD.geo.pointInPolygon(node.loc,polyarea))
            {
                return meshs[i].tags.mesh;
            }
        }
        console.error("未找到包含节点"+node.id+"图幅数据");
        return;
    },
    getMeshCodeArr:function(node,context)
    {
        var meshsArr = [];
        if(!context.MeshDataStore.way||context.MeshDataStore.way.length<1)
        {
            Dialog.alert("数据服务(KDS)未返回图幅线");
            console.error("未找到图幅线数据");
            return meshsArr;
        }
        var meshs = context.MeshDataStore.way;
        for(var i=0;i<meshs.length;i++)
        {
            var polyarea=[];
            var flag=false;
            for(var j=0;j<meshs[i].nodes.length;j++)
            {
                if(!context.graph().hasEntity(meshs[i].nodes[j]))
                {
                    //Dialog.alert("未找到图幅线关联的节点");
                    console.info("未找到图幅线关联的节点");
                    flag=true;
                    break;
                }
                var entity=context.graph().entity(meshs[i].nodes[j]);
                //polyarea.push(entity.loc);
                polyarea.push(entity);
            }
            if(flag)
            {
                continue;
            }
            //var mesh = meshs[i];
            //var mNodes = mesh.nodes;
            //
            ////图幅点ID
            //var p1 = mNodes[0];
            //var p2 = mNodes[1];
            //var p3 = mNodes[2];
            //var p4 = mNodes[3];
            //
            ////点对象
            //var pp1 = context.graph().entity(p1);
            //var pp2 = context.graph().entity(p2);
            //var pp3 = context.graph().entity(p3);
            //var pp4 = context.graph().entity(p4);
            //
            ////获取最大坐标和最小坐标
            //var ppMinX = Math.min(pp1.loc[0], pp2.loc[0], pp3.loc[0], pp4.loc[0]);
            //var ppMaxX = Math.max(pp1.loc[0], pp2.loc[0], pp3.loc[0], pp4.loc[0]);
            //var ppMinY = Math.min(pp1.loc[1], pp2.loc[1], pp3.loc[1], pp4.loc[1]);
            //var ppMaxY = Math.max(pp1.loc[1], pp2.loc[1], pp3.loc[1], pp4.loc[1]);
            //
            ////图幅矩形 西南脚点、东北脚点
            //var meshcoord = [[ppMinX, ppMinY], [ppMaxX, ppMaxY]];
            //
            //var pXY = {
            //    lng: node.loc[0],
            //    lat: node.loc[1]
            //};
            ////校验线是否在图幅矩形内
            //var r = iD.util.lassExtend.isPointInRect(pXY, meshcoord);
            //
            //if(r){
            //    meshsArr.push(meshs[i].tags.mesh);
            //}
            var polygon={nodes:polyarea};
            if(iD.util.isPointInPolygon(node,polygon))
            {
                meshsArr.push(meshs[i].tags.mesh);
                //return meshs[i].tags.mesh;
            }
            //if(iD.geo.pointInPolygon(node.loc,polyarea))
            //{
            //    meshsArr.push(meshs[i].tags.mesh);
            //    //return meshs[i].tags.mesh;
            //}
        }
        if(meshsArr.length ==0)
            console.error("未找到包含节点"+node.id+"图幅数据");

        //数组去重
        function unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        return unique(meshsArr);
        //return;
    }
}