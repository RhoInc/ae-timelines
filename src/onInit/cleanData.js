export default function cleanData() {
    this.superRaw = this.raw_data;
    const N = this.superRaw.length;

    //Remove records with empty verbatim terms.
    this.superRaw = this.superRaw.filter(d => /[^\s*$]/.test(d[this.config.term_col]));
    const n1 = this.superRaw.length;
    const diff1 = N - n1;
    if (diff1) console.warn(`${diff1} records without [ ${this.config.term_col} ] removed.`);

    //Remove records with non-integer start days.
    this.superRaw = this.superRaw.filter(d => /^-?\d+$/.test(d[this.config.stdy_col]));
    const n2 = this.superRaw.length;
    const diff2 = n1 - n2;
    if (diff2) console.warn(`${diff2} records without [ ${this.config.stdy_col} ] removed.`);
}
