import { createChart, createControls, createTable }
    from 'webcharts';
import config
    from './default-settings'
import { syncSettings, controlInputs, syncControlInputs, secondSettings, syncSecondSettings }
    from './default-settings'
import onInit
    from './onInit';
import onLayout
    from './onLayout';
import onDataTransform
    from './onDataTransform';
import onDraw
    from './onDraw';
import onResize
    from './onResize';
import './util/object-assign';

export default function aeTimeline(element, settings) {
  //Merge default settings with custom settings.
    const mergedSettings = Object.assign({}, config, settings);

  //Sync properties within settings object.
    const syncedSettings = syncSettings(mergedSettings);

  //keep control inputs settings in sync
    const syncedControlInputs = syncControlInputs(controlInputs, syncedSettings);

  //Merge default secondary settings with custom settings.
    const mergedSecondSettings = Object.assign({}, secondSettings, settings);

  //Sync secondary settings with data mapping
    const syncedSecondSettings = syncSecondSettings(mergedSecondSettings);

  //create controls now
    const controls = createControls(element, {location: 'top', inputs: syncedControlInputs});

  //create chart
    const chart = createChart(element, syncedSettings, controls);
    chart.config.initialSettings = mergedSettings;
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

  //set up secondary chart and table
    const chart2 = createChart(element, mergedSecondSettings).init([]);
    chart2.config.initialSettings = mergedSecondSettings;
    chart2.wrap.style('display', 'none');
    chart.chart2 = chart2;
    const table = createTable(element, {}).init([]);
    chart.table = table;

    return chart;
}
