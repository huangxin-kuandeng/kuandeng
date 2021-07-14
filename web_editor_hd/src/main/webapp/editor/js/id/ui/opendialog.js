// 'use strict';

// var rposition = /^([a-z]+)([+-]\d+)?$/;

iD.opendialog = d3.widget( 'opendialog', {
    options: {
        appendTo: 'body',//增加到哪个dom中
        autoOpen: true,//是否自动打开
        buttons: [],
        closeOnEscape: true,
        draggable: true,//是否可拖拽
        resizable: false,//是否可调整大小
        minbtn: true,//是否显示最小化按钮
        maxbtn: true,//是否显示最大化按钮
        closebtn: true,//是否显示关闭按钮
        onTask:false,
        onlayResizeTop: false,
        resizeMinHeight: 0,//调整尺寸最小值
        resizeMaxHeight: 0,//调整尺寸最大值
        width: 300,//宽度
        height: 300,//高度
        modal: false,
        title: null,//标题
        content: null,//内容
        tagEntities: [],//记录当前图层下所有的打标要素
        position: {
            of: window,
            at: 'center middle',
            my: 'center middle'
        },
        destroyOnClose: true,

        // Callbacks
        beforeClose: null,
        close: null,
        open: null,

        // 事件
        onDragEnd: _.noop,
        onDrag: _.noop
    },

    mouseOptions: {
        draging: false
    },

    currentEntity : null,

    _create: function() {

        this.uiAppendTo = d3.$(this.options.appendTo);
        if (d3.selectAll('.opendialog').size() != 0) {
            d3.selectAll('.opendialog').remove();
        }
        this._createWrapper();
        this._createTitlebar();
        this._createContent();
        this._createBottomButton();
        this._createEdgeAndAngle();

    },
    //创建dialog层
    _createWrapper: function () {
        this.uiDialog = this.uiAppendTo.append('div');

        this._addClass( this.uiDialog, 'opendialog' );

        this.uiDialog.style('left', (document.documentElement.clientWidth - this.uiDialog[0][0].offsetWidth) / 2 + "px");
        this.uiDialog.style('top', (document.documentElement.clientHeight - this.uiDialog[0][0].offsetHeight) / 2 + "px");
        this.uiDialog.style('width', this.options.width + 53 +'px');
        this.uiDialog.style('height', this.options.height + 66 +'px');

    },
    //创建title
    _createTitlebar: function () {
        var self = this;
        this.uiDialogTitle = this.uiDialog.append('div')
            .on('mousedown', function (event){
                if (self.options.draggable) {
                    var event = event || window.event;
                    var disX = event.clientX - self.uiDialog[0][0].offsetLeft;
                    var disY = event.clientY - self.uiDialog[0][0].offsetTop;
                    self.mouseOptions.draging = true;
                    this.onfocus = function () {
                        this.blur()
                    };
                    (event || window.event).cancelBubble = true;

                    d3.select('body').on('mousemove.title', function (event) {
                        if (!self.mouseOptions.draging) return;
                        var event = event || window.event;
                        var iL = event.clientX - disX;
                        var iT = event.clientY - disY;
                        var maxL = document.documentElement.clientWidth - self.uiDialog[0][0].offsetWidth;
                        var maxT = document.documentElement.clientHeight - self.uiDialog[0][0].offsetHeight;

                        iL <= 0 && (iL = 0);
                        iT <= 0 && (iT = 0);
                        iL >= maxL && (iL = maxL);
                        iT >= maxT && (iT = maxT);

                        self.uiDialog.style('left', iL + "px");
                        self.uiDialog.style('top', iT + "px");

                        return false
                    })

                    d3.select('body').on('mouseup.title', function () {
                        if (!self.mouseOptions.draging) return;
                        self.mouseOptions.draging = false;
                        d3.select('body').on('mousemove.title', null);
                        d3.select('body').on('mouseup.title', null);
                    });
                }
            });



        this._addClass( this.uiDialogTitle, 'title');

        var _title = this.uiDialogTitle.append('h2')
            .text(this.options.title);

        var _titlebtn = this.uiDialogTitle.append('div');
        if (this.options.minbtn) {
            _titlebtn.append('a')
                .attr('href', 'javascript:;')
                .attr('class','min')
                .attr('title', '最小化')
                .on('click', function() {self._minAndCloseBtnCallback(self);});
        }

        if (this.options.maxbtn) {
            _titlebtn.append('a')
                .attr('class', 'max')
                .attr('href', 'javascript:;')
                .attr('title', '最大化')
                .on('click', function(){
                    self.uiDialog.style('top', 0)
                    self.uiDialog.style('left', 0);
                    self.uiDialog.style('width', document.documentElement.clientWidth - 2 + "px");
                    self.uiDialog.style('height', document.documentElement.clientHeight - 2 + "px");
                    this.style.display = "none";
                    d3.select('.revert').style('display', 'block');
                });
        }

        _titlebtn.append('a')
            .attr('class', 'revert')
            .attr('href', 'javascript:;')
            .attr('title', '还原')
            .on('click', function(){
                self.uiDialog.style('width', (self.options.width + 53) + "px")
                self.uiDialog.style('height', self.options.height=='auto' ? self.options.height : (self.options.height+50)+'px');
                self.uiDialog.style('left', (document.documentElement.clientWidth - self.uiDialog[0][0].offsetWidth) / 2 + "px");
                self.uiDialog.style('top', (document.documentElement.clientHeight - self.uiDialog[0][0].offsetHeight) / 2 + "px");
                this.style.display = "none";
                d3.select('.max').style('display', 'block');
            });

        if (this.options.closebtn) {
            _titlebtn.append('a')
                .attr('class', 'close')
                .attr('href', 'javascript:;')
                .attr('title', '关闭')
                .on('click', function() {
                    self.uiDialog.remove();
                    editor.context.enter(iD.modes.Browse(editor.context));
                });
        }

    },
    //创建边角
    _createEdgeAndAngle:function() {
        var oL = this.uiDialog.append('div')
            .attr('class', 'resizeL');

        var oT = this.uiDialog.append('div')
            .attr('class', 'resizeT');

        var oR = this.uiDialog.append('div')
            .attr('class', 'resizeR');

        var oB = this.uiDialog.append('div')
            .attr('class', 'resizeB');

        var oLT = this.uiDialog.append('div')
            .attr('class', 'resizeLT');

        var oTR = this.uiDialog.append('div')
            .attr('class', 'resizeTR');

        var oBR = this.uiDialog.append('div')
            .attr('class', 'resizeBR');

        var oLB = this.uiDialog.append('div')
            .attr('class', 'resizeLB');

        //四角
        if (this.options.resizable) {
            this._resize(this.uiDialog, oLT, true, true, false, false);//左上
            this._resize(this.uiDialog, oTR, false, true, false, false);//右上
            this._resize(this.uiDialog, oBR, false, false, false, false);//右下
            this._resize(this.uiDialog, oLB, true, false, false, false);//左下
            //四边
            this._resize(this.uiDialog, oL, true, false, false, true);//左边
            this._resize(this.uiDialog, oT, false, true, true, false);//上边
            this._resize(this.uiDialog, oR, false, false, false, true);//右边
            this._resize(this.uiDialog, oB, false, false, true, false);//下边
        }
    },
    //创建内容
    _createContent: function () {
        this.uiDialog.append('div')
            .attr('class', 'content')
            // .style('width', this.options.width + 38 + 'px')
            // .style('height', this.options.height + 20 + 'px')
            .html(this.options.content);
    },
    //创建播放按钮
    _createBottomButton: function () {
        var self = this;
        var bbutton = this.uiDialog.append('div')
            .attr('class', 'button')
            .style('width', this.options.width + 53 +"px");

        bbutton.append('div')
            .html('<<')
            .attr('title', '上一个')
            .on('click', function(){
                var tagEntities = self._getEntities();

                var currentEntityId = self.uiDialog.select('.title h2').html();
                var index = {
                    i : -1,
                    pre: -1
                };
                for (var i = 0; i < tagEntities.length; i++) {
                    if (currentEntityId == tagEntities[i].id) {
                        index.i = i;
                        index.pre = i - 1;
                    }
                }
                var entity = tagEntities[index.pre];
                if (!entity) {
                    entity = tagEntities[index.i];
                }
                editor.context.ui().openDialog.showTag([entity]);
                editor.setCenter(entity.loc);
                editor.context.enter(iD.modes.Select(editor.context, [entity.id], null, true));
            });

        bbutton.append('div')
            .style('right', 0)
            .html('>>')
            .attr('title', '下一个')
            .on('click', function () {
                var tagEntities = self._getEntities();

                var currentEntityId = self.uiDialog.select('.title h2').html();
                var index = {
                    i : -1,
                    next: -1
                };
                for (var i = 0; i < tagEntities.length; i++) {
                    if (currentEntityId == tagEntities[i].id) {
                        index.i = i;
                        index.next = i + 1;
                    }
                }
                var entity = tagEntities[index.next];
                if (!entity) {
                    entity = tagEntities[index.i];
                }
                editor.context.ui().openDialog.showTag([entity]);
                editor.setCenter(entity.loc);
                editor.context.enter(iD.modes.Select(editor.context, [entity.id], null, true));
            });
    },
    _getEntities: function () {
        var modelNames = [iD.data.DataType.ANALYSIS_TAG, iD.data.DataType.QUESTION_TAG], tagEntities = [];
        var entities = editor.context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]));
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (_.indexOf(modelNames, e.modelName) != -1) {
                tagEntities.push(e);
            }
        }
        return tagEntities;
    },
    _minAndCloseBtnCallback: function () {
        //最小化按钮
        var dialog = d3.select('.opendialog'), self = this;
        dialog.style('display', 'none');
        this.uiAppendTo.append('a')
            .attr('class', 'open')
            .attr('href', 'javascript:;')
            .attr('title', '还原')
            .on('click', function() {
                dialog.style('display', 'block');
                this.remove();
            });
    },

    _destroy: function() {
        this._keybinding.off();
        this.uiDialog.remove();

        if (this.options.resizable) {
            // 绑在document上的事件得析构一下，不然事件会一直触发
            this._off(this.document, 'mouseup.dialogresizable');
            this._off(this.document, 'mousemove.dialogresizable');
        }

        this._destroyOverlay();
    },
    // 改变大小函数
    _resize: function(oParent, handle, isLeft, isTop, lockX, lockY){
        var self = this, disX, disY, iParentTop, iParentLeft, iParentWidth, iParentHeight;
        handle.on('mousedown', function (event) {
            var event = event || window.event;
            disX = event.clientX - handle[0][0].offsetLeft;
            disY = event.clientY - handle[0][0].offsetTop;
            iParentTop = oParent[0][0].offsetTop;
            iParentLeft = oParent[0][0].offsetLeft;
            iParentWidth = oParent[0][0].offsetWidth;
            iParentHeight = oParent[0][0].offsetHeight;

            self.mouseOptions.draging = true;


            d3.select('body').on('mousemove.resize' ,function (event) {
                if (!self.mouseOptions.draging) return;
                var event = event || window.event;

                var iL = event.clientX - disX;
                var iT = event.clientY - disY;
                var maxW = document.documentElement.clientWidth - oParent[0][0].offsetLeft - 2;
                var maxH = document.documentElement.clientHeight - oParent[0][0].offsetTop - 2;
                var iW = isLeft ? iParentWidth - iL : handle[0][0].offsetWidth + iL;
                var iH = isTop ? iParentHeight - iT : handle[0][0].offsetHeight + iT;

                isLeft && (oParent.style('left', iParentLeft + iL + "px"));
                isTop && (oParent.style('top', iParentTop + iT + "px"));

                iW < (self.options.width + 53) && (iW = self.options.width + 53);
                iW > maxW && (iW = maxW);
                lockX || (oParent.style('width', iW + "px"));

                iH < (self.options.height + 50) && (iH = self.options.height + 50);
                iH > maxH && (iH = maxH);
                lockY || (oParent.style('height', iH + "px"));

                if((isLeft && iW == self.options.width) || (isTop && iH == self.options.height)) self.mouseOptions.draging = false;

                self.uiDialog.select('.button').style('width', iW + "px");
                return false;
            })

            d3.select('body').on('mouseup.resize', function (){
                if (!self.mouseOptions.draging) return;
                self.mouseOptions.draging = false;
                d3.select('body').on('mousemove.resize', null);
                d3.select('body').on('mouseup.resize', null);
            });
        });
        return false;
    }
});
