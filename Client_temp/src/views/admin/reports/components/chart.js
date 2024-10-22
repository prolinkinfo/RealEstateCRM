import { Grid } from '@chakra-ui/react';
import Card from "components/card/Card";
import { useState } from 'react';
import ReactApexChart from "react-apexcharts";
import 'react-datepicker/dist/react-datepicker.css';


const ReportChart = (props) => {
    const [Chartseries, setChartSeries] = useState([44, 55, 13, 33]);

    const options = {
        chart: {
            width: 380,
            type: "donut",
        },
        dataLabels: {
            enabled: false,
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
        legend: {
            position: "bottom",
        },
    };
    return (
        <Card>
            <Grid py={5}>
                <div >
                    <ReactApexChart
                        options={options}
                        series={Chartseries}
                        type="donut"
                        width={450}
                    />
                </div>
            </Grid>
        </Card>
    )
}

export default ReportChart
