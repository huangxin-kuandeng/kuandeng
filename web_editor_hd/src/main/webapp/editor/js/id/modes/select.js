/**
 * 选择模式
 * @param {Object} context
 * @param {Object} selectedIDs
 * @param {Object} transportation
 */
iD.modes.Select = function(context, selectedIDs, transportation) {
    var mode = {
        id: 'select',
        button: 'browse'
    };

    var keybinding = d3.keybinding('select'),
        timeout = null,
        behaviors = [
            iD.behavior.Hover(context),
            iD.behavior.Select(context),
            // 拉框，Shift+鼠标左键移动
            iD.behavior.Lasso(context),
            iD.modes.DragNode(context)
                .selectedIDs(selectedIDs)
                .behavior],
        inspector,
        radialMenu,
        newFeature = false,
        suppressMenu = false;

    var wrap = context.container()
        .select('.KDSEditor-inspector-wrap');

    function singular() {
        if (selectedIDs.length === 1) {
            return context.entity(selectedIDs[0]);
        }
    }

    function positionMenu() {

        var isLasso=d3.event && 
            d3.event._isLasso,
            posLoc=null;

        if(isLasso){

            if(d3.event._lassoCenter && ! d3.event._lassoReverseSel){
                
                posLoc = context.projection(d3.event._lassoCenter);

            }else{

                var selExtent = iD.geo.Extent();

                _.each(selectedIDs, function(id){
                    selExtent = selExtent.extend(context.entity(id).extent(context.graph()));
                });

                posLoc = context.projection(selExtent.center());
            }
        }

        var entity = singular();

        if (entity && entity.type === 'node') {
            radialMenu.center(context.projection(entity.loc));
        } else {
            radialMenu.center(posLoc || context.mouse());
        }
    }

    function showMenu() {
    	if (isDrawCrossWay || !showMenuByselected()) return;
        context.surface()
            .call(radialMenu.close)
            .call(radialMenu);
    }
	
	function showMenuByselected () {
		var legal = true, enty;
		if (selectedIDs && selectedIDs.length) {
			selectedIDs.forEach(function (selectedID) {
				enty = context.graph().entity(selectedID);
				if (enty.geometry(context.graph()) === 'vertex' && (enty.modelName === iD.data.Constant.HIGHWAY)) legal = false;
			});
		}
		return legal;
	}
	
    
   
    var isDrawCrossWay = false;//绘制后不再显示工具箱

    
    function roadCrossLine () {
    	// var layers = iD.Layers, layer = layers.getCurrentEnableLayer(), ids = context.selectedIDs();
    	var layers = iD.Layers, layer = layers.getLayer(), ids = context.selectedIDs();

        /*if(ids.length==2&&ids[0]==ids[1])
        {
            context.roadCrossEdit(false);
            context.enter(iD.modes.Browse(context));
        }
        else*/
        if (layer && layer.isRoad() && ids.length >= 2){
            var entity = context.graph().entity(selectedIDs[0]);
            if (context.isRoadCross(entity)){
                var action=iD.actions.RoadCrossModify(ids);
                action.setEditProcess(true);
                context.perform(action,t('operations.road_cross_edit.description'));
                isDrawCrossWay = true;
            }
      	}

    }
	
	function speedCamera () {
		// var layers = iD.Layers, layer = layers.getCurrentEnableLayer(), ids = context.selectedIDs();
		var layers = iD.Layers, layer = layers.getLayer(), ids = context.selectedIDs();
      	if (layer && layer.isRoad() && ids.length >= 2) {
      		var entity = context.graph().entity(ids[0]), way = context.graph().entity(ids[1]);
      		if (entity.isSpeedcamera && entity.isSpeedcamera()) {
				var scmember = [{type: 'Highway', role: 'road', id: way.id}];
				context.perform(iD.actions.ChangeNodeMember(entity.id, scmember), t('operations.change_members.annotation'));
				
				iD.util.storeDottedLoc(entity, way, entity.id, context.temp().camaera_locs, context);
				
				isDrawCrossWay = true;
			}
		}
	}
	
	function zLevel () {
		// var layers = iD.Layers, layer = layers.getCurrentEnableLayer(), ids = context.selectedIDs();
		var layers = iD.Layers, layer = layers.getLayer(), ids = context.selectedIDs();
      	if (layer && layer.isRoad() && ids.length >= 3) {
      		var entity = context.graph().entity(ids[0]), way1 = context.graph().entity(ids[1]), way2 = context.graph().entity(ids[2]);
      		if (entity.isRoadZLevel && entity.isRoadZLevel()) {
				var scmember = [{type: 'Highway', role: 'link_up', id: way1.id}, {type: 'Highway', role: 'link_down', id: way2.id}];
				context.perform(iD.actions.ChangeNodeMember(entity.id, scmember), t('operations.change_members.annotation'));
				
				iD.util.storeDottedLoc(entity, way1, entity.id + '-' + way1.id, context.temp().zlevel_locs, context);
				iD.util.storeDottedLoc(entity, way2, entity.id + '-' + way2.id, context.temp().zlevel_locs, context);
				
				isDrawCrossWay = true;
			}
		}
	}

    mode.selectedIDs = function() {
        return selectedIDs;
    };

    mode.reselect = function() {
        var surfaceNode = context.surface().node();
        if (surfaceNode.focus) { // FF doesn't support it
            surfaceNode.focus();
        }

        positionMenu();
        showMenu();
    };

    mode.newFeature = function(_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return mode;
    };

    mode.suppressMenu = function(_) {
        if (!arguments.length) return suppressMenu;
        suppressMenu = _;
        return mode;
    };

    mode.enter = function() {
    	
        // ----------  traffic logic start ----------
        var transp = context.transportation.is(selectedIDs[0]) ;
                     context.transportation.reset(transp);
        // ----------  traffic logic end ----------
        if(context.roadCrossEdit())
        {
            roadCrossLine();//更新复杂路口关联线
        }
		
		speedCamera();//电子眼关联道路
		
		zLevel();//zLevel关联道路
                     
        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });
        

        // var cLayer = context.layers().getCurrentEnableLayer();
        var cLayer = context.layers().getLayer(context.entity(selectedIDs[0]).layerId);
        var operations = d3.values(iD.operations) //_.without(d3.values(iD.operations), iD.operations.Delete)
            .map(function(o) { return cLayer && o(selectedIDs, context); })
            .filter(function(o) { return cLayer && o.available(); });
//        operations.unshift(iD.operations.Delete(selectedIDs, context));

        keybinding.on('⎋', function() {
            context.enter(iD.modes.Browse(context));
        }, true);

        operations.forEach(function(operation) {
            operation.keys.forEach(function(key) {
                keybinding.on(key, function() {
                    if (!operation.disabled()) {
                        operation();
                        //线路打断后, 工具箱刷新
                        if (key === 'D') context.enter(iD.modes.Select(context, selectedIDs));
                    }
                });
            });
        });

        var _e = singular();
        context.ui().sidebar
            .select(_e ? _e.id : null, newFeature);

        context.history()
            .on('undone.select', update)
            .on('redone.select', update);

        function update() {
            context.surface().call(radialMenu.close);

            if (_.any(selectedIDs, function(id) { return !context.hasEntity(id); })) {
                // Exit mode if selected entity gets undone
                context.enter(iD.modes.Browse(context));
            }
        }

        context.map().on('move.select', function() {
            context.surface().call(radialMenu.close);
        });

        function dblclick() {
        	// var currLayer = context.layers().getCurrentEnableLayer();
            var target = d3.select(d3.event.target),
                datum = target.datum(),
                modelConfig = iD.Layers.getLayer(datum.layerId, datum.modelName);
            if(modelConfig && !modelConfig.editable){
            	return false;
            }
            if (datum instanceof iD.Way && !target.classed('fill')) {

                if(datum.isOneRoadCrossWay())
                {
                    return false;
                }

                //选择距离当前鼠标点最近的垂直投射距离
                var choice = iD.geo.chooseEdge(context.childNodes(datum), context.mouse(), context.projection);
                let currLayer = iD.Layers.getLayer(datum.layerId);
                let node = iD.Node({
                        identifier:currLayer.identifier,
                        layerId: datum.layerId});
                node.modelName =context.graph().childNodes(datum)[0].modelName;

             
                var prev = datum.nodes[choice.index - 1],
                    next = datum.nodes[choice.index];

                context.perform(
                    iD.actions.AddMidpoint({loc: choice.loc, edge: [prev, next]}, node),
                    t('operations.add.annotation.vertex'));

                d3.event.preventDefault();
                d3.event.stopPropagation();
            }
        }

        d3.select(document)
            .call(keybinding);

        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', true);
        }

        context.map().on('drawn.select', selectElements);
        selectElements();

        radialMenu = iD.ui.RadialMenu(context, transp ? [] : operations);
        var show = d3.event && !suppressMenu;
       
        if (show) {
            positionMenu();
        }

        timeout = window.setTimeout(function() {
            if (show) {
                showMenu();
            }

            context.surface()
                .on('dblclick.select', dblclick);
            
            var sIDs = context.selectedIDs();
            sIDs && sIDs.forEach(function (id, i) {
            	if (!context.graph().hasEntity(id)) {
            		sIDs.splice(i, 1);
            		context.surface().call(radialMenu.close);
            	}
            });
        }, 200);
        var selecteds = [];
        selectedIDs.forEach(function(id) {
            selecteds.push(context.entity(id));
        });
        context.event.selected(selecteds);
        if (selectedIDs.length > 1) {
            var entities = iD.ui.SelectionList(context, selectedIDs);
            context.ui().sidebar.show(entities);
            context.buriedStatistics().merge(1,selecteds[0].modelName,1000);
        }
    };

    mode.exit = function() {
        if (timeout) window.clearTimeout(timeout);

        if (inspector) wrap.call(inspector.close);

        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });

        keybinding.off();

        context.history()
            .on('undone.select', null)
            .on('redone.select', null);

        var sf = context.surface();
		if(radialMenu) sf.call(radialMenu.close);
		sf.on('dblclick.select', null)
            .selectAll('.selected')
            .classed('selected', false);

        context.map().on('drawn.select', null);
        context.ui().sidebar.hide();
    };

    return mode;
};







iD.modes.NewSelect = function(context, selectedIDs, _) {
    var mode = {
        id: 'select',
        button: 'browse'
    };

    var keybinding = d3.keybinding('select'),
        timeout = null,
        behaviors = [
            iD.behavior.Hover(context),
            iD.behavior.Select(context),
            iD.behavior.Lasso(context),
            iD.modes.DragNode(context)
                .selectedIDs(selectedIDs)
                .behavior],
        inspector,
        radialMenu,
        newFeature = false,
        suppressMenu = false;

    var wrap = context.container()
        .select('.KDSEditor-inspector-wrap');



    function positionMenu() {
            radialMenu.center(context.mouse());
    }

    function showMenu() {
        context.surface()
            .call(radialMenu.close)
            .call(radialMenu);
    }
    
    

    mode.selectedIDs = function() {
        return selectedIDs;
    };

    mode.reselect = function() {
        var surfaceNode = context.surface().node();
        if (surfaceNode.focus) { // FF doesn't support it
            surfaceNode.focus();
        }

        positionMenu();
        showMenu();
    };

    mode.newFeature = function(_) {
        if (!arguments.length) return newFeature;
        newFeature = _;
        return mode;
    };

    mode.suppressMenu = function(_) {
        if (!arguments.length) return suppressMenu;
        suppressMenu = _;
        return mode;
    };

    mode.enter = function() {

                    
        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });

        var operations = d3.values(iD.overoperations) 
            .map(function(o) { return o(_, context); })
            .filter(function(o) { return  o.available(); });


        keybinding.on('⎋', function() {
            context.enter(iD.modes.Browse(context));
        }, true);

        operations.forEach(function(operation) {
            operation.keys.forEach(function(key) {
                keybinding.on(key, function() {
                    if (!operation.disabled()) {
                        operation();
                    }
                });
            });
        });

        context.history()
            .on('undone.select', update)
            .on('redone.select', update);

        function update() {
            context.surface().call(radialMenu.close);

            if (_.any(selectedIDs, function(id) { return !context.hasEntity(id); })) {
                // Exit mode if selected entity gets undone
                context.enter(iD.modes.Browse(context));
            }
        }

        context.map().on('move.select', function() {
            context.surface().call(radialMenu.close);
        });

       

        d3.select(document)
            .call(keybinding);

        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', true);
        }

        context.map().on('drawn.select', selectElements);
        selectElements();

        radialMenu = iD.ui.RadialMenu(context,  operations, true );
        var show = d3.event && !suppressMenu;

        if (show) {
            positionMenu();
        }

        timeout = window.setTimeout(function() {
            if (show) {
                showMenu();
            }
            
            var sIDs = context.selectedIDs();
            sIDs && sIDs.forEach(function (id, i) {
                if (!context.graph().hasEntity(id)) {
                    sIDs.splice(i, 1);
                    context.surface().call(radialMenu.close);
                }
            });
        }, 200);


    };

    mode.exit = function() {
        if (timeout) window.clearTimeout(timeout);

        if (inspector) wrap.call(inspector.close);

        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });

        keybinding.off();

        context.history()
            .on('undone.select', null)
            .on('redone.select', null);

        var sf = context.surface();
        if(radialMenu) sf.call(radialMenu.close);
        sf.on('dblclick.select', null)
            .selectAll('.selected')
            .classed('selected', false);

        context.map().on('drawn.select', null);

    };

    return mode;
};

