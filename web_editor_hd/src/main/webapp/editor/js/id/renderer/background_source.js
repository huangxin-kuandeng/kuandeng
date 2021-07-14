/*
 * @Author: tao.w
 * @Date: 2019-06-06 16:29:10
 * @LastEditors: tao.w
 * @LastEditTime: 2019-10-24 20:05:10
 * @Description: 
 */
iD.BackgroundSource = function(data) {
    var source = _.clone(data),
        offset = [0, 0],
        _data = data,
        name = source.name;

    source.zooms = data.zooms || [0, 20];

    source.offset = function(_) {
        if (!arguments.length) return offset;
        offset = _;
        return source;
    };

    source.nudge = function(_, zoomlevel) {
        offset[0] += _[0] / Math.pow(2, zoomlevel);
        offset[1] += _[1] / Math.pow(2, zoomlevel);
        return source;
    };

    source.data = function(_) {
        if (!arguments.length) return _data;
        _data = _;
        return source;
    };

    source.name = function() {
        return name;
    };

    source.imageryUsed = function() {
        return source.id || name;
    };


    //if (data.panoramaOptions) {
    	//source.url = function(coord) {
    	//	var tileSubdomains = "sv0,sv1,sv2,sv3,sv4,sv5,sv6,sv7";
	//		var _d ={'url': 'http://{s}.map.qq.com/road/{z}/{dx}/{dy}/{x}_{y}.png', 'zooms': data.zooms || [1, 18], 'name': data.name};
	//		var xx = coord[0], yy = coord[1], zz = coord[2];
	//		var f = '', e = tileSubdomains.split(","), h = e.length, g = 256;
     //       yy = (1 << zz + Math.floor(256 / g / 2)) - 1 - yy;
     //       g = yy.toString(); h = g.charAt(g.length - 1) % h;
     //       (f = _d.url.replace(/\{x\}/, xx), f = f.replace(/\{y\}/, yy), f = f.replace(/\{z\}/, zz), f = f.replace(/\{dx\}/, Math.floor(xx / 16)), f = f.replace(/\{dy\}/, Math.floor(yy / 16)));
     //       e.length && (f = f.replace(/\{s\}/, e[h]));
     //       return f;
     //   };
	//} else {
		source.url = function(coord) {
            
            if(data.getTileUrl && data.getTileUrl instanceof Function){
                return data.getTileUrl(coord[0],coord[1],coord[2]);
            }

            return  data.url
                // .replace('{param}', str)
	            .replace('{x}', coord[0])
	            .replace('{y}', coord[1])
	            // TMS-flipped y coordinate
	            .replace(/\{[t-]y\}/, Math.pow(2, coord[2]) - coord[1] - 1)
	            .replace(/\{z(oom)?\}/, coord[2])
	            .replace(/\{switch:([^}]+)\}/, function(s, r) {
	                var subdomains = r.split(',');
	                return subdomains[(coord[0] + coord[1]) % subdomains.length];
	            })
	            .replace('{u}', function() {
	                var u = '';
	                for (var zoom = coord[2]; zoom > 0; zoom--) {
	                    var b = 0;
	                    var mask = 1 << (zoom - 1);
	                    if ((coord[0] & mask) !== 0) b++;
	                    if ((coord[1] & mask) !== 0) b += 2;
	                    u += b.toString();
	                }
	                return u;
	            });
	    };
	//}
    

    /**
     * 墨卡托投影坐标转换
     * @param latlng 经纬度
     * @param zoom  等级
     * @return array[lng,lat]
     */
    source.sphericalMercator = function(latlng,zoom){
        scale = 256 * Math.pow(2, zoom);
            var d =  Math.PI / 180,
                max =  85.0511287798,
                lat = Math.max(Math.min(max, latlng[1]), -max),
                x = latlng[0] * d,
                y = lat * d;
            y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));
            return [x * 6378137, y * 6378137];
    };
    /**
     * 获取wms url 
     * @param context 地图上下文
     * @param width  栅格图宽度
     * @param heigth  栅格图高度
     * @return string(url)
     */
    source.wmsurl = function(context,width,heigth){
            var extent = context.extent();
            var zoom = context.map().zoom();
            var lat = this.sphericalMercator(extent[0],zoom).toString();
            var lng = this.sphericalMercator(extent[1],zoom).toString();
            return data.url + lat + "," + lng + "&WIDTH=" + width + "&HEIGHT=" + heigth ;
    };
/*
    获取wms 日期url
    @param context 地图上下文
    * @param width  栅格图宽度
    * @param heigth  栅格图高度
    @remark 资三 id="wms_r3"和普通jpg卫星图url不一致和方法均不一致，需要分开处理
    * @return string(url)
*/
    source.vmGetDateUrl=function(context,width,height){
         var extent = context.extent();
            var zoom = context.map().zoom();
            if(data.id=="wms"){
                // var lat = this.sphericalMercator(extent[0],zoom).toString();
                // var lng = this.sphericalMercator(extent[1],zoom).toString();
                var lat = extent[0].toString();
                var lng = extent[1].toString();
                return data.wmsDateUrl + lat + "," + lng + "&WIDTH=" + width + "&HEIGHT=" + height ;
            }else if(data.id=="wms_r3"){
                var lon=context.map().center()[0];
                var lat=context.map().center()[1];
                return data.wmsDateUrl+"lon="+lon+"&lag="+lat;

            }else{
                return ""
            }

            
    }
    source.intersects = function(extent) {
        extent = extent.polygon();
        return !data.polygon || data.polygon.some(function(polygon) {
            return iD.geo.polygonIntersectsPolygon(polygon, extent);
        });
    };

    source.validZoom = function(z) {
        // return source.zooms[0] <= z &&
            // (!source.isLocatorOverlay() || source.zooms[1] > z);
        return (source.zooms[0] <= z && source.zooms[1] >= z);
    };

    source.isLocatorOverlay = function() {
        return name === 'Locator Overlay';
    };

    source.copyrightNotices = function() {};

    return source;
};

iD.BackgroundSource.Bing = function(data, dispatch) {
    // http://msdn.microsoft.com/en-us/library/ff701716.aspx
    // http://msdn.microsoft.com/en-us/library/ff701701.aspx

//  data.url = 'https://ecn.t{switch:0,1,2,3}.tiles.virtualearth.net/tiles/a{u}.jpeg?g=587&mkt=en-gb&n=z';
    data.url = iD.config.URL.kd_picture;

    var bing = iD.BackgroundSource(data),
        key = 'Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU', // Same as P2 and JOSM
        url = 'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/Aerial?include=ImageryProviders&key=' +
            key + '&jsonp={callback}',
        providers = [];

    /*d3.jsonp(url, function(json) {
        providers = json.resourceSets[0].resources[0].imageryProviders.map(function(provider) {
            return {
                attribution: provider.attribution,
                areas: provider.coverageAreas.map(function(area) {
                    return {
                        zoom: [area.zoomMin, area.zoomMax],
                        extent: iD.geo.Extent([area.bbox[1], area.bbox[0]], [area.bbox[3], area.bbox[2]])
                    };
                })
            };
        });
        dispatch.change();
    });*/

    bing.copyrightNotices = function(zoom, extent) {
        zoom = Math.min(zoom, 21);
        return providers.filter(function(provider) {
            return _.any(provider.areas, function(area) {
                return extent.intersects(area.extent) &&
                    area.zoom[0] <= zoom &&
                    area.zoom[1] >= zoom;
            });
        }).map(function(provider) {
            return provider.attribution;
        }).join(', ');
    };

    bing.logo = 'bing_maps.png';
    bing.terms_url = 'http://opengeodata.org/microsoft-imagery-details';

    return bing;
};

iD.BackgroundSource.None = function() {
    var source = iD.BackgroundSource({id: 'none', url: ''});

    source.name = function() {
        return t('background.none');
    };

    source.imageryUsed = function() {
        return 'None';
    };

    return source;
};

iD.BackgroundSource.Custom = function(url) {
    var source = iD.BackgroundSource({id: 'custom', url: url});

    source.name = function() {
        return t('background.custom');
    };

    source.imageryUsed = function() {
        return 'Custom (' + url + ')';
    };

    return source;
};
