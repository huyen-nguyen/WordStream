function showRelationship() {
    let isRel = document.getElementById("rel").checked;
    console.log(isRel);
    if (isRel) {
        d3.selectAll(".connection").transition().duration(200).attr("opacity", 1);
    }
    else d3.selectAll(".connection").transition().duration(200).attr("opacity", 0);
}

function submitInput(updateData) {
    globalWidth = parseInt(document.getElementById("widthText").innerText);
    globalHeight = parseInt(document.getElementById("heightText").innerText);
    globalMinFont = parseInt(document.getElementById("fontMin").innerText);
    globalMaxFont = parseInt(document.getElementById("fontMax").innerText);
    globalTop = parseInt(document.getElementById("topRankText").innerText);
    let isFlow = document.getElementById("flow").checked;
    let isAv = document.getElementById("av").checked;
    if (isFlow && isAv) {
        console.log("Flow and Av");
        globalFlag = "fa";
    }
    else if (isFlow && !isAv) {
        console.log("Just Flow");
        globalFlag = "f";
    }

    else if (!isFlow && isAv) {
        console.log("Just AV");
        globalFlag = "a";
    }

    else if (!isFlow && !isAv) {
        console.log("None");
        globalFlag = "none"
    }

    // top rank
    console.log("input submitted");

    updateData(globalData);
}

function updateData() {
    let font = "Arial";
    let interpolation = "cardinal";
    let axisPadding = 10;
    let margins = {left: 20, top: 20, right: 10, bottom: 30};
    let ws = d3.layout.wordStream()
        .size([globalWidth, globalHeight])
        .interpolate(interpolation)
        .fontScale(d3.scale.linear())
        .minFontSize(globalMinFont)
        .maxFontSize(globalMaxFont)
        .flag(globalFlag)
        .data(globalData)
        .font(font);
    const newboxes = ws.boxes();
    let minSud = ws.minSud();
    let maxSud = ws.maxSud();
    const legendFontSize = 20;
    let legendHeight = newboxes.topics.length * legendFontSize;

    mainGroup = d3.select("#mainsvg");

    d3.select("#mainsvg")
        .transition()
        .duration(300)
        .attr({
            width: globalWidth + margins.left + margins.top,
            height: globalHeight + +margins.top + margins.bottom + axisPadding + legendHeight
        });

    // d3.select("#mainsvg").selectAll("*").remove();
    var dates = [];
    newboxes.data.forEach(row => {
        dates.push(row.date);
    });

    var xAxisScale = d3.scale.ordinal().domain(dates).rangeBands([0, globalWidth]);
    var xAxis = d3.svg.axis().orient('bottom').scale(xAxisScale);

    axisGroup
        .attr('transform', 'translate(' + (margins.left) + ',' + (globalHeight + margins.top + axisPadding + legendHeight) + ')');

    var axisNodes = axisGroup.call(xAxis);
    styleAxis(axisNodes);

    //Display the vertical gridline
    var xGridlineScale = d3.scale.ordinal().domain(d3.range(0, dates.length + 1)).rangeBands([0, globalWidth + globalWidth / newboxes.data.length]);
    var xGridlinesAxis = d3.svg.axis().orient('bottom').scale(xGridlineScale);

    xGridlinesGroup.attr("id", "gridLines")
        .attr('transform', 'translate(' +
            (margins.left - globalWidth / 24)
            + ',' + (globalHeight + margins.top + axisPadding + legendHeight + margins.bottom) + ')');

    var gridlineNodes = xGridlinesGroup.call(xGridlinesAxis.tickSize(-globalHeight - axisPadding - legendHeight - margins.bottom, 0, 0).tickFormat(''));
    styleGridlineNodes(gridlineNodes);

    // build legend
    legendGroup.attr('transform', 'translate(' + margins.left + ',' + (globalHeight + margins.top) + ')');

    let area = d3.svg.area()
        .interpolate(interpolation)
        .x(function (d) {
            return (d.x);
        })
        .y0(function (d) {
            return d.y0;
        })
        .y1(function (d) {
            return (d.y0 + d.y);
        });

    let topics = newboxes.topics;
    mainGroup.selectAll(".curve")
        .data(newboxes.layers)
        .attr("d", area)
        .style('fill', function (d, i) {
            console.log(newboxes.layers[i]);
            return color(i);
        })
        .attr({
            'fill-opacity': 0,
            stroke: 'black',
            'stroke-width': 0,
            topic: function (d, i) {
                return topics[i];
            }
        });
    // ARRAY OF ALL WORDS
    var allWordsUpdate = [];
    d3.map(newboxes.data, function (row) {
        newboxes.topics.forEach(topic => {
            allWordsUpdate = allWordsUpdate.concat(row.words[topic]);
        });
    });

    allW = JSON.parse(JSON.stringify(allWordsUpdate));
    if (fileName.indexOf("Huffington") >= 0) {
        d3.json("data/linksHuff2012.json", function (error, rawLinks) {
            const threshold = 5;
            const links = rawLinks.filter(d => d.weight > threshold);

            links.forEach(d => {
                d.sourceID = d.sourceID.split(".").join("_").split(" ").join("_");
                d.targetID = d.targetID.split(".").join("_").split(" ").join("_");
            });
            let visibleLinks = [];

            // select only links with: word place = true and have same id
            links.forEach(d => {
                let s = allWordsUpdate.find(w => (w.id === d.sourceID) && (w.placed === true));
                let t = allWordsUpdate.find(w => (w.id === d.targetID) && (w.placed === true));
                if ((s !== undefined) && (t !== undefined)) {
                    d.sourceX = s.x;
                    d.sourceY = s.y;
                    d.targetX = t.x;
                    d.targetY = t.y;
                    visibleLinks.push(d);
                }
            });

            const lineScale = d3.scale.linear()
                .domain(d3.extent(visibleLinks, d => d.weight))
                .range([0.5, 3]);

            opacScale = d3.scale.linear()
                .domain(d3.extent(visibleLinks, d => d.weight))
                .range([0.5, 1]);

            mainGroup.selectAll(".connection")
                .data(visibleLinks)
                .enter()
                .append("line")
                .attr("class", "connection")
                .attr("opacity", 0)
                .attr({
                    "x1": d => d.sourceX,
                    "y1": d => d.sourceY,
                    "x2": d => d.targetX,
                    "y2": d => d.targetY,
                    "stroke": "#444444",
                    "stroke-opacity": d => opacScale(d.weight),
                    "stroke-width": d => lineScale(d.weight)
                });
            drawWordsUpdate();
        });
    }
    else drawWordsUpdate();

    function drawWordsUpdate() {
        var texts = mainGroup.selectAll('.word').data(allWordsUpdate, d => d.id);

        texts.exit()
            .remove();

        texts.transition()
            .duration(1000)
            .attr({
                transform: function (d) {
                    return 'translate(' + d.x + ', ' + d.y + ')rotate(' + d.rotate + ')';
                }
            })
            .select("text")
            .attr({
                visibility: function (d) {
                    return d.placed ? ("visible") : ("hidden");
                }
            });

        texts.enter()
            .append("g")
            .attr({
                transform: function (d) {
                    return 'translate(' + d.x + ', ' + d.y + ')rotate(' + d.rotate + ')';
                }
            })
            .attr("class", "word")
            .append("text")
            .text(function (d) {
                return d.text;
            })
            .attr({
                'font-size': function (d) {
                    return d.fontSize;
                },
                fill: function (d) {
                    return color(d.topicIndex);
                },
                'fill-opacity': function (d) {
                    return opacity(d.sudden)
                },
                'text-anchor': 'middle',
                'alignment-baseline': 'middle',
                topic: function (d) {
                    return d.topic;
                },
                visibility: function (d) {
                    return d.placed ? ("visible") : ("hidden");
                }
            });

        let prevColor;
        // --- Highlight when mouse enter ---


// Get layer path
//         var lineCardinal = d3.svg.line()
//             .x(function (d) {
//                 return d.x;
//             })
//             .y(function (d) {
//                 return d.y;
//             })
//             .interpolate("cardinal");
//
//         var boundary = [];
//         for (var i = 0; i < newboxes.layers[0].length; i++) {
//             var tempPoint = Object.assign({}, newboxes.layers[0][i]);
//             tempPoint.y = tempPoint.y0;
//             boundary.push(tempPoint);
//         }
//
//         for (var i = newboxes.layers[newboxes.layers.length - 1].length - 1; i >= 0; i--) {
//             var tempPoint2 = Object.assign({}, newboxes.layers[newboxes.layers.length - 1][i]);
//             tempPoint2.y = tempPoint2.y + tempPoint2.y0;
//             boundary.push(tempPoint2);
//         }       // Add next (8) elements
//
//         var lenb = boundary.length;
//
//         // Get the string for path
//
//         var combined = lineCardinal(boundary.slice(0, lenb / 2))
//             + "L"
//             + lineCardinal(boundary.slice(lenb / 2, lenb))
//                 .substring(1, lineCardinal(boundary.slice(lenb / 2, lenb)).length)
//             + "Z";
//
//         var topics = newboxes.topics;
//         mainGroup.selectAll('path')
//             .data(newboxes.layers)
//             .enter()
//             .append('path')
//             .attr('d', area)
//             .style('fill', function (d, i) {
//                 return color(i);
//             })
//             .attr({
//                 'fill-opacity': 0,      // = 1 if full color
//                 // stroke: 'black',
//                 'stroke-width': 0.3,
//                 topic: function (d, i) {
//                     return topics[i];
//                 }
//             });
        // ============= Get LAYER PATH ==============
        // var layerPath = mainGroup.selectAll("path").append("path")
        //     .attr("d", combined)
        //     .attr({
        //         'fill-opacity': 0.1,
        //         'stroke-opacity': 0,
        //     });
        //
        // var metValue = [getTfidf(allWordsUpdate).toFixed(2),
        //     getCompactness(allWordsUpdate, layerPath)[0].toFixed(2),
        //     getCompactness(allWordsUpdate, layerPath)[1].toFixed(2),
        //     getDisplayRate(allWordsUpdate, maxFreq)[0].toFixed(2),
        //     getDisplayRate(allWordsUpdate, maxFreq)[1].toFixed(3)];
        //
        // metric2.selectAll(".metricValue").remove();
        // metric2.selectAll(".metricValue")
        //     .data(metValue)
        //     .enter()
        //     .append("text")
        //     .text(d => d)
        //     .attr("class", "metricValue metricDisplay")
        //     .attr("x", "0")
        //     .attr("y", (d, i) => 43 + 36 * i)
        //     .attr("font-weight", "bold");


    }
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