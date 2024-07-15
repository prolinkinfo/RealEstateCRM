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
                            (!action.payload.values?.assignToName || (item?.assignToName && item?.assignToName.toLowerCase().includes(action.payload.values?.assignToName?.toLowerCase()))) &&
                            ([null, undefined, ''].includes(action.payload.values?.fromLeadScore) || [null, undefined, ''].includes(action.payload.values?.toLeadScore) ||
                                ((item?.leadScore || item?.leadScore === 0) &&
                                    (parseInt(item?.leadScore, 10) >= parseInt(action.payload.values.fromLeadScore, 10) || 0) &&
                                    (parseInt(item?.leadScore, 10) <= parseInt(action.payload.values.toLeadScore, 10) || 0)))
                        );
                    });
                    break;
                case 'TasksSearch':
                    state.searchResult = action.payload.searchData;
                    break;
                case 'Meeting':
                    state.searchResult = action.payload.allData?.filter(
                        (item) => {
                            const itemDate = new Date(item.dateTime);
                            const momentDate = moment(itemDate).format('YYYY-MM-DD');
                            const timeItemDate = new Date(item.timestamp);
                            const timeMomentDate = moment(timeItemDate).format('YYYY-MM-DD');
                            return (
                                (!action?.payload?.values?.agenda || (item?.agenda && item?.agenda.toLowerCase().includes(action?.payload?.values?.agenda?.toLowerCase()))) &&
                                (!action?.payload?.values?.createBy || (item?.createBy && item?.createBy.toLowerCase().includes(action?.payload?.values?.createBy?.toLowerCase()))) &&
                                (!action?.payload?.values?.startDate || (momentDate >= action?.payload?.values?.startDate)) &&
                                (!action?.payload?.values?.endDate || (momentDate <= action?.payload?.values?.endDate)) &&
                                (!action?.payload?.values?.timeStartDate || (timeMomentDate >= action?.payload?.values?.timeStartDate)) &&
                                (!action?.payload?.values?.timeEndDate || (timeMomentDate <= action?.payload?.values?.timeEndDate)))
                        }
                    )
                    break;
                case 'MeetingSearch':
                    state.searchResult = action.payload.searchData;
                    break;
                case 'Calls':
                    state.searchResult = action.payload.allData?.filter(
                        (item) =>
                            (!action.payload.values?.senderName || (item?.senderName && item?.senderName.toLowerCase().includes(action.payload.values?.senderName?.toLowerCase()))) &&
                            (!action.payload.values?.realetedTo || (action.payload.values.realetedTo === "contact" ? item.createBy : item.createByLead)) &&
                            (!action.payload.values?.createByName || (item?.createByName && item?.createByName.toLowerCase().includes(action.payload.values?.createByName?.toLowerCase())))
                    )
                    break;
                case 'CallsSearch':
                    state.searchResult = action.payload.searchData;
                    break;
                case 'Leads':
                    state.searchResult = action.payload.allData?.filter(
                        (item) =>
                            (!action.payload.values?.leadStatus || (item?.leadStatus && item?.leadStatus.toLowerCase().includes(action.payload.values?.leadStatus?.toLowerCase())))
                    )
                    break;
                case 'Email':
                    state.searchResult = action.payload.allData?.filter(
                        (item) =>
                            (!action.payload.values?.senderName || (item?.senderName && item?.senderName.toLowerCase().includes(action.payload.values?.senderName?.toLowerCase()))) &&
                            (!action.payload.values?.realetedTo || (action.payload.values.realetedTo === "contact" ? item.createBy : item.createByLead)) &&
                            (!action.payload.values?.createByName || (item?.createByName && item?.createByName.toLowerCase().includes(action.payload.values?.createByName?.toLowerCase())))
                    )
                    break;
                case 'EmailSearch':
                    state.searchResult = action.payload.searchData;
                    break;
                case 'Users':
                    state.searchResult = action?.payload?.allData?.filter(
                        (item) =>
                            (!action.payload?.values?.firstName || (item?.firstName && item?.firstName.toLowerCase().includes(action.payload?.values?.firstName?.toLowerCase()))) &&
                            (!action.payload?.values?.username || (item?.username && item?.username.toLowerCase().includes(action.payload?.values?.username?.toLowerCase()))) &&
                            (!action.payload?.values?.lastName || (item?.lastName && item?.lastName.toLowerCase().includes(action.payload?.values?.lastName?.toLowerCase())))
                    )
                    break;
                case 'UsersSearch':
                    state.searchResult = action.payload.searchData;
                    break;
                case 'Opprtunity':
                    state.searchResult = action?.payload?.allData?.filter(
                        (item) =>
                            (!action.payload?.values?.opportunityName || (item?.opportunityName && item?.opportunityName.toLowerCase().includes(action.payload?.values?.opportunityName?.toLowerCase()))) &&
                            (!action.payload?.values?.accountName || (item?.accountName && item?.accountName.toLowerCase().includes(action.payload?.values?.accountName?.toLowerCase()))) &&
                            (!action.payload?.values?.opportunityAmount || (item?.opportunityAmount && item?.opportunityAmount.toLowerCase().includes(action.payload?.values?.opportunityAmount?.toLowerCase()))) &&
                            (!action.payload?.values?.expectedCloseDate || (item?.expectedCloseDate && item?.expectedCloseDate.toLowerCase().includes(action.payload?.values?.expectedCloseDate?.toLowerCase()))) &&
                            (!action.payload?.values?.salesStage || (item?.salesStage && item?.salesStage.toLowerCase().includes(action.payload?.values?.salesStage?.toLowerCase())))
                    )
                    break;
                case 'OpprtunitySearch':
                    state.searchResult = action.payload.searchData;
                    break;
                case 'Account':
                    state.searchResult = action?.payload?.allData?.filter(
                        (item) =>
                            (!action.payload?.values?.name || (item?.name && item?.name.toLowerCase().includes(action.payload?.values?.name?.toLowerCase()))) &&
                            (!action.payload?.values?.officePhone || (item?.officePhone && item?.officePhone.toString().toLowerCase().includes(action.payload?.values?.officePhone?.toString().toLowerCase()))) &&
                            (!action.payload?.values?.fax || (item?.fax && item?.fax.toString().toLowerCase().includes(action.payload?.values?.fax?.toString().toLowerCase()))) &&
                            (!action.payload?.values?.emailAddress || (item?.emailAddress && item?.emailAddress.toLowerCase().includes(action.payload?.values?.emailAddress?.toLowerCase())))
                    )
                case 'AccountSearch':
                    state.searchResult = action.payload.searchData;
                default:
                // state.count += 3;
            }
        },
    },
});

export const { setSearchValue, setGetTagValues, getSearchData } = advanceSearchSlice.actions;
export default advanceSearchSlice.reducer;