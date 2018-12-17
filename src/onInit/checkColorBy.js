export default function checkColorBy() {
    this.superRaw.forEach(
        d =>
            (d[this.config.color_by] = /[^\s*$]/.test(d[this.config.color_by])
                ? d[this.config.color_by]
                : 'N/A')
    );
}
