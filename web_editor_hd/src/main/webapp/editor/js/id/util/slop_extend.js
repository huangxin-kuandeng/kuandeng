/**
 * Created by  on 2015/11/8.
 * DetalSlop坡度基础函数
 */
iD.util.slopExtend = {


    //计算坡度点实体到道路的最短距离
    getDisBetPointAndWay: function(entity,way,graph){
        var nodesArr = way.nodes;
        var i, min = Infinity,distance;
        //道路至少包含两个结点
        if (nodesArr.length > 1) {
            for (i = 0; i < nodesArr.length - 1; i++) {
                var loc1 = graph.entity(nodesArr[i]).loc;
                var loc2 = graph.entity(nodesArr[i+1]).loc;
                distance = this.getDisBetPointAndSeg(entity.loc,loc1,loc2);
                if(distance<min){
                    min = distance;
                }
            }
        }
        return min;
    },

    //计算点到线段的最短距离
    //params：loc:P0点的经纬度坐标数组
    //        loc1:P1点线段的经纬度坐标数组
    //        loc2:P2点线段的经纬度坐标数组
    //返回值：最短的距离，参数为米
    //test loc: [0,1]  loc1[-1,0]  loc2 [1,0]
    getDisBetPointAndSeg: function(loc, loc1,loc2) {
        var distance = 0;
        var P10 = [loc[0]-loc1[0],loc[1]-loc1[1]], P12 = [loc2[0]-loc1[0],loc2[1]-loc1[1]];     //点到线段一段的矢量P01，线段矢量表示P12
        //var SegLength = Math.sqrt((loc2[0]-loc1[0])*(loc2[0]-loc1[0])+(loc2[1]-loc1[1])*(loc2[1]-loc1[1]));  //线段长度
        //t 为到线段的投影向量与原来线段的比值，如果0<t<1,最短距离，为垂足距离;t<=0,最短距离为P01的距离长；t>=1最短距离为P02模长
        var t =   (P10[0]*P12[0]+P10[1]*P12[1])/(P12[0]*P12[0]+P12[1]*P12[1]);
        //var t =   ((loc1[0]-loc[0])*(loc2[0]-loc1[0])+(loc1[1]-loc[1])*(loc2[1]-loc1[1]))/((loc2[0]-loc1[0])*(loc2[0]-loc1[0])+(loc2[1]-loc1[1])*(loc2[1]-loc1[1]));
        if(t>0&&t<1){
            var Pt = [loc1[0]+t*P12[0],loc1[1]+t*P12[1]];
            var Pt0 = [Pt[0]-loc[0],Pt[1]-loc[1]];
            distance = Math.sqrt(Pt0[0]*Pt0[0]+Pt0[1]*Pt0[1])
        }else if(t<=0){
            distance = Math.sqrt(P10[0]*P10[0]+P10[1]*P10[1]);
        }else if(t>=1){
            var P20 = [loc[0]-loc2[0],loc[1]-loc2[1]];
            distance = Math.sqrt(P20[0]*P20[0]+P20[1]*P20[1]);
        }
        return distance;
    }



}

