/*
 * create for huangxin by 2017/12/20
 * 多次使用的写成方法--多次使用
 */

var util = {
//	时间格式方法
	Time: function(value){
		var dateTime = new Date(value);
		var time = dateTime.getFullYear() 
					+ '/' + (dateTime.getMonth() + 1)
					+ '/' + dateTime.getDate()
					+ ' - ' +dateTime.getHours()
					+ ':' + dateTime.getMinutes()
					+ ':' + dateTime.getSeconds();
		return time;
	},
    
	errorView: function(view,junge=false){
		var className = "errorUpload";
		if(junge){
			className = "successpload";
		}
		var errorModel = `
			<span class="${className}" title="提示信息:${view}!">提示信息:${view}!</span>
		`;
		$(".upload").html(errorModel);
		$(".upload").fadeIn(300);
		setTimeout(function(){
			$(".upload").fadeOut(300);
		},1500);
	},
	
	/*使用ajax的方式get获取请求数据             (jq自带的获取接口数据)*/
	getAjax: function(param,callback){
		$("#loading").css("display","block");
    	$.ajax( {
        	type : "GET",
	        url : param.url,
	        async : true,
	        data : {},
	        success : function(data) {
				$("#loading").css("display","none");
	        	if(callback){
	        		callback(data);
	        	}else{
	        		return data;
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            util.spopView({});
		   	},
	    });
	},
	
	/*使用ajax的方式post获取请求数据             (jq自带的获取接口数据)*/
	postAjax: function(param,callback){
		$("#loading").css("display","block");
	    $.ajax( {
	        type : "POST",
	        url : param.url,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(param.data),
	        success : function(data) {
				$("#loading").css("display","none");
	        	if(callback){
	        		callback(data);
	        	}else{
	        		return data;
	        	}
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	        	util.spopView({});
	        }
	    });
	},
	
	/*提示信息*/
	spopView: function(param){
		let _style = param.type ? 'success' : 'error';
		spop({
			template: param.text || '系统异常',
			style: _style,
			position  : 'top-center',
			autoclose: 3000
		});
	},
	
//	弹出提示信息---包含确认取消
	openTips_btn: function(param){
		var receive1 =`
			<div class="openTips">
	      		<div class="myHead">
	            	<h4 class="modal-title">${param.head || '提示信息'}</h4>
	      		</div>
	      		<div class="myBody" style="height: auto;">
	                ${param.data.map(f => `
		                <p>${f}</p>
	                `).join('')}
	      		</div>
	      		<div class="myFooter">
					<button type="button" id="button1" class="btn btn-danger" title="${param.btnName || '确认'}">${param.btnName || '确认'}</button>
					<button type="button" id="button2" class="btn btn-default" title="取消">取消</button>
	      		</div>
			</div>
		`;
		$('.devicemodal').html(receive1);
		$('.devicemodal .myFooter #button1').click(function(){
			param.callback();
			$('.devicemodal .openTips').fadeOut(0);
		})
		$('.devicemodal .myFooter #button2').click(function(){
			$('.devicemodal .openTips').fadeOut(0);
		})
	},
	
	/*生成弹窗*/
	modalCreate: function(param, callback){
		var footerHtml = '';
		if( (param.id == 'littleModal') && callback){
			footerHtml = `
				<div class="modal-footer" style="border:none;">
					<button type="button" class="btn btn-success btnConfirm" title="确认">确认</button>
					<button type="button" class="btn btn-default btnCancel" title="取消">取消</button>
				</div>
			`;
		}
		var test =`
			<div class="modal ${param.id}" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
			  	<div class="modal-dialog" role="document">
			    	<div class="modal-content">
				    	<div class="modal-header">
					        <button type="button" class="close" title="关闭" aria-label="Close">
					          	<span aria-hidden="true">&times;</span>
					        </button>
				    		<h5 class="modal-title">${param.head}</h5>
				  		</div>
				    	${param.html}
				    	${footerHtml}
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodal').html(test);
		$('.testmodal .modal').fadeIn(200);
		$('.testmodal .modal .close').click(function(){
			util.modalClose();
			if(param.closeFn){
				param.closeFn();
			}
		})
		if($('.testmodal .modal .time').length){
//			日期选择器的语言修改为中文格式的
		    $('.testmodal .modal .time').datepicker({
		    	format: 'yyyy-mm-dd',
		    	autoclose: true,
		    	language: "zh-CN",
		    	todayBtn: true,
		    	todayHighlight: true,
		    	initialDate: new Date()
		    });
		}
//		面板生成完成时,有需要调用的函数则自动调用
		if(param._fn){
			param._fn();
		}
		$('.testmodal .modal-content .btnConfirm').click(function(){
			callback();
		})
		$('.testmodal .modal-content .btnCancel').click(function(){
			util.modalClose();
		})
	},
	
	/*关闭弹窗*/
	modalClose: function(){
		$('.testmodal .modal').fadeOut(200);
		$('.viewModal .modal').fadeOut(200);
	},
	
	/*创建FORM表单模版*/
	createForm: function(param){
		var paramHtml = [];
		for(var d of param){
			var html_child = '',
				colClass = (d.small ? 'col-md-6' : 'col-md-12');
			if( d.data && !d.hide ){
				var selectData = d.data;
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<select class="form-control ${d.id}" style="float:left;">
				            <option value="">选择${d.name}</option>
			                ${selectData.map(s => `
				            	<option value="${s.value}" ${s.selected || ''}>${s.name}</option>
			                `).join('')}
			            </select>
					</div>
				`;
			}else if( (d.id == 'polygon') && !d.hide ){
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<button type="button" class="btn btn-block btn-warning ${d.id}">绘制范围</button>
					</div>
				`;
			}else if( (d.type == 'time') && !d.hide ){
				var newTime = new Date();
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<div class='input-group date'>
			              	<div class="input-group-addon">
			                	<i class="fa fa-calendar"></i>
			              	</div>
			              	<input type="text" class="form-control pull-right time ${d.id}" name="${d.id}" value="" readonly>
						</div>
					</div>
				`;
			}else if( d.modal && !d.hide ){
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<input type="text" class="form-control ${d.id}" placeholder="${d.name}" readonly>
					</div>
				`;
			}else if(!d.hide){
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<input type="text" class="form-control ${d.id}" placeholder="${d.name}" value="${d.value || ''}">
					</div>
				`;
			}
			paramHtml.push(html_child);
		}
		return paramHtml;
	},
	
	/*获取日期昨天,明天以及上月最后一天的日期*/
	getDateStr: function(AddDayCount) {
		var dd = new Date();
		dd.setDate(dd.getDate() + AddDayCount);  		 //获取AddDayCount天后的日期
		var year = dd.getFullYear();
		var mon = dd.getMonth()+1;                       //获取当前月份的日期
		var newMon = (mon < 10) ? ('0'+mon) : mon;
		var day = dd.getDate();
		var newDay = (day < 10) ? ('0'+day) : day;
		return year + "-" + newMon + "-" + newDay;
	}
}
