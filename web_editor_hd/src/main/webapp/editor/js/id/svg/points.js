iD.svg.Points = function (projection, context) {
    function markerPath(selection, klass, entity) {
    	var pmname = entity.modelName;
    	
		if(iD.data.DataType.ROAD_ATTRIBUTE == pmname){
			selection.append("path")
				.attr('class', klass)
				.attr('transform', 'translate(-9, -26)')
            	.attr('d', 'M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z');
		}else if(iD.data.DataType.POI == pmname ||
            iD.data.DataType.TEXT_MARK == pmname||
            iD.data.DataType.DEFAULT == pmname){
			selection.append("path")
				.attr('class', klass)
				.attr('transform', 'translate(-8, -23)')
            	.attr('d', 'M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z');
		}else if(iD.data.DataType.JUNCTION == pmname){
			selection.append('circle')
                .attr('class', klass)
                .attr('transform', 'translate(0, 2)')
                .attr('x', '0')
                .attr('y', '0')
                .attr('r', '8');
		}else if(_.include([
			iD.data.DataType.LAMPPOST, 
			iD.data.DataType.LIMITHEIGHT,
			iD.data.DataType.TRAFFICLIGHT
		], pmname)){
			// 'M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z'
			// 'translate(-8, -23)'
			var rectNum = 15;
			var translateNum = -Math.ceil(rectNum/2);
			var translateStr = 'translate(' + translateNum + ', ' + translateNum + ')';
			selection.append("path")
				.attr('class', klass)
				.attr('transform', translateStr)
            	.attr('d', path({
            		width: rectNum,
            		height: rectNum,
            		shape: 2
            	}));
           	selection.append("path")
				.attr('class', 'stroke')
				.attr('transform', translateStr)
            	.attr('d', path({
            		width: rectNum,
            		height: rectNum,
            		shape: 2
            	}));
		}else if(_.include([
			iD.data.DataType.OBJECT_PT
		], pmname)){
			selection.append("path")
				.attr('class', klass)
				.attr('transform', 'translate(-30, -16)')
            	.attr('d', path({
            		shape: 8
            	}));
           	/*
			selection.append("path")
				.attr('class', 'stroke')
				.attr('transform', 'translate(0)')
            	.attr('d', path({
            		shape: 8
            	}));
           	*/
		}else if(_.include([
			iD.data.DataType.CHECK_TAG,
			iD.data.DataType.IMAGE_TAG, 
			iD.data.DataType.ANALYSIS_TAG,
            iD.data.DataType.QUESTION_TAG,
            iD.data.DataType.POINT_TAG,
            iD.data.DataType.AUTO_NETWORK_TAG
		], pmname)){
			selection.classed(pmname.toLowerCase(), true);
			selection.append("path")
				.attr('class', klass)
				.attr('transform', 'translate(-8.5, -24)')
            	.attr('d', path({
            		shape: -1
            	}));
           	/*
			selection.append("path")
				.attr('class', 'stroke')
				.attr('transform', 'translate(0)')
            	.attr('d', path({
            		shape: 8
            	}));
           	*/
		}else if(_.include([
			iD.data.DataType.AUTO_NETWORK_TAG,
            iD.data.DataType.AUTO_CHECKWORK_TAG,
            iD.data.DataType.COMPILE_CHECK_TAG,
            iD.data.DataType.AUTO_COMPLETECHECK_TAG,
            iD.data.DataType.PICK_MARK_TAG
		], pmname)){
			klass = (pmname == iD.data.DataType.PICK_MARK_TAG) ? klass += '_quality_blue' : klass;
			selection.append("path")
				.attr('class', klass)
				.attr('transform', 'translate(-8, -23)')
	        	.attr('d', 'M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z');
	    }else if([
            iD.data.DataType.QUALITY_TAG
        ].includes(pmname)){
			
			// stroke_quality_darkgreen   深绿色   拓扑质检
			// stroke_quality_lightgreen  浅绿色   拓扑验收
			
			// stroke_quality_orange      橘色     线形质检
			// stroke_quality_yellow      黄色     线形验收
			
			// stroke_quality_darkblue    浅蓝色   全要素质检
			// stroke_quality_lightblue   深蓝色   全要素验收
			let checkStep = {
				'autoTopologyCheck': '_quality_darkgreen',
				'autoTopologyVerify': '_quality_lightgreen',
				'check': '_quality_orange',
				'verify': '_quality_yellow',
				// 'autoTopologyCheck': '_quality_darkblue',
				// 'autoTopologyCheck': '_quality_lightblue'
			};
			
			if(entity.tags.CHECK_STEP && checkStep[entity.tags.CHECK_STEP]){
				klass == 'stroke' ? klass += checkStep[entity.tags.CHECK_STEP] : klass;
			}else{
				klass == 'stroke' ? klass += '_quality_red' : klass;
			}
			
            // if (entity.tags.TAG_SOURCE == '4' || entity.tags.TAG_SOURCE == '5' || entity.tags.TAG_SOURCE == '6' || entity.tags.TAG_SOURCE == '7') {
            //     klass == 'stroke' ? klass += '_quality_red' : klass;
            // } else if (entity.tags.TAG_SOURCE == '1') {
            //     klass == 'stroke' ? klass += '_quality_orange' : klass;
            // } else if (entity.tags.TAG_SOURCE == '2') {
            //     klass == 'stroke' ? klass += '_quality_green' : klass;
            // }
            
            selection.append("path")
				.attr('class', klass)
				.attr('transform', 'translate(-8, -23)')
	        	.attr('d', 'M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z');
        }
    }
    
    var _imgObj = {
    	roadAttribute: {
    		icon: "dist/img/pano_marker_b.png",
    		width: 24,
    		height: 32,
    		offsetX: -12,
    		offsetY: -30
    	},
    	junction: {
    		icon: "dist/img/roadcross-point.png",
    		width: 24,
    		height: 32,
    		offsetX: -12,
    		offsetY: -14
    	}
    }
    
    function markerImg(selection, klass, entity){
    	if(!entity){
    		return ;
    	}
    	var pmname = entity.modelName;
    	var typeName = "";
		if(iD.data.DataType.ROAD_ATTRIBUTE == pmname){
			typeName = "roadAttribute"
		}else if(iD.data.DataType.JUNCTION == pmname){
			typeName = "junction";
		}
    	
    	var obj = _imgObj[typeName];
    	if(!obj){
    		return ;
    	}
    	
    	selection
            .attr('class', klass)
            .attr('transform', 'translate(' +(obj.offsetX || 0)+ ', ' +(obj.offsetY || 0)+ ')')
            .attr('xlink:href', obj.icon || "")
            .attr("width", obj.width)
            .attr("height", obj.height);
    }

    function sortY(a, b) {
        return b.loc[1] - a.loc[1];
    }

    function drawPoints(surface, points, filter) {
    	// 不能改filter，否则不匹配的点会累计显示，不会被删除
    	points = (points || []).filter(function(d){
    		var result = filter(d);
    		if(!result){
    			return result;
    		}
    		if(_.include([
    			iD.data.DataType.LAMPPOST,
    			iD.data.DataType.LIMITHEIGHT,
    			iD.data.DataType.TRAFFICLIGHT,
    			iD.data.DataType.CHECK_TAG,
    			iD.data.DataType.IMAGE_TAG,
    			iD.data.DataType.OBJECT_PT,
				iD.data.DataType.ANALYSIS_TAG,
				iD.data.DataType.QUESTION_TAG,
				iD.data.DataType.AUTO_NETWORK_TAG,
                iD.data.DataType.AUTO_CHECKWORK_TAG,
                iD.data.DataType.POINT_TAG
    		], d.modelName)){
    			// 灯杆、灯头都渲染；
    			result = true;
    			/*
    			result = false;
    			// 路灯杆 - 灯头类型12不渲染，只渲染灯杆4；
    			if(d.tags.TYPE == 2 && _.include(["4", 4], d.tags.SUBTYPE)){
    				result = true;
    			}else if(d.tags.TYPE == 3 && _.include(["0", 0], d.tags.SUBTYPE)){
    				// 指示牌
    				// 渲染一组（4个）点中的第一个点
    				let relations = context.graph().parentRelations(d, iD.data.DataType.R_OPT_OPT);
    				if(relations[0]){
    					result = d.id == relations[0].members[0].id;
    				}
    			}
    			*/
    		}
    		return result;
    	});
        points.sort(sortY);
        var groups = surface.select('.layer-hit').selectAll('g.point')
     // var groups = surface.select('.layer-points').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point ' + d.id + ' ' + (d.modelName || '').toLowerCase();
            })
            .order();
		/*
        group.append('path')
            .call(markerPath, 'shadow');
        */
        group.each(function(d){
        	markerPath(d3.select(this), 'shadow', d);
        });
        group.each(function(d){
            if(d.modelName != iD.data.DataType.ROAD_ATTRIBUTE && d.modelName != iD.data.DataType.JUNCTION){
                markerPath(d3.select(this), 'stroke', d);
            }
        });
		/*
        group.append('path')
            .call(markerPath, 'stroke');
		*/
		/*
		if(points.length == 1){
			if(iD.data.DataType.ROAD_ATTRIBUTE == points[0].modalName){
				group.append('image')
				    .call(markerImg, 'stroke');
			}else if(iD.data.DataType.JUNCTION == points[0].modalName){
				group.append('path')
					.attr("class", stroke)
				    .attr("d", path({shape: 4}) );
			}
		}else {
			group.append('path')
            	.call(markerPath, 'stroke');
		}
		*/
		group.append('image').classed("stroke", function(d){
			markerImg(d3.select(this), "stroke", d);
			return true;
		});
		
        // group.append('use')
        //     .attr('class', 'KDSEditor-icon')
        //     .attr('transform', 'translate(-6, -20)')
        //     .attr('clip-path', 'url(#clip-square-12)');
		
		// .attr('transform', iD.svg.PointTransform(projection))
        groups
        	.each(function(entity){
        		/*
        		if(_.include([
        			iD.data.DataType.CHECK_TAG,
        			iD.data.DataType.IMAGE_TAG,
        			iD.data.DataType.ANALYSIS_TAG
        		], entity.modelName)){
        			this.setAttribute('transform', iD.svg.PointTransform(projection)(entity) + ' scale(0.75, 0.75)');
        		}
        		*/
        		this.setAttribute('transform', iD.svg.PointTransform(projection)(entity));
        	})
            .call(iD.svg.TagClasses(), context.graph());

        // Selecting the following implicitly
        // sets the data (point entity) on the element
        groups.select('.shadow').attr('class', function (entity) {
            // var lay = entity.layerInfo();
            // if (lay.style) {
            //     d3.select(this).style(lay.style);
            // }
            // lay.onDraw && lay.onDraw.call(this, d3.select(this), entity, "shadow");
            return "shadow";
        });

        groups.select('.stroke').attr('class', function (entity) {
            // var lay = entity.layerInfo();
            // if (lay.style) {
            //     d3.select(this).style(lay.style);
            // }
            // lay.onDraw && lay.onDraw.call(this, d3.select(this), entity, "stroke");
            return "stroke";
        });

        // groups.select('.KDSEditor-icon')
        //     .attr('xlink:href', function(entity) {
        //         var preset = context.presets().match(entity, context.graph());
        //         return preset.icon ? '#maki-' + preset.icon + '-12' : '';
        //     });
        //设置隐藏或显示
        groups.classed('point-hidden', function (d) {
            return false;
            // return !d.layerInfo().display;
        });
        groups.exit()
            .remove();
    }

    drawPoints.points = function (entities, limit) {
        var graph = context.graph(),
            points = [];

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            // if (entity.geometry(graph) === 'point' && !entity.isRoadCross() && !entity.isPlaceName()&&!entity.isDetailSlope() &&!entity.isWalkZlevel()&& !entity.isQcTag() && entity.layerInfo().isPoint()) {
            if (entity.geometry(graph) === 'point' && !entity.isRoadCross() && !entity.isPlaceName()&&!entity.isDetailSlope() &&!entity.isWalkZlevel()&& !entity.isQcTag()) {
                if (entity.modelName == iD.data.DataType.AUTO_NETWORK_TAG && entity.tags.STATE == '4' && iD.User.isWorkRole()) {
                    continue;
                }
                points.push(entity);
                if (limit && points.length >= limit) break;
            }
        }

        return points;
    };
    
    // http://bl.ocks.org/mbostock/1020902 {0水滴,1圆形,2正方形,3菱形}
    function path(marker) {
        var width = marker.width, height = marker.height, rx = width / 2, ry = height / 2,
            shape = marker.shape == 0 ? 0 : (marker.shape || -1), shape = parseInt(shape), r = rx,
            d = "M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z";
        if (shape == 0)
            d = "M" + r + ",0" + " A" + r + "," + r + " 0 1,0 " + -r + ",0 C" + -r + "," + r + " 0," + r + " 0," + (height - r) + " C0," + r + " " + r + "," + r + " " + r + ",0 Z";
        if (shape == 1)
            d = "m " + 0 + ", " + ry + "   a " + rx + "," + ry + " 0 1,0 " + width + ",0    a " + rx + "," + ry + " 0 1,0 " + (-width ) + ",0";
        else if (shape == 2)
            d = "M " + 0 + " " + 0 + " L" + 0 + " " + height + " L" + width + " " + height + " L" + width + " " + 0 + " Z";
        else if (shape == 3)
            d = "M " + 0 + " " + ry + " L" + rx + " " + height + " L" + width + " " + ry + " L" + rx + " " + 0 + " Z";
        else if (shape == 4)         //加号
            d = "M 14,6 L 8,6 L 8,0 L 6,0 L 6,6 L 0,6 L 0,8 L 6,8 L 6,14 L 8,14 L 8,8 L 14,8 z";
        else if (shape == 5)         //减号
            d = "M 14,6 L 0,6 L 0,8 L 14,8 z";
        else if (shape == 6)         //对号
            d = "M13.771,0L5.794,7.907L1.53,3.286L0,4.107L3.831,9.853L3.825,9.858L5.263,12L15,1.543z";
        else if (shape == 7)         //问号
            d = "M4.036,10.006C4.03,9.801,4.027,9.646,4.027,9.544c0-0.604,0.085-1.125,0.256-1.564  c0.125-0.33,0.328-0.664,0.607-1c0.206-0.245,0.575-0.603,1.108-1.073c0.532-0.471,0.879-0.845,1.038-1.125  c0.16-0.279,0.24-0.584,0.24-0.915c0-0.599-0.234-1.125-0.701-1.578C6.108,1.836,5.535,1.61,4.857,1.61 c-0.656,0-1.203,0.205-1.642,0.616c-0.439,0.41-0.727,1.052-0.863,1.924L0.77,3.961c0.143-1.168,0.566-2.063,1.27-2.685 c0.704-0.621,1.635-0.932,2.792-0.932c1.226,0,2.203,0.333,2.934,1c0.729,0.667,1.094,1.474,1.094,2.42 c0,0.547-0.128,1.052-0.385,1.513C8.218,5.74,7.716,6.301,6.969,6.962C6.468,7.406,6.14,7.734,5.986,7.945 C5.832,8.156,5.718,8.398,5.644,8.672s-0.116,0.719-0.128,1.334H4.036z M3.942,13.093V11.34h1.753v1.753H3.942z"
        else if (shape == 8)                   //圆圈
            d = "M23 23 A 3 3, 0, 1, 1, 23.1 23.1 L 23.1 23Z";
            // d = "M23 23 A 10 10, 0, 1, 1, 23.1 23.1 L 23.1 23Z";
        return d;
    }

    return drawPoints;
};


// 点覆盖物渲染，可能需要与普通渲染不同的功能，暂时不和point合并。后续再说
iD.svg.Marker = function (projection, context) {
    //不同的shape配置不同颜色还没设置！！！notice！！
    function markerPath(selection, klass) {

        if (klass === 'shadow' || klass === 'stroke') {
            selection.each(function (entity) {
                if (klass === 'stroke') this.style.fill = entity.style && entity.style.fill || "green";
            });
        }
        //selection.attr('class', klass);
    }

    function sortY(a, b) {
        return a.index || (b.loc[1] - a.loc[1]);
    }

    // http://bl.ocks.org/mbostock/1020902 {0水滴,1圆形,2正方形,3菱形}
    function path(marker) {
        var width = marker.width, height = marker.height, rx = width / 2, ry = height / 2,
            shape = marker.shape == 0 ? 0 : (marker.shape || -1), shape = parseInt(shape), r = rx,
            d = "M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z";
        if (shape == 0)
            d = "M" + r + ",0" + " A" + r + "," + r + " 0 1,0 " + -r + ",0 C" + -r + "," + r + " 0," + r + " 0," + (height - r) + " C0," + r + " " + r + "," + r + " " + r + ",0 Z";
        if (shape == 1)
            d = "m " + 0 + ", " + ry + "   a " + rx + "," + ry + " 0 1,0 " + width + ",0    a " + rx + "," + ry + " 0 1,0 " + (-width ) + ",0";
        else if (shape == 2)
            d = "M " + 0 + " " + 0 + " L" + 0 + " " + height + " L" + width + " " + height + " L" + width + " " + 0 + " Z";
        else if (shape == 3)
            d = "M " + 0 + " " + ry + " L" + rx + " " + height + " L" + width + " " + ry + " L" + rx + " " + 0 + " Z";
        else if (shape == 4)         //加号
            d = "M 14,6 L 8,6 L 8,0 L 6,0 L 6,6 L 0,6 L 0,8 L 6,8 L 6,14 L 8,14 L 8,8 L 14,8 z";
        else if (shape == 5)         //减号
            d = "M 14,6 L 0,6 L 0,8 L 14,8 z";
        else if (shape == 6)         //对号
            d = "M13.771,0L5.794,7.907L1.53,3.286L0,4.107L3.831,9.853L3.825,9.858L5.263,12L15,1.543z";
        else if (shape == 7)         //问号
            d = "M4.036,10.006C4.03,9.801,4.027,9.646,4.027,9.544c0-0.604,0.085-1.125,0.256-1.564  c0.125-0.33,0.328-0.664,0.607-1c0.206-0.245,0.575-0.603,1.108-1.073c0.532-0.471,0.879-0.845,1.038-1.125  c0.16-0.279,0.24-0.584,0.24-0.915c0-0.599-0.234-1.125-0.701-1.578C6.108,1.836,5.535,1.61,4.857,1.61 c-0.656,0-1.203,0.205-1.642,0.616c-0.439,0.41-0.727,1.052-0.863,1.924L0.77,3.961c0.143-1.168,0.566-2.063,1.27-2.685 c0.704-0.621,1.635-0.932,2.792-0.932c1.226,0,2.203,0.333,2.934,1c0.729,0.667,1.094,1.474,1.094,2.42 c0,0.547-0.128,1.052-0.385,1.513C8.218,5.74,7.716,6.301,6.969,6.962C6.468,7.406,6.14,7.734,5.986,7.945 C5.832,8.156,5.718,8.398,5.644,8.672s-0.116,0.719-0.128,1.334H4.036z M3.942,13.093V11.34h1.753v1.753H3.942z"
        else if (shape == 8)                   //圆圈
            d = "M23 23 A 10 10, 0, 1, 1, 23.1 23.1 L 23.1 23Z";
        return d;
    }

    function ____(surface, points, filter) {
        points.sort(sortY);

        var groups = surface.select('.layer-marker').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point ' + d.id;
            })
            .order();

        group.append('path')
            .call(markerPath, 'shadow');

        group.append('path')
            .call(markerPath, 'stroke');

        surface.select('.layer-marker').selectAll('g.point')
            .each(function (marker) {
                var translate = marker.getAttribute().translate,
                    shape = path(marker),
                    shadow = this.childNodes[0],
                    stroke = this.childNodes[1];
                shadow.setAttribute('transform', translate);
                stroke.setAttribute('transform', translate);
                shadow.setAttribute('d', shape);
                stroke.setAttribute('d', shape);
            });

        group.append('rect')
            .call(function (entitys) {
                entitys.each(function (marker) {
                    if (!marker.visible || !marker.label) {
                        this.parentNode.removeChild(this);
                        return;
                    }
                    var attribute = marker.getRectAttribute();
                    this.setAttribute('transform', attribute.translate);
                    this.setAttribute('width', attribute.width);
                    this.setAttribute('height', attribute.height);
                    d3.select(this).style(attribute.style);
                });
            });

        group.append('text')
            .call(function (entitys) {
                entitys.each(function (marker) {
                    if (!marker.visible || !marker.label) {
                        this.parentNode.removeChild(this);
                        return;
                    }
                    var attribute = marker.getTextAttribute();
                    this.setAttribute('transform', attribute.translate);
                    this.textContent = marker.label;
                    d3.select(this).style(attribute.style);
                    this.parentNode.childNodes[2].
                        setAttribute('width', this.getComputedTextLength());
                });
            });

        group.append('path')
            .call(function (entitys) {
                entitys.each(function (marker) {
                    if (!marker['arrow-visible']) {
                        this.parentNode.removeChild(this);
                        return;
                    }
                    var attribute = marker.getArrowAttribute();
                    this.setAttribute('d', 'M 20 12 L 0 12 L 0 8 L 20 8 L 20 0 L 40 10 L 20 20 z');
                    this.setAttribute('transform', attribute.translate);
                    d3.select(this).style(attribute.style);
                });
            });

        groups.attr('transform', iD.svg.PointTransform(projection)).call(iD.svg.TagClasses());

        groups.select('.shadow').attr('class', function (entity) {
            entity.style && d3.select(this).style(entity.style);
            entity.onDraw && entity.onDraw.call(this, d3.select(this), entity, "shadow");
            return "shadow";
        });

        groups.select('.stroke').attr('class', function (entity) {
            entity.style && d3.select(this).style(entity.style);
            entity.onDraw && entity.onDraw.call(this, d3.select(this), entity, "stroke");
            return "stroke";
        });

        groups.classed('point-hidden', function (d) {
            return d.display ? true : false;
        });

        groups.exit()
            .remove();
    }

    return ____;
}


// 点覆盖物渲染，可能需要与普通渲染不同的功能，暂时不和point合并。后续再说
iD.svg.MarkerIcon = function (projection, context) {
    function markerImage(selection) {
        selection
            .attr('class', 'image')
            .attr('xlink:href', function (d) {
                return d.url;
            });
    }


    function ________(surface, points, filter) {

        var groups = surface.select('.layer-icon').selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point ' + d.id;
            })
            .order();

        group.append('image')
            .call(markerImage, 'image');

        surface.select('.layer-icon').selectAll('g.point')
            .each(function (icon) {
                var node = this.childNodes[0];
                var x = -icon.getSizeCenter()[0] + icon.offset[0];
                var y = -icon.getSizeCenter()[1] + icon.offset[1];
                node.setAttribute('width', icon.width);
                node.setAttribute('height', icon.height);
                node.setAttribute('transform', 'translate(' + (x) + ', ' + (y) + ')');
            });

        group.append('rect')
            .call(function (entitys) {
                entitys.each(function (icon) {
                    if (!icon.visible || !icon.label) {
                        return;
                    }//this.parentNode.removeChild(this);
                    var attribute = icon.getRectAttribute();
                    this.setAttribute('transform', attribute.translate);
                    this.setAttribute('width', attribute.width);
                    this.setAttribute('height', attribute.height);
                    d3.select(this).style(attribute.style);
                });
            });
        /**
         https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
         */
        group.append('text')
            .call(function (entitys) {
                entitys.each(function (icon) {
                    if (!icon.visible || !icon.label) {
                        return;
                    }//this.parentNode.removeChild(this);
                    var attribute = icon.getTextAttribute();
                    this.setAttribute('transform', attribute.translate);
                    this.textContent = icon.label;
                    d3.select(this).style(attribute.style);
                    this.parentNode.childNodes[1].
                        setAttribute('width', this.getComputedTextLength());
                });
            });

        group.append('path')
            .call(function (entitys) {
                entitys.each(function (icon) {
                    if (!icon['arrow-visible']) {
                        return;
                    }//this.parentNode.removeChild(this);
                    var attribute = icon.getArrowAttribute();
                    this.setAttribute('d', 'M 20 12 L 0 12 L 0 8 L 20 8 L 20 0 L 40 10 L 20 20 z');
                    this.setAttribute('transform', attribute.translate);
                    d3.select(this).style(attribute.style);
                });
            });

        groups.attr('transform', iD.svg.PointTransform(projection));

        groups.classed('point-hidden', function (d) {
            return d.display ? true : false;
        });

        groups.exit()
            .remove();
    }

    return ________;
}
// 部分数据重绘
iD.svg.PartRedraw = function (projection, context) {
    function redraw() {
    }

    redraw.resetIcon = function (surface, points) {
        var selector = '.' + points.id, groups = surface.select('.layer-icon').selectAll(selector);
        groups.each(function (icon) {
            var node = this.childNodes[0];
            var x = -icon.getSizeCenter()[0] + icon.offset[0];
            var y = -icon.getSizeCenter()[1] + icon.offset[1];
            node.setAttribute('width', icon.width);
            node.setAttribute('height', icon.height);
            node.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
            node.setAttribute('href', icon.url);

            if (!icon.visible || !icon.label) return;
            node = this.childNodes[1];
            var attribute = icon.getRectAttribute();
            node.setAttribute('transform', attribute.translate);
            node.setAttribute('width', attribute.width);
            node.setAttribute('height', attribute.height);
            d3.select(node).style(attribute.style);

            node = this.childNodes[2];
            var attribute = icon.getTextAttribute();
            node.setAttribute('transform', attribute.translate);
            node.textContent = icon.label;
            d3.select(node).style(attribute.style);
            this.childNodes[1].
                setAttribute('width', node.getComputedTextLength());
        });
        groups.attr('transform', iD.svg.PointTransform(projection));
    }
    redraw.resetMarker = function (surface, points) {
        var selector = '.' + points.id, groups = surface.select('.layer-marker').selectAll(selector);
        groups.each(function (marker) {
            var node = this.childNodes[0];//shadow
            var translate = marker.getAttribute().translate
            node.setAttribute('transform', translate);
            marker.onDraw && marker.onDraw.call(node, d3.select(node), marker, "shadow");

            node = this.childNodes[1];//stroke
            node.setAttribute('transform', translate);
            d3.select(node).style(marker.style);
            marker.onDraw && marker.onDraw.call(node, d3.select(node), marker, "stroke");

            if (!marker.visible || !marker.label) return;
            node = this.childNodes[2]; //rect
            var attribute = marker.getRectAttribute();
            node.setAttribute('transform', attribute.translate);
            node.setAttribute('width', attribute.width);
            node.setAttribute('height', attribute.height);
            d3.select(node).style(attribute.style);

            node = this.childNodes[3];//text
            var attribute = marker.getTextAttribute();
            node.setAttribute('transform', attribute.translate);
            node.textContent = marker.label;
            d3.select(node).style(attribute.style);

            node = this.childNodes[4];//arrow
            var attribute = marker.getArrowAttribute();
            node.setAttribute('transform', attribute.translate);
            d3.select(node).style(attribute.style);

        });
        groups.attr('transform', iD.svg.PointTransform(projection));
    }
    redraw.resetPolyline = function (surface, lines) {
        var selector = '.' + lines.id, getPath = iD.svg.Path(projection, context.graph());
        surface.select('.layer-polyline').selectAll(selector)
            .each(function (line) {
                this.setAttribute('d', getPath(line));
            });
    }
    redraw.resetPolygon = function (surface, polygons) {
        var selector = '.' + polygons.id, getPath = iD.svg.Path(projection, context.graph());
        surface.select('.layer-polygon').selectAll(selector)
            .each(function (polygon) {
                this.setAttribute('d', getPath(polygon));
            });
    }
    return redraw;
}


// 点覆盖物渲染，可能需要与普通渲染不同的功能，暂时不和point合并。后续再说
iD.svg.Label = function (projection, context) {
    function markerPath(selection, style) {
        if (style == 'image') {
            selection
                .attr('class', style)
                .attr('x', 9)
                .attr('y', -7)
                .attr('width', 13)
                .attr('height', 13)
                .attr('xlink:href', function (d) {
                    return context.imagePath('toolbar-close.png');
                });

        } else
            selection
                .attr('r', 6)
                .attr('stroke', "red")
                .attr('stroke-width', "2")
                .attr('fill', "#FFF")
                .attr('opacity', '0.7')
                .attr('transform', 'translate(0, 0)');
    }

    function drawLabel(surface, points, filter, type) {
        var groups = surface.select('.layer-' + type).selectAll('g.point')
            .filter(filter)
            .data(points, iD.Entity.key);
        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node point ' + d.id;
            })
            .order();

        if (type == 'polylabel') {
            var rectXY = [-8, -30, 9, -9];
            var textXY = [-3, -18, 13, 3];

            function attrW(entity) {
                var width = entity.distance > 10000 ? 180 : 160;
                if (entity.end)
                    width = 150;
                return width;
            }

            function attrXY(entity, l) {
                return [entity.end ? l[0] : l[2], entity.end ? l[1] : l[3]];
            }

            function text(entity) {
                //console.log(entity);
                var text = entity.end ? '' : ' (双击结束)';
                var dis = entity.distance < 1000 ? entity.distance + "米" : (entity.distance / 1000).toFixed(2) + "公里";
                //var partDis = entity.distance[1] < 1000 ? entity.distance[1] + "米" : (entity.distance[1] / 1000).toFixed(2) + "公里";
               // return '分段长:' + partDis + ';总长 ：' + dis + text;
                return '总长 ：' + dis + text;
                //console.log(entity.partDistance);

            }

            group.append('rect')
                .call(function (entitys) {
                    entitys.each(function (entity) {
                        var xy = attrXY(entity, rectXY);
                        this.setAttribute('x', xy[0]);
                        this.setAttribute('y', xy[1]);
                        this.setAttribute('width', attrW(entity));
                    });
                })
                .attr('rx', '6')
                .attr('ry', '12')
                .attr('height', '17')
                .attr('fill', '#fff')
                .attr('stroke-width', 2)
                .attr('opacity', '0.7')
                .attr('stroke', 'red');

            group.append('text')
                .call(function (entitys) {
                    entitys.each(function (entity) {
                        var xy = attrXY(entity, textXY);
                        this.textContent = text(entity);
                        this.setAttribute('x', xy[0]);
                        this.setAttribute('y', xy[1]);
                        this.setAttribute('font-size', 10);
                        this.setAttribute('font-family', '微软雅黑');
                        this.setAttribute('font-weight', 'bold');
                        this.setAttribute('fill', '#333');
                        entity.computedTextLength = this.getComputedTextLength();
                    });
                });
            // .attr('font-size', 25);

        } else if (type == 'polygonlabel') {

            var rectXY = [-8, -30, 9, -9];
            var textXY = [-3, -18, 13, 3];

            function attrXY(entity, l) {
                return [l[0], l[1]];
                //return [entity.end ? l[0] :  l[2], entity.end ? l[1] :  l[3]];
            }

            function attrText(entity) {
                //var text = entity.end ? '' : ' (双击结束)';
                var dis = entity.distance < 100000 ? entity.distance + "平方米" : (entity.distance / 1000).toFixed(1) + "平方公里";
                return '总面积 ：' + dis;// + text ;
            }

            group.append('rect')
                .call(function (entitys) {
                    entitys.each(function (entity) {
                        var xy = attrXY(entity, rectXY);
                        this.setAttribute('x', xy[0]);
                        this.setAttribute('y', xy[1]);
                        this.setAttribute('width', attrText(entity).length * 10);
                    });
                })
                .attr('rx', '6')
                .attr('ry', '12')
                .attr('height', '17')
                .attr('fill', '#fff')
                .attr('stroke-width', 2)
                .attr('opacity', '0.7')
                .attr('stroke', 'red');

            group.append('text')
                .call(function (entitys) {
                    entitys.each(function (entity) {
                        var xy = attrXY(entity, textXY);
                        this.textContent = attrText(entity);
                        this.setAttribute('x', xy[0]);
                        this.setAttribute('y', xy[1]);
                        this.setAttribute('font-size', 10);
                        this.setAttribute('font-family', '微软雅黑');
                        this.setAttribute('font-weight', 'bold');
                        this.setAttribute('fill', '#333');
                    });
                });
        } else {
            group.append('circle')
                .call(markerPath, 'stroke');
            group.append('image')
                .call(markerPath, 'image');

        }

        groups.attr('transform', iD.svg.PointTransform(projection))
            .call(iD.svg.TagClasses());


        groups.exit()
            .remove();
    }

    return drawLabel;
}


iD.svg.Circle = function (projection, context) {

    function drawCircle(surface, points, filter) {

        var groups = surface.select('.layer-circle').selectAll('g.circle')
            .filter(filter)
            .data(points, iD.Entity.key);

        var group = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'layer circle ' + d.id;
            })
            .order();


        function euclideanDistance(projection) {
            return function (entity) {
                return iD.geo.euclideanDistance(projection(entity.loc), projection(entity.radius));
            };
        }

        group.append('circle')
            .attr('r', euclideanDistance(projection))
            .attr('stroke', "red")
            .attr('stroke-width', "2")
            .attr('fill', "#FFF")
            .attr('opacity', '0.7')
            .attr('transform', 'translate(0, 0)');


        surface.select('.layer-circle').selectAll('g.circle')
            .each(function (entity) {
                var r = iD.geo.euclideanDistance(projection(entity.loc), projection(entity.radius));
                entity.getRadius(r);
                this.childNodes[0].setAttribute('r', r);
            });

        groups.attr('transform', iD.svg.PointTransform(projection))
            .call(iD.svg.TagClasses());

        groups.classed('point-hidden', function (d) {
            return d.display ? true : false;
        });

        groups.exit()
            .remove();
    }

    return drawCircle;
}


iD.svg.overlayers = [];

iD.svg.overlayers.Vertices = function (projection, context) {


    function midpoints(surface, graph, entities, filter, extent, type) {
        var poly = extent.polygon(),
            midpoints = {};

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];

            if (!entity.editable || entity.display)
                continue;

            var nodes = entity.nodes;//graph.childNodes(entity);
            for (var j = 0; j < nodes.length - 1; j++) {

                var a = nodes[j],
                    b = nodes[j + 1],
                    id = [a.id, b.id].sort().join('-');

                if (midpoints[id]) {
                    //midpoints[id].parents.push(entity);
                } else {
                    if (iD.geo.euclideanDistance(projection(a.loc), projection(b.loc)) > 40) {
                        var point = iD.geo.interp(a.loc, b.loc, 0.5),
                            loc = null;

                        if (extent.intersects(point)) {
                            loc = point;
                        } else {
                            for (var k = 0; k < 4; k++) {
                                point = iD.geo.lineIntersection([a.loc, b.loc], [poly[k], poly[k + 1]]);
                                if (point &&
                                    iD.geo.euclideanDistance(projection(a.loc), projection(point)) > 20 &&
                                    iD.geo.euclideanDistance(projection(b.loc), projection(point)) > 20) {
                                    loc = point;
                                    break;
                                }
                            }
                        }

                        if (loc) {
                            midpoints[id] = new Point({
                                //type: 'midpoint',
                                editable: true,
                                id: id,
                                loc: loc,
                                vertices: 'm',
                                edge: [a.id, b.id],
                                parents: entity
                            });
                        }
                    }
                }
            }
        }


        var groups = surface.select('.layer-' + type).selectAll('g.midpoint')
            .filter(filter)
            .data(_.values(midpoints), function (d) {
                return d.id;
            });

        var enter = groups.enter()
            .append('g')
            .attr('class', 'midpoint');


        enter.append('circle')
            .attr('r', 8)
            .attr('class', 'shadow');

        enter.append('circle')
            .attr('r', 4)
            .attr('class', 'fill');

        groups.attr('transform', iD.svg.PointTransform(projection));

        // Propagate data bindings.
        groups.select('circle.shadow');
        groups.select('circle.fill');


        groups.exit()
            .remove();
    }

    var hover;


    function draw(selection, vertices, klass, graph, zoom) {

        var groups = selection.data(vertices, function (entity) {
            return iD.Entity.key(entity);
        });

        function classCircle(klass) {
            return function (entity) {
                this.setAttribute('class', 'node vertex ' + klass + ' ' + entity.id);
            };
        }

        function setAttributes(selection) {
            ['shadow', 'stroke'].forEach(function (klass) {
                selection.selectAll('.' + klass)
                    .each(function (entity) {
                        this.setAttribute('cx', 0);
                        this.setAttribute('cy', -0);
                        this.setAttribute('r', (klass == 'stroke' ? 2.75 : 6.6));
                        this.removeAttribute('visibility');
                    });
            });
        }

        var enter = groups.enter()
            .append('g')
            .attr('class', function (d) {
                return 'node vertex ' + klass + ' ' + d.id;
            });

        enter.append('circle')
            .each(classCircle('shadow'));

        enter.append('circle')
            .each(classCircle('stroke'));


        groups
            .attr('transform', iD.svg.PointTransform(projection))
            .call(setAttributes);

        groups.classed('circle-hidden', function (d) {
            return d.display ? true : false;
        });

        groups.exit()
            .remove();
    }

    function drawVertices(surface, graph, entities, filter, extent, zoom, type) {

        var vertices = [];
        entities.forEach(function (overlay) {
            //overlay.enable = true; // 做测试用
            overlay.editable && !overlay.display && overlay.nodes.forEach(function (n, i) {
                n.editable = true;
                n.vertices = 'v';
                n.parent = overlay.id;
                n.display = overlay.display;
                vertices.push(n);
            });
        });

        surface.select('.layer-' + type).selectAll('g.vertex.vertex-persistent')
            .filter(filter)
            .call(draw, vertices, 'vertex-persistent', graph, zoom);


        midpoints(surface, graph, entities, filter, extent, type)

    }

    return drawVertices;
};


iD.svg.PointPathLines = function (projection, context) {
    var draw = function (surface, graph, entities, filter) {
        function coordinates(entity) {
            var c = iD.Layers.getLayer(entity.layerId).origCoord,
                k = entity.tags, loc = [];
            if (c.length == 2 && k[c[0]] && k[c[1]]) loc = [k[c[0]], k[c[1]]];
            else if (k[c]) loc = k[c];
            if (loc.length == 2) {
                if (isNaN(parseFloat(loc[0])) || isNaN(parseFloat(loc[1]))) loc = [];
            }
            return loc;
        }

        //  绘制两点之间的线段
        function PointPathLine(projection, graph) {
            var round = iD.svg.Round().stream,
                clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
                project = projection.stream,
                path = d3.geo.path()
                    .projection({
                        stream: function (output) {
                            return project(clip(round(output)));
                        }
                    });

            return function (entity) {
                try {
                    var json = {
                        type: 'LineString',
                        coordinates: []
                    };
                    json.coordinates.push(entity.loc);
                    json.coordinates.push(coordinates(entity));
                    return path(json);
                } catch (e) {
                }
            };
        };
        //  绘制虚拟节点
        function VirtualPointTransform(projection) {
            return function (entity) {
                var pt = projection(coordinates(entity));
                return 'translate(' + pt[0] + ',' + pt[1] + ')';
            };
        };


        var path = PointPathLine(projection, graph);
        var graph = context.graph(),
            points = [],
            virtualPoints = [];

        if (context.temp().rawposition && context.selectedIDs()) {
            for (var i = 0; i < context.selectedIDs().length; i++) {
                var entityId = context.selectedIDs()[i], entity = context.entity(entityId);
                if (entity.geometry(graph) === 'point') {
                    if (coordinates(entity).length == 2) {
                        points.push(entity);
                        virtualPoints.push(entity);
                    }
                }
            }
        }

        function drawLinePaths() {

            var groups = surface.select('.layer-point-path-line')
                .selectAll('g.point-to-path')
                .filter(filter)
                .data(points, function (d) {
                    return d.id;
                }); // function(d) { return d.id; }

            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'path point ' + d.id;
                });

            group.append('path')
                .attr('d', path)
                .style({
                    'stroke': 'blue',
                    'stroke-width': '2'
                });

            groups.exit()
                .remove();

        }

        function drawVirtualPointPaths() {
            var groups = surface.select('.layer-point-path-line')
                .selectAll('g.point-to-point')
                .filter(filter)
                .data(virtualPoints, function (d) {
                    return d.id;
                });

            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'path point ' + d.id;
                });

            group.append('path')
                .attr('transform', 'translate(-5, -7)')
                .attr('d', 'M 0, 6 L 6, 12 L 12, 6 L 6, 0 z')
                .style({
                    'stroke': 'blue',
                    'fill': 'blue'
                });


            groups.attr('transform', VirtualPointTransform(projection));

            groups.exit()
                .remove();
        }

        surface.selectAll('.layer-point-path-line').remove();
        surface.append('g').attr('class', 'layer layer-point-path-line');

        drawLinePaths();
        drawVirtualPointPaths();


    }
    return draw;
}


iD.svg.PointPathLines = function (projection, context) {

    function draw(surface, graph, entities, filter) {

        //获取原经纬度
        function coordinates(entity) {
            var c = iD.Layers.getLayer(entity.layerId).origCoord, k = entity.tags, loc = [];
            if (k[c] !== '') {
                if (k[c].indexOf(';') === -1) {//point
                    loc = [k[c].split(',')[0], k[c].split(',')[1]];
                    if ((isNaN(parseFloat(loc[0])) || isNaN(parseFloat(loc[1])))) loc = [];
                } else {//way area
                    var xys = k[c].split(';');
                    for (var i in xys) {
                        var x_y = xys[i].split(',');
                        loc.push([parseFloat(x_y[0]), parseFloat(x_y[1])]);
                    }
                    if (loc.length <= 1) loc = [];
                }
            } else loc = [];
            return loc;
        }

        //获取虚线或实线(原线)绘制路径
        function getAttitudeD(projection, graph) {
            var round = iD.svg.Round().stream,
                clip = d3.geo.clipExtent().extent(projection.clipExtent()).stream,
                project = projection.stream,
                path = d3.geo.path().projection({
                    stream: function (output) {
                        return project(clip(round(output)));
                    }
                }),
                json = {type: 'LineString', coordinates: []};

            return {
                solid: function (entity) {//way
                    try {
                        json.coordinates = [];
                        var locs = coordinates(entity);
                        for (var k in locs) json.coordinates.push(locs[k]);
                        return path(json);
                    } catch (e) {
                    }
                },
                dotted: function (entity) {//point way area
                    try {
                        json.coordinates = [];
                        var src_locs = coordinates(entity);
                        var e_g = entity.geometry(graph);
                        if (e_g === 'point') {
                            json.coordinates.push(entity.loc);
                            json.coordinates.push(src_locs);
                        } else if (e_g === 'line') {
                            if (src_locs.length <= 2 && (typeof src_locs[0] === 'string' || !src_locs[0])) {
                                json.coordinates = [];
                            } else {
                                var locs = [], nodes = entity.nodes;
                                for (var k in nodes) locs.push(context.entity(nodes[k]).loc);
                                json.coordinates.push(iD.util.getLocsLenCenter(locs, projection));
                                json.coordinates.push(iD.util.getLocsLenCenter(src_locs, projection));
                            }
                        } else if (e_g === 'area') {
                            var locs = [], nodes = entity.nodes;
                            for (var k in nodes) locs.push(context.entity(nodes[k]).loc);
                            json.coordinates.push(iD.util.getLocsCenter(locs));
                            json.coordinates.push(iD.util.getLocsCenter(src_locs));
                        }
                        return path(json);
                    } catch (e) {
                    }
                }
            }
        };

        //获取原点像素位置
        function srcPointTransform(projection) {
            return function (entity) {
                var pt = projection(coordinates(entity));
                return 'translate(' + pt[0] + ',' + pt[1] + ')';
            };
        };

        var graph = context.graph(), path = getAttitudeD(projection, graph), entitys = [],
            sIDs = context.selectedIDs();

        if (context.temp().rawposition && sIDs) {
            for (var i = 0; i < sIDs.length; i++) {
                var entityId = sIDs[i], entity = context.entity(entityId);
                var e_geometry = entity.geometry(graph), locs = coordinates(entity);
                if (e_geometry === 'point') {
                    if (locs.length === 2) entitys.push(entity);
                } else if (e_geometry === 'line' || e_geometry === 'area') {
                    if (locs && locs !== '') entitys.push(entity);
                }
            }
        }

        //过滤指定类型的entity
        function filterEntities(type) {
            if (!type) return entitys;
            var pts = [];
            for (var i in entitys) {
                if (!entitys[i].geometry) continue;
                if (entitys[i].geometry(graph) === type) pts.push(entitys[i]);
            }
            return pts;
        }

        //绘制原点
        function drawSrcPoint() {
            var groups = surface.select('.layer-point-path-line')
                .selectAll('g.point-to-point')
                .filter(filter)
                .data(filterEntities('point'), function (d) {
                    return d.id;
                });

            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'path point ' + d.id;
                });

            group.append('path')
                .attr('transform', 'translate(-5, -7)')
                .attr('d', 'M 0, 6 L 6, 12 L 12, 6 L 6, 0 z')
                .style({'stroke': 'blue', 'fill': 'blue'});

            groups.attr('transform', srcPointTransform(projection));

            groups.exit().remove();
        }

        //绘制原线路径(实线)
        function drawSrcWay() {
            var groups = surface.select('.layer-point-path-line')
                .selectAll('g.src-line-path')
                .filter(filter)
                .data(filterEntities('line'), function (d) {
                    return d.id;
                });

            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'path line ' + d.id;
                });

            group.append('path').attr('d', path.solid).style({'stroke': 'blue', 'stroke-width': '2'});

            groups.exit().remove();
        }

        //绘制原面(实线)
        function drawSrcArea() {
            var groups = surface.select('.layer-point-path-line')
                .selectAll('g.src-area-path')
                .filter(filter)
                .data(filterEntities('area'), function (d) {
                    return d.id;
                });

            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'path area ' + d.id;
                });

            group.append('path').attr('d', path.solid).style({
                'stroke': 'blue',
                'stroke-width': '2',
                'fill': '#333333',
                'fill-opacity': 0.5
            });

            groups.exit().remove();
        }

        //绘制虚线
        function drawDottedLine() {
            var groups = surface.select('.layer-point-path-line')
                .selectAll('g.dotted-line')
                .filter(filter)
                .data(filterEntities(), function (d) {
                    return d.id;
                });

            var group = groups.enter()
                .append('g')
                .attr('class', function (d) {
                    return 'path dotted ' + d.id;
                });

            group.append('path').attr('d', path.dotted).style({
                'stroke': '#333333',
                'stroke-width': '2',
                'stroke-dasharray': '5, 5'
            });

            groups.exit().remove();
        }

        surface.selectAll('.layer-point-path-line').remove();
        surface.append('g').attr('class', 'layer layer-point-path-line');

        drawSrcPoint();
        drawSrcWay();
        drawSrcArea();
        drawDottedLine();
    }

    return draw;
}
