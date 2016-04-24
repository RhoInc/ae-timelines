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
        rel_col: 'AEREL',

        //Standard webcharts settings
        x: {
            "label": null,
            "type": "linear",
            "column": 'wc_value'
        },
        y: {
            "column": null, //set in syncSettings()
            "label": '',
            "sort": "earliest",
            "type": "ordinal",
            "behavior": 'flex'
        },
        "margin": { "top": 50 },
        "legend": {
            "mark": "circle",
            "label": 'Severity'
        },
        "marks": [{
            "per": null, //set in syncSettings()
            "tooltip": null, //set in syncSettings()
            "type": "line",
            "attributes": { 'stroke-width': 5, 'stroke-opacity': .8 }
        }, {
            "per": null, //set in syncSettings()
            "tooltip": null, //set in syncSettings()
            "type": "circle"
        }],
        "colors": ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
        "date_format": "%m/%d/%y",
        "resizable": true,
        "max_width": 1000,
        "y_behavior": 'flex',
        "gridlines": "y",
        "no_text_size": false,
        "range_band": 15,
        "color_by": null //set in syncSettings()
    };

    function syncSettings(settings) {
        settings.y.column = settings.id_col;
        settings.marks[0].per = [settings.id_col, settings.seq_col];
        settings.marks[0].tooltip = 'System Organ Class: [' + settings.soc_col + ']\nPreferred Term: [' + settings.term_col + ']\nStart Day: [' + settings.stdy_col + ']\nStop Day: [' + settings.endy_col + ']';
        settings.marks[1].per = [settings.id_col, settings.seq_col, 'wc_value'];
        settings.marks[1].tooltip = 'System Organ Class: [' + settings.soc_col + ']\nPreferred Term: [' + settings.term_col + ']\nStart Day: [' + settings.stdy_col + ']\nStop Day: [' + settings.endy_col + ']';
        settings.color_by = settings.sev_col;

        return settings;
    }

    var controlInputs = [{ label: "Severity", type: "subsetter", value_col: "AESEV", multiple: true }, { label: "System Organ Class", type: "subsetter", value_col: "AEBODSYS" }, { label: "Subject ID", type: "subsetter", value_col: "USUBJID" }, { label: "Related to Treatment", type: "subsetter", value_col: "AEREL" }, { label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true }];

    function syncControlInputs(controlInputs, settings) {
        var severityControl = controlInputs.filter(function (d) {
            return d.label == "Severity";
        })[0];
        severityControl.value_col = settings.sev_col;

        var SOCControl = controlInputs.filter(function (d) {
            return d.label == "System Organ Class";
        })[0];
        SOCControl.value_col = settings.soc_col;

        var subjectControl = controlInputs.filter(function (d) {
            return d.label == "Subject ID";
        })[0];
        subjectControl.value_col = settings.id_col;

        var relatedControl = controlInputs.filter(function (d) {
            return d.label == "Related to Treatment";
        })[0];
        relatedControl.value_col = settings.rel_col;

        return controlInputs;
    }

    //Setting for custom details view
    var secondSettings = {
        "x": { label: '', "type": "linear", "column": "wc_value" },
        "y": { label: '', "sort": "alphabetical-descending", "type": "ordinal", "column": "AESEQ" },
        "marks": [{ "type": "line", "per": ["AESEQ"], attributes: { 'stroke-width': 5, 'stroke-opacity': .8 } }, { "type": "circle", "per": ["AESEQ", "wc_value"] }],
        color_by: "AESEV",
        colors: ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
        "legend": {
            "mark": "circle",
            "label": 'Severity'
        },
        "date_format": "%d%b%Y:%X",
        // "resizable":false,
        transitions: false,
        "max_width": 1000,
        // point_size: 3,
        "gridlines": "y",
        "no_text_size": false,
        "range_band": 28
    };

    function syncSecondSettings(secondSettings, settings) {
        secondSettings.y.column = settings.seq_col;
        secondSettings.marks[0].per[0] = settings.seq_col;
        secondSettings.marks[1].per[0] = settings.seq_col;
        secondSettings.color_by = settings.sev_col;
        secondSettings.color_dom = settings.legend ? secondSettings.legend.order : null;

        return secondSettings;
    }

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

    function onResize() {
        var _this2 = this;

        var chart = this;
        this.chart2.on('datatransform', function () {
            //make sure color scales stay consistent
            this.config.color_dom = chart.colorScale.domain();
        });
        this.chart2.x_dom = this.x_dom;
        this.svg.select('.y.axis').selectAll('.tick').style('cursor', 'pointer').on('click', function (d) {
            var csv2 = _this2.raw_data.filter(function (f) {
                return f[_this2.config.id_col] === d;
            });
            _this2.chart2.wrap.style('display', 'block');
            _this2.chart2.draw(csv2);
            _this2.chart2.wrap.insert('h4', 'svg').attr('class', 'id-title').text(d);
            //force legend to be drawn
            _this2.chart2.makeLegend(_this2.colorScale);

            var tableData = _this2.superRaw.filter(function (f) {
                return f[_this2.config.id_col] === d;
            });
            //set cols for table, otherwise can get mismatched
            _this2.table.config.cols = Object.keys(tableData[0]);
            _this2.table.draw(tableData);
            _this2.wrap.style('display', 'none');
            _this2.controls.wrap.style('display', 'none');
        });

        var x2Axis = d3.svg.axis().scale(this.x).orient('top').tickFormat(this.xAxis.tickFormat()).innerTickSize(this.xAxis.innerTickSize()).outerTickSize(this.xAxis.outerTickSize()).ticks(this.xAxis.ticks()[0]);

        var g_x2_axis = this.svg.select("g.x2.axis").attr("class", "x2 axis linear");

        g_x2_axis.call(x2Axis);

        g_x2_axis.select("text.axis-title.top").attr("transform", "translate(" + this.raw_width / 2 + ",-" + this.config.margin.top + ")");

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

    function aeTimeline(element, settings$$) {
        //merge user's settings with defaults
        var mergedSettings = Object.assign({}, settings, settings$$);

        //keep settings in sync with the data mappings
        mergedSettings = syncSettings(mergedSettings);

        //keep settings for secondary chart in sync
        var mergedSecondSettings = Object.assign({}, secondSettings, settings$$);
        mergedSecondSettings = syncSecondSettings(mergedSecondSettings, mergedSettings);

        //keep control inputs settings in sync
        var syncedControlInputs = syncControlInputs(controlInputs, mergedSettings);

        //create controls now
        var controls = webcharts.createControls(element, { location: 'top', inputs: syncedControlInputs });

        //create chart
        var chart = webcharts.createChart(element, mergedSettings, controls);
        chart.on('init', onInit);
        chart.on('layout', onLayout);
        chart.on('datatransform', onDataTransform);
        chart.on('draw', onDraw);
        chart.on('resize', onResize);

        //set up secondary chart and table
        var chart2 = webcharts.createChart(element, mergedSecondSettings).init([]);
        chart2.wrap.style('display', 'none');
        chart.chart2 = chart2;
        var table = webcharts.createTable(element, {}).init([]);
        chart.table = table;

        return chart;
    }

    return aeTimeline;
})(webCharts, d3);

