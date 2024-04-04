import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
    searchValue: {},
    getTagValues: [],
    searchResult: []
};

const advanceSearchSlice = createSlice({
    name: 'advanceSearchValue',
    initialState,
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
        setGetTagValues(state, action) {
            console.log("action.payload", action.payload)
            state.getTagValues = action.payload;
        },
        getSearchData(state, action) {
            switch (action.payload.type) {
                case 'Tasks':
                    state.searchResult = action.payload.allData?.filter(item => {
                        return ((!action.payload.values?.title || (item?.title && item?.title.toLowerCase().includes(action.payload.values?.title?.toLowerCase()))) &&
                            (!action.payload.values.status || (item?.status && item?.status.toLowerCase().includes(action.payload.values.status?.toLowerCase()))) &&
                            (!action.payload.values?.category || (item?.category && item?.category.toLowerCase().includes(action.payload.values?.category?.toLowerCase()))) &&
                            (!action.payload.values?.start || (item?.start && item?.start.toLowerCase().includes(action.payload.values?.start?.toLowerCase()))) &&
                            (!action.payload.values?.end || (item?.end && item?.end.toString().includes(action.payload.values?.end))) &&
                            (!action.payload.values?.assignmentToName || (item?.assignmentToName && item?.assignmentToName.toLowerCase().includes(action.payload.values?.assignmentToName?.toLowerCase()))) &&
                            ([null, undefined, ''].includes(action.payload.values?.fromLeadScore) || [null, undefined, ''].includes(action.payload.values?.toLeadScore) ||
                                ((item?.leadScore || item?.leadScore === 0) &&
                                    (parseInt(item?.leadScore, 10) >= parseInt(action.payload.values.fromLeadScore, 10) || 0) &&
                                    (parseInt(item?.leadScore, 10) <= parseInt(action.payload.values.toLeadScore, 10) || 0)))
                        );
                    });
                    break;
                case 'Meeting':
                    state.searchResult = action.payload.allData?.filter(
                        (item) => {
                            const itemDate = new Date(item.dateTime);
                            const momentDate = moment(itemDate).format('YYYY-MM-DD');
                            const timeItemDate = new Date(item.timestamp);
                            const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');
                            return (
                                (!action?.payload?.agenda || (item?.agenda && item?.agenda.toLowerCase().includes(action?.payload?.agenda?.toLowerCase()))) &&
                                (!action?.payload?.createBy || (item?.createBy && item?.createBy.toLowerCase().includes(action?.payload?.createBy?.toLowerCase()))) &&
                                (!action?.payload?.startDate || (momentDate >= action?.payload.startDate)) &&
                                (!action?.payload?.endDate || (momentDate <= action?.payload.endDate)) &&
                                (!action?.payload.timeStartDate || (timeMomentDate >= action?.payload.timeStartDate)) &&
                                (!action?.payload.timeEndDate || (timeMomentDate <= action?.payload.timeEndDate)))
                        }
                    )
                    break;
                default:
                // state.count += 3;
            }
        },
    },
});

export const { setSearchValue, setGetTagValues, getSearchData } = advanceSearchSlice.actions;
export default advanceSearchSlice.reducer;
