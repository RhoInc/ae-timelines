import addParticipantCountContainer from './onLayout/addParticipantCountContainer';
import addTopXaxis from './onLayout/addTopXaxis';
import addBackButton from './onLayout/addBackButton';

export default function onLayout() {
    //Add div for participant counts.
    addParticipantCountContainer.call(this);

    //Add top x-axis.
    addTopXaxis.call(this);

    //Create div for back button and participant ID title.
    addBackButton.call(this);
}
