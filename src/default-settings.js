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
            "type":"line",
            "attributes":{'stroke-width': 5, 'stroke-opacity': .8 },
        },
        {
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
    {label: "AEBODSYS", type: "subsetter", value_col: "AEBODSYS"},
    {label: "Subject ID", type: "subsetter", value_col: "USUBJID"},
    {label: "Related to Treatment", type: "subsetter", value_col: "AEREL"},
    {label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true}
];

export function syncControlInputs(controlInputs, settings){
    controlInputs[0].value_col = settings.sev_col;
    controlInputs[1].value_col = settings.soc_col;
    controlInputs[2].value_col = settings.id_col;
    controlInputs[3].value_col = settings.rel_col;

    return controlInputs
}

export default settings
