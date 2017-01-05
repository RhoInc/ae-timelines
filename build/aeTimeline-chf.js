(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('d3'), require('webcharts')) :
	typeof define === 'function' && define.amd ? define(['react', 'd3', 'webcharts'], factory) :
	(global.aeTimelines = factory(global.React,global.d3,global.webCharts));
}(this, function (React,d3$1,webcharts) { 'use strict';

	React = 'default' in React ? React['default'] : React;

	function stringAccessor (o, s, v) {
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
			source: "stdy_col",
			target: "stdy_col"
		}, {
			source: "endy_col",
			target: "endy_col"
		}, {
			source: "id_col",
			target: "id_col"
		}, {
			source: "seq_col",
			target: "seq_col"
		}, {
			source: "sev_col",
			target: "sev_col"
		}, {
			source: "ser_col",
			target: "ser_col"
		}, {
			source: "term_col",
			target: "term_col"
		}, {
			source: "filters",
			target: "filters"
		}, {
			source: "detail_cols",
			target: "detail_cols"
		}, {
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var asyncGenerator = function () {
	  function AwaitValue(value) {
	    this.value = value;
	  }

	  function AsyncGenerator(gen) {
	    var front, back;

	    function send(key, arg) {
	      return new Promise(function (resolve, reject) {
	        var request = {
	          key: key,
	          arg: arg,
	          resolve: resolve,
	          reject: reject,
	          next: null
	        };

	        if (back) {
	          back = back.next = request;
	        } else {
	          front = back = request;
	          resume(key, arg);
	        }
	      });
	    }

	    function resume(key, arg) {
	      try {
	        var result = gen[key](arg);
	        var value = result.value;

	        if (value instanceof AwaitValue) {
	          Promise.resolve(value.value).then(function (arg) {
	            resume("next", arg);
	          }, function (arg) {
	            resume("throw", arg);
	          });
	        } else {
	          settle(result.done ? "return" : "normal", result.value);
	        }
	      } catch (err) {
	        settle("throw", err);
	      }
	    }

	    function settle(type, value) {
	      switch (type) {
	        case "return":
	          front.resolve({
	            value: value,
	            done: true
	          });
	          break;

	        case "throw":
	          front.reject(value);
	          break;

	        default:
	          front.resolve({
	            value: value,
	            done: false
	          });
	          break;
	      }

	      front = front.next;

	      if (front) {
	        resume(front.key, front.arg);
	      } else {
	        back = null;
	      }
	    }

	    this._invoke = send;

	    if (typeof gen.return !== "function") {
	      this.return = undefined;
	    }
	  }

	  if (typeof Symbol === "function" && Symbol.asyncIterator) {
	    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
	      return this;
	    };
	  }

	  AsyncGenerator.prototype.next = function (arg) {
	    return this._invoke("next", arg);
	  };

	  AsyncGenerator.prototype.throw = function (arg) {
	    return this._invoke("throw", arg);
	  };

	  AsyncGenerator.prototype.return = function (arg) {
	    return this._invoke("return", arg);
	  };

	  return {
	    wrap: function (fn) {
	      return function () {
	        return new AsyncGenerator(fn.apply(this, arguments));
	      };
	    },
	    await: function (value) {
	      return new AwaitValue(value);
	    }
	  };
	}();

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	/*------------------------------------------------------------------------------------------------\
	  Clone a variable (http://stackoverflow.com/a/728694).
	\------------------------------------------------------------------------------------------------*/

	function clone(obj) {
	    var copy;

	    //Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != (typeof obj === "undefined" ? "undefined" : _typeof(obj))) return obj;

	    //Handle Date
	    if (obj instanceof Date) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    //Handle Array
	    if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    //Handle Object
	    if (obj instanceof Object) {
	        copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	var settings =

	//Template-specific settings
	{ stdy_col: 'ASTDY',
	    endy_col: 'AENDY',
	    id_col: 'USUBJID',
	    seq_col: 'AESEQ',
	    sev_col: 'AESEV',
	    sev_vals: ['MILD', 'MODERATE', 'SEVERE'],
	    ser_col: 'AESER',
	    term_col: 'AETERM',
	    filters: [],
	    detail_cols: []

	    //Standard chart settings
	    , x: { column: 'wc_value',
	        type: 'linear',
	        label: null },
	    y: { column: null // set in syncSettings()
	        , type: 'ordinal',
	        label: '',
	        sort: 'earliest',
	        behavior: 'flex' },
	    marks: [{ type: 'line',
	        per: null // set in syncSettings()
	        , tooltip: null // set in syncSettings()
	        , attributes: { 'stroke-width': 5,
	            'stroke-opacity': .5 } }, { type: 'circle',
	        per: null // set in syncSettings()
	        , tooltip: null // set in syncSettings()
	        , attributes: { 'fill-opacity': .5,
	            'stroke-opacity': .5 } }, { type: 'line',
	        per: null // set in syncSettings()
	        , values: {} // set in syncSettings()
	        , tooltip: null // set in syncSettings()
	        , attributes: { 'stroke': 'black',
	            'stroke-width': 2 } }, { type: 'circle',
	        per: null // set in syncSettings()
	        , values: {} // set in syncSettings()
	        , tooltip: null // set in syncSettings()
	        , attributes: { 'class': 'serious',
	            'fill': 'none',
	            'stroke': 'black',
	            'stroke-width': 2 } }],
	    legend: { location: 'top',
	        label: 'Severity' },
	    color_by: null // set in syncSettings()
	    , colors: ['#66bd63', '#fdae61', '#d73027'],
	    date_format: '%Y-%m-%d',
	    y_behavior: 'flex',
	    gridlines: 'y',
	    no_text_size: false,
	    range_band: 15,
	    margin: { top: 50 },
	    resizable: true
	};

	function syncSettings(preSettings) {
	    var nextSettings = Object.create(preSettings);

	    if (!nextSettings.filters || nextSettings.filters.length === 0) nextSettings.filters = [{ value_col: nextSettings.ser_col, label: 'Serious Event' }, { value_col: nextSettings.sev_col, label: 'Severity/Intensity' }, { value_col: nextSettings.id_col, label: 'Participant ID' }];

	    nextSettings.y.column = nextSettings.id_col;

	    //Lines (AE duration)
	    nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
	    nextSettings.marks[0].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');

	    //Circles (AE start day)
	    nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
	    nextSettings.marks[1].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');
	    nextSettings.marks[1].values = { wc_category: [nextSettings.stdy_col] };

	    //Lines (SAE duration)
	    nextSettings.marks[2].per = [nextSettings.id_col, nextSettings.seq_col];
	    nextSettings.marks[2].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');
	    nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

	    //Circles (SAE start day)
	    nextSettings.marks[3].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
	    nextSettings.marks[3].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');
	    nextSettings.marks[3].values = { wc_category: [nextSettings.stdy_col] };
	    nextSettings.marks[3].values[nextSettings.ser_col] = ['Yes', 'Y'];

	    nextSettings.legend.order = nextSettings.sev_vals;

	    nextSettings.color_by = nextSettings.sev_col;

	    return nextSettings;
	}

	var controlInputs = [{ type: 'dropdown', option: 'y.sort', label: 'Sort IDs', values: ['earliest', 'alphabetical-descending'], require: true }];

	function syncControlInputs(preControlInputs, preSettings) {
	    preSettings.filters.reverse().forEach(function (d, i) {
	        var thisFilter = { type: 'subsetter',
	            value_col: d.value_col ? d.value_col : d,
	            label: d.label ? d.label : d.value_col ? d.value_col : d };
	        preControlInputs.unshift(thisFilter);
	        preSettings.detail_cols.push(d.value_col ? d.value_col : d);
	    });

	    return preControlInputs;
	}

	//Setting for custom details view
	var cloneSettings = clone(settings);
	cloneSettings.y.sort = 'alphabetical-descending';
	cloneSettings.transitions = false;
	cloneSettings.range_band = settings.range_band * 2;
	cloneSettings.margin = null;
	var secondSettings = cloneSettings;

	function syncSecondSettings(preSettings) {
	    var nextSettings = Object.create(preSettings);

	    nextSettings.y.column = nextSettings.seq_col;

	    //Lines (AE duration)
	    nextSettings.marks[0].per = [nextSettings.seq_col];
	    nextSettings.marks[0].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');

	    //Circles (AE start day)
	    nextSettings.marks[1].per = [nextSettings.seq_col, 'wc_value'];
	    nextSettings.marks[1].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');
	    nextSettings.marks[1].values = { wc_category: [nextSettings.stdy_col] };

	    //Lines (SAE duration)
	    nextSettings.marks[2].per = [nextSettings.seq_col];
	    nextSettings.marks[2].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');
	    nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

	    //Circles (SAE start day)
	    nextSettings.marks[3].per = [nextSettings.seq_col, 'wc_value'];
	    nextSettings.marks[3].tooltip = 'Verbatim Term: [' + nextSettings.term_col + ']' + ('\nStart Day: [' + nextSettings.stdy_col + ']') + ('\nStop Day: [' + nextSettings.endy_col + ']');
	    nextSettings.marks[3].values = { wc_category: [nextSettings.stdy_col] };
	    nextSettings.marks[3].values[nextSettings.ser_col] = ['Yes', 'Y'];

	    nextSettings.legend.order = nextSettings.sev_vals;

	    nextSettings.color_by = nextSettings.sev_col;

	    return nextSettings;
	}

	/*------------------------------------------------------------------------------------------------\
	  Expand a data array to one item per original item per specified column.
	\------------------------------------------------------------------------------------------------*/

	function lengthenRaw(data, columns) {
	    var my_data = [];

	    data.forEach(function (d) {
	        columns.forEach(function (column) {
	            var obj = Object.assign({}, d);
	            obj.wc_category = column;
	            obj.wc_value = d[column];
	            my_data.push(obj);
	        });
	    });

	    return my_data;
	}

	function onInit() {
	    var _this = this;

	    //Raw data manipulation
	    this.superRaw = this.raw_data;
	    this.superRaw.forEach(function (d) {});

	    //Derived data manipulation
	    this.raw_data = lengthenRaw(this.raw_data, [this.config.stdy_col, this.config.endy_col]);
	    this.raw_data.forEach(function (d) {
	        d.wc_value = d.wc_value ? +d.wc_value : NaN;
	    });

	    //Create div for back button and participant ID title.
	    this.chart2.wrap.insert('div', ':first-child').attr('id', 'backButton').insert('button', '.legend').html('&#8592; Back').style('cursor', 'pointer').on('click', function () {
	        _this.wrap.style('display', 'block');
	        _this.table.draw([]);
	        _this.chart2.wrap.style('display', 'none');
	        _this.chart2.wrap.select('.id-title').remove();
	        _this.controls.wrap.style('display', 'block');
	    });
	}

	function onLayout() {
	    //Add div for participant counts.
	    this.wrap.select('.legend').append('span').classed('annote', true).style('float', 'right');

	    //Add top x-axis.
	    var x2 = this.svg.append('g').attr('class', 'x2 axis linear');
	    x2.append('text').attr({ 'class': 'axis-title top',
	        'dy': '2em',
	        'text-anchor': 'middle' }).text(this.config.x_label);
	}

	function onDataTransform() {}

	/*------------------------------------------------------------------------------------------------\
	  Annotate number of participants based on current filters, number of participants in all, and
	  the corresponding percentage.

	  Inputs:

	    chart - a webcharts chart object
	    id_col - a column name in the raw data set (chart.raw_data) representing the observation of interest
	    id_unit - a text string to label the units in the annotation (default = 'participants')
	    selector - css selector for the annotation
	\------------------------------------------------------------------------------------------------*/

	function updateSubjectCount(chart, id_col, selector, id_unit) {
	    //count the number of unique ids in the data set
	    var totalObs = d3.set(chart.raw_data.map(function (d) {
	        return d[id_col];
	    })).values().length;

	    //count the number of unique ids in the current chart and calculate the percentage
	    var filtered_data = chart.raw_data.filter(function (d) {
	        var filtered = d[chart.config.initialSettings.seq_col] === '';
	        chart.filters.forEach(function (di) {
	            if (filtered === false && di.val !== 'All') filtered = Object.prototype.toString.call(di.val) === '[object Array]' ? di.val.indexOf(d[di.col]) === -1 : di.val !== d[di.col];
	        });
	        return !filtered;
	    });
	    var currentObs = d3.set(filtered_data.map(function (d) {
	        return d[id_col];
	    })).values().length;

	    var percentage = d3.format('0.1%')(currentObs / totalObs);

	    //clear the annotation
	    var annotation = d3.select(selector);
	    annotation.selectAll('*').remove();

	    //update the annotation
	    var units = id_unit ? ' ' + id_unit : ' participant(s)';
	    annotation.text(currentObs + ' of ' + totalObs + units + ' shown (' + percentage + ')');
	}

	function onDraw() {
	    var _this = this;

	    //Annotate number of selected participants out of total participants.
	    updateSubjectCount(this, this.config.id_col, '.annote');

	    //Sort y-axis based on `Sort IDs` control selection.
	    var yAxisSort = this.controls.wrap.selectAll('.control-group').filter(function (d) {
	        return d.label === 'Sort IDs';
	    }).selectAll('option:checked').text();
	    if (yAxisSort === 'earliest') {
	        (function () {
	            var filtered_data = _this.raw_data.filter(function (d) {
	                var filtered = d[_this.config.seq_col] === '';
	                _this.filters.forEach(function (di) {
	                    if (filtered === false && di.val !== 'All') filtered = Object.prototype.toString.call(di.val) === '[object Array]' ? di.val.indexOf(d[di.col]) === -1 : di.val !== d[di.col];
	                });
	                return !filtered;
	            });
	            var withStartDay = d3.nest().key(function (d) {
	                return d[_this.config.id_col];
	            }).rollup(function (d) {
	                return d3.min(d, function (di) {
	                    return +di[_this.config.stdy_col];
	                });
	            }).entries(filtered_data.filter(function (d) {
	                return !isNaN(parseFloat(d[_this.config.stdy_col])) && isFinite(d[_this.config.stdy_col]);
	            })).sort(function (a, b) {
	                return a.values > b.values ? -2 : a.values < b.values ? 2 : a.key > b.key ? -1 : 1;
	            }).map(function (d) {
	                return d.key;
	            });
	            var withoutStartDay = d3.set(filtered_data.filter(function (d) {
	                return +d[_this.config.seq_col] > 0 && (isNaN(parseFloat(d[_this.config.stdy_col])) || !isFinite(d[_this.config.stdy_col])) && withStartDay.indexOf(d[_this.config.id_col]) === -1;
	            }).map(function (d) {
	                return d[_this.config.id_col];
	            })).values();
	            _this.y_dom = withStartDay.concat(withoutStartDay);
	        })();
	    } else this.y_dom = this.y_dom.sort(d3.descending);
	}

	/*------------------------------------------------------------------------------------------------\
	  Sync colors of legend marks and chart marks.
	\------------------------------------------------------------------------------------------------*/

	function syncColors(chart) {
	    //Recolor legend.
	    var legendItems = chart.wrap.selectAll('.legend-item');
	    legendItems.each(function (d, i) {
	        d3.select(this).select('.legend-mark').style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(d.label)]).style('stroke-width', '25%');
	    });

	    //Recolor circles.
	    var circles = chart.svg.selectAll('circle.wc-data-mark:not(.serious)');
	    circles.each(function (d, i) {
	        var sev_val = d.values.raw[0][chart.config.initialSettings.sev_col];
	        d3.select(this).style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
	        d3.select(this).style('fill', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
	    });

	    //Recolor lines.
	    var lines = chart.svg.selectAll('path.wc-data-mark:not(.serious)');
	    lines.each(function (d, i) {
	        var sev_val = d.values[0].values.raw[0][chart.config.initialSettings.sev_col];
	        d3.select(this).style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
	    });
	}

	/*------------------------------------------------------------------------------------------------\
	  Add serious adverse event legend item.
	\------------------------------------------------------------------------------------------------*/

	function addSeriousLegendItem(chart) {
	    chart.wrap.select('.legend li.serious').remove();
	    var seriousLegendItem = chart.wrap.select('.legend').append('li').attr('class', 'serious').style({ 'list-style-type': 'none',
	        'margin-right': '1em',
	        'display': 'inline-block' });
	    var seriousLegendColorBlock = seriousLegendItem.append('svg').attr({ width: '1.75em',
	        height: '1.5em' }).style({ 'position': 'relative',
	        'top': '0.35em' });
	    seriousLegendColorBlock.append('circle').attr({ cx: 10,
	        cy: 10,
	        r: 4 }).style({ 'stroke': 'black',
	        'stroke-width': 2,
	        'fill': 'none' });
	    seriousLegendColorBlock.append('line').attr({ x1: 2 * 3.14 * 4 - 10,
	        y1: 10,
	        x2: 2 * 3.14 * 4 - 5,
	        y2: 10 }).style({ 'stroke': 'black',
	        'stroke-width': 2,
	        'shape-rendering': 'crispEdges' });
	    seriousLegendItem.append('text').style('margin-left', '.35em').text('Serious');
	}

	function onResize() {
	    var _this = this;

	    var context = this;

	    //Sync legend and mark colors.
	    syncColors(this);

	    //Add serious adverse event legend item.
	    addSeriousLegendItem(this);

	    //Draw second x-axis at top of chart.
	    var x2Axis = d3$1.svg.axis().scale(this.x).orient('top').tickFormat(this.xAxis.tickFormat()).innerTickSize(this.xAxis.innerTickSize()).outerTickSize(this.xAxis.outerTickSize()).ticks(this.xAxis.ticks()[0]);
	    var g_x2_axis = this.svg.select('g.x2.axis').attr('class', 'x2 axis linear');
	    g_x2_axis.call(x2Axis);
	    g_x2_axis.select('text.axis-title.top').attr('transform', 'translate(' + this.raw_width / 2 + ',-' + this.config.margin.top + ')');
	    g_x2_axis.select('.domain').attr({ 'fill': 'none',
	        'stroke': '#ccc',
	        'shape-rendering': 'crispEdges' });
	    g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');

	    //Draw second chart when y-axis tick label is clicked.
	    this.svg.select('.y.axis').selectAll('.tick').style('cursor', 'pointer').on('click', function (d) {
	        var csv2 = _this.raw_data.filter(function (di) {
	            return di[_this.config.id_col] === d;
	        });
	        _this.chart2.wrap.style('display', 'block');
	        _this.chart2.draw(csv2);
	        _this.chart2.wrap.select('#backButton').append('strong').attr('class', 'id-title').style('margin-left', '1%').text('Participant: ' + d);

	        //Sort listing by sequence.
	        var seq_col = context.config.initialSettings.seq_col;
	        var tableData = _this.superRaw.filter(function (di) {
	            return di[_this.config.id_col] === d;
	        }).sort(function (a, b) {
	            return +a[seq_col] < b[seq_col] ? -1 : 1;
	        });

	        //Define listing columns.
	        _this.table.config.cols = d3.set(d3.merge([Object.keys(context.config.initialSettings).filter(function (di) {
	            return di.match(/_col(?!s)/) && context.config.initialSettings[di];
	        }).map(function (di) {
	            return context.config.initialSettings[di];
	        }), context.config.detail_cols])).values().filter(function (di) {
	            return [context.config.id_col].indexOf(di) === -1;
	        });
	        _this.table.draw(tableData);
	        _this.table.wrap.selectAll('th,td').style({ 'text-align': 'left',
	            'padding-right': '10px' });

	        //Hide timelines.
	        _this.wrap.style('display', 'none');
	        _this.controls.wrap.style('display', 'none');
	    });

	    /**-------------------------------------------------------------------------------------------\
	      Second chart callbacks.
	    \-------------------------------------------------------------------------------------------**/

	    this.chart2.on('datatransform', function () {
	        //Define color scale.
	        this.config.color_dom = context.colorScale.domain();
	    });

	    this.chart2.on('draw', function () {
	        //Sync x-axis domain of second chart with that of the original chart.
	        this.x_dom = context.x_dom;
	    });

	    this.chart2.on('resize', function () {
	        //Sync legend and mark colors.
	        syncColors(this);

	        //Add serious adverse event legend item.
	        addSeriousLegendItem(this);
	    });
	}

	/*------------------------------------------------------------------------------------------------\
	  Add assign method to Object if nonexistent.
	\------------------------------------------------------------------------------------------------*/

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

	function aeTimeline(element, settings$$) {
	  //Merge default settings with custom settings.
	  var mergedSettings = Object.assign({}, settings, settings$$);

	  //Sync properties within settings object.
	  var syncedSettings = syncSettings(mergedSettings);

	  //Sync control inputs with settings object.
	  var syncedControlInputs = syncControlInputs(controlInputs, syncedSettings);

	  //Merge default secondary settings with custom settings.
	  var mergedSecondSettings = Object.assign({}, secondSettings, settings$$);

	  //Sync properties within secondary settings object.
	  var syncedSecondSettings = syncSecondSettings(mergedSecondSettings);

	  //Create controls.
	  var controls = webcharts.createControls(element, { location: 'top', inputs: syncedControlInputs });

	  //Create chart.
	  var chart = webcharts.createChart(element, syncedSettings, controls);
	  chart.config.initialSettings = mergedSettings;
	  chart.on('init', onInit);
	  chart.on('layout', onLayout);
	  chart.on('datatransform', onDataTransform);
	  chart.on('draw', onDraw);
	  chart.on('resize', onResize);

	  //Create participant-level chart.
	  var chart2 = webcharts.createChart(element, mergedSecondSettings).init([]);
	  chart2.config.initialSettings = mergedSecondSettings;
	  chart2.wrap.style('display', 'none');
	  chart.chart2 = chart2;

	  //Create participant-level listing.
	  var table = webcharts.createTable(element, {}).init([]);
	  chart.table = table;

	  return chart;
	}

	var ReactAETimelines = function (_React$Component) {
		inherits(ReactAETimelines, _React$Component);

		function ReactAETimelines(props) {
			classCallCheck(this, ReactAETimelines);

			var _this = possibleConstructorReturn(this, (ReactAETimelines.__proto__ || Object.getPrototypeOf(ReactAETimelines)).call(this, props));

			_this.state = {};
			return _this;
		}

		createClass(ReactAETimelines, [{
			key: 'componentDidMount',
			value: function componentDidMount(prevProps, prevState) {
				if (this.props.data.length) {
					//manually clear div and redraw
					d3$1.select('.chart-div.id-' + this.props.id).selectAll('*').remove();
					var chart = aeTimeline('.chart-div.id-' + this.props.id, this.props.settings).init(this.props.data);
				}
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate(prevProps, prevState) {
				if (this.props.data.length) {
					//manually clear div and redraw
					d3$1.select('.chart-div.id-' + this.props.id).selectAll('*').remove();
					var chart = aeTimeline('.chart-div.id-' + this.props.id, this.props.settings).init(this.props.data);
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
	}(React.Component);

	ReactAETimelines.defaultProps = { data: [], controlInputs: [], id: 'id' };

	function describeCode(props) {
	  var settings = this.createSettings(props);
	  var code = '// uses d3 v.' + d3$1.version + '\n// uses webcharts v.' + webcharts.version + '\n// uses ae-timelines v.1.2.1\n\nvar settings = ' + JSON.stringify(settings, null, 2) + ';\n\nvar myChart = aeTimelines(dataElement, settings);\n\nd3.csv(dataPath, function(error, csv) {\n  myChart.init(csv);\n});\n';
	  return code;
	}

	var Renderer = function (_React$Component) {
	  inherits(Renderer, _React$Component);

	  function Renderer(props) {
	    classCallCheck(this, Renderer);

	    var _this = possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).call(this, props));

	    _this.binding = binding;
	    _this.describeCode = describeCode.bind(_this);
	    _this.state = { data: [], settings: {}, template: {}, loadMsg: 'Loading...' };
	    return _this;
	  }

	  createClass(Renderer, [{
	    key: 'createSettings',
	    value: function createSettings(props) {
	      // set placeholders for anything the user can change
	      var shell = settings;

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

	      return syncSettings(shell);
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
	}(React.Component);

	return Renderer;

}));