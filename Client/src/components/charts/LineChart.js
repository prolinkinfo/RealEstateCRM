import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getApi } from "services/api";

const ApexChart = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  const [chartData, setChartData] = useState([])

  const featchChart = async () => {
    // let result = await getApi('api/reporting/line-chart');
    let result = await getApi(user.role === 'superAdmin' ? 'api/reporting/line-chart' : `api/reporting/line-chart?createBy=${user._id}`);
    if (result && result.status === 200) {
      setChartData(result?.data)
    }
  }
  useEffect(() => {
    featchChart()
  }, [])

  const state = {
    series: [
      {
        name: 'Data',
        data: chartData?.map((item) => item.length)
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
        categories: chartData?.map((item) => item.name),
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
      <ReactApexChart options={state.options} series={state.series} type="bar" height={300} />
    </div>
  );
};

export default ApexChart;


