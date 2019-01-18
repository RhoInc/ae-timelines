export default function addNAToColorScale() {
    if (this.na)
        // defined in ../onInit/checkColorBy
        this.colorScale.range().splice(this.colorScale.domain().indexOf('N/A'), 1, '#999999');
}
