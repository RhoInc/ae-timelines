/*------------------------------------------------------------------------------------------------\
  Add serious adverse event legend item.
\------------------------------------------------------------------------------------------------*/

export default function addSeriousLegendItem(chart) {
    chart.wrap.select('.legend li.serious').remove();
    let seriousLegendItem = chart.wrap.select('.legend').append('li')
        .attr('class', 'serious')
        .style(
            {'list-style-type': 'none'
            ,'margin-right': '1em'
            ,'display': 'inline-block'});
    let seriousLegendColorBlock = seriousLegendItem.append('svg')
        .attr(
            {width: '1.75em'
            ,height: '1.5em'})
        .style(
            {'position': 'relative'
            ,'top': '0.35em'});
    seriousLegendColorBlock.append('circle')
        .attr(
            {cx: 10
            ,cy: 10
            ,r: 4})
        .style(
            {'stroke': 'black'
            ,'stroke-width': 2
            ,'fill': 'none'});
    seriousLegendColorBlock.append('line')
        .attr(
            {x1: 2*3.14*4 - 10
            ,y1: 10
            ,x2: 2*3.14*4 - 5
            ,y2: 10})
        .style(
            {'stroke': 'black'
            ,'stroke-width': 2
            ,'shape-rendering': 'crispEdges'});
    seriousLegendItem.append('text')
        .style('margin-left', '.35em')
        .text('Serious');
}
