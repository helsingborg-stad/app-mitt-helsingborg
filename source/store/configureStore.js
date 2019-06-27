import { createStore } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import reducers from "../reducers";

const config = {
    debug: __DEV__
};

const reducer = persistCombineReducers(config, reducers);
const middlewares = [];

// For setting upp debug middleware.
if (__DEV__) {
    middlewares.push(

    )
}

export default function configureStore() {
    const store = createStore(
        reducer,
    );

    const persistor = persistStore(store);

    return {
        store,
        persistor,
    };
}
