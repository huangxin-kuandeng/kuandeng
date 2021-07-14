/**
 * Represents a canvas on which BPMN 2.0 constructs can be drawn.
 * 
 * Some of the icons used are licenced under a Creative Commons Attribution 2.5
 * License, see http://www.famfamfam.com/lab/icons/silk/
 * 
 * @see ProcessDiagramGenerator
 * @author (Java) Joram Barrez
 * @author (Javascript) Dmitry Farafonov
 */

//Color.Cornsilk

var ARROW_HEAD_SIMPLE = "simple";
var ARROW_HEAD_EMPTY = "empty";
var ARROW_HEAD_FILL = "FILL";
var MULTILINE_VERTICAL_ALIGN_TOP = "top";
var MULTILINE_VERTICAL_ALIGN_MIDDLE = "middle";
var MULTILINE_VERTICAL_ALIGN_BOTTOM = "bottom";
var MULTILINE_HORIZONTAL_ALIGN_LEFT = "start";
var MULTILINE_HORIZONTAL_ALIGN_MIDDLE = "middle";
var MULTILINE_HORIZONTAL_ALIGN_RIGHT = "end";
var LENGTH = 0;
// Predefined sized
var TEXT_PADDING = 3;
var ARROW_WIDTH = 4;
var CONDITIONAL_INDICATOR_WIDTH = 16;
var MARKER_WIDTH = 12;
var ANNOTATION_TEXT_PADDING = 7;

// Colors
var TASK_COLOR = Color.OldLace; // original: Color.get(255, 255, 204);
var TASK_STROKE_COLOR = Color.black; /*Color.SlateGrey; */
//var EXPANDED_SUBPROCESS_ATTRS = Color.black; /*Color.SlateGrey; */
var BOUNDARY_EVENT_COLOR = Color.white;
var CONDITIONAL_INDICATOR_COLOR = Color.get(255, 255, 255);
var HIGHLIGHT_COLOR = Color.Firebrick1;
var ARROWHIGHLIGHT_COLOR = Color.LimeGreen;
//var ARROWHIGHLIGHT_COLOR = Color.SteelBlue2;
//var SEQUENCEFLOW_COLOR = Color.DimGrey;
var SEQUENCEFLOW_COLOR = Color.black;

var CATCHING_EVENT_COLOR = Color.black; /* Color.SlateGrey; */
var START_EVENT_COLOR = Color.get(251,251,251);
var START_EVENT_STROKE_COLOR = Color.black; /* Color.SlateGrey; */
var END_EVENT_COLOR = Color.get(251,251,251);
//var END_EVENT_STROKE_COLOR = Color.black;
var NONE_END_EVENT_COLOR = Color.Firebrick4;
var NONE_END_EVENT_STROKE_COLOR = Color.Firebrick4;
var ERROR_END_EVENT_COLOR = Color.Firebrick;
var ERROR_END_EVENT_STROKE_COLOR = Color.Firebrick;
//var LABEL_COLOR = Color.get(112, 146, 190);
var LABEL_COLOR = Color.get(72, 106, 150);

// Fonts
var NORMAL_FONT = {font: "10px Arial", opacity: 1, fill: Color.black};
//判断文字提示-属性(例如"检查不通过")
var LABEL_FONT = {font: "11px Arial", "font-style":"italic", opacity: 1, "fill": LABEL_COLOR};
//错误文字提示-属性(例如"Error")
var LABEL_FONT_SMOOTH = {font: "10px Arial", "font-style":"italic", opacity: 1, "fill": LABEL_COLOR, stroke: LABEL_COLOR, "stroke-width":.4};
var TASK_FONT = {font: "11px Arial", opacity: 1, fill: Color.black};
//流程的文字-属性
var TASKCHANGE_FONT = {font: "16px Arial", opacity: 1, fill: Color.black};
var TASKCHANGE_FONT_TIME = {font: "14px Arial", opacity: 1, fill: Color.gray};
var TASK_FONT_SMOOTH = {font: "11px Arial", opacity: 1, fill: Color.black, stroke: LABEL_COLOR, "stroke-width":.4};
var POOL_LANE_FONT = {font: "11px Arial", opacity: 1, fill: Color.black};
var EXPANDED_SUBPROCESS_FONT = {font: "11px Arial", opacity: 1, fill: Color.black};

// Strokes
var NORMAL_STROKE = 1;
var SEQUENCEFLOW_STROKE = 1.5;
var SEQUENCEFLOW_HIGHLIGHT_STROKE = 2;
var THICK_TASK_BORDER_STROKE = 2.5;
var GATEWAY_TYPE_STROKE = 3.2;
var END_EVENT_STROKE = NORMAL_STROKE+2;
var MULTI_INSTANCE_STROKE = 1.3;
var EVENT_SUBPROCESS_ATTRS = 	{"stroke": Color.black, "stroke-width": NORMAL_STROKE, "stroke-dasharray": ". "};
//var EXPANDED_SUBPROCESS_ATTRS = {"stroke": Color.black, "stroke-width": NORMAL_STROKE, "fill": Color.FloralWhite};
var EXPANDED_SUBPROCESS_ATTRS = {"stroke": Color.black, "stroke-width": NORMAL_STROKE, "fill": Color.WhiteSmoke};
var NON_INTERRUPTING_EVENT_STROKE = "- ";

var TASK_CORNER_ROUND = 10;
var EXPANDED_SUBPROCESS_CORNER_ROUND = 10;

// icons(流程图片)
var ICON_SIZE = 16;					//图片尺寸大小相关数据
var ICON_PADDING = 4;				//原来的图片增加位置
//var USERTASK_IMAGE = 		"./diagram-viewer/images/deployer/user.png";
var SCRIPTTASK_IMAGE = 		"./diagram-viewer/images/deployer/script.png";
//var SERVICETASK_IMAGE = 	"./diagram-viewer/images/deployer/service.png";
//var RECEIVETASK_IMAGE = 	"./diagram-viewer/images/deployer/receive.png";
var SENDTASK_IMAGE = 		"./diagram-viewer/images/deployer/send.png";
//var MANUALTASK_IMAGE = 		"./diagram-viewer/images/deployer/manual.png";
var BUSINESS_RULE_TASK_IMAGE = "./diagram-viewer/images/deployer/business_rule.png";
var TIMER_IMAGE = 			"./diagram-viewer/images/deployer/timer.png";
var MESSAGE_CATCH_IMAGE = 	"./diagram-viewer/images/deployer/message_catch.png";
var MESSAGE_THROW_IMAGE = 	"./diagram-viewer/images/deployer/message_throw.png";
var ERROR_THROW_IMAGE = 	"./diagram-viewer/images/deployer/error_throw.png";
var ERROR_CATCH_IMAGE = 	"./diagram-viewer/images/deployer/error_catch.png";
var SIGNAL_CATCH_IMAGE = 	"./diagram-viewer/images/deployer/signal_catch.png";
var SIGNAL_THROW_IMAGE = 	"./diagram-viewer/images/deployer/signal_throw.png";
var MULTIPLE_CATCH_IMAGE = 	"./diagram-viewer/images/deployer/multiple_catch.png";
//默认初始图片
var USERTASK_IMAGE = 		"./dist/img/flowing/editor_1.png";
var ROBOT_IMAGE = 		"./dist/img/flowing/robot_1.png";
var MANUALTASK_IMAGE = 		"./dist/img/flowing/hand_1.png";
var SERVICETASK_IMAGE = 	"./dist/img/flowing/cogs_1.png";
var CALLACTIVITY_IMAGE = 	"./dist/img/flowing/cogs_1.png";
var RECEIVETASK_IMAGE = 	"./dist/img/flowing/cogs_1.png";

var ObjectType = {
	ELLIPSE: "ellipse",
	FLOW: "flow",
	RECT: "rect",
	RHOMBUS: "rhombus"
};

function OBJ(type){
	this.c = null;
	this.type = type;
	this.nestedElements = [];
};
OBJ.prototype = {
	
};

var CONNECTION_TYPE = {
	SEQUENCE_FLOW: "sequence_flow",
	MESSAGE_FLOW: "message_flow",
	ASSOCIATION: "association"
};

var objName = false;

var ProcessDiagramCanvas = function(){
};
ProcessDiagramCanvas.prototype = {
// var DefaultProcessDiagramCanvas = {
	canvasHolder: "holder",
	canvasWidth: 0, 
	canvasHeight: 0,
	paint: Color.black,
	strokeWidth: 0,
	font: null,
	fontSmoothing: null,
	
	g: null,
	ninjaPaper: null,
	
	objects: [],
	
	processDefinitionId: null,
	activity: null,
	
	frame: null,
	
	
	debug: false,
	/**
	* Creates an empty canvas with given width and height.
	*/
//	整体外部父级的属性(canvas的初始化)
	init: function(width, height, processDefinitionId){
		this.canvasWidth = width;
		this.canvasHeight = height;
		
		// TODO: name it as 'canvasName'
		if (!processDefinitionId)
			processDefinitionId = "holder";
		
		this.processDefinitionId = processDefinitionId;
		this.canvasHolder = this.processDefinitionId;
		
		var h = document.getElementById(this.canvasHolder);
		if (!h) return;
		
		h.style.width = this.canvasWidth;
		h.style.height = this.canvasHeight;
		
		this.g = Raphael(this.canvasHolder);
		var Plength = ProcessDiagramGenerator._activities.length;
		
        if( (processDefinitionId.indexOf("S-ServiceProcess") >= 0) ){
        	objName = true;
        	this.g.canvas.style.background = "#DDD";
//        	判断是否为子流程(服务流程)
        }else{
        	objName = false;
//        	不是子流程执行缩放
			if(Plength <= 10){
				this.g.canvas.setAttribute("viewBox","0 0 1500 500");
			}else if((10 < Plength) && (Plength < 15)){
				this.g.canvas.setAttribute("viewBox","0 0 1600 550");
			}else if((15 <= Plength) && (Plength < 20)){
				this.g.canvas.setAttribute("viewBox","0 0 1600 600");
			}else if( (20 <= Plength) ){
				this.g.canvas.setAttribute("viewBox","0 0 1600 675");
			}
			
			if(Plength == 13){
				this.g.canvas.setAttribute("viewBox","0 0 1600 650");
			}
        }

		this.g.clear();
		//this.setPaint(Color.DimGrey);
		this.setPaint(Color.black);
		//this.setPaint(Color.white);
		this.setStroke(NORMAL_STROKE);
		
		//this.setFont("Arial", 11);
		this.setFont(NORMAL_FONT);
		//this.font = this.g.getFont("Arial");
		
		this.fontSmoothing = true;
		
		// ninja!
		var RaphaelOriginal = Raphael;
		this.ninjaPaper =(function (local_raphael) {
			var paper = local_raphael(1, 1, 1, 1, processDefinitionId);
			return paper;
		})(Raphael.ninja());
		Raphael = RaphaelOriginal;
	},
	setPaint: function(color){
		this.paint = color;
	},
	getPaint: function(){
		return this.paint;
	},
	setStroke: function(strokeWidth){
		this.strokeWidth = strokeWidth;
	},
	getStroke: function(){
		return this.strokeWidth;
	},
	/*
	setFont: function(family, weight, style, stretch){
		this.font = this.g.getFont(family, weight);
	},
	*/
	setFont: function(font){
		this.font = font;
	},
	getFont: function(){
		return this.font;
	},
	drawShaddow: function(object){
		var border = object.clone();
			border.attr({"stroke-width": this.strokeWidth + 6, 
						"stroke": Color.white,
						"fill": Color.white,
						"opacity": 0,
						"stroke-dasharray":null});
		//border.toBack();
		object.toFront();
		
		return border;
	},
	
	setConextObject: function(obj){
		this.contextObject = obj;
	},
	getConextObject: function(){
		return this.contextObject;
	},
	setContextToElement: function(object){
		var contextObject = this.getConextObject();
		object.id = contextObject.id;
		object.data("contextObject", contextObject);
	},
	
//	鼠标点击
	onClick: function(event, instance, element){
	  	var overlay = element;
	  	var set = overlay.data("set");
	  	var contextObject = overlay.data("contextObject");
	  	//console.log("["+contextObject.getProperty("type")+"], activityId: " + contextObject.getId());
	  	if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.click) {
	    	var args = [instance, element, contextObject];
	    	ProcessDiagramGenerator.options.on.click.apply(event, args);
	  	}
	},
	
//	鼠标右键点击
	onRightClick: function(event, instance, element){
	  	var overlay = element;
	  	var set = overlay.data("set");
	  	var contextObject = overlay.data("contextObject");
	  	//console.log("[%s], activityId: %s (RIGHTCLICK)", contextObject.getProperty("type"), contextObject.getId());

	  	if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.rightClick) {
	    	var args = [instance, element, contextObject];
	    	ProcessDiagramGenerator.options.on.rightClick.apply(event, args);
	  	}
	},
	
//	鼠标划上
	onHoverIn: function(event, instance, element){
	    var overlay = element;
	    var set = overlay.data("set");
	    var contextObject = overlay.data("contextObject");
	    var border = instance.g.getById(contextObject.id + "_border");
	    	
	    border.attr("opacity", 0.3);

	    // provide callback
	    if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.over) {
	      	var args = [instance, element, contextObject];
	      	ProcessDiagramGenerator.options.on.over.apply(event, args);
	  	}
	},
	 
//	鼠标离开
	onHoverOut: function(event, instance, element){
	   	var overlay = element;
	   	var set = overlay.data("set");
	   	var contextObject = overlay.data("contextObject");

	   	var border = instance.g.getById(contextObject.id + "_border");
	   	border.attr("opacity", 0.0);
	   // provide callback
	   	if (ProcessDiagramGenerator.options && ProcessDiagramGenerator.options.on && ProcessDiagramGenerator.options.on.out) {
	     	var args = [instance, element, contextObject];
	     	ProcessDiagramGenerator.options.on.out.apply(event, args);
	   	}
	  
	 
	},
//	添加环节的边框
	addHandlers: function(set, x, y, width, height, type){
	   	var contextObject = this.getConextObject();

	   	var cx = x+width/2, cy = y+height/2;
	   	if (type == "event") {
	     	var border = this.g.ellipse(cx, cy, width/2+4, height/2+4);
	     	var overlay = this.g.ellipse(cx, cy, width/2, height/2);
	   	} else if (type == "gateway") {
	    // 	rhombus
		    var border = this.g.path( "M" + (x - 4) + " " + (y + (height / 2)) +
		        "L" + (x + (width / 2)) + " " + (y + height + 4) +
		        "L" + (x + width + 4) + " " + (y + (height / 2)) +
		        "L" + (x + (width / 2)) + " " + (y - 4) +
		        "z" );
		    var overlay = this.g.path(  "M" + x + " " + (y + (height / 2)) +
		        "L" + (x + (width / 2)) + " " + (y + height) +
		        "L" + (x + width) + " " + (y + (height / 2)) +
		        "L" + (x + (width / 2)) + " " + y +
		        "z" );
	   	} else if (type == "task") {
	     	var border = this.g.rect(x + 15, y - 7, width-24, 71, TASK_CORNER_ROUND+4);
	     	var overlay = this.g.rect(x, y, width, height, TASK_CORNER_ROUND);
	   		
	   	}
		
	   	border.attr({stroke: Color.get(132,112,255)/*Color.Tan1*/,"stroke-width": 4, opacity: 0.0});
	   	border.id = contextObject.id + "_border";

	   	set.push(border);

	   	overlay.attr({stroke: Color.Orange,"stroke-width": 3, fill: Color.get(0,0,0), opacity: 0.0, cursor: "hand"});
	   	overlay.data("set",set);
	   	overlay.id = contextObject.id;
	   	overlay.data("contextObject",contextObject);

	   	var instance = this;
	   	overlay.mousedown(function(event){if (event.button == 2) instance.onRightClick(event, instance, this);});
	   	overlay.click(function(event){instance.onClick(event, instance, this);});
	   	overlay.hover(function(event){instance.onHoverIn(event, instance, this);}, function(event){instance.onHoverOut(event, instance, this);});
	},
	
	/*
	 * Start Events:
	 * 
	 *	drawNoneStartEvent
	 *	drawTimerStartEvent
	 *	drawMessageStartEvent
	 *	drawErrorStartEvent
	 *	drawSignalStartEvent
	 *	_drawStartEventImage
	 *	_drawStartEvent
	 */
	
//	去执行开始环节的样式/属性修改
	drawNoneStartEvent: function(x, y, width, height) {
	  	this.g.setStart();
		var isInterrupting = undefined;
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawTimerStartEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
	  
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		var cx = x + width/2 - this.getStroke()/4;
		var cy = y + height/2 - this.getStroke()/4;
		
		var w = width*.9;// - this.getStroke()*2;
		var h = height*.9;// - this.getStroke()*2;
		
		this._drawClock(cx, cy, w, h);
		
		if (this.gebug)
			var center = this.g.ellipse(cx, cy, 3, 3).attr({stroke:"none", fill: Color.green});
		
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMessageStartEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		this._drawStartEventImage(x, y, width, height, MESSAGE_CATCH_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawErrorStartEvent: function(x, y, width, height, name) {
	  	this.g.setStart();
		var isInterrupting = undefined;
		this._drawStartEvent(x, y, width, height, isInterrupting);

		this._drawStartEventImage(x, y, width, height, ERROR_CATCH_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawSignalStartEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		this._drawStartEventImage(x, y, width, height, SIGNAL_CATCH_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMultipleStartEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		
	  	this._drawStartEvent(x, y, width, height, isInterrupting, null);
		
		var cx = x + width/2 - this.getStroke()/4;
		var cy = y + height/2 - this.getStroke()/4;
		
		var w = width*1;
		var h = height*1;
		
		this._drawPentagon(cx, cy, w, h);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	_drawStartEventImage: function(x, y, width, height, image){
		var cx = x + width/2 - this.getStroke()/2;
		var cy = y + height/2 - this.getStroke()/2;
		
		var w = width*.65;// - this.getStroke()*2;
		var h = height*.65;// - this.getStroke()*2;
		
		var img = this.g.image(image, cx-w/2, cy-h/2, w, h);
	},
	
//	开始环节的属性/样式
	_drawStartEvent: function(x, y, width, height, isInterrupting){
		var originalPaint = this.getPaint();
		if (typeof(START_EVENT_STROKE_COLOR) != "undefined")
			this.setPaint(START_EVENT_STROKE_COLOR);
		
		
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;
		
		x = x + width/2;
		y = y + height/2;
		
		var circle = this.g.ellipse(x, y, width/2, height/2);
		
		circle.attr({"stroke-width": this.strokeWidth, 
				"stroke": this.paint, 
				//"stroke": START_EVENT_STROKE_COLOR,
				"fill": START_EVENT_COLOR});
				
		// white shaddow
		this.drawShaddow(circle);
		
		if (isInterrupting!=null && isInterrupting!=undefined && !isInterrupting) 
			circle.attr({"stroke-dasharray": NON_INTERRUPTING_EVENT_STROKE});

		this.setContextToElement(circle);
		
		
		
		this.setPaint(originalPaint);
//		开始环节显示开始时间
		var startTime = "";
		for(var i=0; i<window.TimeEvent.length; i++){
			if(window.TimeEvent[i].activityType == "startEvent"){
				if(window.TimeEvent[i].startTime){
					startTime = ProcessDiagramCanvas.prototype.Time(window.TimeEvent[i].startTime);
				}
			}
		}
		this.drawTaskLabelTime(startTime, x-10, y+25, width, height);
	},
	
	/*
	 * End Events:
	 * 
	 *	drawNoneEndEvent
	 *	drawErrorEndEvent
	 *	drawMessageEndEvent
	 *	drawSignalEndEvent
	 *	drawMultipleEndEvent
	 *  _drawEndEventImage
	 *	_drawNoneEndEvent
	 */
	
//	执行完成环节属性的添加
	drawNoneEndEvent: function(x, y, width, height) {
	  	this.g.setStart();
	  
		this._drawNoneEndEvent(x, y, width, height, null, "noneEndEvent");
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawErrorEndEvent: function(x, y, width, height) {
	  	this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		this._drawEndEventImage(x, y, width, height, ERROR_THROW_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMessageEndEvent: function(x, y, width, height, name) {
	  	this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		this._drawEndEventImage(x, y, width, height, MESSAGE_THROW_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawSignalEndEvent: function(x, y, width, height, name) {
	  	this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		this._drawEndEventImage(x, y, width, height, SIGNAL_THROW_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawMultipleEndEvent: function(x, y, width, height, name) {
	  	this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		var cx = x + width/2;// - this.getStroke();
		var cy = y + height/2;// - this.getStroke();
		
		var w = width*1;
		var h = height*1;
		
		var filled = true;
		this._drawPentagon(cx, cy, w, h, filled);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawTerminateEndEvent: function(x, y, width, height) {
	  	this.g.setStart();
		var type = "errorEndEvent";
		this._drawNoneEndEvent(x, y, width, height, null, type);
		
		var cx = x + width/2;// - this.getStroke()/2;
		var cy = y + height/2;// - this.getStroke()/2;
		
		var w = width/2*.6;
		var h = height/2*.6;
		
		var circle = this.g.ellipse(cx, cy, w, h).attr({fill: Color.black});
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	_drawEndEventImage: function(x, y, width, height, image){
		var cx = x + width/2 - this.getStroke()/2;
		var cy = y + height/2 - this.getStroke()/2;
		
		var w = width*.65;
		var h = height*.65;
		
		var img = this.g.image(image, cx-w/2, cy-h/2, w, h);
	},
	
//	环节结束的属性/样式
	_drawNoneEndEvent: function(x, y, width, height, image, type) {
		var originalPaint = this.getPaint();
		if (typeof(CATCHING_EVENT_COLOR) != "undefined")
			this.setPaint(CATCHING_EVENT_COLOR);
			
		var strokeColor = this.getPaint();
		var fillColor = this.getPaint();
		
		if (type == "errorEndEvent") {
			strokeColor = ERROR_END_EVENT_STROKE_COLOR;
			fillColor = ERROR_END_EVENT_COLOR;
		} else if (type == "noneEndEvent") {
			strokeColor = NONE_END_EVENT_STROKE_COLOR;
			fillColor = NONE_END_EVENT_COLOR;
		} else 
			
		// event circles
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;
		
		x = x + width/2;// + this.strokeWidth/2;
		y = y + width/2;// + this.strokeWidth/2;
		
		// outerCircle
		var outerCircle = this.g.ellipse(x, y, width/2, height/2);
		
		// white shaddow
		var shaddow = this.drawShaddow(outerCircle);
		
		outerCircle.attr({"stroke-width": this.strokeWidth,
						"stroke": strokeColor,
						"fill": fillColor});
		
		var innerCircleX = x;
		var innerCircleY = y;
		var innerCircleWidth = width/2 - 2;
		var innerCircleHeight = height/2 - 2;
		var innerCircle = this.g.ellipse(innerCircleX, innerCircleY, innerCircleWidth, innerCircleHeight);
		innerCircle.attr({"stroke-width": this.strokeWidth,
				"stroke": strokeColor,
				"fill": Color.white});

		// TODO: implement it
		//var originalPaint = this.getPaint();
		//this.g.setPaint(BOUNDARY_EVENT_COLOR);
		
		this.setPaint(originalPaint);
		
//		结束环节显示结束时间
		var endTime = "";
		for(var i=0; i<window.TimeEvent.length; i++){
			if(window.TimeEvent[i].activityType == "endEvent"){
				if(window.TimeEvent[i].endTime){
					endTime = ProcessDiagramCanvas.prototype.Time(window.TimeEvent[i].startTime);
				}
			}
		}
		this.drawTaskLabelTime(endTime, x-10, y+25, width, height);
	},
	
	/*
	 * Catching Events:
	 * 
	 *	drawCatchingTimerEvent
	 *	drawCatchingErrorEvent
	 *	drawCatchingSignalEvent
	 *  drawCatchingMessageEvent
	 *	drawCatchingMultipleEvent
	 *	_drawCatchingEventImage
	 *	_drawCatchingEvent
	 */
	 
	
	drawCatchingTimerEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		var innerCircleWidth = width - 4;
		var innerCircleHeight = height - 4;
		
		var cx = x + width/2 - this.getStroke()/4;
		var cy = y + height/2 - this.getStroke()/4;
		
		var w = innerCircleWidth*.9;// - this.getStroke()*2;
		var h = innerCircleHeight*.9;// - this.getStroke()*2;
		
		this._drawClock(cx, cy, w, h);
		
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "event");
	},
	
//	添加圆形Error节点
	drawCatchingErrorEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		this._drawCatchingEventImage(x, y, width, height, ERROR_CATCH_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawCatchingSignalEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		this._drawCatchingEventImage(x, y, width, height, SIGNAL_CATCH_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawCatchingMessageEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		this._drawCatchingEventImage(x, y, width, height, MESSAGE_CATCH_IMAGE);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawCatchingMultipleEvent: function(x, y, width, height, isInterrupting, name) {
	  	this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, isInterrupting, null);
		
		var cx = x + width/2 - this.getStroke();
		var cy = y + height/2 - this.getStroke();
		
		var w = width*.9;
		var h = height*.9;
		
		this._drawPentagon(cx, cy, w, h);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "event");
	},
	
	_drawCatchingEventImage: function(x, y, width, height, image){
		var innerCircleWidth = width - 4;
		var innerCircleHeight = height - 4;
		
		var cx = x + width/2 - this.getStroke()/2;
		var cy = y + height/2 - this.getStroke()/2;
		
		var w = innerCircleWidth*.6;// - this.getStroke()*2;
		var h = innerCircleHeight*.6;// - this.getStroke()*2;
		
		var img = this.g.image(image, cx-w/2, cy-h/2, w, h);
	},
	
//	圆形(Error的父节点)
	_drawCatchingEvent: function(x, y, width, height, isInterrupting, image) {
		var originalPaint = this.getPaint();
		if (typeof(CATCHING_EVENT_COLOR) != "undefined")
			this.setPaint(CATCHING_EVENT_COLOR);
			
		// event circles
		width -= this.strokeWidth / 2;
		height -= this.strokeWidth / 2;
		
		x = x + width/2;// + this.strokeWidth/2;
		y = y + width/2;// + this.strokeWidth/2;
		
		// outerCircle
		var outerCircle = this.g.ellipse(x, y, width/2, height/2);
		
		// white shaddow
		var shaddow = this.drawShaddow(outerCircle);
		
		//console.log("isInterrupting: " + isInterrupting, "x:" , x, "y:",y);
		if (isInterrupting!=null && isInterrupting!=undefined && !isInterrupting) 
			outerCircle.attr({"stroke-dasharray": NON_INTERRUPTING_EVENT_STROKE});
		
		outerCircle.attr({"stroke-width": this.strokeWidth,
						"stroke": this.getPaint(),
						"fill": BOUNDARY_EVENT_COLOR});
		
		var innerCircleX = x;
		var innerCircleY = y;
		var innerCircleRadiusX = width/2 - 4;
		var innerCircleRadiusY = height/2 - 4;
		var innerCircle = this.g.ellipse(innerCircleX, innerCircleY, innerCircleRadiusX, innerCircleRadiusY);
		innerCircle.attr({"stroke-width": this.strokeWidth,
				"stroke": this.getPaint()});

		if (image) {
			var imageWidth = imageHeight = innerCircleRadiusX*1.2 + this.getStroke()*2;
			var imageX = innerCircleX-imageWidth/2 - this.strokeWidth/2;
			var imageY = innerCircleY-imageWidth/2 - this.strokeWidth/2;
			var img = this.g.image(image, imageX, imageY, imageWidth, imageHeight);
		}
		
		this.setPaint(originalPaint);
		
		var set = this.g.set();
		set.push(outerCircle, innerCircle, shaddow);
		this.setContextToElement(outerCircle);
		
		// TODO: add shapes to set
		
		/*
		var st = this.g.set();
		st.push(
			this.g.ellipse(innerCircleX, innerCircleY, 2, 2),
			this.g.ellipse(imageX, imageY, 2, 2)
		);
		st.attr({fill: "red", "stroke-width":0});
		*/
	},
	
	/*
	 * Catching Events:
	 * 
	 *	drawThrowingNoneEvent
	 *	drawThrowingSignalEvent
	 *	drawThrowingMessageEvent
	 *	drawThrowingMultipleEvent
	 */
	
	drawThrowingNoneEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		var set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawThrowingSignalEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		this._drawCatchingEventImage(x, y, width, height, SIGNAL_THROW_IMAGE);
		
		var set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawThrowingMessageEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		this._drawCatchingEventImage(x, y, width, height, MESSAGE_THROW_IMAGE);
		
		var set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	drawThrowingMultipleEvent: function(x, y, width, height, name) {
	  this.g.setStart();
		this._drawCatchingEvent(x, y, width, height, null, null);
		
		var cx = x + width/2 - this.getStroke();
		var cy = y + height/2 - this.getStroke();
		
		var w = width*.9;
		var h = height*.9;
		
		var filled = true;
		this._drawPentagon(cx, cy, w, h, filled);
		
		var set = this.g.setFinish();
    this.addHandlers(set, x, y, width, height, "event");
	},
	
	/*
	 * Draw flows:
	 * 
	 *  _connectFlowToActivity
	 *	_drawFlow
	 *	_drawDefaultSequenceFlowIndicator
	 *	drawSequenceflow
	 *	drawMessageflow
	 *	drawAssociation
	 *	_drawCircleTail
	 *	_drawArrowHead
	 *	_drawConditionalSequenceFlowIndicator
	 *	drawSequenceflowWithoutArrow
	 */
	
//	流程进度的灰色实线(未进行的为灰色实线)
	_connectFlowToActivity: function(sourceActivityId, destinationActivityId, waypoints){
		var sourceActivity = this.g.getById(sourceActivityId);
		var destinationActivity = this.g.getById(destinationActivityId);
		if (sourceActivity == null || destinationActivity == null) {
			if (sourceActivity == null)
				console.error("source activity["+sourceActivityId+"] not found");
			else
				console.error("destination activity["+destinationActivityId+"] not found");
			return null;
		}
			var bbSourceActivity = sourceActivity.getBBox()
			var bbDestinationActivity = destinationActivity.getBBox()
			
			var path = [];
			var newWaypoints = [];
			for(var i = 0; i < waypoints.length; i++){
				var pathType = ""
				if (i==0)
					pathType = "M";
				else 
					pathType = "L";
					
				path.push([pathType, waypoints[i].x, waypoints[i].y]);
				newWaypoints.push({x:waypoints[i].x, y:waypoints[i].y});
			}

			var ninjaPathSourceActivity = this.ninjaPaper.path(sourceActivity.realPath);
			var ninjaPathDestinationActivity = this.ninjaPaper.path(destinationActivity.realPath);
			var ninjaBBSourceActivity = ninjaPathSourceActivity.getBBox();
			var ninjaBBDestinationActivity = ninjaPathDestinationActivity.getBBox();
			
			// set target of the flow to the center of the taskObject
			var newPath = path;
			var originalSource = {x: newPath[0][1], y: newPath[0][2]};
			var originalTarget = {x: newPath[newPath.length-1][1], y: newPath[newPath.length-1][2]};
			newPath[0][1] = ninjaBBSourceActivity.x + (ninjaBBSourceActivity.x2 - ninjaBBSourceActivity.x ) / 2;
			newPath[0][2] = ninjaBBSourceActivity.y + (ninjaBBSourceActivity.y2 - ninjaBBSourceActivity.y ) / 2;
			newPath[newPath.length-1][1] = ninjaBBDestinationActivity.x + (ninjaBBDestinationActivity.x2 - ninjaBBDestinationActivity.x ) / 2;
			newPath[newPath.length-1][2] = ninjaBBDestinationActivity.y + (ninjaBBDestinationActivity.y2 - ninjaBBDestinationActivity.y ) / 2;
			
			var ninjaPathFlowObject = this.ninjaPaper.path(newPath);
			var ninjaBBFlowObject = ninjaPathFlowObject.getBBox();
			
			var intersectionsSource = Raphael.pathIntersection(ninjaPathSourceActivity.realPath, ninjaPathFlowObject.realPath);
			var intersectionsDestination = Raphael.pathIntersection(ninjaPathDestinationActivity.realPath, ninjaPathFlowObject.realPath);
			var intersectionSource = intersectionsSource.pop();
			var intersectionDestination = intersectionsDestination.pop();
			
			if (intersectionSource != undefined) {
				if (this.gebug) {
					var diameter = 5;
					var dotOriginal = this.g.ellipse(originalSource.x, originalSource.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Pink});
					var dot = this.g.ellipse(intersectionSource.x, intersectionSource.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Green});
				}
				
				newWaypoints[0].x = intersectionSource.x;
				newWaypoints[0].y = intersectionSource.y;
			}
			if (intersectionDestination != undefined) {
				if (this.gebug) {
					var diameter = 5;
					var dotOriginal = this.g.ellipse(originalTarget.x, originalTarget.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Red});
					var dot = this.g.ellipse(intersectionDestination.x, intersectionDestination.y, diameter, diameter).attr({"fill": Color.white, "stroke": Color.Blue});
				}
				
				newWaypoints[newWaypoints.length-1].x = intersectionDestination.x;
				newWaypoints[newWaypoints.length-1].y = intersectionDestination.y;
			}
			
			this.ninjaPaper.clear();
		return newWaypoints;
	},
	
//	文字的属性及样式修改
	_drawTask: function(name, x, y, width, height, thickBorder) {
		var originalPaint = this.getPaint();
		this.setPaint(TASK_COLOR);
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;
		// shape(黑色框   主要)
		var shape = this.g.rect(x + 18, y - 5, width - 30, height + 10, TASK_CORNER_ROUND);
//		stroke-width:边框		fill背景填充颜色
		var attr = {"stroke-width": 0, stroke: TASK_STROKE_COLOR};
			
		shape.attr(attr);		//背景颜色赋值
//		shape.attr({fill: "90-"+this.getPaint()+"-" + Color.get(250, 250, 244)});
		//各种相关数据
		var contextObject = this.getConextObject();
			
		
		if (contextObject) {
			shape.id = contextObject.id;
			shape.data("contextObject", contextObject);
		}
		//var activity = this.getConextObject();
		//console.log("activity: " + activity.getId(), activity);
		//Object.clone(activity);
		
		/*
		c.mouseover(function(){
			this.attr({"stroke-width": NORMAL_STROKE + 2});
		}).mouseout(function(){
			this.attr({"stroke-width": NORMAL_STROKE});
		});
		*/
		
		this.setPaint(originalPaint);

		// white shaddow(白色阴影)
		
		if (thickBorder) {
			shape.attr({"stroke-width": 1});
		} else {
			//g.draw(rect);
		}
		
		// text(文字)
		if (name) {
			
			var fontAttr = TASK_FONT;
			// Include some padding
			var paddingX = 5;
			var paddingY = 5;
			var availableTextSpace = width - paddingX*2;
			
			// TODO: this.setFont
			// var originalFont = this.getFont();
			// this.setFont(TASK_FONT)
			/*
			var truncated = this.fitTextToWidth(name, availableTextSpace);
			var realWidth = this.getStringWidth(truncated, fontAttr);
			var realHeight = this.getStringHeight(truncated, fontAttr);
			
			//var t = this.g.text(x + width/2 + realWidth*0/2 + paddingX*0, y + height/2, truncated).attr(fontAttr);
			*/
			//console.log("draw task name: " + name);
			//看不到的框(可能无用！！！！！)
			var boxWidth = width - (2 * TEXT_PADDING);
			var boxHeight = height - ICON_SIZE - ICON_PADDING - ICON_PADDING - MARKER_WIDTH - 2 - 2;
			var boxX = x + width/2 - boxWidth/2;
			var boxY = y + height/2 - boxHeight/2 + ICON_PADDING + ICON_PADDING - 2 - 2;
			/*
			var boxWidth = width - (2 * ANNOTATION_TEXT_PADDING);
			var boxHeight = height - (2 * ANNOTATION_TEXT_PADDING);
			var boxX = x + width/2 - boxWidth/2;
			var boxY = y + height/2 - boxHeight/2;
			*/
//			var contextObject_id1 =  this.contextObject.id;
//			if(window.activityObj[contextObject_id1]){
//			}else{
//				this.drawTaskLabel(name, boxX, boxY + 40, boxWidth, boxHeight);
//			}

//			各个环节显示环节耗时(毫秒)
			var nameTime = "";
			for(var i=0; i<window.TimeEvent.length; i++){
				if(window.TimeEvent[i].activityName == name){
					if(!window.TimeEvent[i].durationInMillis){
						nameTime = "";
					}else{
						nameTime = window.TimeEvent[i].durationInMillis+"毫秒";
					}
				}
			}
//			服务版本号--软件版本及模型版本
			var versionName = "";
			var modelVersionName = "";
//			if(main.batchList.length != 0){
//				if(contextObject.properties.type == "callActivity"){
//					for(var i=0; i<main.batchList.length; i++){
//						if(name == main.batchList[i].pactivityName){
//							if(main.batchList[i].serviceVersion){
//								versionName = "("+main.batchList[i].serviceVersion+")";
//							}
//							if(main.batchList[i].dataModelVersion){
//								modelVersionName = "模型版本:"+main.batchList[i].dataModelVersion;
//							}
//						}
//					}
//				}
//			}

//			为了演示,将流程的人公编辑文字修改为人工质检----并且只针对一个流程
			if(name == "人工编辑"){
				if(ProcessDiagramGenerator._report == 1){
					this.drawTaskLabel(window.activityObj["ManualEdit"]+versionName, boxX, boxY + 40, boxWidth, boxHeight);		//环节名称
					this.drawTaskLabelTime(nameTime, boxX, boxY + 60, boxWidth, boxHeight);			//耗费时间
				}else{
					this.drawTaskLabel(name+versionName, boxX, boxY + 40, boxWidth, boxHeight);					//环节名称
					this.drawTaskLabelTime(nameTime, boxX, boxY + 60, boxWidth, boxHeight);			//耗费时间
				}
			}else{
				if(!nameTime){
					this.drawTaskLabelTime(modelVersionName, boxX, boxY + 60, boxWidth, boxHeight);				//批次服务版本号
				}else{
					this.drawTaskLabelTime(modelVersionName, boxX, boxY + 75, boxWidth, boxHeight);				//批次服务版本号
				}
				this.drawTaskLabel(name+versionName, boxX, boxY + 40, boxWidth, boxHeight);						//环节名称
				this.drawTaskLabelTime(nameTime, boxX, boxY + 60, boxWidth, boxHeight);				//耗费时间
			}
		}
	},
	
//	箭头的属性 / 所执行事件
	_drawFlow: function(waypoints, conditional, isDefault, highLighted, withArrowHead, connectionType){
		var originalPaint = this.getPaint();
		var originalStroke = this.getStroke();
//		根据x,y轴坐标来修改监控界面流程的大小
/*
		if(!LENGTH){
			for(var i=0; i<$("text").length; i++){
				if( $("text")[i].y.baseVal[0].value > length){
					length = $("text")[i].y.baseVal[0].value + 20;
				}
			}
			$("#diagramHolder svg")[0].style.overflow = "auto";
			$("#diagramHolder svg")[0].style.height = length+"px";
		}else{
			
		}
*/


//		if(!objName){
//			//.不是子流程
//		}else{
//			for(var i=0; i<$("text").length; i++){
//				if( $("text")[i].y.baseVal[0].value > length){
//					length = $("text")[i].y.baseVal[0].value + 20;
//				}
//			}
//			$("#diagramHolder svg")[0].style.overflow = "auto";
//			$("#diagramHolder svg")[0].style.height = length+"px";
//		}


		this.setPaint(SEQUENCEFLOW_COLOR);
		this.setStroke(SEQUENCEFLOW_STROKE);
		
		if (highLighted) {
			this.setPaint(HIGHLIGHT_COLOR);
			this.setStroke(SEQUENCEFLOW_HIGHLIGHT_STROKE);
		}

//生成线条   流程线及其样式
// TODO: generate polylineId or do something!!
		var uuid = Raphael.createUUID();
		var contextObject = this.getConextObject();
		var newWaypoints = waypoints;
		if (contextObject) {
			var newWaypoints = this._connectFlowToActivity(contextObject.sourceActivityId, contextObject.destinationActivityId, waypoints);
			
			if (!newWaypoints) {
				console.error("Error draw flow from '"+contextObject.sourceActivityId+"' to '"+contextObject.destinationActivityId+"' ");
				return;
			}
		}
		var polyline = new Polyline1(uuid, newWaypoints, this.getStroke());
		//var polyline = new Polyline(waypoints, 3);
		
		polyline.element = this.g.path(polyline.path);
		polyline.element.attr("stroke-width", this.getStroke());
		polyline.element.attr("opacity", 0.15);
		polyline.element.attr("stroke", this.getPaint());
			
		if (contextObject) {
			polyline.element.id = contextObject.id;
			polyline.element.data("contextObject", contextObject);
		} else {
			polyline.element.id = uuid;
		}
		
		
		/*
		polyline.element.mouseover(function(){
			this.attr({"stroke-width": NORMAL_STROKE + 2});
		}).mouseout(function(){
			this.attr({"stroke-width": NORMAL_STROKE});
		});
		*/
//		生成箭头
		var last = polyline.getAnchorsCount()-1;
		var x = polyline.getAnchor(last).x;
		var y = polyline.getAnchor(last).y;
		//var c = this.g.ellipse(x, y, 5, 5);
		
		var lastLineIndex = polyline.getLinesCount()-1;
		var line = polyline.getLine(lastLineIndex);
		var firstLine = polyline.getLine(0);
		
		var arrowHead = null,
			circleTail = null,
			defaultSequenceFlowIndicator = null,
			conditionalSequenceFlowIndicator = null;

		if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW) {
			circleTail = this._drawCircleTail(firstLine, connectionType);
		}
		if(withArrowHead)
			arrowHead = this._drawArrowHead(line, connectionType);
		
		//console.log("isDefault: ", isDefault, ", isDefaultConditionAvailable: ", polyline.isDefaultConditionAvailable);
		if (isDefault && polyline.isDefaultConditionAvailable) {
			//var angle = polyline.getLineAngle(0);
			//console.log("firstLine", firstLine);
			defaultSequenceFlowIndicator = this._drawDefaultSequenceFlowIndicator(firstLine);
		}
		
		if (conditional) {
			conditionalSequenceFlowIndicator = this._drawConditionalSequenceFlowIndicator(firstLine);
		}

        // draw flow name
        var flowName = contextObject.name;
        if (flowName) {
            var xPointArray = contextObject.xPointArray;
            var yPointArray = contextObject.yPointArray;
            var textX = xPointArray[0] < xPointArray[1] ? xPointArray[0] : xPointArray[1];
            var textY = yPointArray[0] < yPointArray[1] ? yPointArray[1] : yPointArray[0];
            // fix xy
            textX += 20;
            textY -= 10;
            this.g.text(textX, textY, flowName).attr(LABEL_FONT);
        }
		
		var st = this.g.set();
		st.push(polyline.element, arrowHead, circleTail, conditionalSequenceFlowIndicator);
		polyline.element.data("set", st);
		polyline.element.data("withArrowHead", withArrowHead);
		
		var polyCloneAttrNormal = {"stroke-width": this.getStroke() + 5, stroke: Color.get(132,112,255), opacity: 0.0, cursor: "hand"};
		var polyClone = st.clone().attr(polyCloneAttrNormal).hover(function () {
				//if (polyLine.data("isSelected")) return;
				polyClone.attr({opacity: 0.15});
			}, function () {
				//if (polyLine.data("isSelected")) return;
				polyClone.attr({opacity: 0.0});
			});
		polyClone.data("objectId", polyline.element.id);
		polyClone.click(function(){
//			鼠标点击箭头事件
			var instance = this;
			var objectId = instance.data("objectId");
			var object = this.paper.getById(objectId);
			var contextObject = object.data("contextObject");
			if (contextObject) {
				console.log("[flow], objectId: " + object.id +", flow: " + contextObject.flow);
//				鼠标点击显示右侧信息隐藏
//				ProcessDiagramGenerator.showFlowInfo(contextObject);
			}
		}).dblclick(function(){
			console.log("!!! DOUBLE CLICK !!!");
		}).hover(function (mouseEvent) {
//			鼠标划上箭头事件
			var instance = this;
			var objectId = instance.data("objectId");
			var object = this.paper.getById(objectId);
			var contextObject = object.data("contextObject");
//			鼠标滑上箭头显示右侧信息(暂时不需要此功能)
//			if (contextObject)
//				ProcessDiagramGenerator.showFlowInfo(contextObject);
		});
		polyClone.data("parentId", uuid);
		
		if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
			polyline.element.attr("stroke-width", this.getStroke());
		else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
			polyline.element.attr({"stroke-dasharray": "--"});
		else if (connectionType == CONNECTION_TYPE.ASSOCIATION)
			polyline.element.attr({"stroke-dasharray": ". "});
		
		this.setPaint(originalPaint);
		this.setStroke(originalStroke);
	},
	
	_drawDefaultSequenceFlowIndicator: function(line) {
		//console.log("line: ", line);
		
		var len = 10; c = len/2, f = 8;
		var defaultIndicator = this.g.path("M" + (-c) + " " + 0 + "L" + (c) + " " + 0);
		defaultIndicator.attr("stroke-width", this.getStroke()+0);
		defaultIndicator.attr("stroke", this.getPaint());
		
		
		var cosAngle = Math.cos((line.angle));
		var sinAngle = Math.sin((line.angle));
		
		var dx = f * cosAngle;
		var dy = f * sinAngle;
		
		var x1 = line.x1 + dx + 0*c*cosAngle;
		var y1 = line.y1 + dy + 0*c*sinAngle;
		
		defaultIndicator.transform("t" + (x1) + "," + (y1) + "");
		defaultIndicator.transform("...r" + Raphael.deg(line.angle - 3*Math.PI / 4) + " " + 0 + " " + 0);
		/*
		var c0 = this.g.ellipse(0, 0, 1, 1).attr({stroke: Color.Blue});
		c0.transform("t" + (line.x1) + "," + (line.y1) + "");
		var center = this.g.ellipse(0, 0, 1, 1).attr({stroke: Color.Red});
		center.transform("t" + (line.x1+dx) + "," + (line.y1+dy) + "");
		*/
		
		return defaultIndicator;
	},
	
	drawSequenceflow: function(waypoints, conditional, isDefault, highLighted) {
		var withArrowHead = true;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.SEQUENCE_FLOW);
	},
	
	drawMessageflow: function(waypoints, highLighted) {
		var withArrowHead = true;
		var conditional=isDefault=false;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.MESSAGE_FLOW);
	},
	
	drawAssociation: function(waypoints, withArrowHead, highLighted) {
		var withArrowHead = withArrowHead;
		var conditional=isDefault=false;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.ASSOCIATION);
	},
  
	_drawCircleTail: function(line, connectionType){
		var diameter = ARROW_WIDTH/2*1.5;
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			line.x1 += .5, line.y1 += .5;
		
		var circleTail = this.g.ellipse(line.x1, line.y1, diameter, diameter);
		circleTail.attr("fill", Color.white);
		circleTail.attr("stroke", this.getPaint());
		
		return circleTail;
	},
	
//	流程与流程之间的箭头指向 / 样式及属性
	_drawArrowHead: function(line, connectionType){
		var doubleArrowWidth = 2 * ARROW_WIDTH;
		
		if (connectionType == CONNECTION_TYPE.ASSOCIATION)
			var arrowHead = this.g.path("M-" + (ARROW_WIDTH/2+.5) + " -" + doubleArrowWidth + "L 0 0 L" + (ARROW_WIDTH/2+.5) + " -" + doubleArrowWidth);
		else
			var arrowHead = this.g.path("M0 0L-" + (ARROW_WIDTH/2+.5) + " -" + doubleArrowWidth + "L" + (ARROW_WIDTH/2+.5) + " -" + doubleArrowWidth + "z");
		
		//arrowHead.transform("t" + 0 + ",-" + this.getStroke() + "");
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			line.x2 += .5, line.y2 += .5;
		
		arrowHead.transform("t" + line.x2 + "," + line.y2 + "");
		arrowHead.transform("...r" + Raphael.deg(line.angle - Math.PI / 2) + " " + 0 + " " + 0);
		
		if (!connectionType || connectionType == CONNECTION_TYPE.SEQUENCE_FLOW)
			arrowHead.attr("fill", this.getPaint());
		else if (connectionType == CONNECTION_TYPE.MESSAGE_FLOW)
			arrowHead.attr("fill", Color.white);
			
		arrowHead.attr("stroke-width", this.getStroke());
		arrowHead.attr("stroke", this.getPaint());
		arrowHead.attr("opacity", 0.15);
		
		return arrowHead;
	},
	
	/*
	drawArrowHead2: function(srcX, srcY, targetX, targetY) {
		var doubleArrowWidth = 2 * ARROW_WIDTH;
		
		//var arrowHead = this.g.path("M-" + ARROW_WIDTH/2 + " -" + doubleArrowWidth + "L0 0" + "L" + ARROW_WIDTH/2 + " -" + doubleArrowWidth + "z");
		
		var arrowHead = this.g.path("M0 0L-" + ARROW_WIDTH/1.5 + " -" + doubleArrowWidth + "L" + ARROW_WIDTH/1.5 + " -" + doubleArrowWidth + "z");
		//var c = DefaultProcessDiagramCanvas.g.ellipse(0, 0, 3, 3);
		//c.transform("t"+targetX+","+targetY+"");
		
		var angle = Math.atan2(targetY - srcY, targetX - srcX);
		
		arrowHead.transform("t"+targetX+","+targetY+"");
		arrowHead.transform("...r" + Raphael.deg(angle - Math.PI / 2) + " "+0+" "+0);
		
		//console.log(arrowHead.transform());
		//console.log("--> " + Raphael.deg(angle - Math.PI / 2));
		
		arrowHead.attr("fill", this.getPaint());
		arrowHead.attr("stroke", this.getPaint());
		
		/ *
		// shaddow
		var c0 = arrowHead.clone();
		c0.transform("...t-1 1");
		c0.attr("stroke-width", this.strokeWidth);
		c0.attr("stroke", Color.black);
		c0.attr("opacity", 0.15);
		c0.toBack();
		* /
	},
	*/
	
	_drawConditionalSequenceFlowIndicator: function(line){
		var horizontal = (CONDITIONAL_INDICATOR_WIDTH * 0.7);
		var halfOfHorizontal = horizontal / 2;
		var halfOfVertical = CONDITIONAL_INDICATOR_WIDTH / 2;

		var uuid = null;
		var waypoints = [{x: 0, y: 0},
						{x: -halfOfHorizontal, y: halfOfVertical},
						{x: 0, y: CONDITIONAL_INDICATOR_WIDTH},
						{x: halfOfHorizontal, y: halfOfVertical}];
		/*
		var polyline = new Polyline(uuid, waypoints, this.getStroke());
		polyline.element = this.g.path(polyline.path);
		polyline.element.attr("stroke-width", this.getStroke());
		polyline.element.attr("stroke", this.getPaint());
		polyline.element.id = uuid;
		*/
		var polygone = new Polygone(waypoints, this.getStroke());
		polygone.element = this.g.path(polygone.path);
		polygone.element.attr("fill", Color.white);
		
		polygone.transform("t" + line.x1 + "," + line.y1 + "");
		polygone.transform("...r" + Raphael.deg(line.angle - Math.PI / 2) + " " + 0 + " " + 0);
		
		
		var cosAngle = Math.cos((line.angle));
		var sinAngle = Math.sin((line.angle));
		
		//polygone.element.attr("stroke-width", this.getStroke());
		//polygone.element.attr("stroke", this.getPaint());
		
		polygone.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		return polygone.element;
	},
  
	drawSequenceflowWithoutArrow: function(waypoints, conditional, isDefault, highLighted) {
		var withArrowHead = false;
		this._drawFlow(waypoints, conditional, isDefault, highLighted, withArrowHead, CONNECTION_TYPE.SEQUENCE_FLOW);
	},
	
	/*
	 * Draw artifacts
	 */
	
	drawPoolOrLane: function(x, y, width, height, name){
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;
		
		// shape
		var rect = this.g.rect(x, y, width, height);
		var attr = {"stroke-width": NORMAL_STROKE, stroke: TASK_STROKE_COLOR};
		rect.attr(attr);
		
		// Add the name as text, vertical
		if(name != null && name.length > 0) {
			var attr = POOL_LANE_FONT;
			
			// Include some padding
			var availableTextSpace = height - 6;
			
			// Create rotation for derived font
			var truncated = this.fitTextToWidth(name, availableTextSpace);
			var realWidth = this.getStringWidth(truncated, attr);
			var realHeight = this.getStringHeight(truncated, attr);
			
			//console.log("truncated:", truncated, ", height:", height, ", realHeight:", realHeight, ", availableTextSpace:", availableTextSpace, ", realWidth:", realWidth);
			var newX = x + 2 + realHeight*1 - realHeight/2;
			var newY = 3 + y + availableTextSpace - (availableTextSpace - realWidth) / 2 - realWidth/2;
			var textElement = this.g.text(newX, newY, truncated).attr(attr);
			//console.log(".getBBox(): ", t.getBBox());
			textElement.transform("r" + Raphael.deg(270 * Math.PI/180) + " " + newX + " " + newY);
		}
		
		// TODO: add to set
	},
	
//	环节名称的位置与大小
	drawTaskLabel: function(text, x, y, boxWidth, boxHeight){
		var originalFont = this.getFont();
//		this.setFont(TASK_FONT);
		this.setFont(TASKCHANGE_FONT);
			
		this._drawMultilineText(text, x, y, boxWidth, boxHeight, MULTILINE_VERTICAL_ALIGN_MIDDLE, MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
		
		this.setFont(originalFont);
	},
	
//	环节名称耗时的位置与大小
	drawTaskLabelTime: function(text, x, y, boxWidth, boxHeight){
		var originalFont = this.getFont();
//		this.setFont(TASK_FONT);
		this.setFont(TASKCHANGE_FONT_TIME);
			
		this._drawMultilineText(text, x, y, boxWidth, boxHeight, MULTILINE_VERTICAL_ALIGN_MIDDLE, MULTILINE_HORIZONTAL_ALIGN_MIDDLE, true);
		
		this.setFont(originalFont);
	},
	
	drawAnnotationText: function(text, x, y, width, height){
		//this._drawMultilineText(text, x, y, width, height, "start");
		
		var originalPaint = this.getPaint();
		var originalFont = this.getFont();
		
		this.setPaint(Color.black);
		this.setFont(TASK_FONT);
//		this.setFont(TASKCHANGE_FONT);
			
		this._drawMultilineText(text, x, y, width, height, MULTILINE_VERTICAL_ALIGN_TOP, MULTILINE_HORIZONTAL_ALIGN_LEFT);
		
		this.setPaint(originalPaint);
		this.setFont(originalFont);
	},
	
//	错误时的小提示字体的属性(Error)
	drawLabel: function(text, x, y, width, height){
		//this._drawMultilineText(text, x, y, width, height, "start");
		
		var originalPaint = this.getPaint();
		var originalFont = this.getFont();
		
		this.setPaint(LABEL_COLOR);
		//this.setFont(LABEL_FONT);
		this.setFont(LABEL_FONT_SMOOTH);
		
		// predefined box width for labels
		// TODO: use label width as is, but not height (for stretching)
		if (!width || !height) {
		  width = 100;
		  height = 0;
		}
		
		// TODO: remove it. It is debug
		x = x - width/2;
	  
		this._drawMultilineText(text, x, y, width, height, MULTILINE_VERTICAL_ALIGN_TOP, MULTILINE_HORIZONTAL_ALIGN_MIDDLE);
		
		this.setPaint(originalPaint);
		this.setFont(originalFont);
	},
	
	/*
	drawMultilineLabel: function(text, x, y){
		var originalFont = this.getFont();
		this.setFont(LABEL_FONT_SMOOTH);
		
		var boxWidth = 80;
		x = x - boxWidth/2
		
		this._drawMultilineText(text, x, y, boxWidth, null, "middle");
		this.setFont(originalFont);
	},
	*/
	
	getStringWidth: function(text, fontAttrs){
		var textElement = this.g.text(0, 0, text).attr(fontAttrs).hide();
		var bb = textElement.getBBox();
		
		//console.log("string width: ", t.getBBox().width);
		return textElement.getBBox().width;
	},
	getStringHeight: function(text, fontAttrs){
		var textElement = this.g.text(0, 0, text).attr(fontAttrs).hide();
		var bb = textElement.getBBox();
		
		//console.log("string height: ", t.getBBox().height);
		return textElement.getBBox().height;
	},
	fitTextToWidth: function(original, width) {
		var text = original;

		// TODO: move attr on parameters
		var attr = {font: "11px Arial", opacity: 0};
		
		// remove length for "..."
		var dots = this.g.text(0, 0, "...").attr(attr).hide();
		var dotsBB = dots.getBBox();
		
		var maxWidth = width - dotsBB.width;
		
		var textElement = this.g.text(0, 0, text).attr(attr).hide();
		var bb = textElement.getBBox();
		
		// it's a little bit incorrect with "..."
		while (bb.width > maxWidth && text.length > 0) {
			text = text.substring(0, text.length - 1);
			textElement.attr({"text": text});
			bb = textElement.getBBox();
		}

		// remove element from paper
		textElement.remove();
		
		if (text != original) {
			text = text + "...";
		}

		return text;
	},
	
//	关于字体的相关属性、属性值
	wrapTextToWidth: function(original, width){
		//return original;
		
		var text = original;
		var wrappedText = "\n";
		
		// TODO: move attr on parameters
		var attr = {font: "11px Arial", opacity: 0};
		
		var textElement = this.g.text(0, 0, wrappedText).attr(attr).hide();
		var bb = textElement.getBBox();
		
		var resultText = "";
		var i = 0, j = 0;
		while (text.length > 0) {
			while (bb.width < width && text.length>0) {
				// remove "\n"
				wrappedText = wrappedText.substring(0,wrappedText.length-1);
				// add new char, add "\n"
				wrappedText = wrappedText + text.substring(0,1) + "\n";
				text = text.substring(1);
				
				textElement.attr({"text": wrappedText});
				bb = textElement.getBBox();
				i++;
				if (i>200) break;
			}
			// remove "\n"
			wrappedText = wrappedText.substring(0, wrappedText.length - 1);
			
			if (text.length == 0) {
				resultText += wrappedText;
				break;
			}
			
			// return last char to text
			text = wrappedText.substring(wrappedText.length-1) + text;
			// remove last char from wrappedText
			wrappedText = wrappedText.substring(0, wrappedText.length-1) + "\n";
			
			textElement.attr({"text": wrappedText});
			bb = textElement.getBBox();
			
			//console.log(">> ", wrappedText, ", ", text);
			resultText += wrappedText;
			wrappedText = "\n";
			
			j++;
			if (j>20) break;
		}
		// remove element from paper
		textElement.remove();
		
		return resultText;
	},
	
	wrapTextToWidth2: function(original, width){
		var text = original;
		var wrappedText = "\n";
		
		// TODO: move attr on parameters
		var attr = {font: "11px Arial", opacity: 0};
		
		var textElement = this.g.text(0, 0, wrappedText).attr(attr).hide();
		var bb = textElement.getBBox();
		
		var resultText = "";
		var i = 0, j = 0;
		while (text.length > 0) {
			while (bb.width < width && text.length>0) {
				// remove "\n"
				wrappedText = wrappedText.substring(0,wrappedText.length-1);
				// add new char, add "\n"
				wrappedText = wrappedText + text.substring(0,1) + "\n";
				text = text.substring(1);
				
				textElement.attr({"text": wrappedText});
				bb = textElement.getBBox();
				i++;
				if (i>200) break;
			}
			// remove "\n"
			wrappedText = wrappedText.substring(0, wrappedText.length - 1);
			
			if (text.length == 0) {
				resultText += wrappedText;
				break;
			}
			
			// return last char to text
			text = wrappedText.substring(wrappedText.length-1) + text;
			// remove last char from wrappedText
			wrappedText = wrappedText.substring(0, wrappedText.length-1) + "\n";
			
			textElement.attr({"text": wrappedText});
			bb = textElement.getBBox();
			
			//console.log(">> ", wrappedText, ", ", text);
			resultText += wrappedText;
			wrappedText = "\n";
			
			j++;
			if (j>20) break;
		}
		// remove element from paper
		textElement.remove();
		
		return resultText;
	},
	
//	type类型为User的图片修改
	drawUserTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			if( (window.TaskName == "SpecSubServiceProcess") && (contextObject_id == "ManualEdit") ){
				var img = this.g.image(ROBOT_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
			}else{
				var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
			}
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(USERTASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
//		ROBOT_IMAGE
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
		this.addHandlers(set, x, y, width, height, "task");
	},
	
//	type类型为callActivity的图片修改
	drawcallActivity: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
//			if(imgs1[contextObject_id]){
				var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
//			}else{
//				var img = this.g.image(imgs[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
//			}
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(CALLACTIVITY_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
		this.addHandlers(set, x, y, width, height, "task");
	},

//	type类型为Script的图片修改
	drawScriptTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
			
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(SCRIPTTASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
    	}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
//	type类型为Service的图片修改
	drawServiceTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
			
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(SERVICETASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
//	type类型为Receive的图片修改
	drawReceiveTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(RECEIVETASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
//	type类型为Send的图片修改
	drawSendTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(SENDTASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
//	type类型为Manual的图片修改
	drawManualTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(MANUALTASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
//	type类型为BusinessRule的图片修改
	drawBusinessRuleTask: function(name, x, y, width, height) {
	  	this.g.setStart();
//		判断语句来改变图片
		var contextObject_id = this.contextObject.id;
//		通过判断条件来进行改变图片 
		if(window.activityObj[contextObject_id]){
//			有对应的数据时进行改变图片
			var img = this.g.image(imgs1[contextObject_id], x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}else{
//			没有对应的数据时 则不进行改变
			var img = this.g.image(BUSINESS_RULE_TASK_IMAGE, x + 30, y + 3, ICON_SIZE + 35, ICON_SIZE + 35);
		}
		
		img[0].id = contextObject_id;			//为图片添加id名
		var set = this.g.setFinish();
		this._drawTask(name, x, y, width, height);
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawExpandedSubProcess: function(name, x, y, width, height, isTriggeredByEvent){
	  	this.g.setStart();
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x = Math.round(x) + .5, y = Math.round(y) + .5;
		
		// shape
		var rect = this.g.rect(x, y, width, height, EXPANDED_SUBPROCESS_CORNER_ROUND);
		
		// Use different stroke (dashed)
		if(isTriggeredByEvent) {
			rect.attr(EVENT_SUBPROCESS_ATTRS);
		} else {
			rect.attr(EXPANDED_SUBPROCESS_ATTRS);
		}
		
		this.setContextToElement(rect);
		
		var fontAttr = EXPANDED_SUBPROCESS_FONT;
		
		// Include some padding
		var paddingX = 10;
		var paddingY = 5;
		var availableTextSpace = width - paddingX*2;
		
		var truncated = this.fitTextToWidth(name, availableTextSpace);
		var realWidth = this.getStringWidth(truncated, fontAttr);
		var realHeight = this.getStringHeight(truncated, fontAttr);
		
		var textElement = this.g.text(x + width/2 - realWidth*0/2 + 0*paddingX, y + realHeight/2 + paddingY, truncated).attr(fontAttr);
		
		var set = this.g.setFinish();
		// TODO: Expanded Sub Process may has specific handlers
		//this.addHandlers(set, x, y, width, height, "task");
	},
	
	drawCollapsedSubProcess: function(name, x, y, width, height, isTriggeredByEvent) {
	  	this.g.setStart();
	  	this._drawCollapsedTask(name, x, y, width, height, false);
	  	var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "task");
	},
	
//	drawCollapsedCallActivity: function(name, x, y, width, height) {
//	  this.g.setStart();
//		this._drawCollapsedTask(name, x, y, width, height, true);
//		var set = this.g.setFinish();
//  this.addHandlers(set, x, y, width, height, "task");
//	},

	_drawCollapsedTask: function(name, x, y, width, height, thickBorder) {
		// The collapsed marker is now visualized separately
		this._drawTask(name, x, y, width, height, thickBorder);
	},
	
	drawCollapsedMarker: function(x, y, width, height){
		// rectangle
		var rectangleWidth = MARKER_WIDTH;
		var rectangleHeight = MARKER_WIDTH;
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			y += .5;
		
//		var rect = this.g.rect(x + (width - rectangleWidth) / 2, y + height - rectangleHeight - 3, rectangleWidth, rectangleHeight);
//		
//		// plus inside rectangle
//		var cx = rect.attr("x") + rect.attr("width")/2;
//		var cy = rect.attr("y") + rect.attr("height")/2;
		
//		var line = this.g.path(
//			"M" + cx + " " + (cy+2) + "L" + cx + " " + (cy-2) + 
//			"M" + (cx-2) + " " + cy + "L" + (cx+2) + " " + cy
//		).attr({"stroke-width": this.strokeWidth});
		
	},
	
	drawActivityMarkers: function(x, y, width, height, multiInstanceSequential, multiInstanceParallel, collapsed){
		if (collapsed) {
			if (!multiInstanceSequential && !multiInstanceParallel) {
				this.drawCollapsedMarker(x, y, width, height);
			} else {
				this.drawCollapsedMarker(x - MARKER_WIDTH / 2 - 2, y, width, height);
				if (multiInstanceSequential) {
					console.log("is collapsed and multiInstanceSequential");
					this.drawMultiInstanceMarker(true, x + MARKER_WIDTH / 2 + 2, y, width, height);
				} else if (multiInstanceParallel) {
					console.log("is collapsed and multiInstanceParallel");
					this.drawMultiInstanceMarker(false, x + MARKER_WIDTH / 2 + 2, y, width, height);
				}
			}
		} else {
			if (multiInstanceSequential) {
				console.log("is multiInstanceSequential");
				this.drawMultiInstanceMarker(true, x, y, width, height);
			} else if (multiInstanceParallel) {
				console.log("is multiInstanceParallel");
				this.drawMultiInstanceMarker(false, x, y, width, height);
			}
		}
	},
	
//	菱形样式(流程图中的菱形)
	drawGateway: function(x, y, width, height) {
//		菱形的基本样式
		var rhombus = this.g.path(	"M" + x + " " + (y + (height / 2)) + 
									"L" + (x + (width / 2)) + " " + (y + height) + 
									"L" + (x + width) + " " + (y + (height / 2)) +
									"L" + (x + (width / 2)) + " " + y +
									"z"
								);
		
		// white shaddow
		this.drawShaddow(rhombus);
		
		rhombus.attr("stroke-width", this.strokeWidth);
		rhombus.attr("stroke", Color.SlateGrey);
		rhombus.attr({fill: Color.white});
		
		this.setContextToElement(rhombus);
		
		return rhombus;
	},
	
//	菱形(并行 + )环节的属性
	drawParallelGateway: function(x, y, width, height) {
	  	this.g.setStart();
	  
		// rhombus
		this.drawGateway(x, y, width, height);

		// plus inside rhombus
		var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		
		var plus = this.g.path(
			"M" + (x + 10) + " " + (y + height / 2) + "L" + (x + width - 10) + " " + (y + height / 2) +	// horizontal
			"M" + (x + width / 2) + " " + (y + height - 10) + "L" + (x + width / 2) + " " + (y + 10)	// vertical
		);
		plus.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		this.setStroke(originalStroke);
		
		var set = this.g.setFinish();
		this.addHandlers(set, x, y, width, height, "gateway");
	},
	
//	菱形(判断 x )环节的属性
	drawExclusiveGateway: function(x, y, width, height) {
	  	this.g.setStart();
	  
		// rhombus		菱形
//		菱形的定位x,y轴坐标--宽--高  
		var rhombus = this.drawGateway(x, y, width, height);

		var quarterWidth = width / 4;
		var quarterHeight = height / 4;
		
		// X inside rhombus		菱形内部的图样(×叉)
		var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		
		var iks = this.g.path(
			"M" + (x + quarterWidth + 3) + " " + (y + quarterHeight + 3) + "L" + (x + 3 * quarterWidth - 3) + " " + (y + 3 * quarterHeight - 3) + 
			"M" + (x + quarterWidth + 3) + " " + (y + 3 * quarterHeight - 3) + "L" + (x + 3 * quarterWidth - 3) + " " + (y + quarterHeight + 3)
		);
//		stroke-width粗细程度
		iks.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		this.setStroke(originalStroke);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	drawInclusiveGateway: function(x, y, width, height){
	  	this.g.setStart();
	  
		// rhombus
		this.drawGateway(x, y, width, height);
		
		var diameter = width / 4;
		
		// circle inside rhombus		菱形内部的圆圈
		var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
		var circle = this.g.ellipse(width/2 + x, height/2 + y, diameter, diameter);
		circle.attr({"stroke-width": this.getStroke(), "stroke": this.getPaint()});
		
		this.setStroke(originalStroke);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	drawEventBasedGateway: function(x, y, width, height){
	  	this.g.setStart();
	  
		// rhombus
		this.drawGateway(x, y, width, height);
		
		var diameter = width / 2;

	    // rombus inside rhombus
	    var originalStroke = this.getStroke();
		this.setStroke(GATEWAY_TYPE_STROKE);
	    
	    
	    // draw GeneralPath (polygon)
	    var n=5;
	    var angle = 2*Math.PI/n;
	    var x1Points = [];
	    var y1Points = [];
		
		for ( var index = 0; index < n; index++ ) {
			var v = index*angle - Math.PI/2;
			x1Points[index] = x + parseInt(Math.round(width/2)) + parseInt(Math.round((width/4)*Math.cos(v)));
        	y1Points[index] = y + parseInt(Math.round(height/2)) + parseInt(Math.round((height/4)*Math.sin(v)));
		}
		//g.drawPolygon(x1Points, y1Points, n);
		
		var path = "";
		for ( var index = 0; index < n; index++ ) {
			if (index == 0) 
				path += "M";
			else 
				path += "L";
			path += x1Points[index] + "," + y1Points[index];
		}
		path += "z";
		var polygone = this.g.path(path);
		polygone.attr("stroke-width", this.strokeWidth);
		polygone.attr("stroke", this.getPaint());
		
		this.setStroke(originalStroke);
		
		var set = this.g.setFinish();
    	this.addHandlers(set, x, y, width, height, "gateway");
	},
	
	/*
	*  drawMultiInstanceMarker
	*  drawHighLight
	*  highLightFlow
	*/
	
	drawMultiInstanceMarker: function(sequential, x, y, width, height) {
		var rectangleWidth = MARKER_WIDTH;
		var rectangleHeight = MARKER_WIDTH;
		
		// anti smoothing
		if (this.strokeWidth%2 == 1)
			x += .5;//, y += .5;
			
		var lineX = x + (width - rectangleWidth) / 2;
		var lineY = y + height - rectangleHeight - 3;
		
		var originalStroke = this.getStroke();
		this.setStroke(MULTI_INSTANCE_STROKE);
		
		if (sequential) {
			var line = this.g.path(
				"M" + lineX + " " + lineY + 							"L" + (lineX + rectangleWidth) + " " + lineY + 
				"M" + lineX + " " + (lineY + rectangleHeight / 2) + 	"L" + (lineX + rectangleWidth) + " " + (lineY + rectangleHeight / 2) + 
				"M" + lineX + " " + (lineY + rectangleHeight) + 		"L" + (lineX + rectangleWidth) + " " + (lineY + rectangleHeight)
			).attr({"stroke-width": this.strokeWidth});
		} else {
			var line = this.g.path(
				"M" + lineX + " " + 							lineY + "L" + lineX + " " + 					(lineY + rectangleHeight) +
				"M" + (lineX + rectangleWidth / 2) + " " + 	lineY + "L" + (lineX + rectangleWidth / 2) + " " + 	(lineY + rectangleHeight) + 
				"M" + (lineX + rectangleWidth) + " " + 		lineY + "L" + (lineX + rectangleWidth) + " " + 		(lineY + rectangleHeight)
			).attr({"stroke-width": this.strokeWidth});
		}
		
		this.setStroke(originalStroke);
	},
	
	drawHighLight: function(x, y, width, height){
		var originalPaint = this.getPaint();
		var originalStroke = this.getStroke();
		
		this.setPaint(HIGHLIGHT_COLOR);
		this.setStroke(THICK_TASK_BORDER_STROKE);

		//var c = this.g.rect(x - width/2 - THICK_TASK_BORDER_STROKE, y - height/2 - THICK_TASK_BORDER_STROKE, width + THICK_TASK_BORDER_STROKE*2, height + THICK_TASK_BORDER_STROKE*2, 5);
		var rect = this.g.rect(x - THICK_TASK_BORDER_STROKE, y - THICK_TASK_BORDER_STROKE, width + THICK_TASK_BORDER_STROKE*2, height + THICK_TASK_BORDER_STROKE*2, TASK_CORNER_ROUND);
		rect.attr("stroke-width", this.strokeWidth);
		rect.attr("stroke", this.getPaint());
		
		this.setPaint(originalPaint);
		this.setStroke(originalStroke);
	},
	
//	高亮 / 执行过 / 未执行...流程的属性即样式
	highLightActivity: function(activityId){

		var shape = this.g.getById(activityId);
		if (!shape) {
			console.error("Activity " + activityId + " not found");
			return;
		}
		var contextObject = shape.data("contextObject");
//		if (contextObject)
//			console.log("--> highLightActivity: ["+contextObject.getProperty("type")+"], activityId: " + contextObject.getId());
//		else
//			console.log("--> highLightActivity: ", shape, shape.data("contextObject"));

		
		var _activities1 = ProcessDiagramGenerator._activities;
		
//		监控流程日志输出
//		if( monitor.highlightJunge ){
//			mainLog.ws();
//		}else{
//			//...
//		}
		/*
		if( monitor.highlightJunge && (contextObject.properties.type != "userTask") ){
			var atime = setTimeout(function(){
				mainLog.ws();
				clearTimeout(atime);
			},1000)
			
		}else{
			//...
		}
		*/
		
		
		shape.attr("stroke-width", THICK_TASK_BORDER_STROKE);			//流程进度粗细显示
		shape.attr("stroke", ARROWHIGHLIGHT_COLOR);	

//		判断是并行流程或是其他流程,来定义他的流程图
		var ProcessTEXT1;
		if( (window.TaskName == "AllProcessParallel") || (window.TaskName == "AllProcessParallelSpec") || (window.TaskName == "AllProcessParallelAutoEditSpec") ){
			ProcessTEXT1 = textsAnd;
		}else{
			ProcessTEXT1 = texts;
		}


		if(imgs2[activityId]){
//			动态图(相对应的)
			if( (window.TaskName == "SpecSubServiceProcess") && (activityId == "ManualEdit") ){
				$("#"+activityId)[0].href.animVal = imgs2["robot"];
				$("#"+activityId)[0].href.baseVal = imgs2["robot"];
			}else{
				$("#"+activityId)[0].href.animVal = imgs2[activityId];
				$("#"+activityId)[0].href.baseVal = imgs2[activityId];
			}
		}else{
//			动态图(默认显示的)
//			console.log(contextObject.properties.type)
			$("#"+activityId)[0].href.animVal = imgs2[contextObject.properties.type];
			$("#"+activityId)[0].href.baseVal = imgs2[contextObject.properties.type];
		}
	},
	
//	高亮的红色实线----已执行过的流程的线为红色实线
	highLightFlow: function(flowId){
		var shapeFlow = this.g.getById(flowId);
		if (!shapeFlow) {
			console.error("Flow " + flowId + " not found");
			return;
		}
		
//		获取已通过的流程线的上一个节点(上一个节点肯定是已经通过的流程)
		var contextObject = shapeFlow.data("contextObject");
		var imgName = contextObject.destinationActivityId;
		
//		获取该环节的类型type(不存在图片时,则根据type使用初始图片)
		var shape = this.g.getById(imgName);
		var contextObject1 = shape.data("contextObject");
		var imgType = contextObject1.properties.type;
//		过去的环节边框消除
		if(shape.type == "rect"){
			shape.attr("stroke-width", 0);			//流程进度粗细显示
			shape.attr("stroke", TASK_STROKE_COLOR);
		}

		if (contextObject)
//			console.log("--> highLightFlow: ["+contextObject.id+"] " + contextObject.flow);
		//console.log("--> highLightFlow: ", flow.flow, flow.data("set"));
		var _activities1 = ProcessDiagramGenerator._activities;

		if(window.activityObj[imgName]){
			if( $("#"+imgName).length > 0 ){
				if( (window.TaskName == "SpecSubServiceProcess") && (imgName == "ManualEdit") ){
					$("#"+imgName)[0].href.animVal = imgs3["robot"];
					$("#"+imgName)[0].href.baseVal = imgs3["robot"];
				}else{
					$("#"+imgName)[0].href.animVal = imgs3[imgName];
					$("#"+imgName)[0].href.baseVal = imgs3[imgName];
				}
			}
		}else{
			if( $("#"+imgName).length > 0 ){
				if(!imgs3[imgType]){
					$("#"+imgName)[0].href.baseVal = imgs3["serviceTask"];
					$("#"+imgName)[0].href.baseVal = imgs3["serviceTask"];
				}else{
					$("#"+imgName)[0].href.animVal = imgs3[imgType];
					$("#"+imgName)[0].href.baseVal = imgs3[imgType];
				}
			}
		}

		
		var st = shapeFlow.data("set");
		
//		箭头的颜色与属性(红色)
		st.attr("stroke-width", SEQUENCEFLOW_HIGHLIGHT_STROKE);
		st.attr("stroke", ARROWHIGHLIGHT_COLOR);
		st.attr("opacity", 0.15);
		var withArrowHead = shapeFlow.data("withArrowHead");
		if (withArrowHead)
			st[1].attr("fill", ARROWHIGHLIGHT_COLOR);
			st[1].attr("opacity", 0.15);
		
		st.forEach(function(el){
			//console.log("---->", el);
			//el.attr("")
		});
	},
	

	_drawClock: function(cx, cy, width, height){
		
		var circle = this.g.ellipse(cx, cy, 1, 1).attr({stroke:"none", fill: Color.get(232, 239, 241)});
		//var c = this.g.ellipse(cx, cy, width, height).attr({stroke:"none", fill: Color.red});
		//x = cx - width/2;
		//y = cy - height/2;
	
		var clock = this.g.path(
		/* outer circle */ "M15.5,2.374		C8.251,2.375,2.376,8.251,2.374,15.5		C2.376,22.748,8.251,28.623,15.5,28.627c7.249-0.004,13.124-5.879,13.125-13.127C28.624,8.251,22.749,2.375,15.5,2.374z" +
		/* inner circle */ "M15.5,26.623	C8.909,26.615,4.385,22.09,4.375,15.5	C4.385,8.909,8.909,4.384,15.5,4.374c4.59,0.01,11.115,3.535,11.124,11.125C26.615,22.09,22.091,26.615,15.5,26.623z" +
		/*  9 */ "M8.625,15.5c-0.001-0.552-0.448-0.999-1.001-1c-0.553,0-1,0.448-1,1c0,0.553,0.449,1,1,1C8.176,16.5,8.624,16.053,8.625,15.5z" +
		/*  8 */ "M8.179,18.572c-0.478,0.277-0.642,0.889-0.365,1.367c0.275,0.479,0.889,0.641,1.365,0.365c0.479-0.275,0.643-0.887,0.367-1.367C9.27,18.461,8.658,18.297,8.179,18.572z" +
		/* 10 */ "M9.18,10.696c-0.479-0.276-1.09-0.112-1.366,0.366s-0.111,1.09,0.365,1.366c0.479,0.276,1.09,0.113,1.367-0.366C9.821,11.584,9.657,10.973,9.18,10.696z" +
		/*  2 */ "M22.822,12.428c0.478-0.275,0.643-0.888,0.366-1.366c-0.275-0.478-0.89-0.642-1.366-0.366c-0.479,0.278-0.642,0.89-0.366,1.367C21.732,12.54,22.344,12.705,22.822,12.428z" +
		/*  7 */ "M12.062,21.455c-0.478-0.275-1.089-0.111-1.366,0.367c-0.275,0.479-0.111,1.09,0.366,1.365c0.478,0.277,1.091,0.111,1.365-0.365C12.704,22.344,12.54,21.732,12.062,21.455z" +
		/* 11 */ "M12.062,9.545c0.479-0.276,0.642-0.888,0.366-1.366c-0.276-0.478-0.888-0.642-1.366-0.366s-0.642,0.888-0.366,1.366C10.973,9.658,11.584,9.822,12.062,9.545z" +
		/*  4 */ "M22.823,18.572c-0.48-0.275-1.092-0.111-1.367,0.365c-0.275,0.479-0.112,1.092,0.367,1.367c0.477,0.275,1.089,0.113,1.365-0.365C23.464,19.461,23.3,18.848,22.823,18.572z" +
		/*  2 */ "M19.938,7.813c-0.477-0.276-1.091-0.111-1.365,0.366c-0.275,0.48-0.111,1.091,0.366,1.367s1.089,0.112,1.366-0.366C20.581,8.702,20.418,8.089,19.938,7.813z" +
		/*  3 */ "M23.378,14.5c-0.554,0.002-1.001,0.45-1.001,1c0.001,0.552,0.448,1,1.001,1c0.551,0,1-0.447,1-1C24.378,14.949,23.929,14.5,23.378,14.5z" +
		/* arrows */ "M15.501,6.624c-0.552,0-1,0.448-1,1l-0.466,7.343l-3.004,1.96c-0.478,0.277-0.642,0.889-0.365,1.365c0.275,0.479,0.889,0.643,1.365,0.367l3.305-1.676C15.39,16.99,15.444,17,15.501,17c0.828,0,1.5-0.671,1.5-1.5l-0.5-7.876C16.501,7.072,16.053,6.624,15.501,6.624z" +
		/*  9 */ "M15.501,22.377c-0.552,0-1,0.447-1,1s0.448,1,1,1s1-0.447,1-1S16.053,22.377,15.501,22.377z" +
		/*  8 */ "M18.939,21.455c-0.479,0.277-0.643,0.889-0.366,1.367c0.275,0.477,0.888,0.643,1.366,0.365c0.478-0.275,0.642-0.889,0.366-1.365C20.028,21.344,19.417,21.18,18.939,21.455z" +
		"");
		clock.attr({fill: Color.black, stroke: "none"});
		//clock.transform("t " + (cx-29.75/2) + " " + (cy-29.75/2));
		//clock.transform("...s 0.85");
		
		//clock.transform("...s " + .85 + " " + .85);
		clock.transform("t " + (-2.374) + " " + (-2.374)	);
		clock.transform("...t -" + (15.5-2.374) + " -" + (15.5-2.374)	);
		clock.transform("...s " + 1*(width/35) + " " + 1*(height/35));
		clock.transform("...T " + cx + " " + cy);
		//clock.transform("t " + (cx-width/2) + " " + (cy-height/2));
		
		//console.log(".getBBox(): ", clock.getBBox());
		//console.log(".attr(): ", c.attrs);
		circle.attr("rx", clock.getBBox().width/2);
		circle.attr("ry", clock.getBBox().height/2);
		
		//return circle
	},
	
	_drawPentagon: function(cx, cy, width, height, filled){
		// draw GeneralPath (polygon)
	    var n=5;
	    var angle = 2*Math.PI/n;
	    var waypoints = [];
		
		for ( var index = 0; index < n; index++ ) {
			var v = index*angle - Math.PI/2;
			var point = {};
			point.x = -width*1.2/2 + parseInt(Math.round(width*1.2/2)) + parseInt(Math.round((width*1.2/4)*Math.cos(v)));
        	point.y = -height*1.2/2 + parseInt(Math.round(height*1.2/2)) + parseInt(Math.round((height*1.2/4)*Math.sin(v)));
			waypoints[index] = point;
		}
		
		var polygone = new Polygone(waypoints, this.getStroke());
		polygone.element = this.g.path(polygone.path);
		if (filled)
			polygone.element.attr("fill", Color.black);
		else
			polygone.element.attr("fill", Color.white);
		
		polygone.element.transform("s " + 1*(width/35) + " " + 1*(height/35));
		polygone.element.transform("...T " + cx + " " + cy);
	},
	
//	字体文本显示的方式及属性
	_drawMultilineText: function(text, x, y, boxWidth, boxHeight, verticalAlign, horizontalAlign, isTime = false) {
		if (!text || text == "") 
			return;
			
		// Autostretch boxHeight if boxHeight is 0
		if (boxHeight == 0)
		  verticalAlign = MULTILINE_VERTICAL_ALIGN_TOP;	  
	
		//var TEXT_PADDING = 3;
		var width = boxWidth;
		if (boxHeight)
			var height = boxHeight;
	
		var layouts = [];
		
		//var font = {font: "11px Arial", opacity: 1, "fill": LABEL_COLOR};
		var font = this.getFont();
		var measurer = new LineBreakMeasurer(this.g, x, y, text, font);
		var lineHeight = measurer.rafaelTextObject.getBBox().height;
		if(isTime){
			measurer.rafaelTextObject.attr({"title": "环节耗时(开始时间或结束时间)"});
		}
		
		//console.log("text: ", text.replace(/\n/g, "?"));
		
		if (height) {
			var availableLinesCount = parseInt(height/lineHeight);
			//console.log("availableLinesCount: " + availableLinesCount);
		}
		
//		添加文字(字节中存在--已知空格，会造成i++死循环，修改本身逻辑，i最大值为10，大于10时输出空值并跳出)
		var i = 1;
		while (measurer.getPosition() < measurer.text.getEndIndex()) {
			var layout = measurer.nextLayout(width);
			//console.log("LAYOUT: " + layout + ", getPosition: " + measurer.getPosition());
			if (layout != null) {
				// TODO: and check if measurer has next layout. If no then don't draw  dots
//				if (!availableLinesCount || i < availableLinesCount) {
//					添加中文文字
					layouts.push(layout);
//				} else {
//					添加中文文字与省略号
//					layouts.push(this.fitTextToWidth(layout + "...", boxWidth));
					break;
//				}
			}else{
				if(i>10){
					layouts.push("");
					break;
				}
			}
			i++;
		};
		//console.log(layouts);
		
//		measurer.rafaelTextObject.attr({"text": layouts.join("\n")});
		
		if (horizontalAlign)
			measurer.rafaelTextObject.attr({"text-anchor": horizontalAlign}); // end, middle, start
			
		var bb = measurer.rafaelTextObject.getBBox();
		// TODO: there is somethin wrong with wertical align. May be: measurer.rafaelTextObject.attr({"y": y + height/2 - bb.height/2})
		measurer.rafaelTextObject.attr({"y": y + bb.height/2});
		//var bb = measurer.rafaelTextObject.getBBox();
		
		if (measurer.rafaelTextObject.attr("text-anchor") == MULTILINE_HORIZONTAL_ALIGN_MIDDLE )
			measurer.rafaelTextObject.attr("x",  x +  boxWidth/2);
		else if (measurer.rafaelTextObject.attr("text-anchor") == MULTILINE_HORIZONTAL_ALIGN_RIGHT )
			measurer.rafaelTextObject.attr("x",  x +  boxWidth);
		
		var boxStyle = {stroke: Color.LightSteelBlue2, "stroke-width": 1.0, "stroke-dasharray": "- "};
		//var box = this.g.rect(x+.5, y + .5, width, height).attr(boxStyle);
		var textAreaCX = x + boxWidth/2;
		var height = boxHeight;
		if (!height) height = bb.height;
		var textAreaCY = y + height/2;
		
//		页面的ellipse
		var dotLeftTop = this.g.ellipse(x, y, 3, 3).attr({"stroke-width": 0, fill: Color.LightSteelBlue, stroke: "none"}).hide();
		var dotCenter = this.g.ellipse(textAreaCX, textAreaCY, 3, 3).attr({fill: Color.LightSteelBlue2, stroke: "none"}).hide();

		/*
		// real bbox
		var bb = measurer.rafaelTextObject.getBBox();
		var rect = paper.rect(bb.x+.5, bb.y + .5, bb.width, bb.height).attr({"stroke-width": 1});
		*/
//		长方形虚线框
		var rect = this.g.rect(x, y, boxWidth, height).attr({"stroke-width": 1}).attr(boxStyle).hide();
		var debugSet = this.g.set();
		debugSet.push(dotLeftTop, dotCenter, rect);
		//debugSet.show();
	},
	
	drawTextAnnotation: function(text, x, y, width, height){
		var lineLength = 18;
		var path = [];
		  path.push(["M", x + lineLength, y]);
		  path.push(["L", x, y]);
		  path.push(["L", x, y + height]);
		  path.push(["L", x + lineLength, y + height]);
		  
		  path.push(["L", x + lineLength, y + height -1]);
		  path.push(["L", x + 1, y + height -1]);
		  path.push(["L", x + 1, y + 1]);
		  path.push(["L", x + lineLength, y + 1]);
		  path.push(["z"]);
	
		var textAreaLines = this.g.path(path);
		
	  var boxWidth = width - (2 * ANNOTATION_TEXT_PADDING);
      var boxHeight = height - (2 * ANNOTATION_TEXT_PADDING);
      var boxX = x + width/2 - boxWidth/2;
      var boxY = y + height/2 - boxHeight/2;
      
      // for debug
          var rectStyle = {stroke: Color(112, 146, 190), "stroke-width": 1.0, "stroke-dasharray": "- "};
          var r = this.g.rect(boxX, boxY, boxWidth, boxHeight).attr(rectStyle);
	  //
      
	  this.drawAnnotationText(text, boxX, boxY, boxWidth, boxHeight);
	},
	
	drawLabel111111111: function(text, x, y, width, height, labelAttrs){
		var  debug = false;
		
		// text
		if (text != null && text != undefined && text != "") {
			var attr = LABEL_FONT;
			
			//console.log("x", x, "y", y, "width", width, "height", height );
			
			wrappedText = text;
			if (labelAttrs && labelAttrs.wrapWidth) {
				wrappedText = this.wrapTextToWidth(wrappedText, labelAttrs.wrapWidth);
			}
			var realWidth = this.getStringWidth(wrappedText, attr);
			var realHeight = this.getStringHeight(wrappedText, attr);
			
			var textAreaCX = x + width/2;
			var textAreaCY = y + 3 + height + this.getStringHeight(wrappedText, attr)/2;
			
			var textX = textAreaCX;
			var textY = textAreaCY;

			var textAttrs = {};
			if (labelAttrs && labelAttrs.align) {
				switch (labelAttrs.align) {
					case "left": 
						textAttrs["text-anchor"] = "start"; 
						textX = textX - realWidth/2;
					break;
					case "center": 
						textAttrs["text-anchor"] = "middle"; 
					break;
					case "right": 
						textAttrs["text-anchor"] = "end"; 
						textX = textX + realWidth/2;
					break;
				}
			}
			if (labelAttrs && labelAttrs.wrapWidth) {
				if (true) {
					// Draw frameborder
					var textAreaStyle = {stroke: Color.LightSteelBlue2, "stroke-width": 1.0, "stroke-dasharray": "- "};
					var textAreaX = textAreaCX - realWidth/2;
					var textAreaY = textAreaCY+.5 - realHeight/2;
					var textArea = this.g.rect(textAreaX, textAreaY, realWidth, realHeight).attr(textAreaStyle);
					
					var textAreaLines = this.g.path("M" + textAreaX + " " + textAreaY + "L" + (textAreaX+realWidth) + " " + (textAreaY+realHeight) + "M" +  + (textAreaX+realWidth) + " " + textAreaY + "L" + textAreaX + " " + (textAreaY+realHeight));
					textAreaLines.attr(textAreaStyle);
					
					this.g.ellipse(textAreaCX, textAreaCY, 3, 3).attr({fill: Color.LightSteelBlue2, stroke: "none"});
				}
			}
			
			var label = this.g.text(textX, textY, wrappedText).attr(attr).attr(textAttrs);
			//label.id = Raphael.createUUID();
			//console.log("label ", label.id, ", ", wrappedText);
			
			if (this.fontSmoothing) {
				label.attr({stroke: LABEL_COLOR, "stroke-width":.4});
			}
			
			if (debug) {
				var imageAreaStyle = {stroke: Color.grey61, "stroke-width": 1.0, "stroke-dasharray": "- "};
				var imageArea = this.g.rect(x+.5, y+.5, width, height).attr(imageAreaStyle);
				var imageAreaLines = this.g.path("M" + x + " " + y + "L" + (x+width) + " " + (y+height) + "M" +  + (x+width) + " " + y + "L" + x + " " + (y+height));
				imageAreaLines.attr(imageAreaStyle);
				var dotStyle = {fill: Color.Coral, stroke: "none"};
				this.g.ellipse(x, y, 3, 3).attr(dotStyle);
				this.g.ellipse(x+width, y, 2, 2).attr(dotStyle);
				this.g.ellipse(x+width, y+height, 2, 2).attr(dotStyle);
				this.g.ellipse(x, y+height, 2, 2).attr(dotStyle);
			}
			
			return label;
		}
	},
	
	//	时间格式方法
	Time: function(value){
		var dateTime = new Date(value);
		var time = dateTime.getFullYear() 
					+ '/' + (dateTime.getMonth() + 1)
					+ '/' + dateTime.getDate()
					+ '-' +dateTime.getHours()
					+ ':' + dateTime.getMinutes()
					+ ':' + dateTime.getSeconds();
		return time;
	},
	
	vvoid: function(){},
	
	
	
};
