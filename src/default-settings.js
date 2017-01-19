import clone
    from './util/clone';

const settings =

  //Template-specific settings
    {id_col: 'USUBJID'
    ,seq_col: 'AESEQ'
    ,stdy_col: 'ASTDY'
    ,endy_col: 'AENDY'
    ,term_col: 'AETERM'
    ,color_by: 'AESEV'
    ,color_by_values:
        ['MILD'
        ,'MODERATE'
        ,'SEVERE']
    ,highlight:
        {value_col: 'AESER'
        ,label: 'Serious Event'
        ,value: 'Y'
        ,detail_col: null
        ,attributes:
            {'stroke': 'black'
            ,'stroke-width': '2'
            ,'fill': 'none'}}
    ,filters: null
    ,details: null
    ,custom_marks: null

  //Standard chart settings
    ,x: {column: 'wc_value'
        ,type: 'linear'
        ,label: null}
    ,y: {column: null // set in syncSettings()
        ,type: 'ordinal'
        ,label: ''
        ,sort: 'earliest'
        ,behavior: 'flex'}
    ,marks: 
        [
            {type: 'line'
            ,per: null // set in syncSettings()
            ,tooltip: null // set in syncSettings()
            ,attributes:
                {'stroke-width': 5
                ,'stroke-opacity': .5}}
        ,
            {type: 'circle'
            ,per: null // set in syncSettings()
            ,tooltip: null // set in syncSettings()
            ,attributes:
                {'fill-opacity': .5
                ,'stroke-opacity': .5}}
        ]
    ,colors:
        ['#66bd63'
        ,'#fdae61'
        ,'#d73027'
        ,'#377eb8'
        ,'#984ea3'
        ,'#ff7f00'
        ,'#a65628'
        ,'#f781bf'
        ,'#999999']
    ,legend:
        {location: 'top'
        ,label: 'Severity/Intensity'}
    ,date_format: '%Y-%m-%d'
    ,y_behavior: 'flex'
    ,gridlines: 'y'
    ,no_text_size: false
    ,range_band: 15
    ,margin: {top: 50} // for second x-axis
    ,resizable: true
};

export function syncSettings(preSettings) {
    const nextSettings = Object.create(preSettings);

    nextSettings.y.column = nextSettings.id_col;

  //Lines (AE duration)
    nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[0].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;

  //Circles (AE start day)
    nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[1].values = {wc_category: [nextSettings.stdy_col]};

  //Define highlight marks.
    if (nextSettings.highlight) {
      //Lines (highlighted event duration)
        let highlightLine =
            {'type': 'line'
            ,'per': [nextSettings.id_col, nextSettings.seq_col]
            ,'tooltip': `Verbatim Term: [${nextSettings.term_col}]`
                    + `\nStart Day: [${nextSettings.stdy_col}]`
                    + `\nStop Day: [${nextSettings.endy_col}]`
                    + `\n${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col
                        ? nextSettings.highlight.detail_col
                        : nextSettings.highlight.value_col}]`
            ,'values': {}
            ,'attributes': nextSettings.highlight.attributes || {}};
        highlightLine.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
        highlightLine.attributes.class = 'highlight';
        nextSettings.marks.push(highlightLine);

      //Circles (highlighted event start day)
        let highlightCircle =
            {'type': 'circle'
            ,'per': [nextSettings.id_col, nextSettings.seq_col, 'wc_value']
            ,'tooltip': `Verbatim Term: [${nextSettings.term_col}]`
                    + `\nStart Day: [${nextSettings.stdy_col}]`
                    + `\nStop Day: [${nextSettings.endy_col}]`
                    + `\n${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col
                        ? nextSettings.highlight.detail_col
                        : nextSettings.highlight.value_col}]`
            ,'values': {'wc_category': nextSettings.stdy_col}
            ,'attributes': nextSettings.highlight.attributes || {}};
        highlightCircle.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
        highlightCircle.attributes.class = 'highlight';
        nextSettings.marks.push(highlightCircle);
    }

  //Define legend order.
    nextSettings.legend.order = nextSettings.color_by_values;

  //Default filters
    if (!nextSettings.filters || nextSettings.filters.length === 0) {
        nextSettings.filters =
            [   {value_col: nextSettings.color_by, label: nextSettings.legend.label}
            ,   {value_col: nextSettings.id_col, label: 'Subject Identifier'}];
        if (nextSettings.highlight)
            nextSettings.filters.unshift({value_col: nextSettings.highlight.value_col, label: nextSettings.highlight.label});
    }

  //Default detail listing columns
    const defaultDetails =
        [   {'value_col': nextSettings.seq_col , label: 'Sequence Number'}
        ,   {'value_col': nextSettings.stdy_col, label: 'Start Day'}
        ,   {'value_col': nextSettings.endy_col, label: 'Stop Day'}
        ,   {'value_col': nextSettings.term_col, label: 'Reported Term'}];

      //Add settings.color_by to default details.
        defaultDetails.push(
            {'value_col': nextSettings.color_by
            ,'label': nextSettings.legend
                ? nextSettings.legend.label || nextSettings.color_by
                : nextSettings.color_by});

      //Add settings.highlight.value_col and settings.highlight.detail_col to default details.
        if (nextSettings.highlight) {
            defaultDetails.push(
                {'value_col': nextSettings.highlight.value_col
                ,'label': nextSettings.highlight.label});

            if (nextSettings.highlight.detail_col)
                defaultDetails.push(
                    {'value_col': nextSettings.highlight.detail_col
                    ,'label': nextSettings.highlight.label + ' Details'});
        }

      //Add settings.filters columns to default details.
        nextSettings.filters
            .forEach(filter =>
                defaultDetails.push(
                    {'value_col': filter.value_col
                    ,'label': filter.label}));

  //Redefine settings.details with defaults.
    if (!nextSettings.details)
        nextSettings.details = defaultDetails;
    else {
      //Allow user to specify an array of columns or an array of objects with a column property
      //and optionally a column label.
        nextSettings.details = nextSettings.details
            .map(d => {
                return {
                    value_col: d.value_col ? d.value_col : d,
                    label: d.label ? d.label : d.value_col ? d.value_col : d}; });

      //Add default details to settings.details.
        defaultDetails
            .reverse()
            .forEach(defaultDetail =>
                nextSettings.details.unshift(defaultDetail));
    }

  //Add custom marks to marks array.
    if (nextSettings.custom_marks)
        nextSettings.custom_marks
            .forEach(custom_mark => {
                custom_mark.attributes = custom_mark.attributes || {};
                custom_mark.attributes.class = 'custom';
                nextSettings.marks.push(custom_mark);
            });

    return nextSettings;
}

export const controlInputs =
    [
        {type: 'dropdown' , option: 'y.sort', label: 'Sort Subject IDs', values: ['earliest', 'alphabetical-descending'], require: true}
    ];

export function syncControlInputs(preControlInputs, preSettings) {
    preSettings.filters.reverse()
        .forEach((d,i) => {
            const thisFilter =
                {type: 'subsetter'
                ,value_col: d.value_col ? d.value_col : d
                ,label: d.label ? d.label : d.value_col ? d.value_col : d};
            preControlInputs.unshift(thisFilter);
            preSettings.details.push(
                {value_col: d.value_col ? d.value_col : d
                ,label: d.label ? d.label : d.value_col ? d.value_col : d});
        });
  
    return preControlInputs;
}

//Setting for custom details view
let cloneSettings = clone(settings);
    cloneSettings.y.sort = 'alphabetical-descending';
    cloneSettings.transitions = false;
    cloneSettings.range_band = settings.range_band*2;
    cloneSettings.margin = null;
export const secondSettings = cloneSettings;

export function syncSecondSettings(preSettings) {
    const nextSettings = Object.create(preSettings);

    nextSettings.y.column = nextSettings.seq_col;

  //Lines (AE duration)
    nextSettings.marks[0].per = [nextSettings.seq_col];
    nextSettings.marks[0].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;

  //Circles (AE start day)
    nextSettings.marks[1].per = [nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[1].values = {wc_category: [nextSettings.stdy_col]};

  //Define highlight marks.
    if (nextSettings.highlight) {
      //Lines (highlighted event duration)
        let highlightLine =
            {'type': 'line'
            ,'per': [nextSettings.seq_col]
            ,'tooltip': `Verbatim Term: [${nextSettings.term_col}]`
                    + `\nStart Day: [${nextSettings.stdy_col}]`
                    + `\nStop Day: [${nextSettings.endy_col}]`
                    + `\n${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col
                        ? nextSettings.highlight.detail_col
                        : nextSettings.highlight.value_col}]`
            ,'values': {}
            ,'attributes': nextSettings.highlight.attributes || {}};
        highlightLine.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
        highlightLine.attributes.class = 'highlight';
        nextSettings.marks.push(highlightLine);

      //Circles (highlighted event start day)
        let highlightCircle =
            {'type': 'circle'
            ,'per': [nextSettings.seq_col, 'wc_value']
            ,'tooltip': `Verbatim Term: [${nextSettings.term_col}]`
                    + `\nStart Day: [${nextSettings.stdy_col}]`
                    + `\nStop Day: [${nextSettings.endy_col}]`
                    + `\n${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col
                        ? nextSettings.highlight.detail_col
                        : nextSettings.highlight.value_col}]`
            ,'values': {'wc_category': nextSettings.stdy_col}
            ,'attributes': nextSettings.highlight.attributes || {}};
        highlightCircle.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
        highlightCircle.attributes.class = 'highlight';
        nextSettings.marks.push(highlightCircle);
    }

  //Define legend order.
    nextSettings.legend.order = [].concat(nextSettings.color_by_values);

  //Add custom marks to marks array.
    if (nextSettings.custom_marks)
        nextSettings.custom_marks
            .forEach(custom_mark => {
                custom_mark.attributes = custom_mark.attributes || {};
                custom_mark.attributes.class = 'custom';
                nextSettings.marks.push(custom_mark);
            });

    return nextSettings;
}

export default settings;
