iD.ui.ZoomLevel = function(map) {
    return function(selection) {

        var button = selection.append('button')
            .attr('tabindex', -1)
            .attr('title', t('zoom_level.title'))
            .call(bootstrap.tooltip()
                .placement('left'));

        var level =  button.append('span')
             .attr('class', 'zoomlevel');
         
         function update(){
        	 level.html(map.zoom());
         }
         
         update();
         
         map.on('move.zoomlevel', update);
    };
};
