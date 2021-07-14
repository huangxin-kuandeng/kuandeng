iD.util = {};

iD.util.tagText = function(entity) {
    return d3.entries(entity.tags).map(function(e) {
        return e.key + '=' + e.value;
    }).join(', ');
};

iD.util.entitySelector = function(ids) {
    return ids.length ? '.' + ids.join(',.') : 'nothing';
};

iD.util.entityOrMemberSelector = function(ids, graph) {
    var s = iD.util.entitySelector(ids);

    ids.forEach(function(id) {
        var entity = graph.hasEntity(id);
        if (entity && entity.type === 'relation') {
            entity.members.forEach(function(member) {
                s += ',.' + member.id;
            });
        }
    });

    return s;
};

// iD.util.displayName = function(entity) {
//     var localeName = 'name:' + iD.detect().locale.toLowerCase().split('-')[0];
//     return entity.tags[localeName] || entity.tags.name || entity.tags.ref;
// };

iD.util.displayName = function(entity,custom) {
    var localeName = custom || 'name';
    return entity.tags[localeName] || '';
};

iD.util.empty = function(){
    return true;
}



iD.util.stringQs = function(str) {
    return str.split('&').reduce(function(obj, pair){
        var parts = pair.split('=');
        if (parts.length === 2) {
            obj[parts[0]] = (null === parts[1]) ? '' : decodeURIComponent(parts[1]);
        }
        return obj;
    }, {});
};

iD.util.qsString = function(obj, noencode) {
    function softEncode(s) { return s.replace('&', '%26'); }
    return Object.keys(obj).sort().map(function(key) {
        return encodeURIComponent(key) + '=' + (
            noencode ? softEncode(obj[key]) : encodeURIComponent(obj[key]));
    }).join('&');
};

iD.util.prefixDOMProperty = function(property) {
    var prefixes = ['webkit', 'ms', 'moz', 'o'],
        i = -1,
        n = prefixes.length,
        s = document.body;

    if (property in s)
        return property;

    property = property.substr(0, 1).toUpperCase() + property.substr(1);

    while (++i < n)
        if (prefixes[i] + property in s)
            return prefixes[i] + property;

    return false;
};

iD.util.prefixCSSProperty = function(property) {
    var prefixes = ['webkit', 'ms', 'Moz', 'O'],
        i = -1,
        n = prefixes.length,
        s = document.body.style;

    if (property.toLowerCase() in s)
        return property.toLowerCase();

    while (++i < n)
        if (prefixes[i] + property in s)
            return '-' + prefixes[i].toLowerCase() + property.replace(/([A-Z])/g, '-$1').toLowerCase();

    return false;
};


iD.util.setTransform = function(el, x, y, scale) {
    var prop = iD.util.transformProperty = iD.util.transformProperty || iD.util.prefixCSSProperty('Transform'),
        translate = iD.detect().opera ?
            'translate('   + x + 'px,' + y + 'px)' :
            'translate3d(' + x + 'px,' + y + 'px,0)';
    return el.style(prop, translate + (scale ? ' scale(' + scale + ')' : ''));
};

iD.util.getStyle = function(selector) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules || [];
        for (var k = 0; k < rules.length; k++) {
            var selectorText = rules[k].selectorText && rules[k].selectorText.split(', ');
            if (_.contains(selectorText, selector)) {
                return rules[k];
            }
        }
    }
};

iD.util.editDistance = function(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (var j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                    Math.min(matrix[i][j-1] + 1, // insertion
                    matrix[i-1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
};

// a d3.mouse-alike which
// 1. Only works on HTML elements, not SVG
// 2. Does not cause style recalculation
iD.util.fastMouse = function(container) {
    var rect = _.clone(container.getBoundingClientRect()),
        rectLeft = rect.left,
        rectTop = rect.top,
        clientLeft = +container.clientLeft,
        clientTop = +container.clientTop;
    return function(e) {
        return [
            e.clientX - rectLeft - clientLeft,
            e.clientY - rectTop - clientTop];
    };
};
//截取字符串
iD.util.substring = function(text,length){
    //暂时先不截取字符
   // return text;
    
    var v = text.trim(),
        l = v.length;
    if(length < l){
        v = v.substring(0,length) + '...';
    }
    return v;
}

/* jshint -W103 */
iD.util.getPrototypeOf = Object.getPrototypeOf || function(obj) { return obj.__proto__; };

iD.util.asyncMap = function(inputs, func, callback) {
    var remaining = inputs.length,
        results = [],
        errors = [];

    inputs.forEach(function(d, i) {
        func(d, function done(err, data) {
            errors[i] = err;
            results[i] = data;
            remaining --;
            if (!remaining) callback(errors, results);
        });
    });
};

// wraps an index to an interval [0..length-1]
iD.util.wrap = function(index, length) {
    if (index < 0)
        index += Math.ceil(-index/length)*length;
    return index % length;
};

iD.util.arrayRemove = function(o,array){
    var news = [];
    for (var i = 0; i < array.length; i++) {
        var node = array[i];
        if (node !== o && news[news.length - 1] !== node) {
            news.push(node);
        }
    }
    if (array.length > 1 && array[0] === o
        && array[array.length - 1] === o 
        && news[news.length - 1] !== news[0]) {
        news.push(news[0]);
    }
    return news;
};
/**
 * var json1 = {a:6,b:2,c:4};
 * var json2 = {a:1,b:0,c:3};
 * json1 替换json2中已有的值，没有则追加
 * 返回合并后的新对象
 */
iD.util.merge = function(json1,json2){
    for(var key in json1){
        json2[key] = json1[key];
    }
    //创建新对象
    var r = {};
    for(var k in json2){
        r[k] = json2[k];
    }
    return r; 
};

///**
// +----------------------------------------------------------
// * 判断点在线上
// +----------------------------------------------------------
// * @param pts 多边形
// * @param pt 点
// +----------------------------------------------------------
// */
//iD.util.pointAtLine = function(line,e){
//    var dis = this.pt2LineDist(line["path"],e);
//    //if(dis<10){//在10像素范围内则触发
//    //    this._map._trigger(line,e.type,e);//触发事件
//    //}
//    console.log(dis);
//}

//求点到线的最短距离
iD.util.pt2LineDist = function(line,Pt) {
    var a={dis:Number.MAX_VALUE};
    for (var i=0;i<line.length-1;i++) {
        var arr = [line[i],line[i+1]];
        var b = this.pt2LineSegmentDist(arr,Pt);
        if (b.dis < a.dis) {
            a = {"x":b["x"],"y":b["y"],dis:b["dis"],i:i};
        }
    }
    //计算像素距离
    //a.dis = Math.round(iD.geo.sphericalDistance(Pt,[a.x, a.y]))/this._map.getResolution();
    return a;
}

//求点到直线最短距离点及距离
iD.util.pt2LineSegmentDist = function(line,pt) {
    var x = 0,y = 0;
    var dX = line[1][0] - line[0][0],dY = line[1][1] - line[0][1];
    var dR = -(line[0][1] - pt[1]) * dY - (line[0][0] - pt[0]) * dX;
    var dL;
    if (dR <= 0) {
        x = line[0][0];
        y = line[0][1];
    } else if (dR >= (dL = dX * dX + dY * dY)) {
        x = line[1][0];
        y = line[1][1];
    } else {
        x = line[0][0] + dR * dX / dL;
        y = line[0][1] + dR * dY / dL;
    }
    //返回实地距离
    return {"x":x,"y":y,dis:Math.pow(pt[0]-x,2) + Math.pow(pt[1] - y,2)}
}

iD.util.isPointInPolygon = function(point, polygon){
        var pts = polygon.nodes;//获取多边形点
        
        //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
        //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
        //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。
        
        var N = pts.length;
        var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        var intersectCount = 0;//cross points count of x 
        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        var p1, p2;//neighbour bound vertices
        var p = point; //测试点
        
         p1 = pts[0];//left vertex
        for(var i = 1; i <= N; ++i){//check all rays
            if(p.loc[0] == p1.loc[0] && p.loc[1] == p1.loc[1]){
                return boundOrVertex;//p is an vertex
            }
            
            p2 = pts[i % N];//right vertex            
            if(p.loc[1] < Math.min(p1.loc[1], p2.loc[1]) || p.loc[1] > Math.max(p1.loc[1], p2.loc[1])){//ray is outside of our interests                
                p1 = p2; 
                continue;//next ray left point
            }
            
            if(p.loc[1] > Math.min(p1.loc[1], p2.loc[1]) && p.loc[1] < Math.max(p1.loc[1], p2.loc[1])){//ray is crossing over by the algorithm (common part of)
                if(p.loc[0] <= Math.max(p1.loc[0], p2.loc[0])){//x is before of ray                    
                    if(p1.loc[1] == p2.loc[1] && p.loc[0] >= Math.min(p1.loc[0], p2.loc[0])){//overlies on a horizontal ray
                        return boundOrVertex;
                    }
                    
                    if(p1.loc[0] == p2.loc[0]){//ray is vertical                        
                        if(p1.loc[0] == p.loc[0]){//overlies on a vertical ray
                            return boundOrVertex;
                        }else{//before ray
                            ++intersectCount;
                        } 
                    }else{//cross point on the left side                        
                        var xinters = (p.loc[1] - p1.loc[1]) * (p2.loc[0] - p1.loc[0]) / (p2.loc[1] - p1.loc[1]) + p1.loc[0];//cross point of lng                        
                        if(Math.abs(p.loc[0] - xinters) < precision){//overlies on a ray
                            return boundOrVertex;
                        }
                        
                        if(p.loc[0] < xinters){//before ray
                            ++intersectCount;
                        } 
                    }
                }
            }else{//special case when ray is crossing through the vertex                
                if(p.loc[1] == p2.loc[1] && p.loc[0] <= p2.loc[0]){//p crossing over p2                    
                    var p3 = pts[(i+1) % N]; //next vertex                    
                    if(p.loc[1] >= Math.min(p1.loc[1], p3.loc[1]) && p.loc[1] <= Math.max(p1.loc[1], p3.loc[1])){//p.loc[1] lies between p1.loc[1] & p3.loc[1]
                        ++intersectCount;
                    }else{
                        intersectCount += 2;
                    }
                }
            }            
            p1 = p2;//next ray left point
        }
        
        if(intersectCount % 2 == 0){//偶数在多边形外
            return false;
        } else { //奇数在多边形内
            return true;
        }            
}

iD.util.getDom = function (id) {
	return document.getElementById(id);
}


iD.util.transArray = function(object) {
    if(object && (typeof object === 'string')){
       object = [object];
    }
    return object || [];
};

iD.util.angleTranslate = function(angle,delt) {
    var x = 0, y = 0;
    if(angle <= 0) angle = 360 + angle;
    var deltx = delt * Math.abs(Math.sin((Math.PI / 180) * angle)).toFixed(2),
        delty = delt * Math.abs(Math.cos((Math.PI / 180) * angle)).toFixed(2);
    
    if (angle < 90 && angle >= 0) {x = deltx; y = -delty;}
    else if (angle < 180 && angle >= 90) {x = deltx; y = delty;}
    else if (angle < 270 && angle >= 180) {x = -deltx; y = delty;}
    else if (angle <= 360 && angle >= 270) {x = -deltx; y = -delty;}
    return {
        'x' : x,
        'y' : y,
        'angle' : angle
    }
}

//获取对象CSS值
iD.util.getStyleValue = function(obj, key) {
	var value = obj.style[key];

	if (!value && obj.currentStyle) {
		value = obj.currentStyle[key];
	}

	if ((!value || value === 'auto') && document.defaultView) {
		var css = document.defaultView.getComputedStyle(obj, null);
		value = css ? css[key] : null;
	}

	if ((!value || value === 'auto') && key === 'height') {
		value = obj.clientHeight + 'px';
	}

	if ((!value || value === 'auto') && key === 'width') {
		value = obj.clientWidth + 'px';
	}

	return value === 'auto' ? null : value;
}

iD.util.getLocsCenter = function(locs) {
	var total_lng = 0, total_lat = 0, len = locs.length;
	for (var i in locs) {
		total_lng += locs[i][0];
		total_lat += locs[i][1];
	}
	return [total_lng / len, total_lat / len];
}

iD.util.getLocsLenCenter = function(locs, projection) {
	
	var pixels = [], len = locs.length;
	for (var i = 0;i < len;i++) {
		pixels.push(projection(locs[i]));
	}
	
	var total_dis1 = 0, distances = [];
	for (var j = 0;j < len - 1;j++) {
		var x1 = pixels[j][0], y1 = pixels[j][1], x2 = pixels[j + 1][0], y2 = pixels[j + 1][1];
		var dis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		total_dis1 += dis;
		distances.push(dis);
	}
	
	var total_dis_avg = total_dis1 / 2;
	
	var total_dis2 = 0, n = 0;
	for (var k = 0;k < len - 1;k++) {
		total_dis2 += distances[k];
		if (total_dis2 >= total_dis_avg) {
			n = k + 1;
			break;
		}
	}
	
	var a = pixels[n], b = pixels[n - 1], delt = total_dis2 - total_dis_avg;
	var x_y = iD.util.getLenCenter (a, b, delt);
	var coords = projection.invert([x_y[0], x_y[1]]);
	
	return coords;
}

iD.util.getLenCenter = function (a, b, delt) {
	var pixel = [], angle = 0;
	if(b[0] !== a[0]) {
		angle = Math.atan(Math.abs((b[1] - a[1]) / (b[0] - a[0])));
		if(b[1] - a[1] > 0 && b[0] - a[0] > 0) {
			pixel.push(a[0] + delt * Math.cos(angle));
			pixel.push(a[1] + delt * Math.sin(angle));
		}
		if(b[1] - a[1] < 0 && b[0] - a[0] > 0) {
			pixel.push(a[0] + delt * Math.cos(angle));
			pixel.push(a[1] - delt * Math.sin(angle));
		}
        if(b[1] - a[1] < 0 && b[0] - a[0] < 0) {
        	pixel.push(a[0] - delt * Math.cos(angle));
        	pixel.push(a[1] - delt * Math.sin(angle));
        }
        if(b[1] - a[1] > 0 && b[0]- a[0] < 0) {
        	pixel.push(a[0] - delt * Math.cos(angle));
        	pixel.push(a[1] + delt * Math.sin(angle));
        }
	}
	if(b[1] === a[1]) {
		pixel.push(a[0] + (b[0] - a[0] > 0 ? 1 : -1) * delt);
		pixel.push(a[1]);
	}
	if(b[0] === a[0]) {
		pixel.push(a[0]);
		pixel.push(a[1] + (b[1] - a[1] > 0 ? 1 : -1) * delt);
	}
    return pixel;
}


iD.util.storeDottedLoc = function (entity, way, key, store, context, entities) {
	var wNodes = way.nodes, nlocs = [];
	if (entities) {
		for (var j in wNodes) for (var k in entities) if (wNodes[j] === entities[k].id) nlocs.push(entities[k].loc);
	} else {
		for (var j in wNodes) nlocs.push(context.graph().entity(wNodes[j]).loc);
	}
	var upright = iD.util.pt2LineDist(nlocs, entity.loc);
	store[key] = [upright.x, upright.y];
}

iD.util.cookie = {
    getItem: function(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function(sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

iD.util.getPathInCircle = function (center, d, p) {
    var PI = Math.PI, points = [], point = center;
    var s = p(point), count = 60;
    var step = (2.0 * PI / count), angle;
    for (var i = 0; i <= (count - 1); i++) {
        angle = i * step;
        var x = s[0] + Math.cos(angle) * d, y = s[1] + Math.sin(angle) * d;
        points.push(p.invert([x, y]));
    }
    return points;
}

iD.util.path = function (locs, projection, polygon) {
    var round = iD.svg.Round().stream,
        clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
        project = projection.stream,
        path = d3.geo.path()
            .projection({stream: function(output) { return polygon ? project(round(output)) : project(clip(round(output))); }}),
        json = {type : (polygon ? 'Polygon' : 'LineString'), coordinates: locs};

    if (locs && locs[0] && locs[0][0].loc) {
        json.coordinates = [];
        for (var k = 0;k < locs.length;k++) {
            var lcs = [];
            for (var n = 0;n < locs[k].length;n++) {
                lcs.push(locs[k][n].loc);
            }
            json.coordinates.push(lcs);
        }
    }
    return path(json);
}
