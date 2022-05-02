(function() { 
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.

    var width=800, height=600
    
    d3.csv("./median_salary.csv").then((data) => {
        console.log(data);

        //find the unique options for Years
        const distinctValues = [...new Set(data.map((d) => d.year))] 

        console.log(distinctValues);

        var x = d3.scaleBand()
            .domain(distinctValues) //use manufactuer as input
            .range([0, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => { return (+d.salary)})])
            .range([height, 0]);

        //Creating an colorscale for nominal (categorical data)
        var ordinal = d3.scaleOrdinal().domain(distinctValues)              
            .range(d3.schemeSet3); //use d3 Color Scheme #3 as output colors

        var svg = d3.select("#barchart")
        //create an svg g element and add 50px of padding
        const chart = svg.append("g")
            .attr("transform", `translate(50, 50)`);

         //add axes
        chart.append('text') //x-axis
           .attr('class', 'axis-title') //Optional: change font size and font weight
           .attr('y', height + 35) //add to the bottom of graph (-25 to add it above axis)
           .attr('x', width - 60) //add to the end of X-axis (-60 offsets the width of text)
           .text('Year'); //actual text to display
 
        chart.append('text') //y-axis
           .attr('class', 'axis-title') //Optional: change font size and font weight
           .attr('x', -10) //add some x padding to clear the y axis
           .attr('y', -25) //add some y padding to align the end of the axis with the text
           .text('Salary (Millions)'); //actual text to display    

        //add axes
        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") //put our axis on the bottom
            .call(
                d3.axisBottom(x).ticks(distinctValues).tickSize(-height-10) //ticks + tickSize adds grids
                ).call((g) => g.select(".domain").remove()); //Optional: remove the axis endpoints
        chart.append("g")
            .call(
                d3.axisLeft(y).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove()); //Optional: remove the axis endpoints
        
        bars = chart.append('g')
            .selectAll("rect")
            .data(data)
            .join("rect")
                .attr("x", function (d) { return x(d.year); } )
                .attr("y", function (d) { return y(d.salary); } )
                .attr("fill", function(d) { return ordinal(d.year) })
                .attr("width", x.bandwidth()) //use the bandwidth returned from our X scale
                .attr("height", function(d) { return height - y(+d.salary); }) //full height - scaled y
                .style("opacity", 1)
    }) 
    })();