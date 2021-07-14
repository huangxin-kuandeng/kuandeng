iD.effects = iD.effects||{};
/**
 * 定位目标（面区域）首点高亮显示特效
 */
iD.effects.objectPGFirstPoint = function(context) {
    var effect = {
        id: 'location-target-first',
        button: 'objectPGFirstPoint',
        title: t('effects.objectPGFirstPoint.title'),
        iconText: 'PG',
        description: t('effects.objectPGFirstPoint.description'),
        key: 'Shift+P',
        // 是否开启的状态
        enable: false,
        apply:function(context, open, isUpdate=true) {
            var self = this;
            self.enable = open == null ? false : open;

            context.variable.showObjectPGPoint = false;
            if(self.enable){
                context.variable.showObjectPGPoint = true;
            }

            //重新渲染地图
            if (isUpdate) {
                context.map().dimensions(context.map().dimensions());
            }
        }
    };

    return effect;
};
