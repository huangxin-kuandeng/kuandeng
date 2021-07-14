/**
 * Created by wt on 2015/8/3.
 */
iD.topo.RoadRule=function(){

    topoRoadRule = {};

    /*道路打断roadRule维护 */
    topoRoadRule.roadMerge = function (graph, way, wayA, wayB, rel){
        var roadMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);       // 根据role为road获取对应的道路member成员
        if(roadMember&&(roadMember.id ==wayA.id||roadMember.id ==wayB.id)){
            roadMember.id = way.id;
        }
        rel = rel.updateMember(roadMember, member.index);
        return graph.replace(rel);
    };
    /*道路打断roadRule维护 */
    topoRoadRule.break = function (context,graph, way, wayA, wayB, rel){
        var roadMember = rel.memberByRole(iD.data.RoleType.ROAD_ID);       // 根据role为road获取对应的道路member成员
        if(roadMember&&(roadMember.id ==way.id)){
            roadMember.id = wayA.id;
        }
        rel = rel.updateMember(roadMember, 0);
        graph = graph.replace(rel);

        graph = topoRoadRule.createNewRoadRule(graph,wayB.id);
        return graph;
    };

    topoRoadRule.topoSplit = function(graph, entityA, entityB, way){
        return graph;
    };

    topoRoadRule.createNewRoadRule = function(graph, wayId){
        // var roadRuleMember = [{'id': wayId,  'role': "road",'type': "Highway"}];
        // var roadRuleRelation = iD.Relation({
        //     tags: {'datatype': iD.data.DataType.ROADRULE},
        //     members: roadRuleMember
        // });
        // graph = graph.replace(roadRuleRelation);
        return graph;
    };

    return topoRoadRule;
}