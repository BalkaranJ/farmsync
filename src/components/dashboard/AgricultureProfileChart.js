'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function AgricultureProfileChart({ data, compareMode }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    if (compareMode) {
      // Create parallel coordinates plot for comparing multiple attributes
      const dimensions = data.dimensions;
      
      // Create a scale for each dimension
      const y = {};
      for (let i = 0; i < dimensions.length; i++) {
        const name = dimensions[i];
        y[name] = d3.scaleLinear()
          .domain(d3.extent(data.items, d => +d[name]))
          .range([height, 0]);
      }
      
      // Build the X scale
      const x = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);
      
      // Create color scale for regions
      const regions = Array.from(new Set(data.items.map(d => d.region)));
      const color = d3.scaleOrdinal()
        .domain(regions)
        .range(d3.schemeCategory10);
      
      // Add a group element for each dimension
      const dimensionGroups = g.selectAll(".dimension")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", d => `translate(${x(d)}, 0)`);
      
      // Add axes
      dimensionGroups.append("g")
        .attr("class", "axis")
        .each(function(d) { 
          d3.select(this).call(d3.axisLeft().scale(y[d])); 
        })
        .style("font-size", "10px")
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(d => d)
        .style("fill", "black")
        .style("font-size", "12px");
      
      // Add lines
      const line = d3.line()
        .defined(d => d !== null)
        .x(d => d.x)
        .y(d => d.y);
      
      // Draw the lines
      const paths = g.selectAll(".region-path")
        .data(data.items)
        .enter()
        .append("path")
        .attr("class", "region-path")
        .style("fill", "none")
        .style("stroke", d => color(d.region))
        .style("stroke-width", 2)
        .style("opacity", 0.7)
        .attr("d", d => {
          const coords = dimensions.map(dim => {
            // Skip null or undefined values
            if (d[dim] === null || d[dim] === undefined) return null;
            return {x: x(dim), y: y[dim](+d[dim])};
          }).filter(p => p !== null); // Filter out null points
          
          return line(coords);
        })
        .on("mouseover", function(event, d) {
          // Highlight the path
          d3.select(this)
            .style("stroke-width", 4)
            .style("opacity", 1);
          
          // Show tooltip with region name
          tooltip.style("opacity", 1)
            .html(`<div class="font-medium">${d.region}</div>`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
          // Reset path styling
          d3.select(this)
            .style("stroke-width", 2)
            .style("opacity", 0.7);
          
          // Hide tooltip
          tooltip.style("opacity", 0);
        });
      
      // Add a legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 20}, 10)`);
      
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
    } else {
      // Create a radar chart for agricultural profile attributes
      const attributes = data.attributes;
      const numAttributes = attributes.length;
      
      // Convert data to the format needed for the radar chart
      const chartData = data.regionData;
      
      // Calculate angle for each attribute
      const angleSlice = Math.PI * 2 / numAttributes;
      
      // Radius scale
      const maxValue = d3.max(chartData, d => d3.max(attributes, attr => d[attr]));
      const rScale = d3.scaleLinear()
        .range([0, height / 2])
        .domain([0, maxValue * 1.1]);
      
      // Set up circles for the grid
      const levels = 5;
      const gridCircles = g.selectAll(".grid-circle")
        .data(d3.range(1, levels + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "grid-circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", d => (height / 2) * (d / levels))
        .style("fill", "none")
        .style("stroke", "#e2e8f0")
        .style("stroke-width", 1);
      
      // Label for each level
      g.selectAll(".axis-label")
        .data(d3.range(1, levels + 1).reverse())
        .enter()
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", d => height / 2 - (height / 2) * (d / levels))
        .attr("dy", "0.4em")
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .style("fill", "#64748b")
        .text(d => Math.round(maxValue * (d / levels) * 100) / 100);
      
      // Draw the axes
      const axes = g.selectAll(".axis")
        .data(attributes)
        .enter()
        .append("g")
        .attr("class", "axis");
      
      // Draw axis lines
      axes.append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", (d, i) => width / 2 * (1 + Math.sin(angleSlice * i - Math.PI / 2) * 1.1))
        .attr("y2", (d, i) => height / 2 * (1 - Math.cos(angleSlice * i - Math.PI / 2) * 1.1))
        .style("stroke", "#e2e8f0")
        .style("stroke-width", 1);
      
      // Draw axis labels
      axes.append("text")
        .attr("class", "axis-text")
        .attr("x", (d, i) => width / 2 * (1 + 1.2 * Math.sin(angleSlice * i - Math.PI / 2)))
        .attr("y", (d, i) => height / 2 * (1 - 1.2 * Math.cos(angleSlice * i - Math.PI / 2)))
        .attr("text-anchor", (d, i) => {
          if (i === 0 || i === numAttributes / 2) return "middle";
          return (i < numAttributes / 2) ? "start" : "end";
        })
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .text(d => d);
      
      // Create color scale for regions
      const color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.region))
        .range(d3.schemeCategory10);
      
      // Draw radar chart for each region
      const radarLine = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);
      
      chartData.forEach((d, i) => {
        const dataValues = attributes.map((attr, j) => ({
          angle: j * angleSlice,
          value: d[attr]
        }));
        
        // Close the path
        dataValues.push(dataValues[0]);
        
        // Draw the path
        g.append("path")
          .datum(dataValues)
          .attr("class", "radar-path")
          .attr("transform", `translate(${width / 2}, ${height / 2})`)
          .attr("d", d => radarLine(d))
          .style("fill", color(d.region))
          .style("fill-opacity", 0.1)
          .style("stroke", color(d.region))
          .style("stroke-width", 2)
          .on("mouseover", function(event) {
            // Highlight the path
            d3.select(this)
              .style("fill-opacity", 0.3)
              .style("stroke-width", 3);
            
            // Show tooltip
            tooltip.style("opacity", 1)
              .html(`<div class="font-medium">${d.region}</div>`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 20) + "px");
          })
          .on("mouseout", function() {
            // Reset path styling
            d3.select(this)
              .style("fill-opacity", 0.1)
              .style("stroke-width", 2);
            
            // Hide tooltip
            tooltip.style("opacity", 0);
          });
      });
      
      // Add a legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 20}, 10)`);
      
      chartData.forEach((d, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(d.region));
        
        legendRow.append("text")
          .attr("x", 15)
          .attr("y", 10)
          .attr("text-anchor", "start")
          .style("font-size", "10px")
          .text(d.region);
      });
    }
    
    // Add title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Agricultural Profile Analysis");
    
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
        <h2 className="text-lg font-semibold text-gray-800">Agricultural Profile Analysis</h2>
        <p className="text-sm text-gray-600">
          {compareMode 
            ? "Comparison of agricultural attributes across regions"
            : "Regional agricultural characteristics radar chart"}
        </p>
      </div>
      
      <div className="h-[400px]">
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