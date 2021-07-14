iD.operations.RawPosition = function(selectedIDs, context) {
    var operation = function() {
        context.temp().rawposition = selectedIDs;
        context.event.changemap();
    };

    operation.available = function() {
return false;
        // var layers = iD.Layers, layer = layers.getCurrentEnableLayer();
        var layers = iD.Layers, layer = layers.getLayer();

        if (layer.isRoad()) return false;
        var entity = context.entity(selectedIDs[0]),
                lay = iD.Layers.getLayer(entity.layerId),
                modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        
        if (!lay || context.isRoadCross(entity)) return false;
        
        var parents = context.graph().parentWays(entity), isPlay = true;
        (layer.isRoad() || layer.isLine()) && parents.forEach(function (d, i) {
            if (d.first() === entity.id || d.last() === entity.id) isPlay = false;
        })
        if (!isPlay || entity.modelName === 'RoadNode') return false;

        var c = lay.origCoord, k = entity.tags;
        if(!c) return false;

        return modelConfig.editable && ( (c.length == 2 && k[c[0]] && k[c[1]]) || k[c] ) && !operation.disabled();

    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return  t('operations.rawposition.title');
    };

    operation.id = 'rawposition';
    operation.keys = [t('operations.rawposition.key')];
    operation.title = t('operations.rawposition.title');

    return operation;
};
