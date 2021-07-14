;;(function (d3) {

    function d3_selection_selector(selector) {
        return typeof selector === "function" ? selector : function() {
            return this.querySelector(selector);
        };
    }

    d3.$ = function (nodes, context) {
        if (nodes && nodes.d3 === d3.version) {
            return d3.select(nodes.node());
        }
        else {
            if (context) {
                context = d3.$$(context);
                var selector = d3_selection_selector(nodes);
                var subgroups = [], subgroup, subnode, group, node;
                for (var j = -1, m = context.length; ++j < m;) {
                    subgroups.push(subgroup = []);
                    subgroup.parentNode = (group = context[j]).parentNode;
                    for (var i = -1, n = group.length; ++i < n;) {
                        if (node = group[i]) {
                            subgroup.push(subnode = selector.call(node, node.__data__, i, j));
                        }
                        else {
                            subgroup.push(null);
                        }
                    }
                }
                Object.setPrototypeOf(subgroups, d3.selection.prototype);
                return subgroups;
            }
            else {
                return d3.select(nodes);
            }
        }
    };

    d3.$$ = function (nodes, context) {
        if (nodes && nodes.d3 === d3.version) {
            return nodes;
        }
        else {
            if (nodes.nodeType) {
                nodes = [nodes];
            }
            return (context ? d3.$$(context) : d3).selectAll(nodes);
        }
    };

    d3.selection.prototype.d3 = d3.version;

    d3.selection.prototype.nodes = function () {
        return _.uniq(_.flatten(this));
    };

    d3.selection.prototype.dispatch = function (type/*, ...data*/) {
        var eventInit = {bubbles: true};
        var data = Array.prototype.slice.call(arguments, 1);
        if (data.length) {
            eventInit.detail = data;
        }
        return this.each(function () {
            var customEvent = new CustomEvent(type, eventInit);
            this.dispatchEvent(customEvent);
        });
    };

    //var rwhite = /[\x20]+/;
    var reventType = /^([.\w:-]*)\s*(.*)$/;
    //var rneedsContext = /^[\x20\t\r\n\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i;

    var dispatch = function (selector, listener, args) {
        var current = d3.event.target, trigger = false;

        if (!selector) {
            listener.apply(this, args.concat(d3.event.detail || []));
            return;
        }

        var delegateElements = Array.from(this.querySelectorAll(selector));

        for (; current && current !== this ; current = current.parentNode) {
            trigger = delegateElements.some(function (element) {
                return element === current;
            });
            if (trigger) {
                listener.apply(this, args.concat(d3.event.detail || []));
                break;
            }
        }
    };

    var d3On = d3.selection.prototype.on;

    d3.selection.prototype.on = function (type, selector, listener, capture) {
        if (typeof type === 'object') {
            return d3On.call(this, type, (typeof selector === 'boolean' ? selector : false));
        }
        if (typeof selector !== 'string') {
            capture = listener;
            listener = selector;
            selector = null;
        }
        if (typeof listener === 'undefined') {
            return d3On.call(this, type);
        }
        return d3On.call(this, type, listener ? function () {
            dispatch.call(this, selector, listener, Array.from(arguments));
        } : listener, capture);
    };

})(d3);
