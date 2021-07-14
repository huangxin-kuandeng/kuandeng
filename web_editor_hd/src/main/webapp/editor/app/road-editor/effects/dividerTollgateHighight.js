iD.effects = iD.effects||{};
/**
 * 收费站车道线特效展示
 * @param {Object} context
 */
iD.effects.dividerTollgateHiglight = function(context) {
	var heilights = [];
    var effect = {
        id: 'divider-tollgate-highlight',
        button: 'dividerTollgateHiglight',
        title: t('effects.dividerTollgateHiglight.title'),
        iconText: 'DT',
        description: t('effects.dividerTollgateHiglight.description'),
        key: 'Shift+T',
        // 是否开启的状态
        enable: false,
        apply:function(context, open, selectedids){
			var self = this;
        	self.enable = open == null ? false : open;
            heilights = [];
        	var dividerName = iD.data.DataType.DIVIDER;
			var selectedids = selectedids || context.selectedIDs();
			var graph = context.graph();
        	if(!self.enable || selectedids.length != 1){
        		refreshMap();
        		return ;
			}
			var divider = context.hasEntity(selectedids[0]);
        	if(!divider || divider.modelName != dividerName){
                refreshMap();
        		return ;
			}
			
			var tollgateRelations = graph.parentRelations(divider, iD.data.DataType.TOLLGATE);
			// 没有DT的关系
			if (tollgateRelations.length == 0) {
				refreshMap();
				return;
			}

			context.surface().selectAll('.selected').classed('selected', false);

			for (let idx in tollgateRelations) {
				let rel = tollgateRelations[idx];

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
				}
			}
			//高亮显示所有关系--Tilden
			context.surface().selectAll(heilights).classed('selected', true);

        }
	};

	function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }

	// 选中divider
    context.event.on('selected.effect-DT', function(selectedEntities){
    	effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
	});
	
	context.map().on('drawn.effect-DT', function(param){
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
