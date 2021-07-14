iD.ui.LeftBarElement.element = function(context) {
	var context;
	var element = function(selection) {
		selection.selectAll('div').remove();
		// 图层列表的父容器，在sidebar中初始化图层列表
		selection.append('div').attr('id', 'KDSEditor-sidebar').call(context.ui().sidebar);
	};

	return element;
};