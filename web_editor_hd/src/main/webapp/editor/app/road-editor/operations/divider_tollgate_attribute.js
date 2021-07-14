/**
 * 收费站属性信息
 */
iD.operations.dividerTollgateAttribute = function(selectedIDs, context) {
    var relationName = iD.data.DataType.TOLLGATE;
    var wayModelName = iD.data.DataType.DIVIDER;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var ways = [], resId = '', isEditor = true;

    var operation = function() {
        if (resId) {
            var graph = editor.context.graph();
            var res = graph.entities[resId];
            iD.ui.openTollgateDialog(context, res, {
                title: this.innerText,
                isEditor: isEditor
            });
        }
    };

    operation.available = function() {
        if (selectedIDs.length < 1) return false;
        

        var graph = context.graph(),
            layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName == wayModelName) {
                var rels = graph.parentRelations(entity, relationName);
                if(!rels || !rels.length) return false;
                else resId = rels[0].id;
                
                ways.push(entity);
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            } else {
                return false;
            }
            if (entity.tags.TOLLFLAG != '1') {
                return false;
            }
        }
        // if (ways.length < 2) return false;
        if (!layer || !layer.editable) {
            isEditor = false;
        }

        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.divider_tollgate_attribute.description');
    };

    operation.id = 'bridge-point';
    operation.keys = ['none'];
    operation.title = t('operations.divider_tollgate_attribute.title');

    return operation;
};