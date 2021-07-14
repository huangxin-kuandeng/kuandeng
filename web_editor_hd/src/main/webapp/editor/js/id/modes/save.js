iD.modes.Save = function (context, indexFlag, callback, errorCallback) {
    //    var ui = iD.ui.Commit(context)
    //        .on('cancel', cancel)
    //        .on('save', save);
    //  var saveTool = iD.util.saveCheckEntity(context);

    //获得所有的跨图幅的差分道路
    function getCrossMeshWays(changes, context) {
        var graph = context.graph();
        // var currLayer = context.layers().getCurrentEnableLayer();
        var currLayer = context.layers().getLayer();
        if (!currLayer || !currLayer.isRoad()) return [];

        if (currLayer.split) {
            var pWays = [], filer = {};
            var created = [].concat(changes['created']), modified = [].concat(changes['modified']), deleted = [].concat(changes['deleted']);

            created = created.filter(function (v) {
                if (v.geometry(graph) === 'line') return true;
                return false;
            });
            modified.forEach(function (v) {
                if (v.geometry(graph) === 'vertex' && !MapSheet.isPointOnRectSide(v.loc, context)) {
                    graph.parentWays(v).forEach(function (mp) {
                        (!filer[mp.id]) && (pWays.push(mp));
                        filer[mp.id] = true;
                    });
                }
            });

            var wanted = created.concat(pWays);
            //数组去重
            function unique(arr) {
                var result = [], hash = {};
                for (var i = 0, elem; (i < arr.length) && (elem = arr[i].id) != null; i++) {
                    if (!hash[elem]) {
                        result.push(arr[i]);
                        hash[elem] = true;
                    }
                }
                return result;
            }

            wanted = unique(wanted);
            //数据过滤
            wanted = wanted.filter(function (want) {
                if (want.isOneRoadCrossWay()) return false;
                var focusArr = [];
                var focusPoints = [];
                var fNode = graph.entity(want.first());
                var tNode = graph.entity(want.last());
                for (var l = want.nodes.length, i = 0; i < l - 1; i++) {
                    var p1 = graph.entity(want.nodes[i]).loc, p2 = graph.entity(want.nodes[i + 1]).loc, p12 = p1.concat(p2);
                    //var focusPoints = MapSheet.getFocusPoints(undefined, p12, context);
                    //if (focusPoints.length) return true;
                    var tmpFocusPoints = MapSheet.getFocusPoints(undefined, p12, context);
                    focusPoints = focusPoints.concat(tmpFocusPoints);
                }
                for (var i = 0; i < focusPoints.length; i++) {
                    var fDistance = iD.util.lassExtend.getDistance({
                        lon: fNode.loc[0],
                        lat: fNode.loc[1]
                    }, {
                        lon: focusPoints[i][0],
                        lat: focusPoints[i][1]
                    });
                    var tDistance = iD.util.lassExtend.getDistance({
                        lon: tNode.loc[0],
                        lat: tNode.loc[1]
                    }, {
                        lon: focusPoints[i][0],
                        lat: focusPoints[i][1]
                    });
                    if (fDistance > 1 && tDistance > 1) {
                        focusArr.push(focusPoints[i]);
                    }
                }
                if (focusArr.length > 0) {
                    return true;
                }
                return false;
            });

            //如果一条直线道路的首尾结点之一已经在图幅边框上了，那么对这条道路不打断
            wanted = wanted.filter(function (want) {
                var fNode = graph.entity(want.first());
                var tNode = graph.entity(want.last());
                if (want.nodes.length == 2 && ((fNode.tags && fNode.tags.boundary == "20") || (tNode.tags && tNode.tags.boundary == "20"))) {
                    return false;
                }
                return true;
            });

            return wanted;
        }

        return [];
    }

    //对跨图幅的道路进行打断
    function splitCrossMeshWay(way, context) {
        var graph = context.graph();
        // var currLayer = context.layers().getCurrentEnableLayer();
        var currLayer = context.layers().getLayer(way.layerId);
        var fNode = context.entity(way.first());
        var tNode = context.entity(way.last());

        var focusPoints = [];
        for (var l = way.nodes.length, i = 0; i < l - 1; i++) {
            var p1 = graph.entity(way.nodes[i]).loc, p2 = graph.entity(way.nodes[i + 1]).loc, p12 = p1.concat(p2);
            var tmpFocusPoints = MapSheet.getFocusPoints(undefined, p12, context);
            focusPoints = focusPoints.concat(tmpFocusPoints);
        }
        var focusArr = [];
        for (var i = 0; i < focusPoints.length; i++) {
            var fDistance = iD.util.lassExtend.getDistance({
                lon: fNode.loc[0],
                lat: fNode.loc[1]
            }, {
                lon: focusPoints[i][0],
                lat: focusPoints[i][1]
            });
            var tDistance = iD.util.lassExtend.getDistance({
                lon: tNode.loc[0],
                lat: tNode.loc[1]
            }, {
                lon: focusPoints[i][0],
                lat: focusPoints[i][1]
            });
            if (fDistance > 1 && tDistance > 1) {
                focusArr.push(focusPoints[i]);
            }
        }
        if (focusArr.length == 0) {
            return;
        }
        var loc = focusArr[0];

        var choice = iD.geo.chooseEdge(graph.childNodes(way), context.projection(loc), context.projection),
            edge = [way.nodes[choice.index - 1], way.nodes[choice.index]];
        var node = iD.Node({
            identifier:currLayer.identifier,
            layerId: currLayer.id, loc: loc});
        /*if(way.modelName&&way.modelName==iD.data.DataType.WALKLINK){
            node = node.mergeTags({datatype: iD.data.DataType.WALKENTER});
        }else if(way.modelName&&way.modelName==iD.data.DataType.HIGHWAY){
            node = node.mergeTags({datatype: iD.data.DataType.ROAD_NODE});
        }*/
        var annotation = t('operations.split.annotation.road');
        context.replace(iD.actions.AddMidpoint({ loc: loc, edge: edge }, node), iD.actions.SplitRoad([node.id], context), annotation);
    }

    //递归处理跨图幅道路的打断
    function processCrossMeshWays(context) {
        var changes = context.history().changes(iD.actions.DiscardTags(context.history().difference()));
        var wanted = getCrossMeshWays(changes, context);
        if (wanted.length < 1) {
            return;
        } else {
            wanted.forEach(function (way) {
                splitCrossMeshWay(way, context);
            })
        }

        processCrossMeshWays(context);
    }

    //增加verifytime和verifyuser属性字段的批量修改
    function updateVerifyOfChanges(changes) {
        return function (graph) {
            var created = [].concat(changes['created']), modified = [].concat(changes['modified']), deleted = [].concat(changes['deleted']);
            created.forEach(function (cEntity) {
                cEntity = iD.util.tagExtend.updateVerifyTag(cEntity);
                graph = graph.replace(cEntity);
            })

            modified.forEach(function (mEntity) {
                mEntity = iD.util.tagExtend.updateVerifyTag(mEntity);
                graph = graph.replace(mEntity);
            })

            return graph;
        }
    }
    function deal(changes) {
        context.perform(iD.actions.Noop(), "cross mesh ways");
        processCrossMeshWays(context);
        var newChanges = context.history().changes(iD.actions.DiscardTags(context.history().difference()));
        context.replace(updateVerifyOfChanges(newChanges));
        var newChanges = context.history().changes(iD.actions.DiscardTags(context.history().difference()));
        var actions = [iD.actions.ProcessInherit(changes)
            , iD.actions.ProcessMesh(changes), "test"];
        context.replace.apply(this, actions);
        context.replace(iD.actions.ProcessInherit(newChanges));
        newChanges = context.history().changes(iD.actions.DiscardTags(context.history().difference()));
        context.replace(iD.actions.ProcessMesh(newChanges));
    }

    function cancel() {
        if (indexFlag && indexFlag === 'layermanager') {
            context.flush();
        }
        context.enter(iD.modes.Browse(context));
    }

    var fieldRequiredValidate = {
        // [iD.data.DataType.IMAGE_TAG] : function(entity){
        //     return {
        //         title: '图像标记',
        //         valid: fieldRequiredValidate._valid(entity, {
        //             fieldNames: ["DATATYPE", "ERRORTYPE"]
        //         })
        //     }
        // },
        // [iD.data.DataType.CHECK_TAG] : function(entity){
        //     return {
        //         title: '质检标记',
        //         valid: fieldRequiredValidate._valid(entity)
        //     }
        // },
        _valid: function (entity, opts) {
            opts = Object.assign({
                fieldNames: [],
                modelEntity: null
            }, opts);
            modelEntity = opts.modelEntity || iD.ModelEntitys[entity.modelName];
            var errMsg = [];
            if (!modelEntity) {
                errMsg.push('没有找到模型规格！');
                return errMsg;
            }
            var fieldNames = opts.fieldNames || [];
            for (let d of modelEntity.getFields(modelEntity.getGeoType())) {
                // fieldInputFilter
                if (fieldNames.length && !fieldNames.includes(d.fieldName)) {
                    continue;
                }
                if (d.fieldInputFilter == 1) {
                    var fieldVal = entity.tags[d.fieldName];
                    if (fieldVal == null || fieldVal == '') {
                        errMsg.push((d.fieldTitle || d.fieldName) + ' 不能为空值');
                        continue;
                    }
                }
            }
            return errMsg.length && errMsg || true;
        }
    };

	/**
	 * 验证要素字段
	 * @param {Object} entity
	 * @return {Object} 
	 * 		validate: true为通过验证，false未通过
	 * 		errMsg: 验证后字段错误信息
	 */
    function validateEntityField(entity) {
        var validate = fieldRequiredValidate[entity.modelName];
        var result, obj = {
            validate: true,
            errMsg: []
        };
        if (validate) {
            var _d = validate(entity);
            result = _d.valid;
            obj.title = _d.title || '';
        } else {
            return obj;
        }
        if (_.isArray(result)) {
            obj.validate = false;
            obj.errMsg = result;
        } else if (result == undefined || result == true) {
            obj.validate = true;
        } else {
            obj.validate = false;
        }
        return obj;
    }

    //处理线点线实体
    function updateEntity2Relation() {
        // var changes =  context.history().changes(iD.actions.DiscardTags(context.history().difference()));
        var changes = context.history().changes();
        // deal(changes);
        // changes =  context.history().changes(iD.actions.DiscardTags(context.history().difference()));
        var created = [], modified = [], deleted = [], filter = {};
        var validate = iD.ModelEntitys[iD.data.DataType.IMAGE_TAG];

        for (var type in changes) {
            var entities = changes[type];
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var valid = validateEntityField(entity);
                if (!valid.validate) {
                    Dialog.alert(valid.title + '' + iD.Entity.id.toOSM(entity.id) + ' 字段验证错误：<br/>' + valid.errMsg.join('<br/>'));
                    return false;
                }
                if (entities[i].isOneRoadCrossWay && entities[i].isOneRoadCrossWay()) {
					/**
					if(type === 'created'){
						var roadNode = context.graph().entity(entities[i].nodes[1]),
							roadCross = context.graph().entity(entities[i].nodes[0]);
						roadNode.tags.cross_node = iD.Entity.id.toOSM(roadCross.id);
						filter[roadNode.id] = true;
						if (roadNode.id.indexOf('-') > -1) created.push(roadNode);
						else modified.push(roadNode);
					} else if (type === 'deleted') {
						if (context.graph().hasEntity(entities[i].nodes[1])) {
							var roadNode = context.graph().entity(entities[i].nodes[1]),
								roadCross = entities[entities.length - 1];
							if (!filter[roadNode.id]) roadNode.tags.cross_node = "";
							modified.push(roadNode);
						}
					} else if (type === 'modified') {
						var roadNode = context.graph().entity(entities[i].nodes[1]),
							roadCross = context.graph().entity(entities[i].nodes[0]);
						roadNode.tags.cross_node = iD.Entity.id.toOSM(roadCross.id);
						modified.push(roadNode);
					}*/
                    entities.splice(i, 1);
                    i--;
                }
            }
        }

        // _.forEach(created, function(entity){
        // 	for (var i = 0, ents = changes['created'];i < ents.length;i++) {
        // 		if (!ents[i].tags.cross_node && ents[i].id === entity.id) {
        // 			changes['created'].splice(i, 1);
        // 			break;
        // 		}
        // 	}
        // 	changes['created'].push(entity);
        // });
        // _.forEach(modified, function(entity){
        // 	changes['modified'].push(entity);
        // });

        // save start envent
        context.event.savestart(changes);
        return changes;
    }


    function filterModelNameList(list) {
        var arr = [];
        list.forEach(function (d) {
            if (!d.modelName) return;
            let mname = ('' + d.modelName).toLowerCase();
            if (mname == 'undefined' || mname == 'null') return;
            arr.push(d);
        });
        //      list.length = 0;
        //      list.push(...arr);
        return arr;
    }

    function save(changes) {
        if (iD.User.isTrackControlPointRole()) {
            context.event.sys9_save
                && context.event.sys9_save();
            return;
        }
        //  	var savedDataList = changes.created.concat(changes.modified);
        // var savedDataList = context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]));
        // var dividers = _.filter(savedDataList, d => d.modelName == iD.data.DataType.DIVIDER);
        /*
        // 拖拽节点时，modified中只有node，没有线，需要判断
        changes.modified.forEach(function(d){
            if(d.modelName != iD.data.DataType.DIVIDER_NODE){
                return ;
            }
            var ways = context.graph().parentWays(d);
            dividers.push(...ways);
        });
        dividers = _.compact(dividers);
        */
        /*
        var isLimit = saveTool.checkLimitDivider(dividers);
        if(isLimit){
            saveTool.show();
            Dialog.alert('车道线长度超过1km。', null, null, null, null, {
                AutoClose: 3
            });
            return ;
        }
        saveTool.close();
        */

        changes = _.clone(changes);
        changes.created = filterModelNameList(changes.created);
        changes.deleted = filterModelNameList(changes.deleted);
        changes.modified = filterModelNameList(changes.modified);
        if (changes.created.length == 0
            && changes.deleted.length == 0
            && changes.modified.length == 0) {
            // 只有前方交会、搜索定位点等没有modelName的数据，不进入保存逻辑；
            Dialog.alert('数据中不存在有效的modelName。', null, null, null, null, {
                AutoClose: 3
            });
            return;
        }
        iD.modes.Save.savingLock++;
        
        //请空格当前已经授权的Adas道路
        // iD.Adas.resertAdasRoads();
        var loading = iD.ui.Loading(context)
            .message(t('save.uploading'))
            .blocking(true);

        context.container()
            .call(loading);

        //var changes = updateEntity2Relation();
        saveBuried();
        context.connection().putChangeset(
            changes,
            //updateEntity2Relation(),
            "",//e.comment,
            context.history().imageryUsed(),
            function (err, data) {
                var _tag = 'task_save_end';
                iD.logger.editElement({
                    'tag': _tag,
                    'modelName': '',
                    'type': 'none',
                    'msg': '保存',
                    'task_type': iD.Task.d.protoData.taskDefinitionKey
                });
                loading.close();
                if (err) {
                    iD.modes.Save.savingLock++;
                    /* var confirm = iD.ui.confirm(context.container());
                     confirm
                         .select('.modal-section.KDSEditor-header')
                         .append('h3')
                         .text(t('save.error'));
                     confirm
                         .select('.modal-section.message-text')
                         .append('p')
                         .text(err.responseText);*/
                    if (err.errorType === 'timeout') {
                        //                  	Dialog.alert('请求数据库(KDS)无响应',function(){
                        //                          context.pop();
                        //                      });
                        Dialog.alert('请求数据库(KDS)无响应');
                    } else if (err.errorType == 'KDS') {
                        Dialog.alert(err.message);
                        // context.pop();
                    } else {
                        Dialog.alert('数据库(KDS)保存出错');
                        // context.pop();
                    }
                   
                    errorCallback && errorCallback();

                } else {
                    //	            	iD.modes.Save.savingLock --;
                    iD.modes.Save.savingLock = 0;

                    // var doc = data.childNodes[0].childNodes[0].textContent;
                    // if(!doc||doc!=0)
                    // {
                    //     var msg='数据库返回:' + data.childNodes[0].childNodes[1].textContent;
                    //     Dialog.alert(msg,function(){
                    //         context.pop();
                    //         errorCallback && errorCallback();
                    // },'数据库(GDS)保存出错');
                    //
                    //     //iD.modes.Browse(context);
                    // }else{
                    context.flush();
                    if (iD.picUtil.player) {
                        iD.picUtil.player.clearMark();
                    }
                    callback && callback()
                    // }
                    //success(e, changeset_id);

                }
                context.event.saveend(data);
            });
        
    }

    function saveBuried() {
        let url = iD.config.URL.kds_data + 'data/stastics/save';
        
        let data = context.buriedStatistics().getBuriedData();
        context.buriedStatistics().save();

        d3.json(url)
            .header("Content-Type", "application/json;charset=UTF-8")
            // .header("Content-Type", "application/x-www-form-urlencoded")
            .post(JSON.stringify(data));
            context.buriedStatistics().init();
            // console.log(data);
    }

    function canSave(changes) {
        if (!changes) return false;
        var changed = false;
        _.each(changes, function (vals = []) {
            if (vals.length) changed = true;
        });
        if (!changed) {
            return false;
        }

        //检查道路数据是否合理
        if (!iD.ui.TagEditor.autocheck.road(context, changes)) {
            return false;
        }

        //对数据正确性和拓补关系正确性进行检查
        var created = [].concat(changes['created']), modified = [].concat(changes['modified']), deleted = [].concat(changes['deleted']);
        var all = created.concat(modified);
        var errMsg = [];
        var checkDate = iD.util.dataValidate.checkNodeAndWayValidate(all, context);
        errMsg = checkDate.errMsg;
        if (errMsg.length > 0) {
            Dialog.alert(errMsg[0], function () { }, "道路/步导线结点错误");
            return false;
        }

        errMsg = iD.util.dataValidate.checkCrossAndWayValidate(checkDate.wayArr, checkDate.roadCrossArr, checkDate.walkEnterArr, context);
        if (errMsg.length > 0) {
            Dialog.alert(errMsg[0], function () { }, "拓补关系错误");
            return false;
        }


        return true;
    }

    function success(e, changeset_id) {
        //        context.enter(iD.modes.Browse(context)
        //            .sidebar(iD.ui.Success(context)
        //                .changeset({
        //                    id: changeset_id,
        //                    comment: e.comment
        //                })
        //                .on('cancel', function(ui) {
        //                    context.ui().sidebar.hide(ui);
        //                })));
        // var confirm = iD.ui.confirm(context.container());
        //     confirm
        //         .select('.modal-section.header')
        //         .append('h3')
        //         .text("提示")
        //         .attr("style","font-size:16px");
        //     confirm
        //         .select('.modal-section.message-text')
        //         .append('p')
        //         .attr("style","font-family:'宋体';font-size:12px;")
        //         .text("数据保存成功。");
        //     confirm
        //         .select('.col2.action')
        //         .attr('style', 'background-color:#02a4cc;color:white;display:none');
        //     setTimeout(function(){
        //         confirm.remove();
        //     },500);
        //     cancel();
        //context.flush(); 
    }

    var mode = {
        id: 'save'
    };

    var behaviors = [
        iD.behavior.Hover(context),
        iD.behavior.Select(context),
        iD.behavior.Lasso(context),
        iD.modes.DragNode(context).behavior];

    function saveConfirm(tip) {
        var b = true;
        Dialog.confirm(tip, function () {
            save(); //保存
            b = true;
        }, function () {
            b = false;
            cancel(); //取消
        });
        return b;
        //if(window.confirm(tip)){
        //	save(); //保存
        //	return true;
        //}else{
        //	cancel(); //取消
        //	return false;
        //}
    }

    mode.enter = function () {
        var _tag = 'task_save_start',
            event_type = iD.UserBehavior.getAction('keydown'),
            logger_type = (event_type === 'keydown' ? 'keydown' : '');
        iD.logger.editElement({
            'tag': _tag,
            'modelName': '',
            'type': logger_type,
            'msg': '保存',
            'task_type': iD.Task.d.protoData.taskDefinitionKey
        });
        behaviors.forEach(function (behavior) {
            context.install(behavior);
        });
        //var text = t('save.save_sure');
        //if(indexFlag && indexFlag === 'layermanager'){
        //	text = t('save.save_sure2');
        //}
        var changes = updateEntity2Relation();//保存前数据批量处理

        if (changes && canSave(changes)) {
            save(changes);
            if (context.variable.autoSaveTime) {
                window.clearInterval(context.variable.autoSaveTime);
                context.variable.autoSaveTime = null;
                context.variable.autoSaveTime = window.setInterval(context.autoSave, 900000);
            }


        } else {
            // context.pop();
        }
        //else {


        context.enter(iD.modes.Browse(context));
        //}
        //saveConfirm(text);
        //        context.ui().sidebar.show(ui);
    };

    mode.exit = function () {
        behaviors.forEach(function (behavior) {
            context.uninstall(behavior);
        });

        //        context.ui().sidebar.hide(ui);
    };

    return mode;
};

iD.modes.Save.savingLock = 0;

iD.modes.Save.isSaving = function () {
    return iD.modes.Save.savingLock !== 0;
};