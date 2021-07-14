/*
 * @Author: tao.w
 * @Date: 2020-12-01 15:33:27
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-02 16:19:58
 * @Description: 主地图相关
 */

import {
    disease_init
} from './disease_init.js';
import {
    disease_info
} from './disease_info.js';
import {
    disease_group
} from './disease_group.js';
import {
    disease_user
} from './disease_user.js';
import {
    disease_player
} from './disease_player.js';

import { mapInit as mapboxInit } from './map_init';

let _map = null;
let _oldSelectIconLayers = [];
let _oldSelectVectorLayers = [];
var hoveredStateId = null; //鼠标选择要素
var hoveredLayerId = null; //鼠标选择层
var _event = window.event;

var modelMapRelation = {
	1: {
		'TYPE': '702',	//防护设施
		'MODELNAME': 'BARRIER'
	},
	2: {
		'TYPE': '701',	//车道线
		'MODELNAME': 'HD_DIVIDER'
	},
	// 3: '',
	4: {				//里程桩
		'TYPE': '707',
		'MODELNAME': 'HD_POINT'
	},
	5: {				//里程桩
		'TYPE': '707',
		'MODELNAME': 'HD_POLYGON'
	},
	8: {				//路牌
		'TYPE': '704',
		'MODELNAME': 'HD_TRAFFICSIGN'
	},
}
var sourceLayerMapRalation = {
	'HD_POINT': {
		'13': {			//灯杆
			'TYPE': '705',
			'MODELNAME': 'HD_POINT'
		},
		'15': {			//公里里程桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
		'16': {			//百米里程桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
		'21': {			//视频监控
			'TYPE': '706',
			'MODELNAME': 'HD_POINT'
		},
		'22': {			//视频监控
			'TYPE': '706',
			'MODELNAME': 'HD_POINT'
		},
		'23': {			//视频监控
			'TYPE': '706',
			'MODELNAME': 'HD_POINT'
		},
		'115': {			//虚拟公里桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
		'116': {			//虚拟百米桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
	},
	'ROAD': {			//桥隧
		'3': {
			'TYPE': '703',
			'MODELNAME': 'HD_POINT'
		},
		'4': {
			'TYPE': '708',
			'MODELNAME': 'HD_POINT'
		},
	},
	'HD_POLYGON': {			//地面标志
		'TYPE': '708',
		'MODELNAME': 'HD_POLYGON'
	}
}

/**
 * @description: 初始化构建添加底图层
 * @param {*}
 * @return {*}
 */
function initBackgroundStyle() {
    /*天地图URL配置*/
    //TODO  配置应该放在配置文件,暂时先放在这个
    // 在线天地图矢量地图服务(墨卡托投影)
    let TDT_VEC_W = [
        "http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
    ];

    //在线天地图矢量中文标记服务(墨卡托投影)
    //"&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" 
    let TDT_CVA_W = [
        "http://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
    ];

    //在线天地图影像服务地址(墨卡托投影)

    let TDT_IMG_W = [
        "http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
    ];

    //在线天地图影像中文标记服务(墨卡托投影)
    let TDT_CIA_W = [
        "http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
    ];
	
	//资产栅格瓦片
    let DATA_SETS_2D = [];
	if(disease_user.current_adcode){
		DATA_SETS_2D = [
			config_url.vector_tile + 'x={x}&y={y}&z={z}&f=png&scale=1&s=' + disease_user.current_adcode['2d_road_grid_tiles']
		];
	}

    //['vec-w','cva-w','img-w','cia-w']
    let style = {
        "version": 8,
        "sources": {
            "raster-vec-w": {
                "type": "raster",
                'tiles': TDT_VEC_W,
                "tileSize": 256
            },
            "raster-cva-w": {
                "type": "raster",
                'tiles': TDT_CVA_W,
                "tileSize": 256
            },
            "raster-img-w": {
                "type": "raster",
                'tiles': TDT_IMG_W,
                "tileSize": 256
            },
            "raster-cia-w": {
                "type": "raster",
                'tiles': TDT_CIA_W,
                "tileSize": 256
            },
            "data-sets-2d": {
                "type": "raster",
                'tiles': DATA_SETS_2D,
                "tileSize": 256
            },
        },
        "layers": [
            {
                "id": "vec-w",
                "type": "raster",
                "source": "raster-vec-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    // 'visibility': 'none'
                }
            },
            {
                "id": "cva-w",
                "type": "raster",
                "source": "raster-cva-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    // 'visibility': 'none'
                }
            },
            {
                "id": "img-w",
                "type": "raster",
                "source": "raster-img-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    'visibility': 'none'
                }
            },
            {
                "id": "cia-w",
                "type": "raster",
                "source": "raster-cia-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    'visibility': 'none'
                }
            },
            {
                "id": "data-sets-2d",
                "type": "raster",
                "source": "data-sets-2d",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    'visibility': 'none'
                }
            }
        ]
    };
    return style;
}

/* 业务类型: 资产管理, 缓存加载当前所有数据信息 */
var cacheAssetDatas = [];
function loadAssetDataPromise() {
    cacheAssetDatas = [];
    return new Promise(function (resolve, reject) {
        let dataVersion = disease_user.current_adcode.dataVersion;
        let dataCode = Disease.TYPE_LIST.DATACODE;
        let url = config_url.pdds + 'data/' + dataCode + '/query';
        let body = {
            'ops': [{
                'k': 'DATA_VERSION',
                'v': dataVersion,
                'op': 'eq'
            }],
            'returnFields': [
                'TYPE', 'SUBTYPE', 'MP_CODE', 'UP_DOWN', 'UDATE', 'ID', '_OID_', 'MODEL_NAME'
            ]

        }
        $.postAjax({
            'url': url,
            'token': true,
            'data': body,
            'callback': function (data) {
                if (data.code != '0') {
                    $.errorView('浮窗信息数据获取失败：' + data.message);
                    resolve();
                } else {
                    data.result.data.features.forEach(d => {
                        cacheAssetDatas.push(d.properties)
                    })
                    resolve(1);
                }
            }
        })
    });
}


// 查询道路-线
function findLinks(dataVersion) {
	var url = config_url.pdds + 'data/road_link/query';
	var param = {
		'ops': [
			{
				'k': 'DATA_VERSION',
				'type': 'string',
				'v': dataVersion,
				'op': 'eq'
			}
		]
	}
	
    return new Promise((resolve, reject) => {
        $.postAjax({
            'url': url,
			'data': param,
            'token': true,
            'callback': function (data) {
				var datas = data.result.data || {};
                resolve(datas);
            }
        })
    })
}

// 线路删除
function handleRoadRemove(){
	if(_map.getLayer('dash-lines')){
		_map.removeLayer('dash-lines');
		if( _map.getSource('roadLinkDash') ){
			_map.removeSource('roadLinkDash');
		}
	}
	if(_map.getLayer('default-lines')){
		_map.removeLayer('default-lines');
		if( _map.getSource('roadLinkDefault') ){
			_map.removeSource('roadLinkDefault');
		}
	}
}

// 线路删除
function handleRoadHide(zoom){
	let visibility = (zoom > 15) ? 'none' : 'visible';
	if(_map.getLayer('dash-lines')){
		_map.setLayoutProperty('dash-lines', 'visibility', visibility)
	}
	if(_map.getLayer('default-lines')){
		_map.setLayoutProperty('default-lines', 'visibility', visibility)
	}
}

var convergeGroups = [];
var convergeGroupOptions = {
    'LINK_CODE': [9, 10, 11],			//道路聚类
    'KMP_CODE': [12, 13, 14, 15],		//公里桩聚类
    'MP_CODE': [16, 17],				//百米桩聚类
};

function loadConvergeData(type = {}) {
	
    let types = (type.TYPE && type.TYPE.length) ? type.TYPE.join() : '';
	let subtype = type.SUBTYPE || '';
	let linkCode = (type.LINK_CODE && type.LINK_CODE.length) ? type.LINK_CODE.join() : '';
    let dataVersion = disease_user.current_adcode.dataVersion;
    let url = config_url.pdds + Disease.TYPE_LIST.URLS.AGGR + dataVersion + '&types=' + types+ '&subtype=' + subtype + '&linkCodes=' + linkCode;
    $.getAjax({
        'url': url,
        'token': true,
        'callback': function (data) {
            if (data.code != '0' || _.isEmpty(data.result)) {
                console.warn('聚合接口返回异常');
                return;
            }
            let result = data.result;
            let features = [];
            convergeGroups = [];
            _.forEach(result, (v, k) => {

                var zooms = convergeGroupOptions[k];
                var value = [];

                v.forEach(d => {
                    var _code = d.CODE || null;
                    var _count = d.COUNT || 0;
                    var _center = d.CENTROID ? d.CENTROID.split(',') : null;
                    if (_center && _count) {
                        var markDiv = document.createElement("div");
                        markDiv.innerHTML = _count;
                        markDiv.className = 'convergeGroup';
                        markDiv.setAttribute('data-code', _code);
                        var _m = new mapboxgl.Marker({
                            anchor: 'center',
                            element: markDiv
                        }).setLngLat([_center[0], _center[1]])
                        .addTo(_map);
                        value.push(_m)
                    }
                })

                convergeGroups.push({
                    'k': k,
                    'z': zooms,
                    'v': value
                })

            })
            convergeGroupChange();
        }
    })
}

/*地图等级*/
function zoomLevelChange(zoom) {
	
    if (zoom > 19) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = false;
        $('.layer_list li span.radio_label').removeClass('active');
        layerChange(5);
    } else if (zoom < 20) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = true;
        // var _active = $('.layer_list li span.radio_label.active');
        // if (!_active.length) {
            $('.layer_list li span.radio_label[name="' + disease_map.layer_type + '"]').addClass('active');
            layerChange(disease_map.layer_type);
        // }
    }
};

/* 地图缩放等级变化时,聚类实时变化 */
function convergeGroupChange() {
    var zoom_level = $('.cesium_control .zoom_level a').text(),
        _z = Number(zoom_level);
	
	zoomLevelChange(_z);
	
    convergeGroups.forEach(d => {

        let values = d.v;
        let _type = d.z.includes(_z);
        let _style = (_type && !playerPoint) ? 'block' : 'none';
        let value_1 = values[0];
        if (value_1) {
            let value_1_ele = value_1.getElement();
            if (value_1_ele.style.display == _style) {
                return
            }
        }

        values.forEach(v => {

            let _ele = v.getElement();
            if (_ele) {
                _ele.style.display = _style
            }

        })

    })
}


/* 清除当前缓存的聚类 */
function clearConvergeGroup() {
    convergeGroups.forEach(d => {
        let values = d.v;
        values.forEach(v => {
            v.remove && v.remove();
        })
    })
    convergeGroups = [];
}

/* 从地图进入病害界面 */
function playerToTracks(ev){
	
	// let evProp = ev.features[0].properties || {};
	// let sourceLayer = ev.features[0].sourceLayer || null;
	// let evId = evProp.ID;
	// let feaType = evProp.FEA_TYPE;
	// let subType = evProp.TYPE;
	// let evType = null;
	
	getLayerInfo(ev.features);
	return
	let evProp = {"type":"Feature","properties":{"MAX_Y":44.08610060899196,"MAX_X":87.77992381043984,"KMP_CODE":"G3003|99","_OID_":"100000577","UDATE":"1603780724000","TRACK_ID":"204443803_20201020180446920","LINK_CODE":"G3003","MIN_Y":44.08610060899196,"MP_CODE":"G3003|99","MIN_X":87.77992381043984,"_CREATE_TIME_":1604660582787,"ID":"5508365554169367796","CENTROID":"87.77992381043984,44.08610060899196,511.57149172760523","TYPE":"707","GEOM":"POINT(87.77992381043984 44.08610060899196 511.57149172760523)","DATA_TYPE":"MP","MATERIAL":"2","_UPDATE_TIME_":1604660582787,"SUBTYPE":"15","MODEL_NAME":"OBJECT_PT","adcode":"650100","DATA_VERSION":"wlmq_2020_11_06","D_COORDS":"87.77992381043984 44.08610060899196 511.57149172760523","HEIGHT":"1.3352","NAME":"G3003|99","LINK_NAME":"Ｇ３００３绕城高速","T_POINT_ID":"204443803_20201020180456577000","range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"},"geometry":{"type":"Point","coordinates":[87.77992381043984,44.08610060899196,511.57149172760523]},"range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"}
	
	
	var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
		return data.ACTIVE == 'active';
	})
	
	
	disease_init.player_mode_init(active.ID);
	disease_info.come_to_info(evProp,true,true);
				
	
}

/**
 * @description: 清除地图除底图图层外的所有图层和数据
 * @param {*}
 * @return {*}
 */
function clearMapData() {

}

/**
 * @description:  清除图层相关所有的数据
 * @param {*}
 * @return {*}
 */
function removeLayerEvent() {
    for (let i = 0; i < _oldSelectIconLayers.length; i++) {
        _map.off('mouseenter', _oldSelectIconLayers[i][0], iconMouseenter);
        _map.off('mouseleave', _oldSelectIconLayers[i][1], iconMouseleave);
        _map.off('click', _oldSelectIconLayers[i][0], iconMouseClick);
    }

    for (let i = 0; i < _oldSelectVectorLayers.length; i++) {
        _map.off('mousemove', _oldSelectVectorLayers[i], vectorMousemove);
        _map.off('mouseleave', _oldSelectVectorLayers[i], vectormouseleave);
		_map.off('click', _oldSelectVectorLayers[i], vectorMouseClick);
    }
}

/**
 * @description: 图片类渲染要素鼠标点击事件
 * @param {*}
 * @return {*}
 */
//
function iconMouseClick(e) {
    if (e.features.length > 0) {
		
		// addPopup(e);
		playerToTracks(e);
		console.log('点击')
		
    }
}
function vectorMouseClick(e) {
    if (e.features.length > 0) {
		
		// addPopup(e);
		playerToTracks(e);
		console.log('点击')
		
    }
}
/**
 * @description: 图片类渲染要素鼠标移入事件
 * @param {*}
 * @return {*}
 */
//
function iconMouseenter(e) {
    if (e.features.length > 0) {
		addPopup(e);
		
        // var filter1 = e.features.reduce(
        //     function (memo, feature) {
        //         memo.push(feature.properties.ID);
        //         return memo;
        //     },
        //     ['in', 'ID']
        // );
        let feature = e.features[0];
        let filter = ['in', 'ID', feature.properties.ID];
        let id = feature.layer.id + '-highlighted';
        hoveredStateId = id;
        _map.setFilter(id, filter);
    }
}

/**
 * @description: 图片类渲染要素鼠标移出事件
 * @param {*}
 * @return {*}
 */
function iconMouseleave(e) {
    // let id = e.target.painter.id || '';
    if (hoveredStateId != null) {
		
		closePopup();
		
        // id != '' ? _map.setFilter(id, ["in", "ID", '']) : false;
        _map.setFilter(hoveredStateId, ["in", "ID", '']);
        hoveredStateId = null;
    }
    // hoveredStateId = null;
}

function vectorMousemove(e) {
    if (e.features.length > 0) {
		
        if (hoveredStateId && hoveredLayerId) {
            let layer = _map.getLayer(hoveredLayerId);
            _map.setFeatureState(
                {
                    source: layer.source,
                    id: hoveredStateId,
                    sourceLayer: layer.sourceLayer
                },
                { hover: false }
            );
        }
        let feature = e.features[0];
		
		if(hoveredStateId != feature.id || hoveredLayerId != feature.layer.id){
			addPopup(e);
		}
		
        hoveredStateId = feature.id;
        hoveredLayerId = feature.layer.id;
		
        let layer = _map.getLayer(hoveredLayerId);
        _map.setFeatureState(
            {
                source: layer.source,
                id: hoveredStateId,
                sourceLayer: layer.sourceLayer
            },
            { hover: true }
        );
    }
}
function vectormouseleave(e) {
    if (hoveredStateId) {
		
		closePopup();
		
        let layer = _map.getLayer(hoveredLayerId);
        _map.setFeatureState(
            {
                source: layer.source,
                id: hoveredStateId,
                sourceLayer: layer.sourceLayer
            },
            { hover: false }
        );
    }
    hoveredStateId = null;
}


/**
 * @description: 图层鼠标事件初始
 * @param {*} _config
 * @return {*}
 */
function initCustomEvent(_config) {
    let _iconlayers = _config.selectIconLayerIds || [];
    let _vectorLayers = _config.selectHoverEffectLayerIds || [];
    removeLayerEvent();
    for (let i = 0; i < _iconlayers.length; i++) {
        _map.on('mouseenter', _iconlayers[i][0], iconMouseenter);
        _map.on('mouseleave', _iconlayers[i][1], iconMouseleave);
        _map.on('click', _iconlayers[i][0], iconMouseClick);
        _map.on('click', _iconlayers[i][1], iconMouseClick);
    }
    for (let i = 0; i < _vectorLayers.length; i++) {
        _map.on('mousemove', _vectorLayers[i], vectorMousemove);
        _map.on('mouseleave', _vectorLayers[i], vectormouseleave);
        _map.on('click', _vectorLayers[i], vectorMouseClick);
    }
    _oldSelectIconLayers = _iconlayers;
    _oldSelectVectorLayers = _vectorLayers;
}

/**
 * @description: 添加mvt配置数据源
 * @param {*} sources
 * @return {*}
 */
function addSources(sources) {
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    if (_map == null) return false;
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
		// let mvt = Disease.TYPE_LIST.MVT + '' + disease_user.current_adcode.adcode;
		let mvt = (Disease.TYPE_LIST.DATACODE == "pd") ? disease_user.current_adcode['2d_pd_mvt_tiles'] : disease_user.current_adcode['2d_road_mvt_tiles'];
		if( !_map.getSource(source.datasource) ){
			_map.addSource(source.datasource, {
				'type': 'vector',
				'tiles': [config_url.vector_tile + 's=' + mvt + '&get=map&cache=true&f=mvt&x={x}&y={y}&z={z}'],
				// 'tiles': [config_url.vector_tile + 'mid=' + source.datasource_mvt + '&get=map&cache=true&f=mvt&x={x}&y={y}&z={z}'],
				'minzoom': source.zoomRange[0],
				'maxzoom': source.zoomRange[1]
			});
		}
    }
}
/**
 * @description: 删除mvt配置数据源
 * @param {*} sources
 * @return {*}
 */
function removeSources(sources, callback) {
	
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    if (_map == null) return false;
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
		if( _map.getSource(source.datasource) ){
			_map.removeSource(source.datasource);
		}
    }
	callback && callback();
}
/**
 * @description: 添加配置数据图层
 * @param {*} layers
 * @return {*}
 */
function addLayers(layers, toplayerId = null) {
    if (_map == null) return false;
    for (var i in layers) {
        var layer = layers[i];
		if( !_map.getLayer(layer.id) ){
			if (layer.id != toplayerId) {
			    _map.addLayer(layer, toplayerId);
			} else {
			    _map.addLayer(layer);
			}
		}
    }
}
/**
 * @description: 删除配置数据图层
 * @param {*} layers
 * @return {*}
 */
function removeLayers(layers, callback) {
    if (_map == null) return false;
    for (var i in layers) {
        var layer = layers[i];
		if( _map.getLayer(layer.id) ){
			_map.removeLayer(layer.id);
		}
    }
	callback && callback();
}

/* 获取当前所点击要素的数据 */
function getLayerInfo(ev, name){
	
	let dataCode = Disease.TYPE_LIST.DATACODE;
	let evProp = ev[0].properties || {};
	let sourceLayer = ev[0].sourceLayer || null;
	let evId = evProp.ID;
	let feaType = evProp.FEA_TYPE;
	let subType = evProp.TYPE;
	let evType = null;
	let dataVersion = disease_user.current_adcode.dataVersion;
	
	if(dataCode == 'pd'){
		evType = evProp.TYPE;
		subType = evProp.SUBTYPE;
	}else{
		if(sourceLayer == 'firstnode'){
			evType = modelMapRelation[feaType] || null;
		}else if(sourceLayer == 'HD_POLYGON'){
			evType = sourceLayerMapRalation[sourceLayer];
		}else{
			evType = (sourceLayerMapRalation[sourceLayer] && sourceLayerMapRalation[sourceLayer][subType]) ? sourceLayerMapRalation[sourceLayer][subType] : null;
		}
	}
	
	if(!evType){
		$.errorView('无法获取当前要素类型！');
		return;
	}
	let body = {
		'ops': [
			{
				'k': '_OID_',
				'v': evId + '',
				'op': 'eq'
			},
			{
				'k': 'DATA_VERSION',
				'v': dataVersion,
				'op': 'eq'
			}
		]
	}
	if(evType.MODELNAME){
		body.ops.push({
			'k': 'MODEL_NAME',
			'v': evType.MODELNAME,
			'op': 'eq'
		})
	}else if(sourceLayer){
		body.ops.push({
			'k': 'MODEL_NAME',
			'v': sourceLayer,
			'op': 'ieq'
		})
	}
	
	if(evProp.HEIGHT){
		body.ops.push({
			'k': 'HEIGHT',
			'v': evProp.HEIGHT + '',
			'op': 'eq'
		})
	}
	
	loadLayerInfo(body).then((_t) => {
		if(_t){
			var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
				if(name){
					return data.ID == name;
				}
				return data.ACTIVE == 'active';
			})
			
			var info = _t.find(function (data) {
				return data.properties.TRACK_ID;
			})
			if(info){
				var currentInfo = formatProperties(info);
				disease_init.player_mode_init(active.ID);
				disease_info.come_to_info(currentInfo,true,true);
			}
		}
    })
}

/* 格式化原始数据 */
function formatProperties(prop){
	var type_list = Disease.TYPE_LIST.TYPES,
		list_info = Disease.TYPE_LIST.LISTINFO,
		create_time = prop.properties._CREATE_TIME_ || '',
		update_time = prop.properties.UDATE || '',
		type = prop.properties[type_list.KEY],
		layer_type = 'Point',
		data_type = prop.properties[type_list.KEY] || '',
		// mps_xy = prop.properties.CENTROID,
		mps_xy = prop.properties.CENTROID || '',
		center = mps_xy.split(','),
		subtype = prop.properties[list_info.ID] || '',
		geo_range = prop.properties.GEOM || '',
		geo_range_type = $.cesium_range_type(geo_range),
		geo_range_new = $.cesium_range(geo_range),
		link_name = prop.properties.LINK_NAME || '',
		mp_code = prop.properties.MP_CODE || '',
		mp_codes = mp_code.split('|'),
		mp_codes_0 = mp_codes[0] || '',
		mp_codes_1 = mp_codes[1] ? ('K' + mp_codes[1]) : '',
		mp_codes_2 = mp_codes[2] ? ('+' + mp_codes[2] + '00') : '+000',
		mp_codes_2 = mp_code ? mp_codes_2 : '',
		
		up_down = prop.properties.UP_DOWN || '',
		det_time = prop.properties.DET_TIME || '',
		
		_coordinates = [ Number(center[0]), Number(center[1]), (Number(center[2] || 0)) ],
		cn_up_down = Disease.TYPE_LIST.UP_DOWM[up_down] || '',
		cn_type = Disease.TYPE_LIST.TYPES.VALUES[type] || {'INFO':[], 'NAME': '', 'SUBTYPE': {}},
		_cn_type = cn_type.NAME || '',										/*病害类型*/
		cn_subtype = list_info.MAPPING || {},
		_cn_subtype = cn_subtype[subtype] || '',							/*病害等级*/
		cn_mark = mp_codes_0 +' ' + link_name + ' ' + mp_codes_1 + mp_codes_2,		/*地点*/
		cn_mark = mp_code ? cn_mark : '';

	if(Disease.TYPE_LIST.ID == 'ASSET_INSPECTION'){
		if(data_type == '703'){
			layer_type = 'Polygon';
		}else if(data_type == '707'){
			data_type = (data_type + '_' + subtype)
		}
	}

	var utm_arr = [];
	for(let d=0; d<geo_range_new.length; d++){
		var utm_xy = LLtoUTM(geo_range_new[d][0], geo_range_new[d][1]);
		utm_arr.push([
			utm_xy.x, utm_xy.y, geo_range_new[d][2]
		])
	}
	var new_code = prop.properties.LINK_CODE + '_' + prop.properties.MP_CODE;
	var new_data = {
		'range_type': geo_range_type,
		'create_time': create_time ? $.timeData(create_time,0) : '无',
		'update_time': update_time ? $.timeConvert(update_time,0) : '无',
		'det_time': update_time ? $.timeData(update_time,0) : '无',
		'link_code': prop.properties.LINK_CODE + '',
		'new_code': new_code,
		'center_xy': _coordinates,
		'subtype': subtype,
		'_cn_type': _cn_type,
		'_cn_subtype': _cn_subtype,
		'cn_up_down': cn_up_down,
		'cn_mark': cn_mark,
		'locs': geo_range_new,
		'layer_type': layer_type,
		'data_type': data_type,
		'locs_utm': utm_arr,
		'mp_codes_0': mp_codes_0,
		'mp_codes_1': mp_codes_1,
		'mp_codes_2': mp_codes_2
	}

	for(var item in new_data){
		prop.properties[item] = new_data[item];
		prop[item] = new_data[item];
	}
	
	return prop;
}

/* 从后台接口获取数据 */
function loadLayerInfo(body){
    return new Promise(function (resolve, reject) {
        let dataCode = Disease.TYPE_LIST.DATACODE;
        let url = config_url.pdds + 'data/' + dataCode + '/query';
        $.postAjax({
            'url': url,
            'token': true,
            'data': body,
            'callback': function (data) {
                if (data.code != '0') {
                    $.errorView('获取当前要素类型失败：' + data.message);
                    resolve();
                } else {
					var result = data.result.data.features;
                    resolve(result);
                }
            }
        })
    });
}

/**
 * @description: 添加视频播放定位点
 * @param {*} event
 * @return {*}
 */
var playerPoint = null;
var lastRotation = null;
/* 新增 */
function addPlayerPoint(data){
	var coordinates = [ data.coordinates[0], data.coordinates[1] ];
	var rotation = (data.rotation === null) ? lastRotation : (0 - data.rotation);
	if(!playerPoint){
		let playerDiv = document.createElement("div");
		let playerDivImage = document.createElement("div");
		playerDivImage.className = 'playerPoint';
		playerDivImage.style.transform = 'rotate(' + rotation + 'deg)';
		
		playerDiv.appendChild(playerDivImage)
		
		playerPoint = new mapboxgl.Marker({
		    anchor: 'center',
		    element: playerDiv
		})
		.setLngLat( coordinates )
		.addTo(_map);
	}else{
		playerPoint.setLngLat( coordinates )
		playerPoint.getElement().firstChild.style.transform = 'rotate(' + rotation + 'deg)';
	}
	
	_map.setCenter(coordinates);
	lastRotation = rotation;
	
}
/* 删除 */
function removePlayerPoint(){
	playerPoint && playerPoint.remove();
	playerPoint = null;
}


/**
 * @description: 添加信息气泡窗口
 * @param {*} event
 * @return {*}
 */
var popupOffsets = {
	'top': [4, 4],
	'top-left': [-4, 4],
	'top-right': [4, 4],
	'bottom': [0, -4],
	'bottom-left': [4, -4],
	'bottom-right': [-4, -4],
	'left': [4, -50],
	'right': [-4, -50]
};
var popupMarker = null;
var popupMouseType = false;
var evBody = null;
function addPopup(ev = {}) {
	
	
	closePopupTimeOut && clearTimeout(closePopupTimeOut);
	let dataCode = Disease.TYPE_LIST.DATACODE;
	let evProp = ev.features[0].properties || {};
	let sourceLayer = ev.features[0].sourceLayer || null;
	let evId = evProp.ID;
	let feaType = evProp.FEA_TYPE;
	let subType = evProp.TYPE;
	let evType = null;
	
	let evProps = {"type":"Feature","properties":{"MAX_Y":44.08610060899196,"MAX_X":87.77992381043984,"KMP_CODE":"G3003|99","_OID_":"100000577","UDATE":"1603780724000","TRACK_ID":"204443803_20201020180446920","LINK_CODE":"G3003","MIN_Y":44.08610060899196,"MP_CODE":"G3003|99","MIN_X":87.77992381043984,"_CREATE_TIME_":1604660582787,"ID":"5508365554169367796","CENTROID":"87.77992381043984,44.08610060899196,511.57149172760523","TYPE":"707","GEOM":"POINT(87.77992381043984 44.08610060899196 511.57149172760523)","DATA_TYPE":"MP","MATERIAL":"2","_UPDATE_TIME_":1604660582787,"SUBTYPE":"15","MODEL_NAME":"OBJECT_PT","adcode":"650100","DATA_VERSION":"wlmq_2020_11_06","D_COORDS":"87.77992381043984 44.08610060899196 511.57149172760523","HEIGHT":"1.3352","NAME":"G3003|99","LINK_NAME":"Ｇ３００３绕城高速","T_POINT_ID":"204443803_20201020180456577000","range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"},"geometry":{"type":"Point","coordinates":[87.77992381043984,44.08610060899196,511.57149172760523]},"range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"}
	
	disease_map.last_point = evProps;
	
	if(dataCode == 'pd'){
		evType = evProp.TYPE;
		subType = evProp.SUBTYPE;
	}else{
		if(sourceLayer == 'firstnode'){
			evType = modelMapRelation[feaType] ? modelMapRelation[feaType].TYPE : null;
		}else{
			evType = (sourceLayerMapRalation[sourceLayer] && sourceLayerMapRalation[sourceLayer][subType]) ? sourceLayerMapRalation[sourceLayer][subType].TYPE : null;
		}
	}
	
	
	// let data = cacheAssetDatas.find(d => (d.ID == evId)) || { "SUBTYPE": "13", "MP_CODE": "G3003|101|2", "UP_DOWN": "2", "ID": "2364582265951593522", "TYPE": "705", "UDATE": "1603780724000" };
	
	let type_list = Disease.TYPE_LIST,
		subTypeMap = type_list.LISTINFO.MAPPING,
		typeMap = type_list.TYPES.VALUES,
		dataTime = evProp.UDATE ? $.timeConvert(evProp.UDATE, 0) : '无',
		
		dataType = typeMap[evType] ? typeMap[evType].NAME : '',
		dataSubtype = subTypeMap[subType] || '',
		dataSubtypeClass = 'grade_' + subType,
		
		dataMapCode = evProp.MP_CODE ? evProp.MP_CODE.split('|') : [],
		dataMapRoad = dataMapCode[0] || '',
		dataMapK = dataMapCode[1] ? ('K' + dataMapCode[1]) : '',
		dataMapM = '',
		dataUpDown = type_list.UP_DOWM[evProp.UP_DOWN] || '',
		dataStr = '';
	if (evProp.MP_CODE) {
		dataMapM = dataMapRoad[2] ? ('+' + dataMapRoad[2] + '00') : '+000';
		dataStr = dataMapRoad + ' ' + dataMapK + dataMapM + ' ' + dataUpDown;
	}
	
	if(sourceLayer == 'road_adas'){
		dataType = '道路';
	}else if(sourceLayer == 'HD_POLYGON'){
		dataType = '地面标志';
	}
	
    var _cns = [
        { 'id': 'WIDTH', 'name': '路面宽度', 'unit': 'm' },
        { 'id': 'RADIUS', 'name': '转弯半径', 'unit': 'm' },
        { 'id': 'SLOPE', 'name': '坡度', 'unit': '' }
    ]
    // RADIUS: "Infinity"    转弯半径（m）
    // SLOPE: "-0.017119"		坡度
    // WITH: "3.75",            道路宽度（m）

    var text_type = 'type_block';
    var btn_type = 'type_none';
    var _text = '';

    if ( evProp.hasOwnProperty('WIDTH') || evProp.hasOwnProperty('SLOPE') ) {
		
		let width =  Number( evProp.WIDTH) || 0,
			widthCn = '路面宽度',
			widthVal =  Number( width.toFixed(2) ),
			radius = Number( evProp.RADIUS ) || 0,
			radiusCn = '转弯半径',
			radiusVal = Number( Math.abs( radius.toFixed(2) ) ),
			slope = Number( evProp.SLOPE ) || 0,
			slopeCn = '坡度',
			slopeVal = Number( slope.toFixed(2) );
		
		if( radius > 0 ){
			radiusCn = '转弯半径 左转';
		}else if( radius < 0 ){
			radiusCn = '转弯半径 右转';
		}else{
			radiusVal = ' - ';
		}
		
        _text = `
			<span>路面宽度 ${widthVal}m</span>
			<span>${radiusCn} ${radiusVal}m</span>
			<span>坡度 ${slopeVal}m</span>
		`;
        if (evProp.LINK_CODE && evProp.TRACK_ID) {
			text_type = 'type_none';
			btn_type = 'type_block';
        }
    } else {
        text_type = 'type_none';
        btn_type = 'type_block';
    }
	
	// if(data){
		// let subTypeMap = Disease.TYPE_LIST.LISTINFO.MAPPING,
		//     typeMap = Disease.TYPE_LIST.TYPES.VALUES,
		//     dataTime = data.UDATE ? $.timeConvert(data.UDATE, 0) : '无',
		//     dataType = typeMap[data.TYPE] ? typeMap[data.TYPE].NAME : '',
		//     dataSubtype = subTypeMap[data.SUBTYPE] || '',
		//     dataSubtypeClass = 'grade_' + data.SUBTYPE,
		//     dataMapCode = data.MP_CODE ? data.MP_CODE.split('|') : [],
		//     dataMapRoad = dataMapCode[0] || '',
		//     dataMapK = dataMapRoad[1] ? ('K' + dataMapRoad[1]) : '',
		//     dataMapM = '',
		//     dataUpDown = Disease.TYPE_LIST.UP_DOWM[data.UP_DOWN] || '',
		//     dataStr = '';
		// if (data.MP_CODE) {
		// 	dataMapM = dataMapRoad[2] ? ('+' + dataMapRoad[2] + '00') : '+000';
		// 	dataStr = dataMapRoad + ' ' + dataMapK + dataMapM + ' ' + dataUpDown;
		// }
	// }
	
    var _popup = `
		<div class="mapbox_popup">
			<div class="popup_content">
				<h4 class="popup_content_head">
					<b>${dataType}</b>
					<span class="child_body_grade_value ${dataSubtypeClass}">${dataSubtype}</span>
				</h4>
				<p class="child_body_place">
					<span class="icon_image icon_position"></span>
					<span class="child_body_place_type">${dataStr}</span>
				</p>
				<p class="child_body_grade">
					<span class="icon_image icon_time"></span>
					<span class="child_body_grade_time">${dataTime}</span>
				</p>
				<div class="image_buttons image_texts ${text_type}">
					${_text}
				</div>
				<div class="image_buttons ${btn_type}">
				
					${type_list.FUNBUTTON.map(f => `
						<button class="btn ${f.CLASS} ${f.CONTROL}" name="${f.ID}">${f.NAME}</button>
					`).join('')}
					
				</div>
			</div>
		</div>
	`;
	
	if(!popupMarker){
		
		popupMarker = new mapboxgl.Popup({
			closeButton: false,
			className: 'mapbox_popup_dom',
			// anchor: 'top',
			offset: popupOffsets
		}).setLngLat([ ev.lngLat.lng, ev.lngLat.lat ])
		  .setHTML(_popup)
		  .addTo(_map);
		
	}else{
		
		let isOpen = popupMarker.isOpen();
		!isOpen && popupMarker.addTo(_map);
		
		popupMarker.setLngLat([ ev.lngLat.lng, ev.lngLat.lat ]);
		popupMarker.setHTML(_popup);
		
	}
	
	if(ev.features){
		evBody = ev.features;
	}
	
	var popupEle = popupMarker.getElement();
	
	$(popupEle).unbind();
	
	popupEle && popupEle.addEventListener('mouseenter',function(){ popupMouseType = true; });
	popupEle && popupEle.addEventListener('mouseleave',function(){ popupMouseType = false; closePopup(10) });
	
	$(popupEle).click('BUTTON', function(e){
		
		if(evBody && e.target.name){
			
			popupMouseType = false;
			closePopup(10);
			
			let name = e.target.name;
			disease_player.click_types = true;
			disease_init.player_mode_init(name);
			
			// disease_info.come_to_info(disease_map.last_point,true,true);
			
			getLayerInfo(evBody, name)
		}
	})
	
}

/* 关闭信息气泡窗口 */
var closePopupTimeOut = null;
function closePopup(time = 200){
	if(!popupMarker){
		return
	}
	closePopupTimeOut && clearTimeout(closePopupTimeOut);
	closePopupTimeOut = setTimeout(function(){
		!popupMouseType && popupMarker.remove();
	}, time)
	
}

/**
 * @description: 图层控件
 * @param {*} value
 * @return {*}
 */
function layerChange(value, show) {
    // ['img-w', 'cia-w']  //一组
    // ['vec-w', 'cva-w']  //一组
	
    let layer_opt = {
        '1': { 'img-w': false, 'cia-w': false, 'vec-w': true, 'cva-w': true },
        '2': { 'img-w': false, 'cia-w': false, 'vec-w': true, 'cva-w': true },
        '3': { 'img-w': true, 'cia-w': true, 'vec-w': false, 'cva-w': false },
        '4': null,
        '5': { 'img-w': false, 'cia-w': false, 'vec-w': false, 'cva-w': false },
        '6': null
    },
    layers = layer_opt[value] || {};
	
	if (value == '4') {
		let positionMarkLabels = $('.positionMarkLabel');
		let labelDisplay = show ? 'block' : 'none';
	    for (let i = 0; i < positionMarkLabels.length; i++) {
			positionMarkLabels[i].style.display = labelDisplay;
	    }
	}else if(value == '6' || value == '7'){
		let showZoom = show ? 10 : 18;
		handleRoadHide(showZoom);
		$('.lineLayer .radio_label').removeClass('active');
		if(show){
			$('.lineLayer .radio_label[name="7"]').addClass('active');
		}
	}else{
		if (show && value == '1') {
		    $('.dituLayer .radio_label').removeClass('active');
		    $('.dituLayer .radio_label[name="2"]').addClass('active');
		    $('.dituLayer .radio_label.active').attr('name');
		} else if (value == '1') {
		    $('.radio_label').removeClass('active');
		}
		
		for (var id in layers) {
			let visibility = layers[id] ? 'visible' : 'none';
			_map.setLayoutProperty(id, 'visibility', visibility);
		}
	}
	
	
}
function dataLayerChange(z){
	var dataCode = Disease.TYPE_LIST.DATACODE;
	var visibility = 'visible';
	var status = _map.getLayoutProperty('data-sets-2d', 'visibility');
    if ( z < 16 ) {
        visibility = 'none';
    }
	if( dataCode == 'road_asset' ){
		_map.setLayoutProperty('data-sets-2d', 'visibility', 'none');
	}else if( (dataCode == 'pd') && (visibility != status) ){
		_map.setLayoutProperty('data-sets-2d', 'visibility', visibility);
	}
}

function mapClick(e) {

    $('.cesium_popup_mark').hide();
    if (e && e.originalEvent && e.originalEvent.target && (e.originalEvent.target.className.indexOf('convergeGroup') > -1)) {
        console.log('你点击了聚类')
        disease_map.setZoom(18);
        disease_map.setCenter( [e.lngLat.lng, e.lngLat.lat] );
    }

    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    // var features = _map.queryRenderedFeatures(bbox, { layers: ['counties'] });
    // Run through the selected features and set a filter
    // to match features with unique FIPS codes to activate
    // the `counties-highlighted` layer.
    // var filter = features.reduce(function(memo, feature) {
    //     memo.push(feature.properties.FIPS);
    //     return memo;
    // }, ['in', 'FIPS']);

    // console.log('features:',features);
}

function mapEventInit(map) {
    map.on('click', mapClick);
    map.on('zoom', controlZoom);
    map.on('contextmenu', mapMenu);
}

/* 地图ZOOM等级缩放 */
function controlZoom() {
    var zoom = _map.getZoom(),
        roundZoom = Math.round(zoom);
    $('.cesium_control .zoom_level a').html(roundZoom);
	handleRoadHide(roundZoom);
    convergeGroupChange();
    dataLayerChange(roundZoom);
}

/* 地图右键菜单 */
function mapMenu(e) {
    $('.cesium_popup_mark').hide();
    let map_width = $('#cesium_map').width() || 0,
        map_height = $('#cesium_map').height() || 0,
        dom_width = $('#cesium_map_parent').width() || 0,
        dom_height = $('#cesium_map_parent').height() || 0,
        left_width = dom_width - map_width,
        top_height = dom_height - map_height,
        new_left = e.point.x + left_width + 1,
        new_top = e.point.y + top_height + 50;

    $('.cesium_popup_mark').css({
        'top': new_top,
        'left': new_left
    });

    let eDom = e.originalEvent.target,
        eClassName = eDom ? eDom.className : '';
    if (eClassName && eClassName.indexOf('positionMarkLabel') > -1) {
        $('.cesium_popup_mark.remove_mark').show();
        disease_map.right_point = eDom.getAttribute('dataId');
    } else {
        $('.cesium_popup_mark.add_mark').show();
        disease_map.right_point = [e.lngLat.lng, e.lngLat.lat, 0];
    }
}

function hoverLinkCodes(){
	
}


var disease_map = {};

disease_map.right_point = null;
disease_map.last_point = null;			//---高亮的点缓存
disease_map.last_info_point = null;		//---高亮的点缓存
disease_map.load_image = null;;;
disease_map.time_spac = 300;;
disease_map.minZoom = 9;
disease_map.maxZoom = 27;
disease_map.camera_zoom = null;
disease_map.layer_type = '2';

let userinfo = $.getLocalStorage('userInfo') || '{}';
let json_userinfo = JSON.parse(userinfo);
let userName = json_userinfo.userName;

// 线路显示
disease_map.handleRoadData = async function(){
	if(!disease_user.current_adcode || !disease_user.current_adcode.dataVersion){
		$.errorView('获取行政区化失败');
		return;
	}
	handleRoadRemove();
	var dataVersion = disease_user.current_adcode.dataVersion;
    var _datas = await findLinks(dataVersion);
    var _colorSetDefault = {'1': 'rgb(52,176,0)','2': 'rgb(52,176,0)','3': 'rgb(255,142,16)','4': 'rgb(255,142,16)','5': 'rgb(233,3,0)'};
    // 分级：1、优，2、良，3、中，4、次，5、差
    // 配色：优&良 - 绿色 rgb [52 176 0] 中&次 - 橙色 rgb [255 142 16]  差 - 红色 rgb [233 3 0]

	// disease_road_link.line_group = null;

	var roadLinkDefault = {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				
			]
		}
	}
	var roadLinkDash = {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				
			]
		}
	}
	var features = _datas.features || [];
	for(var i=0; i<features.length; i++){
		var geom = features[i].properties.GEOM;
		// var rType = features[i].properties.RTYPE || '1';	//作废 桥隧与普通道路处理方式相同
		var RATING = _colorSetDefault[features[i].properties.RATING] || 'rgb(180,180,180)';	
            var geoJson = $.geoJsonParam({
                'range': geom,
                'type': 'Polyline',
                'weight': 2,
				'datas': features[i].properties,
                'color': RATING
            });
            roadLinkDefault.data.features.push(geoJson);
	}
		
	_map.addSource('roadLinkDash', roadLinkDash);
	_map.addSource('roadLinkDefault', roadLinkDefault);
	_map.addLayer({
		'id': 'dash-lines',
		'type': 'line',
		'source': 'roadLinkDash',
		'paint': {
			'line-width': 6,
			"line-color":   ['get', 'color'],//"#47F9FF",
			"line-dasharray": [2, 2]
		}
	});
	_map.addLayer({
		'id': 'default-lines',
		'type': 'line',
		'source': 'roadLinkDefault',
		'paint': {
			'line-width': 6,
            'line-color': ['get', 'color']//'#FF4057'
        }
	})
}

/* 格式化数据 */
disease_map.formatProperties = function (prop) {
	return formatProperties(prop);
}
/**
 * @description: 加载当前城市全量数据
 */
disease_map.loadAssetDatas = function () {
    // (Disease.TYPE_LIST.DATACODE == 'road_asset') && loadAssetDataPromise().then((_t) => {
    //     _t && console.log('当前城市全量数据已缓存');
    // })
	if( _map && _map.getLayer('data-sets-2d') ){
		if( Disease.TYPE_LIST.DATACODE == 'road_asset' ){
			_map.setLayoutProperty('data-sets-2d', 'visibility', 'none');
		}else{
			_map.setLayoutProperty('data-sets-2d', 'visibility', 'visible');
		}
	}
}
/**
 * @description: 刷新配置数据源
 * @param {*} sources
 * @return {*}
 */
disease_map.updateSources = function (type) {
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    clearConvergeGroup();
    loadConvergeData(type);
	
	let lastConfig = Disease.vector_tile_config[lastId];
	let lastSources = lastConfig.source;
	let lastLayers = lastConfig.layer;
	
	let id = Disease.TYPE_LIST.ID;
	let newConfig = Disease.vector_tile_config[id];
	let newSources = newConfig.source;
	let newLayers = newConfig.layer;
	
	
	removeLayers(lastLayers);
	removeSources(lastSources);
	
	addSources(newSources);
	addLayers(newLayers);
	
	initCustomEvent(newConfig);
	
    lastId = Disease.TYPE_LIST.ID;

}

/**
 * @description: 刷新聚类--数据查询时
 * @param {*} sources
 * @return {*}
 */
disease_map.updateConverges = function (type) {
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    clearConvergeGroup();
    loadConvergeData(type);
}

disease_map.point_to_info = function (type) {
    if (!this.last_point) {
        $.errorView('获取病害信息失败');
        return;
    }
    disease_player.click_types = true;
    $(".cesium_popup").hide();
    disease_init.player_mode_init(type);
    disease_info.come_to_info(this.last_point.datas.index, true, true);
};

disease_map.setCenter = function (xy) {
    _map.setCenter(xy);
}

disease_map.setResize = function () {
    _map && _map.resize();
}

disease_map.setZoom = function (z) {
    _map.setZoom(z);
}

disease_map.addPlayerPoint = function (data) {
    addPlayerPoint(data);
}

disease_map.removePlayerPoint = function () {
    removePlayerPoint();
}



/* 地图控件事件初始化 */
disease_map.control_init = function () {

    /*地图-浮窗-点击打开正射图、采集图、点云图*/
    $('.cesium_popup .popup_content .image_buttons').on('click', 'button', function () {
        let name = this.name;
        _this.point_to_info(name);
    })
    /*地图的缩放按钮*/
    $('.cesium_control .zoom_in a').click(function () {
        var level = $('.cesium_control .zoom_level a').html(),
            new_level = Number(level) + 1;
        if (new_level > disease_map.maxZoom) {
            return;
        }
        disease_map.setZoom(new_level);
    })
    $('.cesium_control .zoom_out a').click(function () {
        var level = $('.cesium_control .zoom_level a').html() - 1;
        if (level < disease_map.minZoom) {
            return;
        }
        disease_map.setZoom(level);
    })
    /*地图的图层按钮*/
    $('.cesium_control .layer_list').mouseleave(function () {
        $('.cesium_control .cesium_layers').removeClass('active');
        $('.cesium_control .layer_list').hide();
    })
    $('.cesium_control .cesium_layers a').click(function () {
        $('.cesium_control .cesium_layers').toggleClass('active');
        $('.cesium_control .layer_list').toggle();
    })
    $('.layer_list li label input').click(function (e) {
        let value = e.target.value,
            checked = e.target.checked,
			new_v = value;
		
		if(value == '1'){
			new_v = checked ? '1' : '5';
		}
        layerChange(new_v, checked);
    })
    $('.layer_list li span.radio_label').click(function (e) {
        let _type = $('.layer_list .checkbox_label input[value="1"]')[0].checked,
			dom = (e.target.localName == 'b') ? e.target.parentNode : e.target,
			value = dom.getAttribute('name'),
		    checked = true,
			view = (value == '7') ? '请先选中检测结果！' : '请先选中底图！';
		
		if(value == '7'){
			_type = $('.layer_list .checkbox_label input[value="6"]')[0].checked;
		}
		
        if (!_type) {
            $.errorView(view);
            return;
        }
		
		if(value != '7'){
			$('.layer_list li.dituLayer span.radio_label').removeClass('active');
			$(dom).addClass('active');
			disease_map.layer_type = value;
		}
		
        layerChange(value, checked);
    })
    /*cesium地图的返回初始按钮*/
    $('.cesium_control .full_screen a').click(function () {
        var _center = disease_user.current_adcode.center,
            new_center = _center ? _center.split(',') : null;
        if (!new_center) {
            $.errorView('当前城市中心点获取失败！');
            return;
        }
        disease_map.setCenter(new_center);
        disease_map.setZoom(9);
    })

}


/**
 * @description:  地图初始化
 * @param {*}
 * @return {*}
 */
var lastId = null;
disease_map.maps_init = function (containerID) {

    let  this_center = disease_user.current_adcode.center.split(',');
    let _center = disease_user.urlCenter?disease_user.urlCenter:this_center;
    lastId = Disease.TYPE_LIST.ID;
    let _config = Disease.vector_tile_config[lastId];
    let topLayer = _config.topLayer;
    let images = _config.images || [];
    let sources = _config.source;
    let layers = _config.layer;
    if (_map == null) {
        let mapStyle = initBackgroundStyle();
        let opt = {
            style: mapStyle,
            center:_center,
        };
        // opt = {}
        _map = mapboxInit(containerID, opt, images);
        mapEventInit(_map);
        window._main_map = _map;
        console.log(_map.loaded());
		if(!disease_user.current_adcode){
			return
		}
        _map.on('load', function () {
            addSources(sources);
            addLayers(layers, topLayer);
            initCustomEvent(_config);
                if(disease_user.urlCenter){
                    window._main_map.setZoom(17);
                }
        });
    }
};


/*自定义标记位置的列表*/
disease_map.loadMarkLabels = function () {
    let _this = this,
        _url = config_url.pdds + Disease.TYPE_LIST.URLS.MAP_MARK,
        _json = { 'ops': [{ 'k': 'USER', 'type': 'string', 'v': userName, 'op': 'eq' }] };

    $.postAjax({
        url: _url,
        data: _json,
        callback: function (data) {
            let features = (data.result && data.result.data) ? data.result.data.features : [];
            _this.mark_points = features;
            for (let i = 0; i < features.length; i++) {
                let id = features[i].properties.ID,
                    classId = 'markLabel_' + id,
                    has_id = $('.' + classId).length,
                    coordinates = features[i].geometry.coordinates;

                if (!has_id) {

                    var markDiv = document.createElement("div");
                    markDiv.className = 'positionMarkLabel ' + classId;
                    markDiv.setAttribute('dataId', id);

                    var _m = new mapboxgl.Marker({
                        anchor: 'bottom',
                        element: markDiv
                    })
                        .setLngLat([coordinates[0], coordinates[1]])
                        .addTo(_map);

                }
            }
            disease_player.mark_type_init();
        }
    })
};

var markBodys = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "USER": null
            },
            "geometry": {
                "coordinates": null,
                "type": "Point"
            }
        }
    ]
};
/*添加标记-取消标记事件*/
disease_map.menuMarks = function (id = false, callback = false) {
    let _url = config_url.pdds + 'data/position_label/create';
    if (id) {
        _url = config_url.pdds + 'data/position_label/deleteById?id=' + disease_map.right_point;
        $.getAjax({
            'url': _url,
            'token': true,
            'callback': function (data) {
                let _type = true;
                if (data.code != '0') {
                    _type = false;
                } else {

                    $('.markLabel_' + disease_map.right_point).remove();
                }
                $.errorView('取消标记' + data.message, _type);
                callback && callback();
            }
        })
    } else {
        markBodys.features[0].properties.USER = userName;
        markBodys.features[0].geometry.coordinates = [
			disease_map.right_point[0],
			disease_map.right_point[1],
			0
		];

        $.postAjax({
            url: _url,
            data: markBodys,
            callback: function (data) {
                let _type = true;
                if (data.code != '0') {
                    _type = false;
                }
                $.errorView('标记' + data.message, _type);
                disease_map.loadMarkLabels();
            }
        })
    }
    $('#cesium_map_parent .cesium_popup_mark').hide();
};

/*鼠标在地图上的右键执行事件*/
disease_map.cesium_popup_mark = function (event) {

    $('.cesium_popup_mark').hide();
    let map_width = $('#cesium_map').width() || 0,
        map_height = $('#cesium_map').height() || 0,
        dom_width = $('#cesium_map_parent').width() || 0,
        dom_height = $('#cesium_map_parent').height() || 0,
        left_width = dom_width - map_width,
        top_height = dom_height - map_height,
        new_left = event.position.x + left_width + 5,
        new_top = event.position.y + top_height + 52,
        picked = _viewer.scene.pick(event.position);

    $('.cesium_popup_mark').css({
        'top': new_top,
        'left': new_left
    });

    if (picked && picked.id && picked.id.mark_type == 'position_label') {
        $('.cesium_popup_mark.remove_mark').show();
        this.right_point = picked.id.id;
    } else {
        $('.cesium_popup_mark.add_mark').show();
        this.right_point = $.get_cesium_xy(event);
    }
};

/*图层列表发生改变时*/
disease_map.layers_changed = function (param) {
    let show = param.checked,
        param_val = param.value,
        layers = _viewer.imageryLayers._layers || [],
        values = _viewer.entities.values || [],
        param_l = {
            '1': { 'tdtImg_c': true, 'tdtCva': true, 'tdtAdcode': true, 'tdtAdcodeM': true },
            '2': { 'tdtAdcode': true, 'tdtAdcodeM': true },
            '3': { 'tdtImg_c': true, 'tdtCva': true },
            '4': null
        };

    if (show && param.value == '1') {
        $('.radio_label').removeClass('active');
        $('.radio_label[name="2"]').addClass('active');
        param_val = $('.radio_label.active').attr('name');
    } else if (param.value == '1') {
        $('.radio_label').removeClass('active');
    }

    if (param.value == '4') {
        for (let i = 0; i < values.length; i++) {
            if (values[i].mark_type == 'position_label') {
                values[i].show = show;
            }
        }
    } else {
        for (let i = 0; i < layers.length; i++) {
            let layer_name = layers[i].imageryProvider._layer,
                createid = layers[i].imageryProvider._credit;
            if (createid && createid._html == 'tile2d') {
                continue;
            }
            if (param.value == '5') {
                layers[i].show = show;
            } else if (param_l[param_val][layer_name]) {
                layers[i].show = show;
            } else {
                layers[i].show = !show;
            }
        }
    }
    $.cesium_refresh();
};

//更改最后一个点的值
disease_map.change_last_point = function (layer) {
    if (this.last_info_point) {

        this.last_info_point._billboard._image._value = this.last_info_point._default_url;
        this.last_info_point._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
        this.last_info_point = null;
    }
    if (layer && layer._billboard) {

        layer._billboard._image._valu = layer._active_url;
        layer._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
        this.last_info_point = layer;
    }
    $.cesium_refresh();
};

/*地图缩放--放大-缩放*/
disease_map.zoomInOut = function (zoom) {
    var height = disease_user.zoomToAltitude(zoom);
    if (height) {
        var center = $.getCenterPoint();
        _viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], height)
        })
    }
};

/*地图等级*/
disease_map.zoom_level = function () {
    var height = _viewer.camera.positionCartographic.height,
        zoom = disease_user.altitudeToZoom(height),
        math_zoom = Math.round(zoom);
    _viewer.camera.mathZoom = math_zoom;
    $('.cesium_control .zoom_level a').html(math_zoom);

    if ((math_zoom > 15) && !window.tile2d.show) {
        window.tile2d.show = true;
    } else if ((math_zoom < 16) && window.tile2d.show) {
        window.tile2d.show = false;
    }

    if (math_zoom > 19) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = false;
        $('.layer_list li span.radio_label').removeClass('active');
        disease_map.layers_changed({
            'value': 5,
            'checked': false
        });
    } else if (math_zoom < 20) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = true;
        var _active = $('.layer_list li span.radio_label.active');
        if (!_active.length) {
            $('.layer_list li span.radio_label[name="' + disease_map.layer_type + '"]').addClass('active');
            disease_map.layers_changed({
                'value': disease_map.layer_type,
                'checked': true
            });
        }
    }

    disease_group.point_group();
};

/*地图气泡方法样式*/
disease_map.cesium_popup = function (param = null) {
    if (param && Cesium.defined(param.picked)) {
        var center = param.picked.id ? param.picked.id._datas.center_xy : param.picked.primitive.datas.center_xy,
            _id = param.picked.id ? param.picked.id._id : param.picked.primitive.datas.ID,
            id = Cesium.defaultValue(param.picked.id, param.picked.primitive.id),
            properties = param.picked.id ? param.picked.id._datas : param.picked.primitive.datas,
            positions = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]),
            position_popup = Cesium.SceneTransforms.wgs84ToWindowCoordinates(param.scene, positions);

        var _this = disease_map;
        var _cns = [
            { 'id': 'WIDTH', 'name': 'WIDTH_CN', 'unit': 'm' },
            { 'id': 'RADIUS', 'name': 'RADIUS_CN', 'unit': 'm' },
            { 'id': 'SLOPE', 'name': 'SLOPE_CN', 'unit': '' }
        ]
        // RADIUS: "Infinity"    转弯半径（m）
        // SLOPE: "-0.017119"		坡度
        // WITH: "3.75",            道路宽度（m）

        if (properties.WIDTH_CN || properties.SLOPE_CN) {

            $('.cesium_popup .popup_content .image_buttons').css('display', 'none');
            $('.cesium_popup .popup_content .image_texts').css('display', 'block');

            let _html = `
				${_cns.map(c => `
					<span>${properties[c.name]} ${properties[c.id]}${c.unit}</span>
				`).join('')}
			`;
            $('.cesium_popup .popup_content .image_texts').html(_html);
            if (properties.LINK_CODE) {
                $('.cesium_popup .popup_content .image_buttons').css('display', 'block');
            }
        } else {
            $('.cesium_popup .popup_content .image_buttons').css('display', 'block');
            $('.cesium_popup .popup_content .image_texts').css('display', 'none');
        }

        if ((id instanceof Cesium.Entity) || (param.picked.primitive && param.picked.primitive.datas)) {
            function positionPopUp(c) {
                var _x = 0,
                    _y = -123,
                    map_width = $('#cesium_map').width(),
                    left_width = $('.cesium_map_left').width(),
                    map_height = $('#cesium_map').height(),
                    type_width = map_width - position_popup.x,
                    type_height = map_height - position_popup.y;
                if (type_width < 289) {
                    _x = -289;
                }
                if (position_popup.y < 115) {
                    _y = 8;
                }

                var x = position_popup.x + _x + left_width,
                    y = position_popup.y + _y;
                $(".cesium_popup").css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
            }
            $(".cesium_popup").show();
            //	        	if(param._id != _id){
            positionPopUp();
            //	       		}
            $('.leaflet-popup-close-button').click(function () {
                $(".cesium_popup").hide();
                return false;
            });
            return id;
        }
    }
};

/*地图气泡内容变化*/
disease_map.cesium_popup_html = function (param) {
    var param_id = param.picked.id ? param.picked.id._id : param.picked.primitive.datas.ID,
        datas = param.picked.id ? param.picked.id.datas : param.picked.primitive.datas,
        update_time = datas.update_time ? datas.update_time.split('/').join('.') : '',
        create_time = new Date(datas.create_time),
        new_create_time = $.timeConvert(create_time, true),
        class_name = 'child_body_grade_value grade_' + datas.subtype,
        info_view_type_2 = datas.mp_codes_0 + ' ' + datas.mp_codes_1 + datas.mp_codes_2 + ' ' + datas.cn_up_down,
        track_point_id = datas.T_POINT_ID,
        place_value = datas.cn_mark + ' ' + datas.cn_up_down,
        track_image_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';

    if (param._id != param_id || datas.TYPE == '703') {
        $('.cesium_popup .popup_content_head b').html(datas._cn_type || '');
        $('.cesium_popup .popup_content_head .child_body_grade_value').html(datas._cn_subtype || '');
        $('.cesium_popup .popup_content_head .child_body_grade_value').attr('class', class_name);

        $('.cesium_popup .child_body_place .child_body_place_type').html(info_view_type_2);
        $('.cesium_popup .child_body_grade .child_body_grade_time').html(datas.update_time);


        /*this.load_image && clearTimeout(this.load_image);
        this.load_image = setTimeout(function(){
            $.getImageToken(
                $('.cesium_popup .popup_img img'),
                track_image_url
            );
        }, this.time_space);*/
    }

    this.cesium_popup(param);
};


/*监听地图变化事件*/
disease_map.listen_cesium_body = function (dom, type) {
    var class_obj = {
        'disease_list': true,
        'disease_info': true,
        //			'disease_player': false
    };
    var width_arr = [],
        dom_width = 0;
    for (var class_name in class_obj) {
        var bound_rect = $('#highway_disease .' + class_name)[0].getBoundingClientRect(),
            display_type = $('#highway_disease .' + class_name).css('display'),
            bound_rect_type = (bound_rect && bound_rect.left < -1) ? false : true,
            width = $('#highway_disease .' + class_name)[0].offsetWidth - 10;

        if (class_name != dom && display_type == 'block' && bound_rect_type) {
            if (class_name == 'screen_model') {
                width += 344;
            }
            width_arr.push(width);
        }
    }
    if (type && class_obj[dom]) {
        dom_width = $('#highway_disease .' + dom)[0].offsetWidth - 10;
    }

    width_arr.push(dom_width);
    width_arr.sort(function (a, b) {
        return b - a;
    });

    var max_width = width_arr[0],
        map_width = 'calc(100% - ' + max_width + 'px)';

    $('#cesium_map_parent .cesium_map_left').width(max_width);
    $('#cesium_map_parent #cesium_map').width(map_width);

	disease_map.setResize();
};


/*执行postrender事件,修改点坐标*/
disease_map.postRender = function () {
    _viewer.scene.postRender.addEventListener(function () {
        if (disease_map.camera_zoom > 17) {
            var entitys = disease_player.current_disease || {};
            for (var id in entitys) {
                var _entity = entitys[id],
                    _show = _entity.show,
                    nodes = _entity._nodes,
                    new_nodes = [],
                    points_center = $.getPointsCenter(nodes, true);

                for (var i = 0; i < nodes.length; i++) {
                    var positions = Cesium.Cartesian3.fromDegrees(nodes[i][0], nodes[i][1], nodes[i][2]);
                    //		    				new_positions = _viewer.scene.clampToHeight(positions, [_entity]);
                    console.log(positions)
                }

            }
        }
    });
};

export {
    disease_map
};

// module.exports = disease_map;






