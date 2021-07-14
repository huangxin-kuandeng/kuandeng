/*
 * @Author: tao.w
 * @Date: 2020-11-17 18:25:10
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-24 16:04:21
 * @Description: 
 */

// 检查事件名
function eventNameCheck(eventName) {
    if (typeof eventName != 'string') {
        throw '事件名必须使用字符串类型';
    }
}
// 检查事件监听函数
function handleCheck(handle) {
    if (typeof handle != 'function') {
        throw '事件监听 handle必须是一个函数';
    }
}
let _eventNames  = {
    // "click":[],
}

let Evented = {
    // 存所有事件名字的
    

    // 监听事件
    on: function (eventName, handle) {
        eventNameCheck(eventName);
        handleCheck(handle);
        this._addHandle(eventName, handle);
    },
    // 一次事件 事件执行一次即被删除
    once: function (eventName, handle) {
        eventNameCheck(eventName);
        handleCheck(handle);
        let _self = this;
        let _handle = function (data) {
            handle(data);
            _self.remove(eventName, _handle);
        }
        this._addHandle(eventName, _handle);
    },
    // 派发事事件
    emit: function (eventName, data) {
        eventNameCheck(eventName);
        // 如果有eventName事件的兼听函数
        if (_eventNames[eventName]) {
            let _eventName = _eventNames[eventName];

            _eventName.forEach((handle) => {
                handle(data);
            })
        }
    },
    // 移除事件
    remove: function (eventName, handle) {
        eventNameCheck(eventName);
        handleCheck(handle);
        let _eventName = _eventNames[eventName];
        if (_eventName) {
            let index;
            _eventNames[eventName].forEach((_handle, _index) => {
                if (_handle === handle) {
                    index = _index;
                }
            })
            if (index != undefined) {
                _eventName.splice(index, 1);
                // 移除一个事件回调函数后如果此事件已没有其它回调函数，则将当前事件清空，已节省内存
                if (!_eventName.length) {
                    _eventNames[eventName] = null;
                }
                return true;
            }
            else {
                return false;
            }
        }
        else {
            throw `没有监听的[${eventName}]事件`;
        }
    },
    // 移除所有事件
    removeAll: function (eventName) {
        if (eventName) {
            eventNameCheck(eventName);
            let _eventName = _eventNames[eventName];
            if (_eventName) {
                _eventNames[eventName] = null;
                return true;
            }
            else {
                return false;
            }
        }
        // 如果没有传事件名字，则清空所有事件
        else {
            _eventNames = {};
            return true;
        }
    },
    // 添加事件 私有方法
    _addHandle: function (eventName, handle) {
        if (!_eventNames[eventName]) {
            let _eventName = _eventNames[eventName] = [];
            _eventName.push(handle);
        }
        else {
            _eventNames[eventName].push(handle);
        }
    }

}


export { Evented };