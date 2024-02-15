import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = (props) => {
  const { leadData } = props;

  let activeLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "active")?.length : 0;
  let pendingLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "pending")?.length : 0;
  let soldLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "sold")?.length : 0;

  const series = [activeLength, pendingLength, soldLength];
  const scaledSeries = series.map(value => (value * 100) / leadData?.length);



  const options = {
    chart: {
      type: 'radialBar',
      // height: 350,
      width: 330,
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
              return leadData?.length || 0;
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
          show: true,
        },
        startAngle: -180,
        endAngle: 180
      },
    },
    stroke: {
      lineCap: 'round'
    },
    colors: ["#01B574", "#ECC94B", "#ff5959"],
    labels: ['Active', 'Pending', 'Sold'],
    legend: {
      show: true,
      floating: true,
      position: 'bottom',

    },
  }

  return (
    <div>
      <ReactApexChart key={leadData?.length} options={options} series={scaledSeries} type="radialBar" height={320} />
    </div>
  );
};

export default ApexChart;
