/*
 * @Author: tao.w
 * @Date: 2020-03-12 17:28:13
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-01 11:55:06
 * @Description: 
 */
iD = iD || {};
iD.BuriedStatistics = function (context) {
    let dispatch = d3.dispatch('update');
    let dataType = iD.data.DataType;
    // let buriedModelNames = [
    //     dataType.DIVIDER,
    //     dataType.ROAD,
    //     dataType.JUNCTION,
    //     dataType.ROAD,
    //     dataType.ROAD,
    //     dataType.ROAD,
    //     dataType.BARRIER_GEOMETRY
    // ];
    let buriedModelNames = Object.keys(dataType);
    let commonOperations = [
        'pcloud',
        'map',
        'picplayer'
    ];

    let recording = {
        name: '',
        times:[],
        // startTime: 0,
        // behaviorStatus: '', //1 开始  2 过程中  3 结束
        // entTime: 0,
        status: 0      //  1:draw 2:currency 0:表示操作结束，无状态
    };

    let buriedData = [];
    let template =
    {
        "projectId": 0,                               //项目id
        "taskId": 0,                                  //任务id
        "taskFrameId": 0,                             //框id
        "operator": "",                       //作业员
        "process": 0,                                 //作业流程
        "link": 0,                                    //任务节点
        "lastActivitiId": 0,                          //任务类型
        "operationType": "",             //操作类型
        "modelName": "",                     //模型名称
        "costTime": 0,                              //花费时间
        "commonOperationType": "", //通用操作类型
        "commonOperationSubType": "",  //通用操作子类型
        "timestamp":new Date().getTime() 

    }
    

    function resetRecording(){
        recording = {
            name: '',
            times:[],
            status: 0  
        };
    }

    function change(_recording,name){
        let _buried;
        if(commonOperations.includes(name) ){
            _buried = buriedData.find(d=>{
                return d.commonOperationType == name;
            });
        }else{
            _buried =  buriedData.find(d=>{
                return d.modelName == name;
            });
        }
        // if(_recording.status ==1 ){
        //   _buried =  buriedData.find(d=>{
        //         return d.modelName == name;
        //     });
        // }else if(_recording.status ==2){
        //      _buried = buriedData.find(d=>{
        //         return d.commonOperationType == name;
        //     });
        // }
        if(!_buried){
            console.error('统计模型错误');
            resetRecording();
            return ;
        }
        let sTime = _recording.times[0];
        let eTime = _.last(_recording.times);
        _buried.costTime = _buried.costTime + (eTime - sTime);

        _buried.timestamp = new Date().getTime() ;
        // if(_buried.costTime> 1000000){
        //     console.warn('> 1000000')
        // }
        // console.log('一次操作记录',_buried.modelName, name ,_buried.costTime,_buried.timestamp,new Date());
        resetRecording();
    }
    
    /**
     * @description: 
     * @param {type} operatingStatc  1 删除 2 修改 
     * @return: 
     */
    // function getTme(recording,operatingStatc = -1){
    //     let time = new Date().getTime();
    //     if()
    // }

    var buriedStatistics = {
         
        // _getBuriedObj:function(){
            
        // },

        init: function () {
            let task = iD.Task.d;
            if(!task){
                Dialog.alert('无任务，埋点初始化错误');
            }
            buriedData.length = 0;
            // console.log('init');
            let _temp =  {};
            Object.assign(_temp,template);
            _temp.projectId = task.tags.projectId;
            _temp.taskId = task.task_id;
            _temp.taskFrameId = task.tags.taskFrameId;
            _temp.operator = iD.User.getInfo().userId;
            _temp.process = task.tags.processDefinitionKey;
            _temp.link = task.protoData.taskDefinitionKey;
            _temp.lastActivitiId = task.tags.lastActivitiId;

            for(let i=0;i<buriedModelNames.length;i++){
                let _buried = Object.assign({},_temp);
                _buried.modelName = buriedModelNames[i];
                buriedData.push(_buried);
            }

            for(let i=0;i<commonOperations.length;i++){
                let _buried = Object.assign({},_temp);
                _buried.modelName = commonOperations[i];
                _buried.commonOperationType = commonOperations[i];
                buriedData.push(_buried);
            }
            resetRecording();
            // context.event.on('selected.effect-dividerSideWalk', function(selectedEntities){
            //     effect.enable && effect.apply.call(effect, context, effect.enable, _.pluck(selectedEntities, 'id'));
            // });
            // context.event.on('buried.buried',(e)=>{
            //     if(e.status ==1){

            //     }else if(e.status == 2){

            //     }else if(e.status == 0){
                    
            //     }
            // })
        },
        
        
        merge:function(status,name, operatingTime = -1){

            if(!buriedData.length){
                // buriedStatistics.init();
                return ;
            }
            function _getTime(recording,_os){
                let time = new Date().getTime();
                if(recording.times.length === 0 ){
                    recording.times.push(time);
                }
                if( _os !=-1 ){
                    time = _.last(recording.times) + _os;
                    // recording.times.push(time + _os );
                }
                return time;
                
            }
            // if(operatingTime == -1){
            //     console.log('-----',status,name)
            // }

            if(status === 0 && recording.status === 1 && recording.name == name){
                // console.log(0,recording,status,name);
                recording.times.push(_getTime(recording,operatingTime));
                change(recording,recording.name);
            }
            else if(status === 0 && commonOperations.includes(recording.name)){
                recording.times.push(_getTime(recording,operatingTime));
                change(recording,recording.name);
            }
            else if(recording.times.length === 0){
                // console.log(1,recording,status,name);
                recording.name = name;
                recording.status = status;
                recording.times.push(_getTime(recording,operatingTime));
            }else if(recording.name == name || (recording.status ===1 && (status === 2 || status === 0))){
                // console.log(2,recording,status,name);
                recording.times.push(_getTime(recording,operatingTime));
            }else if(recording.name != name){
                // console.log(3,recording,status,name);
                let _status = status;
                if(_status === 0){
                    _status = recording.status;
                }
                // let _temp =  recording.name;
                change(recording,recording.name);
                recording.name = name;
                recording.status = status;
                recording.times.push(_getTime(recording,operatingTime));
            }else{
                // console.log(123123)
            }

            // if(status == 0){
            //     console.log('一次操作结束');
            // }
        },
        
        getRecording:function(){
            return recording;
        },

        getBuriedData : function(){
            return buriedData;
        },
        reset: function () {
            buriedData.length = 0;
            for (let i = 0; i < buriedModelNames.length; i++) {

            }
            dispatch.change();
            return buriedStatistics;
        },

        toJSON: function () {
            return buriedData;
        },


        save: function () {
            if(recording.times.length){
                change(recording,recording.name);
            }
            let url = iD.config.URL.kds_data + 'data/stastics/save';
    
            d3.json(url)
                .header("Content-Type", "application/json;charset=UTF-8")
                .post(JSON.stringify(buriedData));
            
            this.init();
        },

        clearSaved: function () {
            if (lock.locked()) context.storage(getKey(username), null);
            return history;
        },
    };

    // buriedStatistics.init();

    return d3.rebind(buriedStatistics, dispatch, 'on');
};