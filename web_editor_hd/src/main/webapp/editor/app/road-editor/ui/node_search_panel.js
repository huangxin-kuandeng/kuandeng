;;(function(iD) {
	
	iD.ui.NodeSearchPanel = function(context, selection) {

		this.dispatch = d3.dispatch('close');

		this.selection = selection;

		this.context = context;

		this.entities = [];

		return d3.rebind(this, this.dispatch, 'on')
	};
	
	var colorKeyMap = {
		"1": "#ff0000",
		"2": "#00ff00",
		"3": "#0000ff"
	};
	
	_.assign(iD.ui.NodeSearchPanel.prototype, {
		initPanel: function() {

			var selection = this.selection,
				self = this;

			var $panelBox = selection.selectAll('div.node-search-panel')
				.data([0]);

			var $newPanelBox = $panelBox.enter()
				.append('div')
				.attr('class', 'node-search-panel common-dialog');

			$newPanelBox.append('div')
				.attr('class', 'tl-close')
				.html('&times;')
				.on('click', function() {
					self.hide();
					self.dispatch.close();
				});;

			$newPanelBox.append('div')
				.attr('class', 'panel-title');

			$newPanelBody = $newPanelBox.append('div')
				.attr('class', 'panel-body');

			this.initBody($newPanelBody);

			this.$panelBox = d3.select($panelBox.node());

			this.$panelTitle = this.$panelBox.select('div.panel-title').text("解析坐标定位");

			this.$panelBody = this.$panelBox.select('div.panel-body');

			this.$inputArea = this.$panelBody.select('textarea.coord-list-input');

			this.$msgBox = this.$panelBody.select('div.msg_box');
			
			this.initPos();
		},
		statMsg: function(str) {
			this.$msgBox.html(str);
		},
		searchParsedNodes: function(){
			var self = this;
			var coords = self.formatInputArea();
			self.addEntities2Map(coords);
		},
		addEntities2Map: function(coords){
			if(!coords || !coords.length){
				return ;
			}
			var self = this;
			self.clearEntities2Map();
			
			
			var locArr = [];
			//x, y, z  -->  x, y, z 
			for(var i in coords){
				var coord = coords[i].split(/[,，]/);
				if(coord.length <= 1){
					continue ;
				}else if(coord.length == 2){
					coord[2] = 0;
				}else if(coord.length > 4){
					coord = coord.slice(0, 4);
				}
				var y = Number(coord[1]);
				coord[0] = Number(coord[0]);
				coord[1] = y;
				
				if(coord[2]){
					coord[2] = Number(coord[2]);
				}
				if(coord[3]){
					coord[3] = Number(coord[3]);
				}
				
				locArr.push(coord);
			}
			if(locArr.length){
				self.entities = createMarkDatum(self.context, locArr);
				self.parseEntities2BestMap();
				self.showEntitiesInfoList();
				self.context.event.entityedite({entitys: []});
			}
		},
		clearEntities2Map: function(){
			var self = this;
			if(!self.entities || !self.entities.length){
				return ;
			}
			
			var actions = [];
			for(var i in self.entities){
				var entity = self.entities[i];
				actions.push(iD.actions.DeleteNode(entity.id));
			}
			actions.push(t('operations.delete.annotation.point'));
			try{
				self.context.replace.apply(this, actions);
				self.context.undo();
			}catch(e){}
			
			self.entities.length = 0;
		},
		formatInputArea: function(){
			var self = this;
			var $input = self.$inputArea;
			var str = $input.property("value");
			str = str.trim();
			var coords;
			if(str.indexOf(";") > -1 || str.indexOf("；") > -1){
				coords = str.split(/[\n;；]+/);
			}else {
				coords = str.split(/\n+/);
			}
			if(!coords.length || !str){
				return ;
			}
			var endReg = /[,，]$/;
			// 经度, 纬度, 高度
			// x,y,z
			coords = _.map(coords, function(value){
				if(value){
					if(endReg.test(value)){
						value.replace(endReg, "");
					}
					return value.replace(/\s+/, "");
				}
			});
			$input.property("value", coords.join("\n"));
			return coords;
		},
		parseEntities2BestMap: function(){
			var self = this;
			if(!self.entities || !self.entities.length){
				return ;
			}
			
			var graph = self.context.graph(), context = self.context;
			var selExtent = iD.geo.Extent();
			self.entities.forEach(function(entity){
				selExtent = selExtent.extend(entity.extent(graph));
			});
			
			// 10米=0.000125°
			var _expend = 0.000125;
			
			var map = context.map();

			// 一个点时，area为0
			if (selExtent.area() >= 0) {
                if (parseInt(map.extentZoom(selExtent))< context.options.editableLevel) {
//                  map.center(selExtent.center());
                    map.center(self.entities[0].loc);
                    map.zoom(context.options.editableLevel);
                } else {
                    map.extent(selExtent);
                }
            }else {
            	if(map.zoom() < context.options.editableLevel){
            		map.zoom(context.options.editableLevel);
            	}
                map.center(selExtent.center());
            }
		},
		initBody: function($body) {

			var self = this;

//			var inputChange = _.debounce(function() {
//
//			}, 350);

			$body.attr('tabindex', 1);

			var $inputArea = $body.append('textarea')
				.attr('class', 'coord-list-input')
				// row 失效，不知道为什么
				.attr("row", 10)
				.style({
					resize: "none",
				    height: "212px"
				})
//				.on('input', inputChange)
//				.on('paste', inputChange)
//				.on('propertychange', inputChange)
				.on("mousedown", function(){
					var event = d3.event;
					event.stopPropagation();
				});
				/*
				.on('keypress', function() {;
					if (d3.event.keyCode === 13) {
						self.searchParsedNodes();
					}
				});
				*/

			var $searchBtn = $body.append('button')
				.attr('class', 'search_btn button blue')
				.html('确定')
				//.attr('type', 'button')
				.on('click', function() {

					self.searchParsedNodes();
				});
			
			var $clearBtn = $body.append('button')
				.attr('class', 'clear_btn button gray')
				.html('清空地图')
				//.attr('type', 'button')
				.on('click', function() {

					self.clearEntities2Map();
				});
			
			/*
			$body.append('div').attr('class', 'cf');
			$body.append('div').attr('class', 'cf');
			*/
			$body.append('div').text('以","分隔，参数为 经度，纬度，高程，颜色样式 —— 换行或";"代表多条信息');
			$body.append('div').attr("class", "color-list").selectAll("div.color-item").data(_.keys(colorKeyMap))
				.enter().append("div").attr("class", "color-item").html(function(key){
					var result = '';
					var color = colorKeyMap[key];
					if(!color){
						return result;
					}
					result += '<span>' + key + '</span>';
					result += '<span style="background-color: ' + color + ';"></span>';
					return result;
				});
			$body.append('div').attr('class', 'msg_box');

			$body.selectAll('input,select').on('mousedown', function() {
				d3.event.stopPropagation();
			});

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
	    showEntitiesInfoList: function(){
	    	var self = this;
	    	var $body = d3.select("body");
	    	var $panel = $body.selectAll("div#node-search-result-div");
	    	if(!$panel.node()){
	    		$panel = $panel.data([0]).enter().append("div").attr("id", "node-search-result-div");
	    		$panel.append("div").attr("class", "history-list");
	    	}
	    	$panel.style("display", "block");
	    	var _count = 1;
	    	
	    	var entityArr = self.entities.filter(function(n){
	    		return self.context.graph().hasEntity(n.id);
	    	});
	    	if(!entityArr.length){
	    		self.hideEntitiesInfoList();
	    		return ;
	    	}
	    	var $list = $panel.select("div.history-list");
	    	var $items = $list.selectAll("div.list-item").data(entityArr);
	    	
	    	$items.enter().append("div").attr("class", "list-item")
	    		.each(function(node){
	    			var $this = d3.select(this);
	    			var locations = node.loc;
	    			var color = colorKeyMap[node.tags.colortype] || "#333";
	    			$this.html(
	    				`
	    				<div class="item-prefix" style="color: ${color};">${_count}</div>
	    				<div class="item-left">
	    					<p>${locations[0] || "0"}</p>
	    					<p>${locations[1] || "0"}</p>
	    					<p>${locations[2] || "0"}</p>
	    				</div>
	    				<button type="button">定位</button>
	    				`);
	    			
	    			_count ++;
	    		});
	    	$items.exit().remove();
    		
	    	$items.selectAll("button").on("click.pic-player", function(){
	    		var node = this.parentNode.__data__;
	    		// self.context.extent(node.extent());
	    		// self.context.map().zoom(18);
	    		var map = self.context.map(), context = self.context;
            	if(map.zoom() < context.options.editableLevel){
            		map.zoom(context.options.editableLevel);
            	}
	    		map.center([node.loc[0], node.loc[1]]);
	    		context.graph().hasEntity(node.id) && map.lightEntity(node.id);
	    	});
	    },
	    hideEntitiesInfoList: function(){
	    	var self = this;
	    	var $panel = d3.select("div#node-search-result-div");
	    	$panel.style("display", "none")
	    },
		show: function() {
			var self = this;

			if (!self.$panelBox) {
				self.initPanel();
			}

			self.$panelBox.classed('hidden', false);

			function refreshEntityInfo() {
				self.showEntitiesInfoList();
			}
			let his = self.context.history();
			his.on('change.node_search', refreshEntityInfo);
			his.on('undone.node_search', refreshEntityInfo);
			his.on('redone.node_search', refreshEntityInfo);

			try {
				self.$panelBody.node().focus();
			} catch (e) {
				console.warn(e);
			}
			
			self.showEntitiesInfoList();
		},
		hide: function() {
			var self = this;
			self.$panelBox.classed('hidden', true);

			self.context.history().on('change.node_search', null);

//			self.hideEntitiesInfoList();
		}
	});
	
	//创建点
    function createPoint(loc,i){
        // loc = geomList[i].p[0];
        // var num = Math.ceil( Math.random() * 10 / 3 );
        var coords = [loc[0], loc[1], loc[2] || 0]
        var node = iD.Node({
            _type: iD.data.DataType.SEARCH_POINT,
            tags: {
                name_chn: '搜索结果点',
                x_coord: coords[0].toString(),
                y_coord: coords[1].toString(),
                z_coord: coords[2].toString(),
                colortype: loc[3] || 1
            },
            loc: coords
        });
        if(i){
        	node.tags.index = i;
		}
        return node;
    }

    function createMarkDatum(context, geomList){
		var entities = [];
        var actions = [];
        for(var i=0,len = geomList.length;i<len;i++){
        	// iD.data.DataType.PLACENAME
        	var node = createPoint(geomList[i],i+1);
        	entities.push(node);
            actions.push(iD.actions.AddEntity(node));
        }

        actions.push(t('operations.add.annotation.point'));
        context.perform.apply(this, actions);
        
        return entities;
    }

})(iD);