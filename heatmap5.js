$(document).ready( () => {

    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    $.ajax({
        url: url, 
        success: (response) => {

            let dataset = JSON.parse(response);
            let baseTemp = dataset.baseTemperature;
            //console.log(dataset.monthlyVariance);

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
            
            let years = dataset.monthlyVariance.map((item, i) => {
                return item.year;
            });

            let months = dataset.monthlyVariance.map((item, i) => {
                return item.month;
            });

            let date = dataset.monthlyVariance.map((item, i) => {
                return new Date(item.year, item.month-1);
            });
            
            //Calculating year.
            let minYear = new Date(d3.min(date));//Calculating first year in dataset.
            let maxYear = new Date(d3.max(date));//Calculating last year in dataset.
            console.log(minYear, maxYear);

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

            //console.log(minMonth, maxMonth);

            let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
                    
                   
                    return rectWidth*i;
                    
                    
                })
                .attr("y", (d,i) => { 
                    console.log(d.month);
                    return  y(monthNames[d.month-1]);
                    
                })
                .attr("width", (d, i) =>{
                    //return (i*rectWidth);
                    //return x.bandwidth();
                    return 5;
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
                .on('mouseover', (d, i) => {
                    tooltip.style('opacity', 1);
                    tooltip.html("<div style='margin-bottom: 5px;'>Year: "+d.year+" Month: "+d.month+" variance: "+d.variance+"</div>");
                })
                .on('mouseout', (d) => {
                    tooltip.style('opacity', 0);
                });

        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }
        
    });

});