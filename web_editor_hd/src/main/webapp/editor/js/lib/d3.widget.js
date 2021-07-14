;;(function( d3 ) {

    var rnowhite = /\S+/g;
    var reventType = /^([.\w:-]*)\s*(.*)$/;
    var rprivate = /^_/;

    var widgetUuid = 0;

    var noop = function() {};

    var extend = function( target ) {
        var input = Array.prototype.slice.call( arguments, 1 );
        var inputIndex = 0;
        var inputLength = input.length;
        var key;
        var value;

        for ( ; inputIndex < inputLength; inputIndex++ ) {
            for ( key in input[ inputIndex ] ) {
                value = input[ inputIndex ][ key ];
                if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

                    // Clone objects
                    if ( value && value.constructor === Object ) {
                        target[ key ] = target[ key ] && target[ key ].constructor === Object ?
                            extend( {}, target[ key ], value ) :

                                // Don't extend strings, arrays, etc. with objects
                                extend( {}, value );

                                // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    d3.selection.prototype.remove = function() {
        return this.each( function() {
            var parent = this.parentNode;
            if (parent) {
                parent.removeChild(this);
                this.dispatchEvent(new UIEvent('remove'));
            }
        } );
    };

    d3.widget = function( name, base, prototype ) {
        var constructor, basePrototype;

        // ProxiedPrototype allows the provided prototype to remain unmodified
        // so that it can be used as a mixin for multiple widgets (#8876)
        var proxiedPrototype = {};

        if ( !prototype ) {
            prototype = base;
            base = d3.Widget;
        }

        if ( Array.isArray( prototype ) ) {
            prototype = extend.apply( null, [ {} ].concat( prototype ) );
        }

        var bak = window[name];
        window.eval(`var ${name} = function ${name}( selection, options ) {

            // Allow instantiation without "new" keyword
            if ( !this._createWidget ) {
                return new ${name}( selection, options );
            }

            // Allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if ( arguments.length ) {
                this._createWidget( selection, options );
            }
        }`);
        constructor = window[name];
        if (typeof bak === 'undefined') {
            delete window[name];
        }
        else {
            window[name] = bak;
        }

        // Extend with the existing constructor to carry over any static properties
        extend( constructor, {
            version: prototype.version,

            // Copy the object used to create the prototype in case we need to
            // redefine the widget later
            _proto: extend( {}, prototype )
        } );

        basePrototype = new base();

        // We need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = extend( {}, basePrototype.options );
        Object.keys(prototype).forEach( function( prop ) {
            var value = prototype[ prop ];
            if ( typeof value !== 'function' ) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = ( function() {
                function _super() {
                    return base.prototype[ prop ].apply( this, arguments );
                }

                function _superApply( args ) {
                    return base.prototype[ prop ].apply( this, args );
                }

                return function() {
                    var __super = this._super;
                    var __superApply = this._superApply;
                    var returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            } )();
        } );
        constructor.prototype = extend( basePrototype, {

            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g., draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: name
        }, proxiedPrototype, {
            constructor: constructor,
            widgetName: name,
        } );

        return constructor;
    };


    d3.Widget = function() {};

    d3.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "div",

        options: {
            classes: {},
            disabled: false
        },

        events: {},

        _createWidget: function( selection, options ) {
            this.element = d3.$(selection || document.createElement(this.defaultElement));
            this.uuid = widgetUuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;

            this.hoverable = [];
            this.focusable = [];
            this.bindings = {};
            this.classesElementLookup = {};
            this.dispatched = [];

            var element = this.element.node();

            this._on( true, this.element, {
                remove: function() {
                    if ( d3.event.target === element ) {
                        this.destroy();
                    }
                }
            } );
            this.document = d3.select( element.style ?

              // Element within the document
              element.ownerDocument :

              // Element is window or document
              element.document || element );
              this.window = d3.select( this.document.node().defaultView || this.document.node().parentWindow );

            this.options = extend( {}, this.options, this._getCreateOptions(), options );

            this._on( this.events );
            this._create();

            if ( this.options.disabled ) {
                this._setOptionDisabled( this.options.disabled );
            }

            this._dispatch( "create", this._getCreateEventData() );
        },

        _getCreateOptions: function() {
            return {};
        },

        _getCreateEventData: noop,

        _create: noop,

        destroy: function() {
            var that = this;

            this._destroy();
            Object.keys(this.classesElementLookup).forEach( function( key ) {
                that._removeClass(  that.classesElementLookup[ key ], key );
            } );

            // We can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element.on( this.eventNamespace, null );
            this.widget().on( this.eventNamespace, null );

            // Clean up events and states
            Object.keys(this.bindings).forEach( function ( eventName ) {
                that.bindings[ eventName ].forEach( function ( element ) {
                    element.on( that.eventNamespace, null );
                } );
            } );
        },

        _destroy: noop,

        widget: function() {
            return this.element;
        },

        option: function( key, value ) {
            var options = key;
            var parts;
            var curOption;
            var i;

            if ( arguments.length === 0 ) {

                // Don't return a reference to the internal hash
                return extend( {}, this.options );
            }

            if ( typeof key === "string" ) {

                // Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split( "." );
                key = parts.shift();
                if ( parts.length ) {
                    curOption = options[ key ] = extend( {}, this.options[ key ] );
                    for ( i = 0; i < parts.length - 1; i++ ) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if ( arguments.length === 1 ) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if ( arguments.length === 1 ) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions( options );

            return this;
        },

        _setOptions: function( options ) {
            var key;

            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }

            return this;
        },

        _setOption: function( key, value ) {
            if ( key === "classes" ) {
                this._setOptionClasses( value );
            }

            this.options[ key ] = value;

            if ( key === "disabled" ) {
                this._setOptionDisabled( value );
            }

            return this;
        },

        _setOptionClasses: function( value ) {
            var classKey, elements, currentElements;

            for ( classKey in value ) {
                currentElements = this.classesElementLookup[ classKey ];
                if ( value[ classKey ] === this.options.classes[ classKey ] ||
                    !currentElements ||
                    !currentElements.length ) {
                        continue;
                    }

                    // We are doing this to create a new jQuery object because the _removeClass() call
                    // on the next line is going to destroy the reference to the current elements being
                    // tracked. We need to save a copy of this collection so that we can add the new classes
                    // below.
                    elements = d3( currentElements.get() );
                    this._removeClass( currentElements, classKey );

                    // We don't use _addClass() here, because that uses this.options.classes
                    // for generating the string of classes. We want to use the value passed in from
                    // _setOption(), this is the new value of the classes option which was passed to
                    // _setOption(). We pass this value directly to _classes().
                    elements.classed( this._classes( {
                        element: elements,
                        keys: classKey,
                        classes: value,
                        add: true
                    } ), true );
            }
        },

        _setOptionDisabled: function( value ) {
            this._toggleClass( this.widget(), "ui-state-disabled", null, !!value );

            // If the widget is becoming disabled, then nothing is interactive
            if ( value ) {
                this._removeClass( this.hoverable, null, "ui-state-hover" );
                this._removeClass( this.focusable, null, "ui-state-focus" );
            }
        },

        enable: function() {
            return this._setOptions( { disabled: false } );
        },

        disable: function() {
            return this._setOptions( { disabled: true } );
        },

        _classes: function( options ) {
            var full = [];
            var that = this;

            options = extend( {
                element: this.element,
                classes: this.options.classes || {}
            }, options );

            function processClassString( classes, checkOption ) {
                var current, i;
                for ( i = 0; i < classes.length; i++ ) {
                    current = that.classesElementLookup[ classes[ i ] ] || d3.selectAll([]);
                    if ( options.add ) {
                        //current = d3( d3.unique( current.get().concat( options.element.get() ) ) );
                        current = d3.selectAll( ( current[ 0 ].concat( options.element[ 0 ] ) ) );
                    } else {
                        //current = d3( current.not( options.element ).get() );
                        current = current.filter( function() {
                            var e = this;
                            return !options.element.some( function(element) {
                                return e === element;
                            } );
                        } );
                    }
                    that.classesElementLookup[ classes[ i ] ] = current;
                    full.push( classes[ i ] );
                    if ( checkOption && options.classes[ classes[ i ] ] ) {
                        full.push( options.classes[ classes[ i ] ] );
                    }
                }
            }

            if ( options.keys ) {
                processClassString( options.keys.match( rnowhite ) || [], true );
            }
            if ( options.extra ) {
                processClassString( options.extra.match( rnowhite ) || [] );
            }

            return full.join( " " );
        },

        _removeClass: function( element, keys, extra ) {
            return this._toggleClass( element, keys, extra, false );
        },

        _addClass: function( element, keys, extra ) {
            return this._toggleClass( element, keys, extra, true );
        },

        _toggleClass: function( element, keys, extra, add ) {
            add = ( typeof add === "boolean" ) ? add : extra;
            var shift = ( typeof element === "string" || element === null ),
                options = {
                    extra: shift ? keys : extra,
                    keys: shift ? element : keys,
                    element: shift ? this.element : element,
                    add: add
                };
                options.element.classed( this._classes( options ), add );
                return this;
        },

        on: function( type, handler ) {
            if (this.dispatched) {
                var i = this.dispatched.indexOf(type);
                if (i > -1) {
                    handler.apply(this, arguments);
                    this.dispatched.splice(i, 1);
                    if (this.dispatched.length === 0) {
                        this.dispatched = null;
                    }
                }
            }
            type = (this.widgetEventPrefix + ":" + type).toLowerCase();
            this._on({[type]: function () {
                handler.apply(this, Array.prototype.slice.call(arguments, 3));
            }});
        },

        _on: function( suppressDisabledCheck, element, handlers ) {
            var delegateElement;
            var instance = this;

            // No suppressDisabledCheck flag, shuffle arguments
            if ( typeof suppressDisabledCheck !== "boolean" ) {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // No element argument, shuffle and use this.element
            if ( !handlers ) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                delegateElement = element = d3.$$(element);
            }

            Object.keys(handlers).forEach( function( event ) {
                var handler = handlers[event];

                function handlerProxy() {

                    // Allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if ( !suppressDisabledCheck &&
                        ( instance.options.disabled === true ||
                        ( d3.event.target.closest && d3.event.target.closest( ".ui-state-disabled" ) ) ) ) {
                             return;
                         }
                         return ( typeof handler === "string" ? instance[ handler ] : handler )
                         .apply( instance, arguments );
                }

                var match = event.match( reventType );
                var eventName = match[ 1 ] + instance.eventNamespace;
                var selector = match[ 2 ];

                if ( selector ) {
                    delegateElement.on( eventName, selector, handlerProxy );
                } else {
                    element.on( eventName, handlerProxy );
                }

                element.each( function () {
                    if (this !== instance.element.node() && this !== instance.widget().node()) {
                        instance[ match[ 1 ] ] = instance[ match[ 1 ] ] || [];
                        instance[ match[ 1 ] ].push(element);
                    }
                } );
            } );
        },

        off: function ( type ) {
            type = (this.widgetEventPrefix + ":" + type).toLowerCase();
            this._off( this.element, type );
        },

        _off: function( element, eventName ) {
            if (arguments.length === 1) {
                eventName = element;
                element = this.element;
            }
            eventName += this.eventNamespace;
            element.on( eventName, null );

            // Clear the stack to avoid memory leaks
            var elements = this.bindings[eventName], i, j, e;
            if (elements) {
                for ( i = 0 ; i < elements.length ; i += 1) {
                    if ( elements[ i ].size() !== element.size() ) {
                        continue;
                    }
                    for ( j = 0 ; j < elements[ i ].size() ; j += 1) {
                        if (elements[ i ][ j ] !== element [j] ) {
                            break;
                        }
                    }
                    if ( j === elements[ i ].size() ) {
                        elements.splice( i, 1 );
                        i -= 1;
                    }
                }
            }
        },

        _delay: function( handler, delay ) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        },

        /*_hoverable: function( element ) {
            this.hoverable = this.hoverable.push( element );
            this._on( element, {
                mouseenter: function( event ) {
                    this._addClass( d3( event.currentTarget ), null, "ui-state-hover" );
                },
                mouseleave: function( event ) {
                    this._removeClass( d3( event.currentTarget ), null, "ui-state-hover" );
                }
            } );
        },

        _focusable: function( element ) {
            this.focusable = this.focusable.push( element );
            this._on( element, {
                focusin: function( event ) {
                    this._addClass( d3( event.currentTarget ), null, "ui-state-focus" );
                },
                focusout: function( event ) {
                    this._removeClass( d3( event.currentTarget ), null, "ui-state-focus" );
                }
            } );
        },*/

        _dispatch: function( type/*, ...data*/ ) {
            var data = Array.prototype.slice.call(arguments, 1);
            if (this.dispatched) {
                this.dispatched.push(type);
            }
            type = (this.widgetEventPrefix + ":" + type).toLowerCase();
            data.unshift(type);
            this.element.dispatch.apply(this.element, data);
        }
    };

    return d3.widget;

})(d3);
