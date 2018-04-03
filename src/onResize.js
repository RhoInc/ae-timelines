import addHighlightLegendItem from './onResize/addHighlightLegendItem';
import drawTopXaxis from './onResize/drawTopXaxis';
import addTickClick from './onResize/addTickClick';

export default function onResize() {
    let context = this;

    //Add highlight adverse event legend item.
    if (this.config.highlight) addHighlightLegendItem(this);

    //Draw second x-axis at top of chart.
    drawTopXaxis.call(this);

    //Draw second chart when y-axis tick label is clicked.
    addTickClick.call(this);

    /**-------------------------------------------------------------------------------------------\
      Second chart callbacks.
    \-------------------------------------------------------------------------------------------**/

    this.chart2.on('preprocess', function() {
        //Define color scale.
        this.config.color_dom = context.colorScale.domain();
    });

    this.chart2.on('draw', function() {
        //Sync x-axis domain of second chart with that of the original chart.
        this.x_dom = context.x_dom;
    });

    this.chart2.on('resize', function() {
        //Add highlight adverse event legend item.
        if (this.config.highlight) addHighlightLegendItem(this);
    });
}
