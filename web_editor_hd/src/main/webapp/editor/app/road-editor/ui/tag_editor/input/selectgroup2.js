/**
 * 级联菜单，tpl中fieldLinkGroup
 * 直接显示级联菜单的第一栏
 * @param {Object} field
 */
iD.ui.TagEditorInput.selectgroup2 = function(field) {
	
	var render = iD.ui.TagEditorInput.selectgroup(field);
	
    function i(selection, opts) {
        render.call(this, selection, opts);
        
        var $wrap = selection.select('.tpl_selectgroup_values');
        $wrap.classed('list-show', true);
        
    }

	_.extend(i, render);
    return i;
};