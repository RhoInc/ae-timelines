export default function severityColor(chart) {
    var colors = chart.config.colors;
    chart.svg.selectAll('.wc-data-mark').attr('stroke', function(d) {
        var ae = d.values;
        var severity = ae.raw ? ae.raw[0].AESEV : ae[0].values.raw[0].AESEV;

             if (severity === 'Grade 1') { return colors[0]; }
        else if (severity === 'Grade 2') { return colors[1]; }
        else if (severity === 'Grade 3') { return colors[2]; }
    });
}
