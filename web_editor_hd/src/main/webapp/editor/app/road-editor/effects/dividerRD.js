/*
 * @Author: tao.w
 * @Date: 2020-02-19 16:05:54
 * @LastEditors: tao.w
 * @LastEditTime: 2020-06-03 14:31:33
 * @Description: 
 */

iD.effects = iD.effects || {};

/**
 * @description: 高亮道路和车道线
 * @param {type} 
 * @return: 
 */
iD.effects.DividerRD = function (context) {
    // var heilights = [];
    var effect = {
        id: 'divider-rd',
        button: 'dividerrd',
        title: t('effects.dividerRD.title'),
        iconText: 'RD',
        description: t('effects.dividerRD.description'),
        key: 'Shift+L',
        // 是否开启的状态R_ROAD_DIVIDER
        enable: false,
        apply: function (context, open, selectedids) {
            var self = this;
            self.enable = open == null ? false : open;

            var selectedids = selectedids || context.selectedIDs();
            if (self.enable) {
                context.variable.heilights.length = 0;
                context.surface().selectAll('.selected').classed('selected', false);
            }
            var entity = context.hasEntity(selectedids[0]);
            if (selectedids.length == 0) {
                // context.variable.heilights.length = 0;
                refreshMap();
                return;
            }

            if (entity.modelName == iD.data.DataType.DIVIDER || entity.modelName == iD.data.DataType.ROAD) {
                show(entity, self.enable);
            } else if (!self.enable) {
                refreshMap();
                context.surface().selectAll('.selected').classed('selected', false);
                return;
            }
        }
    };

    function show(entity, enable) {
        var graph = context.graph();
        var dividerRelations = graph.parentRelations(entity, iD.data.DataType.R_ROAD_DIVIDER);
        // 没有关系
        if (dividerRelations.length == 0) {
            refreshMap();
            return;
        }
        // if(entity.modelName == iD.data.DataType.ROAD){
        for (let idx in dividerRelations) {
            let rel = dividerRelations[idx];

            for (let i in rel.members) {
                let dv = context.hasEntity(rel.members[i].id);
                if (!dv) continue;
                if(entity.modelName == iD.data.DataType.DIVIDER && (dv.modelName == entity.modelName && dv.id != entity.id)) continue;
                var index = -1;
                index = _.findIndex(context.variable.heilights, function (entityId) {
                    return context.hasEntity(entityId.split('.')[1]).id === dv.id;
                });

                if (index == -1) {
                    context.variable.heilights.push('.' + dv.id);
                }

                if (!enable) {
                    context.variable.heilights.splice(index, 1);
                }
                continue;
            }
        }
        // }else {

        // }



        if (context.variable.heilights.length) {
            context.surface().selectAll(context.variable.heilights).classed('selected', true);
        }

    }

    function refreshMap() {
        //重新渲染地图
        context.map().dimensions(context.map().dimensions());
    }

    // 选中divider
    context.event.on('selected.effect-dividerRD', function (selectedEntities) {
        effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
    });

    context.map().on('drawn.effect-dividerRD', function (param) {
        // full 为true时代表拖拽、缩放等操作触发的drawn
        if (!param.full) {
            return;
        }

        if (!effect.enable) {
            return;
        }
        if (context.variable.heilights.length) {
            context.surface().selectAll(context.variable.heilights).classed('selected', true);
        }
    });

    return effect;
};