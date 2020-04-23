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
            console.log(date);
            
        },
        error: (xhr, ajaxOptions, thrownError) => {

            console.log(xhr, ajaxOptions, thrownError);
            
        }
        
    });

});