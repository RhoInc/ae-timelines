import React from 'react';
import stringAccessor from './string-accessor';
import binding from '../binding';
import reactTemplate from './reactTemplate';
import { syncSettings } from '../../default-settings';
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
    // set placeholders for anything the user can change
    const shell = {
   //Addition settings for this template
    id_col: 'USUBJID',
    seq_col: 'AESEQ',
    soc_col: 'AEBODSYS',
    term_col: 'AETERM',
    stdy_col: 'ASTDY',
    endy_col: 'AENDY',
    sev_col: 'AESEV',
    rel_col: 'AEREL',

    //Standard webcharts settings
    x:{
        "label":null,
        "type":"linear",
        "column":'wc_value'
    },
    y:{
        "column":null, //set in syncSettings()
        "label": '', 
        "sort":"earliest",
        "type":"ordinal",
        "behavior": 'flex'
    },
   "margin": {"top": 50, bottom: null, left: null, right: null},
    "legend":{
        "mark":"circle", 
        "label": 'Severity'
    },
    "marks":[
        {
            "per":null, //set in syncSettings()
            "tooltip":null, //set in syncSettings()
            "type":"line",
            "attributes":{'stroke-width': 5, 'stroke-opacity': .8 },
        },
        {
            "per":null, //set in syncSettings()
            "tooltip":null, //set in syncSettings()
            "type":"circle",
        }
    ],
    "colors": ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
    "date_format":"%m/%d/%y",
    "resizable":true,
    "max_width":1000,
    "y_behavior": 'flex',
    "gridlines":"y",
    "no_text_size":false,
    "range_band":15,
    "color_by":null //set in syncSettings()
    };

    binding.dataMappings.forEach(e => {
      let chartVal = stringAccessor(props.dataMappings, e.source);
      if(chartVal){
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
        // else{
        //   stringAccessor(shell, e.target, null);
        // }
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
    return syncSettings(shell);
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
