iD.ui.TagEditor.RoadNodeTagEditor = function(context) {

    var dispatch = d3.dispatch('change');

    function roadNodeTagEditor(selection, opts) {

        var tpl = iD.ui.TagEditorTpl.RoadNode(),
            tags = opts.tags,
            entityID = opts.id,
            entity = context.entity(entityID),
            currentLayer = iD.Layers.getLayer(entity.layerId),
            modelEntity = iD.ModelEntitys[entity.modelName],
            geoType = modelEntity.getGeoType();

        // if (currentLayer.isRoad()) {
        //     var _datatype = tags['datatype'] || '';
        //     var typeModelEntity = currentLayer.typeModelEntity()[_datatype];
        //     if (typeModelEntity) { //只针对子图层
        //         geoType = typeModelEntity.modelId;
        //         modelEntity = typeModelEntity.model;
        //     } else {
        //         geoType = '';
        //     }
        // }


        var fields = modelEntity.getFields(geoType);
        tpl.fieldsGroup[0].fields = iD.ui.TagEditor.createTplFieldList(modelEntity);
        
        var fieldHash = {};
        for (var i = 0, len = fields.length; i < len; i++) {
            fieldHash[fields[i].fieldName] = fields[i];
        }

        context.container().select('.KDSEditor-inspector-wrap  .KDSEditor-header h3').text(tpl.title);

        iD.ui.TagEditor.renderFieldGroups(selection, tpl, {
            layer: currentLayer,
            dispatch: dispatch,
            context: context,
            entity: entity,
            tags: tags,
            fields: fieldHash
        });
        /*
        renderOtherFiels(selection,tpl,{
            tags: tags,
            fields: fieldHash
        });
		*/
    }

    roadNodeTagEditor.available = function(entity) {
        return entity.isRoadNode && entity.isRoadNode();
    }
 /*
     add 渲染 道路不在tpl中的属性，以名值对方式展示
    @param:tpl 预置模板
    @param:opts 
                fields: Object,从dataLayer转换后的 当前entity的所有fields，包含名值对{columnName: "accuracy"，fieldTitle: "路网精度"}
               
                tags: Object，当前entity的所有tags
    */
    // var noDisplayFields=["","datatype"];
    // function renderOtherFiels(selection,tpl,opts){
    //     var preset_form=d3.select(selection[0][0].parentNode);
    //     var tags=opts.tags;
    //     var fields=opts.fields;
    //     var otherFields=[];
    //     _.forEach(fields,function(v,k){
    //         //tpl中不存在
    //         if(!fieldInTpl(k,tpl) ){
    //             var field={};
    //             field.fieldName=v.fieldName;
    //             field.fieldTitle=v.fieldTitle;
    //             if(v.fieldTitle==""){
    //                     //console.warn(v.fieldName+"--has no title");
    //                     field.fieldTitle=v.fieldName;
    //             }
    //             //select 则取对应值的中文
    //             if(_.isObject(v.fieldInput)){
    //                 var inputObjArray=v.fieldInput;
    //                 var value=v.value;
    //                 _.forEach(inputObjArray.values,function(v,i){
    //                     if(v.value==value){
    //                         field.fieldValue=v.name;

    //                     }
    //                 })
    //             }else{
    //                 field.fieldValue=tags[v.fieldName]
    //             }
                
    //             var inNoDisplayFlag=noDisplayFields.indexOf(field.fieldName)>=0?true:false;
    //             if(!inNoDisplayFlag){
    //                 otherFields.push(field);
    //             }
                
    //         }
    //     })
    //     var div_wrapper=preset_form.selectAll("div.dropdown-maker").data([0]);
    //     var wraper=div_wrapper.enter().append("div").classed("roadTag-wrapper",true).classed("dropdown-maker",true).classed("close",true).on("click",function(){
    //         if(d3.select(this).attr("class").indexOf("close")>0){
    //             d3.select(this).classed("close",false);
    //         }else{
    //             d3.select(this).classed("close",true);
    //         }
    //     });
    //     wraper.append("div").classed("head",true).text("浏览全部属性");
    //     var wraper_body=div_wrapper.selectAll("div.body").data([0]);
    //     wraper_body.enter().append("div").classed("body",true).on("click",function(d){
            
    //         d3.event.stopPropagation();
    //         d3.event.preventDefault();
    //     });

    //     //update div_wrapper
    //     div_wrapper.classed("hide",function(){return context.mode().id!="select"})

    //     var update=wraper_body.selectAll("div.body div.attr").data(otherFields,function(d,i){return  d.fieldName});
    //     var enter=update.enter();
    //     var exit=update.exit();
    //     var divItem=enter.append("div").attr("class","attr clearfix");
    //     divItem.append("div").text(function(d,i){return d.fieldTitle}).attr("class","left");
    //     divItem.append("div").attr("class","right");

    //     //update
    //     wraper_body.selectAll("div.attr .right").data(otherFields,function(d,i){return  d.fieldName}).text(function(d,i){
            
    //         return d.fieldValue;
    //     })


    //     exit.remove();


    // }
    /*
        给定fieldName 判断是否包含在模板中配置的field
    */
    function fieldInTpl(fieldName,tpl){
        var isTplflag=false;
        var fieldGroup=tpl.fieldsGroup
        for(var i=0;i<fieldGroup.length;i++){
            var fieldObj=fieldGroup[i];
            _.forIn(fieldObj.fields,function(v,i){
                if(v.fieldName==fieldName){
                    isTplflag=true;
                    
                }
            })
            
        }
        return isTplflag;
    }

    return d3.rebind(roadNodeTagEditor, dispatch, 'on');
};