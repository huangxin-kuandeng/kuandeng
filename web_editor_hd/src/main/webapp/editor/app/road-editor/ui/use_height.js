/*
 * @Author: tao.w
 * @Date: 2020-03-24 16:17:07
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-14 16:44:15
 * @Description:  是否使用高程文件 测量地面
 */

iD.ui.useHeight = function (context) {

    var btnDatas = [{
        id: 'btn-use-heigth',
        title: '使用高程',
        action: function () {
            context.enter(iD.modes.Browse(context));
        }
    }];
    // let isActive = false;
    let statusStr = ['启用','禁用'];

    function buttonActive(_active) {
        let $button = d3.select('.btn-use-heigth');
        $button.classed('active', _active);
        context.variable.isUseHeight = _active;
    }

    function initEvent(){
        iD.Task.on('start.useHeigth', function (task) {
            if (iD.User.isVerifyRole() || iD.User.isCheckRole() || iD.util.urlParamHistory()) {
                buttonActive(false);
            } else if (iD.User.isWorkRole()) {
                buttonActive(true);
            }
        })
    }
 
    
    return function (selection) {
        initEvent()
        var button = selection.selectAll('button')
            .data(btnDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function (d) {
                return d.id;
            })
            .classed('active',context.variable.isUseHeight)
            .on('click.useHeight', function (d) {
                let $button = d3.select(this);
                // isActive = !$button.classed('active');
                context.variable.isUseHeight = !context.variable.isUseHeight;
                $button.classed('active', context.variable.isUseHeight);
                d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .title(function (d) {
                    let _s = statusStr[~~context.variable.isUseHeight];
                    return d.title;
                }));

        button.append('span')
            .attr('class', 'text-fill')
            .text(function (d) {
                var str = d.title;
                for (var key in d.style) {
                    this.style[key] = d.style[key];
                }
                let _s = statusStr[~~context.variable.isUseHeight];
                
                return str.substring(0, d.titleNum || 4);
            });
    };
};