iD.ui.RoadTip = function(context) {

    function roadTip(selection) {
    	selection.append('div')
            .attr('id', 'KDSEditor-RoadTip')
            .text('道路编辑器');
    }

    return roadTip;
}