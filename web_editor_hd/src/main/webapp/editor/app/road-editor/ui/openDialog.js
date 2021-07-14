iD.ui.openDialog = function(context) {

    var dialogObj = iD.opendialog(/*null, {
        draggable: false
    }*/);

    function openDialog() {

    }

    openDialog.open = function () {
        var self = this;
        context.event.on('selected.opendialog', function (entities) {
            if (entities.length != 1) return;

            self.showTag(entities);

        })
    }

    openDialog.showTag = function (entities) {
        var entity = entities[0],
            tags = _.clone(entity.tags);

        /*if (entity.modelName == iD.data.DataType.QUESTION_TAG || entity.modelName == iD.data.DataType.ANALYSIS_TAG) {

            var $dialog = d3.select('.opendialog'),
                rawTagEditor = iD.ui.RawTagEditor(context);

            var content = $dialog.select('.content')
            content.call(rawTagEditor.entityID(entity.id)
                    .tags(tags)
                    .state('select'));


            $dialog.select('.title h2')
                .html(entity.id);

            $dialog.style('display', 'block');
        }*/
    }
    // return this;
    return d3.rebind(openDialog, [], 'on');
}