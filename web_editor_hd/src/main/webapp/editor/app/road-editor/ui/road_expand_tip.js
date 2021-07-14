/**
 * Created by wt on 2015/8/10.
 */
iD.ui.RoadExpandTip = function (context, options) {
    var tipUtil = iD.ui.TipUtil(context);
    var center = [];
    var roadExpandTip = {};
    var screenX, screenY, modal;
    options = Object.assign({
    	distance: '3.0',
    	step: '1.50',
    	min: '0.0'
    }, options);

    function closeExpandBox() {
        var delDiv = document.getElementById('road-expand-box');
        if (delDiv != null)
            delDiv.parentNode.removeChild(delDiv);
        modal.close();
    }

    roadExpandTip.perform = function (selection, perforFun) {
        var left, right, originalRoadTag = true;
        var leftDistance = options.hasOwnProperty('leftDistance') ? (options.leftDistance || '0.0') : options.distance;
        var rightDistance = options.hasOwnProperty('rightDistance') ? (options.rightDistance || '0.0') : options.distance;
        var inputMin = options.min;
        var inputStep = options.step;
        
        screenX = tipUtil.getMousePos().X;
        screenY = tipUtil.getMousePos().Y;
        modal = iD.ui.modal(selection);
        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');
        modal.append('div')
            .attr('class', 'road-expand-box')
            .attr('id', 'road-expand-box')
        var expandBox = d3.select('.road-expand-box');
        var titleTable = expandBox.append('table')
            .attr('class', 'expand-title-table')
            .attr('id', 'expand-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'expand-title-content-td')
            .text('扩路');
        tr.append('td')
            .attr('class', 'expand-title-close-td')
            .on('click', function () {
                closeExpandBox();
            })
            .append('span')
            .attr('class', 'expand-title-close-span')
            .text('×');

        var expandContent = expandBox.append('div')
            .attr('class', 'road-expand-content')
        var expandLeft = expandContent.append('div')
            .attr('class', 'expand-left')
        expandLeft.append('lable')
            .attr('class', 'expand-annotation')
            .text('左边扩路')
        expandLeft.append('input')
            .attr('id', 'expand-text-left')
            .attr('class', 'expand-text-left')
            .attr('value', leftDistance)
            .attr('type', 'number')
            .attr('min', inputMin)
            .attr('step', inputStep)
        expandLeft.append('lable')
            .attr('class', 'meter')
            .text('米')

        var expandRight = expandContent.append('div')
            .attr('class', 'expand-right')
        expandRight.append('lable')
            .attr('class', 'expand-annotation')
            .text('右边扩路')
        expandRight.append('input')
            .attr('id', 'expand-text-right')
            .attr('class', 'expand-text-right')
            .attr('value', rightDistance)
            .attr('type', 'number')
            .attr('min', inputMin)
            .attr('step', inputStep)
        expandRight.append('lable')
            .attr('class', 'meter')
            .text('米')

        var functionItem = expandContent.append('div')
            .attr('class', 'expand-item')
        functionItem.insert('input', '.original-road-annotation')
            .attr('type', 'checkbox')
            .attr('id', 'expand-item-original-road')
            .attr('class', 'expand-item-original-road')
            .attr('checked', 'true')
            .on('click', function () {
                var checkbox = document.getElementById("expand-item-original-road");
                if (checkbox.checked) {
                    originalRoadTag = true;
                }
                else {
                    originalRoadTag = false;
                }
            });

        functionItem.append('label')
            .attr('class', 'original-road-annotation')
            .text('保留原始道路')

        var buttonContent = expandContent.append('div')
            .attr('class', 'button-content')
        buttonContent.append('input')
            .attr('type', 'button')
            .attr('class', 'expand-ok')
            .attr('value', '确定')
            .on('click', function () {
                var userInputParam = {'left': '', 'right': '', 'originalRoadTag': ''};
                left = document.getElementById('expand-text-left').value;
                right = document.getElementById('expand-text-right').value;
                userInputParam.left = left;
                userInputParam.right = right;
                userInputParam.originalRoadTag = originalRoadTag;
                perforFun(userInputParam);
                closeExpandBox();
            });
        new tipUtil.dragDrop({
            target: document.getElementById('road-expand-box'),
            bridge: document.getElementById('expand-title-table')
        });
    }

    roadExpandTip.center = function (_) {
        if (_) {
            center = _
        } else {
            return center;
        }
    }

    return roadExpandTip;
}
