/*
 * @Author: tao.w
 * @Date: 2019-09-16 11:12:38
 * @LastEditors: tao.w
 * @LastEditTime: 2019-12-23 19:42:21
 * @Description: 
 */
iD.svg.orthographicMap = function(proj, context) {

    var picPlayer = null,
        playableModeIds = ['browse', 'pic_play'],
        dispatch = d3.dispatch('playerTimeupdate'),
        drawnPoint,
        _tracks=[],
        trackIndex = -1;
    _trackPointRel=null,//用于记录子线程中处理过的点数据
        width=0,height=0,
        oldZoom = null,
        oldCenter = null;//在drawn事件中使用
    flattenArr = arr => arr.reduce((begin,current)=>{
        Array.isArray(current)?
            begin.push(...flattenArr(current)):
            begin.push(current);
        return begin
    },[]);
    var d3_xhr;
    var isFirstLocate = false, firstLocate;
		// 第一次轨迹加载完成，经过picUpdate事件后地图已经到当前视频范围内；
		// 若有locate参数，则定位到相应位置
	var locate = iD.url.getUrlParam('locate');
	if(locate){
		locate = locate.split(',').map(v => Number(v.trim()));
	}
	if(locate.length && !isNaN(locate[0]) && !isNaN(locate[1])){
		firstLocate = locate;
		isFirstLocate = true;
	}
    var img = new Image();
    img.src = context.imagePath('dvr_cursor.png');
    var startImg = new Image();
    startImg.src = context.imagePath('start.png');
    var endImg = new Image();
    endImg.src = context.imagePath('end.png');

    // var $dvrLayer, $dvrLayerOfWays, $dvrLayerOfNodes;
    let $lineCanvas,$trackCanvas,$anchorCanvas,$arrowCanvas,lineCanvas,trackCanvas,anchorCanvas,arrowCanvas;
    // let trackContext;
    // 记录任务的task_id
    var __prevTaskId;
    var canvasWork;
    var _r = 5;
    var _rr = 3;
    var _w = 9;

    var goodCacheCanvas = document.createElement("canvas");
    var goodCacheCtx = goodCacheCanvas.getContext("2d");
    goodCacheCtx.width = _w;
    goodCacheCtx.height = _w;

    ctxPointFill(goodCacheCtx, 'green');

    var badSpotsCacheCanvas = document.createElement("canvas");
    var badSpotsCacheCtx = badSpotsCacheCanvas.getContext("2d");
    badSpotsCacheCtx.width = _w;
    badSpotsCacheCtx.height = _w;

    ctxPointFill(badSpotsCacheCtx, 'red');

    var acceptableCacheCanvas = document.createElement("canvas");
    var acceptableCacheCtx = acceptableCacheCanvas.getContext("2d");
    acceptableCacheCtx.width = _w;
    acceptableCacheCtx.height = _w;

    ctxPointFill(acceptableCacheCtx, 'yellow');

    var greenCacheCanvas = document.createElement("canvas");
    var greenCacheCtx = greenCacheCanvas.getContext("2d");
    greenCacheCtx.width = _w;
    greenCacheCtx.height = _w;

    ctxPointFill(greenCacheCtx, 'green');

    var cyanCacheCanvas = document.createElement("canvas");
    var cyanCacheCtx = cyanCacheCanvas.getContext("2d");
    cyanCacheCtx.width = _w;
    cyanCacheCtx.height = _w;

    ctxPointFill(cyanCacheCtx, 'Cyan');

    var blueCacheCanvas = document.createElement("canvas");
    var blueCacheCtx = blueCacheCanvas.getContext("2d");
    blueCacheCtx.width = _w;
    blueCacheCtx.height = _w;

    ctxPointFill(blueCacheCtx, 'blue');

    var purpleCacheCanvas = document.createElement("canvas");
    var purpleCacheCtx = purpleCacheCanvas.getContext("2d");
    purpleCacheCtx.width = _w;
    purpleCacheCtx.height = _w;

    ctxPointFill(purpleCacheCtx, 'purple');

    var magentaCacheCanvas = document.createElement("canvas");
    var magentaCacheCtx = magentaCacheCanvas.getContext("2d");
    magentaCacheCtx.width = _w;
    magentaCacheCtx.height = _w;

    ctxPointFill(magentaCacheCtx, 'magenta');

    var redCacheCanvas = document.createElement("canvas");
    var redCacheCtx = redCacheCanvas.getContext("2d");
    redCacheCtx.width = _w;
    redCacheCtx.height = _w;

    ctxPointFill(redCacheCtx, 'red');

    var otherCacheCanvas = document.createElement("canvas");
    var otherCacheCtx = otherCacheCanvas.getContext("2d");
    otherCacheCtx.width = _w;
    otherCacheCtx.height = _w;

    ctxPointFill(otherCacheCtx, 'grey');

    function ctxPointFill(ctx, fillStyle = 'black', lineWidth = 2){
        // 残留旧颜色
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // let lineWidth = style.lineWidth != null ? style.lineWidth : 2;
        // var fillStyle = style.fillStyle || 'black';
        // .save，.restore只影响转换操作，不影响颜色等
        // ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fillStyle; 
        // goodCacheCtx.strokeStyle = '#808080';
        ctx.beginPath();
        ctx.arc(_r, _r , _rr, 0, 2 * Math.PI);
        // ctx.stroke();
        ctx.fill();
        // ctx.restore();
        if(!ctx.canvas.getAttribute('data-fill')){
            ctx.canvas.setAttribute('data-fill', ctx.fillStyle);
        }
    }

    function destroyPlayer() {

        if (!picPlayer) {
            return;
        }

        picPlayer.destory();
        picPlayer = null;
        __prevTaskId = undefined;
    }

    function initDvrPlayer(context) {
        if (picPlayer) {
            return;
        }
        oldCenter = context.map().center();
        oldZoom = context.map().zoom();
        picPlayer = new iD.svg.orthographicMapPlayer(context);
        //全局变量，不要删除
        // window._pic = picPlayer;
        context._orthographicPic = picPlayer;
        picPlayer.init(context.container());
        picPlayer.on('close.player', function() {
            destroyPlayer();
        });

        picPlayer.on('picUpdate.orthographic', function(updaeNodeid) {
            drawnPoint = updaeNodeid;
            var loc = drawnPoint.loc;
            if(isFirstLocate){
            	loc = firstLocate;
            }
            // updateMapPoseByLoc(drawnPoint.loc,true);
            updateMapPos(loc, true);
            dispatch.playerTimeupdate(updaeNodeid);
        });
        
        context.map()
        	.on('drawn.pic', redrawCanvas)
        	.on('zoom.pic', redrawCanvas);
        
        function redrawCanvas(){
            let isEqual = true,
                newCenter = context.map().center(),
                newZoom = context.map().zoom();
            if (oldCenter && oldCenter[0] == newCenter[0] && oldCenter[1] == newCenter[1] && oldZoom == newZoom) {
                isEqual = false;
            }else{
                oldCenter = newCenter;
                oldZoom = newZoom;
            }


            if(picPlayer && picPlayer.pic_point && isEqual){
                clearCanvas();
                drawPic(_trackPointRel, picPlayer.pic_point);
            }
        }

        var clickTimeId;
        let surface = context.surface();
        surface.on('mousedown.orthographicMap-canvas', function (d) {
            var lastMousePos = [d3.event.offsetX, d3.event.offsetY];
            var lastMouseTarget = d3.event.target;
            if(lastMouseTarget == this){
                // trackContext && trackContext.mousedown(d3.event);
            }
            surface.on('mouseup.orthographicMap-canvas', function (d) {
                if(lastMouseTarget == this){
                    // trackContext && trackContext.mouseup(d3.event);
                }

                var upPos = [d3.event.offsetX, d3.event.offsetY]
                if (d3.event.target === lastMouseTarget &&
                    iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {

                    var targetEvent = d3.event;

                    if (clickTimeId) {
                        clearTimeout(clickTimeId);
                    }
                    var altKeyDown = context.variable.altKeyDown;

                    clickTimeId = setTimeout(function () {

                        //console.warn('Downup click triggered');

                        clickTimeId = null;

                        var oldEvent = d3.event;

                        d3.event = targetEvent;

                        if(altKeyDown){
                            resetLoc()
                        }

                        d3.event = oldEvent;

                        targetEvent = null;

                    }, 250);
                }

                lastMousePos = null;
                lastMouseTarget = null;
                surface.on('mouseup.orthographicMap-canvas', null);

            });
        }).on('mousemove.orthographicMap-canvas', function(){
            var lastMouseTarget = d3.event.target;
            if(lastMouseTarget == this){
                // trackContext && trackContext.mousemove(d3.event, context);
            }
        });
    }
    function resetLoc(){
        var allNodes = [];
        if(picPlayer){
            allNodes = _.compact(_.flatten(_.pluck(picPlayer.dataMgr.tracks || [], 'nodes')));
            if(!allNodes.length){
                allNodes = picPlayer.allNodes || [];
            }
        }
        if(!allNodes.length){
            console.log('轨迹中没有对应数据！');
            return ;
        }
        var loc = editor.context.map().mouseCoordinates();
        var line = _.pluck(allNodes,'loc');
        var dist = iD.util.pt2LineDist2(line, loc);
		// 使用pt2LineDist时，实际计算出的最近点 ，可能是上一个点，再取最近值
		var result = getNearestNode([allNodes[dist.i], allNodes[dist.i + 1]], loc);
        var node = result.node;
        // 像素范围判断；轨迹点渲染大概8px直径
        if(node && result.dist <= 12){
            picPlayer.locateTrackPointToPlayer(node.tags.trackPointId, node.tags.trackId);
        }
    }
    
    function getNearestNode(nodes, loc){
    	// iD.picUtil.isPointEqual(projection(node.loc), projection(loc), 2.5)
    	var projection = context.projection;
    	var p = projection(loc);
    	var result = {
    		i: -1,
    		node: null,
    		dist: null
    	};
    	var idx = 0;
    	for(var node of nodes){
    		var np = projection(node.loc);
    		var xs = [np[0], p[0]],
    			ys = [np[1], p[1]],
    			minX = _.min(xs),
    			maxX = _.max(xs),
    			minY = _.min(ys),
    			maxY = _.max(ys);
    		var a = maxX - minX,
    			b = maxY - minY,
    			dist = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
			if(idx == 0) {
				result.dist = dist;
    			result.node = node;
    			result.i = idx;
			};
    		if(result.dist > dist){
    			result.dist = dist;
    			result.node = node;
    			result.i = idx;
    		}
    		idx ++;
    	}
    	return result;
    }

    function updateTimePoint(point) {
        if(!point){

            return ;
        }
        drawTimePoint(point);
    }

    /**
     * 当pic_player中的帧发生改变时，调整右侧地图的位置
     * @param loc
     * @param isPan true为帧数改变，false为地图上的拖拽、缩放等redraw操作
     */
    var updateMapPos = _.throttle(function(loc, isPan = false) {
        if(!isPan){
            return ;
        }
        if(iD.url.getUrlParam('locate', window.location.hash)){
        	window.location.hash = '';
        	return ;
        }
		isFirstLocate = false;
        var map = context.map(),
            projection = context.projection;

        var pos = projection(loc),
            dimensions = map.dimensions(),
            panOffset = [0, 0],
            bounds = {
                left: 40,
                right: Math.max(dimensions[0] - 100, 200),
                top: 70,
                bottom: Math.max(dimensions[1] - 100, 200)
            },
            buffPan = [370, 500];

        if (pos[0] < bounds.left) {

            panOffset[0] = bounds.left - pos[0] + buffPan[0];

        } else if (pos[0] > bounds.right) {

            panOffset[0] = bounds.right - pos[0] - buffPan[0];
        }

        if (pos[1] < bounds.top) {

            panOffset[1] = bounds.top - pos[1] + buffPan[1];

        } else if (pos[1] > bounds.bottom) {

            panOffset[1] = bounds.bottom - pos[1] - buffPan[1];
        }

        // 靠近边界
        if ((panOffset[0] !== 0 || panOffset[1] !== 0) && isPan) {
            // map.pan(panOffset);
            map.center(loc);
        }
    }, 500, {
        leading: false,
        trailing: true
    });

    function drawTimePoint(point,isPan = false) {
        anchorCanvas.clearRect(0, 0, width, height);
        point && trackAnchor(anchorCanvas, [point]);
    }
    /*
     *
     * @param trackObj 当前轨迹
     * @param tI 当前轨迹在数据集中索引
     * @param isFirst 是否是第一条数据，是则视频可以初始化
     * */
    function redrawDvr(trackObj, tI, isFirst) {
        if (!trackObj /*&& !trackObj.nodes.length*/) {
            return;
        }
        trackIndex = tI;
        if (playableModeIds.indexOf(context.mode().id) < 0) {
            iD.svg.Pic.dataMgr.selectedIDs([]);
        }


        initDvrPlayer(context);
        picPlayer.init(context.container());
        picPlayer.renderPicPlayer(trackObj, trackObj.nodes[0].id).show();
        // resetSize();
        dispatch.on('playerTimeupdate', function(point) {
            drawnPoint  =point;
            updateTimePoint(point);
        });

        drawArrowAandAnchor();
        if (trackObj.selectPoint) {
            drawnPoint = trackObj.selectPoint;
        }
    }


    function dvrRender(surface, opts) {
        initContainer();
        // 还没有初始化任务
        if(!iD.Task.d){
            return ;
        }
        // 有更改：绘制过程中、保存中
        if(opts.event && opts.event.difference){
            return ;
        }
    };

    function loc2PixCoords (nodes) {
        let pixCoords = [],loc;

        for (let i = 0, il = nodes.length; i < il; i++) {
            loc = nodes[i].loc;
            pixCoords.push(context.projection(loc));
        }
        return pixCoords;
    }

    function drawPic(points,anchorPoint){
        if (points) {
            trackPoint(trackCanvas,points);
        }
        if(anchorPoint)
        drawArrowAandAnchor(anchorPoint);
    }
    function drawArrowAandAnchor(anchorPoint){
        let nodes = _tracks[trackIndex].nodes;
        trackArrow(arrowCanvas,[nodes[0], nodes[nodes.length-1]]);
        if (anchorPoint) {
            trackAnchor(anchorCanvas,[anchorPoint]);
        }
    }

    function clearCanvas(){
        let  surface = d3.selectAll('#surfaceCanvas').node();
        let width  = surface.clientWidth,height =surface.clientHeight;

        $lineCanvas.width = width;
        $trackCanvas.width = width;
        $anchorCanvas.width = width;
        $arrowCanvas.width = width;
    }
    //TODO 这里需要优化，应该是窗口界面重置后重新初始
    //重置canvas 宽高
    function resetSize(){
        let  surface = d3.selectAll('#surfaceCanvas').node();
        height =surface.clientHeight;
        width = surface.clientWidth;

        $lineCanvas.width = width;
        $lineCanvas.height = height;

        $trackCanvas.width = surface.clientWidth;
        $trackCanvas.height = surface.clientHeight;

        $anchorCanvas.width = surface.clientWidth;
        $anchorCanvas.height = surface.clientHeight;

        $arrowCanvas.width = surface.clientWidth;
        $arrowCanvas.height = surface.clientHeight;
        _trackPointRel && drawPic(_trackPointRel, drawnPoint);
        drawTimePoint(drawnPoint)

    }
    //绘制锚点
    function trackAnchor(cxt,points){
        let pixPoints = loc2PixCoords(points);
        cxt.drawImage(img, pixPoints[0][0]-11, pixPoints[0][1]-30)
    }

    //绘制起终点
    function trackArrow(cxt, points) {
        arrowCanvas.clearRect(0, 0, width, height)
        let pixPoints = loc2PixCoords(points);

        cxt.drawImage(startImg, pixPoints[0][0]-10, pixPoints[0][1]-28);
        cxt.drawImage(endImg, pixPoints[1][0]-10, pixPoints[1][1]-28);
    }

    //绘制轨迹点
    function trackPoint(cxt,points) {
        if(!points) return ;
        // && iD.User.isPrecisionRole()
        function ctxDrawNode(cvs, pixel, _ctx, node){
            // 重新填充颜色很耗时
            if (_ctx && node && node.tags 
                && !context.variable.trackWhiteListStatus[node.tags.trackId]) {
                // 填充后的fillStyle是小写
                var grey = '#c0c0c0';
                if(_ctx.fillStyle != grey){
                    ctxPointFill(_ctx, grey);
                }
                cxt.drawImage(cvs , pixel[0]-_r, pixel[1]-_r);
            }else {
                var oldFill = _ctx.canvas.getAttribute('data-fill');
                if(oldFill != _ctx.fillStyle){
                    ctxPointFill(_ctx, oldFill);
                }
                cxt.drawImage(cvs , pixel[0]-_r, pixel[1]-_r);
            }
        }

        let bounds = [[0,0],context.map().dimensions()];

        let pointClassification = points;
        var node;
        var loc,x,y;

        if (pointClassification.goodPoints) {
            var goodPix = loc2PixCoords(pointClassification.goodPoints);
            
            for (let i = 0, l = goodPix.length; i < l; i++) {
                node = goodPix[i];
                if(!iD.util.isInsideRect(bounds,node)){
                    continue;
                }
                ctxDrawNode(goodCacheCanvas, node, goodCacheCtx, pointClassification.goodPoints[i]);
                // cxt.drawImage(goodCacheCanvas , node[0]-_r, node[1]-_r);
            }

            var badSpotsPix = loc2PixCoords(pointClassification.badSpots);

            for (let i = 0, l = badSpotsPix.length; i < l; i++) {
                node = badSpotsPix[i];
                if(!iD.util.isInsideRect(bounds,node)){
                    continue;
                }
                ctxDrawNode(badSpotsCacheCanvas, node, badSpotsCacheCtx, pointClassification.badSpots[i]);
                // cxt.drawImage(badSpotsCacheCanvas , node[0]-_r, node[1]-_r);
            }
            var acceptablePixs = loc2PixCoords(pointClassification.acceptables);

            for(let i = 0, l = acceptablePixs.length; i < l; i++){
                node = acceptablePixs[i];
                ctxDrawNode(acceptableCacheCanvas, node, acceptableCacheCtx, pointClassification.acceptables[i]);
                // cxt.drawImage(acceptableCacheCanvas , node[0]-_r, node[1]-_r);
            }
        } else {

            var greenPix = loc2PixCoords(pointClassification.greenPoints);
            for (let i = 0, l = greenPix.length; i < l; i++) {
                node = greenPix[i];
                if (!iD.util.isInsideRect(bounds, node)) {
                    continue;
                }
                ctxDrawNode(greenCacheCanvas, node, greenCacheCtx, pointClassification.greenPoints[i]);
                // cxt.drawImage(greenCacheCanvas, node[0] - _r, node[1] - _r);
            }

            var cyanPix = loc2PixCoords(pointClassification.cyanPoints);
            for (let i = 0, l = cyanPix.length; i < l; i++) {
                node = cyanPix[i];
                if (!iD.util.isInsideRect(bounds, node)) {
                    continue;
                }
                ctxDrawNode(cyanCacheCanvas, node, cyanCacheCtx, pointClassification.cyanPoints[i]);
                // cxt.drawImage(cyanCacheCanvas, node[0] - _r, node[1] - _r);
            }

            var bluePixs = loc2PixCoords(pointClassification.bluePoints);
            for (let i = 0, l = bluePixs.length; i < l; i++) {
                node = bluePixs[i];
                ctxDrawNode(blueCacheCanvas, node, blueCacheCtx, pointClassification.bluePoints[i]);
                // cxt.drawImage(blueCacheCanvas, node[0] - _r, node[1] - _r);
            }

            var purplePixs = loc2PixCoords(pointClassification.purplePoints);
            for (let i = 0, l = purplePixs.length; i < l; i++) {
                node = purplePixs[i];
                ctxDrawNode(purpleCacheCanvas, node, purpleCacheCtx, pointClassification.purplePoints[i]);
                // cxt.drawImage(purpleCacheCanvas, node[0] - _r, node[1] - _r);
            }

            var magentaPixs = loc2PixCoords(pointClassification.magentaPoints);
            for (let i = 0, l = magentaPixs.length; i < l; i++) {
                node = magentaPixs[i];
                ctxDrawNode(magentaCacheCanvas, node, magentaCacheCtx, pointClassification.magentaPoints[i]);
                // cxt.drawImage(magentaCacheCanvas, node[0] - _r, node[1] - _r);
            }

            var redPixs = loc2PixCoords(pointClassification.redPoints);
            for (let i = 0, l = redPixs.length; i < l; i++) {
                node = redPixs[i];
                ctxDrawNode(redCacheCanvas, node, redCacheCtx, pointClassification.redPoints[i]);
                // cxt.drawImage(redCacheCanvas, node[0] - _r, node[1] - _r);
            }

            var otherPixs = loc2PixCoords(pointClassification.otherPoints);
            for (let i = 0, l = otherPixs.length; i < l; i++) {
                node = otherPixs[i];
                ctxDrawNode(otherCacheCanvas, node, otherCacheCtx, pointClassification.otherPoints[i]);
                // cxt.drawImage(otherCacheCanvas, node[0] - _r, node[1] - _r);
            }
        }
    }

    function initContainer(){
        let container = d3.selectAll('#surfaceCanvas');
        container.append('canvas')
            .attr('id','pic-line-canvas')
            .attr('style', 'width:100%;height:100%;position: absolute;');
        container.append('canvas')
            .attr('id','pic-track-canvas')
            .attr('style', 'width:100%;height:100%;position: absolute;');
        container.append('canvas')
            .attr('id','pic-arrow-canvas')
            .attr('style', 'width:100%;height:100%;position: absolute;');
        container.append('canvas')
            .attr('id','pic-anchor-canvas')
            .attr('style', 'width:100%;height:100%;position: absolute;');

        $lineCanvas = container.select('#pic-line-canvas').node();
        lineCanvas = $lineCanvas.getContext("2d");
        $lineCanvas.width = $lineCanvas.clientWidth;
        $lineCanvas.height = $lineCanvas.clientHeight;
        $trackCanvas = container.select('#pic-track-canvas').node();
        trackCanvas = $trackCanvas.getContext("2d");
        $trackCanvas.width = $trackCanvas.clientWidth;
        $trackCanvas.height = $trackCanvas.clientHeight;
        $anchorCanvas = container.select('#pic-anchor-canvas').node();
        anchorCanvas = $anchorCanvas.getContext("2d");
        $anchorCanvas.width = $anchorCanvas.clientWidth;
        $anchorCanvas.height = $anchorCanvas.clientHeight;
        $arrowCanvas = container.select("#pic-arrow-canvas").node();
        arrowCanvas = $arrowCanvas.getContext("2d");
        $arrowCanvas.width = $arrowCanvas.clientWidth;
        $arrowCanvas.height = $arrowCanvas.clintHeight;

    }

    d3.select(window).on('resize.picCanvas', function() {
        resetSize();
    });
    dvrRender.getTrackPointRel = function(){
        return _trackPointRel;
    }

    dvrRender.redrawPic=redrawDvr;
    dvrRender.drawPic = drawPic;
    dvrRender.getPicPlayer = function(){
        return picPlayer;
    }
    dvrRender.clearCanvas = clearCanvas;
    dvrRender.resetSize = resetSize;
    dvrRender.setTracks = function(_){
        resetSize();
        if(_ == _tracks){
            return
        }
        _tracks = _;
        if (_tracks.length && _tracks.length <= 255) {
            canvasWork = new Worker("./svg/pic_canvas_work.js");
            canvasWork.postMessage(_tracks);
            canvasWork.onmessage = function (event) {
                _trackPointRel = event.data;
                drawPic(event.data);
                canvasWork.terminate();
            }
        } else {
            context.variable.isDrawTrackPointsToShape = false;
        }
    }
    dvrRender.getNearestNode = getNearestNode;
    dvrRender.clearDatas = function(){
        _trackPointRel = null;
        _tracks = [];
        drawnPoint = null;
        trackIndex = -1;
        clearCanvas();
    }
    dvrRender.redrawTracks = function(){
        if(_trackPointRel){
            clearCanvas();
            if(picPlayer){
                drawnPoint = picPlayer.pic_point;
            }
            drawPic(_trackPointRel, drawnPoint);
        }
    }

    return dvrRender;
};