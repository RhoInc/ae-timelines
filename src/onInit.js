import calculatePopulationSize from './onInit/calculatePopulationSize';
import cleanData from './onInit/cleanData';
import checkFilters from './onInit/checkFilters';
import checkColorBy from './onInit/checkColorBy';
import defineColorDomain from './onInit/defineColorDomain';
import lengthenRaw from './onInit/lengthenRaw';
import initCustomEvents from './onInit/initCustomEvents';

export default function onInit() {
    calculatePopulationSize.call(this);
    cleanData.call(this);
    checkFilters.call(this);
    checkColorBy.call(this);
    defineColorDomain.call(this);
    lengthenRaw.call(this);
    initCustomEvents.call(this);
}
