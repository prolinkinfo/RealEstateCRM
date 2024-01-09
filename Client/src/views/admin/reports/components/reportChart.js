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
    const [reportChart, setReportChart] = useState({})
    const [startDate, setStartDate] = useState(new Date(new Date() - 14 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());
    const [select, setSelect] = useState('all');
    const [selection, setSelection] = useState('day');

    const user = JSON.parse(localStorage.getItem("user"))


    const featchChart = async () => {
        const data = {
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            filter: selection
        }
        let result = await postApi(user.role === 'superAdmin' ? 'api/reporting/index' : `api/reporting/index?sender=${user._id}`, data);
        if (result && result.status === 200) {
            setReportChart(result?.data)
        }
    }

    const options = {
        chart: {
            id: 'line-chart',
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            title: {
                text: 'Count',
            },
        },
        dataLabels: {
            enabled: true,
        }
    };


    const series = Object.keys(reportChart).map((key) => {
        const dataSet = reportChart[key][0];

        let seriesData = [];

        if (dataSet?.Emails) {
            seriesData = seriesData.concat(
                dataSet.Emails.map((item) => ({ x: item.date, y: item.Emailcount }))
            );
        }
        if (dataSet?.Calls) {
            seriesData = seriesData.concat(
                dataSet.Calls.map((item) => ({ x: item.date, y: item.Callcount }))
            );
        }
        if (dataSet?.TextMsges) {
            seriesData = seriesData.concat(
                dataSet.TextMsges.map((item) => ({ x: item.date, y: item.TextSentCount }))
            );
        }

        return {
            name: key,
            data: seriesData,
        };

    });


    useEffect(() => {
        featchChart()
    }, [startDate, endDate, selection])


    const selectedSeries = select === 'all' ? series : series.filter(series => series.name === select);
    return (
        <Card>
            {!dashboard &&
                <Box display='flex' alignItems='center' flexWrap={'wrap'} justifyContent='space-between' mb={4}>
                    <Select value={select} onChange={(e) => setSelect(e.target.value)} width={{ base: '100%', md: '15%' }} mb={{ base: 3, md: 'auto' }}>
                        <option value='EmailDetails'>Email</option>
                        <option value='outboundcall'>Call</option>
                        {/* <option value='TextSent'>TextSent</option> */}
                        <option value='all'>all</option>
                    </Select>
                    <Box width={{ base: '100%', md: 'auto' }} flexWrap={'wrap'} justifyContent={'left'} mb={{ base: 3, md: 'auto' }} display='flex'>
                        <ReactDatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        <ReactDatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    </Box>
                    <Box width={{ base: '100%', md: 'auto' }} display={'flex'} justifyContent={'right'} mb={{ base: 3, md: 'auto' }}>
                        <RadioGroup onChange={(e) => setSelection(e)} value={selection}>
                            <Stack direction='row'>
                                <Radio value='day' >Daily</Radio>
                                <Radio value='week'>Weekly</Radio>
                                {/* <Radio value='Monthly' onClick={() => updateData('Monthly')}>Monthly</Radio> */}
                            </Stack>
                        </RadioGroup>
                    </Box>
                </Box>
            }
            <div id="chart">
                <div id="chart-timeline">
                    {selectedSeries && (
                        <ReactApexChart
                            options={options}
                            series={selectedSeries}
                            // type='bar'
                            // type='line'
                            type='area'
                            height={350}
                        />
                    )}
                </div>
            </div>



        </Card>
    )
}

export default ReportChart
