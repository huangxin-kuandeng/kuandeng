iD.ui.Notice = function(context) {
    return function(selection) {
        var div = selection.append('div')
            .attr('class', 'notice');

        var button = div.append('button')
            .attr('class', 'zoom-to notice')
            .on('click', function() { 
            	var zoomv = context.map().editableLevel();
            	context.map().zoom(zoomv); 
            });

        button.append('span')
            .attr('class', 'KDSEditor-icon zoom-in-invert');

        button.append('span')
            .attr('class', 'label')
            .text(t('zoom_in_edit'));

        function disableTooHigh() {
            div.style('display', context.map().editable() ? 'none' : 'block');
        }

        context.map()
            .on('move.notice', _.debounce(disableTooHigh, 500));

        disableTooHigh();
    };
};
