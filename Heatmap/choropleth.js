// const width = 960;
// const height = 600;

// const svg = d3.select("#map")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .style("background-color", "#fff");

// const dotGroup = svg.append("g").attr("class", "sightings");

// Promise.all([
//   d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
//   d3.json("state_heatmap.json"),
//   d3.json("sightings.json")
// ]).then(([us, sightingData, sightings]) => {
//   const projection = d3.geoAlbersUsa();
//   const path = d3.geoPath().projection(projection);
//   const states = topojson.feature(us, us.objects.states).features;

//   const stateCounts = new Map(sightingData.map(d => [d.state, d.count]));

//   const color = d3.scaleSequential()
//     .interpolator(d3.interpolateReds)
//     .domain([0, d3.max(sightingData, d => d.count)]);

//   // Draw the map
//   svg.append("g")
//     .selectAll("path")
//     .data(states)
//     .join("path")
//       .attr("d", path)
//       .attr("fill", d => {
//         const name = d.properties.name;
//         const count = stateCounts.get(name);
//         return count ? color(count) : "#eee";
//       })
//       .attr("stroke", "#333")
//       .attr("stroke-width", 0.5)
//       .on("mouseover", function (event, d) {
//         d3.select(this)
//           .attr("stroke", "#000")
//           .attr("stroke-width", 2)
//           .raise();
//       })
//       .on("mouseout", function () {
//         d3.select(this)
//           .attr("stroke", "#333")
//           .attr("stroke-width", 0.5);
//       })
//       .append("title")
//       .text(d => {
//         const name = d.properties.name;
//         const count = stateCounts.get(name) || 0;
//         return `${name}: ${count} sightings`;
//       })
//       .on("click", function (event, d) {
//         const stateName = d.properties.name;
      
//         // Filter sightings by clicked state
//         const stateSightings = sightings.filter(s => s.state === stateName && s.latitude && s.longitude);
      
//         // Project lat/lon to SVG coordinates
//         const projectedPoints = stateSightings.map(s => {
//           const coords = projection([s.longitude, s.latitude]);
//           return coords ? { ...s, x: coords[0], y: coords[1] } : null;
//         }).filter(Boolean);
      
//         // Clear previous dots
//         dotGroup.selectAll("circle").remove();
      
//         // Add new dots
//         dotGroup.selectAll("circle")
//           .data(projectedPoints)
//           .enter()
//           .append("circle")
//           .attr("cx", d => d.x)
//           .attr("cy", d => d.y)
//           .attr("r", 4)
//           .attr("fill", "black")
//           .attr("opacity", 0.7)
//           .append("title")
//           .text(d => d.location);
//       });

//   // Add color legend
//   const legendWidth = 260;
//   const legendHeight = 10;

//   const defs = svg.append("defs");
//   const linearGradient = defs.append("linearGradient")
//     .attr("id", "legend-gradient");

//   linearGradient.selectAll("stop")
//     .data(d3.ticks(0, 1, 10))
//     .join("stop")
//       .attr("offset", d => `${d * 100}%`)
//       .attr("stop-color", d => color(d * d3.max(sightingData, d => d.count)));

//   const legendSvg = svg.append("g")
//     .attr("transform", `translate(${width - legendWidth - 30}, ${height - 40})`);

//   legendSvg.append("rect")
//     .attr("width", legendWidth)
//     .attr("height", legendHeight)
//     .style("fill", "url(#legend-gradient)")
//     .attr("stroke", "#000");

//   const legendScale = d3.scaleLinear()
//     .domain([0, d3.max(sightingData, d => d.count)])
//     .range([0, legendWidth]);

//   legendSvg.append("g")
//     .attr("transform", `translate(0, ${legendHeight})`)
//     .call(d3.axisBottom(legendScale)
//       .ticks(5)
//       .tickSize(6)
//       .tickFormat(d3.format("~s")));
// });

const width = 960;
const height = 600;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const path = d3.geoPath();
const projection = d3.geoAlbersUsa()
  .scale(1300)
  .translate([width / 2, height / 2]);
path.projection(projection);

// Tooltip
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("padding", "6px 10px")
  .style("background", "#fff")
  .style("border", "1px solid #ccc")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none")
  .style("opacity", 0);

// Background
svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "#fff");

// Color scale
const color = d3.scaleSequential(d3.interpolateReds);

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
  d3.json("state_heatmap.json"),
  d3.json("sightings.json")
]).then(([us, stateHeatmap, sightings]) => {
  const stateCounts = new Map(stateHeatmap.map(d => [d.state, d.count]));
  color.domain([0, d3.max(stateHeatmap, d => d.count)]);

  const states = topojson.feature(us, us.objects.states).features;

  const stateGroup = svg.append("g");
  const dotGroup = svg.append("g");

  // Draw states
  const statePaths = stateGroup.selectAll("path")
    .data(states)
    .join("path")
    .attr("fill", d => color(stateCounts.get(d.properties.name) || 0))
    .attr("stroke", "#333")
    .attr("d", path)
    .on("mouseover", function (event, d) {
      const name = d.properties.name;
      const count = stateCounts.get(name) || 0;
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip.html(`<strong>${name}</strong><br>Sightings: ${count}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.select(this).attr("stroke-width", 2);
    })
    .on("mousemove", (event) => {
      tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
      d3.select(this).attr("stroke-width", 1);
    })
    .on("click", function (event, d) {
      const stateName = d.properties.name;
      const [[x0, y0], [x1, y1]] = path.bounds(d);

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      );

      // Remove previous
      dotGroup.selectAll("circle").remove();

      // Add dots
      const filtered = sightings.filter(s => s.state === stateName);
      dotGroup.selectAll("circle")
        .data(filtered)
        .join("circle")
        .attr("class", "dot")
        .attr("r", 1)
        .attr("fill", "#000")
        .attr("opacity", 0.7)
        .attr("transform", d => {
          const coords = projection([+d.longitude, +d.latitude]);
          return coords ? `translate(${coords})` : null;
        })
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(100).style("opacity", 1);
          tooltip.html(d.location)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
          d3.select(this).attr("fill", "red");
        })
        .on("mouseout", function () {
          tooltip.transition().duration(200).style("opacity", 0);
          d3.select(this).attr("fill", "#000");
        });
    });

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      stateGroup.attr("transform", event.transform);
      dotGroup.attr("transform", event.transform);
    });

  svg.call(zoom);

  // Reset on ESC key
  d3.select(window).on("keydown", (event) => {
    if (event.key === "Escape") {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
      );
      dotGroup.selectAll("circle").remove();
    }
  });

  // Legend
  const legendWidth = 300;
  const legendHeight = 10;

  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "legend-gradient");

  gradient.selectAll("stop")
    .data(color.ticks().map((t, i, n) => ({
      offset: `${100 * i / (n.length - 1)}%`,
      color: color(t)
    })))
    .join("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  const legend = svg.append("g")
    .attr("transform", `translate(${width - legendWidth - 50},${height - 40})`);

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  const legendScale = d3.scaleLinear()
    .domain(color.domain())
    .range([0, legendWidth]);

  legend.append("g")
    .attr("transform", `translate(0,${legendHeight})`)
    .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format("~s")))
    .select(".domain").remove();
});

// === UFO Shape × Apparition Type Heatmap ===
d3.json("ufo_shape_apparition_heatmap.json").then(data => {
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
  