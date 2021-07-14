iD.ui.LeftBarElement = {};
// 左侧列表
iD.ui.LeftBar = function (context) {
	var navtab = iD.ui.NavTab(context);
	function leftBar (selection) {
       
		// var toggle = selection.append('div').attr('class', 'toggle').append('div');


        var openCloseLeftBar= function() {
            var self = d3.select('.toggle');
            // toggle.classed('trans', true);
            var close = selection.classed('close');
            selection.classed('close', !close);
            setTimeout(function() {
                var selection = d3.select("#map");
                context.map().closeTabDimensions(selection.dimensions());
                editor.setZoom(editor.getZoom()+1,true);
                editor.setZoom(editor.getZoom()-1,true);
            }, 500);
        }

        // var keybinding = d3.keybinding('leftbar_opencloses')
        //     .on('W', openCloseLeftBar);

        // d3.select(document)
        //     .call(keybinding);
		// toggle.on('click', openCloseLeftBar);

        navtab.on('active.leftbar', function() {
        	var close = selection.classed('close');
        	if (close) {
        		// toggle.node().click();
        	}
        });
		// header   logo+logout
		selection.call(iD.ui.LeftBarUserPane(context));
		
		selection.call(iD.ui.LeftBarControl(context));

		iD.User.on('login.leftbar', function() {
			var data = iD.User.getInfo();
			if (!data) {
				return;
			}
			var role = iD.User.getRole();
			d3.select('body').classed(role.role, true).attr('role', role.role);
			selection.classed('login', true);
			selection.call(navtab);
		});

		context.connection().on('modelEntityLoaded.layermanager',function(){
			iD.ui.LeftBarElement.isModelEntityLoaded = true;
		});
	}

	return leftBar;
}