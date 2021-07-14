iD.ui.TagEditor.autocheck =iD.ui.TagEditor.autocheck||{};


//赋值不能为空的属性检查
iD.ui.TagEditor.autocheck.road = function(context,changes){

    function checkRoadValid(tags) {
         var isNull = function(k){
             var r = true;
             if(typeof tags[k] != 'undefined'
                 && tags[k] != ""){
                 r = false;
             }
             return r;
         }

        var arr = [] ;
         if(isNull('road_class')){
             arr.push("道路等级");
            }
        if(isNull('fc')){
            arr.push("功能等级");
        }
        return arr ;
    }

    function checkPlaceNameValid(tags) {
        var isNull = function(k){
            var r = true;
            if(typeof tags[k] != 'undefined'
                && tags[k] != ""){
                r = false;
            }
            return r;
        }

        var arr = [] ;
        if(isNull('name_chn')){
            arr.push("地名信息名称");
        }
        return arr ;
    }

    //跨图幅边框点不能是真实节点     返回1代表是真实结点，返回-1代表是孤立结点，返回0代表的是伪结点
    function checkRealNodeValid(tags) {
        if(modelName == iD.data.DataType.ROADNODE && tags.boundary == "20"&& tags.realnode=="1"){
            return 1;
        }else if(modelName == iD.data.DataType.ROADNODE && tags.boundary == "20"&& tags.realnode=="-1"){
            return -1;
        }
        return 0;
    }

    //判断图幅边框点外接3米之内是不是图幅边框线，,在则返回真
    function checkRealNodeInThreeMeters(entity) {
        if(entity.tags.boundary&&entity.tags.boundary=="0"){
            var loc = entity.loc, threeMeters = 0.000028;
            var loc1 = [loc[0]-threeMeters,loc[1]-threeMeters];   //左下角
            var loc2 = [loc[0]+threeMeters,loc[1]+threeMeters];   //右上角
            var bbox = [loc1,loc2];
            var all = context.intersects(bbox);
            var distance = 3;
            for(var i=0;i<all.length;i++){
                if(all[i] instanceof iD.Way&&all[i].modelName == iD.data.DataType.BND&&all[i].nodes.length==2){
                    if(distance>iD.util.slopExtend.getDisBetPointAndWay(entity,all[i],context.graph())){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function checkWalkEnterValid(context,entity){
        var parentWays = context.graph().parentWays(entity);
        if(entity.tags.boundary == "20"&&parentWays.length!=2){
            return true;
        }
        return false;
    }

    //判断步导点如果为非图幅边框点，是不是在边框1米的范围之内,在则返回真
    function checkWorkEnterInOneMeters(entity) {
        if(entity.tags.boundary&&entity.tags.boundary=="0"){
            var loc = entity.loc, oneMeters = 0.00001;
            var loc1 = [loc[0]-oneMeters,loc[1]-oneMeters];   //左下角
            var loc2 = [loc[0]+oneMeters,loc[1]+oneMeters];   //右上角
            var bbox = [loc1,loc2];
            var all = context.intersects(bbox);
            var distance = 1;
            for(var i=0;i<all.length;i++){
                if(all[i] instanceof iD.Way&&all[i].modelName == iD.data.DataType.BND&&all[i].nodes.length==2){
                    if(distance>iD.util.slopExtend.getDisBetPointAndWay(entity,all[i],context.graph())){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //检查增量道路的长度小于3米的时候进行判断
    function checkRoadLength(entity){
        if(parseFloat(entity.tags.length)<3){
            return true;
        }
        return false ;
    }

    for(var i = changes.created.length-1;i>=0;i--){
        var  _entity = changes.created[i]
        if(_entity instanceof iD.Way
            &&typeof _entity.tags != 'undefined'
            &&typeof _entity.modelName != 'undefined'
            &&_entity.modelName == 'Highway'
            // &&typeof _entity.tags.isnewway != 'undefined'
            /*&&_entity.tags.isnewway == 'true'*/){
            var arr = checkRoadValid(_entity.tags) ;
            if (arr.length>0){
                //Dialog.alert("道路(" + _entity.id + ")存在赋值不能为空的属性, 不能保存!");
                Dialog.alert("道路(" + _entity.id + ")的属性(" + arr.join(",")+")为空, 不能保存!");
                context.enter(iD.modes.Select(context, [_entity.id])
                                    .suppressMenu(true));

                return false ;
            }
        }else if(_entity instanceof iD.Node
            &&typeof _entity.tags != 'undefined'
            &&typeof _entity.modelName != 'undefined'
            &&_entity.modelName == 'PlaceName'
        ){
            // var arr = checkPlaceNameValid(_entity.tags) ;
            // if (arr.length>0){
            //     Dialog.alert("地名信息(" + _entity.id + ")的名称属性为空, 不能保存!");
            //     context.enter(iD.modes.Select(context, [_entity.id])
            //         .suppressMenu(true));
            //     return false ;
            // }
        }
    }

    var created = [].concat(changes['created']), modified = [].concat(changes['modified']), deleted = [].concat(changes['deleted']);
    var wanted = created.concat(modified);
    for(var i = wanted.length-1;i>=0;i--){
        var  _entity = wanted[i];
        if(_entity instanceof iD.Node&&_entity.modelName == 'RoadNode'){
            var flag = checkRealNodeValid(_entity.tags) ;
            if (flag == 1){
                Dialog.alert("跨图幅边框点(" + _entity.id + ")不能是真实节点, 不能保存!");
                context.enter(iD.modes.Select(context, [_entity.id])
                    .suppressMenu(true));
                return false ;
            }else if (flag == -1){
                Dialog.alert("跨图幅边框点(" + _entity.id + ")不能是悬挂结点, 不能保存!");
                context.enter(iD.modes.Select(context, [_entity.id])
                    .suppressMenu(true));
                return false ;
            }

            var isInThreeMeter = checkRealNodeInThreeMeters(_entity);
            if(isInThreeMeter){
                Dialog.alert("非边框节点(" + _entity.id + ")在图幅边框线3米之内, 不能保存!");
                context.enter(iD.modes.Select(context, [_entity.id])
                    .suppressMenu(true));
                return false ;
            }

        }else if(_entity instanceof iD.Node&&_entity.modelName == iD.data.DataType.WALKENTER){
            var flag = checkWalkEnterValid(context,_entity) ;
            if (flag){
                Dialog.alert("存在边框点" + _entity.id + "不是二阶步导点");
                context.enter(iD.modes.Select(context, [_entity.id])
                    .suppressMenu(true));
                return false ;
            }

            var isInOneMeter = checkWorkEnterInOneMeters(_entity);
            if(isInOneMeter){
                Dialog.alert("步导节点(" + _entity.id + ")距离图幅边框太近");
                context.enter(iD.modes.Select(context, [_entity.id])
                    .suppressMenu(true));
                return false ;
            }

        }else if(_entity instanceof iD.Way&&_entity.modelName == 'Highway'){
            var flag = checkRoadLength(_entity) ;
            if (flag){
                Dialog.alert("道路(" + _entity.id + ")长度小于3米, 不能保存!");
                context.enter(iD.modes.Select(context, [_entity.id])
                    .suppressMenu(true));
                return false ;
            }
        }
    }

    return true ;
}
