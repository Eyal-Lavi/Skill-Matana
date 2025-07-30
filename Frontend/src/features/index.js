import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/AuthSlices';
import metaDataSlice from './metaData/MetaDataSlices';
import searchSlice from './search/SearchSlice';
import adminSlice from './admin/AdminSlice';

const store = configureStore({
    reducer: {
        metaData: metaDataSlice.reducer,
        auth: authSlice.reducer,
        search: searchSlice.reducer,
        admin: adminSlice.reducer,
    }
});

export default store;