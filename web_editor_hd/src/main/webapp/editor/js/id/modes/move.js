iD.modes.Move = function (context, entityIDs) {
    var mode = {
        id: 'move',
        button: 'browse'
    };

    var keybinding = d3.keybinding('move'),
        edit = iD.behavior.Edit(context),
        annotation = entityIDs.length === 1 ?
        t('operations.move.annotation.' + context.geometry(entityIDs[0])) :
        t('operations.move.annotation.multiple'),
        origin,
        nudgeInterval;

    function edge(point, size) {
        var pad = [30, 100, 30, 100];
        if (point[0] > size[0] - pad[0]) return [-10, 0];
        else if (point[0] < pad[2]) return [10, 0];
        else if (point[1] > size[1] - pad[1]) return [0, -10];
        else if (point[1] < pad[3]) return [0, 10];
        return null;
    }

    function startNudge(nudge) {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = window.setInterval(function () {
            context.pan(nudge);
            context.replace(
                iD.actions.Move(entityIDs, [-nudge[0], -nudge[1]], context.projection),
                annotation);
            var c = context.projection(origin);
            origin = context.projection.invert([c[0] - nudge[0], c[1] - nudge[1]]);
        }, 10);
    }

    function stopNudge() {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = null;
    }

    function start() {
        // var entitys = [];
        // entityIDs.forEach(function (entityID) {
        //     entitys.push(context.graph().entity(entityID));
        // });
        // var moveNodes=[];  //by 优化道路整体移动，道路长度更新代码
        // entitys.forEach(function(singleEntity){
        //     if(singleEntity.type =="way"){
        //         //对拖动的道路所有关联的道路的长度属性进行更新
        //         var fNode = context.graph().entity(singleEntity.first());
        //         var tNode = context.graph().entity(singleEntity.last());
        //         // context.replace(iD.actions.UpdateNode(context,fNode.id),annotation);
        //         //context.replace(iD.actions.UpdateNode(context,tNode.id),annotation);
        //         if(-1==moveNodes.indexOf(fNode))
        //         {
        //             moveNodes.push(fNode);
        //         }
        //         if(-1==moveNodes.indexOf(tNode))
        //         {
        //             moveNodes.push(tNode);
        //         }
        //     }
        // });
        // var modifyWays=[];
        // var modifyWayFlag={};
        // moveNodes.forEach(function(node){
        //     context.graph().parentWays(node).forEach(function(way){
        //         if(!way.isOneRoadCrossWay()&&!modifyWayFlag[way.id]){
        //             modifyWays.push(way);
        //             modifyWayFlag[way.id]=true;
        //         }
        //     })
        // })
        // wEnterAndRoadObj  = iD.util.walkExtend().getObjForWEnterAndRoad(modifyWays,context.graph());
    }


    function move() {
        var p = context.mouse();

        var delta = origin ? [p[0] - context.projection(origin)[0],
            p[1] - context.projection(origin)[1]
        ] : [0, 0];

        var nudge = edge(p, context.map().dimensions());
        if (nudge) startNudge(nudge);
        else stopNudge();

        origin = context.map().mouseCoordinates();

        context.replace(
            iD.actions.Move(entityIDs, delta, context.projection),
            annotation);
    }


    function available(moveNodes) {


        return true;
    }

    function finish() {



        d3.event.stopPropagation();
        context.enter(iD.modes.Select(context, entityIDs)
            .suppressMenu(true));
        stopNudge();
        /**var entity =  context.graph().entity(entityIDs);
		context.event['entityedite'] && context.event['entityedite']({entitys : [entity]});*/
        var entity = [];
        entityIDs.forEach(function (entityID) {
            entity.push(context.graph().entity(entityID));
        });


        var moveNodes = []; //by 优化道路整体移动，道路长度更新代码
        // let updateNodeActions = [];
        // let isUpdateNode = false;
        // entity.forEach(function (singleEntity) {
        //     if (singleEntity.type == "way") {
        //         //对拖动的道路所有关联的道路的长度属性进行更新
        //         // var fNode = context.graph().entity(singleEntity.first());
        //         // var tNode = context.graph().entity(singleEntity.last());
        //         // if(-1==moveNodes.indexOf(fNode))
        //         // {
        //         //     moveNodes.push(fNode);
        //         // }
        //         // if(-1==moveNodes.indexOf(tNode))
        //         // {
        //         //     moveNodes.push(tNode);
        //         // }
        //         isUpdateNode = true;
        //         updateNodeActions.push(iD.actions.UpdateNode(context, singleEntity.nodes[0]));
        //         updateNodeActions.push(iD.actions.UpdateNode(context, _.last(singleEntity.nodes)));
        //     }
        // });

        var modifyWays = [];
        var modifyWayFlag = {};
        // moveNodes.forEach(function (node) {
        //     context.replace(iD.actions.UpdateNode(context, node.id), annotation);
        // })
        // if (isUpdateNode) {
        //     updateNodeActions.push(annotation);
        //     context.replace.apply(this, updateNodeActions);
        // }
        if (!available(moveNodes)) {
            Dialog.alert("移动道路关联综合交叉点,无法跨图幅移动道路!", function () {
                context.pop();
                context.enter(iD.modes.Browse(context));
            })
            return
        }
        //判断平移道路是否超出边界
        var isOutTansactionExtent = false;
        for (var i = 0; i < entityIDs.length; i++) {
            let way = context.entity(entityIDs[i]);
            for (let j = 0; j < way.nodes.length; j++) {
                let datum = context.entity(way.nodes[j]);
                if (iD.util.pointNotInPlyGonx(datum.loc, context)) {
                    isOutTansactionExtent = true;
                    break;
                }
            }
        }
        if (isOutTansactionExtent == true) {
            Dialog.alert("已出对象边界", callback);
            context.pop();
        }

        //var datum = context.entity(entityIDs);
        //在可编辑区域外不可编辑
        // if(iD.util.entityNotInPlyGon(entityIDs, context)) {
        //     Dialog.alert("目标对象不可编辑",function(){
        //         context.pop();
        //     });
        //     return ;
        // }
        moveNodes.forEach(function (node) {
            context.graph().parentWays(node).forEach(function (way) {
                if (!way.isOneRoadCrossWay() && !modifyWayFlag[way.id]) {
                    modifyWays.push(way);
                    modifyWayFlag[way.id] = true;
                }
            })
        })
    
        context.event['entityedite'] && context.event['entityedite']({
            entitys: entity
        });
        //移动导航线跨图幅进行分隔
        // _.uniq(entityIDs).forEach(function(id){
        //     //拖动线，线跨过图幅边界时，对线进行打断
        //     var entity = context.graph().entity(id);
        //     /**
        // 	context.replace(
        //             iD.actions.MoveLineSplitTuFu(context, entity),
        //             t('operations.move.annotation.multiple'));*/
        // });

    }

    function callback() {
        context.history().undo();
        context.enter(iD.modes.Browse(context));
    };

    function cancel() {
        context.pop();
        context.enter(iD.modes.Select(context, entityIDs)
            .suppressMenu(true));
        stopNudge();
    }

    function undone() {
        context.enter(iD.modes.Browse(context));
    }

    mode.enter = function () {
        context.install(edit);

        context.perform(
            iD.actions.Noop(),
            annotation);
        start();
        context.surface()
            .on('mousemove.move', move)
            .on('click.move', finish);

        context.history()
            .on('undone.move', undone);

        keybinding
            .on('⎋', cancel)
            .on('↩', finish);

        d3.select(document)
            .call(keybinding);
    };

    mode.exit = function () {
        stopNudge();

        context.uninstall(edit);

        context.surface()
            .on('mousemove.move', null)
            .on('click.move', null);

        context.history()
            .on('undone.move', null);

        keybinding.off();
    };

    return mode;
};







iD.modes.NewMove = function (context, entityIDs) {
    var mode = {
        id: 'move',
        button: 'browse'
    };

    var keybinding = d3.keybinding('move'),
        edit = iD.behavior.Edit(context),
        annotation = entityIDs.length === 1 ?
        t('operations.move.annotation.multiple') :
        t('operations.move.annotation.multiple'),
        origin,
        nudgeInterval;

    context.event['dragstart'] && context.event['dragstart']({
        overlay: entityIDs
    });

    function edge(point, size) {
        var pad = [30, 100, 30, 100];
        if (point[0] > size[0] - pad[0]) return [-10, 0];
        else if (point[0] < pad[2]) return [10, 0];
        else if (point[1] > size[1] - pad[1]) return [0, -10];
        else if (point[1] < pad[3]) return [0, 10];
        return null;
    }

    function startNudge(nudge) {
        console.log('s');
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = window.setInterval(function () {
            context.pan(nudge);
            iD.actions.NewMove(entityIDs, [-nudge[0], -nudge[1]], context.projection).call();
            context.map().drawOverlayers();
            var c = context.projection(origin);
            origin = context.projection.invert([c[0] - nudge[0], c[1] - nudge[1]]);
        }, 50);
    }

    function stopNudge() {
        if (nudgeInterval) window.clearInterval(nudgeInterval);
        nudgeInterval = null;
    }

    function move() {
        var p = context.mouse();

        var delta = origin ? [p[0] - context.projection(origin)[0],
            p[1] - context.projection(origin)[1]
        ] : [0, 0];

        var nudge = edge(p, context.map().dimensions());
        if (nudge) startNudge(nudge);
        else stopNudge();

        origin = context.map().mouseCoordinates();

        iD.actions.NewMove(entityIDs, delta, context.projection).call();
        context.event['draging'] && context.event['draging']({
            overlay: entityIDs
        });
        context.map().drawOverlayers();

    }

    function finish() {
        context.event['dragend'] && context.event['dragend']({
            overlay: entityIDs
        });
        d3.event.stopPropagation();
        context.enter(iD.modes.Browse(context));
        stopNudge();

    }

    function cancel() {
        context.pop();
        stopNudge();
    }

    function undone() {
        context.enter(iD.modes.Browse(context));
    }

    mode.enter = function () {
        context.install(edit);

        context.surface()
            .on('mousemove.move', move)
            .on('click.move', finish);

        context.history()
            .on('undone.move', undone);

        keybinding
            .on('⎋', cancel)
            .on('↩', finish);

        d3.select(document)
            .call(keybinding);
    };

    mode.exit = function () {
        stopNudge();

        context.uninstall(edit);

        context.surface()
            .on('mousemove.move', null)
            .on('click.move', null);

        context.history()
            .on('undone.move', null);

        keybinding.off();
    };

    return mode;
};