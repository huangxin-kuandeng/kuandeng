
// only for dev----------
// (function () {
// 	configURL.kms_v2 = 'http://192.168.7.22:13310/kms-v2/';// "http://kms-v2.gzproduction.com/kms-v2/";
// 	configURL.hbase_ply = 'http://192.168.8.17:39999/hbase-support/';//"http://hbase-support.gzproduction.com/"
// })();
//===========
var evalGallery = {


	//for prod
	urlInfobyBatch: configURL.kms_v2 + 'org/info/queryPage',
	urlPac: configURL.kms_v2 + 'org/file/getByOrgId?orgId=',
	urlMark: configURL.kms_v2 +'mark/file/getByMarkId?markId=',	
	evalData: [],
	curIndex: 0,
	quotaData: '',
	colorSet: [], // 色板
	curOrgId: '',
	curMarkId: '',
	orgPicCache: [],
	evalPicCache: [], // 预加载的图片缓存





	loadGalleryIds: function (body) {
		util.postAjax(evalGallery.urlPac, body, function (data) {
			if (data.code != "0") {
				util.errorView(data.code + ": " + data.message);
				return;
			}
			let datas = data.result.data || [];
			if (datas.length > 0) {
				evalGallery.idCollect = datas[0].properties.data.val;
			} else {
				util.errorView('获取ID失败');
				return;
			}
		})
	},
	preloadImg: function (arr) {
		for (var i = 0; i < arr.length; i++) {
			evalGallery.orgPicCache[i] = new Image();
			evalGallery.evalPicCache[i] = new Image();
			evalGallery.curOrgId = evalGallery.evalData[i].orgId;
			evalGallery.curMarkId = evalGallery.evalData[i].preMarkId;
			evalGallery.orgPicCache[i].src = evalGallery.urlPac + evalGallery.curOrgId;
			evalGallery.orgPicCache[i].class = 'orgPic';
			evalGallery.evalPicCache[i].src = evalGallery.urlMark + evalGallery.curMarkId;
			evalGallery.evalPicCache[i].class = 'evalPic';
		}
	},
	galleryInit: function () {
		//  let width_ratio = 600 / 2448,
		// 	height = width_ratio * 2048,
		// 	sHeight = Number(height);
		var sWidth = 750; //$("#slider_name").width();
		var len = $("#slider_name .silder_panel_assess").length;
		var index = 0;
		var picTimer;

		// 图片切换
		function showPics(index) {
			// var nowLeft = -index * sWidth * 2 
			evalGallery.curOrgId = evalGallery.evalData[index].orgId;
			$('.Pics').html("");
			$('.Pics').append(evalGallery.orgPicCache[index]);
			$('.Pics').append(evalGallery.evalPicCache[index]);
			$('.Pics img').eq(0).addClass("orgPic")
			$('.Pics img').eq(1).addClass("evalPic")

			$("#slider_name .tagQuality li").removeClass("current").eq(index).addClass("current");
			$("#slider_name .silder_nav_mark li").removeClass("current").eq(index).addClass("current");
			// $("#slider_name .silder_nav li").stop(true, false).animate({ "opacity": "0.8" }, 300).eq(index).stop(true, false).animate({ "opacity": "1" }, 300);
			// $("#slider_name .silder_nav_mark li").stop(true, false).animate({ "opacity": "0" }, 300).eq(index).stop(true, false).animate({ "opacity": "1" }, 300);
		}
		//监听图片滚轮缩放事件：更改图层透明度
		function setImgOpacity(evt) {

			// if (evt.cancelable) {
			// 	// 判断默认行为是否已经被禁用
			// 	if (!evt.defaultPrevented) {
			// 		evt.preventDefault();
			// 	}
			// }
			if (evt.target.class == 'evalPic') {
				evt = evt || window.event;
				let mark = 'none';
				var value = 0;
				if (evt.wheelDelta || evt.originalEvent.wheelDelta) {
					value = evt.wheelDelta || evt.originalEvent.wheelDelta;
					mark = 'wheelDelta';
				} else {
					if (evt.detail) {
						value = evt.detail;
						mark = 'detail';
					}
				}
				let newOpa = 0;
				if (mark == 'wheelDelta') {
					newOpa = Number($('.Pics img.evalPic').css('opacity')) + Number((value / 1500).toFixed(1));
				} else if (mark == 'detail') {
					newOpa = Number($('.Pics img.evalPic').css('opacity')) + Number((value / 30).toFixed(1));
				}
				newOpa = (newOpa <= 0 ? 0 : (newOpa >= 1 ? 1 : newOpa));
				$('.Pics img.evalPic').css('opacity', newOpa);

			}
		}
		$(document).on("mousewheel",
			function (event) {
				if (event.target.class == 'evalPic') {
					setImgOpacity(event);
				}

			});

		$("#slider_name .silder_nav li").css({ "opacity": "0.6", "filter": "alpha(opacity=60)" }).mouseenter(function () {
			index = $("#slider_name .silder_nav li").index(this);
			evalGallery.curIndex = index;
			showPics(index);
			// try{
			// 	resultPreview.operPickMark(index);
			// }catch(e){
			// 	util.errorView('载入标注信息失败')
			// 	console.log(e);
			// }

		}).eq(0).trigger("mouseenter");

		$("#slider_name .silder_con_assess").css("width", sWidth * (len));


	},
	resetGallery: function (body, isPageEvt = false, curPage, isAllPics) {

		/**1.获取图片id地址 批次包详情 impbatch*/
		let url_pics =  evalGallery.urlInfobyBatch;
		evalGallery.evalData = [];
		evalGallery.orgPicCache = [];
		evalGallery.evalPicCache = [];
		util.postAjax(url_pics, body, function (data) {
			if (data.code != "0") {
				util.errorView(data.code + ": " + data.message);
				return;
			}
			let datas = data.result.data || [];
	
				datas.map(el => {
					evalGallery.evalData.push({
						trackPointId: el.properties.trackPointId || "",
						orgId: el.properties.ID || "",
						preMarkId: el.properties.preMarkId || "",
					});
					if(resultPreview.markableSpec[el.id] === undefined){

						if (el.properties.markable === '0') {
							resultPreview.markableSpec[el.id] = false;
						} else {
							resultPreview.markableSpec[el.id] = true;
						}
					}
				
				});

			if (evalGallery.evalData.length <= 0) {
				util.errorView('该批次暂无成果');
				return;
			}
			//预加载图片
			evalGallery.preloadImg(evalGallery.evalData);

	
				/**模板生成 */
				var galleryhtml = "";
				if (evalGallery.evalData.length == 0) {
					util.errorView('该批次暂无成果');
					$('.evalGallery').html("");
					return;
				}
				else {
					evalGallery.curOrgId = evalGallery.evalData[0].orgId || '';
					galleryhtml = `
			
				<div  class='toolBar' style="width:100%;height: 40px;">
				<h4 class="titleContent_main" style="width:calc(100% - 200px);display:inline-block;" ></i>标注图片预览</h4> 
					<!--<a class="btn  btn-success"  id='evalSpec' style="margin: 5px 5px;">
						模型信息
					</a>
					<a class="btn  btn-success"   id='pickMark' style="margin: 5px 5px;">
						标注信息
					</a>
					<a class="btn  btn-success"   id='quotaSpec' style="margin: 5px 5px;">
						指标详情
                    </a>  -->   
                    <button class="btn  btn-warning "  style="margin: 5px 5px; float:right;" onclick="resultPreview.closeGallery('evalGallery')" >
						关闭
					</button>
					<button class="btn  btn-warning "  style="margin: 5px 5px; float:right;" onclick="resultPreview.saveMarkableId()" >
						提交
                    </button>
               
					</div>
					
					<div id="yxh_article_assess">
						<div class="slider_box_assess" id="slider_name"> 
                           
                                <h4 class="titleContent" style='border:none;padding-left:20px;'><i class="fa fa-image"></i>原图/识别图</h4>                              
                                <div class='Pics'>
                                    <img class='orgPic' src='${evalGallery.urlPac}${evalGallery.curOrgId}' />	
									<img class='evalPic' src='${evalGallery.urlMark}${evalGallery.curMarkId}' />	 
		                        </div>
                            <div style='width:100%;height:auto;text-align:center;'>
                            <span style='display: inline-block;'>
                                <ul class="silder_nav dec_assess"> 
                                ${evalGallery.evalData.map(el => `
                                <li><a href="#">
                                <img src='${evalGallery.urlPac}${el.orgId}' width="150" height="72" />
                                </a></li> 
                                `).join("")} 
                                </ul>
                                <ul class="silder_nav_mark tagQuality"> 
                                ${evalGallery.evalData.map(el => {
									let _checked_able = resultPreview.markableSpec[el.orgId]? true: false;
								return `<li><label><input type='radio' class='setMarkable' name='${el.orgId}'  ${(_checked_able?'checked':'')}  value='1'/>标注</label>
								<label><input type='radio' class='setMarkable' name='${el.orgId}'  ${(!_checked_able?'checked':'')} value='0'/>不标注</label></li> 
                                `}).join("")} 
                                </ul></span>
                            </div>
						</div>	
						<div class='infoBar'>
							<h4 class="titleContent subInfo"><i class="fa fa-info-circle">标注信息</i></h4><textarea disabled  id='quotaInfo'>批次: ${resultPreview._lotId}\n\n总数量:${resultPreview._impTotalNum} \n\n可标注数量: ${resultPreview._impMarkableNum}</textarea>
							<div id="colorInfo">					
							</div>
							</div>
						<div class="galleryPaginator">
						<ul class="pagination" style="margin:0;"></ul></div>			
					</div>
			
							`;
				}
				$('.evalGallery').html(galleryhtml);
				//paginator	
				$('.galleryPaginator ul.pagination').html("");
				var pageInfo = data.result.page;
				var pageObj = { minPg: 1, maxPg: 10 };
				// if (isPageEnd) {
				var minPg_ = 1, maxPg_ = 10;
				if ((Number(curPage) - 8) <= 0) {
					minPg_ = 1;
				} else {
					minPg_ = (Number(curPage) - 8);
				}
				if ((Number(curPage) + 1) >= 10) {
					maxPg_ = Number(curPage) + 1
				} else {
					maxPg_ = 10
				}
				pageObj = { minPg: minPg_, maxPg: maxPg_ }
				// }

				//
				let pagi_li = "";
				for (let i = pageObj.minPg; i <= pageInfo.totalPages && i <= pageObj.maxPg; i++) {
					if (i == body.page['pageNo']) {
						if (resultPreview._taskCache.pageLst.indexOf(i) == -1) {
							pagi_li = `<li class='active'><a class='eval_active' href="#">${i}</a></li>`
						} else {
							pagi_li = `<li class='active'><a class='beenVisited eval_active'  href="#">${i}</a></li>`
						}
					} else {
						if (resultPreview._taskCache.pageLst.indexOf(i) == -1) {
							pagi_li = `<li><a href="#">${i}</a></li>`
						} else {
							pagi_li = `<li><a class='beenVisited' href="#">${i}</a></li>`
						}
					}
					// pagi_li = (i == body.page['pageNo'] ? `<li class='active'><a href="#">${i}</a></li>` : `<li><a href="#">${i}</a></li>`)
					$('.galleryPaginator ul.pagination').append(pagi_li);
				}
				$('.galleryPaginator ul.pagination').prepend(`<li><a href="#" name="pre">&laquo;</a></li>`);
				if (pageInfo.totalPages >= pageObj.maxPg) {
					$('.galleryPaginator ul.pagination').append(`<li class="disabled"><a href="#">...</a></li>`);
					$('.galleryPaginator ul.pagination').append(`<li class="disabled"><a href="#">${pageInfo.totalPages}</a></li>`);
				}
				$('.galleryPaginator ul.pagination').append(`<li><a href="#" name="next">&raquo;</a></li>`);
				//colorLegend
				let colorHtml = "";
				if (evalGallery.colorSet && evalGallery.colorSet.length > 0) {
					colorHtml = `<h4 class="titleContent"><i class="fa fa-info-circle">评估图例</i></h4>
         <ul disabled  id='subColorInfo'>${evalGallery.colorSet.map(clr => `
         <li><i class="fa fa-circle" style="color:rgb(${clr.color});"></i>&nbsp;${clr.name}</li>
           `).join("")}</ul>`;

				}
				$('#colorInfo').html(colorHtml);

				evalGallery.galleryInit();
				/**标注结果 */
				// resultPreview.setPickMark();

				$('.evalGallery').css('display', 'block');
		
		})
		//query by page
		/**分页 */
		if (!isPageEvt) {
			evalGallery.pageChg();
		}
		/*暂存数据*/


	},

	pageChg: function () {
	
		$('.evalGallery').unbind().on('click', '.galleryPaginator ul.pagination li a', function (event) {
			var isPageEnd_ = false;
			var curIndex = Number($('.galleryPaginator ul.pagination li.active a')[0].innerText);
			var pageNo_ = this.innerText;
			var pageLength = $('.galleryPaginator ul.pagination li').length;
			var curObj = this;
			var curId = 1;
			var curPage = $('.galleryPaginator ul.pagination li.active').index()
			endId = $('.galleryPaginator ul.pagination li a').eq(-2)[0].innerText;
			curId = $(curObj.parentNode).index();
			/**缓存单任务页码数据 */
			if (resultPreview._taskCache.pageLst.indexOf(curIndex) == -1) {
				resultPreview._taskCache.pageLst.push(curIndex);
			}
			if (this.name) {
				(this.name == "next" ? curIndex++ : curIndex--);
				pageNo_ = (curId == 0 ? (curIndex == 0 ? 1 : curIndex) : ((curIndex - 1) == endId ? endId : curIndex));
				if (curPage == 9 && curId == 13) {
					isPageEnd_ = true;
				};
			}
			if ((curIndex - 1) == endId) {
				return
			}
			if ((curPage == 9 || curPage == 10) && pageLength == 14) {
				isPageEnd_ = true;
			};

			let _json = {};

				if (!resultPreview._lotId) {
					util.errorView('批次ID为空');
					return;
				}

				_json = {
					"ops": [
						{
							"k": "impBatch",
							"type": "string",
							"v": resultPreview._lotId.toString(),
							"op": "eq"
						}
					],
					"page": {
						"totalPages": 0,
						"count": 1000,
						"pageNo": pageNo_,
						"pageSize": 10
					}
				};
			/**增加页码缓存 */
			evalGallery.resetGallery(_json, true, pageNo_, null);
		});

		$('.evalGallery').on('click', '.tagQuality input[type="radio"]', function (event) {
			let id = $(this).attr('name');
			

			resultPreview.markableSpec[id] = ($(this).val()=== '0'? false:true);
			resultPreview._impMarkableNum +=  ($(this).val()=== '0'? -1: 1);
		
			$('#quotaInfo').text('批次：'+resultPreview._lotId +'\n\n总数量：'+resultPreview._impTotalNum + '\n\n可标注数量：' + resultPreview._impMarkableNum);		
		})
	}
}