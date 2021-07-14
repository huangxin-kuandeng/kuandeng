window.XHRM_NUM = 2;window.XHRM_WORKERS = [];window.XHRM_CALLBACKS = {};
for (var i = 0; i < XHRM_NUM; i++)
{
    XHRM_WORKERS.push(makeWorker(i));
}
function makeWorker(i)
{
    var worker = new Worker('../../js/id/util/xhr_back.js');
    worker.onmessage = function (msg)
    {
        var id = msg.data.id;
        XHRM_CALLBACKS[id] && XHRM_CALLBACKS[id](msg.data.data);
        delete XHRM_CALLBACKS[id];
    }
    return worker;
}
function Ajax(id)
{
    this.id = id;
}
Ajax.prototype.abort = function ()
{
    delete XHRM_CALLBACKS[this.id];
}
//module.exports = function (url, option, callback)function xhrMulti(url, option, callback){
    var id = Math.floor(Math.random() * XHRM_NUM);
    var _id = Math.random() + '';
    XHRM_CALLBACKS[_id] = callback;
    XHRM_WORKERS[id].postMessage({
        id: _id,
        url: url,
        option: option
    });
    return new Ajax(_id);
}
