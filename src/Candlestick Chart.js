import React, { Component } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CandlestickChart extends Component {
  render() {
    const options = {
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: `${this.props.stock} Stock Price`,
      },
      axisX: {
        valueFormatString: "MMM-DD-YYYY",
      },
      axisY: {
        includeZero: false,
        prefix: "$",
        title: "Price (in USD)",
      },
      data: [
        {
          type: "candlestick",
          showInLegend: true,
          name: this.props.stock,
          yValueFormatString: "$###0.00",
          xValueFormatString: "MMMM DD",
          dataPoints: this.props.dataPoints,
        },
      ],
    };

    return (
      <div>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default CandlestickChart;
