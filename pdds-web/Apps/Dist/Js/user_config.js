
import {
	disease_user
} from './disease_user.js';

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
$('.button_other').mouseover(function(){
	$('.user_install').css('display', 'block');
})
$('.button_other').mouseout(function(){
	$('.user_install').css('display', 'none');
})
$('.button_other .user_install .user_handle').click(function(){
	disease_user.userSignOut();
})
$('#user_role .citylists').on('click', 'span', function (e) {
	let dom = (e.target.localName == 'b') ? e.target.parentNode : e.target;
	user_city_change(dom);
});



let userinfo = $.getLocalStorage('userInfo') || '{}',
	json_userinfo = JSON.parse(userinfo),
	ename = json_userinfo.userName || '',
	username = json_userinfo.cnName || '佚名';

$('.user_name').html(username);
$('#user_role .user_name').eq(1).html(ename);

let adcode_param = {};
function userfindRole(callback){
    adcode_param = {};
    let _url = config_url.pdds + 'user/district/permission/findCitiesByUsername?username=' + username;
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
                    let dataVersion = adcodes[s].dataVersion;
                    adcode_param[dataVersion] = adcodes[s];
                }
            }
            callback && callback();
        }
    })
};

/*默认显示城市修改*/
function user_city_change(dom){
	
    let tagCode = dom.getAttribute('name');
    if(!tagCode){
        return;
    }
    let _url = config_url.pdds + 'user/tag/setDefault?defaultTag=' + tagCode + '&username=' + json_userinfo.userName;
	
	$.postAjax({
		'url': _url,
		'token': true,
		'data': {},
		'callback': function(data){
			let adcodes = data.result || [];
			if(data.code != '0'){
				$.errorView(data.message);
				return;
			}
			
			$.errorView(data.message, true);
			$('#user_role .citylists span').removeClass('active');
			$(dom).addClass('active');
		}
	})
}

/*默认显示城市界面变化*/
function citylists(){
	let citys = [];
	let city_html = '';
	for(let item in adcode_param){
		let cityname = adcode_param[item].name,
			newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, ''),
			isDefault = adcode_param[item].isDefault,
			adcode = adcode_param[item].adcode,
			tagCode = adcode_param[item].tagCode,
			active = isDefault ? 'active' : '';
		citys.push({
			'name': cityname,
			'new_name': newname,
			'adcode': adcode,
			'tagCode': tagCode,
			'dataVersion': item,
			'active': active
		})
	}
	if(citys.length == 1){
		city_html = '<span>'+citys[0].new_name+'</span>';
	}else if(citys.length > 1){
		city_html = `
	${citys.map(a => `
				<span class='${a.active}' name='${a.tagCode}'>
					<b></b>${a.new_name}
				</span>
	`).join('')}
		`;
	}
	
	$('.citylists').append(city_html)
}

userfindRole(
	citylists
);

	