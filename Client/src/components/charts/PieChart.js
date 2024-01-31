import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = (props) => {
  const { leadData } = props;
  let activeLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "active")?.length : 0;
  let pendingLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "pending")?.length : 0;
  let soldLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "sold")?.length : 0;

  const chartState = {
    series: [activeLength, pendingLength, soldLength],
    options: {
      labels: ['Active', 'Pending', 'Sold'],
      legend: {
        formatter: function (val, opts) {
          const seriesIndex = opts.seriesIndex;
          return chartState.options.labels[seriesIndex]
        },
        position: 'bottom'
      },
      chart: {
        type: 'donut',
      },
      dataLabels: {
        enabled: true
      },
      colors: ["#02B574", "#ECC94B", "#ff5959"],
      fill: {
        type: 'gradient',
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
      }],
      height: 100,
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartState.options} series={chartState.series} type="donut" width={350} />
      </div>
    </div>
  );
};

export default ApexChart;
