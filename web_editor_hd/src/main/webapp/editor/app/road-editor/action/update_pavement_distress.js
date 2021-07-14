/*
 * @Author: tao.w
 * @Date: 2020-12-23 14:55:08
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-24 10:23:12
 * @Description: 
 */

iD.actions.UpdatePavement_distress = function(way) {
    return function(graph) {
        
        way = iD.util.tagExtend._updatePavement(graph,way);
        graph=graph.replace(way);
        return graph;
    };

};
