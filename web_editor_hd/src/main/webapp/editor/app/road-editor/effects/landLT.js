/*
 * @Author: tao.w
 * @Date: 2020-02-19 16:05:54
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-08 10:49:35
 * @Description: 高亮Traffic Light与lane的关联关系
 */

iD.effects = iD.effects || {};

iD.effects.LaneLT = function (context) {

    var effect = {
        id: 'lane-lt',
        button: 'lanelt',
        title: t('effects.laneLT.title'),
        iconText: 'TL',
        description: t('effects.laneLT.description'),
        key: 'Shift+L',
        oldEntity: null,
        enable: false,
        apply: function (context, open, selectedids) {
            var self = this;
            self.enable = open == null ? false : open;

            var selectedids = selectedids || context.selectedIDs();

            if (selectedids.length == 0) {
                context.variable.heilights.length = 0;
                this.oldEntity = null;
                refreshMap();
                return;
            }

            var divider = context.hasEntity(selectedids[0]);
            if (!divider) {
                refreshMap();
                return;
            }

            if (this.oldEntity) {
                show(this.oldEntity, false);
            }

            this.oldEntity = divider;


            if (divider.modelName == iD.data.DataType.TRAFFICLIGHT || divider.modelName == iD.data.DataType.HD_LANE) {
                show(divider, self.enable);
            } else if (!self.enable) {
                refreshMap();
                context.surface().selectAll('.selected').classed('selected', false);
                return;
            }
        }
    };

    function show(divider, enable) {
        var graph = context.graph();
        var dividerRelations = graph.parentRelations(divider, iD.data.DataType.R_TL_LANE);
        // 没有关系
        if (dividerRelations.length == 0) {
            // refreshMap();
            return;
        }

        context.surface().selectAll('.selected').classed('selected', false);
        for (let idx in dividerRelations) {
            let rel = dividerRelations[idx];

            for (let i in rel.members) {
                let dv = context.hasEntity(rel.members[i].id);
                if (!dv) continue;
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
        if (context.variable.heilights.length) {
            context.surface().selectAll(context.variable.heilights).classed('selected', true);
        }
    }
    function refreshMap() {
        //重新渲染地图
        context.map().dimensions(context.map().dimensions());
    }

    // 选中divider
    context.event.on('selected.effect-lanelt', function (selectedEntities) {
        effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
    });

    context.map().on('drawn.effect-lanelt', function (param) {
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