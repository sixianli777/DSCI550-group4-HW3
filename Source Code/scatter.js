const width = 800;
const height = 600;
const margin = { top: 40, right: 40, bottom: 50, left: 60 };

const svg = d3.select("svg");

d3.json("Data/scatter_final.json").then(data => {
  // Set up scales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.pc_adult_drink_monthly)).nice()
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.sightings)).nice()
    .range([height - margin.bottom, margin.top]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Adult Drinking Rate (%)");

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .append("text")
    .attr("x", -margin.left + 10)
    .attr("y", margin.top)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .text("Number of Sightings per Capita (100k)");

  // Dots
  svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.pc_adult_drink_monthly))
    .attr("cy", d => y(d.sightings))
    .attr("r", 5)
    .attr("fill", "#69b3a2");

  // Labels (state abbreviations)
  svg.append("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", d => x(d.pc_adult_drink_monthly))
    .attr("y", d => y(d.sightings) - 10)
    .attr("text-anchor", "middle")
    .text(d => d.state_abbrev);
});
