;;(function(iD) {

	var expParser = new iD.ui.RoadFilterExpParser();
    flattenArr = arr => arr.reduce((begin,current)=>{
        Array.isArray(current)?
            begin.push(...flattenArr(current)):
            begin.push(current);
        return begin
    },[]);
    var tableLabel=[
        {title:"车道线属性查询",type:"divider",active:true},
        {title:"道路属性查询",type:"road",active:false},
        {title:"模型查询",type:"modelName",active:false}
    ];
	var expOperators = [{
		op: '=',
		tip: '相等'
	}, {
		op: '!=',
		tip: '不等'
	}, {
		op: '*=',
		tip: '包含右侧字符'
	}, {
		op: '^=',
		tip: '以右侧字符开始'
	}, {
		op: '$=',
		tip: '以右侧字符结束'
	}, {
		op: '&&',
		tip: '并且'
	}, {
		op: '||',
		tip: '或者'
	}, {
		op: '>',
		tip: '大于'
	}, {
		op: '>=',
		tip: '大于等于'
	}, {
		op: '<',
		tip: '小于'
	}, {
		op: '<=',
		tip: '小于等于'
	}, {
		op: '!',
		tip: '取反'
	}, {
		op: '( )',
		tip: '外括号',
		opts: {
			wrap: ['(', ')'],
			extraSpace: false
		}
	}];

	var entityFilterCnfs = [{
        id: 'divider',
        name: '车道线',
        title: '车道线属性查询',
        filter: function(entity) {
        	var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            return entity instanceof iD.Way
                && entity.nodes.length > 1
                && modelConfig && modelConfig.editable
                && entity.tags
                && entity.modelName === iD.data.DataType.DIVIDER
                && iD.util.wayInPlyGonx(entity, this.context);
        },
        typicalFilter: function(entity) {
            return entity.tags && entity.modelName === iD.data.DataType.DIVIDER;
        },
        actionType:"divider"
    },{
        id: 'dividerNode',
        name: '车道线节点',
        title: '节点属性查询',
        filter: function(entity) {
        	var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            return entity instanceof iD.Node
                && modelConfig && modelConfig.editable
                && entity.tags && entity.modelName === iD.data.DataType.DIVIDER_NODE
                && iD.util.nodeInPlyGonx(entity, this.context);
        },
        typicalFilter: function(entity) {
            return entity.tags && entity.modelName === iD.data.DataType.DIVIDER_NODE;
        },
        actionType:"divider"
    }, {
		id: 'road',
		name: '道路',
		title: '道路属性查询',
		filter: function(entity) {
			var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
			return entity instanceof iD.Way
				&& entity.nodes.length > 1
				&& modelConfig && modelConfig.editable
				&& entity.tags 
				&& entity.modelName === iD.data.DataType.ROAD
                // && iD.util.wayInPlyGonx(entity, this.context);
		},
		typicalFilter: function(entity) {
			return entity.tags && entity.modelName === iD.data.DataType.ROAD;

		},
		actionType:"road"
	},{
		id: 'roadNode',
		name: '道路节点',
		title: '节点属性查询',
		filter: function(entity) {
			var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
			return entity instanceof iD.Node 
				&& modelConfig && modelConfig.editable
				&& entity.tags && entity.modelName === iD.data.DataType.ROAD_NODE
				&& iD.util.nodeInPlyGonx(entity, this.context);
		},
		typicalFilter: function(entity) {
			return entity.tags && entity.modelName === iD.data.DataType.ROAD_NODE;
		},
		actionType:"road"
    },{
		id: 'modelName',
		name: '模型名称',
		title: '模型查询',
		filter: function(entity) {
			var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
			var flag =entity instanceof iD.Entity
				&& modelConfig && modelConfig.editable
				&& entity.modelName;
			// 模型时可搜索所有要素
			if(entity instanceof iD.Relation){
				return flag;
			}
			return flag && iD.util.entityInPlyGon(entity, this.context);
		},
		typicalFilter: function(entity) {
			return entity && entity.modelName;
		},
		actionType:"modelName"
	}
	];

	iD.ui.RoadFilterPanel = function(context, selection) {

		this.dispatch = d3.dispatch('close');

		this.selection = selection;

		this.context = context;

		this.entities = null;

		return d3.rebind(this, this.dispatch, 'on')
	};

	_.assign(iD.ui.RoadFilterPanel.prototype, {
		refreshEntities: function() {

			var entities = this.context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]));

			this.entities = entities.filter(this.filterCnf.filter, this);

			this.updateEntityNum(this.entities.length);

			if (this.entities.length > 0) {

				this.refreshFieldList();
			}
		},
		updateEntityNum: function(num) {
			var $num = this.$msgBox.select('span.total');

			if ($num.size()) {
				$num.html(num);

			} else {
				this.statMsg('总数量: <span class="total">' + num + '</span>');

			}
		},
		updateEntityCnfs:function(actionType){
			var self = this;
			// if(!actionType){
			// 	actionType="road";
			// }
			var $cnfSwhRow=d3.select("div.panel-body div.cnf-switch ul");
			var $newCnfSwhItems = $cnfSwhRow.selectAll('li');
			var actions=_.filter(entityFilterCnfs,function(entity){
				return entity.actionType==actionType
			});
			var update=$newCnfSwhItems.data(actions);
			var $newCnfSwhItem=update.enter().append("li");

			$newCnfSwhItem.append('label')
				.html(function(d) {
					return '<input type="radio" name="road_filter_cnf_type" value="' + d.id + '" />' + d.title;
				})
				.on('click', function(d) {
					self.switch2Type(d.id);
					return false;
				});
			
			update
				.html(function(d) {
					return '<lable><input type="radio" name="road_filter_cnf_type" value="' + d.id + '" />' + d.title+"</lable>";
				})
				.on('click', function(d) {
					self.switch2Type(d.id);
					return false;
				});
			
			update.exit().remove();	
		},
		initPanel: function() {

			var selection = this.selection,
				self = this;

			var $panelBox = selection.selectAll('div.road-filter-panel')
				.data([0]);

			var $newPanelBox = $panelBox.enter()
				.append('div')
				.attr('class', 'road-filter-panel common-dialog');

			$newPanelBox.append('div')
				.attr('class', 'tl-close')
				.html('&times;')
				.on('click', function() {
					self.hide();
					self.dispatch.close();
				});;

			$newPanelBox.append('div')
				.attr('class', 'panel-title');



			window.tableLabel = tableLabel;
			var panelActions=$newPanelBox.append('div')
				.attr('class', 'btn-group panel-actions');
			panelActions.selectAll("a.btn").data(tableLabel).enter().append("a")
				.attr("class","btn").text(function(d){return d.title})
				.attr("id",function(d,i){return d.type})
				.classed("active",function(d){return d.active})
				.on("click",function(d){
					d3.select(this.parentNode).selectAll("a").classed("active",false);
					d3.select(this).classed("active",true);
					self.updateEntityCnfs(d.type);
				})
					
			$newPanelBody = $newPanelBox.append('div')
				.attr('class', 'panel-body');

			this.initBody($newPanelBody);

			this.$panelBox = d3.select($panelBox.node());

			this.$panelTitle = this.$panelBox.select('div.panel-title');

			this.$panelBody = this.$panelBox.select('div.panel-body');

			this.$filterExpInput = this.$panelBody.select('input.expression');

			this.$msgBox = this.$panelBody.select('div.msg_box');

			this.initPos();
		},
		needZoomIn: function(mapExtent, selExtent) {
			return mapExtent.percentContainedIn(selExtent) < 0.5;
		},
		needZoomOut: function(mapExtent, selExtent) {
			return selExtent.percentContainedIn(mapExtent) < 0.9;
		},
		// 定位
		selectEntitiesByExp: function() {

			var entities = this.evalExp(),
				context = this.context,
				self = this;

			if (!entities || !entities.length) {
				context.enter(iD.modes.Browse(context));
				return;
			}

			var eleTab = d3.select('#leftbar .nav .item-element');
			eleTab.on('click').call(eleTab.node(), eleTab.datum());

			var selExtent = iD.geo.Extent(),
				graph = context.graph(),
				toCenterExtent = null;

			entities.forEach(function(w, idx) {

				var oldExtentArea = selExtent.area() || 1;

				selExtent = selExtent.extend(w.extent(graph));

				if (idx > 1 && !toCenterExtent &&
					selExtent.area() / oldExtentArea > 5) {
					//the extent area expand too much
					toCenterExtent = selExtent;
				}
			});

			var map = context.map();

//			if (selExtent.area() > 0) {
			// 一个点时，area为0
			if (selExtent.area() >= 0) {

                // if (parseInt(map.extentZoom(selExtent))< 20) {
                    map.zoom(20);
                // } else {
                    map.extent(selExtent);
                // }
				// map.extent(selExtent);

				if (!map.editable()) {

					if (toCenterExtent) {
                        // if (parseInt(map.extentZoom(toCenterExtent))< 20) {
                        //     map.zoom(20);
                        // } else {
                            map.extent(toCenterExtent);
                        // }
						// map.extent(toCenterExtent);
						//map.center(toCenterExtent.center());
					}

					map.zoom(map.editableLevel());
				}
			} else {

				//查询结果单条则放到
				if(toCenterExtent==null){
					map.zoom(18);
					map.center(entities[0].loc);
				}

			}

			// 	mapExtent = map.extent();
			// map.center(selExtent.center());
			// if (this.needZoomIn(mapExtent, selExtent)) {

			// 	do {
			// 		if (map.zoom() > map.editableLevel()) {

			// 			map.zoomOut();

			// 		} else {

			// 		}
			// 	} while (this.needZoomIn(mapExtent, selExtent));

			// } else if (this.needZoomOut(mapExtent, selExtent)) {
			// 	do {
			// 		if (map.zoom() > map.editableLevel()) {

			// 			map.zoomOut();

			// 		} else {

			// 		}
			// 	} while (this.needZoomIn(mapExtent, selExtent));
			// }

			if (d3.event) {
				_.assign(d3.event, {
					_isLasso: true
				});
			}
			var selectedIDs=entities.map(function(w) {
                d3.select("circle.node.stroke."+w.id).transition().duration(1500).ease("liner").style("stroke-width","10").transition().duration(1000).ease("liner").style("stroke-width","1");
                return w.id;
			});
			var relationMemberIDs = entities.map(function(w) {
				var entity = w;
                var ids = self.getEntityAndAllMemberIds(_.pluck(entity.members || [], 'id'));
                d3.select("circle.node.stroke."+entity.id).transition().duration(1500).ease("liner").style("stroke-width","10").transition().duration(1000).ease("liner").style("stroke-width","1");
                return ids;
			});
            relationMemberIDs = flattenArr(relationMemberIDs);

			context.surface()
                .selectAll('.selected')
                .classed('selected', false);


            if(d3.event){
            	d3.event._isFromList = true;
            }
            // 模型查询时，只显示选择的要素列表
            // 关系不需要遍历成员，只有从属性列表中选择关系进入后，再高亮该成员
//          var allSelected = this.getEntityAndAllMemberIds(selectedIDs, true);
            var allSelected = selectedIDs;
			context.enter(iD.modes.Select(context, allSelected, null, true)
	            .suppressMenu(allSelected.length > 1)
	            .newFeature(false));

            context.surface()
            //              .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .selectAll(iD.util.entitySelector(relationMemberIDs))
                .classed('selected', true);
		},
		/**
		 * 获取所有选中非relation的entityid
		 * @param {Array} ids
		 * @param {Boolean} hasRel 是否添加relation.id
		 */
		getEntityAndAllMemberIds: function(ids = [], hasRel = false){
			var self = this;
			var result = [];
			for(let id of ids){
				var entity = self.context.entity(id);
            	if(entity instanceof iD.Relation){
            		hasRel && result.push(entity.id);
            		result.push(...self.getEntityAndAllMemberIds(_.pluck(entity.members || [], 'id')));
            	}else {
            		result.push(entity.id);
            	}
			}
			return _.uniq(result);
		},
		unselectEntitiesByExp: function() {

			var context = this.context;

			if (context.mode().id === 'select') {

				var selIds = context.selectedIDs();

				if (selIds && selIds.length) {

					var entities = this.evalExp();

					if (entities && entities.length) {

						var removeIds = entities.map(function(w) {
							return w.id
						});

						var leftIds = _.without.apply(_, [selIds].concat(removeIds));

						context.enter(leftIds.length ? iD.modes.Select(context, leftIds) :
							iD.modes.Browse(context));


					}
				}
			}
		},
		clearExp: function() {

			this.unselectEntitiesByExp();

			this.statMsg('');
			this.$filterExpInput.property('value', '');
		},
		evalExp: function() {

			if (!this.entities) {
				this.refreshEntities();
			}

			var exp = this.$filterExpInput.property('value') || '';
			// 必须要有运算符
			var signs = _.pluck(expOperators, 'op');
			var flag = true;
			for(var sign of signs){
				if(exp.indexOf(sign) > -1){
					flag = false;
					break;
				}
			}
			if(flag){
				return [];
			}

			var result = expParser.parseExp(exp, this._fieldsModelInfo);

			if (result.error) {

				this.statMsg(result.error);

				return null;

			} else if (this.filterCnf && this.filterCnf.id == 'modelName') {
				// 模型名称搜索
				var matchedWays = this.entities.filter(function(w) {
					return result.filter(_.assign({
						id: iD.Entity.id.toOSM(w.id)
					}, {
						modelName: w.modelName
					}));
				});
				this.statMsg('总数量: <span class="total">' + this.entities.length +
					'</span>, 符合条件数量: <span class="match">' + matchedWays.length + '</span>');
				return matchedWays;
			} else {
				// tags属性搜索，select类型时，值必须是Number类型，才可以走通用逻辑
				var matchedWays = this.entities.filter(function(w) {
					return result.filter(_.assign({
						id: iD.Entity.id.toOSM(w.id)
					}, w.tags));
				});
				this.statMsg('总数量: <span class="total">' + this.entities.length +
					'</span>, 符合条件数量: <span class="match">' + matchedWays.length + '</span>');
				return matchedWays;
			}
		},
		statMsg: function(str) {
			this.$msgBox.html(str);
		},
		initBody: function($body) {

			var self = this;

			var expChange = _.debounce(function() {

				self.evalExp();

			}, 350);

			$body.attr('tabindex', 1);

			var $cnfSwhRow = $body.append('div').attr('class', 'cnf-switch');
//			var selectTableLabelType = this.selection.select('.panel-actions').select('.active').property('id');
			var selectTableLabelType = this.selection.select('.panel-actions a.active').property('id');
			if(!selectTableLabelType){
                selectTableLabelType = iD.data.DataType.DIVIDER;
			}
			var  entityFilterCnfs_Road=_.filter(entityFilterCnfs,function(d){
				return d.actionType==selectTableLabelType
			});

			var $cnfSwhItems = $cnfSwhRow.append('ul').selectAll('li').data(entityFilterCnfs_Road);

			var $newCnfSwhItem = $cnfSwhItems.enter().append('li');

			$newCnfSwhItem.append('label')
				.html(function(d) {
					return '<input type="radio" name="road_filter_cnf_type" value="' + d.id + '" />' + d.title;
				})
				.on('click', function(d) {
					self.switch2Type(d.id);
					return false;
				});
			$cnfSwhItems.exit().remove();
			var $expression = $body.append('input')
				.attr('class', 'expression')
				.attr('type', 'text')
				.on('input', expChange)
				.on('paste', expChange)
				.on('propertychange', expChange)
				.on('keypress', function() {;
					if (d3.event.keyCode === 13) {
						self.selectEntitiesByExp();
					}
				});

			var $searchBtn = $body.append('button')
				.attr('class', 'search_btn button blue')
				.html('定位')
				//.attr('type', 'button')
				.on('click', function() {

					self.selectEntitiesByExp();
				});

			var $clearBtn = $body.append('button')
				.attr('class', 'clear_btn button gray')
				.html('清除')
				//.attr('type', 'button')
				.on('click', function() {

					self.clearExp();
				});

			$body.append('div').attr('class', 'cf');

			var $colBoxRow = $body.append('div')
				.attr('class', 'col_box_row');

			var $fieldList = $colBoxRow.append('div')
				.attr('class', 'col_box field_list_box');

			this.initFieldList($fieldList);

			var $operatorList = $colBoxRow.append('div')
				.attr('class', 'col_box operator_list_box');

			this.initOperatorList($operatorList);

			var $fieldVals = $colBoxRow.append('div')
				.attr('class', 'col_box field_vals_box');

			this.initFieldVals($fieldVals);

			$body.append('div').attr('class', 'cf');

			$body.append('div').attr('class', 'msg_box');

			$body.selectAll('input,select').on('mousedown', function() {
				d3.event.stopPropagation();
			});

		},

		initFieldList: function($fieldList) {

			$fieldList.append('label')
				.attr('class', 'top-opts')
				.html('<input type="checkbox" class="inEqlOpCk" />自动添加=号');

			$fieldList.append('h3').html('字段名');

			$fieldList.append('div')
				.attr('class', 'col_body field_list');

			this.refreshFieldList();
		},
		buildFieldsModelInfo: function(modelFields) {
			var mInfo = {},
				keptFlds = ['fieldName', 'fieldInput', 'fieldType', 'fieldTitle'];

			function simpleFldInfo(m) {

				var res = {};

				keptFlds.forEach(function(f) {
					res[f] = m[f];
				});

				return res;
			}
			modelFields.forEach(function(m) {

				mInfo[m.fieldName] = simpleFldInfo(m);
			});

			return mInfo;
		},
		refreshFieldList: function() {

			if (!this.entities || !this.entities.length) {
				return;
			}

			if (this._fieldsModelInfo) {
				return;
			}
			
			var modelFields = [];
			
			if(this.filterCnf.id == 'modelName'){
				modelFields = this.getModelNameListFields();
			}else {
				modelFields = _.clone(this.getEntityModelFields(this.findTypicalEntity()));
				this.filterModelFields(modelFields);
			}

			this._fieldsModelInfo = this.buildFieldsModelInfo(modelFields);

			var $fldList = this.$panelBody.select('div.field_list');

			var $ul = $fldList.selectAll('ul').data([0]);

			$ul.enter()
				.append('ul');

			var $li = $ul.selectAll('li').data(modelFields);

			var self = this;

			$li.enter().append('li')
				.on('click', function(d) {

					$li.classed('selected', false);

					d3.select(this).classed('selected', true);

					self.refreshFieldVals(d);

				})
				.on('dblclick', function(d) {

					$li.classed('selected', false);

					d3.select(this).classed('selected', true);

					self.refreshFieldVals(d);

					var eqlOp = self.$panelBody.select('input.inEqlOpCk').property('checked');

					self.insertExpOp(d.fieldName + (eqlOp ? ' = ' : ''));
				});

			$li.html(function(d) {
				return '<span class="name">' + d.fieldName +
					'</span>: <span class="title">' +
					d.fieldTitle + '</span>';

			}).attr('title', function(d) {
				return d.fieldName + ': ' + d.fieldTitle;

			});

			$li.exit()
				.remove();

			$ul.exit()
				.remove();
		},
		refreshFieldVals: function(fld) {

			this.$panelBody.select('div.field_val_fname')
				.html(fld.fieldName);

			var selVals = [];

			if (fld.fieldInput && fld.fieldInput.values) {
				selVals = fld.fieldInput.values;
			}

			var $fldValsList = this.$panelBody.select('div.field_vals_list');

			var $ul = $fldValsList.selectAll('ul').data([0]);

			$ul.enter()
				.append('ul');

			var $li = $ul.selectAll('li').data(selVals);

			var self = this;

			$li.enter().append('li')
				.on('dblclick', function(d) {

					self.insertExpOp(d.value, {
						extraLeft: '='
					});
				});

			$li.html(function(d) {
				return '<span class="value">' + d.value +
					'</span>: <span class="name">' +
					d.name + '</span>';
			}).attr('title', function(d) {
				return d.value + ': ' + d.name;
			});

			$li.exit()
				.remove();

			$ul.exit()
				.remove();
		},
		filterModelFields: function(modelFields) {


			var topFields = ['id'];

            modelFields.unshift({
				fieldName: 'id',
				fieldTitle: 'ID'
			});


			modelFields.forEach(function(m, idx) {

				var fname = m.fieldName,
					topFldIdx = topFields.indexOf(fname);

				m._sortIdx = topFldIdx >= 0 ? 1000 - topFldIdx : 0;
			});

			modelFields.sort(function(a, b) {

				if (a._sortIdx !== b._sortIdx) {
					return b._sortIdx - a._sortIdx;
				}

				if (a.fieldName != b.fieldName) {
					return a.fieldName > b.fieldName ? 1 : -1;
				}

				return 0;
			});
		},
		findTypicalEntity: function() {

			return _.find(this.entities, this.filterCnf.typicalFilter, this);
		},
		getEntityModelFields: function(entity) {

			if (!entity) {
				return;
			}
			/*
			var currentLayer = entity.layerInfo(),
				modelEntity = currentLayer.modelEntity(),
				geoType = modelEntity.getGeoType();
			*/
			var modelEntity = iD.ModelEntitys[entity.modelName];

			return modelEntity && modelEntity.getFields(modelEntity.getGeoType());
		},
		getModelNameListFields: function(){
			var vals = _.map(iD.data.DataType, function(modelName){
				return modelName ? {name: modelName, value: modelName} : false;
			});
			vals = _.compact(vals);
			return [{
				fieldName: 'modelName',
				fieldTitle: '模型',
				fieldInput: {
					type: 'select',
					values: vals
				}
			}];
		},
		insertExpOp: function(op, opts) {

			opts = _.assign({
				extraSpace: true
			}, opts);

			var input = this.$filterExpInput.node();

			var len = input.value.length,
				start = input.selectionStart,
				end = input.selectionEnd,
				sel = input.value.substring(start, end);

			var replace = op;

			if (opts.wrap) {
				replace = opts.wrap[0] + sel + opts.wrap[1];
			}

			var startStr = input.value.substring(0, start),
				endStr = input.value.substring(end, len);

			if (opts.extraSpace) {
				if (!startStr.endsWith(' ')) {
					startStr += ' ';
				}

				if (!endStr.startsWith(' ')) {
					endStr = ' ' + endStr;
				}
			}

			if (opts.extraLeft) {
				if (!startStr.trim().endsWith(opts.extraLeft)) {
					startStr += opts.extraLeft;
				}
			}

			if (opts.extraRight) {
				if (!endStr.trim().startsWith(opts.extraRight)) {
					endStr = opts.extraRight + endStr;
				}
			}

			input.value = startStr + replace + endStr;

			try {
				input.focus();
			} catch (e) {

			}

			this.evalExp();
		},
		initOperatorList: function($operatorList) {
			$operatorList.append('h3').html('计算符号');

			var $box = $operatorList.append('div')
				.attr('class', 'col_body operator_list');

			$ul = $box.append('ul');

			$newLi = $ul.selectAll('li')
				.data(expOperators);

			var self = this;

			$newLi.enter().append('li')
				.attr('title', function(d) {
					return d.tip;
				}).html(function(d) {
					return d.op;
				}).on('click', function(d) {
					self.insertExpOp(d.op, d.opts);
				});

		},
		initFieldVals: function($fieldVals) {

			$fieldVals.append('div')
				.attr('class', 'field_val_fname');

			$fieldVals.append('h3').html('字段取值');

			$fieldVals.append('div')
				.attr('class', 'col_body field_vals_list');
		},
		initPos: function() {
			var self = this,
				surfaceRect = this.selection.node().getBoundingClientRect(),
				panelBoxRect = this.$panelBox.node().getBoundingClientRect();

			var boxPosition = [
				(surfaceRect.width - panelBoxRect.width) / 2, (surfaceRect.height - panelBoxRect.height) / 2
			];

			this.$panelBox.style({
				right: 'auto',
				bottom: 'auto',
				top: 0,
				left: 0
			});
			iD.util.setTransform(this.$panelBox, boxPosition[0], boxPosition[1]);

			var behavior = iD.behavior.drag()
				.surface(this.selection)
				//.delegate('div.dvr-player-title')
				//.origin(origin)
				.on('start', function() {

				})
				.on('move', function() {

					var delta = d3.event.delta;

					boxPosition[0] += delta[0];
					boxPosition[1] += delta[1];

					iD.util.setTransform(self.$panelBox, boxPosition[0], boxPosition[1]);
				})
				.on('end', function() {

				});

			this.$panelBox.call(behavior);
		},
		switch2Type: function(id) {

			if (this.filterCnf && this.filterCnf.id === id) {
				return;
			}

			this.filterCnf = _.find(entityFilterCnfs, function(e) {
				return e.id === id;
			});

			if (!this.filterCnf) {
				console.error('Can not switch 2 id: ', id);
			}

			this.$filterExpInput.attr('placeholder',  '请输入查询条件，例如id = 4500');

			this.clearExp();

			this.$panelTitle.html(this.filterCnf.title);

			this.$panelBody.select('input[name="road_filter_cnf_type"][value="' + id + '"]').property('checked', true);

			this.entities = null;

			this._fieldsModelInfo = null;

			this.$panelBody.select('div.field_list').html('');
			this.$panelBody.select('div.field_vals_list').html('');

			this.initFieldList(this.$panelBody.select('div.field_list_box').html(''));
			this.initFieldVals(this.$panelBody.select('div.field_vals_box').html(''));

			this.refreshEntities();
		},
		show: function() {

			if (!this.$panelBox) {
				this.initPanel();
				this.switch2Type('divider');
			}

			this.$panelBox.classed('hidden', false);

			var self = this;

			this.context.history().on('change.road_fitler', function() {

				self.refreshEntities();

				self.evalExp();
			});

			self.refreshEntities();

			try {
				self.$panelBody.node().focus();
			} catch (e) {
				console.warn(e);
			}
		},
		hide: function() {

			this.$panelBox.classed('hidden', true);

			this.context.history().on('change.road_fitler', null);

			this.entities = null;
			
			this.context.enter(iD.modes.Browse(this.context));
		}
	});

})(iD);