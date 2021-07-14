/*
 * @Author: tao.w
 * @LastEditors: tao.w
 * @Description: 
 * @Date: 2019-04-19 14:17:49
 * @LastEditTime: 2021-05-21 13:24:12
 */


;;
(function (iD) {
    iD = iD || {};
    var color = color ? color : new THREE.Color(1, 1, 1);
    var range = 100;
    var isFollow = true;
    var last_camera_pos;
    var isHistory = iD.util.urlParamHistory();
    var renderFilterLine;
    // 绘制、拖拽时裁剪超出任务范围
    var AUTOCLIP_MODELS = [
        iD.data.DataType.BARRIER_GEOMETRY,
        iD.data.DataType.DIVIDER,
        iD.data.DataType.OBJECT_PL,
        iD.data.DataType.BRIDGE
    ];

    function initPotreeHandle(context, potree) {
        for (let i in iD.PotreeHandle) {
            let d = iD.PotreeHandle[i];
            d.init && d.init(context, potree);
        }
    }

    function execPotreeHandleAll(method) {
        let args = _.toArray(arguments).slice(1);
        for (let i in iD.PotreeHandle) {
            let handle = iD.PotreeHandle[i];
            if (!handle[method]) continue;
            let rst = handle[method].apply(handle, args);
            if (rst != null) {
                return rst;
            }
        }
    }

    function execPotreeHandle(entityType, method) {
        let args = _.toArray(arguments).slice(2);
        let handle = iD.PotreeHandle[entityType];
        if (!handle || !handle[method]) return;
        return handle[method].apply(handle, args);
    }

    // var shapeNode = new THREE.Object3D();
    function moveAnnotation(entity, context) {
        return t('operations.move.annotation.' + entity.geometry(context.graph()));
    }

    function nodeToPotreePoint(node, toScene, graph) {
        let sg = new THREE.SphereGeometry(0.01, 9, 9);
        let sm = new THREE.MeshNormalMaterial();
        let s = new THREE.Mesh(sg, sm);

        let pos = toScene.forward([node.loc[0], node.loc[1]]);
        s.position.set(...pos, node.loc[2]);
        s.scale.set(1, 1, 1);

        return s;
    }

    function locsToPointClound2(locs, toScene) {
        let geometry = new THREE.BufferGeometry();
        let positions = [];
        let colors = [];
        let normals = [];
        let color = new THREE.Color('rgb(255, 0, 0)');
        let n = 1000;

        for (let i = 0; i < locs.length; i++) {
            let loc = locs[i];
            // 点
            let x = loc[0];
            let y = loc[1];
            let z = loc[2];
            let pos = toScene.forward([x, y]);
            positions.push(...pos, z);

            // normals.push(x, y, z);

            // 颜色
            // let vx = (x / n) + 0.5;
            // let vy = (y / n) + 0.5;
            // let vz = (z / n) + 0.5;
            // color.setRGB(vx, vy, vz);
            // color.setRGB(0.5, 0.5, 0.5);
            colors.push(color.r, color.g, color.b);
        }
        // 添加点和颜色
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // geometry.addAttribute('normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        var material = new THREE.PointsMaterial({
            size: 0.2,
            sizeAttenuation: true,
            // vertexColors: THREE.NoColors,
            // vertexColors: THREE.NoColors,
            vertexColors: true,
            // color: 0xffffff,
            // transparent: false,
            opacity: 1,
            fog: false
        });
        /* 批量管理点 */
        var points = new THREE.Points(geometry, material);
        return points;
    }


    function locsToPointClound(locs, toScene) {
        //存放粒子数据的网格
        let geometry = new THREE.Geometry();
        // let positions = [];
        // let colors = [];
        // let normals = [];
        let color = new THREE.Color('rgb(255, 0, 0)');

        for (let i = 0; i < locs.length; i++) {
            let loc = locs[i];
            let pos = toScene.forward([loc[0], loc[1]]);
            geometry.vertices.push(new THREE.Vector3(pos[0], pos[1], loc[2]));
            geometry.colors.push(color);
        }
        var material = new THREE.PointsMaterial({
            size: 10,
            sizeAttenuation: false,
            // vertexColors: THREE.NoColors,
            // vertexColors: THREE.NoColors,
            vertexColors: true,
            color: 0xffffff,
            transparent: false,
            opacity: 1,
            fog: false
        });
        console.log(geometry.vertices.length);
        /* 批量管理点 */
        var points = new THREE.PointCloud(geometry, material);
        return points;
    }

    function wayToPotreeLine(way, toScene, graph) {
        let coordinates = [];

        let min = new THREE.Vector3(Infinity, Infinity, Infinity);
        let wayNodes = graph.childNodes(way);
        if (wayNodes.length > 30) return;
        for (let i = 0; i < wayNodes.length; i++) {
            let loc = wayNodes[i].loc;
            let pos = toScene.forward([loc[0], loc[1]]);

            min.x = Math.min(min.x, pos[0]);
            min.y = Math.min(min.y, pos[1]);
            min.z = Math.min(min.z, loc[2]);

            coordinates.push(...pos, loc[2]);
            if (i > 0 && i < wayNodes.length - 1) {
                coordinates.push(...pos, loc[2]);
            }
        }

        for (let i = 0; i < coordinates.length; i += 3) {
            coordinates[i + 0] -= min.x;
            coordinates[i + 1] -= min.y;
            coordinates[i + 2] -= min.z;
        }

        let positions = new Float32Array(coordinates);

        let lineGeometry = new THREE.BufferGeometry();
        let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        lineGeometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

        let line = new THREE.LineSegments(lineGeometry, material);
        line.position.copy(min);

        return line;
    }
    function polygonToPotreePolygon(way, toScene, graph) {
        let min = new THREE.Vector3(Infinity, Infinity, Infinity);
        let coordinates = [];
        let wayNodes = graph.childNodes(way);
        for (let i = 0; i < wayNodes.length; i++) {
            let loc = wayNodes[i].loc;
            let pos = toScene.forward([loc[0], loc[1]]);

            min.x = Math.min(min.x, pos[0]);
            min.y = Math.min(min.y, pos[1]);
            min.z = Math.min(min.z, loc[2]);

            coordinates.push(...pos, loc[2]);
            if (i > 0 && i < wayNodes.length - 1) {
                coordinates.push(...pos, loc[2]);
            }
        }

        for (let i = 0; i < coordinates.length; i += 3) {
            coordinates[i + 0] -= min.x;
            coordinates[i + 1] -= min.y;
            coordinates[i + 2] -= min.z;
        }

        let positions = new Float32Array(coordinates);

        let lineGeometry = new THREE.BufferGeometry();
        lineGeometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

        let material = new THREE.LineBasicMaterial({ color: color });
        let line = new THREE.LineSegments(lineGeometry, material);
        line.position.copy(min);

        return line;
    }

    function renderFilter(way, context){
        var player = iD.picUtil.player;
        if(way instanceof iD.Way && !way.isArea() && !way.isClosed() && context.variable.renderFilter){
            if(!renderFilterLine.filter(way, player.wayInfo, player.pic_point)){
                return false;
            }
        }

        return true;
    }

    function addPotreePoint(scene, node, toScene, graph) {

        var color = 'rgb(0, 0, 255)';
        if ([iD.data.DataType.LAMPPOST, iD.data.DataType.OBJECT_PT].includes(node.modelName)) {
            color = 'rgb(109, 241, 109)';
        } else if (node.modelName == iD.data.DataType.AUTO_NETWORK_TAG) {
            color = 'rgb(255, 0, 0)';
        }
        let measure = new Potree.Measure({
            pointColor: color
        });
        measure._render = false;
        measure.name = node.id;
        measure.showDistances = false;
        measure.showCoordinates = false;
        measure.maxMarkers = 1;
        measure.modelName = node.modelName;
        measure._key = iD.Entity.key(node);
        measure.draggable = isHistory != true;

        let pos = toScene.forward([node.loc[0], node.loc[1]]);
        measure.addMarker(new THREE.Vector3(pos[0], pos[1], node.loc[2]), { id: node.id, update: false });
        measure._entityId = node.id;
        // scene.addMeasurement(measure);

        return measure;
    }
    function addPotreeLine(scene, way, toScene, graph, context) {
        let wayNodes = graph.childNodes(way);
        var color = 'rgb(255, 255, 0)';
        var pointColor = 'rgb(18, 249, 255)';
        let lineWidth = 0.01;
        let lineType = 0;
        if (way.modelName == iD.data.DataType.BARRIER_GEOMETRY) {
            if (way.tags.TYPE == '1') {
                // color = 'rgb(255,255,0)';
                color = 'rgb(0,255,0)';
            } else {
                color = 'rgb(0,0,255)';
            }
            // lineType = 0;
            lineWidth = context.variable.barrierWidth;
        }
        var measure = new Potree.Measure({
            color: color,
            lineType,
            lineWidth: lineWidth,
            pointColor: pointColor
        });
        measure._render = false;
        measure.closed = false;
        measure.showDistances = false;
        measure.showHeight = false;
        measure.showAngles = false;
        measure.modelName = way.modelName;
        measure.name = way.id;
        measure._key = iD.Entity.key(way);
        // measure._entityId = way.id;
        measure.draggable = isHistory != true;

        for (let i = 0; i < wayNodes.length; i++) {
            let node = wayNodes[i];
            let pos = toScene.forward([node.loc[0], node.loc[1]]);
            measure.addMarker(new THREE.Vector3(pos[0], pos[1], node.loc[2]), { id: node.id, update: false, modelName: node.modelName });
        }
        // scene.addMeasurement(measure);

        return measure;
    }
    function addPotreePolygon(scene, way, toScene, graph) {
        let wayNodes = graph.childNodes(way);
        let measure = new Potree.Measure({
            color: 'rgb(255, 255, 0)',
            lineWidth: 0.01,
            pointColor: 'rgb(227,23,13)',
        });
        measure._render = false;
        measure.closed = false;
        measure.showDistances = false;
        measure.showHeight = false;
        measure.showAngles = false;
        measure.name = way.id;
        measure.showArea = false;
        measure.modelName = way.modelName;
        measure._key = iD.Entity.key(way);
        measure.draggable = isHistory != true;

        for (let i = 0; i < wayNodes.length; i++) {
            let node = wayNodes[i];
            let pos = toScene.forward([node.loc[0], node.loc[1]]);
            measure.addMarker(new THREE.Vector3(pos[0], pos[1], node.loc[2]), { id: node.id, update: false, modelName: node.modelName });
        }
        // scene.addMeasurement(measure);

        return measure;
    }

    // function filterEntity(loc, context) {
    //     var bounds = iD.util.getBounds(loc, range),
    //         allEntities = context.intersects(bounds),
    //         displayLayerIds = [];
    //     var dataType = iD.data.DataType;
    //     //过滤出可显示图层， 用来过滤数据显示
    //     context.layers().getLayers().forEach(function (lay) {
    //         lay.display && displayLayerIds.push(lay.id);
    //     });
    //     allEntities = editor.context.graph().base().entities;
    //     //数据过滤，过滤出符合条件数据返回
    //     var result = allEntities.filter(function (datum) {
    //         let w = datum instanceof iD.Way &&
    //             _.include(displayLayerIds, datum.layerId + "") &&
    //             _.include([
    //                 dataType.DIVIDER,
    //                 dataType.TRAFFICSIGN,
    //                 dataType.OBJECT_PL,
    //                 dataType.OBJECT_PG,
    //                 dataType.ROAD_FACILITIES,
    //                 dataType.BRIDGE,
    //                 dataType.TRAFFICLIGHT
    //             ], datum.modelName);
    //         let n = datum instanceof iD.Node &&
    //             _.include(displayLayerIds, datum.layerId + "") &&
    //             _.include([
    //                 dataType.OBJECT_PT,
    //                 dataType.LAMPPOST,
    //                 dataType.LIMITHEIGHT,
    //             ], datum.modelName);
    //         return w || n;
    //     });
    //     showEntitys = _.pluck(result, 'id');
    //     return result;
    // }

    var dataType = iD.data.DataType;
    let pointEntity = [dataType.LAMPPOST];

    var mouseTooleType = [
        dataType.DIVIDER,
        dataType.TRAFFICSIGN,
        dataType.BARRIER_GEOMETRY,
        dataType.LAMPPOST,
        dataType.OBJECT_PT,
        dataType.OBJECT_PL,
        dataType.TRAFFICSIGN_NODE,
        dataType.TRAFFICLIGHT_NODE,
        iD.data.DataType.ROAD_FACILITIES,
        iD.data.DataType.ROAD_FACILITIES_NODE,
        dataType.PAVEMENT_DISTRESS_PL,
        'Distance',
        dataType.OBJECT_PG_NODE,
        dataType.OBJECT_PG
    ];

    var area_type = [
        iD.data.DataType.TRAFFICSIGN,
        iD.data.DataType.ROAD_FACILITIES,
        iD.data.DataType.OBJECT_PG,
        iD.data.DataType.TRAFFICLIGHT
    ];

    var update_pic = _.debounce(function (index) {
        _pic.locateFrameByIndex(index);
    }, 150);
    let workerEntityId;

    iD.PotreeConversion = class testEvent extends THREE.EventDispatcher {

        constructor(viewer, context) {
            super();
            renderFilterLine = iD.util.EntityRenderFilterLine(context);
            last_camera_pos = null;

            this.viewer = viewer;
            this.scene = new THREE.Scene();
            viewer.inputHandler.addInputListener(this);
            // this.addEventListener("drag", this.drag);
            this.addEventListener("drop", this.drop);
            this.addEventListener("marker_dropped", this.marker_dropped);
            this.addEventListener("edge_click", this.lineClick);

            this.initPotreeHandleEvent();
            this.addMouseEventListener();

            this.CONSTANT = {
                GEOMETRY_ADD_NODE: 'GEOMETRY_ADD_NODE'
            }

            this.viewer.addEventListener('measure_added', this.measureAdded.bind(this));
            this.viewer.addEventListener('line_marker_added', this.measureGeometryAddNode.bind(this));

            // this.toScene = null;
            this.showEntitys = [];
            this.toMap = null;
            this.isInitEvent = false;
            this.drawing = false;
            this.isStaticLidarIndex = false;
            this.drawTempNodeArr = [];
            this.rectFeature = null;
            this.history_change = _.debounce((difference, extent) => {
                if (!difference) {
                    this.entityTOpotree(this.context, this.viewer);
                    return;
                }

                let comp = difference.complete();
                if (comp[workerEntityId]) {
                    workerEntityId = '';
                    return;
                }
                // let values = Object.values(comp);
                // for (let i = 0; i < values.length; i++) {
                //     let v = values[i];
                //     if (v && (v instanceof iD.Way)) {
                //         let measure = this.entityTomeasure(v);
                //         this.removeMeasurement(measure)
                //     }
                // }
                // this.entityTOpotree(this.context, this.viewer);
            }, 250);

            this.context = context;

            // if (context.ui().LoadProtocol) {
            //     var lastPB;
            //     context.ui().LoadProtocol.on('loaded.potree_conversion', function (grids) {
            //         if (lastPB) {
            //             viewer.scene.scene.remove(lastPB);
            //             lastPB = null;
            //         }
            //         if (!grids) return;
            //         var points = (grids.gridPoints || []);
            //         // var toScene = proj4(proj4.defs("WGS84"), "+proj=utm +zone=50 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");

            //         var points = locsToPointClound2(points.map(function (d) {
            //             let loc = [d.lon, d.lat, d.height];
            //             return loc;
            //         }), toScene);
            //         lastPB = points;
            //         viewer.scene.scene.add(points);
            //         // console.log('protocol added');
            //     });
            // }
            // viewer.addEventListener("update", this.update.bind(this));
            // viewer.addEventListener("render.pass.perspective_overlay", this.render.bind(this));
            // viewer.addEventListener("scene_changed", this.onSceneChange.bind(this));

            initPotreeHandle(context, this);
        }
        // 处理potreeHandle事件
        initPotreeHandleEvent() {
            // 拖拽判断
            let _downMouse, _mouseDrag = false;
            this.addEventListener("marker_dragStart", function (d) {
                _downMouse = d.drag.start.clone();
                _mouseDrag = false;
            });
            this.addEventListener("drag", function (d) {
                let mouse = d.drag.end.clone();
                if (_downMouse && !mouse.equals(_downMouse)) {
                    if (!_mouseDrag) {
                        execPotreeHandleAll('onDragStart', d, _downMouse);
                    }
                    _mouseDrag = true;
                    execPotreeHandleAll('onDrag', d, mouse);
                }
                // console.log('drag', d);
            });
            this.addEventListener("marker_dropped", function (d) {
                if (_downMouse && _mouseDrag) {
                    let mouse = (d.drag && d.drag.end || d.mouse).clone();
                    execPotreeHandleAll('onDragEnd', d, mouse);
                }
                _downMouse = null;
                _mouseDrag = false;
            });

        }
        /**
         * 鼠标事件`
         * MOUSEDOWN、MOUSEUP、MOUSEMOVE、MOUSECLICK、MOUSEDBLCLICK
         * mousedown、mouseup、mousemove、mouseclick、mousedbclick
         */
        addMouseEventListener() {
            let button_type = {
                0: 'player',
                2: 'check'
            };
            //          记录鼠标点击事件，区分左右键，鼠标像素位置变化
            this.addEventListener('MOUSEDOWN', function (data) {
                let _button = data ? data.event.button : null,
                    _coordinate = null,
                    _layer = null,
                    entityId = '',
                    measureName = viewer.measuringTool.measureName,
                    _point = [data.event.layerX, data.event.layerY],
                    _tag = null;
                if (!data.object) {
                    this.context.buriedStatistics().merge(2, 'pcloud');
                } else if (data.object.object.parent.name) {
                    let entity = this.context.hasEntity(data.object.object.parent.name);
                    let modelName = entity ? entity.modelName : data.object.object.parent.name;
                    this.context.buriedStatistics().merge(1, modelName);
                } else {
                    console.log('点云埋点问题');
                }
                if (!data.object && button_type[_button]) {
                    /*视频拖拽事件*/
                    _tag = 'potree_' + button_type[_button] + '_start';
                    console.log(_tag)
                    iD.picPlayerLogger.potreeHandle({
                        'tag': _tag,
                        'point_coordinate': _point,
                        'linkage_type': _pic._linkage_pcloud
                    })
                } else if (data.object && !measureName) {
                    /*拖拽要素*/
                    _layer = this.context.hasEntity(data.object.object.name);
                    _tag = _layer ? 'drag_' + _layer.modelName + '_start' : '';
                    _coordinate = [data.object.point.x, data.object.point.y, data.object.point.z];
                    _tag && iD.picPlayerLogger.potreeHandle({
                        'tag': _tag,
                        'modelName': _layer.modelName,
                        'coordinate': _coordinate,
                        'entityId': _layer.osmId() || '',
                        'key': 'click',
                        'linkage_type': _pic._linkage_pcloud
                    })
                }
            });
            this.addEventListener('MOUSEMOVE', function (data) {
                //                 console.log(data, data.object);
            });
            this.addEventListener('MOUSEUP', function (data) {
                //              console.log(data, data.object);
                let _button = data ? data.event.button : null,
                    _coordinate = null,
                    _layer = null,
                    entityId = '',
                    measureName = viewer.measuringTool.measureName,
                    _point = [data.event.layerX, data.event.layerY],
                    _tag = null;
                if (!data.object) {
                    this.context.buriedStatistics().merge(2, 'pcloud');
                } else if (data.object.object.parent.name) {
                    let entity = this.context.hasEntity(data.object.object.parent.name);

                    let modelName = entity ? entity.modelName : data.object.object.parent.name;
                    this.context.buriedStatistics().merge(1, modelName);
                } else {
                    console.log('点云埋点问题');
                }
                if (!data.object && button_type[_button]) {
                    _tag = 'potree_' + button_type[_button] + '_end';
                    /*视频拖拽事件*/
                    iD.picPlayerLogger.potreeHandle({
                        'tag': _tag,
                        'point_coordinate': _point,
                        'linkage_type': _pic._linkage_pcloud
                    })
                } else if (data.object && !measureName) {
                    /*拖拽要素绘制过程中事件*/
                    _layer = this.context.hasEntity(data.object.object.name);
                    _tag = _layer ? 'drag_' + _layer.modelName + '_end' : '';
                    measureName = _layer ? _layer.modelName : '';
                    entityId = _layer ? _layer.osmId() : '';
                    _coordinate = [data.object.point.x, data.object.point.y, data.object.point.z];
                } else if (data.object && measureName) {
                    _tag = 'add_' + measureName;
                    _coordinate = [data.object.point.x, data.object.point.y, data.object.point.z];
                }
                if (data.object && _tag) {
                    iD.picPlayerLogger.potreeHandle({
                        'tag': _tag,
                        'modelName': measureName,
                        'coordinate': _coordinate,
                        'entityId': entityId || '',
                        'key': 'click',
                        'linkage_type': _pic._linkage_pcloud
                    })
                }
				iD.UserJobHeartbeat.setJobStatus();
            });
            this.addEventListener('MOUSECLICK', function (data) {
                //              console.log(data, data.object);
            });
            this.addEventListener('MOUSEDBLCLICK', function (data) {
                //                 console.log(data, data.object);
            });
            //          记录鼠标滚轮缩放事件
            this.addEventListener('MOUSEWHEEL', function (data) {
                let _tag = data.delta ? 'potree_check_enlarge' : 'potree_check_narrow';
                this.context.buriedStatistics().merge(2, 'pcloud');
                iD.picPlayerLogger.potreeHandle({
                    'tag': _tag,
                    'linkage_type': _pic._linkage_pcloud
                })
            });
            this.addEventListener('mousewheel', function(data){
                this.context.buriedStatistics().merge(2, 'pcloud');
            	// let _tag = data.delta ? 'potree_check_enlarge' : 'potree_check_narrow';
            	// iD.picPlayerLogger.potreeHandle({
            	// 	'tag': _tag,
            	// 	'linkage_type': _pic._linkage_pcloud
            	// })
            });
        }
        /**
         * 根据showEntitys里存的范围显示数据id重置potree中shapes,不在范围内删除
         */
        resetPotreeShapes() {
            let measurements = this.viewer.scene.getMeasurements();
            let removes = [];
            for (let i = 0; i < measurements.length; i++) {
                let measurement = measurements[i];
                if (!this.showEntitys.includes(measurement.name)) {
                    removes.push(measurement);
                }
            }

            for (let i = 0; i < removes.length; i++) {
                this.viewer.scene.removeMeasurement(removes[i]);
            }
            removes.length = 0;
        }

        //因为增加了延迟处理，所以不能做时时差分， 只能做全量处理
        historyChange(difference, extent) {
            // if(!difference && extent){
            //     this.entityTOpotree(this.context,this.viewer);
            // }

            this.entityTOpotree(this.context, this.viewer);
            // console.log('change.potree', difference);
        }

        getCameraLoc(viewer) {
            let camera = viewer.scene.cameraP;

            let pPos = new THREE.Vector3(0, 0, 0).applyMatrix4(camera.matrixWorld);
            let pRight = new THREE.Vector3(600, 0, 0).applyMatrix4(camera.matrixWorld);
            let pUp = new THREE.Vector3(0, 600, 0).applyMatrix4(camera.matrixWorld);
            let pTarget = viewer.scene.view.getPivot();

            let toCes = (pos) => {
                let xy = [pos.x, pos.y];
                let height = pos.z;
                let deg = toMap.forward(xy);
                deg.push(height);
                return deg;
            };

            let cPos = toCes(pPos);
            let cUpTarget = toCes(pUp);
            let cTarget = toCes(pTarget);
            return { cPos, cUpTarget, cTarget };
        }
        //绘制路牌（三角、矩形、圆形、八角）
        drawSigns(type) {
            this.removeTempNode();
            this.setMouseTool(type);
        }
        //绘制地面区域
        drawGroundArea() {
            this.removeTempNode();
            this.setMouseTool(iD.data.DataType.OBJECT_PG_NODE);
        }
        /**
         * 计算旋转轴（叉乘计算法向量）
         * parm v2、v1表示不同方向的向量
         * return 法向量
         */
        crossProduct(v2, v1) {
            // var c = new THREE.Vector3();

            // c.x = v2.y * v1.z - v2.z * v1.y;
            // c.y = v2.z * v1.x - v2.x * v1.z;
            // c.z = v2.x * v1.y - v2.y * v1.x;

            // return c;
            return v2.cross(v1);
        }
        /***
         * 计算向量D
         * 
         */
        vector(cross, loc) {
            return (cross.x * loc.x + cross.y * loc.y + cross.z * loc.z);
        }

        /**
         * 画BoundingBox
         * @param {*} 
         */
        drawBoundingBox(polygon, type, R) {
            var nodes = [], entityIds = [];
            // console.log("polygon", polygon);
            var NODE_MODEL_NAME = iD.data.DataType.TRAFFICSIGN_NODE;
            var WAY_MODEL_NAME = iD.data.DataType.TRAFFICSIGN;
            var text = '绘制路牌';
            if (type == 'trafficlight') {
                NODE_MODEL_NAME = iD.data.DataType.TRAFFICLIGHT_NODE;
                WAY_MODEL_NAME = iD.data.DataType.TRAFFICLIGHT;
                text = '绘制交通灯';
            }else if(type == 'road_facilities'){
                NODE_MODEL_NAME = iD.data.DataType.ROAD_FACILITIES_NODE;
                WAY_MODEL_NAME = iD.data.DataType.ROAD_FACILITIES;
                text = '绘制桥立面';
			}

            var layer = iD.Layers.getCurrentModelEnableLayer(NODE_MODEL_NAME);
            var pgLayer = iD.Layers.getCurrentModelEnableLayer(WAY_MODEL_NAME);
            var actions = [];
            let invertMatrix = R.getInverse(R);
            let isOutBound = false;
            let lnglats = [];
            for (var l = 0; l < polygon.length; l++) {
                var IM = invertMatrix.clone();
                // IM = IM.transpose();
                var loc = polygon[l];
                var t = new THREE.Vector3(loc[0], loc[1], loc[2]);
                var v = t.applyMatrix3(IM);
                // console.log('逆矩阵之后：', v)
                var lnglat = toMap.forward([v.x, v.y, v.z]);
                lnglats.push(lnglat);
                // console.log("矩形框：", lnglat);
                if (l == 0 && iD.util.pointNotInPlyGonx(lnglat, this.context)) {
                    isOutBound = true;
                    break;
                }
                // nodes.push(iD.Node({
                //     layerId: layer.id,
                //     modelName: NODE_MODEL_NAME,
                //     identifier:layer.identifier,
                //     loc: lnglat,
                //     tags: iD.util.getDefauteTags(NODE_MODEL_NAME, layer),
                // }));
                // actions.push(...[
                //     iD.actions.AddEntity(nodes[nodes.length - 1])
                // ]);
            }
            if (isOutBound) {
                this.context.enter(iD.modes.Browse(this.context));
                this.removeTempNode();
                // 面第一个点，超出范围
                Dialog.alert("绘制要素超出任务范围");
                return;
            }
            //TODO  需要改， 不能这样用全局判断
            if(iD.picUtil.player){
                let state = iD.util.getCoordinatesClockWise(iD.picUtil.player.allNodes,lnglats);
                if(state === 1 ){
                    lnglats.reverse();
                }
            }
			
            var rect_tags = iD.util.getDefauteTags(WAY_MODEL_NAME, pgLayer);

            if (WAY_MODEL_NAME == 'ROAD_FACILITIES') {
                rect_tags.DIRECTION = '1';
                lnglats = _.sortBy(lnglats, function(item) {
                    return -item[2];
                });
                lnglats[2] = [
                    lnglats[1][0],
                    lnglats[1][1],
                    lnglats[2][2]
                ];
                lnglats[3] = [
                    lnglats[0][0],
                    lnglats[0][1],
                    lnglats[3][2]
                ];

            }
            for (let i = 0; i < lnglats.length; i++) {
                nodes.push(iD.Node({
                    layerId: layer.id,
                    modelName: NODE_MODEL_NAME,
                    identifier: layer.identifier,
                    loc: lnglats[i],
                    tags: iD.util.getDefauteTags(NODE_MODEL_NAME, layer),
                }));
                actions.push(...[
                    iD.actions.AddEntity(nodes[nodes.length - 1])
                ]);
            }
            
            var rect = iD.Way({
                layerId: pgLayer.id,
                identifier:pgLayer.identifier,
                modelName: WAY_MODEL_NAME,
                nodes: _.map(nodes, 'id').concat(nodes[0].id),
                tags: rect_tags
            });

            //var fieldPlane = iD.picUtil.getEntityPlaneParam(nodes[0].loc, iD.picUtil.player.selectPicIndex);
            // var fieldPlane = nodes[0].loc[1] + ',' + nodes[0].loc[0] + ',' + nodes[0].loc[2] + ',' + C[0] + ',' + C[1] + ',' + C[2];
            var fieldPlane = nodes[0].loc[1] + ',' + nodes[0].loc[0] + ',' + nodes[0].loc[2] + ',' + R.elements[6] + ',' + R.elements[7] + ',' + R.elements[8];
            rect.tags.PLANE = fieldPlane;
            entityIds.push(rect.id);
            if (type == 'triangle') {
                rect.tags.SHAPE = "1";
            } else if (type == 'circle') {
                rect.tags.SHAPE = "3";
            } else if (type == 'rect') {
                rect.tags.SHAPE = "2";
            } else if (type == 'octagon') {
                rect.tags.SHAPE = "4";
            }
            actions.push(...[
                iD.actions.AddEntity(rect)
            ]);
            actions.push(text);

    		//点云视频界面新增路牌埋点
	    	iD.picPlayerLogger.potreeHandle({
	    		'tag': 'add_'+type+'_end',
	    		'modelName': rect.modelName,
	    		'entityId': rect.osmId() || '',
	    		'key': 'click',
	    		'linkage_type': _pic._linkage_pcloud
            })
            
            if (WAY_MODEL_NAME == iD.data.DataType.TRAFFICSIGN) {
                this.createSignpostTagEditor(rect, nodes, false);
            }


            this.context.perform.apply(this, actions);
            this.context.enter(iD.modes.Browse(this.context));
            this.context.event.entityedite({
                entitys: entityIds
            });
            
            this.removeTempNode();
        }
        //激光创建、修改路牌时，在批量路牌修改时用到
        createSignpostTagEditor(entity, nodes, isCut){
            var locs = _.pluck(nodes, 'loc');

            let player = iD.picUtil.player;
            let picData = iD.AutoMatch.locsToPicPlayer(locs, player, null, player.pic_point.id);
            var arr = _.pluck(_.flatten(picData), 'coordinates');
            for(let i = 0; i < arr.length; i++) {
                arr[i] = arr[i][0];
            }
            // arr = arr.reverse();
            iD.util.cutPic(arr, entity.id, this.context, isCut, false);
        }
        createObjectPG(){

            execPotreeHandle(iD.data.DataType.OBJECT_PG, 'createObjectPG', this.drawTempNodeArr);
            this.removeTempNode();
        }

        createSign(type) {
            var drawclick = [];

            for (let i = 0; i < this.drawTempNodeArr.length; i++) {
                // console.log('转换前经纬度：', locs[i]);
                let n = this.drawTempNodeArr[i];
                if (!n) return;
				if (type == 'triangle' || type == 'circle' || type == 'rect' || type == 'octagon') {
					if(isNaN(n.loc[0]) || isNaN(n.loc[1]) || isNaN(n.loc[2])) {
						Dialog.alert('绘制路牌转换经纬度时失败：NaN！');
						console.log(n)
						return;
					}
				}
                let utm = iD.util.LLtoUTM_(n.loc[0], n.loc[1]);
                utm.zone = n.loc[2];
                drawclick.push(new THREE.Vector3(utm.x, utm.y, utm.zone));
                // console.log('转换前：', utm);
            }
            //计算法向量
            let v1 = new THREE.Vector3(
                drawclick[0].x - drawclick[1].x,
                drawclick[0].y - drawclick[1].y,
                drawclick[0].z - drawclick[1].z
            );
            let v2 = new THREE.Vector3(
                drawclick[0].x - drawclick[2].x,
                drawclick[0].y - drawclick[2].y,
                drawclick[0].z - drawclick[2].z
            );
            let rotationAxis = this.crossProduct(v2, v1);//法向量
            // console.log("法向量:", rotationAxis);
            let rotationAxis_normal = rotationAxis.normalize();
            // console.log("归一化：",rotationAxis_normal);
            let D = -(this.vector(rotationAxis_normal, drawclick[0]));
            // console.log('D:', D);
            var R = new THREE.Matrix3();
            R.set(rotationAxis_normal.y, -(rotationAxis_normal.x), 0, 0, 0, 1, rotationAxis_normal.x, rotationAxis_normal.y, rotationAxis_normal.z);
            // console.log('R:', R);

            var vectors = [];
            for (let j = 0; j < drawclick.length; j++) {
                let utm = drawclick[j];
                var RT = R.clone();
                // RT = RT.transpose();
                // console.log("utm:", utm);
                // console.log("RT:", RT);
                var v = utm.applyMatrix3(RT);//3D转2D
                vectors.push(v);
                // console.log('转换后：', v);
            }
            if (type == 'triangle') {
                this.drawTriangle(vectors, type, R, D, matrix.cross([v2.x, v2.y, v2.z], [v1.x, v1.y, v1.z]));
            } else if (type == 'circle') {
                this.drawCircle(vectors, type, R, D, matrix.cross([v2.x, v2.y, v2.z], [v1.x, v1.y, v1.z]));
            } else if (type == 'rect' || type == 'road_facilities') {
                this.drawRect(vectors, type, R, D, matrix.cross([v2.x, v2.y, v2.z], [v1.x, v1.y, v1.z]));
            } else if (type == 'trafficlight') {
                // this.drawRect(vectors, type, R, D, matrix.cross([v2.x, v2.y, v2.z], [v1.x, v1.y, v1.z]));
                this.drawTriangle(vectors, type, R, D, matrix.cross([v2.x, v2.y, v2.z], [v1.x, v1.y, v1.z]));
            } else if (type == 'octagon') {
                this.drawOctagon(vectors, type, R, D, matrix.cross([v2.x, v2.y, v2.z], [v1.x, v1.y, v1.z]));
            }

        }
        //绘制三角形路牌
        drawTriangle(vectors, type, R, D) {
            let geometry = new THREE.Geometry();
            geometry.vertices = vectors;
            geometry.computeBoundingBox();
            //画矩形
            var max = geometry.boundingBox.max, min = geometry.boundingBox.min;
            if (max.x < 0 && min.x < 0) {//顺时针绘制
                var polygon = [
                    [max.x, max.y, -D],//保持绘制左上角是第一个点
                    [min.x, max.y, -D],
                    [min.x, min.y, -D],
                    [max.x, min.y, -D]                    
                    ];
            } else {//逆时针绘制
                var polygon = [
                    [min.x, max.y, -D],//保持绘制左上角是第一个点
                    [max.x, max.y, -D],
                    [max.x, min.y, -D],
                    [min.x, min.y, -D]];
            }
            // var polygon = [
            // [min.x, max.y, -D],//保持绘制左上角是第一个点
            // [max.x, max.y, -D],
            // [max.x, min.y, -D],
            // [min.x, min.y, -D]];
            this.drawBoundingBox(polygon, type, R);
        }
        //绘制圆形路牌
        drawCircle(vectors, type, R, D) {
            var circle = iD.util.get3DPointsCenter(vectors),
                center = circle.position,
                r = circle.r;
            var minX = center[0] - r,
                minY = center[1] - r,
                maxX = center[0] + r,
                maxY = center[1] + r;

            var boundingBox = {
                min: {
                    x: minX,
                    y: minY
                },
                max: {
                    x: maxX,
                    y: maxY
                }
            }
            var max = boundingBox.max, min = boundingBox.min;
            if (max.x < 0 && min.x < 0) {//顺时针绘制
                var polygon = [
                    [max.x, max.y, -D],//保持绘制左上角是第一个点
                    [min.x, max.y, -D],
                    [min.x, min.y, -D],
                    [max.x, min.y, -D]                    
                    ];
            } else {//逆时针绘制
                var polygon = [
                    [min.x, max.y, -D],//保持绘制左上角是第一个点
                    [max.x, max.y, -D],
                    [max.x, min.y, -D],
                    [min.x, min.y, -D]];
            }
            // var polygon = [
            // [min.x, max.y, -D],//保持绘制左上角是第一个点
            // [max.x, max.y, -D],
            // [max.x, min.y, -D],
            // [min.x, min.y, -D]];
            this.drawBoundingBox(polygon, type, R);
        }
        //绘制矩形路牌
        drawRect(vectors, type, R, D) {
            var polygon = [[vectors[0].x, vectors[0].y, -D],
            [vectors[1].x, vectors[1].y, -D],
            [vectors[2].x, vectors[2].y, -D],
            [vectors[3].x, vectors[3].y, -D]];
            this.drawBoundingBox(polygon, type, R);
        }
        //绘制八边形路牌
        drawOctagon(vectors, type, R, D) {
            var max = [vectors[0].x, vectors[0].y], min = [vectors[0].x, vectors[0].y];
            for (var i = 0; i < vectors.length; i++) {
                var v = vectors[i],
                    maxX = Math.max(max[0], v.x),
                    maxY = Math.max(max[1], v.y),
                    minX = Math.min(min[0], v.x),
                    minY = Math.min(min[1], v.y),
                    max = [maxX, maxY];
                min = [minX, minY];

            }
            if (max[0] < 0 && min[0] < 0) {//顺时针绘制
                var polygon = [
                    [max[0], max[1], -D],//保持绘制左上角是第一个点
                    [min[0], max[1], -D],
                    [min[0], min[1], -D],
                    [max[0], min[1], -D]                    
                    ];
            } else {//逆时针绘制
                var polygon = [
                    [min[0], max[1], -D],
                    [max[0], max[1], -D],
                    [max[0], min[1], -D],
                    [min[0], min[1], -D]];
            }
            // var polygon = [
            // [min[0], max[1], -D],
            // [max[0], max[1], -D],
            // [max[0], min[1], -D],
            // [min[0], min[1], -D]];
            this.drawBoundingBox(polygon, type, R);
        }
        //删除绘制临时节点
        removeTempNode() {
            this.drawTempNodeArr.forEach((d) => {
                this.removeMeasurement(d.measure);
            });
            this.drawTempNodeArr = [];
        }
        setMouseTool(type, isPoint = false) {
            // 绘制时单击，偶尔出现视频跳帧的问题；
            last_camera_pos = this.getCameraLoc(this.viewer).cPos;
            this.drawing = false;

            let inn = mouseTooleType.includes(type);
            var constant = this.CONSTANT;
            var showDistances = 'Distance' == type ? true : false;
            if (type == constant.GEOMETRY_ADD_NODE) {
                this.viewer.measuringTool.startInsertion({
                    showDistances: false,
                    showAngles: false,
                    showCoordinates: true,
                    showArea: false,
                    closed: false,
                    maxMarkers: 1,
                    name: 'add_node'
                });
                inn = false;
            }
            if (!inn) return;
            this.drawing = true;
            let area = area_type.includes(type);
            if ([dataType.OBJECT_PT, dataType.LAMPPOST, dataType.TRAFFICSIGN_NODE, dataType.TRAFFICLIGHT_NODE, dataType.OBJECT_PG_NODE, dataType.ROAD_FACILITIES_NODE].includes(type) || isPoint) {
                this.viewer.measuringTool.startInsertion({
                    showDistances: false,
                    showAngles: false,
                    showCoordinates: false,
                    showArea: false,
                    closed: true,
                    maxMarkers: 1,
                    name: type
                });
            } else {
                this.viewer.measuringTool.startInsertion({
                    closed: area,
                    showDistances: showDistances,
                    showHeight: false,
                    showCoordinates: false,
                    showArea: false,
                    showAngles: false,
                    name: type,
                    color: 'rgb(255, 0, 0)',
                    pointColor: 'rgb(227, 23, 13)'
                });
            }
        }

        /**
         * 鼠标点击线事件
         * @param {*} e 
         */
        lineClick(e) {
            if (e.button === THREE.MOUSE.LEFT) {
                if (e.measure) {
                    var id = e.measure.name;
                    if (this.context.hasEntity(id)) {
                        this.context.enter(iD.modes.Select(this.context, [id]));
                    }
                }
            }
        }

        /**
         * 鼠标拖拽节点事件
         * @param {*} e 
         */
        marker_dropped(e) {
            // window._measuringTool = this.measuringTool;
            let dragObject = e.drag.object;
            // console.log('marker_dropped', dragObject.name)
            if (!dragObject || this.drawing || dragObject.name == '') return;
            let entity = this.context.hasEntity(dragObject.name);
            if (!entity) {
                console.log('激光拖拽无对应数据');
                return;
            }
            if (!entity.layerId || !iD.Layers.getLayerById(entity.layerId).editable) {
                this.updateNodeMeasurement(entity);
                return;
            }
            this.context.enter(iD.modes.Select(this.context, [entity.id]));
            if (e.drag.start.equals(e.drag.end)) {
                resetNodeLoc();
                return;
            }

            var graph = this.context.graph();
            var parentWay = graph.parentWays(entity)[0];
			
			// if (!parentWay) return;
			
            let nodes = !parentWay ? [] : graph.childNodes(parentWay);
			
            // if (parentWay && parentWay.modelName == iD.data.DataType.TRAFFICSIGN) {
            if (parentWay && [iD.data.DataType.TRAFFICSIGN].includes(parentWay.modelName)) {
                this.createSignpostTagEditor(parentWay, nodes, true);
            }
			
			for(var point of nodes){
				if(isNaN(point.loc[0]) || isNaN(point.loc[1]) || isNaN(point.loc[2])){
					console.log(nodes);
					resetNodeLoc();
					Dialog.alert("您移动的元素转换经纬度时失败：NaN！");
					return;
				}
			}
			
            // 获取是否走通用节点拖拽逻辑；
            // null-要素不匹配，忽略，false=阻止
            let node2update = execPotreeHandleAll('getNodeCanDropped', e);
            if (node2update == false) {
                resetNodeLoc();
                return;
            }

            function resetNodeLoc() {
                let measure = dragObject.parent;
                let dragIndex = measure.spheres.indexOf(dragObject);
                // let pos = target.position.toArray();
                // dragObject.position.set(...pos);
                measure.points[dragIndex].position.set(...toScene.forward(entity.loc));
                measure._render = true;
            }

            var context = this.context;
            var wayConnectNodes = [];
            var nodeOutBounds = false;
            // 坐标咬合
            if (entity instanceof iD.Node) {
                let way = context.graph().parentWays(entity)[0];
                if (way) {
                    let newLoc = toMap.forward([dragObject.position.x, dragObject.position.y, dragObject.position.z]);
                    if (!context.transactionEditor() && way.isArea && way.isArea() && way.nodes[0] == entity.id) {
                        // 面类型第一个点不能超出范围
                        if (iD.util.pointNotInPlyGonx(newLoc, context)) {
                            resetNodeLoc();
                            Dialog.alert("您移动的元素不属于该任务范围内");
                            return;
                        }
                    }
                    let isAutoClip = AUTOCLIP_MODELS.includes(way.modelName) && !context.transactionEditor();
                    // 车道线，只有实线、中间点、终点可以拖拽到范围外，实线裁剪
                    if (entity.modelName == iD.data.DataType.DIVIDER_NODE && !context.transactionEditor()) {
                        if (iD.util.pointNotInPlyGonx(newLoc, context)) {
                            // if (![3, 2, 0].includes(+entity.tags.DASHTYPE)) {
                            //     Dialog.alert('您移动的link，移动到了不属于该任务范围内');
                            //     resetNodeLoc();
                            //     return;
                            // } else {
                            //     if (entity.tags.DASHTYPE != 0) {
                            //         isAutoClip = false;
                            //     }
                                nodeOutBounds = true;
                            // }
                        }
                    }
                    if (isAutoClip
                        // && (way.first() == entity.id || way.last() == entity.id)
                        && iD.util.pointNotInPlyGonx(newLoc, context)) {
                        // 第一/最后节点超出范围
                        let segLocs = [];
						let index = way.nodes.indexOf(entity.id);
                        if (way.first() == entity.id) {
                            segLocs.push(...[
                                context.entity(way.nodes[1]).loc,
                                newLoc
                            ]);
                        } else {
                            segLocs.push(...[
                                context.entity(way.nodes[index - 1]).loc,
                                newLoc
                            ]);
                        }
                        let clipLoc = getSegmentLoc(context, segLocs);
                        if (clipLoc && clipLoc.length) {
                            dragObject.position.set(...toScene.forward(clipLoc));
                        }
                        nodeOutBounds = true;
                    }

                    let target = this.viewer.inputHandler.getHoveredElements().filter(function (d) {
                        if (!d.object || !d.object.name || d.object.name == entity.id) return false;
                        let et = context.hasEntity(d.object.name);
                        if (!et || et.type != iD.data.GeomType.NODE) return false;
                        return true;
                    })[0];
                    if (nodeOutBounds) target = null;
                    if (target) {
                        target = target.object;
                        // console.log('hoverd target element ', target, dragObject.position.toArray(), target.position.toArray());
                        let dragIndex = dragObject.parent.spheres.indexOf(dragObject);
                        let pos = target.position.toArray();
                        dragObject.position.set(...pos);
                        dragObject.parent.points[dragIndex].position.set(...pos);
                        wayConnectNodes = [entity.id, target.name];
                    }
                }
            }


            let xyz = [dragObject.position.x, dragObject.position.y, dragObject.position.z];
            let loc = toMap.forward(xyz);

            context.variable.dragBarrierNode.nodeId = entity.id;
            context.variable.dragBarrierNode.oldLoc = entity.loc;
            context.variable.dragBarrierNode.newLoc = loc;

            let ids = [];
            let updateNode = false;
            if (pointEntity.includes(entity.modelName) || entity instanceof iD.Way) {
                ids.push(entity.id);
                if (entity.nodes) {
                    ids.push(...entity);
                }
                workerEntityId = entity.id;
            } else {
                let ways = this.context.graph().parentWays(entity);
                if (ways.length == 1) {
                    workerEntityId = ways[0].id;
                    let way = ways[0];
                    let idx = way.nodes.indexOf(entity.id)
                    let measure = this.entityTomeasure(way);
                    if (!measure) return;
                    if (way.isArea() && (idx == 0 || idx == way.nodes.length - 1)) {
                        let p = measure.points[idx].position;
                        // 面类型起终点闭合
                        let f = measure.points[0].position;
                        let e = measure.points[measure.points.length - 1].position;
                        f.set(p.x, p.y, p.z);
                        e.set(p.x, p.y, p.z);
                    }
                } else {
                    updateNode = true;
                }
                ids.push(..._.pluck(ways, 'id'));
                ids.push(..._.pluck(ways, 'nodes').flat());
                ids.push(entity.id);
            }
            let actions = [iD.actions.MoveNode(entity.id, loc)];
            if (nodeOutBounds && entity.modelName == iD.data.DataType.DIVIDER_NODE) {
                actions.push(iD.actions.ChangeTags(entity.id, {
                    ISSPLIT: '1'
                }));
            }
            actions.push(moveAnnotation(entity, this.context));

            this.context.perform(...actions);
            this.context.event.entityedite({
                entitys: ids,
                acceptids: ids
            });

            updateNode && this.updateNodeMeasurement(this.context.entity(entity.id));

            if (wayConnectNodes.length == 2) {
                // 共点
                wayNodeConnect(this.context, wayConnectNodes[0], wayConnectNodes[1], {
                    replace: true
                });
            }
        }
        //点云上添加measure结束
        measureAdded(e) {
            if (e.button === THREE.MOUSE.LEFT && !e.dragging) {
                this.drawing = false;

                function pos2loc(p) {
                    let xyz = [p.x, p.y, p.z];
                    let loc = toMap.forward(xyz);
                    return loc;
                }
                let dataType = iD.data.DataType;
                let measure = e.measure;
                // console.log("1---", measure.points[0].position);
                if (!measure) return;
                let modelName = measure.name;
                let nodeTypes = [dataType.TRAFFICSIGN_NODE, dataType.TRAFFICLIGHT_NODE, dataType.ROAD_FACILITIES_NODE, dataType.OBJECT_PG_NODE, dataType.OBJECT_PL_NODE, dataType.PAVEMENT_DISTRESS_NODE]
                if (nodeTypes.includes(modelName)) {
                    measure._key = '';
                    return false;
                }
                this.context.buriedStatistics().merge(0, modelName);
                let points = measure.points;
                let spheres = measure.spheres;
                let NODE_MODEL_NAME = modelName + '_NODE';
                var wayLayer = iD.Layers.getCurrentModelEnableLayer(modelName);
                if (!wayLayer && modelName != dataType.DEFAULT) {
                    this.removeMeasurement(measure);
                    return false;
                }
                let ids = [];
                if (modelName == dataType.DEFAULT && points.length == 1) {
                    let loc = pos2loc(points[0].position);
                    if (iD.util.pointNotInPlyGonx(loc, this.context)) {
                        this.viewer.measuringTool.scene.remove(e.measure);
                        Dialog.alert("新增要素不属于该任务范围");
                        return;
                    }
                    var node = iD.Node({
                        _type: iD.data.DataType.SEARCH_POINT,
                        tags: {
                            name_chn: '搜索结果点',
                            x_coord: loc[0].toString(),
                            y_coord: loc[1].toString(),
                            z_coord: loc[2].toString(),
                            colortype: loc[3] || 1
                        },
                        loc: loc
                    });
                    ids.push(node.id);
                } else if ([iD.data.DataType.LAMPPOST, iD.data.DataType.OBJECT_PT].includes(modelName)) {
                    let loc = pos2loc(points[0].position);
                    if (iD.util.pointNotInPlyGonx(loc, this.context)) {
                        this.viewer.measuringTool.scene.remove(e.measure);
                        Dialog.alert("新增要素不属于该任务范围");
                        return;
                    }
                    var node = iD.Node({
                        layerId: wayLayer.id,
                        identifier:wayLayer.identifier,
                        loc
                    });
                    node.modelName = modelName;
                    node.setTags(iD.util.getDefauteTags(node, wayLayer));
                    measure.name = node.id;
                    measure.modelName = node.modelName;
                    spheres[0].name = node.id;
                    var actions = [];
                    actions.push(...[
                        iD.actions.AddEntity(node)
                    ]);
                    actions.push('添加');
                    this.context.perform.apply(this, actions);
                    //点云视频界面新增杆顶点埋点
                    iD.picPlayerLogger.potreeHandle({
                        'tag': 'add_' + node.modelName + '_end',
                        'modelName': node.modelName,
                        'entityId': node.osmId() || '',
                        'key': 'click',
                        'linkage_type': _pic._linkage_pcloud
                    })
                } else {
                    let way = iD.Way({
                        layerId: wayLayer.id,
                        identifier:wayLayer.identifier,
                        modelName: modelName
                    });
					
                    way.setTags(iD.util.getDefauteTags(way, wayLayer));
					
					if( modelName == 'PAVEMENT_DISTRESS_PL' ){
						way.tags.MATERIAL = '1';
						way.tags.TYPE = '5';
					}else if( modelName == 'ROAD_FACILITIES' ){
						way.tags.DIRECTION = '2';
					}
					
                    let area = area_type.includes(modelName);
                    measure.name = way.id;
                    measure.modelName = way.modelName;
                    // var count = 0;
                    var actions = [];
                    var isAutoClip = AUTOCLIP_MODELS.includes(modelName) && !this.context.transactionEditor();
                    var nodeLocs = [];
                    var outBoundsIndex;
                    let outFlag = false;
                    if (!area) {
                        // 起终点都在范围外
                        // 起点范围外，终点范围内
                        let fp = points[0], ep = points[points.length - 1];
                        let fout = iD.util.pointNotInPlyGonx(pos2loc(fp.position), this.context);
                        let eout = iD.util.pointNotInPlyGonx(pos2loc(ep.position), this.context);
                        if (fout && eout) {
                            outFlag = true;
                        } else if (fout && !eout) {
                            outFlag = true;
                        }
                    }
                    for (let i = 0; i < points.length; i++) {
                        if (outFlag) break;
                        let loc = pos2loc(points[i].position);
                        if (iD.util.pointNotInPlyGonx(loc, this.context)) {
                            if (area && i == 0) {
                                outFlag = true;
                                break;
                            }
                            if (isAutoClip && i != 0) {
                                outBoundsIndex = i;
                                nodeLocs.push(loc);
                                break;
                            }
                        }
                        nodeLocs.push(loc);
                    }
                    if (outFlag) {
                        // 面第一个点，超出范围
                        this.removeMeasurement(measure);
                        nodeLocs.length = 0;
                        nodeLocs = undefined;
                        way = undefined;
                        measure = undefined;
                        Dialog.alert("绘制要素超出任务范围");
                        return;
                    }
                    if (outBoundsIndex != null) {
                        let lastIndex = nodeLocs.length - 1;
                        let clipLoc = getSegmentLoc(this.context, [
                            nodeLocs[nodeLocs.length - 2],
                            nodeLocs[lastIndex]
                        ]);
                        if (clipLoc && clipLoc.length) {
                            nodeLocs[lastIndex] = clipLoc;
                            measure.points[lastIndex].position.set(...toScene.forward([clipLoc[0], clipLoc[1], clipLoc[2]]));
                        }
                        outBoundsIndex = lastIndex;
                    }
                    if (nodeLocs.length < measure.spheres.length) {
                        // this.removeMeasurement(measure);
                        measure.removeMarker(nodeLocs.length, measure.spheres.length - 1);
                    }
                    for (let i = 0; i < nodeLocs.length; i++) {
                        let loc = nodeLocs[i];
                        var node = iD.Node({
                            modelName: NODE_MODEL_NAME,
                            layerId: wayLayer.id,
                            identifier:wayLayer.identifier,
                            loc
                        });
                        let newTags = iD.util.getDefauteTags(node, wayLayer);
                        // 车道线节点设置为边界点；
                        if (NODE_MODEL_NAME == iD.data.DataType.DIVIDER_NODE
                            && i == outBoundsIndex) {
                            newTags.ISSPLIT = '1';
                        }
                        node.setTags(newTags);
                        spheres[i].name = node.id;
                        if (i == 0) {
                            actions.push(...[
                                iD.actions.AddEntity(way),
                                iD.actions.AddEntity(node),
                                iD.actions.AddVertex(way.id, node.id)
                            ]);
                            if (area) {
                                actions.push(iD.actions.AddVertex(way.id, node.id));
                            }
                            // actions.push('添加' + way.modelName);
                            // this.context.perform.apply(this, actions);
                        } else {
                            actions.push(...[
                                iD.actions.AddEntity(node),
                                iD.actions.AddVertex(way.id, node.id, i)
                            ]);
                            actions.push('添加' + way.modelName);
                            this.context.perform.apply(this, actions);
                            
                            actions = [];
                        }
                    }
                    if (nodeLocs.length >= 2) {
                        actions.push('添加' + way.modelName);
                        this.context.perform.apply(this, actions);
                        //点云视频界面新增桥底面埋点
                        iD.picPlayerLogger.potreeHandle({
                            'tag': 'add_' + way.modelName + '_end',
                            'modelName': way.modelName,
                            'entityId': way.osmId() || '',
                            'key': 'click',
                            'linkage_type': _pic._linkage_pcloud
                        })
                    }
                }
                workerEntityId = ids.toString();
                this.context.event.entityedite({
                    entitys: ids,
                    acceptids: ids
                });
            } else {
                this.viewer.measuringTool.scene.remove(e.measure);
            }
        }

        drop(e) {
            if (!_pic) return false;
            if (e.button && e.button === THREE.MOUSE.RIGHT) {
                isFollow = false;
                return false;
            }
            var cloc = this.getCameraLoc(this.viewer);
            var cPos = cloc.cPos;
            if (last_camera_pos && _.isEqual(last_camera_pos, cPos)) {
                isFollow = false;
                return false;
            }
            let loc = cloc.cTarget;
            let line = _.pluck(_pic.allNodes, 'loc');

            let dist = iD.util.pt2LineDist2(line, loc);
            let index = dist.i == 0 ? 0 : dist.i;
            update_pic(index);

            last_camera_pos = cPos;
        }
        measureGeometryAddNode(e) {
            let measure = e.measurement;
            let sphere = e.sphere;
            if (!measure || !sphere) return;
            let add_index = e.index;
            let loc = toMap.forward(_.values(sphere.position));
            if (iD.util.pointNotInPlyGonx(loc, this.context)) {
                e.measurement.remove(e.sphere)
                Dialog.alert("新增要素不属于该任务范围");
                return;
            }
            let nodeid = polylineAddNode(this.context, measure.name, loc, add_index);
            if (!nodeid) {
                measure.removeMarker(add_index);
                return;
            }
            sphere.nodeid = nodeid;
        }

        player() { }

        updatePotreeContainer(entities, viewer) {
            let measurements = this.viewer.scene.measurements;
            let removes = [];
            let ids = _.pluck(entities, 'id');
            let keys = [];
            entities.forEach(d => {
                keys.push(iD.Entity.key(d));
            })

            for (let i = 0; i < measurements.length; i++) {
                let measurement = measurements[i];
                let idx = ids.indexOf(measurement.name);
                if (idx === -1) {
                    removes.push(measurement);
                    continue;
                } else {
                    let entity = entities[idx];
                    let key = iD.Entity.key(entity);
                    if (measurement._key != key) {
                        removes.push(measurement);
                    }
                }
            }

            for (let i = 0; i < removes.length; i++) {
                this.removeMeasurement(removes[i]);
            }
            removes.length = 0;
        }

        shapeHover(selecteds, viewer) {
            let measurements = [];
            let measurement;
            let markerList = [];
            for (let i = 0; i < selecteds.length; i++) {
                let entity = selecteds[i];
                measurement = viewer.scene.getMeasurementByName(selecteds[i].id);
                if (measurement) measurements.push(measurement);
                if (!measurement && entity instanceof iD.Node) {
                    let ways = this.context.graph().parentWays(entity);
                    ways.forEach(function (w) {
                        let wayM = viewer.scene.getMeasurementByName(w.id);
                        wayM && markerList.push({
                            measure: wayM,
                            index: w.nodes.indexOf(entity.id)
                        });
                    });
                }
            }
            // if (measurements.length == 0 && markerList.length == 0) return false;
            viewer.scene.selectMeasurement(measurements);
            viewer.scene.selectMeasurementMarker(markerList);
        }

        initEvent(context, viewer) {
            //结束处理方法
            var self = this;

            function undo_redo_nodesChange(d) {
                if (!d) return;
                let modified = d.modified();
                let changes = d.changes();
                modified.forEach(function (way) {
                    if (way instanceof iD.Node && !pointEntity.includes(way.modelName)) {
                        self.updateNodeMeasurement(way);
                    }
                    // 节点改变后激光没有刷新的问题；
                    if (!(way instanceof iD.Way)) return;
                    let c = changes[way.id];
                    if (!c || !c.base || !c.head) return;
                    if (c.base.nodes.length == c.head.nodes.length) return;
                    let m = self.entityTomeasure(way);
                    if (!m || m._key == null) return;
                    m._key = '';
                });
            }

            var _unDoneFun = function (d) {
                undo_redo_nodesChange(d);
                let rc = context.buriedStatistics().getRecording();
                if(rc.name){
                    context.buriedStatistics().merge(0, rc.name);
                }
                self.entityTOpotree(self.context, self.viewer);
            }
            var _reDoneFun = function (d) {
                undo_redo_nodesChange(d);
                self.entityTOpotree(self.context, self.viewer);
            }
            context.connection().on("loaded.potree", function (lay, reload) {
                // console.log('loaded;');
                // if(!lay) return false;
                self.entityTOpotree(context, viewer);
            });
            // 图层显示状态更改、编辑状态更改
            context.ui().layermanager.on('roadEdit.potree', function (layeInfo, display) {
                if (display != null) {
                    // 显示状态有display
                    self.entityTOpotree(context, viewer);
                }
            });
            context.history()
                .on('pop.potree', _unDoneFun)
                .on('undone.potree', _unDoneFun)
                .on('redone.potree', _reDoneFun);
            // .on('change.potree', this.history_change);
            context.event.on('entityedite.potree', (d = {}) => {
                let entities = d.entitys || [];
                if (!_.isArray(entities)) {
                    entities = [entities];
                }
                entities.forEach(eid => {
                    var entity = context.hasEntity(eid);
                    if (!entity) return;
                    if (entity instanceof iD.Way) {
                        this.updateWayMeasurement(entity);
                    }
                    if (entity instanceof iD.Node) {
                        this.updateNodeMeasurement(entity);
                    }
                });
                // 发生改变
                if (renderFilterLine) {
                    renderFilterLine.removeFilterIds(entities);
                }
                if (entities.includes(workerEntityId)) {
                    workerEntityId = '';
                    return;
                }

                // console.log('asdfasdf', d);
                this.entityTOpotree(this.context, this.viewer);
                if (entities.length) {
                    var entity = context.hasEntity(entities[0]);
                    if (entity && entity.modelName == iD.data.DataType.OBJECT_PG && entity.tags.SUBTYPE == '2') {
                        this.rectFeature = entity;
                        // this.rotateArea(entity);
                    }
                }
            });
            context.event.on('pic_entity_change.potree', (id, type) => {
                let entity;
                if (type == 'delete' && id instanceof iD.Entity) {
                    entity = id;
                    let m = this.viewer.scene.getMeasurementByName(entity.id);
                    m && this.removeMeasurement(m);
                    return;
                }
                entity = context.hasEntity(id);
                if (!type || !entity) return;
                //只支持新增线，不支持线面新增节点
                if (type === 'add') {
                    this.createEntity(entity);
                } else if (type === 'change' && entity instanceof iD.Node) {
                    if (entity.modelName == iD.data.DataType.OBJECT_PG_NODE
                        && iD.picUtil.checkNodeIsGroundArea(entity.id)) {
                        // 地面区域修改时需要刷新面
                        this.updateWayMeasurement(context.graph().parentWays(entity)[0]);
                    } else if (entity.modelName == iD.data.DataType.TRAFFICSIGN_NODE) {
                        this.updateWayMeasurement(context.graph().parentWays(entity)[0]);
                    } else {
                        this.updateNodeMeasurement(entity);
                    }
                }
                viewer.isMeasureRender = true;
                // this.history_change();
            });

            // context.history() //.on('undone.potree', _doneFun)
            //     // .on('redone.potree', _doneFun
            //     .on('change.potree', this.history_change);
            let delteUpdateToPotree = false;
            // 删除数据点云投影需要删除
            context.event.on('before_delete.potree', (d) => {
                delteUpdateToPotree = false;

                let ids = d.selectedIDs;
                if (!ids) return;
                var self = this;
                for (let i = 0; i < ids.length; i++) {
                    let id = ids[i];
                    let entity = self.context.hasEntity(ids[i]);
                    let m = self.viewer.scene.getMeasurementByName(id);
                    if (!pointEntity.includes(d.modelName) && (entity instanceof iD.Node)) {
                        let ways = this.context.graph().parentWays(entity);
                        ways.forEach(way => {
                            // 面类型至少三个节点
                            if (way.isArea() && way.nodes.length <= 4) {
                                m = self.viewer.scene.getMeasurementByName(way.id);
                                return;
                            }
                            let idx = way.nodes.indexOf(ids[i]);
                            let measure = this.entityTomeasure(way);
                            if (!measure) return;
                            if (idx == -1) return
                            // 有可能删除首尾节点（交通灯、路牌）
                            let isAreaFirst = way.isArea() && (idx == 0 || idx == way.nodes.length - 1);
                            if (isAreaFirst) {
                                idx = 0;
                                m = measure;
                                delteUpdateToPotree = true;
                            }
                            // measure.points.splice(idx, 1);
                            // measure.spheres.splice(idx, 1);
                            measure.removeMarker(idx);
                            // measure._render = true;
                            // measure.update();
                        });
                    }
                    //点云视频界面删除要素埋点
                    iD.picPlayerLogger.potreeHandle({
                        'tag': 'potree_delete_' + entity.modelName,
                        'modelName': entity.modelName,
                        'entityId': entity.osmId() || '',
                        'key': 'click',
                        'linkage_type': _pic._linkage_pcloud
                    })
                    this.removeMeasurement(m);
                    viewer.isMeasureRender = true;
                }
                // console.log('delete.potree')
            });
            context.event.on('delete.potree', () => {
                if (delteUpdateToPotree) {
                    delteUpdateToPotree = false;
                    this.entityTOpotree(this.context, this.viewer);
                }
            })

            _pic && _pic.on('picUpdate.potree', (picNode, indx) => {
                if (!isFollow) {
                    console.log('不跟随定位');
                    isFollow = true;
                    return false;
                }
                this._picUpdate(picNode, indx, viewer);
            });

            // 选择对应点云修改显示颜色
            context.event.on('selected.potree', (selecteds) => {
                this.shapeHover(selecteds, viewer);
            });
            return true;
        }
        _picUpdate(node, index, viewer) {
            if (!_pic || !_pic.dataMgr.potree
                || !_pic.dataMgr.potree.dialog
                || !_pic.dataMgr.potree.dialog.isOpen()) {
                return;
            }
            // console.log(_pic, node, index);
            // let cp1 = toScene.forward(node.loc);
            // viewer.scene.view.position.set(cp1[0], cp1[1], cp1[2] + 150);
            // viewer.scene.view.lookAt(cp1[0], cp1[1], cp1[2]);
            // viewer.scene.view.yaw = -Math.PI / 2;
            if (_pic._linkage_pcloud) {
                // var picImgContainer = $('#potree_picImg_container');
                // if (picImgContainer && picImgContainer.length) {
                //     var picImgContainerDom = picImgContainer[0];
                //     // picImgContainerDom.style.width = this.viewer.renderArea.offsetWidth + 'px';
                //     // picImgContainerDom.style.height = this.viewer.renderArea.offsetHeight + 'px';
                //     picImgContainerDom.style.opacity = $('#lblIntensityImg').find('font')[0].innerHTML;

                //     let imgDom = picImgContainer.find('img')[0];
                //     imgDom.src = new URL(node.tags.picUrl).href;
                //     // let imgDom = document.createElement('img');
                //     // imgDom.src = new URL(node.tags.picUrl).href;
                //     imgDom.style.width = this.viewer.renderArea.offsetWidth + 'px';
                //     imgDom.style.height = this.viewer.renderArea.offsetHeight + 'px';
                //     // annotationContainer.append(imgDom);
                // }
                // viewer.setImageUrl(new URL(node.tags.picUrl).href);
                if (!_pic.isDragPCloud) {
                    iD.util.locationPotree(viewer, _pic.pic_point, _pic.wayInfo.K);
                }
                _pic.isDragPCloud = false;
            }
        }

        removeEntitys() {
            this.viewer.scene.removeMeasurements();
        }

        removeMeasurement(measurement) {
            if (!measurement) return;
            measurement._render = true;
            this.viewer.scene.removeMeasurement(measurement);
        }

        entityTomeasure(d) {
            if (pointEntity.includes(d.modelName) || d instanceof iD.Way) {
                return this.viewer.scene.getMeasurementByName(d.id);
            } else if (d instanceof iD.Node) {
                let ways = this.context.graph().parentWays(d);
                if (!ways || !ways[0]) return;
                return this.viewer.scene.getMeasurementByName(ways[0].id);
            }
        }

        updatePoiCloud(key, value) {
            this.viewer.setClassificationVisibility(key, value);
        }

        updateWayMeasurement(entity) {
            let measure = this.entityTomeasure(entity);
            if (!measure) return;
            let key = iD.Entity.key(entity);
            let nodes = this.context.graph().childNodes(entity);
            if (key === measure._key && nodes.length == measure.points.length) {
                measure.points.map((p, i) => {
                    let node = nodes[i]
                    let loc = toScene.forward([node.loc[0], node.loc[1], node.loc[2]]);
                    p.position.set(...loc);
                    // return p
                })
            }
            measure._render = true;
            // else{
            //     console.log('KEY:不相等，或者长度不相等',)
            // }
        }

        updateNodeMeasurement(entity) {

            let measure = this.entityTomeasure(entity);
            if (!measure) return;
            let len = measure.points.length;
            let loc = toScene.forward([entity.loc[0], entity.loc[1], entity.loc[2]]);

            if (pointEntity.includes(entity.modelName)) {
                if (len == 0 || len > 1) return;
                let position = measure.points[0].position;
                position.set(...loc);
                measure._render = true;
            } else if (entity instanceof iD.Node) {
                let ways = this.context.graph().parentWays(entity);
                ways.forEach(way => {
                    let idx = way.nodes.indexOf(entity.id);
                    measure = this.entityTomeasure(way);
                    if (!measure) return;
                    if (idx == -1 || idx > len) return
                    if (way.isArea() && (idx == 0 || idx == way.nodes.length - 1)) {
                        // 面类型起终点闭合
                        let f = measure.points[0].position;
                        let e = measure.points[measure.points.length - 1].position;
                        f.set(...loc);
                        e.set(...loc);
                    } else {
                        let position = measure.points[idx].position;
                        position.set(...loc);
                    }
                    measure._render = true;
                })
            } else {
                console.log('出现修改为线对象');
            }

        }

        entityTOpotree(context, viewer) {
            if (!this.isInitEvent) {
                this.isInitEvent = this.initEvent(this.context, viewer);
            }
			if (!iD.picUtil.player.potreeVisible) return;
            if (!viewer.scene.pointclouds.length) return;
            let displayLayerIds = [];
            let displayModels = [];
            // let pointcloudProjection = "+proj=utm +zone=50 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
            // let mapProjection = proj4.defs("WGS84");

            this.context.layers().getLayers().forEach(function (lay) {
				
				for(var name in lay.models){
					var new_id = lay.id + '_' + name,
						model_display = lay.models[name].display;
					model_display && displayModels.push(new_id);
				}
				
                // lay.display && displayLayerIds.push(lay.id);
            });


            window.pd = this;
            window._cloudOffsize  = 100 ;
            // var group = new THREE.Group();
            let box = viewer.scene.getBoundingBox();
            let min = toMap.forward([box.min.x - window._cloudOffsize, box.min.y - window._cloudOffsize]);
            let max = toMap.forward([box.max.x + window._cloudOffsize, box.max.y + window._cloudOffsize]);
            let bounds = [min, max];

            // let all = Object.values(this.context.graph().base().entities);
            var all = this.context.intersects(bounds);
            var dataType = iD.data.DataType;
            let self = this;
            //数据过滤，过滤出符合条件数据返回
            var result = all.filter(function (datum) {
                if (!displayModels.includes(datum.layerId + "_" + datum.modelName)
                    && datum._type != dataType.SEARCH_POINT) {
                    return false;
                }
                if(!renderFilter(datum, self.context) && !self.isStaticLidarIndex){
                    return false;
                }
				
                let p = datum instanceof iD.Way &&
                    (_.include([
                        dataType.PAVEMENT_DISTRESS_PL,			//病害面-车辙--按人行横道
                    ], datum.modelName) && datum.tags.MATERIAL == '1' && datum.tags.TYPE == '5');
                let w = datum instanceof iD.Way &&
                    _.include([
                        dataType.DIVIDER,
                        dataType.TRAFFICSIGN,
                        dataType.OBJECT_PL,
                        dataType.OBJECT_PG,
                        dataType.ROAD_FACILITIES,
                        dataType.BARRIER_GEOMETRY,
                        dataType.TRAFFICLIGHT
                    ], datum.modelName);
                let n = datum instanceof iD.Node &&
                    (_.include([
                        dataType.OBJECT_PT,
                        dataType.LAMPPOST,
                        dataType.AUTO_NETWORK_TAG,
                        dataType.TRAFFICSIGN_NODE,
                        dataType.LIMITHEIGHT,
                    ], datum.modelName) || datum._type == dataType.SEARCH_POINT);
                return p || w || n;
            });


            // let cameraCenter = this.getCameraLoc(this.viewer);
            // all = filterEntity(cameraCenter, this.context);
            // console.log('过滤后:', all.length, cameraCenter);
            // this.resetPotreeShapes(); // 清除不在视野数据
            let graph = this.context.graph();

            let scene = this.viewer.scene;
            // viewer.scene.scene.add(shapeNode);

            // var nodes=[],lines=[],polygons=[];
            // let node = nodeToPotreePoint({loc:[cameraCenter[0],cameraCenter[1],40]}, toScene, graph);
            // for (let i = 0; i < all.length; i++) {
            //     var _temp = all[i];
            //     let node;
            //     if ([DataType.DIVIDER, DataType.OBJECT_PL].includes(_temp.modelName)) {
            // node = wayToPotreeLine(_temp, toScene, graph);
            //     } else if ([DataType.LAMPPOST].includes(_temp.modelName)) {
            //         node = nodeToPotreePoint(_temp, toScene, graph);
            //     } else if ([DataType.TRAFFICLIGHT, DataType.TRAFFICSIGN, DataType.OBJECT_PG].includes(_temp.modelName)) {
            //         node = polygonToPotreePolygon(_temp, toScene, graph);
            //     }
            // node && shapeNode.add(node);
            // }

            this.updatePotreeContainer(result, this.viewer);
            var measurements = [];

            for (let i = 0; i < result.length; i++) {
                var _temp = result[i];
                let _isIn = scene.getMeasurementByName(_temp.id);
                if (_isIn) {
                    // console.log(123123123, _temp.id)
                    continue;
                }
                // 没有节点的线
                if (_temp instanceof iD.Way && !_temp.nodes.length) {
                    continue;
                }
                if ([dataType.DIVIDER, dataType.OBJECT_PL, dataType.BARRIER_GEOMETRY, dataType.PAVEMENT_DISTRESS_PL].includes(_temp.modelName)) {
                    measurements.push(addPotreeLine(scene, _temp, toScene, graph, this.context));
                    // group.add(addPotreeLine(scene, _temp, this.toScene, graph));
                } else if ([dataType.LAMPPOST, dataType.OBJECT_PT, dataType.AUTO_NETWORK_TAG].includes(_temp.modelName) || _temp._type == dataType.SEARCH_POINT) {

                    measurements.push(addPotreePoint(scene, _temp, toScene, graph));
                    // group.add(addPotreePoint(scene, _temp, this.toScene, graph));
                } else if ([
                    dataType.TRAFFICLIGHT,
                    dataType.ROAD_FACILITIES,
                    dataType.TRAFFICSIGN,
                    dataType.OBJECT_PG,
                    dataType.ROAD_FACILITIES
                ].includes(_temp.modelName)) {
                    measurements.push(addPotreePolygon(scene, _temp, toScene, graph));
                    // group.add(addPotreePolygon(scene, _temp, this.toScene, graph));
                }
            }
            if (measurements.length) {
                scene.addMeasurements(measurements);
            }
            console.log('全量:', measurements.length);
            measurements.forEach(function (m) {
                m._render = true;
            });
            viewer.isMeasureRender = true;
            // viewer.scene.scene.add(group);
        }

        //新增元素
        createEntity(entity) {
            if(!renderFilter(entity, this.context)){
                return ;
            }
            let scene = this.viewer.scene;
            let graph = this.context.graph();
            let measurements = [];

            if ([dataType.DIVIDER, dataType.OBJECT_PL, dataType.BARRIER_GEOMETRY].includes(entity.modelName)) {
                measurements.push(addPotreeLine(scene, entity, toScene, graph, this.context));
            } else if ([dataType.LAMPPOST,dataType.OBJECT_PT, dataType.TRAFFICSIGN_NODE].includes(entity.modelName) || entity._type == dataType.SEARCH_POINT) {
                measurements.push(addPotreePoint(scene, entity, toScene, graph));
            } else if ([
                dataType.TRAFFICLIGHT,
                dataType.ROAD_FACILITIES,
                dataType.TRAFFICSIGN,
                dataType.OBJECT_PG,
                dataType.ROAD_FACILITIES
            ].includes(entity.modelName)) {
                measurements.push(addPotreePolygon(scene, entity, toScene, graph));
            } else if (entity instanceof iD.Node) {
                let ways = graph.parentWays(entity);
                ways.forEach(way => {
                    let measure = scene.getMeasurementByName(way.id);
                    if (measure && measure.points.length != way.nodes.length) {
                        let idx = way.nodes.indexOf(entity.id);
                        let pos = toScene.forward([entity.loc[0], entity.loc[1], entity.loc[2]]);
                        measure.addMarker(new THREE.Vector3(pos[0], pos[1], pos[2]), { id: entity.id, index: idx });
                    }
                    measure._render = true;
                })
            }

            if (measurements.length) {
                measurements.forEach((d) => d._render = true);
                scene.addMeasurements(measurements);
            }
        }

        // 重置所有
        reset() {
            renderFilterLine && renderFilterLine.reset();
        }
        getLineFilter() {
            return renderFilterLine;
        }
        lightEntitys() { }
    }

    // 面类型、点类型超出范围
    function entityIsOutBound(context, entity) {
        if (context.transactionEditor()) return false;
        let geoType = entity.geometry(context.graph());
        let locs = [];
        if (geoType == 'area') {
            locs.push(context.entity(entity.first()).loc);
        } else if (geoType == 'point') {
            locs.push(entity.loc);
        } else if (geoType == 'line') {
            locs.push(...[
                context.entity(entity.first()).loc,
                context.entity(entity.last()).loc
            ]);
        }
        let flag = false;
        for (let loc of locs) {
            flag = iD.util.pointNotInPlyGonx(loc, context);
            if (flag) break;
        }
        return flag;
    }

    /**
     * 获取线段与任务范围的交点坐标
     * @param {Array} locs 
     */
    function getSegmentLoc(context, locs) {
        var flag = false;
        if (!context.editArea()) {
            return flag;
        }
        var holes = context.editArea().coordinates;
        for (var j = 0; j < holes.length; j++) {
            var holes_nodes = [];
            for (var k = 0; k < holes[j].length - 1; k++) {
                if (flag && !isNaN(flag[0])) {
                    break;
                }
                holes_nodes = [
                    holes[j][k],
                    holes[j][k + 1]
                ];
                let zone_ = null;
                let utmLocs1 = holes_nodes.map(function (v) {
                    let utm = iD.util.LLtoUTM_(v[0], v[1]);
                    zone_ = utm.zoneNumber;
                    return [utm.x, utm.y]
                });
                let utmLocs2 = locs.map(function (v) {
                    let utm = iD.util.LLtoUTM_(v[0], v[1]);
                    return [utm.x, utm.y]
                });
                let newLoc = iD.geo.lineIntersection(utmLocs1, utmLocs2);
                flag = newLoc && iD.util.UTMtoLL_(newLoc[0], newLoc[1],zone_);
                // flag && (flag[2] = locs[1][2]);
            }
        }
        if (!flag || !flag.length) return locs[0];
        // let player = iD.picUtil.player;
        // let piex = iD.util.trackPointToPicPixe(player.wayInfo.K, player.pic_point, flag);
        // let ll = iD.picUtil.pixelToLngLat(piex);
        return iD.util.getBetweenPointLoc(locs[0], locs[1], flag);
        // return [flag[0], flag[1],ll.elevation];
        // var z = iD.util.getHeight(flag);
        // return [flag[0], flag[1], z];
    }

    function polylineAddNode(context, wayid, pointLoc, index) {
        var way = context.entity(wayid),
            node;
        if (way.type != iD.data.GeomType.WAY) return false;
        var modelName = way.modelName + '_NODE';
        context.buriedStatistics().merge(0, way.modelName);
        var currentLayer = iD.Layers.getCurrentModelEnableLayer(modelName);
        if (!currentLayer) return '';
        node = iD.Node({
            modelName: modelName,
            layerId: currentLayer.id,
            identifier:currentLayer.identifier,
            loc: pointLoc,
            tags: iD.util.getDefauteTags(modelName, currentLayer)
        });
        context.perform(
            iD.picUtil.actionGeometryLineAddNode(way, node, index),
            "添加线路节点"
        );
        context.event.entityedite({
            entitys: [way.id]
        });
        return node.id
    }


    function wayNodeConnect(context, moveid, nodeid, opts) {
        if (!moveid || !nodeid || (moveid == nodeid)) {
            return;
        }
        opts = opts || {};
        var graph = context.graph();
        var mnode = graph.entity(moveid);
        var tnode = graph.entity(nodeid);
        var modelConfig = iD.Layers.getLayer(tnode.layerId, tnode.modelName);
        if (!modelConfig && !modelConfig.editable) {
            return;
        }

        if (mnode.modelName !== tnode.modelName) {
            // 相同要素进行共点关联
            return;
        }
        if (![
            iD.data.DataType.DIVIDER_NODE,
            iD.data.DataType.OBJECT_PL_NODE,
            iD.data.DataType.BARRIER_GEOMETRY_NODE
        ].includes(mnode.modelName)) {
            return;
        }
        if (!iD.util.nodeIsBreakPoint(mnode, graph) || !iD.util.nodeIsBreakPoint(tnode, graph)) {
            return;
        }
        // 有相同的DIVIDER，不允许 共点
        var didMap = {}, didRepeat;
        graph.parentWays(mnode).forEach((way) => {
            if (didMap[way.id]) {
                didRepeat = true;
            }
            didMap[way.id] = true;
        });
        graph.parentWays(tnode).forEach((way) => {
            if (didMap[way.id]) {
                didRepeat = true;
            }
            didMap[way.id] = true;
        });
        if (didRepeat) {
            return;
        }

        var connectNodes = [];
        if (mnode.modelName == iD.data.DataType.DIVIDER_NODE) {
            var mrels = graph.parentRelations(mnode, iD.data.DataType.DIVIDER_ATTRIBUTE);
            var trels = graph.parentRelations(tnode, iD.data.DataType.DIVIDER_ATTRIBUTE);
            // 两个DA不允许 共点
            if (mrels.length && trels.length) {
                return;
            }

            if (mrels.length) {
                connectNodes = [nodeid, moveid];
            } else if (trels.length) {
                connectNodes = [moveid, nodeid];
            } else {
                connectNodes = [moveid, nodeid];
            }
        } else {
            connectNodes = [moveid, nodeid]
        }

        var args = [
            iD.picUtil.measureinfoAction(mnode, {
                type: -1
            }),
            iD.picUtil.measureinfoAction(tnode, {
                type: -1
            }),
            // 最后一个点是保持不变的点
            iD.actions.ConnectDivider(context, connectNodes),
            t('operations.connect.annotation.' + tnode.geometry(context.graph()))
        ];
        context.enter(iD.modes.Select(context, [_.last(connectNodes)]));
        if (opts.replace) {
            context.replace(...args);
        } else {
            context.perform(...args);
        }
        context.event.entityedite({
            entities: _.keys(didMap)
        });
        // console.log('共点关联：', connectNodes.join(' <-> '));
        return true;
    }

})(iD);