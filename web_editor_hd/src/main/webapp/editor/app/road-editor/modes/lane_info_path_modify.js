iD.modes.LaneInfoModify = function(context, selectedIDs,maat) {
    var isCorrect=false;
    var fromMember = maat.memberByRole(iD.data.RoleType.FROAD_ID);
    var toMember = maat.memberByRole(iD.data.RoleType.TROAD_ID);
    var nodeMember = maat.modelName === iD.data.DataType.NODECONN? maat.memberByRole(iD.data.RoleType.ROAD_NODE_ID) : maat.memberByRole(iD.data.RoleType.C_NODE_ID);
    var initSelectedIds=function(maat)
    {
        if(context.hasEntity(fromMember.id)){
            selectedIDs.push(fromMember.id);
        }
        if(context.hasEntity(toMember.id)){
            selectedIDs.push(toMember.id);
        }
    }


    var addNextWay=function(sortWayIds,wayIds)
    {
        if(sortWayIds.length>1&&wayIds.length>0)
        {
            var preWay=context.entity(sortWayIds[sortWayIds.length-1]);
            var prePreWay=context.entity(sortWayIds[sortWayIds.length-2]);
            var nextNodeId;
            if(preWay.first()==prePreWay.first()||preWay.first()==prePreWay.last())
            {
                nextNodeId=preWay.last();
            }else{
                nextNodeId=preWay.first();
            }
            var pways=context.graph().parentWays(context.entity(nextNodeId))
            for(var i=0;i<pways.length;i++)
            {
                var index=wayIds.indexOf(pways[i].id);
                if(-1!=index)
                {
                    sortWayIds.push(pways[i].id);
                    wayIds.splice(index,1);
                    addNextWay(sortWayIds,wayIds);
                    break;
                }
            }
            return;
        }
        return
    }

    var isCorrectLinkRoad=function(sortWayIds)
    {
        var currWay,nextWay
        for(var i=0;i<sortWayIds.length-1;i++)
        {
            currWay=context.entity(sortWayIds[i]);
            nextWay=context.entity(sortWayIds[i+1]);
            if(currWay.tags.DIRECTION==iD.way.direction.twowayforbid)
            {
                return false;
            }
            if(currWay.tags.DIRECTION==iD.way.direction.twoway)
            {
                continue;
            }
            if(currWay.first()==nextWay.first()||currWay.first()==nextWay.last())
            {
                if(currWay.tags.DIRECTION==iD.way.direction.reverse)
                {
                    continue;
                }else{
                    return false;
                }
            }else{
                if(currWay.tags.DIRECTION==iD.way.direction.positive)
                {
                    continue;
                }else{
                    return false;
                }
            }
        }
        if(nextWay.tags.DIRECTION==iD.way.direction.twowayforbid)
        {
            return false;
        }else    if(nextWay.tags.DIRECTION==iD.way.direction.twoway)
        {
            return true;
        }else  if(nextWay.first()==currWay.first()||nextWay.first()==currWay.last())
        {
            if(nextWay.tags.DIRECTION==iD.way.direction.positive)
            {
                return true;
            }else{
                return false;
            }
        }else{
            if(nextWay.tags.DIRECTION==iD.way.direction.reverse)
            {
                return true;
            }else{
                return false;
            }
        }
    }
    var mode = {
        id: 'LaneInfoModify',
        button: 'LaneInfoModify'
    };
    if(maat&&selectedIDs.length==0)
    {
        initSelectedIds(maat);
    }
    var keybinding = d3.keybinding('LandInfoModify'),
        behaviors = [
            iD.behavior.Hover(context),
            iD.behavior.LaneInfoPathEdit(context,selectedIDs,maat)];
    mode.selectedIDs = function() {
        return selectedIDs;
    };
    mode.setSelectedIDs = function(_) {
        if(_){
            selectedIDs = _;
        }
        return selectedIDs;
    };
    mode.enter = function() {
        keybinding.on('⎋', function() {
            context.enter(iD.modes.Browse(context));
        }, true);
        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });
        d3.select(document)
            .call(keybinding);
        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', true);
        }
        context.map().on('drawn.select', selectElements);
        selectElements();
    };
    mode.availableExit=function()
    {
        var sortWayIds=[];
        var wayIds=[];
        var crossMemberNodes=[];
        for(var i=0;i<selectedIDs.length;i++)
        {
            var id=selectedIDs[i];
            if(id!=fromMember.id)
            {
                if(maat.modelName==iD.data.DataType.NODECONN)
                {
                    if(id!=toMember.id)
                    {
                        wayIds.push(id);
                    }
                }else{
                    wayIds.push(id);
                }

            }
        }
        let topoEntity = iD.TopoEntity();
        if(maat.modelName==iD.data.DataType.NODECONN)
        {
            sortWayIds.push(fromMember.id);
            sortWayIds.push(toMember.id);
            addNextWay(sortWayIds,wayIds);
        }else{
            sortWayIds.push(fromMember.id);
            var crossNode=context.entity(nodeMember.id);
            var crossMemberNodes=[];
            //var cmembers=crossNode.members;
            var cmembers = topoEntity.getCrossNodeMembers(context.graph(), nodeMember.id);
            for(var i=0;i<cmembers.length;i++)
            {
                crossMemberNodes.push(cmembers[i].id);
            }
            var firstWay=context.entity(fromMember.id);
            var nextNodeId;
             if(-1!=crossMemberNodes.indexOf(firstWay.first())){
                 nextNodeId=firstWay.first();
             }else{
                 nextNodeId=firstWay.last();
             }
            var pways=context.graph().parentWays(context.entity(nextNodeId))
            for(var i=0;i<pways.length;i++)
            {
                var index=wayIds.indexOf(pways[i].id);
                if(-1!=index)
                {
                    sortWayIds.push(pways[i].id);
                    wayIds.splice(index,1);
                    addNextWay(sortWayIds,wayIds);
                    break;
                }
            }
        }
        if(wayIds.length>0)
        {
            Dialog.alert( "请选择依次相连的道路作为TurnGuidance路径");
            return false;
        }
        if(!isCorrectLinkRoad(sortWayIds))
        {
            Dialog.alert( "请选择依次相连并可通行的道路作为TurnGuidance路径");
            return false;
        }
        if(sortWayIds.length<3)
        {
            Dialog.alert( "TurnGuidance路径不能少于3条道路");
            return false;
        }
        for(var i=1;i<sortWayIds.length;i++)
        {
            var wayEntity=context.entity(sortWayIds[i]);
            if(wayEntity.id==toMember.id)
            {
                break;
            }
            if(-1==crossMemberNodes.indexOf(wayEntity.first())||-1==crossMemberNodes.indexOf(wayEntity.last()))
            {
                Dialog.alert( "TurnGuidance道路之间只能为内部道路");
                return false;
            }
        }
        var length=selectedIDs.length;
        for(var i=0;i<length;i++)
        {
           selectedIDs.pop();
        }
        for(var i=0;i<sortWayIds.length;i++)
        {
            selectedIDs.push(sortWayIds[i]);
        }
        isCorrect=true;
        return true;
    }
    mode.exit = function() {
        if(!isCorrect)
        {
            var length=selectedIDs.length;
            for(var i=0;i<length;i++)
            {
                selectedIDs.pop();
            }
        }
        //if (timeout) window.clearTimeout(timeout);
        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });
        //context.enter(iD.modes.Browse(context));    //修复多次撤销，虽然综合交叉点已经删除，但是一直在综合交叉点模式不能选中道路 leo.wz
        context.surface().selectAll('.selected')
            .classed('selected', false);
        context.map().on('drawn.select', null);
        keybinding.off();
    };

    return mode;
};
