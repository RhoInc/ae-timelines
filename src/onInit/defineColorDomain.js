import { set } from 'd3';

export default function defineColorDomain() {
    const color_by_values = set(this.superRaw.map(d => d[this.config.color_by]))
        .values()
        .sort((a, b) => {
            const aIndex = this.config.color.values.indexOf(a);
            const bIndex = this.config.color.values.indexOf(b);
            const diff = aIndex > -1 && bIndex > -1 ? aIndex - bIndex : 0;

            return diff
                ? diff
                : aIndex > -1
                  ? -1
                  : bIndex > -1
                    ? 1
                    : a === 'N/A'
                      ? 1
                      : b === 'N/A' ? -1 : a.toLowerCase() < b.toLowerCase() ? -1 : 1;
        });
    color_by_values.forEach((color_by_value, i) => {
        if (this.config.color.values.indexOf(color_by_value) < 0) {
            this.config.color_dom.push(color_by_value);
            this.config.legend.order.push(color_by_value);
            this.chart2.config.color_dom.push(color_by_value);
            this.chart2.config.legend.order.push(color_by_value);
        }
    });
}
