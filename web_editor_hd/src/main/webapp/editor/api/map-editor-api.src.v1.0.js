// +----------------------------------------------------------------------
// | KDSEditor API
// +----------------------------------------------------------------------
// | Copyright (c) 2014 http://AutoNavi.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed AutoNavi 
// +----------------------------------------------------------------------
// | Author: 
// +----------------------------------------------------------------------
;;(function(){
	var context, map,isHotspot = true;

	/**
	 +------------------------------------------------------------------------------
	 * @constructor KDSEditor
	 * 用于完成地图初始化及地图相关操作
	 +------------------------------------------------------------------------------
	*/
	//document.write('<script type=\'text/javascript\' src=\'' + iD.store.qq.url + '\'></script>');
	var KDSEditor = function(id, opt) {
        this.initialize(id, opt);
    };

    _.extend(KDSEditor.prototype, {
    	/**
		 * 入口方法
		 * @param xid 存放地图的容器的ID
		 * @return
		 */
        initialize: function(id, opt) {
            this.id = id;
			this.context = $$.init(this.id, opt);
			return this;
        },
        /**
		 * 编辑事件处理
		 * @param name 	事件标识符
		 * @param callback 	回调方法
		 * @return
		 */
		addListener: function(name, callback){
			// 需优化
			switch(name)
			{
				case "lasso":
					context.lasso_callback = callback;
					break;
				case "click":
					context.click_callback = callback;
					break;
				case "hotspotclick":
					context.hotspot_click_callback = callback;
					break;
				case "hover":
					context.hover_callback = callback;
					break;
                case "movestart":
                    callback && map.on('movestart.editorapi', function(){
                        var d3ev = d3.event || '';
                        d3ev&&
                        callback.call(d3ev, d3ev.x, d3ev.y);
                    });
                    break;
				case "move":
					callback && map.on('move.editorapi', function(){
						var d3ev = d3.event && d3.event.sourceEvent || '';
						d3ev&&
						callback.call(d3ev, d3ev.x, d3ev.y);
					});
					break;
                case "moveend":
                    callback && map.on('moveend.editorapi', function(){
                        var d3ev = d3.event || '';
                        d3ev&&
                        callback.call(d3ev, d3ev.x, d3ev.y);
                    });
                    break;
				case "zoom":
					callback && map.on('zoom.editorapi', function(e){
						//var d3ev = d3.event && d3.event.sourceEvent || '';
						//d3ev&&
						callback.call(e);
					});
					break;
				case "drawn":
					callback && map.on('drawn.editorapi', callback);
					break;
				case "loaded":
					break;
				case "savestart":
				    context.event.on("savestart.event",callback);
					break;
				case "saveend":
				    context.event.on("saveend.event",callback);
					break;
                case "dragbox":
				    context.event.on("dragbox.event",callback);
					break;
				case "add":
				    context.event.on("add.event",callback);
					break;	
				case "polygonend":
				    context.event.on("polygonend.event",callback);
					break;	
				case "drawstart":
				    context.event.on("drawstart.event",callback);
					break;	
				case "drawing":
				    context.event.on("drawing.event",callback);
					break;	
				case "drawend":
				    context.event.on("draw.event",callback);
					break;					
				case "selected":
				    context.event.on('selected.event',callback);
					break;	
				case "mouseover":
				    context.event.on('mouseover.event',callback);
					break;
				case "mousemove":
					context.event.on('mousemove.event',callback);
					break;
				default :
				    context.event.on(name + '.event',callback);
			}
			return this;
		},
        /**
		 * 设置鼠标模式
		 * @param mode 模式类型 {Distance,Polygon,Marker,Rectangle,Circle,Polyline,Zoom,Browse}
		 * @return map
		 */
		setMouseTool : function(mode,filter){
			// {Distance,Polygon,Marker,Rectangle,Circle,Polyline,Zoom,Browse}
            switch(mode){
				case "distance":
					context.enter(iD.modes.toolbar.Distance(context));
					break;
				case "measure-area":
					context.enter(iD.modes.toolbar.MeasureArea(context));
					break;
				case "polygon":
					context.enter(iD.modes.toolbar.Polygon(context,true));
					break;	
				case "polygon-selected":
					context.enter(iD.modes.toolbar.Polygon(context,false,filter));
					break;		
				case "marker":
					context.enter(iD.modes.toolbar.Marker(context));
					break;
				case "rectangle":
					context.enter(iD.modes.toolbar.Rectangle(context));
					break;
				case "circle":
					context.enter(iD.modes.toolbar.Circle(context));
					break;
				case "polyline":
					context.enter(iD.modes.toolbar.Polyline(context));
					break;
				case "rectangle-selected":
				    context.enter(iD.modes.toolbar.Lasso(context,filter));	
				    break;	
				case "zoom":
				    context.enter(iD.modes.LassoZoom(context));
					break;
				case "zoomIn": //放大
				    context.enter(iD.modes.LassoZoom(context));
					break;	
				case "zoomOut": //缩小
				    context.enter(iD.modes.LassoZoom(context,true));
					break;		
				case "pan":
				    context.enter(iD.modes.Browse(context));  
					break;
				default :
				    context.enter(iD.modes.Browse(context));  	
			}
			return this;
		},

		/**
		 * 像素转经纬度
		 * @param pix 像素数组
		 * @return
		 */
		pixelToLonlat: function(pix){
	    	return context.projection.invert(pix);
		},

		/**
		 * 经纬度转像素
		 * @param loc 经纬度数组
		 * @return
		 */
		lonlatToPixel: function(loc){
			return context.projection(loc);
		},

		/**
		 * 高亮选中指中ID元素
		 * @param ids 元素ID或数组
		 * @return
		 */
		lightEntity: function(ids){
			map.lightEntity(ids);
			return this;
		},

		lightEntities: function(id,entities){
			map.lightEntities(id,entities);
			return this;
		},
		removeEntities: function(id,entities){
			map.removeEntities(id,entities);
			return this;
		},
		/**
		 * 设置地图中心点经纬度
		 * @param loc 坐标数组
		 * @return
		 */		
		setCenter: function(loc){
			map.center(loc);
			return this;	
		},
		/**
		 * 设置地图中心点经纬度
		 * @param loc 坐标数组
		 * @return
		 */
		getCenter: function(){
			return map.center();
		},
		/**
		 * 设置地图缩放级别
		 * @param v 级别数字
		 * @return
		 */		
		setZoom: function(v){
			map.zoom(v);
			return this;	
		},
        /**
         * 设置地图缩放级别
         * @param v 级别数字
         * @return
         */
        setZoom: function(v,force){
            map.zoom(v,force);
            return this;
        },
		/**
		 * 获取地图缩放级别
		 * @param v 级别数字
		 * @return
		 */
		getZoom: function(){
			return map.zoom();
		},

		/**
		 * 设置地图最大缩放级别
		 * @param v 级别数字
		 * @return
		 */		
		setMaxZoom: function(v){
			map.max_zoom(v);
			return this;	
		},

		/**
		 * 设置地图最小缩放级别
		 * @param v 级别数字
		 * @return
		 */		
		setMinZoom: function(v){
			map.min_zoom(v);
			return this;	
		},
		/**
		 * 获取地图最大缩放级别
		 * @return
		 */
		getMaxZoom: function(){
			return map.max_zoom();
		},

		/**
		 * 获取地图最小缩放级别
		 * @return
		 */
		getMinZoom: function(){
			return map.min_zoom();
		},
        /**
		 * 放大一级视图。
		 * @return
		 */	
		zoomIn : function(){
           map.zoomIn();  
           return this;	
		},
        
        /**
		 * 缩小一级视图。
		 * @return
		 */	
		zoomOut : function(){
           map.zoomOut(); 
           return this;	 
		},

		/**
		 * 同时设置中心点坐标与缩放级别
		 * @param loc 坐标数组 [x, y]
		 * @param v 缩放级别
		 * @return
		 */
		setCenterZoom: function(loc, v){
			map.centerZoom(loc, v);
			return this;
		},

		/**
		 * 设置地图图层数据可编辑缩放级别
		 * @param v 缩放级别
		 * @return
		 */
		setEditableLevel: function(v){
			map.editableLevel(v);
			return this;
		},

		/**
		 * 获取地图图层数据可编辑缩放级别
		 * @param v 缩放级别
		 * @return
		 */
		getEditableLevel: function(){
			return map.editableLevel();
		},
        /**
		 * 获取地图范围
		 * @return
		 */
		getBounds : function(){
            return map.trimmedExtent();
		},

		/**
		 * 添加点矢量图层
		 * @param opt 图层配制参数对象
		 * @return
		 */
		addPointLayer: function(o){
			var f = true;
			if(o.length){
				var ff = [];
				for(var i = 0; i< o.length; i++){
					ff.push($$.addLayer(o[i], iD.store.layers.point));
				}
				f = ff.indexOf(true) !== -1;
			}else{
				f = $$.addLayer(o, iD.store.layers.point);
			}
			if (!f) return this;

			return this.flushView(o);
		},

		/**
		 * 添加线矢量图层
		 * @param opt 图层配制参数对象
		 * @return
		 */
		addLineLayer: function(o){
			var f = true;
			if(o.length){
				var ff = [];
				for(var i = 0; i< o.length; i++){
					ff.push($$.addLayer(o[i], iD.store.layers.line));
				}
				f = ff.indexOf(true) !== -1;
			}else{
				f = $$.addLayer(o, iD.store.layers.line);
			}
			if (!f) return this;

			return this.flushView(o);
		},

		/**
		 * 添加面矢量图层
		 * @param opt 图层配制参数对象
		 * @return
		 */
		addAreaLayer: function(o){
			var f = true;
			if(o.length){
				var ff = [];
				for(var i = 0; i< o.length; i++){
					ff.push($$.addLayer(o[i], iD.store.layers.area));
				}
				f = ff.indexOf(true) !== -1;
			}else{
				f = $$.addLayer(o, iD.store.layers.area);
			}
			if (!f) return this;

			return this.flushView(o);
		},
		/**
		 * 添加热点图层
		 * @param opt 图层配制参数对象
		 * @return
		 */
		addHotspotLayer: function(o){
			var f = true;
			if(o.length){
				var ff = [];
				// var enlayer = context.layers().getCurrentEnableLayer();
				var enlayer = context.layers().getLayer();
				var isenlayer = false,vs = true;
				if(enlayer){
					isenlayer = true;
				}
				for(var i = 0; i< o.length; i++){
					f = $$.addLayer(o[i], iD.store.layers.hotSpot);
					ff.push(f);
					if (!f) continue;
					if(isenlayer){
						vs = false;
					}else{
						vs = o[i].editable;
					}
					this.addOverlayer({
						"name": o[i].name,
						"type": "tms",
						"url": o[i].tileUrl,
						"hotspot":true,
						"zooms": [
							0,
							22
						],
						"id": o[i].id+"HotspoLayer",
						"visible": vs
					});
				}
				f = ff.indexOf(true) !== -1;
			}else{
				f = $$.addLayer(o, iD.store.layers.hotSpot);
				if (!f) return this;

				if(isenlayer){
					vs = false;
				}else{
					vs = o.editable
				}
				this.addOverlayer({
					"name": o.name || o.id,
					"type": "tms",
					"url": o.tileUrl,
					"hotspot":true,
					"zooms": [
						0,
						22
					],
					"id": o.id+"HotspoLayer",
					"visible":vs
				});
			}
			if (!f) return this;
			return this.flushView(o);
		},

		/**
		 * 删除热点图层
		 * @param opt 图层配制参数对象
		 * @return
		 */
		removeHotspotLayer: function(id){
			if(id.length){
				for(var i = 0; i < id.length; i++){
					this.removeOverlayerById(id[i]+"HotspoLayer");
					this.removeDataLayer({"id":id[i]});
				}
			}
		},

		/**
		 * 添加导航线矢量图层
		 * @param opt图层配制参数对象
		 * @return
		 */
		addRoadLayer: function(o){
			var f = true;
			if(o.length){
				var ff = [];
				for(var i = 0; i< o.length; i++){
					ff.push($$.addLayer(o[i], iD.store.layers.road));
				}
				f = ff.indexOf(true) !== -1;
			}else{
				f = $$.addLayer(o, iD.store.layers.road);
			}
			if (!f) return this;

			return this.flushView(o);
		},

		/**
		 * 同时添加多个图层
		 * @param o 图层对象/对象数组
		 * 通过对象中的type来区分添加的图层类型
		 * type = area/line/point/road
		 * @return
		 */
		addDataLayer: function(o){
			var f = true;
			if(o.length){
				var ff = [];
				for(var i = 0; i<o.length; i++){
					if(o[i].id && o[i].type){
						ff.push($$.addLayer(o[i], iD.store.layers[o[i].type]));
					}
				}
				f = ff.indexOf(true) !== -1;
			}else{
				if(o.id && o.type){
					f = $$.addLayer(o, iD.store.layers[o.type]);
				}
			}
			if (!f) return this;

			return this.flushView(o);
		},

        /**
		 * 获取数据图层数组
		 * @return array 图层对象
		 */
		getDataLayers : function(){
			return context.layers().getDataLayers();
		},
		/**
		 * 获取热点图层数组
		 * @return array 图层对象
		 */
		getHotspotLayers : function(){
			return context.layers().getHotspotLayers();
		},

		/**
		 * 根据ID获取图层对象
		 * @return Object 图层对象
		 */
		getDataLayer : function(id){
            return context.layers().getLayerById(id);
		},

		getOverLayerByID : function(id){
			var layers = iD.data.imagery ;
			for(var i in layers)
			{
				if(layers[i].isOverlay && layers[i].id == id){
					return layers[i]
				}
			}
			return  false;
		},
		/**
		 * 获取图层数组
		 * @return array 图层对象
		 */
		getTileLayers : function(){
            return $$.getImagery(false);
		},

		/**
		 * 获取图层数组
		 * @return array 图层对象
		 */
		getOverlayers :  function(){
            return $$.getImagery(true);
		},

        /**
		 * 刷新矢量地图
		 */
        flushView : function(layer, isUpdate){
			if(isUpdate)
				context.event.changemap();
			else
				// 更新地图 此处BUG ，只有更新URL相关，或者删除图层才刷新。
				context.flush(); 
            // 更新面板
			if(layer.length){
				for(var i= 0,l=layer.length;i<l;i++){
					context.ui().updateLayer(layer[i]);
				}
			}else{
				context.ui().updateLayer(layer);
			}

            return this;
        },

        /**
		 * 刷新背景栅格地图
		 */
        flushBackground : function(layer){
           if( layer.isOverlay )
           {
           	  this._removeOverlayer(layer);
              this.addOverlayer(layer);
           }else{
           	  this._removeTileLayer(layer);
              this.addTileLayer(layer);
           }


           return this;
        },

        /**
		 * 根据layer删除图层数组
		 * @param layer 对象数组
		 * @return
		 */
        removeDataLayers : function(layers){
            if(layers.length){
				for(var i = 0; i < layers.length; i++){
					this.removeDataLayer(layers[i]);
				}
			}
        },

        /**
		 * 根据layer删除图层数组
		 * @param layer 对象数组
		 * @return
		 */
        removeTileLayers : function(layers){
            if(layers.length){
				for(var i = 0; i < layers.length; i++){
					this._removeTileLayer(layers[i]);
				}
			}
        },

        /**
		 * 根据layer删除图层数组
		 * @param layer 对象数组
		 * @return
		 */
        removeOverlayers : function(layers){
            if(layers.length){
				for(var i = 0; i < layers.length; i++){
					this._removeOverlayer(layers[i]);
				}
			}
        },

		/**
		 * 根据layer删除图层
		 * @param layer 对象数组
		 * @return
		 */
		removeDataLayer : function(layer){
			context.connection().
			        removeModelEntityCache(context.layers(layer.id));
			context.layers()
			  .removeLayer(layer);
			return this.flushView(layer);
		},

        /**
         * 删除所有数据图层
         * @return
         */
        removeALLDataLayer : function(){
            context.layers().removeAllLayers();
            return this.flushView(editor.context.layers().getLayers());
        },

		/**
		 * 根据layer删除图层
		 * @param layer 对象数组
		 * @return
		 */
		_removeTileLayer : function(layer){
			var _ = (typeof layer === 'string' ? {id: layer} : layer);
			if (_ && $$.isOverlayer(_.id || _)) return;
            $$.removeImagery(_);
            context.background().init();
            return this;

		},
		
		removeTileLayerById: function (ids) {
			var that = this;
			if (Object.prototype.toString.call(ids) === '[object Array]') {
				ids.forEach(function (id) {
					that._removeTileLayer({id: id});
				});
			} else {
				that._removeTileLayer({id: ids});
			}
		},

		/**
		 * 根据layer删除图层
		 * @param layer 对象数组
		 * @return
		 */
		_removeOverlayer: function(layer){
			var _ = (typeof layer === 'string' ? {id: layer} : layer);
			if (_ && !$$.isOverlayer(_.id || _)) return;
            $$.removeImagery(_);
            context.background().init();

            return this;

		},
		
		removeOverlayerById: function (ids) {
			var that = this;
			if (Object.prototype.toString.call(ids) === '[object Array]') {
				ids.forEach(function (id) {
					that._removeOverlayer({id: id});
				});
			} else {
				that._removeOverlayer({id: ids});
			}
		},

		/**
		 * 添加影像图层
		 * @param o 影像对象/对象数组
		 * @return
		 */
		// addTileLayer: function(opt){
		// 	if(opt.length){
		// 		for(var i = 0; i<opt.length; i++){
		// 			$$.addImagery(opt[i]);
		// 		}
		// 	}else{
		// 		$$.addImagery(opt);
		// 	}
        //
		// 	context.background().init();
		// 	return this;
		// },
        addTileLayer: function(opt){
            if(opt.length){
                for(var i = 0; i<opt.length; i++){
                    //$$.addOverlayer(opt[i]);
                    context.background().addLayer($$.addOverlayer(opt[i]));
                }
            }else{
                //$$.addOverlayer(opt);
                context.background().addLayer($$.addOverlayer(opt));
            }
        },

		/**
		 * 添加叠加覆盖物
		 * @param Json(opt) 属性对象
		 * @return
		 */
        addOverlayer: function(opt){
            if(opt.length){
                for(var i = 0; i<opt.length; i++){
                    //$$.addOverlayer(opt[i]);
                    context.background().addLayer($$.addOverlayer(opt[i]));
                }
            }else{
                //$$.addOverlayer(opt);
                context.background().addLayer($$.addOverlayer(opt));
            }
            //context.background().init();
            return this;
        },

		/**
		 * 修改tags属性
		 * @param id 属性对象ID
		 * @param tags 
		 * @return
		 */
		updateTags : function(id,tags,save){
			if(!id || !tags) return;
			id = iD.util.transArray(id);
			var actions = [];
	        id.forEach(function(d) {
	            var entity = context.entity(d);
				if(entity instanceof iD.Node || entity instanceof iD.Way)  
				{
					tags = $$.clean(_.extend({}, entity.tags, tags));
			        if (!_.isEqual(entity.tags, tags)) {
	                    actions.push(iD.actions.ChangeTags(d, tags));
                        var way =  context.graph().parentWays(entity).length>0?context.graph().parentWays(entity):null;
                        context.event['entityedite'] && context.event['entityedite']({entitys : way});
			        }
				}
	        });
	        if(actions.length != 0)
	        {
	        	actions.push(t('operations.change_tags.annotation'));
	        	context.perform.apply(this,actions); 
	        	save && this.saveDataLayer();
	        }
              
			
	        return this;
		},
        /**
         * 撤销数据
         * @return
         */
        undoOperation : function(){
            context.undo();
        },
        /**
         * redo数据
         * @return
         */
        redoOperation : function(){
            context.redo();
        },
		/**
		 * 保存数据
		 * @return
		 */
		saveDataLayer : function(){ 
           if( context.history().hasChanges())
           {
           	   //d3.event.preventDefault();
               context.enter(iD.modes.Save(context, t('save.title')));
           }
		},

        addLayerFeature : function(feature){
           this.addLayerEntity(feature);
        },
        /**
		 * 添加图层元素
		 * @param Entity(entity) 对象
		 * @return
		 */
        addLayerEntity : function(entity){
        	if(entity instanceof iD.Node)  
		        context.perform(
		            iD.actions.AddEntity(entity),
		            t('operations.add.annotation.point'));  
		    else if(entity instanceof iD.Way){
		    	var layer = context.layers(entity.layerId);
		    	if(entity.isArea()){
		    		var actions = [];
			    	var nodes = entity.nodes;
			    	var news = [];
			    	for(var i in nodes)
			    	{
			    		news.push(nodes[i].id);
			    		// 合并tags
			    		var tags = $$.mergeObject(nodes[i].tags || {},{/*datatype: "LandUse"*/});
			    		nodes[i].setTags(tags);
			    		actions.push(iD.actions.AddEntity(nodes[i]));
			    	}
			    	news.push(nodes[0].id);
	                entity.nodes = news;
                    var tags = $$.mergeObject(entity.tags || {},$$.defauteTags(entity));
	                entity.setTags(tags);
	                entity.tags.area = '';

	                actions.push(iD.actions.AddEntity(entity));
	                actions.push(t('operations.start.annotation.area'));
	                context.perform.apply(this,actions);
		    	}else if(entity.type == iD.data.GeomType.WAY){
                    var actions = [];
			    	var nodes = entity.nodes;
			    	var news = [];
			    	for(var i in nodes)
			    	{
			    		news.push(nodes[i].id);
			    		var tags = $$.mergeObject(nodes[i].tags || {},{/*datatype: ""*/});
			    		nodes[i].setTags(tags);
			    		actions.push(iD.actions.AddEntity(nodes[i]));
			    	}
	                entity.nodes = news;
	                var tags = $$.mergeObject(entity.tags || {},$$.defauteTags(entity));
	                entity.setTags(tags);
	                actions.push(iD.actions.AddEntity(entity));
	                actions.push(t('operations.start.annotation.line'));
	                context.perform.apply(this,actions);
		    	}else if(entity.modelName == iD.data.DataType.ROAD){
		    		
		    	}
		    	
		    }
        },
		getEntity:function(id){
			return context.entity(id);
		},
		/**
		 * 添加几何覆盖物{marker,polyline,polygon}
		 * @param overlayers 覆盖物对象
		 * @return
		 */
		addOverlays : function(o){
			 if( Object.prototype.toString.call(o) === '[object Array]' )
			 {
                for(var i in o)     
                  map.addOverlays(o[i]);
			 }else
                map.addOverlays(o);

             map.drawOverlayers();   
		},

		/**
		 * 删除几何覆盖物{marker,polyline,polygon}
		 * @param Array(marker,polyline,polygon) 覆盖物对象
		 * @return
		 */
		removeOverlays : function(o){
             if( Object.prototype.toString.call(o) === '[object Array]' )
			 {
                for(var i in o)     
                  map.removeOverlays(o[i]);
			 }else
                map.removeOverlays(o);

             map.drawOverlayers();    
		},

        getMap : function(){
            return map;
        },
        
        getContext : function(){
            return context;
        },

		/**
		 * 获取几何覆盖物{marker,polyline,polygon,icon}
		 * @param Array(overlaysid) 覆盖物对象ID
		 * @return Array(marker,polyline,polygon,icon)
		 */
		getOverlays : function(overlaysid){
			return map.getOverlays(overlaysid);
		},

        /**
		 * 根据类型获取几何覆盖物
		 * @param String(type) 覆盖物类型{marker,polyline,polygon,icon}
		 * @return Array(marker,polyline,polygon,icon)
		 */
		getOverlaysByType : function(type){
            return map.getOverlays()[type];
        },

		/**
		 * 高亮覆盖物{marker,polyline,polygon}
		 * @param Array(overlaysid) 覆盖物对象ID 
		 * @return
		 */
		lightOverlays : function(overlaysid){
            map.lightOverlays(overlaysid);
            return this;
		},

		/**
		 * 清除高亮覆盖物{marker,polyline,polygon}
		 * @return
		 */
		lightOverlaysClean : function(){
            map.lightOverlays([]);
            return this;
		},
		
        /**
		 * 根据ID设置覆盖物编辑
		 * @param Array(id) 覆盖物对象ID
		 * @param Boolean(isEnable) 是否编辑
		 * @return
		 */
        setOverlaysEnable : function(id,isEnable){
            if(!id) return;
            if (typeof isEnable === 'undefined') isEnable =  false;
			id = iD.util.transArray(id);
			this.getOverlays(id).forEach(function(overlay) {
	            overlay.editable = isEnable;
	        });
	        map.drawOverlayers();
        },
        /**
		 * 根据类型设置覆盖物编辑
		 * @param String(type) 覆盖物类型
		 * @param Boolean(isEnable) 是否编辑
		 * @return
		 */
        setOverlaysEnableByType : function(type,isEnable){
            if(!type) return;
            if (typeof isEnable === 'undefined') isEnable =  false;
            this.getOverlaysByType(type).forEach(function(overlay) {
	            overlay.editable = isEnable;
	        });
            map.drawOverlayers();
        },
        /**
		 * 更新覆盖物{marker,polyline,polygon}
		 * @param Array(overlays) 覆盖物对象
		 * @return
		 */
        updateOverlays : function(overlays){
            map.updateOverlays(overlays);
        },
        
        cleanOverlays: function () {
        	var overlayers = context.map().getOverlays();
        	for (var type in overlayers) {
        		this.removeOverlays(overlayers[type]);
        	}
        },
        /**
		 * 显示隐藏覆盖物
		 * @param Array(id...) 覆盖物ID
		 * @param Boolean(display) 是否显示
		 * @return
		 */
        displayOverlays : function(id,display){
            if(!id) return;
			id = iD.util.transArray(id);
			this.getOverlays(id).forEach(function(overlay) {
				if(display)  overlay.display = false;
	            else    overlay.display = true;	
	        });
	        map.drawOverlayers();
        },
        /**
		 * 显示覆盖物
		 * @param Array(id...) 覆盖物ID
		 * @return
		 */
        showOverlays : function(id){
            this.displayOverlays(id,false);
        },
         /**
		 * 隐藏覆盖物
		 * @param Array(id...) 覆盖物ID
		 * @return
		 */
        hideOverlays : function(id){
            this.displayOverlays(id,true);
        },
        removeOverlaysByType: function (type) {
        	if (['distance', 'polygon', 'marker', 'rectangle', 'circle', 'polyline', 'icon','measurearea'].indexOf(type) === -1) return;
        	var overlayers = context.map().getOverlays(), overlays = overlayers[type], oves = [];
        	if (['measurearea','distance', 'rectangle'].indexOf(type) !== -1)
        		('rectangle' === type || 'measurearea' === type) ? overlays = overlayers['polygon'] : overlays = overlayers['polyline'];
        	for (var i in overlays) 
    			if (overlays[i].mode === type || !overlays[i].mode) oves.push(overlays[i]);
        	overlays = oves;
    		this.removeOverlays(overlays);
        },
        /**
		 * 设置选中高亮
		 * @param Array(bounds) 视图范围
		 * @param function(filter) 过滤回调
		 * @return Array(selected)
		 */
        seletedInRectangle : function(bounds,filter){
            this.setSelected(bounds,filter); 
        },
         /**
		 * 设置选中高亮
		 * @param Array(bounds) 视图范围
		 * @param function(filter) 过滤回调
		 * @return Array(selected)
		 */
        setSelected : function(bounds,filter){
        	// var layer = context.layers().getCurrentEnableLayer();
        	var layer = context.layers().getLayer();
        	if(!bounds || !layer) return;
            // [[minx,miny],[maxx,maxy]]
            filter = filter || iD.util.empty;
            function INSTAN_NODE(entity){	return entity instanceof iD.Node ;}
            function INSTAN_WAY(entity){	return entity instanceof iD.Way ;}
            var extent = iD.geo.Extent(bounds);
            var selected = context.intersects(extent).filter(function (entity) {
                if( (layer.id !== entity.layerId) || 
                    (!layer.isPoint() && INSTAN_NODE(entity) ) ){
                	 return false; 
                }

                if( INSTAN_NODE(entity) || INSTAN_WAY(entity) ){
                   return filter(entity) && true;
                }
                return false;
                // if(entity instanceof iD.Node)
                //    return iD.util.isPointInPolygon(entity,polygon);
            });
            var length = selected.length ;
           
            // selected point and area
            if( length && ( INSTAN_NODE(selected[0]) || layer.type == "area") ){
                if(length != 0) context.enter(iD.modes.Select(context, _.pluck(selected, 'id')));
                return selected;
            }
            // selected polyline
            if ( length && INSTAN_WAY(selected[0]) && layer.type != "area"  ) { 
                var extend = iD.util.lassExtend, graph = context.graph(), wrap = [];
                
                selected.forEach(function(e){
	                    if(layer.id !== e.layerId){ return; }
	                    if(e.type === 'node'){
	                        extend.isPointInRect({ lon : e.loc[0], lat : e.loc[1] } ,extent) && wrap.push(e);
	                        return;
	                    }

                        var n = e.nodes;  
	                    for(var i = 0; i < n.length; i ++){
	                        if( ( i + 1 ) >= n.length ) break;

	                        var a = graph.entity(n[i]),
	                            b = graph.entity(n[i + 1]),
	                            c = [a.loc[0],a.loc[1],b.loc[0],b.loc[1]],
	                            intersects = extend.isLineInRect(extent, c);

	                        if(intersects && (intersects != 3) && wrap.push(e)) break; 
	                    }
                });
                if(wrap.length) context.enter(iD.modes.Select(context, _.pluck(wrap, 'id')));
                return wrap;
            }
        },

         /**
		 * 获取地图参数
		 * @return Array(options) 
		 */
		getOptions : function(){
			return context.options;
		},
		
		//openPanorama: function (optt, callback) {
		//	if(!context.options.loadPanorama) return;
		//	var opt = $$.mergeObject(optt || {}, {lnglat: context.map().center(), pdis: 150, width: 600, height: 400, zIndex: 1000}),
		//		pdis = opt.pdis, lnglat = opt.lnglat;
		//
		//	context.panoramaOpt = opt;
		//
		//	var tt = setInterval(function () {
		//		if (!context.panoramaOpt) {
		//			clearInterval(tt);
		//		} else {
		//			context.event.openpanorama(context.panoramaOpt);
		//			if (context.panoramaOpt.panoMapId) {
		//				clearInterval(tt);
		//				runPanorama();
		//			}
		//		}
		//	}, 100);
		//
		//	function runPanorama () {
		//
		//		var mapContainer = iD.util.getDom(context.panoramaOpt.panoMapId),
		//			panoContainer = iD.util.getDom(context.panoramaOpt.panoHolderId);
		//
		//		var center = new qq.maps.LatLng(lnglat[1], lnglat[0]);
		//		/**
		//		var qMap = new qq.maps.Map(mapContainer,{
		//			center: center,
		//			zoom: 18
		//		});*/
		//		var pano = new qq.maps.Panorama(panoContainer, {
		//			disableMove: false,
		//			zoom: 1
		//		});
		//		var pano_service = new qq.maps.PanoramaService();
		//		pano_service.getPano(center, pdis, function (result){
		//			pano.setPano((result && result.svid) || null);
		//		});
		//		callback && callback(pano);
		//	}
		//},
		//
	    cleanHistory : function() {
			context.flush();//history().1et();
		},
		//closePanorama: function () {
		//	context.event.closepanorama();
		//	context.panoramaOpt = null;
		//	delete context.panoramaOpt;
		//},

		disconnect:function(selectedIDs){
			var _disconnect =  iD.operations.Disconnect(selectedIDs,context);
			 if(_disconnect.available()){
				return _disconnect();
			 }
             return false;
		},
		wayMerge:function(selectedIDs){
			var _merge =  iD.operations.WayMerge(selectedIDs,context);
			if(_merge.available()){
				return _merge();
			}else{
				return false;
			}
		},
        getHistory:function(){
            if( context.history().hasChanges())
            {
                return context.history().changes(iD.actions.DiscardTags(context.history().difference()));
            }
            return false;
        },
        getParentWays:function(nodeEntity){
            return context.history().graph().parentWays(nodeEntity);
        },
        getSelectedIDs:function(){
            return context.selectedIDs();
        },
		moveEntity:function(selectedIDs){
			var _move =  iD.operations.Move(selectedIDs,context);
			if(_move.available()){
				_move();
			}
		}
    });

/**
 * 内部使用的私有方法
 */
var $$ = {
	/**
	 * 初始化地图
	 */
	init: function(id, param){
		var KDSEditorLibraryPath = window.KDSEditorLibraryPath || "";
		context = iD().assetPath(KDSEditorLibraryPath + 'dist/');

		context.locale("zh-CN");
		
        map = context.map();
        if(param && param.ui === false){
        	context.default_ui_none = true;
        }else if(typeof param.ui === 'object'){
        	context.default_ui_none = param.ui;
        }
        
        d3.select('#' + id).call(context.ui());
        
        //设置预设信息
        if(param){
        	var maxz = 30,minz = 1;

        	if(!param.center){
        		param.center = [116.305197,39.982418];
        	}
        	// if (param.cache) $$.setCenterFromCache(param);

        	if(!param.maxZoom){
        		param.maxZoom = maxz;
        	}
        	if(!param.minZoom){
        		param.minZoom = minz;
        	}

        	if(param.maxZoom &&( param.maxZoom>maxz || param.maxZoom <= minz )){
        		param.maxZoom = maxz;
        	}

        	if(param.minZoom && ( param.minZoom < minz || param.minZoom >= maxz)){
        		param.minZoom = minz;
        	}

        	if(param.maxZoom <= param.minZoom){
        		param.maxZoom = maxz;
        	}
        	if(param.minZoom >= param.maxZoom){
        		param.minZoom = minz;
        	}

        	if(!param.zoom && param.minZoom <= 16 && param.maxZoom >= 16){
        		param.zoom = 16;
        	}

        	if(!param.zoom && (param.minZoom > 16 || param.maxZoom < 16)){
        		param.zoom = param.minZoom;
        	}

        	if(param.zoom && param.maxZoom && (param.zoom > param.maxZoom)){
        		param.zoom = param.maxZoom;
        	}
        	if(param.zoom && param.minZoom && (param.zoom < param.minZoom)){
        		param.zoom = param.minZoom;
        	}

        	param.zoom && map.zoom(param.zoom);
        	param.maxZoom && map.max_zoom(param.maxZoom);
        	param.minZoom && map.min_zoom(param.minZoom);
        	param.center && map.center(param.center);




        	if(!param.editableLevel || param.editableLevel < 10){
        		param.editableLevel = 10;
        	}
        	if(param.editableLevel>maxz){
        		param.editableLevel = maxz;
        	}
        	param.editableLevel && map.editableLevel(param.editableLevel);

        	if(param.serverUrl){
        		iD.store.url.layer = param.serverUrl;
        	}
        	if(param.searchUrl){
        		iD.store.url.searchpoi = param.searchUrl;
        	}
        	if (typeof param.loadPanorama === 'undefined') {
        		param.loadPanorama = true;
        	}
        	if (typeof param.overlaysApply === 'undefined') {
        		param.overlaysApply = true;
        	}
        	context.options = param;
        }

        return context;
	},
	/**
	 * var json1 = {a:6,b:2,c:4};
	 * var json2 = {a:1,b:0,c:3};
	 * json1 替换json2中已有的值，没有则追加
	 * 返回合并后的新对象
	 */
	mergeObject: function (json1,json2){
		for(var key in json1){
			json2[key] = json1[key];
		}
		//创建新对象
		var r = {};
		for(var k in json2){
			r[k] = json2[k];
		}
		return r;
	},
	addLayer: function(opt, typeopt ={}){
		if(!opt.id) return false;
		var lays = context.layers().getLayers();
		//ID 重复不添加
		for(var i =0; i<lays.length; i++){
			if(lays[i].id === opt.id)return false;
		}
		if(!opt.url && typeopt && typeopt.type != "hotspot"){
			opt.url = iD.store.url.layer;
		}
		// var enlayer = context.layers().getCurrentEnableLayer();
		var enlayer = context.layers().getLayer();
		// if(enlayer){
		// 	//保证可编辑图层唯一
		// 	opt.editable = false;
		// };
		var o = $$.mergeObject(opt, _.clone(typeopt));
		var lay;
		if (opt instanceof DataLayer || opt instanceof HotspotLayer) {
			var llayer = iD.Layer(o);
			for(var key in llayer) opt[key] = llayer[key];
			lay = opt;
		} else if(o.type && o.type == "hotspot"){
			lay = new HotspotLayer(iD.Layer(o));
		}else{
			lay = new DataLayer(iD.Layer(o));
		}

		// 判断是否有导航图层，编辑器只能存在一个导航图层
		var layers = context.layers().getLayers();
		var add = true;
		// for(var i in layers)
		// {
		// 	layers[i].isRoad() && lay.isRoad() && (add =  false);
		// }
		add && context.layers().addLayer(lay);
		return true;
	},
    // "isOverlay": false
	addImagery: function(opt){
		if(!opt.url){
			opt.url = iD.store.url.layer;
		}
		var ox = _.clone(iD.store.imagery.imagery);
		    
		var o = $$.mergeObject(opt, ox);
		
		if (opt instanceof TileLayer) {
			for(var key in o) opt[key] = o[key];
			o = opt;
		} else {
			o = new TileLayer(iD.Layer(o));
		}
		    
		iD.data.imagery.push(o);
		iD.data.imagery.sort(function (a, b) {
			return (a.order || 0) > (b.order || 0) ? -1 : 1;
    	});
	},
	// "isOverlay": true
	addOverlayer: function(opt){
		if(!opt.url){
			opt.url = iD.store.url.layer;
		}
        var lays = context.background().getLayers();
		// var lays = iD.data.imagery;
		//ID 重复不添加
		for(var i =0; i<lays.length; i++){
			if(lays[i].id === opt.id)return false;
		}
		var ox = _.clone(iD.store.imagery.overlayer);

	    var o = $$.mergeObject(opt, ox);
	    
	    if (opt instanceof Overlayer) {
			for(var key in o) opt[key] = o[key];
			o = opt;
		} else {
			o = new Overlayer(iD.Layer(o));
		}
	    return o;
	    // iD.data.imagery.push(o);
	    // iD.data.imagery.sort(function (a, b) {
			// return (a.order || 0) > (b.order || 0) ? -1 : 1;
    	// });
	},

	// 删除栅格图层
	removeImagery : function(layer){
		for(var i =0 ; i < iD.data.imagery.length ; i++)
        {
        	var _ = iD.data.imagery[i] ; 
        	if( _ && layer.id && _.id == layer.id)
        	{
                iD.data.imagery.splice(i,1);
                //if (_.panoramaOptions) this.dealRemovePanorama();
        	}
        }
	},

	getImagery : function(type){
		var layers = iD.data.imagery , _ = [];
		for(var i in layers)
		{
            if(type)
              layers[i].isOverlay && _.push(layers[i]);
            else
              !layers[i].isOverlay && _.push(layers[i]);
		}
        return _;
	}
	,

	clean : function(o) {
        var out = {}, k, v;
        /*jshint -W083 */
        for (k in o) {
            if (k && (v = o[k]) !== undefined) {
                out[k] = v.trim();
            }
        }
        /*jshint +W083 */
        return out;
    },

    defauteTags : function(entity){
    	var defaultTags = {}, modelEntity = iD.Layers.getLayer(entity.layerId).modelEntity(),
    	gtype = modelEntity.getGeoType();
	    modelEntity.getFields(gtype).filter(function(d){
	    	if(d.defaultvalue && !_.isEmpty(d.defaultvalue)){
	    		defaultTags[d.name] = d.defaultvalue;
	        }
	        return false;
	    });
	    return defaultTags;
    },
    
    isOverlayer: function (id) {
    	var layers = iD.data.imagery;
		for(var i in layers) if (id === layers[i].id && layers[i].isOverlay) return layers[i];
    },
    
    setCenterFromCache: function (param) {
    	var s_m_e_c = context.storage('s_map_editor_center');
    	if (s_m_e_c !== null && s_m_e_c !== '') {
    		var s_m_e_c_x_y = s_m_e_c.split(','), c_x = parseFloat(s_m_e_c_x_y[0]), c_y = parseFloat(s_m_e_c_x_y[1]);
    		if (c_x !== 0 && c_y !== 0) param.center = [s_m_e_c_x_y[0], s_m_e_c_x_y[1]];
    	}
    },
    //处理街景图层附属物
    //dealRemovePanorama: function () {
    //	for (var ik in context._panoramaOpt) {
    //		var ikObj = context._panoramaOpt[ik];
    //		context.map().removeOverlays(ikObj);
    //		ikObj && ikObj.parentNode && ikObj.parentNode.removeChild(ikObj);
    //		ikObj = null;
    //		context.map().drawOverlayers();
    //	}
		//context.map().surface.on('click.map', null);
    //	context.event.on('mousemove', null);
    //}
}

    
    /**
    * add class {DataLayer,Overlayer,TileLayer,Event,AMapOptions,StyleOptions,ToolBar,LayerPanel,NaviBar}
    **/

    // PointLayer,LineLayer,RoadLayer,AreaLayer

	var DataLayer = function(opt) {
        this.initialize(opt);
    };
    _.extend(DataLayer.prototype, {
    	isBbox: true,
    	initialize: function( opt) {
	    	for(var key in opt){
				this[key] = opt[key];
			}
	    },
	    update : function(map){
			if(!map) return;
			map.flushView(this, true);
			return this;
		},
		setOptions : function(opt){
			for(var i in opt){
				this[i] = opt[i];
			}
			this.editor && this.update(this.editor);
			return this;
		}
    });

	var HotspotLayer = function(opt) {
		this.initialize(opt);
	};
	_.extend(HotspotLayer.prototype, {
		initialize: function( opt) {
			for(var key in opt){
				this[key] = opt[key];
			}
		},
		update : function(map){
			if(!map) return;
			map.flushView(this, true);
			return this;
		},
		setOptions : function(opt){
			for(var i in opt){
				this[i] = opt[i];
			}
			if(this.editor && this.isHotspot()){
				var hotlayer = this.editor.getOverLayerByID(this.id+"HotspoLayer");
				hotlayer.setOptions({editor:this.editor,"name": this.name,
					"type": "tms",
					"url": this.tileUrl,
					"visible": this.editable
				})
			}
			this.editor && this.update(this.editor);
			return this;
		}
	});
    // 
    var Overlayer = function(opt) {
        this.initialize(opt);
    };
    _.extend(Overlayer.prototype, {
    	initialize: function( opt) {
	    	for(var key in opt){
				this[key] = opt[key];
			}
        },
		update : function(map){
			if(!map) return;
			map.flushBackground(this);
		},
		setOptions : function(opt){
	        for(var i in opt){
					this[i] = opt[i];
			}
			this.editor && this.update(this.editor);
			return this;
		}
    });	
    // 
    var TileLayer = function(opt) {
        this.initialize(opt);
    };
    _.extend(TileLayer.prototype, {
    	initialize: function( opt) {
	    	for(var key in opt){
				this[key] = opt[key];
			}
    	},
		update : function(map){
			if(!map) return;
			map.flushBackground(this);
		},
		setOptions : function(opt){
            for(var i in opt){
					this[i] = opt[i];
			}
			this.editor && this.update(this.editor);
			return this;
		}
    });	

    window.Point = iD.Marker;
    window.Marker =  iD.Marker;
    window.Icon =  iD.Icon;
    window.Polyline =  iD.Polyline;
    window.Polygon =  iD.Polygon;
    window.Circle =  iD.Circle;
    window.InfoWindow =  iD.InfoWindow;
    window.OverView =  iD.OverView;

    window.Node =  iD.Node;
    window.Way =  iD.Way;

    window.KDSEditor = KDSEditor;
    window.MapEditor = KDSEditor;
	window.DataLayer = DataLayer;
	window.HotspotLayer = HotspotLayer;
	window.Overlayer = Overlayer;
	window.TileLayer = TileLayer;

    window.TransPolygon =  iD.TransPolygon;//事务

    // var end_time = +new /*Date; //时间终点
    // var headtime = end_time -*/ start_time; //头部资源加载时间
    //console.log("白屏时间："+headtime+"ms");
})();

