iD.ui.TagEditorInput.combo = function(field) {
    var event = d3.dispatch('change'),
        optstrings = field.strings && field.strings.options,
        optarray = field.options,
        strings = {},
        input;

    var combobox = d3.combobox();

    function combo(selection) {

        input = selection.selectAll('input')
            .data([0]);

        var enter = input.enter()
            .append('input')
            .attr('type', 'text')
            .attr('id', 'preset-input-' + field.id);

        if (optstrings) {
            enter.attr('readonly', 'readonly');
        }

        input
            .call(combobox)
            .on('change', change)
            .on('blur', change)
            .on('mousedown', function() {
                var mousedownFunc = d3.select(this.parentNode)
                    .selectAll('.combobox-caret')
                    .on('mousedown');
                if (mousedownFunc) {
                    mousedownFunc();
                }
            })
            .each(function() {
                if (optstrings) {
                    _.each(optstrings, function(v, k) {
                        strings[k] = v;
                    });
                    stringsLoaded();
                } else if (optarray) {
                    _.each(optarray, function(k) {
                        strings[k] = k.replace(/_+/g, ' ');
                    });
                    stringsLoaded();
                } else {
                    iD.taginfo().values({
                        key: field.key
                    }, function(err, data) {
                        if (!err) {
                            _.each(_.pluck(data, 'value'), function(k) {
                                strings[k] = k.replace(/_+/g, ' ');
                            });
                            stringsLoaded();
                        }
                    });
                }
            });

        function stringsLoaded() {
            var keys = _.keys(strings),
                strs = [],
                placeholders;

            combobox.data(keys.map(function(k) {
                var s = strings[k],
                    o = {};
                o.title = o.value = s;
                if (s.length < 20) {
                    strs.push(s);
                }
                return o;
            }));

            placeholders = strs.length > 1 ? strs : keys;
            input.attr('placeholder', field.placeholder() ||
                (placeholders.slice(0, 3).join(', ') + '...'));
        }
    }

    function change() {
        var optstring = _.find(_.keys(strings), function(k) {
                return strings[k] === input.value();
            }),
            value = optstring || (input.value()
                .split(';')
                .map(function(s) {
                    return s.trim();
                })
                .join(';')
                .replace(/\s+/g, '_'));

        if (field.type === 'typeCombo' && !value) value = 'yes';
        
        var t = {};
        t[field.key] = value || undefined;
        // add 自定义属性，监听函数放入opts
        var eventSrcType=null;
        if(d3.event.srcElement.hasAttribute("data-eventSrc")){
            var element=d3.event.srcElement;
            eventSrcType=element.getAttribute("data-eventSrc");
            element.removeAttribute("data-eventSrc");
        }
        
        event.change(t,eventSrcType);
    }

    combo.tags = function(tags) {
        var key = tags[field.key],
            value = strings[key] || key || '';
        if (field.type === 'typeCombo' && value.toLowerCase() === 'yes') value = '';
        input.value(value);
    };

    combo.focus = function() {
        input.node().focus();
    };
    
    combo.change = function(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        //t[field.key] = input.value() || '';
        event.change(t);
    };

    combo.readOnly = function(readonly) {
        input.property('disabled', !!readonly)
            .classed('no-pointer-events readonly', !!readonly);
    }

    combo.disable = function(readonly) {
        input.style('opacity',!!readonly?'0.5':'1');
        input.property('disabled', !!readonly)
            .classed('disabled', !!readonly);
    }

    return d3.rebind(combo, event, 'on');
};