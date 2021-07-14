/**
 * 退出当前用户
 */


import {
    disease_screen
} from './disease_screen.js';
import {
    disease_centre
} from './disease_centre.js';
import {
    disease_road_link
} from './disease_road_link.js';
import { disease_map } from './disease_main_map.js';

var disease_user = {};

disease_user.current_adcode = null;

disease_user.adcode_param = {};

disease_user.urlCenter = '';

/*退出用户*/
disease_user.userSignOut = function(){
	$.removeCookie('token');
	$.errorView('退出成功');
	setTimeout(function(){
		let _url = './login.html';
		window.open(_url, '_self');
	}, 500)
};

/*用户城市权限界面初始化*/
disease_user.userRoleInit = function(adcodes){
	let cityname = disease_user.current_adcode.name,
		this_center = disease_user.current_adcode.center.split(','),
		newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, '');
	
	let list = `
		${adcodes.map(a => `
			<li data-adcode="${a.adcode}" class="${a.className || ''}">${a.name}</li>
		`).join('')}
	`;
	$('.user_citys .citys_list').html(list);
	$('.user_citys .citys_name').html(newname);

	funButtonActive();
	businessListActive();
	
	// if(window._viewer){
	// 	let _center = this_center ? this_center.split(',') : config_url.nantong.center,
	// 		_zoom = config_url.nantong.zoom,
	// 		_height = disease_user.zoomToAltitude(_zoom);
		
	// 	_center = urlCenter ? urlCenter : _center;
	// 	_height = urlCenter ? 750 : _height;
	// 	let center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
		
	// 	_viewer.camera.setView({  
	// 		destination: center
	// 	})
	// }
};

disease_user.userRoleChange = function(){
	let userinfo = $.getLocalStorage('userInfo') || '{}',
		json_userinfo = JSON.parse(userinfo),
		username = json_userinfo.cnName || '佚名',
		userimage = json_userinfo.role || 'beijing',
		imageurl = './Apps/Dist/Img/chengshi@2x/' + userimage + '.png';
	
	$('.user_name').html(username);
	$('.button_list img.user_logo').attr('src', imageurl);
};

/*获取当前用户城市权限列表*/
disease_user.userfindRole = function(){
		
	let userinfo = $.getLocalStorage('userInfo') || '{}',
		json_userinfo = JSON.parse(userinfo),
		username = json_userinfo.userName,
		_url = config_url.pdds + 'user/district/permission/findCitiesByUsername?username=' + username;
	
	let urlAdcode = $.getUrlParam('adcode') || $.getUrlParam('city'),
		centerX = $.getUrlParam('x'),
		centerY = $.getUrlParam('y');
		disease_user.urlCenter =  (centerX && centerY) ? [centerX, centerY] : null;
	
	return new Promise((resolve,reject) => {
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
				
				let isDefault = '当前用户城市权限无法对应，请校验！';
				for(let s=0; s<adcodes.length; s++){
					let adcode = adcodes[s].adcode;
					if( !urlAdcode && adcodes[s].isDefault ){
						isDefault = '城市权限未传参，使用默认城市加载！';
						adcodes[s].className = 'active';
						disease_user.current_adcode = adcodes[s];
					}else if(urlAdcode && urlAdcode == adcode){
						isDefault = false;
						adcodes[s].className = 'active';
						disease_user.current_adcode = adcodes[s];
					}
					disease_user.adcode_param[adcode] = adcodes[s];
				}
				
				if(!disease_user.current_adcode){
					adcodes[0].className = 'active';
					disease_user.current_adcode = adcodes[0];
				}
				
				if(isDefault){
					$.errorView(isDefault);
				}
				
				disease_user.userRoleInit(adcodes);
				// disease_road_link.handle_road_data();
			}
			resolve();
		}
	})
	})

};

/* 修改采集图、三维图、正射图的默认显示 */
function funButtonActive(type){
	
	let rearView = disease_user.current_adcode.pdRearImageFlag,
		rearViewClass = rearView ? '' : 'rearViewNot';
	$('body').attr('class', rearViewClass);
	if(type){
		return;
	}
	for(let i=0; i<Disease.TYPE_LIST.FUNBUTTON.length; i++){
		Disease.TYPE_LIST.FUNBUTTON[i].ACTIVE = '';
		if(Disease.TYPE_LIST.FUNBUTTON[i].ID != 'collect_map'){
			Disease.TYPE_LIST.FUNBUTTON[i].ACTIVE = 'active';
		}
	}
	
}

/* 修改业务类型的默认显示 */
function businessListActive(type){
	
	let pdFlag = disease_user.current_adcode.pdFlag || true,
		roadAssetFlag = disease_user.current_adcode.roadAssetFlag || true,
		flag = 'ASSET_INSPECTION',
		flagName = '公路资产巡检和管理';
	
	$('.button_list ul.business_list li').removeClass('active');
	if(!pdFlag || !roadAssetFlag){
		$('.button_list ul.business_list li').css('display', 'none');
		$('.button_list ul.business_list li[data-name=""]').css('display', 'block');
	}
	
	if(pdFlag && !roadAssetFlag){
		flag = 'PAVEMENT_DISTRESS';
		flagName = '公路损坏检测和管理';
	}else if(!pdFlag && roadAssetFlag){
		flag = 'ASSET_INSPECTION';
		flagName = '公路资产巡检和管理';
	}else if(!pdFlag && !roadAssetFlag){
		flag = '';
		flagName = '其他业务';
	}
	
	Disease.TYPE_LIST = Disease.business_list[flag] || null;
	
	$('.button_list ul.business_list li[data-name="' + flag + '"]').css('display', 'block');
	$('.button_list ul.business_list li[data-name="' + flag + '"]').addClass('active');
	$('.button_list a.business_open')[0].firstChild.data = flagName;
	
}

/*切换当前用户城市权限操作*/
disease_user.user_city_change = function(adcode){
	disease_user.current_adcode = disease_user.adcode_param[adcode];
	$('.disease_list_screen a.screen_link').removeClass('active');
	
	funButtonActive();
	businessListActive();
	// disease_user.current_adcode = disease_user.adcode_param[adcode];
	// disease_centre.centre_search_change();
	// disease_screen.screen_search(true);
	// $('.disease_list_screen a.screen_link').removeClass('active');
	
	// let param = disease_user.adcode_param[adcode],
	// 	_center = param.center ? param.center.split(',') : null,
	// 	_zoom = config_url.nantong.zoom,
	// 	_height = disease_user.zoomToAltitude(_zoom);
	// if(!_center){
	// 	$.errorView('获取城市中心点失败');
	// 	return;
	// }
	
	// if(window.tile2d && window.tile2d.imageryProvider){
	// 	window.tile2d.imageryProvider._resource.url = config_url.datasets2d + adcode;
	// }
	
	// let center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
	// _viewer.camera.setView({  
	// 	destination: center
	// })
	// // disease_road_link.handle_road_data();
	// disease_player.cesiumPlayer_init();
};

/*cesium3D高度转换zoom等级*/
disease_user.altitudeToZoom = function(height){
	let new_height = height;
	// if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '441400'){
	// 	new_height = height - 150;
	// }else if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '522700'){
	// 	new_height = height - 1000;
	// }
	if(new_height < 0){
		return null;
	}
	var A = 40487.57,
		B = 0.00007096758,
		C = 91610.74,
		D = -40467.74,
		zoom = D + (A - D) / (1 + Math.pow(new_height / C, B));
	
	return zoom;
};

/*cesium3D高度转换zoom等级*/
disease_user.zoomToAltitude = function(zoom){
	var zoom_level = {
			/*'1': 45000000,
			'2': 26000000,
			'3': 10311040,
			'4': 5932713,
			'5': 2966357,
			'6': 1483178,
			'7': 741589,
			'8': 250000,*/
			'9': 200000,
			'10': 90000,
			'11': 37000,
			'12': 22000,
			'13': 10000,
			'14': 6000,
			'15': 2400,
			'16': 1500,
			'17': 717,
			'18': 300,
			'19': 150,
			'20': 60,
			'21': 30,
			'22': 15,
			'23': 13,
			'24': 5,
			'25': 2,
			'26': 1,
			'27': 0.5
		},
		height = zoom_level[zoom] || 0,
		new_height = height + 150;
	// if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '441400'){
	// 	return new_height;
	// }else if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '522700'){
	// 	return (height + 1000);
	// }
	return height;
};
	
export {
    disease_user
};
// export { disease_user };
// module.exports = disease_user;




