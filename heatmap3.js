$(document).ready( () => {

    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    $.ajax({
        url: url, 
        success: (response) => {

            let dataset = JSON.parse(response)
            console.log(dataset);

            let baseTemp = dataset.baseTemperature;
            // set the dimensions and margins of the graph
            let m = {top: 30, right: 30, bottom: 30, left: 30};
            let w = 800;
            let h = 600;

            // append the svg object to the body of the page
            let svg = d3.select("#demo")
                .append("svg")
                .attr("width", w + m.left*2)
                .attr("height", h + m.top + m.bottom*3);

            //Translating axises to accomodate for margin.If we don't, ticks and numbers would look cut of.
            const g = svg.append("g").attr("transform", "translate(" + m.left*2 + ","+m.top*3+")");
            
            //Getting actual (only)year parts from dataset.
            let years = dataset.monthlyVariance.map((item, i) => {

                return item.year;

            });

            let months = dataset.monthlyVariance.map((item, i) => {

                return item.months-1;

            });

            /*years = years.filter((item, i) => {
                
                return years.indexOf(item) === i && item%10===0;

            });*/
            //Calculating year.
            let minYear = new Date(d3.min(years));//Calculating first year in dataset.
            let maxYear = new Date(d3.max(years));//Calculating last year in dataset.
            
            // Build X scales and axis:
            let x = d3.scaleTime()
                .range([ 0, w ])
                .domain([minYear,maxYear]);

            //Drawing y axis.
            const xAxis = d3.axisBottom(x);
            
            //Appending x axis to chart.
            g.append("g")
                .attr("transform", "translate(0," + h + ")")
                .attr("class", "tick axis")
                .attr("id", "x-axis")
                .call(xAxis);

            //y axis.
            //Months for y axis.
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            let y = d3.scaleBand()
                .range([0, h])//Actual y axis length.
                .domain(monthNames);//Setting values from zero to max value on y axis.
            
            let yAxis = d3.axisLeft(y);

            g.append("g")
                .attr("transform", "translate(0, 0)")
                .attr("id", "y-axis")
                .call(yAxis);

            let rectWidth = w / dataset.monthlyVariance.length;
            let rectHeight = h / 12;

            let tempVariance = dataset.monthlyVariance.map((item, i) => {

                return item.variance;

            });

            //Calculating year.
            let minVariance = d3.min(tempVariance);//Calculating lowest temp in dataset.
            let maxVariance = d3.max(tempVariance);//Calculating highest temp in dataset.

            //Color scale
            let colorScale = d3.scaleLinear()
            .range(["white", "red"])
            .domain([minVariance, maxVariance]);

            //Creating tooltip element.
            const tooltip = d3.select('#demo')
                .append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0);

            //Creating bar/s.
            g.selectAll("rect")
                .data(dataset.monthlyVariance)
                .enter()
                .append("rect")
                .attr("x", (d,i) => {
                    
                    if(x(d.year)){
                        return x(d.year);
                    }
                    
                })
                .attr("y", (d,i) => { 

                    if(y(monthNames[d.month])){
                        return y(monthNames[d.month]);
                    }
                    
                })
                .attr("width", (d, i) =>{
                    return (i*rectWidth);
                    //return x.bandwidth();
                    //return rectWidth;
                })
                .attr("height", (d, i) =>{
                    //return y.bandwidth();
                    return rectHeight;
                })
                .attr("data-year", (d,i) => {
                    return d.year;
                })
                .attr("data-month", (d,i) => {
                    
                    return d.month-1;
                })
                .attr("data-temp", (d,i) => {
                    
                    return baseTemp+d.variance;
                })
                .attr("class", "cell")
                .style("fill", (d) => { 
                    return colorScale(baseTemp+d.variance);
                })
                .on('mouseover', (d, i) => {
                    tooltip.style('opacity', 1);
                    tooltip.html("<div style='margin-bottom: 5px;'>Year: "+d.year+" Month: "+d.month+" variance: "+d.variance+"</div>");
                })
                .on('mouseout', (d) => {
                    tooltip.style('opacity', 0);
                });
                
                //Draw the Heat Label:
                svg.append("text")
                    .attr("id", "title")
                    .attr("class", "headline")
                    .attr("x", w / 2)
                    .attr("y", m.top)
                    .attr("font-family", "sans-serif")
                    .attr("fill", "green")
                    .attr("text-anchor", "middle")
                    .text("Monthly Global Land-Surface Temperature"); 

                //Draw the Heat Sub-Label:
                svg.append("text")
                    .attr("id", "description")
                    .attr("class", "headline1")
                    .attr("x", w / 2)
                    .attr("y", m.top*2)
                    .attr("font-family", "sans-serif")
                    .attr("fill", "green")
                    .attr("text-anchor", "middle")
                    .text("1753 - 2015: base temperature 8.66℃");

        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }
        
    });

});