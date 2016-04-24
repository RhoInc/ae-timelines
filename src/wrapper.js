import { createChart, createControls, createTable } from 'webcharts';
import { syncSettings, controlInputs, syncControlInputs,secondSettings, syncSecondSettings} from './default-settings'
import config from './default-settings';
import onInit from './onInit';
import onLayout from './onLayout';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';
import './util/object-assign';

export default function aeTimeline(element, settings){
	//merge user's settings with defaults
	let mergedSettings = Object.assign({}, config, settings);
	
	//keep settings in sync with the data mappings
	mergedSettings = syncSettings(mergedSettings)
	
	//keep settings for secondary chart in sync
	let mergedSecondSettings = Object.assign({}, secondSettings, settings);
	mergedSecondSettings = syncSecondSettings(mergedSecondSettings, mergedSettings)

	//keep control inputs settings in sync
	let syncedControlInputs = syncControlInputs(controlInputs, mergedSettings)

	//create controls now
	let controls = createControls(element, {location: 'top', inputs: syncedControlInputs});
	
	//create chart
	let chart = createChart(element, mergedSettings, controls);
	chart.on('init', onInit);
	chart.on('layout', onLayout);
	chart.on('datatransform', onDataTransform);
	chart.on('draw', onDraw);
	chart.on('resize', onResize);

	//set up secondary chart and table
	let chart2 = createChart(element, mergedSecondSettings).init([]);
	chart2.wrap.style('display', 'none');
	chart.chart2 = chart2;
	let table = createTable(element, {}).init([]);
	chart.table = table;

	return chart;
}
