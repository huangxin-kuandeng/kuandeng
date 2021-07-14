/**
 * 拉框扩展
 */
iD.util.lassExtend = {
	/**
	 * 判断两条线是否相交
	 * SegmentA 线段一 [x1, y1, x2, y2] 即线段起点与结束点经纬度数组
	 * SegmentB 线段二 [x1, y1, x2, y2]
	 */
	SegmentIntersect: function(SegmentA, SegmentB){
			var d = (SegmentA[3]-SegmentA[1])*(SegmentB[2]-SegmentB[0])-(SegmentB[3]-SegmentB[1])*(SegmentA[2]-SegmentA[0]);
			if(d==0){
				return 3; //"LINE_COLLINEAR";
			}
			var Tmp = [];
			Tmp[0] = ((SegmentA[2]-SegmentA[0])*(SegmentB[2]-SegmentB[0])*(SegmentB[1]-SegmentA[1])+(SegmentA[3]-SegmentA[1])*(SegmentB[2]-SegmentB[0])*SegmentA[0]-(SegmentB[3]-SegmentB[1])*(SegmentA[2]-SegmentA[0])*SegmentB[0])/d;
			Tmp[1] = ((SegmentA[3]-SegmentA[1])*(SegmentB[3]-SegmentB[1])*(SegmentB[0]-SegmentA[0])+(SegmentA[2]-SegmentA[0])*(SegmentB[3]-SegmentB[1])*SegmentA[1]-(SegmentB[2]-SegmentB[0])*(SegmentA[3]-SegmentA[1])*SegmentB[1])/(-d);
			
			var f1 = ((Tmp[0]-SegmentA[0])*(Tmp[0]-SegmentA[2])<=0);
			var f2 = ((Tmp[0]-SegmentB[0])*(Tmp[0]-SegmentB[2])<=0);
			var f3 = ((Tmp[1]-SegmentA[1])*(Tmp[1]-SegmentA[3])<=0);
			var f4 = ((Tmp[1]-SegmentB[1])*(Tmp[1]-SegmentB[3])<=0);
			if(f1 && f2 && f3 && f4){
				//线线交点
				return [Tmp[0], Tmp[1]]; //"LINE_INTERSECT";
			}else {
				return 0; //"DONT_INTERSECT";
			}
	},
    /**
     * 判断点是否在矩形内
     * @param point = {lng:'',lat:''} 点对象
     * @param ext 矩形边任意【对角】点的经纬度数组对象 即拉框起点坐标和结束点经纬度坐标
     * @returns {Boolean} 点在矩形内返回true,否则返回false
     */
    isPointInRect : function(point, ext){
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
    },
    /**
     * 线在矩形内或与矩形边相交
     * ext 拉框起点和终点经纬度坐标
     * linecoord 被校验线的 起点与结束点经纬度数组[x1,y1,x2,y2]
     */
    isLineInRect : function(ext, linecoord){
        	//拉框起点坐标和结束点经纬度坐标
            var x1 = ext[0][0], y1 = ext[0][1]; 
            var x2 = ext[1][0], y2 = ext[1][1];
            
            //分解拉框矩形区域为四条边线段,即矩形四条边
            var line1 = [x1, y1, x2, y1];
            var line2 = [x2, y1, x2, y2];
            var line3 = [x2, y2, x1, y2];
            var line4 = [x1, y2, x1, y1];
            var rectLines = [line1,line2,line3,line4];
            for(var i = 0; i<rectLines.length; i++){
            	var SegmentA = rectLines[i];
            	var r = this.SegmentIntersect(SegmentA, linecoord);
            	if(r){
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
    },
    /**
     * 计算两点之间的距离,两点坐标必须为经纬度
     * @param {point1} Point 点对象
     * @param {point2} Point 点对象
     * @returns {Number} 两点之间距离，单位为米
     */
    getDistance : function(point1, point2){
        /**
         * 地球半径
         */
        var EARTHRADIUS = 6370996.81; 

        /**
         * 将度转化为弧度
         * @param {degree} Number 度     
         * @returns {Number} 弧度
         */
        function degreeToRad(degree){
            return Math.PI * degree/180;    
        }
        /**
         * 将v值限定在a,b之间，纬度使用
         */
        function _getRange(v, a, b){
            if(a != null){
              v = Math.max(v, a);
            }
            if(b != null){
              v = Math.min(v, b);
            }
            return v;
        }
    	  /**
         * 将v值限定在a,b之间，经度使用
         */
        function _getLoop(v, a, b){
            while( v > b){
              v -= b - a
            }
            while(v < a){
              v += b - a
            }
            return v;
        }
        point1.lon = _getLoop(point1.lon, -180, 180);
        point1.lat = _getRange(point1.lat, -74, 74);
        point2.lon = _getLoop(point2.lon, -180, 180);
        point2.lat = _getRange(point2.lat, -74, 74);
        
        var x1, x2, y1, y2;
        x1 = degreeToRad(point1.lon);
        y1 = degreeToRad(point1.lat);
        x2 = degreeToRad(point2.lon);
        y2 = degreeToRad(point2.lat);

        return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));    
    }
}