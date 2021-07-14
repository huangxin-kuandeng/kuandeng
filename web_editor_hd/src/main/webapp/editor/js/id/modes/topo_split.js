/**
 * Created by  on 2015/8/11.
 */
iD.modes.TopoSplit = function (context,selectedIDs) {
    var mode = {
        id: 'topo-split',
        button: 'topo_split'
    }, sidebar;
    //var firstInTopo = false;
    var keybinding = d3.keybinding('drawIsland');
    var  fromToNodes = [];
    var  selectedWays;
    selectedWays = context.selectedIDs()[0];
    var selectedWaysEntity = context.graph().entity(selectedWays),
        fromNodeId = selectedWaysEntity.nodes[0],
        toNodeId = selectedWaysEntity.nodes[selectedWaysEntity.nodes.length-1];
    fromToNodes = [fromNodeId,toNodeId];

    function selectElements(flag) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(fromToNodes, context.graph()))
            .classed('selected', flag);
    }
    context.map().on('drawn.select', selectElements);

    function cancel(){
        d3.event.preventDefault();
        context.enter(iD.modes.Browse(context));
    }

    function origin(entity) {
        console.error(entity);
        return context.projection(entity.loc);
    }
    var behavior = iD.modes.DragNode(context,selectedWays).behavior;

    mode.enter = function () {
        context.variable.firstInTopo = true;
        selectElements(true);
        keybinding.on('⎋', cancel);
        d3.select(document)
            .call(keybinding);
        context.install(behavior);
        /*
        behaviors.forEach(function (behavior) {
            context.install(behavior);
        });*/

    };
    //var singleNode = [fromNodeId];
    function selectSingleNodeElements(singleNode) {
        context.surface()
            .selectAll(iD.util.entityOrMemberSelector(singleNode, context.graph()))
            .classed('selected', true);
    }

    mode.exit = function () {
        selectElements(false);
        if(context.variable.singleNodeByTopoSplit ==true&&context.variable.singleNode!=null){
            var singleNode = [context.variable.singleNode];
            Dialog.alert(iD.alert.tip.operation_create_fake_node_in_crossnode,function(){
                selectSingleNodeElements(singleNode);
            });
            context.variable.singleNodeByTopoSplit = false;
            context.variable.singleNode = null;
            //context.pop();
        }
        context.variable.firstInTopo = null;
        context.uninstall(behavior);
        /*
        behaviors.forEach(function (behavior) {
            context.uninstall(behavior);
        });*/
    };

    mode.sidebar = function (_) {
        if (!arguments.length) return sidebar;
        sidebar = _;
        return mode;
    };

    mode.selectedIDs = function() {
        return selectedIDs;
    };

    return mode;
};
