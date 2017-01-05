var aeTimelines = function (webcharts, d3$1) {
    'use strict';

    /*------------------------------------------------------------------------------------------------\
      Clone a variable (http://stackoverflow.com/a/728694).
    \------------------------------------------------------------------------------------------------*/

    function clone(obj) {
        var copy;

        //Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

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

    const settings =

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
        const nextSettings = Object.create(preSettings);

        if (!nextSettings.filters || nextSettings.filters.length === 0) nextSettings.filters = [{ value_col: nextSettings.ser_col, label: 'Serious Event' }, { value_col: nextSettings.sev_col, label: 'Severity/Intensity' }, { value_col: nextSettings.id_col, label: 'Participant ID' }];

        nextSettings.y.column = nextSettings.id_col;

        //Lines (AE duration)
        nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
        nextSettings.marks[0].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

        //Circles (AE start day)
        nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
        nextSettings.marks[1].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
        nextSettings.marks[1].values = { wc_category: [nextSettings.stdy_col] };

        //Lines (SAE duration)
        nextSettings.marks[2].per = [nextSettings.id_col, nextSettings.seq_col];
        nextSettings.marks[2].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
        nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

        //Circles (SAE start day)
        nextSettings.marks[3].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
        nextSettings.marks[3].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
        nextSettings.marks[3].values = { wc_category: [nextSettings.stdy_col] };
        nextSettings.marks[3].values[nextSettings.ser_col] = ['Yes', 'Y'];

        nextSettings.legend.order = nextSettings.sev_vals;

        nextSettings.color_by = nextSettings.sev_col;

        return nextSettings;
    }

    const controlInputs = [{ type: 'dropdown', option: 'y.sort', label: 'Sort IDs', values: ['earliest', 'alphabetical-descending'], require: true }];

    function syncControlInputs(preControlInputs, preSettings) {
        preSettings.filters.reverse().forEach((d, i) => {
            const thisFilter = { type: 'subsetter',
                value_col: d.value_col ? d.value_col : d,
                label: d.label ? d.label : d.value_col ? d.value_col : d };
            preControlInputs.unshift(thisFilter);
            preSettings.detail_cols.push(d.value_col ? d.value_col : d);
        });

        return preControlInputs;
    }

    //Setting for custom details view
    let cloneSettings = clone(settings);
    cloneSettings.y.sort = 'alphabetical-descending';
    cloneSettings.transitions = false;
    cloneSettings.range_band = settings.range_band * 2;
    cloneSettings.margin = null;
    const secondSettings = cloneSettings;

    function syncSecondSettings(preSettings) {
        const nextSettings = Object.create(preSettings);

        nextSettings.y.column = nextSettings.seq_col;

        //Lines (AE duration)
        nextSettings.marks[0].per = [nextSettings.seq_col];
        nextSettings.marks[0].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

        //Circles (AE start day)
        nextSettings.marks[1].per = [nextSettings.seq_col, 'wc_value'];
        nextSettings.marks[1].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
        nextSettings.marks[1].values = { wc_category: [nextSettings.stdy_col] };

        //Lines (SAE duration)
        nextSettings.marks[2].per = [nextSettings.seq_col];
        nextSettings.marks[2].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
        nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

        //Circles (SAE start day)
        nextSettings.marks[3].per = [nextSettings.seq_col, 'wc_value'];
        nextSettings.marks[3].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
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
        let my_data = [];

        data.forEach(d => {
            columns.forEach(column => {
                let obj = Object.assign({}, d);
                obj.wc_category = column;
                obj.wc_value = d[column];
                my_data.push(obj);
            });
        });

        return my_data;
    }

    function onInit() {
        //Raw data manipulation
        this.superRaw = this.raw_data;
        this.superRaw.forEach(d => {});

        //Derived data manipulation
        this.raw_data = lengthenRaw(this.raw_data, [this.config.stdy_col, this.config.endy_col]);
        this.raw_data.forEach(d => {
            d.wc_value = d.wc_value ? +d.wc_value : NaN;
        });

        //Create div for back button and participant ID title.
        this.chart2.wrap.insert('div', ':first-child').attr('id', 'backButton').insert('button', '.legend').html('&#8592; Back').style('cursor', 'pointer').on('click', () => {
            this.wrap.style('display', 'block');
            this.table.draw([]);
            this.chart2.wrap.style('display', 'none');
            this.chart2.wrap.select('.id-title').remove();
            this.controls.wrap.style('display', 'block');
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
        const totalObs = d3.set(chart.raw_data.map(d => d[id_col])).values().length;

        //count the number of unique ids in the current chart and calculate the percentage
        const filtered_data = chart.raw_data.filter(d => {
            let filtered = d[chart.config.initialSettings.seq_col] === '';
            chart.filters.forEach(di => {
                if (filtered === false && di.val !== 'All') filtered = Object.prototype.toString.call(di.val) === '[object Array]' ? di.val.indexOf(d[di.col]) === -1 : di.val !== d[di.col];
            });
            return !filtered;
        });
        const currentObs = d3.set(filtered_data.map(d => d[id_col])).values().length;

        const percentage = d3.format('0.1%')(currentObs / totalObs);

        //clear the annotation
        let annotation = d3.select(selector);
        annotation.selectAll('*').remove();

        //update the annotation
        const units = id_unit ? ' ' + id_unit : ' participant(s)';
        annotation.text(currentObs + ' of ' + totalObs + units + ' shown (' + percentage + ')');
    }

    function onDraw() {
        //Annotate number of selected participants out of total participants.
        updateSubjectCount(this, this.config.id_col, '.annote');

        //Sort y-axis based on `Sort IDs` control selection.
        const yAxisSort = this.controls.wrap.selectAll('.control-group').filter(function (d) {
            return d.label === 'Sort IDs';
        }).selectAll('option:checked').text();
        if (yAxisSort === 'earliest') {
            const filtered_data = this.raw_data.filter(d => {
                let filtered = d[this.config.seq_col] === '';
                this.filters.forEach(di => {
                    if (filtered === false && di.val !== 'All') filtered = Object.prototype.toString.call(di.val) === '[object Array]' ? di.val.indexOf(d[di.col]) === -1 : di.val !== d[di.col];
                });
                return !filtered;
            });
            const withStartDay = d3.nest().key(d => d[this.config.id_col]).rollup(d => d3.min(d, di => +di[this.config.stdy_col])).entries(filtered_data.filter(d => !isNaN(parseFloat(d[this.config.stdy_col])) && isFinite(d[this.config.stdy_col]))).sort((a, b) => a.values > b.values ? -2 : a.values < b.values ? 2 : a.key > b.key ? -1 : 1).map(d => d.key);
            const withoutStartDay = d3.set(filtered_data.filter(d => +d[this.config.seq_col] > 0 && (isNaN(parseFloat(d[this.config.stdy_col])) || !isFinite(d[this.config.stdy_col])) && withStartDay.indexOf(d[this.config.id_col]) === -1).map(d => d[this.config.id_col])).values();
            this.y_dom = withStartDay.concat(withoutStartDay);
        } else this.y_dom = this.y_dom.sort(d3.descending);
    }

    /*------------------------------------------------------------------------------------------------\
      Sync colors of legend marks and chart marks.
    \------------------------------------------------------------------------------------------------*/

    function syncColors(chart) {
        //Recolor legend.
        let legendItems = chart.wrap.selectAll('.legend-item');
        legendItems.each(function (d, i) {
            d3.select(this).select('.legend-mark').style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(d.label)]).style('stroke-width', '25%');
        });

        //Recolor circles.
        let circles = chart.svg.selectAll('circle.wc-data-mark:not(.serious)');
        circles.each(function (d, i) {
            const sev_val = d.values.raw[0][chart.config.initialSettings.sev_col];
            d3.select(this).style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
            d3.select(this).style('fill', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
        });

        //Recolor lines.
        let lines = chart.svg.selectAll('path.wc-data-mark:not(.serious)');
        lines.each(function (d, i) {
            const sev_val = d.values[0].values.raw[0][chart.config.initialSettings.sev_col];
            d3.select(this).style('stroke', chart.config.colors[chart.config.sev_vals.indexOf(sev_val)]);
        });
    }

    /*------------------------------------------------------------------------------------------------\
      Add serious adverse event legend item.
    \------------------------------------------------------------------------------------------------*/

    function addSeriousLegendItem(chart) {
        chart.wrap.select('.legend li.serious').remove();
        let seriousLegendItem = chart.wrap.select('.legend').append('li').attr('class', 'serious').style({ 'list-style-type': 'none',
            'margin-right': '1em',
            'display': 'inline-block' });
        let seriousLegendColorBlock = seriousLegendItem.append('svg').attr({ width: '1.75em',
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
        let context = this;

        //Sync legend and mark colors.
        syncColors(this);

        //Add serious adverse event legend item.
        addSeriousLegendItem(this);

        //Draw second x-axis at top of chart.
        let x2Axis = d3$1.svg.axis().scale(this.x).orient('top').tickFormat(this.xAxis.tickFormat()).innerTickSize(this.xAxis.innerTickSize()).outerTickSize(this.xAxis.outerTickSize()).ticks(this.xAxis.ticks()[0]);
        let g_x2_axis = this.svg.select('g.x2.axis').attr('class', 'x2 axis linear');
        g_x2_axis.call(x2Axis);
        g_x2_axis.select('text.axis-title.top').attr('transform', 'translate(' + this.raw_width / 2 + ',-' + this.config.margin.top + ')');
        g_x2_axis.select('.domain').attr({ 'fill': 'none',
            'stroke': '#ccc',
            'shape-rendering': 'crispEdges' });
        g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');

        //Draw second chart when y-axis tick label is clicked.
        this.svg.select('.y.axis').selectAll('.tick').style('cursor', 'pointer').on('click', d => {
            let csv2 = this.raw_data.filter(di => di[this.config.id_col] === d);
            this.chart2.wrap.style('display', 'block');
            this.chart2.draw(csv2);
            this.chart2.wrap.select('#backButton').append('strong').attr('class', 'id-title').style('margin-left', '1%').text('Participant: ' + d);

            //Sort listing by sequence.
            const seq_col = context.config.initialSettings.seq_col;
            let tableData = this.superRaw.filter(di => di[this.config.id_col] === d).sort((a, b) => +a[seq_col] < b[seq_col] ? -1 : 1);

            //Define listing columns.
            this.table.config.cols = d3.set(d3.merge([Object.keys(context.config.initialSettings).filter(di => di.match(/_col(?!s)/) && context.config.initialSettings[di]).map(di => context.config.initialSettings[di]), context.config.detail_cols])).values().filter(di => [context.config.id_col].indexOf(di) === -1);
            this.table.draw(tableData);
            this.table.wrap.selectAll('th,td').style({ 'text-align': 'left',
                'padding-right': '10px' });

            //Hide timelines.
            this.wrap.style('display', 'none');
            this.controls.wrap.style('display', 'none');
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
        const mergedSettings = Object.assign({}, settings, settings$$);

        //Sync properties within settings object.
        const syncedSettings = syncSettings(mergedSettings);

        //Sync control inputs with settings object.
        const syncedControlInputs = syncControlInputs(controlInputs, syncedSettings);

        //Merge default secondary settings with custom settings.
        const mergedSecondSettings = Object.assign({}, secondSettings, settings$$);

        //Sync properties within secondary settings object.
        const syncedSecondSettings = syncSecondSettings(mergedSecondSettings);

        //Create controls.
        const controls = webcharts.createControls(element, { location: 'top', inputs: syncedControlInputs });

        //Create chart.
        const chart = webcharts.createChart(element, syncedSettings, controls);
        chart.config.initialSettings = mergedSettings;
        chart.on('init', onInit);
        chart.on('layout', onLayout);
        chart.on('datatransform', onDataTransform);
        chart.on('draw', onDraw);
        chart.on('resize', onResize);

        //Create participant-level chart.
        const chart2 = webcharts.createChart(element, mergedSecondSettings).init([]);
        chart2.config.initialSettings = mergedSecondSettings;
        chart2.wrap.style('display', 'none');
        chart.chart2 = chart2;

        //Create participant-level listing.
        const table = webcharts.createTable(element, {}).init([]);
        chart.table = table;

        return chart;
    }

    return aeTimeline;
}(webCharts, d3);

