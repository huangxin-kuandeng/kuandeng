/**
 * 主界面初始化
 */

import {
    SlideList
} from './disease_slide.js';
import {
    disease_user
} from './disease_user.js';
import {
    disease_screen
} from './disease_screen.js';
import {
    disease_info
} from './disease_info.js';
import {
    disease_cesium
} from './disease_cesium.js';
import {
    disease_player
} from './disease_player.js';
import { cesium_player } from './play_window/cesium_player.js'
import {
    disease_centre
} from './disease_centre.js';
import {
    disease_list
} from './disease_list.js';
import {
    disease_swiper
} from './disease_swiper.js';
import {
    disease_leaflet
} from './disease_leaflet.js';
import { Evented } from './event_emitter';

var disease_init = {};

disease_init.play_image_type = 'visua_up_map';		//正射图、采集图、点云图，当前播放类型

disease_init.models_init = function () {

    var _this = this;

    /*用户操作界面展开*/
    $('.button_other').mouseover(function () {
        $('.user_install').css('display', 'block');
    })
    $('.button_other').mouseout(function () {
        $('.user_install').css('display', 'none');
    })
    /*点击退出按钮退出当前用户*/
    $('.button_other .user_install .user_handle').click(function () {
        disease_user.userSignOut();
    })
    /*点击设置按钮设置当前用户城市权限*/
    $('.button_other .user_install .user_config').click(function () {
        let _url = './user.html';
        window.open(_url, '_blank');
    })
    // checkbox--控制图片隐藏显示
    $('.disease_info').on('change', 'label.checkbox_label input', function () {
		var type = this.checked;
		cesium_player.change_toggle(type);
    })
    // 滑块
    $('.disease_info').on('input', '.image_opacity_change', function () {
		var num_op = this.value,
			ra_op = Number( num_op ) || 0;
		
		cesium_player.change_alpha(ra_op);
    })
    /*用户城市权限界面展开*/
    $('.user_citys').mouseover(function () {
        $('.user_citys .citys_list').css('display', 'block');
    })
    $('.user_citys').mouseout(function () {
        $('.user_citys .citys_list').css('display', 'none');
    })
    /*点击切换城市权限功能*/
    $('.user_citys .citys_list li').click(function (e) {
        let adcode = e.target.getAttribute('data-adcode'),
            cityname = e.target.innerText,
            newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, '');
        $('.user_citys .citys_list li').removeClass('active');
        $('.user_citys .citys_list').css('display', 'none');
        $('.user_citys .citys_name').html(newname);
        e.target.className = 'active';
		
		window._evented.emit('click.cityChange', adcode)
    })
    /*点击筛选按钮-显示隐藏筛选界面*/
    $('.disease_list_screen a.screen_link').click(function () {
        let type = $('.screen_model').css('display');
        _this.screen_model_hide(type);
        disease_screen.screen_icon(type);
    })
    /*点击全部清空标签-将所有筛选条件清空*/
    $('.screen_model').on('click', '.screen_submit label a', function () {
        var checkboxs = $('.screen_model_param input[type="checkbox"]');
        for (var i = 0; i < checkboxs.length; i++) {
            checkboxs[i].checked = false;
        }
        disease_screen.subtype_change();
    });
    /*点击应用按钮-根据筛选条件重新查询病害列表*/
    $('.screen_model').on('click', '.screen_submit button', function () {
		
		window._evented.emit('click.screenChange');
		
    });
    /*点击病害信息中-文字按钮-显示隐藏轮播图界面*/
    $('.disease_info').on('click', '.info_view_button button', function () {
        $.errorView('功能未开发');
        return;
        $('.disease_swiper').toggle(200);
    });
    $('.disease_swiper .model_backdrop').click(function () {
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
        disease_player.click_types = true;
        var index = this.getAttribute('data-index');
		var indexData =  disease_list.catchList[index] || {};
        disease_info.come_to_info(indexData);

        var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
            return data.ACTIVE == 'active';
        })
        disease_init.player_mode_init(active.ID);
    });
    $('.disease_info').on('click', 'ul.info_tab_list li', function (e) {
        let data_type = e.target.getAttribute('data-type');
        _this.player_mode_init(data_type);
        disease_init.image_type_go(true);
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
    $('.data_header .business_name').mouseover(function () {
        var client = this.getBoundingClientRect(),
            left = client.left - 24,
            top = client.top + client.height - 14;

        $('.data_header .business_list').css({
            top: top + "px",
            left: left + "px"
        })
        $('.data_header .business_list').css('display', 'block');
        $('.data_header .business_list a span').attr('class', 'iconfont iconshangsanjiao');
    })
    $('.data_header .business_name').mouseout(function () {
        $('.data_header .business_list').css('display', 'none');
        $('.data_header .business_list a span').attr('class', 'iconfont iconxiasanjiao');
    })
    /*点击按钮-切换当前业务类型-损坏检测与资产巡检-*/
    $('.button_list ul.business_list').on('click', 'li', function () {
        var type = this.getAttribute('data-name') || '',
            current_adcode = disease_user.current_adcode || {};

        if (type && current_adcode.dataVersion) {
            Disease.TYPE_LIST = Disease.business_list[type];
            $('.button_list ul.business_list li').removeClass('active');
            $('.button_list a.business_open')[0].firstChild.data = Disease.TYPE_LIST.NAME;
            this.className = 'active';
			$('.disease_list_body').html('');
			$('.business_list').fadeOut(0);
			
			window._evented.emit('click.businessChange')
			
        }
    });
    /*点击按钮-关闭病害列表*/
    $('.open_disease_list').on('click', 'a.left_arrow', function () {
		disease_init.left_list_close();
    });
    /*点击按钮-打开病害列表*/
    $('.open_disease_list').on('click', 'a.right_arrow', function () {
        $('.open_disease_list a').attr('class', 'left_arrow');
        $(".disease_list").animate({
            'left': '0px'
        }, 300, 'swing', function () {
            disease_cesium.listen_cesium_body('disease_list', true);
        });
    });
    /*病害列表切换优先级显示初始化*/
    $('.disease_list_sort ul li a').click(function () {
        var hasClass = $(this.parentNode).hasClass('active');
        if (!hasClass) {
            $('.disease_list_sort ul li').removeClass('active');
            $(this.parentNode).addClass('active');
            disease_screen.screen_search();
        }
		/*var _type = this.parentNode.getAttribute('type');
		Disease.list_init();*/
    })
    /*切换地图模式--数据中心*/
    $('.search_param ul li').click(function () {
        $('.search_param ul li').removeClass('active');
        $(this).addClass('active');
        disease_centre.centre_init(this.type);
        disease_player.player_icon_change(true);
    })

    $('.disease_list .disease_list_body').scroll(function (e) {
        var scrollHeight = $('.disease_list .disease_list_body')[0].scrollHeight,
            scrollTop = $('.disease_list .disease_list_body')[0].scrollTop,
            clientHeight = $('.disease_list .disease_list_body')[0].clientHeight,
            _height = scrollHeight - scrollTop - clientHeight;

        if (scrollTop && _height <= 5) {
            //滚动条滚到最底部
            disease_list.chunk_list_change();
        }
    });
    /*用户进行反馈时,点击类型选择*/
    $(".select_value input").on("click", function () {
        $('.select_option').toggle();
        $('.select_value').toggleClass("active");
    });
    $(".select_option li").click(function (event) {
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
        if (val != '1') {
            $('.feedback_model div textarea').addClass('height');
        }

    });
    $('.screen_model').on('click', '.screen_model_param input[type="checkbox"]', function () {
        var type = this.getAttribute('name');
        var type_list = Disease.TYPE_LIST.TYPES;
        if (type == type_list.KEY) {
            disease_screen.subtype_change();
        }else if(type == 'all'){
            var id =  this.getAttribute('data-name');
            $('.screen_model .TYPE[name="' + id + '"] input[type="checkbox"]').prop('checked', this.checked);
        }

    });
    /*点击反馈提交*/
    $(".feedback_submit").click(function (event) {
        _this.feedback_submit();
    });
    /*点击遮罩模版*/
    $("#mask_model").click(function (event) {
        SlideList.menu_feedbacks();
    });
};

/* 关闭左侧列表栏 */
disease_init.left_list_close = function(){
	$('.open_disease_list a').attr('class', 'right_arrow');
	disease_cesium.listen_cesium_body('disease_list', false);
	$(".disease_list").animate({
		'left': '-339px'
	}, 300);
}

disease_init.screen_model_hide = function (type) {
    if (type == 'none') {
        $('.screen_model').css('display', 'block');
        $(".screen_model").animate({
            'left': 344
        }, 300, 'swing', function () {
            $('.screen_model').css('z-index', '112');
            disease_cesium.listen_cesium_body('screen_model', true);
        });
    } else {
        $('.screen_model').css('z-index', '110');
        $(".screen_model").animate({
            'left': 0
        }, 300, 'swing', function () {
            $('.screen_model').css('display', 'none');
        });
        disease_cesium.listen_cesium_body('screen_model', false);
    }
};

/*正射图-采集图-点云图变化*/
disease_init.player_mode_init = function (type) {

    let new_class = 'player_video new_' + type;
    $('.player_video').attr('class', new_class);

    this.play_image_type = type;
    $('.disease_info ul.info_tab_list li').removeClass('active');
    $('.disease_info ul.info_tab_list li.' + type).addClass('active');
    $('.video_image').fadeOut(0);
    $('#' + type).fadeIn(0);
};

/*根据类型的不同去执行不同事件*/
disease_init.image_type_go = function (type = false) {
    // $('.result_list').hide();
    if (this.play_image_type == 'visua_up_map') {
        // $('.result_list').show();
        disease_leaflet.road_player(type);
		window.mbSideMap && window.mbSideMap.resize();
    } else if (this.play_image_type == 'collect_map') {
		type && disease_player.update_image();
        disease_player.player_projection();
    } else if (this.play_image_type == 'threed_map') {
        // cesium_player._alpha = 1.0;
        // $('.image_opacity .checkbox_label input')[0].checked = false;
		
        var _type = $('.image_opacity .checkbox_label input')[0].checked;
		if(!_type){
			cesium_player.update();
		}
        cesium_player.change_toggle(_type);
    }
};

/*反馈功能提交*/
disease_init.feedback_submit = function () {
    let type = $('.select_value input').attr('name') || '',
        desc = $('textarea.desc').val() || '';
    if (desc.length > 200) {
        $.errorView('描述信息过长！');
        return;
    }
    let json = {
        'pdId': disease_info.current_info.properties.ID,
        'message': desc,
        'type': type
    },
        url = config_url.pdds + 'feedback/save?pdId=' + json.pdId + '&message=' + json.message + '&type=' + json.type;
    $.postAjax({
        url: url,
        data: json,
        callback: function (data) {
            if (data.code != '0') {
                $.errorView(data.message);
                return;
            }
            $.errorView(data.message, true);
            SlideList.menu_feedbacks();
        }
    })
};

/*业务类型变化时*/
disease_init.business_change = function () {
    // 地图弹窗的变化
    var type_list = Disease.TYPE_LIST;
    var _buttons = `
		${type_list.FUNBUTTON.map(f => `
			<button class="btn ${f.CLASS} ${f.CONTROL}" name="${f.ID}">${f.NAME}</button>
		`).join('')}
	`;
    $('.cesium_popup .popup_content .image_buttons').html(_buttons);

    // 数据中心左侧面板
    var center_tab = $('.data_center_tab ul li');
    for (let i = 0; i < center_tab.length; i++) {
        center_tab[i].lastChild.data = type_list.LEFTTABS[i].NAME;
    }

    // 视频界面 按钮组显示
    var _player = `
		${type_list.FUNBUTTON.map(f => `
			<li class="${f.ID} ${f.ACTIVE} ${f.CONTROL}" data-type="${f.ID}">${f.NAME}</li>
		`).join('')}
	`;
    $('.info_image .info_image_btn ul.info_tab_list').html(_player);

    // 初始化 视频界面的类型
    var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
        return data.ACTIVE == 'active';
    })
    disease_init.play_image_type = active.ID;
	
	$('#data_center').attr('class', type_list.ID);
    $('#highway_disease').attr('class', type_list.ID);
	
	var text = Disease.TYPE_LIST.TITLE;
	$('.info_header a.info_header_close').attr('title', '关闭' + text + '信息');
    $('.info_header div.menu_manage ul.menu_list_child li.menu_collect')[0].lastChild.data = '收藏' + text;
	
    // 数据中心列表筛选项变更
    // disease_centre.search_param();
};

export {
    disease_init
};

// module.exports = disease_init;







