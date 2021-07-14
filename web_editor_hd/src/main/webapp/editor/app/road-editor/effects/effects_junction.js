/*
 * @Author: tao.w
 * @Date: 2019-08-28 14:34:43
 * @LastEditors: kanhognyu
 * @LastEditTime: 2019-08-29 21:44:20
 * @Description:  复杂路口特效，选择元素为junction时， 高亮显示复杂路口关系中的所有车道线
 */

iD.effects = iD.effects || {};

iD.effects.junction = function (context) {
    var heilights = [];
    
    var effect = {
        id: 'junction-highlight',
        button: 'junctionlight',
        title: t('effects.junctionlight.title'),
        iconText: 'EJ',
        description: t('effects.junctionlight.description'),
        key: 'Shift+E',
        // 是否开启的状态
        enable: false,
        apply:function(context, open, selectedids){
        	var self = this;
            self.enable = open == null ? false : open;
            var oldLen = heilights.length;
            heilights = [];
            
            if(!self.enable) {
                offEvent();
                oldLen && context.surface().selectAll('.selected').classed('selected', false);
                return ;
            }
            initEvent();
            
        	selectedids = selectedids || context.selectedIDs();
            if(selectedids.length > 1) return ;
            var entity = context.hasEntity(selectedids[0]);
            if(!entity || entity.modelName != iD.data.DataType.JUNCTION){
                return ;
            }
            // R_DIVIDER_JUNCTION
            var relations = context.graph().parentRelations(entity, iD.data.DataType.R_DIVIDER_JUNCTION);
            if(!relations.length) return ;

            // 复杂路口关联高亮
            context.surface().selectAll('.selected').classed('selected', false);
            for (let idx in relations) {
                let rel = relations[idx];
                (rel.members || []).forEach(function(m){
                    let et = context.hasEntity(m.id);
                    if(!et) return ;
                    heilights.push('.' + et.id);
                });
            }
            if(heilights){
                context.surface().selectAll(heilights).classed('selected', true);
            }
        }
    };

    function initEvent(){
        // 选中junction
        context.event.on('selected.effect-junction', function(selectedEntities){
            effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
        });

        context.map().on('drawn.effect-junction', function(param){
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
    }

    function offEvent(){
        context.event.on('selected.effect-junction', null);
        context.map().on('drawn.effect-junction', null);
    }

    return effect;
};
