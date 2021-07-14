iD.Connection = function (context) {


    var event = d3.dispatch('authenticating', 'modelEntityLoaded', 'authenticated', 'auth', 'loading', 'load', 'loaded'),
        url = 'http://www.kd.com',
        connection = {},
        inflight = {}, // 要素保存xhr
        inflightTag = {}, // tag保存xhr
        modelEntityCache = {},
        // layerObjCache = {},
        loadedModelEntityFlag = false,
        loadedLayerFlag = false,
        loadedSubModelEntityFlag = false,
        loadedTiles = {},
        tileZoom = 15,
        oauth = osmAuth({
            url: 'http://www.kd.com',
            oauth_consumer_key: '5A043yRSEugj4DJ5TljuapfnrflWDte8jTOcWLlT',
            oauth_secret: 'aB3jKq1TRsCOUrfOIZ6oQMEDmv2ptV76PA54NGLL',
            loading: authenticating,
            done: authenticated
        }),
        ndStr = 'nd',
        tagStr = 'tag',
        memberStr = 'member',
        nodeStr = 'node',
        wayStr = 'way',
        relationStr = 'relation',
        delimiter = "_",
        off;
    connection.oauth = oauth;
    var connectionType = true;
    //事务ID
    var transId;

    //模型属性数据初始化
    iD.data.initModelEntityTags = {};

    context.MeshDataStore = {
        all: [],
        node: [],
        way: [],
        newWay: [],
        setWayMeshId: function setWayMeshId(xWay, graph) {
            //获取图幅信息对象
            var meshStore = this;
            var firstId = xWay.first(),
                lastId = xWay.last(),
                first = graph.entity(firstId),
                last = graph.entity(lastId),
                firstLoc = first.loc,
                lastLoc = last.loc;

            var pXY = {
                lng: '',
                lat: ''
            };
            if (xWay.nodes.length == 2) {
                var tempXY = iD.geo.interp(firstLoc, lastLoc, 0.5); //获取线段的中间接点
                pXY.lng = tempXY[0];
                pXY.lat = tempXY[1];
            } else {
                var tempEntityId = xWay.nodes[1];
                var tempLoc = graph.entity(tempEntityId).loc;
                pXY.lng = tempLoc[0];
                pXY.lat = tempLoc[1];
            }

            //循环所有图幅，校验线段上的点是否在图幅内
            var meshs = meshStore.way;
            for (var i = 0; i < meshs.length; i++) {
                var mesh = meshs[i];
                var mNodes = mesh.nodes;

                //图幅点ID
                var p1 = mNodes[0];
                var p2 = mNodes[1];
                var p3 = mNodes[2];
                var p4 = mNodes[3];

                //点对象
                var pp1 = graph.entity(p1);
                var pp2 = graph.entity(p2);
                var pp3 = graph.entity(p3);
                var pp4 = graph.entity(p4);

                //获取最大坐标和最小坐标
                var ppMinX = Math.min(pp1.loc[0], pp2.loc[0], pp3.loc[0], pp4.loc[0]);
                var ppMaxX = Math.max(pp1.loc[0], pp2.loc[0], pp3.loc[0], pp4.loc[0]);
                var ppMinY = Math.min(pp1.loc[1], pp2.loc[1], pp3.loc[1], pp4.loc[1]);
                var ppMaxY = Math.max(pp1.loc[1], pp2.loc[1], pp3.loc[1], pp4.loc[1]);

                //图幅矩形 西南脚点、东北脚点
                var meshcoord = [
                    [ppMinX, ppMinY],
                    [ppMaxX, ppMaxY]
                ];

                //校验线是否在图幅矩形内
                var r = iD.util.lassExtend.isPointInRect(pXY, meshcoord);

                //线段上的点在图幅内
                if (r) {
                    //设置线的图幅编号
                    xWay = xWay.mergeTags({
                        mesh: mesh.tags.mesh_
                    });
                    graph = graph.replace(xWay);
                    //设置点线上所有点的图幅编号
                    _.uniq(xWay.nodes).forEach(function (id, i) {
                        var xNode = graph.entity(id);
                        //设置线的图幅编号
                        xNode = xNode.mergeTags({
                            mesh: mesh.tags.mesh_
                        });
                        graph = graph.replace(xNode);
                    });
                    break;
                }
            }
            return graph;
        },
        //根据ID，获取图幅上的一个点
        getNode: function (id) {
            var nodes = this.node,
                r = null;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.id == id) {
                    r = node;
                    break;
                }
            }
            return r;
        },
        //根据ID，获取指定图幅
        getWay: function (id) {
            var ways = this.way,
                r = null;
            for (var i = 0; i < ways.length; i++) {
                var way = ways[i];
                if (way.id == id) {
                    r = way;
                    break;
                }
            }
            return r;
        },
        getRectCoords: function () {
            var _way = this.way;
            var _node = this.node;
            var r = [];
            var lines = [];
            //循环所有图幅矩形
            for (var i = 0; i < _way.length; i++) {
                var wNodes = _way[i].nodes;
                var rectCoord = [];
                //获取矩形的四个点坐标
                for (var j = 0; j < wNodes.length; j++) {
                    for (var n = 0; n < _node.length; n++) {
                        if (_node[n].id == wNodes[j]) {
                            rectCoord.push(_node[n].loc);
                        }
                    }
                }
                //存一个矩形的坐标
                r.push(rectCoord);
            }

            //获取边线并去重
            for (var m = 0; m < r.length; m++) {
                var xRectCoord = r[m];
                //图幅的矩形四个点
                var p1 = xRectCoord[0];
                var p2 = xRectCoord[1];
                var p3 = xRectCoord[2];
                var p4 = xRectCoord[3];

                //图幅边线
                var line1 = p1.concat(p2);
                var line2 = p2.concat(p3);
                var line3 = p3.concat(p4);
                var line4 = p4.concat(p1);
                var allLines = [line1, line2, line3, line4];
                //添加边线并去重
                for (var f = 0; f < allLines.length; f++) {
                    var hasLine = false;
                    var xline = allLines[f];
                    for (var k = 0; k < lines.length; k++) {
                        var tl = lines[k].join("#");
                        var ll = xline.join("#");
                        if (tl == ll) {
                            hasLine = true;
                            break;
                        }
                    }
                    if (!hasLine) {
                        lines.push(xline);
                    }
                }
            }
            //对线进一步去重
            for (var k = 0; k < lines.length; k++) {
                var kLine = lines[k].join("+");
                for (var h = 0; h < lines.length; h++) {
                    if (k == h) continue;
                    var hLine = lines[h].join("+");
                    if (eval(kLine) == eval(hLine)) {
                        //删除重复线
                        lines.splice(h, 1);
                    }
                }
            }
            return lines;
        }
    };
    connection.loadFromURL = function (url, callback, layer, opts = {}) {
        var isQueryUrl = !layer.isBbox;
        var options = layer ? {
            layerId: layer.id,
            layer: layer,
            isGeoJson: layer && layer.isGeoJson || opts.isGeoJson || false,
            isQueryUrl: isQueryUrl
        } : {};


        function done(dom) {
            let parseResult = [],
                xhrOptions = this.options || {};
            if (xhrOptions.isGeoJson) {
                parseResult = parseGeoJson(dom, xhrOptions);
            } else if (xhrOptions.isQueryUrl) {
                parseResult = parseQueryJson(dom, xhrOptions);
            } else if (options.isGeoJson) {
                parseResult = parseGeoJson(dom, xhrOptions);
            } else {
                parseResult = parseJson(dom, xhrOptions);
            }
            return callback(null, parseResult, xhrOptions.layer);
        }

        function errorFun() {
            return callback(null, [], this.options && this.options.layer);
        }
        var d3xml = d3.json(url);
        d3xml.options = options;

        if (opts.type == 'post' || opts.bodyParam) {
            if (_.isObject(opts.bodyParam)) {
                d3xml
                    .header("Content-Type", "application/json;charset=UTF-8")
                    .post(JSON.stringify(opts.bodyParam)).on('load', done);
                return;
            }
            return d3xml.post().on('load', done).on('error', errorFun);
        }
        return d3xml.get().on('load', done).on('error', errorFun);

    };

    function layerFilterByModel(layer, modelName) {
        if (!modelName) return true;
        if (layer && layer.loadFilterByModel && layer.models && !layer.models[modelName]) {
            return false;
        }
        return true;
    }

    /**
     * 解析数据；---parseJson
     * @param {Object} dom
     * @param {Object} options
     */
    function parseQueryJson(dom, options) {
        var entities = [];
        var modelEntity;
        let rootResult = dom.result || {};
        let layer = options.layer;
        let layerid = options.layerId;

        let synodeRoadNodeRelations = [];
        let roadNodeList = {},
            roadCrossList = {};
        for (var key in rootResult) {
            var _parser = parsersJ[key];
            if (_parser) {
                var entityArr = rootResult[key]; //返回当前图层未被解析的数据数组
                entityArr.forEach(function (entity) {
                    if (!layerFilterByModel(layer, entity.modelName)) {
                        return;
                    }
                    modelEntity = iD.ModelEntitys[entity.modelName];
                    // let identifier = !_.isEmpty(layer) ? layer.identifier: "";
                    et = _parser(entity, layer);
                    if (!layerid) {
                        if (!modelEntity) {
                            // layerid = context.layers().getCurrentEnableLayer().id;
                            layerid = entity.layerId;
                        } else {
                            layerid = modelEntity.layerId();
                        }
                    }
                    et.layerId = layerid;
                    entities.push(et);

                    if (et.modelName == iD.data.DataType.R_C_NODE_ROAD_NODE) {
                        synodeRoadNodeRelations.push(et);
                    } else if (et.modelName == iD.data.DataType.ROAD_NODE) {
                        roadNodeList[et.id] = et;
                    } else if (et.modelName == iD.data.DataType.C_NODE) {
                        roadCrossList[et.id] = et;
                    }
                })
            }
        }

        // 根据relation生成综合交叉点的roadcrossline
        for (let idx in synodeRoadNodeRelations) {
            let rel = synodeRoadNodeRelations[idx];
            let roadnodes = [],
                roadcrossNode;
            (rel.members || []).forEach(function (m) {
                if (m.modelName == iD.data.Constant.C_NODE) {
                    roadcrossNode = roadCrossList[m.id];
                } else if (m.modelName == iD.data.DataType.ROAD_NODE) {
                    roadNodeList[m.id] && roadnodes.push(roadNodeList[m.id]);
                }
            });
            if (!roadcrossNode || !roadnodes.length) {
                continue;
            }

            roadnodes.forEach(function (roadnode) {
                entities.push(parseJsonRoadCrossLine(roadcrossNode, roadnode));
            });
        }

        return entities;
    }


    //---------------------------------华丽的json数据解析分割线开始--------------------------------------------------------
    //进行json数据的解析
    function parseJson(dom, options) {

        var rootArr = dom.layer;
        if (!(rootArr instanceof Array)) {
            rootArr = [rootArr];
        }
        if (rootArr.length == 0) {
            return [];
        }
        var entities = [];
        var modelEntity;
        var layer = options.layer;

        var i, et, l;
        for (i = 0, l = rootArr.length; i < l; i++) { //遍历每个子图层

            var child = rootArr[i];
            for (var nodeName in child) {
                var modelInfo = child[nodeName];
                let synodeRoadNodeRelations = [];
                let roadNodeList = {},
                    roadCrossList = {};

                for (var key in modelInfo) {
                    var _parser = parsersJ[key];
                    if (_parser) {
                        var entityArr = modelInfo[key]; //返回当前图层未被解析的数据数组
                        for (let i = 0; i < entityArr.length; i++) {
                            var entity = entityArr[i];
                            if (!layerFilterByModel(options && options.layer, entity.modelName)) {
                                continue;
                            }
                            modelEntity = iD.ModelEntitys[entity.modelName];
                            let layerid = !_.isEmpty(options) ? options.layerId : "";
                            et = _parser(entity, layer);
                            if (!layerid) {
                                if (!modelEntity) {
                                    // layerid = context.layers().getCurrentEnableLayer().id;
                                    layerid = entity.layerId;
                                } else {
                                    layerid = modelEntity.layerId();
                                }
                            }
                            et.layerId = layerid;
                            entities.push(et);

                            if (et.modelName == iD.data.DataType.R_C_NODE_ROAD_NODE) {
                                synodeRoadNodeRelations.push(et);
                            } else if (et.modelName == iD.data.DataType.ROAD_NODE) {
                                roadNodeList[et.id] = et;
                            } else if (et.modelName == iD.data.DataType.C_NODE) {
                                roadCrossList[et.id] = et;
                            }
                        }
                    }
                }

                // 根据relation生成综合交叉点的roadcrossline
                for (let idx in synodeRoadNodeRelations) {
                    let rel = synodeRoadNodeRelations[idx];
                    let roadnodes = [],
                        roadcrossNode;
                    (rel.members || []).forEach(function (m) {
                        if (m.modelName == iD.data.Constant.C_NODE) {
                            roadcrossNode = roadCrossList[m.id];
                        } else if (m.modelName == iD.data.DataType.ROAD_NODE) {
                            roadNodeList[m.id] && roadnodes.push(roadNodeList[m.id]);
                        }
                    });
                    if (!roadcrossNode || !roadnodes.length) {
                        continue;
                    }

                    roadnodes.forEach(function (roadnode) {
                        entities.push(parseJsonRoadCrossLine(roadcrossNode, roadnode));
                    });
                }
            }
        }
        return entities;
    }
    //进行geojson数据的解析
    function parseGeoJson(dom, options) {
        var rootArr = dom.result || dom.features || [];
        if (rootArr.length == 0) {
            return [];
        }
        var layer = options.layer;
        var geoModelName = iD.data.DataType.DEFAULT;
        if (layer && layer.models) {
            let m = _.keys(layer.models)[0];
            geoModelName = m || geoModelName;
        }

        var entities = [];
        var geoType = {
            'Point': 'node',
            'LineString': 'way',
            'Polygon': 'way'
        };
        var modelInfo = {
            node: [],
            way: []
        };

        rootArr.forEach(function (d) {
            let geotype = d.geometry.type;
            let coord = d.geometry.coordinates;
            let type = geoType[geotype];
            // geojson_id ++;
            let obj = {
                // id: d.id || (++ geojson_id),
                modelName: geoModelName,
                lon: coord[0],
                lat: coord[1],
                z: coord[2],
                tag: [],
                version: 1
            };
            let did;
            for (let k in d.properties) {
                obj.tag.push({
                    k: k,
                    v: d.properties[k] == null ? '' : d.properties[k]
                });
                if (!did && (k == 'ID' || k == 'SEQ_ID')) {
                    did = obj.tag[obj.tag.length - 1].v;
                }
            }
            if (did) {
                obj.id = did;
            }
            modelInfo[type].push(obj);
        });

        var et;
        for (var key in modelInfo) {
            var _parser = parsersGeoJson[key];
            if (_parser) {
                var entityArr = modelInfo[key]; //返回当前图层未被解析的数据数组
                for (let i = 0; i < entityArr.length; i++) {
                    var entity = entityArr[i];
                    if (!layerFilterByModel(layer, entity.modelName)) {
                        continue;
                    }
                    let layerid = !_.isEmpty(options) ? options.layerId : "";
                    et = _parser(entity, layer);
                    et.layerId = layerid;

                    entities.push(et);
                }
            }
        }

        return entities;
    }

    /**
     * 生成roadcrossline，逻辑与iD.actions.RoadCrossAdd中一致
     * @param {Object} synode
     * @param {Object} roadnode
     */
    function parseJsonRoadCrossLine(synode, roadnode) {
        var aid = iD.Entity.id.toOSM(synode.id),
            bid = iD.Entity.id.toOSM(roadnode.id),
            newId = iD.Entity.id.fromOSM('way', aid + bid, synode.layerId);
        return new iD.Way({
            id: newId,
            nodes: [synode.id, roadnode.id],
            _type: 'roadcrossline',
            tags: {},
            layerId: synode.layerId
        });
    }

    var parsersGeoJson = {
        node: function nodeData(obj, layer) {
            return new iD.Node({
                id: obj.id != null ? iD.Entity.id.fromOSM(nodeStr, obj.id, layer.identifier) : null,
                loc: [parseFloat(obj.lon), parseFloat(obj.lat), parseFloat(obj.z)],
                version: obj.version,
                modelName: obj.modelName,
                tags: getTagsByJson(obj, obj.modelName, 'node')
            });
        },

        way: function wayData(obj, layer) {
            return new iD.Way({
                id: obj.id != null ? iD.Entity.id.fromOSM(wayStr, obj.id, layer.identifier) : null,
                version: obj.version,
                modelName: obj.modelName,
                tags: getTagsByJson(obj, obj.modelName, 'way'),
                nodes: getNodesByJson(obj, layerid)
            });
        }
    };

    var parsersJ = {
        node: function nodeData(obj, layer, minLayerId) {
            return new iD.Node({
                id: iD.Entity.id.fromOSM(nodeStr, obj.id, layer.identifier),
                loc: [parseFloat(obj.lon), parseFloat(obj.lat), parseFloat(obj.z)],
                version: obj.version,
                modelName: obj.modelName,
                tags: getTagsByJson(obj, obj.modelName, 'node')
            });
        },

        way: function wayData(obj, layer, minLayerId) {
            return new iD.Way({
                id: iD.Entity.id.fromOSM(wayStr, obj.id, layer.identifier),
                version: obj.version,
                // user: obj.user,
                modelName: obj.modelName,
                tags: getTagsByJson(obj, obj.modelName, 'way'),
                nodes: getNodesByJson(obj, layer.identifier)
            });
        },

        relation: function relationData(obj, layer, minLayerId) {
            return new iD.Relation({
                id: iD.Entity.id.fromOSM(relationStr, obj.id, layer.identifier),
                version: obj.version,
                // user: obj.user,
                modelName: obj.modelName,
                tags: getTagsByJson(obj, obj.modelName, 'relation'),
                members: getMembersByJson(obj, layer)
            });
        }
    };


    function JSONByTag(entity) {
        var tagsArr = entity.tag,
            tags = {};
        if (tagsArr && tagsArr.length > 0) {
            tagsArr.forEach(function (eachTag) {
                tags[eachTag.k] = (eachTag.v ? eachTag.v : "");
            })
        }
        return tags;
    }

    function createDefaultTags(modelName) {
        function Tag(tag) {
            for (var p in tag) {
                this[p] = tag[p];
            }
        }
        let modelEntity = iD.ModelEntitys[modelName]
        if (modelEntity) {
            var gtype = modelEntity.getGeoType();
            modelEntity.getFields(gtype).filter(function (d) {
                Tag.prototype[d.fieldName] = d.defaultValue;
            });
        }
        return Tag;
    }

    function getTagsByJson(entity, modelName, clsType) {
        var tags = JSONByTag(entity);

        var _tags;
        var tagsFun = iD.data.initModelEntityTags[modelName + "_" + clsType];
        if (!tagsFun) {
            // tagsFun=createDefaultTags(layerId,modelName,clsType);
            tagsFun = createDefaultTags(modelName);
            iD.data.initModelEntityTags[modelName + "_" + clsType] = tagsFun;
        }
        _tags = new tagsFun(tags);
        if (_tags.geojson && typeof _tags.geojson === 'string') {
            _tags.geojson = JSON.parse(_tags.geojson);
        }
        // _modelName = type;
        return _tags;
    }

    function getNodesByJson(entity, layerid) {
        var ndArr = entity.nd,
            nodes = [];
        ndArr.forEach(function (eachNd) {
            var ndName = iD.Entity.id.fromOSM(nodeStr, eachNd.ref, layerid)
            nodes.push(ndName);
        })
        return nodes;
    }

    function getMembersByJson(entity, layer, modelEntity) {

        var elemsArr = entity.member, //json数据中对应的member字段
            members = new Array(elemsArr.length),
            key;

        elemsArr && elemsArr.sort(function (m1, m2) {
            return m1.sequence - m2.sequence;
        });

        for (var i = 0, l = elemsArr.length; i < l; i++) {

            var attrs = elemsArr[i];

            key = (attrs.type === iD.data.GeomType.NODE) ? 'n' : ((attrs.type === iD.data.GeomType.RELATION) ? 'r' : 'w');
            let memberid = key + layer.identifier + '_' + attrs.ref;
            members[i] = {
                id: memberid,
                modelName: attrs.modelName,
                type: attrs.type,
                role: attrs.role
            };
        }

        var sublayer = entity.modelName; //调整 线点线顺序
        if (sublayer === iD.data.DataType.NODECONN || sublayer === iD.data.DataType.C_NODECONN) {
            var mbers = new Array(elemsArr.length);
            for (var i = 0, l = members.length; i < l; i++) {
                if (members[i].role.indexOf('FROAD') !== -1) mbers[0] = members[i];
                else if (members[i].role.indexOf('TROAD') !== -1) mbers[2] = members[i];
                else mbers[1] = members[i];
            }
            return mbers;
        }

        return members;
    }


    //-------------------------------------------------------低调的json数据解析分割线结束----------------------------------------------------------------


    connection.searchPoiURL = function (url, opt, callback) {
        var param = '&sid=1000&encode=utf-8&resType=json&batch=' + opt.pageIndex +
            '&number=' + opt.pageSize +
            '&keyword=' + encodeURIComponent(opt.keyword);

        var rid = Math.round(Math.random() * 100000);
        url += param + "&rid=" + rid;

        //解决跨域问题
        var script;
        window.MMap = {
            MAjaxResult: []
        };

        function done() {
            var data = MMap.MAjaxResult[rid];
            callback.call(this, data);
            delete MMap.MAjaxResult[rid];
            script.remove();
        }

        script = d3.select('head')
            .append('script')
            .attr('type', 'text/javascript')
            .attr('src', url).on('load', done);
    };

    //获取单条实体对象
    connection.loadEntity = function (id, layerInfo, callback) {
        var osmID = iD.Entity.id.toOSM(id);

        var url = layerInfo.url + '/data/query/get?sid=2100&layerId=' + layerInfo.id + '&id=' + osmID + '&filter=and id=' + osmID;

        d3.xml(url, function done(err, xml) {
            var result = parseSearchResultEntity(xml, layerInfo);
            event.load(err, {
                data: result.entities
            });
            if (callback) callback(err, result.entities && _.find(result.entities, function (e) {
                return e.id === id;
            }));
        });
    };

    function authenticating() {
        event.authenticating();
    }

    function authenticated() {
        event.authenticated();
    }

    function getNodes(obj, _) {
        var elems = obj.getElementsByTagName(ndStr),
            nodes = new Array(elems.length),
            _ndStr = ndStr[0],
            key;
        for (var i = 0, l = elems.length; i < l; i++) {
            key = _ndStr;
            _ && (key = _ndStr + _ + delimiter);
            nodes[i] = key + elems[i].attributes.ref.value;
            //nodes[i] = 'n' + elems[i].attributes.ref.value;
        }
        return nodes;
    }

    function getTags(obj) {
        var elems = obj.getElementsByTagName(tagStr),
            tags = {};
        for (var i = 0, l = elems.length; i < l; i++) {
            var attrs = elems[i].attributes;
            tags[attrs.k.value] = (attrs.v ? attrs.v.value : "");
        }
        return tags;
    }

    function getMembers(obj, _) {
        var elems = obj.getElementsByTagName(memberStr),
            members = new Array(elems.length),
            key;

        var layerInfo = iD.Layers.getLayer(_);



        var datatype = getTags(obj)['datatype'];
        var memberModes;
        if (layerInfo && layerInfo.isRoad() && datatype) {
            memberModes = layerInfo.getSubLayerByType(datatype).members
        }
        for (var i = 0, l = elems.length; i < l; i++) {

            var attrs = elems[i].attributes;
            var subLayerId = _;
            if (memberModes) {

                memberModes.forEach(function (memberMode) {
                    if (memberMode.type == attrs.type.value && attrs.type.value != iD.data.Constant.ROADNODE) {
                        subLayerId = memberMode.id;
                    }
                })
            }

            key = (attrs.role.value[0] === 'n' || attrs.type.value === 'RoadNode') ? 'n' : ((attrs.type.value === 'CrossMaat' || attrs.type.value === 'NodeMaat') ? 'r' : 'w');
            subLayerId && (key += subLayerId + delimiter);
            members[i] = {
                id: key + attrs.ref.value,
                type: attrs.type.value,
                role: attrs.role.value
            };
        }

        var sublayer = obj.parentNode.attributes.type.value; //调整 线点线顺序

        if (sublayer === iD.data.DataType.NODECONN || sublayer === iD.data.DataType.C_NODECONN) {
            var mbers = new Array(elems.length);
            for (var i = 0, l = members.length; i < l; i++) {
                if (members[i].role.indexOf('FROAD') !== -1) mbers[0] = members[i];
                else if (members[i].role.indexOf('TROAD') !== -1) mbers[2] = members[i];
                else mbers[1] = members[i];
            }
            return mbers;
        }

        return members;
    }

    var parsers = {
        node: function nodeData(obj, _, parentLayerId) {
            var attrs = obj.attributes;
            return new iD.Node({
                id: iD.Entity.id.fromOSM(nodeStr, attrs.id.value, _),
                loc: [parseFloat(attrs.lon.value), parseFloat(attrs.lat.value)],
                version: attrs.version && attrs.version.value,
                user: attrs.user && attrs.user.value,
                tags: getTags(obj)
            });
        },

        way: function wayData(obj, _, parentLayerId) {
            var attrs = obj.attributes;
            return new iD.Way({
                id: iD.Entity.id.fromOSM(wayStr, attrs.id.value, _),
                version: attrs.version && attrs.version.value,
                user: attrs.user && attrs.user.value,
                tags: getTags(obj),
                nodes: getNodes(obj, _)
            });
        },

        relation: function relationData(obj, _, parentLayerId) {
            var attrs = obj.attributes;
            return new iD.Relation({
                id: iD.Entity.id.fromOSM(relationStr, attrs.id.value, _),
                version: attrs.version && attrs.version.value,
                user: attrs.user && attrs.user.value,
                tags: getTags(obj),
                members: getMembers(obj, parentLayerId)
            });
        }
    };

    /**
     * 分析查询结果XML
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    function parseSearchResultEntity(dom, layerInfo) {
        if (!dom || !dom.childNodes) return new Error('Bad request');

        var root = dom.childNodes[0],
            children = root.childNodes,
            result = {
                entities: []
            };
        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i],
                parser = parsers[child.nodeName];
            if (parser) {
                var entity = parser(child, layerInfo.id);
                entity.layerId = layerInfo.id;
                result.entities.push(entity);
            }
            if (child.nodeName === 'page') {
                var attrs = child.attributes;
                result.pages = attrs.pages && attrs.pages.value;
                result.pageIndex = attrs.currentpage && attrs.currentpage.value;
                result.pageSize = attrs.pagesize && attrs.pagesize.value;
                result.count = attrs.count && attrs.count.value;
            }
        }
        return result;
    }

    connection.authenticated = function () {
        return oauth.authenticated();
    };

    // Generate Changeset XML. Returns a string.
    connection.changesetJXON = function (tags) {
        return {
            osm: {
                changeset: {
                    tag: _.map(tags, function (value, key) {
                        return {
                            '@k': key,
                            '@v': value
                        };
                    }),
                    '@version': 2.0,
                    '@generator': 'KD'
                }
            }
        };
    };

    // Generate [osmChange](http://wiki.openstreetmap.org/wiki/OsmChange)
    // XML. Returns a string.
    connection.osmChangeJXON = function (changeset_id, changes) {
        function nest(x, order) {
            var groups = {};
            for (var i = 0; i < x.length; i++) {
                var tagName = Object.keys(x[i])[0];
                if (!groups[tagName]) groups[tagName] = [];
                groups[tagName].push(x[i][tagName]);
            }
            var ordered = {};
            order.forEach(function (o) {
                if (groups[o]) ordered[o] = groups[o];
            });
            return ordered;
        }

        var OSMString = ['created', 'modified', 'deleted'];

        function rep(entity, i) {
            return entity.asJXON(changeset_id, context, OSMString[i]);
        }

        // wkt数据转换
        var created = changes.created.map(function (entity) {
            return rep(entity, 0);
        });
        var modified = changes.modified.map(function (entity) {
            return rep(entity, 1);
        });
        var deleted = changes.deleted.map(function (entity) {
            return rep(entity, 2);
        });

        return {
            osmChange: {
                '@version': 2.0,
                '@generator': 'KD',
                'create': nest(created, ['node', 'way', 'relation']),
                'modify': nest(modified, ['node', 'way', 'relation']),
                'delete': _.extend(nest(deleted, ['relation', 'way', 'node']), {
                    '@if-unused': true
                })
            }
        };
    };

    connection.changesetTags = function (comment, imageryUsed) {
        var tags = {
            imagery_used: imageryUsed.join(';').substr(0, 255),
            created_by: 'iD ' + iD.version
        };

        if (comment) {
            tags.comment = comment;
        }

        return tags;
    };

    /**
     * 保存数据请求接口
     * @param changes   所有改变的数据信息对象
     * @param comment   参数
     * @param imageryUsed
     * @param callback  保存成功后的回调方法
     */
    connection.putChangeset = function (changes, comment, imageryUsed, callback) {
        console.log(':::::::::changes:::::::', changes)
        //自动赋值
        for (var i = changes.created.length - 1; i >= 0; i--) {
            var _entity = changes.created[i]
            if (_entity instanceof iD.Way &&
                typeof _entity.tags != 'undefined' &&
                typeof _entity.modelName != 'undefined' &&
                _entity.modelName == 'Highway'
            ) {
                changes.created[i].tags = iD.ui.TagEditor.autoassign.road(_entity.tags);
            }
        }
        console.log(':::::::::自动赋值后的changes:::::::', changes)
        var parser = new DOMParser();

        // GDS V3.1
        var headers = {
            'Content-Type': 'application/xml'
        };

        /**
         * 保存标记tag数据
         * @param {Object} uploaddata
         * @param {Object} opts
         */
        var saveDataAction = function (uploaddata, opts = {}) {
            var saveLoader = function (err, data) {
                if (!data || err) {
                    callback(err || {
                        errorType: 'failed'
                    }, null);
                    return;
                }
                var xmlDoc;
                if (data.responseXML) {
                    xmlDoc = parser.parseFromString(data.response, "text/xml");
                } else {
                    var res = JSON.parse(data.response);
                    if (res && res.code != "0") {
                        callback({
                            errorType: 'KDS',
                            message: res.message
                        }, null);
                        return;
                    } else if (res.code == "0") {
                        callback(err, res);
                        return;
                    }
                }
                callback(err, xmlDoc);
            }

            //content内容为上传服务器的osm数据

            var osmChangeJson, formData;
            var header = {
                'Content-Type': 'application/json'
            };
            if (!opts.isALLSave) {
                osmChangeJson = connection.osmChangeJXON(null, uploaddata);
                formData = JXON.stringify(osmChangeJson);
                header = headers;
            } else {
                formData = JSON.stringify(uploaddata)
            }
            // formData = createFormDataParam('upload', content, null);
            // formData = content;


            // ?app={app}&batch={batch}&seq={seq}
            var megreParam = '';
            var baseServer = iD.config.URL.kds_data,
                url = '';
            if (iD.Task.isSdTask()) {
                baseServer = iD.config.URL.kds_data_sd;
            }
            if (opts.appServer) {
                // 标记保存
                var appType = opts.appType || 'fusion';
                baseServer = iD.config.URL.kd_tag;
                url = baseServer + 'tag/osm/' + appType + '/edit';
            } else {
                var taskKey = opts.taskKey || "";
                // baseServer = iD.config.URL.kds_data;
                url = baseServer + 'data/' + taskKey + '/edit';
            }
            megreParam += (megreParam ? '&' : '') + 'user=' + iD.User.getInfo().username;
            if (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3') {
                megreParam += '&namespace=road-detection';
            }
            if (iD.Task.d.featureGroup) {
                let _str = encodeURIComponent(iD.Task.d.featureGroup.content);
                megreParam += '&filter=' + _str;
            }
            
            url += ('?' + megreParam);
            if (opts.isALLSave) {
                url = iD.config.URL.kds_data + 'data/editMultiLayer?' + megreParam;
            }
 
           

            oauth.ohauth.rawxhr("POST", url, formData, header, saveLoader);
        }


        // 根据图层解析数据
        // 将相同图层数据放到一个数组中
        var item = {
            created: [],
            deleted: [],
            modified: []
        };
        item.created = changes.created;
        item.deleted = changes.deleted;
        item.modified = changes.modified;
        var difference = context.history().difference().changes(); //属性子集编辑
        for (var kId in difference) {
            item.modified.forEach(function (v, k) {
                if (v.id === kId) {
                    var diff = difference[kId],
                        btags = diff.base.tags,
                        htags = diff.head.tags,
                        tags = {};
                    for (var tn in htags)(btags[tn] !== htags[tn]) && (tags[tn] = htags[tn]);
                    v.tags = tags;
                    // if (v.geometry(context.graph()) === 'line') {
                    //     var _diff = _.difference(diff.head.nodes, diff.base.nodes);
                    //     (!(diff.base.nodes.length !== diff.head.nodes.length || _diff.length !== 0)) && (v.nodes = []);
                    // }
                }
            });
        }

        function _getTagItem(tagType) {
            let result = {},
                modelName;
            if (tagType == 1) {
                modelName = iD.data.DataType.QUALITY_TAG;
            } else if (tagType == 2) {
                modelName = iD.data.DataType.IMAGE_TAG;
            } else if (tagType == 3) {
                modelName = iD.data.DataType.ANALYSIS_TAG;
            } else if (tagType == 4) {
                modelName = iD.data.DataType.QUESTION_TAG;
            } else if (tagType == 6) {
                modelName = iD.data.DataType.AUTO_NETWORK_TAG;
            } else if (tagType == 7) {
                modelName = iD.data.DataType.AUTO_CHECKWORK_TAG;
            } else if (tagType == 8) {
                modelName = iD.data.DataType.COMPILE_CHECK_TAG;
            } else if (tagType == 9) {
                modelName = iD.data.DataType.PICK_MARK_TAG;
            } else {
                return result;
            }

            for (let type in item) {
                result[type] = [];
                let tmpArr = [];
                item[type] = _.compact(_.map((item[type] || []), function (entity) {
                    if (entity && entity.modelName === modelName) {
                        result[type].push(entity);
                        return;
                    }
                    return entity;
                }));
            }
            return result;
        }

        // 标记保存
        let checkItem = _getTagItem(1);
        if (checkItem.created.length || checkItem.deleted.length || checkItem.modified.length) {
            saveDataAction(checkItem, {
                appServer: true,
                appType: iD.data.DataType.QUALITY_TAG
            });
        }
        let analysisItem = _getTagItem(3);
        if (analysisItem.created.length || analysisItem.deleted.length || analysisItem.modified.length) {
            saveDataAction(analysisItem, {
                appServer: true,
                appType: iD.data.DataType.ANALYSIS_TAG
            });
        }
        let questionItem = _getTagItem(4);
        if (questionItem.created.length || questionItem.deleted.length || questionItem.modified.length) {
            saveDataAction(questionItem, {
                appServer: true,
                appType: iD.data.DataType.QUESTION_TAG
            });
        }
        let networkItem = _getTagItem(6);
        if (networkItem.created.length || networkItem.deleted.length || networkItem.modified.length) {
            saveDataAction(networkItem, {
                appServer: true,
                appType: iD.data.DataType.AUTO_NETWORK_TAG
            });
        }
        let autoCheckwork = _getTagItem(7);
        if (autoCheckwork.created.length || autoCheckwork.deleted.length || autoCheckwork.modified.length) {
            saveDataAction(autoCheckwork, {
                appServer: true,
                appType: iD.data.DataType.AUTO_CHECKWORK_TAG
            });
        }
        let compileCheckTag = _getTagItem(8);
        if (compileCheckTag.created.length || compileCheckTag.deleted.length || compileCheckTag.modified.length) {
            saveDataAction(compileCheckTag, {
                appServer: true,
                appType: iD.data.DataType.COMPILE_CHECK_TAG
            });
        }
        let pickMarkTag = _getTagItem(9);
        if (pickMarkTag.created.length || pickMarkTag.deleted.length || pickMarkTag.modified.length) {
            saveDataAction(pickMarkTag, {
                appServer: true,
                appType: iD.data.DataType.PICK_MARK_TAG
            });
        }
        if (item.created.length || item.deleted.length || item.modified.length) {
            var history = iD.util.urlParamHistory();
            if (iD.User.isWorkRole() || history) {
                var batchItem = saveDataGroupByTaskKey1(item);
                if (!_.isEmpty(batchItem)) {
                    saveDataAction(batchItem, {
                        isALLSave: true
                        // taskKey: taskKey
                    });
                }
                // _.each(batchItem, function (bitem, taskKey) {
                //     if (!taskKey) return;

                //     if (bitem.created.length || bitem.deleted.length || bitem.modified.length) {
                //         saveDataAction(bitem, {
                //             taskKey: taskKey
                //         });
                //     }
                // });
            }
        }

    };

    function saveDataGroupByTaskKey1(protoItem) {
        let result = {},
            obj = {};


        // 根据taskKey分组保存数据；
        obj.created = _.groupBy(protoItem.created, function (d) {
            return d.layerId;
            var dlay = iD.Layers.getLayer(d.layerId);
            return dlay && dlay.versionInfo && dlay.versionInfo.taskKey || '';
        });
        obj.modified = _.groupBy(protoItem.modified, function (d) {
            return d.layerId;
            var dlay = iD.Layers.getLayer(d.layerId);
            return dlay && dlay.versionInfo && dlay.versionInfo.taskKey || '';
        });
        obj.deleted = _.groupBy(protoItem.deleted, function (d) {
            return d.layerId;
            var dlay = iD.Layers.getLayer(d.layerId);
            return dlay && dlay.versionInfo && dlay.versionInfo.taskKey || '';
        });
        let typeMap = {
            'created': 'create',
            'modified': 'modify',
            'deleted': 'delete'
        }
        _.each(obj, function (batchItem, type) {
            _.each(batchItem, function (dataList, taskKey) {
                let item = result[taskKey];
                if (!item) {
                    item = result[taskKey] = {};
                    item.create = item.modify = item.delete = {};
                }
                let _temp = [];

                dataList.forEach(d => {
                    let t = d.asJson(null, context, type);
                    _temp.push(t);
                })
                item[typeMap[type]] = _.groupBy(_temp, '_type');
            });
        });
        return result;
    }

    function abortRequest(i) {
        if (i && i.type != 'BufferGeometry') {
            i.abort();
        }
    }


    connection.tileZoom = function (_) {
        if (!arguments.length) return tileZoom;
        tileZoom = _;
        return connection;
    };

    /**
     * 加载数据，包含加载数据模型和瓦片数据
     * @param  {[type]} projection [description]
     * @param  {[type]} dimensions [description]
     * @return {[type]}            [description]
     */
    connection.loadData = function (projection, dimensions) {
        //数据加载
        if (iD.Task.d) {
            connection.loadTiles(projection, dimensions);
        }
    };

    // /**
    //  * 获取图层modelId
    //  * @return {[type]} [description]
    //  */
    connection.loadLayerInfo = function (fn, layers) {
        if (!layers) layers = iD.Layers.getLayers();
        var urls = [],
            isSubMode = {};

        //组合URL
        layers.forEach(function (item, k) {
            if (item.isHotspot && item.isHotspot()) return;
            urls.push(dataLayerUrl(item));
            if (item.isRoad() && item.group_members) { //子图层
                var lsIds = [];
                item.group_members.forEach(function (litem, lk) {
                    lsIds.push(litem.id);
                });
                urls.push(dataLayerUrl(item, lsIds));
                isSubMode[k + 1] = true;
            }
        });

        //异步请求数据图层
        function asyncQuest(inputs, callback) {
            var results = [],
                errors = [],
                remaining = inputs.length;

            //显示加载中。。。
            event.loading();

            inputs.forEach(function (d, i) {

                if (layerObjCache[d]) {
                    remaining--;

                    //if (!remaining) callback(errors, results);

                    return;
                }

                //设置缓存
                layerObjCache[d] = true;

                d3.xml(d, function done(err, data) {
                    errors[i] = err;
                    results[i] = data;
                    remaining--;
                    if (!remaining) callback(errors, results);
                });
            });
        }

        // 判断图层是否都加载过
        function loadedLayerInfo() {
            for (var i in urls)
                if (!layerObjCache[urls[i]]) return false;
            return true;
        }

        //成功回调
        function triumph(err, xmls) {
            //在此判断一下err

            //转换数据图层
            xmls.forEach(function (dom, j) {
                if (isSubMode[j]) {
                    parseSubDataLayer(dom);
                } else {
                    parseDataLayer(dom);
                }
            });

            //加载完成
            event.loaded();

            //设置加载完数据图层
            loadedLayerFlag = true;

            fn();
        }

        if (loadedLayerFlag && loadedLayerInfo()) {
            //加载成功后，直接在加载图层
            fn();
        } else {
            asyncQuest(urls, triumph);
        }
    }

    function getBboxTileData(projection, dimensions) {
        var s = projection.scale() * 2 * Math.PI,
            z = Math.max(Math.log(s) / Math.log(2) - 8, 0);

        var ts = 256 * Math.pow(2, z - tileZoom),
            origin = [
                s / 2 - projection.translate()[0],
                s / 2 - projection.translate()[1]
            ];

        var tiles = d3.geo.tile()
            .scaleExtent([tileZoom, tileZoom])
            .scale(s)
            .size(dimensions)
            .translate(projection.translate())();
        // var b=tiles;
        tiles = tiles.map(function (tile) {
            var x = tile[0] * ts - origin[0],
                y = tile[1] * ts - origin[1];

            return {
                id: tile.toString(),
                extent: iD.geo.Extent(
                    projection.invert([x, y + ts]),
                    projection.invert([x + ts, y]))
            };
        });

        return {
            z: z,
            tiles: tiles
        }
    }

    connection.loadTiles = function (projection, dimensions) {

        if (off) return;

        var result = getBboxTileData(projection, dimensions);
        var z = result.z;
        var tiles = result.tiles;

        // if (!context.options.loadmodel && z <= 15) tileZoom = z;//加载次数的限制, 调整为与瓦片数量相同
        if (z < context.map().editableLevel()) {
            return;
        }

        function _bboxUrl(layer, tile) {
            if (!layer || !iD.config || !iD.config.URL) {
                return '';
            }
            var mergePara = '';
            if (iD.Task.d) {
                mergePara += '&filter=true';
            }

            var dataUrl = '';
            if (layer.filterParam instanceof Function) {
                let _str = iD.util.parseParam2String(layer.filterParam(layer));
                if (_str) {
                    mergePara += '&' + _str;
                }
            }
            dataUrl = layer.url + '&bbox=' + tile.extent.toParam() + mergePara + "&tileId=" + tile.id;
            return dataUrl;
        }

        function _queryUrl(layer) {
            var dataUrl = '';
            var mergePara = '';
            if (layer.filterParam instanceof Function) {
                let _str = iD.util.parseParam2String(layer.filterParam(layer));
                if (_str) {
                    mergePara += '&' + _str;
                }
            }
            dataUrl = layer.url + mergePara;
            return dataUrl;
        }

        function parseLayerUrl(layer, tile) {
            var dataUrl = '';
            var _last = _.last(layer.url);
            if (layer.isBbox) {
                dataUrl = _bboxUrl(layer, tile);
            } else {
                dataUrl = _queryUrl(layer);
            }
            if (_last == '?' && dataUrl.indexOf('?&') > -1) {
                dataUrl = dataUrl.replace('?&', '?');
            }
            // if(layer.isBbox){
            dataUrl = dataUrl + '&t=' + new Date().getTime();
            // }
            return dataUrl;
        }

        var layers = iD.Layers.getLayers();
        var otherLayers = [];
        layers = layers.filter(function (layer) {
            // 标记图层单独查询
            if (!layer.isBbox) {
                otherLayers.push(layer);
            }
            return layer.isBbox;
        });
        layers.forEach(function (layer) {
            _.filter(inflight, function (v, i) {
                var wanted = _.find(tiles, function (tile) {
                    var id = tile.id + "," + layer.id;
                    if (i === id) {
                        return true;
                    }

                    return false;
                });
                if (!wanted) delete inflight[i];
                return !wanted;
            }).map(abortRequest);
        });

        layers.forEach(function (layer) {
            if (!layer.url || !layer.display) {
                return false;
            }
            tiles.forEach(function (tile) {
                var id = tile.id + "," + layer.id;
                if (loadedTiles[id] || inflight[id]) return;

                if (_.isEmpty(inflight)) {
                    event.loading();
                }

                inflight[id] = connection.loadFromURL(parseLayerUrl(layer, tile), function (err, parsed, lay) {
                    loadedTiles[id] = true;
                    delete inflight[id];

                    var loadedObj = {
                        loaded: false
                    };
                    if (_.isEmpty(inflight)) {
                        loadedObj.loaded = true;
                    }
                    var hasLoad = false;
                    if (parsed.length > 0) {
                        event.load(err, _.extend({
                            data: parsed || []
                        }, tile, loadedObj));
                        hasLoad = true;
                    }
                    if (loadedObj.loaded) {
                        if (!hasLoad) {
                            event.load(err, _.extend({
                                data: parsed || []
                            }, tile, loadedObj));
                        }

                        event.loaded();
                    }
                }, layer);
            });
        });

        otherLayers.forEach(function (layer) {
            if (!layer.url || !layer.display) {
                return false;
            }
            var id = layer.id;
            if (loadedTiles[id] || inflight[id]) return;

            if (_.isEmpty(inflight)) {
                event.loading();
            }

            inflight[id] = connection.loadFromURL(parseLayerUrl(layer), function (err, parsed, lay) {
                loadedTiles[id] = true;
                delete inflight[id];

                var loadedObj = {
                    loaded: false
                };
                if (_.isEmpty(inflight)) {
                    loadedObj.loaded = true;
                }
                var hasLoad = false;
                if (parsed.length > 0) {
                    console.log('load', id);
                    event.load(err, _.extend({
                        data: parsed || []
                    }, '', loadedObj));
                    hasLoad = true;
                }
                if (loadedObj.loaded) {
                    if (!hasLoad) {
                        event.load(err, _.extend({
                            data: parsed || []
                        }, '', loadedObj));
                    }
                    event.loaded();
                }
            }, layer);
        });

    };

    /**
     * 加载搜索结果
     */
    connection.loadSearchResult = function (condition, layerInfo, pageIndex, pageSize, callback) {
        var url = layerInfo.url + '/data/query/list?sid=2100&encode=UTF-8&layerId=' + layerInfo.id + '&currentpage=' + pageIndex +
            '&pagesize=' + pageSize + '&filter=' + encodeURIComponent(condition);

        d3.xml(url, function done(err, xml) {
            var result = parseSearchResultEntity(xml, layerInfo);
            callback(result);
        });
    };

    //事务查询解析
    iD.User && iD.User.on('login.connection', function () {
        transId = iD.util.stringQs(window.location.href).transId || 22, holes = {}, useId = iD.User.getInfo().userid, users = context.users = {};
        users[useId] = {};
        users.cUseId = useId;
    });


    connection.searchPictureFeatureInfo = function (layerId, bbox, x, y, width, height, callback) {
        var searchCount = 0;
        var callbackCount = 0;
        var searchResult = [];
        var tagFlags = [];
        var layers = editor.getOverlayers();
        layers.forEach(function (layer) {
            if (layer.visible && layer.dataUrl) {
                searchCount++;
            }
        });
        var flag = false;

        function searchCallBack(d, tagFlag) {
            searchResult.push(d);
            tagFlags.push(tagFlag);
            callbackCount++;
            if (searchResult.length == searchCount) {

                for (var i = 0; i < searchCount; i++) {
                    if (searchResult[i] && searchResult[i].length) {
                        callback(searchResult[i], tagFlags[i]);
                        return;
                    }
                }
                callback();
            }
            return;
        }

        for (var i = 0; i < layers.length; i++) {
            if (layers[i].visible && layers[i].dataUrl) {
                var queryUrl = layers[i].dataUrl + "outputFormat=geojson&bbox=" + bbox[0][0] + "," + bbox[0][1] + "," + bbox[1][0] + "," + bbox[1][1] + "&X=" + x + "&y=" + y + "&width=" + width + "&height=" + height + "&callback={callback}";
                if (layers[i].id == 't_pkb_shp') {
                    d3.jsonp(queryUrl, function (d) {
                        searchCallBack(d, iD.tagIndex.t_pkb_shp);
                    });
                } else if (layers[i].id == 't_pkb_tag') {
                    d3.jsonp(queryUrl, function (d) {
                        searchCallBack(d, iD.tagIndex.t_pkb_tag);
                    });
                } else if (layers[i].id == 't_user_feedback_pkb_tag') {
                    d3.jsonp(queryUrl, function (d) {
                        searchCallBack(d, iD.tagIndex.t_user_feedback_pkb_tag);
                    });
                } else if (layers[i].id == 't_user_feedback_pkb_shp') {
                    d3.jsonp(queryUrl, function (d) {
                        searchCallBack(d, iD.tagIndex.t_user_feedback_pkb_shp);
                    });
                } else {
                    d3.jsonp(queryUrl, function (d) {
                        searchCallBack(d, iD.tagIndex.ref_tag);
                    });
                }

                flag = true;
            }
        }
        if (!flag) {
            callback();
        }
    };
    connection.switch = function (options) {
        url = options.url;
        oauth.options(_.extend({
            loading: authenticating,
            done: authenticated
        }, options));
        event.auth();
        connection.flush();
        return connection;
    };

    connection.toggle = function (_) {
        off = !_;
        return connection;
    };

    connection.flush = function () {
        _.forEach(inflight, abortRequest);
        loadedTiles = {};
        inflight = {};
        inflightTag = {};
        return connection;
    };

    connection.loadedTiles = function (_) {
        if (!arguments.length) return loadedTiles;
        loadedTiles = _;
        return connection;
    };

    connection.logout = function () {
        oauth.logout();
        event.auth();
        return connection;
    };

    return d3.rebind(connection, event, 'on');
};