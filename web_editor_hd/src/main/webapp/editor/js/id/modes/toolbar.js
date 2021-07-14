
iD.modes.toolbar = {};
iD.behavior.toolbar = {};

/**
提供接口，可切换鼠标模式：
   鼠标画点、 iD.modes.toolbar.Marker
   鼠标画矩形（拉框）、iD.modes.toolbar.Rang
   鼠标画多边形、 iD.modes.toolbar.Polygon
   鼠标画圆、 iD.modes.toolbar.Circle
   鼠标画线， iD.modes.toolbar.Polyline
   鼠标测距、 iD.modes.toolbar.Distance
   拉框放大， iD.modes.toolbar.Zoom
   拉框放大， iD.modes.toolbar.Zoom
   鼠标测面， iD.modes.toolbar.MeasureArea
 并提供绘制前、绘制过程中、绘制结束事件，绘制结束事件需返回绘制的覆盖物对象，具体参考JS地图API
**/

/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.Polygon
 * 鼠标工具多边形框选(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Polygon = function(context) {
    var mode = {
            id: 'toolbar-polygon',
            button: 'toolbar-polygon',
            title: '多边形框选',//t('modes.mouse_range.title'),
            description: '多边形框选',//t('modes.mouse_range.description'),
            key: '',
            enable: true
    };
    
    var t = arguments[1] ;
    var f = arguments[2] ;

    var behavior = iD.behavior.toolbar.Polygon(context,mode.id,t,f);
    
    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};



// behavior Class

iD.behavior.toolbar.Polygon = function(context,modeid) {
     var type = arguments[2];
     var filter = arguments[3] || iD.util.empty;
     var behaviorEvent = d3.dispatch('finish');
     var behavior = function(selection) {
        var mouse = null,
            draw = false,
            mode = 'polygon',
            style = {"fill": "red",'opacity':'0.5',"stroke": 'rgb(255, 99, 25)',"stroke-width" : 3},
            time = 0,
            pos = null,
            closeTolerance = 4,
            tolerance = 12;

        function mousedown() {

            mouse = context.mouse();
            behavior.polygon = null;

            selection
                .on('mousemove.polygon', mousemove)
                .on('mouseup.polygon', mouseup)
                .on('mousedown.polygon',mouseup)
                .on('click.polygon',click)
                .on('dblclick.polygon',dblclick);

            d3.event.stopPropagation();
            d3.event.preventDefault();

            var element = d3.select(this),
            touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null,
            time = +new Date(),
            pos = context.map().mouse();

            element.on('mousemove.polygon', null);

            d3.select(window).on('mouseup.polygon', function() {
                element.on('mousemove.polygon', mousemove);

                    // Prevent a quick second click
                    d3.select(window).on('click.draw-block', function() {
                        d3.event.stopPropagation();
                    }, true);

                    context.map().dblclickEnable(false);

                    window.setTimeout(function() {
                        context.map().dblclickEnable(true);
                        d3.select(window).on('click.draw-block', null);
                    }, 500);

                    click();
            });
            draw = true;
        }

        function event(){
            var bounds = behavior.polygon.bounds();
            var extent = iD.geo.Extent(bounds);

            behavior.polygon.convertArea();   

            filterNodes(behavior.polygon.nodes);

            // var els = context.layers().getCurrentEnableLayer();
            var els = context.layers().getLayer();
            var selected = context.intersects(extent).filter(function (entity) {
                if(!els || (els && els.id !== entity.layerId)){ return false; }
                if(!els.isPoint() && entity instanceof iD.Node){return false;}
                if(entity instanceof iD.Way){
                   return filter(entity) && true;
                }
                if(entity instanceof iD.Node)
                    return filter(entity) && iD.util.isPointInPolygon(entity,behavior.polygon);
                return false;
            });

            // 选择点与面
            if(selected.length && (selected[0] instanceof iD.Node || els.type == "area") && !type){
                selected.length != 0 && context.enter(iD.modes.Select(context, _.pluck(selected, 'id')));
                context.event.polygonend({bounds : bounds, coordinates :  behavior.polygon.nodes, selected : selected});
                return ;
            }
            
            
            if (selected.length && selected[0] instanceof iD.Way && els.type != "area"  && !type) {
                var extend = iD.util.lassExtend;
                var wrap = [];// 存储在区域内的线
                // 循环所有选择的线，校验其是否与四条边线相交
                for(var i = 0; i < selected.length ; i++){
                    var way = selected[i];
                    var nodes = way.nodes;
                    // 判断当前图层是否可编辑
                    if(!els || (els && els.id !== way.layerId)){continue; }

                    if(way.type === 'node'){
                        var nflag = extend.isPointInRect( { lon : way.loc[0], lat : way.loc[1] } ,extent);
                        if(nflag){
                            wrap.push(way);
                        };
                        continue;
                    }
                    // 循环一条上所有的点
                    for(var j = 0; j < nodes.length; j++){
                        if( ( j + 1 ) >= nodes.length ) break;// 超出范围跳出
                        // 当前点
                        var nodeId = nodes[j];
                        var node = context.graph().entity(nodeId);
                        var loc = node.loc;

                        // 下一个点,两个点组成一个线段
                        var nextId = nodes[j+1];
                        var nextNode = context.graph().entity(nextId);
                        var nextLoc = nextNode.loc;

                        // 当前线段 起点与结束点经纬度数组
                        var newline = [loc[0],loc[1],nextLoc[0],nextLoc[1]];
                        var intersects = extend.isLineInRect(extent, newline);
                        
                        // 线在矩形区域内 || 与矩形边相交
                        if(intersects ){
                        //if(intersects && (intersects != 3)){
                            wrap.push(way);
                            break; // 确定线在区域内，则无须继续比较
                        }
                    }
                }

                //将符合条件 的线选中
                wrap.length && context.enter(iD.modes.Select(context, _.pluck(wrap, 'id')));
                selected = wrap;
            }
            
            if (type) {
            	filterNodes(behavior.polygon.nodes);
                if (behavior.polygon.nodes.length < 3) {
                	context.map().removeOverlays(behavior.polygon);
                	context.event.drawoverlayers();
                	context.enter(iD.modes.Browse(context));
                	return;
                }
                behavior.polygon.nodes[behavior.polygon.nodes.length - 1] = behavior.polygon.nodes[0];
                context.replace(iD.actions.Noop());
            }
            
            context.event.draw({overlay : behavior.polygon, mode : mode});

            !type && context.event.polygonend({bounds : bounds, coordinates :  behavior.polygon.nodes, selected : selected});

            if(!selected.length || type)
                context.enter(iD.modes.Browse(context));
        }
        
        function filterNodes (nodes) {
        	if (nodes.length === 3) {
        		if (iD.geo.edgeEqual(nodes[1].loc, nodes[2].loc)) nodes.splice(2, 1);
        	} else {
        		for (var i = 0;i < nodes.length - 2;i++) {
            		if (iD.geo.edgeEqual(nodes[i].loc, nodes[i + 1].loc)) {
            			nodes.splice(i + 1, 1);
            			filterNodes(nodes);
            			break;
            		}
            	}
        	}
        }

        function dblclick(){
            behavior.polygon && behavior.polygon.moveNode(new Point({ loc : context.map().mouseCoordinates() }) );
            behavior.polygon && behaviorEvent.finish(behavior.polygon);
            event();

        }

        function mousemove() {
            if (!behavior.polygon) {
                var  nodes = [], loc = context.map().mouseCoordinates();
                     nodes.push(new Point({ loc : loc }));
                     nodes.push(new Point({ loc : loc }));
                     nodes.push(new Point({ loc : loc }));

                
                behavior.polygon = new Polygon({ nodes : nodes ,
                	mode: 'polygon',
                    onDraw : function (element){
                       element.style(style);
                    }});

                context.map().addOverlays(behavior.polygon);

                context.event.drawstart({overlay : behavior.polygon, mode : mode});
            }

            if(!draw)
            {
                behavior.polygon.moveNode(new Point({ loc :  context.map().mouseCoordinates()}));
                context.event.drawoverlayers();
                context.event.drawing({overlay : behavior.polygon, mode : mode});
            }
        }
        
        var t = 0;
        function click(){ 
          
            if(d3.event.target.__data__ &&  d3.event.target.__data__.button && d3.event.target.__data__.enter )  
            {
                d3.event.preventDefault();
                if(d3.event.target.__data__.id == modeid)
                  context.enter(iD.modes.Browse(context));  
                else{
                  context.enter( d3.event.target.__data__);
                }    
            }else if(d3.event.target.__data__ || d3.event.target.id === "surface"){ 
                if(new Date().getTime() - t < 200){
                        return;
                }
                if (iD.geo.euclideanDistance(pos || context.map().mouse(), context.map().mouse()) < closeTolerance ||
                    (iD.geo.euclideanDistance(pos || context.map().mouse(), context.map().mouse()) < tolerance &&
                    (+new Date() - time) < 500)) {
                    behavior.polygon && behavior.polygon.addNode(new Point({ loc : context.map().mouseCoordinates() }));
                    t = new Date().getTime();
                    context.event.drawing({overlay : behavior.polygon, mode : mode});
                }  else {
                    return;
                }
            }else{
                if(d3.event.target && d3.event.target.id != "surface" && d3.event.target.onclick){
                    context.event.draw({overlay : behavior.polygon, mode : mode});
                    context.enter(iD.modes.Browse(context));  
                    d3.event.target.onclick(); //这样是否可行？
                }
                
            }  
        }

         function mouseup() {
             time = +new Date();
             if(draw) {
                 draw = false;
             }
             else  {
                 draw = true;
                 pos = context.map().mouse();
             }
         }

        function backspace() {
            d3.event.preventDefault();
        }

        function del() {
            d3.event.preventDefault();
        }

        function ret() {
            d3.event.preventDefault();
            context.event.draw({overlay : behavior.polygon, mode : mode});
            context.enter(iD.modes.Browse(context));
        }
        
        // bind key event
        keybinding
            .on('⌫', backspace)
            .on('⌦', del)
            .on('⎋', ret)
            .on('↩', ret); 

        selection.on('mousedown.polygon', mousedown);

        d3.select(document)
            .call(keybinding);
    };
    var keybinding = d3.keybinding('draw');
    behavior.off = function(selection) {

        selection.on('mousedown.polygon', null);
        selection.on('mousemove.polygon', null);
        selection.on('mouseup.polygon', null);
        selection.on('click.polygon', null);
        selection.on('dblclick.polygon', null);
        d3.select(window).on('mouseup.polygon', null);

        if(!type)
            setTimeout(function(){
                context.map().removeOverlays(behavior.polygon);
                context.event.drawoverlayers();
            },500);

        d3.select(document)
            .call(keybinding.off);

    };
    return d3.rebind(behavior, behaviorEvent, 'on');
    //return behavior;
};





/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.MeasureArea
 * 鼠标工具测面(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.MeasureArea = function(context) {
    var mode = {
        id: 'toolbar-measureArea',
        button: 'toolbar-measureArea',
        title: '测面',//t('modes.mouse_range.title'),
        description: '测面',//t('modes.mouse_range.description'),
        key: '',
        enable: true
    };


    var behavior = iD.behavior.toolbar.Polygon(context,mode.id,true);
    behavior.on("finish",drawFinish);

    function drawFinish(e){
        e.distance = e.getArea();
        e.mode = "measurearea";
    }

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};






/**
 +------------------------------------------------------------------------------
 * 类: iD.modes.Distance
 * 鼠标工具拉测距(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Distance = function(context) {

    var mode = {
        id: 'toolbar-distance',
        button: 'distance',
        title:t('modes.toolbar_distance.title'),
        description: t('modes.toolbar_distance.description'),
        key: 'Ctrl+Y',
        enable: true
    };
    var behavior = iD.behavior.toolbar.Distance(context,mode.id);


    mode.enter = function() {
        context.install(behavior);

    };

    mode.exit = function() {
        if(!behavior.flag){
            context.map().removeOverlays(behavior.tmpPolyline);
            context.event.drawoverlayers();

        }

        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };



    return mode;
};






// behavior Class Distance

iD.behavior.toolbar.Distance = function(context,modeid) {

     var behavior = function(selection) {
        var mouse = null,
            draw = false,
            polyline,
            mode = 'distance',
            style = {"stroke": 'rgb(255, 99, 25)','opacity':'0.5',"stroke-width" : 3};

        function mousedown() {

            mouse = context.mouse();
            polyline = null;

            selection
                .on('mousemove.distance', mousemove)
                .on('mouseup.distance', mouseup)
                .on('mousedown.distance',mousedownup)
                .on('click.distance',click)
                .on('dblclick.distance',dblclick);

            d3.event.stopPropagation();
            d3.event.preventDefault();

            var element = d3.select(this),
            touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null,
            time = +new Date();

            element.on('mousemove.distance', null);

            d3.select(window).on('mouseup.distance', function() {

                element.on('mousemove.distance', mousemove);

                    // Prevent a quick second click
                    d3.select(window).on('click.draw-block', function() {
                        d3.event.stopPropagation();
                    }, true);

                    context.map().dblclickEnable(false);

                    window.setTimeout(function() {
                        context.map().dblclickEnable(true);
                        d3.select(window).on('click.draw-block', null);
                    }, 500);

                    click();
            });
            draw = true;
        }


        function distance(){
           var distance = 0,
               nodes = polyline.nodes;
            //console.log(nodes);
           for(var i in nodes)
           {
              if (nodes[parseInt(i) + 1] )
              {
                    var loc1 = nodes[i].loc;
                    var loc2 = nodes[parseInt(i) + 1].loc;
                    distance += iD.geo.sphericalDistance(loc1, loc2);
              }
           }
           return distance.toFixed(2);
        }

         function partDistance(){
             var distance = 0,
                 nodes = polyline.nodes;
             //console.log(nodes);
             var length = nodes.length;

            if(nodes[length-2].loc){
                var loc1 = nodes[length-1].loc;
                var loc2 = nodes[length-2].loc;
                distance += iD.geo.sphericalDistance(loc1, loc2);
                //console.log(distance);
            }
             return distance.toFixed(2);
         }



        function dblclick(){
            behavior.flag = true;
            if(polyline)
            {
              polyline.moveNode(new Marker({ loc : context.map().mouseCoordinates() }) );
             polyline.distance = distance();
              //polyline.distance = [distance(),partDistance()];
              polyline.last().end = true;

                d3.select("#KDSEditor-footer")
                    .selectAll("#partDistanceInfo").remove();
                context.event.drawoverlayers();

              context.event.draw({overlay : polyline, mode : mode});
            }
            context.enter(iD.modes.Browse(context));
        }

        function mousemove() {
            if (!polyline) {
                var  nodes = [], loc = context.map().mouseCoordinates();
                     nodes.push(new Marker({ loc : loc }));
                     nodes.push(new Marker({ loc : loc }));
                     nodes.push(new Marker({ loc : loc }));
                
                polyline = new Polyline({ nodes : nodes ,
                	mode: 'distance',
                    onDraw : function (element){
                       element.style(style);
                    }});

                context.map().addOverlays(polyline);

                context.event.drawstart({overlay : polyline, mode : mode});
                // console.log(polyline);
            }

            if(!draw)
            {
                //polyline.moveNode(new Marker({ loc :  context.map().mouseCoordinates()}));
                polyline.moveLoc(context.map().mouseCoordinates());
               // polyline.distance =  distance();
                polyline.distance = distance();
                behavior.tmpPolyline = polyline;
               // polyline.partDistance = partDistance();
                var partDis  = [partDistance()];
               // console.log("部分数据长度"+partDis);
                var partinfo = d3.select("#KDSEditor-footer")
                    .selectAll("#partDistanceInfo")
                    .data(partDis);
                var enter = partinfo.enter();
                partinfo.text(function(d,i){ return "当前线长："+d+"米"});
                enter.append("div").attr("id","partDistanceInfo").classed("partDistanceInfo",true).style({"position":"absolute","right":"10%","bottom":"2px","font-size":"14px"})
                    .text(function(d,i){
                       //console.log("部分数据长度"+d);
                        return "当前线长："+d+"米"});
                partinfo.exit().remove();

                context.event.drawoverlayers();

                context.event.drawing({overlay : polyline, mode : mode});
                //console.log("polyline"+polyline);
            }

        }
        
        var t = 0;
        function click(){ 
            if(d3.event.target.__data__ &&   d3.event.target.__data__.button && d3.event.target.__data__.enter)  
            {
                d3.event.preventDefault();
                polyline && polyline.addNode(new Marker({ loc : context.map().mouseCoordinates() }));
                behavior.tmpPolyline = polyline;
                dblclick();
                if(d3.event.target.__data__.id == modeid)
                  context.enter(iD.modes.Browse(context));  
                else{
                  context.enter(iD.modes.Browse(context));  
                  context.enter(d3.event.target.__data__);
                }    
                  
            }else if(d3.event.target.__data__ || d3.event.target.id === "surface"){ 
                if(new Date().getTime() - t < 200){
                        return;
                } 
                if(same(point(),context.map().mouseCoordinates())) 
                  polyline && polyline.addNode(new Marker({ loc : context.map().mouseCoordinates() }));
                  behavior.tmpPolyline = polyline;
                t = new Date().getTime();
                context.event.drawing({overlay : polyline, mode : mode});
            }else{

                if(d3.event.target && d3.event.target.id != "surface" && d3.event.target.onclick){
                    context.event.draw({overlay : polyline, mode : mode});
                    context.enter(iD.modes.Browse(context));  
                    d3.event.target.onclick(); //这样是否可行？暂时这样
                }
            }      
        }



        var origin_point, origin_lnglat;

        function point() {
            var target = this;
            var touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null;
            var surface=context.surface().node();
            var p = target.parentNode || surface;
            // var p = surface || target.parentNode;
            return touchId !== null ? d3.touches(p).filter(function(p) {
                return p.identifier === touchId;
            })[0] : d3.mouse(p);
        }
        
        function same(point,lnglat){
            if(origin_point && lnglat 
              && origin_point[0] == point[0]
              &&  origin_point[1] == point[1]
              && origin_lnglat[0] == lnglat[0]
              &&  origin_lnglat[1] == lnglat[1])
                return true;
            else
                return false;
        }

        function mouseup() {
           if(draw) draw = false;
           else  draw = true;
        }

        function mousedownup(){
            origin_point = point();
            origin_lnglat = context.map().mouseCoordinates();
            if(draw) draw = false;
            else  draw = true;
        }
        
        function backspace() {
            d3.event.preventDefault();
        }

        function del() {
            d3.event.preventDefault();
        }

        function ret() {
            d3.event.preventDefault();
            click();
            dblclick();
        }
        
        // bind key event
        //keybinding
        //    .on('⌫', backspace)
        //    .on('⌦', del)
        //    .on('⎋', ret)
        //    .on('↩', ret);

        selection.on('mousedown.distance', mousedown);

        d3.select(document)
            .call(keybinding);

    };
    var keybinding = d3.keybinding('draw');

    behavior.flag = false;
    behavior.tmpPolyline;

    behavior.off = function(selection) {
        behavior.flag = false;
        behavior.tmpPolyline = null;
        selection.on('mousedown.distance', null);
        selection.on('mousemove.distance', null);
        selection.on('mouseup.distance', null);
        selection.on('click.distance', null);
        selection.on('dblclick.distance', null);
        d3.select(window).on('mouseup.distance', null);
        d3.select(document)
            .call(keybinding.off);

    };

    return behavior;
};




/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.toolbar.Marker
 * 鼠标工具多边形框选(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Marker = function(context) {
    var mode = {
            id: 'toolbar-marker',
            button: 'toolbar-marker',
            title: '绘制点',//t('modes.mouse_range.title'),
            description: '绘制点',//t('modes.mouse_range.description'),
            key: '',
            enable: true
    };

    var behavior = iD.behavior.toolbar.Marker(context,mode.id);

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};



// behavior Class Marker

iD.behavior.toolbar.Marker = function(context,modeid) {

     var behavior = function(selection) {
        
        var mouse = null,
            draw = false,
            marker,
            mode = 'marker',
            style = {"stroke": 'rgb(255, 99, 25)','opacity':'0.5',"stroke-width" : 3};

        function mousedown() {

            mouse = context.mouse();
            marker = null;

            selection
                .on('click.marker',click);

            d3.event.stopPropagation();
            d3.event.preventDefault();
        }

        function click(){ 
            marker = new Marker({ loc :  context.map().mouseCoordinates(), mode: 'marker'   } );
            context.map().addOverlays(marker);
            context.event.drawoverlayers();

            context.event.draw({overlay : marker, mode : mode});

            context.enter(iD.modes.Browse(context));  
        }

     
        function backspace() {
            d3.event.preventDefault();
        }

        function del() {
            d3.event.preventDefault();
        }

        function ret() {
            d3.event.preventDefault();
        }
        
        // bind key event
        keybinding
            .on('⌫', backspace)
            .on('⌦', del)
            .on('⎋', ret)
            .on('↩', ret); 

        selection.on('mousedown.marker', mousedown);

        d3.select(document)
            .call(keybinding);

    };
    var keybinding = d3.keybinding('draw');
    behavior.off = function(selection) {

        selection.on('mousedown.marker', null);
        selection.on('click.marker', null);
        d3.select(document)
            .call(keybinding.off);

    };

    return behavior;
};

/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.toolbar.Rectangle
 * 鼠标工具矩形(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Rectangle = function(context) {
    var mode = {
            id: 'toolbar-rectangle',
            button: 'toolbar-rectangle',
            title: '绘制矩形',//t('modes.mouse_range.title'),
            description: '绘制矩形',//t('modes.mouse_range.description'),
            key: '',
            enable: true
    };

    var behavior = iD.behavior.toolbar.Rectangle(context,mode.id);

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};


iD.behavior.toolbar.Rectangle = function(context,modeid) {

     var behavior = function(selection) {

        var mouse = null,
            draw = false,
            polygon,
            mode = 'rectangle',
            style = {"fill": "red",'opacity':'0.5',"stroke": 'rgb(255, 99, 25)',"stroke-width" : 3};
    

        function mousedown() {

            mouse = context.mouse();
            polygon = null;

            selection
                .on('mousemove.rectangle', mousemove)
                .on('mouseup.rectangle', mouseup)
                .on('mousedown.rectangle',mouseup);

            d3.event.stopPropagation();
            d3.event.preventDefault();

            
        }

        function mousemove() {
            var loc = context.map().mouseCoordinates();
            if (!polygon) {
                var  nodes = [];
                     nodes.push(new Point({ loc : loc }));

                polygon = new Polygon({ nodes : [nodes] ,
                	mode: 'rectangle',
                    onDraw : function (element){
                       element.style(style);
                    }});
                polygon.rectangle = { start : loc,end : loc};
                polygon.rectangle.start = loc;
                context.map().addOverlays(polygon);
                
                context.event.drawstart({overlay : polygon, mode : mode});
            }
            
            polygon.rectangle.end = loc; 

            var points = polygon.boundPoints();

            var nodes = [];
            nodes.push(new Point({ loc : points[0] }));
            nodes.push(new Point({ loc : points[1] }));
            nodes.push(new Point({ loc : points[2] }));
            nodes.push(new Point({ loc : points[3] }));
            nodes.push(new Point({ loc : points[0] }));

            polygon.nodes = nodes;

            context.event.drawoverlayers();

            context.event.drawing({overlay : polygon, mode : mode});
        }

        function normalize(a, b) {
            return [
                [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
                [Math.max(a[0], b[0]), Math.max(a[1], b[1])]];
        }

        function mouseup() {

            selection
                .on('mousemove.rectangle', null)
                .on('mouseup.rectangle', null);
            
            context.event.drawoverlayers();

            context.event.draw({overlay : polygon, mode : mode});

            // set map to browse mode
            context.enter(iD.modes.Browse(context));
        }

        selection
            .on('mousedown.rectangle', mousedown);
    };

    behavior.off = function(selection) {
        selection.on('mousedown.rectangle', null);
        selection.on('mousemove.rectangle', null);
        selection.on('mouseup.rectangle', null);

    };

    return behavior;
};


/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.toolbar.Circle
 * 鼠标工具矩形(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Circle = function(context) {
    var mode = {
            id: 'toolbar-circle',
            button: 'toolbar-circle',
            title: '绘制圆',//t('modes.mouse_range.title'),
            description: '绘制圆',//t('modes.mouse_range.description'),
            key: '',
            enable: true
    };

    var behavior = iD.behavior.toolbar.Circle(context,mode.id);

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};

iD.behavior.toolbar.Circle = function(context,modeid) {

    var behavior = function(selection) {

        var mouse = null,
            draw = false,
            circle,
            mode = 'circle',
            style = {"fill": "red",'opacity':'0.5',"stroke": 'rgb(255, 99, 25)',"stroke-width" : 3};

        function mousedown() {

            mouse = context.mouse();
            circle = null;

            selection
                .on('mousemove.circle', mousemove)
                .on('mouseup.circle', mouseup)
                .on('mousedown.circle',mouseup);

            d3.event.stopPropagation();
            d3.event.preventDefault();

            
        }

        function mousemove() {
            if (!circle) {
                var  loc = context.map().mouseCoordinates();

                circle = new Circle({ loc : loc ,radius : loc, 
                	mode: 'circle',
                onDraw : function (element){
                   element.style(style);
                }});
                context.map().addOverlays(circle);

                context.event.drawstart({overlay : circle, mode : mode});

            }
            if(circle) circle.radius = context.map().mouseCoordinates();
            context.event.drawoverlayers();

            context.event.drawing({overlay : circle, mode : mode});
        }

        function normalize(a, b) {
            return [
                [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
                [Math.max(a[0], b[0]), Math.max(a[1], b[1])]];
        }

        function mouseup() {

            selection
                .on('mousemove.circle', null)
                .on('mouseup.circle', null);
            
            if(circle) circle.radius = context.map().mouseCoordinates();    
            context.event.drawoverlayers();

            context.event.draw({overlay : circle, mode : mode});

            // set map to browse mode
            context.enter(iD.modes.Browse(context));
        }

        selection
            .on('mousedown.circle', mousedown);
    };

    behavior.off = function(selection) {
        selection.on('mousedown.circle', null);
    };

    return behavior;
};


/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.toolbar.Circle
 * 鼠标工具矩形(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Polyline = function(context) {
    var mode = {
            id: 'toolbar-polyline',
            button: 'toolbar-polyline',
            title: '绘制线段',//t('modes.mouse_range.title'),
            description: '绘制线段',//t('modes.mouse_range.description'),
            key: '',
            enable: true
    };

    var behavior = iD.behavior.toolbar.Polyline(context,mode.id);

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};



iD.behavior.toolbar.Polyline = function(context,modeid) {

     var behavior = function(selection) {

        var mouse = null,
            draw = false,
            polyline,
            mode = 'polyline',
            style = {"stroke": 'rgb(255, 99, 25)','opacity':'0.5',"stroke-width" : 3};

        function mousedown() {

            mouse = context.mouse();
            polyline = null;

            selection
                .on('mousemove.polyline', mousemove)
                .on('mouseup.polyline', mouseup)
                .on('mousedown.polyline',mousedownup)
                .on('click.polyline',click)
                .on('dblclick.polyline',dblclick);

            d3.event.stopPropagation();
            d3.event.preventDefault();

            var element = d3.select(this),
            touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null,
            time = +new Date();

            element.on('mousemove.polyline', null);

            d3.select(window).on('mouseup.polyline', function() {

                element.on('mousemove.polyline', mousemove);

                    // Prevent a quick second click
                    d3.select(window).on('click.draw-block', function() {
                        d3.event.stopPropagation();
                    }, true);

                    context.map().dblclickEnable(false);

                    window.setTimeout(function() {
                        context.map().dblclickEnable(true);
                        d3.select(window).on('click.draw-block', null);
                    }, 500);

                    click();
            });
            draw = true;
        }
        
        function filterNodes (nodes) {
    		for (var i = 0;i < nodes.length - 1;i++) {
        		if (iD.geo.edgeEqual(nodes[i].loc, nodes[i + 1].loc)) {
        			nodes.splice(i + 1, 1);
        			filterNodes(nodes);
        			break;
        		}
        	}
        }
   
        function dblclick(){
            if(polyline)
            {
              polyline.moveNode(new Marker({ loc : context.map().mouseCoordinates() }) );
          	  
              filterNodes(polyline.nodes);
              
              context.event.drawoverlayers();

              context.event.draw({overlay : polyline, mode : mode});
            }
            context.enter(iD.modes.Browse(context));
        }

        function mousemove() {
            if (!polyline) {
                var  nodes = [], loc = context.map().mouseCoordinates();
                     nodes.push(new Marker({ loc : loc }));
                     nodes.push(new Marker({ loc : loc }));
                     nodes.push(new Marker({ loc : loc }));
                
                polyline = new Polyline({ nodes : nodes ,
                	mode: 'polyline',
                    onDraw : function (element){
                       element.style(style);
                    }});

                context.map().addOverlays(polyline);

                context.event.drawstart({overlay : polyline, mode : mode});
            }

            if(!draw)
            {
                polyline.moveLoc(context.map().mouseCoordinates());
                context.event.drawoverlayers();

                context.event.drawing({overlay : polyline, mode : mode});
            }

        }
        
        var t = 0;
        function click(){ 

            if(d3.event.target.__data__ &&   d3.event.target.__data__.button && d3.event.target.__data__.enter)  
            {
                d3.event.preventDefault();
                polyline && polyline.addNode(new Marker({ loc : context.map().mouseCoordinates() }));
                dblclick();
                if(d3.event.target.__data__.id == modeid)
                  context.enter(iD.modes.Browse(context));  
                else{
                  context.enter(iD.modes.Browse(context));  
                  context.enter(d3.event.target.__data__);
                }    
                  
             }else if(d3.event.target.__data__ || d3.event.target.id === "surface"){ 
                if(new Date().getTime() - t < 200){
                        return;
                } 
                if(same(point(),context.map().mouseCoordinates())) 
                polyline && polyline.addNode(new Marker({ loc : context.map().mouseCoordinates() }));
                t = new Date().getTime();
                context.event.drawing({overlay : polyline, mode : mode});
            }else{
                if(d3.event.target && d3.event.target.id != "surface" && d3.event.target.onclick){
                    context.event.draw({overlay : polyline, mode : mode});
                    context.enter(iD.modes.Browse(context));  
                    d3.event.target.onclick(); //这样是否可行？暂时这样
                }
            }    

        }

        var origin_point, origin_lnglat;

        function point() {
            var target = this;
            var touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null;
            var surface=context.surface().node();
            var p = target.parentNode || surface;
            return touchId !== null ? d3.touches(p).filter(function(p) {
                return p.identifier === touchId;
            })[0] : d3.mouse(p);
        }
        
        function same(point,lnglat){
            if(origin_point && lnglat 
              && origin_point[0] == point[0]
              &&  origin_point[1] == point[1]
              && origin_lnglat[0] == lnglat[0]
              &&  origin_lnglat[1] == lnglat[1])
                return true;
            else
                return false;
        }

        function mouseup() {
           if(draw) draw = false;
           else  draw = true;
        }

        function mousedownup(){
            origin_point = point();
            origin_lnglat = context.map().mouseCoordinates();
            if(draw) draw = false;
            else  draw = true;
        }
        
        function backspace() {
            d3.event.preventDefault();
        }

        function del() {
            d3.event.preventDefault();
        }

        function ret() {
            d3.event.preventDefault();
            click();
            dblclick();
        }
        
        // bind key event
        keybinding
            .on('⌫', backspace)
            .on('⌦', del)
            .on('⎋', ret)
            .on('↩', ret); 

        selection.on('mousedown.polyline', mousedown);

        d3.select(document)
            .call(keybinding);

    };
    var keybinding = d3.keybinding('draw');
    behavior.off = function(selection) {

        selection.on('mousedown.polyline', null);
        selection.on('mousemove.polyline', null);
        selection.on('mouseup.polyline', null);
        selection.on('click.polyline', null);
        selection.on('dblclick.polyline', null);
        d3.select(window).on('mouseup.polyline', null);
        d3.select(document)
            .call(keybinding.off);

    };

    return behavior;
};



/**
 +------------------------------------------------------------------------------
 * 类:iD.modes.Polygon
 * 鼠标工具框选(mode)
 +------------------------------------------------------------------------------
 */
iD.modes.toolbar.Lasso = function(context) {
    var mode = {
            id: 'toolbar-lasso',
            button: 'toolbar-lasso',
            title: '拉框选择',//t('modes.mouse_range.title'),
            description: '拉框选择',//t('modes.mouse_range.description'),
            key: '',
            enable: true
    };
    var f = arguments[1] ;
    var behavior = iD.behavior.Lasso(context,'true',f);
    
    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        window.setTimeout(function() {
            context.map().dblclickEnable(true);
        }, 300);
        context.uninstall(behavior);
    };

    return mode;
};
