/**
 * Created by wt on 2015/8/13.
 */
iD.behavior.drawIsland = function (context) {
    var startNodeLoc, endNodeLoc;
    var keybinding = d3.keybinding('drawIsland');
    var action = iD.actions.createIsland(context);
    var annotation = t('modes.add_island.description');
    var highLightIds,circle;
    var behavior = function (selection) {
        var mouse = null,
            mode = 'circle',
            style = {"fill": "red", 'opacity': '0.5', "stroke": 'rgb(255, 99, 25)', "stroke-width": 3};

        function mousemove() {
            selection
                .on("click.circle", null)
            if (!circle) {
                var loc = context.map().mouseCoordinates();

                circle = new Circle({
                    loc: loc, radius: loc,
                    mode: 'circle',
                    onDraw: function (element) {
                        element.style(style);
                    }
                });
                context.map().addOverlays(circle);

                context.event.drawstart({overlay: circle, mode: mode});

            }
            if (circle) circle.radius = context.map().mouseCoordinates();
            context.event.drawoverlayers();
            context.event.drawing({overlay: circle, mode: mode});

        }

        function cancel() {
            d3.event.preventDefault();
            selection
                .on('mousemove.circle', null);
            if (circle) {
                context.map().removeOverlays(circle);
            }
            context.enter(iD.modes.Browse(context));
        }

        function dblclick() {
            selection
                .on('mousemove.circle', null)
                .on('mouseup.circle', null)
                .on('click.circle', null)
            context.map().dblclickEnable(false);
            endNodeLoc = context.map().mouseCoordinates();
            //判断是否超出边界
            var isOutTansactionExtent = false;
            var nodes = action.getNodesLoc(startNodeLoc, endNodeLoc);
            for (var i = 0; i < nodes.length; i++) {
                if(iD.util.pointNotInPlyGonx(nodes[i],context)){
                    isOutTansactionExtent = true;
                    break;
                }
            }
            if (isOutTansactionExtent == true) {
                Dialog.alert("已出对象边界", callback);
            //    context.container().call(iD.ui.MeshBoundryTip(context, callback));
            }
            else if (isOutTansactionExtent == false) {
                context.map().removeOverlays(circle);
                action.setStartNodeLoc(startNodeLoc);
                action.setEndNodeLoc(endNodeLoc);
                context.perform(
                    action,
                    annotation
                )
                highLightIds = action.getHighlightIds();
                context.enter(
                    iD.modes.Select(context, [highLightIds[0]])
                        .suppressMenu(true)
                        .newFeature(true));
                if (typeof highLightIds != 'undefined' && highLightIds != '') {
                    context.map().on('drawn.select', selectElements);
                    selectElements();
                }
            }
        }

        var callback = function () {
            context.map().removeOverlays(circle);
            context.enter(iD.modes.Browse(context));
            context.enter(iD.modes.AddIsland(context));
        };

        function selectElements() {
            context.surface()
                .selectAll(iD.util.entityOrMemberSelector(highLightIds, context.graph()))
                .classed('selected', true);
        }

        function start() {
            //取消其他高亮
            var sf = context.surface();
            sf.on('dblclick.select', null)
                .selectAll('.selected')
                .classed('selected', false);
            context.map().on('drawn.select', null);

            circle = null;
            mouse = context.mouse();
            startNodeLoc = context.map().mouseCoordinates();
            selection
                .on('dblclick.circle', dblclick)
                .on('mousemove.circle', mousemove)
            d3.event.stopPropagation();
            d3.event.preventDefault();
        }

        selection
            .on('click.circle', start);
        keybinding.on('⎋', cancel);
        d3.select(document)
            .call(keybinding);

    };

    behavior.off = function (selection) {
        if (circle) {
            context.map().removeOverlays(circle);
        }
        selection
            .on('mousemove.circle', null)
            .on('click.circle', null)
            .on('dblclick.circle', null)
    };

    return behavior;
};
