/**
 * Created by wt on 2015/11/11.
 */
;;(function (iD) {
    var adasRoads = [];

    var dispatch = d3.dispatch('addAdaRoad');

    iD = iD || {};
    iD.Adas = {
        dispatch: dispatch,
        isAdasRoad: function (id) {
            var res = true;
            adasRoads.forEach(function (roadId) {
                if (id == roadId) {
                    res = false;
                }
            })
            return res;
        },
        addAdaRoad: function (ids) {
            for(var i =0; i<ids.length; i++){
                if(this.isAdasRoad(ids[i])){
                    adasRoads.push(ids[i]);
                }
            }
        },
        getAdasRoads: function() {
           return adasRoads;
        },
        resertAdasRoads:function(){
            adasRoads = [];
        }
    }
    d3.rebind(iD.Adas, dispatch, 'on');
})(iD);