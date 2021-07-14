/**
 * 根据车道线生成路缘石
 */
iD.ui.DividerKerbExpandTip = function (context, options) {
    var tipUtil = iD.ui.TipUtil(context);
    var dispatch = d3.dispatch('confirm', 'close');
    var center = [];
    var roadExpandTip = {};
    var screenX, screenY, modal;
    options = Object.assign({
    	distance: '0.5',
    	step: '0.1',
        min: '0.0',
        heightDiff: '0.2',
        heightStep: '0.05'
    }, options);

    function closeExpandBox() {
        var delDiv = document.getElementById('road-expand-box');
        if (delDiv != null)
            delDiv.parentNode.removeChild(delDiv);
        modal.close();
    }

    roadExpandTip.perform = function (selection, perforFun) {
        var left, right, originalRoadTag = true;
        // var leftDistance = options.hasOwnProperty('leftDistance') ? (options.leftDistance || '0.0') : options.distance;
        // var rightDistance = options.hasOwnProperty('rightDistance') ? (options.rightDistance || '0.0') : options.distance;
        var inputMin = options.min;
        var inputStep = options.step;
        var heightStep = options.heightStep;
        
        screenX = tipUtil.getMousePos().X;
        screenY = tipUtil.getMousePos().Y;
        modal = iD.ui.modal(selection);
        // 透明遮罩层
        modal.classed('transparent', true);
        modal.on('autoclose', function(){
            dispatch.close();
        });
        // 不使用全部鼠标事件
        modal.style('pointer-events', 'none');

        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');
        modal.append('div')
            .attr('class', 'road-expand-box')
            .attr('id', 'road-expand-box')
            // 全部鼠标事件
            .style('pointer-events', 'all');
        var expandBox = d3.select('.road-expand-box');
        var titleTable = expandBox.append('table')
            .attr('class', 'expand-title-table')
            .attr('id', 'expand-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'expand-title-content-td')
            .text(options.title || t('operations.expand.offset-kerb'));
        tr.append('td')
            .attr('class', 'expand-title-close-td')
            .on('click', function () {
                dispatch.close();
                closeExpandBox();
            })
            .append('span')
            .attr('class', 'expand-title-close-span')
            .text('×');

        var expandContent = expandBox.append('div')
            .attr('class', 'road-expand-content');
        
        var expandType = expandContent.append('div')
            .attr('class', 'expand-left')
            .style('text-align', 'center');
        var typeLabel = expandType.append('label')
            .attr('class', 'radio-inline');
        typeLabel.append('input')
            .attr('type', 'radio')
            .attr('name', 'expand_type')
            .attr('value', 'left')
            .attr('checked', 'checked');
        typeLabel.append('span').text('左侧');
        var typeLabel2 = expandType.append('label')
            .attr('class', 'radio-inline');
        typeLabel2.append('input')
            .attr('type', 'radio')
            .attr('name', 'expand_type')
            .attr('value', 'right');
        typeLabel2.append('span').text('右侧');
        
        var expandLeft = expandContent.append('div')
            .attr('class', 'expand-right')
        expandLeft.append('lable')
            .attr('class', 'expand-annotation')
            .text('偏移量')
        expandLeft.append('input')
            .attr('id', 'expand-distance')
            .attr('class', 'expand-text-right')
            .attr('value', options.distance)
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
            .text('高度差')
        expandRight.append('input')
            .attr('id', 'expand-height-diff')
            .attr('class', 'expand-text-right')
            .attr('value', options.heightDiff)
            .attr('type', 'number')
            .attr('step', heightStep)
        expandRight.append('lable')
            .attr('class', 'meter')
            .text('米')

        var buttonContent = expandContent.append('div')
            .attr('class', 'button-content')
        buttonContent.append('input')
            .attr('type', 'button')
            .attr('class', 'expand-ok')
            .attr('value', '确定')
            .on('click', function () {
                var userInputParam = {'left': '', 'right': '', 'originalRoadTag': ''};
                var distance = document.getElementById('expand-distance').value;
                var heightDiff = document.getElementById('expand-height-diff').value;
                var type = expandType.select('input:checked').value();
                if(type == 'left'){
                    userInputParam.left = distance;
                }else if(type == 'right') {
                    userInputParam.right = distance;
                }
                userInputParam.heightDiff = heightDiff;
                userInputParam.originalRoadTag = originalRoadTag;
                perforFun(userInputParam);
                dispatch.confirm(userInputParam);
                // closeExpandBox();
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

    return d3.rebind(roadExpandTip, dispatch, 'on');
}
