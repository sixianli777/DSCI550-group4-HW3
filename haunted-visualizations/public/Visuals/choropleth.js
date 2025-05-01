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
  .attr("fill", "#f8f8f8");

// Color scale
const color = d3.scaleSequential(d3.interpolateReds);

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
  d3.json("../Data/state_heatmap.json"),
  d3.json("../Data/sightings.json")
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