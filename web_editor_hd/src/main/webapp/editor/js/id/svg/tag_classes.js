// 根据道路等级分配样式
iD.svg.TagClasses = function() {
    var primary = [
            'highway',
            'railway', 'waterway', 'aeroway', 'motorway',
            'boundary', 'power', 'amenity', 'natural', 'landuse',
            'building', 'leisure', 'place','ROAD'
        ],
        secondary = [
            'R_LINE'
        ],
        third = [
            'datatype', 'navitype', 'wf_type'
        ],
        modelNames = [
            iD.data.DataType.DIVIDER,
            iD.data.DataType.BARRIER_GEOMETRY,
            iD.data.DataType.HD_LANE
        ],
		// 道路等级
        roadclass = iD.store.roadclass,
        tagRoadclass = 'ROAD_CLASS',
//      dividerAttrColorClass = iD.store.dividerAttrColor,
//      tagDividerAttrColor = 'COLOR',
		// 车道线类型
        dividerAttrTypeClass = iD.store.dividerAttrType,
        tagDividerAttrType = 'TYPE',
        dividerAttrVirtualClass = iD.store.dividerAttrVirtual,
        tagDividerAttrVirtual = 'VIRTUAL',
        tagClassRe = /^tag-/,
//        tags = function(entity) { return entity.tags; };
        tags = function(entity) {
            // if(entity.modelName == modelName[0]){
             //    classes  += 'model-' + entity.modelName.toLowerCase()
             //    return ;
            // }
			// roadcross(entity);
			return entity.tags;
		},
        roadcross = function(entity) {
			entity._type && (entity.tags[tagRoadclass] = roadclass[entity._type]);
		},
        empty = function(classes) {
			return classes += ' tag-highway tag-highway-service';
		};

    var tagClasses = function(selection, graph, map) {
        selection.each(function tagClassesEach(entity) {
            var classes, value = this.className;

            if (value.baseVal !== undefined) value = value.baseVal;

            classes = value.trim().split(/\s+/).filter(function(name) {
                return name.length && !tagClassRe.test(name);
            }).join(' ');

            var t = tags(entity), i, k, v;
			
			// 根据道路等级分配class
            for (i = 0; i < primary.length; i++) {
                k = primary[i];
//                v = t[k];
                v = roadclass[t[tagRoadclass]];
                if (!v || v === 'no') continue;
                classes += ' tag-' + k + ' tag-' + k + '-' + v;
				// entity.zlevel && (classes += ' tag-' + k + '-zlevel-zlevel');
                break;
            }
			// divider tag COLOR、TYPE、VIRTUAL 。。。
			if(entity.modelName == iD.data.DataType.DIVIDER && graph){
				let keyName;
				// DIVIDER_ATTRIBUTE的relation
				// 每个线上的每个node，点击后在左侧面板改动属性，没有relation时会产生一个DIVIDER_ATTRIBUTE的relation
				// 如果改动的node已经有relation，会直接改动现有relation的tags
				
//				var rels = graph.parentRelations(entity, iD.data.DataType.DIVIDER_ATTRIBUTE);
				let relation = iD.util.getDividerParentRelation(graph, entity, iD.data.DataType.DIVIDER_ATTRIBUTE);
				/*
				if(rels && rels.length){
					var rel = rels[0];
					keyName = rel && rel.tags[tagDividerAttrColor] || "0";
				}else {
					keyName = "0";
				}
				v = dividerAttrColorClass[keyName];
				classes += ' tag-dvattr-' + v;
				*/ 
				
				keyName = relation && relation.tags[tagDividerAttrVirtual] || "0";
				v = dividerAttrVirtualClass[keyName];
				classes += ' tag-dvattr-' + v;
				
				keyName = relation && relation.tags[tagDividerAttrType] || "0";
//				v = dividerAttrTypeClass[keyName] || keyName;
				v = keyName;
				classes += ' tag-dvattr-type-' + v;
			}
			if(entity.modelName == iD.data.DataType.DIVIDER && graph){
				keyName = entity.tags[tagDividerAttrType] || "0";
//				v = dividerAttrTypeClass[keyName] || keyName;
				v = keyName;
				classes += ' tag-dvattr-type-' + v;
			}
			
			
			// point tag SUBTYPE 。。。
			if([iD.data.DataType.OBJECT_PT/*, iD.data.DataType.FUSION_OBJECT_PT*/].includes(entity.modelName) && graph){
				let typeVal = entity.tags.TYPE || 0;
				v = entity.tags.SUBTYPE || 0;
				classes += ' tag-pt-type-' + typeVal;
				classes += ' tag-pt-subtype-' + v;
			}
			if(entity.modelName == iD.data.DataType.LAMPPOST && graph){
				let typeVal = entity.tags.TYPE || 0;
				classes += ' tag-lmp-type-' + typeVal;
			}
			if(entity.modelName == iD.data.DataType.LIMITHEIGHT && graph){
				classes += ' mdn-' + iD.data.DataType.LIMITHEIGHT.toLowerCase();
			}
			if(entity.modelName == iD.data.DataType.QUALITY_TAG && graph){
				classes += ' qa-type-' + (entity.tags.QA_TYPE || '');
			}

            for(i = 0;i<modelNames.length;i++){
                if(entity.modelName == modelNames[i]){
                    classes  += ' model-' + entity.modelName.toLowerCase();
                    if (map.zoom() < 22) {
                        classes += '1';
                    }
                    break;
                }
            }

            for (i = 0; i < secondary.length; i++) {
                k = secondary[i];
                v = t[k];
                if (!v || v === 'no') continue;
                classes += ' tag-' + k + ' tag-' + k + '-' + v;
            }

            // for (i = 0; i < third.length; i++) {
            //     k = third[i];
            //     v = t[k];
            //     if (!v || v === 'no') continue;
            //     classes += ' tag-' + k + '-' + v;
            // }


            !modelNames.includes(entity.modelName) && !t[tagRoadclass] && (classes = empty(classes));

            //console.log(entity.is);
            classes = classes.trim();

            if (classes !== value) {
                d3.select(this).attr('class', classes);
            }
        });
    };

    tagClasses.tags = function(_) {
        if (!arguments.length) return tags;
        tags = _;
        return tagClasses;
    };

    return tagClasses;
};
