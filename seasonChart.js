import * as d3 from "d3";

class SeasonChart {
    constructor(cube) {
        this.cube = cube;
        this.$element = $(cube.element);
        this.margin = {top: 30, right: 20, bottom: 20, left: 32};
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
        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        this.svg = d3.select(this.cube.element).append("svg")
            .attr("width", `${this.$element.width()}px`)
            .attr("height", `${this.$element.height()}px`);
        this.svg.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg.xAxis = this.svg.g.append("g").attr("class", "x axis").attr("transform", `translate(0, ${this.height})`);
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
        this.legend = this.svg.append("g")
            .attr("transform", "translate(" + (this.$element.width() - 190) + "," + 0 + ")");
        this.legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 9)
            .attr("height", 9)
            .attr("fill", "#666");
        this.legend.append("text")
            .attr("x", 15)
            .attr("y", 8)
            .attr("font-size", "10px")
            .attr("fill", "#333")
            .text("Regular Season");
        this.legend.append("rect")
            .attr("x", 100)
            .attr("y", 0)
            .attr("width", 9)
            .attr("height", 9)
            .attr("fill", "#666")
            .attr("mask", `url(#${this.$element.attr("id")}-mask-stripe)`)
        this.legend.append("text")
            .attr("x", 115)
            .attr("y", 8)
            .attr("font-size", "10px")
            .attr("fill", "#333")
            .text("Post Season")
            
        $(window).resize(() => {
            this.resize();
        });
    }

    draw(layout) {
        let matrix = layout.qHyperCube.qDataPages[0].qMatrix;
        this.rows = matrix.length;

        if (!matrix.length) {
            this.errorMsg.style("visibility", "visible");
            return;
        } else {
            this.errorMsg.style("visibility", "hidden");
        }

        let labels = layout.qHyperCube.qMeasureInfo.map((measure) => { return measure.qFallbackTitle });
        let maxGoals = matrix[0][3] ? Math.max(Math.max(...matrix.map((year) => { return year[1].qNum + year[2].qNum })), Math.max(...matrix.map((year) => { return year[3].qNum + year[4].qNum + year[5].qNum + year[6].qNum + year[7].qNum + year[8].qNum }))) : Math.max(...matrix.map((year) => { return year[1].qNum + year[2].qNum }));

        this.x = d3.scaleBand().range([0, Math.min(this.width, this.rows*50)]).paddingInner(0).paddingOuter(0);
        this.y = d3.scaleLinear().range([this.height, 0]);
        this.x.domain(matrix.map(function(d){ return d[0].qText; }));
        this.y.domain([0, maxGoals]);

        let colorPalette = {
            "Regular Season Goals": "#013878",
            "Post Season Goals": "#013878",
            "Regular Season Even Strength Goals": "#769fce",
            "Regular Season Power Play Goals": "#3fb34f",
            "Regular Season Short Handed Goals": "#f69331",
            "Post Season Even Strength Goals": "#769fce",
            "Post Season Power Play Goals": "#3fb34f", 
            "Post Season Short Handed Goals": "#f69331" 
        }

        let findAxisIndicies = (start, end, max) => {
            let axisIndicies = [];
            let distribution = (end - start) / (max - 1);
            axisIndicies.push(start);
            for(let i = 1; i <= max - 2; i++) {
                axisIndicies.push(Math.round(start + (distribution * i)));
            }
            axisIndicies.push(end);
            return axisIndicies;
        }

        let maxLabels = Math.floor(this.width/50) > this.x.domain().length ? Math.floor(this.width/50) : Math.min(Math.floor(this.width/50), Math.floor(this.x.domain().length/3));
        let axisIndicies = findAxisIndicies(0, this.x.domain().length - 1, maxLabels);

        this.svg.xAxis.call(d3.axisBottom(this.x).tickValues( this.x.domain().filter((d,i) => { return axisIndicies.includes(i); })).tickSizeOuter(0));
        this.svg.yAxis.call(d3.axisLeft(this.y).tickSizeOuter(0).tickSizeInner(-this.width));
        this.svg.yAxis.selectAll(".tick text")
            .attr("transform", "translate(-" + 2 + ",0)");

        let data = matrix.map((row) => {
             let tempRow = {};
             tempRow.year = row[0];
             labels.forEach((label, i) => {
                tempRow[label] = row[i+1];
             });
             return tempRow; 
        });

        let stack = d3.stack().keys(labels).value(function(d, key){ return d[key].qNum });
        let series = stack(data);

        this.layers = this.svg.g.selectAll(".layer")
            .data(series);
        this.layers    
            .enter().append("g")
                .attr("class", "layer")
                .attr("category", (d, i, j) => { 
                    return labels[i];
                })
                .attr("fill", (d) => { return colorPalette[d.key]; })
                .attr("stroke", (d) => { return "#fff" })
                .attr("mask", (d) => { if(d.key.indexOf("Post Season") === -1 ) { return null; } else { return `url(#${this.$element.attr("id")}-mask-stripe)`; } });
        this.layers.exit().remove();

        this.layers = d3.selectAll(".layer");
        
        this.items = this.layers.selectAll("rect")
            .data((d) => { return d; });

        this.items
            .attr("x", (d) => { return this.x(d.data["year"].qText); })
            .attr("y", this.height)
            .attr("width", this.x.bandwidth())
            .attr("height", 0)
        .transition()
            .attr("y", (d) => { return this.y(d[1]); })
            .attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); });

        this.items.enter().append("rect")
            .on("click", (d) => {
                this.cube.object.selectHyperCubeValues("/qHyperCubeDef", 0, [d.data["year"].qElemNumber], true);
                this.tooltip.transition().style("opacity", 0);
            })
            .on("pep-pointerover", (d, i, j) => {
                let category = d3.select(j[i].parentNode).attr("category");
                let html = `<div style="font-weight: bold">${d.data["year"].qText}</div><div style="font-style: italic">${category}</div><div style="font-size: 14px">${d[1]-d[0]}</div>`;
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
            .attr("x", (d) => { return this.x(d.data["year"].qText); })
            .attr("y", this.height)
            .attr("width", this.x.bandwidth())
            .attr("height", 0)
        .transition()
            .attr("y", (d) => { return this.y(d[1]); })
            .attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); });
            
        this.items.exit().remove();

    }

    resize() {
        this.width = this.$element.width() - this.margin.left - this.margin.right;
        this.height = this.$element.height() - this.margin.top - this.margin.bottom;

        this.svg
            .attr("width", `${this.$element.width()}px`)
            .attr("height", `${this.$element.height()}px`);
        this.svg.g.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.svg.xAxis.attr("transform", `translate(0, ${this.height})`);

        this.legend.attr("transform", "translate(" + (this.$element.width() - 190) + "," + 0 + ")");

        this.x.range([0, Math.min(this.width, this.rows*50)]).paddingInner(0).paddingOuter(0);
        this.y.range([this.height, 0]);
        
        let findAxisIndicies = (start, end, max) => {
            let axisIndicies = [];
            let distribution = (end - start) / (max - 1);
            axisIndicies.push(start);
            for(let i = 1; i <= max - 2; i++) {
                axisIndicies.push(Math.round(start + (distribution * i)));
            }
            axisIndicies.push(end);
            return axisIndicies;
        }

        let maxLabels = Math.floor(this.width/50) > this.x.domain().length ? Math.floor(this.width/50) : Math.min(Math.floor(this.width/50), Math.floor(this.x.domain().length/3));
        let axisIndicies = findAxisIndicies(0, this.x.domain().length - 1, maxLabels);

        this.svg.xAxis.call(d3.axisBottom(this.x).tickValues( this.x.domain().filter((d,i) => { return axisIndicies.includes(i); })).tickSizeOuter(0));
        this.svg.yAxis.call(d3.axisLeft(this.y).tickSizeOuter(0).tickSizeInner(-this.width));
        this.svg.yAxis.selectAll(".tick text")
            .attr("transform", "translate(-" + 2 + ",0)");

        this.items = this.layers.selectAll("rect")
            .data((d) => { return d; });

        this.items
            .attr("x", (d) => { return this.x(d.data["year"].qText); })
            .attr("width", this.x.bandwidth())
            .attr("y", (d) => { return this.y(d[1]); })
            .attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); });
    }
}

export default SeasonChart;