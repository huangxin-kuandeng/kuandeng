/*
 * @Author: tao.w
 * @Date: 2019-08-29 11:49:58
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-30 12:04:11
 * @Description: 
 */
iD.util = iD.util || {};

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


/**
 *
 * pos转换为摄影测量坐标系下的R,C,T
 * @param pos,转换点pos,gps 纬度、经度、高程，imu roll,pitch,yaw
 * @param pos0,参考点pos
 * @param R [out] 转换后的 R
 * @param T [out] 转换后的 T
 * @param C [out] 转换后的 C(UTM坐标）
 */
iD.util.pos2CameraRTC = function (pos, pos0, height, delta) {
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
    let utm = iD.util.LLtoUTM_(L, B);
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
    // var R_c_b = matrix.identity(3);
    var R_c_b = this.Cbn(delta.roll, delta.pitch, delta.azimuth);
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
/** 采用射线与普通平面相交来求交点坐标
* @param K 相机内参
* @param R 旋转矩阵
* @param C 相机中心
* @param pixel 像素点坐标
* @param plane_p 平面上一点
* @param plane_n 平面的法向量
*
* @param xyz [out] 测量结果
*/
//
// iD.util.linePlaneCross = function(K, R, C, pixel,plane_p, plane_n) {
//     let vw = getPixelDirectionVector(K, R, C, pixel);
//     //射线的方向向量
//     //m,n,p
//     let n1 = vw - C;
//     //地平面的平面方程
//     const X1 = plane_p;
//     const n2 = plane_n;
//     //求线面交点
//     let t = (n2(0) * (X1(0) - C(0)) + n2(1) * (X1(1) - C(1)) + n2(2) * (X1(2) - C(2))) /
//         (n2(0) * n1(0) + n2(1) * n1(1) + n2(2) * n1(2));
//     //
//     let x = C(0) + n1(0) * t;
//     let y = C(1) + n1(1) * t;
//     let z = C(2) + n1(2) * t;
//     //
//     return [x, y, z];
// }
//
// /**
//  * 获得相机中心与像素点射线方向向量在世界坐标中的点坐标
//  *
//  */
// iD.util.getPixelDirectionVector = function(K, R, C,pixel) {
//     //
//     let u0 = K[0][2];
//     let v0 = K[1][2];
//     let fx = K[0][0];
//     let fy = K[1][1];
//     //
//     let du = pixel[0] - u0;
//     let dv = pixel[1] - v0;
//     //
//     let r =Math.sqrt((du * du) / (fx * fx) + (dv * dv) / (fy * fy) + 1);
//     let v1 = du / fx / r;
//     let v2 = dv / fy / r;
//     let v3 = 1 / r;
//
//     let T =matrix.multiply(matrix.scalar(_.cloneDeep(R),-1.0),C);
//     let vc = [v1, v2, v3];
//     //VC=R*T*VW
//     let rt = matrix.identity(4);
//     // rt.block(0, 0, 3, 3) = R;
//     // rt.block(0, 3, 3, 1) = T;
//     //
//     let vw = (rt.inverse() * vc.homogeneous()).hnormalized();
//     //
//     return vw;
// }

iD.util.coordinates = {
    length: function (p1, p2) {
        return iD.util.norm(p1, p2);
    },
    xyz2Pixel: function (P, X) {
        let _x = _.cloneDeep(X);
        matrix.homogeneous(_x);
        // let xp = matrix.multiply(P,_x);
        //
        // x = iD.util.normalizedSqrt(xp);
        // return x;
        // if (xp[2] > 0) {
        //     return true;
        // } else {
        //     return false;
        // }

        let x = matrix.multiply(P, _x);
        let x1 = iD.util.hnormalized(x);
        return x1;
    }
}
iD.util.processGroundPlaneFrame = function (planeFrame, K, points, tgpps) {
    if (!points || !points.length) return;
    let start_frame_id = planeFrame.frameId;
    // let K = getKMatrix();
    let max_frame_id = points.length - 1;
    let min_y = 1024;
    let max_y = 2048;
    let max_x = 2448;
    //
    let max_distance = 50;
    let prev_frame_id = -1;
    let prev_y = -1;
    let prev_x = -1;
    let current_y = -1;
    let current_x = -1;
    let current_frame_id = -1;
    var current_distance = 10000;
    //
    var prev_c0, prev_n, current_c0, current_n;
    //
    let last_y = -1;
    //
    //
    let current_pos = points[start_frame_id - 1] && points[start_frame_id - 1].tags;
    if (!current_pos) return;
    let p = iD.util.KRt(K, current_pos.R, current_pos.T);
    //
    // let fids = _.pluck(tgpps, 'trackPointId');
    for (let i = start_frame_id + 1; i <= max_frame_id; i++) {
        let pos = points[i - 1].tags;
        let distance = iD.util.coordinates.length(pos.C, current_pos.C);
        /*
        if(i>=tgpps.length){
            continue;
        }
        */
        //      let tgpp = tgpps[i - 1].groundHeights;
        // let tgobj = tgpps[fids.indexOf(points[i].id)];
        let tgobj = _.find(tgpps, d => { return d.trackPointId == points[i].id });
        if (!tgobj || !tgobj.groundHeights) continue;
        let tgpp = tgobj.groundHeights;
        if (typeof tgpp === 'string') {
            tgpp = tgpp.trim();
        }
        if (!tgpp) continue;
        //
        // if (tgpp.status == 1) {
        //
        var pixel;
        let _c = [[tgpp.C[0]], [tgpp.C[1]], [tgpp.C[2]]];
        pixel = iD.util.coordinates.xyz2Pixel(p, _c);
        //
        current_y = pixel[1];
        current_x = pixel[0];
        current_frame_id = i;
        current_distance = distance;
        //
        current_c0 = _c;
        current_n = [[tgpp.N[0]], [tgpp.N[1]], [tgpp.N[2]]];
        //
        if (pixel[1] >= min_y && pixel[1] <= max_y && pixel[0] >= 0 && pixel[0] <= max_x) {
            //按照Y坐标插值
            if (prev_y != -1) {
                let delta_y = current_y - prev_y;
                //
                let pos_distance = iD.util.coordinates.length(current_c0, prev_c0);
                let pos_direction = iD.util.normalizedSqrt(matrix.subtraction(current_c0, prev_c0));
                //
                let dir_distance = iD.util.coordinates.length(current_n, prev_n);
                let dir_direction = iD.util.normalizedSqrt(matrix.subtraction(current_n, prev_n));
                //
                if (delta_y < 0) {
                    for (let y = prev_y; y >= current_y; y--) {
                        //
                        if (y >= min_y && y <= max_y) {
                            //
                            let p_d = pos_distance * (y - prev_y) / delta_y;
                            let d_d = dir_distance * (y - prev_y) / delta_y;
                            let c0 = matrix.addition(prev_c0, matrix.scalar([[pos_direction[0]], [pos_direction[1]], [pos_direction[2]]], p_d));
                            let n = matrix.addition(prev_n, matrix.scalar([[dir_direction[0]], [dir_direction[1]], [dir_direction[2]]], d_d));
                            let sgp = {
                                C0: c0,
                                N: n,
                                nearest_frame_id: 2 * y > delta_y ? i : prev_frame_id
                            };
                            //
                            planeFrame.pix_y_planes.set(y, sgp);
                            last_y = y;
                        }
                    }
                } else {
                    //
                    //break;
                }
            }
        }
        if ((current_y > 0 && current_y < min_y) || distance > max_distance) {
            break;
        }
        //
        prev_y = parseInt(pixel[1]);
        prev_x = parseInt(pixel[0]);
        //
        prev_frame_id = i;
        prev_c0 = current_c0;
        prev_n = current_n;
        // }
    }
    //看一下最后一对是否需要插值
    if (prev_y > min_y && current_y < min_y && current_x >= 0 && current_x <= max_x && prev_x >= 0 && prev_x <= max_x &&
        current_distance < max_distance) {
        let delta_y = current_y - prev_y;

        if (delta_y != 0) {
            //
            let pos_distance = iD.util.coordinates.length(current_c0, prev_c0);
            let pos_direction = iD.util.normalizedSqrt(matrix.subtraction(current_c0, prev_c0));
            //
            let dir_distance = iD.util.coordinates.length(current_n, prev_n);
            let dir_direction = iD.util.normalizedSqrt(matrix.subtraction(current_n, prev_n));
            //
            for (let y = prev_y; y >= current_y; y--) {

                if (y >= min_y && y <= max_y) {
                    //
                    let c0 = matrix.addition(prev_c0, matrix.scalar([[pos_direction[0]], [pos_direction[1]], [pos_direction[2]]], pos_distance * (y - prev_y) / delta_y));
                    let n = matrix.addition(prev_n, matrix.scalar([[dir_direction[0]], [dir_direction[1]], [dir_direction[2]]], dir_distance * (y - prev_y) / delta_y));
                    let sgp = {
                        C0: c0,
                        N: n,
                        nearest_frame_id: 2 * y > delta_y ? current_frame_id : prev_frame_id
                    };
                    //
                    planeFrame.pix_y_planes.set(y, sgp);
                    //
                    last_y = y;
                }
            }
        }
    }
    //记录最远的像素Y值
    planeFrame.min_pix_y = last_y;
    //
}

iD.util.trackGroundPlaneMeasurer = function (K, trackNode, piexl, mesh) {
    if (!mesh) return null;
    let R = trackNode.tags.R;
    let C = trackNode.tags.C;
    let T = trackNode.tags.T;
    let utm = iD.util.LLtoUTM_(trackNode.loc[0], trackNode.loc[1]);

    var vw = iD.util.getPixelDirectionVector(K, R, C, T, piexl); //[1224, 2000]
    var n1 = matrix.subtraction(vw, C);
    var n2 = iD.util.normalizedSqrt(n1);

    var origin = new THREE.Vector3(C[0][0], C[1][0], C[2][0]);
    var dir = new THREE.Vector3(n2[0], n2[1], n2[2]);

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(origin, dir);

    // //射线和模型求交，选中一系列直线
    // var intersects = raycaster.intersectObjects(geometry);
    // console.log('intersects: ', intersects)
    var test = [];
    mesh.raycast(raycaster, test);
    if (!test.length) return null;
    if (test[0].point) {
        let point = test[0].point;
        let ll = iD.util.UTMtoLL_(point.x, point.y, utm.zoneNumber, utm.designator);
        return { lng: ll[0], lat: ll[1], elevation: point.z };
    }
    return null
}

iD.util.groundPlaneMeasurer = function (loc1, loc2, ground) {

    let x1 = this.UTMProjection(loc1);
    let x2 = this.UTMProjection(loc2);

    let utm = iD.util.LLtoUTM_(loc2[0], loc2[1]);

    let n = this.normalized(x1, x2);

    var origin = new THREE.Vector3(x1[0], x1[1], loc1[2]);
    var dir = new THREE.Vector3(n[0][0], n[0][1], n[2][0]);

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(origin, dir);

    var test = [];
    ground.raycast(raycaster, test);
    if (!test.length) {
        return null;
    }
    test.sort(function (a, b) {
        return a.distance - b.distance;
    });
    if (test[0].point) {
        let point = test[0].point;
        let ll = iD.util.UTMtoLL_(point.x, point.y, utm.zoneNumber, utm.designator);
        return [ll[0], ll[1], point.z]
    }
    return null
}

iD.util.SimpleGroundPlaneMeasurer = function (frame_id, pixel, find_it, points, K) {

    function linePlaneCross(K, R, C, T, pixel, plane_p, plane_n) {

        let vw = iD.util.getPixelDirectionVector(K, R, C, T, pixel);
        //射线的方向向量
        //m,n,p
        let n1 = matrix.subtraction(vw, C);
        //地平面的平面方程
        let X1 = plane_p;
        let n2 = plane_n;
        //求线面交点
        let t = (n2[0] * (X1[0] - C[0][0]) + n2[1] * (X1[1] - C[1][0]) + n2[2] * (X1[2] - C[2][0])) /
            (n2[0] * n1[0][0] + n2[1] * n1[1][0] + n2[2] * n1[2][0]);
        //
        let x = C[0][0] + n1[0][0] * t;
        let y = C[1][0] + n1[1][0] * t;
        let z = C[2][0] + n1[2][0] * t;

        return [x, y, z];
    }
    
    if (!find_it) return false;
    //
    let frame_nums = points.length;

    if (frame_id >= 1 && frame_id <= frame_nums) {
        let pos = points[frame_id - 1];
        // let find_it = ground_planes_frames_.get(frame_id);
        //
        // if(!find_it){
        //     return false;
        // }

        // var keys = Array.from(ground_planes_frames_.keys()).sort(function(a, b) {
        //     return a - b;
        // })
        // if (find_it != ground_planes_frames_.get(_.last(keys))) {
        // let plane_frame = find_it;
        let y = pixel[1];
        if (y < find_it.min_pix_y || !find_it) {
            return false;
        }
        //
        let find_plane_it = find_it.pix_y_planes.get(y);
        if (!find_plane_it) {
            return false;
        }
        //
        keys = Array.from(find_it.pix_y_planes.keys()).sort(function (a, b) {
            return a - b;
        })

        if (find_plane_it != find_it.pix_y_planes.get(_.last(keys))) {
            //
            // let plane = find_plane_it;
            let xyzUTM = linePlaneCross(K, pos.tags.R, pos.tags.C, pos.tags.T, pixel, find_plane_it.C0, find_plane_it.N);
            //
            var utm = iD.util.LLtoUTM_(pos.loc[0], pos.loc[1]);
            let latLng = iD.util.UTMtoLL_(xyzUTM[0], xyzUTM[1], utm.zoneNumber, utm.designator);
            let xyz = { lng: latLng[0], lat: latLng[1], elevation: xyzUTM[2] };
            //
            // if (select_frame_id != nullptr) {
            let select_frame_id = find_plane_it.nearest_frame_id;
            // }
            return xyz;
            return {
                xyzUTM,
                xyz,
                select_frame_id
            };
        }
        // }
    }
    return false;
}



iD.util.updatePointT = function (p, C) {
    p.tags.T = matrix.multiply(matrix.scalar(_.cloneDeep(p.tags.R), -1.0), C);
}

//--二次方bezier
iD.util.SquareBezier = function (start_point, crt_point, end_point) {
    var p_start = [0, 0];
    var p_end = [];
    p_start = start_point;
    p_end = end_point;
    var p_crt1 = crt_point;
    /**
     * 计算公式：
     *            | 1  0  0|  |P0|
     * [1 t t*t ] |-2  2  0|  |P1|
     *            |1  -2  1|  |P2|
     * **/
    let getPoint = function (t) {
        var _matrix1 = [1, t, t * t];
        var _matrix2 = [
            [1, 0, 0]
            , [-2, 2, 0]
            , [1, -2, 1]
        ];
        var _matrix3 = [
            [p_start[0], p_start[1]]
            , [p_crt1[0], p_crt1[1]]
            , [p_end[0], p_end[1]]
        ];
        var _matrix_tmp = [
            _matrix1[0] * _matrix2[0][0] + _matrix1[1] * _matrix2[1][0] + _matrix1[2] * _matrix2[2][0]
            , _matrix1[0] * _matrix2[0][1] + _matrix1[1] * _matrix2[1][1] + _matrix1[2] * _matrix2[2][1]
            , _matrix1[0] * _matrix2[0][2] + _matrix1[1] * _matrix2[1][2] + _matrix1[2] * _matrix2[2][2]
        ];
        var _matrix_final = [
            _matrix_tmp[0] * _matrix3[0][0] + _matrix_tmp[1] * _matrix3[1][0] + _matrix_tmp[2] * _matrix3[2][0]
            , _matrix_tmp[0] * _matrix3[0][1] + _matrix_tmp[1] * _matrix3[1][1] + _matrix_tmp[2] * _matrix3[2][1]
        ];
        var _res_point = [_matrix_final[0], _matrix_final[1]];
        let z = iD.util.getBetweenPointLoc(start_point, end_point, _res_point);
        _res_point.push(z[2]);
        return _res_point;
    };
    return getPoint;
};//


iD.util.getSquareBezier = function (_start_point, _end_point, _crt_point1, size = 1, step = 0.05) {
    var _bezier = this.SquareBezier(_start_point, _crt_point1, _end_point);
    let locs = [];

    var _now_t = 0.01;
    while (_now_t < size) {
        sqrt_showing = false;
        locs.push(_bezier(_now_t));
        _now_t = _now_t + step;
    }
    return locs;
}

iD.util.getAngle = function (line1, line) {
    getAngle({
        x: pixes[0][0] - pixes[1][0],
        y: pixes[0][1] - pixes[1][1],
    }, {
        x: pixes[1][0] - pixes[2][0],
        y: pixes[1][1] - pixes[2][1],
    });

    getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }
}

iD.util.getPixelRang = function (xy, image_w, r) {
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

/**
 * @description: 杆 牌子 aboveGround高度测量
 * @param {type} 
 * @return {type} 
 */
// iD.util.aboveGroundMeasure = function (context,xy,type) {
//     function getTielXY(pixel){
//         // var pixel = context.projection.projectionPixel(xy);
//         var scale = context.projection.scale() * 2 * Math.PI;
//         let translate = context.projection.translate();
//         let x =pixel[0] - translate[0];
//         let y = translate[1] - pixel[1];
//         var tx = Math.floor((x + scale / 2) / 256);
//         var ty = Math.floor(-((y - scale / 2) / 256));
//         return [tx,ty];
//     }
//     let tileOrigin = [
//         context.projection.scale() * Math.PI - context.projection.translate()[0],
//         context.projection.scale() * Math.PI - context.projection.translate()[1]];

//     let z = null;
//     let _ts = 256;
//     // let map = context.map();
//     let tile = getTielXY(xy);
//     if (xy.length == 0 || !tile[0] || !tile[1]) return z;
//     let id = tile[0] + '_' + tile[1];
//     if (!context.aboveGrounds.hasOwnProperty(id)) return z;
//     let ground = context.aboveGrounds[id];
//     let _x = (tile[0] * _ts) - tileOrigin[0];
//     let _y = (tile[1] * _ts) - tileOrigin[1];

//     var _xy = [ parseInt(Math.abs(xy[0]-_x)), parseInt(Math.abs(xy[1]-_y))];

//     let pixels = this.getPixelRang(_xy, _ts, 4);
//     let t1 = 0x28000;;
//     // let type = Number(context.variable.aboveGround.attr.TYPE);


//     for (let i = 0; i < pixels.length; i++) {
//         let idx = pixels[i];
//         let _r = ground[idx] || 0;
//         let _g = ground[idx+1] || 0;
//         let _b = ground[idx+2] || 0;
//         let decoded_type = _r >> 4;
//         if(type != decoded_type || (!_r && !_g && !_b)) continue;
//         let _l = _b + (_g << 8) + ((_r & 15) << 16);
//         z = (_l-t1)/100;
//         return z ;
//     }

//     return z;
// }


// iD.util.TransformClassTMS = {
//     /*
//  * OSGEO TMS 标准，其坐标与Google瓦片坐标的tileY有差异
//  * 对比：http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection
//  *      http://2010.foss4g.org/presentations/3653.pdf 
//  * 转换：https://alastaira.wordpress.com/2011/07/06/converting-tms-tile-coordinates-to-googlebingosm-tile-coordinates/
//  * 标准：http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification
//  *      http://wiki.openstreetmap.org/wiki/TMS
//  * 适用地图：腾讯
//  * http://blog.csdn.net/mygisforum/article/details/22997879
//  */

//     _Math_sinh: function (x) {
//         return (Math.exp(x) - Math.exp(-x)) / 2;
//     },

//     /*
//      * 某一瓦片等级下瓦片地图X轴(Y轴)上的瓦片数目
//      */
//     _getMapSize: function (level) {
//         return Math.pow(2, level);
//     },

//     /*
//      * 分辨率，表示水平方向上一个像素点代表的真实距离(m)
//      */
//     getResolution: function (latitude, level) {
//         let resolution = 6378137.0 * 2 * Math.PI * Math.cos(latitude) / 256 / this._getMapSize(level);
//         return resolution;
//     },

//     _lngToTileX: function (longitude, level) {
//         let x = (longitude + 180) / 360;
//         let tileX = Math.floor(x * this._getMapSize(level));

//         /**
//          * 限定边界值, 解决 longitude=180 时边界值错误
//          */
//         tileX = Math.min(tileX, Math.pow(2, level) - 1);

//         return tileX;
//     },

//     _latToTileY: function (latitude, level) {
//         let lat_rad = latitude * Math.PI / 180;
//         let y = (1 + Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2;
//         let tileY = Math.floor(y * this._getMapSize(level));

//         // 代替性算法,使用了一些三角变化，其实完全等价
//         //let sinLatitude = Math.sin(latitude * Math.PI / 180);
//         //let y = 0.5 + Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
//         //let tileY = Math.floor(y * this._getMapSize(level));

//         return tileY;
//     },

//     /*
//      * 从经纬度获取某一级别瓦片坐标编号
//      */
//     lnglatToTile: function (longitude, latitude, level) {
//         let tileX = this._lngToTileX(longitude, level);
//         let tileY = this._latToTileY(latitude, level)

//         return [
//             tileX,
//             tileY
//         ];
//     },

//     _lngToPixelX: function (longitude, level) {
//         let x = (longitude + 180) / 360;
//         let pixelX = Math.floor(x * this._getMapSize(level) * 256 % 256);

//         return pixelX;
//     },

//     _latToPixelY: function (latitude, level) {
//         let sinLatitude = Math.sin(latitude * Math.PI / 180);
//         let y = 0.5 + Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
//         let pixelY = 255 - Math.floor(y * this._getMapSize(level) * 256 % 256);

//         return pixelY;
//     },

//     /*
//      * 从经纬度获取点在某一级别瓦片中的像素坐标
//      */
//     lnglatToPixel: function (longitude, latitude, level) {
//         let pixelX = this._lngToPixelX(longitude, level);
//         let pixelY = this._latToPixelY(latitude, level);

//         return {
//             pixelX,
//             pixelY
//         };
//     },

//     _pixelXTolng: function (pixelX, tileX, level) {
//         let pixelXToTileAddition = pixelX / 256.0;
//         let lngitude = (tileX + pixelXToTileAddition) / this._getMapSize(level) * 360 - 180;

//         return lngitude;
//     },

//     _pixelYToLat: function (pixelY, tileY, level) {
//         let pixelYToTileAddition = pixelY / 256.0;
//         let latitude = Math.atan(this._Math_sinh(Math.PI * (-1 + 2 * (tileY + 1 - pixelYToTileAddition) / this._getMapSize(level)))) * 180.0 / Math.PI;

//         return latitude;
//     },

//     /*
//      * 从某一瓦片的某一像素点到经纬度
//      */
//     pixelToLnglat: function (pixelX, pixelY, tileX, tileY, level) {
//         let lng = this._pixelXTolng(pixelX, tileX, level);
//         let lat = this._pixelYToLat(pixelY, tileY, level);

//         return {
//             lng,
//             lat
//         };
//     }

// }
iD.util.TransformClassTMS = {
    /*
  * 参考资料：http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
  * 适用地图：高德，Google Map，OSM
  */

    _Math_sinh: function (x) {
        return (Math.exp(x) - Math.exp(-x)) / 2;
    },


    /*
     * 某一瓦片等级下瓦片地图X轴(Y轴)上的瓦片数目
     */
    _getMapSize: function (level) {
        return Math.pow(2, level);
    },

    /*
     * 分辨率，表示水平方向上一个像素点代表的真实距离(m)
     */
    getResolution: function (latitude, level) {
        let resolution = 6378137.0 * 2 * Math.PI * Math.cos(latitude) / 256 / this._getMapSize(level);
        return resolution;
    },

    _lngToTileX: function (longitude, level) {
        let x = (longitude + 180) / 360;
        let tileX = Math.floor(x * this._getMapSize(level));

        /**
         * 限定边界值, 解决 longitude=180 时边界值错误
         * latitude 应该没问题, 因为 latitude 不会取到 90/-90
         */
        tileX = Math.min(tileX, Math.pow(2, level) - 1);

        return tileX;
    },

    _latToTileY: function (latitude, level) {
        let lat_rad = latitude * Math.PI / 180;
        let y = (1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2;
        let tileY = Math.floor(y * this._getMapSize(level));

        // 代替性算法,使用了一些三角变化，其实完全等价
        //let sinLatitude = Math.sin(latitude * Math.PI / 180);
        //let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
        //let tileY = Math.floor(y * this._getMapSize(level));

        return tileY;
    },

    /*
     * 从经纬度获取某一级别瓦片坐标编号
     */
    lnglatToTile: function (longitude, latitude, level) {
        let tileX = this._lngToTileX(longitude, level);
        let tileY = this._latToTileY(latitude, level)

        return [
            tileX,
            tileY
        ];
    },

    _lngToPixelX: function (longitude, level) {
        let x = (longitude + 180) / 360;
        let pixelX = Math.floor(x * this._getMapSize(level) * 256 % 256);

        return pixelX;
    },

    _latToPixelY: function (latitude, level) {
        let sinLatitude = Math.sin(latitude * Math.PI / 180);
        let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
        let pixelY = Math.floor(y * this._getMapSize(level) * 256 % 256);

        return pixelY;
    },

    /*
     * 从经纬度获取点在某一级别瓦片中的像素坐标
     */
    lnglatToPixel: function (longitude, latitude, level) {
        let pixelX = this._lngToPixelX(longitude, level);
        let pixelY = this._latToPixelY(latitude, level);

        return [
            pixelX,
            pixelY
        ];
    },

    _pixelXTolng: function (pixelX, tileX, level) {
        let pixelXToTileAddition = pixelX / 256.0;
        let lngitude = (tileX + pixelXToTileAddition) / this._getMapSize(level) * 360 - 180;

        return lngitude;
    },

    _pixelYToLat: function (pixelY, tileY, level) {
        let pixelYToTileAddition = pixelY / 256.0;
        let latitude = Math.atan(this._Math_sinh(Math.PI * (1 - 2 * (tileY + pixelYToTileAddition) / this._getMapSize(level)))) * 180.0 / Math.PI;

        return latitude;
    },

    /*
     * 从某一瓦片的某一像素点到经纬度
     */
    pixelToLnglat: function (pixelX, pixelY, tileX, tileY, level) {
        let lng = this._pixelXTolng(pixelX, tileX, level);
        let lat = this._pixelYToLat(pixelY, tileY, level);

        return [
            lng,
            lat
        ];
    },

}

iD.util.aboveGroundMeasure = function (context, loc, types) {

    function pixelRang(xy, rang) {
        let _rangs = [xy];
        for (let i = 1; i <= rang; i++) {
            let p1 = [xy[1], (xy[0] - i)]; //左
            let p2 = [xy[1], (xy[0] + i)]; //右
            let p3 = [(xy[1] - i), xy[0]]; //上
            let p4 = [(xy[1] + i), xy[0]]; //下
            let p5 = [(xy[1] - i), (xy[0] - i)]; //左上
            let p6 = [(xy[1] - i), (xy[0] + i)]; //右上
            let p7 = [(xy[1] + i), (xy[0] - i)]; //左下
            let p8 = [(xy[1] + i), (xy[0] + i)];//右下

            _rangs.push(p1, p2, p3, p4, p5, p6, p7, p8);
        }
        _rangs = _rangs.filter(d => { return d[0] >= 0 && d[0] < 257 && d[1] >= 0 && d[1] < 257 })
        return _rangs;
    }

    let z = null;
    let tile = this.getTileURL(loc, context._heightZoom);
    if (loc.length == 0 || !tile[0] || !tile[1]) return z;
    let id = tile[0] + '_' + tile[1];
    let ground = null;
    if (context.catchAboveGround.id == id) {
        ground = context.catchAboveGround.aboveGround;
    } else {
        if (!context.aboveGrounds.hasOwnProperty(id)) return z;
        var buffer = new Uint8Array(context.aboveGrounds[id]);
        try {
          
            var message = context.aboveGroundsPBRoot.decode(buffer);
            let pixel = message.pixel;
            let obj  = new Map();
            for (let i = 0; i < pixel.length; i++) {
                let p = pixel[i];
                if (obj.has(p.row)) {
                    let v = obj.get(p.row);
                    v.push({ col: p.col, element: p.element });
                } else {
                    let valuse = [];
                    valuse.push({ col: p.col, element: p.element });
                    obj.set(p.row, valuse);
                }
            }
            context.catchAboveGround.id = id;
            context.catchAboveGround.aboveGround = obj;
        } catch (err) {
            ground = null; 
            console.log("Error: " + err);
        }

    }
    if (!ground) return z;

    let pixel = this.TransformClassTMS.lnglatToPixel(loc[0], loc[1], context._heightZoom);
    let pixels = pixelRang(pixel, 4);

    let heights = [];

    for (let i = 0; i < pixels.length; i++) {
        let pixel = pixels[i];
        let row = ground.get(pixel[1]);
        if (!row) continue;
        let col = row.find(d => { return d.col == pixel[0] });
        if (!col) continue;
        let elements = col.element;
        let _el = elements.filter(d => {
            return types.includes(d.type.toString());
        })
        if (!_el.length) continue;
        if (context.variable.aboveGround.edge == 1) {
            heights.push(_el[0].lowHeight)
            // return _el[0].lowHeight;
        } else {
            heights.push(_el[0].highHeight)
            // return _el[0].highHeight;
        }
    }
    if (heights.length) {
        if (context.measuringTrack) {
            let nodes = context.measuringTrack.nodes;
            let locs = _.pluck(nodes, 'loc');
            let dist = iD.util.pt2LineDist2(locs, loc);
            let node = nodes[dist.i];
            if (dist.dis < 20) {
                heigth = node.loc[2];
                heights.sort((a, b) => { return (a - heigth) - (b - heigth) });
            }
        }
        return heights[0];
    }

    return z;
}
// iD.util.aboveGroundMeasure = function (context, loc, type) {

//     function pixelRang(xy, rang) {
//         let _rangs = [xy];
//         for (let i = 1; i <= rang; i++) {
//             let p1 = [xy[1], (xy[0] - i)]; //左
//             let p2 = [xy[1], (xy[0] + i)]; //右
//             let p3 = [(xy[1] - i), xy[0]]; //上
//             let p4 = [(xy[1] + i), xy[0]]; //下
//             let p5 = [(xy[1] - i), (xy[0] - i)]; //左上
//             let p6 = [(xy[1] - i), (xy[0] + i)]; //右上
//             let p7 = [(xy[1] + i), (xy[0] - i)]; //左下
//             let p8 = [(xy[1] + i), (xy[0] + i)];//右下

//             _rangs.push(p1, p2, p3, p4, p5, p6, p7, p8);
//         }
//         _rangs = _rangs.filter(d=>{ return d[0]>=0 && d[0]<257 && d[1]>=0 && d[1]<257})
//         return _rangs;
//     }

//     let z = null;
//     let tile = this.getTileURL(loc, context._heightZoom);
//     if (loc.length == 0 || !tile[0] || !tile[1]) return z;
//     let id = tile[0] + '_' + tile[1];
//     if (!context.aboveGrounds.hasOwnProperty(id)) return z;
//     let ground = context.aboveGrounds[id];


//     let pixel = this.TransformClassTMS.lnglatToPixel(loc[0],loc[1],context._heightZoom);
//     let pixels = pixelRang(pixel, 4);

//     let heights = [];

//     for (let i = 0; i < pixels.length; i++) {
//         let pixel = pixels[i];
//         let row = ground.get(pixel[1]);
//         if(!row) continue;
//         let col = row.find(d=>{ return d.col == pixel[0]});
//         if(!col) continue;
//         let elements = col.element;
//         let _el = elements.filter(d=>{
//             return d.type.toString() == type;
//         })
//         if(!_el.length)continue;
//         if(context.variable.aboveGround.edge == 1){
//             heights.push(_el[0].lowHeight)
//             // return _el[0].lowHeight;
//         }else{
//             heights.push(_el[0].highHeight)
//             // return _el[0].highHeight;
//         }
//     }
//     if(heights.length){
//         if (context.measuringTrack) {
//             let nodes = context.measuringTrack.nodes;
//             let locs = _.pluck(nodes, 'loc');
//             let dist = iD.util.pt2LineDist2(locs, loc);
//             let node = nodes[dist.i];
//             if (dist.dis < 20) {
//                 heigth = node.loc[2];
//                 heights.sort((a,b)=>{ return (a-heigth) - (b-heigth)});
//             } 
//         }
//         return heights[0];
//     }

//     return z;
// }


/**
 * @description: 正射图像测量
 * @param {type} 
 * @return: 
 */
iD.util.orthophotoSurvey = function (trackPoint, xy) {
    // 从info_xx.json中获取正射影像的信息，高程最大最小值，图像高宽，yaw角度值
    let min_z = trackPoint.tags.min_z;
    let max_z = trackPoint.tags.max_z;
    let image_h = trackPoint.tags.picH;
    let image_w = trackPoint.tags.picW;

    let yaw = trackPoint.tags.yaw;
    let radian_yaw = yaw / 180.0 * Math.PI;
    let cos_ = Math.cos(radian_yaw);
    let sin_ = Math.sin(radian_yaw);
    let R1 = [
        [cos_, -sin_, 0],
        [sin_, cos_, 0,],
        [0, 0, 1]
    ];
    let R1_TRA = matrix.transpose(R1);
    //
    // 测量像素坐标(pixel_x, pixel_y)
    // 获取高程值
    // let height = projection_result_ptr -> height_mat.at<uchar>(pixel_y, pixel_x);
    let idx = xy[1] * 4 * image_w + xy[0] * 4;
    let _r = trackPoint.tags.picHeight[idx] || 0;
    let _g = trackPoint.tags.picHeight[idx + 1] || 0;

    let height = (_r << 8) | _g;

    // format height，格式化高程值
    let z = min_z + (max_z - min_z) * (height / 65535.00);
    // get x, y， 计算转换后的xy坐标，projection_result_ptr->precision是分辨率(0.005)
    let transfer_x = trackPoint.tags.min_x + xy[0] * trackPoint.tags.precision;
    let transfer_y = trackPoint.tags.min_y + (image_h - xy[1] - 1) * trackPoint.tags.precision;
    // transfer， 计算最终的UTM坐标
    let transfer = [[transfer_x], [transfer_y], [z]];
    let utm_coord = matrix.multiply(R1_TRA, transfer);
    // console.log('orthophotoSurvey-', utm_coord);
    let utm = iD.util.LLtoUTM_(trackPoint.loc[0], trackPoint.loc[1]);
    let ll = iD.util.UTMtoLL_(utm_coord[0], utm_coord[1], utm.zoneNumber, utm.designator);
    return { lng: ll[0], lat: ll[1], elevation: utm_coord[2][0] };
    return utm_coord;
}
/** 正射图经纬度反投影
 * @description: 
 * @param {type} 
 * @return: 
 */
iD.util.orthophotoCounterInvestment = function (trackPoint, loc) {

    let yaw = trackPoint.tags.yaw;
    let radian_yaw = yaw / 180.0 * Math.PI;
    let cos_ = Math.cos(radian_yaw);
    let sin_ = Math.sin(radian_yaw);
    let R1 = [
        [cos_, -sin_, 0],
        [sin_, cos_, 0,],
        [0, 0, 1]
    ];
    let utm = iD.util.LLtoUTM_(loc[0], loc[1]);
    orgutmx = utm.x;
    orgutmy = utm.y;
    zoneo = utm.zoneNumber;

    let transfer = matrix.multiply(R1, [[orgutmx], [orgutmy], [loc[2]]]);
    transfer_x = transfer[0];
    transfer_y = transfer[1];
    let min_x = trackPoint.tags.min_x;
    let min_y = trackPoint.tags.min_y;
    // 计算像素坐标
    let x = (transfer_x - min_x) / trackPoint.tags.precision;
    let y = (transfer_y - min_y) / trackPoint.tags.precision;

    y = trackPoint.tags.picH - 1 - y;

    return [x, y]
}


iD.util.PolylineBuffer = function (coords, radius) {
    /// <summary>
    /// 根据给定的一系列有顺序的坐标，逆时针生成缓冲区的边界坐标。
    /// </summary>
    /// <param name="radius">缓冲区半径</param>
    /// <returns>缓冲区的边界坐标</returns>

    function GetQuadrantAngle(preCoord, nextCoord) {
        let x = nextCoord[0] - preCoord[0];
        let y = nextCoord[2] - preCoord[2];
        let theta = Math.atan(y / x);
        if (x > 0 && y > 0) return theta;
        if (x > 0 && y < 0) return Math.PI * 2 + theta;
        if (x < 0 && y > 0) return theta + Math.PI;
        if (x < 0 && y < 0) return theta + Math.PI;
        return theta;
    }

    if (coords.length < 2) return null;
    //分别生成左侧和右侧的缓冲区边界点坐标串
    let leftBufferCoords = GetLeftBufferEdgeCoords(coords, radius);
    coords.reverse();
    let rightBufferCoords = GetLeftBufferEdgeCoords(coords, radius);
    return leftBufferCoords.concat(rightBufferCoords);

    /// <summary>
    /// 根据给定的一系列有顺序的坐标，逆时针生成轴线左侧的缓冲区边界点
    /// </summary>
    /// <param name="coords">一系列有顺序的坐标</param>
    /// <param name="radius">缓冲区半径</param>
    /// <returns>缓冲区的边界坐标</returns>
    function GetLeftBufferEdgeCoords(coords, radius) {

        //计算时所需变量
        let alpha = 0.0;//向量绕起始点沿顺时针方向旋转到X轴正半轴所扫过的角度
        let delta = 0.0;//前后线段所形成的向量之间的夹角
        let l = 0.0;//前后线段所形成的向量的叉积

        //辅助变量
        let _coords = [];
        let startRadian = 0.0;
        let endRadian = 0.0;
        let beta = 0.0;
        let x = 0.0, y = 0.0;

        //第一节点的缓冲区
        {
            alpha = GetQuadrantAngle(coords[0], coords[1]);
            startRadian = alpha + Math.PI;
            endRadian = alpha + (3 * Math.PI) / 2;
            _coords.push(...GetBufferCoordsByRadian(coords[0], startRadian, endRadian, radius));
        }

        //中间节点
        for (let i = 1; i < coords.Count - 1; i++) {
            alpha = GetQuadrantAngle(coords[i], coords[i + 1]);
            delta = GetIncludedAngel(coords[i - 1], coords[i], coords[i + 1]);
            l = GetVectorProduct(coords[i - 1], coords[i], coords[i + 1]);
            if (l > 0) {
                startRadian = alpha + (3 * Math.PI) / 2 - delta;
                endRadian = alpha + (3 * Math.PI) / 2;
                // if (_coords.length > 0) strCoords.Append(";");
                _coords.push(...GetBufferCoordsByRadian(coords[i], startRadian, endRadian, radius));
            }
            else if (l < 0) {
                beta = alpha - (Math.PI - delta) / 2;
                x = coords[i].X + radius * Math.cos(beta);
                y = coords[i].Y + radius * Math.sin(beta);
                _coords.push([x, y, coords[i][2]]);
            }
        }

        //最后一个点
        {
            alpha = GetQuadrantAngle(coords[coords.length - 2], coords[coords.length - 1]);
            startRadian = alpha + (3 * Math.PI) / 2;
            endRadian = alpha + 2 * Math.PI;
            // if (strCoords.Length > 0) strCoords.Append(";");
            _coords.push(...GetBufferCoordsByRadian(coords[coords.length - 1], startRadian, endRadian, radius));
        }

        return _coords;
    }

    /// <summary>
    /// 获取指定弧度范围之间的缓冲区圆弧拟合边界点
    /// </summary>
    /// <param name="center">指定拟合圆弧的原点</param>
    /// <param name="startRadian">开始弧度</param>
    /// <param name="endRadian">结束弧度</param>
    /// <param name="radius">缓冲区半径</param>
    /// <returns>缓冲区的边界坐标</returns>
    function GetBufferCoordsByRadian(center, startRadian, endRadian, radius) {
        let gamma = Math.PI / 6;

        let strCoords = [];
        let x = 0.0, y = 0.0;
        for (let phi = startRadian; phi <= endRadian + 0.000000000000001; phi += gamma) {
            x = center[0] + radius * Math.cos(phi);
            y = center[1] + radius * Math.sin(phi);
            strCoords.push([x, y, center[2]]);
        }
        return strCoords;
    }
    /// <summary>
    /// 获取相邻三个点所形成的两个向量的交叉乘积
    /// </summary>
    /// <param name="preCoord">第一个节点坐标</param>
    /// <param name="midCoord">第二个节点坐标</param>
    /// <param name="nextCoord">第三个节点坐标</param>
    /// <returns>相邻三个点所形成的两个向量的交叉乘积</returns>
    function GetVectorProduct(preCoord, midCoord, nextCoord) {
        return (midCoord[0] - preCoord[0]) * (nextCoord[1] - midCoord[1]) - (nextCoord[0] - midCoord[0]) * (midCoord[1] - preCoord[1]);
    }

}


iD.util.isRectangle = function (p1, p2, p3, p4) {
    if ((p1[0] == p2[0] && p1[1] == p2[1]) ||
        (p1[0] == p3[0] && p1[1] == p3[1]) ||
        (p1[0] == p4[0] && p1[1] == p4[1]) ||
        (p2[0] == p3[0] && p2[1] == p3[1]) ||
        (p2[0] == p4[0] && p2[1] == p4[1]) ||
        (p3[0] == p4[0] && p4[1] == p3[1])) {
        return false;
    }
    let len = new Set();
    len.add(getLengthSquare(p1, p2));
    len.add(getLengthSquare(p1, p3));
    len.add(getLengthSquare(p1, p4));
    len.add(getLengthSquare(p2, p3));
    len.add(getLengthSquare(p2, p4));
    len.add(getLengthSquare(p3, p4));

    let lenArr = [...len];
    let count = lenArr.length;
    if (count == 3 || count == 2) {
        if (count == 2) {
            return (Math.max(...lenArr) == 2 * Math.min(...lenArr));
        } else {
            let maxL = Math.max(...lenArr);
            let minL = Math.min(...lenArr);
            let _t = [minL, maxL];
            let otherL = lenArr.filter(d => {
                return !_t.includes(d);
            })
            return (minL + otherL[0] == maxL);
        }
    } else {
        return false;
    }
}

function getLengthSquare($point1, $point2) {
    $res = Math.pow($point1[0] - $point2[0], 2) + Math.pow($point1[1] - $point2[1], 2);
    return $res;
}
;
(function () {
    // http://mingnote.com/rotating-calipers-get-min-rectangle.html
    /*
    * =====================================================================================
    *    Description:  旋转卡壳计算最小面积矩形
    * =====================================================================================
    */
    let FLT_MAX = Infinity;

    class POINT {
        x
        y
        z
        constructor(x, y, z) {
            if (!x) return;
            if (x != null && y != null) {
                this.x = x;
                this.y = y;
                if (z != null) this.z = z;
            } else if (x.length >= 2) {
                this.x = x[0];
                this.y = x[1];
                if (x[2] != null) {
                    this.z = x[2];
                }
            }
        }
    };

    function swap(arr, a, b) {
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    /* 
     *        Name:  getdist
     * Description:  计算两点间的距离
     * 
     */
    function getdist(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    /* 
     *        Name:  getcross
     * Description:  计算叉积z方向的值，用于判断两个向量的转向
     * 
     */
    function getcross(p0, p1, p2) {
        return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
    }

    /* 
     *        Name:  getpod
     * Description:  计算两个向量的点积
     * 
     */
    function getdot(p0, p1, p2) {
        return (p1.x - p0.x) * (p2.x - p0.x) + (p1.y - p0.y) * (p2.y - p0.y);
    }

    /* 
     *        Name:  anglecmp
     * Description:  比较两个向量的逆时针转角方向，p1大于p2时返回大于0，等于时返回等于0
     * 
     */
    function anglecmp(p0, p1, p2) {
        let cross = getcross(p0, p1, p2);
        if (cross == 0) {
            return getdist(p0, p2) - getdist(p0, p1);
        }
        return cross;
    }

    /* 
     *        Name:  vectorsort
     * Description:  根据基点进行向量排序, 快速排序递归实现
     * 
     */
    function vectorsort(arr, left, right) {
        let i, mid, last;

        if (left >= right) {
            return;
        }

        mid = parseInt((left + right) / 2);
        swap(arr, left, mid);
        last = left;
        for (i = left + 1; i <= right; i++) {
            if (anglecmp(arr[0], arr[i], arr[left]) > 0) {
                swap(arr, i, ++last);
            }
        }
        swap(arr, left, last);
        vectorsort(arr, left, last - 1);
        vectorsort(arr, last + 1, right);
    }

    /* 
     *        Name:  getconvex
     * Description:  计算凸包
     * 
     */
    function getconvex(arr, len, _ns) {
        let i, base, top;

        /* 小于4个点的不计算凸包 */
        if (len < 4) {
            _ns[0] = len;
            return;
        }
        /* 计算基点，交换到0位置 */
        base = 0;
        for (i = 0; i < len; i++) {
            if (arr[i].y == arr[base].y && arr[i].x < arr[base].x) {
                base = i;
            } else if (arr[i].y < arr[base].y) {
                base = i;
            }
        }
        swap(arr, base, 0);

        /* 排序 */
        vectorsort(arr, 1, len - 1);

        /* 计算凸包 */
        top = 1;
        for (i = 2; i < len; i++) {
            while (top > 0 && getcross(arr[top - 1], arr[top], arr[i]) <= 0) {
                top--;
            }
            arr[++top] = arr[i];
        }
        _ns[0] = top;
    }

    function rotatingcalipers(arr, len, rectangle) {
        let top, down, right = 1,
            up = 0,
            left = 0,
            downlast, rightlast, uplast, leftlast;
        let area = FLT_MAX,
            dist, X, Y, k;
        let temp = new POINT();

        let _top = [top]
        getconvex(arr, len, _top);
        top = _top[0];
        arr[++top] = arr[0];

        for (down = 0; down < top; down++) {
            // find right
            while (getdot(arr[down], arr[down + 1], arr[right]) <= getdot(arr[down], arr[down + 1], arr[right + 1])) {
                right = (right + 1) % top;
            }

            // find up
            if (down == 0) {
                up = right;
            }
            while (getcross(arr[down], arr[down + 1], arr[up]) <= getcross(arr[down], arr[down + 1], arr[up + 1])) {
                up = (up + 1) % top;
            }

            // find down
            if (down == 0) {
                left = up;
            }
            while (getdot(arr[down], arr[down + 1], arr[left]) >= getdot(arr[down], arr[down + 1], arr[left + 1])) {
                left = (left + 1) % top;
            }

            dist = getdist(arr[down], arr[down + 1]);
            X = getcross(arr[down], arr[down + 1], arr[up]) / dist;
            temp.x = arr[right].x + arr[down].x - arr[left].x;
            temp.y = arr[right].y + arr[down].y - arr[left].y;
            Y = getdot(arr[down], arr[down + 1], temp);

            //计算面积
            if (area > X * Y) {
                area = X * Y;
                downlast = down;
                rightlast = right;
                uplast = up;
                leftlast = left;
            }
            //计算周长
            // if (area > (X + Y) * 2) {
            //     area = (X + Y) * 2;
            //     downlast = down;
            //     rightlast = right;
            //     uplast = up;
            //     leftlast = left;
            // }
        }

        // 计算外接矩形
        if (arr[downlast + 1].y == arr[downlast].y) {
            rectangle[0].x = arr[leftlast].x;
            rectangle[0].y = arr[downlast].y;

            rectangle[1].x = arr[rightlast].x;
            rectangle[1].y = arr[downlast].y;

            rectangle[2].x = arr[rightlast].x;
            rectangle[2].y = arr[uplast].y;

            rectangle[3].x = arr[leftlast].x;
            rectangle[3].y = arr[uplast].y;

        } else if (arr[downlast + 1].x == arr[downlast].x) {
            rectangle[0].x = arr[downlast].x;
            rectangle[0].y = arr[leftlast].y;

            rectangle[1].x = arr[downlast].x;
            rectangle[1].y = arr[rightlast].y;

            rectangle[2].x = arr[uplast].x;
            rectangle[2].y = arr[rightlast].y;

            rectangle[3].x = arr[uplast].x;
            rectangle[3].y = arr[leftlast].y;

        } else {
            k = (arr[downlast + 1].y - arr[downlast].y) / (arr[downlast + 1].x - arr[downlast].x);

            rectangle[0].x = (k * arr[leftlast].y + arr[leftlast].x - k * arr[downlast].y + k * k * arr[downlast].x) / (k * k + 1.0);
            rectangle[0].y = k * rectangle[0].x + arr[downlast].y - k * arr[downlast].x;

            rectangle[1].x = (k * arr[rightlast].y + arr[rightlast].x - k * arr[downlast].y + k * k * arr[downlast].x) / (k * k + 1.0);
            rectangle[1].y = k * rectangle[1].x + arr[downlast].y - k * arr[downlast].x;

            rectangle[2].x = (k * arr[rightlast].y + arr[rightlast].x - k * arr[uplast].y + k * k * arr[uplast].x) / (k * k + 1.0);
            rectangle[2].y = k * rectangle[2].x + arr[uplast].y - k * arr[uplast].x;

            rectangle[3].x = (k * arr[leftlast].y + arr[leftlast].x - k * arr[uplast].y + k * k * arr[uplast].x) / (k * k + 1.0);
            rectangle[3].y = k * rectangle[3].x + arr[uplast].y - k * arr[uplast].x;
        }

        return rectangle;
    }

    // function getLocs(pointList) {
    //     return pointList.map(function(d) {
    //         return [d.x, d.y]
    //     });
    // }

    function getRectLocs(locList) {
        // let a = locList || [
        //     [0, 0],
        //     [2, 1],
        //     [3, 3],
        //     [1, 2]
        // ];
        let a = locList;
        if (_.isEqual(a[0], _.last(a)[0]) && _.isEqual(a[1], _.last(a)[1])) {
            a.pop();
        }
        a = a.map(function (d) {
            return new POINT(d);
        });
        let b = new Array(4);
        b = b.fill(null).map(function () {
            return new POINT();
        });
        let length = a.length;
        rotatingcalipers(a, length, b);
        b.forEach(function (p) {
            p.z = a[0].z;
        });
        // console.log(getLocs(a));
        // console.log(getLocs(b));
        return b;
    }
    iD.util.getRotaingCalipersRectLocs = getRectLocs;
})();