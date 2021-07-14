/*
 * @Author: tao.w
 * @Date: 2020-09-02 14:54:09
 * @LastEditors: tao.w
 * @LastEditTime: 2020-09-05 17:40:32
 * @Description: 三维视频窗口
 */

import {
    disease_player
} from '../disease_player.js';
import {
    disease_info
} from '../disease_info.js';
import {
    disease_user
} from '../disease_user.js';

import {
    projection
} from '../get_show_polygon.js';



var cesium_player = {};
var viewer_copy;
var show_type = false;
cesium_player.polygons = {};
cesium_player.current_adcode = null;
cesium_player.last_polygon = null;
cesium_player.hdmap = null;
cesium_player.id = 'threed_map';
cesium_player.viewport_quad = null;
cesium_player._alpha = 100;
let _viewer;
// let _alpha = 1.0;

function initCesium() {
	
	Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns";
    
	let clock = new Cesium.Clock({
        startTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        currentTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        stopTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
        clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        multiplier: 1, // how much time to advance each tick
        shouldAnimate: false // Animation on by default
    });
    //
    var map_proj = new Cesium.GeographicProjection();
    var globe = new Cesium.Globe(map_proj.ellipsoid);
    //#ADADAD
    globe.baseColor = Cesium.Color.fromRgba(0x00000000);//Cesium.Color.DARKSEAGREEN;//Cesium.Color.BLACK;
    globe.enableLighting = true;
    //
	if(viewer_copy){
		viewer_copy.destroy();
		cesium_player.viewport_quad = null;
	}
	
    let viewer = new Cesium.Viewer('threed_map', {
        clockViewModel: new Cesium.ClockViewModel(clock),
        imageryProvider: null,
        terrainProvider: null,// terrainProvider,
        globe: globe,
        shadows: false,
        homeButton: false,
        sceneModePicker: false,
        useBrowserRecommendedResolution: false,
        infoBox: true,
        terrainShadows: false,
        baseLayerPicker: false,
        geocoder: false,
        timeline: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        requestRenderMode: true
    });

    viewer_copy = viewer;
    let scene = viewer.scene;
    scene.fog.enabled = true;
	
	// scene.screenSpaceCameraController.enableRotate = false;
	// scene.screenSpaceCameraController.enableTranslate = false;
	// scene.screenSpaceCameraController.enableZoom = false;
	// scene.screenSpaceCameraController.enableTilt = false;
	
    //显示刷新率和帧率
    //scene.debugShowFramesPerSecond = true;
    globe.enableLighting = true;
    let tiles = disease_user.current_adcode['3d_tiles'];
    cesium_player.current_adcode = disease_user.current_adcode.dataVersion;
    viewer._cesiumWidget._creditContainer.style.display = "none";

    cesium_player.hdmap = new Cesium.Cesium3DTileset({
        url: config_url.datasets_adcode + tiles + '/tileset.json',
        skipLevelOfDetail: true,
        maximumMemoryUsage: 1024
    });
    viewer.scene.primitives.add(cesium_player.hdmap);
    viewer._cesiumWidget._creditContainer.style.display = "none";
	
		
    if (cesium_player.viewport_quad == null) {
        cesium_player.viewport_quad = new Cesium.ViewportQuad();
		cesium_player.viewport_quad.show = false;
        viewer.scene.primitives.add(cesium_player.viewport_quad);
    }

    //默认隐藏影像图
    {
        let imagery_nums = viewer.imageryLayers.length;
        for (let i = 0; i < imagery_nums; i++) {
            viewer.imageryLayers.get(i).show = false;
        }
    }

    return viewer;
}
function updateViewport(K, point, camera_params) {
    if (!cesium_player.viewport_quad) return;
    //
    var quad_width = _viewer.canvas.clientWidth * window.devicePixelRatio;
    var quad_height = _viewer.canvas.clientHeight * window.devicePixelRatio;
    //
    let delta = { 'roll': camera_params.rollDelta, 'azimuth': camera_params.azimuthDelta, 'pitch': camera_params.pitchDelta };

    let current_pos = iD.util.CreateBatchProp(K, point, delta, camera_params.imageWidth, camera_params.imageHeight, camera_params.principlePointX, camera_params.principlePointY);

    if (current_pos['p2'] != undefined && current_pos['p4'] != undefined) {
        let p2 = current_pos['p2'];
        let p4 = current_pos['p4'];
        let pixel2 = _viewer.scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(p2[0], p2[1], p2[2]));
        let pixel4 = _viewer.scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(p4[0], p4[1], p4[2]));
        //
        let width = Math.abs((pixel4.x - pixel2.x) * window.devicePixelRatio);
        let height = Math.abs((pixel4.y - pixel2.y) * window.devicePixelRatio);
        let left = pixel2.x * window.devicePixelRatio;
        let bottom = quad_height - pixel2.y * window.devicePixelRatio;
        //
        cesium_player.viewport_quad.rectangle = new Cesium.BoundingRectangle(left, bottom, width, height);
    } else {
        cesium_player.viewport_quad.rectangle = new Cesium.BoundingRectangle(0, 0, quad_width, quad_height);
    }
    let img_url = config_url.krs + 'image/get?trackPointId=' + point.trackPointId + '&type=00&seq=005&imageType=jpg&token=' + window.token;
	let new_op = cesium_player._alpha / 100;
    cesium_player.viewport_quad.material = new Cesium.Material({
        fabric: {
            type: 'Image',
            uniforms: {
                color: new Cesium.Color(1.0, 1.0, 1.0, new_op),
                image: img_url
            }
        }
    });

}

// 修改图片隐藏显示
cesium_player.change_toggle = function (type) {
	cesium_player.viewport_quad.show = type;
	if(type){
		cesium_player.update();
	}
    viewer_copy.scene.requestRender();
}

// 修改图片透明度
cesium_player.change_alpha = function (op) {
	let new_op = op / 100;
    if (cesium_player.viewport_quad) {
        cesium_player.viewport_quad.material.uniforms.color.alpha = new_op;
        cesium_player._alpha = op;
        _viewer.scene.requestRender();
    }
}

function location(xyz, roll, pitch, yaw) {
    if (!_viewer) return;
    let position = Cesium.Cartesian3.fromDegrees(xyz[0], xyz[1], xyz[2]);
    _viewer.camera.setView({
        destination: position,
        orientation: {
            heading: Cesium.Math.toRadians(yaw), // east, default value is 0.0 (north)
            pitch: Cesium.Math.toRadians(pitch),    // default value (looking down)
            roll: Cesium.Math.toRadians(roll)                            // default value
        }
    });
}

cesium_player.playerInit = function () {
    window.playerCesium = _viewer = initCesium();
}
cesium_player.update = function () {
    let _current_info = disease_info.current_info;
    let _tracklist = disease_player.track_list;
    let _camera_params = disease_player.camera_params;
    let idx = disease_player.current_num;
    if (!_tracklist || !_tracklist.length) return;
    let trackPoint = _tracklist[idx - 1];
    if (!trackPoint) return;
    let _center = [trackPoint.x, trackPoint.y, trackPoint.z];

    var K = projection.cameraParams();

    if (window.playerCesium) {
        location(_center, trackPoint.roll, trackPoint.pitch, trackPoint.azimuth);
    } else {
        window.playerCesium = _viewer = initCesium();
        location(_center, trackPoint.roll, trackPoint.pitch, trackPoint.azimuth);
    }
    updateViewport(K, trackPoint, _camera_params);
    // cesium_player.catchPotreeImage(_tracklist);
    return;
};

/*leaflet地图--覆盖物变化*/
cesium_player.visua_up_map_layer = function () {

};

/*正射图--反投显示*/
cesium_player.road_player = function (type) {

    cesium_player.disease_region();
};

/*病害区域功能操作的相关联逻辑处理*/
cesium_player.disease_region = function () {
    $('.player_video .leaflet-marker-icon').hide();
    $('.player_video svg path').hide();
    if (disease_player.recog_result == '1') {
        $('.player_video .leaflet-marker-icon').show();
    }
    if (disease_player.recog_result == '2') {
        $('.player_video svg path').show();
    }
};
/*缓存巡查影像后续使用的图片*/
cesium_player.catchPotreeImage = function (alldata) {
    var _this = this,
        total_length = alldata.length - 1,
        loadedimages = 0,
        iserr = false,
        init_index = _this.current_num - 1,
        start_index = ((_this.current_num - _this.catch_count) > -1) ? (_this.current_num - _this.catch_count) : 0,
        end_index = ((_this.current_num + _this.catch_count) < total_length) ? (_this.current_num + _this.catch_count) : total_length,
        length = end_index - start_index + 1;

    for (var i = start_index; i <= end_index; i++) {
        var img = new Image(),
            _data = alldata[i],
            track_point_id = _data.trackPointId,
            _src = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg&token=' + window.token;

        img.src = _src;
        if (img.complete) {  		// 如果图片已经存在于浏览器缓存，直接调用回调函数
            imageloadpost();
            continue; 				// 直接返回，不用再处理onload事件
        }
        img.onload = function () {
            imageloadpost();
        }
        img.onerror = function () {
            iserr = true;
            imageloadpost();
        }
    }

    function imageloadpost() {
        loadedimages++;
        if (loadedimages == length) {
            if (iserr) {
                console.warn('视频图片未加载全');
            }
        }
    }

};


export {
    cesium_player
};



