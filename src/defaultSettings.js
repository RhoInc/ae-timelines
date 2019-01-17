import clone from './util/clone';

export const rendererSpecificSettings = {
    id_col: 'USUBJID',
    seq_col: 'AESEQ',
    stdy_col: 'ASTDY',
    endy_col: 'AENDY',
    term_col: 'AETERM',

    color: {
        value_col: 'AESEV',
        label: 'Severity/Intensity',
        values: ['MILD', 'MODERATE', 'SEVERE'],
        colors: [
            '#66bd63', // mild
            '#fdae61', // moderate
            '#d73027', // severe
            '#377eb8',
            '#984ea3',
            '#ff7f00',
            '#a65628',
            '#f781bf'
        ]
    },

    highlight: {
        value_col: 'AESER',
        label: 'Serious Event',
        value: 'Y',
        detail_col: null,
        attributes: {
            stroke: 'black',
            'stroke-width': '2',
            fill: 'none'
        }
    },

    filters: null,
    details: null,
    custom_marks: null
};

export const webchartsSettings = {
    x: {
        column: 'wc_value',
        type: 'linear',
        label: null
    },
    y: {
        column: null, // set in syncSettings()
        type: 'ordinal',
        label: '',
        sort: 'earliest',
        behavior: 'flex'
    },
    marks: [
        {
            type: 'line',
            per: null, // set in syncSettings()
            tooltip: null, // set in syncSettings()
            attributes: {
                'stroke-width': 5,
                'stroke-opacity': 0.5
            }
        },
        {
            type: 'circle',
            per: null, // set in syncSettings()
            tooltip: null, // set in syncSettings()
            attributes: {
                'fill-opacity': 0.5,
                'stroke-opacity': 0.5
            }
        }
    ],
    legend: { location: 'top', mark: 'circle' },
    gridlines: 'y',
    range_band: 15,
    margin: { top: 50 }, // for second x-axis
    resizable: true
};

export default Object.assign({}, rendererSpecificSettings, webchartsSettings);

export function syncSettings(preSettings) {
    const nextSettings = clone(preSettings);

    nextSettings.y.column = nextSettings.id_col;

    //Lines (AE duration)
    nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[0].tooltip =
        `Reported Term: [${nextSettings.term_col}]` +
        `\nStart Day: [${nextSettings.stdy_col}]` +
        `\nStop Day: [${nextSettings.endy_col}]`;

    //Circles (AE start day)
    nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip =
        `Reported Term: [${nextSettings.term_col}]` +
        `\nStart Day: [${nextSettings.stdy_col}]` +
        `\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[1].values = { wc_category: [nextSettings.stdy_col] };

    //Define highlight marks.
    if (nextSettings.highlight) {
        //Lines (highlighted event duration)
        let highlightLine = {
            type: 'line',
            per: [nextSettings.id_col, nextSettings.seq_col],
            tooltip:
                `Reported Term: [${nextSettings.term_col}]` +
                `\nStart Day: [${nextSettings.stdy_col}]` +
                `\nStop Day: [${nextSettings.endy_col}]` +
                `\n${nextSettings.highlight.label}: [${
                    nextSettings.highlight.detail_col
                        ? nextSettings.highlight.detail_col
                        : nextSettings.highlight.value_col
                }]`,
            values: {},
            attributes: nextSettings.highlight.attributes || {}
        };
        highlightLine.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
        highlightLine.attributes.class = 'highlight';
        nextSettings.marks.push(highlightLine);

        //Circles (highlighted event start day)
        let highlightCircle = {
            type: 'circle',
            per: [nextSettings.id_col, nextSettings.seq_col, 'wc_value'],
            tooltip:
                `Reported Term: [${nextSettings.term_col}]` +
                `\nStart Day: [${nextSettings.stdy_col}]` +
                `\nStop Day: [${nextSettings.endy_col}]` +
                `\n${nextSettings.highlight.label}: [${
                    nextSettings.highlight.detail_col
                        ? nextSettings.highlight.detail_col
                        : nextSettings.highlight.value_col
                }]`,
            values: { wc_category: nextSettings.stdy_col },
            attributes: nextSettings.highlight.attributes || {}
        };
        highlightCircle.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
        highlightCircle.attributes.class = 'highlight';
        nextSettings.marks.push(highlightCircle);
    }

    //Define mark coloring and legend.
    nextSettings.color_by = nextSettings.color.value_col;
    nextSettings.colors = nextSettings.color.colors;
    nextSettings.legend = nextSettings.legend || { location: 'top' };
    nextSettings.legend.label = nextSettings.color.label;
    nextSettings.legend.order = nextSettings.color.values;
    nextSettings.color_dom = nextSettings.color.values;

    //Default filters
    if (!nextSettings.filters || nextSettings.filters.length === 0) {
        nextSettings.filters = [
            { value_col: nextSettings.color.value_col, label: nextSettings.color.label },
            { value_col: nextSettings.id_col, label: 'Participant Identifier' }
        ];
        if (nextSettings.highlight)
            nextSettings.filters.unshift({
                value_col: nextSettings.highlight.value_col,
                label: nextSettings.highlight.label
            });
    }

    //Default detail listing columns
    const defaultDetails = [
        { value_col: nextSettings.seq_col, label: 'Sequence Number' },
        { value_col: nextSettings.stdy_col, label: 'Start Day' },
        { value_col: nextSettings.endy_col, label: 'Stop Day' },
        { value_col: nextSettings.term_col, label: 'Reported Term' }
    ];

    //Add settings.color.value_col to default details.
    defaultDetails.push({
        value_col: nextSettings.color.value_col,
        label: nextSettings.color.label
    });

    //Add settings.highlight.value_col and settings.highlight.detail_col to default details.
    if (nextSettings.highlight) {
        defaultDetails.push({
            value_col: nextSettings.highlight.value_col,
            label: nextSettings.highlight.label
        });

        if (nextSettings.highlight.detail_col)
            defaultDetails.push({
                value_col: nextSettings.highlight.detail_col,
                label: nextSettings.highlight.label + ' Details'
            });
    }

    //Add settings.filters columns to default details.
    nextSettings.filters.forEach(filter => {
        if (filter !== nextSettings.id_col && filter.value_col !== nextSettings.id_col)
            defaultDetails.push({
                value_col: filter.value_col,
                label: filter.label
            });
    });

    //Redefine settings.details with defaults.
    if (!nextSettings.details) nextSettings.details = defaultDetails;
    else {
        //Allow user to specify an array of columns or an array of objects with a column property
        //and optionally a column label.
        nextSettings.details = nextSettings.details.map(d => {
            return {
                value_col: d.value_col ? d.value_col : d,
                label: d.label ? d.label : d.value_col ? d.value_col : d
            };
        });

        //Add default details to settings.details.
        defaultDetails
            .reverse()
            .forEach(defaultDetail => nextSettings.details.unshift(defaultDetail));
    }

    //Add custom marks to marks array.
    if (nextSettings.custom_marks)
        nextSettings.custom_marks.forEach(custom_mark => {
            custom_mark.attributes = custom_mark.attributes || {};
            custom_mark.attributes.class = 'custom';
            nextSettings.marks.push(custom_mark);
        });

    return nextSettings;
}

export const controlInputs = [
    {
        type: 'dropdown',
        option: 'y.sort',
        label: 'Sort Participant IDs',
        values: ['earliest', 'alphabetical-descending'],
        require: true
    }
];

export function syncControlInputs(preControlInputs, preSettings) {
    preSettings.filters.forEach(function(d, i) {
        const thisFilter = {
            type: 'subsetter',
            value_col: d.value_col ? d.value_col : d,
            label: d.label ? d.label : d.value_col ? d.value_col : d
        };
        //add the filter to the control inputs (as long as it isn't already there)
        var current_value_cols = preControlInputs
            .filter(f => f.type == 'subsetter')
            .map(m => m.value_col);
        if (current_value_cols.indexOf(thisFilter.value_col) == -1)
            preControlInputs.unshift(thisFilter);
    });

    return preControlInputs;
}

export function syncSecondSettings(preSettings) {
    const nextSettings = clone(preSettings);

    nextSettings.y.column = nextSettings.seq_col;
    nextSettings.y.sort = 'alphabetical-descending';

    nextSettings.marks[0].per = [nextSettings.seq_col];
    nextSettings.marks[1].per = [nextSettings.seq_col, 'wc_value'];

    if (nextSettings.highlight) {
        nextSettings.marks[2].per = [nextSettings.seq_col];
        nextSettings.marks[3].per = [nextSettings.seq_col, 'wc_value'];
    }

    nextSettings.range_band = preSettings.range_band * 2;
    nextSettings.margin = null;
    nextSettings.transitions = false;

    return nextSettings;
}
