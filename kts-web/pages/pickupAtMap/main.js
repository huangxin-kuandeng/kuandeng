
window.resultPreview = {
    projectType : '500',
	form_html: [],
	checks: {}, 
    bizCodes: {
        // '400':
        // {
        //     'code': 'training',
		// 	'list': []
        // },
        '500':
        {
            'code': 'mark_image', // 挑图项目
            'list': []
        }
    },  
    JsonForm: [
        { id: "adcodeValue", name: "行政区划", show: true, required: false },		
		{ id: "name", name: "名称", show: true, required: true, type: "input" },
		{
			id: "priority", name: "优先级", show: true, required: true, data: [{
				'name': '中',
				'value': '1',
				'selected': 'selected'
			}, {
				'name': '高',
				'value': '2'
			}]
		},
		{ id: "description", name: "描述", show: true, required: false, type: "input" },
	],
    JsonFormSpec: [
        { id: "adcodeValue", name: "行政区划", show: true, required: false },	
		{ id: "name", name: "名称", show: true, required: true, type: "input" },
		{
			id: "priority", name: "优先级", show: true, required: true, data: [{
				'name': '中',
				'value': '1',
				'selected': 'selected'
			}, {
				'name': '高',
				'value': '2'
			}]
		},		
		{ id: "description", name: "描述", show: true, required: false, type: "input" },
		
	], 
   sysColor : '#ff0000',
    /**轨迹筛选 */
    JsonTrackFilter: [              
               {
                id: "across",
                name: "轨迹是否贯穿",
                data: [
                    {
                        "name": "忽略",
                        "value": "-1"
                    },
                    {
                        "name": "不贯穿",
                        "value": "0"
                    },
                    {
                        "name": "贯穿",
                        "value": "1"
                    }
                ],
                show: true,
                required: false,
                usefor:"trackFilter",
                // tags: "trackFilter",
                type:"select",
                _style:"paramFn"
            },
            { id: "surveyDataType", name: "轨迹类型", show: true, required: false, data:[],  type:"select", _style:"paramFn"},
            { id: "surveyBatch", name: "采集批次",show: true, required: false, data:[],  type:"select", _style:"paramFn"},
            { id: "resourceDataType", name: "资料类型（相机-雷达-定位）",show: true, required: false, data:[],  type:"select", _style:"paramFn"},
            // { id: "resourceDataType", name: "轨迹类型", show: true, thisValue: 'name', required: false, usefor: "trackFilter", _fn: 'getTrackTypes' },
            // { id: "surveyBatch", name: "采集批次", show: true, required: false, usefor: "trackFilter", _fn: 'getBatchs' },
            // { id: "resourceTypes", name: "资料类型（相机-雷达-定位）", show: true, required: false, usefor: "trackFilter", _fn: 'getResourceTypes' },
    ],
    _ranges :{},
    layersArr : {},
    cityList: {					//当前已经选择的城市
		"110000": "北京"
	},
    trackCheck: {},
    openPolygon: [],
    version_list : [],
    editCustomParam : '' ,
    trackIds: [],
    checkTrackIds: {},
    trackIdBind: {},
    preTrackId: {},
    trackFilter: {
        across:[],//贯穿
        resourceDataType: [],//轨迹类型
        surveyBatch: [],//采集批次
        surveyDataType: []//资料类型
    },
    search_range: '',// 范围信息
    /**自定义功能 */
    JsonFormCustom : [
        { id: "randCount", name: "实际抽取轨迹数", show: true, required: false },		
		{ id: "custTrackids", name: "轨迹ID", show: true, required: true, type: "textarea" }
    ],
    custTrackIds: []
};

/*界面初始化执行函数*/
resultPreview.interfaceInit = function(){
    /**查询项目参数 */
    resultPreview.getProjParams('6');
	resultPreview.checks = {};
	/*查询数据*/
	$('button.searchBtn').click(function(){
		resultPreview.checks = {};
            var searchType_1 = $('.searchForm option:selected').val(),
                searchValue_1 =  $('.searchForm input').val();
                if (searchValue_1) {
                    let temp = {};temp[searchType_1] = searchValue_1;
                    resultPreview.findResultData(temp);
                } else {
                resultPreview.findResultData();
            }
		// resultPreview.findResultData();
	})
	/*批量删除任务包*/
	$('button.deleteBtn').click(function(){
		var id_arr = [];
		for(var id in resultPreview.checks){
			if( resultPreview.checks[id] ){
				id_arr.push(id)
			}
		}
		if( !id_arr.length ){
			util.errorView('未选择相关任务包信息');
			return;
		}
		var text = "批量删除任务包：" + id_arr.length + "条";
		var ids = id_arr.join(",");
		resultPreview.deletepickupAtMap( text, ids );
	})
    /*新增挑图任务*/
    $('button.insertBtn').click(function(){
        resultPreview.mapSheep();
        $('.mapmodal').css('display', 'block');
	})
        /*进行批量操作*/
        $('button.operByLotBtn').click(function(){
            $('div#operByLot .operByLot').css('display','block')
        })
	util.getSpecInfo();
    
    $.mapType = resultPreview;

    /**ABOUT批量控件 */
    let _option = {
        urlSets:{            
            'sel': '',
            'del': '',
            'cus': window.kms_v2 + 'data/web_form/info/create'
        },
        'cols':[
                {values:null,code:'id',name:'项目ID'},
                {values:null,code:'name',name:'名称'},
                {values:null,code:'stateText',name:'状态'},
            ],
        'selCallback': resultPreview.findResultData,
        'fn': {},
        'pageName':'pickupAtMapnew'
    }
    operByLot.load(_option);
}

/*查询数据*/
resultPreview.findResultData = function(param){
	let table_html = `
		<table id="pickupAtMapTable" class="table table-bordered table-hover">
			
		</table>
	`;
	$('.bodyTable').html(table_html);

    let _columns = [
        {
            "data": "id" || "",
            "title": "项目ID",
        },
        {
            "data": "name" || "",
            "title": "名称"
        },
        {
            "data": "stateText" || "",
            "title": "状态"
        },
        {
            "data": "createdAt",
            "title": "创建时间",
            "type": "time"
        },
        {
            "data": "description" || "",
            "title": "描述"
        },
        // { 
        //     "data": "id",
        //     "class": "manage",
        //       "render": function ( data, type, row,  meta ) {
        //         var btn_html = `
        //         <button class="btn btn-success" title="打开任务包效率统计">执行任务</button>           
        // `;
            
        //         return btn_html;
        //     },
        //     "title": "操作"
        // }
    ]
    /**补充tags里的项目参数 */
	resultPreview.enumSpec.map(el => {
		let col_ = {
			"data": el.key || "",
			"title": el.description || "",
			"render": function (data, type, row, meta) {
				if (!el.source) {
					let oridata = row.tags[el.key] || "";
					return oridata;
				} else {
					let _source = el.source || [];
					let data = row.tags[el.key] || "";
					let res = _source.filter(s => {
						return s.value == data
					})
					let res_ = ""
					if (res.length > 0) {
						res_ = res[0].label || "";
					}
					return res_;
				}
			},
		}
		_columns.push(col_);
	})
	var table = $("#pickupAtMapTable").DataTable({
    	'language'    : window.lang,
        'searching'   : false,
        'paging'      : true,
        'lengthChange': false,
        'ordering'    : false,
        'info'        : true,
        'autoWidth'   : false,
//      "lengthMenu"  : [10],
        "aaSorting"	  : false,
    	'processing'  : true,
    	'serverSide'  : true,
        ajax: function (data, callback, settings) {
            var param1 = {};
            param1.limit = data.length;								//页面显示记录条数，在页面显示每页显示多少项的时候
            param1.start = data.start;						//开始的记录序号
            param1.page = (data.start / data.length) + 1;		//当前页码
            var thisUrl = configURL.muses + "project/query";
            var _json = {
                "pageSize": param1.limit,
                "category": '500',
                "pageNo": param1.page,
                "includeTag": true
            }
            /**条件查询参数 */
            let enumkeys= resultPreview.enumSpec.map(el => el.key)
            let _withTags = {};
            if (param && !$.isEmptyObject(param)) {
                Object.keys(param).forEach(el => {
                    if(enumkeys.indexOf(el)== -1){
                        _json[el] = param[el];
                    } else {
                        _withTags[el]=param[el];
                    }                    
                })
            }
            _json["withTags"]= _withTags; 
            // if(laserProject.searchTypeValue){
            // 	$(".searchTypeValue").val(laserProject.searchTypeValue);
            // 	$(".searchType select").val(laserProject.searchType);
            // }
            //	使用post请求项目列表(每次只请求十条任务,然后对其进行分页)
            util.postAjax(thisUrl, _json, function (data) {
                if (data.code != "0") {
                    util.errorView(data.code + ": " + data.message);
                    return;
                }
                let datas = data.result.result || [];
                var returnData = {};
                returnData.recordsTotal = data.result.total;				//返回数据全部记录
                returnData.recordsFiltered = data.result.total;			//后台不实现过滤功能，每次查询均视作全部结果
                returnData.data = datas;
                callback(returnData);
            })
        },
        columns: _columns    
	});
   
	
	// 全选按钮
	$('#pickupAtMapTable thead').on('click', 'label.delete_check_all input', function (e) {
		
		var c_check = e.target.checked;
		var delete_checks = $('#pickupAtMapTable tbody label.delete_check input');
		for(var i=0; i<delete_checks.length; i++){
			var _id = delete_checks[i].value;
			
			delete_checks[i].checked = c_check;
			resultPreview.checks[_id] = c_check;
		}
		
	});
	// 单选按钮
	$('#pickupAtMapTable tbody').on('click', 'label.delete_check input', function (e) {
		
		var c_check = e.target.checked;
		var _id = e.target.value;
		resultPreview.checks[_id] = c_check;
		
	});
	// 任务包效率统计
	$('#pickupAtMapTable tbody').on('click', 'tr td button.efficiencyStatistics', function (e) {
		var tr = $(this).closest('tr'),
	    	row = table.row( tr ),
			data = row.data(),
			packId = data.id;
		
		var _blank = "../efficiencyStatistics/index.html?projectId=" + packId;
		window.open(_blank, "_blank");
	});
	// 指定任务包创建任务
    $('#pickupAtMapTable tbody').on('click', 'tr td button.createTask', function (e) {
		var tr = $(this).closest('tr'),
        	row = table.row( tr ),
			data = row.data();
    	resultPreview.findCraftData(data);
    });
	// 指定删除任务包
    $('#pickupAtMapTable tbody').on('click', 'tr td button.deletepickupAtMap', function (e) {
		var tr = $(this).closest('tr'),
        	row = table.row( tr ),
			data = row.data(),
			id = data.id,
			name = data.name || "",
			text = "删除任务包：" + id + "（ "+ name +" ）";
		
		resultPreview.deletepickupAtMap( text, id );
    });
	
	
}

// 删除任务包
resultPreview.deletepickupAtMap = function( text, id ){
	
	util.openTips_btn([text], function(){
		var _url = window.kms_v2 + 'task/pack/delete?packIds=' + id;
		$('#loading').fadeIn();
		util.getAjax(_url, true, function(data){
			$('#loading').fadeOut();
			if(data.code != "0"){
				util.errorView('删除任务包失败');
				return;
			}
			util.errorView('删除任务包成功', true);
			$('.testmodal .modal1').modal('hide');
			resultPreview.checks = {};
			resultPreview.findResultData();
		})
	})
}

/*查询当前markType对应的工艺列表*/
resultPreview.findCraftData = function(data){
	$('#loading').fadeIn();
	let markType = data.markType ? data.markType : '',
		packId = data.id,
		_url = window.kms_v2 + 'base/craft/querySimpleByType';
	
	if(!markType){
		util.errorView('markType不存在，自动查询所有工艺', true);
	}else{
		_url += ('?markType='+markType);
	}
	
	util.getAjax(_url, true, function(data){
		$('#loading').fadeOut();
		let selects = data.result || [],
			selects_html = `
				<select class="craftId" style="width: 100%;color: #000;height: 30px;">
					<option value="">请选择工艺</option>
		            ${selects.map(f => `
					  	<option value="${f.craftId}">${f.craftId}</option>
		            `).join('')}
				</select>
			`;
		let input_name = `<input type="text" class="form-control name" placeholder="请输入名称" value="">`,
			input_remarks = `<input type="text" class="form-control remarks" placeholder="请输入备注" value="">`,
			select_types = `
				<select class="imageType" style="width: 100%;color: #000;height: 30px;">
					<option value="">请选择图片类型</option>
				  	<option value="1">半图</option>
				  	<option value="2" selected>全图</option>
				</select>
			`;
		
		
		util.openTips_btn([input_name, selects_html, select_types, input_remarks],function(){
			let craftId = $('.modal-body .craftId').val(),
				name = $('.modal-body .name').val(),
				remarks = $('.modal-body .remarks').val(),
				imageType = $('.modal-body .imageType').val();
			if( !craftId || !name || !imageType ){
				util.errorView('请填写相关参数', false);
				return;
			}
			$('#loading').fadeIn();
			let _url = window.kms_v2 + 'task/pack/createByHisPackId?packId=' + packId + '&craftId=' + craftId + '&name=' + name + '&remarks=' + remarks + '&createBy=' + user.username + '&imageType=' + imageType;
			util.postAjax(_url, true, function(data){
				$('#loading').fadeOut();
				if(data.code != '0'){
					util.errorView(data.message);
					return;
				}
				util.errorView(data.message, true);
				$('.testmodal .modal1').modal('hide');
				resultPreview.findResultData();
			})
		}, '创建任务')
	})
	
}

//	新增项目-创建一个挑图task
resultPreview.mapSheep = function() {

let for_data = util.forMat_Data_Beta(resultPreview.JsonForm);
// let customFunc_data = util.forMat_Data_Beta(resultPreview.JsonFormCustom);



let _html = `
<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
    <div class="modal-dialog task-dialog">
        <div class="modal-content task-modal-content">
            <div class="modal-header" style="height:50px;">
                <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
                    <span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
                </button>
                <h4 class="modal-title" style="overflow: hidden;white-space: nowrap;max-width: 600px;">请绘制一个范围或输入轨迹ID</h4>
            </div>
            <div class="projectTrackSearch">
									<div class="col-md-12">
										<label>采集任务ID：</label>
										<input type="text" class="form-control taskId" placeholder="采集任务ID">
									</div>
									<div class="col-md-12">
										<label>设备名称：</label>
										<input type="text" class="form-control deviceName" placeholder="设备名称">
									</div>
									<div class="col-md-12">
										<label>开始采集时间：</label>
										<input type="text" class="form-control time startSurveyTime" placeholder="开始采集时间" readonly="">
									</div>
									<div class="col-md-12">
										<label>结束采集时间：</label>
										<input type="text" class="form-control time endSurveyTime" placeholder="结束采集时间" readonly="">
									</div>
									<div class="col-md-12">
										<button type="button" class="btn btn-success projectSearch">搜索</button>
									</div>
			</div>
            <div id="trackChange" style="overflow:inherit;width:400px;"></div>
            <div id="customParam">
            <div class="modal-header" style="height:35px;padding:5px;">
                <button type="button" class="close" title="关闭" id="btnCustomClose">
                    <span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
                </button>
                <h4 class="modal-title">自定义参数</h4>
            </div>
            <div class="modal-body" style="padding:5px;overflow-x:auto;max-height: 550px;">
            
            </div>
            <div class="body-editor">
                
                <div class="body-editor-control">
                    <button class="btn btn-warning editor-reset" style="display:none;">重置</button>
                    <button class="btn btn-success editor-save">保存</button>
                </div>
                <textarea class="form-control">文本编辑</textarea>
            </div>
        </div>
            <div class="modalPicker"></div>
            <div id="project_task"></div>
            <div class="trackPointImage"></div>
            <div class="trackResult"></div>
            <div class="custTrackIdsTab"></div>
            <div class="track_filter">
            </div>
            <div class="modal-body task-modal-body" style="padding:0px;">
                <div id="id-container" class="map-content" style="width: 100%;padding:2px;">
              
                    <div id="on-off" class="sourceModal">
                        ${for_data.map(f => `
                            ${f}
                        `).join('')}
                        <div class="col-md-12 versionList">
                        
                        </div>
                    </div>
               
                    <div class="taskDiv">
                        <div class='col-md-12'>
                            <button type="button" class="btn btn-warning processCustomParamS" >自定义环节参数</button>   
                                <button type="button" class="btn btn-success submit">
                            提交
                             </button>                      
                            <button type="button" class="btn btn-warning drawRange" >绘制范围
                            </button>     
                            <button type="button" class="btn btn-warning custTrackIds" >输入轨迹
                            </button>                      
                       
                         </div>
                    </div>
                    <div id="leaflet-map"></div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
$('.pickupmodal').html(_html)
resultPreview.processInit(resultPreview.projectType);
$('.pickupmodal .modal').modal('show');
$('.pickupmodal').css('display','block');
/**筛选事件绑定 */
           /**监听轨迹选中 1.高亮轨迹 2.修改选中状态 */
    $('.pickupmodal').on('click', '.trackResult input[type="checkbox"]', function () {
        let id = this.className || '';
        let val = this.checked;
        if (!id) {
            util.errorView('选择轨迹失败');
            return;
        }
        resultPreview.checkTrackIds[id] = val;
    })
    $('.pickupmodal').on('click', '.trackResult .resBody li span', function () {
        if (resultPreview.preTrackId.id) {
            let _polylinePre = leafletMap.editTools.featuresLayer._layers[resultPreview.preTrackId.id] || leafletMap._layers[resultPreview.preTrackId.id];
            if (_polylinePre) {
                _polylinePre.setStyle({ 'color': resultPreview.preTrackId.color });
            }
        }
        let id = this.className || '';
        if (!id) {
            util.errorView('选择轨迹失败');
            return;
        }
        let leafletID = resultPreview.trackIdBind[id];

        let _polylineOne = leafletMap.editTools.featuresLayer._layers[leafletID] || leafletMap._layers[leafletID];
        if (_polylineOne) {
            resultPreview.preTrackId['id'] = leafletID;
            resultPreview.preTrackId['color'] = resultPreview.sysColor;
            _polylineOne.setStyle({ 'color': '#fce304' });
            _polylineOne.bringToFront();
        }
    })
    /**全选或清除 取消*/
    $('.pickupmodal').on('click', '.trackResult a.allClear', function () {
        Object.keys(resultPreview.checkTrackIds).map(el => {
            resultPreview.checkTrackIds[el] = false;
        })
        $('.trackResult input[type="checkbox"]').each(function () {
            this.checked = false;
        })
    })
    $('.pickupmodal').on('click', '.trackResult a.allSelect', function () {
        Object.keys(resultPreview.checkTrackIds).map(el => {
            resultPreview.checkTrackIds[el] = true;
        })
        $('.trackResult input[type="checkbox"]').each(function () {
            this.checked = true;
        })
    })
    $('.pickupmodal').on('click', '.trackResult a.tabClose', function () {
        $('.trackResult').css('display', 'none')
        $('.pickupmodal .track_filter').css('display', 'none');
        $('.leaflet-control-trackIds').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    })
    /**打开筛选轨迹界面 */
    $('.pickupmodal').on('click', '.trackResult a.trackSelect', function () {
        let isShow = $('.pickupmodal .track_filter').css('display');
        $('.pickupmodal .track_filter').css('display', (isShow == 'none' ? 'block' : 'none'));
    })
    /**添加点击显示参数 */
    $('.pickupmodal').on('click', '.track_filter .doFilter', function () {
        resultPreview.doFilter();
    })
     /**设置随机数量 */
    $('.pickupmodal').on('click', '.track_filter .trackRand', function () {
        resultPreview.trackRand()
    })
    

// //		选择城市
            $('.adcodeValue').on('click', function () {
    //	   		window.editor.context.map().dimensions(window.editor.context.map().dimensions());
                var rect = $(".adcodeValue")[0].getBoundingClientRect();
                citypicker.show({
                    top: rect.top + rect.height,
                    left: rect.left
                }, function(cityname, city){
                    resultPreview.cityList = {};
                    let thisCity = $(".adcodeValue").val(),
                        adcode = city.adcode;
                    $(".adcodeValue").val(cityname);
                    $(".adcodeValue")[0].name = adcode;
                    //modelManage.modelList(adcode,"model_other"); // invalid
                    
                    resultPreview.retParamFn();			//参数重置
                    if(!city) return ;
                    var _center = [city.loc[1], city.loc[0]];
                    leafletMap.setView(_center);
                    
                }, {
                    name: "通用",
                    adcode: '000000',
                    spell: "tongyong"
                })
            });
    //		绘制多边形--绘制结束时将所有匹配的屠夫选中
            $('.drawRange').on('click', function () {
                 /**清除输入轨迹信息 */
                resultPreview.custTrackIds = [];

                leafletMap.editTools.startPolygon();
            });
            /**输入轨迹id*/
            $('.custTrackIds').on('click', function () {
                /**清除范围信息 */
                resultPreview.clearLayers_new();
                resultPreview.clearArea_new();
                resultPreview.search_range = '';

                let _idsStr = resultPreview.custTrackIds.join(',');
                let _html = `
                <label>输入轨迹ID</label> 
                <textarea type="text"  cols='50' rows='15'>${_idsStr}</textarea>
                <div class='col-md-12 footer'>
                <button class="btn btn-success save">保存</button>
                <button class="btn btn-warning cls">关闭</button>
                </div>
           `;
                $('.custTrackIdsTab').html(_html).css('display', 'block');
            });
            $('.pickupmodal').unbind('click').on('click', '.custTrackIdsTab .save', function () {
               let _val = $('.custTrackIdsTab textarea').val();
               resultPreview.custTrackIds = _val.split(',');
               alert('已选轨迹\n'+ resultPreview.custTrackIds.join('\n'));
            })
            $('.pickupmodal').on('click', '.custTrackIdsTab .cls', function () {
                $('.custTrackIdsTab').css('display', 'none');
             })
            /**修改日期选择器 */
            $('.projectTrackSearch .time').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                language: "zh-CN"
            });
            $('.projectTrackSearch .projectSearch').on('click', function () {
                // resultPreview.queryByWKT();
            });
    //      点击提交
            $('.submit').click(function(){
                if(!resultPreview.search_range && resultPreview.custTrackIds.length == 0){
                    util.errorView("请绘制一个范围或输入轨迹ID");
                    return;
                }
                resultPreview.submitProgram();
            })
            setTimeout(function(){
                resultPreview.createMap();				//触发增加map地图模版             
            }, 300)
}
resultPreview.resetTrackFilter = function(){
/**加载备选内容 */
        resultPreview.JsonTrackFilter.map(el => {
            if(el.id != 'across') el.data = [];
        resultPreview.trackFilter[el.id].map(ell => {
                let temp = {'name':ell,'value':ell};
                el.data.push(temp)
            })                          
        });                      
        let filter_data = util.forMat_Data_Beta(resultPreview.JsonTrackFilter);
        let _html = `${filter_data.map(t => `${t}`).join('')}<div class='col-md-12'><button type="button" class="btn btn-warning doFilter">筛选</button></div>`;
        $('.pickupmodal .track_filter').html(_html);
}
resultPreview.submitProgram = function() {
    console.log('提交')

    /**版本信息 */

    let _engineVersions = {}
    if(resultPreview.version_list.length != 0) {
        let versionCode = resultPreview.version_list[0].code || 'nocode';
        _engineVersions[versionCode] = $('.versionList option:selected').val() || ''
    } 
    if(JSON.stringify(_engineVersions) == '{}' || _engineVersions.hasOwnProperty('nocode')){
        util.errorView('请选择版本信息')
        return
    }
    /**环节参数信息 */
    let _linkParams = {};
    for (var i = 0; i < resultPreview.version_list.length; i++) {
        let code = resultPreview.version_list[i].code,
            process_tag = resultPreview.version_list[i].tags;
        _linkParams[code] = [];  //TODO :projectParams

        for (var d = 0; d < process_tag.length; d++) {
            let tag_key = process_tag[d].key,
                tag_required = process_tag[d].required,
                tag_value = $('#customParam .form-control.' + tag_key).val();
            if (!tag_value && tag_required) {
                util.errorView('自定义参数中存在必填项');
                return;
            }
            _linkParams[code].push({
                'k': tag_key,
                'v': tag_value
            })
        }
    }
    /**项目参数处理 */
    let _json ={
        "token": '',
        "bizCode": "mark_image", // '500': mark 
        "name": "",
        "rangeType": 2,
        "priority": "",
        "createdBy": user.username,
        "description": "",
        "engineVersions": _engineVersions,
        "skipLinks": [
        ],
        "payload": "",//"mark_image",
        "linkParams": _linkParams,
        "projectParams": {},
        "taskFrameId": [],
        "trackIds": [], // 
        "ranges": '' // feature POLYGON
    };
    let createMark = (resultPreview.search_range? 'range': 'custids');
    for (var i = 0; i < resultPreview.JsonForm.length; i++) {
        var _class = resultPreview.JsonForm[i].id,
            _name = resultPreview.JsonForm[i].name,
            _tags = resultPreview.JsonForm[i].tags,
            _isProParams = resultPreview.JsonForm[i].isProParams
            
            _required = resultPreview.JsonForm[i].required,
            _value = $('#on-off .' + _class).val();
            /**输入id时不校验轨迹筛选值 */
if(_class == 'trackRandom' && createMark == 'custids'){
    _required  = false;
}
        if (!_value && _required) {
            util.errorView('参数缺失：' + _name);
            return;
        }
        if (_tags) {
            _json.tags.push({
                'k': _class,
                'v': _value
            })
        } else {
            if (_isProParams) {
                _json.projectParams[_class] = _value;
            } else {
                _json[_class] = _value;
            }
        }
    }

       
  
    if(createMark == 'range'){
        if(!$.isEmptyObject(resultPreview._ranges) || _Ids.length==0){
            let _idsMax = Object.keys(resultPreview.trackIdBind).length;
            if( !_json.projectParams.trackRandom || _idsMax < _json.projectParams.trackRandom){
                util.errorView('轨迹筛选值无效')
                return
            }
            let _range = 'MULTIPOLYGON(((' + util.geoPolygon(resultPreview._ranges.feature._latlngs[0]) + ')))' || '';
            if(!_range){
                util.errorView('请绘制范围')
                return
            }    
            /**1.校验同时过滤轨迹 */
            let _checkJson = {
                "rangeType": "2",
                "range": resultPreview.search_range,
                "projectParams": _json.projectParams
            }
            let _checkUrl = configURL.haydn + 'project/' + resultPreview.bizCodes[resultPreview.projectType].code + '/data/validate'; //'/project/track/query';
            util.postAjax(_checkUrl, _checkJson, function (res) {
                if(res.code != 0){
                    util.errorView(res.code + ':' + res.message)
                    return
            }
            let _token = res.result.token;
            _json['payload'] = _token;  
            _json['range'] = _range;  
            resultPreview.createPorj(_json);        

        })
        }
    } else {
        /**轨迹信息 */
        // let _Ids = resultPreview.trackIds.filter(el => {
        //     return  resultPreview.checkTrackIds[el.id] == true;
        // });
        let _trackIds = resultPreview.custTrackIds || [];// _Ids.map(ell => ell.id) || [];
        if(_trackIds.length == 0){
        util.errorView('轨迹为空')
        return
        }
        _json['trackIds'] = _trackIds;  
        resultPreview.createPorj(_json);   

    }


}
/**2.校验成功提交创建 */
resultPreview.createPorj = function(_json){
    $("#loading").css("display", "block");
    var createUrl = configURL.haydn + "project/create";
    util.postAjax(createUrl, _json, function (data) {

        if (data.code == '0') {
            // projectInit.modalClose()
            spop({
                template: '创建成功',
                style: 'success',
                position: 'top-center',
                autoclose: 2000
            });
        } else {
            util.errorView(data.message);
        }
        resultPreview.findResultData();
    })
    $("#loading").css("display", "none");
}            

resultPreview.createMap = function() {
    util.mapLeaflet('leaflet-map',"polygon",function(){
        resultPreview._ranges = {};
        resultPreview.layersArr = {};
//			leafletMap.addControl(new L.NewRectangleControl());
        console.log("地图初始化完成"); 
        let mapObj = $('.leaflet-control-zoom.leaflet-bar.leaflet-control');
        mapObj.append(`<a class="glyphicon glyphicon-chevron-right leaflet-control-trackIds" title='轨迹列表' href="#" style="color: gray; outline: none;"></a>`);
        $('.leaflet-control-trackIds').on('click', function() {
            let mark = ($(this).hasClass('glyphicon-chevron-right')? 'block' : 'none')
            $('.trackResult').css('display', mark);
            if(mark == 'none'){
                $('.pickupmodal .track_filter').css('display','none');
            }            
            $(this).toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
        })    
    });
}
resultPreview.retParamFn = function() {
    //	重置轨迹类型、采集批次
		$('input.paramFn').val('');
		$('input.paramFn').attr('name','');
}
resultPreview.rectBounds = function(layers,type){
    resultPreview.search_range = '';
    if(type){
        layers.enableEdit();
        var _centerNode = [layers._latlngs[0][0].lat, layers._latlngs[0][0].lng];
        leafletMap.setView(_centerNode);
        _ranges = layers;
    }else{
        if(layers.feature._latlngs[0].length < 3){
            layers.feature.remove();
            util.errorView("请绘制一个多边形");
            return;
        }
        _ranges = layers.feature;
    }
    resultPreview.clearArea_new();
    resultPreview._ranges = layers;
    var search_range = util.geoPolygon(resultPreview._ranges.feature._latlngs[0]),
        version = $(".fusionBoxVersion option:selected").val() || 6,
        polygon_url =  {
            "_url": configURL.task_frame+"lane_line_merge/queryV2",
            "data": {
                "param": search_range,
                "queryType": 1,
                "version": version 
            }
        },
            polyline_url = configURL.kss+'track/chain/findByPolygon?polygonWkt=POLYGON(('+search_range+'))';
         resultPreview.search_range  = search_range;
    if(!version){
        util.errorView("加载数据失败，版本不存在",false);
        return;
    }
    $("#loading").css("display","block");
    resultPreview.clearLayers_new();
    // resultPreview.queryByWKT(); 
     resultPreview.polygon_search_new(polygon_url,polyline_url);
    // resultPreview.polyline_search(polyline_url);
},

//	清除所有的覆盖物 轨迹id
resultPreview.clearLayers_new = function(){
    
    for(var _leaflet_id in resultPreview.layersArr){
        var layerOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
        if(layerOne){
            layerOne.remove();
        }
    }
    resultPreview.layersArr = {};
    resultPreview.trackIds = [];
    resultPreview.trackIdBind = {};
    resultPreview.checkTrackIds = {};
    Object.keys(resultPreview.trackFilter).map(ell => {resultPreview.trackFilter[ell]=[];})
    resultPreview.preTrackId = {};   
    
}
//	清除绘制范围
resultPreview.clearArea_new = function(){    
   var _leaflet_id = resultPreview._ranges.feature && resultPreview._ranges.feature._leaflet_id;
        if(_leaflet_id){
            leafletMap.editTools.featuresLayer._layers[_leaflet_id].remove()
        }    
    resultPreview._ranges = {};
}

	
//	根据绘制的多边形去查询数据
resultPreview.polygon_search_new = function(polygon_url,polyline_url){
    util.postAjax(polygon_url._url,polygon_url.data,function(data){
        resultPreview.polyline_search(polyline_url);
        if(!data.results){
            util.errorView("查询任务框失败");
            return;
        }
      
        for(var i=0; i<data.results.length; i++){
            var range1 = data.results[i].data.geometry.coordinates[0],
                thisRange = [];
            for(var l=0; l<range1.length; l++){
                thisRange.push([range1[l][1],range1[l][0]]);
            }
            var polygon = L.polygon(thisRange, {color: '#A020F0'}).addTo(leafletMap);
            
            var _leaflet_id = polygon._leaflet_id;
            resultPreview.layersArr[_leaflet_id] = true;
        }

        })
     
      

},
resultPreview.polyline_search = function(polyline_url) {
    // function polyline_search(){
        util.getAjax(polyline_url,true,function(data){
      if(!data.result){
          util.errorView("查询轨迹失败");
          return;
      }   
      for(var i=0; i<data.result.length; i++){
          var trackId = data.result[i].trackId,				//轨迹ID
              recog = data.result[i].recog;					//识别状态
        //   if(recog == "1"){
              resultPreview.sysColor = '#ff0000';
              var locs = resultPreview.lineString(data.result[i].line);	//抽稀后的轨迹点
              var polyline = L.polyline(locs, {color: 'red'}).addTo(leafletMap);
              var _leaflet_id = polyline._leaflet_id;
              resultPreview.layersArr[_leaflet_id] = true;  
              resultPreview.trackIdBind[trackId] = _leaflet_id;
              resultPreview.checkTrackIds[trackId] = true;  
              let trackObj = {id: trackId};
              /**轨迹标签选项遍历 */
              Object.keys(resultPreview.trackFilter).map(el =>{
                  let _label = data.result[i][el] || '';
                  trackObj[el] = data.result[i][el] || '';
                  if(_label && resultPreview.trackFilter[el].indexOf(_label)== -1){
                      resultPreview.trackFilter[el].push(_label)
                  }
              })
              resultPreview.resetTrackFilter();
              resultPreview.trackIds.push(trackObj);
        //   }
      }
      
      let _ids = Object.keys(resultPreview.trackIdBind);
      $('#on-off input.trackRandom').val(_ids.length);
      resultPreview.resetTrackRes(_ids);

  })
  $("#loading").css("display","none");
//   }
}
//	轨迹点数据处理
resultPreview.lineString =  function(line){
		if(!line){
			return [];
		}
		var replaces = line.replace("LINESTRING (","").replace(")","");
		var Coordinate = replaces.split(", ");
//		添加任务范围显示
		var locs = [];
		for(var i=0; i<Coordinate.length; i++){
			var strs2 = Coordinate[i].split(" ");
			var loc = [ Number(strs2[1]), Number(strs2[0]) ]; 								//定义一数组 
			locs.push(loc);
		}
	    return locs;
	},
//	清空当前定位轨迹
resultPreview.clearTrack = function(){
    for(var i=0; i<resultPreview.layersArr.length; i++){
        var _leafletId = resultPreview.layersArr[i],
            _layer1 = leafletMap.editTools.featuresLayer._layers[_leafletId] || leafletMap._layers[_leafletId];
        _layer1 && _layer1.remove();
    }
}   

/**
 * @description 查询创建项目所需参数
 * @param {挑图任务的项目代码} ids 
 */
resultPreview.getProjParams = function (ids) {
    resultPreview.enumSpec = [];
    // resultPreview.JsonForm = resultPreview.JsonFormSpec.map(el => el);
    let _url = configURL.haydn + '/parameter/query?ids=' + ids;
//    _url = "http://192.168.7.22:18800/haydn/" + 'parameter/query?ids='+ ids;
    $.ajax( {
        type : "GET",
        url : _url,
        async : true,
        success : function (data) {
            if (data.code != '0') {
                util.errorView('查询项目参数失败：' + data.message);
                return;
            }
            if (!data.result || !data.result[0]) {
                util.errorView('项目参数为空：' + data.message);
                return;
            }
            let resData = data.result[0].params || [];
            // resultPreview.enumSpec = resData;
            resultPreview.setProjParams(resData);
			
        }          
    })
}
/**load项目参数 */
resultPreview.setProjParams = async function (data) {

     function  getSubParams(data) {
        let ajaxParam = data.source.split('@'),
        ajaxType = (ajaxParam[0] == 'get' || ajaxParam[0] == 'GET') ? util.getAjax : util.postAjax,
        ajaxUrl = ajaxParam[1];
        return new Promise((res,rej) => {   
			ajaxType(ajaxUrl, {}, function(data){
				res(data);
			})
        })
    }
    for (var i = 0; i < data.length; i++) {
        let tempObj = '',
            _value = data[i].defaultValue || '',
            _sourceType = data[i].sourceType,
            _type = data[i].type,
            _id = data[i].key,
            _name = data[i].description,
            _isProParams = true,
            _required = data[i].required,
            specObj =data[i];

        if (_sourceType == 'dynamicSelect' || _type == 'select') {
            /**获取地址查询 */
            // let _sourceList = data[i].source.split('@')
            // let ajaxMethod  =_sourceList[0] || '';
            // let _url = _sourceList[1] || '';
            tempObj = { id: _id, name: _name, show: true, required: _required, data: [], isProParams: _isProParams }
            let subdata = await getSubParams(data[i]);
                if (subdata.code != '0') {
                    util.errorView(`查询${_id}相关参数失败：` + subdata.message);
                    return;
                }                  
                specObj['source'] = subdata.result || [];              
                tempObj.data = specObj['source'].map(el => {
                let mark = (el.value == _value?'selected':'')
             
                return new Object({
                    name: el.label,
                    value: el.value,
                    selected: mark
                })
            });
            resultPreview.JsonForm.push(tempObj);
       
 
        }else if(_sourceType == 'select'){
                       /**直接获取 */
            let _source = JSON.parse(data[i].source) || [];
            specObj['source'] =_source; 
            tempObj = { id: _id, name: _name, show: true, required: _required, data: [], isProParams: _isProParams }
            tempObj.data = _source.map(el => {
                let mark = (el.value == _value?'selected':'')
                return new Object({
                    name: el.label,
                    value: el.value,
                    selected: mark
                })
            });
            resultPreview.JsonForm.push(tempObj);
     } else {
            tempObj = { id: _id, name: _name, show: true, required: _required, type: 'input', isProParams: _isProParams }
            resultPreview.JsonForm.push(tempObj);
        }
        resultPreview.enumSpec.push(specObj)
        resultPreview.findResultData();
    }
},
/*查询环节参数*/
resultPreview.processInit = function (code) {
	resultPreview.bizCodes[code].list = [];
	var _url = configURL.haydn + 'link/query/all?bizCode=' + resultPreview.bizCodes[code].code; // trainging processing
	util.getAjax(_url, true, function (data) {
		$('#loading').css('display', 'none');
		if (data.code != '0') {
			util.errorView('查询环节相关参数失败：' + data.message);
			return;
		}
		var datas = data.result || [],
			return_data = {};
		for (var i = 0; i < datas.length; i++) {
			let processName = datas[i].processName;
			return_data[processName] = datas[i];
		}
		resultPreview.service_version(return_data, code);
	})
}
/*查询所有的服务版本并支持选择*/
resultPreview.service_version = function (result, code) {
	var _list = [];
	resultPreview.version_list = [];
	for (var name in result) {
		_list.push(name);
	}
	var formData = {
		"engineCodes": _list
	};
	$("#loading").css("display", "block");
	util.postAjax(configURL.bach + "engine/version/all", formData, function (data) {
		$("#loading").css("display", "none");
		if (data.code != '0') {
			util.errorView('查询环节相关引擎版本失败：' + data.message);
		}
		resultPreview.bizCodes[code].list = [];
		var engines_tags = [];
		var versions = data.result || {};
		for (var name in result) {
			resultPreview.bizCodes[code].list.push({
				'version': versions[name],
				'name': result[name].name,
				'code': result[name].code,
				'tags': result[name].tags
			});
			resultPreview.version_list.push({
				'version': versions[name],
				'name': result[name].name,
				'code': result[name].code,
				'tags': result[name].tags
			});
			for (var s = 0; s < result[name].tags.length; s++) {
				engines_tags.push(
					result[name].tags[s]
				);
			}
		}
		var _html = `
			${resultPreview.bizCodes[code].list.map(f => `
            <label>版本：</label>	
				<div class="" style="margin:3px 0px;">
					<select class="form-control ${f.code}" title="${f.code}">
						<option value="">请选择${f.name}版本</option>
						${f.version.map(v => `
							<option value="${v}">${v}</option>
						`).join('')}
					</select>
				</div>
			`).join('')}
		`;
		$('.sourceModal .versionList').html(_html);
		resultPreview.processCustomParam(engines_tags); // 自定义参数模板
		// 缓存默认值
	})
}
//	相关环节对应的自定义参数模版
resultPreview.processCustomParam = async function(engines_tags){
    let res = {};
    for(var i=0; i<engines_tags.length; i++){
        let _html = '',
            value = engines_tags[i].defaultValue || '',
            sourceType = engines_tags[i].sourceType,
            _type = engines_tags[i].type,
            id = engines_tags[i].key,
            name = engines_tags[i].description;
        if( sourceType == 'boolean' || _type == 'boolean' ){
            let _select = [
                {'name': '是', 'value': 'true', 'selected': ''},
                {'name': '否', 'value': 'false', 'selected': ''},
            ];
            for(var d=0; d<_select.length;d++){
                _select[d].selected = '';
                if(_select[d].value == value){
                    _select[d].selected = 'selected';
                }
            }
            _html = `
                <select class='form-control ${id}' title='${name}'>
                    ${_select.map(s => `
                        <option value='${s.value}' ${s.selected}>${s.name}</option>
                    `).join('')}
                </select>
            `;
        }else if( sourceType == 'select' || _type == 'select' ){
            
            let _select = JSON.parse( engines_tags[i].source );
            let v_select = _select.find(function(d){
                return (d.value == value)
            })
            if(v_select){
                v_select['selected'] = 'selected';
            }
            
            _html = `
                <select class='form-control ${id}' title='${name}'>
                    ${_select.map(s => `
                        <option value='${s.value}' ${s.selected || ''}>${s.label}</option>
                    `).join('')}
                </select>
            `;
            
        }else if(sourceType == 'json' || sourceType == 'file'){
            let dataVal = await customParamJson(engines_tags[i]);

            _html = `
                <textarea class="form-control ${id}" style="resize: none;cursor: zoom-in;height: 34px;overflow: hidden;" title="点击进行编辑" disabled="disabled">${dataVal}</textarea>
            `;
        }else{
            _html = `
                <input type='text' class='form-control ${id}' placeholder='${name}' value='${value}'>
            `;
        }
        engines_tags[i]['html'] = _html;
    }
    
    var htmls = `
    <div class="form-group" style="line-height:35px;">
        <div class="col-sm-3">
        <h5 style='text-align:center;padding:8px;'>引擎名称</h5>
        </div>
        <div class="col-sm-3">
        <h5 style='text-align:center;padding:8px;'>环节名称</h5>			
        </div>
        <div class="col-sm-3">
        <h5 style='text-align:center;padding:8px;'>环节描述</h5>			
        </div>
        <div class="col-sm-3" >
        <h5 style='text-align:center;padding:8px;'>参数配置</h5>
        </div>
    </div>
        ${engines_tags.map(s => `
            <div class="form-group" style="line-height:35px;float:left;">
                <div class="col-sm-3">
                    <input type='text' class='form-control' value='${s.code || ""}' readonly>
                </div>
                <div class="col-sm-3">
                    <input type='text' class='form-control' value='${s.description || ""}' readonly>
                </div>
                <div class="col-sm-3">
                <input type='text' class='form-control' value='${s.label || ""}' readonly>
            </div>
                <div class="col-sm-3">
                    ${s.html}
                </div>
            </div>
        `).join('')}
    `;

    $("#customParam .modal-body").html(htmls);
    function customParamJson(data){
		
		let ajaxParam = data.source.split('@'),
			ajaxType = (ajaxParam[0] == 'get' || ajaxParam[0] == 'GET') ? util.getAjax : util.postAjax,
			ajaxUrl = ajaxParam[1];
		
	    return new Promise((resolve, reject) => {
			ajaxType(ajaxUrl, {}, function(data){
				resolve(data);
			})
	    })
		
    }
    $('.processCustomParamS').on("click", function (e) {
        $('#customParam').fadeIn(200);
        // $('.modal-backdrop.in').fadeIn(200);
    });
    $('#btnCustomClose').on('click', function () {
        $("#customParam").fadeOut(200);
        // $('.modal-backdrop.in').fadeOut(200);
    })
    // $(".taskDiv .processCustomParamS").on('click', function() {
    //     $('#customParam').css('display','block');
    // });
    $('#customParam .body-editor-control').on('click', 'button.editor-save', function () {
        resultPreview.saveEditor();
    });
    $('#customParam .modal-body').on('mousedown', 'textarea', function () {
        resultPreview.customParamEdit(this.value);
        resultPreview.editCustomParam = this.className;

    });
    

}

/* 自定义参数编辑 */
resultPreview.customParamEdit = function (value, event) {
	var newVal = "", initVal = "";
	try {
		newVal = util.formatJson(JSON.parse(value))
		initVal = newVal;
	} catch (e) {
		console.log(e);
		initVal = value;
	}
	$('.body-editor textarea').val(initVal);

},

/* 自定义参数编辑保存 */
resultPreview.saveEditor = function (event) {
	var content = "", html_ = "";
	try {
		content = JSON.stringify(JSON.parse($('.body-editor textarea').val()));
		html_ = content;
	} catch (e) {
		console.log(e);
		html_ = $('.body-editor textarea').val();
	}
	document.getElementsByClassName(resultPreview.editCustomParam)[0].innerHTML = html_;
}
/* 地图点击轨迹更新状态 */
resultPreview.updateStatus = function(index){ // pathid
    var trackId = projectTrack.trackList[index].id,
        leafletId = projectTrack.trackList[index]._leaflet_id;
    projectTrack.trackCheck[trackId] = !projectTrack.trackCheck[trackId];
    if($('#trackBodyTable .'+trackId).length){
        $('#trackBodyTable .'+trackId+' input')[0].checked = projectTrack.trackCheck[trackId];
    }
    var _color = projectTrack.trackCheck[trackId] ? '#00FF7F' : '#000000',
        polyline = leafletMap.editTools.featuresLayer._layers[leafletId] || leafletMap._layers[leafletId];
    polyline.setStyle({'color': _color});
    polyline.bringToFront();
}
/**筛选轨迹界面数据载入 */
/**筛选结果刷新 */
resultPreview.doFilter = function() {
    let filterRes = {};
    $('.track_filter select').each(function(){
        let _k = this.className.split(' ')[1];
        let _v = this.value; 
        filterRes[_k] = _v;
    });
    resultPreview.trackIds.map(el => {
        resultPreview.checkTrackIds[el.id] = true;
     Object.keys(el).map(ell => {
            if(ell != 'id' && el[ell] && filterRes[ell]  && el[ell] != filterRes[ell]){
                resultPreview.checkTrackIds[el.id] = false;
            }
         })       
    })
    let _ids  =  resultPreview.trackIds.map(el => {return el.id});
    let _tableids  =  Object.keys(resultPreview.checkTrackIds).filter(ell => {return resultPreview.checkTrackIds[ell]});
    resultPreview.resetTrackRes(_tableids);
    _ids.map(id => {   
            let leafletID = resultPreview.trackIdBind[id];
            let _polylineOne= leafletMap.editTools.featuresLayer._layers[leafletID] || leafletMap._layers[leafletID];
            if(_polylineOne) {
                let _color = resultPreview.checkTrackIds[id]?'#000000':'#ff0000';
                 resultPreview.preTrackId['id'] = leafletID;
                 resultPreview.sysColor = '#000000';
                 resultPreview.preTrackId['color'] = resultPreview.sysColor;
                _polylineOne.setStyle({'color': _color});
                _polylineOne.bringToFront();
            }
    })

    // resultPreview.checkTrackIds
}
resultPreview.resetTrackRes= function(_ids){
    let _htmlTrack = `<div class="resHeader"><span class="subLstHead">轨迹总数:${_ids.length}</span>
    <a class="tabClose tabTools" href="#">关闭</a>
    <a class="allClear tabTools" href="#">清除</a>
    <a class="allSelect tabTools" href="#">全选</a>
    <a class="trackSelect tabTools" style='display:none;' href="#">筛选</a>
     <a class="trackRand tabTools" style='display:none;' title='设置随机筛选后的轨迹数量N(暂不启用)' href="#">设置N值</a>
    </div><div class='resBody'><ol>
    ${_ids.map(id => `<li><input type="checkbox" checked class=${id} /><span  class=${id} >${id}</span></li>`).join('')}
    </ol></div>`
    $('.trackResult').html(_htmlTrack);
}  
resultPreview.trackRand = function() {

}
// resultPreview.queryByWKT = function(){
//     let url_wkt = configURL.krs + '';
//     var checkRanges = {
//         "taskFrames": [],
//         "ranges": []
//     },
//     startSurveyTime = $('.projectTrackSearch .startSurveyTime').val(),
//     endSurveyTime = $('.projectTrackSearch .endSurveyTime').val(),
//     taskId = $('.projectTrackSearch .taskId').val();
// var param = {
//     taskId: taskId,
//     startSurveyTime: startSurveyTime ? (startSurveyTime+' 00:00:00.000') : '',
//     endSurveyTime: endSurveyTime ? (endSurveyTime+' 23:59:59.000') : ''
// };

// }


resultPreview.interfaceInit();

