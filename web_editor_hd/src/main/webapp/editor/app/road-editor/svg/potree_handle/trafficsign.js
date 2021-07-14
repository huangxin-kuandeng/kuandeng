iD.PotreeHandle = iD.PotreeHandle || {};
;(function(exp){
    let handle = exp[iD.data.DataType.TRAFFICSIGN] = {
        context: null,
        potree: null,
        viewer: null
    };
    handle.init = function(context, potree) {
        this.context = context;
        this.potree = potree;
        this.viewer = potree.viewer;
    }
    // 记录坐标
    let dragData = {
        prevPosition: null,
        nextPosition: null,
        firstPosition: null,
        wayId: null
    };

    function resetDragData(){
        dragData.prevPosition = null;
        dragData.nextPosition = null;
        dragData.firstPosition = null;
        dragData.wayId = null;
    }

    function resetNodeLoc(context, dragObject){
        let measure = dragObject.parent;
        let entity = context.hasEntity(dragObject.name);
        let dragIndex = measure.spheres.indexOf(dragObject);
        // let pos = target.position.toArray();
        // dragObject.position.set(...pos);
        measure.points[dragIndex].position.set(...toScene.forward(entity.loc));
        measure._render = true;
    }

    // 节点拖拽是否走通用逻辑
    // null-要素不匹配，忽略，false=阻止
    handle.getNodeCanDropped = function(data){
        let entity = this.getGroundAreaEntity(data);
        if(!entity) return ;
        return false;
    }
    handle.onDragStart = function(data){
        let entity = this.getGroundAreaEntity(data);
        if(!entity) return ;
        this.context.perform(iD.actions.Noop(), '拖拽节点');
        resetDragData();
    }
    handle.onDrag = function(data){
        let entity = this.getGroundAreaEntity(data);
        if(!entity) return ;
        let context = this.context;

        if (!iD.Layers.getLayerById(entity.layerId).editable) {
            resetNodeLoc(context, data.drag.object);
            return;
        }

        let dragObject = data.drag.object;
        let measure = dragObject.parent;
        let points = measure.points;
        let nowIndex = measure.spheres.indexOf(dragObject);
        let nowPoint = points[nowIndex];
        
        var crossIndex = _nodesIndex(nowIndex, 2);
        var crossPoint = points[crossIndex];//对角位置
        var prevIndex = _nodesIndex(nowIndex, -1);
        var prevPoint = points[prevIndex];//上一个点
        var nextIndex = _nodesIndex(nowIndex, 1);
        var nextPoint = points[nextIndex];//下一个点

        if(dragData.firstPosition == null){
            dragData.firstPosition = points[0].position.clone();
        }
        if(dragData.prevPosition == null){
            dragData.prevPosition = points[prevIndex].position.clone();
        }
        if(dragData.nextPosition == null){
            dragData.nextPosition = points[nextIndex].position.clone();
        }
        let nowPos = nowPoint.position;
        let crossPos = crossPoint.position;
        let prevPos = dragData.prevPosition;
        let nextPos = dragData.nextPosition;

        //计算法向量
        // let v1 = new THREE.Vector3(
        //     nowPos.x - prevPos.x,
        //     nowPos.y - prevPos.y,
        //     nowPos.z - prevPos.z
        // );
        // let v2 = new THREE.Vector3(
        //     nowPos.x - nextPos.x,
        //     nowPos.y - nextPos.y,
        //     nowPos.z - nextPos.z
        // );
        // var a = aa(v1, v2, nowPos);
        // var R = a.R;
        // var RT = R.clone();
        // var D = a.D;
        // nowPos = nowPos.applyMatrix3(RT);
        // crossPos = crossPos.applyMatrix3(RT);
        // prevPos = prevPos.applyMatrix3(RT);
        // nextPos = nextPos.applyMatrix3(RT);

        let prevLoc = [], nextLoc = [], nowLoc = [];
        // iD.util.pedal([crossPos.x, crossPos.y, prevPos.x, prevPos.y], [nowPos.x, nowPos.y], prevLoc);
        prevLoc = iD.util.pedal3D(nowPos,crossPos, prevPos);
        nextLoc = iD.util.pedal3D(nowPos,crossPos, nextPos);
        // iD.util.pedal([crossPos.x, crossPos.y, nextPos.x, nextPos.y], [nowPos.x, nowPos.y], nextLoc);

        // let invertMatrix = R.getInverse(R);
        // var IM = invertMatrix.clone();
        // var t = new THREE.Vector3(prevLoc[0], prevLoc[1], -D);
        // var v = t.applyMatrix3(IM);
        // prevLoc = [v.x, v.y];

        // var t1 = new THREE.Vector3(nextLoc[0], nextLoc[1], -D);
        // var v_1 = t1.applyMatrix3(IM);
        // nextLoc = [v_1.x, v_1.y];
        // 更新激光位置
        prevPoint.position.set(...[
            prevLoc[0],
            prevLoc[1],
            prevLoc[2]
        ]);
        nextPoint.position.set(...[
            nextLoc[0],
            nextLoc[1],
            nextLoc[2]
        ]);
        let oldFirstPos = dragData.firstPosition;
        let firstPos = measure.points[0].position;
        if(!firstPos.equals(oldFirstPos)){
            let lastPos = measure.points[measure.points.length - 1].position;
            lastPos.set(firstPos.x, firstPos.y, firstPos.z);
        }
        measure._render = true;

        // 更新地图位置
        let actions = [];
        nowLoc = toMap.forward([nowPos.x, nowPos.y, nowPos.z]);
        prevLoc = toMap.forward([
            prevPoint.position.x,
            prevPoint.position.y,
            prevPoint.position.z
        ]);
        nextLoc = toMap.forward([
            nextPoint.position.x,
            nextPoint.position.y,
            nextPoint.position.z
        ]);

        actions.push( iD.actions.MoveNode(entity.nodes[prevIndex], prevLoc) );
        actions.push( iD.actions.MoveNode(entity.nodes[nowIndex], nowLoc) );
        actions.push( iD.actions.MoveNode(entity.nodes[nextIndex], nextLoc) );
        actions.push('更改路牌');

        context.replace(...actions);
    }
    handle.onDragEnd = function(data){
        let entity = this.getGroundAreaEntity(data);
        let context = this.context;
        if(!entity) return ;
        resetDragData();
        

        if(!context.transactionEditor() && way.isArea && way.isArea() && way.nodes[0] == entity.id){
            // 面类型第一个点不能超出范围
            if(iD.util.pointNotInPlyGonx(newLoc, context)){
                context.pop();
                Dialog.alert("您移动的元素不属于该任务范围内");
                return ;
            }
        }

        context.event.entityedite({
            entities: [entity.id]
        });
    }
    
    function _nodesIndex(index, diff){
        var diffend = index + diff;
        if(diffend>=0){
            return diffend%4
        }else {
            return 4 + index + diff;
        }
    }

    handle.getGroundAreaEntity = function(data){
        let dragObject = data.drag.object;
        if(!dragObject || !dragObject.parent || !dragObject.parent.name) return ;
        let entityid = dragObject.parent.name;

        var entity = this.context.hasEntity(dragObject.parent.name);
        if (!entity) { 
            return false;
        }

        if (entity.modelName != iD.data.DataType.TRAFFICSIGN) {
            return false;
        }
        // 是否是地面区域
        // if(!iD.picUtil.checkNodeIsGroundArea(entityid)){
        //     return ;
        // }
        return this.context.entity(entityid);
    }

    handle.createObjectPG = function(drawTempNodeArr){
        var nodeLocList = [];
        for (let i = 0; i < drawTempNodeArr.length; i++) {
            let v = drawTempNodeArr[i];
            let pos = toScene.forward([v.loc[0], v.loc[1]]);
            nodeLocList.push([pos[0], pos[1], v.loc[2]]);
        }

        var newLocList = iD.util.getRotaingCalipersRectLocs(nodeLocList).map(function(d){
            return [d.x, d.y, d.z];
        });
        // console.log(newLocList);
        // polygon = newLocList;
        let locs = [];
        for(let i=0; i<newLocList.length;i++){
            let loc = toMap.forward(newLocList[i]);
            locs.push(loc);
        }
        console.log(locs)
        this.drawObjectPG(locs);
    }
    //绘制面对象信息
    handle.drawObjectPG = function(polygon) {
        let context = this.context;
        var nodes = [], entityIds = [];
        var NODE_MODEL_NAME = iD.data.DataType.OBJECT_PG_NODE;
        var WAY_MODEL_NAME = iD.data.DataType.OBJECT_PG;
        
        var layer = iD.Layers.getCurrentModelEnableLayer(NODE_MODEL_NAME);
        var pgLayer = iD.Layers.getCurrentModelEnableLayer(WAY_MODEL_NAME);
        if (!layer && !pgLayer) return;
        var actions = [];
        for (var l = 0; l < polygon.length; l++) {
            var lnglat = polygon[l];
            // var lnglat = toMap.forward(loc);

            nodes.push(iD.Node({
                layerId: layer.id,
                identifier:layer.identifier,
                modelName: NODE_MODEL_NAME,
                loc: lnglat,
                tags: iD.util.getDefauteTags(NODE_MODEL_NAME, layer),
            }));
            actions.push(...[
                iD.actions.AddEntity(nodes[nodes.length - 1])
            ]);
        }

        var rect = iD.Way({
            layerId: pgLayer.id,
            identifier:pgLayer.identifier,
            modelName: WAY_MODEL_NAME,
            nodes: _.map(nodes, 'id').concat(nodes[0].id),
            tags: iD.util.getDefauteTags(WAY_MODEL_NAME, pgLayer)
        });
        entityIds.push(rect.id);
        rect.tags.TYPE = "3";
        rect.tags.SUBTYPE = "2";
        actions.push(...[
            iD.actions.AddEntity(rect)
        ]);
        actions.push('绘制面对象信息');
        //点云视频界面新增路牌埋点
        // iD.picPlayerLogger.potreeHandle({
        //     'tag': 'add_objectPG_end',
        //     'modelName': rect.modelName,
        //     'entityId': rect.osmId() || '',
        //     'key': 'click',
        //     'linkage_type': _pic._linkage_pcloud
        // })
        context.perform.apply(this, actions);
        context.enter(iD.modes.Browse(context));
        context.event.entityedite({
            entitys: entityIds
        });
    }

})(iD.PotreeHandle);
