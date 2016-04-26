import React from 'react';
import stringAccessor from './string-accessor';
import binding from '../binding';
import reactTemplate from './reactTemplate';
import { version as d3_version } from 'd3';
import { version as wc_version } from 'webcharts';

function describeCode(props){
  var settings = this.createSettings(props);
  const code = `//uses d3 v.${d3_version}
//uses webcharts v.${wc_version}

var settings = ${JSON.stringify(settings, null, 2)};

var myChart = aeTimelines(dataElement, settings);

d3.csv(dataPath, function(error, csv) {
  myChart.init(csv);
});
  `;
  return code;
}


export default class Renderer extends React.Component {
  constructor(props) {
    super(props);
    this.binding = binding;
    this.describeCode = describeCode.bind(this);
    this.state = {data: [], settings: {}, template: {}, loadMsg: 'Loading...'};
  }
  createSettings(props) {
    const shell = {
        max_width: null,
        date_format: null,
        x: {
          label: null,
          type: null,
          format: null,
          column: null,
          behavior: null,
          bin: null,
          sort: null,
          order: [],
          domain: null
        },
        y: {
          label: null,
          type: null,
          format: null,
          column: null,
          behavior: null,
          bin: null,
          sort: null,
          order: [],
          domain: null
        },
        marks: [{
          type: null,
          per: [],
          values: null,
          split: null,
          arrange: null,
          tooltip: null,
          summarizeX: null,
          summarizeY: null,
          attributes: { "fill-opacity": null },
          text: null
        }, {
          type: null,
          per: [],
          values: null,
          split: null,
          arrange: null,
          tooltip: null,
          summarizeX: null,
          summarizeY: null,
          attributes: { "fill-opacity": null },
          text: null
        }],
        legend: {
          label: null,
          mark: null,
          order: [],
          location: null
        },
        colors: [],
        color_by: null,
        resizable: null,
        scale_text: null,
        aspect: null,
        range_band: null,
        gridlines: null,
        transitions: null,
        width: null,
        height: null,
        margin: {
          top: null,
          bottom: null,
          right: null,
          left: null
        }
      };

    binding.dataMappings.forEach(e => {
      let chartVal = stringAccessor(props.dataMappings, e.source);
      if(chartVal ){
        stringAccessor(shell, e.target, chartVal);
      }
      else{
        let defaultVal = stringAccessor(props.template.dataMappings, e.source+'.default');
        if(defaultVal && typeof defaultVal === 'string' && defaultVal.slice(0,3) === 'dm$'){
          var pointerVal = stringAccessor(props.dataMappings, defaultVal.slice(3)) || null;
          stringAccessor(shell, e.target, pointerVal);
        }
        else if(defaultVal){
          stringAccessor(shell, e.target, defaultVal);
        }
        else{
          stringAccessor(shell, e.target, null);
        }
      }
    });
    binding.chartProperties.forEach(e => {
      let chartVal = stringAccessor(props.chartProperties, e.source);
      if(chartVal !== undefined){
        stringAccessor(shell, e.target, chartVal);
      }
      else{
        let defaultVal = stringAccessor(props.template.chartProperties, e.source+'.default');
        stringAccessor(shell, e.target, defaultVal);
      }
    });

    return shell;
  }
  componentWillMount() {
    var settings = this.createSettings(this.props);
    this.setState({settings: settings});
  }
  componentWillReceiveProps(nextProps){
    var settings = this.createSettings(nextProps);
    this.setState({settings: settings});
  }
  render() {
    return (
      React.createElement(reactTemplate, {
        id: this.props.id,
        settings: this.state.settings,
        controlInputs: this.props.template.controls,
        data: this.props.data
      })
    );
  }
}
