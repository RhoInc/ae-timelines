import { createChart, createControls, createTable } from 'webcharts';
import { syncSettings, controlInputs, syncControlInputs, secondSettings, syncSecondSettings} from './default-settings'
import config from './default-settings';
import onInit from './onInit';
import onLayout from './onLayout';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';
import './util/object-assign';

export default function aeTimeline(element, settings){
	//merge user's settings with defaults
	const initialSettings = Object.assign({}, config, settings);

	//keep settings in sync with the data mappings
	const mergedSettings = syncSettings(initialSettings);

	//keep settings for secondary chart in sync
	const initialMergedSecondSettings = Object.assign({}, secondSettings, Object.create(settings));
	const mergedSecondSettings = syncSecondSettings(initialMergedSecondSettings, mergedSettings);

	//keep control inputs settings in sync
	const syncedControlInputs = syncControlInputs(controlInputs, Object.create(mergedSettings));

	//create controls now
	const controls = createControls(element, {location: 'top', inputs: syncedControlInputs});

	//create chart
	const chart = createChart(element, mergedSettings, controls);
	chart.on('init', onInit);
	chart.on('layout', onLayout);
	chart.on('datatransform', onDataTransform);
	chart.on('draw', onDraw);
	chart.on('resize', onResize);

	//set up secondary chart and table
	const chart2 = createChart(element, mergedSecondSettings).init([]);
	chart2.wrap.style('display', 'none');
	chart.chart2 = chart2;
	const table = createTable(element, {}).init([]);
	chart.table = table;

	return chart;
}
