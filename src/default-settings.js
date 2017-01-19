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
        ,detail_col: null}
    ,custom_marks:
        [
            {type: 'line'
            ,per: null // set in syncSettings()
            ,values: null // set in syncSettings()
            ,tooltip: null // set in syncSettings()
            ,attributes:
                {'stroke': 'black'
                ,'stroke-width': 2}}
        ,
            {type: 'circle'
            ,per: null // set in syncSettings()
            ,values: null // set in syncSettings()
            ,tooltip: null // set in syncSettings()
            ,attributes:
                {'fill': 'none'
                ,'stroke': 'black'
                ,'stroke-width': 2}}
        ]
    ,filters: null
    ,details: null

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
    ,legend:
        {location: 'top'
        ,label: 'Severity/Intensity'}
    ,colors:
        ['#66bd63'
        ,'#fdae61'
        ,'#d73027']
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

  //Add custom marks to marks array.
    nextSettings.custom_marks
        .forEach(custom_mark => {

          //Classify custom marks to avoid re-coloring in onResize() with syncColors().
            if (custom_mark.attributes)
                custom_mark.attributes.class = 'highlight';
            else
                custom_mark.attributes = {'class': 'highlight'};

          //Lines (highlighted event duration)
            if (custom_mark.type === 'line') {
                custom_mark.per = custom_mark.per || [nextSettings.id_col, nextSettings.seq_col];
                custom_mark.tooltip = custom_mark.tooltip ||
                    `${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col}]`
                        + `\nStart Day: [${nextSettings.stdy_col}]`
                        + `\nStop Day: [${nextSettings.endy_col}]`;

                if (!custom_mark.values) {
                    custom_mark.values = {};
                    custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                }
            }
          //Circles (highlighted event start day)
            else if (custom_mark.type === 'circle') {
                custom_mark.per = custom_mark.per || [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
                custom_mark.tooltip = custom_mark.tooltip ||
                    `${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col}]`
                        + `\nStart Day: [${nextSettings.stdy_col}]`
                        + `\nStop Day: [${nextSettings.endy_col}]`;

                if (!custom_mark.values) {
                    custom_mark.values = {'wc_category': nextSettings.stdy_col};
                    custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                }
            }

            nextSettings.marks.push(custom_mark);
        });

  //Define legend order.
    nextSettings.legend.order = nextSettings.color_by_values;

  //Default filters
    if (!nextSettings.filters || nextSettings.filters.length === 0)
        nextSettings.filters =
            [   {value_col: nextSettings.highlight.value_col, label: nextSettings.highlight.label}
            ,   {value_col: nextSettings.color_by, label: nextSettings.legend.label}
            ,   {value_col: nextSettings.id_col, label: 'Subject Identifier'}];

  //Default detail listing columns
    const defaultDetails =
        [   {'value_col': nextSettings.seq_col , label: 'Sequence Number'}
        ,   {'value_col': nextSettings.stdy_col, label: 'Start Day'}
        ,   {'value_col': nextSettings.endy_col, label: 'Stop Day'}
        ,   {'value_col': nextSettings.term_col, label: 'Reported Term'}];

      //Add settings.color_by to default details.
        if (nextSettings.color_by)
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

  //Add custom marks to marks array.
    nextSettings.custom_marks
        .forEach(custom_mark => {

          //Classify custom marks to avoid re-coloring in onResize() with syncColors().
            if (custom_mark.attributes)
                custom_mark.attributes.class = 'highlight';
            else
                custom_mark.attributes = {'class': 'highlight'};

          //Lines (highlighted event duration)
            if (custom_mark.type === 'line') {
                custom_mark.per = custom_mark.per || [nextSettings.seq_col];
                custom_mark.tooltip = custom_mark.tooltip ||
                    `${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col}]`
                        + `\nStart Day: [${nextSettings.stdy_col}]`
                        + `\nStop Day: [${nextSettings.endy_col}]`;

                if (!custom_mark.values) {
                    custom_mark.values = {};
                    custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                }
            }
          //Circles (highlighted event start day)
            else if (custom_mark.type === 'circle') {
                custom_mark.per = custom_mark.per || [nextSettings.seq_col, 'wc_value'];
                custom_mark.tooltip = custom_mark.tooltip ||
                    `${nextSettings.highlight.label}: [${nextSettings.highlight.detail_col ? nextSettings.highlight.detail_col : nextSettings.highlight.value_col}]`
                        + `\nStart Day: [${nextSettings.stdy_col}]`
                        + `\nStop Day: [${nextSettings.endy_col}]`;

                if (!custom_mark.values) {
                    custom_mark.values = {'wc_category': nextSettings.stdy_col};
                    custom_mark.values[nextSettings.highlight.value_col] = nextSettings.highlight.value;
                }
            }

            nextSettings.marks.push(custom_mark);
        });

  //Define legend order.
    nextSettings.legend.order = nextSettings.color_by_values;

    return nextSettings;
}

export default settings;
