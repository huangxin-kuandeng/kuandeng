/*
   The hover behavior adds the `.hover` class on mouseover to all elements to which
   the identical datum is bound, and removes it on mouseout.

   The :hover pseudo-class is insufficient for iD's purposes because a datum's visual
   representation may consist of several elements scattered throughout the DOM hierarchy.
   Only one of these elements can have the :hover pseudo-class, but all of them will
   have the .hover class.
 */
iD.behavior.Hover = function() {
    var dispatch = d3.dispatch('hover'),
        selection,
        altDisables,
        target,
        context;

    if(arguments && arguments.length && arguments[0]){
    	var context = arguments[0];
    }
    function keydown() {
        if (altDisables && d3.event.keyCode === d3.keybinding.modifierCodes.alt) {
            dispatch.hover(null);
            selection.selectAll('.hover')
                .classed('hover-suppressed', true)
                .classed('hover', false);
        }
    }

    function keyup() {
        if (altDisables && d3.event.keyCode === d3.keybinding.modifierCodes.alt) {
            dispatch.hover(target ? target.id : null);
            selection.selectAll('.hover-suppressed')
                .classed('hover-suppressed', false)
                .classed('hover', true);
        }
    }
    function displayOverlays(id,display){
        context.map().getOverlays(id).forEach(function(overlay) {
            if(display){
                overlay.display = false;
            }else {
                overlay.display = true;
            }
        });
        context.map().drawOverlayers();
    }
    var hover = function(__) {
        selection = __;
        var hotmarker = {};
        var lastTile = "";

        function filter(target){
           if(context){
                //context.event.hover({'target' : target, 'mouse' : context.mouse()});
                context.hover_callback && context.hover_callback.call(this, target, context.mouse());
           } 
           var lightOverlays = context.lightOverlays();
           if( target instanceof iD.Polyline
              || target instanceof iD.Polygon 
              || target instanceof iD.Marker 
              || target instanceof iD.Circle
              || target instanceof iD.TransPolygon)
           {
                  dispatch.hover(null);
                  var org = lightOverlays != '' ? lightOverlays + ', ' : '';
                  var selector = org + '.' + target.id;
                  var suppressed = altDisables && d3.event && d3.event.altKey;
                      selection.selectAll(selector).
                      classed(suppressed ? 'hover-suppressed' : 'hover', true);
                  return true;
           }else if(lightOverlays){ // 高亮覆盖物
                  hover.overlays();
           }
           return false;
        }

        function enter(d) {
            if (d === target) return;
            
            target = d;

            selection.selectAll('.hover')
                .classed('hover', false);
            selection.selectAll('.hover-suppressed')
                .classed('hover-suppressed', false);
            
            if((filter(target))) return; 
            
            if (target instanceof iD.Entity) {
                if (target instanceof iD.Transportation) return;

                var selector = '.' + target.id;

                if (target.type === 'relation') {
                    target.members.forEach(function(member) {
                        selector += ', .' + member.id;
                    });
                }

                var suppressed = altDisables && d3.event && d3.event.altKey;

                selection.selectAll(selector)
                    .classed(suppressed ? 'hover-suppressed' : 'hover', true);

                dispatch.hover(target.id);
            } else {
                dispatch.hover(null);
            }
        }

        var down;

        function mouseover() {
            if (down) return;
            var target = d3.event.target;
            enter(target ? target.__data__ : null);
           
            //target && target.__data__ && context && context.event.addEventDispatch('mouseover',{'target' :  target.__data__ });
        }

        function mousemove(e){
            if(context){
                // var layer = context.layers().getCurrentEnableLayer();
                var layer = context.layers().getLayer();
                    if(!layer){
                        return ;
                    }
                    layer.lastIds = [];
                    var hot = layer.hotspots[e.tile.join("_")];
                    if(!hot){
                        hotmarker.visible = false;
                        displayOverlays("editorhotspot",false);
                        return false;
                    }

                    var name ="";
                    if(!context.background().getOverlayLayers(layer.id+"HotspoLayer")){
                        return ;
                    }

                    var tilexy = context.background().getOverlayLayers(layer.id+"HotspoLayer").getTilexy(e.tile);
                    var xy = [Math.abs(e.layerX-tilexy[0]),Math.abs(e.layerY-tilexy[1])];
                    for(var i in hot){//遍历当前切片上所有热点，查看当前位置是否再此范围内
                        if(isInclusion(xy,hot[i],layer)){
                            layer.lastIds.push(i);
                            lastTile = e.tile.join("_");
                        }else if(lastTile!=e.tile.join("_")){
                            if(context.map().getOverlays("editorhotspot")[0].visible){
                                hotmarker.visible = false;
                                displayOverlays("editorhotspot",false);
                            }
                            layer.lastIds = [];
                            lastTile = "";
                        }
                    }
                    if(layer.lastIds.length){
                        layer.lastIds.forEach(function(obj){
                            if(hot[obj].name !=undefined){
                                name = name+hot[obj].name+"、";
                            }else{
                                name = name+ obj+"、";
                            }
                        });
                        name = name.slice(0,-1);
                        var xy  =context.map().mouse();
                        hotmarker.loc = context.map().invert([xy[0]+5,xy[1]-5]);
                        hotmarker.label = name;
                        hotmarker.visible = true;
                        displayOverlays("editorhotspot",true);
                        context.map().updateOverlays([hotmarker]);
                    }

                    if(!layer.lastIds.length){
                        if(context.map().getOverlays("editorhotspot")[0].visible){
                            displayOverlays("editorhotspot",false);
                        }
                    }
            }
        }

        function isInclusion(xy,obj,layer){
            var inclusion = false;
            if(layer.hotspotType =="point"){
                return xy[0]>obj.coordinates[0][0] && xy[0]<obj.coordinates[2][0] && xy[1]>obj.coordinates[1][1] && xy[1]<obj.coordinates[3][1];
            }else if(layer.hotspotType =="line"){
                if(iD.util.pt2LineDist(obj.coordinates,xy).dis<obj.d){
                    return iD.util.pt2LineDist(obj.coordinates,xy);
                }
            }else if(layer.hotspotType == "poly"){
                return  iD.geo.pointInPolygon(xy,obj.coordinates)
            }
            return inclusion;
        }

        function creatmarker(xy,label){
            var marker = new Icon({
                id:"editorhotspot",
                loc : xy,
                url :  '' ,
                width : 23,
                height : 35,
                label : label ,
                visible : true,
                offset : [10,-10],
                'font-style' :{
                    'font-size': 15,
                    'font-weight': 'bold',
                    'font-family' : '微软雅黑',
                    'fill':'#333'
                },
                'rect-style' :{
                    'fill' : '#fff',
                    'opacity':0.5,
                    'stroke':'#267124',
                    'stroke-width':2
                }
            });
            return marker;
        }

        function mouseout() {
            if (down) return;
            var target = d3.event.relatedTarget;
            enter(target ? target.__data__ : null);
        }

        function mousedown() {
            down = true;
            d3.select(window)
                .on('mouseup.hover', mouseup);
        }

        function mouseup() {
            down = false;
        }

        selection
            .on('mouseover.hover', mouseover)
            .on('mouseout.hover', mouseout)
            .on('mousedown.hover', mousedown)
            .on('mouseup.hover', mouseup);
        // if(context && context.layers().getCurrentEnableLayer() && context.layers().getCurrentEnableLayer().isHotspot()){
        if(context && context.layers().getLayer() && context.layers().getLayer().isHotspot()){
            hotmarker = creatmarker([116.28,39.94],"");
            hotmarker.visible = false;
            context.map().addOverlays(hotmarker);
            hotmarker = context.map().getOverlays("editorhotspot")[0];
            context.event.on('mousemove.hover', mousemove);
        }else{
            displayOverlays("editorhotspot",false);
        }

        d3.select(window)
            .on('keydown.hover', keydown)
            .on('keyup.hover', keyup);
    };

    hover.overlays = function(){
        var selector = context.lightOverlays();
        if(selector){ 
              var suppressed = altDisables && d3.event && d3.event.altKey;
              selection.selectAll(selector).
              classed(suppressed ? 'hover-suppressed' : 'hover', true);
        }
    };
    
    hover.off = function(selection) {
        selection.selectAll('.hover')
            .classed('hover', false);
        selection.selectAll('.hover-suppressed')
            .classed('hover-suppressed', false);

        hover.overlays();

        selection
            .on('mouseover.hover', null)
            .on('mouseout.hover', null)
            .on('mousedown.hover', null)
            .on('mouseup.hover', null);
        // if(context && context.layers().getCurrentEnableLayer()){
        if(context && context.layers().getLayer()){
            context.event.on('mousemove.hover', null);
        }else{
            displayOverlays("editorhotspot",false);
        }

        d3.select(window)
            .on('keydown.hover', null)
            .on('keyup.hover', null)
            .on('mouseup.hover', null);
    };

    hover.altDisables = function(_) {
        if (!arguments.length) return altDisables;
        altDisables = _;
        return hover;
    };

    return d3.rebind(hover, dispatch, 'on');
};
