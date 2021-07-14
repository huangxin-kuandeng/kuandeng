/*
 * @Author: tao.w
 * @Date: 2019-01-29 20:07:34
 * @LastEditors: kanhognyu
 * @LastEditTime: 2019-05-16 20:27:03
 * @Description: 
 */

/**
 * 选中entity后有量测信息则弹出
 * @param {Object} selectedIDs
 * @param {Object} context
 */
iD.operations.operationMeasureinfoCopy = function(selectedIDs, context) {
    var entity, clip, $body = d3.select('body'), $copyButton,
    DataType = iD.data.DataType;
    // 每次出现菜单，都执行该operations，需要通过id删除
    var btnId = '_ms_cp_btn_';

    var operation = function() {
        clip && clip.destroy();
        var graph = context.graph();
        var measureinfo = graph.parentRelations(entity, DataType.MEASUREINFO);

		iD.logger.editElement({
            'tag':"menu_infoCopy"
        });				//量测信息复制时增加埋点操作
        var copyStr =  measureinfo[0].tags.PARAMETER;
        
        $copyButton = $body.append('button')
            .attr('id', '_ms_cp_btn_')
            .attr('type', 'button')
            .attr('class', 'copy-btn hidden-visibility')
            .text(' ');
            
        if ($copyButton) {
            clip = new ClipboardJS($copyButton.node(), {
                text: function () {
                    Dialog.alert('复制成功！');
                    return copyStr;
                }
            });
            $copyButton.node().__clip = clip;
            $copyButton.node().click();
        }
        context.buriedStatistics().merge(1,entity.modelName,1000);
        destroyClip();
    };

    operation.available = function() {
        destroyClip();
        var graph = context.graph();
        entity = context.entity(selectedIDs[0]);
        var measureinfo = graph.parentRelations(entity, DataType.MEASUREINFO);
        if(measureinfo.length){
            return true;
        }
        return false;
    };

    function destroyClip(){
        var btn = document.getElementById(btnId);
        if(btn){
            btn.__clip && btn.__clip.destroy();
            btn.__clip = null;
            btn.remove();
        }
    }

    operation.disabled = function() {
        return false
    };

    operation.tooltip = function() {
        return t('operations.measureinfo_copy.description');
    };

    operation.id = 'measureinfoCopy';
    operation.keys = [iD.ui.cmd('P')];
    operation.title = t('operations.measureinfo_copy.title');

    return operation;
};

