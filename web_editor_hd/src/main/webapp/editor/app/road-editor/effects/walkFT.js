/**
 * Created by wt on 2015/11/19.
 */
iD.effects = iD.effects || {};
iD.effects.WalkFT = function (context) {

    var effect = {
        id: 'walkFT',
        button: 'walkFT',
        title: '',
        description: t('effects.walkFT.description'),
        key: 'Shift+V',
        apply: function (context) {
            iD.WalkLinkDirection.changeWalkLinkDirection();
            //重新渲染地图
            context.map().dimensions(context.map().dimensions());
        }
    };

    return effect;
};
