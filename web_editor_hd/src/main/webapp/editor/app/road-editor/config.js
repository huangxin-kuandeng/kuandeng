/*
 * @Author: tao.w
 * @Date: 2019-08-26 11:44:59
 * @LastEditors: tao.w
 * @LastEditTime: 2021-06-25 14:12:10
 * @Description: 
 */
iD.url = iD.url || {};
var dataLayerIds = window.dataLayerIds = new Object();
iD.url.getURL = function () {
    // iD.config.URL会被/web-dev.json接口的配置替换
    return {
        // 前方交汇接口
        "forward_intersection": "http://192.168.5.32:20430/service/frontintersect",
        // 质检服务
        "kcs_edit": "http://192.168.5.34:33530/kcs-edit/",
        // 检查服务
        "kcs_schedule": "http://192.168.7.22:13570/kcs-schedule/",
        // 报表服务
        "kcs_report": "http://192.168.7.22:13550/kcs-report/",
        // OAuth登录
        "kd_auth_server": "http://192.168.5.34:33920/kd-auth-server/",
        // 存储服务
        "kds_data": "http://192.168.5.34:33210/kds-data/",
        // 标精存储服务
        "kds_data_sd": "http://192.168.7.24:13230/kds-data-v2-sd/",
        // 编辑器元数据
        "kds_meta": "http://192.168.5.34:33200/kds-meta/",
        // 标记 pg库
        "kds_tag": "http://192.168.5.34:33240/kds-tag/",
        // 标记 mongo库
        "kd_tag": "http://192.168.5.34:33130/kd-tag/",
        // 资料库
        "krs": "http://192.168.5.34:33100/krs/",
        // 任务管理系统
        "kts": "http://192.168.5.34:33300/kts/",

        "kts_muses": 'http://192.168.7.24:12300/',
        // 普通用户登录（旧版，已不用，使用OAuth）
        "kus": "http://192.168.5.34:33400/",
        // 前方交会服务（旧版、已不用）
        "zed_measure": "http://192.168.5.34:30310/",
        // 测量服务（路灯、路牌等）
        "measure": "http://192.168.5.34:9530/service/measure/",
        // 融合系统多批次请求
        "fusion": "http://192.168.5.34:33300/kts/task/serviceInfo",
        // 识别批次对比系统
        "compareRecog": "http://192.168.5.34:37510/recog-contrast/index.html",
        // hbase
        'hbase': 'http://192.168.8.16:9527/test/',

        'hbase_ply': 'http://192.168.8.17:39999/',

        'hbase_plys': 'http://192.168.8.17:39999/',

        'hbase_support': 'http://10.11.5.80/hbase-support/',
        // 查询设备
        'krms': 'http://192.168.7.22:14100/krms/',

        'haydn': 'http://192.168.7.22:18800/',

        'mre_fusion_task': 'http://192.168.7.26:20590/',

        // 'buried_point':'http://192.168.8.17:5999/',
        'buried_point': 'http://192.168.7.133:9522/',

        "mre75": "http://192.168.7.41:20590/", //轨迹点图层

        'multi_tiles': 'http://192.168.7.26:8889/tile?',

        // 'multi_tiles':'http://10.11.5.86:8889/tile?',

        // 'potree':' http://10.11.5.86:8889/potree?',
        'potree': 'http://192.168.7.26:8889/potree?',

        'file': 'http://tileserver.gzproduction.com/file?',

        'pavement_distrees_multi_tiles': 'http://192.168.7.26:8889/tile?',

        'pavement_distrees_potree': 'http://192.168.7.26:8889/potree?',

        'pavement_distrees_file': 'http://tileserver.gzproduction.com/file?',

        // 根据轨迹获取取图地址
        // "track_location": "http://192.168.8.10:1973/beijing/cache/query_list",
        "track_location": "",
        // 根据轨迹-轨迹点，获取mask识别结果
        "track_maskrcnn": "http://192.168.8.16:9527/test/",

        //点云地址
        "point_cloud": "http://192.168.8.16:9527/",
        // "point_cloud": "http://192.168.8.16:9527/file/400148953_20190429114716166/pointclouds/index/cloud.js",

        // 视频轨迹点取图地址：自定义地址，为空时使用配置的krs地址
        "track_image": null,
        "video_file": "http://10.11.5.88:8888/hls/production/track_video_compress/",
        "video_file_mp4": "http://10.11.5.88:8888/mp4/production/track_video_compress/",

        //心跳
        "khd_mg_dragger": "http://10.11.5.72:13600/khd-mg-dragger/",

        "track_image_guiyang_host": '10.11.5.248',
        "track_image_guiyang_hostlist": [
            'a.gzproduction.com',
            'b.gzproduction.com',
            'c.gzproduction.com',
            'd.gzproduction.com',
            'e.gzproduction.com'
        ],
        "track_image_beijing_host": '10.11.5.114',
        "track_image_beijing_hostlist": [
            'a.gzproduction.com',
            'b.gzproduction.com',
            'c.gzproduction.com',
            'd.gzproduction.com',
            'e.gzproduction.com'
        ],

        // 地图
        "kd_map": "http://mre-basemap-1.gzproduction.com/tile?mid=amap_road&f=png&scale=1&cache=true&p=2&x={x}&y={y}&z={z}",
        // 影像
        "kd_picture": "http://10.11.5.249:9572/tiles/a{u}.jpeg?g=587&mkt=en-gb&n=z",
        // mapbox
        "mapbox": "https://{switch:a,b,c,d}.tiles.mapbox.com/v4/digitalglobe.316c9a2e/{zoom}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqOGRmNXltOTBucm0yd3BtY3E5czl6NmYifQ.qJJsPgCjyzMCm3YG3YWQBQ",
        // google
        "google": "http://192.168.5.34:{switch:10001,10002,10003}/maps/vt?lyrs=s@802&gl=us&x={x}&y={y}&z={z}",
        // utm
        "utm_map": "http://mre.gzproduction.com/tile?mid=utm&f=png&scale=1&cache=false&z={z}&x={x}&y={y}&t=1531212822146",
        // 任务框
        "task_frame_map": "http://mre-v2.gzproduction.com/tile?lid=lane_line_merge&get=lane_line_merge&cache=off&businesstype=1&collectiontype=0&version=6&z={z}&x={x}&y={y}"
    }

}
/**
 * 底图URL配置
 */
iD.url.getBGURL = function () {
    return {
        // 地图
        "kd_map": "http://10.11.5.77:13340/tile?mid=basemap_day&get=map&cache=true&p=2&x={x}&y={y}&z={z}",
        // 影像
        // "kd_picture": "https://ecn.t{switch:0,1,2,3}.tiles.virtualearth.net/tiles/a{u}.jpeg?g=587&mkt=en-gb&n=z",
        "kd_picture": "http://10.11.5.249:9572/tiles/a{u}.jpeg?g=587&mkt=en-gb&n=z",
        // mapbox
        "mapbox": "https://{switch:a,b,c,d}.tiles.mapbox.com/v4/digitalglobe.316c9a2e/{zoom}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqOGRmNXltOTBucm0yd3BtY3E5czl6NmYifQ.qJJsPgCjyzMCm3YG3YWQBQ",
        // google
        // "google": "http://192.168.5.30:{switch:4006,4007,4008}/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}"
        "google": "http://192.168.5.34:{switch:10001,10002,10003}/maps/vt?lyrs=s@802&gl=us&x={x}&y={y}&z={z}"
    };
}


/**
 * 获取URL中的某一个参数，如果有重名，则会返回数组<br />
 * @param {String} key
 * @param {String} url
 * @param {Boolean} toDecode
 */
iD.url.getUrlParam = function (key, url, toDecode) {
    var json = iD.url.urlParamMap(url, toDecode);

    return json.search[key] || "";
};

/**
 * 将URL中的hash或param封装为Json
 * @param {String} url 指定的URL
 * @param {Boolean} toDecode 是否执行decodeURIComponent
 */
iD.url.urlParamMap = function (url, toDecode) {
    url = url || window.location.href;
    var result = {
        param: {},
        hash: {},
        search: {}
    };
    var rst = url.split(/(\?|#)/);
    if (url.indexOf("?") > -1) {
        _fillMap(rst[2], "param");
        _fillMap(rst[4], "hash");
    } else if (url.indexOf("#") > -1) {
        _fillMap(rst[2], "hash");
    }
    var searchParam = (rst[2] || "") + "&" + (rst[4] || "");
    _fillMap(searchParam, "search");

    function _fillMap(kvStr, type) {
        if (!kvStr) {
            return;
        }
        var kvArr = kvStr.split("&");
        var dataObj = result[type];
        for (var i in kvArr) {
            var item = kvArr[i].split("=");
            if (!item || item.length != 2) {
                continue;
            }
            if (item[1] != null && toDecode) {
                item[1] = decodeURIComponent(item[1]);
            }

            var oldVal = dataObj[item[0]];
            if (oldVal && typeof oldVal === "string") {
                var narr = dataObj[item[0]] = [];
                narr.push(oldVal);
                narr.push(item[1]);
            } else if (oldVal && oldVal instanceof Array) {
                oldVal.push(item[1]);
            } else {
                dataObj[item[0]] = item[1];
            }

        }
    }

    return result;
}

;;
(function () {
    iD.util.parse2SystypeParam();
})();


iD.queryUserId = 1; //1 采集 2 编辑
iD.config = { //系统配置
    URL: iD.url.getURL(),
    BG_URL: iD.url.getBGURL(),
    layers: [], //当前图层
    updateConfigUrl: function (urlObj) {
        // 特殊处理、数组格式
        _.forEach([
            'track_image_guiyang_hostlist',
            'track_image_beijing_hostlist'
        ], function (k) {
            let v = urlObj[k] || [];
            if (!Array.isArray(v)) {
                v = v.split(',');
            }
            urlObj[k] = v;
        });
        Object.assign(iD.config.URL, urlObj);
        var trackImg = iD.config.URL.track_image;
        trackImg = typeof trackImg !== "string" ? "" : trackImg;
        if (trackImg.trim() == "") {
            iD.config.URL.track_image = iD.config.URL.krs;
        }
    },
    //TODO 废属性需要删除
    allLayerIds: [], //所有图层ID
    taskBatch: [],
    batchDbCode: {},
    // 轨迹-识别批次，只有视频中使用
    trackBatchMap: {},
    // sourceStorageType: {},
    //----v2
    taskVersionInfos: [],

    /**
     * 是否为当前任务批次，排除来源层/对比层；
     * @param {String} batch
     */
    isOwnBatch: function (batch) {
        if (!batch) return false;
        var flag = true;
        if (iD.Task.d.tags.compareBatch) {
            flag = iD.Task.d.tags.compareBatch != batch;
        }
        if (!flag) return flag;
        if (iD.Task.d.tags.multiSourceBatchs) {
            var batchs = iD.Task.d.tags.multiSourceBatchs.split(',');
            flag = batchs.indexOf(batch) == -1;
        }
        return flag;
    },
    getOwnBatchs: function () {
        var self = this;
        return self.taskBatch.filter(function (batch) {
            return self.isOwnBatch(batch);
        });
    },
    isMultiBatchesMode: function () {
        var ownBatchs = this.getOwnBatchs();
        // 历史任务时
        // 自动化任务为多批次逻辑（查询限制批次数据，保存带批次）；
        // 融合任务不是多批次逻辑（读取到单个批次时查询数据不限制批次，读取到多个批次时限制批次，保存带批次）；
        if (iD.util.urlParamHistory()) {
            //  && ownBatchs.length > 0
            if (iD.Task.d.tags.dbCode == 'auto') {
                return true;
            }
            if (iD.Task.d.tags.dbCode == 'fusion' && ownBatchs.length > 1) {
                return true;
            }
        } else if (iD.User.isMultiBatchesRole()) {
            return true;
        }
        return false;
    },
    getBboxUrl: function (taskKey) {
        let baseServer = iD.config.URL.kds_data;
        if (iD.Task.isSdTask()) {
            baseServer = iD.config.URL.kds_data_sd;
        }
        return baseServer + 'data/bbox?keys=' + taskKey;
    },
    getQueryUrl: function (taskKey) {
        let baseServer = iD.config.URL.kds_data;
        if (iD.Task.isSdTask()) {
            baseServer = iD.config.URL.kds_data_sd;
        }
        let url = baseServer + 'data/' + taskKey + '?';
        if (iD.Task.d.tags.processDefinitionKey == 'PavementDisease' || iD.Task.d.tags.branchDataType == '3') {
            url += 'namespace=road-detection&';
        }
        return url;
    },
    createDataLayer: function (element, models, mainModel, opts = {}) {
        let version = element.versionInfo;
        let taskKey = version && version.taskKey || '';
        // let batch = element.batch ? element.batch : '';
        // let batchVal = batch.replace(/-/g, '_');
        let isSourceLayer = version && version.isSource || false;
        let isTagModel = opts.isTag instanceof Function ? opts.isTag(mainModel) : opts.isTag;
        let isBboxUrl = opts.isBbox;
        // 加载数据时，根据models过滤（只有接边使用）
        let loadFilterByModel = opts.loadFilterByModel || false;

        var url = '';
        if (opts.url) {
            url = typeof opts.url == 'string' ? opts.url : opts.url(mainModel, taskKey, isTagModel);
        } else {
            url = isBboxUrl ? this.getBboxUrl(taskKey) : this.getQueryUrl(taskKey);
        }
        if (!isTagModel && isSourceLayer) {
            opts.filterParam = null;
            url = this.getQueryUrl(taskKey);
            isBboxUrl = false;
        }
        let identifier = ''
        if (element.versionInfo && (element.versionInfo.isEdge || element.versionInfo.isSource || element.versionInfo.iscomparative)) {
            identifier = element.layerId;
        }
        let layer = new DataLayer({
            id: element.layerId,
            identifier: identifier,
            editable: element.editable,
            display: element.display,
            type: "line",
            defaultColor: element.defaultColor,
            useEditColor: element.useEditColor,
            tagReadOnly: element.tagReadOnly,
            models,
            url: url,
            filterParam: opts.filterParam,
            isBbox: isBboxUrl,
            label: {
                display: false
            },
            versionInfo: version,
            loadFilterByModel: loadFilterByModel
        });
        iD.util.setLayerLabelField(layer);
        // dataLayers.push(layer);
        return layer;
    },
    // createDataLayer: function (element, models, mainModel, opts = {}) {
    //     let version = element.versionInfo;
    //     let taskKey = version && version.taskKey || '';
    //     // let batch = element.batch ? element.batch : '';
    //     // let batchVal = batch.replace(/-/g, '_');
    //     let isSourceLayer = version && version.isSource || false;
    //     let isTagModel = opts.isTag instanceof Function ? opts.isTag(mainModel) : opts.isTag;
    //     let isBboxUrl = opts.isBbox;
    //     // 加载数据时，根据models过滤（只有接边使用）
    //     let loadFilterByModel = opts.loadFilterByModel || false;

    //     var url = '';
    //     if (opts.url) {
    //         url = typeof opts.url == 'string' ? opts.url : opts.url(mainModel, taskKey, isTagModel);
    //     } else {
    //         url = isBboxUrl ? this.getBboxUrl(taskKey) : this.getQueryUrl(taskKey);
    //     }
    //     if (!isTagModel && isSourceLayer) {
    //         opts.filterParam = null;
    //         url = this.getQueryUrl(taskKey);
    //         isBboxUrl = false;
    //     }
    //     let identifier = ''
    //     if (element.versionInfo && (element.versionInfo.isEdge || element.versionInfo.isSource || element.versionInfo.iscomparative)) {
    //         identifier = element.layerId;
    //     }
    //     let layer = new DataLayer({
    //         id: element.layerId,
    //         identifier: identifier,
    //         editable: element.editable,
    //         display: element.display,
    //         type: "line",
    //         defaultColor: element.defaultColor,
    //         useEditColor: element.useEditColor,
    //         tagReadOnly: element.tagReadOnly,
    //         models,
    //         url: url,
    //         filterParam: opts.filterParam,
    //         isBbox: isBboxUrl,
    //         label: {
    //             display: false
    //         },
    //         versionInfo: version,
    //         loadFilterByModel: loadFilterByModel
    //     });
    //     iD.util.setLayerLabelField(layer);
    //     // dataLayers.push(layer);
    //     return layer;
    // },


    resetDataLayer: function () {
        function createLayer(lays) {
            let arr = [];
            for (let i = 0; i < lays.length; i++) {
                let lay = lays[i];
                let layer = new DataLayer({
                    id: lay.id,
                    identifier: lay.identifier,
                    editable: lay.editable,
                    display: lay.display,
                    type: lay.type,
                    style: lay.style,
                    // defaultColor: element.defaultColor,
                    // useEditColor: element.useEditColor,
                    // tagReadOnly: element.tagReadOnly,
                    models: lay.models,
                    url: lay.url,
                    isBbox: lay.isBbox
                });
                arr.push(layer)
            }
            return arr;
        }

        //清除查看检查报告标注点
        if (editor.context.reportFormMarkers && editor.context.reportFormMarkers.length) {
            for (var i in editor.context.reportFormMarkers) {
                editor.context.map().removeOverlays(editor.context.reportFormMarkers[i]);
            }
            editor.context.reportFormMarkers = [];
            editor.context.enter(iD.modes.Browse(editor.context));
        }


        let layers = [];
        editor.removeALLDataLayer();

        iD._taskLayer.forEach(d => {
            var lays = createLayer(d.layers);
            layers.push(...lays);
        })
        layers.forEach(l => {
            let _modelEntitys = {};
            for (let mname in l.models) {
                _modelEntitys[mname] = iD.ModelEntitys[mname];
            }
            l._modelEntity = _modelEntitys;
        })
        editor.addDataLayer(layers);
    },


    //多版本问题需要 需要重新加载矢量数据
    // resetDataLayer: function () {
    //     var self = this;
    //     //清除查看检查报告标注点
    //     if (editor.context.reportFormMarkers && editor.context.reportFormMarkers.length) {
    //         for (var i in editor.context.reportFormMarkers) {
    //             editor.context.map().removeOverlays(editor.context.reportFormMarkers[i]);
    //         }
    //         editor.context.reportFormMarkers = [];
    //         editor.context.enter(iD.modes.Browse(editor.context));
    //     }

    //     let mainMode = iD.data.DataType.ROAD;

    //     let layers = [];
    //     // if(window._systemType ==2)
    //     iD.config.layers = [];
    //     editor.removeALLDataLayer();

    //     mainMode = iD.data.DataType.DIVIDER;
    //     var elements = iD.Static.layersInfo.getElements();

    //     ////////Tilden
    //     if (elements) {
    //         for (let e in elements) {
    //             let element = elements[e];
    //             if (element.versionInfo) {
    //                 var modelsconfig = self.getModelsConfig(element, mainMode, element.versionInfo);
    //                 var layer = iD.config.createDataLayer(element, modelsconfig, mainMode, {
    //                     isBbox: false,
    //                     loadFilterByModel: element.versionInfo.isEdge
    //                 });
    //                 updateEditLock(layer);
    //                 layers.push(layer);
    //             } else {
    //                 var modelName = element.children[0];
    //                 var modelsObj = self.getModelsData(element, element.children || []);
    //                 // var layerId = element.layerId;
    //                 var layer = iD.config.createDataLayer(element, modelsObj, modelName, {
    //                     isTag: isTagModel(modelName),
    //                     isBbox: tagBbox(modelName),
    //                     url: tagUrl(element),
    //                     filterParam: tagFilterParam
    //                 });
    //                 layers.push(layer);
    //             }
    //         };
    //     }

    //     function tagFilterParam(layer) {
    //         var params = {};
    //         if (!layer.hasModelEntity) {
    //             return params;
    //         }
    //         let task = iD.Task.d;
    //         if (layer.hasModelEntity(iD.data.DataType.AUTO_CHECKWORK_TAG)) {
    //             var result = [];
    //             var projectId = iD.Task.d.tags.projectId;
    //             projectId = projectId != null ? projectId : '';
    //             // 只查询STATE!=close
    //             // TAGTYPE=2 人工
    //             result = [{
    //                 k: 'STATE',
    //                 op: 'neq',
    //                 v: '2'
    //             }, {
    //                 k: 'PROJECTID',
    //                 op: 'eq',
    //                 v: projectId + ''
    //             }, {
    //                 k: 'TAGTYPE',
    //                 op: 'eq',
    //                 v: '2'
    //             }];
    //             if (iD.Task.d.tags.dbCode != 'auto') {
    //                 result.push({
    //                     k: 'FUSIONTASKID',
    //                     op: 'eq',
    //                     v: iD.Task.d.task_id + ''
    //                 });
    //             } else {
    //                 result.push({
    //                     k: 'AUTOTASKID',
    //                     op: 'eq',
    //                     v: iD.Task.d.task_id + ''
    //                 });
    //             }
    //             params.tagsJson = JSON.stringify(result);
    //         } else if (layer.hasModelEntity(iD.data.DataType.COMPILE_CHECK_TAG)) {
    //             var result = [{
    //                 k: 'PROJECTID',
    //                 op: 'eq',
    //                 v: (iD.Task.d.tags.compileProjectId || '') + ''
    //             }, {
    //                 k: 'TASKID',
    //                 op: 'eq',
    //                 v: (iD.Task.d.tags.fusionTaskId || '') + ''
    //             }, {
    //                 k: 'STATE',
    //                 op: 'eq',
    //                 v: '0'
    //             }];
    //             params.tagsJson = JSON.stringify(result);
    //         } else if (layer.hasModelEntity(iD.data.DataType.AUTO_NETWORK_TAG)) {
    //             var result = [{
    //                 k: 'TASKID',
    //                 op: 'eq',
    //                 v: iD.Task.d.task_id || '' + ''
    //             }];
    //             params.tagsJson = JSON.stringify(result);
    //         } else if (layer.hasModelEntity(iD.data.DataType.QUALITY_TAG) || layer.hasModelEntity(iD.data.DataType.ACCURACY_TAG)) {
    //             var result = [{
    //                 k: 'TASK_ID',
    //                 op: 'eq',
    //                 v: iD.Task.d.task_id + ''
    //             }];
    //             //很奇怪的需求， 不看自己的标要看别的任务的标
    //             if (task.tags.type == 'multi_track_lane') {
    //                 result = [{
    //                     k: 'TASK_ID',
    //                     op: 'eq',
    //                     v: iD.Task.d.tags.trackEpilineCheck + ''
    //                 }];
    //             }
    //             params.tagsJson = JSON.stringify(result);
    //         } else {
    //             var result = [{
    //                 k: 'TASKID',
    //                 op: 'eq',
    //                 v: iD.Task.d.task_id + ''
    //             }];
    //             params.tagsJson = JSON.stringify(result);
    //         }

    //         for (let k in params) {
    //             params[k] = encodeURIComponent(params[k]);
    //         }
    //         return params;
    //     }


    //     function tagBbox(modelName) {
    //         if (modelName == iD.data.DataType.DEFAULT) {
    //             return true;
    //         }
    //         return false;
    //     }

    //     function tagUrl(element) {
    //         var modelName = element.children[0];
    //         if (modelName == iD.data.DataType.POINT_TAG) {
    //             modelName = iD.data.DataType.NETWORK_TAG;
    //         }
    //         var dataUrl = iD.config.URL.kd_tag + 'tag/osm/' + modelName + '/query?';
    //         return dataUrl;
    //     }


    //     function isTagModel(mname) {
    //         var tagModels = [
    //             iD.data.DataType.ACCURACY_TAG,
    //             iD.data.DataType.QUALITY_TAG,
    //             iD.data.DataType.IMAGE_TAG,
    //             iD.data.DataType.ANALYSIS_TAG,
    //             iD.data.DataType.QUESTION_TAG,
    //             iD.data.DataType.AUTO_NETWORK_TAG,
    //             iD.data.DataType.AUTO_CHECKWORK_TAG,
    //             iD.data.DataType.COMPILE_CHECK_TAG,
    //             iD.data.DataType.PICK_MARK_TAG
    //         ];
    //         return tagModels.includes(mname);
    //     }

    //     function updateEditLock(layer) {
    //         if (!iD.User.isLinearRole()) {
    //             return;
    //         }
    //         // 车道线作业/车道线质检角色，只能编辑DIVIDER
    //         for (let modelName in layer.models.datas) {
    //             // 20181101 线性编辑允许编辑DA -@lixiaoguang
    //             if (!_.include([
    //                 iD.data.DataType.DIVIDER,
    //                 iD.data.DataType.DIVIDER_NODE,
    //                 iD.data.DataType.R_DIVIDER_DREF,
    //                 iD.data.DataType.DIVIDER_ATTRIBUTE
    //             ], modelName)) {
    //                 layer.models.datas[modelName].editable = undefined;
    //                 layer.models.datas[modelName].editlock = true;
    //             }
    //         }
    //     }

    //     layers.forEach(l => {
    //         let _modelEntitys = {};
    //         for (let mname in l.models.datas) {
    //             _modelEntitys[mname] = iD.ModelEntitys[mname];
    //         }
    //         l._modelEntity = _modelEntitys;
    //     })
    //     editor.addDataLayer(layers);
    // },
    /*
     * 获取模型配置对象数组
     * */
    getModelsConfig: function (element, type, version) {
        let models = [],
            context = editor.context,
            self = this
        layerType = version.layer;
        // v2根据layerType确定使用的模型列表；
        if (layerType) {
            layerType = layerType.replace(/-/g, '_');
            models = iD.data.LayerDataType[layerType] || [];
        }
        // if (version.isEdge && layerType == 'lane') {
        //     // 接边key特殊，只能查询、编辑车道线
        //     models = iD.data.edgeLayerDataType[layerType] || [];
        // }
        //要素编辑权限,用于显示
        if (type == iD.data.DataType.DIVIDER && !models.length) {
            if (context.variable.edit.editDivider && context.variable.edit.editOther) {
                models = iD.Static.fusionModels;
            } else if (context.variable.edit.editDivider) {
                models = iD.data.sceneDataType.HD_DATA_LANE;
            } else if (context.variable.edit.editOther) {
                models = iD.data.sceneDataType.HD_DATA_LO;
            }
        }

        return self.getModelsData(element, models);
    },
    /**
     * 生成最新models对象  20180712
     * @param {Array} modelNames
     * @param {Array} picDatas 视频按钮常量配置
     */
    getModelsData: function (element, modelNames) {
        var result = {
            datas: {}
        };
        _.each(modelNames, function (mname) {
            result.datas[mname] = {
                display: element.display == undefined ? false : element.display,
                editable: element.editable == undefined ? false : element.editable,
                editlock: false
            };
        });
        return result;
    },


    // 加载任务版本信息
    loadTaskVersionInfo: async function (task) {
        var self = this;
        var versions = self.taskVersionInfos = [];

        // 当前任务获取对应版本信息
        // var url = iD.config.URL.kts + "task/layer/findFullLayersByTaskId?taskId=" + task.task_id;
        // d3.json(url).get((error, _data) => {
        //     var res = _data && _data.result || {};
        // });
        return new Promise((resolve, reject) => {
            var res = task.layers || [];
            let mainLayers = [],
                edgeLayers = [],
                comparativeLayers = [],
                sourceLayers = [];

            for (let d of res) {
                mainLayers.push({
                    taskId: d.taskId,
                    layer: d.layer,
                    type: d.layer,
                    taskKey: d.taskKey
                });
                versions.push({
                    taskId: d.taskId,
                    dataVersion: d.dataVersion,
                    layer: d.layer,
                    taskKey: d.taskKey,
                    isSource: false,
                    iscomparative: false,
                    isEdge: false
                });
            }

            // 接边，辅边框数据
            if (task.edgeLayers) {
                (task.edgeLayers || []).forEach(function (d) {
                    edgeLayers.push({
                        taskId: d.taskId,
                        layer: d.layer,
                        type: d.layer,
                        taskKey: d.taskKey
                    })
                    versions.push({
                        taskId: d.taskId,
                        dataVersion: d.dataVersion,
                        layer: d.layer,
                        taskKey: d.taskKey,
                        isSource: false,
                        iscomparative: false,
                        isEdge: true
                    });
                });
            }

            if (task.tags.multiSourceTaskIds) {
                var staskids = task.tags.multiSourceTaskIds.split(",");
                var scodes = (task.tags.multiSourceKeys || "").split(",");
                staskids.forEach(function (tid, idx) {
                    let taskkey = scodes[idx];
                    let taskKeys = taskkey.split('_');
                    let num = _.last(taskKeys);
                    let key = taskKeys[0]
                    num = isNaN(num) ? '' : Number(num);
                    // 来源层为自动化
                    sourceLayers.push({
                        taskId: tid,
                        layer: key,
                        type: key,
                        taskKey: taskkey
                    });
                    versions.push({
                        taskId: tid,
                        dataVersion: num,
                        layer: 'lane',
                        taskKey: taskkey,
                        isSource: true,
                        iscomparative: false,
                        isEdge: false
                    });
                });
            }
            if (task.tags.comparativeBranchkeys) {
                var comparatives = JSON.parse(task.tags.comparativeBranchkeys);
                comparatives.forEach(function (comparative, idx) {
                    let key = comparative.key;
                    let num = _.last(key.split('_'));
                    num = isNaN(num) ? '' : Number(num);
                    comparativeLayers.push({
                        taskId: key,
                        layer: comparative.layer,
                        type: comparative.layer,
                        taskKey: key
                    })
                    // 来源层为自动化
                    versions.push({
                        taskId: key,
                        dataVersion: num,
                        layer: comparative.layer,
                        taskKey: key,
                        isSource: false,
                        iscomparative: true,
                        isEdge: false
                    });
                });
            }

            const _tagTemplate = [{
                    "layer": "question_tag",
                    "type": "question_tag",
                    "taskKey": "QUESTION_TAG"
                },
                {
                    "layer": "pick_mark_tag",
                    "type": "pick_mark_tag",
                    "taskKey": "PICK_MARK_TAG"
                },
                {
                    "layer": "quality_tag",
                    "type": "quality_tag",
                    "taskKey": "QUALITY_TAG"
                },
                {
                    "layer": "accuracy_tag",
                    "type": "accuracy_tag",
                    "taskKey": "ACCURACY_TAG"
                }
            ]
            let tag = {
                type: 'tag',
                layers: iD.Template.buildTagLayerConfiguration(_tagTemplate, false, false,task)
            };
            let dl = {
                type: 'main',
                layers: iD.Template.buildDataLayerConfiguration(mainLayers, false, false,task)
            };
            let sl = {
                type: 'source',
                layers: iD.Template.buildDataLayerConfiguration(sourceLayers, false, false,task)
            };
            let el = {
                type: 'edge',
                layers: iD.Template.buildDataLayerConfiguration(edgeLayers, false, false,task)
            };
            let cl = {
                type: 'comparative',
                layers: iD.Template.buildDataLayerConfiguration(comparativeLayers, false, false,task)
            }
            iD._taskLayer = [dl, sl, el, cl].filter(d => {
                return d.layers.length
            });
            iD._taskLayer.push(tag);

            let uiConfiguration = iD.Template.buildUIConfiguration(iD._taskLayer);

            self._loadTrackBatch(function () {
                resolve(uiConfiguration);
            });
        });

    },

    _loadTrackBatch: function (callback) {
        var self = this;
        callback = callback || _.noop;
        // self.sourceStorageType = {};

        // 只获取识别批次
        // var p1 = new Promise(function (resolve) {
        //     var url = iD.config.URL.kts + 'task/findByIds';
        //     var taskIds = iD.Task.d.tags.multiSourceTaskIds;
        //     if (!taskIds) {
        //         resolve();
        //         return;
        //     }
        //     taskIds = taskIds.split(',');
        //     if (_.isEmpty(taskIds)) {
        //         resolve();
        //         return
        //     }
        //     var ids = 'ids=' + taskIds.join(',');
        //     d3.json(url)
        //         .header("Content-Type", "application/x-www-form-urlencoded")
        //         .post(ids, function (error, data) {
        //             // var result = data.result;
        //             // Object.values(result).map(d => {
        //             //     var storageType = 'pg';
        //             //     var obj = d.tags.find((n) => n.k == "storageType");
        //             //     if (obj && obj.v != null) {
        //             //         storageType = obj.v;
        //             //     }
        //             //     self.sourceStorageType[d.id] = storageType;
        //             // })
        //             resolve();
        //         })
        // });

        //当前任务来源任务的识别批次+轨迹信息；
        var p2 = new Promise(function (resolve) {
            let projectId =  (iD.Task.d.tags.fusionProjectId || iD.Task.d.tags.projectId); // iD.Task.d.tags.projectId;
            var url = iD.config.URL.kts_muses + 'muses/project/detail?id=' + projectId;
            if (!projectId) {
                console.error('轨迹批次查询，没有项目参数无法查询');
                resolve();
                return;
            }
            d3.json(url).get((error, data) => {
                let result = data.result || '';
                let tags = result.tags || '';
                let str = tags.metaData || '';
                if (!str || error) {
                    resolve();
                    console.error('轨迹批次查询，结果错误');
                    return;
                }
                let k = data.result.tags.taskFrameIds;
                let metaData = JSON.parse(str);
                let infos = metaData[k];
                var map = self.trackBatchMap;
                let taskTrack = [];
                _.forEach(infos, (v, k) => {
                    map[k] = {
                        half_recognition: v.half_recognition,
                        full_recognition: v.full_recognition,
                        kieVersion: v['version·kie·kd_inertial_explorer']
                    }
                    taskTrack.push({
                        trackId: k,
                        kieVersion: v['version·kie·kd_inertial_explorer'] || iD.Task.d.tags.kieVersion
                    })
                })

                iD.Task.d._taskTrack = taskTrack;
                // if (tags.hasOwnProperty('kieVersion')) {
                //     iD.Task.d.tags.kieVersion = tags.kieVersion;
                // }

                resolve();
            })
        });

        // Promise.all([p1, p2]).then(function (d) {
        Promise.all([p2]).then(function (d) {
            callback();
        }).catch((error) => {
            console.error(error);
        });
    },
    loadLayers: function (callback) {
        var systemType = iD.util.urlParamSystemType() ? iD.util.urlParamSystemType() * 1 : '';
        // 母库
        //      var currentInstance = 'EDIT';
        var currentInstance = 'FRUIT';
        // 融合库
        if (_isInstance || iD.User.isFusionRole()) {
            //          currentInstance = 'FUSION';
            currentInstance = 'FRUIT';
        } else if (window._systemType == 4) {
            currentInstance = 'sdEdit';
        }
        var errMsg = [];
        url = iD.config.URL.kds_meta + 'meta/app/instance/current/' + currentInstance + '?callback={callback}';
        d3.jsonp(url, function (d) {
            if (!d || d.code != '0' || !d.result || !d.result.layers.length) {
                Dialog.alert("模型加载失败<br/>" + (d && d.message || ""));
                console.log('模型加载失败', d && d.message || "");
                window._instanceId = 0;
                callback([]);
                return;
            }
            window._instanceId = d.result.id;

            // 加载单独模型
            // 质检打标
            var promise1 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/QUALITY_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.QUALITY_TAG));
                });
            });
            // var promise2 = new Promise(function (resolve) {
            //     var url = iD.config.URL.kds_meta + 'meta/app/instance/current/ACCURACY_TAG?callback={callback}';
            //     d3.jsonp(url, function (data) {
            //         resolve(_parseLayers(data, iD.data.DataType.ACCURACY_TAG));
            //     });
            // });

            // 调试数据标
            var promise3 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/DEV_DATA?callback={callback}';

                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.ANALYSIS_TAG));
                });
            });

            // 问题记录打标
            var promise4 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/questiontag?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.QUESTION_TAG));
                });
            });
            // 自动组网标记
            /*var promise5 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/AUTO_NETWORK_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.AUTO_NETWORK_TAG));
                });
            });
            // 精度质检标记
            var promise6 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/AUTO_CHECKWORK_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.AUTO_CHECKWORK_TAG));
                });
            });

            // 母库编译检查标注
            var promise7 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/COMPILE_CHECK_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.COMPILE_CHECK_TAG));
                });
            });

            // 组网完备检查标
            var promise8 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/AUTO_COMPLETECHECK_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.AUTO_COMPLETECHECK_TAG));
                });
            });

            // 数据更新标记
            var promise9 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/NETWORK_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.NETWORK_TAG));
                });
            });*/

            // 加载单独模型
            // 图像标记
            var promise10 = new Promise(function (resolve) {
                var url = iD.config.URL.kds_meta + 'meta/app/instance/current/PICK_MARK_TAG?callback={callback}';
                d3.jsonp(url, function (data) {
                    resolve(_parseLayers(data, iD.data.DataType.PICK_MARK_TAG));
                });
            });

            Promise.all([promise1, promise4, promise10, promise3, /*promise6, promise7, promise8, promise9*/ ]).then(function (dataList) {
                /*
                if(errMsg.length){
                    Dialog.alert('模型加载失败：<br/>'+errMsg.join('<br/>'));
                }
                */
                var allLayers = d.result.layers || [];
                allLayers.push(..._.flatten(dataList));
                var result = _createModelEntitys(allLayers);
                callback(result);
            });
        });

        function _parseLayers(data, modelName) {
            var result = [];
            if (data && data.code == '0' && data.result && data.result.layers) {
                result = data.result.layers || [];
            }
            if (!result.length || !data || data.code != '0') {
                var msg = (modelName || '') + ' ' + (data && data.message || '初始化失败');
                errMsg.push(msg);
            }
            return result;
        }

        var _fieldModelMap = {
            [iD.data.DataType.AUTO_NETWORK_TAG]: {
                hidden: [
                    'NODEID',
                    'EDITBY'
                ],
                readonly: [
                    'TASKID',
                    'CREATETIME'
                ]
            }
        };

        function updateFieldStatus(modelName, field) {
            var filterStatus = _fieldModelMap[modelName];
            if (!filterStatus) return;
            var _hiddens = filterStatus.hidden;
            var _readonlys = filterStatus.readonly;

            field.display = '1';
            field.readOnly = '0';
            var fname = field.fieldName.toUpperCase();
            if (_hiddens.indexOf(fname) > -1) field.display = '0';
            if (_readonlys.indexOf(fname) > -1) field.readOnly = '1';
        }

        /* 关联与之对应的子集 */
        function updateFieldChild(fieldValueIds, fields) {
            let childrens = [];
            for (let l = 0; l < fields.length; l++) {
                let parentType = false;
                if (fields[l].fieldInput == 'select') {
                    let childValues = fields[l].fieldType.fieldTypeValues;
                    for (let child of childValues) {
                        if (child.parentId && _.include(fieldValueIds, child.parentId)) {
                            parentType = true;
                            break;
                        }
                    }
                }
                parentType && childrens.push(fields[l].fieldName);
            }

            return childrens;
        }

        function _createModelEntitys(layers) {

            layers = layers || [];
            // let layer;
            let geoType;
            let modelEntity;
            let result = [];

            var isLineWorker = iD.User.isLineWorkRole();
            var isLineChecker = iD.User.isLineCheckRole();

            //XXX: 三层循环需要改进
            // 初始化iD.ModelEntitys，用于描述表中的模型字段
            for (var i = 0, len = layers.length; i < len; i++) {
                var modelName = layers[i].model.modelName;
                if (iD.ModelEntitys[modelName]) {
                    continue;
                }
                // 车道线编辑/车道线质检
                // 除了DIVIDER以外都是只读属性，问题记录标记、质检标记允许质检时修改；
                // 20181101 线性编辑允许编辑DA -@lixiaoguang
                var fieldReadOnly = undefined;
                if (isLineWorker || isLineChecker) {
                    if (_.include([
                            iD.data.DataType.DIVIDER,
                            iD.data.DataType.DIVIDER_NODE,
                            iD.data.DataType.DIVIDER_ATTRIBUTE
                        ], modelName)) {
                        fieldReadOnly = !isLineWorker;
                    } else if (_.include([
                            iD.data.DataType.QUALITY_TAG,
                            iD.data.DataType.ACCURACY_TAG,
                            iD.data.DataType.QUESTION_TAG
                        ], modelName)) {
                        // 标记相关不受车道线作业员影响；
                        //      				fieldReadOnly = !isLineChecker;
                    } else {
                        fieldReadOnly = true;
                    }
                }

                modelEntity = new iD.ModelEntity();
                //XXX: 这个赋值我也没搞懂geoType 为什么赋modelId
                geoType = layers[i].modelId;

                modelEntity.setGeoType(parseInt(geoType, 10));
                modelEntity.type(layers[i].model.geoType);
                modelEntity.modelName(modelName);
                modelEntity.layerId(layers[i].id)
                let fields = layers[i].model.fields;

                //XXX: 延用以前设计，需要改进
                result.push({
                    layerId: layers[i].id,
                    layerName: modelName,
                    layerSn: modelName
                });
                dataLayerIds[modelName] = layers[i].id;
                for (let field_index = 0, field_len = fields.length; field_index < field_len; field_index++) {
                    let fieldObj = {};
                    fieldObj.selectGroup = {};
                    fieldObj.childGroup = [];
                    let filed = fields[field_index];
                    fieldObj.geoType = geoType;
                    Object.assign(fieldObj, fields[field_index]);
                    if (fieldObj.fieldInput === 'select') {
                        fieldObj.fieldInput = {};
                        fieldObj.fieldInput.type = 'select';
                        if (systemType == 4 && modelName == iD.data.DataType.POI) {
                            // 三级联动的selects
                            if (fieldObj.fieldName == 'POI_TYPE') {
                                fieldObj.fieldInput.type = 'mulselect';
                            }
                        }
                        //定义级联菜单(Tilden)
                        if ([
                                iD.data.DataType.OBJECT_PL,
                                iD.data.DataType.OBJECT_PG,
                                iD.data.DataType.OBJECT_PT,
                                iD.data.DataType.PAVEMENT_DISTRESS,
                                iD.data.DataType.PAVEMENT_DISTRESS_PL,
                                iD.data.DataType.ROAD_ATTRIBUTE,
                                iD.data.DataType.TRAFFICSIGN
                            ].includes(modelName)) {
                            if (fieldObj.fieldName == 'TYPE') {
                                // fieldObj.fieldInput.type = "selectgroup";
                            }
                        }

                        let fvalues = [];
                        let parentIds = [];
                        let subType = {};
                        let fieldValueIds = [];
                        let fieldTypeValues = filed.fieldType.fieldTypeValues;

                        for (let _valueObj of fieldTypeValues) {
                            fieldValueIds.push(_valueObj.id);
                            fvalues.push({
                                name: _valueObj.name,
                                value: _valueObj.value,
                                parentId: _valueObj.parentId,
                                id: _valueObj.id
                            });
                            /*if (_valueObj.parentId) {
                                //subType.value = _valueObj.value;
                                //subType.parentId = _valueObj.parentId;
                            //}
                            //if (fieldObj.fieldName == "TYPE") {
                                //parentIds.push(_valueObj.id);
//                          }
//                          if(_valueObj.parentId || parentIds.length > 0) {
                                fieldObj.fieldInput.type = "selectgroup";
                            }*/
                        }
                        fieldObj.childGroup = updateFieldChild(fieldValueIds, fields);
                        fieldObj.fieldInput.values = fvalues;
                        //fieldObj.selectGroup.parentIds = parentIds;
                        //fieldObj.selectGroup.subType = subType;
                    }
                    // 作业员，参考资料时效，属性列表不渲染；
                    if (_.include(['OPERATOR', 'SDATE'], fieldObj.fieldName)) {
                        fieldObj.display = '0';
                    }

                    if (modelName == iD.data.DataType.QUALITY_TAG) {
                        if (_.include(['CREATEBY', 'EDITBY', 'CHECKBY', 'FEATURE_ID', 'TAG_TYPE'], fieldObj.fieldName)) {
                            fieldObj.readOnly = '1';
                        }
                    } else if (_.include([
                            iD.data.DataType.IMAGE_TAG,
                            iD.data.DataType.ANALYSIS_TAG
                        ], modelName)) {
                        if (_.include(['MARKBY'], fieldObj.fieldName)) {
                            fieldObj.readOnly = '1';
                        }
                    } else if (modelName == iD.data.DataType.MEASUREINFO) {
                        // 测量信息不可编辑
                        fieldObj.readOnly = '1';
                    }
                    if (fieldReadOnly != null) {
                        fieldObj.readOnly = fieldReadOnly ? '1' : (fieldObj.readOnly || '0');
                    }

                    updateFieldStatus(modelName, fieldObj);
                    modelEntity.addField(fieldObj);
                }
                modelEntity.members(layers[i].model.members);
                iD.ModelEntitys[modelName] = modelEntity;
            }

            let def = new iD.ModelEntity();
            def.modelName(iD.data.DataType.DEFAULT);
            def.setGeoType(10);
            def.layerId(10);
            def.addField([]);
            iD.ModelEntitys[iD.data.DataType.DEFAULT] = def;

            return result;
        }
    },
    //获得图层ID
    // param :
    //  layerSn  : 图层名称,如Highway
    getLayerId: function (layerSn) {
        var layerId;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].layerSn && this.layers[i].layerSn == layerSn) {
                return this.layers[i].layerId;
            };
        }
        return layerId;
    },

    getLayer: function (layerId) {
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].layerId && this.layers[i].layerId == layerId) {
                return this.layers[i];
            };
        }
        return null;
    },

    //TODO 图层获取需要去除
    getLayerByName: function (layerName) {
        var layer;
        for (var i = 0; i < this.layers.length; i++) {
            layer = this.layers[i];
            if (layer.layerSn && layer.layerSn == layerName) {
                return layer;
            } else if (typeof layer.layerInfo != 'undefined') {
                for (var j = 0; j < layer.layerInfo.length; j++) {
                    if (layer.layerInfo[j].type && layer.layerInfo[j].type == layerName) {
                        return layer.layerInfo[j];
                    };
                }
            }
        }
        return null;
    }

};