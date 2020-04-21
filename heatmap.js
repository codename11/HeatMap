$(document).ready( () => {

    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    $.ajax({
        url: url, 
        success: (response) => {

            let dataset = JSON.parse(response)
            console.log(dataset);

            // set the dimensions and margins of the graph
            let m = {top: 30, right: 30, bottom: 30, left: 30};
            let w = 1080;
            let h = 600;

            // append the svg object to the body of the page
            let svg = d3.select("#demo")
                .append("svg")
                .attr("width", w + m.left*3)
                .attr("height", h + m.top + m.bottom);

            //Translating axises to accomodate for margin.If we don't, ticks and numbers would look cut of.
            const g = svg.append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");
            
            //Getting actual (only)year parts from dataset.
            let years = dataset.monthlyVariance.map((item, i) => {

                return item.year;

            });

            years = years.filter((item, i) => {
                
                return years.indexOf(item) === i && item%10===0;

            });
            
            // Build X scales and axis:
            let x = d3.scaleBand()
                .range([ 0, w ])
                .domain(years);
            
            //Drawing y axis.
            const xAxis = d3.axisBottom(x);
            
            //Appending x axis to chart.
            g.append("g")
                .attr("transform", "translate("+m.left+"," + h + ")")
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
                .attr("transform", "translate("+m.left+", 0)")
                .call(yAxis);

        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }
        
    });

});