iD.ui.UndoRedo = function (context) {
    var commands = [{
        id: 'undo',
        cmd: iD.ui.cmd('⌘Z'),
        action: function () {
            if (!saving()) context.undo();
        },
        annotation: function () {
            return context.history().undoAnnotation();
        }
    }, {
        id: 'redo',
        cmd: iD.ui.cmd('⌘⇧Z'),
        action: function () {
            if (!saving()) context.redo();
        },
        annotation: function () {
            return context.history().redoAnnotation();
        }
    }];

    function saving() {
       return (context.mode().id === 'save' && iD.modes.Save.isSaving())||context.mode().id==="RoadCrossModify";
    }

    return function (selection) {
        var tag;
        var tooltip = bootstrap.tooltip()
            .placement('bottom')
            .html(true)
            .title(function (d) {
                return iD.ui.tooltipHtml(d.annotation() ?
                    t(d.id + '.tooltip', {action: d.annotation()}) :
                    t(d.id + '.nothing'), d.cmd);
            });

        //qctag统计
        var qcTagCnt = function(){
            var role = iD.User.getRole().role;
            if (role == 'check') {
//              var qctag = iD.ui.QualityControlCount(context);
//              qctag.perform();
            }
        }
        var updateTopo = function(){
            var changes =  context.history().changes(iD.actions.DiscardTags(context.history().difference()));
            var createData = changes.created;
            createData.forEach(function (entity) {
                if (entity instanceof iD.Way /*&& entity.tags.isnewway*/) {
                    context.replace(iD.actions.AddRoad(entity.id), t('modes.add_road.description'));
                }
                if (entity instanceof iD.Way && entity.tags.isnewwalklink) {
                    context.replace(iD.actions.AddWalkRoad(entity.id), t('modes.add_road.description'));
                }
            })
        }
        var buttons = selection.selectAll('button')
            .data(commands)
            .enter().append('button')
            .attr('class', 'KDSEditor-col6 disabled')
            .on('click', function (d) {
                var _tag = 'task_'+d.id;
                iD.logger.editElement({
                    'tag':_tag
                });
                d.action();
                qcTagCnt();
                updateTopo();
              // return d.action();
            })
            .call(tooltip);

        buttons.append('div').classed('for-border', true).append('span')
            .attr('class', function (d) {
                return 'KDSEditor-icon ' + d.id;
            });

        var keybinding = d3.keybinding('undo')
            .on(commands[0].cmd, function () {
                iD.logger.editElement({
                    'tag': 'task_undo', 
                    'modelName': '',
                    action: iD.UserBehavior.getAction('Ctrl+Z'),
                    'type': 'keydown'
                });
                d3.event.preventDefault();
                commands[0].action();
                qcTagCnt();
                updateTopo();
            })
            .on(commands[1].cmd, function () {
                iD.logger.editElement({
                    'tag': 'task_redo',
                    'modelName': '',
                    action: iD.UserBehavior.getAction('Ctrl+Shift+Z'),
                    'type': 'keydown'
                });
                d3.event.preventDefault();
                commands[1].action();
                qcTagCnt();
                updateTopo();
            });

        d3.select(document)
            .call(keybinding);

        context.history()
            .on('change.undo_redo', update);

        context
            .on('enter.undo_redo', update);

        function update() {
            buttons
                .property('disabled', saving())
                .classed('disabled', function (d) {
                    return !d.annotation();
                })
                .each(function () {
                    var selection = d3.select(this);
                    if (selection.property('tooltipVisible')) {
                        selection.call(tooltip.show);
                    }
                });
            context.undo_redo_buttons = buttons;
        }
    };
};
