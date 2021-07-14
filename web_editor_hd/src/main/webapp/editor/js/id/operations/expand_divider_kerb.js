/**
 * 根据车道线生成路缘石
 */
iD.operations.ExpandDividerKerb = function(selectedIDs, context) {
    var layer;
    var roadExpandTip = iD.ui.DividerKerbExpandTip(context, {
        distance: 0.5,
        leftDistance: 0.0,
        step: 0.1,
        heightDiff: 0.2,
        heightStep: 0.05
    });
    //用来存储原始道路左右两边分别需要扩路的长度（单位米）
    var userInputParam = {
        'left': '',
        'right': '',
        'originalRoadTag': ''
    };
    var isFirstConfirm = true;
    var action = iD.actions.ExpandRoad(selectedIDs, context.projection, context)
        .setModelName(iD.data.DataType.OBJECT_PL, iD.data.DataType.OBJECT_PL_NODE);
    var annotation;
    var selectEntity;
    var operation = function() {
        showSubPlayer();
        annotation = t('operations.expand.offset-kerb');
        isFirstConfirm = true;
        //弹出框：用户输入左右两边需要扩展的长度
        roadExpandTip.perform(context.container(), expandRoad);

        roadExpandTip.on('close.expand_kerb', function(){
            closeSubPlayer();
        });
    };

    function getAngleNodes(allNodes, idx){
        if(allNodes.length < 2){
            return ;
        }
        var result;
        var node = allNodes[idx];
        if(idx == 0){
            result = [
                node,
                allNodes[idx + 1]
            ];
        }else if(idx == allNodes.length - 1){
            result = [
                allNodes[idx - 1],
                node
            ];
        }else {
            result = [
                allNodes[idx - 1],
                allNodes[idx + 1]
            ];
        }

        return result;
    }

    function showSubPlayer(){
        var player = iD.picUtil.player;
        if(!player) return ;
        var lineCal = iD.util.LineCalCulate();
        // 同方向最近轨迹
        var angleDiff = 5;
        var range = 15;
        var nowNode = player.pic_point;
        var nowAngle;
        var rangeTracks = iD.util.selectNode_Z(nowNode.loc, range);
        if(rangeTracks.length){
            let nd = getAngleNodes(player.allNodes, player.selectPicIndex);
            nowAngle = lineCal.getAngle(
                nd[0].loc[0], nd[0].loc[1],
                nd[1].loc[0], nd[1].loc[1]
            );
        }
        var minTrackId;
        var minNode;
        var minDis = Infinity;
        rangeTracks.forEach(function(d){
            let nodes = d.nodes;
            let angleNodes;
            let dist;
            if(d.trackId == player.wayInfo.trackId){
                return ;
            }

            if(nodes.length <= 2){
                let line = _.pluck(nodes,'loc');
                dist = iD.util.pt2LineDist2(line, nowNode.loc);
                if(dist.i == -1){
                    return ;
                }
                angleNodes = nodes;
            } else {
                let line = _.pluck(nodes,'loc');
                dist = iD.util.pt2LineDist2(line, nowNode.loc);
                if(dist.i == -1){
                    return ;
                }
                angleNodes = getAngleNodes(nodes, dist.i);
            }
            if(!angleNodes || angleNodes.length < 2) return ;

            let angle = lineCal.getAngle(
                angleNodes[0].loc[0], angleNodes[0].loc[1], 
                angleNodes[1].loc[0], angleNodes[1].loc[1]
            );
            // console.log(d.trackId, nowAngle, angle, '角度差：' + Math.abs(angle - nowAngle));
            if(!angleInDiff(nowAngle, angle, angleDiff)){
                return ;
            }
            if(dist.dis < minDis){
                minTrackId = d.trackId;
                minNode = nodes[dist.i];
                minDis = dist.dis;
            }
        });

        // 360的情况，355° 5° 相差10
        function angleInDiff(pangle, wangle, diffAngle){
            pangle = pangle % 360;
            wangle = wangle % 360;
            if (Math.abs(pangle - wangle) <= diffAngle || Math.abs(pangle - wangle) >= (360 - diffAngle)){
                return true;
            }
            return false;
        }

        var minTrack = minTrackId && player.dataMgr.getTrack(minTrackId);
        if(!minTrack){
            Dialog.alert(range + '米范围内没有同方向轨迹');
            return ;
        }

        iD.svg.PicSubPlayer.show(minTrack, minTrack.nodes.indexOf(minNode));
    }

    function closeSubPlayer(){
        iD.svg.PicSubPlayer.close();
    }

    //执行道路扩展算法
    var expandRoad = function(userInputParam) {
        action.setUserInputParam(userInputParam);
        // setAngleBaseLine();
        // if (!userInputParam.originalRoadTag) {
        //     context.enter(iD.modes.Browse(context));
        // }
        var oldAnnotation = context.history().undoAnnotation();
        if(!isFirstConfirm && oldAnnotation == annotation){
            context.undo()
        }
        context.perform(action, function(graph){
            var actionResult = action.getResult();
            if(!actionResult || !actionResult.all.length) return graph;
            let way = actionResult.all[0];
            // 路缘石
            graph = iD.actions.ChangeTags(way.id, {
                TYPE: 1,
                SUBTYPE: 1
            })(graph);
            return graph;
        }, annotation);

        context.event.entityedite({
            entitys: []
        });

        if(isFirstConfirm){
            isFirstConfirm = false;
        }
    };

    operation.available = function() {
        if (selectedIDs.length != 1) return false;
        var entity = context.entity(selectedIDs[0]);
        if (entity.modelName != iD.data.DataType.DIVIDER) {
            return false;
        }
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        if (!modelConfig || !modelConfig.editable) return false;

        let relation = iD.util.getDividerParentRelation(context.graph(), entity, iD.data.DataType.DIVIDER_ATTRIBUTE);
        if(!relation) return false;
        // 行车道边缘线，生成路缘石
        if(relation.tags.TYPE != '1') return false;

        layer = iD.Layers.getLayer(entity.layerId);
        selectEntity = entity;

        return !operation.disabled();
    };
    operation.disabled = function() {
        return false;
    };
    operation.tooltip = function() {
        return t('operations.expand.title-offset-kerb');
    };

    operation.id = 'expand';
    operation.keys = [iD.ui.cmd('K')];
    operation.title =t('operations.expand.title-offset-kerb');

    return operation;
}