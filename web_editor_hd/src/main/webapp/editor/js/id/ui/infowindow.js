iD.ui.Infowindow = function(context){
	
	var container, defaultContainer;
	
	function infowindow(selection) {
		var opt = arguments[1][0][0];
		container = selection; 
		
		infowindow.updateContent(opt);
		infowindow.updateSize(opt);
	}
	
	infowindow.updateContent = function (opt) {
		if (!opt.content) return;
		container.html('');
		var wrap = container.append('div');
		var closeXDom = wrap.append('div').attr('class', 'KDSEditor-info-close'),
			outerDom = wrap.append('div').attr('class', 'KDSEditor-info-outer'),
			contentDom = outerDom.append('div').attr('class', 'KDSEditor-info-content');
		var core;
		if (typeof opt.content === 'object') {
			core = document.createElement('div'), core.appendChild(opt.content);
			contentDom.node().appendChild(core);
		} else {
			core = contentDom.append('div').html(opt.content);
		}
		var	sharpDom = wrap.append('div').attr('class', 'KDSEditor-info-sharp');
		
		closeXDom.node().innerHTML = "×";
		closeXDom.href = "javascript:void(0)";
		closeXDom.on('click', function () {
			context.event.closeinfowindow();
		});
		
		defaultContainer = contentDom;
		return infowindow;
	}
	
	
	infowindow.updateSize = function (opt) {
		if (!opt.size) return;
		var w = opt.size[0], h = opt.size[1];
		if (w > 0) {
			defaultContainer.node().style.width = w + 'px';
			container.node().style.width = (w + 20) + 'px';
		}
		if (h > 0) defaultContainer.node().style.height = h + 'px';
		return infowindow;
	}
	
	return infowindow;
}