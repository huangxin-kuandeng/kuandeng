/**
 * 选中结点或者综合交叉点编辑行车引导线信息
 *
 */


(function (iD) {
    var pathIds = [];
    var ttab = `<div class="line-info-title">
            <h3 class="sub-title">{{title}}</h3>
            {{#editable}}
            <input type="text" class="thumbnail" value="{{value}}" {{disabled}} />
            {{/editable}}
            {{^editable}}
            <div class="thumbnail">{{&value}}</div>
            {{/editable}}
            <i class="iconfont icon-arrow-down"></i>
            <button class="button clear" {{disabled}}>删除</button>
        </div>`;

    function isRealpictureScene() {
        // console.log('isRealpictureScene 需要删除');
        return false;
        return iD.Task.d&&iD.Task.d.task_classes  == iD.data.TaskClass.REALPICTURE ;
    }
    function filterNodeCross(context, ans, nodeId2crossId) {
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
    function buildTranStyle(trans) {

        var tag = {};

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

    function newTransps(context, transps, an, toWay, fromWay, editor, filter, nodeId2crossId) {
        var graph = context.graph(),
            next, nodes, tags, acs_entity, bcs_entity,
            anid = iD.Entity.id.toOSM(an.id),
            an_cross_node_id = nodeId2crossId[an.id];

        //var parentWays = graph.parentWays(an);
       // _(parentWays).each(function (toWay) {
            nodes = toWay.nodes;
            var fnode = iD.Entity.id.toOSM(toWay.first());
            var tnode = iD.Entity.id.toOSM(toWay.last());
            var len = nodes.length;
            tags = toWay.tags;
            acs_entity = graph.entity(nodes[0]), bcs_entity = graph.entity(nodes[len - 1]);
            filterNodeCross(context, [acs_entity, bcs_entity], nodeId2crossId);
            var acs = nodeId2crossId[acs_entity.id],
                bcs = nodeId2crossId[bcs_entity.id];

            /*if (acs && acs !== '' &&
                acs !== '0' &&
                acs === bcs) {
                if (fnode === anid) next = graph.entity(nodes[len - 1]);
                else if (tnode === anid) next = graph.entity(nodes[0]);

                if (!filter[next.id]) {
                    filter[next.id] = true;
                   // newTransps(context, transps, next, fromWay, editor, filter, nodeId2crossId);
                }

                return;
            }*/


            if (!toWay.isOneRoadCrossWay() && tags.DIRECTION !== undefined) {
                var bn, dt = 25;

                if(fromWay.id!=toWay.id)
                {
                    if (fnode === anid) {
                        bn = graph.entity(nodes[1]);
                    } else if (tnode === anid) {
                        bn = graph.entity(nodes[len - 2]);
                    } else if (an_cross_node_id){
                        // // bn = graph.entity(nodes[len - 2]);
                        // an = graph.entity(nodes[len - 2]);
                        // bn = graph.entity(nodes[len - 1]);
                        let topoEntity = iD.TopoEntity();
                        let members = topoEntity.getCrossNodeMembers(graph, an_cross_node_id);
                        for (var i = 0;i < members.length;i++) {
                            if (nodes.includes(members[i].id)) {
                                let nodeIndex = nodes.indexOf(members[i].id);
                                an = graph.entity(nodes[nodeIndex]);
                                if (nodeIndex) {
                                    bn = graph.entity(nodes[0]);
                                } else {
                                    bn = graph.entity(nodes[1]);
                                }
                            }
                        }
                    }
                }else if(fromWay.id==toWay.id&&tags.DIRECTION !== '1'){
                    return;
                }else if(fromWay.id==toWay.id){
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
                if (!bn)return;
                var a = context.projection(an.loc),
                    b = context.projection(bn.loc);
                var angle = Math.atan2(b[1] - a[1], b[0] - a[0]),
                    p = [parseInt(a[0] + dt * Math.cos(angle)),
                        parseInt(a[1] + dt * Math.sin(angle))
                    ],
                    loc = context.projection.invert(p);

                id = [an.id, bn.id].sort().join('-');

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
                // if (transRelationInfo.maat.tags && transRelationInfo.maat.tags.ACCESSABLE != "0") {
                //     delete transps[id];
                // }

                editor && transps[id] && (transps[id].editor = true);

               /* var ancs = nodeId2crossId[an.id];

                if (ancs && ancs !== '0' && ancs !== '') {
                    if (fnode === anid) {
                        next = graph.entity(nodes[len - 1]);
                    } else if (tnode === anid) {
                        next = graph.entity(nodes[0]);
                    } else if (an_cross_node_id) {
                        next = graph.entity(nodes[len - 1]);
                    }
                    if (!filter[next.id] && ancs === nodeId2crossId[next.id]) {
                        filter[next.id] = true;
                        //newTransps(context, transps, next, fromWay, editor, filter, nodeId2crossId);
                    }
                }*/
            }
        //});
    }

    function roadMakerGrp(selection, style, context) {

        selection.each(function (d) {

            var grp = d3.select(this),
                roadRule, roadContrl, timeTip;

            grp.html('');
            if (d.fromwayId == d.towayId) return false;
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

            // if (roadRule) {
            //     roadRule.on('click', function (d) {
            //
            //         d3.event.stopPropagation();
            //         d3.event.preventDefault();
            //
            //         context.container()
            //             .call(iD.ui.RoadRuleEditor(context)
            //                 .transportation(d));
            //
            //         return false;
            //     });
            // }

            // if (roadContrl) {
            //     roadContrl.on('click', function (d) {
            //
            //         d3.event.stopPropagation();
            //         d3.event.preventDefault();
            //
            //         context.container()
            //             .call(iD.ui.RoadControl(context)
            //                 .transportation(d));
            //         return false;
            //     });
            // }

        });


        selection.each(function (entity) {

            var size = 11,
                coord = iD.geo.angleCoords(entity.angle, size);

            this.setAttribute('transform', 'translate(' + coord[0] + ', ' + coord[1] + ') rotate(' + entity.angle + ')');
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

    iD.ui.NodeLineInfo = function (context, selection, selectedIDs) {
        this.dataMgr =iD.ui.NodeLineInfo.dataMgr(context);
        this.dispatch = d3.dispatch('close');
        this.selection = selection;
        this.context = context;
        this.nodeId = selectedIDs[0];
        this.refTextValueArr = [];
        this.image_id ="";
        this.side_bmp ="";
        this.rear_bmp="";
        this.roadTypeArr = [{'name':"普通道路",'type':"0"},{'name':"高速公路",'type':"1"}];
        // this.urlOptions = $roadTree().options;
        this.result = {lt_turn_left:{}};
        this.arrowResult = {'image_id':'','side_bmp':'','rear_bmp':''};
        //this.roadTagType = "";//判断箭头所属道路类型为高速还是辅路
        this.highSpeedArr = ['G','H','I','J','K','L','M','N'];
        this.ordinaryArr = ['O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        this.arrowValidateFlag = {};
        //this.directOptions = this.dataMgr.getModelObjectByDatatype(iD.data.DataType.GUIDANCEVOICE,"voice_info","顺行道路");
        //this.slopOptions = this.dataMgr.getModelObjectByDatatype(iD.data.DataType.ASSISTINFO,"dir_slope","坡度导航");
        this.directOptions = this.dataMgr.directOptions;
        this.applyflag = false ;

        this.slopOptions = {
            label: "坡度导航",
            options: [{
                label: '0 未调查',
                value: 0
            }, {
                label: '1 平面->平面（没有倾斜）',
                value: 1
            }, {
                label: '10 平面->上坡',
                value: 10
            }, {
                label: '11 上坡->上坡（进入退出时同一角度）',
                value: 11
            }, {
                label: '12 上坡->上坡（退出比进度要急角度）',
                value: 12
            }, {
                label: '13 上坡->上坡（退出比进度要缓角度）',
                value: 13
            }, {
                label: '14 下坡->上坡',
                value: 14
            }, {
                label: '30 平面->下坡',
                value: 30
            }, {
                label: '31 下坡->下坡（进入退出时同一角度）',
                value: 31
            }, {
                label: '32 下坡->下坡（退出比进度要急角度）',
                value: 32
            }, {
                label: '33 下坡->下坡（退出比进度要缓角度）',
                value: 33
            }, {
                label: '34 上坡->下坡',
                value: 34
            }, {
                label: '40 上坡->平面',
                value: 40
            }, {
                label: '50 下坡->平面',
                value: 50
            }]
        };

        this.arrowOptions = ['LBCD', 'RBCD', 'LBC', 'LAC', 'LBD', 'LAB', 'RCD', 'RCE', 'RBD', 'RDE', 'ABC', 'BCD', 'LA', 'LB', 'LC', 'RC', 'RD', 'RE', 'AB', 'AC', 'AD', 'BC', 'BD', 'BE', 'CD', 'CE', 'DE', 'A', 'B', 'C', 'D', 'E', 'Z', 'L', 'R', 'LINE', 'F', 'G'];
        this.gspTextvalueOptions = {
            label: "方向信息",
            options: [{
                label: '1-方向 1-地点方向(11)',
                value: 11
            }, {
                label: '1-方向 2-路线名称(12)',
                value: 12
            }, {
                label: '1-方向 3-街道名称(13)',
                value: 13
            }, {
                label: '1-方向 4-旅游景点(14)',
                value: 14
            }, {
                label: '1-方向 5-服务设施名称(15)',
                value: 15
            }, {
                label: '1-方向 6-服务设施图标(16)',
                value: 16
            }, {
                label: '2-出口 1-地点方向(21)',
                value: 21
            }, {
                label: '2-出口 2-路线名称(22)',
                value: 22
            }, {
                label: '2-出口 3-街道名称(23)',
                value: 23
            }, {
                label: '2-出口 4-旅游景点(24)',
                value: 24
            }, {
                label: '2-出口 5-服务设施名称(25)',
                value: 25
            }, {
                label: '2-出口 6-服务设施图标(26)',
                value: 26
            }, {
                label: '2-出口 9-高速出口编号(29)',
                value: 29
            }, {
                label: '3-入口 1-地点方向(31)',
                value: 31
            }, {
                label: '3-入口 2-路线名称(32)',
                value: 32
            }, {
                label: '3-入口 3-街道名称(33)',
                value: 33
            }, {
                label: '3-入口 5-服务设施名称(35)',
                value: 35
            }, {
                label: '3-入口 6-服务设施图标(36)',
                value: 36
            }, {
                label: '4-高速沿线设施 5-服务设施名称(45)',
                value: 45
            }, {
                label: '4-高速沿线设施 7-高速服务区(47)',
                value: 47
            }, {
                label: '4-高速沿线设施 8-高速停车区(48)',
                value: 48
            }]
        };

        return d3.rebind(this, this.dispatch, 'on')
    };

    _.assign(iD.ui.NodeLineInfo.prototype, {

        initPanel: function () {
            var selection = this.selection,
                self = this,
                context = this.context,
                dialog = this.dialog = iD.dialog(null, {width: 600, appendTo: '#id-container', autoOpen: false});

            dialog.option('title', (function () {
                var entity = context.entity(self.nodeId);
                if (entity.modelName == iD.data.DataType.ROAD_NODE) {
                    return "节点";
                } else {
                    return "综合交叉点";
                }
            })());

            var buttons = [
                {
                    text: '确定',
                    classname: 'confirm',
                    click: function () {
                        var datum = self.resultDatum;
                        var context = self.context;
                        var d = context.entity(self.resultDatum.id);
                        //数据正确性验证弹框提示
                        if(datum.modelName == iD.data.DataType.NODECONN||datum.modelName == iD.data.DataType.C_NODECONN){
                            self.dataValidate(datum,context);
                        }
                        context.perform(iD.actions.Noop(), "进入退出关系信息编辑");
                        //更新maat的laneinfo信息
                        self.doSaveFunc(d);
                        datum = context.entity(d.id);
                        if (datum) {
                            self.applyflag = true ;
                            self.initContext(self.mainContext, datum);
                            self.applyflag = false ;
                            self.doSaveFunc(d);
                        }
                        self.dialog.close();
                        iD.svg.TurnGuidance().removeDirectionLayer();
                        //重新渲染地图
                        context.map().dimensions(context.map().dimensions());
                    }
                },
                {
                    text: '应用',
                    classname: 'apply',
                    click: function () {
                        var datum = self.resultDatum;
                        var context = self.context;
                        var d = context.entity(self.resultDatum.id);
                        //数据正确性验证弹框提示
                        if(datum.modelName == iD.data.DataType.NODECONN||datum.modelName == iD.data.DataType.C_NODECONN){
                            self.dataValidate(datum,context);
                        }
                        //console.log(datum);
                        context.perform(iD.actions.Noop(), "进入退出关系信息编辑");
                        //更新maat的laneinfo信息
                        self.doSaveFunc(d);
                        datum = context.entity(d.id);
                        self.applyflag = true ;
                        self.initContext(self.mainContext, datum);
                        self.applyflag = false ;
                        d3.selectAll('.line-info-panel .line-info-edit').classed('hidden', true);
                        //重新渲染地图
                        context.map().dimensions(context.map().dimensions());
                    }
                },
                {
                    text: '取消',
                    classname: 'gray',
                    click: function () {
                        self.dialog.close();
                        iD.svg.TurnGuidance().removeDirectionLayer();
                    }
                }
            ]
            if(d3.select('body').attr('role')=='check'){
                buttons.splice(0,2);
            }
            dialog.option('buttons', buttons);

            dialog.on('close', this.hide.bind(this));

            dialog.widget().classed('line-info-panel', true);

            var actions = [{title: "连接道路信息", type: "saat", active: true}, {
                title: "进入和退出关系信息",
                type: "maat",
                active: false
            }];

            var panelActions = dialog.element.append('div')
                .attr('class', 'btn-group panel-actions');

            panelActions.selectAll("a.btn").data(actions).enter().append("a")
                .attr("class", "btn").text(function (d) {
                return d.title
            })
                .attr("id", function (d, i) {
                    return d.type
                })
                .classed("active", function (d) {
                    return d.active
                })
                .on("click", function (d) {
                    iD.svg.TurnGuidanceSeq(context).removeAll();
                    d3.select(this.parentNode).selectAll("a").classed("active", false);
                    d3.select(this).classed("active", true);
                    $newPanelBody.attr('id', function (d) {
                        var $bodyType = d3.select(".line-info-panel .btn-group .active").attr("id");
                        return $bodyType;
                    });
                    self.initBody($newPanelBody);
                })

            $newPanelBody = dialog.element.append('div')
                .attr('class', 'panel-body')
                .attr('id', function (d) {
                    var $bodyType = d3.select(".line-info-panel .btn-group .active").attr("id");
                    return $bodyType;
                });

            this.initBody($newPanelBody);
            this.$panelBody = $newPanelBody;

            dialog.open();
        },

        /*
        * 控制箭头显示数据解析
        * modify by Tilden
        */
        transpsData: function(datas) {

            let context = this.context;
            var from_transId = "";
            var to_transId = "";
            var data = null;
            if (!datas) {
                return {};
            }

            for (var i = 0; i < datas.length; i++) {
                var d = datas[i];
                if (d.tags.ACCESSABLE == "0") {
                    data = d;
                    break;
                }
            }
            data && data.members && data.members.forEach(function (member) {
                if (member.modelName == iD.data.DataType.ROAD  && member.role == "FROAD_ID") {
                    from_transId = member.id;
                } else if (member.modelName == iD.data.DataType.ROAD  && member.role == "TROAD_ID") {
                    to_transId = member.id;
                }
            })

            var way = context.hasEntity(from_transId);
            var to_way = context.hasEntity(to_transId);

            //if (context.selectedIDs().length != 1 || !context.transportation.is(context.selectedIDs()[0])) return;

            var graph = context.graph();
            //var way = context.hasEntity(context.selectedIDs()[0]);
            if (!(way instanceof iD.Way)) return [];

            var anode = graph.entity(way.first()),
                bnode = graph.entity(way.last()),
                nodeId2crossId = {};

            filterNodeCross(context, [anode, bnode], nodeId2crossId);

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


            // if(-1==ans.indexOf(anode)&&anode.tags.realnode=="0")
            // {
            //     ans.push(anode);
            // }
            // if(-1==ans.indexOf(bnode)&&bnode.tags.realnode=="0")
            // {
            //     ans.push(bnode);
            // }
            if(-1==ans.indexOf(anode))
            {
                ans.push(anode);
            }
            if(-1==ans.indexOf(bnode))
            {
                ans.push(bnode);
            }
            _(ans).each(function (an) {
                newTransps(context, transps, an, to_way, way, editor, filter, nodeId2crossId);
            });

            filter = {};

            return transps;
        },
        drawMaatArrow: function(datas) {
            //模拟交通规则方式，显示箭头
            // modify by Tilden
            var groups = d3.$("#surface").select('.layer-traffic')
                .selectAll('g.traffic_arrow')
                .data(_.values(this.transpsData(datas)), function (d) {
                    return d.id;
                });
            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'node point traffic_arrow ' + d.id;
                })
            var context = this.context;
            group.append('g').call(roadMakerGrp, null, context);
            groups.attr('transform', iD.svg.PointTransform(context.projection)).call(iD.svg.TagClasses());
        },
        initBody: function ($body) {
            d3.selectAll('.line-info-panel .panel-body *').remove();  //  面板清空
            var self = this;
            var context = this.context;
            var nodeId = this.nodeId;
            //左侧关联道路相关maat
            var $sidebar = $body.append('div').attr('class', 'side-bar-panel');
            var maatArrs = this.dataMgr.getMaatArrs(this.nodeId);
            var saatArrs = this.dataMgr.getSaatArrs(this.nodeId);
            var $bodyType = d3.select(".line-info-panel .btn-group .active").attr("id");
            var datas = [];
            var initData;
            if ($bodyType == 'saat') {
                datas = saatArrs;
                context.enter(iD.modes.Browse(context));
            } else if ($bodyType == 'maat') {
                datas = maatArrs;
                this.drawMaatArrow(datas);
            }
            datas = self.dataMgr.sortRealtions(datas,self.resultDatum);
            for (var i = 0; i < datas.length; i++) {
                if (!self.dataMgr.isDisabledLabel(datas[i],context)) {
                    initData = datas[i];
                    break;
                }
            }

            iD.svg.TurnGuidance().drawDirection(editor.context, initData);

            $sidebar.append('div')
                .attr('class', 'side-bar-title').text("关联道路");
            var $showItems = $sidebar.append('ul').selectAll('li').data(datas);
            var $eachItem = $showItems.enter().append('li')
                .on("click", function (d) {
                	// 连续分歧-进入和退出关系信息 面板
                	// 左侧MAAT列表的点击

                    if(d3.$(this).classed('disabled')&&!self.dataMgr.isActivableLabel(d,context)){
                        return;
                    }
                    var selectedIds = self.dataMgr.getHighlightIds(d);
                    var preRel = d3.select('.side-bar-panel ul li.active').data()[0];
                    var preSelectedIds = self.dataMgr.getHighlightIds(preRel);
                    context.enter(iD.modes.Browse(context)); //为了防止偶尔高亮道路不能取消的事情，不知道为啥啊
                    self.selectElements(preSelectedIds, false);
                    d3.select(this.parentNode).selectAll("li").classed("active", false);
                    d3.select(this).classed("active", true);
                    self.initContext($mainContext, d);
                    self.selectElements(selectedIds, true);
                    //特效
                    iD.svg.TurnGuidance().drawDirection(editor.context, d);
                    self.drawMaatArrow([d]);
                })
                .classed("active", function (d) {
                    if (d == initData) {
                        return true;
                    }
                    return false;
                })
                .classed('disabled', function (d) {
                    return self.dataMgr.isDisabledLabel(d,context);
                })
                .classed('saat-li', function (d) {
                    return self.dataMgr.isSaat(d);
                }).attr('index',function(d,i){
                    return i;
                });


            if (!initData) return;
            //saat一个li下面有一个label,maat一个li下面有两个label
            if (self.dataMgr.isSaat(initData)) {
                $eachItem.append('label').text(function (d) {
                    var selectedIds = self.dataMgr.getHighlightIds(d);
                    var way = context.entity(selectedIds[0]);
                    var namechn = iD.ui.TagName.dbc2sbc(way.tags.NAME_CHN);
                    return (way.tags.NAME_CHN == "" ? "未命名" : namechn) + ":" + (selectedIds[0]).slice((selectedIds[0]).indexOf("_") + 1);
                }).attr('id', function (d) {
                    return d.id
                }).attr('class', 'saat-lable');
            } else {
                $eachItem.append('label').text(function (d) {
                    var selectedIds = self.dataMgr.getHighlightIds(d);
                    var fWayId = selectedIds[0], fWay = context.entity(fWayId);
                    var tWayId = selectedIds[1], tWay = context.entity(tWayId);
                    var fnamechn = iD.ui.TagName.dbc2sbc(fWay.tags.NAME_CHN);
                    var tnamechn = iD.ui.TagName.dbc2sbc(tWay.tags.NAME_CHN);
                    return (fWay.tags.NAME_CHN == "" ? "未命名" : fnamechn) + "--" + (tWay.tags.NAME_CHN == "" ? "未命名" : tnamechn);
                }).attr('class', 'maat-lable');
                $eachItem.append('label').text(function (d) {
                    var selectedIds = self.dataMgr.getHighlightIds(d);
                    var fWayId = selectedIds[0];
                    var tWayId = selectedIds[1];
                    var from_id = (fWayId).slice((fWayId).indexOf("_") + 1);
                    var to_id = (tWayId).slice((tWayId).indexOf("_") + 1);
                    return from_id + "->" + to_id
                }).attr('class', 'maat-lable');
            }


            //内容栏的内容显示  -行车引导线
            var $mainContext = $body.append('div').attr('class', 'main-context');
            this.mainContext = $mainContext;
            if (initData) {
                this.initContext($mainContext, initData);
                var selectedIds = self.dataMgr.getHighlightIds(initData);
                this.selectElements(selectedIds, true);
            }

            //绑定快捷键
            var keybinding=d3.keybinding("nodeLaneInfo");
            keybinding.on('↑',function(){
                self.keyBindingShow(self,'previous');
                d3.event.stopPropagation()
            },true)
                .on('↓',function(){
                    self.keyBindingShow(self,'next');
                    d3.event.stopPropagation()
                },true)
                .on('↩',function(){
                    d3.$('.line-info-panel .ui-dialog-buttonset .confirm').dispatch('click');
                    d3.event.stopPropagation()
                },true);
            self.keybinding=keybinding;
            d3.select(document).call(keybinding);

        },

        //初始化右侧内容面板,datum为传入的maat/saat数据关系
        initContext: function ($mainContext, datum) {
            var self = this;
            if (self.dataMgr.isSaat(datum)) {
                self.initSaatContext($mainContext, datum);
            } else {
                self.initMaatContext($mainContext, datum);
            }
        },

        initSaatContext: function ($mainContext, datum) {
            d3.selectAll('.line-info-panel .main-context *').remove();
            var context = this.context;
            var self = this;
            var dataMgr = this.dataMgr;
            datum = context.entity(datum.id);
            var arrowTag = this.dataMgr.getArrowTag(datum);

            if(d3.select('body').attr('role')=='check'||dataMgr.isZeroBugTask()||!dataMgr.isRealPictureTask()){
                //待转灯编辑功能实现
                var ltTurnLOption = {
                    options: [{label: '0 未调查(默认)',value: 0}, {label: '1 有',value: 1}, {label: '2 无',value: 2}]
                };
                var ltTurnLeft = $mainContext.append('div').attr('class', 'lt-turn-left');
                self.select(ltTurnLOption,ltTurnLeft,datum.tags.LT_TURN_L,'左转');
                self.select(ltTurnLOption,ltTurnLeft,datum.tags.LT_UTURN_L,'左掉头');
                self.select(ltTurnLOption,ltTurnLeft,datum.tags.WAIT_L,'左转弯待转区');

                var arrowsArr = this.dataMgr.parseArrowTag(arrowTag.arrowTag,self.arrowOptions, self.applyflag);
                var $maatLineInfo = $mainContext.append('div')
                    .attr('class', 'maat-line-info').attr('laneinfoid', function (d) {
                        return arrowTag.id
                    });
                var $lineInfoTitle = this.drawTitleBar($maatLineInfo, {
                    title: '行车引导线',
                    disabled: isRealpictureScene(),
                    editable: false,
                    value: arrowsArr.map(function (d) {
                        return `<span class="image-${d}"></span>`;
                    }).join(''),
                    render: function () {
                        d3.$('.button-line-info input[value=清空]', $maatLineInfo).dispatch('click');
                    }
                });

                //行车引导线编辑面板
                this.editLineInfo($maatLineInfo, arrowsArr, datum);

                // var $image_id = $mainContext.append('div')
                //     .attr('class', 'background-mode');
                // var temp_type ="0";
                // if(datum.tags.IMAGE_ID.indexOf("8")==0) temp_type="1";
                // var backgroundModeOpt = {tagString:"image_id",type:temp_type,initTextValue:"模式背景",initFlag:true,isRadio:true}
                // this.editBackgroundMode(datum,$image_id,backgroundModeOpt);
                //
                // var $side_bmp = $mainContext.append('div')
                //     .attr('class', 'background-mode');
                // var bmpOpt = {tagString:"side_bmp",type:"3",initTextValue:"辅路导航",initFlag:true,isRadio:false}
                // this.editBackgroundMode(datum,$side_bmp,bmpOpt);
            }
            if(d3.select('body').attr('role')=='check'||dataMgr.isZeroBugTask()||dataMgr.isRealPictureTask()){
                //绘制saat实景背景图
                var $real= $mainContext.append('div')
                    .attr('class', 'background-mode');
                this.realBackground(datum,$real,false);
            }
            this.saveBtnGroups($mainContext, datum);

        },

        initMaatContext: function ($mainContext, datum) {
            d3.selectAll('.line-info-panel .main-context *').remove();
            var context = this.context;
            var self = this;
            var dataMgr = this.dataMgr;
            datum = context.entity(datum.id);

            var arrowResult = self.arrowResult;
            var guidancePicArrImage = self.dataMgr.getGuidancePic(datum,context,['20','21']);
            arrowResult.image_id =(guidancePicArrImage.length>0)?guidancePicArrImage[0].tags.PIC_AR:"";
            var guidancePicArrSide = self.dataMgr.getGuidancePic(datum,context, ['40']);
            arrowResult.side_bmp =(guidancePicArrSide.length>0)?guidancePicArrSide[0].tags.PIC_AR:"";
            var guidancePicArrRear = self.dataMgr.getGuidancePic(datum,context,['10','11']);
            arrowResult.rear_bmp =(guidancePicArrRear.length>0)?guidancePicArrRear[0].tags.PIC_AR:"";

            if(d3.select('body').attr('role')=='check'||dataMgr.isZeroBugTask()||!dataMgr.isRealPictureTask()){
                //绘制行车引导线
                this.editLaneInfoTotal($mainContext,datum);

                //行车引导线路径编辑面板
                this.editTurnGuidances($mainContext, datum);

                //方向信息的制作
                //var initTextValue = "11八达岭高速::12北三环::13马甸桥::26北四环::32北辰西路";
                // var guidancespArr = self.dataMgr.getGuidanceSP(datum,context);
                // var textValueArr = [];
                // if(guidancespArr.length>0){
                //     var initTextValue = guidancespArr[0].tags.TEXTVALUE;
                //     if(initTextValue!=""){
                //         textValueArr = initTextValue.split('::');
                //     }
                // }
                // var refTextValueArr = self.dataMgr.getRefNameChnArr(context,this.nodeId);   //参考路径名称
                // this.refTextValueArr = refTextValueArr;
                // var $guidancespSub = $mainContext.append('div')
                //     .attr('class', 'guidancesp-sub');
                // this.editTextValueForGSP(datum,$guidancespSub,textValueArr,refTextValueArr,true);

                //3D箭头
                //self.roadTagType = 'image_id';
                // var arrowInitOptions= this.getInitArrowOption('image_id',datum,context,true);
                // var $threeDemenArrow = $mainContext.append('div')
                //     .attr('class', 'three-demension-arrow');
                // this.editArrowTitle($threeDemenArrow,arrowInitOptions);
                // //获取绘制的箭头单选
                // // this.getArrowDataArrs($threeDemenArrow,arrowInitOptions,self.editThreeDemensionArrow);
                //
                // //辅路箭头
                // var $sideRoadArrow = $mainContext.append('div')
                //     .attr('class', 'side-road-arrow');
                // var sideRoadOptions= this.getInitArrowOption('side_bmp',datum,context,true);
                // this.editArrowTitle($sideRoadArrow,sideRoadOptions);
                // this.getArrowDataArrs($sideRoadArrow,sideRoadOptions,self.editThreeDemensionArrow);

            }
            if(d3.select('body').attr('role')=='check'||dataMgr.isZeroBugTask()||dataMgr.isRealPictureTask()){
                //实景maat面板
                var $commonRealArrow = $mainContext.append('div')
                    .attr('class', 'common-Real-arrow');
                var realInitOptions= this.getInitArrowOption('rear_bmp',datum,context,true);
                this.editArrowTitle($commonRealArrow,realInitOptions);
                this.getArrowDataArrs($commonRealArrow,realInitOptions,self.editThreeDemensionArrow);
            }

            this.saveBtnGroups($mainContext, datum);
        },

        editArrowTitle:function(container,options){
            var $threeDemenArrowTitle = this.drawTitleBar(container, {
                title: options.title,
                value: options.initTextValue.replace(/^.+:/, ''),
                disabled: options.disabled,
                editable: true,
                validate: function () {
                    if (this.value && !d3.$(`.left-side-image input[value="${this.value}"]`, container).node()) {
                        if (options.title === '实景箭头' && /^[G-N]D\d{7}$/.test(this.value)) {
                            return false;
                        }
                        d3.$('.clear-btn input', container).dispatch('click');
                        return '箭头ID错误';
                    }
                },
                render: function () {
                    if (this.value) {
                        d3.$(`.left-side-image input[value="${this.value}"]`, container).property('checked', true).dispatch('change');
                    }
                    else {
                        d3.$('.clear-btn input', container).dispatch('click');
                    }
                }
            });
        },
        saveBtnGroups: function ($mainContext, datum) {
            this.resultDatum = datum;
        },

        //绘制行车引导线
        editLaneInfoTotal:function($mainContext,datum){
            var context = this.context;
            var self = this;
            datum = context.entity(datum.id);
            var laneInfoOption = this.dataMgr.getArrowTag(datum, "1");

            var arrowsArr = this.dataMgr.parseArrowTag(laneInfoOption.arrowTag,self.arrowOptions, self.applyflag);
            var $maatLineInfo = $mainContext.append('div')
                .attr('class', 'maat-line-info').attr('laneinfoid', function (d) {
                    return laneInfoOption.id
                });
            var $lineInfoTitle = this.drawTitleBar($maatLineInfo, {
                title: '行车引导线',
                disabled: isRealpictureScene(),
                editable: false,
                value: arrowsArr.map(function (d) {
                    return `<span class="image-${d}"></span>`;
                }).join(''),
                render: function () {
                    d3.$('.button-line-info input[value=清空]', $maatLineInfo).dispatch('click');
                }
            });

            //行车引导线箭头编辑面板
            this.editLineInfo($maatLineInfo, arrowsArr, datum);

            //行车引导线编号编辑面板
            laneInfoOption.initFlag = true;
            laneInfoOption.subInputFlag = true;
            this.editLaneInfoNo($maatLineInfo,datum,laneInfoOption);

        },

        //绘制行车引导线编辑面板模板
        editLineInfo: function ($context, arrowsArr, datum) {
            var self = this;
            var $lineInfoEdit = $context.append('div')
                .attr('class', 'line-info-edit')
                .classed('hidden', function (d) {
                    return true;
                });
            var arrowOptions = this.arrowOptions;
            $lineInfoEdit.append('h3').attr('class', 'edit-title').text('选择引导线类型：');
            var $chooseLaneInfo = $lineInfoEdit.append('div').attr('class', 'choose-line-info');
            $chooseLaneInfo.selectAll('span').data(arrowOptions)
                .enter().append('span')
                .attr('class', function (d) {
                    return 'image-' + d;
                }).on('dblclick.choose', function (d) {
                //双击给行车引导线选择结果增加元素
                var chooseimg = d;
                //var resultElments = this.parentNode.nextElementSibling.nextElementSibling;
                /*                    d3.select(resultElments).append('span').attr('class', function (d) {
                                        return 'image-' + chooseimg;
                                    })*/
                var titleSection = d3.select(this.parentNode.parentNode.parentNode.firstChild);
                titleSection.select('.thumbnail').append('span').attr('class', function (d) {
                    return 'image-' + chooseimg;
                });
                /*                    d3.$('.line-info-title .thumbnail', $context).append('span').attr('class', function (d) {
                                        return 'image-' + chooseimg;
                                    });*/
                var selection = d3.select(this.parentNode.nextSibling);
                var isChecked = selection.select("input").node().checked;
                if (isChecked) {
                    /*                        d3.select(resultElments).append('span').attr('class', function (d) {
                                                return 'image-' + 'LINE';
                                            })*/
                    titleSection.select('.thumbnail').append('span').attr('class', function (d) {
                        return 'image-' + 'LINE';
                    });
                }
            });


            /*            $lineInfoEdit.append('h3').attr('class', 'edit-title').text('行车引导线选择结果：');
                        var $resultLaneInfo = $lineInfoEdit.append('div').attr('class', 'result-line-info');
                        $resultLaneInfo.selectAll('span').data(arrowsArr).enter()
                            .append('span').attr('class', function (d) {
                                return 'image-' + d;
                            })*/

            var $btnLineInfo = $lineInfoEdit.append('div').attr('class', 'button-line-info');
            var checkBoxBtn = $btnLineInfo.append('div').attr('class', 'check-box-div');
            checkBoxBtn.append('input').attr('type', 'checkbox').attr('checked', true);
            checkBoxBtn.append('label').text('自动追加车道线').on('click.text',function(d){
                var checkbox = this.previousSibling;
                var isChecked = checkbox.checked;
                checkbox.checked = !isChecked;
            });

            $btnLineInfo.append('input').attr('class','button').attr('type', 'button').attr('value', '回删')
                .on('click', function (d) {
                    //var deleteLast = this.parentNode.previousElementSibling.lastChild;
                    //if (deleteLast == null) return;
                    var titleDeleteEle = d3.select(this.parentNode.parentNode.parentNode).select('.thumbnail').node().lastChild;
                    if (titleDeleteEle == null) return;
                    titleDeleteEle.remove();
                    //deleteLast.remove();

                    var laneNoSection = d3.select(this.parentNode.parentNode.parentNode.parentNode.parentNode).select('.line-info-panel .maat-line-info .lane-info-number input');
                    if(!laneNoSection.node())   return;
                    if(titleDeleteEle.className=="image-LINE")return;
                    //联动处理行车引导线编号
                    var value = laneNoSection.value();
                    var newValue="";
                    if(value!=""){
                        var valueArr  = value.split('|');
                        valueArr.splice((valueArr.length-1),1);
                        newValue = valueArr.join('|')
                    }
                    var laneInfoOption={
                        initFlag:false,
                        lane_no:newValue,
                        subInitFlag:false
                    };
                    self.editLaneInfoNo($context,datum,laneInfoOption);
                });
            $btnLineInfo.append('input').attr('class','button').attr('type', 'button').attr('value', '清空')
                .on('click', function (d) {
                    //var deleteCont = d3.select(this.parentNode.previousElementSibling).selectAll('*').remove();
                    var titleCont = d3.select(this.parentNode.parentNode.parentNode).selectAll('.thumbnail *').remove();
                    //if (deleteCont == null) return;
                    if (titleCont == null) return;
                    //deleteCont.remove();
                    titleCont.remove();

                    var laneInfoNo = d3.select('.line-info-panel .maat-line-info .lane-info-number-input').node();
                    if(laneInfoNo){
                        var inputArrs = laneInfoNo.childNodes;
                        for(var i=0;i<inputArrs.length;i++){
                            d3.select(inputArrs[i]).value('');
                        }
                        d3.select('.line-info-panel .maat-line-info .lane-info-number input').value('');
                    }
                });
            $btnLineInfo.append('input').attr('class','button').attr('type', 'button').attr('value', '确定')
                .on('click', function (d) {
                    var childNodes = this.parentNode.parentNode.parentNode.childNodes;
                    for(var i=1;i<childNodes.length;i++){
                        d3.select(childNodes[i]).classed('hidden', true);
                    }
                    //var $thumbnail = d3.select(this.parentNode.parentNode).selectAll('.result-line-info').node().lastChild;
                    var $thumbnail = d3.select(this.parentNode.parentNode.previousElementSibling).select('.thumbnail span:last-child').node();
                    if($thumbnail&&$thumbnail.className == "image-LINE"){
                        //d3.select($thumbnail).remove();
                        d3.select(this.parentNode.parentNode.previousElementSibling).select('.thumbnail span:last-child').remove();
                    }
                });
        },

        //行车引导线编号
        editLaneInfoNo:function($maatLineInfo,datum,laneInfoOption){
            d3.selectAll('.line-info-panel .main-context .lane-info-number').remove();
            var context = this.context;
            var self = this;
            var initFlag =  laneInfoOption.initFlag;
            var lane_no =  laneInfoOption.lane_no;
            var $laneInfoNumber = $maatLineInfo.append('div').attr('class', 'lane-info-number').classed('hidden', function (d) {
                return initFlag;
            });
            var $laneInfoNumberManul = $laneInfoNumber.append('div').attr('class', 'lane-info-number-manul');
            var $laneInfoNumberText = $laneInfoNumber.append('div').attr('class', 'lane-info-number-text').classed('hidden',function(){
                if(laneInfoOption.subInputFlag!=undefined){
                    return laneInfoOption.subInputFlag
                }else {
                    return true
                }});
            var $laneInfoNumberInput = $laneInfoNumber.append('div').attr('class', 'lane-info-number-input').classed('hidden',function(){
                if(laneInfoOption.subInputFlag!=undefined){
                    return laneInfoOption.subInputFlag
                }else {
                    return true
                }
            });
            var $laneInfoNumberBtn = $laneInfoNumber.append('div').attr('class', 'lane-info-number-btn').classed('hidden',function(){
                if(laneInfoOption.subInputFlag!=undefined){
                    return laneInfoOption.subInputFlag
                }else {
                    return true
                }
            });
            $laneInfoNumberManul.append('span').text('行车引导线编号:');
            $laneInfoNumberManul.append('input').attr('type','input').value(lane_no)
                .on('change',function(){
                    //获取非车道线图标的个数，确定不能编辑的框个数
                    var value = this.value;
                    self.dataMgr.isLaneNoValidate(value,datum,context,self);
                });
            $laneInfoNumberManul.append('input').attr('class','button').attr('type','button').attr('value', '编辑')
                .on('click.laneInfoNum',function(d){
                    //获取非车道线图标的个数，确定不能编辑的框个数
                    var value = this.previousSibling.value;
                    var valueArr = self.dataMgr.parseStr2IntArr(value,'|');
                    var saat = self.dataMgr.getSaatFromMaat(context,datum)[0];
                    var laneinfo = saat.tags.LANEINFO;
                    var length1 = laneinfo?laneinfo.split('|').length:0;
                    var lanoInfoLength = self.dataMgr.getLaneInfoLineNum();

                    var lane_no_flag = self.dataMgr.isLaneNoValidate(value,datum,context,self);
                    if(lane_no_flag)return;

                    //联动处理输入的数字
                    var ischecked = d3.select('.line-info-panel .maat-line-info .lane-info-number .lane-info-number-btn .modify-in-order').node().checked;
                    if(ischecked&&value){
                        var numLength = valueArr.length;     //输入的车道线编号数目
                        for(var i=numLength;i<lanoInfoLength;i++){
                            valueArr[i] = valueArr[i-1]+1
                        }
                        value = valueArr.join('|');
                    }
                    var childNodes = this.parentElement.parentElement.childNodes;
                    var isShown = d3.select(childNodes[1]).classed('hidden');
                    var laneInfoOption={
                        lane_no:value,
                        initFlag:false,
                        subInputFlag:!isShown
                    };
                    var $maatLineInfo = d3.selectAll('.line-info-panel .main-context .maat-line-info');
                    self.editLaneInfoNo($maatLineInfo,datum,laneInfoOption);

                });
            $laneInfoNumberText.append('span').text('激活编辑框后，鼠标滚轮可以变更数');

            for(var i = 0;i<10;i++){
                $laneInfoNumberInput.append('input').attr('type','input').attr('id',i)
                    .on('mousewheel',function(d){
                        d3.event.stopPropagation();
                        d3.event.preventDefault();
                        var value = parseInt(this.value);     //获得该输入框的值
                        var id = parseInt(this.id);
                        var checked = this.parentNode.nextElementSibling.childNodes[1].checked;
                        var childs = this.parentNode.childNodes;
                        var delta = d3.event.wheelDelta;
                        var lanoInfoLength = self.dataMgr.getLaneInfoLineNum();
                        var nextValue = (id==9)?undefined:childs[parseInt(id)+1].value;
                        var preValue = (id==0)?undefined:childs[parseInt(id)-1].value;
                        nextValue = parseInt(nextValue);
                        preValue = parseInt(preValue);
                        if(value==""||isNaN(value)||value<1)return;

                        if(checked){
                            //向上滑动
                            if(delta>0){
                                for(var j=id;j<lanoInfoLength;j++){
                                    d3.select(childs[j]).value(value+1+j-id);
                                }
                            }else if(value>1){
                                if(value&&(value<=(preValue+1))){
                                    Dialog.alert("行车引导线编号必须从小到大录入");
                                    return;
                                }
                                for(var j=id;j<lanoInfoLength;j++){
                                    var jValue = value+(j-id)-1;
                                    jValue>0&&d3.select(childs[j]).value(jValue);
                                }
                            }
                        }else{
                            //向上滑动
                            if(delta>0){
                                if(value&&((value+1)>=nextValue)){
                                    Dialog.alert("行车引导线编号必须从小到大录入");
                                    return;
                                }
                                d3.select(this).value(value+1);
                            }else if(value>1){
                                if(value&&((value-1)<=preValue)){
                                    Dialog.alert("行车引导线编号必须从小到大录入");
                                    return;
                                }
                                d3.select(this).value(value-1);
                            }
                        }

                        //联动文本输入框的内容
                        self.dataMgr.dealLaneInfoNoInput();
                    })
                    .on('change',function(){
                        var childs = this.parentNode.childNodes;
                        //添加多条行车引导线，编辑界面依次添加编号，使从左到右不按照由小到大排列
                        var id = parseInt(this.id);
                        var value = parseInt(this.value);
                        //var valueArr = self.dataMgr.parseStr2IntArr(value,'|');
                        var nextValue = (id==9)?undefined:childs[parseInt(id)+1].value;
                        var preValue = (id==0)?undefined:childs[parseInt(id)-1].value;
                        var originValue = d3.select('.line-info-panel .maat-line-info .lane-info-number-manul input').value();
                        var oValue = originValue.split('|')[id];
                        if(value&&parseInt(value)<=parseInt(preValue)){
                            Dialog.alert("行车引导线编号必须从小到大录入");
                            d3.select(this).value(oValue?oValue:"");
                            return;
                        }

                        var ischecked = d3.select('.line-info-panel .maat-line-info .lane-info-number .lane-info-number-btn .modify-in-order').node().checked;
                        if(ischecked){
                            var lanoInfoLength = self.dataMgr.getLaneInfoLineNum();
                            for(var i=(id+1);i<lanoInfoLength;i++){
                                d3.select(childs[i]).value(value+i-id);
                            }
                        }else if(value&&parseInt(value)>=parseInt(nextValue)){
                            Dialog.alert("行车引导线编号必须从小到大录入");
                            d3.select(this).value(oValue?oValue:"");
                            return;
                        }

                        //联动文本输入框的内容
                        self.dataMgr.dealLaneInfoNoInput();
                    })
                    .classed('disabled',function(){
                        var selection = d3.select('.line-info-panel .maat-line-info .line-info-title .thumbnail').node();
                        var arrowNodes = selection?selection.childNodes:[];
                        var lineCount = 0;     //车道线个数
                        for(var j=0;j<arrowNodes.length;j++){
                            if(d3.select(arrowNodes[j]).attr('class')=="image-LINE")lineCount++;
                        }
                        if(arrowNodes.length>0&&d3.select(arrowNodes[arrowNodes.length-1]).attr('class')!="image-LINE"){
                            lineCount++;
                        }
                        var id = this.id;
                        if(id<lineCount){
                            return false;
                        }else {
                            return true;
                        }
                    })
                    .attr('value',function(){
                        var isDisable = d3.select(this).classed('disabled');
                        if(isDisable) return;
                        var value = d3.select('.line-info-panel .maat-line-info .lane-info-number input').value();
                        var valueArr = value!=''?value.split('|'):[];
                        d3.select(this).value(valueArr[i]);
                    });
            }
            $laneInfoNumberBtn.append('input').attr('class','button').attr('type','button').attr('value', '清空')
                .on('click.clear',function(){
                    var childs = this.parentNode.previousSibling.childNodes;
                    for(var i=0;i<childs.length;i++){
                        d3.select(childs[i]).value('');
                    }
                    d3.select('.line-info-panel .maat-line-info .lane-info-number input').value('');
                    //console.log("清空");
                });

            $laneInfoNumberBtn.append('input').attr('type', 'checkbox').attr('class','modify-in-order').attr('checked', true);
            $laneInfoNumberBtn.append('label').text('顺序关联修改').on('click.check',function(){
                var checkbox = this.previousSibling;
                var isChecked = checkbox.checked;
                checkbox.checked = !isChecked;
            });

        },
        //绘制行车引导线路径面板
        editTurnGuidances: function ($mainContext, datum) {
            //行车引导线路径
            var context = this.context;
            iD.svg.TurnGuidanceSeq(context).removeAll();
            var self = this;
            var $lineInfoPath = $mainContext.append('div')
                .attr('class', 'line-info-path');

            var $lineInfoTitle = this.drawTitleBar($lineInfoPath, {
                title: '引导线路径',
                value: '',
                disabled: isRealpictureScene(),
                editable: false,
                render: function () {
                    d3.$$('.sub-line-info-path', $lineInfoPathDetail).each(function (d, i) {
                        d3.select(this).remove();
                        context[i?'replace':'perform'](iD.actions.DeleteRelation(d.id), "删除行车引导线路径");
                    });
                }
            });

            var $lineInfoPathBtn = $lineInfoPath.append('div').attr('class', 'line-info-btn-div');
            $lineInfoPathBtn.append('input').attr('type', 'button').attr('value', '添加路径').attr('class', 'button').attr('status','edit')
                .on('click', function (d) {
                    if(d3.select('body').attr('role')=='check')return;
                    if(isRealpictureScene())return;
                    var editable = d3.select(this).attr('status');
                    if (editable == 'edit') {
                        pathIds = [];
                        context.enter(
                            iD.modes.LaneInfoModify(context, pathIds, datum));
                        d3.select(this).attr('value', '添加完成');
                        d3.select(this).attr('status', 'finish');
                    } else if (editable == 'finish') {
                        if (context.mode().availableExit&&context.mode().availableExit()) {
                            // console.log(pathIds);
                            var tgdArr = [];
                            context.perform(iD.actions.CreateTurnGuidance(context, pathIds, tgdArr,{type:"30"}), '添加行车引导线路径');
                            context.enter((iD.modes.Browse(context)));
                            self.editLaneInfoTgd($lineInfoPathDetail, datum);
                            d3.select(this).attr('value', '添加路径');
                            d3.select(this).attr('status', 'edit');
                        }else if(!context.mode().availableExit){
                            var tgdArr = [];
                            context.enter((iD.modes.Browse(context)));
                            self.editLaneInfoTgd($lineInfoPathDetail, datum);
                            d3.select(this).attr('value', '添加路径');
                            d3.select(this).attr('status', 'edit');
                        }
                    }
                });
            $lineInfoPathBtn.append('input').attr('class','button').attr('type', 'button').attr('value', '删除')
                .on('click.delete', function () {
                    if(d3.select('body').attr('role')=='check')return;
                    if(isRealpictureScene())return;
                    if (d3.select('.line-info-panel .line-info-path-title.active').node() != null) {
                        var selection = d3.select('.line-info-panel .line-info-path-title.active').node().parentElement;
                        var data = d3.select('.line-info-panel .line-info-path-title.active').data()[0];
                        d3.select(selection).remove();
                        context.perform(iD.actions.DeleteRelation(data.id), "删除行车引导线路径");
                        //console.log(d);
                    }
                });
            $lineInfoPathBtn.append('input').attr('type', 'button').attr('value', '编辑路径').attr('class', 'button').attr('status','edit')
                .on('click.edit', function () {
                    if(d3.select('body').attr('role')=='check')return;
                    if(isRealpictureScene())return;
                    if (d3.select('.line-info-panel .line-info-path-title.active').node() != null) {
                        var data = d3.select('.line-info-panel .line-info-path-title.active').data()[0];

                        var editable = d3.select(this).attr('status');
                        if (editable == 'edit') {
                            pathIds = [];
                            data.members.forEach(function (member) {
                                pathIds.push(member.id);
                            })
                            //pathIds = [];
                            context.enter(
                                iD.modes.LaneInfoModify(context, pathIds, datum));
                            d3.select(this).attr('value', '编辑完成');
                            d3.select(this).attr('status', 'finish');
                        } else if (editable == 'finish') {
                            if (context.mode().availableExit()) {
                                // console.log(pathIds);
                                var members = [];

                                for (var i = 0; i < pathIds.length; i++) {
                                    var member = {
                                        'id': pathIds[i],
                                        'role':iD.data.RoleType.ROAD_ID,
                                        'type': iD.data.GeomType.WAY,
                                        'modelName':iD.data.DataType.ROAD
                                        // 'sequence': (i + 1)
                                    };
                                    members.push(member);
                                }
                                var tgdArr = [];
                                context.perform(iD.actions.ChangeNodeMember(data.id, members), '编辑行车引导线路径');
                                context.enter((iD.modes.Browse(context)));
                                self.editLaneInfoTgd($lineInfoPathDetail, datum);
                                d3.select(this).attr('value', '编辑路径');
                                d3.select(this).attr('status', 'edit');
                            }
                        }
                    }
                });

            var $lineInfoPathDetail = $lineInfoPath.append('div').attr('class', 'line-info-path-detail');

            this.editLaneInfoTgd($lineInfoPathDetail, datum);

            // //顺行道路和坡度导航
            // var directOptions = self.directOptions;
            // var slopOptions = self.slopOptions;
            // var $lineInfoSelect = $lineInfoPath.append('div')
            //     .attr('class', 'line-info-select');
            // var $directMotion = $lineInfoSelect.append('div').attr('class', 'select-div').attr('id', 'voice-info').attr('value', '0');
            // var $slopInfo = $lineInfoSelect.append('div').attr('class', 'select-div').attr('id', 'dir-slop').attr('value', '0');
            // //获得两个select的初始化值
            // var gd_voice_rel = self.dataMgr.getGuidanceVoiceRel(datum, context);
            // var voice_info_init = "-1";
            // if (gd_voice_rel.length > 0) {
            //     voice_info_init = gd_voice_rel[0].tags.VOICE_INFO;
            // }
            // var assist_info_rel = self.dataMgr.getAssistInfo(datum, context);
            // var dir_slop_init = "0";
            // if (assist_info_rel.length > 0) {
            //     dir_slop_init = assist_info_rel[0].tags.DIR_SLOPE;
            // }
            // this.select(directOptions, $directMotion, voice_info_init);
            // this.select(slopOptions, $slopInfo, dir_slop_init);
        },

        //行车引导线路径列表
        editLaneInfoTgd: function ($lineInfoPathDetail, datum) {
            d3.selectAll('.line-info-panel .line-info-path-detail *').remove();
            //通过maat获取对应的行车引导线路径数组
            var context = this.context;
            var self = this;
            var TGDRelations = datum.getTurnGuidanceByMaat(context.graph(),"30");
            var tgdArrowsArr = [];
            TGDRelations.forEach(function (rel) {
                var secondRels = context.graph().parentRelations(rel,iD.data.DataType.LANEINFO);
                if (secondRels.length > 0) {
                    var arrows = secondRels[0].tags.ARROW;
                    var arrowsArr = self.dataMgr.parseArrowTag(arrows,self.arrowOptions, self.applyflag);
                    tgdArrowsArr.push({
                        'tgd_id': rel.id,
                        'arrow': arrowsArr
                    });
                } else {
                    tgdArrowsArr.push({
                        'tgd_id': rel.id,
                        'arrow': undefined,
                        'arrowStr': ""
                    });
                }
            });

            var $enter = $lineInfoPathDetail.selectAll('div').data(TGDRelations).enter();
            var $subLineInfoPath1 = $enter.append('div').attr('class', 'sub-line-info-path').attr('id', function (d, i) {
                return i
            }).attr('tgd', function (d, i) {
                return d.id
            });


            var $lineInfoPathTitle = $subLineInfoPath1.append('div').attr('class', 'line-info-path-title');
            var $lineInfoPathTitleDiv = $lineInfoPathTitle.append('div').attr('class', 'sub')
                .on('click.laneinfopath', function (d, i) {
                    //行车引导线数字顺序特效
                    var svg = iD.svg.TurnGuidanceSeq(context);
                    svg.draw(d);
                    if(d3.select('body').attr('role')=='check')return;
                    if(isRealpictureScene())return;
                    var targetIds = [];
                    d.members.forEach(function (member) {
                        targetIds.push(member.id);
                    })

                    //this.lastChild.innerHTML = "";
                    var isShow = d3.select(this.parentElement.nextElementSibling).classed('hidden');

                    //点击展开此路径的编辑面板同时，关闭其他编辑面板
                    d3.selectAll('.line-info-panel .line-info-path .line-info-edit').classed('hidden', true);
                    d3.selectAll('.line-info-panel .line-info-path .line-info-path-title').classed('active', false);
                    d3.select(this.parentElement.nextElementSibling).classed('hidden', !isShow);
                    d3.select(this.parentElement).classed('active', true);

                    //折叠以后所有的箭头信息在标题栏显示
                    var selection = d3.selectAll('.line-info-panel .line-info-path .line-info-path-title .sub .thumbnail');
                    //展示折叠path的缩略图
                    selection[0].forEach(function (sel) {
                        var className = sel.lastChild?sel.lastChild.className:"";
                        if(className&&className=="image-LINE"){
                            d3.select(sel.lastChild).remove();
                        }
                    })

                });


            $lineInfoPathTitleDiv.append('span').attr('class', 'sub-path')
                .html(function (d, i) {
                    var str = "路径" + i + ":";
                    var members = d.members;
                    for (var i = 0; i < members.length; i++) {
                        if (i != (members.length - 1)) {
                            str += (members[i].id).slice((members[i].id).indexOf("_") + 1) + "->";
                        } else {
                            str += (members[i].id).slice((members[i].id).indexOf("_") + 1);
                        }
                    }
                    return str;
                })
            var $pathThumbnail = $lineInfoPathTitleDiv.append('div').attr('class', 'thumbnail');

            $pathThumbnail[0].forEach(function (pthumbnail, i) {
                //tgdArrowsArr = [{'tgd_id':"r902_351",'arrow':['B','LINE','C'],'arrowStr':'B|C'},{'tgd_id':"r902_350",'arrow':undefined,'arrowStr':''}];
                var $tgd_path_sub = d3.select(pthumbnail.parentElement.parentElement.parentElement);
                var tgd_arrows_arr = tgdArrowsArr[i].arrow;
                if (tgd_arrows_arr != undefined) {
                    d3.select(pthumbnail).selectAll('span').data(tgd_arrows_arr).enter().append('span').attr('class', function (d) {
                        return 'image-' + d;
                    })
                    self.editLineInfo($tgd_path_sub, tgdArrowsArr[i].arrow, datum);
                } else {
                    self.editLineInfo($tgd_path_sub, [], datum);
                }
            })
        },

        drawTitleBar: function (container, opt) {
            //opt.disabled = opt.disabled || d3.select('body').attr('role') === 'check';
            opt.disabled = opt.disabled ? 'disabled' : '';
            opt.validate = opt.validate || (() => false);
            if(this.dataMgr.isZeroBugTask()||d3.select('body').attr('role')=='check'){
                opt.disabled = '';
            }
            container.html(Mustache.render(ttab, opt));

            var $backgroundTitle = d3.$('.line-info-title', container);
            var onInput = function () {
                var result = opt.validate.call(this);
                if (result) {
                    $backgroundTitle.classed('error', true);
                    $backgroundTitle.attr('data-error', result);
                }
                else {
                    opt.render.call(this, !result);
                }
            };

            d3.$('input', $backgroundTitle).on('input', function () {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift(this);
                setTimeout(Function.prototype.bind.apply(onInput, args), 200);
                if ($backgroundTitle.classed('error')) {
                    $backgroundTitle.classed('error', false);
                }
                d3.select(this.parentNode.nextElementSibling).classed('hidden', false);
            });

            d3.$('button', $backgroundTitle).on('click', function () {
                if (opt.editable) {
                    d3.$('input.thumbnail', $backgroundTitle).property('value', '').dispatch('input');
                }
                else {
                    opt.render.call(this);
                }
            });

            d3.$('i', $backgroundTitle).on('click.backgroundMode', function (d) {
                if(opt.disabled) return;
                var title = this.parentNode;
                if(!title.nextElementSibling)return;
                var hidden = title.nextElementSibling.className.indexOf('hidden') === -1;
                var childNodes = title.parentNode.childNodes;
                for(var i=1;i<childNodes.length;i++){
                    d3.select(childNodes[i]).classed('hidden',hidden);
                }
                /*                var detail = title;
                                while (detail = detail.nextElementSibling) {
                                    detail.className = detail.className.replace(/\bhidden\b/, '');
                                    if (hidden) {
                                        detail.className += ' hidden';
                                    }
                                }*/
            });

            return $backgroundTitle;
        },

        realBackground:function(datum,container){
            var option = _.clone(option);
            var $backgroundTitle = container.append('div').attr('class', 'line-info-title');
            var self = this;
            this.rear_bmp = datum.tags.REAR_BMP;

            var $backgroundTitle = this.drawTitleBar(container, {
                title: "实景导航图片",
                value: datum.tags.REAR_BMP,
                disabled: false,
                editable: true,
                render: function (isValid) {
                    if (isValid) {
                        if (this.value) {
                            self.rear_bmp = this.value;
                        }
                        else{
                            self.rear_bmp ="";
                            $img.style('background-image', 'none');
                            $img.classed('preview', true);
                        }
                    }
                    else{
                        self.rear_bmp ="";
                        $img.style('background-image', 'none');
                        $img.classed('preview', true);
                    }
                },
                validate: function () {
                    // 5 ，6开头 长度为8
                    if(this.value!=="" && !/^[56]\d{7}$/.test(this.value)){
                        return "输入背景图片ID错误";
                    }
                }
            });

            var $backgroundDetail = container.append('div').attr('class', 'realBackground-detail').classed('hidden',function(){
                return true;
            });

            var $detailImg = $backgroundDetail.append('div').attr('class', 'background-tree-img');
            var $img = $detailImg.append('div').attr('class','background-img preview');
        },

        //绘制模式背景图片
        editBackgroundMode:function(datum,container,option){
            var option = _.clone(option);
            var self = this;

            var $backgroundTitle = this.drawTitleBar(container, {
                title: option.initTextValue,
                value: datum.tags[option.tagString],
                disabled: isRealpictureScene(),
                editable: true,
                render: function () {
                    if (this.value) {
                        var valueType = this.value.indexOf("8")==0? "1":"0";
                        if (typeof $roadTypes !== 'undefined') {
                            _.map($roadTypes.selectAll("input")[0], function(num,i){
                                if(num.value == valueType){
                                    num.checked = true;
                                    d3.select(num).dispatch("change");
                                }
                            });
                        }
                        $tree.datum().value(this.value, true);
                    }
                    else {
                        if ($tree.datum().value()) {
                            var input = d3.$('input', $tree.datum()._selected);
                            input.property('checked', false);
                            input.dispatch('change');
                        }
                    }
                },
                validate: function () {
                    if (this.value && !/^\d{8}$/.test(this.value)) {
                        $tree.datum().value(null);
                        return '输入背景图片ID错误';
                    }
                }
            });

            option.value  = datum.tags[option.tagString];
            this[option.tagString] = datum.tags[option.tagString];

            var $backgroundDetail = container.append('div').classed('backgroundMode-detail', true).classed('hidden', option.initFlag);
            //添加道路类型单选按钮组
            if(option.isRadio){
                var $roadTypes = $backgroundDetail.append('div').attr('class', 'road-type');
                $roadTypes.selectAll('span')
                    .data(self.roadTypeArr,function(d){return d.type})
                    .enter()
                    .append("span")
                $roadTypes.selectAll('span')
                    .append("input")
                    .attr("type","radio")
                    .attr("name","background"+option.tagString)
                    .attr("value",function(d){return d.type})
                    .property("checked",function(d){
                        if(d.type == option.type){
                            return true;
                        }
                        return false;
                    })
                    .on('change',roadTypeChange);

                $roadTypes.selectAll('span')
                    .append("text")
                    .text(function(d){return d.name});
            }


            var $treeImg = $backgroundDetail.append('div').attr('class', 'background-tree-img');
            var $tree = $treeImg.append('div').attr('class', 'background-tree');
            //.style('background-color',"red")
            var $img = $treeImg.append('div').attr('class','background-img');
            //.style('background-color',"black")

            // this.drawTree($tree,$img,option,$backgroundTitle)

            //道路类型切换事件
            function roadTypeChange(e){
                option.type = e.type;
                $tree.node().removeChild($tree.node().childNodes[0]);
                // self.drawTree($tree,$img,option,$backgroundTitle)
                //console.log(e)
            }
        },
        //绘制目的地信息列表
        editTextValueForGSP: function(datum,$guidancespSub,textValueArr,refTextValueArr,initFlag,isEdit){
            var self = this;
            var context = this.context;
            var $mainContext = d3.select('.line-info-panel .main-context');
            var guidancespArr = self.dataMgr.getGuidanceSP(datum,context);
            var initTextValue = "";
            if(guidancespArr.length>0){
                initTextValue = guidancespArr[0].tags.TEXTVALUE;
            }
            //var $guidancespSub = $mainContext.append('div')
            //    .attr('class', 'guidancesp-sub');
            var $guidancespTitle = this.drawTitleBar($guidancespSub, {
                title: '方向信息',
                value: textValueArr.join('::'),
                disabled: isRealpictureScene(),
                editable: true,
                validate: function () {
                    if (/^::|::$/.test(this.value)) {
                        return '格式错误';
                    }
                },
                render: function () {
                    if (this.value) {
                        this.value = this.value.toUpperCase() ;
                    }
                    self.editTextValueForGSP(datum,$guidancespSub,this.value?this.value.split('::'):[],self.refTextValueArr,false, true);
                }
            });
            if (isEdit) {
                var input = d3.$('input', $guidancespTitle).node();
                input.focus();
                input.value = input.value.toUpperCase() ;
                input.setSelectionRange(input.value.length, input.value.length + 1);
            }
            /*d3.$('i', $guidancespTitle).on('click.guidancespTitle', function (d) {
                    //折叠以后所有的箭头信息在标题栏显示
                    if (!isShow) {
                        var guidancespArr = self.dataMgr.getGuidanceSP(datum,context);
                        var initTextValue = ""
                        if(guidancespArr.length>0){
                            initTextValue = guidancespArr[0].tags.textvalue;
                        }
                        d3.select(this.lastChild).text(initTextValue);
                    }
                });*/
            var $guidancespDetail = $guidancespSub.append('div').attr('class', 'guidancesp-detail').classed('hidden',function(){
                return initFlag;
            });

            var gspTextvalueOptions = self.gspTextvalueOptions;
            var $guidancespSelect = $guidancespDetail.append('div')
                .attr('class', 'line-info-select');
            var $gspTextvalue = $guidancespSelect.append('div').attr('class', 'select-div').attr('id', 'text-value').attr('value', '0');
            var text_value_init = "11";
            this.select(gspTextvalueOptions, $gspTextvalue, text_value_init);
            $guidancespSelect.append('input').attr('type', 'text').attr('class', 'to-road-name').attr('placeholder', '到路口')
                .on('change',function(){
                    var value = this.value.toUpperCase();
                    var selection = d3.select('.line-info-panel .gsp-detail-left .gsp-select-list ul li.active label');
                    if(selection.node()){
                        var name = selection.text();
                        var str = name.substr(0,2)+value;

                        var textvalueArr = self.getTextValueArrForGSP();
                        if(value==""){
                            Dialog.alert("路牌名称不能为空！");
                            return;
                        }else if(textvalueArr.indexOf(str)>-1){
                            Dialog.alert("不能添加重复的路牌名称!");
                            return;
                        }
                        selection.text(str);

                        textvalueArr = self.getTextValueArrForGSP();
                        self.editTextValueForGSP(datum,$guidancespSub,textvalueArr,self.refTextValueArr,false);
                        // console.log('change event');
                    }
                });

            //改变方向信息单选项的时候同时改变选中的值
            d3.$('.select',$gspTextvalue).on('change.intext',function(d){
                var value = this.value;
                var selection = d3.select('.line-info-panel .gsp-detail-left .gsp-select-list ul li.active label');
                if(selection.node()){
                    var name = selection.text();
                    var str = value+name.substr(2);
                    selection.text(str);
                }
            });

            var $guidancespDetailCont = $guidancespDetail.append('div').attr('class', 'gsp-detail-cont');
            //列表与操作
            var $guidancespLeft = $guidancespDetailCont.append('div').attr('class', 'gsp-detail-left');
            var $guidancespCenter = $guidancespDetailCont.append('div').attr('class', 'gsp-detail-center');
            var $guidancespRight = $guidancespDetailCont.append('div').attr('class', 'gsp-detail-right');

            //目的地信息列表
            $guidancespLeft.append('div').attr('class', 'gsp-select-title').text('目的地信息列表');
            //var initTextValue = "11八达岭高速::12北三环::13马甸桥::26北四环::32北辰西路";
            //var textValueArr = initTextValue.split('::');
            var $gspLeftList = $guidancespLeft.append('div').attr('class', 'gsp-select-list');
            var $showItems = $gspLeftList.append('ul').selectAll('li').data(textValueArr);
            var $eachItem = $showItems.enter().append('li')
                .on("click", function (d) {
                    var isShow = d3.select(this).classed('active');
                    d3.select(this.parentNode).selectAll("li").classed("active", false);
                    d3.select(this).classed("active", !isShow);
                    var str = d3.select(this).text();
                    // console.log(d);
                    if(!isShow){
                        d3.select('.line-info-panel .to-road-name').value(str.substr(2));
                        d3.select('.line-info-panel .guidancesp-sub .guidancesp-detail .select').value(str.substr(0,2));
                    }else{
                        d3.select('.line-info-panel .to-road-name').value("");
                        d3.select('.line-info-panel .guidancesp-sub .guidancesp-detail .select').value("11");
                    }
                });
            $eachItem.append('label').text(function (d) {
                return d;
            });

            //添加、删除、上移、下移、清除
            $guidancespCenter.append('input').attr('class','button').attr('type', 'button').attr('value', '添加')
                .on('click.add', function () {
                    var textvalueArr = self.getTextValueArrForGSP();
                    var selectvalue = d3.selectAll('.guidancesp-sub .line-info-select .select').node().value;
                    var inputvalue = d3.selectAll('.guidancesp-sub .line-info-select .to-road-name').node().value;
                    var value = selectvalue+inputvalue.toUpperCase();
                    if(inputvalue==""){
                        Dialog.alert("路牌名称不能为空！");
                        return;
                    }else if(textvalueArr.indexOf(value)>-1){
                        Dialog.alert("不能添加重复的路牌名称!");
                        return;
                    }
                    var newTextvalueArr = textvalueArr.concat(value);
                    self.editTextValueForGSP(datum,$guidancespSub,newTextvalueArr,self.refTextValueArr,false);
                    // console.log("add");
                });
            $guidancespCenter.append('input').attr('class','button').attr('type', 'button').attr('value', '删除')
                .on('click.delete', function () {
                    var textvalueArr = self.getTextValueArrForGSP();
                    var selection = d3.select('.line-info-panel .gsp-detail-left .gsp-select-list ul li.active label');
                    if(selection.node()){
                        var value = selection.text();
                        var index =textvalueArr.indexOf(value);
                        textvalueArr.splice(index,1);
                        self.editTextValueForGSP(datum,$guidancespSub,textvalueArr,self.refTextValueArr,false);
                    }
                    // console.log("delete");
                });
            $guidancespCenter.append('input').attr('class','button').attr('type', 'button').attr('value', '上移')
                .on('click.moveup', function (d) {
                    var textvalueArr = self.getTextValueArrForGSP();
                    var selection = d3.select('.line-info-panel .gsp-detail-left .gsp-select-list ul li.active label');
                    if(selection.node()){
                        var value = selection.text();
                        var index =textvalueArr.indexOf(value);
                        if(index==0){
                            Dialog.alert("已经是最上面一个！");
                        }else{
                            textvalueArr[index] = textvalueArr[index-1];
                            textvalueArr[index-1] = value;
                        }
                        self.editTextValueForGSP(datum,$guidancespSub,textvalueArr,self.refTextValueArr,false);
                    }
                    // console.log("move up");
                });
            $guidancespCenter.append('input').attr('class','button').attr('type', 'button').attr('value', '下移')
                .on('click.movedown', function () {
                    var textvalueArr = self.getTextValueArrForGSP();
                    var selection = d3.select('.line-info-panel .gsp-detail-left .gsp-select-list ul li.active label');
                    if(selection.node()){
                        var value = selection.text();
                        var index =textvalueArr.indexOf(value);
                        if(index==textvalueArr.length-1){
                            Dialog.alert("已经是最下面一个！");
                        }else{
                            textvalueArr[index] = textvalueArr[index+1];
                            textvalueArr[index+1] = value;
                        }
                        self.editTextValueForGSP(datum,$guidancespSub,textvalueArr,self.refTextValueArr,false);
                    }
                    // console.log("move down");
                });
            $guidancespCenter.append('input').attr('class','button').attr('type', 'button').attr('value', '清除')
                .on('click.clear', function (d) {
                    d3.selectAll('.line-info-panel .gsp-detail-left .gsp-select-list ul *').remove();
                    // console.log("clear");
                });

            //参考内容
            $guidancespRight.append('div').attr('class', 'gsp-select-title').text('参考内容(双击替换)');
            var $gspRightList = $guidancespRight.append('div').attr('class', 'gsp-select-list');
            //var refTextValueArr = ['八达岭高速','北三环','马甸桥','北四环','北辰西路'];
            //var refTextValueArr = self.getRefNameChnArr(context);
            var $showItems = $gspRightList.append('ul').selectAll('li').data(refTextValueArr);
            var $eachItem = $showItems.enter().append('li')
                .on("dblclick.refrence", function (d){
                    var selection = d3.select('.line-info-panel .gsp-detail-left .gsp-select-list ul li.active label');
                    if(selection.node()) {
                        var name = selection.text();
                        var str = name.substr(0,2)+d;
                        var textvalueArr = self.getTextValueArrForGSP();
                        if(textvalueArr.indexOf(str)>-1){
                            Dialog.alert("不能添加重复的路牌名称!");
                        }else{
                            selection.text(str);
                        }
                    }
                    d3.select(this.parentNode).selectAll("li").classed("active", false);
                    d3.select(this).classed("active", true);

                    d3.select('.line-info-panel .to-road-name').value(d);

                    // console.log(d);
                });
            $eachItem.append('label').text(function (d) {
                return d;
            });

        },


        //绘制3D箭头
        editThreeDemensionArrow: function(container,arrowInitOptions){
            //d3.select('.line-info-panel .threeDemenArrowTitle-detail').remove();
            var self = arrowInitOptions.self;
            var $threeDemenArrowDetail = container.append('div').attr('class', 'threeDemenArrowTitle-detail').classed('hidden',function(){
                return arrowInitOptions.initFlag;
            });
            var $treeImg = $threeDemenArrowDetail.append('div').attr('class', 'background-tree-img');
            var $imageLeftSide = $treeImg.append('div').attr('class','left-side-image')
            //.style('background-color',"red");
            $imageLeftSide.selectAll('span')
                .data(arrowInitOptions.arrowArr)
                .enter()
                .append("span");

            $imageLeftSide.selectAll('span')
                .append("input")
                .attr("type","radio")
                .attr("name","threeDemenArrows"+arrowInitOptions.roadType)
                .attr("value",function(d){return d.code})
                .property("checked",function(d){
                    if(d.code ==  arrowInitOptions.target){
                        return true;
                    }
                    return false;
                })
                .on('change',function(d){
                    var tagtype = arrowInitOptions.roadType;
                    self.arrowResult[tagtype] = d.code;
                    var url  = d.url;
                    //var img = d3.select('.line-info-panel .threeDemenArrowTitle-detail right-side-image');
                    var canvas = container.select(' canvas').node();
                    if(!url){
                        var context2d = canvas.getContext('2d');
                        context2d.clearRect(0,0,canvas.width,canvas.height);
                        d3.$('.line-info-title', container).classed('error', true).attr('data-error', '请求不到对应的图片数据');
                        d3.$('.line-info-title input', container).property('value', d.code);
                    }else{
                        self.dataMgr.drawImage(canvas,url);
                        d3.$('.line-info-title input', container).property('value', d.code);
                        d3.$('.line-info-title', container).classed('error', false);
                    }
                });

            $imageLeftSide.selectAll('span')
                .append("text")
                .text(function(d){return d.name});
            //左侧增加清除按钮
            $imageLeftSide.append('div').attr('class','clear-btn').append('input').attr('class','button').attr('type','button').attr('value','清除箭头')
                .on('click.clearBtn',function(d){
                    //var roadtypeselection = container.select('.road-type input:checked').value();
                    self.arrowResult[arrowInitOptions.roadType] = "";
                    container.selectAll('.left-side-image input').property('checked',false);
                    var canvas = container.select('.right-side-image canvas').node();
                    var context2d = canvas.getContext('2d');
                    context2d.clearRect(0,0,canvas.width,canvas.height);
                    d3.$('.line-info-title input', container).property('value', '');
                    // console.log("清除箭头");
                });

            var $imageRightSide = $treeImg.append('div').attr('class','right-side-image');
            //var canvas = $imageRightSide.append('img');
            //canvas.style("width",'196px')
            //canvas.style("heigth",'180px')
            var canvas = $imageRightSide.append('canvas');
            var target = arrowInitOptions.target;
            var targetImg = arrowInitOptions.targetImg;
            if(targetImg!=""){
                var style = 'url('+arrowInitOptions.bgUrl+')';
                $imageRightSide.style('style',function(d){
                    d3.select(this).style('background-image', style);
                    d3.select(this).style('background-repeat', 'no-repeat');
                });
                //$imageRightSide.append('img')
            }
            if(target!=""){
                var arrowArr = arrowInitOptions.arrowArr.filter(function(d){
                    return d.code == target
                });
                if(arrowArr.length>0){
                    var url  = arrowArr[0].url;
                    //canvas.attr("src",url)
                    //self.dataMgr.drawImage(canvas.node(),`${url}`);
                    self.dataMgr.drawImage(canvas.node(),url);
                }
            }

            //console.log('');
            //.style('background-color',"blue");
        },

        getArrowDataArrs: function ($threeDemenArrow,arrowInitOptions,callback) {
            $threeDemenArrow.select('.line-info-panel .threeDemenArrowTitle-detail').remove();
            var context = this.context;
            var datum = arrowInitOptions.maat,tag = arrowInitOptions.roadType,initFlag = arrowInitOptions.initFlag;
            var saat = arrowInitOptions.saat;
            var self = this;
            var targetImg;
            if (tag == "image_id") {
                targetImg = saat.tags.IMAGE_ID;
            } else if (tag == "side_bmp") {
                targetImg = saat.tags.SIDE_BMP;
            }else if(tag == "rear_bmp"){
                targetImg = saat.tags.REAR_BMP;
            }

            if(targetImg!=""){
                var catalogUrl = iD.url.getURL().fms_url+self.urlOptions.catalogUrl;
                var url = catalogUrl +targetImg;
                if(tag == "rear_bmp"){
                    var style = targetImg[0]=="6"?"&style=101":"&style=201";
                    url += style;
                }
                if(tag == "image_id"){
                    var style ="";
                    if(targetImg.indexOf("7040")==0){   // 桥梁隧道泛用图
                        style = "&style=4";
                    }else if(targetImg.indexOf("7080")==0){  //AMAP泛用图
                        style = "&style=5";
                    }
                    url += style;
                }
                //var url = 'http://100.69.192.209:18006/fms-web/file/getByBG?code=80146301';
                d3.json(url, function (error, data) {
                    if (error) {
                        Dialog.alert('请求不到对应的箭头数据！');
                        return [];
                    }
                    var bgUrl = data.bg?data.bg[0].url:"";
                    var arrowArr = [];
                    //Dialog.alert(data);
                    var arr = data.ar || [];
                    var tempArr = [];
                    arr = _.sortBy(arr, function(d){return d.code});
                    if(tag == "rear_bmp"){
                        tempArr = arrowInitOptions.self.commonRealArrow;
                        //tempArr =_.assign(tempArr,arr);
                        self.dataMgr.updataArray(tempArr,arr);
                        tempArr.forEach(function (arrow, index) {
                            var str = "箭头" + arrow.code.substr(0,1);
                            arrow = _.assign(arrow, {'name': str});
                            arrowArr.push(arrow);
                        });
                    }else{
                        arr.forEach(function (arrow, index) {
                            var str = "箭头" + (index + 1);
                            arrow = _.assign(arrow, {'name': str});
                            arrowArr.push(arrow);
                        });
                    }

                    arrowInitOptions = _.assign(arrowInitOptions,{'self':self,'targetImg':targetImg,'bgUrl':bgUrl,'arrowArr':arrowArr});
                    callback($threeDemenArrow,arrowInitOptions);
                });
            }

        },

        getInitArrowOption: function(roadTagTpye,datum,context,initFlag){
            var self = this;
            var saatArrs = this.dataMgr.getSaatFromMaat(context, datum);
            var type,title,disabled = false;

            var image_id = saatArrs[0].tags.IMAGE_ID;
            if(roadTagTpye=="image_id"){
                type = ['20','21'];
                title = "3D箭头";
                //disabled = (image_id.indexOf("7040")==0);
            }else if(roadTagTpye=="rear_bmp"){
                type = ['10','11'];
                title = "实景箭头";
            }else if(roadTagTpye = "side_bmp"){
                type = ['40'];
                title = "辅路箭头"
            }
            var initOptions = {'saat':saatArrs[0],'maat':datum,'initFlag':initFlag,disabled:disabled};

            var guidancePicArr = self.dataMgr.getGuidancePic(datum,context,type);
            var target = "";    //初始化时候选中的3D箭头
            if(guidancePicArr.length>0){
                target = guidancePicArr[0].tags.PIC_AR;
            }
            var saat_rear_bmp ="";
            if(saatArrs.length>0){
                saat_rear_bmp = saatArrs[0].tags.REAR_BMP;
            }

            var tempRearArrows = [];
            var temp_rear_bmp=saat_rear_bmp.substr(1);
            //生成实景箭头数组， 因为实景箭头显示固定只需要区别类型
            if(roadTagTpye=="rear_bmp" && saat_rear_bmp){
                if(saat_rear_bmp[0]=="5"){
                    _.map(self.highSpeedArr,function(v){
                        tempRearArrows.push({code:v+temp_rear_bmp});
                    });
                }else{
                    _.map(self.ordinaryArr,function(v){
                        tempRearArrows.push({code:v+temp_rear_bmp});
                    });
                }
            }
            self.commonRealArrow = tempRearArrows;

            var initTextValue="";
            if(roadTagTpye =="image_id"){
                if(image_id&&image_id[0]=='7'){
                    initTextValue = "普通箭头:"+target;
                }else {
                    initTextValue = "高速箭头:"+target;
                }
            }else if(roadTagTpye =="side_bmp"){
                initTextValue = "辅路箭头:"+target;
            }else if(roadTagTpye=="rear_bmp"){
                initTextValue = "实景箭头:"+target;
            }

            var arrowInitOptions= _.assign(initOptions,{'roadType':roadTagTpye,'target':target,'initTextValue':initTextValue,'self':self,title:title});
            return arrowInitOptions;
        },
        //单选模版的设定
        select: function (options, selection, initVal,label) {
            selection.append('label').attr('class', 'field-label').html(function (d) {
                return options.label||label;
            });
            var $section = selection.append('span').attr('class', 'field-input');
            var $select = $section.append('select')
                .attr('class', 'select')
                .attr('disabled', function(){
                    if(d3.select('body').attr('role')=='check')return true;
                    //if(isRealpictureScene())return true;
                    return null;
                })
                .on('change', function (d) {
                    d3.select(this.parentElement.parentElement).attr('value', this.value);
                });
            $select.selectAll('option')
                .data(options.options)
                .enter()
                .append('option')
                .attr('value', function (d) {
                    return d.value;
                })
                .attr('selected', function (d) {
                    if (d.value == initVal) {
                        return true;
                    }
                    return null;
                })
                .text(function (d) {
                    return d.label;
                });

        },

        //通过目的地信息列表拼接出textvalue字段
        getTextValueArrForGSP: function(){
            var selections = d3.selectAll('.line-info-panel .main-context .gsp-detail-left .gsp-select-list ul li label')[0];
            var results = [];
            for(var i=0;i<selections.length;i++){
                var substr = d3.select(selections[i]).text();
                results.push(substr);
            }
            return results;
        },

        doSaveFunc: function (datum) {

            var context = this.context;
            var self = this;
            var dataMgr = this.dataMgr;

            //获取保存时候选择的maat/saat箭头拼接的字符串
            var laneinfoTag = self.dataMgr.getLaneInfoTag();
            var saat,arrowResult;
            if(d3.select('body').attr('role')=='check')return;

            if (self.dataMgr.isSaat(datum)) {
                if(dataMgr.isZeroBugTask()||!dataMgr.isRealPictureTask()){
                    //【编辑】待转灯编辑功能
                    var turnSelection = d3.selectAll('.line-info-panel .lt-turn-left select')[0];
                    var turnTags = {LT_TURN_L:'0',LT_UTURN_L:'0',WAIT_L:'0'};
                    for(var i = 0;i<turnSelection.length;i++){
                        var value = turnSelection[i].value.toString();
                        switch (i){
                            case 0:
                                turnTags.LT_TURN_L = value;
                                break;
                            case 1:
                                turnTags.LT_UTURN_L = value;
                                break;
                            case 2:
                                turnTags.WAIT_L = value;
                                break;
                            default:
                                break;
                        }
                    }
                    datum = datum.mergeTags(turnTags);
                    context.replace(iD.actions.AddEntity(datum), "修改saat上的左转信息");
                    //saar箭头值发生变化标记
                    var fWayId = datum.memberByRole(iD.data.RoleType.ROAD_ID).id;
                    if(datum.tags.LANEINFO!=laneinfoTag){
                        self.arrowValidateFlag[fWayId] = true;
                    }
                    datum = datum.mergeTags({LANEINFO: laneinfoTag});
                    datum = iD.util.tagExtend.updateVerifyTag(datum);
                    context.replace(iD.actions.AddEntity(datum), "修改saat上的箭头信息");

                //     if(datum.tags.IMAGE_ID !=this.image_id){
                //         datum = datum.mergeTags({IMAGE_ID: this.image_id});
                //         datum = iD.util.tagExtend.updateVerifyTag(datum);
                //         self.dataMgr.updataGuidancePicArr(context,datum,['20','21'],datum.tags.image_id)
                //         context.replace(iD.actions.AddEntity(datum), "修改saat上的背景图片");
                //     }
                //
                //     if(datum.tags.SIDE_BMP !=this.side_bmp){
                //         datum = iD.util.tagExtend.updateVerifyTag(datum);
                //         datum = datum.mergeTags({SIDE_BMP: this.side_bmp});
                //         self.dataMgr.updataGuidancePicArr(context,datum,['40'],datum.tags.side_bmp)
                //         context.replace(iD.actions.AddEntity(datum), "修改saat上的辅路背景图片");
                //     }
                // }
                // if(dataMgr.isZeroBugTask()||dataMgr.isRealPictureTask()){
                //     if(datum.tags.REAR_BMP!=this.REAR_BMP){
                //         datum = iD.util.tagExtend.updateVerifyTag(datum);
                //         datum = datum.mergeTags({REAR_BMP: this.rear_bmp});
                //         self.dataMgr.updataGuidancePicArr(context,datum,['10','11'],datum.tags.REAR_BMP)
                //         context.replace(iD.actions.AddEntity(datum), "修改saat上的实景导航背景图片");
                //     }
                }
            } else {
                if(dataMgr.isZeroBugTask()||!dataMgr.isRealPictureTask()){
                    var laneInfoForMaat = self.dataMgr.getLaneInfoRel(datum, context);
                    var lane_no = d3.select('.line-info-panel .maat-line-info .lane-info-number-manul input').value();
                    var lane_no_Arr = lane_no?lane_no.split("|"):[],lane_no_length = lane_no_Arr.length,lane_info_arrow_arr = laneinfoTag.split("|"),arrow_length= lane_info_arrow_arr.length;
                    if(lane_no_length>arrow_length){
                        var tempArr=[];
                        for(var i=0;i<arrow_length;i++){
                            tempArr[i]= lane_no_Arr[i];
                        }
                        lane_no = tempArr.join("|");
                    }
                    //之前maat不存在箭头信息关系
                    if (laneInfoForMaat.length == 0 && laneinfoTag != "") {
                        context.replace(iD.actions.CreateLaneInfo(context, datum.id, {ARROW: laneinfoTag,LANE_NO:lane_no}), "创建maat上的箭头信息");
                    } else if (laneInfoForMaat.length > 0) {
                        laneInfoForMaat[0] = iD.util.tagExtend.updateVerifyTag(laneInfoForMaat[0]);
                        laneInfoForMaat[0] = laneInfoForMaat[0].mergeTags({ARROW: laneinfoTag,LANE_NO:lane_no});
                        context.replace(iD.actions.AddEntity(laneInfoForMaat[0]), "修改maat上的箭头信息");
                    }

                    //获取行车引导线路径tgd上挂在的laneinfo信息
                    var pathResults = self.dataMgr.getPathResults();
                    pathResults.forEach(function (result) {
                        var tgd_rel = context.entity(result.tgd_id);
                        var laneInfoForTgd = self.dataMgr.getLaneInfoRel(tgd_rel, context);
                        //之前tgd不存在箭头信息关系
                        if (laneInfoForTgd.length == 0 && result.arrowTag != "") {
                            context.replace(iD.actions.CreateLaneInfo(context, result.tgd_id, {ARROW: result.arrowTag}, datum), "创建tgd上的箭头信息");
                        } else if (laneInfoForTgd.length > 0) {
                            //}else if(laneInfoForTgd.length > 0&&laneInfoForTgd[0].tags.arrow!=result.arrowTag){
                            laneInfoForTgd[0] = iD.util.tagExtend.updateVerifyTag(laneInfoForTgd[0]);
                            laneInfoForTgd[0] = laneInfoForTgd[0].mergeTags({ARROW: result.arrowTag});
                            context.replace(iD.actions.AddEntity(laneInfoForTgd[0]), "修改tgd上的箭头信息");
                        }
                    })

                    //修改单选信息
                    // var voiceInfoVal = d3.selectAll('.line-info-select #voice-info .select').node().value;
                    // var gd_voice_rel = self.dataMgr.getGuidanceVoiceRel(datum, context);
                    // if (gd_voice_rel.length == 0 && voiceInfoVal != "-1") {
                    //     context.replace(iD.actions.CreateGuidanceVoice(context, datum.id, {voice_info: voiceInfoVal}), "创建maat上的顺行道路");
                    // } else if (gd_voice_rel.length > 0) {
                    //     //}else if(gd_voice_rel.length>0&&gd_voice_rel[0].tags.voice_info!=voiceInfoVal){
                    //     if(voiceInfoVal!="-1"){
                    //         gd_voice_rel[0] = iD.util.tagExtend.updateVerifyTag(gd_voice_rel[0]);
                    //         gd_voice_rel[0] = gd_voice_rel[0].mergeTags({voice_info: voiceInfoVal});
                    //         context.replace(iD.actions.AddEntity(gd_voice_rel[0]), "修改maat上的顺行道路信息");
                    //     }else {
                    //         context.replace(iD.actions.DeleteRelation(gd_voice_rel[0].id),'删除maat上的顺行道路信息');
                    //     }
                    // }
                    //
                    // var dirSlopVal = d3.selectAll('.line-info-select #dir-slop .select').node().value;
                    // var assist_info_rel = self.dataMgr.getAssistInfo(datum, context);
                    // if (assist_info_rel.length == 0 && dirSlopVal != "0") {
                    //     context.replace(iD.actions.CreateAssistInfo(context, datum.id, {dir_slope: dirSlopVal}), "创建maat上的坡度导航");
                    // } else if (assist_info_rel.length > 0) {
                    //     assist_info_rel[0] = iD.util.tagExtend.updateVerifyTag(assist_info_rel[0]);
                    //     assist_info_rel[0] = assist_info_rel[0].mergeTags({dir_slope: dirSlopVal});
                    //     context.replace(iD.actions.AddEntity(assist_info_rel[0]), "修改maat上的坡度导航");
                    // }

                    //保存方向信息
                    // var text_value_arr = self.getTextValueArrForGSP();
                    // var text_value = "";
                    // for(var i=0;i<text_value_arr.length;i++){
                    //     if(i!=text_value_arr.length-1){
                    //         text_value+=text_value_arr[i]+"::";
                    //     }else{
                    //         text_value+=text_value_arr[i];
                    //     }
                    // }
                    // var guidancesp_rel = self.dataMgr.getGuidanceSP(datum,context);
                    // if (guidancesp_rel.length == 0 && text_value != "") {
                    //     context.replace(iD.actions.CreateGuidanceSP(context, datum.id, {textvalue: text_value}), "创建maat上的方向信息");
                    // } else if (guidancesp_rel.length > 0) {
                    //     if(!text_value){
                    //         context.replace(iD.actions.DeleteRelation(guidancesp_rel[0].id),'修改maat上的方向信息');
                    //     }else {
                    //         guidancesp_rel[0] = iD.util.tagExtend.updateVerifyTag(guidancesp_rel[0]);
                    //         guidancesp_rel[0] = guidancesp_rel[0].mergeTags({textvalue: text_value});
                    //         context.replace(iD.actions.AddEntity(guidancesp_rel[0]), "修改maat上的方向信息");
                    //     }
                    // }

                    arrowResult = self.arrowResult;
                    saat = self.dataMgr.getSaatFromMaat(context,datum)[0];
                    var image_id = saat.tags.IMAGE_ID;
                    var side_bmp = saat.tags.SIDE_BMP;

                    var image_id_arrow = arrowResult.image_id;
                    var side_bmp_arrow = arrowResult.side_bmp;
                    //var rear_bmp = saat.tags.rear_bmp;
                    //var rear_bmp_arrow = arrowResult.rear_bmp;


                    //更新普通道路和高速道路的箭头信息
                    var guidancePicArrImage = self.dataMgr.getGuidancePic(datum,context,['20','21']);
                    if(guidancePicArrImage.length==0&&image_id_arrow!=""){
                        var type = image_id[0]=="7"?'20':'21';
                        context.replace(iD.actions.CreateGuidancePicture(context, datum, [],{'pic_ar': image_id_arrow,'pic_bk':image_id,'type':type}), "创建maat上的高速/普通引导图片关系");
                    }else if (guidancePicArrImage.length > 0) {
                        var type = image_id[0]=="7"?'20':'21';
                        guidancePicArrImage[0] = iD.util.tagExtend.updateVerifyTag(guidancePicArrImage[0]);
                        guidancePicArrImage[0] = guidancePicArrImage[0].mergeTags({'pic_ar': image_id_arrow,'pic_bk':image_id,'type':type});
                        context.replace(iD.actions.AddEntity(guidancePicArrImage[0]), "修改maat上的高速/普通引导图片关系");
                    }

                    //更新辅助导航的箭头信息
                    var guidancePicArrSide = self.dataMgr.getGuidancePic(datum,context, ['40']);
                    if(guidancePicArrSide.length==0&&side_bmp_arrow!=""){
                        context.replace(iD.actions.CreateGuidancePicture(context, datum, [],{'pic_ar': side_bmp_arrow,'pic_bk':side_bmp,'type':'40'}), "创建maat上的辅路引导图片关系");
                    }else if (guidancePicArrSide.length > 0) {
                        guidancePicArrSide[0] = iD.util.tagExtend.updateVerifyTag(guidancePicArrSide[0]);
                        guidancePicArrSide[0] = guidancePicArrSide[0].mergeTags({'pic_ar': side_bmp_arrow,'pic_bk':side_bmp});
                        context.replace(iD.actions.AddEntity(guidancePicArrSide[0]), "修改maat上的辅路引导图片关系");
                    }
                }
                if(dataMgr.isZeroBugTask()||dataMgr.isRealPictureTask()){
                    arrowResult = self.arrowResult;
                    saat = self.dataMgr.getSaatFromMaat(context,datum)[0];
                    var rear_bmp = saat.tags.REAR_BMP;
                    var rear_bmp_arrow = arrowResult.rear_bmp;
                    //更新实景箭头信息
                    var guidancePicArrRear = self.dataMgr.getGuidancePic(datum,context,['10','11']);
                    if(guidancePicArrRear.length==0&&rear_bmp_arrow!=""){
                        var rear_type = rear_bmp[0]=="6"?'10':'11';
                        context.replace(iD.actions.CreateGuidancePicture(context, datum, [],{'pic_ar': rear_bmp_arrow,'pic_bk':rear_bmp,'type':rear_type}), "创建maat上的辅路引导图片关系");
                    }else if (guidancePicArrRear.length > 0) {
                        guidancePicArrRear[0] = iD.util.tagExtend.updateVerifyTag(guidancePicArrRear[0]);
                        guidancePicArrRear[0] = guidancePicArrRear[0].mergeTags({'pic_ar': rear_bmp_arrow,'pic_bk':rear_bmp});
                        context.replace(iD.actions.AddEntity(guidancePicArrRear[0]), "修改maat上的实景图片关系");
                    }
                }


            }
            //datum = context.entity(datum.id);
            //this.initContext(this.mainContext, datum);
        },

        dataValidate:function(datum,context){
            var self = this;
            //行车引导线不显示的时候直接跳出
            if(!d3.select('.line-info-panel .main-context .maat-line-info .lane-info-number-input').node()) return ;

            var saatDatum = self.dataMgr.getSaatFromMaat(context,datum);
            var fWayId = saatDatum[0].memberByRole(iD.data.RoleType.ROAD_ID).id;
            var laneinfoTag = self.dataMgr.getLaneInfoTag();
            var laneInfoForMaat = self.dataMgr.getLaneInfoRel(datum, context);
            //之前maat不存在箭头信息关系
            if (laneInfoForMaat.length == 0 && laneinfoTag != "") {
                self.arrowValidateFlag[fWayId] = true;
            } else if (laneInfoForMaat.length > 0&&!self.arrowValidateFlag[fWayId]) {
                self.arrowValidateFlag[fWayId] = (laneInfoForMaat[0].tags.ARROW!=laneinfoTag)?true:false;
            }

            if(!self.arrowValidateFlag[fWayId])return;

            var lane_no_value = d3.select(".line-info-panel .maat-line-info .lane-info-number .lane-info-number-manul input").value();
            var lane_no_flag = self.dataMgr.isLaneNoValidate(lane_no_value,datum,context,self);
            if(lane_no_flag)return;

            var childNodes = d3.select('.line-info-panel .main-context .maat-line-info .lane-info-number-input').node().childNodes;
            var editFlag=false;

            //行车引导线编码不能部分为空
            /*            for(var i=0;i<childNodes.length;i++){
                            if(childNodes[i].className=="disabled") continue;
                            var value = childNodes[i].value;
                            if(value){
                                editFlag = true;
                                break;
                            }
                        }
                        if(editFlag){
                            for(var i=0;i<childNodes.length;i++){
                                if(childNodes[i].className=="disabled") continue;
                                var value = childNodes[i].value;
                                if(!value){
                                    Dialog.alert("行车引导线编号不能部分为空！");
                                    return;
                                }
                            }
                        }*/

            //行车引导线编码数目要和车道线数目相等
            var laneInfoLength = self.dataMgr.getLaneInfoLineNum();
            var lane_no = d3.select('.line-info-panel .maat-line-info .lane-info-number-manul input').value();
            var length = self.dataMgr.parseStr2IntArr(lane_no,'|').length;

            if(lane_no){
                editFlag = true;
            }

            //maat的箭头编码是saat箭头编码的子集
            var laneinfoTag = self.dataMgr.getLaneInfoTag();
            var laneindoTagObject = self.dataMgr.getLaneInfoTagObject(laneinfoTag);
            var saat = self.dataMgr.getSaatFromMaat(context,datum)[0];
            var saatTag = saat.tags.LANEINFO;
            var saatTagObject = self.dataMgr.getLaneInfoTagObject(saatTag);
            var flag=false;   //0代表的是
            for(var key in laneindoTagObject){
                if(laneindoTagObject[key]>saatTagObject[key]){
                    Dialog.alert("行车引导线编辑错误，请重新编辑");
                    flag = true;
                    break;
                }
            }

            if(flag){
                return
            }

            for(var key in laneindoTagObject){
                if(laneindoTagObject[key]<saatTagObject[key]&&laneInfoLength!=length){
                    Dialog.alert("请编辑行车引导线编号");
                    flag = true;
                    break;
                }
            }
            if(flag){
                return
            }

            if(editFlag&&laneInfoLength!=length){
                Dialog.alert("请编辑行车引导线编号");
                return;
            }



        },

        selectElements: function (selectedIDs, flag) {
            var context = this.context;
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                .classed('selected', flag);
        },

        show: function () {
            d3.select('.line-info-panel').remove();
            if (!this.dialog) {
                this.initPanel();
            }
            //this.$panelBox.classed('hidden', false);

            var self = this;
            try {
                self.$panelBody.node().focus();
            } catch (e) {
                console.warn(e);
            }
        },

        showContextByClick: function($mainContext,self,d,enablePreDom){
            var context = this.context;
            var selectedIds = self.dataMgr.getHighlightIds(d);
            var preRel = d3.select('.side-bar-panel ul li.active').data()[0];
            var preSelectedIds = self.dataMgr.getHighlightIds(preRel);
            var selectli = d3.select('.side-bar-panel ul li.active')[0][0];
            self.selectElements(preSelectedIds, false);
            context.enter(iD.modes.Browse(context)); //为了防止偶尔高亮道路不能取消的事情，不知道为啥啊
            d3.select(selectli.parentNode).selectAll("li").classed("active", false);
            d3.select(enablePreDom).classed("active", true);
            self.initContext($mainContext, d);
            self.selectElements(selectedIds, true);
            iD.svg.TurnGuidance().drawDirection(editor.context, d);
        },

        keyBindingShow:function(self,flag){
            var selection = d3.select('.side-bar-panel ul li.active')[0][0];
            var index = selection.getAttribute('index');
            while(!enablePreDom){
                if(flag=="previous"){
                    var flagDom =selection .previousSibling;
                }else{
                    var flagDom =selection .nextSibling;;
                }

                if(flagDom){
                    if(!d3.select(flagDom).classed('disabled')){
                        var enablePreDom = flagDom;      //获得能够点击的选项dom
                    }else{
                        selection = flagDom;
                    }
                }else{
                    break;
                }
            }
            if(enablePreDom){
                var d = d3.select(enablePreDom).data()[0];
                self.showContextByClick(self.mainContext,self,d,enablePreDom);
            }
        },

        hide: function () {
            var context = this.context;
            context.enter(iD.modes.Browse(context));
            iD.svg.TurnGuidanceSeq(context).removeAll();

            this.dialog = null;

            if(this.keybinding){
                d3.select(document).call(this.keybinding.off);
                this.keybinding=null;
            }

            this.context.history().on('change.road_fitler', null);

            this.entities = null;

            this.dispatch.close();
            iD.svg.TurnGuidance().removeDirectionLayer();
        },
        
        disabled: function(graph) {
	        let entity = graph.entity(this.nodeId),
	        	isDirection = true;
	        let ways = graph.parentWays(entity);//获取该节点关联的Road
			ways && ways.length && ways.forEach(function(w) {
				if (w && w.modelName == iD.data.DataType.ROAD && (!w.tags.DIRECTION || w.tags.DIRECTION == "NULL")) {
					isDirection = false;
				}
			});
	        if(!isDirection){
	            return 'not_eligible';
	        }
	        return isDirection;
	    }


    })

})(iD);
