iD.ui.SublayerList = function(context) {
	
	var layer, available = true;
	
    function sublayerList(selection) {
        
		if (available) {
			drawList();
			available = false;
		} else {
			available = true;
			selection.selectAll('.KDSEditor-sublayer-list').remove();
		}

        function drawList() {
            
			var sublayers = layer.sublayers;
			
			if (sublayers && sublayers.length) {
					
				var layersArea = selection.selectAll('.KDSEditor-sublayer-list')
					.data([0])
					.enter()
					.append('ul')
					.attr('class','KDSEditor-sublayer-list');
				
				
				var li = layersArea.filter(function(d){if(!d) return true;})
					.selectAll("li")
					.data(sublayers)
					.enter()
					.append("li");
			
				var label = li.append('label');
			
				var checkbox = label
					.append("input")
					.attr("type", "checkbox")
					.attr("name","list")
					.attr("value", function (d) { return d.id;})
					.each(function (d) { if (d.display) this.setAttribute('checked', d.display);})
					.on('change', setSublayer);
			
				var span = label
					.append("span")
					.text(function (d) { return d.layerName;});
			
			}
			
			function setSublayer (d) {
				if (!d.display) {
					d.display = true;
					context.connection().flush();
					context.connection().loadData(context.projection, context.map().dimensions());
				} else {
					d.display = false;
					context.map().center(context.map().center());
				}
				setButtonVisible(d);
			}
			
			function setButtonVisible (d) {
				// var rLayer = iD.Layers.getCurrentEnableLayer();
				var rLayer = iD.Layers.getLayer();
				if (rLayer && rLayer.isRoad()) {
					var drawRCBtns = d3.selectAll('.KDSEditor-col6-1');//导航top按钮
					/*drawRCBtns.each(function () {
						if (d.datatype.toLowerCase() === arguments[0].button) {
							if (d.display) this.style.display = 'block';
							else this.style.display = 'none';
						}
					});*/
				}
			}
        }
    }
	
	sublayerList.layerInfo = function(_){
        if (!arguments.length) return layerInfo;
        layer = _;
        return sublayerList;
    };

    return sublayerList;

};
