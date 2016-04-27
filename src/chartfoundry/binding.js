
export default {
	dataMappings : [
		{
			source: "id_col",
			target: "id_col"
		},
		{
			source: "seq_col",
			target: "seq_col"
		},
		{
			source: "soc_col",
			target: "soc_col"
		},
		{
			source: "term_col",
			target: "term_col"
		},
		{
			source: "stdy_col",
			target: "stdy_col"
		},
		{
			source: "endy_col",
			target: "endy_col"
		},
		{
			source: "sev_col",
			target: "sev_col"
		},
		{
			source: "rel_col",
			target: "rel_col"
		},
		{
			source:"x",
			target:"x.column"
		},
		{
			source:"x_order",
			target:"x.order"
		},
		{
			source:"x_domain",
			target:"x.domain"
		},
		{
			source:"y",
			target:"y.column"
		},
		{
			source:"y_order",
			target:"y.order"
		},
		{
			source:"y_domain",
			target:"y.domain"
		},
		{
			source:"group",
			target:"marks.0.per"
		},
		{
			source:"subgroup",
			target:"marks.0.split"
		},
		{
			source:"subset",
			target:"marks.0.values"
		},
		{
			source:"color_by",
			target:"color_by"
		},
		{
			source:"legend_order",
			target:"legend.order"
		},
		{
			source:"tooltip",
			target:"marks.0.tooltip"
		}
	],
	chartProperties: [
		{
			source:"date_format",
			target:"date_format"
		},
		{
			source:"x_label",
			target:"x.label"
		},

		{
			source:"x_type",
			target:"x.type"
		},
		{
			source:"x_format",
			target:"x.format"
		},
		{
			source:"x_sort",
			target:"x.sort"
		},
		{
			source:"x_bin",
			target:"x.bin"
		},
		{
			source:"x_behavior",
			target:"x.behavior"
		},
		{
			source:"y_label",
			target:"y.label"
		},
		{
			source:"y_type",
			target:"y.type"
		},
		{
			source:"y_format",
			target:"y.format"
		},
		{
			source:"y_sort",
			target:"y.sort"
		},
		{
			source:"y_behavior",
			target:"y.behavior"
		},
		{
			source:"marks_type",
			target:"marks.0.type"
		},
		{
			source:"marks_summarizeX",
			target:"marks.0.summarizeX"
		},
		{
			source:"marks_summarizeY",
			target:"marks.0.summarizeY"
		},
		{
			source:"marks_arrange",
			target:"marks.0.arrange"
		},
		{
			source:"marks_fill_opacity",
			target:"marks.0.attributes.fill-opacity"
		},
		{
			source:"aspect_ratio",
			target:"aspect"
		},
		{
			source:"range_band",
			target:"range_band"
		},
		{
			source:"colors",
			target:"colors"
		},
		{
			source:"gridlines",
			target:"gridlines"
		},
		{
			source:"max_width",
			target:"max_width"
		},
		{
			source:"resizable",
			target:"resizable"
		},
		{
			source:"scale_text",
			target:"scale_text"
		},
		{
			source: "legend_mark",
			target: "legend.mark"
		},
		{
			source: "legend_label",
			target: "legend.label"
		}
	]
}
