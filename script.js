Promise.all([
    d3.csv("./average_salary.csv"),
    d3.csv("./median_salary.csv"),
    d3.csv("./Teams_Payroll.csv"),
    d3.csv("./Teams_Revenue.csv"),
    d3.csv("./average_both.csv"),
]).then((data) => {
    //svg data
    const svg = d3.select("#canvas");
    const width = 900;
    const height = 600;
    const chart = svg.append("g").attr("transform", `translate(25, 25)`);

    //making a variable for each csv file
    avgSalaryData = data[0];
    medianSalaryData = data[1];
    teamPayrollData = data[2];
    teamRevenueData = data[3];
    avgBothData = data[4];
  
    //create scales for the Average BarChart
    const distinctYearsAverage = [...new Set(avgSalaryData.map((d) => d.year))] 

    var xBarAverage = d3.scaleBand()
        .domain(distinctYearsAverage)
        .range([0, width])
        .padding(0.1);

    var yBarAverage = d3.scaleLinear()
        .domain([0, d3.max(avgSalaryData, (d) => { return (+d.salary)})])
        .range([height, 0]);
  
    //create scales for the Median Barchart
    const distinctYearsMedian = [...new Set(medianSalaryData.map((d) => d.year))] 

    var xBarMedian = d3.scaleBand()
        .domain(distinctYearsMedian)
        .range([0, width])
        .padding(0.1);

    var yBarMedian = d3.scaleLinear()
        .domain([0, d3.max(medianSalaryData, (d) => { return (+d.salary)})])
        .range([height, 0]);

    //create scales for the 2013 chart
    const distinctTeams = [...new Set(teamRevenueData.map((d) => d.abv))] 

    var xBar2013 = d3.scaleBand()
        .domain(distinctTeams)
        .range([0, width])
        .padding(0.1);

    var yBar2013 = d3.scaleLinear()
        .domain([0, d3.max(teamRevenueData, (d) => { return (+d.Year2013)})])
        .range([height, 0]);
    
    //create scales for the 2018 chart
    var xBar2018 = d3.scaleBand()
        .domain(distinctTeams)
        .range([0, width])
        .padding(0.1);

    var yBar2018 = d3.scaleLinear()
        .domain([0, d3.max(teamRevenueData, (d) => { return (+d.Year2018)})])
        .range([height, 0]);
    
    //create scales for the 2022 chart
    var xBar2022 = d3.scaleBand()
        .domain(distinctTeams)
        .range([0, width])
        .padding(0.1);

    var yBar2022 = d3.scaleLinear()
        .domain([0, d3.max(teamRevenueData, (d) => { return (+d.Year2022)})])
        .range([height, 0]);

    //create scales for the average payroll chart
    const distinctYearsAvgBoth = [...new Set(avgBothData.map((d) => d.year))] 

    var xBarPayroll = d3.scaleBand()
        .domain(distinctYearsAvgBoth)
        .range([0, width])
        .padding(0.1);

    var yBarPayroll = d3.scaleLinear()
        .domain([0, d3.max(avgBothData, (d) => { return (+d.avgpay)})])
        .range([height, 0]);

    //create scales for the average revenue chart
    var xBarRevenue = d3.scaleBand()
        .domain(distinctYearsAvgBoth)
        .range([0, width])
        .padding(0.1);

    var yBarRevenue = d3.scaleLinear()
        .domain([0, d3.max(avgBothData, (d) => { return (+d.avgrev)})])
        .range([height, 0]);

    //create scales for the percent chart
    var xBarPercent = d3.scaleBand()
        .domain(distinctYearsAvgBoth)
        .range([0, width])
        .padding(0.1);

    var yBarPercent = d3.scaleLinear()
        .domain([0, d3.max(avgBothData, (d) => { return (+d.percent)})])
        .range([height, 0]);
  
    //color scales
    var ordinalYears = d3
      .scaleOrdinal()
      .domain(distinctYearsAverage) 
      .range(d3.schemeSet3);
    
    var ordinalTeams = d3
      .scaleOrdinal()
      .domain(distinctTeams) 
      .range(d3.schemeSet3);
  
    // Reset Vis function
    const resetVis = () => {
        chart.selectAll("*").remove()
    };
  
    // Average Salary grid
    let grid = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title')
            .attr('y', height + 35)
            .attr('x', width - 60)
            .text('Year');

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -25) 
            .attr('y', -12) 
            .text('Salary (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBarAverage).ticks(distinctYearsAverage).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBarAverage).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove());
  
        //adding actual bars
        averageBars = chart.append('g')
            .selectAll("rect")
            .data(avgSalaryData)
            .join("rect")
                .attr("x", function (d) { return xBarAverage(d.year); } )
                .attr("y", function (d) { return yBarAverage(d.salary); } )
                .attr("fill", function(d) { return ordinalYears(d.year) })
                .attr("width", xBarAverage.bandwidth()) 
                .attr("height", function(d) { return height - yBarAverage(+d.salary); })
                .style("opacity", 1)

        //hover information
        averageBars
        .on('mouseover', (event,d) => {
            d3.select(event.currentTarget)
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block') 
                .html(`<h1>${d.year}</h1>        
                    <div>Average Salary (in Millons): $${d.salary}M</div>
                    `);
                    })
                .on('mouseleave', (event) => { 
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };
  
    //Median Salary grid
    let grid2 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title') 
            .attr('y', height + 35) 
            .attr('x', width - 60) 
            .text('Year'); 

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -10) 
            .attr('y', -10)
            .text('Salary (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBarMedian).ticks(distinctYearsMedian).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBarMedian).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove()); 
  
        //adding actual bars
        medianBars = chart.append('g')
            .selectAll("rect")
            .data(medianSalaryData)
            .join("rect")
                .attr("x", function (d) { return xBarMedian(d.year); } )
                .attr("y", function (d) { return yBarMedian(d.salary); } )
                .attr("fill", function(d) { return ordinalYears(d.year) })
                .attr("width", xBarMedian.bandwidth()) 
                .attr("height", function(d) { return height - yBarMedian(+d.salary); }) 
                .style("opacity", 1)

        //hover information
        medianBars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.year}</h1>        
                    <div>Median Salary (in Millons): $${d.salary}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };

    //2013 grid
    let grid3 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title') 
            .attr('y', height + 35) 
            .attr('x', width - 60) 
            .text('Team'); 

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -10) 
            .attr('y', -10)
            .text('Money (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBar2013).ticks(distinctTeams).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBar2013).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove()); 
  
        //adding actual bars
        Rev2013Bars = chart.append('g')
            .selectAll("rect")
            .data(teamRevenueData)
            .join("rect")
                .attr("x", function (d) { return xBar2013(d.abv); } )
                .attr("y", function (d) { return yBar2013(d.Year2013); } )
                .attr("fill", "red")
                .attr("width", xBar2013.bandwidth()) 
                .attr("height", function(d) { return height - yBar2013(+d.Year2013); }) 
                .style("opacity", 1)

        //hover information
        Rev2013Bars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.team}</h1>        
                    <div>Revenue (in Millons): $${d.Year2013}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
        
        //adding actual bars
        Pay2013Bars = chart.append('g')
            .selectAll("rect")
            .data(teamPayrollData)
            .join("rect")
                .attr("x", function (d) { return xBar2013(d.abv); } )
                .attr("y", function (d) { return yBar2013(d.Year2013); } )
                .attr("fill", "green")
                .attr("width", xBar2013.bandwidth()) 
                .attr("height", function(d) { return height - yBar2013(+d.Year2013); }) 
                .style("opacity", 1)

        //hover information
        Pay2013Bars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.team}</h1>        
                    <div>Payroll (in Millons): $${d.Year2013}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };

    //2018 grid
    let grid4 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title') 
            .attr('y', height + 35) 
            .attr('x', width - 60) 
            .text('Team'); 

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -10) 
            .attr('y', -10)
            .text('Money (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBar2018).ticks(distinctTeams).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBar2018).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove()); 
  
        //adding actual bars
        Rev2018Bars = chart.append('g')
            .selectAll("rect")
            .data(teamRevenueData)
            .join("rect")
                .attr("x", function (d) { return xBar2018(d.abv); } )
                .attr("y", function (d) { return yBar2018(d.Year2018); } )
                .attr("fill", "red")
                .attr("width", xBar2018.bandwidth()) 
                .attr("height", function(d) { return height - yBar2018(+d.Year2018); }) 
                .style("opacity", 1)

        //hover information
        Rev2018Bars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.team}</h1>        
                    <div>Revenue (in Millons): $${d.Year2018}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
        
        //adding actual bars
        Pay2018Bars = chart.append('g')
            .selectAll("rect")
            .data(teamPayrollData)
            .join("rect")
                .attr("x", function (d) { return xBar2018(d.abv); } )
                .attr("y", function (d) { return yBar2018(d.Year2018); } )
                .attr("fill", "green")
                .attr("width", xBar2018.bandwidth()) 
                .attr("height", function(d) { return height - yBar2018(+d.Year2018); }) 
                .style("opacity", 1)

        //hover information
        Pay2018Bars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.team}</h1>        
                    <div>Payroll (in Millons): $${d.Year2018}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };
    
    //2022 grid
    let grid5 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title') 
            .attr('y', height + 35) 
            .attr('x', width - 60) 
            .text('Team'); 

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -10) 
            .attr('y', -10)
            .text('Money (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBar2022).ticks(distinctTeams).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBar2022).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove()); 
  
        //adding actual bars
        Rev2022Bars = chart.append('g')
            .selectAll("rect")
            .data(teamRevenueData)
            .join("rect")
                .attr("x", function (d) { return xBar2022(d.abv); } )
                .attr("y", function (d) { return yBar2022(d.Year2022); } )
                .attr("fill", "red")
                .attr("width", xBar2022.bandwidth()) 
                .attr("height", function(d) { return height - yBar2022(+d.Year2022); }) 
                .style("opacity", 1)

        //hover information
        Rev2022Bars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.team}</h1>        
                    <div>Revenue (in Millons): $${d.Year2022}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
        
        //adding actual bars
        Pay2022Bars = chart.append('g')
            .selectAll("rect")
            .data(teamPayrollData)
            .join("rect")
                .attr("x", function (d) { return xBar2022(d.abv); } )
                .attr("y", function (d) { return yBar2022(d.Year2022); } )
                .attr("fill", "green")
                .attr("width", xBar2022.bandwidth()) 
                .attr("height", function(d) { return height - yBar2022(+d.Year2022); }) 
                .style("opacity", 1)

        //hover information
        Pay2022Bars 
        .on('mouseover', (event,d) => { 
            d3.select(event.currentTarget) 
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block')
                .html(`<h1>${d.team}</h1>        
                    <div>Payroll (in Millons): $${d.Year2022}M</div>
                    `);
                    })
                .on('mouseleave', (event) => {  
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };

    // Average Payroll grid
    let grid6 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title')
            .attr('y', height + 35)
            .attr('x', width - 60)
            .text('Year');

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -25) 
            .attr('y', -12) 
            .text('Payroll (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBarPayroll).ticks(distinctYearsAvgBoth).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBarPayroll).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove());
  
        //adding actual bars
        payrollBars = chart.append('g')
            .selectAll("rect")
            .data(avgBothData)
            .join("rect")
                .attr("x", function (d) { return xBarPayroll(d.year); } )
                .attr("y", function (d) { return yBarPayroll(d.avgpay); } )
                .attr("fill", function(d) { return ordinalYears(d.year) })
                .attr("width", xBarPayroll.bandwidth()) 
                .attr("height", function(d) { return height - yBarPayroll(+d.avgpay); })
                .style("opacity", 1)

        //hover information
        payrollBars
        .on('mouseover', (event,d) => {
            d3.select(event.currentTarget)
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block') 
                .html(`<h1>${d.year}</h1>        
                    <div>Average Payroll (in Millons): $${d.avgpay}M</div>
                    `);
                    })
                .on('mouseleave', (event) => { 
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };

    // Average Revenue grid
    let grid7 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title')
            .attr('y', height + 35)
            .attr('x', width - 60)
            .text('Year');

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -25) 
            .attr('y', -12) 
            .text('Revenue (Millions)');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBarRevenue).ticks(distinctYearsAvgBoth).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBarRevenue).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove());
  
        //adding actual bars
        revBars = chart.append('g')
            .selectAll("rect")
            .data(avgBothData)
            .join("rect")
                .attr("x", function (d) { return xBarRevenue(d.year); } )
                .attr("y", function (d) { return yBarRevenue(d.avgrev); } )
                .attr("fill", function(d) { return ordinalYears(d.year) })
                .attr("width", xBarRevenue.bandwidth()) 
                .attr("height", function(d) { return height - yBarRevenue(+d.avgrev); })
                .style("opacity", 1)

        //hover information
        revBars
        .on('mouseover', (event,d) => {
            d3.select(event.currentTarget)
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block') 
                .html(`<h1>${d.year}</h1>        
                    <div>Average Revenue (in Millons): $${d.avgrev}M</div>
                    `);
                    })
                .on('mouseleave', (event) => { 
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };

    // Percent grid
    let grid8 = () => {
        resetVis();

        //add axes
        chart.append('text') //x-axis
            .attr('class', 'axis-title')
            .attr('y', height + 35)
            .attr('x', width - 60)
            .text('Year');

        chart.append('text') //y-axis
            .attr('class', 'axis-title') 
            .attr('x', -25) 
            .attr('y', -12) 
            .text('Percentage');   

        chart.append("g")
            .attr("transform", "translate(0," + (height) + ")") 
            .call(
                d3.axisBottom(xBarPercent).ticks(distinctYearsAvgBoth).tickSize(-height-10) 
                ).call((g) => g.select(".domain").remove()); 
        chart.append("g")
            .call(
                d3.axisLeft(yBarPercent).ticks(10).tickSize(-width-10)
                ).call((g) => g.select(".domain").remove());
  
        //adding actual bars
        revBars = chart.append('g')
            .selectAll("rect")
            .data(avgBothData)
            .join("rect")
                .attr("x", function (d) { return xBarPercent(d.year); } )
                .attr("y", function (d) { return yBarPercent(d.percent); } )
                .attr("fill", function(d) { return ordinalYears(d.year) })
                .attr("width", xBarPercent.bandwidth()) 
                .attr("height", function(d) { return height - yBarPercent(+d.percent); })
                .style("opacity", 1)

        //hover information
        revBars
        .on('mouseover', (event,d) => {
            d3.select(event.currentTarget)
                .style("stroke", "white");
                
            d3.select('#hover') 
                .style('display', 'block') 
                .html(`<h1>${d.year}</h1>        
                    <div>Percentage of Revenue spent on Payroll: ${d.percent}%</div>
                    `);
                    })
                .on('mouseleave', (event) => { 
                    d3.select('#hover').style('display', 'none');
                    d3.select(event.currentTarget) 
                        .style("stroke", "none");
                });
    };

    let grid9 = () => {
        resetVis();
    };
  
    function scroll(n, offset, func1, func2) {
      const el = document.getElementById(n);
      return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
          direction == "down" ? func1() : func2();
        },
        //start 75% from the top of the div
        offset: offset
      });
    }
  
    //triger these functions on page scroll
    new scroll("div2", "90%", grid2, grid);
    new scroll("div3", "90%", grid3, grid2);
    new scroll("div4", "90%", grid4, grid3);
    new scroll("div5", "90%", grid5, grid4);
    new scroll("div6", "90%", grid6, grid5);
    new scroll("div7", "90%", grid7, grid6);
    new scroll("div8", "90%", grid8, grid7);
    new scroll("div9", "90%", grid9, grid8);
  
    //start grid on page load
    grid();
});