'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function MapVisualization({ data, selectedRegion, selectedDatasets }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = svgRef.current.clientWidth;
    const height = 500;
    
    // Setup map projection
    const projection = d3.geoMercator()
      .center([-96, 60])  // Center on Canada
      .scale(width * 0.6)
      .translate([width / 2, height / 2]);
    
    const path = d3.geoPath().projection(projection);
    
    // Draw base map
    const g = svg.append("g");
    
    // Add a background rect for the map
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f0f9ff");
    
    // Draw provinces/territories
    g.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => {
        // If we're focusing on a specific region, highlight it
        if (selectedRegion !== 'All Canada' && d.properties.name === selectedRegion) {
          return "#93c5fd";  // Highlight color
        }
        return "#e0f2fe";  // Default color
      })
      .attr("stroke", "#60a5fa")
      .attr("stroke-width", 0.5)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("fill", "#93c5fd");
          
        // Show tooltip
        tooltip.style("opacity", 1)
          .html(`
            <div class="font-medium">${d.properties.name}</div>
            <div>GHG: ${d.properties.ghgEmissions} Mt CO₂e</div>
            <div>Agricultural Area: ${d.properties.agriculturalArea} Mha</div>
            <div>Drought Impact: ${d.properties.droughtImpact}/10</div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("fill", selectedRegion !== 'All Canada' && d.properties.name === selectedRegion ? "#93c5fd" : "#e0f2fe");
          
        // Hide tooltip
        tooltip.style("opacity", 0);
      });
    
    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "absolute bg-white p-2 rounded shadow-md text-xs pointer-events-none opacity-0 transition-opacity z-50")
      .style("position", "absolute")
      .style("opacity", 0);
    
    // Draw data layers based on selected datasets
    if (selectedDatasets.find(d => d.id === 'emissions')) {
      // Add emissions data visualization (e.g., circles proportional to emissions)
      g.selectAll(".emission-marker")
        .data(data.emissionsPoints)
        .enter()
        .append("circle")
        .attr("class", "emission-marker")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", d => Math.sqrt(d.emissions) * 5) // Scale the size based on emissions value
        .attr("fill", "#f97316") // Orange color for emissions
        .attr("fill-opacity", 0.6)
        .attr("stroke", "#ea580c")
        .attr("stroke-width", 0.5);
    }
    
    if (selectedDatasets.find(d => d.id === 'drought')) {
      // Add drought severity visualization (e.g., heatmap or pattern)
      g.selectAll(".drought-area")
        .data(data.droughtAreas)
        .enter()
        .append("path")
        .attr("class", "drought-area")
        .attr("d", path)
        .attr("fill", d => {
          // Color scale based on drought severity
          const severityColors = ["#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444"];
          return severityColors[Math.min(Math.floor(d.severity), 4)];
        })
        .attr("stroke", "none")
        .attr("fill-opacity", 0.5);
    }
    
    if (selectedDatasets.find(d => d.id === 'agriculture')) {
      // Add agricultural land use visualization
      g.selectAll(".agriculture-area")
        .data(data.agricultureAreas)
        .enter()
        .append("path")
        .attr("class", "agriculture-area")
        .attr("d", path)
        .attr("fill", "#10b981") // Green for agriculture
        .attr("stroke", "#059669")
        .attr("stroke-width", 0.5)
        .attr("fill-opacity", 0.3);
    }
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(20, ${height - 150})`);
    
    legend.append("rect")
      .attr("width", 170)
      .attr("height", 130)
      .attr("fill", "white")
      .attr("stroke", "#d1d5db")
      .attr("rx", 5)
      .attr("ry", 5);
    
    legend.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .text("Legend");
    
    const legendItems = [];
    
    if (selectedDatasets.find(d => d.id === 'emissions')) {
      legendItems.push({ color: "#f97316", label: "GHG Emissions" });
    }
    
    if (selectedDatasets.find(d => d.id === 'drought')) {
      legendItems.push({ color: "#ef4444", label: "Drought Severity" });
    }
    
    if (selectedDatasets.find(d => d.id === 'agriculture')) {
      legendItems.push({ color: "#10b981", label: "Agricultural Land" });
    }
    
    if (selectedDatasets.find(d => d.id === 'soil')) {
      legendItems.push({ color: "#8b5cf6", label: "Soil Correlation" });
    }
    
    if (selectedDatasets.find(d => d.id === 'headtax')) {
      legendItems.push({ color: "#f59e0b", label: "Head Tax Zones" });
    }
    
    legendItems.forEach((item, i) => {
      const y = 40 + i * 20;
      
      legend.append("rect")
        .attr("x", 10)
        .attr("y", y)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", item.color);
      
      legend.append("text")
        .attr("x", 30)
        .attr("y", y + 10)
        .attr("font-size", "12px")
        .text(item.label);
    });
    
    // Add a note about the data source
    svg.append("text")
      .attr("x", width - 20)
      .attr("y", height - 10)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("fill", "#6b7280")
      .text("Data sources: Environmental Canada, StatCan, Ag Canada");
    
    // Cleanup tooltip on unmount
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, selectedRegion, selectedDatasets]);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Geographical Analysis</h2>
      <p className="text-sm text-gray-600 mb-4">
        Visualization of agricultural environmental impacts across {selectedRegion === 'All Canada' ? 'Canada' : selectedRegion}
      </p>
      
      <div className="h-[500px] w-full bg-blue-50 rounded-lg overflow-hidden">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          className="w-full h-full"
        />
      </div>
    </div>
  );
}