import { Box, Grid, Radio, RadioGroup, Select, Stack } from '@chakra-ui/react';
import Card from "components/card/Card";
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { postApi } from "services/api";


const ReportChart = (props) => {
    const { dashboard } = props;
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
        </Card >
    )
}

export default ReportChart
