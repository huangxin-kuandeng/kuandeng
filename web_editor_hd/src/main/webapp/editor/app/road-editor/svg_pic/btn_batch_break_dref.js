/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 14:33:38
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 打断车道组
iD.svg.PicDraw.btnBatchBreakDref = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
		},
		getId: function(){
			return constant.BATCH_BREAK_DREF;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('打断车道组')
                .attr('modelName',iD.data.DataType.DIVIDER)
                .data([this.getId()]);
		}
	});
	
	return new drawPlus();
}
