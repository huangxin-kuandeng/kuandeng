iD.svg.WalkAreas = function(projection) {
    // Patterns only work in Firefox when set directly on element.
    // (This is not a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=750632)
    var patterns = {
        wetland: 'wetland',
        beach: 'beach',
        scrub: 'scrub',
        construction: 'construction',
        military: 'construction',
        cemetery: 'cemetery',
        grave_yard: 'cemetery',
        meadow: 'meadow',
        farm: 'farmland',
        farmland: 'farmland',
        orchard: 'orchard'
    };

    var patternKeys = ['landuse', 'natural', 'amenity'];

    var clipped = ['residential', 'commercial', 'retail', 'industrial'];

    function clip(entity) {
        return clipped.indexOf(entity.tags.landuse) !== -1;
    }

    function setPattern(d) {
        for (var i = 0; i < patternKeys.length; i++) {
            if (patterns.hasOwnProperty(d.tags[patternKeys[i]])) {
                this.style.fill = 'url("#pattern-' + patterns[d.tags[patternKeys[i]]] + '")';
                return;
            }
        }
        this.style.fill = '';
    }

    return function drawAreas(surface, graph, entities, filter) { 
        var path = iD.svg.Path(projection, graph, true),
            areas = {},
            multipolygon;

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.geometry(graph) !== 'area' ) continue;
            if(entity.modelName!=iD.data.DataType.WALKAREA) continue;

            multipolygon = iD.geo.isSimpleMultipolygonOuterMember(entity, graph);
            if (multipolygon) {
                areas[multipolygon.id] = {
                    entity: multipolygon.mergeTags(entity.tags),
                    area: Math.abs(entity.area(graph))
                };
            } else if (!areas[entity.id]) {
                areas[entity.id] = {
                    entity: entity,
                    area: Math.abs(entity.area(graph))
                };
            }
        }
        //if(_.isEmpty(areas)){
        //    return
        //}
        areas = d3.values(areas).filter(function hasPath(a) {return path(a.entity); });
        areas.sort(function areaSort(a, b) { return b.area - a.area; });
        areas = _.pluck(areas, 'entity');

        var strokes = areas.filter(function(area) {
            return area.type === 'way';
        });

        var data = {
            clip: areas.filter(clip),
            shadow: strokes,
            stroke: strokes,
            fill: areas
        };

        var clipPaths = surface.selectAll('defs').selectAll('.clipPath')
           .filter(filter)
           .data(data.clip, iD.Entity.key);

        clipPaths.enter()
           .append('clipPath')
           .attr('class', 'clipPath')
           .attr('id', function(entity) { return entity.id + '-clippath'; })
           .append('path');

        clipPaths.selectAll('path')
           .attr('d', path);

        clipPaths.exit()
           .remove();
        var layer_walk= surface.select('.layer-walk');
        var layer_walkarea=layer_walk.selectAll("g.layer.layer-walkarea").data([0]);
        layer_walkarea.enter().insert("g",":first-child").attr("class","layer layer-walkarea");
        var areagroup = layer_walkarea
            .selectAll('g.areagroup')
            .data(['fill', 'shadow', 'stroke']);

        areagroup.enter()
            .append('g')
            .attr('class', function(d) { return 'layer areagroup area-' + d; });

        var paths = areagroup
            .selectAll('path')
            .filter(filter)
            .data(function(layer) { return data[layer]; }, iD.Entity.key);

        // Remove exiting areas first, so they aren't included in the `fills`
        // array used for sorting below (https://github.com/openstreetmap/iD/issues/1903).
        paths.exit()
            .remove();

        var fills = areagroup.selectAll('.area-fill path.area')[0];

        var bisect = d3.bisector(function(node) {
            return -node.__data__.area(graph);
        }).left;

        function sortedByArea(entity) {
            if (this.__data__ === 'fill') {
                return fills[bisect(fills, -entity.area(graph))];
            }
        }

        paths.enter()
            .insert('path', sortedByArea)
            .each(function(entity) {
                var layer = this.parentNode.__data__;

                if(layer === "stroke"){
                	//面自定义样式
                	var lay = iD.Layers.getLayer(entity.layerId);
                	if(lay.style){
                		d3.select(this).style(lay.style);
                	}
                	
                	lay.onDraw && lay.onDraw.call(this,d3.select(this),entity);
                }
                
                this.setAttribute('class', entity.type + ' area ' + (iD.Layers.getLayer(entity.layerId).isTF ? '' : layer) + ' ' + entity.id);

                if (layer === 'fill' && clip(entity)) {
                    this.setAttribute('clip-path', 'url(#' + entity.id + '-clippath)');
                }

                if (layer === 'fill') {
                    setPattern.apply(this, arguments);
                }
            });
            //.call(iD.svg.TagClasses());

        paths
            .attr('d', path);

        paths.classed('area-hidden',function(d){
            return !iD.Layers.getLayer(d.layerId, d.modelName).display;
        });
    };
};




// 面覆盖物渲染，可能需要与普通渲染不同的功能，暂时不合并。后续再说
// mapType 区分地图和鹰眼用 
iD.svg.Polygon = function(projection,context, mapType) {
    // Patterns only work in Firefox when set directly on element.
    // (This is not a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=750632)
    var patterns = {
        wetland: 'wetland',
        beach: 'beach',
        scrub: 'scrub',
        construction: 'construction',
        military: 'construction',
        cemetery: 'cemetery',
        grave_yard: 'cemetery',
        meadow: 'meadow',
        farm: 'farmland',
        farmland: 'farmland',
        orchard: 'orchard'
    };

    var patternKeys = ['landuse', 'natural', 'amenity'];

    var clipped = ['residential', 'commercial', 'retail', 'industrial'];

    function clip(entity) {
        return clipped.indexOf(entity.tags.landuse) !== -1;
    }

    function setPattern(d) {
        for (var i = 0; i < patternKeys.length; i++) {
            if (patterns.hasOwnProperty(d.tags[patternKeys[i]])) {
                this.style.fill = 'url("#pattern-' + patterns[d.tags[patternKeys[i]]] + '")';
                return;
            }
        }
        this.style.fill = '';
    }

    return function drawAreas(surface, graph, entities, filter) {//console.log('drawAreas ..');
        var path = iD.svg.Path(projection, graph, true),
            areas = {},
            multipolygon;

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];

            multipolygon = iD.geo.isSimpleMultipolygonOuterMember(entity, graph);
            if (multipolygon) {
                areas[multipolygon.id] = {
                    entity: multipolygon.mergeTags(entity.tags),
                    area: Math.abs(entity.area(graph))
                };
            } else if (!areas[entity.id]) {
                areas[entity.id] = {
                    entity: entity,
                    area: Math.abs(entity.area(graph))
                };
            }
        }

        areas = d3.values(areas).filter(function hasPath(a) { 
            return path(a.entity); });
        areas.sort(function areaSort(a, b) { return b.area - a.area; });
        areas = _.pluck(areas, 'entity');

        var strokes = areas.filter(function(area) {
            return true;
        });

        var data = {
            clip: areas.filter(clip),
            shadow: strokes,
            stroke: strokes,
            fill: areas
        };

        var clipPaths = surface.selectAll('defs').selectAll('.clipPath')
           .filter(filter)
           .data(data.clip, iD.Entity.key);

        clipPaths.enter()
           .append('clipPath')
           .attr('class', 'clipPath')
           .attr('id', function(entity) { return entity.id + '-clippath'; })
           .append('path');

        clipPaths.selectAll('path')
           .attr('d', path);

        clipPaths.exit()
           .remove();

        var areagroup = surface
            .select(!mapType ? '.layer-polygon' : '.' + mapType +'-layer-polygon')
            .selectAll('g.polygongroup')
            .data(['fill', 'shadow', 'stroke']);

        areagroup.enter()
            .append('g')
            .attr('class', function(d) { return 'layer polygongroup area-' + d; });

        var paths = areagroup
            .selectAll('path')
            .filter(filter)
            .data(function(layer) { return data[layer]; }, iD.Entity.key);

        // Remove exiting areas first, so they aren't included in the `fills`
        // array used for sorting below (https://github.com/openstreetmap/iD/issues/1903).
        paths.exit()
            .remove();

        var fills = areagroup.selectAll('.polygon-fill path.polygon')[0];

        var bisect = d3.bisector(function(node) {
            return -node.__data__.area(graph);
        }).left;

        function sortedByArea(entity) {
            if (this.__data__ === 'fill') {
                return fills[bisect(fills, -entity.area(graph))];
            }
        }

        paths.enter()
            .insert('path', sortedByArea)
            .each(function(entity) {
                var layer = this.parentNode.__data__;
                if(layer === "stroke"){
                    entity.style && d3.select(this).style(entity.style);
                    entity.onDraw && entity.onDraw.call(this,d3.select(this),entity);
                }
                
                this.setAttribute('class', entity.type + (!mapType ? ' area ' : ' ') + layer + ' ' + entity.id);

                if (layer === 'fill' && clip(entity)) {
                    this.setAttribute('clip-path', 'url(#' + entity.id + '-clippath)');
                }

                if (layer === 'fill') {
                    setPattern.apply(this, arguments);
                }
            });
            //.call(iD.svg.TagClasses());

        paths
            .attr('d', path);
        
        paths.classed('area-hidden',function(d){
            return d.display ? true : false;
        });  
        // paths.classed('area-hidden',function(d){
        //     return !d.layerInfo().display;
        // });
    };
};



