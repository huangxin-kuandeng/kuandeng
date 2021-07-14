iD.Way = iD.Entity.way = function iD_Way() {
    if (!(this instanceof iD_Way)) {
        return (new iD_Way()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
};

iD.Way.prototype = Object.create(iD.Entity.prototype);

_.extend(iD.Way.prototype, {
    type: 'way',
    nodes: [],

    extent: function(resolver) {
        return resolver.transient(this, 'extent', function() {
            return this.nodes.reduce(function(extent, id) {
                var node = resolver.hasEntity(id);
                if (node) {
                    return extent.extend(node.extent());
                } else {
                    return extent;
                }
            }, iD.geo.Extent());
        });
    },

    first: function() {
        return this.nodes[0];
    },

    preLastNode: function() {
        return this.nodes[this.nodes.length - 2];
    },
    
    last: function() {
        return this.nodes[this.nodes.length - 1];
    },

    contains: function(node) {
        return this.nodes.indexOf(node) >= 0;
    },

    affix: function(node) {
        if (this.nodes[0] === node) return 'prefix';
        if (this.nodes[this.nodes.length - 1] === node) return 'suffix';
    },
	/**
	 * 权重
	 */
    layer: function() {
    	return 0;
        // explicit layer tag, clamp between -10, 10..
        if (this.tags.layer !== undefined) {
            return Math.max(-10, Math.min(+(this.tags.layer), 10));
        }

        // implied layer tag..
        if (this.tags.location === 'overground') return 1;
        if (this.tags.location === 'underground') return -1;
        if (this.tags.location === 'underwater') return -10;

        if (this.tags.power === 'line') return 10;
        if (this.tags.power === 'minor_line') return 10;
        if (this.tags.aerialway) return 10;
        if (this.tags.bridge) return 1;
        if (this.tags.cutting) return -1;
        if (this.tags.tunnel) return -1;
        if (this.tags.waterway) return -1;
        if (this.tags.man_made === 'pipeline') return -10;
        if (this.tags.boundary) return -10;
		//if (this._zleveltype === 'dnlink') return 2;
		if (this.zlevel) return this.zlevel;
        return 0;
    },

//    isOneWay: function() {
//        // explicit oneway tag..
//        if (['yes', '1', '-1'].indexOf(this.tags.oneway) !== -1) { return true; }
//        if (['no', '0'].indexOf(this.tags.oneway) !== -1) { return false; }
//
//        // implied oneway tag..
//        for (var key in this.tags) {
//            if (key in iD.oneWayTags && (this.tags[key] in iD.oneWayTags[key]))
//                return true;
//        }
//        return false;
//    },
    
    isOneWay: function() {
        return this.tags.ONEWAY === 'yes' ||
            this.tags.ONEWAY === '1' ||
            this.tags.ONEWAY === '-1' ||
            this.tags.WATERWAY === 'river' ||
            this.tags.WATERWAY === 'stream' ||
            this.tags.JUNCTION === 'roundabout' || 
            this.tags.DIRECTION === '2' ||
            this.modelName === iD.data.DataType.BARRIER_GEOMETRY ||
            this.tags.DIRECTION === '3';//线是否有方向 
    },
    
    isOneStopWay: function() {
        return this.tags.DIRECTION === '4';//道路是否禁行
    },
    
    isOneTrafficWay: function(){
    	return this._type === "trafficarrow";
    },
    
    isOneRoadCrossWay: function(){
    	return this._type && this._type === "roadcrossline";
    },
    
    isClosed: function() {
        return this.nodes.length > 0 && this.first() === this.last();
    },
    
    roadClass : function(){
        return this.tags.ROAD_CLASS;
    },
    
    setRoadClass : function(v){
    	 this.tags.ROAD_CLASS = v;
    },
    
    isConvex: function(resolver) {
        if (!this.isClosed() || this.isDegenerate()) return null;

        var nodes = _.uniq(resolver.childNodes(this)),
            coords = _.pluck(nodes, 'loc'),
            curr = 0, prev = 0;

        for (var i = 0; i < coords.length; i++) {
            var o = coords[(i+1) % coords.length],
                a = coords[i],
                b = coords[(i+2) % coords.length],
                res = iD.geo.cross(o, a, b);

            curr = (res > 0) ? 1 : (res < 0) ? -1 : 0;
            if (curr === 0) {
                continue;
            } else if (prev && curr !== prev) {
                return false;
            }
            prev = curr;
        }
        return true;
    },

    isArea: function() {
       // if (this.tags.area === 'yes')
        if(!this.modelName || !iD.ModelEntitys[this.modelName]){
            return false;
        }
//     	if (this.layerInfo().isArea() === 'yes' || this.layerInfo().isArea() === true)
        if(iD.ModelEntitys[this.modelName].type() === 3)
            return true;
        if (!this.isClosed() || this.tags.area === 'no')
            return false;
        if(this.modelName == iD.data.DataType.WALKAREA){
            return true;
        }
        for (var key in this.tags)
            if (key in iD.areaKeys && !(this.tags[key] in iD.areaKeys[key]))
                return true;
        return false;
    },

    isDegenerate: function() {
        return _.uniq(this.nodes).length < (this.isArea() ? 3 : 2);
    },

    areAdjacent: function(n1, n2) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] === n1) {
                if (this.nodes[i - 1] === n2) return true;
                if (this.nodes[i + 1] === n2) return true;
            }
        }
        return false;
    },

    geometry: function(graph) {
        return graph.transient(this, 'geometry', function() {
            return this.isArea() ? 'area' : 'line';
        });
    },

    // getSlopes: function(graph){
    //     var rels = graph.parentRelations(this);
    //     var detailSlopes = [];
    //     rels.forEach(function(relation){
    //         if(relation.modelName == iD.data.DataType.DETAILSLOPE){
    //             detailSlopes.push(relation);
    //         }
    //     })
    //     return detailSlopes;
    // },

    getWalkZlevel:function(graph){
        var rels = graph.parentRelations(this);
        var walkZlevel = [];
        rels.forEach(function(relation){
            if(relation.modelName == iD.data.DataType.WALKZLEVEL){
                walkZlevel.push(relation);
            }
        })
        return walkZlevel;
    },
    isNaviType:function()
    {
        var tool={
            "2":true,
            "3":true,
            "6":true,
            "7":true
        }
        if(iD.data.DataType.HIGHWAY== this.modelName)
        {
            if(!tool[this.modelName]){
                return true;
            }else{
                return false;
            }
        }
        return false;
    },
    addNode: function(id, index) {
        var nodes = this.nodes.slice();
        nodes.splice(index === undefined ? nodes.length : index, 0, id);
        return this.update({nodes: nodes});
    },

    updateNode: function(id, index) {
        var nodes = this.nodes.slice();
        nodes.splice(index, 1, id);
        return this.update({nodes: nodes});
    },

    replaceNode: function(needle, replacement) {
        if (this.nodes.indexOf(needle) < 0)
            return this;

        var nodes = this.nodes.slice();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i] === needle) {
                nodes[i] = replacement;
            }
        }
        return this.update({nodes: nodes});
    },

    removeNode: function(id) {
        var nodes = [];

        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            if (node !== id && nodes[nodes.length - 1] !== node) {
                nodes.push(node);
            }
        }

        // Preserve circularity
        if (this.nodes.length > 1 && this.first() === id && this.last() === id && nodes[nodes.length - 1] !== nodes[0]) {
            nodes.push(nodes[0]);
        }

        return this.update({nodes: nodes});
    },
    
    asJXON: function(changeset_id,context,t) {
        var wkt = this.asWKTJXON(changeset_id,context,t);
        if(wkt) return wkt;

        var r = {
            way: {
                '@id': this.osmId(),
                '@modelName':this.modelName,
                '@version': this.version || 0,
                nd: _.map(this.nodes, function(id) {
                    return { keyAttributes: { ref: iD.Entity.id.toOSM(id) } };
                }),
                tag: _.map(this.tags, function(v, k) {
                    return { keyAttributes: { k: k, v: v || '' } };
                })
            }
        };
        if (changeset_id) r.way['@changeset'] = changeset_id;
		if (this.new_id_inherit) r.way['@new_id_inherit'] = this.new_id_inherit;
        return r;
    },
    asJson: function(changeset_id,context,t) {
        var r = {
            // way: {
                'id': this.osmId(),
                '_type':'way',
                'modelName':this.modelName,
                'version': this.version || 0,
                nd: _.map(this.nodes, function(id) {
                    return { ref: iD.Entity.id.toOSM(id) };
                }),
                tag: _.map(this.tags, function(v, k) {
                    return { k: k, v: v || '' } ;
                })
            // }
        };
        if (changeset_id) r['changeset'] = changeset_id;
		if (this.new_id_inherit) r['new_id_inherit'] = this.new_id_inherit;
        return r;
    },

    asWKTJXON : function(changeset_id,context,t){
        var layer = context.layers(this.layerId);
        if(layer && layer.isArea && layer.isLine && layer.wkt && 
//        (layer.isArea() || layer.isLine() )  )    
          ((this.isArea && this.isArea()) || this.type == iD.data.GeomType.WAY )   )
        {
            // if(!this.modelName){
            //     if(layer.isLine()) this.modelName = "";
            //     if(layer.isArea()) this.tags.area = ""; //this.modelName = "LandUse";
            // }
            return this.wktJSON(changeset_id,layer,context,t);
        }
        return false;
    },

    wktJSON : function(_id,l,__,d){
        if(!this.modelName){
            if(l.isLine()) this.modelName = "";
            if(l.isArea()) this.tags.area = ""; //this.modelName = "LandUse";
        }
        // POLYGON LineString
        var wktString = l.isArea() ? 'POLYGON((' + this.convertWKT(__) + '))' 
                                       : 'LineString(' + this.convertWKT(__)+ ')'; 
            wktString =  d == 'deleted' ? '' : wktString;                               
        var r = {
                    'way': {
                        '@id': this.osmId(),
                        '@version': (this.version || 0),
                        wkt : wktString,
                        tag: _.map(this.tags, function(v, k) {
                            return { keyAttributes: { k: k, v: v } };
                        })
                    }
        };
        if (_id) r.way['@changeset'] = _id;
		if (this.new_id_inherit) r.way['@new_id_inherit'] = this.new_id_inherit;
        return r;
    },

    convertWKT : function(context){
        var length = this.nodes.length;
        function get(i){  
            return (i == length - 1)  ? '' : ',';
        };
        var wktString = '';
        _.map(this.nodes, function(id,i) {
           try{
              var l =  context.entity(id).loc;
              wktString += l[0] +' '+ l[1] + get(i);
           }catch(e){}
        });
        return wktString;
    },
    asGeoJSON: function(resolver) {
        return resolver.transient(this, 'GeoJSON', function() {
            var coordinates = _.pluck(resolver.childNodes(this), 'loc');
            if (this.isArea() && this.isClosed()) {
                return {
                    type: 'Polygon',
                    coordinates: [coordinates]
                };
            } else {
                return {
                    type: 'LineString',
                    coordinates: coordinates
                };
            }
        });
    },

    area: function(resolver) {
        return resolver.transient(this, 'area', function() {
            var nodes = resolver.childNodes(this);

            if (!this.isClosed() && nodes.length) {
                nodes = nodes.concat([nodes[0]]);
            }
            var json = {
                type: 'Polygon',
                coordinates: [_.pluck(nodes, 'loc')]
            };
            var area = d3.geo.area(json);

            // Heuristic for detecting counterclockwise winding order. Assumes
            // that OpenStreetMap polygons are not hemisphere-spanning.
            if (d3.geo.area(json) > 2 * Math.PI) {
                json.coordinates[0] = json.coordinates[0].reverse();
                area = d3.geo.area(json);
            }
            return isNaN(area) ? 0 : area;
        });
    },
    
    setRoadClass : function(v){
        this.tags.ROAD_CLASS = v || "45000";
    },

    isRoadClass : function(){
         return this.tags.ROAD_CLASS === '41000' || //高速
            this.tags.ROAD_CLASS === '42000' || //国道
            this.tags.ROAD_CLASS === '43000' || //城市环路、城市快速路
            this.tags.ROAD_CLASS === '44000' || //主要道路
            this.tags.ROAD_CLASS === '45000' || //次要道路
            this.tags.ROAD_CLASS === '47000' || //一般道路
            this.tags.ROAD_CLASS === '51000' || //省道
            this.tags.ROAD_CLASS === '52000' || //县道
            this.tags.ROAD_CLASS === '53000' || //乡村道路
            this.tags.ROAD_CLASS === '54000' || //区县内部道路
            this.tags.ROAD_CLASS === '49'; //非导航道路
    }
});


iD.Polygon =  function iD_Polygon() {
    if (!(this instanceof iD_Polygon)) {
        return (new iD_Polygon()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
    this.graphType =  "polygon";
};

iD.Polygon.prototype = Object.create(iD.Way.prototype);


_.extend(iD.Polygon.prototype, {
     type: 'polygon',
     convertArea : function(){
        var first = this.first();
        var last = this.last();
        if(first != last)
        {
            if (iD.geo.edgeEqual(first.loc, last.loc)) {
                this.nodes.splice(this.nodes.length - 1, 1);
            }
            this.nodes.push(first);
        }
     },
     boundPoints : function(end){
            var xs = [];
            var ys = [];

            xs.push(this.rectangle.start[0]);
            ys.push(this.rectangle.start[1]);
            
            xs.push(this.rectangle.end[0]);
            ys.push(this.rectangle.end[1]);

            var minx = d3.min(xs);
            var miny = d3.min(ys);
            var maxx = d3.max(xs);
            var maxy = d3.max(ys);

            // {top left bottom right }
            var top = [minx,miny];
            var left = [minx,maxy];
            var bottom = [maxx,maxy];
            var right = [maxx,miny];
            return [top,left,bottom,right];
     },
     bounds : function(){
            var xs = [];
            var ys = [];
            for(var i in this.nodes)
            {
                var node = this.nodes[i];
                xs.push(node.loc[0]);
                ys.push(node.loc[1]);
            } 
            var minx = d3.min(xs);
            var miny = d3.min(ys);
            var maxx = d3.max(xs);
            var maxy = d3.max(ys);
            //return {minx : minx,miny : miny,maxx : maxx,maxy : maxy};
            return [[minx,miny],[maxx,maxy]];
     },
    /**
     +----------------------------------------------------------
     * 计算面积
     * 单位：平方米
     +----------------------------------------------------------
     */
     getArea :function(){
        var metrePerDegree = 6378137.0 * Math.PI / 180;
        var sum = 0,arr = this.nodes,len=arr.length;
        if(len < 3){
            return 0;
        }
        for(i = 0; i < len-1; i++){
            var m = arr[i].loc;
            var n = arr[i+1].loc;
            var x1 = m[0] * metrePerDegree * Math.cos(m[1] * Math.PI / 180);
            var y1 = m[1] * metrePerDegree;
            var x2 = n[0] * metrePerDegree * Math.cos(n[1] * Math.PI / 180);
            var y2 = n[1] * metrePerDegree;
            sum += x1 * y2 - x2 * y1;
        }

        var o = arr[i].loc;
        var p = arr[0].loc;
        var xn = o[0] * metrePerDegree * Math.cos(o[1] * Math.PI / 180);
        var yn = o[1] * metrePerDegree;
        var xf = p[0] * metrePerDegree * Math.cos(p[1] * Math.PI / 180);
        var yf = p[1] * metrePerDegree;
        sum += xn * yf - xf * yn;
        var area = 0.5 * Math.abs(sum);
        return Number(area.toFixed(2));
    },
    getTextAttribute : function(){
        return {
            'style' : this['font-style']
            //,
            //'translate' : 'translate('+ x +', '+ y +')'
        };
    },
    asGeoJSON: function(resolver) {
            var coordinates = _.pluck(this.nodes, 'loc');
                return {
                    type: 'Polygon',
                    coordinates: [coordinates]
                };
    },
    area: function(resolver) {
            var json = {
                type: 'Polygon',
                coordinates: [_.pluck(this.nodes, 'loc')]
            };
            var area = d3.geo.area(json);
            // Heuristic for detecting counterclockwise winding order. Assumes
            // that OpenStreetMap polygons are not hemisphere-spanning.
            if (d3.geo.area(json) > 2 * Math.PI) {
                json.coordinates[0] = json.coordinates[0].reverse();
                area = d3.geo.area(json);
            }
            return isNaN(area) ? 0 : area;
    },
    addNode: function(node, index) {
        var nodes = this.nodes;
        nodes.push(node);
        return this;
    },
    moveNode: function(node, index) {
        var nodes = this.nodes;
        index = index || (nodes.length - 2);
        nodes.splice(index, 1, node);
        return this;
    }
});


iD.Polyline =  function iD_Polyline() {
    if (!(this instanceof iD_Polyline)) {
        return (new iD_Polyline()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
    this.graphType =  "polyline";
};

iD.Polyline.prototype = Object.create(iD.Way.prototype);

_.extend(iD.Polyline.prototype, {
     type: 'polyline',
     asGeoJSON: function(resolver) {
            var coordinates = _.pluck(this.nodes, 'loc');
                return {
                    type: 'LineString',
                    coordinates: coordinates
                };
    },
    addNode: function(node, index) {
        var nodes = this.nodes;
        nodes.push(node);
        return this;
    },
    moveNode: function(node, index) {
        var nodes = this.nodes;
        index = index || (nodes.length - 2);
        nodes.splice(index, 1, node);
        return this;
    },
    moveLoc: function(loc) {
        this.last().loc = loc;
        return this;
    },
    getNodes : function(){
        return this.nodes;
    },
    setArrow: function(show, _editor){
    	this.arrow = show;
        if (_editor) _editor.getMap().drawOverlayers();
    }
});



iD.Circle =  function iD_Circle() {
    if (!(this instanceof iD_Circle)) {
        return (new iD_Circle()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
    this.graphType =  "circle";
};

iD.Circle.prototype = Object.create(iD.Node.prototype);


_.extend(iD.Circle.prototype, {
     type: 'circle',
     getRadius: function(_) {
        if(_) this.__ = _;
        return this.__ || 0;
    }
});
//事务面
iD.TransPolygon =  function iD_TransPolygon() {
    if (!(this instanceof iD_TransPolygon)) {
        return (new iD_TransPolygon()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
    this.graphType =  "polygon";
};

iD.TransPolygon.prototype = Object.create(iD.Way.prototype);

_.extend(iD.TransPolygon.prototype, {
    type: 'transpolygon',
    area: function(resolver) {
        var json = {
            type: 'Polygon',
            coordinates: [_.pluck(this.nodes, 'loc')]
        };
        var area = d3.geo.area(json);
        // Heuristic for detecting counterclockwise winding order. Assumes
        // that OpenStreetMap polygons are not hemisphere-spanning.
        if (d3.geo.area(json) > 2 * Math.PI) {
            json.coordinates[0] = json.coordinates[0].reverse();
            area = d3.geo.area(json);
        }
        return isNaN(area) ? 0 : area;
    },
    asGeoJSON: function(resolver) {

        var coords;

        if(!this.nodes || !this.holes
            ||!this.nodes.length || !this.holes.length){

            coords = [];
        }
        else{
            var holdCoords = this.holes ? this.holes.map(function(h){
                    return _.pluck(h, 'loc');
                }) : [];

            coords = [_.pluck(this.nodes, 'loc')].concat(holdCoords);
        }
        // if(holdCoords.some(function(hole){

        //     //console.log(iD.geo.polygonContainsPolygon(hole, coordinates));

        //     return iD.geo.polygonContainsPolygon(hole, coordinates);
        // })){
        //     return {
        //     type: 'Polygon',
        //     coordinates:[]
        //     };
        //  }

        return {
            type: 'Polygon',
            coordinates: coords
        };
    }
});