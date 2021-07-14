/**
 * 数据中心
 */

var disease_centre = {
	
	cn_data: Disease.TYPE_LIST.PAVEMENT_DISTRESS,
	
	centre_search_change: function(){
		
		
		let adcode_num = {
				'320600': [1,254,7,5,813,59],
				'370200': [2,78,7,1,1544,78],
				'441400': [1,48,7,1,37,8]
			},
			link_list = config_url.nantong.link_list[disease_user.current_adcode.adcode] || [],
			this_num = adcode_num[disease_user.current_adcode.adcode] || ['-','-','-','-','-','-'];
		
		let pdd_s_html = `
			<li>
				<label class="checkbox_label checkbox_label_all">
					<input type="checkbox" value="" name="LINK_CODE">
					<b class="checkbox_b"></b>
					<span>全选</span>
				</label>
			</li>
	        ${link_list.map(f => `
				<li>
					<label class="checkbox_label">
						<input type="checkbox" value="${f.id}">
						<b class="checkbox_b"></b>
						<span>${f.id}</span>
					</label>
				</li>
	        `).join('')}
		`;
		$('.data_center_head .search_param_1 .select_LINK_CODE ul').html(pdd_s_html);
		$('.data_center_head .search_param_1 .select_LINK_CODE p span').html('路线编号');
		$('.data_center_body').html('');
		
		for(let i=0; i<this_num.length; i++){
			let p_dom = $('.data_center_statistics p b').eq(i),
				p_val = this_num[i];
			p_dom.html(p_val);
		}
		
		this.check_value_change();
		this.centre_list();
		
	},
	
	/*数据中心--界面初始化*/
	centre_search_init: function(){
		let _this = this;
		let pdd_s = [];
		for(let type in this.cn_data.TYPE){
			pdd_s.push({
				'name': this.cn_data.TYPE[type].NAME,
				'value': type
			})
		}
		let pdd_s_html = `
			<li>
				<label class="checkbox_label checkbox_label_all">
					<input type="checkbox" value="" name="TYPE">
					<b class="checkbox_b"></b>
					<span>全选</span>
				</label>
			</li>
	        ${pdd_s.map(f => `
				<li>
					<label class="checkbox_label">
						<input type="checkbox" value="${f.value}" data-text="${f.name}">
						<b class="checkbox_b"></b>
						<span>${f.name}</span>
					</label>
				</li>
	        `).join('')}
		`;
		$('.data_center_head .search_param_1 .select_TYPE ul').html(pdd_s_html)
		
		/*数据中心--点击左侧tab切换窗口*/
	    $('.data_center_tab ul li').click(function(e){
	    	$('.data_center_tab ul li').removeClass('active');
	    	e.target.className = 'active';
	    	
	    	let name = e.target.getAttribute('data-name');
	    	$('#data_center .data_center_child').hide();
	    	$('#data_center .data_center_child.'+name).show();
		})
		/*数据中心--点击确认按钮进行查询数据列表*/
	    $('.search_param button').click(function(){
	    	$('.select_param p b').removeClass('active');
	    	$('.select_param ul').hide();
			disease_centre.centre_list();
		})
	    $('.data_center_body').on('click', '.page_jump button.page_submit', function (e) {
			let totalPages = $('#center_table').bootstrapTable("getOptions").totalPages || 0;
	    	let page = $('.page_jump input.data_page').val(),
	    		new_page = Number(page) || 1;
	    	
	    	if( (new_page < 1) || (new_page > totalPages) ){
	    		new_page = 1;
	    	}
			disease_centre.centre_list(new_page);
		})
	    /*桩端*/
	    $('.data_center_head').on('blur', '.input_param input.map_code_1', function (e) {
	    	let max_num = $('.input_param input.map_code_2').val(),
	    		new_num = parseInt(e.target.value) || '',
	    		old_num = parseInt(e.target.name) || '',
	    		value = !new_num ? '' : new_num;
	    	if(max_num && new_num >= max_num){
	    		value = old_num;
	    	}
    		e.target.value = value;
    		e.target.name = value;
	    });
	    $('.data_center_head').on('blur', '.input_param input.map_code_2', function (e) {
	    	let min_num = $('.input_param input.map_code_1').val(),
	    		new_num = parseInt(e.target.value) || '',
	    		old_num = parseInt(e.target.name) || '',
	    		value = !new_num ? '' : new_num;
	    	if(min_num && new_num <= min_num){
	    		value = old_num;
	    	}
    		e.target.value = value;
    		e.target.name = value;
	    });
	    /*下拉框-显示隐藏*/
        $('.data_center_head').on('click', '.search_param_1 .select_param p', function(e) {
            let _name = e.target.getAttribute('data-name') || e.target.parentNode.getAttribute('data-name') || ''
              , b_class = '.data_center_head .select_param.select_' + _name + ' p b'
              , ul_class = '.data_center_head .select_param.select_' + _name + ' ul';
            $(b_class).toggleClass('active');
            $(ul_class).toggle()
        });
	    /*下拉框-全选*/
	    $('.data_center_head').on('click', '.select_param ul label input', function (e) {
	    	let _name = e.target.name,
	    		_value = e.target.value,
	    		_check = e.target.checked,
	    		_input = $('.select_param.select_'+_name+' ul label input');
	    	
	    	if(!_value){
		    	for(let i=0; i<_input.length; i++){
		    		_input[i].checked = _check;
		    	}
	    	}
	    	
	    	_this.check_value_change();
	    	
		})
	},
	
	/*选项变化时--修改*/
	check_value_change: function(){
		
		let select_param = $('.select_param');
		for(let i=0; i<select_param.length; i++){
			let span_s = select_param[i].getElementsByClassName('select_value');
			let input_s = select_param[i].getElementsByTagName('input');
			let select_type = true;
			let select_title = span_s[0].title;
			let select_values = [];
			let select_names = [];
			
			for(let s=0; s<input_s.length; s++){
				let _checked = input_s[s].checked,
					_value = input_s[s].value,
					_text = input_s[s].getAttribute('data-text') || _value;
				if(!_checked && _value){
					select_type = false;
				}
				if(_value && _checked){
					select_values.push(
						_value
					)
					select_names.push(
						_text
					)
				}
			}
			if(select_type || !select_values.length){
				span_s[0].innerText = select_title;
			}else{
				span_s[0].innerText = select_names.join(',');
			}
			span_s[0].name = select_values.join(',');
			console.log(span_s[0].name)
		}
		
	},
	
	centre_init: function(type) {
		var display = (type == '1') ? 'none' : 'block';
		$('#data_center').css('display', display);
	},
	
	centre_list: function(page=false){
		var _table = `
			<table id="center_table"></table>
		`;
		$('#data_center .data_center_body').html(_table);
		if(!disease_user.current_adcode){
			return;
		}
		var _url = config_url.pdds + 'data/pd/queryPage',
			_h = $('.data_panel').height() - 192 - 56,
			_current = page || 1,
			_this = disease_centre;
		var myTable = $('#center_table').bootstrapTable({
	        url: _url,
	        method: 'POST',
//	        height: _h,
	        uniqueId: 'id',                        // 绑定ID，不显示
	        striped: false,                        //是否显示行间隔色
	        cache: false,                          //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	        sidePagination: 'server',              //分页方式：client客户端分页，server服务端分页（*）
	        ajaxOptions: {
	        	headers: {
		        	'Authorization': token
		        }
	        },
			dataField: 'rows',
			undefinedText: "-",
	    	pagination: true,                      //是否显示分页
			pageNumber: _current,
			pageSize: 14,
	        data_local: "zh-CN",
	    	showPaginationSwitch: false,
	    	paginationLoop: false,
	        queryParams : function (params) {
	        	var _page = (params.offset / params.limit) + 1;
	            var temp = {
				  	"sort": [
					    {
					      "k": "properties.TASK_ID",
					      "order": "desc"
					    }
				  	],
				  	"ops": [{
				    	'k': 'adcode',
				    	'v': disease_user.current_adcode.adcode,
				    	'op': 'eq'
				  	}],
				  	"page": {
					    "totalPages": 0,
					    "count": 10000000,
					    "pageNo": _page,
					    "pageSize": 14
				  	}
				};
				
				let dom_p = $('.search_param_1 .select_param p'),
					dom_span = $('.search_param_1 .select_param .select_value'),
					map_code_1 = $('.search_param_1 .input_param .map_code_1'),
					map_code_2 = $('.search_param_1 .input_param .map_code_2');
				
//				if(map_code_1){
//					temp.ops.push({
//				    	'k': type,
//				    	'v': value,
//				    	'op': 'in'
//					})
//				}
//				if(map_code_2){
//					temp.ops.push({
//				    	'k': type,
//				    	'v': value,
//				    	'op': 'in'
//					})
//				}
				
				
				for(let i=0; i<dom_p.length; i++){
					let type = dom_p[i].getAttribute('data-name'),
						value = dom_span[i].name;
					if(type == 'LINK_CODE' && value){
						temp.ops.push({
					    	'k': type,
					    	'v': value,
					    	'op': 'in'
						})
					}else if(value && type){
						temp.ops.push({
					    	'k': type,
					    	'v': value,
					    	'op': 'in'
						})
					}
				}
				
	            return JSON.stringify(temp);
	        },
	        columns: [
	            {
		            field: 'properties.MP_CODE',
		            title: '路线',
		            align: 'center',
		            valign: 'middle',
		            formatter: function (value='', row, index) {
		            	let map_codes = value.split('|') || [];
		            	return (map_codes[0] || '');
					}
	            },{
		            field: 'properties.MP_CODE',
		            title: '公里桩段',
		            align: 'center',
		            valign: 'middle',
		            formatter: function (value='', row, index) {
		            	let map_codes = value.split('|') || [],
		            		code_val = map_codes[1] ? ('K'+map_codes[1]) : '';
		            	return code_val;
					}
	            },{
		            field: 'properties.UP_DOWM',
		            title: '方向',
		            align: 'center',
		            valign: 'middle',
		            formatter: function (value, row, index) {
		            	var cn_name = _this.cn_data.UP_DOWM[value] || '';
		            	return cn_name;
					}
	            },{
		            field: 'properties.ROAD_TYPE',
		            title: '路面类型',
		            align: 'center',
		            valign: 'middle'
	            },{
		            field: 'properties.TYPE',
		            title: '病害类型',
		            align: 'center',
		            valign: 'middle',
		            formatter: function (value, row, index) {
		            	var cn_name = _this.cn_data.TYPE[value] ? _this.cn_data.TYPE[value].NAME : '';
		            	return cn_name;
					}
	            },{
		            field: 'properties.SUBTYPE',
		            title: '损坏程度',
		            align: 'center',
		            valign: 'middle',
		            formatter: function (value, row, index) {
		            	var type = row.properties.TYPE || '',
		            		subtype = _this.cn_data.TYPE[type] ? _this.cn_data.TYPE[type].SUBTYPE : {},
		            		cn_name = subtype[value] || '';
		            	return cn_name;
					}
	            },{
		            field: 'properties.AREA',
		            title: '计量面积（平方米）',
		            align: 'center',
		            valign: 'middle',
		            formatter: function (value, row, index) {
		            	var cn_name = value ? Number(value) : 0;
		            	return cn_name.toFixed(2);
					}
	            },{
		            field: 'properties.MPS_CODE',
		            title: '测量结果',
		            align: 'center',
		            valign: 'middle',
					events: {
						'click .measurements' : function(e,value,row,index){
							_this.open_map(row, 'visua_up_map');
						}
					},
		            formatter: function (value, row, index) {
		            	let cn_name = `
		            		<a href="#" class="measurements"></a>
		            	`;
		            	return cn_name;
					}
	            },{
		            field: 'properties.ID',
		            title: '备注',
		            align: 'center',
		            valign: 'middle',
					events: {
						'click .remarks' : function(e,value,row,index){
		            		let remark = row.properties.REMARK || '无备注';
	        				$.errorView(remark, true);
						}
					},
		            formatter: function (value, row, index) {
		            	let cn_name = `
		            		<a href="#" class="remarks"></a>
		            	`;
		            	return cn_name;
					}
	            },{
		            field: 'properties.T_POINT_ID',
		            title: '正射图',
		            align: 'center',
		            valign: 'middle',
					events: {
						'click .open_map_up' : function(e,value,row,index){
							_this.open_map(row, 'visua_up_map');
						}
					},
		            formatter: function (value, row, index) {
		            	let cn_name = `
		            		<a href="#" class="open_map_up"></a>
		            	`;
		            	return cn_name;
					}
	            },{
		            field: 'properties.TRACK_ID',
		            title: '采集图',
		            align: 'center',
		            valign: 'middle',
					events: {
						'click .open_map_survey' : function(e,value,row,index){
							_this.open_map(row, 'collect_map');
						}
					},
		            formatter: function (value, row, index) {
		            	let cn_name = `
		            		<a href="#" class="open_map_survey"></a>
		            	`;
		            	return cn_name;
					}
	            },{
		            field: 'properties.S_TASK_ID',
		            title: '3D点云',
		            align: 'center',
		            valign: 'middle',
					events: {
						'click .open_map_3D' : function(e,value,row,index){
	        				$.errorView('功能未开发');
	        				return;
							_this.open_map(row, 'point_cloud_map');
						}
					},
		            formatter: function (value, row, index) {
		            	let cn_name = `
		            		<a href="#" class="open_map_3D read_only"></a>
		            	`;
		            	return cn_name;
					}
	            }
	        ],
	        responseHandler: function (data) {
	        	if(data.code != '0'){
	        		$.errorView('数据加载失败');
	            	return "数据加载失败！";
	        	}
	        	var _data = data.result.data.features || [],
	        		res = {
	        			rows: _data,
	        			total: data.result.page.count
	        		};
	        	return res;
	        },
	        formatLoadingMessage: function(data){
		        return "请稍等，正在加载中...";
		    },
		    formatNoMatches: function(data){
		        return "无符合条件的数据";
		    },
	        onLoadError: function (data) {
	            return "数据加载失败！";
	        },
	        onLoadSuccess: function (data) {
	        	if(data.total){
		        	_this.table_pagination_init(data, page);
		        	console.log(data)
	        	}
	        }
		})
		myTable.bootstrapTable('hideLoading');
		/*$.postAjax({
			url: _url,
			data: data,
			callback: function(data){
				if(data.code != '0'){
					$.errorView(data.message);
					return;
				}
				var _data = data.result.data.features || [];
				console.log(_data);
			}
		})*/
		
	},
	
	/*自定义分页功能信息*/
	table_pagination_init: function(data, page=''){
		if( !$('.fixed-table-pagination').length ){
			$.errorView('获取分页信息失败');
			return;
		}
		let totalPages = $('#center_table').bootstrapTable("getOptions").totalPages || 0;
		let html = `
			<div class="page_jump">
				<span>共</span>
				<span class="data_count">${totalPages}</span>
				<span>页，到第</span>
				<input type="number" class="data_page" value="${page}" />
				<span>页</span>
				<button class="btn page_submit">确定</button>
			</div>
		`;
		$('.data_center_body .fixed-table-pagination').append(html);
		
		
		let row_length = data.rows ? data.rows.length : 0,
			new_height = row_length * 40 + 310,
			heights = [787, new_height];
		heights.sort(function(a,b) {
			return b - a;
		});
		let data_height = heights[0] + 'px';
		$('#data_center').css('min-height', data_height);
		document.body.scrollTop = document.documentElement.scrollTop = 220;
	},
	
	/*a标签跳转的点击事件*/
	open_map: function(row, type){
		
		let _id = row.properties.ID;
		let _data = disease_list.catchList.filter(function(data){
			return (data.properties.ID == _id);
		})
		if(!_data.length){
			$.errorView('地图上未找到当前病害');
			return;
		}
		
		$('#hourlist li').removeClass('active');
		$('#hourlist li[type="1"]').addClass('active');
		this.centre_init(1);
		let new_index = _data[0].properties.index;
		disease_init.player_mode_init(type);
		disease_info.come_to_info(new_index,true,true);
		
	}
	
}

/**
 * 地图相关
 */
var disease_cesium = {
	
	
	right_point: null,
	last_point: null,			//---高亮的点缓存
	last_info_point: null,		//---高亮的点缓存
	load_image: null,
	time_spac: 300,
	minZoom: 9,
	maxZoom: 27,
	camera_zoom: null,
	
	point_to_info: function(type){
		if(!this.last_point){
			$.errorView('获取病害信息失败');
			return;
		}
	    $(".cesium_popup").hide();
		disease_init.player_mode_init(type);
		disease_info.come_to_info(this.last_point.datas.index,true,true);
	},
	
	maps_init: function() {
		
		var _this = this;
		
		/*cesium地图-离开pop弹窗*/
		/*$('#cesium_map_parent .cesium_popup_mark').mouseout(function(){
			$('#cesium_map_parent .cesium_popup_mark').hide();
		})*/
		/*cesium地图-点击打开正射图、采集图、点云图*/
		$('.cesium_popup .popup_content .image_buttons button.image_buttons_up').click(function(){
			let name = this.name;
			_this.point_to_info(name);
		})
		$('.cesium_popup .popup_content .image_buttons button.image_buttons_survey').click(function(){
			let name = this.name;
			_this.point_to_info(name);
		})
		$('.cesium_popup .popup_content .image_buttons button.image_buttons_point').click(function(){
			let name = this.name;
			_this.point_to_info(name);
		})
		/*cesium地图的缩放按钮*/
		$('.cesium_control .zoom_in a').click(function(){
			var level = $('.cesium_control .zoom_level a').html(),
				new_level = Number(level) + 1;
			_this.zoomInOut(new_level);
		})
		$('.cesium_control .zoom_out a').click(function(){
			var level = $('.cesium_control .zoom_level a').html() - 1;
			_this.zoomInOut(level);
		})
		/*cesium地图的平移按钮*/
		$('.cesium_control .cesium_move span').click(function(){
			var data_type = this.getAttribute('data-type'),
				viewer_height = viewer.camera.positionCartographic.height;
			if(data_type){
				viewer.camera[data_type](viewer_height);
			}
		})
		/*cesium地图的图层按钮*/
		$('.cesium_control .layer_list').mouseleave(function(){
			$('.cesium_control .cesium_layers').removeClass('active');
			$('.cesium_control .layer_list').hide();
		})
		$('.cesium_control .cesium_layers a').click(function(){
			$('.cesium_control .cesium_layers').toggleClass('active');
			$('.cesium_control .layer_list').toggle();
		})
		$('.layer_list li label input').click(function(e){
			let val = e.target.value,
				checked = e.target.checked;
			_this.layers_changed({
				'value': val,
				'checked': checked
			});
		})
		$('.layer_list li span.radio_label').click(function(e){
			let _type = $('.layer_list .checkbox_label input[value="1"]')[0].checked;
			if(!_type){
				$.errorView('请先选中底图！');
				return;
			}
    		let dom = (e.target.localName == 'b') ? e.target.parentNode : e.target;
    		$('.layer_list li span.radio_label').removeClass('active');
    		$(dom).addClass('active');
    		
			let val = dom.getAttribute('name'),
				checked = true;
			_this.layers_changed({
				'value': val,
				'checked': checked
			});
		})
		/*cesium地图的返回初始按钮*/
		$('.cesium_control .full_screen a').click(function(){
			var _center = config_url.nantong.center,
				_zoom = config_url.nantong.zoom,
				_height = $.zoomToAltitude(_zoom),
				center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
			
			viewer.camera.setView({  
			    destination: center
			})
			/*var _bounds = config_url.nantong.info_bounds;
		  	viewer.camera.setView({
				destination: Cesium.Rectangle.fromDegrees(_bounds.west, _bounds.south, _bounds.east, _bounds.north)
			});*/
	//		zoom_level();
		})
		/*cesium地图的搜索按钮*/
		$('.cesium_control .cesium_search a').mouseover(function(){
			$('.cesium_control .cesium_search input').css('display', 'block');
			$('.cesium_control .cesium_search input').animate({
				'width': '178px'
			},200);
		})
		$('.cesium_control .cesium_search').mouseleave(function(){
			$('.cesium_control .cesium_search input').animate({
				'width': '0px'
			},200,'swing',function(){
				$('.cesium_control .cesium_search input').css('display', 'none');
			});
		})
		$('.cesium_control .cesium_search input').keydown(function(e){
			var value = e.target.value,
				code = e.keyCode;
			
			if(code == 13 && value){
				var _url = 'https://nominatim.openstreetmap.org/search?format=json&q='+value;
				$.getAjax({
					'url': _url,
					'token': true,
					'callback': function(data){
						var result = (data && data[0]) ? data[0] : {},
							boundingbox = result.boundingbox || null;
						if(!boundingbox){
							$.errorView('查询失败');
							return;
						}
						viewer.camera.setView({
							destination: Cesium.Rectangle.fromDegrees(
		                        boundingbox[2],
		                        boundingbox[0],
		                        boundingbox[3],
		                        boundingbox[1]
							)
						});
					}
				})
			}
		})
		
	    var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.canvas),
			scene = viewer.scene,
			_id = null;
	    //绑定鼠标移动事件
	    handler3D.setInputAction(function (movement) {
	        var picked = scene.pick(movement.endPosition);
	    	$(".cesium_popup").hide();
	        if(_this.last_point){
	        	if(_this.last_info_point && (_this.last_point._id == _this.last_info_point._id)){
	        		
	        	}else{
		        	_this.last_point._billboard._image._value = './Apps/Dist/Img/icon.png';
//		        	_this.last_point._billboard.disableDepthTestDistance._value = 0;
		        	_this.last_point = null;
	        	}
	        }
	        if (picked && picked.id && picked.id.data_id && picked.id._billboard && !picked.id.mark_type) {
	            var obj = { position: movement.endPosition },
	            	_id = _this.last_point ? _this.last_point._id : null;
	            if (picked.id._billboard) {
	            	picked.id._billboard._image._value = './Apps/Dist/Img/icon_active.png';
	        		picked.id._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
	            	_this.last_point = picked.id;
	            }
	            _this.cesium_popup_html({
	            	'obj': obj,
	            	'_id': _id,
	            	'scene': scene,
	            	'picked': picked
	            });
	        }else {
	            $(".cesium_popup").hide();
	        }
			$.cesium_refresh();
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	    
	    //绑定地图左键点击事件
	    handler3D.setInputAction(function (movement) {
	    	
	//		$('.disease_info').fadeIn(200);
	        var picked = scene.pick(movement.position);
	        if(picked && picked.id && picked.id._datas && !picked.id.mark_type){
	        	
	        	console.log(picked);
	        	
	        	var index = picked.id._datas.index;
		        if(picked.id._billboard && index != undefined){
		        	disease_info.come_to_info(index,true,true);
		        	
//					disease_info.info_init(index,true,true);
//					_this.change_last_point(picked.id);
//					_this.listen_cesium_body('disease_info', true);
//					if(display == 'none'){
//						$('.disease_info').css('display', 'block');
//					}
		        }
	            $(".cesium_popup").hide();
	        }else if(picked && picked.id && picked.id.point_length && !picked.id.mark_type){
	        	var center = picked.id._center,
					z_height = viewer.camera.positionCartographic.height,
	        		lng_lat = Cesium.Cartesian3.fromDegrees(center[0], center[1], 300);
				viewer.camera.setView({  
				    destination: lng_lat
				})
		    	_this.zoom_level();
	        }
			
	    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	    //绑定地图移动事件
	    handler3D.setInputAction(function (movement) {
	        $('#cesium_popup').hide();
	        $('.cesium_popup_mark').hide();
	    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	    //绑定地图缩放事件
	    /*handler3D.setInputAction(function (movement) {
	    	zoom_level();
	    }, Cesium.ScreenSpaceEventType.WHEEL);*/
	    //绑定滚轮点击事件事件
	    handler3D.setInputAction(function (movement) {
	        $('#cesium_popup').hide();
	    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
	    
		/*绑定-监听鼠标右键*/
//	    handler3D.setInputAction(function (event) {
//	    	_this.cesium_popup_mark(event);
//	    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	},
	
	/*鼠标在地图上的右键执行事件*/
	cesium_popup_mark: function(event){
		
    	$('.cesium_popup_mark').hide();
    	let map_width = $('#cesium_map').width() || 0,
    		map_height = $('#cesium_map').height() || 0,
    		dom_width = $('#cesium_map_parent').width() || 0,
    		dom_height = $('#cesium_map_parent').height() || 0,
    		left_width = dom_width - map_width,
    		top_height = dom_height - map_height,
    		new_left = event.position.x + left_width + 5,
    		new_top = event.position.y + top_height + 52,
    		picked = viewer.scene.pick(event.position);
    	
    	$('.cesium_popup_mark').css({
    		'top': new_top,
    		'left': new_left
    	});
    	
    	if(picked && picked.id && picked.id.mark_type == 'position_label'){
    		$('.cesium_popup_mark.remove_mark').show();
    		this.right_point = picked.id.id;
    	}else{
    		$('.cesium_popup_mark.add_mark').show();
    		this.right_point = $.get_cesium_xy(event);
    	}
	},
	
	/*图层列表发生改变时*/
	layers_changed: function(param){
		let show = param.checked,
			param_val = param.value,
			layers = viewer.imageryLayers._layers || [],
			values = viewer.entities.values || [],
			param_l = {
				'1': { 'tdtImg_c': true, 'tdtCva': true, 'tdtAdcode': true, 'tdtAdcodeM': true },
				'2': { 'tdtAdcode': true, 'tdtAdcodeM': true },
				'3': { 'tdtImg_c': true, 'tdtCva': true },
				'4': null
			};
		
		if(show && param.value == '1'){
			$('.radio_label').removeClass('active');
			$('.radio_label[name="2"]').addClass('active');
			param_val = $('.radio_label.active').attr('name');
		}else if(param.value == '1'){
			$('.radio_label').removeClass('active');
		}
		
		if(param.value == '4'){
			for(let i=0; i<values.length; i++){
				if(values[i].mark_type == 'position_label'){
					values[i].show = show;
				}
			}
		}else{
			for(let i=0; i<layers.length; i++){
				let layer_name = layers[i].imageryProvider._layer;
				if( param_l[param_val][layer_name] ){
					layers[i].show = show;
				}else{
					layers[i].show = !show;
				}
			}
		}
		$.cesium_refresh();
	},
	
	//更改最后一个点的值
	change_last_point: function(layer){
	    if(this.last_info_point){
	    	this.last_info_point._billboard._image._value = './Apps/Dist/Img/icon.png';
	    	this.last_info_point._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
	    	this.last_info_point = null;
	    }
	    if(layer){
	    	layer._billboard._image._value = './Apps/Dist/Img/icon_active.png';
			layer._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
	    	this.last_info_point = layer;
	    }
		$.cesium_refresh();
	},

	/*地图缩放--放大-缩放*/
	zoomInOut: function(zoom){
		var height = $.zoomToAltitude(zoom);
		if(height){
			var center = $.getCenterPoint();
	    	viewer.camera.setView({
		        destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], height)
	    	})
		}
	},

	/*地图等级*/
	zoom_level: function(){
	    var height = viewer.camera.positionCartographic.height,
			zoom = $.altitudeToZoom(height),
	    	math_zoom = Math.round(zoom);
	    viewer.camera.mathZoom = math_zoom;
	    $('.cesium_control .zoom_level a').html(math_zoom);
	    disease_group.point_group();
	},

	/*地图气泡方法样式*/
	cesium_popup: function(param = null){
	    if (param && Cesium.defined(param.picked)) {
	    	var center = param.picked.id._datas.center_xy,
	    		_id = param.picked.id._id,
	    		id = Cesium.defaultValue(param.picked.id, param.picked.primitive.id),
	    		_z = center[2] + 20,
	        	positions = Cesium.Cartesian3.fromDegrees(center[0],center[1],center[2]),
	    		position_popup = Cesium.SceneTransforms.wgs84ToWindowCoordinates(param.scene, positions);
	        
	        var _this = disease_cesium;
	        
	        if (id instanceof Cesium.Entity) {
	            function positionPopUp(c) {
	            	var _x = 0,
	            		_y = -123,
	            		map_width = $('#cesium_map').width(),
	            		left_width = $('.cesium_map_left').width(),
	            		map_height = $('#cesium_map').height(),
	            		type_width = map_width - position_popup.x,
	            		type_height = map_height - position_popup.y;
	            	if(type_width < 289){
	            		_x = -289;
	            	}
	            	if(position_popup.y < 115){
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
	},

	/*地图气泡内容变化*/
	cesium_popup_html: function(param){
		var param_id = param.picked.id._id,
			datas = param.picked.id.datas,
			update_time = datas.update_time.split('/').join('.'),
			create_time = new Date(datas.create_time),
			new_create_time = $.timeConvert(create_time, true),
			class_name = 'child_body_grade_value grade_' + datas.subtype,
			info_view_type_2 = datas.mp_codes_0 + ' ' + datas.mp_codes_1 + datas.mp_codes_2 + ' ' + datas.cn_up_down,
			track_point_id = datas.T_POINT_ID,
			place_value = datas.cn_mark + ' ' + datas.cn_up_down,
			track_image_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
		
		if(param._id != param_id){
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
	},

	/*控制cesium地图的缩放限制-60~~45000000-*/
	cesium_zoom: function(){
		
		var _this = this;
		
		viewer.scene.screenSpaceCameraController.minimumZoomDistance = $.zoomToAltitude(_this.maxZoom);
		viewer.scene.screenSpaceCameraController.maximumZoomDistance = $.zoomToAltitude(_this.minZoom);
		viewer.camera.percentageChanged = 0;
		
		const listener = () => {
			var camera_height = viewer.camera.positionCartographic.height,
	//			center = $.getCenterPoint(),
				zoom = $.altitudeToZoom(camera_height),
		    	math_zoom = Math.round(zoom);
		    
			/*center.push(camera_height);
			var positions = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]),
				_position = new Cesium.Cartesian3(positions.x, positions.y, positions.z);
			
			viewer.camera.position = _position;
			
			console.log(_position);
			console.log(viewer.camera.position);*/
			
			
		    if(math_zoom && (math_zoom != _this.camera_zoom)){
		    	_this.camera_zoom = Math.round(zoom);
				_this.zoom_level();
		    }
			
			
			
			/*var camHeight = viewer.camera.positionCartographic.height,
				isOutsideZoomLimits = false,
				destHeight;
			if(camHeight < _this.minZoom){
				isOutsideZoomLimits = true;
				destHeight = _this.minZoom;
			}else if(camHeight > _this.maxZoom){
				isOutsideZoomLimits = true;
				destHeight = _this.maxZoom;
			}
			if(isOutsideZoomLimits){
				const dest = Cesium.Cartesian3.fromRadians(
					viewer.camera.positionCartographic.longitude,
					viewer.camera.positionCartographic.latitude,
					destHeight
				);
				viewer.camera.position = dest;
			}*/
		};
		const removeListener = viewer.camera.changed.addEventListener(listener);
	    _this.zoom_level();
	},

	/*监听地图变化事件*/
	listen_cesium_body: function(dom, type){
		var class_obj = {
			'disease_list': true,
			'disease_info': true,
//			'disease_player': false
		};
		var width_arr = [],
			dom_width = 0;
		for(var class_name in class_obj){
			var display_type = $('#highway_disease .'+class_name).css('display'),
				width = $('#highway_disease .'+class_name)[0].offsetWidth - 10;
			
			if(class_name != dom && display_type == 'block'){
				if( class_name == 'screen_model' ){
					width += 344;
				}
				width_arr.push(width);
			}
		}
		if(type && class_obj[dom] ){
			dom_width = $('#highway_disease .'+dom)[0].offsetWidth - 10;
		}
		
		width_arr.push(dom_width);
		width_arr.sort(function(a,b) {
			return b - a;
		});
		
		var max_width = width_arr[0],
			map_width = 'calc(100% - ' + max_width + 'px)';
		
		$('#cesium_map_parent .cesium_map_left').width(max_width);
		$('#cesium_map_parent #cesium_map').width(map_width);
		
	},

	/*加载3D tile服务图层*/
	add_3d_tile: function(){
        if(!window.disease_user || !window.disease_user.current_adcode || !window.disease_user.current_adcode.adcode){
            return false;
        }
        let adcode = window.disease_user.current_adcode.adcode;
		let _this = this;
	    window.tileset2 = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: config_url.datasets_adcode + adcode + '/tileset.json',
	        preferLeaves: true,
	        dynamicScreenSpaceError: true,
	        foveatedTimeDelay: 1,
	        baseScreenSpaceError: 500,
	        immediatelyLoadDesiredLevelOfDetail: true
	    }));
	    tileset2.readyPromise.then(function () {
	        console.log('Loaded tileset2');
	        
		    /*var boundingSphere = tileset2.boundingSphere;
		    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);//获取到倾斜数据中心点的经纬度坐标（弧度）
		    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);//倾斜数据中心点的笛卡尔坐标      
		    var positions = [Cesium.Cartographic.fromDegrees(cartographic.longitude,cartographic.latitude)];
		    var promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions);//其中terrainProvider是当前场景使用的高程Provider
		    Cesium.when(promise, function(updatedPositions) {
		         var terrainHeight = updatedPositions[0].height;	//高程
		         var offset=Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, terrainHeight);	//带高程的新笛卡尔坐标
		         var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());	//做差得到变换矩阵
		         tileset2.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		    });*/
	        
	        /*
			var heightOffset = -35;
		    var boundingSphere = tileset2.boundingSphere;
		    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
		    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
		    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
		    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
		    tileset2.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		    */
		    
	    }).otherwise(function (error) {
	        console.log(error)
	    });
		
	    
	    // HTML overlay for showing feature name on mouseover
	    var nameOverlay = document.createElement('div');
	    viewer.container.appendChild(nameOverlay);
	    nameOverlay.className = 'backdrop';
	    nameOverlay.style.display = 'none';
	    nameOverlay.style.position = 'absolute';
	    nameOverlay.style.bottom = '0';
	    nameOverlay.style.left = '0';
	    nameOverlay.style['pointer-events'] = 'none';
	    nameOverlay.style.padding = '4px';
	    nameOverlay.style.backgroundColor = 'black';
	    nameOverlay.style.color = 'white';
	    // Information about the currently selected feature
	    var selected = {
	        feature: undefined,
	        originalColor: new Cesium.Color()
	    };
	
	    // An entity object which will hold info about the currently selected feature for infobox display
	    var selectedEntity = new Cesium.Entity();
	
	    // Get default left click handler for when a feature is not picked on left click
	    var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	    // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
	    // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
	    if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
	        // Silhouettes are supported
	        var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	        silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
	        silhouetteBlue.uniforms.length = 0.01;
	        silhouetteBlue.selected = [];
	
	        var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
	        silhouetteGreen.uniforms.color = Cesium.Color.LIME;
	        silhouetteGreen.uniforms.length = 0.01;
	        silhouetteGreen.selected = [];
	
	        viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen]));
	
	        // Silhouette a feature blue on hover.
	        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
	            // If a feature was previously highlighted, undo the highlight
	            silhouetteBlue.selected = [];
	
	            // Pick a new feature
	            var pickedFeature = viewer.scene.pick(movement.endPosition);
	            var cesium_map_left = $('.cesium_map_left').width();
	            if (!Cesium.defined(pickedFeature)) {
	                nameOverlay.textContent='';
	                nameOverlay.style.display = 'none';
	                return;
	            }
	            if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
	                // A feature was picked, so show it's overlay content
	                if (pickedFeature.hasProperty('road_name')) {
	                    nameOverlay.style.display = 'block';
	                    nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
	                    nameOverlay.style.left = movement.endPosition.x + cesium_map_left + 'px';
	                    var name = pickedFeature.getProperty('road_name');
	                    if (!Cesium.defined(name)) {
	                        name = pickedFeature.getProperty('id');
	                    }
	                    var type = pickedFeature.getProperty('type');
	                    var type_name = '公里桩：';
	                    if (type == 16) {
	                        type_name = '百米桩：';
	                    }
	                    var detail = '';
	                    if (type == 15) {
	                        detail = pickedFeature.getProperty('kilometre') + '公里';
	                    } else if (type == 16) {
	                        detail = pickedFeature.getProperty('kilometre') + "." + pickedFeature.getProperty('hectometre') + '公里';
	                    }
	                    nameOverlay.textContent = type_name + name + "-" + detail;
	
	                    // Highlight the feature if it's not already selected.
	                    if (pickedFeature !== selected.feature) {
	                        silhouetteBlue.selected = [pickedFeature];
	                    }
	                }
	            }
	        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	        // Silhouette a feature on selection and show metadata in the InfoBox.
	        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
	            // If a feature was previously selected, undo the highlight
	            silhouetteGreen.selected = [];
	
	            // Pick a new feature
	            var pickedFeature = viewer.scene.pick(movement.position);
	            if (!Cesium.defined(pickedFeature)) {
	                clickHandler(movement);
	                return;
	            }
	            if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
	                // A feature was picked, so show it's overlay content
	                if (pickedFeature.hasProperty('road_name')) {
	                    // Select the feature if it's not already selected
	                    if (silhouetteGreen.selected[0] === pickedFeature) {
	                        return;
	                    }
	
	                    // Save the selected feature's original color
	                    var highlightedFeature = silhouetteBlue.selected[0];
	                    if (pickedFeature === highlightedFeature) {
	                        silhouetteBlue.selected = [];
	                    }
	
	                    // Highlight newly selected feature
	                    silhouetteGreen.selected = [pickedFeature];
	
	                    // Set feature infobox description
	                    var featureName = pickedFeature.getProperty('road_name');
	                    selectedEntity.name = featureName;
	                    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
	                    viewer.selectedEntity = selectedEntity;
	                    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
	                        '<tr><th>路名</th><td>' + pickedFeature.getProperty('road_name') + '</td></tr>' +
	                        '<tr><th>公里数</th><td>' + pickedFeature.getProperty('kilometre') + '</td></tr>' +
	                        '<tr><th>百米数</th><td>' + pickedFeature.getProperty('hectometre') + '</td></tr>' +
	                        '</tbody></table>';
	                    //alert(selectedEntity.description);
	                }
	            }
	        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			/*绑定-监听鼠标右键*/
	        viewer.screenSpaceEventHandler.setInputAction(function onRightClick(movement) {
		    	_this.cesium_popup_mark(movement);
		    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	    } else {
	        // Silhouettes are not supported. Instead, change the feature color.
	
	        // Information about the currently highlighted feature
	        var highlighted = {
	            feature: undefined,
	            originalColor: new Cesium.Color()
	        };
	
	        // Color a feature yellow on hover.
	        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
	            // If a feature was previously highlighted, undo the highlight
	            if (Cesium.defined(highlighted.feature)) {
	                highlighted.feature.color = highlighted.originalColor;
	                highlighted.feature = undefined;
	            }
	            // Pick a new feature
	            var pickedFeature = viewer.scene.pick(movement.endPosition);
	            var cesium_map_left = $('.cesium_map_left').width();
	            if (!Cesium.defined(pickedFeature)) {
	                nameOverlay.style.display = 'none';
	                return;
	            }
	            // A feature was picked, so show it's overlay content
	            nameOverlay.style.display = 'block';
	            nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
	            nameOverlay.style.left = movement.endPosition.x + cesium_map_left + 'px';
	            var name = pickedFeature.getProperty('name');
	            if (!Cesium.defined(name)) {
	                name = pickedFeature.getProperty('id');
	            }
	            nameOverlay.textContent = name;
	            // Highlight the feature if it's not already selected.
	            if (pickedFeature !== selected.feature) {
	                highlighted.feature = pickedFeature;
	                Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
	                pickedFeature.color = Cesium.Color.YELLOW;
	            }
	        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	        // Color a feature on selection and show metadata in the InfoBox.
	        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
	            // If a feature was previously selected, undo the highlight
	            if (Cesium.defined(selected.feature)) {
	                selected.feature.color = selected.originalColor;
	                selected.feature = undefined;
	            }
	            // Pick a new feature
	            var pickedFeature = viewer.scene.pick(movement.position);
	            if (!Cesium.defined(pickedFeature)) {
	                clickHandler(movement);
	                return;
	            }
	            // Select the feature if it's not already selected
	            if (selected.feature === pickedFeature) {
	                return;
	            }
	            selected.feature = pickedFeature;
	            // Save the selected feature's original color
	            if (pickedFeature === highlighted.feature) {
	                Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
	                highlighted.feature = undefined;
	            } else {
	                Cesium.Color.clone(pickedFeature.color, selected.originalColor);
	            }
	            // Highlight newly selected feature
	            pickedFeature.color = Cesium.Color.LIME;
	            // Set feature infobox description
	            var featureName = pickedFeature.getProperty('name');
	            selectedEntity.name = featureName;
	            selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
	            viewer.selectedEntity = selectedEntity;
	            selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
	                '<tr><th>BIN</th><td>' + pickedFeature.getProperty('BIN') + '</td></tr>' +
	                '<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
	                '<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
	                '<tr><th>Longitude</th><td>' + pickedFeature.getProperty('longitude') + '</td></tr>' +
	                '<tr><th>Latitude</th><td>' + pickedFeature.getProperty('latitude') + '</td></tr>' +
	                '<tr><th>Height</th><td>' + pickedFeature.getProperty('height') + '</td></tr>' +
	                '<tr><th>Terrain Height (Ellipsoid)</th><td>' + pickedFeature.getProperty('TerrainHeight') + '</td></tr>' +
	                '</tbody></table>';
	        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			/*绑定-监听鼠标右键*/
	        viewer.screenSpaceEventHandler.setInputAction(function onRightClick(movement) {
		    	_this.cesium_popup_mark(movement);
		    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	    }
//	    this.postRender();
	},
	
	/*执行postrender事件,修改点坐标*/
	postRender: function(){
	   viewer.scene.postRender.addEventListener(function() {
	   		if(disease_cesium.camera_zoom > 17){
	   			var entitys = disease_player.current_disease || {};
		    	for(var id in entitys){
		    		var _entity = entitys[id],
		    			_show = _entity.show,
		    			nodes = _entity._nodes,
		    			new_nodes = [],
		    			points_center = $.getPointsCenter(nodes, true);
		    		
		    		for(var i=0; i<nodes.length; i++){
		    			var positions = Cesium.Cartesian3.fromDegrees(nodes[i][0], nodes[i][1], nodes[i][2]);
//		    				new_positions = viewer.scene.clampToHeight(positions, [_entity]);
		       			console.log(positions)
		    		}
		    		
		    	}
	   		}
	   });
	}
	
	
	

}



/*聚类功能根据ZOOM等级变化*/

var disease_group = {
	
	point_group: function(){
		var zoom = viewer.camera.mathZoom;
		if(!disease_list.data_point || !disease_list.data_point.length){
			return;
		}
		var entities = viewer.entities;
		this.entity_hide();
		if(disease_player.position_icon){
			return;
		}
		if(zoom > 17){
			for(var i=0; i<disease_list.data_point.length; i++){
				disease_list.data_point[i].show = true;
			}
		}else if(15 < zoom && zoom < 18){
//		}else if(14 < zoom && zoom < 18){
			for(var mp_code in disease_list.data_groups.mp_code){
				var _entity = entities.getById(mp_code);
				if(_entity){
					_entity.show = true;
				}
			}
		}else if(11 < zoom && zoom < 16){
//		}else if(11 < zoom && zoom < 15){
			for(var link_code in disease_list.data_groups.link_code){
				var _entity = entities.getById(link_code);
				if(_entity){
					_entity.show = true;
				}
			}
		}else{
			for(var road_code in disease_list.data_groups.road_code){
				var _entity = entities.getById(road_code);
				if(_entity){
					_entity.show = true;
				}
			}
		}
		$.cesium_refresh();
	},

	/*隐藏entity覆盖物*/
	entity_hide: function(type = false){
		var entities = viewer.entities;
		for(var i=0; i<entities.values.length; i++){
			if(!entities.values[i]._position_type && !entities.values[i]._mark_type){
				entities.values[i].show = type;
			}
		}
		$.cesium_refresh();
	},	

	/*聚类功能初始化*/
	list_group: function(){
		disease_list.data_groups.road_code = _.groupBy(disease_list.catchList, function (n) {
			return n.properties.LINK_CODE; 
		});
		disease_list.data_groups.link_code = _.groupBy(disease_list.catchList, function (n) {
			var new_code = n.properties.mp_codes_0 + '_' + n.properties.mp_codes_1;
			return new_code;
		});
		disease_list.data_groups.mp_code = _.groupBy(disease_list.catchList, function (n) {
			var new_code = n.properties.mp_codes_0 + '_' + n.properties.mp_codes_1 + '_' + n.properties.mp_codes_2;
			return new_code;
		});
//		window.data_groups = disease_list.data_groups;
		
		/*按道路聚类*/
		var _height = 1;
		for(var road_code in disease_list.data_groups.road_code){
			_height += 30;
			var links = disease_list.data_groups.road_code[road_code],
				length = links.length.toString().length,
				icon_url = './Apps/Dist/Img/label_background_'+ length +'.png',
				width = 36 + (length - 1) * 9;
			
			var center = $.getNearPoint(links);
			$.add_group_billboard({
				'positions': center,
				'mp_code': road_code,
				'properties': links,
				'icon_url': icon_url,
				'icon_length': length,
				'height': _height,
				'width': width,
				'links': links
			})
		}
		
		/*按公里桩聚类*/
		var _heights = {};
		for(var link_code in disease_list.data_groups.link_code){
			
			var roadcode = link_code.split('_')[0] || '';
			if(_heights[roadcode]){
				_heights[roadcode] += 3;
			}else{
				_heights[roadcode] = 1;
			}
			
			var links = disease_list.data_groups.link_code[link_code],
				length = links.length.toString().length,
				icon_url = './Apps/Dist/Img/label_background_'+ length +'.png',
				width = 36 + (length - 1) * 9;
			
			var center = $.getNearPoint(links);
			$.add_group_billboard({
				'positions': center,
				'mp_code': link_code,
				'properties': links,
				'icon_url': icon_url,
				'icon_length': length,
				'height': _heights[roadcode],
				'width': width,
				'links': links
			})
		}
		
		/*按百米桩聚类*/
		_heights = {};
		for(var mp_code in disease_list.data_groups.mp_code){
			
			var mapcode = mp_code.split('_')[1] || '',
				linkcode = mp_code.split('_')[0] || '',
				height_code = linkcode + '_' + mapcode;
			if(_heights[height_code]){
				_heights[height_code] += 3;
			}else{
				_heights[height_code] = 1;
			}
			
			var codes = disease_list.data_groups.mp_code[mp_code],
				length = codes.length.toString().length,
				icon_url = './Apps/Dist/Img/label_background_'+ length +'.png',
				width = 36 + (length - 1) * 9;
			
			var center = $.getNearPoint(codes);
			$.add_group_billboard({
				'positions': center,
				'mp_code': mp_code,
				'properties': codes,
				'icon_url': icon_url,
				'icon_length': length,
				'height': _heights[height_code],
				'width': width,
				'links': codes
			})
		}
		this.point_group();
	}

	
}



/**
 * 病害信息详情界面
 */

var disease_info = {

	current_info: null,	//当前所打开病害的详情信息
	info_ways: null,		//进入详情时，地图上显示的病害
	
	/*进入详情页时--不限于各种方式*/
	come_to_info: function(index, type=false, junge=false){
		disease_player.recog_result = '1';
		this.info_init(index, type, junge);
		
		let display = $('.disease_info').css('display');
		if(display == 'none'){
			$('.disease_info').fadeIn(100, function(){
				disease_cesium.listen_cesium_body('disease_info', true);
	    		disease_player.request_track(true);
			});
		}else{
			disease_player.request_track(true);
		}
		
	},
	
	info_init: function(index, type=false, junge=false) {

//		let ratio_width = 620 / 2448,
//			ratio_height = ratio_width * 2048,
//			_height = Number(ratio_height);
	
//		$('.disease_info .video_image').css('height', _height);
//		$('.disease_player_body .player_image #canvas_three').css('height', _height);
		
		this.current_info = {};
		if( disease_list.catchList[index] ){
			this.current_info = disease_list.catchList[index];
		}
		
		disease_list.list_toggle(type, junge);
		disease_leaflet.visua_up_map_init();
		/*this.polygon_info();
		disease_list.list_toggle(type, junge);*/
		var token = $.getCookie('token') || '';
		if(!token){
			$.errorView('token不存在，请登录！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
		
		let properties = this.current_info.properties || {},
			info_view_type_2 = properties.mp_codes_0 + ' ' + properties.mp_codes_1 + properties.mp_codes_2 + ' ' + properties.cn_up_down,
			lane_no = properties.LANE_NO || '',
			track_point_id = properties.T_POINT_ID,
			this_info = Disease.TYPE_LIST.PAVEMENT_DISTRESS.TYPE[properties.TYPE] || {'INFO': []},
			
			_area = properties.AREA || '0.0',
			switch_area = Number(_area),
			info_view_result = [],
			track_image_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
		
		console.log(properties);
		this.info_statistics(properties);
    	disease_player.player_start_init();
		
		/*进入详情页时,初始化展示信息*/
		$('.pdds_id').html(properties.ID);
		$('.pdds_types').html(properties._cn_type);
		$('.view_level').html(properties._cn_subtype);
		$('.info_view_type_2').html(info_view_type_2);
		$('.info_view_type_3').html(properties.update_time);
		
		/*整合不同病害所需要展示的详情信息*/
		for(var i=0; i<this_info.INFO.length; i++){
			var _id = this_info.INFO[i].ID,
				_val = this_info.INFO[i].VAL,
				_type = this_info.INFO[i].TYPE,
				_length = this_info.INFO[i].LENGTH,
				_name = this_info.INFO[i].NAME,
				_newval = properties[_id] || '0.0',
				switch_val = Number(_newval);
			
			if(_type){
				switch_val = switch_val * 1000;
			}
			if(_length){
				switch_val = switch_val.toFixed(_length);
				switch_val = Number(switch_val);
			}
			
			var _text = _name + ': ' + switch_val + _val;
			info_view_result.push(_text)
		}
		switch_area = '损坏面积: ' + Number(switch_area.toFixed(2)) + '平方米';
		info_view_result.push(switch_area);
		
//		$.getImageToken(
//			$('.disease_info .info_image img'),
//			track_image_url
//		);
		
		let param_html = `
	        ${info_view_result.map(f => `
				<span>${f}</span>
	        `).join('')}
		`;
		$('.info_view .info_view_param').html(param_html);
		
		$('.menu_list ul li').removeClass('active');
		this.pd_label_types();
	},
	
	/*当前病害百米桩统计*/
	info_statistics: function(properties){
		$('.info_view_statistics .statistics_list').html('');
		let _url = config_url.pdds + 'data/stat/pd/countGroup',
			map_code_param = {'groupKeys': ['TYPE'],'ops': [{'k': 'MP_CODE','v': properties.MP_CODE,'op': 'eq'}]};
		
		$.postAjax({
			url: _url,
			data: map_code_param,
			callback: function(data){
				let type_arr = data.result || [],
					_texts = [];
				for(let i=0; i<type_arr.length; i++){
					let _type = type_arr[i].TYPE,
						_count = type_arr[i].count,
						_info = Disease.TYPE_LIST.PAVEMENT_DISTRESS.TYPE[_type] || {},
						_text = (_info.NAME || _type) + ' ' + _count + '例';
					
					_texts.push(_text);
				}
				let code_html = `
			        ${_texts.map(f => `
						<p>${f}</p>
			        `).join('')}
				`;
				$('.info_view_statistics .statistics_list').html(code_html);
			}
		})
	},
	
	/*详情打开时,显示当前病害的范围在地图上*/
	polygon_info: function(type=false){
		var geom = this.current_info.properties.locs,
			id = this.current_info.properties.T_POINT_ID;
		if(this.info_ways){
			viewer.entities.remove(this.info_ways);
		}
		
		/*地图显示*/
		if(!type){
			this.info_ways = $.add_polygon({
				'type': 'position',
				'result': {
					'properties': {
						'ID': ('polygon_'+id),
						'GEOM': geom
					}
				}
			})
		}
		$.cesium_refresh();
	},
	
	/*获取当前病害是否被收藏*/
	pd_label_types: function(){
		$('.menu_manage a.iconshenglvehao').removeClass('active');
		var pd_id = this.current_info.properties.ID,
			pd_url = config_url.pdds + "data/pd_label/query",
			pd_body = {
			  	"ops": [
				    {
				      	"k": "PD_ID",
				      	"type": "string",
				      	"v": pd_id,
				      	"op": "eq"
				    }
			  	]
			};
		$.postAjax({
			url: pd_url,
			data: pd_body,
			callback: function(data){
				let features = (data.result && data.result.data) ? data.result.data.features.length : 0
				if(features){
					$('.menu_list .menu_list_child .menu_collect').addClass('active');
					$('.menu_manage a.iconshenglvehao').addClass('active');
				}
			}
		})
	}

}
/**
 * 主界面初始化
 */
var disease_init = {
	
	play_image_type: 'visua_up_map',		//正射图、采集图、点云图，当前播放类型
	
	models_init: function() {
		
		var _this = this;
		
		/*用户操作界面展开*/
		$('.button_other').mouseover(function(){
			$('.user_install').css('display', 'block');
		})
		$('.button_other').mouseout(function(){
			$('.user_install').css('display', 'none');
		})
		/*点击退出按钮退出当前用户*/
		$('.button_other .user_install .user_handle').click(function(){
			disease_user.userSignOut();
		})
		/*点击设置按钮设置当前用户城市权限*/
		$('.button_other .user_install .user_config').click(function(){
			let _url = './user.html';
			window.open(_url, '_blank');
		})
		/*用户城市权限界面展开*/
		$('.user_citys').mouseover(function(){
			$('.user_citys .citys_list').css('display', 'block');
		})
		$('.user_citys').mouseout(function(){
			$('.user_citys .citys_list').css('display', 'none');
		})
		/*点击切换城市权限功能*/
		$('.user_citys .citys_list li').click(function(e){
			let adcode = e.target.getAttribute('data-adcode'),
				cityname = e.target.innerText,
				newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, '');
			$('.user_citys .citys_list li').removeClass('active');
			$('.user_citys .citys_list').css('display', 'none');
			$('.user_citys .citys_name').html(newname);
			e.target.className = 'active';
			disease_user.user_city_change(adcode);
		})
		/*点击筛选按钮-显示隐藏筛选界面*/
		$('.disease_list_screen a.screen_link').click(function(){
			let type = $('.screen_model').css('display');
			_this.screen_model_hide(type);
			disease_screen.screen_icon(type);
		})
		/*点击全部清空标签-将所有筛选条件清空*/
	    $('.screen_model').on('click', '.screen_submit label a', function () {
			var checkboxs = $('.screen_model_param input[type="checkbox"]');
			for(var i=0; i<checkboxs.length; i++){
				checkboxs[i].checked = false;
			}
			disease_screen.subtype_change();
	    });
		/*点击应用按钮-根据筛选条件重新查询病害列表*/
	    $('.screen_model').on('click', '.screen_submit button', function () {
			_this.screen_model_hide('block');
			disease_screen.screen_search();
			disease_screen.screen_icon();
	    });
		/*点击病害信息中-文字按钮-显示隐藏轮播图界面*/
	    $('.disease_info').on('click', '.info_view_button button', function () {
	    	$.errorView('功能未开发');
	    	return;
			$('.disease_swiper').toggle(200);
	    });
		$('.disease_swiper .model_backdrop').click(function(){
			$('.disease_swiper').toggle(200);
		})
		/*点击列表文字-显示隐藏详细信息界面*/
	    $('.disease_list .disease_list_body').on('click', '.disease_list_li', function () {
	    	/*
			disease_screen.screen_icon();
			$('.screen_model').fadeOut(100,function(){
				disease_cesium.listen_cesium_body('disease_info', true);
			});
			*/
			var index = this.getAttribute('data-index');
			disease_info.come_to_info(index);
	    });
	    $('.disease_info').on('click', 'ul.info_tab_list li', function (e) {
	    	let data_type = e.target.getAttribute('data-type');
	    	_this.player_mode_init(data_type);
			disease_init.image_type_go();
	    });
	    /*切换图层--:正射图,采集图,点云图切换时*/
	    /*$('.disease_info').on('click', '.info_header a.info_header_close', function () {
			$('.disease_info').fadeOut(100);
			disease_list.position_group_change();
			disease_cesium.change_last_point();
			disease_info.polygon_info(true);
			disease_cesium.listen_cesium_body('disease_info', false);
			
	    	_this.player_mode_init('visua_up_map');
	    });*/
		/*点击病害信息中-文字按钮-显示隐藏视频界面*/
	    /*$('.disease_info').on('click', '.info_image', function () {
	    	disease_info.polygon_info(true);
	    	disease_player.player_start_init();
			$('.disease_player').fadeIn(100, function(){
	    		disease_player.request_track(true);
				disease_cesium.listen_cesium_body('disease_player', true);
			});
	    });*/
		/*业务名称显示列表*/
	    $('.data_header .business_name').mouseover(function(){
	    	var client = this.getBoundingClientRect(),
	    		left = client.left - 24,
	    		top = client.top + client.height - 14;
	    	
	    	$('.data_header .business_list').css({
	    		top: top+"px",
	    		left: left+"px"
	    	})
	    	$('.data_header .business_list').css('display', 'block');
	    	$('.data_header .business_list a span').attr('class', 'iconfont iconshangsanjiao');
	   	})
	    $('.data_header .business_name').mouseout(function(){
	    	$('.data_header .business_list').css('display', 'none');
	    	$('.data_header .business_list a span').attr('class', 'iconfont iconxiasanjiao');
	   	})
		/*点击按钮-关闭病害列表*/
	    $('.open_disease_list').on('click', 'a.left_arrow', function () {
			$('.open_disease_list a').attr('class', 'right_arrow');
				disease_cesium.listen_cesium_body('disease_list', false);
			$(".disease_list").animate({
				'left': '-339px'
			},300);
	   	});
		/*点击按钮-打开病害列表*/
	    $('.open_disease_list').on('click', 'a.right_arrow', function () {
			$('.open_disease_list a').attr('class', 'left_arrow');
			$(".disease_list").animate({
				'left': '0px'
			},300,'swing',function(){
				disease_cesium.listen_cesium_body('disease_list', true);
			});
	   	});
		/*病害列表切换优先级显示初始化*/
		$('.disease_list_sort ul li a').click(function(){
			var hasClass = $(this.parentNode).hasClass('active');
			if(!hasClass){
				$('.disease_list_sort ul li').removeClass('active');
				$(this.parentNode).addClass('active');
				disease_screen.screen_search();
			}
			/*var _type = this.parentNode.getAttribute('type');
			Disease.list_init();*/
		})
		/*切换地图模式--数据中心*/
		$('.search_param ul li').click(function(){
			$('.search_param ul li').removeClass('active');
			$(this).addClass('active');
			disease_centre.centre_init(this.type);
			disease_player.player_icon_change(true);
		})
		
		$('.disease_list .disease_list_body').scroll(function(e) {
		    var scrollHeight = $('.disease_list .disease_list_body')[0].scrollHeight,
		    	scrollTop = $('.disease_list .disease_list_body')[0].scrollTop,
		    	clientHeight = $('.disease_list .disease_list_body')[0].clientHeight,
		    	_height =  scrollHeight - scrollTop - clientHeight;
		
		    if(scrollTop && _height <= 5) {
		        //滚动条滚到最底部
		        disease_list.chunk_list_change();
		    }
		});
		/*用户进行反馈时,点击类型选择*/
		$(".select_value input").on("click",function(){
			$('.select_option').toggle();
			$('.select_value').toggleClass("active");
		});
		$(".select_option li").click(function(event){
			let val = event.target.getAttribute('data-name'),
				text = event.target.innerText,
				hide_type = (val == '1') ? 'block' : 'none',
				hide_class = (val == '1') ? '' : true;
			
			$('.select_option').toggle();
			$('.select_value input').val(text);
			$('.select_value input').attr('name', val);
			$('.select_value').toggleClass("active");
			
			$('.feedback_model>div>p').css("display", hide_type);
			
			$('.feedback_model div textarea').removeClass('height');
			if(val != '1'){
				$('.feedback_model div textarea').addClass('height');
			}
			
		});
	    $('.screen_model').on('click', '.screen_model_param input[type="checkbox"]', function () {
	    	var type = this.getAttribute('name');
	    	if(type == 'TYPE'){
	    		disease_screen.subtype_change();
	    	}
	    });
		/*点击反馈提交*/
		$(".feedback_submit").click(function(event){
			_this.feedback_submit();
		});
		/*点击遮罩模版*/
		$("#mask_model").click(function(event){
			SlideList.menu_feedbacks();
		});
//		Disease.list_init();
		disease_screen.screen_init();
		disease_centre.centre_search_change();
		disease_screen.screen_search(true);
		disease_swiper.swiper_init();
//		disease_info.info_init();
		disease_player.player_init();
	},
	
	screen_model_hide: function(type){
		if(type == 'none'){
			$('.screen_model').css('display', 'block');
			$(".screen_model").animate({
				'left': 344
			},300,'swing',function(){
				$('.screen_model').css('z-index', '112');
				disease_cesium.listen_cesium_body('screen_model', true);
			});
		}else{
			$('.screen_model').css('z-index', '110');
			$(".screen_model").animate({
				'left': 0
			},300,'swing',function(){
				$('.screen_model').css('display', 'none');
			});
			disease_cesium.listen_cesium_body('screen_model', false);
		}
	},
	
	/*正射图-采集图-点云图变化*/
	player_mode_init: function(type){
		
		let new_class = 'player_video new_' + type;
		$('.player_video').attr('class', new_class);
		
		this.play_image_type = type;
    	$('.disease_info ul.info_tab_list li').removeClass('active');
    	$('.disease_info ul.info_tab_list li.'+type).addClass('active');
    	$('.video_image').fadeOut(50);
    	$('#'+type).fadeIn(50);
	},
	
	/*根据类型的不同去执行不同事件*/
	image_type_go: function(){
		$('.result_list').hide();
		if(this.play_image_type == 'visua_up_map'){
			$('.result_list').show();
			disease_leaflet.road_player();
			leafletMap.invalidateSize(true);
		}else if(this.play_image_type == 'collect_map'){
			disease_player.player_projection();
		}
	},
	
	/*反馈功能提交*/
	feedback_submit: function(){
		let type = $('.select_value input').attr('name') || '',
			desc = $('textarea.desc').val() || '';
		if(desc.length > 200){
			$.errorView('描述信息过长！');
			return;
		}
		let json = {
				'pdId': disease_info.current_info.properties.ID,
				'message': desc,
				'type': type
			},
			url = config_url.pdds+'feedback/save?pdId='+json.pdId+'&message='+json.message+'&type='+json.type;
		$.postAjax({
			url: url,
			data: json,
			callback: function(data){
				if(data.code != '0'){
					$.errorView(data.message);
					return;
				}
				$.errorView(data.message, true);
				SlideList.menu_feedbacks();
			}
		})
	}
}

/*病害-leaflet地图插件*/
var disease_leaflet = {
	
	polygons: {},
	
	last_polygon: null,
	
	/*正射图-初始化*/
	visua_up_map_init: function(){
		let click_dom = { 'DIV': true, 'path': true },
			_this = this,
			_view = disease_info.current_info,
			mainshoot = config_url.mainshoot + '&key=' + _view.properties.TRACK_ID,
			_center = _view.center_xy;
		
		if(window.leafletMap){
			window.leafletMap.setView([_center[1], _center[0]]);
			leafletMap.options.layers[0].setUrl(mainshoot);
			setTimeout(function(){
				leafletMap.invalidateSize(true);
			}, 500)
			return;
		}
		setTimeout(function(){
			let overlayMaps = L.tileLayer(mainshoot, {id: 'mainshoot', maxZoom: 25}),
				overlayMapsNew = { '正射图' : overlayMaps };
			
			window.leafletMap = L.map('visua_up_map', {
				drawControl: true,
				attributionControl: true,
			    center: [_center[1], _center[0]],
			    zoom: 23,
			    minZoom: 23,
			    maxZoom: 25,
			    editable: true,
//			    layers: [_layer]
			    layers: [overlayMaps]
			});
			L.control.layers(overlayMapsNew, {}).addTo(leafletMap);
			
			leafletMap.on('mousemove', function(e) {
				let target = e.originalEvent.target;
				if(_this.last_polygon){
					_this.last_polygon.style.stroke = '#EC3A4E';
				}
				if(target.tagName == 'path'){
					target.style.stroke = '#00F4BF';
					_this.last_polygon = target;
				}
			})
			leafletMap.on('click', function(e) {
				let target = e.originalEvent.target,
					path_id = target._leaflet_id;
				if(path_id && (_this.polygons[path_id] || _this.polygons[path_id] === 0)){
					let path_index = _this.polygons[path_id];
					if(!path_index && path_index != 0){
						$.errorView('获取病害信息失败');
						return;
					}
					disease_player.position_icon && viewer.entities.remove(disease_player.position_icon);
					disease_player.position_icon = null;
		        	disease_info.come_to_info(path_index, true, true);
				}
			})
			
		}, 500)
	},
	
	/*leaflet地图--覆盖物变化*/
	visua_up_map_layer: function(){
		let _view = disease_info.current_info,
			_center = _view.center_xy,
			_loc = _view.locs,
			_layers = leafletMap._layers || {},
			thisRange = [];
		for(let _id in _layers){
			if(_layers[_id]._latlngs && _layers[_id]._latlngs.length){
				_layers[_id].remove();
			}
		}
		for(let i=0; i<_loc.length; i++){
			thisRange.push( [_loc[i][1], _loc[i][0]] );
		}
		L.polygon(thisRange, {color: '#EC3A4E', weight: 2})
			.addTo(window.leafletMap);
		
		window.leafletMap.setView([_center[1], _center[0]]);
	},
	
	/*正射图--反投显示*/
	road_player: function(){
		let _this = this;
		if(!window.leafletMap){
			setTimeout(function(){
				_this.road_player();
			}, 300)
			return;
		}
		
		_this.polygons = {};
		
		let datas = disease_player.entitys,
			_index = disease_player.current_num - 1,
			current_id = disease_info.current_info.properties.ID,
			track = disease_player.track_list[_index];
		
		window.leafletMap.setView([track.y, track.x]);
		
		let _layers = leafletMap._layers;
		for(let _id in _layers){
			if( (_layers[_id]._latlngs && _layers[_id]._latlngs.length) || (_layers[_id]._latlng && _layers[_id]._latlng.lat) ){
				_layers[_id].remove();
			}
		}
		
        let myIcon = L.divIcon({
            html: ""
        });
		for(let id in datas){
			let class_name = datas[id].properties.index;
			let icon_center = datas[id].properties.center_xy;
			let weight = (current_id == id) ? 2 : 1;
			let thisRange = [];
			for(let i=0; i<datas[id].ways._nodes.length; i++){
				thisRange.push( [datas[id].ways._nodes[i][1],datas[id].ways._nodes[i][0]] );
			}
			let polygon = L.polygon(thisRange, {
				'color': '#EC3A4E',
				'weight': weight
			}).addTo(leafletMap);
			
			_this.polygons[polygon._path._leaflet_id] = class_name;
			
			
			myIcon.options.html = datas[id].properties._cn_type;
			myIcon.options.className = (current_id == id) ? 'current_text' : '';
			
        	let mark = L.marker([icon_center[1],icon_center[0]], {
        		'icon': myIcon
        	}).addTo(leafletMap);
			_this.polygons[mark._icon._leaflet_id] = class_name;
			
		}
    	disease_leaflet.disease_region();
	},
	
	/*病害区域功能操作的相关联逻辑处理*/
	disease_region: function(){
		$('.player_video .leaflet-marker-icon').hide();
		$('.player_video svg path').hide();
		if(disease_player.recog_result == '1'){
			$('.player_video .leaflet-marker-icon').show();
		}
		if(disease_player.recog_result == '2'){
			$('.player_video svg path').show();
		}
	}
	
}
/**
 * 左侧病害列表
 */
var disease_list = {
	
	mark_points: null,
	catchList: null,
	data_point: null,
	position_group: null,
	chunk_list: [],
	chunk_list_index: 0,
	page_type: false,
  	page_param: {
	    "pageNo": 1,
	    "pageSize": 2
  	},
	data_groups: {
		'link_code': null,
		'mp_code': null
	},
	
	/*左侧病害列表分页*/
	page_init: function(pages){
		var obj = {
			wrapid: 'page_lists',			//页面显示分页器容器id
			btnCount: 6,
			total: pages.count,				//总条数
			pagesize: pages.pageSize,		//每页显示10条
			currentPage: pages.pageNo,		//当前页
			onPagechange: this.page_change,
		}
		pagination.init(obj);
	},
	
	/*页码发生变化时*/
	page_change: function(page){
		console.log(page)
		disease_list.page_param.pageNo = page;
		disease_list.list_init();
	},
	
	/*病害数据初始化*/
	list_init: function(param=[],junge=false) {
		if(!disease_user.current_adcode){
			return;
		}
		param.push({
	    	'k': 'adcode',
	    	'v': disease_user.current_adcode.adcode,
	    	'op': 'eq'
		})
		var _this = this;
		$('.disease_list_body').html('');
//		var _url = config_url.pdds + 'data/pd/queryPage',
		var _url = config_url.pdds + 'data/pd/query',
			_type = $('.disease_list_sort ul li.active').attr('type'),
			sort = (_type == '1') ? 'UDATE' : 'SUBTYPE',
			data = {
			  	'sort': [
				    {
				      'k': sort,
				      'order': 'desc'
				    }
			  	],
			  	'ops': param,
//			  	'page': this.page_param,
			};
		
		$.cesium_removeEntities();
		_this.mark_label_list();
		
		_this.chunk_list_index = 0;
		$.postAjax({
			url: _url,
			data: data,
			callback: function(data){
				if(data.code != '0'){
					$.errorView(data.message);
					return;
				}
				var _data = data.result.data.features || [],
//					_page = data.result.page || {},
					this_data = [];
				
//				if(!_this.page_type){
//					_this.page_init(_page);
//				}
				_this.data_point = [];
				for(var i=0; i<_data.length; i++){
					var link_code = _data[i].properties.LINK_CODE || '';
					
					if(!link_code){
						continue;
					}
					
					var create_time = _data[i].properties._CREATE_TIME_ || '',
						update_time = _data[i].properties.UDATE || '',
						type = _data[i].properties.TYPE,
						mps_xy = _data[i].properties.CENTROID,
						center = mps_xy.split(','),
						subtype = _data[i].properties.SUBTYPE || '',
						geo_range = _data[i].properties.GEOM || '',
						geo_range_new = $.cesium_range(geo_range),
						link_name = _data[i].properties.LINK_NAME || '',
						mp_code = _data[i].properties.MP_CODE || '',
						mp_codes = mp_code.split('|'),
						mp_codes_0 = mp_codes[0] || '',
						mp_codes_1 = mp_codes[1] ? ('K' + mp_codes[1]) : '',
						mp_codes_2 = mp_codes[2] ? ('+' + mp_codes[2] + '00') : '+000',
						mp_codes_2 = mp_code ? mp_codes_2 : '',
						
						up_down = _data[i].properties.UP_DOWM || '',
						det_time = _data[i].properties.DET_TIME || '',
						
						_coordinates = [Number(center[0]), Number(center[1]), Number(center[2])],
						cn_up_down = Disease.TYPE_LIST.PAVEMENT_DISTRESS.UP_DOWM[up_down] || '',
						cn_type = Disease.TYPE_LIST.PAVEMENT_DISTRESS.TYPE[type] || {},
						cn_subtype = cn_type.SUBTYPE || {},
						_cn_type = cn_type.NAME || '',										/*病害类型*/
						_cn_subtype = cn_subtype[subtype] || '',							/*病害等级*/
						cn_mark = mp_codes_0 +' ' + link_name + ' ' + mp_codes_1 + mp_codes_2,		/*地点*/
						cn_mark = mp_code ? cn_mark : '';
					
					var _entity = $.add_billboard({
						'result': {
							'properties': _data[i].properties,
							'geometry': {
								'coordinates': [_coordinates]
							}
						}
					})
					_this.data_point.push(_entity);
					/*var _entity = $.add_layer({
						'result': _data[i],
//						'showLabel': true,
//						'perPositionHeight': true
					});*/
					var new_code = _data[i].properties.LINK_CODE + '_' + _data[i].properties.MP_CODE;
					var new_data = {
						'create_time': create_time ? $.timeData(create_time,0) : '无',
						'update_time': update_time ? $.timeConvert(update_time,0) : '无',
						'det_time': update_time ? $.timeData(update_time,0) : '无',
						'index': this_data.length,
						'link_code': _data[i].properties.LINK_CODE + '',
						'new_code': new_code,
						'center_xy': _coordinates,
						'subtype': subtype,
						'_cn_type': _cn_type,
						'_cn_subtype': _cn_subtype,
						'cn_up_down': cn_up_down,
						'cn_mark': cn_mark,
						'locs': geo_range_new,
						'mp_codes_0': mp_codes_0,
						'mp_codes_1': mp_codes_1,
						'mp_codes_2': mp_codes_2
					}
					
					for(var item in new_data){
						_data[i].properties[item] = new_data[item];
						_data[i][item] = new_data[item];
					}
					this_data.push(_data[i]);
				}
				_this.catchList = this_data;
				disease_group.list_group();
				_this.dataList(this_data);
				/*公路病害列表--总数赋值*/
				$('.disease_list_num span').html(this_data.length);
				if(junge){
					disease_cesium.add_3d_tile();
				}
			}
		})
	},
	
	/*公路病害列表初始化*/
	dataList: function(data){
		$('.disease_list .disease_list_body')[0].scrollTop = 0;
		var new_html = data.length ? '' : `
				<div class="no_list_child">
					<span>暂无相关数据</span>
				</div>
			`;
		
		$('.disease_list_body').html(new_html);
		
		if(data.length){
//			this.chunk_list = _.chunk(data, 100);
			this.chunk_list = _.chunk(data, 30);
			this.chunk_list_change();
		}
	},

	/*左侧列表加载--100条数据*/
	chunk_list_change: function(){
		var li_length = $('.disease_list_li').length,
//			index_length = this.chunk_list_index * 100;
			index_length = this.chunk_list_index * 30;
		if(li_length != index_length){
			return;
		}
		if(this.chunk_list_index >= this.chunk_list.length){
			return;
		}
		$('.disease_list_foot').css('display', 'block');
		
		var href = 'iconrising' || 'iconRightarrow' || 'iconfalling',			//上-右-下
			_class = 'up',
			true_data = this.chunk_list[this.chunk_list_index] || [],
			_html = `
	        ${true_data.map(f => `
				<div class="disease_list_li" data-index="${f.properties.index}">
					<div class="child_head">
						<!--<span class="child_head_id">${f.properties.ID || 0}</span>-->
						<span class="child_head_name">${f._cn_type}</span>
						<span class="child_head_time">${f.update_time}</span>
					</div>
					<div class="child_body">
						<p class="child_body_place">
							<span class="child_body_name">位置</span>
							<span class="child_body_place_value">${f.cn_mark} ${f.cn_up_down}</span>
						</p>
						<p class="child_body_grade">
							<span class="child_body_name">程度</span>
							<span class="child_body_grade_value grade_${f.subtype}">${f._cn_subtype}</span>
							<!--<span class="iconfont ${_class} ${href}"></span>
							<span class="child_body_grade_time">检测时间：${f.update_time}</span>-->
						</p>
					</div>
				</div>
	        `).join('')}
		`;
		$('.disease_list_body').append(_html);
		
		var doms = $('.child_head_time'),
//			l = this.chunk_list_index * 100;
			l = this.chunk_list_index * 30;
//		for(var i=l; i<100; i++){
		for(var i=l; i<30; i++){
			var width = doms.eq(i).css('width'),
				parse_width = parseInt(width) + 13,
				new_width = 'calc(100% - '+parse_width+'px)';
			
			$('.child_head_name').eq(i).css('max-width',new_width);
		}
		this.chunk_list_index ++;
		$('.disease_list_foot').css('display', 'none');
		
	},

	/*病害列表--病害进行点击时,执行的事件*/
	list_toggle: function(type, junge){
		var data = disease_info.current_info.properties,
			road_code = data.mp_codes_0,
			link_code = data.mp_codes_0 + '_' + data.mp_codes_1,
			mp_code = link_code + '_' + data.mp_codes_2,
			level_one = viewer.entities.getById(data.ID),
			level_two = viewer.entities.getById(mp_code),
			level_three = viewer.entities.getById(link_code),
			level_four = viewer.entities.getById(road_code),
			z_height = viewer.camera.positionCartographic.height,
			_entity = level_four;
		
		if(level_one.show){
			_entity = level_one;
	    	disease_cesium.change_last_point(_entity);
			
		}else if(level_two.show){
			_entity = level_two;
		}else if(level_three.show){
			_entity = level_three;
		}
		
		this.position_group_change(_entity);
		
		var center = _entity ? _entity._center : null,
			bounds = $.getBounds(),
			_x = (bounds.east+bounds.west)/2,
			_y = (bounds.north+bounds.south)/2,
			lng_lat = Cesium.Cartesian3.fromDegrees(center[0], center[1], z_height),
			isPointInBbox = false;
			/*isPointInBbox = $.isPointInRect({
				lng: center[0],
				lat: center[1]
			}, {
				east: bounds.east,
				north: bounds.north,
				south: bounds.south,
				west: _x
			});*/
		
		if((!isPointInBbox && !type) || junge){
			viewer.camera.setView({
			    destination: lng_lat
			})
		}
	},

	/*聚类组的样式变化*/
	position_group_change: function(layer){
		if(this.position_group){
			this.position_group.billboard.image._value = './Apps/Dist/Img/label_background_'+ this.position_group.icon_length +'.png';
			this.position_group = null;
		}
		if(layer && layer.point_length){
			layer.billboard.image._value = './Apps/Dist/Img/label_background_'+ layer.icon_length +'_active.png';
			this.position_group = layer;
		}
	},
	
	/*自定义标记位置的列表*/
	mark_label_list: function(){
		let _this = this,
			_url = config_url.pdds + 'data/position_label/query',
			userinfo = $.getLocalStorage('userInfo') || '{}',
			json_userinfo = JSON.parse(userinfo),
			username = json_userinfo.userName,
			_json = {
			  	"ops": [
				    {
				      	"k": "USER",
				      	"type": "string",
				      	"v": username,
				      	"op": "eq"
				    }
			  	]
			};
		
		$.postAjax({
			url: _url,
			data: _json,
			callback: function(data){
				let features = (data.result && data.result.data) ? data.result.data.features : [];
				_this.mark_points = features;
				for(let i=0; i<features.length; i++){
					let id = features[i].properties.ID,
						has_id = viewer.entities.getById(id);
					if(!has_id){
						$.add_billboard({
							'mark_type': 'position_label',
							'verticalOrigin': true,
							'width': 22,
							'height': 22,
							'result': {
								'properties': features[i].properties,
								'icon_url': './Apps/Dist/Img/mark_label_1.png',
								'geometry': {
									'coordinates': [features[i].geometry.coordinates]
								}
							}
						})
					}
				}
				$.cesium_refresh();
				disease_player.mark_type_init();
			}
		})
		
	}
}


/**
 * 病害巡查影像界面
 */

var disease_player = {
	
	catch_count: 10,
	recog_result: '1',		//病害识别结果的是否显示状态
	current_num: null,		//当前轨迹点
	default_num: null,		//默认初始显示的轨迹点
	track_list: null,		//轨迹点列表
	camera_params: null,	//相机参数
	position_icon: null,	//当前定位点的layer
	current_disease: {},	//当前病害信息
	context: null,			//canvas-绘制初始化
	max_distance: 20,		//当前轨迹点为中心点，半径20M以内的病害数据显示地图、反投
	timing: null,			//计时器
	time_space: 1000,		//计时器的执行间隔
	entitys: null,
	
	player_init: function(type=false) {
		var _this = this;
		window.three_viewer = null;			//threeJS场景初始化
		
		_this.current_num = 1;
		_this.track_list = {};
		/*var ratio_width = 608 / 2448,
			ratio_height = ratio_width * 2048,
			_height = Number(ratio_height);
	
		$('.disease_player_body .player_image').css('height', _height);
		$('.disease_player_body .player_image #canvas_three').css('height', _height);*/
		_this.three_init();
	    
		/*跳帧功能*/
	    /*$('.disease_player').on('keydown', '.player_speed input.player_speed_current', function (e) {
	    	if(e.keyCode == 13){
	    		var _value = e.target.value;
	    		_this.current_num = parseInt(_value);
	    		
				if(current_num < 1){
					_this.current_num = 1;
				}else if(current_num > _this.track_list.length){
					_this.current_num = _this.track_list.length;
				}
	    		_this.player_skip();
	    	}
	    });*/
		/*取消选中--病害识别结果*/
	    $('.disease_player').on('click', '.player_recog .label input', function (e) {
			_this.recog_result = !_this.recog_result;
			this.checked = _this.recog_result;
			_this.player_recog();
	    });
		/*下一帧*/
	    $('.disease_info').on('click', '.player_video button.next_image', function (e) {
	    	_this.view_info_types(true);
	    	_this.next_image();
	    });
		/*上一帧*/
	    $('.disease_info').on('click', '.player_video button.pre_image', function (e) {
	    	_this.view_info_types(true);
	    	_this.pre_image();
	    });
		/*播放-暂停：操作*/
	    $('.disease_info').on('click', '.player_video button.play_image', function () {
	    	_this.view_info_types(true);
	    	_this.player_icon_change();
		})
		/*返回病害操作--即返回初始帧*/
		$('.disease_info').on('click', '.player_video button.player_to_info', function () {
            _this.view_info_types();
            disease_player.player_icon_change(true);
            _this.timing && clearInterval(_this.timing);
            _this.current_num = _this.default_num;
            _this.player_skip();
        })
		/*下载图片操作*/
	    $('.disease_info').on('click', '.player_video button.download_image', function () {
			$.errorView('功能未完善');
		})
	    /*用户反馈操作*/
	    $('.disease_info .info_header .menu_feedback').click(function(){
	    	$('textarea.desc').val('');
	    	SlideList.menu_feedbacks(true);
	   	})
	    /*病害操作列表功能*/
	    $('.disease_info .info_header .menu_manage').mouseover(function(){
	    	$('.disease_info .menu_list').css('display', 'block');
	   	})
	    $('.disease_info .info_header .menu_manage').mouseout(function(){
	    	$('.disease_info .menu_list').css('display', 'none');
	   	})
	    /*用户收藏操作*/
	    $('.disease_info .info_header .menu_collect').click(function(){
	    	let type = $('.menu_collect').hasClass('active');
	    	SlideList.menu_collects(type);
	   	})
	    /*用户标记操作*/
	    $('.disease_info .info_header .menu_mark').click(function(e){
	    	if(!disease_player.track_list.length){
				$.errorView('轨迹正在加载中...');
				return;
	    	}
	    	let _name = $('.disease_info .info_header .menu_mark').attr('name');
	    	if(_name){
	    		disease_cesium.right_point = _name;
	    		SlideList.menu_marks(true, function(){
	    			_this.mark_type_init();
	    		});
	    	}else{
				let _track = _this.track_list[_this.current_num - 1];
				disease_cesium.right_point = _track.map_center;
		    	SlideList.menu_marks();
	    	}
	   	})
	    /*用户标记操作*/
	    $('.cesium_popup_mark a.mark_point').click(function(){
	    	SlideList.menu_marks();
	   	})
	    /*用户删除标记操作*/
	    $('.cesium_popup_mark a.remove_point').click(function(){
	    	SlideList.menu_marks(true);
	   	})
	    /*返回首页：操作按钮,视频界面*/
	    $('.disease_info').on('click', '.info_image a.full_back_index', function () {
	    	SlideList.full_screen(true);
	    	
	    	_this.view_info_types();
	    	_this.timing && clearInterval(_this.timing);
			_this.player_closer();
	    	
			$('.disease_info').fadeOut(100);
			disease_list.position_group_change();
			disease_cesium.change_last_point();
			disease_info.polygon_info(true);
			disease_cesium.listen_cesium_body('disease_info', false);
	    	disease_init.player_mode_init('visua_up_map');
	    });
	    /*关闭:详情,视频界面*/
	    $('.disease_info').on('click', '.info_header a.info_header_close', function () {
	    	_this.view_info_types();
	    	_this.timing && clearInterval(_this.timing);
			_this.player_closer();
	    	
			$('.disease_info').fadeOut(100);
			disease_list.position_group_change();
			disease_cesium.change_last_point();
			disease_info.polygon_info(true);
			disease_cesium.listen_cesium_body('disease_info', false);
	    	disease_init.player_mode_init('visua_up_map');
	    });
		/*倍速列表：操作*/
	    $('.disease_info').on('mouseover', 'button.search_image', function () {
			$(".disease_info .speed_list_group").css('display', 'block');
		})
	    $('.disease_info').on('mouseleave', 'div.speed_list', function () {
			$(".disease_info .speed_list_group").css('display', 'none');
		})
		/*倍速列表：操作*/
	    $('.disease_info').on('mouseover', 'button.pdds_result', function () {
			$(".disease_info .result_list_group").css('display', 'block');
		})
	    $('.disease_info').on('mouseleave', 'div.result_list', function () {
			$(".disease_info .result_list_group").css('display', 'none');
		})
		/*$('button.player_speed').click(function(){
			$(".player_toggle_button .speed_list").toggle();
		})*/
		/*倍速播放：操作*/
	    $('.disease_info').on('click', '.speed_list_group li', function () {
	    	_this.view_info_types(true);
			let _time = this.getAttribute('type'),
				_text = this.innerText;
			
			$(".disease_info .speed_list_group").css('display', 'none');
			$(".speed_list_group li").removeClass('active');
			this.setAttribute('class', 'active');
			_this.time_space = Number(_time);
			$(".play_image span").attr('class', 'iconfont iconzanting');
			$(".search_image").text(_text);
			
			_this.timing && clearInterval(_this.timing);
			_this.timing = setInterval(function(){
				_this.next_image();
			}, _this.time_space);
		})
		/*病害区域切换：操作*/
	    $('.disease_info').on('click', '.result_list_group li', function () {
			let _text = this.innerText;
			_this.recog_result = this.getAttribute('type');
			
			$(".disease_info .result_list_group").css('display', 'none');
			$(".result_list_group li").removeClass('active');
			this.setAttribute('class', 'active');
			$(".pdds_result").text(_text);
			disease_leaflet.disease_region();
		})
		/*复原初始帧：操作*/
	    $('.disease_player').on('click', '.player_restore', function () {
			_this.current_num = _this.default_num;
			_this.update_image();
		})
		/*全屏视频界面：操作*/
	    $('.info_image').on('click', '.full_screen_control', function () {
	    	SlideList.full_screen(true);
		})
		/*历史对比：操作*/
	    $('.info_image').on('click', '.history_control', function () {
			$.errorView('功能开发中···');
		})
		
//		_this.request_track();
	},
	
	/*切换信息展示类型*/
	view_info_types: function(type=false){
		let class_none = type ? 'info_view' : 'info_view_statistics',
			class_block = type ? 'info_view_statistics' : 'info_view',
			btn_display = type ? 'block' : 'none';
		$('.disease_info .'+class_none).css('display', 'none');
		$('.disease_info .'+class_block).css('display', 'block');
		
		$('.disease_info .player_to_info').css('display', btn_display);
		
	},
	
	/*视频界面关闭时执行*/
	player_closer: function(){
		this.position_icon && viewer.entities.remove(this.position_icon);
		this.position_icon = null;
		for(var id in this.current_disease){
			viewer.entities.remove(this.current_disease[id]);
		}
		disease_group.point_group();
	},

	/*视频界面图标等变化*/
	player_icon_change: function(parent=false){
		var _this = this;
		var type = $(".play_image span").hasClass("iconbofang"),
			className = (type && !parent) ? 'iconfont iconzanting' : 'iconfont iconbofang';
		
		$(".play_image span").attr('class', className);
		
		if(type && !parent){
			_this.timing = setInterval(function(){
				_this.next_image();
			}, _this.time_space);
		}else{
			_this.timing && clearInterval(_this.timing);
		}
	},

	/*每次载入视频界面--都为初始化的模版*/
	player_start_init: function(){
		
		if(window.three_viewer && window.three_viewer.scene){
			window.three_viewer.scene.removeAllMeasurements();
	        window.three_viewer.scene.sceneBG.fg_texture_1.image.src = '';
	        window.three_viewer.scene.sceneBG.fg_texture_1.needsUpdate = true;
		}
		
		var det_time = disease_info.current_info.det_time || '';
		var _control = `
				<button class="btn btn-default player_to_info" title="返回病害">
					<span></span>返回病害
				</button>
				<div class="player_toggle_2">
					<button class="btn btn-default pre_image" title="上一张"></button>
					<button class="btn btn-default play_image" title="播放">
						<span class="iconfont iconbofang"></span>
					</button>
					<button class="btn btn-default next_image" title="下一张"></button>
				</div>
				<button class="btn btn-default download_image" title="下载图片"></button>
				<div class="speed_list">
					<ul class="speed_list_group">
						<li class="" type="1000">0.5x</li>
						<li class="active" type="500">1.0x</li>
						<li class="" type="250">2.0x</li>
					</ul>
					<button class="btn btn-default search_image" title="倍速">倍速</button>
				</div>
				<div class="result_list">
					<ul class="result_list_group">
						<li class="active" type="1">病害标签</li>
						<li class="" type="2">病害区域</li>
						<li class="" type="3">隐藏检测结果</li>
					</ul>
					<button class="btn btn-default pdds_result">病害标签</button>
				</div>
		`;
		$('.player_control .player_button').html(_control);
		
		var level = $('.cesium_control .zoom_level a').html(),
			new_level = Number(level);
		if(new_level < 20){
			var height = $.zoomToAltitude(20),
				center = $.getCenterPoint();
	    	viewer.camera.setView({
		        destination: Cesium.Cartesian3.fromDegrees(disease_info.current_info.properties.center_xy[0], disease_info.current_info.properties.center_xy[1], height)
	    	})
		}
	},

	/*进度条初始化插件*/
	RangeSlider: function(obj){
		var _this = this;
	    _this.sliderCfg = {
	        min: obj && !isNaN(parseFloat(obj.min)) ? Number(obj.min) : null, 
	        max: obj && !isNaN(parseFloat(obj.max)) ? Number(obj.max) : null,
	        step: obj && Number(obj.step) ? obj.step : 1,
	        value: obj && Number(obj.value) ? obj.value : 1
	    };
		
	    var $input = $('input.player_speed_range'),
	    	min = _this.sliderCfg.min,
	    	max = _this.sliderCfg.max,
	    	step = _this.sliderCfg.step;
	    
		$(".player_speed_current").attr('max',max);
		$(".player_speed_current").attr('min',min);
		$input.attr('max',max);
		$input.attr('min',min);
		
	    _this.player_skip();
		
	    $input.bind("input", function(e){
	    	_this.current_num = parseInt(this.value);
	    	_this.player_skip();
		});
	},

	/*获取当前病害轨迹点-图像事件*/
	request_track: function(type=false){
		
		var _this = this;
		disease_group.entity_hide();
		
		var trackId = disease_info.current_info.properties.TRACK_ID,
			trackPointId = disease_info.current_info.properties.T_POINT_ID;
		
		var _url = config_url.krs + 'v3/track/get/tracks/byTrackIds?dynamicCal=true&trackIds=' + trackId;
		
		$.getAjax({
			'url': _url,
			'callback': function(data){
				if(data.code != '0'){
					$.errorView(data.message);
					return;
				}
				_this.track_list = data.result[0].pointList;
				_this.camera_params = data.result[0].cameraParams;
				_this.camera_params.cameraHeight = data.result[0].cameraHeight;
				var index = _this.track_list.findIndex(data => data.trackPointId === trackPointId);
				_this.current_num = (index > -1) ? (index+1) : 1;
				_this.default_num = (index > -1) ? (index+1) : 1;
				_this.position_icon && viewer.entities.remove(_this.position_icon);
				_this.position_icon = null;		//每次打开视频时，清空之前定位点
				_this.current_disease = {};		//每次打开视频时，清空之前定位病害
				_this.RangeSlider({
					min: 1,
					max: _this.track_list.length,
					step: 0.1
				});
//				_this.update_image(type);
//				_this.catchPotreeImage(_this.track_list);
				
				var track_data = _this.track_list[_this.current_num - 1];
				_this.position_point_center(track_data,false,type);
			}
		})
		
	},

	/*跳帧事件*/
	player_skip: function(){
		if( 0<this.current_num && this.current_num<=this.track_list.length ){
			var $input = $('input.player_speed_range'),
				_max = $('.player_speed_range').attr('max'),
				_ratio = (this.current_num / _max) * 100;
			
		    $input.attr('value', this.current_num);
		    $input.css( 'background-size', _ratio + '% 100%' );
		    this.update_image();
		}
	},

	/*下一帧事件*/
	next_image: function(){
		if(this.current_num < this.track_list.length){
			this.current_num ++;
			this.player_skip();
		}else{
			$.errorView('当前为最后一帧');
			this.player_icon_change(true);
			return
		}
	},

	/*上一帧事件*/
	pre_image: function(){
		if(this.current_num > 1){
			this.current_num --;
			this.player_skip();
		}else{
			$.errorView('当前为第一帧');
			return
		}
	},

	/*更新图片事件*/
	update_image: function(type){
		var token = $.getCookie('token') || '';
		if(!token){
			$.errorView('token不存在，请登录！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
		
//		this.catchPotreeImage(this.track_list);
		
		$(".player_speed_current").val(this.current_num);
		var _index = this.current_num - 1,
			track_data = this.track_list[_index];
//		$('.player_image svg image')[0].setAttribute('xlink:href', point_url);
//		$('.player_image img')[0].setAttribute('src', point_url);
		/*$.getImageToken(
			$('.player_image img'),
			point_url
		);*/
		
		
		var data_type = $('.player_toggle').attr('data-type');
		if(data_type == '1' && this.current_num != this.default_num){
			$('.player_restore').css('display', 'block');
		}else{
			$('.player_restore').css('display', 'none');
		}
		this.position_icon_change(track_data,type);
		this.mark_type_init();
	},
	
	/*播放视频时--标记位置的按钮状态发生改变*/
	mark_type_init: function(){
		$('.menu_manage .menu_list_child .menu_mark').removeClass('active');
		let _track = this.track_list[this.current_num - 1] || {},
			has_class = $('.menu_manage .menu_collect').hasClass('active'),
			map_center = _track.map_center || [],
			id = '';
		
		if(!map_center.length){
			return;
		}
		for(let i=0; i<disease_list.mark_points.length; i++){
			let coordinate = disease_list.mark_points[i].geometry.coordinates,
				this_id = disease_list.mark_points[i].properties.ID,
				point = viewer.entities.getById(this_id);
			
			if( point && (coordinate[0] == map_center[0]) && (coordinate[1] == map_center[1]) ){
				id = this_id;
			}
		}
		if(!has_class){
			$('.menu_manage a.iconshenglvehao').removeClass('active');
		}
		if(id){
			$('.menu_manage a.iconshenglvehao').addClass('active');
			$('.menu_manage .menu_list_child .menu_mark').addClass('active');
		}
		$('.menu_manage .menu_list_child .menu_mark').attr('name', id);
	},
	
	/*新增定位点--跟随图片移动*/
	position_icon_change: function(data,type=false){
		var center = [data.x, data.y, data.z],
			azimuth = data.azimuth - 90,
			_index = this.current_num - 1,
			this_point = [data.x, data.y, data.z],
			
			last_index = this.current_num - 2,
			last_data = this.track_list[last_index] || null,
			last_point = last_data ? [last_data.x, last_data.y, last_data.z] : null,
			
			next_data = this.track_list[this.current_num] || null,
			next_point = next_data ? [next_data.x, next_data.y, next_data.z] : null,
			
			point_1 = next_point ? this_point : last_point,
			point_2 = next_point ? next_point : this_point,
			icon_url = './Apps/Dist/Img/position.png';
	
		/*根据当前病害中心点,计算出往前6米的坐标最近的trackpoint点*/
//		if(_index > 0){
			var point = iD.util.getLocationPoint(point_2, point_1, 2.3),
				new_data = [];
			center = [point[0], point[1], point[2]];
			/*for(var i=0; i<this.track_list.length; i++){
				if(i < _index){
					new_data.push( this.track_list[i] );
				}
			}
			var distance_data = $.getNearPointList(point, new_data);
			if(distance_data){
				center = [distance_data.x, distance_data.y];
			}*/
//		}
	
		if(!this.position_icon){
			this.position_icon = $.add_billboard({
				'type': 'position',
				'result': {
					'properties': data,
					'icon_url': icon_url,
					'geometry': {
						'coordinates': [ center ]
					}
				}
			})
		}else{
			this.position_icon.position = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]);
		}
		if(next_data){
			var rotation = $.courseAngle(point_1[0], point_1[1], point_2[0], point_2[1]);
			this.position_icon.billboard.rotation =  Cesium.Math.toRadians(rotation);
			
		}
		
		data['map_center'] = center;
		this.position_point_center(data,false,type);
//		this.get_projection(data);
		this.get_distance(data);
	},

	getNorthPointByDistance: function(position, distance) {
	    //以点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
	    var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
	    return Cesium.Matrix4.multiplyByPoint(localToWorld_Matrix, Cesium.Cartesian3.fromElements(0, distance, 0), new Cesium.Cartesian3())
	},

	/*病害识别结果: 隐藏显示*/
	player_recog: function(){
		var _index = this.current_num - 1,
			track_data = this.track_list[_index];
		
		this.get_distance(track_data);
	},

	/*判断当前帧十米以内的病害,并执行反投到视频界面*/
	get_distance: function(trackpoint){
	  	var trackPointId = trackpoint.trackPointId,
			catch_distance = {},
			_position = {
				'lat1': trackpoint.x,
				'lng1': trackpoint.y,
				'lat2': null,
				'lng2': null
			};
		
		for(var i=0; i<disease_list.catchList.length; i++){
			var _locs = disease_list.catchList[i].locs,
				distance = 1000,
				point_distance = 0;
			
			for(var s=0; s<_locs.length; s++){
				_position.lat2 =  _locs[s][0];
				_position.lng2 =  _locs[s][1];
				point_distance = $.disTance(_position);
				
				if(point_distance < distance){
					distance = point_distance;
				}
			}
			
			var id = disease_list.catchList[i].properties.ID,
				locs = $.cesium_range(disease_list.catchList[i].properties.GEOM),
				ways = {'_nodes': locs};
			if(distance < this.max_distance){
				catch_distance[id] = {
					'ways': ways,
					'properties': disease_list.catchList[i].properties
				};
			}
		}
		this.entitys = catch_distance;
		this.get_projection(trackpoint);
		
		disease_init.image_type_go(trackpoint);
	},

	/*实时更新反投*/
	get_projection: function(trackpoint, datas){
		for(var id in this.current_disease){
			if(!this.entitys[id]){
				viewer.entities.remove(this.current_disease[id]);
				delete this.current_disease[id];
			}
		}
		
		for(var id in this.entitys){
	        /*视频反投*/
			var ways = this.entitys[id].ways;
			if(ways._nodes && (ways._nodes.length > 2)){
				var map_ways = null;
				var measurements = [];
				/*地图显示*/
				if(!this.current_disease[id]){
					map_ways = $.add_polygon({
						'type': 'position',
						'result': {
							'properties': {
								'ID': ('polygon_'+id),
								'GEOM': this.entitys[id].properties.locs
							}
						}
					})
					this.current_disease[id] = map_ways;
				}
	        }
		}
		
		$.cesium_refresh();
	},
	
	/*采集图视频--反投显示*/
	player_projection: function(){
		let datas = this.entitys || {};
		this.setImageUrlPotree();
		window.three_viewer.scene.removeAllMeasurements();
		for(var id in this.entitys){
	        /*视频反投*/
			var ways = this.entitys[id].ways;
			if(ways._nodes && (ways._nodes.length > 2)){
				var measurements = [];
				if(this.recog_result){
					measurements.push( this.addPotreePolygon({
						'nodes': ways._nodes,
						'id': id
					}) );
					if(measurements.length){
						window.three_viewer.scene.addMeasurements(measurements);
					}
					measurements.forEach(function(m){
						m._render = true;
					});
					window.three_viewer.isMeasureRender = true;
				}
	        }
		}
		
	},
	
	/*实时定位点在当前视野范围内*/
	position_point_center: function(data,type=false,junge=false){
		var bbox = $.getBounds(),
			point = {
				lng: data.x,
				lat: data.y
			};
		
		if(data.map_center){
            point = {
                lng: data.map_center[0],
                lat: data.map_center[1]
            };
		}
		
		var isPointInBbox = $.isPointInRect(point, bbox),
			z_height = viewer.camera.positionCartographic.height,
			center = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z_height);
		
		if(!junge){
			viewer.camera.setView({  
			    destination: center
			})
		}
		/*if(type){
			viewer.camera.setView({  
			    destination: center
			})
		}else if(!isPointInBbox){
			viewer.camera.setView({  
			    destination: center
			})
		}*/
	},

	three_init: function(){
		var viewer = new Potree.Viewer(document.getElementById("canvas_three"));
		viewer.setBackground(null);
		
		window.three_viewer = viewer;
		window.three_viewer.background = 'gradient';
		viewer.setEDLEnabled(false);
		viewer.setFOV(60);
		viewer.setPointBudget(1 * 1000 * 1000);
		viewer.loadSettingsFromURL();
		viewer.setDescription("");
		viewer.loadGUI(() => {
			viewer.setLanguage('en');
		});
	},

	/*添加面*/
	addPotreePolygon: function(way) {
		let measure = new Potree.Measure({
			color: 'rgb(255, 0, 0)',
			pointColor: 'rgb(255, 0, 0)'
		});
		measure._render = true;
		measure.closed = false;
		measure.showDistances = false;
		measure.showHeight = false;
		measure.showAngles = false;
		measure.name = way.id;
		measure.showArea = true;
		
//		var _height = way.nodes[0][2];
		for (let i = 0; i < way.nodes.length; i++) {
			let node = way.nodes[i],
				node_id = 'node_' + i;
			let pos = lonlatToUTM(node[0], node[1]);
			measure.addMarker(new THREE.Vector3(pos.x, pos.y, node[2]), { id: node_id, update: false });
		}
		measure._entityId = way.id;
		// scene.addMeasurement(measure);
		return measure;
	},

	setImageUrlPotree: function() {
		
		let _index = this.current_num - 1,
			trackpoint = this.track_list[_index],
			track_point_id = trackpoint.trackPointId,
			point_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
		
		var K = projection.cameraParams();
		iD.util.locationPotree(window.three_viewer, trackpoint, K);
	    window.three_viewer.image_url = point_url;
//		window.three_viewer.setBGImageUrl(point_url);
		
		let obj = window.three_viewer;
	    
		$.getImageToken(null, point_url, function(image){
	        if (obj.scene.sceneBG != null && obj.scene.sceneBG.fg_material_1 != null) {
	        	var _src = image;
	        	if(image.response){
	        		_src = URL.createObjectURL(image.response);
	        	}
	        	
	            obj.scene.sceneBG.fg_texture_1.image.src = _src;
	            obj.scene.sceneBG.fg_texture_1.needsUpdate = true;
	        }
		})
		
	    /*let loader = new THREE.ImageLoader();
	    loader.crossOrigin = '';
	    loader.load(
	        point_url,
	        function (image) {
	            if (obj.scene.sceneBG != null && obj.scene.sceneBG.fg_material_1 != null) {
	                obj.scene.sceneBG.fg_texture_1.image = image;
	                obj.scene.sceneBG.fg_texture_1.needsUpdate = true;
	            }
	        },
	        undefined,
	        function () {
	            console.error('An error happened.');
	        }
	    );*/
		
	},
	
	/*缓存巡查影像后续使用的图片*/
	catchPotreeImage: function(alldata){
		var _this = this,
			total_length = alldata.length - 1,
			loadedimages = 0,
			iserr = false,
			init_index = _this.current_num - 1,
			start_index = ((_this.current_num - _this.catch_count) > -1) ? (_this.current_num - _this.catch_count) : 0,
			end_index = ((_this.current_num + _this.catch_count) < total_length) ? (_this.current_num + _this.catch_count) : total_length,
			length = end_index - start_index + 1;
		
        for (var i = start_index; i <= end_index; i++) {
            var img = new Image(),
				_data = alldata[i],
				track_point_id = _data.trackPointId,
				_src = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg&token='+window.token;
            
            img.src = _src;
            if (img.complete) {  		// 如果图片已经存在于浏览器缓存，直接调用回调函数
                imageloadpost();
                continue; 				// 直接返回，不用再处理onload事件
            }
            img.onload = function () {
                imageloadpost();
            }
            img.onerror = function () {
                iserr = true;
                imageloadpost();
            }
        }
        
        function imageloadpost() {
            loadedimages++;
            if (loadedimages == length) {
                if(iserr){
                	console.warn('视频图片未加载全');
                }
            }
        }
		
	}
}

/**
 * 病害筛选界面
 */
var disease_screen = {

	catchParam: null,
	screen_search_param: {},
	
	/*筛选界面初始化*/
	screen_init: function() {
		
		var _this = this,
			link_list = config_url.nantong.link_list[disease_user.current_adcode.adcode] || [];
		
		_this.screen_list = [
			{
				'label': '区域范围',
				'id': 'LINK_CODE',
				'list': link_list
			},
			{
				'label': '病害类型',
				'id': 'TYPE',
				'list': [
					{
						'name': '纵向裂缝',
						'id': '1'
					},
					{
						'name': '横向裂缝',
						'id': '2'
					},
					{
						'name': '龟裂',
						'id': '3',
						'type': true
					},
					{
						'name': '块状裂缝',
						'id': '4'
					},
					{
						'name': '车辙',
						'id': '5'
					},
					{
						'name': '波浪拥包',
						'id': '6'
					},
					{
						'name': '坑槽',
						'id': '7'
					}
				]
			},
			{
				'label': '损坏程度',
				'id': 'SUBTYPE',
				'list': [
					{
						'name': '重度',
						'id': '3'
					},
					{
						'name': '中度 (仅龟裂)',
						'id': '2'
					},
					{
						'name': '轻度',
						'id': '1'
					}
				]
			}
		];
		
		var _html = `
				<div class="screen_model_param">
			        ${_this.screen_list.map(f => `
						<div class="${f.id}">
							<label>${f.label}</label>
							<ul>
								${f.list.map(g => `
									<li class="${f.id}_${g.id}">
										<label class="checkbox_label">
											<input type="checkbox" name="${f.id}" value="${g.id}">
											<b class="checkbox_b"></b>
											<span>${g.name}</span>
										</label>
										<!--<span class="regional_label_num">356例</span>-->
									</li>
			        			`).join('')}
							</ul>
						</div>
			        `).join('')}
				</div>
				<div class="screen_submit">
					<label><a href="#" title="清除筛选">清除筛选</a></label>
					<button class="btn btn-primary btn_screen_submit" title="应用">应用</button>
				</div>
			`;
		$('.screen_model').html(_html);
		var _top = $('.screen_model_param').height() + 58;
//		$('.screen_submit').css('top', _top)
	},

	/*损坏程度根据病害类型的选择变化*/
	subtype_change: function(){
		var input_check = $('.screen_model_param .TYPE input'),
			subtype_2 = 'none',
			subtype = 'none';
		for(var i=0; i<input_check.length; i++){
			var type = input_check[i].name,
				value = input_check[i].value,
				subtype_none = Disease.TYPE_LIST.PAVEMENT_DISTRESS[type][value].SUBTYPE_NONE,
				checked = input_check[i].checked;
			if(checked && subtype_none){
				subtype_2 = 'block';
				subtype = 'block';
			}else if(checked){
				subtype = 'block';
			}
		}
		
		$('.screen_model_param .SUBTYPE').css('display', subtype);
		$('.screen_model_param .SUBTYPE li.SUBTYPE_2').css('display', subtype_2);
		$('.screen_model_param .SUBTYPE li.SUBTYPE_2 input')[0].checked = false;
	},

	/*筛选按钮icon图标--变化*/
	screen_icon: function(type){
		$('.screen_model_param input[type="checkbox"]').prop('checked', false);
		for(var name in this.screen_search_param){
			for(var i=0; i<this.screen_search_param[name].length; i++){
				var values = this.screen_search_param[name][i];
				$('.screen_model_param .'+name+' input[value="'+values+'"]').prop('checked', true);
			}
		}
		
		var checkboxs = $('.screen_model_param input[type="checkbox"]'),
			check_num = 0,
			class_name = '';
		for(var i=0; i<checkboxs.length; i++){
			if(checkboxs[i].checked){
				class_name = 'active';
				check_num ++;
			}
		}
		if(checkboxs.length == check_num){
			class_name = '';
			for(var i=0; i<checkboxs.length; i++){
				checkboxs[i].checked = false;
			}
		}
		if(type == 'none'){
			class_name = 'active';
		}
		$('.disease_list_screen a.screen_link').removeClass('active');
		$('.disease_list_screen a.screen_link').addClass(class_name);
	},

	/*根据筛选项查询病害列表*/
	screen_search: function(type=false){
		var newParam = [],
			subtype = $('.screen_model_param .SUBTYPE').css('display');
		this.screen_search_param = {};
		for(var i=0; i<this.screen_list.length; i++){
			var className = this.screen_list[i].id,
				checkBox = '.' + className + ' input[type=checkbox]',
				doms = $(checkBox);
			if(subtype == 'none' && className == 'SUBTYPE'){
				continue;
			}
//			if( className != 'LINK_NAME' ){
				for(var s=0; s<doms.length; s++){
					var checked = doms[s].checked,
						value = doms[s].value,
						id = doms[s].name;
					if(checked){
						if(!this.screen_search_param[id]){
							this.screen_search_param[id] = [];
						}
						this.screen_search_param[id].push(value);
					}
				}
//			}
		}
		for(var id in this.screen_search_param){
			var _v = this.screen_search_param[id].join(',');
			newParam.push({
				'k': id,
				'v': _v,
				'op': 'in'
			})
		}
		
		disease_list.list_init(newParam,type);
	}
	
}

/**
 * 排序插件
 */
var SlideList = {
	
	Slideicon: function(element,options) {
		this.element = element;
		this.options = {
		    cover:options.cover,
		    index:options.index,
		    callback:options.callback
		};
		this.SlideiconInit();
	},
	
	SlideiconInit: function() {
	    var _this = this;
	    this.element.on('click','li',function(){
	        $(this).nextAll().removeClass('active');
	        $(this).prevAll().removeClass('active');
	        var width = $(this).width();
	        var left = ($(this).index())*width;
	        _this.options.cover.attr("style","left:"+left+"px");
	        $(this).addClass("active");
	        params = $(this).attr('type');
	        _this.options.callback(params);
	    });
	},
	
	/*显示反馈界面*/
	menu_feedbacks: function(type = false){
		if(type){
			$('#mask_model').fadeIn(100);
			$('.feedback_model').fadeIn(101);
		}else{
			$('#mask_model').fadeOut(101);
			$('.feedback_model').fadeOut(100);
		}
	},
	
	/*执行收藏-取消收藏事件*/
	menu_collects: function(type){
		let _url = config_url.pdds + 'data/pd_label/create',
			pd_id = disease_info.current_info.properties.ID,
			userinfo = $.getLocalStorage('userInfo') || '{}',
			json_userinfo = JSON.parse(userinfo),
			username = json_userinfo.userName,
			_json = {
				"type":"FeatureCollection",
				"features":[
					{
						"type":"Feature",
						"properties":{
							"PD_ID": pd_id,
							"USER": username
						}
					}
				]
			},
			_body = {
			  	"ops": [
				    {
				      	"k": "PD_ID",
				      	"type": "string",
				      	"v": pd_id,
				      	"op": "eq"
				    },
				    {
				      	"k": "USER",
				      	"type": "string",
				      	"v": username,
				      	"op": "eq"
				    }
			  	]
			};
		if(type){
			_url = config_url.pdds + 'data/pd_label/delete';
			$.postAjax({
				url: _url,
				data: _body,
				callback: function(data){
					let _type = true;
					let has_class = $('.menu_manage .menu_mark').hasClass('active');
					if(data.code != '0'){
						_type = false;
					}
					$.errorView(data.message, _type);
					$('.menu_list .menu_list_child .menu_collect').removeClass('active');
					
					if(!has_class){
						$('.menu_manage a.iconshenglvehao').removeClass('active');
					}
				}
			})
		}else{
			$.postAjax({
				url: _url,
				data: _json,
				callback: function(data){
					let _type = true;
					if(data.code != '0'){
						_type = false;
					}
					$.errorView(data.message, _type);
					$('.menu_list .menu_list_child .menu_collect').addClass('active');
					$('.menu_manage a.iconshenglvehao').addClass('active');
				}
			})
		}
	},
	
	/*执行标记-取消标记事件*/
	menu_marks: function(id=false, callback=false){
		let _url = config_url.pdds + 'data/position_label/create';
		if(id){
			_url = config_url.pdds + 'data/position_label/deleteById?id=' + disease_cesium.right_point;
			$.getAjax({
				'url': _url,
				'token': true,
				'callback': function(data){
					let _type = true;
					if(data.code != '0'){
						_type = false;
					}else{
						viewer && viewer.entities.removeById(disease_cesium.right_point);
						$.cesium_refresh();
					}
					$.errorView('取消标记'+data.message, _type);
					callback && callback();
				}
			})
		}else{
			let userinfo = $.getLocalStorage('userInfo') || '{}',
				json_userinfo = JSON.parse(userinfo),
				username = json_userinfo.userName,
				_body = {
					"type":"FeatureCollection",
					"features":[
						{
							"type":"Feature",
							"properties":{
								"USER": username
							},
							"geometry":{
								"coordinates": disease_cesium.right_point,
								"type":"Point"
							}
						}
					]
				};
			$.postAjax({
				url: _url,
				data: _body,
				callback: function(data){
					let _type = true;
					if(data.code != '0'){
						_type = false;
					}
					$.errorView('标记'+data.message, _type);
					disease_list.mark_label_list();
				}
			})
		}
		$('#cesium_map_parent .cesium_popup_mark').hide();
	},
	
	/*显示-隐藏：全屏界面*/
	full_screen: function(type = false){
		/*if(type){
			$('.info_image').toggleClass('full_screen');
		}else{
			$('.info_image').removeClass('full_screen');
		}*/
		
		$('.info_image').toggleClass('full_screen');
		let has_class = $('.info_image').hasClass('full_screen'),
			ratio_width = '100%';
		if(has_class){
			let info_height = window.innerHeight - 34,
				ratio_height = info_height / 2048;
			ratio_width = ratio_height * 2448;
		}
		$('.player_video').css('width', ratio_width);
		leafletMap.invalidateSize(true);
		
		/*var ratio_width = 608 / 2448,
			ratio_height = ratio_width * 2048,
			_height = Number(ratio_height);
	
		$('.disease_player_body .player_image').css('height', _height);
		$('.disease_player_body .player_image #canvas_three').css('height', _height);*/
	}
};

/**
 * 图片轮播界面
 */

var disease_swiper = {
	
	swiper_init: function() {
		/*var _html = `
			<div class="slide_item_box">
				<div class="hd">
					<a href="javascript:;" class="prev_img iconfont iconup"></a>
					<a href="javascript:;" class="next_img iconfont iconleftbutton"></a>
				</div>
				<div class="bd slide_item_body">
					<ul class="clearfix">
						<li>
							<img src="./Apps/Dist/swiper/t1.png" alt="" width="402" height="402">
							<p class="new_body_title">2018.04.12</p>
						</li>
						<li>
							<img src="./Apps/Dist/swiper/t2.png" alt="" width="402" height="402">
							<p class="new_body_title">2018.05.12</p>
						</li>
						<li>
							<img src="./Apps/Dist/swiper/t3.png" alt="" width="402" height="402">
							<p class="new_body_title">2018.06.12</p>
						</li>
						<li>
							<img src="./Apps/Dist/swiper/t4.png" alt="" width="402" height="402">
							<p class="new_body_title">2018.07.12</p>
						</li>
						<li>
							<img src="./Apps/Dist/swiper/t5.png" alt="" width="402" height="402">
							<p class="new_body_title">2018.08.12</p>
						</li>
						<li>
							<img src="./Apps/Dist/swiper/t6.png" alt="" width="402" height="402">
							<p class="new_body_title">2018.09.12</p>
						</li>
					</ul>
				</div>
			</div>
		`;
		$(".disease_swiper .slide_item").html(_html);
	    $(".slide_item_box").slide({
	        titCell: ".hd ul",
	        mainCell: ".bd ul",
	        prevCell: '.next_img',
	        nextCell: '.prev_img',
	        autoPage: true,
	        effect: "leftLoop",
	        autoPlay: false,
	        scroll: 2,
	        vis: 3,
	        delayTime: 1000,
	        trigger: "click"
	    })*/
	}
	
}


/**
 * 退出当前用户
 */

var disease_user = {
	
	current_adcode: null,
	
	adcode_param: {},
	
	/*退出用户*/
	userSignOut: function(){
		$.removeCookie('token');
		$.errorView('退出成功');
		setTimeout(function(){
			let _url = './login.html';
			window.open(_url, '_self');
		}, 500)
	},
	
	/*用户城市权限界面初始化*/
	userRoleInit: function(adcodes){
		let cityname = disease_user.current_adcode.name,
			this_center = disease_user.current_adcode.center,
			newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, '');
		
		let list = `
	        ${adcodes.map(a => `
	        	<li data-adcode="${a.adcode}" class="${a.className || ''}">${a.name}</li>
	        `).join('')}
		`;
		$('.user_citys .citys_list').html(list);
		$('.user_citys .citys_name').html(newname);
		if(window.viewer){
			let _center = this_center ? this_center.split(',') : config_url.nantong.center,
				_zoom = config_url.nantong.zoom,
				_height = $.zoomToAltitude(_zoom),
				center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
			
			viewer.camera.setView({  
			    destination: center
			})
		}
	},
	
	userRoleChange: function(){
		let userinfo = $.getLocalStorage('userInfo') || '{}',
			json_userinfo = JSON.parse(userinfo),
			username = json_userinfo.cnName || '佚名',
			userimage = json_userinfo.role || 'beijing',
			imageurl = './Apps/Dist/Img/chengshi@2x/' + userimage + '.png';
		
		$('.user_name').html(username);
		$('.button_list img.user_logo').attr('src', imageurl);
		
	},
	
	/*获取当前用户城市权限列表*/
	userfindRole: function(callback){
		let userinfo = $.getLocalStorage('userInfo') || '{}',
			json_userinfo = JSON.parse(userinfo),
			username = json_userinfo.userName,
			_url = config_url.pdds + 'user/district/permission/findCitiesByUsername?username=' + username;
		$.getAjax({
			'url': _url,
			'token': true,
			'callback': function(data){
				let adcodes = data.result || [];
				if(data.code != '0'){
					$.errorView('获取当前用户城市权限失败');
				}else if(!adcodes.length){
					$.errorView('当前用户无城市权限');
				}else{
					
					for(let s=0; s<adcodes.length; s++){
						let adcode = adcodes[s].adcode;
						if(adcodes[s].isDefault){
							adcodes[s].className = 'active';
							disease_user.current_adcode = adcodes[s];
						}
						disease_user.adcode_param[adcode] = adcodes[s];
					}
					
					disease_user.userRoleInit(adcodes);
					
				}
				callback && callback();
			}
		})
	},
	
	/*切换当前用户城市权限操作*/
	user_city_change: function(adcode){
		disease_user.current_adcode = disease_user.adcode_param[adcode];
		disease_screen.screen_init();
		disease_centre.centre_search_change();
		disease_screen.screen_search(true);
		$('.disease_list_screen a.screen_link').removeClass('active');
		
		let param = disease_user.adcode_param[adcode],
			_center = param.center ? param.center.split(',') : null,
			_zoom = config_url.nantong.zoom,
			_height = $.zoomToAltitude(_zoom);
		if(!_center){
			$.errorView('获取城市中心点失败');
			return;
		}
		let center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
		viewer.camera.setView({  
		    destination: center
		})
	}
	
}



/*视频反投函数*/
/*ways-面
K-相机参数
trackPoint*/

var projection = {

	getShowWays: function(ways, K, trackPoint) {
	    let geometrys = [],
	        context = editor.context,
	        R = trackPoint.tags.R,
	        T = trackPoint.tags.T,
	        width = trackPoint.tags.picW,
	        height = trackPoint.tags.picH;
	    let rect = [
	        [0, 0],
	        [width, height]
	    ];
	    let lassExtend = iD.util.lassExtend,
	        way, nodes, node, coordinate;
	    let coordinates = [],
	        pointMappingNode = {},
	        nodesStroe = [];
	    let _stroeNode;
	    for (let i = 0, len = ways.length; i < len; i++) {
	        way = ways[i];
	
	        nodes = way.nodes;
	        coordinates = [];
	        pointMappingNode = {};
	        nodesStroe = [];
	
	        for (let i = 0, len = nodes.length - 1; i < len; i++) {
	            node = context.entity(nodes[i]);
	            let ePoint = context.entity(nodes[i + 1]);
	            var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
	            coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);
	
	            if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
	                ePoint = context.entity(nodes[nodes.length - 2]);
	                n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
	            }
	
	            if (coordinate[2] > 0) {
	                nodesStroe.push({
	                    'coordinate': [coordinate[0], coordinate[1], node.loc[2]],
	                    nodeId: node.id
	                });
	            } else if (n2[2] > 0) {
	
	                if (n2[1] > height || n2[1] < 0) {
	                    point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[1]);
	                } else {
	                    point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[0]);
	                }
	                
	                nodesStroe.push({
	                    'coordinate': point,
	                    nodeId: node.id
	                });
	            } else {
	                nodesStroe.push({
	                    'coordinate': [],
	                    nodeId: node.id
	                });
	            }
	        }
	        let lastNode = context.entity(_.last(nodes));
	        coordinate = iD.util.trackPointToPicPixe(K, trackPoint, lastNode.loc);
	
	        if (coordinate[2] > 0) {
	            nodesStroe.push({
	                'coordinate': [coordinate[0], coordinate[1], lastNode.loc[2]],
	                nodeId: lastNode.id
	            })
	        }
	
	        let _index = 0;
	        for (let j = 0; j < nodesStroe.length; j++) {
	            _stroeNode = nodesStroe[j];
	            if (_stroeNode.coordinate.length == 0) {
	                if (coordinates.length > 1) {
	                    geometrys.push({
	                        coordinates,
	                        entity: way,
	                        pointMappingNode,
	                        type: 'LineString'
	                    })
	                }
	                pointMappingNode = {};
	                coordinates = [];
	                _index = 0;
	            } else {
	                coordinates.push(_stroeNode.coordinate);
	               pointMappingNode[_index] = _stroeNode.nodeId;
	                _index++;
	            }
	        }
	
	
	        if (coordinates.length > 1) {
	            geometrys.push({
	                coordinates,
	                entity: way,
	                pointMappingNode,
	                type: 'LineString'
	            })
	        }
	    }
	    return geometrys;
	},

	getShowPolygon: function(ways, K, trackPoint) {
	    let geometrys = [],
	        R = trackPoint.R,
	        T = trackPoint.T,
	        width = disease_player.camera_params.imageWidth,
	        height = disease_player.camera_params.imageHeight;
	    let rect = [
	        [0, 0],
//      	[width, height]
	    ];
	    let lassExtend = iD.util.lassExtend,
	        way, nodes, node, coordinate, loc, point;
	    let coordinates = [],
	        pointMappingNode = {},
	        nodesStroe = [];
	    let _stroeNode;
	    
	    nodes = ways._nodes;
	    coordinates = [];
	    pointMappingNode = {};
	    nodesStroe = [];
	    var arr = [];
	
	    for (let i = 0, len = nodes.length-1; i < len; i++) {
	        node = nodes[i];
	       	let ePoint = {
	            	id: 'node_' + i,
	            	loc: nodes[(i + 1) % nodes.length]
	        	};
	        coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node);
	        var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
	       
	        if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
	            ePoint = {
	            	id: 'node_' + (nodes.length - 2),
	            	loc: nodes[nodes.length - 2]
	        	};
	            n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
	        }
	        if (coordinate[2] > 0) {
	            arr.push({
	                index: i,
	                nodeId: 'node_' + i,
	                loc: this.get_test([coordinate[0], coordinate[1]], K),
	                lloc:node,
	                coordinate: [coordinate[0], coordinate[1]]
	            });
	        }else if (n2[2] > 0) {
	            // let loc = ePoint.loc;
	
			    // arr.forEach(d => {
			
			    //     if (d.nodeId == ePoint.id) loc = d.loc;
			
			    // })
	            var p = iD.util.KRt(K, R, T);
	            var x1 = iD.util.UTMProjection(node);
	            var x2 = iD.util.UTMProjection(ePoint.loc);
	            var px1 = matrix.multiply(p, x1);
	            var px2 = matrix.multiply(p, x2);
	            if (n2[1] > height) {
	                point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, ePoint.loc)[1]);
	            } else {
	                point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, ePoint.loc)[0]);
	            }
            	// }
	            arr.push({
	                index: i,
	                nodeId: 'node_' + i,
	                lloc:node,
	                loc: this.get_test([point[0], point[1]], K),
	                coordinate: [point[0], point[1]]
	            });
	        } else {
	            var _t = _.last(arr);
	            var endPoint = ePoint;
	            if (_t && _t.index != (i - 1)) {
	                endPoint = {
		            	id: 'node_' + i,
		            	loc: nodes[(i - 1) % nodes.length]
	            	}
	            }
	            loc = endPoint.loc; 
	            if(_t){
	                var _n = nodes[_t.index];
	                loc = _t.loc ? [_t.loc.lng, _t.loc.lat, _t.loc.elevation] : _n;
	            }
	            arr.forEach(d => {
	                if (d.nodeId == endPoint.id) loc = [d.loc.lng, d.loc.lat, d.loc.elevation];
	            })
	            var _p = iD.util.trackPointToPicPixe(K, trackPoint, loc);
	            coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node);
	            if (_p[1] > height) {
	                point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, loc)[1]);
	            }else{
	                point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, loc)[0]);
	            }
	            if(_.isEmpty(point)) continue;
	            arr.push({
	                index: i,
	                lloc:node,
	                nodeId: 'node_' + i,
	                loc: this.get_test([point[0], point[1]], K),
	                coordinate: [point[0], point[1]]
	            });
	        }
	    }
//  	if (_.isEmpty(arr)) continue;
    
	    arr.forEach((d, i) => {
	        nodesStroe.push({
	            coordinate: d.coordinate,
	            nodeId: d.nodeId,
	        })
	    })
	    for (let j = 0; j < nodesStroe.length; j++) {
	        _stroeNode = nodesStroe[j];
	        coordinates.push(_stroeNode.coordinate);
	        pointMappingNode[j] = _stroeNode.nodeId;
	    }
//  	if (!pGinPic(coordinates, width, height)) continue;
	    if (coordinates.length >= 2) {
	        geometrys.push({
	            coordinates,
	            entity: ways,
	            pointMappingNode,
	            type: 'Polygon'
	        })
	    }
	    return geometrys;
	},

	/*player.pic_point --  当前轨迹点*/
	get_test: function(xy, K) {
	    let player = disease_player.track_list[disease_player.current_num - 1],
	    	cameraHeight = disease_player.camera_params.cameraHeight,
	    	pic_point = {
	    		loc: [ player.x, player.y ]
	    	};
	    // let plane = player.dataMZgr.planes && player.dataMgr.planes.get(player.wayInfo.trackId);
	    let geometry = null;
	    let utm = LLtoUTM(pic_point.loc[0], pic_point.loc[1]);
	    let z = player.z - cameraHeight;
	    var lonlat = iD.util.picPixelToLonLat(_.clone(K), player, utm.zoneNumber, utm.designator, xy, z);
	    geometry = {
	        lng: lonlat[0],
	        lat: lonlat[1],
	        elevation: z
	    };
	    return geometry;
	},

	/*相机参数--整理*/
	cameraParams: function(time,type=false){
		var params = [
			[disease_player.camera_params.focusX, 0, disease_player.camera_params.principlePointX],
	        [0, disease_player.camera_params.focusX, disease_player.camera_params.principlePointY],
	        [0, 0, 1]
	    ];
	    return params;
	}

}




/**
 * 界面文件加载完成
*/

$(function(){ 

	/*$('.button_list h3').html( config_url.nantong.title );*/
	window.token = $.getCookie('token') || '';
	if(!token){
		$.errorView('token不存在，请登录！');
		let _url = './login.html';
		window.open(_url, '_self');
	}
	Disease.getSystemTime();
	
	disease_user.userRoleChange();
	
	    var myurl = "http://t0.tianditu.gov.cn/img_w/wmts?tk=bb3a11452a810044c551e46541839c84";
	Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns";
	/*天地图URL配置*/
	var TDTURL_CONFIG = {
	    TDT_IMG_W: "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84"   //在线天地图影像服务地址(墨卡托投影)
	    , TDT_VEC_W: "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84"   //在线天地图矢量地图服务(墨卡托投影)
	    , TDT_CIA_W: "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default.jpg&tk=bb3a11452a810044c551e46541839c84"            //在线天地图影像中文标记服务(墨卡托投影)
	    , TDT_CVA_W: "http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default.jpg&tk=bb3a11452a810044c551e46541839c84"            //在线天地图矢量中文标记服务(墨卡托投影)
	    , TDT_IMG_C: "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84"  //在线天地图影像服务地址(经纬度)
	    , TDT_VEC_C: "http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84"   //在线天地图矢量地图服务(经纬度)
	    , TDT_CIA_C: "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84"      //在线天地图影像中文标记服务(经纬度)
	    , TDT_CVA_C: "http://{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
	        "&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
	        "&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84"       //在线天地图矢量中文标记服务(经纬度)
	};
	
    // Create a clock that loops on Christmas day 2013 and runs in 4000x real time.
    let clock = new Cesium.Clock({
        startTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        currentTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        stopTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
        clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        multiplier: 1, // how much time to advance each tick
        shouldAnimate: false // Animation on by default
    });
	window.viewer = new Cesium.Viewer('cesium_map', {
		geocoder: false,
		homeButton: false,
		sceneModePicker: false,
		imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
		    url : TDTURL_CONFIG.TDT_VEC_W,
		    layer: "tdtAdcode",
		    format:  "tiles",
		    subdomains:["t0","t1","t2","t3","t4","t5","t6","t7"],
		    maximumLevel:17
		}),
        clockViewModel: new Cesium.ClockViewModel(clock),
//		imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
//		    url: TDTURL_CONFIG.TDT_IMG_C,
//		    layer: "tdtImg_c",
//		    style: "default",
//		    format: "tiles",
//		    tileMatrixSetID: "c",
//		    subdomains: ["t0","t1","t2","t3","t4","t5","t6","t7"],
//		    tilingScheme: new Cesium.GeographicTilingScheme(),
//		    tileMatrixLabels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
//		    maximumLevel: 17
//	    }),
	    
		baseLayerPicker: false,
		
		/*sceneMode: Cesium.SceneMode.SCENE2D,
		mapMode2D: Cesium.MapMode2D.ROTATE,*/
		
		navigationHelpButton: false,
		animation: false,
		creditContainer: 'cesium_map',
		creditDisplay: false,
		timeline: false,
		fullscreenButton: false,
		vrButton: false,
		
		scene3DOnly: true,
		requestRenderMode: true,
		viewer: false,
		scene3DOnly: false,
		
		infoBox: true,
		selectionIndicator: true,
		
		navigationInstructionsInitiallyVisible: false,
		/*terrainProvider: Cesium.createWorldTerrain(),			//null
	  	globe: globe,*/
	
	    terrainShadows: true,
	    
	    geocoder: false
	});
	
	viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#3A4155');
	
	let tdtImg_c = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
	    url: TDTURL_CONFIG.TDT_IMG_C,
	    layer: "tdtImg_c",
	    style: "default",
	    format: "tiles",
	    tileMatrixSetID: "c",
	    subdomains: ["t0","t1","t2","t3","t4","t5","t6","t7"],
	    tilingScheme: new Cesium.GeographicTilingScheme(),
	    tileMatrixLabels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
	    maximumLevel: 17
    }));
	let tdtCva = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
	    url: TDTURL_CONFIG.TDT_CIA_C,
	    layer: "tdtCva",
	    style: "default",
	    format:  "tiles",
	    tileMatrixSetID: "c",
	    subdomains:["t0","t1","t2","t3","t4","t5","t6","t7"],
	    tilingScheme:new Cesium.GeographicTilingScheme(),
	    tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
	    maximumLevel:17
	}));
	viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
	    url : TDTURL_CONFIG.TDT_CVA_W,
	    layer: "tdtAdcodeM",
	    format:  "tiles",
	    subdomains:["t0","t1","t2","t3","t4","t5","t6","t7"],
	    maximumLevel:17
	}));
	tdtImg_c.show = false;
	tdtCva.show = false;
	
	viewer._cesiumWidget._innerCreditContainer.style.display = "none";
	viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	
	var options = {
	  	enableCompass: false,
	  	enableZoomControls: false,
	  	enableCompassOuterRing: false
	};
	/*options.enableDistanceLegend = true;*/
	
	viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
	
	/*比例尺增加宽凳logo*/
	var nav_logo = $("<p class='nav_logo'></p>").text("宽凳地图");
	$(".cesium-viewer-cesiumWidgetContainer .distance-legend").append(nav_logo);
	
	/*west, south, east, north*/
	/*var _center = config_url.nantong.center,
		_zoom = config_url.nantong.zoom,
		_height = $.zoomToAltitude(_zoom),
		center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
	
	viewer.camera.setView({  
	    destination: center
	})*/
	/*viewer.camera.setView({
		destination: Cesium.Rectangle.fromDegrees(_bounds.west, _bounds.south, _bounds.east, _bounds.north)
	});*/
	var heading = Cesium.Math.toRadians(90.0);
	var pitch = Cesium.Math.toRadians(-90.0);
	var range = 5000.0;
	
	viewer.scene.enableTopView(true);
	
	let info_height = window.innerHeight - 210,
		ratio_height = info_height / 2048,
		ratio_width = ratio_height * 2448;
	
	$('.disease_info').css('width', ratio_width);
	$(window).resize(function() {
		let new_height = $('.disease_info').height() - 161,
			new_ratio_height = new_height / 2048,
			new_ratio_width = new_ratio_height * 2448;
		
		$('.disease_info').css('width', new_ratio_width);
		disease_cesium.listen_cesium_body();
	})
	disease_cesium.maps_init(viewer);
	disease_cesium.cesium_zoom(viewer);
	disease_centre.centre_search_init();
	
	disease_user.userfindRole(function(){
		disease_init.models_init();
		disease_list.mark_label_list();
	});
	
	
})

