/*
* 复制道路属性UI
*/
iD.ui.TagsClone = function (context, flag) {
    var owner_ship = 'OWNER_SHIP';
    var src_flag = 'SRC_FLAG';
    var isAttrTask  = true;// (iD.ui.NodeLineInfo.dataMgr(context).isTagUpdateAlikeTask() || iD.Task.isMarkingTask() || (iD.Task.d.task_type == 7)) && (flag == iD.data.DataType.ROAD);
    var event = d3.dispatch('tags_cpoy'), selectedIDs, originalTags = {}, copyTags = {};
    var tipUtil = iD.ui.TipUtil(context);
    var taskClass = iD.Task.d.task_classes;
    //obug任务和属性任务需求一致
    if (iD.Task.d.task_type == 7) {
        taskClass = 'attrtask';
    }

    var copyConfig = {
        'default': {    //mtf 160318默认面板与路网的面板一致
            'displayedNames': ["道路名称", "道路别名/曾用名", "道路等级", "道路所有", "道路构成", 'FOW',
                "道路行驶方向", "功能等级", 'LC1', 'LC2', "道路类型", "道路状态", "收费道路", "平均车道数", "数据来源",
                '道路宽度', '收费道路', '掉头专用道路', '步行通行状态', '渲染分级', '货车禁止信息'],
            'displayedIds': ['NAME_CHN', 'ALIAS_CHN', 'ROAD_CLASS', 'OWNER_SHIP', 'FORM_WAY', 'FOW',
                'DIRECTION', 'FC', 'LC_1', 'LC_2', 'LINK_TYPE', 'STATUS', 'TOLL', 'AVE_LANES', 'SRC_FLAG',
                'WIDTH', 'TOLL', 'U_LINE', 'NAVITYPE', 'REND_CLASS']
        },
        //基础路网
        '6': {
            'displayedNames': ["道路名称", "道路别名/曾用名", "道路等级", "道路所有", "道路构成", 'FOW',
                "道路行驶方向", "功能等级", 'LC1', 'LC2', "道路类型", "道路状态", "收费道路", "平均车道数", "数据来源",
                '道路宽度', '收费道路', '掉头专用道路', '步行通行状态', '渲染分级', '货车禁止信息'],
            'displayedIds': ['name_chn', 'alias_chn', 'road_class', 'OWNER_SHIP', 'form_way', 'fow',
                'direction', 'fc', 'lc_1', 'lc_2', 'link_type', 'status', 'toll', 'ave_lanes', 'SRC_FLAG',
                'width', 'toll', 'u_line', 'navitype', 'rend_class']
        },
        //道路属性
        'attrtask': {
        	'displayedNames': ['通行方向', '道路名称', '道路拼音', '道路英文名称', '道路别名', '道路别名拼音', '道路别名英文名称',
                '道路路线编号', '道路等级', '功能等级FC', '道路构成', '道路类型', '车道数', '道路宽度', /*'link的长度（米）', */'收费道路',
                '道路状态', '道路所有', '是否高架道路', '道路所在行政区划代码', '市区道路标志', '掉头专用道路', '数据来源', '道路铺设状态',
                '实时路况等级', '道路路边停车属性标识', '渲染等级', '辅路标识', '出入口标识', '区域归属', '作业员',
                '生产参考资料', '参考资料时效', '标识'
            ],
            'displayedIds': ['DIRECTION', 'NAME_CHN', 'NAME_PY', 'NAME_ENG', 'ALIAS_CHN', 'ALIAS_PY', 'ALIAS_ENG',
                'ROUTE_NO', 'ROAD_CLASS', 'FC', 'FORM_WAY', 'LINK_TYPE', 'S_LANES', 'WIDTH', /*'LENGTH', */'TOLL_FLAG',
                'STATUS', 'OWNER_SHIP', 'OVER_HEAD', 'AD_CODE', 'URBAN', 'U_LINE', 'SRC_FLAG', 'PAVER',
                'T_TRLAYER', 'ROAD_PARK', 'REND_CLAS_S', 'SIDEROAD', 'RAMP', 'AREA_FLAG',
                'OPERATOR', 'SOURCE', 'SDATE', 'FLAG'
            ],
            'selectAllIds': ['NAME_CHN', 'ALIAS_CHN', 'FNAME_CHN', 'ROAD_CLASS', 'OWNER_SHIP', 'PARKING_RD', 'FORM_WAY',
                'DIRECTION', 'AVE_LANES', 'LANE_WIDE', 'WIDTH', 'FOW', 'FC', 'LC_1',
                'LC_2', 'LINK_TYPE', 'STATUS', 'TOLL', 'OVER_HEAD', 'PAVER', 'U_LINE',
                'SRC_FLAG', 'AD_CODE', 'SIDEROAD', 'RAMP',
                'NAVITYPE', 'VERIFYUSER', 'VERIFYTIME'],
            'defaultIds': ['DIRECTION', 'NAME_CHN', 'NAME_PY', 'ALIAS_CHN', 'ALIAS_PY', 'ROAD_CLASS', 'LINK_TYPE', 'OWNER_SHIP',
                'FC', 'S_LANES', 'FORM_WAY', 'WIDTH', 'STATUS', 'SRC_FLAG'
            ],
            /*'displayedNames': ['道路名称', '道路别名', '曾用名', '道路等级', '道路所有', '停车场道路', '道路构成',
                '道路方向', '车道数', '平均车道宽度', '道路宽度', '正向车道数', '逆向车道数', 'FOW', 'FC', 'LC1',
                'LC2', '道路类型', '道路状态', '收费道路', '高架道路', '道路铺设', '道路预计通车时间', '掉头专用',
                '数据来源', '数据来源合并', '实施渲染', '道路与行政区划重合', 'AD_CODE', '辅路标识', '出入口标识',
                'NAVITYPE', '渲染分级', '占道经营', '易积水道路', '长期停车占道', '繁华路段', '道路通行能力',
                '道路相对通行热度', '道路层级', '高精度坡度来源', '道路ADAS数据标识', '路边停车标识',
                // '自行车通行状况', '自行车通行方向','绿道等级',
                '核实人', '核实时间', '货车禁止信息'
            ],
            'displayedIds': ['NAME_CHN', 'ALIAS_CHN', 'FNAME_CHN', 'ROAD_CLASS', 'OWNER_SHIP', 'PARKING_RD', 'FORM_WAY',
                'DIRECTION', 'AVE_LANES', 'LANE_WIDE', 'WIDTH', 'P_LANES', 'N_LANES', 'FOW', 'FC', 'LC_1',
                'LC_2', 'LINK_TYPE', 'STATUS', 'TOLL', 'OVER_HEAD', 'PAVER', 'USETIME', 'U_LINE',
                'SRC_FLAG', 'TRLAYER', 'AD_BND', 'AD_CODE', 'SIDEROAD', 'RAMP',
                'NAVITYPE', 'REND_CLASS', 'STALL', 'SEEPER', '_STOP', 'HOTAREA', 'CAPACITY',
                'HEAT', 'ROAD_SLOPE', 'SLOPE_SRC', 'ADAS', 'ROAD_PARK',
                //'', '', '',
                'VERIFYUSER', 'VERIFYTIME', 'ROADRULE'
            ],
            'selectAllIds': ['DIRECTION', 'NAME_CHN', 'NAME_PY', 'NAME_ENG', 'ALIAS_CHN', 'ALIAS_PY', 'ALIAS_ENG',
                'ROUTE_NO', 'ROAD_CLASS', 'FC', 'FORM_WAY', 'LINK_TYPE', 'S_LANES', 'WIDTH', 'LENGTH', 'TOLL_FLAG',
                'STATUS', 'OWNER_SHIP', 'OVER_HEAD', 'AD_CODE', 'URBAN', 'U_LINE', 'SRC_FLAG', 'PAVER',
                'T_TRLAYER', 'ROAD_PARK', 'REND_CLAS_S', 'SIDEROAD', 'RAMP', 'AREA_FLAG',
                'OPERATOR', 'SOURCE', 'SDATE', 'FLAG'],
            'defaultIds': ['name_chn', 'alias_chn', 'fname_chn', 'road_class', 'OWNER_SHIP', 'parking_rd', 'form_way',
                'direction', 'ave_lanes', 'lane_wide', 'width',
            ],*/
            'ruleChange': {'ave_lanes': '0', 'lane_wide': '0', 'width': '0'}
        },
        'furniture': {
            'displayedNames': ['道路设施类型', '辅助说明信息', '附加文字信息', '数据来源', '区间限速的时间限制',
                '区间限速的天气限制', '区间限速的车辆类型', '季节性交通限制类型', '节假日交通限制类型', '可变限速牌的位置'],
            'displayedIds': ['type', 'info', 'rf_text', 'SRC_FLAG', 'rule_time',
                'weather', 'vehicle', 'season', 'holiday', 'rf_pos'],
        },
        'WalkEnter': {
            'displayedNames': ['设施名称', '层级', '资料来源'],
            'displayedIds': ['name_chn', 'loc_type', 'src'],
        },
        'WalkLink': {
            'displayedNames': ['设施名称', '设施类型', '物理形态', '是否收费','遮挡标识', '建设状态', '通行方向',
                '坡度趋势','门禁类型','道路所有',
                '允许通行时间', '通行状态', '备注信息','资料来源',
                '绿道标识','骑行等级','骑行方向','区域标识'],
            'displayedIds': ['name_chn', 'wf_type', 'link_type', 'istoll','covered', 'constatus', 'direction',
                'slope','block_type','ownership',
                'arule_time', 'navitype', 'note','src','greenway','bicycle','bi_dir','area_flag'],
        },
        'WalkArea': {
            'displayedNames': ['设施名称', '设施类型', '封闭标识', '资料来源'],
            'displayedIds': ['name_chn', 'wf_type', 'srca', 'src'],
        },
        'lanepoint': {
            'displayedNames': ['车道数', '左侧变化', '右侧变化', '左侧边缘类型','右侧边缘类型','分割线类型','分割线颜色'],
            'displayedIds': ['lane_nums', 'change_l', 'change_r', 'bound_l','bound_r','div_type','div_clr']
        }
    }

    function getTags() {
        if (flag == iD.data.DataType.ROAD) {
            return getHighWayTags();
        }
        // else if (flag == iD.data.DataType.ROADFURNITURE) {
        //     return getRoadFurnitureTags();
        // }
        // else if (flag == iD.data.DataType.WALKENTER || flag == iD.data.DataType.WALKLINK || flag == iD.data.DataType.WALKAREA) {
        //     return getWalkTags(flag);
        // }
       /* else if ( flag == iD.data.DataType.LANEPOINT ){
            return getLanePointTags();
        }*/
    }
    function getLanePointTags(){
        if (!selectedIDs) return {};
        let copyLanePointID = localStorage.getItem('tags_copy_lanePoint'),
            lanePointEntity = context.entity(copyLanePointID), displayTags = [];
        let displayedIds = copyConfig['lanepoint'].displayedIds,
            displayedNames = copyConfig['lanepoint'].displayedNames;
        displayTags.push({id: 31, name: '全选', data_value: ''});
        for (let i = 0; i < displayedIds.length; i++) {
            for (let key in lanePointEntity.tags) {
                if (displayedIds[i] == key) {
                    displayTags.push({
                        'id': key,
                        'data_value': lanePointEntity.tags[key],
                        'name': displayedNames[i],
                    })
                }
            }
        }
        displayTags.push({id: 'lanepoint_lane', name: '车道对象', data_value: ''});
        return displayTags;
    }

    function getWalkTags(datatype) {
        if (!selectedIDs) return {};
        var copyWalkID;
        switch (datatype) {
            case iD.data.DataType.WALKENTER:
                copyWalkID = localStorage.getItem('tags_copy_walkEnter');
                break;
            case iD.data.DataType.WALKLINK:
                copyWalkID = localStorage.getItem('tags_copy_walkLink');
                break;
            case iD.data.DataType.WALKAREA:
                copyWalkID = localStorage.getItem('tags_copy_walkArea');
                break;
        }
        var displayedIds = copyConfig[datatype].displayedIds, displayedNames = copyConfig[datatype].displayedNames, displayTags = [];
        var copyWalkEntity = context.entity(copyWalkID)
        displayTags.push({id: 31, name: '全选', data_value: ''});
        for (var i = 0; i < displayedIds.length; i++) {
            for (var key in copyWalkEntity.tags) {
                if (displayedIds[i] == key) {
                    displayTags.push({
                        'id': key,
                        'data_value': copyWalkEntity.tags[key],
                        'name': displayedNames[i],
                    })
                }
            }
        }
        return displayTags;
    }

    function getRoadFurnitureTags() {
        if (!selectedIDs) return {};
        var copyFurnitureID = localStorage.getItem('s_map_editor_copy_wayId'), furnitureEntity = context.entity(copyFurnitureID), displayTags = [];
        var displayedIds = copyConfig['furniture'].displayedIds, displayedNames = copyConfig['furniture'].displayedNames;
        displayTags.push({id: 31, name: '全选', data_value: ''});
        for (var i = 0; i < displayedIds.length; i++) {
            for (var key in furnitureEntity.tags) {
                if (displayedIds[i] == key) {
                    displayTags.push({
                        'id': key,
                        'data_value': furnitureEntity.tags[key],
                        'name': displayedNames[i],
                    })
                }
            }
        }
        return displayTags;
    }

    function getHighWayTags() {
        if (!selectedIDs) return {};
        var first = localStorage.getItem('s_map_editor_copy_wayId'), copyWay = context.entity(first);
        var displayedIds = [], displayedNames = [], displayTags = [];
        copyTags = copyWay.tags;
        //路网属性不要全选
         if (!isAttrTask) {
            displayTags.push({id: 31, name: '全选', data_value: ''});
         }

        if (isAttrTask) {
            displayedIds = copyConfig['attrtask'].displayedIds;
            displayedNames = copyConfig['attrtask'].displayedNames;
        }
        // else if (copyConfig[taskClass]) {
        //     displayedIds = copyConfig[taskClass].displayedIds;
        //     displayedNames = copyConfig[taskClass].displayedNames;
        //
        // }
        else {
            displayedIds = copyConfig['default'].displayedIds;
            displayedNames = copyConfig['default'].displayedNames;
        }
        for (var i = 0; i < displayedIds.length; i++) {
            //单独处理roadrule复制
            var roadruleArr = [];
            if (displayedIds[i] == 'roadrule') {
                let rels = editor.context.graph().parentRelations(copyWay);
                rels.map(rel => {
                    if (rel.modelName == iD.data.DataType.ROADRULE) {
                        roadruleArr.push(rel);
                    }
                })
                displayTags.push({
                    'id': displayedIds[i],
                    'data_value': JSON.stringify(roadruleArr),
                    'name': displayedNames[i],
                })
                continue;
            }
            for (var key in copyWay.tags) {
                if (displayedIds[i] == key) {
                    displayTags.push({
                        'id': key,
                        'data_value': copyWay.tags[key],
                        'name': displayedNames[i],
                    })
                    //单独处理数据来源合并项
                    /*if (key == src_flag && isAttrTask) {
                        displayTags.push({
                            'id': src_flag + '_merge',
                            'data_value': copyWay.tags[key],
                            'name': displayedNames[i + 1],
                        })
                    }*/
                }
            }
        }

        return displayTags;
    }

    //对于所有的道路属性进行强制联动
    function forceLinage(tags) {
        var d = {};
        if (tags.status && (tags.status == '2' || tags.direction == '4' || tags.form_way == '17')) {
            d.fc = '6';
            d.lc_1 = '0';
            d.lc_2 = '0';
        }
        if (tags.link_type && tags.link_type == '1' && tags.navitype == '0') {
            d.road_class = '45000';
        }
        if (tags.link_type && tags.link_type == '5' && tags.navitype == '0') {
            d.road_class = '49';
        }
        if (tags.form_way && (tags.form_way == '17' || tags.form_way == '59')) {
            d.road_class = '47000';
        }
        if (tags.link_type && tags.link_type == '1') {
            d.direction = '1';
            d.fow = '-1';
        }
        if (tags.direction && tags.direction == '4') {
            d.form_way = '15';
            d.link_type = '0';
            d[owner_ship] = '0';
            d.status = '0';
            d.ave_lanes = '1';
            d.width = '3';
        }
        if (tags.link_type && tags.link_type == '1') {
            d.form_way = '15';
            d.toll = '0';
            d.ave_lanes = '1';
            d.width = '3';
        }
        if (tags.status && tags.status == '2') {
            d.toll = '0';
        }
        if (tags.road_class && (tags.road_class == '41000' || tags.road_class == '43000')) {
            d[owner_ship] = '0';
            d.paver = '2';
        }
        if (tags.form_way && tags.form_way == '59') {
            d[owner_ship] = '1';
        }
        if (tags.form_way && tags.form_way == '4') {
            d.fow = '4';
        }
        if (tags.form_way && tags.form_way == '5') {
            d.fow = '12';
        }
        if (tags.direction && tags.direction == '4' && tags.road_class && tags.road_class != '100') {
            d.fow = '14';
        }
        if (tags.parking_rd && (tags.parking_rd == '3' || tags.parking_rd == '4')) {
            d.fow = '7';
        }
        if (tags.navitype && (tags.navitype == '0' || tags.navitype == '1' || tags.navitype == '2' || tags.navitype == '3')) {
            if (!(tags.road_class && tags.road_class == '49' && tags.navitype && tags.navitype == '1')) {
                if ((tags.road_class == '41000' || tags.road_class == '43000')
                    || (tags.form_way && (tags.form_way == '3' || tags.form_way == '8' || tags.form_way == '9' || tags.form_way == '10' || tags.form_way == '13' || tags.form_way == '14'))
                    || (tags[owner_ship] && tags[owner_ship] == '3' && tags[owner_ship] == '4')
                    || tags.u_line == '1') {
                    d.navitype = '2';
                }
            }
            else {
                d.navitype = '0';
            }
        }
        //正向通行
        if (tags.direction && tags.direction == '2') {
            d.p_lanes = tags.ave_lanes;
            d.n_lanes = '0';
        }
        //逆向通行
        if (tags.direction && tags.direction == '3') {
            d.n_lanes = tags.ave_lanes;
            d.p_lanes = '0';
        }
        if (tags.direction && (tags.direction == '1' || tags.direction == '4')) {
            d.ave_lanes = '1';
            d.p_lanes = '1';
            d.n_lanes = '1';
        }
        // console.log('force linkage d', d);
        return d;
    }

    function linkageAttribute(selectedTags) {
        var owner_ship = iD.data.Tags.OWNERSHIP;
        if (isAttrTask) {
            if (selectedTags[src_flag + '_merge'] != undefined) {
                var originalSrcFlag = iD.util.toRevBinary32(originalTags[src_flag]);
                var copyWaySrcFlag = iD.util.toRevBinary32(copyTags[src_flag]);
                var arr = [];
                for (var i=0; i<32; i++) {
                    if (originalSrcFlag.charAt(i)=='1' || copyWaySrcFlag.charAt(i)=='1') {
                        arr.push(i);
                    }
                }
                selectedTags[src_flag] = iD.util.srcFlagBuild(arr).toString();
                delete selectedTags[src_flag + '_merge'];
            }
        }
        //else if (copyConfig[taskClass]) {
        else if (iD.Task.working.task_classes == iD.data.TaskClass.BASEROAD) {
            //路网任务要求属性强制关联
            if (typeof selectedTags.direction != 'undefined' && selectedTags.direction == '4') {
                selectedTags.fow = '14';
                selectedTags.status = '0';
                selectedTags.link_type = '0';
                selectedTags[owner_ship] = '0';
                selectedTags.ave_lanes = '1';
                selectedTags.width = '3';
                selectedTags.fc = '6';
                selectedTags.lc_1 = '0';
                selectedTags.lc_2 = '0';
            }
            if (typeof selectedTags.form_way != 'undefined' && selectedTags.form_way == '4') {
                selectedTags.fow = '4'
            }
            if (typeof selectedTags.link_type != 'undefined' && selectedTags.link_type == '1') {
                if (originalTags['navitype'] == '0') {
                    selectedTags.ave_lanes = '1';
                    selectedTags.width = '3';
                    selectedTags.form_way = '15';
                    selectedTags.direction = '1';
                    selectedTags.road_class = '45000';
                    selectedTags.fow = '-1';
                }
                else if (originalTags['navitype'] == '1') {
                    selectedTags.ave_lanes = '1';
                    selectedTags.width = '3';
                    selectedTags.form_way = '15';
                    selectedTags.direction = '1';
                    selectedTags.road_class = '49';
                    selectedTags.fow = '-1';
                }
            }
            if (typeof selectedTags.road_class != 'undefined') {
                // console.log('originalTags.road_class', originalTags.road_class);
                if (originalTags.road_class != '41000' && originalTags.road_class != '43000'
                    && (selectedTags.road_class == '41000' || selectedTags.road_class == '43000')) {
                    selectedTags.lane_wide = '3.50';
                    var width;
                    if (typeof selectedTags.ave_lanes != 'undefined') {
                        width = 3.5 * selectedTags.ave_lanes;
                    }
                    else {
                        width = 3.5 * originalTags.ave_lanes;
                    }
                    width = width.toFixed(1).toString();
                    selectedTags.width = width;
                }
                else if ((originalTags.road_class == '41000' || originalTags.road_class == '43000')
                    && selectedTags.road_class != '41000' && selectedTags.road_class != '43000') {
                    selectedTags.lane_wide = '3.00';
                    var width;
                    if (typeof selectedTags.ave_lanes != 'undefined') {
                        width = 3.5 * selectedTags.ave_lanes;
                    }
                    else {
                        width = 3.5 * originalTags.ave_lanes;
                    }
                    width = width.toFixed().toString();
                    selectedTags.width = width;
                }
            }
            if (typeof selectedTags.direction != 'undefined') {
                var ave_lanes;
                if (typeof selectedTags.ave_lanes != 'undefined') {
                    ave_lanes = selectedTags.ave_lanes;
                }
                else {
                    ave_lanes = originalTags.ave_lanes;
                }
                if (selectedTags.direction == '2') {
                    selectedTags.p_lanes = ave_lanes;
                    selectedTags.n_lanes = '0';
                }
                else if (selectedTags.direction == '3') {
                    selectedTags.n_lanes = ave_lanes;
                    selectedTags.p_lanes = '0';
                }
                else if ((selectedTags.direction == '1' || selectedTags.direction == '4')
                    && ave_lanes == '1') {
                    selectedTags.p_lanes = '1';
                    selectedTags.n_lanes = '1';
                }
            }
            if (typeof selectedTags.parking_rd != 'undefined' && (selectedTags.parking_rd == '4' || selectedTags.parking_rd == '5')) {
                selectedTags.fow = '7';
            }
        }
        else {
            // 复制粘贴时包含道路等级属性，且被粘贴道路等级为“空”的时候，需同时粘贴FC\LC1\LC2属性。
            // 如被粘贴道路等级不为“空”的时候，则按照当前面板显示选择对应属性进行粘贴。
            var roadClass = selectedTags['road_class'];
            if (roadClass == '') {
                selectedTags['fc'] = originalTags.fc;
                selectedTags['lc_1'] = originalTags.lc_1;
                selectedTags['lc_2'] = originalTags.lc_2;
            }
        }
        return selectedTags;
    }

    function tagsClone(selection) {
        var modal = iD.ui.modal(selection);
        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');

        var cloneTagsDiv = modal.append('div').attr('class', 'cloneTagsDiv').attr('id', 'cloneTagsDiv');
        var cloneTags = d3.select('.cloneTagsDiv');
        var restriction = cloneTags.append('div')
            .attr('class', 'cloneTags')
            .attr('id', 'cloneTags')
        var titleTable = restriction.append('table')
            .attr('class', 'cloneAttr-title-table')
            .attr('id', 'cloneAttr-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'cloneAttr-title-content-td')
            .text('属性粘贴');
        tr.append('td')
            .attr('class', 'cloneAttr-title-close-td')
            .on('click', function () {
                btnClose();
            })
            .append('span')
            .attr('class', 'cloneAttr-title-close-span')
            .text('×');

        var wrap = restriction.append('div');
        drawTagsDetail();

        //属性任务修改排版
        if (isAttrTask) {
            d3.select('#cloneTags').style('width', '550px');
            d3.selectAll('.cloneTagsDiv .rule-list-info .item-type').style('width', '33%');
        }

        function drawTagsDetail() {
            var items = wrap.html('');
            var carRule = items.append('div').attr('class', 'rule-list-info');
            var cbList = carRule.selectAll('.item-type').data(getTags(), function (d) {
                return d.id;
            });
            var cbEnter = cbList.enter().append('div').attr('class', 'item-type');
            cbEnter.append('input').attr('type', 'checkbox').attr('class', 'car-value');
            cbEnter.append('label').attr('class', 'car-name').style("position", "relative").style("margin-left", "-54px");

            //Update
            cbEnter.select('input.car-value')
                .property('checked', function (d) {
                    if (isAttrTask) {
                        var defaultIds = copyConfig['attrtask'].defaultIds;
                        if (copyConfig['attrtask'].defaultIds) {
                            for (var i = 0; i < defaultIds.length; i++) {
                                if (defaultIds[i] == d.id) {
                            	    //执行主要选择
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                    return true;
                })
                .on('change', tagChange)
                .attr('data-value', function (d) {
                    return d.data_value;
                })
                .property('value', function (d) {
                    return d.id;
                });

            cbEnter.select('label.car-name').html(function (d) {
                return d.name;
            });

            //bottom
            var bottom = items.append('div').attr('class', 'clone-button-content').style("float", "right");

            if (isAttrTask) {
                bottom.append('input').attr('type', 'button').attr('class', 'attrButton').on('click', function () {
                    var selectAllIds = copyConfig['attrtask'].selectAllIds;
                    d3.selectAll('.cloneTagsDiv .rule-list-info .item-type .car-value').property('checked', function (d) {
                        var res = false;
                        selectAllIds.forEach(function (id) {
                            if (d.id == id) {
                                res = true;
                                return;
                            }
                        })
                        return res;
                    });
                }).property('value', '主要');
                bottom[0][0].append(' ');
                bottom.append('input').attr('type', 'button').attr('class', 'attrButton').on('click', function () {
                    var selectAllIds = copyConfig['attrtask'].displayedIds;
                    d3.selectAll('.cloneTagsDiv .rule-list-info .item-type .car-value').property('checked', function (d) {
                        var res = false;
                        selectAllIds.forEach(function (id) {
                            if (d.id == id) {
                                res = true;
                                return;
                            }
                        })
                        return res;
                    });
                }).property('value', '全选');
                bottom[0][0].append(' ');
                bottom.append('input').attr('type', 'button').attr('class', 'attrButton').on('click', function () {
                    // roadrule与全选和取消全选无关
                    d3.selectAll('.cloneTagsDiv .rule-list-info .item-type .car-value')[0].forEach(item => {
                        if (item.value !== 'roadrule') {
                            d3.select(item).property('checked', false);
                        }
                    })
                }).property('value', '取消全选');
				bottom[0][0].append(' ');
                bottom.append('input').attr('type', 'button').attr('class', 'attrButton').on('click', btnEditRule).property('value', '确定');
                bottom[0][0].append(' ');
                bottom.append('input').attr('type', 'button').attr('class', 'attrButton').on('click', btnClose).property('value', '取消');
            }
            else {
                bottom.append('input').attr('type', 'button').attr('class', 'clone-ok').on('click', btnEditRule).property('value', '确定');
                bottom[0][0].append(' ');
                bottom.append('input').attr('type', 'button').attr('class', 'clone-cancel').on('click', btnClose).property('value', '取消');
            }
        }

        function tagChange(d) {
            if (isAttrTask) {
                var ruleChange = copyConfig['attrtask'].ruleChange;
            }
            var tags = _.without(_.map(getTags(), function (item) {
                    return item.id;
                }), 31),
                inputs = d3.selectAll('input.car-value'), selectedIds = [];
            //单独处理roadrule规则，roadrule选项和其他选项互斥
            if (d.id === 'roadrule' && this.checked) {
                inputs.filter(item => {
                    return item.id !== 'roadrule';
                }).property('checked', false);
            }
            else if ( d.id !== 'roadrule' && this.checked ) {

                inputs.filter(item => {
                    return item.id === 'roadrule';
                }).property('checked', false);

                //modify by yangbin 修复再次勾选全选，选不中的问题 20161028
                if ( d.id == 31 ){
                    inputs.filter(item => {
                        return item.id !== 'roadrule';
                    }).property('checked', true);
                }
            }
            else if (d.id === 31) {
                inputs.filter(function (item) {
                    return item.id !== d.id;
                }).property('checked', this.checked);
            }
            //道路属性任务要求一起联动的规则
            else if (isAttrTask && ruleChange[d.id]) {
                var res = this.checked;
                inputs.property('checked', function (item) {
                    if (ruleChange[item.id]) {
                        return res;
                    }
                })
            }
            else {
                var allTagObj = inputs.filter(function (item) {
                    return item.id === 31;
                });
                allTagObj.property('checked', false);
            }
        }

        function btnEditRule() {
            var selectedTags = {}, roadRuleValue = '';
            let selLaneObject=false;
            d3.selectAll('input.car-value').each(function (d) {
                if (this.checked && d.id === 'roadrule') {
                    roadRuleValue = d.data_value;
                }
                else if (this.checked && d.id !== 31 && d.id != 'lanepoint_lane'){
                    selectedTags[d.id] = d.data_value;
                }
                else if ( this.checked && d.id === 'lanepoint_lane' ){
                    selLaneObject = true;
                }
            });
            var actions = [], dlgPromp = false;
            let lanePointRelations = [];
            for (let i = 0, l = selectedIDs.length; i < l; i++) {
                let selectedID = selectedIDs[i];
                var graph = context.graph();
                var way = graph.entity(selectedID);
                originalTags = way.tags;
                //后台接口必须字段
                var selTags = _.clone(selectedTags);
                // selTags['datatype'] = graph.entity(selectedID).tags.datatype;
                //属性复制粘贴联动的规则请写在linkageAttribute函数内，不要扩大该函数
                if (way.modelName == iD.data.DataType.HIGHWAY) {
                    var tags = way.tags;
                    for (var key in tags) {
                        if (key.indexOf("alias_chn") == 0 && key != "alias_chn") {
                            delete  tags[key];
                        }
                    }
                    selTags = linkageAttribute(selTags);
                    if (typeof selTags[owner_ship] != 'undefined' && selTags[owner_ship] == '1' &&
                        typeof way.tags.road_class != 'undefined' && ['41000', '42000', '43000', '44000', '51000', '52000'].indexOf(way.tags.road_class) >= 0) {
                        dlgPromp = true;
                    }
                }
                var annotation = t('operations.clone_tags.annotation.road');
                if (way.modelName == iD.data.DataType.ROADFURNITURE) {
                    annotation = t('operations.clone_furniture.annotation.road');
                }
                if ( way.modelName === iD.data.DataType.LANEPOINT && selLaneObject ){
                    annotation = t('operations.clone_lanePoint.annotation.lanePoint');
                    let copyLanePointID = localStorage.getItem('tags_copy_lanePoint'),
                        lanePointEntity = context.entity(copyLanePointID);
                    let copyLane = context.graph().parentRelations(lanePointEntity, iD.data.DataType.LANE);
                    if ( copyLane ){
                        //删除原有的，新增对象
                        let srcLane = context.graph().parentRelations(way, iD.data.DataType.LANE);
                        for ( let k = 0; k < srcLane.length; ++k ){
                            lanePointRelations.push(
                                iD.actions.DeleteRelation(srcLane[k].id));
                        }
                        if ( selTags.lane_nums ){
                            for ( let k = 0; k < copyLane.length; ++k ){
                                let laneType = copyLane[k].tags.lane_type;
                                let laneNo = copyLane[k].tags.lane_no;
                                lanePointRelations.push(
                                    iD.actions.CreateLane(context,way,{},laneNo,laneType));
                            }
                        }else{
                            for (let k = 0; k < srcLane.length; ++k) {
                                let srcLaneNo = srcLane[k].tags.lane_no;
                                for (let h = 0; h < copyLane.length; ++h) {
                                    let laneType = copyLane[h].tags.lane_type;
                                    let copyLaneNo = copyLane[h].tags.lane_no;
                                    if (srcLaneNo == copyLaneNo) {
                                        lanePointRelations.push(
                                            iD.actions.CreateLane(context, way, {}, copyLaneNo, laneType));
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (Object.keys(selTags).length < 1 && !canPasteRoadRule(way,roadRuleValue)
                    && way.modelName !== iD.data.DataType.LANEPOINT ){
                    return;
                }
                actions.push({'way': way, 'note': annotation, 'tags': selTags});

                // 以下内容针对roadrule复制
                pasteRoadRule(way, roadRuleValue);
            }
            function canPasteRoadRule(way, roadRuleValue) {
                if(roadRuleValue == '' || way.modelName != iD.data.DataType.HIGHWAY) {
                    btnClose();
                    return false;
                }
                let copyWayId = localStorage.getItem('s_map_editor_copy_wayId');
                let copyWay = context.graph().entity(copyWayId);
                //如果被复制道路存在roadrule,这不允许粘贴
                if (context.graph().parentRelations(way, iD.data.DataType.ROADRULE).length != 0) {
                    btnClose();
                    DialogEx.message(MsgSrc.WEB, '被选中道路中存在货车禁止信息，不能进行粘贴！');
                    return false;
                }
                //复制和粘贴的道路方向DIRECTION必须为1、2、3，否则粘贴无效
                if (way.tags.direction == '4' || copyWay.tags.direction == '4') {
                    btnClose();
                    DialogEx.message(MsgSrc.WEB, "复制或粘贴的道路中存在双向禁行的道路，不能进行粘贴！");
                    return false;
                }
                return true;
            }

            //粘贴roadrule
            function pasteRoadRule(way, roadRuleValue) {
                if(way.modelName != iD.data.DataType.HIGHWAY || roadRuleValue == '') return;
                let copyWayId = localStorage.getItem('s_map_editor_copy_wayId');
                let copyWay = context.graph().entity(copyWayId);

                let newRoadRuleArr = JSON.parse(roadRuleValue);
                newRoadRuleArr.map(rule => {
                    let roadRuleMember = [{'id': way.id, 'role': "road", 'type': "Highway"}];
                    //可以粘贴的属性
                    let validKeys = ['rule_type', 'rule_flag', 'vehicle', 'rule_time', 'holiday', 'season',
                        'truck_load', 'truck_axle', 'truck_wt', 'yellow', 'datatype'];
                    let pasteTags = {};
                    validKeys.map(item => {
                        pasteTags[item] = rule.tags[item];
                    })
                    //双向往单向粘贴时，DIR赋值原则为DIRECTION=2，DIR赋值为1；DIRECTION=3，DIR赋值为2
                    //单向通行道路上的货车禁止信息粘贴到双向通行时，DIR需复制为0
                    //双向通行往双向通行道路上DIR继承原始值直接粘贴即可
                    // 单向通行往单向通行粘贴时也需要判断粘贴道路的DIRECTION，赋值原则为DIRECTION=2，DIR赋值为1；DIRECTION=3，DIR赋值为2
                    if (copyWay.tags.direction == '1' && way.tags.direction == '2') {
                        pasteTags['dir'] = '1';
                    }
                    else if (copyWay.tags.direction == '1' && way.tags.direction == '3') {
                        pasteTags['dir'] = '2';
                    }
                    else if (['2', '3'].indexOf(copyWay.tags.direction) != -1 && way.tags.direction == '1') {
                        pasteTags['dir'] = '0';
                    }
                    else if(copyWay.tags.direction == '1' && way.tags.direction == '1'){
                        pasteTags['dir'] = rule.tags['dir'];
                    }
                    else if(['2','3'].indexOf(copyWay.tags.direction)!=-1 && ['2','3'].indexOf(way.tags.direction)!=-1){
                        switch (way.tags.direction){
                            case '2':
                                pasteTags['dir'] = '1';
                                break;
                            case '3':
                                pasteTags['dir'] = '2';
                                break;
                        }
                    }
                    let layer = iD.Layers.getLayer(rule.layerId);
                    context.replace(iD.actions.AddEntity(iD.Relation({
                        identifier:layer.identifier,
                        tags: pasteTags,
                        members: roadRuleMember,
                        layerId: rule.layerId,
                    })));
                })
            }

            //默认执行
            function doAction() {
                var item = actions[0] ;
                item.way = item.way.mergeTags(item.tags);
                context.perform(iD.actions.AddEntity(item.way), item.note);
                for (var i=1; i<actions.length; i++){
                    item = actions[i] ;
                    if (item.way) {
                        item.way = item.way.mergeTags(item.tags);
                        context.replace(iD.actions.AddEntity(item.way), item.note);
                    }
                }
                if ( lanePointRelations.length > 0 ){
                    context.perform.apply(this,lanePointRelations);
                }
            }

            //确定执行(删除owner_ship)
            function okAction() {
                var item = actions[0] ;
                delete item.tags[owner_ship] ;
                item.way = item.way.mergeTags(item.tags);
                context.perform(iD.actions.AddEntity(item.way), item.note);
                for (var i=1; i<actions.length; i++){
                    item = actions[i] ;
                    if (item.way) {
                        delete item.tags[owner_ship] ;
                        item.way = item.way.mergeTags(item.tags);
                        context.replace(iD.actions.AddEntity(item.way), item.note);
                    }
                }
            }

            if (actions.length>0 || lanePointRelations.length > 0) {
                if (dlgPromp) {
                    DialogEx.confirm(MsgSrc.WEB, '道路所有为内部道路，与当前所选道路等级冲突（41、42、43、44、51、52），是否取消道路所有勾选项并粘贴其他属性?', okAction, doAction);
                }
                else {
                    doAction() ;
                }
            }

            btnClose();
			context.enter(iD.modes.Browse(context));
        }

        function btnClose() {
            modal.close();
           // editor.context.localStorageClean();
        }

        new tipUtil.dragDrop({
            target: document.getElementById('cloneTags'),
            bridge: document.getElementById('cloneAttr-title-table')
        });

    };

    tagsClone.selectedIDs = function (_) {
        if (!arguments.length) return selectedIDs;
        selectedIDs = _;
        return tagsClone;
    };

    return d3.rebind(tagsClone, event, 'on');
}