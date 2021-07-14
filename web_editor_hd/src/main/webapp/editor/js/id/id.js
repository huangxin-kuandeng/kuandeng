/*
 * @Author: tao.w
 * @Date: 2019-10-14 11:21:05
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-22 20:27:12
 * @Description: 
 */
window.iD = function () {


    window.locale.en = iD.data.en;//英文提示annotation配置库,data/locales/en.js
    window.locale.current('en');



    var context = {},
        storage,
        loading = iD.ui.Loading(context).message("资料加载中,请稍后").blocking(false),
        loadCount = 0;

    context._heightZoom = 20;
    if (!context._pbRoot) {
        let protoUrl = "./dist/proto_segment/vertical_view_height_mat.proto";
        protobuf.load(protoUrl, function (err, root) {
            context._pbRoot = root;
            context.aboveGroundsPBRoot = context._pbRoot.lookupType('SparseFlexHeightMat');

        });
    }
    // https://github.com/openstreetmap/iD/issues/772
    // http://mathiasbynens.be/notes/localstorage-pattern#comment-9
    try { storage = localStorage; } catch (e) { }    //本地浏览器localStorage转存到storage
    storage = storage || (function () {
        var s = {};
        return {
            getItem: function (k) { return s[k]; },
            setItem: function (k, v) { s[k] = v; },
            removeItem: function (k) { delete s[k]; }
        };
    })();

    function showLoading() {
        // if (loadCount == 0)
        //     context.container().call(loading);
        // loadCount++;
        // console.log('showloading',loadCount);
    }
    function hideLoading() {
        // loadCount--;
        // console.log('hideLoading',loadCount);
        // if (loadCount == 0)
        //     loading && loading.close();
        
        // context.quresting = false;
    }
    context.measuringTrack = null;




    context.storage = function (k, v) {
        try {
            if (arguments.length === 1) return storage.getItem(k);
            else if (v === null) storage.removeItem(k);
            else storage.setItem(k, v);
        } catch (e) {
            // localstorage quota exceeded
            /* jshint devel:true */
            if (typeof console !== 'undefined') console.error('localStorage quota exceeded');
            /* jshint devel:false */
        }
    };

    var history = iD.History(context),
        buriedStatistics = iD.BuriedStatistics(context),
        dispatch = d3.dispatch('enter', 'exit', 'change', 'refresh'),
        mode,
        container,
        _editArea = [],
        _transactionEditor = false,
        ui = iD.ui(context),
        connection = iD.Connection(context),
        locale = iD.detect().locale,
        localePath;


    if (!iD.fileHistory) {

    } else {
        var filehistory = iD.fileHistory(context);
    }
    if (locale && iD.data.locales.indexOf(locale) === -1) {
        locale = locale.split('-')[0];
    }
    // 加载bbox范围内数据后生成entities
    connection.on('load.context', function loadContext(err, result, url) {
        history.merge(result.data, result.extent, url, result.loaded);
    });

    context.preauth = function (options) {
        connection.switch(options);
        return context;
    };

    context.locale = function (_, path) {
        locale = _;
        localePath = path;
        return context;
    };

    context.loadLocale = function (cb) {
        if (locale && locale !== 'en' && iD.data.locales.indexOf(locale) !== -1) {
            //            localePath = localePath || context.assetPath() + 'locales/' + locale + '.json';
            //            d3.json(localePath, function(err, result) {
            setTimeout(function () {
                window.locale[locale] = iD.data.zh_cn;
                window.locale.current(locale);
                cb();
            }, 300);
            //            });
        } else {
            cb();
        }
    };
    context.localStorageClean = function () {
        localStorage.clear();
    };

    /* Straight accessors. Avoid using these if you can. */
    context.ui = function () { return ui; };
    context.connection = function () { return connection; };
    context.history = function () { return history; };
    context.buriedStatistics = function () { return buriedStatistics; };
    context.filehistory = function () { return filehistory; };

    /* History */
    context.graph = history.graph;
    context.changes = history.changes;
    context.intersects = history.intersects;

    var inIntro = false;

    context.inIntro = function (_) {
        if (!arguments.length) return inIntro;
        inIntro = _;
        return context;
    };

    context.save = function () {
        if (inIntro) return;
        history.save();
        if (history.hasChanges()) {
            return t('save.unsaved_changes');
        }
    };

    context.flush = function () {
        connection.flush();
        history.reset();
        return context;
    };

    // Debounce save, since it's a synchronous localStorage write,
    // and history changes can happen frequently (e.g. when dragging).
    var debouncedSave = _.debounce(context.save, 350);
    function withDebouncedSave(fn) {
        return function () {
            var result = fn.apply(history, arguments);
            debouncedSave();
            return result;
        };
    }

    context.perform = withDebouncedSave(history.perform);
    context.replace = withDebouncedSave(history.replace);
    context.pop = withDebouncedSave(history.pop);
    context.undo = withDebouncedSave(history.undo);
    context.redo = withDebouncedSave(history.redo);

    /* Graph */
    context.hasEntity = function (id) {
        return history.graph().hasEntity(id);
    };

    context.entity = function (id) {
        return history.graph().entity(id);
    };

    context.childNodes = function (way) {
        return history.graph().childNodes(way);
    };

    context.geometry = function (id) {
        return context.entity(id).geometry(history.graph());
    };

    /* Modes */
    context.enter = function (newMode,opts = {}) {
        if (mode) {
            mode.exit();
            dispatch.exit(mode);
        }

        mode = newMode;
        mode.enter(opts);
        dispatch.enter(mode);
    };

    context.mode = function () {
        return mode;
    };

    context.selectedIDs = function () {
        if (mode && mode.selectedIDs) {
            return mode.selectedIDs();
        } else {
            return [];
        }
    };

    context.trackGround = null;
    context.inflight = {};
    context.aboveGrounds = {};
    context.catchAboveGround = {
        id: '',
        aboveGround: null
    };


    context.aboveGroundInflight = {};

    // context.quresting = false;

    function loadPly(key) {
        showLoading();

        var url = iD.config.URL.hbase_plys + "hbase-support/text/road_detection_middle_result/camera_height_calc/query?key=" + key;
        url = iD.util.stringSwitch(url);
        var setzone = iD.Task.d.tags.utm.zone;
        var loader = new THREE.PLYLoader();
        loader.load({'url': url, 'setzone': setzone}, function (_geometry) {
            if (_geometry) {
                _geometry.computeVertexNormals();
                var material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });  //side:THREE.DoubleSide
                let mesh = new THREE.Mesh(_geometry, material);

                _geometry.computeBoundsTree = MeshBVHLib.computeBoundsTree;
                _geometry.disposeBoundsTree = MeshBVHLib.disposeBoundsTree;
                mesh.raycast = MeshBVHLib.acceleratedRaycast;
                mesh.geometry.computeBoundsTree();

                context.ply = mesh;
            }
            hideLoading();
        });
    }

    context.loadMaterial = function (projection, dimensions) {
        if (context.variable.isUsePLY) {
            context.loadPLY(projection, dimensions);
        }
        // context.loadHeight(projection,dimensions);
        if (context.variable.isUseHeight)
            loadHeight(projection, dimensions);
    }

    context.loadPLY = function (projection, dimensions) {
        if (iD.Task.d.tags.plyKey && context.ply === null) {
            context.ply = false;
            loadPly(iD.Task.d.tags.plyKey);
        } else if (iD.Task.d.tags.branchDataType == '2' || iD.Task.d.tags.laserSplitPly) {
            context.loadPLYTiles(projection, dimensions);
        }
    }

    context.loadPLYTiles = function (projection, dimensions) {

        // if (context.quresting || !iD.Task.d.tags.laserSplitPly) return;
        if (!iD.Task.d.tags.laserSplitPly) return;

        var s = projection.scale() * 2 * Math.PI;
        if (editor.context.map().zoom() < 20) return;

        var mesh_level = Number(iD.Task.d.tags.mesh_level || 18);
        context.ply_level = mesh_level;

        var tiles = d3.geo.tile()
            .scaleExtent([mesh_level, mesh_level])
            .scale(s)
            .size(dimensions)
            .translate(projection.translate())();

        // var geometry = null;

        function exec(tile) {
            var setzone = iD.Task.d.tags.utm.zone;
            var loader = new THREE.PLYLoader();
            var id = tile[0] + '_' + tile[1] + '-' + iD.Task.d.tags.laserSplitPly;
            if (context.inflight.hasOwnProperty(id)) {
                return;
            }
            return new Promise(function (resolve) {
                var id = tile[0] + '_' + tile[1] + '-' + iD.Task.d.tags.laserSplitPly;
                // if (context.inflight.hasOwnProperty(id)) {
                //     resolve();
                //     return
                // }
                var url = iD.config.URL.hbase_plys + "hbase-support/text/laser_middle_result/multi_tracks_ground_ply/query?key=" + id;
                if (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3') {
                    url = iD.config.URL.hbase_plys + "hbase-support/text/road_detection_middle_result/dense_segment_merge/query?key=" + id;
                }
                url = iD.util.stringSwitch(url);

                context.inflight[id] = false;
                loader.load({'url': url, 'setzone': setzone}, function (_geometry) {
                    if (_geometry) {
                        _geometry.computeVertexNormals();
                        var material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });
                        let mesh = new THREE.Mesh(_geometry, material);

                        _geometry.computeBoundsTree = MeshBVHLib.computeBoundsTree;
                        _geometry.disposeBoundsTree = MeshBVHLib.disposeBoundsTree;
                        mesh.raycast = MeshBVHLib.acceleratedRaycast;
                        mesh.geometry.computeBoundsTree();

                        context.inflight[id] = mesh;
                    } else {
                        context.inflight[id] = false;
                    }
                    //  else {
                    //     context.inflight[id] = false;
                    // }
                    resolve();
                });
            });
        }

        var ps = [];

        tiles.forEach(function (tile) {
            let _t = exec(tile);
            if (!_t) {
                return false
            }
            ps.push(_t);
        })

        if (ps.length) {
            // context.quresting = true;
            showLoading();
            Promise.all(ps).then(args => {
                hideLoading();
            })
        }
    }

    // function loadHeight(projection, dimensions) {
    //     let _tile = d3.geo.tile();
    //     let z = context.map().zoom();
    //     _tile.scale(projection.scale() * 2 * Math.PI)
    //         .size(dimensions)
    //         .translate(projection.translate())
    //         .scaleExtent([z,z]);

    //     let _id = iD.Task.d.tags.laserVerticalView;
    //     let projectId = iD.Task.d.tags.projectId;
    //     if (!_id) return;
    //     tiles = _tile();


    //     let layer = context.background().getLayerById('aboveGroundMap');  
    //     let height = null;
    //     if(layer.hasOwnProperty('height')){
    //         height = layer.height;
    //     }  
    //     // var s = projection.scale() * 2 * Math.PI;
    //     if (context.map().zoom() < 21) return;


    //     function exec(tile,laserVerticalId,projectId,height) {
    //         var id = tile[0] + '_' + tile[1];
    //         if (context.aboveGrounds.hasOwnProperty(id)) {
    //             return;
    //         }
    //         return new Promise(function (resolve) {
    //             var _canvas = document.createElement("canvas");
    //             _canvas.width = 256;
    //             _canvas.height = 256;
    //             var _cxt = _canvas.getContext("2d");
    //             let new_multi_tiles = iD.config.URL.multi_tiles.replace(/\{switch:([^}]+)\}/, function(s, r) {
    //                 var subdomains = r.split(',');
    //                 return subdomains[(tile[0] + tile[1]) % subdomains.length];
    //             });
    //             let url = new_multi_tiles + `x=${tile[0]}&y=${tile[1]}&z=${tile[2]}` + '&key=height_' + laserVerticalId + '&projectId=' + projectId;

    //             if (height != null) {
    //                 url = url + '&height=' + this.height;
    //             }

    //             context.aboveGrounds[id] = false;
    //             var img = new Image();

    //             img.src = url;
    //             img.error = function () {
    //                 resolve();
    //             }
    //             img.crossOrigin = "Anonymous";
    // 			if(img.complete){
    // 				img_onload();
    // 			}
    //             img.onload = function () {
    // 				img_onload();
    //             }

    // 			function img_onload(){
    //                 let width = img.width;
    //                 let height = img.height;
    //                 _canvas.width = width;
    //                 _canvas.height = height;

    //                 _cxt.drawImage(img, 0, 0);
    //                 let imageData = _cxt.getImageData(0, 0, width, height);
    //                 context.aboveGrounds[id] = imageData.data;
    //                 resolve();
    // 			}
    //         });
    //     }

    //     var ps = [];

    //     tiles.forEach(function (tile) {
    //         let _t = exec(tile,_id,projectId,height);
    //         if (!_t) {
    //             return false
    //         }
    //         ps.push(_t);
    //     })

    //     if (ps.length) {
    //         // context.quresting = true;
    //         showLoading();
    //         Promise.all(ps).then(args => {
    //             hideLoading();
    //         })
    //     }
    // }

    function loadHeight(projection, dimensions) {
        let _tile = d3.geo.tile();
        let z = context._heightZoom;

        _tile.scale(projection.scale() * 2 * Math.PI)
            .size(dimensions)
            .translate(projection.translate())
            .scaleExtent([z, z]);

        let _id = iD.Task.d.tags.laserVerticalView;
        let projectId = iD.Task.d.tags.projectId;
        if (!_id) return;
        tiles = _tile();


        let layer = context.background().getLayerById('aboveGroundMap');
        let height = null;
        if (layer.hasOwnProperty('height')) {
            height = layer.height;
        }
        if (context.map().zoom() < 21) return;
        let packge = 'SparseFlexHeightMat';
        let isBase64 = false;
        let _url = iD.config.URL.file;
        if(iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3'){
            _url = iD.config.URL.pavement_distrees_file;
        }

        function exec(tile, laserVerticalId, projectId, height) {
            return new Promise(function (resolve) {

                var id = tile[0] + '_' + tile[1];
                let new_multi_tiles = _url.replace(/\{switch:([^}]+)\}/, function (s, r) {
                    var subdomains = r.split(',');
                    return subdomains[(tile[0] + tile[1]) % subdomains.length];
                });

                let url = new_multi_tiles + 'key=height_' + laserVerticalId + '&index=' + id + '_' + z + '&projectId=' + projectId;

                if (context.aboveGrounds.hasOwnProperty(id) || context.aboveGroundInflight[id]) {
                    resolve();
                    return;
                }

                //解析PB
                context.aboveGroundInflight[id] = iD.util.parsePBData2(url, context._pbRoot, packge, function (message) {

                    delete context.aboveGroundInflight[id];
                    // let obj  = new Map();
                    if (!message) {
                        context.aboveGrounds[id] = false;
                        resolve();
                        return;
                    }
                    // let pixel =  message.pixel;

                    // for(let i=0; i<pixel.length;i++){
                    //     let p = pixel[i];
                    //     if(obj.has(p.row)){
                    //         let v = obj.get(p.row);
                    //         v.push({col:p.col,element:p.element});
                    //     }else{
                    //         let valuse = [];
                    //         valuse.push({col:p.col,element:p.element});
                    //         obj.set(p.row,valuse);
                    //     }
                    // }
                    context.aboveGrounds[id] = message;
                    delete message;
                    delete pixel;

                    resolve();
                }, isBase64);

            });
        }

        var ps = [];

        tiles.forEach(function (tile) {
            let _t = exec(tile, _id, projectId, height);
            if (!_t) {
                return false
            }
            ps.push(_t);
        })

        if (ps.length) {
            showLoading();
            Promise.all(ps).then(args => {
                hideLoading();
            })
        }
    }
    // function loadHeight(projection, dimensions) {
    //     let _tile = d3.geo.tile();
    //     let z = context._heightZoom;

    //     _tile.scale(projection.scale() * 2 * Math.PI)
    //         .size(dimensions)
    //         .translate(projection.translate())
    //         .scaleExtent([z, z]);

    //     let _id = iD.Task.d.tags.laserVerticalView;
    //     let projectId = iD.Task.d.tags.projectId;
    //     if (!_id) return;
    //     tiles = _tile();


    //     let layer = context.background().getLayerById('aboveGroundMap');
    //     let height = null;
    //     if (layer.hasOwnProperty('height')) {
    //         height = layer.height;
    //     }
    //     if (context.map().zoom() < 21) return;
    //     let packge = 'SparseFlexHeightMat';
    //     let isBase64 = false;

    //     function exec(tile, laserVerticalId, projectId, height) {
    //         return new Promise(function (resolve) {

    //             var id = tile[0] + '_' + tile[1];
    //             let new_multi_tiles = iD.config.URL.file.replace(/\{switch:([^}]+)\}/, function (s, r) {
    //                 var subdomains = r.split(',');
    //                 return subdomains[(tile[0] + tile[1]) % subdomains.length];
    //             });

    //             let url = new_multi_tiles + 'key=height_' + laserVerticalId + '&index=' + id + '_' + z + '&projectId=' + projectId;

    //             if (context.aboveGrounds.hasOwnProperty(id) || context.aboveGroundInflight[id]) 
    //             {
    //                 resolve();
    //                 return;
    //             }

    //             //解析PB
    //             context.aboveGroundInflight[id] = iD.util.parsePBData1(url, context._pbRoot, packge, function (message) {

    //                 delete context.aboveGroundInflight[id];
    //                 let obj  = new Map();
    //                 if(!message){
    //                     context.aboveGrounds[id] = false;
    //                     resolve();
    //                     return ;
    //                 }
    //                 // let pixel =  message.pixel;

    //                 // for(let i=0; i<pixel.length;i++){
    //                 //     let p = pixel[i];
    //                 //     if(obj.has(p.row)){
    //                 //         let v = obj.get(p.row);
    //                 //         v.push({col:p.col,element:p.element});
    //                 //     }else{
    //                 //         let valuse = [];
    //                 //         valuse.push({col:p.col,element:p.element});
    //                 //         obj.set(p.row,valuse);
    //                 //     }
    //                 // }
    //                 context.aboveGrounds[id] = obj;
    //                 delete message;
    //                 delete pixel;

    //                 resolve();
    //             }, isBase64);

    //         });
    //     }

    //     var ps = [];

    //     tiles.forEach(function (tile) {
    //         let _t = exec(tile, _id, projectId, height);
    //         if (!_t) {
    //             return false
    //         }
    //         ps.push(_t);
    //     })

    //     if (ps.length) {
    //         showLoading();
    //         Promise.all(ps).then(args => {
    //             hideLoading();
    //         })
    //     }
    // }

    context.loadEntity = function (id, zoomTo, layerInfo) {
        if (zoomTo !== false) {
            connection.loadEntity(id, layerInfo, function (error, entity) {
                if (entity.loc && (entity.loc[0] > 180 || entity.loc[1] > 90)) {
                    entity.loc[0] /= 10000;
                    entity.loc[1] /= 10000;
                }
                if (entity) {
                    map.zoomTo(entity);
                }
            });
        }

        map.on('drawn.loadEntity', function () {
            if (!context.hasEntity(id)) return;
            map.on('drawn.loadEntity', null);
            context.on('enter.loadEntity', null);
            context.enter(iD.modes.Select(context, [id]));
        });

        context.on('enter.loadEntity', function () {
            if (mode.id !== 'browse') {
                map.on('drawn.loadEntity', null);
                context.on('enter.loadEntity', null);
            }
        });
    };

    context.editable = function () {
        return map.editable() && mode && mode.id !== 'save';
    };

    /* Behaviors */
    context.install = function (behavior) {
        context.surface().call(behavior);
    };

    context.uninstall = function (behavior) {
        context.surface().call(behavior.off);
    };

    /* Projection */
    context.projection = iD.geo.RawMercator();

    /* Background */
    var background = iD.Background(context);
    context.background = function () { return background; };

    /* Event */
    context.event = iD.Event();

    /* Options */
    iD.Options = context.options = {};

    /* Map */
    var map = iD.Map(context);
    context.map = function () { return map; };
    context.surface = function () { return map.surface; };
    context.mouse = map.mouse;
    context.extent = map.extent;
    context.pan = map.pan;
    context.zoomIn = map.zoomIn;
    context.zoomOut = map.zoomOut;

    context.layers = function (layerId) {
        if (!arguments.length) return iD.Layers;
        return iD.Layers.getLayerById(layerId);
    };

    context.surfaceRect = function () {
        // Work around a bug in Firefox.
        //   http://stackoverflow.com/questions/18153989/
        //   https://bugzilla.mozilla.org/show_bug.cgi?id=530985
        return context.surface().node().parentNode.getBoundingClientRect();
    };

    /* OverView */
    context.overview_projection = iD.geo.RawMercator();
    var overview = iD.Overview(context);
    context.overview = function () { return overview; };

    /* Presets */
    var presets = iD.presets()
        .load(iD.data.presets);

    context.presets = function () {
        return presets;
    };

    /*常量配置*/
    context.Constant = function () {
        return iD.data.Constant;
    }

    context.container = function (_) {
        if (!arguments.length) return container;
        container = _;
        container.classed('KDSEditor-id-container', true);
        return context;
    };
    context.editArea = function (_) {
        if (!arguments.length) return iD.User.isTrackStandardRole() ? [] : _editArea;
        _editArea = _;
        return context;
    }
    context.transactionEditor = function (_) {
        if (!arguments.length) return _transactionEditor;
        _transactionEditor = _;
        return context;
    }
    var embed = false;
    context.embed = function (_) {
        if (!arguments.length) return embed;
        embed = _;
        return context;
    };

    var assetPath = '';
    context.assetPath = function (_) {
        if (!arguments.length) return assetPath;
        assetPath = _;
        return context;
    };

    var assetMap = {};
    context.assetMap = function (_) {
        if (!arguments.length) return assetMap;
        assetMap = _;
        return context;
    };

    context.imagePath = function (_) {
        var asset = 'img/' + _;
        return assetMap[asset] || assetPath + asset;
    };

    context.temp = function () {
        context.temp || (context.temp = {});
        return context.temp;
    };

    context.tempv = function (k, v) {
        context.temp();
        if (k)
            context.temp[k] = v || 0;
        return true;
    };

    context.transportation = iD.Transportation.operations;

    context.isRoadCross = function (entity) {
        return entity.isRoadCross && entity.isRoadCross();
    }

    context.isPlaceName = function (entity) {
        return entity.isPlaceName && entity.isPlaceName();
    }

    context.isDetailSlope = function (entity) {
        return entity.isDetailSlope && entity.isDetailSlope();
    }

    context.isWalkZlevel = function (entity) {
        return entity.isWalkZlevel && entity.isWalkZlevel();
    }

    context.isQcTag = function (entity) {
        return entity.isQcTag && entity.isQcTag();
    }
    context.isWalkEnter = function (entity) {
        return entity.isWalkEnter && entity.isWalkEnter();
    }

    context.isRoadNode = function (entity) {
        return entity.isRoadNode && entity.isRoadNode();
    }

    context.isOneRoadCrossWay = function (entity) {
        return entity.isOneRoadCrossWay && entity.isOneRoadCrossWay();
    }

    context.lightOverlays = function () {
        return map._lightselector || '';
    }

    var placeNameEdit = false;
    context.placeNameEdit = function (_) {
        if (!arguments.length) return placeNameEdit;
        placeNameEdit = _;
        return context;
    }

    var qcTagEdit = false;
    context.qcTagEdit = function (_) {
        if (!arguments.length) return qcTagEdit;
        qcTagEdit = _;
        return context;
    }

    context.autoSave = function () {
        if (iD.Task.isLocalTaskSys()) {
            return;
        }
        //      return ;
        if (history.hasChanges() && !context.variable.isOpenSaveDialog) {
            context.variable.isOpenSaveDialog = true;
            window.clearInterval(context.variable.autoSaveTime);
            Dialog.confirm("您已长时间没有保存数据了，是否保存？", function () {
                context.enter(iD.modes.Save(context, "auto saving"));
                context.variable.isOpenSaveDialog = false;
            }, function () {
                context.variable.isOpenSaveDialog = false;
                if (context.variable.autoSaveTime) {
                    window.clearInterval(context.variable.autoSaveTime);
                    context.variable.autoSaveTime = window.setInterval(context.autoSave, 900000);
                }
            })
        }
    }

    //增加一个变量数组，新建的全局变量在这里进行定义
    context.variable = {
        roadLabel: null,
        isUsePLY: false,
        isUseHeight: false,
        nodeLabel: null,
        barrierWidth: 0.01,
        singleNodeByTopoSplit: null,
        singleNode: null,
        isDividerAttrHighlight: false,
        isLaneHighlight: false,
        isMeasureInfoHighlight: false,
        isOpenSaveDialog: false,
        autoSaveTime: null,
        altKeyDown: false,
        firstInTopo: null,
        aboveGround: {
            modelName: '',
            attr: {},
            edge: 1,
            type: '-1',
            isEditor: true
        },
        // 不渲染属性列表
        blankFieldList: [
            // 线上的节点，只显示DIVIDER_NODE和ROAD_NODE
            iD.data.DataType.OBJECT_PG_NODE,
            // DataType.OBJECT_PL_NODE,
            iD.data.DataType.TRAFFICSIGN_NODE,
            iD.data.DataType.BRIDGE_NODE,
            // iD.data.DataType.AUTO_NETWORK_TAG,
            iD.data.DataType.CHECK_TAG
        ],
        canNotDrag: [
            // iD.data.DataType.DIVIDER_NODE,
            iD.data.DataType.OBJECT_PT,
            iD.data.DataType.LAMPPOST,
            // iD.data.DataType.OBJECT_PG_NODE,
            // iD.data.DataType.OBJECT_PL_NODE,
            iD.data.DataType.TRAFFICSIGN_NODE,
            iD.data.DataType.ROAD_ATTRIBUTE,
            iD.data.DataType.BRIDGE_NODE,
            // 图像标记
            iD.data.DataType.IMAGE_TAG,
            // 分析标记
            iD.data.DataType.ANALYSIS_TAG,
            // 问题记录标记
            iD.data.DataType.QUESTION_TAG,
            // 组网标记
            iD.data.DataType.AUTO_NETWORK_TAG,
            // 质检标记
            iD.data.DataType.QUALITY_TAG
        ],
        firstInZoomLevel: null,
        showShapePoint: false,//是否显示形点数据-- Tilden true:都显示；false:只显示节点及带有DA、LA关系的节点和形点
        showObjectPGPoint: false,//是否显示定位目标点
        // showLineArrow:false,//是否显示线箭头-- Tilden
        //用于判断编辑车道线/编辑非车道线按钮 -- Tilden
        edit: {
            editDivider: false,
            editOther: false
        },
        checkUselessFlag: true,//用于记录自动检查是否忽略错误项，进入下一个环节
        localCheckTags: [],
        checkUseHistoryFlag: false,//用于记录数据是否重新编辑并保存过，如果保存过需要重新执行自动检查
        checkObjectPGTXT: false,//用于记录objectPG是否显示文字
        trackWhiteListStatus: {},
        isDrawTrackPointsToShape: true,
        isDottedSoild: false,
        dragBarrierNode: {
            nodeId: '',
            oldLoc: [],
            newLoc: []
        },
        renderFilter: true,
        saveTrafficsignSrc: {},
        heilights: [], //保存特效要素ID
        signpostTagEditor: null//用于记录路牌编辑面板对象
    };

    if (iD.User && !iD.User.isEditCheckSystemAndRole()) {
        context.variable.canNotDrag.push(iD.data.DataType.QUALITY_TAG);
    }
    if (iD.User && iD.User.isQualityAssessorRole()) {
        context.variable.canNotDrag.push(iD.data.DataType.QUALITY_TAG);
    }

    context.ui().layermanager.on('tag', function (layerId, isDisplay) {

        var _type = layerId && layerId.type ? layerId.type : layerId,
            _display = layerId ? layerId.display : false;

        var layers = context.background().getLayers();
        layers.forEach(function (layer) {
            if (0 == layer.id.indexOf(_type)) {
                layer.visible = _display;
                context.background().layerVisible(_type, _display);
            }
        });
        if (_type == 'aboveGroundMap') {
            context.variable.isEditor = !_display;
            aboveGroundMapChange(_type, !_display);
        }

    })


    /*
       背景图层切换
   */

    context.ui().layermanager.on('background', function (layerId, isDisplay) {
        var _type = layerId && layerId.type ? layerId.type : layerId,
            _display = layerId ? layerId.display : false;

        if (!_display) {
            context.background().layerVisible(_type, false);
        } else {
            context.background().layerVisible(_type, true);
            var exclusiveIds = context.background().getOverlayLayers(_type).source().data().exclusiveIds;
            if (exclusiveIds) {
                exclusiveIds.forEach(function (id) {
                    context.background().layerVisible(id, false);
                })
            }
        }
        // if (_type == 'aboveGroundMap') {
        //     aboveGroundMapChange(_type, !_display);
        // }

    });

    /*
       数据图层状态变化
   */

    context.ui().layermanager.on('change', function (layerId, isDisplay) {
        if (!layerId || !layerId.layerIds) {
            return;
        }

        let editable = !layerId.editlock ? layerId.editable : false;
        let display = !layerId.displaylock ? layerId.display : false;
        let layerIds = layerId.layerIds;
        let models = layerId.models;
        let childLayers = [];
        if (layerIds.length) {
            for (var d = 0; d < layerIds.length; d++) {
                let layer = iD.Layers.getLayerById(layerIds[d]);
                layer && childLayers.push(layer);
            }
        }
        if (!childLayers.length) {
            console.log('没有找到对应矢量图层', layerId, layerIds);
        }
        childLayers.forEach(function (layer) {
            var model_editor = false;
            var model_display = false;
            for (var model in layer.models) {
                if (models.indexOf(model) > -1) {
                    layer.models[model].display = display;
                    layer.models[model].editable = editable;
                }
                if (layer.models[model].display) {
                    model_display = true;
                }
                if (layer.models[model].editable) {
                    model_editor = true;
                }
            }

            // 判断图层内的model是否存在变化：是则改变图层的属性，否则就不改变图层的属性
            if (!layer.displaylock && model_display) {
                layer.display = true;
            } else {
                layer.display = false;
            }
            if (model_editor) {
                layer.editable = true;
            } else {
                layer.editable = false;
            }

        });

        // context.enter(iD.modes.Browse(context));
        // dispatch.change(layerId);
    });

    /**
     * @description: 用来处理彩色激光正射图切换控制, 图层不显示，不能在地图上绘制编辑操作  这
     * @param {type} 
     * @return {type} 
     */
    function aboveGroundMapChange(layerId, isDisplay) {
        context.variable.aboveGround = isDisplay;
    }

    if (iD && iD.url && iD.url.getUrlParam) {
        var locateParam = iD.url.getUrlParam('locate', window.location.hash);
        locateParam && context.connection().on('loaded._context', function () {
            var locate = locateParam.split('|');
            var loc = locate[0];
            var modelName = locate[1];
            context.map().center(loc.split(','));
            var layer = iD.Layers.getLayersByModelName(modelName)[0];
            var eid = locate[2];
            if (!eid || !layer || !layer.hasModelEntity(modelName)) {
                return;
            }
            var entityid = iD.Entity.id.fromOSM(eid[0], iD.Entity.id.toOSM(eid), layer.id);
            if (!context.hasEntity(entityid)) {
                return;
            }

            context.enter(iD.modes.Select(context, [entityid], null, true)
                .suppressMenu(false)
                .newFeature(false));

            context.connection().on('loaded._context', null);
        });
    }

    //context.topoHandle=iD.topo.handle();//
    return d3.rebind(context, dispatch, 'on');
};
// 对外API事件统一处理
iD.Event = function (context) {
    var dispatch = d3.dispatch('lasso', 'click', 'hover', 'movestart', 'move', 'moveend', 'zoom',
        'savestart', 'saveend', 'dragbox', 'add',
        'drawoverlayers', 'polygonend', 'selected',
        'drawstart', 'drawing', 'draw',
        'openpanorama', 'closepanorama',
        'changelayer', 'changemap', 'mousedown', 'mouseup', 'mousemove',
        'openoverview', 'closeoverview', 'moveoverview',
        'openinfowindow', 'closeinfowindow', 'moveinfowindow', 'changeinfowindow',
        'dragstart', 'draging', 'dragend', 'entityedite', 'delete',
        'changeeffect', 'change_scene',
        'sys9_save', 'sys9_enter', 'picplayer_render',
        'pic_entity_change', 'buried', 'before_delete', 'track_highlight','full_featureEvent');
    function event() { }
    event.addEventDispatch = function (e, args) {
        !dispatch[e] && d3.addEventDispatch(dispatch, e);
        args && dispatch[e](args);
    };
    event.before_delete = function (args) {
        dispatch.before_delete(args);
    }
    event.removeEvent = function () {
    };
    event.mousedown = function (args) {
        dispatch.mousedown(args);
    }
    
    event.full_featureEvent = function (args) {
        dispatch.full_featureEvent(args);
    }
    
    event.mouseup = function (args) {
        dispatch.mouseup(args);
    }
    event.dragstart = function (args) {
        dispatch.dragstart(args);
    }
    event.draging = function (args) {
        dispatch.draging(args);
    }
    event.dragend = function (args) {
        dispatch.dragend(args);
    }

    event.delete = function (args) {
        dispatch.delete(args);
    }

    event.changemap = function (args) {
        dispatch.changemap(args);
    }
    event.mousemove = function (args) {
        dispatch.mousemove(args);
    }
    event.drawstart = function (args) {
        dispatch.drawstart(args);
    }
    event.drawing = function (args) {
        dispatch.drawing(args);
    }
    event.draw = function (args) {
        dispatch.draw(args);
    }

    event.polygonend = function (args) {
        dispatch.polygonend(args);
    }
    event.drawoverlayers = function (args) {
        dispatch.drawoverlayers(args);
    }
    event.lasso = function (args) {
        dispatch.lasso(args);
    }
    event.click = function (args) {
        dispatch.click(args);
    }
    event.hover = function (args) {
        dispatch.hover(args);
    }
    event.movestart = function (args) {
        dispatch.movestart(args);
    }
    event.move = function (args) {
        dispatch.move(args);
    }
    event.moveend = function (args) {
        dispatch.moveend(args);
    }
    event.zoom = function (args) {
        dispatch.zoom(args);
    }
    event.savestart = function (args) {
        dispatch.savestart(args);
    }
    event.saveend = function (args) {
        dispatch.saveend(args);
    }
    event.dragbox = function (args) {
        dispatch.dragbox(args);
    }
    event.add = function (args) {
        dispatch.add(args);
    }
    event.selected = function (args) {
        dispatch.selected(args);
    }
    //event.openpanorama = function(args)
    //{
    //   dispatch.openpanorama(args);
    //}
    //event.closepanorama = function(args)
    //{
    //   dispatch.closepanorama(args);
    //}
    event.changelayer = function (args) {
        dispatch.changelayer(args);
    }
    event.openoverview = function (args) {
        dispatch.openoverview(args);
    }
    event.closeoverview = function (args) {
        dispatch.closeoverview(args);
    }
    event.moveoverview = function (args) {
        dispatch.moveoverview(args);
    }
    event.openinfowindow = function (args) {
        dispatch.openinfowindow(args);
    }
    event.closeinfowindow = function (args) {
        dispatch.closeinfowindow(args);
    }
    event.entityedite = function (args) {
        dispatch.entityedite(args);
    }
    event.moveinfowindow = function (args) {
        dispatch.moveinfowindow(args);
    }
    event.changeinfowindow = function (args) {
        dispatch.changeinfowindow(args);
    }
    event.changeeffect = function (args) {
        dispatch.changeeffect(args);
    }
    event.track_highlight = function (args) {
        dispatch.track_highlight(args);
    }
    event.change_scene = function (args) {
        dispatch.change_scene(args);
    }
    event.pic_entity_change = function () {
        dispatch.pic_entity_change.apply(null, Array.prototype.slice.call(arguments));
    }
    event.buried = function (args) {
        dispatch.buried(args);
    }
    return d3.rebind(event, dispatch, 'on');
}



iD.data = {};
iD.data.presets = {};
iD.data.layers = [];
iD.version = '1.5.4';

;; (function () {
    var detected = {};

    var ua = navigator.userAgent,
        msie = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');

    if (msie.exec(ua) !== null) {
        var rv = parseFloat(RegExp.$1);
        detected.support = !(rv && rv < 9);
    } else {
        detected.support = true;
    }

    // Added due to incomplete svg style support. See #715
    detected.opera = ua.indexOf('Opera') >= 0;

    detected.locale = navigator.language || navigator.userLanguage;

    detected.filedrop = (window.FileReader && 'ondrop' in window);

    function nav(x) {
        return navigator.userAgent.indexOf(x) !== -1;
    }

    if (nav('Win')) detected.os = 'win';
    else if (nav('Mac')) detected.os = 'mac';
    else if (nav('X11')) detected.os = 'linux';
    else if (nav('Linux')) detected.os = 'linux';
    else detected.os = 'win';

    iD.detect = function () { return detected; };
})();
