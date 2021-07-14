// 'use strict';
//
// var rposition = /^([a-z]+)([+-]\d+)?$/;
//
// module.exports = d3.widget( 'dialog', {
//     options: {
//         appendTo: 'body',
//         autoOpen: true,
//         buttons: [],
//         closeOnEscape: true,
//         draggable: true,
//         resizable: false,
//         width: 300,
//         height: 'auto',
//         modal: false,
//         title: null,
//         position: {
//             of: window,
//             at: 'center middle',
//             my: 'center middle'
//         },
//         destroyOnClose: true,
//
//         // Callbacks
//         beforeClose: null,
//         close: null,
//         open: null
//     },
//
//     sizeRelatedOptions: {
//         buttons: true,
//         height: true,
//         width: true
//     },
//
//     _create: function() {
//         // Dialogs can't be disabled
//         if ( this.options.disabled ) {
//             this.options.disabled = false;
//         }
//
//         this.uiAppendTo = d3.$(this.options.appendTo);
//
//         this._createWrapper();
//         this._createTitlebar();
//
//         this.uiDialog.node().appendChild(this.element.node());
//
//         this._addClass( 'ui-dialog-content' );
//
//         this._createButtonPane();
//
//         if ( this.options.draggable ) {
//             this._makeDraggable();
//         }
//
//         if ( this.options.resizable ) {
//             this._makeResizable();
//         }
//
//         this._isOpen = false;
//
//         if ( this.options.autoOpen ) {
//             this.open();
//         }
//     },
//
//     _destroy: function() {
//         this._keybinding.off();
//
//         this.uiDialog.remove();
//         this._destroyOverlay();
//     },
//
//     widget: function() {
//         return this.uiDialog;
//     },
//
//     disable: function(){},
//     enable: function(){},
//
//     close: function() {
//         if ( !this._isOpen || this._dispatch( 'beforeClose' ) === false ) {//TODO iscancelled
//             return;
//         }
//
//         this._isOpen = false;
//         this._destroyOverlay();
//
//         this.uiDialog.style('display', 'none');
//         this._dispatch( 'close' );
//         if (this.options.destroyOnClose) {
//             this.destroy();
//         }
//     },
//
//     isOpen: function() {
//         return this._isOpen;
//     },
//
//     moveToTop: function() {
//         this._moveToTop();
//     },
//
//     _moveToTop: function() {
//         var that = this,
//             zIndices = [],
//             zIndexMax;
//
//         d3.$$('.ui-dialog').each(function () {
//             if (this !== that.uiDialog.node()) {
//                 zIndices.push(+this.style.zIndex);
//             }
//         });
//
//         zIndexMax = Math.max.apply( null, zIndices );
//
//         if ( zIndexMax >= +this.uiDialog.style( 'z-index' ) ) {
//             this.uiDialog.style( 'z-index', zIndexMax + 1 );
//         }
//     },
//
//     open: function() {
//         var that = this;
//         if ( this._isOpen ) {
//             this._moveToTop();
//             return;
//         }
//
//         this._isOpen = true;
//
//         this.uiDialog.style('display', 'block');
//
//         this._size();
//         this._position();
//         this._createOverlay();
//         this._moveToTop();
//
//         // Ensure the overlay is moved to the top with the dialog, but only when
//         // opening. The overlay shouldn't move after the dialog is open so that
//         // modeless dialogs opened after the modal dialog stack properly.
//         if ( this.overlay ) {
//             this.overlay.style( 'z-index', this.uiDialog.style( 'z-index' ) - 1 );
//         }
//
//         this._dispatch( 'open' );
//     },
//
//     _createWrapper: function() {
//         this.uiDialog = this.uiAppendTo.append('div');
//         this.uiDialog.style('position', 'absolute');
//         this.uiDialog.style('display', 'none');
//
//         this._addClass( this.uiDialog, 'ui-dialog', 'common-dialog ui-helper-front' );
//
//         this._on( this.uiDialog, {
//             mousedown: '_moveToTop'
//         } );
//
//         this._keybinding = d3.keybinding('dialog').on('↩', this.close.bind(this));
//         d3.select(document).call(this._keybinding);
//         //this.uiDialog.call(this._keybinding);
//     },
//
//     _createTitlebar: function() {
//         this.uiDialogTitlebar = this.uiDialog.append('div');
//         this._addClass( this.uiDialogTitlebar, 'ui-dialog-titlebar' );
//
//         var uiDialogTitle = this.uiDialogTitlebar.append('div');
//         uiDialogTitle.html(this.options.title || '&#160;');
//         this._addClass( uiDialogTitle, 'ui-dialog-title' );
//
//         this.uiDialogTitlebarClose = this.uiDialogTitlebar.append('div');
//         this._addClass( this.uiDialogTitlebarClose, 'ui-dialog-titlebar-close iconfont icon-close' );
//         this._on( this.uiDialogTitlebarClose, {
//             click: function() {
//                 d3.event.preventDefault();
//                 this.close();
//             }
//         } );
//     },
//
//     _createButtonPane: function() {
//         this.uiDialogButtonPane = d3.$(document.createElement('div'));
//         this._addClass( this.uiDialogButtonPane, 'ui-dialog-buttonpane' );
//
//         this.uiButtonSet = this.uiDialogButtonPane.append('div');
//         this._addClass( this.uiButtonSet, 'ui-dialog-buttonset' );
//
//         this._createButtons();
//     },
//
//     _createButtons: function() {
//         var buttons = this.uiButtonSet.selectAll('button').data(this.options.buttons);
//         buttons.enter().append('button');
//         buttons.attr('class', function (d) {
//             return 'button ' + (d.classname || '');
//         });
//         buttons.html(function (d) {
//             return d.text;
//         });
//         buttons.exit().remove();
//         this._off(this.uiButtonSet);
//         this._on(this.uiButtonSet, {
//             'click button': function() {
//                 d3.event.target.__data__.click.apply( this, arguments );
//             }
//         });
//         if (this.options.buttons.length) {
//             this.uiDialog.node().appendChild(this.uiDialogButtonPane.node());
//             this._addClass( this.uiDialog, 'ui-dialog-buttons' );
//         }
//         else {
//             this._removeClass( this.uiDialog, 'ui-dialog-buttons' );
//         }
//     },
//
//     _makeDraggable: function() {
//         var dx, dy, mx, my, crt;
//         this.uiDialogTitlebar.property('draggable', true);
//         this._on(this.uiDialogTitlebar, {
//             'dragstart': function () {
//                 d3.event.dataTransfer.effectAllowed = 'move';
//                 crt = document.createElement('div');
//                 crt.style.cssText = 'position: absolute; width: 10px; height: 10px; visibility: hidden;';
//                 document.body.appendChild(crt);
//                 d3.event.dataTransfer.setDragImage(crt, 0, 0);
//                 var rect = this.uiDialog.node().getBoundingClientRect();
//                 dx = rect.left;
//                 dy = rect.top;
//                 mx = d3.event.pageX;
//                 my = d3.event.pageY;
//             },
//             'drag': function () {
//                 if (d3.event.pageX === 0 && d3.event.pageY === 0) {
//                     return;
//                 }
//                 var deltaX = d3.event.pageX - mx;
//                 var deltaY = d3.event.pageY - my;
//                 this.uiDialog.style('left', dx + deltaX + 'px');
//                 this.uiDialog.style('top', dy + deltaY  + 'px');
//             },
//             'dragend': function () {
//                 document.body.removeChild(crt);
//                 crt = null;
//             },
//             'dragover': function () {
//                 d3.event.preventDefault();
//             }
//         });
//     },
//
//     _makeResizable: function () {
//         var isResizing = false;
//         var cursorPos = [];
//         var mode;
//         var xreverse;
//         var yreverse;
//         this._on(this.uiDialog, {
//             'mousemove.resizable': function () {
//                 var rect = this.uiDialog.node().getBoundingClientRect();
//                 var x = d3.event.x;
//                 var y = d3.event.y;
//                 var cursorMap = {
//                     '10': 'ew-resize',
//                     '-10': 'ew-resize',
//                     '20': 'ns-resize',
//                     '-20': 'ns-resize',
//                     '200': 'nwse-resize',
//                     '-200': 'nesw-resize'
//                 };
//                 var cursor;
//                 cursorPos = [];
//                 if (Math.abs(rect.left - x) < 20) {
//                     cursorPos[0] = 10;
//                 }
//                 else if (Math.abs(rect.right - x) < 20) {
//                     cursorPos[1] = -10;
//                 }
//                 if (Math.abs(rect.top - y) < 20) {
//                     cursorPos[2] = 20;
//                 }
//                 else if (Math.abs(rect.bottom - y) < 20) {
//                     cursorPos[3] = -20;
//                 }
//                 cursorPos = cursorPos.filter(function (p) {
//                     return typeof p === 'number';
//                 });
//                 //if (cursorPos.length === 1) {
//                 //    cursor = cursorMap[cursorPos[0]];
//                 //}
//                 if (cursorPos.length === 2) {
//                     cursor = cursorMap[cursorPos[0] * cursorPos[1]];
//                 }
//                 else {
//                     cursor = 'auto';
//                 }
//                 this.uiDialog.style('cursor', cursor);
//             },
//             'mousedown.resizable': function () {
//                 if (d3.event.buttons === 1 && cursorPos.length === 2) {
//                     isResizing = true;
//                     if (cursorPos.length === 2) {
//                         mode = 2;
//                     }
//                     else if (cursorPos.length === 1) {
//                         if (Math.abs(cursorPos[0]) === 10) {
//                             mode = 0;
//                         }
//                         else {
//                             mode = 1;
//                         }
//                     }
//                 }
//             }
//         });
//
//         this._on(document, {
//             'mousemove.dialogresizable': function () {
//                 if (isResizing) {
//                     var rect = this.uiDialog.node().getBoundingClientRect();
//                     if (mode !== 1 && d3.event.movementX) {
//                         if (typeof xreverse !== 'boolean') {
//                             xreverse = d3.event.pageX < rect.left + rect.width / 2;
//                         }
//                         if (xreverse) {
//                             this.uiDialog.style('left', rect.left + d3.event.movementX + 'px');
//                             this.uiDialog.style('width', rect.width - d3.event.movementX + 'px');
//                         }
//                         else {
//                             this.uiDialog.style('width', rect.width + d3.event.movementX + 'px');
//                         }
//                     }
//                     if (mode !== 0 && d3.event.movementY) {
//                         if (typeof yreverse !== 'boolean') {
//                             yreverse = d3.event.pageY < rect.top + rect.height / 2;
//                         }
//                         if (yreverse) {
//                             this.uiDialog.style('top', rect.top + d3.event.movementY + 'px');
//                             this.element.style('height', this.element.node().getBoundingClientRect().height - d3.event.movementY + 'px');
//                         }
//                         else {
//                             this.element.style('height', this.element.node().getBoundingClientRect().height + d3.event.movementY + 'px');
//                         }
//                     }
//                     d3.event.preventDefault();
//                 }
//             },
//             'mouseup.dialogresizable': function () {
//                 isResizing = false;
//                 mode = null;
//                 xreverse = null;
//                 yreverse = null;
//             }
//         });
//     },
//
//     _position: function() {
//         var getRect = function (element) {
//             var rect;
//             if (element === window) {
//                 rect = {
//                     left: 0,
//                     top: 0,
//                     width: window.innerWidth,
//                     height: window.innerHeight
//                 };
//             }
//             else {
//                 rect = element.getBoundingClientRect();
//             }
//             return rect;
//         };
//         var getOffset = function (str, rect, c) {
//             return str.split(' ').map(function (pos) {
//                 var result = pos.match(rposition);
//                 var direction = result[1];
//                 var offset = parseFloat((result[2] || 0), 10);
//                 switch (direction) {
//                     case 'left': break;
//                     case 'center':
//                         offset = c * rect.width / 2 + offset;
//                         break;
//                     case 'right':
//                         offset = c * rect.width + offset;
//                         break;
//                     case 'top': break;
//                     case 'middle':
//                         offset = c * rect.height / 2 + offset;
//                         break;
//                     case 'bottom':
//                         offset = c * rect.height + offset;
//                         break;
//                 }
//                 return offset;
//             });
//         };
//         var atRect = getRect(d3.$(this.options.position.of).node());
//         var myRect = getRect(this.uiDialog.node());
//         var atOffset = getOffset(this.options.position.at, atRect, 1);
//         var myOffset = getOffset(this.options.position.my, myRect, -1);
//         var left = atRect.left + atOffset[0] + myOffset[0];
//         var top = atRect.top + atOffset[1] + myOffset[1];
//         if (top + myRect.height > window.innerHeight) {
//             top -= top + myRect.height - window.innerHeight;
//         }
//         if (top < 0) {
//             top = 0;
//         }
//         this.uiDialog.style({
//             left: left + 'px',
//             top: top + 'px'
//         });
//     },
//
//     _setOptions: function( options ) {
//         var that = this, resize = false;
//
//         Object.keys(options).forEach(function( key ) {
//             var value = options[key];
//             that._setOption( key, value );
//             if ( key in that.sizeRelatedOptions ) {
//                 resize = true;
//             }
//         });
//
//         if ( resize ) {
//             this._size();
//             this._position();
//         }
//     },
//
//     _setOption: function( key, value ) {
//         if ( key === 'disabled' ) {
//             return;
//         }
//
//         this._super( key, value );
//
//         if ( key === 'appendTo' ) {
//             this.uiAppendTo = d3.$(value);
//             this.uiAppendTo.node().appendChild(this.uiDialog.node());
//         }
//
//         if ( key === 'buttons' ) {
//             this._createButtons();
//         }
//
//         if ( key === 'position' ) {
//             this._position();
//         }
//
//         if ( key === 'title' ) {
//             d3.$( '.ui-dialog-title', this.uiDialogTitlebar ).html(value);
//         }
//     },
//
//     _size: function() {
//         var width = this.options.width;
//         if (typeof width === 'number') {
//             width += 'px';
//         }
//         this.uiDialog.style('width', this.options.width + 'px');
//
//         if (this.options.height === 'auto') {
//             this.element.style('height', 'auto');
//             return;
//         }
//         // Reset content sizing
//         this.element.style( {
//             display: 'block',
//             width: 'auto',
//             height: 0
//         } );
//
//         // Reset wrapper sizing
//         // determine the height of all the non-content elements
//         var nonContentHeight = this.uiDialog.style( 'height', 'auto' ).node().offsetHeight;
//
//         this.element.style( 'height', Math.max( 0, this.options.height - nonContentHeight ) + 'px' );
//     },
//
//     _createOverlay: function() {
//         if ( !this.options.modal ) {
//             return;
//         }
//         this.overlay = this.uiAppendTo.append('div');
//         this._addClass( this.overlay, null, 'ui-helper-overlay ui-helper-front' );
//     },
//
//     _destroyOverlay: function() {
//         if ( !this.options.modal ) {
//             return;
//         }
//
//         this.overlay.remove();
//     }
// } );
