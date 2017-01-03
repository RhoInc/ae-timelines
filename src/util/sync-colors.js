/*------------------------------------------------------------------------------------------------\
  Sync colors of legend marks and chart marks.
\------------------------------------------------------------------------------------------------*/

export default function syncColors(chart) {
  //Recolor legend.
    let legendItems = chart.wrap.selectAll('.legend-item');
    legendItems
        .each(function(d,i) {
            d3.select(this).select('.legend-mark')
                .style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(d.label)])
                .style('stroke-width', '25%');
        });

  //Recolor circles.
    let circles = chart.svg.selectAll('circle.wc-data-mark:not(.serious)');
    circles
        .each(function(d,i) {
            const sev_val = d.values.raw[0][chart.config.initialSettings.sev_col];
            d3.select(this)
                .style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
            d3.select(this)
                .style('fill', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
        });

  //Recolor lines.
    let lines = chart.svg.selectAll('path.wc-data-mark:not(.serious)');
    lines
        .each(function(d,i) {
            const sev_val = d.values[0].values.raw[0][chart.config.initialSettings.sev_col];
            d3.select(this)
                .style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
        });
}
