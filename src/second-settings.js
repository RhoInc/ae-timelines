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