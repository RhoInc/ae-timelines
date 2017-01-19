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
    { id_col: 'USUBJID',
        seq_col: 'AESEQ',
        stdy_col: 'ASTDY',
        endy_col: 'AENDY',
        term_col: 'AETERM',
        color_by: 'AESEV',
        color_by_values: ['MILD', 'MODERATE', 'SEVERE'],
        highlight: { value_col: 'AESER',
            label: 'Serious Event',
            value: 'Y',
            detail_col: null },
        custom_marks: [{ type: 'line',
            per: null // set in syncSettings()
            , values: null // set in syncSettings()
            , tooltip: null // set in syncSettings()
            , attributes: { 'stroke': 'black',
                'stroke-width': 2 } }, { type: 'circle',
            per: null // set in syncSettings()
            , values: null // set in syncSettings()
            , tooltip: null // set in syncSettings()
            , attributes: { 'fill': 'none',
                'stroke': 'black',
                'stroke-width': 2 } }],
        filters: null,
        details: null

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
                'stroke-opacity': .5 } }],
        legend: { location: 'top',
            label: 'Severity/Intensity' },
        colors: ['#66bd63', '#fdae61', '#d73027'],
        date_format: '%Y-%m-%d',
        y_behavior: 'flex',
        gridlines: 'y',
        no_text_size: false,
        range_band: 15,
        margin: { top: 50 } // for second x-axis
        , resizable: true
    };

    function syncSettings(preSettings) {
        const nextSettings = Object.create(preSettings);

        nextSettings.y.column = nextSettings.id_col;

        //Lines (AE duration)
        nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
        nextSettings.marks[0].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

        //Circles (AE start day)
        nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
        nextSettings.marks[1].tooltip = `Verbatim Term: [${ nextSettings.term_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;
        nextSettings.marks[1].values = { wc_category: [nextSettings.stdy_col] };

        //Add custom marks to marks array.
        nextSettings.custom_marks.forEach(custom_mark => {

            //Classify custom marks to avoid re-coloring in onResize() with syncColors().
            if (custom_mark.attributes) custom_mark.attributes.class = 'highlight';else custom_mark.attributes = { 'class': 'highlight' };

            //Lines (highlighted event duration)
            if (custom_mark.type === 'line') {
                custom_mark.per = custom_mark.per || [nextSettings.id_col, nextSettings.seq_col];
                custom_mark.tooltip = custom_mark.tooltip || `${ nextSettings.highlight.label }: [${ nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

                if (!custom_mark.values) {
                    custom_mark.values = {};
                    custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                }
            }
            //Circles (highlighted event start day)
            else if (custom_mark.type === 'circle') {
                    custom_mark.per = custom_mark.per || [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
                    custom_mark.tooltip = custom_mark.tooltip || `${ nextSettings.highlight.label }: [${ nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

                    if (!custom_mark.values) {
                        custom_mark.values = { 'wc_category': nextSettings.stdy_col };
                        custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                    }
                }

            nextSettings.marks.push(custom_mark);
        });

        //Define legend order.
        nextSettings.legend.order = nextSettings.color_by_values;

        //Default filters
        if (!nextSettings.filters || nextSettings.filters.length === 0) nextSettings.filters = [{ value_col: nextSettings.highlight.value_col, label: nextSettings.highlight.label }, { value_col: nextSettings.color_by, label: nextSettings.legend.label }, { value_col: nextSettings.id_col, label: 'Subject Identifier' }];

        //Default detail listing columns
        const defaultDetails = [{ 'value_col': nextSettings.seq_col, label: 'Sequence Number' }, { 'value_col': nextSettings.stdy_col, label: 'Start Day' }, { 'value_col': nextSettings.endy_col, label: 'Stop Day' }, { 'value_col': nextSettings.term_col, label: 'Reported Term' }];

        //Add settings.color_by to default details.
        if (nextSettings.color_by) defaultDetails.push({ 'value_col': nextSettings.color_by,
            'label': nextSettings.legend ? nextSettings.legend.label || nextSettings.color_by : nextSettings.color_by });

        //Add settings.highlight.value_col and settings.highlight.detail_col to default details.
        if (nextSettings.highlight) {
            defaultDetails.push({ 'value_col': nextSettings.highlight.value_col,
                'label': nextSettings.highlight.label });

            if (nextSettings.highlight.detail_col) defaultDetails.push({ 'value_col': nextSettings.highlight.detail_col,
                'label': nextSettings.highlight.label + ' Details' });
        }

        //Add settings.filters columns to default details.
        nextSettings.filters.forEach(filter => defaultDetails.push({ 'value_col': filter.value_col,
            'label': filter.label }));

        //Redefine settings.details with defaults.
        if (!nextSettings.details) nextSettings.details = defaultDetails;else {
            //Allow user to specify an array of columns or an array of objects with a column property
            //and optionally a column label.
            nextSettings.details = nextSettings.details.map(d => {
                return {
                    value_col: d.value_col ? d.value_col : d,
                    label: d.label ? d.label : d.value_col ? d.value_col : d };
            });

            //Add default details to settings.details.
            defaultDetails.reverse().forEach(defaultDetail => nextSettings.details.unshift(defaultDetail));
        }

        return nextSettings;
    }

    const controlInputs = [{ type: 'dropdown', option: 'y.sort', label: 'Sort Subject IDs', values: ['earliest', 'alphabetical-descending'], require: true }];

    function syncControlInputs(preControlInputs, preSettings) {
        preSettings.filters.reverse().forEach((d, i) => {
            const thisFilter = { type: 'subsetter',
                value_col: d.value_col ? d.value_col : d,
                label: d.label ? d.label : d.value_col ? d.value_col : d };
            preControlInputs.unshift(thisFilter);
            preSettings.details.push({ value_col: d.value_col ? d.value_col : d,
                label: d.label ? d.label : d.value_col ? d.value_col : d });
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

        //Add custom marks to marks array.
        nextSettings.custom_marks.forEach(custom_mark => {

            //Classify custom marks to avoid re-coloring in onResize() with syncColors().
            if (custom_mark.attributes) custom_mark.attributes.class = 'highlight';else custom_mark.attributes = { 'class': 'highlight' };

            //Lines (highlighted event duration)
            if (custom_mark.type === 'line') {
                custom_mark.per = custom_mark.per || [nextSettings.seq_col];
                custom_mark.tooltip = custom_mark.tooltip || `${ nextSettings.highlight.label }: [${ nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

                if (!custom_mark.values) {
                    custom_mark.values = {};
                    custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                }
            }
            //Circles (highlighted event start day)
            else if (custom_mark.type === 'circle') {
                    custom_mark.per = custom_mark.per || [nextSettings.seq_col, 'wc_value'];
                    custom_mark.tooltip = custom_mark.tooltip || `${ nextSettings.highlight.label }: [${ nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col }]` + `\nStart Day: [${ nextSettings.stdy_col }]` + `\nStop Day: [${ nextSettings.endy_col }]`;

                    if (!custom_mark.values) {
                        custom_mark.values = { 'wc_category': nextSettings.stdy_col };
                        custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                    }
                }

            nextSettings.marks.push(custom_mark);
        });

        //Define legend order.
        nextSettings.legend.order = nextSettings.color_by_values;

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
        //Count total number of IDs for population count.
        this.populationCount = d3.set(this.raw_data.map(d => d[this.config.id_col])).values().length;

        //Remove non-AE records.
        this.superRaw = this.raw_data.filter(d => /[^\s]/.test(d[this.config.term_col]));

        //Set empty settings.color_by values to 'N/A'.
        this.superRaw.forEach(d => d[this.config.color_by] = /[^\s]/.test(d[this.config.color_by]) ? d[this.config.color_by] : 'N/A');

        //Append unspecified settings.color_by values to settings.legend.order and define a shade of
        //gray for each.
        const color_by_values = d3.set(this.superRaw.map(d => d[this.config.color_by])).values();
        color_by_values.forEach((color_by_value, i) => {
            let increment = 25;

            if (this.config.legend.order.indexOf(color_by_value) === -1) {
                this.config.legend.order.push(color_by_value);
                this.chart2.config.legend.order.push(color_by_value);

                this.config.colors.push(`rgb(${ increment },${ increment },${ increment })`);
                this.chart2.config.colors.push(`rgb(${ increment },${ increment },${ increment })`);

                increment += 25;
            }
        });

        //Derived data manipulation
        this.raw_data = lengthenRaw(this.superRaw, [this.config.stdy_col, this.config.endy_col]);
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
        //count the number of unique ids in the current chart and calculate the percentage
        const filtered_data = chart.raw_data.filter(d => {
            let filtered = d[chart.config.initialSettings.seq_col] === '';
            chart.filters.forEach(di => {
                if (filtered === false && di.val !== 'All') filtered = Object.prototype.toString.call(di.val) === '[object Array]' ? di.val.indexOf(d[di.col]) === -1 : di.val !== d[di.col];
            });
            return !filtered;
        });
        const currentObs = d3.set(filtered_data.map(d => d[id_col])).values().length;

        const percentage = d3.format('0.1%')(currentObs / chart.populationCount);

        //clear the annotation
        let annotation = d3.select(selector);
        annotation.selectAll('*').remove();

        //update the annotation
        const units = id_unit ? ' ' + id_unit : ' participant(s)';
        annotation.text(currentObs + ' of ' + chart.populationCount + units + ' shown (' + percentage + ')');
    }

    function onDraw() {
        //Annotate number of selected participants out of total participants.
        updateSubjectCount(this, this.config.id_col, '.annote', 'subject ID(s)');

        //Sort y-axis based on `Sort IDs` control selection.
        const yAxisSort = this.controls.wrap.selectAll('.control-group').filter(d => d.option && d.option === 'y.sort').select('option:checked').text();

        if (yAxisSort === 'earliest') {
            //Redefine filtered data as it defaults to the final mark drawn, which might be filtered in
            //addition to the current filter selections.
            const filtered_data = this.raw_data.filter(d => {
                let filtered = d[this.config.seq_col] === '';
                this.filters.forEach(di => {
                    if (filtered === false && di.val !== 'All') filtered = Object.prototype.toString.call(di.val) === '[object Array]' ? di.val.indexOf(d[di.col]) === -1 : di.val !== d[di.col];
                });
                return !filtered;
            });

            //Capture all subject IDs with adverse events with a start day.
            const withStartDay = d3.nest().key(d => d[this.config.id_col]).rollup(d => d3.min(d, di => +di[this.config.stdy_col])).entries(filtered_data.filter(d => !isNaN(parseFloat(d[this.config.stdy_col])) && isFinite(d[this.config.stdy_col]))).sort((a, b) => a.values > b.values ? -2 : a.values < b.values ? 2 : a.key > b.key ? -1 : 1).map(d => d.key);

            //Capture all subject IDs with adverse events without a start day.
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
            d3.select(this).select('.legend-mark').style('stroke', chart.config.colors[chart.config.legend.order.indexOf(d.label)]).style('stroke-width', '25%');
        });

        //Recolor circles.
        let circles = chart.svg.selectAll('circle.wc-data-mark:not(.highlight)');
        circles.each(function (d, i) {
            const color_by_value = d.values.raw[0][chart.config.initialSettings.color_by];
            d3.select(this).style('stroke', chart.config.colors[chart.config.legend.order.indexOf(color_by_value)]);
            d3.select(this).style('fill', chart.config.colors[chart.config.legend.order.indexOf(color_by_value)]);
        });

        //Recolor lines.
        let lines = chart.svg.selectAll('path.wc-data-mark:not(.highlight)');
        lines.each(function (d, i) {
            const color_by_value = d.values[0].values.raw[0][chart.config.initialSettings.color_by];
            d3.select(this).style('stroke', chart.config.colors[chart.config.legend.order.indexOf(color_by_value)]);
        });
    }

    /*------------------------------------------------------------------------------------------------\
      Add highlighted adverse event legend item.
    \------------------------------------------------------------------------------------------------*/

    function addHighlightLegendItem(chart) {
        chart.wrap.select('.legend li.highlight').remove();
        let highlightLegendItem = chart.wrap.select('.legend').append('li').attr('class', 'highlight').style({ 'list-style-type': 'none',
            'margin-right': '1em',
            'display': 'inline-block' });
        let highlightLegendColorBlock = highlightLegendItem.append('svg').attr({ width: '1.75em',
            height: '1.5em' }).style({ 'position': 'relative',
            'top': '0.35em' });
        highlightLegendColorBlock.append('circle').attr({ cx: 10,
            cy: 10,
            r: 4 }).style({ 'stroke': 'black',
            'stroke-width': 2,
            'fill': 'none' });
        highlightLegendColorBlock.append('line').attr({ x1: 2 * 3.14 * 4 - 10,
            y1: 10,
            x2: 2 * 3.14 * 4 - 5,
            y2: 10 }).style({ 'stroke': 'black',
            'stroke-width': 2,
            'shape-rendering': 'crispEdges' });
        highlightLegendItem.append('text').style('margin-left', '.35em').text(chart.config.highlight.label);
    }

    function onResize() {
        let context = this;

        //Sync legend and mark colors.
        syncColors(this);

        //Add highlight adverse event legend item.
        if (this.config.highlight) addHighlightLegendItem(this);

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
            this.table.config.cols = d3.set(this.config.details.map(detail => detail.value_col)).values();
            this.table.config.headers = d3.set(this.config.details.map(detail => detail.label)).values();
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

            //Add highlight adverse event legend item.
            if (this.config.highlight) addHighlightLegendItem(this);
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

