import * as d3 from 'd3';
import {useEffect,  useRef, useState} from 'react';

function Chart(props) {
    
const {tempData, citySelected, hasCitySelected, todayMonthString, todayDay, todayYear } = props;

const city = citySelected

const data = tempData
console.log("chart data check", data)
// const [data, setData] = useState([])
const svgRef = useRef();

//   setData(this?.props.tempData)
  
  useEffect(()=>{
   
    // const margin = ({top: 20, right: 0, bottom: 100, left: 0})
    //setting up svg
    const w = 400;
    const h = 300;
    // const svg = {};
    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll("*").remove()
    

    // const svg = d3.select(svgRef.current)
    const svg = svgEl
      .attr('width', w)
      .attr('height', h)
      .style('background', 'black')
      .style('margin-top', '50')
      .style('overflow', 'visible')


    //setting the scaling
    const xScale = d3.scaleBand() //ordinal scale
        .range([0, w]) // coordinates for your grid
        .domain(data.map(d=>d.date)) // actual data  

    const yScale = d3.scaleLinear()
      .domain([0,d3.max(data, function(d){return d.temp})]) //your actual data
      .range([h,0]); // the coordinates for your grid

    // create a scale between colors that varies by the frequency
	const barColors = d3.scaleLinear()
    .domain([0,d3.max(data, d => d.temp)])
    .range(["rgba(209, 14, 0,0)", "rgba(209, 14, 600,1)"])//"#b51417" ""])

    //setting the axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(data.length)
  
        // console.log("tick dates", data.map((e)=> e.date))
        // console.log("tick dates", data.map((e)=> e.temp))
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(data.length);
    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${h})`)
    svg.append('g')
      .call(yAxis);
    


    const bars = svg
	  .selectAll("rect")
	  .data(data)
	  .enter().append("rect")
	    .attr('x', d => xScale(d.date)) //uses date as domain for xScale to know where to position along range
	    .attr('y', d => yScale(d.temp)) // uses temp as domain for yScale to know where to posistion along range
	    .attr('width', xScale.bandwidth()) //in pixels, equal value for every bar (width/#data points)
      .attr('height', d => yScale(0) - yScale(d.temp)) // in pixels, takes range, this is what gets the bars to not be floating everywhere (take max height and subtract from calculated)
	    // .style("padding", "5px")
	    // .style("margin", "5px")
	    // .style("width", d => `${d * 5}px`)
	    .attr("fill", function(d) {return barColors(d.temp)}) //how to set background color for svg elements is fill
	    .attr("stroke", "black")
	    .attr("stroke-width", 10)

    svg.append("g")  
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("y", h - 250)
      .attr("x", w )
      .attr("text-anchor", "end")
      .attr("fill", "#6FFFB0")
      .style("font", "20px 'Segoe UI'")
      .text(`time period for ${todayMonthString} ${todayDay}`);

      svg.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 55)
      .attr("dy", "-4.7em")
      .attr("text-anchor", "end")
      .attr("fill", "#6FFFB0")
      .style("font", "20px 'Segoe UI'")
      .text("temperature ℉");

      d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .attr('style', 'position: absolute; opacity: 0;')

    d3.select('svg').selectAll('rect')
        .data(data)
        .join('rect')
        .attr('r', 3)
        .on('mouseover', function(event, d){
            d3.select('#tooltip')
                .transition()
                .duration(0)
                .style('opacity', 1)
                .text(`${d.temp}℉`) 
            
            d3.select('#tooltip')
            d3.select(this).attr('class','highlight')  
                .transition()
                .duration(300)
                .attr('width', xScale.bandwidth())
                .attr('y', function(d){return yScale(d.temp) - 10;})
                .attr('height', function(d){return h - yScale(d.temp) + 10;})
                .attr("fill", "#333333")
        })
        .on('mouseout', function(event, d){
            d3.select('#tooltip')
                .style('opacity', 0)
            d3.select(this).attr('class','bar')
            d3.select(this)
                .transition()
                .duration(300)
                .attr('width', xScale.bandwidth())
                .attr('y', function(d){return yScale(d.temp);})
                .attr('height', function(d) {return h - yScale(d.temp)})
                .attr("fill", function(d) {return barColors(d.temp)})
        })
        .on('mousemove', function(event){
            d3.select('#tooltip')
            .style('left', event.pageX+10 + 'px')
            .style('top', event.pageY+10 + 'px')
        })
  })

return (
	<div>
        <p id="cityName">{hasCitySelected ? city : ''}</p>
        <svg ref={svgRef}></svg>

    </div>
	)
}

export default Chart;