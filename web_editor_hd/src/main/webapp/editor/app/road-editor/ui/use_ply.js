/*
 * @Author: tao.w
 * @Date: 2020-03-24 16:17:07
 * @LastEditors: tao.w
 * @LastEditTime: 2021-01-14 15:36:34
 * @Description:  是否使用地面
 */

iD.ui.usePLY = function (context) {
    var btnDatas = [{
        id: 'btn-use-ply',
        title: '使用地面',
        action: function () {
            context.enter(iD.modes.Browse(context));
        }
    }];
    // let isActive = false;
    let statusStr = ['启用', '禁用'];

    function buttonActive(_active) {
        let $button = d3.select('.btn-use-ply');
        $button.classed('active', _active);
        context.variable.isUsePLY = _active;
    }

    function initEvent() {
        iD.Task.on('start.usePLY', function (task) {
            // 不能进入正射图面板
            if (iD.User.isVerifyRole() || iD.User.isCheckRole() || iD.util.urlParamHistory()) {
                buttonActive(false);
            } else if (iD.User.isWorkRole()) {
                buttonActive(true);
            }
        })
    }

    return function (selection) {
        initEvent(context.variable.isUsePLY);
        console.log(context.variable.isUsePLY);
        var button = selection.selectAll('button')
            .data(btnDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function (d) {
                return d.id;
            })
            .classed('active', context.variable.isUsePLY)
            .on('click.usePLY', function (d) {
                let $button = d3.select(this);
                context.variable.isUsePLY = !context.variable.isUsePLY;
                $button.classed('active', context.variable.isUsePLY);
                d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .title(function (d) {
                    let _s = statusStr[~~context.variable.isUsePLY];
                    return d.title;
                }));

        button.append('span')
            .attr('class', 'text-fill')
            .text(function (d) {
                var str = d.title;

                for (var key in d.style) {
                    this.style[key] = d.style[key];
                }

                // let _s = statusStr[~~context.variable.isUsePLY];
                // return _s + str.substring(0, d.titleNum || 2);
                return str.substring(0, d.titleNum || 4);
            });
    };
};