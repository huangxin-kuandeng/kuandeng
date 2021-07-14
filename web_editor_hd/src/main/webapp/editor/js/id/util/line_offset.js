
iD.util.roadHelper = {

    //添加道路的首末端节点
    wayEndNodes : function (way,nodeIds) {

        function findSame(id) {
            for (var i= 0, r=nodeIds.length; i<r; i++) {
                if (id==nodeIds[i]) {
                    return true ;
                }
            }
            return false ;
        }

        //起点
        var ndId = way.nodes[0];
        if (!findSame(ndId)) {
            nodeIds[nodeIds.length] = ndId ;
        }

        //末点
        ndId = way.nodes[way.nodes.length-1];
        if (!findSame(ndId)) {
            nodeIds[nodeIds.length] = ndId ;
        }
    },
    waysSameNode : function (way0, way1, nodeIds) {

        var ndA0 = way0.nodes[0];
        var ndA1 = way0.nodes[way0.nodes.length-1];

        var ndB0 = way1.nodes[0];
        var ndB1 = way1.nodes[way1.nodes.length-1];

        if (ndA0==ndB0) {
            nodeIds[nodeIds.length] = ndA0 ;
        }
        else if (ndA0==ndB1) {
            nodeIds[nodeIds.length] = ndA0 ;
        }
        else if (ndA1==ndB0) {
            nodeIds[nodeIds.length] = ndA1 ;
        }
        else if (ndA1==ndB1) {
            nodeIds[nodeIds.length] = ndA1 ;
        }
    }
}

iD.util.RoadOffset = function()
{
    var OFFSET_DIR = {
        LEFT : 0,
        RIGHT: 1
    };
    var EPSILON = {
        zero6  : 1.0e-6 ,
        zero8  : 1.0e-8 ,
        zero12 : 1.0e-12,
        zero15 : 1.0e-15,
        offset : 0.0015
    } ;

    function Vector2(x,y) {
        this.x = x ? x : 0.0 ;
        this.y = y ? y : 0.0 ;
    }

    Vector2.prototype = {
        constructor : Vector2,
        set : function (b) {
            this.x = b.x ;
            this.y = b.y ;
            return this ;
        },
        setxy : function (x,y) {
            this.x = x ;
            this.y = y ;
            return this ;
        },
        plus : function (b) {
            this.x += b.x ;
            this.y += b.y ;
            return this ;
        },
        minus : function(b) {
            this.x -= b.x ;
            this.y -= b.y ;
            return this ;
        },
        substract : function(b) {
            return new Vector2(this.x-b.x, this.y-b.y);
        },
        multply : function (b) {
            this.x *= b ;
            this.y *= b ;
            return this ;
        },
        length : function () {
            return Math.sqrt(this.x*this.x + this.y*this.y) ;
        },
        lengthSqr : function () {
            return this.x*this.x + this.y*this.y ;
        },
        dotProduct : function (b) {
            return this.x*b.x + this.y*b.y ;
        },
        unit : function() {
            var dis = Math.sqrt(this.x*this.x + this.y*this.y) ;
            if (dis < EPSILON.zero15){
                this.x = 0.0;
                this.y = 0.0 ;
            }
            else {
                var rev = 1.0 / dis ;
                this.x *= rev;
                this.y *= rev ;
            }
            return dis ;
        },
        distance : function(b) {
            var dir = new Vector2(this.x-b.x, this.y-b.y);
            return dir.length();
        },
        distanceSqr : function(b) {
            var dir = new Vector2(this.x-b.x, this.y-b.y);
            return dir.lengthSqr();
        },
        // from 0 to PAI,no direction!
        angleTo : function(vec) {
           var n = this.dotProduct(vec);
           var m = this.length() * vec.length() ;
            if (m < EPSILON.zero12) {
                return 0.0 ;
            }
            return Math.acos(n/m) ;
        },
        //(xevt.t, xevt.pt, xevt.dis)
        distanceToSeg : function( p0,  p1, xevt) {
            if (xevt) {
                xevt.clear() ;
            }else {
                xevt = new PEvent();
            }

            var dir = p1.substract(p0);
            var wir = this.substract(p0);
            var s = (dir.x*dir.x + dir.y*dir.y);

            /* p0,p0 are same point.*/
            if ( s < EPSILON.zero12) {
                xevt.t = 0.0;
                xevt.pt.set(p0);
                xevt.dis = wir.length();
                return xevt;
            }
            else {
                /*
                 ** The intersection point of line segment and plane is between p0 and p1.
                 */
                var t = (dir.x*wir.x + dir.y*wir.y)/s;
                if (t < 0.0) {
                    xevt.t = 0.0;
                    xevt.pt.set(p0);
                    xevt.dis = wir.length();
                }else if (t > 1.0) {
                    xevt.t = 1.0;
                    xevt.pt.set(p1);
                    dir = this.substract(p1);
                    xevt.dis = dir.length();
                }else {
                    dir.multply(t) ;
                    xevt.t = t;
                    xevt.pt.set(p0).plus(dir);
                    dir = this.substract(xevt.pt);
                    xevt.dis = dir.length();
                }
            }
            return xevt;
        },
        distanceToLine : function(p0, p1, xevt) {
            if (xevt) {
                xevt.clear() ;
            }else {
                xevt = new PEvent();
            }

            var dir = p1.substract(p0);
            var wir = this.substract(p0);
            var s = (dir.x*dir.x + dir.y*dir.y);

            /* p0,p0 are same point.*/
            if ( s < EPSILON.zero12)
            {
                xevt.t = 0.0;
                xevt.pt.set(p0);
                xevt.dis=wir.length();
            }
            else {
                /*
                 ** The intersection point of line segment and plane is between p0 and p1.
                 */
                xevt.t = (dir.x*wir.x + dir.y*wir.y)/s;
                dir.multply(xevt.t) ;
                xevt.pt.set(p0).plus(dir);
                dir = this.substract(xevt.pt) ;
                xevt.dis = dir.length();
            }
            return xevt;
        }
    }

    function Line(p0, p1)
    {
        this.index = -1;
        this.xevt = 0;
        this.from = new Vector2(p0 ? p0.x:0.0, p0 ? p0.y:0.0);
        this.to = new Vector2(p1 ? p1.x:0.0, p1? p1.y:0.0);;
    }
    Line.prototype = {
        set : function(p0, p1) {
            this.from.set(p0) ;
            this.to.set(p1) ;
            return this ;
        },
        clone : function () {
            var p = new Line(this.from, this.to) ;
            p.index = this.index ;
            p.xevt = this.xevt ;
            return p ;
        },
        getNormal:function () {
            var dir = this.to.substract(this.from);
            dir.unit() ;
            return new Vector2(-dir.y, dir.x) ;
        },
        pointAt : function (t) {
            var dir = this.to.substract(this.from);
            dir.multply(t) ;
            return dir.plus(this.from);
        },
        subline : function (t0, t1) {
            var sub = this.clone() ;
            sub.from = this.pointAt(t0);
            sub.to = this.pointAt(t1);
            return sub ;
        },
        length : function() {
            return this.from.distance(this.to) ;
        },
        lengthSqr : function() {
            return this.from.distanceSqr(this.to) ;
        },
        IsCoLine : function(pt) {
            var xevt ; //PEvent
            xevt = this.to.distanceToLine(this.from, pt, xevt) ;
            if (xevt.dis < 9.99e-4) {
                return true ;
            }else {
                return false ;
            }
        },
        updateE : function(pt) {
            this.to.set(pt) ;
        }
    }

    //点事件
    function PEvent(){
        this.t = 0.0;
        this.pt = new Vector2();
        this.dis= 1.0e+20 ;
    }
    PEvent.prototype = {
        constructor : PEvent,
        isValid : function() {
            return (this.dis < 1.0e+20)
        },
        clear: function (b) {
            this.t = 0.0;
            this.pt = new Vector2();
            this.dis= 1.0e+20 ;
        }
    }

    //交点
    function X_Event () {
        this.index = -1 ;
        this.segA = -1;
        this.segA_t = 0;
        this.segA_p = new Vector2();

        this.segB = -1;
        this.segB_t = 0;
        this.segB_p = new Vector2();

        this.dsqr = 1.0e+20 ;
    }

    X_Event.prototype = {
        constructor : X_Event,
        isValid : function() {
            return (this.dsqr < 1.0e+20)
        },
        clear: function (b) {
            this.index = -1 ;
            this.segA = -1;
            this.segA_t = 0;

            this.segB = -1;
            this.segB_t = 0;

            this.dsqr = 1.0e+20 ;
        },
        clone : function() {
            var p = new X_Event ;
            p.index = this.index ;

            p.segA = this.segA ;
            p.segA_t = this.segA_t;
            p.segA_p.set(this.segA_p) ;

            p.segB = this.segB;
            p.segB_t = this.segB_t;
            p.segB_p.set(this.segB_p);

            p.dsqr = this.dsqr ;
            return p ;
        },
        swapAB : function() {
            var s = this.segA ;
            this.segA = this.segB;
            this.segB = s;

            var t = this.segA_t ;
            this.segA_t = this.segB_t;
            this.segB_t = t ;

            var p = new Vector2() ;
            p.set(this.segA_p) ;
            this.segA_p.set(this.segB_p) ;
            this.segB_p.set(p) ;
        }
    }

    function compare_xevt(x1, x2) {
        if (x1.segA < x2.segA)
            return -1;
        else if (x1.segA > x2.segA)
            return 1;
        else
        {
            if (x1.segA_t < x2.segA_t)
                return -1;
            else if (x1.segA_t > x2.segA_t)
                return 1;
            else
                return 0;
        }
    }

    function lineLineDistance2d(line0_base, line0_p1, line1_base, line1_p1, st) {
        var u = line0_base.substract(line1_base);
        var line0_direction = line0_p1.substract(line0_base);
        var line1_direction = line1_p1.substract(line1_base);

        var a = line0_direction.dotProduct(line0_direction);
        var b = line0_direction.dotProduct(line1_direction);
        var c = line1_direction.dotProduct(line1_direction);
        var d = line0_direction.dotProduct(u);
        var e = line1_direction.dotProduct(u);
        var f = u.dotProduct(u);
        var det = a * c - b * b;
        var s, t ;

        // Check for (near) parallelism
        if (det < EPSILON.zero12)
        {
            // Arbitrarily choose the base point of line0
            s = 0;
            // Choose largest denominator to minimize floating-point problems
            if (b > c) {
                t = d / b;
            }
            else {
                t = e / c;
            }
            st[0] = s ;
            st[1] = t ;
            //double tmp2 =  d * s + f;
            return t * (c * t - 2 * e) + f;
        }
        else
        {
            // Nonparallel lines
            var invDet = 1.0 / det;
            s = (b * e - c * d) * invDet;
            t = (a * e - b * d) * invDet;

            //书本中的代码有错
            //double tmp2 =  s * (a * s + b * t + 2 * d) + t * (b * s + c * t + 2 * e) + f;
            st[0] = s ;
            st[1] = t ;
            return s * (a * s - 2 * b*t + 2 * d) + t * (c * t - 2 * e) + f;;
        }
    }

    //    var evt = new X_Event;
    function segSegDistance2d(seg0_base, seg0_point, seg1_base, seg1_point, evt)
    {
        var s, t ;
        var u, v, seg0_direction, seg1_direction;
        var a, b, c, d, e, det;
        var sNum, tNum, tDenom, sDenom;

        u = seg0_base.substract(seg1_base) ;
        seg0_direction = seg0_point.substract(seg0_base);
        seg1_direction = seg1_point.substract(seg1_base);

        a = seg0_direction.dotProduct(seg0_direction);
        b = seg0_direction.dotProduct(seg1_direction);
        c = seg1_direction.dotProduct(seg1_direction);
        d = seg0_direction.dotProduct(u);
        e = seg1_direction.dotProduct(u);
        det = a * c - b * b;

        // Check for (near) parallelism
        if (det < EPSILON.zero12) {
            // Arbitrary choice
            if (a < EPSILON.zero12 && c < EPSILON.zero12) //seg0 and seg1 are points
            {
                evt.segA_t = 0.0;
                evt.segA_p.set(seg0_base);

                evt.segB_t = 0.0;
                evt.segB_p.set(seg1_base);

                evt.dsqr = u.dotProduct(u);
                return evt ;
            }
            else if (a < EPSILON.zero12) //seg0 is point
            {
                evt.segA_t = 0.0;
                evt.segA_p.set(seg0_base);

                if (e <= 0) {
                    // P0 is closest to Y
                    evt.segB_t = 0.0;
                    evt.segB_p.set(seg1_base);

                    evt.dsqr = u.dotProduct(u);
                }
                else if (e >= c) {
                    // P1 is closest to Y
                    evt.segB_t = 1.0;
                    evt.segB_p.set(seg1_point);
                    v = seg0_base.substract(seg1_point);

                    evt.dsqr = v.dotProduct(v);
                }
                else {
                    // closest point is interior to segment
                    //return ON_DotProduct(u, u) - t * t / DdD;
                    t = e / c;
                    evt.segB_t = t ;

                    //intpt1 = seg1_base + t * seg1_direction;
                    seg1_direction.multply(t) ;
                    evt.segB_p.set(seg1_base).plus(seg1_direction) ;

                    evt.dsqr = u.dotProduct(u) - e * t;
                }
                return evt;
            }
            else if (c < EPSILON.zero12) //seg1 is point
            {
                evt.segB_t = 0.0;
                evt.segB_p.set(seg1_base);

                if (-d <= 0) {
                    // P0 is closest to Y
                    evt.segA_t = 0.0;
                    evt.segA_p.set(seg0_base);

                    evt.dsqr = u.dotProduct(u);
                }
                else if (-d >= a) {
                    // P1 is closest to Y
                    evt.segA_t = 1.0;
                    evt.segA_p.set(seg0_point);

                    v = seg1_base.substract(seg0_point) ;
                    evt.dsqr = v.dotProduct(v);
                }
                else {
                    // closest point is interior to segment
                    //return ON_DotProduct(u, u) - s * s / DdD;
                    s = -d / a;
                    evt.segA_t = s;

                    //intpt0 = seg0_base + s * seg1_direction;
                    seg1_direction.multply(s) ;
                    evt.segA_p.set(seg0_base).plus(seg1_direction) ;

                    evt.dsqr = u.dotProduct(u) + d * s;;
                }
                return evt ;
            }
            else
            {
                sNum = 0;
                tNum = e;
                tDenom = c;
                sDenom = det;
            }
        }
        else {
            // Find parameter values of closest points
            // on each segment’s infinite line. Denominator
            // assumed at this point to be ‘‘det’’,
            // which is always positive. We can check
            // value of numerators to see if we’re outside
            // the [0, 1] x [0, 1] domain.
            sNum = b * e - c * d;
            tNum = a * e - b * d;
        }

        // Check s
        sDenom = det;
        if (sNum < 0) {
            sNum = 0;
            tNum = e;
            tDenom = c;
        }
        else if (sNum > det) {
            sNum = det;
            tNum = e + b;
            tDenom = c;
        }
        else {
            tDenom = det;
        }

        // Check t
        if (tNum < 0) {
            tNum = 0;
            if (-d < 0) {
                sNum = 0;
            }
            else if (-d > a) {
                sNum = sDenom;
            }
            else {
                sNum = -d;
                sDenom = a;
            }
        }
        else if (tNum > tDenom) {
            tNum = tDenom;
            if ((-d + b) < 0) {
                sNum = 0;
            }
            else if ((-d + b) > a) {
                sNum = sDenom;
            }
            else {
                sNum = -d + b;
                sDenom = a;
            }
        }

        // Parameters of nearest points on restricted domain
        if (Math.abs(sDenom) < EPSILON.zero12) s = 0.0;
        else      s = sNum / sDenom;

        if (Math.abs(tDenom) < EPSILON.zero12) t = 0.0;
        else      t = tNum / tDenom;

        // Dot product of vector between points is squared distance
        // between segments
        //v = (seg0.base + (s * seg0.direction)) - (seg1.base + (t * seg1.direction));
        //intpt0 = seg0_base + s * seg0_direction;
        //intpt1 = seg1_base + t * seg1_direction;

        evt.segA_t = s;
        evt.segA_p.set(seg0_base).plus(seg0_direction.multply(s));

        evt.segB_t = t;
        evt.segB_p.set(seg1_base).plus(seg1_direction.multply(t));

        evt.dsqr = evt.segB_p.distanceSqr(evt.segA_p);
        return evt ;
    }

    function SubLines (idx0, idx1, lines) {
        this.flag = 0;
        this.xindex = [idx0, idx1];
        this.lines = lines; //线段
    }

    //class Offset
    function Offset() {
        this.dir = OFFSET_DIR.LEFT;
        this.dist = 1.0;
        this.distSqr = 1.0;
        this.lines = [];
        this.offsets = [];
        this.result = [] ;
    }

    Offset.prototype = {
        constructor: Offset,
        getOffset : function(index) {
            return this.offsets[index];
        },
        firstRes : function() {
            if (this.result.length > 0) {
                return this.result[0];
            }
            return null;
        },
        clear : function () {
            if (this.lines.length>0) {
                delete this.lines ;
                this.lines = [];
            }

            if (this.offsets.length>0) {
                delete this.offsets ;
                this.offsets = [];
            }

            if (this.result.length > 0) {
                for(var i=0; i<this.result.length; i++) {
                    delete this.result[i];
                }
                delete this.result ;
                this.result = [] ;
            }
        },
        setDist: function (dis) {
            if (dis>0) {
                this.dir = OFFSET_DIR.LEFT;
                this.dist = dis;
                this.distSqr = (dis - EPSILON.offset)*(dis - EPSILON.offset);

            } else {
                this.dir = OFFSET_DIR.RIGHT;
                this.dist = -dis;
                this.distSqr = (dis + EPSILON.offset)*(dis + EPSILON.offset);
            }
            if (this.distSqr < EPSILON.zero8)
                return false;
            return true ;
        },
        setWay : function(graph,way,dis) {
            if (!this.setDist(dis)) {
                return [] ;
            }
            this.clear() ;
           
            var node ;
            var prv_pt = new Vector2(),
                nxt_pt = new Vector2(),
                min_pt = new Vector2(),
                max_pt = new Vector2();
            var count = way.nodes.length ;
            var basepoint = [], scale = 1.0e5 ;
            for (var i = 0; i < count; i++) {
                node = graph.entity(way.nodes[i]);
                if (i==0) {
                    basepoint[0] = node.loc[0] ;
                    basepoint[1] = node.loc[1] ;
                    prv_pt.setxy(0.0, 0.0);
                    min_pt.setxy(0.0, 0.0);
                    max_pt.setxy(0.0, 0.0);
                }
                else {
                    nxt_pt.setxy(scale*(node.loc[0] - basepoint[0]), scale*(node.loc[1] - basepoint[1]));
                    if (prv_pt.distanceSqr(nxt_pt) > EPSILON.zero8) {
                        // if (this.lines.length>0 && this.lines[this.lines.length-1].IsCoLine(nxt_pt)) {
                        //     this.lines[this.lines.length-1].updateE(nxt_pt) ;
                        // }else {
                            var line = new Line(prv_pt, nxt_pt) ;
                            line.index = this.lines.length;
                            this.lines[this.lines.length] = line;
                        // }
                        prv_pt.set(nxt_pt);
                        if (min_pt.x > nxt_pt.x) min_pt.x = nxt_pt.x ;
                        else if (max_pt.x < nxt_pt.x) max_pt.x = nxt_pt.x ;
                        if (min_pt.y > nxt_pt.y) min_pt.y = nxt_pt.y ;  
                        else if (max_pt.y < nxt_pt.y) max_pt.y = nxt_pt.y ;  
                    }
                }
            }

            // if (max_pt.x - min_pt.x > max_pt.y - min_pt.y) {
            //     //水平线
            //     dis = iD.geo.metersToLat(dis) * scale ;
            // }else{
            //     //竖直线
            //     dis = iD.geo.metersToLon(dis, basepoint[1]) * scale ;
            // }

            // if (!this.setDist(dis)) {
            //     return [] ;
            // }

            this.operate() ;

            //reverse
            return this.revTransform(basepoint,scale) ;
        },
        doOffset:function (shp, dis, scale) {
            if (!this.setDist(dis)) {
                return [] ;
            }
            if (scale==undefined) {
                scale = 1.0e5 ;
            }

            //1. 原始曲线
            var basepoint = [shp[0][0],shp[0][1]] ;
            var prv_pt = new Vector2(0.0, 0.0),
                nxt_pt = new Vector2(0.0, 0.0),
                count = shp.length;
            for (var i = 1; i < count; i++) {
                nxt_pt.setxy(scale*(shp[i][0]-basepoint[0]), scale*(shp[i][1]-basepoint[1]));
                if (prv_pt.distanceSqr(nxt_pt) > EPSILON.zero12) {
                    // if (this.lines.length>0 && this.lines[this.lines.length-1].IsCoLine(nxt_pt)) {
                    //     this.lines[this.lines.length-1].updateE(nxt_pt) ;
                    // }else {
                        var line = new Line(prv_pt, nxt_pt);
                        line.index = this.lines.length;
                        this.lines[this.lines.length] = line;
                    // }
                    prv_pt.set(nxt_pt);
                }
            }
            this.operate() ;

            return this.revTransform(basepoint,scale) ;
        },
        revTransform:function(basepoint,scale) {
            var invscale = 1.0/scale ;
            var pline_cnt = this.result.length ;
            for (var r=0; r<pline_cnt; r++) {
                var pline = this.result[r] ;
                for (var i=0; i<pline.length; i++) {
                    pline[i][0] = pline[i][0] * invscale + basepoint[0];
                    pline[i][1] = pline[i][1] * invscale + basepoint[1];
                }
            }
            return this.result ;
        },
        operate:function () {
            //2. 计算等距线
            var count = this.lines.length ;
            for (var i = 0; i < count; i++) {
                var line = this.lineOffset(this.lines[i]);
                this.offsets[this.offsets.length] = line;
            }

            //3. 处理等距相连段的延伸与裁剪
            count = this.offsets.length ;
            for (var i = 0; i < count-1; i++) {
                this.extendAndTrim(this.offsets[i], this.offsets[i+1]);
            }

            //4. 求交打断
            var xevent = [];
            count = this.offsets.length ;
            for (var i = 0;i < count; i++)
            {
                var line1 = this.offsets[i];
                for (var j = i + 1; j < count; j++)
                {
                    var line2 = this.offsets[j];
                    if (j==i + 1 && line1.to.distanceSqr(line2.from) < EPSILON.zero12) {
                        continue ;
                    }
                    this.intersection(line1, line2, xevent);
                }
            }

            //begin debug
            //     Debug_ClearAll();
            //     for (size_t i = 0; i < m_offsets.size(); i++)
            //     {
            //         Line & line1 = m_offsets[i];
            //         Debug_AddLine(line1.m_from, line1.m_to, line1.m_index);
            //     }
            //     for (size_t i = 0; i < x.size(); i++)
            //     {
            //         X_Event & evt = x[i];
            //         Debug_AddPoint(evt.m_A[0], evt.m_segA[0], evt.m_segB[0]);
            //     }
            // //end debug

            this.breakAtEvent(xevent);

            //将剩下的线段组成线条
            return this.result;
        },
        //计算等距线段
        lineOffset : function (seg) {

            var line = seg.clone();

            var normal = seg.getNormal();
            if (this.dir == OFFSET_DIR.LEFT) {
                normal.multply(this.dist) ;
            } else {
                normal.multply(-this.dist) ;
            }

            line.from.plus(normal);
            line.to.plus(normal);
            return line ;
        },
        extendAndTrim : function (line1, line2) {
            var st = [];
            var dis = lineLineDistance2d(line1.from, line1.to, line2.from, line2.to, st);
            if (dis < EPSILON.zero8)
            {
                if (st[0] > 0.0 && st[1] < 1.0)
                {
                    line1.to = line1.pointAt(st[0]);
                    line2.from.set(line1.to) ;
                }
            }
        },
        //std::vector<X_Event>& x
        intersection : function(line1, line2, x) {

            var evt = new X_Event;
            segSegDistance2d(line1.from, line1.to, line2.from, line2.to, evt) ;
            if (evt.dsqr < EPSILON.zero12)
            {
                evt.segA = line1.index;
                evt.segB = line2.index;
                x[x.length] = evt ;
            }
            else {
                delete evt ;
            }
        },
        //std::vector<X_Event>& x
        breakAtEvent : function (x){
            if (x.length < 1)
            { //form offset line
                var groups = [], index=-1 ; ////std::vector<SubLines*>
                while (this.offsets.length>0) {
                    var sublines = this.extractOffset(this.offsets) ;
                    if (!this.detectCollision(sublines))
                    {
                        var sub = new SubLines(index, index-1, sublines) ;
                        groups.push(sub) ;
                        index-=2 ;
                    }
                }
                this.formOffset(groups) ;
                return ;
            }

            //X_Event* x_sort = new X_Event[x.size()*2+1];
            var x_sort = [], xevt ;
            var cnt = x.length;
            for (var i = 0; i < cnt; i++)
            {
                x[i].index = i;
                x_sort.push(x[i]);
                xevt = x[i].clone() ;
                xevt.swapAB();
                x_sort.push(xevt);
            }
            x_sort.sort(compare_xevt);

            //std::vector<Line> m_offsets; //线段
            var groups = [] ; ////std::vector<SubLines*>
            var sublines = this.getSubLinesA(x_sort[0], 0);
            if (!this.detectCollision(sublines))
            {
                var sub = new SubLines(- 1, x_sort[0].index, sublines) ;
                groups.push(sub) ;
            }

            cnt = x_sort.length ;
            for (var i=0; i<cnt-1; i++) {
                sublines = this.getSubLinesB(x_sort[i], x_sort[i + 1]);
                if (!this.detectCollision(sublines))
                {
                    sub = new SubLines(x_sort[i].index, x_sort[i+1].index, sublines) ;
                    groups.push(sub) ;
                }
            }
            sublines = this.getSubLinesA(x_sort[cnt - 1], 1);
            if (!this.detectCollision(sublines))
            {
                sub = new SubLines(x_sort[cnt - 1].index, -2, sublines) ;
                groups.push(sub) ;
            }
            delete x_sort;

            //form offset lines
            this.formOffset(groups) ;
        },
        formOffset : function (groups) {
            while (groups.length > 0) {
                var lines = groups[0]; //SubLines
                var arr = this.toPolyline(lines.lines);
                groups.shift() ;

                if (lines.xindex[1]!=lines.xindex[0]) {

                    var x_index = lines.xindex[1];
                    while (x_index != -1)
                    {
                        var psub = this.findStartIndex(groups, x_index);
                        if (psub)
                        {
                            x_index = psub.xindex[1];
                            arr = this.appendLine(arr, psub.lines);
                            this.groupRemoveAt(groups, psub);
                        }
                        else
                        {
                            break;
                        }
                    }
                }

                this.result.push(arr);
            }
        },

        detectCollisionSeg : function(line) {
            var seg ,xevt = new X_Event ;
            var cnt = this.lines.length ;
            for( var i=0; i<cnt; i++) {
                seg = this.lines[i];
                segSegDistance2d(line.from, line.to, seg.from, seg.to, xevt);
                if (xevt.dsqr < this.distSqr) {
                    return true;
                }
            }
            return false;
        },
        //std::vector<Line>& sublines
        detectCollision : function(sublines) {
            var cnt = sublines.length ;
            if (cnt>0) {
                for( var i=0; i<cnt; i++) {
                    if (this.detectCollisionSeg(sublines[i])) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        },
        //std::vector<Line>& lines
        toPolyline : function(lines) {
            var cnt = lines.length ;
            if (cnt > 0) {
                var arr = [], pt;
                for( var i=0; i<cnt; i++) {
                    pt = lines[i].from;
                    arr.push([pt.x,pt.y]);
                }
                pt = lines[cnt-1].to;
                arr.push([pt.x,pt.y]);
                return arr;
            }
            return null ;
        },
        //std::vector<Line>& lines
        appendLine : function(arr, lines){
            var cnt = lines.length ;
            for(var i=0; i<cnt; i++) {
                var pt = lines[i].to;
                arr.push([pt.x,pt.y]);
            }
            return arr;
        },
        //X_EVENT& evt, int flag, std::vector<Line>& sublines
        getSubLinesA : function(evt, flag) {
            var subline, off, arr = [];
            if (flag == 0)
            {
                for (var i = 0; i < evt.segA; i++)
                {
                    off = this.getOffset(i);
                    subline = off.clone();
                    arr.push(subline);
                }

                off = this.getOffset(evt.segA);
                subline = off.subline(0.0, evt.segA_t) ;
                if (subline)
                    arr.push(subline);
            }
            else
            {
                off = this.getOffset(evt.segA);
                subline = off.subline(evt.segA_t, 1.0)
                if (subline)
                    arr.push(subline);

                var cnt = this.offsets.length;
                for (var i = evt.segA + 1; i < cnt; i++)
                {
                    off = this.getOffset(i);
                    subline = off.clone();
                    arr.push(subline);
                }
            }
            return arr ;
        },
        //X_EVENT& evt0, X_EVENT& evt1, std::vector<Line>& sublines
        getSubLinesB : function(evt0, evt1) {
            var subline, off,  arr = [];
            if (evt0.segA == evt1.segA)
            {
                off = this.getOffset(evt1.segA);
                subline = off.subline(evt0.segA_t, evt1.segA_t) ;
                if (subline){
                    arr.push(subline);
                }
            }
            else if (evt0.segA < evt1.segA)
            {
                off = this.getOffset(evt0.segA);
                subline = off.subline(evt0.segA_t, 1.0);
                if (subline)
                    arr.push(subline);

                for (var i = evt0.segA + 1; i < evt1.segA; ++i)
                {
                    off = this.getOffset(i);
                    subline = off.clone();
                    arr.push(subline);
                }

                off = this.getOffset(evt1.segA);
                subline = off.subline(0.0, evt1.segA_t) ;
                if (subline)
                    arr.push(subline);
            }
            else
            {
                console.log("error form loop") ;
            }
            return arr ;
        },
        //提取不连续的子段
        extractOffset : function(lines) {
            var line, off,  arr = [];
            line = lines.shift() ;
            arr.push(line) ;

            while (lines.length>0) {
                off = lines[0] ;
                if (line.to.distanceSqr(off.from) < EPSILON.zero12) {
                    line = lines.shift() ;
                    arr.push(line) ;
                }else {
                    break ;
                }
            }
            return arr ;
        },
    //std::vector<SubLines*>&
        findStartIndex : function ( groups, x_index) {
            for(var i=0; i<groups.length; i++) {
                var lines = groups[i];
                if (lines.xindex[0] == x_index) {
                    return lines;
                }
            }
            return null;
        },
        groupRemoveAt : function(groups, sub) {

            for(var i=0; i<groups.length; i++) {
                var lines = groups[i];
                if (lines==sub) {
                    delete lines;
                    groups.splice(i,1);
                    break ;
                }
            }
        }
    }

    //数据点抽稀
    function Approximate() {
        this.tol_chord = 0.0001 ;
        this.tol_angle = 0.0001 ;
        this.currdir = undefined ;
        this.seeddir = undefined ;
        //计算临时变量
        this.p0 = new Vector2();
        this.p1 = new Vector2();
        this.q = new Vector2();
        this.xevt = new PEvent() ;
    }

    Approximate.prototype = {
        //数据点抽稀
        rarefying : function (shp, chord, angle) {

            this.tol_chord = (typeof chord != "undefined") ? chord : 0.000003 ;
            this.tol_angle = (typeof angle != "undefined") ? angle : 12.0 * Math.PI / 180.0 ;

            //去除重点
            shp = this.removeOverlap(shp) ;

            var cnt = shp.length ;
            var from_i=0, to_i=1, end_i, seed_i, step = 100 ;
            var id_arr = [from_i] ;

            while (to_i<cnt) {
                end_i = to_i + step ;
                if (end_i > cnt-1) {
                    end_i = cnt-1 ;
                }
                seed_i = end_i ;

                //判断直线(角度)
                while (seed_i-to_i>0) {
                    if (this.isLinear(shp, from_i, seed_i)) {
                        to_i = seed_i ;
                    }
                    else {
                        end_i = seed_i ;
                    }
                    seed_i = parseInt((to_i + end_i)/2) ;
                    if (seed_i==to_i) break ;
                }
                id_arr[id_arr.length] = seed_i ;
                this.currdir = this.getDir(this.currdir,shp[from_i],shp[seed_i]) ;
                from_i = seed_i ;
                to_i = from_i + 1 ;
            }
            //console.log("数据点数:",cnt," 抽稀后:",id_arr.length) ;

            //数据点抽稀结果
            var res = [] ;
            cnt = id_arr.length;
            for (var i=0; i<cnt; i++) {
                res.push(shp[id_arr[i]]) ;
            }
            return res ; //id_arr
        },
        isLinear : function (shp, from_i, to_i) {
            this.p0.setxy(shp[from_i][0],shp[from_i][1]);
            this.p1.setxy(shp[to_i][0],shp[to_i][1]);
            for (var i=from_i+1; i<to_i; i++) {
                this.q.setxy(shp[i][0], shp[i][1]) ;
                this.q.distanceToSeg(this.p0, this.p1, this.xevt) ;
                if (this.xevt.dis > this.tol_chord) {
                    return false ;
                }
            }

            if (typeof this.currdir != "undefined") {
                this.seeddir = this.getDir(this.seeddir,shp[from_i],shp[to_i]) ;
                var angle = this.currdir.angleTo(this.seeddir) ;
                if (angle > this.tol_angle) {
                    return false ;
                }
            }
            return true ;
        },
        getDir: function(dir, p0, p1) {
            if (typeof dir == "undefined") {
                dir = new Vector2() ;
            }
            dir.setxy(p1[0]-p0[0], p1[1]-p0[1]);
            dir.unit() ;
            return dir ;
        },
        //去重叠点
        removeOverlap : function(shp) {
            var index = shp.length- 1, dis, dx, dy ;
            while (index>0) {
                dx = shp[index][0]-shp[index-1][0] ;
                dy = shp[index][1]-shp[index-1][1] ;
                dis = Math.sqrt(dx*dx + dy*dy) ;
                if (dis < EPSILON.zero8) {
                    shp.splice(index,1) ;
                }
                index-- ;
            }
            return shp ;
        }
    }

    var rdoffset = {} ;

    //数据点抽稀 arr = []
    rdoffset.approximate = function(arr, chord, angle) {
        var appr = new Approximate();
        return appr.rarefying(arr, chord, angle) ;
    }

    rdoffset.removeOverlap = function (coords) {
        //this.testOffset() ;
        var appr = new Approximate();
        return appr.removeOverlap(coords);
    }

    rdoffset.roadOffset = function (graph,way,dist) {
        //this.testOffset() ;
        var offset = new Offset() ;
        return offset.setWay(graph,way,dist) ;
    }

    rdoffset.plineOffset = function (pline,dist,scale) {
        var offset = new Offset() ;
        return offset.doOffset(pline,dist,scale) ;
    }


    rdoffset.testOffset = function () {

        var shape = [[0.0, 0.0],
            [10.0, 0.0],
            [10.0, 10.0],
            [0.0, 10.0],
            [0.0, 0.0]
        ] ;

        var offset = new Offset() ;
        var res = offset.doOffset(shape, 2.0, 1.0) ;
        //console.log ("offset result:", res) ;
    }

    return rdoffset ;
}

