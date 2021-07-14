/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-26 16:49:20
 * @Description: 
 */
iD.data.operations = {
    "icon-operation-delete": [377, 127],
    "icon-operation-cancelRelations": [377, 127],
    "icon-operation-update_divider_node": [20, 179],		//车道分割虚线首尾节点属性(高亮)
    "icon-operation-cancelDividerJunction": [377, 127],
    "icon-operation-circularize": [20, 140],
    "icon-operation-straighten": [40, 140],
    "icon-operation-bezierSpline": [258, 140],
    "icon-operation-split": [60, 140],
    "icon-operation-dividerDREF": [1, 179],		//Devider-DeviderREF关系(高亮)
    "icon-operation-junction": [60, 178],		//Devider-Junction关系(高亮)
    "icon-operation-road_divider": [60, 140],
    "icon-operation-split-road": [180, 140],
    "icon-operation-disconnect": [407, 127], //单点打断道路
    "icon-operation-reverse": [100, 140],
    "icon-operation-move": [120, 140],
    "icon-operation-merge": [140, 140],
    "icon-operation-rDividerOpl": [140, 140],  //车道线于定位线
    "icon-operation-diversionSurfaceCreate": [140, 140],  //导流带
    "icon-operation-rDividerOpg": [140, 140],  //定位目标于定位线
    "icon-operation-rDividerOpt": [140, 140],  //灯杆于定位线
    "icon-operation-rDividerSign": [140, 140],  //路牌于定位线
    "icon-operation-rRoadDividerCreate": [140, 140],  //路牌于定位线
    "icon-operation-rRoadsign": [140, 140],  //路牌于定位线
    "icon-operation-orthogonalize": [258, 140],
    "icon-operation-rotate": [240, 140],
    "icon-operation-simplify": [200, 140],
    "icon-operation-clone":[200, 140],
    "icon-operation-continue": [220, 140],
    "icon-operation-traffic":[160, 140],
    "icon-operation-copy":[610, 0],  //复制
    "icon-operation-transform":[697, 157],//转圆形路牌
    "icon-operation-disabled-copy":[610, 40],
    "icon-operation-paste":[503, 155],  //黏贴
    "icon-operation-rawposition":[277, 140],
	"icon-operation-intersect-road":[568, 127],    //相交打断
    "icon-operation-topo_split":[535, 127],        //道路拓扑分离
    "icon-operation-expand":[471, 125],             //扩路
    "icon-operation-disabled-copy":[504, 127], 
    "icon-operation-clone_tags-road":[504, 127],  //复制道路属性
    "icon-operation-paste_tags-road":[503, 155],  //粘贴道路属性
    "icon-operation-roadsmove":[505, 127],         //复制道路形状
    "icon-operation-RoadCrossCreate":[728, 127],  //创建综合交叉点
    "icon-operation-RoadCrossEdit":[728, 127],  //创建综合交叉点
    "icon-operation-qc_tag":[377, 152.5], //品控详情
    "icon-operation-delete_slope":[408, 151], //删除DetailSlope
    "icon-operation-way_editor":[377, 152.5], //删除DetailSlope
    "icon-operation-line_info_modify": [535, 157],
  //  "icon-operation-add-walk-area":[535, 157], //绘制步导面
  	"icon-operation-createdividerOPL": [200, 141], //参考线与线对象关联关系 Tilden
  	"icon-operation-cancledividerOPL": [407, 152], //删除参考线与线对象关联关系
  	"icon-operation-rTlLaneCreate": [200, 141], //  Traffic Light与lane的关联关系
  	"icon-operation-cancledrTlLane": [407, 152], //删除Traffic Light与lane的关联关系
  	"icon-operation-rTlStopline": [200, 141], //参考 交通灯/停止线对象关联关系 
  	"icon-operation-rTlStopline_delete": [407, 152], //删除 交通灯/停止线对象关联关系
  	"icon-operation-rPlLaneCreate": [200, 141], //参考 定位线与lane的关联关系 
  	"icon-operation-rPlLaneDelete": [407, 152], //删除 定位线与lane的关联关系
  	"icon-operation-rRoadSignDelete": [407, 152], //删除 定位线与lane的关联关系
  	"icon-operation-rTsLaneCreate1": [200, 141], //参考 牌子与lane的关联关系 
  	"icon-operation-rPgLaneDelete1": [407, 152], //删除 牌子与lane的关联关系
  	"icon-operation-rTsLaneCreate2": [200, 141], //参考 牌子与lane的关联关系 
  	"icon-operation-rPgLaneDelete2": [407, 152], //删除 牌子与lane的关联关系
  	"icon-operation-auto_generate_way": [220, 140], //删除参考线与线对象关联关系
  	"icon-operation-createdividerOPG": [560, 1], //参考线与面对象关联关系
	"icon-operation-cancledividerOPG": [407, 152], //删除参考线与面对象关联关系
    "icon-operation-createdividerVirtualLane": [594, 82], //椭圆路口虚拟车道线
    "icon-operation-way_bezier_create": [594, 82], //调头虚拟车道线
    "icon-operation-createdividerVirtualLaneCircle": [594, 82], //内切圆路口虚拟车道线
    "icon-operation-rectifyDeviationFeature": [594, 82], //纠偏要素
	"icon-operation-bridge-point": [728, 126], //创建桥的高程点
	"icon-operation-measureinfoCopy": [647, 8], //复制测量信息
    "icon-operation-measureinfoLocation": [697, 83], //定位测量信息
    "icon-operation-autonetworktagLocation": [697, 83], //定位自动组网标记
    "icon-operation-connect": [140, 140], //关联标定点和控制点

    "icon-operation-disabled-delete": [0, 160],
    "icon-operation-disabled-cancelRelations": [0, 160],
    "icon-operation-disabled-cancelDividerJunction": [0, 160],
    "icon-operation-disabled-circularize": [20, 160],
    "icon-operation-disabled-straighten": [40, 140],
    "icon-operation-disabled-bezierSpline": [258, 140],
    "icon-operation-disabled-split": [60, 160],
    "icon-operation-disabled-split-road": [180, 140],
    "icon-operation-disabled-disconnect": [80, 160],
    "icon-operation-disabled-reverse": [100, 160],
    "icon-operation-disabled-move": [120, 160],
    "icon-operation-disabled-merge": [140, 160],
    "icon-operation-disabled-rDividerOpl": [140, 160], //车道线于定位线
    "icon-operation-disabled-diversionSurfaceCreate": [140, 160], //导流带
    "icon-operation-disabled-rDividerOpg": [140, 140],  //定位目标于定位线
    "icon-operation-disabled-rDividerOpt": [140, 140],  //灯杆于定位线
    "icon-operation-disabled-rDividerSign": [140, 140],  //路牌于定位线
    "icon-operation-disabled-dividerDREF": [1, 179],	//Devider-DeviderREF关系(灰色)
    "icon-operation-disabled-junction": [60, 178],		//Devider-Junction关系(灰色)
    "icon-operation-disabled-update_divider_node": [20, 179],		//车道分割虚线首尾节点属性(灰色)
    "icon-operation-disabled-road_divider": [60, 160],
    "icon-operation-disabled-orthogonalize": [258, 160],
    "icon-operation-disabled-rotate": [240, 140],
    "icon-operation-disabled-simplify": [200, 160],
    "icon-operation-disabled-continue": [220, 160],
    "icon-operation-disabled-traffic":[160, 160],
    "icon-operation-disabled-rawposition":[277, 160],
    "icon-operation-disabled-createdividerOPL": [200, 141], //参考线与线对象关联关系 Tilden
    "icon-operation-disabled-cancledividerOPL": [407, 152], //删除参考线与线对象关联关系
    "icon-operation-disabled-createdividerOPG": [560, 1], //参考线与面对象关联关系
	"icon-operation-disabled-cancledividerOPG": [407, 152], //删除参考线与面对象关联关系
    "icon-operation-disabled-createdividerVirtualLane": [594, 82], //椭圆路口虚拟车道线
    "icon-operation-disabled-createdividerVirtualLaneCircle": [594, 82], //内切圆路口虚拟车道线
    "icon-operation-disabled-way_bezier_create":  [594, 82], //调头虚拟车道线,
    "icon-operation-disabled-rectifyDeviationFeature": [594, 82], //纠偏要素

    "icon-restriction-yes": [200, 324],
    "icon-restriction-no":  [203, 334],
    "icon-restriction-only":  [203, 334],
    "icon-restriction-yes-u":  [203, 334],
    "icon-restriction-no-u":  [203, 334],
    "icon-restriction-only-u":  [203, 334],
}