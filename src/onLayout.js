import sortLegendFilter from './onLayout/sortLegendFilter';
import addParticipantCountContainer from './onLayout/addParticipantCountContainer';
import addTopXaxis from './onLayout/addTopXaxis';
import addBackButton from './onLayout/addBackButton';

export default function onLayout() {
    sortLegendFilter.call(this);
    addParticipantCountContainer.call(this);
    addTopXaxis.call(this);
    addBackButton.call(this);
}
