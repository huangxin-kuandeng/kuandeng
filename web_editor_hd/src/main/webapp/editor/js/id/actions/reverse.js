/*
 * @Author: tao.w
 * @Date: 2018-12-17 11:23:44
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-05 15:46:24
 * @Description: 
 */
/*
  Order the nodes of a way in reverse order and reverse any direction dependent tags
  other than `oneway`. (We assume that correcting a backwards oneway is the primary
  reason for reversing a way.)

  The following transforms are performed:

    Keys:
          *:right=* ⟺ *:left=*
        *:forward=* ⟺ *:backward=*
       direction=up ⟺ direction=down
         incline=up ⟺ incline=down
            *=right ⟺ *=left

    Relation members:
       role=forward ⟺ role=backward
         role=north ⟺ role=south
          role=east ⟺ role=west

   In addition, numeric-valued `incline` tags are negated.

   The JOSM implementation was used as a guide, but transformations that were of unclear benefit
   or adjusted tags that don't seem to be used in practice were omitted.

   References:
      http://wiki.openstreetmap.org/wiki/Forward_%26_backward,_left_%26_right
      http://wiki.openstreetmap.org/wiki/Key:direction#Steps
      http://wiki.openstreetmap.org/wiki/Key:incline
      http://wiki.openstreetmap.org/wiki/Route#Members
      http://josm.openstreetmap.de/browser/josm/trunk/src/org/openstreetmap/josm/corrector/ReverseWayTagCorrector.java
 */
iD.actions.Reverse = function (wayId) {
    // var replacements = [
    //     [/:right$/, ':left'], [/:left$/, ':right'],
    //     [/:forward$/, ':backward'], [/:backward$/, ':forward']
    // ],
    //     numeric = /^([+\-]?)(?=[\d.])/,
    //     roleReversals = {
    //         forward: 'backward',
    //         backward: 'forward',
    //         north: 'south',
    //         south: 'north',
    //         east: 'west',
    //         west: 'east'
    //     };

    // function reverseKey(key) {
    //     for (var i = 0; i < replacements.length; ++i) {
    //         var replacement = replacements[i];
    //         if (replacement[0].test(key)) {
    //             return key.replace(replacement[0], replacement[1]);
    //         }
    //     }
    //     return key;
    // }

    // function reverseValue(key, value) {
    //     if (key === 'incline' && numeric.test(value)) {
    //         return value.replace(numeric, function (_, sign) { return sign === '-' ? '' : '-'; });
    //     } else if (key === 'incline' || key === 'direction') {
    //         return { up: 'down', down: 'up' }[value] || value;
    //     } else {
    //         return { left: 'right', right: 'left' }[value] || value;
    //     }
    // }

    return function (graph) {
        var way = graph.entity(wayId),
            nodes = way.nodes.slice().reverse();
        // tags = {}, key, role;

        // for (key in way.tags) {
        //     tags[reverseKey(key)] = reverseValue(key, way.tags[key]);
        // }
        // let nodeIds = graph.childNodes(way);
        let firstId = nodes[0],
            lastId = _.last(nodes);
        graph.parentRelations(way).forEach(function (relation) {
            if ([iD.data.DataType.R_BARRIER_DIVIDER, iD.data.DataType.R_BARRIER_BREF].includes(relation.modelName)) {
                graph = iD.actions.DeleteRelation(relation.id)(graph);
            }
            if (way.modelName == iD.data.DataType.DIVIDER && relation.modelName == iD.data.DataType.DIVIDER_ATTRIBUTE) {
                let role = relation.memberById(lastId);
                if(role){
                    relation = relation.updateMember({
                        id: firstId
                    }, role.index);
                    relation = relation.mergeTags(iD.util.tagExtend.updateTaskTag(relation));
                    graph = graph.replace(relation);
                }
                // relation.members.forEach(function (member, index) {
                //     if (member.id === lastId) {
                        // relation = relation.updateMember({
                        //     id: firstId
                        // }, index);
                        // relation = relation.mergeTags(iD.util.tagExtend.updateTaskTag(relation));
                        // graph = graph.replace(relation);
                //     }
                // });
            }

        });

        return graph.replace(way.update({
            nodes: nodes
        }));
    };
};