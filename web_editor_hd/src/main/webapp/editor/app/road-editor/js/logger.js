/*
 * @Author: tao.w
 * @LastEditors: kanhognyu
 * @Description: 
 * @Date: 2019-03-08 17:28:31
 * @LastEditTime: 2019-07-18 11:55:00
 */

iD.logger = {};
iD.logger.getFilter = function(entity, context){
    var result = 'none';
    if(!entity || !entity.tags) return result;
    var et = entity;
    switch (entity.modelName) {
        case iD.data.DataType.OBJECT_PG_NODE:
        case iD.data.DataType.OBJECT_PL_NODE:
            et = context.graph().parentWays(entity)[0];

        // 导流带、人行横道、地面定位目标
        case iD.data.DataType.OBJECT_PG:
        // 辅助线、人行道
        case iD.data.DataType.OBJECT_PL:
            result = {
                "TYPE": val(et.tags.TYPE),
                "SUBTYPE": val(et.tags.SUBTYPE)
            };
            break;
        case iD.data.DataType.LAMPPOST:
            // 灯杆灯头
            result = {
                "TYPE": val(et.tags.TYPE)
            };
            break;
    }
    function val(text){
        return text ? (text + '') : '';
    }

    return result;
}

// /**
//  * 功能埋点：统一处理右键菜单快捷键操作  支持多选
//  * @param operation
//  */
// iD.logger.sendRKeyMenuHotKeysOperation = function (operation) {
//     var context = editor.context;
//     var selectedIDs = context.selectedIDs();
//     var length = selectedIDs.length;
//     if(length > 0){
//         var tagValue = null;
//         var datum = context.hasEntity(selectedIDs[0]);
//         if(datum && datum.tags && datum.tags.datatype){
//             var rightMenu = datum.tags.datatype;
            
//         }
//         if(length > 1 && tagValue != null){
//             tagValue += 's';
//         }
//         if(tagValue != null){
//             iD.UserBehavior.logger({
//                 'type': 'click',
//                 'tag': tagValue,
//                 'child_event_name': operation.title,
//                 'action': iD.UserBehavior.getAction(operation.keys.join('|')),
//             });
//         }
//     }
// };
 
/**
 * 功能埋点：要素编辑
 * @param opts
 */
iD.logger.editElement = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'tag': '',
        'filter': 'none',
        'modelName': "",
        'desc': "",
        'child_event_name': '',
        'action': 'Click',
    };
    Object.assign(loggerOpts,opts);
    
    // let loggerOpts = {
    //     'type': opts.type || 'click',
    //     'tag': opts.tag,
    //     'filter': 'none',
    //     'modelName': opts.modelName || "",
    //     'desc': opts.msg || "",
    //     'child_event_name': opts.child_event_name || '',
    //     'action': opts.action || opts.type || 'Click',
    // };
    iD.UserBehavior.logger(loggerOpts);
};
/**
 * 功能埋点：定位到当前任务
 * @param opts
 */
iD.logger.locateCurrentTask = function (opts) {
    iD.UserBehavior.logger({
        'type': 'click',
        'tag': 'task_location',
        'action': iD.UserBehavior.getAction(opts.key),
    });
};
 
/**
 * 功能埋点：检查操作
 * @param opts
 */
iD.logger.taskSelfCheck = function (opts) {
    iD.UserBehavior.logger({
        'type': 'click',
        'tag': 'check_self',
        'action': iD.UserBehavior.getAction(opts.key),
    });
};

/**
 * 功能埋点：图片播放器弹出
 */
iD.logger.sendPicPlayer = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'panel-picplayer',
        'action': 'Click',
    };

    loggerOpts = _.assign(loggerOpts, opts);

    iD.UserBehavior.logger(loggerOpts);
};
 

   

//报表相关logger
iD.reportLogger = {};

/**
 * 功能埋点：检查项报表定位
 * @param opts
 */
iD.reportLogger.checkReportLocate = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'action': 'Click',
    };

    loggerOpts = _.assign(loggerOpts, opts);

    if (loggerOpts.tag) {
        iD.UserBehavior.logger(loggerOpts);
    }
};
 
/**
 * 功能埋点：报表列表弹出
 * @param key
 */
iD.reportLogger.checkReportPanelOpen = function (key) {
    let loggerOpts = {
        'type': 'click',
        'tag': 'panel-check',
        'filter': 'none',
    };

    if (key) {
        loggerOpts.action = iD.UserBehavior.getAction(key);
    }

    iD.UserBehavior.logger(loggerOpts);
};

//图片播放器相关logger
iD.picPlayerLogger = {};


/**
 * 功能埋点：图片播放
 * @param opts
 */
iD.picPlayerLogger.picPlay = function (tag, picPoint, key) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
    };
    
    if (tag) {
        loggerOpts.tag = tag;
    }
    /*if (picPoint) {
        let ptInfo = iD.picPlayerLogger.getPicPointInfo(picPoint);
        loggerOpts = _.assign(loggerOpts, ptInfo);
    }*/
    if (key) {
        loggerOpts.action = key;
    }

    if (loggerOpts.tag) {
        iD.UserBehavior.logger(loggerOpts);
    }
};

/**
 * 功能埋点：图片缩放
 * @param opts
 */
iD.picPlayerLogger.picZoom = function (tag, picPoint, key) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'player_zoom',
    };
    
    if (tag) {
        loggerOpts.tag = tag;
    }
    /*if (picPoint) {
        let ptInfo = iD.picPlayerLogger.getPicPointInfo(picPoint);
        loggerOpts = _.assign(loggerOpts, ptInfo);
    }*/
    if (key) {
        loggerOpts.action = key;
    }

    if (loggerOpts.tag) {
        iD.UserBehavior.logger(loggerOpts);
    }
};

/**
 * 功能埋点：图片框移动
 */
iD.picPlayerLogger.picMove = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'player_move',
    };

    loggerOpts = _.assign(loggerOpts, opts);

    iD.UserBehavior.logger(loggerOpts);
};

/**
 * 功能埋点：图片框缩放
 * @param opts
 */
iD.picPlayerLogger.picSizeChange = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'player_size'
    };

    loggerOpts = _.assign(loggerOpts, opts);

    iD.UserBehavior.logger(loggerOpts);
};

/**
 * 功能埋点：图片预取开始
 * @param opts
 */
iD.picPlayerLogger.picPreLoadStart = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'getpic_start'
    };

    loggerOpts = _.assign(loggerOpts, opts);

    iD.UserBehavior.logger(loggerOpts);
};

/**
 * 功能埋点：图片预取结束
 * @param opts
 */
iD.picPlayerLogger.picPreLoadEnd = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'getpic_end'
    };

    loggerOpts = _.assign(loggerOpts, opts);

    iD.UserBehavior.logger(loggerOpts);
};
 
/**
 * 功能埋点：地图拖拽操作
 * @param opts
 */
iD.picPlayerLogger.mapMouseDrag = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'filter': 'none',
        'tag': 'map_mouseup'
    };

    loggerOpts = _.assign(loggerOpts, opts);

    iD.UserBehavior.logger(loggerOpts);
};

/**
 * 功能埋点：点云视频窗口埋点
 * @param opts
 */
iD.picPlayerLogger.potreeHandle = function (opts) {
    let loggerOpts = {
        'type': 'click',
        'action': iD.UserBehavior.getAction(opts.key),
        'filter': 'none',
        'tag': 'map_mouseup'
    };
	
    loggerOpts = _.assign(loggerOpts, opts);
//	console.log(loggerOpts)
//	return
    iD.UserBehavior.logger(loggerOpts);
};