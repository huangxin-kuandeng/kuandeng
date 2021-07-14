/*
 * @Author: tao.w
 * @Date: 2019-09-20 22:07:44
 * @LastEditors: tao.w
 * @LastEditTime: 2020-09-04 21:11:35
 * @Description: 
 */
iD = {};
iD.util = {};


/**
 *
 * @param k 相机内参矩阵
 * @param point  轨迹点
 * @param xyz   投影坐标
 * @returns {[*,*,*,*]}
 */
iD.util.trackPointToPicPixe = function (k, point, xyz) {
    //相机外参
    let r = point.R;
    let t = point.T;
    let p = this.KRt(k, r, t);
    let x1 = matrix.multiply(p, this.UTMProjection(xyz));

    return [x1[0] / x1[2], x1[1] / x1[2], x1[2][0]];
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
        dis: iD.util.sphericalDistance(pt, [x, y])
    };
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

// using WGS84 polar radius (6356752.314245179 m)
// const = 2 * PI * r / 360
iD.util.latToMeters = function(dLat) {
    return dLat * 110946.257617;
};

// using WGS84 equatorial radius (6378137.0 m)
// const = 2 * PI * r / 360
iD.util.lonToMeters = function(dLon, atLat) {
    return Math.abs(atLat) >= 90 ? 0 :
        dLon * 111319.490793 * Math.abs(Math.cos(atLat * (Math.PI/180)));
};

// Equirectangular approximation of spherical distances on Earth
iD.util.sphericalDistance = function(a, b) {
    var x = iD.util.lonToMeters(a[0] - b[0], (a[1] + b[1]) / 2),
        y = iD.util.latToMeters(a[1] - b[1]);
    return Math.sqrt((x * x) + (y * y));
};

/**
 * 经纬度坐标转UTM矩阵
 * @param xyz 坐标
 * @returns {Array}
 */
iD.util.UTMProjection = function (xyz) {
    var lon = xyz[0],
        lat = xyz[1],
        z = xyz[2];
    var utm = LLtoUTM(lon, lat);
    var X = [
        [utm.x],
        [utm.y],
        [z]
    ];
    X.push([1]);
    return X;
}

//向量归一化
iD.util.normalizedSqrt = function (x1) {
    let R = Math.sqrt(Math.pow(x1[0], 2) + Math.pow(x1[1], 2) + Math.pow(x1[2], 2));
    let rst = [[x1[0] / R], [x1[1] / R], [x1[2] / R]];
    if (isNaN(rst[0]) || isNaN(rst[1]) || isNaN(rst[2])) {
        rst = [[0], [0], [0]]
    }
    return rst;
}

iD.util.hnormalized = function (x1) {
    return [
        [x1[0] / x1[2]],
        [x1[1] / x1[2]],
        [x1[2][0]]
    ];
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
iD.util.Cbn = function (Roll, Pitch, Yaw) {
    var r1 = matrix.multiply(this.Rz(Yaw), this.Ry(Pitch));
    return matrix.multiply(r1, this.Rx(Roll));
}

iD.util.Rz = function (angle) {
    let rad = Math.PI * angle / 180;
    let R = [[Math.cos(rad), -Math.sin(rad), 0],
    [Math.sin(rad), Math.cos(rad), 0],
    [0, 0, 1]];
    return R;
}
iD.util.Rx = function (angle) {
    let rad = Math.PI * angle / 180;
    let R = [[1, 0, 0],
    [0, Math.cos(rad), -Math.sin(rad)],
    [0, Math.sin(rad), Math.cos(rad)]
    ]
    return R;
}
iD.util.Ry = function (angle) {
    let rad = Math.PI * angle / 180;
    let R = [[Math.cos(rad), 0, Math.sin(rad)],
    [0, 1, 0],
    [-Math.sin(rad), 0, Math.cos(rad)]];
    return R;
}
iD.util.norm = function (nx1, nx2) {
    return Math.sqrt(Math.pow(nx1[0] - nx2[0], 2) + Math.pow(nx1[1] - nx2[1], 2) + Math.pow(nx1[2] - nx2[2], 2));
}
iD.util.pos2CameraRTC = function (pos, pos0, height) {
    let B = pos.y;
    let L = pos.x;
    let H = height || pos.z;
    //
    let B0 = B;//pos0.y;
    let L0 = L;//pos0.x;
    //
    let Roll = pos.roll;
    let Pitch = pos.pitch;
    let Azimuth = pos.azimuth;
    //
    let utm = LLtoUTM(L, B);
    let X = utm.x, Y = utm.y, UTMZone = utm.zoneNumber;

    //计算中央经线
    let ZoneNumber = UTMZone;
    let LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3;
    let L0GK = LongOrigin;
    //张实现
    let R_i_c = [[0, 0, 1],
    [1, 0, 0],
    [0, 1, 0]];
    var R_b_n = this.Cbn(Roll, Pitch, Azimuth);
    var R_n_E = matrix.multiply(this.Rz(L), matrix.transpose(this.Ry(B + 90)));
    var R_Ec_m = matrix.multiply(matrix.transpose(this.Rx(90 - B0)), matrix.transpose(this.Rz(90 + L0)));
    //
    var R_m0_m = [[1, Math.PI * (L0 - L0GK) / 180.0 * Math.sin(Math.PI * (B) / 180.0), -Math.PI * (L0 - L) / 180.0 *
        Math.cos(Math.PI * (B) / 180.0)],
    [-Math.PI * (L0 - L0GK) / 180.0 * Math.sin(Math.PI * (B) / 180.0), 1, Math.PI * (B - B0) / 180.0],
    [Math.PI * (L0 - L) / 180.0 * Math.cos(Math.PI * (B) / 180.0), -Math.PI * (B - B0) / 180.0, 1]];
    //
    var R_m_m0 = matrix.transpose(R_m0_m);
    var R_E_Ec = matrix.identity(3);
    var R_c_b = matrix.identity(3);
    var t1 = matrix.multiply(R_m_m0, R_Ec_m);
    var t2 = matrix.multiply(t1, R_E_Ec);
    var t3 = matrix.multiply(t2, R_n_E);
    var t4 = matrix.multiply(t3, R_b_n);
    var t5 = matrix.multiply(t4, R_c_b);
    var R_i_m0 = matrix.multiply(t5, R_i_c);
    //
    var R2 = matrix.transpose(R_i_m0);
    //
    R = R2;
    C = [[X], [Y], [H]];
    T = matrix.multiply(matrix.scalar(_.cloneDeep(R), -1.0), C)
    return { R, T, C, UTMZone }
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

iD.util.picPixelToLonLat = function (k, picPoint, UTMZone, designator, xy, h) {
    let r = picPoint.R;
    let c = picPoint.C;
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

    return UTMtoLL(cod[0][0], cod[1][0], UTMZone, designator);
}

/**
  * 
  * @param {*} p1 位置点1
  * @param {*} p2 位置点2
  * @param {*} range 距离
  */
iD.util.getLocationPoint = function (p1, p2, range = 6) {
    var _p2 = lonlatToUTM(p2[0], p2[1]);
    var _p1 = lonlatToUTM(p1[0], p1[1]);

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
    var loc = UTMToLonLat(result[0], result[1], _p2.zone);
    return [loc[0], loc[1], result[2]];
}

iD.util.SegmentIntersect = function (SegmentA, SegmentB) {
    var d = (SegmentA[3] - SegmentA[1]) * (SegmentB[2] - SegmentB[0]) - (SegmentB[3] - SegmentB[1]) * (SegmentA[2] - SegmentA[0]);
    if (d == 0) {
        return 3; //"LINE_COLLINEAR";
    }
    var Tmp = [];
    Tmp[0] = ((SegmentA[2] - SegmentA[0]) * (SegmentB[2] - SegmentB[0]) * (SegmentB[1] - SegmentA[1]) + (SegmentA[3] - SegmentA[1]) * (SegmentB[2] - SegmentB[0]) * SegmentA[0] - (SegmentB[3] - SegmentB[1]) * (SegmentA[2] - SegmentA[0]) * SegmentB[0]) / d;
    Tmp[1] = ((SegmentA[3] - SegmentA[1]) * (SegmentB[3] - SegmentB[1]) * (SegmentB[0] - SegmentA[0]) + (SegmentA[2] - SegmentA[0]) * (SegmentB[3] - SegmentB[1]) * SegmentA[1] - (SegmentB[2] - SegmentB[0]) * (SegmentA[3] - SegmentA[1]) * SegmentB[1]) / (-d);

    var f1 = ((Tmp[0] - SegmentA[0]) * (Tmp[0] - SegmentA[2]) <= 0);
    var f2 = ((Tmp[0] - SegmentB[0]) * (Tmp[0] - SegmentB[2]) <= 0);
    var f3 = ((Tmp[1] - SegmentA[1]) * (Tmp[1] - SegmentA[3]) <= 0);
    var f4 = ((Tmp[1] - SegmentB[1]) * (Tmp[1] - SegmentB[3]) <= 0);
    if (f1 && f2 && f3 && f4) {
        //线线交点
        return [Tmp[0], Tmp[1]]; //"LINE_INTERSECT";
    } else {
        return 0; //"DONT_INTERSECT";
    }
}
/**
* 判断点是否在矩形内
* @param point = {lng:'',lat:''} 点对象
* @param ext 矩形边任意【对角】点的经纬度数组对象 即拉框起点坐标和结束点经纬度坐标
* @returns {Boolean} 点在矩形内返回true,否则返回false
*/
iD.util.isPointInRect = function (point, ext) {
    //拉框起点坐标和结束点经纬度坐标
    var x1 = ext[0][0], y1 = ext[0][1];
    var x2 = ext[1][0], y2 = ext[1][1];
    //线与边没有相交
    var Xmin = Math.min(x1, x2);
    var Xmax = Math.max(x1, x2);
    var Ymin = Math.min(y1, y2);
    var Ymax = Math.max(y1, y2);

    //西南脚点
    var sw = {
        lng: Xmin,
        lat: Ymin
    };
    //东北脚点
    var ne = {
        lng: Xmax,
        lat: Ymax
    };
    return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
}
/**
* 线在矩形内或与矩形边相交
* ext 拉框起点和终点经纬度坐标
* linecoord 被校验线的 起点与结束点经纬度数组[x1,y1,x2,y2]
*/
iD.util.isLineInRect = function (ext, linecoord) {
    //拉框起点坐标和结束点经纬度坐标
    var x1 = ext[0][0], y1 = ext[0][1];
    var x2 = ext[1][0], y2 = ext[1][1];

    //分解拉框矩形区域为四条边线段,即矩形四条边
    var line1 = [x1, y1, x2, y1];
    var line2 = [x2, y1, x2, y2];
    var line3 = [x2, y2, x1, y2];
    var line4 = [x1, y2, x1, y1];
    var rectLines = [line1, line2, line3, line4];
    for (var i = 0; i < rectLines.length; i++) {
        var SegmentA = rectLines[i];
        var r = this.SegmentIntersect(SegmentA, linecoord);
        if (r) {
            return r;//线与矩形边线相交
        }
    }
    //线不与矩形边相交，则决断线是否在矩形内！！！
    //即线上的任意一点在矩形内    isPointInRect
    //线上一点是否在矩形内
    var point1 = this.isPointInRect({
        lng: linecoord[0],
        lat: linecoord[1]
    }, ext);
    //线上一点是否在矩形内
    var point2 = this.isPointInRect({
        lng: linecoord[2],
        lat: linecoord[3]
    }, ext);
    return (point1 || point2);
}

/*
 * 定位激光面板相机视角
 * @param viewer：场景视野
 *        _p：视频当前帧
 *        _K: 轨迹相机K矩阵
*/
iD.util.locationPotree = function (_p, _K) {

    var projectionMatrix = iD.util.buildProjectionMatrix(_K, 2448, 2048)
    // var camera = viewer.scene.getActiveCamera();
    var _cameraProjMatrix = projectionMatrix.flat();
    iD.util.initCameraProjection(_cameraProjMatrix, camera);
    var vm = iD.util.buildModelAndView(_p.R, _p.C, _p.T);
    vm = vm.flat();
    //			var C = [[457060.8286223448],[4427905.998574111],[27.0924]];//1帧
    //			var C = [[457109.8478512518],[4427963.0344656445],[26.654]];//262帧
    //			var C = [[457193.20001930033],[4428059.614782721],[25.8947]];//725帧
    iD.util.updateCameraPose(vm, camera, _p.C)

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

    var L = new THREE.Vector3(-mv[8], -mv[9], -mv[10]);
    var s = new THREE.Vector3(mv[0], mv[1], mv[2]);
    var u = new THREE.Vector3();

    u.multiplyScalar(-1);
    u.crossVectors(s, L);
    var p = new THREE.Vector3();
    p.addVectors(C, L);
    //
    _camera.position.x = C.x;
    _camera.position.y = C.y;
    _camera.position.z = C.z;
    //
    _camera.up = u;
    _camera.lookAt(p);
    //
    _camera.updateMatrixWorld();
}

// iD.util.updateCameraPose = function (_modelViewMatrix, _camera, _c, viewer) {
//     var mv = _modelViewMatrix;
//     var R = new THREE.Matrix3();
//     R.set(mv[0], mv[1], mv[2], mv[4], mv[5], mv[6], mv[8], mv[9], mv[10]);

//     var t = new THREE.Vector3(mv[3], mv[7], mv[11]);
//     var Rt = R.clone();
//     Rt.transpose();
//     Rt.multiplyScalar(-1);
//     t.applyMatrix3(Rt);

//     let C = new THREE.Vector3(..._c.flat());
//     var p = new THREE.Vector3();

//     viewer.scene.view.position = new THREE.Vector3(C.x, C.y, C.z);
//     //
//     var L = new THREE.Vector3(-mv[8], -mv[9], -mv[10]);
//     var s = new THREE.Vector3(mv[0], mv[1], mv[2]);
//     var u = new THREE.Vector3();
//     u.crossVectors(s, L);
//     u.multiplyScalar(-1);
//     p.addVectors(C, L);
//     console.log("p---",p)
//     _camera.up = u;
//     viewer.scene.view.lookAt(p);
//     _camera.position.copy(p);

// }

//相机的投影矩阵
iD.util.buildProjectionMatrix = function (K, screen_width, screen_height) {
    var near = 0.01; // Near clipping distance
    var far = 100.0; // Far clipping distance

    // Camera parameters
    var f_x = K[0][0]; // Focal length in x axis
    var f_y = K[1][1]; // Focal length in y axis (usually the same?)
    var c_x = K[0][2]; // Camera primary point x
    var c_y = K[1][2]; // Camera primary point y

    return [
        [2.0 * f_x / screen_width, 0.0, -(2.0 * c_x / screen_width - 1.0), 0.0],
        [0.0, 2.0 * f_y / screen_height, 2.0 * c_y / screen_height - 1.0, 0.0],
        [0.0, 0.0, -(far + near) / (far - near), -2.0 * far * near / (far - near)],
        [0.0, 0.0, -1.0, 0.0]
    ]
}

iD.util.initCameraProjection = function (_cameraProjMatrix, _camera) {

    var x = _cameraProjMatrix[0];
    var y = _cameraProjMatrix[5];
    var a = _cameraProjMatrix[2];
    var b = _cameraProjMatrix[6];
    var c = _cameraProjMatrix[10];
    var d = _cameraProjMatrix[11];

    var k = (c - 1.0) / (c + 1.0);
    var near = (d * (1.0 - k)) / (2.0 * k);
    var far = k * near;

    var l = 2 * near;
    var left = l * (a - 1.0) / (2 * x);
    var right = l * (a + 1.0) / (2 * x);
    var top = l * (b + 1.0) / (2 * y);
    var bottom = l * (b - 1.0) / (2 * y);

    var width = right - left;
    var height = top - bottom;

    var left0 = -width * 0.5;
    var top0 = 0.5 * height;

    var offsetX = left - left0;
    var offsetY = top0 - top;

    var aspect = width / height;
    var fov = 2 * Math.atan(top0 / near) * 180 / Math.PI;

    _camera.fov = fov;
    _camera.aspect = aspect;
    _camera.near = near;
    _camera.far = far;

    var new_top = near * Math.tan((Math.PI / 180.0) * 0.5 * fov) / 1.0;
    var new_height = 2 * new_top;
    var new_width = aspect * new_height;
    //
    _camera.setViewOffset(new_width, new_height, offsetX, offsetY, new_width, new_height);
}

iD.util.buildModelAndView = function (_R, _C, _T) {
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
}

iD.util.UpdateFinalRC = function (trackpoint, delta) {
    let newTrack = {};
    let llh = [];
    let rpa = []
    llh[0] = trackpoint.x + delta_position.delta_lng;
    llh[1] = trackpoint.y + delta_position.delta_lat;
    llh[2] = trackpoint.z + delta_position.delta_height;
    //
    rpa[0] = trackpoint.roll + track_delta_angle.delta_roll;
    rpa[1] = trackpoint.pitch + track_delta_angle.delta_pitch;
    rpa[2] = trackpoint.azimuth + track_delta_angle.delta_azimuth;
    //
};

/**
* 获得等效的OpenGL投影矩阵
*
* @param near
* @param far
*
* @return
*/
//   Eigen::Matrix4d GetGLProjMatrix(double near = 0.01, double far = 100.0) {
//     //
//     Eigen::Matrix4d proj_matrix;
//     //
//     // Camera parameters
//     double f_x = focal_x_prior;  // Focal length in x axis
//     double f_y = focal_y_prior;  // Focal length in y axis (usually the same?)
//     double c_x = c_x_prior;      // Camera primary point x
//     double c_y = c_y_prior;      // Camera primary point y
//     //
//     proj_matrix(0, 0) = 2.0 * f_x / image_width;
//     proj_matrix(1, 0) = 0.0;
//     proj_matrix(2, 0) = 0.0;
//     proj_matrix(3, 0) = 0.0;

//     proj_matrix(0, 1) = 0.0;
//     proj_matrix(1, 1) = 2.0 * f_y / image_height;
//     proj_matrix(2, 1) = 0.0;
//     proj_matrix(3, 1) = 0.0;
//     //当主点在相机中心的时候，下面两个值为0
//     // FIX BUG,原来正负号搞反了
//     proj_matrix(0, 2) = -(2.0 * c_x / image_width - 1.0);
//     //错误：projectionMatrix(0, 2) = +(2.0 * c_x / screen_width - 1.0);
//     proj_matrix(1, 2) = 2.0 * c_y / image_height - 1.0;
//     //
//     proj_matrix(2, 2) = -(far + near) / (far - near);
//     proj_matrix(3, 2) = -1.0;
//     //
//     proj_matrix(0, 3) = 0.0;
//     proj_matrix(1, 3) = 0.0;
//     proj_matrix(2, 3) = -2.0 * far * near / (far - near);
//     proj_matrix(3, 3) = 0.0;
//     //
//     return proj_matrix;
//   }
//相机的投影矩阵
iD.util.GetGLProjMatrix = function (K, screen_width, screen_height) {
    var near = 0.01; // Near clipping distance
    var far = 100.0; // Far clipping distance

    // Camera parameters
    var f_x = K[0][0]; // Focal length in x axis
    var f_y = K[1][1]; // Focal length in y axis (usually the same?)
    var c_x = K[0][2]; // Camera primary point x
    var c_y = K[1][2]; // Camera primary point y

    return [
        [2.0 * f_x / screen_width, 0.0, -(2.0 * c_x / screen_width - 1.0), 0.0],
        [0.0, 2.0 * f_y / screen_height, 2.0 * c_y / screen_height - 1.0, 0.0],
        [0.0, 0.0, -(far + near) / (far - near), -1.0],
        [0.0, 0.0, -2.0 * far * near / (far - near), 0.0]
    ]
}
/**
* 获取相机视锥体
*
* @param near
* @param far
* @return
*/
iD.util.GetGLFrustum = function (_cameraProjMatrix, near = 0.01, far = 100.0) {

    var x = _cameraProjMatrix[0];
    var y = _cameraProjMatrix[5];
    var a = _cameraProjMatrix[2];
    var b = _cameraProjMatrix[6];
    var c = _cameraProjMatrix[10];
    var d = _cameraProjMatrix[11];

    var k = (c - 1.0) / (c + 1.0);
    // var near = (d * (1.0 - k)) / (2.0 * k);
    // var far = k * near;

    var l = 2 * near;
    var left = l * (a - 1.0) / (2 * x);
    var right = l * (a + 1.0) / (2 * x);
    var top = l * (b + 1.0) / (2 * y);
    var bottom = l * (b - 1.0) / (2 * y);

    var width = right - left;
    var height = top - bottom;

    var left0 = -width * 0.5;
    var top0 = 0.5 * height;

    var offsetX = left - left0;
    var offsetY = top0 - top;

    var aspect = width / height;
    var fov = 2 * Math.atan(top0 / near) * 180 / Math.PI;

    if (aspect < 1) {
        fov = 2 * Math.atan(top0 / near);
    }

    return { fov, aspect, offsetX, offsetY }

    // var new_top = near * Math.tan((Math.PI / 180.0) * 0.5 * fov) / 1.0;
    // var new_height = 2 * new_top;
    // var new_width = aspect * new_height;
    //
}
iD.util.Rm20 = function (B, L,) {
    let DEG_TO_RAD = Math.PI / 180;
    //
    return [
        [Math.cos(L * DEG_TO_RAD), 0, -Math.sin(L * DEG_TO_RAD)],
        [-Math.sin(B * DEG_TO_RAD) * Math.sin(L * DEG_TO_RAD), Math.cos(B * DEG_TO_RAD), -Math.sin(B * DEG_TO_RAD) * Math.cos(L * DEG_TO_RAD)], [Math.cos(B * DEG_TO_RAD) * Math.sin(L * DEG_TO_RAD), Math.sin(B * DEG_TO_RAD), Math.cos(B * DEG_TO_RAD) * Math.cos(L * DEG_TO_RAD)]
    ];
}


iD.util.D2R = function (degree) { return degree * Math.PI / 180.0; }

/**
 * @brief Convert an angle from radian to degree
 * @param radian Angle in radian
 * @return Same angle in degree
 * @note Assuming input angle in range [0;2Pi]
 */
iD.util.R2D = function (radian) { return radian / Math.PI * 180.0; }

/**
 * @brief Convert an angle from radian to degree
 * @param radian Angle in radian
 * @return Same angle in degree
 * @note Assuming input angle in range [0;2Pi]
 */

iD.util.R2D = function (radian) { return radian / Math.PI * 180.0; }

iD.util.lla_to_ecef = function (lon, lat, alt) {
    let WGS84_A = 6378137.0;       // major axis
    let WGS84_B = 6356752.314245;  // minor axis
    let WGS84_E = 0.0818191908;    // first eccentricity
    let clat = Math.cos(this.D2R(lat));
    let slat = Math.sin(this.D2R(lat));
    let clon = Math.cos(this.D2R(lon));
    let slon = Math.sin(this.D2R(lon));

    let a2 = Math.pow(WGS84_A, 2);
    let b2 = Math.pow(WGS84_B, 2);

    let L = 1.0 / Math.sqrt(a2 * Math.pow(clat, 2) + b2 * Math.pow(slat, 2));
    let x = (a2 * L + alt) * clat * clon;
    let y = (a2 * L + alt) * clat * slon;
    let z = (b2 * L + alt) * slat;

    return [[x], [y], [z]]
}
iD.util.Pos2CameraLocal = function (point, delta) {
    //推导`$R^{m0}_i，经过，i到传感器，传感器到IMU本体，IMU本地到导航坐标系，导航坐标系到地心地固坐标系，地心地固到切平面直角坐标系，切平面直角坐标系到参考中心的转换
    // double DEG_TO_RAD = M_PI / 180;
    let B = point.y;
    let L = point.x;
    let H = point.z;
    //
    let B0 = B;//pos0.y;
    let L0 = L;//pos0.x;
    // double H0 = pos0.gps.height;
    //相机空间到传感器本体的转换
    let R_i_c = [[0, 0, 1],
    [1, 0, 0],
    [0, 1, 0]];
    //

    let Roll = point.roll;
    let Pitch = point.pitch;
    let Azimuth = point.azimuth;

    // IMU本体坐标系到导航坐标系的转换
    let R_b_n = this.Cbn(Roll, Pitch, Azimuth);
    //导航坐标系到地心地固坐标系
    let R_n_E = matrix.multiply(this.Rz(L), matrix.transpose(this.Ry(B + 90)));
    let R_E_m = matrix.multiply(matrix.transpose(this.Rx(90 - B0)), matrix.transpose(this.Rz(90 + L0)));
    //


    let R_m0_0 = this.Rm20(B0, L0);
    let _temp1 = matrix.transpose(R_m0_0);
    var R_m0_m = matrix.multiply(R_m0_0, _temp1);
    //
    //
    let R_m_m0 = matrix.transpose(R_m0_m);
    //标定的旋转向量
    // Eigen:: Vector3d Rv_c_b = { calibraion(0), calibraion(1), calibraion(2) };
    // Eigen:: Vector3d caled_c_b = { calibraion(3), calibraion(4), calibraion(5) };
    //
    var R_c_b = this.Cbn(delta.roll, delta.pitch, delta.azimuth);
    //偏心角
    // if (Rv_c_b.norm() != 0) {
    //     let aa_c_b = { Rv_c_b.norm(), Rv_c_b.normalized() };
    //     R_c_b = aa_c_b.toRotationMatrix();
    // }
    //杆臂值
    let T_c_b = [[0], [0], [0]];
    // if (caled_c_b.norm() != 0) {
    //     T_c_b = caled_c_b;
    // }
    // 1-姿态（角度）旋转矩阵转换

    let t1 = matrix.multiply(R_m_m0, R_E_m);
    let t2 = matrix.multiply(t1, R_n_E);
    let t3 = matrix.multiply(t2, R_b_n);
    let t4 = matrix.multiply(t3, R_c_b);
    R_i_m0 = matrix.multiply(t4, R_i_c);

    // 2-位置转换
    //物方坐标系选择切平面直角坐标系时，地心空间坐标为（X0,Y0,Z0),地心大地坐标为(B0,L0,0)
    let R_E_m_0 = matrix.multiply(matrix.transpose(this.Rx(90 - B0)), matrix.transpose(this.Rz(90 + L0)));
    t1 = matrix.multiply(R_n_E, R_b_n);
    t2 = matrix.multiply(t1, T_c_b);
    let Cs_e = matrix.addition(this.lla_to_ecef(L, B, H), t2);
    let C0_e = this.lla_to_ecef(L0, B0, 0);
    //转置矩阵是世界坐标到相机坐标系
    R = matrix.transpose(R_i_m0);
    t3 = matrix.subtraction(Cs_e, C0_e);
    C = matrix.multiply(R_E_m_0, t3);
    //
    T = matrix.multiply(matrix.scalar(_.cloneDeep(R), -1.0), C);
    return { R, C, T }
}

/**
* 获得相机中心与像素点射线方向向量在世界坐标中的点坐标
*
*/
iD.util.getPixelDirectionVector = function (K, R, T, pixel) {
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

/**
* 求线（段）与面的交点
*
* @param P1 线段起点
* @param P2 线段终点
* @param plane_P 点
* @param plane_N 点所在面的法线
* @param cross_type 交点是否在线段之上，0在，1-起点，2-终点，3-起点之前，4-终点之后
* @param cross_distance 交点到点的距离
*
* @return 交点
*/
iD.util.GetLinePlaneCross = function (P1, P2, plane_P, plane_N) {
    //
    let n1 = P2;
    // let n1 = this.normalizedSqrt(matrix.subtraction(P2, P1));
    let C = _.cloneDeep(P1);
    //
    let X1 = plane_P;
    let n2 = plane_N;
    //求线面交点
    let t = (n2[0] * (X1[0] - C[0]) + n2[1] * (X1[1] - C[1]) + n2[2] * (X1[2] - C[2])) /
        (n2[0] * n1[0] + n2[1] * n1[1] + n2[2] * n1[2]);
    //
    let x = C[0][0] + n1[0][0] * t;
    let y = C[1][0] + n1[1][0] * t;
    let z = C[2][0] + n1[2][0] * t;
    //
    let cross = [[x], [y], [z]];
    //判断交点是否在线段之上
    // cross_type = Get3DPedalType(P1, P2, cross, 0.05);
    // cross_distance = (cross - plane_P).norm();
    //
    return cross;
}
//     /**
//   *
//   * @param P1
//   * @param P2
//   * @param Pedal
//   * @param dis_min_delta
//   * @return
//   */
//     int GeomAlgorithm:: Get3DPedalType(const Eigen:: Vector3d & P1, const Eigen:: Vector3d & P2, const Eigen:: Vector3d & Pedal,
//         double dis_min_delta) {
//         Eigen:: Vector3d N = (P2 - P1).normalized();
//         //
//         double p1_distance = (P1 - Pedal).norm();
//         double p2_distance = (P2 - Pedal).norm();
//         if (p1_distance <= dis_min_delta) {
//             return PEDAL_START;
//         }
//         if (p2_distance <= dis_min_delta) {
//             return PEDAL_END;
//         }
//         //应该不与起点或者终点重合
//         Eigen:: Vector3d N1 = Pedal - P1;
//         Eigen:: Vector3d N2 = Pedal - P2;
//         //计算两个向量的夹角
//         double angle1 = Get3DVectorAngle(N, N1);
//         double angle2 = Get3DVectorAngle(N, N2);
//         //
//         if (angle1 < 90 && angle2 > 90) {
//             return PEDAL_MIDDLE;
//         }
//         if (angle1 < 90 && angle2 < 90) {
//             //终点之后
//             return PEDAL_END_AFTER;
//         }
//         if (angle1 > 90 && angle2 > 90) {
//             //起点之前
//             return PEDAL_START_BEFORE;
//         }
//         //
//         return -1;
//     }

// double GeomAlgorithm:: Get3DVectorAngle(const Eigen:: Vector3d & v1, const Eigen:: Vector3d & v2) {
//     double acos_i = v1.dot(v2) / (v1.norm() * v2.norm());
//     if (acos_i < -1) {
//         acos_i = -1;
//     }
//     if (acos_i > 1) {
//         acos_i = 1;
//     };
//     double angle = acos(acos_i) * 180.0 / M_PI;
//     return angle;
// }

/**
 * Convert ECEF (XYZ) to lon,lat,alt values for the WGS84 ellipsoid
 * @param x X ECEF coordinate
 * @param y Y ECEF coordinate
 * @param z Z ECEF coordinate
 * @return LLA corresponding coordinates
 */
iD.util.ecef_to_lla = function (x, y, z) {
    // WGS84 Ellipsoid
    let WGS84_A = 6378137.0;       // major axis
    let WGS84_B = 6356752.314245;  // minor axis
    let WGS84_E = 0.0818191908;    // first eccentricity
    let b = Math.sqrt(WGS84_A * WGS84_A * (1 - WGS84_E * WGS84_E));
    let ep = Math.sqrt((WGS84_A * WGS84_A - b * b) / (b * b));
    let p = Math.sqrt(x * x + y * y);
    let th = Math.atan2(WGS84_A * z, b * p);
    let lon = Math.atan2(y, x);
    let lat = Math.atan2((z + ep * ep * b * Math.pow(Math.sin(th), 3)), (p - WGS84_E * WGS84_E * WGS84_A * Math.pow(Math.cos(th), 3)));
    let N = WGS84_A / Math.sqrt(1 - WGS84_E * WGS84_E * Math.sin(lat) * Math.sin(lat));
    let alt = p / Math.cos(lat) - N;

    return [this.R2D(lon), this.R2D(lat), alt];
}
/**
*
* @param xyz
* @param P0
* @param llh
*/
iD.util.Local2Wgs = function (xyz, P0) {
    //由3-22公式
    let B0 = P0[1];
    let L0 = P0[0];
    //
    let R_E_m_0 = matrix.multiply(matrix.transpose(this.Rx(90 - B0)), matrix.transpose(this.Rz(90 + L0)));

    //
    let C0_e = this.lla_to_ecef(L0, B0, 0);
    let XYZ = matrix.addition(matrix.multiply(matrix.transpose(R_E_m_0), xyz), C0_e);;

    //
    let blh = this.ecef_to_lla(XYZ[0][0], XYZ[1][0], XYZ[2][0]);

    return blh;
}

iD.util.CreateBatchProp = function (K, point, delta, imageWidth, imageHeight, principlePointX, principlePointY) {
    //
    // UpdateFinalRC();
    // TrackPointBatchPropPtr track_point_prop = std::make_shared<TrackPointBatchProp>();
    // //
    // track_point_prop->track_point_id = track_point_id;
    // track_point_prop->track_id = track_id;
    // track_point_prop->llh = llh;
    // track_point_prop->rpa = rpa;
    // track_point_prop->origin_llh = {lng, lat, height};
    // track_point_prop->origin_rpa = {roll, pitch, azimuth};
    // //设置相机视椎体，相当于内参
    // Eigen::Vector4d frustum = camera->GetGLFrustum(near, far);
    // track_point_prop->frustum(0) = frustum(0);
    // track_point_prop->frustum(1) = frustum(1);
    // track_point_prop->frustum(2) = near;
    // track_point_prop->frustum(3) = far;
    // track_point_prop->frustum(4) = frustum(2);
    // track_point_prop->frustum(5) = frustum(3);
    // //
    // track_point_prop->gnss_quality = gnss_quality;
    // track_point_prop->ins_quality = ins_quality;
    // //
    //
    function getPixelDirection(K, R, T, C, pixel) {
        let vw = iD.util.getPixelDirectionVector(K, R, T, pixel);
        let dir = iD.util.normalizedSqrt(matrix.subtraction(vw, C));
        return dir;
    }
    let RTC = this.Pos2CameraLocal(point, delta);
    let image_width = imageWidth;
    let image_height = imageHeight;

    let center = [point.x,point.y];
    
    //
    // Eigen:: AngleAxis < double > aa(-90.0 * M_PI / 180, Eigen:: Vector3d(1, 0, 0));
    //主光轴方向
    // let principlePointX = camera_params.principlePointX;
    // let principlePointY = camera_params.principlePointY;
    // let vw = this.getPixelDirectionVector(K, R, C, [principlePointX, principlePointY]);
    let center_dir = getPixelDirection(K, RTC.R, RTC.T, RTC.C, [principlePointX, principlePointY]);
    //假设相平面位置1米远
    let C2 = matrix.addition(C, matrix.scalar(_.cloneDeep(center_dir), 5));
    //利用线面交点求四个角点的空间位置

    let n1 = getPixelDirection(K, RTC.R, RTC.T, RTC.C, [0, 0]);
    let n2 = getPixelDirection(K, RTC.R, RTC.T, RTC.C, [0, image_height]);
    let n3 = getPixelDirection(K, RTC.R, RTC.T, RTC.C, [image_width, image_height]);
    let n4 = getPixelDirection(K, RTC.R, RTC.T, RTC.C, [image_width, 0]);
    //
    let xyz1 = iD.util.GetLinePlaneCross(C, n1, C2, center_dir);
    let xyz2 = iD.util.GetLinePlaneCross(C, n2, C2, center_dir);
    let xyz3 = iD.util.GetLinePlaneCross(C, n3, C2, center_dir);
    let xyz4 = iD.util.GetLinePlaneCross(C, n4, C2, center_dir);
    //
    let p1 = iD.util.Local2Wgs(xyz1, center);
    let p2 = iD.util.Local2Wgs(xyz2, center);
    let p3 = iD.util.Local2Wgs(xyz3, center);
    let p4 = iD.util.Local2Wgs(xyz4, center);
    let track_point_prop = { p1, p2, p3, p4 }
    return track_point_prop;
}