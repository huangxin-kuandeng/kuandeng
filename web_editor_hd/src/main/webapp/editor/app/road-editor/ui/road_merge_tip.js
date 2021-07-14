/**
 * Created by wt on 2015/8/5.
 */
iD.ui.RoadMergeTip = function (context) {
    var center = [];
    var roadMergeTip = {};
    var isShowFlag = false;
    var tipUtil = iD.ui.TipUtil(context);
    var modal;
    /*  var performAction;
     var setPerformAction=function(_)
     {
     if(_)
     {
     performAction=_;
     }else{
     return performAction;
     }

     }*/
    roadMergeTip.perform = function (selection, startWay, endWay, perforFun, cancelFun) {
        /*  var mainTip=selection.append('div')
         .attr('id', 'KDSEditor-RoadMergeTip')
         .text('道路编辑器');
         */
        /* var mainTip=selection.append('div')
         .attr('id', 'KDSEditor-RoadMergeTip')
         .attr('class', 'road_merge_tip')
         .text('道路编辑器');*/
        //performAction(perforFun);
        //setPerformAction(performAction)

        modal = iD.ui.modal(context.container());
        modal.on("close.merge",function(){
            d3.selectAll('.'+startWay.id).classed('merge_a',false);
            d3.selectAll('.'+endWay.id).classed('merge_b',false);
        })
        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');
        modal.append('div')
            .attr('class','mergeDiv')
            .attr('id','mergeDiv')
        var mergeDiv = d3.select('.mergeDiv');
        var introModal = mergeDiv.append('div')
            .attr('class', 'merge-window')
            .attr('id','merge-window')
        var titleTable = introModal.append('table')
            .attr('class', 'merge-title-table')
            .attr('id', 'merge-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'merge-title-content-td')
            .text('道路合并');
        tr.append('td')
            .attr('class', 'merge-title-close-td')
            .on('click', function () {
                modal.close();
            })
            .append('span')
            .attr('class', 'merge-title-close-span')
            .text('×');

        var title = introModal.append('div')
            .append('dl')
            .attr('class', 'info-list')
            .append('dt');

        title.append('b').text('属 性');
        title.append('b').classed("merge_a",true).text('道路 A');
        title.append('b').classed("merge_b",true).text('道路 B');

        introModal.append('div')
            .attr('class', 'info-list-content')
            .html(attributeCompare(startWay, endWay));
        if (!isShowFlag) {
            perforFun(startWay.id);
            modal.close();
        }
        var buttons = introModal.append('div').attr('class', 'merge-button-content');
        buttons.append('button')
            .attr('class', 'merge-cancel')
            .text('取消')
            .on('click', function () {
                modal.close();
                cancelFun();
            });
        var performProcess=function(id)
        {
            if(startWay.tags.adas!=endWay.tags.adas)
            {
                var adasPasswordTip = iD.ui.AdasPasswordTip(context,function(){
                    perforFun(id);
                    modal.close();
                }, function(){

                });
                adasPasswordTip.perform("合并道路涉及ADAS道路,请输入密码：");
            }else{
                perforFun(id);
                modal.close();
            }
        }

        buttons.append('button')
            .attr('class', 'merge-A-ok')
            .text('按道路A属性合并')
            .on('click',function(){
                performProcess(startWay.id)
            });
        buttons.append('button')
            .attr('class', 'merge-B-ok')
            .text('按道路B属性合并')
            .on('click',function(){
                performProcess(endWay.id)
            });


        new tipUtil.dragDrop({
            target: document.getElementById('merge-window'),
            bridge: document.getElementById('merge-title-table')
        });

    }
    var attributeCompare = function (startWay, endWay) {
        d3.selectAll('.'+startWay.id).classed('merge_a','true');
        d3.selectAll('.'+endWay.id).classed('merge_b','true');
        var htmlStr = "<table>";
/*            "*//*<tr>" + "<td>" +
            "ID" +
            "</td><td>" +
            "道路" + startWay.id +
            "</td><td>" +
            "道路" + endWay.id +
            "</td>" + "</tr>";*/
        var modelEntity;
        // var layerInfo = iD.Layers.getLayerById(startWay.layerId);
        // modelEntity=layerInfo.getModelEntityByEntity(startWay);
        modelEntity = iD.Layers.getLayer(startWay.layerId).modelEntity();
        if(!modelEntity.getGeoType){
        	modelEntity = iD.ModelEntitys[startWay.modelName];
        }

        var gtype = modelEntity.getGeoType();
        var compareFields=iD.data.RoadMerge.compareFields[startWay.modelName];
        modelEntity.getFields(gtype).filter(function (d) {
            htmlStr += "<tr>";
            if ( -1!= compareFields.indexOf(d.fieldName.toLocaleUpperCase())) {
                if(d.fieldName.toLocaleUpperCase()=="DIRECTION")
                {
                    if((startWay.tags[d.fieldName]==iD.way.direction.twoway&&endWay.tags[d.fieldName]==iD.way.direction.twoway)||
                        (startWay.tags[d.fieldName]==iD.way.direction.twowayforbid&&endWay.tags[d.fieldName]==iD.way.direction.twowayforbid))
                    {
                        return;
                    }

                    if(startWay.first()==endWay.first()||startWay.last()==endWay.last())
                    {
                        if((startWay.tags[d.fieldName]==iD.way.direction.positive&&endWay.tags[d.fieldName]==iD.way.direction.reverse)||
                            (startWay.tags[d.fieldName]==iD.way.direction.reverse&&endWay.tags[d.fieldName]==iD.way.direction.positive))
                        {
                            return;
                        }
                    }
                }else if(startWay.tags[d.fieldName] == endWay.tags[d.fieldName])
                {
                    return;
                }
                var zname=d.fieldName;
                if(d.fieldTitle)
                {
                    zname=d.fieldTitle;
                }
                htmlStr += "<td>" + zname + "</td>"
                htmlStr += "<td>" + startWay.tags[d.fieldName] + "</td>"
                htmlStr += "<td>" + endWay.tags[d.fieldName] + "</td>"
                //console.log(key+":"+startWay.tags[key]+"--"+endWay.tags[key]);
                isShowFlag = true;
            }
            htmlStr += "</tr>";
        });
/*        for (var key in startWay.tags) {

        }*/
        htmlStr += "</table>";
        return htmlStr;

    }
    roadMergeTip.center = function (_) {
        if (_) {
            center = _
        } else {
            return center;
        }
    }

    return roadMergeTip;
}