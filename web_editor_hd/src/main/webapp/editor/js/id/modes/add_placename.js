/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-25 17:02:01
 * @Description: 
 */
/**
 * Created by  on 2015/8/20.
 * 创建路名信息模式
 */
iD.modes.AddPlacename = function (context) {
    var mode = {
        id: 'add-placename',
        button: 'placename',
        title: t('modes.add_placename.title'),
        description: t('modes.add_placename.description'),
        key: 'Ctrl+B',
        enable: true
    };

    var behavior = iD.behavior.DrawPlacename(context)
        .tail(t('modes.add_placename.tail'))
        //.on('click', add)
        .on('clickWay', addWay)
        //.on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    function add(loc, datum) {
        //var loc = context.map().mouseCoordinates();
        // var layer = iD.Layers.getCurrentEnableLayer(), layerId = layer.id;
        var layer = iD.Layers.getLayer(), layerId = layer.id;
        var chnName;
        if (datum.modelName == iD.data.DataType.HIGHWAY) {
            chnName = datum.tags.name_chn;
        }


        var node = iD.Node({
            _type: 'placename',
            modelName: iD.data.DataType.PLACENAME,
            tags: {
                name_chn: chnName,
                x_coord:loc[0].toString(),
                y_coord:loc[1].toString()
            },
            //name_chn: "我是测试道路"},
            identifier:layer.identifier,
            loc: loc,
            layerId: layerId
        });


        context.perform(
            iD.actions.AddEntity(node),
            t('modes.add_placename.annotation'));

        context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));

        // add way envent
        context.event.add({'type': 'placename', 'entity': node});
        /*
         //需求变更为道路名称为空时可以创建地名信息
         if(!(chnName.length == 0)){
         }else{
         alert("道路中文名为空，不能创建地名信息！！");
         }*/

        context.buriedStatistics().merge(0,iD.data.DataType.PLACENAME);
        if (layer.continues) context.enter(iD.modes.Browse(context));
        // if (layer.continues) context.enter(iD.modes.AddPlacename(context));
    }

    function addWay(loc, datum) {
        add(loc, datum);
    }

    function addNode(node) {
        add(node.loc);
    }

    function cancel() {
        context.enter(iD.modes.Browse(context));
    }

    mode.enter = function () {
        context.buriedStatistics().merge(1,iD.data.DataType.PLACENAME);
        //d3.select('.add-road').classed('active', false);
        //d3.select('.'+this.id).classed('active', true);
        context.install(behavior);
    };

    mode.exit = function () {
        context.uninstall(behavior);
    };

    return mode;
};

