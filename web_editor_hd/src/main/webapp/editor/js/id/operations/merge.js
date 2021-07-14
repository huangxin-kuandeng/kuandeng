iD.operations.Merge = function (selectedIDs, context) {
    var join = iD.actions.Join(selectedIDs),
        // roadMergeTip = iD.ui.RoadMergeTip(context),
        merge = iD.actions.Merge(selectedIDs, context),
        mergePolygon = iD.actions.MergePolygon(selectedIDs),
        layer = context.layers().getLayer(context.entity(selectedIDs[0]).layerId), isRoadLayer = layer && layer.isRoad(), anotion = isRoadLayer ? 'merge-road' : 'merge';
        // layer = context.layers().getCurrentEnableLayer(), isRoadLayer = layer && layer.isRoad(), anotion = isRoadLayer ? 'merge-road' : 'merge';

    function availableCrossWay() {
        var isAvailable = false;
        selectedIDs.forEach(function (sID) {
            var entity = context.entity(sID);
            if (context.isOneRoadCrossWay(entity)) isAvailable = true;
        });
        return isAvailable;
    }

    var annotation, action;


    //判断道路合并以后的综合交叉点内部综合结点的连通性
    //nodeID为被合并的结点，start，end为待合并的两条道路。
    function isUnicomInnerMember(nodeID,start,end,context){
        var crossNodeAId = iD.TopoEntity().isInCrossNode(context.graph(),nodeID);
        var members = context.graph().entity(crossNodeAId).members;
        var nodesArr = [];
        members.forEach(function(member){
            nodesArr.push(member.id);
        })
        var index = nodesArr.indexOf(nodeID);
        nodesArr.splice(index,1);
        var node1 = context.graph().entity(nodeID);
        //如果剩余的结点是连通的的情况下，判断删除的结点与其他结点除了待删除的道路是否还有其他联通的
        if(iD.util.roadCrossExtend.isUnicomOfArr(nodesArr,context)){
            for(var j = 0;j<nodesArr.length;j++){
                var ways = iD.util.roadCrossExtend.unicomWaysBetweenTwoNodes(node1,context.graph().entity(nodesArr[j]),context);
                //只有一条连通道路，并且这条路不是被合并的两条道路之一
                if(ways.length ==1&&ways[0]!=start&&ways[0]!=end){
                    return true;
                }else if(ways.length>1){
                    return true;
                }
            }
        }

        return false;
    }

    function isRoadMerge(start,end)
    {

        if(isMergeCyclic(start,end))
        {
            Dialog.alert('合并道路会导致环形道路,无法合并');
            return false;
        }


        var nodeId=start.nodes[0];

        if(start.nodes[0]==end.nodes[0]||start.nodes[0]==end.nodes[end.nodes.length-1])
        {
            nodeId=start.nodes[0];
        }else if(start.nodes[start.nodes.length-1]==end.nodes[0]||start.nodes[start.nodes.length-1]==end.nodes[end.nodes.length-1]){
            nodeId=start.nodes[start.nodes.length-1];
        }
        var num=iD.TopoEntity().getRoadIsInCrossParentWaysNum(context.graph().entity(nodeId),context.graph());
        if(num>2){
            if(!isUnicomInnerMember(nodeId,start,end,context)) {
                Dialog.alert('合并道路导致被综合的结点间道路不连通，不能执行该编辑');
                return false;
            }
        }
        if(num!=0&&num==3)
        {
            Dialog.alert(iD.alert.tip.operation_create_fake_node_in_crossnode,function(){
                context.enter(iD.modes.Select(context,[nodeId]).suppressMenu(true));
            });
            return false;
        }else{
            return true;
        }
    }

    var isMergeCyclic=function(start,end)
    {
        var mapTool={};
        mapTool[start.first()]=1;
        mapTool[start.last()]=1;
        mapTool[end.first()]=mapTool[end.first()]?(mapTool[end.first()]+1):1;
        mapTool[end.last()]=mapTool[end.last()]?(mapTool[end.last()]+1):1;
        var flag=false;
        var mapWay={};
        for(var key in mapTool)
        {
            if(1==mapTool[key])
            {
                context.graph().parentWays(context.graph().entity(key)).forEach(function(way){
                   if(!flag)
                   {
                       if(!mapWay[way.id]){
                           mapWay[way.id]=1;
                       }else{
                           flag=true;
                       }
                   }

                })
            }
        }
        return flag;
    }


    var operation = function () {

        annotation = t('operations.' + anotion + '.annotation', {n: selectedIDs.length});
        if (!join.disabled(context.graph())) {
        	// ROAD
            action = join;
        } else if (!merge.disabled(context.graph())) {
            action = merge;
        } else {
            action = mergePolygon;
        }
        var graph = context.graph();
        var start = graph.entity(selectedIDs[0]);

        if (iD.Layers.getLayer(start.layerId).isRoad()) {


            var end = graph.entity(selectedIDs[1]);
           if(isRoadMerge(start,end))
           {
               action = merge;

               //roadMergeTip.setPerformAction(performAction);
               performAction(start.id);
               // roadMergeTip.perform(context.container(), start, end, performAction,cancelAction);
            }
            // .call(,);
        } else {
            performAction();
        }

    };
    var performAction = function (wayId) {
        action.wayId(wayId);
        context.perform(action, annotation);

        context.enter(iD.modes.Select(context, selectedIDs.filter(function (id) {
            return context.hasEntity(id);
        })).suppressMenu(true));
    }
    // var cancelAction = function () {
    //     context.enter(iD.modes.Select(context, selectedIDs.filter(function (id) {
    //         return context.hasEntity(id);
    //     })).suppressMenu(true));
    // }
    var isEditable = function(_){
        var editable = true;
        for (var i = 0; i < _.length; i++) {
            var entity = context.graph().entity(_[i]),
                modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if (!modelConfig) return false;
            editable = modelConfig.editable; //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
            if(!editable) return false;
        }
        return editable;
    }
    operation.available = function () {
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        var entity = context.entity(selectedIDs[0]);
        // var editable = iD.Static.layersInfo.isEditable(entity.modelName?entity.modelName:false);
        var editable = isEditable(selectedIDs);
        if (entity.modelName != iD.data.DataType.ROAD || entity.type === 'node' || (entity.isArea && entity.isArea()) || selectedIDs.length != 2 || availableCrossWay()) {
            return false;
        }
        // 编辑范围判断
        for(var d of _.map(selectedIDs, context.entity)){
        	if(!iD.util.entityInPlyGon(d, context)){
				return false;
			}
        }
        
        //路口上只有两条线才可以合并
        if (selectedIDs.length > 1) {
            var id1 = selectedIDs[0],
                id2 = selectedIDs[1];
            var e1 = context.graph().entity(id1),
                e2 = context.graph().entity(id2);
            var e1f = e1.first(),
                e2f = e2.first(),
                e1l = e1.last(),
                e2l = e2.last();
            var sp = '';
            if ((e1f === e2f && e1l === e2l) || (e1l === e2f && e1f === e2l))//  判读要合并后的道路是否为环形道路
            {
                return false;
            }
            /*
             if(e1f === e2f || e1f === e2l){
             sp = e1f;
             }else if(e1l === e2l || e1l === e2f){
             sp = e1l;
             }
             if(sp){
             var ex = context.graph().entity(sp);
             var pws = context.graph().parentWays(ex);
             if(pws.length > 2)return false;
             }*/

        }
        return editable && iD.Layers.getLayer(entity.layerId, entity.modelName).editable && selectedIDs.length >= 2 && !operation.disabled();
    };

    operation.disabled = function () {
        return join.disabled(context.graph()) &&
            merge.disabled(context.graph()) &&
            mergePolygon.disabled(context.graph());
    };

    operation.tooltip = function () {
        var j = join.disabled(context.graph()),
            m = merge.disabled(context.graph()),
            p = mergePolygon.disabled(context.graph());

        if (j === 'restriction' && m && p)
            return t('operations.' + anotion + '.restriction', {relation: context.presets().item('type/restriction').name()});

        if (p === 'incomplete_relation' && j && m)
            return t('operations.' + anotion + '.incomplete_relation');

        if (j && m && p)
            return t('operations.' + anotion + '.' + j);

        return t('operations.' + anotion + '.description');
    };

    operation.id = 'merge';
    operation.keys = [t('operations.' + anotion + '.key')];
    operation.title = t('operations.' + anotion + '.title');

    return operation;
};
