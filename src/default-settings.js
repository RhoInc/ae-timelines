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
   "margin": {"top": 50},
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

export function syncSettings(settings){
    settings.y.column = settings.id_col;
    settings.marks[0].per = [settings.id_col, settings.seq_col];
    settings.marks[0].tooltip = `System Organ Class: [${settings.soc_col}]\nPreferred Term: [${settings.term_col}]\nStart Day: [${settings.stdy_col}]\nStop Day: [${settings.endy_col}]`;
    settings.marks[1].per = [settings.id_col, settings.seq_col, 'wc_value'];
    settings.marks[1].tooltip = `System Organ Class: [${settings.soc_col}]\nPreferred Term: [${settings.term_col}]\nStart Day: [${settings.stdy_col}]\nStop Day: [${settings.endy_col}]`;
    settings.color_by = settings.sev_col;

    return settings;
}

export const controlInputs = [ 
    {label: "Severity", type: "subsetter", value_col: "AESEV", multiple: true},
    {label: "System Organ Class", type: "subsetter", value_col: "AEBODSYS"},
    {label: "Subject ID", type: "subsetter", value_col: "USUBJID"},
    {label: "Related to Treatment", type: "subsetter", value_col: "AEREL"},
    {label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true}
];

export function syncControlInputs(controlInputs, settings){
    var severityControl = controlInputs.filter(function(d){return d.label=="Severity"})[0] 
    severityControl.value_col = settings.sev_col;

    var SOCControl = controlInputs.filter(function(d){return d.label=="System Organ Class"})[0] 
    SOCControl.value_col = settings.soc_col;

    var subjectControl = controlInputs.filter(function(d){return d.label=="Subject ID"})[0] 
    subjectControl.value_col = settings.id_col;

    var relatedControl = controlInputs.filter(function(d){return d.label=="Related to Treatment"})[0] 
    relatedControl.value_col = settings.rel_col;

    return controlInputs
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

export function syncSecondSettings(secondSettings, settings){
    secondSettings.y.column = settings.seq_col;
    secondSettings.marks[0].per[0] = settings.seq_col;
    secondSettings.marks[1].per[0] = settings.seq_col;
    secondSettings.color_by = settings.sev_col;
    secondSettings.color_dom = settings.legend ? secondSettings.legend.order : null;

    return secondSettings
}
export default settings
