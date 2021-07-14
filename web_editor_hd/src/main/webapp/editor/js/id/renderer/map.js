/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:37
 * @LastEditors: tao.w
 * @LastEditTime: 2021-02-08 15:16:23
 * @Description: 
 */
iD.Map = function (context) {
    var dimensions = [1, 1],
        // colseTabDimensions = [1, 1],
        dispatch = d3.dispatch('move', "movestart", "moveend", 'drawn', 'zoom', "dragstart", "draging", "dragend", "mousedown", "mouseup"),
        projection = context.projection,
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
        points = iD.svg.Points(roundedProjection, context),
        vertices = iD.svg.Vertices(roundedProjection, context),
        lines = iD.svg.Lines(projection, context),
        // divider = iD.svg.Divider(projection, context),
        areas = iD.svg.Areas(projection),
        // walkareas = iD.svg.WalkAreas(projection),
        midpoints = iD.svg.Midpoints(roundedProjection, context),
        labels = iD.svg.Labels(projection, context),
        traffic = iD.svg.Traffic(roundedProjection, context),
        roadcross = iD.svg.RoadCross(roundedProjection, context),
        roadcrossline = iD.svg.RoadCrossLine(projection, context),
        placename = iD.svg.PlaceName(roundedProjection, context),       //路名信息
        searchpoint = iD.svg.SearchPoint(roundedProjection, context),       //坐标解析定位点
        // detailslope = iD.svg.DetailSlope(roundedProjection, context),       //坡度信息
        // walkzlevel = iD.svg.WalkZlevel(projection, context),       //walkzlevel信息
        effects = iD.svg.Effects(roundedProjection, context),       //门禁信息特效
        // roadzlevel = iD.svg.RoadZLevel(projection, context),
        // speedcamera = iD.svg.SpeedCamera(projection, context),
        // walkLink = iD.svg.WalkLink(projection, context),               //步导线
        // walkEnter = iD.svg.WalkEnter(projection, context),              //步导点
        supersurface, surface, surfaceCanvas,
        mouse,
        mousemove,
        editLevel = 15;

    var _marker;
    var pointlimit = 33500;
    // var checkTopFlag=false;
    // var checkTopCount=0;
    var checkTopTip = false;
    // var checkTopResult=true;
    // var checkTopResultFlag=false;
    function map(selection) {
        zoom.scaleExtent([map.min_zoom(), map.max_zoom()]);

        context.history()
            .on('change.map', redraw);
        // context.background()
        //     .on('change.map', function(){
        //         console.log('backgroun change',arguments);
        //         // redraw
        //     });


        selection.call(zoom);

        supersurface = selection.append('div')
            .attr('id', 'supersurface');
        supersurface.on('mouseup.tag', function () {

            if (context.mode() && context.mode().id == "browse") {
                if (d3.event.target.__data__ && d3.event.target.__data__ instanceof iD.Entity) {
                    return;
                }
                // var x = d3.event.clientX, y = d3.event.clientY;
                context.connection().searchPictureFeatureInfo(0, context.map().extent(), d3.event.offsetX, d3.event.offsetY,
                    context.map().dimensions()[0], context.map().dimensions()[1], function (d, tagFlag) {
                        if (d && d.length > 0 && d[0]) {
                        } else {
                        }
                    });
            }
        });
        supersurface.call(context.background());

        // Need a wrapper div because Opera can't cope with an absolutely positioned
        // SVG element: http://bl.ocks.org/jfirebaugh/6fbfbd922552bf776c16

        surfaceCanvas = supersurface.append('div')
            .attr('id', 'surfaceCanvas')
            .attr('class', 'layer-layer')
            .attr('style', 'z-index: 299;width:100%;height:100%');


        var dataLayer = supersurface.append('div')
            .attr('class', 'layer-layer layer-data')
            .attr('style', 'z-Index: 300');//矢量图层300


        var startXY = null;
        map.surface = surface = dataLayer.append('svg')
            .on('mousedown.zoom', function () {
                context.buriedStatistics().merge(2, 'map');
                if (d3.event.button === 2) {
                    d3.event.stopPropagation();
                }
                iD.picPlayerLogger.mapMouseDrag({
                    'tag': 'map_mousedown',
                    'type': 'click'
                });
                dispatch.movestart({});
                context.event.mousedown(d3.event);
                startXY = [d3.event.clientX, d3.event.clientY];
                dispatch.dragstart({});
                context.event.dragstart(d3.event);
            }, true)
            .on('mouseup.zoom', function () {
                context.buriedStatistics().merge(0, 'map');
                if (!startXY) return;
                iD.picPlayerLogger.mapMouseDrag({
                    'tag': 'map_mouseup',
                    'type': 'click'
                });
                if (resetTransform()) redraw();
                dispatch.moveend({});
                context.event.mouseup(d3.event);
                if (d3.event.clientX != startXY[0] && d3.event.clientY != startXY[1]) {
                    dispatch.dragend({});
                    context.event.dragend(d3.event);
                }
                startXY = null;
            })
            .attr('id', 'surface')
            .call(iD.svg.Surface(context));

        /*map.surfaceCanvas = surfaceCanvas = dataLayer.append('canvas')
            .attr('id', 'CursorLayer');*/

        //dataLayer.append('svg')
        //     .on('mousedown.zoom', function() {
        //         if (d3.event.button === 2) {
        //             d3.event.stopPropagation();
        //         }
        //     }, true)
        //     .on('mouseup.zoom', function() {
        //         if (resetTransform()) redraw();
        //     })
        //     .attr('id', 'surface')
        //     .call(iD.svg.Surface(context));
        //     map.surface = surface =supersurface.select(".background-layer");

        surface.on('mousemove.map', function () {
            mousemove = d3.event;
            mousemove.xy = context.map().mouseCoordinates();
            var pixel = context.projection.projectionPixel(mousemove.xy);
            var scale = context.projection.scale() * 2 * Math.PI;
            var tx = Math.floor((pixel[0] + scale / 2) / 256);
            var ty = Math.floor(-((pixel[1] - scale / 2) / 256));
            mousemove.tile = [tx, ty, map.zoom()];
            context.event.mousemove(mousemove);

            if (startXY && mousemove.clientX != startXY[0] && mousemove.clientY != startXY[1]) {
                dispatch.draging({});
                context.event.draging(d3.event);

            }
        });
        surface.on('mouseover.vertices', function () {
            if (map.editable() && !transformed) {
                var hover = d3.event.target.__data__;
                surface.call(vertices.drawHover, context.graph(), hover, map.extent(), map.zoom());
                dispatch.drawn({ full: false });
            }
        });

        surface.on('mouseout.vertices', function () {
            if (map.editable() && !transformed) {
                var hover = d3.event.relatedTarget && d3.event.relatedTarget.__data__;
                surface.call(vertices.drawHover, context.graph(), hover, map.extent(), map.zoom());
                dispatch.drawn({ full: false });
            }
        });


        context.on('enter.map', function () {
            if (map.editable() && !transformed) {
                var all = context.intersects(map.extent()),
                    filter = d3.functor(true),
                    graph = context.graph();
                layerDrawn(all);
                all = filterWrongDate(all, context);
                surface.call(vertices, graph, all, filter, map.extent(), map.zoom());
                // surface.call(walkEnter,graph, all, filter, map.extent(), map.zoom())
                surface.call(midpoints, graph, all, filter, map.trimmedExtent());
                dispatch.drawn({ full: false });

                drawPoint(d3.functor(true));

                surface.call(pointPathLines, graph, all, d3.functor(true));
            }
        });

        context.event.on('changemap', function () {
            if (map.editable() && !transformed) {
                map.dimensions(selection.dimensions());
            }
        });

        context.ui().layermanager.on('change.map', function (layerInfo, flag) {
            if (flag === 'display') {
                //设置隐藏或不隐藏，重新渲染地图数据
                map.dimensions(selection.dimensions());
            }
            if (layerInfo && layerInfo.name == '轨迹') {
                let $trackcanvas = d3.select('#pic-track-canvas');
                $trackcanvas.style('display', layerInfo.display ? 'block' : 'none');
            } else if (!layerInfo) {
                let $trackcanvas = d3.select('#pic-track-canvas');
                $trackcanvas.style('display', 'block');
            }
        });

        map.dimensions(selection.dimensions());
        showLabel();
    }

    function pxCenter() {
        return [dimensions[0] / 2, dimensions[1] / 2];
    }

    function layerDrawn(al) { //图层隐藏绘制效率问题(可优化)
        for (var p = 0; p < al.length; p++) {
            var type = al[p].modelName;
            if (_.include([iD.data.DataType.SEARCH_POINT, iD.data.DataType.PLACENAME], al[p]._type)) {
                continue;
            }
            //TODO: 由于模型和层的改动导致现在没法实现层抽象对象 需要解决
            var modelConfig = iD.Layers.getLayer(al[p].layerId, al[p].modelName);
            if (!modelConfig || !modelConfig.display) { //|| !iD.Static.layersInfo.isDisplay(type) || !iD.Task.d) {
                al.splice(p, 1);
                p--;
            }
        }
    }


    //垃圾需求
    function showLabel() {
        var label = d3.select("body").append("div")
            .attr('id', '_labelw')
            .classed('hide', true);
        let modelEntity, fields, obj = {};
        modelEntity = iD.ModelEntitys.BARRIER_GEOMETRY;
        let TO_BARRIER_GEOMETRY = iD.Mapping.aboveGround.TO_BARRIER_GEOMETRY;
        try {
            fields = modelEntity.getFields().find(d => { return d.fieldName == 'TYPE' });
            fields.fieldType.fieldTypeValues.forEach(d => {
                obj[d.value] = d.name;
            })
        } catch (e) {
            console.log('万一')
        }
        d3.select(window).on('keyup.map', (key, d) => {
            if (!d3.event.shiftKey && !label.classed('hide'))
                label.classed('hide', true)
        })
        context.surface().on('mousemove.showLabel', function () {
            if (d3.event.shiftKey && d3.event.altKey && d3.event.which == 0) {
                let loc = context.map().mouseCoordinates();
                let tile = iD.util.getTileURL(loc, context._heightZoom);
                if (loc.length == 0 || !tile[0] || !tile[1]) {
                    label.classed('hide', true);
                    return;
                };
                if (!modelEntity) return;
                if (_.isEmpty(obj)) {
                    fields = modelEntity.getFields().find(d => { return d.fieldName == 'TYPE' });
                    fields.fieldType.fieldTypeValues.forEach(d => {
                        obj[d.value] = d.name;
                    })
                }
                let id = tile[0] + '_' + tile[1];
                if (!context.aboveGrounds.hasOwnProperty(id)) {
                    label.classed('hide', true);
                    return;
                };


                let ground = null;
                if (context.catchAboveGround.id == id) {
                    ground = context.catchAboveGround.aboveGround;
                } else {
                    if (!context.aboveGrounds.hasOwnProperty(id)) return z;
                    var buffer = new Uint8Array(context.aboveGrounds[id]);
                    try {

                        var message = context.aboveGroundsPBRoot.decode(buffer);
                        let pixel = message.pixel;
                        let obj = new Map();
                        for (let i = 0; i < pixel.length; i++) {
                            let p = pixel[i];
                            if (obj.has(p.row)) {
                                let v = obj.get(p.row);
                                v.push({ col: p.col, element: p.element });
                            } else {
                                let valuse = [];
                                valuse.push({ col: p.col, element: p.element });
                                obj.set(p.row, valuse);
                            }
                        }
                        context.catchAboveGround.id = id;
                        context.catchAboveGround.aboveGround = obj;
                    } catch (err) {
                        ground = null;
                        console.log("Error: " + err);
                    }
                }


                // let ground = context.aboveGrounds[id];
                if (!ground) {
                    label.classed('hide', true);
                    return;
                }
                let pixel = iD.util.TransformClassTMS.lnglatToPixel(loc[0], loc[1], context._heightZoom);
                // let elements = ground.row[pixel[1]].column[pixel[0]].element;
                // let pixel = pixels[i];
                let row = ground.get(pixel[1]);
                if (!row) {
                    label.classed('hide', true);
                    return;
                };
                let col = row.find(d => { return d.col == pixel[0] });
                if (!col) {
                    label.classed('hide', true);
                    return;
                };
                let elements = col.element;
                if (elements.length) {
                    label.classed('hide', false);
                    let types = _.pluck(elements, 'type');
                    let str = '';
                    let _t;
                    types.forEach(d => {
                        _t = TO_BARRIER_GEOMETRY[d];
                        if (_t) {
                            str = str + ',' + obj[_t];
                        }
                    })
                    label.text(str.substr(1));
                    iD.util.setTransform(label, ...context.map().mouse());
                } else {
                    label.classed('hide', true);
                }
            } else if (!label.classed('hide')) {
                label.classed('hide', true);
            }
        });
    }

    //检查导航图层拓扑关系的正确性
    map.checkTopo = function () {
        var al = context.intersects(map.extent());
        // if(al.length>0&&iD.Layers.getCurrentEnableLayer().type =="road"){
        if (al.length > 0 && iD.Layers.getLayer().type == "road") {
            var checkFlag = false;
            // checkTopResult=true;
            for (var i = 0; i < al.length; i++) {
                var entity = al[i];
                //只对结点和综合交叉点的拓扑关系进行检查
                if ((entity instanceof iD.Node && entity.isRoadNode()) || (entity instanceof iD.Node && entity.isRoadCross())) {
                    if (iD.util.justNodeInPlyGonx(entity, context)) {
                        checkFlag = iD.topo.check().mainCheck(context.graph(), entity);
                    }
                } else if (entity instanceof iD.Way && entity.modelName == iD.data.DataType.HIGHWAY) {
                    if (iD.util.justNodeInPlyGonx(context.graph().entity(entity.first()), context) || iD.util.justNodeInPlyGonx(context.graph().entity(entity.first()), context)) {
                        checkFlag = iD.topo.check().mainCheck(context.graph(), entity);
                    }
                }
                if (checkFlag) {
                    // if(checkTopFlag)
                    console.log("TOPO检查错误");

                    if (!checkTopTip) {
                        checkTopTip = true;
                        Dialog.alert("数据加载不全,请拖动屏幕加载更多数据后作业!", function () {
                            checkTopTip = false;
                        });
                        // checkTopResult=false;
                    }
                    // checkTopFlag=false;
                    break;
                }
            }

        }
    }


    //脏数据的过滤渲染
    function filterWrongDate(all, context) {
        var errMsg = [];
        for (var i = 0; i < all.length; i++) {
            // if(all[i].tags.isnewway&&all[i].tags.isnewway == "true") continue;
            if (all[i] instanceof iD.Way && context.mode().id === 'browse') {
                var flag = false;
                if (all[i].nodes.length < 2) {
                    var str = "返回数据在道路" + all[i].id + "上结点数小于2个";
                    console.warn("结点小于2删除的数据" + all[i].id);
                    //context.replace(iD.actions.DeleteWay(all[i].id));
                    //all = context.intersects(map.extent());
                    all.splice(i, 1);
                    i--;
                    errMsg.push(str);
                    continue;
                }
                //道路上的结点实体没有加载完全，报错
                for (var j = 0; j < all[i].nodes.length; j++) {
                    if (!context.hasEntity(all[i].nodes[j])) {
                        var str = "返回数据在道路" + all[i].id + "上缺少节点:" + all[i].nodes[j];
                        flag = true;
                        console.warn("缺少结点删除的数据" + all[i].id);
                        //context.replace(iD.actions.DeleteWay(all[i].id));
                        //all = context.intersects(map.extent());
                        all.splice(i, 1);
                        i--;
                        errMsg.push(str);
                        break;
                    }
                }
                if (flag) continue;


            }
        }
        // errMsg.length>0&&console.error(errMsg[0]);
        return all;
    }

    function drawVector(difference, extent) {
        var filter, all,
            graph = context.graph();

        if (difference) {
            // 数据相关的操作才会产生difference
            // history里的调用会有difference
            var complete = difference.complete(map.extent());
            all = _.compact(_.values(complete));

            filter = function (d) {
                return d.id in complete;
            };
            //console.log("difference数据加载");
        } else if (extent) {
            all = context.intersects(map.extent().intersection(extent));
            var set = d3.set(_.pluck(all, 'id'));
            filter = function (d) {
                return set.has(d.id);
            };
        } else {
            all = context.intersects(map.extent());
            filter = d3.functor(true);
        }

        // 过滤需要绘制在地图上的全部数据all
        layerDrawn(all);
        all = filterWrongDate(all, context);

        var otherLinesArr = AllButRoadCrossLine(all);
        var roadCrossLineArr = roadCrossLine(all);


        surface
            .call(vertices, graph, all, filter, map.extent(), map.zoom())
            .call(lines, graph, otherLinesArr, filter)
            // .call(walkLink, graph, otherLinesArr, filter)
            // .call(walkEnter,graph, all, filter, map.extent(), map.zoom())
            .call(roadcrossline, graph, roadCrossLineArr, filter)
            .call(areas, graph, all, filter)
            // .call(walkareas, graph, all, filter)
            .call(midpoints, graph, all, filter, map.trimmedExtent());

        if (points.points(context.intersects(map.extent()), pointlimit).length >= pointlimit) {
            surface.select('.layer-hit').selectAll('g.point').remove();
        } else {
            surface.call(points, points.points(all), filter);
        }

        //surface.call(roadcrossline, graph, roadcrossline.roadcrossline(all), filter);
        drawPoint(all, filter);

        surface.call(labels, graph, all, filter, dimensions, !difference && !extent);

        dispatch.drawn({ full: true, difference: difference });

        drawOverlayers();

        surface.call(pointPathLines, graph, all, d3.functor(true));
    }

    function roadCrossLine(all) {
        var roadCrossLinesArr = [];
        all.forEach(function (entity) {
            if (entity._type && entity._type == "roadcrossline") {
                roadCrossLinesArr.push(entity);
            }
        })
        return roadCrossLinesArr;
    }
    function AllButRoadCrossLine(all) {
        var allButRoadCrossLinesArr = [];
        all.forEach(function (entity) {
            if (!entity._type || entity._type !== "roadcrossline") {
                allButRoadCrossLinesArr.push(entity);
            }
        })
        return allButRoadCrossLinesArr;
    }

    var pointPathLines = iD.svg.PointPathLines(projection, context);

    function drawPoint(all, filter) {
        var graph = context.graph();
        /*        var data = (context.intersects(map.extent()));
                data = data.filter(function (value) {
                    var type = value.modelName;
                    if (!iD.Task.working) {
                     return false;
                     }
                    return iD.Static.layersInfo.isDisplay(type);
                });*/
        var data = all;
        if (traffic.traffic(data, pointlimit).length >= pointlimit) {
            surface.select('.layer-hit').selectAll('g.point').remove();
        } else {
            surface.call(traffic, traffic.traffic(data), filter);
        }
        if (roadcross.roadcross(data, pointlimit).length >= pointlimit) {
            surface.select('.layer-hit').selectAll('g.point').remove();
        } else {
            surface.call(roadcross, roadcross.roadcross(data), filter);
            //surface.call(roadcrossline, graph, roadcrossline.roadcrossline(data), filter);
        }

        if (d3.select("#effects-forbid-info")[0][0] != null && d3.select("#effects-forbid-info").classed("active") == true) {
            if (effects.effects(data, pointlimit).length >= pointlimit) {
                surface.select('.layer-hit').selectAll('g.point').remove();
            } else {
                surface.call(effects, effects.effects(data), filter);
            }
        } else {
            //surface.select('.layer-forbidinfo').selectAll().remove();
            surface.call(effects, [], filter);
        }

        // if (roadzlevel.roadzlevel(data, pointlimit).length >= pointlimit) {
        //     surface.select('.layer-hit').selectAll('g.point').remove();
        // } else {
        //     surface.call(roadzlevel, roadzlevel.roadzlevel(data), filter);
        // }
        // if (speedcamera.speedcamera(data, pointlimit).length >= pointlimit) {
        //     surface.select('.layer-hit').selectAll('g.point').remove();
        // } else {
        //     surface.call(speedcamera, speedcamera.speedcamera(data), filter);
        // }
        // 前方交汇
        if (placename.placename(data, pointlimit).length >= pointlimit) {
            surface.select('.layer-hit').selectAll('g.point').remove();
        } else {
            surface.call(placename, placename.placename(data), filter);
        }
        // 搜索定位点
        if (searchpoint.searchpoint(data, pointlimit).length >= pointlimit) {
            surface.select('.layer-hit').selectAll('g.point').remove();
        } else {
            surface.call(searchpoint, searchpoint.searchpoint(data), filter);
        }
        // if (detailslope.detailslope(data, pointlimit).length >= pointlimit) {
        //     surface.select('.layer-hit').selectAll('g.point').remove();
        // } else {
        //     surface.call(detailslope, detailslope.detailslope(data), filter);
        // }
        // if (walkzlevel.walkzlevel(data, pointlimit).length >= pointlimit) {
        //     surface.select('.layer-hit').selectAll('g.point').remove();
        // } else {
        //     surface.call(walkzlevel, walkzlevel.walkzlevel(data), filter);
        // }

    }


    function editOff() {
        var mode = context.mode();
        surface.selectAll('.layer *').remove();
        dispatch.drawn({ full: true });
        if (!(mode && mode.id === 'browse')) {
            context.enter(iD.modes.Browse(context));
        }
    }

    function zoomPan() {
        if (d3.event && d3.event.sourceEvent && d3.event.sourceEvent.type === 'dblclick') {
            // if (!dblclickEnabled) {
            zoom.scale(projection.scale() * 2 * Math.PI)
                .translate(projection.translate());
            return d3.event.sourceEvent.preventDefault();
            // }
        }
        context.buriedStatistics().merge(2, 'map');
        if (Math.log(d3.event.scale / Math.LN2 - 8) < minzoom + 1) {
            iD.ui.flash(context.container())
                .select('.KDSEditor-content')
                .text(t('cannot_zoom'));
            return setZoom(16, true);
        }

        projection
            .translate(d3.event.translate)
            .scale(d3.event.scale / (2 * Math.PI));

        var scale = d3.event.scale / transformStart[0],
            tX = Math.round((d3.event.translate[0] / scale - transformStart[1][0]) * scale),
            tY = Math.round((d3.event.translate[1] / scale - transformStart[1][1]) * scale);

        transformed = true;
        iD.util.setTransform(supersurface, tX, tY, scale);
        queueRedraw();

        dispatch.move(map);
        setTimeout(function () {
            dispatch.zoom(map.zoom());
        }, 300);
        context.event.moveoverview();
        context.event.moveinfowindow();
    }

    function resetTransform() {
        if (!transformed) return false;
        iD.util.setTransform(supersurface, 0, 0);
        transformed = false;
        return true;
    }

    function redraw(difference, extent) {
        // if(iD.User && !iD.User.getRole()) return;
        // if (!surface) return;
        clearTimeout(timeoutId);
        if (!surface) return;
        // If we are in the middle of a zoom/pan, we can't do differenced redraws.
        // It would result in artifacts where differenced entities are redrawn with
        // one transform and unchanged entities with another.
        if (resetTransform()) {
            difference = extent = undefined;
        }

        var zoom = String(~~map.zoom());
        if (surface && surface.attr('data-zoom') !== zoom) {
            surface.attr('data-zoom', zoom)
                .classed('low-zoom', zoom <= map.editableLevel());
        }

        if (!difference && supersurface) {
            supersurface.call(context.background());
        }

        if (map.editable()) {
            //var start = new Date().getTime();//起始时间
            // var connection = context.connection();
            //          connection.on("loaded.map", function(lay, reload){
            //          });
            if (iD.Task && iD.Task.d) {
                context.connection().loadData(projection, dimensions);
                // if (iD.Task.d.tags.branchDataType == '2') {
                // context.loadPLY(projection, dimensions);
                context.loadMaterial(projection, dimensions);
                // }
            }

            drawVector(difference, extent);

            //var end = new Date().getTime();//接受时间
            //console.warn("解析函数运行时间"+(end - start)+"ms");
        } else {
            editOff();
            transaction.resetGraphyInfo();
            drawTransactionOverlayers();
        }

        transformStart = [
            projection.scale() * 2 * Math.PI,
            projection.translate().slice()];

        context.event.moveinfowindow();

        context.storage('s_map_editor_center', map.center());
        context.storage('s_map_editor_zoom', map.zoom());

        return map;
    }

    var timeoutId;

    function queueRedraw() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            redraw();
        }, 300);
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

    map.redraw = redraw;

    map.mouse = function () {
        var e = mousemove || d3.event, s;
        while ((s = e.sourceEvent)) e = s;
        return mouse(e);
    };

    map.invert = function (xy) {
        return projection.invert(xy);
    };

    map.mouseCoordinates = function () {
        return projection.invert(map.mouse());
    };

    map.dblclickEnable = function (_) {
        if (!arguments.length) return dblclickEnabled;
        dblclickEnabled = _;
        return map;
    };

    map.setZoom = function (v, force) {
        setZoom(v, force);
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

    map.pan = function (d) {
        var t = projection.translate();
        t[0] += d[0];
        t[1] += d[1];
        projection.translate(t);
        zoom.translate(projection.translate());
        dispatch.move(map);
        return redraw();
    };

    map.dimensions = function (_) {
        if (!arguments.length) return dimensions;

        var center = map.center();
        dimensions = _;
        surface.dimensions(dimensions);
        // surfaceCanvas.dimensions(dimensions);
        context.background().dimensions(dimensions);
        projection.clipExtent([[0, 0], dimensions]);
        mouse = iD.util.fastMouse(supersurface.node());
        setCenter(center);
        return redraw();
    };


    //关闭左侧面板时候中心点不重绘，防止抖动
    map.closeTabDimensions = function (_) {
        if (!arguments.length) return dimensions;
        //var center = map.center();
        dimensions = _;
        surface.dimensions(dimensions);
        context.background().dimensions(dimensions);
        projection.clipExtent([[0, 0], dimensions]);
        mouse = iD.util.fastMouse(supersurface.node());
        //setCenter(center);
        return redraw();
    };

    map.size = function () {
        return dimensions;
    };

    map.zoomIn = function () {
        return map.zoom(Math.ceil(map.zoom() + 1));
    };
    map.zoomOut = function () {
        return map.zoom(Math.floor(map.zoom() - 1));
    };

    map.center = function (loc) {
        if (!arguments.length) {
            return projection.invert(pxCenter());
        }

        if (setCenter(loc)) {
            dispatch.move(map);
        }

        return redraw();
    };

    map.zoom = function (z) {
        if (!arguments.length) {
            var zoom = Math.max(Math.log(projection.scale() * 2 * Math.PI) / Math.LN2 - 8, 0);
            //转换成整数倍
            return parseInt(zoom, 10);
        }
        var r;
        if (setZoom(z)) {
            dispatch.move(map);
            dispatch.zoom(z);
            r = redraw();
        }

        return r;
    };

    map.zoomTo = function (entity, zoomLimits) {
        var extent = entity.extent(context.graph()),
            zoom = map.extentZoom(extent);
        zoomLimits = zoomLimits || [16, 20];
        map.centerZoom(extent.center(), Math.min(Math.max(zoom, zoomLimits[0]), zoomLimits[1]));
    };

    map.centerZoom = function (loc, z) {
        var centered = setCenter(loc),
            zoomed = setZoom(z);

        if (centered || zoomed) {
            dispatch.move(map);
        }

        return redraw();
    };

    map.centerEase = function (loc) {
        var from = map.center().slice(),
            t = 0,
            stop;

        surface.one('mousedown.ease', function () {
            stop = true;
        });

        d3.timer(function () {
            if (stop) return true;
            map.center(iD.geo.interp(from, loc, (t += 1) / 10));
            return t === 10;
        }, 20);
        return map;
    };

    map.extent = function (_) {
        if (!arguments.length) {
            return new iD.geo.Extent(projection.invert([0, dimensions[1]]),
                projection.invert([dimensions[0], 0]));
        } else {
            var extent = iD.geo.Extent(_);
            map.centerZoom(extent.center(), parseInt(map.extentZoom(extent)));
        }
    };

    map.trimmedExtent = function () {
        var headerY = 60, footerY = 30, pad = 10;
        return new iD.geo.Extent(projection.invert([pad, dimensions[1] - footerY - pad]),
            projection.invert([dimensions[0] - pad, headerY + pad]));
    };

    map.extentZoom = function (_) {
        var extent = iD.geo.Extent(_),
            tl = projection([extent[0][0], extent[1][1]]),
            br = projection([extent[1][0], extent[0][1]]);

        // Calculate maximum zoom that fits extent
        var hFactor = (br[0] - tl[0]) / dimensions[0],
            vFactor = (br[1] - tl[1]) / dimensions[1],
            hZoomDiff = Math.log(Math.abs(hFactor)) / Math.LN2,
            vZoomDiff = Math.log(Math.abs(vFactor)) / Math.LN2,
            // 坐标重复的情况会出现Infinity
            hZoomDiff = hZoomDiff == Infinity || hZoomDiff == -Infinity ? 0 : hZoomDiff,
            vZoomDiff = vZoomDiff == Infinity || vZoomDiff == -Infinity ? 0 : vZoomDiff,
            newZoom = map.zoom() - Math.max(hZoomDiff, vZoomDiff);

        return newZoom;
    };

    map.editable = function () {
        return map.zoom() >= editLevel;
    };

    map.editableLevel = function (_) {
        if (!arguments.length) return editLevel;
        editLevel = _;
        return map;
    }

    map.minzoom = function (_) {
        if (!arguments.length) return minzoom;
        minzoom = _;
        return map;
    };

    map.max_zoom = function (_) {
        if (!arguments.length) return max_zoom;
        max_zoom = 256 * Math.pow(2, _);
        zoom.scaleExtent([this.min_zoom(), max_zoom]);
        return map;
    };
    map.min_zoom = function (_) {
        if (!arguments.length) return min_zoom;
        min_zoom = 256 * Math.pow(2, _);
        return map;
    };
    //高亮并选中元素
    map.lightEntity = function (ids) {
        if (!ids) return;
        if (ids && (typeof ids === 'string')) {
            ids = [ids];
        }
        for (var i = 0; i < ids.length; i++) {
            if (context.hasEntity(ids[i])) {
                context.enter(iD.modes.Select(context, ids)
                    .suppressMenu(true)
                    .newFeature(true));
            } else {
                context.loadEntity(ids[i], false);
            }
        }
    };


    //高亮并选中元素
    map.lightEntities = function (layerid, ids) {
        if (!ids || !layerid) return;
        if (ids && (typeof ids === 'string')) {
            ids = [ids];
        }
        ids.filter(function (d) {
            return context.hasEntity(d) && context.hasEntity(d).layerId == layerid;
        })
        context.enter(iD.modes.Select(context, ids)
            .suppressMenu(true)
            .newFeature(true));
    };

    //高亮并选中元素
    map.removeEntities = function (layerid, ids) {
        if (!ids || !layerid) return;
        // var cLayer = context.layers().getCurrentEnableLayer();
        var cLayer = context.layers().getLayer(layerid);
        var entities, annotation;
        if (layerid != cLayer.id) {
            return;
        }
        if (ids && (typeof ids === 'string')) {
            ids = [ids];
        }
        entities = ids.filter(function (n) {
            return context.hasEntity(n) && context.hasEntity(n).layerId == layerid;
        });

        var action = iD.actions.DeleteMultiple(entities);
        if (entities.length > 1) {
            annotation = t('operations.delete.annotation.multiple', { n: entities.length });

        } else {
            var geometry = context.geometry(entities[0]);
            annotation = t('operations.delete.annotation.' + geometry);
        }

        context.perform(
            action,
            annotation);
    };
    //
    /**
     * 高亮元素
     * @param array(overlayid,....) 覆盖物对象ID
     * @return
     */
    map.lightOverlays = function (overlays) {
        if (!overlays) return;
        if (overlays && (typeof overlays === 'string')) {
            overlays = [overlays];
        }

        var selector = '';
        for (var i = 0; i < overlays.length; i++) {
            if (i != (overlays.length - 1))
                selector += '.' + overlays[i] + ', '
            else
                selector += '.' + overlays[i]
        }
        map._lightselector = selector;
        if (selector == '') surface && surface.selectAll('.hover').classed('hover', false);
        else surface && surface.selectAll(selector).classed('hover', true);
    };


    /**
     * 添加几何覆盖物{marker,polyline,polygon}
     * @param overlayers 覆盖物对象
     * @return
     */
    map.addOverlays = function (overlay, type) {
        // overlayers
        // 此处是否加  rbush 按照二维矩形存储,  快速查询当前范围进行渲染?
        if (overlay instanceof iD.Icon)
            overlayers.icon.push(overlay);
        else if (overlay instanceof iD.Marker)
            overlayers.marker.push(overlay);
        else if (overlay instanceof iD.Polyline)
            overlayers.polyline.push(overlay);
        else if (overlay instanceof iD.Polygon)
            overlayers.polygon.push(overlay);
        else if (overlay instanceof iD.Circle)
            overlayers.circle.push(overlay);
        else if (overlay instanceof iD.TransPolygon)
            overlayers.transactions.push(overlay);
    }

    /**
     * 删除几何覆盖物{marker,polyline,polygon}
     * @param overlayers 覆盖物对象
     * @return
     */
    map.removeOverlays = function (overlay) {
        var o = overlayers;
        if (overlay instanceof iD.Icon)
            o.icon = iD.util.arrayRemove(overlay, o.icon);
        else if (overlay instanceof iD.Marker)
            o.marker = iD.util.arrayRemove(overlay, o.marker);
        else if (overlay instanceof iD.Polyline)
            o.polyline = iD.util.arrayRemove(overlay, o.polyline);
        else if (overlay instanceof iD.Polygon)
            o.polygon = iD.util.arrayRemove(overlay, o.polygon);
        else if (overlay instanceof iD.Circle)
            o.circle = iD.util.arrayRemove(overlay, o.circle);
        else if (overlay instanceof iD.TransPolygon)
            o.transactions = iD.util.arrayRemove(overlay, o.transactions);
    }


    /**
     * 获取几何覆盖物{marker,polyline,polygon}
     * @return Array{ marker : [],polyline : [],polygon : [] }
     */
    map.getOverlays = function (overlaysid) {
        if (!overlaysid) return overlayers;

        if (overlaysid && (typeof overlaysid === 'string')) {
            overlaysid = [overlaysid];
        }
        var array = [];
        //  { marker : [], polyline : [], polygon : [] , circle : [], icon : []};
        overlayers.marker.forEach(function (overlay) {
            overlaysid.forEach(function (id) {
                if (overlay.id == id || overlay == id) array.push(overlay);
            });
        });
        overlayers.polyline.forEach(function (overlay) {
            overlaysid.forEach(function (id) {
                if (overlay.id == id || overlay == id) array.push(overlay);
            });
        });
        overlayers.polygon.forEach(function (overlay) {
            overlaysid.forEach(function (id) {
                if (overlay.id == id || overlay == id) array.push(overlay);
            });
        });
        overlayers.icon.forEach(function (overlay) {
            overlaysid.forEach(function (id) {
                if (overlay.id == id || overlay == id) array.push(overlay);
            });
        });
        overlayers.circle.forEach(function (overlay) {
            overlaysid.forEach(function (id) {
                if (overlay.id == id || overlay == id) array.push(overlay);
            });
        });
        overlayers.transactions.forEach(function (overlay) {
            overlaysid.forEach(function (id) {
                if (overlay.id == id || overlay == id) array.push(overlay);
            });
        });
        return array;
    }

    map.drawOverlayers = function () {
        drawOverlayers();
    }

    var marker = iD.svg.Marker(roundedProjection, context),
        markerIcon = iD.svg.MarkerIcon(roundedProjection, context),
        label = iD.svg.Label(roundedProjection, context),
        polygon = iD.svg.Polygon(projection, context),
        polyline = iD.svg.Polyline(projection, context),
        circle = iD.svg.Circle(roundedProjection, context),
        partRedraw = iD.svg.PartRedraw(projection, context),
        overlayersVertices = iD.svg.overlayers.Vertices(roundedProjection, context),
        transaction = iD.svg.TransactionAreas(projection, context);//事务图层
    overlayers = { marker: [], polyline: [], polygon: [], circle: [], icon: [], transactions: [] };

    map.updateOverlays = function (overlays) {
        if (!overlays) return;
        if (overlays && !overlays.length) {
            overlays = [overlays];
        }

        for (var i = 0; i < overlays.length; i++) {
            if (overlays[i] instanceof iD.Icon)
                partRedraw.resetIcon(surface, overlays[i]);
            else if (overlays[i] instanceof iD.Marker)
                partRedraw.resetMarker(surface, overlays[i]);
            else if (overlays[i] instanceof iD.Polyline)
                partRedraw.resetPolyline(surface, overlays[i]);
            else if (overlays[i] instanceof iD.Polygon)
                partRedraw.resetPolygon(surface, overlays[i]);
        }

    }

    /**
     * 绘制覆盖物{ marker , polygon , polyline , label , icon }
     * @return
     */
    function drawOverlayers() {
        // 当只考虑GDS编辑时，可不用显示overlays提升性能。
        if (!context.options.overlaysApply) return;
        // { marker , polygon , polyline  }
        if (surface) {
            surface.call(marker, overlayers.marker, d3.functor(true));
            surface.call(markerIcon, overlayers.icon, d3.functor(true));
            surface.call(polygon, context.graph(), overlayers.polygon, d3.functor(true));
            surface.call(polyline, context.graph(), overlayers.polyline, d3.functor(true));
            // editor point
            surface.call(overlayersVertices, context.graph(), overlayers.polyline, d3.functor(true), map.extent(), map.zoom(), 'polyline');
            surface.call(overlayersVertices, context.graph(), overlayers.polygon, d3.functor(true), map.extent(), map.zoom(), 'polygon');
            // {circle}
            surface.call(circle, overlayers.circle, d3.functor(true));
            // distance {label , icon }
            surface.call(label, labelIcon(true), d3.functor(true), 'polylabel');
            surface.call(label, labelIcon(false).concat(polygonlabel(false)), d3.functor(true), 'polyicon');
            surface.call(label, polygonlabel(true), d3.functor(true), 'polygonlabel');
            //surface && surface.call( label, polygonlabel(false), d3.functor(true) , 'polyicon' );

            //事务
            surface.call(transaction, context.graph(), overlayers.transactions, d3.functor(true));
        }
    }

    function drawTransactionOverlayers() {
        // 当只考虑GDS编辑时，可不用显示overlays提升性能。
        // if (!context.options.overlaysApply) return;
        // // { marker , polygon , polyline  }
        if (surface) {
            //事务
            surface.call(transaction, context.graph(), overlayers.transactions, d3.functor(true));
        }
    }

    function polygonlabel(clone) {
        var data = [];
        for (var i in overlayers.polygon) {
            var poly = overlayers.polygon[i];
            if (poly.distance) {
                var node = clone ? new Marker({ loc: poly.first().loc }) : poly.first();
                if (!clone) {
                    node.remove = true;
                    node.parent = poly;
                }
                //else
                if (poly.distance) {
                    node.distance = poly.getArea();
                }
                //node.end = poly.last().end;
                //if(clone || poly.last().end)
                data.push(node);
            }
        }
        return data;
    }

    function labelIcon(clone) {
        var data = [];
        for (var i in overlayers.polyline) {
            var poly = overlayers.polyline[i];
            if (poly.distance) {
                var node = clone ? new Marker({ loc: poly.last().loc }) : poly.last();
                if (!clone) {
                    node.remove = true;
                    node.parent = poly;
                }
                else node.distance = poly.distance;
                node.end = poly.last().end;
                if (clone || poly.last().end)
                    data.push(node);
            }
        }
        return data;
    }
    map.drawTansactionEntity = function () {
        var editArea = context.editArea();
        if (_.isEmpty(editArea) || !editArea) {
            return;
        }

        // var range = 'MULTIPOLYGON(((116.52127634 39.96182243,116.52159925 39.96178566,116.52169019 39.96156869,116.52137928 39.96151762,116.52127634 39.96182243)),((116.52142535 39.96140551,116.52173882 39.96145302,116.52184149 39.96120895,116.52152677 39.96115636,116.52142535 39.96140551)))'
        let holes = iD.util.parsePolyStrings(iD.Task.d.tags.range);

        var extent, index;
        for (var k = 0, re = holes.length; k < re; k++) {
            var marks = holes[k];
            if (marks && marks.length > 0) {
                index = 0;
                if (!extent) {
                    extent = iD.geo.Extent(marks[0], marks[0]);
                    index = 1;
                }
                for (var i = index, il = marks.length; i < il; i++) {
                    extent = extent.extend([marks[i], marks[i]]);
                }
            }
        }
        if (extent) {
            this.extent(extent);
        }

        transaction.resetGraphyInfo();
        var transPolygon = new TransPolygon({

            nodes: [], holes: holes, 
            style:{
                "stroke": "#ff0000",
                'opacity': 0.3,
                'stroke-width': 2,
                'stroke-dasharray': '5, 5',
                'fill': '#333333'
            },
            // onDraw: function (element, entity, classed) {

            //     if (entity.type === 'transpolygon') element.style({
            //         "stroke": "#000",
            //         'opacity': 0.6,
            //         'stroke-width': 2,
            //         'stroke-dasharray': '5, 5',
            //         'fill': '#333333'
            //     });
            // }
        });
        iD.Task.d.trans_id = transPolygon.id;
        map.addOverlays(transPolygon);
        map.drawOverlayers();
        if (iD.Task.d.bounds) {
            this.extent(iD.geo.Extent(iD.Task.d.bounds));
            this.setZoom(20);
            //  this.setZoom(this.editableLevel());
        }

        //console.log(context.users[cUseId]);
        // if(iD.Task.d && iD.Task.d.trans_id){
        // context.users['trans-' + cUseId].holes = iD.util.getCurrentTranHoles(context);//  [ context.users[cUseId][iD.Task.d.trans_id] ] || [];
        // context.users['trans-' + cUseId].nodes = nodes;
        // }else{
        //      context.users['trans-' + cUseId].holes = [];
        //      context.users['trans-' + cUseId].nodes = [];
        // }
    }

    //事务方法
    // map.drawTansactionEntity = function () {
    //
    //     //视野范围
    //     var _extent = context.map().extent(), min = _extent[0], max = _extent[1];
    //     var _expand = 0.00003125 ; //视野范围外扩5米 (10米 = 0.000125度)
    //     min[0] -= _expand, min[1] -= _expand ;
    //     max[0] += _expand, max[1] += _expand ;
    //     var p1 = new Point({loc: min}),
    //         p2 = new Point({loc: [min[0], max[1]]}),
    //         p3 = new Point({loc: max}),
    //         p4 = new Point({loc: [max[0], min[1]]});
    //     var nodes = [p1, p2, p3, p4, p1], cUseId = iD.User.getInfo().userid; // context.users.cUseId;
    //
    //     if (!context.users['trans-' + cUseId]) {
    //         var transPolygon = context.users['trans-' + cUseId] = new TransPolygon({
    //             nodes: nodes, holes: context.users[cUseId].holes, onDraw: function (element, entity, classed) {
    //
    //                 if (entity.type === 'transpolygon') element.style({
    //                     "stroke": "#000",
    //                     'opacity': 0.3,
    //                     'stroke-width': 2,
    //                     'stroke-dasharray': '5, 5',
    //                     'fill': '#333333'
    //                 });
    //             }
    //         });
    //         map.addOverlays(transPolygon);
    //         map.drawOverlayers();
    //     }
    //
    //     //console.log(context.users[cUseId]);
    //     // if(iD.Task.d && iD.Task.d.trans_id){
    //         context.users['trans-' + cUseId].holes = iD.util.getCurrentTranHoles(context);//  [ context.users[cUseId][iD.Task.d.trans_id] ] || [];
    //         context.users['trans-' + cUseId].nodes = nodes;
    //     // }else{
    //     //      context.users['trans-' + cUseId].holes = [];
    //     //      context.users['trans-' + cUseId].nodes = [];
    //     // }
    //
    // }
    //容器大小改变需要刷新transaction绘制
    map.contextResize = function () {
        // transaction.resetGraphyInfo();
        // context.map().drawTansactionEntity();
    }
    // map.transactionEvent = function () {
    //     var users = context.users, cUseId = iD.User.getInfo().userid; //context.users.cUseId;
    //     //清空保留的graph 信息，用于重绘边框
    //     transaction.resetGraphyInfo()
    //     context.map().drawTansactionEntity();
    //     context.map().on('move.transaction', null);
    //     context.map().on('move.transaction', function () {
    //         context.map().drawTansactionEntity();
    //     });
    //     d3.select(window).on('resize.transaction', null);
    //     d3.select(window).on('resize.transaction', function () {
    //         // add 窗口改变时清空保留的graph 信息，用于重绘边框
    //         transaction.resetGraphyInfo();
    //         context.map().drawTansactionEntity();
    //     });
    // }
    map.clickTransactionExtent = function (loc) {
        var tran, tempObj = context.users;
        for (var tId in tempObj) {
            if (tId.indexOf('trans') > -1) {
                tran = tempObj[tId];
                for (var hIdx in tran.holes) {
                    if (iD.util.isPointInPolygon({ loc: loc }, { nodes: tran.holes[hIdx] })) return true;
                }
            }
        }
        return false;
    }
    map.hasTransformed = function () {
        return transformed;
    }


    context.event.on("drawoverlayers.event", drawOverlayers);
    // context.connection().on('loading',function(){
    //     // checkTopFlag=false;
    //     //Dialog.alert("数据加载中");
    //     //console.log("数据加载中");

    // });
    /*
    context.connection().on('loaded',function(layer){

        //Dialog.alert("数据加载完成");
        if(layer)
        {
            //console.log(layer);
        }
        if (layer&&layer.isRoad()){
            checkTopFlag=true;
            checkTopCount++;
            checkTopo();
            //console.log("路网数据加载完成");
        }

    });*/
    return d3.rebind(map, dispatch, 'on');
};
