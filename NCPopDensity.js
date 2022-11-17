/* select color1/ color2 to change the color scheme
   select toggle to not display the country boundray */


var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = 1200 - margin.left - margin.right;
var height = 900 - margin.top - margin.bottom;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//geomercator porjection, scaled and translated to fit on the screen
var projection = d3.geoMercator()
    .center([0, 0])
    .scale(4000)
    .translate([-1150, 3300])

let proj = d3.geoPath().projection(projection)

//dictionary that connects .csv to .json
var popById = d3.map();
var nameById = d3.map();

var main = () => {
    d3.json("NC.json").then(data => {
        //console.log(data)
    
        //Define Tooltip here, initially hidden
        var tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
    
        var x = d3.scaleSqrt()
            .domain([20, 1100])
            .rangeRound([440, 950]);
    
        
        d3.csv('NC.csv').then(data2 => {
            //console.log(data2)
            data2.forEach(d => {
                d['Population Density'] = +d['Population Density'];
				popById.set(d.id, +d['Population Density']);
				nameById.set(d.id, d.County);
            })
			//console.log(data2);
			//console.log(popById);
			//console.log(nameById);
    
            //color scale, by threshold
            var color = d3.scaleThreshold()
                .domain([0,20, 50, 90, 200, 500, 1800])
                .range(d3.schemeYlGn[9]);
    
            //the scale
            //inspiration: https://bl.ocks.org/mbostock/5562380
            var g = svg.append("g")
                .attr("class", "key")
                .attr("transform", "translate(-85,40)");
    
            //turns the range back to the domain, into an array, to use for the scale
            var range =  color.range().map(d=>{return color.invertExtent(d)})
            range.splice(0,1) //get rid of undefined
            range.splice(range.length - 2, 2)
    
            //console.log(range)
            
            // the scale, made of rectangles
            g.selectAll("rect")
                .data(range)
                .enter().append("rect")
                .attr("height", 8)
                .attr("x", function (d) { return x(d[0]); })
                .attr("width", function (d) { return x(d[1]) - x(d[0]); })
                .attr("fill", function (d) { return color(d[0]); });
    
            //text over the scale
            //https://bl.ocks.org/mbostock/5562380
            g.append("text")
                .attr("class", "scale")
                .attr("x", 360)
                .attr("y", -7)
                .attr("fill", "black")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .attr("font-size", "14px")
                .text("Population (residents) per Square Mile of Land Area");
            //the ticks on the scale
            g.style("font", "14px times")
                .call(d3.axisBottom(x)
                .tickSize(13)
                .tickValues(color.domain()))
                .select(".domain")
                .remove(); //get rid of horizontal line
    
            //draw the topojson
			//console.log(topojson.feature(data, data.objects.cb_2015_north_carolina_county_20m).features)
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.cb_2015_north_carolina_county_20m).features)
                .enter()
                .each(d => {
				    //console.log(d.properties.GEOID)
                    // Need to fill with relevant info, reading from the csv 
				    d.county = nameById.get(d.properties.GEOID);
				    d.popdens = popById.get(d.properties.GEOID);
                    //console.log(d)
                })
                .append("path")
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("fill", d => color(d.popdens)) //color by population density
                .attr("d", proj) //the projection path
                .on("mouseover", d => { //append tooltip and fill with relevant info
                    tooltip
                        .transition()
                        .duration(1)
                        .style("opacity", 1)
    
                    //Add tooltip html assigning left, middle, right ids for css
                    tooltip.html(`${d.county}<br>
                        <span id="left">Population Density</span>
                        <span id="middle">:</span>
                        <span id="right">${d.popdens} residents/mi^2</span>
                        `)
                        .style("left", `${d3.event.pageX}px`)
                        .style("top", `${d3.event.pageY}px`)
                })
                .on("mouseout", () => { //hide tooltip on mouseout
                    tooltip.transition().duration(1).style("opacity", 0)
                })
        })
    });
}

var main1 = () => {
    d3.json("NC.json").then(data => {
        //console.log(data)
    
        //Define Tooltip here, initially hidden
        var tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
    
        var x = d3.scaleSqrt()
            .domain([20, 1100])
            .rangeRound([440, 950]);
    
        
        d3.csv('NC.csv').then(data2 => {
            //console.log(data2)
            data2.forEach(d => {
                d['Population Density'] = +d['Population Density'];
				popById.set(d.id, +d['Population Density']);
				nameById.set(d.id, d.County);
            })
			//console.log(data2);
			//console.log(popById);
			//console.log(nameById);
    
            //color scale, by threshold
            var color = d3.scaleThreshold()
                .domain([0,20, 50, 90, 200, 500, 1800])
                .range(d3.schemePastel1);
    
            //the scale
            //inspiration: https://bl.ocks.org/mbostock/5562380
            var g = svg.append("g")
                .attr("class", "key")
                .attr("transform", "translate(-85,40)");
    
            //turns the range back to the domain, into an array, to use for the scale
            var range =  color.range().map(d=>{return color.invertExtent(d)})
            range.splice(0,1) //get rid of undefined
            range.splice(range.length - 2, 2)
            //console.log(range)
            
            // the scale, made of rectangles
            g.selectAll("rect")
                .data(range)
                .enter().append("rect")
                .attr("height", 8)
                .attr("x", function (d) { return x(d[0]); })
                .attr("width", function (d) { return x(d[1]) - x(d[0]); })
                .attr("fill", function (d) { return color(d[0]); });
    
            //text over the scale
            //https://bl.ocks.org/mbostock/5562380
            g.append("text")
                .attr("class", "scale")
                .attr("x", 360)
                .attr("y", -7)
                .attr("fill", "black")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .attr("font-size", "14px")
                .text("Population (residents) per Square Mile of Land Area");
            //the ticks on the scale
            g.style("font", "14px times")
                .call(d3.axisBottom(x)
                .tickSize(13)
                .tickValues(color.domain()))
                .select(".domain")
                .remove(); //get rid of horizontal line
    
            //draw the topojson
			//console.log(topojson.feature(data, data.objects.cb_2015_north_carolina_county_20m).features)
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.cb_2015_north_carolina_county_20m).features)
                .enter()
                .each(d => {
				    //console.log(d.properties.GEOID)
                    // Need to fill with relevant info, reading from the csv 
				    d.county = nameById.get(d.properties.GEOID);
				    d.popdens = popById.get(d.properties.GEOID);
                    //console.log(d)
                })
                .append("path")
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("fill", d => color(d.popdens)) //color by population density
                .attr("d", proj) //the projection path
                .on("mouseover", d => { //append tooltip and fill with relevant info
                    tooltip
                        .transition()
                        .duration(1)
                        .style("opacity", 1)
    
                    //Add tooltip html assigning left, middle, right ids for css
                    tooltip.html(`${d.county}<br>
                        <span id="left">Population Density</span>
                        <span id="middle">:</span>
                        <span id="right">${d.popdens} residents/mi^2</span>
                        `)
                        .style("left", `${d3.event.pageX}px`)
                        .style("top", `${d3.event.pageY}px`)
                })
                .on("mouseout", () => { //hide tooltip on mouseout
                    tooltip.transition().duration(1).style("opacity", 0)
                })
        }) 
    });
}

var main2 = () => {
    d3.json("NC.json").then(data => {
        //console.log(data)      
        d3.csv('NC.csv').then(data2 => {
            //console.log(data2)
            data2.forEach(d => {
                d['Population Density'] = +d['Population Density'];
				popById.set(d.id, +d['Population Density']);
				nameById.set(d.id, d.County);
            })

            //draw the topojson
			//console.log(topojson.feature(data, data.objects.cb_2015_north_carolina_county_20m).features)
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.cb_2015_north_carolina_county_20m).features)
                .enter()
                .each(d => {
				    //console.log(d.properties.GEOID)
                    // Need to fill with relevant info, reading from the csv 
				    d.county = nameById.get(d.properties.GEOID);
				    d.popdens = popById.get(d.properties.GEOID);
                    //console.log(d)
                })
                .append("path")
                .attr("stroke", "black")   
                .attr("d", proj) //the projection path
        })
    });
}

//Toggle color scale 1 and 2
var toggle = () => {
    var x = document.getElementById("select").value;
    var t = document.getElementById("title");
    switch(x){
        case 'color1':
            d3.selectAll("svg > *").remove();
            t.style.color='#1b8b4f';
            t.innerHTML = 'North Carolina Population Density'
            main();
            break;
        case 'color2':
            d3.selectAll("svg > *").remove();
            t.style.color='#7570b3';
            t.innerHTML = 'North Carolina Population Density'
            main1();
            break;
		case 'toggle':
            d3.selectAll("svg > *").remove();
            t.style.color='black';
            t.innerHTML = 'North Carolina Population Density'
            main2();
            break;
    }

}

main();