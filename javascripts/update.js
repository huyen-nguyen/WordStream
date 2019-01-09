var globalWidth = initWidth,
    globalHeight = initHeight,
    globalMinFont = initMinFont,
    globalMaxFont = initMaxFont,
    globalFlag = initFlag

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
    var offsetLegend = -10;
    var axisPadding = 10;
    var margins = {left: 20, top: 20, right: 10, bottom: 30};
    var ws = d3.layout.wordStream()
        .size([globalWidth, globalHeight])
        .minFontSize(globalMinFont)
        .maxFontSize(globalMaxFont)
        .data(gdata)
        .flag(globalFlag);

    var newboxes = ws.boxes(),
        minFreq = ws.minFreq(),
        maxFreq = ws.maxFreq();

    var legendFontSize = 20;
    var legendHeight = newboxes.topics.length*legendFontSize;

    d3.select("#mainsvg")
        .transition()
        .duration(300)
        .attr({
        width: globalWidth + margins.left + margins.top,
        height: globalHeight + + margins.top + margins.bottom + axisPadding + offsetLegend + legendHeight
    });

    var data = ws.boxes().data;

    var dates = [];
    data.forEach(row =>{
        dates.push(row.date);
    });

    // ARRAY OF ALL WORDS
    var allWordsUpdate = [];
    d3.map(data, function(row){
        newboxes.topics.forEach(topic=>{
            allWordsUpdate = allWordsUpdate.concat(row.words[topic]);
        });
    });

    up = JSON.parse(JSON.stringify(allWordsUpdate));
    var opacity = d3.scale.linear()
        .domain([minFreq, maxFreq])
        .range([0.5,1]);

    mainGroup.selectAll('g').data(allWordsUpdate, d => d.id)
        .transition()
        .duration(1500)
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

    var metValue = [getTfidf(allWordsUpdate).toFixed(2),
        // getCompactness(allWordsUpdate, layerPath)[0].toFixed(2),
        // getCompactness(allWordsUpdate, layerPath)[1].toFixed(2),
        getDisplayRate(allWordsUpdate, maxFreq)[0].toFixed(2),
        getDisplayRate(allWordsUpdate, maxFreq)[1].toFixed(3)];

    metric2.selectAll(".metricValue").remove();
    metric2.selectAll(".metricValue")
        .data(metValue)
        .enter()
        .append("text")
        .text(d => d)
        .attr("class","metricValue metricDisplay")
        .attr("x","0")
        .attr("y",(d,i) =>43+ 36*i)
        .attr("font-weight", "bold");

    var xAxisScale = d3.scale.ordinal().domain(dates).rangeBands([0, globalWidth]);
    var xAxis = d3.svg.axis().orient('bottom').scale(xAxisScale);

    axisGroup.selectAll("g")
        .attr('transform', 'translate(' + (margins.left) + ',' + (globalHeight + margins.top+axisPadding+legendHeight+offsetLegend) + ')');

    var axisNodes = axisGroup.call(xAxis);
    styleAxis(axisNodes);

    //Display the vertical gridline
    var xGridlineScale = d3.scale.ordinal().domain(d3.range(0, dates.length+1)).rangeBands([0, globalWidth+globalWidth/data.length]);
    var xGridlinesAxis = d3.svg.axis().orient('bottom').scale(xGridlineScale);

    xGridlinesGroup.selectAll('g')
        .attr('transform', 'translate(' + (margins.left-globalWidth/data.length/2) + ',' + (globalHeight+margins.top + axisPadding+legendHeight+margins.bottom+offsetLegend) + ')');

    var gridlineNodes = xGridlinesGroup.call(xGridlinesAxis.tickSize(-globalHeight-axisPadding-legendHeight-margins.bottom, 0, 0).tickFormat(''));
    styleGridlineNodes(gridlineNodes);


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