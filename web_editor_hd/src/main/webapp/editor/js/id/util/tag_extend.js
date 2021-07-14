/**
 * Created by  on 2015/8/30.
 * 实体的tags属性修改拓展
 */

iD.util.tagExtend = {

    //传入way为道路实体，更新道路的length 属性tag
    updateWayLengthTag: function (graph, way) {

        function calcuTwoNodesDistance(nodeIdA, nodeIdB, graph) {
            var nodeIdAEntity = graph.entity(nodeIdA),
                nodeIdBEntity = graph.entity(nodeIdB);
            var lon = iD.util.lassExtend.getDistance({
                lon: nodeIdAEntity.loc[0],
                lat: nodeIdAEntity.loc[1]
            }, {
                lon: nodeIdBEntity.loc[0],
                lat: nodeIdBEntity.loc[1]
            });
            return lon;
        }


        function hasAssistInfo(entity) {
            var rels = graph.parentRelations(entity);
            var flag = false;
            if (entity.modelName != iD.data.DataType.HIGHWAY) {
                return flag;
            }
            for (var i = 0; i < rels.length; i++) {
                if (rels[i].modelName == iD.data.DataType.NODECONN) {
                    var secRels = graph.parentRelations(rels[i]);
                    secRels.forEach(function (relation) {
                        if (relation.modelName == iD.data.DataType.ASSISTINFO) {
                            flag = true;
                        }
                    })

                }
            }
            return flag;
        }
        var nodesArr = way.nodes;
        var i, length = 0;
        //必须至少包含两个结点才会有道路长度
        if (nodesArr.length > 1) {
            for (i = 0; i < nodesArr.length - 1; i++) {
                length += calcuTwoNodesDistance(nodesArr[i], nodesArr[i + 1], graph);
            }
            //way = way.mergeTags({length: length.toString(),mesh: ""});
            // way = way.mergeTags({LENGTH: length.toString()});
            //graph = graph.replace(way);
        }

        if (length < 5 && hasAssistInfo(way)) {
            Dialog.alert("长度小于5米的道路不能包含门禁信息，请修改！");
        }

        return way;
        //return graph;

    },

    modelNameErro: function (entity) {
        if (entity instanceof iD.Entity && !_.include([
            iD.data.DataType.PLACENAME,
            iD.data.DataType.SEARCH_POINT,
            'roadcrossline'
        ], entity._type || entity.modelName)) {
            if (_.isUndefined(entity.modelName) || entity.modelName == 'undefined') {
                Dialog.alert("关系中存在非法modelName" + entity.id + "请联系研发");
                return;
            }
        }

        if (entity instanceof iD.Relation) {
            let members = entity.members;
            for (let i = 0; i < members.length; i++) {
                if (_.isUndefined(members[i].modelName) || members[i].modelName == 'undefined') {
                    Dialog.alert("关系中存在非法modelName" + entity.id + "请联系研发");
                    return;
                }
            }
        }
    },

    /**
     * @description: 病害属性 面积 长度维护
     * @param {*} entity
     * @param {*} context
     * @return {*}
     */
    _updatePavement: function (graph,entity) {

        if (!(entity instanceof iD.Way)) {
            return entity.tags;
        }
        
        let nodes = graph.childNodes(entity);
        let nodeLocs = _.pluck(nodes, 'loc');
        let _len = 0; _area = 0;
        let w = 0;
        if (iD.data.DataType.PAVEMENT_DISTRESS_PL == entity.modelName) {
            let point = turf.lineString(nodeLocs);
            if (["1", "2", "11", "41"].includes(entity.tags.TYPE)) {
                w = 0.2;
            } else if ("5" == entity.TYPE) {
                w = 0.4;
            } else if (["32", "34", "36", "37", "39"].includes(entity.tags.TYPE)) {
                w = 1;
            }
            _len = turf.length(point, { units: 'meters' });
            _area = _len * w;

            entity = entity.mergeTags({ AREA: _area, LENGTH: _len });

        } else if (iD.data.DataType.PAVEMENT_DISTRESS == entity.modelName) {
            let polygon = turf.polygon([nodeLocs]);
            _area = turf.area(polygon);

            entity = entity.mergeTags({ AREA: _area });
        }

        return entity;
    },

    updateTaskTag: function (entity, newTags) {
        if (!iD.Task.d) {
            return d;
        }

        let tags = Object.assign({}, entity.tags, newTags);
        let lay = iD.Layers.getLayer(entity.layerId);
        let modelEntity = iD.ModelEntitys[entity.modelName];
        let defaultField = {};
        let username = iD.User.getInfo().username;
        modelEntity && modelEntity.getFields(modelEntity.getGeoType()).forEach(function (d) {
            defaultField[d.fieldName] = true;
        });
        let datatype = iD.data.DataType;

        let task = iD.Task.d;
        if (task) {
            if (modelEntity && modelEntity.modelName() == datatype.QUALITY_TAG) {
                tags.TASK_ID = task.task_id;
            } else {
                tags.TASKID = task.task_id;
            }
            tags.FLAG = '2';
            if (lay && lay.batch) {
                tags.BATCH = lay.batch;
            }
            if (modelEntity && modelEntity.modelName() == datatype.AUTO_CHECKWORK_TAG) {
                tags.TAGTYPE = '2';
            }
            if (defaultField.hasOwnProperty('OPERATOR')) {
                tags.OPERATOR = username;
            }
            // if(defaultField.hasOwnProperty('SDATE')){
            // 	tags.SDATE = (new Date()).getTime();
            // }
            if (defaultField.hasOwnProperty('SDATE')) {
                tags.SDATE = task.tags._trackTime;
            }
            var isWorker = iD.User.isWorkRole();
            var isChecker = iD.User.isCheckRole();
            // CHECK_TAG
            if (modelEntity && modelEntity.modelName() == datatype.QUALITY_TAG) {
                if (defaultField.hasOwnProperty('EDIT_BY') && isWorker) {
                    tags.EDIT_BY = username;
                }
                if (defaultField.hasOwnProperty('CHECK_BY') && isChecker) {
                    tags.CHECK_BY = username;
                }
            }
        }
        return tags;
    },
    /*
     * 传入RoadNode实体，更新结点的realnode属性tags
     * 标识对应节点连接道路的条数
     * -1：其他（孤立结点）
     * 0：伪节点（连接两条道路）
     * 1：真实节点 (连接两条以上道路)
     * */
    updateRoadNodeRealNodeTag: function (graph, entity) {

        var parentWays = graph.parentWays(entity);
        var wayCounts = 0;
        var tags = { REALNODE: "1" };
        for (var i = 0; i < parentWays.length; i++) {
            if (parentWays[i].modelName == iD.data.DataType.ROAD)
                wayCounts++;
        }

        // if (wayCounts == 1) {
        //     tags = {
        //         realnode: "-1",
        //         gate_lane: "",
        //         gate_info: "",
        //         spell: "",
        //         name_chn: "",
        //         ad_bnd: "0",
        //         railway: "0",
        //         tollgate: "0",
        //         signlight: "0"
        //     };
        // } else if (wayCounts == 2) {
        //     tags = {realnode: "0"};
        // }
        // if (entity.tags.realnode == "" || entity.tags.realnode != tags.realnode) {
        //     entity = entity.mergeTags(tags);
        // }


        return entity;

    },

    /*
     * 其他节点变为悬挂节点后
     * 1、悬挂节点的SAAT处理：IMAGE_ID、LANEINFO、REAR_BMP、SIDE_BMP为空
     * 2、删除与悬挂节点MAAT相关联的信息（如禁止信息、辅助信息）
     * 3、悬挂节点需处理：GATE_LANE、GATE_INFO、SPELL、NAME_CHN为空，AD_BND、RAILWAY、TOLLGATE、SIGNLIGHT为‘0’
     * 返回值为graph
     */
    updateRelationsTagsByRealNode: function (graph, entity) {
        function updateDefaultTags(relation) {
            var tags = relation.tags;
            var modelEntity = iD.Layers.getLayer(relation.layerId).modelEntity();
            if (modelEntity) {
                var gtype = modelEntity.getGeoType();
                modelEntity.getFields(gtype).filter(function (d) {
                    if (tags.hasOwnProperty(d.fieldName) && tags[d.fieldName] != d.defaultValue) {
                        tags[d.fieldName] = d.defaultValue;
                    }
                });
            }
            return tags;
        }

        if (entity.tags.realnode == "-1") {
            var firstRels = graph.parentRelations(entity);
            firstRels.forEach(function (relation) {
                if (relation.modelName == (iD.data.DataType.NODEINFO)) {
                    relation = relation.mergeTags({ IMAGE_ID: "", LANEINFO: "", REAR_BMP: "", SIDE_BMP: "" });
                    graph = iD.actions.AddEntity(relation)(graph);
                }
                if (relation.modelName == (iD.data.DataType.NODECONN)) {
                    var secondeRels = graph.parentRelations(relation);
                    secondeRels.forEach(function (secondRel) {
                        graph = iD.actions.DeleteRelation(secondRel.id)(graph);
                    })
                }
            })
        }
        return graph;
    },

    //更新结点的mesh，mesh_2，boundary属性
    updateNodeMeshTag: function (entity, context) {
        return entity;
        return entity;
        var meshsArr = MapSheet.getMeshCodeArr(entity, context);
        if (meshsArr.length == 0) {
            //Dialog.alert(("未找到包含节点"+entity.id+"图幅数据"));
            console.error("未找到包含节点" + entity.id + "图幅数据");
        } else if (meshsArr.length == 1) {
            if (entity.tags.MESH != meshsArr[0]) {
                entity = entity.mergeTags({ MESH: meshsArr[0] });
                /* if (entity.tags.mesh_2 == meshsArr[0] && entity.tags.adf_id2 != "") {
                     entity = entity.mergeTags({src_id: entity.tags.adf_id2});
                 } else {
                     entity = entity.mergeTags({SRC_ID: ""});    //跨图幅的结点的src_id属性置空，后台变更赋值
                 }*/
            }
            // if (entity.tags.mesh_2 != "") {
            //     entity = entity.mergeTags({mesh_2: ""});
            // }
            // if (entity.tags.adf_id2 != "") {
            //     entity = entity.mergeTags({adf_id2: ""});
            // }
            if (entity.tags.BOUNDARY != "0") {
                entity = entity.mergeTags({ BOUNDARY: "0" });
            }
        } else {
            // entity = entity.mergeTags({MESH: meshsArr[0]});
            // entity = entity.mergeTags({mesh_2: meshsArr[1]});
            entity = entity.mergeTags({ BOUNDARY: "20" });
            // if (entity.tags.adf_id2 != "") {
            //     entity = entity.mergeTags({adf_id2: ""});
            // }
            /* if (entity.tags.SRC_ID != "") {
                 entity = entity.mergeTags({SRC_ID: ""});
             }*/
        }

        return entity;
    },

    //更新结点的verifyuser，verifytime属性
    updateVerifyTag: function (entity) {

        /* 保存时的多余字段
        var username = iD.User.getInfo().username;
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1).toString();
        var day = date.getDate() < 10 ? ("0" + date.getDate().toString()) : date.getDate().toString();
        var hours = date.getHours() < 10 ? ("0" + date.getHours().toString()) : date.getHours().toString();
        var minutes = date.getMinutes() < 10 ? ("0" + date.getMinutes().toString()) : date.getMinutes().toString();
        var seconds = date.getSeconds() < 10 ? ("0" + date.getSeconds().toString()) : date.getSeconds().toString();
        var time = year + month + day + hours + minutes + seconds;
        var modifyTags = {
            'verifyuser': username,
            'verifytime': time
        };
        entity = entity.mergeTags(modifyTags);
        */
        return entity;
    },


    /*
     * 更新nodemaat关系的ACCESSABLE字段    0：能通达；1：不能通达
     * direction字段属性意义：
     * 1：双向通行
     * 2：正向通行
     * 3：逆向通行
     * 4：双向禁行（仅将步行街定义为“双向禁行”）
     * accessable属性意义：
     * 0：通行方向正确
     * 1：不能通达
     */
    updateAcceTagOfNMaat: function (graph, relation) {
        var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
        var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
        //      var nodeId = relation.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
        var nodeId;
        if (relation.modelName == iD.data.DataType.NODECONN) {
            nodeId = relation.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
        } else if (relation.modelName == iD.data.DataType.C_NODECONN) {
            nodeId = relation.memberByRole(iD.data.RoleType.C_NODE_ID).id;
        }
        var fRoad = graph.entity(from_roadId);
        var tRoad = graph.entity(to_roadId);
        var accessable = "0";
        if (from_roadId == to_roadId) {
            if (fRoad.tags.DIRECTION != "1") accessable = "1";
        } else {
            if (fRoad.tags.DIRECTION == "4" || tRoad.tags.DIRECTION == "4") {
                accessable = "1"
            } else if (fRoad.tags.DIRECTION == "3") {
                //进入道路的伪结点是maat路口
                if (fRoad.last() == nodeId) {
                    accessable = "1"
                } else if (fRoad.first() == nodeId) {
                    //可通行case 1:tRoad为双向通行；case 2：tRoad的起始结点为maat路口，道路正向通行；case 3：tRoad的尾结点为maat路口，道路为反向通行
                    if (!(tRoad.tags.DIRECTION == "1" || (tRoad.first() == nodeId && tRoad.tags.DIRECTION == "2")
                        || (tRoad.last() == nodeId && tRoad.tags.DIRECTION == "3"))) {
                        accessable = "1"
                    }
                }
            } else if (fRoad.tags.DIRECTION == "2") {
                //进入道路的伪结点是maat路口
                if (fRoad.last() == nodeId) {
                    //可通行case 1:tRoad为双向通行；case 2：tRoad的起始结点为maat路口，道路正向通行；case 3：tRoad的尾结点为maat路口，道路为反向通行
                    if (!(tRoad.tags.DIRECTION == "1" || (tRoad.first() == nodeId && tRoad.tags.DIRECTION == "2")
                        || (tRoad.last() == nodeId && tRoad.tags.DIRECTION == "3"))) {
                        accessable = "1"
                    }
                } else if (fRoad.first() == nodeId) {
                    accessable = "1"
                }
            } else if (fRoad.tags.DIRECTION == "1") {
                //可通行case 1:tRoad为双向通行；case 2：tRoad的起始结点为maat路口，道路正向通行；case 3：tRoad的尾结点为maat路口，道路为反向通行
                if (!(tRoad.tags.DIRECTION == "1" || (tRoad.first() == nodeId && tRoad.tags.DIRECTION == "2")
                    || (tRoad.last() == nodeId && tRoad.tags.DIRECTION == "3"))) {
                    accessable = "1"
                }
            }
        }

        // relation = relation.mergeTags({ACCESSABLE: accessable});
        // graph = graph.replace(relation);
        // return graph;
        relation = relation.mergeTags({ ACCESSABLE: accessable });
        return relation;
    },

    //更新crossmaat关系的ACCESSABLE字段    0：能通达；1：不能通达
    updateAcceTagOfCMaat: function (graph, relation) {

        /*

        //判断结点是否被综合交叉点综合
        var isInMemArray = function (nodeId, cNode) {
            var members = cNode.members;
            for (var i = 0; i < members.length; i++) {
                if (members[i].id == nodeId) {
                    return true;
                    break;
                }
            }
            return false;
        };
        var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
        var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
        var nodeId = relation.memberByRole(iD.data.`RoleType.ROAD_NODE_ID).id;
        var fRoad = graph.entity(from_roadId);
        var tRoad = graph.entity(to_roadId);
        var cNode = graph.entity(nodeId);
        var accessable = "0";
        if (from_roadId == to_roadId) {
            if (fRoad.tags.direction != "1")accessable = "1";
        } else {
            if (fRoad.tags.direction == "4" || tRoad.tags.direction == "4") {
                accessable = "1"
            } else if (fRoad.tags.direction == "3") {
                //进入道路的伪结点是maat路口
                if (isInMemArray(fRoad.last(), cNode)) {
                    accessable = "1"
                } else if (isInMemArray(fRoad.first(), cNode)) {
                    //可通行case 1:tRoad为双向通行；case 2：tRoad的起始结点为maat路口，道路正向通行；case 3：tRoad的尾结点为maat路口，道路为反向通行
                    if (!(tRoad.tags.direction == "1" || (isInMemArray(tRoad.first(), cNode) && tRoad.tags.direction == "2")
                        || (isInMemArray(tRoad.last(), cNode) && tRoad.tags.direction == "3"))) {
                        accessable = "1"
                    }
                }
            } else if (fRoad.tags.direction == "2") {
                //进入道路的伪结点是maat路口
                if (isInMemArray(fRoad.last(), cNode)) {
                    //可通行case 1:tRoad为双向通行；case 2：tRoad的起始结点为maat路口，道路正向通行；case 3：tRoad的尾结点为maat路口，道路为反向通行
                    if (!(tRoad.tags.direction == "1" || (isInMemArray(tRoad.first(), cNode) && tRoad.tags.direction == "2")
                        || (isInMemArray(tRoad.last(), cNode) && tRoad.tags.direction == "3"))) {
                        accessable = "1"
                    }
                } else if (isInMemArray(fRoad.first(), cNode)) {
                    accessable = "1"
                }
            } else if (fRoad.tags.direction == "1") {
                //可通行case 1:tRoad为双向通行；case 2：tRoad的起始结点为maat路口，道路正向通行；case 3：tRoad的尾结点为maat路口，道路为反向通行
                if (!(tRoad.tags.direction == "1" || (isInMemArray(tRoad.first(), cNode) && tRoad.tags.direction == "2")
                    || (isInMemArray(tRoad.last(), cNode) && tRoad.tags.direction == "3"))) {
                    accessable = "1"
                }
            }
        }*/
        var accessable = "1";
        if (this.crossMaatIsConnect(graph, relation)) {
            accessable = "0";
        }
        relation = relation.mergeTags({ ACCESSABLE: accessable });
        return relation;
        // graph = graph.replace(relation);
        // return graph;
    },

    //通过深度优先遍历，判断综合交叉点的连通性
    crossMaatIsConnect: function (graph, relation) {
        var nodeIsConnect = function (graph, startId, endId, nodeSet, refWayArr) {
            nodeSet[startId] = 1;
            if (startId == endId) {
                return true;
            }
            else {
                var flag = false;
                graph.parentWays(graph.entity(startId)).forEach(function (way) {
                    if (flag) {
                        return flag;
                    }
                    if (!way.isOneRoadCrossWay() && -1 != refWayArr.indexOf(way.id)) {
                        if (!nodeSet[way.first()] && ((way.tags.DIRECTION == iD.way.direction.twoway) || (way.tags.DIRECTION == iD.way.direction.reverse))) {
                            //nodeSet[way.first()]=1;
                            flag = nodeIsConnect(graph, way.first(), endId, nodeSet, refWayArr);
                        } else if (!nodeSet[way.last()] && ((way.tags.DIRECTION == iD.way.direction.twoway) || (way.tags.DIRECTION == iD.way.direction.positive))) {
                            flag = nodeIsConnect(graph, way.last(), endId, nodeSet, refWayArr);
                        }
                    }
                })
                return flag;
            }

        }
        var from_roadId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
        var to_roadId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
        var nodeId = relation.memberByRole(iD.data.RoleType.C_NODE_ID).id;
        var fRoad = graph.entity(from_roadId);
        var tRoad = graph.entity(to_roadId);
        var cNode = graph.entity(nodeId);
        var croassRelation = graph.parentRelations(cNode, iD.data.DataType.R_C_NODE_ROAD_NODE);


        if (fRoad.id == tRoad.id) {
            if (fRoad.tags.DIRECTION == iD.way.direction.twoway) {
                return true;
            } else {
                return false;
            }
        }
        var nodeIdArr = [];
        if (!croassRelation.length) {
            return false;
        }
        croassRelation[0].members.forEach(function (member) {
            if (member.modelName != iD.data.DataType.C_NODE) {
                nodeIdArr.push(member.id);
            }

        });
        var innerWayIds = [];
        var allWays = [];
        nodeIdArr.forEach(function (nodeId) {
            graph.parentWays(graph.entity(nodeId)).forEach(function (way) {
                if (-1 == allWays.indexOf(way) && !way.isOneRoadCrossWay()) {
                    allWays.push(way);
                }
            })
        });
        allWays.forEach(function (way) {
            if (-1 != nodeIdArr.indexOf(way.first()) && -1 != nodeIdArr.indexOf(way.last())) {
                innerWayIds.push(way.id);
            }
        });
        innerWayIds.push(fRoad.id);
        innerWayIds.push(tRoad.id);
        var fNodeId = (-1 == nodeIdArr.indexOf(fRoad.first())) ? fRoad.first() : fRoad.last();
        var tNodeId = (-1 == nodeIdArr.indexOf(tRoad.first())) ? tRoad.first() : tRoad.last();

        if (fRoad.tags.DIRECTION == iD.way.direction.twowayforbid || tRoad.tags.DIRECTION == iD.way.direction.twowayforbid) {
            return false;
        }
        /*if(fRoad.tags.DIRECTION!=iD.way.direction.twoway)
        {
            if(fNodeId==fRoad.first()&&fRoad.tags.DIRECTION!=iD.way.direction.reverse)
            {
                return false;
            }else if(fNodeId==fRoad.last()&&fRoad.tags.DIRECTION!=iD.way.direction.positive)
            {
                return false;
            }

        }
        if(tRoad.tags.DIRECTION!=iD.way.direction.twoway)
        {
            if(tNodeId==tRoad.first()&&tRoad.tags.DIRECTION!=iD.way.direction.positive)
            {
                return false;
            }else if(tNodeId==tRoad.last()&&tRoad.tags.DIRECTION!=iD.way.direction.reverse)
            {
                return false;
            }
        }*/
        return nodeIsConnect(graph, fNodeId, tNodeId, {}, innerWayIds);
    },
    //oyyt add 为重点工程添加proId标签,处理所有新建道路的情况
    addProIdTag: function (changes, context) {
        var taskData = iD.Task.working;
        if (taskData.task_classes == '2') {
            var createData = changes.created;
            var modifiedData = changes.modified;
            createData.forEach(function (entity) {
                if (entity instanceof iD.Way) {
                    entity = entity.mergeTags({ 'pro_id': taskData.basic_id });
                    context.replace(
                        iD.actions.AddEntity(entity));
                }
            })
        }
    },

    deleteNewWalkLinkTag: function (changes, context) {
        var createData = changes.created;
        createData.forEach(function (entity) {
            if (entity instanceof iD.Way) {
                delete entity.tags.isnewwalklink;
                context.replace(
                    iD.actions.AddEntity(entity));
            }
        })
    }


    //判断两个节点的连通性

}

