iD.svg.PicDraw = iD.svg.PicDraw || {};
window._TRACK_CONTRL_RECORED_ = [];
// 标定-控制点
iD.svg.PicDraw.trackControlPoint = function(context, drawTool) {
    const constant = drawTool.getConstant();
    var player = drawTool.getPlayer();
    var drawStatus = {},
        zrenderNodeStatus;

    function drawPlus() {}
    _.assign(drawPlus.prototype, {
        init: function(arg1, arg2) {
            drawStatus = arg1;
            zrenderNodeStatus = arg2;
        },
        // 遍历操作时匹配类型
        check: function() {
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
        },
        getId: function() {
            return constant.TOOL_TRACK_CONTROLPOINT;
        },
        renderBtn: function(selection) {
            selection.append('button')
                .attr('type','button')
                .text('标定控制点')
                .attr('modelName',iD.data.DataType.TRAFFICSIGN)
                .data([this.getId()]);
            
            var label = selection.append("label")
                .style("font-size", "14px")
                .style("display", "inline-block");

            label.append("input")
                .attr("type", "checkbox")
                .style("display", "inline-block")
                .style("float", "none")
                .style("margin", "0px")
                .style("vertical-align", "middle")
                .on("click", function () {
                    if (this.checked) {
                        context.variable.hideTrackControlPoint = true;
                    } else {
                        context.variable.hideTrackControlPoint = false;
                    }
                    context.map().redraw();
                    player.resetCanvas();
                });
            label.append("span")
                .style("vertical-align", "middle")
                .html("隐藏控制点");
        },
        // 绘制结束后重置变量
        reset: function() {},
        /*
        domMousedown: function(){},
        domMouseup: function(){},
        zrenderMove: function(){},
        domDblclickMore: function(){},
        */
        buttonClick: function(evt, active, node) {},
        domClick: function(evt, clickOffset, opts) {
            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            var result = drawTool.drawGeometryPoint({
                canvasOffset: clickOffset
            }, {
                shape: {
                    r: 3
                }
            });
            var shape = getNearestShape(result);
            // if(!shape){
            //     drawTool._zrender.remove(result);
            //     return ;
            // }
            var node = createPoint(result, [geometry.lng, geometry.lat, geometry.elevation]);
            iD.picUtil.updateZrenderStyleByEntity(result, result._entityid);
            drawTool._zrender.add(result);
            result._entityid = node.id;
            recordData(result, shape);
            var selectedIds = [node.id];
            if(shape){
                selectedIds.push(shape._entityid);
            }
            iD.AutoMatch.shapeHover(player, selectedIds);
            setTimeout(function(){
                drawTool._lightMapEntities(selectedIds);
            }, 500);
        },
        /**
         * 
         * @param {Event} evt d3.event
         * @param {Array} clickOffset 缩放1级的xy坐标
         * @param {Object} opts 
         */
        domClickBefore: function(evt, clickOffset, opts) {}
    });

    function recordData(point, shape){
        if(!shape) return ;
        var p = player.reductionPoint([point.shape.cx, point.shape.cy]);
        var pixel = {
            x: p[0],
            y: p[1]
        };
        var node = context.entity(shape._entityid);
        var pos = {
            longitude: node.loc[0],
            latitude: node.loc[1],
            height: node.loc[2]
        };

        var deviceId = player.wayInfo.deviceId;
        var trackId = player.wayInfo.trackId;
        var trackPointId = player.pic_point.id;

        var result = {
            deviceId,
            trackId,
            trackPointId,
            mapping: [{
                pixel,
                pos
            }],
            controlPointId: node._control_id || '',
        };

        var pointNode = context.hasEntity(point._entityid);
        if(pointNode){
            pointNode._record = result;
            pointNode._light_entityids = [node.id];
        }

        _TRACK_CONTRL_RECORED_.push(result);
    }

    function getNearestShape(point){
//      var shapeList = player._zrender.storage.getDisplayList();
        var shapeList = player._zrender.storage._roots || [];
        var result, minDis = Infinity;
        var maxR = 30;
        for(var shape of shapeList){
            if(!shape._entityid) continue;
            if(shape == point || shape.id == point.id) continue;
            var node = context.hasEntity(shape._entityid);
            if(!node || node._type != iD.data.DataType.SEARCH_POINT) continue;
            // if(shape.type != 'circle') continue;
            
            var dx = Math.abs(shape.shape.cx - point.shape.cx);
            var dy = Math.abs(shape.shape.cy - point.shape.cy);
            if(dx > maxR || dy > maxR) continue ;
            var dis = dx + dy;
            if(dis < minDis){
                minDis = dis;
                result = shape;
            }
        }
        return result;
    }

    function createPoint(result, loc){
        var node = iD.Node({
            _type: iD.data.DataType.PLACENAME,
            tags: {
                colortype: 2
            },
            loc: loc
        });
        context.perform(iD.actions.AddEntity(node), '记录控制点');
        result._entityid = node.id;
        return node;
    };

    return new drawPlus();
}