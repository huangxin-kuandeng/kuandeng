iD.ui.preset = function(context) {
    var event = d3.dispatch('change'),
        state,
        fields,
        preset,
        tags,
        id;

    function UIField(field, entity, show) {
        field = _.clone(field);

        field.input = iD.ui.preset[field.type](field, context)
            .on('change', event.change);

        if (field.input.entity) field.input.entity(entity);

        field.keys = field.keys || [field.key];

        field.show = show;

        field.shown = function() {
            return field.id === 'name' || field.show || _.any(field.keys, function(key) { return !!tags[key]; });
        };

        field.modified = function() {
            var original = context.graph().base().entities[entity.id];
            return _.any(field.keys, function(key) {
                return original ? tags[key] !== original.tags[key] : tags[key];
            });
        };

        field.revert = function() {
            var original = context.graph().base().entities[entity.id],
                t = {};
            field.keys.forEach(function(key) {
                t[key] = original ? original.tags[key] : undefined;
            });
            return t;
        };

        field.present = function() {
            return _.any(field.keys, function(key) {
                return tags[key];
            });
        };

        field.remove = function() {
            var t = {};
            field.keys.forEach(function(key) {
                t[key] = undefined;
            });
            return t;
        };

        return field;
    }

    function fieldKey(field) {
        return field.id;
    }

    function presets(selection) {
        if (!fields) {
            var entity = context.entity(id),
                geometry = context.geometry(id);

            fields = [UIField(context.presets().field('name'), entity)];

            preset.fields.forEach(function(field) {
                if (field.matchGeometry(geometry)) {
                    fields.push(UIField(field, entity, true));
                }
            });

            if (entity.isHighwayIntersection(context.graph())) {
                fields.push(UIField(context.presets().field('restrictions'), entity, true));
            }

            context.presets().universal().forEach(function(field) {
                if (preset.fields.indexOf(field) < 0) {
                    fields.push(UIField(field, entity));
                }
            });
        }

        var shown = fields.filter(function(field) { return field.shown(); }),
            notShown = fields.filter(function(field) { return !field.shown(); });

        var $form = selection.selectAll('.preset-form')
            .data([0]);

        $form.enter().append('div')
            .attr('class', 'preset-form KDSEditor-inspector-inner KDSEditor-fillL3');

        var $fields = $form.selectAll('.KDSEditor-form-field')
            .data(shown, fieldKey);

        // Enter

        var $enter = $fields.enter()
            .insert('div', '.more-buttons')
            .attr('class', function(field) {
                return 'KDSEditor-form-field KDSEditor-form-field-' + field.id;
            });

        var $label = $enter.append('label')
            .attr('class', 'KDSEditor-form-label')
            .attr('for', function(field) { return 'preset-input-' + field.id; })
            .text(function(field) { return field.label(); });

        var wrap = $label.append('div')
            .attr('class', 'KDSEditor-form-label-button-wrap');

        wrap.append('button')
            .attr('class', 'remove-icon')
            .append('span').attr('class', 'KDSEditor-icon delete');

        wrap.append('button')
            .attr('class', 'modified-icon')
            .attr('tabindex', -1)
            .append('div')
            .attr('class', 'KDSEditor-icon undo');

        // Update

        $fields.select('.KDSEditor-form-label-button-wrap .remove-icon')
            .on('click', remove);

        $fields.select('.modified-icon')
            .on('click', revert);

        $fields
            .order()
            .classed('modified', function(field) {
                return field.modified();
            })
            .classed('present', function(field) {
                return field.present();
            })
            .each(function(field) {
                var reference = iD.ui.TagReference(field.reference || {key: field.key});

                if (state === 'hover') {
                    reference.showing(false);
                }

                d3.select(this)
                    .call(field.input)
                    .call(reference.body)
                    .select('.KDSEditor-form-label-button-wrap')
                    .call(reference.button);

                field.input.tags(tags);
            });

        $fields.exit()
            .remove();

        var $more = selection.selectAll('.more-buttons')
            .data([0]);

        $more.enter().append('div')
            .attr('class', 'more-buttons KDSEditor-inspector-inner');

        var $buttons = $more.selectAll('.preset-add-field')
            .data(notShown, fieldKey);

        $buttons.enter()
            .append('button')
            .attr('class', 'preset-add-field')
            .call(bootstrap.tooltip()
                .placement('top')
                .title(function(d) { return d.label(); }))
            .append('span')
            .attr('class', function(d) { return 'KDSEditor-icon ' + d.icon; });

        $buttons.on('click', show);

        $buttons.exit()
            .remove();

        function show(field) {
            field.show = true;
            presets(selection);
            field.input.focus();
        }

        function revert(field) {
            d3.event.stopPropagation();
            d3.event.preventDefault();
            event.change(field.revert());
        }

        function remove(field) {
            d3.event.stopPropagation();
            d3.event.preventDefault();
            event.change(field.remove());
        }
    }

    presets.preset = function(_) {
        if (!arguments.length) return preset;
        if (preset && preset.id === _.id) return presets;
        preset = _;
        fields = null;
        return presets;
    };

    presets.state = function(_) {
        if (!arguments.length) return state;
        state = _;
        return presets;
    };

    presets.tags = function(_) {
        if (!arguments.length) return tags;
        tags = _;
        // Don't reset fields here.
        return presets;
    };

    presets.entityID = function(_) {
        if (!arguments.length) return id;
        if (id === _) return presets;
        id = _;
        fields = null;
        return presets;
    };

    return d3.rebind(presets, event, 'on');
};
