/**
 * 排序插件
 */

import {
    disease_map
} from './disease_main_map.js';
import {
    disease_list
} from './disease_list.js';
import {
    disease_info
} from './disease_info.js';

var SlideList = {};

SlideList.Slideicon = function(element,options) {
	this.element = element;
	this.options = {
		cover:options.cover,
		index:options.index,
		callback:options.callback
	};
	this.SlideiconInit();
};

SlideList.SlideiconInit = function() {
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
};

/*显示反馈界面*/
SlideList.menu_feedbacks = function(type = false){
	if(type){
		$('#mask_model').fadeIn(100);
		$('.feedback_model').fadeIn(101);
	}else{
		$('#mask_model').fadeOut(101);
		$('.feedback_model').fadeOut(100);
	}
};

/*执行收藏-取消收藏事件*/
SlideList.menu_collects = function(type){
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
};


/*显示-隐藏：全屏界面*/
SlideList.full_screen = function(type = false){
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
};

export {
    SlideList
};
// module.exports = SlideList;

