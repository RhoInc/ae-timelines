export default function addParticipantCountContainer() {
    this.wrap
        .select('.legend')
        .append('span')
        .classed('annote', true)
        .style('float', 'right')
        .style('font-style', 'italic');
}
