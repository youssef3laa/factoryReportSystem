<template>
  <div>
    <svg></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from "lodash";

export default {
  props: ["issues"],
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.renderChart([
      { day: "Dec 7th 18", issues: 0 },
      { day: "Dec 8th 18", issues: 0 },
      { day: "Dec 9th 18", issues: 52 },
      { day: "Dec 10th 18", issues: 1 },
      { day: "Dec 11th 18", issues: 20 },
      { day: "Dec 12th 18", issues: 0 },
      { day: "Dec 13th 18", issues: 0 },
      { day: "Dec 1323th 18", issues: 0 },
      { day: "Dec 132th 18", issues: 0 },
      { day: "Dec 134th 18", issues: 0 },
    ]);
  },
  watch: {
    issues(val) {
      console.log(val);
      if (this.chart != null) this.chart.remove();
      this.renderChart([
        { day: "Dec 7th 18", issues: 0 },
        { day: "Dec 8th 18", issues: 0 },
        { day: "Dec 9th 18", issues: 52 },
        { day: "Dec 10th 18", issues: 1 },
        { day: "Dec 11th 18", issues: 20 },
        { day: "Dec 12th 18", issues: 0 },
        { day: "Dec 13th 18", issues: 0 },
      ]);
    },
  },
  methods: {
    renderChart(issues_val) {
      const margin = 60;
      const svg_width = 1000;
      const svg_height = 600;
      const chart_width = 1000 - 2 * margin;
      const chart_height = 600 - 2 * margin;

      const svg = d3
        .select("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      this.chart = svg
        .append("g")
        .attr("transform", `translate(${margin}, ${margin})`);

      const yScale = d3
        .scaleLinear()
        .range([chart_height, 0])
        .domain([0, _.maxBy(issues_val, "issues").issues]);

      this.chart
        .append("g")
        .call(d3.axisLeft(yScale).ticks(_.maxBy(issues_val, "issues").issues));

      const xScale = d3
        .scaleBand()
        .range([0, chart_width])
        .domain(issues_val.map((s) => s.day))
        .padding(0.2);

      this.chart
        .append("g")
        .attr("transform", `translate(0, ${chart_height})`)
        .call(d3.axisBottom(xScale));

      const barGroups = this.chart.selectAll("rect").data(issues_val).enter();

      barGroups
        .append("rect")
        .attr("class", "bar")
        .attr("x", (g) => xScale(g.day))
        .attr("y", (g) => yScale(g.issues))
        .attr("height", (g) => chart_height - yScale(g.issues))
        .attr("width", xScale.bandwidth());

      //   svg
      //     .append("text")
      //     .attr("class", "title")
      //     .attr("x", chart_width / 2 + margin)
      //     .attr("y", 40)
      //     .attr("text-anchor", "middle")
      //     .text("Issues in the past 1 week");
    },
  },
};
</script>

<style >
.bar {
  fill: #1868bd;
}
.title {
  fill: #319bbe;
}
</style>