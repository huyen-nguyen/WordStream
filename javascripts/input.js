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
    .value([600,initWidth])
    .min(600)
    .max(1400)
    .step(20)
    .on("slide", function (evt, value) {
    d3.select('#widthText').text(value[1]);
}))
;
d3.select('#heightSlider').call(d3.slider()
    .axis(axis)
    .value([200,initHeight])
    .min(200)
    .max(1000)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#heightText').text(value[1]);
    }))
;
d3.select('#fontSlider').call(d3.slider().axis(axisFont).value([initMinFont, initMaxFont]).on("slide", function (evt, value) {
    d3.select('#fontMin').text(value[0].toFixed(0));
    d3.select('#fontMax').text(value[1].toFixed(0));
}));

function updateTopRank(){
    d3.select(".holder2").append("span")
        .attr("id","topRankText")
        .attr("class","topRankText topRank");

    d3.select(".holder2").append("div")
        .attr("id","topRankSlider")
        .attr("class","topRankAxis topRank");

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