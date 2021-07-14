// Shift拉框选择
iD.behavior.Lasso = function(context) {
    var mode = arguments[1];
    var filter = arguments[2] || iD.util.empty;
    var _shiftKey = false,_ctrlKey = false;
    var behavior = function(selection) {

        var mouse = null,
            lasso;

        function mousedown() {
            _shiftKey = (d3.event.shiftKey === true);
            _ctrlKey = (d3.event.ctrlKey === true || d3.event.metaKey === true);
            if (_shiftKey
                || _ctrlKey
                || mode) {
                mouse = context.mouse();
                //lasso = null;

                selection
                    .on('mousemove.lasso', mousemove)
                    .on('mouseup.lasso', mouseup);

                 d3.event.stopPropagation();
                 d3.event.preventDefault();
            }
        }

        function mousemove() {
            if (!lasso) {
                lasso = iD.ui.Lasso(context).a(mouse);
                context.surface().call(lasso);
            }

            lasso.b(context.mouse());
        }

        function normalize(a, b) {
            return [
                [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
                [Math.max(a[0], b[0]), Math.max(a[1], b[1])]];
        }

        function mouseup() {
            selection
                .on('mousemove.lasso', null)
                .on('mouseup.lasso', null);
            // 未拉框时不执行，属于点击
            if (!lasso || _.isEqual(lasso.a(), lasso.b())) {
                lasso && lasso.close();
                return ;
            }

            d3.event._isLasso = true;

            function execLassoInstance(selected){
                 context.event.dragbox({ 'bounds' : extent, 'entity' : selected});
                 
                 if(selected && selected.length){
                     let _mnames = [];
                     let _oids = [];
                     selected.forEach(function(et){
                        _oids.push(iD.Entity.id.toOSM(et.id) + '');
                        // 前方交会、控制点，没有modelName
                        _mnames.push(et.modelName || '');
                     });
                     iD.logger.editElement({
                         'tag': "selected_lasso_target", 
                         'entityIds': _oids,
                         'modelNames': _mnames
                     });
                 }
            	 context.lasso_callback 
            	 		&& context.lasso_callback.call(this, extent, selected);
            }

            var extent = iD.geo.Extent(
                normalize(context.projection.invert(lasso.a()),
                context.projection.invert(lasso.b())));
            var polygon=extent.polygon();
            lasso.close();

            d3.event._lassoCenter = extent.center();

			// 过滤框中的元素
            // var currEditorLayer = context.layers().getCurrentEnableLayer();
            var selected = context.intersects(extent).filter(function (entity) {

                    function insectTrans (datum) {
                        if (datum) {
                            if (datum instanceof iD.Way) {
								return true;
                                // return iD.util.wayInPlyGonx(datum, context);
                            } else if (datum instanceof iD.Node) {
                                if(datum.modelName == iD.data.DataType.AUTO_CHECKWORK_TAG) return true;
                                return iD.util.nodeInPlyGonx(datum, context);
                            }
                        }
                        return false;
                    }

                    var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
                    if (!modelConfig || !modelConfig.display) { return false; }
					
                    var r = false
                    if(_shiftKey && iD.Task.d){
                        var layer = iD.Layers.getLayer(entity.layerId);
                        if(!layer){ return false; }
                        if(!layer.isPoint() && entity instanceof iD.Node){r = false;}
                        if(entity instanceof iD.Way){
                            r = filter(entity) && insectTrans(entity) && true;
                        }
                    }
                    if(_ctrlKey && iD.Task.d){
                        if(!iD.Layers.getLayer(entity.layerId)){ return false; }
                            if(entity instanceof iD.Node
                            && typeof entity.tags != 'undefined'
                            && typeof entity.modelName != 'undefined'
                            && [
                                iD.data.DataType.AUTO_CHECKWORK_TAG,
                            	iD.data.DataType.ROAD_NODE,
                            	iD.data.DataType.DIVIDER_NODE,
                            	iD.data.DataType.OBJECT_PL_NODE,
                            	iD.data.DataType.HD_LANE_NODE,
	                            iD.data.Constant.C_NODE, 
	                            iD.data.DataType.OBJECT_PT,
	                            iD.data.DataType.LAMPPOST,
	                            iD.data.DataType.LIMITHEIGHT,
	                            iD.data.DataType.TRAFFICLIGHT,
	                            iD.data.DataType.ROAD_ATTRIBUTE,
	                            iD.data.DataType.BARRIER_GEOMETRY_NODE,
	                            iD.data.DataType.CHECK_TAG,
	                            iD.data.DataType.IMAGE_TAG,
	                            iD.data.DataType.ANALYSIS_TAG,
	                            iD.data.DataType.QUESTION_TAG,
	                            iD.data.DataType.QUALITY_TAG
                            ].indexOf(entity.modelName)>=0
                            &&iD.Static.layersInfo.isDisplay(entity.modelName)
//                          && iD.Task.d
                            ){
                                r = filter(entity) && insectTrans(entity) && true;
                            }
                        // }

                    }
                    return r;
                });

           var currentSelIds = _.clone(context.selectedIDs()),
                isReverseSel=false;

          

           d3.event._lassoReverseSel = isReverseSel;
           var allSelectId = [];
           let entitys = [];
            
            // if (selected.length && currEditorLayer.type != "area") {
            if (selected.length) {
                if(_shiftKey){
                    var lassExtend = iD.util.lassExtend;
                    let innerAreaWays = [];//存储在区域内的线
                    
                    //循环所有选择的线，校验其是否与四条边线相交
                    for(var i = 0; i<selected.length; i++){
                        var currWay = selected[i];
                        
                        if(currWay.type === 'node'){
                            var nflag = isReverseSel || currWay.modelName == iD.data.DataType.AUTO_CHECKWORK_TAG || lassExtend.isPointInRect({lon:currWay.loc[0], lat:currWay.loc[1]},extent);
                            if(nflag){
                                innerAreaWays.push(currWay);
                            };
                            continue;
                        }
                        
                       
                        
                        if (currWay instanceof iD.Way){
                            var locs = _.pluck(context.graph().childNodes(currWay),'loc')
                            if(iD.geo.polygonIntersectsPolygon(polygon,locs,true)){
                                innerAreaWays.push(currWay);
                            }
                        }

                    }
                    // 按住shift 框选，原来选中则不选，原来不选则新增

                    if(innerAreaWays.length > 0){
                        var innerAreaWayIds=_.pluck(innerAreaWays, 'id');
                        allSelectId=_.uniq(currentSelIds.concat(innerAreaWayIds));
                        _.forEach(innerAreaWayIds,function(wayid){
                            if(currentSelIds.indexOf(wayid)>=0){
                                allSelectId.splice(allSelectId.indexOf(wayid), 1);
                            }
                        })
                        entitys.push(...innerAreaWays);
                    }

                    // innerAreaWays.length && allSelectId.length && context.enter(iD.modes.Select(context, allSelectId));
                    // execLassoInstance(innerAreaWays);
                }
                if(_ctrlKey){
                    var lassExtend = iD.util.lassExtend;
                    var innerAreaNodes = [];//存储在区域内的节点
                    
                    //循环所有选择的点
                    for(var i = 0; i<selected.length; i++){
                        if(selected[i] instanceof iD.Way) continue;
                        var currNode = selected[i];
                        innerAreaNodes.push(currNode);
                    }
                    let  slectIds =_.uniq(currentSelIds.concat( _.pluck(innerAreaNodes, 'id') ));
                    _.forEach(innerAreaNodes,function(n){
                        if(currentSelIds.indexOf(n.id)>=0){
                            slectIds.splice(allSelectId.indexOf(n.id), 1);
                        }
                    })
                    entitys.push(...innerAreaNodes);
                    allSelectId.push(...slectIds);
                    //将符合条件 的点选中
                    // innerAreaNodes.length && context.enter(iD.modes.Select(context, allSelectId));
                    // execLassoInstance(innerAreaNodes);
                }
                entitys.length && allSelectId.length && context.enter(iD.modes.Select(context, allSelectId));
                execLassoInstance(entitys);
            }else {
                   //没有选中的元素
            	 context.enter(iD.modes.Browse(context));
                 execLassoInstance(selected);
                 let _e = context.hasEntity(selected);
                 let nm;
                 if(_e instanceof iD.Node){
                    
                     let _ways = context.graph().parentWays();
                     if(!_ways.length){
                        nm = _ways[0].modelName;
                     }
                 }else if(_e){
                    nm = _e.modelName;
                 }
                 if(nm){
                     context.buriedStatistics().merge(1,nm,1000);
                 }
            }

            
            lasso = null;
        }

        selection
            .on('mousedown.lasso', mousedown);
            _shiftKey = false;
            _ctrlKey = false
    };

    behavior.off = function(selection) {
        selection.on('mousedown.lasso', null);
    };

    return behavior;
};
