/**
 * 关系面板，TRAFIICSIGN / OBJECT_PG点击后，左侧面板会出现关系列表；
 * @param {Object} context
 * @param {Object} relationModelName
 */
iD.ui.TagEditorInput.traffic_semantic = function(context, relationModelName) {
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
		var index = -1;
		for (var i = 0; i < restrictionGroups.length; i++) {
			var resriction = restrictionGroups[i];
			if (resriction.style('display') == 'block') {
				index = i;
				break;
			}

		}
		return index;
	}

	function layerEditable(modelName) {
		if (!modelName) return false;
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
		// if (relationModelName == iD.data.DataType.TRAFFIC_SEMANTIC) {
		if (relationModelName == iD.data.DataType.TRAFFIC_SEMANTIC && isLAR) {
			changeId = relationRestrictionIDs[selectResrictionIndex];
			//          if (!changeId) return;
		}
		// LA和LAR都会走这个逻辑，LA是模板渲染，模板中change事件有4个参数，否则只有1个参数；
		if (!changeId || arguments.length > 1) {
			changeId = relationID;
		}

		var entity = context.entity(changeId);
		var actions_array = [],
			modelName = entity.modelName || "",
			logger_tag = "change_" + modelName;
		var key = _.keys(changed).toString();
		var ob = [{
			'attributeName': key || '',
			'originalValue': entity.tags[key] || '',
			'newValue': _.values(changed).toString() || '',
			'action': 'update'
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

		tags = _.extend({}, entity.tags, changed);
		// var chnName = getChnName(changed, entity,primaryKey);
		var msg = "更改" + Object.keys(changed).toString() // + chnName;



		//针对 changed 对象跟原值比较，可以单独对change进行相关处理，去掉undifined和自定义tags以外的name属性，防止破坏原有数据结构
		// _.forEach(changed,function(value,name,obj){if( _.isUndefined(value) || _.isUndefined(entity.tags[name])){delete obj[name]}});
		if (_.isEmpty(changed)) {
			return;
		}
		if (!iD.util.tagChanged(entity.tags, changed)) {
			return;
		}

		// iD.logger.editElement(logger_tag,modelName,"",msg);			//修改DA、LA属性时增加埋点

		actions_array.push(iD.actions.ChangeTags(changeId, tags));

		actions_array.push(msg);
		context.perform.apply(this, actions_array);
		// context.perform(iD.actions.Noop(),msg);
		// context.replace.apply(this,actions_array);
	}

	function restrictions(selection, svgChange) {
		if (!context.hasEntity(vertexID)) {
			restrictions.destroy();
			return;
		}
		if (selection.node().offsetWidth == 0 && selection.node().offsetHeight == 0) {
			// 不显示时注销事件
			restrictions.destroy();
			return;
		}
		var graph = context.graph();
		selectWayID = vertexID;
		selection.selectAll('div.preset-relation-btns').data([0]).enter()
			.append('div').attr('class', 'preset-relation-btns clearfix');
		selection.selectAll('div.preset-input-relation').data([0]).enter()
			.append('div').attr('class', 'preset-input-relation');
		selection.selectAll('div.restriction_groups').data([0]).enter()
			.append('div')
			.attr('class', 'restrictiongroups');

		renderTag();
		clearTagEditor();
		//
		if (relationModelName == iD.data.DataType.TRAFFIC_SEMANTIC && selection.selectAll('.restrictiongroups')[0].length ==
			0) {
			//车道限制信息组
			selection.selectAll('div.restriction_groups').data([0]).enter()
				.append('div')
				.attr('class', 'restrictiongroups');
		}

		selection.selectAll('.preset-relation-btns').select('a.res-rel-delete').remove();
		d3.select(".tag-divider-attribute .preset-input-relation").style("display", "none");


		var datum = context.hasEntity(vertexID);

		if (datum instanceof iD.Way) {
			var node = context.graph().entity(vertexID);
			var res = context.graph().parentRelations(node, relationModelName);
			var RBR = getRoleByRealations(res, datum, iD.data.RoleType.DIVIDER_ID);

			for (var i = 0; i < res.length; i++) {
				var relation = res[i];
				addRestrictionDom();
				addRestrictionBtn();
				renderRestrictionTag(relation, (i + 1));
				removeRestrictionBtn(restrictionNum);
				restrictionNum++;
			}

			if (res.length != 0 || restrictionNum == 1) {
				addRestriction();
				// 显示第一个限行信息
				// 最后一个为“添加限行信息”按钮
				restrictionGroups.slice(0, restrictionGroups.length - 1).forEach(function($group, idx) {
					let $relationBtns = d3.select($group.node().parentElement).select('.restriction-relation-btns.clearfix');
					if (iD.util.urlParamHistory() || $relationBtns.html() == '') {
						$group.style('display', 'block');
					} else {
						if (idx == 0) {
							$group.style('display', 'block');
							return;
						}
						$group.style('display', 'none');
					}
				});
			}


			// selection.selectAll('.preset-relation-btns').select('a.res-rel-delete').remove();
			// d3.select(".tag-divider-attribute .preset-input-relation").style("display", "none");

			// selection.selectAll('.restrictiongroup_' + restrictionNum + ' .restriction-relation-btns')
			// 	.append('a')
			// 	.attr('class', 'res-rel-delete')
			// 	.attr('title', '新增作用关系')
			// 	.text('新增作用关系_' + restrictionNum)
			// 	.on('click' + eventNS, function() {
			// 		// d3.select(".tag-divider-attribute .preset-input-relation").style("display", "block");
			// 		// deleteRelations(datum, true);

			// 		var text = this.text;
			// 		var num = text.split("_")[1];
			// 		renderRestrictionTag(null, num, true);
			// 		removeRestrictionBtn(num);
			// 		addRestriction();
			// 	});
		}


		// 更新特效
		context.event.on('changeeffect' + eventNS, render);

		d3.select(window)
			.on('resize' + eventNS, render);

		function getRoleByRealations(traffic_semantic, datum, modelName) {
			//    entity.memberByRole(iD.data.RoleType.DIVIDER_ID).id
			for (var i = 0; i < traffic_semantic.length; i++) {
				var relation = traffic_semantic[i];
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
		//判断模型是否可编辑，如果可编辑则显示功能，否则不显示 Tilden
		function getEditable(modelName) {
			var entity = context.entity(selectWayID);
			var lay = iD.Layers.getLayer(entity.layerId);
			if (lay && !lay.isModelEditable(modelName)) {
				return false;
			}
			return true;
		}

		function addRestrictionDom() {
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

			if (!getEditable(iD.data.DataType.TRAFFIC_SEMANTIC)) {
			    return false;
			}

			selection.selectAll('.restrictiongroup_' + restrictionNum + ' .restriction-relation-btns')
				.append('a')
				.attr('class', 'res-rel-delete')
				.attr('title', '创建交通语义信息')
				.text('创建交通语义信息_' + restrictionNum)
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
					context.map().dimensions(context.map().dimensions());
				});
		}
		//添加车道信息关系按钮
		function addRestriction() {
			addRestrictionDom();
			selection.selectAll('.restrictiongroup_' + restrictionNum + ' .restriction-relation-btns').select(
				'a.res-rel-delete').remove();
			if (!selection.selectAll('div.preset-input-relation').empty() && layerEditable(iD.data.DataType.TRAFFIC_SEMANTIC)) {
				addRestrictionBtn();

				restrictionNum++;

				if (restrictionGroups.length) {
					for (var i = 0; i < restrictionGroups.length; i++) {
						if (i == restrictionGroups.length - 2) {
							restrictionGroups[i].style("display", "block");
						} else {
							restrictionGroups[i].style("display", "none");
							// selection.selectAll('.tag-lane-attribute .restrictiongroup_' + restrictionGroups[i].attr("restrictionindex") + ' .glyphicon')
							//     .attr("class", "glyphicon glyphicon-chevron-up res-rel-delete");
						}

						if (i != 0) {
							// restrictionGroups[i].style("display", "none");
							selection.selectAll('.tag-lane-attribute .restrictiongroup_' + restrictionGroups[i].attr("restrictionindex") +
									' .glyphicon')
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
				numArr = _.compact(_.map(selection.selectAll(".restriction-input-relation")[0], function(ele) {
					return ele.getAttribute('restrictionindex');
				})); //compact:清空数组中false值， map：获取DOM数组中某个元素 ---Tilden
				// restrictionNum = parseInt(numArr[0])+1;
			}
			for (let i = 0; i < numArr.length; i++) {
				var num = numArr[i];
				selection.selectAll('.tag-lane-attribute .restrictiongroup_' + num + ' .restriction-relation-btns').selectAll(
					'a.res-rel-delete').remove();
				if (selection.selectAll('.tag-lane-attribute .restrictiongroup_' + num + ' div.restriction-relation-btns a').empty() &&
					layerEditable(iD.data.DataType.TRAFFIC_SEMANTIC)) {
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
						.attr('title', '删除交通语义信息')
						.attr('restrictionid', relationRestrictionIDs[num - 1])
						.text("删除交通语义信息_" + num)
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
					d3.select(".restrictiongroup_" + relationNum).select(".glyphicon")
						.attr("class", "glyphicon glyphicon-chevron-up res-rel-delete");
				}
			}
		}
		//删除车道限制信息关系逻辑
		function deleteRestriction() {
			// let entityid = selectWayID;
			var vertex = graph.entity(vertexID);
			var way = graph.entity(selectWayID);

			if (!way || relationModelName != iD.data.DataType.TRAFFIC_SEMANTIC) {
				return;
			}
			var g = context.graph();
			// var wayEntity = g.entity(entityid);
			let LArels = g.parentRelations(vertex, iD.data.DataType.TRAFFIC_SEMANTIC);
			var RAR = getRoleByRealations(LArels, way, iD.data.RoleType.DIVIDER_ID);


			var text = this.text;
			if (text) {
				var entityId = this.getAttribute("restrictionid");
				var num = text.split("_")[1];
				var maplist = _.map(LArels, function(ele) {
					return ele.id;
				});
				var restrictionindex = _.indexOf(maplist, entityId);
				var LAArelation = LArels[restrictionindex];
				if (LAArelation) {
					context.perform(
						iD.actions.DeleteMultiple([LAArelation.id], context),
						t('operations.restriction.help.delete') + ' ' + iD.data.DataType.TRAFFIC_SEMANTIC
					);
					iD.logger.editElement({
						'tag': ("delete_" + LAArelation.modelName),
						'entityId': LAArelation.osmId() || '',
						'modelName': LAArelation.modelName
					});
					clearRestrictionTagEditor(num);
				}
			} else {
				for (var i = 0; i < LArels.length; i++) {
					var LAArelation = LArels[i];
					context.perform(
						iD.actions.DeleteMultiple([LAArelation.id], context),
						t('operations.restriction.help.delete') + ' ' + iD.data.DataType.TRAFFIC_SEMANTIC
					);
					iD.logger.editElement({
						'tag': ("delete_" + LAArelation.modelName),
						'entityId': LAArelation.osmId() || '',
						'modelName': LAArelation.modelName
					});
				}
				for (var j = 0; j < restrictionNum; j++) {
					clearRestrictionTagEditor((j + 1));
				}
				//                      restrictionGroups = [];
				//                      relationRestrictionIDs = [];
				//                      restrictionNum = 1;
				clearRestrictionGroups();
			}
			context.map().dimensions(context.map().dimensions());
		}
		function createNewDividerAttribute(wayId, nodeId, modelName) {
			// var isDA = modelName == iD.data.DataType.TRAFFIC_SEMANTIC;

			if (modelName == iD.data.DataType.TRAFFIC_SEMANTIC) {
				var g = context.graph();
				var Rentity = null;
				var way = g.entity(vertexID);
				// var relIds = g.parentRelations(g.entities[wayId]);
				var currentRes = null;
				var laRel = g.parentRelations(way, iD.data.DataType.TRAFFIC_SEMANTIC).filter(function(r) {
					return r.memberByIdAndRole(selectWayID, iD.data.RoleType.DIVIDER_ID);
				})[0];
				if (laRel) {
					var dividerAttributeMember = [{
						id: laRel.id,
						modelName: way.modelName,
						role: iD.data.RoleType[way.modelName + "_ID"],
						type: iD.data.GeomType.WAY
					}]
				} else {
					var dividerAttributeMember = [{
						id: wayId,
						modelName: way.modelName,
						role: iD.data.RoleType[way.modelName + "_ID"],
						type: iD.data.GeomType.WAY
					}]
				}
				//}
			}
			var currentLayer = iD.Layers.getCurrentModelEnableLayer(way.modelName);
			var childLayer = iD.Layers.getCurrentModelEnableLayer(modelName);
			var dividerAttributeRelations = iD.Relation({
				modelName: modelName,
				identifier: currentLayer.identifier,
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
			context.event.entityedite({
				entitys: [dividerAttributeRelations.id]
			});
			return dividerAttributeRelations;
		};

		function getRelation(modelName, isAdd) {
			var relation = null;
			if (!selectWayID || !vertexID) {
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
			// TRAFFIC_SEMANTIC和TRAFFIC_SEMANTIC关系都是基于way的，不是node
			if (isAdd) {
				//              var traffic_semantic = graph.parentRelations(way, modelName || relationModelName);
				var traffic_semantic = graph.parentRelations(way, relationModelName);
			} else {
				var traffic_semantic = graph.parentRelations(way, relationModelName);
			}
			var RAR = getRoleByRealations(traffic_semantic, vertex, iD.data.RoleType.DIVIDER_NODE_ID);
			var wayMember, nodeMember, _tempRealtion;

			//for(var i = 0,len = traffic_semantic.length;i<len;i++){
			if (RAR.exec) {
				_tempRealtion = RAR.relation;
				// 多个relation时，根据选中的wayid、nodeid，尝试从relation中获取，都能获取到则为符合的relation
				if (modelName) {
					var rels = graph.parentRelations(_tempRealtion, iD.data.DataType.TRAFFIC_SEMANTIC);
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

			if (!relation && modelConfig.editable || modelName == iD.data.DataType.TRAFFIC_SEMANTIC) {
				if (isAdd) {
					relation = createNewDividerAttribute(selectWayID, vertexID, modelName || relationModelName);
				}
			}

			return relation;
		}

		function renderTag() {
			var wrap = selection.selectAll('.preset-input-relation').html('');
			wrap.append('div')
				.attr('class', 'relation-tag-editor');
			if (!selectWayID || !vertexID) {
				clearTagEditor();
				return;
			}
			/*
			 var enter = wrap.enter().append('div')
			 .attr('class', 'preset-input-relation');
			 */
			var relation = getRelation();
			relationID = '';
			if (!relation) {
				return;
			}
			relationID = relation.id;
			let tags = _.extend({}, relation.tags);
			// console.log("tags",tags)
			wrap.select('.relation-tag-editor')
				.call(rawTagEditor.entityID(relation.id)
					.tags(tags)
					.state(state));

		}
		//创建车道信息展示列表
		function renderRestrictionTag(res, num, isAdd) {
			var wrap = selection.selectAll('.restrictiongroup_' + num).selectAll('.restriction-input-relation').html('');
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
			var relation = res || getRelation(iD.data.DataType.TRAFFIC_SEMANTIC, isAdd);
			// relationID = '';
			if (!relation) {
				return;
			}
			// relationID = relation.id;
			relationRestrictionIDs.push(relation.id);
			let tags = _.extend({}, relation.tags);
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
		
		function render() {
			if (context.hasEntity(vertexID) && relationModelName != iD.data.DataType.TRAFFIC_SEMANTIC) {
				restrictions(selection, true);
			}
		}

		//清空列表
		function clearTagEditor() {
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

		function clearRestrictionGroups() {
			relationRestrictionIDs = [];
			restrictionGroups = [];
			restrictionNum = 1;
			selection.selectAll('.restrictiongroups').html('');
		}
		//清空车道信息列表
		function clearRestrictionTagEditor(num) {
			// selection.selectAll('.restriction-input-relation .relation-tag-editor').html('');
			var group = selection.selectAll('.restrictiongroup_' + num);
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
	restrictions.destroy = function() {
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
	context.event.on('dragbox' + eventNS, function(d) {
		var isself = [
			iD.data.DataType.TRAFFIC_SEMANTIC
		].includes(relationModelName);
		if (!isself || !d || !d.entity.length || !context.selectedIDs().length) {
			restrictions.destroy();
		}
	});
	context.event.on('selected' + eventNS, function(arr) {
		var isself = [
			iD.data.DataType.TRAFFIC_SEMANTIC
		].includes(relationModelName);
		if (!isself || !arr || !arr.length || !context.selectedIDs().length) {
			restrictions.destroy();
		}
	});

	return d3.rebind(restrictions, event, 'on');
};
