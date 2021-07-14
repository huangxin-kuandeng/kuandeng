iD.behavior.DrawCutDivider = function(context, wayId, index, mode, baseGraph) {
	var moveData, undoAndContine = false;
	var keybinding = d3.keybinding('DrawCutDivider');
	var way = context.entity(wayId),
		constant = iD.data.DataType,
		isArea = context.geometry(wayId) === 'area',
		finished = false,
		annotation = t((way.isDegenerate() ?
			'operations.start.annotation.' :
			'operations.continue.annotation.') + context.geometry(wayId)),
		draw = iD.behavior.Draw(context),
		editLayer = iD.Layers.getLayer();
		// editLayer = iD.Layers.getCurrentEnableLayer();
	var startIndex = typeof index === 'undefined' ? way.nodes.length - 1 : 0,
		_startNodeCurrentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER_NODE),
		start = iD.Node({
			loc: context.graph().entity(way.nodes[startIndex]).loc,
			modelName: iD.data.DataType.DIVIDER_NODE,
            tags:iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, _startNodeCurrentLayer),
            identifier:_startNodeCurrentLayer.identifier,
			layerId: _startNodeCurrentLayer.id
		}),
		end = iD.Node({
			loc: context.map().mouseCoordinates(),
			modelName: iD.data.DataType.DIVIDER_NODE,
            tags:iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, _startNodeCurrentLayer),
            identifier:_startNodeCurrentLayer.identifier,
			layerId: _startNodeCurrentLayer.id
		}),
		segment = iD.Way({
			nodes: typeof index === 'undefined' ? [start.id, end.id] : [end.id, start.id],
            modelName: iD.data.DataType.DIVIDER,
            identifier:_startNodeCurrentLayer.identifier,
			layerId: iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER).id,
			tags: iD.uti.tagExtend.updateTaskTag(way)
		});

	var isConnectFakeNode = false;
	// perform是执行这一次操作，replace是替换上一次操作
	var f = context[way.isDegenerate() ? 'replace' : 'perform'];
	var firstNode = context.graph().entity(way.nodes[0]);
	var isWalkRoad = firstNode.modelName == constant.WALKENTER;
	var isHighWay = firstNode.modelName == constant.ROADNODE;

	isArea = false;

	f(iD.actions.AddEntity(start),
		iD.actions.AddEntity(end),
		iD.actions.AddEntity(segment));
	
	if(isWalkRoad) {
		var roadcross = d3.select('g.layer.layer-roadcross')
		roadcross.classed("no-pointer-events", true);
		var placename = d3.select('g.layer.layer-placename')
		placename.classed("no-pointer-events", true);
	} else if(isHighWay) {
		var walklink = d3.select('g.layer.layer-walk')
		walklink.classed("no-pointer-events", true);
	}

	function move(datum) {
		moveData = datum;
		// var loc, enableLayer = context.layers().getCurrentEnableLayer();
		var loc, enableLayer = context.layers().getLayer(datum.layerId);
		if(datum.type === 'node' && datum.id !== end.id) {
			loc = datum.loc;
		} else if(datum.type === 'way' && datum.id !== segment.id && enableLayer && enableLayer.id === datum.layerId && !datum.isArea()) {
			loc = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection).loc;
		} else {
			loc = context.map().mouseCoordinates();
		}
		context.replace(iD.actions.MoveNode(end.id, loc));

		//点在导航图层道路上结束时，结束当前道路并继续画路
		if(way.inline && iD.Layers.getLayer(way.layerId).isRoad() && datum.tags && datum.modelName == constant.ROADNODE) {
			if(firstNode.modelName == constant.WALKENTER) {

			} else {
				drawWay.finish();
				delete way.inline;
				if(isConnectFakeNode) {
					var nodeID = way.nodes[way.nodes.length - 1];
					datum = context.graph().entity(nodeID);
				}
				var graph = context.graph();
				var fromNode = graph.entity(datum.id);
				startFromNode(fromNode);
			}
		}
	}

	function startFromNode(node) {


		var wayLayerId = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER).id;
		var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.DIVIDER);
		var way = iD.Way({
            identifier:wayLayer.identifier,
			layerId: wayLayerId
		});
		way.modelName = iD.data.DataType.DIVIDER;
        way.setTags(iD.util.getDefauteTags(way, iD.Layers.getLayer(way.layerId)));
		if(firstNode.modelName != constant.WALKENTER) {
			// way.tags.isnewway = 'true';
			var flag = iD.walkRoadFlag.ROAD;

		} else {
			var flag = iD.walkRoadFlag.WALKROAD;
		}
		var args = [iD.util.SplitRoadRule([node.id], context, flag, node),
			iD.actions.AddEntity(way),
			iD.actions.AddVertex(way.id, node.id)
		]
		if(node.tags /*&& (node.tags['datatype'] == 'RoadNode' || node.tags['datatype'] == constant.WALKENTER)*/) {
			args.splice(0, 1);
		}
		context.perform.apply(this, args)
		context.enter(iD.modes.DrawLine(context, way.id, context.graph(), '', 'road'));
	}

	function undone() {
		finished = true;
		context.enter(iD.modes.Browse(context));
	}

	function setActiveElements() {
		var active = isArea ? [wayId, end.id] : [segment.id, start.id, end.id];
		context.surface().selectAll(iD.util.entitySelector(active))
			.classed('active', true);
	}

	function createWayWithHighwayNode() {
		if(window.fakeNodesArr && window.fakeNodesArr[0]) {
			var fakeNode = window.fakeNodesArr[0];
            var nodesArr = way.nodes;
            let layer = iD.Layers.getLayer(fakeNode.layerId);
			nodesArr.forEach(function(nodeID) {
				if(nodeID == fakeNode.id) {
					var newNode = iD.Node({
                        identifier:layer.identifier,
						layerId: fakeNode.layerId,
						loc: fakeNode.loc,
						//    tags: {datatype: iD.data.DataType.ROADNODE}
					});
					/*if(isHighWay) {
						newNode.setTags({
							datatype: iD.data.DataType.ROAD_NODE
						});
					} else if(isWalkRoad) {
						newNode.setTags({
							datatype: iD.data.DataType.WALKENTER
						});
					}*/
					context.replace(iD.actions.AddEntity(newNode), annotation);

					var graph = context.graph();
					var parentWays = graph.parentWays(fakeNode);

					parentWays.forEach(function(way) {
						var wayNodesArr = way.nodes;
						wayNodesArr.forEach(function(wayNode) {
							if(wayNode == fakeNode.id) {
								way = way.replaceNode(nodeID, newNode.id);
								context.replace(iD.actions.AddEntity(way), annotation);
							}
						});
					});
					context.replace(iD.actions.DeleteNode(nodeID), annotation);
					way = context.graph().entity(way.id);
					//更新道路首尾结点的realnode字段
					if(isHighWay) {
						newNode = iD.util.tagExtend.updateRoadNodeRealNodeTag(context.graph(), newNode);
						newNode = iD.util.tagExtend.updateNodeMeshTag(newNode, context);
					}
					context.replace(iD.actions.AddEntity(newNode), annotation);
				}
			});

			isConnectFakeNode = true;
		}
	}

	function cancelWholeWay() {
		context.replace(iD.actions.AddEntity(way), annotation);
		var nodes = way.nodes;
		// var firstNodeID = nodes[0];
		for(var i = 0; i < nodes.length; i++) {
			context.undo();
		}

		finished = true;

		context.enter(iD.modes.AddRoad(context));

	}

	var drawWay = function(surface) {
		draw.on('move.draw-cut-divider', move)
//			.on('click.draw-cut-divider', drawWay.add)
//			.on('clickWay.draw-cut-divider', drawWay.addWay)
			.on('clickNode.draw-cut-divider', drawWay.addNode)
			.on('undo.draw-cut-divider', context.undo)
			.on('cancel.draw-cut-divider', drawWay.cancel)
			.on('finish.draw-cut-divider', drawWay.finish);

		/*  keybinding.on('Shift+Z', undoAndContinueDraw);
		 d3.select(document)
		 .call(keybinding);*/

		keybinding.on('Shift+Z', cancelWholeWay);
		d3.select(document)
			.call(keybinding);

		context.map()
			.dblclickEnable(false)
			.on('drawn.draw-cut-divider', setActiveElements);

		setActiveElements();

		surface.call(draw);

		context.history()
			.on('undone.draw-cut-divider', undone);
	};

	drawWay.off = function(surface) {

		if(!finished && undoAndContine == false) {
			createWayWithHighwayNode();
			var upnode = context.graph().entity(way.nodes[0]);
			upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
			context.replace(
				iD.actions.AddEntity(upnode),
				annotation
			);
			upnode = context.graph().entity(way.nodes[way.nodes.length - 1]);
			upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
			context.replace(
				iD.actions.AddEntity(upnode),
				annotation
			);
			if(isHighWay) {
				context.replace(
					iD.actions.AddRoad(way),
					annotation
				);
			} else if(isWalkRoad) {
				context.replace(
					iD.actions.AddWalkRoad(way),
					annotation
				);
			}
			context.pop();

		}

		context.map()
			.on('drawn.draw-cut-divider', null);

		surface.call(draw.off)
			.selectAll('.active')
			.classed('active', false);

		context.history()
			.on('undone.draw-cut-divider', null);
		keybinding.off();
	};

	function ReplaceTemporaryNode(newNode) {
		return function(graph) {

			// var currLayer = context.layers().getCurrentEnableLayer();
			var currLayer = context.layers().getLayer(newNode.layerId);

			newNode.layerId = iD.Layers.getCurrentModelEnableLayer(newNode.modelName).id; // currLayer.id; //设置绘制过程中点的图层ID

			if(isArea) {
				//if(firstNode)
				//newNode.tags = {datatype: constant.LANUSE};
				// newNode.tags = {datatype: firstNode.modelName};
				graph = graph
					.replace(way.addNode(newNode.id, index))
					.remove(end);
				return graph;
			} else {
				var graph = graph
					.replace(graph.entity(wayId).addNode(newNode.id, index))
					.remove(end)
					.remove(segment)
					.remove(start);
				if(currLayer.split) {
					var parents = graph.parentWays(newNode); //当前是否与图幅相交的线段
					//return MapSheet.splitLine(parents, graph, context); //如果画的线跨图幅边界，则进行分隔!!!!!
					return graph;
				} else {
					return graph;
				}

			}
		};
	}

	// Connect the way to an existing node and continue drawing.
	drawWay.addNode = function(node) {
		// Avoid creating duplicate segments
		if(way.areAdjacent(node.id, way.nodes[way.nodes.length - 1])) return;

		//自相交判断
		if(way.nodes.indexOf(node.id) != -1) {
			return;
		}

		way['inline'] = 1;
		var actions = [];
		// 不清楚做什么
		// 添加一个空白的动作
//		context.perform(iD.actions.Noop(), t('modes.add_road.description'));
//		context.perform(iD.actions.Noop(), t('modes.add_road.description'));
        let layer = iD.Layers.getLayer(node.layerId);
		var newNode = iD.Node({
            layerId: node.layerId,
            identifier:layer.identifier,
			loc: node.loc,
            tags:iD.util.getDefauteTags(iD.data.DataType.DIVIDER_NODE, iD.Layers.getLayer(node.layerId)),
			modelName: constant.DIVIDER_NODE
		});
		actions.push(iD.actions.AddEntity(newNode));
		actions.push(...[ReplaceTemporaryNode(newNode),
			annotation
		]);
		context.perform.apply(this, actions);
//		context.replace.apply(this, actions);
		
		finished = true;
		// !isFinal && context.enter(mode);
		
		checkWayLength(wayId, this);
	};
	
	
    function checkWayLength(wayId, behavior){
    	var way = context.entity(wayId);
    	// 实现打断效果，最好只有一段线
    	// console.log("打断的线绘制完成", way.id, way);
    	if(way.nodes && way.nodes.length == 2){
        	behavior.finish();
    		context.replace(
	            iD.actions.SplitDividingLine([way.id], null, context),
	            t('modes.cut_divider.description')
	        );
	        drawWay.finishSplitLine();
        }
    }
    
    drawWay.finishSplitLine = function(){
    	// mode used
    }

	// Finish the draw operation, removing the temporary node. If the way has enough
	// nodes to be valid, it's selected. Otherwise, return to browse mode.
	drawWay.finish = function() {
		// 历史记录回退操作
//		context.pop();
		finished = true;

		createWayWithHighwayNode();

		window.setTimeout(function() {
			context.map().dblclickEnable(true);
		}, 1000);

		if(context.hasEntity(wayId)) {
			/*
			context.enter(
				iD.modes.Select(context, [wayId])
				.suppressMenu(true)
				.newFeature(true));
			*/
			context.enter(iD.modes.Browse(context));
			if(editLayer.continues) {
				if(mode.button === "area" && editLayer.isRoad()) {
					//context.enter(iD.modes.AddWalkArea(context));
				} else if(mode.button === "area") {
					context.enter(iD.modes.AddArea(context));
				} else if(mode.button === "line" && editLayer && !editLayer.isRoad()) {
					context.enter(iD.modes.AddLine(context));
				} else if(mode.button === "line" && editLayer && editLayer.isRoad()) {
					var upnode = context.graph().entity(way.nodes[0]);
					upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
					context.replace(
						iD.actions.AddEntity(upnode),
						annotation
					);
					upnode = context.graph().entity(way.nodes[way.nodes.length - 1]);
					upnode = iD.util.tagExtend.updateNodeMeshTag(upnode, context);
					context.replace(
						iD.actions.AddEntity(upnode),
						annotation
					);
					if(isHighWay) {
						context.replace(
							iD.actions.AddRoad(way),
							annotation
						);
					}
					var endNodeId = way.nodes[way.nodes.length - 1];
					var graph = editor.context.graph();
					var endNode = graph.entity(endNodeId);
				}

			}
			if(isWalkRoad) {
				context.replace(
					iD.actions.AddWalkRoad(way),
					annotation
				);
			}
			//新建道路结点的判断
			var newWay = context.entity(wayId);
			var tNode = context.entity(newWay.last());
			if(tNode.tags.boundary && tNode.tags.boundary == "20" && tNode.tags.realnode && tNode.tags.realnode == "0") {
				Dialog.alert("目标点为跨图幅边框点，不能是真实节点", function() {
					context.enter(iD.modes.Browse(context));
				});
				return;
			}
		} else {
			if(isWalkRoad && way.nodes.length > 1) {
				context.replace(
					iD.actions.AddWalkRoad(way),
					annotation
				);
			}
			context.enter(iD.modes.Browse(context));
		}
	};

	// Cancel the draw operation and return to browse, deleting everything drawn.
	drawWay.cancel = function() {
		context.perform(
			d3.functor(baseGraph),
			t('operations.cancel_draw.annotation'));

		window.setTimeout(function() {
			context.map().dblclickEnable(true);
		}, 1000);
		finished = true;
		context.enter(iD.modes.Browse(context));
	};

	drawWay.tail = function(text) {
		draw.tail(text);
		return drawWay;
	};

	return drawWay;
};