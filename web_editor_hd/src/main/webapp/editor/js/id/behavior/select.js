/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:37
 * @LastEditors: tao.w
 * @LastEditTime: 2019-08-29 18:13:28
 * @Description: 
 */
iD.behavior.Select = function(context) {
    function keydown() {
        if(d3.event && d3.event.altKey){
            context.variable.altKeyDown = true;
            context.surface()
                .classed('alt-mousedown', true);
        }

        if (d3.event && d3.event.shiftKey) {
            context.surface()
                .classed('behavior-multiselect', true);
        }
    }

    function keyup() {
        if(context.variable.altKeyDown){
            context.variable.altKeyDown = false;
            context.surface()
                .classed('alt-mousedown', false);
        }

        if (!d3.event || !d3.event.shiftKey) {
            context.surface()
                .classed('behavior-multiselect', false);
        }
    }


    function click() {

        var datum = d3.event.target.__data__;
        iD.select = d3.event.target;
		
        if (datum && window.debug) {
            iD.topo.check().mainCheck(context.graph(), datum);
        }
        
        if(datum && datum.modelName == iD.data.DataType.QUALITY_TAG){
            iD.ui.openCheckTagDialog(context, datum.id);
        }

        if(!d3.event.shiftKey&&(!datum||!(datum.type =="way")||(datum.tags&&datum.modelName!=iD.data.DataType.HIGHWAY))){
            d3.select("#geoRoadInfo").remove();
        }

        if (typeof datum == 'undefined' || typeof datum.tags == 'undefined' || datum.modelName !== 'QC_TAG') {
            var trigger = d3.select('.nav .item-element');
            if (!trigger.empty() && trigger.classed('show')) {
                trigger.node().click();
            }
        }
        extendDeal(datum);
        if (!(typeof datum != 'undefined' && typeof datum.tags != 'undefined' && datum.modelName == 'QC_TAG')) {
            if (filter(datum) || !insectTrans(datum)) {

                // add 没有按下shift 或者ctrl key则进入browse模式,取消选中和左侧sidebar的相关显示
                if (!(d3.event.shiftKey || d3.event.ctrlKey)) {
                    context.enter(iD.modes.Browse(context));
                }
                // add 空白或者任务圈外面则取消操作菜单
                if (d3.select("#surface .radial-menu").size() > 0) {
                    d3.select("#surface .radial-menu").remove();

                }

                return;
            }
        }
        // 判断是否有拉框，rect还在，但是没有class
        var lasso = d3.select('#surface .lasso').node();
//      var lasso = context.container().classed('lasso');
        
        if (!(datum instanceof iD.Entity)) {
            if (!d3.event.shiftKey && !lasso)
                context.enter(iD.modes.Browse(context));

        } else if (!d3.event.ctrlKey && !d3.event.shiftKey && !lasso) {
            // Avoid re-entering Select mode with same entity.
            d3.event._clickselect = true; //点击地图选中
            if (context.selectedIDs().length !== 1 || context.selectedIDs()[0] !== datum.id) {
                context.enter(iD.modes.Select(context, [datum.id]));
            } else {
                context.mode().reselect();
            }
        } else if (context.selectedIDs().indexOf(datum.id) >= 0) {
            var selectedIDs = _.without(context.selectedIDs(), datum.id);
            context.enter(selectedIDs.length ?
                iD.modes.Select(context, selectedIDs) :
                iD.modes.Browse(context));
        } else {
            filterShift(datum); // modify
        }


    }

	/**
	 * Shift+单击线 / Ctrl+单击点
	 * @param {Object} datum
	 */
    function filterShift(datum) {
        var datumGeo, sItem, sItemGeo, sIDs = context.selectedIDs(),
            sID = context.selectedID,
            layer;
            // layer = context.layers().getCurrentEnableLayer();
        if(sIDs[0]){
        	sItem = context.entity(sIDs[0]);
        	layer = context.layers().getLayer(sItem.layerId);
        }
//      if(layer && !layer.isRoad()){
        if (d3.event.shiftKey && sItem instanceof iD.Way) {
            if (sIDs === null || sIDs.length < 0) {
                context.enter(iD.modes.Select(context, [datum.id]));
            } else {
                if (!sIDs[0]) return; //修改选中为空报错的问题
//              sItem = context.entity(sIDs[0]);
//              if (!(sItem.layerId !== datum.layerId || context.geometry(sItem.id) !== context.geometry(datum.id))) {
                if (context.geometry(sItem.id) === context.geometry(datum.id)) {
                    if (sIDs.indexOf(datum.id) > 0) {
                        sIDs = _.without(sIDs, datum.id);
                        context.enter(sIDs.length ? iD.modes.Select(context, sIDs) : iD.modes.Browse(context));
                    } else {
                        sIDs.push(datum.id);
                        context.enter(iD.modes.Select(context, sIDs));
                    }
                }
            }
        } else {
            if (iD.Task.definedLinearCheck()) return;
            if (sID) {
                var arr = [sID, datum.id];
//                  sItem = context.entity(sID);
                datumGeo = context.geometry(datum.id), sItemGeo = context.geometry(sItem.id);
                context.selectedID = undefined;
                if (datumGeo === "vertex" || datumGeo === "point") {
                    if (sItemGeo === "vertex" || sItemGeo === "point") {
                        arr.push(datum.id);
                        context.enter(iD.modes.Select(context, sIDs.concat(arr)));
                    }
                }
                return;
            }

            if (!sIDs || sIDs.length === 0) {
                context.enter(iD.modes.Select(context, [datum.id]));
            } else {
                sItem = context.entity(sIDs[0]);
//              if (datum.layerId && (sItem.layerId === datum.layerId)) {
                if (d3.event.ctrlKey && context.geometry(sItem.id) ==context.geometry(datum.id)) {
                    if (sIDs.indexOf(datum.id) > 0) {
                        sIDs = _.without(sIDs, datum.id);
                        context.entity(sIDs.length ? iD.modes.Select(context, sIDs) : iD.modes.Browse(context));
                    } else {
                        datumGeo = context.geometry(datum.id);
                        sItem = context.entity(sIDs[0]), sItemGeo = context.geometry(sItem.id);
                        if (datumGeo === "vertex" || datumGeo === "point") {
                            if (sItemGeo === "vertex" || sItemGeo === "point") {
                                sIDs.push(datum.id);
                                context.enter(iD.modes.Select(context, sIDs));
                            }
                        } else {
                            if (datumGeo === "line" && sItemGeo === 'line') {
                                /*if(context.isOneRoadCrossWay(datum)){
                                 if(sItem._type && sItem._type === datum._type){
                                 sIDs.push(datum.id);
                                 context.enter(iD.modes.Select(context, sIDs));
                                 }
                                 }else{*/
                                if (!sItem._type || !context.isOneRoadCrossWay(sItem)) {
                                    sIDs.push(datum.id);
                                    context.enter(iD.modes.Select(context, sIDs));
                                }
                                //}
                            } else if (datumGeo === "line" && sItemGeo === 'point') {
                                if (sItem.isSpeedcamera && sItem.isSpeedcamera()) {
                                    sIDs.push(datum.id);
                                    sIDs.length >= 3 && sIDs.splice(1, 1);
                                    context.enter(iD.modes.Select(context, sIDs));
                                } else if (sItem.isRoadZLevel && sItem.isRoadZLevel()) {
                                    sIDs.push(datum.id);
                                    sIDs.length >= 4 && sIDs.splice(1, 1);
                                    context.enter(iD.modes.Select(context, sIDs));
                                } else if (sItem.isPlaceName && sItem.isPlaceName()) {
                                    sIDs.push(datum.id);
                                    sIDs.length >= 4 && sIDs.splice(1, 1);
                                    context.enter(iD.modes.Select(context, sIDs));
                                } else if (sItem.isQcTag && sItem.isQcTag()) {
                                    sIDs.push(datum.id);
                                    sIDs.length >= 4 && sIDs.splice(1, 1);
                                    context.enter(iD.modes.Select(context, sIDs));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 只能shift选择同种类型的数据
    // function filterShift(datum){
    //     var enable = iD.Layers.getCurrentEnableLayer();
    //     var sIds = context.selectedIDs();
    //     var gobj = context.graph().entity(sIds[0] || datum.id);
    //     if (enable.isRoad() && (gobj.layerInfo().isLine() || gobj.layerInfo().isRoad()) && !datum.loc) {
    //     	return (gobj.layerId === datum.layerId);
    //     } else if ((enable.isArea() && gobj.layerInfo().isArea() || 
    //     		enable.isLine() && gobj.layerInfo().isLine()) && !datum.loc) {
    //     	return (gobj.layerId === datum.layerId);
    //     } else if (enable.isPoint() && gobj.layerInfo().isPoint()) {
    //     	return (gobj.layerId === datum.layerId);
    //     }
    //     return false;
    // }

    // 过滤新增类型
    function filter(datum) {
        // 过滤新增类型渲染数据 {marker,polyline,polygon}
        if (datum instanceof iD.Entity) {
            if (datum.g() && datum.g().g()) {
                if (datum.remove && datum.parent) {
                    context.map().removeOverlays(datum.parent);
                    context.event.drawoverlayers();
                }
                datum.editable && context.enter(iD.modes.NewSelect(context, context.selectedIDs(), datum));
                return true;
            }
        }
        // 过滤交通规则
        if (!(datum instanceof iD.Entity) || datum instanceof iD.Transportation) {
            if (datum instanceof iD.Transportation) {
                context.enter(iD.modes.Select(context, context.selectedIDs(), datum));
                return true;
            }
        }
        if (datum instanceof iD.Way && datum.isOneRoadCrossWay()) {
            return true;
        }
        return false;
    }

    function insectTrans(datum) {
        return true;  //暂取消事物判断处理
        if (datum) {
            if (datum instanceof iD.Way) {
                return iD.util.wayInPlyGonx(datum, context);
            } else if (datum instanceof iD.Node) {
                return iD.util.nodeInPlyGonx(datum, context);
            }
        }
        return false;
    }

    //取消所有高亮
    // function cancleHighlight() {
    //     var sf = context.surface();
    //     sf.on('dblclick.select', null)
    //         .selectAll('.selected')
    //         .classed('selected', false);
    //     context.map().on('drawn.select', null);
    //
    // }

    //如果是品控Tag标，则显示相应的问题描述弹框
    function showQcDesc(datum) {}

    // 扩展应用
    function extendDeal(datum) {
        console.log(datum);
//		地图的要素点击事件增加埋点   （selected未生效，加在click事件中）
        // 事务层entity，没有osmId方法
        if(!datum || !datum.osmId){
            context.event.selected([]);
        }/*else if(datum.osmId){
			iD.logger.editElement({
                'tag': "selected_target", 
                'entityId': datum.osmId() || '',
                'modelName': datum.modelName
            });
        }*/
        showQcDesc(datum);
        context.click_callback && context.click_callback.call(this, datum, context.mouse());
        return;
        context.click_callback && context.click_callback.call(this, datum, context.mouse());
        // var layer = context.layers().getCurrentEnableLayer();
        var layer = context.layers().getLayer();
        if (layer && layer.isHotspot() && layer.lastIds.length) {
            context.hotspot_click_callback && context.hotspot_click_callback.call(this, {
                "id": layer.lastIds
            });
        }

    }

    var behavior = function(selection) {
        d3.select(window)
            .on('keydown.select', keydown)
            .on('keyup.select', keyup);

        var lastMousePos,
            lastMouseTarget,
            clickTimeId;


        //the drag behover sometimes block the "click" events, no idea why, so hack to trigger click
        selection.on('mousedown.select', function(d) {
                lastMousePos = [d3.event.clientX, d3.event.clientY];

                lastMouseTarget = d3.event.target;
            })
            .on('mouseup.select', function(d) {
                iD.UserJobHeartbeat.setJobStatus();
                if (!d3.select(d3.event.target).datum()) {
                    return;
                }
                

                var upPos = [d3.event.clientX, d3.event.clientY]

                if (d3.event.target === lastMouseTarget &&
                    iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {

                    var targetEvent = d3.event;

                    if (clickTimeId) {
                        clearTimeout(clickTimeId);
                    }

                    clickTimeId = setTimeout(function() {

                        //console.warn('Downup click triggered');

                        clickTimeId = null;

                        var oldEvent = d3.event;

                        d3.event = targetEvent;

                        click();

                        d3.event = oldEvent;

                        targetEvent = null;

                    }, 250);
                }
                    
//          	lastMousePos = null;
//          	lastMouseTarget = null;
                
            })
            .on('click.select', function() {
                iD.UserJobHeartbeat.setJobStatus();
                if (clickTimeId) {
                    clearTimeout(clickTimeId);
                    clickTimeId = null;
                }
                
                var upPos = [d3.event.clientX, d3.event.clientY]
                if (lastMousePos && iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {
                	click();
                }
                
                lastMousePos = null;
                lastMouseTarget = null;

            });

        keydown();
    };

    behavior.off = function(selection) {
        d3.select(window)
            .on('keydown.select', null)
            .on('keyup.select', null);

        selection.on('click.select', null);
        selection.on('mouseup.select', null);
        selection.on('mousedown.select', null);

        keyup();
    };

    return behavior;
};