/*
 * @Author: tao.w
 * @Date: 2019-11-22 10:35:22
 * @LastEditors: tao.w
 * @LastEditTime: 2019-11-25 16:07:54
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 前方交会按钮
iD.svg.PicDraw.btnIntersection = function (context, drawTool) {
    const constant = drawTool.getConstant();
    var player = drawTool.getPlayer();
    var drawStatus = {};

    function drawPlus() { }
    _.assign(drawPlus.prototype, {
        init: function (arg1) {
            drawStatus = arg1;
        },
        getId: function () {
            return constant.INTERSECTION;
        },
        renderBtn: function (selection) {
            var uselessClass = 'footer_useless_btn';
            if (iD.User.isTrackControlPointRole()) {
                uselessClass = '';
            }
            let $int = selection.selectAll('.intersection_group')
                .data([0]);
            let $ground = $int
                .enter().append('div')
                .html("<div class='input-group'><span class='input-group-btn'><button class='intersection_btn btn btn-default' type='button'>前方交会</button></span><input type='text' class='intersection-step " + uselessClass + "' lass='form-control' value =5></div> ");
            d3.select('.intersection_btn').data([this.getId()]);

            // let $groudBtn = $ground.enter().append('span');
            // let $button = $groudBtn.enter().append('input');
            // let $tbutton = $groudBtn.enter().append('input');




            // var $btn = selection.append('button')
            //     .attr('class', uselessClass)
            //     .attr('type', 'button')
            //     .text('前方交会')
            //     .data([this.getId()]);
            if (!player.isSubPlayer) {
                $ground.classed(uselessClass, true);
            }
        }
    });

    return new drawPlus();
}
