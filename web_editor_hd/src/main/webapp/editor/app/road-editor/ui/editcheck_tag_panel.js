;;(function(iD) {
	
	iD.ui.EditCheckTagPanel = function(context, selection) {

		this.dispatch = d3.dispatch('close');

		this.selection = selection;

		this.context = context;

		return d3.rebind(this, this.dispatch, 'on')
	};
	
	var colorKeyMap = {
		"1": "#ff0000",
		"2": "#00ff00",
		"3": "#0000ff"
    };
    
    function osmId(id){
        return iD.Entity.id.toOSM(id);
    }

    function sortNumber(a, b, sort = 'asc'){
        function returnNum(num){
            return sort === 'asc' ? num : 
                sort === 'desc' ? -num : 0;
        }
        var na = Number(a), nb = Number(b);
        if(isNaN(na) || isNaN(nb)){
            // 任一一个不是数字格式的情况，字符串排序；
            return returnNum(a.localeCompare(b));
        }else {
            // 都是number
            return returnNum(na - nb);
        }
    }
	
	_.assign(iD.ui.EditCheckTagPanel.prototype, {
		__rowClick: false,
		
		initPanel: function() {

			var selection = this.selection,
				self = this;

			var $panelBox = selection.selectAll('div.editcheck-tag-panel')
				.data([0]);

			var $newPanelBox = $panelBox.enter()
				.append('div')
				.attr('class', 'editcheck-tag-panel common-dialog');

			$newPanelBox.append('div')
				.attr('class', 'tl-close')
				.html('&times;')
				.on('click', function() {
					self.hide();
					self.dispatch.close();
				});;
			this.$panelBox = d3.select($panelBox.node());
			
			this.$panelTitle = this.$panelBox.append('div').attr('class', 'panel-title').text("质检表格");
			this.$panelBody = this.$panelBox.append('div').attr('class', 'panel-body');
			
			var $tabTabs = this.$panelBody.append('div').attr('class', 'tab-tablist');
			this.$tabList = $tabTabs.append('ul').attr('class', 'cf nav nav-tabs');
			
			this.$tabContent = this.$panelBody.append('div').attr('class', 'tab-content');
			this.$bottomBtnList = this.$panelBody.append('div').attr('class', 'buttom-btnlist');
			// TabItem
			this.listTabs = [];
			
			this.initBody(this.$panelBody);
			this.initPos();
			this.initEvent();
			
			this.$selectModel;
			this.craeteSelectModelName();
		},
		initBody: function($body) {
			var self = this;
			$body.attr('tabindex', 1);
			
			var $btnList = self.$bottomBtnList;
			var $searchBtn = $btnList.append('button')
				.attr('class', 'button blue')
				.html('查询模型')
				//.attr('type', 'button')
				.on('click', function() {
					self.$selectModel.classed('hide', false);
				});
		},
		initEvent: function(){
			var self = this;
			self.$panelBox.on('mousedown.editcheck-tag-panel', function(){
				checkMenu(d3.event);
			});
			self.$panelBody.on('mousedown.editcheck_tag_panel', function(){
				var evt = d3.event;
				evt.stopImmediatePropagation();
				checkMenu(evt);
				return false;
			});
			var context = this.context;
			// 地图/视频 选中要素后，若面板处于打开状态，定位对应tab
			context.event.on('selected.editcheck_tag_panel', function(entities){
				if(!self.isVisible() || self.__rowClick){
					self.__rowClick = false;
					return ;
				}
				if(!entities || entities.length != 1 || !entities[0].modelName){
					return ;
				}
				var d = entities[0];
				self.locateTabEntity(d.modelName, d.id, false);
			})
			
			function checkMenu(evt){
				var $menu = self.$panelBody.select('.tab-pane .ect-contextmenu');
				if(!$menu.node()) return ;
				var rect = $menu.node().getBoundingClientRect();
				if(!rect) return ;
				var x = evt.clientX, y = evt.clientY;
				if(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom){
					self.closeContextMenu();
				}
			}
		},
		craeteSelectModelName: function () {
			var self = this;

            var modelNames = iD.ModelEntitys;

            var $selectModel = self.$panelBox.append('div').attr('class', 'panel-select editcheck-tag-panel hide');
            $selectModel.append('div').attr('class', 'panel-title').text("选择模型名称");
            self.$selectModel = $selectModel;

            var select = $selectModel.append('select')
                .attr('class','value selectmodel')
                .style('padding', '5px 10px');
            var optionData = [];
            for (var i in modelNames) {
                optionData.push({
                    "name": modelNames[i]._modelName,
                    "value": modelNames[i]._modelName
                });
            }
            select.selectAll('option')
                .data(optionData)
                .enter()
                .append('option')
                .attr('value', function (o) {
                    return o.value;
                })
                .attr('title', function (o) {
                    return o.name;
                })
                .text(function (o) {
//                  return iD.util.substring(o.name, 8);
                    return o.name;
                });

            var $btn = $selectModel.append('div').attr('class', 'buttom-btnlist')
				.style('padding', '5px 10px');
            $btn.append('button')
                .attr('class', 'button blue')
                .html('确定')
                //.attr('type', 'button')
                .on('click', function() {
                	var mname = select.value();
                    $selectModel.classed('hide', true);
                    self.createTab(iD.data.DataType[mname] || mname);
                });
            $btn.append('button')
                .attr('class', 'button blue')
                .html('取消')
                //.attr('type', 'button')
                .on('click', function() {
                    $selectModel.classed('hide', true);
                });
        },
		createTab: function(modelName){
			var old;
			this.listTabs.forEach(d => {
				if(old) return ;
				if(modelName && d.modelName == modelName){
					old = d;
					return ;
				}
			});
			if(old){
				old.show();
				old.refresh();
				return old;
			}
			
			var item = new TabItem(this, modelName);
			this.listTabs.push(item);
			item.show();
			item.refresh();
			return item;
		},
		initPos: function() {
			var self = this,
				surfaceRect = this.selection.node().getBoundingClientRect(),
				panelBoxRect = this.$panelBox.node().getBoundingClientRect();

			var boxPosition = [
				(surfaceRect.width - panelBoxRect.width) / 2, (surfaceRect.height - panelBoxRect.height) / 2
			];
			boxPosition[0] = parseInt(boxPosition[0]);
			boxPosition[1] = parseInt(boxPosition[1]);

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
		show: function() {
			var self = this;
			if (!self.$panelBox) {
				self.initPanel();
			}
			self.$panelBox.classed('hidden', false);
		},
		isVisible: function(){
			return this.$panelBox && this.$panelBox.size() && !this.$panelBox.classed('hidden') || false;
		},
		hide: function() {
			var self = this;
			self.__rowClick = false;
			self.$panelBox.classed('hidden', true);
			self.closeContextMenu();
		},
		clearTabs: function(){
			this.listTabs.forEach(item => item.destory());
			this.listTabs = [];
		},
		/**
		 * 选中指定要素
		 * @param {Object} ids
		 * @param {Boolean} fromClick 来自click，触发selected后不执行定位
		 */
		lightEntity: function(ids, fromClick){
			var context = this.context, graph = context.graph();
			if(!_.isArray(ids)){
				ids = [ids];
			}
			var sids = [], suppressMenu = false;
			ids.forEach((id)=>{
				var entity = graph.hasEntity(id);
				if(!entity) return ;
				if(entity instanceof iD.Relation){
					if(entity.modelName === iD.data.DataType.R_DIVIDER_DREF){
						sids.push(..._.pluck(entity.members, 'id'));
					}else {
						sids.push(id);
						suppressMenu = true;
					}
				}else{
					sids.push(id);
				}
			});
			// 定位地图中央+缩放到合适比例，并将该对象处于选中状态；
			var bound;
			sids.forEach((id)=>{
				var entity = graph.entity(id);
				var _bound = entity.extent && entity.extent(graph);
				if(!bound) bound = _bound;
				else bound.extend(_bound);
			});
			var editZoom = context.options.editableLevel;
			if(bound){
				var map = context.map();
				map.center(bound.center());
				var newZoom = parseInt(map.extentZoom(bound));
				if(newZoom < editZoom){
					newZoom = editZoom;
				}
				if(newZoom != map.zoom()){
					map.zoom(newZoom);
				}
			}
			if(_.isEqual(context.selectedIDs(), sids)){
				// 已重复选中的，不需要再走enter
				// 防止与selected事件冲突
				this.__rowClick = false;
				return ;
			}
			this.__rowClick = true;
			context.enter(iD.modes.Select(context, sids, null, true)
			    .suppressMenu(suppressMenu)
			    .newFeature(false));
		},
		/**
		 * 定位到指定tab和执行row，高亮选中entityid
		 * @param {String} modelName
		 * @param {String} entityid
		 * @param {Boolean} toSelected 默认true，选中entityid
		 */
		locateTabEntity: function(modelName, entityid, toSelected = true){
			var item = this.createTab(modelName);
			item.locateEntityRow(entityid, toSelected);
			toSelected && entityid && this.lightEntity(entityid);
		},
		closeContextMenu: function(){
			this.listTabs.forEach((item)=>{
				item.rowRightMenu(false);
			});
		}
	});
	
	
	function TabItem(panel, modelName){
		this.panel = panel;
		this.$tabList = this.panel.$tabList;
		this.$tabContent = this.panel.$tabContent;
		this.modelName = modelName;
		this.sortField = {
			name: 'id',
			sort: 'asc'
		};
		var dispatch = d3.dispatch('destory', 'tabclick', 'sortrow', 'rowclick', 'rowcontextmenu');
		this.event = dispatch;
		
		this.$tab;
		this.$pane;
		
		this._initTab();
		this._initTabContent();
		
		this.initEvent();
		
		this.$tab.classed('active', false);
		this.$pane.classed('active', false);
	}
	
	_.assign(TabItem.prototype, {
		_initTab: function(){
			var self = this;
			var $list = this.$tabList;
			var modelName = this.modelName;
			var domid = '_ecttab_' + modelName;
			var $tab = $list.select('#' + domid);
			if(!$tab.size()){
				$tab = $list.append('li').attr('id', domid).attr('class', 'active');
			}
			this.$tab = $tab;
			this.renderTab();
		},
		renderTab: function(){
			var self = this;
			var $tab = this.$tab;
			if(!$tab || !$tab.size()){
				return ;
			}
			$tab.html('');
			var modelName = this.modelName;
			$tab.append('a').attr('href', 'javascript:void(0)').text(modelName || '')
				.on('click', function(){
					self.event.tabclick();
					return ;
				});
			$tab.append('div').attr('class', 'tab-close').html('&times;')
				.on('click', function(){
					self.event.destory();
					return false;
				});
		},
		_initTabContent: function(){
			var $list = this.$tabContent;
			var modelName = this.modelName;
			var domid = '_ectpanel_' + modelName;
			var $pane = $list.select('#' + domid);
			if(!$pane.size()){
				$pane = $list.append('div').attr('id', domid).attr('class', 'tab-pane active');
			}
			this.$pane = $pane;
			this.renderTabContent();
		},
		renderTabContent: function(){
			var self = this;
			var $pane = this.$pane;
			if(!$pane || !$pane.size()){
				return ;
			}
			$pane.html('');
			var modelName = this.modelName;
			var model = iD.ModelEntitys[modelName];
			if(!model){
				return ;
			}
			
			var fieldList = model.getFields(model.getGeoType()) || [];
			fieldList.unshift({
				fieldName: 'id',
				fieldTitle: 'ID'
			});
			var entities = this.entities || [];
			if(modelName === iD.data.DataType.DIVIDER){
				fieldList.push({
					fieldName: iD.data.DataType.DIVIDER_ATTRIBUTE,
					fieldTitle: '道路分隔线属性变化点'
				});
				fieldList.push({
					fieldName: iD.data.DataType.LANE_ATTRIBUTE,
					fieldTitle: '车道属性变化点'
				});
			}
			var context = this.panel.context, graph = context.graph();
			var trDataList = _.map(entities, function(d){
				var tags = _.extend({}, d.tags);
				tags.id = osmId(d.id);
				if(modelName === iD.data.DataType.DIVIDER){
					var daList = graph.parentRelations(d, iD.data.DataType.DIVIDER_ATTRIBUTE), 
						laList = graph.parentRelations(d, iD.data.DataType.LANE_ATTRIBUTE);
					/*
					graph.childNodes(d).forEach((node)=>{
						let daRels = graph.parentRelations(node, iD.data.DataType.DIVIDER_ATTRIBUTE).map((r)=>r.id);
						let laRels = graph.parentRelations(node, iD.data.DataType.LANE_ATTRIBUTE).map((r)=>r.id);
						daList.push(...daRels);
						laList.push(...laRels);
					});
					*/
					tags[iD.data.DataType.DIVIDER_ATTRIBUTE] = daList.length || 0;
					tags[iD.data.DataType.LANE_ATTRIBUTE] = laList.length || 0;
				}else if(modelName === iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION){
					// 限行信息
	                tags.VEHICLE = iD.util._Util._getCarNamesByHexadecimal(tags.VEHICLE || '80000000');
	                tags.TIME = iD.convertGDFToInfo(tags.TIME || '');
	                tags.WEATHER = iD.util._Util._getWeatherNamesByCode(tags.WEATHER);
	                if(tags.VEHICLE && tags.VEHICLE.length){
	                	tags.VEHICLE = _.pluck(tags.VEHICLE, 'label').join(',')
	                }else {
	                	tags.VEHICLE = '';
	                }
	                if(tags.TIME && tags.TIME.timeRange){
	                	tags.TIME = _.map(tags.TIME.timeRange, function(t){
	                		return t.start + ' - ' + t.end;
	                	}).join('、');
	                }else {
	                	tags.TIME = '';
	                }
	                if(tags.WEATHER && tags.WEATHER.length){
	                	tags.WEATHER = _.pluck(tags.WEATHER, 'label').join(',')
	                }else {
	                	tags.WEATHER = '';
	                }
				}
				return {
					id: d.id,
					tags: tags
				};
			})
			/*
			var $wrap = $pane.append('div').attr('class', 'table-wrap clearfix');
			var $tableHeader = $wrap.append('div').attr('class', 'table-headwrap')
				.append('table').attr('class', 'table table-bordered table-header');
			var $table = $wrap.append('div').attr('class', 'table-bodywrap')
				.append('table').attr('class', 'table table-bordered table-hover');
			$tableHeader.append('thead').append('tr').selectAll('th').data(fieldList).enter()
				.append('th').text(function(d){
					return d.fieldName || '';
				}).attr('data-field', function(d){
					return d.fieldName || '';
				}).on('click.ect-panel', function(d){
					// 点击排序
					var sort = 'asc', fieldName = d.fieldName;
					if(self.sortField.name === fieldName){
						var oldSort = self.sortField.sort;
						// 取反
						sort = ['asc', 'desc'][Number(oldSort == 'asc')];
					}
					self.event.sortrow(fieldName, sort);
				});
			var $trList = $table.append('tbody')
				.selectAll('tr').data(trDataList).enter()
				.append('tr').on('click.ect-panel', function(d, idx){
					// 每行点击
					self.event.rowclick.call(this, d, idx);
				}).on('contextmenu.ect-panel', function(d, idx){
					self.event.rowcontextmenu.call(this, d, idx);
				});
			
			$trList.selectAll('td').data(function(d, index){
				var fieldNames = _.map(fieldList, f => f.fieldName || false);
				fieldNames = _.compact(fieldNames);
				return fieldNames.map((name, idx) => {
					let fvalue = d.tags[name];
					fvalue = fvalue == null ? '' : fvalue;
//					if(name == 'id'){
//						fvalue = osmId(d.id);
//					}
					return {
						name: name,
						value: fvalue,
						entityid: d.id,
						row: index,
						col: idx
//						row: $(this).parent().index(),
					}
				});
			}).enter()
			.append('td').text(d => d.value);
			*/
			var $wrap = $pane.append('div').attr('class', 'table-wrap clearfix');
			var $tableHeader = $wrap.append('div').attr('class', 'table-headwrap')
				.append('div').attr('class', 'table table-bordered table-header');
			var $table = $wrap.append('div').attr('class', 'table-bodywrap')
				.append('div').attr('class', 'table table-bordered table-hover');
			
			$tableHeader.append('div').attr('class', 'tr')
				.selectAll('.th').data(fieldList).enter()
				.append('div').attr('class', 'th').text(function(d){
					return d.fieldName || '';
				}).attr('data-field', function(d){
					return d.fieldName || '';
				}).on('click.ect-panel', function(d){
					// 点击排序
					var sort = 'asc', fieldName = d.fieldName;
					if(self.sortField.name === fieldName){
						var oldSort = self.sortField.sort;
						// 取反
						sort = ['asc', 'desc'][Number(oldSort == 'asc')];
					}
					self.event.sortrow(fieldName, sort);
				});
			var $trList = $table
				.selectAll('.tr').data(trDataList).enter()
				.append('div').attr('class', 'tr').on('click.ect-panel', function(d, idx){
					// 每行点击
					self.event.rowclick.call(this, d, idx);
				}).on('contextmenu.ect-panel', function(d, idx){
					self.event.rowcontextmenu.call(this, d, idx);
				});
			
			$trList.selectAll('.td').data(function(d, index){
				var fieldNames = _.map(fieldList, f => f.fieldName || false);
				fieldNames = _.compact(fieldNames);
				return fieldNames.map((name, idx) => {
					let fvalue = d.tags[name];
					fvalue = fvalue == null ? '' : fvalue;
					return {
						name: name,
						value: fvalue,
						entityid: d.id,
						row: index,
						col: idx
					}
				});
			}).enter()
			.append('div').attr('class', 'td').text(function(d){
				// select显示文本；
				var entity = context.hasEntity(d.entityid);
				if(entity && entity.modelName == iD.data.DataType.ROAD_ATTRIBUTE){
					if(d.name == 'VALUE'){
						return getSubTypeText(d, this);
					}
				}else if(d.name == 'SUBTYPE'){
					return getSubTypeText(d, this);
				}
				return getSelectText(d);
			});
			
			function getSubTypeText(d, tdEle){
				var typeData = $(tdEle).parent().children().toArray().map(function(td){
					var sd = td.__data__;
					if(sd && sd.name == 'TYPE'){
						return sd;
					}
				});
				typeData = _.compact(typeData)[0];
				
				if(!typeData) return '';
				var $thList = $tableHeader.selectAll('.tr .th');
				var model = $thList[0][d.col].__data__;
				var f = $thList[0][typeData.col].__data__;
				if(!f ||!model) return '';
				// 对应type字段的id
				var typeResult = getSelectValue(f, typeData.value, 'value');
				if(!typeResult.id){
					return '';
				}
				var result = getSubTypeList(model, typeResult.id, 'parentId');
				
				var text = '';
				for(var v of result){
					if((d.value + '') == (v.value + '')){
						text = v.name || v.value;
					}
				}
				return text || d.value;
			}
			
			function getSubTypeList(model, value, keyName){
				if(!keyName) keyName = 'parentId';
				var result = [];
				if(model && model.fieldInput && model.fieldInput.values){
					for(let v of model.fieldInput.values){
						if(v[keyName] != null && (v[keyName]+'') == (value + '')){
							result.push(v);
						}
					}
				}
				return result;
			}
			
			function getSelectValue(model, value, keyName){
				if(!keyName) keyName = 'value';
				var result = {};
				if(model && model.fieldInput && model.fieldInput.values){
					for(let v of model.fieldInput.values){
						if(v[keyName] != null && (v[keyName]+'') == (value + '')){
							result = v;
							break;
						}
					}
				}
				return result;
			}
			
			function getSelectText(d){
				var model = $tableHeader.selectAll('.tr .th')[0][d.col];
				if(model) model = model.__data__;
				var result = getSelectValue(model, d.value, 'value');
				return result.name || result.value || d.value;
			}
			
			var wd = {};
			d3.select($trList.node()).selectAll('.td').each(function(d){
				var $this = $(this);
				var width = $this.outerWidth();
				if(width < 100){
					width = 100;
				}
				//值内容可能会过长，以值最大长度为准
				var th = $tableHeader.selectAll('.tr .th')[0][d.col];
				width = _.max([$(th).outerWidth(), width]);
				wd[d.name] = width;
			}).each(function(d){
				var width = wd[d.name] + 'px';
				this.style.width = width;
				this.style['min-width'] = width;
			});
			$tableHeader.selectAll('.tr .th').each(function(d){
				var width = wd[d.fieldName] + 'px';
				this.style.width = width;
				this.style['min-width'] = width;
			});
			
			this.event.sortrow(this.sortField.name, this.sortField.sort);
		},
		refreshEntities: function(){
			var modelName = this.modelName;
			var context = this.panel.context;
			var entities = context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]));
			entities = entities.filter(function(d){
				return d.modelName && d.tags && d.modelName === modelName;
            }).sort(function(d1, d2){
                return sortNumber(osmId(d1.id), osmId(d2.id), 'asc');
            });
			this.entities = entities;
		},
		refresh: function(){
			this.refreshEntities();
			this.renderTab();
			this.renderTabContent();
		},
		show: function(only = true){
//			this.refresh();
			// 定位
			var $tablist = $(this.panel.$tabList.node()).closest('.tab-tablist');
			if($tablist.length && this.$tab.node()){
				// .tab-tablist
				var tablist = $tablist[0], li = this.$tab.node();
				tablist.scrollLeft = li.offsetLeft - tablist.offsetWidth + li.offsetWidth;
			}
			if(this.$pane.node() && !this.$pane.classed('active')){
				this.$pane.node().scrollLeft = 0;
			}
			this.$tab.classed('active',  true);
			this.$pane.classed('active',  true);
			
			if(!only){
				return ;
			}
			this.panel.listTabs.forEach((item)=>{
				if(item != this){
					item.hide();
				}
			});
		},
		isVisible: function(){
			return this.$tab.classed('active') && this.$pane.classed('active');
		},
		hide: function(){
			this.$tab.classed('active',  false);
			this.$pane.classed('active',  false);
		},
		initEvent: function(){
			var self = this;
			var event = self.event;
			var panel = this.panel;
			var context = this.panel.context;
			var ns = '__' + self.modelName;
			event.on('destory.' + ns, function(){
				var index = panel.listTabs.indexOf(self);
				self.indexOut();
				self.destory();
				
				var newtab = panel.listTabs[index] || panel.listTabs[index - 1] || panel.listTabs[0];
				if(newtab){
					newtab.show();
				}
			});
			event.on('tabclick.' + ns, function(){
				if(self.isVisible()) return false;
				self.show();
			});
			// 行点击
			event.on('rowclick.' + ns, function(d){
				self.panel._fromClick = true;
				self.panel.lightEntity(d.id);
				$(this).addClass('active').siblings().removeClass('active');
			});
			// 行右键 菜单
			event.on('rowcontextmenu.' + ns, function(d){
				var evt = d3.event;
				var graph = context.graph();
				var rel = graph.hasEntity(d.id);
				if(!rel || !(rel instanceof iD.Relation) || !rel.members || !rel.members.length){
					return ;
				}
				self.rowRightMenu(evt, {
					element: this,
					entity: rel
				});
				$(this).addClass('active').siblings().removeClass('active');
				evt.preventDefault();
			});
			// 行排序
			event.on('sortrow.' + ns, function(fieldName, sort = '', useOrder = false){
				if(!self.isVisible() || !self.$pane || !self.$pane.size()) return false;
				var $thList = self.$pane.selectAll('.table-headwrap .th');
				var $trList = self.$pane.selectAll('.table-bodywrap .tr');
				
				// 进行过排序，完全一致的情况
				if($thList.filter('.sort').size() && self.sortField.name === fieldName && self.sortField.sort === sort){
//					$trList.order();
					return ;
				}
				
				$trList.sort(function(d1, d2){
                    var v1 = d1.tags[fieldName] || '', v2 = d2.tags[fieldName] || '';
                    return sortNumber(v1, v2, sort);
				});
				self.sortField.name = fieldName;
				self.sortField.sort = sort;
				
				$thList.filter('.sort').classed('sort', false);
				$thList.filter('[data-field=' + fieldName + ']').classed('sort ' + sort, true);
			});
		},
		/**
		 * 删除该tab
		 */
		destory: function(){
			this.$tab.remove();
			this.$pane.remove();
			this.$tab = undefined;
			this.$pane = undefined;
			this.$tabList = undefined;
			this.$tabContent = undefined;
			this._$contextMenu && this._$contextMenu.remove();
			this._$contextMenu = undefined;
			this.panel = undefined;
			this.event = undefined;
			this._destory = true;
		},
		/**
		 * 从面板记录的索引中移除该tab
		 */
		indexOut: function(){
			var listTabs = this.panel.listTabs;
			var selfIdx = listTabs.indexOf(this);
			if(selfIdx != -1){
				listTabs.splice(selfIdx, 1);
			}
		},
		/**
		 * 定位到指定entity，并且选中
		 * @param {String} entityid
		 */
		locateEntityRow: function(entityid){
			var self = this;
			var $body = self.$pane.selectAll('.table-bodywrap');
			if(!self.isVisible() || !$body.node()){
				return ;
			}
			var $tr = $body.selectAll('.tr').filter((d)=>{
				return d.id === entityid;
			});
			$($tr.node()).addClass('active').siblings().removeClass('active');
			if($tr.node()){
				var offsetTop = $tr.node().offsetTop;
				$body.node().scrollTop = offsetTop;
			}
		},
		// 右键菜单
		_$contextMenu: null,
		rowRightMenu: function(e, opts = {}){
			var self = this;
			self._$contextMenu && self._$contextMenu.remove();
			self._$contextMenu = null;
			if(e === false){
				return ;
			}
			var root = opts.root && opts.root.nodeType == 1 ? opts.root : self.$pane.node();
			var element = opts.element, entity = opts.entity;
			if(!root) return ;
			var maxHeight = root.offsetHeight, maxWidth = root.offsetWidth;
			var $root = d3.select(root);
			var $menu = $root.selectAll('div.ect-contextmenu').data([entity.id]).enter()
				.append('div').attr('class', 'ect-contextmenu scroll-small');
			$menu.append('div').attr('class', 'menu-title').text('members');
			$menu.append('ul').attr('class', 'nav')
				.selectAll('li').data(entity.members).enter()
				.append('li').html((d)=>{
					return '<span>' + osmId(d.id) + '</span><small>' + (d.modelName || '') + '</small>';
				}).on('click', (d)=>{
					// 定位到指定entity
					self.panel.locateTabEntity(d.modelName, d.id, true);
					self.rowRightMenu(false);
				});
//			var clickOffset = [e.offsetX, e.offsetY];
			var clickOffset = d3.mouse(root);
			var cx = clickOffset[0], cy = clickOffset[1];
			var top = left = right = bottom = 'auto';
			var height = $menu.node().offsetHeight, width = $menu.node().offsetWidth;
			if(cy + height >= maxHeight){
				bottom = 0 + 'px';
			}else {
				top = cy + 'px';
			}
			if(cx + width >= maxWidth){
				right = 0 + 'px';
			}else {
				left = cx + 'px';
			}
			
			$menu.style({
				top: top,
				left: left,
				right: right,
				bottom: bottom
			});
			self._$contextMenu = $menu;
		}
	});
	
	var $textLabel;
	function _createTextCom(){
		if($textLabel) return ;
		$textLabel = $("<div>").css({
			color: "black",
			"white-space": "nowrap",
			top: 0,
			left: 0,
			position: "fixed",
			display: "block",
			visibility: "visible"
		}).appendTo('body');
	}
	
	function _removeTextCom(){
		if(!$textLabel) return ;
		$textLabel.remove();
		$textLabel = undefined;
	}
	
	function textWidth(text){
		if(!$textLabel) return ;
		$textLabel.text(text);
		return $text.width();
	}
	
})(iD);