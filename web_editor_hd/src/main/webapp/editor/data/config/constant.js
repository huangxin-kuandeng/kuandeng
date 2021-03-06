/*
 * @Author: tao.w
 * @Date: 2019-10-14 11:21:15
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-21 13:54:21
 * @Description: 
 */
iD.data.Constant = {
    //	"ROADCROSS" : "RoadCross",
    "C_NODE": "C_NODE",
    "ROADNODE": "RoadNode",
    "HIGHWAY": "Highway",
    "LANUSE": "LandUse",
    "ZLEVEL": "ZLevel",
    "ROADRULE": "RoadRule",
    "NODERULE": "NodeRule",
    "SPEEDCAMERA": "SpeedCamera",
    "CROSSRULE": "CrossRule",
    "CROSSMAAT": "CrossMaat",
    "NODEMAAT": "NodeMaat"
};
iD.data.RoleType = {
    "ROAD_ID": "ROAD_ID",
    'FROAD_ID': 'FROAD_ID',
    'C_NODE_ID': 'C_NODE_ID',
    'ROAD_NODE_ID': 'ROAD_NODE_ID',
    'R_TL_LANE_ID': 'R_TL_LANE_ID',
    'TROAD_ID': 'TROAD_ID',
    'NODECONN_ID': 'NODECONN_ID',
    'TURN_GUIDANCE_ID': 'TURN_GUIDANCE_ID',
    'C_NODECONN_ID': 'C_NODECONN_ID',
    'DIVIDER_ID': 'DIVIDER_ID',
    'OBJECT_PL_ID': 'OBJECT_PL_ID',
    'OBJECT_PG_ID': 'OBJECT_PG_ID',
    'JUNCTION_ID': 'JUNCTION_ID',
    'PAVEMENT_DISTRESS_ID': 'PAVEMENT_DISTRESS_ID',
    'PAVEMENT_DISTRESS_NODE_ID': 'PAVEMENT_DISTRESS_NODE_ID',
    'PAVEMENT_DISTRESS_PL_ID': 'PAVEMENT_DISTRESS_PL_ID',
    'PAVEMENT_DISTRESS_PL_NODE_ID': 'PAVEMENT_DISTRESS_PL_NODE_ID',
    'ROAD_ATTRIBUTE_ID': 'ROAD_ATTRIBUTE_ID',
    'DIVIDER_NODE_ID': 'DIVIDER_NODE_ID',
    "NODE": "node",
    "OBJECT_PT_ID": "OBJECT_PT_ID",
    "LIMITHEIGHT_ID": "LIMITHEIGHT_ID",
    "BRIDGE_ID": "BRIDGE_ID",
    "TRAFFICLIGHT_ID": "TRAFFICLIGHT_ID",
    "BRIDGE_NODE_ID": "BRIDGE_NODE_ID",
    "OBJECT_PL_NODE_ID": "OBJECT_PL_NODE_ID",
    "OBJECT_PG_NODE_ID": "OBJECT_PG_NODE_ID",
    "LAMPPOST_ID": "LAMPPOST_ID",
    "TRAFFICSIGN_ID": "TRAFFICSIGN_ID",
    "TRAFFICSIGN_NODE_ID": "TRAFFICSIGN_NODE_ID",
    "TRAFFICLIGHT_NODE_ID": "TRAFFICLIGHT_NODE_ID",
    "LANEA_ID": "LANEA_ID",
    "BARRIER_ID": "BARRIER_ID",
    "BARRIER_GEOMETRY_ID": "BG_ID",
    "ROAD_FACILITIES_ID": 'RF_ID',

    // 
    "LANENODE_ID": "LANENODE_ID",
    "FLANE_ID": "FLANE_ID",
    "TLANE_ID": "TLANE_ID",
    "HD_LANE_ID": "LANE_ID"
};
iD.data.GeoType = {
    '0': 'relation',
    '1': 'area',
    '2': 'line',
    '3': 'area'
}

iD.data.GeomType = {
    "WAY": 'way',
    "RELATION": 'relation',
    "NODE": 'node',
    'MIDPOINT': 'MIDPOINT'
}
iD.data.Model2Role = {
    'BRIDGE_NODE': 'BRIDGE_POINT_ID',
    'LIMITHEIGHT': 'LIMITHEIGHT_ID',
    'LAMPPOST': 'LAMPPOST_ID',
    'TRAFFICLIGHT': 'TRAFFICLIGHT_ID',
    'OBJECT_PG_NODE': 'OBJECT_PG_POINT_ID',
    'OBJECT_PL_NODE': 'OBJECT_PL_POINT_ID',
    'OBJECT_PT': 'OBJECT_PT_ID',
    'TRAFFICSIGN_NODE': 'TRAFFICSIGN_POINT_ID',
    'DIVIDER': 'DIVIDER_ID',
    'DIVIDER_NODE': 'DIVIDER_NODE_ID',
    'ROAD_ATTRIBUTE': 'ROAD_ATTRIBUTE_ID'
}
iD.data.DataType = {
    'DEFAULT': 'DEFAULT',
    'R_SIGN_ROAD':'R_SIGN_ROAD',
    'ROAD': 'ROAD',
    'R_PL_LANE':'R_PL_LANE',
    'C_NODE': 'C_NODE',
    'C_NODECONN': 'C_NODECONN',
    'ROAD_NODE': 'ROAD_NODE',
    'R_TL_LANE': 'R_TL_LANE',
    'R_PG_LANE': 'R_PG_LANE',
    'R_SIGN_LANE': 'R_SIGN_LANE',
    'NODEINFO': 'NODEINFO',
    'ROAD_ATTRIBUTE': 'ROAD_ATTRIBUTE',
    'R_ROAD_DIVIDER': 'R_ROAD_DIVIDER',
    'R_ROAD_RA': 'R_ROAD_RA',
    'R_ROAD': 'R_ROAD',
    "DIVIDER": "DIVIDER",
    'NODECONN': 'NODECONN',
    'R_DIVIDER_JUNCTION': 'R_DIVIDER_JUNCTION',
    'JUNCTION': 'JUNCTION',
    'R_DIVIDER_DREF': 'R_DIVIDER_DREF',
    'R_DIVIDER_OPT': 'R_DIVIDER_OPT',
    'R_TL_STOPLINE': 'R_TL_STOPLINE',
    'R_DIVIDER_OPL': 'R_DIVIDER_OPL',
    'R_DIVIDER_OPG': 'R_DIVIDER_OPG',
    'R_DIVIDER_SIGN': 'R_DIVIDER_SIGN',
    'R_IDIVIDER_OPT': 'R_IDIVIDER_OPT',
    'R_ODIVIDER_OPT': 'R_ODIVIDER_OPT',
    "DIVIDER_NODE": "DIVIDER_NODE",
    "LANDCOVERAREA": "LANDCOVERAREA",
    'DIVIDER_ATTRIBUTE': 'DIVIDER_ATTRIBUTE',
    'LANE_ATTRIBUTE': 'LANE_ATTRIBUTE',
    'LANE_ATTRIBUTE_RESTRICTION': 'LANE_ATTRIBUTE_RESTRICTION',
    'TRAFFIC_SEMANTIC': 'TRAFFIC_SEMANTIC',
    'POI': 'POI',
    'TEXT_MARK': 'TEXT_MARK',
    "HIGHWAY": "Highway",
    "PLACENAME": "PlaceName",
    "SEARCH_POINT": "SearchPoint",
    "TRAFFICRULE": "TRAFFICRULE",
    "C_TRAFFICRULE": "C_TRAFFICRULE",
    'TURN_GUIDANCE': 'TURN_GUIDANCE',
    "TRAFFICSIGN": "TRAFFICSIGN",
    "TRAFFICSIGN_NODE": "TRAFFICSIGN_NODE",
    "OBJECT_PG": "OBJECT_PG",
    "PAVEMENT_DISTRESS": "PAVEMENT_DISTRESS",
    "PAVEMENT_DISTRESS_NODE": "PAVEMENT_DISTRESS_NODE",
    "PAVEMENT_DISTRESS_PL": "PAVEMENT_DISTRESS_PL",
    "PAVEMENT_DISTRESS_PL_NODE": "PAVEMENT_DISTRESS_PL_NODE",
    "OBJECT_PG_NODE": "OBJECT_PG_NODE",
    "OBJECT_PL": "OBJECT_PL",
    "OBJECT_PL_NODE": "OBJECT_PL_NODE",
    "OBJECT_PT": "OBJECT_PT",
    "R_OPT_OPT": "R_OPT_OPT",
    'R_OPT_OPG': 'R_OPT_OPG',
    "R_C_NODE_ROAD_NODE": "R_C_NODE_ROAD_NODE",
    "FUSION_OBJECT_PG": "OBJECT_PG",
    "FUSION_OBJECT_PG_NODE": "OBJECT_PG_NODE",
    "FUSION_OBJECT_PL": "OBJECT_PL",
    "FUSION_OBJECT_PL_NODE": "OBJECT_PL_NODE",
    "FUSION_R_OPT_OPT": "R_OPT_OPT",
    'LANEINFO': 'LANEINFO',
    'C_LANEINFO': 'C_LANEINFO',
    "C_NODEINFO": "C_NODEINFO",
    "LIMITHEIGHT": "LIMITHEIGHT",
    "R_DIVIDER_LH": "R_DIVIDER_LH",
    "BRIDGE": "BRIDGE",
    "BRIDGE_NODE": "BRIDGE_NODE",
    "R_BRIDGE_LH": "R_BRIDGE_LH",
    "TRAFFICLIGHT": "TRAFFICLIGHT",
    "TRAFFICLIGHT_NODE": "TRAFFICLIGHT_NODE",
    // "R_TRAFFICLIGHT_TREF":"R_TRAFFICLIGHT_TREF",
    "R_DIVIDER_TL": "R_DIVIDER_TL",
    "LAMPPOST": "LAMPPOST",
    "R_LAMPPOST_LREF": "R_LAMPPOST_LREF",

    "BARRIER_GEOMETRY": "BARRIER_GEOMETRY",
    'BARRIER_GEOMETRY_NODE': 'BARRIER_GEOMETRY_NODE',
    "R_BARRIER_BREF": "R_BARRIER_BREF",
    "R_BARRIER_DIVIDER": "R_BARRIER_DIVIDER",
    "ROAD_FACILITIES": "ROAD_FACILITIES",
    "ROAD_FACILITIES_NODE": "ROAD_FACILITIES_NODE",
    "R_ROAD_FACILITIES": "R_ROAD_FACILITIES",
    "TOLLGATE": "TOLLGATE",

    // ????????????
    "CHECK_TAG": "CHECK_TAG",
    // ????????????
    "IMAGE_TAG": "IMAGE_TAG",
    // ????????????
    'PICK_MARK_TAG': 'PICK_MARK_TAG',
    // ????????????
    "ANALYSIS_TAG": "ANALYSIS_TAG",
    // ??????????????????
    "QUESTION_TAG": "QUESTION_TAG",
    // ??????????????????
    "AUTO_NETWORK_TAG": "AUTO_NETWORK_TAG",
    // ??????????????????
    "AUTO_CHECKWORK_TAG": "AUTO_CHECKWORK_TAG",
    // ??????????????????
    "NETWORK_TAG": "NETWORK_TAG",

    "POINT_TAG": "POINT_TAG",

    //????????????????????????
    'COMPILE_CHECK_TAG': 'COMPILE_CHECK_TAG',
    //???????????????????????????????????????????????????
    'AUTO_COMPLETECHECK_TAG': 'AUTO_COMPLETECHECK_TAG',

    // ????????????
    'HD_LANE': 'HD_LANE',
    'HD_LANE_NODE': 'HD_LANE_NODE',
    'HD_LANE_CONNECTIVITY': 'HD_LANE_CONNECTIVITY',

    // ??????
    "MEASUREINFO": "MEASUREINFO",

    "ACCURACY_TAG": "ACCURACY_TAG",

    'QUALITY_TAG': 'QUALITY_TAG',

    'DEV_POLYGON_NODE': 'DEV_POLYGON_NODE',
    'DEV_POLYGON': 'DEV_POLYGON',
    'DEV_LINE_NODE': 'DEV_LINE_NODE',
    'DEV_LINE': 'DEV_LINE',

};
iD.data.RoadMerge = {

};
iD.data.asRelations = [iD.data.Constant.C_NODE, iD.data.DataType.C_TRAFFICRULE, iD.data.DataType.TRAFFICRULE];
/*
* 1?????????????????????
* 2?????????????????????
* 3?????????????????????
* 4?????????????????????
* 5????????????
* 6????????????
* */
iD.data.QCTAG = {
    "ROADINFOTAG": "1",
    "CROSSINFOTAG": "2",
    "MULTIINFOTAG": "3",
    "QUESTIONTAG": "4",
    "ADDTAG": "5",
    "MINUSTAG": "6"
};

iD.data.sceneCode = {
    // ???????????????
    'HD_DATA_LANE': 'HD_DATA_LANE',
    // ??????????????????
    'HD_DATA_LO': 'HD_DATA_LO',
    // ?????????????????? -- ??????POC??????
    'HD_DATA': 'HD_DATA'
}
iD.data.sceneDataType = {
    [iD.data.sceneCode.HD_DATA_LANE]: [
        "C_NODE",
        "ROAD_NODE",
        "R_TL_LANE",
        "R_PG_LANE",
        "R_SIGN_LANE",
        "R_C_NODE_ROAD_NODE",
        "ROAD",
        "R_ROAD",
        "C_NODECONN",
        "NODECONN",
        "C_TRAFFICRULE",
        "TRAFFICRULE",
        "TURN_GUIDANCE",
        "C_NODEINFO",
        "NODEINFO",
        "C_LANEINFO",
        "LANEINFO",
        "ROAD_ATTRIBUTE",
        "R_ROAD_RA",
        "DIVIDER",
        "R_ROAD_DIVIDER",
        "R_SIGN_ROAD",
        "R_DIVIDER_DREF",
        "DIVIDER_NODE",
        "DIVIDER_ATTRIBUTE",
        "LANE_ATTRIBUTE",
        "LANE_ATTRIBUTE_RESTRICTION",
        "JUNCTION",
        "R_DIVIDER_JUNCTION",
        "MEASUREINFO",
        'R_TL_STOPLINE',
        'OBJECT_PG',
        'OBJECT_PG_NODE',
        "LIMITHEIGHT",
        "BRIDGE",
        "BRIDGE_NODE",
        "R_BRIDGE_LH",
        "R_DIVIDER_LH",
        "TRAFFICLIGHT",
        "TRAFFICLIGHT_NODE",
        "R_DIVIDER_TL",
        // "BARRIER",
        "BARRIER_GEOMETRY",
        "BARRIER_GEOMETRY_NODE",
        "R_BARRIER_BREF",
        "R_BARRIER_DIVIDER",
        "ROAD_FACILITIES",
        "ROAD_FACILITIES_NODE",
        "R_ROAD_FACILITIES",
        "TOLLGATE",

        "HD_LANE",
        "HD_LANE_NODE",
        "HD_LANE_CONNECTIVITY"
    ],
    [iD.data.sceneCode.HD_DATA_LO]: [
        "OBJECT_PG",
        "R_DIVIDER_OPG",
        "R_DIVIDER_SIGN",
        "OBJECT_PL",
        "R_DIVIDER_OPL",
        "OBJECT_PT",
        "R_DIVIDER_OPT",
        "R_IDIVIDER_OPT",
        "R_ODIVIDER_OPT",
        "R_OPT_OPG",
        "R_OPT_OPT",
        "TRAFFICSIGN",
        "OBJECT_PG_NODE",
        // "LIMITHEIGHT",
        // "TRAFFICLIGHT",
        // "R_TRAFFICLIGHT_TREF",
        // "R_DIVIDER_TL",
        // "BRIDGE",
        // "BRIDGE_NODE",
        // "R_BRIDGE_LH",
        // "R_DIVIDER_LH",
        "LAMPPOST",
        "R_LAMPPOST_LREF",
        "OBJECT_PL_NODE",
        "TRAFFICSIGN_NODE",
        "MEASUREINFO"
    ],
    [iD.data.sceneCode.HD_DATA]: [
        "C_NODE",
        "ROAD_NODE",
        "R_TL_LANE",
        "R_PG_LANE",
        "R_SIGN_LANE",
        "R_C_NODE_ROAD_NODE",
        "ROAD",
        "R_ROAD",
        "C_NODECONN",
        "NODECONN",
        "C_TRAFFICRULE",
        "TRAFFICRULE",
        "TURN_GUIDANCE",
        "C_NODEINFO",
        "NODEINFO",
        "C_LANEINFO",
        "LANEINFO",
        "ROAD_ATTRIBUTE",
        "R_ROAD_RA",
        "DIVIDER",
        "R_ROAD_DIVIDER",
        "R_SIGN_ROAD",
        "R_DIVIDER_DREF",
        "DIVIDER_NODE",
        "DIVIDER_ATTRIBUTE",
        "LANE_ATTRIBUTE",
        "LANE_ATTRIBUTE_RESTRICTION",
        "TRAFFIC_SEMANTIC",
        "OBJECT_PG",
        "R_DIVIDER_OPG",
        "R_DIVIDER_SIGN",
        "OBJECT_PL",
        "R_DIVIDER_OPL",
        "OBJECT_PT",
        "R_DIVIDER_OPT",
        "R_IDIVIDER_OPT",
        "R_ODIVIDER_OPT",
        "R_OPT_OPG",
        "R_OPT_OPT",
        "JUNCTION",
        "R_DIVIDER_JUNCTION",
        "TRAFFICSIGN",
        "OBJECT_PG_NODE",
        "LIMITHEIGHT",
        "R_DIVIDER_LH",
        "TRAFFICLIGHT",
        "TRAFFICLIGHT_NODE",
        "R_TRAFFICLIGHT_TREF",
        "R_DIVIDER_TL",
        "BRIDGE",
        "R_BRIDGE_LH",
        "LAMPPOST",
        "OBJECT_PL_NODE",
        "BRIDGE_NODE",
        "TRAFFICSIGN_NODE",
        "MEASUREINFO",
        "R_LAMPPOST_LREF",
        // "BARRIER",
        "BARRIER_GEOMETRY",
        "BARRIER_GEOMETRY_NODE",
        "R_BARRIER_BREF",
        "R_BARRIER_DIVIDER",
        "ROAD_FACILITIES",
        "ROAD_FACILITIES_NODE",
        "R_ROAD_FACILITIES",
        "TOLLGATE",

        "HD_LANE",
        "HD_LANE_NODE",
        "HD_LANE_CONNECTIVITY"
    ]
}

iD.data.layerTypeName = {
    road: '????????????',
    lane: '?????????',
    pole: '??????/??????',
    ground: '??????',
    sign: '??????',
    lidar_lane: '???????????????',
    lidar_pole: '????????????/??????',
    lidar_ground: '????????????',
    lidar_sign: '????????????',
    lidar_curb: '???????????????',
    lidar_barrier: '????????????',
    lidar_sightline: 'SIGHT_LINE',
    lidar_over_structure: '?????????',
    compile_checkTag: '???????????????',
};
iD.data.LayerDataType = {
    pole: [
        iD.data.DataType.LAMPPOST,
        iD.data.DataType.R_LAMPPOST_LREF,
        iD.data.DataType.MEASUREINFO
    ],
    sign: [
        iD.data.DataType.TRAFFICSIGN,
        iD.data.DataType.TRAFFICSIGN_NODE,
        iD.data.DataType.MEASUREINFO
    ],
    ground: [
        iD.data.DataType.OBJECT_PG,
        iD.data.DataType.OBJECT_PT,
        iD.data.DataType.OBJECT_PG_NODE,
        iD.data.DataType.PAVEMENT_DISTRESS,
        iD.data.DataType.PAVEMENT_DISTRESS_NODE,
        iD.data.DataType.PAVEMENT_DISTRESS_PL,
        iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_pole: [
        iD.data.DataType.LAMPPOST,
        iD.data.DataType.R_LAMPPOST_LREF,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_sign: [
        iD.data.DataType.TRAFFICSIGN,
        iD.data.DataType.TRAFFICSIGN_NODE,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_ground: [
        iD.data.DataType.OBJECT_PG,
        iD.data.DataType.OBJECT_PT,
        iD.data.DataType.OBJECT_PG_NODE,
        iD.data.DataType.PAVEMENT_DISTRESS_NODE,
        iD.data.DataType.PAVEMENT_DISTRESS,
        iD.data.DataType.PAVEMENT_DISTRESS_PL,
        iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_barrier: [
        iD.data.DataType.BARRIER_GEOMETRY,
        iD.data.DataType.BARRIER_GEOMETRY_NODE,
        iD.data.DataType.R_BARRIER_BREF,
        iD.data.DataType.R_BARRIER_DIVIDER,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_sightline: [
        iD.data.DataType.BARRIER_GEOMETRY,
        iD.data.DataType.BARRIER_GEOMETRY_NODE,
        iD.data.DataType.R_BARRIER_BREF,
        iD.data.DataType.R_BARRIER_DIVIDER,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_curb: [
        iD.data.DataType.BARRIER_GEOMETRY,
        iD.data.DataType.BARRIER_GEOMETRY_NODE,
        iD.data.DataType.MEASUREINFO
    ],
    lidar_over_structure: [
        iD.data.DataType.ROAD_FACILITIES,
        iD.data.DataType.ROAD_FACILITIES_NODE,
        iD.data.DataType.R_ROAD_FACILITIES,
        iD.data.DataType.MEASUREINFO
    ],
    compile_checkTag: [
        iD.data.DataType.COMPILE_CHECK_TAG
    ]
};
iD.data.LayerDataType.lane =
    iD.data.LayerDataType.lidar_lane = [
        'C_NODE',
        'ROAD_NODE',
        'R_TL_LANE',
        'R_PG_LANE',
        'R_SIGN_LANE',
        'R_C_NODE_ROAD_NODE',
        'ROAD',
        'R_ROAD',
        'C_NODECONN',
        'NODECONN',
        'C_TRAFFICRULE',
        'TRAFFICRULE',
        'TURN_GUIDANCE',
        'C_NODEINFO',
        'NODEINFO',
        'C_LANEINFO',
        'LANEINFO',
        'ROAD_ATTRIBUTE',
        'R_ROAD_RA',
        'DIVIDER',
        'R_ROAD_DIVIDER',
        'R_SIGN_ROAD',
        'R_DIVIDER_DREF',
        'DIVIDER_NODE',
        'DIVIDER_ATTRIBUTE',
        'LANE_ATTRIBUTE',
        'LANE_ATTRIBUTE_RESTRICTION',
        'R_DIVIDER_OPG',
        'R_DIVIDER_SIGN',
        'OBJECT_PL',
        'R_DIVIDER_OPL',
        // 'OBJECT_PT',
        'R_DIVIDER_OPT',
        'R_IDIVIDER_OPT',
        'R_ODIVIDER_OPT',
        'R_OPT_OPG',
        'R_OPT_OPT',
        'R_TL_STOPLINE',
        'JUNCTION',
        'R_DIVIDER_JUNCTION',
        'LIMITHEIGHT',
        'R_DIVIDER_LH',
        'TRAFFICLIGHT',
        'TRAFFICLIGHT_NODE',
        'R_TRAFFICLIGHT_TREF',
        'R_DIVIDER_TL',
        'BRIDGE',
        'R_BRIDGE_LH',
        'OBJECT_PL_NODE',
        'BRIDGE_NODE',
        // 'R_LAMPPOST_LREF',
        'BARRIER_GEOMETRY',
        'BARRIER_GEOMETRY_NODE',
        'R_BARRIER_BREF',
        'R_BARRIER_DIVIDER',
        'ROAD_FACILITIES',
        'ROAD_FACILITIES_NODE',
        'R_ROAD_FACILITIES',
        'TOLLGATE',
        'MEASUREINFO',

        "HD_LANE",
        "HD_LANE_NODE",
        "HD_LANE_CONNECTIVITY"
    ];
iD.data.LayerDataType.road = iD.data.LayerDataType.lane;

// ????????????
iD.data.edgeLayerDataType = {
    lane: [
        iD.data.DataType.DIVIDER,
        iD.data.DataType.DIVIDER_NODE,
        iD.data.DataType.R_DIVIDER_DREF,
        iD.data.DataType.DIVIDER_ATTRIBUTE,
        iD.data.DataType.LANE_ATTRIBUTE,
        iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION
    ]
};

iD.data.RoadMerge.ignoreFields = ["ID", "FNODE_ID", "TNODE_ID",/*"LENGTH",*/ "VERIFIED", "EDIT_OPER", "VERIFYTIME", "VERIFYUSER",
    "CREATEUSER", "CREATETIME", "UPDATEUSER", "UPDATETIME",/*"ISNEWWAY",*/"ADF_ID"];



iD.data.RoadMerge.compareFields = {
    "WalkLink": ["NAME_CHN", "WF_TYPE", "ISTOLL", "COVERED", "LINK_TYPE", "DIRECTION", "SLOPE", "BLOCK_TYPE", "OWNERSHIP", "ARULE_TIME", "NAVITYPE"],
    "ROAD": ["ALIAS_CHN", "FNAME_CHN", "AVE_LANES", "ROAD_CLASS", "DIRECTION", "FORM_WAY", "WIDTH", "LINK_TYPE", "OWNER_SHIP", "STATUS", "FC",
        "NAME_CHN", "SOURCE_FLAG", "ADAS"]
}

iD.refLayer = {
    "user_feed_back": "user_feed_back",
    "key_projects_tag_point": "key_projects_tag_point",
    "key_projects_tag_line": "key_projects_tag_line",
    "key_projects_tag_polygon": "key_projects_tag_polygon"
};
iD.alert = {};
iD.alert.tip = {
    "operation_create_fake_node_in_crossnode": "??????????????????????????????????????????????????????????????????????????????"
};
iD.tagIndex = {
    "t_user_feedback_pkb_tag": "t_user_feedback_pkb_tag",
    "t_user_feedback_pkb_shp": "t_user_feedback_pkb_shp",
    "t_pkb_shp": "t_pkb_shp",
    "ref_tag": "ref_tag",
    "t_pkb_tag": "t_pkb_tag"
}
iD.way = {},
    iD.way.direction = {
        "twoway": "1",
        "positive": "2",
        "reverse": "3",
        "twowayforbid": "4"
    }

iD.AdasPassword = {
    "password": "ADAS",
}

iD.walkRoadFlag = {
    "WALKROAD": "WALKROAD",
    "ROAD": "ROAD",
}

iD.labels = iD.labels || {};
iD.labels._modelNameMapping = {
    [iD.data.DataType.OBJECT_PT]: iD.data.DataType.OBJECT_PT,
    [iD.data.DataType.LAMPPOST]: iD.data.DataType.LAMPPOST,
    [iD.data.DataType.OBJECT_PT]: iD.data.DataType.OBJECT_PT,
    [iD.data.DataType.OBJECT_PG]: iD.data.DataType.OBJECT_PG,
    [iD.data.DataType.OBJECT_PL]: iD.data.DataType.OBJECT_PL,
    [iD.data.DataType.OBJECT_PL_NODE]: iD.data.DataType.OBJECT_PL_NODE
};

// ?????????????????????Label??????
iD.labels.entityLabelNameMap = {
    [iD.data.DataType.OBJECT_PT]: {
        TYPE: {
            "2": {
                SUBTYPE: {
                    "4": "?????????",
                    "12": "??????",
                    "13": "?????????",
                    "13": "?????????"
                }
            },
            "3": {
                SUBTYPE: {
                    "0": "??????"
                }
            }
        }
    },
    [iD.data.DataType.LAMPPOST]: {
        TYPE: {
            "1": "??????",
            "2": "??????"
        }
    },
    [iD.data.DataType.TRAFFICLIGHT]: '?????????'
    //	[ iD.data.DataType.LIMITHEIGHT ]: '?????????'
};
iD.Mapping = {};
iD.Mapping.aboveGround = {
    "BARRIER_GEOMETRY": {
        '5': ['20'],
        '6': ['21'],
        '4': ['22', '24'],
        '8': ['23'],
        '3': ['25'],
        '14': ['26'],
        '21': ['27'],
        '2': ['28'],
        '9': ['29'],
        '12': ['33'],
        '16': ['35'],
        '15': ['36'],
        '1': ['16'],
        '13': ['98'],
        '10': ['99'],
    },
    "TO_BARRIER_GEOMETRY": {
        '20': '5',
        '21': '6',
        '22': '4',
        '23': '8',
        '24': '4',
        '25': '3',
        '26': '14',
        '27': '21',
        '28': '2',
        '29': '9',
        '33': '12',
        '35': '16',
        '36': '15',
        '16': '1',
        '98': '13',
        '99': '10',
    },
    'OBJECT_PT': ['30']
}

/**
 * iD.data.DataType.OBJECT_PT, ['TYPE', 3], ['SUBTYPE', 0]
 * typeName, typeValue, tagName, tagValue
 * @param {Object} modelName
 */
iD.labels.labelSourceName = function (modelName) {
    var self = this, result = '';
    modelName = self._modelNameMapping[modelName] || modelName;
    var tagMap = self.entityLabelNameMap[modelName];
    if (!tagMap) {
        return result;
    }
    if (typeof tagMap === 'string') {
        result = tagMap;
    }

    var args = _.toArray(arguments);
    args = args.slice(1);
    let subMap = tagMap;
    for (let i in args) {
        let kv = args[i];
        if (kv.length != 2 || typeof kv[0] !== 'string') {
            continue;
        }
        let name = kv[0], value = kv[1];

        subMap = subMap[name];
        if (!subMap) {
            break;
        }
        subMap = subMap[value];
        if (subMap === undefined) {
            break;
        } else if (typeof subMap === 'string') {
            result = subMap;
        }
    }

    return result == null ? '' : result;
};

iD.Constant = iD.Constant || {};

//????????????KEY??????????????????????????????
iD.Constant.DataKeys = [
    //????????????
    {
        'name': 'pointCloudKeys',
        'type': 'key',
        'linkName': 'build_point_cloud_index'
    },
    {
        'name': 'pointCloudKeys',
        'type': 'key',
        'linkName': 'build_laser_dense_cloud_index_v3'
    },
    //???????????????
    {
        'name': 'fusionTaskId',
        'type': 'task',
        'linkName': 'multi_track_fusion'
    },
    {
        'name': 'fusionTaskId',
        'type': 'task',
        'linkName': 'multi_track_fusion_reconstruct'
    },
    // { 
    //     'name': 'multiTrackFusionTaskId',
    //     'type': 'task',
    //     'linkName': 'full_fusion'
    // },
    //??????????????????  
    {
        'name': 'multiTrackLaneTaskId',
        'type': 'task',
        'linkName': 'multi_track_lane'
    },
    //??????????????????   //?????????
    {
        'name': 'laserVerticalView',
        'type': 'task',
        'linkName': 'laser_vertical_view'
    },
    //PLY  
    {
        'name': 'plyKeys',
        'type': 'key',
        'linkName': 'amended_multi_tracks_laser_ground'
    },
    //PLY  
    {
        'name': 'plyKeys',
        'type': 'key',
        'linkName': 'multi_track_ground'
    },
    //?????????mre??????  
    {
        'name': 'orthphotoMreTaskId',
        'type': 'task',
        'linkName': 'multi_tracks_tile'
    },
    {
        'name': 'orthphotoMreTaskId',
        'type': 'task',
        'linkName': 'multi_tracks_tile_reducer'
    },
    //v1??????
    {
        'name': 'orthphotoMreTaskId',
        'type': 'task',
        'linkName': 'orthophoto_tile'
    },
    //v2??????
    {
        'name': 'orthphotoMreTaskId',
        'type': 'task',
        'linkName': 'dense_segment_merge'
    },//v3??????
    {
        'name': 'orthphotoMreTaskId',
        'type': 'task',
        'linkName': 'dense_segment_merge_v3'
    },
    {
        'name': 'orthphotoMreTaskId',
        'type': 'task',
        'linkName': 'multi_tracks_tile_reducer'
    },
    {
        'name': 'distress_segment_merge_v3',
        'type': 'task',
        'linkName': 'road_distress_segment_merge_v3'
    },

    //?????????
    {
        'name': 'orthphotoTaskId',
        'type': 'task',
        'linkName': 'orthphotoTaskId'
    },
    {
        'name': 'laserSplitPly',
        'type': 'task',
        'linkName': 'laser_split_ply'
    },
    //??????ply??????
    {
        'name': 'laserSplitPly',
        'type': 'task',
        'linkName': 'dense_segment_merge'
    },
    //??????ply??????  v3??????
    {
        'name': 'laserSplitPly',
        'type': 'task',
        'linkName': 'dense_segment_merge_v3'
    },
    {
        'name': 'plyKey',
        'type': 'key',
        'linkName': 'camera_height_calc'
    },
    {
        'name': 'laserDepthTaskId',
        'type': 'task',
        'linkName': 'laser_depth_image'
    },
    {
        'name': 'trackEpilineCheck',
        'type': 'task',
        'linkName': 'multi_track_epiline_check'
    },
    //????????????
    {
        'name': 'laserSignElement',
        'type': 'task',
        'linkName': 'laser_sign_element'
    }

]

// modelName: function()=>return {name, value}
iD.labels.effectEntityFilter = {
    _filterMap: {}
};
iD.labels.effectEntityFilter.get = function (modelName) {
    return this._filterMap[modelName];
}
iD.labels.effectEntityFilter.set = function (modelName, filter) {
    if (!(filter instanceof Function)) return;
    this._filterMap[modelName] = function (entity) {
        return Object.assign({
            name: '',
            value: ''
        }, filter(entity));
    }
}
iD.labels.effectEntityFilter.remove = function (modelName) {
    delete this._filterMap[modelName];
}
// ?????????????????????id
iD.labels.effectEntityFilter.set(iD.data.DataType.ANALYSIS_TAG, function (entity) {
    return {
        name: 'id',
        value: iD.Entity.id.toOSM(entity.id)
    };
});

iD._attributeField = iD._attributeField || {};
iD._attributeField.carOptions = [
    {
        id: "0",
        name: '????????????'
    }, {
        id: "1",
        name: '?????????'
    }, {
        id: "2",
        name: '?????????'
    }, {
        id: "3",
        name: '?????????/??????'
    }, {
        id: "4",
        name: '??????/??????'
    }, {
        id: "5",
        name: '???/??????'
    }, {
        id: "6",
        name: '????????????'
    }, {
        id: "7",
        name: '????????????'
    }, {
        id: "8",
        name: '?????????'
    }, {
        id: "9",
        name: '?????????'
    }, {
        id: "10",
        name: '?????????/?????????'
    }, {
        id: "11",
        name: '????????????4????????????'
    }, {
        id: "12",
        name: '?????????????????????'
    }, {
        id: "13",
        name: '??????'
    }, {
        id: "14",
        name: '??????'
    }
];
iD._attributeField.weatherOptions = [
    {
        label: '??????',
        name: 'all',
        value: '0'
    }, {
        label: '??????',
        name: 'sunny',
        value: '1'
    }, {
        label: '??????',
        name: 'rain',
        value: '2'
    }, {
        label: '??????',
        name: 'snow',
        value: '3'
    }, {
        label: '????????????',
        name: 'ice',
        value: '4'
    }, {
        label: '??????',
        name: 'fog',
        value: '5'
    }, {
        label: '???',
        name: 'wind',
        value: '6'
    }, {
        label: '??????',
        name: 'hail',
        value: '7'
    }];



iD.Mapping.canvasColor = {
    '3': [127, 255, 212],// ??????
    '0': [255, 255, 255],
    '1': [0, 139, 139],  // ????????????
    '2': [138, 43, 226],  // ????????????
    '4': [255, 165, 0], // ????????????
    '5': [255, 192, 203],          // ??????
    '6': [128, 128, 0],     // ??????
    '7': [199, 21, 133],      //??????
    '8': [128, 128, 192], // ????????????
    '9': [128, 128, 192]  // ????????????
}
// ???????????????????????????????????????SUBTYPE??????
/*iD.labels.effectEntityFilter.set(iD.data.DataType.OBJECT_PG, function(entity){
    var content = "";
    switch (entity.tags.SUBTYPE) {
        case "1":
            content = "??????";
            break;
        case "2":
            content = "??????";
            break;
        case "3":
            content = "??????";
            break;
        case "4":
            content = "??????";
            break;
        case "5":
            content = "?????????";
            break;
        case "6":
            content = "?????????";
            break;
        case "7":
            content = "????????????";
            break;
        case "8":
            content = "????????????";
            break;
        case "9":
            content = "?????????";
            break;
        case "10":
            content = "???????????????";
            break;
        case "99":
            content = "??????";
            break;
    }
    return {
        name: 'SUBTYPE',
        value: content
    };
});*/
