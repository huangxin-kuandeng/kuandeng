iD.ui.Effects = function (context) {
    var defaultEffects = iD.effects.Default(context);
    // LA/DA特效允许同时选中
    var ladaEffect = [
        iD.effects.laneHighlight(context),
        iD.effects.dividerAttrHighlight(context),
        iD.effects.measureInfoHighlight(context),
        iD.effects.ShapePoint(context),
        iD.effects.DividerRL(context),
        iD.effects.DividerRG(context),
        iD.effects.DividerRT(context),
        iD.effects.DividerDT(context),
        iD.effects.DottedSoild(context),
        iD.effects.DividerDrefMemberArea(context),
        // iD.effects.barrerGeometry(context),
        iD.effects.DividerRD(context),
    ];
    var originEffects = [
        iD.effects.DividerArea(context),
        ladaEffect[0], //laneHighlight
        ladaEffect[1], //dividerAttrHighlight
        ladaEffect[2], //measureInfoHighlight
        iD.effects.roadHighlight(context),
        ladaEffect[9], //DividerDrefMemberArea
        iD.effects.labelField(context),
        // iD.effects.wayDirection(context),
        ladaEffect[3],//ShapePoint
        // iD.effects.breakNodeHighlight(context),
        // iD.effects.additionalDivider(context),
        // iD.effects.deleteDivider(context),
        // iD.effects.DividerTL(context),
        iD.effects.TrafficlightTS(context),
        ladaEffect[4],//DividerRL
        ladaEffect[5],//DividerRG
        ladaEffect[6],//DividerRT
        ladaEffect[7],//DividerRS
        ladaEffect[10],//DividerRD
        iD.effects.RoadRS(context),
        iD.effects.objectPGFirstPoint(context),
        iD.effects.flagNodeHighlight(context),
        iD.effects.DividerSideWalk(context),
        iD.effects.junction(context),
        iD.effects.dividerTollgateHiglight(context),
        iD.effects.LaneLT(context),
        iD.effects.LaneLL(context),
        iD.effects.LaneRPL(context),
        iD.effects.LaneRSL(context),
        iD.effects.LaneRSL_N(context),
        iD.effects.LaneRR(context),
        ladaEffect[8]//DottedSoild
    ];
    return function (selection) {
        //更改初始化加载编辑按钮
        var effects = originEffects;

        function effectIsMulti(d) {
            var isMulti = false;
            // var la = ladaEffect[0], da = ladaEffect[1], mi = ladaEffect[2], sp = ladaEffect[3], ds = ladaEffect[8], dg = ladaEffect[9], bl = ladaEffect[10];
            var la = [ladaEffect[0], ladaEffect[1], ladaEffect[3], ladaEffect[8], ladaEffect[9]];
            let rs = [ladaEffect[5], ladaEffect[4], ladaEffect[7], ladaEffect[6]];
            // if (d == da) {  1
            //     isMulti = buttons.filter('#effects-' + d.id).classed('active') && d.enable;
            // } else if (ladaEffect.includes(d)) {
            //     isMulti = buttons.filter('#effects-' + da.id).classed('active') && da.enable;
            // }
            if (rs.includes(d)) {
                rs.forEach(ef => {
                    if (ef.enable) {
                        isMulti = ef.enable;
                    }
                })
            } else if (la.includes(d)) {
                la.forEach(ef => {
                    if (ef.enable) {
                        isMulti = ef.enable;
                    }
                })
            } /*else if (d == la) {
                isMulti = buttons.filter('#effects-' + da.id).classed('active') && da.enable;
            } else if (d == da) {
                isMulti = (buttons.filter('#effects-' + la.id).classed('active') && la.enable) || (buttons.filter('#effects-' + mi.id).classed('active') && mi.enable);
            } else if (d == mi) {
                isMulti = buttons.filter('#effects-' + da.id).classed('active') && da.enable;
            } else if (d == ds) {
                isMulti = buttons.filter('#effects-' + sp.id).classed('active') && sp.enable;
            } else if (d == sp) {
                isMulti = buttons.filter('#effects-' + ds.id).classed('active') && ds.enable;
            }*/
            return isMulti;
        }


        var buttons = selection.selectAll('button')
            .data(effects)
            .enter().append('button')
            .attr('class', 'KDSEditor-col6-1')
            .attr('id', function (d) {
                return 'effects-' + d.id;
            })
            .on('click', function (d) {
                var _tag = "click_" + d.button,
                    _msg = d.description;
                iD.logger.editElement({
                    'tag': _tag,
                    'modelName': '',
                    'type': '',
                    'msg': _msg
                });
                var is_active = d3.select(this).classed("active");
                //对于navitype特效点击时需要加载道路图层
                var elements = iD.Static.layersInfo.getElements();
                if (d.id == 'navitype' && !elements.road.display && !is_active) {
                    d3.select(".layer-manager-pane.KDSEditor-pane .dropdown-menu .item-road i").trigger("click")
                }
                var isMult = effectIsMulti(d);
                // DA/LA允许同时选中
                !isMult && _closeAllEffects(d);
                if (!is_active) {
                    //进入设定特效
                    d3.select(this).classed("active", !is_active);
                    d.enable = true;
                    d.apply(context, true);
                } else {
                    d3.select(this).classed("active", !is_active);
                    defaultEffects.apply(context);
                    d.apply(context, false);
                }
                context.event.changeeffect(d.id, d.enable);
            })
            .call(bootstrap.tooltip()
                .placement('bottom')
                .html(true)
                .title(function (d) {
                    return iD.ui.tooltipHtml(d.description, d.key);
                }));

        buttons.append('div').classed('for-border', true)
            .append('span')
            .attr('class', function (d) {
                return 'KDSEditor-icon ' + d.id + (d.iconText ? ' icon-text' : '');
            }).text(function (d) {
                return d.iconText || '';
            });

        var keybinding = d3.keybinding('effects');

        //快捷键
        effects.forEach(function (m) {
            keybinding.on(m.key, function () {
                buttons.each(function (o) {
                    if (m.button === o.button && !d3.select(this).property('disabled')) {
                        //if (context.editable()) context.enter(m);
                        var _tag = "keydown_" + m.button,
                            _msg = m.description;
                        iD.logger.editElement({
                            'tag': _tag,
                            'modelName': '',
                            'type': 'keydown',
                            'msg': _msg
                        });
                        var isMult = effectIsMulti(o);
                        if (isMult) {
                            buttons.each(function (d) {
                                return !_.pluck(ladaEffect, 'button').include(d.button);
                            }).classed("active", false);
                        } else {
                            buttons.classed("active", false);
                        }
                        !isMult && _closeAllEffects(m);
                        d3.select(this).classed("active", true);
                        m.apply(context, true);
                        //console.log("keybinding",m); 
                    }
                });
            });
        });

        function _closeAllEffects(openedEf) {
            // 每次关闭都会触发重新渲染，影响性能
            for (var i in effects) {
                var ef = effects[i];
                if (ef && ef !== openedEf) {
                    ef.enable = false;
                    ef.apply(context, ef.enable);
                }
            }
            buttons.each(function (d) {
                if (d == openedEf) {
                    return;
                }
                d3.select(this).classed("active", d.enable);
            });
        }

        d3.select(document)
            .call(keybinding);
        var defaultkeybinding = d3.keybinding('defaulteffects');

        //快捷键
        defaultkeybinding.on(defaultEffects.key, function () {
            buttons.classed("active", false);
            defaultEffects.apply(context);
        });
        d3.select(document)
            .call(defaultkeybinding);

        defaultEffects.apply(context);
        //buttons.node().click()

        iD.Task.on('start', function () {
            update();
        });

        context.ui().layermanager.on('change.effects', function () {
            update();
        });
        function update() {
            if (!iD.Task.d || iD.Task.d.tags.branchDataType === '3') {
                buttons.classed('hide', true);
                let _temp = buttons.filter(d=>{return  d.id == 'label-field'});
                _temp.classed('hide',false);
            } else {
                buttons.classed('hide', false);
            }
        }

    };
};
