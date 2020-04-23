$(document).ready( () => {

    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    $.ajax({
        url: url, 
        success: (response) => {

            let res = JSON.parse(response)
            //console.log(res);
        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }
    });
    // set the dimensions and margins of the graph
    let m = {top: 30, right: 30, bottom: 30, left: 30};
    let w = 450 - m.left - m.right;
    let h = 450 - m.top - m.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#demo")
        .append("svg")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    // Labels of row and columns
    let myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

    // Build X scales and axis:
    let x = d3.scaleBand()
    .range([ 0, w ])
    .domain(myGroups)//console.log(x("A"));
    .padding(0.01);
    
    svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x));

    // Build Y scales and axis:
    let y = d3.scaleBand()
    .range([ h, 0 ])
    .domain(myVars)
    .padding(0.01);
    //console.log(x("A"), x("B"), x("D"), x("E"));
    svg.append("g")
    .call(d3.axisLeft(y));

    // Build color scale
    let myColor = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([1,100]);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

        svg.selectAll()
            .data(data, (d) => {
                console.log(data);
                return d.group+':'+d.variable;
            })
            .enter()
            .append("rect")
            .attr("x", (d) => { 
                return x(d.group);
            })
            .attr("y", (d) => { 
                return y(d.variable) 
            })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => { 
                return myColor(d.value);
            });

    });

});