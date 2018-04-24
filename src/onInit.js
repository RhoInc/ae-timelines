import { set } from 'd3';
import defineColorDomain from './onInit/defineColorDomain';
import lengthenRaw from './onInit/lengthenRaw';

export default function onInit() {
    //Count total number of IDs for population count.
    this.populationCount = set(this.raw_data.map(d => d[this.config.id_col])).values().length;

    //Remove non-AE records.
    this.superRaw = this.raw_data.filter(d => /[^\s]/.test(d[this.config.term_col]));

    //Set empty settings.color_by values to 'N/A'.
    this.superRaw.forEach(
        d =>
            (d[this.config.color_by] = /[^\s]/.test(d[this.config.color_by])
                ? d[this.config.color_by]
                : 'N/A')
    );

    //Append unspecified settings.color_by values to settings.legend.order and define a shade of
    //gray for each.
    defineColorDomain.call(this);

    //Derived data manipulation
    this.raw_data = lengthenRaw(this.superRaw, [this.config.stdy_col, this.config.endy_col]);
    this.raw_data.forEach(d => {
        d.wc_value = d.wc_value ? +d.wc_value : NaN;
    });

    // Remove filters for variables with 0 or 1 levels
    var chart = this;

    this.controls.config.inputs = this.controls.config.inputs.filter(function(d) {
        if (d.type != 'subsetter') {
            return true;
        } else {
            var levels = set(chart.raw_data.map(f => f[d.value_col])).values();
            if (levels.length < 2) {
                console.warn(
                    d.value_col + ' filter not shown since the variable has less than 2 levels'
                );
            }
            return levels.length >= 2;
        }
    });
}
