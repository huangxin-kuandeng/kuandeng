/*
 * @Author: tao.w
 * @Date: 2019-09-20 22:07:44
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-12 14:18:58
 * @Description: 
 */
iD.util = {};

iD.util.tagText = function (entity) {
    return d3.entries(entity.tags).map(function (e) {
        return e.key + '=' + e.value;
    }).join(', ');
};

iD.util.entitySelector = function (ids) {
    return ids.length ? '.' + ids.join(',.') : 'nothing';
};

iD.util.entityOrMemberSelector = function (ids, graph) {
    //  解决轨迹切换报错
    if (ids) {
        var s = iD.util.entitySelector(ids);
    } else {
        return
    }

    ids.forEach(function (id) {
        var entity = graph.hasEntity(id);
        if (entity && entity.type === 'relation') {
            entity.members.forEach(function (member) {
                s += ',.' + member.id;
            });
        }
    });

    return s;
};

/**
 * 根据关系要素，获取翻页显示时用的高亮要素
 * @param {Object} entity
 * @param {Object} context
 * @param {Boolean} 是否高亮
 */
iD.util.entityRelationFooterHighlightSelector = function (entity, context, highlight) {
    if (!entity) return '';
    var graph = context.graph();
    if (highlight) {
        context.surface().selectAll('.selected').classed('selected', false);
    }
    if (entity.geometry(graph) != iD.data.GeomType.RELATION) {
        if (highlight) {
            context.surface().selectAll('.' + entity.id).classed('selected', true);
        }
        return '';
    }
    // 关系类型：优先C_NODE、点类型、其次线、若线中有参考线则第一个参考线
    var entityList = _.map(_.pluck(entity.members, 'id'), graph.entity, graph);
    // var modelNames = _.compact(_.uniq(_.pluck(entityList, 'modelName')));
    var typeMap = _.groupBy(entityList, function (d) {
        /*
        var type = d.geometry(graph);
        if(type == "vertex"){
            type = iD.data.GeomType.NODE;
        }
        if(type == 'area' || type == 'line'){
            type = iD.data.GeomType.WAY;
        }
        return type;
        */
        return d.type;
    });
    var selecteds = [],
        onlySelect;
    var nodes = typeMap[iD.data.GeomType.NODE] || [];
    for (var d of nodes) {
        if (d.modelName == iD.data.DataType.C_NODE) {
            onlySelect = d.id;
            break;
        }
        selecteds.push(d.id);
    }
    var ways = typeMap[iD.data.GeomType.WAY] || [];
    if (!onlySelect && !selecteds.length && entity.modelName == iD.data.DataType.R_DIVIDER_DREF) {
        // 车道线分组，第一根参考线
        for (var d of ways) {
            if (d.modelName == iD.data.DataType.DIVIDER && d.tags.R_LINE == '1') {
                onlySelect = d.id;
                break;
            }
        }
    }
    if (!onlySelect && !selecteds.length) {
        // 分组线，第一根参考线
        for (var d of ways) {
            selecteds.push(d.id);
        }
    }
    var result = '';
    if (onlySelect) {
        result = iD.util.entitySelector([onlySelect]);
    } else if (selecteds.length) {
        result = iD.util.entitySelector(selecteds);
    }
    if (highlight && result) {
        context.surface().selectAll(result).classed('selected', true);
    }
    return result;
}

/**
 * 获取relation中的主要memberid
 * @param {Object} entity
 * @param {Object} context
 */
iD.util.entityRelationMainMember = function (entity, context) {
    if (!(entity instanceof iD.Relation)) {
        return;
    }
    var result;
    var geoType = '',
        filterFun = () => true;
    if (_.include([
        iD.data.DataType.DIVIDER_ATTRIBUTE,
        iD.data.DataType.LANE_ATTRIBUTE,
        iD.data.DataType.R_ROAD_RA
    ], entity.modelName)) {
        geoType = iD.data.GeomType.NODE;
    } else if (entity.modelName == iD.data.DataType.R_DIVIDER_DREF) {
        geoType = iD.data.GeomType.WAY;
        filterFun = function (d) {
            return d && d.tags.R_LINE == '1';
        }
    }

    for (let m of entity.members || []) {
        let d = context.hasEntity(m.id);
        if (d && d.type == geoType && filterFun(d)) {
            result = d.id;
            break;
        }
    }

    if (!result && entity.members && entity.members.length) {
        result = entity.members[0].id;
    }
    return result;
}

// iD.util.displayName = function(entity) {
//     var localeName = 'name:' + iD.detect().locale.toLowerCase().split('-')[0];
//     return entity.tags[localeName] || entity.tags.name || entity.tags.ref;
// };

iD.util.displayName = function (entity, custom) {
    var localeName;
    if (entity.tags.road_class == "roadcrossline") {
        localeName = entity.tags[custom || 'name_chn'] || entity.tags['name'] || "未命名";
    } else if (typeof entity.tags != 'undefined' &&
        typeof entity.modelName != 'undefined' &&
        entity.modelName == 'Highway') {
        localeName = entity.tags[custom || 'name_chn'] || entity.tags['name'] || "未命名";
    } else {
        localeName = entity.tags[custom || 'name_chn'] || entity.tags['name'];
    }
    return localeName || '';
};
iD.util.displayTypeName = function (entity, custom, context) {

    var localeName;
    if (entity.tags.road_class == "roadcrossline") {
        localeName = "内部道路"
    } else if (typeof entity.tags != 'undefined' &&
        typeof entity.modelName != 'undefined' &&
        entity.modelName == 'Highway') {
        var findTypeName = function (k, v) {
            var n = _.find(
                _.find(
                    iD.Layers.getLayer(context.entity(entity.id).layerId).modelEntity().getFields(),
                    function (a) {
                        return a.fieldName == k
                    }
                ).fieldInput.values,
                function (b) {
                    return b.value == v
                });
            return n && typeof n.name != "undefined" ? n.name : "";
        }

        localeName = custom ? findTypeName(custom, entity.tags[custom]) : findTypeName('road_class', entity.tags['road_class']);
    } else if (typeof entity.tags != 'undefined' &&
        typeof entity.modelName != 'undefined' &&
        entity.modelName == iD.data.DataType.WALKLINK) {
        var findTypeName = function (k, v) {
            var currentLayer = iD.Layers.getLayer(entity.layerId),
                modelEntity = currentLayer.modelEntity(),
                geoType = modelEntity.getGeoType();
            if (currentLayer.isRoad()) {
                var typeModelEntity = currentLayer.typeModelEntity()[entity.modelName];
                if (typeModelEntity) { //只针对子图层
                    geoType = typeModelEntity.modelId;
                    modelEntity = typeModelEntity.model;
                } else {
                    geoType = '';
                }
            }
            var fields = modelEntity.getFields(geoType);

            var n = _.find(
                _.find(
                    fields,
                    function (a) {
                        return a.fieldName == k
                    }
                ).fieldInput.values,
                function (b) {
                    return b.value == v
                });
            return n && typeof n.name != "undefined" ? n.name : "";
        }

        localeName = custom ? findTypeName(custom, entity.tags[custom]) : findTypeName('wf_type', entity.tags['wf_type']);
        //localeName = entity.tags&&entity.tags['wf_type'];
    } else if (typeof entity.tags != 'undefined' &&
        typeof entity.modelName != 'undefined') {
        if (entity.modelName == iD.data.Constant.ROADNODE) {
            localeName = "路口";
        } else if (entity.modelName == iD.data.Constant.C_NODE) {
            localeName = "综合交叉路口";
        }
    }
    return localeName || '';
};

iD.util.empty = function () {
    return true;
}


iD.util.stringQs = function (str) {
    return str.split('&').reduce(function (obj, pair) {
        var parts = pair.split('=');
        if (parts.length === 2) {
            obj[parts[0]] = (null === parts[1]) ? '' : decodeURIComponent(parts[1]);
        }
        return obj;
    }, {});
};

iD.util.qsString = function (obj, noencode) {
    function softEncode(s) {
        return s.replace('&', '%26');
    }

    return Object.keys(obj).sort().map(function (key) {
        return encodeURIComponent(key) + '=' + (
            noencode ? softEncode(obj[key]) : encodeURIComponent(obj[key]));
    }).join('&');
};

iD.util.prefixDOMProperty = function (property) {
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

iD.util.prefixCSSProperty = function (property) {
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


iD.util.setTransform = function (el, x, y, scale) {
    var prop = iD.util.transformProperty = iD.util.transformProperty || iD.util.prefixCSSProperty('Transform'),
        translate = iD.detect().opera ?
            'translate(' + x + 'px,' + y + 'px)' :
            'translate3d(' + x + 'px,' + y + 'px,0)';
    return el.style(prop, translate + (scale ? ' scale(' + scale + ')' : ''));
};

iD.util.getStyle = function (selector) {
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

iD.util.editDistance = function (a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (var j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
};

// a d3.mouse-alike which
// 1. Only works on HTML elements, not SVG
// 2. Does not cause style recalculation
iD.util.fastMouse = function (container) {
    var rect = _.clone(container.getBoundingClientRect()),
        rectLeft = rect.left,
        rectTop = rect.top,
        clientLeft = +container.clientLeft,
        clientTop = +container.clientTop;
    return function (e) {
        return [
            e.clientX - rectLeft - clientLeft,
            e.clientY - rectTop - clientTop
        ];
    };
};
//截取字符串
iD.util.substring = function (text, length) {
    //暂时先不截取字符
    // return text;

    var v = text.trim(),
        l = v.length;
    if (length < l) {
        v = v.substring(0, length) + '...';
    }
    return v;
}

/* jshint -W103 */
iD.util.getPrototypeOf = Object.getPrototypeOf || function (obj) {
    return obj.__proto__;
};

iD.util.asyncMap = function (inputs, func, callback) {
    var remaining = inputs.length,
        results = [],
        errors = [];

    inputs.forEach(function (d, i) {
        func(d, function done(err, data) {
            errors[i] = err;
            results[i] = data;
            remaining--;
            if (!remaining) callback(errors, results);
        });
    });
};

// wraps an index to an interval [0..length-1]
iD.util.wrap = function (index, length) {
    if (index < 0)
        index += Math.ceil(-index / length) * length;
    return index % length;
};

iD.util.arrayRemove = function (o, array) {
    var news = [];
    for (var i = 0; i < array.length; i++) {
        var node = array[i];
        if (node !== o && news[news.length - 1] !== node) {
            news.push(node);
        }
    }
    if (array.length > 1 && array[0] === o &&
        array[array.length - 1] === o &&
        news[news.length - 1] !== news[0]) {
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
iD.util.merge = function (json1, json2) {
    for (var key in json1) {
        json2[key] = json1[key];
    }
    //创建新对象
    var r = {};
    for (var k in json2) {
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

iD.util.pt2WayDist = function (nodes, pt) {

}

//求点到线的最短距离，像素精准
iD.util.pt2LineDist = function (line, Pt) {
    var a = {
        dis: Number.MAX_VALUE
    };
    for (var i = 0; i < line.length - 1; i++) {
        var arr = [line[i], line[i + 1]];
        var b = this.pt2LineSegmentDist(arr, Pt);
        if (b.dis < a.dis) {
            a = {
                "x": b["x"],
                "y": b["y"],
                dis: b["dis"],
                i: i
            };
        }
    }
    //计算像素距离
    //a.dis = Math.round(iD.geo.sphericalDistance(Pt,[a.x, a.y]))/this._map.getResolution();
    return a;
}

//求点到直线最短距离点及距离
iD.util.pt2LineSegmentDist = function (line, pt) {
    var x = 0,
        y = 0;
    var dX = line[1][0] - line[0][0],
        dY = line[1][1] - line[0][1];
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
    return {
        "x": x,
        "y": y,
        dis: Math.sqrt(Math.pow(pt[0] - x, 2) + Math.pow(pt[1] - y, 2))
    }
}

//求点到线的最短距离，经纬度精准
iD.util.pt2LineDist2 = function (line, Pt) {
    var a = {
        dis: Number.MAX_VALUE
    };
    for (var i = 0; i < line.length - 1; i++) {
        var arr = [line[i], line[i + 1]];
        var b = this.pt2LineSegmentDist2(arr, Pt);
        if (b.dis < a.dis) {
            a = {
                "x": b["x"],
                "y": b["y"],
                dis: b["dis"],
                i: i
            };
        }
    }
    //计算像素距离
    //a.dis = Math.round(iD.geo.sphericalDistance(Pt,[a.x, a.y]))/this._map.getResolution();
    return a;
}

//求点到直线最短距离点及距离
iD.util.pt2LineSegmentDist2 = function (line, pt) {
    var x = 0,
        y = 0;
    var dX = line[1][0] - line[0][0],
        dY = line[1][1] - line[0][1];
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
    return {
        "x": x,
        "y": y,
        dis: iD.geo.sphericalDistance(pt, [x, y])
    };
}


/**
 *
 * @param k 相机内参矩阵
 * @param point  轨迹点
 * @param xyz   投影坐标
 * @returns {[*,*,*,*]}
 */
iD.util.trackPointToPicPixe = function (k, point, xyz) {
    //相机外参
    let r = point.tags.R;
    let t = point.tags.T;
    let p = this.KRt(k, r, t);
    let x1 = matrix.multiply(p, this.UTMProjection(xyz));

    return [x1[0] / x1[2], x1[1] / x1[2], x1[2][0]];
}

/**
 * 经纬度坐标转UTM矩阵
 * @param xyz 坐标
 * @returns {Array}
 */
iD.util.UTMProjection = function (xyz) {
    var lon = xyz[0],
        lat = xyz[1],
        z = xyz[2];
    var utm = iD.util.LLtoUTM_(lon, lat);
    var X = [
        [utm.x],
        [utm.y],
        [z]
    ];
    X.push([1]);
    return X;
}

iD.util.hnormalized = function (x1) {
    return [
        [x1[0] / x1[2]],
        [x1[1] / x1[2]],
        [x1[2][0]]
    ];
}

/**
  *  计算线的延长距离
  * @param {*} p1 位置点1
  * @param {*} p2 位置点2
  * @param {*} range 距离
  */
iD.util.getLocationPoint = function (p1, p2, range = 10) {
    var _p2 = iD.util.LLtoUTM_(p2[0], p2[1]);
    var _p1 = iD.util.LLtoUTM_(p1[0], p1[1]);

    var p11 = [
        _p1.x,
        _p1.y,
        p1[2]
    ];
    var p22 = [
        _p2.x,
        _p2.y,
        p2[2]
    ];
    var dist = this.norm(p22, p11);
    var sub = matrix.subtraction(p22, p11);
    var s1 = [sub[0] * range, sub[1] * range, sub[2] * range];
    var s2 = [s1[0] / dist, s1[1] / dist, s1[2] / dist];
    var result = matrix.addition(p22, s2);
    var loc = iD.util.UTMtoLL_(result[0], result[1], _p2.zoneNumber);
    return [loc[0], loc[1], result[2]];
}

//向量归一化
iD.util.normalizedSqrt = function (x1) {
    let R = Math.sqrt(Math.pow(x1[0], 2) + Math.pow(x1[1], 2) + Math.pow(x1[2], 2));
    let rst = [x1[0] / R, x1[1] / R, x1[2] / R];
    if (isNaN(rst[0]) || isNaN(rst[1]) || isNaN(rst[2])) {
        rst = [0, 0, 0]
    }
    return rst;
}

iD.util.normalized = function (x1, x2) {
    let r = Math.pow((x2[0] - x1[0]), 2) + Math.pow((x2[1] - x1[1]), 2) + Math.pow((x2[2] - x1[2]), 2);
    r = Math.sqrt(r);
    return [
        [(x2[0] - x1[0]) / r],
        [(x2[1] - x1[1]) / r],
        [(x2[2] - x1[2]) / r]
    ];
    // matrix.subtraction(x2,x1);
    // return (x2[0]-x1[0],y2[1]-y1[1],z2[2]-z1[2])/Math.sqrt(R);
}

iD.util.norm = function (nx1, nx2) {
    return Math.sqrt(Math.pow(nx1[0] - nx2[0], 2) + Math.pow(nx1[1] - nx2[1], 2) + Math.pow(nx1[2] - nx2[2], 2));
}
/**
 *
 * @param K 相机内参
 * @param R 外参R矩阵
 * @param C 相机位置C
 * @param T
 * @param width
 * @param height
 * @param point1  经纬度坐标1
 * @param point2  经纬度坐标2
 * @returns {boolean}
 */
iD.util.getScreenLineSegment = function (k, r, t, width, height, point1, point2) {

    let p = this.KRt(k, r, t);
    let x1 = this.UTMProjection(point1);
    let x2 = this.UTMProjection(point2);

    let px1 = matrix.multiply(p, x1);
    let px2 = matrix.multiply(p, x2);

    if (px1[2] < 0 && px2 < 0) {
        return false;
    }
    if (px1[2] >= 0 && px2[2] >= 0) {
        sx1 = this.hnormalized(px1);
        sx2 = this.hnormalized(px2);
        return [sx1, sx2];
    } else {
        var nx1, nx2, nsx1 = [],
            nsx2, npx2;
        if (px1[2] < 0) {
            nx1 = x1;
            nx2 = x2;
            npx2 = px2;
        } else {
            nx1 = x2;
            nx2 = x1;
            npx2 = px1;
        }
        //第一个点在相机后方
        //方向向量
        //Vector3d
        //(x2-x1,y2-y1,z2-z1)/sqrt((x2-x1)*(x2-x1)+(y2-y1)*
        let n = this.normalized(nx2, nx1);
        // let n=Math.sqrt(matrix.vectorNorm(matrix.subtraction(nx2,nx1)));
        //距离
        let length = this.norm(nx2, nx1);
        //反向的线段
        let nXLength = matrix.scalar(n, matrix.scalar(length, 0.5));
        nXLength.push([1]);
        let x3 = matrix.addition(nx2, nXLength);
        //反向线段投影
        x3[3] = [1];
        let px3 = matrix.multiply(p, x3);
        nsx2 = this.hnormalized(npx2);
        let sx3 = this.hnormalized(px3);
        //新线段的两个端点的像素坐标差值
        let d32 = matrix.subtraction(sx3, nsx2);
        //已知两点，求得直线一般式的a*x+b*y+c=0的三个参数
        //
        let a = sx3[1] - nsx2[1];
        let b = nsx2[0] - sx3[0];
        let c = sx3[0] * nsx2[1] - nsx2[0] * sx3[1];
        //
        if (Math.abs(d32[0]) >= Math.abs(d32[1])) {
            if (d32[0] > 0) {
                nsx1[0] = 0;
                nsx1[1] = -c / b;
            } else if (d32[0] < 0) {
                nsx1[0] = width;
                nsx1[1] = -(c + a * width) / b;
            } else {
                nsx1[0] = nsx2[0];
                if (d32[1] > 0) {
                    nsx1[1] = 0;
                } else {
                    nsx1[1] = height;
                }
            }
        } else {
            if (d32[1] > 0) {
                // nsx1[1]=height;
                // nsx1[0]=-(c+b*height)/a;
                nsx1[0] = 0;
                nsx1[1] = -(c) / a;
            } else if (d32[1] < 0) {
                // nsx1[0]=0;
                // nsx1[1]=-(c)/a;
                nsx1[1] = height;
                nsx1[0] = -(c + b * height) / a;
            } else {
                nsx1[1] = nsx2[1];
                if (d32[0] > 0) {
                    nsx1[0] = 0;
                } else {
                    nsx1[0] = width;
                }
            }
        }
        if (px1[2] < 0) {
            sx1 = nsx1;
            sx2 = nsx2;
        } else {
            sx1 = nsx2;
            sx2 = nsx1;
        }
    }
    //
    return [sx1, sx2];
}
iD.util.getScreenPolygonSegment = function (k, r, t, width, height, point1, point2) {

    let p = this.KRt(k, r, t);
    let x1 = this.UTMProjection(point1);
    let x2 = this.UTMProjection(point2);

    let px1 = matrix.multiply(p, x1);
    let px2 = matrix.multiply(p, x2);

    if (px1[2] < 0 && px2[2] < 0) {
        return false;
    }
    if (px1[2] >= 0 && px2[2] >= 0) {
        sx1 = this.hnormalized(px1);
        sx2 = this.hnormalized(px2);
        return [sx1, sx2];
    } else {
        var nx1, nx2, nsx1 = [],
            nsx2, npx2;
        if (px1[2] < 0) {
            nx1 = x1;
            nx2 = x2;
            npx2 = px2;
        } else {
            nx1 = x2;
            nx2 = x1;
            npx2 = px1;
        }
        //第一个点在相机后方
        //方向向量
        //Vector3d
        let n = this.normalized(nx2, nx1);
        //距离
        let length = this.norm(nx2, nx1);
        //反向的线段
        let nXLength = matrix.scalar(n, matrix.scalar(length, 0.5));
        nXLength.push([1]);
        let x3 = matrix.addition(nx2, nXLength);
        //反向线段投影
        x3[3] = [1];
        let px3 = matrix.multiply(p, x3);
        nsx2 = this.hnormalized(npx2);
        let sx3 = this.hnormalized(px3);
        //新线段的两个端点的像素坐标差值
        let d32 = matrix.subtraction(sx3, nsx2);
        //已知两点，求得直线一般式的a*x+b*y+c=0的三个参数
        //
        let a = sx3[1] - nsx2[1];
        let b = nsx2[0] - sx3[0];
        let c = sx3[0] * nsx2[1] - nsx2[0] * sx3[1];
        //
        if (Math.abs(d32[0]) >= Math.abs(d32[1])) {
            if (d32[0] > 0) {
                nsx1[0] = 0;
                nsx1[1] = -c / b;
            } else if (d32[0] < 0) {
                nsx1[0] = width;
                nsx1[1] = -(c + a * width) / b;
            } else {
                nsx1[0] = nsx2[0];
                if (d32[1] > 0) {
                    nsx1[1] = 0;
                } else {
                    nsx1[1] = height;
                }
            }
        } else {
            if (d32[1] > 0) {
                nsx1[0] = 0;
                nsx1[1] = -(c) / a;
            } else if (d32[1] < 0) {
                nsx1[1] = height;
                nsx1[0] = -(c + b * height) / a;
            } else {
                nsx1[1] = nsx2[1];
                if (d32[0] > 0) {
                    nsx1[0] = 0;
                } else {
                    nsx1[0] = width;
                }
            }
        }
        if (px1[2] < 0) {
            sx1 = nsx1;
            sx2 = nsx2;
        } else {
            sx1 = nsx2;
            sx2 = nsx1;
        }
    }
    //
    return [sx1, sx2];
}

iD.util.getPixel2DepthCoordinate = function (trackPoint, depthData, K, xy, rang = 4) {
    function getPixelRang(xy, image_w, r) {
        let _rangs = [];
        _rangs.push(xy[1] * 4 * image_w + xy[0] * 4);
        for (let i = 1; i <= r; i++) {
            let p1 = xy[1] * 4 * image_w + (xy[0] - i) * 4; //左
            let p2 = xy[1] * 4 * image_w + (xy[0] + i) * 4; //右
            let p3 = (xy[1] - i) * 4 * image_w + xy[0] * 4; //上
            let p4 = (xy[1] + i) * 4 * image_w + xy[0] * 4; //下
            let p5 = (xy[1] - i) * 4 * image_w + (xy[0] - i) * 4; //左上
            let p6 = (xy[1] - i) * 4 * image_w + (xy[0] + i) * 4; //右上
            let p7 = (xy[1] + i) * 4 * image_w + (xy[0] - i) * 4; //左下
            let p8 = (xy[1] + i) * 4 * image_w + (xy[0] + i) * 4;//右下

            _rangs.push(p1, p2, p3, p4, p5, p6, p7, p8);
        }
        return _rangs;
    }
    let pixels = getPixelRang(xy, trackPoint.tags.picW, rang);
    let utm = iD.util.LLtoUTM_(trackPoint.loc[0], trackPoint.loc[1])
    for (let i = 0; i < pixels.length; i++) {
        let idx = pixels[i];
        let _r = depthData.data[idx] || 0;
        let _g = depthData.data[idx + 1] || 0;
        if (_r == 0 && _g == 0) continue;
        let dis = (_r * 256 + _g) / 1000;
        let result = this.getPixelCoordinate(K, trackPoint.tags.R, trackPoint.tags.C, trackPoint.tags.T, xy, dis);

        let ll = iD.util.UTMtoLL_(result[0][0], result[1][0], utm.zoneNumber, utm.designator);
        return { lng: ll[0], lat: ll[1], elevation: result[2][0] };
    }

    return false;
}

iD.util.getPixelCoordinate = function (K, R, C, T, pixel, dis) {
    //
    let u0 = K[0][2];
    let v0 = K[1][2];
    let fx = K[0][0];
    let fy = K[1][1];
    //
    let du = pixel[0] - u0;
    let dv = pixel[1] - v0;
    //
    // let r = Math.sqrt((du * du) / (fx * fx) + (dv * dv) / (fy * fy) + 1);
    let v1 = du / fx * dis;
    let v2 = dv / fy * dis;
    let v3 = dis;
    //
    // Eigen:: Vector3d T = -1.0 * (R) * C;
    let vc = [[v1], [v2], [v3], [1]];
    //VC=R*T*VW
    var rt = matrix.addCols(R, T);
    rt[3] = [];
    rt[3].push(0);
    rt[3].push(0);
    rt[3].push(0);
    rt[3].push(1);
    //     let rt = matrix.identity(4);
    //     // rt.block(0, 0, 3, 3) = R;
    //     // rt.block(0, 3, 3, 1) = T;
    //     //

    // Eigen:: Matrix4d rt = Eigen:: MatrixXd:: Identity(4, 4);
    // rt.block(0, 0, 3, 3) = R;
    // rt.block(0, 3, 3, 1) = T;
    //
    let vw = matrix.multiply(matrix.inverse(rt), vc);
    vw.pop();

    // Eigen:: Vector3d vw = (rt.inverse() * vc.homogeneous()).hnormalized();
    //
    return vw;
}

/**
 *  线于矩形的延长交点， 交点为直接正向延长点
 * @param line
 * @param rect
 * @returns {Array}
 */
iD.util.lineIntersectionRectangles = function (rect, line) {
    let x1 = rect[0][0],
        y1 = rect[0][1];
    let x2 = rect[1][0],
        y2 = rect[1][1];
    // let point = [NaN,NaN];
    // return this.test(rect,line);
    //分解拉框矩形区域为四条边线段,即矩形四条边
    let line1 = [x1, y1, x2, y1];
    let line2 = [x2, y1, x2, y2];
    let line3 = [x2, y2, x1, y2];
    let line4 = [x1, y2, x1, y1];
    let rectLines = [line1, line2, line3, line4];
    for (let i = 0, len = rectLines.length; i < len; i++) {
        let SegmentA = rectLines[i];
        let r = this.extendIntersection(SegmentA, line);
        if (!isNaN(r[0]) && !isNaN(r[1])) {
            // if(r[0]>=x1 && r[0]<=x2 && r[1]<=y2 && r[1]>=y1){
            return r;
            // }
            // if(this.onLine([line[2],line[3],r[0],r[1]],[line[0],line[1]])){
            //     return r;
            // }
        }
    }
    return false;
}
iD.util.multiply = function (sp, ep, op) {
    return ((sp[0] - op[0]) * (ep[1] - op[1]) - (ep[0] - op[0]) * (sp[1] - op[1]));
}
/**
 * 点是否在线上
 * @param l  线
 * @param p 点
 * @returns {boolean}
 * 用toLocaleString 把小数点后
 */
iD.util.onLine = function (l, p) {
    return ((+this.multiply([l[2], l[3]], p, [l[0], l[1]]).toFixed(8) == 0) && (((p[0] - l[0]) * (p[0] - l[2]) <= 0) && ((p[1] - l[1]) * (p[1] - l[3]) <= 0)));
}
/**
 * 求两条直线无线延长后交点
 * @param line1
 * @param line2
 * @returns {[*]}
 */
iD.util.extendIntersection = function (line1, line2) {
    var m1 = (line1[0] - line1[2]);
    var m2 = (line2[2] - line2[0]);
    if (m1 == 0) m1 = 1;
    if (m2 == 0) m2 = 1;
    var k0 = (line1[1] - line1[3]) / m1;
    var e = (line1[3] - k0 * line1[2]);
    var k1 = (line2[3] - line2[1]) / m2;
    var e1 = (line2[3] - k1 * line2[2]);
    var x = (e1 - e) / (k0 - k1);
    var y = k0 * x + e;

    return [x, y];
}
/*
* 三角形求内切圆圆心（即三角形内心）
* @param vertexs 三角形顶点集合
*        lengths 三角形边长集合
* @return 内切圆中心点
* create by Tilden
*
* @TODO
 内心是角平分线的交点,到三边距离相等.
 设:在三角形ABC中,三顶点的坐标为：A(x1,y1),B(x2,y2),C(x3,y3) BC=a,CA=b,AB=c
 内心为M （X,Y）则有aMA+bMB+cMC=0（三个向量）l
 MA=（x1-X,y1-Y）
 MB=(x2-X,y2-Y)
 MC=(x3-X,y3-Y)
 则：a(x1-X)+b(x2-X)+c(x3-X)=0,a(y1-Y)+b(y2-Y)+c(y3-Y)=0
 ∴X=（ax1+bx2+cx3)/(a+b+c),Y=（ay1+by2+cy3)/(a+b+c)
 ∴M（（ax1+bx2+cx3)/(a+b+c),（ay1+by2+cy3)/(a+b+c)）
*/
iD.util.triangleSolveIncircle = function (vertexs, lengths) {
    let A = vertexs[0],
        B = vertexs[1],
        C = vertexs[2];
    let a = lengths[0],
        b = lengths[1],
        c = lengths[2];
    if (A && B && C && a && b && c) {
        var X = (a * A[0] + b * B[0] + c * C[0]) / (a + b + c);
        var Y = (a * A[1] + b * B[1] + c * C[1]) / (a + b + c);
        return [X, Y];
    }
    return [];
}

iD.util.isPointInPolygon = function (point, polygon) {
    //console.log('point', point);
    //console.log('polygon',polygon);
    var pts = polygon.nodes; //获取多边形点

    //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
    //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
    //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

    var N = pts.length;
    var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    var intersectCount = 0; //cross points count of x
    var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
    //var precision = 1e-5; //浮点类型计算时候与0比较时候的容差
    var p1, p2; //neighbour bound vertices
    var p = point; //测试点

    p1 = pts[0]; //left vertex
    for (var i = 1; i <= N; ++i) { //check all rays
        if (p.loc[0] == p1.loc[0] && p.loc[1] == p1.loc[1]) {
            return boundOrVertex; //p is an vertex
        }

        p2 = pts[i % N]; //right vertex
        if (p.loc[1] < Math.min(p1.loc[1], p2.loc[1]) || p.loc[1] > Math.max(p1.loc[1], p2.loc[1])) { //ray is outside of our interests
            p1 = p2;
            continue; //next ray left point
        }

        if (p.loc[1] > Math.min(p1.loc[1], p2.loc[1]) && p.loc[1] < Math.max(p1.loc[1], p2.loc[1])) { //ray is crossing over by the algorithm (common part of)
            if (p.loc[0] <= Math.max(p1.loc[0], p2.loc[0])) { //x is before of ray
                if (p1.loc[1] == p2.loc[1] && p.loc[0] >= Math.min(p1.loc[0], p2.loc[0])) { //overlies on a horizontal ray
                    return boundOrVertex;
                }

                if (p1.loc[0] == p2.loc[0]) { //ray is vertical
                    if (p1.loc[0] == p.loc[0]) { //overlies on a vertical ray
                        return boundOrVertex;
                    } else { //before ray
                        ++intersectCount;
                    }
                } else { //cross point on the left side
                    var xinters = (p.loc[1] - p1.loc[1]) * (p2.loc[0] - p1.loc[0]) / (p2.loc[1] - p1.loc[1]) + p1.loc[0]; //cross point of lng
                    if (Math.abs(p.loc[0] - xinters) < precision) { //overlies on a ray
                        return boundOrVertex;
                    }

                    if (p.loc[0] < xinters) { //before ray
                        ++intersectCount;
                    }
                }
            }
        } else { //special case when ray is crossing through the vertex
            if (p.loc[1] == p2.loc[1] && p.loc[0] <= p2.loc[0]) { //p crossing over p2
                var p3 = pts[(i + 1) % N]; //next vertex
                if (p.loc[1] >= Math.min(p1.loc[1], p3.loc[1]) && p.loc[1] <= Math.max(p1.loc[1], p3.loc[1])) { //p.loc[1] lies between p1.loc[1] & p3.loc[1]
                    ++intersectCount;
                } else {
                    intersectCount += 2;
                }
            }
        }
        p1 = p2; //next ray left point
    }

    if (intersectCount % 2 == 0) { //偶数在多边形外
        return false;
    } else { //奇数在多边形内
        return true;
    }
}

iD.util.getDom = function (id) {
    return document.getElementById(id);
}


iD.util.transArray = function (object) {
    if (object && (typeof object === 'string')) {
        object = [object];
    }
    return object || [];
};

iD.util.angleTranslate = function (angle, delt) {
    var x = 0,
        y = 0;
    if (angle <= 0) angle = 360 + angle;
    var deltx = delt * Math.abs(Math.sin((Math.PI / 180) * angle)).toFixed(2),
        delty = delt * Math.abs(Math.cos((Math.PI / 180) * angle)).toFixed(2);

    if (angle < 90 && angle >= 0) {
        x = deltx;
        y = -delty;
    } else if (angle < 180 && angle >= 90) {
        x = deltx;
        y = delty;
    } else if (angle < 270 && angle >= 180) {
        x = -deltx;
        y = delty;
    } else if (angle <= 360 && angle >= 270) {
        x = -deltx;
        y = -delty;
    }
    return {
        'x': x,
        'y': y,
        'angle': angle
    }
}

//获取对象CSS值
iD.util.getStyleValue = function (obj, key) {
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

iD.util.getLocsCenter = function (locs) {
    var total_lng = 0,
        total_lat = 0,
        len = locs.length;
    for (var i in locs) {
        total_lng += locs[i][0];
        total_lat += locs[i][1];
    }
    return [total_lng / len, total_lat / len];
}

iD.util.getLocsLenCenter = function (locs, projection) {

    var pixels = [],
        len = locs.length;
    for (var i = 0; i < len; i++) {
        pixels.push(projection(locs[i]));
    }

    var total_dis1 = 0,
        distances = [];
    for (var j = 0; j < len - 1; j++) {
        var x1 = pixels[j][0],
            y1 = pixels[j][1],
            x2 = pixels[j + 1][0],
            y2 = pixels[j + 1][1];
        var dis = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        total_dis1 += dis;
        distances.push(dis);
    }

    var total_dis_avg = total_dis1 / 2;

    var total_dis2 = 0,
        n = 0;
    for (var k = 0; k < len - 1; k++) {
        total_dis2 += distances[k];
        if (total_dis2 >= total_dis_avg) {
            n = k + 1;
            break;
        }
    }

    var a = pixels[n],
        b = pixels[n - 1],
        delt = total_dis2 - total_dis_avg;
    var x_y = iD.util.getLenCenter(a, b, delt);
    var coords = projection.invert([x_y[0], x_y[1]]);

    return coords;
}

iD.util.getLenCenter = function (a, b, delt) {
    var pixel = [],
        angle = 0;
    if (b[0] !== a[0]) {
        angle = Math.atan(Math.abs((b[1] - a[1]) / (b[0] - a[0])));
        if (b[1] - a[1] > 0 && b[0] - a[0] > 0) {
            pixel.push(a[0] + delt * Math.cos(angle));
            pixel.push(a[1] + delt * Math.sin(angle));
        }
        if (b[1] - a[1] < 0 && b[0] - a[0] > 0) {
            pixel.push(a[0] + delt * Math.cos(angle));
            pixel.push(a[1] - delt * Math.sin(angle));
        }
        if (b[1] - a[1] < 0 && b[0] - a[0] < 0) {
            pixel.push(a[0] - delt * Math.cos(angle));
            pixel.push(a[1] - delt * Math.sin(angle));
        }
        if (b[1] - a[1] > 0 && b[0] - a[0] < 0) {
            pixel.push(a[0] - delt * Math.cos(angle));
            pixel.push(a[1] + delt * Math.sin(angle));
        }
    }
    if (b[1] === a[1]) {
        pixel.push(a[0] + (b[0] - a[0] > 0 ? 1 : -1) * delt);
        pixel.push(a[1]);
    }
    if (b[0] === a[0]) {
        pixel.push(a[0]);
        pixel.push(a[1] + (b[1] - a[1] > 0 ? 1 : -1) * delt);
    }
    return pixel;
}


iD.util.storeDottedLoc = function (entity, way, key, store, context, entities) {
    var wNodes = way.nodes,
        nlocs = [];
    if (entities) {
        for (var j in wNodes)
            for (var k in entities)
                if (wNodes[j] === entities[k].id) nlocs.push(entities[k].loc);
    } else {
        for (var j in wNodes) nlocs.push(context.graph().entity(wNodes[j]).loc);
    }
    var upright = iD.util.pt2LineDist(nlocs, entity.loc);
    store[key] = [upright.x, upright.y];
}

iD.util.cookie = {
    getItem: function (sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
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
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};
iD.util.path = function (locs, projection, polygon) {
    var round = iD.svg.Round().stream,
        clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
        project = projection.stream,
        path = d3.geo.path()
            .projection({
                stream: function (output) {
                    return polygon ? project(round(output)) : project(clip(round(output)));
                }
            }),
        json = {
            type: (polygon ? 'Polygon' : 'LineString'),
            coordinates: locs
        };

    if (locs && locs[0] && locs[0][0].loc) {
        json.coordinates = [];
        for (var k = 0; k < locs.length; k++) {
            var lcs = [];
            for (var n = 0; n < locs[k].length; n++) {
                lcs.push(locs[k][n].loc);
            }
            json.coordinates.push(lcs);
        }
    }
    return path(json);
}


//如果道路的所有结点都在可编辑范围之内，那么判断道路在可编辑区域，返回true
iD.util.wayInPlyGonx = function (datum, context) {

    //跨界属性，为1表示数据跨界
    // if (datum.tags.O_B_S == '1') {
    //     return false;
    // }

    if (!context.editArea()) {
        return true;
    }

    var nodes = datum.nodes; //, holes = iD.util.getCurrentTranHoles(context);
    var holes = context.editArea().coordinates || [];
    for (var j = 0; j < holes.length; j++) {
        var holes_nodes = [];
        for (var k = 0; k < holes[j].length; k++) {
            holes_nodes.push(holes[j][k]);
        }
        //var parentWays = context.graph().parentWays(datum);
        var flag = 0;
        for (var i = 0; i < nodes.length; i++) {
            var nid = nodes[i];
            var node = context.entity(nid).loc;
            if (iD.geo.pointInPolygon(node, holes_nodes)) {
                flag++;
            } else if ((datum.first() == nid || datum.last() == nid)
                && iD.util.locOnPolygon(node, holes_nodes)) {
                flag++;
            }
        }
        return flag == nodes.length;
    }


    return false;
    //iD.geo.pointInPolygon
}

// 车道线裁剪后，点压边界时，geo=>false，util.isPointInPolygon=true
// 线类型点压边界也认为在范围内；
iD.util.locOnPolygon = function (nodeLoc, holes_nodes) {
    var result = false;
    for (let i = 0; i < holes_nodes.length; i++) {
        if (result || !holes_nodes[i + 1]) {
            break;
        }
        result = iD.util.onLine([...holes_nodes[i], ...holes_nodes[i + 1]], nodeLoc);
    }
    return result;
}

//判断节点是否在可编辑区域内，如果在可编辑区域返回true
iD.util.nodeInPlyGonx = function (datum, context) {

    //跨界属性，为1表示数据跨界
    // if (datum.tags.O_B_S == '1') {
    //     return false;
    // }

    if (!context.editArea()) {
        return true;
    }
    var parentWays = context.graph().parentWays(datum);
    for (var i = 0; i < parentWays.length; i++) {
        if (iD.util.wayInPlyGonx(parentWays[i], context)) return true;
    }

    // var holes = iD.util.getCurrentTranHoles(context);
    var holes = context.editArea().coordinates || [];
    for (var j = 0; j < holes.length; j++) {
        var holes_nodes = [];
        for (var k = 0; k < holes[j].length; k++) {
            holes_nodes.push(holes[j][k]);
        }
        var node = datum.loc;
        if (iD.geo.pointInPolygon(node, holes_nodes)) {
            return true;
        } else if (iD.util.locOnPolygon(node, holes_nodes)) {
            return true;
        }
    }

    return false;
}


//判断节点是否在可编辑区域内，如果在可编辑区域返回true
iD.util.justNodeInPlyGonx = function (datum, context) {

    if (!datum) return false;
    //跨界属性，为1表示数据跨界
    // if (datum.tags.O_B_S == '1') {
    //     return false;
    // }

    if (!context.editArea()) {
        return false;
    }

    // var holes = iD.util.getCurrentTranHoles(context);
    var holes = context.editArea().coordinates || [];
    if (holes)
        for (var j = 0; j < holes.length; j++) {
            var holes_nodes = [];
            if (!holes[j].length) {
                return false;
            }
            for (var k = 0; k < holes[j].length; k++) {
                holes_nodes.push(holes[j][k]);
            }
            var node = datum.loc;
            if (iD.geo.pointInPolygon(node, holes_nodes)) {
                return true;
            };

        }

    return false;
}


iD.util.entityInPlyGon = function (datum, context) {
    if (datum instanceof iD.Node) {
        return iD.util.nodeInPlyGonx(datum, context);
    } else if (datum instanceof iD.Way) {
        return iD.util.wayInPlyGonx(context.entity(datum.id), context);
    }
}


//----------------------华丽的重构线----------------------

//判断点（只有经纬度坐标）是否在可编辑的区域内
iD.util.pointNotInPlyGonx = function (loc, context) {
    var flag = false;

    if (!context.editArea()) {
        return flag;
    }
    // var holes = iD.util.getCurrentTranHoles(context);
    var holes = context.editArea().coordinates || [];
    for (var j = 0; j < holes.length; j++) {
        var holes_nodes = [];
        for (var k = 0; k < holes[j].length; k++) {
            holes_nodes.push(holes[j][k]);
        }
        if (iD.geo.pointInPolygon(loc, holes_nodes)) {
            // flag = true;
            return false;
        };
    }
    return true;
}

//根据多边形返回bbox
/*
 @param plygon array 多边形数组 ["x y", " x y"]
 @return 返回计算后的bbox [log_max,lat_max,log_min,lat_min]
 */
iD.util.computeBbox = function (plygon) {
    var log_max = 0,
        log_min = 0,
        lat_max = 0,
        lat_min = 0;
    if (plygon.length > 0) {
        log_max = parseFloat(plygon[0].trim().split(" ")[0], 10);
        log_min = parseFloat(plygon[0].trim().split(" ")[0], 10);
        lat_max = parseFloat(plygon[0].trim().split(" ")[1], 10);
        lat_min = parseFloat(plygon[0].trim().split(" ")[1], 10);
    }
    _.forEach(plygon, function (loc, i) {
        var locArray = loc.trim().split(" ");
        var log = parseFloat(locArray[0], 10);
        var lat = parseFloat(locArray[1], 10);
        if (log > log_max) {
            log_max = log;
        }
        if (log < log_min) {
            log_min = log;
        }
        if (lat > lat_max) {
            lat_max = lat;
        }
        if (lat < lat_min) {
            lat_min = lat;
        }
    })

    return [log_min, lat_min, log_max, lat_max];

}


iD.util.SplitRoadRule = function (selectIDs, context, flag, originalEntity) {
    var constant = iD.data.DataType;
    if (flag == iD.walkRoadFlag.ROAD ||
        (flag == iD.walkRoadFlag.WALKROAD && (originalEntity.modelName == constant.WALKLINK)) ||
        ((selectIDs[0] != originalEntity.id) && (flag == iD.walkRoadFlag.WALKROAD) &&
            (originalEntity.modelName == constant.WALKENTER || originalEntity.modelName == constant.WALKLINK))) {
        return iD.actions.SplitRoad(selectIDs, context);
    } else {
        var action = function (graph) {
            return graph;
        }
        action.disabled = function () {
            return false;
        };
        return action;
    }
}

//根据经纬度坐标和范围（米）返回对应bbox
iD.util.getBounds = function (loc, radius) {
    // 西南角（左下角） ，东北角（右上角）
    var sw = this.getLngLatByOffsetMeter(loc, -radius, -radius);
    var ne = this.getLngLatByOffsetMeter(loc, radius, radius);
    return [sw, ne];
}

/**
 * 根据原始点经纬度坐标和偏移量计算新的经纬度坐标，单位米
 * @param {Array} loc
 * @param {Number} W :经度方向移动，向东为正
 * @param {Number} S :维度方向移动，向北为正
 */
iD.util.getLngLatByOffsetMeter = function (loc, W, S) {
    var aLng = 2 * Math.asin(Math.sin(W / (2 * 6378137.0)) / Math.cos(loc[1] * Math.PI / 180.0));
    var lng = loc[0] + aLng * 180 / Math.PI;
    var aLat = 2 * Math.asin(S / (2 * 6378137.0));
    var lat = loc[1] + aLat * 180 / Math.PI;
    return [lng, lat];
};

/**
 * 将object解析为字符串参数
 * @param {Object} param obj参数
 * @return 字符串URL参数
 */
iD.util.parseParam2String = function (param) {
    param = param || {};
    var result = [];
    for (var key in param) {
        (param[key] != null) && result.push(key + "=" + param[key]);
    }

    return result.join("&");
}

iD.util.urlParamSystemType = function () {
    return iD.url.getUrlParam("system_type");
}
iD.util.urlParamHistory = function () {
    return iD.url.getUrlParam("history") == "true";
}

/**
 * 设置全局系统判断参数，
 * config.js中会判断一次，
 * 登陆后也会判断一次
 */
iD.util.parse2SystypeParam = function () {
    var systype = iD.url.getUrlParam("system_type");

    // /kds-meta/meta/app/instance/current/EDIT 查询模型列表时的id
    // instanceId不需要赋值；
    // var instanceId = 1;
    var isInstance = false;
    var type = 1;
    if (systype) {
        type = systype;
    }

    if (systype == 1 || systype == 3 || systype == 4 || systype == 5 || systype == 6) {
        //		instanceId = 1;
        isInstance = false;
    } else if (systype == 2) {
        isInstance = true;
    }
    window._systemType = type;
    // window._instanceId = instanceId;
    window._isInstance = isInstance;

    if (window._systemType != null) {
        console.log("system_type参数 " + systype + " ：", ["", "母库", "融合", "识别", '标清', '质检', '图像标记', '核线标定', '核线标定-车高'][systype] || "未知参数");
    }
};

iD.util.getClickTimeout = function () {
    var clickTimeout = {
        _timeout: null,
        set: function (fn) {
            var that = this;
            that.clear();
            var args = Array.prototype.slice.call(arguments, 1);
            that._timeout = window.setTimeout(function () {
                fn.apply(window, args);
            }, 200);
        },
        clear: function () {
            var that = this;
            if (that._timeout) {
                window.clearTimeout(that._timeout);
            }
        }
    };

    return clickTimeout;
}


/**
 * 计算极线(核线)方程
 * Ax+By+C=0
 * 返回直线一般式的三个参数
 * 图像内绘制极线
 * 把像素点x=0,x=img.cols分别带入直线方程
 * P1:x=0,y=-C/B
 * P2:x=img.cols,y=-(C+A*img.cols)/B
 *
 * @param pt 第whichImage张图片的像素点坐标
 * @param whichImage 点在哪一张图片上，1=第一张，2=第二张
 * @param F 从第一张到第二张的F矩阵
 * @param line [out] 返回的直线方程参数(A,B,C)
 */
iD.util.computeEpilines = function (pt, whichImage, F) {
    let newF = F;
    if (whichImage == 2) {
        newF = matrix.transpose(F);
    }
    // let _temp = matrix.homogeneous(pt);
    let _pt = [[pt[0]], [pt[1]], [1]];
    let line = matrix.multiply(newF, _pt);
    return _.flatten(line);

    //
    let f = newF;
    let a = f[0][0] * pt[0] + f[1][0] * pt[1] + f[2][0];
    let b = f[0][1] * pt[0] + f[1][1] * pt[1] + f[2][1];
    let c = f[0][2] * pt[0] + f[1][2] * pt[1] + f[2][2];
    let nu = a * a + b * b;
    //
    nu = nu ? 1. / Math.sqrt(nu) : 1.;
    a *= nu;
    b *= nu;
    c *= nu;
    return [a, b, c];
}

/**
 * 由内外参数计算相机矩阵
 * @param K 相机内参矩阵
 * @param R 旋转矩阵
 * @param t 平移矩阵
 * @param P [out] 输出投影矩阵
 */

iD.util.KRt = function (k, r, t) {
    let rt = matrix.addCols(r, t);
    return matrix.multiply(k, rt);
}


/**
 * 从两张影像内外参数计算F矩阵
 *
 * @param K 相机内参矩阵
 * @param R1 旋转矩阵1
 * @param T1 平移矩阵1
 * @param R2 旋转矩阵2
 * @param T2 平移矩阵2
 * @param K2 相机内参矩阵
 * @param F [out] 输出F矩阵
 */
iD.util.F_From_KRT = function (k, r1, t1, r2, t2, k2) {
    let p1 = this.KRt(k, r1, t1);
    let p2;
    if (k2) p2 = this.KRt(k2, r2, t2);
    else p2 = this.KRt(k, r2, t2);
    //
    return this.F_from_P(p1, p2);
}

// /
//  * 从两张影像的相机矩阵投影矩阵计算F矩阵
//  * @param P1 图像1投影矩阵
//  * @param P2 图像2投影矩阵
//  * @param F [out] 输出F矩阵
//  */
iD.util.F_from_P = function (p1, p2) {
    var x1 = matrix.block(p1, 2, 1, 2, 4);
    var x2;
    x2 = [matrix.getRow(p1, 2), matrix.getRow(p1, 0)];
    var x3 = matrix.block(p1, 1, 1, 2, 4);
    var y1 = matrix.block(p2, 2, 1, 2, 4);
    var y2;
    y2 = [matrix.getRow(p2, 2), matrix.getRow(p2, 0)];
    var y3 = matrix.block(p2, 1, 1, 2, 4);

    var x1y1, x2y1, x3y1, x1y2, x2y2, x3y2, X1Y3, x2y3, x3y3;
    x1y1 = [...x1, ...y1];
    x2y1 = [...x2, ...y1];
    x3y1 = [...x3, ...y1];
    x1y2 = [...x1, ...y2];
    x2y2 = [...x2, ...y2];
    x3y2 = [...x3, ...y2];
    X1Y3 = [...x1, ...y3];
    x2y3 = [...x2, ...y3];
    x3y3 = [...x3, ...y3];


    let res3 = [
        [this.determinant(x1y1), this.determinant(x2y1), this.determinant(x3y1)],
        [this.determinant(x1y2), this.determinant(x2y2), this.determinant(x3y2)],
        [this.determinant(X1Y3), this.determinant(x2y3), this.determinant(x3y3)]
    ]
    return res3;

}

iD.util.determinant = function (t2) {
    var a = _.flatten(t2);
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

iD.util.pointToPicpixe = function (k, point, xyz) {
    //相机外参
    let r = point.tags.R;
    let t = point.tags.T;
    let temp = [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, -1]
    ];
    let r1 = matrix.multiply(r, temp);
    let rt = matrix.addCols(r1, t);
    let p = matrix.multiply(k, rt);

    let lon = xyz[0],
        lat = xyz[1],
        z = xyz[2];

    let utm = iD.util.LLtoUTM_(lon, lat);
    let x = [
        [utm.x],
        [utm.y],
        [z]
    ];
    x.push([1]);
    var x1 = matrix.multiply(p, x);

    return [x1[0] / x1[2], x1[1] / x1[2], z, x1[2][0]];
}

iD.util.picPixelToLonLat = function (k, picPoint, UTMZone, designator, xy, h) {
    let r = picPoint.tags.R;
    let c = picPoint.tags.C;
    // let h = C[2][0]+height;

    let m = [
        [xy[0]],
        [xy[1]],
        [1]
    ];

    let inversK = matrix.inverse(k);
    let transposeR = matrix.transpose(r);
    let kr = matrix.multiply(transposeR, inversK);
    let tmp = matrix.multiply(kr, m);
    let lambda = (h - c[2][0]) / tmp[2][0];
    let cod = matrix.scalar(tmp, lambda);
    cod = matrix.addition(cod, c);

    return iD.util.UTMtoLL_(cod[0][0], cod[1][0], UTMZone, designator);
}
/*
* 当usepos为true时，使用usepos值
*         为false时，使用currentActivity作为判断条件为"LinearFusion"，"edgeFusion"，"PointFusion"时
* */
iD.util.getOffsetCalStatus = function () {
    var status;
    if (iD.Task.d.tags.usePos == "true") { //使用usePos
        status = true;
    } else if (this.urlParamHistory() && iD.Task.d.tags.type == 'full_fusion') {
        status = true;
    } else { //使用currentActivity
        var currentActivity = iD.Task.d.protoData.taskDefinitionKey;
        status = false;
        if (currentActivity == "LinearFusion" || currentActivity == "edgeFusion" || currentActivity == "PointFusion" || currentActivity == "diseaseWork") {
            status = true;
        }
    }
    return status;
}


iD.util.calPTOrentationOfLine = function(x0, y0, x1, y1, ptx, pty) {
    let tempValue =(y0 - y1)*ptx + (x1 - x0)* pty +( x0 * y1) - (x1 * y0);
    //tempValue>0，说明点在线的左边，小于在右边，等于则在线上
    if (tempValue > 0){
        return 1;
    } else if(tempValue == 0){
        return 0;
    } else{
        return -1;
    }
}

/**
 * 获取tags，根据entity或DataType
 * @param {Object|String} entity
 * @param {Object} lay
 */
iD.util.getDefauteTags = function (entity, lay) {
    var defaultTags = {};
    var modelEntity;
    if (typeof entity === "string") {
        modelEntity = iD.ModelEntitys[entity];
    } else {
        modelEntity = iD.ModelEntitys[entity.modelName];
    }
    if (!modelEntity) {
        return defaultTags;
    }
    var username = iD.User.getInfo().username;
    var gtype = modelEntity.getGeoType();
    modelEntity.getFields(gtype).forEach(function (d) {
        defaultTags[d.fieldName] = d.defaultValue;
    });
    if (iD.Task.d) {
        if (modelEntity.modelName() == iD.data.DataType.QUALITY_TAG) {
            defaultTags.TASK_ID = iD.Task.d.task_id;
        } else {
            defaultTags.TASKID = iD.Task.d.task_id;
        }
        defaultTags.FLAG = '2';
        if (modelEntity.modelName() == iD.data.DataType.AUTO_CHECKWORK_TAG) {
            defaultTags.TAGTYPE = '2';
        }
        if (lay && lay.batch) {
            defaultTags.BATCH = lay.batch;
        }
        var isWorker = iD.User.isWorkRole();
        var isChecker = iD.User.isCheckRole();
        if (defaultTags.hasOwnProperty('OPERATOR') && isWorker) {
            defaultTags.OPERATOR = username;
        }
        // if (defaultTags.hasOwnProperty('SDATE')) {
        //     defaultTags.SDATE = (new Date()).getTime();
        // }
        if (defaultTags.hasOwnProperty('UDATE')) {
            defaultTags.UDATE = (new Date()).getTime();
            // if (defaultTags.hasOwnProperty('SDATE')) {
            //     defaultTags.SDATE = iD.Task.d.tags._trackTime;
            // }
        }
        if (defaultTags.hasOwnProperty('SDATE')) {
            defaultTags.SDATE = iD.Task.d.tags._trackTime;
        }


        // CHECK_TAG
        if (modelEntity.modelName() == iD.data.DataType.QUALITY_TAG) {
            if (defaultTags.hasOwnProperty('EDIT_BY') && isWorker) {
                defaultTags.EDIT_BY = username;
            }
            if (defaultTags.hasOwnProperty('CHECK_BY') && isChecker) {
                defaultTags.CHECK_BY = username;
            }
        }
    }
    return defaultTags;
}

iD.util.colorRGBA = function (r, g, b, alpha = 1) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

/**
 * 按照DIVIDER中tags的DIRECTION，3为逆向，除了逆向时需要用最后一个relation外，其他都用第一个relation
 * @param {Object} graph graph
 * @param {Object} way wayEntity
 * @param {String} modelName iD.data.DataType
 * 
 * @return relation关系
 */
iD.util.getDividerParentRelation = function (graph, way, modelName) {
    var rels = graph.parentRelations(way, modelName) || [];
    var relation;
    if (_.include([
        iD.data.DataType.DIVIDER_ATTRIBUTE,
        iD.data.DataType.LANE_ATTRIBUTE
    ], modelName)) {
        var direction = way.tags.DIRECTION || "0";
        var relNode;
        if (direction == "3") {
            relNode = _.last(way.nodes);
            //relation = _.last(rels);
        } else {
            relNode = way.nodes[0];
            //relation = rels[0];
        }
        for (let i in rels) {
            let rel = rels[i];
            for (let j in rel.members) {
                let member = rel.members[j];
                if (member.id == relNode) {
                    relation = rel;
                    break;
                }
            }
            if (relation) {
                break;
            }
        }

    } else {
        relation = rels[0];
    }

    return relation;
}
/**
 * 矩形包含判断
 */
iD.util.isInsideRect = function (rect, xy) {
    let x1 = rect[0][0],
        y1 = rect[0][1];
    let x2 = rect[1][0],
        y2 = rect[1][1];
    return xy[0] >= x1 && xy[0] <= x2 && xy[1] <= y2 && xy[1] >= y1;
}
/**
 * 获取三级联动selects用的数据列表
 * @param {Array} dataList [{name: '名分类称', value: '010000'}]
 */
iD.util.getTagMulDatas_POI_TYPE = function (dataList) {
    //var dataList = MUL_POITYPE_LIST;
    var result = {};

    var reg = /\B(?=(?:\d{2})+\b)/g;
    var _keys = _.keys(dataList);
    for (let i in dataList) {
        let item = dataList[i];
        if (!item.value) {
            continue;
        }
        let kname = item.value;
        let valueName = item.name;
        let keyNames = kname.split(reg);
        //		let first = keyNames[0], 
        //		second = keyNames[1], 
        //		third = keyNames[2];

        let tempObj = result,
            _count = 0;
        for (let idx in keyNames) {
            let key = keyNames[idx];
            _count++;
            if (!tempObj[key]) {
                tempObj[key] = {
                    name: valueName,
                    value: key,
                    children: {}
                };
            }
            if (_count == keyNames.length) {
                delete tempObj[key].children;
            }
            tempObj = tempObj[key].children;
        }
    }

    // console.log('iD.util.getTagMulDatas_POI_TYPE ... ', result);
    return result;
}

/**
 * 获取两个线段相交的所有点
 * 来自lineCalCulate.getIntersectLoc
 * @param {Array} nodes1  location [[x, y], [x, y], ...]
 * @param {Array} nodes2  nodeids way.nodes
 * @param {Object} graph
 */
iD.util.getIntersectLoc = function (nodes1, nodes2, graph) {
    var locs = [];
    var lineCal = iD.util.LineCalCulate();
    var interPoint = [0, 0];
    for (var j = 0; j < nodes1.length; j++) {
        if ((j + 1) > (nodes1.length - 1)) break;
        var nodes1_pre = nodes1[j],
            nodes1_next = nodes1[j + 1],
            pre_arr1 = [nodes1_pre[0], nodes1_pre[1], nodes1_next[0], nodes1_next[1]];
        for (var k = 0; k < nodes2.length; k++) {
            if ((k + 1) > (nodes2.length - 1)) break;
            var nodes2_pre = graph.entity(nodes2[k]),
                nodes2_next = graph.entity(nodes2[k + 1]),
                pre_arr2 = [nodes2_pre.loc[0], nodes2_pre.loc[1], nodes2_next.loc[0], nodes2_next.loc[1]];
            // 正常相交
            // var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
            // 射线交点，并且该点与在该路段上
            var loc = iD.util.extendIntersection(pre_arr1, pre_arr2);
            if (loc && iD.util.onLine(pre_arr2, loc)) {
                //              loc.push((nodes2_pre.loc[2]+nodes2_next.loc[2])/2);
                loc = iD.util.getBetweenPointLoc(nodes2_pre.loc, nodes2_next.loc, loc);
                locs.push(loc);
            }
        }
    }
    return locs;
}

/**
 * 获取两个线段相交的所有点(非射线方式求交点）
 * 来自lineCalCulate.getIntersectLoc
 * @param {Array} nodes1  location [[x, y], [x, y], ...]
 * @param {Array} nodes2  nodeids way.nodes
 * @param {Object} graph
 */
iD.util.getSegmentIntersectLoc = function (nodes1, nodes2) {
    var locs = [];
    var lineCal = iD.util.LineCalCulate();
    var interPoint = [0, 0];
    for (var j = 0; j < nodes1.length; j++) {
        if ((j + 1) > (nodes1.length - 1)) break;
        var nodes1_pre = nodes1[j],
            nodes1_next = nodes1[j + 1],
            pre_arr1 = [nodes1_pre[0], nodes1_pre[1], nodes1_next[0], nodes1_next[1]];
        for (var k = 0; k < nodes2.length; k++) {
            if ((k + 1) > (nodes2.length - 1)) break;
            var nodes2_pre = nodes2[k],
                nodes2_next = nodes2[k + 1],
                pre_arr2 = [nodes2_pre[0], nodes2_pre[1], nodes2_next[0], nodes2_next[1]];
            // 正常相交
            var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
            // 射线交点，并且该点与在该路段上
            // var loc = iD.util.extendIntersection(pre_arr1, pre_arr2);
            if (loc && iD.util.onLine(pre_arr2, loc)) {
                loc = iD.util.getBetweenPointLoc(nodes2_pre, nodes2_next, loc);
                locs.push(loc);
            }
        }
    }
    return locs;
}
/**
 * 获取两个线段相交的所有点(非射线方式求交点）
 * 来自lineCalCulate.getIntersectLoc
 * @param {Array} nodes1  location [[x, y], [x, y], ...]
 * @param {Array} nodes2  nodeids way.nodes
 * @param {Boolean} isRay 是否为射线相交，默认false
 * @param {Object} graph
 */
iD.util.getSegmentIntersectLoc2 = function (nodes1, nodes2, isRay = false) {
    var locs = [];
    // 是 L1，L2
    function lineintersect(l1, l2, p) {
        var d = l1.a * l2.b - l2.a * l1.b;
        var EP = 1E-10;
        if (Math.abs(d) < EP) {
            console.log(l1, l2)
            return false;
        } // 不相交

        p.x = (l2.c * l1.b - l1.c * l2.b) / d;
        p.y = (l2.a * l1.c - l1.a * l2.c) / d;
        return true;
    }
    // 如果线段l1和l2相交，返回true且交点由(inter)返回，否则返回false
    function intersection(l1, l2) {
        var ll1, ll2;
        var inter = {};
        ll1 = makeline(l1[0], l1[1]);
        ll2 = makeline(l2[0], l2[1]);
        if (lineintersect(ll1, ll2, inter))
            return [inter.x, inter.y];
        return false;
    }

    function makeline(p1, p2) {
        var tl = {};
        var sign = 1;
        tl.a = p2[1] - p1[1];
        if (tl.a < 0) {
            sign = -1;
            tl.a = sign * tl.a;
        }
        tl.b = sign * (p1[0] - p2[0]);
        tl.c = sign * (p1[1] * p2[0] - p1[0] * p2[1]);
        return tl;
    }

    for (var j = 0; j < nodes1.length; j++) {
        if ((j + 1) > (nodes1.length - 1)) break;
        var nodes1_pre = nodes1[j],
            nodes1_next = nodes1[j + 1],
            // pre_arr1 = [nodes1_pre[0], nodes1_pre[1], nodes1_next[0], nodes1_next[1]];
            pre_arr1 = [nodes1_pre, nodes1_next];
        for (var k = 0; k < nodes2.length; k++) {
            if ((k + 1) > (nodes2.length - 1)) break;
            var nodes2_pre = nodes2[k],
                nodes2_next = nodes2[k + 1],
                // pre_arr2 = [nodes2_pre[0], nodes2_pre[1], nodes2_next[0], nodes2_next[1]];
                pre_line_arr2 = [nodes2_pre[0], nodes2_pre[1], nodes2_next[0], nodes2_next[1]],
                pre_arr2 = [nodes2_pre, nodes2_next];
            // 射线相交
            var loc = intersection(pre_arr1, pre_arr2);

            if (loc && (isRay || iD.util.onLine(pre_line_arr2, loc))) {
                loc = iD.util.getBetweenPointLoc(nodes2_pre, nodes2_next, loc);
                locs.push(loc);
            }
        }
    }
    return locs;
}


iD.util.getIntersectLocByNodes = function (nodes1, nodes2, graph) {
    var locs = [];
    var lineCal = iD.util.LineCalCulate();
    var interPoint = [0, 0];
    for (var j = 0; j < nodes1.length; j++) {
        if ((j + 1) > (nodes1.length - 1)) break;
        var nodes1_pre = graph.entity(nodes1[j]),
            nodes1_next = graph.entity(nodes1[j + 1]),
            pre_arr1 = [nodes1_pre.loc[0], nodes1_pre.loc[1], nodes1_next.loc[0], nodes1_next.loc[1]];
        for (var k = 0; k < nodes2.length; k++) {
            if ((k + 1) > (nodes2.length - 1)) break;
            var nodes2_pre = graph.entity(nodes2[k]),
                nodes2_next = graph.entity(nodes2[k + 1]),
                pre_arr2 = [nodes2_pre.loc[0], nodes2_pre.loc[1], nodes2_next.loc[0], nodes2_next.loc[1]];
            // 正常相交
            var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
            // 射线交点，并且该点与在该路段上
            // var loc = iD.util.extendIntersection(pre_arr1, pre_arr2);
            if (loc && iD.util.onLine(pre_arr2, loc)) {
                //              loc.push((nodes2_pre.loc[2]+nodes2_next.loc[2])/2);
                loc = iD.util.getBetweenPointLoc(nodes2_pre.loc, nodes2_next.loc, loc);
                locs.push(loc);
            }
        }
    }
    return locs;
}

/**
 * 不使用graph，传节点，不是节点ID
 * 获取两个线段相交的所有点(非射线方式求交点）
 * 来自lineCalCulate.getIntersectLoc
 * @param {Array} nodes1  node entitys
 * @param {Array} nodes2  node entitys
 */
iD.util.getSegmentIntersectNodesLoc = function (nodes1, nodes2) {
    var locs = [];
    var lineCal = iD.util.LineCalCulate();
    var interPoint = [0, 0];
    for (var j = 0; j < nodes1.length; j++) {
        if ((j + 1) > (nodes1.length - 1)) break;
        var nodes1_pre = nodes1[j],
            nodes1_next = nodes1[j + 1],
            pre_arr1 = [nodes1_pre.loc[0], nodes1_pre.loc[1], nodes1_next.loc[0], nodes1_next.loc[1]];
        for (var k = 0; k < nodes2.length; k++) {
            if ((k + 1) > (nodes2.length - 1)) break;
            var nodes2_pre = nodes2[k],
                nodes2_next = nodes2[k + 1],
                pre_arr2 = [nodes2_pre.loc[0], nodes2_pre.loc[1], nodes2_next.loc[0], nodes2_next.loc[1]];
            // 正常相交
            var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
            // 射线交点，并且该点与在该路段上
            // var loc = iD.util.extendIntersection(pre_arr1, pre_arr2);
            if (loc && iD.util.onLine(pre_arr2, loc)) {
                //              loc.push((nodes2_pre.loc[2]+nodes2_next.loc[2])/2);
                loc = iD.util.getBetweenPointLoc(nodes2_pre.loc, nodes2_next.loc, loc);
                locs.push(loc);
            }
        }
    }
    return locs;
}

/**
 * 采用射线与普通平面相交来求交点坐标
 * @param K 相机内参
 * @param R 旋转矩阵
 * @param C 相机中心
 * @param pixel 像素点坐标
 * @param plane_p 平面上一点 路牌测量服务中返回的plane字段中的[centlon, centlat, centheight]
 * @param plane_n 平面的法向量 [p1, p2, p3]
 *
 * @param xyz [out] 测量结果
 */

iD.util.linePlaneCross = function (K, R, C, T, pixel, plane_p, plane_n) {
    /*T = [[3816129.35315], [114040.037257], [-2278513.30877]];*/
    let vw = iD.util.getPixelDirectionVector(K, R, C, T, pixel);
    /*let vw = [[454817.738617], [4422660.36801], [29.598609059]];*/

    //射线的方向向量
    //m,n,p
    let n1 = matrix.subtraction(vw, C);
    //地平面的平面方程
    let utmLonlat = iD.util.LLtoUTM_(plane_p[0], plane_p[1]);
    let X1 = [utmLonlat.x, utmLonlat.y, plane_p[2]];
    let n2 = plane_n;
    //求线面交点
    let t = (n2[0] * (X1[0] - C[0][0]) + n2[1] * (X1[1] - C[1][0]) + n2[2] * (X1[2] - C[2][0])) /
        (n2[0] * n1[0][0] + n2[1] * n1[1][0] + n2[2] * n1[2][0]);
    //
    let x = C[0][0] + n1[0][0] * t;
    let y = C[1][0] + n1[1][0] * t;
    let z = C[2][0] + n1[2][0] * t;

    /*x:454842.040032
    y:4422664.11547
    z:35.5950461032*/

    let lonlats = iD.util.UTMtoLL_(x, y, utmLonlat.zoneNumber, utmLonlat.designator);
    x = lonlats[0];
    y = lonlats[1];

    return [x, y, z];
}

/**
 * 获得相机中心与像素点射线方向向量在世界坐标中的点坐标
 *
 */
iD.util.getPixelDirectionVector = function (K, R, C, T, pixel) {
    let u0 = K[0][2];
    let v0 = K[1][2];
    let fx = K[0][0];
    let fy = K[1][1];
    //
    let du = pixel[0] - u0;
    let dv = pixel[1] - v0;
    //
    let r = Math.sqrt((du * du) / (fx * fx) + (dv * dv) / (fy * fy) + 1);
    let v1 = du / fx / r;
    let v2 = dv / fy / r;
    let v3 = 1 / r;

    let vc = [
        [v1],
        [v2],
        [v3],
        [1]
    ];

    var rt = matrix.addCols(R, T);
    rt[3] = [];
    rt[3].push(0);
    rt[3].push(0);
    rt[3].push(0);
    rt[3].push(1);

    let vw = matrix.multiply(matrix.inverse(rt), vc);
    vw.pop();

    return vw;
}

iD.util.currentTrackPointDis = [];
/*
 * 获取当前帧下指定距离的路径点坐标集合
 * @param 路径坐标点对象集合
 * @param 距离值
 * @return 符合距离范围内的所有路径坐标点对象集合
 */
iD.util.getTrackPointsByDis = function (currentTrackPoint, trackPoints, dis) {
    let arr = [];
    let track_point_nums = trackPoints.length;
    if (!currentTrackPoint.tags) {
        return;
    }
    let CC = currentTrackPoint.tags.C;
    let t_index = 0,
        index = -1;
    trackPoints.filter(function (t) {
        if (t.id == currentTrackPoint.id) {
            index = t_index;
        }
        t_index++;
    })
    for (var i = index; i < track_point_nums; i++) {
        let frame_index = i + 1;

        if (frame_index < 1 || frame_index > track_point_nums - 1) {
            let track_point = trackPoints[frame_index - 1];
            arr.push(track_point.loc);
            iD.util.currentTrackPointDis = arr;
            return;
        }

        let track_point = trackPoints[frame_index];
        let xyz = track_point.tags.C;

        let X = [
            [xyz[0][0]],
            [xyz[1][0]],
            [xyz[2][0]],
            [1]
        ]

        //同时考虑distance,u,v,w三个值情况
        let distance = this.norm(X, CC);
        // let distance=Math.sqrt(Math.pow(X[0]-CC[0],2)+Math.pow(X[1]-CC[1],2));
        if (distance > dis) {
            break;
        }
        //      arr.push({
        //      	point: track_point,
        //      	index: frame_index
        //      });
        arr.push(track_point.loc);
        // 		arr.push(track_point.loc.concat([track_point.tags.trackPointId,track_point.id]));
    }
    arr.unshift(currentTrackPoint.loc)
    iD.util.currentTrackPointDis = arr;
};

/**
 * 求两个经纬度之间的实地距离
 * 
 * @param lnglat1 {LngLat} 开始点
 * @param lnglat2 {LngLat} 结束点
 * @return {Number} 以米做单位的距离
 */
iD.util.distanceByLngLat = function (lnglat1, lnglat2) {
    var c = lnglat1[1] * Math.PI / 180.0;
    var d = lnglat2[1] * Math.PI / 180.0;
    var a = c - d;
    var b = (lnglat1[0] - lnglat2[0]) * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(c) * Math.cos(d) * Math.pow(Math.sin(b / 2), 2))) * 6378137.0;
    return parseFloat(s.toFixed(2));
}

/**
 * 计算两像素坐标点之间的距离
 * @param fromPixel {Pixel} 开始点
 * @param toPixel {Pixel} 结束点
 * @return {Number} 像素值
 */
iD.util.distanceByPixel = function (fromPixel, toPixel) {
    var x = Math.pow(toPixel[0] - fromPixel[0], 2);
    var y = Math.pow(toPixel[1] - fromPixel[1], 2);
    return Math.sqrt(x + y);
}


/**
 * 求一个点与一组点经纬度之间的实地距离
 *
 * @param lnglat1 {LngLat} 开始点
 * @param lnglat2 {LngLat} 结束点
 * @return {Number} 以米做单位的距离
 */
iD.util.distanceByLngLats = function (lnglat, lnglats) {
    var disArr = [];
    let lnglat1 = lnglat;
    for (let i = 0; i < lnglats.length; i++) {
        var lnglat2 = lnglats[i];
        var c = lnglat1[1] * Math.PI / 180.0;
        var d = lnglat2[1] * Math.PI / 180.0;
        var a = c - d;
        var b = (lnglat1[0] - lnglat2[0]) * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(c) * Math.cos(d) * Math.pow(Math.sin(b / 2), 2))) * 6378137.0;
        disArr.push({
            dis: parseFloat(s.toFixed(2)),
            index: i
        });
    }
    disArr = _.sortBy(disArr, 'dis');
    // disArr.sort(function(a, b){return (a > b) ? 1 : -1}); //从小到大排序
    return disArr[0];
}
/**
 * 获取距离当前点最近的节点
 * @param loc 当前点，经纬度
 * @param nodes 节点数组
 * @return node 最近节点
 * */
iD.util.getNearestNode = function (loc, nodes) {
    var dis = 0
    entityNode = null;
    for (let i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        let localDis = iD.util.distanceByLngLat(loc, node.loc);
        if (dis > localDis || dis == 0) {
            dis = localDis;
            entityNode = node;
        }
    }
    return entityNode;
}

/**
 * 获取距离当前点最近的轨迹点（参数内含车高）
 * @param loc 当前点，经纬度
 * @tracks 轨迹数组
 * */
iD.util.getNearestTracks = function (loc, tracks) {
    var dis = 0
    _track = null;
    for (let i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        let localDis = iD.util.distanceByLngLat(loc, track.node.loc);
        if (dis > localDis || dis == 0) {
            dis = localDis;
            _track = track;
        }
    }
    return _track;
}

iD.util.getBoundsTracks = function (loc, tracks, rang) {
    let result = [];
    for (let i = 0; i < tracks.length; i++) {
        var way = tracks[i];
        let nodes = _.pluck(way.nodes, 'loc');
        let dist = iD.util.pt2LineDist2(nodes, loc);
        // let localDis = iD.util.distanceByLngLat(loc, track.node.loc);
        if (dist.dis <= rang) {
            result.push(way.nodes[dist.i]);
        }
    }
    return result
}

//获取指定点对应当前视频的车高
iD.util.getHeight = function (loc) {
    let cRangeNodes = iD.util.selectNode_Z(loc, 40);
    let tracks = [];
    for (let i = 0; i < cRangeNodes.length; i++) {
        var rangeNodes = cRangeNodes[i];
        var node = iD.util.getNearestNode(loc, rangeNodes.nodes);
        tracks.push({
            node: node,
            cameraHeight: rangeNodes.cameraHeight,
            trackId: rangeNodes.trackId
        });
    }
    // // console.log(disArr)
    if (tracks.length == 0) {
        return 0;
    }
    var nearrestTrack = iD.util.getNearestTracks(loc, tracks);
    return nearrestTrack.node.loc[2] - nearrestTrack.cameraHeight;
}

/**
 * 查找当前坐标点固定距离所有轨迹点集合
 * @param loc 当前坐标点
 * @param range 距离范围（米）
 * */
iD.util.selectNode_Z = function (loc, range) {
    var player = iD.picUtil.player;
    if (!player) return [];
    var tracks = player.dataMgr.tracks,
        resNodes = [];
    //按范围选取轨迹
    function intersects(extent, nodes) {
        let restArr = [];
        for (let i = 0, len = nodes.length; i < len; i++) {
            let node = nodes[i]
            if (iD.util.isInsideRect(extent, node.loc)) {
                restArr.push(node);
            }
        }
        return restArr;
    }

    for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i],
            bounds = iD.util.getBounds(loc, range),
            allNodes = intersects(bounds, track.nodes).filter(function (entity) {
                return entity && entity.loc;
            });

        if (allNodes.length) {
            var obj = {
                nodes: []
            }
            obj.nodes = allNodes;
            obj.cameraHeight = track.cameraHeight;
            obj.trackId = track.trackId;
            resNodes.push(obj);
        }
    }
    return resNodes;
}

/**
 * 计算多边形顺时针还是逆时针
 * @param points：所有点
 * @param isYAxixToDown：true:Y轴向下为正(屏幕坐标系),false:Y轴向上为正(一般的坐标系)
 * */
iD.util.calculateClockDirection = function (points, isYAxixToDown) {
    let i, j, k;
    let count = 0;
    let z;
    let yTrans = isYAxixToDown ? (-1) : (1);
    if (points == null || points.length < 3) {
        return null;
    }
    let n = points.length;
    for (i = 0; i < n; i++) {
        j = (i + 1) % n;
        k = (i + 2) % n;
        z = (points[j][0] - points[i][0]) * (points[k][1] * yTrans - points[j][1] * yTrans);
        z -= (points[j][1] * yTrans - points[i][1] * yTrans) * (points[k][0] - points[j][0]);
        if (z < 0) {
            count--;
        } else if (z > 0) {
            count++;
        }
    }
    if (count > 0) {
        return true; //顺时针
    } else if (count < 0) {
        return false; //逆时针
    } else {
        return null; //无.可能是不可计算的图形，比如多点共线
    }
}

/*
 * 视频点击位置，获取最近的路径坐标点
 * @param 当前点击位置坐标(视频位置)
 * @return 最近的路径坐标点
 */
iD.util.clickPosForTrackPoint = function (pos) {
    let len = iD.util.currentTrackPointDis.length;
    let dis = -1;
    let trackPoint = null;
    let index = 0;
    for (let i = 0; i < len; i++) {
        let d = iD.util.distanceByLngLat(iD.util.currentTrackPointDis[i], pos);
        if (dis == -1 || dis > d) {
            dis = d;
            index = i;
            trackPoint = iD.util.currentTrackPointDis[i];
        }
    }
    // console.log('clickPosForTrackPoint',trackPoint,index);
    return trackPoint;
}
iD.util.clickPosForTrackPoint2 = function (point, pos, height, K) {
    // let device = iD.svg.Pic.dataMgr.cameraParams[0][0];
    // let K = [[device.focus,0,device.principlePoint.x],
    //     [0,device.focus,device.principlePoint.y],
    //     [0,0,1]];
    let len = iD.util.currentTrackPointDis.length;
    let dis = -1;
    let trackPoint = null;
    let index = 0;
    for (let i = 0; i < len; i++) {
        let loc = iD.util.currentTrackPointDis[i].concat([]);
        loc[2] = loc[2] - height;
        let xy = this.trackPointToPicPixe(K, point, loc);
        let d = Math.abs(xy[1] - pos[1]);
        if (dis == -1 || dis > d) {
            dis = d;
            index = i;
            trackPoint = iD.util.currentTrackPointDis[i];
        } else {
            break;
        }
    }
    return trackPoint;
}

/**
 * 判断节点是否是首位节点
 * @param {iD.Node} node
 */
iD.util.nodeIsBreakPoint = function (node, graph) {
    var breakPoint = true;
    var parentWays = graph.parentWays(node);
    if (!parentWays.length) {
        return false;
    }
    parentWays.forEach(function (way) {
        if (way.first() != node.id && way.last() != node.id) {
            breakPoint = false;
        }
    });
    return breakPoint;
}


/**
 * 计算通过一个已知点，垂直于轨迹的平面的法向量，构成点法式以便后期计算投影点
 * @param track_points 轨迹对象，包含所有的轨迹点信息
 * @param orglng 已知点的经度
 * @param orglat 已知点的纬度
 * @param beginIndex 垂足点判断开始的索引，下标以0开始
 * @param useUtm 是否使用utm投影坐标计算
 * @return plane 返回的法向量
 */
iD.util.calculatePlane = function (track_points, orglng, orglat, beginIndex, useUtm = false) {
    //计算出轨迹上距离(lng,lat)最近的点的索引
    let minLength = Infinity; //最小距离
    let minLenIndex = 0; //最小距离时所对应的轨迹点索引
    let orgutmx, orgutmy;
    var plane;
    // let zoneo[4] = {0};
    let utm = iD.util.LLtoUTM_(orglng, orglat);
    orgutmx = utm.x;
    orgutmy = utm.y;
    zoneo = utm.zoneNumber;
    // Coordinates::ll2utm(orglat,orglng, orgutmx, orgutmy, zoneo);

    for (let i = beginIndex, len = track_points.length; i < len - 1; i++) {
        let start = track_points[i];
        let end = track_points[i + 1];

        // let startutmx, startutmy, endutmx, endutmy;
        let startUtm = iD.util.LLtoUTM_(start.loc[0], start.loc[1]);
        let endUtm = iD.util.LLtoUTM_(end.loc[0], end.loc[1]);

        let Line = [
            [startUtm.x, startUtm.y],
            [endUtm.x, endUtm.y]
        ],
            PtA = [orgutmx, orgutmy];

        //计算最近的点
        let length = this.pt2LineSegmentDist(Line, PtA);
        if (length.dis < minLength) {
            minLength = length.dis;
            minLenIndex = i;
        }
    }

    //前后各找三帧作为起点和终点的索引
    let startIndex = minLenIndex - 3;
    let endIndex = minLenIndex + 3;
    if (startIndex < 0)
        startIndex = 0;
    if (endIndex >= track_points.length)
        endIndex = track_points.length - 1;


    if (useUtm) {
        let start = track_points[startIndex];
        let end = track_points[endIndex];
        // let startutmx, startutmy, endutmx, endutmy;
        let startUtm = iD.util.LLtoUTM_(start.loc[0], start.loc[1]);
        let endUtm = iD.util.LLtoUTM_(end.loc[0], end.loc[1]);

        let PtB = new Array(2);
        let Line = [startUtm.x, startUtm.y, endUtm.x, endUtm.y],
            PtA = [orgutmx, orgutmy];

        //计算垂足
        this.pedal(Line, PtA, PtB);
        let drooputmx, drooputmy;
        drooputmx = PtB[0];
        drooputmy = PtB[1];

        // let ptUtm = iD.util.LLtoUTM_(drooputmy, drooputmx);

        //计算法向量
        let v1 = [
            [orgutmx - drooputmx],
            [orgutmy - drooputmy],
            [0.0]
        ];
        let v2 = [
            [drooputmx],
            [drooputmy],
            [10.0]
        ];

        let corsscheck = matrix.cross(v2, v1);
        plane = this.normalizedSqrt(corsscheck);
    } else {

        let drooplng, drooplat;
        let start = track_points[startIndex];
        let end = track_points[endIndex];

        let PtB = new Array(2);
        let Line = [start.loc[0], start.loc[1], end.loc[0], end.loc[1]],
            PtA = [orglng, orglat];

        this.pedal(Line, PtA, PtB);
        drooplng = PtB[0];
        drooplat = PtB[1];

        //计算法向量
        let v1 = [
            [orglng - drooplng],
            [orglat - drooplat],
            [0.0]
        ];
        let v2 = [
            [drooplng],
            [drooplat],
            [0.1]
        ];
        let corsscheck = matrix.cross(v2, v1);
        plane = this.normalizedSqrt(corsscheck);
    }
    if (plane[2] < 0 || plane[2] < 1) {
        plane[2] = 0;
    }
    if (plane[2] > 1) {
        plane[2] = 1;
    }
    // plane[2] = 0;
    return plane;
}

/**
 * 计算通过两个个已知点，垂直于轨迹的平面的法向量，构成点法式以便后期计算投影点
 * @param track_points 轨迹对象，包含所有的轨迹点信息
 * @param loc1 已知第一个点
 * @param loc2 已知第二个点
 * @param beginIndex 垂足点判断开始的索引，下标以0开始
 * @return plane 返回的法向量
 */
iD.util.calculatePlane2 = function (track_points, loc1, loc2, beginIndex) {
    //计算出轨迹上距离(lng,lat)最近的点的索引
    let orgutmx, orgutmy;
    var plane;
    let utm = iD.util.LLtoUTM_(loc1[0], loc1[1]);
    let utm2 = iD.util.LLtoUTM_(loc2[0], loc2[1]);
    orgutmx = utm.x;
    orgutmy = utm.y;
    zoneo = utm.zoneNumber;
    let v1 = [
        [orgutmx - utm2.x],
        [orgutmy - utm2.y],
        [0]
    ];
    let v2 = [
        [utm2.x],
        [utm2.y],
        [loc2[2]]
    ];

    let corsscheck = matrix.cross(v2, v1);
    plane = this.normalizedSqrt(corsscheck);

    if (plane[2] < 0 || plane[2] < 1) {
        plane[2] = 0;
    }
    if (plane[2] > 1) {
        plane[2] = 1;
    }
    return plane;
}


/*
 * 计算通过两个个已知点，垂直于轨迹的平面的法向量，构成点法式以便后期计算投影点
 * @param track_points 轨迹对象，包含所有的轨迹点信息
 * @param loc1 已知第一个点
 * @param loc2 已知第二个点
 * @param beginIndex 垂足点判断开始的索引，下标以0开始
 * @return plane 返回的法向量
 */
/*
iD.util.calculatePlane2 = function(track_points, loc1, loc2, beginIndex)
{
    //计算出轨迹上距离(lng,lat)最近的点的索引
    let minLength = Infinity; //最小距离
    let minLenIndex = 0; //最小距离时所对应的轨迹点索引
    let orgutmx, orgutmy;
    var plane;
    // let zoneo[4] = {0};
    let utm = iD.util.LLtoUTM_(loc1[0], loc1[1]);
    orgutmx = utm.x;
    orgutmy = utm.y;
    zoneo = utm.zoneNumber;
    // Coordinates::ll2utm(orglat,orglng, orgutmx, orgutmy, zoneo);

    for (let i = beginIndex, len = track_points.length; i < len - 1; i++) {
        let start = track_points[i];
        let end = track_points[i + 1];

        // let startutmx, startutmy, endutmx, endutmy;
        let startUtm = iD.util.LLtoUTM_(start.loc[0], start.loc[1]);
        let endUtm = iD.util.LLtoUTM_(end.loc[0], end.loc[1]);

        let Line = [
                [startUtm.x, startUtm.y],
                [endUtm.x, endUtm.y]
            ],
            PtA = [orgutmx, orgutmy];

        //计算最近的点
        let length = this.pt2LineSegmentDist(Line, PtA);
        if (length.dis < minLength) {
            minLength = length.dis;
            minLenIndex = i;
        }
    }

    //前后各找三帧作为起点和终点的索引
    let startIndex = minLenIndex - 3;
    let endIndex = minLenIndex + 3;
    if (startIndex < 0)
        startIndex = 0;
    if (endIndex >= track_points.length)
        endIndex = track_points.length - 1;

    let start = track_points[startIndex];
    let end = track_points[endIndex];
    // let startutmx, startutmy, endutmx, endutmy;
    let startUtm = iD.util.LLtoUTM_(start.loc[0], start.loc[1]);
    let endUtm = iD.util.LLtoUTM_(end.loc[0], end.loc[1]);

    let PtB = new Array(2);
    let Line = [startUtm.x, startUtm.y, endUtm.x, endUtm.y],
        PtA = [orgutmx, orgutmy];

    //计算垂足
    this.pedal(Line, PtA, PtB);
    let drooputmx, drooputmy;
    drooputmx = PtB[0];
    drooputmy = PtB[1];

    // let ptUtm = iD.util.LLtoUTM_(drooputmy, drooputmx);

    //计算法向量
    //  let v1 = [[orgutmx-drooputmx], [orgutmy-drooputmy], [0.0]];
    //  let v1 = [[ loc2[0] ], [ loc2[1] ], [0.0]];
    let v1 = [
        [loc2[0]],
        [loc2[1]],
        [loc2[2]]
    ];
    //  let v2 = [[drooputmx], [drooputmy], [10.0]];
    let v2 = [
        [drooputmx],
        [drooputmy],
        [loc1[2]]
    ];

    let corsscheck = matrix.cross(v2, v1);
    plane = this.normalizedSqrt(corsscheck);

    if (plane[2] < 0 || plane[2] < 1) {
        plane[2] = 0;
    }
    if (plane[2] > 1) {
        plane[2] = 1;
    }
    // plane[2] = 0;
    return plane;
}
*/

/**
 * 计算点PtA在Line射线上的垂点PtB位置
 * @param {Array} Line 一条线两个点的lng、lat
 * @param {Array} PtA 已知点坐标
 * @param {Array} PtB 空数组、储存垂点坐标
 */
iD.util.pedal = function (Line, PtA, PtB) {
    let x1 = Line[0],
        y1 = Line[1],
        x2 = Line[2],
        y2 = Line[3];
    let x0 = PtA[0],
        y0 = PtA[1];

    if (x2 == x1) //水平线情况
    {
        PtB[0] = x1;
        PtB[1] = PtA[1];
    } else {
        let k = (y2 - y1) / (x2 - x1);
        let A = k;
        let B = -1;
        let C = y1 - x1 * k;

        let x = (B * B * x0 - A * B * y0 - A * C) / (A * A + B * B);

        let y = (-A * B * x0 + A * A * y0 - B * C) / (A * A + B * B);

        PtB[0] = x;
        PtB[1] = y;
    }

    let dx = PtA[0] - PtB[0];
    let dy = PtA[1] - PtB[1];
    return dx * dx + dy * dy;
}

iD.util.pedal3D = function (pt, begin, end) {
    var retVal = [];
    var dx = begin.x - end.x;
    var dy = begin.y - end.y;
    var dz = begin.z - end.z;
    if (Math.abs(dx) < 0.00000001 && Math.abs(dy) < 0.00000001 && Math.abs(dz) < 0.00000001) {
        retVal = begin;
        return retVal;
    }

    var u = (pt.x - begin.x) * (begin.x - end.x) +
        (pt.y - begin.y) * (begin.y - end.y) + (pt.z - begin.z) * (begin.z - end.z);
    u = u / ((dx * dx) + (dy * dy) + (dz * dz));

    retVal[0] = begin.x + u * dx;
    retVal[1] = begin.y + u * dy;
    retVal[2] = begin.z + u * dz;

    return retVal;
}

/**
 *  计算点P在线段上的垂足
 * @param p 已知点P
 * @param s 线段起点
 * @param e 线段终点
 * @returns {*[]}
 */
iD.util.perpendicular = function (p, s, e) {
    var r, x, y;
    r = this.relation(p, s, e);

    x = s[0] + r * (e[0] - s[0]);
    y = s[1] + r * (e[1] - s[1]);

    return [x, y];
}

iD.util.relation = function (p, s, e) {
    return this.dotmultiply(p, e, s) / (this.dist(s, e) * this.dist(s, e));
}


iD.util.dotmultiply = function (p1, p2, p0) {
    return ((p1[0] - p0[0]) * (p2[0] - p0[0]) + (p1[1] - p0[1]) * (p2[1] - p0[1]));
}


iD.util.dist = function (p1, p2) // 返回两点之间欧氏距离
{
    return (Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1])));
}


iD.util.DouglasPeucker = {
    /**
     * 获取处理后的点
     * @param points 包含点的数组
     * @param tolerance 取样临界值
     * @returns {*}
     */
    getProcessPoints: function (points, tolerance = 3) {
        /// <returns type="Array" />
        if (!_.isArray(points) || !points.length) { //当points不是数组或没有值时，直接返回一个空数组
            return [];
        }
        if (points.length < 3) return points; //小于3个点时不抽稀，因为1个或2个点无法进行抽稀
        var firstPoint = 0,
            lastPoint = points.length - 1; //取开始点与结束点的下标
        var pointIndexsToKeep = []; //保存需要点下标的数组
        pointIndexsToKeep.push(firstPoint);
        pointIndexsToKeep.push(lastPoint); //开始与结束不进行处理，直接保留
        while (points[firstPoint] == points[lastPoint]) { //处理闭合情况，闭合时，强制断开
            lastPoint--;
        }
        this.reduce(points, firstPoint, lastPoint, tolerance, pointIndexsToKeep); //抽稀
        var resultPoints = []; //返回的点数组
        pointIndexsToKeep.sort(function (a, b) { //排序，这个可排可不排
            return a - b;
        });
        for (var i = 0; i < pointIndexsToKeep.length; i++) {
            resultPoints.push(points[pointIndexsToKeep[i]]);
        }
        return resultPoints;
    },
    /**
     *
     * @param points 待抽稀的数组
     * @param firstPoint 起点
     * @param lastPoint 终点
     * @param tolerance 取样临界值
     * @param pointIndexsToKeep 保留点下标的数组
     */
    reduce: function (points, firstPoint, lastPoint, tolerance, pointIndexsToKeep) {
        var maxDis = 0,
            idxFarthest = 0; //定义最大长度及最远点的下标
        for (var i = firstPoint, dis; i < lastPoint; i++) {
            dis = this.perpendicularDistance(points[firstPoint], points[lastPoint], points[i]); //获取当前点到起点与
            if (dis > maxDis) { //保存最远距离
                maxDis = dis;
                idxFarthest = i;
            }
        }
        if (maxDis > tolerance && idxFarthest != 0) { //如果最远距离大于临界值
            pointIndexsToKeep.push(idxFarthest);
            this.reduce(points, firstPoint, idxFarthest, tolerance, pointIndexsToKeep);
            this.reduce(points, idxFarthest, lastPoint, tolerance, pointIndexsToKeep);
        }
    },
    /**
     *
     * @param beginPoint  计算给出的comparePoint到beginPoint与endPoint组成的直线的垂直距离
     * @param endPoint  起始点
     * @param comparePoint  结束点
     * @returns {number}  比较点
     */
    perpendicularDistance: function (beginPoint, endPoint, comparePoint) {
        //Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
        //Base = v((x1-x2)2+(y1-y2)2)                               *Base of Triangle*
        //Area = .5*Base*H                                          *Solve for height
        //Height = Area/.5/Base
        var area = Math.abs(0.5 * (beginPoint[0] * endPoint[1] + endPoint[0] * comparePoint[1] + comparePoint[0] * beginPoint[1] -
            endPoint[0] * beginPoint[1] - comparePoint[0] * endPoint[1] - beginPoint[0] * comparePoint[1]));
        var bottom = Math.sqrt(Math.pow(beginPoint[0] - endPoint[0], 2) + Math.pow(beginPoint[1] - endPoint[1], 2));
        var height = area / bottom * 2;
        return height;
    }

}

iD.util.lineClip = function (line, rect) {
    let xmin = rect[0][0],
        ymin = rect[0][1],
        xmax = rect[1][0],
        ymax = rect[1][0];
    let points = [];
    var arr;
    var clieLine;
    for (let i = 0, len = line.length - 1; i < len; i++) {
        arr = [line[i], line[i + 1]];
        clieLine = this.cohenSutherlandLineClip(arr, xmin, ymin, xmax, ymax);
        if (clieLine) {
            points.push(clieLine[0]);
        }
    }
    return points;
}
const m_pi = 3.14159265358979323846264338328; // pi
const m_pi_2 = 1.57079632679489661923132169164; // pi/2
const m_2pi = 6.28318530717958647692528676656; // 2*pi
const m_1_pi = 0.318309886183790671537767526745; // 1/pi
const m_1_sqrt_pi = 0.564189583547756286948079451561;
const fd = [1.0,
    2.7022305772400260215,
    4.2059268151438492767,
    4.5221882840107715516,
    3.7240352281630359588,
    2.4589286254678152943,
    1.3125491629443702962,
    0.5997685720120932908,
    0.20907680750378849485,
    0.07159621634657901433,
    0.012602969513793714191,
    0.0038302423512931250065
];
const fn = [0.49999988085884732562,
    1.3511177791210715095,
    1.3175407836168659241,
    1.1861149300293854992,
    0.7709627298888346769,
    0.4173874338787963957,
    0.19044202705272903923,
    0.06655998896627697537,
    0.022789258616785717418,
    0.0040116689358507943804,
    0.0012192036851249883877
];

const gd = [1.0,
    2.0646987497019598937,
    2.9109311766948031235,
    2.6561936751333032911,
    2.0195563983177268073,
    1.1167891129189363902,
    0.57267874755973172715,
    0.19408481169593070798,
    0.07634808341431248904,
    0.011573247407207865977,
    0.0044099273693067311209,
    -0.00009070958410429993314
];
const gn = [0.50000014392706344801,
    0.032346434925349128728,
    0.17619325157863254363,
    0.038606273170706486252,
    0.023693692309257725361,
    0.007092018516845033662,
    0.0012492123212412087428,
    0.00044023040894778468486,
    -8.80266827476172521e-6,
    -1.4033554916580018648e-8,
    2.3509221782155474353e-10
];
/**
 * Cohen-Sutherland算法裁剪线段
 * @param line 线段
 * @param rect 矩形区域
 */
iD.util.cohenSutherlandLineClip = function (line, xmin, ymin, xmax, ymax) {

    var x0 = line[0][0],
        y0 = line[0][1],
        x1 = line[1][0],
        y1 = line[1][1];
    const INSIDE = 0; // 0000
    const LEFT = 1; // 0001
    const RIGHT = 2; // 0010
    const BOTTOM = 4; // 0100
    const TOP = 8; // 1000

    // Compute the bit code for a point (x, y) using the clip rectangle
    // bounded diagonally by (xmin, ymin), and (xmax, ymax)

    // ASSUME THAT xmax, xmin, ymax and ymin are global constants.
    //判断端点的区域码
    function computeOutCode(x, y) {
        let code;
        code = INSIDE; // initialised as being inside of clip window

        if (x < xmin) // to the left of clip window
            code |= LEFT;
        else if (x > xmax) // to the right of clip window
            code |= RIGHT;
        if (y < ymin) // below the clip window
            code |= BOTTOM;
        else if (y > ymax) // above the clip window
            code |= TOP;

        return code;
    }
    // Cohen–Sutherland clipping algorithm clips a line from
    // P0 = (x0, y0) to P1 = (x1, y1) against a rectangle with
    // diagonal from (xmin, ymin) to (xmax, ymax).

    // compute outcodes for P0, P1, and whatever point lies outside the clip rectangle
    let outcode0 = computeOutCode(x0, y0);
    let outcode1 = computeOutCode(x1, y1);
    let accept = false;
    let x, y;
    let outcodeOut
    while (true) {
        if (!(outcode0 | outcode1)) { //相或为0，接受并且退出循环
            return [
                [x0, y0],
                [x1, y1]
            ];
            break;
        } else if (outcode0 & outcode1) { // 相与为1，拒绝且退出循环
            return null;
        } else {
            // failed both tests, so calculate the line segment to clip
            // from an outside point to an intersection with clip edge

            //找出在界外的点
            outcodeOut = outcode0 ? outcode0 : outcode1;

            // 找出和边界相交的点
            // 使用点斜式 y = y0 + slope * (x - x0), x = x0 + (1 / slope) * (y - y0)
            if (outcodeOut & TOP) { // point is above the clip rectangle
                x = x0 + (x1 - x0) * (ymax - y0) / (y1 - y0);
                y = ymax;
            } else if (outcodeOut & BOTTOM) { // point is below the clip rectangle
                x = x0 + (x1 - x0) * (ymin - y0) / (y1 - y0);
                y = ymin;
            } else if (outcodeOut & RIGHT) { // point is to the right of clip rectangle
                y = y0 + (y1 - y0) * (xmax - x0) / (x1 - x0);
                x = xmax;
            } else if (outcodeOut & LEFT) { // point is to the left of clip rectangle
                y = y0 + (y1 - y0) * (xmin - x0) / (x1 - x0);
                x = xmin;
            }

            // Now we move outside point to intersection point to clip
            // 为什么继续循环，两个端点都有可能在外面
            if (outcodeOut == outcode0) {
                x0 = x;
                y0 = y;
                outcode0 = computeOutCode(x0, y0);
            } else {
                x1 = x;
                y1 = y;
                outcode1 = computeOutCode(x1, y1);
            }
        }
    }
    return [
        [x0, y0],
        [x1, y1]
    ];
}

/**
 * 生成一个随机的有吸引力的颜色  --By Mock.js
 * @param {Number} saturation 饱和度
 * @param {Number} value 明度
 */
iD.util.goldenRatioColor = function (saturation, value) {

    function _goldenRatioColor(saturation, value) {
        var _goldenRatio = 0.618033988749895
        var _hue = Math.random();
        _hue += _goldenRatio;
        _hue %= 1;

        if (typeof saturation !== "number") saturation = 0.5;
        if (typeof value !== "number") value = 0.95;

        return [
            _hue * 360,
            saturation * 100,
            value * 100
        ]
    }

    function hsv2rgb(hsv) {
        var h = hsv[0] / 60
        var s = hsv[1] / 100
        var v = hsv[2] / 100
        var hi = Math.floor(h) % 6

        var f = h - Math.floor(h)
        var p = 255 * v * (1 - s)
        var q = 255 * v * (1 - (s * f))
        var t = 255 * v * (1 - (s * (1 - f)))

        v = 255 * v

        switch (hi) {
            case 0:
                return [v, t, p]
            case 1:
                return [q, v, p]
            case 2:
                return [p, v, t]
            case 3:
                return [p, q, v]
            case 4:
                return [t, p, v]
            case 5:
                return [v, p, q]
        }
    }

    function rgb2hex(r, g, b) {
        return "#" + ((256 + r << 8 | g) << 8 | b).toString(16).slice(1);
    }

    let hsv = _goldenRatioColor(saturation, value);
    let color = hsv2rgb(hsv);

    return rgb2hex(color[0], color[1], color[2]);
}

/**
 * 使用hsv进行相似色判断；
 * 只考虑饱和度50以上，并且明度在60以上
 * @param {String} hex1
 * @param {String} hex2
 */
iD.util.compareColorSimilar = function (hex1, hex2) {
    function rgb2hsv(rgb) {
        var r = rgb[0],
            g = rgb[1],
            b = rgb[2],
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            delta = max - min,
            h, s, v;

        if (max === 0)
            s = 0;
        else
            s = (delta / max * 1000) / 10;

        if (max == min)
            h = 0;
        else if (r == max)
            h = (g - b) / delta;
        else if (g == max)
            h = 2 + (b - r) / delta;
        else if (b == max)
            h = 4 + (r - g) / delta;

        h = Math.min(h * 60, 360);

        if (h < 0)
            h += 360;

        v = ((max / 255) * 1000) / 10;

        return [h, s, v];
    }

    function hex2rgb(a) {
        a = '0x' + a.slice(1).replace(a.length > 4 ? a : /./g, '$&$&') | 0;
        return [a >> 16, a >> 8 & 255, a & 255]
    }

    let hsv1 = rgb2hsv(hex2rgb(hex1)),
        hsv2 = rgb2hsv(hex2rgb(hex2));
    let abs = Math.abs;
    let maxh = Math.max(hsv1[0], hsv2[0]),
        minh = Math.min(hsv1[0], hsv2[0]);
    if (maxh >= 345 && minh <= 15) {
        // 红色范围认为是345-0-15
        maxh = 360 - maxh;
    }
    let dh = abs(maxh - minh);
    let ds = abs(hsv1[1] - hsv2[1]);
    let dv = abs(hsv1[2] - hsv2[2]);

    let count = dh / 10 + ds / 10 + dv / 10;
    let distance = 2;
    let maxs = Math.max(hsv1[1], hsv2[1]),
        maxv = Math.max(hsv1[2], hsv2[2]);
    if (maxs < 40) {
        distance /= 2;
    }
    if (maxv < 10) {
        distance *= 10;
    } else if (maxv < 30) {
        distance *= 3;
    } else if (maxv < 50) {
        distance *= 1.5;
    }

    //	console.log('compare color diff: ' + count, '\t threshold: ' + distance, hsv1, hsv2);
    return count < distance;
}

/**
 * 颜色列表
 * from https://www.cnblogs.com/MrYuan/p/4898387.html
 * @return Object
 */
iD.util.randomColorList = function () {
    let colorList = [
        "#FFFFCD", "#FF0000", "#FFFF00", "#E3170D", "#FF9912",
        "#E3CF57", "#FFD700", "#FF6347", "#FFC0CB", "#FFE384",
        "#B0171F", "#FF8000", "#FF00FF", "#8B864E", "#00FF00",
        "#802A2A", "#00FFFF", "#C76114", "#F4A460", "#40E0D0",
        "#D2B48C", "#082E54", "#BC8F8F", "#228B22", "#A0522D",
        "#6B8E23", "#0000FF", "#03A89E", "#DA70D6", "#191970",
        "#8A2BE2", "#00C78C", "#9933FA", "#F0FFFF", "#FCE6C9",
        "#666666", "#808A87", "#CCCCCC", "#808069", "#000000"
    ];

    let _index = -1;

    function index() {
        let nindex = ++_index;
        if (nindex > colorList.length - 1) {
            nindex = _index = -1;
        }
        return nindex;
    }

    return {
        get: function () {
            let c = colorList[index()]
            return c;
        },
        reset: function () {
            _index = -1;
        }
    }
}

/**
 * 取round整数
 * @param {Number} num
 */
iD.util.roundNumber = function (num) {
    /*
    rounded = (0.5 + somenum) | 0;
    rounded = ~~ (0.5 + somenum);
    rounded = (0.5 + somenum) << 0;
    */
    num = +num;
    return (0.5 + num) << 0
}
/**
 * 设置DataLayer中的label参数
 * @param {Object} layer
 */
iD.util.setLayerLabelField = function (layer) {
    if (!layer.label) {
        layer.label = {
            display: false
        }
    }
    if (window._systemType == 2 || window._systemType == 1) {
        layer.label = layer.label || {};
        layer.label.displayMap = {};
        layer.label.displayMap[iD.data.DataType.LAMPPOST] = true;
        layer.label.displayMap[iD.data.DataType.TRAFFICLIGHT] = true;
        layer.label.displayMap[iD.data.DataType.LIMITHEIGHT] = true;
        layer.label.displayMap[iD.data.DataType.OBJECT_PG] = true;
    } else {
        if (_.include([
            iD.data.DataType.LAMPPOST,
            iD.data.DataType.TRAFFICLIGHT,
            iD.data.DataType.LIMITHEIGHT
        ], layer.models.datas[0])) {
            layer.label.display = true;
        }
    }
}

iD.util.checkErrors = function (graph, K, trackPoint, node) {
    var isErr = false;

    var mea = graph.parentRelations(node, iD.data.DataType.MEASUREINFO)
    if (K && trackPoint) {
        isErr = iD.util.checkMeasureinfo(K, trackPoint, node, mea[0]);
    }
    let hasVirtualLine = false;
    if (mea.length == 2) {
        // 生成虚拟车道线
        mea.forEach(function (r) {
            let param = JSON.parse(r.tags.PARAMETER || '{}');
            if (param.Paras && param.Paras.method == 9) {
                hasVirtualLine = true;
            }
        });
    }
    if (mea.length > 1 && !hasVirtualLine) {
        Dialog.alert('存在多个测量！');
        return
    }
    if (isErr && isErr.err) {
        Dialog.alert(isErr.text);
    }
    //  console.log('checkMeasureinfo');
}

/**
 *  测量信息错误检查
 */
iD.util.checkMeasureinfo = function (K, trackPoint, node, r) {
    var text = '测量信息缺失: ';
    var res = {
        err: false,
        text
    }
    if (!r) {
        res.err = true;
        return res;
    }
    var para = r.tags.PARAMETER && JSON.parse(r.tags.PARAMETER);
    res.text = '测量信息错误: ' + r.id;

    if (!para || !para.Paras.nodes.length) return false;
    var n = para.Paras.nodes[0];
    if (n.trackPointId != trackPoint.id) {
        // isErr = true;
        res.err = true;
        return res;
    }
    var p = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);
    if (Math.abs(p[0] - n.x) > 11 || Math.abs(p[1] - n.y) > 11) {
        res.err = true;
        return res;
    }

    return res;
}


/**
 * 获取loc在floc/tloc线段之间的高程
 * @param {Array} floc
 * @param {Array} tloc
 * @param {Array} loc
 */
iD.util.getBetweenPointLoc = function (floc, tloc, loc) {
    var diffValZ = tloc[2] - floc[2];
    var newDiffValZ = 0;
    // 高度值
    if (floc[0] == tloc[0]) {
        newDiffValZ = diffValZ * Math.abs(floc[1] - loc[1]) / Math.abs(floc[1] - tloc[1]);
    } else {
        newDiffValZ = diffValZ * Math.abs(floc[0] - loc[0]) / Math.abs(floc[0] - tloc[0]);
    }
    var result = [loc[0], loc[1], floc[2] + newDiffValZ];

    // 限制高度范围
    var maxZ = _.max([tloc[2], floc[2]]),
        minZ = _.min([tloc[2], floc[2]]);
    if (result[2] > maxZ) result[2] = maxZ;
    if (result[2] < minZ) result[2] = minZ;
    if (isNaN(result[2])) result[2] = 0;
    return result;
}

/**
 * 临时辅助方法
 */
iD.util._Util = {
    _cars: null,
    //二进制转16进制
    _2To16: function (v) {
        return parseInt(v, 2).toString(16).toUpperCase();
    },
    //16进制转2进制
    _16To2: function (v) {
        return parseInt(v, 16).toString(2);
    },
    //2进制转10进制
    _2To10: function (v) {
        return parseInt(v, 2).toString(10);
    },
    //10进制转2进制
    _10To2: function (v) {
        return parseInt(v, 10).toString(2);
    },
    //组装时间
    //返回：[(h:02:00)(h:03:00)]
    // _timeTranfer: function(time1, time2) {
    // 	var arr = [];
    // 	arr.push('[(h:');
    // 	arr.push(time1);
    // 	arr.push(')(h:');
    // 	arr.push(time2);
    // 	arr.push(')]');
    // 	return arr.join('');
    // },
    //组装时间的反操作
    //返回{time1:'02:00',time2:'03:00'}
    // _timeReverseTranfer: function(time) {
    // 	var obj = {
    // 		time1: '00:00',
    // 		time2: '24:00'
    // 	};
    // 	//首先把收尾的[(,)]，以及h:去掉
    // 	time = time.replace('[(', '').replace(')]', '').replace(/h:/g, '').split(')(');
    // 	if (time.length == 2) {
    // 		obj.time1 = time[0];
    // 		obj.time2 = time[1];
    // 	}
    // 	return obj;
    // },
    //根据选择的车辆
    //生成对应十六进制
    _createHexadecimalBySelectedCars: function (ids) {
        return ids.join(',');
        // var temp = [];
        // for (var i = 0; i < 32; i++) {
        //     temp.push(0);
        // }
        // _(ids).each(function (id) {
        //     temp[id] = 1;
        // });
        // return this._2To16(temp.reverse().join(''));
    },
    //根据16进制，获得选择的车类型
    //返回数组
    _getCarNamesByHexadecimal: function (v) {
        var array = [];
        let vs = v.split(',') ||  [''];
        for (var i = 0, l = vs.length; i < l; i++) {
            // if (!['13','14'].includes(vs[i])) {
                var obj = this.searchCar(vs[i]);
                if (obj) {
                    array.push(obj);
                }
            // }
        }
        return array;
    },
    searchCar: function (i) {
        var obj;
        var cars = _.map(iD._attributeField.carOptions, function (item) {
            return _.assign({}, item, {
                name: item.name
            });
        });
        _(cars).each(function (item) {
            if (item.id === i) {
                obj = item;
                return false;
            }
        });
        return obj;
    },
    /**
     * 根据属性值获取天气的type
     * @param {Object} v
     */
    _getWeatherTypesByCode: function (v) {
        var weathers = [];
        if (!v) return weathers;
        var arr = v.split(",");
        // for (var i = 0; i < arr.length; i++) {
        //     if (arr[i] == "1") {
        //         if (i == 0) {
        //             weathers.push("sunny");
        //         } else if (i == 1) {
        //             weathers.push("rain");
        //         } else if (i == 2) {
        //             weathers.push("ice");
        //         } else if (i == 3) {
        //             weathers.push("fog");
        //         } else if (i == 4) {
        //             weathers.push("wind");
        //         }
        //     }
        // }
        return arr;
    },
    /**
     * 根据属性值获取天气的names
     * @param {Object} v
     */
    _getWeatherNamesByCode: function (v) {
        var weathers = this._getWeatherTypesByCode(v);
        return _.compact(_.map(weathers, this.searchWeather, this));
    },
    searchWeather: function (type) {
        var obj;
        _(iD._attributeField.weatherOptions).each(function (d) {
            if (d.value == type) {
                obj = d;
                return false;
            }
        });
        return obj;
    }
};

iD.util.hasSameNode = function (wayA, wayB) {
    for (var i = 0; i < wayA.nodes.length; i++) {
        var nodeId1 = wayA.nodes[i];
        for (var j = 0; j < wayB.nodes.length; j++) {
            var nodeId2 = wayB.nodes[j];
            if (nodeId1 == nodeId2) {
                return nodeId1
            }
        }
    }
    return false;
    /*var wayA_fNode = wayA.nodes[0];
     var wayA_tNode = wayA.nodes[wayA.nodes.length - 1];
     var wayB_fNode = wayB.nodes[0];
     var wayB_tNode = wayB.nodes[wayB.nodes.length - 1];
     if (wayA_fNode == wayB_fNode || wayA_fNode == wayB_tNode || wayA_tNode == wayB_fNode || wayA_tNode == wayB_tNode)
     return true;
     return false;*/
}

/**
 * 任务场景
 * @param {String} type
 */
iD.util.taskUpdateScene = function (context) {
    var task = iD.Task.d;
    var sceneCode = task && task.tags.sceneCode;
    var editParam = context.variable.edit;
    editParam.editDivider = true;
    editParam.editOther = true;
    if (!task || !sceneCode) {
        context.event.change_scene();
        return;
    }

    if (sceneCode == iD.data.sceneCode.HD_DATA_LANE) {
        editParam.editDivider = true;
        editParam.editOther = false;
    } else if (sceneCode == iD.data.sceneCode.HD_DATA_LO) {
        editParam.editDivider = false;
        editParam.editOther = true;
    }
    context.event.change_scene();
}

//解析POLYGON 与 MULTIPOLYGON

iD.util.parsePolyStrings = function (ps) {
    var i, j, lat, lng, tmp, tmpArr,
        arr = [],
        //match '(' and ')' plus contents between them which contain anything other than '(' or ')'
        m = ps.match(/\([^\(\)]+\)/g);
    if (m !== null) {
        for (i = 0; i < m.length; i++) {
            //match all numeric strings
            tmp = m[i].match(/-?\d+\.?\d*/g);
            if (tmp !== null) {
                //convert all the coordinate sets in tmp from strings to Numbers and convert to LatLng objects
                for (j = 0, tmpArr = []; j < tmp.length; j += 2) {
                    lat = Number(tmp[j]);
                    lng = Number(tmp[j + 1]);
                    tmpArr.push([lat, lng]);

                }
                arr.push(tmpArr);
            }
        }
    }
    //array of arrays of LatLng objects, or empty array
    return arr;
}
/**
 * 判断当前URL是否有初始化指定轨迹点的逻辑
 * trackIds只有一条轨迹，trackPointId指定轨迹中的轨迹点，
 * 同时必须指定taskID与当前任务ID一致
 */
iD.util.isInitTrackPointByUrl = function (trackList) {
    if (!iD.util.isLocateTrackPointUrl()) return false;
    var trackIds = iD.url.getUrlParam('trackIds');
    trackIds = trackIds.split(',');
    var trackPointId = iD.url.getUrlParam('trackPointId');
    var taskId = iD.url.getUrlParam('taskID');
    if (!taskId || !iD.Task.d || iD.Task.d.task_id != taskId) return false;
    var index = -1,
        trackObj;
    for (var track of trackList) {
        if (track.trackId == trackIds[0]) {
            index = _.pluck(track.nodes, 'id').indexOf(trackPointId);
            trackObj = track;
        }
    }
    if (index == -1) return false;
    return {
        track: trackObj,
        index: index
    };
}
iD.util.isLocateTrackPointUrl = function () {
    var trackIds = iD.url.getUrlParam('trackIds');
    if (!trackIds) return false;
    trackIds = trackIds.split(',');
    if (trackIds.length > 1) return false;
    var trackPointId = iD.url.getUrlParam('trackPointId');
    if (!trackPointId) return false;
    var taskId = iD.url.getUrlParam('taskID');
    if (!taskId) return false;
    return true;
}

/*
 *  判断模型名称是否包含在当前图层对象中
 * */
iD.util.getModelNameByItem = function (collection, modelName) {
    for (let i in collection) {
        if (i == modelName) {
            return true;
        }
    }
    return false;
}

/**
 * 根据场景获取对应的模型列表
 * @param {String} sceneCode
 */
iD.util.getSceneModel = function (sceneCode) {
    if (!sceneCode && iD.Task && iD.Task.d) {
        sceneCode = iD.Task.d.tags.sceneCode || '';
    }
    return iD.data.sceneDataType[sceneCode] || [];
}

/**
 * 根据模型判断是否属于当前场景
 * @param {Array} models
 * @param {Object} context
 */
iD.util.modelSceneEditable = function (models, context) {
    var sceneCode = iD.Task.d && iD.Task.d.tags.sceneCode || '';
    var editVar = context.variable.edit;
    // 没有场景时默认都可编辑；
    if (!sceneCode) return true;
    if (editVar.editDivider && editVar.editOther) return true;
    if (!models) return false;
    if (!_.isArray(models)) {
        models = [models];
    }
    // 根据模型判断
    var laneModels = iD.util.getSceneModel(iD.data.sceneCode.HD_DATA_LANE);
    var otherModels = iD.util.getSceneModel(iD.data.sceneCode.HD_DATA_LO);
    var noedit = false;
    var islane = _.intersection(laneModels, models).length > 0,
        isother = _.intersection(otherModels, models).length > 0;
    if (!editVar.editDivider) {
        noedit = islane;
    } else if (!editVar.editOther) {
        noedit = isother;
    }
    if (islane && isother) {
        // 模型被多个场景使用
        noedit = false;
    }
    return !noedit;
}

/**
 * 监听指定element的css动画结束事件；
 * @param {HTMLElement} element
 * @param {Function} func
 */
iD.util.whichTransitionEndEvent = function (element, func, context) {
    var t,
        transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
    var eventName;
    for (t in transitions) {
        if (element.style[t] !== undefined) {
            eventName = transitions[t];
            break;
        }
    }

    function evtFun() {
        func && func.call(context && context || element);
        // arguments.callee 指的是当前函数
        element.removeEventListener(eventName, arguments.callee, false); //销毁事件
    }

    if (eventName) {
        element.removeEventListener(eventName, evtFun);
        element.addEventListener(eventName, evtFun);
    }
}

/**
 * TODO 20180627 临时-保存时检查车道线1km
 * @param {Object} context
 */
iD.util.saveCheckEntity = function (context) {
    var wayList = [];
    var $dom = d3.select('#save-checklist-div');
    if (!$dom.size()) {
        $dom = d3.select('body').append('div').attr('id', 'save-checklist-div');
        $dom.append('div').attr('class', 'save-check-list');
        $dom.append('div').attr('class', 'save-checklist-close').html('&times;');
    }
    var $list = $dom.select('.save-check-list');
    var $close = $dom.select('.save-checklist-close');
    var dataList = [];
    var DIVIDER_LENGTH_LIMIT = 1000;

    function locateEntity(entity) {
        if (!context.hasEntity(entity.id)) {
            return;
        }
        if (entity instanceof iD.Way) {
            var node = context.entity(entity.nodes[0]);
            var map = context.map();
            if (map.zoom() < context.options.editableLevel) {
                map.centerZoom(node.loc, context.options.editableLevel);
            } else {
                map.center(node.loc);
            }
            context.enter(iD.modes.Select(context, [entity.id], null, true)
                .suppressMenu(false)
                .newFeature(true));
        }
    }

    var saveTool = {
        clear: function () {
            $list.html('');
            dataList.length = 0;
        },
        close: function () {
            this.clear();
            $dom.style('display', 'none');
        },
        show: function () {
            var self = this;
            var $itemList = $list.selectAll('div.list-item').data(dataList);
            var $items = $itemList.enter().append('div').attr('class', 'list-item');
            $items.append('div').attr('class', 'item-prefix').text(function (d) {
                return (d.distance / 1000).toFixed(2) + 'km';
            });
            $items.append('div').attr('class', 'item-left').text(function (d) {
                return '车道线: ' + iD.Entity.id.toOSM(d.entity.id);
            });
            $items.append('button').attr('type', 'button').text(function (d) {
                return '定位'
            }).on('click', function (d) {
                locateEntity(d.entity);
            });
            $itemList.exit().remove();

            $close.on('click', function () {
                self.close();
            });
            $dom.style('display', 'block');
        },
        checkLimitDivider: function (ways) {
            this.clear();
            let wayMap = {};
            ways.forEach(function (way) {
                if (wayMap[way.id]) return;
                if (way.modelName != iD.data.DataType.DIVIDER) return;
                var flag = iD.util.entityInPlyGon(way, context);
                if (!flag) return;
                var dis = 0;
                // 只判断范围内，超过1km的DIVIDER
                for (let i = 0; i < way.nodes.length - 1; i++) {
                    let node1 = context.entity(way.nodes[i]);
                    let node2 = context.entity(way.nodes[i + 1]);
                    dis += (iD.util.distanceByLngLat(node1.loc, node2.loc) || 0);
                    if (node2.id == _.last(way.nodes) && dis >= DIVIDER_LENGTH_LIMIT) {
                        dataList.push({
                            entity: way,
                            distance: dis
                        });
                        wayMap[way.id] = true;
                    }
                }
            });
            return dataList.length > 0;
        }
    };

    return saveTool;
}

iD.util.getSpeed = function (point, allNodes, range = 10, direction = 1) {
    if (!point || !_.isArray(allNodes)) return 0;
    let distance = 0,
        index = allNodes.indexOf(point),
        e, s = point;
    while (index >= 0 && index < allNodes.length) {
        index += direction;
        e = allNodes[index];
        distance += iD.geo.sphericalDistance(s.loc, e.loc);
        if (distance >= range) {
            break;
        }
        s = e;
    }
    if (e) {
        let sDate = new Date(point.tags.locTime),
            eDate = new Date(e.tags.locTime);
        let second = Math.abs(sDate - eDate) / 1000;
        secondSpeed = distance / second;
    }
    return (secondSpeed * 3.6).toFixed(2) + '/h'
}

iD.util.getFeatureByBounds = function (bounds) {
    var allEntities = editor.context.intersects(bounds)
}

/**
 * @private
 * 计算范围
 */
iD.util.calculateBounds = function (path) {
    var self = this;
    var bounds = {
        'southwest': [],
        'northeast': []
    }
    bounds["southwest"] = [path[0][0], path[0][1]];
    bounds["northeast"] = [path[0][0], path[0][1]];;
    var sw = bounds["southwest"];
    var ne = bounds["northeast"];
    for (var i = 1, l = path.length; i < l; ++i) {
        sw[0] = Math.min(sw[0], path[i][0]);
        sw[1] = Math.min(sw[1], path[i][1]);
        ne[0] = Math.max(ne[0], path[i][0])
        ne[1] = Math.max(ne[1], path[i][1]);
    }
    return [bounds.southwest, bounds.northeast];
}

/**
 * 判断属性值是否改变，只判断已有的字段；
 * _.isEqual方法会用“===”的方式判断，有部分属性是数字类型与字符串类型
 * 导致_.isEqual为false；
 * @param {Object} base
 * @param {Object} change
 */
iD.util.tagChanged = function (base, change) {
    if (!base || !change) return false;
    var bkeys = _.keys(base),
        ckeys = _.keys(change);
    if (!bkeys.length && !ckeys.length) return false;
    // base字段比change少
    if (bkeys.length < ckeys.length) return true;
    var cdiff = _.difference(ckeys, bkeys);
    // base字段多时，change中有base以外的字段；
    if (cdiff.length) return true;
    // 字段一致，或change中没有多余字段
    var flag = false;
    for (var key in base) {
        if (!base.hasOwnProperty(key)) {
            continue;
        }
        if (!change.hasOwnProperty(key)) {
            continue;
        }
        if (base[key] != change[key]) {
            flag = true;
            break;
        }
    }
    return flag;
}


/**
 * 加载组网标记用的属性，任务信息、城市
 * @param {Array} loc
 */
iD.util.loadNetworkTagAdcode = function (loc, callback) {

    return d3
        .json(iD.config.URL.kts + 'data/process/serv/queryAdCode?xyz=' + loc.slice(0, 2).join(','))
        .get(function (err, data) {
            if (!data || !data.result) {
                callback({});
                return;
            }
            var result = data.result || {};
            var adcode = result.adcode && result.adcode[0] || '';
            callback({
                ADCODE: adcode
            });
        });
}

/**
 * 加载组网标记用的任務信息
 * @param {String} taskid
 * @param {Array} loc
 */
iD.util.loadNetworkTagBussinfo = function (taskid, loc, callback) {
    var url = iD.config.URL.kts + 'data/process/serv/queryServiceParamsByTaskId?taskId=' + taskid;
    if (loc && loc.length >= 2) {
        url += '&lon=' + loc[0] + '&lat=' + loc[1];
    }
    return d3
        .json(url)
        .get(function (err, data) {
            if (!data || !data.result) {
                callback([], taskid);
                return;
            }
            var result = data.result || [];
            callback(result, taskid);
        });
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
iD.util.dateFormat = function (date, fmt) { //author: meizz   
    var o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

iD.util.LommelReduced = function (mu, nu, b) {
    var tmp = 1 / ((mu + nu + 1) * (mu - nu + 1));
    var res = tmp;
    for (var n = 1; n < 100; ++n) {
        tmp *= (-b / (2 * n + mu - nu + 1)) * (b / (2 * n + mu + nu + 1));
        res += tmp;
        if (Math.abs(tmp) < Math.abs(res) * 1e-50) break;
    }
    return res;
}

iD.util.evalXYazero = function (nk, b, X, Y) {
    var sb = Math.sin(b);
    var cb = Math.cos(b);
    var b2 = b * b;
    if (Math.abs(b) < 1e-3) {
        X[0] = 1 - (b2 / 6) * (1 - (b2 / 20) * (1 - (b2 / 42)));
        Y[0] = (b / 2) * (1 - (b2 / 12) * (1 - (b2 / 30)));
    } else {
        X[0] = sb / b;
        Y[0] = (1 - cb) / b;
    }
    var A = b * sb;
    var D = sb - b * cb;
    var B = b * D;
    var C = -b2 * sb;
    for (var k = 1; k < nk; ++k) {
        var t1 = this.LommelReduced(k + 0.5, 1.5, b);
        var t2 = this.LommelReduced(k + 1.5, 0.5, b);
        var t3 = this.LommelReduced(k + 1.5, 1.5, b);
        var t4 = this.LommelReduced(k + 0.5, 0.5, b);
        X[k] = (k * A * t1 + B * t2 + cb) / (1 + k);
        Y[k] = (C * t3 + sb) / (2 + k) + D * t4;
    }
}
iD.util.FresnelCS = function (y) {
    /*=======================================================*\
      Purpose: This program computes the Fresnel integrals 
               C(x) and S(x) using subroutine FCS
      Input :  x --- Argument of C(x) and S(x)
      Output:  C --- C(x)
               S --- S(x)
      Example:
              x          C(x)          S(x)
             -----------------------------------
             0.0      .00000000      .00000000
             0.5      .49234423      .06473243
             1.0      .77989340      .43825915
             1.5      .44526118      .69750496
             2.0      .48825341      .34341568
             2.5      .45741301      .61918176

      Purpose: Compute Fresnel integrals C(x) and S(x)
      Input :  x --- Argument of C(x) and S(x)
      Output:  C --- C(x)
               S --- S(x)
    \*=======================================================*/

    const eps = 1E-15;
    const x = y > 0 ? y : -y;
    var C, S;
    if (x < 1.0) {
        var twofn, fact, denterm, numterm, sum, term;

        const s = m_pi_2 * (x * x);
        const t = -s * s;

        // Cosine integral series
        twofn = 0.0;
        fact = 1.0;
        denterm = 1.0;
        numterm = 1.0;
        sum = 1.0;
        do {
            twofn += 2.0;
            fact *= twofn * (twofn - 1.0);
            denterm += 4.0;
            numterm *= t;
            term = numterm / (fact * denterm);
            sum += term;
        } while (Math.abs(term) > eps * Math.abs(sum));

        C = x * sum;

        // Sine integral series
        twofn = 1.0;
        fact = 1.0;
        denterm = 3.0;
        numterm = 1.0;
        sum = 1.0 / 3.0;
        do {
            twofn += 2.0;
            fact *= twofn * (twofn - 1.0);
            denterm += 4.0;
            numterm *= t;
            term = numterm / (fact * denterm);
            sum += term;
        } while (Math.abs(term) > eps * Math.abs(sum));

        S = m_pi_2 * sum * (x * x * x);

    } else if (x < 6.0) {

        // Rational approximation for f
        var sumn = 0.0;
        var sumd = fd[11];
        for (var k = 10; k >= 0; --k) {
            sumn = fn[k] + x * sumn;
            sumd = fd[k] + x * sumd;
        }
        var f = sumn / sumd;

        // Rational approximation for g
        sumn = 0.0;
        sumd = gd[11];
        for (var k = 10; k >= 0; --k) {
            sumn = gn[k] + x * sumn;
            sumd = gd[k] + x * sumd;
        }
        var g = sumn / sumd;

        var U = m_pi_2 * (x * x);
        var SinU = Math.sin(U);
        var CosU = Math.cos(U);
        C = 0.5 + f * SinU - g * CosU;
        S = 0.5 - f * CosU - g * SinU;

    } else {

        var absterm;

        // x >= 6; asymptotic expansions for  f  and  g

        const s = m_pi * x * x;
        const t = -1 / (s * s);

        // Expansion for f
        var numterm = -1.0;
        var term = 1.0;
        var sum = 1.0;
        var oldterm = 1.0;
        var eps10 = 0.1 * eps;

        do {
            numterm += 4.0;
            term *= numterm * (numterm - 2.0) * t;
            sum += term;
            absterm = Math.abs(term);
            oldterm = absterm;
        } while (absterm > eps10 * Math.abs(sum));

        var f = sum / (m_pi * x);

        //  Expansion for  g
        numterm = -1.0;
        term = 1.0;
        sum = 1.0;
        oldterm = 1.0;

        do {
            numterm += 4.0;
            term *= numterm * (numterm + 2.0) * t;
            sum += term;
            absterm = Math.abs(term);
            oldterm = absterm;
        } while (absterm > eps10 * Math.abs(sum));

        var g = m_pi * x;
        g = sum / (g * g * x);

        var U = m_pi_2 * (x * x);
        var SinU = Math.sin(U);
        var CosU = Math.cos(U);
        C = 0.5 + f * SinU - g * CosU;
        S = 0.5 - f * CosU - g * SinU;

    }
    if (y < 0) {
        C = -C;
        S = -S;
    }
    return {
        C,
        S
    }
}

iD.util.FresnelCS1 = function (nk, t, C, S) {
    var res = this.FresnelCS(t);
    C[0] = res.C;
    S[0] = res.S;
    if (nk > 1) {
        var tt = m_pi_2 * (t * t);
        var ss = Math.sin(tt);
        var cc = Math.cos(tt);
        C[1] = ss * m_1_pi;
        S[1] = (1 - cc) * m_1_pi;
        if (nk > 2) {
            C[2] = (t * ss - S[0]) * m_1_pi;
            S[2] = (C[0] - t * cc) * m_1_pi;
        }
    }
}

iD.util.evalXYaLarge = function (a, b) {
    var s = a > 0 ? +1 : -1;
    var absa = Math.abs(a);
    var z = m_1_sqrt_pi * Math.sqrt(absa);
    var ell = s * b * m_1_sqrt_pi / Math.sqrt(absa);
    var g = -0.5 * s * (b * b) / absa;
    var cg = Math.cos(g) / z;
    var sg = Math.sin(g) / z;

    var Cl, Sl, Cz, Sz;
    var result1 = this.FresnelCS(ell);
    var result2 = this.FresnelCS(ell + z);
    Cl = result1.C;
    Sl = result1.S;
    Cz = result2.C;
    Sz = result2.S;
    var dC0 = Cz - Cl;
    var dS0 = Sz - Sl;

    X = cg * dC0 - s * sg * dS0;
    Y = sg * dC0 + s * cg * dS0;
    return {
        X,
        Y
    }
}

iD.util.evalXYaLarge1 = function (nk, a, b, X, Y) {
    var s = a > 0 ? +1 : -1;
    var absa = Math.abs(a);
    var z = m_1_sqrt_pi * Math.sqrt(absa);
    var ell = s * b * m_1_sqrt_pi / Math.sqrt(absa);
    var g = -0.5 * s * (b * b) / absa;
    var cg = Math.cos(g) / z;
    var sg = Math.sin(g) / z;


    var Cl = new Array(nk),
        Sl = new Array(nk),
        Cz = new Array(nk),
        Sz = new Array(nk);

    this.FresnelCS1(nk, ell, Cl, Sl);
    this.FresnelCS1(nk, ell + z, Cz, Sz);

    var dC0 = Cz[0] - Cl[0];
    var dS0 = Sz[0] - Sl[0];
    X[0] = cg * dC0 - s * sg * dS0;
    Y[0] = sg * dC0 + s * cg * dS0;
    if (nk > 1) {
        cg /= z;
        sg /= z;
        var dC1 = Cz[1] - Cl[1];
        var dS1 = Sz[1] - Sl[1];
        var DC = dC1 - ell * dC0;
        var DS = dS1 - ell * dS0;
        X[1] = cg * DC - s * sg * DS;
        Y[1] = sg * DC + s * cg * DS;
        if (nk > 2) {
            var dC2 = Cz[2] - Cl[2];
            var dS2 = Sz[2] - Sl[2];
            DC = dC2 + ell * (ell * dC0 - 2 * dC1);
            DS = dS2 + ell * (ell * dS0 - 2 * dS1);
            cg = cg / z;
            sg = sg / z;
            X[2] = cg * DC - s * sg * DS;
            Y[2] = sg * DC + s * cg * DS;
        }
    }
}

iD.util.evalXYaSmall = function (a, b, p) {

    var nkk = 4 * p + 3;
    var X0 = [],
        Y0 = [];
    this.evalXYazero(nkk, b, X0, Y0);

    X = X0[0] - (a / 2) * Y0[2];
    Y = Y0[0] + (a / 2) * X0[2];

    var t = 1;
    var aa = -a * a / 8;
    for (var n = 1; n <= p; ++n) {
        t *= aa / (n * (2 * n - 1));
        var bf = a / (4 * n + 2);
        var jj = 4 * n;
        X += t * (X0[jj] - bf * Y0[jj + 2]);
        Y += t * (Y0[jj] + bf * X0[jj + 2]);
    }
    return {
        X,
        Y
    }
}
iD.util.evalXYaSmall1 = function (nk, a, b, p, X, Y) {

    var nkk = nk + 4 * p + 2;

    var X0 = [],
        Y0 = [];
    this.evalXYazero(nkk, b, X0, Y0);

    for (var j = 0; j < nk; ++j) {
        X[j] = X0[j] - (a / 2) * Y0[j + 2];
        Y[j] = Y0[j] + (a / 2) * X0[j + 2];
    }

    var t = 1;
    var aa = -a * a / 8;
    for (var n = 1; n <= p; ++n) {
        t *= aa / (n * (2 * n - 1));
        var bf = a / (4 * n + 2);
        for (var j = 0; j < nk; ++j) {
            var jj = 4 * n + j;
            X[j] += t * (X0[jj] - bf * Y0[jj + 2]);
            Y[j] += t * (Y0[jj] + bf * X0[jj + 2]);
        }
    }
}

iD.util.GeneralizedFresnelCS1 = function (nk, a, b, c, intC, intS) {

    // var intC = [],
    //     intS = [];
    if (Math.abs(a) < 0.01) this.evalXYaSmall1(nk, a, b, 5, intC, intS);
    else this.evalXYaLarge1(nk, a, b, intC, intS);

    var cosc = Math.cos(c);
    var sinc = Math.sin(c);

    for (var k = 0; k < nk; ++k) {
        var xx = intC[k];
        var yy = intS[k];
        intC[k] = xx * cosc - yy * sinc;
        intS[k] = xx * sinc + yy * cosc;
    }
}
iD.util.GeneralizedFresnelCS = function (a, b, c) {

    var xx, yy, result;
    if (Math.abs(a) < 0.01) {
        result = this.evalXYaSmall(a, b, 5);
        xx = result.X;
        yy = result.Y;
    } else {
        result = this.evalXYaLarge(a, b);
        xx = result.X;
        yy = result.Y;
    }


    var cosc = Math.cos(c);
    var sinc = Math.sin(c);

    intC = xx * cosc - yy * sinc;
    intS = xx * sinc + yy * cosc;
    return {
        intC,
        intS
    }
}

iD.util.buildClothoid = function (x0, y0, theta0, x1, y1, theta1) {
    const CF = [2.989696028701907, 0.716228953608281,
        -0.458969738821509, -0.502821153340377,
        0.261062141752652, -0.045854475238709
    ];
    // traslazione in (0,0)
    var dx = x1 - x0;
    var dy = y1 - y0;
    var r = Math.hypot(dx, dy);
    var phi = Math.atan2(dy, dx);

    var phi0 = theta0 - phi;
    var phi1 = theta1 - phi;

    while (phi0 > m_pi) phi0 -= m_2pi;
    while (phi0 < -m_pi) phi0 += m_2pi;
    while (phi1 > m_pi) phi1 -= m_2pi;
    while (phi1 < -m_pi) phi1 += m_2pi;

    var delta = phi1 - phi0;

    // punto iniziale
    var X = phi0 * m_1_pi;
    var Y = phi1 * m_1_pi;
    var xy = X * Y;
    Y *= Y;
    X *= X;
    var A = (phi0 + phi1) * (CF[0] + xy * (CF[1] + xy * CF[2]) + (CF[3] + xy * CF[4]) * (X + Y) + CF[5] * (X * X + Y * Y));

    // newton
    var g = 0,
        dg, intC = new Array(3),
        intS = new Array(3);
    var niter = 0;
    do {
        this.GeneralizedFresnelCS1(3, 2 * A, delta - A, phi0, intC, intS);
        g = intS[0];
        dg = intC[2] - intC[1];
        A -= g / dg;
    } while (++niter <= 10 && Math.abs(g) > 1E-12);

    var result = this.GeneralizedFresnelCS(2 * A, delta - A, phi0, intC[0], intS[0]);
    intC[0] = result.intC;
    intS[0] = result.intS;
    L = r / intC[0];

    k = (delta - A) / L;
    dk = 2 * A / L / L;

    return {
        k,
        dk,
        L
    }
}

iD.util.linspace = function (a, b, N) {
    var h = (b - a) / (N - 1);
    var xs = [];
    var x;
    var val;
    for (x = 0, val = a; x != N; ++x, val += h)
        xs[x] = val;
    return xs;
};

iD.util.pointsOnClothoid = function (x0, y0, theta0, kappa, dkappa, L, npts) {
    var k = 0;
    var t = this.linspace(0.0, L, npts);
    var locs = [];
    for (var i = 0; i < t.length; i++) {
        var C = [],
            S = [];
        this.GeneralizedFresnelCS1(1, dkappa * Math.pow(t[i], 2), kappa * t[i], theta0, C, S);
        // X[k] = x0 + t[i] * C[0];
        // Y[k] = y0 + t[i] * S[0];
        locs.push([x0 + t[i] * C[0], y0 + t[i] * S[0]])
        k++;
    }
    return locs;
}
iD.util.calcAngle = function (fStartLon, fStartLat, fEndLon, fEndLat) {
    var fAngle = 0;
    var PI = Math.PI;
    if (fEndLon != fStartLon) {
        var fAtan = (fEndLat - fStartLat) / (fEndLon - fStartLon);
        fAngle = Math.atan(fAtan);
        if (fEndLon - fStartLon < 0)
            fAngle += PI;
        else if (fAngle < 0)
            fAngle += 2 * PI;
    } else {
        if (fEndLat > fStartLat) {
            fAngle = PI / 2;
        } else if (fEndLat < fStartLat) {
            fAngle = PI / 2 * 3;
        } else if (fEndLat == fStartLat) {
            fAngle = 0;
        }
    }
    return fAngle;
}

iD.util.getCenterPoint = function (points) {
    var MIN_LAT = -90;
    var MAX_LAT = 90;
    var MIN_LNG = -180;
    var MAX_LNG = 180;
    // 经度最小值
    function getMinLongitude(points) {
        var minLongitude = MAX_LNG;
        minLongitude = points[0][0];
        points.forEach(p => {
            if (p[0] < minLongitude) {
                minLongitude = p[0];
            }
        })
        return minLongitude;
    }

    // 经度最大值
    function getMaxLongitude(points) {
        var maxLongitude = MIN_LNG;
        maxLongitude = points[0][0];
        points.forEach(p => {
            if (p[0] > maxLongitude) {
                maxLongitude = p[0];
            }
        })
        return maxLongitude;
    }

    // 纬度最小值
    function getMinLatitude(points) {
        var minLatitude = MAX_LAT;
        minLatitude = points[0][1];
        points.forEach(p => {
            // 纬度最小值
            if (p[1] < minLatitude)
                minLatitude = p[1];
        })
        return minLatitude;
    }

    // 纬度最大值
    function getMaxLatitude(points) {
        var maxLatitude = MIN_LAT;
        maxLatitude = points[0][1];
        points.forEach(p => {
            // 纬度最大值
            if (p[1] > maxLatitude)
                maxLatitude = p[1];
        })
        return maxLatitude;
    }

    // 1 自己计算
    var latitude = (getMinLatitude(points) + getMaxLatitude(points)) / 2;
    var longitude = (getMinLongitude(points) + getMaxLongitude(points)) / 2;
    return [longitude, latitude];

}

iD.util.FrontIntersection = function (k, node1, node2, p1, p2) {

    //测试前方交会算法

    var K = new ML_MATRIX.Matrix(k);
    //R1,C1
    var R1 = new ML_MATRIX.Matrix(node1.tags.R);
    var C1 = ML_MATRIX.Matrix.columnVector(node1.tags.C);
    //
    var R2 = new ML_MATRIX.Matrix(node2.tags.R);
    var C2 = ML_MATRIX.Matrix.columnVector(node2.tags.C);
    //像素坐标
    var m1 = ML_MATRIX.Matrix.columnVector(p1);
    var m2 = ML_MATRIX.Matrix.columnVector(p2);

    var utm1 = iD.util.LLtoUTM_(node1.loc[0], node1[1]);
    //
    var RS = [];
    var CS = [];
    var ms = [];
    //
    CS.push(C1, C2);
    RS.push(R1, R2);
    ms.push(m1, m2);
    //
    var p_nums = CS.length;
    //多项前方交会
    if (p_nums > 1) {
        var AbMatrix = new ML_MATRIX.Matrix(p_nums * 2, 4);
        for (var i = 0; i < p_nums; i++) {
            //
            var RT = new ML_MATRIX.Matrix(3, 4);
            var T = RS[i].mmul(CS[i]).mul(-1);
            RT.setSubMatrix(RS[i], 0, 0);
            RT.setSubMatrix(T, 0, 3);
            var P = K.mmul(RT);
            var pixel = ms[i];

            var u = pixel.get(0, 0);
            var v = pixel.get(1, 0);
            var row0 = P.subMatrix(0, 0, 0, 3);
            var row1 = P.subMatrix(1, 1, 0, 3);
            var row2 = P.subMatrix(2, 2, 0, 3);

            AbMatrix.setSubMatrix(ML_MATRIX.Matrix.sub(row0, ML_MATRIX.Matrix.mul(row2, u)), i * 2, 0);
            AbMatrix.setSubMatrix(ML_MATRIX.Matrix.sub(row1, ML_MATRIX.Matrix.mul(row2, v)), i * 2 + 1, 0);
            //

        }
        //
        var AMatrix = AbMatrix.subMatrix(0, p_nums * 2 - 1, 0, 2);
        var bMatrix = AbMatrix.subMatrix(0, p_nums * 2 - 1, 3, 3).mul(-1);
        //
        //最小二乘求解线型方程组，X就是所求的UTM坐标
        var X = ML_MATRIX.solve(AMatrix, bMatrix, true);
        var Xutm = X.data;
        var loc = iD.util.UTMtoLL_(Xutm[0], Xutm[1], utm1.zoneNumber, utm1.designator);
        loc.push(...Xutm[2]);
        return loc
    }

}
/**
 * @description: 
 * @param {type} 
 * @return: 
 */
iD.util.getPlyZ = function (context, loc) {
    if (!(loc instanceof Array) && loc) {
        loc = loc.loc;
    }
    var trackGround;
    if (context.ply) {
        trackGround = context.ply;
    } else {
        trackGround = iD.util.getGeometryPlyForLoc(context, loc)
    }
    let heigth = 10000;
    if (context.measuringTrack) {
        let nodes = context.measuringTrack.nodes
        let locs = _.pluck(nodes, 'loc');
        let dist = iD.util.pt2LineDist2(locs, loc);
        let node = nodes[dist.i];
        if (dist.dis < 10) {
            heigth = node.loc[2] + 0.5;
        } else {
            let _h = iD.util.getHeight(loc);
            heigth = _h + 2;
        }
    }
    if (context && trackGround) {
        let x1 = [loc[0], loc[1], heigth];
        let x2 = [loc[0], loc[1], -10000];
        xyz = iD.util.groundPlaneMeasurer(x1, x2, trackGround);
        if (xyz) {
            return xyz[2];
        }
    }
    return null;
}

iD.util.getPixe2Loc = function (context, trackNode, xy, K, player) {
    if (!xy || !context || !trackNode) return false;

    let utm = iD.util.LLtoUTM_(trackNode.loc[0], trackNode.loc[1]);
    // var point = this.clickPosForTrackPoint2(trackNode, xy, player.getCameraHeight(), K);
    var point = iD.util.clickPosForTrackPoint2(trackNode, xy, player.getCameraHeight(), K);
    let z = point[2] - player.getCameraHeight();
    var lonlat = this.picPixelToLonLat(_.clone(K), trackNode, utm.zoneNumber, utm.designator, xy, z);
    let bounds = this.getBounds(lonlat, 5);
    let locs = [];

    locs.push([bounds[0][0], bounds[1][1]]);
    locs.push(bounds[1]);
    locs.push([bounds[1][0], bounds[1][1]]);
    locs.push(bounds[0]);
    for (let i = 0; i < locs.length; i++) {
        let mesh = iD.util.getGeometryPlyForLoc(context, locs[i]);
        let geometry = iD.util.trackGroundPlaneMeasurer(K, trackNode, xy, mesh);
        if (geometry) {
            return geometry;
        }
    }
    return false;
},

    /**
     * 通过点击位置获取ply的mesh
     */
    iD.util.getGeometryPlyForLoc = function (context, loc, zoom = 18) {
        let z = context.ply_level;
        let tile = iD.util.getTileURL(loc, z);
        let plyTileId = tile[0] + '_' + tile[1] + '-' + iD.Task.d.tags.laserSplitPly;
        return context.inflight[plyTileId];

    }

iD.util.getTileURL = function (loc, zoom) {
    var xtile = parseInt(Math.floor((loc[0] + 180) / 360 * (1 << zoom)));
    var ytile = parseInt(Math.floor((1 - Math.log(Math.tan(loc[1] * Math.PI / 180) + 1 / Math.cos(loc[1] * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom)));
    return [xtile, ytile, zoom];
}

iD.util.stringSwitch = function (url) {
    return url.replace(/\{switch:([^}]+)\}/, function (s, r) {
        var subdomains = r.split(',');
        return subdomains[Math.floor(Math.random() * 10) % subdomains.length];
    });
}
/**
 * @description: 判断元素是否是矩形类型，通过数据模型判断
 * @param {type}  元素
 * @return: true 矩形，  false非矩形
 */
iD.util.entityIsRect = function (entity) {
    return entity.tags.TYPE == 3 && ![7, 9].includes(parseInt(entity.tags.SUBTYPE));
}

iD.util.test = function (track_point, heigth) {
    var node1 = _pic.allNodes[1];
    var node2 = _pic.allNodes[2];
    var cameraHeight = _pic.wayInfo.cameraHeight;
    var utm1 = iD.util.LLtoUTM_(node1.loc[0], node1.loc[1]);
    var utm2 = iD.util.LLtoUTM_(node2.loc[0], node2.loc[1]);

    var c0 = [[utml1.x], [utml1.y], [node1.loc[2] - cameraHeight]];
    var C0 = new ML_MATRIX.Matrix(c0);

    var c1 = [[utm2.x], [utm2.y], [node2.loc[2] - cameraHeight]];
    var C1 = new ML_MATRIX.Matrix(c1);

    var dis = iD.util.norm(C0.data, C1.data);

    var Y = iD.util.normalizedSqrt(C1.sub(C0).data);


    t1 = new ML_MATRIX.Matrix([C0.data[0], C0.data[1]]);
    t2 = new ML_MATRIX.Matrix([C1.data[0], C1.data[1]]);

    var n1 = iD.util.normalizedSqrt(t2.sub(t1));
    var v_p2_origin = t2.sub(t1);

    var rotation_right = (-90 * Math.PI / 180);
    var p2_right_rotation = v_p2_origin.mul(rotation_right);

    var p2_right_final = p2_right_rotation.add(t1);

    var p1_right_n = iD.util.normalizedSqrt(p2_right_final.sub(t1).data);

    var X = new ML_MATRIX.Matrix([[p1_right_n[0]], [p1_right_n[0]], [0]]);
    var N = matrix.cross(X.data, Y);
    N = iD.util.normalizedSqrt(N);
}

//三角面顺逆时针
// iD.util.getClockWise = function (locs,p){
//     if(locs.length < 3) return true;

//     let p1 = locs[0];
//     let p2 = locs[1];
//     let p3 = locs[2];

//     function getTriangleNormal() {
//         let n1 = matrix.subtraction(p2, p1);
//         let n2 = matrix.subtraction(p3, p1);
//         return matrix.cross(n1,n2);
//     }

//     function dotProduct() {
//         let normal = getTriangleNormal();
//         let temp = matrix.dotproduct(matrix.scalar(normal,-1),p1);
//         return temp;
//     }

//     function getCentriod() {
//         let t1 = matrix.addition(p1,p2);
//         let t2 = matrix.addition(t1,p3);
//         let res = [];
//         t2.forEach(d=>{
//             res.push(d/3);
//         })
//         return res;
//     }

//     let dot_product = dotProduct();
//     let normal = getTriangleNormal();

//     let centriod = getCentriod();
//     let temp = matrix.dotproduct(normal,centriod);
//     let t2 = matrix.addition(temp,dot_product);
//     // let t3 = matrix.addition(temp,dot_product);
//     // let temp = matrix.dotproduct(matrix.scalar(normal,-1),p1)+ dot_product;
// }

/**
 * @description: 
 * @param {type} 
 * @return:  -1 条件错误  1 顺时针   0 逆时针
 */
iD.util.getClockWise = function (locs, p) {
    if (locs.length < 3) return -1;

    function getTriangleNormal(point1, point2, point3) {
        let n1 = matrix.subtraction(point2, point1);
        let n2 = matrix.subtraction(point3, point1);
        return matrix.cross(n1, n2);
    }
    let utm1 = iD.util.LLtoUTM_(locs[0][0], locs[0][1]);
    let utm2 = iD.util.LLtoUTM_(locs[1][0], locs[1][1]);
    let utm3 = iD.util.LLtoUTM_(locs[2][0], locs[2][1]);

    let p1 = [utm1.x, utm1.y, locs[0][2]];
    let p2 = [utm2.x, utm2.y, locs[1][2]];
    let p3 = [utm3.x, utm3.y, locs[2][2]];

    let x1 = this.UTMProjection(p);
    // let x2 = this.UTMProjection(locs[0]);

    let normal = getTriangleNormal(p1, p2, p3);
    // let utm = iD.util.LLtoUTM_(loc2[0], loc2[1]);
    let direction = this.normalized(x1, p1);

    let DdN = matrix.dotproduct(normal, direction);
    if (DdN > 0) {
        return 1;
    } else {
        return 0;
    }
    return DdN;
}


/**
 * @description: 根据轨迹计算 点集合方向
 * @param {type} 
 * @return: -1 条件错误  1 顺时针   0 逆时针
 */
iD.util.getNodesClockWise = function (trackNodes, nodes) {
    if (trackNodes.length < 2 || nodes.length < 3) return -1;
    let locs = _.pluck(nodes, 'loc');
    let loc1 = nodes[0].loc;
    let trackLocs = _.pluck(trackNodes, 'loc');
    let dist = iD.util.pt2LineDist2(trackLocs, loc1);
    let startIdx = dist.i - 10;
    if (startIdx < 0) startIdx = 0;
    return iD.util.getClockWise(locs, trackLocs[startIdx]);
}

/**
 * @description: 根据轨迹计算 坐标集合方向
 * @param {type} 
 * @return: -1 条件错误  1 顺时针   0 逆时针
 */
iD.util.getCoordinatesClockWise = function (trackNodes, locs) {
    if (trackNodes.length < 2 || locs.length < 3) return -1;
    let loc1 = locs[0];
    let trackLocs = _.pluck(trackNodes, 'loc');
    let dist = iD.util.pt2LineDist2(trackLocs, loc1);
    let startIdx = dist.i - 10;
    if (startIdx < 0) startIdx = 0;
    return iD.util.getClockWise(locs, trackLocs[startIdx]);
}

/*
 * 定位激光面板相机视角
 * @param viewer：场景视野
 *        _p：视频当前帧
 *        _K: 轨迹相机K矩阵
*/
iD.util.locationPotree = function (viewer, _p, _K) {
    var screen_width = viewer.renderArea.clientWidth,
        screen_height = viewer.renderArea.clientHeight;
    var projectionMatrix = iD.util.buildProjectionMatrix(_K, 2448, 2048)
    // var camera = viewer.scene.getActiveCamera();
    var camera = viewer.scene.cameraP;
    var topCamera = viewer.scene.topCamera;
    var sideCamera = viewer.scene.sideCamera;
    var frontCamera = viewer.scene.frontCamera;
    var _cameraProjMatrix = projectionMatrix.flat();
    iD.util.initCameraProjection(_cameraProjMatrix, camera);
    var vm = iD.util.buildModelAndView(_p.tags.R, _p.tags.C, _p.tags.T);
    vm = vm.flat();
    //			var C = [[457060.8286223448],[4427905.998574111],[27.0924]];//1帧
    //			var C = [[457109.8478512518],[4427963.0344656445],[26.654]];//262帧
    //			var C = [[457193.20001930033],[4428059.614782721],[25.8947]];//725帧
    iD.util.updateCameraPose(vm, camera, _p.tags.C)
    // iD.util.updateCameraPose(vm, topCamera, _p.tags.C)
    // iD.util.updateCameraPose(vm, sideCamera, _p.tags.C)
    // iD.util.updateCameraPose(vm, frontCamera, _p.tags.C)
}

iD.util.updateCameraPose = function (_modelViewMatrix, _camera, _c) {
    var mv = _modelViewMatrix;
    var R = new THREE.Matrix3();
    R.set(mv[0], mv[1], mv[2], mv[4], mv[5], mv[6], mv[8], mv[9], mv[10]);

    var t = new THREE.Vector3(mv[3], mv[7], mv[11]);
    var Rt = R.clone();
    Rt.transpose();
    Rt.multiplyScalar(-1);
    t.applyMatrix3(Rt);

    let C = new THREE.Vector3(..._c.flat());
    var p = new THREE.Vector3();

    viewer.scene.view.position = new THREE.Vector3(C.x, C.y, C.z);
    //
    var L = new THREE.Vector3(-mv[8], -mv[9], -mv[10]);
    var s = new THREE.Vector3(mv[0], mv[1], mv[2]);
    var u = new THREE.Vector3();
    u.crossVectors(s, L);
    u.multiplyScalar(-1);
    p.addVectors(C, L);
    // console.log("p---",p)
    _camera.up = u;
    viewer.scene.view.lookAt(p);
    _camera.position.copy(p);

    //ju
    // C=[457060.8286223448,4427905.998574111,27.0924];

    // viewer.scene.view.position=new THREE.Vector3(C[0],C[1],C[2]);

    // let L=new THREE.Vector3( -0.6603511893466202, -0.7509703466469827, -0.003419634391880314);
    // let s = new THREE.Vector3(0.7508265314191365, -0.6601195430542942, -0.02309849970266569);
    // let up = new THREE.Vector3();
    // up.crossVectors(s, L);

    // let P=new THREE.Vector3().addVectors(viewer.scene.view.position,L.multiplyScalar(-100));

    // let camera=viewer.scene.getActiveCamera();
    // camera.up=up;
    // viewer.scene.view.lookAt(P);
}

iD.util.addNode = function (x, y, z, color = 0xCC0000) {
    var shapeNode = new THREE.Object3D();
    viewer.scene.scene.add(shapeNode);
    let sg = new THREE.SphereGeometry(1, 18, 18);
    // let sm = new THREE.MeshNormalMaterial({
    //     color:color
    // }
    // );
    let material = new THREE.MeshStandardMaterial({
        color: color,
        shading: THREE.FlatShading,
        metalness: 0.2
    });
    let s = new THREE.Mesh(sg, material);

    // let pos = toScene.forward([x, y]);
    // s.position.set(...pos, z);
    s.position.set(x, y, z);
    s.scale.set(2, 2, 2);
    shapeNode.add(s)
}

iD.util.initCameraProjection = function (_cameraProjMatrix, _camera) {

    var x = _cameraProjMatrix[0];
    var y = _cameraProjMatrix[5];
    var a = _cameraProjMatrix[2];
    var b = _cameraProjMatrix[6];
    var c = _cameraProjMatrix[10];
    var d = _cameraProjMatrix[11];
    //
    //debug("x,y,a,b,c,d=" + x + "," + y + "," + a + "," + b + "," + c + "," + d);
    //
    var k = (c - 1.0) / (c + 1.0);
    var near = (d * (1.0 - k)) / (2.0 * k);
    var far = k * near;
    //
    var l = 2 * near;
    var left = l * (a - 1.0) / (2 * x);
    var right = l * (a + 1.0) / (2 * x);
    var top = l * (b + 1.0) / (2 * y);
    var bottom = l * (b - 1.0) / (2 * y);
    //
    var width = right - left;
    var height = top - bottom;
    //
    var left0 = -width * 0.5;
    var top0 = 0.5 * height;
    //
    var offsetX = left - left0;
    var offsetY = top0 - top;
    //
    //debug("offset x,y=" + offsetX + "," + offsetY);
    //
    var aspect = width / height;
    var fov = 2 * Math.atan(top0 / near) * 180 / Math.PI;
    //
    //
    _camera.fov = fov;
    _camera.aspect = aspect;
    _camera.near = near;
    _camera.far = far;

    // console.log("fov:", fov);
    // console.log("aspect:", aspect);
    // console.log("near:", near);
    // console.log("far:", far);

    //
    var new_top = near * Math.tan((Math.PI / 180.0) * 0.5 * fov) / 1.0;
    var new_height = 2 * new_top;
    var new_width = aspect * new_height;
    //
    _camera.setViewOffset(new_width, new_height, offsetX, offsetY, new_width, new_height);
    //
}

iD.util.getCameraLoc = function (viewer) {
    let camera = viewer.scene.getActiveCamera();

    let pPos = new THREE.Vector3(0, 0, 0).applyMatrix4(camera.matrixWorld);
    let pRight = new THREE.Vector3(600, 0, 0).applyMatrix4(camera.matrixWorld);
    let pUp = new THREE.Vector3(0, 600, 0).applyMatrix4(camera.matrixWorld);
    let pTarget = viewer.scene.view.getPivot();

    let toCes = (pos) => {
        let xy = [pos.x, pos.y];
        let height = pos.z;
        let deg = toMap.forward(xy);
        deg.push(height);
        return deg;
    };

    let cPos = toCes(pPos);
    let cUpTarget = toCes(pUp);
    let cTarget = toCes(pTarget);
    console.log(cPos, cUpTarget, cTarget)
    return cUpTarget;
}

//相机的投影矩阵
iD.util.buildProjectionMatrix = function (K, screen_width, screen_height) {
    var near = 0.01; // Near clipping distance
    var far = 100.0; // Far clipping distance

    // Camera parameters
    var f_x = K[0][0]; // Focal length in x axis
    var f_y = K[1][1]; // Focal length in y axis (usually the same?)
    var c_x = K[0][2]; // Camera primary point x
    var c_y = K[1][2]; // Camera primary point y
    // //
    // projectionMatrix(0, 0) = 2.0 * f_x / screen_width;
    // projectionMatrix(1, 0) = 0.0;
    // projectionMatrix(2, 0) = 0.0;
    // projectionMatrix(3, 0) = 0.0;

    // projectionMatrix(0, 1) = 0.0;
    // projectionMatrix(1, 1) = 2.0 * f_y / screen_height;
    // projectionMatrix(2, 1) = 0.0;
    // projectionMatrix(3, 1) = 0.0;
    // //当主点在相机中心的时候，下面两个值为0
    // projectionMatrix(0, 2) = 2.0 * c_x / screen_width - 1.0;
    // projectionMatrix(1, 2) = 2.0 * c_y / screen_height - 1.0;
    // //
    // projectionMatrix(2, 2) = -(far + near) / (far - near);
    // projectionMatrix(3, 2) = -1.0;
    // //
    // projectionMatrix(0, 3) = 0.0;
    // projectionMatrix(1, 3) = 0.0;
    // projectionMatrix(2, 3) = -2.0 * far * near / (far - near);
    // projectionMatrix(3, 3) = 0.0;

    return [
        [2.0 * f_x / screen_width, 0.0, -(2.0 * c_x / screen_width - 1.0), 0.0],
        [0.0, 2.0 * f_y / screen_height, 2.0 * c_y / screen_height - 1.0, 0.0],
        [0.0, 0.0, -(far + near) / (far - near), -2.0 * far * near / (far - near)],
        [0.0, 0.0, -1.0, 0.0]
    ]
}

iD.util.buildModelAndView = function (_R, _C, _T) {
    // var T;
    // //转换到相对第一帧的平移位置
    // var C0_ = new THREE.Vector3(0, 0, 0);
    // var C = new THREE.Vector3( _C[0], _C[1], _C[2]);
    // var new_C = _C + C0_.multiplyScalar(-1);

    // var R = new THREE.Matrix3();
    // R.set(_R[0], _R[3], _R[6],  _R[1], _R[4], _R[7],  _R[2], _R[5], _R[8]);

    // //
    // T = -1.0 * (R * new_C);
    // //
    // var MV = new THREE.Matrix4()
    // //
    // var rx = new THREE.Matrix3();
    //
    // rx.set(1, 0, 0,
    //     0, -1, 0,
    //     0, 0, -1);
    // //
    // MV.block(0, 0, 3, 3) = rx * R;
    // MV.block(0, 3, 3, 1) = rx * T;
    let rx = [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, -1]
    ]
    let rxr = matrix.multiply(rx, _R);
    let rxt = matrix.multiply(rx, _T);
    let r = _.clone(rxr);
    r[0].push(rxt[0][0]);
    r[1].push(rxt[1][0]);
    r[2].push(rxt[2][0]);
    r.push([0, 0, 0, 1]);
    return r;
    return [
        [0.7508265314191365, -0.6601195430542942, -0.02309849970266569, 2579774.513657832],
        [0.015088920836555327, -0.017820673979954873, 0.9997273455358275, 71984.6295407666],
        [-0.6603511893466202, -0.7509703466469827, -0.003419634391880314, 3627046.857100074],
        [0, 0, 0, 1]
    ]
    return MV;
}

/**
 * 20190621
 * 车道线是不是虚线，虚线时除全部节点在范围外才算作范围外
 * @param {Object} context 
 * @param {Object} entity 
 */
iD.util.dividerIsDashedOut = function (context, entity) {
    if (!context || entity.modelName != iD.data.DataType.DIVIDER) return false;
    // var graph = context.graph();
    // var da = iD.util.getDividerParentRelation(graph, entity, iD.data.DataType.DIVIDER_ATTRIBUTE);
    // // DA 通行类型为虚线
    // if(!da || da.tags.DRIVE_RULE != '2') return false;
    // var nodeid = _.find(da.members, {modelName: iD.data.DataType.DIVIDER_NODE}).id;
    // var node = context.entity(nodeid);
    // // 点类型为 虚线起/终点
    // if(!['1', '2'].includes(node.tags.DASHTYPE+'')) return false;

    // 终点、中间点、实线（被裁剪）可以拖拽到范围外
    // 范围外的第一个点/最后一个点，是终点、中间点时，认为整体是虚线
    var fenodes = [
        context.entity(entity.nodes[0]),
        context.entity(_.last(entity.nodes))
    ];
    var flag = false;
    for (let node of fenodes) {
        if (iD.util.nodeInPlyGonx(node, context)) {
            continue;
        }
        if (['1', '2', '3'].includes('' + node.tags.DASHTYPE)) {
            flag = true;
        }
    }
    return flag;
}

/**
 * 判断车道是否可通行
 * tagExtend.updateAcceTagOfNMaat
 * @param {Graph} graph 
 * @param {Way} fromWay 
 * @param {Way} toWay 
 * @param {Node} node 共点
 */
iD.util.laneDirectionConnectAccessable = function (graph, fromWay, toWay, node) {
    if (!fromWay || !toWay || !node) return flag;
    var nodeId = node.id;

    var flag = false;
    if (fromWay.id == toWay.id) {
        return flag;
    }

    var anode = graph.entity(fromWay.first());
    var bnode = graph.entity(fromWay.last());
    // from方向
    var ans = (function (d) {
        if (d == 1) {
            return [anode.id, bnode.id];
        } else if (d == 2) {
            return [bnode.id];
        } else if (d == 3) {
            return [anode.id];
        } else if (d == 4) {
            return [];
        }
        return [];
    })(fromWay.tags.DIRECTION);
    if (!ans.includes(nodeId)) {
        return flag;
    }

    // 禁行
    if (fromWay.tags.DIRECTION == '4' || toWay.tags.DIRECTION == '4') {
        return flag;
    }
    // 方向不匹配（正向、逆向）
    if (fromWay.tags.DIRECTION != toWay.tags.DIRECTION) {
        if (fromWay.tags.DIRECTION == '1' || toWay.tags.DIRECTION == '1') {
            // 双向
        } else {
            return flag;
        }
    }
    if (fromWay.tags.DIRECTION == '1') {
        //可通行
        // case 1: toWay为双向通行；
        // case 2: toWay的起始结点为maat路口，道路正向通行
        // case 3: toWay的尾结点为maat路口，道路为反向通行
        if (!(toWay.tags.DIRECTION == "1" || (toWay.first() == nodeId && toWay.tags.DIRECTION == "2")
            || (toWay.last() == nodeId && toWay.tags.DIRECTION == "3"))) {
            return flag;
        }
    } else if (fromWay.tags.DIRECTION == '2') {
        //进入道路的伪结点是maat路口
        if (fromWay.last() == nodeId) {
            //可通行
            // case 1: toWay为双向通行；
            // case 2: toWay的起始结点为maat路口，道路正向通行
            // case 3: toWay的尾结点为maat路口，道路为反向通行
            if (!(toWay.tags.DIRECTION == "1" || (toWay.first() == nodeId && toWay.tags.DIRECTION == "2")
                || (toWay.last() == nodeId && toWay.tags.DIRECTION == "3"))) {
                return flag;
            }
        } else if (fromWay.first() == nodeId) {
            return flag;
        }
    } else if (fromWay.tags.DIRECTION == '3') {
        //进入道路的伪结点是maat路口
        if (fromWay.last() == nodeId) {
            return flag;
        } else if (fromWay.first() == nodeId) {
            //可通行
            // case 1: toWay为双向通行；
            // case 2: toWay的起始结点为maat路口，道路正向通行
            // case 3: toWay的尾结点为maat路口，道路为反向通行
            if (!(toWay.tags.DIRECTION == "1" || (toWay.first() == nodeId && toWay.tags.DIRECTION == "2")
                || (toWay.last() == nodeId && toWay.tags.DIRECTION == "3"))) {
                return flag;
            }
        }
    }

    return true;
}

/**
 * 三点不能共线
 * @param {Array} pt 
 */
iD.util.get3DPointsCenter = function (pt) {
    // 两点不能相同
    if (_.isEqual(pt[0], pt[1])
        || _.isEqual(pt[1], pt[2])
        || _.isEqual(pt[0], pt[2])) {
        return false;
    }
    var a1, b1, c1, d1;
    var a2, b2, c2, d2;
    var a3, b3, c3, d3;

    var x1 = pt[0].x, y1 = pt[0].y, z1 = pt[0].z;
    var x2 = pt[1].x, y2 = pt[1].y, z2 = pt[1].z;
    var x3 = pt[2].x, y3 = pt[2].y, z3 = pt[2].z;

    a1 = (y1 * z2 - y2 * z1 - y1 * z3 + y3 * z1 + y2 * z3 - y3 * z2);
    b1 = -(x1 * z2 - x2 * z1 - x1 * z3 + x3 * z1 + x2 * z3 - x3 * z2);
    c1 = (x1 * y2 - x2 * y1 - x1 * y3 + x3 * y1 + x2 * y3 - x3 * y2);
    d1 = -(x1 * y2 * z3 - x1 * y3 * z2 - x2 * y1 * z3 + x2 * y3 * z1 + x3 * y1 * z2 - x3 * y2 * z1);

    a2 = 2 * (x2 - x1);
    b2 = 2 * (y2 - y1);
    c2 = 2 * (z2 - z1);
    d2 = x1 * x1 + y1 * y1 + z1 * z1 - x2 * x2 - y2 * y2 - z2 * z2;

    a3 = 2 * (x3 - x1);
    b3 = 2 * (y3 - y1);
    c3 = 2 * (z3 - z1);
    d3 = x1 * x1 + y1 * y1 + z1 * z1 - x3 * x3 - y3 * y3 - z3 * z3;

    var x, y, z;
    x = -(b1 * c2 * d3 - b1 * c3 * d2 - b2 * c1 * d3 + b2 * c3 * d1 + b3 * c1 * d2 - b3 * c2 * d1)
        / (a1 * b2 * c3 - a1 * b3 * c2 - a2 * b1 * c3 + a2 * b3 * c1 + a3 * b1 * c2 - a3 * b2 * c1);
    y = (a1 * c2 * d3 - a1 * c3 * d2 - a2 * c1 * d3 + a2 * c3 * d1 + a3 * c1 * d2 - a3 * c2 * d1)
        / (a1 * b2 * c3 - a1 * b3 * c2 - a2 * b1 * c3 + a2 * b3 * c1 + a3 * b1 * c2 - a3 * b2 * c1);
    z = -(a1 * b2 * d3 - a1 * b3 * d2 - a2 * b1 * d3 + a2 * b3 * d1 + a3 * b1 * d2 - a3 * b2 * d1)
        / (a1 * b2 * c3 - a1 * b3 * c2 - a2 * b1 * c3 + a2 * b3 * c1 + a3 * b1 * c2 - a3 * b2 * c1);

    var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y) + (z1 - z) * (z1 - z));
    // 三种计算方式结果相同
    // var r1 = Math.sqrt((x1 - x)*(x1 - x) + (y1 - y)*(y1 - y) + (z1 - z)*(z1 - z));
    // var r2 = Math.sqrt((x2 - x)*(x2 - x) + (y2 - y)*(y2 - y) + (z2 - z)*(z2 - z));
    // var r3 = Math.sqrt((x3 - x)*(x3 - x) + (y3 - y)*(y3 - y) + (z3 - z)*(z3 - z));
    // console.log(x, y, z);
    // console.log(r);
    return {
        r: r,
        position: [x, y, z]
    };
}

/**
 * 3D线段延长线上某一点的坐标（未测试）
 */
iD.util.get3DExtentLinePoint = function (StartPoint, EndPoint, opt) {
    /*
     * 空间直线没有斜率的概念，以上代码基于空间直线确定公式（如下）实现： 
     * 通过点(x1,y1,z1),(x2,y2,z2)的直线为 
     * (x-x1)/(x2-x1)=(y-y1)/(y2-y1)=(z-z1)/(z2-z1)
     */
    if (!opt) return;
    var x, y, z, result;
    if (opt.x != null) {
        x = opt.x;
        result = (x - StartPoint[0]) / (EndPoint[0] - StartPoint[0]);
        y = result * (EndPoint[1] - StartPoint[1]) + StartPoint[1];
        z = result * (EndPoint[2] - StartPoint[2]) + StartPoint[2];
    } else if (opt.y != null) {
        y = opt.y;
        result = (y - StartPoint[1]) / (EndPoint[1] - StartPoint[1]);
        x = result * (EndPoint[0] - StartPoint[0]) + StartPoint[0];
        z = result * (EndPoint[2] - StartPoint[2]) + StartPoint[2];
    } else if (opt.z != null) {
        z = opt.z;
        result = (z - StartPoint[2]) / (EndPoint[2] - StartPoint[2]);
        x = result * (EndPoint[0] - StartPoint[0]) + StartPoint[0];
        y = result * (EndPoint[1] - StartPoint[1]) + StartPoint[1];
    }
    return [x, y, z];
}

var Base64Binary = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function (input) {
        var bytes = (input.length / 4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    removePaddingChars: function (input) {
        var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
        if (lkey == 64) {
            return input.substring(0, input.length - 1);
        }
        return input;
    },

    decode: function (input, arrayBuffer) {
        //get last chars to see if are valid
        input = this.removePaddingChars(input);
        input = this.removePaddingChars(input);

        var bytes = parseInt((input.length / 4) * 3, 10);

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < bytes; i += 3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i + 1] = chr2;
            if (enc4 != 64) uarray[i + 2] = chr3;
        }

        return uarray;
    }
}

// 三个点可以判断矢量是顺时针旋转还是逆时针旋转的，但由于可能存在凹边，所以并不是任意三点都可以正确反映多边形的走向
// 因此需要取多边形中绝对是凸边的点来判断，
// 多边形中的极值点（x最大或x最小或y最大或y最小）它与相邻两点构成的边必然是凸边，因此我们先取出多边形中的极值点，再由极值点和其前后两点去判断矢量的走向，从而判断出多边形的走向。
iD.util.isCoordShun2 = function (coords) {
    if (coords.length < 3) {
        return null;
    }
    if (coords[0] == coords[coords.length - 1]) {
        coords = coords.slice(0, coords.length - 1);
    }
    coords = coords.reverse();
    var maxXIndex = 0;
    var maxX = parseFloat(coords[maxXIndex][0]);
    var c1, c2, c3;
    var x1, y1, x2, y2, x3, y3;
    for (var i = 0; i < coords.length; i++) {
        if (parseFloat(coords[i][0]) > maxX) {
            maxX = parseFloat(coords[i][0]);
            maxXIndex = i;
        }
    }
    if (maxXIndex == 0) {
        c1 = coords[coords.length - 1];
        c2 = coords[maxXIndex];
        c3 = coords[maxXIndex + 1];
    } else if (maxXIndex == coords.length - 1) {
        c1 = coords[maxXIndex - 1];
        c2 = coords[maxXIndex];
        c3 = coords[0];
    } else {
        c1 = coords[maxXIndex - 1];
        c2 = coords[maxXIndex];
        c3 = coords[maxXIndex + 1];
    }
    x1 = parseFloat(c1[0]);
    y1 = parseFloat(c1[1]);
    x2 = parseFloat(c2[0]);
    y2 = parseFloat(c2[1]);
    x3 = parseFloat(c3[0]);
    y3 = parseFloat(c3[1]);
    var s = ((x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3));
    return s < 0;//true顺时针  false逆时针
}

/**
 * 裁剪canvas,用于路牌批量修改，图像裁剪
 * points: 绘制像素坐标（图像拖拽节点输入原图像素坐标）
 * entityId: 要素ID(激光传入的是osmID)
 * context: 上下文
 * isCut: 是否裁剪(激光传入时不裁剪)
 * isScale:是否按照比例获取原图像素坐标(图像拖拽时为false)
 */
iD.util.cutPic = function (points, entityId, context, isCut = true, isScale = true) {
    
    return false;

    var player = iD.picUtil.player, pixels = [];

    if (isScale) {
        var scaleX = player.pic_point.tags.picW / player.pics[0][0].offsetWidth;
        var scaleY = player.pic_point.tags.picH / player.pics[0][0].offsetHeight;
    } else {
        var scaleX = 1;
        var scaleY = 1;
    }

    var startX = points[0][0] * scaleX;
    var startY = points[0][1] * scaleY;
    var crossX = points[2][0] * scaleX;
    var crossY = points[2][1] * scaleY;
    var width = Math.abs(crossX - startX);
    var height = Math.abs(crossY - startY);

    points.forEach(function (p) {
        pixels.push({
            pixelX: p[0] * scaleX,
            pixelY: p[1] * scaleY
        })
    })

    
    pixels = pixels.reverse();

    if (isCut) {
        var entity = context.hasEntity(entityId),
            osmId = (entity && entity.osmId()) || entityId,
            graph = context.graph(),
            nodes = graph.childNodes(entity), trackId, trackPointId;

        for (let i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var relations = graph.parentRelations(node);
            if (relations.length) {
                let index = _.findIndex(relations, { modelName: "MEASUREINFO" });
                if (index != -1) {
                    let measureinfo = relations[index];
                    var PARAMETER = JSON.parse(measureinfo.tags.PARAMETER);
                    trackId = PARAMETER.Paras.nodes[0].trackId;
                    trackPointId = PARAMETER.Paras.nodes[0].trackPointId;
                    break;
                }
            }
        };
    } else {
        let osmId = entityId;
        context.variable.saveTrafficsignSrc[osmId] = {
            src: '',
            pixels
        }
        return;
    }

    if (!trackId && !trackPointId) {
        return;
    }

    var nCanvas = document.createElement('canvas');
    // nCanvas.width = width ;
    // nCanvas.height = height;
    nCanvas.width = width + 60;
    nCanvas.height = height + 60;


    let image = new Image(),
        picUrlParam = iD.picUtil.player.getPicUrlParam(),
        param = picUrlParam[picUrlParam.type];
    let imgURL = iD.config.URL.hbase_plys + 'hbase-support/image/track/query?namespace=image_material&trackId=' + trackId + '&trackPointId=' + trackPointId;
    imgURL = iD.util.stringSwitch(imgURL);
    for (var key in param) {
        var value = param[key];
        imgURL += ('&' + key + '=' + value);
    }
    // image.crossOrigin = 'anonymous';
    var drawX = points[0][0], drawY = points[0][1];
    for (var i = 1, l = points.length; i < l; ++i) {
        drawX = Math.min(drawX, points[i][0]);
        drawY = Math.min(drawY, points[i][1]);
    }
    image.setAttribute("crossOrigin", 'anonymous');//TODO 跨域访问图片时，需要设置跨域头，并且要放在src前
    image.src = imgURL;
    image.addEventListener("load", function () {
        var nCtx = nCanvas.getContext('2d');
        nCtx.drawImage(image, drawX * scaleX - 30, drawY * scaleY - 30, width + 60, height + 60, 0, 0, width + 60, height + 60);
        //将截图内容转化base64
        // console.log('startX',startX)
        // console.log('startY',startY)
        // console.log('width',width)
        // console.log('height',height)
        var newImage = '';
        try {
            newImage = nCanvas.toDataURL('image/webp', 0.7);
            // console.log(newImage);

        } catch (err) {
            console.log("Error: " + err);
        }

        context.variable.saveTrafficsignSrc[osmId] = {
            src: newImage && newImage.split(',')[1],
            pixels
        }

        iD.Task.dispatch.finish();

    }, false);
}

//解析PB
iD.util.xhr = null;
iD.util.parsePBData = function (pbUrl, pbRoot, package, callback, isBase64) {
    if (iD.util.xhr) {
        iD.util.xhr.abort();
        iD.util.xhr = null;
    }

    iD.util.xhr = new XMLHttpRequest();
    iD.util.xhr.open(
        "GET",
        pbUrl,
        true
    );
    if (!isBase64) {
        iD.util.xhr.responseType = 'arraybuffer';
    }

    iD.util.xhr.onload = function (evt) {
        // var buffer = xhr.response;
        try {
            if (isBase64) {
                var buffer = Base64Binary.decode(iD.util.xhr.response);
            } else {
                var buffer = new Uint8Array(iD.util.xhr.response);
            }
            var p = pbRoot.lookupType(package);
            var message = p.decode(buffer);
            if (message) {
                console.log(message)
                callback(message, p)
            } else {
                Dialog.alert('未请求到PB数据！');
            }
        } catch (err) {
            console.log("Error: " + err);
        }
    }
    iD.util.xhr.send(null)
}

iD.util.parsePBData1 = function (pbUrl, pbRoot, package, callback, isBase64) {


    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        pbUrl,
        true
    );
    if (!isBase64) {
        xhr.responseType = 'arraybuffer';
    }

    xhr.onload = function (evt) {
        var buffer = xhr.response;
        try {
            if (isBase64) {
                var buffer = Base64Binary.decode(this.response);
            } else {
                var buffer = new Uint8Array(this.response);
            }
            var p = pbRoot.lookupType(package);
            var message = p.decode(buffer);
            if (message) {
                callback(message, p);
            } else {
                Dialog.alert('未请求到PB数据！');
            }
        } catch (err) {
            callback(false, false)
            console.log("Error: " + err);
        }
    }
    xhr.send(null)
    // return xhr;
}
iD.util.parsePBData2 = function (pbUrl, pbRoot, package, callback, isBase64) {


    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        pbUrl,
        true
    );
    if (!isBase64) {
        xhr.responseType = 'arraybuffer';
    }

    xhr.onload = function (evt) {
        var buffer = xhr.response;
        if (buffer.byteLength > 26) {
            callback(buffer);
        } else {
            callback(false, false);
        }
        // try {
        //     if (isBase64) {
        //         var buffer = Base64Binary.decode(this.response);
        //     } else {
        //         var buffer = new Uint8Array(this.response);
        //     }
        // var p = pbRoot.lookupType(package);
        // var message = p.decode(buffer);
        // if (message) {
        //     callback(message, p);
        // } else {
        //     Dialog.alert('未请求到PB数据！');
        // }
        // } catch (err) {
        //     callback(false, false)
        //     console.log("Error: " + err);
        // }
    }
    xhr.send(null)
    // return xhr;
}

    ; (function () {
        // 线超过角度后false
        var MAX_LINE_DIFF_ANGLE = 50;
        // 线与轨迹高度差超过1m后false
        var MAX_LINE_DIFF_HEIGHT = 5;
        // 用于判断角度的索引间隔，2-5，暂时无用
        var TRACK_POINT_INDEX_SPACE = 3;
        // 用于判断角度的索引间隔，米数
        var INDEX_SPACE_METER = 10;
        // 每次角度判断时跳过的索引间隔，[2-5, 12-15, 22-25]
        var TRACK_POINT_JUMP = 10;
        // 轨迹点与轨迹最大距离，超过后false
        var MAX_TRACK_NODE_DISTANCE = 50;

        function getNodesByMeter(nodes, index, asc = true, meter = INDEX_SPACE_METER) {
            let totalDis = 0;
            let result;
            if (asc) {
                for (let i = index; i < nodes.length - 1; i++) {
                    let p1 = nodes[i];
                    let p2 = nodes[i + 1];
                    let dist = iD.util.distanceByLngLat(p1.loc, p2.loc);
                    totalDis += dist;
                    if (totalDis >= meter) {
                        result = p2;
                        break;
                    } else if (i - 1 == 0) {
                        result = p2;
                    }
                }
            } else {
                for (let i = index; i > 0; i--) {
                    let p1 = nodes[i];
                    let p2 = nodes[i - 1];
                    let dist = iD.util.distanceByLngLat(p1.loc, p2.loc);
                    totalDis += dist;
                    if (totalDis >= meter) {
                        result = p2;
                        break;
                    } else if (i - 1 == 0) {
                        result = p2;
                    }
                }
            }
            return result;
        }

        function getTrackPointsArr(track, indexMeter) {
            let result = [];
            if (track.nodes.length < TRACK_POINT_INDEX_SPACE) {
                return result;
            }
            let jump = TRACK_POINT_JUMP;
            let forNum = Math.ceil(track.nodes.length / jump);
            for (let i = 0; i < forNum; i++) {
                let arr = getTrackPoints(track, track.nodes[i * jump], indexMeter);
                if (!arr) break;
                result.push(arr);
            }
            return result;
        }
        function getTrackPoints(track, point, indexMeter) {
            if (!point) return;
            // let space = TRACK_POINT_INDEX_SPACE;
            let pointIndex = track.nodes.indexOf(point);
            let prev, next;
            if (pointIndex == track.nodes.length - 1) {
                prev = getNodesByMeter(track.nodes, pointIndex, false, indexMeter);
                next = point;
            } else {
                prev = point;
                next = getNodesByMeter(track.nodes, pointIndex, true, indexMeter);
            }
            if (!prev) {
                prev = track.nodes[0];
            }
            if (!next) {
                next = track.nodes[track.nodes.length - 1];
            }
            return [prev, next];
        }
        /**
         * 根据轨迹点到线的最近距离，线第一个点到轨迹最近距离，取最近的轨迹点
         * @param {Object} track 
         * @param {Object} point 
         * @param {iD.Way} way 
         * @param {Number} indexMeter 
         */
        function getTrackPointsByWay(context, track, point, way, indexMeter) {
            // 没有节点的线
            if (!point || !way || !way.nodes.length) return;
            let pointIndex = track.nodes.indexOf(point);
            // let space = TRACK_POINT_INDEX_SPACE;
            var wayNodes = context.childNodes(way);
            let wayLine = _.pluck(wayNodes, 'loc');
            let trackLine = _.pluck(track.nodes, 'loc');

            let rst1 = iD.util.pt2LineDist2(trackLine, wayNodes[0].loc);
            let rst2 = iD.util.pt2LineDist2(wayLine, point.loc);
            let minDis = 0, minNode;
            if (rst1.i != null && rst2.i != null) {
                if (rst1.dis < rst2.dis) {
                    minDis = rst1.dis;
                    pointIndex = rst1.i;
                    minNode = wayNodes[0];
                } else {
                    minDis = rst2.dis;
                    pointIndex = pointIndex;
                    minNode = wayNodes[rst2.i];
                }
            }
            if (minDis > MAX_TRACK_NODE_DISTANCE) {
                // 最近轨迹点与线超过50米
                return;
            }

            point = track.nodes[pointIndex];
            if (Math.abs(minNode.loc[2] - point.loc[2]) > MAX_LINE_DIFF_HEIGHT) {
                // 线与轨迹最近点超出高度限制
                // console.log(way.id, Math.abs(minNode.loc[2] - point.loc[2]));
                return;
            }

            let prev, next;
            if (pointIndex == track.nodes.length - 1) {
                prev = getNodesByMeter(track.nodes, pointIndex, false, indexMeter);
                next = point;
            } else {
                prev = point;
                next = getNodesByMeter(track.nodes, pointIndex, true, indexMeter);
            }
            if (!prev) {
                prev = track.nodes[0];
            }
            if (!next) {
                next = track.nodes[track.nodes.length - 1];
            }
            return [prev, next];
        }
        // 轨迹最近点的两个点
        function getWayNodes(context, way, start, end, indexMeter) {
            if (!way) return;
            let nodes = context.childNodes(way);
            if (nodes.length == 2) {
                return nodes;
            }
            let line = _.pluck(nodes, 'loc');
            let rst1 = iD.util.pt2LineDist2(line, start.loc);
            if (rst1.i == null || rst1.dis > MAX_TRACK_NODE_DISTANCE) {
                return;
            }
            // let rst2 = iD.util.pt2LineDist2(line, end.loc);
            let idx1 = rst1.i;
            // let idx2 = rst2.i;
            // if(idx2 == null){
            //     idx2 = idx1 + 1;
            // }
            // let space = Math.abs(idx2 - idx1) || 1;

            let prev, next;
            if (idx1 == nodes.length - 1) {
                // prev = nodes[idx1 - space];
                prev = getNodesByMeter(nodes, idx1, false, indexMeter);
                next = nodes[idx1];
            } else {
                prev = nodes[idx1];
                // next = nodes[idx1 + space];
                next = getNodesByMeter(nodes, idx1, true, indexMeter);
            }
            if (!prev) {
                prev = nodes[0];
            }
            if (!next) {
                next = nodes[nodes.length - 1];
            }
            return [prev, next];
        }

        class LineFilter {
            filterIds = []
            trackPointId = null
            trackPointsArr = []
            indexSpaceMeter = INDEX_SPACE_METER
            context = null

            constructor(context) {
                this.reset();
            }

            setContext(context) {
                this.context = context;
                this.reset();
            }

            removeFilterIds(entityIds) {
                if (!this.context || !entityIds) return;
                let ids = this.filterIds;
                let graph = this.context.graph();
                for (let eid of entityIds) {
                    let et = graph.hasEntity(eid);
                    if (!et || !et.id) continue;
                    if (et.type == iD.data.GeomType.NODE) {
                        et = graph.parentWays(et)[0];
                    }
                    let idx = ids.indexOf(et && et.id);
                    if (idx != -1) {
                        ids.splice(idx, 1);
                    }
                }
            }

            filter(way, track, point) {
                // || way.type != iD.data.GeomType.WAY
                if (!way || !track || !point || way.type != iD.data.GeomType.WAY || way.tags.DIRECTION == '1') return true;
                if (point.tags.trackId != track.trackId) return true;
                var indexMeter = this.indexSpaceMeter;
                if ([iD.data.DataType.PAVEMENT_DISTRESS, iD.data.DataType.PAVEMENT_DISTRESS_PL].includes(way.modelName)) {
                    return true;
                }
                if (way.modelName == iD.data.DataType.OBJECT_PL) {
                    if (way.tags.TYPE == '2' && ['1', '2', '3', '4'].includes(way.tags.SUBTYPE)) {
                        return true;
                    }else if (way.tags.TYPE == '4') {
                        return true;
                    }
                }

                if (way.modelName == iD.data.DataType.BARRIER_GEOMETRY) {
                    if (way.tags.TYPE == '8' && way.tags.LATERAL == '3') {
                        return true;
                    }
                }
                if (way.modelName == iD.data.DataType.BRIDGE) {
                    return true;
                }
                /* 
                // 轨迹不一样时，需要清空过滤重新筛选
                if(this.trackId && track.trackId != this.trackId){
                    this.reset();
                }else {
                    if(ids.indexOf(way.id) != -1) return false;
                }
                if(!this.trackId){
                    this.trackId = track.trackId;
                    this.trackPointsArr = getTrackPointsArr(track);
                }
                 */
                var ids;
                if (this.trackPointId && point.id != this.trackPointId) {
                    this.reset();
                    ids = this.filterIds;
                } else {
                    ids = this.filterIds;
                    if (ids.indexOf(way.id) != -1) return false;
                }
                this.trackPointId = point.id;

                var flag = true;
                var trackNodeList = getTrackPointsByWay(this.context, track, point, way, indexMeter);
                if (!trackNodeList) {
                    flag = false;
                    this.trackPointsArr = [];
                } else {
                    this.trackPointsArr = [
                        trackNodeList
                    ];
                }

                var lineCal = iD.util.LineCalCulate();
                for (let pts of this.trackPointsArr) {
                    var start = pts[0], end = pts[1];
                    var trackAngle = lineCal.getAngle(start.loc[0], start.loc[1], end.loc[0], end.loc[1]);
                    var nodes = getWayNodes(this.context, way, start, end, indexMeter);
                    if (!nodes) {
                        flag = false;
                        break;
                    }
                    var wayAngle = lineCal.getAngle(nodes[0].loc[0], nodes[0].loc[1], nodes[1].loc[0], nodes[1].loc[1]);
                    var angleList = this.getAngleDiffList(trackAngle, MAX_LINE_DIFF_ANGLE);
                    // 在任意角度范围内
                    flag = false;
                    for (let ag of angleList) {
                        if (wayAngle >= ag[0] && wayAngle <= ag[1]) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag == false) {
                    ids.push(way.id);
                }
                return flag;
            }

            // 用来判断角度的线段长度
            segmentMeter(v) {
                if (!arguments.length) return this.indexSpaceMeter;
                if (isNaN(v) || v <= 0) return this;
                this.indexSpaceMeter = v;
                return this;
            }

            // 线段与轨迹角度限制
            diffAngle(v) {
                if (!arguments.length) return MAX_LINE_DIFF_ANGLE;
                if (isNaN(v)) return this;
                if (v < 0) v = 0;
                if (v > 180) v = 180;
                MAX_LINE_DIFF_ANGLE = v;
                return this;
            }
            // 线段与轨迹高度限制
            diffHeight(v) {
                if (!arguments.length) return MAX_LINE_DIFF_HEIGHT;
                if (isNaN(v) || v <= 0) return this;
                MAX_LINE_DIFF_HEIGHT = v;
                return this;
            }

            reset() {
                // this.trackId = null;
                this.trackPointId = null;
                this.trackPointsArr = [];
                this.filterIds = [];
            }

            getAngleDiffList(angle, diffAngle = MAX_LINE_DIFF_ANGLE) {
                var all = 360;
                var result = [];

                var diff = angle - diffAngle;
                if (diff < 0) {
                    result.push([diff + all, all]);
                    result.push([0, angle]);
                } else {
                    result.push([diff, angle]);
                }

                var sum = angle + diffAngle;
                if (sum > all) {
                    result.push([angle, all]);
                    result.push([0, sum - all]);
                } else {
                    result.push([angle, sum]);
                }

                return result;
            }
        }

        var renderLineFilter = new LineFilter();

        iD.util.EntityRenderFilterLine = function (context) {
            renderLineFilter.setContext(context);
            return renderLineFilter;
        };

        /*
         * 获取最近车道线
         */
        iD.util.getNearestDivider = function (context, node) {
            var bounds = iD.util.getBounds(node.loc, 5);//查找5米的范围
            var entities = context.intersects(bounds);//根据范围获取最近要素组
            var graph = context.graph(),
                distancePoint = {//距离node最近的车道线节点
                    dis: -1,
                    p: null,
                    index: 0
                };
            entities.forEach(function (e) {
                if (e.modelName == iD.data.DataType.DIVIDER) {
                    var areaNodes = _.clone(context.childNodes(e));
                    for (let i = 0; i < areaNodes.length; i++) {
                        var n = areaNodes[i];
                        var dis = iD.util.distanceByLngLat(n.loc, node.loc);
                        if (distancePoint.p) {
                            if (distancePoint.dis > dis) {
                                distancePoint.dis = dis;
                                distancePoint.p = n;
                                distancePoint.index = i;
                            }
                        } else {
                            distancePoint.dis = dis;
                            distancePoint.p = n;
                            distancePoint.index = i;
                        }
                    };
                }
            });
            var way = graph.parentWays(distancePoint.p);
            return way;
        }

        iD.util.rotateFeature = function (context, selectEntity, selectDivider) {
            var lineCal = iD.util.LineCalCulate(),
                areaRect = iD.picUtil.getRectangleBounding(selectEntity);
            if (!areaRect) {
                return;
            }
            var areaNodes = _.clone(context.childNodes(selectEntity));
            areaNodes.pop();

            // 视频中左侧的边，0左上角
            // 绘制顺序 iD.picUtil.createRectangeBy2Point
            var firstNode = areaRect.left[0];
            var lastNode = areaRect.left[1];
            var leftAngle = lineCal.getAngle(lastNode.loc[0], lastNode.loc[1], firstNode.loc[0], firstNode.loc[1]);

            var lineNodes = context.childNodes(selectDivider);
            var lineLocs = _.pluck(lineNodes, 'loc');
            var ainfo = iD.util.pt2LineDist(lineLocs, lastNode.loc);
            if (lineLocs.length > 2) {
                //防止重复最近点
                lineLocs.splice(ainfo.i, 1);
            }
            var binfo = iD.util.pt2LineDist(lineLocs, firstNode.loc);
            var aNode = lineNodes[ainfo.i];
            var bNode = lineNodes[binfo.i >= ainfo.i ? (binfo.i + 1) : binfo.i];
            var lineAngle = lineCal.getAngle(aNode.loc[0], aNode.loc[1], bNode.loc[0], bNode.loc[1]);

            var diffAngle = lineAngle - leftAngle;
            if (isNaN(diffAngle)) {
                return;
            }
            var areaPoints = areaNodes.map(function (n) { return context.projection(n.loc); });
            var pivot = d3.geom.polygon(areaPoints).centroid();
            var annotation = t('operations.rotate_area_divider.title');
            context.perform(
                iD.actions.Noop(),
                annotation);
            context.replace(
                iD.actions.RotateWay(selectEntity.id, pivot, diffAngle * Math.PI / 180, context.projection),
                annotation);

            // 刷新视频
            var player = iD.picUtil.player;
            if (player && player.resetPointToPicPlayer) {
                player.resetPointToPicPlayer([selectEntity.id].concat(selectEntity.nodes));
                // 更新两侧信息
                iD.picUtil.updateGroundAreaMeasure(selectEntity.id, annotation, true);
            }

            context.event.entityedite({
                entitys: [selectEntity.id]
            })
        }

        iD.util.getSameDirectionDivider = function (context, dividers, nodeIndex = 0, opts) {
            var self = this;
            opts = opts || {};
            if (dividers.length < 2) return false;
            // 最大距离10m
            var distance = opts.distance || 10;
            var lineCal = iD.util.LineCalCulate();
            // 同方向最近轨迹
            var angleDiff = 10;
            // var range = 15;
            var divider = dividers[0];
            var direction = divider.tags.DIRECTION;
            var nowNode = context.hasEntity(divider.nodes[nodeIndex]);
            var sameTracks = [];
            var nd = iD.util.getAngleNodes(divider.nodes, nodeIndex);
            var nd1 = context.hasEntity(nd[0]);
            var nd2 = context.hasEntity(nd[1]);
            var nowAngle = lineCal.getAngle(
                nd1.loc[0], nd1.loc[1],
                nd2.loc[0], nd2.loc[1]
            );
            dividers.forEach(function (d) {
                let angleNodes;
                let dist;
                if (d.id == divider.id) {
                    sameTracks.push(d);
                    return;
                }
                if (d.tags.DIRECTION == "3" && divider.tags.DIRECTION != "3") {
                    return;
                } else if (d.tags.DIRECTION != "3" && divider.tags.DIRECTION == "3") {
                    return;
                }

                let nodes = context.graph().childNodes(d);
                if (nodes.length <= 2) {
                    let line = _.pluck(nodes, 'loc');
                    dist = iD.util.pt2LineDist2(line, nowNode.loc);
                    if (dist.i == -1) {
                        return;
                    }
                    if (dist.dis > distance) {
                        return;
                    }
                    angleNodes = nodes;
                } else {
                    let line = _.pluck(nodes, 'loc');
                    dist = iD.util.pt2LineDist2(line, nowNode.loc);
                    if (dist.i == -1) {
                        return;
                    }
                    // if (dist.dis > distance) {
                    //     return;
                    // }
                    angleNodes = iD.util.getAngleNodes(nodes, dist.i);
                }
                if (!angleNodes || angleNodes.length < 2) return;

                let angle = lineCal.getAngle(
                    angleNodes[0].loc[0], angleNodes[0].loc[1],
                    angleNodes[1].loc[0], angleNodes[1].loc[1]
                );

                if (!iD.util.angleInDiff(nowAngle, angle, angleDiff)) {
                    return;
                }
                sameTracks.push(d);
            });
            // console.log('sameTracks:', sameTracks)

            return sameTracks;
        }

        // 360的情况，355° 5° 相差10
        iD.util.angleInDiff = function (pangle, wangle, diffAngle) {
            pangle = pangle % 360;
            wangle = wangle % 360;
            if (Math.abs(pangle - wangle) <= diffAngle || Math.abs(pangle - wangle) >= (360 - diffAngle)) {
                return true;
            }
            return false;
        }

        iD.util.getAngleNodes = function (allNodes, idx) {
            if (allNodes.length < 2) {
                return;
            }
            var result;
            var node = allNodes[idx];
            if (idx == 0) {
                result = [
                    node,
                    allNodes[idx + 1]
                ];
            } else if (idx == allNodes.length - 1) {
                result = [
                    allNodes[idx - 1],
                    node
                ];
            } else {
                result = [
                    allNodes[idx - 1],
                    allNodes[idx + 1]
                ];
            }

            return result;
        }

        iD.util.minAreaRect = function (points) {
            var context = editor.context, graph = context.graph();
            var firstPoint = points[0];
            var bounds = iD.util.getBounds(firstPoint, 5);//根据第一个点扩5米的范围
            var entities = context.intersects(bounds);//根据范围获取最近要素组
            var dividers = [], way,
                distancePoint = {//距离firstPoint最近的车道线节点
                    dis: -1,
                    p: null,
                    index: 0
                };
            entities.forEach(function (e) {
                if (e.modelName == iD.data.DataType.DIVIDER) {
                    var areaNodes = _.clone(context.childNodes(e));
                    for (let i = 0; i < areaNodes.length; i++) {
                        var n = areaNodes[i];
                        var dis = iD.util.distanceByLngLat(n.loc, firstPoint);
                        if (distancePoint.p) {
                            if (distancePoint.dis > dis) {
                                distancePoint.dis = dis;
                                distancePoint.p = n;
                                distancePoint.index = i;
                            }
                        } else {
                            distancePoint.dis = dis;
                            distancePoint.p = n;
                            distancePoint.index = i;
                        }
                    };
                }
            })
            if (distancePoint.p) {
                way = graph.parentWays(distancePoint.p);
                var startLoc = g.entities[way.nodes[distancePoint.index - 1]];//最近车道线起点节点
                var endLoc = g.entities[way.nodes[distancePoint.index + 1]];//最近车道线终点节点
                var pedals = [];
                points.forEach(function (p) {
                    iD.util.pedal([startLoc, endLoc], p, []);//计算四个点垂足
                })
            }

        }

        iD.util.minAreaRect1 = function (points) {
            var xymap = new HashMap();
            for (let i = 0; i < points.length; i++) {
                let map = xymap.get(points[i][0]);
                if (null == map) {
                    map = new HashMap();
                    xymap.put(points, map);
                }
                map.put(points[i][1], points);
            }

            let minArea = Number.MAX_VALUE;
            for (let i = 0; i < points.length; ++i) {
                for (let j = i + 1; j < points.length; ++j) {
                    if (points[i][0] == points[j][0] || points[i][1] == points[j][1]) { // same x or  same y, not Diagonal points
                        continue;
                    }
                    // exist other two points if diagonal exist
                    if (xymap.get(points[i][0]).containsKey(points[j][1]) && xymap.get(points[j][0]).containsKey(points[i][1])) {
                        let area = (points[i][0] - points[j][0]) * (points[i][1] - points[j][1]);
                        minArea = Math.min(minArea, Math.abs(area));
                    }
                }
            }

            if (minArea == Number.MAX_VALUE) {
                return 0;
            }
            return minArea;
        }

        function HashMap() {
            //定义长度  
            var length = 0;
            //创建一个对象  
            var obj = new Object();

            /** 
            * 判断Map是否为空 
            */
            this.isEmpty = function () {
                return length == 0;
            };

            /** 
            * 判断对象中是否包含给定Key 
            */
            this.containsKey = function (key) {
                return (key in obj);
            };

            /** 
            * 判断对象中是否包含给定的Value 
            */
            this.containsValue = function (value) {
                for (var key in obj) {
                    if (obj[key] == value) {
                        return true;
                    }
                }
                return false;
            };

            /** 
            *向map中添加数据 
            */
            this.put = function (key, value) {
                if (!this.containsKey(key)) {
                    length++;
                }
                obj[key] = value;
            };

            /** 
            * 根据给定的Key获得Value 
            */
            this.get = function (key) {
                return this.containsKey(key) ? obj[key] : null;
            };

            /** 
            * 根据给定的Key删除一个值 
            */
            this.remove = function (key) {
                if (this.containsKey(key) && (delete obj[key])) {
                    length--;
                }
            };

            /** 
            * 获得Map中的所有Value 
            */
            this.values = function () {
                var _values = new Array();
                for (var key in obj) {
                    _values.push(obj[key]);
                }
                return _values;
            };

            /** 
            * 获得Map中的所有Key 
            */
            this.keySet = function () {
                var _keys = new Array();
                for (var key in obj) {
                    _keys.push(key);
                }
                return _keys;
            };

            /** 
            * 获得Map的长度 
            */
            this.size = function () {
                return length;
            };

            /** 
            * 清空Map 
            */
            this.clear = function () {
                length = 0;
                obj = new Object();
            };
        }

        /**
         * @description: utm转经纬度接口函数
         */
        iD.util.UTMtoLL_ = function (x, y, zone) {
			
            return UTMtoLL(x,y,zone);
        }
        /**
         * @description: 经纬度转utm接口函数
         */
        iD.util.LLtoUTM_ = function (x, y) {
            let setzone = iD.Task.d.tags.utm.zone || null;
            return LLtoUTM(x, y, setzone);
        }



    })();
