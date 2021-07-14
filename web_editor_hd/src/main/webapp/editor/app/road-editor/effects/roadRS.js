/*
 * @Author: tao.w
 * @Date: 2020-02-19 16:05:54
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-26 17:05:09
 * @Description: 高亮  路牌和道路
 */

iD.effects = iD.effects||{};
 
iD.effects.RoadRS = function(context) {
    var effect = {
        id: 'road-rs',
        button: 'roadrs',
        title: t('effects.roadRS.title'),
        iconText: 'RS',
        oldEntity:null,
        description: t('effects.roadRS.description'),
        key: 'Shift+L',
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this;
        	self.enable = open == null ? false : open;
            // heilights = [];
        	
        	var selectedids = selectedids || context.selectedIDs();
            
            if(selectedids.length == 0){
                context.variable.heilights.length = 0;
                this.oldEntity = null;
        		refreshMap();
        		return ;
            }
            
        	var road = context.hasEntity(selectedids[0]);
        	if(!road){
                refreshMap();
        		return ;
            }

            if(this.oldEntity){
                show(this.oldEntity, false);
            }
            
            this.oldEntity = road;

        	if(road.modelName == iD.data.DataType.ROAD || road.modelName == iD.data.DataType.TRAFFICSIGN) {
                show(road, self.enable);
            } else if (!self.enable) {
                refreshMap();
                context.surface().selectAll('.selected').classed('selected', false);
                return ;
			}
        }
    };

    function show(road, enable) {
        var graph = context.graph();
        var roadRelations = graph.parentRelations(road, iD.data.DataType.R_SIGN_ROAD);
                // 没有关系
                if (roadRelations.length == 0) {
                    // refreshMap();
                    return;
                }
                context.surface().selectAll('.selected').classed('selected', false);

                for (let idx in roadRelations) {
                    let rel = roadRelations[idx];

                    for (let i in rel.members) {
                    	let dv = context.hasEntity(rel.members[i].id);
                    	if(!dv) continue;
                        var index = -1;
                    	index = _.findIndex(context.variable.heilights, function (entityId) {
                    	    return context.hasEntity(entityId.split('.')[1]).id === dv.id;
                        });
                        
                        if (index == -1) {
                            context.variable.heilights.push('.' + dv.id);
                        }
                        
                        if(!enable){
                            context.variable.heilights.splice(index, 1);
                        }
                        continue;
                    }
                }
                
                if (context.variable.heilights.length) {
                    context.surface().selectAll(context.variable.heilights).classed('selected', true);
                }

    }

    function refreshMap(){
    	//重新渲染地图
    	context.map().dimensions(context.map().dimensions());
    }
    
    // 选中road
    context.event.on('selected.effect-roadRS', function(selectedEntities){
    	effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
    });

    context.map().on('drawn.effect-roadRS', function(param){
        // full 为true时代表拖拽、缩放等操作触发的drawn
        if(!param.full){
            return ;
        }

        if(!effect.enable){
            return ;
        }
		if (context.variable.heilights.length) {
            context.surface().selectAll(context.variable.heilights).classed('selected', true);
        }
    });
    
    return effect;
};