/**
 * Created by  on 2015/9/1.
 * 门禁信息渲染svg
 */
iD.svg.Effects = function (projection, context) {
    function markerPath(selection, klass) {
    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function imagePath(entity) {
        var block_type = blockTypeAssistInfoRel(entity),
            d = "";
        //if(entity.id =="n81_1964226")
        //    console.warn(block_type);

        if (block_type == "0")         //未设定
            return false;
        //d = "assistInfoPass.png";
        else if (block_type == "1")         //无障碍通行门禁
            d = "assistInfoPass.png";
        else if (block_type == "21" || block_type == "22" || block_type == "23" || block_type == "24" || block_type == "2")
            d = "assistInfoCondition.png";
        else if (block_type == "3")         //不可通行门禁
            d = "assistInfoRefuse.png";

        return context.imagePath(d);
    }


    //判断该实体对象是否存在门禁辅助信息
    function blockTypeAssistInfoRel(entity) {
        var graph = context.graph();
        var block_type = "0";

        if (entity.isRoadNode && entity.isRoadNode()) {
            var rel = graph.parentRelations(entity);
            var count = 0;      //存在ASSISTINFO或者ASSISTINFOC关联关系的maat或者crossmaat个数
            var pre_rel;        //记录前一个存在关联ASSISTINFO的关系
            rel.forEach(function (relation) {
                if (relation.modelName == iD.data.DataType.NODECONN) {      //nodemaat关联ASSISTINFO
                    var secondRel = graph.parentRelations(relation);
                    secondRel.forEach(function (rel) {
                        if (rel.modelName && rel.modelName == iD.data.DataType.ASSISTINFO) {
                            block_type = rel.tags.block_type;
                            count++;
                            if (count >= 2) {
                                block_type = priorBlockType(pre_rel, rel);
                                //if (entity.id == "n81_1964226" && count >= 3)
                                //    console.log(block_type);
                            }
                            if (block_type == rel.tags.block_type) {
                                pre_rel = rel;
                            }
                        }
                    })
                }
            })
        } else if (entity.isRoadCross && entity.isRoadCross()) {
            var rel = graph.parentRelations(entity);
            var countC = 0;      //存在ASSISTINFO或者ASSISTINFOC关联关系的maat或者crossmaat个数
            var pre_rel;        //记录当前优先级最高的ASSISTINFO的关系
            rel.forEach(function (relation) {
                if (relation.modelName == iD.data.DataType.CROSSMAAT) {      //nodemaat关联ASSISTINFO
                    var secondRel = graph.parentRelations(relation);
                    secondRel.forEach(function (rel) {
                        if (rel.modelName && rel.modelName == iD.data.DataType.ASSISTINFOC) {
                            block_type = rel.tags.block_type;
                            countC++;
                            if (countC >= 2) {
                                block_type = priorBlockType(pre_rel, rel);
                            }
                            if (block_type == rel.tags.block_type) {
                                pre_rel = rel;
                            }
                        }
                    })
                }
            })
        }

        return block_type;
    }

    /*
     *传入两个ASSISTINFO或者ASSISTINFOC关系，比较哪个关系的blocktype优先级比较高。
     * 两个方向都有门禁信息的时候，显示一个，如果类型不一样，则显示优先级不可通行>有障碍>无障碍
     *  */
    function priorBlockType(pre_rel, rel) {
        var block_type_pre = pre_rel.tags.block_type;
        var block_type = rel.tags.block_type;
        var final_block_type;
        var conditionArr = ["21", "22", "23", "24"];
        if (block_type == "3" || block_type_pre == "3") {
            final_block_type = "3";
        } else if (conditionArr.indexOf(block_type_pre) >= 0) {
            final_block_type = block_type_pre;
        } else if (conditionArr.indexOf(block_type) >= 0) {
            final_block_type = block_type;
        } else if (block_type == "1" || block_type_pre == "1") {
            final_block_type = "1";
        } else {
            final_block_type = "0";
        }
        return final_block_type;
    }


    function drawEffects(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-forbidinfo').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point crosspoint ' + d.id;
            })
            .order();

        //图片
        group.append('image')
            .call(markerPath, 'image');

        surface.select('.layer-forbidinfo').selectAll('g.point')
            .each(function (entity) {
                var shape = imagePath(entity);
                if (shape !== false) {
                    var node = this.childNodes[0];
                    node.setAttribute('x', '-12');
                    node.setAttribute('y', '-12');
                    node.setAttribute('width', '25');
                    node.setAttribute('height', '25');
                    node.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', shape);
                }
            });


        /**
         group.append('image')
         .call(markerPath, 'image');*/

        /*
         group.append('use')
         .attr('class', 'KDSEditor-icon')
         .attr('transform', 'translate(-6, -20)')
         .attr('clip-path', 'url(#clip-square-12)');
         */

        groups.attr('transform', iD.svg.PointTransform(projection))
            .call(iD.svg.TagClasses());

        // Selecting the following implicitly
        // sets the data (point entity) on the element
        groups.select('.shadow');
        groups.select('.stroke');
        groups.select('.KDSEditor-icon')
            .attr('xlink:href', function (entity) {
                var preset = context.presets().match(entity, context.graph());
                return preset.icon ? '#maki-' + preset.icon + '-12' : '';
            });
        groups.classed('point-hidden', function (d) {
            return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });
        groups.exit()
            .remove();
    }

    drawEffects.available = function (points) {
        //var layerInfo = points[0] && points[0].layerInfo();
        //if (layerInfo) {
        //    var entType = (points[0].modelName || points[0]._type), sublayer = layerInfo.getSubLayerByType(entType);
        //    return sublayer && sublayer.display;
        //}
        //return false;
        return true;
    }

    drawEffects.effects = function (entities, limit) {
        //if (d3.select("#effects-forbid-info")[0][0] !=null &&d3.select("#effects-forbid-info").attr("active") == false)   return [];
        var graph = context.graph(),
            points = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if ((entity.isRoadCross && entity.isRoadCross()) || (entity.isRoadNode && entity.isRoadNode())) {
                var rel = graph.parentRelations(entity);
                rel.forEach(function (relation) {
                    var secondRel = graph.parentRelations(relation);
                    secondRel.forEach(function (rel) {
                        if (rel.modelName && (rel.modelName == iD.data.DataType.ASSISTINFO || rel.modelName == iD.data.DataType.ASSISTINFOC)) {
                            points.push(entity);
                        }
                    })
                })
                if (limit && points.length >= limit) break;
            }
        }
        if (this.available(points)) return points;
        return [];
    };

    return drawEffects;
};
