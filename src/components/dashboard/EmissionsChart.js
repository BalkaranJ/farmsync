'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EmissionsChart({ data, compareMode }) {
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
    
    // Set up scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.sector))
      .range([0, width])
      .padding(0.2);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalEmissions) * 1.1])
      .range([height, 0]);
    
    // Draw axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .style("font-size", "10px");
    
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + " Mt"))
      .style("font-size", "10px");
    
    // Add axis labels
    g.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Agricultural Sector");
    
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("GHG Emissions (Mt CO₂e)");
    
    // Draw bars
    if (compareMode) {
      // In compare mode, show stacked bars for different emission types
      const subgroups = ["methane", "nitrousOxide", "co2"];
      
      const stackedData = d3.stack()
        .keys(subgroups)
        (data);
      
      const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#f97316", "#84cc16", "#06b6d4"]);
      
      g.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.sector))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", function(event, d) {
          const gasType = {
            "methane": "Methane",
            "nitrousOxide": "Nitrous Oxide",
            "co2": "CO₂"
          }[d3.select(this.parentNode).datum().key];
          
          const value = (d[1] - d[0]).toFixed(1);
          
          // Show tooltip
          tooltip.style("opacity", 1)
            .html(`
              <div class="font-medium">${d.data.sector}</div>
              <div>${gasType}: ${value} Mt</div>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
      
      // Add a legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 10)`);
      
      subgroups.forEach((group, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(group));
        
        legendRow.append("text")
          .attr("x", 15)
          .attr("y", 10)
          .attr("text-anchor", "start")
          .style("font-size", "10px")
          .text({
            "methane": "Methane",
            "nitrousOxide": "Nitrous Oxide",
            "co2": "CO₂"
          }[group]);
      });
    } else {
      // In regular mode, show simple bars for total emissions
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.sector))
        .attr("y", d => y(d.totalEmissions))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.totalEmissions))
        .attr("fill", "#f97316")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "#ea580c");
          
          // Show tooltip
          tooltip.style("opacity", 1)
            .html(`
              <div class="font-medium">${d.sector}</div>
              <div>Emissions: ${d.totalEmissions.toFixed(1)} Mt CO₂e</div>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "#f97316");
          tooltip.style("opacity", 0);
        });
    }
    
    // Add title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Agricultural Greenhouse Gas Emissions");
    
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
        <h2 className="text-lg font-semibold text-gray-800">GHG Emissions Analysis</h2>
        <p className="text-sm text-gray-600">
          {compareMode 
            ? "Breakdown of agricultural greenhouse gas emissions by type"
            : "Total greenhouse gas emissions by agricultural sector"}
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