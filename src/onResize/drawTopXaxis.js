import { svg } from 'd3';

export default function drawTopXaxis() {
    let x2Axis = svg
        .axis()
        .scale(this.x)
        .orient('top')
        .tickFormat(this.xAxis.tickFormat())
        .innerTickSize(this.xAxis.innerTickSize())
        .outerTickSize(this.xAxis.outerTickSize())
        .ticks(this.xAxis.ticks()[0]);
    let g_x2_axis = this.svg.select('g.x2.axis').attr('class', 'x2 axis linear');
    g_x2_axis.call(x2Axis);
    g_x2_axis
        .select('text.axis-title.top')
        .attr('transform', 'translate(' + this.raw_width / 2 + ',-' + this.config.margin.top + ')');
    g_x2_axis.select('.domain').attr({
        fill: 'none',
        stroke: '#ccc',
        'shape-rendering': 'crispEdges'
    });
    g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');
}
