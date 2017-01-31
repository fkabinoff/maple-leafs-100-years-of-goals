import * as d3 from "d3";

class GoalChart {
    constructor(element) {
        this.margin = {top: 0, right: 0, bottom: 30, left: 40};
        this.width = 1040 - this.margin.left - this.margin.right;
        this.height = 530 - this.margin.top - this.margin.bottom;
        this.svg = d3.select(element).append("svg")
            .attr("viewBox", "0 0 1040 530")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("width", "100%")
        this.svg.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg.defs = this.svg.append("defs");
        this.svg.defs.append("pattern")
            .attr("id", "goal")
            .attr("width", 9)
            .attr("height", 4)
            .attr("patternUnits", "userSpaceOnUse")
        .append("rect")
            .attr("width", 8)
            .attr("height", 2)
            .attr("fill", "blue");
        this.svg.defs.append("pattern")
            .attr("id", "playoff-goal")
            .attr("width", 9)
            .attr("height", 4)
            .attr("patternUnits", "userSpaceOnUse")
        .append("rect")
            .attr("width", 8)
            .attr("height", 2)
            .attr("stroke", "blue")
            .attr("fill", "white");
        //todo: create defs for other types of goals
    }

    draw(layout) {
        let matrix = layout.qHyperCube.qDataPages[0].qMatrix;

        let x = d3.scaleBand().rangeRound([0, this.width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([this.height, 0]),
            z = d3.scaleOrdinal().range(["#0000ff", "#0000ff", "#0000ff", "#0000ff", "#0000ff", "#0000ff", "#0000ff", "#0000ff"]);
        x.domain(matrix.map(function(d){ return d[0].qText; }));
        y.domain([0, Math.max(...matrix.map((year) => { return year[1].qNum + year[2].qNum }))]);
        z.domain([1, matrix[0].length]);

        let data = matrix.map((year) => {
             if( year[3].qNum + year[4].qNum + year[5].qNum + year[6].qNum + year[7].qNum + year[8].qNum != 0 ) {
                 year[1] = {
                     qElemNumber: year[1].qElemNumber,
                     qNum: 0,
                     qState: year[1].qState,
                     qtext: "0"
                 };
                 year[2] = {
                     qElemNumber: year[2].qElemNumber,
                     qNum: 0,
                     qState: year[2].qState,
                     qtext: "0"
                 };
             }
             return year; 
        });

        let stack = d3.stack().keys([1, 2, 3, 4, 5, 6, 7, 8]).value(function(d, key){ return d[key].qNum });
        let series = stack(data);

        this.svg.g.selectAll("g")
            .data(series)
        .enter().append("g")
            .attr("fill", (d) => { return z(d.key); })
        .selectAll("rect")
        .data((d) => { return d; })
        .enter().append("rect")
            .attr("x", (d) => { return x(d.data[0].qText); })
            .attr("y", this.height)
            .attr("width", x.bandwidth())
            .attr("height", 0)
        .transition()
            .attr("y", (d) => { return y(d[1]); })
            .attr("height", (d) => { return y(d[0]) - y(d[1]); });

    }
}

export default GoalChart;