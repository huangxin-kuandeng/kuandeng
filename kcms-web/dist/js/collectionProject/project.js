
var collectionProject = {
    //
    projArr: [], // 项目列表 proj暂时不用 task会用
    projJson: {
        projectId: null,
        projectName: '',
        status: null,
        mileage: null,
        mileageDoneong: null,
        numTask: null,
        taskDone: null,
        startDate: '',
        targetDate: '',
        endDate: '',
        projectBox: '',
        surveyArea: '',
        creatorName: '',
        createTime: '',
    },
    projLayers: {},
    polygonArr: {},
    polylineArr: {},
    zh_match: {
        type: {
            0: { name: '地图量产' },
            1: { name: '资产病害' },
            2: { name: '农路病害' }
        },
        status: {
            0:
                { name: '未采集', color: '#FF015A',cls: 'status_0' },
            1:
                { name: '已完成', color: '#55FFAD',cls: 'status_1'  },
            2:
                { name: '未完成', color: '#FFEF00',cls: 'status_2'  }
        }, 
        process: {
            0:
                { name: '未采集', color: '#FF015A',cls: 'status_0' },
            1:
                { name: '已完成', color: '#55FFAD',cls: 'status_1'  },
            2:
                { name: '未完成', color: '#FFEF00',cls: 'status_2'  }
        }

    },
    leftTabModal_cof: {
        grp_1: [
            { name: '项目name', code: 'name' },
            { name: '项目类型', code: 'type' },
            { name: '采集状态', code: 'status' },
            { name: '进度评估', code: 'process' }],
        grp_2: [
            { name: '任务数量', code: 'taskCount_total' },
            { name: '完成数量', code: 'taskCount_done' },
            { name: '计划里程', code: '-' },
            { name: '已采里程', code: '-' }],
        grp_3: [
            { name: '开始日期', code: 'targetStartTimeStr' },
            { name: '计划完成', code: 'targetEndTimeStr' },
            { name: '创建用户', code: 'createBy' },
            { name: '创建时间', code: 'createTimeStr' },
        ]
    },
 
    chartPara : {
        id: 'process_chart',
        option: {
            series: [{
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                center: ['50%', '50%'],
                radius: '80%',
                clockwise: false,
                pointer: {
                    show: false
                },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0.75,
                            y: 0.25,
                            x2: 0.25,
                            y2: 0.75,
                            colorStops: [{
                                offset: 0, color: '#fd2151' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#525bf2' // 100% 处的颜色
                            }],
                        }
                    }
                },
                axisLine: {

                    lineStyle: {
                        width: 10
                    }
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                data: [{
                    value: 0.0,
                    name: '未开始',
                    title: {
                        offsetCenter: ['0%', '40%']
                    },
                    detail: {
                        offsetCenter: ['0%', '-10%']
                    }
                },

                ],
                title: {
                    fontSize: 14,
                    color: '#525bf2',
                },
                detail: {
                    formatter: '{main|{value}}' + '{sub|%}',
                    rich: {
                        main: {
                            fontSize: 40,
                            color: '#525bf2',
                            fontWeight: '400',
                        },
                        sub: {
                            color: '#525bf2',
                            fontSize: 20,
                            verticalAlign: 'top'
                        }
                    }
                },
            }]
        }

    },
    legend:[
        { name: '未采集', code: '0',color:'#FF015A' },
        { name: '已完成', code: '1',color:'#55FFAD' },
        { name: '未完成', code: '2',color:'#FFEF00' },
    ],
    //项目包含的内容
    // projectId 项目ID long 系统自动赋值唯一ID
    // projectName 项目名称 varchar 来自采集项目创建    
    // status 采集状态 long 1- 未下发 2- 已下发 3- 采集中 4- 已完成 5- 已取消 根据采集任务信息和轨迹信息生成    
    // mileage 计划总里程 long 单位为公里    
    // mileageDone 已采集里程 long 单位为公里    
    // numTask 采集任务总数 long    
    // taskDone 已采集任务数 long    
    // startDate 采集开始日期 varchar    
    // targetDate 计划完成日期 varchar    
    // endDate 实际完成日期 varchar    
    // projectBox 项目坐标范围 varchar 项目区域bbox    
    // surveyArea 采集区域 varchar 一个或多个多边形    
    // creatorName 创建者用户名 varchar    
    // createTime

    init: function () {
        console.log(this);
        collectionProject.widgetDiv();
        collectionProject.mainTableDiv();
        $.mapType = collectionProject;

    },
    // I
    widgetDiv: function (cof) {
        cof = [
           
            { id: "key", name: "查找项", show: true, required: true, type: "select", data: [
                {
                    "name": "根据项目ID查找",
                    "value": "id"
                },
                {
                    "name": "根据项目名称查找",
                    "value": "name",

                },
                {
                    "name": "根据创建人查找",
                    "value": "createBy",

                }
            ] },
            { id: "value", name: "value", show: true, required: true, defaultValue: '' },
            { id: "type", name: "项目类型", show: true, required: false, type: "select", data: [
                {
                    "name": "地图量产",
                    "value": "0"
                },
                {
                    "name": "资产病害",
                    "value": "1",

                },
                {
                    "name": "农路病害",
                    "value": "2",

                }
            ] },
            {
                id: "status", name: "采集状态", show: true, required: false, type: "select", data: [
                    {
                        "name": "未采集",
                        "value": "0"
                    },
                    {
                        "name": "已完成",
                        "value": "1",

                    },
                    {
                        "name": "未完成",
                        "value": "2",

                    }
                ]
            }];
        /**条件筛选定制 */
        let _html = `<p class='page_title'><span></span>采集项目管理</p>`
        _html += this.forMat_Widget(cof).join('');
        _html += `<button class="queryProj widget_cube_btn" ><img src="../bower_components/sketch-icon/search.svg"></button>
        <button class="addProj widget_cube_btn" ><img src="../bower_components/sketch-icon/plus_circle.svg"></button>`;
        $('.primaryHeader').html(_html);
        this.evtListen('widgetDiv')

    },
    //主要表格栏
    mainTableDiv: function (conditions = {}) {
        let _html = `<table id="project_task_1" class="table table-bordered table-hover">						            
    </table>`;

        $('.primaryBody').html(_html);

        let restext = '';
        let zh_match = collectionProject.zh_match;
        var table = $("#project_task_1").DataTable({
            'language': window.cn_lang,
            'searching': false,								//原生搜索
            'paging': true,
            'pagingType': 'simple_numbers',
            'lengthChange': false,
            'ordering': false,
            'info': true,
            'autoWidth': true,
            'scrollY': 750,
            'scrollCollapse': true,
            "lengthMenu": [10],
            'aaSorting': false,
            'bRetrieve': true,									//如果表格已经被初始化，该参数会直接返回已经被创建的对象
            'serverSide': true,  								//启用服务器端分页
            ajax: function (data, callback, settings) {
                var param1 = {};
                param1.limit = data.length;								//页面显示记录条数，在页面显示每页显示多少项的时候
                param1.start = data.start;						//开始的记录序号
                param1.page = (data.start / data.length) + 1;		//当前页码

                var _url = "http://192.168.7.22:23370/kcms/" + "collection/project/queryPage";
                var _json = {
                    "page": {
                     "pageSize": 10,
                     "pageNo": param1.page || 1
                    },
                    "ops": []
                   };
                   //条件查询参数 
                  Object.entries(conditions).forEach(([k,v]) => {
                      let temp = {
                        "k": k,
                        "v": v,
                        "type": 'string',//(k=='type'?'int':'string'),
                        "op": "eq"
                       }
                      _json.ops.push(temp);
                  });

                //获取当前的所有任务(由于接口为字符串排序,所以暂时由前端进行排序分页)
                let params = {
                    url: _url,
                    data: _json
                }
                $.postAjax(params, function (data) {
                    if (data.code != '0') {
                        $.errorView(data.message, false);
                        return;
                    }
                    var returnData1 = {};
                    returnData1.recordsTotal = data.result.page.count;				//返回数据全部记录
                    returnData1.recordsFiltered = data.result.page.count;				//后台不实现过滤功能，每次查询均视作全部结果
                    returnData1.data = data.result.data;							//返回的数据列表
                    callback(returnData1);
                    collectionProject.projArr = returnData1.data || [];
                })
            },
            columns: [
                {
                "data": "id" || "",
                "class": "id",
                "render": function (data, type, row, meta) {
                    let res = restext;
                    let k = 'id';
                    let pro = row.properties || {};
                    res = row[k] || pro[k] || '';
                    let div = `<span class='${(zh_match[k] && zh_match[k][res]&& zh_match[k][res].cls) || '' }' title='${res}'>${(zh_match[k]&& zh_match[k][res] && zh_match[k][res].name) || res}</span>`
                    return div;
                },
                "title": "项目ID"
            },
                {
					"data": "id" || "",
					"class": "type",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'type';
                        let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span class='${(zh_match[k] && zh_match[k][res]&& zh_match[k][res].cls) || '' }' title='${res}'>${(zh_match[k]&& zh_match[k][res] && zh_match[k][res].name) || res}</span>`
						return div;
					},
					"title": "项目类型"
				},
                {
					"data": "id" || "",
					"class": "name",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'name';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "项目名称"
				},
                {
					"data": "id" || "",
					"class": "status",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'status';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span class='${(zh_match[k]&& zh_match[k][res] && zh_match[k][res].cls) || '' }' title='${res}'>${(zh_match[k] && zh_match[k][res]&& zh_match[k][res].name) || res}</span>`
						return div;
					},
					"title": "采集状态"
				},
                {
					"data": "id" || "",
					"class": "status",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'status';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "采集任务数"
				},
                {
					"data": "id" || "",
					"class": "status",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'status';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "采集完成度"
				},
                {
					"data": "id" || "",
					"class": "taskFrameIds",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'taskFrameIds';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "计划里程数"
				},
                {
					"data": "id" || "",
					"class": "targetStartTime",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'targetStartTimeStr';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "计划开始日期"
				},
                {
					"data": "id" || "",
					"class": "targetEndTime",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'targetEndTimeStr';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "计划完成日期"
				},
                {
					"data": "id" || "",
					"class": "createBy",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'createBy';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "创建人"
				},
                {
					"data": "id" || "",
					"class": "additionalProp1",
					"render": function (data, type, row, meta) {
						let res = restext;
						let k = 'additionalProp1';
						let pro = row.properties || {};
                        res = row[k] || pro[k] || '';
						let div = `<span title='${res}'>${res}</span>`
						return div;
					},
					"title": "创建人"
				},

                //---操作按钮----
                {
                    "title": "操作 ",
                    "class": "operation",
                    "render": function (data, type, row) {//taskFrameIds_unique
                        let _id = row.id || 'unknown';
                        let _display = (_id ? '' : 'hidden');
                        let div = `
							<a href='#' class="show_detail sketch_icon" name='${_id}' ${_display}></a>
                            <!--<a href='#' class="edit sketch_icon" disabled name='${_id}' ${_display}></a>-->
                            <a href='#' class="delete sketch_icon" style='width:16px;' name='${_id}' ${_display}></a>
						`;
                        return div;
                    }
                }
            ]
        });
        this.evtListen('mainTableDiv')


    },
    //新增内容   
    newItemDiv: function (_projData = {}) {
        // 变量预设
        let _projJson = {
            projName: {
                region_tag: '',
                yr_tag: '',
                gene_tag: ''
            },
            projArea_2: '',
            type: '0',
            remark: ''
        };
        Object.entries(collectionProject.projJson).forEach(([k, v]) => {
            _projJson[k] = _projData[k] || v;
        });
        // 模板参数
        let domJson = {
            type: [
                { code: '0', name: '地图量产' },
                { code: '1', name: '资产病害' },
                { code: '2', name: '农路病害' }
            ],
            projName: [
                {
                    code: 'yr_tag', name: '年份',
                    data: [
                        { code: '21', name: '21' },
                        { code: '22', name: '22' },
                        { code: '23', name: '23' },
                        { code: '24', name: '24' },
                        { code: '25', name: '25' }
                    ]
                },
                {
                    code: 'gene_tag', name: '批次',
                    data: [
                        { code: 'G1', name: 'G1' },
                        { code: 'G2', name: 'G2' },
                        { code: 'G3', name: 'G3' },
                        { code: 'G4', name: 'G4' },
                        { code: 'G5', name: 'G5' },
                        { code: 'S1', name: 'S1' }
                    ]

                }
            ],
            projArea_2: [
                { code: '0', name: '全选' },
                { code: '1', name: '出入口采集' },
                { code: '2', name: '夜间采集' }
            ]
        };
        var formBody = `            
                <div class="createForms">
                    <div class="col-md-12">
                        <div class="dialog-header">新建项目</div>
                    </div>
                    <div class="col-md-12">
                        <div class="dialog-header">采集类型</div>
                        ${domJson.type.map(el => {
            let _active = (el.code === _projJson.type ? 'active' : '');
            return `<button class="dialog-btn grpBtn ${_active} type" name='${el.code}'>${el.name}</button>`
        }).join('')}
                       
                    </div> 
                    <div class="col-md-12 cust">
                    <div class="dialog-header">项目名称</div><input type="text" class="widget_ipt_sub_md projName" placeholder="自定义项目名称">
                    <button class="dialog-btn projNameSwitch custBtn" style="width: 50px; vertical-align: middle;">自定义</button>
                    </div>
                    <div class="col-md-12 stdt">
                        <div class="dialog-header">项目名称</div><input type="text" class="widget_ipt_sub_xs region_tag" placeholder="行政区划" readonly="">
                        ${domJson.projName.map(el => {
            return `<select title='${el.name}'  class="widget_ipt_sub_xs ${el.code}" name='${el.code}'>${el.data.map(ell => {
                let _select = (ell.code === _projJson.projName[el.code] ? 'selected' : '');
                return `<option ${_select} class="${ell.code}" name='${ell.code}'>${ell.name}</option>`
            }).join('')}</select>`
        }).join('')}
                        <button class="dialog-btn primaryBtn projNameSwitch" style="width: 50px; vertical-align: middle;">自定义</button>
                    </div>
                    <div class="col-md-12" style='margin-bottom:20px;'>
                        <div class="dialog-header">项目备注</div>
                        <textarea class="dialog-text remark" >${_projJson.remark}</textarea>
                    </div>
                    <div class="col-md-12">
                    <div class="col-md-12 sub-col">
                        <div class="dialog-header">采集区域</div>
                        <input type="text" class="widget_ipt_sub_xs surveyArea"  data-num='0' placeholder="行政区划" readonly="">
                        <button class="dialog-btn primaryBtn surveyAreaDraw"  data-num='0'  style="vertical-align: middle;">绘制区域</button>
                            <button class="addRect widget_cube_btn_sub_xs" title='新增区域' data-num='0' style="background: #5E66F8;color:#fff;vertical-align: middle;">
                            <img class='sketch-icon'  src="../bower_components/sketch-icon/plus_circle.svg">
                            </button>
                    </div>
                    </div>
                    <div class="col-md-12 projArea_2">
                        <div class="dialog-header"></div>
                        ${domJson.projArea_2.map(el => {
            let _checked = (el.code === _projJson.projArea_2 ? 'checked' : '');
            return ` <input ${_checked} class="${el.code}" type="checkbox"><p class="dialog-ckbox" name='${el.code}'>${el.name}</p>`
        }).join('')}
                    </div>
                    <div class="col-md-12" style="text-align: center; ">
                        <button type="button" class="btn btn-success-new btnConfirm dialog-footer-btn">提交</button>
                        <button type="button" class="btn btn-cancel-new btnCancel primaryBtn dialog-footer-btn" >取消</button>
                    </div>
                </div>
              <div id="leafletMap_new" class="modal-body">
              </div>
        `;
        let _head = $.isEmptyObject(_projData) ? '创建采集项目' : '编辑采集项目';
        let mapCof = {
            leafletMap: 'leafletMap_new',
            infoOpen: 'infoOpen_new',
            _callback: collectionProject.afterNewItem,
            type: _head,
            projectId: _projData.projectId || '',
            surveyArea: _projData.surveyArea || {}
        };

        $.modalCreate_new({
            domname: '.testmodal',
            html: formBody,
            id: 'bigModal',
            head: _head,
            _fn: [{
                fn: collectionProject.mapInit,
                param: mapCof,
            }],
        }, function () {//submit
            collectionProject.submitProj();
        })
    },
    /**提交采集项目 */
    submitProj: function(){
        let _type = $('.createForms .type.active').attr('name') || '';
        let _name = '',_nameArr = [];
        let nametype = ($('.createForms .stdt').css('display')=='none'? 'cust': 'stdt');
        $('.createForms .'+nametype+' input,.createForms .'+nametype+' select').each(function(){_nameArr.push( $(this).val())});
        _name = _nameArr.join('');
        let  _adcodes = [];
        $('.createForms .surveyArea').each(function(){let ad =$(this).attr('name'); if(ad){_adcodes.push($(this).attr('name'))}});
        let _polygons =  Object.entries(collectionProject.projLayers).map(([k,v])=>{return v.range||''}) || [];
        let _remark =  $('.createForms .remark').val() || '';
        let _projArea_2 = $('.createForms .projArea_2 input[type="checkbox"]:checked').attr('class') || '';

        let _json = {
            "name": _name,    
            "type": parseInt(_type),    
            "createBy": currentUser.username || 'unknown',    
            "targetStartTime":$.timeData({time:new Date(),type:'1'}), 
             "targetEndTime":$.timeData({time:new Date(),type:'1'}),   
             "adcodes": _adcodes,    
             "polygons":_polygons,    
             "remarks": _remark
        };
        let params = {
            url: "http://192.168.7.22:23370/kcms/" + 'collection/project/create',
            data: _json
        }
        $.postAjax(params, function (data) {
            if (data.code != '0') {
                $.errorView(data.message, false);
                return;
            }
            collectionProject.mainTableDiv();
        })
    },
    /**新增项目弹窗的监听事件 */
    afterNewItem: function (param) {
        //格式化
        collectionProject.polygonArr = {};
        collectionProject.projLayers = {};
        collectionProject.drawNum = '';
        //绘制区域

        if (param.type == '编辑采集项目' && param.projectId && param.surveyArea) {
            let _ranges = param.surveyArea.range || [];

            collectionProject.drawPolygon({ ranges: _ranges, mapName: param.leafletMap }, true);
        }
        //项目名称-选择城市行政区划
        $('.region_tag').click(function () {
            let obj = $(this);
            var rect = obj[0].getBoundingClientRect();
            citypicker.show({
                top: rect.top + rect.height,
                left: rect.left
            }, function (cityname, city) {
                var adcode = city.adcode;
                obj.val(cityname);
                obj[0].name = adcode;
                if (!city) return;

                var _center = [city.loc[1], city.loc[0]];
                leafletMap_new.setView(_center);
            })
        })
        $('.createForms').on('click', '.surveyArea', function () {
            let obj = $(this);
            var rect = obj[0].getBoundingClientRect();
            citypicker.show({
                top: rect.top + rect.height,
                left: rect.left
            }, function (cityname, city) {
                var adcode = city.adcode;
                obj.val(cityname);
                obj[0].name = adcode;
                if (!city) return;
                var _center = [city.loc[1], city.loc[0]];
                leafletMap_new.setView(_center);
            })
        })
        //自定义名称
        $('button.projNameSwitch').on('click', function () {
            let isCust = $('.cust').css('display');
            isStdt = $('.stdt').css('display')
            $('.stdt').css('display', isCust);
            $('.cust').css('display', isStdt);
        }),
            //新增区域
            $('button.addRect').on('click', function () {
                let pardom = $(this).parent().parent();
                collectionProject.addOneArea(pardom)
            })
        //删除区域
        $('.testmodal .createForms').on('click', 'button.delRect', function () {
            let pardom_1 = $(this).parent();
            let pardom_2 = pardom_1.parent();
            let _height = parseInt(pardom_2.css('height') || '60px');
            pardom_2.css('height', _height - 60);
            pardom_1.remove();
            //去掉polygon layer
            let _num = $(this).attr('data-num');
            let _polyId = collectionProject.polygonArr['poly' + _num];
            $.mapRemove_new(_polyId, 'leafletMap_new');
            delete (collectionProject.polygonArr['poly' + _num]);
            delete (collectionProject.projLayers[_polyId]);
        })
        //绘制区域
        $('.createForms').on('click', '.surveyAreaDraw', function () {
            let adcode = $(this).prev().val();
            if (!adcode) {
                $.spopView({
                    text: '请先选择行政区划'
                });
                return;
            }
            let _num = $(this).attr('data-num');
            if (('poly' + _num) in collectionProject.polygonArr && !confirm('是否重绘区域？')) {
                return;
            } else {
                let _polyId = collectionProject.polygonArr['poly' + _num];
                $.mapRemove_new(_polyId, 'leafletMap_new');
                delete (collectionProject.polygonArr['poly' + _num]);
                delete (collectionProject.projLayers[_polyId]);
            }
            collectionProject.drawNum = _num;
            leafletMap_new.editTools.startPolygon();

        })
        // 悬浮高亮子区域
        $('.createForms').on("mouseenter mouseleave", ".surveyAreaDraw", function (event) {
            let _num = $(this).attr('data-num');
            let _polyId = collectionProject.polygonArr['poly' + _num];
            if (_polyId && event.type == "mouseenter") {
                leafletMap_new._layers[_polyId].setStyle({ color: '#00bb00' });
            } else if (_polyId && event.type == "mouseleave") {
                leafletMap_new._layers[_polyId].setStyle({ color: '#3388ff' });
            };
        });

        //采集类型选择 grp btn
        $('.testmodal .createForms button.dialog-btn.grpBtn').on('click', function () {
            $('.testmodal button.dialog-btn.grpBtn').each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
        })
    },

    //详情窗口-项目 左一列表隐藏
    itemInfoDiv: function (projectId) {
        let res = collectionProject.projArr.filter(el =>{return projectId == el.id})[0] || {};

        let data = collectionProject.leftTabModal_cof;
        // 进度评估 缺失
        let _legend =  collectionProject.legend;
        let zh_match = collectionProject.zh_match;
        var formBody = `       
        <div class="map_legend">
            ${_legend.map(el=>{return `<span class='status_${el.code}'  style='background:${el.color || '#3388ff'};'></span><span class='plain'>${el.name}</span>`}).join('')}
        </div>
        <div class="leftTab">
        <div class="leftTab_col2_row1">
        <div class="vital_charts" style='text-align:center;'>
        <div id="process_chart" style='height:200px;width:250px;'></div>
        </div>      
        </div>
        <div class="leftTab_col2_row2">
        ${Object.keys(data).map(subdata => {
            return data[subdata].map(el => {
                let _cls = (el.code == 'status' &&zh_match.status[res[el.code]]? zh_match.status[res[el.code]].cls : '');
                let _cls_proc = (el.code == 'process'&&zh_match.process[res[el.code]] ? zh_match.process[res[el.code]].cls : '');
                return `<div class='subTable ${el.code}'>
                  <div class="subheader">${el.name}</div>
                  <div class="subbody ${_cls}  ${_cls_proc}">${(zh_match[el.code] && zh_match[el.code][res[el.code]]&&zh_match[el.code][res[el.code]].name) || res[el.code] || ''}</div>
                  </div>`}).join('')
        }).join('<br>')}
          </div>
        </div>
        <div id="leafletMap_info" class="modal-body">           
        </div>
   `;

      
        let _surveyArea =  $.geoPolygon_new(res.polygons);
   
        let mapCof = {
            leafletMap: 'leafletMap_info',
            infoOpen: 'infoOpen_info',
            _callback: collectionProject.afterItemInfo,
            projectId: res.id || '',
            surveyArea: _surveyArea || {}
        };
        let chartPara = {};
        Object.assign(chartPara,collectionProject.chartPara);
        chartPara.option.series[0].data[0].name = (zh_match.status[res.status] && zh_match.status[res.status].name) || res.status;
        chartPara.option.series[0].data[0].value = res.process || '0.0';
        function setChart(param) {
            let proces_chart = echarts.init(document.getElementById(param.id));
            proces_chart.clear();
            proces_chart.setOption(param.option, true);
            proces_chart.resize();
        }

        $.modalCreate_new({
            domname: '.detailmodal',
            html: formBody,
            id: 'bigModal',
            head: '查看项目详情',
            _fn: [{
                fn: setChart,
                param: chartPara,
            },
            {
                fn: collectionProject.mapInit,
                param: mapCof,
            }],
        }, function () { })
    },
    /** */
    afterItemInfo: function (param) {
        // if(param.surveyArea && param.surveyArea.range ){
        //     let _ranges = param.surveyArea;
        // collectionProject.drawPolygon({ ranges: _ranges, mapName: param.leafletMap });
        // }
        Object.entries(collectionProject.projLayers).forEach(([k,v]) => {
             $.mapRemove_new(k,'leafletMap_info');
        });    
        
        collectionProject.polylineArr = {};
        //  collectionProject.polygonArr = {};
        collectionProject.projLayers = {};
        collectionProject.Proj_drawPolyline(param.projectId);
        
    },
    Proj_drawPolyline: function(projectId){
        var _url = "http://192.168.7.22:23370/kcms/" + "collection/task/queryPage";
   
        var _json = {
            "page": {
                "totalPages": 0,
                "count": 10000,
             "pageSize": 10000,
             "pageNo":  1
            },
            "ops": [
                {
                    k: "groupProjectId",
                    v: projectId || "",
                    op: "eq"
                }
            ]
        };

        //获取当前的所有任务(由于接口为字符串排序,所以暂时由前端进行排序分页)
        let params = {
            url:  _url,
            data: _json
        };
        $.postAjax(params, function (data) {
            if (data.code != '0') {
                $.errorView(data.message, false);
                return;
            }
           
            let resArr = (data.result && data.result.data) || [];
            $('.leftTab  .subTable.taskCount_total .subbody').html(resArr.length || '');
            resArr.map(el => {
                el.mapName = 'leafletMap_info';
                collectionProject.drawPolyline(el);
            })
        });
    },
    //II 
    //widget栏格式化
    forMat_Widget: function (form) {
        var form_Html = [],
            html_child = "";
        for (var i = 0; i < form.length; i++) {
            if (form[i].show) {
                var form_data = form[i].data || null,
                    disabled = form[i].disabled || "",
                    _name = form[i].name || "",
                    _className = form[i].className || "",
                    _defaultValue = form[i].defaultValue || "",
                    _checkbox = form[i].checkbox || "",
                    _id = form[i].id || "",
                    _url = form[i].url || "",
                    _style = form[i]._style || "",
                    _fn = form[i]._fn || null,
                    _type = form[i].type || "";
                if (_type == "selectMul") {
                    html_child = `
						<div class='widget_ipt_sm'>
							<select class="form-control selectpicker ${_id}" style="float:left;padding-right:10px;" placeholder="${_name}" multiple>
								${form_data.map(f => `
									<option value="${f.value}" ${f.selected ? 'selected' : ''}>${f.name}</option>
								`).join('')}
							</select>
						</div>
					`;
                } else if (_type == 'checkbox') {
                    html_child = `
						<div class='widget_ipt_sm' style='height:30px;'>
							<input type="checkbox" class="${_id}" value=""  placeholder="${_name}" ${_checkbox ? 'checked' : ''}>
						</div>
					`;
                } else if (_type == 'ratio') {
                    html_child = `
						<div class='widget_ipt_sm ${_id}'>
							<label>${_name}：</label>
							<div class="btn-group" data-toggle="buttons" style="display:block;width:100%;float:left;">
								${form_data.map(f => `
									<label class="btn btn-primary ${f.selected || ''}" style="width:50%;">
										<input type="radio" name="${_id}" autocomplete="off"  ${f.selected ? 'checked' : ''} value="${f.value}"> ${f.name}
									</label>
								`).join('')}
							</div>
						</div>
					`;
                } else if (_type == "select") {
                    html_child = `
							<select class="form-control  widget_ipt_sm" name="${_id}" placeholder="${_name}" ${disabled}>
								<option value="">选择${_name}</option>
								${form_data.map(f => `
									<option value="${f.value}" ${f.selected || ''}>${f.name}</option>
								`).join('')}
							</select>
					`;
                } else if (_id == "adcodeValue") {
                    html_child = `
						<div class='widget_ipt_sm'>
							<label>${_name}：</label>
							<input type="text" class="form-control ${_id}" placeholder="选择行政区划" readonly="" value="">
						</div>
					`;
                } else if (_type == "dynamicSelect") {
                    html_child = `
						<div class='widget_ipt_sm'>
							<label>${_name}：</label>
							<input type="text" class="form-control dynamicSelect ${_id}" data-url="${_url}" placeholder="选择${_name}" readonly="" value="">
						</div>
					`;
                } else if (_type == 'time') {
                    html_child = `
						<div class='widget_ipt_sm'>
							<label>${_name}：</label>
							<input type="text" id="${_id}" class="form-control pull-right time" value="" readonly="">
						</div>
					`;
                } else {
                    html_child = `
							<input type="text"  class="widget_ipt_sm" name="${_id}" placeholder="${_name}" value="${_defaultValue}">					
					`;
                }
                form_Html.push(html_child);
            }
        }
        return form_Html;
    },
    //map初始化
    mapInit: function (obj) {
        // $('.testmodal').html(_html);
        $.mapLeaflet_new(obj, function () {

            $.spopView({
                text: '地图初始化完成！',
                type: true
            });
            window[obj.leafletMap].invalidateSize(true);
            obj._callback && obj._callback(obj);
        })
    },
    //删除选中项目
    deletePorj: function (_json) {
        let formBody = `<div class='title'>温馨提示</div>
        <div class='main'>确定要删除选择的项目吗？</div>`;
        let _param =
        {
            domname: '.littlemodal',//小提示框
            html: formBody,
            id: 'littleModal',
            head: '温馨提示',
            _fn: []
        }
        $.modalCreate_new(_param, function () { exctDelete(_json) });
        function exctDelete(_json) {
            let params = {
                url: '',
                data: _json
            }
            $.postAjax(params, function (data) {
                if (data.code != '0') {
                    $.errorView(data.message, false);
                    return;
                }
                collectionProject.mainTableDiv();
            })
        }

    },
    //编辑选中项目
    editProj: function (projectId) {
        let _projData = {};
        collectionProject.projArr.forEach(el => {
            if (el.projectId == projectId) {
                _projData = el;
            }
        });
        _projData = {
            projectId: '12345',
            surveyArea: {
                range: ["POLYGON((116.15432739257812 40.07374111377596,116.49627685546876 39.91375634716134,116.19552612304688 39.702679458353764,116.15432739257812 40.07374111377596))",
                    "POLYGON((116.40838623046875 39.79999565318321,116.42280578613283 39.67691858397495,116.62742614746095 39.69224916369807,116.40838623046875 39.79999565318321))"]
            }
        };
        collectionProject.newItemDiv(_projData);
    },
    //绘制polygon
    drawPolygon: function (data, readonly = false) {
        // init
        collectionProject.polygonArr = {};
        collectionProject.projLayers = {};
        //redraw
        data.ranges.forEach((el, i) => {
            //   let _range = $.leafletRange( 'POLYGON(('+el.range+'))' );
            let _range = $.leafletRange(el);
            let polygon = L.polygon(_range, { color: '#3388ff' }).addTo(window[data.mapName]);
            let leafletId = polygon._leaflet_id;
            collectionProject.polygonArr['poly' + i] = leafletId;
            collectionProject.projLayers[leafletId] = {
                'range': el
            };
            if (readonly) {
                let pardom = $('button.addRect').parent().parent();
                if (i > 0) {
                    collectionProject.addOneArea(pardom)
                }
            }

        })

    },
    //绘制polyline
    drawPolyline: function (data, readonly = false) {
        // 每个task的collectionLinks数组
        // init
    
        let zh_match = collectionProject.zh_match;

        let _color = (zh_match.status[data.status] && zh_match.status[data.status].color) || '#3388ff';
        let _collectionLinks =  data.collectionLinks || [];
        let _center = [];
        _collectionLinks.forEach(el => {
            if(_center.length==0){
                _center = el.geometry.coordinates[0];
            }
            
            let lnglat = (el.geometry && el.geometry.coordinates) || [];
            let _latlngs = lnglat.map(el => {return [el[1],el[0]]});
            let polyline = L.polyline(_latlngs, { color: _color}).addTo(window[data.mapName]).bindPopup(`<p style='color:${_color}'>${el.id}</p>`);
            let leafletId = polyline._leaflet_id;
            // let pathId = polyline.feature._path._leaflet_id,
            collectionProject.polylineArr['poly' + el.id] = leafletId;
            collectionProject.projLayers[leafletId] = el.properties||{};
        })
        window[data.mapName].setView([_center[1],_center[0]]);
    },
    //处理绘制的区域
    rectBounds: function (layers) {
        //TODO可以写闭包存变量吗
        if (layers.feature._latlngs[0].length < 3) {
            layers.feature.remove();
            $.spopView({
                text: '请绘制一个多边形'
            });
            return;
        }
        var leafletId = layers.feature._leaflet_id,
            pathId = layers.feature._path._leaflet_id,
            range = $.geoPolygon(layers.feature._latlngs[0]);
        collectionProject.projLayers[leafletId] = {
            'range': 'POLYGON((' + range + '))'
        };
        collectionProject.polygonArr['poly' + collectionProject.drawNum] = leafletId;


    },
    addOneArea: function (pardom) {

        let _height = parseInt(pardom.css('height') || '60px');
        let num = $('.surveyArea').length;
        let temp = `<div class="col-md-12 sub-col">
                        <div class="dialog-header"></div>
                        <input type="text" class="widget_ipt_sub_xs surveyArea" data-num='${num}' placeholder="行政区划" readonly="">
                        <button class="dialog-btn primaryBtn surveyAreaDraw"  data-num='${num}' style="vertical-align: middle;">绘制区域
                            </button>
                            <button class="delRect widget_cube_btn_sub_xs"  data-num='${num}' style="background: #5E66F8;color:#fff;vertical-align: middle;">
                            <img class="sketch-icon" src="../bower_components/sketch-icon/delete.svg">
                            </button>
                    </div>`;
        pardom.append(temp).css('height', _height + 60);
    },
    //I,II
    evtListen: function (type) {
        if (type === 'widgetDiv') {
            /**监听query */
            $('.primaryHeader button.queryProj').on('click', function () {
                let conditions = {};
                $('.primaryHeader select,.primaryHeader input').each(function () {
                    let k = $(this).attr('name'),
                        v = $(this).val();
                        if(v){
                            conditions[k] = v;
                        }
                    
                })
                if(conditions.value && conditions.key){
                    conditions[conditions.key] = conditions.value;
                }
                delete(conditions.key);
                delete(conditions.value);
                collectionProject.mainTableDiv(conditions);
            });
            /**监听add */
            $('.primaryHeader button.addProj').on('click', function () {
                collectionProject.newItemDiv();
            })
        } else if (type === 'mainTableDiv') {
            /**监听show_detail */
            $('#project_task_1').on('click', 'a.show_detail', function () {
                let _projectId = this.name;
                collectionProject.itemInfoDiv(_projectId);
            })
            /**监听edit */
            $('#project_task_1').on('click', 'a.edit', function () {
                collectionProject.editProj(this.name);
            })
            /**监听delete */
            $('#project_task_1').on('click', 'a.delete', function () {
                let _projectId = this.name;
                collectionProject.deletePorj(_projectId);
            })
        }

    }


}
collectionProject.init();
//TODO  通用
// var collectionCommon =  function(){ 
//     return {
//         init: function(){

//         },
//         //工具栏
//         widgetDiv: function(){
//             let _html = ``;
//         },
//         //主要表格栏
//         mainTableDiv: function(){
//             let _html = ``;
//         },
//         //新增内容   
//         newItemDiv: function(){
//             let _html = ``;
//         },
//         //详情窗口
//         itemInfoDiv: function(){
//             let _html = ``;
//         }, 
//     }
// }
//new collectionCommon();