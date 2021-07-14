/*
 * @Author: tao.w
 * @Date: 2021-06-21 16:57:56
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-01 11:55:47
 * @Description: 
 */
// 精度检查是否通过
iD.ui.AccuracyForm = function(context) {
    var $button;

    var render = function(selection) {
        $button = selection.append('button')
            .attr('title', '精度检查')
            .style('width', '75px');
        $button.append('span')
            .attr('class', 'text-center')
            .text('精度检查');
        $button.on('click', function() {
            if(!iD.Task.d) return ;
            Dialog.confirm(`
                <span>精度检查是否通过</span>
                <select id="_accuracy_status_select" value="true" style="padding: 3px 5px;">
                    <option value="true">是</option>
                    <option value="false">否</option>
                </select>
            `, function() {
                processPassStatus(d3.select('#_accuracy_status_select').value(), function() {
                    Dialog.alert('检查状态设置完成');
                });
            });
        });

        render.hideBtn();
    }

    render.showBtn = function() {
        // 精度检查员、精度检查环节
        if(iD.User.isPrecisionRole() && 
            iD.Task.d &&
            iD.Task.d.protoData.taskDefinitionKey == 'PrecisionInspection'){
            $button && $button.style('display', 'block');
        }else {
            render.hideBtn();
        }
    }
    render.hideBtn = function() {
        $button && $button.style('display', 'none');
    }

    /**
     * 设置当前任务精度检查是否通过
     * @param {Boolean} isPass
     * @param {Function} callback
     * @param {Object} opts
     */
    function processPassStatus(flag, callback, opts = {}) {
        // 是否通过
        let bodyParam = {
            "id": "" + iD.Task.d.task_id,
            "tags": [{
                "k": "accuracy",
                "v": flag + ""
            }]
        };

        let url = iD.config.URL.kts + 'task/update';
        d3.json(url)
            .header("Content-Type", "application/json;charset=UTF-8")
            .post(JSON.stringify(bodyParam), function(error, data) {
                if (error) {
                    Dialog.alert('任务平台服务无响应，请重试');
                    return;
                }
                callback(data);
            });
    }

    return render;
}