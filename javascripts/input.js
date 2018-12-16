

var axis = d3.svg.axis().ticks(4);
var axisFont = d3.svg.axis().tickValues([0,25,50,75,100]);
// var verticalAxis = d3.svg.axis().orient("left").ticks(5);

d3.select('#widthSlider').call(d3.slider()
    .axis(axis)
    .value([600,800])
    .min(600)
    .max(1400)
    .step(20)
    .on("slide", function (evt, value) {
    d3.select('#widthText').text(value[1]);
}))
;
d3.select('#heightSlider').call(d3.slider()
    .axis(axis)
    .value([200,800])
    .min(200)
    .max(1000)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#heightText').text(value[1]);
    }))
;
d3.select('#fontSlider').call(d3.slider().axis(axisFont).value([10, 25]).on("slide", function (evt, value) {
    d3.select('#fontMin').text(value[0].toFixed(0));
    d3.select('#fontMax').text(value[1].toFixed(0));
}));

d3.select('#topRankSlider').call(d3.slider()
    .axis(axis)
    .value([10,300])
    .min(10)
    .max(300)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#topRankText').text(value[1]);
    }))
;
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


function submitInput(){
    globalWidth = parseInt(document.getElementById("widthText").innerText);
    globalHeight = parseInt(document.getElementById("heightText").innerText);
    globalMinFont = parseInt(document.getElementById("fontMin").innerText);
    globalMaxFont = parseInt(document.getElementById("fontMax").innerText);
    loadNewLayout();
}

function loadNewLayout(){
    svg.selectAll("*").remove();
    // svg2.selectAll("*").remove();
    // svg3.selectAll("*").remove();
    fileName = fileName.slice(0, -4).slice(5);
    loadData();
}