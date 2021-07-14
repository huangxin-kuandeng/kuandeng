iD.behavior.LaneInfoPathEdit = function (context,selectedIDs,maat) {
    var fromMember = maat.memberByRole(iD.data.RoleType.FROAD_ID);
    var toMember = maat.memberByRole(iD.data.RoleType.TROAD_ID);
    function keydown() {
        if (d3.event && d3.event.shiftKey) {
            context.surface()
                .classed('behavior-multiselect', true);
        }
    }

    function keyup() {
        if (!d3.event || !d3.event.shiftKey) {
            context.surface()
                .classed('behavior-multiselect', false);
        }
    }

    function click() {
        var datum = d3.event.target.__data__;
        //var sIDs = context.selectedIDs()
        if (datum && datum.tags) {
            if (datum.modelName == iD.data.DataType.ROAD&&datum.type=='way') {
                var index=selectedIDs.indexOf(datum.id);
                if(-1==index)
                {
                   selectedIDs.push(datum.id);
                }else{
                    if(fromMember.id==datum.id||toMember.id==datum.id)
                    {
                        Dialog.alert( "行车引导线路径必须包含行车引导线")
                    }else{
                        selectedIDs.splice(index,1);
                    }
                }
                context.surface().selectAll('.selected')
                    .classed('selected', false);
                context.surface()
                    .selectAll(iD.util.entityOrMemberSelector(selectedIDs, context.graph()))
                    .classed('selected', true);
                /*context.replace(iD.actions.Noop(),context.history().redoAnnotation());*/
            }
        }
    }
    var behavior = function (selection) {
        var lastMousePos,
            lastMouseTarget,
            clickTimeId;
        d3.select(window)
            .on('keydown.LaneInfoModify', keydown)
            .on('keyup.LaneInfoModify', keyup);
        //the drag behover sometimes block the "click" events, no idea why, so hack to trigger click
        selection.on('mousedown.LaneInfoModify', function () {

            lastMousePos = [d3.event.clientX, d3.event.clientY];

            lastMouseTarget = d3.event.target;
        })
            .on('mouseup.LaneInfoModify', function () {

                var upPos = [d3.event.clientX, d3.event.clientY]

                if (d3.event.target === lastMouseTarget &&
                    iD.geo.euclideanDistance(lastMousePos, upPos) < 5) {

                    var targetEvent = d3.event;

                    if (clickTimeId) {
                        clearTimeout(clickTimeId);
                    }

                    clickTimeId = setTimeout(function () {

                        //console.warn('Downup click triggered');

                        clickTimeId = null;

                        var oldEvent = d3.event;

                        d3.event = targetEvent;

                        click();

                        d3.event = oldEvent;

                        targetEvent = null;

                    }, 250);
                }

                lastMousePos = null;
                lastMouseTarget = null;

            })
            .on('click.LaneInfoModify', function () {

                if (clickTimeId) {
                    clearTimeout(clickTimeId);
                    clickTimeId = null;
                }

                click();
            });
        keydown();
    };

    behavior.off = function (selection) {
 
        d3.select(window)
            .on('keydown.LaneInfoModify', null)
            .on('keyup.LaneInfoModify', null);

        selection.on('click.LaneInfoModify', null);
        selection.on('mouseup.LaneInfoModify', null);
        selection.on('mousedown.LaneInfoModify', null);
        keyup();
    };

    return behavior;
};
