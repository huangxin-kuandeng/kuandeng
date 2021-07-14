/**
 * Created by tao.w on 2016/1/11.
 */
iD.behavior.ediftorWay = function() {
    function d3_eventCancel() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
    }

    var event = d3.dispatch('start', 'move', 'end','off'),
        origin = null,
        selector = '',
        node = null,
        filter = null,
        event_, target, surface;

    event.of = function(thiz, argumentz) {
        return function(e1) {
            var e0 = e1.sourceEvent = d3.event;
            e1.target = drag;
            d3.event = e1;
            //if(argumentz.length && argumentz[0] instanceof iD.Way){
                argumentz[0] = node;
            //}

            try {
                event[e1.type].apply(thiz, argumentz);
            } finally {
                d3.event = e0;
            }
        };
    };

    var d3_event_userSelectProperty = iD.util.prefixCSSProperty('UserSelect'),
        d3_event_userSelectSuppress = d3_event_userSelectProperty ?
            function () {
                var selection = d3.selection(),
                    select = selection.style(d3_event_userSelectProperty);
                selection.style(d3_event_userSelectProperty, 'none');
                return function () {
                    selection.style(d3_event_userSelectProperty, select);
                };
            } :
            function (type) {
                var w = d3.select(window).on('selectstart.' + type, d3_eventCancel);
                return function () {
                    w.on('selectstart.' + type, null);
                };
            };

    function mousedown() {
        target = this;
        event_ = event.of(this, arguments);
        var eventTarget = d3.event.target,
            touchId = d3.event.touches ? d3.event.changedTouches[0].identifier : null,
            offset,
            origin_ = point(),
            started = false,
            selectEnable = d3_event_userSelectSuppress(touchId !== null ? 'drag-' + touchId : 'drag');

        var w = d3.select(window)
            .on(touchId !== null ? 'touchmove.editorway-' + touchId : 'mousemove.editorway', dragmove)
            .on(touchId !== null ? 'touchend.editorway-' + touchId : 'mouseup.editorway', dragend, true);

        //if (origin) {
        //    offset = origin.apply(target, arguments);
        //    offset = [offset[0] - origin_[0], offset[1] - origin_[1]];
        //} else {
            offset = [0, 0];
        //}

        if (touchId === null) d3.event.stopPropagation();

        function point() {
            var p = target.parentNode || surface;
            return touchId !== null ? d3.touches(p).filter(function(p) {
                return p.identifier === touchId;
            })[0] : d3.mouse(p);
        }

        function dragmove() {

            var p = point(),
                dx = p[0] - origin_[0],
                dy = p[1] - origin_[1];

            if (dx === 0 && dy === 0)
                return;

            if (!started) {
                started = true;
                event_({
                    type: 'start'
                });
                //event.start(node);
            }

            origin_ = p;
            d3_eventCancel();

            event_({
                type: 'move',
                point: [p[0] + offset[0],  p[1] + offset[1]],
                delta: [dx, dy]
            });
            //event.move(node);
        }

        function dragend() {
            if (started) {
                event_({
                    type: 'end'
                });
                //event.end(node);

                d3_eventCancel();
                if (d3.event.target === eventTarget) w.on('click.editorway', click, true);
            }

            w.on(touchId !== null ? 'touchmove.editorway-' + touchId : 'mousemove.editorway', null)
                .on(touchId !== null ? 'touchend.editorway-' + touchId : 'mouseup.editorway', null);
            selectEnable();
        }

        function click() {
            d3_eventCancel();
            w.on('click.editorway', null);
        }
    }

    function drag(selection) {
        var matchesSelector = iD.util.prefixDOMProperty('matchesSelector'),
            delegate = mousedown;

        if (selector) {
            delegate = function() {
                var root = this,
                    target = d3.event.target;
                for (; target && target !== root; target = target.parentNode) {
                    if ((target[matchesSelector]("path") || target[matchesSelector](selector)) && node!=null) {
                        return mousedown.call(target, target.__data__);
                    }
                }
            };
        }

        selection.on('mousedown.editor_way' + selector, delegate)
            .on('touchstart.editor_way' + selector, delegate);
    }

    drag.off = function(selection) {
        selection.on('mousedown.editor_way' + selector, null)
            .on('touchstart.editor_way' + selector, null);
        event_&&event_({
            type: 'off'
        });
    };

    drag.node = function(_) {
        if (!arguments.length) return node;
        node = _;
        return drag;
    };
    drag.delegate = function(_) {
        if (!arguments.length) return selector;
        selector = _;
        return drag;
    };

    drag.filter = function(_) {
        if (!arguments.length) return origin;
        filter = _;
        return drag;
    };

    drag.origin = function (_) {
        if (!arguments.length) return origin;
        origin = _;
        return drag;
    };

    drag.cancel = function() {
        d3.select(window)
            .on('mousemove.editor_way', null)
            .on('mouseup.editor_way', null);
        return drag;
    };

    drag.target = function() {
        //if (!arguments.length) return target;
        //target = arguments[0];
        //event_ = event.of(target, Array.prototype.slice.call(arguments, 1));
        return drag;
    };

    drag.surface = function() {
        if (!arguments.length) return surface;
        surface = arguments[0];
        return drag;
    };

    return d3.rebind(drag, event, 'on');
};
