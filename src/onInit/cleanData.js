export default function cleanData() {
    this.superRaw = this.raw_data
        .filter(d => /[^\s]/.test(d[this.config.term_col]));
}
