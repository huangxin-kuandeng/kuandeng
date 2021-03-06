/**
 * Created by wangtao on 2017/8/2.
 */
//var Util=window.Util={};
//Util.cookie = {
//  getItem: function(sKey) {
//      if (!sKey) {
//          return null;
//      }
//      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
//  },
//  setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
//      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
//          return false;
//      }
//      var sExpires = "";
//      if (vEnd) {
//          switch (vEnd.constructor) {
//              case Number:
//                  sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
//                  break;
//              case String:
//                  sExpires = "; expires=" + vEnd;
//                  break;
//              case Date:
//                  sExpires = "; expires=" + vEnd.toUTCString();
//                  break;
//          }
//      }
//      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
//      return true;
//  },
//  removeItem: function(sKey, sPath, sDomain) {
//      if (!this.hasItem(sKey)) {
//          return false;
//      }
//      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
//      return true;
//  },
//  hasItem: function(sKey) {
//      if (!sKey) {
//          return false;
//      }
//      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
//  },
//  keys: function() {
//      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
//      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
//          aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
//      }
//      return aKeys;
//  }
//};

/*
 * 
 * ???????????????????????????????????????
 * 
 */

$(".sidebar-menu li").click(function(){
	if($(".sidebar-menu.tree li.active").length>0){
		$(".sidebar-menu.tree li.active").removeClass("active");
	}
	$(this).addClass("active");
});
var util = {
	
//	??????json???????????????
	formatJson: function(json) {
		var formatted = JSON.stringify(json, null, 4);
        return formatted;
    },
	
//	??????????????????(???????????????)
	Time: function(value){
	    if(!value){
	    	return "";
	    }
		var dateTime = new Date(value);
	    var y = dateTime.getFullYear();			//???
	    var m = dateTime.getMonth() + 1;		//???
	    m = m < 10 ? '0' + m : m;
	    var d = dateTime.getDate();				//???
	    d = d < 10 ? ('0' + d) : d;
	    var h = dateTime.getHours();			//???
	    h = h < 10 ? ('0' + h) : h;
	    var t = dateTime.getMinutes();			//???
	    t = t < 10 ? ('0' + t) : t;
	    var s = dateTime.getSeconds();			//???
	    s = s < 10 ? ('0' + s) : s;
		return y + '-' + m + '-' + d + ' ' + h + ':' + t + ':' + s;
	},
	
//	??????????????????(???????????????)
	Millisecond: function(value){
		var dateTime = new Date(value);
	    var y = dateTime.getFullYear();			//???
	    var m = dateTime.getMonth() + 1;		//???
	    m = m < 10 ? '0' + m : m;
	    var d = dateTime.getDate();				//???
	    d = d < 10 ? ('0' + d) : d;
	    var h = dateTime.getHours();			//???
	    h = h < 10 ? ('0' + h) : h;
	    var t = dateTime.getMinutes();			//???
	    t = t < 10 ? ('0' + t) : t;
	    var s = dateTime.getSeconds();			//???
	    s = s < 10 ? ('0' + s) : s;
		return y + '-' + m + '-' + d + ' ' + h + ':' + t + ':' + s + '.' + dateTime.getMilliseconds();
	},
	
//	??????????????????(??????????????????)
	TimeData: function(date){
	    var y = date.getFullYear();  
	    var m = date.getMonth() + 1;  
	    m = m < 10 ? '0' + m : m;  
	    var d = date.getDate();  
	    d = d < 10 ? ('0' + d) : d;  
	    return y + '-' + m + '-' + d;
	},

//	???????????????????????????--???????????????????????????(?????????????????????,?????????????????????)
	Refresh: function(value){
		$("#refresh button").attr("disabled", true);
		$("#refresh button").html("????????????...");
		setTimeout(function(){
			value.Table();
		},100)
	},
	
	errorView: function(view,junge=false){
		
		let _style = junge ? 'success' : 'error';
		spop({
			template: view || '????????????',
			style: _style,
			position  : 'top-center',
			autoclose: 3000
		});
		
		/*var errorModel = `
			<span class="errorUpload" title="????????????:${view}!">????????????:${view}!</span>
		`;
		if(junge){
			errorModel = `
				<span class="successpload" title="????????????:${view}!">????????????:${view}!</span>
			`;
		}
		$(".upload").html(errorModel);
		$(".upload").fadeIn(300);
		setTimeout(function(){
			$(".upload").fadeOut(300);
		},1500);*/
	},

    isPointInRect: function(rect, linecoord) {
        let lassExtend = iD.util.lassExtend,
         	x1 = rect[0].loc[0],
        	y1 = rect[0].loc[1],
        	x2 = rect[1].loc[0],
			y2 = rect[1].loc[1],
        	x3 = rect[2].loc[0],
			y3 = rect[2].loc[1],
        	x4 = rect[3].loc[0],
			y4 = rect[3].loc[1];

        for (var j = 0; j < linecoord.length; j++) {
            var isInRect = lassExtend.isPointInRect({
                lng: linecoord[j].loc[0],
                lat: linecoord[j].loc[1]
            }, [[x1, y1], [x3, y3]]);
            if (isInRect) {
            	return isInRect;
			}
		}
		return false;
	},

    /**
     * ?????????????????????????????????????????????
     * @param  {Array} polylines ?????????????????????
     */
    setBestMap : function(polylines) {
		if(JSON.stringify(polylines) == "{}"){
			util.errorView("????????????????????????");
			return;
		}

        var self = this;
        var lngs = [], lats = [];
		for(var item in polylines){
//			if( $("."+polylines[item][0].tags.taskId).length == 0 ){
//				continue;
//			}
	        for (var i in polylines[item]) {
	            var polyline = polylines[item][i];
	            for (var j = 0; j < polyline.nodes.length; j++) {
	            	var node = polyline.nodes[j];
	                lngs.push(node.loc[0]);
	                lats.push(node.loc[1]);
	            }
	        }
		}
        var maxlng = Math.max.apply(Math, lngs);
        var maxlat = Math.max.apply(Math, lats);
        var minlng = Math.min.apply(Math, lngs);
        var minlat = Math.min.apply(Math, lats);

        var selExtent = iD.geo.Extent([minlng, minlat], [maxlng, maxlat]);
		var map = window.editor.context.map();
		map.extent(selExtent);
   	},
   
    /**
     * ?????????????????????
     * @param points ??????????????????
     * @param tolerance ???????????????
     * @returns {*}
     */
    getProcessPoints: function(points, tolerance = 0.00004) {
        /// <returns type="Array" />
        if (!_.isArray(points) || !points.length) { //???points?????????????????????????????????????????????????????????
            return [];
        }
        if (points.length < 3) return points; //??????3???????????????????????????1??????2????????????????????????
        var firstPoint = 0,
            lastPoint = points.length - 1; //?????????????????????????????????
        var pointIndexsToKeep = []; //??????????????????????????????
        pointIndexsToKeep.push(firstPoint);
        pointIndexsToKeep.push(lastPoint); //?????????????????????????????????????????????
        while (points[firstPoint] == points[lastPoint]) { //?????????????????????????????????????????????
            lastPoint--;
        }
        this.reduce(points, firstPoint, lastPoint, tolerance, pointIndexsToKeep); //??????
        var resultPoints = []; //??????????????????
        pointIndexsToKeep.sort(function(a, b) { //??????????????????????????????
            return a - b;
        });
        for (var i = 0; i < pointIndexsToKeep.length; i++) {
            resultPoints.push(points[pointIndexsToKeep[i]]);
        }
        return resultPoints;
    },
    /**
     *
     * @param points ??????????????????
     * @param firstPoint ??????
     * @param lastPoint ??????
     * @param tolerance ???????????????
     * @param pointIndexsToKeep ????????????????????????
     */
    reduce: function(points, firstPoint, lastPoint, tolerance, pointIndexsToKeep) {
        var maxDis = 0,
            idxFarthest = 0; //???????????????????????????????????????
        for (var i = firstPoint, dis; i < lastPoint; i++) {
            dis = this.perpendicularDistance(points[firstPoint], points[lastPoint], points[i]); //???????????????????????????
            if (dis > maxDis) { //??????????????????
                maxDis = dis;
                idxFarthest = i;
            }
        }
        if (maxDis > tolerance && idxFarthest != 0) { //?????????????????????????????????
            pointIndexsToKeep.push(idxFarthest);
            this.reduce(points, firstPoint, idxFarthest, tolerance, pointIndexsToKeep);
            this.reduce(points, idxFarthest, lastPoint, tolerance, pointIndexsToKeep);
        }
    },
    /**
     *
     * @param beginPoint  ???????????????comparePoint???beginPoint???endPoint??????????????????????????????
     * @param endPoint  ?????????
     * @param comparePoint  ?????????
     * @returns {number}  ?????????
     */
    perpendicularDistance: function(beginPoint, endPoint, comparePoint) {
        //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
        //Base = v((x1-x2)2+(y1-y2)2)                               *Base of Triangle*
        //Area = .5*Base*H                                          *Solve for height
        //Height = Area/.5/Base
        var area = Math.abs(0.5 * (beginPoint[0] * endPoint[1] + endPoint[0] * comparePoint[1] + comparePoint[0] * beginPoint[1] -
            endPoint[0] * beginPoint[1] - comparePoint[0] * endPoint[1] - beginPoint[0] * comparePoint[1]));
        var bottom = Math.sqrt(Math.pow(beginPoint[0] - endPoint[0], 2) + Math.pow(beginPoint[1] - endPoint[1], 2));
        var height = area / bottom * 2;
        return height;
    },
	openTips: function(form,type){
		let _style = "height:150px;overflow-x:auto;"
		if(type){
			_style = "height:300px;width:550px;padding:0px;"
		}
		var receive1 =`
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;">
				    	<div class="modal-header">
					        <button type="button" class="close" title="??????" aria-label="Close" onclick="waitLabelTask.modalClose1()">
					          	<span aria-hidden="true">&times;</span>
					        </button>
			        		<h4 class="modal-title">????????????</h4>
			      		</div>
			      		<div class="modal-body" style="${_style}">
			                ${form.map(f => `
				                <p style="font-size:18px;color:red;word-break:break-all;">${f}</p>
			                `).join('')}
			      		</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodal').html(receive1);
		$('.testmodal .modal1').addClass("in");
		$('.testmodal .modal1').fadeIn(200);
	},

//	2-??????ajax?????????get??????????????????  = $.getJSON   (jq???????????????????????????)
	getAjax: function(url,type,callback,clear=''){
    	$.ajax( {
        	type : "GET",
	        url : url,
	        async : type,
	        data : {},
	        success : function(data) {
	        	if(callback){
	        		callback(data,clear);
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            util.errorView("????????????");
		   	},
	    });
	},
	
	/*??????????????????*/
	getSpecInfo: function(callback){
		window.spec = null;
		let _url = window.kms_v2 + 'base/spec/get';
		util.getAjax(_url, true, function(data){
			if(data.code != '0'){
				util.errorView('????????????????????????');
				return;
			}
			window.spec = data.result.spec || [];
			callback && callback();
		})
	},

//	3-??????ajax?????????post?????????????????????
	postAjax: function(url,form,callback){
	    $.ajax( {
	        type : "POST",
	        url : url,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(form),
	        success : function(data) {
	        	callback(data);
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            util.errorView("????????????");
	        }
	    });
	},
	
//	??????????????????---??????????????????
	openTips_btn: function(html, callback_1, head){
		if(!head){
			head="????????????";
		}
		var receive1 =`
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;z-index: 9999;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;z-index:2;">
				    	<div class="modal-header">
			        		<h4 class="modal-title" style="white-space:nowrap;overflow:hidden;">${head}</h4>
			      		</div>
			      		<div class="modal-body" style="height:auto;min-height:50px;max-height:400px;overflow-x:auto;position:initial;">
			                ${html.map(f => `
				                <p style="font-size:18px;color:red;text-align:center;">${f}</p>
			                `).join('')}
			      		</div>
						<div class="modal-footer" style="border:none;">
							<button type="button" id="button1" class="btn btn-danger" title="??????">??????</button>
							<button type="button" id="button2" class="btn btn-default" title="??????">??????</button>
						</div>
			    	</div>
			  	</div>
			  	<div style="position:fixed;top:0;right:0;bottom:0;left:0;z-index:-1;background-color:#000;opacity:0.5;">
			  	
			  	</div>
			</div>
		`;
		$('.testmodal').html(receive1);
		$('.testmodal .modal1').modal('show');
		$('.testmodal .modal-footer #button1').click(function(){
			callback_1();
		})
		$('.testmodal .modal-footer #button2').click(function(){
			$('.testmodal .modal1').modal('hide');
		})
	},
	
	/*form????????????*/
	forMat_Data: function(form){
		var form_Html = [],
			html_child = "";
		for(var i=0; i<form.length; i++){
			if(form[i].show){
				var form_data = form[i].data || null,
					disabled = form[i].disabled || "",
					_name = form[i].name || "",
					_className = form[i].className || "",
					_defaultValue = form[i].defaultValue || "",
					_id = form[i].id || "",
					_url = form[i].url || "",
					_style = form[i]._style || "",
					_fn = form[i]._fn || null,
					_type = form[i].type || "";
				if(_type == "selectMul"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<select class="form-control selectpicker ${_id}" style="float:left;padding-right:10px;" multiple>
				                ${form_data.map(f => `
					            	<option value="${f.value}" ${f.selected ? 'selected' : ''}>${f.name}</option>
				                `).join('')}
				            </select>
						</div>
					`;
				}else if(_type == 'ratio'){
					html_child = `
						<div class='col-md-12 ${_id}'>
							<label>${_name}???</label>
							<div class="btn-group" data-toggle="buttons" style="display:block;width:100%;float:left;">
				                ${form_data.map(f => `
								  	<label class="btn btn-primary ${f.selected || ''}" style="width:50%;">
								    	<input type="radio" name="${_id}" autocomplete="off"  ${f.selected ? 'checked' : ''} value="${f.value}"> ${f.name}
								  	</label>
				                `).join('')}
							</div>
						</div>
					`;
				}else if(form_data){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<select class="form-control ${_id} ${_style}" style="float:left;" ${disabled}>
					            <option value="">??????${_name}</option>
				                ${form_data.map(f => `
					            	<option value="${f.value}" ${f.selected || ''}>${f.name}</option>
				                `).join('')}
				            </select>
						</div>
					`;
				}else if(_id == "adcodeValue"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="??????????????????" readonly="" value="">
						</div>
					`;
				}else if(_fn){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id} paramFn" placeholder="${_name}" readonly="" value="" onclick="projectSearch.addParams('${_fn}','${_name}')">
						</div>
					`;
				}else if( (_id=="branchName") || (_className=="branchName") ){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="${_name}" readonly="" value="">
						</div>
					`;
				}else if(_id == "recogModelVersion" || _id == "modelId"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<select class="form-control ${_id} model_other" style="float:left;">
								<option class="change" value="">?????????????????????</option>
								<option value="other">??????????????????</option>
				            </select>
						</div>
					`;
				}else if(_type == "readonly"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="??????${_name}" readonly="" value="">
						</div>
					`;
				}else if(_type == "dynamicSelect"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control dynamicSelect ${_id}" data-url="${_url}" placeholder="??????${_name}" readonly="" value="">
						</div>
					`;
				}else if(_type == 'time'){
					html_child = `
						<div class='col-md-12'>
		                	<label>${_name}???</label>
				            <input type="text" id="${_id}" class="form-control pull-right time" value="" readonly="">
				        </div>
					`;
				}else{
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="${_name}" value="${_defaultValue}">
						</div>
					`;
				}
				form_Html.push(html_child);
			}
		}
		return form_Html;
	},
	//	?????????form????????????
	forMat_Data_Beta: function(form){
		var form_Html = [],
			html_child = "";
		for(var i=0; i<form.length; i++){
			if(form[i].show){
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
				if(_type == "selectMul"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<select class="form-control selectpicker ${_id}" style="float:left;padding-right:10px;" multiple>
				                ${form_data.map(f => `
					            	<option value="${f.value}" ${f.selected ? 'selected' : ''}>${f.name}</option>
				                `).join('')}
				            </select>
						</div>
					`;
				}else if(_type == 'checkbox'){
					html_child = `
						<div class='col-md-12' style='height:30px;'>
							<label>${_name}???</label>
							<input type="checkbox" class="${_id}" value="" ${_checkbox ? 'checked' : ''}>
						</div>
					`;
				}else if(_type == 'ratio'){
					html_child = `
						<div class='col-md-12 ${_id}'>
							<label>${_name}???</label>
							<div class="btn-group" data-toggle="buttons" style="display:block;width:100%;float:left;">
				                ${form_data.map(f => `
								  	<label class="btn btn-primary ${f.selected || ''}" style="width:50%;">
								    	<input type="radio" name="${_id}" autocomplete="off"  ${f.selected ? 'checked' : ''} value="${f.value}"> ${f.name}
								  	</label>
				                `).join('')}
							</div>
						</div>
					`;
				}else if(form_data){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<select class="form-control ${_id} ${_style}" style="float:left;" ${disabled}>
					            <option value="">??????${_name}</option>
				                ${form_data.map(f => { //let dft = ''; //if(_defaultValue && f.value== _defaultValue){ dft = 'selected' }; 
								return `
					            	<option value="${f.value}" ${f.selected}>${f.name}</option>
				                `}).join('')}
				            </select>
						</div>
					`;
				}else if(_id == "adcodeValue"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="??????????????????" readonly="" value="">
						</div>
					`;
				}else if(_fn){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id} paramFn" placeholder="${_name}" readonly="" value="" onclick="projectSearch.addParams('${_fn}','${_name}')">
						</div>
					`;
				}else if( (_id=="branchName") || (_className=="branchName") ){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="${_name}" readonly="" value="">
						</div>
					`;
				}else if(_id == "recogModelVersion" || _id == "modelId"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<select class="form-control ${_id} model_other" style="float:left;">
								<option class="change" value="">?????????????????????</option>
								<option value="other">??????????????????</option>
				            </select>
						</div>
					`;
				}else if(_type == "readonly"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="??????${_name}" readonly="" value="">
						</div>
					`;
				}else if(_type == "dynamicSelect"){
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control dynamicSelect ${_id}" data-url="${_url}" placeholder="??????${_name}" readonly="" value="">
						</div>
					`;
				}else if(_type == 'time'){
					html_child = `
						<div class='col-md-12'>
		                	<label>${_name}???</label>
				            <input type="text" id="${_id}" class="form-control pull-right time" value="" readonly="">
				        </div>
					`;
				
			}else if(_type == 'textarea'){
				html_child = `
					<div class='col-md-12'>
						<label>${_name}???</label>
						<textarea type="text" id="${_id}" cols='10' rows='5'  class="form-control pull-right time" ></textarea>
					</div>
				`;
			}else{
					html_child = `
						<div class='col-md-12'>
							<label>${_name}???</label>
							<input type="text" class="form-control ${_id}" placeholder="${_name}" value="${_defaultValue}">
						</div>
					`;
				}
				form_Html.push(html_child);
			}
		}
		return form_Html;
	},
	
	/*????????????*/
	modalCreate: function(param, callback){
		var footerHtml = '';
		if(callback){
			footerHtml = `
				<div class='modal-footer' style='border:none;'>
					<button type='button' class='btn btn-success btnConfirm' title='??????'>??????</button>
					<button type='button' class='btn btn-default btnCancel' title='??????'>??????</button>
				</div>
			`;
		}
		var test =`
			<div class='modal ${param.id}' tabindex='-1' role='dialog' aria-labelledby='gridSystemModalLabel'>
			  	<div class='modal-dialog' role='document' style='top:100px;'>
			    	<div class='modal-content'>
				    	<div class='modal-header'>
					        <button type='button' class='close' title='??????' aria-label='Close'>
					          	<span aria-hidden='true'>&times;</span>
					        </button>
				    		<h5 class='modal-title'>${param.head}</h5>
				  		</div>
				    	${param.html}
				    	${footerHtml}
			    	</div>
			  	</div>
			</div>
		`;
		$('.devicemodal').html(test);
		$('.devicemodal .modal').modal('show');
		$('.devicemodal .modal .close').click(function(){
			$('.devicemodal .modal').modal('hide');
		})
		$('.devicemodal .modal-content .btnConfirm').click(function(){
			callback();
		})
		$('.devicemodal .modal-content .btnCancel').click(function(){
			$('.devicemodal .modal').modal('hide');
		})
	},
	
	/*??????json???????????????*/
	formatJson:function(json) {
		var formatted = JSON.stringify(json, null, 4);
        return formatted;
    },
	/**???????????? */
	mapLeaflet :function(dom,judge,callback){
		var cityUrl = configURL.map;
	//		if(judge == "polygon"){
	//			cityUrl = "http://192.168.5.32:33990/tile?mid=basemap_day&get=map&cache=false&p=2&z={z}&x={x}&y={y}&t=1543285636034";
	//		}
	//		????????????????????????
		var mapList = {
				'pano': {
					'name': '??????',
					'url': cityUrl
				},
				'yingxiang': {
					'name': '??????',
					'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
				},
				'nation': {
					'name': '?????????',
					'url': configURL.nation_url,
					'type': true
				}
			},
			defaults = [],
			layerList = {},
			panoMap = cityUrl;
	//		????????????????????????
		if(judge == "task"){
			mapList = {
				'pano': {
					'name': '??????',
					'url': cityUrl
				},
				'qujua': {
					'name': '????????????',
					'url': configURL.quhua_url
				},
				'yingxiang': {
					'name': '??????',
					'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
				},
				'nation': {
					'name': '?????????',
					'url': configURL.nation_url,
					'type': true
				},
				'bridge': {
					'name': '???????????????',
					'url': configURL.taskFrame_url,
					'type': true
				},
				'trackMap': {
					'name': '????????????',
					'url': configURL.map_track_url,
					'type': true
				}
			};
		}else if(judge == "project"){
			mapList = {
				'pano': {
					'name': '??????',
					'url': cityUrl
				},
				'yingxiang': {
					'name': '??????',
					'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
				},
				'qujua': {
					'name': '????????????',
					'url': configURL.quhua_url
				},
				'taskFrame': {
					'name': '?????????',
					'url': configURL.taskFrame_url,
					'type': true
				},
				'world': {
					'name': '????????????',
					'url': "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
				}/*,
				'bridge': {
					'name': '?????????',
					'url': configURL.bridge_url,
					'type': true
				}*/
			};
			if(judge == "survey"){
				mapList["survey"] = {
					'name': '????????????',
					'url': configURL.surveyStatus_url,
					'type': true
				}
			}
		}else if( (judge == "polygon") || (judge == "survey") ){
			mapList = {
				'pano': {
					'name': '??????',
					'url': cityUrl
				},
				'yingxiang': {
					'name': '??????',
					'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
				},
				'qujua': {
					'name': '????????????',
					'url': configURL.quhua_url
				},
				'world': {
					'name': '????????????',
					'url': "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
				},
				'bridge': {
					'name': '????????????',
					'url': configURL.map_track_url,
					'type': true
				}
			};
			/*if(judge == "survey"){
				mapList["survey"] = {
					'name': '????????????',
					'url': configURL.surveyStatus_url,
					'type': true
				}
			}*/
		}else if(judge){
			mapList = {
				'pano': {
					'name': '??????',
					'url': cityUrl
				},
				'utm': {
					'name': 'UTM???',
					'url': configURL.utmMap,
					'type': true
				},
				'bridge': {
					'name': '????????????',
					'url': configURL.map_track_url,
					'type': true
				},
				'yingxiang': {
					'name': '??????',
					'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
				}
			};
		}
		for(var item in mapList){
			var mapUrl = mapList[item].url,
				mapName = mapList[item].name,
				mapType = mapList[item].type,
				mapChild;
			if(mapUrl.indexOf("switch")>=0){
				var urlString = 'switch:'+mapUrl.split('}')[0].split('switch:')[1];
				mapUrl = mapUrl.replace(urlString, "s");
			}
			if(item == 'yingxiang'){
				mapChild = L.tileLayer.bing(mapUrl);
			}else{
				if(mapUrl.indexOf("{s}")>=0){
					mapChild = L.tileLayer(mapUrl, {id: item, subdomains: [4006,4007,4008], maxZoom: 25});
				}else{
					mapChild = L.tileLayer(mapUrl, {id: item, maxZoom: 25});
				}
				if( (item == 'pano') || (item == 'utm') || (item == 'bridge') || (item == 'survey') || (item == 'taskFrame')  ){
					defaults.push(mapChild)
				}
			}
			layerList[item] = {
				'name': mapName,
				'layer': mapChild,
				'type': mapType
			}
		}
		
		var baseMaps = {},
			overlayMaps = {};
		for(var layers in layerList){
			var name = layerList[layers].name;
			if(layerList[layers].type){
				overlayMaps[name] = layerList[layers].layer;
			}else{
				baseMaps[name] = layerList[layers].layer;
			}
		}
	//		var labelTextCollision = new L.LabelTextCollision({
	//			collisionFlg : true
	//		});
		window.leafletMap = L.map(dom, {
			drawControl: true,
			attributionControl: true,
			center: [39.907218, 116.374145],
			zoom: 10,
			maxZoom: 25,
			editable: true,
			layers: defaults,
	//		    renderer : labelTextCollision
		});
		L.control.layers(baseMaps, overlayMaps).addTo(leafletMap);
		   window.infoOpen = L.control();
		
	//		????????????????????????
		infoOpen.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'infoOpen');
			this.update();
			return this._div;
		};
	
		infoOpen.update = function (props) {
			this._div.innerHTML = '';
			for(var item in props){
				if(item != "trackids"){
					this._div.innerHTML += item+': '+ props[item] +'<br />';
				}
			}
		};
	
		infoOpen.addTo(leafletMap);


		
		/*L.EditControl = L.Control.extend({
			options: {
				position: 'topleft',
				callback: null,
				kind: '',
				html: ''
			},
			onAdd: function (map) {
				var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
					link = L.DomUtil.create('a', '', container);
				link.href = '#';
				link.title = '??????' + this.options.kind;
				link.innerHTML = this.options.html;
				L.DomEvent.on(link, 'click', L.DomEvent.stop)
						  .on(link, 'click', function () {
							  if( (this.options.html == '??????') && morePolygon.distanceType ){
								  util.errorView("??????????????????");
								  morePolygon.distanceType = false;
								  leafletMap.editTools.stopDrawing()
							  }else if(this.options.html == '??????'){
								  util.errorView("??????????????????");
								  morePolygon.distanceType = true;
								window.LAYER = this.options.callback.call(map.editTools);
							  }
						  }, this);
				return container;
			}
		});
		L.NewLineControl = L.EditControl.extend({
			options: {
				position: 'topleft',
				callback: leafletMap.editTools.startPolyline,
				kind: '???',
				html: '??????'
			}
		});
		leafletMap.addControl(new L.NewLineControl());*/
	//		?????????????????????
		/*L.EditControl = L.Control.extend({
	
			options: {
				position: 'topleft',
				callback: null,
				kind: '',
				html: ''
			},
	
			onAdd: function (map) {
				var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
					link = L.DomUtil.create('a', '', container);
	
				link.href = '#';
				link.title = '??????' + this.options.kind;
				link.innerHTML = this.options.html;
				L.DomEvent.on(link, 'click', L.DomEvent.stop)
						  .on(link, 'click', function () {
							window.LAYER = this.options.callback.call(map.editTools);
						  }, this);
	
				return container;
			}
	
		});
	
		L.NewLineControl = L.EditControl.extend({
	
			options: {
				position: 'topleft',
				callback: leafletMap.editTools.startPolyline,
				kind: '???',
				html: '\\/\\'
			}
	
		});
	
		L.NewPolygonControl = L.EditControl.extend({
	
			options: {
				position: 'topleft',
				callback: leafletMap.editTools.startPolygon,
				kind: '?????????',
				html: '???'
			}
	
		});
	
		L.NewMarkerControl = L.EditControl.extend({
	
			options: {
				position: 'topleft',
				callback: leafletMap.editTools.startMarker,
				kind: '???',
				html: '????'
			}
	
		});
	
		L.NewRectangleControl = L.EditControl.extend({
	
			options: {
				position: 'topleft',
				callback: leafletMap.editTools.startRectangle,
				kind: '????????????',
				html: '???'	
			}
	
		});
	
		L.NewCircleControl = L.EditControl.extend({
	
			options: {
				position: 'topleft',
				callback: leafletMap.editTools.startCircle,
				kind: '???',
				html: '???'
			}
	
		});*/
	
		/*map.addControl(new L.NewMarkerControl());
		map.addControl(new L.NewLineControl());
		map.addControl(new L.NewPolygonControl());
		map.addControl(new L.NewRectangleControl());
		map.addControl(new L.NewCircleControl());
	
		var line = L.polyline([
			[43.1292, 1.256],
			[43.1295, 1.259],
			[43.1291, 1.261]
		]).addTo(map);
		line.enableEdit();
		line.on('dblclick', L.DomEvent.stop).on('dblclick', line.toggleEdit);*/
		
		callback();
	},
	//	??????????????????????????????
	geoPolygon : function(_layers){
		var latlngs = [];
		for(var i=0; i<_layers.length; i++){
			latlngs.push(_layers[i])
		}
		if(latlngs[0] !== latlngs[latlngs.length-1]){
			latlngs.push( latlngs[0] );
		}
	    var xys =[];
	    var geo='';
        for(var i=0; i<latlngs.length; i++){
            xys.push(latlngs[i].lng+" "+latlngs[i].lat);
        }
        geo = xys.join(',');
	    return geo;
	},
	getAjax : function(url,type,callback,clear='',errorfun){
    	$.ajax( {
        	type : "GET",
	        url : url,
	        async : type,
	        data : {},
	        success : function(data) {
	        	if(callback){
	        		callback(data,clear);
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            util.errorView("????????????");
	        	if(errorfun){
	        		errorfun();
	        	}
		   	},
	    });
	},
	//	3-??????ajax?????????post?????????????????????
	postAjax : function(url,form,callback,text=''){
	    $.ajax( {
	        type : "POST",
	        url : url,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(form),
	        success : function(data) {
	        	callback(data,text);
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            util.errorView("????????????");
	        }
	    });
	},
	isJSON4object :function(obj){
		return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		
	}


//	range: function(value){
//		var replaces = value.replace("POLYGON((","").replace("))","");
//		return replaces.split(",");
//	},
	
}
