iD.svg.Traffic = function (projection, context) {

    //[1]Arrow
    var longid = 1,
        darwMinZoom = 17;
    
    function _dataIsModel(d, modelName){
        let wid = typeof d == 'string' ? d :
            d ? d.fromwayId : 
            iD.Transportation.operations.id;
        let w = context.hasEntity(wid)
        return w && w.modelName == modelName;
    }

    function isLaneData(d){
        return _dataIsModel(d, iD.data.DataType.HD_LANE);
    }
    function isRoadData(d){
        return _dataIsModel(d, iD.data.DataType.ROAD);
    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function transpsData(editor) {

        var transId = iD.Transportation.operations.id;
        var way = context.hasEntity(transId);

        //if (context.selectedIDs().length != 1 || !context.transportation.is(context.selectedIDs()[0])) return;

        var graph = context.graph();
        //var way = context.hasEntity(context.selectedIDs()[0]);
        if (!(way instanceof iD.Way)) return [];

        var anode = graph.entity(way.first()),
            bnode = graph.entity(way.last()),
            nodeId2crossId = {};

        filterNodeCross([anode, bnode], nodeId2crossId);

        var a = nodeId2crossId[anode.id],
            b = nodeId2crossId[bnode.id],
            transps = {},
            filter = {};

        if (a && a !== '0' && a === b) return;

        var ans = (function (d) {
            if (d == 1) {
                return [anode, bnode];
            } else if (d == 2) {
                return [bnode];
            } else if (d == 3) {
                return [anode];
            } else if (d == 4) {
                return [];
            }
            return [];
        })(way.tags.DIRECTION);

        // 车道时，只判断最后一点与线的关系
        var isLane = isLaneData(way.id);

        // if(-1==ans.indexOf(anode)&&anode.tags.realnode=="0")
        // {
        //     ans.push(anode);
        // }
        // if(-1==ans.indexOf(bnode)&&bnode.tags.realnode=="0")
        // {
        //     ans.push(bnode);
        // }
        if(!isLane || way.tags.DIRECTION == '1'){
            if(-1==ans.indexOf(anode))
            {
                ans.push(anode);
            }
            if(-1==ans.indexOf(bnode))
            {
                ans.push(bnode);
            }
        }
        _(ans).each(function (an) {
            newTransps(transps, an, way, editor, filter, nodeId2crossId);
        });

        filter = {};

        return transps;
    }

    function filterNodeCross(ans, nodeId2crossId) {
        _(ans).each(function (an) {
            context.graph().parentRelations(an).forEach(function(rel)
            {
                if(rel.modelName==iD.data.DataType.R_C_NODE_ROAD_NODE)
                {
                    //graph=iD.actions.ChangeNodeMember(rel.id,rel.members)(graph);
                    rel.members.forEach(function(member){
                        if(member.modelName == iD.data.DataType.C_NODE){
                            nodeId2crossId[an.id] = member.id;
                        }
                    })
                }
            })
        });
    }
    function buildTimeInfo(trans) {

        var times = [];

        trans._rules.forEach(function (r) {

            if (r.type == '0' && r.timeInfo && r.timeInfo.timeRange) {
                times.push.apply(times, r.timeInfo.timeRange.map(function (t) {
                    return t.start + ' - ' + t.end;
                }));
            }

        });

        times = _.uniq(times);

        return times;
    }

    function buildTranStyle(trans) {

        var tag = {};
        // 车道连接关系存在时蓝色显示
        if(isLaneData(trans)){
            // fromwayId, nodeId, towayId
            let hasRel = context.graph()
                .parentRelations(context.entity(trans.fromwayId), iD.data.DataType.HD_LANE_CONNECTIVITY)
                .filter(function(r){
                    let ids = _.pluck(r.members, 'id');
                    let from = _.find(r.members, {role: iD.data.RoleType.FLANE_ID});
                    let to = _.find(r.members, {role: iD.data.RoleType.TLANE_ID});
                    if(!from || !to) return false;
                    return ids.includes(trans.fromwayId) && from.id == trans.fromwayId
                        && ids.includes(trans.nodeId)
                        && ids.includes(trans.towayId) && to.id == trans.towayId;
                }).length > 0;
            if(hasRel){
                tag.blue = true;
            }
            return tag;
        }

        trans._rules.forEach(function (r) {

            tag.blue = true;

            if (r.type == '0') {

                tag.yellow = true;

                if (r.time.indexOf('(h0){h24}') >= 0) {

                    tag.red = true;
                }
            } else if (r.type == '2') {
                tag.yellow = true;
            }

        });

        return tag;
    }

    function newTransps(transps, an, fromWay, editor, filter, nodeId2crossId) {
        var graph = context.graph(),
            next, nodes, tags, acs_entity, bcs_entity,
            anid = iD.Entity.id.toOSM(an.id),
            an_cross_node_id = nodeId2crossId[an.id];

        // 车道时
        // 双向-两端不是禁行
        // 正向-都是正向/双向
        // 逆向-都是逆向/双向
        // 禁行-不显示箭头
        var isLane = isLaneData(fromWay.id);

        var parentWays = graph.parentWays(an);
        _(parentWays).each(function (toWay) {
            nodes = toWay.nodes;
            var fnode = iD.Entity.id.toOSM(toWay.first());
            var tnode = iD.Entity.id.toOSM(toWay.last());
            var len = nodes.length;
            tags = toWay.tags;
            acs_entity = graph.entity(nodes[0]), bcs_entity = graph.entity(nodes[len - 1]);
            filterNodeCross([acs_entity, bcs_entity], nodeId2crossId);
            var acs = nodeId2crossId[acs_entity.id],
                bcs = nodeId2crossId[bcs_entity.id];
            
            if(isLane){
                if(!iD.util.laneDirectionConnectAccessable(context.graph(), fromWay, toWay, an)){
                    return ;
                }
            }

            if (acs && acs !== '' &&
                acs !== '0' &&
                acs === bcs) {
                if (fnode === anid) next = graph.entity(nodes[len - 1]);
                else if (tnode === anid) next = graph.entity(nodes[0]);

                if (!filter[next.id]) {
                    filter[next.id] = true;
                    newTransps(transps, next, fromWay, editor, filter, nodeId2crossId);
                }

                return;
            }


            if (!toWay.isOneRoadCrossWay() && tags.DIRECTION !== undefined) {
                var bn, dt = 25;

                if(fromWay.id!=toWay.id)
                {
                    if (fnode === anid) {
                        bn = graph.entity(nodes[1]);
                    } else if (tnode === anid) {
                        bn = graph.entity(nodes[len - 2]);
                    }
                }else if(fromWay.id==toWay.id&&tags.DIRECTION !== '1'){
                    return;
                }
                else if (tags.DIRECTION === '1') {
                    if (fnode === anid) {
                        bn = graph.entity(nodes[1]);
                    } else if (tnode === anid) {
                        bn = graph.entity(nodes[len - 2]);
                    } else return;
                } else if (tags.DIRECTION === '2') {
                    if (fnode === anid) {
                        bn = graph.entity(nodes[1]);
                    } else return;
                } else if (tags.DIRECTION === '3') {
                    if (tnode === anid) {
                        bn = graph.entity(nodes[len - 2]);
                    } else return;
                } else if (tags.DIRECTION === '4') {
                    return;
                } else {
                    return;
                }

                var a = context.projection(an.loc),
                    b = context.projection(bn.loc);
                var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
                    p = [parseInt(a[0] + dt * Math.cos(angle)),
                        parseInt(a[1] + dt * Math.sin(angle))
                    ],
                    loc = context.projection.invert(p);

                id = [an.id, bn.id].sort().join('-') + (longid++);

                var parentRelations = context.graph().parentRelations(fromWay),
                    pRelations = [],
                    mRelations = [],
                    crossOrmaat = false;
                parentRelations.forEach(function (relation) {
                    crossOrmaat = (relation.modelName === iD.data.DataType.C_NODECONN || relation.modelName === iD.data.DataType.NODECONN);
                    if (crossOrmaat) {
                        if (an_cross_node_id){
                        	(relation.members[1].id === nodeId2crossId[an.id]) && mRelations.push(relation);
                        }
                        else mRelations.push(relation);
                    }
                });
                mRelations.forEach(function (mRelation) {
                    var rules = context.graph().parentRelations(mRelation),
                        r;
                    rules.forEach(function (rule) {
                        r = _.clone(rule);
                        r = iD.util.merge({
                            members: mRelation.members
                        }, r);
                        pRelations.push(r);
                    });
                });

                var transportation = iD.Transportation();

                //var status = transportation.transpToRelations(toWay.id, pRelations);

                transps[id] = iD.Transportation({
                    type: 'transportation',
                    id: id,
                    loc: loc,
                    edge: [an.id, bn.id],
                    tags: {
                        status: 1
                    },
                    fromwayId: fromWay.id,
                    towayId: toWay.id,
                    nodeId: an_cross_node_id ? an_cross_node_id : an.id,
                    angle: angle * (180 / Math.PI)
                });

                var transRelationInfo = iD.ui.RoadRuleEditor(context)
                    .transportation(transps[id]).getRelationInfo({
                        withAnalyzed: true
                    });
                
                transps[id].tags.status = transRelationInfo.relations.length ? 3 : 1;

                transps[id]._rules = transRelationInfo.analyzedRelations;

                transps[id]._styleInfo = buildTranStyle(transps[id]);

                transps[id]._timeInfo = buildTimeInfo(transps[id]);
                
                //如果行驶方向为禁止通行，则在对象中删除
                if (transRelationInfo.maat.tags && transRelationInfo.maat.tags.ACCESSABLE != "0") {
                	delete transps[id];
                }

                editor && (transps[id].editor = true);

                var ancs = nodeId2crossId[an.id];

                if (ancs && ancs !== '0' && ancs !== '') {
                    if (fnode === anid) {
                        next = graph.entity(nodes[len - 1]);
                    } else if (tnode === anid) {
                        next = graph.entity(nodes[0]);
                    }
                    if (!filter[next.id] && ancs === nodeId2crossId[next.id]) {
                        filter[next.id] = true;
                        newTransps(transps, next, fromWay, editor, filter, nodeId2crossId);
                    }
                }
            }
        });
    }

    function addRoadControl(selection) {

        var g = selection.append('g')
                .attr('class', 'road-control-icon'),
            gw = 20,
            gh = 20,
            tranStr = 'translate(18, 0)';

        g.append('circle')
            .attr('transform', tranStr)
            .attr('cx', gw / 2)
            .attr('cy', gh / 2)
            .attr('r', Math.min(gw, gh) / 2);
        // .attr('width', gw)
        // .attr('height', gh);

        g.append('text')
            .attr('transform', tranStr)
            .attr('text-anchor', 'middle')
            .attr('x', gw / 2)
            .attr('y', gh / 2)
            .attr('dx', 1)
            .attr('dy', '0.35em')
            .html('&#10148;');

        return g;
    }

    function roadMakerGrp(selection, style) {

        selection.each(function (d) {

            var grp = d3.select(this),
                roadRule, roadContrl, timeTip;

            grp.html('');

            var fromWay = context.entity(d.fromwayId),
                toWay = context.entity(d.towayId);

            var tranNode = context.entity(d.nodeId);
            /*
            var withControl = tranNode.modelName == iD.data.Constant.ROADNODE &&
                context.graph().parentWays(tranNode).length === 2 &&
                fromWay.tags.status != '2' && toWay.tags.status != '2';

            var withRule = tranNode.tags.realnode !== '-1' &&
                fromWay.tags.status != '2' && toWay.tags.status != '2';*/ //modify
            var withControl = tranNode.tags.realnode == '0' && fromWay.id!== toWay.id;
            var withRule=withControl;
            if(!withRule)
            {
                withRule = tranNode.tags.realnode !== '-1' &&
                    fromWay.tags.status != '2' && toWay.tags.status != '2';
            }
            if (!withControl && !withRule) {
                return;
            }

            var imgStyle = 'green';

            ['red', 'yellow', 'blue'].some(function (t) {
                if (d._styleInfo[t]) {
                    imgStyle = t;
                    return true;
                }
            });

            if (d._timeInfo && d._timeInfo.length) {

                timeTip = grp.append('g')
                    .attr('class', 'road-rule-time');

                var $timeTxtBg = timeTip.append('rect')
                    .attr('class', 'rule_time_bg');

                var $timeTxt = timeTip.append('text')
                    .attr('class', 'rule_time_txt')
                    .attr('text-anchor', 'middle')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dx', '0')
                    .attr('dy', '0');

                $timeTxt.selectAll('tspan')
                    .data(d._timeInfo)
                    .enter()
                    .append('tspan')
                    .attr('x', 0)
                    .attr('y', function (d, idx) {
                        return -idx * 1.2 + 'em';
                    })
                    .text(function (d) {
                        return d;
                    });

                $timeTxt.each(function () {

                    var bbox = this.getBBox();

                    var w = Math.max(bbox.width + 10, 20),
                        h = Math.max(bbox.height + 10, 20);

                    d3.select(this.parentNode)
                        .select('rect.rule_time_bg')
                        .attr('rx', w / 10)
                        .attr('ry', w / 10)
                        .attr('x', -w / 2)
                        .attr('width', w)
                        .attr('y', -h + 10)
                        .attr('height', h);
                });

            }
            
            /*var transRelationInfo = iD.ui.RoadRuleEditor(context)
                    .transportation(d).getRelationInfo({
                        withAnalyzed: true
                    });*/

            if (d.fromwayId == d.towayId) {

                if (withRule/* && transRelationInfo.maat.tags.ACCESSABLE == "0"*/) {
                    roadRule = grp.append('image')
                        .attr('class', 'road-rule-icon')
                        .attr('x', -16)
                        .attr('y', -8)
                        .attr('width', 32)
                        .attr('height', 33)
                        .attr('xlink:href', function (d) {

                            return context.imagePath(imgStyle + 'turn.png');

                        });
                }

                if (withControl) {
                    roadContrl = addRoadControl(grp);
                    roadContrl.attr('transform', 'translate(-7,10)');
                }

                if (timeTip) {
                    timeTip.attr('transform', 'translate(60, -5)');
                }

            } else {

                if (withRule/* && transRelationInfo.maat.tags.ACCESSABLE == "0"*/) {
                    roadRule = grp.append('image')
                        .attr('class', 'road-rule-icon')
                        .attr('x', -6)
                        .attr('y', -8)
                        .attr('width', 45)
                        .attr('height', 35)
                        .attr('xlink:href', function (d) {

                            return context.imagePath(imgStyle + 'Arrow.png');
                        });
                }

                if (withControl) {
                    roadContrl = addRoadControl(grp);
                    roadContrl.attr('transform', 'translate(10, 15)');
                }

                if (timeTip) {
                    timeTip.attr('transform', 'translate(70, -5)');
                }
            }

            if (timeTip && (d.angle > 90 || d.angle < -90)) {

                var $bg = timeTip.select('rect.rule_time_bg');

                timeTip.attr('transform', timeTip.attr('transform') + ' rotate(180,0,' +
                ($bg.attr('y') / 2) + ')');
            }

            var arrowIsRoad = isRoadData(d);
            var arrowIsLane = isLaneData(d);

            if (roadRule) {
                roadRule.on('click', function (d) {

                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                    if(arrowIsLane){
                        context.container()
                            .call(iD.ui.LaneConnectivityEditor(context)
                                .transportation(d));
                    }
                    if(!arrowIsRoad) return false;

                    context.container()
                        .call(iD.ui.RoadRuleEditor(context)
                            .transportation(d));

                    return false;
                });
            }

            if (roadContrl) {
                roadContrl.on('click', function (d) {

                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                    if(!arrowIsRoad) return false;

                    context.container()
                        .call(iD.ui.RoadControl(context)
                            .transportation(d));
                    return false;
                });
            }

        });


        selection.each(function (entity) {

            var size = 11,
                coord = iD.geo.angleCoords(entity.angle, size);

            this.setAttribute('transform', 'translate(' + coord[0] + ', ' + coord[1] + ') rotate(' + entity.angle + ')');
        });
    }


    function drawTrafficArrow(surface, points, filter) {
        points.sort(sortY);
        // 交通规则相关数据
        var groups = surface.select('.layer-traffic')
            .selectAll('g.traffic_arrow')
            .data(_.values(transpsData()), function (d) {
                return d.id;
            });

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point traffic_arrow ' + d.id;
            })
            .order()
            .on('mousedown', function (d) {

                d3.event.stopPropagation();

            }).on('click', function (d) {

                d3.event.stopPropagation();

            });

        //group.append('path').call(markerPath, 'shadow');
        //group.append('path').call(markerPath, 'stroke');

        group.append('g').call(roadMakerGrp);

        // group.append('use')
        //   .attr('class', 'KDSEditor-icon')
        //   .attr('transform', 'translate(-6, -20)')
        //   .attr('clip-path', 'url(#clip-square-12)');

        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());

        //drawTrafficArrowRule(surface, points, filter);

        groups.exit().remove();
    }


    //[2]Node
    function markerNodePath(selection, style) {
        if (style === "shadow" || style === "stroke") {
            selection
                .attr('class', style)
                .attr('r', '10')
                .attr('cx', '0')
                .attr('cy', '0')
                .attr('fill', 'white')
                .attr('fill-opacity', '1')
                .attr('stroke', '#00d8ff')
                .attr('stroke-opacity', '1')
                .attr('stroke-width', '3')
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-dasharray', 'none')
                .attr('pointer-events', 'visiblePainted')
                .attr('cursor', 'inherit');

        } else if (style === 'image') {
            selection
                .attr('class', style)
                .attr('x', -12)
                .attr('y', -12)
                .attr('width', 25)
                .attr('height', 25)
                .attr('xlink:href', function (d) {
                    return d.tags.node === 'first' ? context.imagePath('pointa.png') : context.imagePath('pointb.png');
                });

        } else if (style === "turn") {
            selection
                .attr('r', '10')
                .attr('cx', function (d) {
                    return d.tags.node === 'first' ? 40 : -40;
                })
                .attr('cy', function (d) {
                    return d.tags.node === 'first' ? 30 : -30;
                })
                .attr('fill', 'red')
                .attr('opacity', function (d) {
                    return d.relation == 1 ? 1 : 0;
                });
        }

        selection.each(function (entity) {
            if (style === 'stroke') {
                if (entity.tags && entity.tags.node === 'first') this.style.fill = "#f00";
                if (entity.tags && entity.tags.node === 'last') this.style.fill = "#0f0";
            }
        });
    }

    function transps() {

        var transId = iD.Transportation.operations.id;
        var way = context.hasEntity(transId);

        // if (context.selectedIDs().length !== 1 || !context.transportation.is(context.selectedIDs()[0])) return;
        // var way = context.hasEntity(context.selectedIDs()[0]);


        if (!(way instanceof iD.Way)) return [];
        return iD.Transportation()
            .newTransportations(context.graph().entity(way.first()),
            context.graph().entity(way.last()),
            way.tags.DIRECTION);
    }

    function drawTrafficNode(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-traffic')
            .selectAll('g.traffic_node')
            .data(_.values(transps()), function (d) {
                return d.id;
            });

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point traffic_node ' + d.id;
            })
            .order()
            .on('mousedown', function (d) {

                d3.event.stopPropagation();

            }).on('click', function (d) {

                d3.event.stopPropagation();

            });

        //group.append('circle').call(markerNodePath, 'shadow');
        //group.append('circle').call(markerNodePath, 'stroke');


        group.append('image').call(markerNodePath, 'image');

        // group.append('use')
        //   .attr('class', 'icon')
        //   .attr('transform', 'translate(-6, -20)')
        //   .attr('clip-path', 'url(#clip-square-12)');

        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());

        groups.exit().remove();
    }

    //
    function drawTraffic(surface, points, filter) {

        drawTrafficNode(surface, points, filter);
        drawTrafficArrow(surface, points, filter);
    }

    drawTraffic.traffic = function (entities, limit) {
        var points = [];
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity._type === 'trafficnode' || entity._type === 'trafficarrow') {
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }
        return points;
    }


    function markerRulePath(selection, style) {

        if (style === "stroke" || style === "shadow") {
            selection
                .attr('class', style)
                .attr('transform', 'translate(-23, -35)')
                .attr('r', '7')
                .attr('cx', '40')
                .attr('cy', '-1.8')

        } else if (style === "icon") {
            selection
                .attr('class', 'KDSEditor-icon')
                .attr('transform', 'translate(40, 0)')
                .attr('clip-path', 'url(#clip-square-20)');
        } else if (style === "image") {
            selection
                .attr('class', style)
                .attr('x', -4)
                .attr('y', -4)
                .attr('width', 25)
                .attr('height', 25)
                .attr('xlink:href', context.imagePath('clock.png'));
        }

        selection.each(function (entity) {
            if (style === 'stroke') this.style.fill = "#FFD82F";
            var size = 11,
                coord = iD.geo.angleCoords(entity.angle, size);
            if (style === "icon" || style === "image") {
                var x = coord[0],
                    y = coord[1];
                coord[0] += 1 * 30 * Math.cos((Math.PI / 180) * entity.angle) + x;
                coord[1] += 1 * 30 * Math.sin((Math.PI / 180) * entity.angle) + y;
            }
            this.setAttribute('transform', 'translate(' + coord[0] + ', ' + coord[1] + ') rotate(' + entity.angle + ')');
        });
    }


    function drawTrafficArrowRule(surface, points, filter) {
        var groups = surface.select('.layer-traffic').selectAll('g.traffic_clock')
            .filter(filter)
            .data(_.values(transpsData(true)), function (d) {
                return d.id;
            });

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point traffic_clock ' + d.id;
            })
            .order();

        group.append('circle').call(markerRulePath, 'shadow');
        group.append('circle').call(markerRulePath, 'stroke');
        group.append('image').call(markerRulePath, 'image');
        group.append('use').call(markerRulePath, 'icon');
        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());

        groups.exit().remove();
    }

    return drawTraffic;
};