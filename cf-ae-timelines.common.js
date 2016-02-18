'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var React = _interopDefault(require('react'));
var d3 = require('d3');
var webcharts = require('webcharts');

function stringAccessor(o, s, v) {
  //adapted from http://jsfiddle.net/alnitak/hEsys/
  s = s.replace(/\[(\w+)\]/g, '.$1');
  s = s.replace(/^\./, '');
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      if (i == n - 1 && v !== undefined) o[k] = v;
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

var binding = {
  dataMappings: [{
    source: "x",
    target: "x.column"
  }, {
    source: "x_order",
    target: "x.order"
  }, {
    source: "x_domain",
    target: "x.domain"
  }, {
    source: "y",
    target: "y.column"
  }, {
    source: "y_order",
    target: "y.order"
  }, {
    source: "y_domain",
    target: "y.domain"
  }, {
    source: "group",
    target: "marks.0.per"
  }, {
    source: "subgroup",
    target: "marks.0.split"
  }, {
    source: "subset",
    target: "marks.0.values"
  }, {
    source: "color_by",
    target: "color_by"
  }, {
    source: "legend_order",
    target: "legend.order"
  }, {
    source: "tooltip",
    target: "marks.0.tooltip"
  }],
  chartProperties: [{
    source: "date_format",
    target: "date_format"
  }, {
    source: "x_label",
    target: "x.label"
  }, {
    source: "x_type",
    target: "x.type"
  }, {
    source: "x_format",
    target: "x.format"
  }, {
    source: "x_sort",
    target: "x.sort"
  }, {
    source: "x_bin",
    target: "x.bin"
  }, {
    source: "x_behavior",
    target: "x.behavior"
  }, {
    source: "y_label",
    target: "y.label"
  }, {
    source: "y_type",
    target: "y.type"
  }, {
    source: "y_format",
    target: "y.format"
  }, {
    source: "y_sort",
    target: "y.sort"
  }, {
    source: "y_behavior",
    target: "y.behavior"
  }, {
    source: "marks_type",
    target: "marks.0.type"
  }, {
    source: "marks_summarizeX",
    target: "marks.0.summarizeX"
  }, {
    source: "marks_summarizeY",
    target: "marks.0.summarizeY"
  }, {
    source: "marks_arrange",
    target: "marks.0.arrange"
  }, {
    source: "marks_fill_opacity",
    target: "marks.0.attributes.fill-opacity"
  }, {
    source: "aspect_ratio",
    target: "aspect"
  }, {
    source: "range_band",
    target: "range_band"
  }, {
    source: "colors",
    target: "colors"
  }, {
    source: "gridlines",
    target: "gridlines"
  }, {
    source: "max_width",
    target: "max_width"
  }, {
    source: "resizable",
    target: "resizable"
  }, {
    source: "scale_text",
    target: "scale_text"
  }, {
    source: "legend_mark",
    target: "legend.mark"
  }, {
    source: "legend_label",
    target: "legend.label"
  }]
};

var settings = {
  //Addition settings for this template
  id_col: 'USUBJID',
  seq_col: 'AESEQ',
  soc_col: 'AEBODSYS',
  term_col: 'AETERM',
  stdy_col: 'ASTDY',
  endy_col: 'AENDY',
  sev_col: 'AESEV',
  //Standard webcharts settings
  x: {
    "label": null,
    "type": "linear",
    "column": 'wc_value'
  },
  y: {
    "label": '',
    "sort": "earliest",
    "type": "ordinal",
    "column": "USUBJID",
    "behavior": 'flex'
  },
  "margin": { "top": 50 },
  "legend": {
    "mark": "circle",
    "label": 'Severity'
  },
  "marks": [{
    "type": "line",
    "per": ["USUBJID", "AESEQ"],
    "attributes": { 'stroke-width': 5, 'stroke-opacity': .8 },
    "tooltip": 'System Organ Class: [AEBODSYS]\nPreferred Term: [AETERM]\nStart Day: [ASTDY]\nStop Day: [AENDY]'
  }, {
    "type": "circle",
    "per": ["USUBJID", "AESEQ", "wc_value"],
    "tooltip": 'System Organ Class: [AEBODSYS]\nPreferred Term: [AETERM]\nStart Day: [ASTDY]\nStop Day: [AENDY]'
  }],
  "color_by": "AESEV",
  "colors": ['#66bd63', '#fdae61', '#d73027'],
  "date_format": "%m/%d/%y",
  "resizable": true,
  "max_width": 1000,
  "y_behavior": 'flex',
  "gridlines": "y",
  "no_text_size": false,
  "range_band": 15
};

var controlInputs = [{ label: "Severity", type: "subsetter", value_col: "AESEV", multiple: true }, { label: "AEBODSYS", type: "subsetter", value_col: "AEBODSYS" }, { label: "Subject ID", type: "subsetter", value_col: "USUBJID" }, { label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true }];

var secondSettings = {
  "x": { label: '', "type": "linear", "column": "wc_value" },
  "y": { label: '', "sort": "alphabetical-descending", "type": "ordinal", "column": "AESEQ" },
  "legend": { "mark": "circle", label: 'Severity' },
  "marks": [{ "type": "line", "per": ["AESEQ"], attributes: { 'stroke-width': 5, 'stroke-opacity': .8 } }, { "type": "circle", "per": ["AESEQ", "wc_value"] }],
  color_by: "AESEV",
  colors: ['#66bd63', '#fdae61', '#d73027'],
  "date_format": "%d%b%Y:%X",
  // "resizable":false,
  "max_width": 1000,
  // point_size: 3,
  "gridlines": "y",
  "no_text_size": false,
  "range_band": 28
};

function lengthenRaw(data, columns) {
  var my_data = [];

  data.forEach(function (e) {
    columns.forEach(function (g) {
      var obj = Object.assign({}, e);
      obj.wc_category = g;
      obj.wc_value = e[g];
      my_data.push(obj);
    });
  });

  return my_data;
}

function onInit() {
  var _this = this;

  this.superRaw = this.raw_data;
  this.raw_data = lengthenRaw(this.raw_data, [this.config.stdy_col, this.config.endy_col]);
  this.raw_data.forEach(function (d) {
    d.wc_value = d.wc_value == "" ? NaN : +d.wc_value;
  });
  //create back button
  var myChart = this;
  this.chart2.wrap.insert('button', 'svg').html('&#8592; Back').style('cursor', 'pointer').on('click', function () {
    _this.wrap.style('display', 'block');
    _this.table.draw([]);
    _this.chart2.wrap.style('display', 'none');
    _this.chart2.wrap.select('.id-title').remove();
    _this.controls.wrap.style('display', 'block');
  });
};

function onLayout() {

  var x2 = this.svg.append("g").attr("class", "x2 axis time");
  x2.append("text").attr("class", "axis-title top").attr("dy", "2em").attr("text-anchor", "middle").text(this.config.x_label);
}

function onDataTransform() {}

function onDraw() {}

function onResize() {
  var _this2 = this;

  this.chart2.x_dom = this.x_dom;
  this.svg.select('.y.axis').selectAll('.tick').style('cursor', 'pointer').on('click', function (d) {
    var csv2 = _this2.raw_data.filter(function (f) {
      return f[_this2.config.id_col] === d;
    });
    _this2.chart2.wrap.style('display', 'block');
    _this2.chart2.draw(csv2);
    _this2.chart2.wrap.insert('h4', 'svg').attr('class', 'id-title').text(d);

    var tableData = _this2.superRaw.filter(function (f) {
      return f[_this2.config.id_col] === d;
    });
    _this2.table.draw(tableData);
    _this2.wrap.style('display', 'none');
    _this2.controls.wrap.style('display', 'none');
  });

  var x2Axis = d3.svg.axis().scale(this.x).orient('top').tickFormat(this.xAxis.tickFormat()).innerTickSize(this.xAxis.innerTickSize()).outerTickSize(this.xAxis.outerTickSize()).ticks(this.xAxis.ticks()[0]);

  var g_x2_axis = this.svg.select("g.x2.axis").attr("class", "x2 axis time");
  // .attr("transform", "translate(0,-10)");

  g_x2_axis.transition().call(x2Axis);

  g_x2_axis.select("text.axis-title.top").transition().attr("transform", "translate(" + this.raw_width / 2 + ",-" + this.config.margin.top + ")");

  g_x2_axis.select('.domain').attr({
    'fill': 'none',
    'stroke': '#ccc',
    'shape-rendering': 'crispEdges'
  });
  g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');
}

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

function outlierExplorer(element, settings$$) {
  //merge user's settings with defaults
  var mergedSettings = Object.assign({}, settings, settings$$);
  //keep settings in sync
  mergedSettings.y.column = mergedSettings.id_col;
  mergedSettings.marks[0].per = [mergedSettings.id_col, mergedSettings.seq_col];
  mergedSettings.marks[0].tooltip = 'System Organ Class: [' + mergedSettings.soc_col + ']\nPreferred Term: [' + mergedSettings.term_col + ']\nStart Day: [' + mergedSettings.stdy_col + ']\nStop Day: [' + mergedSettings.endy_col + ']';
  mergedSettings.marks[1].per = [mergedSettings.id_col, mergedSettings.seq_col, 'wc_value'];
  mergedSettings.marks[1].tooltip = 'System Organ Class: [' + mergedSettings.soc_col + ']\nPreferred Term: [' + mergedSettings.term_col + ']\nStart Day: [' + mergedSettings.stdy_col + ']\nStop Day: [' + mergedSettings.endy_col + ']';
  mergedSettings.color_by = mergedSettings.sev_col;
  //keep control settings in sync
  controlInputs[0].value_col = mergedSettings.sev_col;
  controlInputs[1].value_col = mergedSettings.soc_col;
  controlInputs[2].value_col = mergedSettings.id_col;
  //keep settings for secondary chart in sync
  secondSettings.y.column = mergedSettings.seq_col;
  secondSettings.marks[0].per[0] = mergedSettings.seq_col;
  secondSettings.marks[1].per[0] = mergedSettings.seq_col;
  secondSettings.color_by = mergedSettings.sev_col;

  //create controls now
  var controls = webcharts.createControls(element, { location: 'top', inputs: controlInputs });
  //create chart
  var chart = webcharts.createChart(element, mergedSettings, controls);
  chart.on('init', onInit);
  chart.on('layout', onLayout);
  chart.on('datatransform', onDataTransform);
  chart.on('draw', onDraw);
  chart.on('resize', onResize);

  //set up secondary chart and table
  var chart2 = webcharts.createChart(element, secondSettings).init([]);
  chart2.wrap.style('display', 'none');
  chart.chart2 = chart2;
  var table = webcharts.createTable(element, {}).init([]);
  chart.table = table;

  return chart;
}

var ReactAETimelines = (function (_React$Component) {
  _inherits(ReactAETimelines, _React$Component);

  function ReactAETimelines(props) {
    _classCallCheck(this, ReactAETimelines);

    _get(Object.getPrototypeOf(ReactAETimelines.prototype), 'constructor', this).call(this, props);
    this.state = {};
  }

  _createClass(ReactAETimelines, [{
    key: 'componentDidMount',
    value: function componentDidMount(prevProps, prevState) {
      if (this.props.data.length) {
        //manually clear div and redraw
        d3.select('.chart-div.id-' + this.props.id).selectAll('*').remove();
        var chart = outlierExplorer('.chart-div.id-' + this.props.id, this.props.settings).init(this.props.data);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.data.length) {
        //manually clear div and redraw
        d3.select('.chart-div.id-' + this.props.id).selectAll('*').remove();
        var chart = outlierExplorer('.chart-div.id-' + this.props.id, this.props.settings).init(this.props.data);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', {
        key: this.props.id,
        className: 'chart-div id-' + this.props.id + ' ' + (!this.props.data.length ? 'loading' : ''),
        style: { minHeight: '1px', minWidth: '1px' }
      });
    }
  }]);

  return ReactAETimelines;
})(React.Component);

ReactAETimelines.defaultProps = { data: [], controlInputs: [], id: 'id' };

function describeCode(props) {
  var settings = this.createSettings(props);
  var code = '//uses d3 v.' + d3.version + '\n//uses webcharts v.' + webcharts.version + '\n\nvar settings = ' + JSON.stringify(settings, null, 2) + ';\n\nvar myChart = aeTimelines(dataElement, settings);\n\nd3.csv(dataPath, function(error, csv) {\n  myChart.init(data);\n});\n  ';
  return code;
}

var Renderer = (function (_React$Component2) {
  _inherits(Renderer, _React$Component2);

  function Renderer(props) {
    _classCallCheck(this, Renderer);

    _get(Object.getPrototypeOf(Renderer.prototype), 'constructor', this).call(this, props);
    this.binding = binding;
    this.describeCode = describeCode.bind(this);
    this.state = { data: [], settings: {}, template: {}, loadMsg: 'Loading...' };
  }

  _createClass(Renderer, [{
    key: 'createSettings',
    value: function createSettings(props) {
      var shell = {};

      binding.dataMappings.forEach(function (e) {
        var chartVal = stringAccessor(props.dataMappings, e.source);
        if (chartVal) {
          stringAccessor(shell, e.target, chartVal);
        } else {
          var defaultVal = stringAccessor(props.template.dataMappings, e.source + '.default');
          if (defaultVal && typeof defaultVal === 'string' && defaultVal.slice(0, 3) === 'dm$') {
            var pointerVal = stringAccessor(props.dataMappings, defaultVal.slice(3)) || null;
            stringAccessor(shell, e.target, pointerVal);
          } else if (defaultVal) {
            stringAccessor(shell, e.target, defaultVal);
          } else {
            stringAccessor(shell, e.target, null);
          }
        }
      });
      binding.chartProperties.forEach(function (e) {
        var chartVal = stringAccessor(props.chartProperties, e.source);
        if (chartVal !== undefined) {
          stringAccessor(shell, e.target, chartVal);
        } else {
          var defaultVal = stringAccessor(props.template.chartProperties, e.source + '.default');
          stringAccessor(shell, e.target, defaultVal);
        }
      });

      return shell;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var settings = this.createSettings(this.props);
      this.setState({ settings: settings });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var settings = this.createSettings(nextProps);
      this.setState({ settings: settings });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(ReactAETimelines, {
        id: this.props.id,
        settings: this.state.settings,
        controlInputs: this.props.template.controls,
        data: this.props.data
      });
    }
  }]);

  return Renderer;
})(React.Component);

module.exports = Renderer;

