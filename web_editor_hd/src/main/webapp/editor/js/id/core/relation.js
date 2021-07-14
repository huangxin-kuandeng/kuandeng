iD.Relation = iD.Entity.relation = function iD_Relation() {
    if (!(this instanceof iD_Relation)) {
        return (new iD_Relation()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
};

iD.Relation.prototype = Object.create(iD.Entity.prototype);

iD.Relation.creationOrder = function(a, b) {
    var aId = parseInt(iD.Entity.id.toOSM(a.id), 10);
    var bId = parseInt(iD.Entity.id.toOSM(b.id), 10);

    if (aId < 0 || bId < 0) return aId - bId;
    return bId - aId;
};

_.extend(iD.Relation.prototype, {
    type: 'relation',
    members: [],

    extent: function(resolver, memo) {
        return resolver.transient(this, 'extent', function() {
            if (memo && memo[this.id]) return iD.geo.Extent();
            memo = memo || {};
            memo[this.id] = true;
            return this.members.reduce(function(extent, member) {
                member = resolver.hasEntity(member.id);
                if (member) {
                    return extent.extend(member.extent(resolver, memo));
                } else {
                    return extent;
                }
            }, iD.geo.Extent());
        });
    },

    geometry: function(graph) {
        return graph.transient(this, 'geometry', function() {
            return this.isMultipolygon() ? 'area' : 'relation';
        });
    },

    isDegenerate: function() {
        return this.members.length === 0;
    },

    // Return an array of members, each extended with an 'index' property whose value
    // is the member index.
    indexedMembers: function() {
        var result = new Array(this.members.length);
        for (var i = 0; i < this.members.length; i++) {
            result[i] = _.extend({}, this.members[i], {index: i});
        }
        return result;
    },

    // Return the first member with the given role. A copy of the member object
    // is returned, extended with an 'index' property whose value is the member index.
    memberByRole: function(role) {
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].role === role) {
                return _.extend({}, this.members[i], {index: i});
            }
        }
    },

    memberBySequence: function (sequence) {
        if (sequence) {
            for (var i = 0; i < this.members.length; i++) {
                if (this.members[i].sequence == sequence) {
                    return _.extend({}, this.members[i], {index: i});
                }
            }
        } else {
            var members = this.members.sort(function (a, b) {
                return parseInt(a.sequence) - parseInt(b.sequence);
            });
            var rmebers = [];
            for (var i = 0, il = members.length; i < il; i++) {
                rmebers.push(_.extend({}, members[i], {index: i}));
            }
            return rmebers;
        }

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

    // Return the first member with the given id and role. A copy of the member object
    // is returned, extended with an 'index' property whose value is the member index.
    memberByIdAndRole: function(id, role) {
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].id === id && this.members[i].role === role) {
                return _.extend({}, this.members[i], {index: i});
            }
        }
    },

    addMember: function(member, index) {
        var members = this.members.slice();
        members.splice(index === undefined ? members.length : index, 0, member);
        return this.update({members: members});
    },

    updateMember: function(member, index) {
        if (arguments.length == 2) {
            var members = this.members.slice();
            members.splice(index, 1, _.extend({}, members[index], member));
            return this.update({members: members});
        } else {
            return this.update({members: member});
        }
       /* var members = this.members.slice();
        members.splice(index, 1, _.extend({}, members[index], member));
        return this.update({members: members});*/
    },

    removeMember: function(index) {
        var members = this.members.slice();
        members.splice(index, 1);
        return this.update({members: members});
    },

    removeMembersWithID: function(id) {
        var members = _.reject(this.members, function(m) { return m.id === id; });
        return this.update({members: members});
    },

    // Wherever a member appears with id `needle.id`, replace it with a member
    // with id `replacement.id`, type `replacement.type`, and the original role,
    // unless a member already exists with that id and role. Return an updated
    // relation.
    replaceMember: function(needle, replacement) {
        if (!this.memberById(needle.id))
            return this;

        var members = [];

        for (var i = 0; i < this.members.length; i++) {
            var member = this.members[i];
            if (member.id !== needle.id) {
                members.push(member);
            } else if (!this.memberByIdAndRole(replacement.id, member.role)) {
                members.push({id: replacement.id,modelName:replacement.modelName, type: replacement.type, role: member.role});
            }
        }

        return this.update({members: members});
    },
    getTurnGuidanceByMaat: function(graph,type){
        var fWayId = this.memberByRole(iD.data.RoleType.FROAD_ID).id;
        var tWayId = this.memberByRole(iD.data.RoleType.TROAD_ID).id;
        var relations = [];
        var relations1 = graph.parentRelations(graph.entity(fWayId),iD.data.DataType.TURN_GUIDANCE);
        // var relations1 = graph.parentRelations(graph.entity(fWayId)).filter(function(d){
        //     if(d.tags.datatype != iD.data.DataType.TURNGUIDANCE) return false;
        //     if(type&& d.tags.type == type){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // });
        var relations2 = graph.parentRelations(graph.entity(tWayId),iD.data.DataType.TURN_GUIDANCE);
        // var relations2 = graph.parentRelations(graph.entity(tWayId)).filter(function(d){
        //     if(d.tags.datatype != iD.data.DataType.TURNGUIDANCE) return false;
        //     if(type&& d.tags.type == type){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // });
        function isInObjectArr(id,arrs){
            for(var i = 0;i<arrs.length;i++){
                if(arrs[i].id == id){
                    return true;
                }
            }
            return false;
        }
        for(var i = 0;i<relations1.length;i++){
            if(isInObjectArr(relations1[i].id,relations2)){
                relations.push(relations1[i]);
            }
        }
        var results = [];
        if(this.modelName == iD.data.DataType.NODECONN){
            for(var i=0;i<relations.length;i++){
                // var firstSeqId = relations[i].memberBySequence("1").id;
                // var secondSeqId = relations[i].memberBySequence("2").id;
                var firstSeqId = relations[i].members[0].id;
                var secondSeqId = relations[i].members[1].id;
                if(firstSeqId == fWayId&&secondSeqId == tWayId){
                    results.push(relations[i]);
                }
            }
        }else if(this.modelName == iD.data.DataType.C_NODECONN){
            for(var i=0;i<relations.length;i++){
                // var firstSeqId = relations[i].memberBySequence("1").id;
                var firstSeqId = relations[i].members[0].id;
                //TODO 获取数据未排序，导致判断失效，暂无数据展示，已反馈
                if(firstSeqId == fWayId){
                    results.push(relations[i]);
                }
            }
        }
        var results = results.sort(function(a,b){
            var aId = iD.Entity.id.toOSM(a.id),bId=iD.Entity.id.toOSM(b.id);
            return bId-aId;

        })
        return results;
    },

    asJXON: function(changeset_id) {
        //TODO:暂时处理，后期不需要model_type字段
        var _temp = {
            '0':'relation',
            '1':'node',
            '2':'way',
            '3':'way'
        }
        var r = {
            relation: {
                '@id': this.osmId(),
                '@version': this.version || 0,
                '@modelName':this.modelName,
                member: _.map(this.members, function(member) {
                    return { keyAttributes: { modelName: member.modelName,type:member.type, role: member.role, ref: iD.Entity.id.toOSM(member.id) } };
                }),
                tag: _.map(this.tags, function(v, k) {
                    return { keyAttributes: { k: k, v: v || '' } };
                })
            }
        };
        iD.util.tagExtend.modelNameErro(r);
        if (changeset_id) r.relation['@changeset'] = changeset_id;
        return r;
    },
    asJson: function(changeset_id) {
  
        var r = {
            // relation: {
                'id': this.osmId(),
                'version': this.version || 0,
                '_type':'relation',
                'modelName':this.modelName,
                member: _.map(this.members, function(member) {
                    return { modelName: member.modelName,type:member.type, role: member.role, ref: iD.Entity.id.toOSM(member.id) };
                }),
                tag: _.map(this.tags, function(v, k) {
                    return { k: k, v: v || '' } ;
                })
            // }
        };
        iD.util.tagExtend.modelNameErro(r);
        if (changeset_id) r.relation['changeset'] = changeset_id;
        return r;
    },


    asGeoJSON: function(resolver) {
        return resolver.transient(this, 'GeoJSON', function () {
            if (this.isMultipolygon()) {
                return {
                    type: 'MultiPolygon',
                    coordinates: this.multipolygon(resolver)
                };
            } else {
                return {
                    type: 'FeatureCollection',
                    properties: this.tags,
                    features: this.members.map(function (member) {
                        return _.extend({role: member.role}, resolver.entity(member.id).asGeoJSON(resolver));
                    })
                };
            }
        });
    },

    area: function(resolver) {
        return resolver.transient(this, 'area', function() {
            return d3.geo.area(this.asGeoJSON(resolver));
        });
    },

    isMultipolygon: function() {
        return this.tags.type === 'multipolygon';
    },

    isComplete: function(resolver) {
        for (var i = 0; i < this.members.length; i++) {
            if (!resolver.hasEntity(this.members[i].id)) {
                return false;
            }
        }
        return true;
    },

    isRestriction: function() {
        return !!(this.tags.type && this.tags.type.match(/^restriction:?/));
    },

    // Returns an array [A0, ... An], each Ai being an array of node arrays [Nds0, ... Ndsm],
    // where Nds0 is an outer ring and subsequent Ndsi's (if any i > 0) being inner rings.
    //
    // This corresponds to the structure needed for rendering a multipolygon path using a
    // `evenodd` fill rule, as well as the structure of a GeoJSON MultiPolygon geometry.
    //
    // In the case of invalid geometries, this function will still return a result which
    // includes the nodes of all way members, but some Nds may be unclosed and some inner
    // rings not matched with the intended outer ring.
    //
    multipolygon: function(resolver) {
        var outers = this.members.filter(function(m) { return 'outer' === (m.role || 'outer'); }),
            inners = this.members.filter(function(m) { return 'inner' === m.role; });

        outers = iD.geo.joinWays(outers, resolver);
        inners = iD.geo.joinWays(inners, resolver);

        outers = outers.map(function(outer) { return _.pluck(outer.nodes, 'loc'); });
        inners = inners.map(function(inner) { return _.pluck(inner.nodes, 'loc'); });

        var result = outers.map(function(o) {
            // Heuristic for detecting counterclockwise winding order. Assumes
            // that OpenStreetMap polygons are not hemisphere-spanning.
            return [d3.geo.area({type: 'Polygon', coordinates: [o]}) > 2 * Math.PI ? o.reverse() : o];
        });

        function findOuter(inner) {
            var o, outer;

            for (o = 0; o < outers.length; o++) {
                outer = outers[o];
                if (iD.geo.polygonContainsPolygon(outer, inner))
                    return o;
            }

            for (o = 0; o < outers.length; o++) {
                outer = outers[o];
                if (iD.geo.polygonIntersectsPolygon(outer, inner))
                    return o;
            }
        }

        for (var i = 0; i < inners.length; i++) {
            var inner = inners[i];

            if (d3.geo.area({type: 'Polygon', coordinates: [inner]}) < 2 * Math.PI) {
                inner = inner.reverse();
            }

            var o = findOuter(inners[i]);
            if (o !== undefined)
                result[o].push(inners[i]);
            else
                result.push([inners[i]]); // Invalid geometry
        }

        return result;
    }
});



// ================================= 交通规则 ===============================
iD.Transportation = iD.Entity.Transportation = function iD_Transportation() {
    if (!(this instanceof iD_Transportation)) {
        return (new iD_Transportation()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
};

iD.Transportation.prototype = Object.create(iD.Entity.prototype);

// ================================= 操作标识 ===============================
iD.Transportation.operations = function(){};

iD.Transportation.operations.set = function(id){
    iD.Transportation.operations.id = id || 0;
};
iD.Transportation.operations.reset = function(value){
    if(!value) 
        iD.Transportation.operations.set();
};
iD.Transportation.operations.is = function(id){
    return iD.Transportation.operations.id == id ? true :  false;
};

iD.Transportation.operations.id = 0;

/**
* 说明
* rule_type  1,5,7全天限行
* rule_time [(h1:00){h24:0}]全天限行
* vehicle  80000000 全天限行
**/

_.extend(iD.Transportation.prototype, {
    isOneDay : function(){
        var status = this.tags.status;
        if(status == 1 || status == 2)
            return false;

        return true; 
    },
    newRelation :  function(option){
        var relation = {};
            relation.id = null;
            relation.version = 1;
            relation.members =  this.members(option);
            relation.tags = this.asTags(option);
        return  relation;
    },
    // 全天限行
    oneDayRelations :  function(rules){
        var transportation = this;
        var ____ = [];
		/**
        relations.forEach(function(relation){
            if(relation.members[2].id == transportation.towayId && relation.tags.rule_type == 1)
            {
                ____.push(relation);
            }
        });*/
		
		rules.forEach(function(rule){
			if (rule.tags.rule_type == 1) ____.push(rule);
		});

        return ____;
    },
    members : function(option){
		/**
        return  [
                    { id: this.fromwayId , role: "from_road" , type: "Highway"},
                    { id: this.nodeId  , role: "node" , type: "RoadNode"},
                    { id: this.towayId , role: "to_road" , type: "Highway"}
                ];*/
		return [{id: option.maat.id, role: "", type: (option.roadcross ? "CrossMaat" : "NodeMaat")}];
    },
    asTags : function(option){
        /**
		return  {
                     "datatype" : "NodeRule",
                     "rule_type" : 1,
                     "rule_time" : "[(h1:00){h24:00}]",
                      "vehicle":"80000000"
                };*/
		return  {
                     // "datatype" : option.roadcross ? "CrossRule" : "NodeRule",
                     "rule_type" : 1,
                     "rule_time" : "[(h1:00){h24:00}]",
                      "vehicle":"0"
                };
    },

    transpToRelations : function(towayId,relations){
       var  trs = [],
            state = 1, // 关系状态 1通行 ,2部分禁行, 3全天禁行
            red = false,
            yellow = false,
            green = false;

        relations.forEach(function(relation){
            if(relation.memberByRole(iD.data.RoleType.TROAD_ID).id == towayId)
                trs.push(relation);
        });

        _(trs).each(function(relation){
            var tags = relation.tags,
                ruletype = tags.rule_type,
                ruletime = tags.rule_time,
                vehicle = tags.vehicle;

             if(ruletype == 1)
                  red = true;  // 判断全天限行 
             else if((ruletype == '' && ruletime == '' && vehicle == '')
                   ||
                   (ruletype == undefined && ruletime == undefined && vehicle == undefined)
                   )
                  green = true;  // 判断不限行
             else 
                  yellow = true; // 判断部分限行
             
        });

        if(red)
            return 3;
        if(yellow)
            return 2;
        if(green)
            return 1;
       return state;
    } ,

    // 创建首位节点
    newTransportations : function(first,last,direction){
        var transps = {} , 
            type = 'transportation' ,
            firstID = iD.Entity.id(type) ,
            lastID = iD.Entity.id(type) ;
             
            transps[firstID] = iD.Transportation({ 
                     'type' : type , 
                     'id' : firstID , 
                     'loc' : first.loc ,
                     'tags' : { node : 'first' } ,
                     'relation' : direction
                }); 

            transps[lastID] = iD.Transportation({ 
                     'type' : type , 
                     'id' : lastID , 
                     'loc' : last.loc ,
                     'tags' : { node: 'last' } ,
                     'relation' : direction
                }); 
        return transps;
    }
});