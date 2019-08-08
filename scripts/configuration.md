The most straightforward way to customize the AE Timelines is by using a configuration object whose properties describe the behavior and appearance of the chart. Since the AE Timelines is a Webcharts `chart` object, many default Webcharts settings are set in the [defaultSettings.js file](https://github.com/RhoInc/ae-timelines/blob/master/src/defaultSettings.js) as [described below](#Webcharts-Settings). Refer to the [Webcharts documentation](https://github.com/RhoInc/Webcharts/wiki/Chart-Configuration) for more details on these settings.

In addition to the standard Webcharts settings several custom settings not available in the base Webcharts library have been added to the AE Timelines to facilitate data mapping and other custom functionality. These custom settings are described in detail below. All defaults can be overwritten by users.

# Renderer-specific settings
The sections below describe each ae-timelines setting as of version 2.1.0.

## settings.id_col
`string`

unique identifier variable name

**default:** `"USUBJID"`



## settings.seq_col
`string`

event sequence number variable name

**default:** `"AESEQ"`



## settings.stdy_col
`string`

event start day variable name

**default:** `"ASTDY"`



## settings.endy_col
`string`

event end day variable name

**default:** `"AENDY"`



## settings.term_col
`string`

verbatim adverse event text variable name

**default:** `"AETERM"`



## settings.color
`object`

an object that defines the event color stratification variable, its label, its levels, and their corresponding colors

### settings.color.value_col
`string`

color stratification variable name, usually set to event severity

**default:** `"AESEV"`

### settings.color.label
`string`

color stratification variable label

**default:** `"Severity/Intensity"`

### settings.color.values
`array`

an array of stratification values

**default:** 
```
[
  "MILD",
  "MODERATE",
  "SEVERE"
]
```

### settings.color.colors
`array`

an array of stratification colors

**default:** 
```
[
  "#66bd63",
  "#fdae61",
  "#d73027",
  "#377eb8",
  "#984ea3",
  "#ff7f00",
  "#a65628",
  "#f781bf",
  "#999999"
]
```



## settings.highlight
`object`

an object that defines what events to highlight and how to highlight them

### settings.highlight.value_col
`string`

event highlighting variable name

**default:** `"AESER"`

### settings.highlight.label
`string`

a description of the highlighted event

**default:** `"Serious Event"`

### settings.highlight.value
`string`

value of `highlight.value_col` that identifies events to highlight

**default:** `"Y"`

### settings.highlight.detail_col
`string`

detail of highlighted event variable name

**default:** none

### settings.highlight.attributes
`object`

an object of attributes that define highlighted marks





## settings.filters
`array`

an array of filter variables and associated metadata

**default:** none

### settings.filters[].value_col
`string`

the name of the filter variable

**default:** none

### settings.filters[].label
`string`

a description of the filter variable

**default:** none



## settings.details
`array`

an array of detail listing variables and associated metadata

**default:** none

### settings.details[].value_col
`string`

the name of the detail variable

**default:** none

### settings.details[].label
`string`

a description of the detail variable

**default:** none



## settings.custom_marks
`array`

an array of custom Webcharts marks

**default:** none

### settings.custom_marks[].type
`string`

a Webcharts mark type: point, bar, line, or text

**default:** none

### settings.custom_marks[].per
`array`

an array of variables for each value combination of which a mark is drawn

**default:** none

### settings.custom_marks[].tooltip
`string`

the tooltip of the custom mark

**default:** none

### settings.custom_marks[].attributes
`object`

the attributes of the custom mark



# Webcharts settings
The object below contains each Webcharts setting as of version 2.1.0.

```
{    x: {        column: 'wc_value',        type: 'linear',        label: null    },    y: {        column: null, // set in syncSettings()        type: 'ordinal',        label: '',        sort: 'earliest',        behavior: 'flex'    },    marks: [        {            type: 'line',            per: null, // set in syncSettings()            tooltip: null, // set in syncSettings()            attributes: {                'stroke-width': 5,                'stroke-opacity': 0.5            }        },        {            type: 'circle',            per: null, // set in syncSettings()            tooltip: null, // set in syncSettings()            attributes: {                'fill-opacity': 0.5,                'stroke-opacity': 0.5            }        }    ],    legend: { location: 'top', mark: 'circle' },    gridlines: 'y',    range_band: 15,    margin: { top: 50 }, // for second x-axis    resizable: true}
```