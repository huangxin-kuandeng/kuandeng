iD.modes.RotateWay = function(context, wayId) {
    var mode = {
        id: 'rotate-way',
        button: 'browse'
    };

    var keybinding = d3.keybinding('rotate-way'),
        edit = iD.behavior.Edit(context);

    mode.enter = function() {
        context.install(edit);

        var annotation = t('operations.rotate.annotation.' + context.geometry(wayId)),
            way = context.graph().entity(wayId),
            nodes = _.uniq(context.graph().childNodes(way)),
            points = nodes.map(function(n) { return context.projection(n.loc); }),
            pivot = d3.geom.polygon(points).centroid(),
            angle;
        // 判断旋转过程中拖拽
        var isdown = ismove = isup = false;
        context.buriedStatistics().merge(1,way.modelName);
        context.perform(
            iD.actions.Noop(),
            annotation);

        function rotate() {
        	if((isdown || ismove) && !isup){
        		isdown = false;
        		ismove = true;
        		points = nodes.map(function(n) { return context.projection(n.loc); });
            	pivot = d3.geom.polygon(points).centroid();
        	}
            var mousePoint = context.mouse(),
                newAngle = Math.atan2(mousePoint[1] - pivot[1], mousePoint[0] - pivot[0]);

            if (typeof angle === 'undefined') angle = newAngle;

            context.replace(
                iD.actions.RotateWay(wayId, pivot, newAngle - angle, context.projection),
                annotation);

            angle = newAngle;
            
            var player = iD.picUtil.player;
            if(player && player.resetPointToPicPlayer){
            	player.resetPointToPicPlayer(_.uniq([way.id].concat(way.nodes)));
            }
        }

        function finish() {
            isup = true;
            d3.event.stopPropagation();
            context.enter(iD.modes.Select(context, [wayId])
            .suppressMenu(true)
            .newFeature(true));
            
            let entity = context.hasEntity(wayId);
            context.buriedStatistics().merge(0,entity.modelName);
            // 面类型起点不能超出作业范围
            if(entity && entity.modelName == iD.data.DataType.OBJECT_PG && !context.transactionEditor()){
                var node = context.entity(entity.first());
                    
                if(!iD.util.justNodeInPlyGonx(node,context)){
                    Dialog.alert('您移动的元素不属于该任务范围内');
                    context.pop();
                    return ;
                }
            }
            
            // 视频重新反投之前，刷新量测信息
            iD.picUtil.updateGroundAreaMeasure(way.id, annotation);
            context.event.entityedite({
            	mode: mode,
            	entitys: [wayId]
            });
        }

        function cancel() {
            context.pop();
            // pop后未执行undone事件
	    	context.event.entityedite({
	    		entitys: []
            })
            
            let entity = context.hasEntity(wayId);
            context.buriedStatistics().merge(0,entity.modelName);

            context.enter(iD.modes.Select(context, [wayId])
                .suppressMenu(true)
                .newFeature(true));
        }

        function undone() {
            context.buriedStatistics().merge(0,way.modelName);
            context.enter(iD.modes.Browse(context));
        }
        
        function mousedown(){
        	isdown = true;
        }

        context.surface()
            .on('mousedown.rotate-way', mousedown)
            .on('mousemove.rotate-way', rotate)
            .on('click.rotate-way', finish);

        context.history()
            .on('undone.rotate-way', undone);

        keybinding
            .on('⎋', cancel)
            .on('↩', finish);

        d3.select(document)
            .call(keybinding);
    };

    mode.exit = function() {
        context.uninstall(edit);

        context.surface()
            .on('mousedown.rotate-way', null)
            .on('mousemove.rotate-way', null)
            .on('click.rotate-way', null);

        context.history()
            .on('undone.rotate-way', null);

        keybinding.off();
    };

    return mode;
};
