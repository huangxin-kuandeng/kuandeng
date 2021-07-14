/*
 * @Author: tao.w
 * @Date: 2018-10-17 18:04:28
 * @LastEditors: tao.w
 * @LastEditTime: 2021-05-26 19:34:58
 * @Description: 
 */

iD.actions.BezierSpline = function (selectedIDs, projection,context) {

    function getTheSameWay(graph, entity1, entity2) {
        let wids1 = _.pluck(graph.parentWays(entity1), 'id'),
            wids2 = _.pluck(graph.parentWays(entity2), 'id'),
            wayId;
        for (let i = 0; i < wids1.length; i++) {
            if (wids2.includes(wids1[i])) {
                wayId = wids1[i];
                break;
            }
        }
        return wayId;
    }

    var Spline = function (options) {
        this.points = options.points || [];
        this.duration = options.duration || 10000;
        this.sharpness = options.sharpness || 0.85;
        this.centers = [];
        this.controls = [];
        this.stepLength = options.stepLength || 60;
        this.length = this.points.length;
        this.delay = 0;
        // this is to ensure compatibility with the 2d version
        for (var i = 0; i < this.length; i++) this.points[i][2] = this.points[i][2] || 0;
        for (var i = 0; i < this.length - 1; i++) {
            var p1 = this.points[i];
            var p2 = this.points[i + 1];
            this.centers.push([
                (p1[0] + p2[0]) / 2,
                (p1[1] + p2[1]) / 2,
                (p1[2] + p2[2]) / 2
            ]);
        }
        this.controls.push([this.points[0], this.points[0]]);
        for (var i = 0; i < this.centers.length - 1; i++) {
            var p1 = this.centers[i];
            var p2 = this.centers[i + 1];
            var dx = this.points[i + 1][0] - (this.centers[i][0] + this.centers[i + 1][0]) / 2;
            var dy = this.points[i + 1][1] - (this.centers[i][1] + this.centers[i + 1][1]) / 2;
            var dz = this.points[i + 1][2] - (this.centers[i][1] + this.centers[i + 1][2]) / 2;
            this.controls.push([
                [
                    (1.0 - this.sharpness) * this.points[i + 1][0] + this.sharpness * (this.centers[i][0] + dx),
                    (1.0 - this.sharpness) * this.points[i + 1][1] + this.sharpness * (this.centers[i][1] + dy),
                    (1.0 - this.sharpness) * this.points[i + 1][2] + this.sharpness * (this.centers[i][2] + dz)
                ],
                [
                    (1.0 - this.sharpness) * this.points[i + 1][0] + this.sharpness * (this.centers[i + 1][0] + dx),
                    (1.0 - this.sharpness) * this.points[i + 1][1] + this.sharpness * (this.centers[i + 1][1] + dy),
                    (1.0 - this.sharpness) * this.points[i + 1][2] + this.sharpness * (this.centers[i + 1][2] + dz)
                ]
            ]);
        }
        this.controls.push([this.points[this.length - 1], this.points[this.length - 1]]);
        this.steps = this.cacheSteps(this.stepLength);
        return this;
    };

    /*
      Caches an array of equidistant (more or less) points on the curve.
    */
    Spline.prototype.cacheSteps = function (mindist) {
        var steps = [];
        var laststep = this.pos(0);
        steps.push(0);
        for (var t = 0; t < this.duration; t += 10) {
            var step = this.pos(t);
            var dist = Math.sqrt((step[0] - laststep[0]) * (step[0] - laststep[0]) + (step[1] - laststep[1]) * (step[1] - laststep[1]) + (step[2] - laststep[2]) * (step[2] - laststep[2]));
            if (dist > mindist) {
                steps.push(t);
                laststep = step;
            }
        }
        return steps;
    };

    /*
      returns angle and speed in the given point in the curve
    */
    Spline.prototype.vector = function (t) {
        var p1 = this.pos(t + 10);
        var p2 = this.pos(t - 10);
        return {
            angle: 180 * Math.atan2(p1[1] - p2[1], p1[0] - p2[0]) / 3.14,
            speed: Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]) + (p2[2] - p1[2]) * (p2[2] - p1[2]))
        };
    };

    /*
      Gets the position of the point, given time.
      WARNING: The speed is not constant. The time it takes between control points is constant.
      For constant speed, use Spline.steps[i];
    */
    Spline.prototype.pos = function (time) {

        function bezier(t, p1, c1, c2, p2) {
            var B = function (t) {
                var t2 = t * t,
                    t3 = t2 * t;
                return [(t3), (3 * t2 * (1 - t)), (3 * t * (1 - t) * (1 - t)), ((1 - t) * (1 - t) * (1 - t))];
            };
            var b = B(t);
            var pos = [
                p2[0] * b[0] + c2[0] * b[1] + c1[0] * b[2] + p1[0] * b[3],
                p2[1] * b[0] + c2[1] * b[1] + c1[1] * b[2] + p1[1] * b[3],
                p2[2] * b[0] + c2[2] * b[1] + c1[2] * b[2] + p1[2] * b[3]
            ];
            return pos;
        }
        var t = time - this.delay;
        if (t < 0) t = 0;
        if (t > this.duration) t = this.duration - 1;
        //t = t-this.delay;
        var t2 = (t) / this.duration;
        if (t2 >= 1) return this.points[this.length - 1];

        var n = Math.floor((this.points.length - 1) * t2);
        var t1 = (this.length - 1) * t2 - n;
        return bezier(t1, this.points[n], this.controls[n][1], this.controls[n + 1][0], this.points[n + 1]);
    };


    // var action = function (graph) {
    //     let entity1 = graph.entity(selectedIDs[0]),
    //         entity2 = graph.entity(selectedIDs[1]),
    //         wayId = getTheSameWay(graph, entity1, entity2),
    //         way = graph.entity(wayId),
    //         _nodes = graph.childNodes(way),
    //         index1 = _nodes.indexOf(entity1),
    //         index2 = _nodes.indexOf(entity2);
    //     if (index1 > index2) {
    //         [index1, index2] = [index2, index1];
    //     }

    //     var nodes = _nodes.slice(index1, index2)
    //     var locs = _.pluck(nodes, 'loc');
    //     var sp = new Spline({
    //         points: locs
    //     });
    //     var coords = [];
    //     for (var i = 0; i < sp.duration; i += 10) {
    //         var pos = sp.pos(i);
    //         if (Math.floor(i / 100) % 2 === 0) {
    //             coords.push(pos);
    //         }
    //     }

    //     for (let i = 1; i < nodes.length-1; i++) {
    //         var node = nodes[i];
    //         var dist = iD.util.pt2LineDist2(coords, node.loc);
    //         graph = graph.replace(graph.entity(nodes[i].id)
    //             .move(coords[dist.i]));
    //         coords.splice(dist.i, 1);
    //     }
    //     for (let i = 0; i < coords.length; i++) {
    //         var _way = graph.entity(wayId);
    //         var choice = iD.geo.chooseEdge(graph.childNodes(_way), coords[i], projection)
    //         var node = iD.Node({
    //             layerId: entity1.layerId,
    //             loc: choice.loc,
    //             modelName: entity1.modelName
    //         });

    //         var prev = _way.nodes[choice.index - 1],
    //             next = _way.nodes[choice.index];
    //         graph = iD.actions.AddMidpoint({
    //             loc: coords[i],
    //             edge: [prev, next]
    //         }, node)(graph);
    //     }

    //     return graph;
    // };
    function getHeight(loc, node) {
        let xyz = iD.util.getPlyZ(context, loc);
        if (xyz != null) {
            return xyz;
        }
        let cRangeNodes = iD.util.selectNode_Z(loc, 40);
        let tracks = [];
        for (let i = 0; i < cRangeNodes.length; i++) {
            var rangeNodes = cRangeNodes[i];
            var node = iD.util.getNearestNode(loc, rangeNodes.nodes);
            tracks.push({
                node: node,
                cameraHeight: rangeNodes.cameraHeight,
                trackId: rangeNodes.trackId
            });
        }
        // console.log(disArr)
        if (tracks.length == 0) {
            return node.loc[2];
        }
        var nearrestTrack = iD.util.getNearestTracks(loc, tracks);
        return nearrestTrack.node.loc[2] - nearrestTrack.cameraHeight;
    }

    var action = function (graph) {
        let entity1 = graph.entity(selectedIDs[0]),
            entity2 = graph.entity(selectedIDs[1]),
            wayId = getTheSameWay(graph, entity1, entity2),
            way = graph.entity(wayId),
            _nodes = graph.childNodes(way),
            index1 = _nodes.indexOf(entity1),
            index2 = _nodes.indexOf(entity2);
        if (index1 > index2) {
            [index1, index2] = [index2, index1];
        }

        var nodes = _nodes.slice(index1, index2)
        var locs = _.pluck(nodes, 'loc');

        var n1 = _nodes[index1 + 1].loc;
        var n2 = _nodes[index2 - 1].loc;
        var theta0 = iD.util.calcAngle(entity1.loc[0], entity1.loc[1], n1[0], n1[1]);
        var theta1 = iD.util.calcAngle(n2[0], n2[1], entity2.loc[0], entity2.loc[1]);

        var clothoid = iD.util.buildClothoid(entity1.loc[0], entity1.loc[1], theta0, entity2.loc[0], entity2.loc[1], theta1);
        var len = 100;
        var dit = iD.util.distanceByLngLat(locs[0], _.last(locs));
        len = parseInt(dit / 0.4);
        if (index2 - index1 > len) len = index2 - index1 + len;
        // if(index2-index1>100){
        //     len = index2-index1 +100;
        // }
        var coords = iD.util.pointsOnClothoid(entity1.loc[0], entity1.loc[1], theta0, clothoid.k, clothoid.dk, clothoid.L, len);
        coords.map(d => {
            heigth = getHeight(d, entity1);
            d.push(heigth);
        })
        coords.pop()
        coords.shift()
        for (let i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var dist = iD.util.pt2LineDist2(coords, node.loc);
            
            if(coords.length == 1){
                dist = iD.util.pt2LineDist2([coords[0],coords[0]], node.loc);
            }
            
            graph = graph.replace(graph.entity(nodes[i].id)
                .move(coords[dist.i]));
            coords.splice(dist.i, 1);
        }
        let _layer = iD.Layers.getLayer(entity1.layerId);
        for (let i = 0; i < coords.length; i++) {
            var _way = graph.entity(wayId);
            var choice = iD.geo.chooseEdge(graph.childNodes(_way), projection(coords[i]), projection);
            var node = iD.Node({
                layerId: entity1.layerId,
                identifier: _layer.identifier,
                loc: coords[i],
                modelName: entity1.modelName
            });

            var prev = _way.nodes[choice.index - 1],
                next = _way.nodes[choice.index];
            graph = iD.actions.AddMidpoint({
                loc: coords[i],
                edge: [prev, next]
            }, node)(graph);
        }

        return graph;
    };

    action.disabled = function (graph) {
        let entity1 = graph.entity(selectedIDs[0]),
            entity2 = graph.entity(selectedIDs[1]),
            wayId = getTheSameWay(graph, entity1, entity2),
            way = graph.entity(wayId),
            _nodes = graph.childNodes(way),
            index1 = _nodes.indexOf(entity1),
            index2 = _nodes.indexOf(entity2);
        if (index1 > index2) {
            [index1, index2] = [index2, index1];
        }
        if (index2 - index1 < 4) {
            return 'too_bendy';
        }
    };

    return action;
};