iD.ui.TagEditorInput.text = function(field) {

    var event = d3.dispatch('change'),
        input;

    function i(selection, opts) {

        input = selection.selectAll('input')
            .data([0]);

        input.enter().append('input');

        input.attr('type', field.type)
            .attr('id', 'preset-input-' + field.id)
            .attr('placeholder', field.placeholder());

        var fieldModel = opts.fieldModel;

        if (fieldModel && fieldModel.fieldSize) {
            input.attr('maxLength', fieldModel.fieldSize);
        }

        input
            .on('blur', change)
            .on('change', change);
    }

    function change() {
        var t = {};
        t[field.key] = input.value() || '';
        event.change(t);
    }

    i.readOnly = function(readonly) {
        input.call(iD.ui.TagEditor.readOnly, readonly);
    }

    i.disable = function(disable) {
        input.call(iD.ui.TagEditor.disable, disable);
    }

    i.tags = function(tags) {
        var v = tags[field.key] || '';
        if (v == 'NULL') v = '';
        input.value(v);
        // input.value(tags[field.key] || '');
    };

    i.focus = function() {
        input.node().focus();
    };
    
    i.change = function(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        //t[field.key] = input.value() || '';
        event.change(t);
    };

    return d3.rebind(i, event, 'on');
};