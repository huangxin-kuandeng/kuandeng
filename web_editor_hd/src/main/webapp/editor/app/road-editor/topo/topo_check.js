
iD.topo.check=function()
{
    var handle={};
    var displayFlag=true;
    var nodeCheck=function(graph,entity)
    {
        var wayArr=[];
        graph.parentWays(entity).forEach(function(way){
            if(!way.isOneRoadCrossWay())
            {
                wayArr.push(way.id);
            }
        });
        var nodeMaatMap={};
        for(var i=0;i<wayArr.length;i++)
        {
            for(var j=0;j<wayArr.length;j++)
            {
                nodeMaatMap[wayArr[i]+"-"+entity.id+"-"+wayArr[j]]=1;
            }
        }
        var nodeSaatMap={};
        for(var i=0;i<wayArr.length;i++)
        {
            nodeSaatMap[wayArr[i]+"-"+entity.id]=1;
        }
        graph.parentRelations(entity).forEach(function(rel){
            if(rel.modelName==iD.data.DataType.NODECONN)
            {
                var fromMember = rel.memberByRole(iD.data.RoleType.FROAD_ID);
                var toMember = rel.memberByRole(iD.data.RoleType.TROAD_ID);
                var nodeMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
                if(1==nodeMaatMap[fromMember.id+"-"+nodeMember.id+"-"+toMember.id])
                {
                    nodeMaatMap[fromMember.id+"-"+nodeMember.id+"-"+toMember.id]=0;
                }else{
                    nodeMaatMap[fromMember.id+"-"+nodeMember.id+"-"+toMember.id]=2;
                }
            }
            /*
            else if(rel.modelName==iD.data.DataType.NODEINFO){
                var roadMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);       // 根据role为road获取对应的道路member成员
                var nodeMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);       // 根据role为node获取对应的道路member成员
                if(1==nodeSaatMap[roadMember.id+"-"+nodeMember.id])
                {
                    nodeSaatMap[roadMember.id+"-"+nodeMember.id]=0;
                }else{
                    nodeSaatMap[roadMember.id+"-"+nodeMember.id]=2;
                }
            }
            */
        });
        var flag=true;
        for(var key in nodeSaatMap)
        {
            if(1==nodeSaatMap[key]||2==nodeSaatMap[key])
            {
                flag=false;
            }
        }
        for(var key in nodeMaatMap)
        {
            if(1==nodeMaatMap[key]||2==nodeMaatMap[key])
            {
                flag=false;
            }
        }
        if(!flag)
        {
            console.log("Check node topo error")
            for(var key in nodeSaatMap)
            {
                if(1==nodeSaatMap[key]){
                    console.log("缺少 NODEINFO:"+key);
                }else if(2==nodeSaatMap[key])
                {
                    console.log("多余 NODEINFO:"+key);
                }
            }
            for(var key in nodeMaatMap)
            {
                if(1==nodeMaatMap[key]){
                    console.log("缺少 nodemaat:"+key);
                }else if(2==nodeMaatMap[key])
                {
                    console.log("多余 nodemaat:"+key);
                }
            }
        }
        return flag;
    }

    //判断步导点附近0.1米处是否存在行人可通行的道路，但是与之没有建立关系。或者行人不可通行道路，但是建立了关系。另外进行重复性检查判断
    var walkEnterCheck = function(graph,entity,context){
        //判断关系是否有重复的关系，如果有返回真
        function hasSameRel(arr) {
            var result = [], hash = {};
            function getJointName(rel){
                var walkEnterMember = rel.memberByRole(iD.data.RoleType.WALKENTER);
                var highWayMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);
                var str = walkEnterMember.id+highWayMember.id;
                return str;
            }
            for (var i = 0, elem; (i<arr.length)&&(elem = getJointName(arr[i])) != null; i++) {
                if (!hash[elem]) {
                    result.push(arr[i]);
                    hash[elem] = true;
                }
            }
            if(result.length == arr.length) return false;
            return true;
            //return result;
        }
        var str = undefined;
        var highWays = iD.util.walkExtend().getHighWaysWithFilterBBox(context,0.1,entity);
        //行人可通行道路id数组
        var highWayIDs = [];
        highWays.forEach(function(highWay){
            if(highWay.isNaviType()){
                highWayIDs.push(highWay.id);
            }
        });

        var relations = graph.parentRelations(entity).filter(function(rel){
            if(rel.modelName == iD.data.DataType.RELWKETROAD){
                return true;
            }
            return false;
        })
        if(hasSameRel(relations)){
            str = "步导点"+entity.id+"与道路的关系存在重复关系,请确认";
            return str;
        }

        for(var i=0;i<relations.length;i++){
            //var walkEnterMember = relations[i].memberByRole(iD.data.RoleType.WALKENTER);
            var highWayMember = relations[i].memberByRole(iD.data.RoleType.ROAD_ID);
            var index = highWayIDs.indexOf(highWayMember.id);
            //存在多余的步导点与道路的关系
            if(index==-1){
                str = "存在多余的步导点"+entity.id+"与道路"+highWayMember.id+"的关系";
                return str;
            }else{
                highWayIDs.splice(index,1);
            }
        }

        if(highWayIDs.length>0){
            str = "步导点"+entity.id+"的0.1米范围内存在不关联的行人可通行道路"+highWayIDs;
        }
        return str;
    }

	/**
	 * 综合交叉点保存之前的格式校验
	 * @param {Object} context
	 * @param {Object} entity
	 */
    var RoadCrossCheck=function(context,entity)
    {
    	var flag = true;
    	
    	context.graph().parentRelations(entity).forEach(function(rel){
    		if(!flag){
    			return ;
    		}
            if(rel.modelName==iD.data.DataType.R_C_NODE_ROAD_NODE) {
                var roadNodes = rel.members.filter(function(m){
                	return m.modelName == iD.data.DataType.ROAD_NODE;
                });
                // 不联通
		    	if(!iD.util.roadCrossExtend.isUnicomOfArr(_.pluck(roadNodes, 'id'), context)){
		    		flag = false;
		    	}
            }
        });
        
        return flag;
        
    	/*
        var wayArr=[];
        var nodeMember={}
        var innerWayArr=[];
        var outWayArr=[];
        entity.members.forEach(function(member){
            graph.parentWays(graph.entity(member.id)).forEach(function(way){
                if(!way.isOneRoadCrossWay())
                {
                    if(-1==wayArr.indexOf(way.id))
                    {
                        wayArr.push(way.id);
                    }
                }
            });
            nodeMember[member.id]=1;
        });
        wayArr.forEach(function(wayId){
            var way=graph.entity(wayId)
            if(nodeMember[way.nodes[0]]&&nodeMember[way.nodes[way.nodes.length-1]])
            {
                innerWayArr.push(wayId);

            }else{
                outWayArr.push(wayId);
            }
        });

        var crossMaatMap={};
        for(var i=0;i<outWayArr.length;i++)
        {
            for(var j=0;j<outWayArr.length;j++)
            {
                crossMaatMap[outWayArr[i]+"-"+entity.id+"-"+outWayArr[j]]=1;
            }
        }
        var crossSaatMap={};
        for(var i=0;i<wayArr.length;i++)
        {
            crossSaatMap[wayArr[i]+"-"+entity.id]=1;
        }
        graph.parentRelations(entity).forEach(function(rel){
            if(rel.modelName==iD.data.DataType.CROSSMAAT)
            {
                var fromMember = rel.memberByRole(iD.data.RoleType.FROAD_ID);
                var toMember = rel.memberByRole(iD.data.RoleType.TROAD_ID);
                var nodeMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);
                if(1==crossMaatMap[fromMember.id+"-"+nodeMember.id+"-"+toMember.id])
                {
                    crossMaatMap[fromMember.id+"-"+nodeMember.id+"-"+toMember.id]=0;
                }else{
                    crossMaatMap[fromMember.id+"-"+nodeMember.id+"-"+toMember.id]=2;
                }
            }else if(rel.modelName==iD.data.DataType.C_NODEINFO){
                var roadMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);       // 根据role为road获取对应的道路member成员
                var nodeMember = rel.memberByRole(iD.data.RoleType.ROAD_NODE_ID);       // 根据role为node获取对应的道路member成员
                if(1==crossSaatMap[roadMember.id+"-"+nodeMember.id])
                {
                    crossSaatMap[roadMember.id+"-"+nodeMember.id]=0;
                }else{
                    crossSaatMap[roadMember.id+"-"+nodeMember.id]=2;
                }
            }
        });
        var flag=true;
        for(var key in crossSaatMap)
        {
            if(1==crossSaatMap[key]||2==crossSaatMap[key])
            {
                flag=false;
            }
        }
        for(var key in crossMaatMap)
        {
            if(1==crossMaatMap[key]||2==crossMaatMap[key])
            {
                flag=false;
            }
        }
        if(!flag)
        {
            console.log("Check crossnode topo error")
            for(var key in crossSaatMap)
            {
                if(1==crossSaatMap[key]){
                    console.log("缺少 C_NODEINFO:"+key);
                }else if(2==crossSaatMap[key])
                {
                    console.log("多余 C_NODEINFO:"+key);
                }
            }
            for(var key in crossMaatMap)
            {
                if(1==crossMaatMap[key]){
                    console.log("缺少 crossmaat:"+key);
                }else if(2==crossMaatMap[key])
                {
                    console.log("多余 crossmaat:"+key);
                }
            }
        }
        return flag;
        */
    }

    var parentCrossNode=function(graph,entity)
    {
        var crossNode;
        graph.parentRelations(entity).forEach(function(rel){
            if(rel.modelName==iD.data.Constant.C_NODE)
            {
                crossNode=rel;
            }
        })
        return crossNode;
    }

    //检查通过返回真，
    handle.mainCheck=function(graph,entity,context)
    {
        //var errMsg = [];
        var str = undefined;
        var flag=true;
        if(entity instanceof iD.Node && entity.isWalkEnter())
        {
            var errMsg = walkEnterCheck(graph,entity,context);
            if(errMsg!=undefined){
                return errMsg;
            }
        }else if(entity instanceof iD.Node && entity.isRoadNode() )
        {
            if(!nodeCheck(graph,entity)){
                flag=false;
            }
            var crossNode=parentCrossNode(graph,entity);
            if(crossNode&&!RoadCrossCheck(context, crossNode))
            {
                flag=false;
            }
        }else if(entity instanceof iD.Node && entity.isRoadCross())
        {
            if(!RoadCrossCheck(context, entity))
            {
                flag=false;
            }
            /*
            let relation = context.graph().parentRelations(entity, iD.data.DataType.R_C_NODE_ROAD_NODE)[0];
            let members = [];
            if(relation){
            	members = relation.members.filter(function(m){
	            	return m.modelName == iD.data.DataType.ROAD_NODE;
	            });
            }
            members.forEach(function(member){
                if(!nodeCheck(graph,graph.entity(member.id))){
                    flag=false;
                }
            });
            */
        }else if(entity instanceof iD.Way && entity.modelName==iD.data.DataType.HIGHWAY)
        {
            if(!nodeCheck(graph,graph.entity(entity.nodes[0]))){
                flag=false;
            }
            if(!nodeCheck(graph,graph.entity(entity.nodes[entity.nodes.length-1]))){
                flag=false;
            }

            var crossNodeA=parentCrossNode(graph,graph.entity(entity.nodes[0]));
            if(crossNodeA&&!RoadCrossCheck(context, crossNodeA))
            {
                flag=false;
            }
            var crossNodeB=parentCrossNode(graph,graph.entity(entity.nodes[entity.nodes.length-1]));
            if(crossNodeA&&crossNodeB&&crossNodeA.id==crossNodeB.id)
            {

            }else if(crossNodeB){
                if(crossNodeB&&!RoadCrossCheck(context, crossNodeB))
                {
                    flag=false;
                }
            }
        }
        if(!flag&&displayFlag)
        {
            //Dialog.alert("Topo检查发现错误:"+entity.id+" datatype:"+entity.modelName);
            displayFlag=false;
        }
        if(!flag)
        {
            str = "Topo检查发现错误:"+entity.id+" datatype:"+entity.modelName;
            //errMsg.push(str);
            console.warn("Topo检查发现错误:"+entity.id+" datatype:"+entity.modelName);
        }
        //return flag;
        return str;
    }


    return handle;
}
