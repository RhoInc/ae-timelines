import { set } from 'd3';

export default function addTickClick() {
    const context = this;
    this.svg
        .select('.y.axis')
        .selectAll('.tick')
        .style('cursor', 'pointer')
        .on('click', d => {
            let csv2 = this.raw_data.filter(di => di[this.config.id_col] === d);
            this.chart2.wrap.style('display', 'block');
            this.chart2.draw(csv2);
            this.chart2.wrap
                .select('#backButton')
                .append('strong')
                .attr('class', 'id-title')
                .style('margin-left', '1%')
                .text('Participant: ' + d);

            //Trigger participantsSelected event
            context.participantsSelected = [d];
            context.events.participantsSelected.data = context.participantsSelected;
            context.wrap.node().dispatchEvent(context.events.participantsSelected);

            //Sort listing by sequence.
            const seq_col = context.config.seq_col;
            let tableData = this.superRaw
                .filter(di => di[this.config.id_col] === d)
                .sort((a, b) => (+a[seq_col] < b[seq_col] ? -1 : 1));

            //Define listing columns.
            this.table.config.cols = set(
                this.config.details.map(detail => detail.value_col)
            ).values();
            this.table.config.headers = set(
                this.config.details.map(detail => detail.label)
            ).values();
            this.table.wrap.style('display', 'block');
            this.table.draw(tableData);
            this.table.wrap.selectAll('th,td').style({
                'text-align': 'left',
                'padding-right': '10px'
            });

            //Hide timelines.
            this.wrap.style('display', 'none');
            this.controls.wrap.style('display', 'none');
        });
}
