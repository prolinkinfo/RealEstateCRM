import { Box, Grid, Radio, RadioGroup, Select, Stack } from '@chakra-ui/react';
import Card from "components/card/Card";
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { postApi } from "services/api";


const ReportChart = (props) => {
    const { dashboard } = props;
    const [reportChart, setReportChart] = useState({})
    const [startDate, setStartDate] = useState(new Date(new Date() - 14 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());
    const [select, setSelect] = useState('all');
    const [selection, setSelection] = useState('day');
    const modules = useSelector((state) => state?.modules?.data)
    const user = JSON.parse(localStorage.getItem("user"))
    const isEmailsActive = modules?.find((item) => item?.moduleName === "Emails");
    const isCallsActive = modules?.find((item) => item?.moduleName === "Calls");
    const featchChart = async () => {
        const data = {
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            filter: selection
        }
        let result = await postApi(user.role === 'superAdmin' ? 'api/reporting/index' : `api/reporting/index?sender=${user._id}`, data);
        if (result.status === 200) {
            setReportChart(result?.data);
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

        if (dataSet?.Emails && isEmailsActive?.isActive) {
            seriesData = seriesData.concat(
                dataSet?.Emails?.map((item) => ({ x: item?.date, y: item?.Emailcount }))
            );
        }
        if (dataSet?.Calls && isCallsActive?.isActive) {
            seriesData = seriesData.concat(
                dataSet?.Calls?.map((item) => ({ x: item?.date, y: item?.Callcount }))
            );
        }

        return {
            name: (key === "Email" && isEmailsActive?.isActive) ? "Emails" : (key === "Call" && isCallsActive?.isActive) ? "Call" : ((key === "Email" && isEmailsActive?.isActive) && (key === "Call" && isCallsActive?.isActive) ? key : ""),
            data: seriesData,
        };

    });

    useEffect(() => {
        featchChart()
    }, [startDate, endDate, selection])


    const selectedSeries = select === 'all' ? series?.filter(series => series?.name !== "") : series?.filter(series => series?.name === select);

    return (
        <Card>
            {!dashboard &&
                <Box display='flex' alignItems='center' flexWrap={'wrap'} justifyContent='space-between' mb={4}>
                    <Select value={select} onChange={(e) => setSelect(e.target.value)} size='sm' width={{ base: '100%', md: '15%' }} mb={{ base: 3, md: 'auto' }}>
                        <option value='all'>All</option>
                        <option value='EmailDetails'>Email</option>
                        <option value='outboundcall'>Call</option>
                    </Select>
                    <Box width={{ base: '100%', md: 'auto' }} flexWrap={'wrap'} justifyContent={'left'} mb={{ base: 3, md: 'auto' }} display='flex'>
                        <ReactDatePicker selected={startDate} onChange={(date) => setStartDate(date)} className='datePickerBorder' />
                        <ReactDatePicker selected={endDate} onChange={(date) => setEndDate(date)} className='datePickerBorder' />
                    </Box>
                    <Box width={{ base: '100%', md: 'auto' }} display={'flex'} justifyContent={'right'} mb={{ base: 3, md: 'auto' }}>
                        <RadioGroup onChange={(e) => setSelection(e)} value={selection}>
                            <Stack direction='row'>
                                <Radio value='day' >Daily</Radio>
                                <Radio value='week'>Weekly</Radio>
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
                            type='area'
                            height={300}
                        />
                    )}
                </div>
            </div>



        </Card>
    )
}

export default ReportChart
