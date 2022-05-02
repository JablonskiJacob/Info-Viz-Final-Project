
(function() { 
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.

    var width=800, height=600
    
    d3.csv("./cars.csv").then((data) => {
        var data = d3
            .rollup(data, v => Math.round(d3.mean(v, d => d.cty)), d => d.manufacturer)
        var data = Array.from(data, ([name, value]) => ({ name, value }));

        //find the unique options for data.manufacturer
        const distinctValues = [...new Set(data.map((d) => d.name))] 
 
        var x = d3.scaleBand()
            .domain(distinctValues) //use manufactuer as input
            .range([0, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => { return (+d.value)})])
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
           .text('Manufacturer'); //actual text to display
 
        chart.append('text') //y-axis
           .attr('class', 'axis-title') //Optional: change font size and font weight
           .attr('x', 10) //add some x padding to clear the y axis
           .attr('y', 25) //add some y padding to align the end of the axis with the text
           .text('CTY'); //actual text to display

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
                .attr("x", function (d, i) { return (i * 54); } )
                .attr("y", function (d) { return (height - d.value*25); } )
                .attr("fill", function(d) { return ordinal(d.name) })
                .attr("width", 45) //use the bandwidth returned from our X scale
                .attr("height", function(d) { return height - y(+d.value); }) //full height - scaled y
                .style("opacity", 0.85)

        console.log(data)

            bars //let’s attach an event listener to points (all svg circles)
            .on('mouseover', (event,d) => { //when mouse is over point
                d3.select(event.currentTarget) //add a stroke to highlighted point 
                    .style("stroke", "black");
         
                d3.select('#tooltip2') // add text inside the tooltip div
                    .style('display', 'block') //make it visible
                    .html(`<h1 class="tooltip2-title">${d.name}</h1>        
                        <div>City (CTY) MPG: ${d.value}</div>
                `);
                })
            .on('mouseleave', (event) => {  //when mouse isn’t over point
                d3.select('#tooltip2').style('display', 'none'); // hide tooltip
                d3.select(event.currentTarget) //remove the stroke from point
                    .style("stroke", "none");
            });
    }) 
    })();