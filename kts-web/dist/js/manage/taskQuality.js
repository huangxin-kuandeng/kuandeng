//点击作业质量
$(".taskQuality").click(function(){
	$('.content-header h1').text('作业质量');
	taskQuality.Table();
})
//作业质量
var taskQuality = {
	
	fileData: [],
	
	searchTerm: {
		"startAt": "",
		"endAt"	: "",
		"pacId"	: "",
		"role"	: "tag_mark"
	},
	
//	作业质量的模版列表
	Table: function(value=false){
		var pacId = taskQuality.searchTerm["pacId"] || "",
			role = taskQuality.searchTerm["role"] || "",
			startAt = taskQuality.searchTerm["startAt"] || "",
			endAt = taskQuality.searchTerm["endAt"] || "",
			tag_mark = "",
			tag_check = "";
		if( role && (role == "tag_mark") ){
			tag_mark = "selected";
		}else if( role && (role == "tag_check") ){
			tag_check = "selected";
		}
//  	作业质量列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        	<div class="box box-warning">
	        		<div class="hideTable">
	        			<table border="1">
	        			
	        			</table>
	        		</div>
	        		<div class="box-header">
	        			<div class="buttons"></div>
	        			<h3 class="box-title">作业质量列表</h3>
	    			</div>
	    
				    <div style="padding-left:10px;">
				        <input type="text" id="pacId" value="${pacId}" class="form-control" placeholder="pacId" onfocus="this.placeholder=''" onblur="this.placeholder='pacId'" style="float:left;width:130px;margin:0px 5px;" />
				    </div>
	    
			        <div style="float:left;margin-left:10px;">
						<select id="role" class="form-control" style="width:100px;">
				            <option value="tag_mark" ${tag_mark}>作业员</option>
					        <option value="tag_check" ${tag_check}>质检员</option>
			            </select>
			        </div>
					<!--标记起始时间-->
					<div class="dataTime">
			            <div class="input-group date col-sm-5">
			              	<div class="input-group-addon">
			                	<i class="fa fa-calendar"></i>
			              	</div>
			              	<input type="text" name="startTime" class="form-control pull-right time" id="startAt" value="${startAt}" readonly>
			            </div>
			            <div class="part">至</div>
			            <div class="input-group date col-sm-5">
			              	<div class="input-group-addon">
			                	<i class="fa fa-calendar"></i>
			              	</div>
			              	<input type="text" name="endTime" class="form-control pull-right time" id="endAt" value="${endAt}" readonly>
			            </div>
			        </div>
	    			<!-- 确认进行条件过滤 -->
				    <div id="searchButton">
						<button type="button" class="btn btn-success">搜索</button>
				    </div>
	    			<!-- 获取当前月的作业质量 -->
				    <div id="currentMonth">
						<button type="button" class="btn btn-success">本月作业质量</button>
				    </div>
				    <!-- 导出文件 -->
				    <div id="export" style="right:10px;">
						<button type="button" class="btn btn-warning" onclick=""><a style="color:#fff;">导出文件</a></button>
				    </div>
				    <!-- /.box-header -->
				    <div class="box-body myTaskBody">
					    <table id="example2" class="table table-bordered table-hover">
					        <thead>
						        <tr>
						            <th>用户名</th>
						            <th>总数</th>
						            <th>成功</th>
						            <th>效率</th>
						        </tr>
					        </thead>
					    </table>
				    </div>
	    		</div>
	    	</div>
	    </div>
	    `;

    	$('.content.container-fluid').html(test1);
//		日期选择器的语言修改为中文格式的
	    $('.time').datepicker({
	    	format: 'yyyy-mm-dd',
	    	autoclose: true,
	    	language: "zh-CN"
	    });
//		初始化表格(作业质量列表的属性)
    	var table = $("#example2").DataTable({
			'language'    	: window.lang,						//中文显示
            'paging'      	: true,
            'lengthChange'	: false,
            'searching'   	: false,
            'ordering'    	: false,
            'info'        	: true,
	        'scrollY'		: 600,
	        'scrollCollapse': true,
	        "lengthChange"	: true,
	        "lengthMenu"	: [ 10, 30, 50 ],
            'autoWidth'   	: false,
	        ajax: function (data, callback, settings) {
//				封装请求参数
	            param.limit = 10;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;						//开始的记录序号
	            param.page = (data.start / data.length)+1;		//当前页码
				var taskQualityURL = window.kms+"statistics/getStatistics?";
				taskQualityURL = taskQuality.urlFormat(taskQualityURL,taskQuality.searchTerm);
//				使用post请求作业质量列表(每次只请求十条任务,然后对其进行分页)
	            $.ajax({
	                type: "GET",
//              	url: window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	                url: taskQualityURL,
				    async : true,
					contentType: "application/json; charset=utf-8",
	                success: function (data) {
	                    var returnData = {};
	                    taskQuality.fileData = data.result || [];
	                    returnData.recordsTotal = data.result.length;				//返回数据全部记录
	                    returnData.recordsFiltered = data.result.length;			//后台不实现过滤功能，每次查询均视作全部结果
	                    returnData.data = data.result;						//返回的数据列表
//						调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
//						此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
						taskQuality.hideTable();
                    	callback(returnData);
	                }
	           	});

	        },
//			作业质量列表的数据展示
        	columns: [
//      		第一列----用户名----显示
	            { 
	            	"data": "name",
					"class": "name"
				},
//      		第二列----总数----显示
	            { 
	            	"data": "total",
					"class": "total"
				},
//      		第三列----成功数量----显示
	            { 
	            	"data": "succeed",
					"class": "succeed"
				},
//      		第四列----效率----显示
	            { 
	            	"data": "rate",
					"class": "rate"
				}
	        ]
	    });
//		点击搜索-根据条件查询结果
		$('#searchButton button').on('click', function () {
			taskQuality.taskQualitySearch();
		});
//		获取当前月份的作业质量
		$('#currentMonth button').on('click', function () {
			taskQuality.taskQualitySearch(true);
		});
//		初始化作业质量列表过滤条件
		for(var item in taskQuality.searchTerm){
			taskQuality.searchTerm[item] = "";
		}
		taskQuality.searchTerm["role"] = "tag_mark";
	},
	
	hideTable: function(){
		var tableHtml = `
	        <tr>
	            <th colspan="2">用户名</th>
	            <th colspan="2">总数</th>
	            <th colspan="2">成功</th>
	            <th colspan="2">效率</th>
	        </tr>
            ${taskQuality.fileData.map(t => `
		        <tr>
		            <td colspan="2">${t.name}</td>
		            <td colspan="2">${t.total}</td>
		            <td colspan="2">${t.succeed}</td>
		            <td colspan="2">${t.rate}</td>
		        </tr>
            `).join('')}
		`;
		$(".hideTable table").html(tableHtml);
		
        var html = "<html><head><meta charset='utf-8' /></head><body>" + $(".hideTable table")[0].outerHTML + "</body></html>";
        var blob = new Blob([html], { type: "application/vnd.ms-excel" });
        var a = $("#export a")[0];
        a.href = URL.createObjectURL(blob);
        var fileName = util.Time(new Date);
        a.download = "作业质量统计——"+fileName+".xls";
	},
	
//	根据过滤条件搜索
	taskQualitySearch: function(type){
    	for(var item in taskQuality.searchTerm){
    		var value = $("#"+item).val() || $("#"+item+" option:selected").val() || "";
    		if(value){
    			taskQuality.searchTerm[item] = value;
    		}
    	}
    	if(type){
			var firstTime = taskQuality.firstDay();
			var lastTime = taskQuality.lastDay();
			taskQuality.searchTerm["startAt"] = firstTime;
			taskQuality.searchTerm["endAt"] = lastTime;
    	}
    	taskQuality.Table(true);
	},
    
//  url的格式化
    urlFormat: function(url,term){
    	var urlArr = [];
    	for(var item in term){
    		if(term[item]){
	    		urlArr.push({
	    			"name" : item,
	    			"value": term[item],
	    		})
    		}
    	}
    	
    	for(var i=0; i<urlArr.length; i++){
    		if( urlArr[i].name.indexOf("At") >= 0 ){
    			urlArr[i].value = new Date(urlArr[i].value).getTime();
    		}
    		var urlStr = urlArr[i].name+"="+urlArr[i].value;
			url += urlStr;
			if(i != urlArr.length-1){
				url += "&";
			}
    	}
    	return url;
    },
    
//  当前月份的第一天
    firstDay: function(){
		var date = new Date();
		date.setDate(1);
		var firstTime = util.TimeData(date);
		return firstTime;
    },
    
//  当前月份的最后一天
    lastDay: function(){
		var date = new Date();
		var currentMonth=date.getMonth();
		var nextMonth = ++currentMonth;
		var nextMonthFirstDay = new Date(date.getFullYear(),nextMonth,1);
		var oneDay = 1000*60*60*24;
		var dataTime = new Date(nextMonthFirstDay - oneDay);
		var lastTime = util.TimeData(dataTime);
		return lastTime;
    }
	
}