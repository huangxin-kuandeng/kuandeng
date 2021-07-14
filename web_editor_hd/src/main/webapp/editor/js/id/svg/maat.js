/**
 * 渲染M_AAT
 * @param {Object} projection
 */
iD.svg.Maat = function(projection) {
    return function(surface, graph, turns) {
        function key(turn) {
            return [turn.from.node + turn.via.node + turn.to.node].join('-');
        }

        function icon(turn) {
            var name="greenArrow.png";
            if(!turn.restriction){
                name="yellowArrow.png";
            }else if(turn.u){
                name = 'greenturn.png';
            }

            return editor.context.imagePath(name);
            // var u = turn.u ? '-u' : '';
            // if (!turn.restriction)
            //     return '#icon-restriction-yes' + u;
            // var restriction = graph.entity(turn.restriction).tags.restriction;
            // return '#icon-restriction-' +
            //     (!turn.indirect_restriction && /^only_/.test(restriction) ? 'only' : 'no') + u;
        }

        var groups = surface.select('.layer-hit').selectAll('g.turn')
            .data(turns, key);

        // Enter
        var enter = groups.enter().append('g')
            .attr('class', 'turn');

        var nEnter = enter.filter(function (turn) { return !turn.u; });

        nEnter.append('rect')
            .attr('transform', 'translate(-12, -12)')
            .attr('width', '35')
            .attr('height', '25');

        nEnter.append('image').attr('class', 'maat-arrow');
//      nEnter.append('image').attr('class', 'maat-timeclock');
            // .attr('transform', 'translate(-12, -12)')
            // .attr('clip-path', 'url(#clip-square-45)');

        var uEnter = enter.filter(function (turn) { return turn.u; });

        uEnter.append('circle')
            .attr('r', '16');
        uEnter.append('image');
        // uEnter.append('use')
        //     .attr('transform', 'translate(-16, -16)')
        //     .attr('clip-path', 'url(#clip-square-32)');

        // Update

        groups
            .attr('transform', function (turn) {
                var v = graph.entity(turn.via.node),
                    t = graph.entity(turn.to.node),
                    a = iD.geo.angle(v, t, projection),
                    p = projection(v.loc),
                    r = turn.u ? 0 : 60;

                return 'translate(' + (r * Math.cos(a) + p[0]) + ',' + (r * Math.sin(a) + p[1]) + ')' +
                    'rotate(' + a * 180 / Math.PI + ')';
            });

        groups.select('image.maat-arrow')
            .attr('xlink:href',icon)
            .attr({
                x: -12,
                y: -13,
                width: 35,
                height: 25
            });
        // groups.select('use')
        //     .attr('xlink:href', icon);
        /*
        groups.select('image.maat-timeclock')
            .attr('xlink:href', editor.context.imagePath("time_clock_64.png"))
            .attr({
                x: -40,
                y: -13,
                width: 30,
                height: 25
            });
		*/
        //groups.select('rect');
        //groups.select('circle');

        // Exit

        groups.exit()
            .remove();

        return this;
    };
};
