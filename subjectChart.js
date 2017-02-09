import * as d3 from "d3";

class SubjectChart {
    constructor(cube) {
        this.cube = cube;
        this.$element = $(cube.element);
        this.margin = {top: 0, right: 30, bottom: 0, left: 120};
        this.width = this.$element.width() - this.margin.left - this.margin.right;
        this.height = this.$element.height() - this.margin.top - this.margin.bottom;
        this.errorMsg = d3.select(this.cube.element).append("div")
            .style("visibility", "hidden")
            .style("width", "100%")
            .style("height", "100%")
            .style("background", "#eee")
            .style("position", "absolute")
            .style("top", "0")
            .style("left", "0")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("z-index", "2")
            .style("font-size", "1.4em")
            .style("font-family", "'Helvetica Neue', Helvetica, Arial, sans-serif")
            .html("No Data Available");
        this.tooltip = d3.select(this.cube.element).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        this.svg = d3.select(this.cube.element).append("svg")
            .attr("width", `${this.$element.width()}px`)
            .attr("height", `${this.$element.height()}px`)
            .attr("shape-rendering", "optimizeSpeed");
        this.svg.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg.xAxis = this.svg.g.append("g").attr("class", "x axis").attr("transform", `translate(0, ${this.height})`);
        this.svg.yAxis = this.svg.g.append("g").attr("class", "y axis");
            
        $(window).resize(() => {
            this.resize();
        });
    }

    draw(layout) {
        this.matrix = layout.qHyperCube.qDataPages[0].qMatrix;
        this.rows = this.matrix.length;

        let label = layout.qHyperCube.qMeasureInfo.map((measure) => { return measure.qFallbackTitle })[0];

        if (!this.matrix.length) {
            this.errorMsg.style("visibility", "visible");
            return;
        } else {
            this.errorMsg.style("visibility", "hidden");
        }

        this.height = 20 * this.matrix.length;
        this.svg.attr("height", `${this.height}px`);

        this.x = d3.scaleLinear().range([20, this.width]);
        this.y = d3.scaleBand().range([0, this.height]).paddingInner(0.3).paddingOuter(0);
        this.x.domain([0, layout.qHyperCube.qMeasureInfo[0].qMax]);
        this.y.domain(this.matrix.map((d) => { return d[0].qText; }));

        this.svg.yAxis.call(d3.axisLeft(this.y).tickSize(0).tickPadding(0));

        this.svg.yAxis.selectAll(".tick")
            .on("click", (d,i) => { this.toggleSelection(this.matrix[i]); });

        this.svg.yAxis.selectAll(".tick text")
            .attr("text-anchor", "start")
            .attr("transform", "translate(-" + this.margin.left + ",0)");
        this.svg.yAxis.select(".domain")
            .attr("stroke-width", "0");

        let colorPalette = {
            "Goals": "#013878",
            "Even Strength Goals": "#769fce",
            "Power Play Goals": "#3fb34f",
            "Short Handed Goals": "#f69331",
            "Game Winning Goals": "#CCBA3E",
        }

        let bars = this.svg.g.selectAll(".bar")
            .data(this.matrix);   
        bars
            .attr("fill", colorPalette[label])
            .attr("x", 0)
            .attr("y", (d) => { return this.y(d[0].qText) })
            .attr("height", this.y.bandwidth())
            .transition()
            .attr("width", (d) => { return this.x(d[1].qNum) });
        bars
            .enter().append("rect")
            .on("click", (d) => {
                this.cube.object.selectHyperCubeValues("/qHyperCubeDef", 0, [d[0].qElemNumber], true);
                this.tooltip.style("opacity", 0);
            })
            .on("mouseover", (d, i, j) => {
                let category = d3.select(j[i].parentNode).attr("category");
                let html = `<div>${d[0].qText}</div><div>${label}</div><div>${d[1].qNum}</div>`;
                this.tooltip.html(html)
                    .style("left", `${Math.min(d3.event.pageX - $(this.cube.element).offset().left, window.innerWidth - $(this.cube.element).offset().left -200)}px`)
                    .style("top", `${d3.event.pageY - $(this.cube.element).offset().top - 60}px`)
                this.tooltip.transition()
                    .style("opacity", 1);
            })
            .on("mousemove", (d) => {
                this.tooltip
                    .style("left", `${Math.min(d3.event.pageX - $(this.cube.element).offset().left, window.innerWidth - $(this.cube.element).offset().left -200)}px`)
                    .style("top", `${d3.event.pageY - $(this.cube.element).offset().top - 60}px`);
            })
            .on("mouseout", (d) => {
                this.tooltip.transition()
                    .style("opacity", 0);
            })
            .attr("class", "bar")
            .attr("fill", colorPalette[label])
            .attr("x", 0)
            .attr("y", (d) => { return this.y(d[0].qText) })
            .attr("height", this.y.bandwidth())
            .attr("width", 0)
            .transition()
            .attr("width", (d) => { return this.x(d[1].qNum) })
        bars.exit().remove();
        let values = this.svg.g.selectAll(".value")
            .data(this.matrix);
        values
            .attr("x", (d) => { return this.x(d[1].qNum) - 2 })
            .attr("y", (d) => { return this.y(d[0].qText) + this.y.bandwidth()*(3/4) })
            .text((d) => { return d[1].qNum });
        values
            .enter().append("text")
            .attr("class", "value")
            .attr("fill", "white")
            .attr("font-size", "10")
            .attr("text-anchor", "end")
            .attr("x", (d) => { return this.x(d[1].qNum) - 2 })
            .attr("y", (d) => { return this.y(d[0].qText) + this.y.bandwidth()*(3/4) })
            .text((d) => { return d[1].qNum })
            .on("click", (d) => { this.toggleSelection(d) });
        values.exit().remove();
    }

    resize() {
        this.width = this.$element.width() - this.margin.left - this.margin.right;
        this.svg.attr("width", `${this.$element.width()}px`);
        this.x.range([10, this.width]);
        let bars = this.svg.g.selectAll(".bar")
            .data(this.matrix);
        bars.attr("width", (d) => { return this.x(d[1].qNum) });
        let values = this.svg.g.selectAll(".value")
            .data(this.matrix);
        values.attr("x", (d) => { return this.x(d[1].qNum) - 2 });
    }
}

export default SubjectChart;