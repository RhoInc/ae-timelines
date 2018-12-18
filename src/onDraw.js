import addNAToColorScale from './onDraw/addNAToColorScale';
import updateParticipantCount from './onDraw/updateParticipantCount';
import sortYdomain from './onDraw/sortYdomain';

export default function onDraw() {
    addNAToColorScale.call(this);
    updateParticipantCount(this, '.annote', 'participant ID(s)');
    sortYdomain.call(this);
}
