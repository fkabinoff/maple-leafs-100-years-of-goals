import * as d3 from "d3";

class GoalChart {
    constructor(cube) {
        this.cube = cube;
        this.margin = {top: 0, right: 0, bottom: 30, left: 40};
        this.width = 1040 - this.margin.left - this.margin.right;
        this.height = 530 - this.margin.top - this.margin.bottom;
        this.tooltip = d3.select(this.cube.element).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        this.svg = d3.select(this.cube.element).append("svg")
            .attr("viewBox", "0 0 1040 530")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("width", "100%")
        this.svg.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg.xAxis = this.svg.g.append("g").attr("class", "x axis").attr("transform", `translate(0, ${this.height})`);
        this.svg.yAxis = this.svg.g.append("g").attr("class", "y axis");
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
        this.svg.defs.append("pattern")
            .attr("id", "pattern-stripe")
            .attr("width", 4)
            .attr("height", 4)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("patternTransform", "rotate(45)")
        .append("rect")
            .attr("width", 3)
            .attr("height", 4)
            .attr("transform", "translate(0,0)")
            .attr("fill", "white");
        this.svg.defs.append("mask")
            .attr("id", "mask-stripe")
        .append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "url(#pattern-stripe)");

        //todo: create defs for other types of goals
    }

    draw(layout) {
        let matrix = layout.qHyperCube.qDataPages[0].qMatrix;
        let labels = layout.qHyperCube.qMeasureInfo.map((measure) => { return measure.qFallbackTitle });
        let x = d3.scaleBand().range([0, this.width]).padding(0.2),
            y = d3.scaleLinear().range([this.height, 0]),
            z = d3.scaleOrdinal().range(["#013878", "#013878", "#769fce", "#3fb34f", "#f69331", "#769fce", "#3fb34f", "#f69331"]);

        x.domain(matrix.map(function(d){ return d[0].qText; }));
        y.domain([0, Math.max(...matrix.map((year) => { return year[1].qNum + year[2].qNum }))]);
        z.domain([1, 2, 3, 4, 5, 6, 7, 8]);

        this.svg.xAxis.call(d3.axisBottom(x).tickValues( x.domain().filter((d,i) => { return !(i%10) }) ));
        this.svg.yAxis.call(d3.axisLeft(y));

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

        this.items = this.svg.g.selectAll(".layer")
            .data(series)
        .enter().append("g")
            .attr("class", "layer")
            .attr("category", (d, i, j) => { 
                return labels[i];
            })
            .attr("fill", (d) => { return z(d.key); })
            .attr("stroke", (d) => { return z(d.key); })
            .attr("mask", (d) => { if(d.key < 6 && d.key != 2) { return null; } else { return "url(#mask-stripe)"; } })
        .selectAll("rect")
        .data((d) => { return d; });
        this.items
            .attr("x", (d) => { return x(d.data[0].qText); })
            .attr("width", x.bandwidth())
        .transition()
            .attr("y", (d) => { return y(d[1]); })
            .attr("height", (d) => { return y(d[0]) - y(d[1]); });
        this.items.enter().append("rect")
            // .on("click", (d) => {
            //     this.cube.object.selectHyperCubeValues({
            //         path: "/qHyperCubeDef",
            //         dimNo: 0,
            //         values: [0],
            //         toggleMode: true
            //     });
            // })
            .on("mouseover", (d, i, j) => {
                let category = d3.select(j[i].parentNode).attr("category");
                let html = `<div>${d.data[0].qText}</div><div>${category}</div><div>${d[1]-d[0]}</div>`;
                this.tooltip.html(html)
                    .style("left", `${Math.min(d3.event.pageX, window.innerWidth-200)}px`)
                    .style("top", `${d3.event.pageY - 60}px`)
                this.tooltip.transition()
                    .style("opacity", 1);
            })
            .on("mousemove", (d) => {
                this.tooltip
                    .style("left", `${Math.min(d3.event.pageX, window.innerWidth-200)}px`)
                    .style("top", `${d3.event.pageY - 60}px`);
            })
            .on("mouseout", (d) => {
                this.tooltip.transition()
                    .style("opacity", 0);
            })
            .attr("x", (d) => { return x(d.data[0].qText); })
            .attr("y", this.height)
            .attr("width", x.bandwidth())
            .attr("height", 0)
        .transition()
            .attr("y", (d) => { return y(d[1]); })
            .attr("height", (d) => { return y(d[0]) - y(d[1]); });
        this.items.exit().remove();

    }
}

export default GoalChart;