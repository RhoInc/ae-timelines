export default function sortLegendFilter() {
    this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.value_col === this.config.color.value_col)
        .selectAll('option')
        .sort((a, b) => this.config.legend.order.indexOf(a) - this.config.legend.order.indexOf(b));
}
