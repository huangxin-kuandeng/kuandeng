/*
 * @Author: tao.w
 * @LastEditors: tao.w
 * @Description: 
 * @Date: 2019-03-06 13:20:34
 * @LastEditTime: 2021-07-01 11:54:27
 */

iD = iD || {};
iD.UserBehavior = {
    maxItem: 1,
    maxTime: 1000 * 60 * 3, //3min
    messageBuffer: [],
    time: undefined,
    recordTime: function () {
        this.time = window.setTimeout(function () {
            if (iD.UserBehavior.messageBuffer.length > 0) {
                iD.UserBehavior.sendMesg();
            }
        }, this.maxTime)
    },
    sendMesg: function (data) {
        if (iD.util.urlParamHistory()){
            return;
        }
        //心跳：editor_heartbeat
        //埋点：editor_event_tracking
        // var url = iD.config.URL.hbase + 'kv/set/v2?&namespace=editor_event_tracking&key=' + _key;
        // var url = 'http://192.168.8.17:5999/event_traking/set';
        var url = iD.config.URL.buried_point + 'effective/set';
//      var requestData = {list: iD.UserBehavior.messageBuffer};
        // var requestData = data;
        // d3.json(url)
        //     .header("Content-Type", "application/x-www-form-urlencoded")
        //     .post(JSON.stringify(data));
        iD.UserBehavior.messageBuffer = [];
        clearTimeout(this.time);
//      this.recordTime();
    },
    logger: function (opts, sendImmediately) {
        if ( opts.type && (opts.type==="click" || opts.type==="drag" || opts.type==="dblClick") ) {
            /* 
            //增加过滤，仅保留快捷键与点击事件  filter代表是否参与过滤
            if (typeof opts.filter === 'undefined' || opts.filter != 'none') {
                var event = window.event;
                // if (!event || (event.type != 'change' &&
                //     event.type != 'click' && event.type != 'keydown' && event.type != 'keyup')) {
                //     return;
                // } 
                if (!event || ![
                    'change',
                    'click',
                    'keydown',
                    'keyup',
                    'mousedown',
                    'mousemove',
                    'mouseup'
                ].includes(event.type)) {
                    return;
                } 
            }
             */

            //统一处理无子事件的事件：child_event_name赋值为null
            if (typeof opts.child_event_name === 'undefined') {
                opts.child_event_name = null;
            }

            //统一处理action字段：window.event.type为‘click’，action赋值为‘click’
            if (typeof opts.action === 'undefined' || opts.action === '') {
                var event = window.event;
                if (event && ( event.type === 'click')) {
                    opts.action = 'Click';
                }else if(event && ( event.type === 'drag')){
                    opts.action = 'Drag';
                }else if(event && ( event.type === 'dblClick')){
                    opts.action = 'DblClick';
                }else {
                    opts.action = 'auto';
                }
            }
        }
//      this.messageBuffer.push(this.handleCommonOpts(opts));
        let this_data = this.handleCommonOpts(opts);
//      if (this.messageBuffer.length >= this.maxItem || sendImmediately) {
        if (this_data || sendImmediately) {
            this.sendMesg(this_data);
        }
    },
    handleCommonOpts: function (opts) {
        var msg = {};
        if ( opts.type && (opts.type==="click" || opts.type==="drag" || opts.type==="dblClick") ) {
            msg.data = {
                task_id:  "",
                projectId: "",
                task_type: "",
                task_last_type: "",
                task_buss_codes: "",
                modelName: opts.modelName || "",
                action: opts.action,
                time: iD.UserBehavior.getTime(),
                child_event_name: opts.child_event_name,
                taskFrameId: "",							//新增任务框ID
                tag_type: "",								//新增关联数据类型
                work_type: ""								//新增作业类型
            };
            Object.assign(msg.data,opts);
            if(opts.task && typeof opts.task === 'object'){
                msg.data.task_id = opts.task.task_id.toString();
                msg.data.projectId = opts.projectId || opts.task.tags.projectId;
                msg.data.taskFrameId = opts.taskFrameId || opts.task.tags.taskFrameId;
                msg.data.task_type = (opts.task.protoData.taskDefinitionKey || '').toString();
                msg.data.task_buss_codes = opts.task.bussCodes;
                msg.data.task_last_type = opts.task.tags.lastActivityId || '';
                msg.data.work_type = opts.task.tags.processDefinitionKey || '';

            }else if (iD.Task.d){
                msg.data.task_id = iD.Task.d.task_id.toString();
                msg.data.projectId = (iD.Task.d.tags.projectId || '').toString();
                msg.data.taskFrameId = (iD.Task.d.tags.taskFrameId || '').toString();
                msg.data.task_type = (iD.Task.d.protoData.taskDefinitionKey || '').toString();
                msg.data.task_buss_codes = iD.Task.d.bussCodes || '';
                msg.data.task_last_type = (iD.Task.d.tags.lastActivityId || '').toString();
                msg.data.work_type = iD.Task.d.tags.processDefinitionKey || '';
            }
        }
        else {
            if (opts.tag.indexOf('start') != -1) {
                msg.data = {
                    time:iD.UserBehavior.getTime()
                }
            }
            else if (opts.tag.indexOf('end') != -1) {
                msg.data = {
                    time:iD.UserBehavior.getTime()
                }
            }
        }
        if (!msg.data) {
            if (iD.Task.d) {
                 
                opts.task_id = iD.Task.d.task_id.toString();
                opts.projectId = (iD.Task.d.tags.projectId || '').toString();
                opts.taskFrameId = (iD.Task.d.tags.taskFrameId || '').toString();
                opts.task_type = (iD.Task.d.protoData.taskDefinitionKey || '').toString();
                opts.task_buss_codes = iD.Task.d.bussCodes || '';
                opts.task_last_type = iD.Task.d.tags.lastActivityId || '';
                opts.work_type = iD.Task.d.tags.processDefinitionKey || '';
                opts.time = iD.UserBehavior.getTime();
            }
            else {
                opts.task_id = "not-start-task";
                opts.projectId = "not-start-project";
                opts.taskFrameId = "not-start-taskFrameId";
                opts.task_type = 'unknown';
                opts.task_buss_codes = '';
                opts.task_last_type = '';
                opts.work_type = '';
                opts.time = iD.UserBehavior.getTime();
            }
            msg.data = {};
            Object.assign(msg.data,opts)
        }

        msg.data.tag = opts.tag;
        msg.data.user_id = iD.User._info.userid.toString();
        msg.data.desc = opts.desc || '' ;
        if ([
            'check_get_start', 'check_get_end', 'task_submit_start', 'task_submit_end',
            'check_start', 'check_end', 'task_refresh_end','task_getlist_end',
            'task_save_start', 'task_save_end'
        ].indexOf(opts.tag) != -1) {
            if (iD.Task.d) {
                msg.data.task_id = iD.Task.d.task_id.toString();
                msg.data.projectId = (iD.Task.d.tags.projectId || '').toString();
                msg.data.taskFrameId = (iD.Task.d.tags.taskFrameId || '').toString();
                msg.data.task_type = (iD.Task.d.protoData.taskDefinitionKey || '').toString();
                msg.data.task_buss_codes = iD.Task.d.bussCodes || '';
                msg.data.task_last_type = (iD.Task.d.tags.lastActivityId || '').toString();
                msg.data.work_type = iD.Task.d.tags.processDefinitionKey || '';
            }
        }
        switch (opts.tag) {
            case 'task_submit_end':
                msg.data.status = opts.status.toString();
                break;
            case 'task_refresh_end':
                msg.data.status = opts.status.toString();
                msg.data.value = [];
                var taskList = opts.value;
                taskList.forEach(function (d) {
                    msg.data.value.push({
                        task_id: d.task_id.toString(),
                        projectId: (d.tags.projectId || '').toString(),
                        taskFrameId: (d.tags.taskFrameId || '').toString(),
                        task_type: d.protoData.taskDefinitionKey.toString(),
                        task_buss_codes: d.bussCodes || '',
                        task_last_type: d.tags.lastActivityId || '',
                        work_type: d.tags.processDefinitionKey || ''
                    });
                })
                break;
            case 'task_getlist_end':
                msg.data.status = opts.status.toString();
                msg.data.value = [];
                var taskList = opts.value;
                taskList.forEach(function (d) {
                    msg.data.value.push({
                        task_id: d.task_id.toString(),
                        projectId: (d.tags.projectId || '').toString(),
                        taskFrameId: (d.tags.taskFrameId || '').toString(),
                        task_type: d.protoData.taskDefinitionKey.toString(),
                        task_buss_codes: d.bussCodes || '',
                        task_last_type: d.tags.lastActivityId || '',
                        work_type: d.tags.processDefinitionKey || ''
                    });
                })
                break;
            case 'check_end':  //现在没有质检结束一说， 后期增加了后在补充这个埋点
                msg.data.status = opts.status.toString();
                //特殊处理：切换任务后检查结束情况
                break;
        }
        // console.log(msg.data);
        return msg.data;
    },
    getTime: function () {
        return new Date().getTime();
    },
    getAction: function (key, event) {
        if (!event) {
            event = d3.event || window.event;
        }
        
        if (event) {
            if (event.type === 'keydown' || event.type === 'keyup' || event.type === 'zoom' ) {
                return key;
            }
            else if (event.type === 'click') {
                return 'Click';
            }
            else if (event.detail) {
                return 'auto';
            }
        }

        return 'unknown';
    },
}

iD.UserBehavior.recordTime();

