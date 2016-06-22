export default function onLayout(){
  //add div for participant counts
  d3.select(this.div).append("span").classed("annote",true)

  //add top x-axis
  var x2 = this.svg.append("g").attr("class", "x2 axis linear");
  x2.append("text").attr("class","axis-title top")
    .attr("dy","2em")
    .attr("text-anchor","middle")
    .text(this.config.x_label);
}
