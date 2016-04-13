import { createChart, createControls, createTable } from 'webcharts';
import { controlInputs} from './default-settings'
import config from './default-settings';
import { secondSettings } from './second-settings';
import onInit from './onInit';
import onLayout from './onLayout';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';
import './bin/object-assign';

export default function aeTimeline(element, settings){
	//merge user's settings with defaults
	let mergedSettings = Object.assign({}, config, settings);
	//keep settings in sync
	mergedSettings.y.column = mergedSettings.id_col;
	mergedSettings.marks[0].per = [mergedSettings.id_col, mergedSettings.seq_col];
	mergedSettings.marks[0].tooltip = `System Organ Class: [${mergedSettings.soc_col}]\nPreferred Term: [${mergedSettings.term_col}]\nStart Day: [${mergedSettings.stdy_col}]\nStop Day: [${mergedSettings.endy_col}]`;
	mergedSettings.marks[1].per = [mergedSettings.id_col, mergedSettings.seq_col, 'wc_value'];
	mergedSettings.marks[1].tooltip = `System Organ Class: [${mergedSettings.soc_col}]\nPreferred Term: [${mergedSettings.term_col}]\nStart Day: [${mergedSettings.stdy_col}]\nStop Day: [${mergedSettings.endy_col}]`;
	mergedSettings.color_by = mergedSettings.sev_col;
	//keep control settings in sync
	controlInputs[0].value_col = mergedSettings.sev_col;
	controlInputs[1].value_col = mergedSettings.soc_col;
	controlInputs[2].value_col = mergedSettings.id_col;
	controlInputs[3].value_col = mergedSettings.rel_col;
	
	//keep settings for secondary chart in sync
	let mergedSecondSettings = Object.assign({}, secondSettings, settings);
	mergedSecondSettings.y.column = mergedSettings.seq_col;
	mergedSecondSettings.marks[0].per[0] = mergedSettings.seq_col;
	mergedSecondSettings.marks[1].per[0] = mergedSettings.seq_col;
	mergedSecondSettings.color_by = mergedSettings.sev_col;
	mergedSecondSettings.color_dom = mergedSettings.legend ? mergedSecondSettings.legend.order : null;

	//create controls now
	let controls = createControls(element, {location: 'top', inputs: controlInputs});
	
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
