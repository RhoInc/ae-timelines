export default function addTopXaxis() {
    this.svg
        .append('g')
        .attr('class', 'x2 axis linear')
        .append('text')
        .attr({
            class: 'axis-title top',
            dy: '2em',
            'text-anchor': 'middle'
        })
        .text(this.config.x_label);
}
