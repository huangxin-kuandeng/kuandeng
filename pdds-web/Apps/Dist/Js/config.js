
window.Disease = {};
Disease.business_list = {
    'PAVEMENT_DISTRESS': {
        'ID': 'PAVEMENT_DISTRESS',
        'DATACODE': 'pd',
        'MVT': 'pdmvt',
        'TITLE': '病害',
        'NAME': '公路损坏检测和管理',
        'FUNBUTTON': [
            {
                'NAME': '正射图',
                'ID': 'visua_up_map',
                'ACTIVE': 'active',
				'CONTROL': '',
                'CLASS': 'image_buttons_up'
            },
            {
                'NAME': '采集图',
                'ID': 'collect_map',
                'ACTIVE': '',
				'CONTROL': 'button_control',
                'CLASS': 'image_buttons_survey'
            }
        ],
        'SEARCHPARAM': {
            'NAME': '病害列表',
            'VALUES': [
                {
                    'NAME': '病害类型',
                    'ID': 'TYPE',
                    'CLASS': 'TYPE',
                    'VALUES': []
                },
                {
                    'NAME': '路线编号',
                    'ID': 'LINK_CODE',
                    'CLASS': 'LINK_CODE',
                    'VALUES': []
                },
                {
                    'NAME': '损坏程度',
                    'ID': 'SUBTYPE',
                    'CLASS': 'SUBTYPE',
                    'VALUES': [
                        {
                            'NAME': '全选',
                            'ID': 'all',
                            'VALUE': '',
                            'TITLE': '',
                            'CLASS': 'checkbox_label_all'
                        },
                        {
                            'NAME': '重度',
                            'ID': '',
                            'VALUE': '3',
                            'TITLE': '重度',
                            'CLASS': ''
                        },
                        {
                            'NAME': '中度',
                            'ID': '',
                            'VALUE': '2',
                            'TITLE': '中度',
                            'CLASS': ''
                        },
                        {
                            'NAME': '轻度',
                            'ID': '',
                            'VALUE': '1',
                            'TITLE': '轻度',
                            'CLASS': ''
                        },
                        {
                            'NAME': '无分级',
                            'ID': '',
                            'VALUE': '9',
                            'TITLE': '无分级',
                            'CLASS': ''
                        }
                    ]
                }
            ]
        },
        'LISTINFO': {
            'ID': 'SUBTYPE',
            'NAME': '程度',
            'MAPPING': {
                '1': '轻度',
                '2': '中度',
                '3': '重度',
                '9': '无分级'
            },
        },
        'LEFTTABS': [
            {
                'NAME': '路段分析',
                'ID': 'road_analyse',
                'LIST': [
                    { 'NAME': '路线', 'TITLE': '路线', 'ID': 'LINK_CODE' },
                    { 'NAME': '路线名称', 'TITLE': '路线名称', 'ID': 'LINK_NAME' },
                    // { 'NAME': '管养单位', 'TITLE': '管养单位', 'ID': 'MAINTENANCE_COMPANY' },
                    // { 'NAME': '车道类型', 'TITLE': '车道类型', 'ID': 'ROAD_TYPE_NAME' },
                    { 'NAME': '方向', 'TITLE': '方向', 'ID': 'UP_DOWN', 'MAPPING': 'UP_DOWM' },
                    { 'NAME': '起点桩号', 'TITLE': '起点桩号', 'ID': 'START_MP' },
                    { 'NAME': '终点桩号', 'TITLE': '终点桩号', 'ID': 'END_MP' },
                    { 'NAME': '评定长度（m）', 'TITLE': '评定长度（m）', 'ID': 'EVALUATE_LENG' },
                    { 'NAME': '路面评定结果（PQI）', 'TITLE': 'PQI', 'ID': 'PQI' },
                    { 'NAME': '路面状况（PCI）', 'TITLE': 'PCI', 'ID': 'GRID_PCI' },
                    { 'NAME': '行驶质量（RQI）', 'TITLE': 'RQI', 'ID': 'RQI' },
                    { 'NAME': '路面车辙（RDI）', 'TITLE': 'RDI', 'ID': 'RDI' },
                    { 'NAME': '路面抗滑（SRI）', 'TITLE': 'SRI', 'ID': 'SRI' }
                ]
            },
            {
                'NAME': '病害分析',
                'ID': 'disease_analyse',
                'IMAGE_URL': 'disease',
                'IMAGE_TYPE': 'jpg',
                'SORT_LIST': [
                    {
                        'NAME': '路面类型',
                        'CLASS': 'active',
                        'TITLE': '路面类型',
                        'ID': '1',
                    },
                    {
                        'NAME': '累计损坏面积',
                        'CLASS': '',
                        'TITLE': '病害数量',
                        'ID': '2',
                    },
                    {
                        'NAME': '病害数量',
                        'CLASS': '',
                        'TITLE': '病害数量',
                        'ID': '3',
                    }
                ],
                'VALUES': [
                    {
                        'NAME_1': '检测总数 (例)',
                        'ID_1': 'totalCount',
                        'NAME_2': '每公里平均 (例)',
                        'ID_2': 'avgKilCount'
                    },
                    {
                        'NAME_1': '损坏总面积 (㎡)',
                        'ID_1': 'totalArea',
                        'NAME_2': '每公里平均 (㎡)',
                        'ID_2': 'avgKilArea'
                    },
                    {
                        'NAME_1': '',
                        'ID_1': 'weightCount',
                        'NAME_2': '轻度总数 (例)',
                        'ID_2': 'lightCount'
                    }
                ]
            },
            {
                'NAME': '病害列表',
                'ID': 'data_panel',
                'ACTIVE': true,
                'LIST': [
                    { 'NAME': '路线', 'TITLE': '路线', 'ID': 'LINK_CODE' },
                    { 'NAME': '桩段', 'TITLE': '桩段', 'ID': 'MP_CODE' },
                    { 'NAME': '方向', 'TITLE': '方向', 'ID': 'UP_DOWN', 'MAPPING': 'UP_DOWM' },
                    { 'NAME': '路面类型', 'TITLE': '路面类型', 'ID': 'MATERIAL', 'MAPPING': 'MATERIAL' },
                    { 'NAME': '病害类型', 'TITLE': '病害类型', 'ID': 'TYPE' },
                    { 'NAME': '损坏程度', 'TITLE': '损坏程度', 'ID': 'SUBTYPE', 'MAPPING': 'SUBTYPE' },
                    { 'NAME': '计量面积（平方米）', 'TITLE': '计量面积（平方米）', 'ID': 'AREA', 'TOFIXED': 2 },
                    { 'NAME': '测量结果', 'TITLE': '测量结果', 'ID': 'visua_up_map', 'CLICK': true, 'FORMATTER': 'measurements' },
                    { 'NAME': '正射图', 'TITLE': '正射图', 'ID': 'visua_up_map', 'CLICK': true, 'FORMATTER': 'open_map_up button_control' },
                    { 'NAME': '采集图', 'TITLE': '采集图', 'ID': 'collect_map', 'CLICK': true, 'FORMATTER': 'open_map_survey' },
                    { 'NAME': '3D点云', 'TITLE': '3D点云', 'ID': 'point_cloud_map', 'CLICK': true, 'FORMATTER': 'open_map_3D read_only' },
                    { 'NAME': '备注', 'TITLE': '备注', 'ID': 'REMARK', 'CLICK': true, 'FORMATTER': 'remarks' }
                ]
            },
            {
                'NAME': '巡检记录',
                'ID': 'check_record'
            },
            {
                'NAME': '其他数据',
                'ID': 'data_other',
                'LIST': [
                    { 'NAME': '路线', 'TITLE': '路线', 'ID': 'LINK_CODE' },
                    { 'NAME': '桩段', 'TITLE': '桩段', 'ID': 'MP_CODE' },
                    { 'NAME': '方向', 'TITLE': '方向', 'ID': 'UP_DOWN', 'MAPPING': 'UP_DOWM' },
                    { 'NAME': '起点路面宽度', 'TITLE': '起点路面宽度', 'ID': 'S_WIDTH', 'TAIL': '米', 'TOFIXED': 2 },
                    { 'NAME': '终点路面宽度', 'TITLE': '终点路面宽度', 'ID': 'E_WIDTH', 'TAIL': '米', 'TOFIXED': 2 },
                    { 'NAME': '路段长度', 'TITLE': '路段长度', 'ID': 'LENGTH', 'TAIL': '米', 'TOFIXED': 2 },
                    { 'NAME': '在地图上查看', 'TITLE': '在地图上查看', 'ID': 'cesium_map', 'CLICK': true, 'FORMATTER': 'open_map_up button_control' },
                    { 'NAME': '备注', 'TITLE': '备注', 'ID': 'REMARK', 'CLICK': true, 'FORMATTER': 'remarks' }
                ]
            },
        ],
        'TYPES': {
            'NAME': '病害类型',
            'KEY': 'TYPE',
            'VALUES': {
				'1': {
					'NAME': '纵向裂缝',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'LENGTH',
							'VAL': '米',
							'LENGTH': 2,
							'NAME': '裂缝长度'
						},
						{
							'ID': 'WIDTH',
							'VAL': '毫米',
							'LENGTH': 1,
							'TYPE': true,
							'NAME': '主要裂缝宽度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'2': {
					'NAME': '横向裂缝',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'LENGTH',
							'VAL': '米',
							'LENGTH': 2,
							'NAME': '裂缝长度'
						},
						{
							'ID': 'WIDTH',
							'VAL': '毫米',
							'LENGTH': 1,
							'TYPE': true,
							'NAME': '主要裂缝宽度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'3': {
					'NAME': '龟裂',
					'MATERIAL': '1',
					'SUBTYPE_NONE': true,
					'INFO': [
						{
							'ID': 'BLOCK',
							'LENGTH': 2,
							'VAL': '米',
							'NAME': '主要裂缝块度'
						},
						{
							'ID': 'WIDTH',
							'VAL': '毫米',
							'LENGTH': 1,
							'TYPE': true,
							'NAME': '平均裂缝宽度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'4': {
					'NAME': '块状裂缝',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'BLOCK',
							'VAL': '米',
							'LENGTH': 2,
							'NAME': '主要裂缝块度'
						},
						{
							'ID': 'WIDTH',
							'VAL': '毫米',
							'TYPE': true,
							'LENGTH': 1,
							'NAME': '平均裂缝宽度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'5': {
					'NAME': '车辙',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'DEPTH',
							'VAL': '毫米',
							'TYPE': true,
							'LENGTH': 0,
							'NAME': '车辙深度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'6': {
					'NAME': '波浪拥包',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'DEPTH',
							'VAL': '毫米',
							'TYPE': true,
							'LENGTH': 0,
							'NAME': '波峰波谷高差'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'7': {
					'NAME': '坑槽',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'DEPTH',
							'VAL': '毫米',
							'LENGTH': 0,
							'TYPE': true,
							'NAME': '坑槽深度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'8': {
					'NAME': '沉陷',
					'MATERIAL': '1',
					'INFO': [
						{
							'ID': 'DEPTH',
							'VAL': '毫米',
							'LENGTH': 0,
							'TYPE': true,
							'NAME': '沉陷深度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'9': {
					'NAME': '松散',
					'MATERIAL': '1',
					'INFO': [
						
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'10': {
					'NAME': '泛油',
					'MATERIAL': '1',
					'INFO': [
						
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'11': {
					'NAME': '沥青修补',
					'MATERIAL': '1',
					'INFO': [
						
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'31': {
					'NAME': '破碎板',
					'MATERIAL': '2',
					'INFO': [],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'32': {
					'NAME': '裂缝',
					'MATERIAL': '2',
					'INFO': [{
							'ID': 'WIDTH',
							'VAL': '毫米',
							'LENGTH': 1,
							'TYPE': true,
							'NAME': '裂缝宽度'
						},
						{
							'ID': 'LENGTH',
							'VAL': '米',
							'LENGTH': 2,
							'NAME': '裂缝长度'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'33': {
					'NAME': '板角断裂',
					'MATERIAL': '2',
					'INFO': [{
						'ID': 'WIDTH',
						'VAL': '毫米',
						'LENGTH': 1,
						'TYPE': true,
						'NAME': '裂缝宽度'
					}],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'34': {
					'NAME': '错台',
					'MATERIAL': '2',
					'INFO': [{
							'ID': 'LENGTH',
							'VAL': '米',
							'LENGTH': 2,
							'NAME': '错台长度'
						},
						{
							'ID': 'DEPTH',
							'VAL': '毫米',
							'TYPE': true,
							'LENGTH': 0,
							'NAME': '接缝两侧高差'
						}
					],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'35': {
					'NAME': '拱起',
					'MATERIAL': '2',
					'INFO': [],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'36': {
					'NAME': '边角剥落',
					'MATERIAL': '2',
					'INFO': [{
						'ID': 'LENGTH',
						'VAL': '米',
						'LENGTH': 2,
						'NAME': '损坏长度'
					}],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'37': {
					'NAME': '接缝料损坏',
					'MATERIAL': '2',
					'INFO': [{
						'ID': 'LENGTH',
						'VAL': '米',
						'LENGTH': 2,
						'NAME': '损坏长度'
					}],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'38': {
					'NAME': '坑洞',
					'MATERIAL': '2',
					'INFO': [],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'39': {
					'NAME': '唧泥',
					'MATERIAL': '2',
					'INFO': [],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'40': {
					'NAME': '露骨',
					'MATERIAL': '2',
					'INFO': [],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				},
				'41': {
					'NAME': '水泥修补',
					'MATERIAL': '2',
					'INFO': [],
					'SUBTYPE': {
						'1': '轻度',
						'2': '中度',
						'3': '重度',
						'9': '无分级'
					}
				}
            }
        },
        'UP_DOWM': {
            '1': '上行',
            '2': '下行'
        },
        'MATERIAL': {
            '1': '沥青路面病害',
            '2': '水泥混泥土路面病害',
            '3': '其它路面病害'
        },
        'SUBTYPE': {
            '1': '轻度',
            '2': '中度',
            '3': '重度',
            '39': '无分级'
        },
        'URLS': {
            'ROAD': 'data/road_maintenance/queryPage',
            'ANALYSE': 'data/pd/analysis?linkCode=',
            'LIST': 'data/pd/queryPage',
            'MAP_LIST': 'data/pd/query',
            'PD_SHOW_LIST': 'data/pd_show/queryPage',
            'MAP_MARK': 'data/position_label/query',
            'DOWNLOAD': 'data/road_maintenance/exp?type=pdf&linkCode=',
            'ROAD_WIDTH': 'data/road_width_change/queryPage',
            'AGGR': 'aggr/pd_show/aggr?DATA_VERSION='
        },

    },
    'ASSET_INSPECTION': {
        'ID': 'ASSET_INSPECTION',
        'DATACODE': 'road_asset',
		'MVT': 'roadmvt',
        'TITLE': '资产',
        'NAME': '公路资产巡检和管理',
        'FUNBUTTON': [
            {
                'NAME': '采集图',
                'ID': 'collect_map',
                'ACTIVE': 'active',
				'CONTROL': 'button_control',
                'CLASS': 'image_buttons_survey'
            },
            {
                'NAME': '三维图',
                'ID': 'threed_map',
                'ACTIVE': '',
				'CONTROL': '',
                'CLASS': 'image_buttons_threed'
            }
        ],
        'SEARCHPARAM': {
            'NAME': '资产列表',
            'VALUES': [
                {
                    'NAME': '资产类型',
                    'ID': 'TYPE',
                    'CLASS': 'TYPE',
                    'VALUES': []
                },
                {
                    'NAME': '路线编号',
                    'ID': 'LINK_CODE',
                    'CLASS': 'LINK_CODE',
                    'VALUES': []
                },
                {
                    'NAME': '资产类别',
                    'ID': 'SUBTYPE',
                    'CLASS': 'SUBTYPE',
                    'VALUES': [
                        {
                            'NAME': '全选',
                            'ID': 'all',
                            'VALUE': '',
                            'TITLE': '',
                            'CLASS': 'checkbox_label_all'
                        },
                        {
                            'NAME': '重度',
                            'ID': '',
                            'VALUE': '3',
                            'TITLE': '重度',
                            'CLASS': ''
                        },
                        {
                            'NAME': '中度',
                            'ID': '',
                            'VALUE': '2',
                            'TITLE': '中度',
                            'CLASS': ''
                        },
                        {
                            'NAME': '轻度',
                            'ID': '',
                            'VALUE': '1',
                            'TITLE': '轻度',
                            'CLASS': ''
                        }
                    ]
                }
            ]
        },
        'LISTINFO': {
            'ID': 'SUBTYPE',
            'NAME': '子类',
            'MAPPING': {
                '1': '轻度',
                '2': '中度',
                '3': '重度',
                '9': '无分级'
            },
        },
        'LEFTTABS': [
            {
                'NAME': '路段分析',
                'ID': 'road_analyse',
                'LIST': [
                    { 'NAME': '路线', 'TITLE': '路线', 'ID': 'LINK_CODE' },
                    { 'NAME': '路线名称', 'TITLE': '路线名称', 'ID': 'LINK_NAME' },
                    // { 'NAME': '管养单位', 'TITLE': '管养单位', 'ID': 'MAINTENANCE_COMPANY' },
                    // { 'NAME': '车道类型', 'TITLE': '车道类型', 'ID': 'ROAD_TYPE_NAME' },
                    { 'NAME': '方向', 'TITLE': '方向', 'ID': 'UP_DOWN', 'MAPPING': 'UP_DOWM' },
                    { 'NAME': '起点桩号', 'TITLE': '起点桩号', 'ID': 'START_MP' },
                    { 'NAME': '终点桩号', 'TITLE': '终点桩号', 'ID': 'END_MP' },
                    { 'NAME': '评定长度（m）', 'TITLE': '评定长度（m）', 'ID': 'EVALUATE_LENG' },

                    { 'NAME': '车道线（m）', 'TITLE': '车道线（m）', 'ID': '701', 'TOTAL_TYPE': '701' },
                    { 'NAME': '防护设施（m）', 'TITLE': '防护设施（m）', 'ID': '702', 'TOTAL_TYPE': '702' },
                    { 'NAME': '路面标注', 'TITLE': '路面标注', 'ID': '703', 'TOTAL_TYPE': '703' },
                    { 'NAME': '标志牌', 'TITLE': '标志牌', 'ID': '704', 'TOTAL_TYPE': '704' },
                    { 'NAME': '灯杆', 'TITLE': '灯杆', 'ID': '705', 'TOTAL_TYPE': '705' },
                    { 'NAME': '摄像头', 'TITLE': '摄像头', 'ID': '706', 'TOTAL_TYPE': '706' },
                    { 'NAME': '里程桩', 'TITLE': '里程桩', 'ID': '707', 'TOTAL_TYPE': '707' },
                    { 'NAME': '桥隧', 'TITLE': '桥隧', 'ID': '708', 'TOTAL_TYPE': '708' },
                ]
            },
            {
                'NAME': '资产分析',
                'ID': 'disease_analyse',
                'IMAGE_URL': 'asset',
                'IMAGE_TYPE': 'png',
                'SORT_LIST': [
                    {
                        'NAME': '资产类型',
                        'CLASS': 'active',
                        'TITLE': '资产类型',
                        'ID': '1',
                    },
                    {
                        'NAME': '分类数量',
                        'CLASS': '',
                        'TITLE': '分类数量',
                        'ID': '3',
                    }
                ],
                'VALUES': [
                    {
                        'NAME_1': '检测总数',
                        'ID_1': 'totalCount',
                        'NAME_2': '新增个数',
                        'ID_2': 'newCount'
                    },
                    {
                        'NAME_1': '每公里平均',
                        'ID_1': 'avgKilCount',
                        'NAME_2': '缺失个数',
                        'ID_2': 'missionCount'
                    }
                ]
            },
            {
                'NAME': '资产列表',
                'ID': 'data_panel',
                'ACTIVE': true,
                'LIST': [
                    { 'NAME': '路线', 'TITLE': '路线', 'ID': 'LINK_CODE' },
                    { 'NAME': '桩段', 'TITLE': '桩段', 'ID': 'MP_CODE' },
                    { 'NAME': '方向', 'TITLE': '方向', 'ID': 'UP_DOWN', 'MAPPING': 'UP_DOWM' },
                    { 'NAME': '资产类型', 'TITLE': '资产类型', 'ID': 'TYPE' },
                    { 'NAME': '资产子类', 'TITLE': '资产子类', 'ID': 'SUBTYPE' },
                    { 'NAME': '资产名称', 'TITLE': '资产名称', 'ID': 'TYPE' },
                    { 'NAME': '测量结果', 'TITLE': '测量结果', 'ID': 'collect_map', 'CLICK': true, 'FORMATTER': 'measurements' },
                    { 'NAME': '采集图', 'TITLE': '采集图', 'ID': 'collect_map', 'CLICK': true, 'FORMATTER': 'open_map_up button_control' },
                    { 'NAME': '三维图', 'TITLE': '三维图', 'ID': 'threed_map', 'CLICK': true, 'FORMATTER': 'open_map_survey' },
                    { 'NAME': '3D点云', 'TITLE': '3D点云', 'ID': 'point_cloud_map', 'CLICK': true, 'FORMATTER': 'open_map_3D read_only' },
                    { 'NAME': '备注', 'TITLE': '备注', 'ID': 'REMARK', 'CLICK': true, 'FORMATTER': 'remarks' }
                ]
            },
            {
                'NAME': '巡检记录',
                'ID': 'check_record'
            },
            {
                'NAME': '其他数据',
                'ID': 'data_other',
                'LIST': [
                    { 'NAME': '路线', 'TITLE': '路线', 'ID': 'LINK_CODE' },
                    { 'NAME': '桩段', 'TITLE': '桩段', 'ID': 'MP_CODE' },
                    { 'NAME': '方向', 'TITLE': '方向', 'ID': 'UP_DOWN', 'MAPPING': 'UP_DOWM' },
                    { 'NAME': '起点路面宽度', 'TITLE': '起点路面宽度', 'ID': 'S_WIDTH', 'TAIL': '米', 'TOFIXED': 2 },
                    { 'NAME': '终点路面宽度', 'TITLE': '终点路面宽度', 'ID': 'E_WIDTH', 'TAIL': '米', 'TOFIXED': 2 },
                    { 'NAME': '路段长度', 'TITLE': '路段长度', 'ID': 'LENGTH', 'TAIL': '米', 'TOFIXED': 2 },
                    { 'NAME': '在地图上查看', 'TITLE': '在地图上查看', 'ID': 'cesium_map', 'CLICK': true, 'FORMATTER': 'open_map_up button_control' },
                    { 'NAME': '备注', 'TITLE': '备注', 'ID': 'REMARK', 'CLICK': true, 'FORMATTER': 'remarks' }
                ]
            },
        ],
        'TYPES': {
            'NAME': '资产类型',
            'KEY': 'TYPE',
            'VALUES': {
                '701': {
                    'NAME': '车道线',
                    'COMPANY': ' (m)',
                    'INFO': [],
                    'SUBTYPE': {
                        '0': '未调查',
                        '1': '车行道边缘线',
                        '2': '白虚线',
                        '3': '白实线',
                        '4': '公交专用车道线',
                        '5': '道路出入口标线',
                        '6': '左弯待转区线',
                        '7': '可变导向车道线',
                        '8': '潮汐车道线',
                        '9': '黄虚线',
                        '10': '黄实线',
                        '11': '纵向减速标线',
                        '12': '双黄虚线',
                        '13': '双黄实线',
                        '14': '白左实右虚线',
                        '15': '黄左实右虚线',
                        '16': '白右实左虚线',
                        '17': '黄右实左虚线',
                        '18': 'HOV专用车道线',
                        '19': '路缘石',
                        '20': '墙',
                        '21': '隧道墙',
                        '22': '屏障',
                        '23': '隔音屏障',
                        '24': '线缆屏障',
                        '25': '防护栏',
                        '26': '栅栏',
                        '27': '可通行路缘石',
                        '28': '道路终点',
                        '29': '悬崖',
                        '30': '沟',
                        '31': '其他屏障',
                        '32': '其他',
                        '33': '停靠站标线',
                        '34': '车行道左边缘线',
                        '35': '车行道右边缘线',
                        '36': '应急车道线',
                        '37': '非机动车道线'
                    }
                },
                '702': {
                    'NAME': '防护设施',
                    'COMPANY': ' (m)',
                    'INFO': [
                        {
                            'ID': 'guardrail_type',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '护栏类型'
                        },
                        {
                            'ID': 'guardrail_height',
                            'LENGTH': 2,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': ' CM',
                            'NAME': '高度'
                        },
                        {
                            'ID': 'protect_grade',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '防护等级'
                        },
                        {
                            'ID': 'mark',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '备注'
                        }
                    ],
                    'SUBTYPE': {
                        '0': 'Unknown',
                        '1': '路缘石',
                        '2': '平墙',
                        '3': '隧道墙',
                        '4': 'Barrier',
                        '5': '新泽西式barrier',
                        '6': '隔音barrier',
                        '7': '障碍线barrier',
                        '8': 'Guardrail防护设施',
                        '9': '围栏',
                        '10': '悬崖',
                        '11': '沟渠',
                        '12': 'Sight Line',
                        '13': '路面铺设',
                        '14': '铁丝网',
                        '15': '防撞桶',
                        '16': '防撞墩',
                        '17': '行道树',
                        '18': '边坡',
                        '19': '路肩',
                        '20': '防眩铁丝网',
                        '21': '遮光板',
                        '22': '遮光柱',
                        '23': 'Curb+绿化带',
                        '24': 'Curb+行道树',
                        '25': 'Curb+绿化带+行道树',
                        '26': 'Curb+人行道'
                    }
                },
                '703': {
                    'NAME': '地面标志',
                    'INFO': [],
                    'SUBTYPE': {
                        '1': '文字',
                        '2': '箭头',
                        '3': '数字',
                        '4': '符号',
                        '99': '其他'
                    },
                    'SUBTYPE_NONE': true
                },
                '704': {
                    'NAME': '路牌',
                    'INFO': [
                        {
                            'ID': 'sign_content',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '路牌内容'
                        },
                        {
                            'ID': 'transverse_place',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '横向位置'
                        },
                        {
                            'ID': 'brace_form',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '固定方式'
                        }
                    ],
                    'SUBTYPE': {
                        '1': '警告标志',
                        '2': '禁令标志',
                        '3': '指示标志',
                        '4': '一般道路指路标志',
                        '5': '高速公路指路标志',
                        '6': '辅助标志',
                        '7': '道路施工安全标志',
                        '8': '旅游区标志',
                        '9': '复合标志',
                        '10': '电子标志牌',
                        '99': '其他'
                    }
                },
                '705': {
                    'NAME': '灯杆',
                    'INFO': [],
                    'SUBTYPE': {
                        '13': '灯杆'
                    }
                },
                '706': {
                    'NAME': '摄像头',
                    'INFO': [],
                    'SUBTYPE': {
                        '21': '视频监控',
                        '22': '电警',
                        '23': '卡口'
                    }
                },
                '707': {
                    'NAME': '里程桩',
                    'INFO': [],
                    'SUBTYPE': {
                        '15': '公里里程桩',
                        '16': '百米里程桩',
                        '115': '虚拟公里桩',
                        '116': '虚拟百米桩'
                    },
                },
                '708': {
                    'NAME': '桥隧',
                    'INFO': [
                        {
                            'ID': 'bridge_name',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '桥梁名称'
                        },
                        {
                            'ID': 'bridge_code',
                            'LENGTH': 0,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': '',
                            'NAME': '桥梁代码'
                        },
                        {
                            'ID': 'length',
                            'LENGTH': 2,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': ' M',
                            'NAME': '桥梁全长（米）'
                        },
                        {
                            'ID': 'width',
                            'LENGTH': 2,
                            'EXT_INFO': 'EXT_INFO',
                            'VAL': ' M',
                            'NAME': '桥梁全宽（米）'
                        }
                    ],
                    'SUBTYPE': {
                        '3': '隧道',
                        '4': '桥'
                    }
                }
            }
        },
        'UP_DOWM': {
            '1': '上行',
            '2': '下行'
        },
        'MATERIAL': {
            '1': '沥青路面病害',
            '2': '水泥混泥土路面病害',
            '2': '其它路面病害'
        },
        'URLS': {
            'ROAD': 'road_asset/stat/queryPage',
            'ANALYSE': 'road_asset/analysis?linkCode=',
            'LIST': 'data/road_asset/queryPage',
            'MAP_LIST': 'data/road_asset/query',
            'MAP_MARK': 'data/position_label/query',
            'DOWNLOAD': 'data/road_asset/exp?linkCode=',
            'ROAD_WIDTH': 'data/road_width_change/queryPage',
            'AGGR': 'aggr/road_asset/aggr?DATA_VERSION='
        }
    }
}

Disease.vector_tile_config = {
    'PAVEMENT_DISTRESS': {
        'images': [
            // 'stone100.png',
            // 'stone1000.png',
            // 'lightpole.png',
            // 'camera.png',
            // 'traffic-light.png',
            // 'adasnode.png',
            // 'firstnode-traffic-sign.png',
            // 'firstnode-divider.png',
            // 'firstnode-barrier.png',
            // 'firstnode-camera.png'
        ],
        'source': [{
            "id": 3,
            "name": "南通",
            "type": 'vector',
            "datasource": "wulumuqi",
            "datasource_mvt": "wulumuqi_mvt",
            "center": [121.142557, 32.236251],
            "zoom": 15,
            "zoomRange": [9, 22],
            "zIndex": 100,
            "mapstyle": "amap://styles/normal"
        }],
        'selectIconLayerIds': [],
        'selectHoverEffectLayerIds': ["pavement_distress",'pavement_distress_pl'],
        'topLayer': null,
        'layer': [
            {
                "id": "pavement_distress",
                "type": "fill",
                "source": "wulumuqi",
                "source-layer": "pavement_distress",
                "paint": {
                    "fill-opacity": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.8,
                        0.4
                    ],
                    "fill-color": "rgb(255,0,0)"
                    // "fill-opacity": 0.3,
                    // "fill-color": "rgb(255,0,0)"
                },
                "minzoom": 17
            },
            {
                "id": "pavement_distress_pl",
                "type": "line",
                "source": "wulumuqi",
                "source-layer": "pavement_distress_pl",
                "paint": {
                    "line-opacity": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.8,
                        0.4
                    ],
                    "line-width":[
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        2,
                        1
                    ],
                    "line-color": "rgb(255, 0, 0)"
                },
                "minzoom": 17
            }
        ]
    },
    'ASSET_INSPECTION': {
        'selectIconLayerIds': [["firstnode-bridge", "firstnode-bridge-highlighted"], ["firstnode_sign", "firstnode_sign-highlighted"], ["firstnode_divider", "firstnode_divider-highlighted"], ["firstnode_barrier", "firstnode_barrier-highlighted"], ["adas", "adas-highlighted"], ['lightpole', 'lightpole-highlighted'], ['camera', 'camera-highlighted'], ['roadstone100', 'roadstone100-highlighted'], ['roadstone1000', 'roadstone1000-highlighted']],

        // 'selectHoverEffectLayerIds': ["splitarealyr", "roadmarking", "slowdownarea1", "slowdownarea2", "crosswalk", "diversionzone", "nostoppingarea", "manholecover"],
        'selectHoverEffectLayerIds': ["polygonBackground"],
        'topLayer':'polygonBackground',
        'images': [
            'stone100.png',
            'stone100 hover.png',
            'stone1000.png',
            'stone1000 hover.png',
            'lightpole.png',
            'lightpole hover.png',
            'adasnode.png',
            'adasnode hover.png',
            'firstnode-traffic-sign.png',
            'firstnode-traffic-sign hover.png',
            'firstnode-bridge.png',
            'firstnode-bridge hover.png',
            'firstnode-divider.png',
            'firstnode-divider hover.png',
            'firstnode-barrier.png',
            'firstnode-barrier hover.png',
            'firstnode-camera.png',
            'firstnode-camera hover.png'
        ],
        'source': [{
            "id": 3,
            "name": "南通",
            "type": 'vector',
            "datasource": "nantong",
            "datasource_mvt": "nantong_mvt",
            "center": [121.142557, 32.236251],
            "zoom": 15,
            "zoomRange": [9, 22],
            "zIndex": 100,
            "mapstyle": "amap://styles/normal"
        }],
        'layer': [
            {
                "id": "polygonBackground",
                "type": "fill",
                "source": "nantong",
                "source-layer": "HD_POLYGON",
                "paint": {
                    "fill-opacity": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.3,
                        0
                    ],
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgba(255, 0, 0,255)",
                        "rgba(0, 128, 0,0)"
                    ]
                    // "fill-opacity": 0,
                    // "fill-color": "rgb(128, 128, 128)"
                },
                "minzoom": 15,
                "maxzoom": 22,
                "filter": ["!in", "TYPE", 600, 80]
            },
            {
                "id": "roadbg",
                "type": "fill",
                "source": "nantong",
                "source-layer": "boundary_2d",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(78, 78, 78)"
                }
            },
            {
                "id": "roadbg1",
                "type": "fill",
                "source": "nantong",
                "source-layer": "barrier_poly",
                "minzoom": 15,
                "paint": {
                    "fill-opacity": 0.4,
                    "fill-color": "rgb(46,139,87)"
                }
            },
            {
                "id": "splitarealyr",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "minzoom": 15,
                "maxzoom": 22,
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(0, 128, 0)"
                    ]
                    // "fill-color": "rgb(0, 128, 0)"
                },
                "filter": ["in", "TYPE", 40, 44]
            },
            {
                "id": "personway",
                "type": "fill",
                "source": "nantong",
                "source-layer": "HD_POLYGON",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(128, 128, 128)"
                },
                "minzoom": 15,
                "maxzoom": 22,
                "filter": ["==", "TYPE", 23]
            },
            {
                "id": "curb",
                "type": "line",
                "source": "nantong",
                "source-layer": "barrier",
                "paint": {
                    "line-opacity": 1,
                    "line-width": 1.6,
                    "line-color": "grey"
                },
                "minzoom": 18,
                "filter": ["==", "TYPE", 1]
            },
            {
                "id": "fence",
                "type": "line",
                "source": "nantong",
                "source-layer": "barrier",
                "paint": {
                    "line-opacity": 1,
                    "line-width": 1.6,
                    "line-color": "white",
                    "line-dasharray": [3, 1]
                },
                "minzoom": 18,
                "filter": ["in", "TYPE", 8, 9]
            },
            {
                "id": "divider_white_highlevel",
                "type": "fill",
                "source": "nantong",
                "source-layer": "divider_poly",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 17,
                "filter": ["all", ["in", "VIRTUAL", 0, 2], ["in", "COLOR", 0, 1]]
            },
            {
                "id": "divider_whitesolid_lowlevel",
                "type": "line",
                "source": "nantong",
                "source-layer": "divider",
                "paint": {
                    "line-opacity": 1,
                    "line-color": "rgb(255, 255, 255)"
                },
                "minzoom": 14,
                "maxzoom": 17,
                "filter": ["all", ["in", "TYPE", 0, 1, 3, 34, 35], ["in", "VIRTUAL", 0, 2], ["in", "COLOR", 0, 1]]
            },
            {
                "id": "divider_whitedash_lowlevel",
                "type": "line",
                "source": "nantong",
                "source-layer": "divider",
                "paint": {
                    "line-opacity": 1,
                    "line-color": "rgb(255, 255, 255)",
                    "line-dasharray": [5, 9]
                },
                "minzoom": 14,
                "maxzoom": 17,
                "filter": ["all", ["in", "TYPE", 2, 8], ["in", "VIRTUAL", 0, 2], ["in", "COLOR", 0, 1]]
            },
            {
                "id": "divider_yellow_highlevel",
                "type": "fill",
                "source": "nantong",
                "source-layer": "divider_poly",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(255, 255, 0)"
                },
                "minzoom": 17,
                "filter": ["all", ["in", "VIRTUAL", 0, 2], ["==", "COLOR", 2]]
            },
            {
                "id": "divider_yellowsolid_lowlevel",
                "type": "line",
                "source": "nantong",
                "source-layer": "divider",
                "paint": {
                    "line-opacity": 1,
                    "line-color": "rgb(255, 255, 0)"
                },
                "minzoom": 14,
                "maxzoom": 17,
                "filter": ["all", ["in", "TYPE", 10, 13, 34, 35], ["in", "VIRTUAL", 0, 2], ["==", "COLOR", 2]]
            },
            {
                "id": "divider_yellowdash_lowlevel",
                "type": "line",
                "source": "nantong",
                "source-layer": "divider",
                "paint": {
                    "line-opacity": 1,
                    "line-color": "rgb(255, 255, 0)",
                    "line-dasharray": [10, 17]
                },
                "minzoom": 14,
                "maxzoom": 17,
                "filter": ["all", ["in", "TYPE", 9, 12], ["in", "VIRTUAL", 0, 2], ["in", "COLOR", 0, 2]]
            },
            {
                "id": "divider_orange_highlevel",
                "type": "fill",
                "source": "nantong",
                "source-layer": "divider_poly",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(255, 140, 0)"
                },
                "minzoom": 17,
                "filter": ["all", ["in", "VIRTUAL", 0, 2], ["==", "COLOR", 3]]
            },
            {
                "id": "divider_orangesolid_lowlevel",
                "type": "line",
                "source": "nantong",
                "source-layer": "divider",
                "paint": {
                    "line-opacity": 1,
                    "line-color": "rgb(255, 140, 0)"
                },
                "minzoom": 14,
                "maxzoom": 17,
                "filter": ["all", ["in", "TYPE", 0, 4], ["in", "VIRTUAL", 0, 2], ["==", "COLOR", 3]]
            },
            {
                "id": "polylinelocatewhite",
                "type": "fill",
                "source": "nantong",
                "source-layer": "polyline_poly",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 17,
                "filter": ["all", ["in", "TYPE", 9, 10], ["==", "COLOR", 1]]
            },
            {
                "id": "polylinelocateyellow",
                "type": "fill",
                "source": "nantong",
                "source-layer": "polyline_poly",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(255, 255, 0)"
                },
                "minzoom": 17,
                "filter": ["all", ["in", "TYPE", 9, 10], ["==", "COLOR", 2]]
            },
            {
                "id": "stopline_highlevel",
                "type": "fill",
                "source": "nantong",
                "source-layer": "polyline_poly",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 17,
                "filter": ["in", "TYPE", 2, 3, 11]
            },
            {
                "id": "stopline_lowlevel",
                "type": "line",
                "source": "nantong",
                "source-layer": "HD_POLYLINE",
                "paint": {
                    "line-opacity": 1,
                    "line-color": "rgb(255, 255, 255)"
                },
                "minzoom": 14,
                "maxzoom": 17,
                "filter": ["in", "TYPE", 2, 3]
            },
            {
                "id": "roadmarking",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(255, 255, 255)"
                    ]
                    // "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 14,
                "filter": ["in", "TYPE", 1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 55, 60]
            },
            {
                "id": "slowdownarea1",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 0.4,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(255,255, 255)"
                    ]
                    // "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["all", ["==", "TYPE", 5], ["==", "COLOR", 1]]
            },
            {
                "id": "slowdownarea2",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 0.4,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(255, 255, 0)"
                    ]
                    // "fill-color": "rgb(255, 255, 0)"
                },
                "minzoom": 16,
                "filter": ["all", ["==", "TYPE", 5], ["==", "COLOR", 2]]
            },
            {
                "id": "crosswalk",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(255, 255, 255)"
                    ]
                    // "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 17,
                "filter": ["all", ["==", "TYPE", 7], ["==", "COM_TYPE", 1]]
            },
            {
                "id": "diversionzone",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 1,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(255, 255, 255)"
                    ]
                    // "fill-color": "rgb(255, 255, 255)"
                },
                "minzoom": 17,
                "filter": ["all", ["==", "TYPE", 9], ["==", "COM_TYPE", 1]]
            },
            {
                "id": "nostoppingarea",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 0.6,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "orange"
                    ]
                    // "fill-color": "orange"
                },
                "minzoom": 17,
                "filter": ["==", "TYPE", 8]
            },


            {
                "id": "manholecover",
                "type": "fill",
                "source": "nantong",
                "source-layer": "road_marking",
                "paint": {
                    "fill-opacity": 0.3,
                    "fill-color": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        "rgb(255, 0, 0)",
                        "rgb(112,128,144)"
                    ]
                    // "fill-color": "rgb(112,128,144)"
                },
                "minzoom": 17,
                "filter": ["all", ["in", "TYPE", 72, 73]]
            },
            {
                "id": "camera",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "firstnode-camera",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["in", "TYPE", 21, 22, 23]
            },
            {
                "id": "camera-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "firstnode-camera hover",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["all", ["in", "TYPE", 21, 22, 23], ['in', 'ID', '']]
            },
            {
                "id": "trafficlight",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_TRAFFIC_LIGHT",
                "layout": {
                    "icon-image": "traffic-light",
                    "icon-size": 0.5,
                    "icon-allow-overlap": true,
                    "text-allow-overlap": true
                },
                "minzoom": 18,
                "filter": ["==", "TYPE", 0]
            },
            {
                "id": "roadstone1000",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "stone1000",
                    "icon-size": 0.65
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["==", "TYPE", 15]
            },
            {
                "id": "roadstone1000-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "stone1000 hover",
                    "icon-size": 0.65
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["all", ["==", "TYPE", 15], ['in', 'ID', '']]
            },
            {
                "id": "roadstone100",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "stone100",
                    "icon-size": 0.65
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["==", "TYPE", 16]
            },
            {
                "id": "roadstone100-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "stone100 hover",
                    "icon-size": 0.65
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["all", ["==", "TYPE", 16], ['in', 'ID', '']]
            },
            {
                "id": "lightpole",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "lightpole",
                    "icon-size": 0.65
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["==", "TYPE", 13]
            },
            {
                "id": "lightpole-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "HD_POINT",
                "layout": {
                    "icon-image": "lightpole hover",
                    "icon-size": 0.65
                },
                "minzoom": 16,
                "maxzoom": 22,
                "filter": ["all", ["==", "TYPE", 13], ['in', 'ID', '']]
            },
            {
                "id": "road_road",
                "type": "line",
                "source": "nantong",
                "source-layer": "ROAD",
                "paint": {
                    "line-opacity": 0.7,
                    "line-width": 4,
                    "line-color": "rgb(78,238,148)"
                },
                "minzoom": 9,
                "maxzoom": 16,
                "filter": ["==", "RTYPE", 1]
            },
            {
                "id": "road_tunnel",
                "type": "line",
                "source": "nantong",
                "source-layer": "ROAD",
                "paint": {
                    "line-opacity": 0.7,
                    "line-width": 4,
                    "line-color": "rgb(127,255,212)"
                },
                "minzoom": 9,
                "maxzoom": 16,
                "filter": ["==", "RTYPE", 3]
            },
            {
                "id": "road_bridge",
                "type": "line",
                "source": "nantong",
                "source-layer": "ROAD",
                "paint": {
                    "line-opacity": 0.7,
                    "line-width": 4,
                    "line-color": "rgb(51,204,255)"
                },
                "minzoom": 9,
                "maxzoom": 16,
                "filter": ["==", "RTYPE", 4]
            },
            {
                "id": "road_other",
                "type": "line",
                "source": "nantong",
                "source-layer": "ROAD",
                "paint": {
                    "line-opacity": 0.7,
                    "line-width": 4,
                    "line-color": "rgb(105,105,105)"
                },
                "minzoom": 9,
                "maxzoom": 16,
                "filter": ["in", "TYPE", 2, 5]
            },
            {
                "id": "adas",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "road_adas",
                "layout": {
                    "icon-image": "adasnode",
                    "icon-size": 0.9
                },
                "minzoom": 20
            },
            {
                "id": "adas-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "road_adas",
                "layout": {
                    "icon-image": "adasnode hover",
                    "icon-size": 0.9
                },
                "filter": ['in', 'ID', ''],
                "minzoom": 20
            },
            {
                "id": "firstnode_barrier",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-barrier",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["==", "FEA_TYPE", 1]
            },
            {
                "id": "firstnode_barrier-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-barrier hover",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["all", ["==", "FEA_TYPE", 1], ['in', 'ID', '']]
            },
            {
                "id": "firstnode_divider",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-divider",
                    // "icon-image" :[
                    //     'coalesce',
                    //     ['image', ['concat', ['feature-state', 'hover'], 'firstnode-divider']],
                    //     ['image', 'firstnode-divider']
                    //     ],

                    // "icon-image" : [
                    //     'case',
                    //     ['boolean', ['feature-state', 'hover'], false],
                    //     "firstnode-divider hover",
                    //     "firstnode-divider"
                    //     ],
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["==", "FEA_TYPE", 2]
            },
            {
                "id": "firstnode_divider-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-divider hover",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["all", ["==", "FEA_TYPE", 2], ['in', 'ID', '']]
            },
            {
                "id": "firstnode_sign",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-traffic-sign",
                    "icon-size": 0.6
                },
                "minzoom": 18,
                "filter": ["==", "FEA_TYPE", 8]
            },
            {
                "id": "firstnode_sign-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-traffic-sign hover",
                    // "icon-offset": [1,1],
                    "icon-size": 0.6
                },
                "minzoom": 18,
                "filter": ["all", ["==", "FEA_TYPE", 8], ['in', 'ID', '']]
            },
            {
                "id": "firstnode-bridge",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-bridge",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["all", ["==", "FEA_TYPE", 9], ["in", "TYPE", 3, 4]]
            },
            {
                "id": "firstnode-bridge-highlighted",
                "type": "symbol",
                "source": "nantong",
                "source-layer": "firstnode",
                "layout": {
                    "icon-image": "firstnode-bridge hover",
                    "icon-size": 0.5
                },
                "minzoom": 18,
                "filter": ["all", ["==", "FEA_TYPE", 9], ["in", "TYPE", 3, 4], ['in', 'ID', '']]
            }
        ]
    }
}

Disease.TYPE_LIST = Disease.business_list['ASSET_INSPECTION'];


/*获取系统时间*/
Disease.getSystemTime = function () {
    $.getAjax({
        url: config_url.pdds + 'time',
        callback: function (data) {
            if (data.code != '0') {
                $.errorView('获取系统时间失败：默认使用本地时间');
            }
            var datas = data.result || {},
                time = datas.time || 0,
                new_time = time ? Number(time) : new Date();

            Disease.system_time = new_time;

        }
    })
}