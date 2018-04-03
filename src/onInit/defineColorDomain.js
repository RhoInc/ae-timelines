import { set } from 'd3';

export default function defineColorDomain() {
    const color_by_values = set(this.superRaw.map(d => d[this.config.color_by])).values();
    color_by_values.forEach((color_by_value, i) => {
        if (this.config.legend.order.indexOf(color_by_value) === -1) {
            this.config.color_dom.push(color_by_value);
            this.config.legend.order.push(color_by_value);
            this.chart2.config.color_dom.push(color_by_value);
            this.chart2.config.legend.order.push(color_by_value);
        }
    });
}
