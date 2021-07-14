/*
 * 
 * 申领任务
 * 将该列表中的任务申领到所登陆用户的我的任务当中
 * 
 */

$(".imageTask").click(function(){
	$('.content-header h1').text('图片下载');
	imageTask.Table();
})

//申领任务的初始化及事件
var imageTask = {
	
	taskId : "",			//任务的taskId
	
	trackId : "",			//任务的trackId
	
	startTime : "",			//任务的起始时间
	
	endTime : "",			//任务的结束时间
	
	imgData : {},			//过滤条件对象
	
	imgUrl : [],			//过滤条件数组
	
	Table: function(){
	    var time = util.TimeData( new Date() );
//  	我的任务列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        	<div class="box box-warning">
	        		<div class="box-header">
	        			<div class="buttons"></div>
	        			<h3 class="box-title"></h3>
	    			</div>
	    			<div class="box-body imgTaskBody">
	    			
    					
  						<!--标记起始时间-->
						<div class="form-group" style="position:relative;">
			                <label class="col-sm-5 control-label">任务创建时间:</label>
			                <div class="input-group date col-sm-7" style="padding: 0 15px;">
			                  	<div class="input-group-addon">
			                    	<i class="fa fa-calendar"></i>
			                  	</div>
			                  	<input type="text" name="startTime" class="form-control pull-right time" id="startTime" value="${time}" readonly>
			                </div>
							<div class="btn-group" id="changeDate" onclick="imageTask.changeDate(event)" title="相对于结束时间">
		                      	<button type="button" class="btn btn-success btn-flat" data-dId='1'>1天前</button>
		                      	<button type="button" class="btn btn-success btn-flat" data-dId='3'>3天前</button>
		                      	<button type="button" class="btn btn-success btn-flat" data-dId='7'>7天前</button>
		                    </div>
			            </div>
    					
  						<!--任务结束时间-->
						<div class="form-group">
			                <label class="col-sm-5 control-label">任务结束时间:</label>
			                <div class="input-group date col-sm-7" style="padding: 0 15px;">
			                  	<div class="input-group-addon">
			                    	<i class="fa fa-calendar"></i>
			                  	</div>
			                  	<input type="text" name="endTime" class="form-control pull-right time" id="endTime" value="${time}" readonly>
			                </div>
			            </div>
			            
    					<!--确认-->
						<div class="form-group">
		                  	<div class="col-sm-6">
		                  		<button type="button" class="btn btn-info" onclick="imageTask.submitImg(true)" style="width:100%;" data-toggle='modal' data-target='.modal1' title="下载图片">下载</button>
      						</div>
    					</div>
	    			</div>
	    		</div>
	    	</div>
	    </div>
	    `;

    	$('.content.container-fluid').html(test1);
//		日期选择器的语言修改为中文格式的
	    $('.time').datetimepicker({
	    	format: 'yyyy-mm-dd hh:ii:ss',
	    	autoclose: true,
	    	language: "zh-CN"
	    });
    	
	},
	
	submitImg: function(junge){
//		相关过滤条件
		imageTask.startTime = $("#startTime").val();
		imageTask.endTime = $("#endTime").val();
//		开始时间与结束时间的特殊处理
		if( imageTask.startTime && (imageTask.startTime != "") ){
			imageTask.startTime = new Date(imageTask.startTime).getTime();
		}
		if( imageTask.endTime && (imageTask.endTime != "") ){
			imageTask.endTime = new Date(imageTask.endTime).getTime();
		}
		imageTask.imgData = {
			'startTime' : imageTask.startTime,
			'endTime' 	: imageTask.endTime,
		}
		
//		存在输入的条件则添加过滤条件
		imageTask.imgUrl = [];
		for(var i in imageTask.imgData){
			var item = imageTask.imgData[i];
			if( item && (item != "") ){
				imageTask.imgUrl.push(i+"="+item);
			}
		}
//		拼接请求的url
		var urlData = "";
		for(var i=0; i<imageTask.imgUrl.length; i++){
            urlData += imageTask.imgUrl[i];
            if( i != imageTask.imgUrl.length-1 ){
                urlData += '&';
            }
		}
		var imgNum =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
			            <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
			              	<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			            </button>
			            <h4 class="modal-title">下载图片</h4>
			        </div>
			        <div class="modal-body">
						
						<p style="font-size:18px;">
							是否进行下载？
						</p>
						
						<!------------------------------------确认分配或取消------------------------------------>
						
						<div class="form-group" style="border:none;margin-top:15px;">
							<button type="button" id="button1" class="btn btn-info" title="确认下载" data-dismiss="modal" onclick="imageTask.imgDownload('${urlData}')">确认下载</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" data-dismiss="modal" onclick="main.modalClose()">取消</button>
						</div>
			        </div>
			    </div>
			  </div>
			</div>
		`;
		$('.testmodal').html(imgNum);
	},
	
//	所有符合条件的图片下载
	imgDownload: function(value){
//      window.open('http://192.168.5.205:33310/kts-mark-lt/mark/download?startTime=1526313600000&endTime=1526486340000');
        window.open(window.kms+'mark/download?'+value);
	},
	
//	三天前或者七天前
	changeDate: function(e){
		var endDate = $("#endTime").val();								//跳转几天前的日期是针对结束时间来说
		var reduceNum  = Number( e.target.getAttribute('data-dId') );			//所点击的按钮对应的差时
		
//		得到新的时间并替换
		var nowdate = new Date(endDate);
		var oneweekdate = new Date(nowdate - reduceNum*24*3600*1000); 
		var formatwdate = util.TimeData(oneweekdate);
        $("#startTime").val(formatwdate);
	}
	
}
