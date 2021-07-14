//roadclass
iD.effects = iD.effects||{};
iD.effects.Default = function(context) {
    var effect = {
        id: 'default',
        button: 'default',
        title: '',//t('modes.add_line.title'),
        description: '',//t('effects.default.description'),
        key: 'Shift+D',
        apply:function(context){
        	// var ly = context.layers().getLayerByName('Highway');
        	// ly.setOptions({'style':function(d){
             //    return {"stroke":null}
            // },'nodestyle':function(d){
             //        return {"fill":null}
            // }
	        // });
            // //window.roadLabel = false;
            // context.variable.roadLabel = false;
            // context.variable.nodeLabel = false;
            // ly.label.fieldKey = "name_chn";
        	// //重新渲染地图
       		// context.map().dimensions(context.map().dimensions());
        }
    };
    return effect;
};
