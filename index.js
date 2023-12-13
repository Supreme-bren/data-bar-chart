     let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    const req = new XMLHttpRequest();
    req.open("GET", url,true)
    req.send();
    req.onload = () =>{
        const dataset = JSON.parse(req.responseText);
         values = dataset.data;
        drawCanvas();
        creatingScales();
        drawingBars();
        genAxes();

    }
    /*Defining Global Variables */
    let formatCurrency = d3.format("$,.2f");
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let values;
    let yScale;
    let xScale;
    let xAxisScale;
    let yAxisScale
    let width = 800;
    let height = 600;
    let padding = 40

    const svg = d3.select("svg")

    const drawCanvas =() =>{
        svg.attr('width',width);
        svg.attr("height", height)
    }
    const creatingScales  = () =>{

         yScale = d3.scaleLinear()
                            .domain([0, d3.max(values, (d) => d[1] )])
                            .range([0, height - 2*padding])
         xScale = d3.scaleLinear().domain([0, values.length - 1])
                                        .range([padding, width - padding])
        let datesArray  = values.map((d) => {
            return new Date(d[0]);
        })

         xAxisScale = d3.scaleTime().domain([d3.min(datesArray), d3.max(datesArray)])
                                    .range([padding, width - padding])
         yAxisScale = d3.scaleLinear().domain([0, d3.max(values, (d) => d[1])])
                                        .range([height - padding, padding])

    }

    const genAxes = () =>{

        let xAxis = d3.axisBottom(xAxisScale);
        svg.append("g").call(xAxis).attr('id','x-axis')
            .attr("transform", "translate(0, " + (height - padding) + ")")
        let yAxis = d3.axisLeft(yAxisScale);
        svg.append("g").call(yAxis).attr('id','y-axis')
            .attr("transform", "translate(" + padding + ", 0)")
    }
    const drawingBars = () =>{
        
        let hoverTool = d3.select('body').append('div').attr('id','tooltip').style('visibility', 'hidden')
                            .style('width', 'auto').style('height', 'auto').style('opacity', 0)

        svg.selectAll("rect").data(values)
            .enter().append("rect").attr("class", "bar")
            .attr("width", (width - (2*padding)) / values.length)
            .attr("data-date", (d) => d[0])
            .attr("data-gdp", (d) => d[1])
            .attr("height", (d) => {
                return yScale(d[1]);
            })
            .attr('x', (d, i) => {
                return xScale(i);
            })
            .attr('y', (d) => {
                return (height - padding) - yScale((d[1]))
            })
            .on('mouseover', (d) => {
                let rect = d3.select(this);
                rect.attr('class', 'mouseover')
                const currentDateTime = new Date(d[0]);
                const year = currentDateTime.getFullYear();
                const month = currentDateTime.getMonth();
                const dollars = d[1];
                hoverTool.transition()
                        .style('visibility', 'visible')
                        .duration(200).style('opacity', 0.9)
                hoverTool.html("<span class ='amount'>" + formatCurrency(dollars) + "&nbsp;Billion </span><br /><span class ='year'>" +
                year + ' - ' + months[month] + "</span>")
                        .style("left", (d3.event.pageX + 5) + 'px')
                        .style("top", (d3.event.pageY - 50) + 'px')
                    document.querySelector('#tooltip').setAttribute('data-date',d[0])
            })
            .on('mouseout', (d) =>{
                let rect = d3.select(this);
                rect.attr('class', 'mouseover')
                hoverTool.transition()
                         .duration(500)
                        .style('opacity', 0)
            })
    }
