/**
 * entity属性发生了改变，编辑后改变（属性改变）
 * @param {Object} context
 */
iD.ui.EntityEditor = function (context, renderEditor = true) {
    var event = d3.dispatch('choose'),
        state = 'select',
        id;
    
    var clip;
    var rawTagEditor;
    if(renderEditor){
    	rawTagEditor = iD.ui.RawTagEditor(context)
    	    .on('change', changeTags);
    }

    function entityEditor(selection) {
    	if(!renderEditor) return ;
        var entity = context.entity(id),
            tags = _.clone(entity.tags);
        var currentLayer = iD.Layers.getLayer(entity.layerId);

        var $header = selection.selectAll('.KDSEditor-header')
            .data([0]);

        // Enter

        var quick_key = 'ALT+C';
        //$enter.select('.preset-close').call(tooltip);
        var $enter = $header.enter().append('div')
            .attr('class', 'KDSEditor-header KDSEditor-fillL cf');

        $enter.append('button')
            .attr('class', 'KDSEditor-fr preset-close').attr("title", '快捷键:' + quick_key)
            .append('span')
            .attr('class', 'KDSEditor-icon close');

        $enter.append('h3');

        // Update Header Title
        var $title = $header.select('h3')
            // .text(t('inspector.edit'));
            .attr('title', iD.Entity.id.toOSM(id))
            .text('ID: '+iD.Entity.id.toOSM(id));
        
        if(clip){
            clip.destroy();
            clip = null;
        }
        clip = new ClipboardJS($title.node(), {
            text: function () {
                return $title.attr('title');
            }
        });

        $header.select('.preset-close')
            .on('click', function () {
                context.enter(iD.modes.Browse(context));
            });


        var keybinding = d3.keybinding('entity_editor')
            .on(quick_key, function () {
                context.enter(iD.modes.Browse(context));
            });

        d3.select(document)
            .call(keybinding);
        var $body = selection.selectAll('.KDSEditor-inspector-body')
            .data([0]);

        // Enter

        $enter = $body.enter().append('div')
            .attr('class', 'KDSEditor-inspector-body');

        $enter.append('div')
            .attr('class', 'KDSEditor-inspector-border raw-tag-editor KDSEditor-inspector-inner');
		
        selection.selectAll('.KDSEditor-inspector-body').each(function(){
            var $panel = d3.select(this);
            $panel.classed('no-pointer-events', false);
            let _et = context.entity(id);
//          if(currentLayer && currentLayer.tagReadOnly || !iD.util.entityInPlyGon(context.entity(id), context)){
            if(currentLayer && currentLayer.tagReadOnly){
                $panel.classed('no-pointer-events', true);
            }else if(context.transactionEditor() && !iD.util.entityInPlyGon(_et, context)){
                $panel.classed('no-pointer-events', true);
            }else if(!context.transactionEditor()){
                $panel.classed('no-pointer-events', !entityEditable(_et));
            }
        });


        $body.select('.raw-tag-editor')
            .call(rawTagEditor.entityID(id)
                .tags(tags)
                .state(state));
       
        function historyChanged(difference) {
            if (state === 'hide') return;
            var entity = context.hasEntity(id);
            if (!entity) return;
            var modifieds = difference && difference.modified();
            if(!modifieds || !modifieds.length) return ;
            if(_.pluck(modifieds, 'id').includes(id)){
            	entityEditor(selection); 
            }
        }

        context.history()
            .on('change.entity-editor', historyChanged);
    }
    
    function entityEditable(entity){
        var modelName = entity.modelName;
        // 20190115，车道线节点，超出的点只限制“点类型”属性修改
        // raw_tag_edtior.js中配置限制项；
        if(modelName == iD.data.DataType.DIVIDER_NODE){
        	return true;
        }
        
        //车道线/辅助线，只限制超出的节点，不限制线；
        //地面区域/人行横道，第一个点超出边界，整体禁止编辑；
        //路牌/交通灯，中心点超出边界，整体禁止编辑；
        if([
            // iD.data.DataType.DIVIDER_NODE,
            iD.data.DataType.OBJECT_PL_NODE
        ].includes(modelName)){
            return iD.util.entityInPlyGon(entity, context);
        }else if([
            iD.data.DataType.OBJECT_PG,
            iD.data.DataType.OBJECT_PG_NODE
        ].includes(modelName)){
            let way;
            if(modelName == iD.data.DataType.OBJECT_PG){
                way = entity;
            }else {
                way = context.graph().parentWays(entity)[0];
            }
            if(!way) return false;
            return iD.util.entityInPlyGon(context.entity(way.first()), context);
        }else if([
            iD.data.DataType.TRAFFICSIGN,
            iD.data.DataType.TRAFFICSIGN_NODE,
            iD.data.DataType.TRAFFICLIGHT,
            iD.data.DataType.TRAFFICLIGHT_NODE
        ].includes(modelName)){ 
            let way;
            if([
                iD.data.DataType.TRAFFICSIGN,
                iD.data.DataType.TRAFFICLIGHT
            ].includes(modelName)){
                way = entity;
            }else {
                way = context.graph().parentWays(entity)[0];
            }
            if(!way) return false;
            let locs = _.pluck(context.graph().childNodes(way), 'loc');
            let loc = iD.util.getCenterPoint(locs);
            return !iD.util.pointNotInPlyGonx(loc, context);
        }
        
        return true;
    }

    // function clean(o) {
    //     var out = {}, k, v;
    //     /*jshint -W083 */
    //     for (k in o) {
    //     	v = o[k]
    //     	if (v ==null) v = "NULL";
    //         if (k && v !== undefined/* && v !=null*/) {
    //             out[k] = v.toString().split(';').map(function (s) {
    //                 return s.trim();
    //             }).join(';');
    //         }
    //     }
    //     /*jshint +W083 */
    //     return out;
    // }

    // NULL改为空值，防止必填项校验出错
    function clean(o) {
        var out = {}, k, v;
        /*jshint -W083 */
        for (k in o) {
        	v = o[k]
        	if (v ==null) v = "";
            if (k && v !== undefined/* && v !=null*/) {
                out[k] = v.toString().split(';').map(function (s) {
                    return s.trim();
                }).join(';');
            }
        }
        /*jshint +W083 */
        return out;
    }
/*
     修改增加批量属性修改功能
*/
    function changeTags(changed) {
        iD.UserJobHeartbeat.setJobStatus();
        var primaryKey = window.primaryKey;
        let _changeKeys = _.keys(changed);
        if(!primaryKey && _changeKeys.length){
        	primaryKey = _changeKeys.length == 1 ? _changeKeys[0] : '属性字段';
        }
        var entity = context.entity(id);

        var  ob = [{
            'attributeName': primaryKey || '',
            'originalValue': entity.tags[primaryKey] || '',
            'newValue':_.values(changed).toString() || '',
            'action':'update'
        }]

        context.buriedStatistics().merge(1,entity.modelName,500);
        iD.logger.editElement({
            'tag': 'propertyPanel',
            'modelName': entity.modelName, 
            'entityId':entity.osmId() || '',
            'type': '',
            'msg': '',
            'action': null,
            'child_event_name':ob,
            // filter记录修改前信息
            'filter': iD.logger.getFilter(entity, context)
        });
        
        var tags = clean(_.extend({}, entity.tags, changed));
        var chnName = getChnName(changed, entity,primaryKey);
        var msg = "更改" + chnName;
        //批量赋值属性选中 多选不支持批量修改别名
        /*
            arguments:d, fieldOpts, $inpField, uiField, opts
        */

        if(d3.select("#multiEditor").size()>0 && d3.select("#multiEditor")[0][0].checked){

            if(!arguments[1][4]["eventTriggerType"] && iD.util.tagChanged(entity.tags, tags)){
                return ;
            }
            

            //针对 changed 对象跟原值比较，可以单独对change进行相关处理，去掉undifined和自定义tags以外的name属性，防止破坏原有数据结构 
            _.forEach(changed,function(value,name,obj){if( _.isUndefined(value) || _.isUndefined(entity.tags[name])){delete obj[name]}});
            if(_.isEmpty(changed)){
                return ;
            }

            var actions_array = [],
                 selectedArrs = [],
                 navitypeChanged = isNavitypeChanged(changed, entity.tags, tags) ;

            actions_array.push(iD.actions.ChangeTags(id, tags));
            if(d3.select("#multiEditor").size()>0 && d3.select("#multiEditor")[0][0].checked){
                selectedArrs = changeOtherRoadTags(id,actions_array,changed,arguments);
            }
            //console.log(selectedArrs);
            
            actions_array.push(msg);
            //context.perform.apply(this,actions_array);
            context.perform(iD.actions.Noop(),msg);
            context.replace.apply(this,actions_array);
            if(changed.DIRECTION){
                selectedArrs.forEach(function(selectedId){
                    updateWayMaatAcceTag(selectedId,context,msg);
                })
            }
            if (navitypeChanged>0) {
                selectedArrs.forEach(function(selectedId){
                    updateWalkEnterRelation(selectedId,context,msg,navitypeChanged);
                })
            }

        }else{
            //针对 changed 对象跟原值比较，可以单独对change进行相关处理，去掉undifined和自定义tags以外的name属性，防止破坏原有数据结构
            _.forEach(changed,function(value,name,obj){if( _.isUndefined(value) || _.isUndefined(entity.tags[name])){delete obj[name]}});

//          if (!_.isEqual(entity.tags, tags)) {
            if (iD.util.tagChanged(entity.tags, tags)) {
                // context.perform(
                //     iD.actions.ChangeTags(id, tags), msg);
                //t('operations.change_tags.annotation'));
                var actions_array=[],
                     navitypeChanged = isNavitypeChanged(changed, entity.tags, tags) ;

                actions_array.push(iD.actions.ChangeTags(id, tags));
                actions_array.push(msg);
                //context.perform.apply(this,actions_array);
                context.perform(iD.actions.Noop(),msg);
                // 例如改了DIVIDER中的R_LINE属性（是否为参考线）
                // 经过replace后，地图上显示的样式会被替换
                // 实际执行的是history.replace
                context.replace.apply(this,actions_array);
                if(changed.DIRECTION){
                    updateWayMaatAcceTag(entity.id,context,msg);
                }
                if (navitypeChanged>0) {
                    updateWalkEnterRelation(entity.id,context,msg,navitypeChanged);
                }
            }
        }
    }

    //return 0 : not changed
    //       1 : add relation
    //       2 : del relation
    function isNavitypeChanged(changed, oldtags, newtags) {
        if(changed.navitype) {
            if (['2', '3', '6', '7'].indexOf(oldtags['navitype']) < 0 &&
                ['2', '3', '6', '7'].indexOf(newtags['navitype']) >= 0) {
                //删除步导点与道路ROAD的关联关系（REL_WKET_ROAD）
                return 2;
            }
            else if (['2', '3', '6', '7'].indexOf(oldtags['navitype']) >= 0 &&
                ['2', '3', '6', '7'].indexOf(newtags['navitype']) < 0) {
                //增加步导点与道路ROAD的关联关系（REL_WKET_ROAD）
                return 1;
            }
        }
        return 0 ;
    }
    //当NAVITYPE取值由人可走道路（NAVITYPE<>2/3/6/7）变为人不可走道路（NAVITYPE=2/3/6/7）时，删除步导点与道路ROAD的关联关系（REL_WKET_ROAD）；
    //当NAVITYPE取值由人不可走道路（NAVITYPE=2/3/6/7）变为人可走道路（NAVITYPE<>2/3/6/7）时，增加步导点与道路ROAD的关联关系（REL_WKET_ROAD）；
    function updateWalkEnterRelation(wayId,context,msg,walkRelFlag) {
        var entity = context.entity(wayId);
        var relations = context.graph().parentRelations(entity);
        if (walkRelFlag == 1) {
            context.replace(addWalkEnterRelation(context,entity,relations),msg);
        } else if (walkRelFlag == 2) {
            relations.forEach(function(relation){
                if(relation.modelName==iD.data.DataType.RELWKETROAD) {
                    context.replace(iD.actions.DeleteRelation(relation.id),msg);
                }
            });
        }
    }
    //加入步导点与道路关系
    function addWalkEnterRelation(context,way,relations){
        return function(graph) {
            //步导关联关系维护
            /*若新生成道路0.1米范围内存在步导点，且该道路为人可走道路（ROAD_LINK::NAVITYPE不等于2/3/6/7），则需要同时建立步导点与车行道路的关联关系（REL_WKET_ROAD）*/
            var distance = 0.1, //单位米
                walkTopo = iD.topo.RelWketRoad(),
                walkUtil = iD.util.walkExtend(),
                walkEnterIds = walkUtil.getWalkEntersWithFilterBBox(context, distance, way, way, graph);
            if (walkEnterIds && walkEnterIds.length >= 1) {
                walkEnterIds.forEach(function (walkEnterId) {
                    graph = walkTopo.waklroadCreate(graph, walkEnterId, way.id);
                })
            }
            return graph;
        }
    }

    function updateAcceTagOfNMaat(relation){
        return function(graph){
            // graph = iD.util.tagExtend.updateAcceTagOfNMaat(graph,relation);
            relation = iD.util.tagExtend.updateAcceTagOfNMaat(graph,relation);
            graph = graph.replace(relation);
            return graph;
        }
    }

    function updateAcceTagOfCMaat(relation){
        return function(graph){
            relation = iD.util.tagExtend.updateAcceTagOfNMaat(graph,relation);
            graph = graph.replace(relation);
            // graph = iD.util.tagExtend.updateAcceTagOfCMaat(graph,relation);
            return graph;
        }
    }

    function updateWayMaatAcceTag(wayId,context,msg){
        var entity = context.entity(wayId);
        var relations = context.graph().parentRelations(entity);
        relations.forEach(function(relation){
            if(relation.modelName==iD.data.DataType.NODECONN){
                context.replace(updateAcceTagOfNMaat(relation),msg);
            }else if(relation.modelName==iD.data.DataType.C_NODECONN){
                context.replace(updateAcceTagOfCMaat(relation),msg);
            }
        })
    }

    function clone2(obj){
        var o, obj;
        if (obj.constructor == Object){
            o = new obj.constructor();
        }else{
            o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
            if ( o[key] != obj[key] ){
                if ( typeof(obj[key]) == 'object' ){
                    o[key] = clone2(obj[key]);
                }else{
                    o[key] = obj[key];
                }
            }
        }
        //o.toString = obj.toString;
        //o.valueOf = obj.valueOf;
        return o;
    }
    /*
        @param:actionArray 需要修改其他道路属性列表，选中道路id放在dom元素的data-multiselectids 属性，分号分隔
        @param :currentId 当前选中道路id
        @changed: 变动属性
        @return：要修改的action数组
        根据dom中附加属性保存其他选中道路，一起批量生产change actions
    */
    function changeOtherRoadTags(currentId,actionArray,changed,args){
         var d3Obj=d3.select("#KDSEditor-sidebar");
        var selectIdArray=[];
            if(d3Obj.size()>0){
                var save_d = args[1][0],
                     fieldOpts = args[1][1],
                    save_entity = fieldOpts.entity ;
                var selectIds=d3Obj.attr("data-multiselectids");
                if(selectIds){
                    selectIdArray=selectIds.split(",");
                    for(var i=0;i<selectIdArray.length;i++){
                        if(selectIdArray[i]!=currentId){
                             var entity = context.entity(selectIdArray[i]),
                                  chgtag = clone2(args[2]),
                                  tpl = args[3] ;
                              if (tpl.onValidate) {
                                  fieldOpts.entity = entity ;
                                  args[1][0] = chgtag ;
                                  chgtag = tpl.onValidate.apply(chgtag, args[1]);
                              }
                            var tags = clean(_.extend({}, entity.tags, chgtag));
                            actionArray.push(iD.actions.ChangeTags(selectIdArray[i], tags));
                        }
                    }
                }
                args[1][0] = save_d ;
                fieldOpts.entity = save_entity;
            }
        return selectIdArray;
       
    }

    function getChnName(changed, entity,primaryKey) {
        var chnName;
        var tags = entity.tags;
        // var layerInfo = iD.Layers.getCurrentEnableLayer();
        var layerInfo = iD.Layers.getLayer(entity.layerId);
        var modelEntity, mtype;

        if (entity.type == "node") {
            mtype = "1";
        } else if (entity.type == "way") {
            mtype = "2";
        }
        else if (entity.type == "relation") {
            mtype = "0";
        }
        // var layType;

        // if (modelName == iD.data.DataType.HIGHWAY) {
        //     modelEntity = layerInfo.modelEntity();
        //     layType = layerInfo.geoType;
        // } else {
        //     modelEntity = layerInfo.getSubModelEntityByType(modelName);
        //     //处理非子图层情况
        //     if (layerInfo.getSubLayerByType(modelName)) {
        //         layType = layerInfo.getSubLayerByType(modelName).geoType;
        //     }
        // }
        modelEntity = iD.ModelEntitys[entity.modelName];
        // layType = layerInfo.geoType;
        if (modelEntity) {
            var gtype = modelEntity.getGeoType();
            var fields = modelEntity.getFields(gtype);
        }

        for (var k in changed) {
            fields.forEach(function (field) {
                if (field.fieldName == k&&primaryKey&&primaryKey==k) {
                    chnName = field.fieldTitle;
                    //chnNameArr.push(field.fieldTitle);
                }
            })
        }
        return chnName;
    }

    entityEditor.state = function (_) {
        if (!arguments.length) return state;
        state = _;
        return entityEditor;
    };

    entityEditor.entityID = function (_) {
        if (!arguments.length) return id;
        id = _;
        return entityEditor;
    };
    
    entityEditor.changeTags = function(changed){
    	changeTags(changed || {});
    	return entityEditor;
    };

    return d3.rebind(entityEditor, event, 'on');
};
