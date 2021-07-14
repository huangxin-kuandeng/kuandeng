iD.ui.confirm = function(selection) {
    var modal = iD.ui.modal(selection);

    modal.select('.modal')
        .classed('modal-alert', true);

    var section = modal.select('.KDSEditor-content');

    section.append('div')
        .attr('class', 'modal-section KDSEditor-header');

    section.append('div')
        .attr('class', 'modal-section message-text');

    var buttonwrap = section.append('div')
        .attr('class', 'modal-section buttons cf');

    buttonwrap.append('button')
        .attr('class', 'KDSEditor-col2 action')
        .on('click.confirm', function() {
            modal.remove();
        })
        .text(t('confirm.okay'));

    return modal;
};
