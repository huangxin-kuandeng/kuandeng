iD.Overview = function(context) {
    var dimensions = [1, 1],
        dispatch = d3.dispatch('move', 'drawn'),
        projection = context.overview_projection,
        roundedProjection = iD.svg.RoundProjection(projection),
        minzoom = 0,
        max_zoom = 256 * Math.pow(2, 20), // 缺省最大缩放级别
        min_zoom = 256 * Math.pow(2, 1), // 缺省最小缩放级别
        zoom = d3.behavior.zoom()
            .translate(projection.translate())
            .scale(projection.scale() * 2 * Math.PI)
            .on('zoom', zoomPan),
        dblclickEnabled = true,
        transformStart,
        transformed = false,
        supersurface, surface,
        mouse,
        mousemove,
        editLevel = 13;
    
    var background;
    var locs = [], _extent = [], style = {}, size, __opt;
    var isDraw = false;
    
    function map(selection) {
    	zoom.scaleExtent([map.min_zoom(), map.max_zoom()]);
    	
        selection.call(zoom);

        supersurface = selection.append('div')
            .attr('id', 'overview-supersurface');

        supersurface.call(background);

        var dataLayer = supersurface.append('div')
            .attr('class', 'overview-layer-layer overview-layer-data')
            .attr('style', 'z-Index: 300');

        surface = map.surface = dataLayer.append('svg')
            .on('mousedown.zoom', function() {
                if (d3.event.button === 2) {
                    d3.event.stopPropagation();
                }
            }, true)
            .on('mouseup.zoom', function() {
                if (resetTransform()) redraw();
            })
            .attr('id', 'overview-surface')
            .call(iD.svg.OverviewSurface(context));

        surface.on('mousemove.overview', function() {
            mousemove = d3.event;
        });
        
        
        /**
        var viewInnFrame = viewMv.append('div')
    		.attr('class', 'overview-innFrame');*/
        
        map.dimensions(selection.dimensions());
        map.extent(_extent);
    }

    function pxCenter() { return [dimensions[0] / 2, dimensions[1] / 2]; }

    function drawVector(data) {
    	var iUrl = context.imagePath('overview_point.png');
    	_.forEach(data, function (loc) {
    		var icon = new Icon({
        		'loc' : loc,  
                'url' : style ? (style.url ? style.url : iUrl) : iUrl,
                'width': size ? size[0] : 8,
                'height': size ? size[1] : 8
        	}); 
        	map.addOverlays(icon);
        });
    	if (__opt.bound) drawPolygon();
    }
    
    function drawPolygon() {
    	var min = _extent[0], max = _extent[1];
    	var p1 = new Point({loc: min}),
	    	p2 = new Point({loc: [min[0], max[1]]}),
	    	p3 = new Point({loc: max}),
	    	p4 = new Point({loc: [max[0], min[1]]});
		var nodes = [p1, p2, p3, p4, p1];
		
		function style (element, entity, classed){
           if(entity.type === 'polygon') {
        	   element.style({"stroke": "#333333", 'opacity': 1, 'stroke-width': 1, 'stroke-dasharray': '5, 5'});
           }
		}
		var polygon = new Polygon({nodes: nodes, onDraw: style});
		map.addOverlays(polygon);
    }

    function zoomPan() {
    	var dType = d3.event && d3.event.sourceEvent && d3.event.sourceEvent.type;
        if ((dType === 'dblclick' || dType === 'mousemove' || dType === 'wheel')) return;
        if (Math.log(d3.event.scale / Math.LN2 - 8) < minzoom + 1) return setZoom(16, true);

        projection
            .translate(d3.event.translate)
            .scale(d3.event.scale / (2 * Math.PI));
        
        var scale = d3.event.scale / transformStart[0],
            tX = Math.round((d3.event.translate[0] / scale - transformStart[1][0]) * scale),
            tY = Math.round((d3.event.translate[1] / scale - transformStart[1][1]) * scale);
        
        transformed = true;
        iD.util.setTransform(supersurface, tX, tY, scale);
        queueRedraw();

    }

    function resetTransform() {
        if (!transformed) return false;
        iD.util.setTransform(supersurface, 0, 0);
        transformed = false;
        return true;
    }

    function redraw(difference, extent) {

        if (!surface) return;

        clearTimeout(timeoutId);

        if (resetTransform()) {
            difference = extent = undefined;
        }

        var zoom = String(~~map.zoom());
        if (surface.attr('data-zoom') !== zoom) {
            surface.attr('data-zoom', zoom)
                .classed('low-zoom', zoom <= map.editableLevel());
        }

        if (!difference) {
            supersurface.call(background);
        }

        /**
        map.loadTiles(projection, dimensions, function (data) {
        	drawVector(data);
        });*/
        
        if (!isDraw) {
        	drawVector(locs);
        	isDraw = true;
        }
        
        drawOverlayers();
        
        transformStart = [
            projection.scale() * 2 * Math.PI,
            projection.translate().slice()];

        return map;
    }

    var timeoutId;
    function queueRedraw() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() { redraw(); }, 300);
    }

    function pointLocation(p) {
        var translate = projection.translate(),
            scale = projection.scale() * 2 * Math.PI;
        return [(p[0] - translate[0]) / scale, (p[1] - translate[1]) / scale];
    }

    function locationPoint(l) {
        var translate = projection.translate(),
            scale = projection.scale() * 2 * Math.PI;
        return [l[0] * scale + translate[0], l[1] * scale + translate[1]];
    }

    map.mouse = function() {
        var e = mousemove || d3.event, s;
        while ((s = e.sourceEvent)) e = s;
        return mouse(e);
    };

    map.mouseCoordinates = function() {
        return projection.invert(map.mouse());
    };

    map.dblclickEnable = function(_) {
        if (!arguments.length) return dblclickEnabled;
        dblclickEnabled = _;
        return map;
    };

    function setZoom(_, force) {
        if (_ === map.zoom() && !force)
            return false;
        var scale = 256 * Math.pow(2, _),
            center = pxCenter(),
            l = pointLocation(center);
        scale = Math.max(map.min_zoom(), Math.min(map.max_zoom(), scale));
        projection.scale(scale / (2 * Math.PI));
        zoom.scale(scale);
        var t = projection.translate();
        l = locationPoint(l);
        t[0] += center[0] - l[0];
        t[1] += center[1] - l[1];
        projection.translate(t);
        zoom.translate(projection.translate());
        return true;
    }

    function setCenter(_) {
        var c = map.center();
        if (_[0] === c[0] && _[1] === c[1])
            return false;
        var t = projection.translate(),
            pxC = pxCenter(),
            ll = projection(_);
        projection.translate([
            t[0] - ll[0] + pxC[0],
            t[1] - ll[1] + pxC[1]]);
        zoom.translate(projection.translate());
        return true;
    }

    map.pan = function(d) {
        var t = projection.translate();
        t[0] += d[0];
        t[1] += d[1];
        projection.translate(t);
        zoom.translate(projection.translate());
        dispatch.move(map);
        return redraw();
    };

    map.dimensions = function(_) {
        if (!arguments.length) return dimensions;
        var center = map.center();
        dimensions = _;
        surface.dimensions(dimensions);
        background.dimensions(dimensions);
        projection.clipExtent([[0, 0], dimensions]);
        mouse = iD.util.fastMouse(supersurface.node());
        setCenter(center);
        return redraw();
    };
    
    map.zoomIn = function() { return map.zoom(Math.ceil(map.zoom() + 1)); };
    map.zoomOut = function() { return map.zoom(Math.floor(map.zoom() - 1)); };

    map.center = function(loc) {
        if (!arguments.length) {
            return projection.invert(pxCenter());
        }

        if (setCenter(loc)) {
            dispatch.move(map);
        }

        return redraw();
    };

    map.zoom = function(z) {
        if (!arguments.length) {
            var zoom = Math.max(Math.log(projection.scale() * 2 * Math.PI) / Math.LN2 - 8, 0);
            return parseInt(zoom,10);
        }

        if (setZoom(z)) {
            dispatch.move(map);
        }

        return redraw();
    };

    map.zoomTo = function(entity, zoomLimits) {
        var extent = entity.extent(context.graph()),
            zoom = map.extentZoom(extent);
        zoomLimits = zoomLimits || [16, 20];
        map.centerZoom(extent.center(), Math.min(Math.max(zoom, zoomLimits[0]), zoomLimits[1]));
    };

    map.centerZoom = function(loc, z) {
        var centered = setCenter(loc),
            zoomed   = setZoom(z);

        if (centered || zoomed) {
            dispatch.move(map);
        }

        return redraw();
    };

    map.centerEase = function(loc) {
        var from = map.center().slice(),
            t = 0,
            stop;

        surface.one('mousedown.ease', function() {
            stop = true;
        });

        d3.timer(function() {
            if (stop) return true;
            map.center(iD.geo.interp(from, loc, (t += 1) / 10));
            return t === 10;
        }, 20);
        return map;
    };

    map.extent = function(_) {
        if (!arguments.length) {
            return new iD.geo.Extent(projection.invert([0, dimensions[1]]),
                                 projection.invert([dimensions[0], 0]));
        } else {
            var extent = iD.geo.Extent(_);
            map.centerZoom(extent.center(), map.extentZoom(extent));
        }
    };

    map.trimmedExtent = function() {
        var headerY = 60, footerY = 30, pad = 10;
        return new iD.geo.Extent(projection.invert([pad, dimensions[1] - footerY - pad]),
                projection.invert([dimensions[0] - pad, headerY + pad]));
    };

    map.extentZoom = function(_) {
        var extent = iD.geo.Extent(_),
            tl = projection([extent[0][0], extent[1][1]]),
            br = projection([extent[1][0], extent[0][1]]);

        // Calculate maximum zoom that fits extent
        var hFactor = (br[0] - tl[0]) / dimensions[0],
            vFactor = (br[1] - tl[1]) / dimensions[1],
            hZoomDiff = Math.log(Math.abs(hFactor)) / Math.LN2,
            vZoomDiff = Math.log(Math.abs(vFactor)) / Math.LN2,
            newZoom = map.zoom() - Math.max(hZoomDiff, vZoomDiff);
        
        return newZoom;
    };

    map.editableLevel = function(_){
    	if (!arguments.length) return editLevel;
    	editLevel = _;
        return map;
    }
   
    map.minzoom = function(_) {
        if (!arguments.length) return minzoom;
        minzoom = _;
        return map;
    };
    
    map.max_zoom = function(_) {
    	if (!arguments.length) return max_zoom;
    	max_zoom = 256 * Math.pow(2, _);
    	return map;
    };
    map.min_zoom = function(_) {
    	if (!arguments.length) return min_zoom;
    	min_zoom = 256 * Math.pow(2, _);
    	return map;
    };
    
    //初始化数据
    map.init = function (opt, extent) {
    	__opt = opt;
    	locs = opt.locs;
    	_extent = opt.extent ? opt.extent : getBoundsByLocs(locs);
    	style = opt.style;
    	size = style ? style.size : null;
		background = iD.OverviewBackground(context, projection, opt.tilelayer);
		isDraw = false;
    }
    
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
    
    //加载数据
    function abortRequest(i) { i.abort(); }
    function bboxUrl(tile, layer) {
        var dataUrl = layer.url + "?sid="+layer.bboxSId+"&bbox=" + tile.extent.toParam() + '&filter=' + layer.filter +"&layerid=" + layer.id;
        return dataUrl;
    }
    var loadedTiles = {}, inflight = {};
    map.loadTiles = function(projection, dimensions, callback) {

        var s = projection.scale() * 2 * Math.PI,
            z = Math.max(Math.log(s) / Math.log(2) - 8, 0);
        if (z <= 15) tileZoom = z;
        var ts = 256 * Math.pow(2, z - tileZoom),
            origin = [
                s / 2 - projection.translate()[0],
                s / 2 - projection.translate()[1]];

        var tiles = d3.geo.tile()
            .scaleExtent([tileZoom, tileZoom])
            .scale(s)
            .size(dimensions)
            .translate(projection.translate())()
            .map(function(tile) {
                var x = tile[0] * ts - origin[0],
                    y = tile[1] * ts - origin[1];

                return {
                    id: tile.toString(),
                    extent: iD.geo.Extent(
                        projection.invert([x, y + ts]),
                        projection.invert([x + ts, y]))
                };
            });

        _.filter(inflight, function(v, i) {
            var wanted = _.find(tiles, function(tile) {
                return i === tile.id;
            });
            if (!wanted) delete inflight[i];
            return !wanted;
        }).map(abortRequest);

        tiles.forEach(function(tile) {
            var id = tile.id;

            if (loadedTiles[id] || inflight[id]) return;

            var layers = iD.Layers.getLayers();
            layers.forEach(function(layer){
                inflight[id] = context.connection().loadFromURL(bboxUrl(tile, layer), function(err, parsed, lay) {
                    loadedTiles[id] = true;
                    delete inflight[id];
                    
                    callback(parsed);
    
                }, layer);
            });
            
        });
    };

    map.addOverlays = function(overlay,type){
        if(overlay instanceof iD.Icon)  
           overlayers.icon.push(overlay); 
        else if(overlay instanceof iD.Polygon)
            overlayers.polygon.push(overlay);
    }
    
    map.getOverlays = function(overlaysid) {
        if(!overlaysid) return overlayers;
        if(overlaysid && (typeof overlaysid === 'string')){
            overlaysid = [overlaysid];
        }
        var array = [];
        overlayers.icon.forEach(function(overlay) {
            overlaysid.forEach(function(id) {
                if( overlay.id == id || overlay == id)  array.push(overlay);
            });
        });
        overlayers.polygon.forEach(function(overlay) {
            overlaysid.forEach(function(id) {
                if( overlay.id == id || overlay == id)  array.push(overlay);
            });
        });
        return array;
    }
    
    map.removeOverlays = function(overlay){
        var o = overlayers;
        if(overlay instanceof iD.Icon)
          o.icon = iD.util.arrayRemove(overlay,o.icon);
        else if(overlay instanceof iD.Polygon)
            o.polygon = iD.util.arrayRemove(overlay,o.polygon);
    }
    
    map.cleanOverlays = function () {
    	var overlayers = this.getOverlays();
    	for (var type in overlayers) {
    		var os = overlayers[type];
    		for (var i in os) this.removeOverlays(os[i]);
    	}
    	drawOverlayers();
    	isDraw = false;
    }
    
    var markerIcon = iD.svg.OverviewMarkerIcon(roundedProjection, context) ,
    	polygon = iD.svg.Polygon(projection, context, 'overview') ,
        overlayers =  { marker : [], polyline : [], polygon : [] , circle : [], icon : []};

    function drawOverlayers(){
        surface && surface.call(markerIcon, overlayers.icon, d3.functor(true));       
        surface && surface.call(polygon, context.graph(), overlayers.polygon, d3.functor(true));
    }

    return d3.rebind(map, dispatch, 'on');
};

//用于对外公开
iD.OverView = function iD_OverView(map, opt) {
    if (!(this instanceof iD_OverView)) {
        return (new iD_OverView()).initialize(map, opt);
    } else if (arguments.length) {
        this.initialize(map, opt);
    }
    this.graphType =  "overview";
};

_.extend(iD.OverView.prototype, {
	
    type: 'overview',
    
    initialize: function (map, opt) {
		this.map = map;
		this.opt = opt;
	},
    
    open: function () {
		if (!this.map) return;
		var context = this.map.getContext(), that = this;
		var	tt = setInterval(function () {
				if (context.overview_isBand) {
					clearInterval(tt);
					context.event.openoverview(that.opt);
				}
			}, 50);
	},
    
	flush: function (opt) {
		if (!this.map) return;
		this.opt = opt;
		var context = this.map.getContext();
		var overview = context.overview();
		overview.cleanOverlays();
		overview.init(opt);
		context.event.openoverview(opt);
	},
	
    close: function () {
		if (!this.map) return;
		this.map.getContext().event.closeoverview();
	}
    
});
