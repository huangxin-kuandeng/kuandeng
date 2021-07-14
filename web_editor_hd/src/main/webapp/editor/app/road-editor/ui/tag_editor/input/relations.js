/**
 * 关系面板，道路分割线点击某个节点后，左侧面板会出现关系列表；
 * @param {Object} context
 * @param {Object} relationModelName
 */
iD.ui.TagEditorInput.relations = function(context,relationModelName) {
    var event = d3.dispatch('change', 'delete'),
        vertexID,
        fromNodeID,
        relationID,
        relationRestrictionIDs = [],
        selectWayID,
        restrictionGroups = [],
        restrictionNum = 1;
    var state = 'select';
    var eventNS = '.rel_' + relationModelName;
    var rawTagEditor = iD.ui.RawTagEditor(context)
        .on('change' + eventNS, changeTags);
    var relationVersion;

    //获取当前车道限制分组索引
    function getRestrictionGroupsIndex() {
        var index =  -1;
        for (var i = 0; i < restrictionGroups.length; i++) {
            var resriction = restrictionGroups[i];
            if (resriction.style('display') == 'block') {
                index = i;
                break;
            }
            
        }
        return index;
    }

    function layerEditable(modelName){
        if(!modelName) return false;
        var layer = iD.Layers.getCurrentModelEnableLayer(modelName);
        return layer && layer.editable;
    }

    function changeTags(changed) {
        var selectResrictionIndex = getRestrictionGroupsIndex();
        var isLAR = true;
        // var keys = ['TYPE', 'TIME', 'VEHICLE', 'WEATHER', 'SOURCE', 'TASKID', 'BATCH', 'SEQ'];
        // _.forInRight(changed, function(value, key) {
        //     var index = _.indexOf(keys, key);
        //     isLAR = index != -1 ? true : false;
        // });
        var changeId;
        // if (relationModelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION) {
        if (relationModelName == iD.data.DataType.LANE_ATTRIBUTE && isLAR) {
            changeId = relationRestrictionIDs[selectResrictionIndex];
//          if (!changeId) return;
        }
        // LA和LAR都会走这个逻辑，LA是模板渲染，模板中change事件有4个参数，否则只有1个参数；
        if(!changeId || arguments.length > 1){
        	changeId = relationID;
        }

        var entity = context.entity(changeId);
        var actions_array = [],
        	modelName = entity.modelName || "",
            logger_tag = "change_"+modelName;
        var key = _.keys(changed  ).toString();
        var  ob = [{
            'attributeName': key || '',
            'originalValue': entity.tags[key] || '',
            'newValue':_.values(changed).toString() || '',
            'action':'update'
        }]
        // iD.logger.editElement({
        //     'tag': 'propertyPanel', 
        //     modelName, 
        //     'entityId':entity.osmId() || '',
        //     'type': '',
        //     'msg': '',
        //     'action': null,
        //     'child_event_name': ob
        // });
		
		context.buriedStatistics().merge(0, modelName);
		
        tags =_.extend({}, entity.tags, changed);
        // var chnName = getChnName(changed, entity,primaryKey);
        var msg = "更改"+Object.keys(changed).toString()// + chnName;



        //针对 changed 对象跟原值比较，可以单独对change进行相关处理，去掉undifined和自定义tags以外的name属性，防止破坏原有数据结构
        // _.forEach(changed,function(value,name,obj){if( _.isUndefined(value) || _.isUndefined(entity.tags[name])){delete obj[name]}});
        if(_.isEmpty(changed)){
            return ;
        }
        if(!iD.util.tagChanged(entity.tags, changed)){
        	return ;
        }

		// iD.logger.editElement(logger_tag,modelName,"",msg);			//修改DA、LA属性时增加埋点
		
        actions_array.push(iD.actions.ChangeTags(changeId, tags));

        actions_array.push(msg);
        context.perform.apply(this,actions_array);
        // context.perform(iD.actions.Noop(),msg);
        // context.replace.apply(this,actions_array);


    }
    function waysFilter(highways,vertexID){
        var ways = [];
        if(!vertexID){
            return ways;
        }
        for(var i=0,len=highways.length;i<len;i++){
            if(highways[i].modelName != iD.data.DataType.DIVIDER){
                continue;
            }
            //TODO 需要增加方向判断
            let direction = highways[i].tags && highways[i].tags.DIRECTION;
            if(direction === '3'){
                if(highways[i].last() == vertexID
                    || (highways[i].nodes.includes(vertexID) && highways[i].first() != vertexID)){
                    ways.push(highways[i]);
                }
                continue;
            }

            if(highways[i].first() == vertexID ||
                (highways[i].nodes.includes(vertexID) && highways[i].last() != vertexID)){
                ways.push(highways[i]);
            }
        }
        return ways;
    }
    
    function restrictions(selection, svgChange) {
    	if(!context.hasEntity(vertexID)){
    		restrictions.destroy();
    		return ;
    	}
        if(selection.node().offsetWidth == 0 && selection.node().offsetHeight == 0){
            // 不显示时注销事件
            restrictions.destroy();
            return ;
        }

        !svgChange && clearTagEditor();
        if(svgChange){
            selection.selectAll('.preset-input-wrap').remove();
        } else {
            // restrictionGroups = [];
//          restrictionNum = 1;
			clearRestrictionGroups();
        }
        var wrap = selection.selectAll('.preset-input-wrap')
            .data([0]);
        if(svgChange){
            var enter = wrap.enter().insert('div', ':first-child')
                .attr('class', 'preset-input-wrap');
        }else {
            var enter = wrap.enter().append('div')
                .attr('class', 'preset-input-wrap');
        }
        selection.selectAll('div.preset-relation-btns').data([0]).enter()
            .append('div').attr('class', 'preset-relation-btns clearfix');
        selection.selectAll('div.preset-input-relation').data([0]).enter()
            .append('div').attr('class', 'preset-input-relation');

        //
        if(relationModelName == iD.data.DataType.LANE_ATTRIBUTE && selection.selectAll('.restrictiongroups')[0].length == 0) {
            //车道限制信息组
            selection.selectAll('div.restriction_groups').data([0]).enter()
                .append('div')
                .attr('class', 'restrictiongroups');
            /*var group = selection.selectAll('div.restriction_group_' + restrictionNum).data([0]).enter()
                .append('div')
                .attr('class', 'restrictiongroup_' + restrictionNum);

            //车道限制信息按钮
            group.selectAll('div.restriction-relation-btns').data([0]).enter()
                .append('div').attr('class', 'restriction-relation-btns clearfix');
            //车道限制信息列表
            let restrictionInputRelation = group.selectAll('div.restriction-input-relation').data([0]).enter()
                // .append('div').attr('class', 'restriction-input-relation collapse in')
                .append('div').attr('class', 'restriction-input-relation')
                .attr('restrictionindex', restrictionNum)
                .style('display', 'none');

            restrictionGroups.push(restrictionInputRelation);*/
        }

        enter.append('div')
            .attr('class', 'restriction-help');

        enter.append('svg')
            .call(iD.svg.Surface(context))
            .call(iD.behavior.Hover(context));

        var graph = context.graph(),
            vertex = graph.entity(vertexID),
            highways = graph.parentWays(vertex);
        var surface = wrap.selectAll('svg'),
            filter = function () { return true; },
            extent = iD.geo.Extent(),
            projection = iD.geo.RawMercator(),
            lines = iD.svg.Lines(projection, context),
            vertices = iD.svg.Vertices(projection, context),
            ways = waysFilter(highways,vertexID);
        // turns = iD.svg.Turns(projection, context);
        var d = wrap.dimensions(),
            c = [d[0] / 2, d[1] / 2],
            z = 24;
        if(ways.length<1){
            selection.remove()
        }
        projection
            .scale(256 * Math.pow(2, z) / (2 * Math.PI));

        var s = projection(vertex.loc);

        projection
            .translate([c[0] - s[0], c[1] - s[1]])
            .clipExtent([[0, 0], d]);

        //新增属性面板，需要对LA\DA样式渲染，跟地图和视频保持一致。--Tilden
        var relations = graph.parentRelations(vertex, relationModelName), execEffect = false;
        var laBtn = d3.select('#effects-lane-highlight').classed('active');
        var daBtn = d3.select('#effects-divider-attr-highlight').classed('active');
        if (relationModelName == iD.data.DataType.DIVIDER_ATTRIBUTE) {
            if (relations.length != 0 && daBtn) {
                execEffect = true;
            }
        } else if (relationModelName == iD.data.DataType.LANE_ATTRIBUTE) {
            if (relations.length != 0 && laBtn) {
                execEffect = true;
            }
        }
        // DIVIDER_NODE DASHTYPE == 4（强制打断点）时，允许渲染特效；
        if(vertex.modelName == iD.data.DataType.DIVIDER_NODE && vertex.tags.DASHTYPE == '4'){
        	execEffect = true;
        }

        surface
            .call(vertices, graph, [vertex], filter, extent, z, execEffect)
            .call(lines, graph, ways, filter, {
            	isThumbnail: false,  //TODO 写的什么玩意 用都用不了 废弃不执行
            	selectedID: vertexID
            })

        surface
            .on('click' + eventNS, click)
            .on('mouseover' + eventNS, mouseover)
            .on('mouseout' + eventNS, mouseout);

        surface
            .selectAll('.selected')
            .classed('selected', false);

        if (fromNodeID) {
            let filterWay = _.find(ways, function(way) { return way.contains(fromNodeID); });
            filterWay && selectEntity(filterWay.id);
        }
        if(!relationID){
            clearTagEditor();
        }else {
        	var r = context.hasEntity(relationID);
        	if(r) relationVersion = r.v;
        	else relationVersion = undefined;
        }
        // 设置标题
        mouseout();
		
		var isOperate = false;
        context.history()
        	.on('redone' + eventNS, function(){
        		isOperate = true;
        	})
        	.on('undone' + eventNS, function(){
        		isOperate = true;
        	})
            .on('change' + eventNS, function(changed){
            	if(isOperate){
            		isOperate = false;
            		var dar = changed && changed.summary()[0];
            		var changeType = dar && dar.changeType;
            		dar = dar && dar.entity;
            		var isself = eventNS.indexOf(iD.data.DataType.LANE_ATTRIBUTE) > -1
            			|| eventNS.indexOf(iD.data.DataType.DIVIDER_ATTRIBUTE) > -1
            			|| eventNS.indexOf(iD.data.DataType.BARRIER) > -1;
            		//  isla && dar && dar.modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION
            		if(isself && dar){
						// 限行信息前进、后退等操作，刷新面板
						// changeType == 'modified'
						restrictions(selection, false);
					}
//					restrictions(selection, false);
            		return ;
            	}
            	/*
            	// 后退/撤销操作时，可能导致selectWayID不正确；
            	var allWays = context.graph().parentWays(context.entity(vertexID));
            	var hasid = false;
            	for(var w of allWays){
            		if(w.id == selectWayID){
            			hasid = true;
            			break;
            		}
            	}
            	if(!hasid){
            		var _way = showDefaultRelaion(allWays);
            		selectWayID = _way && _way.id;
            		clearTagEditor();
            		render();
            		renderTag();
            	}
            	*/
//          	clearTagEditor();
//          	render();
				var r = relationID && context.hasEntity(relationID);
				if(r){
					if(changed){
						var deleteRel = changed.deleted()[0];
						// DA字段更改时，其他svg也刷新
						var dar = _.values(changed.changes())[0];
						dar = dar && dar.head || deleteRel;
						if(!dar){}
						else if(dar.modelName == iD.data.DataType.DIVIDER_ATTRIBUTE){
							restrictions(selection, true);
						}
					}
					if(relationVersion == r.v) return ;
				}else if(!r) {
					relationVersion = undefined;
					restrictions(selection, true);
					return ;
				}
				// 是否为属性变更
				var fieldChange = false;
				if(changed){
					var created = changed.created();
					if(created.length == 1 && created[0].modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION){
						fieldChange = true;
					}else {
						fieldChange = !_.isEmpty(changed.changes()) && !created.length;
					}
				}
				restrictions(selection, fieldChange);
            });
        // 更新特效
        context.event.on('changeeffect' + eventNS, render);

        d3.select(window)
            .on('resize' + eventNS, render);
        
        if(!svgChange) showDefaultRelaion(ways);
        
	    /**
	     * 默认显示第一条DA/LA
	     */
	    function showDefaultRelaion(ways){
	    	var result;
	    	graph = context.graph();
	    	for(var way of ways){
	    		var relations = graph.parentRelations(way, relationModelName);
	    		if(!relations.length) continue;
	            var RBR = getRoleByRealations(relations, way, iD.data.RoleType.DIVIDER_ID);
	            if (RBR.exec) {
	            	result = way;
	            	selectEntity(way.id);
	                deleteRelations(way, false);
	                break;
	            }
	    	}
	    	return result;
	    }
	
		function selectEntity(entityid){
			surface
	            .selectAll('.selected')
	            .classed('selected', false);
	        entityid && surface
	            .selectAll('.' + entityid)
	            .classed('selected', true);
		}
	
	    function getRoleByRealations(relations, datum, modelName) {
	    //    entity.memberByRole(iD.data.RoleType.DIVIDER_ID).id
	        for (var i =0; i < relations.length; i++) {
	            var relation = relations[i];
	            if (relation && datum && relation.memberByRole(modelName)) {
	                if (datum.id == relation.memberByRole(modelName).id) {
	                    return {
	                        exec: true,
	                        relation: relation
	                    };
	                }
	            }
	        }
	        return {
	            exec: false
	        };
	    }

        function click() {
            var datum = d3.event.target.__data__;

            if(datum instanceof iD.Way){
            	selectEntity(datum.id);
                clearTagEditor();
                var node = context.graph().entity(vertexID);
                var res = context.graph().parentRelations(node, relationModelName);
                var RBR = getRoleByRealations(res, datum, iD.data.RoleType.DIVIDER_ID);
                if (RBR.exec) {
                	// 点击线，切换DIVIDER时，清空限行信息渲染
                	// 清空上个v记录
                	relationVersion = undefined;
                    clearRestrictionGroups();
                    deleteRelations(datum, false);
                } else {
                    selection.selectAll('.preset-relation-btns').select('a.res-rel-delete').remove();
			        // 车道线作业员、质检员，只能查看/删除DA、LA，不能添加和更改；
			        // if(relationModelName == iD.data.DataType.DIVIDER_ATTRIBUTE){
			        // 	// 20181101 线性编辑显示DA -@lixiaoguang
			        // }else if(iD.User.isLinearRole()){
			        	// var _rels = graph.parentRelations(graph.entity(vertexID), relationModelName);
			        	// if(!_rels.length) return ;
			        //  }

                    if (!selection.selectAll('div.preset-input-relation').empty() && layerEditable(relationModelName)) {
                        var info = "DA";
                        if (relationModelName == iD.data.DataType.LANE_ATTRIBUTE) {
                            info = "LA";
                            d3.select(".tag-lane-attribute .preset-input-relation").style("display", "none");
                            d3.select(".tag-lane-attribute .restriction-relation-btns").style("display", "none");
                            // d3.select(".tag-lane-attribute .restriction-input-relation").style("display", "none");
                        } else {
                            d3.select(".tag-divider-attribute .preset-input-relation").style("display", "none");
                        }
                        selection.selectAll('.preset-relation-btns')
                            .append('a')
                            .attr('class', 'res-rel-delete')
                            .text("添加"+info)
                            .on('click' + eventNS, function() {
                                if (relationModelName == iD.data.DataType.LANE_ATTRIBUTE) {
                                    d3.select(".tag-lane-attribute .preset-input-relation").style("display", "block");
                                    d3.select(".tag-lane-attribute .restriction-relation-btns").style("display", "block");
                                } else {
                                    d3.select(".tag-divider-attribute .preset-input-relation").style("display", "block");
                                }
                                deleteRelations(datum, true);
                            });
                    }
                }
            }
        }
        //判断模型是否可编辑，如果可编辑则显示功能，否则不显示 Tilden
        function getEditable(modelName) {
            var entity = context.entity(selectWayID);
            var lay = iD.Layers.getLayer(entity.layerId);
            if (lay && !lay.isModelEditable(modelName)) {
                return false;
            }
            return true;
        }

        //DA 删除关系按钮逻辑添加
        function deleteRelations(datum, isAdd) {
            selectWayID = datum.id;
            fromNodeID = datum.nodes[(datum.first() === vertexID) ? 1 : datum.nodes.length - 2];
            var rel = getRelation(null, isAdd);
            render();
            renderTag();
            
            selection.selectAll('.preset-relation-btns').select('a.res-rel-delete').remove();
            var RBR = getRoleByRealations([rel], datum, iD.data.RoleType.DIVIDER_ID);
            if (RBR.exec && !selection.selectAll('div.preset-input-relation').empty() && layerEditable(relationModelName)) {
                var info = "DA";
                if (relationModelName == iD.data.DataType.LANE_ATTRIBUTE) {
                    info = "LA";
                    d3.select(".tag-lane-attribute .preset-input-relation").style("display", "block");
                } else {
                    d3.select(".tag-divider-attribute .preset-input-relation").style("display", "block");
                }
                selection.selectAll('.preset-relation-btns')
                    .append('a')
                    .attr('class', 'res-rel-delete')
                    .text("删除"+info)
                    .on('click' + eventNS, clickDelete);
            }

            if (RBR.exec && relationModelName == iD.data.DataType.LANE_ATTRIBUTE) {
                var rels = graph.parentRelations(rel), relation;
                // var restrictionInputRelations = selection.selectAll(".restriction-input-relation")[0];
                // if (restrictionInputRelations.length - 2 > rels.length) {
                //     return;
                // }
                for (var i = 0; i < rels.length; i++) {
                    // if (rels[i].modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION) {
                        relation = rels[i];
                    addRestrictionDom();
                    addRestrictionBtn();
                    renderRestrictionTag(relation, (i+1));
                    removeRestrictionBtn(restrictionNum);
                    restrictionNum++;
                        // render();
                    // }
                }
                if (rels.length != 0 || restrictionNum == 1) {
                    addRestriction();
					// 显示第一个限行信息
					// 最后一个为“添加限行信息”按钮
					restrictionGroups.slice(0, restrictionGroups.length - 1).forEach(function($group, idx){
                        let $relationBtns = d3.select($group.node().parentElement).select('.restriction-relation-btns.clearfix');
                        if (iD.util.urlParamHistory() || $relationBtns.html() == '') {
                            $group.style('display', 'block');
                        } else {
                            if(idx == 0) {
                                $group.style('display', 'block');
                                return ;
                            }
                            $group.style('display', 'none');
                        }
					});
                }
            }
        }
        function addRestrictionDom(){
            var restrictiongroups = selection.selectAll('.restrictiongroups');
            var group = restrictiongroups.selectAll('div.restriction_group_' + restrictionNum).data([0]).enter()
                .append('div')
                .attr('class', 'restrictiongroup_' + restrictionNum);

            //车道限制信息按钮
            group.selectAll('div.restriction-relation-btns').data([0]).enter()
                .append('div').attr('class', 'restriction-relation-btns clearfix');
            //车道限制信息列表
            let restrictionInputRelation = group.selectAll('div.restriction-input-relation').data([0]).enter()
            // .append('div').attr('class', 'restriction-input-relation collapse in')
                .append('div').attr('class', 'restriction-input-relation')
                .attr('restrictionindex', restrictionNum)
                .style('display', 'none');

            restrictionGroups.push(restrictionInputRelation);
        }
        function addRestrictionBtn() {

            if (!getEditable(iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION)) {
                return false;
            }

            selection.selectAll('.restrictiongroup_'+restrictionNum+' .restriction-relation-btns')
                .append('a')
                .attr('class', 'res-rel-delete')
                .attr('title', '添加车道限制信息关系')
                .text('添加车道限制_'+restrictionNum)
                .on('click' + eventNS, function() {
                    //let rel = selectLaneAttribute;
                    // let laRel = context.graph().parentRelations(rel);
                    // if (laRel.length != 0) {
                    var text = this.text;
                    var num = text.split("_")[1];
                    // d3.select('.tag-lane-attribute .restrictiongroup_'+num+' .restriction-input-relation').style("display", "block");
                    // d3.select('.tag-lane-attribute .restrictiongroup_'+num+' .restriction-input-relation').attr("class", " restriction-input-relation collapse show");
                    // }
                    renderRestrictionTag(null, num, true);
                    removeRestrictionBtn(num);
                    addRestriction();
                });
        }
        //添加车道信息关系按钮
        function addRestriction() {
            addRestrictionDom();
            selection.selectAll('.restrictiongroup_'+restrictionNum+' .restriction-relation-btns').select('a.res-rel-delete').remove();
            if (!selection.selectAll('div.preset-input-relation').empty() && layerEditable(iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION)) {
                addRestrictionBtn();

                restrictionNum++;

                if (restrictionGroups.length) {
                    for (var i = 0 ; i < restrictionGroups.length; i++) {
                        if (i == restrictionGroups.length - 2) {
                            restrictionGroups[i].style("display", "block");
                        } else {
                            restrictionGroups[i].style("display", "none");
                            // selection.selectAll('.tag-lane-attribute .restrictiongroup_' + restrictionGroups[i].attr("restrictionindex") + ' .glyphicon')
                            //     .attr("class", "glyphicon glyphicon-chevron-up res-rel-delete");
                        }

                        if(i != 0){
                            // restrictionGroups[i].style("display", "none");
                            selection.selectAll('.tag-lane-attribute .restrictiongroup_' + restrictionGroups[i].attr("restrictionindex") + ' .glyphicon')
                                .attr("class", "glyphicon glyphicon-chevron-up res-rel-delete");
                        }
                    }
                }
                // console.log("restrictionGroups:",restrictionGroups);
            }
        }
        //删除车道信息关系按钮
        function removeRestrictionBtn(num) {
            var numArr = [];
            if (num) {
                numArr.push(num);
            } else {
                numArr = _.compact(_.map(selection.selectAll(".restriction-input-relation")[0], function(ele){
                    return ele.getAttribute('restrictionindex');
                }));//compact:清空数组中false值， map：获取DOM数组中某个元素 ---Tilden
                // restrictionNum = parseInt(numArr[0])+1;
            }
            for (let i = 0; i < numArr.length; i++) {
                var num = numArr[i];
                selection.selectAll('.tag-lane-attribute .restrictiongroup_' + num + ' .restriction-relation-btns').selectAll('a.res-rel-delete').remove();
                if (selection.selectAll('.tag-lane-attribute .restrictiongroup_' + num + ' div.restriction-relation-btns a').empty() && layerEditable(iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION)) {
                    var $btns = selection.selectAll('.tag-lane-attribute .restrictiongroup_' + num + ' .restriction-relation-btns');
                    // selection.selectAll('.tag-lane-attribute .restrictiongroup_' + num + ' .restriction-input-relation')
                    //     .style('display', 'none');
                    // selection.selectAll('.restrictiongroup_'+num+' .restriction-relation-btns')
                    $btns.append('a')
                        .attr('class', 'glyphicon glyphicon-chevron-down res-rel-delete')
                        .attr('restrictionindex', num)
                        // .attr('data-toggle', 'collapse')
                        // .attr('data-target', '.restriction-input-relation')
                        .on('click' + eventNS, changeListShow);

                    $btns.append('a')
                        .attr('class', 'res-rel-delete')
                        .attr('title', '删除车道限制信息关系')
                        .attr('restrictionid', relationRestrictionIDs[num-1])
                        .text("删除车道限制_" + num)
                        .on('click' + eventNS, deleteRestriction);

                }
            }
        }
        function changeListShow() {
            var $this = $(this);
            var num = $this.attr("restrictionindex");
            var $relationlist = d3.selectAll(".restriction-input-relation")[0];
            for (var i = 0; i < $relationlist.length; i++) {
                var relation = $($relationlist[i]);
                var relationNum = relation.attr("restrictionindex");
                if (relationNum == num) {
                    if ($relationlist[i].style.display == "block") {
                        $relationlist[i].style.display = "none";
                        $this.attr("class", "glyphicon glyphicon-chevron-up res-rel-delete");
                    } else {
                        $relationlist[i].style.display = "block";
                        $this.attr("class", "glyphicon glyphicon-chevron-down res-rel-delete");
                    }

                } else {
                    $relationlist[i].style.display = "none";
                    d3.select(".restrictiongroup_"+relationNum).select(".glyphicon")
                        .attr("class", "glyphicon glyphicon-chevron-up res-rel-delete");
                }
            }
        }
        //删除车道限制信息关系逻辑
        function deleteRestriction() {
            // let entityid = selectWayID;
            var vertex = graph.entity(vertexID);
            var way = graph.entity(selectWayID);
           
            if(!way || relationModelName != iD.data.DataType.LANE_ATTRIBUTE){
                return ;
            }
            var g = context.graph();
            // var wayEntity = g.entity(entityid);
            let LArels = g.parentRelations(vertex, iD.data.DataType.LANE_ATTRIBUTE);
            var RAR = getRoleByRealations(LArels, way, iD.data.RoleType.DIVIDER_ID);
            if (RAR.exec) {
                // for (var i = 0; i < LArels.length; i++) {
                    var LArelation = RAR.relation;
                    var LAArels = g.parentRelations(LArelation, iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION);
                    var text = this.text;
                    if (text) {
                        var entityId = this.getAttribute("restrictionid");
                        var num = text.split("_")[1];
                        // var LAArelation = LAArels[parseInt(num) - 1];
                        var maplist = _.map(LAArels, function(ele){
                            return ele.id;
                        });
                        var restrictionindex =  _.indexOf(maplist, entityId);
                        var LAArelation = LAArels[restrictionindex];
                        if (LAArelation) {
                            context.perform(
                                iD.actions.DeleteMultiple([LAArelation.id], context),
                                t('operations.restriction.help.delete') + ' ' + iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION
                            );
                            iD.logger.editElement({
                                'tag': ("delete_"+LAArelation.modelName),
                                'entityId':LAArelation.osmId() || '',
                                'modelName': LAArelation.modelName
                            });
                            clearRestrictionTagEditor(num);
                        }
                    } else {
                        for (var i = 0; i < LAArels.length; i++) {
                            var LAArelation = LAArels[i];
                            context.perform(
                                iD.actions.DeleteMultiple([LAArelation.id], context),
                                t('operations.restriction.help.delete') + ' ' + iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION
                            );
                            iD.logger.editElement({
                                'tag': ("delete_"+LAArelation.modelName),
                                'entityId':LAArelation.osmId() || '',
                                'modelName': LAArelation.modelName
                            });
                        }
                        for (var j = 0; j < restrictionNum; j++) {
                            clearRestrictionTagEditor((j+1));
                        }
//                      restrictionGroups = [];
//                      relationRestrictionIDs = [];
//                      restrictionNum = 1;
                        clearRestrictionGroups();
                    }
            }
        }
        //删除LA关系
        function clickDelete(){
            let entityid = selectWayID;
            if(!entityid){
                return ;
            }
            
            deleteRestriction();
            let rel = getRelation();
            // iD.logger.editElement({
            //     'tag': ("delete_"+rel.modelName),
            //     'entityId':rel.osmId() || '',
            //     'modelName': rel.modelName
            // });
            context.buriedStatistics().merge(1, rel.modelName, 500);
            context.perform(
                iD.actions.DeleteMultiple([rel.id], context),
                t('operations.restriction.help.delete') + ' ' + relationModelName
            );
            clearTagEditor();
            // console.log('删除 ' + relationModelName + ": ", rel);
            event.delete({
                wayid: selectWayID,
                nodeid: fromNodeID
            });

            context.event.entityedite({entitys: []});
            fromNodeID = null;
            surface
                .selectAll('.selected')
                .classed('selected', false);
        }

        function createNewDividerAttribute(wayId, nodeId, modelName) {
        	// var isDA = modelName == iD.data.DataType.DIVIDER_ATTRIBUTE;
            
            if (modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION) {
            	var g = context.graph();
                var Rentity = null;
                var node = g.entity(vertexID);
                // var relIds = g.parentRelations(g.entities[wayId]);
                var currentRes = null;
                var laRel = g.parentRelations(node, iD.data.DataType.LANE_ATTRIBUTE).filter(function(r){
                	return r.memberByIdAndRole(selectWayID, iD.data.RoleType.DIVIDER_ID);
                })[0];

                if (laRel) {
                    var dividerAttributeMember = [{
                        id: laRel.id,
                        modelName: iD.data.DataType.LANE_ATTRIBUTE,
                        role: iD.data.RoleType["LANEA_ID"],
                        type: iD.data.GeomType.RELATION
                    }]
                }
                //}
            } else {
                var dividerAttributeMember = [
                    {
                        'id': wayId,
                        'modelName': iD.data.DataType.DIVIDER,
                        'role': iD.data.RoleType.DIVIDER_ID,
                        'type': iD.data.GeomType.WAY
                    }, {
                        'id': nodeId,
                        'modelName': iD.data.DataType.DIVIDER_NODE,
                        'role': iD.data.RoleType.DIVIDER_NODE_ID,
                        'type': iD.data.GeomType.NODE
                    }];
            }
            var currentLayer = iD.Layers.getCurrentModelEnableLayer(modelName);
            var dividerAttributeRelations = iD.Relation({
                modelName:modelName,
                identifier:currentLayer.identifier,
                members: dividerAttributeMember,
                layerId: currentLayer.id
            });
            dividerAttributeRelations.setTags(iD.util.getDefauteTags(dividerAttributeRelations, currentLayer));
            var actions = [iD.actions.AddEntity(dividerAttributeRelations)];
            var way = context.entity(wayId);
            var oldDirection = way.tags.DIRECTION;
            // 非首尾节点
            /*var isSplit = isDA && _.first(way.nodes) != vertexID && _.last(way.nodes) != vertexID;
            if(isSplit){
            	// DA新增时自动打断该线路，保留后半段LA
            	actions.push(iD.actions.SplitDivider(vertexID, context, true));
            }*/
            actions.push('新增关系');
            // var graph = context.graph().replace(dividerAttributeRelations);
            context.perform.apply(context, actions);
            context.buriedStatistics().merge(1, dividerAttributeRelations.modelName, 500);
            // iD.logger.editElement({
            //     'tag': ("create_"+relationModelName),
            //     'entityId':dividerAttributeRelations.osmId() || '',
            //     modelName
            // });
            /*if(isSplit) {
            	var node = context.entity(vertexID);
            	var newWays = context.graph().parentWays(node);
            	var oldWayid = selectWayID;
            	var selectWay;
            	// 正向时，该点是第二跟线的第一个点
            	// 逆向时，该点是第一根线的最后一个点
            	for(var w of newWays){
            		if(oldDirection == '3'){
            			if(w.nodes[w.nodes.length - 1] == vertexID){
            				selectWay = w;
            				break;
            			}
            		}else {
            			if(w.nodes[0] == vertexID){
            				selectWay = w;
            				break;
            			}
            		}
            	}
            	selectWayID = selectWay.id;
            	// 替换关系中的divider
            	context.replace(function(graph){
            		return graph.replace(dividerAttributeRelations.replaceMember(way, selectWay));
            	}, '新增关系');
            	if(graph){
            		graph = context.graph();
            	}
            	// 触发history change 重新渲染；
            }*/
            context.event.entityedite({entitys: [dividerAttributeRelations.id]});
            return dividerAttributeRelations;
        };

        function getRelation(modelName, isAdd){
            var relation = null;
            if(!selectWayID || !vertexID){
                return relation;
            }
            var graph = context.graph();
            var vertex = graph.entity(vertexID);
            // var ways = graph.parentWays(vertex);
            var way = graph.entity(selectWayID);
            /*for(var i in ways){
             let w = ways[i];
             if(w.id == selectWayID){
             way = w;
             break;
             }
             }*/
            // DIVIDER_ATTRIBUTE和LANE_ATTRIBUTE关系都是基于way的，不是node
            if (isAdd) {
//              var relations = graph.parentRelations(way, modelName || relationModelName);
                var relations = graph.parentRelations(way, relationModelName);
            } else {
                var relations = graph.parentRelations(way, relationModelName);
            }
            var RAR = getRoleByRealations(relations, vertex, iD.data.RoleType.DIVIDER_NODE_ID);
            var wayMember,nodeMember,_tempRealtion;

            //for(var i = 0,len = relations.length;i<len;i++){
            if (RAR.exec) {
                _tempRealtion = RAR.relation;
                // 多个relation时，根据选中的wayid、nodeid，尝试从relation中获取，都能获取到则为符合的relation
                if (modelName) {
                    var rels = graph.parentRelations(_tempRealtion, iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION);
                    for (var j = 0; j < rels.length; j++) {
                        if (rels[j].modelName == modelName) {
                            relation = rels[j];
                            break;
                        }
                    }
                } else {
                    wayMember = _tempRealtion.memberByIdAndRole(vertexID, iD.data.RoleType.DIVIDER_NODE_ID);
                    nodeMember = _tempRealtion.memberByIdAndRole(selectWayID, iD.data.RoleType.DIVIDER_ID);
                    if (wayMember && nodeMember) {
                        relation = _tempRealtion;
                    }
                }
            }
            /* var _way = context.entity(selectWayID);
             if(!_way) return relation;*/
            var modelConfig = iD.Layers.getLayer(way.layerId, way.modelName);

            if(!relation && modelConfig.editable || modelName == iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION){
            	if(isAdd){
            		relation = createNewDividerAttribute(selectWayID,vertexID, modelName || relationModelName);
            	}
            }

            return relation;
        }

        function renderTag(){
            var wrap = selection.selectAll('.preset-input-relation').html('');
            wrap.append('div')
                .attr('class', 'relation-tag-editor');
            if(!selectWayID || !vertexID){
                clearTagEditor();
                return ;
            }
            /*
             var enter = wrap.enter().append('div')
             .attr('class', 'preset-input-relation');
             */
            var relation  = getRelation();
            relationID = '';
            if(!relation){
                return ;
            }
            relationID = relation.id;
            let tags =  _.extend({}, relation.tags);
            // console.log("tags",tags)
            wrap.select('.relation-tag-editor')
                .call(rawTagEditor.entityID(relation.id)
                    .tags(tags)
                    .state(state));

        }
        //创建车道信息展示列表
        function renderRestrictionTag(res, num, isAdd){
            var wrap = selection.selectAll('.restrictiongroup_'+num).selectAll('.restriction-input-relation').html('');
            wrap.append('div')
                .attr('class', 'relation-tag-editor');
            /*if(!selectWayID || !vertexID){
             clearTagEditor();
             return ;
             }

             var enter = wrap.enter().append('div')
             .attr('class', 'preset-input-relation');
             */
            var g = context.graph();
            var way = context.graph().entity(selectWayID);
            var relation  = res || getRelation(iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION, isAdd);
            // relationID = '';
            if(!relation){
                return ;
            }
            // relationID = relation.id;
            relationRestrictionIDs.push(relation.id);
            let tags =  _.extend({}, relation.tags);
            if (res) {
                tags.VEHICLE = tags.VEHICLE || '';
                tags.TIME = tags.TIME || '';
                tags.WEATHER = tags.WEATHER;
                // tags.VEHICLE = iD.util._Util._getCarNamesByHexadecimal(tags.VEHICLE || '0');
                // tags.TIME = iD.convertGDFToInfo(tags.TIME || '');
                // tags.WEATHER = iD.util._Util._getWeatherTypesByCode(tags.WEATHER);
            }
            //车辆限制
            // obj.vehicle = _Util._getCarNamesByHexadecimal(relation.tags.VEHICLE || '80000000');
            //obj.timeInfo = parseRuleTime(relation.tags.TIME);
            wrap.select('.relation-tag-editor')
                .call(rawTagEditor.entityID(relation.id)
                    .tags(tags)
                    .state(state));
        }

        function mouseover() {
            var datum = d3.event.target.__data__;
            if (datum instanceof iD.geo.Turn) {
                var graph = context.graph(),
                    presets = context.presets(),
                    preset;

                if (datum.restriction) {
                    preset = presets.match(graph.entity(datum.restriction), graph);
                } else {
                    preset = presets.item('type/restriction/' +
                        iD.geo.inferRestriction(
                            graph.entity(datum.from.node),
                            graph.entity(datum.via.node),
                            graph.entity(datum.to.node),
                            projection));
                }

                wrap.selectAll('.restriction-help')
                    .text(t('operations.restriction.help.' +
                        (datum.restriction ? 'toggle_off' : 'toggle_on'),
                        {restriction: preset.name()}));
            }
        }

        function mouseout() {
            wrap.selectAll('.restriction-help')
                .text(t('operations.'+relationModelName+'relation.help.' +
                    (fromNodeID ? 'toggle' : 'select')));
        }

        function render() {
            if (context.hasEntity(vertexID) && relationModelName != iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION) {
                restrictions(selection, true);
            }
        }

        function clearSvg(){
            selection.selectAll('.preset-input-wrap').html('');
        }
        //清空列表
        function clearTagEditor(){
            selection.selectAll('.preset-relation-btns').html('');
//          selection.selectAll('.preset-input-relation .relation-tag-editor').html('');
            selection.selectAll('.preset-input-relation').html('');
//          selection.selectAll('.preset-input-relation').remove();

            if (restrictionNum != 1) {
                for (let i = 0; i < restrictionNum; i++) {
                    clearRestrictionTagEditor(i + 1);
                }
            }
//          relationRestrictionIDs = [];
//          restrictionGroups = [];
//          restrictionNum = 1;
//          selection.selectAll('.restrictiongroups').html('');
			clearRestrictionGroups();
        }
        function clearRestrictionGroups(){
            relationRestrictionIDs = [];
            restrictionGroups = [];
            restrictionNum = 1;
            selection.selectAll('.restrictiongroups').html('');
        }
        //清空车道信息列表
        function clearRestrictionTagEditor(num) {
            // selection.selectAll('.restriction-input-relation .relation-tag-editor').html('');
            var group = selection.selectAll('.restrictiongroup_'+num);
            if (group) {
                group.remove();
            }
        }
    }

    restrictions.entity = function(_) {
        if (!vertexID || vertexID !== _.id) {
            fromNodeID = null;
            selectWayID = null;
            relationID = null;
            vertexID = _.id;
        }
    };

    restrictions.tags = function() {};
    restrictions.focus = function() {};
    restrictions.change = function() {};
    restrictions.destroy = function(){
        rawTagEditor.on('change' + eventNS, null);
        context.history()
            .on('redone' + eventNS, null)
            .on('undone' + eventNS, null)
            .on('change' + eventNS, null);
        context.event.on('changeeffect' + eventNS, null);
        context.event.on('dragbox' + eventNS, null);
        context.event.on('selected' + eventNS, null);

        d3.select(window)
            .on('resize' + eventNS, null);
    }
    
    // 事件注销；
    context.event.on('dragbox' + eventNS, function(d){
		var isself =[
				iD.data.DataType.LANE_ATTRIBUTE,
                iD.data.DataType.DIVIDER_ATTRIBUTE,
                iD.data.DataType.BARRIER
			].includes(relationModelName);
    	if(!isself || !d || !d.entity.length || !context.selectedIDs().length){
    		restrictions.destroy();
    	}
    });
    context.event.on('selected' + eventNS, function(arr){
		var isself =[
				iD.data.DataType.LANE_ATTRIBUTE,
                iD.data.DataType.DIVIDER_ATTRIBUTE,
                iD.data.DataType.BARRIER
			].includes(relationModelName);
    	if(!isself || !arr || !arr.length || !context.selectedIDs().length){
    		restrictions.destroy();
    	}
    });

    return d3.rebind(restrictions, event, 'on');
};
