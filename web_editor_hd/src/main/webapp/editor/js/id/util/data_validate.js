/**
 * Created by  on 2015/10/18.
 * 传入传出的数据实体和拓补关系验证
 */
iD.util.dataValidate = {

    //传入所有的数据实体，context，输出所有的错误信息数组
    checkNodeAndWayValidate: function (all, context) {

        //对所有的数据进行分组，包括道路首尾结点数组,综合交叉点数组
        var roadNodeArr = [], roadCrossArr = [], fakeNodeArr = [], wayArr = [];
        var walkEnterArr = [];
        var errMsg = [];
        var nodeSet = {};     //道路上的结点数组

        for (var i = 0; i < all.length; i++) {
            if (all[i] instanceof iD.Node) {
                if (all[i].isRoadNode()) {
                    roadNodeArr.push(all[i]);
                    nodeSet[all[i].id] = 1;
                }else if(all[i].isWalkEnter()&&iD.util.justNodeInPlyGonx(all[i], context)){
                    walkEnterArr.push(all[i]);
                }
                if (all[i].isRoadCross() && iD.util.justNodeInPlyGonx(all[i], context)) roadCrossArr.push(all[i]);
                if (all[i].modelName == iD.data.DataType.HIGHWAY) {
                    fakeNodeArr.push(all[i]);
                    nodeSet[all[i].id] = 1;
                }
            } else if (all[i] instanceof iD.Way && all[i].modelName == iD.data.DataType.HIGHWAY) {
                var flag = false;
                if(all[i].nodes.length<2){
                    var str = "返回数据在道路" + all[i].id + "上结点数小于2个";
                    errMsg.push(str);
                    break;
                }
                //道路上的结点实体没有加载完全，报错
                for (var j = 0; j < all[i].nodes.length; j++) {
                    if (!context.hasEntity(all[i].nodes[j])) {
                        var str = "返回数据在道路" + all[i].id + "上缺少节点:" + all[i].nodes[j];
                        errMsg.push(str);
                        flag = true;
                        break;
                    }
                }
                if(flag) break;
                var fNode = context.entity(all[i].first());
                var tNode = context.entity(all[i].last());

                if(!flag&&fNode.modelName!=iD.data.DataType.ROAD_NODE){
                    var str = "返回数据在道路" + all[i].id + "首结点类型错误";
                    errMsg.push(str);
                    break;
                }
                if(!flag&&tNode.modelName!=iD.data.DataType.ROAD_NODE){
                    var str = "返回数据在道路" + all[i].id + "尾结点类型错误";
                    errMsg.push(str);
                    break;
                }
                if (!flag && (iD.util.justNodeInPlyGonx(context.graph().entity(all[i].first()),context)||iD.util.justNodeInPlyGonx(context.graph().entity(all[i].first()),context)))wayArr.push(all[i]);
            }else if (all[i] instanceof iD.Way && all[i].modelName == iD.data.DataType.WALKLINK) {
                var flag = false;
                if(all[i].nodes.length<2){
                    var str = "返回数据在步导线" + all[i].id + "上结点数小于2个";
                    errMsg.push(str);
                    break;
                }
                //道路上的结点实体没有加载完全，报错
                for (var j = 0; j < all[i].nodes.length; j++) {
                    if (!context.hasEntity(all[i].nodes[j])) {
                        var str = "返回数据在步导线" + all[i].id + "上缺少节点:" + all[i].nodes[j];
                        errMsg.push(str);
                        flag = true;
                        break;
                    }
                }
                if(flag) break;
                var fNode = context.entity(all[i].first());
                var tNode = context.entity(all[i].last());

                if(!flag&&fNode.modelName!=iD.data.DataType.WALKENTER){
                    var str = "返回数据在步导线" + all[i].id + "首结点类型错误";
                    errMsg.push(str);
                    break;
                }
                if(!flag&&tNode.modelName!=iD.data.DataType.WALKENTER){
                    var str = "返回数据在步导线" + all[i].id + "尾结点类型错误";
                    errMsg.push(str);
                    break;
                }
                if (!flag && (iD.util.justNodeInPlyGonx(context.graph().entity(all[i].first()),context)||iD.util.justNodeInPlyGonx(context.graph().entity(all[i].last()),context)))wayArr.push(all[i]);
            }
        }

        return {errMsg: errMsg, roadNodeArr: roadNodeArr, roadCrossArr: roadCrossArr, wayArr: wayArr,walkEnterArr:walkEnterArr};

    },


    //传入道路实体和综合交叉点，步导点，context，输出所有的拓补错误信息数组
    checkCrossAndWayValidate: function (wayArr, roadCrossArr, walkEnterArr,context) {

        //拓扑关系的检查
        //roadNodeArr.forEach(function (entity) {
        //    var str = iD.topo.check().mainCheck(context.graph(), entity);
        //    if(str!=undefined)errMsg.push();
        //})
        var errMsg = [];

        wayArr.forEach(function (entity) {
            var str = iD.topo.check().mainCheck(context.graph(), entity, context);
            if (str != undefined)errMsg.push(str);
        })
        roadCrossArr.forEach(function (entity) {
            var str = iD.topo.check().mainCheck(context.graph(), entity, context);
            if (str != undefined)errMsg.push(str);
        })

        walkEnterArr.forEach(function (entity) {
            var str = iD.topo.check().mainCheck(context.graph(), entity, context);
            if (str != undefined)errMsg.push(str);
        })
        return errMsg;
    }


}