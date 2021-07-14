(function() {

var singleDialog = null;
var LAST_POSITION = [];
var relationID = '';

iD.ui.openTollgateDialog = function(context, relation, opts) {
    if (singleDialog && !singleDialog.closed) {
        destoryDialog(singleDialog);
    }
    singleDialog = null;
    opts = opts || {};

    var rawTagEditor = uiCheckTagEditor(context);

    var dialog = Dialog.open({
        Title: opts.title || '收费站属性编辑',
        InnerHtml: '<div id="tollgat_dialog_html" class="checktag_dialog_html" data-id="' + relation.id + '"></div>',
        Width: 520,
        Height: 430,
        Left: LAST_POSITION[0] || '50%',
        Top: LAST_POSITION[1] || '50%',
        Modal: false,
        CancelEvent: function() {
            // rawTagEditor.on('change.checktag_dialog', null);
            // context.event.on('saveend.checktag_dialog', null);
            // iD.User.on('dvr.checktag_dialog', null);

            var domDiv = dialog.getDialogDiv();
            if(domDiv && domDiv.style){
                LAST_POSITION = [parseInt(domDiv.style.left), parseInt(domDiv.style.top)];
            }
            dialog.close();
        }
    });
    singleDialog = dialog;
   
    // doms
    var $selection = d3.select('#tollgat_dialog_html');
    var $root = d3.select('#_DialogDiv_' + dialog.ID).style('border', '1px solid #999');
    var $dialogContainer = $root.select('#_Container_' + dialog.ID);

    $dialogContainer.style({
        'overflow': 'hidden',
        'padding': '0px 5px 5px'
    });

    var $tagEditorWrapper = $selection.append('div').attr('class', 'tollgate_field_content');

    $tagEditorWrapper.call(rawTagEditor.entityID(relation), opts);

    var $submitDom = $selection.append('div').attr('class', 'tollgate_submit');
    var $succ = $submitDom.append('div');
    $succ.append("button")
        .attr('class', 'tollgate_submit_btn button blue')
        .html('确定')
        .on('click', function(){
            submit(relation, dialog);
        });
    //<button class="search_btn button blue">确定</button>
    var $exit = $submitDom.append('div')
    $exit.append("button")
        .attr('class', 'tollgate_exit_btn button gray')
        .html('取消')
        .on('click', function(){
            !dialog.closed && dialog.close();
        });
    //<button class="clear_btn button gray">清空地图</button>
};

function submit(relation, dialog) {
    var rowList = d3.selectAll('.js-example-basic-multiple')[0];
    var types = [];
    // var graph = editor.context.graph();
    var num = d3.select('#tollgat_dialog_html').select('.content').select('input').value();
    if (num != 0 && rowList.length) {
        for (let i = 0; i < rowList.length; i++){
           var element = rowList[i];
           var select =  $(element).data();
           var datas = select.select2.val();
           if (datas.length) {
               types.push(datas.join("/"));
           } else {
               Dialog.alert('第' + (i + 1) + '条车道请选择属性类型!');
               return;
           }
        }
    } else {
        Dialog.alert('请先输入车道数！');
    }

    var TYPE = types.join(',');
    var newTags = {
        TYPE: TYPE,
        NUM: num
    };
    // relation.tags.NUM = num;

    
    editor.context.perform(
        function(graph) { 
            return graph.replace(relation.update({
                tags:iD.util.tagExtend.updateTaskTag(relation, newTags)
            }));
        },
        "收费站属性编辑");

    Dialog.alert('数据已更新！');
    !dialog.closed && dialog.close();
}

function destoryDialog(dialog){
    if (dialog && !dialog.closed) {
        dialog.CancelEvent && dialog.CancelEvent();
        !dialog.closed && dialog.close();
    }
};

function uiCheckTagEditor(context){
    var event = d3.dispatch('change');
    var relation;
    var optionData = [
        {
            name: 'Unknown',
            value: '0'
        },
        {
            name: '轿车/小型车',
            value: '1'
        },
        {
            name: '客车/中型车',
            value: '2'
        },
        {
            name: '货车/大型车',
            value: '3'
        },
        {
            name: 'Hi-pass lane',
            value: '4'
        },
        {
            name: 'Smart Hi-pass lane',
            value: '5'
        }
    ];

    function tagType(enter, num, type) {
        if (d3.select('.row_type').node()) {
            d3.select('.row_type').remove();
        }
        var types = [];
        if (type.length) {
            types = type.split(',');   
        }
        var rowList = enter
            .append('div')
            .attr('class', 'row row_type');

        for (let i = 0; i < num; i++) {
            var selectDatas = [];
            if (types.length) {
                if (types[i]) {
                    selectDatas = types[i].split('/');
                }
            }
            var colEnter = rowList.append('div')
                .attr('class', 'col')
                .style('width', '50%')
                .style('padding-bottom', '7px');
            colEnter
                .append('label')
                .attr('class', 'label-name')
                .text(i + 1);
            var inputWrap = colEnter
                .append('div')
                .attr('class', 'content');

            // var select = $('<select class="js-example-basic-multiple form-control" multiple="" data-select2-id="61" tabindex="-1" aria-hidden="true" style="width:40px;height:20px;"><optgroup label="Alaskan/Hawaiian Time Zone"><option value="AK">Alaska</option><option value="HI">Hawaii</option></optgroup><optgroup label="Pacific Time Zone"><option value="CA">California</option></optgroup><optgroup label="Mountain Time Zone"><option value="AZ">Arizona</option></optgroup></select>')
            // $(inputWrap.node()).append(select);
            var select = inputWrap.append('select')
                .attr('class', 'js-example-basic-multiple form-control')
                .attr('title', "请选择")
                .attr('name', "states[]")
                .attr('multiple' , 'multiple')
                .style("width", '140px')
                .style('height', '20px');

            select.selectAll('option')
                .data(optionData)
                .enter()
                .append('option')
                .attr('value', function(o) {
                    return o.value;
                })
                .attr('title', function(o) {
                    return o.name;
                })
                .attr('label', function(o) {
                    return iD.util.substring(o.name, 8);
                })
                .attr('selected', function(o){
                    if (selectDatas.includes(o.value)) {
                        return 'selected';
                    }
                })
                .text(function(o) {
                    return iD.util.substring(o.name, 8);
                });
        }
        $('.js-example-basic-multiple').select2();
    }

    function checkTag(selection, opts){
        inputMapping = {};

        currentLayer = relation.layerId;

        selection.node().innerHTML = '';

        let className = 'list-raw'
        if (opts.isEditor) {
            className += ' enableTollgateAttribute';
        } else {
            className += ' disEnableTollgateAttribute';
        }

        var enter = selection.append('div').attr('class', className);
        
        var rowList = enter
            .append('div')
            .attr('class', 'row row_num');
        var colEnter = rowList.append('div')
            .attr('class', 'col')
            .style('width', '23.333%');
            
        colEnter
            .append('label')
            .attr('class', 'label-name')
            .text('车道数');
        var inputWrap = colEnter
            .append('div')
            .attr('class', 'content');

        inputWrap.append('input')
            .attr('type', 'text')
            .on('change', function(){
                var type = relation.tags.TYPE != null ? relation.tags.TYPE : [];
                tagType(enter, this.value, type);
            })
            .attr('value', relation.tags.NUM);
        
        tagType(enter, relation.tags.NUM || 0, relation.tags.TYPE || []);
    }

    checkTag.entityID = function(v){
        if(!arguments.length) return relation;
        relation = v;
        return this;
    }

    return d3.rebind(checkTag, event, 'on');
}

})();