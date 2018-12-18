// pre-defined size
var initWidth = 800,
    initHeight = 800,
    initMinFont = 12,
    initMaxFont = 50
;

var globalWidth = initWidth,
    globalHeight = initHeight,
    globalMinFont = initMinFont,
    globalMaxFont = initMaxFont,
    topRank
;

var axis = d3.svg.axis().ticks(4);
var axisFont = d3.svg.axis().tickValues([0,25,50,75,100]);
// var verticalAxis = d3.svg.axis().orient("left").ticks(5);



d3.select('#widthSlider').call(d3.slider()
    .axis(axis)
    .value([0,initWidth])
    .min(0)
    .max(2000)
    .step(20)
    .on("slide", function (evt, value) {
    d3.select('#widthText').text(value[1]);
}))
;
d3.select('#heightSlider').call(d3.slider()
    .axis(axis)
    .value([0,initHeight])
    .min(0)
    .max(2000)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#heightText').text(value[1]);
    }))
;
d3.select('#fontSlider').call(d3.slider().axis(axisFont).value([initMinFont, initMaxFont]).on("slide", function (evt, value) {
    d3.select('#fontMin').text(value[0].toFixed(0));
    d3.select('#fontMax').text(value[1].toFixed(0));
}));

var metricLine = [1,2,3,4,5];
var metricName = ["Importance value (tf-idf ratio): ","Compactness: ","All Words Area/Stream Area:","Weighted Display" +
" Rate:","Average Normalized Frequency: "];

var metric = d3.select("body").append("svg")
    .attr("width",360)
    .attr("height", 300)
    .attr("class","metricSVG")
    .attr("id","metricSVG");

metric.append("text").attr("y", 15).attr("font-weight",600).text("Metrics");

metric.selectAll("rect")
    .data(metricLine)
    .enter()
    .append("rect")
    .attr("id", "metric" + function(d){
        return d
    })
    .attr("class",".metricText")
    .attr("x","13")
    .attr("y",(d,i) => 50*i+40)
    .attr("rx","5")
    .attr("ry","5")
    .attr("width","330")
    .attr("height","38")
    .style("fill","#eeeeee")
    .attr("stroke","#8f8f8f");

metric.selectAll(".metricText")
    .data(metricName)
    .enter()
    .append("text")
    .text(d => d)
    .attr("x","20")
    .attr("y",(d,i) => 63+i*50)
    .attr("font-size","13px");


function updateTopRank(){
    d3.select(".holderCP").append("span")
        .attr("id","topRankText")
        .attr("class","topRankText topRank textSlider");

    d3.select(".holderCP").append("div")
        .attr("id","topRankSlider")
        .attr("class","topRankAxis topRank slider");

    d3.select("#topRankText").text(topRank);

    d3.select('#topRankSlider').call(d3.slider()
        .axis(axis)
        .value([0,topRank])
        .min(0)
        .max(300)
        .step(5)
        .on("slide", function (evt, value) {
            d3.select('#topRankText').text(value[1]);
        }))
    ;
}

function submitInput(){
    globalWidth = parseInt(document.getElementById("widthText").innerText);
    globalHeight = parseInt(document.getElementById("heightText").innerText);
    globalMinFont = parseInt(document.getElementById("fontMin").innerText);
    globalMaxFont = parseInt(document.getElementById("fontMax").innerText);
    topRank = parseInt(document.getElementById("topRankText").innerText);
    loadNewLayout();
}

function loadNewLayout(){
    svg.selectAll("*").remove();
    // svg2.selectAll("*").remove();
    // svg3.selectAll("*").remove();
    fileName = fileName.slice(0, -4).slice(5);
    loadData(function(){

    });
}

// d3.select("#heightSlider")
//     .attr("id","test")
//     .call(d3.slider()
//     .axis(verticalAxis)
//     .value(800)
//     .min(600)
//     .max(1200)
//     .step(100)
//     .orientation("vertical")
//     .on("slide", function (evt, value) {
//         d3.select('#heightText').text(value);
//     }))
// ;