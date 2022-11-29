let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest()
let data
let values

let heightScale
let xScale
let xAxesScale
let yAxesScale

let width = 800;
let height= 400;
let padding = 40;

let svg = d3.select("svg");

let drawCanves =()=>{
  svg.attr("height", height)
     .attr("width", width)
}

let generateScales =()=>{
heightScale =  d3.scaleLinear()
  .domain([0, d3.max(values, (d) => d[1])])
  .range([0, height - (2*padding)]);
  xScale = d3.scaleLinear()
             .domain([0, values.length - 1])
             .range([padding, width - padding])
   
  let dateArr = values.map((d)=>{
    return new Date(d[0])
  })
  xAxesScale = d3.scaleTime()
              .domain([d3.min(dateArr), d3.max(dateArr)])
              .range([padding, width - padding])
  yAxesScale = d3.scaleLinear()
.domain([0, d3.max(values, (d) => d[1])])
                 .range([height - padding, padding])
                 

 
}
let drawBars =()=>{
 let tooltip = d3.select("body")
                 .append("div")
                 .attr("id", "tooltip")
                 .style("visibility", "hidden")
                 .style("height", "auto")
                 .style("width", "auto")
                 
 svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-gdp", (d)=>{
   return d[1]
 })
    .attr("data-date", (d)=> d[0])
    .attr("width", (width - (2*padding))/ values.length)
    .attr("height", (d)=> heightScale(d[1]))
    .attr("y", (d)=> (height - padding) - heightScale(d[1]))
    .attr("x", (d, i)=> {
   return xScale(i)
 })
    .on("mouseover", (item)=>{
   tooltip.transition()
          .style("visibility", "visible")
   tooltip.text(item[0] + "\n" + item[1] + "$")
          .attr("data-date", item[0])
 })
   .on("mouseleave", (d)=>{
   tooltip.transition()
          .style("visibility", "hidden")
 })
   
}

let generateAxes =()=>{
 let xAxis = d3.axisBottom(xAxesScale)
 let yAxis = d3.axisLeft(yAxesScale)
 
  svg.append("g")
     .call(xAxis)
     .attr("transform", "translate(0, " + (height - padding) + ")")
     .attr("id", "x-axis")
  
  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + " ,0)")
}
    
req.open("GET", url, true) 
req.onload=()=>{
data = JSON.parse(req.responseText)
values = data.data;
  drawCanves()
  generateScales()
  drawBars()
  generateAxes()
}
req.send()
