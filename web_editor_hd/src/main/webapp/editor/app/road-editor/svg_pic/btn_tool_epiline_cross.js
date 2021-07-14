iD.svg.PicDraw = iD.svg.PicDraw || {};
// 核线十字标记按钮
iD.svg.PicDraw.btnToolEpilineCross = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
		},
		getId: function(){
			return constant.TOOL_EPLILINE_CROSS;
		},
		renderBtn: function(selection){
            // 打开测量面板时保留的按钮
            var epilineClass = 'epliline_tool_btn';

            if(player.getEpilineTool()){
                selection.append('button')
                    .attr('class', epilineClass)
                    .attr('type','button')
                    .style('display', 'none')
                    .text('核线十字标记')
                	.data([constant.TOOL_EPLILINE_CROSS]);
            }
		}
	});
	
	return new drawPlus();
}
