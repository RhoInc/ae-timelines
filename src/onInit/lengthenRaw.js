/*------------------------------------------------------------------------------------------------\
  Expand a data array to one item per original item per specified column.
\------------------------------------------------------------------------------------------------*/

export default function lengthenRaw() {
    const data = this.superRaw;
    const columns = [this.config.stdy_col, this.config.endy_col];
    const my_data = [];

    data.forEach(d => {
        columns.forEach(column => {
            const obj = Object.assign({}, d);
            obj.wc_category = column;
            obj.wc_value = parseFloat(d[column]);
            my_data.push(obj);
        });
    });

    this.raw_data = my_data;
}
