/**
 * Created by wangtao on 2017/7/14.
 */
iD.ui.TagEditor.DividerNodeTagEditor = function(context) {

    var dispatch = d3.dispatch('change');

    function walkEnterTagEditor(selection, opts) {

        var
            tags = opts.tags,
            entityID = opts.id,
            entity = context.entity(entityID),
            currentLayer = iD.Layers.getLayer(entity.layerId),
            modelEntity = iD.ModelEntitys[entity.modelName],
            geoType = modelEntity.getGeoType();


        var fields = modelEntity.getFields(geoType);

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
        renderOtherFiels(selection,tpl,{

            tags: tags,
            fields: fieldHash
        });

    }

    walkEnterTagEditor.available = function(entity) {
        //return entity.isWalkEnter && entity.isWalkEnter();
        return entity instanceof iD.Node && entity.modelName === iD.data.DataType.DIVIDER_NODE;
    }

    function renderOtherFiels(selection,tpl,opts){
        var preset_form=d3.select(selection[0][0].parentNode);
        var tags=opts.tags;
        var fields=opts.fields;
        var otherFields=[];
        _.forEach(fields,function(v,k){
            //tpl中不存在
            if(!fieldInTpl(k,tpl) ){
                var field={};
                field.fieldName=v.fieldName;
                field.fieldTitle=v.fieldTitle;
                if(v.fieldTitle==""){
                    //console.warn(v.fieldName+"--has no title");
                    field.fieldTitle=v.fieldName;
                }
                //select 则取对应值的中文
                if(_.isObject(v.fieldInput)){
                    var inputObjArray=v.fieldInput;
                    var value=v.value;
                    _.forEach(inputObjArray.values,function(v,i){
                        if(v.value==value){
                            field.fieldValue=v.name;

                        }
                    })
                }else{
                    field.fieldValue=tags[v.fieldName]
                }

                // if(!inNoDisplayFlag){
                    otherFields.push(field);
                // }

            }
        })
        var div_wrapper=preset_form.selectAll("div.dropdown-maker").data([0]);
        var wraper=div_wrapper.enter().append("div").classed("roadTag-wrapper",true).classed("dropdown-maker",true).classed("close",true).on("click",function(){
            if(d3.select(this).attr("class").indexOf("close")>0){
                d3.select(this).classed("close",false);
            }else{
                d3.select(this).classed("close",true);
            }
        });
        wraper.append("div").classed("head",true).text("浏览全部属性");
        var wraper_body=div_wrapper.selectAll("div.body").data([0]);
        wraper_body.enter().append("div").classed("body",true).on("click",function(d){

            d3.event.stopPropagation();
            d3.event.preventDefault();
        });

        //update div_wrapper
        div_wrapper.classed("hide",function(){return context.mode().id!="select"})

        var update=wraper_body.selectAll("div.body div.attr").data(otherFields,function(d,i){return  d.fieldName});
        var enter=update.enter();
        var exit=update.exit();
        var divItem=enter.append("div").attr("class","attr clearfix");
        divItem.append("div").text(function(d,i){return d.fieldTitle}).attr("class","left");
        divItem.append("div").attr("class","right");

        //update
        wraper_body.selectAll("div.attr .right").data(otherFields,function(d,i){return  d.fieldName}).text(function(d,i){

            return d.fieldValue;
        })


        exit.remove();
    }
    /*
     给定fieldName 判断是否包含在模板中配置的field
     */
    function fieldInTpl(fieldName,tpl){
        return true;
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

    return d3.rebind(walkEnterTagEditor, dispatch, 'on');
};