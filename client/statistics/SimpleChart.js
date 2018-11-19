import React from 'react';
import * as d3 from 'd3';

export class SimpleChart extends React.Component {
  constructor(props) {
    super(props);
    this.composeData = this.paymentsCount.bind(this);
    this.draw = this.draw.bind(this);
  }

  render() {
    return <div className="container simple-chart"></div>;
  }

  draw() {
    const data = this.composeData();

    const updatedRects = this.root
      .selectAll('div')
      .data(data, e => e.key);

    const newRects = updatedRects.enter();
    const deletedRects = updatedRects.exit();

    newRects
      .append('div')
      .attr('class', 'simple-chart-bar')
      .style('height', '30px')
      .style('width', e => `${e.value * 100}px`)
      .text(e => e.key);

    updatedRects
      .transition()
      .duration(1000)
      .style('width', e => `${e.value * 100}px`);

    deletedRects.remove();
  }

  componentDidMount() {
    this.root = d3.select('.simple-chart');
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data == this.props.data)
      return;

    this.draw();
  }

  paymentsCount() {
    const data = this.props.data
      .reduce((acc, curr) => acc.concat(curr.payments), []);
    const classifier = this.props.classifier;
    const localization = this.props.localization;

    const grouped = d3
      .nest()
      .key(e => e.type)
      .rollup(v => v.length)
      .object(data);

    return Object.keys(classifier).map(key => {
      return {
        key: classifier[key],
        value: grouped[classifier[key]] || 0,
        display: localization[key]
      };
    });
  }
}

export class SvgBarplot extends React.Component {
  componentDidMount() {
    this.height = 400;
    this.width = 600;
    this.barWidth = 50;
    this.barMargin = 5;
    this.minimalBarHeight = 10;
    this.barCount = Object.keys(this.props.classifier).length;
    this.paddingLeft = (this.width - (this.barWidth * this.barCount) - (this.barMargin * (this.barCount - 1))) / 2;
    this.paddingTop = 100;

    console.log(this);

    this.root = d3
      .select('#svg-barplot')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('border', '1px solid red');

    this.updateChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data == this.props.data)
      return;
    this.updateChart();
  }

  updateChart() {
    const data = this.transformData();

    const scale = d3.scaleLinear()
      .domain([0, d3.max(data.map(e => e.value))])
      .range([this.minimalBarHeight, this.height - this.paddingTop]);

    const axisScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(e => e.value))])
      .range([this.height - this.paddingTop, this.minimalBarHeight]);

    const getHeight = (e) => scale(e.value);
    const getX = (index) => this.paddingLeft + index * (this.barWidth + this.barMargin);

    const axis = d3.axisLeft(axisScale);
    const updatedRects = this.root.selectAll('.bar').data(data, e => e.key);
    const newRects = updatedRects.enter();

    newRects
      .append('g')
      .attr('class', 'bar')
      .attr("transform", (_, i) => `translate(${getX(i)}, 0)`)
      .attr('width', this.barWidth + this.barMargin)
      .attr('height', this.height)
      .append('rect')
      .attr('fill', 'steelblue')
      .attr('width', this.barWidth)
      .attr('height', e => getHeight(e))
      .attr('y', e => this.height - getHeight(e));

    updatedRects
      .transition()
      .duration(1000)
      .select('rect')
      .attr('fill', 'steelblue')
      .attr('width', this.barWidth)
      .attr('height', e => getHeight(e))
      .attr('y', e => this.height - getHeight(e));

    this.root.selectAll('.axis').remove();

    this.root
      .append('g')
      .attr('transform', `translate(${this.paddingLeft - 20}, ${this.paddingTop - this.minimalBarHeight})`)
      .attr('class', 'axis')
      .call(axis);
  }

  transformData() {
    const data = this.props.data
      .reduce((acc, curr) => acc.concat(curr.payments), []);
    const classifier = this.props.classifier;
    const localization = this.props.localization;

    const grouped = d3
      .nest()
      .key(e => e.type)
      .rollup(v => v.length)
      .object(data);

    return Object.keys(classifier).map((key, index) => {
      return {
        key: classifier[key],
        value: grouped[classifier[key]] || 0,
        display: localization[classifier[key]]
      };
    });
  }

  render() {
    return <svg id="svg-barplot" style={{ padding: '1rem' }}></svg>
  }
}


{/* <SimpleChart data={data} classifier={ReservationPayment} localization={EnumLocalization['ReservationPayment']} />
<SvgBarplot data={data} classifier={ReservationPayment} localization={EnumLocalization['ReservationPayment']} /> */}

export default SimpleChart;