export default function addBackButton() {
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
}
