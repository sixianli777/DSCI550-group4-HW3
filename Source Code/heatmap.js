// === UFO Shape × Apparition Type Heatmap ===
d3.json("../Data/ufo_shape_apparition_heatmap.json").then(data => {
    const margin = { top: 60, right: 30, bottom: 100, left: 350 },
          width = 1400 - margin.left - margin.right,
          height = 1600 - margin.top - margin.bottom;
  
    const svg = d3.select("#heatmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right + 100)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const xLabels = Array.from(new Set(data.map(d => d.ufo_shape)));
    const yLabels = Array.from(new Set(data.map(d => d.apparition_type)));
  
    const x = d3.scaleBand().range([0, width]).domain(xLabels).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).domain(yLabels).padding(0.05);
  
    const maxCount = d3.max(data, d => d.count);
    const color = d3.scaleSequential()
      .interpolator(d3.interpolateYlOrRd)
      .domain([0, maxCount]);
  
    // Draw axes
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "8px");
  
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "8px");
  
    // Tooltip
    const tooltip = d3.select("#heatmap")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "6px 10px")
      .style("border", "1px solid #999")
      .style("border-radius", "4px")
      .style("display", "none");
  
    // Draw cells
    svg.selectAll()
      .data(data)
      .join("rect")
      .attr("x", d => x(d.ufo_shape))
      .attr("y", d => y(d.apparition_type))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.count))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<strong>${d.count}</strong> sightings<br>${d.ufo_shape} × ${d.apparition_type}`)
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));
  
    // Legend
    const legendWidth = 250;
    const legendHeight = 15;
    const legendX = width - legendWidth;
  
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "heatmap-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%");
  
    linearGradient.selectAll("stop")
      .data(d3.range(0, 1.01, 0.01))
      .enter().append("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => color(d * maxCount));
  
    svg.append("rect")
      .attr("x", legendX)
      .attr("y", -40)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#heatmap-gradient)");
  
    const legendScale = d3.scaleLinear()
      .domain([0, maxCount])
      .range([0, legendWidth]);
  
    svg.append("g")
      .attr("transform", `translate(${legendX}, -25)`)
      .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format("~s")));
});