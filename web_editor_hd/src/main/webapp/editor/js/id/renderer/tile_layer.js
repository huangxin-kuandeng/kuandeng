iD.TileLayer = function(context) {
    var tileSize = 256,
        tile = d3.geo.tile(),
        projection,
        cache = {},
        tileOrigin,
        z,
        transformProp = iD.util.prefixCSSProperty('Transform'),
        source = d3.functor(''),
        image;

    function tileSizeAtZoom(d, z) {
        return Math.ceil(tileSize * Math.pow(2, z - d[2])) / tileSize;
    }

    function atZoom(t, distance) {
        var power = Math.pow(2, distance);
        return [
            Math.floor(t[0] * power),
            Math.floor(t[1] * power),
            t[2] + distance];
    }

    function lookUp(d) {
        for (var up = -1; up > -d[2]; up--) {
            var tile = atZoom(d, up);
            if (cache[source.url(tile)] !== false) {
                return tile;
            }
        }
    }

    function uniqueBy(a, n) {
        var o = [], seen = {};
        for (var i = 0; i < a.length; i++) {
            if (seen[a[i][n]] === undefined) {
                o.push(a[i]);
                seen[a[i][n]] = true;
            }
        }
        return o;
    }

    function addSource(d) {
        d.push(source.url(d));
        return d;
    }

    // Update tiles based on current state of `projection`.
    function background(selection) {
        tile.scale(projection.scale() * 2 * Math.PI)
            .translate(projection.translate());

        tileOrigin = [
            projection.scale() * Math.PI - projection.translate()[0],
            projection.scale() * Math.PI - projection.translate()[1]];

        z = Math.max(Math.log(projection.scale() * 2 * Math.PI) / Math.log(2) - 8, 0);
        if(!source.data().visible){
            return ;
        }
        if(source.type == "wms")
            wmsrender(selection);
        else
            render(selection);
    }
    
    // Derive the tiles onscreen, remove those offscreen and position them.
    // Important that this part not depend on `projection` because it's
    // rentered when tiles load/error (see #644).
    function render(selection) {
        var requests = [];
        if (source.validZoom(z)) {
            tile().forEach(function(d) {
                addSource(d);
                if (d[3] === '') return;
                if (typeof d[3] !== 'string') return; // Workaround for chrome crash https://github.com/openstreetmap/iD/issues/2295
                requests.push(d);
                if (cache[d[3]] === false && lookUp(d)) {
                    requests.push(addSource(lookUp(d)));
                }
            });

            requests = uniqueBy(requests, 3).filter(function(r) {
                // don't re-request tiles which have failed in the past
                return cache[r[3]] !== false;
            });
        }
        var pixelOffset = [
            Math.round(source.offset()[0] * Math.pow(2, z)),
            Math.round(source.offset()[1] * Math.pow(2, z))
        ];

        function load(d) {
            cache[d[3]] = true;
            d3.select(this)
                .on('error', null)
                .on('load', null)
                .classed('tile-loaded', true);
            render(selection);
        }

        function error(d) {
            cache[d[3]] = false;
            d3.select(this)
                .on('error', null)
                .on('load', null)
                .remove();
            render(selection);
        }

        function imageTransform(d) {
            var _ts = tileSize * Math.pow(2, z - d[2]);
            var scale = tileSizeAtZoom(d, z);
            return 'translate(' +
                (Math.round((d[0] * _ts) - tileOrigin[0]) + pixelOffset[0]) + 'px,' +
                (Math.round((d[1] * _ts) - tileOrigin[1]) + pixelOffset[1]) + 'px)' +
                'scale(' + scale + ',' + scale + ')';
        }

        image = selection
            .selectAll('img')
            .data(requests, function(d) { return d[3]; });

        image.exit()
            .style(transformProp, imageTransform)
            .classed('tile-removing', true)
            .each(function() {
                var tile = d3.select(this);
                window.setTimeout(function() {
                    if (tile.classed('tile-removing')) {
                        tile.remove();
                    }
                }, 300);
            });

        image.enter().append('img')
            .attr('class', 'tile')
            .attr('src', function(d) { return d[3]; })
            .on('error', error)
            .on('load', load);

        image
            .style(transformProp, imageTransform)
            .classed('tile-removing', false);
    }


    /**
     * wms栅格图渲染
     * @param selection d3 dom
     * @return 
     */
    function wmsrender(selection) {
        var requests = [];
        var url = source.wmsurl(context,
                  parseInt(d3.select("#map").style('width')),
                  parseInt(d3.select("#map").style('height'))); 
        requests.push(url);
        function load(d) {
            d3.select(this)
                .on('error', null)
                .on('load', null)
                .classed('tile-loaded', true);
             //wmsrender(selection);
        }

        function error(d) {
            d3.select(this)
                .on('error', null)
                .on('load', null)
                .remove();
             //wmsrender(selection);
        }

        image = selection
            .selectAll('img')
            .data(requests, function(d) {return d; });
        image.exit()
            .classed('tile-removing', true)
            .each(function() {
                var tile = d3.select(this);
                //window.setTimeout(function() {
                    if (tile.classed('tile-removing')) {
                        tile.remove();
                    }
                //}, 300);
            });

        image.enter().append('img')
            .attr('class', 'tile')
            .attr('src', function(d) { 
            return d; })
            .on('error', error)
            .on('load', load);

        image
//            .style(transformProp, imageTransform)
            .classed('tile-removing', false);
            /*
                调用后台提供服务，查询卫星云图拍摄日期，理论上只调用一次，所以在最后调用
                延迟调用获取日期;
            */
        
        
        getWmsPhotoDate_delay();
           
    }
    var getWmsPhotoDate_delay=_.debounce(getWmsPhotoDate,100);
     function getWmsPhotoDate(){

                var wmsDateUrl = source.vmGetDateUrl(context,
                  parseInt(d3.select("#map").style('width')),
                  parseInt(d3.select("#map").style('height')));
              
                d3.xhr(wmsDateUrl)
                .responseType("text")
                .get(function(error,data){
                    if(error!=null){
                        if(console.error){
                            console.warn("getWmsPhotoDate error:xhr.statusText="+error.statusText);
                        }
                        
                        return ;
                    }
                    if(source.type!="wms"){
                        return ;
                    }
                    var photodateArray=[];
                    var dateObj={"photodate":data.response};
                    var photoDate=data.response;
                    if(source.id=="wms" && data.response!=""){
                        try{
                            var resObj=JSON.parse(data.response);
                            dateObj={"photodate":resObj.date};
                        }catch(e){

                        }
                        
                    }
                    photodateArray.push(dateObj);
                    // console.log("摄影日期："+photoDate);
                    
                    var selectPhotoDate=d3.select("#KDSEditor-footer").selectAll("#photoDate").data(photodateArray);
                    selectPhotoDate.text(function(d,i){return "拍摄日期："+d.photodate})
                    selectPhotoDate.enter().append("div").attr("id","photoDate").classed("photoDate",true).text(function(d,i){return "拍摄日期："+d.photodate})
                    selectPhotoDate.exit().remove();
                })
            }
    background.projection = function(_) {
        if (!arguments.length) return projection;
        projection = _;
        return background;
    };

    background.dimensions = function(_) {
        if (!arguments.length) return tile.size();
        tile.size(_);
        return background;
    };

    background.source = function(_) {
        if (!arguments.length) return source;
        source = _;
        cache = {};
        tile.scaleExtent(source.zooms);
        return background;
    };
    background.getTiles = function(){
        return tile();
    }
    background.getTilexy = function(tile){
        //var _ts = tileSize * Math.pow(2, z - d[2]);
        //var scale = tileSizeAtZoom(d, z);
        var reg=/\-?[0-9]+/g ;
        var xy = [];
        image
            .each (function(d){
                if(tile[0] == d[0] && tile[1] == d[1] && tile[2] == d[2]){
                   return xy = [Number(this.style.transform.match(reg)[0]),Number(this.style.transform.match(reg)[1])];
                }

            });
        return xy;
        //console.log(Math.round((d[0] * _ts) - tileOrigin[0]) + pixelOffset[0]),(Math.round((d[1] * _ts) - tileOrigin[1]) + pixelOffset[1]);
        //return tile();
    }

    return background;
};
