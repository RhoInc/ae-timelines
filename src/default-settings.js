import clone
    from './util/clone';

const settings =

  //Template-specific settings
    {stdy_col: 'ASTDY'
    ,endy_col: 'AENDY'
    ,id_col: 'USUBJID'
    ,seq_col: 'AESEQ'
    ,sev_col: 'AESEV'
    ,sev_vals:
        ['MILD'
        ,'MODERATE'
        ,'SEVERE']
    ,ser_col: 'AESER'
    ,term_col: 'AETERM'
    ,vis_col: null
    ,filter_cols: []
    ,detail_cols: []

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
            ,tooltip: null
            ,attributes:
                {'fill-opacity': .5
                ,'stroke-opacity': .5}} // set in syncSettings()
        ,
            {type: 'line'
            ,per: null // set in syncSettings()
            ,values: {} // set in syncSettings()
            ,tooltip: null // set in syncSettings()
            ,attributes:
                {'class': 'serious'
                ,'stroke': 'black'
                ,'stroke-width': 2}}
        ,
            {type: 'circle'
            ,per: null // set in syncSettings()
            ,values: {} // set in syncSettings()
            ,tooltip: null // set in syncSettings()
            ,attributes:
                {'class': 'serious'
                ,'fill': 'none'
                ,'stroke': 'black'
                ,'stroke-width': 2}}
        ]
    ,legend:
        {location: 'top'
        ,label: 'Severity'}
    ,color_by: null // set in syncSettings()
    ,colors:
        ['#66bd63'
        ,'#fdae61'
        ,'#d73027']
    ,date_format: '%Y-%m-%d'
    ,y_behavior: 'flex'
    ,gridlines: 'y'
    ,no_text_size: false
    ,range_band: 15
    ,margin: {top: 50}
    ,resizable: true
};

export function syncSettings(preSettings) {
    const nextSettings = Object.create(preSettings);

    if (!nextSettings.filter_cols || nextSettings.filter_cols.length === 0)
        nextSettings.filter_cols =
            [nextSettings.ser_col
            ,nextSettings.sev_col
            ,nextSettings.id_col];

    nextSettings.y.column = nextSettings.id_col;

  //Lines (AE duration)
    nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[0].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;

  //Circles (AE start days)
    nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[1].values = {wc_category: [nextSettings.stdy_col]};

  //Lines (SAE duration)
    nextSettings.marks[2].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[2].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

  //Circles (SAE start days)
    nextSettings.marks[3].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[3].tooltip = `Verbatim Term: [${nextSettings.term_col}]`
        + `\nStart Day: [${nextSettings.stdy_col}]`
        + `\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[3].values = {wc_category: [nextSettings.stdy_col]};
    nextSettings.marks[3].values[nextSettings.ser_col] = ['Yes', 'Y'];

    nextSettings.legend.order = nextSettings.sev_vals;

    nextSettings.color_by = nextSettings.sev_col;

    return nextSettings;
}

export const controlInputs =
    [
        {type: 'dropdown' , option: 'y.sort', label: 'Sort IDs', values: ['earliest', 'alphabetical-descending'], require: true}
    ];

export function syncControlInputs(preControlInputs, preSettings) {
    const value_colLabels =
        [   {value_col: preSettings.id_col, label: 'Participant ID'}
        ,   {value_col: preSettings.term_col, label: 'Reported Term'}
        ,   {value_col: 'AEDECOD', label: 'Dictionary-Derived Term'}
        ,   {value_col: 'AEBODSYS', label: 'Body System or Organ Class'}
        ,   {value_col: 'AELOC', label: 'Location of Event'}
        ,   {value_col: preSettings.sev_col, label: 'Severity/Intensity'}
        ,   {value_col: preSettings.ser_col, label: 'Serious Event'}
        ,   {value_col: 'AEACN', label: 'Action Taken with Study Treatment'}
        ,   {value_col: 'AEREL', label: 'Causality'}
        ,   {value_col: 'AEOUT', label: 'Outcome of Event'}
        ,   {value_col: 'AETOXGR', label: 'Toxicity Grade'}];
    preSettings.filter_cols.reverse()
        .forEach((d,i) => {
            const value_colPosition = value_colLabels
                .map(di => di.value_col)
                .indexOf(d);
            const thisFilter =
                {type: 'subsetter'
                ,value_col: d
                ,label: value_colPosition > -1
                    ? value_colLabels[value_colPosition].label
                    : d};
            const filter_vars = preControlInputs
                .map(d => d.value_col);

          //Check whether [ filter_vars ] settings property contains default filter column.
            if (filter_vars.indexOf(thisFilter.value_col) === -1)
                preControlInputs.unshift(thisFilter);
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

    nextSettings.marks[0].per = [nextSettings.seq_col];
    nextSettings.marks[0].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`

    nextSettings.marks[1].per = [nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`
    nextSettings.marks[1].values = {wc_category: [nextSettings.stdy_col]};

    nextSettings.marks[2].per = [nextSettings.seq_col];
    nextSettings.marks[2].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`
    nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

    nextSettings.marks[3].per = [nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[3].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`
    nextSettings.marks[3].values = {wc_category: [nextSettings.stdy_col]};
    nextSettings.marks[3].values[nextSettings.ser_col] = ['Yes', 'Y'];

    nextSettings.legend.order = nextSettings.sev_vals;

    nextSettings.color_by = nextSettings.sev_col;

    return nextSettings;
}

export default settings;
