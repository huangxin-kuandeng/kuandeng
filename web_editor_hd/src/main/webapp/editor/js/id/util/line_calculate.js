/**
 * Created by wt on 2015/7/30.
 */
iD.util.LineCalCulate=function()
{
    var lineCalCulate={};

    /*
     获取AB连线与正北方向的角度
     @return  AB连线与正北方向的角度（0~360）
     */
    lineCalCulate.getAngle = function(lngA,latA,lngB,latB){
        var A = transform(lngA,latA);
        var B = transform(lngB,latB);
        var dx=(B.RadLo-A.RadLo)*A.Ed;
        var dy=(B.RadLa-A.RadLa)*A.Ec;
        var angle=0.0;
        angle=Math.atan(Math.abs(dx/dy))*180./Math.PI;
        // angle = _.isNaN(angle)?0:angle;
        var dLo=B.Longitude-A.Longitude;
        var dLa=B.Latitude-A.Latitude;
        if(dLo>0&&dLa<=0){
            angle=(90.-angle)+90;
        }
        else if(dLo<=0&&dLa<0){
            angle=angle+180.;
        }else if(dLo<0&&dLa>=0){
            angle= (90.-angle)+270;
        }
        return angle;
    };

    /*
     求B点经纬度
     @param A 已知点的经纬度，
     @param distance   AB两地的距离  单位km
     @param angle  AB连线与正北方向的夹角（0~360）
     @return  B点的经纬度
     */
    lineCalCulate.calculateVerticalP = function(lng,lat,distance,angle){
        var P = transform(lng, lat);
        var dx = distance*1000*Math.sin(angle / 180.0 * Math.PI);
        var dy= distance*1000*Math.cos(angle / 180.0 * Math.PI);
        var bjd=(dx/P.Ed+P.RadLo)*180./Math.PI;
        var bwd=(dy/P.Ec+P.RadLa)*180./Math.PI;
        return transform(bjd, bwd);
    }

    lineCalCulate.getPathInCircle = function (center, radius, sdgre, edgre, c) {
        var PI = Math.PI, points = [], point = center;
        var d = radius / 6378137;
        var lat1 = (PI / 180) * point[1];
        var lng1 = (PI / 180) * point[0];
        for (var a = sdgre; a < edgre; a += c) {
            var tc = (PI / 180) * a;
            var y = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(tc));
            var dlng = Math.atan2(Math.sin(tc) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(y));
            var x = ((lng1 - dlng + PI) % (2 * PI)) - PI;
            var lnglat = [parseFloat(x * (180 / PI)), parseFloat(y * (180 / PI))];
            points.push(lnglat);
        }
        return points;
    }

    lineCalCulate.getIntersectionPoint=function(projection,startA,endA,startB,endB,interPoint)
    {
        var a=projection(startA);
        var b=projection(endA)
        var c=projection(startB)
        var d=projection(endB);
        /* a[1]=-a[1];
         b[1]=-b[1];
         c[1]=-c[1];
         d[1]=-d[1];*/
        var intersection = [0,0];
        var flag=0;
        if (Math.abs(b[1] - a[1]) + Math.abs(b[0] - a[0]) + Math.abs(d[1] - c[1])
            + Math.abs(d[0] - c[0]) == 0) {
            if ((c[0] - a[0]) + (c[1] - a[1]) == 0) {
           //     console.log("ABCD是同一个点！");
            } else {
           //     console.log("AB是一个点，CD是一个点，且AC不同！");
            }
            intersection=a;
            flag= 0;
        }

        if (Math.abs(b[1] - a[1]) + Math.abs(b[0] - a[0]) == 0) {
            if ((a[0] - d[0]) * (c[1] - d[1]) - (a[1] - d[1]) * (c[0] - d[0]) == 0) {
           //     console.log("A、B是一个点，且在CD线段上！");
            } else {
           //     console.log("A、B是一个点，且不在CD线段上！");

            }
            intersection=a;
            flag= 0;
        }
        if (Math.abs(d[1] - c[1]) + Math.abs(d[0] - c[0]) == 0) {
            if ((d[0] - b[0]) * (a[1] - b[1]) - (d[1] - b[1]) * (a[0] - b[0]) == 0) {
           //     console.log("C、D是一个点，且在AB线段上！");
            } else {
           //     console.log("C、D是一个点，且不在AB线段上！");
            }
            intersection=c;
            flag= 0;
        }

        if ((b[1] - a[1]) * (c[0] - d[0]) - (b[0] - a[0]) * (c[1] - d[1]) == 0) {
          //  console.log("线段平行，无交点！");
            intersection=c;
            flag= 0;
        }

        intersection[0] = ((b[0] - a[0]) * (c[0] - d[0]) * (c[1] - a[1]) -
            c[0] * (b[0] - a[0]) * (c[1] - d[1]) + a[0] * (b[1] - a[1]) * (c[0] - d[0])) /
            ((b[1] - a[1]) * (c[0] - d[0]) - (b[0] - a[0]) * (c[1] - d[1]));

        intersection[1] = ((b[1] - a[1]) * (c[1] - d[1]) * (c[0] - a[0]) - c[1]
            * (b[1] - a[1]) * (c[0] - d[0]) + a[1] * (b[0] - a[0]) * (c[1] - d[1]))
            / ((b[0] - a[0]) * (c[1] - d[1]) - (b[1] - a[1]) * (c[0] - d[0]));
        // intersection[0] = _.isNaN(intersection[0])? 0:intersection[0];
        // intersection[1] = _.isNaN(intersection[1])? 0:intersection[1];
        if ((intersection[0] - a[0]) * (intersection[0] - b[0]) <= 0
            && (intersection[0] - c[0]) * (intersection[0] - d[0]) <= 0
            && (intersection[1] - a[1]) * (intersection[1] - b[1]) <= 0
            && (intersection[1] - c[1]) * (intersection[1] - d[1]) <= 0) {

         //   console.log("线段相交于点(" + intersection[0] + "," + intersection[1] + ")！");
            flag= 1; // '相交
        } else {
         //   console.log("线段相交于虚交点(" + intersection[0] + "," + intersection[1] + ")！");
            flag= -1; // '相交但不在线段上
        }
        //intersection[1]=-intersection[1]
        var point=projection.invert(intersection);
        interPoint[0]=point[0];
        interPoint[1]=point[1];
        return flag;
    }

    //经纬度坐标转换
    var transform = function (lng, lat) {
        var Rc = 6378137;
        var Rj = 6356725;
        var LoDeg = lng;
        var LoMin = (lng - LoDeg) * 60;
        var LoSec = (lng - LoDeg - LoMin / 60.) * 3600;

        var LaDeg = lat;
        var LaMin = (lat - LaDeg) * 60;
        var LaSec = (lat - LaDeg - LaMin / 60.) * 3600;

        var Longitude = lng;
        var Latitude = lat;
        var RadLo = lng * Math.PI / 180.;
        var RadLa = lat * Math.PI / 180.;
        var Ec = Rj + (Rc - Rj) * (90. - Latitude) / 90.;
        var Ed = Ec * Math.cos(RadLa);
        var result = {"RadLo":RadLo,"RadLa":RadLa,"Ec":Ec,"Ed":Ed,"Longitude":Longitude,"Latitude":Latitude};
        return result;
    }

    //判断两个线段是否相交
    lineCalCulate.getIntersectLoc = function (nodes1, nodes2, graph) {
        var locs = [];
        var lineCal = iD.util.LineCalCulate();
        var interPoint = [0, 0];
        for (var j = 0; j < nodes1.length; j++) {
            if ((j + 1) > (nodes1.length - 1)) break;
            var nodes1_pre = graph.entity(nodes1[j]), nodes1_next = graph.entity(nodes1[j + 1]), pre_arr1 = [nodes1_pre.loc[0], nodes1_pre.loc[1], nodes1_next.loc[0], nodes1_next.loc[1]];
            for (var k = 0; k < nodes2.length; k++) {
                if ((k + 1) > (nodes2.length - 1)) break;
                var nodes2_pre = graph.entity(nodes2[k]), nodes2_next = graph.entity(nodes2[k + 1]), pre_arr2 = [nodes2_pre.loc[0], nodes2_pre.loc[1], nodes2_next.loc[0], nodes2_next.loc[1]];
                var loc = iD.util.lassExtend.SegmentIntersect(pre_arr1, pre_arr2);
                // lineCal.getIntersectionPoint(context.projection,[pre_arr1[0],pre_arr1[1]],[pre_arr1[2],pre_arr1[3]],[pre_arr2[0],pre_arr2[1]],[pre_arr2[2],pre_arr2[3]],interPoint);
                if(loc && loc.push){
//                  loc.push((nodes2_pre.loc[2]+nodes2_next.loc[2])/2);
                    loc = iD.util.getBetweenPointLoc(nodes2_pre.loc, nodes2_next.loc, loc);
                    locs.push(loc);
                }
                //loc && (locs.push(interPoint));
            }
        }
        return locs;
    }
    return lineCalCulate;
}


