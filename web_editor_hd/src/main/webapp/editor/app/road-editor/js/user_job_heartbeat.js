/*
 * @Author: tao.w
 * @LastEditors: tao.w
 * @Description: 
 * @Date: 2019-02-25 17:51:44
 * @LastEditTime: 2021-07-01 11:53:59
 */

iD = iD || {};
iD.UserJobHeartbeat = {
    jobstatus: 2, //1代表作业中，2代表空闲，代表任务开始，4代表任务结束
    intervalTime: 300 * 1000,
    startTime: '', //开始作业时间
    handle: null, //time
    // 页面是否可见
    docuemntHidden: false,

    sendMesg: function (params, callback) {
        // 页面不可见、history
        if(iD.User.isTrackControlPointRole() || this.docuemntHidden || iD.util.urlParamHistory()) return ;
		
        var url = iD.config.URL.khd_mg_dragger + 'es/index/heartbeat';
        var requestData = params;
		
        d3.xhr(url)
            .header("Content-Type", "application/json")
            .post(JSON.stringify(requestData), function (error, xhr) {
                if (error) {
                    console.warn('心跳服务无响应，请联系管理员' + (typeof error === 'string' ? error : ''));
                    return;
                }
				callback();
            });
    },

    start: function () {
        var self = this;
        if(iD.util.urlParamHistory()) return ;
        self.jobstatus = 2; //开始任务的时候初始化作业员作业状态为空闲中
        self.resetTime(); //开始作业时间
        //console.log('before clear'+self.handle);
        this.handle && window.clearInterval(this.handle);

        // 判断页面可见性
        // document.hidden（最小化、切换选项卡）
        document.onvisibilitychange = function(){
            self.docuemntHidden = document.hidden;
        }

        self.handle = window.setInterval(function () {
            if (iD.Task.working && iD.Task.d && iD.Task.working.task_id == iD.Task.d.task_id){
                var user_id = iD.User.getInfo().userid;
                var user_name = iD.User.getInfo().username;
                var task_id = iD.Task.d.task_id;
                var task_type = iD.Task.d.protoData.taskDefinitionKey;
                var work_type = iD.Task.d.tags.processDefinitionKey;
                var projectId = iD.Task.d.tags.projectId;
				var lastActivityId = iD.Task.d.tags.lastActivityId;
                var job_status = self.jobstatus;
                var params = [{
                    operator: user_name,					//作业员
                    tags: iD.Task.d.tags,                  	//tag信息
                    taskID: task_id,						//记录任务id
                    projectID: projectId,					//记录项目id
                    link: task_type,						//环节名称
                	process: work_type,						//流程名称
					lastActivitiId: lastActivityId,			//返工返修次数标记
                    startTime: new Date().getTime(),		//开始时间
                    endTime: new Date().getTime(),			//结束时间
                    state: job_status						//活动状态
                }];
                self.sendMesg(params, function (data) {
                    self.jobstatus = 2;
                });
            }
        }, self.intervalTime)
    },

    //提交任务的时候发送一次请求
    submitRequest: function (status) {
        var self = this;
        var user_id = iD.User.getInfo().userid;
        var user_name = iD.User.getInfo().username;
        var task_id = iD.Task.d.task_id;
        var projectId = iD.Task.d.tags.projectId;
		var lastActivityId = iD.Task.d.tags.lastActivityId;
		var task_type = iD.Task.d.protoData.taskDefinitionKey;
		var work_type = iD.Task.d.tags.processDefinitionKey;
		
		var params = [{
		    operator: user_name,					//作业员
            tags: iD.Task.d.tags,                   //tag信息
		    taskID: task_id,						//记录任务id
		    projectID: projectId,					//记录项目id
		    link: task_type,						//环节名称
			process: work_type,						//流程名称
			lastActivitiId: lastActivityId,			//返工返修次数标记
		    startTime: new Date().getTime(),		//开始时间
		    endTime: new Date().getTime(),			//结束时间
		    state: status							//活动状态
		}];
		
		
        self.sendMesg(params, function (data) {
            self.jobstatus = 2;
        });
    },

    //开始任务的时候发送前一个前一个任务结束请求和当前任务开始请求
    switchTaskRequest: function (previous, current) {
        var self = this;
        var pre_status = 4,
            cur_status = 3;
        var user_id = iD.User.getInfo().userid;
		var user_name = iD.User.getInfo().username;
        // var task_type = iD.Task.d.protoData.taskDefinitionKey;
        // var projectId = iD.Task.d.tags.projectId;
        //前一个任务发送结束状态
		var params = [];
        if (previous && previous.task_id) {
            let task_type = previous.protoData.taskDefinitionKey;
            let work_type = previous.tags.processDefinitionKey;
            let projectId = previous.tags.projectId;
			let lastActivityId = previous.tags.lastActivityId;
			
			params.push({
			    operator: user_name,					//作业员
                tags: previous.tags,                    //tag信息
			    taskID: previous.task_id,				//记录任务id
			    projectID: projectId,					//记录项目id
			    link: task_type,						//环节名称
				process: work_type,						//流程名称
				lastActivitiId: lastActivityId,			//返工返修次数标记
			    startTime: new Date().getTime(),		//开始时间
			    endTime: new Date().getTime(),			//结束时间
			    state: pre_status						//活动状态
			});
        }
        //当前任务发送开始状态
        if (current && current.task_id) {
            let task_type = current.protoData.taskDefinitionKey;
            let work_type = current.tags.processDefinitionKey;
            let projectId = current.tags.projectId;
			let lastActivityId = current.tags.lastActivityId;
			params.push({
			    operator: user_name,					//作业员
                tags: current.tags,                     //tag信息
			    taskID: current.task_id,				//记录任务id
			    projectID: projectId,					//记录项目id
			    link: task_type,						//环节名称
				process: work_type,						//流程名称
				lastActivitiId: lastActivityId,			//返工返修次数标记
			    startTime: new Date().getTime(),		//开始时间
			    endTime: new Date().getTime(),			//结束时间
			    state: cur_status						//活动状态
			});
        }
		
		if(params.length){
			self.sendMesg(params, function (data) {
				self.jobstatus = 2;
			});
		}
		
    },

    //把作业状态置为作业中函数
    setJobStatus: function () {
        var self = this;
        if (!iD.Task.working || !iD.Task.d || iD.Task.working.task_id !== iD.Task.d.task_id) {

            return
        }
        self.jobstatus = 1;
    },

    resetTime: function () {
        this.startTime = new Date().getTime();
        return this.startTime;
    }
}