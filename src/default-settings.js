import clone
    from './util/clone';

const settings =

  //Template-specific settings
    {stdy_col: 'ASTDY'
    ,endy_col: 'AENDY'
    ,id_col: 'USUBJID'
    ,rfendt_col: 'RFENDTC'
    ,seq_col: 'AESEQ'
    ,sev_col: 'AESEV'
    ,sev_vals:
        ['MILD'
        ,'MODERATE'
        ,'SEVERE']
    ,ser_col: 'AESER'
    ,term_col: 'AETERM'
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
            ,nextSettings.id_col
            ,'Participant Status'];

    nextSettings.y.column = nextSettings.id_col;

    nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[0].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`

    nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`
    nextSettings.marks[1].values = {wc_category: [nextSettings.stdy_col]};

    nextSettings.marks[2].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[2].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`
    nextSettings.marks[2].values[nextSettings.ser_col] = ['Yes', 'Y'];

    nextSettings.marks[3].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[3].tooltip = `Verbatim Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`
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
    preSettings.filter_cols.reverse()
        .forEach((d,i) => {
            var thisFilter =
                {type: 'subsetter'
                ,value_col: d
                ,label: d};
            var filter_vars = preControlInputs
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
