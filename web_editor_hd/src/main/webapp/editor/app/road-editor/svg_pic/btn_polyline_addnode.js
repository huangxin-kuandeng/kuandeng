/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 18:22:53
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 添加节点按钮
iD.svg.PicDraw.btnPolylineAddNode = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
		},
		getId: function(){
			return constant.POLYLINE_ADD_NODE;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('添加节点')
                .attr('modelName',iD.data.DataType.DEFAULT)
                .data([this.getId()]);
		}
	});
	
	return new drawPlus();
}
