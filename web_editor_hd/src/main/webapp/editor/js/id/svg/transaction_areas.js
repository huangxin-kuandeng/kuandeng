
// 事务面
iD.svg.TransactionAreas = function(projection, context) {

    // Patterns only work in Firefox when set directly on element.
    // (This is not a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=750632)
    var patterns = {
        wetland: 'wetland',
        beach: 'beach',
        scrub: 'scrub',
        construction: 'construction',
        military: 'construction',
        cemetery: 'cemetery',
        grave_yard: 'cemetery',
        meadow: 'meadow',
        farm: 'farmland',
        farmland: 'farmland',
        orchard: 'orchard'
    };
    //var polygonOperations=iD.util.PolygonOperations();
    var patternKeys = ['landuse', 'natural', 'amenity'];

    var clipped = ['residential', 'commercial', 'retail', 'industrial'];

    function clip(entity) {
        return clipped.indexOf(entity.tags.landuse) !== -1;
    }

    function setPattern(d) {
        for (var i = 0; i < patternKeys.length; i++) {
            if (d.tags&&patterns.hasOwnProperty(d.tags[patternKeys[i]])) {
                this.style.fill = 'url("#pattern-' + patterns[d.tags[patternKeys[i]]] + '")';
                return;
            }
        }
        this.style.fill = '';
    }

    //多变形差运算
    function polygonDifference(nodeArray,holeArrs) {

        var bbox = {
            min :[0,0],
            max :[-1,0],
            center : function() {
                return [0.5*(this.min[0]+this.max[0]), 0.5*(this.min[1]+this.max[1])] ;
            },
            add : function(x,y) {
                if (this.min[0]>this.max[0]) {
                    this.min[0] = this.max[0] = x ;
                    this.min[1] = this.max[1] = y ;
                }else {
                    if (x < this.min[0]) this.min[0] = x ;
                    else if (x > this.max[0]) this.max[0] = x ;
                    if (y < this.min[1]) this.min[1] = y ;
                    else if (y > this.max[1]) this.max[1] = y ;
                }
            },
            addArr : function(arr) {
                for (let i= 0, re=arr.length; i<re; i++) {
                    this.add(arr[i][0], arr[i][1]);
                }
            },
            addArrs : function(arrs) {
                for (let i= 0, re=arrs.length; i<re; i++) {
                    this.addArr(arrs[i]);
                }
            },
            arr2Path : function(arr) {
                var path = '[' ;
                for(let i=0,re=arr.length; i<re; i++) {
                    if (i)
                        path+=',';
                    path+='{X:' + arr[i][0] +',Y:'+arr[i][1] + '}' ;
                }
                path +=']';
                return path ;
            }
        };
        bbox.addArr(nodeArray) ;
        bbox.addArrs(holeArrs) ;
        var center = bbox.center() ;

        //var path1 = bbox.arr2Path(nodeArray) ;
        //var path2 = bbox.arr2Path(holdCoords) ;

        var scale = 1.0e+8;
        var subj_paths = createClipPath(nodeArray, center) ;
        var clip_paths = createClipPaths(holeArrs, center) ;
        ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
        ClipperLib.JS.ScaleUpPaths(clip_paths, scale);

        var cpr = new ClipperLib.Clipper();
        cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);  // true means closed path
        cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);

        var solution_paths = new ClipperLib.Paths();
        var succeeded = cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        return  paths2Polygon(solution_paths, center, 1.0/scale);

        //创建路径
        //输入：
        //  arr  : [[x0,y0],[x1,y1],...,[xn,yn]]
        //  center :[x,y]
        function createClipPath(arr, center) {
            var clip_paths = new ClipperLib.Paths();
            var clip_path = new ClipperLib.Path();
            for (let i= 0, re=arr.length-1; i<re; i++) {
                clip_path.push(new ClipperLib.IntPoint(arr[i][0]-center[0], arr[i][1]-center[1]));
            }
            clip_paths.push(clip_path);
            return clip_paths ;
        }
        function createClipPaths(arrs, center) {
            var clip_paths = new ClipperLib.Paths();
            for (let k= 0, rk=arrs.length; k<rk; k++) {
                var clip_path = new ClipperLib.Path();
                var arr = arrs[k] ;
                for (let i= 0, re=arr.length; i<re; i++) {
                    clip_path.push(new ClipperLib.IntPoint(arr[i][0]-center[0], arr[i][1]-center[1]));
                }
                clip_paths.push(clip_path);
            }
            return clip_paths ;
        }

        //路径转化为多边形
        function paths2Polygon(paths,center,scale) {

            if (paths.length==1) {
                var result = {
                    "type":"Polygon",
                    "coordinates":[]
                } ;
                for (let i= 0, re=paths.length; i<re; i++) {
                    var path = paths[i] ;
                    if (path.length>0) {
                        var poly = [] ;
                        for (let j= 0, rj=path.length; j<rj; j++) {
                            poly[j]=[path[j].X*scale + center[0], path[j].Y*scale + center[1]] ;
                        }
                        poly[poly.length]=[path[0].X*scale + center[0], path[0].Y*scale + center[1]] ;
                        result.coordinates.push(poly) ;
                    }
                }
                return [result] ;
            }else if (paths.length>1) {
                var result = {
                    "type":"MultiPolygon",
                    "coordinates":[]
                } ;
                for (let i= 0, re=paths.length; i<re; i++) {
                    var path = paths[i] ;
                    if (path.length>0) {
                        var poly = [] ;
                        for (let j= 0, rj=path.length; j<rj; j++) {
                            poly[j]=[path[j].X*scale + center[0], path[j].Y*scale + center[1]] ;
                        }
                        poly[poly.length]=[path[0].X*scale + center[0], path[0].Y*scale + center[1]] ;
                        result.coordinates.push([poly]) ;
                    }
                }
                return [result] ;
            }else {
                return [] ;
            }
        }
    }

    var old_contextCenter;
    function drawAreas(surface, graph, entities, filter) {//console.log('drawAreas ..');
        // return ;
        // add 判断graph是否改变，依据：map().center() 和map().zoom(),当前userid,以及taskid是否改变
        if(!iD.Task || !iD.Task.d) return;
        var current_contextCenter=(context.map && iD.Task.d) ?context.map().center()+"-"+context.map().zoom()+"-"+iD.User.getInfo().userid +"-"+iD.Task.d.task_id:"";
        if(old_contextCenter==current_contextCenter&&iD.Task.d){
            return ;
        }else{
            old_contextCenter=current_contextCenter;
        }

        var _extent = context.map().extent(), min = _extent[0], max = _extent[1];
        var dimensions = context.map().dimensions();
        var _expand0 =(max[0]-min[0])/dimensions[0]; //视野范围外扩5米 (10米 = 0.000125度)
        var _expand1 =(max[1]-min[1])/dimensions[1];

        min[0] -= _expand0, min[1] -= _expand1;
        max[0] += _expand0, max[1] += _expand1;
        var p1 = new Point({loc: min}),
            p2 = new Point({loc: [min[0], max[1]]}),
            p3 = new Point({loc: max}),
            p4 = new Point({loc: [max[0], min[1]]});
        var nodes = [p1, p2, p3, p4, p1];
        var holeArrs=[];

        var nodeArray=nodes.map(function(h) {
            return h['loc'];
        });
        var taskTransaction=  entities.filter(function(o) { return iD.Task.d.trans_id == o.id});

        if(!taskTransaction.length){
            return ;
        }

        if (taskTransaction.length>0 && taskTransaction[0].holes) {
            var holes = taskTransaction[0].holes ;
            for (var k= 0, rk=holes.length; k<rk; k++) {
                var  coords = holes[k];
                holeArrs.push(coords) ;
            }
        }
        var path = iD.svg.GeoJsonPath(projection,true),
            areas = {};

        var drawArrays = polygonDifference(nodeArray,holeArrs) ;
        let _temp = entities[0];
        for (var i = 0; i < drawArrays.length; i++) {
            // var entity =  drawArrays[i];
            var entity={
                id:iD.Task.d.task_id+""+i,
                geometry: drawArrays[i],
                style:_temp.style,
                // onDraw: function (element, entity, classed) {
                //     element.style({

                //     })
                //     // element.style({
                //     //     "stroke": "#ff0000",
                //     //     'opacity': 0.3,
                //     //     'stroke-width': 2,
                //     //     'stroke-dasharray': '5, 5',
                //     //     'fill': '#333333'
                //     // });
                // },
                area: function(){
                    return 0;
                }
            };
            areas[entity.id] = {
                entity: entity
            };

        }

        areas = d3.values(areas).filter(function hasPath(a) {
            return path(a.entity); });
        areas = _.pluck(areas, 'entity');
        var strokes = areas.filter(function(area) {
            return true;
        });

        var data = {
            //clip: areas.filter(clip), 
            shadow: strokes,
            stroke: strokes,
            fill: areas
        };

        /* var clipPaths = surface.selectAll('defs').selectAll('.clipPath')
         .filter(filter)
         .data(data.clip, iD.Entity.key);

         clipPaths.enter()
         .append('clipPath')
         .attr('class', 'clipPath')
         .attr('id', function(entity) { return entity.id + '-clippath'; })
         .append('path');

         clipPaths.selectAll('path')
         .attr('d', path);

         clipPaths.exit()
         .remove();*/

        var areagroup = surface
            .select('.layer-transaction')
            // .style('pointer-events','none')
            .selectAll('g.transaction-polygongroup')
            .data(['fill', 'shadow', 'stroke']);

        areagroup.enter()
            .append('g')
            .attr('class', function(d) { return 'layer transaction-polygongroup area-' + d; });

        var paths = areagroup
            .selectAll('path')
            .filter(filter)
            .data(function(layer) {
                return data[layer];
            }, iD.Entity.key);

        // Remove exiting areas first, so they aren't included in the `fills`
        // array used for sorting below (https://github.com/openstreetmap/iD/issues/1903).
        paths.exit()
            .remove();

        var fills = areagroup.selectAll('.polygon-fill path.polygon')[0];

        var bisect = d3.bisector(function(node) {
            return -node.__data__.area(graph);
        }).left;

        function sortedByArea(entity) {
            if (this.__data__ === 'fill') {
                return fills[bisect(fills, -entity.area(graph))];
            }
        }

        paths.enter()
            .insert('path', sortedByArea)
            .each(function(entity) {
                var layer = this.parentNode.__data__;
                if(layer === "stroke"){
                    entity.style && d3.select(this).style(entity.style);
                    entity.onDraw && entity.onDraw.call(this,d3.select(this),entity);
                }
                //if (layer !== 'shadow' && layer !== 'stroke') this.setAttribute('class', entity.type + ' area ' + layer + ' ' + entity.id);

                if (layer === 'fill') {
                    this.setAttribute('clip-path', 'url(#' + entity.id + '-clippath)');
                }

                if (layer === 'fill') {
                    setPattern.apply(this, arguments);
                }
                this.setAttribute("fill-rule", "evenodd");
                //this.setAttribute("pointer-events", "none");
            });

        paths.attr('d', path);


        paths.classed('area-hidden',function(d){
            return d.display ? true : false;
        });


    }
    drawAreas.resetGraphyInfo = function(){
        old_contextCenter='';
    }
    drawAreas.old_contextCenter=function(_){
        old_contextCenter=_;
    };
    return drawAreas
};



