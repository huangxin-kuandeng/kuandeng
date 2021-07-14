/*onmessage = function(context,mes){
    var taskTracks = context.data[0],
        hisTracks = context.data[1];
    for (var i = 0; i < hisTracks.length; i++) {
        var _track = hisTracks[i];
        postMessage(_track.nodes);
    }
    // 当前任务的轨迹最后渲染，再最顶层，防止点击时被其他历史轨迹覆盖；
    for (var i = 0; i < taskTracks.length; i++) {
        var _track = taskTracks[i];
        postMessage(_track.nodes);
    }
}*/
onmessage = function(context,mes){
    var points = context.data;
    if (points[0] instanceof Array) {
        var pointClassification = trackPointRel(flattenArr(points));
    } else {
        var pointClassification = trackPointRel(points);
    }

    postMessage(pointClassification);
    // close();
}

flattenArr = arr => arr.reduce((begin,current)=>{
    Array.isArray(current)?
        begin.push(...flattenArr(current)):
        begin.push(current);
    return begin
},[]);

function sortY(a, b) {
    return a.index || (b.loc[1] - a.loc[1]);
}

//轨迹点数据分类， 现在按错误点和正确点
function trackPointRel(points){
    if (points[0].nodes[0].tags.qualityNum != undefined) {
        var result = trackPointQualityNumber(points);
        return  {
            greenPoints: result.greenPoints,
            cyanPoints: result.cyanPoints,
            bluePoints: result.bluePoints,
            purplePoints: result.purplePoints,
            magentaPoints: result.magentaPoints,
            redPoints: result.redPoints,
            otherPoints: result.otherPoints,
            // allPoints: result.allPoints
        }
    } else {
        var result = trackPointClassification(points);
        return {
            badSpots: result.badPoints,
            acceptables: result.acceptPoints,
            goodPoints: flattenArr(result.goodPoints),
            // allPoints: result.allPoints
        }
    }
}
/**
 * 后差分轨迹点分类：
 * 1、Green
 * 2、Cyan
 * 3、Blue
 * 4、Purple
 * 5、Magenta
 * 6、Red
 * unProcessed、Grey
 * @param {Array} points
 * */
function trackPointQualityNumber(points) {
    let greenPoints = [], cyanPoints = [],
        bluePoints = [], purplePoints = [],
        magentaPoints = [], redPoints = [],
        otherPoints = [],node,nodes,qualityNum;
        // allPoints = [],
        // points = points;// || player.allNodes;

    for (let i = 0; i < points.length; i++) {
        nodes = points[i].nodes;
        for (let j = 0; j < nodes.length; j++)
        {
            node= nodes[j];
            qualityNum = node.tags.qualityNum || -1;
            // allPoints[i] = [];
            // allPoints[i].push(node);
            if (qualityNum) {
                if (qualityNum == 1) {
                    greenPoints.push(node);
                } else if (qualityNum == 2) {
                    cyanPoints.push(node);
                } else if (qualityNum == 3) {
                    bluePoints.push(node);
                } else if (qualityNum == 4) {
                    purplePoints.push(node);
                } else if (qualityNum == 5) {
                    magentaPoints.push(node);
                } else if (qualityNum == 6) {
                    redPoints.push(node);
                } else {
                    otherPoints.push(node);
                }
            }
        }
    }
    return {
        greenPoints: greenPoints,
        cyanPoints: cyanPoints,
        bluePoints: bluePoints,
        purplePoints: purplePoints,
        magentaPoints: magentaPoints,
        redPoints: redPoints,
        otherPoints: otherPoints,
        // allPoints: allPoints
    };

}
/**
 * 将轨迹点分类：
 * 1、正常点
 * 2、坏点
 * 3、坏点前10秒的点
 * @param {Array} points
 */
function trackPointClassification(points){
    // var context = this.context, player = this.player;
    points = points;// || player.allNodes;
    let badPoints = [], badMap = {};
    let goodPoints = [], goodMap = {};
    let acceptPoints = [], acceptMap = {};   //坏点前10秒为可接受坏点，需要特殊渲染
    let node ;
    let tempbadPoints = [];
    // var ways =  [];
    let  startNode = points[0].nodes[0];
    let _tempArr= [];   //临时 存储相同类型点数据
    // var allPoints = [];

    function pushArr(_tempArr,node){
        if(node.tags && node.tags.status.toString() == "3" && node.tags.positionType.toString() == '50'){
            goodPoints.push(_tempArr);
            goodMap[node.id] = true;
        }else{
            tempbadPoints.push(_tempArr);
        }
    }
    function isGoodPoint(node){
        return (node.tags.status.toString() == "3" && node.tags.positionType.toString() == '50');
    }
    //点数据分类为好点和错误点，错误点为临时数组，因为需求需要错误点不同样式渲染
    // _tempArr.push(startNode);

    for (let i = 0, l = points.length; i < l; i++) {
        var nodes = points[i].nodes;
        // allPoints.push(nodes);
        for (let j = 0; j < nodes.length; j++)
        {
            node = nodes[j];
            if (node.tags && isGoodPoint(node) == isGoodPoint(startNode)) {
                _tempArr.push(node);
            } else {
                // ways.push(_tempArr);
                pushArr(_tempArr, startNode);
                _tempArr = [];
                startNode = node;
                _tempArr.push(startNode);
            }
        }
    }
    pushArr(_tempArr,_tempArr[0]);

    var _tempNodes = [];

    for (let i = 0, l = tempbadPoints.length; i < l; i++) {
        _tempNodes = tempbadPoints[i];
        startNode = _tempNodes[0];

        for(let j=0,jl = _tempNodes.length;j<jl;j++){
            node = _tempNodes[j];
            if((node.tags.locTime - startNode.tags.locTime) > 10000){
                badPoints.push(node);
                badMap[node.id] = true;
            }else{
                acceptPoints.push(node);
                acceptMap[node.id] = true;
            }
        }
    }
    badPoints =  badPoints.sort(sortY);
    acceptPoints = acceptPoints.sort(sortY);
    goodPoints = flattenArr(goodPoints);
    return {
        badPoints,
        acceptPoints,
        goodPoints,
        // allPoints,
        badMap,
        goodMap,
        acceptMap
    };
}