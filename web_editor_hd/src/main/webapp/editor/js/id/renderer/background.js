iD.Background = function(context) {
    var dispatch = d3.dispatch('change'),
        layers = [];
    var container = null;

    function background(selection) {
        container = selection;

        background.resetLayer();
    }

    //重新添加或是删除图层DIV
    background.resetLayer = function(){

        layers.sort(function(a,b){
            if(a.source().data().order > b.source().data().order){
                return 1;
            }else if(a.source().data().order < b.source().data().order){
                return -1;
            }else{
                return 0;
            }
            //return a.source().data().order > b.source().data().order
        });
        //排序
        var overlays = container.selectAll('.overlay-layer')
            .data(layers, function(d,i) {
                return d.source().data().id;
            });

        overlays.enter().insert('div', '.layer-data')
            .attr('class', function(d){
                return 'layer-layer overlay-layer'+' overlay-layer-'+d.source().id;
            })

            .attr('style', function (d) {
                var oder = 200 +　(d.source().data().order || 1);
                let display =  ';display:';
                if(d.source().data().visible){
                    display += 'block';
                }else{
                    display += 'none';
                }
                return ';z-index: ' + (oder > 300 ? 299 : oder) +display;
            })

        overlays.each(function(layer) {
            if(layer.source().data().visible){
                d3.select(this).call(layer);
            }
        });

        overlays.exit()
            .remove();
    }

    background.layerVisible =function(id,vis){

        var result = false;
        container.selectAll('.overlay-layer')
            .each(function(layer) {
                if(layer.source().data().id == id){
                    layer.source().data().visible = vis;
                    if(vis){
                        d3.select(this).style('display', 'block');
                    }else{
                        d3.select(this).style('display', 'none');
                    }
                    d3.select(this).call(layer);
                    result = true;
                    return false;
                }
            });
        return result;
    }
    background.layerSource =function(id,source){
        container.selectAll('.overlay-layer')
            .each(function(layer) {
                if(layer.source().data().id == id){
                    _.extend(layer.source().data(), source);
                    _.extend(layer.source(), source);
                    d3.select(this).call(layer);
                    return false;
                }
            });

    }
    background.layerURL =function(id,url){
        container.selectAll('.overlay-layer')
            .each(function(layer) {
                if(layer.source().data().id == id){
                    layer.source().data().url = url;
                    d3.select(this).call(layer);
                    return false;
                }
            });
    }

    background.layerUpdate =function(id){
        container.selectAll('.overlay-layer')
            .each(function(layer) {
                if(layer.source().data().id == id){
                    d3.select(this).call(layer);
                    return false;
                }
            })  ;
    }
    background.layerzIndex =function(id,idx){
        container.selectAll('.overlay-layer')
            .each(function(layer) {
                if(layer.source().data().id == id){
                    layer.source().data().zIndex = idx;
                    //d3.select(this).call(layer);
                    return false;
                }
            });
        background.resetLayer();
    }


    //添加背景层，这里有问题，应为加载顺序问题容器会没有加载，以后需要修改
    background.addLayer = function(source){
        //console.log("layers",layers);
        if(!source){
            return false;
        }
        var s ;
        if (source.type === 'bing') {
            s =  iD.BackgroundSource.Bing(source, dispatch);
        } else {
            s = iD.BackgroundSource(source);
        }

        var layer = iD.TileLayer(context)
            .source(s)
            .projection(context.projection)
            .dimensions(context.map().dimensions());
        layers.push(layer);
        //console.log(s);
        if(container){
            background.resetLayer();
        }

    }
    //删除背景层
    background.removeLayer = function(id){
        //layers.forEach(function(layer) {
        //    if(layers){
        //
        //    }
        //    layer.dimensions(_);
        //});
        _.remove(layers,function(layer){
            if(layer.source().data().id == id) return true;
        })
        if(container){
            background.resetLayer();
        }
    }

    background.dimensions = function(_) {

        layers.forEach(function(layer) {
            layer.dimensions(_);
        });
        background.resetLayer();
    };

    background.getOverlayLayers = function(id){
        var layer;

        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            if (layer.source().data().id === id) {
                return layer;
            }
        }
        return false;
    };
    background.getLayerById = function(id){
        var layer;

        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            if (layer.source().data().id === id) {
                return layer.source().data();
            }
        }
        return false;
    };

    background.getLayers = function(){
        return _.map(layers,function(d){
            return d.source().data();
        })
    }

    return d3.rebind(background, dispatch, 'on');
};
