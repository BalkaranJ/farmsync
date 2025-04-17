'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DroughtImpactChart({ data, compareMode }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    if (compareMode) {
      // Line chart showing drought severity over time by region
      const parseTime = d3.timeParse("%Y-%m");
      
      // Process data for line chart
      const regions = Array.from(new Set(data.timeData.map(d => d.region)));
      
      const timeData = data.timeData.map(d => ({
        ...d,
        date: parseTime(d.date)
      }));
      
      // Create scales
      const x = d3.scaleTime()
        .domain(d3.extent(timeData, d => d.date))
        .range([0, width]);
      
      const y = d3.scaleLinear()
        .domain([0, 10])  // Drought severity scale 0-10
        .range([height, 0]);
      
      const color = d3.scaleOrdinal()
        .domain(regions)
        .range(d3.schemeCategory10);
      
      // Add X axis
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(6))
        .style("font-size", "10px");
      
      // Add Y axis
      g.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .style("font-size", "10px");
      
      // Add axis labels
      g.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Date");
      
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Drought Severity (0-10)");
      
      // Create the line generator
      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.severity))
        .curve(d3.curveMonotoneX);
      
      // Group data by region
      const groupedData = d3.group(timeData, d => d.region);
      
      // Draw lines for each region
      groupedData.forEach((values, key) => {
        g.append("path")
          .datum(values)
          .attr("fill", "none")
          .attr("stroke", color(key))
          .attr("stroke-width", 2)
          .attr("d", line);
      });
      
      // Add a legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 10)`);
      
      regions.forEach((region, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(region));
        
        legendRow.append("text")
          .attr("x", 15)
          .attr("y", 10)
          .attr("text-anchor", "start")
          .style("font-size", "10px")
          .text(region);
      });
      
      // Create a tooltip that shows data on hover
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "absolute bg-white p-2 rounded shadow-md text-xs pointer-events-none opacity-0 transition-opacity z-50")
        .style("position", "absolute")
        .style("opacity", 0);
      
      // Add hover functionality with circles at data points
      regions.forEach(region => {
        const regionData = timeData.filter(d => d.region === region);
        
        g.selectAll(`.point-${region.replace(/\s+/g, '')}`)
          .data(regionData)
          .enter()
          .append("circle")
          .attr("class", `point-${region.replace(/\s+/g, '')}`)
          .attr("cx", d => x(d.date))
          .attr("cy", d => y(d.severity))
          .attr("r", 4)
          .attr("fill", color(region))
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .style("opacity", 0)  // Initially hidden
          .on("mouseover", function(event, d) {
            // Show the circle on hover
            d3.select(this)
              .style("opacity", 1);
            
            // Format date for display
            const formatDate = d3.timeFormat("%B %Y");
            
            // Show tooltip
            tooltip.style("opacity", 1)
              .html(`
                <div class="font-medium">${region}</div>
                <div>Date: ${formatDate(d.date)}</div>
                <div>Severity: ${d.severity.toFixed(1)}/10</div>
              `)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 20) + "px");
          })
          .on("mouseout", function() {
            // Hide the circle on mouseout
            d3.select(this)
              .style("opacity", 0);
            
            // Hide tooltip
            tooltip.style("opacity", 0);
          });
      });
    } else {
      // Create a heatmap showing drought impact by region and impact type
      const categories = data.categories;
      const regions = data.regions;
      
      // Set up scales
      const x = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.05);
      
      const y = d3.scaleBand()
        .domain(regions)
        .range([0, height])
        .padding(0.05);
      
      const color = d3.scaleSequential()
        .interpolator(d3.interpolateYlOrRd)
        .domain([0, 10]);  // Drought impact scale 0-10
      
      // Add X axis
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("font-size", "10px");
      
      // Add Y axis
      g.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "10px");
      
      // Create heatmap cells
      g.selectAll("rect")
        .data(data.heatmapData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.region))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.impact))
        .on("mouseover", function(event, d) {
          // Show tooltip
          tooltip.style("opacity", 1)
            .html(`
              <div class="font-medium">${d.region}</div>
              <div>Category: ${d.category}</div>
              <div>Impact: ${d.impact.toFixed(1)}/10</div>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
          // Hide tooltip
          tooltip.style("opacity", 0);
        });
      
      // Add a color legend
      const legendWidth = 20;
      const legendHeight = 150;
      
      const legendScale = d3.scaleSequential()
        .interpolator(d3.interpolateYlOrRd)
        .domain([0, 10]);
      
      const legendAxis = d3.axisRight()
        .scale(d3.scaleLinear().domain([0, 10]).range([legendHeight, 0]))
        .ticks(5);
      
      const legend = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 20}, ${height/2 - legendHeight/2 + margin.top})`);
      
      // Create gradient for legend
      const defs = svg.append("defs");
      
      const gradient = defs.append("linearGradient")
        .attr("id", "drought-gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");
      
      // Add color stops to gradient
      const stops = [0, 0.25, 0.5, 0.75, 1];
      stops.forEach(stop => {
        gradient.append("stop")
          .attr("offset", `${stop * 100}%`)
          .attr("stop-color", legendScale(stop * 10));
      });
      
      // Draw the legend rectangle with gradient
      legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#drought-gradient)");
      
      // Add axis to legend
      legend.append("g")
        .attr("transform", `translate(${legendWidth}, 0)`)
        .call(legendAxis)
        .style("font-size", "10px");
      
      // Add legend title
      legend.append("text")
        .attr("transform", `translate(0, -10)`)
        .style("text-anchor", "start")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text("Impact");
    }
    
    // Add title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Drought Impact Analysis");
    
    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "absolute bg-white p-2 rounded shadow-md text-xs pointer-events-none opacity-0 transition-opacity z-50")
      .style("position", "absolute")
      .style("opacity", 0);
    
    // Cleanup tooltip on unmount
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, compareMode]);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Drought Impact Analysis</h2>
        <p className="text-sm text-gray-600">
          {compareMode 
            ? "Temporal analysis of drought severity across regions"
            : "Regional impact of drought on agricultural systems"}
        </p>
      </div>
      
      <div className="h-[300px]">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          preserveAspectRatio="xMinYMin meet"
        />
      </div>
    </div>
  );
}