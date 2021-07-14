/*
 * @Author: tao.w
 * @Date: 2020-02-19 16:05:54
 * @LastEditors: tao.w
 * @LastEditTime: 2020-05-15 15:06:22
 * @Description: 
 */

iD.effects = iD.effects||{};

/**
 * @description: 高亮与定位灯杆的车道线
 * @param {type} 
 * @return: 
 */
iD.effects.DividerRT = function(context) {
	// var heilights = [];
    var effect = {
        id: 'divider-rt',
        button: 'dividerrt',
        title: t('effects.dividerRT.title'),
        iconText: 'RT',
        description: t('effects.dividerRT.description'),
        key: 'Shift+L',
        oldEntity:null,
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
            
        	var divider = context.hasEntity(selectedids[0]);
        	if(!divider){
                refreshMap();
        		return ;
            }

            if(this.oldEntity){
                show(this.oldEntity, false);
            }
            
            this.oldEntity = divider;

            // let _d = selectedids.filter(d=>{ return  context.hasEntity(d).modelName == iD.data.DataType.DIVIDER});
            // let flag = true;
            // if(_d){
            //     let hl = context.variable.heilights.find(d=>{ return d == '.'+_d });
            //     if(!hl) flag = false;
            // }
            // if(!_d || !flag){
            //     context.variable.heilights.length = 0;
            // }

        	if(divider.modelName == iD.data.DataType.DIVIDER || divider.modelName == iD.data.DataType.OBJECT_PT) {
                show(divider, self.enable);
            }  else if (!self.enable) {
                refreshMap();
                context.surface().selectAll('.selected').classed('selected', false);
                // for (var i in context.variable.effectBtns) {
                 //   if (context.variable.effectBtns[this.iconText])
                 //       show(divider);
                // }
                return ;
			}
        }
    };

    function show(divider, enable){
        var graph = context.graph();
        var dividerRelations = graph.parentRelations(divider, iD.data.DataType.R_DIVIDER_OPT);
                // 没有关系
                if (dividerRelations.length == 0) {
                    // refreshMap();
                    return;
                }

                // if (divider.modelName == iD.data.DataType.OBJECT_PT) {
                //     context.variable.heilights = [];
                // }

                
                context.surface().selectAll('.selected').classed('selected', false);
                for (let idx in dividerRelations) {
                    let rel = dividerRelations[idx];

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
    
    // 选中divider
    context.event.on('selected.effect-dividerRT', function(selectedEntities){
    	effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
    });

    context.map().on('drawn.effect-dividerRT', function(param){
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