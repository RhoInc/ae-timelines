import lengthenRaw from './lengthen-raw';

export default function onInit(){
    this.superRaw = this.raw_data;
    this.raw_data = lengthenRaw(this.raw_data, [this.config.stdy_col, this.config.endy_col])  
    this.raw_data.forEach(function(d){
        d.wc_value = d.wc_value == "" ? NaN : +d.wc_value;
    });
    //create back button
    var myChart = this;
    this.chart2.wrap.insert('button', 'svg').html('&#8592; Back').style('cursor', 'pointer')
    .on('click', () =>{
        this.wrap.style('display', 'block');
        this.table.draw([]);
        this.chart2.wrap.style('display', 'none');
        this.chart2.wrap.select('.id-title').remove();
        this.controls.wrap.style('display', 'block');
    });

};