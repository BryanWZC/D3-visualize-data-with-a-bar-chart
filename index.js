const width = 1000;
const height = 500;
const padding = 40;

const svg = d3.select('.bar-chart')
    .attr('height', height)
    .attr('width', width);

// Title

const title = svg.append('text')
    .attr('x', width/2)
    .attr('y', '1.5em')
    .attr('font-size', 16)
    .attr('text-anchor', 'middle')
    .attr('font-size', 24)
    .attr('id', 'title')
    .text('GDP of US from 1947 - 2015');

// Initialize scales

const xScale = d3.scaleLinear()
    .domain([1947, 2016])
    .range([0, width - 2 * padding]);

const xScaleTooltip = d3.scaleLinear()
    .domain([Date.parse('1947-01-01'), Date.parse('2015-07-01')])
    .range([0, width - 2 * padding]);

const yScale = d3.scaleLinear()
    .domain([0, 20000])
    .range([height - padding * 2, 0]);

const yScale2 = d3.scaleLinear()
    .domain([0, 20000])
    .range([0, height - padding * 2]);

// X and Y axis
const time = [];

for(let i = 1950; i < 2016; i+=5){
    time.push(i);
}

const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => time[i]);
const yAxis = d3.axisLeft(yScale);


svg.append('g')
    .attr('transform', `translate(0,${height - 2 * padding})`)
    .attr('fill', 'black')
    .attr('id', 'x-axis')
    .call(xAxis)
    

svg.append('g')
    .attr('transform', `translate(0, 0)`)
    .attr('fill', 'black')
    .attr('id', 'y-axis')
    .call(yAxis);

// Data
async function getData() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(res => res.json()).then(res => res.data);
}

// Insert rects representing data
async function insertData(){
    const svgWidth = width - 2 * padding;
    const data = await getData();

    // insert tool tip

    // Insert rects
    const rect = svg.selectAll('rect')
        .data(data, d => d).enter().append('rect')
        .attr('class', 'bar')
        .attr('width', svgWidth / (data.length))
        .attr('height', d =>  yScale2(d[1]))
        .attr('x', (d, i) => i * svgWidth /(data.length))
        .attr('y', d => yScale(d[1]))
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('fill', '#6A66A3')
        .on('mouseover', (e,d) => {
            const x = xScaleTooltip(Date.parse(d[0]));
            const y = 200;

            const g = svg.append('g')
                .attr('id', 'tooltip')
                .attr('data-date', d[0])
                .attr('data-gdp', d[1])
                .attr('transform', `translate(${x + 20},${y})`)
                .attr('width', 200)
                .attr('height', 100)
                .attr('opacity', 0.8);

            const toolTip = g.append('rect')
                .attr('width', 200)
                .attr('height', 100)
                .attr('rx', 20)
                .attr('fill', '#3B322C');
                
            const year = d[0].slice(0,4);
            const quarter = getQuarter(month(d[0]));
            const gdp = d[1];

            g.append('text')
                .text(`${year} ${quarter}`)
                .attr('fill', '#DFDFDF')
                .attr('x', 100)
                .attr('y', 45)
                .attr('align-baseline', 'middle')
                .attr('text-anchor', 'middle')

            g.append('text')
                .text(`${gdp} Billion`)
                .attr('fill', '#DFDFDF')
                .attr('x', 100)
                .attr('y', 65)
                .attr('align-baseline', 'middle')
                .attr('text-anchor', 'middle')
        })
        .on('mouseout', (e,d) => {
            svg.selectAll('#tooltip').remove();
        })    
}

insertData();


// Utility functions

function month(dateStr){
    const date = new Date(dateStr);
    const month = date.getMonth();
    return month === 11 ? 0 : month + 1;
}

function getQuarter(month){
    return month === 0 ? 
            'Q1' :
        month === 4 ?
            'Q2' :
        month === 7 ?
            'Q3' :
            'Q4';
}