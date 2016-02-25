export default function onLayout(){

  var x2 = this.svg.append("g").attr("class", "x2 axis linear");
  x2.append("text").attr("class","axis-title top")
    .attr("dy","2em")
    .attr("text-anchor","middle")
    .text(this.config.x_label);

}
