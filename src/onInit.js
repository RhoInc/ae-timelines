import lengthenRaw
    from './util/lengthen-raw';

export default function onInit() {
  //Raw data manipulation
    this.superRaw = this.raw_data;
    this.superRaw
        .forEach(d => {
        });

  //Derived data manipulation
    this.raw_data = lengthenRaw(this.raw_data, [this.config.stdy_col, this.config.endy_col]);
    this.raw_data
        .forEach(d => {
            d.wc_value = d.wc_value
                ? +d.wc_value
                : NaN;
        });

  //Create div for back button and participant ID title.
    this.chart2.wrap.insert('div', ':first-child')
        .attr('id', 'backButton')
        .insert('button', '.legend')
            .html('&#8592; Back')
            .style('cursor', 'pointer')
            .on('click', () => {
                this.wrap.style('display', 'block');
                this.table.draw([]);
                this.chart2.wrap.style('display', 'none');
                this.chart2.wrap.select('.id-title').remove();
                this.controls.wrap.style('display', 'block');
            });

  //Modify tooltips when user specifies study visit column (settings.vis_col).
    if (this.config.vis_col) {
        for (let i = 0; i < this.config.marks.length; i++) {
            this.config.marks[i].tooltip = this.config.marks[i].tooltip
                + '\nStudy Visit: ['
                + this.config.vis_col
                + ']';
            this.chart2.config.marks[i].tooltip = this.chart2.config.marks[i].tooltip
                + '\nStudy Visit: ['
                + this.config.vis_col
                + ']';
        }
    }
}
