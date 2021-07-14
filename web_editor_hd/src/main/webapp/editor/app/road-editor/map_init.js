/*
 * @Author: tao.w
 * @Date: 2019-06-06 16:29:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-21 13:53:48
 * @Description: 
 */
/**
 * Created by wt on 2015/9/7.
 */
iD.User.on('login.initmap', function () {


    var Map = new TileLayer({
        "name": "地图",
        "type": "tms",
        "description": "kd map",
        "url": iD.config.URL.kd_map,
        "zooms": [0, 22],
        "id": "Map",
        "order": 3,
        "visible": false,
        "exclusiveIds": ["wms", "google", 'mapbox'],
        "isOverlay": false
    });
    editor.addTileLayer(Map);

    var wmstile = new TileLayer({
        "name": "bing影像",
        "type": "bing",
        "url": iD.config.URL.kd_picture,
        "zooms": [0, 22],
        "id": "wms",
        "exclusiveIds": ["Map", "google", 'mapbox'],
        "visible": false,
    });

    editor.addTileLayer(wmstile);

    var google = new TileLayer({
        "name": "google",
        "type": "tms",
        "url": iD.config.URL.google,
        "zooms": [0, 22],
        "id": "google",
        "exclusiveIds": ["Map", "wms", 'mapbox'],
        "visible": false
    });
    editor.addTileLayer(google);

    var mapbox = new TileLayer({
        "name": "mapbox",
        "type": "tms",
        "url": iD.config.URL.mapbox,
        "zooms": [0, 22],
        "id": "mapbox",
        "exclusiveIds": ["Map", "wms", "google"],
        "visible": false
    });
    editor.addTileLayer(mapbox);


    // var meshWms = new Overlayer({
    //     "name": "图幅号",
    //     "type": "tms",
    //     "url": iD.config.URL.wms_mesh_url,
    //     "zooms": [10, 24],
    //     "id": "meshWms",
    //     "order": 4,
    //     "visible": false
    // });
    // editor.addTileLayer(meshWms);

    var groundMesh = new Overlayer({
        "name": "俯视图",
        "type": "tms",
        "url": "http://192.168.5.32:20530/tile?lid=dianyun&get=map&cache=on&x={x}&y={y}&z={z}",
        'getTileUrl': function (x, y, z) {
            if (!iD.Task.d) return '';
            let url = iD.config.URL.multi_tiles + "x={x}&y={y}&z={z}";
            if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
                url = iD.config.URL.pavement_distrees_multi_tiles + "x={x}&y={y}&z={z}";
            }
            if (iD.Task.d.tags.laserVerticalView) {
                url = url + '&key=' + iD.Task.d.tags.laserVerticalView;
            }
            if (this.height) {
                url = url + '&height=' + this.height;
            }
            if (iD.Task.d.tags.projectId) {
                url = url + '&projectId=' + iD.Task.d.tags.projectId;
            }
            return url.replace('{x}', x)
                .replace('{y}', y)
                .replace('{z}', z)
	            .replace(/\{switch:([^}]+)\}/, function(s, r) {
	                var subdomains = r.split(',');
	                return subdomains[(x + y) % subdomains.length];
	            });
        },
        "zooms": [21, 24],
        "id": "groundMesh",
        "order": 4,
        "visible": false
    });
    editor.addTileLayer(groundMesh);

    var groundMesh = new Overlayer({
        "name": "正射图",
        "type": "tms",
        "url": "http://192.168.5.32:20530/tile?lid=dianyun&get=map&cache=on&x={x}&y={y}&z={z}",
        'getTileUrl': function (x, y, z) {
            if (!iD.Task.d) return '';
          
            let url = iD.config.URL.multi_tiles + "x={x}&y={y}&z={z}";

            if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
                url = iD.config.URL.pavement_distrees_multi_tiles + "x={x}&y={y}&z={z}";
            }

            if (iD.Task.d.tags.orthphotoMreTaskId) {
                url = url + '&key=' + iD.Task.d.tags.orthphotoMreTaskId;
            }else{
                return '';
            }
            if (this.height) {
                url = url + '&height=' + this.height;
            }
            if (iD.Task.d.tags.projectId) {
                url = url + '&projectId=' + iD.Task.d.tags.projectId;
            }
            return url.replace('{x}', x)
                .replace('{y}', y)
                .replace('{z}', z)
	            .replace(/\{switch:([^}]+)\}/, function(s, r) {
	                var subdomains = r.split(',');
	                return subdomains[(x + y) % subdomains.length];
	            });
        },
        "zooms": [21, 25],
        "id": "orthographicMap",
        "order": 4,
        "visible": true
    });
    editor.addTileLayer(groundMesh);

    var aboveGroundMap = new Overlayer({
        "name": "彩色激光正射图",
        "type": "tms",
        "url": "http://192.168.5.32:20530/tile?lid=dianyun&get=map&cache=on&x={x}&y={y}&z={z}",
        'getTileUrl': function (x, y, z) {
            if (!iD.Task.d) return '';
          
            let url = iD.config.URL.multi_tiles + "x={x}&y={y}&z={z}";

            if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
                url = iD.config.URL.pavement_distrees_multi_tiles + "x={x}&y={y}&z={z}";
            }
            
            if (iD.Task.d.tags.laserVerticalView) {
                url = url + '&key=tile_' + iD.Task.d.tags.laserVerticalView;
            }else{
                return '';
            }
            if (this.height) {
                url = url + '&height=' + this.height;
            }
            if (iD.Task.d.tags.projectId) {
                url = url + '&projectId=' + iD.Task.d.tags.projectId;
            }
            return url.replace('{x}', x)
                .replace('{y}', y)
                .replace('{z}', z)
	            .replace(/\{switch:([^}]+)\}/, function(s, r) {
	                var subdomains = r.split(',');
	                return subdomains[(x + y) % subdomains.length];
	            });
        },
        "zooms": [21, 24],
        "id": "aboveGroundMap",
        '_type':'aboveGround',
        "order": 5,
        "visible": true
    });
    editor.addTileLayer(aboveGroundMap);

    var groundMesh1 = new Overlayer({
        "name": "彩色激光正射图",
        "type": "tms",
        "url": "http://10.11.5.84:9999/tile?mid=qingdao_jimo_road&f=png&scale=1&x={x}&y={y}&z={z}",
        "zooms": [16, 20],
        "id": "groundMesh1",
        '_type':'groundMesh1',
        "order": 5,
        "visible": false
    });
    editor.addTileLayer(groundMesh1);
	
    var groundMeshFrame = new Overlayer({
        "name": "任务框",
        "type": "task_frame",
        "url": iD.config.URL.task_frame_map,
        "zooms": [2, 24],
        "id": "task_frame",
        '_type':'task_frame',
        "order": 5,
        "visible": false
    });
    editor.addTileLayer(groundMeshFrame);
	
    var groundMeshutm = new Overlayer({
        "name": "UTM",
        "type": "utm",
        "url": iD.config.URL.utm_map,
        "zooms": [2, 24],
        "id": "utm",
        '_type':'utm',
        "order": 5,
        "visible": false
    });
    editor.addTileLayer(groundMeshutm);

})