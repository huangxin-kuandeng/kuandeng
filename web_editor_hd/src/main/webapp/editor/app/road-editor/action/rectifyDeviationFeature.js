/**
 * 根据控制点要素纠偏
 * ---选择控制点和车道线方式
 * ---邹洋需求，只有使用定位中增加控制点后，点击车道线才会弹出该按钮
 * Created by Tilden on 2018/08/01.
 */
iD.actions.rectifyDeviationFeature = function (selectedIDs, context) {

    var dividers = [], points = [], pointLngLats = [];

    var action = function (graph) {

        // var offsetXYZ = action.getOffsetXYZ(pointLngLats);
        // graph = action.getNewFeature(graph, feature, offsetXYZ);
        graph = action.getNewFeature(graph, dividers, points, pointLngLats);
        return graph;
    };

    /*action.getNewFeature = function(graph, feature, offsetXYZ) {
     if (feature.length) {
     for (var i = 0; i < feature.length; i++) {
     if (feature[i].modelName == iD.data.DataType.DIVIDER || feature[i].modelName == iD.data.DataType.OBJECT_PG || feature[i].modelName == iD.data.DataType.OBJECT_PL) {
     var nodes = graph.childNodes(feature[i]);//获取线下所有点
     for (var j = 0; j < nodes.length; j++) {
     var n = nodes[j];
     var newoffsetX = offsetXYZ[0] - n.loc[0];
     var newoffsetY = offsetXYZ[1] - n.loc[1];
     var newoffsetZ = offsetXYZ[2] - n.loc[2];
     console.log('1===', newoffsetX, newoffsetY, newoffsetZ);
     graph=graph.replace(n.move([n.loc[0] + newoffsetX, n.loc[1] + newoffsetY, n.loc[2] + newoffsetZ]));
     }
     }
     }
     }
     return graph;
     };*/
    action.getNewFeature = function(graph, feature, point, pointLngLats) {
        var calculationQueue = [];
        for (var i = 0; i < feature.length; i++) {
            if (feature[i].modelName == iD.data.DataType.DIVIDER) {
                var nodes = graph.childNodes(feature[i]);//获取线下所有点
                for (var j = 0; j < nodes.length; j++) {
                    var n = nodes[j];
                    var sortObj = action.getCalculationPoint(n, point, pointLngLats);
                    if (sortObj) {
                        calculationQueue.push(sortObj);
                    }
                }
            }
        }
        var loc = null;
        for (var j = 0; j < calculationQueue.length; j++) {
            var n = calculationQueue[j].node;
            var p = calculationQueue[j].point;
            var newoffsetX = p.loc[0] - n.loc[0];
            var newoffsetY = p.loc[1] - n.loc[1];
            var newoffsetZ = p.loc[2] - n.loc[2];

            console.log('点：', n);
            console.log('偏移：', newoffsetX, newoffsetY, newoffsetZ);

            if(loc) {
                loc[0] += newoffsetX;
                loc[1] += newoffsetY;
                loc[2] += newoffsetZ;
            } else {
                loc = [newoffsetX, newoffsetY, newoffsetZ];
            }
            // n.loc = ;
            // newEntity.push(n);
            // graph = graph.replace(n)
            // iD.actions.moveNode()
            // graph = graph.replace(n.update({loc:[n.loc[0] + newoffsetX, n.loc[0] + newoffsetY, n.loc[0] + newoffsetZ]}));


            // console.log('first:',n.loc)
            // console.log('secend:',newoffsetX, newoffsetY, newoffsetZ)
            // graph=graph.replace(n.move([n.loc[0] + newoffsetX, n.loc[1] + newoffsetY, n.loc[2] + newoffsetZ]));
            // console.log('33----:',[n.loc[0] + newoffsetX, n.loc[1] + newoffsetY, n.loc[2] + newoffsetZ])
        }
        loc[0] = loc[0] / calculationQueue.length;
        loc[1] = loc[1] / calculationQueue.length;
        loc[2] = loc[2] / calculationQueue.length;

        for (var j = 0; j < calculationQueue.length; j++) {
            var n = calculationQueue[j].node;

            graph=graph.replace(n.move([n.loc[0] + loc[0], n.loc[1] + loc[1], n.loc[2] + loc[2]]));
        }
        return graph;
    }

    action.getCalculationPoint = function(node, point, pointLngLats) {
        var sortObj = iD.util.distanceByLngLats(node.loc, pointLngLats);
        console.log('距离：', sortObj.dis);
        console.log('node:', node);
        /*if (sortObj.dis > 1) {
            return null;
        }*/
        return {
            node: node,
            point: point[sortObj.index]
        }
    }


    action.disabled = function (graph) {
        var entity,
            disabled = true,
            i = 0, len = selectedIDs.length;
        points = [];
        dividers = [];
        pointLngLats = [];
        // if (len > 0) {

            var allEntitys = context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]));

            for (var j = 0; j < allEntitys.length; j++) {
                if (allEntitys[j]._type == "SearchPoint") {
                    points.push(allEntitys[j]);
                    pointLngLats.push(allEntitys[j].loc);
                }
            }

            for (; i < len; i++) {
                entity = context.entity(selectedIDs[i]);
                if (entity.modelName == iD.data.DataType.DIVIDER) {
                    dividers.push(entity);
                }
            }

            if (points.length != 0 && dividers.length != 0) {
                disabled = false;
            }
            /*var firstFeature = null;
             for (; i < len; i++) {
             entity = context.entity(selectedIDs[i]);
             // layer = entity.layerInfo();
             if (entity.modelName === iD.data.DataType.DIVIDER/!* || entity.modelName == iD.data.DataType.FUSION_DIVIDER_NODE*!/) {
             if (!firstFeature) {
             firstFeature = entity;
             } else if (firstWay.id != way.id) {
             let index = way.nodes.indexOf(entity.id);
             if (index == 0 || index == way.nodes.length - 1) {
             disabled = false;
             } else {
             return 'not_node';
             }
             } else {
             return 'not_node';
             }
             }else {
             return 'not_feature';
             }
             }*/
        // }
        if(disabled){
            return 'not_eligible';
        }
    };
    return action;
}

