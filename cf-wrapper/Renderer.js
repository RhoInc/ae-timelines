import React from 'react';
import stringAccessor from './string-accessor';
import binding from './binding';
import ReactAETimelines from './ReactAETimelines';

export default class Renderer extends React.Component {
  constructor(props) {
    super(props);
    this.binding = binding;
    this.state = {data: [], settings: {}, template: {}, loadMsg: 'Loading...'};
  }
  createSettings(props) {
    const shell = {};
    
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

    this.setState({settings: shell, loadMsg: ''});
  }
  componentWillMount() {
    this.createSettings(this.props);
  }
  componentWillReceiveProps(nextProps){
    this.createSettings(nextProps);
  }
  render() {
    return (
      React.createElement(ReactAETimelines, {
        id: this.props.id,
        settings: this.state.settings, 
        controlInputs: this.props.template.controls,
        data: this.props.data
      })
    );
  }
}
