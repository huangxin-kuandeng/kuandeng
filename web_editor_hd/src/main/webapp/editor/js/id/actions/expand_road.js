/**
 * Created by wt on 2015/7/30.
 */
iD.actions.ExpandRoad = function (wayIds, projection, context) {
    var lineCal = iD.util.LineCalCulate();
    var userInputParam = {
        'left': '',
        'right': '',
        'originalRoadTag': ''
    };
    // 作为旋转方向的标准
    var angleBaseLine;
    // 自定义使用的modelName
    var NODE_MODEL_NAME;
    var WAY_MODEL_NAME;
    // 是否在graph中添加产生的要素
    var GRAPH_REPLACE = true;

    var actionResult = {
        left: [],
        right: [],
        all: [],
        nodes: {}
    };

    var newWays = [];
    var originalWayIds = [];
    //分别绘制扩展后的左右两边道路
    var action = function (graph) {
        newWays = [];
        originalWayIds = [];
        actionResult = {
            left: [],
            right: [],
            all: [],
            nodes: {}
        };
        var oldLen = 0;
        wayIds.forEach(function (wayId) {
            originalWayIds.push(wayId);
            var survivor = graph.entity(wayId),
                // rawNodes = [],
                newNodes = [],
                newWay
            //当扩路长度<=0时，不进行扩路
            if (userInputParam.left && Number(userInputParam.left) > 0) {
                // var obj = newroad("left", survivor, newNodes, newWay);
                var obj = newRoad1(graph, survivor, "left");
                if (!GRAPH_REPLACE && obj && obj.nodes.length) {
                    actionResult.nodes[obj.way.id] = obj.nodes;
                }
            }
        });
        if (newWays.length) {
            oldLen = newWays.length
            actionResult.left.push(...newWays);
        }
        wayIds.forEach(function (wayId) {
            var survivor = graph.entity(wayId),
                // rawNodes = [],
                newNodes = [],
                newWay;
            //当扩路长度<=0时，不进行扩路
            if (userInputParam.right && Number(userInputParam.right) > 0) {
                // var obj = newroad("right", survivor, newNodes, newWay);
                var obj = newRoad1(graph, survivor, "right");
                if (!GRAPH_REPLACE && obj && obj.nodes.length) {
                    actionResult.nodes[obj.way.id] = obj.nodes;
                }
            }
        });
        // if (!isNaN(userInputParam.heightDiff) && newWays.length == 0) {
        //     wayIds.forEach(function (wayId) {
        //         originalWayIds.push(wayId);
        //         var survivor = graph.entity(wayId),
        //             newNodes = [],
        //             newWay
        //         //只有高度时，也扩路
        //         var obj = newroad("height", survivor, newNodes, newWay);
        //         if (!GRAPH_REPLACE && obj && obj.nodes.length) {
        //             actionResult.nodes[obj.way.id] = obj.nodes;
        //         }
        //     });
        // }
        if ((newWays.length && oldLen == 0) || newWays.length > oldLen) {
            actionResult.right.push(...newWays.slice(oldLen));
        }
        if (newWays.length) {
            actionResult.all.push(...newWays);
        }

        //判断是否删除原有道路
        if (userInputParam.originalRoadTag == false) {
            for (var i = 0; i < originalWayIds.length; i++) {
                graph = iD.actions.DeleteWay(originalWayIds[i])(graph);
            }

        }

        // var handle = iD.measureinfo.handle();
        //维护扩路产生的两条新增道路的topo关系
        GRAPH_REPLACE && newWays.forEach(function (way) {
            if (way.modelName == iD.data.DataType.ROAD) {
                graph = iD.actions.AddRoad(way.id)(graph);
            }
            /* 
            if(way.modelName == iD.data.DataType.DIVIDER){
                // 扩路后的第一个点添加测量信息；
                let firstNode = graph.entity(way.nodes[0]);
                let relation = graph.parentRelations(firstNode, iD.data.DataType.MEASUREINFO)[0];
                graph = handle[relation ? 'updateEntity' : 'addEntity'](graph, firstNode, {
                    type: 5,
//                  method:7,
                    lineType: 'divider'
                });
            }else if(way.modelName == iD.data.DataType.OBJECT_PG){
                // 扩路后的第一个点添加测量信息；
                let firstNode = graph.entity(way.nodes[0]);
                let relation = graph.parentRelations(firstNode, iD.data.DataType.MEASUREINFO)[0];
                graph = handle[relation ? 'updateEntity' : 'addEntity'](graph, firstNode, {
                    type: 5,
//                  method:7,
                    lineType: 'polygon'
                });
            }
             */
            else {
                // 补充量测信息
                way.nodes.forEach(function (nid) {
                    graph = iD.actions.createDividerNodeMeasureinfo(nid, way.nodes)(graph);
                });
            }
        })
        //graph = iD.actions.AddRoad(newWays[1])(graph);


        return graph;

        function getNewLayerInfo(entity, newModelName) {
            var def = {
                modelName: entity.modelName,
                layerId: entity.layerId
            };
            if (!newModelName || entity.modelName == newModelName) {
                let _layer = iD.Layers.getLayer(entity.layerId);
                def = _layer;
                return _layer;
            }
            let layer = iD.Layers.getLayersByModelName(newModelName)[0];
            if (!layer) return def;
            // def.modelName = newModelName;
            // def.layerId = layer.id;
            return layer;
        }

        function newRoad1(graph, survivor, position) {
            var distance;
            var isArea = false;
            if (position == "left") {
                distance = 3.0;
                if (userInputParam.left != "") {
                    distance = parseFloat(userInputParam.left);
                }
            } else { //if (position == "right") {
                distance = -3.0;
                if (userInputParam.right != "") {
                    distance = -parseFloat(userInputParam.right);
                }
            }

            if (survivor.isClosed) {
                isArea = survivor.isClosed();
            }
            var survivorNodes = graph.childNodes(survivor);
            var locs = _.pluck(survivorNodes, 'loc').map(d=>{
                let u = iD.util.LLtoUTM_(...d);
                return [u.x,u.y,d[2]];
            })
            locs = iD.util.RoadOffset().plineOffset(locs, distance,1).flat();
            // var locs = iD.util.RoadOffset().roadOffset(graph, survivor, distance)[0];

            let nodeEntity = survivorNodes[0];
            var wayLayer = getNewLayerInfo(survivor, WAY_MODEL_NAME);
            let loc0 = survivorNodes[0].loc;
            let loc1 = locs[0];
            let offset = [loc0[0] - loc1[0], loc0[1] - loc1[1]];
            // var nodeLayer = getNewLayerInfo(nodeEntity, NODE_MODEL_NAME);
            let newNodeEntitys = [];
            var setzone = iD.Task.d.tags.utm.zone;
            
            console.log('node length: ',survivorNodes.length,locs.length);
            for (let i = 0; i < locs.length; i++) {
                let ll  = iD.util.UTMtoLL_(locs[i][0], locs[i][1],setzone);
                let loc = [ll[0], ll[1], survivorNodes[i].loc[2]];
                // if (i > 0) {
                //     loc = [...survivorNodes[i].loc];
                //     loc = [loc[0] - offset[0], loc[1] - offset[1], loc[2]];
                // }
                var newNodeEntity = iD.Node({
                    layerId: wayLayer.id,
                    identifier: wayLayer.identifier,
                    loc: loc,
                    modelName: NODE_MODEL_NAME,
                    tags: iD.util.tagExtend.updateTaskTag(nodeEntity)
                });
                newNodeEntitys.push(newNodeEntity);
            }
            let newNodes = _.pluck(newNodeEntitys, 'id');
            let _newNodes = isArea ? newNodes.concat(newNodes[0]) : newNodes;
            let newWay = iD.Way({
                modelName: WAY_MODEL_NAME,
                layerId: wayLayer.id,
                identifier: wayLayer.identifier,
                nodes: _newNodes,
                tags: survivor.tags
            });
            //为新道路设置tag:isnewway:true
            newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
            newWays.push(newWay);
            return {
                way: newWay,
                nodes: newNodeEntitys
            };
        }
        //创建一条新的道路
        function newroad(position, survivor, newNodes, newWay) {
            var newLoc;
            var oldLoc;
            var interPoint = [0, 0];
            var nodeEntity;
            var adjoinEntity;
            var newNodeEntitys = [];
            var isArea = false;
            var heightDiff = null;
            if (userInputParam.heightDiff && !isNaN(userInputParam.heightDiff)) {
                heightDiff = Number(userInputParam.heightDiff);
            }
            var survivorNodes = survivor.nodes;
            if (survivor.isClosed) {
                isArea = survivor.isClosed();
            }
            if (isArea) {
                survivorNodes = survivorNodes.slice(0, survivorNodes.length - 1);
            }
            nodeEntity = graph.entity(survivorNodes[0]);
            var wayLayer = getNewLayerInfo(survivor, WAY_MODEL_NAME);
            var nodeLayer = getNewLayerInfo(nodeEntity, NODE_MODEL_NAME);

            for (var i = 0; i < survivorNodes.length - 1; i++) {
                nodeEntity = graph.entity(survivorNodes[i]);
                adjoinEntity = graph.entity(survivorNodes[i + 1]);
                if (nodeEntity.loc[0] == adjoinEntity.loc[0] && nodeEntity.loc[1] == adjoinEntity.loc[1]) {
                    continue;
                }
                if (position == 'height') {
                    newLoc = [nodeEntity.loc, adjoinEntity.loc].map(function (loc) {
                        return {
                            Longitude: loc[0],
                            Latitude: loc[1]
                        }
                    });
                    interPoint = [newLoc[0].Longitude, newLoc[0].Latitude];
                } else if (0 == i) {
                    newLoc = getLngLat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1], position);
                    interPoint = [newLoc[0].Longitude, newLoc[0].Latitude];
                } else {
                    newLoc = getLngLat(nodeEntity.loc[0], nodeEntity.loc[1], adjoinEntity.loc[0], adjoinEntity.loc[1], position);
                    lineCal.getIntersectionPoint(projection, [oldLoc[0].Longitude, oldLoc[0].Latitude],
                        [oldLoc[1].Longitude, oldLoc[1].Latitude], [newLoc[0].Longitude, newLoc[0].Latitude], [newLoc[1].Longitude, newLoc[1].Latitude], interPoint);

                    interPoint = [newLoc[0].Longitude, newLoc[0].Latitude];

                }
                let h = nodeEntity.loc[2] || -1;
                if (heightDiff != null) {
                    h += heightDiff;
                }
                var newNodeEntity = iD.Node({
                    layerId: nodeLayer.id,
                    identifier: nodeLayer.identifier,
                    loc: [interPoint[0], interPoint[1], h],
                    modelName: NODE_MODEL_NAME,
                    tags: iD.util.tagExtend.updateTaskTag(nodeEntity)
                });
                // newNodeEntity.setTags({
                //     fc: adjoinEntity.tags.fc,
                //     lc_1: adjoinEntity.tags.lc_1,
                //     lc_2: adjoinEntity.tags.lc_2,
                //     fow: adjoinEntity.tags.fow,
                // });
                newNodes.push(newNodeEntity.id);
                newNodeEntitys.push(newNodeEntity);
                oldLoc = newLoc;
            }
            let h = adjoinEntity.loc[2] || -1;
            if (heightDiff != null) {
                h += heightDiff;
            }
            var newNodeEntity = iD.Node({
                layerId: nodeLayer.id,
                identifier: nodeLayer.identifier,
                modelName: NODE_MODEL_NAME,
                loc: [newLoc[1].Longitude, newLoc[1].Latitude, h],
                tags: iD.util.tagExtend.updateTaskTag(adjoinEntity)
            });

            // newNodeEntity.setTags({
            //     // datatype: adjoinEntity.modelName,
            //     fc: adjoinEntity.tags.fc,
            //     lc_1: adjoinEntity.tags.lc_1,
            //     lc_2: adjoinEntity.tags.lc_2,
            //     fow: adjoinEntity.tags.fow,
            // });
            newNodes.push(newNodeEntity.id);
            newNodeEntitys.push(newNodeEntity);
            var isOutTansactionExtent = false;
            // 线类型超出范围的点裁剪
            var lineNewNodeEntitys = [];
            var lastNode2, lastFlag2;
            if (isArea) {
                for (var i = 0; i < newNodeEntitys.length; i++) {
                    if (iD.util.pointNotInPlyGonx(newNodeEntitys[i].loc, context)) {
                        isOutTansactionExtent = true;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < newNodeEntitys.length - 1; i++) {
                    let n1 = newNodeEntitys[i];
                    let n2 = newNodeEntitys[i + 1];
                    lastNode2 = n2;
                    let flag1 = i == 0 ? iD.util.pointNotInPlyGonx(n1.loc, context) : lastFlag2;
                    let flag2 = iD.util.pointNotInPlyGonx(n2.loc, context);
                    lastFlag2 = flag2;

                    // 范围外 -> 范围内
                    if (flag1 && !flag2) {
                        let newLoc = getBreakLoc([n1.loc, n2.loc]);
                        // console.log(n1.id + '进入作业范围：' + n1.loc.join(', ') + ' -- ' + n2.loc.join(',') + ' -> ' + (newLoc && newLoc.join(',')));
                        if (!newLoc) continue;
                        n1.loc = newLoc;
                        lineNewNodeEntitys.push(n1);
                    }
                    // 范围内 -> 范围外
                    else if (!flag1 && flag2) {
                        let newLoc = getBreakLoc([n1.loc, n2.loc]);
                        // console.log(n2.id + '超出作业范围：' + n2.loc.join(', ') + ' -- ' + n2.loc.join(',') + ' -> ' + (newLoc && newLoc.join(',')));
                        lineNewNodeEntitys.push(n1);
                        if (!newLoc) {
                            lastNode2 = null;
                            break;
                        }
                        n2.loc = newLoc;
                        lineNewNodeEntitys.push(n2);
                        break;
                    }
                    // 范围内
                    else if (!flag1 && !flag2) {
                        lineNewNodeEntitys.push(n1);
                    }
                }
                // 全部在范围内时
                if (lastNode2 && _.last(lineNewNodeEntitys).id != lastNode2.id) {
                    lineNewNodeEntitys.push(lastNode2);
                }
                // console.log('裁剪操作后节点数量：' + newNodeEntitys.length + ' -> ' + lineNewNodeEntitys.length)
                // console.log('------------------------------------------------');
                newNodeEntitys = lineNewNodeEntitys;
                newNodes = _.pluck(newNodeEntitys, 'id');
                isOutTansactionExtent = false;
            }

            if (isOutTansactionExtent == true) {
                if (position == "left") {
                    Dialog.alert("左边扩路，已出对象边界", callback);
                } else if (position == "right") {
                    Dialog.alert("右边扩路，已出对象边界", callback);
                }
            } else if (isOutTansactionExtent == false) {
                if (GRAPH_REPLACE) {
                    for (let i = 0; i < newNodeEntitys.length; i++) {
                        graph = graph.replace(newNodeEntitys[i]);
                    }
                }
                let _newNodes = isArea ? newNodes.concat(newNodes[0]) : newNodes;
                newWay = iD.Way({
                    modelName: WAY_MODEL_NAME,
                    layerId: wayLayer.id,
                    identifier: wayLayer.identifier,
                    nodes: _newNodes,
                    tags: survivor.tags
                });
                //为新道路设置tag:isnewway:true
                // newWay = newWay.mergeTags({SRC_ID: '', ISNEWWAY: 'true'});
                newWay.tags = iD.util.tagExtend.updateTaskTag(newWay);
                //newWay.mergeTags({adas:"0","slope_src":"0"});
                //newWay = newWay.mergeTags({src_id: '', isnewway: 'true'});
                // newWay = newWay.mergeTags({src_id: '', isnewway: 'true'});
                if (GRAPH_REPLACE) {
                    graph = graph.replace(newWay);
                }

                // var upnode=graph.entity(newWay.nodes[0]);
                // upnode = iD.util.tagExtend.updateNodeMeshTag(upnode,context);
                //upnode.tags.mesh=MapSheet.getMeshCode(upnode,context);
                //道路的首尾结点realnode字段的更新
                // upnode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,upnode);
                // graph = iD.actions.AddEntity(upnode)(graph);
                //graph.replace(upnode);
                // upnode=graph.entity(newWay.nodes[newWay.nodes.length-1]);
                // upnode = iD.util.tagExtend.updateNodeMeshTag(upnode,context);
                //upnode.tags.mesh=MapSheet.getMeshCode(upnode,context);
                // upnode = iD.util.tagExtend.updateRoadNodeRealNodeTag(graph,upnode);
                // graph = iD.actions.AddEntity(upnode)(graph);
                newWays.push(newWay);
            }

            return {
                way: newWay,
                nodes: newNodeEntitys
            };
        };

        function callback() {
            context.enter(iD.modes.Browse(context));
        };


        //@param position [标注扩展道路的左边or右边]
        //@return 扩路后A,B两点新的坐标(A,B两点相邻)
        function getLngLat(lngA, latA, lngB, latB, position) {
            var result = new Array();
            var angle = 0;
            if (angleBaseLine && angleBaseLine.length == 2) {
                let locA = angleBaseLine[0];
                let locB = angleBaseLine[1];
                angle = lineCal.getAngle(locA[0], locA[1], locB[0], locB[1]);
            } else {
                angle = lineCal.getAngle(lngA, latA, lngB, latB);
            }
            var distance = 0.003;

            if (position == "left") {
                angle = (angle - 90) + 360;
                if (userInputParam.left != "") {
                    distance = userInputParam.left / 1000;
                }
            } else if (position == "right") {
                angle = (angle + 90) + 360;
                if (userInputParam.right != "") {
                    distance = userInputParam.right / 1000;
                }
            }
            var newPointA = {};
            var newPointB = {};
            var pointA = lineCal.calculateVerticalP(lngA, latA, distance, angle);
            newPointA.Longitude = pointA.Longitude;
            newPointA.Latitude = pointA.Latitude;
            result.push(newPointA);
            var pointB = lineCal.calculateVerticalP(lngB, latB, distance, angle);
            newPointB.Longitude = pointB.Longitude;
            newPointB.Latitude = pointB.Latitude;
            result.push(newPointB);
            return result;
        };
    };


    function getBreakLoc(locs) {
        var flag = false;
        if (!context.editArea()) {
            return flag;
        }
        var holes = context.editArea().coordinates;
        for (var j = 0; j < holes.length; j++) {
            var holes_nodes = [];
            for (var k = 0; k < holes[j].length - 1; k++) {
                if (flag && !isNaN(flag[0])) {
                    break;
                }
                holes_nodes = [
                    holes[j][k],
                    holes[j][k + 1]
                ];
                flag = iD.util.getSegmentIntersectLoc2(holes_nodes, locs)[0];
            }
        }
        // if(!flag || !flag.length) return locs[1];
        if (!flag || !flag.length) return false;
        var z = iD.util.getHeight(flag);
        return [flag[0], flag[1], z];
    }
    window.getBreakLoc = getBreakLoc;

    action.setUserInputParam = function (_) {

        userInputParam = _;
    };

    action.setModelName = function (w, n) {
        if (w) WAY_MODEL_NAME = w;
        if (n) NODE_MODEL_NAME = n;
        return this;
    }

    action.graphReplace = function (d) {
        GRAPH_REPLACE = d;
        return this;
    }

    action.getResult = function () {
        return actionResult;
    }

    action.setAngleBaseLine = function (locs) {
        if (locs && locs.length == 2) {
            angleBaseLine = locs;
        } else {
            angleBaseLine = null;
        }
        return this;
    }

    action.disabled = function () {
        return false;
    };

    return action;
}