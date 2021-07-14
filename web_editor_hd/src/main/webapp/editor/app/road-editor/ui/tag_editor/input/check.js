iD.ui.TagEditorInput.check  = function(field) {
    var event = d3.dispatch('change'),
        options = field.strings && field.strings.options,
        values = [],
        texts = [],
        value, box, text, label;

    //console.log(field);

    if (field.fieldModel &&
        field.fieldModel.fieldInput &&
        field.fieldModel.fieldInput.values) {

        var fVals = field.fieldModel.fieldInput.values;

        values = _.pluck(fVals, 'value');
        texts = _.pluck(fVals, 'name');

    } else if (options) {
        for (var k in options) {
            values.push(k === 'undefined' ? undefined : k);
            texts.push(field.t('options.' + k, {
                'default': options[k]
            }));
        }
    } else {
        values = [undefined, 'yes'];
        texts = [t('inspector.unknown'), t('inspector.check.yes')];
        if (field.type === 'check') {
            values.push('no');
            texts.push(t('inspector.check.no'));
        }
    }

    var check = function(selection) {

        selection.classed('checkselect', 'true');

        label = selection.selectAll('.preset-input-wrap')
            .data([0]);

        var enter = label.enter().append('label')
            .attr('class', 'preset-input-wrap');

        enter.append('input')
            //.property('indeterminate', field.type === 'check')
            .attr('type', 'checkbox')
            .attr('id', 'preset-input-' + field.id);

        enter.append('span')
            .text(texts[0])
            .attr('class', 'value');

        box = label.select('input')
            .on('click', function() {
                var t = {};
                t[field.key] = values[(values.indexOf(value) + 1) % values.length];
                event.change(t);
                d3.event.stopPropagation();
            });

        text = label.select('span.value');
    };

    check.tags = function(tags) {
        value = tags[field.key];

        box.property('indeterminate', !value);

        box.property('checked', value === 'yes' || value === '1');
        text.text(texts[values.indexOf(value)]);
        label.classed('set', !!value);
    };

    check.focus = function() {
        box.node().focus();
    };

    check.change = function(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        //t[field.key] = values[(values.indexOf(value) + 1) % values.length];
        event.change(t);
    };

    check.readOnly = function(readonly) {
        box.call(iD.ui.TagEditor.readOnly, readonly);
        label.call(iD.ui.TagEditor.readOnly, readonly);
    }

    check.disable = function(disable) {
        box.call(iD.ui.TagEditor.disable, disable);
        label.call(iD.ui.TagEditor.disable, disable);
    }


    return d3.rebind(check, event, 'on');
};