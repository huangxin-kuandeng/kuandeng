//初始化类型
var imageList = {
	
//	初始化箭头标记类型
	imageName:[
//		{ url: "arrow_0", name: "其他", id: "0" },
//		{ url: "arrow_12", name: "文字", id: "12" },
//		{ url: "arrow_13", name: "数字", id: "13" },
//		{ url: "arrow_14", name: "符号", id: "14" },
//		{ url: "arrow_15", name: "箭头识别不完整", id: "15" },
		{ url: "arrow_1", name: "直行标志", id: "1" },
		{ url: "arrow_2", name: "前方左转标志", id: "2" },
		{ url: "arrow_3", name: "前方右转标志", id: "3" },
		{ url: "arrow_4", name: "掉头标志", id: "4" },
		{ url: "arrow_5", name: "汇入标志", id: "5" },
		{ url: "arrow_4", name: "直行或左转标志", id: "6" },
		{ url: "arrow_5", name: "直行或右转标志", id: "7" },
		{ url: "arrow_7", name: "前方可直行或掉头标志", id: "8" },
		{ url: "arrow_8", name: "前方可左转或掉头标志", id: "9" },
		{ url: "arrow_9", name: "前方道路仅可左右转弯标志", id: "10" },
		{ url: "arrow_9", name: "直行加左右转标志", id: "11" },
		{ url: "arrow_9", name: "右转加掉头标志", id: "12" },
		{ url: "arrow_6", name: "直行加掉头标志", id: "13" }
//		{ url: "arrow_6", name: "前方掉头标志", id: "11" },
//		{ url: "arrow_10", name: "前方道路有左弯或需向左合流标", id: "10" },
//		{ url: "arrow_11", name: "前方道路有右弯或需向右合流标", id: "11" }
	],
	
	imageName1:{
//		初始化路牌警告标记类型
		warning:[
			{ url: "warning_w0", name: "其他", id: "w0" },
			{ url: "warning_w1", name: "傍山险路", id: "w1" },
			{ url: "warning_w2", name: "村庄", id: "w2" },
			{ url: "warning_w3", name: "堤坝路", id: "w3" },
			{ url: "warning_w4", name: "注意分离式道路", id: "w4" },
			{ url: "warning_w5", name: "渡口", id: "w5" },
			{ url: "warning_w6", name: "两侧变窄", id: "w6" },
			{ url: "warning_w7", name: "左侧变窄", id: "w7" },
			{ url: "warning_w8", name: "右侧变窄", id: "w8" },
			{ url: "warning_w9", name: "窄桥", id: "w9" },
			{ url: "warning_w10", name: "注意落石", id: "w10" },
			{ url: "warning_w11", name: "反向弯路", id: "w11" },
			{ url: "warning_w12", name: "过水路面", id: "w12" },
			{ url: "warning_w13", name: "十字路口", id: "w13" },
			{ url: "warning_w14", name: "十字交叉路口", id: "w14" },
			{ url: "warning_w15", name: "Y形交叉路口", id: "w15" },
			{ url: "warning_w16", name: "T形交叉路口", id: "w16" },
			{ url: "warning_w17", name: "环形交叉路口", id: "w17" },
			{ url: "warning_w18", name: "连续弯路", id: "w18" },
			{ url: "warning_w19", name: "连续下坡", id: "w19" },
			{ url: "warning_w20", name: "路面不平", id: "w20" },
			{ url: "warning_w21", name: "注意雨雪天气", id: "w21" },
			{ url: "warning_w22", name: "路面低洼", id: "w22" },
			{ url: "warning_w23", name: "路面高突", id: "w23" },
			{ url: "warning_w24", name: "慢行", id: "w24" },
			{ url: "warning_w25", name: "上陡坡", id: "w25" },
			{ url: "warning_w26", name: "下陡坡", id: "w26" },
			{ url: "warning_w27", name: "施工", id: "w27" },
			{ url: "warning_w28", name: "事故易发路段", id: "w28" },
			{ url: "warning_w29", name: "双向交通", id: "w29" },
			{ url: "warning_w30", name: "注意野生动物", id: "w30" },
			{ url: "warning_w31", name: "隧道", id: "w31" },
			{ url: "warning_w32", name: "隧道开车灯", id: "w32" },
			{ url: "warning_w33", name: "驼峰桥", id: "w33" },
			{ url: "warning_w34", name: "无人看守铁路道口", id: "w34" },
			{ url: "warning_w35", name: "有人看守铁道路口", id: "w35" },
			{ url: "warning_w36", name: "叉形符号", id: "w36" },
			{ url: "warning_w37", name: "斜杠符号", id: "w37" },
			{ url: "warning_w38", name: "向右急弯路", id: "w38" },
			{ url: "warning_w39", name: "向左急弯路", id: "w39" },
			{ url: "warning_w40", name: "易滑", id: "w40" },
			{ url: "warning_w41", name: "注意信号灯", id: "w41" },
			{ url: "warning_w42", name: "注意障碍物左侧通行", id: "w42" },
			{ url: "warning_w43", name: "注意障碍物两侧通行", id: "w43" },
			{ url: "warning_w44", name: "注意障碍物右侧通行", id: "w44" },
			{ url: "warning_w45", name: "注意保持车距", id: "w45" },
			{ url: "warning_w46", name: "注意不利气象条件", id: "w46" },
			{ url: "warning_w47", name: "注意残疾人", id: "w47" },
			{ url: "warning_w48", name: "注意潮汐车道", id: "w48" },
			{ url: "warning_w49", name: "注意雾天", id: "w49" },
			{ url: "warning_w50", name: "注意儿童", id: "w50" },
			{ url: "warning_w51", name: "注意行人", id: "w51" },
			{ url: "warning_w52", name: "注意非机动车", id: "w52" },
			{ url: "warning_w53", name: "注意左侧合流", id: "w53" },
			{ url: "warning_w54", name: "注意右侧合流", id: "w54" },
			{ url: "warning_w55", name: "注意横向风", id: "w55" },
			{ url: "warning_w56", name: "注意路面结冰", id: "w56" },
			{ url: "warning_w57", name: "注意危险", id: "w57" },
			{ url: "warning_w58", name: "注意牲畜", id: "w58" },
			{ url: "warning_w59", name: "注意前方车辆排队", id: "w59" },
			{ url: "warning_w60", name: "建议速度", id: "w60" },
			{ url: "warning_w61", name: "避险车道", id: "w61" }
		],
//		初始化路牌禁止标记类型
		prohibit:[
			{ url: "prohibit_p0", name: "其他", id: "p0" },
			{ url: "prohibit_p1", name: "禁止超车", id: "p1" },
			{ url: "prohibit_p2", name: "解除禁止超车", id: "p2" },
			{ url: "prohibit_p3", name: "禁止畜力车驶入", id: "p3" },
			{ url: "prohibit_p4", name: "禁止大型客车驶入", id: "p4" },
			{ url: "prohibit_p5", name: "禁止电动三轮车驶入", id: "p5" },
			{ url: "prohibit_p6", name: "禁止掉头", id: "p6" },
			{ url: "prohibit_p7", name: "禁止非机动车驶入", id: "p7" },
			{ url: "prohibit_p8", name: "禁止载货汽车左转", id: "p8" },
			{ url: "prohibit_p9", name: "禁止挂车半挂车驶入", id: "p9" },
			{ url: "prohibit_p10", name: "禁止行人进入", id: "p10" },
			{ url: "prohibit_p11", name: "禁止机动车驶入", id: "p11" },
			{ url: "prohibit_p12", name: "禁止鸣喇叭", id: "p12" },
			{ url: "prohibit_p13", name: "禁止摩托车驶入", id: "p13" },
			{ url: "prohibit_p14", name: "禁止某两种车驶入", id: "p14" },
			{ url: "prohibit_p15", name: "禁止直行", id: "p15" },
			{ url: "prohibit_p16", name: "禁止人力车驶入", id: "p16" },
			{ url: "prohibit_p17", name: "禁止人力货运三轮车驶入", id: "p17" },
			{ url: "prohibit_p18", name: "禁止人力客运三轮车驶入", id: "p18" },
			{ url: "prohibit_p19", name: "禁止三轮汽车、低速货车驶入", id: "p19" },
			{ url: "prohibit_p20", name: "禁止右转弯", id: "p20" },
			{ url: "prohibit_p21", name: "禁止左右转弯", id: "p21" },
			{ url: "prohibit_p22", name: "禁止直行和右转弯", id: "p22" },
			{ url: "prohibit_p23", name: "禁止向左转弯", id: "p23" },
			{ url: "prohibit_p24", name: "禁止小客车右转", id: "p24" },
			{ url: "prohibit_p25", name: "禁止小型客车驶入", id: "p25" },
			{ url: "prohibit_p26", name: "禁止载货汽车驶入", id: "p26" },
			{ url: "prohibit_p27", name: "禁止运载危险物品车辆驶入", id: "p27" },
			{ url: "prohibit_p28", name: "禁止直行或向左转弯", id: "p28" },
			{ url: "prohibit_p29", name: "禁止拖拉机驶入", id: "p29" },
			{ url: "prohibit_p30", name: "限制轴重", id: "p30" },
			{ url: "prohibit_p31", name: "禁止通行", id: "p31" },
			{ url: "prohibit_p32", name: "停车检查", id: "p32" },
			{ url: "prohibit_p33", name: "海关", id: "p33" },
			{ url: "prohibit_p34", name: "会车让行", id: "p34" },
			{ url: "prohibit_p35", name: "减速让行", id: "p35" },
			{ url: "prohibit_p36", name: "限制高度", id: "p36" },
			{ url: "prohibit_p37", name: "限制速度", id: "p37" },
			{ url: "prohibit_p38", name: "限制质量", id: "p38" },
			{ url: "prohibit_p39", name: "区域禁止停车", id: "p39" },
			{ url: "prohibit_p40", name: "禁止驶入", id: "p40" },
			{ url: "prohibit_p41", name: "禁止长时间停车", id: "p41" },
			{ url: "prohibit_p42", name: "解除限制速度", id: "p42" },
			{ url: "prohibit_p43", name: "停车让行", id: "p43" },
			{ url: "prohibit_p44", name: "限制宽度", id: "p44" },
			{ url: "prohibit_p45", name: "禁止载货货车及拖拉机左转弯", id: "p45" },
			{ url: "prohibit_p46", name: "禁止停车", id: "p46" },
			{ url: "prohibit_p47", name: "区域限制速度", id: "p47" },
			{ url: "prohibit_p48", name: "区域限制速度解除", id: "p48" },
			{ url: "prohibit_p49", name: "区域禁止长时间停车", id: "p49" }
		],
//		初始化路牌指示标记类型
		instruct:[
			{ url: "instruct_i0", name: "其他", id: "i0" },
			{ url: "instruct_i1", name: "步行", id: "i1" },
			{ url: "instruct_i2", name: "非机动车行驶", id: "i2" },
			{ url: "instruct_i3", name: "环岛行驶", id: "i3" },
			{ url: "instruct_i4", name: "机动车行驶", id: "i4" },
			{ url: "instruct_i5", name: "靠右侧道路行驶", id: "i5" },
			{ url: "instruct_i6", name: "靠左侧道路行驶", id: "i6" },
			{ url: "instruct_i7", name: "立体交叉直行和右转弯行驶", id: "i7" },
			{ url: "instruct_i8", name: "立体交叉直行和左转弯行驶", id: "i8" },
			{ url: "instruct_i9", name: "鸣喇叭", id: "i9" },
			{ url: "instruct_i10", name: "向右转弯", id: "i10" },
			{ url: "instruct_i11", name: "向左和向右转弯", id: "i11" },
			{ url: "instruct_i12", name: "向左转弯", id: "i12" },
			{ url: "instruct_i13", name: "直行", id: "i13" },
			{ url: "instruct_i14", name: "直行和向右转弯", id: "i14" },
			{ url: "instruct_i15", name: "直行和向左转弯", id: "i15" },
			{ url: "instruct_i16", name: "最低限速", id: "i16" },
			{ url: "instruct_i17", name: "人行横道", id: "i17" },
			{ url: "instruct_i18", name: "单行路直行", id: "i18" },
			{ url: "instruct_i19", name: "路口优先通行", id: "i19" },
			{ url: "instruct_i20", name: "允许掉头", id: "i20" },
			{ url: "instruct_i21", name: "会车先行", id: "i21" },
			{ url: "instruct_i22", name: "右转车道", id: "i22" },
			{ url: "instruct_i23", name: "左转车道", id: "i23" },
			{ url: "instruct_i24", name: "直行车道", id: "i24" },
			{ url: "instruct_i25", name: "直行和右转何用车道", id: "i25" },
			{ url: "instruct_i26", name: "直行和左转何用车道", id: "i26" },
			{ url: "instruct_i27", name: "掉头车道", id: "i27" },
			{ url: "instruct_i28", name: "掉头和左转合用车道", id: "i28" },
			{ url: "instruct_i29", name: "分向行驶车道", id: "i29" },
			{ url: "instruct_i30", name: "公交专用车道", id: "i30" },
			{ url: "instruct_i31", name: "机动车车道", id: "i31" },
			{ url: "instruct_i32", name: "非机动车车道", id: "i32" },
			{ url: "instruct_i33", name: "快速公交系统专用车道", id: "i33" },
			{ url: "instruct_i34", name: "多成员车辆专用道", id: "i34" },
			{ url: "instruct_i35", name: "停车位", id: "i35" },
			{ url: "instruct_i36", name: "特殊停车位", id: "i36" }
		]
	}
}

	
//	鼠标监听事件(判断左右箭头进入上一帧和下一帧)
document.onkeydown = function(event){
	if( (event.key == "ArrowRight") || (event.key == "d") ){
		imgMain.nextImage();
	}else if( (event.key == "ArrowLeft") || (event.key == "a") ){
		imgMain.preImage();
	}
};
