
//-------------------------------------------工作流所有环节展示配置文件--------------------------------------------

/*
	<<<<< 关键词  >>>>>
	创建事务   CreateTransaction
	打开编辑   OpenEdit
	地图编辑   sdEdit
	采集数据导入  SurveyDataUpload
	采集数据导入处理   SurveyHandle
	识别  Recognition
	分配识别处理  AssignRec
	识别处理  RecHandle
	自动化  AutoMap
	重建  Reconstruction
	人工重建  ManualRec
	要素测量  FeatureMeasure
	融合  Fusion
	融合处理  FusionHandle
	自动编辑  AutoEdit
	人工编辑  ManualEdit
	质检  Check
	触发质检  TriggerCheck
	打回编辑  BackToEdit
	提交Final库  Commit
	触发重新导入   TriggerReUpload
	触发重新识别   TriggerReRec
	触发重新融合   TriggerReFusion
	触发重新自动编辑   TriggerReAutoEdit
	触发重新自动化  TriggerReAutoMap
	分配   AssignRFE
	分配编辑  AssignEdit
	分配采集  AssignSurvey
	采集  Survey
	原始数据上传   OrigDataUpload
	原数据始质检   OrigDataCheck
	触发重新原数据始质检   TriggerReOrigDataCheck
	采集数据质检   SurveyDataCheck
	触发采集数据重新质检   TriggerReSurveyCheck
	创建处理任务   CreateHandleTasks
	触发重新创建处理任务   TriggerReCreateHandleTasks
	编辑质检   EditCheck
*/

//环节名称(所有的---新的流程还未添加)
window.activityObj = {
	"CreateTransaction"			: "创建事物",
	"OpenEdit"					: "打开编辑",
	"sdEdit"					: "地图编辑",
	"AssignRFE"					: "分配",
	"AssignSurvey"				: "分配采集",
	"Survey"					: "采集",
	"OrigDataUpload"			: "原始数据上传",
	"OrigDataCheck"				: "原数据始质检",
	"TriggerReOrigDataCheck"	: "触发重新质检",
	"SurveyDataUpload"			: "采集数据导入",
	"TriggerReUpload"			: "触发重新导入",
	"triggerSurveyDataUpload"	: "重新数据导入",
	"SurveyHandle"				: "采集数据导入处理",
	"SurveyDataCheck"			: "采集数据质检",
	"TriggerReSurveyCheck"		: "触发重新质检",
	"trackHandle"				: "轨迹处理",
	"triggerTrackHandle"		: "重试轨迹处理",
	"CreateHandleTasks"			: "创建处理任务",
	"TriggerReCreateHandleTasks": "触发重新创建处理任务",
	"Recognition"				: "识别",
	"TriggerReRec"				: "触发重新识别",
	"AssignRec"					: "分配识别处理",
	"RecHandle"					: "识别处理",
	"SegnetRecognition"			: "车道线识别",
	"TriggerReSegnetRec"		: "触发重新车道线识别",
	"PspnetRecognition"			: "路牌识别",
	"TriggerRePspnetRec"		: "触发重新路牌识别",
	"Resnet1Recognition"		: "灯杆识别",
	"TriggerReResnet1Rec"		: "触发重新灯杆识别",
	"AutoMapTrafficSign"		: "自动化路牌",
	"TriggerReAutoMapTrafficSign":"触发重新自动化路牌",
	"AutoMapPole"				: "自动化灯杆",
	"TriggerReAutoMapPole"		: "触发重新自动化灯杆",
	"AutoMapLane"				: "自动化车道线",
	"TriggerReAutoMapLane"		: "触发重新自动化车道线",
	"Auto"						: "自动化",
	"TriggerReAutoMap"			: "触发重新自动化",
	"ManualRec"					: "人工重建",
	"Reconstruction"			: "重建",
	"FeatureMeasure"			: "要素测量",
	"Fusion"					: "融合",
	"TriggerReFusion"			: "触发重新融合",
	"FusionHandle"				: "融合处理",
	"AutoEdit"					: "自动编辑",
	"TriggerReAutoEdit"			: "触发重新自动编辑",
	"AssignEdit"				: "分配编辑",
	"ManualEdit"				: "人工质检",
	"Check"						: "质检",
	"TriggerCheck"				: "触发质检",
	"EditCheck"					: "编辑质检",
	"BackToEdit"				: "打回编辑",
	"Commit"					: "提交Final库",
	"triggerNewTask"			: "触发新的任务",
	"AutoEditLane"				: "自动编辑车道线",
	"AutoEditTrafficSign"		: "自动编辑路牌",
	"AutoEditPole"				: "自动编辑灯杆",
	
	"startService"				: "开始服务",
	"TriggerStartService"		: "重试开始服务",
	"triggerEndService"			: "触发结束服务",
	"endService"				: "结束服务",
	"TriggerEndService"			: "重试结束服务"
}

//-----------------------------------------列表的中文显示----------------------------------------
window.lang = {
    "sProcessing": "加载中...",
	"sLengthMenu": "显示 _MENU_ 项结果",  
	"sZeroRecords": "没有匹配结果",  
	"sInfo": "第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",  
  	"sInfoEmpty": "第 0 至 0 项结果，共 0 项",  
  	"sInfoFiltered": "(由 _MAX_ 项结果过滤)",  
  	"sInfoPostFix": "",  
  	"sSearch": "搜索:",  
  	"sUrl": "",  
  	"sEmptyTable": "空",  
  	"sLoadingRecords": "载入中...",  
  	"sInfoThousands": ",",  
  	"oPaginate": {
      	"sFirst": "首页",  
      	"sPrevious": "上页",  
      	"sNext": "下页",  
      	"sLast": "末页"  
  	},  
};


//-----------------------------------并行流程专用数据-------------------------------------------
var textsAnd = [
	"AssignSurvey",					//分配采集
	"OrigDataUpload",				//原始数据上传
	"OrigDataCheck",				//原数据始质检
	"SurveyDataUpload",				//采集数据导入
	"SurveyDataCheck",				//采集数据质检
	"triggerSurveyDataUpload",		//重新数据导入
	"trackHandle",					//轨迹处理
	"triggerTrackHandle",			//重试轨迹处理
	"SegnetRecognition",			//车道线识别
	"PspnetRecognition",			//路牌识别
	"Resnet1Recognition",			//灯杆识别
	"AutoMapLane",					//自动化车道线
	"AutoMapTrafficSign",			//自动化路牌
	"AutoMapPole",					//自动化灯杆
	"AutoEditLane",					//自动编辑车道线
	"AutoEditTrafficSign",			//自动编辑路牌
	"AutoEditPole",					//自动编辑灯杆
	"AutoEdit",						//自动编辑
	"ManualEdit",					//人工编辑
];


//-----------------------------------其他普通数据-------------------------------------------

//用到的所有流程环节文本显示
var texts = [
	"AssignRFE",					//分配
	"AssignSurvey",					//分配采集
	"Survey",						//采集
	"OrigDataUpload",				//原始数据上传
	"OrigDataCheck",				//原数据始质检
	"TriggerReOrigDataCheck",		//触发重新原数据始质检
	"SurveyDataUpload",				//采集数据导入
	"TriggerReUpload",				//触发重新导入
	"SurveyHandle",					//采集数据导入处理
	"SurveyDataCheck",				//采集数据质检
	"TriggerReSurveyCheck",			//触发重新采集数据质检
	"CreateHandleTasks",			//创建处理任务
	"TriggerReCreateHandleTasks",	//触发重新创建处理任务
	"Recognition",					//识别
	"TriggerReRec",					//触发重新识别
	"AssignRec",					//分配识别处理
	"trackHandle",					//轨迹处理
	"SegnetRecognition",			//车道线识别
	"TriggerReSegnetRec",			//触发重新车道线识别
	"PspnetRecognition",			//路牌识别
	"TriggerRePspnetRec",			//触发重新路牌识别
	"Resnet1Recognition",			//灯杆识别
	"TriggerReResnet1Rec",			//触发重新灯杆识别
	"RecHandle",					//识别处理
	"AutoMapPole",					//自动化灯杆
	"TriggerReAutoMapPole",			//触发重新自动化灯杆
	"AutoMapLane",					//自动化车道线
	"TriggerReAutoMapLane",			//触发重新自动化车道线
	"AutoMapTrafficSign",			//自动化路牌
	"TriggerReAutoMapTrafficSign",	//触发重新自动化路牌
	"Auto",							//自动化
	"TriggerReAutoMap",				//触发重新自动化
	"AutoEditLane",					//自动编辑车道线
	"AutoEditTrafficSign",			//自动编辑路牌
	"AutoEditPole",					//自动编辑灯杆
	"ManualRec",					//人工重建
	"Reconstruction",				//重建
	"FeatureMeasure",				//要素测量
	"Fusion",						//融合
	"TriggerReFusion",				//触发重新融合
	"FusionHandle",					//融合处理
	"AutoEdit",						//自动编辑
	"TriggerReAutoEdit",			//触发重新自动编辑
	"AssignEdit",					//分配编辑
	"CreateTransaction",			//创建事物
	"OpenEdit",						//打开编辑
	"sdEdit",						//地图编辑
    
    'startService',					//开始服务
    'TriggerStartService',			//重试开始服务
    'triggerEndService',			//触发结束服务
    'endService',					//结束服务
    'TriggerEndService',			//重试结束服务
	"triggerNewTask",				//触发新的任务
	"ManualEdit",					//人工编辑
	"TriggerCheck",					//触发质检
	"Check",						//质检
	"EditCheck",					//编辑质检
	"BackToEdit",					//打回编辑
	"Commit",						//提交Final库

]

//初始化时的流程图标             灰色！！！未执行过的流程
var imgs1 = {
    'AssignRFE': "./dist/img/flowing/18_1.png",					//分配
    'AssignSurvey': "./dist/img/flowing/18_1.png",					//分配采集
    'Survey': "./dist/img/flowing/car_1.png",						//采集
    'OrigDataUpload':"./dist/img/flowing/editor_1.png",			//原始数据上传
    'OrigDataCheck':"./dist/img/flowing/cogs_1.png",				//原数据始质检
    'TriggerReOrigDataCheck':"./dist/img/flowing/10_1.png",		//触发重新原数据始质检
    'SurveyDataUpload':"./dist/img/flowing/1_1.png",				//采集数据导入
    'triggerSurveyDataUpload':"./dist/img/flowing/10_1.png",		//重试数据导入
    'TriggerReUpload':"./dist/img/flowing/10_1.png",				//触发重新导入
    'SurveyHandle':"./dist/img/flowing/editor_1.png",				//采集数据导入处理
    'SurveyDataCheck':"./dist/img/flowing/cogs_1.png",				//采集数据质检
    'TriggerReSurveyCheck':"./dist/img/flowing/10_1.png",			//触发重新采集数据质检
    'CreateHandleTasks':"./dist/img/flowing/12_1.png",				//创建处理任务
    'TriggerReCreateHandleTasks':"./dist/img/flowing/10_1.png",	//触发重新创建处理任务
    'Recognition': "./dist/img/flowing/2_1.png",					//识别
    'TriggerReRec':"./dist/img/flowing/10_1.png",					//触发重新识别
	'AssignRec': "./dist/img/flowing/15_1.png",					//分配识别处理
    'trackHandle':"./dist/img/flowing/cogs_1.png",					//轨迹处理
    'triggerTrackHandle':"./dist/img/flowing/editor_1.png",		//重试轨迹处理
    'SegnetRecognition':"./dist/img/flowing/cogs_1.png",			//车道线识别
    'TriggerReSegnetRec':"./dist/img/flowing/editor_1.png",		//触发重新车道线识别
    'PspnetRecognition':"./dist/img/flowing/cogs_1.png",			//路牌识别
    'TriggerRePspnetRec':"./dist/img/flowing/editor_1.png",		//触发重新路牌识别
    'Resnet1Recognition':"./dist/img/flowing/cogs_1.png",			//灯杆识别
    'TriggerReResnet1Rec':"./dist/img/flowing/editor_1.png",		//触发重新灯杆识别
	'RecHandle': "./dist/img/flowing/14_1.png",					//识别处理
	'AutoMapPole': "./dist/img/flowing/cogs_1.png",				//自动化灯杆
	'TriggerReAutoMapPole': "./dist/img/flowing/editor_1.png",		//触发重新自动化灯杆
	'AutoMapLane': "./dist/img/flowing/cogs_1.png",				//自动化车道线
	'TriggerReAutoMapLane': "./dist/img/flowing/editor_1.png",		//触发重新自动化车道线
	'AutoMapTrafficSign': "./dist/img/flowing/cogs_1.png",			//自动化路牌
	'TriggerReAutoMapTrafficSign': "./dist/img/flowing/editor_1.png",//触发重新自动化路牌
	'Auto': "./dist/img/flowing/cogs_1.png",						//自动化
    'TriggerReAutoMap':"./dist/img/flowing/10_1.png",				//触发重新自动化
    
	'AutoEditLane':"./dist/img/flowing/cogs_1.png",				//自动编辑车道线
	'AutoEditTrafficSign':"./dist/img/flowing/cogs_1.png",			//自动编辑路牌
	'AutoEditPole':"./dist/img/flowing/cogs_1.png",				//自动编辑灯杆
    
    
    'ManualRec':"./dist/img/flowing/3_1.png",						//人工重建
    'Reconstruction':"./dist/img/flowing/3_1.png",					//重建
    'FeatureMeasure': "./dist/img/flowing/6_1.png",				//要素测量
    'Fusion':"./dist/img/flowing/4_1.png",							//融合
    'TriggerReFusion':"./dist/img/flowing/10_1.png",				//触发重新融合
    'FusionHandle':"./dist/img/flowing/17_1.png",					//融合处理
    'AutoEdit': "./dist/img/flowing/5_1.png",						//自动编辑
    'TriggerReAutoEdit':"./dist/img/flowing/10_1.png",				//触发重新自动编辑
    'AssignEdit': "./dist/img/flowing/18_1.png",					//分配编辑
    'CreateTransaction': "./dist/img/flowing/12_1.png",			//创建事物
    'OpenEdit': "./dist/img/flowing/13_1.png",						//打开编辑
    'sdEdit': "./dist/img/flowing/7_1.png",						//地图编辑
    
    'startService': "./dist/img/flowing/cogs_1.png",				//开始服务
    'TriggerStartService': "./dist/img/flowing/editor_1.png",		//重试开始服务
    'triggerEndService': "./dist/img/flowing/cogs_1.png",			//触发结束服务
    'endService': "./dist/img/flowing/cogs_1.png",					//结束服务
    'TriggerEndService': "./dist/img/flowing/editor_1.png",		//重试结束服务
    
    'triggerNewTask':"./dist/img/flowing/cogs_1.png",				//触发新的任务
    'ManualEdit': "./dist/img/flowing/7_1.png",					//人工编辑
    'Check': "./dist/img/flowing/8_1.png",							//质检
    'TriggerCheck': "./dist/img/flowing/9_1.png",					//触发质检
    'EditCheck': "./dist/img/flowing/16_1.png",					//编辑质检
    'Commit': "./dist/img/flowing/11_1.png",						//提交Final库
    'BackToEdit': "./dist/img/flowing/10_1.png",					//打回编辑
    
    'userTask': "./dist/img/flowing/editor_3.png",					//人工默认灰色图标
    'manualTask': "./dist/img/flowing/hand_3.png",					//手动默认灰色图标
    'serviceTask': "./dist/img/flowing/cogs_3.png",				//设置默认灰色图标
    'receiveTask': "./dist/img/flowing/cogs_1.png",				//结束默认灰色图标
    'boundaryError': "./dist/img/flowing/error_catch.png",			//错误图标
    'robot': "./dist/img/flowing/robot_1.png",						//智能处理
    'callActivity': "./dist/img/flowing/cogs_1.png",				//默认存在子流程的类型图片
}


//初始化时的流程图标             蓝色！！！执行过的流程
var imgs3 = {
    'AssignRFE': "./dist/img/flowing/18_3.png",					//分配
    'AssignSurvey': "./dist/img/flowing/18_3.png",					//分配采集
    'Survey': "./dist/img/flowing/car_3.png",						//采集
    'OrigDataUpload':"./dist/img/flowing/editor_3.png",			//原始数据上传
    'OrigDataCheck':"./dist/img/flowing/cogs_3.png",				//原数据始质检
    'TriggerReOrigDataCheck':"./dist/img/flowing/10_3.png",		//触发重新原数据始质检
    'SurveyDataUpload':"./dist/img/flowing/1_3.png",				//采集数据导入
    'triggerSurveyDataUpload':"./dist/img/flowing/10_3.png",		//重试数据导入
    'TriggerReUpload':"./dist/img/flowing/10_3.png",				//触发重新导入
    'SurveyHandle':"./dist/img/flowing/editor_3.png",				//采集数据导入处理
    'SurveyDataCheck':"./dist/img/flowing/cogs_3.png",				//采集数据质检
    'TriggerReSurveyCheck':"./dist/img/flowing/10_3.png",			//触发重新采集数据质检
    'CreateHandleTasks':"./dist/img/flowing/12_3.png",				//创建处理任务
    'TriggerReCreateHandleTasks':"./dist/img/flowing/10_3.png",	//触发重新创建处理任务
    'Recognition': "./dist/img/flowing/2_3.png",					//识别
    'TriggerReRec':"./dist/img/flowing/10_3.png",					//触发重新识别
	'AssignRec': "./dist/img/flowing/15_3.png",					//分配识别处理
    'trackHandle':"./dist/img/flowing/cogs_3.png",					//轨迹处理
    'triggerTrackHandle':"./dist/img/flowing/editor_3.png",		//重试轨迹处理
    'SegnetRecognition':"./dist/img/flowing/cogs_3.png",			//车道线识别
    'TriggerReSegnetRec':"./dist/img/flowing/editor_3.png",		//触发重新车道线识别
    'PspnetRecognition':"./dist/img/flowing/cogs_3.png",			//路牌识别
    'TriggerRePspnetRec':"./dist/img/flowing/editor_3.png",		//触发重新路牌识别
    'Resnet1Recognition':"./dist/img/flowing/cogs_3.png",			//灯杆识别
    'TriggerReResnet1Rec':"./dist/img/flowing/editor_3.png",		//触发重新灯杆识别
	'RecHandle': "./dist/img/flowing/14_3.png",					//识别处理
	'AutoMapPole': "./dist/img/flowing/cogs_3.png",				//自动化灯杆
	'TriggerReAutoMapPole': "./dist/img/flowing/editor_3.png",		//触发重新自动化灯杆
	'AutoMapLane': "./dist/img/flowing/cogs_3.png",				//自动化车道线
	'TriggerReAutoMapLane': "./dist/img/flowing/editor_3.png",		//触发重新自动化车道线
	'AutoMapTrafficSign': "./dist/img/flowing/cogs_3.png",			//自动化路牌
	'TriggerReAutoMapTrafficSign': "./dist/img/flowing/editor_3.png",//触发重新自动化路牌
	'Auto': "./dist/img/flowing/cogs_3.png",						//自动化
    'TriggerReAutoMap':"./dist/img/flowing/10_3.png",				//触发重新自动化
    
	'AutoEditLane':"./dist/img/flowing/cogs_3.png",				//自动编辑车道线
	'AutoEditTrafficSign':"./dist/img/flowing/cogs_3.png",			//自动编辑路牌
	'AutoEditPole':"./dist/img/flowing/cogs_3.png",				//自动编辑灯杆
    
    
    'ManualRec':"./dist/img/flowing/3_3.png",						//人工重建
    'Reconstruction':"./dist/img/flowing/3_3.png",					//重建
    'FeatureMeasure': "./dist/img/flowing/6_3.png",				//要素测量
    'Fusion':"./dist/img/flowing/4_3.png",							//融合
    'TriggerReFusion':"./dist/img/flowing/10_3.png",				//触发重新融合
    'FusionHandle':"./dist/img/flowing/17_3.png",					//融合处理
    'AutoEdit': "./dist/img/flowing/5_3.png",						//自动编辑
    'TriggerReAutoEdit':"./dist/img/flowing/10_3.png",				//触发重新自动编辑
    'AssignEdit': "./dist/img/flowing/18_3.png",					//分配编辑
    'CreateTransaction': "./dist/img/flowing/12_3.png",			//创建事物
    'OpenEdit': "./dist/img/flowing/13_3.png",						//打开编辑
    'sdEdit': "./dist/img/flowing/7_3.png",						//地图编辑
    
    'startService': "./dist/img/flowing/cogs_3.png",				//开始服务
    'TriggerStartService': "./dist/img/flowing/editor_3.png",		//重试开始服务
    'triggerEndService': "./dist/img/flowing/cogs_3.png",			//触发结束服务
    'endService': "./dist/img/flowing/cogs_3.png",					//结束服务
    'TriggerEndService': "./dist/img/flowing/editor_3.png",		//重试结束服务
    
    'triggerNewTask':"./dist/img/flowing/cogs_3.png",				//触发新的任务
    'ManualEdit': "./dist/img/flowing/7_3.png",					//人工编辑
    'Check': "./dist/img/flowing/8_3.png",							//质检
    'TriggerCheck': "./dist/img/flowing/9_3.png",					//触发质检
    'EditCheck': "./dist/img/flowing/16_3.png",					//编辑质检
    'Commit': "./dist/img/flowing/11_3.png",						//提交Final库
    'BackToEdit': "./dist/img/flowing/10_3.png",					//打回编辑
    
    'userTask': "./dist/img/flowing/editor_3.png",					//人工默认灰色图标
    'manualTask': "./dist/img/flowing/hand_3.png",					//手动默认灰色图标
    'serviceTask': "./dist/img/flowing/cogs_3.png",				//设置默认灰色图标
    'receiveTask': "./dist/img/flowing/cogs_3.png",				//结束默认灰色图标
    'boundaryError': "./dist/img/flowing/error_catch.png",			//错误图标
    'robot': "./dist/img/flowing/robot_3.png",						//智能处理
    'callActivity': "./dist/img/flowing/cogs_3.png",				//默认存在子流程的类型图片
}


//需要修改的图标             动图！！！正在执行的流程
var imgs2 = {
    'AssignRFE': "./dist/img/flowing/18_2.gif",					//分配
    'AssignSurvey': "./dist/img/flowing/18_2.gif",					//分配采集
    'Survey': "./dist/img/flowing/car_2.gif",						//采集
    'OrigDataUpload':"./dist/img/flowing/editor_2.gif",			//原始数据上传
    'OrigDataCheck':"./dist/img/flowing/cogs_2.gif",				//原数据始质检
    'TriggerReOrigDataCheck':"./dist/img/flowing/10_2.gif",		//触发重新原数据始质检
    'SurveyDataUpload':"./dist/img/flowing/1_2.gif",				//采集数据导入
    'triggerSurveyDataUpload':"./dist/img/flowing/10_2.gif",		//重试数据导入
    'TriggerReUpload':"./dist/img/flowing/10_2.gif",				//触发重新导入
    'SurveyHandle':"./dist/img/flowing/editor_2.gif",				//采集数据导入处理
    'SurveyDataCheck':"./dist/img/flowing/cogs_2.gif",				//采集数据质检
    'TriggerReSurveyCheck':"./dist/img/flowing/10_2.gif",			//触发重新采集数据质检
    'CreateHandleTasks':"./dist/img/flowing/12_2.gif",				//创建处理任务
    'TriggerReCreateHandleTasks':"./dist/img/flowing/10_2.gif",	//触发重新创建处理任务
    'Recognition': "./dist/img/flowing/2_2.gif",					//识别
    'TriggerReRec':"./dist/img/flowing/10_2.gif",					//触发重新识别
	'AssignRec': "./dist/img/flowing/15_2.gif",					//分配识别处理
    'trackHandle':"./dist/img/flowing/cogs_2.gif",					//轨迹处理
    'triggerTrackHandle':"./dist/img/flowing/editor_2.gif",		//重试轨迹处理
    'SegnetRecognition':"./dist/img/flowing/cogs_2.gif",			//车道线识别
    'TriggerReSegnetRec':"./dist/img/flowing/editor_2.gif",		//触发重新车道线识别
    'PspnetRecognition':"./dist/img/flowing/cogs_2.gif",			//路牌识别
    'TriggerRePspnetRec':"./dist/img/flowing/editor_2.gif",		//触发重新路牌识别
    'Resnet1Recognition':"./dist/img/flowing/cogs_2.gif",			//灯杆识别
    'TriggerReResnet1Rec':"./dist/img/flowing/editor_2.gif",		//触发重新灯杆识别
	'RecHandle': "./dist/img/flowing/14_2.gif",					//识别处理
	'AutoMapPole': "./dist/img/flowing/cogs_2.gif",				//自动化灯杆
	'TriggerReAutoMapPole': "./dist/img/flowing/editor_2.gif",		//触发重新自动化灯杆
	'AutoMapLane': "./dist/img/flowing/cogs_2.gif",				//自动化车道线
	'TriggerReAutoMapLane': "./dist/img/flowing/editor_2.gif",		//触发重新自动化车道线
	'AutoMapTrafficSign': "./dist/img/flowing/cogs_2.gif",			//自动化车道线
	'TriggerReAutoMapTrafficSign': "./dist/img/flowing/editor_2.gif",//触发重新自动化车道线
	'Auto': "./dist/img/flowing/cogs_2.gif",						//自动化
    'TriggerReAutoMap':"./dist/img/flowing/10_2.gif",				//触发重新自动化
    'ManualRec':"./dist/img/flowing/3_2.gif",						//人工重建
    'Reconstruction':"./dist/img/flowing/3_2.gif",					//重建
    'FeatureMeasure': "./dist/img/flowing/6_2.gif",				//要素测量
    'Fusion':"./dist/img/flowing/4_2.gif",							//融合
    'TriggerReFusion':"./dist/img/flowing/10_2.gif",				//触发重新融合
    'FusionHandle':"./dist/img/flowing/17_2.gif",					//融合处理
    'AutoEdit': "./dist/img/flowing/5_2.gif",						//自动编辑
    'TriggerReAutoEdit':"./dist/img/flowing/10_2.gif",				//触发重新自动编辑
    'AssignEdit': "./dist/img/flowing/18_2.gif",					//分配编辑
    'CreateTransaction': "./dist/img/flowing/12_2.gif",			//创建事物
    'OpenEdit': "./dist/img/flowing/13_2.gif",						//打开编辑
    'sdEdit': "./dist/img/flowing/7_2.gif",						//地图编辑
    
    'startService': "./dist/img/flowing/cogs_2.gif",				//开始服务
    'TriggerStartService': "./dist/img/flowing/editor_2.gif",		//重试开始服务
    'triggerEndService': "./dist/img/flowing/cogs_2.gif",			//触发结束服务
    'endService': "./dist/img/flowing/cogs_2.gif",					//结束服务
    'TriggerEndService': "./dist/img/flowing/editor_2.gif",		//重试结束服务
    'triggerNewTask':"./dist/img/flowing/7_2.gif",					//触发新的任务
    'ManualEdit': "./dist/img/flowing/7_2.gif",					//人工编辑
    'Check': "./dist/img/flowing/8_2.gif",							//质检
    'TriggerCheck': "./dist/img/flowing/9_2.gif",					//触发质检
    'EditCheck': "./dist/img/flowing/16_2.gif",					//编辑质检
    'Commit': "./dist/img/flowing/11_2.gif",						//提交Final库
    'BackToEdit': "./dist/img/flowing/10_2.gif",					//打回编辑
    
	"AutoEditLane": "./dist/img/flowing/cogs_2.gif",				//自动编辑车道线
	"AutoEditTrafficSign": "./dist/img/flowing/cogs_2.gif",		//自动编辑路牌
	"AutoEditPole": "./dist/img/flowing/cogs_2.gif",				//自动编辑灯杆
    'userTask': "./dist/img/flowing/editor_2.gif",					//人工当前环节默认动态图标
    'manualTask': "./dist/img/flowing/hand_2.gif",					//手动当前环节默认动态图标
    'serviceTask': "./dist/img/flowing/cogs_2.gif",				//设置当前环节默认动态图标
    'receiveTask': "./dist/img/flowing/cogs_2.gif",				//结束当前环节默认动态图标
    'boundaryError': "./dist/img/flowing/error_catch.png",			//错误图标
    'robot': "./dist/img/flowing/robot_2.gif",						//智能处理
    'callActivity': "./dist/img/flowing/cogs_2.gif",				//默认存在子流程的类型图片
}

var serviceList = {
	"kcs-edit": "母库检查服务",
	"kcs-survey": "采集入库检查服务",
	"kcs-survey-origdata": "采集原始资料检查服务",
	"kds-autoedit": "自动编辑服务",
	"kds-data": "数据存储服务",
	"kds-meta": "元数据服务",
	"krms": "融合资料库服务",
	"krs": "资料库服务",
	"krs-fusion": "融合资料库服务",
	"kss-automap-lane": "自动化车道线服务",
	"kss-automao-trafficboard": "自动化小路牌服务",
	"kss-decognition-detection-tsinghua": "识别小路牌服务",
	"kss-recognition-pspnet": "识别路牌服务",
	"kss-recognition-resnet1": "识别灯杆服务",
	"kss-recognition-resnet-road": "识别车道线服务",
	"kss-upload": "采集数据上传服务",
	"kss-automap-trafficsign": "自动化路牌服务",
	"kss-automap-pole": "自动化灯杆服务",
	"kss-fusion": "融合服务"
}