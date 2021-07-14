/*
 * @Author: tao.w
 * @Date: 2020-04-09 14:01:50
 * @LastEditors: tao.w
 * @LastEditTime: 2020-07-22 17:59:28
 * @Description:  生成导流带 面数据
 */

iD.operations.diversionSurfaceCreate = function (selectedIDs, context) {
    let entitys = [];

    let nodeModelNames = [iD.data.DataType.DIVIDER_NODE, iD.data.DataType.OBJECT_PL_NODE,iD.data.DataType.BARRIER_GEOMETRY_NODE];

    function getPointCollection(nodes) {
        let obj = {}, node;
        let graph = context.graph();
        for (let i = 0; i < nodes.length; i++) {
            node = nodes[i];
            let ways = graph.parentWays(node);
            for (let j = 0; j < ways.length; j++) {
                let way = ways[j];
                let idx = way.nodes.indexOf(node.id);
                if(obj.hasOwnProperty(way.id)){
                    obj[way.id].push(idx);
                }else{
                    obj[way.id] =[idx];
                }
            }
        }
        let locs = [];
        _.forEach(obj, (v,k)=>{
            v.sort(function (a, b) { 
                return a - b;
            });
            let way = context.hasEntity(k);
            let nodes = context.childNodes(way);
            let splitNodes = nodes.slice(v[0],v[v.length-1]+1);
            let _l = _.pluck(splitNodes,'loc');
            locs.push(..._l)
        })
        return locs;
    }

    var operation = function () {
        let locs = _.pluck(entitys, 'loc');
        let p = [],
            actions = [];
        let  _temp = getPointCollection(entitys);
        _temp.forEach(d => {
            p.push(turf.point(d));
        })
        var points = turf.featureCollection(p);
        var options = { units: 'meters', maxEdge: 300};

        var hull = turf.concave(points, options);
        if (!hull || !hull.geometry.coordinates.length || hull.geometry.coordinates[0].length < 4) {
            console.log('生成失败');
            return ;
        }
        var graph = context.graph();
        let newLocs = hull.geometry.coordinates[0];

        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG);
        let way = iD.Way({
            identifier: wayLayer.identifier,
            layerId: wayLayer.id,
            modelName: iD.data.DataType.OBJECT_PG
        });
        way.setTags(iD.util.getDefauteTags(way, wayLayer));
        way = way.mergeTags(
            {
                SUBTYPE: "9",
                TYPE: "3"
            }
        )
        actions.push(iD.actions.AddEntity(way));
        let fristNode;
        newLocs.forEach((d, i) => {
        let node = iD.Node({
                loc: d,
                layerId: wayLayer.id,
                identifier: wayLayer.identifier,
                modelName: iD.data.DataType.OBJECT_PG_NODE
            });
            node.setTags(iD.util.getDefauteTags(node, wayLayer));
            if (i == 0) {
                fristNode = node;
            }
            actions.push(iD.actions.AddEntity(node));
            actions.push(iD.actions.AddVertex(way.id, node.id));
        })
        actions.push(iD.actions.AddVertex(way.id, fristNode.id));

        if (actions.length) {
            actions.push(t('operations.diversionSurfaceCreate.title'));
            context.perform.apply(context, actions);
        }
        updatePicplayer(way);

        context.enter(iD.modes.Browse(context));
    };

    function updatePicplayer(way){
        if(way){
            var nodes = way.nodes;
            context.event.entityedite({
                entitys: [way.id],
                acceptids: [way.id].concat(nodes)
            });
        }else {
            context.event.entityedite({});
        }
    }
    operation.available = function () {
        if (selectedIDs.length < 3) return false;
        entitys.length = 0;
        let layer, entity;
		
        var wayLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.OBJECT_PG);
		if (!wayLayer) return false;
		
        for (let i = 0; i < selectedIDs.length; i++) {
            entity = context.hasEntity(selectedIDs[i]);
            if (!nodeModelNames.includes(entity.modelName)) return false;
            layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if (!layer.editable) return false;
            entitys.push(entity);
        }
        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.diversionSurfaceCreate.description');
    };

    operation.id = 'diversionSurfaceCreate';
    operation.keys = [iD.ui.cmd('L')];
    operation.title = t('operations.diversionSurfaceCreate.title');

    return operation;
};