var margin = {
    top: 10,
    right:30,
    bottom: 100,
    left: 10
  },
  width = 1400 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

var units = "Widgets";

  // format variables
  var formatNumber = d3.format(",.0f"),    // zero decimal places
      format = function(d) { return formatNumber(d) + " " + units; }
      color = d3.scaleOrdinal(d3.schemeCategory10);

  // append the svg object to the body of the page
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Set the sankey diagram properties
  var sankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);

  var path = sankey.link();





// Read data
d3.csv("melted.csv", function(error, data) {

  graph = {
    "nodes": [],
    "links": []
  };

  data.forEach(function(d) {
    graph.nodes.push({
      "name": d.name_profile
    });
    graph.nodes.push({
      "name": d.name_video
    });
    graph.links.push({
      "source": d.name_profile,
      "target": d.name_video,
      "value": +d.value
    });
  });

//   function mousemoved() {
//   var m = d3.mouse(this),
//       p = closestPoint(link.node(), m);
//   // line.attr("x1", p[0]).attr("y1", p[1]).attr("x2", m[0]).attr("y2", m[1]);
//   circle.attr("cx", p[0]).attr("cy", p[1]).attr('fill', 'red');
// }
//
// function closestPoint(pathNode, point) {
//   var pathLength = pathNode.getTotalLength(),
//       precision = 8,
//       best,
//       bestLength,
//       bestDistance = Infinity;
//
//   // linear scan for coarse approximation
//   for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
//     if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
//       best = scan, bestLength = scanLength, bestDistance = scanDistance;
//     }
//   }
//
//   // binary search for precise estimate
//   precision /= 2;
//   while (precision > 0.5) {
//     var before,
//         after,
//         beforeLength,
//         afterLength,
//         beforeDistance,
//         afterDistance;
//     if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
//       best = before, bestLength = beforeLength, bestDistance = beforeDistance;
//     } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
//       best = after, bestLength = afterLength, bestDistance = afterDistance;
//     } else {
//       precision /= 2;
//     }
//   }
//
//   best = [best.x, best.y];
//   best.distance = Math.sqrt(bestDistance);
//   return best;
//
//   function distance2(p) {
//     var dx = p.x - point[0],
//         dy = p.y - point[1];
//     return dx * dx + dy * dy;
//   }
// }


  // return only the distinct / unique nodes
  graph.nodes = d3.keys(d3.nest()
    .key(function(d) {
      return d.name;
    })
    .object(graph.nodes));


  // loop through each link replacing the text with its index from node
  graph.links.forEach(function(d, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });

  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { "name": d };
  });
  // console.log(graph);
  var div = d3.select("body").append("div")
      .attr("class", "tooltipsankey")
      .style("opacity", 0);


  sankey
        .nodes(graph.nodes)
        .links(graph.links)
        // .nodeSort(graph.nodes..value)
        .layout(32);

        // add in the links
         var link = svg.append("g").selectAll(".link")
             .data(graph.links)
           .enter().append("path")
             .attr("class", "link")
             .attr("d", path)
              .style('z-index', '1')
             .style("stroke-width", function(d) { return 22*Math.pow(d.value,5); })
             .sort(function(a, b) { return b.value - a.dvalue; })


             // var link_trasparent = svg.append("g").selectAll(".link")
             //     .data(graph.links)
             //   .enter().append("path")
             //     .attr("class", "link")
             //     .attr("d", path)
             //     .style('z-index', '10')
             //     .style('stroke', 'transparent')
             //     .style("stroke-width", function(d) { return 10*d.value; })
             //     .sort(function(a, b) { return b.value - a.dvalue; })
             //     .on('mouseover', d=>)
             // .on("mousemove", mousemoved)

         // var circle = link.append("circle")
         //     .attr("cx", -10)
         //     .attr("cy", -10)
         //     .attr("r", 50)
         //

         // link.on("mouseover", function(d) {
         //             div.transition()
         //                 .duration(200)
         //                 .style("opacity", .9);
         //             div .html(d.value)
         //                 .style("left", (d3.event.pageX) + "px")
         //                 .style("top", (d3.event.pageY - 28) + "px");
         //             })
         //         .on("mouseout", function(d) {
         //             div.transition()
         //                 .duration(500)
         //                 .style("opacity", 0);
         //         });


         // add the link titles
         link.append("title")
               .text(function(d) {
           		return d.value; })


         // add in the nodes
         var node = svg.append("g").selectAll(".node")
             .data(graph.nodes)
           .enter().append("g")
             .attr("class", "node")
             .attr("transform", function(d) {
       		  return "translate(" + d.x + "," + d.y + ")"; })
             .call(d3.drag()
               .subject(function(d) {
                 return d;
               })
               .on("start", function() {
                 this.parentNode.appendChild(this);
               })
               .on("drag", dragmove));

         // add the rectangles for the nodes
         node.append("rect")
             .attr("height", function(d) { return d.dy; })
             .attr("width", sankey.nodeWidth())
             .style("fill", function(d) {
       		  return d.color = color(d.name.replace(/ .*/, "")); })
             .style("stroke", function(d) {
       		  return d3.rgb(d.color).darker(2); })
           .append("title")
             .text(function(d) {
       		  return d.name + "\n" + format(d.value); });



             node.append("svg:image")
              	.attr("x", 0)
              	.attr("y", 0)
              	.attr("height", 60)
                // .attr("width", 90)
                .attr("xlink:href", function(d){
                	let suffix = "/data/image_person/image_person/"
                	let filename = suffix + d.name
                	return filename
              	})


         // the function for moving the nodes
         function dragmove(d) {
           d3.select(this)
             .attr("transform",
                   "translate("
                      + d.x + ","
                      + (d.y = Math.max(
                         0, Math.min(height - d.dy, d3.event.y))
                        ) + ")");
           sankey.relayout();
           link.attr("d", path);
         }



})
