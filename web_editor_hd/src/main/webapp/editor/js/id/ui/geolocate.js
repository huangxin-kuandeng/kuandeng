/*
 * @Author: tao.w
 * @Date: 2020-04-20 15:03:34
 * @LastEditors: tao.w
 * @LastEditTime: 2020-04-20 15:27:00
 * @Description: 
 */
iD.ui.Geolocate = function(map, context) {
    function click() {
        if(!iD.Task || !iD.Task.d){
        	return ;
        }

        if (!iD.Task.d.bounds) {
            Dialog.alert('该任务没有框范围，所以无法定位！')
            return;
        }

        
    	var extent = iD.geo.Extent(iD.Task.d.bounds);
    	var newZoom = parseInt(map.extentZoom(extent));
    	if(newZoom < context.options.editableLevel){
    		map.centerZoom(extent.center(), context.options.editableLevel);
    	}else {
    		map.extent(extent);
    	}
        
        // navigator.geolocation.getCurrentPosition(
        //     success, error);
    }

    // function success(position) {
    //     var extent = iD.geo.Extent([position.coords.longitude, position.coords.latitude])
    //         .padByMeters(position.coords.accuracy);
    //
    //     map.centerZoom(extent.center(), Math.min(20, map.extentZoom(extent)));
    // }

    function error() { }

    return function(selection) {
        if (!navigator.geolocation) return;

        var button = selection.append('button')
            .attr('tabindex', -1)
            .attr('title', t('geolocate.title'))
            .on('click', click)
            .call(bootstrap.tooltip()
                .placement('left'));

         button.append('span')
             .attr('class', 'KDSEditor-icon geolocate light');
    };
};
