'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CorrelationMatrix({ data, datasets }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const margin = { top: 50, right: 20, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Get variables from the data
    const variables = data.variables;
    const numVariables = variables.length;
    
    // Set up scales for x and y axes
    const x = d3.scaleBand()
      .domain(variables)
      .range([0, width])
      .padding(0.05);
    
    const y = d3.scaleBand()
      .domain(variables)
      .range([0, height])
      .padding(0.05);
    
    // Set up color scale for correlation values (-1 to 1)
    const color = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["#ef4444", "#f5f5f5", "#10b981"]);
    
    // Create cells for the correlation matrix
    g.selectAll("rect")
      .data(data.correlations)
      .enter()
      .append("rect")
      .attr("x", d => x(d.var1))
      .attr("y", d => y(d.var2))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.correlation))
      .attr("stroke", "#e5e7eb")
      .on("mouseover", function(event, d) {
        // Highlight cell
        d3.select(this)
          .attr("stroke", "#6b7280")
          .attr("stroke-width", 2);
        
        // Show tooltip
        tooltip.style("opacity", 1)
          .html(`
            <div class="font-medium">${d.var1} vs ${d.var2}</div>
            <div>Correlation: ${d.correlation.toFixed(2)}</div>
            <div class="text-xs italic mt-1">${getCorrelationDescription(d.correlation)}</div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function() {
        // Reset cell styling
        d3.select(this)
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1);
        
        // Hide tooltip
        tooltip.style("opacity", 0);
      });
    
    // Add correlation values to cells
    g.selectAll("text")
      .data(data.correlations)
      .enter()
      .append("text")
      .attr("x", d => x(d.var1) + x.bandwidth() / 2)
      .attr("y", d => y(d.var2) + y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("font-size", "10px")
      .style("fill", d => Math.abs(d.correlation) > 0.5 ? "white" : "black")
      .text(d => d.correlation.toFixed(2));
    
    // Add x axis labels
    g.selectAll(".x-axis-label")
      .data(variables)
      .enter()
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", d => x(d) + x.bandwidth() / 2)
      .attr("y", height + 10)
      .attr("text-anchor", "start")
      .attr("transform", d => `rotate(45, ${x(d) + x.bandwidth() / 2}, ${height + 10})`)
      .style("font-size", "10px")
      .text(d => d);
    
    // Add y axis labels
    g.selectAll(".y-axis-label")
      .data(variables)
      .enter()
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -10)
      .attr("y", d => y(d) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .style("font-size", "10px")
      .text(d => d);
    
    // Add title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Correlation Analysis Between Environmental Factors");
    
    // Add a color legend
    const legendWidth = 300;
    const legendHeight = 20;
    
    const legendScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range([0, legendWidth / 2, legendWidth]);
    
    const legendAxis = d3.axisBottom()
      .scale(legendScale)
      .ticks(5)
      .tickFormat(d3.format(".1f"));
    
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left + (width - legendWidth) / 2}, ${height + margin.top + 40})`);
    
    // Create gradient for legend
    const defs = svg.append("defs");
    
    const gradient = defs.append("linearGradient")
      .attr("id", "correlation-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    
    // Add color stops
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color(-1));
    
    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", color(0));
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color(1));
    
    // Draw the legend rectangle with gradient
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#correlation-gradient)");
    
    // Add axis to legend
    legend.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .style("font-size", "10px");
    
    // Add legend title
    legend.append("text")
      .attr("transform", `translate(${legendWidth / 2}, -5)`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Correlation Coefficient");
    
    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "absolute bg-white p-2 rounded shadow-md text-xs pointer-events-none opacity-0 transition-opacity z-50")
      .style("position", "absolute")
      .style("opacity", 0);
    
    // Helper function to get correlation description
    function getCorrelationDescription(value) {
      const absValue = Math.abs(value);
      if (absValue > 0.9) return value > 0 ? "Very strong positive correlation" : "Very strong negative correlation";
      if (absValue > 0.7) return value > 0 ? "Strong positive correlation" : "Strong negative correlation";
      if (absValue > 0.5) return value > 0 ? "Moderate positive correlation" : "Moderate negative correlation";
      if (absValue > 0.3) return value > 0 ? "Weak positive correlation" : "Weak negative correlation";
      return "Little to no correlation";
    }
    
    // Cleanup tooltip on unmount
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, datasets]);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Environmental Impact Correlations</h2>
        <p className="text-sm text-gray-600">
          Correlation analysis between agricultural activities and environmental indicators
        </p>
      </div>
      
      <div className="h-[500px] overflow-auto">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          preserveAspectRatio="xMinYMin meet"
        />
      </div>
      
      <div className="mt-4 bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Key Findings:</span> Strong positive correlation (0.76) between intensive farming and GHG emissions. Moderate negative correlation (-0.58) between sustainable practices and drought severity.
        </p>
      </div>
    </div>
  );
}