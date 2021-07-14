/*
 * @Author: tao.w
 * @Date: 2019-08-15 16:49:37
 * @LastEditors: tao.w
 * @LastEditTime: 2019-11-01 16:54:31
 * @Description: 
 */
iD.behavior.Draw = function (context, editArea) {
    var event = d3.dispatch('move', 'click', 'clickWay',
            'clickNode', 'undo', 'cancel', 'finish'),
        keybinding = d3.keybinding('draw'),
        hover = iD.behavior.Hover(context)
            .altDisables(true)
            .on('hover', context.ui().sidebar.hover),
        tail = iD.behavior.Tail(),
        edit = iD.behavior.Edit(context),
        closeTolerance = 4,
        tolerance = 12;
    // 是否限制绘制时的点击范围；
    editArea = editArea == null ? true : editArea;

    function datum() {
        if (d3.event.altKey) return {};
        else return d3.event.target.__data__ || {};
    }

    function mousedown() {

        function point() {
            var p = element.node().parentNode;
            return touchId !== null ? d3.touches(p).filter(function (p) {
                return p.identifier === touchId;
            })[0] : d3.mouse(p);
        }

        var element = d3.select(this),
            touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null,
            time = +new Date(),
            pos = point();
       iD.UserJobHeartbeat.setJobStatus();
        element.on('mousemove.draw', null);

        d3.select(window).on('mouseup.draw', function () {
            element.on('mousemove.draw', mousemove);
            iD.UserJobHeartbeat.setJobStatus();
            if (iD.geo.euclideanDistance(pos, point()) < closeTolerance ||
                (iD.geo.euclideanDistance(pos, point()) < tolerance &&
                (+new Date() - time) < 500)) {

                // Prevent a quick second click
                d3.select(window).on('click.draw-block', function () {
                    d3.event.stopPropagation();
                }, true);

                context.map().dblclickEnable(false);

                window.setTimeout(function () {
                    context.map().dblclickEnable(true);
                    d3.select(window).on('click.draw-block', null);
                }, 500);

                click();
            }
        });
    }

    function mousemove() {
        event.move(datum());
    }

    function click() {
        //---------------------------
        if (editArea && iD.util.pointNotInPlyGonx(context.map().mouseCoordinates(), context)) {
            Dialog.alert("已出对象边界！");
            return false;
        }
        var d = datum();
        var isEnable = true;

        //不允许点击事务边界外的道路
        if (d.type == 'way' && isEnable) {
            var nodes = d.nodes;
            for (var i = 0; i < nodes.length; i++) {
                var node = context.graph().entity(nodes[i]);
                if (editArea && iD.util.pointNotInPlyGonx(node.loc, context)) {
                    Dialog.alert("点击的道路已出对象边界！");
                    return false;
                }
            }
        }else if(d instanceof iD.Node&&isEnable&& d.modelName==iD.data.DataType.HIGHWAY){
            //不允许点击事务边界外的道路上的形状点
            var way = context.graph().parentWays(d);
            if(way.length==1){
                var nodes = way[0].nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = context.graph().entity(nodes[i]);
                    if (editArea && iD.util.pointNotInPlyGonx(node.loc, context)) {
                        Dialog.alert("点击的道路已出对象边界！");
                        return false;
                    }
                }
            }
        }
        if (d.type === 'way' && isEnable/** && !d.isArea()*/) {
            var choice = iD.geo.chooseEdge(context.childNodes(d), context.mouse(), context.projection),
                edge = [d.nodes[choice.index - 1], d.nodes[choice.index]];
            event.clickWay(choice.loc, edge,d);
        } else if (d.type === 'node' && isEnable) {
            event.clickNode(d);

        } else {
            event.click(context.map().mouseCoordinates());
        }
    }

    function backspace() {
        d3.event.preventDefault();
        event.undo();
    }

    function del() {
        d3.event.preventDefault();
        event.cancel();
    }

    function ret() {
        d3.event.preventDefault();
        event.finish();
    }
	// 通过context.install初始化
    function draw(selection) {
    	// 移动时，对应的点、线会有hover效果
        context.install(hover);
        // 限制地图显示的最小级别，限制16
        context.install(edit);
		// 跟随鼠标移动的文本label效果
        if (!iD.behavior.Draw.usedTails[tail.text()]) {
            context.install(tail);
        }

        keybinding
            .on('⌫', backspace)
            .on('⌦', del)
            .on('⎋', ret)
            .on('↩', ret);

        selection
            .on('mousedown.draw', mousedown)
            .on('mousemove.draw', mousemove);

        d3.select(document)
            .call(keybinding);

        return draw;
    }
	// 通过context.uninstall注销
    draw.off = function (selection) {
        context.uninstall(hover);
        context.uninstall(edit);

        if (!iD.behavior.Draw.usedTails[tail.text()]) {
            context.uninstall(tail);
            iD.behavior.Draw.usedTails[tail.text()] = true;
        }

        selection
            .on('mousedown.draw', null)
            .on('mousemove.draw', null);

        d3.select(window)
            .on('mouseup.draw', null);

        d3.select(document)
            .call(keybinding.off);
    };

    draw.tail = function (_) {
        tail.text(_);
        return draw;
    };

    return d3.rebind(draw, event, 'on');
};

iD.behavior.Draw.usedTails = {};
