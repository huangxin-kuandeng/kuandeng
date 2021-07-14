iD.svg.TurnGuidance = function (projection, context) {
    var hightLightNodes = [], linkIdFlagSet = {}, $guidanceLayer;

    function getTurnGuidanceFromNode(firstWay, secondWay, nodeIdFlagSet, rel) {
        if (firstWay && secondWay) {
            var nodeId;
            if (firstWay.first() == secondWay.first() || firstWay.first() == secondWay.last()) {
                nodeId = firstWay.first();
            } else if (firstWay.last() == secondWay.first() || firstWay.last() == secondWay.last()) {
                nodeId = firstWay.last();
            }
            if (nodeId && !nodeIdFlagSet[nodeId]) {
                nodeIdFlagSet[nodeId] = 1;
                var topo = iD.TopoEntity();
                var crossNodeId = topo.isInCrossNode(context.graph(), nodeId);
                if (crossNodeId) {
                    nodeId = crossNodeId;
                }
                if (nodeId) {

                    var entity = context.graph().hasEntity(nodeId);

                    var obj = {
                        'id': entity.id,
                        'rid': rel.id,
                        'loc': entity.loc,
                        'v': rel.v + "_" + entity.id + "_" + entity.v
                    };
                    return obj;

                }
            }
        }
        return null;
    }

    function setHighLightData(rels) {
        linkIdFlagSet = {};
        var nodeIdFlagSet = {};
        hightLightNodes = [];
        for (var i = 0; i < rels.length; i++) {
            var rel = rels[i];
            var members = rel.members;
            if (members.length > 1) {
                var firstWay = context.hasEntity(members[0].id);
                var secondWay = context.hasEntity(members[1].id);
                var turnGuidanceFromNode = getTurnGuidanceFromNode(firstWay, secondWay, nodeIdFlagSet, rel);
                if (turnGuidanceFromNode) {
                    hightLightNodes.push(turnGuidanceFromNode);
                }
                for (var j = 0; j < members.length; j++) {
                    var member = members[j];
                    if (!linkIdFlagSet[member.id]) {
                        linkIdFlagSet[member.id] = 1;
                    }
                }
            }
        }
    }

    function drawTurnGuidance(surface, points, filter) {
        redrawDirection();

        setHighLightData(points);
        var layergroups = surface
            .select('.layer-lines')
            .selectAll('g.layergroup');

        var linegroup = layergroups
            .selectAll('g.linegroup.line-stroke');
        var lines = linegroup
            .selectAll('path').filter(filter);

        lines.forEach(function (pathWays) {
            if (pathWays.length > 0) {
                pathWays.forEach(function (path) {
                    if (linkIdFlagSet[d3.select(path).datum().id]) {
                        d3.select(path).classed('turn_guidance', true);
                    } else {
                        d3.select(path).classed('turn_guidance', false);
                    }
                })
            }
        })
        //if (!context.variable.TurnGuidanceVisible) {
        //    d3.selectAll('.layer-guidancevoice').selectAll('g').remove();
        //}
        var groups = surface.select('.layer-turnguidance').selectAll('g')
            .filter(filter)
            .data(hightLightNodes, iD.Entity.key);
        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point turnguidance ' + d.id;
            })
            .order()
        group.append('image')
            .attr('class', 'turn-guidance-icon')
            .attr('x', '-29')
            .attr('y', '-32')
            .attr('width', '20')
            .attr('height', '20')
            .attr('xlink:href', function () {
                return context.imagePath('../../app/road-editor/dist/img/effect/turn-guidance.svg');
            });
        groups.attr('transform', iD.svg.PointTransform(projection));
        groups.exit()
            .remove();
    }

    function isEffectOpen(){
        if (context.variable.TurnGuidanceVisible) {
            return true;
        }
        else{
            return false;
        }
    }

    drawTurnGuidance.filter = function (entities, limit) {
        if(!isEffectOpen()){
            return [];
        }
        else{
            var guidanceRels = [];
            var guidanceRelsFlag = {};
            if (!context.variable.TurnGuidanceVisible) {
                d3.selectAll('.layer-guidancevoice').selectAll('g').remove();
                return [];
            } else {
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    var rels = context.graph().parentRelations(entity);
                    for (var j = 0; j < rels.length; j++) {
                        var rel = rels[j];
                        // if (rel.modelName == iD.data.DataType.TURN_GUIDANCE&&"30"==rel.tags.type && !guidanceRelsFlag[rel.id]) {
                        if (rel.modelName == iD.data.DataType.TURN_GUIDANCE && !guidanceRelsFlag[rel.id]) {
                            guidanceRelsFlag[rel.id] = 1;
                            guidanceRels.push(rel);
                        }
                    }
                }
            }
            return guidanceRels;
        }
    }

    function redrawDirection() {
        var relations = d3.selectAll('g.layer-turnguidanceDir').data([0]).selectAll('g.onewaygroup').data()
        if (relations[0]){
            var relation=context.hasEntity(relations[0].id);
            if(relation){
                var nodeId = relation.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
                if(context.hasEntity(nodeId)){
                    drawTurnGuidance.drawDirection(context, relation);
                }
            }
        }
    }

    drawTurnGuidance.removeDirectionLayer = function () {
        d3.selectAll('g.turnguidance_way').remove();
    }

    function getNodeFromCrossMembers(context, crossNode, way) {
        var resNodeId, wayNodes = way.nodes;
        var topoEntity = iD.TopoEntity();
        var crossMembers = topoEntity.getCrossNodeMembers(context.graph(), crossNode.id) || [];
        for( var i in crossMembers){
            if(wayNodes[0] == crossMembers[i].id){
                resNodeId = wayNodes[0];
            }
            else if(wayNodes[wayNodes.length-1] == crossMembers[i].id){
                resNodeId = wayNodes[wayNodes.length -1];
            }
        }
        return editor.context.graph().entity(resNodeId);
    }

    drawTurnGuidance.drawDirection = function (context, relation) {
        if(!relation || !relation.tags) {
            drawTurnGuidance.removeDirectionLayer();
            return;
        }
        $guidanceLayer = d3.selectAll('g.layer-turnguidanceDir').data([0]);
        $guidanceLayer.on('mousedown', function () {
            d3.event.stopPropagation();
        });
        d3.selectAll('g.turnguidance_way').remove();
        if (relation.modelName == iD.data.DataType.NODEINFO || relation.modelName == iD.data.DataType.C_LANEINFO) {
            var wayId = relation.memberByRole(iD.data.RoleType.ROAD_ID).id;
            var nodeId = relation.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
            var way = context.graph().entity(wayId);
            var node = context.graph().entity(nodeId);
            if(relation.modelName == iD.data.DataType.C_LANEINFO){
                node = getNodeFromCrossMembers(context, node, way);
            }
            drawTurnGuidanceDir(context, [way], node, '1', relation);
        }
        else if (relation.modelName == iD.data.DataType.NODECONN || relation.modelName == iD.data.DataType.C_NODECONN) {
            //line to point flag =='1'
            var wayId = relation.memberByRole(iD.data.RoleType.FROAD_ID).id;
            var nodeId;
            if(relation.modelName == iD.data.DataType.C_NODECONN){
            	nodeId = relation.memberByRole(iD.data.RoleType.C_NODE_ID).id;
            }else {
            	nodeId = relation.memberByRole(iD.data.RoleType.ROAD_NODE_ID).id;
            }
            var way = context.graph().entity(wayId);
            var node = context.graph().entity(nodeId);
            if(relation.modelName == iD.data.DataType.C_NODECONN){
                node = getNodeFromCrossMembers(context, node, way);
            }
            drawTurnGuidanceDir(context, [way], node, '1', relation);
            //point to line flag == '0
            wayId = relation.memberByRole(iD.data.RoleType.TROAD_ID).id;
            way = context.graph().entity(wayId);
            node = context.graph().entity(nodeId);
            if(relation.modelName == iD.data.DataType.C_NODECONN){
                node = getNodeFromCrossMembers(context, node, way);
            }
            drawTurnGuidanceDir(context, [way], node, '0', relation);
        }
    }

    function drawTurnGuidanceDir(context, ways, node, flag, relation) {
        var projection = context.projection,
            graph = context.graph(),
            getPath = iD.svg.Path(projection, graph),
            getOneWayPath = iD.svg.OneWayTurnguidanceSegments(projection, graph, 70, node.loc, flag),

            ways = ways.filter(getPath);
        var $turnguidanceWays = $guidanceLayer.selectAll('g.turnguidance_way')
            .data(_.filter(ways, function (w) {
                return true;
            }), iD.Entity.key);

        $turnguidanceWays.enter()
            .append('g')
            .attr('class', function () {
                return 'turnguidance_way ' + node.id;
            });
        
        var $onewaygroup = $turnguidanceWays
            .selectAll('g.onewaygroup')
            .data([relation]);

        $onewaygroup.enter()
            .append('g')
            .attr('class', 'layer onewaygroup');

        var $oneways = $onewaygroup
            .selectAll('path')
            .data(function () {
                return getOneWayPath(d3.select(this.parentNode.parentNode).datum())
            });

        $oneways.enter()
            .append('path')
            .attr('class', 'oneway turnguidance-oneway')
            .attr('marker-mid', 'url(#turnguidance-oneway-marker)');

        $oneways
            .attr('d', function (d) {
                return d.d;
            });

        $oneways.exit()
            .remove();

    }

    return drawTurnGuidance;
}