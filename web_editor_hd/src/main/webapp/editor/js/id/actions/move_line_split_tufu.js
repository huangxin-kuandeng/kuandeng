/**
 * 移动导航线上的点/整条线，线跨图幅边界时，对线进行分隔
 * @param context
 * @param entity  将要被 分隔线上的一点
 */
iD.actions.MoveLineSplitTuFu = function(context, entity) {
	var xWays = [];
	/**
	 * 对坐标数组排序
	 */
	function queuePoints(points, flag){
		//对中间节点排序
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
	}
	/**
	 * 将线上的点，按点的路口类型进行拆分，生成多条线段数组
	 */
	function splitLineByRoadNode(xNodes){
	    var fLines = [];
	    var fLineNodes = [];
	    var fCount = 0;
	    for(var f = 0 ; f<xNodes.length; f++){
	    	var vNode = xNodes[f];
	    	if(vNode.modelName == "RoadNode"){
	    		fCount+=1;
	    	}
	    	if(fCount<=2){
	    		//两个路口点组成一条线段
	    		fLineNodes.push(vNode);
	    	}
	    	if(fCount==2){
	    		f-=1;
	    		fCount = 0;
	    		if(fLineNodes.length == 2){
	    			var s1 = eval(fLineNodes[0].loc.join("+")), s2 = eval(fLineNodes[1].loc.join("+"));
	    			if(parseFloat(s1.toFixed(11)) == parseFloat(s2.toFixed(11))){
	    				//线段太短
	    				continue;//阻止存储当前线段
	    			}
	    		}
	    		fLines.push(fLineNodes);
	    		fLineNodes = [];//清空临时 线段点数组
	    	}
	    }		
		return fLines;
	}
	/**
	 * 小于指定长度的线段删除 
	 */
	function deleteLittleLine(graph, newWay, len){
		var firstNode = graph.entity(newWay.first());
	    var lastNode = graph.entity(newWay.last());
	    var removeIds = [];
	    var lon = iD.util.lassExtend.getDistance({
			   lon:firstNode.loc[0],
			   lat:firstNode.loc[1]
		   },{
			   lon:lastNode.loc[0],
			   lat:lastNode.loc[1]
		   });
	    //如果线段的长度小于0.5，则删除
	   //0.5这个长度在22级别下是无法看到，只能看到一个点
	   if(lon < len || isNaN(lon)){
		   //删除线的点，再删除线
		   _.uniq(newWay.nodes).forEach(function(id){
		    		//删除线上的点
		    		newWay = newWay.removeNode(id);
    	    		graph = graph.replace(newWay);
    	    		//删除点
    	    		removeIds.push(id);//记录删除的点
		    		var xNodez = graph.entity(id);
		    		graph = graph.remove(xNodez);
		    });
		   //删除线
		   graph = graph.remove(newWay);
	   }
	   return {graph:graph, removeIds:removeIds};
	}
	
    return function(graph) {
    	//只有导航图层才可以跨图幅分隔
        var editLayer = context.layers(entity.layerId);
         
        if(editLayer && !editLayer.split){
            return graph;
        }
        if(editLayer && editLayer.isRoad()){
        nodeDataType = iD.data.Constant.ROADNODE;
    }else{
        nodeDataType = iD.data.Constant.HIGHWAY;
    }
        // if(editLayer && !editLayer.isRoad()){
        // 	return graph;
        // }
        //复杂路口 关系线不进行分隔
//        if(editLayer && !editLayer.isNavRoad() 
//        		|| entity.tags.road_class == "roadcrossline" 
//        			|| entity.modelName == iD.data.Constant.C_NODE){
//        	return graph;
//        }
        //判断对象类型
    	if(entity instanceof iD.Way){
    		xWays.push(entity);
    		//移动线的端点为路口则获取路口关联的所有线
    		var othFLineId = entity.first();
    		var othLLineId = entity.last();
    		var othFLine = graph.entity(othFLineId);
    		var othLLine = graph.entity(othLLineId);
    		//获取路口关联线
    		var othFLines = graph.parentWays(othFLine);
    		var othLLines = graph.parentWays(othLLine);
    		//连接两个线段数组
    		var othAllLines = othFLines.concat(othLLines);
    		var newOthlines = [];
    		for(var s = 0; s<othAllLines.length; s++){
    			//过虑掉当前选择的线段
    			if(othAllLines[s].id != entity.id){
    				newOthlines.push(othAllLines[s]);
    			}
    		}
    		//将所有线段添加的指定数组中
    		xWays = xWays.concat(newOthlines);
    	}else if(entity instanceof iD.Node){
    		xWays = graph.parentWays(entity);
    	}
    	
    	//过虑掉到复杂路口关联线
//    	var txWays = [];
//    	for(var ps = 0; ps < xWays.length; ps++){
//    		if(xWays[ps].tags.road_class == "roadcrossline" 
//    			|| xWays[ps].modelName == iD.data.Constant.C_NODE){
//    			console.log(xWays[ps].tags.road_class)
//    			continue;
//    		}else{
//    			txWays.push(xWays[ps]);
//    		}
//    	}
//    	xWays = txWays;//去掉了复杂路口关联线
    	
    	for(var m = 0; m<xWays.length; m++){
    		var focusPoints = [];
    		var xWay = xWays[m];
    		var xNodeIds = xWay.nodes;
    		//获取首尾节点
    		var firstNodeId = xWay.first();
    		var lastNodeId = xWay.last();
    		var firstNode = graph.entity(firstNodeId);
    		var lastNode = graph.entity(lastNodeId);
    		
    		var sides = context.MeshDataStore.getRectCoords();//获取当前线段经过的图幅
    		loopSides: for(var j = 0; j<sides.length; j++){ //循环所有边线
    			var side = sides[j];
    			for(var i = 0; i<xNodeIds.length; i++){ 
    				//循环当前线上所有点，两个点组成一条线段，与边线进行比较 ，看是否有交点,有交点则对当前线进行分隔
    				if((i+1)>=xNodeIds.length){
    					break;
    				}
    				var xNode1 = graph.entity(xNodeIds[i]);
    				var xNode2 = graph.entity(xNodeIds[(i+1)]);
    				var SegmentB = xNode1.loc.concat(xNode2.loc);
    				var loc = iD.util.lassExtend.SegmentIntersect(side, SegmentB);
    				
    				
    				//当前线段与图幅相交!!!
    				if(loc && loc!=3 && loc.length){
    					//关系线夸图幅删除
    					if(xWay.tags.road_class == "roadcrossline" || xWay._type == 'roadcrossline'){
    		        			graph = graph.remove(xWay);
    		        			break loopSides;
    		        	}
//    					loc = [parseFloat(loc[0].toFixed(12)), parseFloat(loc[1].toFixed(12))];//精度减小

    					//排重,再一次过虑图幅共用边线,如果 是共用边线只校验一次
    					var hasFocusP = false;
    					for(var p = 0; p<focusPoints.length; p++){
    						var focusPointP = focusPoints[p].value;
    						if(focusPointP.join("#").indexOf(loc.join("#")) != -1){
    							//存在相同交点的边线，跳出循环，即线段坐标重复
    							hasFocusP = true;
    							break;
    						}
    					}
    					//将交点缓存,相同交点即为图幅矩形 公共边
    					var fouceValueP = 0.000001;//允许交点与线段的端点差的最小值
    					if(!hasFocusP){
//    						存放将要分隔的位置和点的坐标
    						var s0 = eval(xNode1.loc.join("+"));
    						var s1 = eval(xNode2.loc.join("+"));
							var s2 = eval(loc.join("+"));
							var isSmallVal = ((Math.abs(s0-s2)<fouceValueP) || (Math.abs(s1-s2)<fouceValueP));
    						var fpIndex = false;
    						if(isSmallVal)continue;//如果交点与端点距离很小，视为重叠，不计入交点集合
    						for(var t = 0; t<focusPoints.length; t++){
    							var fPoint = focusPoints[t];
    							if(fPoint.key == xNode1.id){
    								fpIndex = true;
    								var tempFPs = focusPoints[t].value;
    								//排重
    								var xtfp = false;
    								for(var e = 0; e<tempFPs.length; e++){
    									var tfp = tempFPs[e];
    									if(tfp.join("#").indexOf(loc.join("#")) != -1){
    										xtfp = true;
    										break;
    									}
    								}
//    								console.log(Math.abs(s0-s2),Math.abs(s1-s2));
    								//若交点与线段的端点差值很小，则看做与端点重合，不计入交点集合中
    								if(!xtfp && s1 != s2 && s0 != s2 && !isSmallVal){
    									focusPoints[t].value.push(loc);//在同一段上有多个交点
    								}
    							}
    						}
    						if(!fpIndex){
    							var nd1 = xNode1.loc[0] + xNode1.loc[1];
    							var nd2 = xNode2.loc[0] + xNode2.loc[1];
    							//记录线方向,供多个交点排序用
    							var xOrderBy = "desc";
    							if(nd1<nd2){
    								xOrderBy = "asc";
    							}
//    							console.log(Math.abs(s0-s2),Math.abs(s1-s2));
    							//若交点与线段的端点差值很小，则看做与端点重合，不计入交点集合中
    							if(s1 != s2 && s0 != s2 && !isSmallVal){
    								//相等表示与当前线段的第二个端点重复
    								focusPoints.push({key:xNode1.id, key2:xNode2.id, value:[loc], order:xOrderBy});//确定哪 一段线上有交点
    							}
    						}
    					}
    				}
    			} 
    		}
    		if(!focusPoints.length) continue; //没有交点则跳出线段循环
//将所有的交点放到线上
    		for(var c = 0; c<focusPoints.length; c++){
    			var locInfo = focusPoints[c];
    			var centerpoints = locInfo.value;
    			//对中间节点进行排序
    			centerpoints = queuePoints(centerpoints, locInfo.order);
    			for(var v = 0; v<centerpoints.length; v++){
    				var cpoint = centerpoints[v];
    				var cXpoint = graph.extendNode(xWay, cpoint, {/*datatype: "RoadNode"*/});
    				cXpoint.modelName = "RoadNode";
    				graph = graph.replace(cXpoint);
    				//把交点放到线的指定位置上
    				var xIndex = xWay.nodes.indexOf(locInfo.key)+1;
    				xWay = xWay.addNode(cXpoint.id, xIndex);
    			    graph = graph.replace(xWay);
    			}
    		}
//    		continue; //只放交点不分隔!!!!!!!!!!!!!!!!!!!!!!
//    		console.log("加入交点后  ",xWay)
    		//获取模板线上所有的节点对象
    		var xNodes = _.uniq(xWay.nodes).map(function(id){
				   			 var node = graph.entity(id);
				   			 return node;
				   		});
    		
    	    //根据线上的所有点，按路口点的类型进行截取线段
    	    var fLines = splitLineByRoadNode(xNodes);
//    	    console.log("将要生成的线段   ",fLines)
    		
    	    //将线段点数组对象生成多条线段，并显示
    	    var sourceId = "";
    	    var sourceVersion = 1;
    	    for(var z = 0; z < fLines.length; z++){
    	    	var linePoints = fLines[z];
    	    	//新点的坐标
    	    	var lastPointLoc = linePoints[(linePoints.length-1)];
    	    	//创建新点
    			var lastNewPoint = {};
    			if(z == (fLines.length - 1)){
    				//当为最后一组线段点时，保留最后一个点 ;
    				//如 ： [A, B] [B, C] 保留第二组C这个点,无需再创建 新的点
    				lastNewPoint = graph.entity(lastPointLoc.id);
    				//保原始线的ID
    				sourceId = xWay.id;
    				var oldV = xWay.version || 1;
    				sourceVersion = parseFloat(oldV) + 1;
    	    		//删除原始线
    	    	    _.uniq(xWay.nodes).forEach(function(id, i){
    	    	    		//删除线上的点
    	    	    		xWay = xWay.removeNode(id);
    	    	    		graph = graph.replace(xWay);
    	    	    });
    	    	    graph = graph.remove(xWay);//删除再次选择报错
    			}else{
    				//创建一个新节点
    				lastNewPoint = graph.extendNode(xWay, lastPointLoc.loc, {/*datatype: "RoadNode"*/});
    				lastNewPoint.modelName = "RoadNode";
        			graph = graph.replace(lastNewPoint);
    			}
    			
    	    	//创建线段
    	    	var newWay = iD.Way();
    	    	newWay.layerId = xWay.layerId; //线的所属图层
    	    	newWay = newWay.mergeTags(xWay.tags); //继承当前tags属性
    	    	// newWay = newWay.mergeTags({src_id:""}); //母库ID为空
    	    	if(sourceId){
    	    		//保留原始ID，必需改变版本号，不然保存报错
    	    		newWay.id = sourceId;
    	    		newWay.version = sourceVersion;//改变原始版本号ID
    	    	}//保留原始线ID
    	    	graph = graph.replace(newWay);
    	    	
    	    	//组装新线段
    	    	for(var h = 0; h<(linePoints.length-1); h++){
    	    		var hPoint = linePoints[h];
    	    		//先添加交点到当前线段上
    	    		newWay = newWay.addNode(hPoint.id);
    	    	    graph = graph.replace(newWay);
    	    	}
    	    	//添加最后一个点
    	    	/**newWay = newWay.addNode(lastNewPoint.id);*/
				newWay = newWay.addNode(lastPointLoc.id);
	    	    graph = graph.replace(newWay);
	    	    
	    	    //设置图所属图幅编辑
//	    	    graph = context.MeshDataStore.setWayMeshId(newWay, graph);
	    	    
	    	    //求当前线段的长度,长度小于0.5则删除
//	    	    var delBack = deleteLittleLine(graph, newWay, 0.5);
//	    	    graph = delBack.graph;
    	    }
    		
    		
    	}//for xWay end
    	
   		// console.log("end");
        return graph;
    };
};
