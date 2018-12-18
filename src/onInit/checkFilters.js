import { set } from 'd3';

export default function checkFilters() {
    this.controls.config.inputs = this.controls.config.inputs.filter(input => {
        if (input.type !== 'subsetter') return true;
        else {
            const levels = set(this.superRaw.map(d => d[input.value_col])).values();
            if (levels.length < 2) {
                console.warn(
                    `The [ ${
                        input.value_col
                    } ] filter was removed because the variable has only one level.`
                );
                return false;
            }

            return true;
        }
    });
}
