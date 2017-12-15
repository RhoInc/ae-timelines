export default function onLayout() {
    //Add div for participant counts.
    this.wrap
        .select('.legend')
        .append('span')
        .classed('annote', true)
        .style('float', 'right');

    //Create div for back button and participant ID title.
    this.chart2.wrap
        .insert('div', ':first-child')
        .attr('id', 'backButton')
        .insert('button', '.legend')
        .html('&#8592; Back')
        .style('cursor', 'pointer')
        .on('click', () => {
            this.chart2.wrap.select('.id-title').remove();
            this.chart2.wrap.style('display', 'none');
            this.table.wrap.style('display', 'none');
            this.controls.wrap.style('display', 'block');
            this.wrap.style('display', 'block');
            this.draw();
        });

    //Add top x-axis.
    var x2 = this.svg.append('g').attr('class', 'x2 axis linear');
    x2
        .append('text')
        .attr({
            class: 'axis-title top',
            dy: '2em',
            'text-anchor': 'middle'
        })
        .text(this.config.x_label);
}
