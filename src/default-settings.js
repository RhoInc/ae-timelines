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
        "column":"USUBJID", 
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
            "per":["USUBJID", "AESEQ"], 
            "attributes":{'stroke-width': 5, 'stroke-opacity': .8 },
            "tooltip": 'System Organ Class: [AEBODSYS]\nPreferred Term: [AETERM]\nStart Day: [ASTDY]\nStop Day: [AENDY]'
        },
        {
            "type":"circle",
            "per":["USUBJID", "AESEQ", "wc_value"], 
            "tooltip": 'System Organ Class: [AEBODSYS]\nPreferred Term: [AETERM]\nStart Day: [ASTDY]\nStop Day: [AENDY]'
        }
    ],
    "color_by": "AESEV",
    "colors": ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
    "date_format":"%m/%d/%y",
    "resizable":true,
    "max_width":1000,
    "y_behavior": 'flex',
    "gridlines":"y",
    "no_text_size":false,
    "range_band":15,
};

export const controlInputs = [ 
    {label: "Severity", type: "subsetter", value_col: "AESEV", multiple: true},
    {label: "AEBODSYS", type: "subsetter", value_col: "AEBODSYS"},
    {label: "Subject ID", type: "subsetter", value_col: "USUBJID"},
    {label: "Related to Treatment", type: "subsetter", value_col: "AEREL"},
    {label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true}
];

export default settings
