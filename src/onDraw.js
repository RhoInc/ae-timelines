import updateParticipantCount from './onDraw/updateParticipantCount';
import sortYdomain from './onDraw/sortYdomain';

export default function onDraw() {
    //Annotate number of selected participants out of total participants.
    updateParticipantCount(this, '.annote', 'participant ID(s)');

    //Sort y-axis based on `Sort IDs` control selection.
    sortYdomain.call(this);
}
