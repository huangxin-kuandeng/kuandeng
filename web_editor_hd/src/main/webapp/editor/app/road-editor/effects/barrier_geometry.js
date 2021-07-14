/*
 * @Author: tao.w
 * @Date: 2019-12-23 19:31:32
 * @LastEditors  : tao.w
 * @LastEditTime : 2020-01-14 18:20:47
 * @Description: 
 */
iD.effects = iD.effects || {};
/**
 * @description: barrerGeometry 特效， 开启线宽渲染7.5厘米
 * @param {type} 
 * @return: 
 */
iD.effects.barrerGeometry = function (context) {
    var effect = {
        id: 'barrerGeometry-effects',
        button: 'dividertl',
        title: t('effects.barrier_geometry.title'),
        iconText: 'BL',
        description: t('effects.barrier_geometry.description'),
        key: 'Shift+L',
        // 是否开启的状态
        enable: false,
        apply: function (context, open, selectedids) {
            var self = this;
            self.enable = open == null ? false : open;
            heilights = [];

            refreshPotree(self.enable);
        }
    };

    function refreshPotree(eb) {
        if (!context.potreePlayer) return;
        let lineWidth = 0.01;
        let lineType = 0;
        if(eb){
            lineType = 1;
            lineWidth = 0.075;
        }
        context.variable.barrierWidth = lineWidth;
        let measurements = editor.context.potreePlayer.viewer.scene.measurements;
        let bridegs = [];
        for (let i = 0; i < measurements.length; i++) {
            let mea = measurements[i];
            if(mea.modelName == iD.data.DataType.BARRIER_GEOMETRY) {
                mea.lineWidth = lineWidth;
                if(mea.lineType != lineType){
                    mea.lineType = lineType;
                    mea._render = true;
                }
            }
        }
        context.potreePlayer.viewer.isMeasureRender = true;
    }


    return effect;
};