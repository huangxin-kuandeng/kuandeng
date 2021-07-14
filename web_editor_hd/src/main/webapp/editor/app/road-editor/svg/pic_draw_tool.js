iD.svg.PicDrawTool = function (context, _opts) {
  var isSolidLine = false;
  var modelNameParam = _.clone(iD.data.DataType);
  const constant = _opts.constant;
  const markDrawStatus = _opts.markDrawStatus;
  const zrenderNodeStatus = _opts.zrenderNodeStatus;
  const markVectorPoint = _opts.markVectorPoint;
  const viewZoomParam = _opts.viewZoomParam;
  const isSubPlayer = _opts.hasOwnProperty("isSubPlayer")
    ? _opts.isSubPlayer
    : false;

  var CircleShape; // = require('zrender/shape/Circle');
  var PolygonShape; // =  require('zrender/shape/Polygon');
  var PolylineShape; // = require('zrender/shape/Polyline');
  var StarShape; // = require('zrender/shape/Star');
  var RectangleShape; // = require('zrender/shape/Rectangle');
  var ImageShape;

  var dropletImageDom_white = new Image();
  dropletImageDom_white.src = context.imagePath("pic/droplet-white.png");

  var dropletImageDom = new Image();
  dropletImageDom.src = context.imagePath("pic/droplet-orange.png");

  var dropletImageDom_red = new Image();
  dropletImageDom_red.src = context.imagePath("pic/droplet-red.png");

  var dropletImageDom_green = new Image();
  dropletImageDom_green.src = context.imagePath(
    "pic/droplet-blackishgreen.png"
  );
  // dropletImageDom.width = 6;
  // dropletImageDom.height = 10;
  var dropletImageLightDom = new Image();
  dropletImageLightDom.src = context.imagePath("pic/droplet-light.png");

  var dropletImageDom_darkgreen = new Image();
  dropletImageDom_darkgreen.src = context.imagePath(
    "pic/droplet-darkgreen.png"
  );

  var dropletImageDom_lightgreen = new Image();
  dropletImageDom_lightgreen.src = context.imagePath(
    "pic/droplet-lightgreen.png"
  );

  var dropletImageDom_darkblue = new Image();
  dropletImageDom_darkblue.src = context.imagePath("pic/droplet-darkblue.png");

  var dropletImageDom_lightblue = new Image();
  dropletImageDom_lightblue.src = context.imagePath(
    "pic/droplet-lightblue.png"
  );

  var dropletImageDom_yellow = new Image();
  dropletImageDom_yellow.src = context.imagePath("pic/droplet-yellow.png");

  var picLeftMarkers = [];
  var lastMousePos;

  var SELF;
  var player,
    epilineTool = _opts.epilineTool;
  var intersectionTool = null;

  var drawPlugins = [];
  // zrender图形与地图entity的对应关系
  var ZEUtil = iD.picUtil.createZrenderEditorMapping();

  var isSameCircleSize = _.isBoolean(_opts.isSameCircleSize)
    ? _opts.isSameCircleSize
    : false; //保持视频圆点大小一致，并使用canvas图片方式画点 --Tilden 邹洋需求 true:使用图片方式绘制圆，false：正常圆形
  var tempShape;

  function DrawTool() {
    // 触发要素绘制、编辑事件
    this.event = {
      add: function (id) {
        if (!id || !context.hasEntity(id)) {
          // console.log(id + ' --->  undefined');
          return;
        }
        context.event.pic_entity_change(id, "add");
      },
      change: function (id) {
        if (!id || !context.hasEntity(id)) {
          // console.log(id + ' --->  undefined');
          return;
        }
        context.event.pic_entity_change(id, "change");
      },
      delete: function (entity) {
        if (!entity) {
          return;
        }
        context.event.pic_entity_change(entity, "delete");
      },
    };
  }

  /**
   * 执行插件中的函数
   * return false 停止循环
   * @param {String} method
   */
  function execPlugin(method) {
    let args = _.toArray(arguments).slice(1);
    let result = false;
    for (let item of drawPlugins) {
      if (!item.check || !item.check(args[0] && args[0].btnType)) continue;
      let rst = item[method] && item[method].apply(item, args);
      if (rst === false) {
        result = true;
        break;
      }
    }
    return result;
  }
  /**
   * 执行插件中的函数，不需要检查，可当作触发事件
   * 例如：地面区域，绘制逻辑与拖拽逻辑一致，但是拖拽时没有markDrawStatus.type
   * return false 停止循环
   * @param {String} method
   */
  function execPluginTrigger(method) {
    let args = _.toArray(arguments).slice(1);
    let result = false;
    for (let item of drawPlugins) {
      let rst = item[method] && item[method].apply(item, args);
      if (rst === false) {
        result = true;
        break;
      }
    }
    return result;
  }

  _.assign(DrawTool.prototype, {
    // ======================
    init: function (pic_player, intersection) {
      var self = this;
      this.ZEUtil = ZEUtil;
      player = pic_player;
      ZEUtil.setPlayer(player);

      intersectionTool = intersection;
      self.player = player;
      self._zrender = player._zrender;
      drawPlugins.length = 0;
      for (let k in iD.svg.PicDraw) {
        let plus = iD.svg.PicDraw[k](context, this);
        plus.init(markDrawStatus, zrenderNodeStatus);
        drawPlugins.push(plus);
      }
      // 标定-控制点，不需要绘制按钮
      if (iD.User.isTrackControlPointRole()) {
        var ids = [
          "default",
          constant.INTERSECTION,
          constant.TOOL_TRACK_CONTROLPOINT,
        ];
        drawPlugins = drawPlugins.filter(function (d) {
          return ids.includes(d && d.getId && d.getId());
        });
      }
      console.log("已加载绘制代码：" + drawPlugins.length + "个；");
    },
    initZRender: function (callback) {
      var self = this;
      require([
        /*'zrender', 'zrender/shape/Circle','zrender/shape/Polygon','zrender/shape/Polyline','zrender/shape/Star','zrender/shape/Rectangle'*/
      ], function () {
        /*CircleShape = require('zrender/shape/Circle');
                     PolygonShape =  require('zrender/shape/Polygon');
                     PolylineShape = require('zrender/shape/Polyline');
                     StarShape = require('zrender/shape/Star');
                     RectangleShape = require('zrender/shape/Rectangle');*/
        CircleShape = zrender.Circle;
        PolygonShape = zrender.Polygon;
        PolylineShape = zrender.Polyline;
        StarShape = zrender.Star;
        RectangleShape = zrender.Rect;
        ImageShape = zrender.Image;

        callback && callback(zrender);
      });
    },
    //=======================================
    domMousedown: function () {
      var self = this;
      lastMousePos = [d3.event.offsetX, d3.event.offsetY];
      if (
        !_.include(
          [
            //                  constant.TELEGRAPH_LAMP_HOLDER,
            //	                constant.ADD_BOARD
            constant.ADD_GROUND_AREA,
            // constant.ADD_PAVEMENT_DISTRESS,
            constant.SPLIT_BOARD_LINE,
          ],
          markDrawStatus.type
        )
      ) {
        return;
      }
      player.canvasClickCheck = false;

      var clickOffset = self.leftZoomOffset(lastMousePos);
      var flag = execPlugin("domMousedown", d3.event, clickOffset);
      if (flag) return;
    },
    domMouseup: function () {
      var self = this;
      var upPos = [d3.event.offsetX, d3.event.offsetY];
      player.canvasClickCheck = true;
      if (
        !_.include(
          [
            //                  constant.TELEGRAPH_LAMP_HOLDER,
            //                  constant.ADD_BOARD,
            constant.ADD_GROUND_AREA,
            // constant.ADD_PAVEMENT_DISTRESS,
            constant.SPLIT_BOARD_LINE,
          ],
          markDrawStatus.type
        )
      ) {
        return;
      }
      var clickOffset = self.leftZoomOffset(upPos);

      var flag = execPlugin("domMouseup", d3.event, clickOffset, {
        downOffset: lastMousePos,
      });
      if (flag) return;
    },
    domClickBefore: function () {
      var self = this;
      if (
        _.include(
          [
            constant.ADD_GROUND_AREA,
            // constant.ADD_PAVEMENT_DISTRESS,
            constant.MOVE_LINE,
          ],
          markDrawStatus.type
        )
      ) {
        return false;
      }
      var upPos = [d3.event.offsetX, d3.event.offsetY];
      var clickOffset = self.leftZoomOffset(upPos);
      if (epilineTool && epilineTool.checkBodyShown()) {
        if (!markDrawStatus.type) {
          // 核线
          self.zrenderDrawPoint(clickOffset);
          epilineTool.createCanvasEpiline(clickOffset);
        } else if (markDrawStatus.type == constant.TOOL_EPLILINE_CROSS) {
          // 十字
          player.drawRightEpilineCross(clickOffset);
        }
        return false;
      }
      if (!player.canvasClickCheck) {
        return false;
      }
      execPlugin("domClickBefore", d3.event, clickOffset);

      // 添加节点是在 zrender 的mouseup触发的
      if (
        !markDrawStatus.type ||
        _.include(
          [constant.POLYLINE_ADD_NODE, constant.DIVIDER_ADD_MIDDLEPOINT],
          markDrawStatus.type
        )
      ) {
        return false;
      }

      if (markDrawStatus.type == constant.BATCH_BREAK_DREF) {
        iD.picUtil.batchBreakDividerDref(upPos);
        player.clearFooterButton();
        return false;
      }
    },
    domClick: function (evt) {
      var self = this;
      var d3evt = evt || d3.event;
      var clickOffset = self.leftZoomOffset([d3evt.offsetX, d3evt.offsetY]);

      var flag = execPlugin("domClick", d3evt, clickOffset);
      if (flag) return;

      var presult;
      if (
        [constant.POINT, constant.INTERSECTION].includes(markDrawStatus.type)
      ) {
        // 前方交汇用的十字的point
        self.zrenderDrawPoint(self, clickOffset);
      }

      //---------------------前方交会代码块-----------------------------
      intersectionTool &&
        intersectionTool.leftClickCoord(
          clickOffset,
          function (data, point, point2, isMultPoints) {
            var flag = execPlugin(
              "domClickMore",
              d3evt,
              clickOffset,
              data,
              point,
              point2,
              isMultPoints
            );
            if (flag) return;
          }
        );
    },
    domDblclick: function () {
      var self = this;
      zrenderNodeStatus.downOffset = undefined;
      zrenderNodeStatus.moveOffset = undefined;
      player.isPlayPic = true;
      if (
        _.include(
          [
            constant.TELEGRAPH_LAMP_HOLDER,
            // constant.ADD_TRAFFICLIGHT,
            constant.ADD_GROUND_AREA,
            // constant.ADD_PAVEMENT_DISTRESS,
            constant.ADD_BOARD,
            constant.INTERSECTION,
            constant.ADD_CHECK_TAG_POINT,
            constant.ADD_IMAGE_TAG_POINT,
            constant.ADD_ANALYSIS_TAG_POINT,
            constant.ADD_NETWORK_TAG_POINT,
            constant.ADD_CONTROL_POINT,
            constant.ADD_OBJECT_PT,
            constant.ADD_ROAD_ATTRIBUTE,
            constant.BATCH_BREAK_DREF,
            constant.MOVE_LINE,
            constant.TOOL_EPLILINE_CROSS,
            constant.TOOL_TRACK_CONTROLPOINT,
          ],
          markDrawStatus.type
        ) ||
        _.include([constant.MARK_VECTOR_POINT], markDrawStatus.secType)
      ) {
        return;
      }
      if (!player.canvasClickCheck) {
        return;
      }
      if (
        !markDrawStatus.type ||
        _.include(
          [constant.POLYLINE_ADD_NODE, constant.DIVIDER_ADD_MIDDLEPOINT],
          markDrawStatus.type
        )
      ) {
        return;
      }
      var clickOffset = self.leftZoomOffset([
        d3.event.offsetX,
        d3.event.offsetY,
      ]);

      var flag = execPlugin("domDblclick", d3.event, clickOffset);
      if (flag) return;
      var coordOffsetList = clickOffset;
      /*
            intersectionTool && intersectionTool.leftClickCoord(coordOffsetList, function(data, point, point2, isMultPoints){
                var flag = execPlugin('domDblclickMore', d3evt, clickOffset, data, point, point2, isMultPoints);
                if(flag) return ;
            });
            */
    },
    //=======================================
    /**
     * 根据反投轨迹点的列表，生成shape
     */
    drawTrackPointsToShape: function () {
      var self = this;
      if (!player.allNodes.length) {
        return;
      }
      var resultList = iD.AutoMatch.calcTrackPointsToPicPlayer(player);
      let itemNode = player.divItem.node();
      for (var result of resultList) {
        var style = {
          lineWidth: 1,
          fill: "rgba(0, 128, 0, 0.6)",
        };
        if (classified.cyanMap && classified.cyanMap[result.entity.id]) {
          style.fill = "rgba(0, 255, 255, 0.8)";
        } else if (classified.blueMap && classified.blueMap[result.entity.id]) {
          style.fill = "rgba(0, 0, 255, 0.8)";
        } else if (
          classified.purpleMap &&
          classified.purpleMap[result.entity.id]
        ) {
          style.fill = "rgba(128, 0, 128, 0.8)";
        } else if (
          classified.magentaMap &&
          classified.magentaMap[result.entity.id]
        ) {
          style.fill = "rgba(255, 0, 255, 0.8)";
        } else if (classified.redMap && classified.redMap[result.entity.id]) {
          style.fill = "rgba(255, 0, 0, 0.8)";
        } else if (
          classified.otherMap &&
          classified.otherMap[result.entity.id]
        ) {
          style.fill = "rgba(128, 128, 128, 0.8)";
        } else if (classified.badMap && classified.badMap[result.entity.id]) {
          style.fill = "rgba(255, 0, 0, 0.8)";
        } else if (
          classified.acceptMap &&
          classified.acceptMap[result.entity.id]
        ) {
          style.fill = "rgba(255, 255, 0, 0.8)";
        }

        let shape = self.createMarker(
          self.transformPoint(result.coordinates[0], itemNode),
          {
            hoverable: true,
            draggable: false,
            style: style,
          }
        );
        if (result.trackPointId) {
          shape.trackPointId = result.trackPointId;
          shape.trackId = result.trackId;
        }
        self._zrender.add(shape);
      }
    },
    createIcon: function (point, opts, nodeid) {
      var self = this;
      var _r = 27;
      var _rr = 25;
      var _w = 30;
      var offset = 5.2;
      var entity = context.hasEntity(nodeid);

      var fillColor = "",
        strokeColor = "",
        colorPoint = [
          this.whitePointCanvas,
          this.cyanPointCanvas,
          this.bluePointCanvas,
          this.redPointCanvas,
        ],
        pointCanvas = colorPoint[0];
      if (entity && entity.modelName == modelNameParam.DIVIDER_NODE) {
        // 0实线-白色，1起点-青蓝色，2终点-深蓝色
        let type = entity.tags.DASHTYPE;
        pointCanvas = colorPoint[type] || colorPoint[0];
      }

      var options = {
        style: {
          x: point[0] - offset,
          y: point[1] - offset,
          image: pointCanvas,
          width: _w + _w,
          height: _w,
          opacity: 0.8,
        },
        hoverable: true,
        draggable: true,
        ondragstart: _zrenderNodeEventDragstart,
        ondragend: _zrenderNodeEventDragend,
        onmousedown: _mousedownNodeCanDrag,
        ondragenter: function (evt) {
          zrenderNodeStatus.dragoverShape = evt.target;
        },
        ondragleave: function (evt) {
          zrenderNodeStatus.dragoverShape = undefined;
        },
      };
      var img = new zrender.Image(options);
      player.dividerCanvasGeometrys[img.id] = {
        x: options.style.x,
        y: options.style.y,
        _r: _r,
        _rr: _rr,
        _w: _w,
        offset: offset,
      };
      self.zrenderShapeInit(img);
      return img;
    },
    createShapeText: function (entity) {
      // 地面、路牌显示文本，距离当前轨迹点30m内
      var result = {};
      var mname = entity.modelName;
      if (
        ![iD.data.DataType.OBJECT_PG, iD.data.DataType.TRAFFICSIGN].includes(
          mname
        )
      ) {
        return result;
      }
      var range = 30;
      if (mname == iD.data.DataType.TRAFFICSIGN) {
        range = 50;
      }
      var firstNode = context.entity(entity.first());
      if (
        iD.util.distanceByLngLat(player.pic_point.loc, firstNode.loc) > range
      ) {
        return result;
      }

      var fieldList = player.__PG_text_fields;
      if (!fieldList) {
        fieldList = {};
        fieldList[iD.data.DataType.OBJECT_PG] = _.compact(
          ["SUBTYPE"].map(function (fname) {
            return iD.ModelEntitys[iD.data.DataType.OBJECT_PG]
              .getFields()
              .filter(function (d) {
                return d.fieldName == fname;
              })[0];
          })
        );
        fieldList[iD.data.DataType.TRAFFICSIGN] = _.compact(
          ["TYPE"].map(function (fname) {
            return iD.ModelEntitys[iD.data.DataType.TRAFFICSIGN]
              .getFields()
              .filter(function (d) {
                return d.fieldName == fname;
              })[0];
          })
        );
        player.__PG_text_fields = fieldList;
      }
      var fields = fieldList[mname];
      var list = [];
      fields.forEach(function (d) {
        if (
          !d.fieldInput ||
          !d.fieldInput.values ||
          !d.fieldInput.values.length
        ) {
          return;
        }
        var f = _.find(d.fieldInput.values, {
          value: "" + entity.tags[d.fieldName],
        });
        if (f && f.name) {
          list.push(f.name);
        }
      });
      return {
        text: list.join("-"),
        style: {
          textColor: iD.picUtil.colorRGBA(220, 20, 60, 0.2),
          // stroke: iD.picUtil.colorRGBA(220, 20, 60, 0.2)
        },
      };
    },
    createShap: function (geometry) {
      var self = this;
      let points = [];
      let i = 0,
        len = geometry.coordinates.length;
      let itemNode = player.divItem.node();
      for (; i < len; i++) {
        points.push(self.transformPoint(geometry.coordinates[i], itemNode));
      }
      var polygon_opts = {};
      var node_opts = {};
      var entity = geometry.entity;
      if (context.variable.checkObjectPGTXT) {
        polygon_opts = self.createShapeText(entity);
      }

      switch (geometry.type) {
        case "Polygon":
          return self.createPolygon(points, polygon_opts);
        case "LineString":
          return self.createPolyline(points);
        case "Point":
          let result, opts;
          if (entity && [modelNameParam.LAMPPOST].includes(entity.modelName)) {
            opts = {
              draggable: true,
              ondragstart: _zrenderNodeEventDragstart,
              ondragend: _zrenderPointEventDragend,
            };
            result = self.createRectangle(points[0], opts);
          } else if (
            entity &&
            _.include([modelNameParam.LIMITHEIGHT], entity.modelName)
          ) {
            // 高程点
            opts = {
              draggable: false,
              style: {},
            };
            iD.picUtil.updateZrenderStyleByEntity(opts, entity.id);
            result = self.createRectangle(points[0], opts);
          } else if (
            entity &&
            [modelNameParam.OBJECT_PT, modelNameParam.ROAD_ATTRIBUTE].includes(
              entity.modelName
            )
          ) {
            // 控制点
            opts = {
              draggable: true,
              ondragstart: _zrenderNodeEventDragstart,
              ondragend: _zrenderPointEventDragend,
            };
            result = self.createMarker(points[0], opts);
          } else if (
            entity &&
            entity.modelName == iD.data.DataType.QUALITY_TAG
          ) {
            opts = {
              ignore: false,
            };

            let checkStep = {
              autoTopologyCheck: dropletImageDom_darkgreen,
              autoTopologyVerify: dropletImageDom_lightgreen,
              check: dropletImageDom,
              verify: dropletImageDom_yellow,
              // 'autoTopologyCheck': dropletImageDom_darkblue,
              // 'autoTopologyCheck': dropletImageDom_lightblue
            };

            result = self.createDroplet(
              points[0],
              Object.assign(
                {
                  style: {
                    width: 12,
                    height: 20,
                    image:
                      checkStep[entity.tags.CHECK_STEP] || dropletImageDom_red,
                  },
                  hoverable: true,
                },
                opts
              )
            );

            // if (entity.tags.TAG_SOURCE == '4' || entity.tags.TAG_SOURCE == '5' || entity.tags.TAG_SOURCE == '6' || entity.tags.TAG_SOURCE == '7') {//isWorkRole isCheckRole isVerifyRole
            //     img = dropletImageDom_red;
            // } else if (entity.tags.TAG_SOURCE == '1') {
            //     img = dropletImageDom;
            // } else if (entity.tags.TAG_SOURCE == '2') {
            //     img = dropletImageDom_green;
            // } else {
            //     img = dropletImageDom_white;
            // }
            // console.log('entity:', entity.id);
            // console.log('point:', points);
            // 水滴渲染
          } else if (entity && entity.isSearchPoint && entity.isSearchPoint()) {
            opts = {
              style: {
                text: entity.tags.index,
                textFill: "#0097ff",
                textPosition: "right",
                brushType: "both",
                fontSize: 12,
              },
              shape: {
                r: 3,
              },
              ignore: context.variable.hideTrackControlPoint,
            };
            result = self.createMarker(points[0], opts);
          } else if (entity && entity.isPlaceName && entity.isPlaceName()) {
            opts = {
              shape: {
                r: 3,
              },
              style: {
                text: entity.tags.name,
                textColor: "#F00",
                textPosition: "right",
                brushType: "both",
              },
            };
            result = self.createMarker(points[0], opts);
          } else if (
            entity &&
            entity.modelName == modelNameParam.DIVIDER_NODE
          ) {
            result = self.createNodeMarker(points[0], null, entity.id);
          } else if (
            entity &&
            [
              iD.data.DataType.BARRIER_GEOMETRY_NODE,
              iD.data.DataType.ROAD_FACILITIES_NODE,
            ].includes(entity.modelName)
          ) {
            result = self.createMarker(points[0], {
              draggable: true,
            });
          } else {
            result = self.createMarker(points[0], null);
          }

          return result;
      }
    },
    /**
     * 创建线、面上的节点shape，
     * DIVIDER_NODE若是LA并且开启特效，会创建矩形
     * @param {Array} point
     * @param {Object} options
     * @param {String} entityid
     */
    createNodeMarker: function (point, options = {}, entityid) {
      var self = this;
      let result;
      // LA
      if (
        iD.picUtil.isEffectLANode(entityid) ||
        iD.picUtil.isEffectMeasureInfoNode(entityid) ||
        iD.picUtil.isEffectDAAndMeasureInfoNode(entityid)
      ) {
        let r = computeZrenderCircleRadius(point) + 4;
        if (r < 4) r = 4;
        let opts = {
          draggable: true,
          ondragstart: _zrenderNodeEventDragstart,
          ondragend: _zrenderNodeEventDragend,
          style: {
            color: "rgba(0, 255, 0, 0.8)",
            lineWidth: 0,
            width: r,
            height: r,
          },
          width: 7,
          height: 7,
        };
        _.extend(opts.style, options.style);
        delete options.style;
        _.extend(opts, options);

        result = self.createRectangle(point, opts);
      } else {
        result = self.createMarker(point, options);
      }

      result._entityid = entityid;
      return result;
    },
    createMarker: function (point, opts) {
      var self = this;
      opts = opts || {};
      var r = computeZrenderCircleRadius(point);
      var options = {
        shape: {
          cx: point[0],
          cy: point[1],
          r: r,
        },
        style: {
          /*x : point[0],
                     y : point[1],
                     r : r,*/
          brushType: "both",
          fill: iD.picUtil.colorRGBA(220, 20, 60, 0.6),
          stroke: iD.picUtil.colorRGBA(0, 0, 0, 1),
          lineWidth: 1,
          textFill: "#F00",
          fontSize: 18,
          textShadowBlur: 2,
        },
        hoverable: true,
        // 也不能触发onclick
        onmouseup: _mouseUpNodeCanDrag,
        onmousedown: _mousedownNodeCanDrag,
        ondragenter: function (evt) {
          //          		console.log(this.id + "<-->" + evt.topTarget.id, "\ttarget id: " + evt.target.id);
          zrenderNodeStatus.dragoverShape = evt.target;
        },
        ondragleave: function (evt) {
          zrenderNodeStatus.dragoverShape = undefined;
        },
      };

      // options.style = _.assign(options.style, opts.style);
      // delete opts.style;
      // options = _.assign(options, opts);
      let style = _.assign(options.style, opts.style);
      let _shape = _.assign(options.shape, opts.shape);
      options = _.assign(options, opts);
      options.style = style;
      options.shape = _shape;
      var marker = new CircleShape(options);
      self.zrenderShapeInit(marker);
      return marker;
    },
    // 绘制矩形，杆状物点
    createRectangle: function (point, opts) {
      var self = this;
      var width = 10,
        height = 10;
      var options = {
        shape: {
          x: point[0],
          y: point[1],
          width: width,
          height: height,
        },
        style: {
          //                  x : point[0] - width / 2,
          //                  y : point[1] - height / 2,
          brushType: "both",
          fill: iD.picUtil.colorRGBA(255, 255, 255, 0),
          stroke: iD.picUtil.colorRGBA(220, 20, 60, 0.8),
          lineWidth: 4,
        },
        //              position: [-width/2, -height/2],
        hoverable: true,
        onmousedown: _mousedownNodeCanDrag,
        // 也不能触发onclick
        onmouseup: function (evt) {
          if (
            zrenderNodeStatus.dragoverShape &&
            zrenderNodeStatus.dragoverShape.id === this.id
          ) {
            return;
          }
          if (!markDrawStatus.type && !tempShape) {
            var mkr = this;
            if (mkr._entityid) {
              var node = context.hasEntity(mkr._entityid);
              if (!node) {
                return;
              }
              self._lightMapEntities([node.id]);
            }
          }
        },
        ondragenter: function (evt) {
          zrenderNodeStatus.dragoverShape = evt.target;
        },
        ondragleave: function (evt) {
          zrenderNodeStatus.dragoverShape = undefined;
        },
      };

      opts = opts || {};
      options.style = _.assign(options.style, opts.style);
      delete opts.style;
      options = _.assign(options, opts);

      var rect = new RectangleShape(options);
      // 矩形定位
      iD.picUtil.shapeXY(rect, point);

      self.zrenderShapeInit(rect);
      return rect;
    },
    createPolygon: function (points, _opts) {
      var self = this;
      var defOpts = {};
      if (
        _.include(
          [
            constant.ADD_GROUND_AREA,
            constant.ADD_PAVEMENT_DISTRESS,
            constant.ADD_OBJECT_PG,
            constant.ADD_DIVIDER_POLYGON,
            constant.ADD_TRAFFICLIGHT,
          ],
          markDrawStatus.type
        )
      ) {
        defOpts = {
          style: {
            fill: iD.picUtil.colorRGBA(220, 20, 60, 0.2),
            stroke: iD.picUtil.colorRGBA(220, 20, 60, 0.2),
          },
        };
      }
      var opts = Object.assign(defOpts, _opts);

      var options = {
        shape: {
          points: points,
        },
        style: {
          // pointList : points,
          brushType: "both",
          fill: iD.picUtil.colorRGBA(220, 20, 60, 0.6),
          stroke: iD.picUtil.colorRGBA(220, 20, 60, 0.6),
          lineWidth: 1,
          text: opts.text || "",
          textFill: "#FFFF00",
          fontSize: 25,
          textShadowBlur: 2,
        },
        draggable: false,
        hoverable: true,
        onmouseup: function (evt) {
          if (markDrawStatus.type == constant.POLYLINE_ADD_NODE) {
            var polygon = this;
            var entity = context.entity(polygon._entityid);
            var modelConfig = iD.Layers.getLayer(
              entity.layerId,
              entity.modelName
            );
            if (polygon._entityid && modelConfig.editable) {
              var clickOffset = self.leftZoomOffset([
                evt.event.offsetX,
                evt.event.offsetY,
              ]);
              self.drawGeometryLineAddNode(polygon, clickOffset);
            }
          } else if (!markDrawStatus.type && !tempShape) {
            var shape = this;
            if (shape._entityid) {
              var entity = context.hasEntity(shape._entityid);
              if (!entity) {
                return;
              }
              self._lightMapEntities([entity.id]);
            }
          }
        },
      };

      opts = opts || {};
      options.style = _.assign(options.style, opts.style);
      delete opts.style;
      options = _.assign(options, opts);

      var polygon = new PolygonShape(options);
      self.zrenderShapeInit(polygon);
      return polygon;
    },
    createPolyline: function (points, opts) {
      var self = this;
      var options = {
        shape: {
          points: points,
          //                  lineType: 'solid'
        },
        style: {
          //pointList : points,
          stroke: "rgba(220, 20, 60, 0.4)", //color.getColor(colorIdx++),
          lineWidth: 2, //修改高精线宽度
        },
        hoverable: true,
        onmouseup: function (evt) {
          if (markDrawStatus.type == constant.MOVE_LINE) {
            return;
          }
          var polyline = this;
          var entity = false;
          if (polyline._entityid) {
            entity = context.hasEntity(polyline._entityid);
          }

          if (!markDrawStatus.type && !tempShape) {
            var shape = this;
            var wayid = shape._entityid;
            wayid && self._lightMapEntities([wayid]);
          }
          let isOutline = false;
          if (
            entity &&
            entity.modelName == iD.data.DataType.BARRIER_GEOMETRY &&
            entity.tags.TYPE == "27"
          )
            isOutline = true;
          if (
            isOutline &&
            constant.ADD_OUTLINE_OBJECT_PT == markDrawStatus.type
          ) {
            // return ;
          } else if (
            !_.include(
              [constant.POLYLINE_ADD_NODE, constant.DIVIDER_ADD_MIDDLEPOINT],
              markDrawStatus.type
            ) ||
            tempShape
          ) {
            return;
          }

          var modelConfig = iD.Layers.getLayer(
            entity.layerId,
            entity.modelName
          );
          var clickOffset = [];
          if (polyline._entityid && modelConfig.editable) {
            clickOffset = self.leftZoomOffset([
              evt.event.offsetX,
              evt.event.offsetY,
            ]);
          }
          if (!clickOffset || !clickOffset.length) {
            return;
          }

          if (markDrawStatus.type == constant.POLYLINE_ADD_NODE) {
            self.drawGeometryLineAddNode(polyline, clickOffset);
          } else if (markDrawStatus.type == constant.DIVIDER_ADD_MIDDLEPOINT) {
            self.drawGeometryDividerAddMiddlePoint(polyline, clickOffset);
          } else if (markDrawStatus.type == constant.ADD_OUTLINE_OBJECT_PT) {
            self.drawOutlineObjectPT(polyline, clickOffset);
          }
        },
        /*
                onmouseover: function(){
                    if(markDrawStatus.type != constant.MOVE_LINE) return ;
                    this.draggable = true;
                },
                */
        onmouseout: function () {
          if (markDrawStatus.type != constant.MOVE_LINE) return;
          this.draggable = false;
        },
        onmousedown: function (evt) {
          // 绘制线路时，鼠标可能被临时线挡住，导致无法触发节点的_mousedown检查函数
          var args = Array.prototype.slice.call(arguments);
          self._zrenderEntityMousedown.apply(this, args);

          if (markDrawStatus.type != constant.MOVE_LINE) return;
          // 偶尔会出现，平移线开始移动，却没有触发dragstart
          this._startXY = [evt.event.offsetX, evt.event.offsetY];
          this.draggable = true;
        },
        ondragstart: function (evt) {
          if (markDrawStatus.type != constant.MOVE_LINE) return;
          this._startXY = [evt.event.offsetX, evt.event.offsetY];
          iD.picUtil.shapePosition(this, [0, 0]);
        },
        ondragend: function (evt) {
          player.canvasClickCheck = true;
          if (!this._startXY) {
            iD.picUtil.shapePosition(this, [0, 0]);
            return;
          }
          if (markDrawStatus.type != constant.MOVE_LINE) return;
          this.draggable = false;
          var entity = context.entity(this._entityid);
          var endXY = [evt.event.offsetX, evt.event.offsetY];
          iD.picUtil.dargPanning(this._startXY, endXY, entity);
          //                  this._startXY = undefined;
        },
      };

      opts = opts || {};
      options.shape = _.assign(options.shape, opts.shape);
      options.style = _.assign(options.style, opts.style);
      delete opts.shape;
      delete opts.style;
      options = _.assign(options, opts);

      line = new PolylineShape(options);

      self.zrenderShapeInit(line);
      return line;
    },
    // 水滴图标，使用Droplet，旋转有问题；
    createDroplet: function (point, opts) {
      var self = this;
      //      	var color = require('zrender/tool/color');
      var options = {
        _type: "droplet",
        shape: {},
        style: {
          x: point[0],
          y: point[1],
          image: dropletImageDom,
          width: 15,
          height: 25,
          opacity: 0.8,
        },
        onmouseup: _mouseUpNodeCanDrag,
        hoverable: true,
      };

      opts = opts || {};
      options.style = _.assign(options.style, opts.style);
      delete opts.style;
      options = _.assign(options, opts);

      var droplet = new ImageShape(options);
      // Image不支持setShape，防止报错
      droplet.setShape = function () {};
      // 定位
      iD.picUtil.shapeXY(droplet, point);

      self.zrenderShapeInit(droplet);
      return droplet;
    },
    createStar: function (point, opts) {
      var self = this;
      //      	var color = require('zrender/tool/color');
      var options = {
        shape: {
          cx: point[0],
          cy: point[1],
          r: 10,
          r0: 0,
          n: 4,
        },
        style: {
          lineWidth: 1,
          lineJoin: "square",
          brushType: "both",
          fill: "rgba(220, 20, 60, 0.4)",
          stroke: "rgba(220, 20, 60, 0.4)",
        },
        hoverable: false, // default true
      };

      opts = opts || {};
      options.shape = _.assign(options.shape, opts.shape);
      delete opts.shape;
      options.style = _.assign(options.style, opts.style);
      delete opts.style;
      options = _.assign(options, opts);

      var star = new StarShape(options);

      self.zrenderShapeInit(star);
      return star;
    },
    /**
     * 在new shape以后，zrender.add之前调用，初始化参数/事件
     * @param {Object} shape
     */
    zrenderShapeInit: function (shape) {
      var self = SELF;
      shape.on("mouseover", self._zrenderEntityHover);
      shape.on("mouseout", self._zrenderEntityOut);

      var layer = self.getZRenderLayer(0);
      if (!layer) {
        return;
      }
      if (layer.position) {
        shape.position = [layer.position[0], layer.position[1]];
      } else {
        shape.position = viewZoomParam.position.slice();
      }
      if (layer.scale) {
        shape.scale = [layer.scale[0], layer.scale[1]];
      } else {
        shape.scale = [viewZoomParam.scale, viewZoomParam.scale];
      }
    },
    /*
     * 点、线、面高亮显示
     *
     * */
    _zrenderEntityHover: function (e) {
      if (!this.hoverable) return;
      window.shape = this;
      var self = player;
      var style = {
        stroke: iD.picUtil.colorRGBA(255, 255, 0, 0.4),
        lineWidth: 2,
        text: "",
      };
      // if(this.trackId){
      //     var evt = e && e.event || window.event || {};
      //     var trackId = this.trackId;
      //     var half = 8 * trackId.length / 2;
      //     // var rect = shape.getBoundingRect();
      //     var width = parseInt(player.pics.style('width'));
      //     var align = 'center';
      //     if(evt.offsetX + half >= width){
      //         align = 'right';
      //     }else if(evt.offsetX - half <= 0){
      //         align = 'left';
      //     }
      //     style = {
      //         text: this.trackId,
      //         textPosition: 'top',
      //         fontSize: 14,
      //         fontWeight: 'bold',
      //         textAlign: align
      //     };
      // }else
      if (this.type == "image") {
        var width = this.style.width * 1.4;
        var height = this.style.height * 1.4;
        var wdiff = width - this.style.width;
        var hdiff = height - this.style.height;
        style = {
          x: this.style.x - wdiff / 2,
          y: this.style.y - hdiff / 2,
          image: dropletImageLightDom,
          width: width,
          height: height,
          opacity: 0.4,
        };
      } else if (this.type == "polygon") {
        style.fill = iD.picUtil.colorRGBA(0, 0, 0, 0);
        style.lineWidth = 4;
      } else if (this.style.fill) {
        style.fill = iD.picUtil.colorRGBA(255, 255, 0, 0.6);
        style.lineWidth = 4;
      }
      self._zrender.addHover(this, style);
      self._zrender.refresh();
    },
    /*
     * 点、线、面取消高亮显示
     *
     * */
    _zrenderEntityOut: function () {
      if (!this.hoverable) return;
      // 若当前要素处于选中状态，不清空高亮；
      if (iD.picUtil.shapeInSelected(this)) {
        return;
      }
      var self = player;
      self._zrender.removeHover(this);
    },
    /**
     * 绘制时判断从那个节点开始绘制
     * @param {Object} e
     */
    _zrenderEntityMousedown: function (e) {
      var shape = this;
      clearZRenderNodeStatus();
      if (shape.type != "circle" || !shape._entityid) {
        var result = iD.picUtil.findMouseShapes(
          e.event.offsetX,
          e.event.offsetY,
          {
            type: "circle",
            shapes: [shape],
            first: true,
          }
        );
        shape = result[0];
      }
      if (!shape || !shape._entityid || shape.type != "circle") {
        return;
      }
      // 点击位置的shape
      zrenderNodeStatus.downEntityid = shape._entityid;
      zrenderNodeStatus.downShape = shape;
    },
    /**
     * canvas的line上点击后，添加一个节点
     * @param {Object} self
     * @param {Object} polyline
     * @param {Object} canvasOffset
     * @param {Object} data
     */
    drawGeometryLineAddNode: function (polyline, canvasOffset, data) {
      var result = polyline;
      var self = this;
      if (!_.include(["polyline", "polygon"], result.type)) {
        return;
      }
      var wayEntity = context.entity(polyline._entityid);

      if (
        !_.include(
          [
            modelNameParam.OBJECT_PL,
            modelNameParam.BARRIER_GEOMETRY,
            modelNameParam.PAVEMENT_DISTRESS,
            modelNameParam.OBJECT_PG,
            modelNameParam.DIVIDER,
          ],
          wayEntity.modelName
        )
      ) {
        return;
      }
      context.buriedStatistics().merge(1, wayEntity.modelName);
      var geometry = iD.picUtil.pixelToLngLat(canvasOffset);
      var mapNodes = context.graph().childNodes(wayEntity);
      var xy = self.reductionPoint(canvasOffset);
      geometry.xy = xy;
      /*
            if(wayEntity.modelName == modelNameParam.BRIDGE){
                var lonlats = iD.picUtil.pixelToLngLatByPlane(xy, iD.picUtil.getEntityPlaneParam(wayEntity));
                geometry.lng = lonlats[0];
                geometry.lat = lonlats[1];
                geometry.elevation = lonlats[2];
            }
            */
      if (!context.transactionEditor()) {
        var firstNode = context.entity(wayEntity.nodes[0]);
        if (!iD.util.justNodeInPlyGonx(firstNode, context)) {
          Dialog.alert("禁止编辑非任务归属数据");
          return;
        }
      }

      // 判断坐标是否在范围内
      if (locationOutTaskEditable([geometry.lng, geometry.lat])) {
        return;
      }
      var rstData = iD.geo.chooseEdge(
        mapNodes,
        context.projection([geometry.lng, geometry.lat]),
        context.projection
      );
      if (!rstData || rstData.index == null) {
        console.log("点击的位置没有查询到索引");
        return;
      }
      // 判断节点间距
      var prevNode = mapNodes[rstData.index - 1];
      var nextNode = mapNodes[rstData.index];
      if (
        checkLineNodeDistanceLTE(
          _.pluck(_.compact([prevNode, nextNode]), "loc"),
          [geometry.lng, geometry.lat]
        )
      ) {
        return;
      }

      var marker = self.createMarker(canvasOffset, {
        draggable: true /*,
	             ondragstart: _zrenderNodeEventDragstart,
	             ondragend: _zrenderNodeEventDragend*/,
      });

      marker.on("dragstart", _zrenderNodeEventDragstart);
      marker.on("dragend", _zrenderNodeEventDragend);

      marker._shape = result;

      if (!result._nodeList) {
        result._nodeList = [];
      }

      if (_.include(["polyline"], result.type)) {
        polylineAddNode(result, rstData.index, geometry);
      } else if (_.include(["polygon"], result.type)) {
        polygonAddNode(result, rstData.index, geometry);
      }
    },

    /**
     * BARRIER_GEOMETRY  轮廓线上增加轮廓标
     * @param {Object} self
     * @param {Object} polyline
     * @param {Object} canvasOffset
     * @param {Object} data
     */
    drawOutlineObjectPT: function (polyline, canvasOffset) {
      var result = polyline;
      var self = this;

      if (!_.include(["polyline"], result.type)) {
        return;
      }
      var wayEntity = context.entity(polyline._entityid);

      if (modelNameParam.BARRIER_GEOMETRY != wayEntity.modelName) {
        return;
      }

      context.buriedStatistics().merge(1, wayEntity.modelName);

      var geometry = iD.picUtil.pixelToLngLat(canvasOffset);
      var mapNodes = context.graph().childNodes(wayEntity);
      var xy = self.reductionPoint(canvasOffset);
      geometry.xy = xy;

      if (!context.transactionEditor()) {
        var firstNode = context.entity(wayEntity.nodes[0]);
        if (!iD.util.justNodeInPlyGonx(firstNode, context)) {
          Dialog.alert("禁止编辑非任务归属数据");
          return;
        }
      }

      var pixes = _.pluck(polyline._nodeList, (d) => {
        return [d.shape.cx, d.shape.cy];
      });
      let dist = iD.util.pt2LineDist(pixes, canvasOffset);

      // 判断坐标是否在范围内
      if (locationOutTaskEditable([geometry.lng, geometry.lat])) {
        return;
      }

      // var rstData = iD.geo.chooseEdge(mapNodes, context.projection([geometry.lng, geometry.lat]), context.projection);
      // if (!rstData || rstData.index == null) {
      //     console.log("点击的位置没有查询到索引");
      //     return;
      // }
      // 判断节点间距
      var prevNode = mapNodes.find((d) => {
        return d.id == polyline._nodeList[dist.i]._entityid;
      });
      var nextNode = mapNodes.find((d) => {
        return d.id == polyline._nodeList[dist.i + 1]._entityid;
      });
      var fieldPlane = iD.picUtil.getEntityPlaneParam2(
        [prevNode.loc, nextNode.loc],
        player.selectPicIndex
      );
      var nloc = iD.picUtil.pixelToLngLatByPlane(xy, fieldPlane);

      var marker = self.createMarker(canvasOffset, {
        draggable: true /*,
	             ondragstart: _zrenderNodeEventDragstart,
	             ondragend: _zrenderNodeEventDragend*/,
      });

      var nodeLoc = iD.util.getBetweenPointLoc(
        prevNode.loc,
        nextNode.loc,
        nloc
      );
      marker.on("dragstart", _zrenderNodeEventDragstart);
      marker.on("dragend", _zrenderNodeEventDragend);

      marker._shape = result;

      if (!result._nodeList) {
        result._nodeList = [];
      }
      let mName = iD.data.DataType.OBJECT_PT;
      var currentLayer = iD.Layers.getCurrentModelEnableLayer(mName);
      node = iD.Node({
        modelName: mName,
        layerId: currentLayer.id,
        identifier: currentLayer.identifier,
        loc: nodeLoc,
      });

      //轮廓标
      node.setTags(
        Object.assign(iD.util.getDefauteTags(node, currentLayer), {
          TYPE: "4",
          SUBTYPE: "0",
        })
      );

      iD.logger.editElement({
        tag: "add_OutlineNode",
        entityId: node.osmId() || "",
        parentId: wayEntity.osmId() || "",
        coordinate: node.loc || [],
        modelName: node.modelName,
      }); //增加节点时--增加埋点操作
      // actions.push(iD.actions.AddEntity(node));
      // actions.push(iD.actions.Noop());

      // actions.push("添加轮廓标");

      context.perform(iD.actions.AddEntity(node), "添加轮廓标");
      // actions.length && context.perform.apply(this, actions);

      context.event.entityedite({
        entitys: [node.id],
      });
    },
    /**
     * 车道线添加中间点
     * @param {Object} polyline
     * @param {Object} canvasOffset
     * @param {Object} opts
     */
    drawGeometryDividerAddMiddlePoint: function (polyline, canvasOffset) {
      var result = polyline;
      var self = this;
      if (!_.include(["polyline"], result.type)) {
        return;
      }
      var wayEntity = context.entity(polyline._entityid);

      if (!_.include([modelNameParam.DIVIDER], wayEntity.modelName)) {
        return;
      }

      context.buriedStatistics().merge(1, wayEntity.modelName);

      var geometry = iD.picUtil.pixelToLngLat(canvasOffset);
      var mapNodes = context.graph().childNodes(wayEntity);
      var xy = self.reductionPoint(canvasOffset);
      geometry.xy = xy;

      if (!context.transactionEditor()) {
        var firstNode = context.entity(wayEntity.nodes[0]);
        if (!iD.util.justNodeInPlyGonx(firstNode, context)) {
          Dialog.alert("禁止编辑非任务归属数据");
          return;
        }
      }

      // 判断坐标是否在范围内
      if (locationOutTaskEditable([geometry.lng, geometry.lat])) {
        return;
      }
      var rstData = iD.geo.chooseEdge(
        mapNodes,
        context.projection([geometry.lng, geometry.lat]),
        context.projection
      );
      if (!rstData || rstData.index == null) {
        console.log("点击的位置没有查询到索引");
        return;
      }
      // 判断节点间距
      var prevNode = mapNodes[rstData.index - 1];
      var nextNode = mapNodes[rstData.index];
      if (
        checkLineNodeDistanceLTE(
          _.pluck(_.compact([prevNode, nextNode]), "loc"),
          [geometry.lng, geometry.lat]
        )
      ) {
        return;
      }

      var marker = self.createMarker(canvasOffset, {
        draggable: true /*,
	             ondragstart: _zrenderNodeEventDragstart,
	             ondragend: _zrenderNodeEventDragend*/,
      });
      //增加中间点时--增加埋点操作
      iD.logger.editElement({
        tag: "add_middlePoint",
        modelName: nextNode.modelName,
      });
      marker.on("dragstart", _zrenderNodeEventDragstart);
      marker.on("dragend", _zrenderNodeEventDragend);

      marker._shape = result;

      if (!result._nodeList) {
        result._nodeList = [];
      }

      polylineAddNode(result, rstData.index, geometry, {
        tags: {
          DASHTYPE: 3,
        },
      });
    },
    // =======******==========
    /**
     * 更新zrender中的图层时，如果更改其中一个属性，可能会将其他属性初始化
     * 问题：放大后、点击一次（更新panable时，缩放和偏移量都初始化）
     * @param {Object} layerid
     * @param {Object} config
     */
    updateZRenderLayer: function (layerid, config) {
      var self = this;
      var configKeys = {
        position: true,
        rotation: true,
        scale: true,
      };
      if (
        layerid == null ||
        layerid.toString() === "" ||
        !config ||
        _.isEmpty(config)
      ) {
        return;
      }
      var opts = {},
        proto = self._zrender.painter.getLayer(layerid);
      for (var keyName in proto) {
        if (configKeys[keyName]) {
          opts[keyName] = proto[keyName];
        }
      }

      // this._zrender.modLayer(layerid, _.extend(opts, config));
      self._zrender.configLayer(layerid, _.extend(opts, config));
    },
    getZRenderLayer: function (layerid = 0) {
      var self = this;
      return self._zrender && self._zrender.painter.getLayer(layerid);
    },
    _lightMapEntities: function (ids) {
      context.enter(
        iD.modes
          .Select(context, ids, null, true)
          .suppressMenu(false)
          .newFeature(false)
      );
    },
    /**
     * canvas绘制时，如果有经过缩放的话，绘制是还是要绘制scale=1时的坐标，而不是通过canvas scale后的坐标；
     * @param {Array} point
     */
    leftZoomOffset: function (point) {
      var self = this;
      var vp = viewZoomParam;
      if (!point || point.length != 2) {
        return point;
      }
      var layer = self.getZRenderLayer(0);
      if (!layer) {
        return [0, 0];
      }
      var offset = [layer.position[0], layer.position[1]];

      var offsetX = (point[0] - offset[0]) / vp.scale;
      var offsetY = (point[1] - offset[1]) / vp.scale;
      var result = [offsetX, offsetY];

      return result;
    },
    /**
     * 图像变形后坐标转换成原图片坐标
     * @param {Object} p
     * @param {Object} element
     */
    reductionPoint: function (p, element) {
      // 在转换时，坐标已经经过reductionUnZoomPoint，转换为缩放前的坐标
      // 所以在进行转换为像素坐标时，应该排除缩放要素
      element = element || player.pics.select(".item.active");
      var $element =
        element instanceof HTMLElement ? d3.select(element) : element;
      element = $element.node();
      var eleHeight = element.clientHeight;
      var eleWidth = element.clientWidth;
      var dheight = $element.attr("d-height");
      var dwidth = $element.attr("d-width");
      if (dheight && dheight > 0) {
        eleHeight = dheight;
      }
      if (dwidth && dwidth > 0) {
        eleWidth = dwidth;
      }

      var heightRate = eleHeight / +player.pic_point.tags.picH;
      var widthRate = eleWidth / +player.pic_point.tags.picW;

      var xy = [
        iD.util.roundNumber(p[0] / widthRate),
        iD.util.roundNumber(p[1] / heightRate),
      ];
      if (xy[0] > player.pic_point.tags.picW) {
        xy[0] = player.pic_point.tags.picW;
      }
      if (xy[1] > player.pic_point.tags.picH) {
        xy[1] = player.pic_point.tags.picH;
      }
      return xy;
    },
    /**
     * 原图片像素坐标转换为图像变形后坐标
     * @param {Object} p
     */
    transformPoint: function (p, element) {
      element = element || player.pics.select(".item.active");
      let $playerNode =
        element instanceof HTMLElement ? element : element.node();
      let heightRate = $playerNode.clientHeight / +player.pic_point.tags.picH;
      let widthRate = $playerNode.clientWidth / +player.pic_point.tags.picW;
      let point = [
        iD.util.roundNumber(p[0] * widthRate),
        iD.util.roundNumber(p[1] * heightRate),
      ];
      return point;
    },
    //***********************
    /**
     * 在影像上添加单独 点
     * @param {Object} self
     * @param {Object} point
     *
     * @return 点
     */
    drawGeometryPoint: function (point, opts) {
      var marker,
        self = this;
      var clickoffset = [
        iD.util.roundNumber(point.canvasOffset[0]),
        iD.util.roundNumber(point.canvasOffset[1]),
      ];
      opts = opts || {};
      if (
        _.include(
          [constant.TELEGRAPH_POLE, constant.TELEGRAPH_LAMP_HOLDER],
          markDrawStatus.type
        )
      ) {
        opts = Object.assign({}, opts, {
          draggable: true,
          ondragstart: _zrenderNodeEventDragstart,
          ondragend: _zrenderPointEventDragend,
        });
        marker = self.createRectangle(clickoffset, opts);
      } else if (
        _.include(
          [
            constant.ADD_CONTROL_POINT,
            constant.ADD_OBJECT_PT,
            constant.ADD_ROAD_ATTRIBUTE,
          ],
          markDrawStatus.type
        )
      ) {
        // let opts = {};
        opts = Object.assign({}, opts, {
          draggable: true,
          ondragstart: _zrenderNodeEventDragstart,
          ondragend: _zrenderPointEventDragend,
        });
        marker = self.createMarker(clickoffset, opts);
      } else {
        marker = self.createMarker(clickoffset, opts);
      }

      return marker;
    },
    /**
     * 为影像上的线、面添加节点，绘制时使用
     * @param {Shape} result
     * @param {Object} point
     * @param {Object} opts
     */
    drawGeometryNodes: function (result, point, opts) {
      var self = this;
      if (!_.include(["polyline", "polygon"], result.type)) {
        return;
      }
      let mkrOpts = {},
        options = opts || {};
      let entityid = options.entityid;
      delete options.entityid;

      if (!options.draggable) {
        mkrOpts.draggable = false;
      } else {
        // 目前DIVIDER_NODE、OBJECT_PL、OBJECT_PG的节点拖拽都可以走这个逻辑
        // 没有进行前方交会，通过算法将像素坐标转为经纬度坐标
        mkrOpts = {
          draggable: true,
          ondragstart: _zrenderNodeEventDragstart,
          ondragend: _zrenderNodeEventDragend,
        };
        _.extend(mkrOpts, options);
      }
      // style/shape param
      iD.picUtil.updateZrenderStyleByEntity(mkrOpts, entityid);

      let clickoffset = [
        iD.util.roundNumber(point.canvasOffset[0]),
        iD.util.roundNumber(point.canvasOffset[1]),
      ];
      let marker = self.createNodeMarker(clickoffset, mkrOpts, entityid);
      marker._shape = result;
      if (!result._nodeList) {
        result._nodeList = [];
      }
      result._nodeList.push(marker);
      self._zrender.add(marker);
      return marker;
    },
    //==============
    // 前方交会左侧
    zrenderDrawPoint: function (point) {
      var self = this;
      var isMorePoint = _.include([], markDrawStatus.type);
      if (markDrawStatus.type && !isMorePoint) {
        self.clearLeftZrenderMarker();
      }

      var star = this.createStar(point);
      picLeftMarkers.push(star);
      _zrenderStarSetUnZoomStyle(star);
      self._zrender.add(star);

      return star;
    },
    clearLeftZrenderMarker: function () {
      var self = this;
      // 删除左侧marker
      if (self._zrender) {
        for (var i in picLeftMarkers) {
          var mkr = picLeftMarkers[i];
          self._zrender.remove(mkr);
        }
        picLeftMarkers.length = 0;
      }
    },
    zrenderDrawpolyline: function (point, isDblclick = false) {
      var self = this;
      var shape = markDrawStatus.shape;

      if (!shape) {
        shape = markDrawStatus.shape = self.createPolyline([point]);
        tempShape = self.createPolyline([point, point]);
        self._zrender.add(shape);
        self._zrender.add(tempShape);
        self._zrender.on("mousemove", self.zrenderMove, self);
      } else {
        var tempPoint = _.last(shape.shape.points);
        if (tempPoint[0] != point[0] && tempPoint[1] != point[1]) {
          shape.shape.points.push(point);
          shape.setShape("points", shape.shape.points);
        }
      }

      if (isDblclick) {
        // self._zrender.remove(tempShape);
        self._zrender.remove(tempShape);
        self._zrender.off("mousemove", self.zrenderMove);
        var points = [];
        for (
          var i = 0, len = markDrawStatus.shape.shape.points.length;
          i < len;
          i++
        ) {
          points.push(
            self.reductionPoint(markDrawStatus.shape.shape.points[i])
          );
        }

        markDrawStatus.shape = null;
        tempShape = null;
      }

      return shape;
    },
    zrenderDrawPolygon: function (point, isDblclick = false) {
      var self = this;
      // 多边形
      var shape = markDrawStatus.shape;

      if (!shape) {
        shape = markDrawStatus.shape = self.createPolygon([
          point,
          point,
          point,
        ]);
        // self._zrender.add(shape);
        self._zrender.add(shape);
        self._zrender.on("mousemove", self.zrenderMove, self);
      } else {
        var pointList = shape.shape.points;
        // 双击结束时不需要追加新的节点，而是替换倒数第二个节点
        pointList.splice(pointList.length - 2, 1, point);
        if (!isDblclick) {
          pointList.splice(pointList.length - 1, 0, point);
        }
        shape.setShape("points", pointList); //使用set方法，将图像重新绘制 Tilden
      }
      if (isDblclick) {
        // self._zrender.remove(tempShape);
        self._zrender.off("mousemove", self.zrenderMove);
        markDrawStatus.shape = null;
        tempShape = null;
      }

      return shape;
    },
    /**
     * 已地图为主，先绘制地图上的entity，再重新反投
     * @param {Object} self
     * @param {Object} point
     * @param {Object} isMouseup
     */
    zrenderDrawRectangeOnMap: function (point, isMouseup = false) {
      var self = this;
      // 矩形
      var entityid = zrenderNodeStatus.drawingEntityid;

      if (isMouseup) {
        zrenderNodeStatus.moveOffset = point;
        self._zrender.off("mousemove", self.zrenderMove);
        self.zrenderMove(null, { mouseup: true });
        markDrawStatus.shape = null;
        tempShape = null;
        zrenderNodeStatus.downOffset = zrenderNodeStatus.moveOffset = undefined;
        entityid = zrenderNodeStatus.drawingEntityid;
        zrenderNodeStatus.drawingEntityid = undefined;
      } else {
        zrenderNodeStatus.downOffset = zrenderNodeStatus.moveOffset = point;

        self._zrender.on("mousemove", self.zrenderMove, self);
      }

      return entityid;
    },
    zrenderDrawRectange: function (point, isMouseup = false) {
      var self = this;
      // 矩形
      var shape = markDrawStatus.shape;

      if (!shape) {
        shape = markDrawStatus.shape = self.createPolygon(
          [point, 0, point, 0, point],
          {
            custType: "rect",
          }
        );
        self._zrender.add(shape);
        self._zrender.on("mousemove", self.zrenderMove, self);
      }

      if (isMouseup) {
        // self._zrender.remove(tempShape);
        self._zrender.off("mousemove", self.zrenderMove);
        markDrawStatus.shape = null;
        tempShape = null;
      }

      return shape;
    },
    /**
     * zrender mousedown后绑定的move事件
     */
    zrenderMove: function (e, opts = {}) {
      var self = this;
      if (e) {
        zrenderNodeStatus.moveOffset = self.leftZoomOffset([
          e.event.offsetX,
          e.event.offsetY,
        ]);
      } else {
        zrenderNodeStatus.moveOffset = zrenderNodeStatus.moveOffset;
      }

      var flag = execPlugin(
        "zrenderMove",
        e,
        zrenderNodeStatus.moveOffset,
        opts
      );
      if (flag) return;

      if (!e) {
        return;
      }

      var shape = markDrawStatus.shape;
      if (!shape) {
        self._zrender.off("mousemove", self.zrenderMove);
        return;
      }
      var pointList = shape.shape.points;
      var evtOffset = self.leftZoomOffset([e.event.offsetX, e.event.offsetY]);
      // let excLine = false ;
      // if(shape._entityid && shape.type == 'polyline' ){
      //     let entity = context.hasEntity(shape._entityid);

      //     excLine = entity.modelName == true
      // }
      if (
        shape.type == "polyline" &&
        _.include(
          [
            constant.ADD_DIVIDER,
            constant.ADD_OBJECT_PL,
            constant.ADD_PAVEMENT_DISTRESS_LINE,
            constant.ADD_PAVEMENT_DISTRESS_LINE2,
            constant.ADD_BARRIER_GEOMETRY,
            constant.BRIDGE_BOTTOM_LINE,
            constant.ADD_DIVIDER_POLYGON,
          ],
          markDrawStatus.type
        )
      ) {
        shape = tempShape;
        // pointList = shape.shape.points;
        shape.shape.points = [_.last(pointList), evtOffset];
      } else if (
        shape.type == "polygon" &&
        _.include(
          [
            //                  constant.TELEGRAPH_LAMP_HOLDER,
            //          		constant.ADD_GROUND_AREA,
            constant.ADD_BOARD,
          ],
          markDrawStatus.type
        )
      ) {
        // 矩形拉框逻辑：第一个点是起点，第三个点是相对的点
        let _points = [shape.shape.points[0], evtOffset];
        let rectPoints = iD.picUtil.createRectangeBy2Point(_points);
        rectPoints[rectPoints.length] = shape.shape.points[0];
        shape.shape.points = rectPoints;
      } else if (
        shape.type == "polygon" &&
        _.include(
          [
            constant.ADD_OBJECT_PG,
            constant.ADD_PAVEMENT_DISTRESS,
            constant.ADD_BOARD_POLYGON,
            constant.ADD_BOARD_POLYGON_PLANE,
            constant.ADD_TRAFFICLIGHT,
          ],
          markDrawStatus.type
        )
      ) {
        // 多边形
        // var pointList = shape.shape.points;
        // 绘制面类型时，如果撤销一次，面类型移动时的形状与节点不符的问题；
        var way = shape._entityid ? context.hasEntity(shape._entityid) : null;
        if (way && pointList.length - way.nodes.length != 1) {
          pointList.splice(way.nodes.length - 1);
          pointList.push(...[evtOffset, pointList[0]]);
        } else {
          pointList.splice(pointList.length - 2, 1, evtOffset);
        }
      } else {
        // 默认绘制
        if (shape.type == "polyline") {
          // 线
          shape = tempShape;
          shape.shape.points = [_.last(pointList), evtOffset];
        } else if (shape.type == "polygon" && shape.custType == "rect") {
          // 使用多边形的矩形拉框
          let _points = [shape.shape.points[0], evtOffset];
          let rectPoints = iD.picUtil.createRectangeBy2Point(_points);
          rectPoints[rectPoints.length] = shape.shape.points[0];
          shape.shape.points = rectPoints;
        } else if (shape.type == "polygon") {
          // 多边形
          pointList.splice(pointList.length - 2, 1, evtOffset);
        }
      }
      if (shape) {
        // 跨帧绘制车道线，如果超过反投范围，shape不会渲染到视频上
        // 需要重新添加，addShape本身会排重；
        self._zrender.add(shape);
      }
      shape.setShape("points", shape.shape.points); //使用set方法，将图像重新绘制 Tilden
    },
    //======================
    clearVectorPointData: function () {
      markVectorPoint.loc = null;
      if (markVectorPoint.shape) {
        this._zrender.remove(markVectorPoint.shape);
      }
      markVectorPoint.shape = null;
      markVectorPoint.points = null;
      return true;
    },
    resetCanvas: function () {
      var self = this;
      if (self._zrender) {
        self._zrender.clear();
        self.pointToPicPlayer();
      }
      // context.entity(ids[0]).geometry(context.graph()) == 'point'
      // 标记类型定位后保持高亮；
      var ids = context.selectedIDs();
      var eidList = [];
      _.each(ids, function (id) {
        var e = context.hasEntity(id);
        e && eidList.push(e.id);
      });
      // 打断等情况可能entity不存在
      if (eidList.length) {
        iD.AutoMatch.shapeHover(player, eidList);
      } else {
        self.clearZRenderHover();
      }
    },
    resetPointToPicPlayer: function (acceptids) {
      if (!this._zrender) return;
      this.pointToPicPlayer(acceptids);
    },
    getConstant: function () {
      return constant;
    },
    getPlayer: function () {
      return player;
    },
    // 实线模式，虚线模式切换
    setSolidLineRender: function (b) {
      isSolidLine = b;
      this.resetCanvas();
    },
    isDashedLineMode: function () {
      return isSolidLine;
    },
    //======================
    clearZRenderHover: clearZRenderHover,
    drawClickBreakNode: drawClickBreakNode,
    clearZRenderNodeStatus: clearZRenderNodeStatus,
    checkLineNodeDistanceLTE: checkLineNodeDistanceLTE,
    clearWrongShapeAndEntity: clearWrongShapeAndEntity,
    locationOutTaskEditable: locationOutTaskEditable,
    _drawActionsPerform: _drawActionsPerform,
    // 绘制线路时的临时数据
    clearTempShape: function () {
      tempShape && this._zrender.remove(tempShape);
      tempShape = undefined;
    },
    execPlugin: execPlugin,
    //======================,
    getDrawPlugins: function () {
      if (isSubPlayer) {
        var subPlugins = ["default", constant.INTERSECTION];
        return drawPlugins.filter(function (d) {
          return d.getId && subPlugins.includes(d.getId());
        });
      }
      return drawPlugins;
    },
  });

  //通过比例尺定义高精节点大小
  function computeZrenderCircleRadius(point) {
    if (isSameCircleSize) {
      return 5;
    }
    var height = player.pics.node().getBoundingClientRect().height;
    var halfheight = height / 2;
    var y = point[1];
    // 计算出距离中心点的比例
    var yscale = Math.abs(halfheight - y) / halfheight;
    r = 2.5 + parseInt(yscale / 0.2);
    return r + 2 * yscale;
  }
  window.computeZrenderCircleRadius = computeZrenderCircleRadius;

  /**
   * 判断节点之间的距离
   * @param {Array} loc1
   * @param {Array} loc2
   * @param {Object} opts
   * 		distance：	间距，单位cm
   * 		alert：		是否提示
   */
  function checkLineNodeDistanceLTE(
    loc1,
    loc2,
    opts = { distance: 0.2, alert: true }
  ) {
    return false;
    /*
        var flag = false;
        var distance = opts.distance == null ? 0.2 : opts.distance;
        var locs = loc1;
        if(!_.isArray(loc1[0])){
            locs = [loc1];
        }
        for(var loc of locs){
            var dis = iD.util.distanceByLngLat(loc, loc2);
            if(dis <= distance){
                flag = true;
                break;
            }
        }
        flag && opts.alert && Dialog.alert('节点之间距离必须大于' + (distance * 100) + 'cm', null, null, null, null, {
            AutoClose: 3
        });
        return flag;
        */
  }

  /**
   * 坐标超出当前任务的可编辑范围；
   */
  function locationOutTaskEditable(loc, opts = {}) {
    if (
      iD.util.pointNotInPlyGonx(loc, context) &&
      context.transactionEditor()
    ) {
      clearWrongShapeAndEntity();
      player.clearFooterButton();
      clearZRenderNodeStatus();
      if (opts.pop == true) {
        context.pop();
      }
      // 可能有残留数据，需要重新反投
      SELF.resetCanvas();
      Dialog.close();
      Dialog.alert(t("task_bounds.outside"));
      opts.callback && opts.callback(context);
      return true;
    }
    opts.callback && opts.callback(context);
    return false;
  }

  /**
   * 清理不合理的脏数据
   * @param {Object} checkShape
   */
  function clearWrongShapeAndEntity(checkShape) {
    var shape = checkShape || markDrawStatus.shape;
    if (shape) {
      var delShapes = [],
        delEntities = [];
      var entity = context.hasEntity(shape._entityid);
      //          iD.logger.editElement('add_divider_end',entity.modelName,'','','auto');
      // shape对应的线，节点只有1个
      if (entity instanceof iD.Way) {
        if (!entity.isArea() && entity.nodes.length == 1) {
          delEntities.push(entity.id);
          delShapes.push(shape);
          shape._nodeList &&
            shape._nodeList[0] &&
            delShapes.push(shape._nodeList[0]);
        } else if (
          (entity.isArea() || _.include(["polygon"], shape.type)) &&
          shape._nodeList &&
          shape._nodeList.length < 3
        ) {
          // 面shape，只有两个点
          // 第一个点是前方交汇绘制时，没等到前方交会结果就取消绘制，没有nodeList
          for (var sp of shape._nodeList || []) {
            delShapes.push(sp);
          }
          delShapes.push(shape);
          entity && delEntities.push(entity.id);

          if (delEntities.length) {
            Dialog.alert("面类型至少三个节点", null, null, null, null, {
              AutoClose: 3,
            });
          }
        }
      }

      for (var sp of delShapes) {
        SELF._zrender.remove(sp);
      }

      if (delEntities.length) {
        markDrawStatus.shape = null;
        context.replace(iD.actions.DeleteMultiple(delEntities, context), "");
        context.pop();
      }
    }
  }
  /**
   * 验证shape是否为脏数据
   * @param {Object} checkShape
   * @param {String} checkType 指定类型
   */
  clearWrongShapeAndEntity.isWrong = function (checkShape, checkType) {
    var shape = checkShape || markDrawStatus.shape;
    if (!shape._entityid) {
      return false;
    }
    checkType = checkType || shape.type;
    if (!checkType) {
      return false;
    }
    if (checkType == "polyline") {
      return context.entity(shape._entityid).nodes.length < 2;
    } else if (checkType == "polygon") {
      // ABA、ABCA
      return context.entity(shape._entityid).nodes.length < 4;
    }

    return false;
  };

  /**
   * 根据缩放级别调整style中的r和lineWidth等参数
   * @param {Zrender/Star} item
   */
  function _zrenderStarSetUnZoomStyle(item) {
    var vp = viewZoomParam;
    if (item instanceof StarShape) {
      if (item.__lineWidth == null) {
        item.__lineWidth = item.style.lineWidth;
      }
      if (item.__r == null) {
        item.__r = item.shape.r;
      }
      item.style.lineWidth = item.__lineWidth / vp.scale;
      item.shape.r = item.__r / vp.scale;
    }
  }

  /**
   * 是否点击到了首尾节点
   * @param {String} type 根据type判断modelName类型
   * @param {Array} exclude 排除的wayid数组，符合任意一个都会false
   * @return downEntityid || false
   */
  function drawClickBreakNode(type, exclude = []) {
    var downid = zrenderNodeStatus.downEntityid;
    if (!downid) return false;

    var modelName;
    if (type === constant.ADD_DIVIDER) {
      modelName = modelNameParam.DIVIDER_NODE;
    } else if (type === constant.ADD_OBJECT_PL) {
      modelName = modelNameParam.OBJECT_PL_NODE;
    }
    var entity = context.entity(downid);
    if (!modelName || entity.modelName != modelName) {
      return false;
    }

    if (iD.util.nodeIsBreakPoint(entity, context.graph())) {
      if (exclude && exclude.length) {
        var ways = context.graph().parentWays(entity);
        var isExclude =
          _.difference(_.pluck(ways, "id"), exclude).length < ways.length;
        if (isExclude) return false;
      }
      return {
        entityid: downid,
        shape: zrenderNodeStatus.downShape,
      };
    }
    return false;
  }

  function _mouseUpNodeCanDrag(e) {
    if (
      zrenderNodeStatus.dragoverShape &&
      zrenderNodeStatus.dragoverShape.id === this.id
    ) {
      return;
    }
    if (!markDrawStatus.type && !tempShape) {
      let mkr = this;
      // 拖拽过程中禁止选中节点，否则可能导致进入select的mode，无法共点；
      if (mkr.dragging) return;
      // 有shape就是在 线/多边形 上的点
      // if(mkr._entityid && mkr._shape){
      //     SELF._lightMapEntities([mkr._entityid]);
      // }else if(mkr._entityid){
      //     SELF._lightMapEntities([mkr._entityid]);
      // }
      var ctrlKey = e && e.event && e.event.ctrlKey;
      // ctrlKey时支持多选点
      if (mkr._entityid) {
        let et = context.hasEntity(mkr._entityid);
        if (
          et &&
          !ctrlKey &&
          et._light_entityids &&
          et._light_entityids.length
        ) {
          SELF._lightMapEntities([et.id]);
          iD.AutoMatch.shapeHover(SELF, [et.id].concat(et._light_entityids));
        } else if (ctrlKey) {
          SELF._lightMapEntities(context.selectedIDs().concat([mkr._entityid]));
        } else {
          SELF._lightMapEntities([mkr._entityid]);
        }
      }
    }
    _mouseUpNode2PlayerFrame.call(this, e);
  }

  function _mouseUpNode2PlayerFrame(e, mkr) {
    mkr = mkr || this;
    // ALT+点击
    if (!e || !e.event.altKey) {
      return;
    }
    if (mkr.trackPointId) {
      player.locateTrackPointToPlayer(mkr.trackPointId, mkr.trackId);
      return;
    }

    var entity = context.hasEntity(mkr._entityid);
    // 前方交会点跳转
    if (entity && entity.isPlaceName && entity.isPlaceName()) {
      let trackId = entity.tags.trackId,
        trackPointId = entity.tags.trackPointId;
      if (trackId && trackPointId) {
        player.locateTrackPointToPlayer(trackPointId, trackId);
      }
    }
  }

  // 添加到zrender中的circle与rectangle的onmousedown事件
  // 判断节点是否可拖拽
  function _mousedownNodeCanDrag(e) {
    SELF._zrenderEntityMousedown.call(this, e);
    var mkr = this;
    if (mkr.__defDraggable == undefined) {
      mkr.__defDraggable = mkr.draggable;
    }
    if (isSubPlayer) {
      mkr.draggable = false;
      return false;
    }
    var entity = context.hasEntity(mkr._entityid);
    if (!entity) {
      return false;
    }
    let modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
    if (!modelConfig) {
      return false;
    }

    var shapeType = (this._shape && this._shape.type) || "";
    if (entity) {
      // 场景判断
      /*if(!context.variable.edit.editDivider){
                if(entity.modelName == iD.data.DataType.DIVIDER_NODE){
                    mkr.draggable = false;
                    return false;
                }
            }
            if(!context.variable.edit.editOther){
                if(entity.modelName != iD.data.DataType.DIVIDER_NODE){
                    mkr.draggable = false;
                    return false;
                }
            }*/
      //判断在禁止编辑的情况下，禁止拖拽视频点（Tilden）
      var entity_editable = modelConfig.editable;
      if (!entity_editable) {
        mkr.draggable = false;
        return false;
      }
      if (
        !context.transactionEditor() &&
        [modelNameParam.LAMPPOST, modelNameParam.OBJECT_PT].includes(
          entity.modelName
        )
      ) {
        if (!iD.util.justNodeInPlyGonx(entity, context)) {
          mkr.draggable = false;
          return false;
        }
      } else if (!context.transactionEditor()) {
        var way = context.graph().parentWays(entity)[0];
        if (!way) return true;
        var firstNode = context.entity(way.nodes[0]);
        if (!iD.util.justNodeInPlyGonx(firstNode, context)) {
          mkr.draggable = false;
          // Dialog.alert('节点不可以编辑')
          return false;
        }
      }
      // models.datas中可能未配置该 modelName
      if (
        !iD.Layers.getLayer(entity.layerId).isModelEditable(entity.modelName)
      ) {
        mkr.draggable = false;
        return false;
      }

      if (shapeType == "polyline") {
        // 路牌、桥底线情况不管
        if (
          !_.include(
            [modelNameParam.TRAFFICSIGN_NODE, modelNameParam.BRIDGE_NODE],
            entity.modelName
          ) &&
          !iD.picUtil.canNotDrag(entity)
        ) {
          mkr.draggable = false;
          return false;
        }
      }
    }
    if (markDrawStatus.type) {
      mkr.draggable = false;
    } else {
      mkr.draggable = mkr.__defDraggable;
    }
    return false;
  }

  function polylineAddNode(shape, index, geometry, options = {}) {
    var actions = [],
      way,
      node;
    if (shape.type == "polyline" && shape._entityid) {
      way = context.entity(shape._entityid);
      var modelName = modelNameParam.DIVIDER_NODE;
      if (modelNameParam.OBJECT_PL == way.modelName) {
        modelName = modelNameParam.OBJECT_PL_NODE;
      } else if (modelNameParam.BRIDGE == way.modelName) {
        modelName = modelNameParam.BRIDGE_NODE;
      } else if (modelNameParam.BARRIER_GEOMETRY == way.modelName) {
        modelName = modelNameParam.BARRIER_GEOMETRY_NODE;
      }

      var currentLayer = iD.Layers.getCurrentModelEnableLayer(modelName);
      node = iD.Node({
        modelName: modelName,
        layerId: currentLayer.id,
        identifier: currentLayer.identifier,
        // tags: iD.util.getDefauteTags(modelName),
        loc: [geometry.lng, geometry.lat, geometry.elevation],
      });
      node.setTags(
        Object.assign(iD.util.getDefauteTags(node, currentLayer), options.tags)
      );
      iD.logger.editElement({
        tag: "add_lineNode",
        entityId: node.osmId() || "",
        parentId: way.osmId() || "",
        coordinate: node.loc || [],
        modelName: node.modelName,
      }); //增加节点时--增加埋点操作
      // 不清楚为什么(可能是因为graph.replace而不是perform)，添加的点以及更新的线节点不生效，并且点没有绘制到线上
      actions.push(iD.actions.Noop());
      actions.push(
        iD.picUtil.measureinfoAction(node, {
          trackPointId:
            player.allNodes[player.selectPicIndex].tags.trackPointId,
          imgOffset: { x: geometry.xy[0], y: geometry.xy[1] },
        })
      );
      actions.push(iD.picUtil.actionGeometryLineAddNode(way, node, index));
      actions.push("添加线路节点");
    }
    if (way) {
      historyPicOperate = true;
      actions.length && context.perform.apply(this, actions);
      historyPicOperate = false;
      if (node.modelName == iD.data.DataType.DIVIDER_NODE) {
        iD.util.checkErrors(
          context.graph(),
          player.wayInfo.K,
          player.pic_point,
          node
        );
      }
      context.event.entityedite({
        entitys: [way.id],
      });
      SELF.event.add(node.id);
    }
  }

  function polygonAddNode(shape, index, geometry) {
    var actions = [],
      way,
      node;
    if (shape.type == "polygon" && shape._entityid) {
      way = context.entity(shape._entityid);
      var modelName = "";
      if (modelNameParam.OBJECT_PG == way.modelName) {
        modelName = modelNameParam.OBJECT_PG_NODE;
      } else if (modelNameParam.PAVEMENT_DISTRESS == way.modelName) {
        modelName = modelNameParam.PAVEMENT_DISTRESS_NODE;
      }
      var currentLayer = iD.Layers.getCurrentModelEnableLayer(modelName);
      node = iD.Node({
        modelName: modelName,
        layerId: currentLayer.id,
        identifier: currentLayer.identifier,
        // tags: iD.util.getDefauteTags(modelName),
        loc: [geometry.lng, geometry.lat, geometry.elevation],
      });
      node.setTags(iD.util.getDefauteTags(node, currentLayer));
      iD.logger.editElement({
        tag: "add_lineNode",
        entityId: node.osmId() || "",
        parentId: way.osmId() || "",
        coordinate: node.loc || [],
        modelName: node.modelName,
        filter: iD.logger.getFilter(way, context),
      }); //增加节点时--增加埋点操作
      // 不清楚为什么(可能是因为graph.replace而不是perform)，添加的点以及更新的线节点不生效，并且点没有绘制到线上
      actions.push(iD.actions.Noop());
      actions.push(
        iD.picUtil.measureinfoAction(node, {
          trackPointId:
            player.allNodes[player.selectPicIndex].tags.trackPointId,
          imgOffset: { x: geometry.xy[0], y: geometry.xy[1] },
        })
      );
      actions.push(iD.picUtil.actionGeometryLineAddNode(way, node, index));
      actions.push("添加线路节点");
    }
    if (way) {
      actions.length && context.perform.apply(this, actions);
      context.event.entityedite({
        entitys: [way.id],
      });
      SELF.event.add(node.id);
    }
  }

  /**
   * 切换帧也保持道路绘制功能
   * @param {Object} shape entity是way类型的shape
   * @param {Object} self
   * @return [true|false] true为继续绘制的逻辑，false为不是
   */
  function continueDrawDivider(self, shape) {
    if (
      !(
        markDrawStatus.drawing &&
        _.include(
          [
            constant.ADD_DIVIDER,
            constant.ADD_OBJECT_PL,
            constant.ADD_PAVEMENT_DISTRESS_LINE,
            constant.ADD_PAVEMENT_DISTRESS_LINE2,
            constant.ADD_PAVEMENT_DISTRESS,
            constant.ADD_BARRIER_GEOMETRY,
            constant.ADD_OBJECT_PG,
          ],
          markDrawStatus.type
        )
      )
    ) {
      return false;
    }
    if (
      markDrawStatus.shape &&
      markDrawStatus.shape._entityid == shape._entityid
    ) {
      markDrawStatus.shape = shape;
      var evtOffset;
      if (shape.type == "polyline" && tempShape) {
        evtOffset = SELF.leftZoomOffset(_.last(tempShape.shape.points));
        self._zrender.remove(tempShape);
        //              tempShape.style = _.cloneDeep(shape.style);
        //              tempShape.shape.points = [_.last(shape.shape.points),evtOffset];
        tempShape = self.createPolyline([
          _.last(shape.shape.points),
          evtOffset,
        ]);
        self._zrender.add(tempShape);
      }
    }
    return true;
  }

  // 为影像上的线、面添加节点
  function drawGeometryNodes(self, result, point, opts) {
    if (!_.include(["polyline", "polygon"], result.type)) {
      return;
    }
    let mkrOpts = {},
      options = opts || {};
    let entityid = options.entityid;
    delete options.entityid;

    if (!options.draggable) {
      mkrOpts.draggable = false;
    } else {
      // 目前DIVIDER_NODE、OBJECT_PL、OBJECT_PG的节点拖拽都可以走这个逻辑
      // 没有进行前方交会，通过算法将像素坐标转为经纬度坐标
      mkrOpts = {
        draggable: true,
        ondragstart: _zrenderNodeEventDragstart,
        ondragend: _zrenderNodeEventDragend,
      };
      _.extend(mkrOpts, options);
    }
    // style/shape param
    iD.picUtil.updateZrenderStyleByEntity(mkrOpts, entityid);

    let clickoffset = [
      iD.util.roundNumber(point.canvasOffset[0]),
      iD.util.roundNumber(point.canvasOffset[1]),
    ];
    let marker = self.createNodeMarker(clickoffset, mkrOpts, entityid);
    marker._shape = result;
    //      marker.on("dragstart", _zrenderNodeEventDragstart);
    //      marker.on("mouseup", _zrenderNodeEventDragend);

    if (!result._nodeList) {
      result._nodeList = [];
    }

    result._nodeList.push(marker);
    self._zrender.add(marker);
    return marker;
  }

  function createRelationNode(self, shape) {
    let pointList = shape.shape.points;
    let pointMap = shape._pointMappingNode;
    let pointMapIndexs = _.keys(pointMap);
    let i = 0,
      len = pointList.length;
    let point, draggable, mapidx, nodeid, mapNode;
    for (; i < len; i++) {
      point = pointList[i];
      draggable = false;
      mapidx = pointMapIndexs[i];
      nodeid = pointMap[mapidx];
      mapNode = context.graph().hasEntity(nodeid);
      if (
        mapNode &&
        [
          modelNameParam.OBJECT_PG_NODE,
          modelNameParam.DIVIDER_NODE,
          modelNameParam.OBJECT_PL_NODE,
          modelNameParam.PAVEMENT_DISTRESS_NODE,
          modelNameParam.TRAFFICSIGN_NODE,
          modelNameParam.BRIDGE_NODE,
          modelNameParam.TRAFFICLIGHT_NODE,
          modelNameParam.BARRIER_GEOMETRY_NODE,
          modelNameParam.ROAD_FACILITIES_NODE,
          modelNameParam.HD_LANE_NODE,
        ].includes(mapNode.modelName)
      ) {
        draggable = true;
      }
      let marker = drawGeometryNodes(
        self,
        shape,
        { canvasOffset: point },
        {
          draggable: draggable,
          entityid: nodeid,
        }
      );
      if (nodeid) {
        marker && (marker._entityid = nodeid);
        // 当前点在整个道路上的节点位置
        marker && (marker._dividerindex = parseInt(mapidx));
      }
      if (!isSameCircleSize) {
        marker &&
          iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);
      }
      // self._zrender.add(marker);
      marker && self._zrender.add(marker);
    }
    delete shape._pointMappingNode;
    pointMapIndexs.length = 0;
    return;
  }

  DrawTool.prototype.pointToPicPlayer = function (acceptids) {
    var player = this.player,
      self = this;
    clearZRenderHover();
    if (acceptids && acceptids.length) {
      // 只反投指定的entities，需要先将zrender上对应的shape删除
      let shapeList = self._zrender.storage.getDisplayList();
      let shape;
      for (let i in shapeList) {
        shape = shapeList[i];
        if (shape._entityid && _.include(acceptids, shape._entityid)) {
          self._zrender.remove(shape);
        }
      }
    } else {
      // 反投轨迹点列表
      if (
        context.variable.isDrawTrackPointsToShape &&
        player.zrenderTrackVisible
      ) {
        self.drawTrackPointsToShape();
      }
    }

    let shapes;
    if (player.pic_point.tags.picHeight) {
      shapes = iD.OrthoggraphicAutoMatch.trackPointToPicPlayer(
        player.pic_point,
        player,
        isSolidLine,
        acceptids
      );
    } else {
      shapes = iD.AutoMatch.trackPointToPicPlayer(
        player.pic_point,
        player,
        isSolidLine,
        acceptids
      );
    }
    var shape,
      mappingNodeMap = {};
    for (shape of shapes) {
      if (shape.entity instanceof iD.Way) {
        shape.entity.nodes.forEach(function (nid) {
          mappingNodeMap[nid] = true;
        });
      }
    }
    var continueShape;
    if (shapes && shapes.length > 0) {
      let i = 0,
        len = shapes.length,
        newShape;
      for (; i < len; i++) {
        shape = shapes[i];
        if (!shape.coordinates || !shape.coordinates.length) {
          continue;
        }
        if (shape.entity) {
          var entity = shape.entity;
          if (entity.modelName == modelNameParam.TRAFFICSIGN_NODE) {
            continue;
          }
        }
        if (!shape.entity || !mappingNodeMap[shape.entity.id]) {
          newShape = self.createShap(shape);
          if (shape.entity) {
            newShape._entityid = shape.entity.id;
          }
          newShape._pointMappingNode = shape.pointMappingNode;
          // 这里没有线的节点
          iD.picUtil.updateZrenderStyleByEntity(newShape, newShape._entityid);
          iD.picUtil.dashedSolidDivider(
            newShape,
            newShape._entityid,
            isSolidLine
          );
          //iD.picUtil.cancelRelations(newShape._entityid);
          // self._zrender.add(newShape);
          self._zrender.add(newShape);
        }

        if (newShape && shape.entity instanceof iD.Way) {
          // 创建线的节点

          if (shape.entity.modelName == modelNameParam.TRAFFICSIGN) {
            createRelationNode(self, newShape);
          } else {
            createRelationNode(self, newShape);
            // 需要反投的shape；
            if (
              markDrawStatus.shape &&
              markDrawStatus.shape._entityid == shape.entity.id
            ) {
              continueShape = newShape;
            }
          }
          iD.picUtil.updateZrenderStyleByEntity(newShape, newShape._entityid);
        }
      }
    }
    if (continueShape) {
      continueDrawDivider(self, continueShape);
    }
    player.refreshLeftEpilineCross();
    player.zrenderRedraw && player.zrenderRedraw();
  };

  function clearZRenderNodeStatus() {
    zrenderNodeStatus.dragoverShape = null;
    zrenderNodeStatus.drawingEntityid = null;
    zrenderNodeStatus.downEntityid = null;
    // 跨帧绘制时，设置tempShape会用到
    //      zrenderNodeStatus.downOffset = null;
    //      zrenderNodeStatus.moveOffset = null;
    zrenderNodeStatus.downShape = null;
    zrenderNodeStatus.areaPivot = null;
    zrenderNodeStatus.dragProtoAngle = null;
  }

  function clearZRenderHover() {
    if (SELF._zrender) {
      SELF._zrender.painter.clearHover();
      // 清除高亮需要刷新
      SELF._zrender.painter.refresh();
    }
  }

  function _zrenderNodeEventDragstart(e) {
    player.isPlayPic = false;
    clearZRenderNodeStatus();
    zrenderNodeStatus.downOffset = SELF.leftZoomOffset([
      e.event.offsetX,
      e.event.offsetY,
    ]);
    //  	if(markDrawStatus.shape){
    //  		return ;
    //  	}
    var mkr = this;
    zrenderNodeStatus.downEntityid = mkr._entityid;
    zrenderNodeStatus.drawingEntityid = mkr._shape && mkr._shape._entityid;
    if (!mkr._entityid) {
      player._zrender.off("mousemove");
      player._zrender.off("mouseup");
      return false;
    }
    player.canvasClickCheck = false;
    //      mkr._protoLoc = [mkr.shape.cx, mkr.shape.cy];
    mkr._protoLoc = iD.picUtil.shapeXY(mkr);
    //      iD.picUtil.shapePosition(mkr, [0, 0]);
    // zrender 4.x，拖拽时更新position会导致dragenter等事件无法触发；
    // 拖拽结束后再更新xy坐标与position；
    // 拖拽时的偏移量是根据shape中的_x和_y参数作为拖拽开始的基准点；
    //      mkr._x = mkr._protoLoc[0];
    //      mkr._y = mkr._protoLoc[1];
    //      console.log('pic dragstart ... start xy: ', [mkr._x, mkr._y]);
    let entity = context.hasEntity(mkr._entityid);
    let modelName;
    if (entity && entity instanceof iD.Node) {
      let ways = context.graph().parentWays(entity);
      let datum = ways.length > 0 ? ways[0] : entity;
      modelName = datum.modelName;
    } else if (entity && entity instanceof iD.Way) {
      modelName = entity.modelName;
    }
    context.buriedStatistics().merge(1, modelName);

    let first = true,
      isDrag = false;
    player._zrender.off("mousemove");
    player._zrender.off("mouseup");

    player._zrender.on("mousemove", function (evt) {
      isDrag = true;
      clearZRenderHover();
      _zrenderNodeEventMousemove.call(mkr, evt);
      execPluginTrigger("dragEventMove", evt, zrenderNodeStatus.moveOffset, {
        isFirst: first,
      });
      if (first) {
        var entity = context.hasEntity(zrenderNodeStatus.downEntityid);
        var parentEntity = context.graph().parentWays(entity)[0];
        if (
          entity &&
          (entity.modelName == iD.data.DataType.DIVIDER_NODE ||
            entity.modelName == iD.data.DataType.OBJECT_PG_NODE ||
            entity.modelName == iD.data.DataType.TRAFFICSIGN_NODE ||
            entity.modelName == iD.data.DataType.TRAFFICLIGHT_NODE)
        ) {
          iD.logger.editElement({
            tag: "dragstart_" + entity.modelName,
            modelName: entity.modelName,
            entityId: iD.Entity.id.toOSM(entity.id),
            parentId: iD.Entity.id.toOSM(parentEntity.id),
            filter: iD.logger.getFilter(parentEntity, context),
          });
        }
      }
      first = false;
    });
    player._zrender.on("mouseup", _mouseDragEnd);
    player._zrender.on("dragend.pic-player-drag", _mouseDragEnd);
    //      d3.select(player._zrender.dom).on('mouseout.pic-player-drag', _mouseDragEnd);

    function _mouseDragEnd(e) {
      var a = 1;
      if (!isDrag || !zrenderNodeStatus.downEntityid) return;
      execPluginTrigger("dragEventMoveend", e, zrenderNodeStatus.moveOffset);

      isDrag = false;

      var entity = context.hasEntity(zrenderNodeStatus.downEntityid);
      var parentEntity = context.graph().parentWays(entity)[0];
      if (
        entity &&
        (entity.modelName == iD.data.DataType.DIVIDER_NODE ||
          entity.modelName == iD.data.DataType.OBJECT_PG_NODE ||
          entity.modelName == iD.data.DataType.TRAFFICSIGN_NODE ||
          entity.modelName == iD.data.DataType.TRAFFICLIGHT_NODE)
      ) {
        iD.logger.editElement({
          tag: "dragend_" + entity.modelName,
          modelName: entity.modelName,
          entityId: iD.Entity.id.toOSM(entity.id),
          parentId: iD.Entity.id.toOSM(parentEntity.id),
          filter: iD.logger.getFilter(parentEntity, context),
        });
      }
      // zrender上的拖拽结束事件，会比在marker上绑定的ondragend先执行
      // 不能直接清空变量，否则共点、咬合操作时，无法操作；
      //          clearZRenderNodeStatus();
      player._zrender.off("mouseup", _mouseDragEnd);
      player._zrender.off("dragend.pic-player-drag", _mouseDragEnd);
    }
  }

  function _zrenderNodeEventMousemove(evt, mkr) {
    var unzPos = SELF.leftZoomOffset([evt.event.offsetX, evt.event.offsetY]);
    zrenderNodeStatus.moveOffset = unzPos;
  }

  /**
   * 拖拽一个单独的点，用于单独的点、灯杆灯头等
   * @param {Object} evt
   */
  function _zrenderPointEventDragend(evt) {
    player._zrender.off("mousemove");
    player._zrender.off("mouseup");

    var mkr = this;

    function dragLog() {
      // 拖拽操作增加埋点
      if (mkr._shape && mkr._shape._entityid) {
        let entity = context.entity(mkr._entityid);
        context.buriedStatistics().merge(0, entity.modelName);
        iD.UserBehavior.logger({
          filter: iD.logger.getFilter(entity, context),
          type: "drag",
          entityId: entity.osmId() || "",
          coordinate: entity.loc || [],
          action: "drag",
          tag: "drag_" + entity.modelName,
          modelName: entity.modelName,
        });
      }
    }

    if (mkr._entityid && iD.picUtil.checkNodeIsGroundArea(mkr._entityid)) {
      //          _zrenderResetDragMkr(player, mkr);
      //          clearZRenderNodeStatus();
      evt.event.stopPropagation();
      return;
    }
    iD.picUtil.shapePosition(mkr, [0, 0]);

    var unzPos = SELF.leftZoomOffset([evt.event.offsetX, evt.event.offsetY]);
    iD.picUtil.shapeXY(mkr, unzPos);
    player.canvasClickCheck = false;

    if (
      iD.picUtil.isPointEqual(
        zrenderNodeStatus.downOffset,
        unzPos,
        2 / viewZoomParam.scale
      )
    ) {
      _zrenderResetDragMkr(player, mkr);
      clearZRenderNodeStatus();
      return;
    }

    var nodeid = mkr._entityid;
    var entity = context.entity(nodeid);
    if (entity.modelName == modelNameParam.LAMPPOST && entity.tags.TYPE == 2) {
      var lonlats;
      var newPLANE = "";
      var mkrxy = iD.picUtil.shapeXY(mkr);
      // 灯头类型根据杆顶点计算坐标
      if (entity.tags.PLANE) {
        let xy = player.reductionPoint(mkrxy);
        lonlats = iD.picUtil.pixelToLngLatByPlane(xy, entity.tags.PLANE || "");
      } else {
        let result = iD.picUtil.getLampHolderLonlat(mkrxy);
        lonlats = result.loc;
        newPLANE = result.PLANE;
      }
      if (!lonlats || !lonlats.length) {
        _zrenderResetDragMkr(player, mkr);
        clearZRenderNodeStatus();
        evt.event.stopPropagation();
        return;
      }
      dragEndFun({
        geometry: {
          lng: lonlats[0],
          lat: lonlats[1],
          elevation: lonlats[2],
        },
        newTags: newPLANE ? { PLANE: newPLANE } : null,
      });
      SELF.event.change(mkr._entityid);
    } else if (_.include([modelNameParam.ROAD_ATTRIBUTE], entity.modelName)) {
    /*else if(_.include([modelNameParam.TRAFFICLIGHT], entity.modelName) && entity.tags.PLANE){
            var mkrxy = iD.picUtil.shapeXY(mkr);
            let xy =  player.reductionPoint(mkrxy);
            let lonlats = iD.picUtil.pixelToLngLatByPlane(xy, entity.tags.PLANE || '');
            if(!lonlats || !lonlats.length){
                _zrenderResetDragMkr(player, mkr);
                clearZRenderNodeStatus();
                evt.event.stopPropagation();
                return ;
            }
            dragEndFun({
                geometry: {
                    lng: lonlats[0],
                    lat: lonlats[1],
                    elevation: lonlats[2]
                }
            });
        }*/
      var mkrPos = iD.picUtil.shapeXY(mkr);
      var xy = player.reductionPoint(mkrPos);
      var geometry = {};
      // ROAD_ATTRIBUTE拖拽到DIVIDER_NODE上，咬合
      overShape = zrenderNodeStatus.dragoverShape;
      var overEntity;
      if (overShape && overShape._entityid) {
        overEntity = context.entity(overShape._entityid);
      }

      if (overEntity && overEntity.modelName == modelNameParam.DIVIDER_NODE) {
        var ovnum = overShape.style.r;
        var flag = false;
        var mkrxy = iD.picUtil.shapeXY(mkr);
        var overxy = iD.picUtil.shapeXY(overShape);
        if (ovnum != null) {
          flag =
            Math.abs(mkrxy[0] - overxy[0]) <= ovnum &&
            Math.abs(mkrxy[1] - overxy[1]) <= ovnum;
        }
        if (flag) {
          geometry.lng = overEntity.loc[0];
          geometry.lat = overEntity.loc[1];
          geometry.elevation = overEntity.loc[2];

          iD.picUtil.shapeXY(mkr, overxy);
          if (overShape.shape.r) {
            mkr.shape.r = overShape.shape.r;
          }
        }
      }
      if (_.isEmpty(geometry)) {
        geometry = iD.picUtil.pixelToLngLat(mkrPos);
      }
      geometry.xy = xy;
      dragEndFun({ geometry });
      SELF.event.change(mkr._entityid);
    } else {
      intersectionTool &&
        intersectionTool.leftClickCoord(
          unzPos,
          function (data, point, point2, isMultPoints) {
            if (isMultPoints) {
              data = data[0];
            }
            dragEndFun(data, point);
            SELF.event.change(mkr._entityid);
          }
        );
    }

    function dragEndFun(data) {
      let node = context.entity(nodeid);
      let geoCoord = [
        data.geometry.lng,
        data.geometry.lat,
        data.geometry.elevation,
      ];

      if (
        node.modelName == iD.data.DataType.LAMPPOST &&
        node.tags.TYPE == 1 &&
        !context.transactionEditor()
      ) {
        if (!iD.util.justNodeInPlyGonx(node, context)) {
          Dialog.alert("新增杆顶点不属于该任务范围内");
          // context.pop();
          player.resetPointToPicPlayer(nodeid);
          return;
        }
      }

      if (locationOutTaskEditable(geoCoord)) {
        return false;
      }

      var actions = [iD.actions.UpdateNode(context, node.move(geoCoord))];
      if (!_.isEmpty(data.newTags)) {
        actions.push(iD.actions.ChangeTags(node.id, data.newTags));
      }
      var mkrxy = iD.picUtil.shapeXY(mkr);
      let xy = player.reductionPoint(mkrxy);

      actions.push(
        iD.picUtil.measureinfoAction(node, {
          datas:
            (intersectionTool &&
              intersectionTool.getIntersectionData().canvasList) ||
            [],
          trackPointId: player.pic_point.tags.trackPointId,
          imgOffset: { x: xy[0], y: xy[1] },
        })
      );
      actions.push("拖拽点");
      context.perform.apply(context, actions);

      /*
             // 重新反投杆状物底点
             bottoms.length && player.resetPointToPicPlayer(_.pluck(bottoms.concat(node), 'id'));
             */

      // 拖拽更新坐标
      dragLog();
    }

    clearZRenderNodeStatus();
    evt.event.stopPropagation();
    if (iD.picUtil.shapeInSelected(mkr)) {
      SELF._zrenderEntityHover.call(mkr);
    }
    player.isPlayPic = true;
    return false;
  }
  /**
   * 拖拽面或线中的节点
   * @param {Object} evt
   */
  function _zrenderNodeEventDragend(evt) {
    player._zrender.off("mousemove");
    player._zrender.off("mouseup");
    // zrender mouseup时会直接触发dragend
    var mkr = this;

    function dragLog() {
      // 拖拽操作增加埋点-并增加modelName
      // 拖拽成功失败都增加埋点
      if (mkr._shape && mkr._shape._entityid) {
        let entity = context.entity(mkr._entityid);
        let way = context.entity(mkr._shape._entityid);
        context.buriedStatistics().merge(0, way.modelName);

        iD.UserBehavior.logger({
          filter: iD.logger.getFilter(way, context),
          type: "drag",
          entityId: entity.osmId() || "",
          coordinate: entity.loc || [],
          parentId: way.osmId() || "",
          action: "drag",
          tag: "drag_" + entity.modelName,
          modelName: entity.modelName,
        });
      }
    }

    /*
         if(zrenderNodeStatus.downEntityid){
         if(iD.picUtil.checkNodeIsGroundArea(zrenderNodeStatus.downEntityid)){
         _zrenderResetDragMkr(player, mkr);
         clearZRenderNodeStatus();
         evt.event.stopPropagation();
         return ;
         }
         }
         */
    if (mkr._entityid && iD.picUtil.checkNodeIsGroundArea(mkr._entityid)) {
      evt.event.stopPropagation();
      return;
    }
    player.canvasClickCheck = false;
    var shape = mkr._shape;
    if (!shape) {
      return false;
    }
    var index = _.indexOf(shape._nodeList, mkr);
    if (index == -1) {
      return;
    }
    var unzPos = SELF.leftZoomOffset([evt.event.offsetX, evt.event.offsetY]);
    iD.picUtil.shapePosition(mkr, [0, 0]);

    if (
      iD.picUtil.isPointEqual(
        zrenderNodeStatus.downOffset,
        unzPos,
        2 / viewZoomParam.scale
      )
    ) {
      _zrenderResetDragMkr(player, mkr);
      clearZRenderNodeStatus();
      dragLog();
      return;
    }

    iD.picUtil.shapeXY(mkr, unzPos);
    if (mkr.type == "circle") {
      var r = computeZrenderCircleRadius(unzPos);
      mkr.shape.r = r;
    }

    function dragEndFun(data, point) {
      player.canvasClickCheck = true;
      var geometry = data.geometry;
      // 20cm  相邻的两个节点, 车道线、辅助线、桥底线
      // 共点不符合要求
      var dragNode = context.hasEntity(mkr._entityid);
      if (
        shape.type == "polyline" &&
        dragNode &&
        _.include(
          [modelNameParam.DIVIDER_NODE, modelNameParam.OBJECT_PL_NODE],
          dragNode.modelName
        )
      ) {
        for (var way of context
          .graph()
          .parentWays(context.entity(mkr._entityid))) {
          var nodeIndex = way.nodes.indexOf(mkr._entityid);
          var prevNode = context.hasEntity(way.nodes[nodeIndex - 1]);
          var nextNode = context.hasEntity(way.nodes[nodeIndex + 1]);
          var nodeLocs = _.pluck(_.compact([prevNode, nextNode]), "loc");
          if (
            checkLineNodeDistanceLTE(nodeLocs, [geometry.lng, geometry.lat])
          ) {
            _zrenderResetDragMkr(player, mkr);
            clearZRenderNodeStatus();
            return false;
          }
        }
      }
      nodeDragEndUpdate(
        player,
        shape,
        index,
        {
          geoCoord: [geometry.lng, geometry.lat, geometry.elevation],
          canvasOffset: point.canvasOffset,
        },
        mkr._dividerindex
      );

      var graph = context.graph();
      var node = graph.hasEntity(mkr._entityid);
      if (!node) {
        return false;
      }

      // 有共用点的情况
      //let pways = graph.parentWays(node);
      //let shapeWay = mkr._shape._entity;

      // 根据entityid获取_zrender中的图形
      var markers = ZEUtil.getShapesByEid(node.id);
      markers = markers.filter(function (marker) {
        return marker.id !== mkr.id;
      });
      if (markers.length) {
        // 共点拖拽有时会有残留的高亮层
        player._zrender.clearHover();
        // console.log('zrender 拖拽共用点 ... ', markers, node);
      }
      markers.forEach(function (marker) {
        var shapeWay = marker._shape;
        if (!shapeWay) {
          return;
        }
        var way = context.hasEntity(shapeWay._entityid);
        if (!way) {
          return;
        }
        var dividerIndex = _.indexOf(way.nodes, marker._entityid);
        if (dividerIndex == -1) {
          return;
        }
        // 更新公用点的位置
        iD.picUtil.shapeXY(marker, point.canvasOffset);
        var r = computeZrenderCircleRadius(point.canvasOffset);
        marker.shape.r = r;
        iD.picUtil.shapePosition(marker, [0, 0]);

        var shapeIndex = _.indexOf(shapeWay._nodeList, marker);
        // 只更新shape
        nodeDragEndUpdate2Shape(shapeWay, shapeIndex, dividerIndex);
      });
      return true;
    }
    if (mkr._shape && mkr._shape._entityid) {
      var entity = context.entity(mkr._shape._entityid);
      if (
        _.include(
          [
            modelNameParam.DIVIDER,
            modelNameParam.TRAFFICSIGN,
            modelNameParam.OBJECT_PL,
            modelNameParam.OBJECT_PG,
            modelNameParam.PAVEMENT_DISTRESS,
            modelNameParam.BRIDGE,
            modelNameParam.TRAFFICLIGHT,
            modelNameParam.BARRIER_GEOMETRY,
            modelNameParam.ROAD_FACILITIES,
            modelNameParam.HD_LANE,
          ],
          entity.modelName
        )
      ) {
        var geometry = {};
        // 路牌、桥底线
        if (
          _.include(
            [
              modelNameParam.TRAFFICSIGN,
              modelNameParam.BRIDGE,
              modelNameParam.TRAFFICLIGHT,
            ],
            entity.modelName
          ) &&
          entity.tags.PLANE
        ) {
          var mkrxy = iD.picUtil.shapeXY(mkr);
          let xy = player.reductionPoint(mkrxy);
          var lonlats = iD.picUtil.pixelToLngLatByPlane(
            xy,
            entity.tags.PLANE || ""
          );
          geometry.lng = lonlats[0];
          geometry.lat = lonlats[1];
          geometry.elevation = lonlats[2];
        } else {
          var mkrxy = iD.picUtil.shapeXY(mkr);
          geometry = iD.picUtil.pixelToLngLat(mkrxy);
        }

        // 线要素首尾节点拖拽到其他要素节点上，要素类型不一致时咬合
        // 咬合：坐标与另一个点一致
        var overShape;
        if (
          zrenderNodeStatus.dragoverShape &&
          zrenderNodeStatus.dragoverShape._entityid &&
          _.include(
            [
              modelNameParam.OBJECT_PL,
              modelNameParam.DIVIDER,
              modelNameParam.HD_LANE,
            ],
            entity.modelName
          ) &&
          _.include([entity.first(), entity.last()], mkr._entityid)
        ) {
          overShape = zrenderNodeStatus.dragoverShape;
          var overEntity = context.entity(overShape._entityid);
          // 可以吸附相同类型
          var toSelfModels = [
            modelNameParam.OBJECT_PL_NODE,
            modelNameParam.HD_LANE_NODE,
          ];
          var samePixel =
            (toSelfModels.includes(overEntity.modelName) &&
              toSelfModels.includes(context.entity(mkr._entityid).modelName)) ||
            overEntity.modelName != context.entity(mkr._entityid).modelName;

          if (overEntity && overEntity.id != mkr._entityid && samePixel) {
            var ovnum = overShape.shape.r;
            var ovw = overShape.shape.width || 0,
              ovh = overShape.shape.height || 0;
            var flag = false;
            var mkrxy = iD.picUtil.shapeXY(mkr);
            var overxy = iD.picUtil.shapeXY(overShape);
            if (ovnum != null) {
              flag =
                Math.abs(mkrxy[0] - overxy[0]) <= ovnum &&
                Math.abs(mkrxy[1] - overxy[1]) <= ovnum;
            } else if (ovw != null && ovh != null) {
              flag =
                Math.abs(mkrxy[0] - overxy[0]) <= ovw &&
                Math.abs(mkrxy[1] - overxy[1]) <= ovh;
            }
            if (flag) {
              geometry.lng = overEntity.loc[0];
              geometry.lat = overEntity.loc[1];
              geometry.elevation = overEntity.loc[2];

              iD.picUtil.shapeXY(mkr, overxy);
              if (overShape.shape.r) {
                mkr.shape.r = overShape.shape.r;
              }
            }
          }
        }
        var mkrxy = iD.picUtil.shapeXY(mkr);
        // 更新位置
        var dragResult = dragEndFun({ geometry }, { canvasOffset: mkrxy });
        // 如果是车道线，首位节点咬合时要进行 共点关联
        // 关联后重新反投
        var isConnect = false;
        // 20190129 车道线禁止建立共点；
        /*
                _zrenderNodeConnect(mkr._entityid, overShape && overShape._entityid, {
                    xy: [mkrxy[0], mkrxy[1]]
                });
                */
        var dragingEntityid = mkr._entityid;
        if (isConnect) {
          dragingEntityid = overShape._entityid;
        }
        var dataType = iD.data.DataType;

        if (
          [dataType.TRAFFICSIGN, dataType.TRAFFICLIGHT].includes(
            entity.modelName
          ) &&
          !context.transactionEditor()
        ) {
          var locs = _.pluck(context.graph().childNodes(entity), "loc");
          var loc = iD.util.getCenterPoint(locs);
          if (iD.util.pointNotInPlyGonx(loc, context)) {
            Dialog.alert("不属于该任务范围内");
            context.pop();
            if (entity.modelName == dataType.TRAFFICSIGN) {
              context.pop();
            }
          }
        }
        if (
          [dataType.OBJECT_PG, dataType.OBJECT_PL].includes(entity.modelName) &&
          !context.transactionEditor()
        ) {
          var node = context.entity(entity.first());

          if (!iD.util.justNodeInPlyGonx(node, context)) {
            Dialog.alert("您移动的元素不属于该任务范围内");
            context.pop();
            dragLog();
            return;
          }
        }

        if (
          entity.modelName == iD.data.DataType.DIVIDER &&
          !context.transactionEditor()
        ) {
          var node = context.entity(dragingEntityid);

          if (
            !iD.util.justNodeInPlyGonx(node, context) &&
            ![3, 2, 0].includes(+node.tags.DASHTYPE)
          ) {
            Dialog.alert("您移动的link，移动到了不属于该任务范围内");
            context.pop();
            dragLog();
            return;
          }
        }
        if (
          entity.modelName == iD.data.DataType.HD_LANE &&
          !context.transactionEditor()
        ) {
          var node = context.entity(dragingEntityid);
          if (!iD.util.justNodeInPlyGonx(node, context)) {
            Dialog.alert("您移动的元素不属于该任务范围内");
            context.pop();
            dragLog();
            return;
          }
        }
        execPluginTrigger(
          "nodeDragEnd",
          mkr,
          dragResult,
          { geometry },
          { canvasOffset: mkrxy }
        );
        dragLog();
        SELF.event.change(mkr._entityid);
      } else {
        var mkrxy = iD.picUtil.shapeXY(mkr);
        // 通过前方交会计算新坐标
        intersectionTool &&
          intersectionTool.leftClickCoord(
            mkrxy,
            function (data, point, point2) {
              var dragResult = dragEndFun(data, point);
              execPluginTrigger("nodeDragEnd", mkr, dragResult, data, point);
              dragLog();
              SELF.event.change(mkr._entityid);
            }
          );
      }
    }

    clearZRenderNodeStatus();
    evt.event.stopPropagation();
    if (iD.picUtil.shapeInSelected(mkr)) {
      SELF._zrenderEntityHover.call(mkr);
    }
    player.isPlayPic = true;
    return false;
  }
  // Non-transaction
  //--------------------绘制操作-------------------------
  function _drawActionsPerform(allActions, isReplace = false) {
    historyPicOperate = true;
    if (allActions.length == 1) {
      if (!isReplace) {
        context.perform.apply(this, allActions[0]);
      } else {
        context.replace.apply(this, allActions[0]);
      }
    } else if (allActions.length > 1) {
      var oneActions = [];
      var lastStr = "";
      for (var i in allActions) {
        var actions = allActions[i];
        if (typeof actions[actions.length - 1] === "string") {
          lastStr = actions[actions.length - 1];
          actions = actions.slice(0, actions.length - 1);
        }
        if (actions.length) {
          oneActions.push(...actions);
        }
      }
      oneActions.length && oneActions.push(lastStr);

      if (!isReplace) {
        context.perform.apply(this, oneActions);
      } else {
        context.replace.apply(this, oneActions);
      }
    }
    historyPicOperate = false;
  }
  //-------------------------------------------------------

  /**
   * 重置marker拖拽位置
   * @param {Object} self
   * @param {Object} mkr
   */
  function _zrenderResetDragMkr(self, mkr) {
    if (!mkr) {
      return false;
    }
    if (mkr._protoLoc) {
      iD.picUtil.shapeXY(mkr, mkr._protoLoc);
      var r = computeZrenderCircleRadius(mkr._protoLoc);
      if (mkr.type == "rect") {
        r = 0;
      }
      mkr.shape.r = r;
      iD.picUtil.modShape(mkr);
    }
  }

  function _zrenderNodeConnect(moveid, nodeid, opts = {}) {
    if (!moveid || !nodeid || moveid == nodeid) {
      return;
    }
    var graph = context.graph();
    var mnode = graph.entity(moveid);
    var tnode = graph.entity(nodeid);
    var modelConfig = iD.Layers.getLayer(tnode.layerId, tnode.modelName);
    if (!modelConfig && !modelConfig.editable) {
      return;
    }

    if (mnode.modelName !== tnode.modelName) {
      // 相同要素进行共点关联
      return;
    }
    if (
      !iD.util.nodeIsBreakPoint(mnode, graph) ||
      !iD.util.nodeIsBreakPoint(tnode, graph)
    ) {
      return;
    }
    // 有相同的DIVIDER，不允许 共点
    var didMap = {},
      didRepeat;
    graph.parentWays(mnode).forEach((way) => {
      if (didMap[way.id]) {
        didRepeat = true;
      }
      didMap[way.id] = true;
    });
    graph.parentWays(tnode).forEach((way) => {
      if (didMap[way.id]) {
        didRepeat = true;
      }
      didMap[way.id] = true;
    });
    if (didRepeat) {
      return;
    }

    var connectNodes = [];
    if (mnode.modelName == modelNameParam.DIVIDER_NODE) {
      var mrels = graph.parentRelations(
        mnode,
        iD.data.DataType.DIVIDER_ATTRIBUTE
      );
      var trels = graph.parentRelations(
        tnode,
        iD.data.DataType.DIVIDER_ATTRIBUTE
      );
      // 两个DA不允许 共点
      if (mrels.length && trels.length) {
        return;
      }

      if (mrels.length) {
        connectNodes = [nodeid, moveid];
      } else if (trels.length) {
        connectNodes = [moveid, nodeid];
      } else {
        connectNodes = [moveid, nodeid];
      }
    } else {
      return false;
    }
    /*
        else if(mnode.modelName == modelNameParam.OBJECT_PL_NODE){
            // OBJECT_PL
            connectNodes = [moveid, nodeid];
        }
        */

    var moveXY = opts.xy;
    moveXY = player.reductionPoint(opts.xy);

    var args = [
      iD.picUtil.measureinfoAction(mnode, {
        type: -1,
      }),
      iD.picUtil.measureinfoAction(tnode, {
        type: -1,
      }),
      // 最后一个点是保持不变的点
      iD.actions.ConnectDivider(context, connectNodes),
      iD.picUtil.measureinfoAction(graph.entity(_.last(connectNodes)), {
        trackPointId: player.pic_point.tags.trackPointId,
        imgOffset: { x: moveXY[0], y: moveXY[1] },
      }),
      t("operations.connect.annotation." + tnode.geometry(context.graph())),
    ];
    context.enter(iD.modes.Select(context, [_.last(connectNodes)]));
    context.replace.apply(this, args);
    //      console.log('共点关联：', connectNodes.join(' <-> '));
    // 重新反投
    SELF.resetCanvas();
    return true;
  }

  function nodeDragEndUpdate2Shape(shape, nodeIndex, dividerNodeIndex) {
    if (_.include(["polyline", "polygon"], shape.type) && shape._entityid) {
      if (!context.hasEntity(shape._entityid)) return;
      var shapeNode = shape._nodeList[nodeIndex];
      let pointList = _.clone(shape.shape.points);
      let indexFP = [0, pointList.length - 1];
      var mkrxy = iD.picUtil.shapeXY(shapeNode);

      if (
        shape.type == "polygon" &&
        _.isEqual(pointList[indexFP[0]], pointList[indexFP[1]]) &&
        (nodeIndex == indexFP[0] || nodeIndex == indexFP[1])
      ) {
        // polygon时首尾节点一致
        pointList[indexFP[0]] = pointList[indexFP[1]] = mkrxy;
      } else {
        pointList[nodeIndex] = mkrxy;
      }
      var nodeid = shapeNode._entityid;
      if (shape._pointMappingNode) {
        var mnid = shape._pointMappingNode[dividerNodeIndex.toString()];
        if (mnid) {
          nodeid = mnid;
        }
      }
      if (!nodeid) return false;
      shape.setShape("points", pointList);
    }
    return true;
  }

  /**
   *
   * @param {Object} shape 拖拽的节点所属的polyline
   * @param {Number} nodeIndex 当前zrender节点在polyline上nodeList的索引
   * @param {Object} data
   * @param {Number} dividerNodeIndex 当前节点在地图中divider上的nodes索引
   * @param {Boolean} hisReplace 是否使用replace
   */
  function nodeDragEndUpdate(
    player,
    shape,
    nodeIndex,
    data,
    dividerNodeIndex,
    hisReplace = false
  ) {
    var actions = [];
    // , 'polygon'
    if (_.include(["polyline", "polygon"], shape.type) && shape._entityid) {
      if (!context.hasEntity(shape._entityid)) return;
      var shapeNode = shape._nodeList[nodeIndex];
      var nodeid = shapeNode._entityid;
      if (shape._pointMappingNode) {
        var mnid = shape._pointMappingNode[dividerNodeIndex.toString()];
        if (mnid) {
          nodeid = mnid;
        }
      }
      if (!nodeid) return;
      var way = context.entity(shape._entityid);
      var node = context.entity(nodeid);

      // 判断坐标是否在范围内
      if (locationOutTaskEditable(data.geoCoord)) {
        return false;
      }

      actions.push(iD.actions.Noop());
      actions.push(iD.actions.UpdateNode(context, node.move(data.geoCoord)));
      var xy = player.reductionPoint(data.canvasOffset);
      if (
        way.modelName == modelNameParam.TRAFFICSIGN ||
        way.modelName == modelNameParam.BRIDGE
      ) {
        actions.push(
          iD.picUtil.measureinfoAction(node, {
            trackPointId:
              player.allNodes[player.selectPicIndex].tags.trackPointId,
            imgOffset: { x: xy[0], y: xy[1] },
            wayid: shape._entityid,
          })
        );
      } else {
        actions.push(
          iD.picUtil.measureinfoAction(node, {
            trackPointId:
              player.allNodes[player.selectPicIndex].tags.trackPointId,
            imgOffset: { x: xy[0], y: xy[1] },
          })
        );
      }
      if (
        way.modelName == modelNameParam.DIVIDER &&
        way.last() == node.id &&
        !context.transactionEditor()
      ) {
        // 虚拟终点、虚拟中间点，允许拖出范围，最后一点拖拽后超出范围需要设置为边界点
        if (
          iD.util.pointNotInPlyGonx(data.geoCoord, context) &&
          [3, 2].includes(+node.tags.DASHTYPE)
        ) {
          actions.push(
            iD.actions.ChangeTags(node.id, {
              ISSPLIT: "1",
            })
          );
        }
      }
      if (way.modelName == modelNameParam.BARRIER_GEOMETRY) {
        context.variable.dragBarrierNode.nodeId = node.id;
        context.variable.dragBarrierNode.oldLoc = node.loc;
        context.variable.dragBarrierNode.newLoc = data.geoCoord;
      }
      actions.push("拖拽节点");

      nodeDragEndUpdate2Shape(shape, nodeIndex, dividerNodeIndex);
    }

    actions.length &&
      context[hisReplace ? "replace" : "perform"].apply(this, actions);
    if (node.modelName == iD.data.DataType.DIVIDER_NODE) {
      iD.util.checkErrors(
        context.graph(),
        player.wayInfo.K,
        player.pic_point,
        context.entity(node.id)
      );
    }
  }

  SELF = new DrawTool();
  return SELF;
};
