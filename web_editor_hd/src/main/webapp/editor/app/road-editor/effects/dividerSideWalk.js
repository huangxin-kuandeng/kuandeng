iD.effects = iD.effects||{};
/**
 * 为当前选中的DIVIDER，与人行道关联关系高亮显示
 * R_DIVIDER_TL的Relation
 * @param {Object} context
 */
iD.effects.DividerSideWalk = function(context) {
	var heilights = [];
    var effect = {
        id: 'divider-sidewalk',
        button: 'dividersidewalk',
        title: t('effects.dividerSideWalk.title'),
        iconText: 'DO',
        description: t('effects.dividerSideWalk.description'),
        key: 'Shift+S',
        // 是否开启的状态
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this;
        	self.enable = open == null ? false : open;
            heilights = [];
        	
        	var graph = context.graph();
        	var selectedids = selectedids || context.selectedIDs();
        	if(!self.enable || selectedids.length != 1){
        		refreshMap();
        		return ;
        	}
        	var divider = context.hasEntity(selectedids[0]);
        	if(!divider){
                refreshMap();
        		return ;
        	}
        	if(divider.modelName == iD.data.DataType.DIVIDER || divider.modelName == iD.data.DataType.OBJECT_PL) {


                var dividerRelations = graph.parentRelations(divider, iD.data.DataType.R_DIVIDER_OPL);
                // 没有关系
                if (dividerRelations.length == 0) {
                    refreshMap();
                    return;
                }

                // 获取当前车道关联的人行道
                context.surface().selectAll('.selected').classed('selected', false);
                for (let idx in dividerRelations) {
                    let rel = dividerRelations[idx];

                    for (let i in rel.members) {
                    	let dv = context.hasEntity(rel.members[i].id);
                    	if(!dv) continue;
                        //if (!dv || dv.id == divider.id) {
                        var index = -1;
                    	index = _.findIndex(heilights, function (entityId) {
                    	    return context.hasEntity(entityId.split('.')[1]).id === dv.id;
                    	});
                        if (index == -1) {
                            heilights.push('.' + dv.id);
                        }
                        continue;
                        //}
                        // 获取相关交通灯
                    }
                }
                //高亮显示所有关系--Tilden
                context.surface().selectAll(heilights).classed('selected', true);

            } else {
                refreshMap();
                return ;
			}
        }
    };

    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }
    
    // 选中divider
    context.event.on('selected.effect-dividerSideWalk', function(selectedEntities){
    	effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
    });

    context.map().on('drawn.effect-dividerSideWalk', function(param){
        // full 为true时代表拖拽、缩放等操作触发的drawn
        if(!param.full){
            return ;
        }

        if(!effect.enable){
            return ;
        }
        //高亮显示所有关系--Tilden
		if (heilights.length) {
            context.surface().selectAll(heilights).classed('selected', true);
        }
    });
    
    return effect;
};