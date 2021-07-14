/**
 * 左侧的属性列表（任务列表已改为在ui/background.js中初始化）
 * hover、select等时，都会经过该类，创建属性编辑列表
 * @param {Object} context
 */
iD.ui.Sidebar = function(context) {
    var inspector = iD.ui.Inspector(context),
        layerPane,
        current;
    
    // 标记图层的dataLayer，根据数组顺序决定优先显示的列表
    var tagModelNames = [
        iD.data.DataType.CHECK_TAG,
        iD.data.DataType.COMPILE_CHECK_TAG,
        iD.data.DataType.AUTO_COMPLETECHECK_TAG,
        iD.data.DataType.AUTO_CHECKWORK_TAG,
        iD.data.DataType.POINT_TAG,
        iD.data.DataType.AUTO_NETWORK_TAG,
        iD.data.DataType.QUALITY_TAG
    ];
    
    var renderMapping =  {
    	DEFAULT: null
    };
    var inspectorTagList;
    if(iD.ui.InspectorTagList){
        renderMapping[iD.data.DataType.AUTO_CHECKWORK_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.AUTO_CHECKWORK_TAG);
		renderMapping[iD.data.DataType.COMPILE_CHECK_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.COMPILE_CHECK_TAG);
		renderMapping[iD.data.DataType.AUTO_COMPLETECHECK_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.AUTO_COMPLETECHECK_TAG);
        renderMapping[iD.data.DataType.CHECK_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.CHECK_TAG);
        renderMapping[iD.data.DataType.QUALITY_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.QUALITY_TAG);
		renderMapping[iD.data.DataType.POINT_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.POINT_TAG);
    	renderMapping[iD.data.DataType.AUTO_NETWORK_TAG] = iD.ui.InspectorTagList(context, iD.data.DataType.AUTO_NETWORK_TAG);
		renderMapping["DEFAULT"] = renderMapping[iD.data.DataType.QUALITY_TAG];
    }
    
    function getTagListRender(){
    	if(!iD.ui.InspectorTagList) return null;
    	var nowModelName;
    	for(var mname of tagModelNames){
    		var layer = iD.Layers.getLayersByModelName(mname)[0];
    		if(layer && layer.display){
    			nowModelName = mname;
    			break;
    		}
    	}
    	if(nowModelName){
    		return renderMapping[nowModelName] || renderMapping.DEFAULT;
    	}
    	// 没有显示状态 的图层
    	return ;
    }
    function clearHtml($wrap){
    	$wrap.selectAll('*').data([]).exit().remove();
    }

    function sidebar(selection) {
    	inspectorTagList = getTagListRender();
    	// 初始化图层列表面板的位置
    	// 图层列表
    	//layerPane = iD.ui.LayerPane(context);
        var layerWrap = selection.append('div')
            .attr('class', 'layer-pane');
            // .call(layerPane);

        // selection.call(iD.ui.Notice(context));
		// 属性列表（选中、hover时的属性）
        var inspectorWrap = selection.append('div')
            .attr('class', 'KDSEditor-inspector-hidden KDSEditor-inspector-wrap KDSEditor-fr');
        // 打标列表
        // var inspectorTagListWrap = selection.append('div')
        //     .attr('class', 'KDSEditor-inspector-hidden KDSEditor-inspector-taglist-wrap KDSEditor-fr');
            
        var hoverLast;

        sidebar.hover = function(id) {
    		inspectorTagList = getTagListRender();
    		var reHover = false;
    		if(id != hoverLast){
    			hoverLast = id;
    			reHover = true;
    		}
//      	if(inspectorTagList.isMatchType(id)){
//          	return ;
//          }
//      	if(!id){
            var isVisible = isVisibleInspetror(id);
            if(!id || (inspectorTagList && inspectorTagList.isMatchType(id))){
        		isVisible = false;
            	if(reHover){
            		// inspectorTagListWrap.classed('KDSEditor-inspector-hidden', false);
//          		inspectorTagList && inspectorTagListWrap.call(inspectorTagList);
            	}
        	}
            /*
            if(!id || (inspectorTagList && inspectorTagList.isMatchType(id))){
            	isVisible = false;
            	inspectorTagListWrap.classed('KDSEditor-inspector-hidden', false);
            }
            */
            if(!isVisible){
                layerWrap.classed('KDSEditor-inspector-hidden', false);
                inspectorWrap.classed('KDSEditor-inspector-hidden', true)
                    .classed('KDSEditor-inspector-hover', false);
                return;
            }

            if (!current && id) {
                layerWrap.classed('KDSEditor-inspector-hidden', true);
                inspectorWrap.classed('KDSEditor-inspector-hidden', false)
                    .classed('KDSEditor-inspector-hover', true);
                // inspectorTagListWrap.classed('KDSEditor-inspector-hidden', true);

                if (inspector.entityID() !== id || inspector.state() !== 'hover') {
                    inspector
                        .state('hover')
                        .entityID(id);

                    inspectorWrap.call(inspector);
                }
            } else if (!current) {
                layerWrap.classed('KDSEditor-inspector-hidden', false);
                inspectorWrap.classed('KDSEditor-inspector-hidden', true);
                inspector.state('hide');
            }
        };

        sidebar.hover = _.throttle(sidebar.hover, 200);

        sidebar.update = function() {
            layerWrap.selectAll('div').remove();
            //layerWrap.call(layerPane);
        }

        sidebar.select = function(id, newFeature) {
    		inspectorTagList = getTagListRender();
            var isVisible = isVisibleInspetror(id);
            if(!id || (inspectorTagList && inspectorTagList.isMatchType(id))){
            	isVisible = false;
            	// inspectorTagListWrap.classed('KDSEditor-inspector-hidden', false);
            	// inspectorTagList && inspectorTagListWrap.call(inspectorTagList, id);
            }
            
            if(!isVisible){
                layerWrap.classed('KDSEditor-inspector-hidden', false);
                inspectorWrap.classed('KDSEditor-inspector-hidden', true)
                    .classed('KDSEditor-inspector-hover', false);
                return;
            }

            if (!current && id) {
                layerWrap.classed('KDSEditor-inspector-hidden', true);
                inspectorWrap.classed('KDSEditor-inspector-hidden', false)
                    .classed('KDSEditor-inspector-hover', false);
                // inspectorTagListWrap.classed('KDSEditor-inspector-hidden', true);

                if (newFeature || inspector.entityID() !== id || inspector.state() !== 'select') {
                    inspector
                        .state('select')
                        .entityID(id)
                        .newFeature(newFeature);

                    inspectorWrap.call(inspector);
                }
            } else if (!current) {
                layerWrap.classed('KDSEditor-inspector-hidden', false);
                inspectorWrap.classed('KDSEditor-inspector-hidden', true);
                inspector.state('hide');
            }
        };
        
        // 删除了质检标记时需要刷新列表
//      context.event.on('delete.sidebar', function(data){
//      	if(data && data.selectedIDs && data.selectedIDs.length){
//      		inspectorTagList && inspectorTagListWrap.call(inspectorTagList, null, true);
//      	}
//      });
        context.history().on('undone.sidebar', function(){
        	inspectorTagList && inspectorTagListWrap.call(inspectorTagList);
        }).on('redone.sidebar', function(){
        	inspectorTagList && inspectorTagListWrap.call(inspectorTagList);
        }).on('change.sidebar', function(difference, extent){
    		if(!difference && extent){
    			// merge操作，第二个参数为范围
    			// save后重新加载、恢复历史记录都会触发history中的merge
    			var sid = context.selectedIDs().length == 1 ? context.selectedIDs()[0] : null;
    			inspectorTagList && inspectorTagListWrap.call(inspectorTagList, sid, true);
			}else if(difference){
				// 增、删、改的情况
                var changes = _.values(_.values(difference.changes())[0]);
                if(_.compact(changes).length == 2 && changes[0].loc && changes[1].loc 
                    && !_.isEqual(changes[0].loc, changes[1].loc)){
                    return ;
                }
				var listChanged = false;
				for(var entity of changes){
					if(!entity) continue;
					if(entity.modelName in renderMapping){
						listChanged = true;
						break;
					}
				}
    			var sid = context.selectedIDs().length == 1 ? context.selectedIDs()[0] : null;
				inspectorTagList && listChanged && inspectorTagListWrap.call(inspectorTagList, sid, true);
			}
    	});
        context.ui().layermanager.on('change.sidebar', function(lay){
        	if(!lay || lay._parentType != 'elements'){
        		return ;
        	}
        	var isTagLayer = false;
        	for(var mname of tagModelNames){
        		if((lay.children || []).indexOf(mname) > -1){
        			isTagLayer = true;
        			break;
        		}
        	}
        	// 点击标记图层
        	if(!isTagLayer){
        		return ;
        	}
        	inspectorTagList = getTagListRender();
        	
        	// clearHtml(inspectorTagListWrap);
        	if(inspectorTagList){
        		inspectorTagListWrap.call(inspectorTagList, true);
        	}
	    });
	    

        sidebar.show = function(component) {
            layerWrap.classed('KDSEditor-inspector-hidden', true);
            inspectorWrap.classed('KDSEditor-inspector-hidden', true);
            if (current) current.remove();
            current = selection.append('div')
                .attr('class', 'KDSEditor-sidebar-component')
                .call(component);
        };

        sidebar.hide = function() {
            layerWrap.classed('KDSEditor-inspector-hidden', false);
            inspectorWrap.classed('KDSEditor-inspector-hidden', true);
            // inspectorTagListWrap.classed('KDSEditor-inspector-hidden', false);
            if (current) current.remove();
            current = null;
            // add 去掉多选道路编辑dom元素
            removeMutiRoadEditor();
        };

        function getNodeParentWaysNum(node)
        {
           var count=0;
            context.graph().parentWays(node).forEach(function(way){
                if(!way.isOneRoadCrossWay())
                {
                    count++;
                }
            })
            return count;
        }
        //检查不应该显示属性面板的要素
        function isVisibleInspetror(id){
            var flag = true,
                entity = context.hasEntity(id);
            //DVR entities will not in the current graph
            if(!entity){
                return false;
            }
        	var blanks = context.variable.blankFieldList || [];
			return !blanks.includes(entity.modelName);

            //如果当前选择节点非RoadNode和RoadCross，则不激活属性面板
            //只适用于线和面上的节点
            if(id && (entity = context.entity(id))){
                var geometry = context.geometry(id);
                if(geometry === 'vertex'){
                    //说明是线上点
                    //在判断当前点的datatype
                    if([iD.data.DataType.DIVIDER_NODE, 
                    	iD.data.DataType.ROAD_NODE/*,
                    	iD.data.DataType.FUSION_DIVIDER_NODE*/].includes(entity.modelName)){
                        return true;
                    }
                    if(!entity.isRoadNode() && !entity.isRoadCross()){
                        flag = false;
                    }

                    //只显示伪节点属性,屏蔽悬挂节点和三阶及以上节点
                    if(!entity.isRoadCross()&&getNodeParentWaysNum(entity) != 2){
                        return false;
                    }
                }else if (geometry === 'line' && entity.isOneRoadCrossWay()){
                    //如果选择的是复杂路口的逻辑线，则不显示属性面板
                    flag = false;
                }
               /* if(typeof entity['_type']  != 'undefined' && entity['_type'] == "QC_TAG"){
                    //品控，不显示属性面板
                    flag = false;
                }*/
                //品控不显示属性面板
                if(entity && entity.tags && entity.modelName =='QC_TAG'){
                    flag = false;
                }
                /*
                if(typeof entity['modelName']  != 'undefined'
                    && entity['modelName'] == iD.data.Constant.C_NODE){
                    //综合交叉点，不显示属性面板
                    flag = false;
                }
                */
            }
            return flag;
        }
        function removeMutiRoadEditor(){
            //在左边sildebar，多选编辑道路属性
            var multiEditRoad=d3.event && d3.event._multiEditRoadProp
            if(multiEditRoad){

            }else{
                var multiEditor=d3.selectAll("#KDSEditor-sidebar #multiRoadEditor_footer");
                if(multiEditor.size()>0){
                    multiEditor.remove();
                }
            }
            
             
        }
		
		context.connection().on('loaded.sidebar', function(){
			sidebar.select();
		});
    }

    sidebar.hover = function() {};
    sidebar.select = function() {};
    sidebar.show = function() {};
    sidebar.hide = function() {};
    sidebar.update = function() {

    };

    return sidebar;
};
