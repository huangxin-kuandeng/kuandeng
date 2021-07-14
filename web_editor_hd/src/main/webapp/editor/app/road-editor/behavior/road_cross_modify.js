iD.behavior.RoadCrossModify = function (context,selectedIDs) {
    var perform=false;
    function keydown() {
        if (d3.event && d3.event.shiftKey) {
            context.surface()
                .classed('behavior-multiselect', true);
        }
    }

    function keyup() {
        if (!d3.event || !d3.event.shiftKey) {
            context.surface()
                .classed('behavior-multiselect', false);
        }
    }
    function roadCrossLine (datum) {
        var layers = iD.Layers, layer = layers.getCurrentModelEnableLayer(iD.data.DataType.C_NODE);
        if (layer && layer.isRoad()){
            var entity = context.graph().entity(selectedIDs[0]);
            if (context.isRoadCross(entity)){
                selectedIDs.push(datum.id)
                var action=iD.actions.RoadCrossModify(selectedIDs);
                action.setEditProcess(true);
                context.replace(action,t('operations.road_cross_edit.description'));
            }
        }
    }
    
    function roadCrossRelation(id){
    	var graph = context.graph();
    	var entity = graph.hasEntity(id);
    	if(!entity) return ;
    	var rels = graph.parentRelations(entity, iD.data.DataType.R_C_NODE_ROAD_NODE);
    	return rels[0];
    }

    /*
    * 修改综合交叉点的时候判断被综合的结点是否联通
    * 分为两种情况：1）选中的点，原来已经被综合，那么把该点从被综合点取消
    *               2）选中的点，原来没有被综合，那么把该点加入综合交叉点
    *  判断上述两种情况下，内部道路的结点是否联通，如果联通返回true，不联通返回false
    *
    *  @param：datum为选中的结点
    *           roadCross为综合交叉点id
    *           context为当前全局变量
    * */
    function isUnicomInnerMembers(datum,roadCrossID,context){
    	var rel = roadCrossRelation(roadCrossID);
        var members = rel && rel.members || [];
        var nodesArr = [];
        members.forEach(function(member){
            nodesArr.push(member.id);
        })
        //情况2,结点原来没有被综合，只要与被综合点之一联通那么整体就联通
        if(nodesArr.indexOf(datum.id) == -1){
            for(var j = 0;j<nodesArr.length;j++){
                if(iD.util.roadCrossExtend.isUnicomBetweenTwoNodes(datum,context.graph().entity(nodesArr[j]),context)){
                    return true;
                }
            }
        }else{
            //情况1 选中的点，原来已经被综合，那么判断删除改综合点以后剩余的点必须全部联通
            var index = nodesArr.indexOf(datum.id);
            nodesArr.splice(index,1);
            return iD.util.roadCrossExtend.isUnicomOfArr(nodesArr,context);
        }
        return false;
    }

    function click() {
        var datum = d3.event.target.__data__;
        var roadCrossId = selectedIDs[0];
        //var sIDs = context.selectedIDs()
        if (datum && datum.tags) {
            if (datum.modelName == iD.data.DataType.ROAD_NODE) {
                var flag=false;

                var ways=[];

                context.graph().parentWays(datum).forEach(function(d){

                    if(!d.isOneRoadCrossWay()){
                        return ways.push(d);
                    }
                });
                if(ways.length<2)
                {
                    Dialog.alert('悬挂点不能综合成综合交叉点');
                    return;
                }

                var isInCrossFlag=false;
                var rel = roadCrossRelation(datum);
                if(rel && !_.pluck(rel.members, 'id').includes(roadCrossId)){
                	flag=true;
                }
                if(flag){
                    Dialog.alert('选择的节点中已经被其它综合交叉点综合,请选择其它节点');
                    return;
                }
                isInCrossFlag = rel && _.pluck(rel.members, 'id').includes(datum.id);
                
                if(rel && !isInCrossFlag){
                    if(rel.members.length>7)
                    {
                        Dialog.alert('综合交叉点最多只能综合8个节点');
                        return;
                    }

                    var nodesIdArr=[];
                    rel.members.forEach(function(member){
                        nodesIdArr.push(member.id);
                    })
                    nodesIdArr.push(datum.id);
                    if(iD.util.roadCrossExtend.getNodesOutWayNum(nodesIdArr,context.graph())>15)
                    {
                        Dialog.alert('综合交叉点最多只能关联15条路');
                        return;
                    }
                }

                //增加被综合结点是否是联通的判断
                if(selectedIDs.length>0&&!isUnicomInnerMembers(datum, roadCrossId, context)){
                    Dialog.alert('被综合的结点间道路不连通，不能执行该编辑');
                    return;
                }


                if (selectedIDs.length > 0) {
                    perform=true;
                    roadCrossLine (datum);
                } else {

                }

            } else if (datum.modelName == iD.data.Constant.C_NODE) {
                //context.roadCrossEdit(false);
                //context.perform
                //selectedIDs.push[datum.id]

                context.enter(iD.modes.Browse(context));
            }
        }
    }
    var behavior = function (selection) {
        var lastMousePos,
            lastMouseTarget,
            clickTimeId;
        d3.select(window)
            .on('keydown.roadcross', keydown)
            .on('keyup.roadcross', keyup);
        //the drag behover sometimes block the "click" events, no idea why, so hack to trigger click
        selection.on('mousedown.roadcross', function () {

            lastMousePos = [d3.event.clientX, d3.event.clientY];

            lastMouseTarget = d3.event.target;
        })
            .on('mouseup.roadcross', function () {

                var upPos = [d3.event.clientX, d3.event.clientY]

                if (d3.event.target === lastMouseTarget &&
                    iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {

                    var targetEvent = d3.event;

                    if (clickTimeId) {
                        clearTimeout(clickTimeId);
                    }

                    clickTimeId = setTimeout(function () {

                        //console.warn('Downup click triggered');

                        clickTimeId = null;

                        var oldEvent = d3.event;

                        d3.event = targetEvent;

                        click();

                        d3.event = oldEvent;

                        targetEvent = null;

                    }, 250);
                }

                lastMousePos = null;
                lastMouseTarget = null;

            })
            .on('click.roadcross', function () {

                if (clickTimeId) {
                    clearTimeout(clickTimeId);
                    clickTimeId = null;
                }

                click();
            });
        keydown();
        context.perform(iD.actions.Noop(),t('operations.road_cross_edit.description'));
    };

    behavior.off = function (selection) {

        if(!perform)
        {
            context.pop();
        }else{
            context.replace(iD.actions.RoadCrossModify(selectedIDs), t('operations.road_cross_edit.description'));
        }
        d3.select(window)
            .on('keydown.roadcross', null)
            .on('keyup.roadcross', null);

        selection.on('click.roadcross', null);
        selection.on('mouseup.roadcross', null);
        selection.on('mousedown.roadcross', null);
        keyup();
    };

    return behavior;
};