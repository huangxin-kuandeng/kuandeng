iD.Node = iD.Entity.node = function iD_Node() {
    if (!(this instanceof iD_Node)) {
        return (new iD_Node()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
};

iD.Node.prototype = Object.create(iD.Entity.prototype);

_.extend(iD.Node.prototype, {
    type: 'node',

    extent: function() {
        return new iD.geo.Extent(this.loc);
    },

    geometry: function(graph) {
        return graph.transient(this, 'geometry', function() {
            return graph.isPoi(this) ? 'point' : 'vertex';
        });
    },

    move: function(loc) {
        return this.update({loc: loc});
    },

    isIntersection: function(resolver) {
        return resolver.transient(this, 'isIntersection', function() {
            return resolver.parentWays(this).filter(function(parent) {
                return (parent.tags.highway ||
                    parent.tags.waterway ||
                    parent.tags.railway ||
                    parent.tags.aeroway) &&
                    parent.geometry(resolver) === 'line';
            }).length > 1;
        });
    },

    isHighwayIntersection: function(resolver) {
        return resolver.transient(this, 'isHighwayIntersection', function() {
            return resolver.parentWays(this).filter(function(parent) {
                return parent.tags.highway && parent.geometry(resolver) === 'line';
            }).length > 1;
        });
    },

    asJXON: function(changeset_id,context,t) {
        var layer = context.layers(this.layerId);
        if(layer && layer.isArea && layer.isLine && layer.wkt && 
//        (layer.isArea() || layer.isLine() )   )    
          ((this.isArea && this.isArea()) || this.type == iD.data.GeomType.WAY )   )    
        {
            if( t === 'deleted' ||  t === 'created') return [];
            var way = context.graph().parentWays(this)[0];
            return way.wktJSON(changeset_id,layer,context);
        }
       
        var r = {
            node: {
                '@id': this.osmId(),
                '@lon': this.loc[0],
                '@lat': this.loc[1],
                '@z': this.loc[2] || -1,
                '@modelName':this.modelName,
                '@version': (this.version || 0),
                tag: _.map(this.tags, function(v, k) {
                    return { keyAttributes: { k: k, v: v || '' } };
                })
            }
        };
        if (changeset_id) r.node['@changeset'] = changeset_id;
        if (this.new_id_inherit) r.node['@new_id_inherit'] = this.new_id_inherit;
		if (this.members) r.node['member'] = _.map(this.members, function(member) {
                    return { keyAttributes: { type: member.type, role: member.role, ref: iD.Entity.id.toOSM(member.id) } };
                });
        return r;
    },

    asJson: function(changeset_id,context,t) {
        var layer = context.layers(this.layerId);
        if(layer && layer.isArea && layer.isLine && layer.wkt && 
//        (layer.isArea() || layer.isLine() )   )    
          ((this.isArea && this.isArea()) || this.type == iD.data.GeomType.WAY )   )    
        {
            if( t === 'deleted' ||  t === 'created') return [];
            var way = context.graph().parentWays(this)[0];
            return way.wktJSON(changeset_id,layer,context);
        }
       
        var r = {
            // node: {
                'id': this.osmId(),
                'lon': this.loc[0],
                '_type':'node',
                'lat': this.loc[1],
                'z': this.loc[2] || -1,
                'modelName':this.modelName,
                'version': (this.version || 0),
                tag: _.map(this.tags, function(v, k) {
                    return { k: k, v: v || '' } ;
                })
            // }
        };
        if (changeset_id) r['changeset'] = changeset_id;
        if (this.new_id_inherit) r['new_id_inherit'] = this.new_id_inherit;
		if (this.members) r['member'] = _.map(this.members, function(member) {
                    return { type: member.type, role: member.role, ref: iD.Entity.id.toOSM(member.id) };
                });
        return r;
    },

    asGeoJSON: function() {
        return {
            type: 'Point',
            coordinates: this.loc
        };
    },

    // Return the first member with the given id. A copy of the member object
    // is returned, extended with an 'index' property whose value is the member index.
    memberById: function(id) {
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].id === id) {
                return _.extend({}, this.members[i], {index: i});
            }
        }
    },
    
    isRoadCross: function () {
    	// return this.modelNameTypeMatch(iD.data.Constant.C_NODE);
    	return this.modelName === iD.data.Constant.C_NODE || this._type === 'roadcross';
    },

    isPlaceName: function () {
        return this.modelName === iD.data.DataType.PLACENAME || this._type === iD.data.DataType.PLACENAME || this._type === 'placename';
    },
    
    isSearchPoint: function () {
        return this.modelName === iD.data.DataType.SEARCH_POINT || this._type === iD.data.DataType.SEARCH_POINT || this._type === 'searchpoint';
    },

    isDetailSlope: function () {
        return this.modelName === iD.data.DataType.DETAILSLOPE || this._type === 'detailslope';
    },

    isWalkZlevel: function () {
        return this.modelName === iD.data.DataType.WALKZLEVEL || this._type === 'walkzlevel';
    },

    isQcTag: function () {
        return this.modelName === 'QC_TAG' || this._type === 'QC_TAG';
    },
    
    isRoadNode: function () {
    	return this.modelName === iD.data.DataType.ROAD_NODE;
    },
    isEndpoint: function(resolver) {
        var id = this.id;
        return resolver.parentWays(this).filter(function(parent) {
                return !parent.isClosed() && !!parent.affix(id);
            }).length > 0;
    },
    getParentWays:function(graph)
    {
        var ways=[];
        graph.parentWays(this).forEach(function(way){
            if(!way.isOneRoadCrossWay()){
                ways.push(way);
            }
        })
        return ways;
    },
    isWalkEnter: function () {
        return this.modelName === iD.data.DataType.WALKENTER;
    },
     isWalkAreaPoint: function () {
        return this.modelName === iD.data.DataType.WALKAREA;
    },
    setHighway : function(){
        this.modelName = "Highway"; //如无属性则会产生坏数据，后台无法处理
    },
    setRoadNode : function(){
        this.modelName = iD.data.DataType.ROAD_NODE;
    },
	isRoadZLevel: function () {
    	return this.modelName === 'ZLevel' || this._type === 'zlevel';
    },
	isSpeedcamera: function () {
    	return this.modelName === 'SpeedCamera' || this._type === 'speedcamera';
    },
    //updateMember: function(members) {
		//return this.update({members: members});
    //},
    updateMember: function(member, index) {
        if(arguments.length ==2){
            var members = this.members.slice();
            members.splice(index, 1, _.extend({}, members[index], member));
            return this.update({members: members});
        }else{
            return this.update({members: member});
        }

    }
});




iD.Marker = function iD_Marker() {
    if (!(this instanceof iD_Marker)) {
        return (new iD_Marker()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
    this.graphType =  "marker";
};

iD.Marker.prototype = Object.create(iD.Node.prototype);
_.extend(iD.Marker.prototype, {
    type: 'marker',
    initialize: function(sources) {
        for (var i = 0; i < sources.length; ++i) {
            var source = sources[i];
            for (var prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    this[prop] = source[prop];
                }
            }
        }

        if (!this.id && this.type) {
            this.id = iD.Entity.id(this.type);
        }

        if (iD.debug) {
            Object.freeze(this);
            Object.freeze(this.tags);

            if (this.loc) Object.freeze(this.loc);
            if (this.nodes) Object.freeze(this.nodes);
            if (this.members) Object.freeze(this.members);
        }
        // style        
        this['font-style'] = iD.util.merge(this['font-style'] || this['style'] || [] , iD.store.markerstyle.fontStyle );
        this['rect-style'] = iD.util.merge(this['rect-style'] || [] , iD.store.markerstyle.rectStyle );
        this['arrow-style'] = iD.util.merge(this['arrow-style'] || [] , iD.store.markerstyle.arrowStyle );

        if(!this.offset)
        {
           this.offset = [0,0]
        }
        if(!this.width)
        {
           this.width = 25;
        }
        if(!this.height)
        {
           this.height = 25;
        }

        return this;
    },
    setVertices : function(_){
       this.vertices = _;
    },
    getVertices : function(_){
       return this.vertices || false;
    },
    getOffset : function(){
        return this.offset;
    },
    getSize : function(){
        return [this.width ,this.height ];
    },
    getLabelSize : function(){
        return this.label.length;
    },
    getFontSize : function(){
        return parseInt(this['font-style']['font-size']);
    },
    getSizeCenter : function(){
        return [this.width  / 2,this.height  / 2];
    },
    getAttribute : function(){
        var x = -this.getSizeCenter()[0] + this.offset[0] ,
            y = -this.getSizeCenter()[1] + this.offset[1] ;
        if( parseInt(this.shape) == 0)
        {
            x += this.getSizeCenter()[0];
            y += this.getSizeCenter()[0]; 
        } 
        return {
                'translate' : 'translate('+ x +', '+ y +')'
               };
    },
    getRectAttribute : function(){
        var x = this.getSizeCenter()[0] + this.offset[0] ,
            y = this.offset[1] - this.getFontSize() / 2  ;
        return {
                'width' : this.getLabelSize() * this.getFontSize(),
                'height' : this.getFontSize(),
                'style' : this['rect-style'],
                'translate' : 'translate('+ x +', '+ y +')'
               };
    },
    getTextAttribute : function(){
        var x = this.getSizeCenter()[0] + this.offset[0] ,
            y = this.getFontSize() / 3  + this.offset[1] ;   
        return {
                'style' : this['font-style'],
                'translate' : 'translate('+ x +', '+ y +')'
               };    
    },
    getArrowAttribute : function(){
        var a = iD.util.angleTranslate(parseFloat(this['arrow-angle']),5);
        var x = a.x + this.offset[0];
        var y = a.y + this.offset[1];
        return {
                'style' : this['arrow-style'],
                'translate' : 'translate(' + (x) + ', ' + (y) + ') scale(0.45) rotate(' + (a.angle) + ')'
               };    
    }
});    


// 图片类 暂时没有用上, 时间宽裕再综合考量。
iD.Icon = function iD_Icon() {
    if (!(this instanceof iD_Icon)) {
        return (new iD_Icon()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
    this.graphType =  "marker";
};
iD.Icon.prototype = Object.create(iD.Marker.prototype);
_.extend(iD.Icon.prototype, {
    type : 'icon',
    graph : function(){
        // 逻辑处理...
    }
});    
