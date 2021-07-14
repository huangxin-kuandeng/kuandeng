/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-02-24 16:07:30
 * @Description: 
 */
iD.measureinfo.Paste = function(){
    var paste = {};

    paste.add = function(graph,entity,opt){
        if(!entity || !opt){
            return graph;
        }
        var relations = graph.parentRelations(entity,iD.data.DataType.MEASUREINFO);
        if(relations.length){
            return this.update(graph,entity,opt)
        }
        let obj = iD.measureinfo.getParams({
//          method:opt.method,
			method: 5,
            points:opt.data
        });
        relation  = createMeasureinfo(graph,entity,obj);
        graph = graph.replace(relation);
        return graph
    }

    paste.remove = function(graph){
        return graph;
    }

    paste.update = function(graph,entity,opt){
        var currentLayer = iD.measureinfo.getDataLayer(entity);
        var relations = graph.parentRelations(entity,iD.data.DataType.MEASUREINFO);
        if(relations.length ==0){
            return graph;
        }
        relation = relations[0];
        graph = graph.replace(relation.mergeTags(_.extend({}, iD.util.getDefauteTags(iD.data.DataType.MEASUREINFO, currentLayer), {
            METHOD: 2,
            PARAMETER: JSON.stringify(iD.measureinfo.getParams({
                method:5,
                points:opt.data
            }))
        })));
        
        return graph;
    }


    function createMeasureinfo(graph,entity,paras) {

        var currentLayer = iD.measureinfo.getDataLayer(entity);

        var members = [{
            'id': entity.id,
            'modelName': entity.modelName,
            'role': iD.data.Model2Role [entity.modelName],
            'type': iD.data.GeomType.NODE
        }];

        var relation = iD.Relation({
            modelName: iD.data.DataType.MEASUREINFO,
            members: members,
            identifier:currentLayer.identifier,
            layerId: currentLayer.id,
            tags: _.extend({}, iD.util.getDefauteTags(iD.data.DataType.MEASUREINFO, currentLayer), {
                METHOD: 2,
                PARAMETER: JSON.stringify(paras)
            })
        });



        return relation;
    };

    return paste;
}