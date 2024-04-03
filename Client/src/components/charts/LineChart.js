import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { HasAccess } from "../../redux/accessUtils";

const ApexChart = (props) => {
  const { data } = props;

  let permissions = []
  let permissionsLength = []

  data?.forEach(item => {
    if (item.name) {
      permissions.push(item.name);
      permissionsLength.push(item.length);
    }
  });

  const state = {
    series: [
      {
        name: 'Data',
        data: permissionsLength?.map((item) => item)
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
          columnWidth: '40%',
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
        categories: permissions?.map((item) => item),
        tickPlacement: 'on'
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
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
      <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
    </div>
  );
};

export default ApexChart;


