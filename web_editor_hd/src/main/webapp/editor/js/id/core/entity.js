iD.Entity = function (attrs) {
    // For prototypal inheritance.
    if (this instanceof iD.Entity) return;

    // Create the appropriate subtype.
    if (attrs && attrs.type) {
        return iD.Entity[attrs.type].apply(this, arguments);
    } else if (attrs && attrs.id) {
        return iD.Entity[iD.Entity.id.type(attrs.id)].apply(this, arguments);
    }

    // Initialize a generic Entity (used only in tests).
    return (new iD.Entity()).initialize(arguments);
};

iD.Entity.id = function (type,layerId) {
    return iD.Entity.id.fromOSM(type, iD.Entity.id.next[type]--,layerId);
};

iD.Entity.id.next = {
    node: -1, way: -1, relation: -1, transportation: -1,
    marker: -1, polyline: -1, polygon: 1000, label: -1, icon: -1,
    circle: -1, transpolygon: -1
};

// iD.Entity.id.fromOSM = function(type, id) {
//     return type[0] + id;
// };

// iD.Entity.id.toOSM = function(id) {
//     return id.slice(1);
// };
iD.Entity.id.delimiter = '_';

iD.Entity.id.fromOSM = function (type, id, _) { //  图层和图层Node Way.id可能相同，通过 layer id区分
    // return type[0]  + id;
    // return type[0] + iD.Entity.id.delimiter + id;
    // return type[0] + iD.Entity.id.delimiter + id;
    // if (_ && (window._systemType == 2 || window._systemType == 1))
    return type[0] + _ + iD.Entity.id.delimiter + id;
    // else return type[0] + iD.Entity.id.delimiter + id;
};
iD.Entity.id.toOSM = function (id) {
    // return id.slice(1);
    // return id.split(iD.Entity.id.delimiter)[1];
	let strs = id.split(iD.Entity.id.delimiter);
 return strs[strs.length - 1];
 []
};

iD.Entity.id.type = function (id) {
    return {'n': 'node', 'w': 'way', 'r': 'relation'}[id[0]];
};

// A function suitable for use as the second argument to d3.selection#data().
iD.Entity.key = function (entity) {
    return entity.id + 'v' + (entity.v || 0);
};

iD.Entity.prototype = {
    tags: {},

    initialize: function (sources) {
        let isTag = false;
        for (var i = 0; i < sources.length; ++i) {
            var source = sources[i];
            if(source.tags){
                isTag = true;
            }
            for (var prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    this[prop] = source[prop];
                }
            }
        }
        if (!this.id && this.type) {
            if(!this.identifier){
                // console.error('entityID: ',this.identifier);
            }
            this.id = iD.Entity.id(this.type,this.identifier);
        }

        // if(!this.layerId) console.warn('新增对象没有传入图层iD',this.id);

        if (iD.debug) {
            Object.freeze(this);
            Object.freeze(this.tags);

            if (this.loc) Object.freeze(this.loc);
            if (this.nodes) Object.freeze(this.nodes);
            if (this.members) Object.freeze(this.members);
        }
        if(this.loc && this.loc.length===2){
            this.loc.push(-1);
        }
        // this.setTags(this.tags);
        if(iD.ModelEntitys && !isTag && this.modelName){
            this.setDefaultTags();
        }else if(!isTag){
            this.tags = {};
        }

        return this;
    },

    osmId: function () {
        return iD.Entity.id.toOSM(this.id);
    },

    isNew: function () {
        return this.osmId() < 0;
    },

    update: function (attrs) {
        // iD.util.tagExtend.modelNameErro(this);
        return iD.Entity(this, attrs, {v: 1 + (this.v || 0)});
    },
    setDefaultTags: function () {
        let defaultTags={};
        if (this.layerId && this.modelName) {
           //  var layerInfo = iD.Layers.getLayerById(this.layerId);
           //
           // var modelEntity=layerInfo.getModelEntityByEntity(this);
            var modelEntity = iD.ModelEntitys[this.modelName]
            if(modelEntity)
            {
                var gtype = modelEntity.getGeoType();
                modelEntity.getFields(gtype).filter(function (d) {
                    if (d.defaultValue && !_.isEmpty(d.defaultValue)) {
                        defaultTags[d.fieldName] = d.defaultValue;
                    }
                });
            }

        }
        this.tags = defaultTags;
        // return _tags;

    },
    // setDefaultTags: function (_) {
    //     let _tags= _;
    //     Object.assign(_tags,_);
    //     if (this.layerId && this.modelName) {
    //         //  var layerInfo = iD.Layers.getLayerById(this.layerId);
    //         //
    //         // var modelEntity=layerInfo.getModelEntityByEntity(this);
    //         var modelEntity = iD.ModelEntitys[this.modelName]
    //         if(modelEntity)
    //         {
    //             var gtype = modelEntity.getGeoType();
    //             modelEntity.getFields(gtype).filter(function (d) {
    //
    //                 if (!_tags.hasOwnProperty(d.fieldName)) {
    //                     _tags[d.fieldName] = d.defaultValue;
    //                 }
    //             });
    //         }
    //
    //     }
    //     return _tags;
    //
    // },
    setTags: function (d) {

        // this.tags = this.setDefaultTags(d);
        this.tags = d;
    },
    mergeTags: function (tags) {
        var merged = _.clone(this.tags), changed = false;
        for (var k in tags) {
            var t1 = merged[k],
                t2 = tags[k];
            if (!t1) {
                changed = true;
                merged[k] = t2;
            } else if (t1 !== t2) {
                changed = true;
                merged[k] = t2; // add 
                //merged[k] = _.union(t1.split(/;\s*/), t2.split(/;\s*/)).join(';'); //delete
            }
        }
        return changed ? this.update({tags: merged}) : this;
    },

    intersects: function (extent, resolver) {
        return this.extent(resolver).intersects(extent);
    },

    isUsed: function (resolver) {
        return _.without(Object.keys(this.tags), 'area').length > 0 ||
            resolver.parentRelations(this).length > 0;
    },
    
    //加此方法 区别交叉点, 孤立点, 普通点
    isInterestingTags: function () {
        return this.modelName == iD.data.DataType.ROAD_NODE
            || this.modelName == iD.data.DataType.DIVIDER_NODE
            || this.modelName == iD.data.DataType.BARRIER_GEOMETRY_NODE
            || this.modelName == iD.data.DataType.ROAD_NODE
            || this.modelName == iD.data.DataType.OBJECT_PL_NODE
            || this.modelName == iD.data.DataType.BRIDGE_NODE
            || this.modelName == iD.data.DataType.OBJECT_PG_NODE
            || this.modelName == iD.data.DataType.HD_LANE_NODE;
//          || this.modelName == iD.data.DataType.TRAFFICSIGN_NODE;
        var tgs = this.tags;
        return _.keys(this.tags).some(function (key) {

            return tgs[key] === 'RoadNode';
        });
    },
    hasInterestingTags: function () {
        return _.keys(this.tags).some(function (key) {
            return key !== 'attribution' &&
                key !== 'created_by' &&
                key !== 'source' &&
                key !== 'odbl' &&
                key.indexOf('tiger:') !== 0;
        });
    },

    isHighwayIntersection: function () {
        return false;
    },

    deprecatedTags: function () {
        var tags = _.pairs(this.tags);
        var deprecated = {};

        iD.data.deprecated.forEach(function (d) {
            var match = _.pairs(d.old)[0];
            tags.forEach(function (t) {
                if (t[0] === match[0] &&
                    (t[1] === match[1] || match[1] === '*')) {
                    deprecated[t[0]] = t[1];
                }
            });
        });

        return deprecated;
    },
    // 判断绘制类型 {marker,polyline,polygon}
    g: function () {
        if (!this.graphType) return false;
        var graphType = this.graphType;
        return {
            marker: function () {
                if (graphType == 'marker')
                    return true;
                return false;
            },
            polyline: function () {
                if (graphType == 'polyline')
                    return true;
                return false;
            },
            polygon: function () {
                if (graphType == 'polygon')
                    return true;
                return false;
            },
            g: function () {
                if (graphType == 'polygon'
                    || graphType == 'polyline'
                    || graphType == 'marker'
                    || graphType == 'circle')
                    return true;
                return false;
            }
        };
    },
    setEnable: function (_, map) {
        this.enable = _;
        if (map) map.getMap().drawOverlayers();
    },
    /**
     * 判断modelName或_type是否符合对应类型
     * @param {String} modelName iD.data.DataType中的类型
     */
    modelNameTypeMatch: function(modelName){
    	return modelName &&
    		this.modelName === modelName 
    			|| this._type === modelName
    			|| this._type === modelName.toLowerCase();
    }
};
