/**
 * 图层及覆盖物对象模板
 */
iD.store = {};
/**
 * 通用请求地图
 */
iD.store.url = {
	layer: "",
	searchpoi:"http://apis.kd.com/gss/simple"
}

iD.store.qq = {isLoad: false, url: 'http://map.qq.com/api/js?v=2.exp&key=d84d6d83e0e51e481e50454ccbe8986b'};
/**
 * 矢量图层
 */
iD.store.layers = {
	road: {
		id: "904",
		bboxSId:"2102",
		modelSId:"2801",
		saveId: "2105",
		name: "导航路网图层",
		type: "road",
        editable: true,
		display: true,
		split:false,
		isProxy:false,  //数据请求保存是否走代理
		filter : '',
		url: iD.store.url.layer,
		style: {},
		label : {
			fieldKey:'name_chn',
			display:true,
			fontSize:13,
			fill:'#000000'
		},
		showappendant: "1",
		geometry: 'line',
		childSid: "2565",
		dataModelGeoType : {
			nodemaat: "6",
			crossmaat: "8",
			roadnode: "9",
			roadcross: "10",
			NodeRule: "11",
			CrossRule: "12"
		},
		enableBox: true,
		continues: true,
		origCoord : false,
		tagSet: true
	},
	line: {
		id: "921",
		bboxSId:"2102",
		modelSId:"2801",
		saveId: "2105",
		name: "线图层",
		type: "line",
        editable: true,
		display: true,
		isProxy:false, //数据请求保存是否走代理
		filter : '',
		url: iD.store.url.layer,
		label : {
			fieldKey:'name',
			display:true,
			fontSize:13,
			fill:'#000000'
		},
		enableBox: true,
		continues: true,
		origCoord : false,
		tagSet: true
	},
	point: {
		id: "1076",
		bboxSId:"2102",
		modelSId:"2801",
		saveId: "2105",
		name: "点图层",
		type: "point",
		editable: true,
		isProxy:false, //数据请求保存是否走代理
		display: true,
		filter : '',
		url: iD.store.url.layer,
		label : {
			fieldKey:'name',
			display:true,
			fontSize:13,
			fill:'#000000'
		},
		enableBox: true,
		continues: true,
		origCoord : false,
		tagSet: true
	},
	hotSpot: {
		id: "1076",
		//bboxSId:"2102",
		//modelSId:"2801",
		//saveId: "2105",
		name: "热点图层",
		type: "hotspot",
		editable: true,
		isProxy:false,
		//display: true,
		//filter : '',
		dataUrl: iD.store.url.layer,
		tileUrl: iD.store.url.layer
		//label : {
		//	fieldKey:'name',
		//	display:true,
		//	fontSize:13,
		//	fill:'#000000'
		//},
		//enableBox: true,
		//continues: true,
		//origCoord : false
	},
	area: {
		id: "1077",
		bboxSId:"2102",
		modelSId:"2801",
		saveId: "2105",
		name: "面图层",
		type: "area",
		editable: true,
		display: true,
		isProxy:false,
		isTF:false,
		filter : '',
		url: iD.store.url.layer,
		style:{
			"stroke-width": "6px",
			"fill-opacity": 0.6,
			"stroke": "rgb(57, 238, 37)",
			"fill": "rgb(27, 240, 231)"
		},
		label : {
			fieldKey:'name',
			display:true,
			fontSize:13,
			fill:'#000000'
		},
		enableBox: true,
		continues: true,
		origCoord : false,
		tagSet: true
	}
};
/**
 *	影像及覆盖物对象
 */
iD.store.imagery = {
	overlayer:{
		"name": "map overlayer name",
		"type": "tms",
		"description": "",
		"url": "",
		"zooms": [
			0,
			22
		],
		"hotspot":false,
		"id": "overlayer_id",
		"visible": false,
		"terms_url": "",
		"terms_text": "",
		"terms_html": "",
		"isOverlay": true
	},
	imagery:{
		"name": "Map aerial imagery",
		"type": "map_type",
		"description": "",
		"url": "",
		"zooms": [
			0,
			22
		],
		"id": "map_id",
		"visible": false
	}

};

iD.store.roadclass = {
	'41000': 'motorway', //高速
	'42000': 'country', //国道
	'43000': 'trunk', //城市环路、城市快速路
	'44000': 'secondary', //主要道路
	'45000': 'tertiary', //次要道路
	'47000': 'boundary', //一般道路
	'51000': 'power', //省道
	'52000': 'residential', //县道
	'53000': 'natural', //乡村道路
	'54000': 'landuse', //区县内部道路
	'49': 'service', //非导航道路
	'-1': 'service', //非导航道路
	'roadcrossline' : 'roadcrossline',
	'trafficway' : 'trafficway'
};

/**
 * 车道线颜色对应的class
 * 0	未调查	#999999	#d2ae8b
 * 1	白色 		#FFFFFF
 * 2	黄色		#FFFF00
 * 3	橙色 		#FF9900
 * 4	蓝色 		#0080FF
 */
iD.store.dividerAttrColor = {
	'0': 'color-0',
	'1': 'color-1',
	'2': 'color-2',
	'3': 'color-3',
	'4': 'color-4'
};

/**
 * 车道线类型对应的class，在tag_classes.js中使用
 * 0	未调查
 * 1	单实线
 * 2	单虚线
 * 3	双实线
 * 4	双虚线
 */
iD.store.dividerAttrType = {
	'0': 'default',
	'1': 'solid',
	'2': 'dash',
	'3': 'solid',
	'4': 'dash'
};

/**
 * 虚拟分割线类型
 * 0：非虚拟分隔线
 * 1：路口虚拟分隔线
 * 2：缺失虚拟分隔线
 * 3：人工虚拟分隔线
 */
iD.store.dividerAttrVirtual = {
	'0': 'virtual-0',
	'1': 'virtual-1',
	'2': 'virtual-2',
	'3': 'virtual-3'
};

/**
 * Marker及Icon默认样式配置
 */
iD.store.markerstyle = {
	fontStyle : {
		'font-size': '19',
		'font-weight': 'bold',
		'fill': 'red',
		'font-family' : '微软雅黑'
	},
	rectStyle : {
		'fill' : '#267124'  ,
		'opacity':0.5,
		'stroke':'#267124',
		'stroke-width':2
	},
	arrowStyle : {
		'fill' : '#267124'
	}
}
