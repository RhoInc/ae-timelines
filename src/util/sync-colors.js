/*------------------------------------------------------------------------------------------------\
  Sync colors of legend marks and chart marks.
\------------------------------------------------------------------------------------------------*/

export default function syncColors(chart) {
  //Recolor legend.
    let legendItems = chart.wrap.selectAll('.legend-item:not(.highlight)');
    legendItems.each(function(d,i) {
        d3.select(this).select('.legend-mark')
            .style('stroke', chart.config.colors[chart.config.legend.order.indexOf(d.label)])
            .style('stroke-width', '25%');
    });

  //Recolor circles.
    let circles = chart.svg.selectAll('circle.wc-data-mark:not(.highlight), circle.wc-data-mark:not(.custom)');
    circles.each(function(d,i) {
        const color_by_value = d.values.raw[0][chart.config.color_by];
        d3.select(this)
            .style('stroke', chart.config.colors[chart.config.legend.order.indexOf(color_by_value)]);
        d3.select(this)
            .style('fill', chart.config.colors[chart.config.legend.order.indexOf(color_by_value)]);
    });

  //Recolor lines.
    let lines = chart.svg.selectAll('path.wc-data-mark:not(.highlight), path.wc-data-mark:not(.custom)');
    lines.each(function(d,i) {
        const color_by_value = d.values[0].values.raw[0][chart.config.color_by];
        d3.select(this)
            .style('stroke', chart.config.colors[chart.config.legend.order.indexOf(color_by_value)]);
    });
}
