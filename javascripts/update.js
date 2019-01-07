var globalWidth = initWidth,
    globalHeight = initHeight,
    globalMinFont = initMinFont,
    globalMaxFont = initMaxFont,
    globalFlag = initFlag,
    updateGroup = mainGroup;
;

var axis = d3.svg.axis().ticks(4);
var axisFont = d3.svg.axis().tickValues([0,25,50,75,100]);
// var verticalAxis = d3.svg.axis().orient("left").ticks(5);
function testJS(){
    console.log("Mouse test JS");
}
function testJQuery(){
    console.log("Mouse test Jquery");
}

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


var metricName = [["Importance value (tf-idf ratio) "],["Compactness "],["All Words Area/Stream Area"],
    ["Weighted Display Rate"],["Average Normalized Frequency "]];

var metric = d3.select("body").append("svg")
    .attr("width",360)
    .attr("height", 250)
    .attr("class","metricSVG")
    .attr("id","metricSVG");

metric.append("text").attr("y", 15).attr("font-weight",600).text("Metrics");

d3.select("body")
    // .append("div")
    .append("table")
    .attr("class","metTable")
    .style("border-collapse", "collapse")
    .style("border", "2px black solid")

    .selectAll("tr")
    .data(metricName)
    .enter().append("tr")

    .selectAll("td")
    .data(function(d){return d;})
    .enter().append("td")
    .style("border", "1px black solid")
    .style("padding", "10px")
    .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")})
    .on("mouseout", function(){d3.select(this).style("background-color", "white")})
    .text(function(d){return d;})
    .style("font-size", "13px");

var metric2 = d3.select("body").append("svg")
    .attr("width",100)
    .attr("height", 300)
    .attr("class","metricSVG2")
    .attr("id","metricSVG2");

// draw line
var frontier = d3.select("#cp").append("line")
    .attr("id","frontier")
    .attr("x1", 170)
    .attr("x2", 170)
    .attr("y1", 300)
    .attr("y2", 350)
    .attr("class","frontier");


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
        // .on("mouseup", submitInput())
    ;
}
function submitInput(){
    globalWidth = parseInt(document.getElementById("widthText").innerText);
    globalHeight = parseInt(document.getElementById("heightText").innerText);
    globalMinFont = parseInt(document.getElementById("fontMin").innerText);
    globalMaxFont = parseInt(document.getElementById("fontMax").innerText);
    topRank = parseInt(document.getElementById("topRankText").innerText);
    var isFlow = document.getElementById("flow").checked;
    var isAv = document.getElementById("av").checked;
    if (isFlow && isAv){
        console.log("Flow and Av");
        globalFlag = "fa";
    }
    else if (isFlow && !isAv) {
        console.log("Just Flow");
        globalFlag = "f";}

    else if (!isFlow && isAv){
        console.log("Just AV");
        globalFlag = "a";}

    else if (!isFlow && !isAv){
        console.log("None");
        globalFlag = "none"}

    console.log("input submitted");
    updateData(mainGroup);
}
var up = [];
function updateData(mainGroup){
    var ws = d3.layout.wordStream()
        .size([globalWidth, globalHeight])
        .minFontSize(globalMinFont)
        .maxFontSize(globalMaxFont)
        .data(gdata)
        .flag(globalFlag);

    var newboxes = ws.boxes(),
        minFreq = ws.minFreq(),
        maxFreq = ws.maxFreq();

    console.log("new boxes");
    console.log(newboxes);

    var data = ws.boxes().data;
    console.log("new data");

    // ARRAY OF ALL WORDS
    var allWordsUpdate = [];
    d3.map(data, function(row){
        newboxes.topics.forEach(topic=>{
            allWordsUpdate = allWordsUpdate.concat(row.words[topic]);
        });
    });
    var opacity = d3.scale.linear()
        .domain([minFreq, maxFreq])
        .range([0.5,1]);

    up = JSON.parse(JSON.stringify(allWordsUpdate));
    var gUpdate = mainGroup.selectAll('g').data(allWordsUpdate, d => d.id)
        .transition()
        .duration(1000)
        .attr({transform: function(d){return 'translate('+d.x+', '+d.y+')rotate('+d.rotate+')';}})
        .select("text")
        .text(function(d){return d.text;})
        .attr({
            'font-size': function(d){return d.fontSize;},
            fill: function(d){return color(d.topicIndex);},
            'fill-opacity': function(d){return opacity(d.frequency)},
            'text-anchor': 'middle',
            'alignment-baseline': 'middle',
            topic: function(d){return d.topic;},
            visibility: function(d){ return d.placed ? ("visible"): ("hidden");}
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

// metric.selectAll("rect")
//     .data(metricLine)
//     .enter()
//     .append("rect")
//     .attr("id", "metric" + function(d){
//         return d
//     })
//     .attr("class",".metricRect")
//     .attr("x","20")
//     .attr("y",(d,i) => 50*i+40)
//     .attr("rx","5")
//     .attr("ry","5")
//     .attr("width","320")
//     .attr("height","36")
//     .style("fill","#eeeeee")
//     .attr("stroke","#8f8f8f");

// metric.selectAll(".metricText")
//     .data(metricName)
//     .enter()
//     .append("text")
//     .text(d => d)
//     .attr("class","metricDisplay")
//     .attr("x","33")
//     .attr("y",(d,i) =>i*50);