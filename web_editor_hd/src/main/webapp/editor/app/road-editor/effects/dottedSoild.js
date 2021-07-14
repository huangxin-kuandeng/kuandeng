/**
 * 是否显示虚线连接线
 * 默认为展示，点击按钮后变为显示连接线
 * @param {Object} context
 */
iD.effects.DottedSoild = function(context) {
    var effect = {
        id: 'dottedsoild',
        button: 'dottedsoild',
        title: t('effects.dottedsoild.title'),
        iconText: 'DS',
        description: t('effects.dottedsoild.description'),
        key: 'Shift+D',
        // 是否开启的状态
        enable: false,
        apply: function(context, open, isUpdate = true) {
            var self = this;
            self.enable = open == null ? false : open;
            context.variable.isDottedSoild = self.enable;
            isUpdate && refreshMap();
        }
    };

    function refreshMap() {
        //重新渲染地图
        context.map().dimensions(context.map().dimensions());
    }
    return effect;
};