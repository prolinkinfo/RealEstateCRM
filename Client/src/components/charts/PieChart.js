// import React from "react";
// import ReactApexChart from "react-apexcharts";

// class PieChart extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       chartData: [],
//       chartOptions: {},
//     };
//   }

//   componentDidMount() {
//     this.setState({
//       chartData: this.props.chartData,
//       chartOptions: this.props.chartOptions,
//     });
//   }

//   render() {
//     return (
//       <ReactApexChart
//         options={this.state.chartOptions}
//         series={this.state.chartData}
//         type='pie'
//         width='100%'
//         height='55%'
//       />
//     );
//   }
// }

// export default PieChart;


import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  const [chartState, setChartState] = React.useState({
    series: [44, 41, 17],
    chartOptions: {
      labels: ['Apple', 'Mango', 'Orange']
    },
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#ff5959", "#ECC94B", "#02B574"],
      fill: {
        type: 'gradient',
      },
      legend: {
        position: 'bottom'
      },

      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartState.options} series={chartState.series} type="donut" width={380} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
