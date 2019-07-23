var diameter=1E3,radius=diameter/2,innerRadius=radius-120,height=initHeight,color=d3.scale.category10(),months="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
function drawColorLegend(){svg3.append("circle").attr("class","nodeLegend").attr("cx",6).attr("cy",20).attr("r",6).style("fill",color(0));svg3.append("text").attr("class","nodeLegend").attr("x",16).attr("y",21).text("Person").attr("dy",".21em").attr("font-family","sans-serif").attr("font-size","11px").style("text-anchor","left").style("fill",color(0));svg3.append("circle").attr("class","nodeLegend").attr("cx",6).attr("cy",34).attr("r",6).style("fill",color(1));svg3.append("text").attr("class","nodeLegend").attr("x",
    16).attr("y",35).text("Location").attr("dy",".21em").attr("font-family","sans-serif").attr("font-size","11px").style("text-anchor","left").style("fill",color(1));svg3.append("circle").attr("class","nodeLegend").attr("cx",6).attr("cy",48).attr("r",6).style("fill",color(2));svg3.append("text").attr("class","nodeLegend").attr("x",16).attr("y",49).text("Organization").attr("dy",".21em").attr("font-family","sans-serif").attr("font-size","11px").style("text-anchor","left").style("fill",color(2));svg3.append("circle").attr("class",
    "nodeLegend").attr("cx",6).attr("cy",62).attr("r",6).style("fill",color(3));svg3.append("text").attr("class","nodeLegend").attr("x",16).attr("y",63).text("Miscellaneous").attr("dy",".21em").attr("font-family","sans-serif").attr("font-size","11px").style("text-anchor","left").style("fill",color(3));svg3.append("text").attr("class","nodeLegend").attr("x",0).attr("y",82).text(numberInputTerms+" terms of "+data1.length+" blogs").attr("dy",".21em").attr("font-family","sans-serif").attr("font-size","11px").style("text-anchor",
    "left").style("fill","#000000")}function removeColorLegend(){svg3.selectAll(".nodeLegend").remove()}
function drawTimeLegend(){for(var a=[],b=minYear;b<maxYear;b++)for(var c=0;12>c;c++){var e=xStep+xScale(12*(b-minYear)+c),d={};d.x=e;d.year=b;a.push(d)}svg3.selectAll(".timeLegendLine").data(a).enter().append("line").attr("class","timeLegendLine").style("stroke","000").style("stroke-dasharray","1, 2").style("stroke-opacity",1).style("stroke-width",.2).attr("x1",function(a){return a.x}).attr("x2",function(a){return a.x}).attr("y1",function(a){return 0}).attr("y2",function(a){return height});svg3.selectAll(".timeLegendText").data(a).enter().append("text").attr("class",
    "timeLegendText").style("fill","#000000").style("text-anchor","start").style("text-shadow","1px 1px 0 rgba(255, 255, 255, 0.6").attr("x",function(a){return a.x}).attr("y",function(a,b){return 0==b%12?height-7:height-15}).attr("dy",".21em").attr("font-family","sans-serif").attr("font-size","12px").text(function(a,b){return 0==b%12?a.year:months[b%12]})}
function updateTimeLegend(){for(var a=[],b=minYear;b<maxYear;b++)for(var c=0;12>c;c++){var e=xStep+xScale(12*(b-minYear)+c),d={};d.x=e;d.year=b;a.push(d)}svg3.selectAll(".timeLegendLine").data(a).transition().duration(250).style("stroke-dasharray",function(a,b){return isLensing?0==b%12?"2, 1":"1, 3":"1, 2"}).style("stroke-opacity",function(a,b){return 0==b%12?1:isLensing&&lMonth-lensingMul<=b&&b<=lMonth+lensingMul?1:0}).attr("x1",function(a){return a.x}).attr("x2",function(a){return a.x});svg3.selectAll(".timeLegendText").data(a).transition().duration(250).style("fill-opacity",
    function(a,b){return 0==b%12?1:isLensing&&lMonth-lensingMul<=b&&b<=lMonth+lensingMul?1:0}).attr("x",function(a,b){return a.x})}
function drawTimeBox(){svg3.append("rect").attr("class","timeBox").style("fill","#aaa").style("fill-opacity",.2).attr("x",xStep).attr("y",height-25).attr("width",XGAP_*numMonth).attr("height",16).on("mouseout",function(){isLensing=!1;coordinate=d3.mouse(this);lMonth=Math.floor((coordinate[0]-xStep)/XGAP_);updateTransition(250)}).on("mousemove",function(){isLensing=!0;coordinate=d3.mouse(this);lMonth=Math.floor((coordinate[0]-xStep)/XGAP_);updateTransition(250)})}
function updateTimeBox(a){for(var b=0,c=0;c<nodes.length;c++)nodes[c].y>b&&(b=nodes[c].y);svg3.selectAll(".timeBox").transition().duration(a).attr("y",b+12);svg3.selectAll(".timeLegendText").transition().duration(a).style("fill-opacity",function(a,b){return 0==b%12?1:isLensing&&lMonth-lensingMul<=b&&b<=lMonth+lensingMul?1:0}).attr("y",function(a,d){return b+21}).attr("x",function(a,b){return a.x})}var buttonLensingWidth=80,buttonheight=15,roundConner=4,colorHighlight="#fc8",buttonColor="#ddd";
function drawLensingButton(){svg3.append("rect").attr("class","lensingRect").attr("x",1).attr("y",170).attr("rx",roundConner).attr("ry",roundConner).attr("width",buttonLensingWidth).attr("height",buttonheight).style("stroke","#000").style("stroke-width",.1).style("fill",buttonColor).on("mouseover",function(a){svg3.selectAll(".lensingRect").style("fill",colorHighlight)}).on("mouseout",function(a){svg3.selectAll(".lensingRect").style("fill",buttonColor)}).on("click",turnLensing);svg3.append("text").attr("class",
    "lensingText").attr("font-family","sans-serif").attr("font-size","11px").attr("x",buttonLensingWidth/2).attr("y",181).text("Lensing").style("text-anchor","middle").style("fill","#000").on("mouseover",function(a){svg3.selectAll(".lensingRect").style("fill",colorHighlight)}).on("mouseout",function(a){svg3.selectAll(".lensingRect").style("fill",buttonColor)}).on("click",turnLensing)}
function turnLensing(){isLensing=!isLensing;svg3.selectAll(".lensingRect").style("stroke-width",function(){return isLensing?1:.1});svg3.selectAll(".lensingText").style("font-weight",function(){return isLensing?"bold":""});svg3.append("rect").attr("class","lensingRect").style("fill-opacity",0).attr("x",xStep).attr("y",0).attr("width",width).attr("height",height).on("mousemove",function(){coordinate=d3.mouse(this);lMonth=Math.floor((coordinate[0]-xStep)/XGAP_);updateTransition(250);updateTimeLegend()});
    updateTransition(250);updateTimeLegend()}function getColor(a){return"person"===a?color(0):"location"===a?color(1):"organization"===a?color(2):"miscellaneous"===a?color(3):"#000000"}function colorFaded(a){var b=Math.round(230-150/maxDepth*a.depth);return a._children?"rgb("+b+", "+b+", "+b+")":a.children?"rgb("+b+", "+b+", "+b+")":"#aaaacc"}function getBranchingAngle1(a,b){return 2>=b?Math.pow(a,2):Math.pow(a,1)}
function getRadius(a){return a._children?scaleCircle*Math.pow(a.childCount1,scaleRadius):a.children?scaleCircle*Math.pow(a.childCount1,scaleRadius):scaleCircle}function childCount1(a,b){count=0;b.children&&0<b.children.length?(count+=b.children.length,b.children.forEach(function(b){count+=childCount1(a+1,b)}),b.childCount1=count):b.childCount1=0;return count}
function childCount2(a,b){var c=[];b.children&&0<b.children.length&&b.children.forEach(function(a){c.push(a)});c.sort(function(a,b){return parseFloat(a.childCount1)-parseFloat(b.childCount1)});var e=[];c.forEach(function(a,b){a.order1=b;e.splice(e.length/2,0,a)});e.forEach(function(b,c){b.order2=c;childCount2(a+1,b);b.idDFS=nodeDFSCount++})}d3.select(self.frameElement).style("height",diameter+"px");function click(a){};