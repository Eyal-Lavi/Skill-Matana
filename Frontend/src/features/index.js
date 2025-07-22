import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/AuthSlices';
import metaDataSlice from './metaData/MetaDataSlices';

const store = configureStore({
    reducer: {
        metaData: metaDataSlice.reducer,
        auth: authSlice.reducer,
    }
});

export default store;