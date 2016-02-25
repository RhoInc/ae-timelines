'use strict';

var aeTimelines = (function (webcharts, d3) {
    'use strict';

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

        var x2 = this.svg.append("g").attr("class", "x2 axis linear");
        x2.append("text").attr("class", "axis-title top").attr("dy", "2em").attr("text-anchor", "middle").text(this.config.x_label);
    }

    function onDataTransform() {}

    function onDraw() {}

    function severityColor(chart) {
        var colors = chart.config.colors;
        chart.svg.selectAll('.wc-data-mark').attr('stroke', function (d) {
            var ae = d.values;
            var severity = ae.raw ? ae.raw[0].AESEV : ae[0].values.raw[0].AESEV;

            if (severity === 'Grade 1') {
                return colors[0];
            } else if (severity === 'Grade 2') {
                return colors[1];
            } else if (severity === 'Grade 3') {
                return colors[2];
            }
        });
    }

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

        var g_x2_axis = this.svg.select("g.x2.axis").attr("class", "x2 axis linear");
        // .attr("transform", "translate(0,-10)");

        g_x2_axis.call(x2Axis);

        g_x2_axis.select("text.axis-title.top").attr("transform", "translate(" + this.raw_width / 2 + ",-" + this.config.margin.top + ")");

        g_x2_axis.select('.domain').attr({
            'fill': 'none',
            'stroke': '#ccc',
            'shape-rendering': 'crispEdges'
        });
        g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');

        //Re-color AE severity
        var severityChart = this;
        severityColor(severityChart);

        this.chart2.on('resize', function () {
            var severityChart = this;
            severityColor(severityChart);
        });
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

    return outlierExplorer;
})(webCharts, d3);

