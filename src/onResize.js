import { select, svg } from 'd3';

export default function onResize(){
    this.chart2.x_dom = this.x_dom;
    this.svg.select('.y.axis').selectAll('.tick')
    .style('cursor', 'pointer')
    .on('click', d => {
        var csv2 = this.raw_data.filter(f => f[this.config.id_col] === d);
        this.chart2.wrap.style('display', 'block');
        this.chart2.draw(csv2);
        this.chart2.wrap.insert('h4', 'svg').attr('class', 'id-title').text(d);

        var tableData = this.superRaw.filter(f => f[this.config.id_col] === d);
        this.table.draw(tableData)
        this.wrap.style('display', 'none');
        this.controls.wrap.style('display', 'none');
    });

    var x2Axis = svg.axis()
        .scale(this.x)
        .orient('top')
        .tickFormat(this.xAxis.tickFormat())
        .innerTickSize(this.xAxis.innerTickSize())
        .outerTickSize(this.xAxis.outerTickSize())
        .ticks(this.xAxis.ticks()[0]);

    var g_x2_axis = this.svg.select("g.x2.axis").attr("class", "x2 axis time")
       // .attr("transform", "translate(0,-10)");

    g_x2_axis.transition().call(x2Axis);

    g_x2_axis.select("text.axis-title.top").transition().attr("transform","translate("+(this.raw_width/2)+",-"+this.config.margin.top+")");
        
    g_x2_axis.select('.domain').attr({
        'fill': 'none',
        'stroke': '#ccc',
        'shape-rendering': 'crispEdges'
    });
    g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');
}