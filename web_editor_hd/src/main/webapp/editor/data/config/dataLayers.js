/*
 * @Author: tao.w
 * @Date: 2020-10-15 14:27:24
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-26 15:58:17
 * @Description: 
 */
var _dataLayers = {
    "dataLayers": [{
        "title": "",
        "label": "组一",
        "layers": [{
            "name": "车道线",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["lane"],
            "models": ["ROAD_ATTRIBUTE", "DIVIDER", "R_ROAD_DIVIDER",'R_SIGN_ROAD', "R_DIVIDER_DREF", "DIVIDER_NODE", "DN_PRECSION", "R_REF_DIVIDER_NODE", "DIVIDER_ATTRIBUTE", "LANE_ATTRIBUTE", "HD_LANE", "HD_LANE_NODE", "R_LANE_DIVIDER", "HD_LANE_GROUP", "HD_R_LANE_GROUP", "LG_ROADNODE_INDEX", "LANE_ATTRIBUTE_RESTRICTION", "JUNCTION", "R_DIVIDER_JUNCTION", "R_DIVIDER_TL", "R_TL_LANE","R_PG_LANE","R_SIGN_LANE","ADAS_NODE", "R_ADAS_ROAD", "HD_DIVIDER_SCH", "R_DIVIDER_SCH", "HD_LANE_SCH", "R_LANE_SCH", "R_DIVIDER_OPG", "OBJECT_PL", "R_DIVIDER_OPL", "R_DIVIDER_OPT", "R_IDIVIDER_OPT", "R_ODIVIDER_OPT", "R_DIVIDER_SIGN", "R_DIVIDER_LH", "OBJECT_PL_NODE", "R_BARRIER_DIVIDER",
                "TOLLGATE", "R_TL_STOPLINE", "R_PL_LANE", "HD_LANE_CONNECTIVITY", "MEASUREINFO"
            ]
        },
        {
            "name": "护栏",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["lane"],
            "models": ["BARRIER_GEOMETRY", "BARRIER_GEOMETRY_NODE", "R_BARRIER_BREF", "MEASUREINFO"]
        },
        {
            "name": "杆状物",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["pole", "ground"],
            "models": ["OBJECT_PT", "R_OPT_OPG", "R_OPT_OPT", "LAMPPOST", "R_LAMPPOST_LREF", "MEASUREINFO"]
        },
        {
            "name": "路牌/交通灯",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["sign", "lane"],
            "models": ["TRAFFICSIGN", "R_TRAFFICSIGN", "TRAFFICSIGN_INFO", "TRAFFICSIGN_NODE", "TRAFFICLIGHT",
                "TRAFFICLIGHT_NODE", "R_TRAFFICLIGHTGROUP", "R_TRAFFICLIGHTPATH", "TRAFFIC_SEMANTIC", "MEASUREINFO"
            ]
        },
        {
            "name": "地面定位目标",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": ["ground"],
            "types": ["ground"],
            "models": ["OBJECT_PG", "R_OPG_OPG", "OBJECT_PG_NODE", "TRAFFIC_SEMANTIC"]
        },
        {
            "name": "道路上方结构",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["lane"],
            "models": ["LIMITHEIGHT", "BRIDGE", "BRIDGE_NODE", "R_BRIDGE_LH", "ROAD_FACILITIES", "ROAD_FACILITIES_NODE", "R_ROAD_FACILITIES", "MEASUREINFO"
            ]
        },
        {
            "name": "二维路网",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["lane"],
            "models": ["ADMIN_AREA", "ADMIN_AREA_NODE", "RAILWAY", "RAILWAY_NODE", "LANDUSE", "LANDUSE_NODE", "POI",
                "C_NODE", "ROAD_NODE", "R_C_NODE_ROAD_NODE", "ROAD", "C_NODECONN", "NODECONN", "C_TRAFFICRULE", "TRAFFICRULE", "C_NODEINFO", "NODEINFO", "C_LANEINFO", "LANEINFO","R_ROAD", "R_ROAD_RA", "ZLEVEL", "R_ZLEVEL_ROAD"
            ]
        },
        {
            "name": "公路病害",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": [],
            "types": ["ground"],
            "models": ["PAVEMENT_DISTRESS", "PAVEMENT_DISTRESS_NODE", "R_PD_OPT"]
        }
        ]
    },
    {
        "title": "组二",
        "label": "组二",
        "layers": [{
            "name": "问题记录标记",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": ["question_tag"],
            "types": ["question_tag"],
            "models": ["QUESTION_TAG"]
        }, {
            "name": "图像标记",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": ["pick_mark_tag"],
            "types": ["pick_mark_tag"],
            "models": ["PICK_MARK_TAG"]
        }, {
            "name": "质检标",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": ["quality_tag"],
            "types": ["quality_tag"],
            "models": ["QUALITY_TAG"]
        }, {
            "name": "精度标记",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "layerIds": ["accuracy_tag"],
            "types": ["accuracy_tag"],
            "models": ["ACCURACY_TAG"]
        }]
    }
    ],
	"sourceLayers": [{
        "title": "底图层",
        "label": "底图层",
        "layers": [{
            "name": "地图",
            "type": 'Map',
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "影像",
            "type": "wms",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "mapbox",
            "type": 'mapbox',
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "Google",
            "type": "google",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "彩色正射图",
            "type": "aboveGroundMap",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "俯视图",
            "type": "groundMesh",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "临时路网",
            "type": "groundMesh1",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "正射图",
            "type": "orthographicMap",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "图幅号",
            "type": "meshWms",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }, {
            "name": "轨迹",
            "type": "pic",
            "editable": false,
            "display": false,
            "editlock": false,
            "displaylock": false,
            "event": "background",
            "unique": "background",
            "children": [],
            "action": []
        }]
    }]
}
