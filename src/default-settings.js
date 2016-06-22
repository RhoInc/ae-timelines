const settings = {
    //Addition settings for this template
    id_col: 'USUBJID',
    seq_col: 'AESEQ',
    soc_col: 'AEBODSYS',
    term_col: 'AETERM',
    stdy_col: 'ASTDY',
    endy_col: 'AENDY',
    sev_col: 'AESEV',
    rel_col: 'AEREL',
    filter_cols: [],
    detail_cols:[],

    //Standard webcharts settings
    x:{
        "label":null,
        "type":"linear",
        "column":'wc_value'
    },
    y:{
        "column":null, //set in syncSettings()
        "label": '', 
        "sort":"earliest",
        "type":"ordinal",
        "behavior": 'flex'
    },
   "margin": {"top": 50, bottom: null, left: null, right: null},
    "legend":{
        "mark":"circle", 
        "label": 'Severity'
    },
    "marks":[
        {
            "per":null, //set in syncSettings()
            "tooltip":null, //set in syncSettings()
            "type":"line",
            "attributes":{'stroke-width': 5, 'stroke-opacity': .8 },
        },
        {
            "per":null, //set in syncSettings()
            "tooltip":null, //set in syncSettings()
            "type":"circle",
        }
    ],
    "colors": ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
    "date_format":"%m/%d/%y",
    "resizable":true,
    "max_width":1000,
    "y_behavior": 'flex',
    "gridlines":"y",
    "no_text_size":false,
    "range_band":15,
    "color_by":null //set in syncSettings()
};

export function syncSettings(preSettings){
    const nextSettings = Object.create(preSettings);
    nextSettings.y.column = nextSettings.id_col;
    nextSettings.marks[0].per = [nextSettings.id_col, nextSettings.seq_col];
    nextSettings.marks[0].tooltip = `System Organ Class: [${nextSettings.soc_col}]\nPreferred Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.marks[1].per = [nextSettings.id_col, nextSettings.seq_col, 'wc_value'];
    nextSettings.marks[1].tooltip = `System Organ Class: [${nextSettings.soc_col}]\nPreferred Term: [${nextSettings.term_col}]\nStart Day: [${nextSettings.stdy_col}]\nStop Day: [${nextSettings.endy_col}]`;
    nextSettings.color_by = nextSettings.sev_col;

    return nextSettings;
}

export const controlInputs = [ 
    {label: "Severity", type: "subsetter", value_col: "AESEV", multiple: true},
    {label: "System Organ Class", type: "subsetter", value_col: "AEBODSYS"},
    {label: "Subject ID", type: "subsetter", value_col: "USUBJID"},
    {label: "Related to Treatment", type: "subsetter", value_col: "AEREL"},
    {label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true}
];

export function syncControlInputs(preControlInputs, preSettings){
    var severityControl = preControlInputs.filter(function(d){return d.label=="Severity"})[0];
    severityControl.value_col = preSettings.sev_col;

    var sOCControl = preControlInputs.filter(function(d){return d.label=="System Organ Class"})[0];
    sOCControl.value_col = preSettings.soc_col;

    var subjectControl = preControlInputs.filter(function(d){return d.label=="Subject ID"})[0];
    subjectControl.value_col = preSettings.id_col;

    var relatedControl = preControlInputs.filter(function(d){return d.label=="Related to Treatment"})[0];
    relatedControl.value_col = preSettings.rel_col;

    settings.filter_cols.forEach(function(d,i){
      var thisFilter = {
        type:"subsetter", 
        value_col:d, 
        label:d,
        multiple:true
      }
      var filter_vars = preControlInputs.map(function(d){return d.value_col})
      if (filter_vars.indexOf(thisFilter.value_col)== -1) {
        preControlInputs.push(thisFilter);
      } 
    })
  
    return preControlInputs;
}

//Setting for custom details view
export const secondSettings = {
    "x":{label:'', "type":"linear","column":"wc_value"},
    "y":{label: '', "sort":"alphabetical-descending","type":"ordinal","column":"AESEQ"},
    "marks":[
        {"type":"line","per":["AESEQ"], attributes:{'stroke-width': 5, 'stroke-opacity': .8 }},
        {"type":"circle","per":[ "AESEQ", "wc_value"]}
     ],
    color_by: "AESEV",
    colors: ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
    "legend":{
        "mark":"circle", 
        "label": 'Severity'
    },
    "date_format":"%d%b%Y:%X",
    // "resizable":false,
    transitions: false,
    "max_width":1000,
    // point_size: 3,
    "gridlines":"y",
    "no_text_size":false,
    "range_band":28
};

export function syncSecondSettings(settings1, settings2){
    const nextSettings = Object.create(settings1);
    nextSettings.y.column = settings2.seq_col;
    nextSettings.marks[0].per[0] = settings2.seq_col;
    nextSettings.marks[1].per[0] = settings2.seq_col;
    nextSettings.color_by = settings2.sev_col;
    nextSettings.color_dom = settings2.legend ? nextSettings.legend.order : null;
    nextSettings.colors = settings2.colors;

    return nextSettings;
}

export default settings
