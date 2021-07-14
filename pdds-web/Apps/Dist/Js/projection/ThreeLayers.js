var task_ids = [];
var layer_ids = [];
var task_line_layers_json = {};
var task_point_layers_json={};
var task_track_layers_json = {};
var task_line_layers_mesh = {};
var task_point_layers_mesh={};
var last_frameid = 0;
var last_line_color = {};
var font_yahei = null;
//
var global_reloaded = false;

/**
 * 查询与所有可视图层的交叉情况
 *
 * @param _raycaster
 * @param _callback
 * @returns {Array} [{"layer_id":layer_id,"intersects":[...]}]
 */
function intersectObjects(_raycaster, _callback) {
    var layer_nums = layer_ids.length;
    var intersect_result = [];
    for (var i = 0; i < layer_nums; i++) {
        var layer_id = layer_ids[i];
        var meshGroup = task_line_layers_mesh[layer_id]["mesh"];
        if (meshGroup.visible) {
            var intersects = _raycaster.intersectObjects(meshGroup.children, true);
            //
            var inter_nums = intersects.length;
            if (inter_nums > 0) {
                var intersect_layer_result = {};
                intersect_layer_result['layer_id'] = layer_id;
                intersect_layer_result['intersects'] = [];
                for (var j = 0; j < inter_nums; j++) {
                    intersect_layer_result['intersects'].push(intersects[j]);
                }
                //
                intersect_result.push(intersect_layer_result);
            }
        }
    }
    //debug("intersect_result="+JSON.stringify(intersect_result));
    return intersect_result;
}

function computeRycaster(_raycaster, _callback) {
    //
    var layer_nums = layer_ids.length;
    // for (var i = 0; i < layer_nums; i++) {
    //     var layer_id = layer_ids[i];
    //     var meshGroup = task_line_layers_mesh[layer_id]["mesh"];
    //     if (meshGroup.visible) {
    //         var intersects = _raycaster.intersectObjects(meshGroup.children, true);
    //         //
    //         if (intersects.length > 0) {
    //             if (INTERSECTED != intersects[0].object) {
    //                 if (INTERSECTED) {
    //                     INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    //                 }
    //                 INTERSECTED = intersects[0].object;
    //                 INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
    //                 INTERSECTED.material.color.setHex(0xff0000);
    //                 //
    //                 _callback(INTERSECTED.userData);
    //             }
    //         } else {
    //             if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    //             INTERSECTED = null;
    //             _callback(null);
    //         }
    //     }
    // }
}

function highlightCurrentFrame(_frame_id, _layer_id) {
    if (last_frameid != _frame_id) {
        if (last_frameid != 0) {
            var layer_nums = layer_ids.length;
            for (var i = 0; i < layer_nums; i++) {
                var layer_id = layer_ids[i];
                var frame_meshs = task_line_layers_mesh[layer_id]["frame_meshs"];
                var meshGroup = task_line_layers_mesh[layer_id]["mesh"];
                if (meshGroup.visible) {
                    var meshes = frame_meshs[last_frameid];
                    if (meshes) {
                        for (var i = 0; i < meshes.length; i++) {
                            meshes[i].material.color.setHex(last_line_color[layer_id]);
                            meshes[i].material.color.depthTest = true;
                            meshes[i].renderOrder = 0;
                            meshes[i].onBeforeRender = function (renderer) {

                            };
                        }
                    }
                }

            }
        }
        var layer_nums = layer_ids.length;
        for (var i = 0; i < layer_nums; i++) {
            var layer_id = layer_ids[i];
            var frame_meshs = task_line_layers_mesh[layer_id]["frame_meshs"];
            var meshGroup = task_line_layers_mesh[layer_id]["mesh"];
            if (meshGroup.visible) {
                var meshes = frame_meshs[_frame_id];
                if (meshes) {
                    for (var i = 0; i < meshes.length; i++) {
                        last_line_color[layer_id] = meshes[i].material.color.getHex();
                        //
                        meshes[i].material.color.setHex(0xffff00);
                        meshes[i].material.color.depthTest = false;
                        meshes[i].renderOrder = 999;
                        meshes[i].onBeforeRender = function (renderer) {
                            renderer.clearDepth();
                        };
                    }
                }
            }
        }
        //
        last_frameid = _frame_id;
    }
}

function getLayerInfo(_layer_id) {
    if (_layer_id && (typeof _layer_id) == 'string') {
        var infos = _layer_id.split("-");
        var rs = {};
        rs['geom_type'] = infos[0];
        rs['task_id'] = infos[1];
        rs['type_id'] = infos[2];
        //
        return rs;
    }
    return null;
}

/**
 * 生成指定宽度的线
 *
 * @param _positions
 * @param coordinate_array
 * @param width 线宽
 */
function createThickLineObject(_positions, coordinate_array, width) {
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();
    //
    v1.x = coordinate_array[0][0];
    v1.y = coordinate_array[0][1];
    v1.z = coordinate_array[0][2];
    //
    for (var i = 1; i < coordinate_array.length; i++) {

        v2.x = coordinate_array[i][0];
        v2.y = coordinate_array[i][1];
        v2.z = coordinate_array[i][2];
        //
        var v = new THREE.Vector3();
        v.subVectors(v2, v1);
        //
        var v_n = new THREE.Vector3(0, 0, 1);
        var s_n_1 = new THREE.Vector3();
        //
        //叉乘求方向向量
        s_n_1.crossVectors(v, v_n);
        s_n_1.normalize();
        //
        //debug(JSON.stringify(s_n_1));
        //
        //
        var s_1 = s_n_1.clone();
        var half_width=width / 2.0;
        if(half_width<=0){
            half_width=0.01;
        }
        s_1.multiplyScalar(half_width);
        //
        //debug("s_1"+JSON.stringify(s_1));
        //
        var p1 = v1.clone();
        var p2 = v2.clone();
        var p3 = v2.clone();
        var p4 = v1.clone();
        //
        p1.add(s_1);
        p2.add(s_1);
        p3.sub(s_1);
        p4.sub(s_1);
        //
        var pvs = [];
        pvs.push(p1);
        pvs.push(p2);
        pvs.push(p3);
        pvs.push(p4);
        //
        var pvs_index = [0, 1, 2, 0, 2, 3];

        for (var j = 0; j < pvs_index.length; j++) {
            _positions.push(pvs[pvs_index[j]].x);
            _positions.push(pvs[pvs_index[j]].y);
            _positions.push(pvs[pvs_index[j]].z);
            //debug(JSON.stringify(pvs[pvs_index[i]]));
        }
        //交换
        v1.x = coordinate_array[i][0];
        v1.y = coordinate_array[i][1];
        v1.z = coordinate_array[i][2];
    }

}
function addPointLayer(taskid, typeid, geojson, line_width, color, hovercolor, selcolor,options){
    var layer_id = "point-" + taskid + "-" + typeid;
    if (!task_point_layers_json[layer_id]) {

        task_point_layers_json[layer_id] = {
            "taskid": taskid,
            "typeid": typeid,
            "geojson": geojson,
            "line_width": line_width,
            "color": color,
            "hovercolor": hovercolor,
            "selcolor": selcolor,
            "is_add_to_map": false
        };
        //
        //debug("layer_id=" + layer_id);
        showPointLayer(taskid, typeid,options);
        //
        layer_ids.push(layer_id);
    }
}
function addLineLayer(taskid, typeid, geojson, line_width, color, hovercolor, selcolor,options) {
    var layer_id = "line-" + taskid + "-" + typeid;
    if (!task_line_layers_json[layer_id]) {

        task_line_layers_json[layer_id] = {
            "taskid": taskid,
            "typeid": typeid,
            "geojson": geojson,
            "line_width": line_width,
            "color": color,
            "hovercolor": hovercolor,
            "selcolor": selcolor,
            "is_add_to_map": false
        };
        //
        //debug("layer_id=" + layer_id);
        showLineLayer(taskid, typeid,options);
        //
        layer_ids.push(layer_id);
    }
}

function removeLineLayer() {
	var layers = [
		"layer_way", "layer_label"
	]
	for(let i=0; i<layers.length; i++){
		let layer_id = layers[i];
		if (task_line_layers_json[layer_id]) {
			let mesh_group = task_line_layers_json[layer_id];
			window.scene.remove(mesh_group);
			task_line_layers_json[layer_id]=null;
		}
	}
}

function selectLine(taskid, typeid, _id) {
    var layer_id = "line-" + taskid + "-" + typeid;
    if (task_line_layers_json[layer_id]) {
        var id_meshs = task_line_layers_mesh[layer_id]["id_meshs"];
        if (id_meshs) {
            if (id_meshs[_id]) {
                id_meshs[_id].material.color.setHex(0xff0000);
            }
        }
    }
}
function togglePointLayer(taskid, typeid, _show){
    var layer_id = "point-" + taskid + "-" + typeid;
    if (task_point_layers_json[layer_id]) {
        //var mesh_group = task_point_layers_mesh[layer_id]["mesh"];
        var mesh_point_group = task_point_layers_mesh[layer_id]["mesh_point"];
        //
        // if (mesh_group) {
        //     if (_show) {
        //         mesh_group.visible = true;
        //     } else {
        //         mesh_group.visible = false;
        //     }
        // }
        if (mesh_point_group) {
            if (_show) {
                mesh_point_group.visible = true;
            } else {
                mesh_point_group.visible = false;
            }
        }
    }
}

function toggleLineLayer(layer_id) {
	for(let id in task_line_layers_json){
		task_line_layers_json[id].visible = false;
	}
	if(layer_id && task_line_layers_json[layer_id]){
		task_line_layers_json[layer_id].visible = true;
	}
}

function updateLineLayer(taskid, typeid,options){
    if(options['show_'+typeid]&&options['show_'+typeid]==true) {
        //从引擎中移除
        removeLineLayer(taskid, typeid);
        //根据新的坐标原点重新构建，这样尽量避免浮点数精度损失，受限于WebGL引擎的单精度坐标转换后的精度损失问题
        showLineLayer(taskid, typeid, options);
    }
}

function showPointLayer(taskid, typeid,options){
    var layer_id = "point-" + taskid + "-" + typeid;
    if (task_point_layers_json[layer_id]) {
        //确保不会重复添加
        if (task_point_layers_mesh[layer_id] && task_point_layers_mesh[layer_id]["mesh"]) {
            togglePointLayer(taskid, typeid, true);
            return;
        }
        //
        task_point_layers_mesh[layer_id] = {};
        //
        var mesh_point_group = new THREE.Group();
        //
        task_point_layers_mesh[layer_id]["mesh_point"] = mesh_point_group;
        var geo_json = task_point_layers_json[layer_id]["geojson"];
        var line_width=task_point_layers_json[layer_id]["line_width"];
        var line_color=task_point_layers_json[layer_id]["color"];
        if(line_width==undefined){
            line_width=0.04;
        }
        if(line_color==undefined){
            line_color="#0000FF";
        }
        //
        var points_positions = [];
        var colors = [];
        //
        if (geo_json.type == 'Feature') {
            let geom = geo_json.geometry;
        } else if (geo_json.type == 'FeatureCollection') {
            //
            var feature_nums = geo_json.features.length;
            for (var i = 0; i < feature_nums; i++) {
                //
                var feature = geo_json.features[i];
                //
                var props = feature.properties;
                let geom = feature.geometry;
                //var type = props[""];
                //
                //debug("feature="+JSON.stringify(feature));
                //
                if (geom.type == 'Point') {
                    //
                    //
                    points_positions.push(geom.coordinates[0]);
                    points_positions.push(geom.coordinates[1]);
                    points_positions.push(geom.coordinates[2]);
                    //
                    colors.push(0.0, 1.0, 0.0);

                    //
                    //id_meshs[props['id']] = mesh;
                }
            }
            //形点
            var points_geometry = new THREE.BufferGeometry();
            //
            points_geometry.addAttribute('position', new THREE.Float32BufferAttribute(points_positions, 3));
            points_geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            //
            var point_material = new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors,
                size: 3,
                sizeAttenuation: false
            });
            var point_mesh = new THREE.Points(points_geometry, point_material);
            mesh_point_group.add(point_mesh);
            //
        } else if (geo_json.type == 'GeometryCollection') {
            //
        } else {
            throw new Error('The geoJSON is not valid.');
        }
        //
        scene.add(mesh_point_group);
        //
        mesh_point_group.visible = true;
        //debug(JSON.stringify(options));
    }
}
/**
 *
 * 添加到ThreeJS之中
 */


function makeTextSprite(center, text){
	var borderThickness = 10;
	var fontsize = 50;
	var backgroundColor = {
		'r': '255',
		'g': '255',
		'b': '255',
		'a': '1'
	}
	var borderColor = {
		'r': '255',
		'g': '255',
		'b': '255',
		'a': '1'
	}
	
    // var canvas_1 = $('#canvas_three canvas')[0];
    var canvas_1 = document.createElement('canvas');
    var context = canvas_1.getContext('2d');
    var metrics = context.measureText( text );
    var textWidth = metrics.width;
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
        + borderColor.b + "," + borderColor.a + ")";
    context.lineWidth = borderThickness;
    context.fillStyle = '#EC3A4E';
    context.font = "Bold " + fontsize + "px Microsoft YaHei";
    context.fillText( text, borderThickness, fontsize + borderThickness);
	 
    var texture = new THREE.Texture(canvas_1);
    texture.needsUpdate = true;
 
    var spriteMaterial = new THREE.SpriteMaterial({
		map: texture,
		// fog: false,
		// transparent: true,
		// opacity: 1,
		// sizeAnnutation: false,
		// useScreenCoordinates: false,
	});
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5, 0.5, 0.5);
	sprite.position.copy( new THREE.Vector3(center.x, center.y, center.z) );
    return sprite;
}

/* 加载视频界面的反投信息 */
var chunkWayList = [];
function showLineLayer(waylist) {
	
	//确保不会重复添加
	if (task_line_layers_json['layer_way'] || task_line_layers_json["layer_label"]) {
		removeLineLayer();
	}
	if (waylist.type != 'FeatureCollection') {
		return;
	}
	var features = waylist.features,
		chunkFeatures = [features];
		// chunkFeatures = _.chunk(features, 500);
	
	var status = $('.disease_info').css('display'),
		statusType = (status == 'block') ? true : false;
	statusType && loadThreeLayers(features);
	
	// chunkFeatures.forEach( result => {
		
		
	// 	statusType && loadThreeLayers(result).then((data) => {
	// 		console.log('反投数据加载完成')
	// 	})
	// } )
	
	
}

/* promise循环添加反投要素 */
function loadThreeLayers(features){

	// return new Promise(function (resolve, reject) {
	
	// 	console.time("Runoob")
		
        var mesh_group = new THREE.Group();
        var mesh_label_group = new THREE.Group();
		var line_width = 0.1;
		
        task_line_layers_json["layer_way"] = mesh_group;
        task_line_layers_json["layer_label"] = mesh_label_group;
        
        // if (waylist.type == 'FeatureCollection') {
            //
            var feature_nums = features.length;
            // var feature_nums = 2000;
            for (var i = 0; i < feature_nums; i++) {
				
				var line_color = '#EC3A4E';
				var points_positions = [];
                var feature = features[i];
                var props = feature.properties;
				var range_type = props.range_type;
				var center = props.center_xy;
                var geom = props.locs_utm;
				
				var center_utm = LLtoUTM(center[0], center[1]);
				var center_label = {
					'x': (center_utm.x - window.C_0[0]),
					'y': (center_utm.y - window.C_0[1]),
					'z': (center[2] - window.C_0[2])
				};
				
				let textMesh = makeTextSprite(center_label, props._cn_type);
				mesh_label_group.add(textMesh);
				
				var old_coordinates = geom;
				var coord_nums = old_coordinates.length;
				var coordinates=[];
				//更新坐标
				if(window.C_0 && window.C_0 instanceof Array) {
					for (var j = 0; j < coord_nums; j++) {
						coordinates[j]=[];
						//
						coordinates[j][0] = old_coordinates[j][0] - window.C_0[0];
						coordinates[j][1] = old_coordinates[j][1] - window.C_0[1];
						coordinates[j][2] = old_coordinates[j][2] - window.C_0[2];
					}
				}else{
					coordinates=old_coordinates;
				}
				var positions = [];
				createThickLineObject(positions, coordinates, line_width);
				for (var j = 0; j < coord_nums; j++) {
					points_positions.push(coordinates[j][0]);
					points_positions.push(coordinates[j][1]);
					points_positions.push(coordinates[j][2]);
				}
				
				var color = new THREE.Color(236, 58, 78);
				var colors = [];
				colors.push( color.r, color.g, color.b );
				
				var mesh = null;
				if(range_type == 'Point'){
					
					var sphereGeometry = new THREE.SphereGeometry(0.1, 20, 20);
					var sphereMaterial = new THREE.MeshLambertMaterial({
						color: 0xEC3A4E
					});
					var mesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
					mesh.position.set(points_positions[0], points_positions[1], points_positions[2]);
					mesh.castShadow = false;
					
				}else if(range_type == 'Polygon'){
					let this_color = 0xEC3A4E;
					if(props.TYPE == '11'){
						this_color = 0x979797;
						line_color = '#979797';
					}
					
					var line_geometry = new THREE.BufferGeometry();
					line_geometry.addAttribute('position', new THREE.Float32BufferAttribute(points_positions, 3));
					line_geometry.addAttribute('color', new THREE.Float32BufferAttribute(line_color, 3));
					var material = new THREE.LineBasicMaterial({
						color: this_color,
						linewidth: 1
					});
					
					mesh = new THREE.Line(line_geometry, material);
				}else if(range_type == 'Polyline'){
					var line_geometry = new THREE.BufferGeometry();
					line_geometry.addAttribute('position', new THREE.Float32BufferAttribute(points_positions, 3));
					line_geometry.addAttribute('color', new THREE.Float32BufferAttribute(line_color, 3));
					var material = new THREE.LineBasicMaterial({
						color: 0xEC3A4E,
						linewidth: 1
					});
					mesh = new THREE.Line(line_geometry, material);
					
				}
				mesh.userData = feature;
				mesh_group.add(mesh);
            }
        // }
		
		scene.add(mesh_group);
		scene.add(mesh_label_group);
		mesh_group.visible = true;
		mesh_label_group.visible = false;
		
		console.log('反投数据加载完成')
		
	// 	console.timeEnd("Runoob")
	// 	resolve();
	// });
}

function animate() {
	//
	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.clear();
	renderer.render(window.backgroundScene, window.backgroundCamera);
	renderer.render(window.scene, window.camera);
}
