import { configureStore } from '@reduxjs/toolkit'
import healthReducer from "./Slices/routeslice";



const store = configureStore({
  reducer: {
     health: healthReducer,
     Health: healthReducer,
  }
})


export default store;