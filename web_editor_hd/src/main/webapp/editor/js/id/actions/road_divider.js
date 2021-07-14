/**
 * Created by wangtao on 2017/8/25.
 */
iD.actions.roadDivider = function (selectedIDs, context) {

    var action = function (graph) {

        // var members = [];
        let relation;
        let road;
        let dividers = [];
        for (let i = 0; i < selectedIDs.length; i++) {
            let entity = context.entity(selectedIDs[i]);
            if (entity.modelName == iD.data.DataType.DIVIDER) {
                dividers.push(selectedIDs[i]);
            } else if (entity.modelName == iD.data.DataType.ROAD) {
                road = entity;
            }
        }
        let relations = graph.parentRelations(road, iD.data.DataType.R_ROAD_DIVIDER);
        let layer = iD.Layers.getLayer(road.layerId);

        if (relations.length) {
            relation = relations[0];
            // members = relations[0].members;
        } else {
            relation = iD.Relation({
                modelName: iD.data.DataType.R_ROAD_DIVIDER,
                members: [],
                identifier: layer.identifier,
                tags: iD.util.getDefauteTags(iD.data.DataType.R_ROAD_DIVIDER, layer),
                layerId: layer.id
            });
            relation = relation.addMember({
                'id': road.id,
                'modelName': iD.data.DataType.ROAD,
                'role': iD.data.RoleType.ROAD_ID,
                'type': iD.data.GeomType.WAY
            });
            // graph = graph.replace(relation);

        }

        for (let i = 0; i < dividers.length; i++) {
            relation = relation.addMember({
                'id': dividers[i],
                'modelName': iD.data.DataType.DIVIDER,
                'role': iD.data.RoleType.DIVIDER_ID,
                'type': iD.data.GeomType.WAY
            })
            graph = graph.replace(relation);
        }
        // relation = relation.updateMember(members);
        relation.tags = iD.util.tagExtend.updateTaskTag(relation);
        graph = graph.replace(relation);
        return graph;
        // for (; i < len; i++) {
        //     entity = context.entity(selectedIDs[i]);
        //     modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        //     if (!modelConfig || !modelConfig.editable) {
        //         continue;
        //     }
        //     if (entity.modelName == iD.data.DataType.DIVIDER) {
        //         members.push({
        //             'id': entity.id,
        //             'modelName': iD.data.DataType.DIVIDER,
        //             'role': iD.data.RoleType.DIVIDER_ID,
        //             'type': iD.data.GeomType.WAY
        //         });
        //     } else if (entity.modelName == iD.data.DataType.ROAD) {
        //         members.push({
        //             'id': entity.id,
        //             'modelName': iD.data.DataType.ROAD,
        //             'role': iD.data.RoleType.ROAD_ID,
        //             'type': iD.data.GeomType.WAY
        //         });
        //     }
        // }
        // var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_ROAD_DIVIDER);

        // var relation = iD.Relation({
        //     modelName: iD.data.DataType.R_ROAD_DIVIDER,
        //     members: members,
        //     identifier: currentLayer.identifier,
        //     tags: iD.util.getDefauteTags(iD.data.DataType.R_ROAD_DIVIDER, currentLayer),
        //     layerId: currentLayer.id
        // });

        // graph = graph.replace(relation);
        // return graph;
    };

    action.disabled = function (graph) {
        var modelConfig, entity,
            // disabled = true,
            i = 0, len = selectedIDs.length;
        let roads = [], others = [];
        let dividers = [];
        let relations = [];
        for (; i < len; i++) {
            entity = context.entity(selectedIDs[i]);
            var layer = iD.Layers.getLayer(entity.layerId);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if (!modelConfig || !modelConfig.editable) {
                continue;
            }

            if (!layer.isModelEditable(iD.data.DataType.R_ROAD_DIVIDER)) {
                return 'exist_node';
            }

            if (entity.type === iD.data.GeomType.NODE) {
                return 'exist_node';
            }
            if (entity.modelName == iD.data.DataType.DIVIDER && entity.tags.R_LINE == 1) {
                dividers.push(selectedIDs[i]);
            } else if (entity.modelName == iD.data.DataType.ROAD) {
                roads.push(selectedIDs[i])
            } else {
                others.push(selectedIDs[i]);
            }
        }

        if (roads.length != 1) {
            return 'not_eligible';
        } else if (others.length > 0) {
            return 'exist_node';
        } else if (dividers.length == 0) {
            return 'not_eligible_length';
        }

        relations = graph.parentRelations(graph.entity(roads[0]), iD.data.DataType.R_ROAD_DIVIDER);
        for (relation of relations) {
            let isExist = false; //用于判断选择元素已存在关系，默认是已经存在关系

            for (let i = 0; i < dividers.length; i++) {
                isExist = relation.memberById(dividers[i]);
                if (isExist) break;
            }

            if (isExist) {
                return 'exist_relation';
            }
        }

    };
    return action;
};
