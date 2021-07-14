/**
 *  .
 */

iD.svg.TurnGuidanceSeq = function (context) {
    var drawTurnGuidance = {};

    function calcuTwoNodesDistance(nodeIdA, nodeIdB, graph) {
        var nodeIdAEntity = graph.entity(nodeIdA),
            nodeIdBEntity = graph.entity(nodeIdB);
        var lon = iD.util.lassExtend.getDistance({
            lon: nodeIdAEntity.loc[0],
            lat: nodeIdAEntity.loc[1]
        }, {
            lon: nodeIdBEntity.loc[0],
            lat: nodeIdBEntity.loc[1]
        });
        return lon;
    }

    function getMidLoc(nodes, wayLength) {
        var loc = [], midIndex;
        if (nodes.length == 2) {
            midIndex = 0;
        }
        else if (nodes.length >= 2) {
            var tmpLen = 0;
            for (var i = 0; i < nodes.length - 1; i++) {
                tmpLen += calcuTwoNodesDistance(nodes[i], nodes[i + 1], context.graph());
                if (tmpLen > wayLength / 2) {
                    midIndex = i;
                    break;
                }
            }
        }
        var firstNode = context.graph().entity(nodes[midIndex]), lastNode = context.graph().entity(nodes[midIndex + 1]);
        var firstLoc = firstNode.loc, lastLoc = lastNode.loc;
        var lng = (firstLoc[1] + lastLoc[1]) / 2, lat = (firstLoc[0] + lastLoc[0]) / 2;
        loc.push(lat);
        loc.push(lng);
        return loc;
    }

    drawTurnGuidance.redraw = function () {
        var groups = d3.select('.layer-turnguidanceSeq').selectAll('g')
        groups.each(function (d) {
            drawTurnGuidance.draw(d.rel);
        })
    }
    drawTurnGuidance.removeAll = function () {
        d3.select('.layer-turnguidanceSeq').selectAll('g').remove();
        d3.selectAll('.layer-lines path.selected').classed('selected',false);
    }
    drawTurnGuidance.draw = function (rel) {
        drawTurnGuidance.removeAll();
        var wayArr = [], data = [],wayIdArr = [];
        if (rel.modelName != iD.data.DataType.TURN_GUIDANCE) return;
        var members = rel.members;
        members.forEach(function (d,i) {
            var way = context.graph().entity(d.id);
            var nodes = way.nodes;
            // var seq = d.sequence;
            var seq = i;
            wayArr.push(way);
            wayIdArr.push(way.id);
            var loc = getMidLoc(nodes, way.tags.LENGTH);
            data.push({
                rel: rel,
                id: way.id,
                angle: '0',
                loc: loc,
                seq: seq,
            })
        })

        selectElements(wayIdArr,true);
        var groups = d3.select('.layer-turnguidanceSeq')
            .selectAll('g')
            .data(data, function (d) {
                return d.id;
            });

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point turnguidance ' + d.id;
            })
            .order()

        group.call(roadMakerGrp);
        groups.attr('transform', iD.svg.PointTransform(context.projection));
        groups.exit().remove();
    }

    function selectElements(selectedIDs,flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
            .classed('selected', flag);
    }

    function roadMakerGrp(selection) {
        var size = '12';
        selection.each(function (d) {
            var grp = d3.select(this);
            grp.append('text')
                .attr('class', 'turn-guidance-text')
                .attr('dx', '5')
                .attr('dy', '-5')
                .style('font-size', '18px')
                .html(function (d) {
                    return d.seq;
                })
        });
    }


    return drawTurnGuidance;
}