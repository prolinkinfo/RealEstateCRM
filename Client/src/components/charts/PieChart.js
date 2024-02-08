import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = (props) => {
  const { leadData } = props;
  let activeLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "active")?.length : 0;
  let pendingLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "pending")?.length : 0;
  let soldLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "sold")?.length : 0;

  const series = [activeLength, pendingLength, soldLength];
  const scaledSeries = series.map(value => (value * 100) / leadData.length);

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


  const options4 = {
    chart: {
      type: 'radialBar',
      height: 350,
      width: 380,
    },
    plotOptions: {
      radialBar: {
        size: undefined,
        inverseOrder: true,
        hollow: {
          margin: 40,
          size: '48%',
          background: 'transparent',

        },
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return leadData.length || 0;
            }
          },
          value: {
            show: true,
            formatter: function (val) {
              return (+val)?.toFixed(1);
            }
          }
        },
        track: {
          show: false,
        },
        startAngle: -180,
        endAngle: 180
      },
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Active', 'Pending', 'Sold'],
    legend: {
      show: true,
      floating: true,
      position: 'right',
      offsetX: 10,
      offsetY: 215
    },
  }

  console.log(scaledSeries)
  return (
    <div>
      <ReactApexChart options={chartState.options} series={chartState.series} type="donut" width={350} />
      <ReactApexChart options={options4} series={scaledSeries} type="radialBar" height={350} />
    </div>
  );
};

export default ApexChart;
