import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  const state = {
    series: [
      {
        name: 'Data',
        data: [14, 35, 41, 40, 22, 33, 11, 5]
      }
    ],
    options: {

      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '50%',
        }
      },
      stroke: {
        width: 2
      },
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: ['Leads', 'Contact', 'Property', 'Task', 'Meeting', 'Email',
          'Call', 'Report'],
        tickPlacement: 'on'
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
      }
    },
  };

  return (
    <div id="chart">
      <ReactApexChart options={state.options} series={state.series} type="bar" height={300} />
    </div>
  );
};

export default ApexChart;


