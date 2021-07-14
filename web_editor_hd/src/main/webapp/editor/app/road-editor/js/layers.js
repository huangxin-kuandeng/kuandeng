/*
 * @Author: tao.w
 * @Date: 2019-08-28 16:31:32
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-21 11:51:31
 * @Description: 
 */
iD.Static = iD.Static || {};
iD.Static.fusionMoreLayers = true;

iD.Static.defaultResource = {
    name: '底图层',
    children: [
        {
            type: 'Map',
            name: '地图',
            event: 'background',
            unique: 'background',
            display: false,
            children: [],
            action: []
        },
        {
            type: 'wms',
            name: '影像',
            event: 'background',
            unique: 'background',
            display: false,
            children: [],
            action: []
        },
        {
            type: 'mapbox',
            name: 'mapbox',
            event: 'background',
            unique: 'background',
            display: false,
            children: [],
            action: []
        },
        {
            type: 'google',
            name: 'Google',
            event: 'background',
            unique: 'background',
            display: false,
            children: [],
            action: []
        },
        {
            type: 'aboveGroundMap',
            name: '彩色正射图',
            event: 'tag',
            display: true,
            children: [],
            action: []
        },
        {
            type: 'groundMesh',
            name: '俯视图',
            event: 'tag',
            display: false,
            children: [],
            action: []
        },
        {
            type: 'groundMesh1',
            name: '临时路网',
            event: 'tag',
            display: false,
            children: [],
            action: []
        },
        {
            type: 'orthographicMap',
            name: '正射图',
            event: 'tag',
            display: true,
            children: [],
            action: []
        },
        {
            type: 'meshWms',
            name: '图幅号',
            event: 'tag',
            display: false,
            children: [],
            action: []
        }
        // ,{
        //     type: 'trackPoint',
        //     name: '轨迹点',
        //     event: 'background',
        //     unique: 'background',
        //     display: true,
        //     children: [],
        //     action: []
        // }
        , {
            type: 'pic',
            name: '轨迹',
            display: true,
            children: [],
            action: []
        }, {
            type: 'task_frame',
            name: '任务框',
            event: 'background',
            unique: 'background',
            display: false,
            children: [],
            action: []
        }, {
            type: 'utm',
            name: 'UTM',
            event: 'background',
            unique: 'background',
            display: false,
            children: [],
            action: []
        }
    ]
};


/*
 defaultElements{
 display:"隐藏和显示"
 children:["点击隐藏显示时候用于关联隐藏和显示,需要配置 entity.modelName，注意大小写，或者统一写成iD.data.DataType.WALKLINK "],
 editable:"用于隐藏显示是否可以编辑，一般配置角色",
 action:"对应的浮在最上方的操作，对应是id.modes里modes中id对应"
 }
 */
iD.Static.fusionModels = [
    //  iD.data.DataType.DIVIDER,
    //  iD.data.DataType.DIVIDER_NODE,
    //  iD.data.DataType.OBJECT_PT,
    //  iD.data.DataType.LAMPPOST,
    //  iD.data.DataType.TRAFFICSIGN,
    //  iD.data.DataType.TRAFFICSIGN_NODE,
    //  iD.data.DataType.DIVIDER_ATTRIBUTE,
    iD.data.DataType.C_NODE,
    iD.data.DataType.ROAD_NODE,
    iD.data.DataType.R_TL_LANE,
    iD.data.DataType.R_PG_LANE,
    iD.data.DataType.R_PL_LANE,
    iD.data.DataType.R_C_NODE_ROAD_NODE,//综合交叉点
    iD.data.DataType.ROAD,
    iD.data.DataType.R_ROAD,
    iD.data.DataType.C_NODECONN,
    iD.data.DataType.NODECONN,
    iD.data.DataType.C_TRAFFICRULE,
    iD.data.DataType.TRAFFICRULE,
    iD.data.DataType.TURN_GUIDANCE,
    iD.data.DataType.C_NODEINFO,
    iD.data.DataType.NODEINFO,
    iD.data.DataType.C_LANEINFO,
    iD.data.DataType.LANEINFO,
    iD.data.DataType.ROAD_ATTRIBUTE,
    iD.data.DataType.R_ROAD_RA,
    iD.data.DataType.R_SIGN_ROAD,
    iD.data.DataType.R_ROAD_DIVIDER,

    iD.data.DataType.DIVIDER,
    iD.data.DataType.R_DIVIDER_DREF,
    iD.data.DataType.DIVIDER_NODE,
    iD.data.DataType.DIVIDER_ATTRIBUTE,
    iD.data.DataType.JUNCTION,
    iD.data.DataType.R_DIVIDER_JUNCTION,
    iD.data.DataType.OBJECT_PL,
    iD.data.DataType.OBJECT_PL_NODE,
    iD.data.DataType.R_DIVIDER_OPL,
    iD.data.DataType.LANE_ATTRIBUTE,
    iD.data.DataType.PAVEMENT_DISTRESS,
    iD.data.DataType.PAVEMENT_DISTRESS_NODE,
    iD.data.DataType.PAVEMENT_DISTRESS_PL,
    iD.data.DataType.PAVEMENT_DISTRESS_PL_NODE,
    iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION,
    iD.data.DataType.LAMPPOST,
    iD.data.DataType.R_LAMPPOST_LREF,
    // iD.data.DataType.OBJECT_PT,
    iD.data.DataType.R_OPT_OPT,
    iD.data.DataType.OBJECT_PG,
    iD.data.DataType.OBJECT_PG_NODE,
    iD.data.DataType.R_DIVIDER_OPG,
    iD.data.DataType.TRAFFICSIGN,
    iD.data.DataType.TRAFFICSIGN_NODE,
    iD.data.DataType.BRIDGE,
    iD.data.DataType.BRIDGE_NODE,
    iD.data.DataType.LIMITHEIGHT,
    iD.data.DataType.R_DIVIDER_LH,
    iD.data.DataType.R_BRIDGE_LH,
    iD.data.DataType.TRAFFICLIGHT,
    iD.data.DataType.TRAFFICLIGHT_NODE,
    // iD.data.DataType.R_TRAFFICLIGHT_TREF,
    iD.data.DataType.R_DIVIDER_TL,
    iD.data.DataType.MEASUREINFO,

    iD.data.DataType.OBJECT_PG,
    iD.data.DataType.OBJECT_PG_NODE,
    iD.data.DataType.TRAFFICSIGN,
    iD.data.DataType.TRAFFICSIGN_NODE,
    iD.data.DataType.TRAFFIC_SEMANTIC
];
//融合
iD.Static.fusionDivider = {
    elements: {
        name: '数据层',
        children: [
            {
                type: 'dividerLine',
                name: '融合成果',
                event: 'roadEdit',
                display: true,
                editable: true,
                tagReadOnly: false,
                children: iD.Static.fusionModels,
                //                 children: [
                //                 	iD.data.DataType.FUSION_DIVIDER,
                //                 	iD.data.DataType.FUSION_DIVIDER_NODE,
                //                     iD.data.DataType.FUSION_OBJECT_PT,
                //                     /*iD.data.DataType.FUSION_OBJECT_PL,*/
                //                    	iD.data.DataType.FUSION_TRAFFICSIGN,
                //                    	iD.data.DataType.FUSION_TRAFFICSIGN_NODE
                //                 ],
                action: ['add-road', 'add-roadcross', 'add-junction']
            }
        ]
    },
    resource: iD.Static.defaultResource
}
//识别
iD.Static.identify = {
    elements: {
        name: '数据层',
        children: [

        ]
    },
    resource: iD.Static.defaultResource
}

iD.Static.defaultRoadModels = [
    iD.data.DataType.C_NODE,
    iD.data.DataType.ROAD_NODE,
    iD.data.DataType.R_C_NODE_ROAD_NODE,//综合交叉点
    iD.data.DataType.ROAD,
    iD.data.DataType.C_NODECONN,
    iD.data.DataType.NODECONN,
    iD.data.DataType.C_TRAFFICRULE,
    iD.data.DataType.TRAFFICRULE,
    iD.data.DataType.TURN_GUIDANCE,
    iD.data.DataType.C_NODEINFO,
    iD.data.DataType.NODEINFO,
    iD.data.DataType.C_LANEINFO,
    iD.data.DataType.LANEINFO,
    iD.data.DataType.ROAD_ATTRIBUTE,
    iD.data.DataType.R_ROAD_RA,
    iD.data.DataType.R_SIGN_ROAD,
    iD.data.DataType.R_ROAD_DIVIDER
];
iD.Static.defaultDividerModels = [
    iD.data.DataType.DIVIDER,
    iD.data.DataType.R_DIVIDER_DREF,
    iD.data.DataType.DIVIDER_NODE,
    iD.data.DataType.DIVIDER_ATTRIBUTE,
    iD.data.DataType.JUNCTION,
    iD.data.DataType.R_DIVIDER_JUNCTION,
    iD.data.DataType.OBJECT_PL,
    iD.data.DataType.OBJECT_PL_NODE,
    iD.data.DataType.R_DIVIDER_OPL,
    iD.data.DataType.LANE_ATTRIBUTE,
    iD.data.DataType.LANE_ATTRIBUTE_RESTRICTION,
    iD.data.DataType.TRAFFIC_SEMANTIC,
    iD.data.DataType.LAMPPOST,
    iD.data.DataType.R_LAMPPOST_LREF,
    // iD.data.DataType.OBJECT_PT,
    iD.data.DataType.R_OPT_OPT,
    iD.data.DataType.OBJECT_PG,
    iD.data.DataType.OBJECT_PG_NODE,
    iD.data.DataType.R_DIVIDER_OPG,
    iD.data.DataType.TRAFFICSIGN,
    iD.data.DataType.TRAFFICSIGN_NODE,
    iD.data.DataType.BRIDGE,
    iD.data.DataType.BRIDGE_NODE,
    iD.data.DataType.LIMITHEIGHT,
    iD.data.DataType.R_DIVIDER_LH,
    iD.data.DataType.R_BRIDGE_LH,
    iD.data.DataType.TRAFFICLIGHT,
    iD.data.DataType.TRAFFICLIGHT_NODE,
    iD.data.DataType.R_TRAFFICLIGHT_TREF,
    iD.data.DataType.R_DIVIDER_TL,
    iD.data.DataType.MEASUREINFO
];

iD.Static.defaultEditCheckModels = [
    iD.data.DataType.QUALITY_TAG
];
iD.Static.defaultAnalysisTagModels = [
    iD.data.DataType.ANALYSIS_TAG
];
iD.Static.defaultQuestionTagModels = [
    iD.data.DataType.QUESTION_TAG
];
iD.Static.defaultAccuracyTagModels = [
    iD.data.DataType.ACCURACY_TAG
];
iD.Static.defaultPickMarkTagModels = [
    iD.data.DataType.PICK_MARK_TAG
];
iD.Static.defaultImageTagModels = [
    iD.data.DataType.IMAGE_TAG
];
iD.Static.defaultNetworkTagModels = [
    iD.data.DataType.POINT_TAG
];
iD.Static.defaultAutoNetworkTagModels = [
    iD.data.DataType.AUTO_NETWORK_TAG
];
iD.Static.defaultAutoCheckworkTagModels = [
    iD.data.DataType.AUTO_CHECKWORK_TAG
];
iD.Static.defaultCompiltCheckTag = [
    iD.data.DataType.COMPILE_CHECK_TAG
];

iD.Static.defaultPGModels = [
    iD.data.DataType.OBJECT_PG,
    iD.data.DataType.OBJECT_PG_NODE,
    iD.data.DataType.TRAFFICSIGN,
    iD.data.DataType.TRAFFICSIGN_NODE
]


// 视频相关常量配置
iD.Static.playerConstant = {
    'INTERSECTION': 'intersection',
    'POLYLINE': 'polyline',
    'POLYGONE': 'polygone',
    'ADD_DIVIDER': 'addDivider',
    // 辅助线
    'ADD_OBJECT_PL': 'addObjectPL',
    // 人行横道
    'ADD_OBJECT_PG': 'addObjectPG',
    'POINT': 'point',
    'POLYLINE_ADD_NODE': 'polylineAddNode',
    'DIVIDER_ADD_MIDDLEPOINT': 'dividerAddMiddlepoint',
    // 杆状物
    'TELEGRAPH_POLE': 'telegraphPole',
    // 灯头
    'TELEGRAPH_LAMP_HOLDER': 'telegraphLampHolder',
    // 路牌
    'ADD_BOARD': 'addboard',
    // 路牌(多边形)
    'ADD_BOARD_POLYGON': 'addboardPolygon',
    // 路牌(斜面PLANE)
    'ADD_BOARD_POLYGON_PLANE': 'addboardPolygonPlane',
    // 病害面
    // 'ADD_PAVEMENT_DISTRESS': 'addPavementDistress',
    // 'ADD_PAVEMENT_DISTRESS_LINE': 'addPavementDistressLine',
    // 'ADD_PAVEMENT_DISTRESS_LINE2': 'addPavementDistressLine2',
    // 地面区域
    'ADD_GROUND_AREA': 'addGroundArea',
    'MOVE_LINE': 'MOVE_LINE',
    'BATCH_BREAK_DREF': 'batchBreakDref',
    // 桥底线
    'BRIDGE_BOTTOM_LINE': 'bridgeBottomLine',
    // 标记特征点
    'MARK_VECTOR_POINT': 'markVectorPoint',
    // 交通灯
    'ADD_TRAFFICLIGHT': 'addTrafficLight',
    // 质检标记点
    'ADD_CHECK_TAG_POINT': 'addCheckTagPoint',
    // 图像标记点
    'ADD_IMAGE_TAG_POINT': 'addImageTagPoint',
    // 添加图像标PICK_MARK_TAG
    "ADD_PICK_MARK_TAG_POINT": 'addPickMarkTagPoint',
    // 分析标记点
    'ADD_ANALYSIS_TAG_POINT': 'addAnalysisTagPoint',
    // 问题记录标记点
    'ADD_QUESTION_TAG_POINT': 'addQuestionTagPoint',
    // 组网标记点
    'ADD_NETWORK_TAG_POINT': 'addNetworkTagPoint',
    // 添加控制点
    "ADD_CONTROL_POINT": 'addControlPoint',
    // 添加ObjectPT
    "ADD_OBJECT_PT": 'addObjectPT',
    //添加轮廓标
    "ADD_OUTLINE_OBJECT_PT": 'addOutlineObjectPT',
    // 道路属性变化点
    'ADD_ROAD_ATTRIBUTE': 'addRoadAttribute',
    // 生成导流带
    'ADD_DIVIDER_POLYGON': 'addDividerPolygon',
    // BARRIER
    'ADD_BARRIER_GEOMETRY': 'addBarrierGeometry',
    // 人行道
    'ADD_SIDE_WALK': 'addSideWalk',

    // （线）切割路牌
    'SPLIT_BOARD_LINE': 'splitBoardLine',

    // 核线十字标记
    'TOOL_EPLILINE_CROSS': 'tool_epliline_cross',
    // 标定-控制点
    'TOOL_TRACK_CONTROLPOINT': 'tool_track_controlpoint'
};

//编辑车道线按钮组定义
iD.Static.editDividerBtns = [
    iD.Static.playerConstant.ADD_DIVIDER,
    //	iD.Static.playerConstant.ADD_DIVIDER_POLYGON,
    iD.Static.playerConstant.POLYLINE_ADD_NODE,
    iD.Static.playerConstant.DIVIDER_ADD_MIDDLEPOINT,
    iD.Static.playerConstant.BATCH_BREAK_DREF,
    iD.Static.playerConstant.MOVE_LINE,
    iD.Static.playerConstant.ADD_ROAD_ATTRIBUTE,
    iD.Static.playerConstant.BRIDGE_BOTTOM_LINE,
    iD.Static.playerConstant.ADD_TRAFFICLIGHT,
    'default',
    iD.Static.playerConstant.INTERSECTION,
    iD.Static.playerConstant.TOOL_EPLILINE_CROSS
];

//编辑非车道线按钮组定义
iD.Static.editOtherBtns = [
    iD.Static.playerConstant.ADD_OBJECT_PL,
    iD.Static.playerConstant.ADD_BARRIER_GEOMETRY,
    iD.Static.playerConstant.ADD_SIDE_WALK,
    iD.Static.playerConstant.POLYLINE_ADD_NODE,
    iD.Static.playerConstant.MOVE_LINE,
    // iD.Static.playerConstant.BRIDGE_BOTTOM_LINE,
    iD.Static.playerConstant.ADD_OBJECT_PG,
    iD.Static.playerConstant.ADD_GROUND_AREA,
    iD.Static.playerConstant.ADD_DIVIDER_POLYGON,
    iD.Static.playerConstant.ADD_BOARD_POLYGON,
    iD.Static.playerConstant.ADD_BOARD_POLYGON_PLANE,
    iD.Static.playerConstant.SPLIT_BOARD_LINE,
    iD.Static.playerConstant.ADD_CONTROL_POINT,
    iD.Static.playerConstant.ADD_OBJECT_PT,
    iD.Static.playerConstant.ADD_OUTLINE_OBJECT_PT,
    iD.Static.playerConstant.TELEGRAPH_POLE,
    iD.Static.playerConstant.TELEGRAPH_LAMP_HOLDER,
    // iD.Static.playerConstant.ADD_TRAFFICLIGHT,
    'default',
    iD.Static.playerConstant.INTERSECTION,
    iD.Static.playerConstant.TOOL_EPLILINE_CROSS
];

iD.Static.pavementDistress = [
    iD.Static.playerConstant.ADD_PAVEMENT_DISTRESS,
    iD.Static.playerConstant.ADD_PAVEMENT_DISTRESS_LINE,
    iD.Static.playerConstant.ADD_PAVEMENT_DISTRESS_LINE2,
    iD.Static.playerConstant.POLYLINE_ADD_NODE
]

// iD.Static.defaultModels = [...iD.Static.defaultRoadModels,...iD.Static.defaultDividerModels,...iD.Static.defaultPGModels];
// iD.Static.default = {
//     elements: {
//         name: '数据层',
//         children: [
//             {
//                 type: 'road',
//                 name: '道路及路口',
//                 event: 'roadEdit',
//                 display: true,
//                 editable: true,
//                 tagReadOnly: false,
//                 // 实际会使用children的值，通过iD.config.getLayerId获取对应的layerid，再通过iD.Layers.getLayerById获取layer
//                 // 使用的是iD.config.layers中的layerSn与children值对比
//                 children: iD.Static.defaultRoadModels,
//                 // 在road_crossing中初始化的菜单项，对应相应的mode
//                 // 'add-road-attribute',
//                 action: ['add-road', 'add-roadcross']
//             },
//             {
//                 type: 'divider',
//                 name: '道路分割线',
//                 event: 'roadEdit',
//                 display: true,
//                 editable: true,
//                 tagReadOnly: false,
//                 children: iD.Static.defaultDividerModels,
//                 action: ['add-junction']
//             },
//             {
//                 type: 'checktag',
//                 name: '质检标记',
//                 event: 'roadEdit',
//                 display: true,
//                 editable: true,
//                 tagReadOnly: false,
//                 // 配置对应的 modelEntity 以及 DataLayer
//                 //              children: ['DIVIDER', 'DIVIDER_NODE','DIVIDER_ATTRIBUTE','LANE_ATTRIBUTE', 'OBJECT_PT'],
//                 //              children: ['OBJECT_PT'],
//                 picdatas: [iD.Static.defaultEditCheckModels],
//                 children: iD.Static.defaultEditCheckModels,
//                 action: ['add-point-checktag']
//             },
//             {
//                 type: 'analysistag',
//                 name: '分析标记',
//                 event: 'roadEdit',
//                 display: true,
//                 editable: true,
//                 tagReadOnly: false,
//                 picdatas: [iD.Static.defaultAnalysisTagModels],
//                 children: iD.Static.defaultAnalysisTagModels,
//                 action: []
//             }
//         ]
//     },
//     resource: iD.Static.defaultResource
// }

iD.Static.default_layers = {
    elements: {
        name: '数据层',
        children: [
        	/*
            {
                type: 'analysistag',
                id: 'analysistag',
                name: '分析标记',
                event: 'roadEdit',
                display: true,
                editable: false,
                children: iD.Static.defaultAnalysisTagModels,
                picdatas: [iD.Static.playerConstant.ADD_ANALYSIS_TAG_POINT, 'default'],
                action: []
            },
            */
            {
                type: 'checktag',
                id: 'checktag',
                layerId: 'layerCHECK-TAG',
                name: '质检标记',
                event: 'roadEdit',
                display: true,
                editable: false,
                tagReadOnly: false,
                children: iD.Static.defaultEditCheckModels,
                picdatas: [
                    iD.Static.playerConstant.ADD_CHECK_TAG_POINT,
                    'default',
                    iD.Static.playerConstant.INTERSECTION
                ],
                action: []
            },
            {
                type: 'questiontag',
                id: 'questiontag',
                layerId: 'layerQUESTION-TAG',
                name: '问题记录标记',
                event: 'roadEdit',
                display: true,
                editable: true,
                picdatas: [
                    iD.Static.playerConstant.ADD_QUESTION_TAG_POINT,
                    'default',
                    iD.Static.playerConstant.INTERSECTION
                ],
                children: iD.Static.defaultQuestionTagModels,
                action: []
            },
            {
                type: 'accuracytag',
                id: 'accuracy_tag',
                layerId: 'layerACCURACY_TAG',
                name: '精度标记',
                event: 'roadEdit',
                display: false,
                editable: false,
                picdatas: [
                    'default'
                ],
                children: iD.Static.defaultAccuracyTagModels,
                action: []
            },
            /* {//三标合一去掉
                type: 'auto_checkwork',
                id: 'auto_checkwork',
                layerId: 'layerAUTO-CHECKWORK-TAG',
                name: '精度质检标记',
                event: 'roadEdit',
                display: true,
                editable: true,
                picdatas: [
                    'default',
                    iD.Static.playerConstant.INTERSECTION
                ],
                children: iD.Static.defaultAutoCheckworkTagModels,
                action: []
            },
            {
                type: 'compilte_checktag',
                id: 'compilte_checktag',
                layerId: 'layerCOMPILE-CHECK-TAG',
                name: '母库编译检查标',
                event: 'roadEdit',
                display: true,
                editable: true,
                picdatas: [
                    'default'
                ],
                children: iD.Static.defaultCompiltCheckTag,
                action: []
            },
            {
                type: 'auto_network',
                id: 'auto_network',
                layerId: 'layer-autonetwork-tag',
                name: '自动组网标记',
                event: 'roadEdit',
                display: true,
                editable: true,
                picdatas: ['default',iD.Static.playerConstant.AUTO_NETWORK_TAG],
                children: iD.Static.defaultAutoNetworkTagModels,
                action: []
            }, */
            {
                type: 'control_point',
                id: 'control_point',
                layerId: 'layer-control-point',
                name: '控制点',
                event: 'roadEdit',
                display: true,
                editable: true,
                picdatas: [
                    'default',
                    iD.Static.playerConstant.INTERSECTION,
                    iD.Static.playerConstant.TOOL_TRACK_CONTROLPOINT
                ],
                children: [iD.data.DataType.DEFAULT],
                action: []
            },
            {
                type: 'pickmarktag',
                id: 'pick_mark_tag',
                layerId: 'layerPICK-MARK-TAG',
                name: '图像标记',
                event: 'roadEdit',
                display: false,
                editable: false,
                picdatas: [
                    iD.Static.playerConstant.ADD_PICK_MARK_TAG_POINT,
                    'default'
                ],
                children: iD.Static.defaultPickMarkTagModels,
                action: []
            }/*,
            {
                type: 'network_tag',
                id: 'network_tag',
                layerId: 'layer-network-tag',
                name: '差分标',
                event: 'roadEdit',
                display: true,
                editable: true,
                picdatas: ['default'],
                children: iD.Static.defaultNetworkTagModels,
                action: []
            }*/
        ]
    },
    resource: iD.Static.defaultResource
}

// geojson格式图层
iD.Static.geojson_layers = {
    elements: {
        name: '数据层',
        children: [
            {
            type: 'compile_topotag',
            id: 'compile_topotag',
            layerId: 'layerCOMPILE-TOPOTAG',
            name: '拓扑自动化标',
            event: 'roadEdit',
            display: true,
            editable: undefined,
            picdatas: ['default'],
            children: [iD.data.DataType.COMPILE_CHECK_TAG],
            action: []
        }, {
            type: 'ground_leaktag',
            id: 'ground_leaktag',
            layerId: 'layerGROUND-LEAKTAG',
            name: '地面完备检查标',
            event: 'roadEdit',
            display: true,
            editable: undefined,
            picdatas: ['default'],
            children: [iD.data.DataType.AUTO_COMPLETECHECK_TAG],
            action: []
        }]
    },
    resource: iD.Static.defaultResource
}

iD.Static.traditionalEdit = {
    elements: {
        name: '数据层',
        children: [
            {
                type: 'poi',
                name: 'POI',
                event: 'pointEdit',
                display: true,
                editable: true,
                tagReadOnly: false,
                //          children: ['POI'],
                children: [
                    iD.data.DataType.POI
                ],
                action: ['add-poi']
            },
            {
                type: 'textMakr',
                name: '标注',
                event: 'pointEdit',
                display: true,
                editable: true,
                tagReadOnly: false,
                //      children: ['TEXT_MARK'],
                children: [
                    iD.data.DataType.TEXT_MARK
                ],
                action: ['add-text-mark']
            },
            {
                type: 'landCoverArea',
                name: '面',
                event: 'pointEdit',
                display: true,
                editable: true,
                tagReadOnly: false,
                //      children: ['LANDCOVERAREA'],
                children: [
                    iD.data.DataType.LANDCOVERAREA
                ],
                action: ['add-land-cover-area']
            }
        ]
    },
    resource: iD.Static.defaultResource
}

// 图像标记
iD.Static.imagetagEdit = {
    elements: {
        name: '数据层',
        children: [
            {
                type: 'imagetag',
                name: '图像标记',
                event: 'roadEdit',
                display: true,
                editable: true,
                tagReadOnly: false,
                children: iD.Static.defaultImageTagModels,
                action: []
            }
        ]
    },
    resource: iD.Static.defaultResource
}
var cache = {};
 
function syncLayers2DataLayer(layers) {
    if (!layers) return;
    if (!_.isArray(layers)) {
        layers = [layers];
    }

    for (let dlay of iD.Layers.getLayers()) {
        if (!dlay.batch) continue;
        let layer = _.filter(layers, { batch: dlay.batch })[0];
        if (layer) {
            dlay.display = layer.display;
            dlay.editable = layer.editable;
            dlay.id = layer.layerId;
        }
    }
}

function pushTagElements(elements) {
    var ischecker = iD.User.isCheckRole();
    var history = iD.util.urlParamHistory();
    // 分析标记在任何角色都会显示，作业角色禁止编辑
    var children = _.cloneDeep(iD.Static.default_layers.elements.children);
    // 所有环节都显示 问题记录标记
    let questiontag = _.filter(children, { 'id': 'questiontag' });
    if (questiontag[0]) {
        questiontag[0].editable = history ? undefined : true; //ischecker ? true: false;
        elements.children.push(questiontag[0]);
    }
    // 所有环节都显示 图像标记
    let pickmarktag = _.filter(children, { 'id': 'pick_mark_tag' });
    if (pickmarktag[0]) {
        elements.children.push(pickmarktag[0]);
    }

    // 所有环节都显示 母库编译检查标注
    if (iD.User.isWorkRole() || iD.User.isCheckRole() || iD.User.isVerifyRole()) {
        let compilteChecktag = _.filter(children, { 'id': 'compilte_checktag' });
        if (compilteChecktag[0]) {
            compilteChecktag[0].editable = undefined; //ischecker ? true: false;
            elements.children.push(compilteChecktag[0]);
        }
    }

    if (!iD.User.isAuditRole()) {
        let checktag = _.filter(children, { 'id': 'checktag' });
        let checkEditable = iD.User.isEditCheckSystemAndRole() && !history;
        if (checktag[0]) {
            // checktag[0].editable = history ? undefined : checkEditable;
            checktag[0].editable = !checkEditable ? undefined : checkEditable;
            checktag[0].action = ['add-point-checktag'];
            elements.children.push(checktag[0]);
        }
    }
    // 车道线作业、车道线质检时，不需要分析标记-by lixiaoguang
    if (!iD.User.isLinearRole()) {
        let analysistag = _.filter(children, { 'id': 'analysistag' });
        if (analysistag[0]) {
            analysistag[0].editable = ischecker ? true : false;
            elements.children.push(analysistag[0]);
        }
    }
    
    let auto_networktag = _.filter(children, { 'id': 'auto_network'});
    if (auto_networktag[0]) {
        auto_networktag[0].editable = true;
        elements.children.push(auto_networktag[0]);
    }
    
    //精度标
    let accuracy_tag = _.filter(children, { 'id': 'accuracy_tag'});
    if (accuracy_tag[0]) {
        accuracy_tag[0].editable = undefined;
        elements.children.push(accuracy_tag[0]);
    }
    
    // 精度质检
    // 20190108任何环节，作业/质检用户都可以查询/保存
    let auto_checkwork = _.filter(children, { 'id': 'auto_checkwork' });
    if (auto_checkwork[0]) {
        auto_checkwork[0].editable = true;
        auto_checkwork[0].display = true;
        elements.children.push(auto_checkwork[0]);
    }

    //差分标记
    let network_tag = _.filter(children, { 'id': 'network_tag' });
    if (network_tag[0]) {
        network_tag[0].editable = true;
        network_tag[0].display = true;
        elements.children.push(network_tag[0]);
    }

    
    if (iD.User.isAuditRole()) {
        let network_tag = _.filter(children, {'id': 'network_tag'});
        if (network_tag[0]) {
            network_tag[0].editable = true;
            network_tag[0].display = true;
            elements.children.push(network_tag[0]);
        } 
    }
    //	batchElementLayers.forEach(function(layer){
    //		layer.editable = undefined;
    //	});
    return elements;
}

/**
 * 根据版本信息生成图层信息
 * @param {Array} versionInfos 
 */
function versionLayerConfig(versionInfos) {
    var LAYER_TYPENAME = iD.data.layerTypeName;
    let elements = {
        name: '数据层',
        children: []
    };
    let _hasEditOnly = false;
    let task = iD.Task.d;
    var history = iD.util.urlParamHistory();
    function filterSimilarColor() {
        return iD.Static.layersInfo.randomColor.get();
    }

    function createChildren(version, opts) {
        let _taskKey = version.taskKey;
        let taskKey = _taskKey.replace(/_/g, '-');
        opts = opts || {};
        let ctype = taskKey + 'dividerLine';
        // useEditColor，不需要图例颜色
        let color, useEditColor = opts.hasOwnProperty('useEditColor') ? opts.useEditColor : true;
        if (!useEditColor) {
            if (!iD.Static.layersInfo.cacheColor[ctype]) {
                color = filterSimilarColor();
            } else {
                color = iD.Static.layersInfo.cacheColor[ctype];
            }
            color = iD.Static.layersInfo.cacheColor[ctype] = color;
        }

        var _vlayName = (version.layer || '').replace(/-/g, '_');
        // 场景判断
        let picdatas = _.uniq([].concat(iD.Static.editDividerBtns).concat(iD.Static.editOtherBtns));
     
        if (picdatas.indexOf('default') != -1) {
            picdatas = _.without(picdatas, 'default');
            picdatas.push('default');
        } else {
            picdatas.push('default');
        }
        if (task) {
            let sceneCode = task.tags.sceneCode;
            if (sceneCode == iD.data.sceneCode.HD_DATA_LANE) {
                picdatas = iD.Static.editDividerBtns;
            } else if (sceneCode == iD.data.sceneCode.HD_DATA_LO) {
                picdatas = iD.Static.editOtherBtns;
            }else if(task.tags.processDefinitionKey == 'PavementDisease' || task.tags.branchDataType == '3') {
                picdatas = iD.Static.pavementDistress;
            }
        }

        var layerName = LAYER_TYPENAME[_vlayName] || version.taskKey;
        if (version.isSource) {
            layerName = '来源 ' + taskKey;
        } else if (version.isEdge) {
            layerName = '接边 ' + taskKey;
        }else if(version.iscomparative){
            layerName = '对比 ' + taskKey;
        }

        return {
            type: ctype,
            // layerId: task.task_id + '_' + taskKey,
            layerId: taskKey,
            name: layerName,
            event: 'roadEdit',
            display: opts.hasOwnProperty('display') ? opts.display : true,
            editable: opts.hasOwnProperty('editable') ? opts.editable : true,
            editOnly: false,
            tagReadOnly: false,
            children: [
                // _taskKey + iD.data.DataType.DIVIDER
                taskKey
            ],
            picdatas: picdatas,
            action: versionActions(version),
            defaultColor: color,
            // 来源层、对比层时设置false，会被defaultColor覆盖
            useEditColor: useEditColor,
            versionInfo: version
        }
    }

    function versionActions(version) {

        if(iD.Task.d && (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3')){
            return ['add-pavementDistreesLine','add-pavementDistreesLine1','add-pavementDistreesLine2'];
        }
        if (version.layer == 'lane') {
            return ['add-divider','add-ObjectPl','add-road-attribute','add-rectPG', 'add-objectPG', 'add-road', 'add-roadcross', 'add-junction' , 'add-barrier','add-objectPt'];
        }else if(version.layer == 'road'){
            return ['add-road', 'add-roadcross'];
        }
        return [];
    }

    // var geoLayers = _.cloneDeep(iD.Static.geojson_layers.elements.children);
    // 调整图层顺序， 作业层优先
    task && versionInfos.forEach(function (version) {
  
        let opts = {
            editable: true,
            display: true,
            useEditColor: true
        };
        if (version.isSource) {
            opts = {
                editable: undefined,
                display: false,
                useEditColor: false
            };
        }
        if (!version.isSource) {
            if (history) {
                opts.editable = undefined;
            } else if (!iD.User.isWorkRole()) {
                opts.editable = undefined;
            }
        }
        if(version.iscomparative){
            opts = {
                editable: undefined,
                display: false,
                useEditColor: false
            };
        }
        if(version.isEdge){
            opts = {
                editable: undefined,
                display: false,
                useEditColor: true
            };
        }
        if (_hasEditOnly && opts.editable != undefined) {
            opts.editable = false;
        }
        let layer = createChildren(version, opts);
        if (layer.editOnly && layer.editable == true) {
            _hasEditOnly = true;
        }
        elements.children.push(layer);
    });

    // 车道线作业/车道线质检
    if (iD.User.isLinearRole() || iD.Task.hideNoMeasureOperate()) {
        _.each(elements.children, function (d) {
            if (d.action && d.action.length && d.action.indexOf('add-divider') > -1) {
                // d.action = ['add-divider'];
                d.action = [];
            }
        });
    }

    // if (task && task.tags.compileTagKey) {
    //     // compilte_topotag
    //     let geoLay = _.find(geoLayers, { 'id': 'compile_topotag' });
    //     if (geoLay) {
    //         elements.children.push(geoLay);
    //     }
    // }
    // if (task && task.tags.groundLeakTag) {
    //     // compilte_topotag
    //     let geoLay = _.find(geoLayers, { 'id': 'ground_leaktag' });
    //     if (geoLay) {
    //         elements.children.push(geoLay);
    //     }
    // }

    // 质检评估禁止编辑
    if (iD.User.isQualityAssessorRole()) {
        _.each(elements.children, function (d) {
            d.editable = undefined;
            if (d.action && d.action.length) {
                d.action = [];
            }
        });
    }

    if (iD.User.isTrackStandardRole()) {
        return elements;
    }
    elements = pushTagElements(elements);

    syncLayers2DataLayer(elements.children);
    return elements;
}
function sys9ControlLayerConfig() {
    let elements = {
        name: '数据层',
        children: []
    };

    // 控制点图层
    var controlLayer = _.find(iD.Static.default_layers.elements.children, { 'id': 'control_point' });
    controlLayer = _.cloneDeep(controlLayer);
    elements.children.push(controlLayer);

    return elements;
}

function systemToElements(init){
    var history = iD.util.urlParamHistory();
    if(history){
        // 保存按钮
        var s = d3.$("#KDSEditor-bar button.save");
        s.style("visibility", "hidden");
    }
    if(!init && !_.isEmpty(iD.Static.layersInfo._sourceElementsResource)){
        return iD.Static.layersInfo._sourceElementsResource;
    }
	// iD.Static.default_layers
    var dataLayers = _.clone(iD.Static.default_layers);

    var task = iD.Task.d;
    if (iD.User.isTrackControlPointRole()) {
        dataLayers.elements = sys9ControlLayerConfig();
    } else {
        // 作业图层
        let versions = [];
        versions.push(..._.clone(iD.config.taskVersionInfos));
        dataLayers.elements = versionLayerConfig(versions);
    }
    iD.Static.layersInfo._sourceElementsResource = dataLayers;

    /* TODO
     * 1、审核角色，禁止编辑所有层；
     * 2、作业角色，禁止编辑标记层；
     * 3、质检角色，禁止编辑数据层；
     * 4、验收角色，禁止编辑数据层；
     * 5、所有角色，允许编辑 分析标记、问题标记、精度质检标记；
     */
    var elementChildren = dataLayers && dataLayers.elements && dataLayers.elements.children || [];
    var resourceChildren = dataLayers && dataLayers.resource && dataLayers.resource.children || [];

    var tagtypes = ["checktag", "imagetag", "analysistag"];
    for (var i in elementChildren) {
        var item = elementChildren[i];
        item._parentType = "elements";

        // 20180824线形作业单任务，未标记状态禁止编辑
        if (iD.Task.isLinearFusionAuto() && !task.marking) {
            item.editable = undefined;
            continue;
        }
        if (iD.User.isQualityAssessorRole()) {
            if (item.type == 'checktag') {
                item.editable = true;
            } else {
                item.editable = undefined;
            }
            continue;
        }

        var oldEditable = item.editable;
        // 查询历史时，禁止编辑
        //      if(history || iD.User.isAuditRole()) {
        if (iD.User.isAuditRole()) {
            // 审核
            item.editable = undefined;
        } else if (iD.User.isWorkRole()) {
            // 作业
            if (_.include(tagtypes, item.type)) {
                item.editable = undefined;
            }
        } else if (iD.User.isCheckRole()) {
            // 质检（自动组网AUTO_NETWORK_TAG标记允许质检用户新增
            if (!_.include(tagtypes, item.type)  && item.id != 'auto_network') {
                item.editable = undefined;
            }
        } else if (iD.User.isVerifyRole()) {
            // 验收
            if (!_.include(tagtypes, item.type)) {
                item.editable = undefined;
            }
        }
        // 所有角色
        if ([
            'analysistag',
            'questiontag',
            'auto_checkwork'
        ].includes(item.type)) {
            item.editable = oldEditable;
        }
        // // 20180824，历史任务可编辑所有标记、以及作业层；
        // if(history && _.include(tagtypes, item.type) && oldEditable != null){
        // 	item.editable = oldEditable;
        // }
        // 201909 历史任务禁止编辑
        if(history && (item.id != 'pick_mark_tag')){
            item.editable = undefined;
        }
        /*
         // 禁止编辑
         if(!iD.User.authEditSave()){
         item.editable = undefined;
         }
         */
        /*if(item.type == 'checktag' && iD.User.isEditCheckSystemAndRole()){
         item.editable = true;
         }*/
    }
    for (var i in resourceChildren) {
        var item = resourceChildren[i];
        if (!item) {
            continue;
        }
        item._parentType = "resource";
        if (item.type === 'pic') {
            if (!iD.User.authTrail()) {
                // 没有对应权限，默认false
                item.display = false;
            }
            // 不显示面板中的轨迹行
            // resourceChildren.splice(i, 1);
        }
    }
    // 在initElements之前的图层列表，初始化的过程中会用到配置的models
    for (var layer of elementChildren) {
        iD.Static.layersInfo._elements[layer.type] = layer;
    }
    return dataLayers;
}

// 定义编辑器上方的各种按钮的 /modes
iD.Static.actionRole = {
    'work': ['AddRoad', 'AddObjectPt','AddBarrier','AddIsland', 'AddObjectPG','AddRoadAttribute','AddDivider', 'AddLine', 'AddJunction', 'AddRoadCross',
        'AddCutDivider', 'AddObjectPl','AddRectPG','AddArea', 'AddPoint', 'AddTextMark', 'AddPoi', 'AddLandCoverArea', 'AddBoardArea', 'AddPointCheckTag','AddPavementDistreesLine','AddPavementDistreesLine1','AddPavementDistreesLine2'],
    'check': [],
    'admin': []
};


//初始化右侧面板的配置项
iD.Static.layersInfo = {
    _elements: {},
    cacheColor: {},
    randomColor: iD.util.randomColorList(),
    // 缓存已经生成的数据
    _sourceElementsResource: {},
    initElements: function () {
        iD.Static.layersInfo._elements = {};
        if (iD.Task.d) {
            iD.Static.layersInfo.randomColor.reset();
            iD.Static.layersInfo.cacheColor = {};
        }
        // var dataLayers = iD.Static.default.elements.children;
        // if(_isInstance){
        //     dataLayers = iD.Static.fusionDivider.elements.children;
        // }
        systemToElements(true);
    },
    getDataElements: function () {
    },
    getResourceElements: function () {
        // var resource = iD.Static.default;
        // if(_isInstance){
        //     resource = iD.Static.fusionDivider;
        // }
        var resource = systemToElements(false);
        return resource;
    },
    // initElements: function() {
    // 	var role = iD.User.getRole().role;
    // 	_.forIn(_.clone(defaultElements, true), function(layer, key) {
    // 		['display', 'editable'].forEach(function(status) {
    // 			if (typeof layer[status] === 'object') {
    // 				layer[status] = layer[status][role];
    // 			}
    // 		});
    // 		iD.Static.layersInfo._elements[key] = layer;\
    // 		layer.children.forEach(function(type) {
    // 			cache[type] = {
    // 				display: layer.display,
    // 				editable: layer.editable
    // 			}
    // 		});
    // 	});
    // },
    _getType: function (dataType) {
        for (var type in this._elements) {
            var info = this._elements[type];
            if (info.children.indexOf(dataType) !== -1) {
                return type;
            }
        }
    },
    getElements: function () {
        return this._elements;
    },
    getElementByChildrenName: function (name) {
        let self = this;
        if (!name) {
            return;
        }
        for (let key in self._elements) {
            let lay = self._elements[key];
            if (_.include(lay.children, name)) {
                return lay;
            }
        }
    },
    isDisplay: function (dataType) {
        // return cache[dataType] ? cache[dataType].display : true;
        // return dataType ? this._elements[this._getType(dataType)].display : true;
        return dataType && this._elements[this._getType(dataType)] ? this._elements[this._getType(dataType)].display : true;
    },
    //TODO 需要删除 使用图层控制
    isEditable: function (dataType) {
        // return cache[dataType] ? cache[dataType].editable : true;
        return dataType && this._elements[this._getType(dataType)] ? this._elements[this._getType(dataType)].editable : true;
    },
    setStatus: function (type, status, bool) {
        // if (!cache[type]) {
        // 	return;
        // }
        // cache[type][status] = bool;
        if (!this._elements[type]) {
            return;
        }
        this._elements[type][status] = bool;

        this._elements[type].children && this._elements[type].children.forEach(function (value) {
            // cache[value][status] = bool;
            var layer = iD.Layers.getLayerByName(value);
            if (layer) {
                layer[status] = bool;
            }
        });
    },
    setLayerStatus: function (type, status, bool) {
        let d = this._elements[type];
        if (!d || _.isEmpty(d.children) || !status) {
            console.warn('图层开关切换错误');
            return;
        }
        let children = d.children;
        let childLayers = [];
        for (let i = 0, len = children.length; i < len; i++) {
            let layer = iD.Layers.getLayerById(children[i]);
            if (!layer) {
                layer = iD.Layers.getLayerByName(children[i])
            }
            if (!layer) {
                // console.log('没有找到对应矢量图层', children[i]);
                continue;
            }
            childLayers.push(layer);
        }
        if (!childLayers.length && d.layerId) {
            let layer = iD.Layers.getLayerById(d.layerId);
            layer && childLayers.push(layer);
        }
        if (!childLayers.length) {
            console.log('没有找到对应矢量图层', d.layerId, children[0]);
        }
        childLayers.forEach(function (layer) {
            if (status == 'editable') {
                layer[status] = layer[status] != undefined ? bool : layer[status];
                iD.Layers.setLayerEditable(layer, bool);
            } else {
                layer[status] = bool;
                iD.Layers.setLayerDisplay(layer, bool);
            }
        });
        if (status == 'editable') {
            var ov = this._elements[type][status];
            this._elements[type][status] = ov != undefined ? bool : ov;
        } else {
            this._elements[type][status] = bool;
        }
        /*
         let layer = iD.Layers.getLayerById(type);
         if(!layer) return ;
         layer[status] = bool;
         this._elements[type][status] = !this._elements[type][status];
         */
    },
    getElementStatus: function (type, status) {
        return this._elements[type][status];
    },
    toggleStatus: function (d, status) {
        var self = this;
        if (!d || _.isEmpty(d.children) || !status) {
            console.warn('图层开关切换错误');
            return;
        }
        /*
         let children = d.children;
         for(let i=0,len = children.length; i<len;i++){
         let layer = iD.Layers.getLayerById(children[i]);
         if(!layer){
         console.log('没有找到对应矢量图层',children[i]);
         continue;
         }
         //          layer[status] = !layer[status];
         this.setLayerStatus(children[i], status, !layer[status]);
         }
         this._elements[d.type][status] = !this._elements[d.type][status];
         */
        self.setLayerStatus(d.type, status, !self._elements[d.type][status]);

        if (status === 'editable' && self._elements[d.type].editOnly) {
            let eleList = _.values(self._elements).filter(function (ele) {
                return ele.type != d.type && ele.editOnly == true;
            });
            // console.log('唯一编辑，其他图层列表：', eleList);
            eleList.forEach(function (ele) {
                self.setLayerStatus(ele.type, status, false);
            });
        }

        // if (!this._elements[type]) {
        // 	return;
        // }
        // this._elements[type][status] = !this._elements[type][status];
    }
}

// iD.User.on('login.layers', function() {
// 	iD.Static.layersInfo.initElements();
// });