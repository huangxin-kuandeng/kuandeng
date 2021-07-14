/*
 * @Author: tao.w
 * @Date: 2020-11-06 15:01:35
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-24 16:05:13
 * @Description: 
 */

/**
 * 界面文件加载完成
*/

import {
    disease_user
} from './disease_user.js';

import { disease_map } from './disease_main_map.js';
import { disease_centre } from './disease_centre.js';
import { disease_init } from './disease_init.js';
import { disease_screen } from './disease_screen.js';
import { disease_player } from './disease_player.js';
import { Evented } from './event_emitter';
import { disease_leaflet } from './disease_leaflet.js';

var web_init = {};


function mapCenter(){
	
	let param = disease_user.current_adcode || {},
		_center = param.center ? param.center.split(',') : null;
	if(!_center){
		$.errorView('获取城市中心点失败');
		return;
	}
	disease_map.setCenter(_center);
	
}

web_init.html_init = async function () {
    
    let urlToken = $.getUrlParam('t') || $.getUrlParam('token');
    let urlName = $.getUrlParam('n') || $.getUrlParam('name') || '佚名';
    let urlUser = $.getUrlParam('loginName') || '';

    if(urlToken && urlUser){
        $.setLocalStorage('userInfo',{
            'userName': urlUser,
            'cnName': urlName,
            'passWord': window.btoa(urlUser),
            'isCatch': false
        })
        $.setCookie({
            name: 'token',
            value: urlToken
        })
    }
    
    window.token = $.getCookie('token') || '';
    window._evented = Evented;
    if (!token) {
        $.errorView('token不存在，请登录！');
        let _url = './login.html';
        window.open(_url, '_self');
    }
 
    Disease.getSystemTime();

    disease_user.userRoleChange();

    // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns";


    /*比例尺增加宽凳logo*/
    // var nav_logo = $("<p class='nav_logo'></p>").text("宽凳地图");
    // $(".cesium-viewer-cesiumWidgetContainer .distance-legend").append(nav_logo);

    let info_height = window.innerHeight - 210,
        ratio_height = info_height / 2048, 
        ratio_width = parseInt(ratio_height * 2448);

    $('.disease_info').css('width', ratio_width);
    $(window).resize(function () {
        let new_height = $('.disease_info').height() - 161,
            new_ratio_height = new_height / 2048,
            new_ratio_width = parseInt(new_ratio_height * 2448);

        $('.disease_info').css('width', new_ratio_width);
        // disease_cesium.listen_cesium_body();
    })
    disease_centre.centre_search_init();
	
	
	// 'screen_init': '左侧列表筛选项变化'
	// 'user_city_change': '城市变化'
	// 'centre_search_change': '数据中心查询'
	// 'screen_search': '左侧列表查询'
	// 'business_change': '业务类型变化'
	
	/* 业务类型变化---切换业务类型 */
	Evented.on('click.businessChange', d=>{
		
		disease_init.business_change();
		disease_map.loadAssetDatas();
		
		disease_screen.link_code_query().then(function(data){
			disease_screen.screen_init();
			
			// disease_user.user_city_change();
			disease_map.loadMarkLabels();
			disease_centre.centre_search_change();
			disease_centre.search_param();
			disease_centre.check_value_change();
			disease_centre.link_code_init(data);
			
			disease_screen.screen_search();
			
			disease_map.updateSources( disease_screen.screen_search_param );		//刷新地图图层加载
		})
	})
	
	/* 行政区划变化---切换城市 */
	Evented.on('click.cityChange', d=>{
		disease_user.user_city_change(d);
		
		if(!Disease.TYPE_LIST){
		    $.errorView('当前城市无相关业务，请检验！');
			return;
		}
		
		disease_player.cesiumPlayer_init();
		disease_map.loadAssetDatas();
		disease_map.handleRoadData();
		
		disease_screen.link_code_query().then(function(data){
			disease_screen.screen_init();
			
			// disease_user.user_city_change();
			disease_map.loadMarkLabels();
			disease_centre.centre_search_change();
			disease_centre.search_param();
			disease_centre.check_value_change();
			disease_centre.link_code_init(data);
			
			disease_screen.screen_search();
			
			disease_map.updateSources( disease_screen.screen_search_param );		//刷新地图图层加载
		})
		
		mapCenter();
	})
	
	/* 筛选条件变化时---刷新数据 */
	Evented.on('click.screenChange', d=>{
		disease_init.screen_model_hide('block');
		disease_screen.screen_search();
		disease_screen.screen_icon();
		disease_map.updateConverges( disease_screen.screen_search_param );		//加载数据聚合
	})
	
    await disease_user.userfindRole();
	
	if(!Disease.TYPE_LIST){
        $.errorView('当前城市无相关业务，请检验！');
		disease_init.models_init();
		return;
	}
	
	disease_map.maps_init('cesium_map');
	disease_map.control_init();
	
	// mapCenter(disease_user.urlCenter);
	disease_init.business_change();
	disease_map.loadAssetDatas();
	disease_map.handleRoadData();
	
	if(!disease_user.current_adcode){
		disease_init.models_init();
		return;
	}
	
	disease_screen.link_code_query().then(function(data){
		
		disease_map.updateConverges();
		disease_map.loadMarkLabels();
		disease_centre.centre_search_change();
		disease_centre.search_param();
		disease_centre.check_value_change();
		disease_centre.link_code_init(data);
		
		disease_screen.screen_init();
		disease_init.models_init();
		disease_screen.screen_search();
		disease_screen.screen_icon();
		disease_player.player_init();
	})
	
	var _opt = {
		'disease_map.updateConverges': '加载数据聚合',
		'disease_map.loadMarkLabels': '加载自定义标记',
		'disease_centre.centre_search_change': '加载数据中心当前TAB选项窗口数据',
		'disease_centre.search_param': '加载数据中心列表筛选项',
		'disease_centre.check_value_change': '加载数据中心数据',
		'disease_centre.link_code_init': '加载数据中心路线编号数据',
		'disease_screen.screen_init': '加载筛选界面初始化',
		'disease_init.models_init': '加载界面初始化DOM-BUTTON监听',
		'disease_init.business_change': '加载业务类型DOM样式',
		'disease_screen.screen_search': '加载-根据筛选项查询病害列表',
		'disease_screen.screen_icon': '加载-筛选按钮ICON图标样式初始化',
		'disease_player.player_init': '加载-视频窗口DOM、事件初始化',
		'disease_map.loadAssetDatas': '加载-当前城市的全量数据'
	}
	
	
}



export {
    web_init
};
// module.exports = web_init;

// $(function(){

// })

