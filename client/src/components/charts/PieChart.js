import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = (props) => {
  const { leadData } = props;

  let activeLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "active")?.length : 0;
  let pendingLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "pending")?.length : 0;
  let soldLength = leadData && leadData.length > 0 ? leadData?.filter(lead => lead?.leadStatus === "sold")?.length : 0;

  const series = [activeLength, pendingLength, soldLength];
  const scaledSeries = series?.map(value => {
    if (leadData?.length === 0) {
        return NaN;
    } else {
        return value === 0 ? NaN : ((value * 100) / leadData?.length);
    }
});


  const options = {
    chart: {
      type: 'radialBar',
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
            color: '#1F7EEB',
            formatter: function () {
              return leadData?.length || 0;
            }
          },
          value: {
            show: true,
            formatter: function (val) {
              return (val / 100 * leadData.length).toFixed(0);
            }
          }
        },
        track: {
          show: true,
        },
        startAngle: -180,
        endAngle: 180,
        hover: {
          size: undefined,
          sizeOffset: 3,
          colors: ["#ff5959", "#ECC94B", "#01B574"], // Add hover effect colors
        }
      },
    },
    stroke: {
      lineCap: 'round'
    },
    colors: ["#25BE87", "#ECC94B", "#ff5959"],
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
