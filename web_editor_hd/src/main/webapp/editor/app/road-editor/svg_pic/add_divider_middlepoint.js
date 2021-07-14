/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 14:26:04
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 添加中间点
iD.svg.PicDraw.addDividerMiddlePoint = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
		},
		getId: function(){
			return constant.DIVIDER_ADD_MIDDLEPOINT;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('添加中间点')
                .attr('modelName',iD.data.DataType.DEFAULT)
                .data([this.getId()]);
		}
	});
	
	return new drawPlus();
}
