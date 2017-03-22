import * as d3 from "d3";
import qlikapp from "../qlikapp";
import typeList from "../objects/typeList";

class SubjectChart {
    constructor(cube) {
        this.cube = cube;
        this.$element = $(cube.element);
        this.$legend = $("<div/>").css({
            'height': '30px'
        }).appendTo(this.$element);
        this.$chart = $("<div/>").css({
            'height': `${this.$element.height() - 60}px`,
            'overflow-y': 'auto',
            'overflow-x': 'hidden'
        }).appendTo(this.$element);
        this.$axis = $("<div/>").css({
            'position': 'absolute',
            'top': '30px',
            'left': '0',
            'z-index': -1
        }).appendTo(this.$element);
        this.margin = {top: 0, right: 30, bottom: 0, left: 120};
        this.width = this.$chart.width() - this.margin.left - this.margin.right;
        this.height = this.$chart.height() - this.margin.top - this.margin.bottom;
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
        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("width", `${this.$chart.width()}px`)
            .attr("height", `2000px`);
        this.svg.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg.xAxis = d3.select(this.$axis[0]).append("svg").attr("id", "axis-svg").attr("width", `${this.$chart.width()}px`).attr("height", `${this.$chart.height() + 10}px`).append("g").attr("class", "x axis").attr("transform", `translate(${this.margin.left}, ${this.$chart.height() + 0})`);
        this.svg.yAxis = this.svg.g.append("g").attr("class", "y axis");
        this.svg.defs = this.svg.append("defs");
        this.svg.defs.append("pattern")
            .attr("id", `${this.$element.attr("id")}-pattern-stripe`)
            .attr("width", 2)
            .attr("height", 2)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("patternTransform", "rotate(45)")
        .append("rect")
            .attr("width", 1)
            .attr("height", 2)
            .attr("transform", "translate(0,0)")
            .attr("fill", "white");
        this.svg.defs.append("mask")
            .attr("id", `${this.$element.attr("id")}-mask-stripe`)
        .append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", `url(#${this.$element.attr("id")}-pattern-stripe)`);
        this.legend = d3.select(this.$legend[0]).append("svg").attr("id", "legend-svg").attr("width", `${this.$legend.width()}px`).attr("height", `${this.$legend.height()}px`).append("g")
            .attr("transform", "translate(" + (this.$legend.width() - 190) + "," + 0 + ")");
        this.legend.regular = this.legend.append("g")
            .attr("class", "regular")
            .on("click", () => {
                typeList.object.getLayout().then((layout) => {
                    if (layout.qListObject.qDataPages[0].qMatrix[1][0].qState === "S") {
                        typeList.object.selectListObjectValues("/qListObjectDef", [0], true );
                    } else {
                        typeList.object.selectListObjectValues("/qListObjectDef", [0], false );
                    }
                });
            });
        this.legend.regular.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 9)
            .attr("height", 9)
            .attr("fill", "#666")
            .style("cursor", "pointer");
        this.legend.regular.append("text")
            .attr("x", 15)
            .attr("y", 8)
            .attr("font-size", "10px")
            .attr("fill", "#333")
            .text("Regular Season")
            .style("cursor", "pointer");
        this.legend.post = this.legend.append("g")
            .attr("class", "post")
            .on("click", () => {
                typeList.object.getLayout().then((layout) => {
                    if (layout.qListObject.qDataPages[0].qMatrix[0][0].qState === "S") {
                        typeList.object.selectListObjectValues("/qListObjectDef", [1], true );
                    } else {
                        typeList.object.selectListObjectValues("/qListObjectDef", [1], false );
                    }
                });
            });
        this.legend.post.append("rect")
            .attr("x", 100)
            .attr("y", 0)
            .attr("width", 9)
            .attr("height", 9)
            .attr("fill", "#666")
            .attr("mask", `url(#${this.$element.attr("id")}-mask-stripe)`)
            .style("cursor", "pointer");
        this.legend.post.append("text")
            .attr("x", 115)
            .attr("y", 8)
            .attr("font-size", "10px")
            .attr("fill", "#333")
            .text("Post-season")
            .style("cursor", "pointer");
            
        $(window).resize(() => {
            this.resize();
        });
    }

    draw(layout) {
        this.matrix = layout.qHyperCube.qDataPages[0].qMatrix;
        this.rows = this.matrix.length;

        if (!this.matrix.length) {
            this.errorMsg.style("visibility", "visible");
            return;
        } else {
            this.errorMsg.style("visibility", "hidden");
        }

        this.height = 20 * this.matrix.length;
        this.svg.attr("height", `${this.height}px`);

        let labels = layout.qHyperCube.qMeasureInfo.map((measure) => { return measure.qFallbackTitle }).slice(0,2);

        this.x = d3.scaleLinear().range([0, this.width]);
        this.y = d3.scaleBand().range([0, this.height]).paddingInner(0.25).paddingOuter(0);
        this.x.domain([0, layout.qHyperCube.qMeasureInfo[2].qMax]);
        this.y.domain(this.matrix.map((d) => { return d[0].qText; }));

        this.svg.xAxis.call(d3.axisBottom(this.x).ticks(this.$axis.width()/100).tickSizeOuter(0).tickSizeInner(-this.$chart.height()));
        this.svg.yAxis.call(d3.axisLeft(this.y).tickSize(0).tickPadding(0));

        this.svg.yAxis.selectAll(".tick")
            .on("click", (d,i) => {
                if (this.cube.currentState === "PlayerState") {
                    let selection = this.matrix[i][0].qText.split(" ").reverse().join(", ");
                    qlikapp.then((app) => {
                        app.getField("[Player Name 2]", "PlayerState").then((field) => {
                            field.toggleSelect(selection);
                        });
                    });
                } else {
                    this.cube.object.selectHyperCubeValues("/qHyperCubeDef", 0, [this.matrix[i][0].qElemNumber], true);
                }
            });

        this.svg.yAxis.selectAll(".tick text")
            .attr("text-anchor", "start")
            .attr("transform", "translate(-" + this.margin.left + ",0)");
        this.svg.yAxis.select(".domain")
            .attr("stroke-width", "0");

        let colorPalette = {
            "Regular Season Goals": "#013878",
            "Regular Season Even Strength Goals": "#769fce",
            "Regular Season Power-Play Goals": "#3fb34f",
            "Regular Season Shorthanded Goals": "#f69331",
            "Regular Season Game Winning Goals": "#CCBA3E",
            "Post-season Goals": "#013878",
            "Post-season Even Strength Goals": "#769fce",
            "Post-season Power-Play Goals": "#3fb34f",
            "Post-season Shorthanded Goals": "#f69331",
            "Post-season Game Winning Goals": "#CCBA3E",
        }

        let data = this.matrix.map((row) => {
             let tempRow = {};
             tempRow.player = row[0];
             labels.forEach((label, i) => {
                tempRow[label] = row[i+1];
             });
             return tempRow; 
        });

        let stack = d3.stack().keys(labels).value(function(d, key){ return d[key].qNum });
        let series = stack(data);

        this.layers = this.svg.g.selectAll(".subject-layer")
            .data(series);
        this.layers
            .attr("category", (d, i, j) => { 
                return labels[i];
            })
            .attr("fill", (d) => { return colorPalette[d.key]; });
        this.layers
            .enter().append("g")
                .attr("class", "subject-layer")
                .attr("category", (d, i, j) => { 
                    return labels[i];
                })
                .attr("fill", (d) => { return colorPalette[d.key]; })
                .attr("stroke", (d) => { return "#fff" })
                .attr("mask", (d) => { if(d.key.indexOf("Post-season") === -1 ) { return null; } else { return `url(#${this.$element.attr("id")}-mask-stripe)`; } });
        this.layers.exit().remove();

        this.layers = d3.selectAll(".subject-layer");

        this.items = this.layers.selectAll("rect")
            .data((d) => { return d; });

        this.items
            .attr("y", (d) => { return this.y(d.data["player"].qText); })
            .attr("x", 0)
            .attr("height", this.y.bandwidth())
            .attr("width", 0)
        .transition()
            .attr("x", (d) => { return this.x(d[0]); })
            .attr("width", (d) => { return this.x(d[1]) - this.x(d[0]); });

        this.items.enter().append("rect")
            .on("click", (d) => {
                if (this.cube.currentState === "PlayerState") {
                    let selection = d.data["player"].qText.split(" ").reverse().join(", ");
                    qlikapp.then((app) => {
                        app.getField("[Player Name 2]", "PlayerState").then((field) => {
                            field.toggleSelect(selection);
                        });
                    });
                } else {
                    this.cube.object.selectHyperCubeValues("/qHyperCubeDef", 0, [d.data["player"].qElemNumber], true);
                }
                this.tooltip.transition().style("opacity", 0);
            })
            .on("pep-pointerover", (d, i, j) => {
                let category = d3.select(j[i].parentNode).attr("category");
                let html = `<div style="font-weight: bold">${d.data["player"].qText}</div><div style="font-style: italic">${category}</div><div style="font-size: 14px">${d[1]-d[0]}</div>`;
                this.tooltip.html(html)
                    .style("left", `${Math.min(d3.event.pageX - this.tooltip.node().getBoundingClientRect().width/2, window.innerWidth - this.tooltip.node().getBoundingClientRect().width)}px`)
                    .style("top", `${d3.event.pageY - this.tooltip.node().getBoundingClientRect().height - 8}px`)
                this.tooltip.transition()
                    .style("opacity", 1);
            })
            .on("pep-pointermove", (d) => {
                this.tooltip
                    .style("left", `${Math.min(d3.event.pageX - this.tooltip.node().getBoundingClientRect().width/2, window.innerWidth - this.tooltip.node().getBoundingClientRect().width)}px`)
                    .style("top", `${d3.event.pageY - this.tooltip.node().getBoundingClientRect().height - 8}px`);
            })
            .on("pep-pointerout", (d) => {
                this.tooltip.transition()
                    .style("opacity", 0);
            })
            .attr("touch-action", "none")
            .attr("y", (d) => { return this.y(d.data["player"].qText); })
            .attr("x", 0)
            .attr("height", this.y.bandwidth())
            .attr("width", 0)
        .transition()
            .attr("x", (d) => { return this.x(d[0]); })
            .attr("width", (d) => { return this.x(d[1]) - this.x(d[0]); });
            
        this.items.exit().remove();

    }

    resize() {
        this.width = this.$element.width() - this.margin.left - this.margin.right;
        this.svg.attr("width", `${this.$element.width()}px`);
        d3.select("#axis-svg").attr("width", `${this.$chart.width()}px`);
        d3.select("#legend-svg").attr("width", `${this.$legend.width()}px`);
        d3.select("#legend-svg g").attr("transform", "translate(" + (this.$legend.width() - 190) + "," + 0 + ")");

        this.x.range([10, this.width]);
        this.svg.xAxis.call(d3.axisBottom(this.x).ticks(this.$axis.width()/100).tickSizeOuter(0).tickSizeInner(-this.$chart.height()));

        this.items = this.layers.selectAll("rect")
            .data((d) => { return d; });

        this.items
            .attr("x", (d) => { return this.x(d[0]); })
            .attr("width", (d) => { return this.x(d[1]) - this.x(d[0]); });
        
    }
}

export default SubjectChart;