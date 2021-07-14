iD.ui = function(context) {
    function render(container) {
        var map = context.map();

        if (iD.detect().opera) container.classed('opera', true);

        container.append('svg')
            .attr('id', 'defs')
            .call(iD.svg.Defs(context));

        var isNoneLeft = isNoneFooter = isNoneTop = isNoneRight = isNoneRight2 = tilelayer = 'none',uiNone = context.options.ui;
        if(!(typeof uiNone === 'object') && !uiNone){
        	isNoneLeft = isNoneFooter = isNoneTop = isNoneRight = isNoneRight2 = tilelayer = 'block';
        }
        if(typeof uiNone === 'object'){
        	if(uiNone.panel != false){
        		isNoneLeft = 'block'
        	}
        	if(uiNone.bar != false){
        		isNoneTop = 'block'
        	}
        	if(uiNone.zoom != false){
        		isNoneRight = 'block';
        	}

        	if(uiNone.toolbar != false){
        		isNoneRight2 = 'block';
        	}
        	if(uiNone.tilelayer != false){
        		tilelayer = 'block';
        	}
			if(uiNone.footer != false){
				isNoneFooter = 'block';
			}
        }
        if(isNoneLeft === 'block'){
        	container.append('div')
        	.attr('id', 'KDSEditor-sidebar')
        	.attr('class', 'col3')
        	.call(ui.sidebar);
        }
        
        //var panorama;
        //context.event.on('openpanorama',function () {
        //	if (panorama) panorama.remove(); panorama = null;
        //	panorama = content.append('div')
	     //   	.attr('id', 'KDSEditor-Panorama-Container')
	     //   	.attr('class', 'KDSEditor-Panorama-Container')
			//	.attr('style', 'left: 0px;top: 0px;')
	     //   	.call(ui.panorama);
        //});
        //context.event.on('closepanorama',function (debug) {
        //	dealPanoramaDom(debug);
        //	if (panorama) panorama.remove(); panorama = null;
        //});
        
        //test
        //function dealPanoramaDom (debug) {
        //	/**
        //	function active (d) {
        //		if (d) {
        //			if (d.panorama) {
        //				var _visible = d.visible === false ? true : false;
        //				d.visible = d.visible ? false : true;
        //    			return _visible;
        //    		}
        //		}
        //	}
        //	d3.selectAll('.layer, .custom_layer')
        //    	.classed('active', active)
        //    	.selectAll('input')
        //    	.property('checked', active);
        //	*/
        //
        //	if (debug) {//删除不必要的节点
        //		var __tt = setInterval(function () {
			//		if (d3.select('.addressbar').node()) {
			//			clearInterval(__tt);
			//	        d3.selectAll('.APPDownload, .SearchAround_info, .searchAround').remove();
			//		}
    		//	}, 100);
        //		return;
        //	}
        //
        //
        //	if (__qq_pano_options.m) __qq_pano_options.m = null;
        //	__qq_pano_options.__qq_minimap_q.destory();
        //	__qq_pano_options.inter = false;
        //	__qq_pano_options.__qq_ablum_w.inited = false;
        //	__qq_pano_options.__qq_ablum_q.floorContainer = null;
        //
        //
        //	d3.selectAll('.mask_layer, .APPDownload, .SearchAround_info, .searchAround, .addressbar').remove();
        //	var scriptDom = [], nodes = document.body.childNodes;
        //	for (var ikk in nodes) {
        //		nodes[ikk].nodeName === 'SCRIPT' && nodes[ikk].src.indexOf('qq') !== -1 && document.body.removeChild(nodes[ikk]);
        //	}
        //	//context.map().surface.on('click.map', null);
        //	if (__qq_pano_options.panoramaDom) __qq_pano_options.panoramaDom.innerHTML = '';
        //}

        var content = container.append('div')
            .attr('id', 'KDSEditor-content');

        var bar = content.append('div')
            .attr('id', 'KDSEditor-bar')
            .attr('style', 'display:' + isNoneTop)
            .attr('class', 'KDSEditor-div KDSEditor-fillD');

        var m = content.append('div')
            .attr('id', 'map')
            .call(map);

        bar.append('div')
            .attr('class', 'KDSEditor-spacer KDSEditor-col13');
        
        bar.append('div')
        .attr('class', 'poi-search')
        .call(iD.ui.PoiSearch(context));

        var limiter = bar.append('div')
            .attr('class', 'KDSEditor-limiter');

        limiter.append('div')
            .attr('class', 'button-wrap joined col3')
            .call(iD.ui.Modes(context), limiter);
        
        limiter.append('div')
        .attr('class', 'KDSEditor-button-wrap joined col-road1')
//        .attr('style', 'display:none')
        .call(iD.ui.RoadCrossing(context));

        limiter.append('div')
            .attr('class', 'KDSEditor-button-wrap joined KDSEditor-col1')
            .call(iD.ui.UndoRedo(context));

        limiter.append('div')
            .attr('class', 'KDSEditor-button-wrap KDSEditor-col1')
            .call(iD.ui.Save(context));

        content.append('div')
            .attr('class', 'KDSEditor-spinner')
            .call(iD.ui.Spinner(context));

        //content
        //    .call(iD.ui.Attribution(context));

        content.append('div')
            .style('display', 'none')
            .attr('class', 'help-wrap map-overlay KDSEditor-fillL KDSEditor-col5 content');

        var controls = content.append('div')
            .attr('class', 'map-controls');

        controls.append('div')
        .attr('class', 'map-control zoomlevel-control')
        .attr('style', 'display:' + isNoneRight)
        .call(iD.ui.ZoomLevel(map));
        
        controls.append('div')
            .attr('class', 'map-control zoombuttons')
            .attr('style', 'display:' + isNoneRight)
            .call(iD.ui.Zoom(context));
        // 新增{拉框放大，鼠标多边形,鼠标测距}功能
        controls.append('div')
            .attr('class', 'map-control lasszoombuttons')
            .attr('style', 'display:' + isNoneRight2)
            .call(iD.ui.LassoZoom(context));

        controls.append('div')
            .attr('class', 'map-control toolbarbuttons')
            .attr('style', 'display:' + isNoneRight2)
            .call(iD.ui.toolbar.Toolbar(context));


        // controls.append('div')
        //     .attr('class', 'map-control background-control')
        //     .attr('style', 'display:' + tilelayer)
        //     .call(iD.ui.Background(context));

        controls.append('div')
            .attr('class', 'map-control help-control')
            .call(iD.ui.Help(context));

        //鹰眼
        var overview, isClose = false;
        context.overview_isBand = true;//触发先执行, 加此标识做延时判断, 有待完善
        function getBoundsByLocs (locs) {
        	var minll = [Infinity, Infinity], maxll = [0, 0], loc;
    		for (var i in locs) {
    			loc = locs[i];
    			if (minll[0] > loc[0]) minll[0] = loc[0];
    			if (minll[1] > loc[1]) minll[1] = loc[1];
    			
    			if (maxll[0] < loc[0]) maxll[0] = loc[0];
    			if (maxll[1] < loc[1]) maxll[1] = loc[1];
    		}
    		return [minll, maxll];
        }
        context.event.on('openoverview', function (opt) {
        	if (overview) overview.remove(); overview = null;
        	var ov = context.overview(context);
        	ov.zoom(0);
        	var extentC, _extent;
        	if (opt.extent) {
        		extentC = iD.geo.Extent(opt.extent).center();
        	} else if (opt.locs) {
        		_extent = getBoundsByLocs(opt.locs);
        		extentC = iD.geo.Extent(_extent).center();
        	} else return;
        	ov.center(extentC);
        	ov.init(opt, _extent);
        	var style = opt.style || {width: 400, height: 350}, delt = 7, 
        		dw = style.width - delt, dh = style.height - delt;
            overview = content.append('div')
            	.attr('class', 'map-overview')
            	.attr('style', function () {
	        		var whstr = '';
	        		if (style.width) whstr += ';width: ' + style.width + 'px;';
	        		if (style.height) whstr += ';height: ' + style.height + 'px;';
	        		return whstr;
	        	});
            var overviewmain = overview.append('div')
        		.attr('class', 'map-overview-main')
        		.attr('style', function () {
	        		var whstr = '';
	        		if (style.width) whstr += ';width: ' + dw + 'px;';
	        		if (style.height) whstr += ';height: ' + dh + 'px;';
	        		return whstr;
	        	})
        		.call(ov);
            
            var overviewnode = overview.node(),
            	overviewmainnode = overviewmain.node(),
            	w = parseInt(iD.util.getStyleValue(overviewnode, 'width')),
            	h = parseInt(iD.util.getStyleValue(overviewnode, 'height'));
            
            var __extent = opt.extent ? opt.extent : _extent,
            	extentMinXY = context.overview_projection([__extent[0][0], __extent[1][1]]),
        		extentMaxXY = context.overview_projection([__extent[1][0], __extent[0][1]]),
        		extentW = extentMaxXY[0] - extentMinXY[0]; extentH = extentMaxXY[1] - extentMinXY[1];
            //移动矩形
            var x = 0, y = 0, dx = 0, dy = 0, l = 0, t = 0, nl = 0, nt = 0, draging = false;
            var vmW = extentW / 4, vmH = extentH / 6, locate_wh = 6;
            function setNodeLT (node, l, t) {
            	node.style.left = (l + vmW / 2 - locate_wh) + 'px';
            	node.style.top = (t + vmH / 2 - locate_wh) + 'px';
            }
            function locMvLTByMCenter () {
            	var x = extentMinXY[0] - vmW / 2, y = extentMinXY[1] - vmH / 2;
            	var cter = context.map().center();
            	var cpixel = context.overview_projection(cter);
            	var lt = [cpixel[0] - vmW / 2, cpixel[1] - vmH / 2],
            		rb = [cpixel[0] + vmW / 2, cpixel[1] + vmH / 2];
            	
            	if (cpixel[0] > extentMinXY[0] && cpixel[0] < extentMaxXY[0]) x = lt[0];
            	if (cpixel[1] > extentMinXY[1] && cpixel[1] < extentMaxXY[1]) y = lt[1];
            	if (cpixel[0] > extentMaxXY[0]) x = extentMaxXY[0] - vmW/2;
            	if (cpixel[1] > extentMaxXY[1]) y = extentMaxXY[1] - vmH/2;
            	return [x, y];
            }
            var x_y = locMvLTByMCenter();
            var viewMv = overviewmain.append('div')
            	.attr('class', 'overview-viewMv')
            	.attr('style', function () {
	        		var str = '';
	        		if (style.width) str += ';left: ' + x_y[0] + 'px;';
	        		if (style.height) str += ';top: ' + x_y[1] + 'px;';
	        		if (style.width) str += ';width: ' + vmW + 'px;';
	        		if (style.height) str += ';height: ' + vmH + 'px;';
	        		return str;
	        	})
            	.on('mousedown', function () {
            		d3.event.stopPropagation();
            		x = d3.event.x || d3.event.clientX; y = d3.event.y || d3.event.clientY;
            		l = parseInt(iD.util.getStyleValue(this, 'left'));
            		t = parseInt(iD.util.getStyleValue(this, 'top'));
            		draging = true;
            	})
            	.on('mousemove.drag', function () {
            		if (!draging) return;
            		dx = (d3.event.x || d3.event.clientX) - x; dy = (d3.event.y || d3.event.clientY) - y;
    				nl = l + dx; nt = t + dy;
    				this.style.left = nl + 'px';
    				this.style.top = nt + 'px';
    				
    				setNodeLT(locatenode, nl, nt);
            	})
            	.on('mouseup', function () {
            		if (!draging) return;
            		dx = (d3.event.x || d3.event.clientX) - x; dy = (d3.event.y || d3.event.clientY) - y,
    				nl = l + dx; nt = t + dy;
    				
    				if (nl + vmW / 2 < extentMinXY[0]) nl = extentMinXY[0] - vmW / 2;
    				if (nt + vmH / 2 < extentMinXY[1]) nt = extentMinXY[1] - vmH / 2;
    				if ((nl + vmW / 2) > extentMaxXY[0]) nl = extentMaxXY[0] - vmW / 2;
                	if ((nt + vmH / 2) > extentMaxXY[1]) nt = extentMaxXY[1] - vmH / 2;
                	
    				this.style.left = nl + 'px';
    				this.style.top = nt + 'px';
    				
    				setNodeLT(locatenode, nl, nt);
    				
            		draging = false;
            		
            		var loc = context.overview_projection.invert([nl + vmW / 2, nt + vmH / 2]);
            		context.map().center(loc);
            	});
            
            var viewMvnode = viewMv.node();
            context.event.on('moveoverview',function () {
            	var xy = locMvLTByMCenter();
            	
            	viewMvnode.style.left = xy[0] + 'px';
            	viewMvnode.style.top = xy[1] + 'px';
            	
				setNodeLT(locatenode, xy[0], xy[1]);
            });
            
            var locate = overviewmain.append('div')
    			.attr('class', 'overview-locate')
    			.attr('style', function () {
	        		var ltstr = '';
	        		if (style.width) ltstr += ';left: ' + (x_y[0] + vmW / 2 - locate_wh) + 'px;';
	        		if (style.height) ltstr += ';top: ' + (x_y[1] + vmH / 2 - locate_wh) + 'px;';
	        		return ltstr;
	        	});
            var locatenode = locate.node();
            
            var btn = overview.append('div')
				.attr('class', 'map-overview-btn')
				.on('click', function () {
					if (isClose) {
						_open();
						isClose = false;
					} else {
						_close();
						isClose = true;
					}
				});
            function _open () {
            	var _w = style.width ? style.width : w, _h = style.height ? style.height : h;
				overviewnode.style.width = _w + 'px';
				overviewnode.style.height = _h + 'px';
				overviewmainnode.style.width = (_w - delt) + 'px';
				overviewmainnode.style.height = (_h - delt) + 'px';
				btn.attr('class', 'map-overview-btn');
            }
            function _close () {
            	overviewnode.style.width = '14px';
				overviewnode.style.height = '14px';
				overviewmainnode.style.width = '14px';
				overviewmainnode.style.height = '14px';
				btn.attr('class', 'map-overview-btn-close');
            }
            function _open_close () {
            	if (isClose) _close();
				else _open();
            }
            _open_close();
            
        });
        context.event.on('closeoverview', function () {
        	if (overview) overview.remove(); overview = null;
        });
        
        //信息窗口
        var infowindow, infowindow_position, infowindow_size;
        context.infowindow_isBand = true;//触发先执行, 加此标识做延时判断, 有待完善
        function getLt (position, infowindow_size) {
        	var lt = context.projection(position), 
	    		offset_center_x = -10 + 30 / 2 - infowindow_size[0] / 2 - 2,
	    		offset_center_y = -10 * 2 - 23 - infowindow_size[1] - 4;
	    	lt[0] = lt[0] + offset_center_x;
	    	lt[1] = lt[1] + offset_center_y;
	    	return lt;
    	}
        context.event.on('openinfowindow', function () {
        	if (infowindow) infowindow.remove(); infowindow = null;
        	infowindow_position = arguments[0][1];
        	infowindow_size = arguments[0][0].size || [300, 100];
        	var lt = getLt(infowindow_position, infowindow_size);
        	infowindow = m.append('div')
				.attr('class', 'KDSEditor-info')
				.attr('style', ';left: ' + lt[0] + 'px;top: ' + lt[1] + 'px;')
				.call(ui.infowindow, arguments);
        });
        context.event.on('closeinfowindow', function () {
        	if (infowindow) infowindow.remove(); infowindow = null;
        	infowindow_position = null; infowindow_size = null;
        });
        context.event.on('moveinfowindow', function () {
        	if (infowindow && infowindow_position) {
        		var lt = getLt(infowindow_position, infowindow_size);
        		infowindow.attr('style', ';left: ' + lt[0] + 'px;top: ' + lt[1] + 'px;');
        	}
        });
        context.event.on('changeinfowindow', function (opt) {
        	if (infowindow) {
        		ui.infowindow.updateContent(opt).updateSize(opt);
        		infowindow_size = opt.size || infowindow_size;
        		var lt = getLt(infowindow_position, opt.size);
        		infowindow.attr('style', ';left: ' + lt[0] + 'px;top: ' + lt[1] + 'px;');
        	}
        });
        var footer = content.append('div')
            .attr('id', 'KDSEditor-footer')
            .attr('class', 'KDSEditor-fillD')
			.attr('style', 'display:' + isNoneFooter);

        footer.append('div')
            .attr('id', 'scale-block')
            .call(iD.ui.Scale(context));

        //window.onbeforeunload = function() {
        //    return context.save();
        //};

        window.onunload = function() {
            context.history().unlock();
        };

        d3.select(window).on('resize.editor', function() {
            map.dimensions(m.dimensions());
        });

      

        function pan(d) {
            return function() {
                context.pan(d);
            };
        }

        // pan amount
        var pa = 5;

        var keybinding = d3.keybinding('main')
            .on('⌫', function() { d3.event.preventDefault(); })
            .on('←', pan([pa, 0]))
            .on('↑', pan([0, pa]))
            .on('→', pan([-pa, 0]))
            .on('↓', pan([0, -pa]));

        d3.select(document)
            .call(keybinding);

        context.enter(iD.modes.Browse(context));
 
        // var authenticating = iD.ui.Loading(context)
        //     .message(t('loading_auth'));

        // context.connection()
        //     .on('authenticating.ui', function() {
        //         context.container()
        //             .call(authenticating);
        //     })
        //     .on('authenticated.ui', function() {
        //         authenticating.close();
        //     });
    }

    function ui(container) {
        context.container(container);
        context.loadLocale(function() {
            render(container);
        });
    }
    ui.updateLayer = function(layer){
        ui.layermanager.update && ui.layermanager.update(layer); 
    }
    ui.sidebar = iD.ui.Sidebar(context);
    ui.layermanager = iD.ui.LayerManager(context);
    //ui.panorama = iD.ui.Panorama(context);
    ui.infowindow = iD.ui.Infowindow(context);


    return ui;
};

iD.ui.tooltipHtml = function(text, key) {
    return '<span>' + text + '</span>' + '<div class="keyhint-wrap">' + '<span> ' + (t('tooltip_keyhint')) + ' </span>' + '<span class="keyhint"> ' + key + '</span></div>';
};

iD.ui.toolbar = {};