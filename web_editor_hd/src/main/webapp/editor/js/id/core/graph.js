iD.Graph = function(other, mutable) {
    if (!(this instanceof iD.Graph)) return new iD.Graph(other, mutable);

    if (other instanceof iD.Graph) {
        var base = other.base();
        this.entities = _.assign(Object.create(base.entities), other.entities);
        this._parentWays = _.assign(Object.create(base.parentWays), other._parentWays);
        this._parentRels = _.assign(Object.create(base.parentRels), other._parentRels);

    } else {
        this.entities = Object.create({});
        this._parentWays = Object.create({});
        this._parentRels = Object.create({});
        this.rebase(other || [], [this]);
    }

    this.transients = {};
    this._childNodes = {};

    if (!mutable) {
        this.freeze();
    }
};

iD.Graph.prototype = {
    extendNode: function(node, loc, tags) {
    //创建新的点
        let layer = iD.Layers.getLayer(node.layerId);
      var newNode = iD.Node({
          identifier:layer.identifier,
          layerId:node.layerId,
          loc:(loc || node.loc),
          modelName:node.modelName
      });
      // newNode.layerId = node.layerId;
//    newNode.layertype = node.layertype;
//       newNode.loc = (loc || node.loc);
      newNode.version = node.version;
//      newNode = newNode.mergeTags(node.tags);
      newNode = newNode.mergeTags(tags);
      return newNode;   
    },
    extendWay: function(way) {
        let layer = iD.Layers.getLayer(way.layerId);
        var newWay = iD.Way({
            layerId:way.layerId,
            identifier:layer.identifier,
            nodes:way.nodes
            ,modelName:way.modelName
        });
          newWay.version = way.version;
          newWay = newWay.mergeTags(way.tags);
         return newWay;
    },
    hasEntity: function(id) {
        return this.entities[id];
    },

    entity: function(id) {
        var entity = this.entities[id];
        if (!entity) {
            throw new Error('entity ' + id + ' not found');
        }
        return entity;
    },

    transient: function(entity, key, fn) {
        var id = entity.id,
            transients = this.transients[id] ||
            (this.transients[id] = {});

        if (transients[key] !== undefined) {
            return transients[key];
        }

        transients[key] = fn.call(entity);

        return transients[key];
    },

    parentWays: function(entity) {
        return _.map(this._parentWays[entity.id], this.entity, this);
    },

    isPoi: function(entity) {

        if(entity && entity.type === 'node'&&(entity.isPlaceName()||entity.isRoadCross()||entity.isQcTag()))
        {
            return true;
        }
        var parentWays = this._parentWays[entity.id];
        return !parentWays || parentWays.length === 0;
    },

    isShared: function(entity) {
        var parentWays = this._parentWays[entity.id];
        return parentWays && parentWays.length > 1;
    },

    parentRelations: function(entity,modelName) {
        var  relIds=this._parentRels[entity.id];
        var rels=[];
        if(relIds)
        {
            for(var i=0;i<relIds.length;i++)
            {
                var id=relIds[i];
                var entity=this.entities[id];
                if(arguments.length ==1) {
                    if(entity)
                    {
                        rels.push(entity);
                    }
                }
                else if(entity&&modelName==entity.modelName){
                    rels.push(entity);
                }
            }
        }
        return rels;
    },

    // parentRelations: function(entity) {
    //     return _.map(this._parentRels[entity.id], this.entity, this);
    // },

    childNodes: function(entity) {
        if (this._childNodes[entity.id])
            return this._childNodes[entity.id];

        var nodes = [];
        for (var i = 0, l = entity.nodes.length; i < l; i++) {
            nodes[i] = this.entity(entity.nodes[i]);
        }

        if (iD.debug) Object.freeze(nodes);

        this._childNodes[entity.id] = nodes;
        return this._childNodes[entity.id];
    },

    base: function() {
        return {
            'entities': iD.util.getPrototypeOf(this.entities),
            'parentWays': iD.util.getPrototypeOf(this._parentWays),
            'parentRels': iD.util.getPrototypeOf(this._parentRels)
        };
    },

    // Unlike other graph methods, rebase mutates in place. This is because it
    // is used only during the history operation that merges newly downloaded
    // data into each state. To external consumers, it should appear as if the
    // graph always contained the newly downloaded data.
    rebase: function(entities, stack) {
        var base = this.base(),
            i, j, k, id;

        for (i = 0; i < entities.length; i++) {
            var entity = entities[i];

            if (base.entities[entity.id])
                continue;

            // Merging data into the base graph
            base.entities[entity.id] = entity;
            this._updateCalculated(undefined, entity,
                base.parentWays, base.parentRels);

            // Restore provisionally-deleted nodes that are discovered to have an extant parent
            if (entity.type === 'way') {
                for (j = 0; j < entity.nodes.length; j++) {
                    id = entity.nodes[j];
                    for (k = 1; k < stack.length; k++) {
                        var ents = stack[k].entities;
                        if (ents.hasOwnProperty(id) && ents[id] === undefined) {
                            delete ents[id];
                        }
                    }
                }
            }
        }

        for (i = 0; i < stack.length; i++) {
            stack[i]._updateRebased();
        }
    },

    _updateRebased: function() {
        var base = this.base(),
            i, k, child, id, keys;

        keys = Object.keys(this._parentWays);
        for (i = 0; i < keys.length; i++) {
            child = keys[i];
            if (base.parentWays[child]) {
                for (k = 0; k < base.parentWays[child].length; k++) {
                    id = base.parentWays[child][k];
                    if (!this.entities.hasOwnProperty(id) && !_.contains(this._parentWays[child], id)) {
                        this._parentWays[child].push(id);
                    }
                }
            }
        }

        keys = Object.keys(this._parentRels);
        for (i = 0; i < keys.length; i++) {
            child = keys[i];
            if (base.parentRels[child]) {
                for (k = 0; k < base.parentRels[child].length; k++) {
                    id = base.parentRels[child][k];
                    if (!this.entities.hasOwnProperty(id) && !_.contains(this._parentRels[child], id)) {
                        this._parentRels[child].push(id);
                    }
                }
            }
        }

        this.transients = {};

        // this._childNodes is not updated, under the assumption that
        // ways are always downloaded with their child nodes.
    },

    // Updates calculated properties (parentWays, parentRels) for the specified change
    _updateCalculated: function(oldentity, entity, parentWays, parentRels) {

        parentWays = parentWays || this._parentWays;
        parentRels = parentRels || this._parentRels;        //获取原本老的道路和结点的父关系

        //作为关系存储的特例数组
        // var asRelations = [iD.data.Constant.C_NODE,iD.data.DataType.C_TRAFFICRULE,iD.data.DataType.TRAFFICRULE];

        let type = entity && entity.type || oldentity && oldentity.type,
            removed, added, ways, rels, i;

        if (type === 'way') {

            // Update parentWays
            if (oldentity && entity) {
                removed = _.difference(oldentity.nodes, entity.nodes);
                added = _.difference(entity.nodes, oldentity.nodes);
            } else if (oldentity) {
                removed = oldentity.nodes;
                added = [];
            } else if (entity) {
                removed = [];
                added = entity.nodes;
            }
            for (i = 0; i < removed.length; i++) {
                parentWays[removed[i]] = _.without(parentWays[removed[i]], oldentity.id);
            }
            for (i = 0; i < added.length; i++) {
                ways = _.without(parentWays[added[i]], entity.id);
                ways.push(entity.id);
                parentWays[added[i]] = ways;
            }

        } else if (type === 'relation') {


            // Update parentRels
            if (oldentity && entity) {
                removed = _.difference(oldentity.members, entity.members);
                added = _.difference(entity.members, oldentity);
            } else if (oldentity) {
                removed = oldentity.members || [];
                added = [];
            } else if (entity) {
                removed = [];
                added = entity.members || [];
            }
            for (i = 0; i < removed.length; i++) {
                parentRels[removed[i].id] = _.without(parentRels[removed[i].id], oldentity.id);
            }
            for (i = 0; i < added.length; i++) {
                rels = _.without(parentRels[added[i].id], entity.id);       // 此处的parentRels里面没有对应的增加的道路，对应corssmaat不能根据关联道路取出来
                rels.push(entity.id);
                parentRels[added[i].id] = rels;
            }
        }else if(type==='node' && ((oldentity && iD.data.asRelations.indexOf(oldentity.modelName)>-1)||(entity && iD.data.asRelations.indexOf(entity.modelName)>-1)))
        {
            if (oldentity && entity) {
                removed = _.difference(oldentity.members, entity.members);
                added = _.difference(entity.members, oldentity);
            } else if (oldentity) {
                removed = oldentity.members || [];
                added = [];
            } else if (entity) {
                removed = [];
                added = entity.members || [];
            }
            for (i = 0; i < removed.length; i++) {
                parentRels[removed[i].id] = _.without(parentRels[removed[i].id], oldentity.id);
            }
            for (i = 0; i < added.length; i++) {
                rels = _.without(parentRels[added[i].id], entity.id);       // 此处的parentRels里面没有对应的增加的道路，对应corssmaat不能根据关联道路取出来
                rels.push(entity.id);
                parentRels[added[i].id] = rels;
            }
        }
    },

    replace: function(entity) {
        //if(entity.modelName&&(entity.modelName == iD.data.DataType.HIGHWAY)&&entity.type =="way"){
        //    entity = iD.util.tagExtend.updateWayLengthTag(this,entity);
        //}
        /*
        if (this.entities[entity.id] === entity)
            return this;
        */
       	if(_.isEqual(this.entities[entity.id], entity)){
       		return this;
       	}

        return this.update(function() {
            this._updateCalculated(this.entities[entity.id], entity);
            this.entities[entity.id] = entity;
        });
    },

    remove: function(entity) {
        return this.update(function() {
            this._updateCalculated(entity, undefined);
            this.entities[entity.id] = undefined;
        });
    },

    update: function() {
        var graph = this.frozen ? iD.Graph(this, true) : this;

        for (var i = 0; i < arguments.length; i++) {
            arguments[i].call(graph, graph);
        }

        return this.frozen ? graph.freeze() : this;
    },

    freeze: function() {
        this.frozen = true;

        // No longer freezing entities here due to in-place updates needed in rebase.

        return this;
    },

    // Obliterates any existing entities
    load: function(entities) {
        var base = this.base();
        this.entities = Object.create(base.entities);

        for (var i in entities) {
            this.entities[i] = entities[i];
            this._updateCalculated(base.entities[i], this.entities[i]);
        }

        return this;
    }
};
