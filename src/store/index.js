import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import auth from "./auth";
import task from './task';

export const store = configureStore({
    reducer:{
        auth,
        task
    },
    middleware:(defaultMiddleWare)=>{
        return defaultMiddleWare({
            serializableCheck:{
                ignoreActions:['persist/PERSIST','persist/REHYDRED'],
                ignorePaths:['register']
            }
        })
    }
})

export const persistor = persistStore(store)