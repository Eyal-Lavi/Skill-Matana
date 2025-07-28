import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/AuthSlices';
import metaDataSlice from './metaData/MetaDataSlices';
import searchSlice from './search/SearchSlice';

const store = configureStore({
    reducer: {
        metaData: metaDataSlice.reducer,
        auth: authSlice.reducer,
        search: searchSlice.reducer,
    }
});

export default store;