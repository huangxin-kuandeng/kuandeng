/*
 * @Author: tao.w
 * @Date: 2019-08-09 16:23:35
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-07 14:59:40
 * @Description: 
 */

(function (iD) {
    var lastIndexKey = null;

    function fromIndexTaskId() {
        return (iD.Task.d.tags.pointCloudKeys != null
            && iD.Task.d.tags.pointCloudKeys.split(',').length == 1);
    }
	
    var $potree = `
            <div class="potree_container" >
            <div id="potree_render_area"></div>
            <div id="potree_render_text">
                <div id="topcamera">
                    <button type="button" class="topcamera his-hide">俯视图</button>
                </div>
                <div id="sidecamera">
                    <button type="button" class="sidecamera his-hide">左视图</button>
                </div>
                <div id="frontcamera">
                    <button type="button" class="frontcamera his-hide">正视图</button>
                </div>
            </div>
            <div id="potree_footer">
            <button type="button" class="divider his-hide">车道线</button>
            <button type="button" class="add_node his-hide">添加节点</button>
            <!--<button type="button" class="lamppost his-hide" thumbnail>杆顶点</button>-->
            <button type="button" class="road_facilities his-hide" thumbnail>桥底面</button>
            <button type="button" class="bridge_facade his-hide" thumbnail>桥立面</button>
            <button type="button" class="barrier his-hide" thumbnail>BARRIER</button>
            <button type="button" class="trafficlight his-hide" thumbnail>交通灯</button>
            <button type="button" class="footway his-hide" thumbnail>人行横道</button>
            <button type="button" class="positioning_line his-hide" thumbnail>定位线</button>
            <button type="button" class="objectPt his-hide" thumbnail>点</button>
            
            <div class="button-group his-hide dropdown">
                <button type="button" class="dropdown-label">路牌</button>
                <div class="dropdown-body">
                    <button type="button" class="triangle" thumbnail>三角牌</button>
                    <button type="button" class="circle" thumbnail>圆牌</button>
                    <button type="button" class="rect" thumbnail>矩形牌</button>
                    <button type="button" class="octagon" thumbnail>八角牌</button>
                </div>
            </div>

            
            <div class="button-group his-hide dropdown" style="width:98px;">
                <button type="button" class="dropdown-label">轨迹点云</button>
                <div class="dropdown-body">
                <button type="button" class="current_point_cloud his-hide" thumbnail>单轨迹点云</button>
                <button type="button" class="whole_point_cloud his-hide" thumbnail>多轨迹点云</button> 
                </div>
            </div>
            
            
            <div class="button-group his-hide dropdown">
                <button type="button" class="dropdown-label">视角</button>
                <div class="dropdown-body">
                    <button type="button" class="resetlook" thumbnail>重置视角</button>
                    <button type="button" class="planarView his-hide" thumbnail>顶部视角</button>
                </div>
            </div>
			
            <button type="button" class="ground_area his-hide" thumbnail>地面区域</button>
            <!-- <button type="button" class="pavement_distress his-hide" thumbnail>病害线</button> -->
            <button type="button" class="pavement_distress_pl his-hide" thumbnail>车辙</button>
            <div class="not_affected" style="display: inline-block">
                <input type="checkbox" class="load_live_object" checked="checked"/>
                <font>动态物体</font>
            </div>
			
            <div class="not_affected" style="display: inline-block;margin-left: 6px;height: 20px;line-height: 30px;">
                <font style="float: left;margin-right: 10px;">强度范围</font>
				<input class="strength_range" type="hidden" value="0,255" />
            </div>
            
			
   
            </div>
            </div>
            <div id="potree_sidebar_container"> </div>
        `;
    /*
    <button type="button" class="ground_area his-hide" thumbnail>地面区域</button>
    <div>
        <div class="footer-img-bar">
            <font style="vertical-align: inherit;">图片透明度：</font>
            <span id="lblIntensityImg"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">0</font></font></span>
            <div class="footer-img-range-div">
                <input type="range" class="footer-img-range" value="0" min="0" max="1" step="0.1" style="background-image: -webkit-gradient(linear, 0 0, 100% 0, from(rgb(74, 127, 236)), color-stop(0.0332385, rgb(74, 127, 236)), color-stop(0.0333385, rgb(255, 255, 255)), to(rgb(255, 255, 255)));">
                <span class="footer-img-range-tip" style="left: 16.706%; display: none;">图片透明度</span>
            </div>
        </div>
        </div>
    */
    //<button type="button" class="planarView his-hide" thumbnail>三视图</button>
    // <select class="trackIdx" multiple="multiple">
    // </select>
    var _material;

    // <div id="potree_sidebar_container"> </div>
    iD.svg.Potree = function (_context, selection, _dataMgr, visible = true) {
        this.dataMgr = _dataMgr;
        this.context = _context;
        this.dispatch = d3.dispatch('close');
        this.selection = selection;
        this.dialog = null;
        this.viewer = null;
        this.potree = null;
        this.$panelBody = null;
        this.$sidebarTool = null;
        this._pcloudVisible = visible;
        this.initPanel();
    };

    _.assign(iD.svg.Potree.prototype, {
        initPanel: function () {
            this.dialog = iD.dialog(null, {
                width: 950,
                height: 820,
                // appendTo: '#id-container',
                autoOpen: false,
                resizable: true,
                closeBtn: false
            });

            this.dialog.option('title', '点云');

            this.dialog.on('close', this.hide.bind(this));

            this.dialog.widget().classed('potree-panel', true);

            $newPanelBody = this.dialog.element.append('div')
                .attr('class', 'panel-body')
                .attr('id', 'potree-dialog');
            this.initBody($newPanelBody);
            this.$panelBody = $newPanelBody;
            // initPotreeSidebar(this);
        },
        renderCloud: function (viewer, trackId) {
            // var self = this;
            let url;
            let pointCloudUrl;
            let isStaticLidarIndex = false;
            let keyName = 'wt';
            let _projStr = '&projectId=' + (iD.Task.d.tags.fusionProjectId || iD.Task.d.tags.projectId);
			let processDefinitionKey = 'defaultPlain';
			
			if (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3') {
				processDefinitionKey = 'pavementDisease';
			}
            let bodyFooter = d3.select('.potree_container #potree_footer');
			bodyFooter.classed(processDefinitionKey, true);

            //判断当前任务是否为静态激光任务， 静态激光任务索引加载和数据逻辑处理会有不同地方
            let namespace = 'lidar_point_cloud_index';

            if (iD.Task && iD.Task.d && iD.Task.d.tags && iD.Task.d.tags.branchDataType == '1') {
                isStaticLidarIndex = true;
                namespace = 'lidar_mapping_index'
            }

            let _url = iD.config.URL.potree;
            if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
                _url = iD.config.URL.pavement_distrees_potree;
            }
            
            if (isStaticLidarIndex) {
                url = _url +  "key=" + trackId + _projStr +"&index=cloud.js";
                pointCloudUrl = _url + "key=" + trackId + _projStr + "&index=";
                
            } else if(iD.Task.d.tags.pointCloudKeys.length){
                let keys = iD.Task.d.tags.pointCloudKeys.split(',');
                let _t = keys.find((d) => { if (d.indexOf(trackId) != -1) return true; return false });

                if (!_t) {
                    console.error('无对应索引，不应该出现的情况');
                    return;
                }
                lastIndexKey = _t;
                url = _url + "key=" + _t + _projStr  + "&index=cloud.js";
                pointCloudUrl = _url + "key=" + _t + _projStr  + "&index=";
            }else {
                console.error('无对应索引，不应该出现的情况');
                return; 
            }
            
            //静态激光判断 默认false;
            this.potree.isStaticLidarIndex = isStaticLidarIndex;

            this.addPointCloud(url, pointCloudUrl, keyName);

            if (_pic) {
                this.potree._picUpdate(_pic.pic_point, 0, this.viewer);
            }
        },

        /**
         * @description: 加载当前任务所有点云
         * @param {type} 
         * @return: 
         */
        wholePointCloud() {
            let currentPointCloudsNames = _.pluck(this.viewer.scene.pointclouds, 'name');

            let keys = iD.Task.d.tags.pointCloudKeys.split(',');
            let _projStr = '&projectId=' + iD.Task.d.tags.projectId;
            let _url = iD.config.URL.potree;
            if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
                _url = iD.config.URL.pavement_distrees_potree;
            }
            for (let i = 0; i < keys.length; i++) {
                let name = keys[i];
                if (currentPointCloudsNames.includes(name)) {
                    continue;
                }

                let url = _url + "key=" + name + _projStr + "&index=cloud.js";
                let pointCloudUrl = _url + "key=" + name +_projStr + "&index=";
                this.addPointCloud(url, pointCloudUrl, name);
            }
        },

        /**
         * @description: 加载当前播放轨迹点云
         * @param {type} 
         * @return: 
         */
        currentPointCloud() {
            let currentPointCloudsNames = _.pluck(this.viewer.scene.pointclouds, 'name');
            let trackId = _pic.wayInfo.trackId;
            let isInclude = false;

            currentPointCloudsNames.forEach(d => {
                if (d.indexOf(trackId) == -1) {
                    let pointCloud = this.viewer.scene.getPointCloud(d);
                    this.viewer.scene.removePointCloud(pointCloud);
                } else {
                    isInclude = true;
                }
            })

            let _url = iD.config.URL.potree;
            if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
                _url = iD.config.URL.pavement_distrees_potree;
            }

            if (!isInclude) {

                let keys = iD.Task.d.tags.pointCloudKeys.split(',');
                let key = keys.find((d) => { if (d.indexOf(trackId) != -1) return true; return false });
                if (!key) {
                    console.error('无对应索引，不应该出现的情况');
                    return;
                }
                let url = _url + "key=" + key + "&index=cloud.js";
                let pointCloudUrl = _url + "key=" + key + "&index=";
                
                this.addPointCloud(url, pointCloudUrl, key);
            }
            return;
        },
		
        addPointCloud(url, pointCloudUrl, name) {
            let scene = viewer.scene;
            Potree.loadPointCloud(url, name, e => {
                scene.addPointCloud(e.pointcloud);
                let _pointCloud = e.pointcloud;

                _material = _pointCloud.material;
				
				e.pointcloud.material.addEventListener('material_property_changed', function(){
					let intensityRange = viewer.scene.pointclouds[0].material.intensityRange;
					let rangeMin = intensityRange[0];
					let rangeMax = intensityRange[1];
					let rangeStr = intensityRange.join(",");
					let curent_value = $('.strength_range').val();
					if(rangeStr != curent_value){
						$('.strength_range').jRange('updateFromTo', rangeMin, rangeMax);
						$('.strength_range').jRange('updateRange', rangeStr);
						$('.strength_range').jRange('setValue', rangeStr);
					}
				});
				

                _material.pointColorType = Potree.PointColorType.INTENSITY; // any Potree.PointColorType.INTENSITY_GRADIENT 
                // _material.pointColorType = Potree.PointColorType.INTENSITY_GRADIENT; // any Potree.PointColorType.INTENSITY_GRADIENT 

                // _material.pointSizeType = Potree.PointSizeType.ADAPTIVE;


                // _material.shape = Potree.PointShape.ADAPTIVE;
                // _material.pointSizeType = Potree.PointSizeType.FIXED;
                
                _material.size = 0;
                _pointCloud.visible = this._pcloudVisible;

                _material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
                _material.shape = Potree.PointShape.SQUARE;

                let zone = e.pointcloud.pcoGeometry.zone || '50S';
                zone = parseInt(zone);
                // zone = zone.substr(0, zone.length - 1);
                let pointcloudProjection = "+proj=utm +zone= " + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
                let mapProjection = proj4.defs("WGS84");

                window.toMap = proj4(pointcloudProjection, mapProjection);
                window.toScene = proj4(mapProjection, pointcloudProjection);

                // viewer.fitToScreen();
                this.potree.entityTOpotree(this.context, this.viewer);
            }, pointCloudUrl);
        },
        pcloudVisible(visible) {
            if (!this.viewer) return;
            this.viewer.scene.pointclouds.forEach(d => {
                d.visible = visible;
            })
            this._pcloudVisible = visible;
            this.viewer.visible = visible;
            this.viewer.isMeasureRender = true;
            if (_pic) {
                this.potree._picUpdate(_pic.pic_point, 0, this.viewer);
                this.potree.entityTOpotree(this.context, this.viewer);
            }
        },
        updatePosition(trackPoint) {
            if (!this.potree || !this.context) return;
            this.potree.removeEntitys();
            this.potree.reset();

            this.potree._picUpdate(trackPoint, 0, this.viewer);
            this.potree.entityTOpotree(this.context, this.viewer);
        },
        updateTrack(trackid) {
            if (!this.potree || !this.context) return;
            closeSidebarDiv(this);
          

            // 没有id时重刷点云；
            // id不一致时重刷点云；
            // 同一个id时，切换轨迹不重刷点云；
            if (!lastIndexKey ||  lastIndexKey.indexOf(trackid) == -1) {
                this.reset();
                this.renderCloud(this.viewer, trackid);
            }
        },
        
        reset() {
            this.potree && this.potree.removeEntitys();
            this.potree && this.potree.reset();
            if (!this.viewer || !this.viewer.scene.pointclouds.length) return;
            this.viewer.scene.removePointClouds();
            lastIndexKey = null;
            this.viewer.scene.pointclouds.length = 0;
            _material = null;
        },

        initBody: function ($body) {
            var self = this;
            $body.html($potree);

            $body.selectAll('input[type=checkbox]')
                .attr('tabindex', -1)
                .on('focus.pic_player', function () { this.blur(); });

            this.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));


            // Potree.scriptPath = 'http://localhost:1234/build/potree/';
            // Potree.resourcePath = 'http://localhost:1234/resources/';
            // viewer.setServer("http://localhost:3000");

            this.viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
            window.viewer = this.viewer;
            this.viewer.visible = this._pcloudVisible;
            this.viewer.setEDLEnabled(false);
            this.viewer.setFOV(10);
            // this.viewer.useHQ = true;
            this.viewer.setPointBudget(1 * 1000 * 1000);
            this.viewer.loadSettingsFromURL();
            this.viewer.loadGUI(() => {
                this.viewer.setLanguage('en');
                // $("#menu_tools").next().show();
                // $("#menu_scene").next().show();
                // this.viewer.toggleSidebar();
            });

            this.potree = new iD.PotreeConversion(this.viewer, this.context);
            function planarViewActive() {
                var planarView = d3.select('.planarView');
                planarView.classed('active', true);
            }
            function btnActive($btn) {
                $btn.classed('active', true);
                if ($btn.node().parentNode.classList.contains('dropdown-body')) {
                    d3.select($btn.node().parentNode.parentNode).classed('active', true);
                }
            }
            function btnUnActive($btn) {
                $btn.classed('active', false);
                if ($btn.node().parentNode.classList.contains('dropdown-body')) {
                    d3.select($btn.node().parentNode.parentNode).classed('active', false);
                }
            }
            function btnAllUnActive() {
                bodyFooter.selectAll('button').classed('active', false);
                var $drop = bodyFooter.selectAll('.dropdown');
                $drop.size() && $drop.classed('active', false);
            }
            function btnCancelDraw() {
                self.potree.drawing = false;
                if (viewer.measuringTool.measureName) {
                    viewer.dispatchEvent({
                        type: 'cancel_insertions'
                    });
                }
            }

            var bodyFooter = $body.select('#potree_footer');
            bodyFooter.selectAll('button').on('click.potree', (e) => {
                e = e || d3.event;
                var btn = e.target;
                var $btn = d3.select(btn);
                var btnText = e.target.textContent;
                var constant = this.potree.CONSTANT;
                var clickActive = true;
                var tagName = null;
				var isPlanarView = null;
                // 取消
                if ($btn.classed('active')) {
                    btnUnActive($btn);
                    btnCancelDraw();
                    if ((btnText == '顶部视角' || btnText == '左侧视角' || btnText == '右侧视角') && _pic) {
                        iD.util.locationPotree(this.viewer, _pic.pic_point, _pic.wayInfo.K);
                    } else if (btnText == '三视图') {
                        this.viewer.scene.isPlanarView = false;
                        d3.select('#potree_render_text').style('display', 'none');
                        isPlanarView = false;
                    } else if (btnText == '添加节点') {
                        this.viewer.measuringTool.measureName = '';
                    }
                    // 切换按钮清空临时点
                    this.potree.removeTempNode();
                    return;
                }

                switch (btnText) {
                    case '车道线':
                        this.potree.setMouseTool(iD.data.DataType.DIVIDER);
                        tagName = 'divider';
                        break;
                    case '车辙':
                        this.potree.setMouseTool(iD.data.DataType.PAVEMENT_DISTRESS_PL);
                        tagName = 'pavement_distress_pl';
                        break;
                    case '添加节点':
                        this.potree.setMouseTool(constant.GEOMETRY_ADD_NODE);
                        tagName = 'add_node';
                        break;
                    // case '路牌':
                    //     this.potree.setMouseTool(iD.data.DataType.TRAFFICSIGN);
                    //     break;
                    case '桥底面':
                        this.potree.setMouseTool(iD.data.DataType.ROAD_FACILITIES);
                        tagName = 'road_facilities';
                        break;
                    case '桥立面':
                        this.potree.drawSigns(iD.data.DataType.ROAD_FACILITIES_NODE);
                        tagName = 'bridge_facade';
                        break;
                    case '杆顶点':
                        this.potree.setMouseTool(iD.data.DataType.LAMPPOST);
                        tagName = 'lamppost';
                        break;
                    case '控制点':
                        this.potree.setMouseTool(iD.data.DataType.DEFAULT, true);
                        break;
                    case 'BARRIER':
                        this.potree.setMouseTool(iD.data.DataType.BARRIER_GEOMETRY);
                        tagName = 'barrier';
                        break;
                    case '三视图':
                        this.viewer.scene.isPlanarView = true;
                        d3.select('#potree_render_text').style('display', 'block');
                        isPlanarView = true;
                        break;
                    case '测距':
                        this.potree.setMouseTool('Distance');
                        break;
                    case '重置视角':
                        this.viewer && iD.util.locationPotree(this.viewer, _pic.pic_point, _pic.wayInfo.K);
                        tagName = 'resetlook';
                        this.viewer.isTopView = false;
                        break;
                    case '顶部视角':
                        if (this.viewer) {
                            this.viewer.isTopView = true;
                            this.viewer.scene.view.pitch = -Math.PI / 2;
                            this.viewer.scene.view.position.z = 49;
                            console.log(this.viewer.scene.view.position.z)
                        }
                        tagName = 'overlook';
                        break;
                    case '左侧视角':
                        if (this.viewer) {
                            this.viewer.scene.view.yaw = Math.PI / 2;
                            this.viewer.scene.view.pitch = 0;
                            this.viewer.scene.view.position.z = 19.6817;
                        }
                        tagName = 'leftlook';
                        break;
                    case '右侧视角':
                        if (this.viewer) {
                            this.viewer.scene.view.yaw = -Math.PI / 2;
                            this.viewer.scene.view.pitch = 0;
                            this.viewer.scene.view.position.z = 19.6817;
                        }
                        tagName = 'rightlook';
                        break;
                    case '单轨迹点云':
                        this.currentPointCloud();
                        break;
                    case '多轨迹点云':
                        this.wholePointCloud();
                        break;
                    case '底部视角':
                        clickActive = false;
                        this.viewer && this.viewer.setBottomView();
                        break;
                    case '三角牌':
                    case '圆牌':
                    case '矩形牌':
                    case '八角牌':
                        this.potree.drawSigns(iD.data.DataType.TRAFFICSIGN_NODE);
                        tagName = btn.className || null;
                        break;
                    case '交通灯':
                        this.potree.drawSigns(iD.data.DataType.TRAFFICLIGHT_NODE);
                        tagName = btn.className || null;
                        break;
                    case '地面区域':
                        this.potree.drawGroundArea();
                        tagName = btn.className || null;
                        break;
                    case '人行横道':
                        this.potree.setMouseTool(iD.data.DataType.OBJECT_PG);
                        tagName = 'footway';
                        break;
                    case '病害面':
                        this.potree.setMouseTool(iD.data.DataType.PAVEMENT_DISTRESS);
                        tagName = 'pavement_distress';
                        break;
                    case '定位线':
                        this.potree.setMouseTool(iD.data.DataType.OBJECT_PL);
                        tagName = 'positioning_line';
                        break;
                    case '点':
                        this.potree.setMouseTool(iD.data.DataType.OBJECT_PT);
                        tagName = btn.className || null;;
                        break;
                    default:
                        clickActive = false;
                        console.error('匹配错误');
                }
                if (tagName) {
                    //点云视频界面点击按钮埋点
                    iD.picPlayerLogger.potreeHandle({
                        'tag': 'potree_click_' + tagName,
                        'linkage_type': _pic._linkage_pcloud
                    })
                }
                btnAllUnActive();
                if (!_.include(['重置视角', '顶部视角', '左侧视角', '右侧视角', '底部视角'], btnText)) {
                    clickActive && btnActive($btn);
                }
                if (isPlanarView) {
                    planarViewActive();
                }
            });

            // 绘制结束
            this.viewer.addEventListener('end_inserting_measurement', () => {
                btnAllUnActive();
            });
            // 添加节点
            this.viewer.addEventListener('line_marker_added', (e) => {
                // btnAllUnActive();
                // let btn = bodyFooter.select('button.active');
                // 添加节点可继续添加
                // if (btn.size() && btn.node().textContent == '添加节点') {
                this.potree.setMouseTool(this.potree.CONSTANT.GEOMETRY_ADD_NODE);
                // return;
                // }
            });
            // 添加点
            this.viewer.addEventListener('measure_added', (e) => {
                let btn = bodyFooter.select('button.active');
                // 杆顶点可以继续添加
                if (btn.size() && btn.node().textContent == '杆顶点') {
                    this.potree.setMouseTool(iD.data.DataType.LAMPPOST);
                    return;
                }
                //路牌、地面区域相关
                if (e.button == 0 && e.measure && (e.measure.name == iD.data.DataType.TRAFFICSIGN_NODE || e.measure.name == iD.data.DataType.TRAFFICLIGHT_NODE || e.measure.name == iD.data.DataType.OBJECT_PG_NODE || e.measure.name == iD.data.DataType.ROAD_FACILITIES_NODE)) {
                    let p = e.measure.points[0].position;
                    let xyz = [p.x, p.y, p.z];
                    // 过滤重复点
                    let flag = true;
                    for (let d of this.potree.drawTempNodeArr) {
                        if (_.isEqual(d.xyz, xyz)) {
                            flag = false;
                            break;
                        }
                    }
                    if (!flag) {
                        this.potree.removeMeasurement(e.measure);
                    } else {
                        this.potree.drawTempNodeArr.push({
                            xyz: xyz,
                            modelName: e.measure.name,
                            loc: toMap.forward(xyz),
                            measure: e.measure
                        });
                    }

                    if (btn.size()) {
                        if (e.measure.name == iD.data.DataType.TRAFFICSIGN_NODE || e.measure.name == iD.data.DataType.TRAFFICLIGHT_NODE || e.measure.name == iD.data.DataType.ROAD_FACILITIES_NODE) {
                            if (this.potree.drawTempNodeArr.length < 3) {
                                this.potree.setMouseTool(iD.data.DataType.TRAFFICSIGN_NODE);
                                return;
                            } else if (this.potree.drawTempNodeArr.length > 2) {
                                if (btn.node().textContent == '矩形牌' && this.potree.drawTempNodeArr.length < 4) {
                                    this.potree.setMouseTool(iD.data.DataType.TRAFFICSIGN_NODE);
                                    return;
                                } else if (btn.node().textContent == '桥立面' && this.potree.drawTempNodeArr.length < 4) {
                                    this.potree.setMouseTool(iD.data.DataType.ROAD_FACILITIES_NODE);
                                    return;
								} else if (btn.node().textContent == '交通灯' && this.potree.drawTempNodeArr.length < 4) {
                                    // this.potree.setMouseTool(iD.data.DataType.TRAFFICLIGHT_NODE);
                                    // return;
                                    execDraw(this.potree);
                                } else if (btn.node().textContent == '八角牌' && this.potree.drawTempNodeArr.length < 8) {
                                    this.potree.setMouseTool(iD.data.DataType.TRAFFICSIGN_NODE);
                                    return;
                                } else {
                                    execDraw(this.potree);
                                }
                            } else {
                                execDraw();
                            }
                        } else if (e.measure.name == iD.data.DataType.OBJECT_PG_NODE) {
                            if (this.potree.drawTempNodeArr.length < 5) {
                                this.potree.setMouseTool(iD.data.DataType.OBJECT_PG_NODE);
                                return;
                            } else {
                                execDraw(this.potree);
                            }
                        }
                    }
                } else if (e.button == 2 && btn.size() && (btn.node().textContent == '三角牌' || btn.node().textContent == '圆牌' || btn.node().textContent == '矩形牌' || btn.node().textContent == '八角牌' || btn.node().textContent == '交通灯')) {
                    this.potree.setMouseTool(iD.data.DataType.TRAFFICSIGN_NODE);
                    return;
                }

                function execDraw(potree) {
                    if (btn.node().textContent == '三角牌') {
                        potree.createSign('triangle');
                    } else if (btn.node().textContent == '圆牌') {
                        potree.createSign('circle');
                    } else if (btn.node().textContent == '矩形牌') {
                        potree.createSign('rect');
                    } else if (btn.node().textContent == '交通灯') {
                        potree.createSign('trafficlight');
                    } else if (btn.node().textContent == '八角牌') {
                        potree.createSign('octagon');
                    } else if (btn.node().textContent == '地面区域') {
                        potree.createObjectPG();
                    } else if (btn.node().textContent == '桥立面') {
                        potree.createSign('road_facilities');
                    }
                }
                btn.size() && btnUnActive(btn);
            });

            this.viewer.addEventListener('scene_changed', (e) => { });

            //相机控制模式
            this.viewer.setNavigationMode(Potree.EarthControls);
            this.viewer.setMinNodeSize(0);

            let contrastRange = $body.selectAll('.footer-contrast-range');
            contrastRange.on('input', function (data, idx, group) {
                let per = parseFloat(this.value) / parseFloat(this.getAttribute('max'));
                contrastRange.attr('style', 'background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#4a7fec), color-stop(' + Math.max((per - 0.001), 0) + ', #4a7fec), color-stop(' + Math.max((per - 0.0009), 0) + ', #ffffff), to(#ffffff))');
                let v = Number(contrastRange.node().value);
                d3.select('#lblIntensityContrast font').text(v);
                if (_material) {
                    _material.intensityContrast = v;
                }
            });
            $body.selectAll('.footer-img-range').on('input', function (data, idx, group) {
                let per = parseFloat(this.value) / parseFloat(this.getAttribute('max'));
                contrastRange.attr('style', 'background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#4a7fec), color-stop(' + Math.max((per - 0.001), 0) + ', #4a7fec), color-stop(' + Math.max((per - 0.0009), 0) + ', #ffffff), to(#ffffff))');
                d3.select('#lblIntensityImg font').text(per);
                this.viewer && this.viewer.setImageOpacity(per);
                iD.picPlayerLogger.potreeHandle({
                    'tag': 'potree_click_change',
                    'linkage_type': _pic._linkage_pcloud
                })
            });


            $body.select('input.load_live_object')
                .on('change', (e) => {
                    var flag = d3.event.target.checked ? true : false;
                    this.potree.updatePoiCloud(12, flag);
                });

            if (iD.util.urlParamHistory()) {
                $body.selectAll('.his-hide').remove();
            }

            // dropdown 
            $body.selectAll('.dropdown').on('mouseenter', function () {
                d3.select(this).classed('open', true);
            });
            $body.selectAll('.dropdown').on('mouseleave', function () {
                d3.select(this).classed('open', false);
            });
            $body.selectAll('.dropdown-label').on('click', function () {
                var $dropdown = d3.select(this.parentNode);
                if ($dropdown.classed('open')) {
                    $dropdown.classed('open', false);
                } else {
                    $dropdown.classed('open', true);
                }
            });
			
			$('.strength_range').jRange({
				from: 0,
				to: 255,
				step: 1,
				// scale: [0,85,170,255],
				format: '%s',
				width: 120,
				showLabels: true,
				isRange : true,
				onstatechange: function(v){
					var v_arr = v.split(','),
						new_v = [
							Number(v_arr[0]),
							Number(v_arr[1])
						];
					if(viewer && viewer.scene && viewer.scene.pointclouds && viewer.scene.pointclouds[0]){
						viewer.scene.pointclouds[0].material.intensityRange = new_v;
						viewer.isMeasureRender = true;
					}
				}/* ,
				ondragend: function(v){
					console.log(v)
				},
				onbarclicked: function(v){
					console.log(v)
				} */
			});
			
			
            // $bodyFooter.selectAll('.trackIdx').
        },

        show: function () {
            // if (!this.dialog) {
            //     this.initPanel();
            // }
            var self = this;
            self.dialog.open();
            try {
                self.$panelBody.node().focus();
            } catch (e) {
                console.warn(e);
            }
        },

        hide: function () {
            if (!this.dialog) return;
            this.dialog.options.destroyOnClose = false;
            if (this.dialog.isOpen()) {
                this.dialog.close();
            }
            // this.reset();
            // this.$panelBody = null;
            // this.$sidebarTool = null;
            // this.dialog = null;
            // viewer = null;
        },
        // open: function(){
        //     if (!this.dialog) {
        //         this.initPanel();
        //     }
        //     this.dialog.open();
        // },
        close: function () {
            if (!this.dialog) return;
            this.dialog.options.destroyOnClose = true;
            if (this.dialog.isOpen()) {
                this.dialog.close();
            }
            this.reset();
            this.$panelBody = null;
            this.$sidebarTool = null;
            this.dialog = null;
            this.viewer = null;
        },

        disabled: function (graph) {
            if (!this.dialog) return;
            if (this.dialog.isOpen()) {
                this.dialog.close();
            }
            this.reset();
            this.$panelBody = null;
            this.$sidebarTool = null;
            this.dialog = null;
            this.viewer = null;
        }
    });


    function closeSidebarDiv(svgPotree) {
        let $sidebar = svgPotree.$sidebarTool;
        if (!$sidebar || !$sidebar.size()) {
            return;
        }
        $sidebar.selectAll('.sidebar-tab-panel').style('display', 'none');
    }

    function initPotreeSidebar(svgPotree) {
        let potree = svgPotree.potree;
        let dialog = svgPotree.dialog;
        let $sidebar = svgPotree.$sidebarTool = dialog.element.append('div')
            .attr('class', 'sidebar-tool');
        let $filterBtn = $sidebar.append('div').attr('class', 'map-control')
            .append('button').attr('class', 'btn-filter')
            .text('车道过滤');

        let $filterPanel = $sidebar.append('div').attr('class', 'btn-filter-panel sidebar-tab-panel');
        let $filterForm = $filterPanel.append('form').attr('class', 'form').property('noValidate', true);
        let lineFilter = potree.getLineFilter();
        initFormOptions($filterForm, [{
            title: '角度',
            name: 'angle',
            step: 1,
            value: lineFilter.diffAngle()
        }, {
            title: '高度',
            name: 'height',
            step: 0.1,
            value: lineFilter.diffHeight()
        }, {
            title: '应用',
            type: 'button',
            classes: 'submit'
        }]);
        let angleInput = $filterForm.select('input[name=angle]');
        let heightInput = $filterForm.select('input[name=height]');
        $filterForm.select('button.submit').on('click', function () {
            // 重置过滤
            lineFilter.diffAngle(getInputNumber(angleInput, {
                value: lineFilter.diffAngle(),
                min: 0,
                max: 180
            })).diffHeight(getInputNumber(heightInput, {
                value: lineFilter.diffHeight(),
                min: 0
            })).reset();
            // 清空要素
            potree.removeEntitys();
            // 重新渲染
            potree.entityTOpotree(potree.context, potree.viewer);
            // 关闭面板
            // toggleSidebarDiv($filterPanel, $filterBtn, true);
        });

        $sidebar.selectAll('form').on('submit', function () {
            d3.event.stopPropagation();
            d3.event.preventDefault();
            return false;
        });

        $filterBtn.on('click', function () {
            let flag = toggleSidebarDiv($filterPanel, $filterBtn);
            if (flag) {
                angleInput.value(lineFilter.diffAngle());
                heightInput.value(lineFilter.diffHeight());
            }
        });
    }

    function getInputNumber(input, opts = {}) {
        let v = input.value();
        if ((v == '' || isNaN(v)) && opts.value != null) {
            v = opts.value;
        }
        v = Number(v);
        if (opts.min != null) {
            if (v < opts.min) v = opts.min;
        }
        if (opts.max != null) {
            if (v > opts.max) v = opts.max;
        }
        input.node().value = v;
        return v;
    }

    function initFormOptions($form, formOptions) {
        formOptions.forEach(function (d) {
            var $div = $form.append('div').attr('class', 'form-group');
            if (d.type == 'button') {
                $div.append('button')
                    .attr('class', 'btn ' + (d.classes || ''))
                    .attr('title', d.title || '').text(d.title || '');
                return;
            }
            var title = d.title || d.name;
            $div.append('label')
                .attr('for', d.name)
                .text(title);
            $div.append('input')
                .attr('type', 'number')
                .attr('class', 'form-control')
                .attr('name', d.name)
                .attr('placeholder', d.placeholder)
                .attr('value', d.value)
                .attr('step', d.step || '0.1');
        });
    }

    function toggleSidebarDiv(div, target, closeFlag = false) {
        if (div.style('display') != 'none' || closeFlag == true) {
            div.style('display', 'none');
            return false;
        }
        let top = target.node().offsetTop + target.node().offsetHeight;
        let left = 0;
        div.style('top', top + 'px').style('left', left + 'px').style('display', 'block');
        return true;
    }
})(iD);
