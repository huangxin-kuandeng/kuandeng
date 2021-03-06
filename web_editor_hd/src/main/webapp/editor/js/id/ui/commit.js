iD.ui.Commit = function(context) {
    var event = d3.dispatch('cancel', 'save');

    function commit(selection) {
        var changes = context.history().changes(),
            summary = context.history().difference().summary();

        function zoomToEntity(change) {
            var entity = change.entity;
            if (change.changeType !== 'deleted' &&
                context.graph().entity(entity.id).geometry(context.graph()) !== 'vertex') {
                context.map().zoomTo(entity);
                context.surface().selectAll(
                    iD.util.entityOrMemberSelector([entity.id], context.graph()))
                    .classed('hover', true);
            }
        }

        var header = selection.append('div')
            .attr('class', 'KDSEditor-header KDSEditor-fillL');

        header.append('button')
            .attr('class', 'KDSEditor-fr')
            .on('click', event.cancel)
            .append('span')
            .attr('class', 'KDSEditor-icon close');

        header.append('h3')
            .text(t('commit.title'));

        var body = selection.append('div')
            .attr('class', 'body');

        // Comment Section
        var commentSection = body.append('div')
            .attr('class', 'modal-section KDSEditor-form-field commit-form');

        commentSection.append('label')
            .attr('class', 'KDSEditor-form-label')
            .text(t('commit.message_label'));

        var commentField = commentSection.append('textarea')
            .attr('placeholder', t('commit.description_placeholder'))
            .property('value', context.storage('comment') || '')
            .on('blur.save', function () {
                context.storage('comment', this.value);
            });

        commentField.node().select();

        // Warnings
        var warnings = body.selectAll('div.warning-section')
            .data([iD.validate(changes, context.graph())])
            .enter()
            .append('div')
            .attr('class', 'modal-section warning-section KDSEditor-fillL2')
            .style('display', function(d) { return _.isEmpty(d) ? 'none' : null; })
            .style('background', '#ffb');

        warnings.append('h3')
            .text(t('commit.warnings'));

        var warningLi = warnings.append('ul')
            .attr('class', 'changeset-list')
            .selectAll('li')
            .data(function(d) { return d; })
            .enter()
            .append('li')
            .style()
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('click', warningClick);

        warningLi.append('span')
            .attr('class', 'alert KDSEditor-icon KDSEditor-icon-pre-text');

        warningLi.append('strong').text(function(d) {
            return d.message;
        });

        warningLi.filter(function(d) { return d.tooltip; })
            .call(bootstrap.tooltip()
                .title(function(d) { return d.tooltip; })
                .placement('top')
            );

        // Save Section
        var saveSection = body.append('div')
            .attr('class','modal-section KDSEditor-fillL cf');

        // Confirm Button
        var saveButton = saveSection.append('button')
            .attr('class', 'action KDSEditor-col4 button')
            .on('click.save', function() {
                event.save({
                    comment: commentField.node().value
                });
            });

        saveButton.append('span')
            .attr('class', 'label')
            .text(t('commit.save'));

        var changeSection = body.selectAll('div.commit-section')
            .data([0])
            .enter()
            .append('div')
            .attr('class', 'commit-section modal-section KDSEditor-fillL2');

        changeSection.append('h3')
            .text(summary.length + ' Changes');

        var li = changeSection.append('ul')
            .attr('class', 'changeset-list')
            .selectAll('li')
            .data(summary)
            .enter()
            .append('li')
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('click', zoomToEntity);

        li.append('span')
            .attr('class', function(d) {
                return d.entity.geometry(d.graph) + ' ' + d.changeType + ' KDSEditor-icon KDSEditor-icon-pre-text';
            });

        li.append('span')
            .attr('class', 'change-type')
            .text(function(d) {
                return d.changeType + ' ';
            });

        li.append('strong')
            .attr('class', 'entity-type')
            .text(function(d) {
                return context.presets().match(d.entity, d.graph).name();
            });

        li.append('span')
            .attr('class', 'entity-name')
            .text(function(d) {
                var name = iD.util.displayName(d.entity) || '',
                    string = '';
                if (name !== '') string += ':';
                return string += ' ' + name;
            });

        li.style('opacity', 0)
            .transition()
            .style('opacity', 1);

        li.style('opacity', 0)
            .transition()
            .style('opacity', 1);

        function mouseover(d) {
            if (d.entity) {
                context.surface().selectAll(
                    iD.util.entityOrMemberSelector([d.entity.id], context.graph())
                ).classed('hover', true);
            }
        }

        function mouseout() {
            context.surface().selectAll('.hover')
                .classed('hover', false);
        }

        function warningClick(d) {
            if (d.entity) {
                context.map().zoomTo(d.entity);
                context.enter(
                    iD.modes.Select(context, [d.entity.id])
                        .suppressMenu(true));
            }
        }
    }

    return d3.rebind(commit, event, 'on');
};
